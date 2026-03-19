// components/checkout/SuccessOverlay.jsx
"use client";

import { CheckCircle2, Sparkles, ArrowRight } from "lucide-react";

const STYLES = `
  @keyframes overlayIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes cardIn {
    0%   { opacity: 0; transform: scale(0.82) translateY(24px); }
    65%  { transform: scale(1.03) translateY(-4px); }
    100% { opacity: 1; transform: scale(1) translateY(0); }
  }
  @keyframes checkPop {
    0%   { opacity: 0; transform: scale(0.4); }
    60%  { transform: scale(1.22); }
    100% { opacity: 1; transform: scale(1); }
  }
  @keyframes ringExpand {
    0%   { transform: scale(0.6); opacity: 0.6; }
    100% { transform: scale(2.2); opacity: 0; }
  }
  @keyframes shimmerSweep {
    from { transform: translateX(-100%); }
    to   { transform: translateX(250%);  }
  }
  @keyframes goldGlow {
    0%,100% { box-shadow: 0 6px 28px rgba(20,14,4,0.32), 0 0 0 0 rgba(201,168,76,0); }
    50%      { box-shadow: 0 6px 28px rgba(20,14,4,0.32), 0 0 0 5px rgba(201,168,76,0.18); }
  }
  @keyframes confettiDrop {
    0%   { opacity: 1; transform: translateY(-10px) rotate(0deg); }
    100% { opacity: 0; transform: translateY(60px) rotate(360deg); }
  }

  .success-overlay { animation: overlayIn 0.3s ease both; }
  .success-card    { animation: cardIn 0.55s cubic-bezier(0.34,1.18,0.64,1) 0.05s both; }
  .check-icon      { animation: checkPop 0.5s cubic-bezier(0.34,1.3,0.64,1) 0.25s both; }

  .ring-pulse {
    position: absolute; inset: -4px;
    border-radius: 50%;
    border: 2px solid rgba(34,197,94,0.4);
    animation: ringExpand 1.2s ease 0.4s both;
  }

  .cta-btn {
    position: relative; overflow: hidden;
    display: flex; align-items: center; justify-content: center; gap: 9px;
    width: 100%; padding: 15px 0; border-radius: 14px; border: none;
    background: linear-gradient(120deg,#140e04 0%,#3a2408 45%,#5a3a0c 65%,#140e04 100%);
    color: #fff; font-family:'Jost',sans-serif; font-size:13px; font-weight:700;
    letter-spacing:0.15em; text-transform:uppercase; cursor:pointer;
    animation: goldGlow 3s ease infinite;
    transition: transform 0.25s, box-shadow 0.25s;
  }
  .cta-btn::before {
    content:''; position:absolute; top:0; left:12%; right:12%; height:1px;
    background:linear-gradient(90deg,transparent,rgba(201,168,76,0.65),transparent);
  }
  .cta-btn .sweep {
    position:absolute; inset:0;
    background:linear-gradient(105deg,transparent 25%,rgba(201,168,76,0.2) 50%,transparent 75%);
    transform:translateX(-100%);
  }
  .cta-btn:hover { transform:translateY(-2px); box-shadow:0 12px 32px rgba(20,14,4,0.4); }
  .cta-btn:hover .sweep { animation: shimmerSweep 0.65s ease forwards; }
  .cta-btn:active { transform: translateY(0); }

  .confetti-dot {
    position: absolute;
    width: 7px; height: 7px;
    border-radius: 2px;
    animation: confettiDrop 1.2s ease forwards;
  }
`;

/* little confetti pieces */
const CONFETTI = [
  { color: "#C9A84C", top: "10%", left: "15%", delay: "0.3s",  rotate: "15deg"  },
  { color: "#86efac", top: "8%",  left: "50%", delay: "0.45s", rotate: "-20deg" },
  { color: "#fcd34d", top: "12%", left: "78%", delay: "0.35s", rotate: "30deg"  },
  { color: "#C9A84C", top: "6%",  left: "35%", delay: "0.5s",  rotate: "-10deg" },
  { color: "#a78bfa", top: "9%",  left: "65%", delay: "0.4s",  rotate: "45deg"  },
];

export default function SuccessOverlay({ onClose }) {
  return (
    <>
      <style>{STYLES}</style>

      {/* ── BACKDROP ──────────────────────────────── */}
      <div
        className="success-overlay"
        style={{
          position: "fixed", inset: 0, zIndex: 9999,
          background: "rgba(10,8,4,0.72)",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "16px",
        }}
      >
        {/* ── CARD ──────────────────────────────────── */}
        <div
          className="success-card"
          style={{
            background: "#fff", borderRadius: 24,
            boxShadow: "0 24px 64px rgba(0,0,0,0.22), 0 0 0 1px rgba(201,168,76,0.12)",
            maxWidth: 400, width: "100%",
            padding: "44px 36px 36px",
            textAlign: "center",
            position: "relative", overflow: "hidden",
          }}
        >
          {/* top gold rule */}
          <div style={{
            position: "absolute", top: 0, left: "15%", right: "15%", height: 2,
            background: "linear-gradient(90deg, transparent, #C9A84C, transparent)",
            borderRadius: 2,
          }} />

          {/* confetti */}
          {CONFETTI.map((c, i) => (
            <div
              key={i}
              className="confetti-dot"
              style={{
                background: c.color,
                top: c.top, left: c.left,
                animationDelay: c.delay,
                transform: `rotate(${c.rotate})`,
              }}
            />
          ))}

          {/* ── CHECK ICON ──────────────────────── */}
          <div style={{ position: "relative", display: "inline-block", marginBottom: 22 }}>
            {/* ripple ring */}
            <div className="ring-pulse" />
            <div
              className="check-icon"
              style={{
                width: 72, height: 72, borderRadius: "50%",
                background: "linear-gradient(135deg, #dcfce7, #bbf7d0)",
                display: "flex", alignItems: "center", justifyContent: "center",
                border: "2px solid #86efac",
                position: "relative", zIndex: 1,
              }}
            >
              <CheckCircle2 size={34} color="#16a34a" strokeWidth={1.7} />
            </div>
          </div>

          {/* ── HEADING ─────────────────────────── */}
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 30, fontWeight: 700,
            color: "#1a1205", margin: "0 0 10px",
            lineHeight: 1.2,
          }}>
            Order Placed! 🎉
          </h2>

          <p style={{
            fontSize: 14, color: "#6b7280", margin: "0 0 6px",
            fontFamily: "'Jost', sans-serif", fontWeight: 500, lineHeight: 1.6,
          }}>
            Your order has been successfully placed.
            <br />We'll send you a confirmation shortly.
          </p>

          <p style={{
            fontSize: 12.5, color: "#C9A84C", fontWeight: 700,
            margin: "0 0 30px", fontFamily: "'Jost', sans-serif",
            letterSpacing: "0.04em",
          }}>
            ✦ Expected delivery in 5–7 business days ✦
          </p>

          {/* ── ORDER ID CHIP ───────────────────── */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "#fdfaf6", border: "1.5px solid #EDE5D8",
            borderRadius: 30, padding: "7px 18px", marginBottom: 28,
          }}>
            <Sparkles size={13} color="#C9A84C" />
            <span style={{
              fontSize: 12, fontWeight: 700, color: "#7a6030",
              fontFamily: "'Jost', sans-serif", letterSpacing: "0.08em",
            }}>
              Order confirmed
            </span>
          </div>

          {/* ── CTA BUTTON ──────────────────────── */}
          <button className="cta-btn" onClick={onClose}>
            <span className="sweep" />
            <span style={{ position: "relative", zIndex: 1 }}>Continue Shopping</span>
            <ArrowRight size={14} style={{ position: "relative", zIndex: 1 }} />
          </button>
        </div>
      </div>
    </>
  );
}