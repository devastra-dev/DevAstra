"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/components/auth/AuthContext";
import { useState, useEffect, useRef } from "react";
import { PremiumLogo } from "@/components/ui/PremiumLogo";

const links = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/support", label: "Support" }
];

export function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 🔥 CLOSE DROPDOWN OUTSIDE CLICK
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!dropdownRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className="fixed top-0 w-full z-50 backdrop-blur-xl bg-black/40 border-b border-white/10">
      <div className="container-page flex h-16 items-center justify-between">

        {/* 🔥 LOGO */}
        <Link href="/" className="flex items-center gap-3 group">
          <PremiumLogo />
          <div className="leading-tight">
            <p className="text-sm font-semibold tracking-tight group-hover:text-cyan-300 transition">
              DevAstra
            </p>
            <p className="text-[11px] text-slate-400">
              Premium developer products
            </p>
          </div>
        </Link>

        {/* 🔗 DESKTOP NAV */}
        <nav className="hidden md:flex items-center gap-7 text-sm">
          {links.map((link) => {
            const active = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-1 py-0.5 transition group ${
                  active
                    ? "text-cyan-300"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                {link.label}

                {active && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-x-0 -bottom-1 h-[2px] rounded-full bg-gradient-to-r from-cyan-400 to-blue-500"
                  />
                )}

                {!active && (
                  <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-cyan-400 transition-all duration-300 group-hover:w-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* 👤 USER + MOBILE */}
        <div className="flex items-center gap-3">

          {/* 📱 MOBILE MENU BUTTON */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-white text-xl"
          >
            ☰
          </button>

          {/* 👤 USER */}
          <div ref={dropdownRef} className="relative">
            {user ? (
              <>
                <button
                  onClick={() => setOpen(!open)}
                  className="flex items-center gap-2 group"
                >
                  <div className="relative">
                    <img
                      src={
                        user.photoURL && user.photoURL.startsWith("http")
                          ? user.photoURL
                          : `https://ui-avatars.com/api/?name=${user.email}&background=0f172a&color=38bdf8`
                      }
                      alt="avatar"
                      className="w-9 h-9 rounded-full border border-cyan-400/30 shadow-md shadow-cyan-500/20 object-cover group-hover:scale-105 transition"
                    />
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border border-black" />
                  </div>

                  <span className="hidden sm:inline text-slate-300 max-w-[140px] truncate">
                    {user.email}
                  </span>
                </button>

                {/* 🔽 DROPDOWN */}
                <AnimatePresence>
                  {open && (
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 12 }}
                      className="absolute right-0 top-14 w-56 rounded-xl border border-white/10 bg-black/70 backdrop-blur-xl p-2 space-y-1 shadow-xl"
                    >
                      <Link href="/dashboard" className="block px-3 py-2 rounded hover:bg-white/10">
                        Dashboard
                      </Link>

                      <Link href="/profile" className="block px-3 py-2 rounded hover:bg-white/10">
                        Profile
                      </Link>

                      <Link href="/support" className="block px-3 py-2 rounded hover:bg-white/10 text-cyan-300">
                        Support
                      </Link>

                      {/* 🔥 LEGAL */}
                      <Link href="/terms" className="block px-3 py-2 rounded hover:bg-white/10">
                        Terms
                      </Link>

                      <Link href="/privacy" className="block px-3 py-2 rounded hover:bg-white/10">
                        Privacy
                      </Link>

                      <div className="border-t border-white/10 my-1" />

                      <button
                        onClick={logout}
                        className="w-full text-left px-3 py-2 rounded hover:bg-red-500/20 text-red-400"
                      >
                        Sign out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            ) : (
              <Link href="/auth" className="btn-gradient">
                Sign in
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* 📱 MOBILE MENU */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden bg-black/90 backdrop-blur-xl border-t border-white/10 p-4 space-y-3"
          >
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block text-slate-300 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}