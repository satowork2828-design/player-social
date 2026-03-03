
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  sendEmailVerification as firebaseSendEmailVerification,
  User
} from "firebase/auth";
import { auth } from "@/lib/firebase/config";

export { onAuthStateChanged };
export type { User };

export async function signIn(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

export async function signUp(email: string, password: string) {
  return createUserWithEmailAndPassword(auth, email, password);
}

export async function signOut() {
  return firebaseSignOut(auth);
}

/**
 * Sends a verification email to the currently registered user.
 */
export async function sendVerificationEmail(user: User) {
  return firebaseSendEmailVerification(user);
}
