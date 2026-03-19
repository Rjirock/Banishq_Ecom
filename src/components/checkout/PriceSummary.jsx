// components/checkout/PriceSummary.jsx
"use client";

import { useState } from "react";
import { CreditCard, Truck, Shield, RotateCcw, Check, Sparkles, Tag } from "lucide-react";
import { useCart } from "@/context/CartContext";

/* ── shared keyframes injected once ── */
const STYLES = `
  @keyframes shimmerSweep {
    from { transform: translateX(-100%); }
    to   { transform: translateX(250%); }
  }
  @keyframes ringPulse {
    0%,100% { box-shadow: 0 6px 28px rgba(20,14,4,0.32), 0 0 0 0 rgba(201,168,76,0); }
    50%      { box-shadow: 0 6px 28px rgba(20,14,4,0.32), 0 0 0 5px rgba(201,168,76,0.14); }
  }
  @keyframes fadeUp {
    from { opacity:0; transform:translateY(8px); }
    to   { opacity:1; transform:translateY(0); }
  }
  .cta-place {
    position: relative; overflow: hidden;
    display: flex; align-items: center; justify-content: center; gap: 9px;
    width: 100%; padding: 16px 0; border-radius: 14px; border: none;
    background: linear-gradient(120deg,#140e04 0%,#3a2408 45%,#5a3a0c 65%,#140e04 100%);
    color: #fff; font-family:'Jost',sans-serif; font-size:13px; font-weight:700;
    letter-spacing:0.18em; text-transform:uppercase; cursor:pointer;
    animation: ringPulse 3.5s ease infinite;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  .cta-place::before {
    content:''; position:absolute; top:0; left:12%; right:12%; height:1px;
    background:linear-gradient(90deg,transparent,rgba(201,168,76,0.65),transparent);
  }
  .cta-place .sweep {
    position:absolute; inset:0;
    background:linear-gradient(105deg,transparent 25%,rgba(201,168,76,0.2) 50%,transparent 75%);
    transform:translateX(-100%);
  }
  .cta-place:hover { transform:translateY(-2px); box-shadow:0 14px 38px rgba(20,14,4,0.42); }
  .cta-place:hover .sweep { animation:shimmerSweep 0.7s ease forwards; }
  .cta-place:active { transform:translateY(0); }
  .apply-coupon:hover { background:#C9A84C !important; color:#fff !important; }
  .gold-input:focus { outline:none; border-color:#C9A84C !important; box-shadow:0 0 0 3px rgba(201,168,76,0.12); }
`;

export default function PriceSummary({ step, onPlaceOrder }) {
  const { cart, totalPrice, totalMrp } = useCart();

  const [code,    setCode]    = useState("");
  const [applied, setApplied] = useState(false);
  const [cError,  setCError]  = useState("");

  const discount    = totalMrp - totalPrice;
  const couponDisc  = applied ? 300 : 0;
  const convenience = applied ? 0 : 49;
  const total       = totalPrice - couponDisc + convenience;
  const totalItems  = cart.reduce((s, x) => s + x.qty, 0);

  const applyCode = () => {
    if (code.trim().toUpperCase() === "SAVE300") {
      setApplied(true); setCError("");
    } else {
      setCError("Invalid coupon — try SAVE300"); setApplied(false);
    }
  };

  return (
    <>
      <style>{STYLES}</style>

      <div style={{
        background: "#fff", borderRadius: 20,
        border: "1.5px solid #EDE5D8",
        boxShadow: "0 2px 20px rgba(0,0,0,0.05)",
        padding: "22px", position: "sticky", top: 24,
        animation: "fadeUp 0.4s ease both",
      }}>

        {/* ── COUPON SECTION ─────────────────────── */}
        <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 12 }}>
          <Tag size={14} color="#C9A84C" />
          <span style={{
            fontSize: 11, fontWeight: 700, letterSpacing: "0.2em",
            textTransform: "uppercase", color: "#C9A84C",
            fontFamily: "'Jost', sans-serif",
          }}>
            Coupons
          </span>
        </div>

        <p style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 17, fontWeight: 700, color: "#1a1205",
          margin: "0 0 12px",
        }}>
          Apply Coupons
        </p>

        {/* input row */}
        <div style={{ display: "flex", gap: 8, marginBottom: 6 }}>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="Enter coupon code"
            className="gold-input"
            style={{
              flex: 1, border: "1.5px solid #DDD0BE", borderRadius: 10,
              padding: "11px 14px", fontSize: 13, fontWeight: 500,
              color: "#1a1205", background: "#fdfaf6",
              fontFamily: "'Jost', sans-serif", boxSizing: "border-box",
            }}
          />
          <button
            onClick={applyCode}
            className="apply-coupon"
            style={{
              padding: "11px 16px", border: "2px solid #C9A84C",
              borderRadius: 10, background: "transparent",
              color: "#7a6030", fontSize: 12, fontWeight: 700,
              cursor: "pointer", letterSpacing: "0.1em",
              whiteSpace: "nowrap", fontFamily: "'Jost', sans-serif",
              transition: "background 0.2s, color 0.2s",
            }}
          >
            APPLY
          </button>
        </div>

        {/* feedback */}
        {cError && (
          <p style={{ fontSize: 11, color: "#ef4444", marginBottom: 4, fontFamily: "'Jost', sans-serif" }}>
            {cError}
          </p>
        )}
        {applied && (
          <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 4 }}>
            <Check size={12} color="#16a34a" strokeWidth={2.5} />
            <p style={{ fontSize: 11, color: "#16a34a", fontWeight: 700, margin: 0, fontFamily: "'Jost', sans-serif" }}>
              ₹300 coupon applied + free convenience fee!
            </p>
          </div>
        )}
        <p style={{ fontSize: 11.5, color: "#A89880", margin: "6px 0 18px", fontFamily: "'Jost', sans-serif" }}>
          Get up to{" "}
          <span style={{ fontWeight: 700, color: "#C9A84C" }}>₹300 OFF</span> — use{" "}
          <span style={{ fontWeight: 700, color: "#5c4220" }}>SAVE300</span>
        </p>

        {/* divider */}
        <div style={{ height: 1, background: "#EDE5D8", marginBottom: 18 }} />

        {/* ── PRICE BREAKDOWN ────────────────────── */}
        <p style={{
          fontSize: 11, fontWeight: 700, letterSpacing: "0.2em",
          textTransform: "uppercase", color: "#C9A84C",
          margin: "0 0 16px", fontFamily: "'Jost', sans-serif",
        }}>
          Price Details ({totalItems} item{totalItems !== 1 ? "s" : ""})
        </p>

        {/* rows */}
        {[
          { label: "Total MRP",        val: `₹${totalMrp.toLocaleString("en-IN")}`,   color: "#1a1205" },
          { label: "Discount on MRP",  val: `−₹${discount.toLocaleString("en-IN")}`,  color: "#16a34a" },
        ].map(({ label, val, color }) => (
          <div key={label} style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
            <span style={{ fontSize: 13, color: "#888", fontFamily: "'Jost', sans-serif" }}>{label}</span>
            <span style={{ fontSize: 13, fontWeight: 700, color, fontFamily: "'Jost', sans-serif" }}>{val}</span>
          </div>
        ))}

        {/* coupon row */}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
          <span style={{ fontSize: 13, color: "#888", fontFamily: "'Jost', sans-serif" }}>Coupon Discount</span>
          {applied
            ? <span style={{ fontSize: 13, fontWeight: 700, color: "#16a34a", fontFamily: "'Jost', sans-serif" }}>−₹300</span>
            : <button
                onClick={() => {}}
                style={{ fontSize: 12, color: "#C9A84C", fontWeight: 700, background: "none", border: "none", cursor: "pointer", fontFamily: "'Jost', sans-serif" }}
              >
                Apply Coupon
              </button>
          }
        </div>

        {/* convenience fee row */}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <div>
            <span style={{ fontSize: 13, color: "#888", fontFamily: "'Jost', sans-serif" }}>Convenience Fee</span>
            <button style={{ fontSize: 11, color: "#C9A84C", fontWeight: 700, background: "none", border: "none", cursor: "pointer", marginLeft: 5, fontFamily: "'Jost', sans-serif" }}>
              Know More
            </button>
          </div>
          {applied
            ? <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ fontSize: 12, color: "#ccc", textDecoration: "line-through", fontFamily: "'Jost', sans-serif" }}>₹49</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#16a34a", fontFamily: "'Jost', sans-serif" }}>FREE</span>
              </div>
            : <span style={{ fontSize: 13, fontWeight: 700, color: "#1a1205", fontFamily: "'Jost', sans-serif" }}>₹49</span>
          }
        </div>

        {/* divider */}
        <div style={{ height: 1, background: "#EDE5D8", margin: "14px 0 16px" }} />

        {/* total row — live */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <span style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 17, fontWeight: 700, color: "#1a1205",
          }}>
            Total Amount
          </span>
          <span
            key={total}
            style={{ fontSize: 21, fontWeight: 700, color: "#1a1205", fontFamily: "'Jost', sans-serif" }}
          >
            ₹{total.toLocaleString("en-IN")}
          </span>
        </div>

        {/* ── TRUST BADGES ─────────────────────────── */}
        <div style={{
          display: "flex", justifyContent: "space-around",
          border: "1.5px solid #EDE5D8", borderRadius: 14,
          padding: "12px 8px", marginBottom: 18,
          background: "#fdfaf6",
        }}>
          {[
            { Icon: Truck,     label: "Free Delivery" },
            { Icon: RotateCcw, label: "Easy Returns"  },
            { Icon: Shield,    label: "Secure Pay"    },
          ].map(({ Icon, label }) => (
            <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
              <Icon size={16} color="#C9A84C" strokeWidth={1.7} />
              <span style={{ fontSize: 10, fontWeight: 600, color: "#A89880", letterSpacing: "0.04em", fontFamily: "'Jost', sans-serif" }}>
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* ── PLACE ORDER CTA — only on payment step ── */}
        {step === "payment" && (
          <button className="cta-place" onClick={onPlaceOrder}>
            <span className="sweep" />
            <Sparkles size={14} style={{ position: "relative", zIndex: 1, color: "#d4a94a" }} />
            <span style={{ position: "relative", zIndex: 1 }}>Place Order</span>
            <CreditCard size={14} style={{ position: "relative", zIndex: 1 }} />
          </button>
        )}
      </div>
    </>
  );
}