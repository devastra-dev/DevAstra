import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  Timestamp
} from "firebase/firestore";
import { products, Product } from "@/lib/products";

export interface OrderRecord {
  userId: string;
  productId: string;
  amountInINR: number;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  createdAt?: Timestamp;
}

export async function saveOrder(order: OrderRecord) {
  const col = collection(db, "orders");
  await addDoc(col, {
    ...order,
    createdAt: Timestamp.now()
  });
}

export async function getUserPurchaseForProduct(userId: string, productId: string) {
  const col = collection(db, "orders");
  const q = query(col, where("userId", "==", userId), where("productId", "==", productId));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return snap.docs[0].data() as OrderRecord;
}

export async function getUserOrdersWithProductsServer(userId: string) {
  const col = collection(db, "orders");
  const q = query(col, where("userId", "==", userId));
  const snap = await getDocs(q);

  const orders = snap.docs.map((doc) => {
    const data = doc.data() as OrderRecord;
    const product = products.find((p) => p.id === data.productId) as Product | undefined;
    return {
      id: doc.id,
      ...data,
      product
    };
  });

  return orders;
}

