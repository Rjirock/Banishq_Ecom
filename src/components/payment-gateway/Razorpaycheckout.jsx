// components/checkout/RazorpayCheckout.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ShieldCheck } from "lucide-react";

/* ═══════════════════════════════════════════════════════════════
   ⚙️  DEVELOPER CONFIG — change only these two values
   ─────────────────────────────────────────────────────────────
   RAZORPAY_KEY_ID  : your Razorpay Test/Live Key ID
                      Dashboard → Settings → API Keys
   ORDER_API_URL    : your backend endpoint that creates a
                      Razorpay order and returns { orderId, amount, currency }
                      POST body it receives: { amount, currency, receipt }
═══════════════════════════════════════════════════════════════ */
const RAZORPAY_KEY_ID = "rzp_test_XXXXXXXXXXXXXXXXXX"; // ← replace with your key
const ORDER_API_URL   = "/api/create-razorpay-order";  // ← replace with your endpoint

/* ── Load Razorpay script once ──────────────────────────────── */
function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) { resolve(true); return; }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload  = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

/* ── Main component ─────────────────────────────────────────── */
export default function RazorpayCheckout({
  amount,          // number — order total in ₹ (e.g. 1598)
  customerName,    // string — from user profile / address form
  customerEmail,   // string — from user profile
  customerPhone,   // string — from address form
  description,     // string — shown in Razorpay modal (e.g. "Banishq Order")
  onSuccess,       // (paymentData) => void  — called after verified payment
  onFailure,       // (error)       => void  — called if payment fails/dismissed
  buttonLabel = "Pay Now",
  buttonStyle = {},
}) {
  const router    = useRouter();
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  const handlePay = async () => {
    setError("");
    setLoading(true);

    /* 1 ── Load Razorpay SDK */
    const loaded = await loadRazorpayScript();
    if (!loaded) {
      setError("Failed to load payment gateway. Check your internet connection.");
      setLoading(false);
      return;
    }

    /* 2 ── Create order on your backend
            Your API should call Razorpay Orders API and return:
            { orderId: "order_xxxxx", amount: <paise>, currency: "INR" }       */
    let razorpayOrderId, orderAmount, orderCurrency;
    try {
      const res = await fetch(ORDER_API_URL, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          amount:   amount * 100,   // Razorpay expects paise
          currency: "INR",
          receipt:  `receipt_${Date.now()}`,
        }),
      });
      if (!res.ok) throw new Error(`Order API returned ${res.status}`);
      const data = await res.json();
      razorpayOrderId = data.orderId;
      orderAmount     = data.amount;     // in paise
      orderCurrency   = data.currency ?? "INR";
    } catch (err) {
      setError("Could not create payment order. Please try again.");
      setLoading(false);
      return;
    }

    /* 3 ── Open Razorpay checkout modal */
    const options = {
      key:          RAZORPAY_KEY_ID,
      amount:       orderAmount,
      currency:     orderCurrency,
      order_id:     razorpayOrderId,
      name:         "Banishq",
      description:  description ?? "Order Payment",
      image:        "/logo.png",           // your store logo

      prefill: {
        name:    customerName  ?? "",
        email:   customerEmail ?? "",
        contact: customerPhone ?? "",
      },

      theme: {
        color: "#C9A84C",                  // gold — matches your brand
        backdrop_color: "rgba(10,8,4,0.7)",
      },

      modal: {
        confirm_close: true,               // ask before closing
        ondismiss: () => {
          setLoading(false);
          onFailure?.({ message: "Payment cancelled by user." });
        },
      },

      /* 4a ── Payment SUCCESS handler */
      handler: async (response) => {
        /*
          response contains:
            razorpay_payment_id — verify this on your server
            razorpay_order_id
            razorpay_signature  — HMAC signature to verify
          
          ⚠️  IMPORTANT: always verify the signature on your backend
              before marking an order as paid.
              POST to your verification endpoint, then redirect.
        */
        const paymentData = {
          paymentId:  response.razorpay_payment_id,
          orderId:    response.razorpay_order_id,
          signature:  response.razorpay_signature,
        };

        if (onSuccess) {
          onSuccess(paymentData);
        } else {
          /* default: go straight to order confirmed page */
          router.push("/order-confirmed");
        }
        setLoading(false);
      },
    };

    const rzp = new window.Razorpay(options);

    /* 4b ── Payment FAILURE handler */
    rzp.on("payment.failed", (response) => {
      const msg = response.error?.description ?? "Payment failed. Please try again.";
      setError(msg);
      setLoading(false);
      onFailure?.(response.error);
    });

    rzp.open();
  };

  return (
    <div>
      {/* ── Error message ── */}
      {error && (
        <div style={{
          padding: "12px 16px", borderRadius: 12, marginBottom: 14,
          background: "#fff5f5", border: "1.5px solid #fca5a5",
          fontSize: 13, color: "#ef4444", fontFamily: "'Jost',sans-serif",
          lineHeight: 1.5,
        }}>
          ⚠️ {error}
        </div>
      )}

      {/* ── Pay button ── */}
      <button
        onClick={handlePay}
        disabled={loading}
        style={{
          position: "relative", overflow: "hidden",
          width: "100%", padding: "15px 0", borderRadius: 14,
          border: "none", cursor: loading ? "not-allowed" : "pointer",
          background: loading
            ? "linear-gradient(120deg,#5a5a5a,#3a3a3a)"
            : "linear-gradient(120deg,#140e04 0%,#3a2408 45%,#5a3a0c 65%,#140e04 100%)",
          color: "#fff",
          fontFamily: "'Jost',sans-serif", fontSize: 13, fontWeight: 700,
          letterSpacing: ".16em", textTransform: "uppercase",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
          transition: "transform .25s, box-shadow .25s",
          opacity: loading ? 0.75 : 1,
          ...buttonStyle,
        }}
        onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = "translateY(-2px)"; }}
        onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; }}
      >
        {/* gold top accent */}
        <span style={{
          position: "absolute", top: 0, left: "12%", right: "12%", height: 1,
          background: "linear-gradient(90deg,transparent,rgba(201,168,76,.65),transparent)",
        }}/>

        {loading ? (
          <><Loader2 size={15} style={{ animation: "spin .8s linear infinite" }}/> Processing…</>
        ) : (
          <>{buttonLabel}</>
        )}
      </button>

      {/* ── Security badge ── */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
        marginTop: 12,
        fontSize: 11, color: "#A89880", fontFamily: "'Jost',sans-serif",
      }}>
        <ShieldCheck size={13} color="#C9A84C"/>
        Secured by Razorpay &nbsp;·&nbsp; 256-bit SSL encrypted
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}