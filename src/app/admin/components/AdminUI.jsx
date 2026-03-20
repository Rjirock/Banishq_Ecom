// app/admin/components/AdminUI.jsx
"use client";

import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { C, inputStyle, labelStyle } from "../data/theme";

/* ── Badge ── */
export function Badge({ label, bg, color }) {
  return (
    <span style={{
      background: bg, color,
      fontSize: 11.5, fontWeight: 700,
      padding: "3px 11px", borderRadius: 99,
      letterSpacing: ".04em",
      display: "inline-flex", alignItems: "center", gap: 4,
      whiteSpace: "nowrap",
      border: `1px solid ${color}30`,
    }}>
      {label}
    </span>
  );
}

/* ── GoldBtn ── */
export function GoldBtn({ children, onClick, small, outline, danger, type = "button" }) {
  const base = {
    display: "inline-flex", alignItems: "center", gap: 7,
    padding: small ? "8px 15px" : "11px 22px",
    borderRadius: 10, cursor: "pointer",
    fontSize: small ? 12.5 : 13.5, fontWeight: 700,
    letterSpacing: ".04em", transition: "all .2s",
    whiteSpace: "nowrap", fontFamily: "'Plus Jakarta Sans', sans-serif",
  };
  if (danger) return (
    <button type={type} style={{
      ...base, background: "#FFF1F1", color: C.red,
      border: `1.5px solid #FECACA`,
    }} onClick={onClick}>{children}</button>
  );
  if (outline) return (
    <button type={type} style={{
      ...base, background: "transparent", color: C.gold,
      border: `1.5px solid ${C.gold}`,
    }} onClick={onClick}>{children}</button>
  );
  return (
    <button type={type} style={{
      ...base,
      background: `linear-gradient(120deg, #1A1205 0%, #3a2408 50%, #1A1205 100%)`,
      color: "#F5EDE0", border: "none",
      boxShadow: `0 4px 14px ${C.shadowMd}`,
    }} onClick={onClick}>{children}</button>
  );
}

/* ── SectionTitle ── */
export function SectionTitle({ icon: Icon, title, subtitle }) {
  return (
    <div style={{ marginBottom: 26 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: C.goldBg, border: `1.5px solid ${C.gold}44`,
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <Icon size={17} color={C.gold} />
        </div>
        <h2 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 26, fontWeight: 700, color: C.text, margin: 0,
          letterSpacing: ".01em",
        }}>
          {title}
        </h2>
      </div>
      {subtitle && (
        <p style={{ fontSize: 13.5, color: C.muted, margin: 0, paddingLeft: 48 }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

/* ── StatCard ── */
export function StatCard({ icon: Icon, label, value, change, color }) {
  const up = change >= 0;
  return (
    <div style={{
      background: C.surface, border: `1.5px solid ${C.border}`,
      borderRadius: 16, padding: "22px 24px",
      boxShadow: `0 2px 12px ${C.shadow}`,
      transition: "box-shadow .2s",
    }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = `0 6px 24px ${C.shadowMd}`}
      onMouseLeave={e => e.currentTarget.style.boxShadow = `0 2px 12px ${C.shadow}`}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div style={{
          width: 42, height: 42, borderRadius: 12,
          background: `${color}15`, border: `1.5px solid ${color}25`,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Icon size={18} color={color} />
        </div>
        <span style={{
          display: "flex", alignItems: "center", gap: 3,
          fontSize: 12, fontWeight: 700,
          color: up ? C.green : C.red,
          background: up ? "#F0FDF4" : "#FFF1F1",
          padding: "3px 8px", borderRadius: 99,
          border: `1px solid ${up ? "#BBF7D0" : "#FECACA"}`,
        }}>
          {up ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
          {Math.abs(change)}%
        </span>
      </div>
      <p style={{
        fontSize: 28, fontWeight: 800, color: C.text,
        margin: "0 0 4px",
        fontFamily: "'Cormorant Garamond', serif",
        letterSpacing: ".01em",
      }}>
        {value}
      </p>
      <p style={{ fontSize: 13.5, color: C.muted, margin: 0, fontWeight: 500 }}>{label}</p>
    </div>
  );
}

/* ── ConfirmDialog ── */
export function ConfirmDialog({ title, message, onConfirm, onCancel, confirmLabel = "Confirm", danger = true }) {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "rgba(26,18,5,.35)", backdropFilter: "blur(6px)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
    }}>
      <div style={{
        background: C.surface, border: `1.5px solid ${C.border}`,
        borderRadius: 20, padding: 30, maxWidth: 380, width: "100%",
        textAlign: "center", boxShadow: `0 24px 60px ${C.shadowMd}`,
      }}>
        <div style={{
          width: 52, height: 52, borderRadius: "50%", margin: "0 auto 16px",
          background: danger ? "#FFF1F1" : C.goldBg,
          border: `2px solid ${danger ? "#FECACA" : C.gold + "44"}`,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <span style={{ fontSize: 22 }}>{danger ? "⚠️" : "✓"}</span>
        </div>
        <h3 style={{
          color: C.text, margin: "0 0 8px",
          fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontWeight: 700,
        }}>{title}</h3>
        <p style={{ color: C.muted, fontSize: 14, margin: "0 0 24px", lineHeight: 1.65 }}>{message}</p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          {danger
            ? <GoldBtn danger onClick={onConfirm}>{confirmLabel}</GoldBtn>
            : <GoldBtn onClick={onConfirm}>{confirmLabel}</GoldBtn>
          }
          <GoldBtn outline onClick={onCancel}>Cancel</GoldBtn>
        </div>
      </div>
    </div>
  );
}

/* ── ModalShell ── */
export function ModalShell({ title, subtitle, onClose, children, maxWidth = 620 }) {
  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(26,18,5,.35)", backdropFilter: "blur(6px)",
        display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: C.surface, border: `1.5px solid ${C.border}`,
          borderRadius: 20, width: "100%", maxWidth,
          maxHeight: "90vh", overflowY: "auto",
          boxShadow: `0 24px 60px ${C.shadowMd}`,
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Gold accent bar */}
        <div style={{ height: 3, background: `linear-gradient(90deg,${C.gold},${C.goldLight},${C.gold})` }} />

        {/* Header */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "20px 26px", borderBottom: `1px solid ${C.border}`,
          background: C.goldBg,
        }}>
          <div>
            <h3 style={{
              margin: 0, color: C.text, fontSize: 20,
              fontFamily: "'Cormorant Garamond',serif", fontWeight: 700,
            }}>{title}</h3>
            {subtitle && <p style={{ margin: 0, color: C.gold, fontSize: 12.5, fontWeight: 700 }}>{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            style={{
              background: C.border + "60", border: `1px solid ${C.border}`,
              borderRadius: "50%", width: 32, height: 32, cursor: "pointer",
              color: C.muted, display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 16, transition: "all .15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "#FECACA"; e.currentTarget.style.color = C.red; }}
            onMouseLeave={e => { e.currentTarget.style.background = C.border + "60"; e.currentTarget.style.color = C.muted; }}
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: 26 }}>
          {children}
        </div>
      </div>
    </div>
  );
}

export { inputStyle, labelStyle };