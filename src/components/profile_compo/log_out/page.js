// components/profile_compo/log_out/page.jsx
"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { LogOut, AlertTriangle, Loader2, ShieldCheck, Monitor, Smartphone } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

/* ── detect real browser + OS from navigator.userAgent ── */
function getSessionInfo() {
  if (typeof window === "undefined") return { browser: "Browser", os: "Unknown", isMobile: false };

  const ua = navigator.userAgent;

  /* OS */
  let os = "Unknown OS";
  if (/Windows NT 10/.test(ua))       os = "Windows 11/10";
  else if (/Windows NT 6/.test(ua))   os = "Windows";
  else if (/Mac OS X/.test(ua))       os = "macOS";
  else if (/Android/.test(ua))        os = "Android";
  else if (/iPhone|iPad/.test(ua))    os = "iOS";
  else if (/Linux/.test(ua))          os = "Linux";

  /* Browser */
  let browser = "Browser";
  if (/Edg\//.test(ua))               browser = "Microsoft Edge";
  else if (/OPR\/|Opera/.test(ua))    browser = "Opera";
  else if (/Chrome\//.test(ua))       browser = "Chrome";
  else if (/Safari\//.test(ua))       browser = "Safari";
  else if (/Firefox\//.test(ua))      browser = "Firefox";

  const isMobile = /Android|iPhone|iPad/.test(ua);

  return { browser, os, isMobile };
}

export default function LogoutTab() {
  const { logout, user } = useAuth();
  const router = useRouter();

  const [confirming, setConfirming] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  /* useMemo so it only reads navigator once, not on every render */
  const session = useMemo(() => getSessionInfo(), []);

  /* Format a human-readable login time (session start = page load) */
  const loginTime = useMemo(() => {
    return new Date().toLocaleString("en-IN", {
      day: "numeric", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    // brief delay so the spinner is visible — feels intentional, not instant
    await new Promise((r) => setTimeout(r, 1200));
    logout();                  // clears user + localStorage via AuthContext
    router.push("/sign-up");   // redirect to sign-up page
  };

  return (
    <div style={{ animation: "fadeSlide 0.35s ease both" }}>
      <h2 className="text-xl font-semibold text-gray-900 mb-1"
          style={{ fontFamily: "'Playfair Display', serif" }}>
        Log Out
      </h2>
      <p className="text-[13px] text-gray-400 mb-8 font-light">
        Manage your active session
      </p>

      {/* Current session card */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <p className="text-[12px] font-semibold text-gray-400 tracking-widest uppercase">
            Current Session
          </p>
          <span className="flex items-center gap-1.5 text-[10.5px] bg-green-100
                           text-green-600 rounded-full px-2.5 py-1 font-medium tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block
                             animate-pulse" />
            Active
          </span>
        </div>

        {/* user row */}
        <div className="flex items-center gap-3 pb-4 border-b border-gray-100 mb-4">
          <div className="w-9 h-9 rounded-full bg-[#f5f0e8] flex items-center justify-center shrink-0">
            <ShieldCheck size={16} className="text-[#b8964e]" />
          </div>
          <div className="min-w-0">
            <p className="text-[13.5px] font-semibold text-gray-800 truncate">
              {user?.name ?? "User"}
            </p>
            <p className="text-[11.5px] text-gray-400 truncate">
              {user?.email ?? "—"}
            </p>
          </div>
        </div>

        {/* device + browser + time */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-[#fafafa] rounded-xl p-3 text-center">
            {session.isMobile
              ? <Smartphone size={16} className="text-[#b8964e] mx-auto mb-1" />
              : <Monitor    size={16} className="text-[#b8964e] mx-auto mb-1" />
            }
            <p className="text-[10px] font-semibold text-gray-700">{session.os}</p>
            <p className="text-[9.5px] text-gray-400 mt-0.5">Device</p>
          </div>

          <div className="bg-[#fafafa] rounded-xl p-3 text-center">
            <LogOut size={16} className="text-[#b8964e] mx-auto mb-1" />
            <p className="text-[10px] font-semibold text-gray-700">{session.browser}</p>
            <p className="text-[9.5px] text-gray-400 mt-0.5">Browser</p>
          </div>

          <div className="bg-[#fafafa] rounded-xl p-3 text-center">
            <ShieldCheck size={16} className="text-green-500 mx-auto mb-1" />
            <p className="text-[10px] font-semibold text-gray-700 leading-tight">{loginTime}</p>
            <p className="text-[9.5px] text-gray-400 mt-0.5">Logged in</p>
          </div>
        </div>
      </div>

      {/* Step 1 — Ready to leave? */}
      {!confirming && (
        <div className="bg-[#fdf8f2] border border-[#e8ddd0] rounded-2xl p-6 text-center">
          <div className="w-12 h-12 rounded-full bg-[#f5ebe0]
                          flex items-center justify-center mx-auto mb-3">
            <LogOut size={20} className="text-[#b8964e]" />
          </div>
          <h3 className="text-[15px] font-semibold text-gray-800 mb-1.5">
            Ready to leave?
          </h3>
          <p className="text-[13px] text-gray-400 font-light mb-5 leading-relaxed">
            You will be signed out of your account.<br />
            Your cart and wishlist will be saved.
          </p>
          <button
            onClick={() => setConfirming(true)}
            className="w-full py-3 rounded-xl bg-gray-900 text-white text-sm font-medium
                       tracking-wide hover:bg-gray-700 hover:-translate-y-0.5
                       active:translate-y-0 shadow-[0_2px_12px_rgba(0,0,0,0.12)]
                       transition-all duration-200"
          >
            Log Out
          </button>
        </div>
      )}

      {/* Step 2 — Confirm */}
      {confirming && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center
                        animate-[fadeSlide_0.3s_ease_both]">
          <div className="w-12 h-12 rounded-full bg-red-100
                          flex items-center justify-center mx-auto mb-3">
            <AlertTriangle size={20} className="text-red-500" />
          </div>
          <h3 className="text-[15px] font-semibold text-gray-800 mb-1.5">
            Are you sure?
          </h3>
          <p className="text-[13px] text-gray-500 font-light mb-5">
            This will end your current session.
          </p>

          <div className="flex gap-3">
            {/* Cancel — goes back to step 1 */}
            <button
              onClick={() => setConfirming(false)}
              disabled={loggingOut}
              className="flex-1 py-2.5 rounded-xl border border-gray-300
                         text-gray-600 text-sm font-medium
                         hover:bg-gray-50 disabled:opacity-40 transition-all duration-200"
            >
              Cancel
            </button>

            {/* Confirm — calls real logout + redirect */}
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl
                         bg-red-500 hover:bg-red-600 text-white text-sm font-medium
                         disabled:opacity-60 transition-all duration-200"
            >
              {loggingOut ? (
                <><Loader2 size={14} className="animate-spin" /> Logging out…</>
              ) : (
                "Yes, Log Out"
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}