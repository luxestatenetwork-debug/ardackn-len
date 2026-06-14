import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

/**
 * Retrieve the user document from Firestore.
 * @param {string} uid - Firebase Auth UID
 */
export const getUser = async (uid) => {
  const userRef = doc(db, "users", uid);
  const snap = await getDoc(userRef);
  return snap.exists() ? snap.data() : null;
};

/**
 * Create or update a user with role and optional investor profile.
 * @param {string} uid
 * @param {Object} data { role: "investor"|"viewer", investorProfile?: { preferences: string[], portfolio: any[] } }
 */
export const upsertUser = async (uid, data) => {
  const userRef = doc(db, "users", uid);
  await setDoc(userRef, data, { merge: true });
};

/**
 * Update only the investor profile part of a user.
 */
export const updateInvestorProfile = async (uid, profileUpdates) => {
  // Only investorProfile can be updated by the user; role changes are restricted to admin/system.
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, { investorProfile: profileUpdates });
};
