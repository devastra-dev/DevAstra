"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthContext";
import { getUserOrdersWithProducts, UserOrderWithProduct } from "@/lib/orders-client";
import Link from "next/link";
import { SecureDownloadButton } from "@/components/download/SecureDownloadButton";
import { motion, AnimatePresence } from "framer-motion";

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.065, delayChildren: 0.05 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

/* ── Stat Card ── */
function StatCard({ label, value, accent, icon }: { label: string; value: string; accent?: boolean; icon: string }) {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -4, scale: 1.015 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className="relative rounded-2xl p-5 overflow-hidden group cursor-default"
      style={{
        border: `1px solid ${accent ? "rgba(6,182,212,0.18)" : "rgba(255,255,255,0.08)"}`,
        backdropFilter: "blur(16px)",
      }}
    >
      {/* Glass fill */}
      <div className="absolute inset-0 rounded-2xl" style={{
        background: accent
          ? "linear-gradient(145deg, rgba(6,182,212,0.10) 0%, rgba(37,99,235,0.06) 50%, rgba(12,13,30,0.7) 100%)"
          : "linear-gradient(145deg, rgba(124,58,237,0.10) 0%, rgba(6,182,212,0.04) 50%, rgba(12,13,30,0.7) 100%)",
      }} />
      {/* Top edge shimmer */}
      <div className="absolute top-0 left-[10%] right-[10%] h-px" style={{
        background: accent
          ? "linear-gradient(90deg, transparent, rgba(6,182,212,0.35), transparent)"
          : "linear-gradient(90deg, transparent, rgba(124,58,237,0.3), transparent)",
      }} />
      {/* Corner accent */}
      <div aria-hidden className="absolute top-0 right-0 w-20 h-20 rounded-bl-full opacity-40 group-hover:opacity-100 transition-opacity duration-500" style={{ background: accent ? "radial-gradient(circle at top right, rgba(6,182,212,0.12), transparent 70%)" : "radial-gradient(circle at top right, rgba(124,58,237,0.1), transparent 70%)" }} />
      {/* Bottom hover bar */}
      <motion.div className="absolute bottom-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: accent ? "linear-gradient(90deg, transparent, rgba(6,182,212,0.5), transparent)" : "linear-gradient(90deg, transparent, rgba(124,58,237,0.5), transparent)" }} />
      {/* Inner hover glow */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ boxShadow: accent ? "inset 0 0 30px rgba(6,182,212,0.06)" : "inset 0 0 30px rgba(124,58,237,0.06)" }} />

      <div className="relative z-10">
        <div className="text-xl mb-3">{icon}</div>
        <p className="text-2xl font-bold font-mono mb-1" style={{ background: accent ? "linear-gradient(135deg, #06b6d4, #3b82f6)" : "linear-gradient(135deg, #a78bfa, #60a5fa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>{value}</p>
        <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-mono">{label}</p>
      </div>
    </motion.div>
  );
}

/* ── Order Row ── */
function OrderRow({ order, user, onCopy }: {
  order: UserOrderWithProduct;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any;
  onCopy: (key?: string) => void;
}) {
  return (
    <motion.li
      variants={fadeUp}
      layout
      className="group relative rounded-2xl overflow-hidden transition-all duration-300"
      style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
      whileHover={{ borderColor: "rgba(124,58,237,0.25)", x: 2 }}
    >
      <div aria-hidden className="absolute left-0 top-0 bottom-0 w-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: "linear-gradient(180deg, #7c3aed, #06b6d4)" }} />

      <div className="p-5 space-y-3.5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-white truncate">{order.product.title}</h3>
            <p className="text-[11px] text-slate-500 font-mono mt-0.5 tracking-wide">{order.formattedDate}</p>
          </div>
          <span className="text-sm font-bold font-mono shrink-0" style={{ background: "linear-gradient(135deg, #06b6d4, #3b82f6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            ₹{order.amountInINR.toLocaleString()}
          </span>
        </div>

        {order.licenseKey && (
          <div className="flex items-center justify-between gap-3 rounded-xl px-4 py-2.5" style={{ background: "rgba(0,0,0,0.25)", border: "1px solid rgba(255,255,255,0.05)" }}>
            <p className="text-[11px] font-mono text-slate-400 truncate tracking-wide">{order.licenseKey}</p>
            <button onClick={() => onCopy(order.licenseKey)} className="shrink-0 text-[10px] font-mono uppercase tracking-widest text-violet-400 hover:text-white px-2.5 py-1 rounded-lg transition-all duration-150" style={{ border: "1px solid rgba(124,58,237,0.25)" }}>
              Copy
            </button>
          </div>
        )}

        <div className="flex items-center justify-between pt-1" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
          <span className="text-[10px] text-slate-600 font-mono uppercase tracking-wider">Downloads: {order.downloadCount || 0}</span>
          <SecureDownloadButton user={user} productId={order.product.id} />
        </div>
      </div>
    </motion.li>
  );
}

/* ── Activity Item ── */
function ActivityItem({ label, time, icon }: { label: string; time: string; icon: string }) {
  return (
    <div className="flex items-center gap-3 py-2.5 group">
      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-slate-300 truncate">{label}</p>
        <p className="text-[10px] text-slate-600 font-mono">{time}</p>
      </div>
    </div>
  );
}

export function DashboardView() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<UserOrderWithProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!user?.email) { setLoading(false); return; }
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
    return () => { mounted = false; };
  }, [user]);

  const copyLicense = (key?: string) => {
    if (!key) return;
    navigator.clipboard.writeText(key);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!user) return null;

  const totalSpent = orders.reduce((a, o) => a + o.amountInINR, 0);
  const totalDL = orders.reduce((a, o) => a + (o.downloadCount || 0), 0);

  return (
    <div className="space-y-8">

      {/* Copy toast */}
      <AnimatePresence>
        {copied && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-full px-5 py-2.5 text-xs text-emerald-300 font-medium shadow-2xl"
            style={{ background: "rgba(12,13,30,0.95)", border: "1px solid rgba(16,185,129,0.3)", backdropFilter: "blur(12px)" }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            License key copied!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats */}
      <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-4" variants={stagger} initial="hidden" animate="show">
        <StatCard icon="📦" label="Products" value={String(orders.length).padStart(2, "0")} />
        <StatCard icon="⬇" label="Downloads" value={String(totalDL).padStart(2, "0")} />
        <StatCard icon="₹" label="Total Spent" value={`₹${totalSpent.toLocaleString()}`} accent />
        <StatCard icon="🔑" label="Licenses" value={String(orders.filter(o => o.licenseKey).length).padStart(2, "0")} />
      </motion.div>

      {/* Main grid */}
      <div className="grid md:grid-cols-[1fr_300px] gap-6 items-start">

        {/* Purchase log */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-2xl overflow-hidden"
          style={{ background: "rgba(12,13,30,0.5)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(16px)" }}
        >
          <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-violet-400" />
              <p className="text-xs font-mono text-slate-400 uppercase tracking-widest">Purchase Log</p>
            </div>
            <span className="text-[10px] font-mono text-slate-500 px-2 py-0.5 rounded-full" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>{orders.length} records</span>
          </div>

          <div className="p-4">
            {loading ? (
              <div className="flex flex-col items-center gap-4 py-16">
                <motion.div className="w-10 h-10 rounded-full border-2 border-violet-400/30 border-t-violet-400" animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />
                <p className="text-[11px] text-slate-500 font-mono tracking-widest uppercase">Retrieving Data…</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="flex flex-col items-center gap-5 py-16 text-center">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>🛒</div>
                <div>
                  <p className="text-sm text-slate-400 mb-1">No purchases yet</p>
                  <p className="text-[11px] text-slate-600">Explore our premium products</p>
                </div>
                <Link href="/products" className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold text-violet-300 transition-all duration-200 hover:text-white" style={{ border: "1px solid rgba(124,58,237,0.35)", background: "rgba(124,58,237,0.06)" }}>Browse Products →</Link>
              </div>
            ) : (
              <motion.ul className="space-y-3" variants={stagger} initial="hidden" animate="show">
                {orders.map((order) => (<OrderRow key={order.id} order={order} user={user} onCopy={copyLicense} />))}
              </motion.ul>
            )}
          </div>
        </motion.section>

        {/* Sidebar */}
        <motion.aside initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.55, delay: 0.18, ease: [0.16, 1, 0.3, 1] }} className="space-y-3">

          {/* Profile card */}
          <div className="rounded-2xl p-5 space-y-4" style={{ background: "linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Operator</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-violet-300 shrink-0" style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.15), rgba(37,99,235,0.1))", border: "1px solid rgba(124,58,237,0.25)" }}>
                {user.email?.charAt(0).toUpperCase() || "?"}
              </div>
              <p className="text-xs text-slate-300 font-mono break-all leading-relaxed">{user.email}</p>
            </div>
            <div className="flex items-center gap-2.5">
              <motion.div className="w-2 h-2 rounded-full bg-emerald-400" animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }} transition={{ duration: 2.2, repeat: Infinity }} style={{ boxShadow: "0 0 8px rgba(52,211,153,0.6)" }} />
              <span className="text-[11px] text-emerald-400 font-mono tracking-widest uppercase">Active</span>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-3">Recent Activity</p>
            {orders.length > 0 ? (
              <div className="space-y-1">
                {orders.slice(0, 3).map((o) => (
                  <ActivityItem key={o.id} icon="📦" label={`Purchased ${o.product.title}`} time={o.formattedDate} />
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-slate-600 py-4 text-center">No activity yet</p>
            )}
          </div>

          {/* Quick Links */}
          {[
            { href: "/support", icon: "🛠", title: "Support", desc: "Get help from our team", hoverColor: "violet" },
            { href: "/products", icon: "⬡", title: "Products", desc: "Browse catalog", hoverColor: "cyan" },
            { href: "/profile", icon: "👤", title: "Profile", desc: "View your profile", hoverColor: "violet" },
          ].map((link) => (
            <Link key={link.href} href={link.href} className={`group flex items-center justify-between rounded-2xl px-5 py-4 transition-all duration-200 hover:border-${link.hoverColor}-500/30`} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="flex items-center gap-3">
                <span className="text-lg">{link.icon}</span>
                <div>
                  <p className="text-xs font-medium text-white">{link.title}</p>
                  <p className="text-[10px] text-slate-500">{link.desc}</p>
                </div>
              </div>
              <motion.span className="text-slate-500 group-hover:text-violet-300 transition-colors duration-200 text-sm" animate={{ x: [0, 4, 0] }} transition={{ duration: 1.8, repeat: Infinity }}>→</motion.span>
            </Link>
          ))}

          {/* Ticker */}
          <div className="rounded-xl px-4 py-3 overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.04)", background: "rgba(0,0,0,0.15)" }}>
            <div className="overflow-hidden">
              <motion.p className="text-[10px] font-mono text-slate-600 whitespace-nowrap tracking-widest" animate={{ x: ["0%", "-50%"] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}>
                SECURE · ENCRYPTED · INSTANT DOWNLOAD · LIFETIME ACCESS · SECURE · ENCRYPTED · INSTANT DOWNLOAD · LIFETIME ACCESS ·&nbsp;
              </motion.p>
            </div>
          </div>
        </motion.aside>
      </div>
    </div>
  );
}