import { collection, addDoc, getDocs, deleteDoc, doc, query, orderBy } from "firebase/firestore";
import { db } from "../lib/firebase";

/**
 * Add a saved search for a user.
 * @param {string} uid - User UID.
 * @param {{ query: string, mapBounds: object, createdAt: any }} searchData - Required fields.
 */
export const addSavedSearch = async (uid, searchData) => {
  if (!uid) throw new Error("UID required");
  const colRef = collection(db, `users/${uid}/savedSearches`);
  const docRef = await addDoc(colRef, {
    ...searchData,
    createdAt: searchData.createdAt || new Date(),
  });
  return docRef.id;
};

/** Fetch all saved searches for a user, ordered by creation date descending. */
export const fetchSavedSearches = async (uid) => {
  if (!uid) throw new Error("UID required");
  const colRef = collection(db, `users/${uid}/savedSearches`);
  const q = query(colRef, orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

/** Delete a saved search by its document ID. */
export const deleteSavedSearch = async (uid, searchId) => {
  if (!uid || !searchId) throw new Error("UID and searchId required");
  const docRef = doc(db, `users/${uid}/savedSearches`, searchId);
  await deleteDoc(docRef);
};
