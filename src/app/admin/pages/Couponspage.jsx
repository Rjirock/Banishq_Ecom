// app/admin/pages/CouponsPage.jsx
"use client";

import { useState } from "react";
import {
  Tag, Plus, Copy, Check, Trash2, Edit2,
  Save, X, ToggleLeft, ToggleRight, RefreshCw,
  Percent, IndianRupee, Calendar, Users,
  ShoppingCart, AlertCircle, CheckCircle2, Clock,
  Search, Sparkles,
} from "lucide-react";
import { SectionTitle, GoldBtn, ConfirmDialog } from "../components/AdminUI";
import { C, labelStyle, inputStyle } from "../data/theme";

/* ── helpers ── */
const today     = () => new Date().toISOString().split("T")[0];
const fmtDate   = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" }) : "—";
const isExpired = (d) => d && new Date(d) < new Date(today());
const isActive  = (c) => c.active && !isExpired(c.validTo) && (c.maxUses === null || c.usedCount < c.maxUses);

function generateCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

/* ── Status chip ── */
function CouponStatus({ coupon }) {
  if (!coupon.active)             return <SmChip label="Inactive"  color="#6b7280" bg="rgba(107,114,128,.1)"  />;
  if (isExpired(coupon.validTo))  return <SmChip label="Expired"   color={C.red}   bg="rgba(220,38,38,.1)"   />;
  if (coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses)
                                  return <SmChip label="Exhausted" color={C.orange} bg="rgba(234,88,12,.1)"  />;
  return                                 <SmChip label="Active"    color={C.green}  bg="rgba(22,163,74,.1)"  />;
}

function SmChip({ label, color, bg }) {
  return (
    <span style={{
      fontSize: 11, fontWeight: 700, color, background: bg,
      padding: "3px 10px", borderRadius: 99, whiteSpace: "nowrap",
    }}>{label}</span>
  );
}

/* ── Copy code button ── */
function CopyBtn({ text }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={copy} title="Copy" style={{
      background: "none", border: "none", cursor: "pointer",
      color: copied ? C.green : C.dim, padding: "3px 6px",
      display: "flex", alignItems: "center", transition: "color .2s",
    }}>
      {copied ? <Check size={13} strokeWidth={2.5} /> : <Copy size={13} />}
    </button>
  );
}

/* ── Field wrapper ── */
function Field({ label, required, hint, children }) {
  return (
    <div>
      <label style={{ ...labelStyle, display: "flex", alignItems: "center", gap: 5 }}>
        {label}
        {required && <span style={{ color: C.red, fontSize: 10 }}>*</span>}
        {hint && <span style={{ fontSize: 10, color: C.dim, fontWeight: 500, letterSpacing: 0, textTransform: "none" }}>{hint}</span>}
      </label>
      {children}
    </div>
  );
}

/* ── Usage progress bar ── */
function UsageBar({ used, max }) {
  if (max === null) return (
    <p style={{ margin: 0, fontSize: 11.5, color: C.muted, fontWeight: 600 }}>
      {used} uses · Unlimited
    </p>
  );
  const pct   = Math.min((used / max) * 100, 100);
  const color = pct >= 90 ? C.red : pct >= 60 ? C.orange : C.green;
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
        <span style={{ fontSize: 11.5, color: C.muted, fontWeight: 600 }}>{used} / {max} used</span>
        <span style={{ fontSize: 11.5, color, fontWeight: 700 }}>{pct.toFixed(0)}%</span>
      </div>
      <div style={{ height: 5, borderRadius: 99, background: C.border, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: color,
          borderRadius: 99, transition: "width .4s" }} />
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   COUPON FORM
════════════════════════════════════════════ */
const BLANK = {
  code: "", type: "percent", value: "", minOrder: "",
  maxUses: null, validFrom: today(), validTo: "",
  description: "", active: true,
};

function CouponForm({ initial, onSave, onCancel, isNew }) {
  const [form,   setForm]   = useState(initial ?? BLANK);
  const [errors, setErrors] = useState({});

  const set = (k) => (e) => {
    const v = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm(p => ({ ...p, [k]: v }));
    if (errors[k]) setErrors(p => ({ ...p, [k]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.code.trim())               e.code      = "Code is required";
    if (!form.value || +form.value <= 0) e.value     = "Enter a valid discount";
    if (form.type === "percent" && +form.value > 100) e.value = "Max 100%";
    if (!form.validFrom)                 e.validFrom = "Start date required";
    if (!form.validTo)                   e.validTo   = "Expiry date required";
    if (form.validTo && form.validFrom && form.validTo < form.validFrom)
                                         e.validTo   = "Expiry must be after start";
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onSave({
      ...form,
      code:     form.code.toUpperCase().trim(),
      value:    +form.value,
      minOrder: form.minOrder !== "" ? +form.minOrder : 0,
      maxUses:  form.maxUses !== null && form.maxUses !== "" ? +form.maxUses : null,
    });
  };

  const previewText = form.value
    ? form.type === "percent"
      ? `${form.value}% off${form.minOrder ? ` on orders above ₹${form.minOrder}` : ""}`
      : `₹${form.value} off${form.minOrder ? ` on orders above ₹${form.minOrder}` : ""}`
    : null;

  return (
    <div style={{
      background: C.surface, border: `1.5px solid ${C.gold}44`,
      borderRadius: 18, overflow: "hidden",
      boxShadow: `0 4px 28px ${C.shadowMd}`,
      animation: "cFade .3s cubic-bezier(.22,1,.36,1) both",
    }}>
      {/* Header */}
      <div style={{
        padding: "16px 22px", display: "flex", alignItems: "center",
        justifyContent: "space-between",
        background: C.goldBg, borderBottom: `1.5px solid ${C.border}`,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Tag size={16} color={C.gold} />
          <span style={{ fontFamily: "'Cormorant Garamond',serif",
            fontSize: 18, fontWeight: 700, color: C.text }}>
            {isNew ? "Create New Coupon" : `Edit — ${initial?.code}`}
          </span>
        </div>
        <button onClick={onCancel} style={{
          background: "none", border: "none", cursor: "pointer",
          color: C.muted, display: "flex", transition: "color .2s",
        }}
          onMouseEnter={e => e.currentTarget.style.color = C.red}
          onMouseLeave={e => e.currentTarget.style.color = C.muted}
        ><X size={17} /></button>
      </div>

      <div style={{ padding: "20px 22px", display: "flex", flexDirection: "column", gap: 16 }}>

        {/* Code + auto-generate */}
        <Field label="Coupon Code" required>
          <div style={{ display: "flex", gap: 8 }}>
            <div style={{ position: "relative", flex: 1 }}>
              <Tag size={14} color={C.dim} style={{
                position: "absolute", left: 12, top: "50%",
                transform: "translateY(-50%)", pointerEvents: "none",
              }} />
              <input
                value={form.code}
                onChange={e => setForm(p => ({ ...p, code: e.target.value.toUpperCase() }))}
                placeholder="e.g. SUMMER25"
                maxLength={20}
                style={{
                  ...inputStyle, paddingLeft: 36,
                  fontFamily: "monospace", fontSize: 15, fontWeight: 800,
                  letterSpacing: ".1em", color: C.gold,
                  border: `1.5px solid ${errors.code ? C.red : C.border}`,
                }}
              />
            </div>
            <button
              onClick={() => setForm(p => ({ ...p, code: generateCode() }))}
              style={{
                padding: "0 14px", borderRadius: 10, cursor: "pointer",
                border: `1.5px solid ${C.border}`, background: C.goldBg,
                color: C.gold, fontSize: 12, fontWeight: 700,
                display: "flex", alignItems: "center", gap: 6,
                transition: "all .2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = C.gold; e.currentTarget.style.color = "#1a1205"; }}
              onMouseLeave={e => { e.currentTarget.style.background = C.goldBg; e.currentTarget.style.color = C.gold; }}
            >
              <RefreshCw size={12} /> Auto
            </button>
          </div>
          {errors.code && <p style={{ margin: "4px 0 0", fontSize: 11.5, color: C.red }}>{errors.code}</p>}
        </Field>

        {/* Type + Value */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Field label="Discount Type" required>
            <div style={{ display: "flex", gap: 8 }}>
              {[
                { v: "percent", icon: Percent,     label: "%" },
                { v: "flat",    icon: IndianRupee, label: "₹ Flat" },
              ].map(t => (
                <button key={t.v} onClick={() => setForm(p => ({ ...p, type: t.v }))} style={{
                  flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  padding: "10px 6px", borderRadius: 10, cursor: "pointer",
                  border: `1.5px solid ${form.type === t.v ? C.gold : C.border}`,
                  background: form.type === t.v ? C.goldBg : "transparent",
                  color: form.type === t.v ? C.gold : C.muted,
                  fontSize: 12.5, fontWeight: 700, transition: "all .2s",
                }}>
                  <t.icon size={13} />{t.label}
                </button>
              ))}
            </div>
          </Field>

          <Field label={form.type === "percent" ? "Discount %" : "Discount ₹"} required>
            <div style={{ position: "relative" }}>
              <span style={{
                position: "absolute", left: 12, top: "50%",
                transform: "translateY(-50%)", pointerEvents: "none",
                fontSize: 14, fontWeight: 700, color: C.gold,
              }}>
                {form.type === "percent" ? "%" : "₹"}
              </span>
              <input
                type="number" min="1" max={form.type === "percent" ? 100 : undefined}
                value={form.value}
                onChange={set("value")}
                placeholder={form.type === "percent" ? "e.g. 20" : "e.g. 200"}
                style={{
                  ...inputStyle, paddingLeft: 32,
                  border: `1.5px solid ${errors.value ? C.red : C.border}`,
                }}
              />
            </div>
            {errors.value && <p style={{ margin: "4px 0 0", fontSize: 11.5, color: C.red }}>{errors.value}</p>}
          </Field>
        </div>

        {/* Min order + Max uses */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Field label="Min. Order Amount (₹)" hint="(0 = no minimum)">
            <div style={{ position: "relative" }}>
              <ShoppingCart size={14} color={C.dim} style={{
                position: "absolute", left: 12, top: "50%",
                transform: "translateY(-50%)", pointerEvents: "none",
              }} />
              <input
                type="number" min="0"
                value={form.minOrder}
                onChange={set("minOrder")}
                placeholder="e.g. 500"
                style={{ ...inputStyle, paddingLeft: 36 }}
              />
            </div>
          </Field>

          <Field label="Max Uses" hint="(blank = unlimited)">
            <div style={{ position: "relative" }}>
              <Users size={14} color={C.dim} style={{
                position: "absolute", left: 12, top: "50%",
                transform: "translateY(-50%)", pointerEvents: "none",
              }} />
              <input
                type="number" min="1"
                value={form.maxUses ?? ""}
                onChange={e => setForm(p => ({ ...p, maxUses: e.target.value === "" ? null : e.target.value }))}
                placeholder="Unlimited"
                style={{ ...inputStyle, paddingLeft: 36 }}
              />
            </div>
          </Field>
        </div>

        {/* Validity dates */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Field label="Valid From" required>
            <div style={{ position: "relative" }}>
              <Calendar size={14} color={C.dim} style={{
                position: "absolute", left: 12, top: "50%",
                transform: "translateY(-50%)", pointerEvents: "none",
              }} />
              <input type="date" value={form.validFrom} onChange={set("validFrom")}
                style={{ ...inputStyle, paddingLeft: 36, border: `1.5px solid ${errors.validFrom ? C.red : C.border}` }} />
            </div>
            {errors.validFrom && <p style={{ margin: "4px 0 0", fontSize: 11.5, color: C.red }}>{errors.validFrom}</p>}
          </Field>

          <Field label="Expires On" required>
            <div style={{ position: "relative" }}>
              <Calendar size={14} color={C.dim} style={{
                position: "absolute", left: 12, top: "50%",
                transform: "translateY(-50%)", pointerEvents: "none",
              }} />
              <input type="date" value={form.validTo} onChange={set("validTo")}
                min={form.validFrom || today()}
                style={{ ...inputStyle, paddingLeft: 36, border: `1.5px solid ${errors.validTo ? C.red : C.border}` }} />
            </div>
            {errors.validTo && <p style={{ margin: "4px 0 0", fontSize: 11.5, color: C.red }}>{errors.validTo}</p>}
          </Field>
        </div>

        {/* Description */}
        <Field label="Internal Description">
          <input
            value={form.description}
            onChange={set("description")}
            placeholder="e.g. Summer sale for all customers"
            style={inputStyle}
          />
        </Field>

        {/* Active toggle */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "13px 16px", borderRadius: 12,
          background: form.active ? "rgba(22,163,74,.06)" : "rgba(107,114,128,.06)",
          border: `1px solid ${form.active ? "rgba(22,163,74,.2)" : C.border}`,
        }}>
          <div>
            <p style={{ margin: "0 0 2px", fontSize: 13.5, fontWeight: 700,
              color: form.active ? C.green : C.muted }}>
              {form.active ? "Coupon is Active" : "Coupon is Inactive"}
            </p>
            <p style={{ margin: 0, fontSize: 11.5, color: C.dim }}>
              {form.active ? "Customers can apply this at checkout" : "Hidden from customers"}
            </p>
          </div>
          <button onClick={() => setForm(p => ({ ...p, active: !p.active }))} style={{
            width: 48, height: 27, borderRadius: 99, border: "none",
            cursor: "pointer", position: "relative", flexShrink: 0,
            background: form.active ? C.green : C.border, transition: "background .25s",
          }}>
            <div style={{
              width: 21, height: 21, borderRadius: "50%", background: "#fff",
              position: "absolute", top: 3, left: form.active ? 24 : 3,
              transition: "left .25s", boxShadow: "0 1px 4px rgba(0,0,0,.2)",
            }} />
          </button>
        </div>

        {/* Live preview */}
        {previewText && (
          <div style={{
            padding: "12px 16px", borderRadius: 12,
            background: C.goldBg, border: `1px solid rgba(201,168,76,.25)`,
            display: "flex", alignItems: "flex-start", gap: 10,
          }}>
            <Sparkles size={14} color={C.gold} style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <p style={{ margin: "0 0 2px", fontSize: 10.5, fontWeight: 700,
                color: C.gold, letterSpacing: ".12em", textTransform: "uppercase" }}>
                Customer sees at checkout
              </p>
              <p style={{ margin: 0, fontSize: 13.5, fontWeight: 700, color: C.text }}>
                Apply{" "}
                <span style={{ color: C.gold, fontFamily: "monospace" }}>
                  {form.code || "CODE"}
                </span>
                {" → "}{previewText}
                {form.validTo ? ` · Expires ${fmtDate(form.validTo)}` : ""}
              </p>
            </div>
          </div>
        )}

        {/* Buttons */}
        <div style={{ display: "flex", gap: 10 }}>
          <GoldBtn onClick={handleSave}>
            <Save size={13} /> {isNew ? "Create Coupon" : "Save Changes"}
          </GoldBtn>
          <GoldBtn outline onClick={onCancel}>
            <X size={13} /> Cancel
          </GoldBtn>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   COUPON CARD
════════════════════════════════════════════ */
function CouponCard({ coupon, onEdit, onDelete, onToggle }) {
  const active   = isActive(coupon);
  const expired  = isExpired(coupon.validTo);

  return (
    <div style={{
      background: C.surface,
      border: `1.5px solid ${active ? C.border : "rgba(180,170,160,.25)"}`,
      borderRadius: 16, overflow: "hidden",
      boxShadow: `0 2px 12px ${C.shadow}`,
      opacity: active ? 1 : 0.78,
      transition: "box-shadow .2s, opacity .2s",
    }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = `0 6px 22px ${C.shadowMd}`}
      onMouseLeave={e => e.currentTarget.style.boxShadow = `0 2px 12px ${C.shadow}`}
    >
      <div style={{ height: 3, background: active ? `linear-gradient(90deg,${C.gold},${C.goldLight})` : "transparent" }} />

      <div style={{ padding: "16px 18px" }}>

        {/* Code + status */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{
              background: C.goldBg, border: `1.5px solid rgba(201,168,76,.3)`,
              borderRadius: 9, padding: "6px 13px",
              fontFamily: "monospace", fontSize: 15, fontWeight: 800,
              color: C.gold, letterSpacing: ".1em",
            }}>
              {coupon.code}
            </div>
            <CopyBtn text={coupon.code} />
          </div>
          <CouponStatus coupon={coupon} />
        </div>

        {/* Value */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: active ? "rgba(201,168,76,.1)" : C.bg,
            border: `1px solid ${active ? "rgba(201,168,76,.25)" : C.border}`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {coupon.type === "percent"
              ? <Percent size={14} color={active ? C.gold : C.dim} />
              : <IndianRupee size={14} color={active ? C.gold : C.dim} />
            }
          </div>
          <div>
            <p style={{ margin: 0,
              fontFamily: "'Cormorant Garamond',serif",
              fontSize: 22, fontWeight: 700,
              color: active ? C.text : C.dim }}>
              {coupon.type === "percent" ? `${coupon.value}% OFF` : `₹${coupon.value} OFF`}
            </p>
            {coupon.minOrder > 0 && (
              <p style={{ margin: 0, fontSize: 11.5, color: C.dim }}>
                Min. order ₹{coupon.minOrder.toLocaleString("en-IN")}
              </p>
            )}
          </div>
        </div>

        {coupon.description && (
          <p style={{ margin: "0 0 12px", fontSize: 12, color: C.muted, fontStyle: "italic" }}>
            {coupon.description}
          </p>
        )}

        {/* Usage */}
        <div style={{ marginBottom: 12 }}>
          <UsageBar used={coupon.usedCount} max={coupon.maxUses} />
        </div>

        {/* Validity */}
        <div style={{
          display: "flex", alignItems: "center", gap: 6,
          padding: "8px 11px", borderRadius: 10, marginBottom: 14,
          background: expired ? "rgba(220,38,38,.07)" : C.bg,
          border: `1px solid ${expired ? "rgba(220,38,38,.2)" : C.border}`,
        }}>
          {expired
            ? <AlertCircle size={11} color={C.red}  style={{ flexShrink: 0 }} />
            : <Clock       size={11} color={C.muted} style={{ flexShrink: 0 }} />
          }
          <span style={{ fontSize: 11.5, color: expired ? C.red : C.muted, fontWeight: 600 }}>
            {fmtDate(coupon.validFrom)} → {fmtDate(coupon.validTo)}
            {expired ? " · Expired" : ""}
          </span>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
          <GoldBtn small outline onClick={() => onEdit(coupon)}>
            <Edit2 size={11} /> Edit
          </GoldBtn>
          <button onClick={() => onToggle(coupon.id)} style={{
            display: "flex", alignItems: "center", gap: 5,
            padding: "7px 12px", borderRadius: 8, cursor: "pointer",
            border: `1.5px solid ${coupon.active ? "rgba(22,163,74,.3)" : C.border}`,
            background: coupon.active ? "rgba(22,163,74,.08)" : "transparent",
            color: coupon.active ? C.green : C.muted,
            fontSize: 12, fontWeight: 700, transition: "all .2s",
          }}>
            {coupon.active ? <ToggleRight size={13} /> : <ToggleLeft size={13} />}
            {coupon.active ? "Active" : "Inactive"}
          </button>
          <button onClick={() => onDelete(coupon.id)} style={{
            display: "flex", alignItems: "center", gap: 5,
            padding: "7px 12px", borderRadius: 8, cursor: "pointer",
            border: `1.5px solid rgba(220,38,38,.2)`, background: "rgba(220,38,38,.07)",
            color: C.red, fontSize: 12, fontWeight: 700, transition: "background .2s",
          }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(220,38,38,.15)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(220,38,38,.07)"}
          >
            <Trash2 size={11} /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   MAIN PAGE
════════════════════════════════════════════ */
export default function CouponsPage({ coupons, onAddCoupon, onUpdateCoupon, onDeleteCoupon, onToggleCoupon }) {
  const [showForm,   setShowForm]   = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteId,   setDeleteId]   = useState(null);
  const [search,     setSearch]     = useState("");
  const [filter,     setFilter]     = useState("All");

  const filtered = coupons.filter(c => {
    const q = search.toLowerCase();
    const matchQ = c.code.toLowerCase().includes(q) || c.description.toLowerCase().includes(q);
    if (!matchQ) return false;
    if (filter === "Active")   return isActive(c);
    if (filter === "Inactive") return !c.active;
    if (filter === "Expired")  return isExpired(c.validTo);
    return true;
  });

  const activeCnt  = coupons.filter(isActive).length;
  const expiredCnt = coupons.filter(c => isExpired(c.validTo)).length;
  const totalUses  = coupons.reduce((s, c) => s + (c.usedCount || 0), 0);

  return (
    <div>
      <style>{`
        @keyframes cFade {
          from { opacity:0; transform:translateY(10px); }
          to   { opacity:1; transform:translateY(0); }
        }
      `}</style>

      {/* Title row */}
      <div style={{ display: "flex", alignItems: "flex-start",
        justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 22 }}>
        <SectionTitle
          icon={Tag}
          title="Coupons"
          subtitle="Create and manage discount coupons — apply to all customers at checkout"
        />
        <GoldBtn onClick={() => { setShowForm(true); setEditTarget(null); }}>
          <Plus size={14} /> Add Coupon
        </GoldBtn>
      </div>

      {/* Stats */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(150px,1fr))",
        gap: 14, marginBottom: 24,
      }}>
        {[
          { label: "Total",    value: coupons.length, icon: Tag,          color: C.gold  },
          { label: "Active",   value: activeCnt,      icon: CheckCircle2, color: C.green },
          { label: "Expired",  value: expiredCnt,     icon: Clock,        color: C.red   },
          { label: "Total Uses", value: totalUses,    icon: Users,        color: C.blue  },
        ].map((s, i) => (
          <div key={i} style={{
            background: C.surface, border: `1.5px solid ${C.border}`,
            borderRadius: 14, padding: "14px 16px",
            boxShadow: `0 1px 8px ${C.shadow}`,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 6 }}>
              <s.icon size={13} color={s.color} />
              <span style={{ fontSize: 10.5, color: C.muted, fontWeight: 600,
                letterSpacing: ".1em", textTransform: "uppercase" }}>{s.label}</span>
            </div>
            <p style={{ margin: 0, fontFamily: "'Cormorant Garamond',serif",
              fontSize: 26, fontWeight: 700, color: C.text }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Create form */}
      {showForm && !editTarget && (
        <div style={{ marginBottom: 22 }}>
          <CouponForm isNew onSave={data => { onAddCoupon({ ...data, id: `cpn-${Date.now()}`, usedCount: 0 }); setShowForm(false); }} onCancel={() => setShowForm(false)} />
        </div>
      )}

      {/* Edit form */}
      {editTarget && (
        <div style={{ marginBottom: 22 }}>
          <CouponForm initial={editTarget} onSave={data => { onUpdateCoupon(data); setEditTarget(null); }} onCancel={() => setEditTarget(null)} />
        </div>
      )}

      {/* Toolbar */}
      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
          <Search size={14} color={C.dim} style={{
            position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
          }} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search code or description…"
            style={{ ...inputStyle, paddingLeft: 36 }} />
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {["All","Active","Inactive","Expired"].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: "7px 14px", borderRadius: 9, cursor: "pointer",
              fontSize: 12, fontWeight: 700, transition: "all .2s",
              background: filter === f ? C.gold : C.card,
              color: filter === f ? "#1a1205" : C.muted,
              border: `1px solid ${filter === f ? C.gold : C.border}`,
            }}>{f}</button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(290px,1fr))", gap: 18 }}>
          {filtered.map(c => (
            <CouponCard
              key={c.id} coupon={c}
              onEdit={coupon => { setEditTarget(coupon); setShowForm(false); }}
              onDelete={id => setDeleteId(id)}
              onToggle={onToggleCoupon}
            />
          ))}
        </div>
      ) : (
        <div style={{
          textAlign: "center", padding: "52px 20px",
          background: C.surface, borderRadius: 18,
          border: `1.5px solid ${C.border}`,
        }}>
          <Tag size={36} color={C.border} style={{ marginBottom: 12 }} />
          <p style={{ fontSize: 14, color: C.muted, margin: 0, fontWeight: 600 }}>
            {search || filter !== "All"
              ? "No coupons match your filter"
              : "No coupons yet — click Add Coupon to create one"}
          </p>
        </div>
      )}

      {deleteId && (
        <ConfirmDialog
          title="Delete Coupon?"
          message="This coupon will be permanently removed. Customers who already used it won't be affected."
          confirmLabel="Delete"
          danger
          onConfirm={() => { onDeleteCoupon(deleteId); setDeleteId(null); }}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
}