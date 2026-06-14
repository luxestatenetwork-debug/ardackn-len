import { create } from 'zustand';
import { auth, db, storage } from '../lib/firebase';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  signOut,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
  deleteUser
} from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot, deleteDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { compressImage } from '../lib/imageUtils';

export const useAuthStore = create((set, get) => {
  let unsubscribeUserDoc = null;

  return {
    user: null, // Firebase user instance
    profile: null, // Custom fields from Firestore (role, slots, etc.)
    loading: true,
    error: null,

    // Initialize Auth listener
    initAuth: () => {
      set({ loading: true });
      const unsubAuth = onAuthStateChanged(auth, async (firebaseUser) => {
        if (unsubscribeUserDoc) {
          unsubscribeUserDoc();
          unsubscribeUserDoc = null;
        }

        if (firebaseUser) {
          // Bootstrap admin account
          const ADMIN_EMAIL = 'luxestatenetwork@gmail.com';
          const userDocRef = doc(db, 'users', firebaseUser.uid);

          // Ensure admin role is set for the admin email
          if (firebaseUser.email === ADMIN_EMAIL) {
            try {
              const snap = await getDoc(userDocRef);
              const data = snap.exists() ? snap.data() : {};
              if (data.role !== 'admin') {
                await setDoc(userDocRef, { role: 'admin' }, { merge: true });
              }
              // Update lastLogin
              await updateDoc(userDocRef, { lastLogin: new Date().toISOString() }).catch(() => {});
            } catch (e) {
              console.warn('Admin bootstrap error:', e);
            }
          } else {
            // Update lastLogin for regular users too
            try {
              await updateDoc(userDocRef, { lastLogin: new Date().toISOString() });
            } catch (e) { /* may not exist yet */ }
          }

          // Initialize Platinum package if not exists
          try {
            const pkgRef = doc(db, 'packages', 'premium_pkg');
            getDoc(pkgRef).then((pkgSnap) => {
              if (!pkgSnap.exists()) {
                setDoc(pkgRef, {
                  name: 'Platinum Listing Package',
                  price: 499,
                  slots: 5,
                  currency: 'USD',
                  description: 'Platinum membership package with 5 listing slots.'
                });
              }
            });
          } catch (pkgErr) {
            console.warn('Failed to initialize package:', pkgErr);
          }

          // Listen to changes in user profile document in Firestore
          unsubscribeUserDoc = onSnapshot(userDocRef, (docSnap) => {
            if (docSnap.exists()) {
              set({ 
                user: firebaseUser, 
                profile: docSnap.data(), 
                loading: false 
              });
            } else {
              // Create profile if doesn't exist
              const initialProfile = {
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                displayName: firebaseUser.displayName || 'Investor',
                role: 'investor', // default role
                premium: false,
                isPremium: false,
                slots_purchased: 0,
                slots_used: 0,
                createdAt: new Date().toISOString()
              };
              setDoc(userDocRef, initialProfile);
              set({ 
                user: firebaseUser, 
                profile: initialProfile, 
                loading: false 
              });
            }
          }, (err) => {
            console.error("Firestore user sync error:", err);
            set({ error: err.message, loading: false });
          });
        } else {
          set({ user: null, profile: null, loading: false });
        }
      });
      return () => {
        unsubAuth();
        if (unsubscribeUserDoc) unsubscribeUserDoc();
      };
    },

    // Login with Email/Password
    login: async (email, password) => {
      set({ loading: true, error: null });
      try {
        await signInWithEmailAndPassword(auth, email, password);
      } catch (err) {
        set({ error: err.message, loading: false });
        throw err;
      }
    },

    // Register User
    register: async (email, password, displayName, role = 'investor', photoFile) => {
      set({ loading: true, error: null });
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const firebaseUser = userCredential.user;
        console.log('✅ Firebase Auth kaydı oluşturuldu, UID:', firebaseUser.uid);
        
        // Write the initial profile to Firestore immediately to prevent onAuthStateChanged from writing fallback
        const initialProfile = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName,
          role,
          photoURL: '',
          premium: false,
          isPremium: false,
          slots_purchased: 0,
          slots_used: 0,
          createdAt: new Date().toISOString()
        };
        await setDoc(doc(db, 'users', firebaseUser.uid), initialProfile);
        console.log('✅ Kullanıcı ilk Firestore kaydı oluşturuldu, UID:', firebaseUser.uid);

        let photoURL = '';
        if (photoFile) {
          try {
            console.log('📸 Sıkıştırma ve Base64 dönüşümü başlatılıyor...');
            photoURL = await compressImage(photoFile, 200, 200, 0.8);
            
            // Update the profile with photo URL
            await setDoc(doc(db, 'users', firebaseUser.uid), { photoURL }, { merge: true });
          } catch (storageErr) {
            console.error('❌ Profile photo base64 conversion failed:', storageErr);
          }
        }

        await updateProfile(firebaseUser, { displayName });
        await sendEmailVerification(firebaseUser).catch(e => console.warn('Verification email send error:', e));
        console.log('✅ Kayıt işlemi başarıyla tamamlandı, UID:', firebaseUser.uid);
      } catch (err) {
        console.error('❌ Kayıt hatası:', err);
        set({ error: err.message, loading: false });
        throw err;
      }
    },

    // Update Profile Info
    updateProfileInfo: async (displayName, photoFile, additionalFields = {}) => {
      set({ error: null });
      try {
        const firebaseUser = auth.currentUser;
        if (!firebaseUser) throw new Error("No user logged in");
        
        let photoURL = firebaseUser.photoURL || get().profile?.photoURL || '';
        
        if (photoFile) {
          try {
            console.log('📸 Sıkıştırma ve Base64 dönüşümü başlatılıyor...');
            photoURL = await compressImage(photoFile, 200, 200, 0.8);
            console.log('✅ Base64 conversion successful');
          } catch (storageErr) {
            console.error('❌ Base64 conversion error:', storageErr);
            set({ error: `Fotoğraf güncellenemedi: ${storageErr.message}` });
            // Sadece displayName ve ek alanları güncelle
            await updateProfile(firebaseUser, { displayName });
            await setDoc(doc(db, 'users', firebaseUser.uid), { displayName, ...additionalFields }, { merge: true });
            throw storageErr;
          }
        }
        
        // Auth profile güncelle (Firebase Auth limitleri nedeniyle base64 buraya yazılmaz)
        await updateProfile(firebaseUser, { displayName });
        
        // Firestore dökümanını güncelle
        await setDoc(doc(db, 'users', firebaseUser.uid), {
          displayName,
          photoURL,
          ...additionalFields
        }, { merge: true });
        
        console.log('✅ Profile updated successfully');
        
      } catch (err) {
        console.error('❌ updateProfileInfo error:', err);
        set({ error: err.message });
        throw err;
      }
    },

    // Delete Account
    deleteAccount: async () => {
      set({ loading: true, error: null });
      try {
        const firebaseUser = auth.currentUser;
        if (!firebaseUser) throw new Error("No user logged in");
        
        // Try deleting avatar if exists
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          const userData = userDoc.exists() ? userDoc.data() : null;
          if (userData && userData.photoURL && !userData.photoURL.startsWith('data:')) {
            const storageRef = ref(storage, `avatars/${firebaseUser.uid}/profile_pic`);
            await deleteObject(storageRef);
          }
        } catch (e) {
          // ignore if it doesn't exist
        }
        
        // Delete Firestore document
        await deleteDoc(doc(db, 'users', firebaseUser.uid));
        
        // Unsubscribe listener
        if (unsubscribeUserDoc) {
          unsubscribeUserDoc();
          unsubscribeUserDoc = null;
        }
        
        // Delete User Auth
        await deleteUser(firebaseUser);
        
        set({ user: null, profile: null, loading: false });
      } catch (err) {
        set({ error: err.message, loading: false });
        throw err;
      }
    },

    // Sign out
    logout: async () => {
      set({ loading: true, error: null });
      try {
        if (unsubscribeUserDoc) unsubscribeUserDoc();
        await signOut(auth);
        set({ user: null, profile: null, loading: false });
      } catch (err) {
        set({ error: err.message, loading: false });
      }
    },

    // Clear error
    clearError: () => set({ error: null })
  };
});
