"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { useAuth } from "@/components/auth/AuthContext";
import { useState, useEffect, useRef } from "react";
import { PremiumLogo } from "@/components/ui/PremiumLogo";
import Image from "next/image";

const links = [
  { href: "/",         label: "Home",      icon: "◈" },
  { href: "/products", label: "Products",  icon: "⬡" },
  { href: "/dashboard",label: "Dashboard", icon: "⊞" },
  { href: "/support",  label: "Support",   icon: "⊕" },
];

export function Navbar() {
  const pathname    = usePathname();
  const { user, logout } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [dropOpen,    setDropOpen]    = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [scrolled,    setScrolled]    = useState(false);

  /* ── Scroll detection ── */
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 12));

  /* ── Close dropdown on outside click ── */
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (!dropdownRef.current?.contains(e.target as Node)) setDropOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  /* ── Close mobile menu on route change ── */
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#060610]/90 backdrop-blur-2xl border-b border-white/[0.07] shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
          : "bg-transparent"
      }`}
    >
      <div className="container-page w-full flex h-16 items-center justify-between" style={{ position: "relative" }}>

        {/* ── LOGO ── */}
        <Link href="/" className="flex items-center gap-3 group z-10" aria-label="DevAstra Home">
          <PremiumLogo />
          <div className="leading-tight">
            <p className="text-sm font-bold tracking-tight text-white group-hover:text-violet-300 transition-colors duration-300">
              DevAstra
            </p>
            <p className="text-[10px] text-slate-500 font-mono tracking-wider hidden sm:block">
              premium code
            </p>
          </div>
        </Link>

        {/* ── DESKTOP NAV ── */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-4 py-2 rounded-lg text-sm font-medium tracking-wide transition-all duration-200 group ${
                  active
                    ? "text-white"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {/* Active/hover bg */}
                {active && (
                  <motion.span
                    layoutId="nav-bg"
                    className="absolute inset-0 rounded-lg bg-violet-500/10 border border-violet-500/20"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                  />
                )}
                <span
                  className={`absolute inset-0 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100 ${
                    !active ? "bg-white/[0.04]" : ""
                  }`}
                />
                {/* Label */}
                <span className="relative z-10">{link.label}</span>

                {/* Active indicator */}
                {active && (
                  <motion.span
                    layoutId="nav-dot"
                    className="absolute -bottom-px left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-violet-400"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* ── RIGHT: User + Mobile ── */}
        <div className="flex items-center gap-2">

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden flex flex-col gap-1.5 w-8 h-8 items-center justify-center rounded-lg hover:bg-white/[0.05] transition"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            <motion.span
              animate={mobileOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
              className="block w-5 h-px bg-slate-300 origin-center"
              transition={{ duration: 0.25 }}
            />
            <motion.span
              animate={mobileOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
              className="block w-5 h-px bg-slate-300 origin-center"
              transition={{ duration: 0.25 }}
            />
            <motion.span
              animate={mobileOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
              className="block w-5 h-px bg-slate-300 origin-center"
              transition={{ duration: 0.25 }}
            />
          </button>

          {/* ── USER SECTION ── */}
          <div ref={dropdownRef} className="relative">
            {user ? (
              <>
                <motion.button
                  onClick={() => setDropOpen(!dropOpen)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] hover:border-violet-500/30 transition-all duration-200"
                >
                  <div className="relative flex-shrink-0">
                    <Image
                      src={
                        user.photoURL && user.photoURL.startsWith("http")
                          ? user.photoURL
                          : `https://ui-avatars.com/api/?name=${user.email}&background=1a0533&color=a78bfa&bold=true`
                      }
                      alt="User avatar"
                      width={30}
                      height={30}
                      className="w-7 h-7 rounded-full object-cover border border-violet-400/30"
                    />
                    <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-400 rounded-full border border-[#060610]" />
                  </div>
                  <span className="hidden sm:inline text-xs text-slate-300 max-w-[130px] truncate font-medium">
                    {user.email?.split("@")[0]}
                  </span>
                  <motion.svg
                    animate={{ rotate: dropOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    width="12" height="12" viewBox="0 0 12 12" fill="none"
                    className="text-slate-500 flex-shrink-0"
                  >
                    <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </motion.svg>
                </motion.button>

                {/* ── DROPDOWN ── */}
                <AnimatePresence>
                  {dropOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute right-0 top-12 w-56 rounded-2xl border border-white/[0.08] bg-[#0c0d1e]/95 backdrop-blur-2xl p-1.5 shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
                    >
                      {/* User info header */}
                      <div className="px-3 py-2.5 border-b border-white/[0.06] mb-1">
                        <p className="text-xs font-semibold text-white truncate">{user.email}</p>
                        <p className="text-[10px] text-violet-400 font-mono mt-0.5">Active Account</p>
                      </div>

                      {[
                        { href: "/dashboard", label: "Dashboard", icon: "⊞" },
                        { href: "/profile",   label: "Profile",   icon: "◎" },
                        { href: "/support",   label: "Support",   icon: "⊕", accent: true },
                        { href: "/terms",     label: "Terms",     icon: "≡" },
                        { href: "/privacy",   label: "Privacy",   icon: "⊗" },
                      ].map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setDropOpen(false)}
                          className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all duration-150 ${
                            item.accent
                              ? "text-violet-300 hover:bg-violet-500/10"
                              : "text-slate-300 hover:text-white hover:bg-white/[0.05]"
                          }`}
                        >
                          <span className="text-[10px] opacity-50">{item.icon}</span>
                          {item.label}
                        </Link>
                      ))}

                      <div className="border-t border-white/[0.06] mt-1 pt-1">
                        <button
                          onClick={() => { logout(); setDropOpen(false); }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-rose-400 hover:bg-rose-500/10 transition-all duration-150"
                        >
                          <span className="text-[10px] opacity-60">⊘</span>
                          Sign out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            ) : (
              <Link
                href="/auth"
                className="btn-gradient text-xs px-5 py-2"
                id="navbar-signin-btn"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* ── MOBILE MENU ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden overflow-hidden border-t border-white/[0.06] bg-[#060610]/98 backdrop-blur-2xl"
          >
            <div className="container-page py-4 space-y-1">
              {links.map((link, i) => {
                const active = pathname === link.href;
                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.3 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                        active
                          ? "bg-violet-500/10 border border-violet-500/20 text-white"
                          : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
                      }`}
                    >
                      <span className="text-[11px] opacity-40 font-mono">{link.icon}</span>
                      {link.label}
                      {active && (
                        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-400" />
                      )}
                    </Link>
                  </motion.div>
                );
              })}

              {user ? (
                <motion.div
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: links.length * 0.05, duration: 0.3 }}
                  className="pt-2 border-t border-white/[0.06]"
                >
                  <p className="px-4 text-[10px] text-slate-500 font-mono uppercase tracking-wider mb-2">
                    {user.email}
                  </p>
                  <button
                    onClick={() => { logout(); setMobileOpen(false); }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-rose-400 hover:bg-rose-500/10 transition"
                  >
                    <span className="text-[11px] opacity-40">⊘</span>
                    Sign out
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: links.length * 0.05, duration: 0.3 }}
                  className="pt-2"
                >
                  <Link
                    href="/auth"
                    onClick={() => setMobileOpen(false)}
                    className="btn-gradient w-full justify-center text-sm"
                  >
                    Sign in
                  </Link>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}