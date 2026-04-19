// app/terms/page.tsx  (or pages/terms.tsx)
import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Terms & Conditions — DevAstra",
  description: "Terms of use for DevAstra digital products.",
};

export default function TermsPage() {
  const restrictions = ["No Reselling", "No Redistribution", "No Sharing Links"];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Share+Tech+Mono&family=Rajdhani:wght@300;400;500;600&display=swap');

        .terms-page {
          background-color: #020810;
          background-image:
            linear-gradient(rgba(0,245,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,245,255,0.025) 1px, transparent 1px);
          background-size: 44px 44px;
        }
        .terms-page::after {
          content: ''; position: fixed; inset: 0; z-index: 0;
          background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.055) 2px, rgba(0,0,0,0.055) 4px);
          pointer-events: none;
        }
        .t-blob { position: fixed; border-radius: 50%; filter: blur(90px); pointer-events: none; z-index: 0; }
        .t-font-orbitron  { font-family: 'Orbitron', monospace; }
        .t-font-mono      { font-family: 'Share Tech Mono', monospace; }

        /* Header */
        .t-header { opacity: 0; transform: translateY(-18px); animation: t-fadeDown .7s ease forwards .1s; }
        .t-tagline::before { content: ''; width: 32px; height: 1px; background: #00f5ff; box-shadow: 0 0 8px #00f5ff; }
        .t-h1-glow {
          font-family: 'Orbitron', monospace; font-weight: 900; text-transform: uppercase;
          letter-spacing: 2px; line-height: 1.1;
          text-shadow: 0 0 30px rgba(0,245,255,0.3), 0 0 60px rgba(0,128,255,0.15);
        }
        .t-pulse { width: 6px; height: 6px; border-radius: 50%; background: #00f5ff; box-shadow: 0 0 6px #00f5ff; animation: t-pulse 2s ease infinite; flex-shrink: 0; }

        /* TOC */
        .t-toc { opacity: 0; animation: t-fadeUp .6s ease forwards .5s; }
        .t-chip { display: inline-flex; align-items: center; gap: 6px; padding: 7px 14px; border: 1px solid rgba(0,245,255,0.13); background: rgba(0,245,255,0.02); border-radius: 2px; font-family: 'Share Tech Mono', monospace; font-size: 10px; color: #4a7a8a; letter-spacing: 1px; text-decoration: none; transition: all .2s; }
        .t-chip:hover { border-color: rgba(0,245,255,0.38); color: #00f5ff; background: rgba(0,245,255,0.05); }

        /* Cards */
        .t-card { border-radius: 4px; overflow: hidden; position: relative; transition: border-color .3s, box-shadow .3s; backdrop-filter: blur(8px); }
        .t-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px; opacity: 0; transition: opacity .3s; }
        .t-card:hover::before { opacity: 1; }

        .t-c-default { border: 1px solid rgba(0,245,255,0.13); background: linear-gradient(135deg,rgba(0,245,255,0.03),rgba(0,40,80,0.18)); }
        .t-c-default::before { background: linear-gradient(90deg,transparent,rgba(0,245,255,0.5),transparent); }
        .t-c-default:hover { border-color: rgba(0,245,255,0.38); box-shadow: 0 0 24px rgba(0,245,255,0.05); }

        .t-c-gold { border: 1px solid rgba(255,204,68,0.18); border-left: 3px solid #ffcc44; background: linear-gradient(135deg,rgba(255,204,68,0.04),rgba(0,40,80,0.18)); }
        .t-c-gold::before { background: linear-gradient(90deg,transparent,rgba(255,204,68,0.5),transparent); }
        .t-c-gold:hover { border-color: rgba(255,204,68,0.38); box-shadow: 0 0 24px rgba(255,204,68,0.06); }

        .t-c-red { border: 1px solid rgba(255,68,85,0.2); border-left: 3px solid #ff4455; background: linear-gradient(135deg,rgba(255,68,85,0.04),rgba(0,40,80,0.18)); }
        .t-c-red::before { background: linear-gradient(90deg,transparent,rgba(255,68,85,0.5),transparent); }
        .t-c-red:hover { border-color: rgba(255,68,85,0.38); box-shadow: 0 0 24px rgba(255,68,85,0.06); }

        .t-c-cyan { border: 1px solid rgba(0,245,255,0.2); border-left: 3px solid #00f5ff; background: linear-gradient(135deg,rgba(0,245,255,0.05),rgba(0,40,80,0.18)); }
        .t-c-cyan:hover { border-color: rgba(0,245,255,0.38); box-shadow: 0 0 24px rgba(0,245,255,0.07); }

        .t-c-purple { border: 1px solid rgba(157,111,255,0.2); border-left: 3px solid #9d6fff; background: linear-gradient(135deg,rgba(157,111,255,0.04),rgba(0,40,80,0.18)); }
        .t-c-purple::before { background: linear-gradient(90deg,transparent,rgba(157,111,255,0.5),transparent); }
        .t-c-purple:hover { border-color: rgba(157,111,255,0.38); box-shadow: 0 0 24px rgba(157,111,255,0.06); }

        .t-c-amber { border: 1px solid rgba(255,170,0,0.2); border-left: 3px solid #ffaa00; background: linear-gradient(135deg,rgba(255,170,0,0.04),rgba(0,40,80,0.18)); }
        .t-c-amber::before { background: linear-gradient(90deg,transparent,rgba(255,170,0,0.5),transparent); }
        .t-c-amber:hover { border-color: rgba(255,170,0,0.4); box-shadow: 0 0 24px rgba(255,170,0,0.06); }

        /* Section reveal */
        .t-section { opacity: 0; transform: translateY(22px); transition: opacity .55s ease, transform .55s ease; }
        .t-section.visible { opacity: 1; transform: translateY(0); }

        /* Restrictions grid */
        .t-restrict-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; margin-top: 18px; }
        .t-restrict-item { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 14px 10px; border: 1px solid rgba(255,68,85,0.2); background: rgba(255,68,85,0.04); border-radius: 3px; text-align: center; font-family: 'Share Tech Mono', monospace; font-size: 10px; color: #ff8899; letter-spacing: 1px; transition: all .2s; }
        .t-restrict-item:hover { border-color: rgba(255,68,85,0.45); color: #ff4455; background: rgba(255,68,85,0.08); }
        .t-restrict-x { font-size: 18px; font-family: 'Orbitron', monospace; font-weight: 900; color: #ff4455; display: block; margin-bottom: 2px; }

        /* Footer */
        .t-footer { opacity: 0; animation: t-fadeUp .6s ease forwards 1.4s; }

        @keyframes t-fadeDown { to { opacity: 1; transform: translateY(0); } }
        @keyframes t-fadeUp   { to { opacity: 1; } }
        @keyframes t-pulse    { 0%,100%{opacity:1;transform:scale(1);}50%{opacity:.5;transform:scale(.8);} }
      `}</style>

      <main className="terms-page font-['Rajdhani',sans-serif] relative min-h-screen" style={{ color: "#a8d8e8" }}>

        {/* Blobs */}
        <div className="t-blob" style={{ width: 400, height: 400, background: "rgba(157,111,255,0.06)", top: -80, left: -100 }} />
        <div className="t-blob" style={{ width: 380, height: 380, background: "rgba(0,245,255,0.05)", bottom: "10%", right: -80 }} />
        <div className="t-blob" style={{ width: 280, height: 280, background: "rgba(255,204,68,0.04)", top: "45%", left: "35%" }} />

        <div className="relative z-10 max-w-3xl mx-auto px-6 py-16 pb-24">

          {/* ── Header ── */}
          <header className="t-header mb-14">
            <div className="t-tagline t-font-mono flex items-center gap-3 mb-4 text-cyan-400 uppercase" style={{ fontSize: 11, letterSpacing: "4px" }}>
              Legal Framework · DevAstra
            </div>
            <h1 className="t-h1-glow text-white" style={{ fontSize: "clamp(26px,5vw,44px)" }}>
              Terms{" "}
              <span style={{ color: "#ffcc44", textShadow: "0 0 24px rgba(255,204,68,0.35)" }}>&amp;</span>
              {" "}Conditions
            </h1>
            <p className="mt-3 text-[15px] leading-relaxed font-medium max-w-lg" style={{ color: "#4a7a8a" }}>
              By accessing{" "}
              <span className="t-font-mono text-cyan-400">DevAstra</span>
              , you agree to be bound by these terms. Please read carefully before using our platform or purchasing products.
            </p>
            <div
              className="inline-flex items-center gap-2 mt-5 px-4 py-2 rounded-sm t-font-mono"
              style={{ border: "1px solid rgba(0,245,255,0.13)", background: "rgba(0,245,255,0.03)", fontSize: 11, color: "#00c8d4", letterSpacing: "1.5px" }}
            >
              <span className="t-pulse" />
              Last Updated: 2025 · Version 3.0
            </div>
          </header>

          {/* ── TOC ── */}
          <nav className="t-toc flex flex-wrap gap-2 mb-9">
            {[
              { num: "01", label: "Digital Products", href: "#s1" },
              { num: "02", label: "License",          href: "#s2" },
              { num: "03", label: "Restrictions",     href: "#s3" },
              { num: "04", label: "Payments",         href: "#s4" },
              { num: "05", label: "Termination",      href: "#s5" },
              { num: "06", label: "Changes",          href: "#s6" },
            ].map(({ num, label, href }) => (
              <a key={num} href={href} className="t-chip">
                <span style={{ color: "#00f5ff", fontSize: 9 }}>{num}</span>
                {label}
              </a>
            ))}
          </nav>

          {/* ── Sections ── */}
          <div className="flex flex-col gap-4" id="t-sections">

            {/* S1 – Digital Products */}
            <div className="t-section" id="s1">
              <div className="t-card t-c-default">
                <div className="px-8 py-7">
                  <span className="t-font-mono block uppercase mb-2" style={{ fontSize: 10, color: "rgba(0,245,255,0.7)", letterSpacing: "3px" }}>Section 01 / 06</span>
                  <h2 className="t-font-orbitron text-white uppercase flex items-center gap-4 mb-4" style={{ fontSize: 13, fontWeight: 700, letterSpacing: "2px" }}>
                    Digital Products
                    <span className="flex-1 h-px" style={{ background: "linear-gradient(90deg,rgba(0,245,255,0.15),transparent)" }} />
                  </h2>
                  <p className="text-[15px] leading-[1.75]">
                    All products are digital and delivered electronically upon successful payment verification. No physical shipment is involved.
                  </p>
                </div>
              </div>
            </div>

            {/* S2 – License */}
            <div className="t-section" id="s2">
              <div className="t-card t-c-gold">
                <div className="px-8 py-7">
                  <span className="t-font-mono block uppercase mb-2" style={{ fontSize: 10, color: "rgba(0,245,255,0.7)", letterSpacing: "3px" }}>Section 02 / 06</span>
                  <h2 className="t-font-orbitron uppercase flex items-center gap-4 mb-4" style={{ fontSize: 13, fontWeight: 700, letterSpacing: "2px", color: "#ffcc44", textShadow: "0 0 10px rgba(255,204,68,0.3)" }}>
                    License
                    <span className="flex-1 h-px" style={{ background: "linear-gradient(90deg,rgba(255,204,68,0.2),transparent)" }} />
                  </h2>
                  <p className="text-[15px] leading-[1.75]">
                    You are granted a{" "}
                    <strong style={{ color: "#ffcc44" }}>non-exclusive, non-transferable license</strong>{" "}
                    for personal or commercial use upon purchase of a qualifying product.
                  </p>
                  <div
                    className="inline-flex items-center gap-2 mt-4 px-4 py-[10px] rounded-sm t-font-mono"
                    style={{ border: "1px solid rgba(157,111,255,0.3)", background: "rgba(157,111,255,0.07)", fontSize: 11, color: "#9d6fff", letterSpacing: "1px" }}
                  >
                    🔑 Personal &amp; Commercial Use · Non-Transferable
                  </div>
                </div>
              </div>
            </div>

            {/* S3 – Restrictions */}
            <div className="t-section" id="s3">
              <div className="t-card t-c-red">
                <div className="px-8 py-7">
                  <span className="t-font-mono block uppercase mb-2" style={{ fontSize: 10, color: "rgba(0,245,255,0.7)", letterSpacing: "3px" }}>Section 03 / 06</span>
                  <h2 className="t-font-orbitron uppercase flex items-center gap-4 mb-4" style={{ fontSize: 13, fontWeight: 700, letterSpacing: "2px", color: "#ff4455", textShadow: "0 0 10px rgba(255,68,85,0.3)" }}>
                    Restrictions
                    <span className="flex-1 h-px" style={{ background: "linear-gradient(90deg,rgba(255,68,85,0.2),transparent)" }} />
                  </h2>
                  <p className="text-[15px] leading-[1.75]">
                    The following actions are strictly prohibited and may result in immediate termination of your license:
                  </p>
                  <div className="t-restrict-grid">
                    {restrictions.map((r) => (
                      <div key={r} className="t-restrict-item">
                        <span className="t-restrict-x">✕</span>
                        <span>{r}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* S4 – Payments */}
            <div className="t-section" id="s4">
              <div className="t-card t-c-cyan">
                <div className="px-8 py-7">
                  <span className="t-font-mono block uppercase mb-2" style={{ fontSize: 10, color: "rgba(0,245,255,0.7)", letterSpacing: "3px" }}>Section 04 / 06</span>
                  <h2 className="t-font-orbitron text-white uppercase flex items-center gap-4 mb-4" style={{ fontSize: 13, fontWeight: 700, letterSpacing: "2px" }}>
                    Payments
                    <span className="flex-1 h-px" style={{ background: "linear-gradient(90deg,rgba(0,245,255,0.2),transparent)" }} />
                  </h2>
                  <p className="text-[15px] leading-[1.75]">
                    All payments are processed securely via Razorpay. We do not store any card or banking credentials on our servers.
                  </p>
                  <div
                    className="inline-flex items-center gap-2 mt-4 px-4 py-[10px] rounded-sm t-font-mono"
                    style={{ border: "1px solid rgba(0,245,255,0.2)", background: "rgba(0,245,255,0.04)", fontSize: 11, color: "#00f5ff", letterSpacing: "1px" }}
                  >
                    🔒 Razorpay Secured · PCI-DSS Compliant · Encrypted Transit
                  </div>
                </div>
              </div>
            </div>

            {/* S5 – Termination */}
            <div className="t-section" id="s5">
              <div className="t-card t-c-purple">
                <div className="px-8 py-7">
                  <span className="t-font-mono block uppercase mb-2" style={{ fontSize: 10, color: "rgba(0,245,255,0.7)", letterSpacing: "3px" }}>Section 05 / 06</span>
                  <h2 className="t-font-orbitron uppercase flex items-center gap-4 mb-4" style={{ fontSize: 13, fontWeight: 700, letterSpacing: "2px", color: "#9d6fff", textShadow: "0 0 10px rgba(157,111,255,0.3)" }}>
                    Termination
                    <span className="flex-1 h-px" style={{ background: "linear-gradient(90deg,rgba(157,111,255,0.2),transparent)" }} />
                  </h2>
                  <p className="text-[15px] leading-[1.75]">
                    We reserve the right to{" "}
                    <strong style={{ color: "#9d6fff" }}>terminate access</strong>{" "}
                    if misuse, policy violations, or unauthorised distribution of our products is detected — without prior notice or refund.
                  </p>
                </div>
              </div>
            </div>

            {/* S6 – Changes */}
            <div className="t-section" id="s6">
              <div className="t-card t-c-amber">
                <div className="px-8 py-7">
                  <span className="t-font-mono block uppercase mb-2" style={{ fontSize: 10, color: "rgba(0,245,255,0.7)", letterSpacing: "3px" }}>Section 06 / 06</span>
                  <h2 className="t-font-orbitron uppercase flex items-center gap-4 mb-4" style={{ fontSize: 13, fontWeight: 700, letterSpacing: "2px", color: "#ffaa00", textShadow: "0 0 10px rgba(255,170,0,0.3)" }}>
                    Changes
                    <span className="flex-1 h-px" style={{ background: "linear-gradient(90deg,rgba(255,170,0,0.2),transparent)" }} />
                  </h2>
                  <p className="text-[15px] leading-[1.75]">
                    Terms may be updated at any time without prior notice. Continued use of DevAstra after changes constitutes your acceptance of the revised terms.
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* ── Footer ── */}
          <footer
            className="t-footer mt-14 pt-7 text-center t-font-mono"
            style={{ borderTop: "1px solid rgba(0,245,255,0.12)", fontSize: 12, color: "#4a7a8a", letterSpacing: "1px" }}
          >
            <p>
              © 2025 <span style={{ color: "#00f5ff" }}>DevAstra</span> · All rights reserved · Legal Framework v3.0
            </p>
          </footer>

        </div>

        {/* Scroll reveal */}
        <Script id="terms-anim" strategy="afterInteractive">
          {`
            const obs = new IntersectionObserver(entries => {
              entries.forEach((e, i) => {
                if (e.isIntersecting) {
                  setTimeout(() => e.target.classList.add('visible'), i * 80);
                  obs.unobserve(e.target);
                }
              });
            }, { threshold: 0.08 });
            document.querySelectorAll('.t-section').forEach(s => obs.observe(s));
            setTimeout(() => {
              document.querySelectorAll('.t-section').forEach((s, i) => {
                if (s.getBoundingClientRect().top < window.innerHeight)
                  setTimeout(() => s.classList.add('visible'), i * 100 + 300);
              });
            }, 100);
          `}
        </Script>
      </main>
    </>
  );
}