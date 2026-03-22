// app/sign-up/page.jsx
"use client";

export const dynamic = "force-dynamic";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, User, Mail, Lock, Check } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

/* ─────────────────────────────────────────────
   INNER COMPONENT — all logic lives here
   (wrapped in Suspense so useSearchParams works)
───────────────────────────────────────────── */
function SignUpForm() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const { login }    = useAuth();

  const redirectTo = searchParams.get("redirect") ?? "/profile";

  const [form, setForm]           = useState({ name: "", email: "", password: "" });
  const [showPass, setShowPass]   = useState(false);
  const [errors, setErrors]       = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]     = useState(false);

  /* ── Validation ── */
  const validate = () => {
    const e = {};
    if (!form.name.trim())                      e.name     = "Full name is required";
    if (!form.email.trim())                     e.email    = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email    = "Enter a valid email";
    if (!form.password)                         e.password = "Password is required";
    else if (form.password.length < 5)          e.password = "Minimum 5 characters";
    return e;
  };

  /* ── Field change ── */
  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  /* ── Submit ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1400));
    setLoading(false);
    setSubmitted(true);
    login({ name: form.name, email: form.email });
    setTimeout(() => router.push(redirectTo), 1800);
  };

  /* ── Social sign-ups ── */
  const handleGoogleSignup = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    login({ email: "googleuser@gmail.com", name: "Google User" });
    router.push(redirectTo);
  };

  const handleFacebookSignup = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    login({ email: "fbuser@facebook.com", name: "Facebook User" });
    router.push(redirectTo);
  };

  /* ── Password strength ── */
  const passLen = form.password.length;

  return (
    <>
      <style>{`
        @keyframes fadeUp  { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin    { to{transform:rotate(360deg)} }
        @keyframes checkIn { 0%{transform:scale(0);opacity:0} 70%{transform:scale(1.2)} 100%{transform:scale(1);opacity:1} }

        .form-input {
          width: 100%; padding: 13px 14px 13px 40px;
          border: 1.5px solid #e2e2e2; border-radius: 8px;
          font-size: 14px; color: #1a1a1a; background: #fff;
          box-sizing: border-box; outline: none;
          transition: border-color .2s, box-shadow .2s;
        }
        .form-input:focus       { border-color: #1a1a1a; box-shadow: 0 0 0 3px rgba(26,26,26,.07); }
        .form-input.error       { border-color: #e53935 !important; }
        .form-input::placeholder{ color: #bbb; }

        .signup-btn {
          width: 100%; padding: 14px;
          background: #1a1a1a; color: #fff; border: none; border-radius: 8px;
          font-size: 13px; font-weight: 700; letter-spacing: 1.5px;
          cursor: pointer; transition: opacity .2s, transform .15s;
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .signup-btn:hover:not(:disabled)  { opacity: .85; transform: translateY(-1px); }
        .signup-btn:active:not(:disabled) { transform: scale(.98); }
        .signup-btn:disabled              { opacity: .65; cursor: not-allowed; }

        .social-btn {
          width: 100%; padding: 12px; background: #fff; color: #1a1a1a;
          border: 1.5px solid #e2e2e2; border-radius: 8px;
          font-size: 14px; font-weight: 500; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 10px;
          transition: border-color .2s, box-shadow .2s, transform .15s;
          box-sizing: border-box;
        }
        .social-btn:hover  { border-color: #bbb; box-shadow: 0 2px 8px rgba(0,0,0,.07); transform: translateY(-1px); }
        .social-btn:active { transform: scale(.98); }
      `}</style>

      <div style={{
        background: "#fff", borderRadius: 16,
        padding: "48px 52px", width: "100%", maxWidth: 520,
        boxShadow: "0 4px 40px rgba(0,0,0,.08)",
        animation: "fadeUp 0.5s cubic-bezier(0.34,1.1,0.64,1) both",
      }}>

        {/* ════════════════════
            SUCCESS STATE
        ════════════════════ */}
        {submitted ? (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{
              width: 64, height: 64, borderRadius: "50%",
              background: "#eef5ec", margin: "0 auto 20px",
              display: "flex", alignItems: "center", justifyContent: "center",
              animation: "checkIn 0.4s ease both",
            }}>
              <Check size={28} color="#4a7c3f" strokeWidth={2.5} />
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "#1a1a1a", margin: "0 0 8px" }}>
              Account Created!
            </h2>
            <p style={{ fontSize: 14, color: "#888", margin: "0 0 6px" }}>
              Welcome aboard, <strong>{form.name}</strong>
            </p>
            <p style={{ fontSize: 12, color: "#bbb", margin: 0 }}>Redirecting to your profile…</p>
          </div>

        ) : (
          /* ════════════════════
             SIGN UP FORM
             FIX: wrapped in a single <div> root — original had no wrapper,
             causing JSX to see multiple sibling elements in ternary branch
          ════════════════════ */
          <div>

            {/* Heading */}
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <h1 style={{ fontSize: 28, fontWeight: 800, color: "#1a1a1a", margin: "0 0 10px", letterSpacing: -0.5 }}>
                Create Your Account
              </h1>
              <p style={{ fontSize: 13, color: "#999", lineHeight: 1.7, margin: 0 }}>
                Join us and discover exclusive jewellery collections,<br />
                special discounts &amp; early access to new arrivals.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} noValidate>

              {/* Full Name */}
              <div style={{ marginBottom: 18 }}>
                <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: "#1a1a1a", marginBottom: 6 }}>
                  Full Name:
                </label>
                <div style={{ position: "relative" }}>
                  <User size={15} color="#bbb" style={{
                    position: "absolute", left: 13, top: "50%",
                    transform: "translateY(-50%)", pointerEvents: "none",
                  }} />
                  <input
                    name="name"
                    type="text"
                    className={`form-input${errors.name ? " error" : ""}`}
                    placeholder="Enter your full name"
                    value={form.name}
                    onChange={handleChange}
                  />
                </div>
                {errors.name && (
                  <p style={{ margin: "4px 0 0", fontSize: 11, color: "#e53935" }}>{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div style={{ marginBottom: 18 }}>
                <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: "#1a1a1a", marginBottom: 6 }}>
                  Email Address:
                </label>
                <div style={{ position: "relative" }}>
                  <Mail size={15} color="#bbb" style={{
                    position: "absolute", left: 13, top: "50%",
                    transform: "translateY(-50%)", pointerEvents: "none",
                  }} />
                  <input
                    name="email"
                    type="email"
                    className={`form-input${errors.email ? " error" : ""}`}
                    placeholder="Enter Email Address"
                    value={form.email}
                    onChange={handleChange}
                  />
                </div>
                {errors.email && (
                  <p style={{ margin: "4px 0 0", fontSize: 11, color: "#e53935" }}>{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div style={{ marginBottom: 6 }}>
                <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: "#1a1a1a", marginBottom: 6 }}>
                  Password:
                </label>
                <div style={{ position: "relative" }}>
                  <Lock size={15} color="#bbb" style={{
                    position: "absolute", left: 13, top: "50%",
                    transform: "translateY(-50%)", pointerEvents: "none",
                  }} />
                  <input
                    name="password"
                    type={showPass ? "text" : "password"}
                    className={`form-input${errors.password ? " error" : ""}`}
                    placeholder="Enter Password"
                    value={form.password}
                    onChange={handleChange}
                    style={{ paddingRight: 42 }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    style={{
                      position: "absolute", right: 13, top: "50%",
                      transform: "translateY(-50%)",
                      background: "none", border: "none", cursor: "pointer",
                      padding: 0, display: "flex", alignItems: "center", color: "#aaa",
                    }}
                  >
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {errors.password
                  ? <p style={{ margin: "4px 0 0", fontSize: 11, color: "#e53935" }}>{errors.password}</p>
                  : <p style={{ margin: "5px 0 0", fontSize: 11, color: "#aaa" }}>Minimum 5 characters</p>
                }
              </div>

              {/* Strength bar */}
              {passLen > 0 && (
                <div style={{ marginTop: 8, marginBottom: 16 }}>
                  <div style={{ display: "flex", gap: 4 }}>
                    {[1, 2, 3, 4].map((lvl) => (
                      <div key={lvl} style={{
                        flex: 1, height: 3, borderRadius: 2,
                        background: passLen >= lvl * 3
                          ? lvl === 1 ? "#e53935"
                          : lvl === 2 ? "#e8b84b"
                          : lvl === 3 ? "#4a90d9"
                          : "#4a7c3f"
                          : "#f0f0f0",
                        transition: "background .2s",
                      }} />
                    ))}
                  </div>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                className="signup-btn"
                disabled={loading}
                style={{ marginTop: 8 }}
              >
                {loading ? (
                  <>
                    <div style={{
                      width: 14, height: 14,
                      border: "2px solid rgba(255,255,255,.3)",
                      borderTopColor: "#fff", borderRadius: "50%",
                      animation: "spin .7s linear infinite",
                    }} />
                    Creating Account…
                  </>
                ) : "SIGN UP"}
              </button>
            </form>

            {/* Login link */}
            <p style={{ textAlign: "center", fontSize: 13, color: "#888", margin: "16px 0 0" }}>
              Already have an account?{" "}
              <Link href="/login" style={{ color: "#c8960c", fontWeight: 600, textDecoration: "none" }}>
                Login
              </Link>
            </p>

            {/* Divider */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "20px 0" }}>
              <div style={{ flex: 1, height: 1, background: "#ebebeb" }} />
              <span style={{ fontSize: 12, color: "#bbb", whiteSpace: "nowrap" }}>Or sign up with</span>
              <div style={{ flex: 1, height: 1, background: "#ebebeb" }} />
            </div>

            {/* Social buttons */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>

              {/* Google */}
              <button className="social-btn" type="button" onClick={handleGoogleSignup}>
                <svg width="18" height="18" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                </svg>
                Sign up with Google
              </button>

              {/* Facebook — FIX: path was unclosed in original, </svg> and </button> were missing */}
              <button className="social-btn" type="button" onClick={handleFacebookSignup}>
                <svg width="18" height="18" viewBox="0 0 48 48">
                  <path fill="#1877F2" d="M48 24C48 10.745 37.255 0 24 0S0 10.745 0 24c0 11.979 8.776 21.908 20.25 23.708V30.938h-6.094V24h6.094v-5.288c0-6.014 3.583-9.337 9.065-9.337 2.625 0 5.372.469 5.372.469v5.907h-3.026c-2.981 0-3.911 1.85-3.911 3.75V24h6.656l-1.064 6.938H27.75v16.77C39.224 45.908 48 35.979 48 24z" />
                </svg>
                Sign up with Facebook
              </button>

            </div>

          </div>
          /* END of ternary false branch — now properly wrapped in single <div> */
        )}

      </div>
    </>
  );
}

/* ─────────────────────────────────────────────
   PAGE EXPORT — FIX: was missing entirely in original
   Suspense is required because SignUpForm uses useSearchParams()
───────────────────────────────────────────── */
export default function SignUpPage() {
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "40px 20px",
      background: "#f6f6f6",
    }}>
      <Suspense fallback={
        <div style={{ textAlign: "center", color: "#aaa", fontSize: 14 }}>Loading…</div>
      }>
        <SignUpForm />
      </Suspense>
    </div>
  );
}