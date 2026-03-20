// app/admin/layout.jsx
"use client";

import { useEffect, useState } from "react";

/* ─────────────────────────────────────────────────────────────
   AdminLayout — reads the banishq_token cookie directly.
   Does NOT use AuthContext — the admin auth is completely
   separate from the regular user auth system.

   Cookie is set by app/admin-login/page.jsx on successful login.

   Access rules:
     • No cookie / invalid cookie  → redirect to /admin-login
     • Cookie role !== "admin"     → redirect to /
     • Cookie role === "admin"     → render children ✅

   Developer note:
     When you integrate a real backend, replace the cookie
     decode below with a proper JWT verify call to your API,
     e.g. GET /api/admin/me — and update isAdmin accordingly.
───────────────────────────────────────────────────────────── */

function getAdminCookie() {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find(row => row.startsWith("banishq_token="));
  if (!match) return null;
  try {
    const token = match.split("=")[1];
    return JSON.parse(atob(token));
  } catch {
    return null;
  }
}

export default function AdminLayout({ children }) {
  const [status, setStatus] = useState("checking"); // "checking" | "allowed" | "denied"

  useEffect(() => {
    const payload = getAdminCookie();

    if (!payload || payload.role !== "admin") {
      // No valid admin cookie → go to admin login
      window.location.href = "/admin-login";
      return;
    }

    setStatus("allowed");
  }, []);

  /* Loading spinner while checking cookie */
  if (status === "checking") {
    return (
      <div style={{
        minHeight: "100vh",
        background: "#0f0d0a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Jost', sans-serif",
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: 36, height: 36,
            borderRadius: "50%",
            margin: "0 auto 16px",
            border: "3px solid #2e2820",
            borderTopColor: "#C9A84C",
            animation: "spin 0.8s linear infinite",
          }} />
          <p style={{ color: "#6b5a3e", fontSize: 13, letterSpacing: ".1em" }}>
            Verifying access…
          </p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  /* Cookie invalid — render nothing while redirect happens */
  if (status === "denied") return null;

  /* ✅ Cookie valid — render admin panel */
  return <>{children}</>;
}