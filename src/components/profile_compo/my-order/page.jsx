// components/profile_compo/my_orders/page.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  MapPin, X, Package, CheckCircle2,
  Truck, Clock, AlertCircle, ChevronDown,
} from "lucide-react";
import { ORDERS } from "../../../app/data/orders/order";

/* ── Status config ───────────────────────────── */
const STATUS = {
  "In-Transit": { color: "text-[#2a9d8f]", bg: "bg-[#e8f8f6]", dot: "bg-[#2a9d8f]", icon: Truck       },
  "Delivered":  { color: "text-green-600",  bg: "bg-green-50",  dot: "bg-green-500",  icon: CheckCircle2 },
  "Processing": { color: "text-blue-500",   bg: "bg-blue-50",   dot: "bg-blue-400",   icon: Clock        },
  "Cancelled":  { color: "text-red-500",    bg: "bg-red-50",    dot: "bg-red-400",    icon: AlertCircle  },
};

/* ── Cancel Modal ────────────────────────────── */
function CancelModal({ orderId, onConfirm, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
      style={{ animation: "fadeIn .2s ease both" }}
    >
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm"
           style={{ animation: "slideUp .3s ease both" }}>
        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
          <X size={22} className="text-red-500" />
        </div>
        <h3 className="text-[17px] font-semibold text-center text-gray-900 mb-2"
            style={{ fontFamily: "'Playfair Display', serif" }}>
          Cancel Order?
        </h3>
        <p className="text-sm text-gray-400 text-center mb-6 leading-relaxed">
          Are you sure you want to cancel order{" "}
          <span className="font-semibold text-gray-600">#{orderId}</span>?
          This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600
                       text-sm font-medium hover:bg-gray-50 transition-all duration-150"
          >
            Keep Order
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white
                       text-sm font-medium transition-all duration-150 shadow-sm"
          >
            Yes, Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Single Order Card ───────────────────────── */
function OrderCard({ order }) {
  const router = useRouter();
  const [open,       setOpen]       = useState(true);
  const [showCancel, setShowCancel] = useState(false);
  const [cancelled,  setCancelled]  = useState(false);

  const currentStatus = cancelled ? "Cancelled" : order.orderStatus;
  const st = STATUS[currentStatus] || STATUS["In-Transit"];

  return (
    <>
      {showCancel && (
        <CancelModal
          orderId={order.id}
          onConfirm={() => { setCancelled(true); setShowCancel(false); }}
          onClose={() => setShowCancel(false)}
        />
      )}

      <div
        className={`bg-white rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.06)]
                    overflow-hidden mb-5 border border-gray-100
                    transition-opacity duration-300 ${cancelled ? "opacity-60" : ""}`}
      >
        {/* ── Header ── */}
        <div className="flex flex-wrap items-start justify-between gap-3 px-5 py-4 border-b border-gray-100">
          <div>
            <p className="text-[12px] text-gray-400 mb-0.5">
              Order{" "}
              <span className="text-[#b8964e] font-semibold text-[14px]">
                #{order.id}
              </span>
            </p>
            <p className="text-[11.5px] text-gray-400">Placed: {order.placed}</p>
          </div>

          <button
            onClick={() => router.push(`/track-order/${order.id}`)}
            disabled={cancelled}
            className="flex items-center gap-1.5 bg-[#7a6030] hover:bg-[#5e4a25]
                       text-white text-[11px] font-medium tracking-wide uppercase
                       px-4 py-2 rounded-xl shadow-[0_2px_10px_rgba(122,96,48,0.25)]
                       hover:-translate-y-0.5 active:translate-y-0
                       disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
          >
            <MapPin size={12} /> Track Order
          </button>
        </div>

        {/* ── Table header ── */}
        <div className="grid grid-cols-[1fr_auto_auto] bg-[#c9a84c]/10 border-b border-[#e8ddd0]">
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-2 px-5 py-2.5 text-left"
          >
            <span className="text-[11px] font-semibold text-[#7a5c20] uppercase tracking-widest">
              Product Name
            </span>
            <span className={`text-[#b8964e] transition-transform duration-300 ${open ? "rotate-180" : ""}`}>
              <ChevronDown size={14} />
            </span>
            <span className="text-[10px] text-[#b8964e]/60 ml-auto hidden sm:inline">
              {open ? "Collapse" : `${order.products.length} items`}
            </span>
          </button>
          <div className="px-5 py-2.5 text-[11px] font-semibold text-[#7a5c20] uppercase tracking-widest">
            Status
          </div>
          <div className="px-5 py-2.5 text-[11px] font-semibold text-[#7a5c20] uppercase tracking-widest hidden md:block">
            Expected By
          </div>
        </div>

        {/* ── Products ── */}
        <div
          className="overflow-hidden transition-all duration-500 ease-in-out"
          style={{ maxHeight: open ? `${order.products.length * 110}px` : "0px" }}
        >
          {order.products.map((p, i) => {
            const pst = STATUS[cancelled ? "Cancelled" : p.status] || STATUS["In-Transit"];
            return (
              <div
                key={p.id}
                className="grid grid-cols-[1fr_auto_auto] items-center px-5 py-3.5
                           border-b border-gray-100 last:border-b-0
                           hover:bg-gray-50/60 transition-colors duration-150"
                style={{ animation: "fadeSlide .3s ease both", animationDelay: `${i * 0.04}s` }}
              >
                {/* Product info */}
                <div className="flex items-center gap-3 pr-3">
                  <div className="w-12 h-14 rounded-xl overflow-hidden bg-gray-100 shrink-0 ring-1 ring-gray-200">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-[13px] font-medium text-gray-800 leading-snug">{p.name}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{p.brand}</p>
                    <p className="text-[11px] text-gray-500 mt-1">
                      <span className="text-gray-400">Size:</span> {p.size}&nbsp;&nbsp;
                      <span className="text-gray-400">Qty:</span> {p.qty}&nbsp;&nbsp;
                      <span className="font-semibold text-gray-700">
                        ₹{p.price.toLocaleString()}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Status */}
                <div className="px-2 md:px-5 min-w-[100px]">
                  <span className={`inline-flex items-center gap-1.5 text-[11px] font-medium
                                   px-2.5 py-1 rounded-full ${pst.bg} ${pst.color}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${pst.dot}`} />
                    {cancelled ? "Cancelled" : p.status}
                  </span>
                </div>

                {/* Delivery */}
                <div className="px-2 md:px-5 hidden md:block min-w-[110px]">
                  <p className={`text-[12px] font-medium ${cancelled ? "text-gray-400 line-through" : "text-gray-700"}`}>
                    {p.delivery}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Footer ── */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5
                        bg-gray-50/80 border-t border-gray-100">
          <div className="flex items-center gap-4">
            {!cancelled ? (
              <button
                onClick={() => setShowCancel(true)}
                className="flex items-center gap-1.5 text-[12px] text-gray-500
                           hover:text-red-500 transition-colors duration-150 font-medium"
              >
                <X size={13} /> Cancel Order
              </button>
            ) : (
              <span className="flex items-center gap-1.5 text-[12px] text-red-400 font-medium">
                <X size={13} /> Order Cancelled
              </span>
            )}
            <span className="text-[11px] text-gray-400">
              Paid via card ···· {order.card}
            </span>
          </div>
          <p className="text-[16px] font-bold text-gray-900">
            ₹{order.total.toLocaleString()}
          </p>
        </div>
      </div>
    </>
  );
}

/* ── Tab Component (embedded in ProfilePage) ─ */
export default function MyOrdersTab() {
  return (
    <div style={{ animation: "fadeSlide .35s ease both" }}>
      <h2
        className="text-xl font-semibold text-gray-900 mb-1"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        My Orders
      </h2>
      <p className="text-[13px] text-gray-400 mb-6 font-light">
        Track and manage your recent purchases
      </p>

      {ORDERS.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <Package size={40} className="mb-3 opacity-40" />
          <p className="text-sm">You have no orders yet.</p>
        </div>
      ) : (
        ORDERS.map((order) => <OrderCard key={order.id} order={order} />)
      )}
    </div>
  );
}