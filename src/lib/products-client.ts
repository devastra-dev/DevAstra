import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export async function getAllProducts() {
  const snap = await getDocs(collection(db, "products"));

  return snap.docs.map((doc) => doc.data());
}