"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { products } from "@/lib/products";
import { TiltCard } from "@/components/ui/TiltCard";
import { Spotlight } from "@/components/ui/Spotlight";

export function FeaturedProducts() {
  return (
    <div className="space-y-6">

      {/* 🔥 HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Featured drops</h2>
        <Link
          href="/products"
          className="text-sm text-cyan-400 hover:underline"
        >
          View all →
        </Link>
      </div>

      {/* 💎 GRID */}
      <div className="grid gap-6 md:grid-cols-3">
        {products.map((p, i) => (
          
          <TiltCard key={p.id}>
            <Spotlight>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-panel p-5 h-full transition duration-300 
                hover:scale-[1.03] 
                hover:shadow-[0_0_40px_rgba(56,189,248,0.25)]"
              >
                {/* 🧠 TITLE */}
                <h3 className="text-lg font-semibold group-hover:text-cyan-400 transition">
                  {p.title}
                </h3>

                <p className="text-[11px] text-cyan-300 mt-1">
                  {p.stackLabel}
                </p>

                {/* 💰 PRICE */}
                <p className="text-slate-400 text-sm mt-1">
                  ₹ {p.priceInINR}
                </p>

                {/* 🔗 LINK */}
                <Link
                  href={`/products/${p.id}`}
                  className="inline-block mt-3 text-cyan-400 text-sm hover:underline"
                >
                  View →
                </Link>
              </motion.div>

            </Spotlight>
          </TiltCard>

        ))}
      </div>
    </div>
  );
}