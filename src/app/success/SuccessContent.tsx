"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { products } from "@/lib/products";
import { useAuth } from "@/components/auth/AuthContext";
import { useEffect, useState } from "react";

export default function SuccessContent() {
  const params = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();

  const productId = params.get("productId");

  const product = products.find((p) => p.id === productId);

  const [loading, setLoading] = useState(false);
  const [valid, setValid] = useState(false);

  // 🔥 VALIDATION (CRITICAL FIX)
  useEffect(() => {
    const flag = localStorage.getItem("payment_success");

    if (!flag || flag !== productId) {
      // ❌ direct access block
      router.replace("/");
      return;
    }

    // ✅ valid payment
    setValid(true);

    // 🔥 clear flag
    localStorage.removeItem("payment_success");

  }, [productId, router]);

  // 🔥 DOWNLOAD FUNCTION
  const handleDownload = async () => {
    if (!user || !productId) return;

    setLoading(true);

    try {
      const token = await user.getIdToken();

      const res = await fetch(`/api/download/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Download failed");
      }
    } catch {
      alert("Download error");
    } finally {
      setLoading(false);
    }
  };

  // ❌ WAIT FOR VALIDATION
  if (!valid) {
    return (
      <div className="container-page pt-32 text-center">
        <p className="text-slate-400">Validating payment...</p>
      </div>
    );
  }

  // ❌ INVALID PRODUCT
  if (!product) {
    return (
      <div className="container-page pt-32 text-center">
        <h1 className="text-red-400 text-xl">Invalid Order</h1>
      </div>
    );
  }

  return (
    <div className="container-page pt-32 text-center space-y-8">

      {/* 🎉 ICON */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="text-6xl"
      >
        🎉
      </motion.div>

      {/* TITLE */}
      <h1 className="text-3xl font-bold text-green-400">
        Payment Successful!
      </h1>

      <p className="text-slate-400">
        Your purchase is completed successfully.
      </p>

      {/* PRODUCT INFO */}
      <div className="glass-panel p-6 max-w-md mx-auto space-y-3">
        <h2 className="text-lg font-semibold">{product.title}</h2>
        <p className="text-cyan-400 font-semibold">
          ₹ {product.priceInINR}
        </p>
      </div>

      {/* DOWNLOAD BUTTON */}
      <button
        onClick={handleDownload}
        disabled={loading}
        className="btn-gradient px-6 py-3"
      >
        {loading ? "Preparing..." : "Download Now"}
      </button>

      {/* NAV */}
      <div className="flex justify-center gap-4 text-sm">
        <button
          onClick={() => router.push("/dashboard")}
          className="text-slate-400 hover:text-white"
        >
          Go to Dashboard →
        </button>

        <button
          onClick={() => router.push("/products")}
          className="text-slate-400 hover:text-white"
        >
          Explore More →
        </button>
      </div>

    </div>
  );
}