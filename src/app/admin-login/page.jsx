
// ─────────────────────────────────────────────────────────────
// IMPORTANT: This file lives at app/admin-login/page.jsx
// NOT inside app/admin/ — so admin/layout.jsx auth guard
// never runs on this page. Route: /admin-login
// ─────────────────────────────────────────────────────────────
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Eye, EyeOff, Lock, Mail, Sparkles,
  ShieldCheck, AlertCircle, ArrowRight,
} from "lucide-react";

const ADMIN_EMAIL    = "admin@banishq.com";
const ADMIN_PASSWORD = "Admin@Banishq123";

function setAdminCookie() {
  const token = btoa(JSON.stringify({ role: "admin", email: ADMIN_EMAIL }));
  document.cookie = `banishq_token=${token}; path=/; max-age=${60 * 60 * 24}; SameSite=Lax`;
}

export default function AdminLoginPage() {
  const router = useRouter();

  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");
  const [success,  setSuccess]  = useState(false);
  const [mounted,  setMounted]  = useState(false);

  useEffect(() => {
    setTimeout(() => setMounted(true), 80);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password.");
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    if (
      email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase() &&
      password === ADMIN_PASSWORD
    ) {
      setAdminCookie();
      setSuccess(true);
      setTimeout(() => {
        window.location.href = "/admin";
      }, 1100);
    } else {
      setLoading(false);
      setError("Invalid email or password. Please try again.");
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Jost:wght@300;400;500;600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        /* ── Hide site header & footer on admin login ── */
        header, footer,
        [class*="header"], [class*="Header"],
        [class*="footer"], [class*="Footer"],
        [class*="nav"], [class*="Nav"] {
          display: none !important;
        }

        /* ── Remove header offset padding ── */
        main {
          padding-top: 0 !important;
        }

        body {
          background: #F7F3EE;
          font-family: 'Jost', sans-serif;
          min-height: 100vh;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @keyframes shimmer {
          from { transform: translateX(-100%); }
          to   { transform: translateX(250%);  }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes checkIn {
          from { opacity: 0; transform: scale(0.5); }
          to   { opacity: 1; transform: scale(1);   }
        }
        @keyframes orbitSpin {
          from { transform: rotate(0deg);   }
          to   { transform: rotate(360deg); }
        }

        .card-enter {
          opacity: 0;
          transform: translateY(28px);
          transition: opacity .6s ease, transform .6s cubic-bezier(.22,1,.36,1);
        }
        .card-enter.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .al-input {
          width: 100%;
          padding: 13px 16px 13px 46px;
          border-radius: 12px;
          border: 1.5px solid #E5D9C8;
          background: #FDFAF6;
          color: #1a1205;
          font-size: 14px;
          font-family: 'Jost', sans-serif;
          outline: none;
          transition: border-color .2s, box-shadow .2s, background .2s;
        }
        .al-input:focus {
          border-color: #C9A84C;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(201,168,76,.1);
        }
        .al-input::placeholder { color: #C4B49A; }
        .al-input:disabled { opacity: .6; cursor: not-allowed; }

        .al-btn {
          position: relative;
          width: 100%;
          padding: 14px;
          border-radius: 13px;
          border: none;
          background: linear-gradient(120deg, #1a1205 0%, #3a2408 50%, #1a1205 100%);
          color: #f5ede0;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: .16em;
          text-transform: uppercase;
          cursor: pointer;
          overflow: hidden;
          font-family: 'Jost', sans-serif;
          transition: transform .25s, box-shadow .25s;
          box-shadow: 0 6px 24px rgba(26,18,5,.18);
        }
        .al-btn::before {
          content: '';
          position: absolute;
          top: 0; left: 12%; right: 12%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(201,168,76,.6), transparent);
        }
        .al-btn .sweep {
          position: absolute; inset: 0;
          background: linear-gradient(105deg, transparent 25%, rgba(201,168,76,.18) 50%, transparent 75%);
          transform: translateX(-100%);
        }
        .al-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(26,18,5,.28);
        }
        .al-btn:hover:not(:disabled) .sweep { animation: shimmer .65s ease forwards; }
        .al-btn:active:not(:disabled) { transform: translateY(0); }
        .al-btn:disabled { opacity: .65; cursor: not-allowed; }

        .eye-btn {
          background: none; border: none;
          cursor: pointer; color: #C4B49A;
          padding: 4px; display: flex;
          align-items: center; transition: color .2s;
        }
        .eye-btn:hover { color: #C9A84C; }

        @media (max-width: 480px) {
          .al-input {
            font-size: 13px;
            padding: 12px 14px 12px 42px;
          }
          .al-btn {
            font-size: 12px;
            padding: 13px;
            letter-spacing: .12em;
          }
        }
      `}</style>

      {/* ── Page wrapper ── */}
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(145deg, #F7F3EE 0%, #EDE5D8 50%, #F4EFE6 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "120px 20px 60px",
        position: "relative",
        overflow: "hidden",
      }}>

        {/* ── Soft background orbs ── */}
        <div style={{
          position: "absolute", top: -80, right: -80,
          width: 400, height: 400, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(201,168,76,.09) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: -60, left: -60,
          width: 320, height: 320, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(201,168,76,.07) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        {/* ── Subtle dot grid ── */}
        <svg style={{
          position: "absolute", inset: 0, width: "100%", height: "100%",
          opacity: .4, pointerEvents: "none",
        }}>
          <defs>
            <pattern id="dots" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.2" fill="#C9A84C" opacity=".2" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>

        {/* ── Spinning ornament top-left ── */}
        <svg style={{
          position: "absolute", top: 28, left: 28,
          width: 150, height: 150, opacity: .12,
          animation: "orbitSpin 70s linear infinite",
          pointerEvents: "none",
        }} viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="88" fill="none" stroke="#C9A84C" strokeWidth="1" strokeDasharray="5 10" />
          <circle cx="100" cy="100" r="56" fill="none" stroke="#C9A84C" strokeWidth=".6" strokeDasharray="3 12" />
        </svg>

        {/* ── Spinning ornament bottom-right ── */}
        <svg style={{
          position: "absolute", bottom: 28, right: 28,
          width: 170, height: 170, opacity: .09,
          animation: "orbitSpin 90s linear infinite reverse",
          pointerEvents: "none",
        }} viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="88" fill="none" stroke="#C9A84C" strokeWidth="1" strokeDasharray="4 12" />
        </svg>

        {/* ── Login Card ── */}
        <div
          className={`card-enter ${mounted ? "visible" : ""}`}
          style={{
            width: "100%",
            maxWidth: 420,
            background: "#fff",
            border: "1.5px solid #EDE5D8",
            borderRadius: 24,
            overflow: "hidden",
            boxShadow: "0 20px 60px rgba(26,18,5,.1), 0 4px 16px rgba(201,168,76,.08)",
            position: "relative",
          }}
        >
          {/* Gold top accent */}
          <div style={{
            height: 4,
            background: "linear-gradient(90deg, #C9A84C, #e8c96a, #C9A84C)",
          }} />

          <div style={{ padding: "32px 28px 28px" }}>

            {/* ── Brand header ── */}
            <div style={{ textAlign: "center", marginBottom: 30 }}>
              <div style={{
                width: 58, height: 58, borderRadius: 18, margin: "0 auto 16px",
                background: "linear-gradient(135deg, #FDF9F0, #F5EDE0)",
                border: "1.5px solid #EDE5D8",
                boxShadow: "0 4px 16px rgba(201,168,76,.12)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <ShieldCheck size={26} color="#C9A84C" strokeWidth={1.5} />
              </div>

              <h1 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 28, fontWeight: 700, color: "#1a1205",
                letterSpacing: ".05em", margin: "0 0 10px",
              }}>
                BANISHQ
              </h1>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 9, marginBottom: 10 }}>
                <div style={{ height: 1, width: 30, background: "linear-gradient(90deg, transparent, #C9A84C)" }} />
                <Sparkles size={11} color="#C9A84C" />
                <div style={{ height: 1, width: 30, background: "linear-gradient(90deg, #C9A84C, transparent)" }} />
              </div>

              <span style={{
                display: "inline-block",
                fontSize: 10, fontWeight: 700, letterSpacing: ".3em",
                textTransform: "uppercase", color: "#C9A84C",
                background: "#FDF9F0", border: "1px solid rgba(201,168,76,.25)",
                padding: "4px 14px", borderRadius: 99,
              }}>
                Admin Portal
              </span>
            </div>

            {/* ── Success ── */}
            {success ? (
              <div style={{
                textAlign: "center", padding: "20px 0 8px",
                animation: "checkIn .4s cubic-bezier(.22,1,.36,1) both",
              }}>
                <div style={{
                  width: 62, height: 62, borderRadius: "50%", margin: "0 auto 14px",
                  background: "rgba(34,197,94,.1)", border: "2px solid rgba(34,197,94,.25)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <ShieldCheck size={28} color="#22c55e" strokeWidth={1.6} />
                </div>
                <p style={{ color: "#22c55e", fontWeight: 700, fontSize: 15, margin: "0 0 5px" }}>
                  Access Granted
                </p>
                <p style={{ color: "#A89880", fontSize: 12 }}>Redirecting to admin panel…</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>

                {/* Error */}
                {error && (
                  <div style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "11px 14px", borderRadius: 11, marginBottom: 18,
                    background: "rgba(239,68,68,.06)", border: "1.5px solid rgba(239,68,68,.2)",
                    animation: "fadeUp .3s ease both",
                  }}>
                    <AlertCircle size={14} color="#ef4444" style={{ flexShrink: 0 }} />
                    <p style={{ margin: 0, fontSize: 12.5, color: "#ef4444", fontWeight: 500 }}>{error}</p>
                  </div>
                )}

                {/* Email */}
                <div style={{ marginBottom: 14 }}>
                  <label style={{
                    fontSize: 10.5, fontWeight: 700, letterSpacing: ".18em",
                    textTransform: "uppercase", color: "#A89880",
                    display: "block", marginBottom: 7,
                  }}>
                    Admin Email
                  </label>
                  <div style={{ position: "relative" }}>
                    <Mail size={15} color="#C4B49A" style={{
                      position: "absolute", left: 15, top: "50%",
                      transform: "translateY(-50%)", pointerEvents: "none",
                    }} />
                    <input
                      type="email"
                      className="al-input"
                      value={email}
                      onChange={e => { setEmail(e.target.value); setError(""); }}
                      placeholder="admin@banishq.com"
                      autoComplete="email"
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Password */}
                <div style={{ marginBottom: 26 }}>
                  <label style={{
                    fontSize: 10.5, fontWeight: 700, letterSpacing: ".18em",
                    textTransform: "uppercase", color: "#A89880",
                    display: "block", marginBottom: 7,
                  }}>
                    Password
                  </label>
                  <div style={{ position: "relative" }}>
                    <Lock size={15} color="#C4B49A" style={{
                      position: "absolute", left: 15, top: "50%",
                      transform: "translateY(-50%)", pointerEvents: "none",
                    }} />
                    <input
                      type={showPass ? "text" : "password"}
                      className="al-input"
                      value={password}
                      onChange={e => { setPassword(e.target.value); setError(""); }}
                      placeholder="Enter admin password"
                      autoComplete="current-password"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      className="eye-btn"
                      onClick={() => setShowPass(v => !v)}
                      style={{ position: "absolute", right: 13, top: "50%", transform: "translateY(-50%)" }}
                    >
                      {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                {/* Submit */}
                <button type="submit" className="al-btn" disabled={loading}>
                  <span className="sweep" />
                  <span style={{
                    position: "relative", zIndex: 1,
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 9,
                  }}>
                    {loading ? (
                      <>
                        <div style={{
                          width: 15, height: 15, borderRadius: "50%",
                          border: "2px solid rgba(245,237,224,.25)",
                          borderTopColor: "#f5ede0",
                          animation: "spin .7s linear infinite",
                        }} />
                        Verifying…
                      </>
                    ) : (
                      <>
                        <ShieldCheck size={14} />
                        Enter Admin Panel
                        <ArrowRight size={14} />
                      </>
                    )}
                  </span>
                </button>

              </form>
            )}

            {/* Security note */}
            {!success && (
              <p style={{
                textAlign: "center", marginTop: 22,
                fontSize: 11, color: "#C4B49A", lineHeight: 1.8,
              }}>
                Restricted to authorised administrators only.<br />
                Unauthorised access attempts are logged.
              </p>
            )}
          </div>

          {/* Card footer */}
          <div style={{
            borderTop: "1px solid #F0EAE0",
            padding: "13px 20px",
            background: "#FDFAF6",
            display: "flex", alignItems: "center", justifyContent: "center",
            gap: 8, flexWrap: "wrap", textAlign: "center",
          }}>
            <Sparkles size={10} color="#C9A84C" style={{ flexShrink: 0 }} />
            <span style={{
              fontSize: 10.5, color: "#B8A080", letterSpacing: ".08em",
              whiteSpace: "nowrap",
            }}>
              BANISHQ · Premium Curated Collections
            </span>
            <Sparkles size={10} color="#C9A84C" style={{ flexShrink: 0 }} />
          </div>
        </div>
      </div>
    </>
  );
}