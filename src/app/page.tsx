"use client";

import dynamic from "next/dynamic";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useAnimationFrame,
} from "framer-motion";
import Link from "next/link";
import { useRef, useEffect, useState, useCallback } from "react";
import Image from "next/image";

const Particles = dynamic(() => import("@/components/ui/Particles").then((m) => m.Particles), { ssr: false });
const Hero = dynamic(() => import("@/components/home/Hero").then((m) => m.Hero), { ssr: false });
const FeaturedProducts = dynamic(() => import("@/components/home/FeaturedProducts").then((m) => m.FeaturedProducts), { ssr: false });
const Reveal = dynamic(() => import("@/components/ui/Reveal").then((m) => m.Reveal), { ssr: false });

/* ── HOOKS ── */
function useTilt(strength = 10) {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const springRx = useSpring(rx, { stiffness: 260, damping: 24 });
  const springRy = useSpring(ry, { stiffness: 260, damping: 24 });
  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    ry.set(((e.clientX - (r.left + r.width / 2)) / (r.width / 2)) * strength);
    rx.set(-((e.clientY - (r.top + r.height / 2)) / (r.height / 2)) * strength);
  }, [rx, ry, strength]);
  const onLeave = useCallback(() => { rx.set(0); ry.set(0); }, [rx, ry]);
  return { ref, rotateX: springRx, rotateY: springRy, onMove, onLeave };
}

/* ── ANIMATED COUNTER ── */
function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        let start = 0;
        const duration = 1800;
        const step = (ts: number) => {
          if (!start) start = ts;
          const prog = Math.min((ts - start) / duration, 1);
          setCount(Math.floor((1 - Math.pow(1 - prog, 3)) * target));
          if (prog < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        observer.disconnect();
      }
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

/* ── METRIC CARD ── */
function MetricCard({ icon, value, label, suffix }: { icon: string; value: number; label: string; suffix?: string }) {
  const { ref, rotateX, rotateY, onMove, onLeave } = useTilt(10);
  return (
    <motion.div ref={ref} style={{ perspective: 1000 }} onMouseMove={onMove} onMouseLeave={onLeave} className="relative group">
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative rounded-2xl border border-white/[0.08] backdrop-blur-2xl p-6 overflow-hidden"
      >
        {/* Glass background */}
        <div className="absolute inset-0 rounded-2xl" style={{ background: "linear-gradient(145deg, rgba(124,58,237,0.10) 0%, rgba(6,182,212,0.05) 50%, rgba(15,15,35,0.7) 100%)" }} />
        {/* Top edge light */}
        <div className="absolute top-0 left-[10%] right-[10%] h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(124,58,237,0.4), rgba(6,182,212,0.3), transparent)" }} />
        {/* Corner accent */}
        <div className="absolute top-0 right-0 w-20 h-20 rounded-bl-full" style={{ background: "radial-gradient(circle at top right, rgba(124,58,237,0.12), transparent 70%)" }} />
        {/* Bottom hover line */}
        <div className="absolute bottom-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: "linear-gradient(90deg,transparent,rgba(124,58,237,0.5),rgba(6,182,212,0.3),transparent)" }} />
        {/* Inner glow on hover */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ boxShadow: "inset 0 0 30px rgba(124,58,237,0.08)" }} />
        <div className="text-xl mb-3">{icon}</div>
        <div className="text-3xl font-bold tracking-tight text-white font-mono"><AnimatedCounter target={value} suffix={suffix} /></div>
        <div className="text-[10px] text-slate-500 mt-1.5 uppercase tracking-[.2em]">{label}</div>
      </motion.div>
    </motion.div>
  );
}

/* ── TRUST PILL ── */
function TrustPill({ icon, label }: { icon: string; label: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -2 }}
      transition={{ type: "spring", stiffness: 350, damping: 22 }}
      className="relative flex items-center gap-3 rounded-2xl border border-white/[0.08] backdrop-blur-xl px-6 py-5 overflow-hidden group cursor-default"
    >
      {/* Glass fill */}
      <div className="absolute inset-0 rounded-2xl" style={{ background: "linear-gradient(145deg, rgba(124,58,237,0.10) 0%, rgba(6,182,212,0.05) 50%, rgba(15,15,35,0.7) 100%)" }} />
      {/* Top edge shimmer */}
      <div className="absolute top-0 left-[15%] right-[15%] h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(124,58,237,0.3), transparent)" }} />
      {/* Hover fill */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: "linear-gradient(135deg,rgba(124,58,237,0.08),rgba(6,182,212,0.04),transparent)" }} />
      <span className="text-xl relative z-10">{icon}</span>
      <span className="text-sm font-medium text-slate-400 relative z-10 tracking-wide group-hover:text-white transition-colors duration-300">{label}</span>
    </motion.div>
  );
}

/* ── FEATURE CARD ── */
function FeatureCard({ icon, title, description, delay }: { icon: string; title: string; description: string; delay: number }) {
  const { ref, rotateX, rotateY, onMove, onLeave } = useTilt(8);
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] }} style={{ perspective: 1000 }} onMouseMove={onMove} onMouseLeave={onLeave} className="group">
      <motion.div style={{ rotateX, rotateY, transformStyle: "preserve-3d" }} className="relative rounded-2xl border border-white/[0.08] backdrop-blur-2xl p-7 overflow-hidden h-full">
        {/* Glass fill */}
        <div className="absolute inset-0 rounded-2xl" style={{ background: "linear-gradient(145deg, rgba(124,58,237,0.10) 0%, rgba(6,182,212,0.05) 50%, rgba(12,13,30,0.8) 100%)" }} />
        {/* Top edge light */}
        <div className="absolute top-0 left-[10%] right-[10%] h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(124,58,237,0.35), rgba(6,182,212,0.2), transparent)" }} />
        {/* Inner hover glow */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ boxShadow: "inset 0 0 40px rgba(124,58,237,0.07)" }} />
        <div className="relative inline-flex items-center justify-center w-12 h-12 rounded-xl border border-white/[0.1] mb-5 text-xl" style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.08), rgba(6,182,212,0.04))" }}>{icon}</div>
        <h3 className="relative font-semibold text-white text-[1.02rem] mb-2.5">{title}</h3>
        <p className="relative text-sm text-slate-500 leading-relaxed">{description}</p>
        <div className="absolute bottom-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: "linear-gradient(90deg,transparent,rgba(124,58,237,0.3),transparent)" }} />
      </motion.div>
    </motion.div>
  );
}

/* ── SECTION HEADER ── */
function SectionHeader({ eyebrow, title, subtitle }: { eyebrow: string; title: React.ReactNode; subtitle?: string }) {
  return (
    <div className="text-center mb-14 space-y-3">
      <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-[11px] font-bold tracking-[.26em] uppercase text-violet-400">{eyebrow}</motion.p>
      <motion.h2 initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: .06 }} className="text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">{title}</motion.h2>
      {subtitle && <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: .14 }} className="text-slate-500 text-lg max-w-xl mx-auto leading-relaxed">{subtitle}</motion.p>}
    </div>
  );
}

/* ── GLOW DIVIDER ── */
function GlowDivider() {
  return (
    <div className="relative flex items-center justify-center py-4">
      <div className="absolute left-0 right-0 h-px" style={{ background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.04),transparent)" }} />
      <motion.div className="absolute h-px" style={{ width: "36%", background: "linear-gradient(90deg,transparent,rgba(124,58,237,0.35),rgba(6,182,212,0.2),transparent)" }} animate={{ scaleX: [0, 1, 0], opacity: [0, .7, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }} />
      <div className="relative w-1.5 h-1.5 rounded-full" style={{ background: "rgb(124,58,237)", boxShadow: "0 0 10px 3px rgba(124,58,237,0.5)" }}>
        <motion.div className="absolute inset-0 rounded-full" style={{ background: "rgba(124,58,237,0.4)" }} animate={{ scale: [1, 2.6, 1], opacity: [.6, 0, .6] }} transition={{ duration: 2.6, repeat: Infinity }} />
      </div>
    </div>
  );
}

/* ── TESTIMONIAL CARD ── */
function TestimonialCard({ quote, author, role, delay }: { quote: string; author: string; role: string; delay: number }) {
  const { ref, rotateX, rotateY, onMove, onLeave } = useTilt(6);
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay, duration: .5 }} style={{ perspective: 900 }} onMouseMove={onMove} onMouseLeave={onLeave}>
      <motion.div style={{ rotateX, rotateY, transformStyle: "preserve-3d" }} className="group relative p-5 rounded-2xl border border-white/[0.05] bg-white/[0.02] hover:bg-white/[0.035] transition-colors duration-300">
        <div className="flex justify-center gap-0.5 text-amber-400 text-sm mb-3" style={{ filter: "drop-shadow(0 0 4px rgba(251,191,36,0.3))" }}>★★★★★</div>
        <p className="text-slate-400 text-sm leading-relaxed italic">&ldquo;{quote}&rdquo;</p>
        <div className="mt-4 flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-full flex-shrink-0" style={{ background: "linear-gradient(135deg,rgb(124,58,237),rgb(37,99,235))" }} />
          <div>
            <p className="text-white text-[.8rem] font-semibold">{author}</p>
            <p className="text-slate-600 text-[.7rem]">{role}</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── TICKER BAR ── */
const TICKER_ITEMS = ["⚡ Instant Download", "🔒 Secure Payment", "💎 Premium Quality", "🚀 Production Ready", "🎯 Clean Architecture", "♾️ Lifetime Updates"];
function TickerBar() {
  const x = useMotionValue(0);
  const totalWidth = TICKER_ITEMS.length * 225;
  useAnimationFrame(() => {
    const c = x.get();
    if (c <= -totalWidth) x.set(0);
    else x.set(c - 0.44);
  });
  return (
    <div className="overflow-hidden py-3.5 relative" style={{ borderTop: "1px solid rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
      <div className="absolute left-0 top-0 h-full w-20 z-10 pointer-events-none" style={{ background: "linear-gradient(to right,#060610,transparent)" }} />
      <div className="absolute right-0 top-0 h-full w-20 z-10 pointer-events-none" style={{ background: "linear-gradient(to left,#060610,transparent)" }} />
      <motion.div className="flex whitespace-nowrap" style={{ x }}>
        {[...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
          <span key={i} className="inline-flex items-center gap-2 text-[10.5px] text-slate-600 tracking-[.18em] uppercase mr-16 hover:text-violet-400 transition-colors duration-200">
            <motion.span className="w-1 h-1 rounded-full bg-violet-500/60 inline-block" animate={{ opacity: [.5, 1, .5], scale: [1, 1.6, 1] }} transition={{ duration: 2.2, repeat: Infinity, delay: i * .1 }} />
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* ── BACK TO TOP ── */
function BackToTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const fn = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return (
    <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className={`btt ${visible ? "visible" : ""}`} aria-label="Back to top">
      <svg className="btt-icon" viewBox="0 0 24 24" fill="none"><path d="M12 20V4M12 4L6 10M12 4L18 10" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
    </button>
  );
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  HOME PAGE                                                             */
/* ══════════════════════════════════════════════════════════════════════ */
export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const smoothY = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const opacity = useTransform(smoothY, [0, 0.2], [1, 0]);

  /* ── Ambient aurora blobs (CSS-only, no JS cost) ── */
  const AmbientBackground = () => (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Blob A — violet */}
      <div style={{
        position: "absolute", width: 750, height: 750,
        top: "-15%", left: "25%",
        background: "radial-gradient(circle, rgba(124,58,237,0.18) 0%, rgba(124,58,237,0.06) 45%, transparent 70%)",
        filter: "blur(100px)",
        animation: "drift-a 28s ease-in-out infinite",
        willChange: "transform",
      }} />
      {/* Blob B — cyan */}
      <div style={{
        position: "absolute", width: 580, height: 580,
        bottom: "-10%", right: "-2%",
        background: "radial-gradient(circle, rgba(6,182,212,0.15) 0%, rgba(37,99,235,0.06) 55%, transparent 72%)",
        filter: "blur(110px)",
        animation: "drift-b 34s ease-in-out infinite",
        willChange: "transform",
      }} />
      {/* Blob C — warm accent */}
      <div style={{
        position: "absolute", width: 350, height: 350,
        top: "40%", left: "-3%",
        background: "radial-gradient(circle, rgba(251,191,36,0.06) 0%, transparent 70%)",
        filter: "blur(80px)",
        animation: "drift-a 22s ease-in-out infinite reverse",
        willChange: "transform",
      }} />
      {/* Subtle dot texture */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.5) 1px, transparent 0)",
        backgroundSize: "32px 32px", opacity: 0.025,
        maskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, black 30%, transparent 100%)",
        WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, black 30%, transparent 100%)",
      }} />
    </div>
  );

  return (
    <main ref={containerRef} className="relative overflow-hidden" style={{ background: "#060610" }}>
      <AmbientBackground />
      <Particles />

      {/* ── PAGE CONTENT ── */}
      <div className="container-page pt-24 pb-28 space-y-24 relative z-10">

        {/* ── HERO ── */}
        <section>
          <motion.div initial={{ opacity: 0, y: 44 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8, delay: .1, ease: [.22, 1, .36, 1] }}>
            <Hero />
          </motion.div>
        </section>

        <GlowDivider />

        {/* ── TICKER ── */}
        <Reveal><TickerBar /></Reveal>

        <GlowDivider />

        {/* ── TRUST ── */}
        <Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <TrustPill icon="⚡" label="Instant Download" />
            <TrustPill icon="🔒" label="Secure Payment" />
            <TrustPill icon="💎" label="Premium Quality" />
          </div>
        </Reveal>

        <GlowDivider />

        {/* ── METRICS ── */}
        <Reveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            <MetricCard icon="📦" value={120} suffix="+" label="Products" />
            <MetricCard icon="👥" value={8500} suffix="+" label="Developers" />
            <MetricCard icon="⭐" value={4} suffix=".9" label="Avg Rating" />
            <MetricCard icon="🚀" value={99} suffix="%" label="Satisfaction" />
          </div>
        </Reveal>

        <GlowDivider />

        {/* ── FEATURED PRODUCTS ── */}
        <Reveal>
          <section>
            <SectionHeader
              eyebrow="Curated Collection"
              title={<><span className="gradient-text-violet">Featured</span>{" "}Products</>}
              subtitle="Hand-picked, production-ready codebases that ship fast and scale further."
            />
            <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: .7, ease: [.22, 1, .36, 1] }}>
              <FeaturedProducts />
            </motion.div>
          </section>
        </Reveal>

        <GlowDivider />

        {/* ── WHY US ── */}
        <Reveal>
          <section>
            <SectionHeader
              eyebrow="Why Choose Us"
              title={<>Built for{" "}<span className="gradient-text-cyan">Serious Builders</span></>}
              subtitle="Every codebase is architected to last — not just to demo."
            />
            <div className="grid md:grid-cols-3 gap-6">
              <FeatureCard icon="⏱️" title="Save Months of Work" description="Skip the scaffolding. Get battle-tested codebases that cut development time from months to minutes." delay={0} />
              <FeatureCard icon="🏗️" title="Production Ready" description="Built with scalable architecture, TypeScript-first, and industry-standard patterns that handle real traffic." delay={.1} />
              <FeatureCard icon="🎨" title="Easy Customization" description="Clean, well-documented code with separation of concerns — modify and launch your own product in days." delay={.2} />
            </div>
          </section>
        </Reveal>

        <GlowDivider />

        {/* ── SOCIAL PROOF ── */}
        <Reveal>
          <div className="relative rounded-3xl border border-white/[0.06] bg-gradient-to-br from-white/[0.03] to-white/[0.008] backdrop-blur-xl p-8 overflow-hidden">
            <div aria-hidden className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px,rgba(255,255,255,0.55) 1px,transparent 0)", backgroundSize: "28px 28px" }} />
            <div className="absolute top-0 left-0 w-40 h-40 blur-3xl rounded-full -translate-x-1/2 -translate-y-1/2" style={{ background: "rgba(124,58,237,0.06)" }} />
            <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              {[
                { quote: "Saved us 3 months of Frontend work. Absolutely worth it.", author: "Alex R.", role: "CTO, StartupX" },
                { quote: "The cleanest codebase I've purchased. Ship-ready from day one.", author: "Priya M.", role: "Solo Founder" },
                { quote: "Every component is plug-and-play. The docs are top-tier.", author: "Jordan K.", role: "Lead Dev, Agency" },
              ].map((t, i) => <TestimonialCard key={i} {...t} delay={i * .12} />)}
            </div>
          </div>
        </Reveal>

        <GlowDivider />

        {/* ── ABOUT FOUNDER ── */}
        <Reveal>
          <section className="relative">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div initial={{ opacity: 0, x: -28 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: .7, ease: [.22, 1, .36, 1] }} className="flex justify-center">
                <div className="relative float-anim">
                  <div className="absolute -inset-4 rounded-3xl blur-2xl" style={{ background: "linear-gradient(135deg,rgba(124,58,237,0.15),rgba(6,182,212,0.1))" }} />
                  <div className="absolute -inset-[2px] rounded-2xl" style={{ background: "linear-gradient(90deg,rgba(124,58,237,0.6),rgba(6,182,212,0.5),rgba(124,58,237,0.6))", backgroundSize: "300% 100%", animation: "spin-border 3.5s linear infinite" }} />
                  <div className="relative w-52 h-52 rounded-2xl overflow-hidden border border-white/10 shadow-2xl group">
                    <Image src="/founder.jpg" alt="Founder" fill sizes="208px" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute bottom-0 left-0 right-0 h-1/3" style={{ background: "linear-gradient(to top,rgba(6,6,16,0.6),transparent)" }} />
                  </div>
                </div>
              </motion.div>
              <motion.div initial={{ opacity: 0, x: 28 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: .7, delay: .1, ease: [.22, 1, .36, 1] }} className="space-y-4">
                <p className="text-[11px] font-bold tracking-[.26em] uppercase text-violet-400">Meet the Creator</p>
                <h2 className="text-3xl font-bold text-white leading-tight">About the{" "}<span className="gradient-text-cyan">Creator</span></h2>
                <p className="text-slate-500 text-sm leading-relaxed">Hi, I&apos;m <span className="text-white font-medium">Subhranshu Khatua</span> — a developer passionate about building high-performance AI tools and production-ready SaaS products.</p>
                <p className="text-slate-500 text-sm leading-relaxed">I created{" "}<span className="gradient-text-cyan font-medium">DevAstra</span>{" "}to eliminate the pain of starting from scratch every single time.</p>
                <p className="text-slate-500 text-sm leading-relaxed">Whether you&apos;re a solo founder, a student, or a dev agency — DevAstra gives you battle-tested, scalable codebases so you can focus on what actually matters — <span className="text-violet-400 font-medium">shipping your product.</span></p>
                <div className="w-12 h-px" style={{ background: "linear-gradient(90deg,rgba(124,58,237,0.6),transparent)" }} />
                <p className="font-medium pt-1 flex items-center gap-2 text-violet-400">
                  <motion.span className="w-1.5 h-1.5 rounded-full inline-block bg-violet-400" animate={{ opacity: [1, .4, 1], scale: [1, 1.5, 1] }} transition={{ duration: 2, repeat: Infinity }} />
                  Developed by — Subhranshu Khatua
                </p>
              </motion.div>
            </div>
          </section>
        </Reveal>

        <GlowDivider />

        {/* ── FINAL CTA ── */}
        <Reveal>
          <section className="relative text-center py-8">
            <div aria-hidden className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] pointer-events-none" style={{ background: "radial-gradient(ellipse,rgba(124,58,237,0.08) 0%,transparent 70%)", filter: "blur(50px)" }} />
            <div className="relative space-y-7">
              <motion.div initial={{ opacity: 0, scale: .92 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: .7 }}>
                <p className="text-[11px] font-bold tracking-[.26em] uppercase mb-4 text-violet-400">Ready to Launch?</p>
                <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white leading-tight">
                  Start Building{" "}<span className="gradient-text-violet">Today</span>{" "}🚀
                </h2>
              </motion.div>
              <motion.p initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: .15 }} className="text-slate-500 text-lg max-w-md mx-auto">Don&apos;t waste cycles — launch faster with premium, production-grade code.</motion.p>
              <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: .25 }} className="flex justify-center">
                <Link href="/products" className="hero-cta-primary inline-flex items-center gap-3">
                  <span>Browse Products</span>
                  <motion.span animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>→</motion.span>
                </Link>
              </motion.div>
              <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: .4 }} className="text-slate-700 text-xs tracking-wide">No subscription · One-time purchase · Instant access</motion.p>
            </div>
          </section>
        </Reveal>
      </div>

      <BackToTop />
    </main>
  );
}