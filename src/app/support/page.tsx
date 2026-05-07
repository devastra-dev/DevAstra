"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ── FAQ data ── */
const FAQS = [
  {
    q: "How quickly will I receive my product?",
    a: "Downloads are instant after payment confirmation. You'll find all your purchases in your dashboard.",
  },
  {
    q: "What if I have issues with my purchase?",
    a: "Contact us through this form or WhatsApp. We respond within a few hours during business hours.",
  },
  {
    q: "Do I get lifetime access?",
    a: "Yes! All purchases include lifetime access and free updates to the product.",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="rounded-xl overflow-hidden cursor-pointer transition-all duration-300"
      style={{
        background: open ? "rgba(124,58,237,0.06)" : "rgba(255,255,255,0.025)",
        border: `1px solid ${open ? "rgba(124,58,237,0.3)" : "rgba(255,255,255,0.07)"}`,
      }}
      onClick={() => setOpen(!open)}
    >
      <div className="flex items-center justify-between px-5 py-4 gap-4">
        <p className="text-sm font-medium text-white">{q}</p>
        <motion.div
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-slate-400"
          style={{ border: "1px solid rgba(255,255,255,0.1)" }}
        >
          +
        </motion.div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="px-5 pb-4">
              <div className="h-px mb-4" style={{ background: "rgba(255,255,255,0.06)" }} />
              <p className="text-sm text-slate-400 leading-relaxed">{a}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function SupportPage() {
  const [email,      setEmail]      = useState("");
  const [message,    setMessage]    = useState("");
  const [loading,    setLoading]    = useState(false);
  const [success,    setSuccess]    = useState(false);
  const [ticketId,   setTicketId]   = useState<string | null>(null);
  const [error,      setError]      = useState("");
  const [emailValid, setEmailValid] = useState(false);
  const [clock,      setClock]      = useState("");
  const [copied,     setCopied]     = useState(false);

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
    if (!email || !message)        { setError("All fields are required."); return; }
    if (!emailValid)               { setError("Enter a valid email address."); return; }
    if (message.length < 10)       { setError("Message must be at least 10 characters."); return; }

    setLoading(true);
    try {
      const res  = await fetch("/api/support", {
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
    <main
      className="relative min-h-screen flex items-center justify-center px-4 py-20 overflow-hidden"
      style={{ position: "relative" }}
    >
      {/* Background */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-[-80px] left-1/4 w-[500px] h-[500px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)", filter: "blur(90px)" }} />
        <div className="absolute bottom-[-60px] right-[5%] w-[400px] h-[400px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%)", filter: "blur(90px)" }} />
      </div>

      <div className="w-full max-w-[600px] space-y-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center space-y-3"
        >
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[10px] font-mono text-violet-300 uppercase tracking-widest mb-2"
            style={{ background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.25)" }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
            Support Command Center
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">Need Assistance?</h1>
          <p className="text-slate-400 text-sm">Encrypted channel · Priority response within hours</p>
        </motion.div>

        {/* Main card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-3xl overflow-hidden"
          style={{
            background: "linear-gradient(145deg, rgba(255,255,255,0.055) 0%, rgba(255,255,255,0.01) 100%)",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
          }}
        >
          {/* Top shimmer */}
          <div aria-hidden className="absolute top-0 left-[15%] right-[15%] h-px"
            style={{ background: "linear-gradient(90deg, transparent, rgba(124,58,237,0.7), rgba(6,182,212,0.5), transparent)" }} />

          <div className="p-7 md:p-9 space-y-6">

            {/* Status bar */}
            <div
              className="flex items-center justify-between rounded-xl px-4 py-3"
              style={{ background: "rgba(0,0,0,0.25)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div className="flex items-center gap-2.5">
                <motion.div
                  className="w-2 h-2 rounded-full bg-emerald-400"
                  animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{ boxShadow: "0 0 8px rgba(52,211,153,0.6)" }}
                />
                <span className="text-[11px] text-emerald-400 font-mono tracking-widest uppercase">System Online</span>
              </div>
              <span className="text-[11px] text-slate-600 font-mono">{clock}</span>
            </div>

            <AnimatePresence mode="wait">
              {success ? (
                /* ── SUCCESS STATE ── */
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  className="text-center py-6 space-y-5"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.1 }}
                    className="relative w-16 h-16 mx-auto rounded-full flex items-center justify-center"
                    style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.3)", boxShadow: "0 0 30px rgba(16,185,129,0.15)" }}
                  >
                    <motion.div
                      className="absolute inset-[-6px] rounded-full"
                      style={{ border: "1px solid rgba(16,185,129,0.2)" }}
                      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.1, 0.5] }}
                      transition={{ duration: 2.5, repeat: Infinity }}
                    />
                    <svg className="w-7 h-7 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </motion.div>

                  <div>
                    <h2 className="text-xl font-bold text-white">Message Transmitted</h2>
                    <p className="text-sm text-slate-400 mt-1">Our team will respond as soon as possible.</p>
                  </div>

                  {ticketId && (
                    <div
                      className="inline-flex items-center gap-4 rounded-xl px-5 py-3"
                      style={{ background: "rgba(124,58,237,0.07)", border: "1px solid rgba(124,58,237,0.2)" }}
                    >
                      <div className="text-left">
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-mono mb-0.5">Ticket ID</p>
                        <p className="text-sm font-mono text-violet-300 font-semibold">{ticketId}</p>
                      </div>
                      <motion.button
                        onClick={copyTicket}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="text-[10px] font-mono px-3 py-1.5 rounded-lg text-violet-400 hover:text-white transition-colors duration-150"
                        style={{ background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.3)" }}
                      >
                        {copied ? "Copied!" : "Copy"}
                      </motion.button>
                    </div>
                  )}

                  <motion.button
                    onClick={() => { setSuccess(false); setTicketId(null); }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="text-sm text-slate-400 hover:text-white transition-colors duration-200 px-6 py-2.5 rounded-xl"
                    style={{ border: "1px solid rgba(255,255,255,0.1)" }}
                  >
                    ↩ Send Another Request
                  </motion.button>
                </motion.div>
              ) : (
                /* ── FORM STATE ── */
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-5"
                >
                  {/* Email field */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] text-slate-400 uppercase tracking-widest font-mono">Email Address</label>
                      <motion.div
                        className="w-2 h-2 rounded-full transition-colors duration-300"
                        style={{ background: emailValid ? "#10b981" : "rgba(255,255,255,0.12)", boxShadow: emailValid ? "0 0 8px rgba(16,185,129,0.6)" : "none" }}
                      />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => validateEmail(e.target.value)}
                      placeholder="you@company.com"
                      className="w-full h-12 px-4 rounded-xl text-sm text-white placeholder-slate-600 outline-none transition-all duration-200"
                      style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.08)" }}
                      onFocus={(e) => { e.target.style.borderColor = "rgba(124,58,237,0.5)"; e.target.style.boxShadow = "0 0 0 3px rgba(124,58,237,0.1)"; }}
                      onBlur={(e)  => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; e.target.style.boxShadow = "none"; }}
                    />
                  </div>

                  {/* Message field */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] text-slate-400 uppercase tracking-widest font-mono">Your Message</label>
                      <span className="text-[10px] text-slate-600 font-mono">{message.length} / 500</span>
                    </div>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value.slice(0, 500))}
                      rows={5}
                      placeholder="Describe your issue in detail — the more info, the faster we resolve it…"
                      className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-slate-600 outline-none resize-none leading-relaxed transition-all duration-200"
                      style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.08)" }}
                      onFocus={(e) => { e.target.style.borderColor = "rgba(124,58,237,0.5)"; e.target.style.boxShadow = "0 0 0 3px rgba(124,58,237,0.1)"; }}
                      onBlur={(e)  => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; e.target.style.boxShadow = "none"; }}
                    />
                  </div>

                  {/* Error */}
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm text-rose-400"
                        style={{ background: "rgba(244,63,94,0.08)", border: "1px solid rgba(244,63,94,0.2)" }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0">
                          <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><circle cx="12" cy="16" r="0.5" fill="currentColor" />
                        </svg>
                        {error}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Submit button */}
                  <motion.button
                    onClick={handleSubmit}
                    disabled={loading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center gap-3 rounded-xl py-3.5 text-sm font-bold text-white disabled:opacity-60 disabled:cursor-not-allowed relative overflow-hidden"
                    style={{
                      background: "linear-gradient(135deg, #7c3aed, #2563eb, #06b6d4)",
                      boxShadow: "0 4px 24px rgba(124,58,237,0.35)",
                    }}
                  >
                    {loading ? (
                      <>
                        <motion.span
                          className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                        />
                        Transmitting…
                      </>
                    ) : (
                      <>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                        </svg>
                        Send Message
                      </>
                    )}
                  </motion.button>

                  {/* Trust pills */}
                  <div className="flex flex-wrap gap-2 justify-center">
                    {[
                      { dot: "#10b981", text: "Encrypted channel" },
                      { dot: "#06b6d4", text: "Priority response" },
                      { dot: "#a78bfa", text: "Zero data retention" },
                    ].map(({ dot, text }) => (
                      <div
                        key={text}
                        className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] text-slate-500"
                        style={{ border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.025)" }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: dot, boxShadow: `0 0 5px ${dot}88` }} />
                        {text}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.05)" }} />
              <span className="text-[10px] text-slate-600 uppercase tracking-widest">Instant channel</span>
              <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.05)" }} />
            </div>

            {/* WhatsApp */}
            <motion.a
              href="https://wa.me/919339016057"
              target="_blank"
              rel="noreferrer"
              whileHover={{ y: -2 }}
              className="flex items-center gap-3 rounded-2xl px-5 py-4 transition-all duration-200"
              style={{ border: "1px solid rgba(37,211,102,0.2)", background: "rgba(37,211,102,0.04)" }}
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="#25d366">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              <div className="flex-1">
                <p className="text-sm font-medium text-emerald-400">Chat on WhatsApp</p>
                <p className="text-[11px] text-slate-500">Instant support for urgent issues</p>
              </div>
              <span className="text-slate-500 text-sm">→</span>
            </motion.a>
          </div>
        </motion.div>

        {/* FAQ section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-3"
        >
          <p className="text-[11px] font-mono text-slate-500 uppercase tracking-widest px-1">Frequently Asked</p>
          {FAQS.map((f) => (
            <FAQItem key={f.q} q={f.q} a={f.a} />
          ))}
        </motion.div>
      </div>
    </main>
  );
}