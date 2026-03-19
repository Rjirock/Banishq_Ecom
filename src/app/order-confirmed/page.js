// app/order-confirmed/page.jsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Download, ShoppingBag, Share2, Check } from "lucide-react";

/* ─── Confetti particle ─────────────────────── */
function Confetti() {
  const pieces = Array.from({ length: 28 }, (_, i) => ({
    id: i,
    color: ["#d4a373","#e9c46a","#2a9d8f","#e76f51","#264653","#f4a261"][i % 6],
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 1.2}s`,
    duration: `${1.2 + Math.random() * 1}s`,
    size: `${6 + Math.random() * 8}px`,
    rotate: `${Math.random() * 360}deg`,
    shape: i % 3 === 0 ? "rounded-full" : i % 3 === 1 ? "rounded-sm rotate-45" : "",
  }));

  return (
    <div className="absolute inset-x-0 top-0 h-40 overflow-hidden pointer-events-none">
      {pieces.map((p) => (
        <div
          key={p.id}
          className={`absolute ${p.shape} animate-[confettiFall_var(--dur)_var(--del)_ease-in_both]`}
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            background: p.color,
            "--dur": p.duration,
            "--del": p.delay,
            top: "-10px",
            transform: `rotate(${p.rotate})`,
          }}
        />
      ))}
    </div>
  );
}

/* ─── Order data ────────────────────────────── */
const ORDER = {
  id: "#SDGT1254FD",
  paymentMethod: "Paypal",
  transactionId: "TR642S8FE",
  estimatedDelivery: "25 March 2026",
  products: [
    { id: 1, name: "Trendy Brown Coat", color: "Brown", size: "XXL", price: 10000, image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=160&q=80" },
    { id: 2, name: "Trendy Brown Coat", color: "Brown", size: "XXL", price: 10000, image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=160&q=80" },
    { id: 3, name: "Trendy Brown Coat", color: "Brown", size: "XXL", price: 10000, image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=160&q=80" },
  ],
  shipping: 0,
  taxes: 0,
  couponDiscount: 30000,
  total: 30000,
};

/* ─── Summary row ───────────────────────────── */
function SummaryRow({ label, value, isTotal = false, isDiscount = false }) {
  return (
    <div className={`flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0
      ${isTotal ? "pt-4 border-t-2 border-gray-200 border-b-0 mt-1" : ""}`}>
      <span className={`${isTotal ? "text-[15px] font-bold text-gray-900" : "text-[14px] font-semibold text-gray-500"}`}>
        {label}
      </span>
      <span className={`font-bold
        ${isTotal     ? "text-[18px] text-gray-900" : ""}
        ${isDiscount  ? "text-[15px] text-green-600" : ""}
        ${!isTotal && !isDiscount ? "text-[15px] text-gray-700" : ""}`}>
        {isDiscount ? "−" : ""}₹{value.toLocaleString()}
      </span>
    </div>
  );
}

/* ─── Page ──────────────────────────────────── */
export default function OrderConfirmedPage() {
  const router = useRouter();
  const [checkVisible, setCheckVisible] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);
  const [shareToast, setShareToast] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setCheckVisible(true),  300);
    const t2 = setTimeout(() => setContentVisible(true), 700);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const handleShare = async () => {
    try { await navigator.clipboard.writeText(window.location.href); } catch (_) {}
    setShareToast(true);
    setTimeout(() => setShareToast(false), 2500);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@400;600;700&display=swap');
        body { font-family: 'DM Sans', sans-serif; }

        @keyframes fadeSlide  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes popIn      { 0%{opacity:0;transform:scale(0.5)} 70%{transform:scale(1.12)} 100%{opacity:1;transform:scale(1)} }
        @keyframes ringPulse  { 0%,100%{box-shadow:0 0 0 0 rgba(212,163,115,0.5)} 50%{box-shadow:0 0 0 16px rgba(212,163,115,0)} }
        @keyframes confettiFall {
          0%   { opacity:1; transform:translateY(0) rotate(0deg) scale(1); }
          100% { opacity:0; transform:translateY(160px) rotate(540deg) scale(0.4); }
        }
        @keyframes shimmer {
          from { transform:translateX(-100%); }
          to   { transform:translateX(100%); }
        }
        @keyframes toastIn { from{opacity:0;transform:translate(-50%,10px)} to{opacity:1;transform:translate(-50%,0)} }
        @keyframes checkDraw {
          from { stroke-dashoffset: 40; }
          to   { stroke-dashoffset: 0; }
        }
      `}</style>

      {/* Share toast */}
      {shareToast && (
        <div className="fixed bottom-6 left-1/2 z-50 flex items-center gap-2 bg-gray-900 text-white
                        text-[13px] font-semibold px-5 py-3 rounded-full shadow-xl
                        animate-[toastIn_0.25s_ease_both]"
             style={{ transform: "translateX(-50%)" }}>
          <Check size={14} /> Link copied!
        </div>
      )}

      <div className="min-h-screen bg-[#f5f0e8]">

        {/* ── Page Header ── */}
        <div className="bg-[#f0ebe0] border-b border-[#e0d8cc] py-10 text-center
                        animate-[fadeSlide_0.4s_ease_both]">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}>
            Order Completed
          </h1>
          <p className="text-[13px] text-gray-400 mt-1.5 tracking-wide">
            <span className="hover:text-gray-700 cursor-pointer transition-colors"
                  onClick={() => router.push("/")}>Home</span>
            {" / "}
            <span className="text-gray-600 font-semibold">Order Completed</span>
          </p>
        </div>

        {/* ── Body ── */}
        <div className="w-full px-6 lg:px-12 xl:px-20 py-10">

          {/* ── Success hero ── */}
          <div className="relative bg-white rounded-2xl shadow-[0_2px_24px_rgba(0,0,0,0.07)]
                          px-8 py-12 mb-6 text-center overflow-hidden">
            <Confetti />

            {/* Animated checkmark */}
            <div
              className="mx-auto mb-5 w-20 h-20 rounded-full bg-[#f5f0e8] flex items-center justify-center
                         transition-all duration-500"
              style={{
                animation: checkVisible ? "popIn 0.55s cubic-bezier(0.22,1,0.36,1) both, ringPulse 2s 0.8s ease infinite" : "none",
                opacity: checkVisible ? 1 : 0,
              }}
            >
              <div className="w-12 h-12 rounded-full bg-[#c9a84c] flex items-center justify-center
                              shadow-[0_4px_16px_rgba(201,168,76,0.45)]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"
                    style={{
                      strokeDasharray: 40,
                      strokeDashoffset: checkVisible ? 0 : 40,
                      transition: "stroke-dashoffset 0.5s 0.4s ease",
                    }}
                  />
                </svg>
              </div>
            </div>

            <div style={{ opacity: contentVisible ? 1 : 0, transform: contentVisible ? "none" : "translateY(10px)", transition: "all 0.45s ease" }}>
              <h2 className="text-[26px] font-bold text-gray-900 mb-2"
                  style={{ fontFamily: "'Playfair Display', serif" }}>
                Your order is completed!
              </h2>
              <p className="text-[14px] text-gray-400 font-semibold">
                Thank you. Your Order has been received.
              </p>
            </div>
          </div>

          {/* ── Order Meta banner ── */}
          <div
            className="bg-[#c9a84c] rounded-2xl px-6 py-5 mb-6 grid grid-cols-2 md:grid-cols-4 gap-5
                       shadow-[0_4px_20px_rgba(201,168,76,0.30)]"
            style={{ opacity: contentVisible ? 1 : 0, transform: contentVisible ? "none" : "translateY(12px)", transition: "all 0.5s 0.1s ease" }}
          >
            {[
              { label: "Order ID",               value: ORDER.id },
              { label: "Payment Method",          value: ORDER.paymentMethod },
              { label: "Transaction ID",          value: ORDER.transactionId },
              { label: "Estimated Delivery Date", value: ORDER.estimatedDelivery },
            ].map((m) => (
              <div key={m.label}>
                <p className="text-[11px] text-yellow-100 font-semibold uppercase tracking-widest mb-1">{m.label}</p>
                <p className="text-[15px] font-bold text-white">{m.value}</p>
              </div>
            ))}
          </div>

          {/* ── Order Details card ── */}
          <div
            className="bg-white rounded-2xl shadow-[0_2px_24px_rgba(0,0,0,0.07)] overflow-hidden mb-8"
            style={{ opacity: contentVisible ? 1 : 0, transform: contentVisible ? "none" : "translateY(12px)", transition: "all 0.55s 0.18s ease" }}
          >
            {/* Section header */}
            <div className="px-7 py-4 border-b border-gray-100">
              <h3 className="text-[17px] font-bold text-gray-900"
                  style={{ fontFamily: "'Playfair Display', serif" }}>
                Order Details
              </h3>
            </div>

            {/* Products header */}
            <div className="grid grid-cols-[1fr_120px] px-7 py-3 bg-gray-50/70 border-b border-gray-100">
              <span className="text-[12.5px] font-bold text-gray-500 uppercase tracking-widest">Products</span>
              <span className="text-[12.5px] font-bold text-gray-500 uppercase tracking-widest text-right">Sub Total</span>
            </div>

            {/* Product rows */}
            {ORDER.products.map((p, i) => (
              <div
                key={p.id}
                className="grid grid-cols-[1fr_120px] items-center px-7 py-5
                           border-b border-gray-100 last:border-b-0
                           hover:bg-[#fdf9f4] transition-colors duration-200
                           animate-[fadeSlide_0.35s_ease_both]"
                style={{ animationDelay: `${0.25 + i * 0.08}s` }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-[60px] h-[70px] rounded-xl overflow-hidden bg-gray-100 shrink-0 ring-1 ring-gray-200">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div>
                    <p className="text-[14.5px] font-bold text-gray-900 leading-snug">{p.name}</p>
                    <p className="text-[12px] font-semibold text-gray-400 mt-0.5">
                      Color: {p.color}&nbsp;|&nbsp;Size: {p.size}
                    </p>
                  </div>
                </div>
                <p className="text-[15px] font-bold text-gray-900 text-right">₹{p.price.toLocaleString()}</p>
              </div>
            ))}

            {/* Totals */}
            <div className="px-7 py-4 bg-gray-50/50">
              <SummaryRow label="Shipping"        value={ORDER.shipping} />
              <SummaryRow label="Taxes"           value={ORDER.taxes} />
              <SummaryRow label="Coupon Discount" value={ORDER.couponDiscount} isDiscount />
              <SummaryRow label="Total"           value={ORDER.total} isTotal />
            </div>
          </div>

          {/* ── Action buttons ── */}
          <div
            className="flex flex-wrap items-center justify-between gap-4 pb-4"
            style={{ opacity: contentVisible ? 1 : 0, transform: contentVisible ? "none" : "translateY(10px)", transition: "all 0.55s 0.28s ease" }}
          >
            {/* Share */}
            <button
              onClick={handleShare}
              className="flex items-center gap-2.5 text-[13.5px] font-bold text-gray-600
                         hover:text-[#7a6030] transition-colors duration-200 group"
            >
              <div className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center
                              group-hover:border-[#b8964e] group-hover:bg-[#fdf8f2] transition-all duration-200">
                <Share2 size={15} className="text-gray-500 group-hover:text-[#b8964e] transition-colors" />
              </div>
              Share Order
            </button>

            <div className="flex items-center gap-3">
              {/* Continue Shopping */}
              <button
                onClick={() => router.push("/")}
                className="relative overflow-hidden flex items-center gap-2 px-7 py-3.5 rounded-xl
                           border-2 border-[#b8964e] text-[#7a6030] text-[13px] font-bold
                           tracking-[0.08em] uppercase
                           hover:bg-[#7a6030] hover:text-white hover:border-[#7a6030]
                           hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(122,96,48,0.25)]
                           active:translate-y-0 transition-all duration-250 group/cs"
              >
                <span className="absolute inset-0 -translate-x-full group-hover/cs:translate-x-full
                                 transition-transform duration-700
                                 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
                <ShoppingBag size={15} />
                Continue Shopping
              </button>

              {/* Download Invoice */}
              <button
                onClick={() => alert("Downloading invoice…")}
                className="relative overflow-hidden flex items-center gap-2 px-7 py-3.5 rounded-xl
                           bg-[#7a6030] text-white text-[13px] font-bold
                           tracking-[0.08em] uppercase
                           hover:bg-[#5e4a25] hover:-translate-y-0.5
                           hover:shadow-[0_6px_24px_rgba(122,96,48,0.40)]
                           active:translate-y-0 transition-all duration-250 group/dl"
              >
                <span className="absolute inset-0 -translate-x-full group-hover/dl:translate-x-full
                                 transition-transform duration-700
                                 bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />
                <Download size={15} />
                Download Invoice
              </button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}