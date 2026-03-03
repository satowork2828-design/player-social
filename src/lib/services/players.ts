
import { db } from "@/lib/firebase/config";
import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  query, 
  orderBy, 
  addDoc,
  deleteDoc,
  updateDoc
} from "firebase/firestore";
import { Player } from "@/lib/mock-data";

const PLAYERS_COLLECTION = "players";

export async function getPlayers(): Promise<Player[]> {
  const q = query(collection(db, PLAYERS_COLLECTION), orderBy("rating", "desc"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Player));
}

export async function getPlayerById(id: string): Promise<Player | null> {
  const docRef = doc(db, PLAYERS_COLLECTION, id);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Player;
  }
  return null;
}

export async function addPlayer(player: Omit<Player, "id">): Promise<string> {
  const docRef = await addDoc(collection(db, PLAYERS_COLLECTION), player);
  return docRef.id;
}

export async function updatePlayer(id: string, player: Partial<Omit<Player, "id">>): Promise<void> {
  const docRef = doc(db, PLAYERS_COLLECTION, id);
  await updateDoc(docRef, player);
}

export async function deletePlayer(id: string): Promise<void> {
  const docRef = doc(db, PLAYERS_COLLECTION, id);
  await deleteDoc(docRef);
}
