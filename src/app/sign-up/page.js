// app/sign-up/page.jsx
"use client";

export const dynamic = "force-dynamic";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, User, Mail, Lock, Check, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

// ─── Inner component that safely uses useSearchParams ────────────────────────
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

  const validate = () => {
    const e = {};
    if (!form.name.trim())                     e.name     = "Full name is required";
    if (!form.email.trim())                    e.email    = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email   = "Enter a valid email";
    if (!form.password)                        e.password = "Password is required";
    else if (form.password.length < 5)         e.password = "Minimum 5 characters";
    return e;
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

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

  return (
    <>
      <style>{`
        @keyframes fadeUp  { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin    { to{transform:rotate(360deg)} }
        @keyframes checkIn { 0%{transform:scale(0);opacity:0} 70%{transform:scale(1.2)} 100%{transform:scale(1);opacity:1} }
        .form-input {
          width:100%; padding:13px 14px 13px 40px;
          border:1.5px solid #e2e2e2; border-radius:8px;
          font-size:14px; color:#1a1a1a; background:#fff;
          box-sizing:border-box; outline:none;
          transition:border-color .2s,box-shadow .2s;
        }
        .form-input:focus  { border-color:#1a1a1a; box-shadow:0 0 0 3px rgba(26,26,26,.07); }
        .form-input.error  { border-color:#e53935 !important; }
        .form-input::placeholder { color:#bbb; }
        .signup-btn {
          width:100%; padding:14px;
          background:#1a1a1a; color:#fff; border:none; border-radius:8px;
          font-size:13px; font-weight:700; letter-spacing:1.5px;
          cursor:pointer; transition:opacity .2s,transform .15s;
        }
        .signup-btn:hover:not(:disabled) { opacity:.85; transform:translateY(-1px); }
        .signup-btn:active:not(:disabled){ transform:scale(.98); }
        .social-btn {
          width:100%; padding:12px; background:#fff; color:#1a1a1a;
          border:1.5px solid #e2e2e2; border-radius:8px;
          font-size:14px; font-weight:500; cursor:pointer;
          display:flex; align-items:center; justify-content:center; gap:10px;
          transition:border-color .2s,box-shadow .2s,transform .15s; box-sizing:border-box;
        }
        .social-btn:hover { border-color:#bbb; box-shadow:0 2px 8px rgba(0,0,0,.07); transform:translateY(-1px); }
        .social-btn:active{ transform:scale(.98); }
      `}</style>

      <div style={{
        background: "#fff", borderRadius: 16,
        padding: "48px 52px", width: "100%", maxWidth: 520,
        boxShadow: "0 4px 40px rgba(0,0,0,.08)",
        animation: "fadeUp 0.5s cubic-bezier(0.34,1.1,0.64,1) both",
      }}>
        {submitted
