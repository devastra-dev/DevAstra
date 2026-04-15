"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthContext";
import {
  getUserOrdersWithProducts,
  UserOrderWithProduct
} from "@/lib/orders-client";
import Link from "next/link";
import { SecureDownloadButton } from "@/components/download/SecureDownloadButton";
import { motion } from "framer-motion";

export function DashboardView() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<UserOrderWithProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      if (!user?.email) {
        setLoading(false);
        return;
      }

      try {
        const data = await getUserOrdersWithProducts(user.email);
        if (mounted) setOrders(data);
      } catch (err) {
        console.error("Failed to load orders:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [user]);

  // ✅ FIXED (safe type)
  const copyLicense = (key?: string) => {
    if (!key) return;

    navigator.clipboard.writeText(key);
    alert("License copied ✅");
  };

  if (!user) return null;

  return (
    <div className="space-y-10">

      {/* 🔥 HEADER */}
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
          Dashboard
        </p>

        <h1 className="text-3xl font-semibold tracking-tight text-gradient">
          Your Library
        </h1>

        <p className="text-sm text-slate-400">
          Access downloads, licenses and track your purchases.
        </p>
      </div>

      {/* 📊 STATS */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="glass-panel p-4">
          <p className="text-xs text-slate-400">Products</p>
          <h3 className="text-xl font-semibold">{orders.length}</h3>
        </div>

        <div className="glass-panel p-4">
          <p className="text-xs text-slate-400">Downloads</p>
          <h3 className="text-xl font-semibold">
            {orders.reduce((a, o) => a + (o.downloadCount || 0), 0)}
          </h3>
        </div>

        <div className="glass-panel p-4">
          <p className="text-xs text-slate-400">Spent</p>
          <h3 className="text-xl font-semibold">
            ₹ {orders.reduce((a, o) => a + o.amountInINR, 0)}
          </h3>
        </div>
      </div>

      {/* 📦 MAIN GRID */}
      <div className="grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">

        {/* 💎 PURCHASE LIST */}
        <section className="glass-panel p-5 md:p-6 space-y-4">

          <div className="flex justify-between text-xs text-slate-400">
            <span>Purchases</span>
            <span>{orders.length} items</span>
          </div>

          {loading ? (
            <p className="text-sm text-slate-400">
              Loading your orders...
            </p>
          ) : orders.length === 0 ? (
            <div className="space-y-4 text-sm text-slate-400 text-center py-10">
              <p>No purchases yet.</p>

              <Link
                href="/products"
                className="inline-block px-4 py-2 bg-cyan-500 text-black rounded-lg font-medium hover:bg-cyan-400 transition"
              >
                Browse Products →
              </Link>
            </div>
          ) : (
            <ul className="space-y-4">
              {orders.map((order, i) => (
                <motion.li
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="rounded-xl border border-white/10 bg-white/5 backdrop-blur p-4 space-y-4 hover:scale-[1.02] transition"
                >

                  {/* 🔹 TITLE */}
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {order.product.title}
                    </p>
                    <p className="text-xs text-slate-400">
                      Purchased on {order.formattedDate}
                    </p>
                  </div>

                  {/* 🔐 LICENSE */}
                  {order.licenseKey && (
                    <div className="flex items-center justify-between bg-black/30 border border-white/10 rounded px-3 py-2">
                      <p className="text-[11px] text-slate-400 truncate">
                        {order.licenseKey}
                      </p>

                      <button
                        onClick={() => copyLicense(order.licenseKey)}
                        className="text-xs text-cyan-400 hover:text-cyan-300"
                      >
                        Copy
                      </button>
                    </div>
                  )}

                  {/* 📥 DOWNLOAD COUNT */}
                  <p className="text-[11px] text-slate-500">
                    Downloads: {order.downloadCount || 0}
                  </p>

                  {/* 💰 ACTION */}
                  <div className="flex justify-between items-center">
                    <span className="text-cyan-400 font-medium">
                      ₹ {order.amountInINR}
                    </span>

                    <SecureDownloadButton
                      user={user}
                      productId={order.product.id}
                    />
                  </div>

                </motion.li>
              ))}
            </ul>
          )}
        </section>

        {/* 👤 ACCOUNT PANEL */}
        <aside className="glass-panel p-5 md:p-6 space-y-4 text-sm text-slate-400">

          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">
              Account
            </p>

            <p className="text-slate-200 font-medium break-all">
              {user.email}
            </p>
          </div>

          <div className="border-t border-white/10 pt-3">
            <p className="text-xs text-slate-500">
              Status
            </p>
            <p className="text-green-400 text-sm">
              Active
            </p>
          </div>

          {/* 🔥 SUPPORT CTA */}
          <div className="border-t border-white/10 pt-3">
            <p className="text-xs text-slate-500">
              Need help?
            </p>
            <Link
              href="/support"
              className="text-cyan-400 hover:underline text-sm"
            >
              Contact Support →
            </Link>
          </div>

        </aside>

      </div>
    </div>
  );
}