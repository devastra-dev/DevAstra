"use client";
import { useEffect, useRef, useState } from "react";

const PARTICLES = Array.from({ length: 38 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 1.5 + 0.4,
  speed: Math.random() * 18 + 10,
  delay: Math.random() * 8,
  opacity: Math.random() * 0.45 + 0.1,
}));

function GlowOrb({ style }) {
  return (
    <div
      style={{
        position: "absolute",
        borderRadius: "50%",
        filter: "blur(80px)",
        pointerEvents: "none",
        ...style,
      }}
    />
  );
}

function ScanLine() {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background:
          "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,255,200,0.012) 3px, rgba(0,255,200,0.012) 4px)",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}

function HexIcon({ children, color = "#00ffc8" }) {
  return (
    <div style={{ position: "relative", width: 48, height: 48, flexShrink: 0 }}>
      <svg width="48" height="48" viewBox="0 0 48 48" style={{ position: "absolute", top: 0, left: 0 }}>
        <polygon
          points="24,2 44,13 44,35 24,46 4,35 4,13"
          fill="none"
          stroke={color}
          strokeWidth="1.2"
          opacity="0.7"
        />
        <polygon
          points="24,8 38,16 38,32 24,40 10,32 10,16"
          fill={color}
          opacity="0.07"
        />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 20,
          color,
        }}
      >
        {children}
      </div>
    </div>
  );
}

function DataTag({ label, value, accent = "#00ffc8" }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "6px 14px",
        borderRadius: 4,
        border: `1px solid ${accent}22`,
        background: `${accent}09`,
        fontFamily: "'Courier Prime', monospace",
        fontSize: 11,
        color: "#7effe8",
        letterSpacing: "0.08em",
      }}
    >
      <span style={{ color: accent, opacity: 0.5 }}>//</span>
      <span style={{ color: "#4a9e94", textTransform: "uppercase" }}>{label}</span>
      <span style={{ color: "#b0fff5", marginLeft: 4 }}>{value}</span>
    </div>
  );
}

function SectionCard({ icon, title, accentColor = "#00ffc8", children, delay = 0 }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      ref={ref}
      style={{
        position: "relative",
        background: "rgba(5, 20, 18, 0.72)",
        border: "1px solid rgba(0,255,200,0.13)",
        borderRadius: 12,
        padding: "28px 32px",
        backdropFilter: "blur(18px)",
        transform: visible ? "translateY(0)" : "translateY(28px)",
        opacity: visible ? 1 : 0,
        transition: "transform 0.7s cubic-bezier(.16,1,.3,1), opacity 0.7s ease",
        overflow: "hidden",
      }}
    >
      {/* Corner accents */}
      <div style={{ position: "absolute", top: 0, left: 0, width: 20, height: 20, borderTop: `2px solid ${accentColor}`, borderLeft: `2px solid ${accentColor}`, borderRadius: "12px 0 0 0", opacity: 0.6 }} />
      <div style={{ position: "absolute", top: 0, right: 0, width: 20, height: 20, borderTop: `2px solid ${accentColor}`, borderRight: `2px solid ${accentColor}`, borderRadius: "0 12px 0 0", opacity: 0.6 }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, width: 20, height: 20, borderBottom: `2px solid ${accentColor}`, borderLeft: `2px solid ${accentColor}`, borderRadius: "0 0 0 12px", opacity: 0.6 }} />
      <div style={{ position: "absolute", bottom: 0, right: 0, width: 20, height: 20, borderBottom: `2px solid ${accentColor}`, borderRight: `2px solid ${accentColor}`, borderRadius: "0 0 12px 0", opacity: 0.6 }} />

      {/* Glow line top */}
      <div style={{ position: "absolute", top: 0, left: "20%", right: "20%", height: 1, background: `linear-gradient(90deg, transparent, ${accentColor}55, transparent)` }} />

      <div style={{ display: "flex", alignItems: "flex-start", gap: 18, position: "relative", zIndex: 1 }}>
        <HexIcon color={accentColor}>{icon}</HexIcon>
        <div style={{ flex: 1 }}>
          <h2 style={{
            fontFamily: "'Orbitron', sans-serif",
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: accentColor,
            marginBottom: 12,
            marginTop: 4,
          }}>
            {title}
          </h2>
          {children}
        </div>
      </div>
    </div>
  );
}

function ExceptionItem({ icon, text, delay }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: 14,
      padding: "13px 18px",
      borderRadius: 8,
      border: "1px solid rgba(0,255,200,0.1)",
      background: "rgba(0,255,200,0.04)",
      transform: visible ? "translateX(0)" : "translateX(-20px)",
      opacity: visible ? 1 : 0,
      transition: "transform 0.6s cubic-bezier(.16,1,.3,1), opacity 0.6s ease",
    }}>
      <div style={{
        width: 8, height: 8, borderRadius: 2,
        background: "linear-gradient(135deg, #00ffc8, #0af)",
        boxShadow: "0 0 8px #00ffc8aa",
        flexShrink: 0,
        transform: "rotate(45deg)",
      }} />
      <span style={{
        fontFamily: "'Courier Prime', monospace",
        fontSize: 13,
        color: "#a0ede3",
        letterSpacing: "0.04em",
      }}>{text}</span>
      <div style={{ marginLeft: "auto", fontSize: 16 }}>{icon}</div>
    </div>
  );
}

export default function RefundPage() {
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [headerVisible, setHeaderVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHeaderVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      setMousePos({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;900&family=Courier+Prime:wght@400;700&family=Inter:wght@300;400&display=swap');

        @keyframes float-particle {
          0% { transform: translateY(0px) translateX(0px); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 0.6; }
          100% { transform: translateY(-120vh) translateX(20px); opacity: 0; }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }
        @keyframes rotate-hex {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .shimmer-text {
          background: linear-gradient(90deg, #00ffc8 0%, #ffffff 40%, #00ffc8 60%, #0af 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 4s linear infinite;
        }
        .card-hover {
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }
        .card-hover:hover {
          border-color: rgba(0,255,200,0.3) !important;
          box-shadow: 0 0 30px rgba(0,255,200,0.08), 0 20px 60px rgba(0,0,0,0.4);
        }
      `}</style>

      <main style={{
        minHeight: "100vh",
        background: "#020f0d",
        position: "relative",
        overflow: "hidden",
        fontFamily: "'Inter', sans-serif",
      }}>
        <ScanLine />

        {/* Dynamic mouse-following glow */}
        <div style={{
          position: "fixed",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,255,200,0.06) 0%, transparent 70%)",
          left: `${mousePos.x}%`,
          top: `${mousePos.y}%`,
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
          transition: "left 1.2s ease, top 1.2s ease",
          zIndex: 0,
        }} />

        {/* Background orbs */}
        <GlowOrb style={{ width: 500, height: 500, background: "rgba(0,255,200,0.05)", top: -100, right: -100 }} />
        <GlowOrb style={{ width: 400, height: 400, background: "rgba(0,160,255,0.04)", bottom: -80, left: -80 }} />
        <GlowOrb style={{ width: 300, height: 300, background: "rgba(0,255,200,0.03)", top: "40%", left: "30%" }} />

        {/* Floating particles */}
        {PARTICLES.map((p) => (
          <div key={p.id} style={{
            position: "fixed",
            left: `${p.x}%`,
            bottom: "-10px",
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            background: "#00ffc8",
            boxShadow: "0 0 4px #00ffc8",
            opacity: p.opacity,
            animation: `float-particle ${p.speed}s ${p.delay}s infinite linear`,
            pointerEvents: "none",
            zIndex: 1,
          }} />
        ))}

        {/* Scanning beam */}
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0,
          height: 2,
          background: "linear-gradient(90deg, transparent, rgba(0,255,200,0.4), transparent)",
          animation: "scan 8s linear infinite",
          zIndex: 2,
          pointerEvents: "none",
        }} />

        {/* Grid overlay */}
        <div style={{
          position: "fixed",
          inset: 0,
          backgroundImage: "linear-gradient(rgba(0,255,200,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,200,0.025) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          pointerEvents: "none",
          zIndex: 0,
        }} />

        <div style={{ position: "relative", zIndex: 3, maxWidth: 780, margin: "0 auto", padding: "80px 24px 80px" }}>

          {/* Status bar */}
          <div style={{
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
            marginBottom: 40,
            transform: headerVisible ? "translateY(0)" : "translateY(-20px)",
            opacity: headerVisible ? 1 : 0,
            transition: "all 0.6s ease",
          }}>
            <DataTag label="system" value="POLICY_ENGINE_v4.2" />
            <DataTag label="status" value="ACTIVE" accent="#00ff88" />
            <DataTag label="ref" value="RFC-7231" />
          </div>

          {/* HEADER */}
          <div style={{
            marginBottom: 56,
            transform: headerVisible ? "translateY(0)" : "translateY(30px)",
            opacity: headerVisible ? 1 : 0,
            transition: "all 0.8s cubic-bezier(.16,1,.3,1) 0.1s",
          }}>
            {/* Decorative line */}
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
              <div style={{ height: 1, width: 40, background: "linear-gradient(90deg, transparent, #00ffc8)" }} />
              <span style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 10, letterSpacing: "0.3em", color: "#00ffc8", opacity: 0.6, textTransform: "uppercase" }}>
                Document Class: Policy
              </span>
              <div style={{ height: 1, flex: 1, background: "linear-gradient(90deg, #00ffc8, transparent)" }} />
            </div>

            <h1 style={{
              fontFamily: "'Orbitron', sans-serif",
              fontSize: "clamp(2rem, 6vw, 3.4rem)",
              fontWeight: 900,
              lineHeight: 1.05,
              margin: 0,
              letterSpacing: "-0.01em",
            }}>
              <span className="shimmer-text">REFUND</span>
              <br />
              <span style={{ color: "rgba(255,255,255,0.85)", fontSize: "0.62em", letterSpacing: "0.15em", fontWeight: 400 }}>
                POLICY MATRIX
              </span>
            </h1>

            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 20 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#00ff88", boxShadow: "0 0 8px #00ff88", animation: "pulse-glow 2s infinite" }} />
              <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: 12, color: "#4a9e94", letterSpacing: "0.1em" }}>
                SYSTEM INITIALIZED — ALL TERMS ENFORCED
              </span>
              <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: 12, color: "#00ffc8", animation: "blink 1.2s infinite", marginLeft: 4 }}>█</span>
            </div>
          </div>

          {/* CARDS */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Card 1: No Refund */}
            <SectionCard icon="⊘" title="No Refund Protocol" accentColor="#ff4466" delay={200}>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#9cc9c2", lineHeight: 1.75, margin: 0 }}>
                Due to the intrinsic nature of digital products, all transactions are considered <span style={{ color: "#ff8899", fontWeight: 600 }}>final and irreversible</span> upon completion. Once a product has been downloaded or accessed, no refund will be issued under standard protocol.
              </p>
              <div style={{ marginTop: 16, padding: "10px 14px", borderRadius: 6, border: "1px solid rgba(255,68,102,0.2)", background: "rgba(255,68,102,0.06)", display: "flex", gap: 10, alignItems: "center" }}>
                <span style={{ fontSize: 14 }}>🔒</span>
                <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: 11, color: "#ff8899", letterSpacing: "0.08em" }}>TRANSACTION_STATE: IMMUTABLE_AFTER_ACCESS</span>
              </div>
            </SectionCard>

            {/* Card 2: Exceptions */}
            <SectionCard icon="◈" title="Exception Protocols" accentColor="#00ffc8" delay={350}>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#9cc9c2", lineHeight: 1.75, marginBottom: 16, marginTop: 0 }}>
                Refund consideration may be initiated <em>only</em> under the following verified conditions:
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <ExceptionItem
                  icon="📦"
                  text="Product delivery failure — item not received post-transaction"
                  delay={500}
                />
                <ExceptionItem
                  icon="⚡"
                  text="Payment deducted but access credentials not provisioned"
                  delay={620}
                />
              </div>
              <div style={{ marginTop: 16, padding: "8px 14px", borderRadius: 6, border: "1px solid rgba(0,255,200,0.12)", background: "rgba(0,255,200,0.04)", fontFamily: "'Courier Prime', monospace", fontSize: 11, color: "#4a9e94", letterSpacing: "0.06em" }}>
                <span style={{ color: "#00ffc8" }}>→</span> EXCEPTIONS ARE REVIEWED CASE-BY-CASE
              </div>
            </SectionCard>

            {/* Card 3: Contact */}
            <SectionCard icon="◉" title="Initiate Support Request" accentColor="#0af" delay={500}>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#9cc9c2", lineHeight: 1.75, marginBottom: 20, marginTop: 0 }}>
                For refund requests or access disputes, contact our support team within the <span style={{ color: "#66ccff", fontWeight: 600 }}>24-hour response window</span> from time of transaction.
              </p>

              {/* CTA Button */}
              <button
                onClick={() => {}}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "14px 28px",
                  borderRadius: 6,
                  border: "1px solid rgba(0,170,255,0.4)",
                  background: "linear-gradient(135deg, rgba(0,170,255,0.1), rgba(0,255,200,0.06))",
                  color: "#66ccff",
                  fontFamily: "'Orbitron', sans-serif",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  position: "relative",
                  overflow: "hidden",
                  transition: "all 0.3s ease",
                  boxShadow: "0 0 20px rgba(0,170,255,0.08)",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = "linear-gradient(135deg, rgba(0,170,255,0.2), rgba(0,255,200,0.12))";
                  e.currentTarget.style.boxShadow = "0 0 30px rgba(0,170,255,0.2), 0 0 60px rgba(0,255,200,0.06)";
                  e.currentTarget.style.borderColor = "rgba(0,170,255,0.7)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = "linear-gradient(135deg, rgba(0,170,255,0.1), rgba(0,255,200,0.06))";
                  e.currentTarget.style.boxShadow = "0 0 20px rgba(0,170,255,0.08)";
                  e.currentTarget.style.borderColor = "rgba(0,170,255,0.4)";
                }}
              >
                <span style={{ fontSize: 16 }}>◈</span>
                Contact Support
                <span style={{ opacity: 0.5 }}>→</span>
              </button>

              <div style={{ marginTop: 16, display: "flex", gap: 8, alignItems: "center" }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#0af", boxShadow: "0 0 6px #0af", animation: "pulse-glow 2.5s infinite" }} />
                <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: 11, color: "#4a9e94", letterSpacing: "0.08em" }}>
                  RESPONSE_SLA: 24H · PRIORITY_QUEUE: ENABLED
                </span>
              </div>
            </SectionCard>

          </div>

          {/* Footer */}
          <div style={{
            marginTop: 56,
            display: "flex",
            alignItems: "center",
            gap: 16,
            opacity: 0.4,
          }}>
            <div style={{ height: 1, flex: 1, background: "linear-gradient(90deg, transparent, rgba(0,255,200,0.3))" }} />
            <span style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 9, letterSpacing: "0.25em", color: "#00ffc8", textTransform: "uppercase" }}>
              End of Policy Document
            </span>
            <div style={{ height: 1, flex: 1, background: "linear-gradient(90deg, rgba(0,255,200,0.3), transparent)" }} />
          </div>

          <div style={{ textAlign: "center", marginTop: 20 }}>
            <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: 10, color: "#1e4a42", letterSpacing: "0.12em" }}>
              © SYSTEM v4.2 · POLICY_HASH: 0xA3F7B2 · ALL RIGHTS RESERVED
            </span>
          </div>

        </div>
      </main>
    </>
  );
}
