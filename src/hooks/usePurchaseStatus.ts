"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth/AuthContext";

type PurchaseStatus = {
  purchased: boolean;
  loading: boolean;
};

// 🔥 GLOBAL CACHE (PER USER + PRODUCT)
const purchaseStatusCache = new Map<string, boolean>();

export function usePurchaseStatus(productId: string): PurchaseStatus {
  const { user } = useAuth();

  const [status, setStatus] = useState<PurchaseStatus>({
    purchased: false,
    loading: !!user && !!productId
  });

  useEffect(() => {
    let isMounted = true;

    // ❌ NO USER
    if (!user || !productId) {
      setStatus({ purchased: false, loading: false });
      return;
    }

    const cacheKey = `${user.uid}:${productId}`;

    // 🔥 CACHE HIT (instant UI)
    if (purchaseStatusCache.has(cacheKey)) {
      setStatus({
        purchased: purchaseStatusCache.get(cacheKey)!,
        loading: false
      });
      return;
    }

    const checkPurchase = async () => {
      try {
        setStatus((prev) => ({ ...prev, loading: true }));

        const token = await user.getIdToken(true); // 🔥 force fresh token

        // ✅ CORRECT API (NOT download anymore)
        const res = await fetch(
          `/api/purchase-status?productId=${productId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        let purchased = false;

        if (res.ok) {
          const data = await res.json();
          purchased = !!data?.purchased;
        }

        // 🔥 CACHE SAVE
        purchaseStatusCache.set(cacheKey, purchased);

        if (!isMounted) return;

        setStatus({
          purchased,
          loading: false
        });

      } catch (err) {
        console.error("❌ Purchase check failed:", err);

        if (!isMounted) return;

        setStatus({
          purchased: false,
          loading: false
        });
      }
    };

    checkPurchase();

    return () => {
      isMounted = false;
    };

  }, [user?.uid, productId]);

  return status;
}