
import { db } from "@/lib/firebase/config";
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  doc, 
  updateDoc, 
  deleteDoc,
  Timestamp 
} from "firebase/firestore";
import { Review } from "@/lib/mock-data";

const REVIEWS_COLLECTION = "reviews";

export async function submitReview(review: Omit<Review, "id" | "status" | "createdAt">): Promise<string> {
  const docRef = await addDoc(collection(db, REVIEWS_COLLECTION), {
    ...review,
    status: "pending",
    createdAt: new Date().toISOString(),
  });
  return docRef.id;
}

export async function getApprovedReviewsByPlayer(playerId: string): Promise<Review[]> {
  const q = query(
    collection(db, REVIEWS_COLLECTION),
    where("playerId", "==", playerId),
    where("status", "==", "approved"),
    orderBy("createdAt", "desc")
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Review));
}

export async function getAllReviews(): Promise<Review[]> {
  const q = query(collection(db, REVIEWS_COLLECTION), orderBy("createdAt", "desc"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Review));
}

export async function updateReviewStatus(id: string, status: "approved" | "rejected"): Promise<void> {
  const docRef = doc(db, REVIEWS_COLLECTION, id);
  await updateDoc(docRef, { status });
}

export async function deleteReview(id: string): Promise<void> {
  const docRef = doc(db, REVIEWS_COLLECTION, id);
  await deleteDoc(docRef);
}
