import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  query,
  where,
  Timestamp
} from "firebase/firestore";
import { products, Product } from "@/lib/products";

/**
 * FINAL TYPE (SYNCED WITH BACKEND)
 */
export interface UserOrderWithProduct {
  id: string;
  product: Product;
  amountInINR: number;
  formattedDate: string;

  // 🔥 NEW (IMPORTANT)
  licenseKey?: string;
  downloadCount?: number;
}

/**
 * Normalize email (must match backend)
 */
function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

/**
 * Fetch user orders + attach product data
 */
export async function getUserOrdersWithProducts(
  userId: string
): Promise<UserOrderWithProduct[]> {
  const email = normalizeEmail(userId);

  const col = collection(db, "orders");
  const q = query(col, where("userId", "==", email));

  const snap = await getDocs(q);

  return snap.docs
    .map((doc) => {
      const data = doc.data() as {
        productId: string;
        amountInINR: number;
        createdAt?: Timestamp;

        // 🔥 ADD THIS
        licenseKey?: string;
        downloadCount?: number;
      };

      const product = products.find(
        (p) => p.id === data.productId
      );

      if (!product) return null;

      const date =
        data.createdAt?.toDate() ?? new Date();

      return {
        id: doc.id,
        product,
        amountInINR: data.amountInINR,
        formattedDate: date.toLocaleDateString(),

        // 🔥 RETURN THESE
        licenseKey: data.licenseKey,
        downloadCount: data.downloadCount ?? 0
      };
    })
    .filter(Boolean) as UserOrderWithProduct[];
}