// components/checkout/BagStep.jsx
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Trash2, Plus, Minus, Heart,
  ChevronRight, Check, ShoppingBag,
} from "lucide-react";
import { useCart } from "@/context/CartContext";

/* ── fallback SVG if no image ── */
const Placeholder = () => (
  <svg viewBox="0 0 100 100" width="100%" height="100%">
    <rect width="100" height="100" fill="#f5f0e8" />
    <ellipse cx="50" cy="45" rx="18" ry="22" fill="#d4a94a" opacity="0.85" />
    <ellipse cx="50" cy="45" rx="12" ry="15" fill="#e8c96a" opacity="0.7" />
    <circle cx="50" cy="28" r="5" fill="#c8952a" />
    <circle cx="50" cy="45" r="4" fill="#fff" opacity="0.4" />
  </svg>
);

export default function BagStep({ onNext }) {
  const { cart, updateQty, removeItem } = useCart();
  const [pin, setPin] = useState("");

  /* ── empty state ── */
  if (cart.length === 0) {
    return (
      <div style={{
        background: "#fff", borderRadius: 20,
        border: "1.5px solid #EDE5D8",
        boxShadow: "0 2px 20px rgba(0,0,0,0.05)",
        padding: "56px 32px", textAlign: "center",
        animation: "stepIn 0.35s ease both",
      }}>
        <div style={{
          width: 60, height: 60, borderRadius: "50%",
          background: "#EDE5D8", display: "flex",
          alignItems: "center", justifyContent: "center",
          margin: "0 auto 18px",
        }}>
          <ShoppingBag size={24} color="#C9A84C" strokeWidth={1.6} />
        </div>
        <h3 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 22, fontWeight: 700, color: "#1a1205", margin: "0 0 8px",
        }}>
          Your cart is empty
        </h3>
        <p style={{ fontSize: 13, color: "#A89880", marginBottom: 22 }}>
          Go back and add some items first.
        </p>
        <Link href="/cart" style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          padding: "12px 24px", borderRadius: 12,
          background: "linear-gradient(135deg,#1a1205,#3d2a0a)",
          color: "#fff", fontFamily: "'Jost', sans-serif",
          fontSize: 13, fontWeight: 700, textDecoration: "none",
          letterSpacing: "0.08em",
        }}>
          Go to Cart
        </Link>
      </div>
    );
  }

  return (
    <div style={{
      background: "#fff", borderRadius: 20,
      border: "1.5px solid #EDE5D8",
      boxShadow: "0 2px 20px rgba(0,0,0,0.05)",
      padding: "24px 24px",
      animation: "stepIn 0.35s ease both",
    }}>

      {/* ── DELIVERY PIN CHECK ─────────────────────── */}
      <div style={{
        display: "flex", alignItems: "center",
        justifyContent: "space-between", flexWrap: "wrap", gap: 12,
        border: "1.5px solid #DDD0BE", borderRadius: 14,
        padding: "14px 18px", marginBottom: 14,
        background: "#fdfaf6",
      }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: "#3d2a0a" }}>
          Check delivery time &amp; services
        </span>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/, "").slice(0, 6))}
            placeholder="Enter PIN Code"
            style={{
              width: 130, border: "1.5px solid #DDD0BE",
              borderRadius: 10, padding: "8px 12px",
              fontSize: 13, fontWeight: 500, color: "#1a1205",
              textAlign: "center", letterSpacing: "0.1em",
              outline: "none", background: "#fff",
              fontFamily: "'Jost', sans-serif",
            }}
          />
          <button style={{
            padding: "8px 16px", borderRadius: 10,
            border: "2px solid #C9A84C",
            background: "transparent", color: "#7a6030",
            fontSize: 12, fontWeight: 700,
            cursor: "pointer", letterSpacing: "0.1em",
            fontFamily: "'Jost', sans-serif",
          }}>
            CHECK
          </button>
        </div>
      </div>

      {/* ── OFFER BANNER ───────────────────────────── */}
      <div style={{
        border: "1.5px solid #EDE5D8", borderRadius: 14,
        padding: "12px 18px", marginBottom: 20,
        background: "#fffdf9",
      }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: "#A89880", margin: "0 0 4px", letterSpacing: "0.1em", textTransform: "uppercase" }}>
          Available Offers
        </p>
        <p style={{ fontSize: 12.5, color: "#5c4220", margin: 0, lineHeight: 1.5 }}>
          10% Instant Discount with RBL Bank Credit and Debit Cards on a min spend of ₹2,500.{" "}
          <span style={{ color: "#C9A84C", fontWeight: 700, cursor: "pointer" }}>T&amp;C Apply</span>
        </p>
      </div>

      {/* ── ITEMS HEADER ───────────────────────────── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 20, height: 20, borderRadius: "50%",
            background: "#C9A84C", display: "flex",
            alignItems: "center", justifyContent: "center",
          }}>
            <Check size={11} color="#fff" strokeWidth={3} />
          </div>
          <span style={{ fontSize: 12, fontWeight: 700, color: "#3d2a0a", letterSpacing: "0.1em" }}>
            {cart.reduce((s, x) => s + x.qty, 0)}/{cart.length} ITEMS SELECTED
          </span>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <button style={{ fontSize: 11, fontWeight: 700, color: "#bbb", background: "none", border: "none", cursor: "pointer", letterSpacing: "0.08em" }}>
            REMOVE
          </button>
          <span style={{ color: "#DDD0BE", fontSize: 11 }}>|</span>
          <button style={{ fontSize: 11, fontWeight: 700, color: "#bbb", background: "none", border: "none", cursor: "pointer", letterSpacing: "0.08em" }}>
            MOVE TO WISHLIST
          </button>
        </div>
      </div>

      {/* ── ITEMS LIST ─────────────────────────────── */}
      <div>
        {cart.map((item, idx) => (
          <div key={item.id}>
            <div style={{ display: "flex", gap: 14, alignItems: "flex-start", padding: "20px 0" }}>

              {/* checkbox */}
              <div style={{
                width: 20, height: 20, borderRadius: 5, flexShrink: 0,
                border: "2px solid #C9A84C", background: "#C9A84C",
                display: "flex", alignItems: "center", justifyContent: "center",
                marginTop: 2,
              }}>
                <Check size={10} color="#fff" strokeWidth={3} />
              </div>

              {/* ── IMAGE ─────────────────────────── */}
              <div style={{
                width: 80, height: 80, flexShrink: 0,
                borderRadius: 12, overflow: "hidden",
                border: "1.5px solid #EDE5D8",
                background: "#fdfaf6",
              }}>
                {item.image ? (
                  <img
                    src={item.image} alt={item.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  />
                ) : <Placeholder />}
              </div>

              {/* ── DETAILS ───────────────────────── */}
              <div style={{ flex: 1, minWidth: 0 }}>

                {/* name */}
                <p style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 15, fontWeight: 700, color: "#1a1205",
                  margin: "0 0 3px", lineHeight: 1.35,
                  display: "-webkit-box",
                  WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
                }}>
                  {item.name}
                </p>

                {/* brand */}
                {item.brand && (
                  <p style={{ fontSize: 11, color: "#B8A080", fontWeight: 600, margin: "0 0 10px", letterSpacing: "0.04em" }}>
                    {item.brand}
                  </p>
                )}

                {/* price row — live × qty */}
                <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
                  <span
                    key={item.qty}
                    style={{ fontSize: 16, fontWeight: 700, color: "#1a1205", transition: "color 0.2s" }}
                  >
                    ₹{(item.price * item.qty).toLocaleString("en-IN")}
                  </span>
                  {item.qty > 1 && (
                    <span style={{ fontSize: 11.5, color: "#B8A080" }}>
                      ₹{item.price.toLocaleString("en-IN")} each
                    </span>
                  )}
                  <span style={{ fontSize: 12, color: "#ccc", textDecoration: "line-through" }}>
                    ₹{(item.originalPrice * item.qty).toLocaleString("en-IN")}
                  </span>
                  <span style={{
                    background: "#F0FDF4", border: "1px solid #86efac",
                    color: "#15803d", fontSize: 10, fontWeight: 700,
                    padding: "2px 8px", borderRadius: 20,
                  }}>
                    {item.discount}% off
                  </span>
                </div>

                {/* qty control */}
                <div style={{
                  display: "inline-flex", alignItems: "center",
                  border: "1.5px solid #DDD0BE", borderRadius: 10, overflow: "hidden",
                }}>
                  <button
                    onClick={() => updateQty(item.id, -1)}
                    style={{
                      width: 32, height: 32, border: "none",
                      background: "#fff", cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "#999",
                    }}
                  >
                    <Minus size={12} />
                  </button>
                  <span style={{
                    width: 38, height: 32,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 14, fontWeight: 700, color: "#1a1205",
                    borderLeft: "1.5px solid #DDD0BE", borderRight: "1.5px solid #DDD0BE",
                  }}>
                    {item.qty}
                  </span>
                  <button
                    onClick={() => updateQty(item.id, +1)}
                    style={{
                      width: 32, height: 32, border: "none",
                      background: "#fff", cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "#999",
                    }}
                  >
                    <Plus size={12} />
                  </button>
                </div>
              </div>

              {/* ── ACTION ICONS ──────────────────── */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8, flexShrink: 0 }}>
                <button
                  onClick={() => removeItem(item.id)}
                  style={{
                    width: 30, height: 30, borderRadius: "50%",
                    border: "1.5px solid #EDE5D8", background: "#fff",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#bbb", cursor: "pointer",
                  }}
                >
                  <Trash2 size={13} />
                </button>
                <button style={{
                  width: 30, height: 30, borderRadius: "50%",
                  border: "1.5px solid #EDE5D8", background: "#fff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#bbb", cursor: "pointer",
                }}>
                  <Heart size={13} />
                </button>
              </div>
            </div>

            {/* divider */}
            {idx < cart.length - 1 && (
              <div style={{ height: 1, background: "#F2EDE5" }} />
            )}
          </div>
        ))}
      </div>

      {/* ── PROCEED BUTTON ─────────────────────────── */}
      <button
        onClick={onNext}
        style={{
          marginTop: 24, width: "100%",
          padding: "15px 0", borderRadius: 14, border: "none",
          background: "linear-gradient(135deg,#1a1205 0%,#3d2a0a 50%,#1a1205 100%)",
          color: "#fff", fontFamily: "'Jost', sans-serif",
          fontSize: 13, fontWeight: 700, letterSpacing: "0.16em",
          textTransform: "uppercase", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          transition: "transform 0.2s, box-shadow 0.2s",
          position: "relative", overflow: "hidden",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.boxShadow = "0 10px 30px rgba(26,18,5,0.35)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        Proceed to Address
        <ChevronRight size={16} />
      </button>
    </div>
  );
}