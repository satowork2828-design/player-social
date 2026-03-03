
import { db } from "@/lib/firebase/config";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  bio?: string;
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
    isAdmin: false,
    createdAt: new Date().toISOString(),
  });
}

/**
 * Updates an existing user profile.
 */
export async function updateUserProfile(uid: string, data: Partial<Omit<UserProfile, 'uid' | 'isAdmin' | 'createdAt'>>) {
  const docRef = doc(db, "users", uid);
  await updateDoc(docRef, data);
}
