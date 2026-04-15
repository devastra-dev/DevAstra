"use client";

import type { Product } from "@/lib/products";
import { motion } from "framer-motion";
import { useAuth } from "@/components/auth/AuthContext";
import { useState } from "react";
import { usePurchaseStatus } from "@/hooks/usePurchaseStatus";
import { ProductReviews } from "@/components/reviews/ProductReviews";

/* =========================
   🎥 DEMO VIDEO (UPGRADED)
========================= */
function DemoVideo({ url }: { url?: string }) {
  const [play, setPlay] = useState(false);

  if (!url) return null;

  return (
    <div className="relative rounded-xl overflow-hidden border border-white/10 bg-black/40 backdrop-blur-xl">

      {!play && (
        <div
          onClick={() => setPlay(true)}
          className="absolute inset-0 bg-black/60 flex items-center justify-center cursor-pointer z-10 group"
        >
          <div className="w-16 h-16 rounded-full bg-cyan-500 flex items-center justify-center text-black text-2xl shadow-lg group-hover:scale-110 transition">
            ▶
          </div>
        </div>
      )}

      <iframe
        src={play ? url + "?autoplay=1" : url}
        className="w-full h-[320px]"
        allowFullScreen
      />
    </div>
  );
}

/* =========================
   🚀 MAIN COMPONENT
========================= */
export function ProductDetail({ product }: { product: Product }) {
  const { user } = useAuth();
  const {
    purchased: alreadyPurchased,
    loading: purchaseLoading
  } = usePurchaseStatus(product.id);

  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<"idle" | "processing" | "failed">("idle");

  const [activeImage, setActiveImage] = useState(
    product.images?.[0] || ""
  );

  /* =========================
     📥 DOWNLOAD
  ========================= */
  const handleDownload = async () => {
    setBusy(true);

    try {
      const token = await user!.getIdToken();

      const res = await fetch(`/api/download/${product.id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) {
        alert("Download failed");
        return;
      }

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      }

    } catch {
      alert("Download error");
    } finally {
      setBusy(false);
    }
  };

  /* =========================
     💰 BUY
  ========================= */
  const handleBuy = async () => {
    if (!user) {
      window.location.href = `/auth?redirect=/products/${product.id}`;
      return;
    }

    if (alreadyPurchased || purchaseLoading) return;

    setBusy(true);
    setStatus("processing");

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

      if (!orderData?.orderId) {
        setStatus("failed");
        return;
      }

      const Razorpay = (window as any).Razorpay;

      const rz = new Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: "INR",
        name: "DevAstra",
        description: product.title,
        order_id: orderData.orderId,

        handler: async (res: any) => {
          const verifyRes = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${await user.getIdToken()}`
            },
            body: JSON.stringify({
              ...res,
              productId: product.id,
              amountInINR: product.priceInINR
            })
          });

          const data = await verifyRes.json();

          if (data.success) {
            window.location.reload(); // 🔥 FORCE REFRESH PURCHASE STATE
          } else {
            setStatus("failed");
          }
        }
      });

      rz.open();

    } catch {
      setStatus("failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-16">

      <div className="grid gap-10 md:grid-cols-[1.5fr_1fr]">

        {/* ================= LEFT ================= */}
        <div className="space-y-6">

          {/* IMAGE */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="rounded-2xl overflow-hidden border border-white/10 bg-black/40 backdrop-blur-xl"
          >
            {activeImage && (
              <img
                src={activeImage}
                className="w-full h-[350px] object-cover"
              />
            )}
          </motion.div>

          {/* THUMBNAILS */}
          <div className="flex gap-3">
            {product.images.map((img, i) => (
              <img
                key={i}
                src={img}
                onClick={() => setActiveImage(img)}
                className={`w-16 h-16 object-cover rounded-lg cursor-pointer border transition ${
                  activeImage === img
                    ? "border-cyan-400 scale-105"
                    : "border-white/10 opacity-70 hover:opacity-100"
                }`}
              />
            ))}
          </div>

          {/* VIDEO */}
          <DemoVideo url={product.demoVideo} />

          {/* TEXT */}
          <div>
            <h1 className="text-3xl font-bold text-white">
              {product.title}
            </h1>

            <p className="text-cyan-300">{product.tagline}</p>

            <p className="text-slate-300 mt-2">
              {product.description}
            </p>
          </div>

          {/* FEATURES */}
          <div className="grid grid-cols-2 gap-3">
            {product.features.map((f, i) => (
              <div key={i} className="glass-panel p-3 text-sm">
                ✔ {f}
              </div>
            ))}
          </div>

        </div>

        {/* ================= RIGHT ================= */}
        <div className="glass-panel p-6 space-y-5 relative">

          {/* 🔥 PURCHASE BADGE */}
          {alreadyPurchased && !purchaseLoading && (
            <div className="absolute top-4 right-4 bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-xs">
              ✔ Purchased
            </div>
          )}

          <p className="text-4xl font-bold text-cyan-400">
            ₹ {product.priceInINR}
          </p>

          <button
            onClick={alreadyPurchased ? handleDownload : handleBuy}
            disabled={busy || purchaseLoading}
            className="w-full btn-gradient py-3"
          >
            {purchaseLoading
              ? "Checking..."
              : alreadyPurchased
              ? busy
                ? "Preparing..."
                : "Download Now"
              : busy
              ? "Processing..."
              : "Buy Now"}
          </button>

        </div>
      </div>

      {/* ================= REVIEWS ================= */}
      <ProductReviews productId={product.id} />

      {/* ================= STATUS ================= */}
      {status === "processing" && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="glass-panel p-6 text-center">
            Processing Payment...
          </div>
        </div>
      )}

      {status === "failed" && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="glass-panel p-6 text-center space-y-3">
            <p className="text-red-400">Payment Failed ❌</p>
            <button
              onClick={() => setStatus("idle")}
              className="btn-gradient"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

    </div>
  );
}