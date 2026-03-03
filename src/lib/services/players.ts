
import { db } from "@/lib/firebase/config";
import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  query, 
  orderBy, 
  limit 
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
