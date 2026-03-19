// components/profile_compo/personal_info/page.jsx
"use client";

import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function PersonalInformation() {
  const { user } = useAuth();

  const [gender, setGender] = useState("male");
  const [saving, setSaving] = useState(false);
  const [saved,  setSaved]  = useState(false);

  /* ── Pre-fill name + email from sign-up data.
     All other fields start empty until the user fills them in. ── */
  const [form, setForm] = useState({
    fullName: user?.name  ?? "",
    email:    user?.email ?? "",
    address:  "",
    phone:    "",
    dob:      "",
    location: "",
    pinCode:  "",
  });

  /* original keeps the sign-up values so Discard resets back to them */
  const [original] = useState({ ...form });

  const handleChange = (field) => (e) =>
    setForm((p) => ({ ...p, [field]: e.target.value }));

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1600));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleDiscard = () => {
    setForm({ ...original });
    setGender("male");
  };

  const inputCls =
    "w-full px-3 py-2.5 rounded-lg border border-gray-200 text-[13.5px] text-gray-800 " +
    "placeholder:text-gray-300 bg-white outline-none " +
    "focus:border-[#b8964e] focus:ring-2 focus:ring-[#b8964e]/10 transition-all duration-200";

  const labelCls =
    "block text-[11px] text-gray-400 mb-1 tracking-wide uppercase font-medium";

  return (
    <div className="animate-[fadeSlide_0.35s_ease_both]">
      <h2
        className="text-xl font-semibold text-gray-900 mb-1"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        Personal Information
      </h2>
      <p className="text-[13px] text-gray-400 mb-5 font-light">
        Update your personal details below
      </p>

      {/* Gender */}
      <div className="flex items-center gap-5 mb-5">
        {["male", "female"].map((g) => (
          <label key={g} className="flex items-center gap-2 cursor-pointer group">
            <div
              onClick={() => setGender(g)}
              className={`w-4 h-4 rounded-full border-2 flex items-center justify-center
                          transition-all duration-200 cursor-pointer
                ${gender === g
                  ? "border-[#b8964e] bg-[#b8964e]"
                  : "border-gray-300 group-hover:border-[#b8964e]"}`}
            >
              {gender === g && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
            </div>
            <span className="text-[13px] text-gray-600 capitalize">{g}</span>
          </label>
        ))}
      </div>

      {/* Full Name — pre-filled from sign-up */}
      <div className="mb-4">
        <label className={labelCls}>Full Name</label>
        <input
          className={inputCls}
          value={form.fullName}
          onChange={handleChange("fullName")}
          placeholder="Full Name"
        />
      </div>

      {/* Email — pre-filled from sign-up */}
      <div className="mb-4">
        <label className={labelCls}>Email Address</label>
        <input
          className={inputCls}
          type="email"
          value={form.email}
          onChange={handleChange("email")}
          placeholder="Email"
        />
      </div>

      {/* Address */}
      <div className="mb-4">
        <label className={labelCls}>Address</label>
        <input
          className={inputCls}
          value={form.address}
          onChange={handleChange("address")}
          placeholder="House no., Street, Area"
        />
      </div>

      {/* Phone + DOB */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className={labelCls}>Phone Number</label>
          <input
            className={inputCls}
            value={form.phone}
            onChange={handleChange("phone")}
            placeholder="+91 XXXXX XXXXX"
          />
        </div>
        <div>
          <label className={labelCls}>Date of Birth</label>
          <input
            className={inputCls}
            type="text"
            value={form.dob}
            onChange={handleChange("dob")}
            placeholder="DD/MM/YYYY"
          />
        </div>
      </div>

      {/* Location + Pin */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div>
          <label className={labelCls}>Location</label>
          <input
            className={inputCls}
            value={form.location}
            onChange={handleChange("location")}
            placeholder="City, State"
          />
        </div>
        <div>
          <label className={labelCls}>Pin Code</label>
          <input
            className={inputCls}
            value={form.pinCode}
            onChange={handleChange("pinCode")}
            placeholder="000000"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleDiscard}
          className="px-7 py-2.5 rounded-lg border border-[#b8964e] text-[#b8964e]
                     text-sm font-medium hover:bg-[#b8964e]/5 active:scale-95
                     transition-all duration-200"
        >
          Discard Changes
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-7 py-2.5 rounded-lg bg-[#7a6030]
                     text-white text-sm font-medium
                     hover:bg-[#5e4a25] hover:-translate-y-0.5 active:translate-y-0
                     disabled:opacity-60 disabled:cursor-not-allowed
                     shadow-[0_2px_12px_rgba(122,96,48,0.25)] transition-all duration-200"
        >
          {saving ? (
            <><Loader2 size={14} className="animate-spin" /> Saving...</>
          ) : saved ? (
            <><Check size={14} /> Saved!</>
          ) : (
            "Save Changes"
          )}
        </button>
      </div>
    </div>
  );
}