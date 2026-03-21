// app/login/page.jsx
"use client";

export const dynamic = "force-dynamic";

import { Suspense } from "react";          // ← add this
import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

// ─── Inner component that safely uses useSearchParams ────────────────────────
function LoginForm() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const { login }    = useAuth();

  const redirectTo = searchParams.get("redirect") ?? "/";

  const [email, setEmail]               = useState("");
  const [password, setPassword]         = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]           = useState(false);
  const [errors, setErrors]             = useState({});

  // ... rest of your handlers and JSX (handleLogin, handleGoogleLogin, etc.)
  // ... everything stays exactly the same — just move it inside here

  return (
    <div className="w-full max-w-[460px] bg-white ...">
      {/* your existing JSX */}
    </div>
  );
}

// ─── Page shell — wraps LoginForm in Suspense ─────────────────────────────────
export default function LoginPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f7f7f5] px-4 py-10">
      <Suspense fallback={
        <div className="w-full max-w-[460px] flex justify-center py-20">
          <Loader2 className="animate-spin text-gray-400" size={28} />
        </div>
      }>
        <LoginForm />
      </Suspense>
    </div>
  );
}
