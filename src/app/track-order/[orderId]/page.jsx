// app/track-order/[orderId]/page.jsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { getOrderById } from "../../data/orders/order";
import {
  Phone, Mail, ArrowRight, CheckCircle2,
  Circle, ChevronLeft, User,
} from "lucide-react";

/* ─── Step Progress Bar ─────────────────────── */
function ProgressBar({ steps, currentStep }) {
  return (
    <div className="relative flex items-start justify-between mt-6 mb-2 px-2">
      {/* base line */}
      <div className="absolute top-[18px] left-6 right-6 h-px bg-gray-200 z-0" />
      {/* filled progress */}
      <div
        className="absolute top-[18px] left-6 h-px bg-[#1a1a1a] z-0 transition-all duration-700"
        style={{ width: `calc(${(currentStep / (steps.length - 1)) * 100}% - 24px)` }}
      />

      {steps.map((step, i) => {
        const isDone    = step.done;
        const isCurrent = i === currentStep;
        return (
          <div key={i} className="flex flex-col items-center z-10 flex-1">
            <div className={`w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all duration-300
              ${isDone    ? "border-[#1a1a1a] bg-[#1a1a1a]"
               : isCurrent ? "border-[#1a1a1a] bg-white ring-4 ring-[#1a1a1a]/10"
               : "border-gray-300 bg-white"}`}
            >
              {isDone
                ? <CheckCircle2 size={16} className="text-white" strokeWidth={2.5} />
                : <Circle size={10} className={isCurrent ? "text-[#1a1a1a]" : "text-gray-300"} fill="currentColor" />
              }
            </div>
            <p className={`mt-2 text-[12px] font-semibold text-center leading-snug
              ${isDone || isCurrent ? "text-gray-900" : "text-gray-400"}`}>
              {step.label}
            </p>
            {step.date && (
              <p className="text-[10.5px] text-[#b8964e] mt-0.5 text-center">{step.date}</p>
            )}
            {step.location && (
              <p className="text-[10.5px] text-gray-400 text-center leading-tight">{step.location}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─── Info row ──────────────────────────────── */
function InfoRow({ label, value, bold = false }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5 border-b border-gray-100 last:border-b-0">
      <span className="text-[12.5px] text-gray-500 shrink-0 font-medium">{label}</span>
      <span className={`text-[12.5px] text-right ${bold ? "font-bold text-gray-800" : "text-gray-700 font-medium"}`}>
        {value}
      </span>
    </div>
  );
}

/* ─── Page ──────────────────────────────────── */
export default function TrackOrderPage() {
  const { orderId } = useParams();
  const router      = useRouter();
  const order       = getOrderById(orderId);

  if (!order) {
    return (
      <div className="min-h-screen bg-[#f5f0e8] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-sm mb-4">Order not found.</p>
          <button onClick={() => router.push("/orders")}
                  className="text-[#b8964e] text-sm hover:underline">
            ← Back to Orders
          </button>
        </div>
      </div>
    );
  }

  const { tracking, customerName } = order;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500;700&display=swap');
        * { font-family: 'DM Sans', sans-serif; }
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          from { transform: translateX(-100%); }
          to   { transform: translateX(100%); }
        }
      `}</style>

      <div className="min-h-screen bg-[#f5f0e8]">

        {/* ── Page Header ── */}
        <div className="bg-[#f0ebe0] border-b border-[#e0d8cc] py-8 px-6 text-center
                        animate-[fadeSlide_0.4s_ease_both]">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}>
            Track Your Order
          </h1>
          <p className="text-[12.5px] text-gray-400 mt-1 tracking-wide">
            <span className="hover:text-gray-600 cursor-pointer transition-colors"
                  onClick={() => router.push("/")}>Home</span>
            {" / "}
            <span className="hover:text-gray-600 cursor-pointer transition-colors"
                  onClick={() => router.push("/orders")}>Orders</span>
            {" / "}
            <span className="text-gray-600 font-semibold">Track Your Order</span>
          </p>
        </div>

        {/* ── Body ── */}
        <div className="w-full px-6 lg:px-12 xl:px-20 py-10 animate-[fadeSlide_0.5s_ease_both]">

          {/* Back */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-[13px] text-gray-400 hover:text-gray-700
                       transition-colors mb-6 group font-medium"
          >
            <ChevronLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
            Back to Orders
          </button>

          {/* ══════════════════════════════════════
              CUSTOMER NAME BANNER
          ══════════════════════════════════════ */}
          <div className="flex items-center gap-4 bg-white border border-[#e8ddd0] rounded-2xl
                          px-6 py-4 mb-5 shadow-[0_2px_16px_rgba(0,0,0,0.05)]
                          animate-[fadeSlide_0.42s_ease_both]">
            {/* Avatar */}
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#d4a373] to-[#7a6030]
                            flex items-center justify-center shrink-0 shadow-md">
              <span className="text-white font-bold text-[15px] tracking-wide">
                {customerName
                  .split(" ")
                  .map((w) => w[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase()}
              </span>
            </div>
            {/* Text */}
            <div>
              <p className="text-[11px] uppercase tracking-widest text-gray-400 font-semibold mb-0.5">
                Order placed by
              </p>
              <p className="text-[17px] font-bold text-gray-900"
                 style={{ fontFamily: "'Playfair Display', serif" }}>
                {customerName}
              </p>
            </div>
            {/* Order ID pill */}
            <div className="ml-auto hidden sm:flex flex-col items-end">
              <p className="text-[11px] uppercase tracking-widest text-gray-400 font-semibold mb-0.5">
                Order ID
              </p>
              <span className="text-[14px] font-bold text-[#b8964e]">#{order.id}</span>
            </div>
          </div>

          {/* ── Tracking Header Card ── */}
          <div className="bg-white rounded-2xl shadow-[0_2px_20px_rgba(0,0,0,0.06)] px-7 py-6 mb-5
                          animate-[fadeSlide_0.48s_ease_both]">

            {/* Tracking no + ETA */}
            <div className="flex flex-wrap items-start justify-between gap-4 mb-1">
              <div>
                <p className="text-[11px] uppercase tracking-widest text-gray-400 font-semibold mb-1">
                  Tracking Number
                </p>
                <p className="text-[22px] font-bold text-gray-900 tracking-tight"
                   style={{ fontFamily: "'Playfair Display', serif" }}>
                  {tracking.trackingNumber}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[11px] uppercase tracking-widest text-gray-400 font-semibold mb-1">
                  Estimated Time of Delivery
                </p>
                <p className="text-[20px] font-bold text-gray-900 leading-tight"
                   style={{ fontFamily: "'Playfair Display', serif" }}>
                  {tracking.estimatedDelivery}
                </p>
              </div>
            </div>

            {/* Track another shipment */}
            <div className="flex justify-end mt-1 mb-3">
              <button
                onClick={() => router.push("/orders")}
                className="flex items-center gap-1 text-[12px] text-[#b8964e] hover:text-[#7a6030]
                           font-semibold transition-colors"
              >
                TRACK ANOTHER SHIPMENT
                <ArrowRight size={12} />
              </button>
            </div>

            {/* Progress bar */}
            <ProgressBar steps={tracking.steps} currentStep={tracking.currentStep} />
          </div>

          {/* ── Two column cards ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">

            {/* Delivery Details */}
            <div className="bg-white rounded-2xl shadow-[0_2px_20px_rgba(0,0,0,0.06)] overflow-hidden
                            animate-[fadeSlide_0.52s_ease_both]">
              <div className="bg-gray-900 px-5 py-4">
                <h3 className="text-[13.5px] font-bold text-white tracking-widest text-center uppercase">
                  Delivery Details
                </h3>
              </div>
              <div className="px-5 py-2">
                {/* Customer name row inside delivery details */}
                <div className="flex items-center justify-between gap-4 py-2.5 border-b border-gray-100">
                  <span className="text-[12.5px] text-gray-500 shrink-0 font-medium flex items-center gap-1.5">
                    <User size={12} className="text-[#b8964e]" /> Recipient Name:
                  </span>
                  <span className="text-[12.5px] font-bold text-[#7a6030] text-right">{customerName}</span>
                </div>
                <InfoRow label="Estimated Delivery Date:" value={tracking.shipmentId} />
                <InfoRow label="Delivery Address:"        value={tracking.deliveryAddress} />
                <InfoRow label="Courier Partner:"         value={tracking.courierPartner} />
                <InfoRow label="Tracking Number:"         value={tracking.trackingNumber} bold />
              </div>
            </div>

            {/* Shipment Information */}
            <div className="bg-white rounded-2xl shadow-[0_2px_20px_rgba(0,0,0,0.06)] overflow-hidden
                            animate-[fadeSlide_0.56s_ease_both]">
              <div className="bg-gray-900 px-5 py-4">
                <h3 className="text-[13.5px] font-bold text-white tracking-widest text-center uppercase">
                  Shipment Information
                </h3>
              </div>
              <div className="px-5 py-2">
                <InfoRow label="Shipment ID:"       value={tracking.shipmentId} />
                <InfoRow label="Courier Service:"   value={tracking.courierService} />
                <InfoRow label="Tracking Number:"   value={tracking.courierPartner} />
                <div className="py-2.5 border-b border-gray-100">
                  <p className="text-[12.5px] text-gray-500 font-medium mb-0.5">Shipping Method:</p>
                  <p className="text-[12.5px] text-gray-800 font-bold">{tracking.shippingMethod}</p>
                  <p className="text-[11.5px] text-gray-400 font-medium">{tracking.shippingMethodNote}</p>
                </div>
                <InfoRow label="Shipment Date:"      value={tracking.shipmentDate} />
                <InfoRow label="Estimated Arrival:"  value={tracking.estimatedArrival} bold />
              </div>
            </div>
          </div>

          {/* ── Need Help ── */}
          <div className="bg-white rounded-2xl shadow-[0_2px_20px_rgba(0,0,0,0.06)] px-7 py-6
                          animate-[fadeSlide_0.6s_ease_both]">
            <h3 className="text-[20px] font-bold text-[#b8964e] mb-1.5"
                style={{ fontFamily: "'Playfair Display', serif" }}>
              Need Help?
            </h3>
            <p className="text-[13px] text-gray-500 font-medium mb-5 leading-relaxed">
              If you're facing any issues with tracking your order, our support team is here to help.
            </p>

            <div className="flex flex-wrap items-center justify-between gap-5">
              <div className="space-y-3">
                <a href="tel:+910000000000"
                   className="flex items-center gap-3 text-[13.5px] font-semibold text-gray-700
                              hover:text-gray-900 transition-colors group">
                  <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center
                                  group-hover:border-[#b8964e] group-hover:bg-[#fdf8f2] transition-all duration-200">
                    <Phone size={14} className="text-gray-500 group-hover:text-[#b8964e] transition-colors" />
                  </div>
                  Call Us: +91 0000 000 000
                </a>
                <a href="mailto:support@yourstore.com"
                   className="flex items-center gap-3 text-[13.5px] font-semibold text-gray-700
                              hover:text-gray-900 transition-colors group">
                  <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center
                                  group-hover:border-[#b8964e] group-hover:bg-[#fdf8f2] transition-all duration-200">
                    <Mail size={14} className="text-gray-500 group-hover:text-[#b8964e] transition-colors" />
                  </div>
                  Email: support@yourstore.com
                </a>
              </div>

              {/* Contact Support button with shimmer */}
              <button
                onClick={() => alert("Opening support chat…")}
                className="relative overflow-hidden flex items-center gap-2
                           bg-[#7a6030] hover:bg-[#5e4a25] text-white
                           text-[13px] font-bold tracking-widest uppercase
                           px-7 py-3 rounded-xl
                           shadow-[0_2px_12px_rgba(122,96,48,0.25)]
                           hover:-translate-y-0.5 hover:shadow-[0_6px_22px_rgba(122,96,48,0.38)]
                           active:translate-y-0 transition-all duration-200 group/cs"
              >
                <span className="absolute inset-0 -translate-x-full group-hover/cs:translate-x-full
                                 transition-transform duration-700
                                 bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />
                Contact Support
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}