"use client";

import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthContext";
import { products } from "@/lib/products";
import { useState } from "react";
import { motion } from "framer-motion";
import { usePurchaseStatus } from "@/hooks/usePurchaseStatus";
import { ProductReviews } from "@/components/reviews/ProductReviews";
import Link from "next/link";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [busy, setBusy] = useState(false);

  const product = products.find((p) => p.id === params.id);

  const {
    purchased: alreadyPurchased,
    loading: purchaseLoading
  } = usePurchaseStatus(product?.id || "");

  if (!product) {
    return (
      <div className="container-page py-20 text-center">
        <h1 className="text-xl text-red-400">Product not found</h1>
      </div>
    );
  }

  // =========================
  // 🔥 FREE DOWNLOAD
  // =========================
  const handleFreeDownload = async () => {
    if (!user) {
      router.push(`/auth?redirect=/products/${product.id}`);
      return;
    }

    setBusy(true);

    try {
      window.location.href = product.downloadUrl;
    } catch {
      alert("Download failed");
    } finally {
      setBusy(false);
    }
  };

  // =========================
  // 🔥 PAID DOWNLOAD
  // =========================
  const handleDownload = async () => {
    if (!user) {
      router.push(`/auth?redirect=/products/${product.id}`);
      return;
    }

    setBusy(true);

    try {
      const token = await user.getIdToken();

      const res = await fetch(`/api/download/${product.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();

      if (!res.ok || !data.url) {
        alert(data?.error || "Download failed");
        return;
      }

      window.location.href = data.url;

    } catch {
      alert("Download error");
    } finally {
      setBusy(false);
    }
  };

  // =========================
  // 🔥 BUY
  // =========================
  const handleBuyNow = async () => {
    if (product.isFree) {
      handleFreeDownload();
      return;
    }

    if (!user) {
      router.push(`/auth?redirect=/products/${product.id}`);
      return;
    }

    setBusy(true);

    try {
      const token = await user.getIdToken();

      const orderRes = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          productId: product.id,
          amountInINR: product.priceInINR
        })
      });

      const orderData = await orderRes.json();

      if (!orderRes.ok) {
        alert(orderData?.error || "Order failed");
        return;
      }

      const Rz = (window as any).Razorpay;

      if (!Rz) {
        alert("Payment not loaded");
        return;
      }

      const rz = new Rz({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: "INR",
        name: "DevAstra",
        description: product.title,
        order_id: orderData.orderId,

        handler: async (res: any) => {
          const verifyToken = await user.getIdToken();

          const verifyRes = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${verifyToken}`
            },
            body: JSON.stringify({
              ...res,
              productId: product.id,
              amountInINR: product.priceInINR
            })
          });

          const verifyData = await verifyRes.json();

          if (verifyRes.ok && verifyData.success) {
            window.location.href = `/success?productId=${product.id}`;
          } else {
            alert("Payment verification failed");
          }
        }
      });

      rz.open();

    } catch {
      alert("Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="relative overflow-hidden">

      {/* BG */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute w-[500px] h-[500px] bg-cyan-500/20 blur-[120px] rounded-full top-[-120px] left-1/3" />
        <div className="absolute w-[400px] h-[400px] bg-blue-500/20 blur-[120px] rounded-full bottom-[-120px] right-10" />
      </div>

      <div className="container-page pt-28 pb-20 space-y-16">

        {/* VIDEO */}
        {product.demoVideo && (
          <div className="rounded-2xl overflow-hidden border border-white/10">
            <iframe src={product.demoVideo} className="w-full h-[400px]" allowFullScreen />
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-12">

          {/* LEFT */}
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-4xl font-bold text-white">
              {product.title}
            </h1>

            <p className="text-cyan-400 mt-2 text-sm">
              {product.stackLabel}
            </p>

            <p className="text-slate-400 mt-4">
              {product.description}
            </p>

            <p className="text-green-400 text-sm mt-3">
              🔥 120+ developers already using this
            </p>

            <ul className="mt-6 space-y-2 text-sm text-slate-300">
              {product.features.map((f, i) => (
                <li key={i}>✔ {f}</li>
              ))}
            </ul>
          </motion.div>

          {/* RIGHT */}
          <motion.div className="glass-panel p-6 space-y-5">

            {/* 🔥 PRICE */}
            {product.isFree ? (
              <p className="text-3xl font-bold text-green-400">FREE</p>
            ) : (
              <>
                {product.originalPrice && (
                  <p className="line-through text-slate-400 text-sm">
                    ₹ {product.originalPrice}
                  </p>
                )}

                <p className="text-3xl font-bold text-cyan-400">
                  ₹ {product.priceInINR}
                </p>

                {product.discountPercent && (
                  <p className="text-red-400 text-xs">
                    {product.discountPercent}% OFF
                  </p>
                )}
              </>
            )}

            {/* PURCHASED */}
            {alreadyPurchased && !product.isFree && (
              <p className="text-green-400 text-sm">✔ Already Purchased</p>
            )}

            {/* BUTTON */}
            <button
              onClick={
                product.isFree
                  ? handleFreeDownload
                  : alreadyPurchased
                  ? handleDownload
                  : handleBuyNow
              }
              disabled={busy || purchaseLoading}
              className="w-full btn-gradient py-3"
            >
              {product.isFree
                ? busy
                  ? "Preparing..."
                  : "Download Free"
                : purchaseLoading
                ? "Checking..."
                : alreadyPurchased
                ? busy
                  ? "Preparing..."
                  : "Download Now"
                : busy
                ? "Processing..."
                : "Buy Now"}
            </button>

            {/* 🔥 FUNNEL */}
            {product.isFree && (
              <p className="text-xs text-center text-slate-400">
                Want premium version?{" "}
                <Link href="/products/next-saas-starter" className="text-cyan-400 underline">
                  Upgrade →
                </Link>
              </p>
            )}

            {/* LEGAL */}
            {!product.isFree && (
              <p className="text-xs text-slate-400 text-center">
                By purchasing, you agree to our{" "}
                <Link href="/terms" className="underline text-cyan-400">Terms</Link> &{" "}
                <Link href="/refund" className="underline text-cyan-400">Refund Policy</Link>
              </p>
            )}

          </motion.div>

        </div>

        <ProductReviews productId={product.id} />

      </div>
    </main>
  );
}