// components/CartToast.jsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X, ShoppingCart, CheckCircle2, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";

const STYLES = `
  @keyframes toastIn {
    from { opacity: 0; transform: translateX(100%); }
    to   { opacity: 1; transform: translateX(0);    }
  }
  @keyframes toastOut {
    from { opacity: 1; transform: translateX(0);    }
    to   { opacity: 0; transform: translateX(110%); }
  }
  @keyframes progressShrink {
    from { width: 100%; }
    to   { width: 0%;   }
  }
  .toast-enter { animation: toastIn  0.38s cubic-bezier(0.22,1,0.36,1) both; }
  .toast-exit  { animation: toastOut 0.3s  ease forwards; }
`;

export default function CartToast() {
  const { toastItem, dismissToast, totalItems } = useCart();
  const [exiting, setExiting] = useState(false);
  const [visible, setVisible] = useState(false);

  /* When a new toastItem arrives, show it fresh */
  useEffect(() => {
    if (toastItem) {
      setExiting(false);
      setVisible(true);
    } else {
      /* Context cleared the item — start exit animation */
      if (visible) {
        setExiting(true);
        const t = setTimeout(() => setVisible(false), 320);
        return () => clearTimeout(t);
      }
    }
  }, [toastItem]);

  const handleClose = () => {
    setExiting(true);
    setTimeout(() => { setVisible(false); dismissToast(); }, 320);
  };

  if (!visible || !toastItem) return null;

  const fmt = (n) => `₹${n.toLocaleString("en-IN")}`;

  return (
    <>
      <style>{STYLES}</style>

      {/* ── TOAST CARD ─────────────────────────────────── */}
      <div
        className={exiting ? "toast-exit" : "toast-enter"}
        style={{
          position:   "fixed",
          top:        "50%",
          right:      0,
          transform:  "translateY(-50%)",
          zIndex:     9999,
          width:      340,
          background: "#fff",
          borderRadius: "16px 0 0 16px",
          boxShadow:  "0 8px 40px rgba(0,0,0,0.16), -4px 0 0 #C9A84C",
          overflow:   "hidden",
          fontFamily: "'Jost', sans-serif",
        }}
      >
        {/* gold top rule */}
        <div style={{
          height: 3,
          background: "linear-gradient(90deg, #C9A84C, #e8c96a, #C9A84C)",
        }} />

        {/* progress bar — shrinks over 3.5 s */}
        <div style={{ height: 2, background: "#f0e9db" }}>
          <div
            style={{
              height: "100%",
              background: "#C9A84C",
              animation: "progressShrink 3.5s linear forwards",
            }}
          />
        </div>

        <div style={{ padding: "16px 18px 18px" }}>

          {/* header row */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <CheckCircle2 size={18} color="#16a34a" strokeWidth={2.2} />
              <span style={{ fontSize: 13, fontWeight: 700, color: "#16a34a", letterSpacing: ".04em" }}>
                Added to Cart!
              </span>
            </div>
            <button
              onClick={handleClose}
              style={{
                width: 26, height: 26, borderRadius: "50%",
                border: "1.5px solid #EDE5D8",
                background: "#fdfaf6", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#aaa", transition: "all .15s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#C9A84C"; e.currentTarget.style.color = "#C9A84C"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#EDE5D8"; e.currentTarget.style.color = "#aaa"; }}
            >
              <X size={13} strokeWidth={2.5} />
            </button>
          </div>

          {/* product row */}
          <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16 }}>
            {/* image */}
            <div style={{
              width: 58, height: 58, borderRadius: 10, flexShrink: 0,
              border: "1.5px solid #EDE5D8", overflow: "hidden",
              background: "#fdfaf6",
            }}>
              {toastItem.image ? (
                <img
                  src={toastItem.image}
                  alt={toastItem.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              ) : (
                <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <ShoppingCart size={22} color="#C9A84C" />
                </div>
              )}
            </div>

            {/* name + price */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{
                fontSize: 13.5, fontWeight: 700, color: "#1a1205",
                margin: "0 0 4px", lineHeight: 1.35,
                overflow: "hidden", display: "-webkit-box",
                WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
              }}>
                {toastItem.name}
              </p>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#C9A84C", margin: 0 }}>
                {fmt(toastItem.price)}
              </p>
            </div>
          </div>

          {/* divider */}
          <div style={{ height: 1, background: "#EDE5D8", marginBottom: 14 }} />

          {/* cart count + CTA */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
            <p style={{ fontSize: 12, color: "#A89880", margin: 0 }}>
              <span style={{ fontWeight: 700, color: "#5c4220" }}>{totalItems}</span>{" "}
              {totalItems === 1 ? "item" : "items"} in cart
            </p>

            <Link
              href="/cart"
              onClick={handleClose}
              style={{
                display: "inline-flex", alignItems: "center", gap: 7,
                padding: "9px 16px", borderRadius: 10,
                background: "linear-gradient(120deg,#140e04,#3a2408,#5a3a0c,#140e04)",
                color: "#fff", fontSize: 12, fontWeight: 700,
                letterSpacing: ".1em", textTransform: "uppercase",
                textDecoration: "none",
                position: "relative", overflow: "hidden",
              }}
            >
              <ShoppingCart size={13} />
              View Cart
              <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}