// components/profile_compo/my_orders/page.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  MapPin,
  X,
  Package,
  CheckCircle2,
  Truck,
  Clock,
  AlertCircle,
  ChevronDown,
  ShoppingBag,
  Eye,
  Tag,
  CreditCard,
} from "lucide-react";
import { ORDERS } from "../../../app/data/orders/order";

/* ─── Status config ─────────────────────── */
const STATUS = {
  "In-Transit": {
    color: "#0e9b8a",
    bg: "rgba(14,155,138,.1)",
    border: "rgba(14,155,138,.25)",
    icon: Truck,
  },
  Delivered: {
    color: "#16a34a",
    bg: "rgba(22,163,74,.1)",
    border: "rgba(22,163,74,.25)",
    icon: CheckCircle2,
  },
  Processing: {
    color: "#2563eb",
    bg: "rgba(37,99,235,.1)",
    border: "rgba(37,99,235,.25)",
    icon: Clock,
  },
  Cancelled: {
    color: "#dc2626",
    bg: "rgba(220,38,38,.1)",
    border: "rgba(220,38,38,.25)",
    icon: X,
  },
};

function StatusBadge({ status }) {
  const s = STATUS[status] || STATUS["In-Transit"];
  const Icon = s.icon;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        fontSize: 11.5,
        fontWeight: 700,
        color: s.color,
        background: s.bg,
        border: `1px solid ${s.border}`,
        padding: "4px 10px",
        borderRadius: 99,
        letterSpacing: ".03em",
        whiteSpace: "nowrap",
      }}
    >
      <Icon size={11} strokeWidth={2.5} />
      {status}
    </span>
  );
}

/* ─── Cancel modal ──────────────────────── */
function CancelModal({ orderId, onConfirm, onClose }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(26,18,5,.45)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        animation: "modalFade .2s ease both",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 22,
          padding: "34px 28px 28px",
          width: "100%",
          maxWidth: 380,
          boxShadow: "0 24px 60px rgba(26,18,5,.18)",
          border: "1.5px solid #EDE5D8",
          animation: "modalSlide .3s cubic-bezier(.22,1,.36,1) both",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            margin: "0 auto 18px",
            background: "#FFF1F1",
            border: "2px solid #FECACA",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <AlertCircle size={26} color="#dc2626" strokeWidth={2} />
        </div>

        <h3
          style={{
            fontFamily: "'Cormorant Garamond',serif",
            fontSize: 22,
            fontWeight: 700,
            color: "#1A1205",
            margin: "0 0 8px",
          }}
        >
          Cancel Order?
        </h3>
        <p
          style={{
            fontSize: 13.5,
            color: "#A89272",
            margin: "0 0 6px",
            lineHeight: 1.65,
          }}
        >
          Are you sure you want to cancel order
        </p>
        <p
          style={{
            fontSize: 15,
            fontWeight: 800,
            color: "#C9A84C",
            margin: "0 0 22px",
            letterSpacing: ".04em",
          }}
        >
          #{orderId}
        </p>
        <p style={{ fontSize: 12.5, color: "#B8A88A", margin: "0 0 24px" }}>
          This action cannot be undone. Any payment will be refunded within 5–7
          business days.
        </p>

        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: "12px 0",
              borderRadius: 12,
              border: "1.5px solid #EDE5D8",
              background: "#FDFAF6",
              color: "#5A4A35",
              fontSize: 13.5,
              fontWeight: 700,
              cursor: "pointer",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#F0EBE0")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#FDFAF6")}
          >
            Keep Order
          </button>
          <button
            onClick={onConfirm}
            style={{
              flex: 1,
              padding: "12px 0",
              borderRadius: 12,
              border: "none",
              background: "#dc2626",
              color: "#fff",
              fontSize: 13.5,
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 4px 14px rgba(220,38,38,.25)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#b91c1c")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#dc2626")}
          >
            Yes, Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Order card ────────────────────────── */
function OrderCard({ order }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [showCancel, setShowCancel] = useState(false);
  const [cancelled, setCancelled] = useState(false);

  const currentStatus = cancelled ? "Cancelled" : order.orderStatus;

  return (
    <>
      {showCancel && (
        <CancelModal
          orderId={order.id}
          onConfirm={() => {
            setCancelled(true);
            setShowCancel(false);
          }}
          onClose={() => setShowCancel(false)}
        />
      )}

      <div
        style={{
          background: "#fff",
          border: `1.5px solid ${cancelled ? "#FECACA" : "#EDE5D8"}`,
          borderRadius: 20,
          marginBottom: 16,
          overflow: "hidden",
          boxShadow: "0 2px 16px rgba(26,18,5,.06)",
          opacity: cancelled ? 0.75 : 1,
          transition: "opacity .3s,border-color .3s",
        }}
      >
        {/* gold bar */}
        {!cancelled && (
          <div
            style={{
              height: 3,
              background: "linear-gradient(90deg,#C9A84C,#E8C96A,#C9A84C)",
            }}
          />
        )}

        {/* ── HEADER ── */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 10,
            padding: "14px 16px",
            borderBottom: "1px solid #F0EAE0",
            background: "#FDFAF6",
          }}
        >
          {/* order id + date */}
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                marginBottom: 3,
              }}
            >
              <ShoppingBag size={13} color="#C9A84C" />
              <span
                style={{
                  fontSize: 11,
                  color: "#A89272",
                  fontWeight: 600,
                  letterSpacing: ".1em",
                }}
              >
                ORDER
              </span>
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 800,
                  color: "#C9A84C",
                  letterSpacing: ".04em",
                }}
              >
                #{order.id}
              </span>
            </div>
            <p style={{ fontSize: 11.5, color: "#A89272", margin: 0 }}>
              Placed:{" "}
              <strong style={{ color: "#5A4A35" }}>{order.placed}</strong>
            </p>
          </div>

          {/* actions */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              flexWrap: "wrap",
            }}
          >
            <StatusBadge status={currentStatus} />

            {/* view details */}
            <button
              onClick={() => router.push(`/my-order/${order.id}`)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                padding: "7px 12px",
                borderRadius: 10,
                border: "1.5px solid #EDE5D8",
                background: "#fff",
                color: "#5A4A35",
                fontSize: 11.5,
                fontWeight: 700,
                cursor: "pointer",
                transition: "all .2s",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#C9A84C";
                e.currentTarget.style.color = "#C9A84C";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#EDE5D8";
                e.currentTarget.style.color = "#5A4A35";
              }}
            >
              <Eye size={11} />{" "}
              <span className="ord-btn-label">View Details</span>
            </button>

            {/* track */}
            {!cancelled && (
              <button
                onClick={() => router.push(`/track-order/${order.id}`)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "7px 12px",
                  borderRadius: 10,
                  border: "none",
                  background: "linear-gradient(120deg,#1A1205,#3a2408)",
                  color: "#F5EDE0",
                  fontSize: 11.5,
                  fontWeight: 700,
                  cursor: "pointer",
                  boxShadow: "0 3px 10px rgba(26,18,5,.2)",
                  transition: "all .2s",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "translateY(-1px)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "translateY(0)")
                }
              >
                <MapPin size={11} />{" "}
                <span className="ord-btn-label">Track</span>
              </button>
            )}
          </div>
        </div>

        {/* ── QUICK INFO STRIP — responsive flex ── */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            borderBottom: "1px solid #F0EAE0",
          }}
        >
          {[
            {
              icon: Tag,
              label: "Tracking",
              value: order.tracking?.trackingNumber || "Pending",
            },
            {
              icon: CreditCard,
              label: "Total",
              value: `₹${order.total.toLocaleString("en-IN")}`,
            },
            {
              icon: Package,
              label: "Items",
              value: `${order.products.length} item${
                order.products.length > 1 ? "s" : ""
              }`,
            },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 16px",
                flex: "1 1 120px",
                borderRight: i < 2 ? "1px solid #F0EAE0" : "none",
                borderBottom: "none",
              }}
            >
              <item.icon size={13} color="#C9A84C" />
              <div>
                <p
                  style={{
                    margin: 0,
                    fontSize: 9.5,
                    color: "#A89272",
                    fontWeight: 700,
                    letterSpacing: ".1em",
                    textTransform: "uppercase",
                  }}
                >
                  {item.label}
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: 12.5,
                    fontWeight: 700,
                    color: "#1A1205",
                  }}
                >
                  {item.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ── PRODUCTS TOGGLE ── */}
        <button
          onClick={() => setOpen((v) => !v)}
          style={{
            width: "100%",
            padding: "10px 16px",
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: open ? "#FDF9F0" : "transparent",
            border: "none",
            cursor: "pointer",
            borderBottom: open ? "1px solid #F0EAE0" : "none",
            transition: "background .2s",
          }}
        >
          <Package size={13} color="#C9A84C" />
          <span
            style={{
              fontSize: 11.5,
              fontWeight: 700,
              color: "#7A6A50",
              letterSpacing: ".08em",
              textTransform: "uppercase",
              flex: 1,
              textAlign: "left",
            }}
          >
            {open
              ? "Hide Products"
              : `Show ${order.products.length} Product${
                  order.products.length > 1 ? "s" : ""
                }`}
          </span>
          <ChevronDown
            size={14}
            color="#C9A84C"
            style={{
              transform: open ? "rotate(180deg)" : "rotate(0)",
              transition: "transform .3s",
            }}
          />
        </button>

        {/* ── PRODUCTS LIST ── */}
        <div
          style={{
            maxHeight: open ? `${order.products.length * 96}px` : "0px",
            overflow: "hidden",
            transition: "max-height .45s cubic-bezier(.4,0,.2,1)",
          }}
        >
          {order.products.map((p, i) => (
            <div
              key={p.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "12px 16px",
                borderBottom:
                  i < order.products.length - 1 ? "1px solid #F7F3EE" : "none",
                animation: open
                  ? `prodFadeIn .3s ease ${i * 0.05}s both`
                  : "none",
              }}
            >
              {/* image */}
              <img
                src={p.image}
                alt={p.name}
                style={{
                  width: 44,
                  height: 50,
                  borderRadius: 9,
                  objectFit: "cover",
                  flexShrink: 0,
                  border: "1px solid #EDE5D8",
                }}
              />

              {/* info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    margin: "0 0 2px",
                    fontSize: 12.5,
                    fontWeight: 700,
                    color: "#1A1205",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {p.name}
                </p>
                <p
                  style={{
                    margin: "0 0 4px",
                    fontSize: 10.5,
                    color: "#A89272",
                  }}
                >
                  {p.brand}
                </p>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {[
                    `Size: ${p.size}`,
                    `Qty: ${p.qty}`,
                    `₹${p.price.toLocaleString("en-IN")}`,
                  ].map((t, j) => (
                    <span
                      key={j}
                      style={{
                        fontSize: 10.5,
                        color: "#7A6A50",
                        fontWeight: 600,
                        background: "#F7F3EE",
                        padding: "2px 7px",
                        borderRadius: 99,
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* status — hidden on very small screens via class */}
              <div style={{ flexShrink: 0 }} className="ord-status-col">
                <StatusBadge status={cancelled ? "Cancelled" : p.status} />
                <p
                  style={{
                    margin: "4px 0 0",
                    fontSize: 10,
                    color: "#B8A88A",
                    textAlign: "right",
                    textDecoration: cancelled ? "line-through" : "none",
                  }}
                >
                  {p.delivery}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ── FOOTER ── */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 8,
            padding: "10px 16px",
            background: "#FDFAF6",
            borderTop: "1px solid #F0EAE0",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {!cancelled ? (
              <button
                onClick={() => setShowCancel(true)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  fontSize: 12,
                  color: "#A89272",
                  fontWeight: 600,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  transition: "color .2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#dc2626")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#A89272")}
              >
                <X size={12} /> Cancel Order
              </button>
            ) : (
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  fontSize: 12,
                  color: "#dc2626",
                  fontWeight: 600,
                }}
              >
                <X size={12} /> Order Cancelled
              </span>
            )}
            <span style={{ fontSize: 11, color: "#C4B49A" }}>
              ···· {order.card}
            </span>
          </div>
          <p
            style={{
              fontSize: 17,
              fontWeight: 800,
              color: "#1A1205",
              margin: 0,
              fontFamily: "'Cormorant Garamond',serif",
            }}
          >
            ₹{order.total.toLocaleString("en-IN")}
          </p>
        </div>
      </div>
    </>
  );
}

/* ─── Main tab ──────────────────────────── */
export default function MyOrdersTab() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        * { font-family:'Plus Jakarta Sans',sans-serif; -webkit-font-smoothing:antialiased; }

        @keyframes modalFade  { from{opacity:0}                            to{opacity:1} }
        @keyframes modalSlide { from{opacity:0;transform:scale(.94) translateY(16px)} to{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes prodFadeIn { from{opacity:0;transform:translateX(-8px)} to{opacity:1;transform:translateX(0)} }
        @keyframes tabFadeIn  { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }

        /* hide delivery label on very small screens */
        @media (max-width: 420px) {
          .ord-status-col { display: none; }
          .ord-btn-label  { display: none; }
        }
      `}</style>

      <div style={{ animation: "tabFadeIn .35s ease both" }}>
        <div style={{ marginBottom: 24 }}>
          <h2
            style={{
              fontFamily: "'Cormorant Garamond',serif",
              fontSize: 26,
              fontWeight: 700,
              color: "#1A1205",
              margin: "0 0 4px",
            }}
          >
            My Orders
          </h2>
          <p
            style={{
              fontSize: 13.5,
              color: "#A89272",
              margin: 0,
              fontWeight: 400,
            }}
          >
            Track, view details and manage your recent purchases
          </p>
        </div>

        {ORDERS.length === 0 ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "64px 0",
              color: "#C4B49A",
              textAlign: "center",
            }}
          >
            <Package size={44} style={{ marginBottom: 12, opacity: 0.5 }} />
            <p style={{ fontSize: 14, fontWeight: 500, margin: 0 }}>
              You have no orders yet.
            </p>
          </div>
        ) : (
          ORDERS.map((order) => <OrderCard key={order.id} order={order} />)
        )}
      </div>
    </>
  );
}
