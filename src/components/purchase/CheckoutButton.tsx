"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthContext";

export function CheckoutButton({ productId }: { productId: string }) {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    if (!user) {
      const search = new URLSearchParams({
        redirect: `/products/${productId}`
      }).toString();
      window.location.href = `/auth?${search}`;
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const idToken = await user.getIdToken();

      const res = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`
        },
        body: JSON.stringify({ productId })
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(
          typeof errBody === "object" && errBody && "error" in errBody
            ? String((errBody as { error: string }).error)
            : "Failed to create order"
        );
      }

      const data = await res.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: "DevAstra",
        description: "Digital product purchase",
        order_id: data.orderId,

        // 🔥 FINAL HANDLER FIX
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          try {
            const verifyToken = await user.getIdToken();
            const verifyRes = await fetch("/api/razorpay/verify", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${verifyToken}`
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                productId
              })
            });

            const verifyData = (await verifyRes.json()) as {
              success?: boolean;
              error?: string;
            };

            if (verifyRes.ok && verifyData.success) {
              // 🔥 SET FLAG FOR SUCCESS PAGE
              localStorage.setItem("payment_success", productId);
              router.push(`/success?productId=${productId}`);
              return;
            }
            setError(verifyData.error ?? "Payment verification failed.");
          } catch {
            setError("Verification failed. Try again.");
          }
        },

        prefill: {
          email: user.email ?? undefined
        },

        theme: {
          color: "#06b6d4"
        }
      };

      // ✅ STEP 3: Open Razorpay
      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();

    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong while starting checkout.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2 w-full">
      {error && (
        <p className="text-xs text-rose-400 bg-rose-950/40 border border-rose-900/50 rounded-xl px-3 py-2">
          {error}
        </p>
      )}
      <button
        onClick={handleCheckout}
        disabled={loading}
        className="btn-gradient w-full justify-center disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {loading ? "Starting checkout..." : "Buy now with Razorpay"}
      </button>
    </div>
  );
}