import * as admin from "firebase-admin";
import { getAdminApp } from "@/lib/firebase-admin";
import type { OrderRecord } from "@/lib/orders";

/**
 * Normalize email (critical for consistency)
 */
function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/**
 * Generate strong license key (UPGRADED)
 */
function generateLicenseKey(): string {
  const rand = Math.random().toString(36).substring(2, 10).toUpperCase();
  const time = Date.now().toString(36).toUpperCase();
  return `LIC-${rand}-${time}`;
}

/**
 * Save order (SAFE + NO DUPLICATE + FUTURE READY)
 */
export async function saveOrderAdmin(
  order: Omit<OrderRecord, "createdAt">
): Promise<void> {
  const db = getAdminApp().firestore();

  const email = normalizeEmail(order.userId);
  const productId = order.productId.trim();

  const docId = `${email}_${productId}`;
  const ref = db.collection("orders").doc(docId);

  const existing = await ref.get();

  if (existing.exists) {
    console.log("⚠️ Order already exists:", docId);
    return;
  }

  await ref.set({
    ...order,
    userId: email,
    productId,

    // 🔐 License system (UPGRADED)
    licenseKey: generateLicenseKey(),

    // 📥 Download tracking
    downloadCount: 0,
    lastDownloadAt: null,

    // 🔒 Security tracking
    lastIp: null,
    userAgent: null,

    // ⏱ timestamp
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  });

  console.log("✅ Order saved:", docId);
}

/**
 * Check if user purchased product (SAFE MATCH)
 */
export async function hasPurchasedProduct(
  userEmail: string,
  productId: string
): Promise<boolean> {
  const db = getAdminApp().firestore();

  const email = normalizeEmail(userEmail);
  const normalizedProductId = productId.trim();

  const docId = `${email}_${normalizedProductId}`;

  const doc = await db.collection("orders").doc(docId).get();

  return doc.exists;
}

/**
 * Increment download count (ANTI-ABUSE + LIMIT)
 */
export async function incrementDownloadCount(
  userEmail: string,
  productId: string,
  meta?: {
    ip?: string;
    userAgent?: string;
  }
): Promise<void> {
  const db = getAdminApp().firestore();

  const email = normalizeEmail(userEmail);
  const normalizedProductId = productId.trim();

  const docId = `${email}_${normalizedProductId}`;
  const ref = db.collection("orders").doc(docId);

  const snap = await ref.get();

  if (!snap.exists) {
    throw new Error("Order not found");
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = snap.data() as any;

  const currentCount = data.downloadCount || 0;

  // 🔥 HARD LIMIT (ANTI PIRACY)
  if (currentCount >= 5) {
    throw new Error("Download limit exceeded (5 max)");
  }

  await ref.update({
    downloadCount: admin.firestore.FieldValue.increment(1),

    // 📅 last download tracking
    lastDownloadAt: admin.firestore.FieldValue.serverTimestamp(),

    // 🔐 optional tracking
    ...(meta?.ip && { lastIp: meta.ip }),
    ...(meta?.userAgent && { userAgent: meta.userAgent })
  });
}

/**
 * OPTIONAL: Get full order (for dashboard / license system)
 */
export async function getOrderDetails(
  userEmail: string,
  productId: string
) {
  const db = getAdminApp().firestore();

  const email = normalizeEmail(userEmail);
  const docId = `${email}_${productId.trim()}`;

  const doc = await db.collection("orders").doc(docId).get();

  if (!doc.exists) return null;

  return doc.data();
}