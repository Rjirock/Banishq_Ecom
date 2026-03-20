// app/cart/page.jsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Trash2, Plus, Minus, Tag,
  ShoppingBag, ArrowRight, Shield,
  Truck, RotateCcw, Sparkles, X,
  UserCircle2, LogIn,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

/* ─────────────────────────────────────────
   AUTH GATE POPUP
───────────────────────────────────────── */
function AuthGatePopup({ onClose }) {
  const router = useRouter();
  const go = (path) => {
    onClose();
    // Append ?redirect=/checkout so login/sign-up pages know where to send the user after auth
    router.push(`${path}?redirect=/checkout`);
  };

  return (
    <>
      <style>{`
        @keyframes popIn {
          0%  { opacity:0; transform:scale(0.88); }
          70% { transform:scale(1.02); }
          100%{ opacity:1; transform:scale(1); }
        }
        @keyframes bdIn   { from{opacity:0} to{opacity:1} }
        @keyframes shimmer{ from{transform:translateX(-100%)} to{transform:translateX(250%)} }
        @keyframes rp2 {
          0%,100%{box-shadow:0 6px 28px rgba(20,14,4,.3),0 0 0 0 rgba(201,168,76,0)}
          50%    {box-shadow:0 6px 28px rgba(20,14,4,.3),0 0 0 5px rgba(201,168,76,.18)}
        }
        .auth-bd   { animation: bdIn .25s ease both }
        .auth-card { animation: popIn .4s cubic-bezier(.22,1,.36,1) both }
        .auth-cta {
          position:relative;overflow:hidden;
          display:flex;align-items:center;justify-content:center;gap:9px;
          width:100%;padding:14px 0;border-radius:12px;border:none;cursor:pointer;
          background:linear-gradient(120deg,#140e04 0%,#3a2408 45%,#5a3a0c 65%,#140e04 100%);
          color:#fff;font-size:12.5px;font-weight:700;letter-spacing:.15em;
          text-transform:uppercase;font-family:'Jost',sans-serif;
          animation:rp2 3.5s ease infinite;
          transition:transform .25s,box-shadow .25s;
        }
        .auth-cta::before{
          content:'';position:absolute;top:0;left:12%;right:12%;height:1px;
          background:linear-gradient(90deg,transparent,rgba(201,168,76,.65),transparent);
        }
        .auth-cta .sw{
          position:absolute;inset:0;
          background:linear-gradient(105deg,transparent 25%,rgba(201,168,76,.22) 50%,transparent 75%);
          transform:translateX(-100%);
        }
        .auth-cta:hover{transform:translateY(-2px)}
        .auth-cta:hover .sw{animation:shimmer .6s ease forwards}
        .auth-outline{
          display:flex;align-items:center;justify-content:center;gap:8px;
          width:100%;padding:13px 0;border-radius:12px;cursor:pointer;
          border:2px solid #C9A84C;background:transparent;
          color:#7a6030;font-size:12.5px;font-weight:700;letter-spacing:.12em;
          text-transform:uppercase;font-family:'Jost',sans-serif;
          transition:background .2s,transform .2s;
        }
        .auth-outline:hover{background:#fdf9f0;transform:translateY(-1px)}
      `}</style>

      {/* ── FULL-SCREEN FLEX CENTRED OVERLAY ── */}
      <div
        className="auth-bd"
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, zIndex: 9998,
          background: "rgba(10,8,4,0.62)",
          backdropFilter: "blur(6px)",
          /* flex centering — this is what actually positions the card */
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",           /* prevents card touching edges on tiny screens */
        }}
      >
        {/* ── CARD — stop clicks bubbling to backdrop ── */}
        <div
          className="auth-card"
          onClick={e => e.stopPropagation()}
          style={{
            width: "100%",
            maxWidth: 400,
            background: "#fff",
            borderRadius: 22,
            overflow: "hidden",
            boxShadow: "0 32px 80px rgba(0,0,0,0.28), 0 0 0 1px rgba(201,168,76,.12)",
            fontFamily: "'Jost',sans-serif",
            position: "relative",
          }}
        >
          {/* gold top bar */}
          <div style={{ height: 3,
            background: "linear-gradient(90deg,#C9A84C,#e8c96a,#C9A84C)" }}/>

          {/* ✕ close */}
          <button
            onClick={onClose}
            style={{
              position:"absolute", top:14, right:14,
              width:28, height:28, borderRadius:"50%",
              border:"1.5px solid #EDE5D8", background:"#fdfaf6",
              display:"flex", alignItems:"center", justifyContent:"center",
              cursor:"pointer", color:"#999", transition:"all .15s", zIndex:1,
            }}
            onMouseEnter={e=>{e.currentTarget.style.borderColor="#C9A84C";e.currentTarget.style.color="#C9A84C"}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor="#EDE5D8";e.currentTarget.style.color="#999"}}
          >
            <X size={13} strokeWidth={2.5}/>
          </button>

          <div style={{ padding: "30px 30px 32px" }}>

            {/* icon */}
            <div style={{
              width: 62, height: 62, borderRadius: "50%",
              background: "linear-gradient(135deg,#fdf8f0,#f0e6d0)",
              border: "1.5px solid #EDE5D8",
              boxShadow: "0 6px 22px rgba(201,168,76,.18)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 20px",
            }}>
              <UserCircle2 size={28} color="#C9A84C" strokeWidth={1.4}/>
            </div>

            {/* eyebrow */}
            <div style={{ display:"flex",alignItems:"center",justifyContent:"center",
              gap:8, marginBottom:12 }}>
              <div style={{ height:1,width:28,
                background:"linear-gradient(90deg,transparent,#C9A84C)" }}/>
              <span style={{ fontSize:9.5,fontWeight:700,letterSpacing:".26em",
                color:"#C9A84C",textTransform:"uppercase" }}>
                One Step Away
              </span>
              <div style={{ height:1,width:28,
                background:"linear-gradient(90deg,#C9A84C,transparent)" }}/>
            </div>

            {/* headline */}
            <h2 style={{
              fontFamily: "'Cormorant Garamond',serif",
              fontSize: 22, fontWeight: 700, color: "#1a1205",
              textAlign: "center", margin: "0 0 10px", lineHeight: 1.2,
            }}>
              Please sign in to continue
            </h2>

            <p style={{
              fontSize: 13, color: "#A89880", textAlign: "center",
              lineHeight: 1.75, margin: "0 0 24px",
            }}>
              Log in or create a free account to securely
              place your order and track it anytime.
            </p>

            {/* gold rule */}
            <div style={{ height:1,
              background:"linear-gradient(90deg,transparent,#EDE5D8,transparent)",
              marginBottom:20 }}/>

            {/* CTAs */}
            <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
              <button className="auth-cta" onClick={() => go("/login")}>
                <span className="sw"/>
                <LogIn size={13} style={{ position:"relative",zIndex:1,color:"#d4a94a" }}/>
                <span style={{ position:"relative",zIndex:1 }}>Log In to Continue</span>
              </button>

              <button className="auth-outline" onClick={() => go("/sign-up")}>
                <UserCircle2 size={14}/>
                Create Free Account
              </button>
            </div>

            <p style={{ fontSize:11,color:"#C9A84C",textAlign:"center",
              marginTop:16,fontWeight:600,letterSpacing:".05em" }}>
              🔒 &nbsp;Your cart is saved — items won't be lost
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────
   CART PAGE
───────────────────────────────────────── */
export default function CartPage() {
  const { cart, updateQty, removeItem } = useCart();
  const { user } = useAuth();
  const router   = useRouter();

  const [coupon,        setCoupon]        = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError,   setCouponError]   = useState("");
  const [showAuthGate,  setShowAuthGate]  = useState(false);   // ← new

  const subtotal   = cart.reduce((s, x) => s + x.price * x.qty, 0);
  const totalMrp   = cart.reduce((s, x) => s + x.originalPrice * x.qty, 0);
  const savings    = totalMrp - subtotal;
  const couponDisc = couponApplied ? Math.round(subtotal * 0.1) : 0;
  const total      = subtotal - couponDisc;

  const applyCode = () => {
    if (coupon.trim().toUpperCase() === "SAVE10") {
      setCouponApplied(true); setCouponError("");
    } else {
      setCouponError("Invalid code — try SAVE10"); setCouponApplied(false);
    }
  };

  /* ── auth-gated checkout ── */
  const handleCheckout = () => {
    if (user) {
      router.push("/checkout");   // logged in → go straight to checkout
    } else {
      setShowAuthGate(true);      // not logged in → show popup
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Jost:wght@400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; font-family: 'Jost', sans-serif; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmerSweep {
          from { transform: translateX(-100%); }
          to   { transform: translateX(250%); }
        }
        @keyframes ringPulse {
          0%,100% { box-shadow: 0 6px 28px rgba(20,14,4,0.32), 0 0 0 0 rgba(201,168,76,0); }
          50%      { box-shadow: 0 6px 28px rgba(20,14,4,0.32), 0 0 0 5px rgba(201,168,76,0.14); }
        }
        @keyframes priceFlash {
          0%   { color: #C9A84C; transform: scale(1.08); }
          100% { color: #1a1205; transform: scale(1); }
        }

        .page-in { animation: fadeUp 0.4s ease both; }
        .item-in { animation: fadeUp 0.35s ease both; }
        .price-live { transition: color 0.25s ease, transform 0.25s ease; }
        .price-live.flash { animation: priceFlash 0.45s ease forwards; }

        .qty-ctrl {
          display: inline-flex; align-items: center;
          border: 1.5px solid #DDD0BE; border-radius: 10px; overflow: hidden;
        }
        .qty-btn {
          width: 34px; height: 34px;
          display: flex; align-items: center; justify-content: center;
          background: #fff; border: none; cursor: pointer;
          color: #999; transition: all 0.15s ease;
        }
        .qty-btn:hover { background: #fdf9f0; color: #C9A84C; }
        .qty-num {
          width: 40px; height: 34px;
          display: flex; align-items: center; justify-content: center;
          font-size: 14px; font-weight: 700; color: #1a1205;
          border-left: 1.5px solid #DDD0BE; border-right: 1.5px solid #DDD0BE;
        }

        .gold-input { transition: border-color 0.2s, box-shadow 0.2s; }
        .gold-input:focus {
          outline: none;
          border-color: #C9A84C !important;
          box-shadow: 0 0 0 3px rgba(201,168,76,0.12);
        }

        .cta-btn {
          display: flex; align-items: center; justify-content: center; gap: 10px;
          width: 100%; padding: 16px 0; border-radius: 14px;
          border: none; cursor: pointer; position: relative; overflow: hidden;
          background: linear-gradient(120deg, #140e04 0%, #3a2408 45%, #5a3a0c 65%, #140e04 100%);
          color: #fff; font-family: 'Jost', sans-serif; font-size: 13px; font-weight: 700;
          letter-spacing: 0.18em; text-transform: uppercase;
          animation: ringPulse 3.5s ease infinite;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .cta-btn::before {
          content: ''; position: absolute; top: 0; left: 12%; right: 12%; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(201,168,76,0.65), transparent);
        }
        .cta-btn .sweep {
          position: absolute; inset: 0;
          background: linear-gradient(105deg, transparent 25%, rgba(201,168,76,0.2) 50%, transparent 75%);
          transform: translateX(-100%);
        }
        .cta-btn:hover { transform: translateY(-2px); box-shadow: 0 14px 38px rgba(20,14,4,0.42); }
        .cta-btn:hover .sweep { animation: shimmerSweep 0.7s ease forwards; }
        .cta-btn:active { transform: translateY(0); }

        .remove-btn { transition: border-color 0.2s, color 0.2s, background 0.2s; }
        .remove-btn:hover { border-color: #fca5a5 !important; color: #ef4444 !important; background: #fff5f5 !important; }
        .apply-btn  { transition: background 0.2s, color 0.2s; }
        .apply-btn:hover { background: #C9A84C !important; color: #fff !important; }
      `}</style>

      {/* ── AUTH GATE POPUP ── */}
      {showAuthGate && <AuthGatePopup onClose={() => setShowAuthGate(false)} />}

      <div style={{ minHeight: "100vh", background: "#F4EFE6" }}>

        {/* HEADER */}
        <div className="page-in" style={{
          background: "#F0E9DB", borderBottom: "1.5px solid #E5D9C8",
          padding: "28px 16px", textAlign: "center",
        }}>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif",
            fontSize: 34, fontWeight: 700, color: "#1a1205", margin: 0 }}>
            My Cart
          </h1>
          <p style={{ fontSize: 12, color: "#A89880", marginTop: 6, letterSpacing: "0.05em" }}>
            <span style={{ cursor: "pointer" }}>Home</span>
            <span style={{ margin: "0 6px", color: "#C9A84C" }}>›</span>
            <span style={{ color: "#6b5327", fontWeight: 600 }}>Cart</span>
          </p>
        </div>

        <div style={{ maxWidth: 1240, margin: "0 auto", padding: "32px 24px 72px" }}>

          {/* EMPTY */}
          {cart.length === 0 ? (
            <div className="page-in" style={{ display:"flex",flexDirection:"column",
              alignItems:"center",justifyContent:"center",padding:"80px 16px",textAlign:"center" }}>
              <div style={{ width:68,height:68,borderRadius:"50%",
                background:"#EDE5D8",display:"flex",alignItems:"center",
                justifyContent:"center",marginBottom:20 }}>
                <ShoppingBag size={28} color="#C9A84C" strokeWidth={1.5} />
              </div>
              <h2 style={{ fontFamily:"'Cormorant Garamond',serif",
                fontSize:26,fontWeight:700,color:"#1a1205",margin:"0 0 8px" }}>
                Your cart is empty
              </h2>
              <p style={{ fontSize:13,color:"#A89880",marginBottom:24 }}>
                Discover our curated collection and add items.
              </p>
              <Link href="/products" className="cta-btn"
                style={{ width:"auto",padding:"13px 32px",textDecoration:"none" }}>
                <span className="sweep" />
                <span style={{ position:"relative",zIndex:1 }}>Explore Collection</span>
                <ArrowRight size={14} style={{ position:"relative",zIndex:1 }} />
              </Link>
            </div>

          ) : (
            <div style={{ display:"flex",gap:24,alignItems:"flex-start",flexWrap:"wrap" }}>

              {/* LEFT: items */}
              <div style={{ flex:"1 1 600px",minWidth:0,background:"#fff",
                borderRadius:20,border:"1.5px solid #EDE5D8",
                boxShadow:"0 2px 24px rgba(0,0,0,0.05)",padding:"28px" }}>

                <div style={{ marginBottom:6 }}>
                  <h2 style={{ fontFamily:"'Cormorant Garamond',serif",
                    fontSize:22,fontWeight:700,color:"#1a1205",margin:0 }}>
                    My Cart
                    <span style={{ fontFamily:"'Jost',sans-serif",
                      fontSize:14,color:"#C9A84C",marginLeft:10,fontWeight:700 }}>
                      ({cart.length} {cart.length === 1 ? "item" : "items"})
                    </span>
                  </h2>
                </div>

                {savings > 0 && (
                  <p style={{ fontSize:12,fontWeight:700,color:"#16a34a",marginBottom:14,marginTop:4 }}>
                    🎉 You're saving ₹{savings.toLocaleString("en-IN")} on this order!
                  </p>
                )}
                <div style={{ height:1,background:"#EDE5D8",marginBottom:4 }} />

                {cart.map((item, idx) => (
                  <div key={item.id} className="item-in" style={{ animationDelay:`${idx * 0.07}s` }}>
                    <div style={{ display:"flex",gap:18,alignItems:"flex-start",padding:"22px 0" }}>

                      {/* image */}
                      <div style={{ width:100,height:100,flexShrink:0,
                        borderRadius:14,overflow:"hidden",
                        border:"1.5px solid #EDE5D8",background:"#fdfaf6" }}>
                        {item.image ? (
                          <img src={item.image} alt={item.name}
                            style={{ width:"100%",height:"100%",objectFit:"cover",display:"block" }}/>
                        ) : (
                          <svg viewBox="0 0 100 100" width="100%" height="100%">
                            <rect width="100" height="100" fill="#f5f0e8"/>
                            <ellipse cx="50" cy="45" rx="18" ry="22" fill="#d4a94a" opacity="0.85"/>
                            <ellipse cx="50" cy="45" rx="12" ry="15" fill="#e8c96a" opacity="0.7"/>
                            <circle cx="50" cy="28" r="5" fill="#c8952a"/>
                            <circle cx="50" cy="45" r="4" fill="#fff" opacity="0.4"/>
                          </svg>
                        )}
                      </div>

                      {/* info */}
                      <div style={{ flex:1,minWidth:0 }}>
                        <div style={{ display:"flex",justifyContent:"space-between",gap:10,marginBottom:4 }}>
                          <p style={{ fontFamily:"'Cormorant Garamond',serif",
                            fontSize:16,fontWeight:700,color:"#1a1205",margin:0,lineHeight:1.35,
                            display:"-webkit-box",WebkitLineClamp:2,
                            WebkitBoxOrient:"vertical",overflow:"hidden" }}>
                            {item.name}
                          </p>
                          <button className="remove-btn" onClick={() => removeItem(item.id)}
                            style={{ flexShrink:0,width:30,height:30,borderRadius:"50%",
                              border:"1.5px solid #EDE5D8",background:"#fff",cursor:"pointer",
                              display:"flex",alignItems:"center",justifyContent:"center",color:"#bbb" }}>
                            <Trash2 size={13}/>
                          </button>
                        </div>

                        {item.brand && (
                          <p style={{ fontSize:11,color:"#B8A080",fontWeight:600,
                            margin:"0 0 12px",letterSpacing:"0.04em" }}>
                            {item.brand}
                          </p>
                        )}

                        <div style={{ display:"flex",alignItems:"baseline",gap:10,
                          marginBottom:16,flexWrap:"wrap" }}>
                          <span key={item.qty} className="price-live flash"
                            style={{ fontSize:18,fontWeight:700,color:"#1a1205" }}>
                            ₹{(item.price * item.qty).toLocaleString("en-IN")}
                          </span>
                          {item.qty > 1 && (
                            <span style={{ fontSize:12,color:"#B8A080",fontWeight:500 }}>
                              ₹{item.price.toLocaleString("en-IN")} each
                            </span>
                          )}
                          <span style={{ fontSize:12,color:"#ccc",textDecoration:"line-through" }}>
                            ₹{(item.originalPrice * item.qty).toLocaleString("en-IN")}
                          </span>
                          <span style={{ background:"#FFF9E6",
                            border:"1px solid rgba(201,168,76,0.3)",
                            color:"#7a5f1a",fontSize:10,fontWeight:700,
                            padding:"3px 9px",borderRadius:20,letterSpacing:"0.04em" }}>
                            {item.discount}% OFF
                          </span>
                        </div>

                        <div className="qty-ctrl">
                          <button className="qty-btn" onClick={() => updateQty(item.id, -1)}>
                            <Minus size={13}/>
                          </button>
                          <span className="qty-num">{item.qty}</span>
                          <button className="qty-btn" onClick={() => updateQty(item.id, +1)}>
                            <Plus size={13}/>
                          </button>
                        </div>
                      </div>
                    </div>
                    {idx < cart.length - 1 && (
                      <div style={{ height:1,background:"#F2EDE5" }}/>
                    )}
                  </div>
                ))}
              </div>

              {/* RIGHT: summary */}
              <div style={{ flex:"0 0 320px",width:320,
                display:"flex",flexDirection:"column",gap:18,
                position:"sticky",top:24 }}>

                {/* coupon */}
                <div style={{ background:"#fff",borderRadius:20,
                  border:"1.5px solid #EDE5D8",
                  boxShadow:"0 2px 24px rgba(0,0,0,0.05)",padding:"22px" }}>
                  <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:14 }}>
                    <Tag size={14} color="#C9A84C"/>
                    <span style={{ fontSize:11,fontWeight:700,letterSpacing:"0.2em",
                      color:"#888",textTransform:"uppercase" }}>Apply Coupon</span>
                  </div>
                  <div style={{ display:"flex",gap:8 }}>
                    <input value={coupon}
                      onChange={e => setCoupon(e.target.value.toUpperCase())}
                      placeholder="Enter code" className="gold-input"
                      style={{ flex:1,border:"1.5px solid #DDD0BE",borderRadius:10,
                        padding:"11px 14px",fontSize:13,fontWeight:500,color:"#1a1205",
                        background:"#fdfaf6",fontFamily:"'Jost',sans-serif" }}/>
                    <button onClick={applyCode} className="apply-btn"
                      style={{ padding:"11px 16px",border:"2px solid #C9A84C",borderRadius:10,
                        background:"transparent",color:"#7a6030",fontSize:12,fontWeight:700,
                        cursor:"pointer",letterSpacing:"0.1em",whiteSpace:"nowrap",
                        fontFamily:"'Jost',sans-serif" }}>
                      APPLY
                    </button>
                  </div>
                  {couponError   && <p style={{ fontSize:11,color:"#ef4444",marginTop:8 }}>{couponError}</p>}
                  {couponApplied && <p style={{ fontSize:11,color:"#16a34a",fontWeight:700,marginTop:8 }}>✓ 10% discount applied!</p>}
                  <p style={{ fontSize:11,color:"#B8A080",marginTop:8 }}>
                    Try <strong style={{ color:"#5c4220" }}>SAVE10</strong> for 10% off
                  </p>
                </div>

                {/* price details */}
                <div style={{ background:"#fff",borderRadius:20,
                  border:"1.5px solid #EDE5D8",
                  boxShadow:"0 2px 24px rgba(0,0,0,0.05)",padding:"22px" }}>
                  <p style={{ fontSize:11,fontWeight:700,letterSpacing:"0.22em",
                    textTransform:"uppercase",color:"#C9A84C",marginBottom:16 }}>
                    Price Details
                  </p>
                  <div style={{ height:1,background:"#EDE5D8",marginBottom:16 }}/>

                  {[
                    { label:"Total MRP",       val:`₹${totalMrp.toLocaleString("en-IN")}`,  color:"#1a1205" },
                    { label:"Discount on MRP", val:`−₹${savings.toLocaleString("en-IN")}`,  color:"#16a34a" },
                    { label:"Shipping",        val:"FREE",                                   color:"#16a34a" },
                    ...(couponApplied
                      ? [{ label:"Coupon (SAVE10)", val:`−₹${couponDisc.toLocaleString("en-IN")}`, color:"#16a34a" }]
                      : []),
                  ].map(({ label, val, color }) => (
                    <div key={label} style={{ display:"flex",justifyContent:"space-between",marginBottom:13 }}>
                      <span style={{ fontSize:13,color:"#888" }}>{label}</span>
                      <span style={{ fontSize:13,fontWeight:700,color }}>{val}</span>
                    </div>
                  ))}

                  <div style={{ height:1,background:"#EDE5D8",margin:"4px 0 18px" }}/>

                  <div style={{ display:"flex",justifyContent:"space-between",
                    alignItems:"center",marginBottom:22 }}>
                    <span style={{ fontFamily:"'Cormorant Garamond',serif",
                      fontSize:17,fontWeight:700,color:"#1a1205" }}>
                      Total Amount
                    </span>
                    <span key={total} className="price-live flash"
                      style={{ fontSize:22,fontWeight:700,color:"#1a1205" }}>
                      ₹{total.toLocaleString("en-IN")}
                    </span>
                  </div>

                  {/* ── AUTH-GATED CHECKOUT BUTTON ── */}
                  <button onClick={handleCheckout} className="cta-btn">
                    <span className="sweep"/>
                    <Sparkles size={14} style={{ position:"relative",zIndex:1,color:"#d4a94a" }}/>
                    <span style={{ position:"relative",zIndex:1 }}>Secure Checkout</span>
                    <ArrowRight size={14} style={{ position:"relative",zIndex:1 }}/>
                  </button>

                  {/* login nudge shown when not logged in */}
                  {!user && (
                    <p style={{ fontSize:11,color:"#A89880",textAlign:"center",
                      marginTop:10,lineHeight:1.5 }}>
                      <span style={{ color:"#C9A84C",fontWeight:700 }}>Sign in</span> required to checkout
                    </p>
                  )}

                  {/* trust row */}
                  <div style={{ display:"flex",justifyContent:"space-around",
                    marginTop:18,paddingTop:16,borderTop:"1px solid #EDE5D8" }}>
                    {[
                      { Icon: Truck,     label: "Free Delivery" },
                      { Icon: RotateCcw, label: "Easy Returns"  },
                      { Icon: Shield,    label: "Secure Pay"    },
                    ].map(({ Icon, label }) => (
                      <div key={label} style={{ display:"flex",flexDirection:"column",
                        alignItems:"center",gap:5 }}>
                        <Icon size={16} color="#C9A84C" strokeWidth={1.7}/>
                        <span style={{ fontSize:10,fontWeight:600,color:"#A89880",
                          letterSpacing:"0.04em" }}>{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}