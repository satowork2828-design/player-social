
import { db } from "@/lib/firebase/config";
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  doc, 
  updateDoc, 
  deleteDoc 
} from "firebase/firestore";
import { AdSubmission } from "@/lib/mock-data";

const ADS_COLLECTION = "ads";

export async function submitAd(ad: Omit<AdSubmission, "id" | "status">): Promise<string> {
  const docRef = await addDoc(collection(db, ADS_COLLECTION), {
    ...ad,
    status: "pending",
  });
  return docRef.id;
}

export async function getApprovedAds(): Promise<AdSubmission[]> {
  const q = query(collection(db, ADS_COLLECTION), where("status", "==", "approved"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AdSubmission));
}

export async function getAllAds(): Promise<AdSubmission[]> {
  const querySnapshot = await getDocs(collection(db, ADS_COLLECTION));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AdSubmission));
}

export async function updateAdStatus(id: string, status: "approved" | "rejected"): Promise<void> {
  const docRef = doc(db, ADS_COLLECTION, id);
  await updateDoc(docRef, { status });
}

export async function deleteAd(id: string): Promise<void> {
  const docRef = doc(db, ADS_COLLECTION, id);
  await deleteDoc(docRef);
}
