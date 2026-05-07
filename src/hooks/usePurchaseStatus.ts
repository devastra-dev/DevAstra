"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/components/auth/AuthContext";

type PurchaseStatus = {
  purchased: boolean;
  loading: boolean;
};

// 🔥 GLOBAL CACHE (PER USER + PRODUCT)
const purchaseStatusCache = new Map<string, boolean>();

// 🔥 REQUEST DEDUPLICATION - prevent duplicate in-flight requests
const pendingRequests = new Map<string, Promise<boolean>>();

export function usePurchaseStatus(productId: string): PurchaseStatus {
  const { user } = useAuth();
  const isMountedRef = useRef(true);

  const [status, setStatus] = useState<PurchaseStatus>({
    purchased: false,
    loading: !!user && !!productId
  });

  useEffect(() => {
    isMountedRef.current = true;

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

    // 🔥 REQUEST DEDUPLICATION - Check if request already in flight
    if (pendingRequests.has(cacheKey)) {
      pendingRequests.get(cacheKey)!.then((purchased) => {
        if (isMountedRef.current) {
          setStatus({ purchased, loading: false });
        }
      });
      return;
    }

    // Create the request promise
    const requestPromise = (async (): Promise<boolean> => {
      try {
        setStatus((prev) => ({ ...prev, loading: true }));

        const token = await user.getIdToken(true);

        const res = await fetch(
          `/api/purchase-status?productId=${productId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`
            },
            cache: "force-cache",
            next: { revalidate: 60 }
          }
        );

        let purchased = false;

        if (res.ok) {
          const data = await res.json();
          purchased = !!data?.purchased;
        }

        // 🔥 CACHE SAVE
        purchaseStatusCache.set(cacheKey, purchased);

        if (isMountedRef.current) {
          setStatus({ purchased, loading: false });
        }

        return purchased;

      } catch (err) {
        if (process.env.NODE_ENV === "development") {
          // eslint-disable-next-line no-console
          console.error("❌ Purchase check failed:", err);
        }

        if (isMountedRef.current) {
          setStatus({ purchased: false, loading: false });
        }

        return false;
      }
    })();

    // Store the promise for deduplication
    pendingRequests.set(cacheKey, requestPromise);

    // Clean up pending request when done
    requestPromise.finally(() => {
      pendingRequests.delete(cacheKey);
    });

    return () => {
      isMountedRef.current = false;
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uid, productId]);

  return status;
}