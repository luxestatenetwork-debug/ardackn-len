import { create } from 'zustand';
import { db, storage } from '../lib/firebase';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  getDocs, 
  doc, 
  getDoc,
  addDoc, 
  updateDoc, 
  deleteDoc,
  increment,
  runTransaction,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { compressImage, fileToBase64 } from '../lib/imageUtils';

export const useListingStore = create((set, get) => ({
  listings: [],
  featuredListings: [],
  filters: {
    category: '',
    priceMin: '',
    priceMax: '',
    location: '',
    search: '',
  },
  loading: false,
  error: null,

  setFilters: (newFilters) => {
    set((state) => ({ filters: { ...state.filters, ...newFilters } }));
  },

  resetFilters: () => {
    set({
      filters: {
        category: '',
        priceMin: '',
        priceMax: '',
        location: '',
        search: '',
      }
    });
  },

  // Fetch all active/published listings
  fetchListings: async () => {
    set({ loading: true, error: null });
    try {
      const q = query(
        collection(db, 'listings'),
        where('status', '==', 'active'),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const list = [];
      querySnapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });
      set({ listings: list, loading: false });
    } catch (err) {
      console.error("Fetch listings failed:", err);
      set({ error: err.message, loading: false });
    }
  },

  // Fetch featured listings
  fetchFeaturedListings: async () => {
    set({ loading: true, error: null });
    try {
      const q = query(
        collection(db, 'listings'),
        where('status', '==', 'active'),
        where('featured', '==', true),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const list = [];
      querySnapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });
      set({ featuredListings: list, loading: false });
    } catch (err) {
      console.error("Fetch featured listings failed:", err);
      set({ error: err.message, loading: false });
    }
  },

  // Manage user listing slots (Premium = 5 slots)
  updateSlots: async (userId, amount) => {
    const userRef = doc(db, 'users', userId);
    return await runTransaction(db, async (transaction) => {
      const userDoc = await transaction.get(userRef);
      if (!userDoc.exists()) throw new Error('User profile not found.');
      const userData = userDoc.data();
      
      const isPremium = userData.isPremium || userData.premium || false;
      const maxSlots = isPremium ? 5 : (userData.slots_purchased || 0);
      const currentUsed = userData.slots_used || 0;
      const newUsed = currentUsed + amount;

      if (amount > 0 && userData.role !== 'admin' && newUsed > maxSlots) {
        throw new Error('limit_reached');
      }

      transaction.update(userRef, {
        slots_used: Math.max(0, newUsed),
        slots_purchased: isPremium ? 5 : (userData.slots_purchased || 0)
      });
    });
  },

  // Favorites subcollection helpers
  addFavorite: async (userId, listing) => {
    try {
      const favRef = doc(db, `users/${userId}/favorites`, listing.id);
      await setDoc(favRef, {
        id: listing.id,
        title: listing.title || '',
        price: listing.price || 0,
        currency: listing.currency || 'USD',
        location: listing.location || '',
        coverImage: listing.coverImage || '',
        createdAt: new Date().toISOString()
      });
    } catch (err) {
      console.error('addFavorite failed:', err);
    }
  },

  removeFavorite: async (userId, listingId) => {
    try {
      const favRef = doc(db, `users/${userId}/favorites`, listingId);
      await deleteDoc(favRef);
    } catch (err) {
      console.error('removeFavorite failed:', err);
    }
  },

  // Add Listing — Admin: unlimited & direct write. Owner: slot-gated transaction.
  createListing: async (listingData, userId, imageFiles = [], pdfFile = null, coverImageFile = null, isAdminUser = false) => {
    set({ loading: true, error: null });
    try {
      const userRef = doc(db, 'users', userId);
      const listingsRef = collection(db, 'listings');
      const newDocRef = doc(listingsRef);
      const newListingId = newDocRef.id;

      // Non-admin: check slot limits BEFORE uploading (saves bandwidth on limit_reached)
      if (!isAdminUser) {
        const userDoc = await getDoc(userRef);
        if (!userDoc.exists()) throw new Error('User profile not found.');
        const userData = userDoc.data();
        const isPremium = userData.isPremium || userData.premium || false;
        const maxSlots = isPremium ? 5 : (userData.slots_purchased || 0);
        if (userData.role !== 'admin' && (userData.slots_used || 0) >= maxSlots) {
          throw new Error('limit_reached');
        }
      }

      // Convert and Compress Images to Base64
      let imageUrls = [];
      for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i];
        try {
          // Compress listing images to max 800x800 for size saving
          const base64Str = await compressImage(file, 800, 800, 0.7);
          imageUrls.push(base64Str);
        } catch (err) {
          console.error("Failed to compress listing image:", file.name, err);
        }
      }

      // Convert PDF to Base64 (limit size to 800KB to fit document limit)
      let pdfUrl = '';
      if (pdfFile) {
        if (pdfFile.size > 800 * 1024) {
          throw new Error('PDF dosyası çok büyük (Maksimum 800KB olmalıdır).');
        }
        pdfUrl = await fileToBase64(pdfFile);
      }

      // Convert and Compress Cover Image
      let coverImageUrl = '';
      if (coverImageFile) {
        try {
          coverImageUrl = await compressImage(coverImageFile, 800, 800, 0.7);
        } catch (err) {
          console.error("Failed to compress cover image:", err);
        }
      }

      const listingDoc = {
        ...listingData,
        images: imageUrls,
        coverImage: coverImageUrl,
        pdfUrl,
        ownerId: userId,
        status: 'active',
        views: 0,
        likes: 0,
        dislikes: 0,
        likedBy: [],
        dislikedBy: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (isAdminUser) {
        // ─── ADMIN PATH: direct write, no slot consumption ───────────
        await setDoc(newDocRef, listingDoc);
      } else {
        // ─── OWNER PATH: transactional write + slot increment ────────
        await get().updateSlots(userId, 1);
        await setDoc(newDocRef, listingDoc);
      }

      set({ loading: false });
      return newListingId;
    } catch (err) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  // Edit / Update Listing
  updateListing: async (listingId, updatedData) => {
    set({ loading: true, error: null });
    try {
      const docRef = doc(db, 'listings', listingId);
      await updateDoc(docRef, {
        ...updatedData,
        updatedAt: new Date().toISOString()
      });
      set({ loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  // Pause Listing
  pauseListing: async (listingId) => {
    set({ loading: true, error: null });
    try {
      const docRef = doc(db, 'listings', listingId);
      await updateDoc(docRef, {
        status: 'paused',
        updatedAt: new Date().toISOString()
      });
      set({ loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  // Fetch My Listings
  fetchMyListings: async (userId) => {
    set({ loading: true, error: null });
    try {
      const q = query(
        collection(db, 'listings'),
        where('ownerId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const list = [];
      querySnapshot.forEach((d) => {
        list.push({ id: d.id, ...d.data() });
      });
      return list;
    } catch (err) {
      console.error("Fetch my listings failed:", err);
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  // Delete Listing (Must free slot if deleted/released)
  deleteListing: async (listingId, userId) => {
    set({ loading: true, error: null });
    try {
      const userRef = doc(db, 'users', userId);
      const listingRef = doc(db, 'listings', listingId);

      // Fetch the listing to know its images/pdf URLs
      const listingSnap = await getDoc(listingRef);
      if (listingSnap.exists()) {
        const data = listingSnap.data();
        
        // Attempt to delete images
        if (data.images && data.images.length > 0) {
          for (const url of data.images) {
            if (url && !url.startsWith('data:')) {
              try {
                // Create a ref from URL
                const imageRef = ref(storage, url);
                await deleteObject(imageRef);
              } catch (e) {
                console.warn("Could not delete image:", e);
              }
            }
          }
        }

        // Attempt to delete PDF
        if (data.pdfUrl && !data.pdfUrl.startsWith('data:')) {
          try {
            const pdfRef = ref(storage, data.pdfUrl);
            await deleteObject(pdfRef);
          } catch (e) {
            console.warn("Could not delete PDF:", e);
          }
        }
      }

      await deleteDoc(listingRef);

      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.role !== 'admin' && (userData.slots_used || 0) > 0) {
          await get().updateSlots(userId, -1);
        }
      }
      set({ loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  // Like a listing (toggle) — only logged-in users
  likeListing: async (listingId, userId) => {
    if (!userId) throw new Error('not_authenticated');
    try {
      const docRef = doc(db, 'listings', listingId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return;
      }

      const data = docSnap.data();
      const likedBy = data.likedBy || [];
      const dislikedBy = data.dislikedBy || [];
      const hasLiked = likedBy.includes(userId);
      const hasDisliked = dislikedBy.includes(userId);

      if (hasLiked) {
        // Toggle off like
        await updateDoc(docRef, {
          likedBy: arrayRemove(userId),
          likes: increment(-1)
        });
        await get().removeFavorite(userId, listingId);
      } else {
        const updates = {
          likedBy: arrayUnion(userId),
          likes: increment(1)
        };
        // Remove dislike if present
        if (hasDisliked) {
          updates.dislikedBy = arrayRemove(userId);
          updates.dislikes = increment(-1);
        }
        await updateDoc(docRef, updates);
        await get().addFavorite(userId, { id: listingId, ...data });
      }
    } catch (err) {
      console.error('likeListing failed:', err);
      throw err;
    }
  },

  // Dislike a listing (toggle) — only logged-in users
  dislikeListing: async (listingId, userId) => {
    if (!userId) throw new Error('not_authenticated');
    try {
      const docRef = doc(db, 'listings', listingId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return;
      }

      const data = docSnap.data();
      const likedBy = data.likedBy || [];
      const dislikedBy = data.dislikedBy || [];
      const hasLiked = likedBy.includes(userId);
      const hasDisliked = dislikedBy.includes(userId);

      if (hasDisliked) {
        // Toggle off dislike
        await updateDoc(docRef, {
          dislikedBy: arrayRemove(userId),
          dislikes: increment(-1)
        });
      } else {
        const updates = {
          dislikedBy: arrayUnion(userId),
          dislikes: increment(1)
        };
        // Remove like if present
        if (hasLiked) {
          updates.likedBy = arrayRemove(userId);
          updates.likes = increment(-1);
        }
        await updateDoc(docRef, updates);
      }
    } catch (err) {
      console.error('dislikeListing failed:', err);
      throw err;
    }
  }
}));
