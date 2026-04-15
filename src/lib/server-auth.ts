import type { NextRequest } from "next/server";
import { getAdminApp } from "@/lib/firebase-admin";

export interface VerifiedUser {
  uid: string;
  email: string;
}

/**
 * Verifies Firebase ID token from `Authorization: Bearer <token>`.
 * Returns null if missing, invalid, or token has no email (required for purchase lookup).
 */
export async function getVerifiedUserFromRequest(
  req: NextRequest
): Promise<VerifiedUser | null> {
  const header = req.headers.get("authorization");
  if (!header?.startsWith("Bearer ")) {
    return null;
  }

  const token = header.slice("Bearer ".length).trim();
  if (!token) {
    return null;
  }

  try {
    const decoded = await getAdminApp().auth().verifyIdToken(token);
    if (!decoded.email) {
      return null;
    }
    return { uid: decoded.uid, email: decoded.email };
  } catch {
    return null;
  }
}
