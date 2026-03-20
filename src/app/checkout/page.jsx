// app/checkout/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, UserCircle2, LogIn } from "lucide-react";
import Stepper        from "../../components/checkout/Stepper";
import BagStep        from "../../components/checkout/BagStep";
import AddressStep    from "../../components/checkout/AddressStep";
import PaymentStep    from "../../components/checkout/PaymentStep";
import PriceSummary   from "../../components/checkout/PriceSummary";
import SuccessOverlay from "../../components/checkout/SuccessOverlay";
import { useAuth }    from "@/context/AuthContext";

/* ─────────────────────────────────────────
   AUTH GATE POPUP  (same design as CartPage)
───────────────────────────────────────── */
function AuthGatePopup() {
  const router = useRouter();

  const go = (path) => router.push(`${path}?redirect=/checkout`);

  return (
    <>
      <style>{`
        @keyframes coPopIn {
          0%  { opacity:0; transform:scale(0.88); }
          70% { transform:scale(1.02); }
          100%{ opacity:1; transform:scale(1); }
        }
        @keyframes coBdIn { from{opacity:0} to{opacity:1} }
        @keyframes coShimmer { from{transform:translateX(-100%)} to{transform:translateX(250%)} }
        @keyframes coRp {
          0%,100%{box-shadow:0 6px 28px rgba(20,14,4,.3),0 0 0 0 rgba(201,168,76,0)}
          50%    {box-shadow:0 6px 28px rgba(20,14,4,.3),0 0 0 5px rgba(201,168,76,.18)}
        }
        .co-bd   { animation: coBdIn .25s ease both }
        .co-card { animation: coPopIn .4s cubic-bezier(.22,1,.36,1) both }
        .co-cta {
          position:relative;overflow:hidden;
          display:flex;align-items:center;justify-content:center;gap:9px;
          width:100%;padding:14px 0;border-radius:12px;border:none;cursor:pointer;
          background:linear-gradient(120deg,#140e04 0%,#3a2408 45%,#5a3a0c 65%,#140e04 100%);
          color:#fff;font-size:12.5px;font-weight:700;letter-spacing:.15em;
          text-transform:uppercase;font-family:'Jost',sans-serif;
          animation:coRp 3.5s ease infinite;
          transition:transform .25s;
        }
        .co-cta::before{
          content:'';position:absolute;top:0;left:12%;right:12%;height:1px;
          background:linear-gradient(90deg,transparent,rgba(201,168,76,.65),transparent);
        }
        .co-cta .sw{
          position:absolute;inset:0;
          background:linear-gradient(105deg,transparent 25%,rgba(201,168,76,.22) 50%,transparent 75%);
          transform:translateX(-100%);
        }
        .co-cta:hover{transform:translateY(-2px)}
        .co-cta:hover .sw{animation:coShimmer .6s ease forwards}
        .co-outline{
          display:flex;align-items:center;justify-content:center;gap:8px;
          width:100%;padding:13px 0;border-radius:12px;cursor:pointer;
          border:2px solid #C9A84C;background:transparent;
          color:#7a6030;font-size:12.5px;font-weight:700;letter-spacing:.12em;
          text-transform:uppercase;font-family:'Jost',sans-serif;
          transition:background .2s,transform .2s;
        }
        .co-outline:hover{background:#fdf9f0;transform:translateY(-1px)}
      `}</style>

      {/* full-screen flex-centred overlay — no ✕, no dismiss on backdrop click
          user MUST log in or sign up to continue                              */}
      <div
        className="co-bd"
        style={{
          position:"fixed", inset:0, zIndex:9999,
          background:"rgba(10,8,4,0.72)",
          backdropFilter:"blur(7px)",
          display:"flex", alignItems:"center", justifyContent:"center",
          padding:"20px",
        }}
      >
        <div
          className="co-card"
          style={{
            width:"100%", maxWidth:400,
            background:"#fff", borderRadius:22, overflow:"hidden",
            boxShadow:"0 32px 80px rgba(0,0,0,0.3), 0 0 0 1px rgba(201,168,76,.12)",
            fontFamily:"'Jost',sans-serif", position:"relative",
          }}
        >
          {/* gold top bar */}
          <div style={{ height:3,
            background:"linear-gradient(90deg,#C9A84C,#e8c96a,#C9A84C)" }}/>

          <div style={{ padding:"30px 30px 32px" }}>

            {/* icon */}
            <div style={{
              width:62, height:62, borderRadius:"50%",
              background:"linear-gradient(135deg,#fdf8f0,#f0e6d0)",
              border:"1.5px solid #EDE5D8",
              boxShadow:"0 6px 22px rgba(201,168,76,.18)",
              display:"flex", alignItems:"center", justifyContent:"center",
              margin:"0 auto 20px",
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
                Session Ended
              </span>
              <div style={{ height:1,width:28,
                background:"linear-gradient(90deg,#C9A84C,transparent)" }}/>
            </div>

            <h2 style={{
              fontFamily:"'Cormorant Garamond',serif",
              fontSize:22, fontWeight:700, color:"#1a1205",
              textAlign:"center", margin:"0 0 10px", lineHeight:1.2,
            }}>
              You've been signed out
            </h2>

            <p style={{
              fontSize:13, color:"#A89880", textAlign:"center",
              lineHeight:1.75, margin:"0 0 24px",
            }}>
              Please log back in to complete your order.
              Your cart items are still saved.
            </p>

            <div style={{ height:1,
              background:"linear-gradient(90deg,transparent,#EDE5D8,transparent)",
              marginBottom:20 }}/>

            <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
              <button className="co-cta" onClick={() => go("/login")}>
                <span className="sw"/>
                <LogIn size={13} style={{ position:"relative",zIndex:1,color:"#d4a94a" }}/>
                <span style={{ position:"relative",zIndex:1 }}>Log In to Continue</span>
              </button>

              <button className="co-outline" onClick={() => go("/sign-up")}>
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
   CHECKOUT PAGE
───────────────────────────────────────── */
export default function CheckoutPage() {
  const { user, ready } = useAuth();
  const [step,    setStep]    = useState("bag");
  const [success, setSuccess] = useState(false);

  const handleSuccess = () => setSuccess(true);
  const handleClose   = () => { setSuccess(false); setStep("bag"); };

  /* Show the auth gate whenever user is null (logged out mid-checkout) */
  const showAuthGate = ready && !user;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Jost:wght@300;400;500;600;700&display=swap');

        * { font-family: 'Jost', sans-serif; }

        @keyframes fadeSlide {
          from { opacity:0; transform:translateY(12px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes stepIn {
          from { opacity:0; transform:translateX(18px); }
          to   { opacity:1; transform:translateX(0); }
        }
        @keyframes successIn {
          from { opacity:0; transform:scale(0.88); }
          to   { opacity:1; transform:scale(1); }
        }
        @keyframes popIn {
          0%   { transform:scale(0); opacity:0; }
          70%  { transform:scale(1.15); }
          100% { transform:scale(1); opacity:1; }
        }

        .step-panel   { animation: stepIn 0.35s ease both; }
        .payment-form { animation: fadeSlide 0.25s ease both; }

        .place-btn::after {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(90deg,transparent,rgba(255,255,255,0.08),transparent);
          transform: translateX(-100%);
          transition: transform 0.6s ease;
        }
        .place-btn:hover::after { transform: translateX(100%); }
      `}</style>

      <div className="min-h-screen" style={{ background: "#F4EFE6" }}>

        {/* PAGE HEADER */}
        <div className="bg-[#F0E9DB] border-b border-[#E5D9C8] py-7 text-center
                        animate-[fadeSlide_0.4s_ease_both]">
          <h1 className="text-[32px] font-bold text-gray-900"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Checkout
          </h1>
          <p className="text-[12px] text-gray-400 mt-1 tracking-wide">
            <span className="hover:text-gray-600 cursor-pointer transition-colors">Home</span>
            {" / "}
            <span className="text-gray-600 font-medium">Checkout</span>
          </p>
        </div>

        {/* STEPPER */}
        <Stepper current={step} />

        {/* TWO-COLUMN LAYOUT */}
        <div className="max-w-[960px] mx-auto px-4 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-5 items-start">

            {/* LEFT — active step */}
            <div>
              {step === "bag" && (
                <BagStep onNext={() => setStep("address")} />
              )}
              {step === "address" && (
                <AddressStep
                  onNext={() => setStep("payment")}
                  onBack={() => setStep("bag")}
                />
              )}
              {step === "payment" && (
                <PaymentStep onBack={() => setStep("address")} />
              )}
            </div>

            {/* RIGHT — price summary */}
            <PriceSummary step={step} onPlaceOrder={handleSuccess} />
          </div>
        </div>
      </div>

      {/* SUCCESS MODAL */}
      {success && <SuccessOverlay onClose={handleClose} />}

      {/* AUTH GATE — overlays everything if user logs out mid-checkout */}
      {showAuthGate && <AuthGatePopup />}
    </>
  );
}