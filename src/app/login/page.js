// app/login/page.jsx
"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router        = useRouter();
  const searchParams  = useSearchParams();
  const { login }     = useAuth();

  /* Where to go after a successful login.
     Defaults to / (same-page feel) if no ?redirect= param is present. */
  const redirectTo = searchParams.get("redirect") ?? "/";

  const [email, setEmail]               = useState("");
  const [password, setPassword]         = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]           = useState(false);
  const [errors, setErrors]             = useState({});

  const validate = () => {
    const e = {};
    if (!email.trim())                                   e.email    = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email    = "Enter a valid email address.";
    if (!password)                                       e.password = "Password is required.";
    else if (password.length < 6)                        e.password = "Password must be at least 6 characters.";
    return e;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1600));  // ← replace with real API
    setLoading(false);
    login({ email, name: email.split("@")[0] });
    router.push(redirectTo);                         // ← honour redirect param
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    login({ email: "googleuser@gmail.com", name: "Google User" });
    router.push(redirectTo);
  };

  const handleFacebookLogin = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    login({ email: "fbuser@facebook.com", name: "Facebook User" });
    router.push(redirectTo);
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    alert("Password reset link sent to your email.");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f7f7f5] px-4 py-10">
      <div className="w-full max-w-[460px] bg-white rounded-2xl px-10 py-11
                      shadow-[0_2px_30px_rgba(0,0,0,0.07)]
                      animate-[slideUp_0.5s_cubic-bezier(0.22,1,0.36,1)_both]">

        <h1 className="text-center text-[34px] font-bold tracking-tight text-gray-900 mb-2"
            style={{ fontFamily: "'Playfair Display', serif" }}>Welcome Back</h1>
        <p className="text-center text-[13.5px] text-gray-400 font-light mb-8 leading-relaxed">
          Login to track orders, save favorites &amp; checkout faster
        </p>

        <form onSubmit={handleLogin} noValidate>
          {/* Email */}
          <div className="mb-5">
            <label htmlFor="email" className="block text-[13.5px] font-medium text-gray-700 mb-1.5">Email Address:</label>
            <input id="email" type="email" placeholder="Enter your email" value={email} autoComplete="email"
              onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: "" })); }}
              className={`w-full px-4 py-3 rounded-xl border text-sm text-gray-900
                placeholder:text-gray-300 outline-none bg-white transition-all duration-200
                focus:border-gray-900 focus:ring-2 focus:ring-gray-900/[0.06]
                ${errors.email ? "border-red-400 ring-2 ring-red-400/10" : "border-gray-200"}`}
            />
            {errors.email && <p className="mt-1.5 text-xs text-red-500 animate-[shake_0.3s_ease]">{errors.email}</p>}
          </div>

          {/* Password */}
          <div className="mb-1">
            <label htmlFor="password" className="block text-[13.5px] font-medium text-gray-700 mb-1.5">Password:</label>
            <div className="relative">
              <input id="password" type={showPassword ? "text" : "password"} placeholder="Enter Password"
                value={password} autoComplete="current-password"
                onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: "" })); }}
                className={`w-full px-4 py-3 pr-11 rounded-xl border text-sm text-gray-900
                  placeholder:text-gray-300 outline-none bg-white transition-all duration-200
                  focus:border-gray-900 focus:ring-2 focus:ring-gray-900/[0.06]
                  ${errors.password ? "border-red-400 ring-2 ring-red-400/10" : "border-gray-200"}`}
              />
              <button type="button" onClick={() => setShowPassword((v) => !v)} tabIndex={-1}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <p className="mt-1.5 text-xs text-red-500 animate-[shake_0.3s_ease]">{errors.password}</p>}
            <button type="button" onClick={handleForgotPassword}
              className="mt-2 block w-full text-right text-[12.5px] text-[#c4924a] hover:text-[#a07030] hover:underline transition-colors">
              Forgot Password?
            </button>
          </div>

          <button type="submit" disabled={loading}
            className="mt-6 w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800
                       text-white text-[13px] font-medium tracking-[0.12em] uppercase rounded-xl py-3.5
                       shadow-[0_2px_12px_rgba(0,0,0,0.12)] hover:-translate-y-0.5
                       hover:shadow-[0_4px_20px_rgba(0,0,0,0.18)] active:translate-y-0
                       disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200">
            {loading ? <><Loader2 size={16} className="animate-spin" /> Signing in…</> : "LOGIN"}
          </button>
        </form>

        <p className="text-center text-[13px] text-gray-400 font-light mt-5">
          Don't have an account?{" "}
          <Link href="/sign-up" className="text-gray-900 font-medium border-b border-gray-400/40 pb-px hover:border-gray-900 transition-colors">
            Create Account
          </Link>
        </p>

        <div className="flex items-center gap-4 my-7">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400 tracking-wide whitespace-nowrap">Or log in with</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        <button type="button" onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-xl py-3 px-5 mb-3
                     text-sm text-gray-700 bg-white hover:border-gray-400 hover:bg-gray-50 hover:-translate-y-0.5
                     hover:shadow-[0_3px_14px_rgba(0,0,0,0.07)] active:translate-y-0 transition-all duration-200">
          <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Log in with Google
        </button>

        <button type="button" onClick={handleFacebookLogin}
          className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-xl py-3 px-5
                     text-sm text-gray-700 bg-white hover:border-gray-400 hover:bg-gray-50 hover:-translate-y-0.5
                     hover:shadow-[0_3px_14px_rgba(0,0,0,0.07)] active:translate-y-0 transition-all duration-200">
          <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
            <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.791-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" fill="#1877F2"/>
          </svg>
          Log in with Facebook
        </button>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&display=swap');
        @keyframes slideUp { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shake   { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-4px)} 75%{transform:translateX(4px)} }
      `}</style>
    </div>
  );
}
