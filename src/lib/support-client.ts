import { db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy
} from "firebase/firestore";

export async function getUserTickets(email: string) {
  const q = query(
    collection(db, "support_tickets"),
    where("email", "==", email.toLowerCase()),
    orderBy("createdAt", "desc")
  );

  const snap = await getDocs(q);

  return snap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data()
  }));
}