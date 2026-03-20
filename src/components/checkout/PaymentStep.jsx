// components/checkout/PaymentStep.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, CreditCard, Smartphone, Wallet, Building2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import RazorpayCheckout from "../payment-gateway/Razorpaycheckout";

const METHODS = [
  { key: "card", label: "Credit / Debit Card", icon: CreditCard, online: true  },
  { key: "upi",  label: "UPI Payment",         icon: Smartphone,  online: true  },
  { key: "nb",   label: "Net Banking",         icon: Building2,   online: true  },
  { key: "cod",  label: "Cash on Delivery",    icon: Wallet,      online: false },
];

const BANKS = ["SBI", "HDFC Bank", "ICICI Bank", "Axis Bank", "Kotak Mahindra", "PNB", "Bank of Baroda"];

const labelStyle = {
  display: "block", fontSize: 12, fontWeight: 700,
  color: "#5c4220", marginBottom: 7, letterSpacing: "0.04em",
  fontFamily: "'Jost', sans-serif",
};

const inputBase = {
  width: "100%", border: "1.5px solid #DDD0BE", borderRadius: 12,
  padding: "12px 16px", fontSize: 14, fontWeight: 500, color: "#1a1205",
  background: "#fdfaf6", outline: "none", fontFamily: "'Jost', sans-serif",
  transition: "border-color 0.2s, box-shadow 0.2s", boxSizing: "border-box",
};

const FocusInput = ({ style = {}, ...props }) => (
  <input {...props}
    style={{ ...inputBase, ...style }}
    onFocus={e => { e.target.style.borderColor="#C9A84C"; e.target.style.boxShadow="0 0 0 3px rgba(201,168,76,0.12)"; }}
    onBlur={e  => { e.target.style.borderColor="#DDD0BE"; e.target.style.boxShadow="none"; }}
  />
);

const FocusSelect = ({ style = {}, children, ...props }) => (
  <select {...props}
    style={{ ...inputBase, cursor:"pointer", ...style }}
    onFocus={e => { e.target.style.borderColor="#C9A84C"; e.target.style.boxShadow="0 0 0 3px rgba(201,168,76,0.12)"; }}
    onBlur={e  => { e.target.style.borderColor="#DDD0BE"; e.target.style.boxShadow="none"; }}
  >
    {children}
  </select>
);

export default function PaymentStep({ onBack, totalAmount, addressData }) {
  const router   = useRouter();
  const { user } = useAuth();

  const [method, setMethod] = useState("card");
  const [card,   setCard]   = useState({ number:"", name:"", expiry:"", cvv:"" });
  const [upiId,  setUpiId]  = useState("");
  const [bank,   setBank]   = useState("");

  const setC = (k) => (e) => setCard(p => ({ ...p, [k]: e.target.value }));

  const isOnline    = METHODS.find(m => m.key === method)?.online ?? true;
  const amountToPay = method === "cod"
    ? (totalAmount ?? 0) + 49    // ₹49 COD handling fee
    : (totalAmount ?? 0);

  const handleCOD = () => {
    router.push("/order-confirmed");
  };

  const handlePaymentSuccess = (paymentData) => {
    router.push("/order-confirmed");
  };

  const handlePaymentFailure = (error) => {
    console.error("Payment failed:", error);
  };

  return (
    <div style={{
      background: "#fff", borderRadius: 20,
      border: "1.5px solid #EDE5D8",
      boxShadow: "0 2px 20px rgba(0,0,0,0.05)",
      padding: "28px",
      animation: "stepIn 0.35s ease both",
    }}>

      {/* HEADER */}
      <h2 style={{ fontFamily:"'Cormorant Garamond',serif",
        fontSize:24, fontWeight:700, color:"#1a1205", margin:"0 0 6px" }}>
        Payment Method
      </h2>
      <p style={{ fontSize:13, color:"#A89880", margin:"0 0 24px",
        fontFamily:"'Jost',sans-serif" }}>
        All transactions are secure and encrypted.
      </p>

      {/* METHOD CARDS */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:26 }}>
        {METHODS.map(({ key, label, icon: Icon }) => {
          const active = method === key;
          return (
            <button key={key} onClick={() => setMethod(key)}
              style={{
                display:"flex", alignItems:"center", gap:12,
                padding:"15px 16px", borderRadius:14, textAlign:"left",
                border:`2px solid ${active ? "#C9A84C" : "#EDE5D8"}`,
                background: active ? "#fdf9f0" : "#fdfaf6",
                boxShadow: active ? "0 3px 14px rgba(201,168,76,0.18)" : "none",
                cursor:"pointer", transition:"all 0.2s ease",
              }}>
              <div style={{ width:36, height:36, borderRadius:"50%", flexShrink:0,
                background: active ? "rgba(201,168,76,0.12)" : "#F4EFE6",
                display:"flex", alignItems:"center", justifyContent:"center" }}>
                <Icon size={17} color={active ? "#C9A84C" : "#B8A080"} strokeWidth={1.8}/>
              </div>
              <span style={{ fontFamily:"'Jost',sans-serif", fontSize:13, fontWeight:700,
                flex:1, color: active ? "#7a6030" : "#888", lineHeight:1.3 }}>
                {label}
              </span>
              {active && <CheckCircle2 size={16} color="#C9A84C" style={{ flexShrink:0 }}/>}
            </button>
          );
        })}
      </div>

      {/* CARD FORM */}
      {method === "card" && (
        <div style={{ marginBottom:24, animation:"fadeUp 0.25s ease both" }}>
          <div style={{ marginBottom:16 }}>
            <label style={labelStyle}>Card Number <span style={{ color:"#ef4444" }}>*</span></label>
            <FocusInput
              value={card.number}
              onChange={e => setC("number")({ target:{ value: e.target.value.replace(/\D/g,"").slice(0,16) } })}
              placeholder="1234  5678  9012  3456"
              style={{ letterSpacing:"0.14em" }}
            />
          </div>
          <div style={{ marginBottom:16 }}>
            <label style={labelStyle}>Cardholder Name <span style={{ color:"#ef4444" }}>*</span></label>
            <FocusInput value={card.name} onChange={setC("name")} placeholder="Name as on card"/>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
            <div>
              <label style={labelStyle}>Expiry <span style={{ color:"#ef4444" }}>*</span></label>
              <FocusInput value={card.expiry} onChange={setC("expiry")} placeholder="MM / YY" style={{ letterSpacing:"0.1em" }}/>
            </div>
            <div>
              <label style={labelStyle}>CVV <span style={{ color:"#ef4444" }}>*</span></label>
              <FocusInput
                value={card.cvv} type="password"
                onChange={e => setC("cvv")({ target:{ value: e.target.value.replace(/\D/g,"").slice(0,3) } })}
                placeholder="• • •" style={{ letterSpacing:"0.2em" }}
              />
            </div>
          </div>
          <p style={{ fontSize:11,color:"#A89880",marginTop:10,fontFamily:"'Jost',sans-serif" }}>
            Your card details are never stored on our servers.
          </p>
        </div>
      )}

      {/* UPI FORM */}
      {method === "upi" && (
        <div style={{ marginBottom:24, animation:"fadeUp 0.25s ease both" }}>
          <label style={labelStyle}>UPI ID <span style={{ color:"#ef4444" }}>*</span></label>
          <FocusInput value={upiId} onChange={e => setUpiId(e.target.value)} placeholder="yourname@okicici"/>
          <p style={{ fontSize:12,color:"#A89880",marginTop:8,fontFamily:"'Jost',sans-serif" }}>
            Enter your registered UPI ID to pay instantly.
          </p>
          <div style={{ display:"flex",gap:8,marginTop:14,flexWrap:"wrap" }}>
            {["GPay","PhonePe","Paytm","BHIM"].map(app => (
              <div key={app} style={{ padding:"6px 14px",borderRadius:20,
                border:"1.5px solid #DDD0BE",background:"#fdfaf6",
                fontSize:12,fontWeight:600,color:"#7a6030",
                fontFamily:"'Jost',sans-serif",cursor:"pointer" }}>
                {app}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* NET BANKING */}
      {method === "nb" && (
        <div style={{ marginBottom:24, animation:"fadeUp 0.25s ease both" }}>
          <label style={labelStyle}>Select Your Bank <span style={{ color:"#ef4444" }}>*</span></label>
          <FocusSelect value={bank} onChange={e => setBank(e.target.value)}>
            <option value="">-- Choose your bank --</option>
            {BANKS.map(b => <option key={b} value={b}>{b}</option>)}
          </FocusSelect>
          <p style={{ fontSize:11,color:"#A89880",marginTop:12,marginBottom:8,
            fontFamily:"'Jost',sans-serif",letterSpacing:"0.08em" }}>
            POPULAR BANKS
          </p>
          <div style={{ display:"flex",gap:8,flexWrap:"wrap" }}>
            {["SBI","HDFC Bank","ICICI Bank","Axis Bank"].map(b => (
              <button key={b} onClick={() => setBank(b)}
                style={{ padding:"6px 14px",borderRadius:20,cursor:"pointer",
                  border:`1.5px solid ${bank===b?"#C9A84C":"#DDD0BE"}`,
                  background: bank===b?"#fdf9f0":"#fdfaf6",
                  fontSize:12,fontWeight:600,
                  color: bank===b?"#7a6030":"#888",
                  fontFamily:"'Jost',sans-serif",transition:"all 0.15s" }}>
                {b}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* COD INFO */}
      {method === "cod" && (
        <div style={{ marginBottom:24,padding:"18px 20px",
          background:"#fdfaf6",borderRadius:14,border:"1.5px solid #EDE5D8",
          animation:"fadeUp 0.25s ease both" }}>
          <p style={{ fontSize:14,fontWeight:600,color:"#3d2a0a",
            margin:"0 0 6px",fontFamily:"'Jost',sans-serif" }}>
            Pay when your order arrives 📦
          </p>
          <p style={{ fontSize:12.5,color:"#A89880",margin:0,lineHeight:1.6,
            fontFamily:"'Jost',sans-serif" }}>
            A nominal <strong style={{ color:"#5c4220" }}>₹49 handling fee</strong> applies.
            Total payable at door:{" "}
            <strong style={{ color:"#1a1205" }}>
              ₹{amountToPay.toLocaleString("en-IN")}
            </strong>
          </p>
        </div>
      )}

      {/* ════════════ PAY BUTTON ZONE ════════════ */}
      <div style={{ marginBottom:16 }}>
        {isOnline ? (
          /* ONLINE: open Razorpay modal */
          <RazorpayCheckout
            amount={amountToPay}
            customerName={user?.name  ?? addressData?.fullName ?? ""}
            customerEmail={user?.email ?? ""}
            customerPhone={addressData?.phone ?? ""}
            description="Banishq — Order Payment"
            onSuccess={handlePaymentSuccess}
            onFailure={handlePaymentFailure}
            buttonLabel={`Pay ₹${amountToPay.toLocaleString("en-IN")} Securely`}
          />
        ) : (
          /* COD: skip payment gateway */
          <button onClick={handleCOD}
            style={{ position:"relative",overflow:"hidden",
              width:"100%",padding:"15px 0",borderRadius:14,
              border:"none",cursor:"pointer",
              background:"linear-gradient(120deg,#140e04 0%,#3a2408 45%,#5a3a0c 65%,#140e04 100%)",
              color:"#fff",fontFamily:"'Jost',sans-serif",fontSize:13,fontWeight:700,
              letterSpacing:".16em",textTransform:"uppercase",
              display:"flex",alignItems:"center",justifyContent:"center",gap:10,
              transition:"transform .25s" }}
            onMouseEnter={e => e.currentTarget.style.transform="translateY(-2px)"}
            onMouseLeave={e => e.currentTarget.style.transform="translateY(0)"}
          >
            <span style={{ position:"absolute",top:0,left:"12%",right:"12%",height:1,
              background:"linear-gradient(90deg,transparent,rgba(201,168,76,.65),transparent)" }}/>
            Confirm Order (Cash on Delivery)
          </button>
        )}
      </div>

      {/* BACK */}
      <button onClick={onBack}
        style={{ width:"100%",padding:"14px 0",borderRadius:14,
          border:"2px solid #DDD0BE",background:"transparent",
          color:"#7a6030",fontSize:13,fontWeight:700,cursor:"pointer",
          letterSpacing:"0.08em",fontFamily:"'Jost',sans-serif",
          transition:"border-color 0.2s" }}
        onMouseEnter={e => e.currentTarget.style.borderColor="#C9A84C"}
        onMouseLeave={e => e.currentTarget.style.borderColor="#DDD0BE"}
      >
        ← Back to Address
      </button>
    </div>
  );
}