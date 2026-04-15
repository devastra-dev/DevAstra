import { getAdminApp } from "@/lib/firebase-admin";

function getBucketName(): string {
  const name =
    process.env.FIREBASE_STORAGE_BUCKET ||
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
  if (!name) {
    throw new Error(
      "Set FIREBASE_STORAGE_BUCKET or NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET for downloads"
    );
  }
  return name;
}

/**
 * Signed read URL for `products/{productId}.zip` in the default bucket.
 */
export async function getProductZipSignedUrl(
  productId: string,
  expiresMs: number = 15 * 60 * 1000
): Promise<{ url: string } | { error: "not_found" } | { error: "sign_failed"; message: string }> {
  const bucket = getAdminApp().storage().bucket(getBucketName());
  const file = bucket.file(`products/${productId}.zip`);

  const [exists] = await file.exists();
  if (!exists) {
    return { error: "not_found" };
  }

  try {
    const [url] = await file.getSignedUrl({
      action: "read",
      expires: Date.now() + expiresMs
    });
    return { url };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return { error: "sign_failed", message };
  }
}
