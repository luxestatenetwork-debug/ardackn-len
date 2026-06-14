import { useState, useEffect } from 'react';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';

/**
 * Hook to fetch investor data (profile, favorites, saved searches) for a given user UID.
 * Returns { data, loading, error } where data = { profile, favorites, savedSearches }.
 */
export const useInvestorData = (uid) => {
  const [data, setData] = useState({ profile: null, favorites: [], savedSearches: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!uid) {
      setLoading(false);
      return;
    }
    const fetchData = async () => {
      try {
        // Profile document
        const userSnap = await getDoc(doc(db, 'users', uid));
        const profile = userSnap.exists() ? userSnap.data() : null;

        // Favorites sub‑collection
        const favSnap = await getDocs(collection(db, `users/${uid}/favorites`));
        const favorites = favSnap.docs.map(d => d.data());

        // Saved searches sub‑collection
        const searchSnap = await getDocs(collection(db, `users/${uid}/savedSearches`));
        const savedSearches = searchSnap.docs.map(d => d.data());

        setData({ profile, favorites, savedSearches });
      } catch (e) {
        console.error('Error loading investor data:', e);
        setError(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [uid]);

  return { data, loading, error };
};
