"use client";

import { useState } from "react";
import { Eye, EyeOff, Loader2, Check, ShieldCheck } from "lucide-react";

function PasswordField({ label, value, onChange, placeholder }) {
  const [show, setShow] = useState(false);
  return (
    <div className="mb-4">
      <label className="block text-[11px] text-gray-400 mb-1 tracking-wide uppercase font-medium">
        {label}
      </label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full px-3 py-2.5 pr-10 rounded-lg border border-gray-200 text-[13.5px] text-gray-800
                     placeholder:text-gray-300 bg-white outline-none
                     focus:border-[#b8964e] focus:ring-2 focus:ring-[#b8964e]/10 transition-all duration-200"
        />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          tabIndex={-1}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
        >
          {show ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      </div>
    </div>
  );
}

function StrengthBar({ password }) {
  const score = password.length === 0 ? 0
    : password.length < 6 ? 1
    : password.length < 10 ? 2
    : /[A-Z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password) ? 4
    : 3;

  const labels = ["", "Weak", "Fair", "Good", "Strong"];
  const colors = ["", "bg-red-400", "bg-yellow-400", "bg-blue-400", "bg-green-500"];

  if (!password) return null;
  return (
    <div className="mb-5">
      <div className="flex gap-1 mb-1">
        {[1,2,3,4].map((i) => (
          <div key={i} className={`flex-1 h-1 rounded-full transition-all duration-300 ${i <= score ? colors[score] : "bg-gray-200"}`} />
        ))}
      </div>
      <p className={`text-[11px] font-medium ${score <= 1 ? "text-red-400" : score === 2 ? "text-yellow-500" : score === 3 ? "text-blue-500" : "text-green-500"}`}>
        {labels[score]} password
      </p>
    </div>
  );
}

export default function LoginPassword() {
  const [email, setEmail]       = useState("Usermail@gmail.com");
  const [current, setCurrent]   = useState("");
  const [newPass, setNewPass]   = useState("");
  const [confirm, setConfirm]   = useState("");
  const [saving, setSaving]     = useState(false);
  const [saved, setSaved]       = useState(false);
  const [error, setError]       = useState("");

  const handleSave = async () => {
    setError("");
    if (!current) { setError("Please enter your current password."); return; }
    if (newPass.length < 6) { setError("New password must be at least 6 characters."); return; }
    if (newPass !== confirm) { setError("Passwords do not match."); return; }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1600));
    setSaving(false);
    setSaved(true);
    setCurrent(""); setNewPass(""); setConfirm("");
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="animate-[fadeSlide_0.35s_ease_both]">
      <h2 className="text-xl font-semibold text-gray-900 mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
        Login &amp; Password
      </h2>
      <p className="text-[13px] text-gray-400 mb-6 font-light">Manage your email address and password</p>

      {/* Security badge */}
      <div className="flex items-center gap-2 bg-[#f5f0e8] rounded-xl px-4 py-3 mb-6 border border-[#e8ddd0]">
        <ShieldCheck size={16} className="text-[#b8964e] shrink-0" />
        <span className="text-[12.5px] text-[#7a6030] font-medium">
          Your account is secured with password authentication
        </span>
      </div>

      {/* Email */}
      <div className="mb-5">
        <label className="block text-[11px] text-gray-400 mb-1 tracking-wide uppercase font-medium">Email Address</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-[13.5px] text-gray-800
                     placeholder:text-gray-300 bg-white outline-none
                     focus:border-[#b8964e] focus:ring-2 focus:ring-[#b8964e]/10 transition-all duration-200"
        />
      </div>

      <div className="border-t border-gray-100 my-5" />
      <p className="text-[12px] text-gray-400 uppercase tracking-widest font-medium mb-4">Change Password</p>

      <PasswordField label="Current Password" value={current} onChange={(e) => setCurrent(e.target.value)} placeholder="Enter current password" />
      <PasswordField label="New Password" value={newPass} onChange={(e) => setNewPass(e.target.value)} placeholder="Enter new password" />
      <StrengthBar password={newPass} />
      <PasswordField label="Confirm New Password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Confirm new password" />

      {error && (
        <p className="text-xs text-red-500 mb-4 animate-[shake_0.3s_ease]">{error}</p>
      )}

      <div className="flex items-center gap-3 mt-2">
        <button
          onClick={() => { setCurrent(""); setNewPass(""); setConfirm(""); setError(""); }}
          className="px-7 py-2.5 rounded-lg border border-[#b8964e] text-[#b8964e] text-sm font-medium
                     hover:bg-[#b8964e]/5 active:scale-95 transition-all duration-200"
        >
          Discard Changes
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-7 py-2.5 rounded-lg bg-[#7a6030] text-white text-sm font-medium
                     hover:bg-[#5e4a25] hover:-translate-y-0.5 active:translate-y-0
                     disabled:opacity-60 disabled:cursor-not-allowed
                     shadow-[0_2px_12px_rgba(122,96,48,0.25)] transition-all duration-200"
        >
          {saving ? <><Loader2 size={14} className="animate-spin" /> Saving…</>
           : saved  ? <><Check size={14} /> Updated!</>
           : "Save Changes"}
        </button>
      </div>
    </div>
  );
}