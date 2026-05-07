"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { PremiumLogo } from "@/components/ui/PremiumLogo";

const footerLinks = [
  { href: "/products",  label: "Products"  },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/support",   label: "Support"   },
  { href: "/terms",     label: "Terms"     },
  { href: "/privacy",   label: "Privacy"   },
  { href: "/refund",    label: "Refund"    },
];

export function Footer() {
  return (
    <footer className="relative mt-24 border-t border-white/[0.06] overflow-hidden">

      {/* Ambient gradient top */}
      <div
        aria-hidden
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(124,58,237,0.6), rgba(6,182,212,0.4), transparent)",
        }}
      />

      <div className="container-page py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">

          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3"
          >
            <PremiumLogo />
            <div>
              <p className="text-sm font-bold text-white tracking-tight">DevAstra</p>
              <p className="text-[10px] text-slate-500 font-mono tracking-widest">premium code</p>
            </div>
          </motion.div>

          {/* Links */}
          <motion.nav
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-wrap justify-center gap-x-6 gap-y-2"
          >
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs text-slate-500 hover:text-violet-300 transition-colors duration-200 tracking-wide"
              >
                {link.label}
              </Link>
            ))}
          </motion.nav>
        </div>

        {/* Divider */}
        <div className="my-8 h-px bg-white/[0.04]" />

        {/* Bottom row */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-600"
        >
          <p>© 2026 DevAstra. All rights reserved.</p>
          <p className="font-mono tracking-wider">
            Built for developers, by developers.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}