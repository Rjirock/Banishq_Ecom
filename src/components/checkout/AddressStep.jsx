// components/checkout/AddressStep.jsx
"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";

/* ── reusable field ── MUST be outside the parent component ── */
const Field = ({ label, k, placeholder, type = "text", optional = false, value, onChange, error }) => (
  <div>
    <label style={{
      display: "block",
      fontSize: 12, fontWeight: 700,
      color: "#5c4220", marginBottom: 7,
      letterSpacing: "0.04em",
      fontFamily: "'Jost', sans-serif",
    }}>
      {label}
      {!optional && <span style={{ color: "#ef4444", marginLeft: 3 }}>*</span>}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={{
        width: "100%",
        border: `1.5px solid ${error ? "#f87171" : "#DDD0BE"}`,
        borderRadius: 12,
        padding: "12px 16px",
        fontSize: 14, fontWeight: 500,
        color: "#1a1205",
        background: error ? "#fff8f8" : "#fdfaf6",
        outline: "none",
        fontFamily: "'Jost', sans-serif",
        transition: "border-color 0.2s, box-shadow 0.2s",
        boxSizing: "border-box",
      }}
      onFocus={(e) => {
        e.target.style.borderColor = "#C9A84C";
        e.target.style.boxShadow = "0 0 0 3px rgba(201,168,76,0.12)";
      }}
      onBlur={(e) => {
        e.target.style.borderColor = error ? "#f87171" : "#DDD0BE";
        e.target.style.boxShadow = "none";
      }}
    />
    {error && (
      <p style={{ fontSize: 11, color: "#ef4444", marginTop: 5, fontFamily: "'Jost', sans-serif" }}>
        {error}
      </p>
    )}
  </div>
);

export default function AddressStep({ onNext, onBack }) {
  const [form, setForm] = useState({
    fullName: "", phone: "", email: "",
    pincode: "", state: "", city: "",
    address: "", landmark: "", type: "Home",
  });
  const [errors, setErrors] = useState({});

  const set = (k) => (e) => {
    setForm((p) => ({ ...p, [k]: e.target.value }));
    if (errors[k]) setErrors((p) => ({ ...p, [k]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.fullName.trim())          e.fullName = "Required";
    if (!form.phone.match(/^\d{10}$/))  e.phone    = "Enter valid 10-digit number";
    if (!form.email.includes("@"))      e.email    = "Enter valid email";
    if (!form.pincode.match(/^\d{6}$/)) e.pincode  = "Enter valid 6-digit PIN";
    if (!form.state.trim())             e.state    = "Required";
    if (!form.city.trim())              e.city     = "Required";
    if (!form.address.trim())           e.address  = "Required";
    return e;
  };

  const handleNext = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onNext(form);
  };

  return (
    <div style={{
      background: "#fff",
      borderRadius: 20,
      border: "1.5px solid #EDE5D8",
      boxShadow: "0 2px 20px rgba(0,0,0,0.05)",
      padding: "28px",
      animation: "stepIn 0.35s ease both",
    }}>

      {/* ── HEADER ────────────────────────────── */}
      <h2 style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: 24, fontWeight: 700,
        color: "#1a1205", margin: "0 0 6px",
      }}>
        Delivery Address
      </h2>
      <p style={{ fontSize: 13, color: "#A89880", margin: "0 0 22px", fontFamily: "'Jost', sans-serif" }}>
        Where should we deliver your order?
      </p>

      {/* ── ADDRESS TYPE PILLS ────────────────── */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {["Home", "Work", "Other"].map((t) => (
          <button
            key={t}
            onClick={() => setForm((p) => ({ ...p, type: t }))}
            style={{
              padding: "7px 18px",
              borderRadius: 30,
              border: `2px solid ${form.type === t ? "#C9A84C" : "#DDD0BE"}`,
              background: form.type === t ? "#C9A84C" : "transparent",
              color: form.type === t ? "#fff" : "#888",
              fontSize: 12, fontWeight: 700,
              cursor: "pointer",
              letterSpacing: "0.06em",
              fontFamily: "'Jost', sans-serif",
              boxShadow: form.type === t ? "0 2px 10px rgba(201,168,76,0.3)" : "none",
              transition: "all 0.2s ease",
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* ── FORM GRID ─────────────────────────── */}
      {/* Row 1: Full Name (full width) */}
      <div style={{ marginBottom: 16 }}>
        <Field label="Full Name" k="fullName" placeholder="Enter your full name"
          value={form.fullName} onChange={set("fullName")} error={errors.fullName} />
      </div>

      {/* Row 2: Phone + Email */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        <Field label="Phone Number" k="phone" placeholder="10-digit mobile" type="tel"
          value={form.phone} onChange={set("phone")} error={errors.phone} />
        <Field label="Email Address" k="email" placeholder="your@email.com" type="email"
          value={form.email} onChange={set("email")} error={errors.email} />
      </div>

      {/* Row 3: PIN + State + City */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 16 }}>
        <Field label="PIN Code" k="pincode" placeholder="6-digit PIN"
          value={form.pincode} onChange={set("pincode")} error={errors.pincode} />
        <Field label="State" k="state" placeholder="State"
          value={form.state} onChange={set("state")} error={errors.state} />
        <Field label="City / Town" k="city" placeholder="City or Town"
          value={form.city} onChange={set("city")} error={errors.city} />
      </div>

      {/* Row 4: Full address (full width) */}
      <div style={{ marginBottom: 16 }}>
        <Field label="House / Street Address" k="address" placeholder="House No., Building, Street, Area"
          value={form.address} onChange={set("address")} error={errors.address} />
      </div>

      {/* Row 5: Landmark (full width, optional) */}
      <div style={{ marginBottom: 28 }}>
        <Field label="Landmark (optional)" k="landmark" placeholder="Near temple, school, metro..." optional
          value={form.landmark} onChange={set("landmark")} error={errors.landmark} />
      </div>

      {/* ── ACTION BUTTONS ────────────────────── */}
      <div style={{ display: "flex", gap: 12 }}>

        {/* back */}
        <button
          onClick={onBack}
          style={{
            flex: 1, padding: "14px 0",
            borderRadius: 14,
            border: "2px solid #DDD0BE",
            background: "transparent",
            color: "#7a6030",
            fontSize: 13, fontWeight: 700,
            cursor: "pointer",
            letterSpacing: "0.08em",
            fontFamily: "'Jost', sans-serif",
            transition: "border-color 0.2s, color 0.2s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#C9A84C"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#DDD0BE"; }}
        >
          ← Back to Bag
        </button>

        {/* proceed */}
        <button
          onClick={handleNext}
          style={{
            flex: 1, padding: "14px 0",
            borderRadius: 14, border: "none",
            background: "linear-gradient(135deg,#1a1205 0%,#3d2a0a 50%,#1a1205 100%)",
            color: "#fff",
            fontSize: 13, fontWeight: 700,
            cursor: "pointer",
            letterSpacing: "0.12em", textTransform: "uppercase",
            fontFamily: "'Jost', sans-serif",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            transition: "transform 0.2s, box-shadow 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 10px 28px rgba(26,18,5,0.35)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          Proceed to Payment
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}