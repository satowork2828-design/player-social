
import { db } from "@/lib/firebase/config";
import { doc, getDoc, setDoc } from "firebase/firestore";

export interface UserProfile {
  uid: string;
  email: string;
  isAdmin: boolean;
  createdAt: string;
}

/**
 * Fetches a user's profile from Firestore.
 */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data() as UserProfile;
  }
  return null;
}

/**
 * Creates a new user profile in Firestore.
 */
export async function createUserProfile(uid: string, email: string) {
  const docRef = doc(db, "users", uid);
  await setDoc(docRef, {
    uid,
    email,
    isAdmin: false, // Default role
    createdAt: new Date().toISOString(),
  });
}
