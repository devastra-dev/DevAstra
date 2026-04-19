"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SupportPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [ticketId, setTicketId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [emailValid, setEmailValid] = useState(false);
  const [clock, setClock] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const tick = () => setClock(new Date().toLocaleTimeString("en-US", { hour12: false }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const validateEmail = (val: string) => {
    setEmail(val);
    setEmailValid(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val));
  };

  const handleSubmit = async () => {
    setError("");
    if (!email || !message) { setError("All fields are required."); return; }
    if (!emailValid) { setError("Enter a valid email address."); return; }
    if (message.length < 10) { setError("Message must be at least 10 characters."); return; }

    setLoading(true);
    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, message }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
        setTicketId(data.ticketId || `TKT-${Date.now().toString(36).toUpperCase()}`);
        setEmail(""); setMessage("");
      } else {
        setError(data.error || "Something went wrong.");
      }
    } catch {
      setError("Network error. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyTicket = () => {
    if (!ticketId) return;
    navigator.clipboard.writeText(ticketId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center px-4 py-10 bg-[#020408] overflow-hidden">

      {/* ── GRID BG ── */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(0,255,255,0.03) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(0,255,255,0.03) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* ── GLOW ORBS ── */}
      <div className="absolute top-[-100px] left-1/4 w-[500px] h-[500px] rounded-full pointer-events-none animate-pulse"
        style={{ background: "radial-gradient(circle, rgba(0,255,255,0.12) 0%, transparent 70%)", filter: "blur(80px)" }} />
      <div className="absolute bottom-[-80px] right-[5%] w-[400px] h-[400px] rounded-full pointer-events-none animate-pulse"
        style={{ background: "radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)", filter: "blur(80px)" }} />
      <div className="absolute top-[40%] left-[50%] w-[300px] h-[300px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)", filter: "blur(80px)" }} />

      {/* ── CARD ── */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-[560px]"
      >
        {/* Corner accents */}
        {[
          "top-[-1px] left-[-1px] border-t-2 border-l-2 border-cyan-400",
          "top-[-1px] right-[-1px] border-t-2 border-r-2 border-cyan-400",
          "bottom-[-1px] left-[-1px] border-b-2 border-l-2 border-blue-500",
          "bottom-[-1px] right-[-1px] border-b-2 border-r-2 border-blue-500",
        ].map((cls, i) => (
          <div key={i} className={`absolute w-5 h-5 z-20 pointer-events-none ${cls}`} />
        ))}

        <div
          className="relative rounded-[20px] p-10 backdrop-blur-[40px] overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          {/* Top shimmer line */}
          <div className="absolute top-0 left-[10%] right-[10%] h-px"
            style={{ background: "linear-gradient(90deg, transparent, rgba(0,255,255,0.5), transparent)" }} />

          {/* STATUS BAR */}
          <div className="flex items-center justify-between mb-8 px-3 py-2 rounded-lg"
            style={{ background: "rgba(0,255,255,0.04)", border: "1px solid rgba(0,255,255,0.12)" }}>
            <div className="flex items-center gap-2">
              <div className="w-[7px] h-[7px] rounded-full bg-green-400 animate-ping" style={{ boxShadow: "0 0 0 0 rgba(0,255,136,0.5)" }} />
              <span className="text-[11px] text-green-400 font-mono tracking-widest">SYSTEM ONLINE</span>
            </div>
            <span className="text-[11px] text-white/30 font-mono">{clock}</span>
            <span className="text-[11px] text-cyan-400/50 font-mono tracking-wider">😎</span>
          </div>

          {/* HEADER */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] text-cyan-400 tracking-widest uppercase font-medium mb-4"
              style={{ background: "rgba(0,255,255,0.06)", border: "1px solid rgba(0,255,255,0.2)" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              Support Command Center
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Need Assistance?</h1>
            <p className="text-sm text-white/35">Encrypted channel &nbsp;·&nbsp; Priority response within hours</p>
          </div>

          <AnimatePresence mode="wait">
            {success ? (
              /* ── SUCCESS ── */
              <motion.div key="success"
                initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
                className="text-center py-4"
              >
                <div className="relative w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
                  style={{ background: "rgba(0,255,136,0.08)", border: "1px solid rgba(0,255,136,0.2)" }}>
                  <div className="absolute inset-[-6px] rounded-full animate-pulse"
                    style={{ border: "1px solid rgba(0,255,136,0.15)" }} />
                  <svg className="w-9 h-9 text-green-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-white mb-2">Message Transmitted</h2>
                <p className="text-sm text-white/35 mb-6">Our team has received your encrypted request.</p>

                {ticketId && (
                  <div className="inline-flex items-center gap-3 px-5 py-3 rounded-lg mb-6"
                    style={{ background: "rgba(0,255,255,0.04)", border: "1px solid rgba(0,255,255,0.15)" }}>
                    <div>
                      <div className="text-[10px] text-white/35 uppercase tracking-widest mb-0.5">Ticket ID</div>
                      <div className="text-sm font-mono text-cyan-400 font-medium">{ticketId}</div>
                    </div>
                    <button onClick={copyTicket}
                      className="px-3 py-1 rounded-md text-[11px] text-cyan-400 font-medium transition"
                      style={{ background: "rgba(0,255,255,0.1)", border: "1px solid rgba(0,255,255,0.2)" }}>
                      {copied ? "Copied!" : "Copy"}
                    </button>
                  </div>
                )}

                <div className="text-[11px] text-white/20 font-mono mb-6">Save this ID for future reference</div>
                <button onClick={() => { setSuccess(false); setTicketId(null); }}
                  className="px-8 py-3 rounded-xl text-sm font-medium text-white/60 transition hover:text-white hover:bg-white/5"
                  style={{ border: "1px solid rgba(255,255,255,0.12)" }}>
                  ↩ &nbsp; Send Another Request
                </button>
              </motion.div>

            ) : (
              /* ── FORM ── */
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {/* Email */}
                <div className="mb-5">
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="text-[11px] text-cyan-400/60 uppercase tracking-widest font-medium">Email Address</span>
                    <span className={`ml-auto w-1.5 h-1.5 rounded-full transition-all ${emailValid ? "bg-green-400 shadow-[0_0_8px_rgba(0,255,136,0.5)]" : "bg-white/10"}`} />
                  </div>
                  <input type="email" value={email} onChange={e => validateEmail(e.target.value)}
                    placeholder="yourname@company.com"
                    className="w-full h-12 px-4 rounded-xl text-sm text-white placeholder-white/20 outline-none transition-all focus:shadow-[0_0_0_3px_rgba(0,255,255,0.08)]"
                    style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.08)" }}
                    onFocus={e => e.target.style.borderColor = "rgba(0,255,255,0.4)"}
                    onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.08)"}
                  />
                </div>

                {/* Message */}
                <div className="mb-5">
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="text-[11px] text-cyan-400/60 uppercase tracking-widest font-medium">Describe Your Issue</span>
                    <span className="ml-auto text-[10px] text-white/25 font-mono">{message.length} / 500</span>
                  </div>
                  <textarea value={message} onChange={e => setMessage(e.target.value.slice(0, 500))}
                    rows={5} placeholder="Tell us exactly what happened — the more detail, the faster we resolve it..."
                    className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-white/20 outline-none resize-none leading-relaxed transition-all"
                    style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.08)" }}
                    onFocus={e => e.target.style.borderColor = "rgba(0,255,255,0.4)"}
                    onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.08)"}
                  />
                </div>

                {/* Error */}
                {error && (
                  <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg mb-4 text-sm text-red-400"
                    style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)" }}>
                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    {error}
                  </motion.div>
                )}

                {/* Submit */}
                <button onClick={handleSubmit} disabled={loading}
                  className="relative w-full h-[52px] rounded-xl font-semibold text-[15px] text-white overflow-hidden transition-all disabled:opacity-60 disabled:cursor-not-allowed hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(0,212,255,0.35)] active:scale-[0.99]"
                  style={{ background: "linear-gradient(135deg, #00d4ff 0%, #3b82f6 50%, #8b5cf6 100%)" }}>
                  <div className="absolute inset-0 pointer-events-none"
                    style={{
                      background: "linear-gradient(transparent, rgba(255,255,255,0.08), transparent)",
                      animation: "scan 2.5s ease-in-out infinite",
                    }} />
                  <div className="relative flex items-center justify-center gap-2">
                    {loading ? (
                      <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Transmitting...</>
                    ) : (
                      <><svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                      </svg>Send Encrypted Message</>
                    )}
                  </div>
                </button>

                {/* Trust pills */}
                <div className="flex flex-wrap gap-2 justify-center mt-4">
                  {[
                    { color: "#00ff88", label: "Military-grade encryption" },
                    { color: "#00ffff", label: "Priority for customers" },
                    { color: "#a78bfa", label: "Zero data retention" },
                  ].map(({ color, label }) => (
                    <div key={label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] text-white/35"
                      style={{ border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.03)" }}>
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: color, boxShadow: `0 0 5px ${color}66` }} />
                      {label}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* DIVIDER */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-white/5" />
            <span className="text-[11px] text-white/20 uppercase tracking-widest">instant channel</span>
            <div className="flex-1 h-px bg-white/5" />
          </div>

          {/* WHATSAPP */}
          <a href="https://wa.me/919339016057" target="_blank" rel="noreferrer"
            className="flex items-center gap-3 w-full px-5 py-3.5 rounded-xl text-sm font-medium text-green-400 transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(37,211,102,0.15)]"
            style={{ border: "1px solid rgba(37,211,102,0.2)", background: "rgba(37,211,102,0.05)" }}>
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="#25d366">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            Need instant help? Chat on WhatsApp
            <span className="ml-auto opacity-50 transition group-hover:opacity-100">→</span>
          </a>
        </div>
      </motion.div>

      <style>{`
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(300%); }
        }
      `}</style>
    </main>
  );
}