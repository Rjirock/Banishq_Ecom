// app/my-order/[trackingId]/page.jsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { ORDERS } from "../../data/orders/order";
import {
  ChevronLeft, MapPin, Truck, Phone, Mail,
  X, AlertCircle, ArrowRight, CheckCircle2,
  Clock, Package, ShoppingBag, CreditCard,
  Calendar, Hash, Clock3, Home, Briefcase, MapPinOff,
} from "lucide-react";

/* ── Find order by tracking number or order ID ── */
function getOrder(id) {
  return ORDERS.find(o => o.shipment?.trackingNumber === id)
      ?? ORDERS.find(o => o.id === id)
      ?? null;
}

/* ── Status config ── */
const STATUS = {
  "In-Transit": { color: "text-teal-600",  bg: "bg-teal-50",  icon: Truck        },
  "Delivered":  { color: "text-green-600", bg: "bg-green-50", icon: CheckCircle2 },
  "Processing": { color: "text-blue-600",  bg: "bg-blue-50",  icon: Clock        },
  "Cancelled":  { color: "text-red-500",   bg: "bg-red-50",   icon: X            },
};

function Chip({ status }) {
  const s = STATUS[status] || STATUS["Processing"];
  const Icon = s.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full ${s.color} ${s.bg}`}>
      <Icon size={11} strokeWidth={2.5} />{status}
    </span>
  );
}

function AddrTypeIcon({ type }) {
  if (type === "Work")  return <Briefcase size={13} className="text-[#C9A84C]" />;
  if (type === "Other") return <MapPinOff  size={13} className="text-[#C9A84C]" />;
  return <Home size={13} className="text-[#C9A84C]" />;
}

/* ── Section heading ── */
function SectionHead({ icon: Icon, text }) {
  return (
    <div className="flex items-center gap-2.5 pb-3 mb-5 border-b-2 border-[#F0EAE0]">
      <div className="w-8 h-8 rounded-lg bg-[#FDF9F0] border border-[#C9A84C]/30 flex items-center justify-center shrink-0">
        <Icon size={14} className="text-[#C9A84C]" />
      </div>
      <span className="text-[11px] font-extrabold tracking-[.2em] uppercase text-[#7A6A50]">{text}</span>
      <div className="flex-1 h-px bg-[#F0EAE0]" />
    </div>
  );
}

/* ── Cancel Modal ── */
function CancelModal({ orderId, onConfirm, onClose }) {
  return (
    <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-lg flex items-center justify-center p-5">
      <div className="bg-white rounded-3xl p-9 w-full max-w-sm text-center shadow-2xl animate-[popIn_.35s_cubic-bezier(.22,1,.36,1)_both]">
        <div className="w-14 h-14 rounded-full bg-red-50 border-2 border-red-200 flex items-center justify-center mx-auto mb-5">
          <AlertCircle size={26} className="text-red-500" />
        </div>
        <h3 className="font-bold text-2xl text-[#1a1205] mb-1" style={{ fontFamily: "'Cormorant Garamond',serif" }}>
          Cancel this order?
        </h3>
        <p className="text-base font-extrabold text-[#C9A84C] my-3">#{orderId}</p>
        <p className="text-xs text-[#b8a88a] mb-6 leading-relaxed">
          This action is irreversible. Refund within 5–7 business days.
        </p>
        <div className="flex gap-2.5">
          <button onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-[#e8ddd0] bg-[#fdfaf6] text-[#5a4a35] text-sm font-bold hover:bg-[#f0ebe0] transition-colors">
            Keep it
          </button>
          <button onClick={onConfirm}
            className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-700 text-white text-sm font-bold shadow-[0_4px_14px_rgba(220,38,38,.3)] transition-colors">
            Cancel Order
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Info row (label + value) ── */
function InfoRow({ label, value, gold, bold, className = "" }) {
  return (
    <div className={`flex gap-4 pb-2.5 mb-2.5 border-b border-[#F7F3EE] last:border-b-0 last:mb-0 last:pb-0 ${className}`}>
      <span className="text-xs text-[#B8A88A] font-semibold min-w-[90px] shrink-0">{label}</span>
      <span className={`text-sm flex-1 ${bold ? "font-bold" : "font-semibold"} ${gold ? "text-[#C9A84C]" : "text-[#1a1205]"}`}>
        {value || "—"}
      </span>
    </div>
  );
}

/* ─────────────────────────────────────────────
   PAGE
───────────────────────────────────────────── */
export default function OrderDetailPage() {
  const { trackingId } = useParams();
  const router         = useRouter();
  const order          = getOrder(trackingId);

  const [cancelled,  setCancelled]  = useState(false);
  const [showCancel, setShowCancel] = useState(false);

  if (!order) return (
    <div className="min-h-screen bg-[#F7F4F0] flex items-center justify-center">
      <div className="text-center">
        <Package size={48} className="text-[#c4b49a] mx-auto mb-3" />
        <p className="text-[#a89272] text-sm mb-3">Order not found.</p>
        <button onClick={() => router.back()} className="text-[#C9A84C] text-sm font-bold bg-none border-none cursor-pointer">
          ← Go Back
        </button>
      </div>
    </div>
  );

  const { customer, shipment } = order;
  const customerName  = customer?.fullName ?? "Customer";
  const currentStatus = cancelled ? "Cancelled" : order.orderStatus;
  const isConfirmed   = shipment?.adminConfirmed === true;
  const initials      = customerName.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        * { font-family:'Plus Jakarta Sans',sans-serif; box-sizing:border-box; -webkit-font-smoothing:antialiased; }
        @keyframes riseUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes popIn  { from{opacity:0;transform:scale(.9)} to{opacity:1;transform:scale(1)} }
        .serif { font-family:'Cormorant Garamond',serif; }
      `}</style>

      {showCancel && (
        <CancelModal
          orderId={order.id}
          onConfirm={() => { setCancelled(true); setShowCancel(false); }}
          onClose={() => setShowCancel(false)}
        />
      )}

      <div className="min-h-screen bg-[#F7F4F0]">

        {/* ══ HERO HEADER ══ */}
        <div className="bg-gradient-to-br from-[#F0EBE0] to-[#E8DECE] border-b-2 border-[#DDD0BE]"
             style={{ animation: "riseUp .3s ease both" }}>

          {/* Breadcrumb */}
          <p className="text-center text-xs text-[#A89272] pt-4 px-6">
            <span className="cursor-pointer hover:text-[#1a1205]" onClick={() => router.push("/")}>Home</span>
            <span className="mx-1.5 text-[#C9A84C]">›</span>
            <span className="cursor-pointer hover:text-[#1a1205]" onClick={() => router.back()}>My Orders</span>
            <span className="mx-1.5 text-[#C9A84C]">›</span>
            <strong className="text-[#1a1205]">{order.id}</strong>
          </p>

          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 pt-5 pb-0">

            {/* Customer row */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
              {/* Avatar + name */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full shrink-0 flex items-center justify-center
                                text-lg sm:text-xl font-extrabold text-[#1a1205]
                                bg-gradient-to-br from-[#C9A84C] to-[#e8c96a]
                                shadow-[0_5px_18px_rgba(201,168,76,.35)]">
                  {initials}
                </div>
                <div>
                  <p className="text-[10.5px] font-bold tracking-[.2em] text-[#A89272] uppercase mb-0.5">
                    Order placed by
                  </p>
                  <h2 className="serif text-2xl sm:text-[26px] font-bold text-[#1a1205] mb-1.5">
                    {customerName}
                  </h2>
                  <Chip status={currentStatus} />
                </div>
              </div>

              {/* Order ID pill */}
              <div className="bg-[#C9A84C]/15 border border-[#C9A84C]/35 rounded-xl px-5 py-3 text-center">
                <p className="text-[10px] font-bold tracking-[.2em] uppercase text-[#A89272] mb-0.5">Order ID</p>
                <p className="serif text-xl font-bold text-[#C9A84C]">#{order.id}</p>
              </div>
            </div>

            {/* Meta strip — 2x2 on mobile, 4-col on desktop */}
            <div className="grid grid-cols-2 sm:grid-cols-4 border-t border-l border-[#DDD0BE]">
              {[
                { icon: Calendar, label: "Order Placed",  value: order.placed                                                          },
                { icon: Hash,     label: "Tracking No.",  value: isConfirmed && shipment?.trackingNumber ? shipment.trackingNumber : "Pending", gold: true },
                { icon: Calendar, label: "Est. Delivery", value: isConfirmed ? shipment?.estimatedDelivery ?? "TBD" : "Awaiting Confirmation"          },
                { icon: Truck,    label: "Courier",       value: isConfirmed ? shipment?.courierName ?? "TBD" : "Not Assigned"                          },
              ].map((m, i) => (
                <div key={i} className="px-3 sm:px-4 py-3 border-r border-b border-[#DDD0BE] bg-white/45">
                  <div className="flex items-center gap-1.5 mb-1">
                    <m.icon size={10} className="text-[#C9A84C]" />
                    <span className="text-[9px] font-bold tracking-[.16em] uppercase text-[#A89272]">{m.label}</span>
                  </div>
                  <p className={`text-[12.5px] font-bold ${m.gold && isConfirmed ? "text-[#C9A84C]" : "text-[#1a1205]"}`}>
                    {m.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ══ BODY ══ */}
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-7 pb-16"
             style={{ animation: "riseUp .4s ease .05s both" }}>

          {/* Back button */}
          <button onClick={() => router.push("/profile?tab=my-orders")}
            className="flex items-center gap-1.5 text-[#a89272] text-sm font-semibold mb-6 hover:text-[#1a1205] transition-colors bg-none border-none cursor-pointer p-0">
            <ChevronLeft size={15} /> Back to My Orders
          </button>

          {/* ── Pending confirmation banner ── */}
          {!cancelled && !isConfirmed && (
            <div className="flex items-start gap-3 p-4 mb-5 bg-blue-50 border border-blue-200 rounded-2xl">
              <Clock3 size={20} className="text-blue-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-blue-600 mb-0.5">Waiting for Order Confirmation</p>
                <p className="text-xs text-blue-400 leading-relaxed">
                  Your order has been received. Tracking information will appear once the order is confirmed and dispatched.
                </p>
              </div>
            </div>
          )}

          {/* ── Customer Details ── */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#EDE5D8] mb-5">
            <SectionHead icon={MapPin} text="Customer Details" />

            {/* Address type badge */}
            {customer?.type && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-4
                              bg-[#C9A84C]/10 border border-[#C9A84C]/22">
                <AddrTypeIcon type={customer.type} />
                <span className="text-[10.5px] font-bold text-[#C9A84C] tracking-[.12em] uppercase">
                  {customer.type} Address
                </span>
              </div>
            )}

            {/* Info grid — 1 col mobile, 3 col desktop */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-3 mb-4">
              {[
                { label: "Full Name", value: customer?.fullName                                       },
                { label: "Phone",    value: customer?.phone,  link: `tel:${customer?.phone}`         },
                { label: "Email",    value: customer?.email,  link: `mailto:${customer?.email}`      },
                { label: "City",     value: customer?.city                                            },
                { label: "State",    value: customer?.state                                           },
                { label: "Pincode",  value: customer?.pincode                                         },
              ].map((f, i) => (
                <div key={i}>
                  <p className="text-[10px] text-[#C4B49A] font-bold tracking-[.1em] uppercase mb-0.5">{f.label}</p>
                  {f.link
                    ? <a href={f.link} className="text-sm font-bold text-[#C9A84C] no-underline hover:underline">{f.value}</a>
                    : <p className="text-sm font-semibold text-[#1a1205] m-0">{f.value}</p>
                  }
                </div>
              ))}
            </div>

            {/* Full address box */}
            <div className="bg-[#FDFAF6] border border-[#EDE5D8] rounded-xl px-4 py-3">
              <p className="text-[10px] text-[#C4B49A] font-bold tracking-[.1em] uppercase mb-1">Full Address</p>
              <p className="text-sm font-semibold text-[#1a1205] leading-relaxed m-0">
                {customer?.address}
                {customer?.landmark && <span className="text-[#A89272] font-normal"> · Near {customer.landmark}</span>}
              </p>
              <p className="text-xs text-[#A89272] mt-0.5">
                {customer?.city}, {customer?.state} – {customer?.pincode}
              </p>
            </div>
          </div>

          {/* ── Products table ── */}
          <div className="rounded-2xl overflow-hidden border border-[#E8DDD0] bg-white mb-5">

            {/* Table header — hidden on mobile */}
            <div className="hidden sm:grid grid-cols-[1fr_80px_60px_120px] gap-4 px-5 py-3 bg-[#F0EAE0]">
              {["Product", "Size", "Qty", "Price"].map(h => (
                <span key={h} className={`text-[10.5px] font-extrabold tracking-[.16em] text-[#7A6A50] uppercase ${h === "Price" ? "text-right" : ""}`}>
                  {h}
                </span>
              ))}
            </div>

            {/* Rows */}
            {order.products.map((p, i) => (
              <div key={p.id}
                className={`flex flex-col sm:grid sm:grid-cols-[1fr_80px_60px_120px] sm:items-center gap-3 sm:gap-4
                            px-4 sm:px-5 py-4 hover:bg-[#FDFAF6] transition-colors
                            ${i < order.products.length - 1 ? "border-b border-[#F7F3EE]" : ""}`}>

                {/* Product info */}
                <div className="flex items-center gap-3">
                  <img src={p.image} alt={p.name}
                    className="w-14 h-16 rounded-xl object-cover shrink-0 border border-[#EDE5D8]" />
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-[#1a1205] truncate">{p.name}</p>
                    <p className="text-xs text-[#A89272] mt-0.5 mb-1.5">{p.brand}</p>
                    <Chip status={cancelled ? "Cancelled" : p.status} />
                    {/* Show size+qty inline on mobile */}
                    <p className="text-xs text-[#A89272] mt-1 sm:hidden">
                      Size: {p.size} · Qty: ×{p.qty}
                    </p>
                  </div>
                </div>

                {/* Size */}
                <span className="hidden sm:block text-sm font-semibold text-[#5a4a35]">{p.size}</span>
                {/* Qty */}
                <span className="hidden sm:block text-sm font-semibold text-[#5a4a35]">×{p.qty}</span>
                {/* Price */}
                <span className={`serif text-lg sm:text-xl font-bold text-[#1a1205] sm:text-right self-end sm:self-auto`}>
                  ₹{p.price.toLocaleString("en-IN")}
                </span>
              </div>
            ))}

            {/* Total row */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3
                            px-4 sm:px-5 py-4 bg-[#FDF9F0] border-t-2 border-dashed border-[#E8DDD0]">
              <div className="flex items-center gap-2 flex-wrap">
                <CreditCard size={14} className="text-[#C9A84C]" />
                <span className="text-sm text-[#5a4a35] font-semibold">Card ···· {order.card}</span>
                <span className="text-sm text-green-600 font-bold">· Paid ✓</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-xs text-[#A89272] font-semibold tracking-[.1em] uppercase">Total</span>
                <span className="serif text-2xl sm:text-[28px] font-bold text-[#C9A84C]">
                  ₹{order.total.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </div>

          {/* ── Delivery + Shipment — stack on mobile, 2-col on md+ ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">

            {/* Delivery Details */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#EDE5D8]">
              <SectionHead icon={MapPin} text="Delivery Details" />
              <InfoRow label="Recipient"  value={customerName}                                              bold />
              <InfoRow label="Address"    value={customer?.deliveryAddress ?? customer?.address}                 />
              <InfoRow label="City/State" value={`${customer?.city ?? ""}, ${customer?.state ?? ""}`}           />
              <InfoRow label="Pincode"    value={customer?.pincode}                                              />
              <InfoRow label="Arriving"   value={isConfirmed ? shipment?.estimatedArrival ?? "TBD" : "Pending"} bold />
            </div>

            {/* Shipment Info */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#EDE5D8]">
              <SectionHead icon={Truck} text="Shipment Info" />
              {isConfirmed ? (
                <>
                  <InfoRow label="Tracking"  value={shipment?.trackingNumber}  gold bold />
                  <InfoRow label="Service"   value={shipment?.courierService}             />
                  <InfoRow label="Courier"   value={shipment?.courierName}                />
                  <InfoRow label="Method"    value={shipment?.shippingMethod}             />
                  <InfoRow label="Ship Date" value={shipment?.shipmentDate}               />
                  <InfoRow label="ETA"       value={shipment?.estimatedArrival}      bold />
                </>
              ) : (
                <div className="flex items-start gap-2.5 p-3.5 bg-blue-50 border border-blue-100 rounded-xl">
                  <Clock3 size={15} className="text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-blue-600 mb-0.5">Shipment details not yet available</p>
                    <p className="text-xs text-blue-400 leading-relaxed">
                      Courier and tracking info will appear once your order is confirmed.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── Help + Actions ── */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#EDE5D8]
                          flex flex-col sm:flex-row items-start sm:items-center
                          justify-between gap-5 sm:gap-6">

            {/* Contact */}
            <div>
              <p className="text-[11px] font-extrabold tracking-[.18em] uppercase text-[#7A6A50] mb-3">
                Need Help?
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-5">
                <a href="tel:+910000000000"
                  className="flex items-center gap-2 text-sm font-semibold text-[#5a4a35] no-underline hover:text-[#C9A84C] transition-colors">
                  <div className="w-8 h-8 rounded-full bg-[#FDF9F0] border border-[#C9A84C]/30 flex items-center justify-center shrink-0">
                    <Phone size={13} className="text-[#C9A84C]" />
                  </div>
                  +91 0000 000 000
                </a>
                <a href="mailto:support@banishq.com"
                  className="flex items-center gap-2 text-sm font-semibold text-[#5a4a35] no-underline hover:text-[#C9A84C] transition-colors">
                  <div className="w-8 h-8 rounded-full bg-[#FDF9F0] border border-[#C9A84C]/30 flex items-center justify-center shrink-0">
                    <Mail size={13} className="text-[#C9A84C]" />
                  </div>
                  support@banishq.com
                </a>
              </div>
            </div>

            {/* Action buttons */}
            {!cancelled ? (
              <div className="flex flex-col sm:flex-row gap-2.5 w-full sm:w-auto">
                {isConfirmed && (
                  <button onClick={() => router.push(`/track-order/${order.id}`)}
                    className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl border-none
                               bg-gradient-to-r from-[#1a1205] to-[#3a2408] text-[#f5ede0]
                               text-sm font-bold cursor-pointer w-full sm:w-auto
                               shadow-[0_5px_20px_rgba(26,18,5,.22)]
                               hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(26,18,5,.3)]
                               active:translate-y-0 transition-all">
                    <MapPin size={13} /> Track Order <ArrowRight size={12} />
                  </button>
                )}
                <button onClick={() => setShowCancel(true)}
                  className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl
                             border border-red-200 bg-red-50 text-red-600 text-sm font-bold
                             cursor-pointer w-full sm:w-auto
                             hover:bg-red-100 transition-colors">
                  <X size={13} /> Cancel Order
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-bold">
                <X size={13} /> Cancelled — Refund Processing
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
}