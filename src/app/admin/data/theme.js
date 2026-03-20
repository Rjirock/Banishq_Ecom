// app/admin/data/theme.js

/* ── Light luxury colour tokens ── */
export const C = {
    bg: "#F7F4F0",       // warm off-white page background
    surface: "#FFFFFF",       // sidebar + card surfaces
    card: "#FDFAF6",       // inner cards
    border: "#E8DDD0",       // subtle warm border
    gold: "#C9A84C",       // primary accent
    goldLight: "#E8C96A",       // lighter gold
    goldBg: "#FDF8EE",       // gold tint background
    text: "#1A1205",       // primary text — rich dark brown
    muted: "#7A6A50",       // secondary text
    dim: "#B8A88A",       // placeholder / disabled text
    green: "#16a34a",       // success
    red: "#dc2626",       // danger
    blue: "#2563eb",       // info
    orange: "#ea580c",       // warning
    shadow: "rgba(26,18,5,.08)",  // subtle shadow
    shadowMd: "rgba(26,18,5,.12)", // medium shadow
};

/* ── Label style ── */
export const labelStyle = {
    fontSize: 11.5,
    fontWeight: 700,
    letterSpacing: ".12em",
    textTransform: "uppercase",
    color: C.muted,
    display: "block",
    marginBottom: 6,
};

/* ── Input style ── */
export const inputStyle = {
    width: "100%",
    padding: "11px 14px",
    borderRadius: 10,
    background: "#FDFAF6",
    border: `1.5px solid ${C.border}`,
    color: C.text,
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    transition: "border-color .2s, box-shadow .2s",
};