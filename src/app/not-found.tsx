import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = { title: "404 — Page Not Found" };

export default function NotFound() {
  return (
    <div
      className="relative flex flex-col items-center justify-center min-h-[80vh] px-4 text-center overflow-hidden"
      style={{ position: "relative" }}
    >
      {/* Ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[400px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
      </div>

      {/* 404 number */}
      <p
        className="text-[120px] md:text-[180px] font-black leading-none select-none mb-2"
        style={{
          background:
            "linear-gradient(135deg, rgba(124,58,237,0.18) 0%, rgba(6,182,212,0.12) 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          textShadow: "none",
          fontFamily: "var(--font-display)",
          letterSpacing: "-0.05em",
        }}
      >
        404
      </p>

      {/* Card */}
      <div
        className="relative rounded-2xl px-8 py-8 max-w-md w-full space-y-5"
        style={{
          background:
            "linear-gradient(145deg, rgba(255,255,255,0.055) 0%, rgba(255,255,255,0.01) 100%)",
          border: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
      >
        {/* Top shimmer */}
        <div
          aria-hidden
          className="absolute top-0 left-[20%] right-[20%] h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(124,58,237,0.7), transparent)",
          }}
        />

        <div>
          <p className="text-[10px] font-mono text-violet-400 uppercase tracking-[0.25em] mb-2">
            Error · 404
          </p>
          <h1 className="text-2xl font-bold text-white tracking-tight mb-2">
            Page Not Found
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed">
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved to another universe.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-1">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white"
            style={{
              background: "linear-gradient(135deg, #7c3aed, #2563eb)",
              boxShadow: "0 4px 20px rgba(124,58,237,0.35)",
            }}
          >
            ← Go Home
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-medium text-slate-300 transition-colors duration-200"
            style={{
              border: "1px solid rgba(255,255,255,0.09)",
              background: "rgba(255,255,255,0.03)",
            }}
          >
            Browse Products
          </Link>
        </div>
      </div>
    </div>
  );
}
