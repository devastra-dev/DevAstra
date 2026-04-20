"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "@/components/auth/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";

/* ─── Stylesheet (injected once) ─────────────────────────────────────────── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Figtree:wght@300;400;500;600&display=swap');

  :root {
    --c-bg:       #03080f;
    --c-surface:  rgba(4,14,30,0.88);
    --c-border:   rgba(56,189,248,0.18);
    --c-cyan:     #38bdf8;
    --c-cyan-dim: rgba(56,189,248,0.12);
    --c-teal:     #2dd4bf;
    --c-indigo:   #818cf8;
    --c-danger:   #f87171;
    --c-success:  #34d399;
    --c-text:     #e2eaf4;
    --c-muted:    rgba(148,163,184,0.7);
    --r-card:     22px;
    --r-input:    13px;
    --r-btn:      13px;
  }

  .af-root * { box-sizing: border-box; }
  .af-root { font-family: 'Figtree', sans-serif; }

  /* ── Page bg ── */
  .af-page {
    min-height: 100dvh;
    display: flex; align-items: center; justify-content: center;
    padding: 1.5rem;
    background: var(--c-bg);
    position: relative; overflow: hidden;
  }

  /* ── Animated mesh grid ── */
  .af-grid {
    position: absolute; inset: 0; z-index: 0;
    background-image:
      linear-gradient(rgba(56,189,248,0.055) 1px, transparent 1px),
      linear-gradient(90deg, rgba(56,189,248,0.055) 1px, transparent 1px);
    background-size: 40px 40px;
  }

  /* ── Drifting orbs ── */
  @keyframes af-drift-a {
    0%,100%{transform:translate(0,0) scale(1);}
    33%{transform:translate(30px,-22px) scale(1.08);}
    66%{transform:translate(-18px,14px) scale(.94);}
  }
  @keyframes af-drift-b {
    0%,100%{transform:translate(0,0) scale(1);}
    40%{transform:translate(-25px,18px) scale(1.1);}
    70%{transform:translate(15px,-10px) scale(.92);}
  }
  @keyframes af-drift-c {
    0%,100%{transform:translate(0,0);}
    50%{transform:translate(12px,20px);}
  }
  .af-orb-a{animation:af-drift-a 11s ease-in-out infinite;}
  .af-orb-b{animation:af-drift-b 14s ease-in-out infinite;}
  .af-orb-c{animation:af-drift-c 8s ease-in-out infinite;}

  /* ── Animated card border ── */
  @keyframes af-border-spin {
    0%  {background-position:0% 50%;}
    50% {background-position:100% 50%;}
    100%{background-position:0% 50%;}
  }
  .af-card-wrap {
    position: relative; z-index:1;
    width: 100%; max-width: 420px;
    border-radius: var(--r-card);
  }
  .af-card-wrap::before {
    content:''; position:absolute; inset:-1.5px;
    border-radius: calc(var(--r-card) + 2px);
    background: linear-gradient(135deg,#38bdf8,#818cf8,#2dd4bf,#38bdf8);
    background-size: 300% 300%;
    animation: af-border-spin 5s linear infinite;
    z-index:-1;
  }

  /* ── Card ── */
  .af-card {
    position: relative;
    background: var(--c-surface);
    backdrop-filter: blur(28px);
    -webkit-backdrop-filter: blur(28px);
    border-radius: var(--r-card);
    padding: 2.1rem 2rem 1.85rem;
    overflow: hidden;
    box-shadow: 0 12px 60px rgba(0,0,0,.65), inset 0 0 0 1px rgba(255,255,255,.04);
  }

  /* ── Scan sweep ── */
  @keyframes af-scan {
    0%  {top:-90px; opacity:.22;}
    100%{top:110%;  opacity:0;}
  }
  .af-scan {
    position:absolute; left:0; right:0; height:90px; pointer-events:none;
    background: linear-gradient(to bottom, transparent, rgba(56,189,248,.09), transparent);
    animation: af-scan 4s linear infinite;
  }

  /* ── Corner brackets ── */
  .af-corner {
    position:absolute; width:15px; height:15px;
    border-color:rgba(56,189,248,.55); border-style:solid;
    transition: border-color .3s;
  }
  .af-card:hover .af-corner { border-color: rgba(56,189,248,.85); }
  .af-c-tl{top:9px;left:9px; border-width:2px 0 0 2px;}
  .af-c-tr{top:9px;right:9px;border-width:2px 2px 0 0;}
  .af-c-bl{bottom:9px;left:9px;border-width:0 0 2px 2px;}
  .af-c-br{bottom:9px;right:9px;border-width:0 2px 2px 0;}

  /* ── Slide-up stagger ── */
  @keyframes af-up {
    from{opacity:0;transform:translateY(16px);}
    to  {opacity:1;transform:translateY(0);}
  }
  .af-up   {animation: af-up .42s cubic-bezier(.22,.68,0,1.2) both;}
  .af-d0   {animation-delay:.02s;}
  .af-d1   {animation-delay:.08s;}
  .af-d2   {animation-delay:.14s;}
  .af-d3   {animation-delay:.20s;}
  .af-d4   {animation-delay:.26s;}
  .af-d5   {animation-delay:.32s;}
  .af-d6   {animation-delay:.38s;}
  .af-d7   {animation-delay:.44s;}

  /* ── Mode slide transition ── */
  @keyframes af-mode-in  {from{opacity:0;transform:translateX(18px);}to{opacity:1;transform:translateX(0);}}
  @keyframes af-mode-out {from{opacity:1;transform:translateX(0);}to{opacity:0;transform:translateX(-18px);}}
  .af-mode-enter { animation: af-mode-in  .28s cubic-bezier(.22,.68,0,1.1) forwards; }
  .af-mode-exit  { animation: af-mode-out .18s ease-in forwards; pointer-events:none; }

  /* ── Progress bar ── */
  @keyframes af-progress {
    0%  {width:0%;}
    60% {width:75%;}
    100%{width:100%;}
  }
  .af-progress {
    position:absolute; top:0; left:0; height:2.5px;
    background: linear-gradient(90deg, var(--c-cyan), var(--c-teal), var(--c-indigo));
    border-radius:0 2px 2px 0;
    animation: af-progress 1.8s ease-out forwards;
    box-shadow: 0 0 10px rgba(56,189,248,.6);
  }

  /* ── Inputs ── */
  .af-input {
    width:100%; border-radius:var(--r-input);
    border: 1px solid rgba(56,189,248,.18);
    background: rgba(2,10,24,.75);
    padding: .68rem 1rem;
    font-family:'Figtree',sans-serif; font-size:.875rem;
    color: var(--c-text);
    outline:none;
    transition: border-color .2s, background .2s, box-shadow .25s;
  }
  .af-input::placeholder{color:rgba(100,116,139,.55);}
  .af-input:focus {
    border-color: rgba(56,189,248,.65);
    background: rgba(56,189,248,.045);
    box-shadow: 0 0 18px rgba(56,189,248,.15);
  }
  .af-input-pr { padding-right: 2.8rem; }

  /* ── Label ── */
  .af-label {
    font-family:'Syne',sans-serif;
    font-size:.65rem; font-weight:600;
    letter-spacing:.14em; text-transform:uppercase;
    color: var(--c-muted);
    display:block; margin-bottom:6px;
  }

  /* ── Primary button ── */
  @keyframes af-shimmer {
    0%  {background-position:-200% center;}
    100%{background-position: 200% center;}
  }
  .af-btn-primary {
    width:100%; border:none; cursor:pointer;
    border-radius:var(--r-btn);
    padding:.76rem 1rem;
    font-family:'Syne',sans-serif; font-size:.72rem; font-weight:700;
    letter-spacing:.12em; text-transform:uppercase; color:#fff;
    display:flex; align-items:center; justify-content:center; gap:8px;
    background: linear-gradient(90deg,#0369a1 0%,#38bdf8 25%,#2dd4bf 50%,#38bdf8 75%,#0369a1 100%);
    background-size:200% auto;
    transition: background-position .45s, box-shadow .3s, transform .15s, opacity .2s;
    position:relative; overflow:hidden;
  }
  .af-btn-primary:hover:not(:disabled) {
    background-position:right center;
    box-shadow:0 0 30px rgba(56,189,248,.45), 0 4px 18px rgba(0,0,0,.4);
    transform:translateY(-1.5px);
  }
  .af-btn-primary:active:not(:disabled){transform:translateY(0);}
  .af-btn-primary:disabled{opacity:.55;cursor:not-allowed;}

  /* ── Google button ── */
  .af-btn-google {
    width:100%; cursor:pointer;
    border:1px solid rgba(56,189,248,.22);
    border-radius:var(--r-btn);
    background:rgba(3,10,24,.7);
    padding:.7rem 1rem;
    font-family:'Figtree',sans-serif; font-size:.82rem; font-weight:500;
    color: var(--c-text);
    display:flex; align-items:center; justify-content:center; gap:10px;
    transition:background .25s, border-color .25s, box-shadow .25s, transform .15s, opacity .2s;
  }
  .af-btn-google:hover:not(:disabled) {
    background:rgba(56,189,248,.07);
    border-color:rgba(56,189,248,.45);
    box-shadow:0 0 18px rgba(56,189,248,.18);
    transform:translateY(-1px);
  }
  .af-btn-google:disabled{opacity:.55;cursor:not-allowed;}

  /* ── Divider ── */
  .af-divider {
    display:flex; align-items:center; gap:.75rem;
    margin:.05rem 0;
  }
  .af-divider-line {
    flex:1; height:1px;
  }
  .af-divider-text {
    font-family:'Syne',sans-serif;
    font-size:.62rem; font-weight:600;
    letter-spacing:.14em;
    color:rgba(100,116,139,.6);
  }

  /* ── Nav links ── */
  .af-nav-link {
    background:none; border:none; cursor:pointer; padding:0;
    font-family:'Figtree',sans-serif; font-size:.78rem;
    color:rgba(56,189,248,.85);
    position:relative; display:inline-block;
    transition:color .2s;
  }
  .af-nav-link::after {
    content:''; position:absolute;
    left:0; bottom:-1px; width:0; height:1px;
    background:var(--c-cyan);
    transition:width .25s ease;
  }
  .af-nav-link:hover{color:var(--c-cyan);}
  .af-nav-link:hover::after{width:100%;}

  /* ── Error box ── */
  @keyframes af-shake {
    0%,100%{transform:translateX(0);}
    20%,60%{transform:translateX(-5px);}
    40%,80%{transform:translateX(5px);}
  }
  .af-error {
    border-radius:11px;
    background:rgba(127,29,29,.3);
    border:1px solid rgba(248,113,113,.25);
    padding:.6rem .9rem;
    font-size:.75rem; line-height:1.55;
    color:var(--c-danger);
    display:flex; align-items:flex-start; gap:7px;
  }
  .af-error-shake{animation:af-shake .38s ease;}

  /* ── Success box ── */
  .af-success {
    border-radius:11px;
    background:rgba(6,78,59,.3);
    border:1px solid rgba(52,211,153,.25);
    padding:.6rem .9rem;
    font-size:.75rem; line-height:1.55;
    color:var(--c-success);
    display:flex; align-items:flex-start; gap:7px;
  }

  /* ── Spinner ── */
  @keyframes af-spin{to{transform:rotate(360deg);}}
  .af-spinner {
    width:15px;height:15px;flex-shrink:0;
    border:2px solid rgba(255,255,255,.18);
    border-top-color:#fff; border-radius:50%;
    animation:af-spin .65s linear infinite;
  }

  /* ── Eye button ── */
  .af-eye {
    position:absolute; right:.78rem; top:50%;
    transform:translateY(-50%);
    background:none; border:none; cursor:pointer; padding:0; line-height:1;
    color:rgba(100,116,139,.7);
    transition:color .2s;
  }
  .af-eye:hover{color:var(--c-cyan);}

  /* ── Mode tabs ── */
  .af-tabs {
    display:flex; gap:4px;
    background:rgba(0,0,0,.35);
    border:1px solid rgba(56,189,248,.12);
    border-radius:12px; padding:4px;
    margin-bottom:1.6rem;
  }
  .af-tab {
    flex:1; padding:.45rem .5rem;
    border:none; cursor:pointer; border-radius:9px;
    font-family:'Syne',sans-serif; font-size:.63rem;
    font-weight:700; letter-spacing:.1em; text-transform:uppercase;
    transition:background .25s, color .25s, box-shadow .25s;
    color:rgba(148,163,184,.6);
    background:transparent;
  }
  .af-tab-active {
    background:rgba(56,189,248,.15);
    color:var(--c-cyan);
    box-shadow:0 0 12px rgba(56,189,248,.2);
  }

  /* ── Badge ── */
  .af-badge {
    display:inline-flex; align-items:center; gap:6px;
    padding:3px 11px; border-radius:99px;
    background:rgba(56,189,248,.08);
    border:1px solid rgba(56,189,248,.2);
    margin-bottom:.9rem;
  }
  .af-badge-dot {
    width:6px;height:6px;border-radius:50%;
    background:var(--c-cyan);
    box-shadow:0 0 6px var(--c-cyan);
  }
  .af-badge-text {
    font-family:'Syne',sans-serif;
    font-size:.58rem; font-weight:700;
    letter-spacing:.18em; text-transform:uppercase;
    color:rgba(56,189,248,.9);
  }

  /* ── Success checkmark ── */
  @keyframes af-check-draw{
    from{stroke-dashoffset:40;}
    to{stroke-dashoffset:0;}
  }
  .af-check-path{
    stroke-dasharray:40; stroke-dashoffset:40;
    animation:af-check-draw .5s .1s ease forwards;
  }
`;

function injectStyles() {
  const id = "af-styles-v2";
  if (typeof document !== "undefined" && !document.getElementById(id)) {
    const s = document.createElement("style");
    s.id = id; s.textContent = CSS;
    document.head.appendChild(s);
  }
}

/* ─── Tiny SVG helpers ───────────────────────────────────────────────────── */
function IconEye({ slash }: { slash?: boolean }) {
  return slash ? (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  ) : (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );
}

function IconArrow() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7"/>
    </svg>
  );
}

function IconMail() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
    </svg>
  );
}

function IconBack() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M12 19l-7-7 7-7"/>
    </svg>
  );
}

function GoogleSVG() {
  return (
    <svg width="16" height="16" viewBox="0 0 48 48">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    </svg>
  );
}

function SuccessCheck() {
  return (
    <svg width="38" height="38" viewBox="0 0 38 38">
      <circle cx="19" cy="19" r="18" fill="rgba(52,211,153,.12)" stroke="rgba(52,211,153,.4)" strokeWidth="1.5"/>
      <path className="af-check-path" d="M10 19 L16.5 25.5 L28 13" fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

/* ─── Main Component ─────────────────────────────────────────────────────── */
type Mode = "login" | "signup" | "reset";

export default function AuthForm() {
  const { user, loginWithGoogle, loginWithEmail, register, resetPassword } = useAuth();
  const router     = useRouter();
  const params     = useSearchParams();
  const redirect   = params.get("redirect") || "/dashboard";

  const [email,     setEmail]     = useState("");
  const [password,  setPassword]  = useState("");
  const [mode,      setMode]      = useState<Mode>("login");
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState<string | null>(null);
  const [success,   setSuccess]   = useState<string | null>(null);
  const [showPass,  setShowPass]  = useState(false);
  const [animKey,   setAnimKey]   = useState(0);   // remount fields on mode change
  const [resetDone, setResetDone] = useState(false);

  const errorRef = useRef<HTMLDivElement>(null);
  const mounted  = useRef(true);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);

  useEffect(() => { injectStyles(); }, []);

  /* 🔥 Already logged in → redirect */
  useEffect(() => {
    if (user) router.push(redirect);
  }, [user, router, redirect]);

  /* Shake error */
  useEffect(() => {
    if (error && errorRef.current) {
      errorRef.current.classList.remove("af-error-shake");
      void errorRef.current.offsetWidth;
      errorRef.current.classList.add("af-error-shake");
    }
  }, [error]);

  const switchMode = useCallback((next: Mode) => {
    setMode(next);
    setError(null);
    setSuccess(null);
    setEmail("");
    setPassword("");
    setResetDone(false);
    setAnimKey(k => k + 1);
  }, []);

  /* 🔥 Main handler */
  const handleSubmit = async () => {
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      if (mode === "login") {
        await loginWithEmail(email, password);
      } else if (mode === "signup") {
        await register(email, password);
      } else {
        await resetPassword(email);
        if (mounted.current) {
          setResetDone(true);
          setSuccess("Reset link sent! Check your inbox.");
        }
      }
    } catch (err) {
      if (mounted.current)
        setError((err as Error)?.message || "Authentication failed");
    } finally {
      if (mounted.current) setLoading(false);
    }
  };

  /* 🔥 Google */
  const handleGoogle = async () => {
    setError(null);
    setLoading(true);
    try {
      await loginWithGoogle();
    } catch (err) {
      if (mounted.current)
        setError((err as Error)?.message || "Google sign-in failed");
    } finally {
      if (mounted.current) setLoading(false);
    }
  };

  /* ── Labels per mode ── */
  const title = { login:"Welcome back", signup:"Create account", reset:"Reset password" }[mode];
  const subtitle = {
    login: "Sign in to access your library and downloads.",
    signup: "Sign up to save purchases and access downloads.",
    reset: "Enter your email and we'll send a reset link.",
  }[mode];
  const submitLabel = { login:"Sign In", signup:"Create Account", reset:"Send Reset Link" }[mode];
  const submitIcon  = mode === "reset" ? <IconMail /> : <IconArrow />;

  /* ── Render ── */
  return (
    <div className="af-root af-page">
      {/* Grid bg */}
      <div className="af-grid" />

      {/* Orbs */}
      <div className="af-orb-a" style={{
        position:"absolute", top:"12%", left:"8%", zIndex:0,
        width:360, height:360, borderRadius:"50%",
        background:"radial-gradient(circle,rgba(56,189,248,.11) 0%,transparent 70%)",
        filter:"blur(36px)",
      }}/>
      <div className="af-orb-b" style={{
        position:"absolute", bottom:"8%", right:"6%", zIndex:0,
        width:440, height:440, borderRadius:"50%",
        background:"radial-gradient(circle,rgba(45,212,191,.09) 0%,transparent 70%)",
        filter:"blur(44px)",
      }}/>
      <div className="af-orb-c" style={{
        position:"absolute", top:"52%", left:"60%", zIndex:0,
        width:220, height:220, borderRadius:"50%",
        background:"radial-gradient(circle,rgba(129,140,248,.08) 0%,transparent 70%)",
        filter:"blur(28px)",
      }}/>

      {/* Card wrapper (for animated border) */}
      <div className="af-card-wrap" key={animKey}>
        <div className="af-card">
          <div className="af-scan" />
          {/* Corners */}
          <div className="af-corner af-c-tl"/><div className="af-corner af-c-tr"/>
          <div className="af-corner af-c-bl"/><div className="af-corner af-c-br"/>

          {/* Loading progress bar */}
          {loading && <div className="af-progress" />}

          {/* ── Header ── */}
          <div className="af-up af-d0" style={{marginBottom:"1.5rem"}}>
            <div className="af-badge">
              <div className="af-badge-dot"/>
              <span className="af-badge-text">Secure Access</span>
            </div>
            <h1 style={{
              fontFamily:"'Syne',sans-serif", fontSize:"1.5rem",
              fontWeight:800, color:"#f0f9ff",
              letterSpacing:"-.02em", lineHeight:1.15,
              marginBottom:".38rem",
            }}>
              {title}
            </h1>
            <p style={{fontSize:".8rem", color:"var(--c-muted)", lineHeight:1.55}}>
              {subtitle}
            </p>
          </div>

          {/* ── Mode tabs (only login / signup) ── */}
          {mode !== "reset" && (
            <div className="af-tabs af-up af-d1">
              {(["login","signup"] as Mode[]).map(m => (
                <button key={m} className={`af-tab${mode===m?" af-tab-active":""}`}
                  onClick={() => switchMode(m)} type="button">
                  {m === "login" ? "Sign In" : "Sign Up"}
                </button>
              ))}
            </div>
          )}

          {/* ── Reset-done state ── */}
          {resetDone ? (
            <div style={{textAlign:"center", padding:"1.5rem 0 .5rem"}}>
              <div style={{display:"flex",justifyContent:"center",marginBottom:"1rem"}}>
                <SuccessCheck/>
              </div>
              <p style={{fontSize:".82rem",color:"var(--c-success)",marginBottom:".5rem",fontWeight:600}}>
                Check your inbox
              </p>
              <p style={{fontSize:".75rem",color:"var(--c-muted)",marginBottom:"1.5rem"}}>
                A reset link was sent to <strong style={{color:"var(--c-text)"}}>{email}</strong>
              </p>
              <button className="af-nav-link" onClick={() => switchMode("login")} type="button">
                <IconBack/>&nbsp; Back to sign in
              </button>
            </div>
          ) : (
            <>
              {/* ── Email ── */}
              <div className="af-up af-d2" style={{marginBottom:".95rem"}}>
                <label className="af-label">Email</label>
                <input
                  className="af-input"
                  type="email" placeholder="you@example.com"
                  value={email} onChange={e => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>

              {/* ── Password (hidden in reset mode) ── */}
              {mode !== "reset" && (
                <div className="af-up af-d3" style={{marginBottom:"1.1rem"}}>
                  <label className="af-label">Password</label>
                  <div style={{position:"relative"}}>
                    <input
                      className={`af-input af-input-pr`}
                      type={showPass ? "text" : "password"}
                      placeholder="••••••••"
                      value={password} onChange={e => setPassword(e.target.value)}
                      disabled={loading} minLength={6}
                    />
                    <button className="af-eye" type="button"
                      onClick={() => setShowPass(p=>!p)}
                      aria-label={showPass?"Hide password":"Show password"}>
                      <IconEye slash={showPass}/>
                    </button>
                  </div>
                </div>
              )}

              {/* ── Feedback ── */}
              {error && (
                <div ref={errorRef} className="af-error af-up" style={{marginBottom:".9rem"}}>
                  <span style={{flexShrink:0,marginTop:"1px"}}>⚠</span>
                  <span>{error}</span>
                </div>
              )}
              {success && (
                <div className="af-success af-up" style={{marginBottom:".9rem"}}>
                  <span style={{flexShrink:0,marginTop:"1px"}}>✓</span>
                  <span>{success}</span>
                </div>
              )}

              {/* ── Submit ── */}
              <button
                className="af-btn-primary af-up af-d4"
                type="button" disabled={loading}
                onClick={handleSubmit}
              >
                {loading ? <><span className="af-spinner"/>&nbsp;Please wait…</> : <>{submitLabel}&nbsp;{submitIcon}</>}
              </button>

              {/* ── Google (login + signup only) ── */}
              {mode !== "reset" && (
                <>
                  <div className="af-divider af-up af-d5" style={{margin:"1.15rem 0"}}>
                    <div className="af-divider-line" style={{background:"linear-gradient(to right,transparent,rgba(56,189,248,.2))"}}/>
                    <span className="af-divider-text">or</span>
                    <div className="af-divider-line" style={{background:"linear-gradient(to left,transparent,rgba(56,189,248,.2))"}}/>
                  </div>
                  <button
                    className="af-btn-google af-up af-d6"
                    type="button" disabled={loading}
                    onClick={handleGoogle}
                  >
                    <GoogleSVG/>
                    Continue with Google
                  </button>
                </>
              )}

              {/* ── Nav links ── */}
              <div className="af-up af-d7" style={{
                marginTop:"1.2rem", textAlign:"center",
                display:"flex", flexDirection:"column", gap:"8px",
              }}>
                {mode === "login" && (
                  <p style={{fontSize:".76rem",color:"var(--c-muted)"}}>
                    Forgot your password?{" "}
                    <button className="af-nav-link" type="button" onClick={() => switchMode("reset")}>
                      Reset it
                    </button>
                  </p>
                )}
                {mode === "reset" && (
                  <p style={{fontSize:".76rem",color:"var(--c-muted)"}}>
                    <button className="af-nav-link" type="button" onClick={() => switchMode("login")}>
                      <IconBack/>&nbsp;Back to sign in
                    </button>
                  </p>
                )}
                {mode === "signup" && (
                  <p style={{fontSize:".76rem",color:"var(--c-muted)"}}>
                    Already have an account?{" "}
                    <button className="af-nav-link" type="button" onClick={() => switchMode("login")}>
                      Sign in
                    </button>
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}