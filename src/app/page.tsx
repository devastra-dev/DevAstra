"use client";
import dynamic from "next/dynamic";
import { motion, useScroll, useTransform, useSpring, useMotionValue, useAnimationFrame } from "framer-motion";
import Link from "next/link";
import { useRef, useEffect, useState } from "react";

/* ── SSR-SAFE DYNAMIC IMPORTS ─────────────────────────────────────────── */
const Particles = dynamic(
  () => import("@/components/ui/Particles").then((m) => m.Particles),
  { ssr: false }
);
const Hero = dynamic(
  () => import("@/components/home/Hero").then((m) => m.Hero),
  { ssr: false }
);
const FeaturedProducts = dynamic(
  () => import("@/components/home/FeaturedProducts").then((m) => m.FeaturedProducts),
  { ssr: false }
);
const Reveal = dynamic(
  () => import("@/components/ui/Reveal").then((m) => m.Reveal),
  { ssr: false }
);

/* ── ANIMATED COUNTER ─────────────────────────────────────────────────── */
function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let start = 0;
          const duration = 1800;
          const step = (timestamp: number) => {
            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

/* ── SCANLINE OVERLAY ─────────────────────────────────────────────────── */
function ScanlineOverlay() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[1] opacity-[0.025]"
      style={{
        backgroundImage:
          "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.08) 2px, rgba(255,255,255,0.08) 4px)",
        backgroundSize: "100% 4px",
      }}
    />
  );
}

/* ── ORBIT RING ───────────────────────────────────────────────────────── */
function OrbitRing({ radius, duration, size, color, delay = 0 }: {
  radius: number; duration: number; size: number; color: string; delay?: number;
}) {
  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        width: size,
        height: size,
        boxShadow: `0 0 ${size * 0.8}px ${color}`,
        background: color,
        top: "50%",
        left: "50%",
        x: "-50%",
        y: "-50%",
      }}
      animate={{
        x: [
          `calc(-50% + ${radius}px)`,
          `calc(-50% + ${radius * 0.707}px)`,
          `calc(-50%)`,
          `calc(-50% - ${radius * 0.707}px)`,
          `calc(-50% - ${radius}px)`,
          `calc(-50% - ${radius * 0.707}px)`,
          `calc(-50%)`,
          `calc(-50% + ${radius * 0.707}px)`,
          `calc(-50% + ${radius}px)`,
        ],
        y: [
          `calc(-50%)`,
          `calc(-50% - ${radius * 0.707}px)`,
          `calc(-50% - ${radius}px)`,
          `calc(-50% - ${radius * 0.707}px)`,
          `calc(-50%)`,
          `calc(-50% + ${radius * 0.707}px)`,
          `calc(-50% + ${radius}px)`,
          `calc(-50% + ${radius * 0.707}px)`,
          `calc(-50%)`,
        ],
      }}
      transition={{
        duration,
        ease: "linear",
        repeat: Infinity,
        delay,
      }}
    />
  );
}

/* ── GLASS METRIC CARD ────────────────────────────────────────────────── */
function MetricCard({ icon, value, label, suffix }: {
  icon: string; value: number; label: string; suffix?: string;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -4 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="relative group"
    >
      {/* glow border */}
      <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-br from-cyan-500/40 via-blue-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
      <div className="relative rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.06] to-white/[0.02] backdrop-blur-xl p-6 overflow-hidden">
        {/* corner accent */}
        <div className="absolute top-0 right-0 w-16 h-16 bg-cyan-400/10 rounded-bl-full" />
        <div className="text-2xl mb-3">{icon}</div>
        <div className="text-3xl font-bold tracking-tight text-white font-mono">
          <AnimatedCounter target={value} suffix={suffix} />
        </div>
        <div className="text-xs text-slate-400 mt-1 uppercase tracking-widest">{label}</div>
      </div>
    </motion.div>
  );
}

/* ── TRUST PILL ───────────────────────────────────────────────────────── */
function TrustPill({ icon, label }: { icon: string; label: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.04 }}
      className="relative flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-xl px-6 py-5 overflow-hidden group cursor-default"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      {/* animated left accent */}
      <motion.div
        className="absolute left-0 top-0 h-full w-[2px] bg-gradient-to-b from-transparent via-cyan-400 to-transparent"
        initial={{ scaleY: 0 }}
        whileHover={{ scaleY: 1 }}
        transition={{ duration: 0.3 }}
      />
      <span className="text-xl relative z-10">{icon}</span>
      <span className="text-sm font-medium text-slate-300 relative z-10 tracking-wide">{label}</span>
    </motion.div>
  );
}

/* ── FEATURE CARD ─────────────────────────────────────────────────────── */
function FeatureCard({
  icon, title, description, gradient, delay,
}: {
  icon: string; title: string; description: string; gradient: string; delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.02, y: -6 }}
      className="relative group rounded-3xl border border-white/[0.08] bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-2xl p-8 overflow-hidden"
    >
      {/* gradient blob */}
      <div
        className={`absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-2xl ${gradient}`}
      />
      {/* grid lines */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      {/* icon ring */}
      <div className="relative inline-flex items-center justify-center w-14 h-14 rounded-2xl border border-white/[0.12] bg-white/[0.06] mb-6 text-2xl">
        {icon}
        <motion.div
          className="absolute inset-0 rounded-2xl border border-cyan-400/40"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        />
      </div>
      <h3 className="font-semibold text-white text-lg mb-3 relative z-10">{title}</h3>
      <p className="text-sm text-slate-400 leading-relaxed relative z-10">{description}</p>
    </motion.div>
  );
}

/* ── FLOATING BADGE ───────────────────────────────────────────────────── */
function FloatingBadge({ text }: { text: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.6 }}
      className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-1.5 mb-8"
    >
      <motion.div
        className="w-1.5 h-1.5 rounded-full bg-cyan-400"
        animate={{ opacity: [1, 0.3, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
      <span className="text-xs font-medium text-cyan-300 tracking-widest uppercase">{text}</span>
    </motion.div>
  );
}

/* ── TICKER BAR ───────────────────────────────────────────────────────── */
const TICKER_ITEMS = [
  "⚡ Instant Download",
  "🔒 Secure Payment",
  "💎 Premium Quality",
  "🚀 Production Ready",
  "🎯 Clean Architecture",
  "♾️ Lifetime Updates",
];

function TickerBar() {
  const x = useMotionValue(0);
  const SPEED = 0.4;
  const totalWidth = TICKER_ITEMS.length * 220;

  useAnimationFrame(() => {
    const current = x.get();
    if (current <= -totalWidth) x.set(0);
    else x.set(current - SPEED);
  });

  return (
    <div className="overflow-hidden border-y border-white/[0.06] py-3 relative">
      <div className="absolute left-0 top-0 h-full w-16 bg-gradient-to-r from-slate-950 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-slate-950 to-transparent z-10 pointer-events-none" />
      <motion.div className="flex whitespace-nowrap" style={{ x }}>
        {[...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-2 text-xs text-slate-400 tracking-widest uppercase mr-14"
          >
            <span className="w-1 h-1 rounded-full bg-cyan-500/60 inline-block" />
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* ── CTA BUTTON ───────────────────────────────────────────────────────── */
function CTAButton({ href, children, variant = "primary" }: {
  href: string; children: React.ReactNode; variant?: "primary" | "secondary";
}) {
  if (variant === "primary") {
    return (
      <Link href={href} className="relative group inline-flex items-center gap-3 no-underline">
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="relative inline-flex items-center gap-3 rounded-2xl px-8 py-4 overflow-hidden"
        >
          {/* animated gradient bg */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600" />
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100"
            transition={{ duration: 0.3 }}
          />
          {/* shimmer */}
          <motion.div
            className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            initial={{ x: "-100%" }}
            whileHover={{ x: "200%" }}
            transition={{ duration: 0.6 }}
          />
          <span className="relative text-white font-semibold tracking-wide text-base">
            {children}
          </span>
          <motion.span
            className="relative text-white"
            animate={{ x: [0, 4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            →
          </motion.span>
        </motion.div>
      </Link>
    );
  }

  return (
    <Link href={href} className="no-underline">
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        className="inline-flex items-center gap-3 rounded-2xl border border-white/[0.15] bg-white/[0.04] hover:bg-white/[0.08] px-8 py-4 text-slate-300 hover:text-white font-medium tracking-wide transition-colors duration-300"
      >
        {children}
      </motion.div>
    </Link>
  );
}

/* ── SECTION HEADER ───────────────────────────────────────────────────── */
function SectionHeader({ eyebrow, title, subtitle }: {
  eyebrow: string; title: React.ReactNode; subtitle?: string;
}) {
  return (
    <div className="text-center mb-16 space-y-4">
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-xs font-semibold tracking-[0.25em] uppercase text-cyan-400"
      >
        {eyebrow}
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight"
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-slate-400 text-lg max-w-xl mx-auto leading-relaxed"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}

/* ── DIVIDER ──────────────────────────────────────────────────────────── */
function GlowDivider() {
  return (
    <div className="relative flex items-center justify-center py-2">
      <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="relative w-2 h-2 rounded-full bg-cyan-400/60 shadow-[0_0_8px_2px_rgba(34,211,238,0.4)]" />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════ */
/*                          HOME PAGE                                    */
/* ══════════════════════════════════════════════════════════════════════ */
export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const smoothY = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const bgY = useTransform(smoothY, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(smoothY, [0, 0.2], [1, 0]);

  return (
    <main ref={containerRef} className="relative overflow-hidden bg-slate-950">

      {/* ── SCANLINES ─────────────────────────────────────────────── */}
      <ScanlineOverlay />

      {/* ── PARTICLES ─────────────────────────────────────────────── */}
      <Particles />

      {/* ── BACKGROUND NEBULA ─────────────────────────────────────── */}
      <motion.div
        style={{ y: bgY }}
        aria-hidden
        className="absolute inset-0 -z-10 overflow-hidden pointer-events-none"
      >
        {/* primary nebula */}
        <div className="absolute w-[900px] h-[900px] rounded-full top-[-200px] left-1/2 -translate-x-1/2 opacity-30"
          style={{
            background:
              "radial-gradient(circle, rgba(6,182,212,0.35) 0%, rgba(59,130,246,0.2) 40%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        {/* secondary accent */}
        <div className="absolute w-[600px] h-[600px] rounded-full bottom-[-100px] right-[-100px] opacity-20"
          style={{
            background:
              "radial-gradient(circle, rgba(139,92,246,0.4) 0%, rgba(59,130,246,0.2) 50%, transparent 70%)",
            filter: "blur(100px)",
          }}
        />
        {/* grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
            maskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)",
          }}
        />
      </motion.div>

      {/* ── ORBIT DECORATION (hero area) ──────────────────────────── */}
      <motion.div
        style={{ opacity }}
        className="absolute top-24 right-[5%] w-[340px] h-[340px] pointer-events-none hidden xl:block"
        aria-hidden
      >
        {/* orbit tracks */}
        {[100, 140, 170].map((r) => (
          <div
            key={r}
            className="absolute rounded-full border border-white/[0.04]"
            style={{
              width: r * 2,
              height: r * 2,
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />
        ))}
        <OrbitRing radius={100} duration={8} size={6} color="rgba(34,211,238,0.9)" delay={0} />
        <OrbitRing radius={140} duration={12} size={4} color="rgba(139,92,246,0.8)" delay={1} />
        <OrbitRing radius={170} duration={16} size={5} color="rgba(59,130,246,0.7)" delay={2} />
        {/* center dot */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_16px_4px_rgba(34,211,238,0.6)]" />
      </motion.div>

      {/* ╔══════════════════════════════════════════════════════════╗ */}
      {/* ║                     PAGE CONTENT                        ║ */}
      {/* ╚══════════════════════════════════════════════════════════╝ */}
      <div className="container-page pt-24 pb-28 space-y-28">

        {/* ── HERO ────────────────────────────────────────────────── */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 48 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-6"
          >
            <FloatingBadge text="New releases every week" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 48 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <Hero />
          </motion.div>
        </section>

        <GlowDivider />

        {/* ── TICKER ──────────────────────────────────────────────── */}
        <Reveal>
          <TickerBar />
        </Reveal>

        <GlowDivider />

        {/* ── TRUST BAR ───────────────────────────────────────────── */}
        <Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <TrustPill icon="⚡" label="Instant Download" />
            <TrustPill icon="🔒" label="Secure Payment" />
            <TrustPill icon="💎" label="Premium Quality" />
          </div>
        </Reveal>

        <GlowDivider />

        {/* ── METRICS ─────────────────────────────────────────────── */}
        <Reveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            <MetricCard icon="📦" value={120} suffix="+" label="Products" />
            <MetricCard icon="👥" value={8500} suffix="+" label="Developers" />
            <MetricCard icon="⭐" value={4} suffix=".9" label="Avg Rating" />
            <MetricCard icon="🚀" value={99} suffix="%" label="Satisfaction" />
          </div>
        </Reveal>

        <GlowDivider />

        {/* ── FEATURED PRODUCTS ───────────────────────────────────── */}
        <Reveal>
          <section>
            <SectionHeader
              eyebrow="Curated Collection"
              title={
                <>
                  <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400 bg-clip-text text-transparent">
                    Featured
                  </span>{" "}
                  Products
                </>
              }
              subtitle="Hand-picked, production-ready codebases that ship fast and scale further."
            />
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <FeaturedProducts />
            </motion.div>
          </section>
        </Reveal>

        <GlowDivider />

        {/* ── WHY US ──────────────────────────────────────────────── */}
        <Reveal>
          <section>
            <SectionHeader
              eyebrow="Why Choose Us"
              title={
                <>
                  Built for{" "}
                  <span className="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
                    Serious Builders
                  </span>
                </>
              }
              subtitle="Every codebase is architected to last — not just to demo."
            />
            <div className="grid md:grid-cols-3 gap-6">
              <FeatureCard
                icon="⏱️"
                title="Save Months of Work"
                description="Skip the scaffolding. Get battle-tested codebases that cut development time from months to minutes."
                gradient="bg-cyan-400"
                delay={0}
              />
              <FeatureCard
                icon="🏗️"
                title="Production Ready"
                description="Built with scalable architecture, TypeScript-first, and industry-standard patterns that handle real traffic."
                gradient="bg-blue-500"
                delay={0.1}
              />
              <FeatureCard
                icon="🎨"
                title="Easy Customization"
                description="Clean, well-documented code with separation of concerns — modify and launch your own product in days."
                gradient="bg-violet-500"
                delay={0.2}
              />
            </div>
          </section>
        </Reveal>

        <GlowDivider />

        {/* ── SOCIAL PROOF STRIP ──────────────────────────────────── */}
        <Reveal>
          <div className="relative rounded-3xl border border-white/[0.07] bg-gradient-to-br from-white/[0.04] to-white/[0.01] backdrop-blur-xl p-8 overflow-hidden">
            <div
              aria-hidden
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.6) 1px, transparent 0)",
                backgroundSize: "28px 28px",
              }}
            />
            <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              {[
                {
                  quote: "Saved us 3 months of Frontend work. Absolutely worth it.",
                  author: "Alex R.",
                  role: "CTO, StartupX",
                },
                {
                  quote: "The cleanest codebase I've purchased. Ship-ready from day one.",
                  author: "Priya M.",
                  role: "Solo Founder",
                },
                {
                  quote: "Every component is plug-and-play. The docs are top-tier.",
                  author: "Jordan K.",
                  role: "Lead Dev, Agency",
                },
              ].map((t, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12, duration: 0.55 }}
                  className="space-y-4"
                >
                  <div className="flex justify-center gap-0.5 text-amber-400 text-sm">
                    {"★★★★★"}
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed italic">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div>
                    <p className="text-white text-sm font-semibold">{t.author}</p>
                    <p className="text-slate-500 text-xs">{t.role}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </Reveal>

        <GlowDivider />

        {/* ── FINAL CTA ───────────────────────────────────────────── */}
        <Reveal>
          <section className="relative text-center">
            {/* radial glow */}
            <div
              aria-hidden
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse, rgba(34,211,238,0.12) 0%, transparent 70%)",
                filter: "blur(40px)",
              }}
            />
            <div className="relative space-y-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="text-xs font-semibold tracking-[0.25em] uppercase text-cyan-400 mb-4">
                  Ready to Launch?
                </p>
                <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white leading-tight">
                  Start Building{" "}
                  <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400 bg-clip-text text-transparent">
                    Today
                  </span>{" "}
                  🚀
                </h2>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15, duration: 0.5 }}
                className="text-slate-400 text-lg max-w-md mx-auto"
              >
                Don&apos;t waste cycles — launch faster with premium, production-grade code.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.25, duration: 0.5 }}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              >
                <CTAButton href="/products" variant="primary">
                  Browse Products
                </CTAButton>
              </motion.div>

              {/* trust micro-copy */}
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="text-slate-600 text-xs tracking-wide"
              >
                No subscription · One-time purchase · Instant access
              </motion.p>
            </div>
          </section>
        </Reveal>

      </div>{/* /container */}

    </main>
  );
}