import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  QueryConstraint,
  DocumentData
} from "firebase/firestore";

// ==========================
// 🔥 TYPE (UPGRADED)
// ==========================
export interface Review {
  id?: string;
  productId: string;
  userEmail: string;
  rating: number;
  comment: string;
  createdAt?: Date;
}

// ==========================
// 🔥 SAFE DATE PARSER
// ==========================
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseDate(value: any): Date {
  try {
    if (!value) return new Date();

    // Firestore timestamp
    if (value.toDate) return value.toDate();

    return new Date(value);
  } catch {
    return new Date();
  }
}

// ==========================
// 🔥 INTERNAL QUERY BUILDER
// ==========================
function buildQuery(
  productId: string,
  ordered: boolean
) {
  const constraints: QueryConstraint[] = [
    where("productId", "==", productId)
  ];

  if (ordered) {
    constraints.push(orderBy("createdAt", "desc"));
  }

  return query(collection(db, "reviews"), ...constraints);
}

// ==========================
// 🔥 BASIC FUNCTION (SAFE)
// ==========================
export async function getReviews(
  productId: string
): Promise<Review[]> {
  let snap;

  try {
    snap = await getDocs(buildQuery(productId, true));
  } catch (err) {
    console.warn("⚠️ orderBy failed → fallback", err);
    snap = await getDocs(buildQuery(productId, false));
  }

  return snap.docs.map((doc) => {
    const data = doc.data() as DocumentData;

    return {
      id: doc.id,
      productId: data.productId,
      userEmail: data.userEmail,
      rating: Number(data.rating || 0),
      comment: data.comment || "",
      createdAt: parseDate(data.createdAt)
    };
  });
}

// ==========================
// 🔥 ADVANCED FUNCTION (STATS)
// ==========================
export async function getReviewsWithStats(productId: string) {
  let snap;

  try {
    snap = await getDocs(buildQuery(productId, true));
  } catch (error) {
    console.warn(
      "⚠️ Review query failed with orderBy, fallback used:",
      error
    );
    snap = await getDocs(buildQuery(productId, false));
  }

  const reviews: Review[] = snap.docs.map((doc) => {
    const data = doc.data() as DocumentData;

    return {
      id: doc.id,
      productId: data.productId,
      userEmail: data.userEmail,
      rating: Number(data.rating || 0),
      comment: data.comment || "",
      createdAt: parseDate(data.createdAt)
    };
  });

  const total = reviews.length;

  const avg =
    total === 0
      ? 0
      : reviews.reduce((sum, r) => sum + r.rating, 0) / total;

  return {
    reviews,
    total,
    avg: Number(avg.toFixed(1))
  };
}