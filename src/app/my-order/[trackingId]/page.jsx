// app/my-order/[trackingId]/page.jsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { ORDERS } from "../../data/orders/order";
import {
  ChevronLeft,
  MapPin,
  Truck,
  Phone,
  Mail,
  X,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Package,
  ShoppingBag,
  CreditCard,
  Calendar,
  Hash,
  Clock3,
  Home,
  Briefcase,
  MapPinOff,
} from "lucide-react";

/* ─────────────────────────────────────────────
   FIND ORDER — supports both tracking number
   AND order ID (for pending/unconfirmed orders)
───────────────────────────────────────────── */
function getOrder(id) {
  // Try shipment tracking number first
  const byTracking = ORDERS.find((o) => o.shipment?.trackingNumber === id);
  if (byTracking) return byTracking;
  // Fall back to order ID (for pending orders where tracking = null)
  return ORDERS.find((o) => o.id === id) ?? null;
}

/* ── Status config ── */
const STATUS = {
  "In-Transit": { color: "#0e9b8a", bg: "rgba(14,155,138,.12)", icon: Truck },
  Delivered: {
    color: "#16a34a",
    bg: "rgba(22,163,74,.12)",
    icon: CheckCircle2,
  },
  Processing: { color: "#2563eb", bg: "rgba(37,99,235,.12)", icon: Clock },
  Cancelled: { color: "#dc2626", bg: "rgba(220,38,38,.12)", icon: X },
};

function Chip({ status }) {
  const s = STATUS[status] || STATUS["Processing"];
  const Icon = s.icon;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        fontSize: 12,
        fontWeight: 700,
        color: s.color,
        background: s.bg,
        padding: "5px 13px",
        borderRadius: 99,
      }}
    >
      <Icon size={11} strokeWidth={2.5} />
      {status}
    </span>
  );
}

function AddrTypeIcon({ type }) {
  if (type === "Work") return <Briefcase size={13} color="#C9A84C" />;
  if (type === "Other") return <MapPinOff size={13} color="#C9A84C" />;
  return <Home size={13} color="#C9A84C" />;
}

/* ── Cancel Modal ── */
function CancelModal({ orderId, onConfirm, onClose }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(0,0,0,.5)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 24,
          padding: "36px 32px 28px",
          width: "100%",
          maxWidth: 380,
          textAlign: "center",
          boxShadow: "0 32px 80px rgba(0,0,0,.2)",
          animation: "popIn .35s cubic-bezier(.22,1,.36,1) both",
        }}
      >
        <div
          style={{
            width: 60,
            height: 60,
            borderRadius: "50%",
            margin: "0 auto 20px",
            background: "#FFF1F1",
            border: "2px solid #FECACA",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <AlertCircle size={28} color="#dc2626" />
        </div>
        <h3
          style={{
            fontFamily: "'Cormorant Garamond',serif",
            fontSize: 24,
            fontWeight: 700,
            color: "#1a1205",
            margin: "0 0 6px",
          }}
        >
          Cancel this order?
        </h3>
        <p
          style={{
            fontSize: 16,
            fontWeight: 800,
            color: "#C9A84C",
            margin: "8px 0 14px",
          }}
        >
          #{orderId}
        </p>
        <p
          style={{
            fontSize: 12.5,
            color: "#b8a88a",
            margin: "0 0 26px",
            lineHeight: 1.7,
          }}
        >
          This action is irreversible. Refund within 5–7 business days.
        </p>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: "13px 0",
              borderRadius: 12,
              border: "1.5px solid #e8ddd0",
              background: "#fdfaf6",
              color: "#5a4a35",
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#f0ebe0")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#fdfaf6")}
          >
            Keep it
          </button>
          <button
            onClick={onConfirm}
            style={{
              flex: 1,
              padding: "13px 0",
              borderRadius: 12,
              border: "none",
              background: "#dc2626",
              color: "#fff",
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 4px 14px rgba(220,38,38,.3)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#b91c1c")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#dc2626")}
          >
            Cancel Order
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Section label ── */
function SectionLabel({ icon: Icon, text }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        paddingBottom: 14,
        borderBottom: "2px solid #F0EAE0",
        marginBottom: 20,
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 10,
          background: "#FDF9F0",
          border: "1.5px solid rgba(201,168,76,.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon size={15} color="#C9A84C" />
      </div>
      <span
        style={{
          fontSize: 12,
          fontWeight: 800,
          letterSpacing: ".2em",
          textTransform: "uppercase",
          color: "#7A6A50",
        }}
      >
        {text}
      </span>
      <div style={{ flex: 1, height: 1, background: "#F0EAE0" }} />
    </div>
  );
}

/* ─────────────────────────────────────────────
   PAGE
───────────────────────────────────────────── */
export default function OrderDetailPage() {
  const { trackingId } = useParams();
  const router = useRouter();
  const order = getOrder(trackingId);

  const [cancelled, setCancelled] = useState(false);
  const [showCancel, setShowCancel] = useState(false);

  if (!order) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#f7f4f0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <Package size={48} color="#c4b49a" style={{ marginBottom: 14 }} />
          <p style={{ color: "#a89272", fontSize: 15, marginBottom: 14 }}>
            Order not found.
          </p>
          <button
            onClick={() => router.back()}
            style={{
              color: "#C9A84C",
              fontSize: 13,
              background: "none",
              border: "none",
              cursor: "pointer",
              fontWeight: 700,
            }}
          >
            ← Go Back
          </button>
        </div>
      </div>
    );
  }

  /* ── Use new data structure ── */
  const { customer, shipment } = order;
  const customerName = customer?.fullName ?? "Customer";
  const currentStatus = cancelled ? "Cancelled" : order.orderStatus;
  const isConfirmed = shipment?.adminConfirmed === true;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after {
          box-sizing: border-box;
          font-family: 'Plus Jakarta Sans', sans-serif;
          -webkit-font-smoothing: antialiased;
        }
        @keyframes riseUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes popIn  { from{opacity:0;transform:scale(.9)} to{opacity:1;transform:scale(1)} }
        .prod-row:hover { background: #FDFAF6 !important; }

        @media (max-width: 768px) {
          .two-col { grid-template-columns: 1fr !important; gap: 14px !important; }
        }
        @media (max-width: 640px) {
          .receipt-header  { flex-direction: column !important; align-items: flex-start !important; gap: 14px !important; padding: 18px 16px !important; }
          .meta-strip      { grid-template-columns: 1fr 1fr !important; }
          .meta-cell       { border-right: none !important; border-bottom: 1px solid #DDD0BE !important; }
          .prod-grid-head  { display: none !important; }
          .prod-row        { grid-template-columns: 1fr auto !important; padding: 14px 16px !important; }
          .total-row       { flex-direction: column !important; align-items: flex-start !important; gap: 8px !important; padding: 14px 16px !important; }
          .info-strip      { flex-direction: column !important; }
          .info-strip > div { border-right: none !important; border-bottom: 1px solid #f0eae0 !important; }
          .help-row        { flex-direction: column !important; align-items: flex-start !important; }
          .action-row      { width: 100% !important; flex-direction: column !important; }
          .action-row button { width: 100% !important; justify-content: center !important; }
          .page-pad        { padding: 18px 14px 60px !important; }
          .addr-grid       { grid-template-columns: 1fr !important; }
        }
      `}</style>

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

      <div style={{ minHeight: "100vh", background: "#F7F4F0" }}>
        {/* ── HERO HEADER ── */}
        <div
          style={{
            background: "linear-gradient(160deg,#F0EBE0 0%,#E8DECE 100%)",
            borderBottom: "2px solid #DDD0BE",
            animation: "riseUp .3s ease both",
          }}
        >
          {/* Breadcrumb */}
          <p
            style={{
              textAlign: "center",
              fontSize: 12.5,
              color: "#A89272",
              margin: 0,
              padding: "16px 24px 0",
            }}
          >
            <span
              style={{ cursor: "pointer" }}
              onClick={() => router.push("/")}
            >
              Home
            </span>
            <span style={{ margin: "0 6px", color: "#C9A84C" }}>›</span>
            <span style={{ cursor: "pointer" }} onClick={() => router.back()}>
              My Orders
            </span>
            <span style={{ margin: "0 6px", color: "#C9A84C" }}>›</span>
            <strong style={{ color: "#1a1205" }}>{order.id}</strong>
          </p>

          <div
            style={{ maxWidth: 1200, margin: "0 auto", padding: "22px 24px 0" }}
          >
            {/* Customer + Order ID row */}
            <div
              className="receipt-header"
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 16,
                marginBottom: 22,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div
                  style={{
                    width: 62,
                    height: 62,
                    borderRadius: "50%",
                    flexShrink: 0,
                    background: "linear-gradient(135deg,#C9A84C,#e8c96a)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 20,
                    fontWeight: 800,
                    color: "#1a1205",
                    boxShadow: "0 5px 18px rgba(201,168,76,.35)",
                  }}
                >
                  {customerName
                    .split(" ")
                    .map((w) => w[0])
                    .slice(0, 2)
                    .join("")
                    .toUpperCase()}
                </div>
                <div>
                  <p
                    style={{
                      margin: "0 0 2px",
                      fontSize: 10.5,
                      fontWeight: 700,
                      letterSpacing: ".2em",
                      color: "#A89272",
                      textTransform: "uppercase",
                    }}
                  >
                    Order placed by
                  </p>
                  <h2
                    style={{
                      margin: "0 0 7px",
                      fontFamily: "'Cormorant Garamond',serif",
                      fontSize: 26,
                      fontWeight: 700,
                      color: "#1a1205",
                    }}
                  >
                    {customerName}
                  </h2>
                  <Chip status={currentStatus} />
                </div>
              </div>

              <div
                style={{
                  background: "rgba(201,168,76,.15)",
                  border: "1.5px solid rgba(201,168,76,.35)",
                  borderRadius: 14,
                  padding: "12px 20px",
                  textAlign: "center",
                }}
              >
                <p
                  style={{
                    margin: "0 0 3px",
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: ".2em",
                    textTransform: "uppercase",
                    color: "#A89272",
                  }}
                >
                  Order ID
                </p>
                <p
                  style={{
                    margin: 0,
                    fontFamily: "'Cormorant Garamond',serif",
                    fontSize: 20,
                    fontWeight: 700,
                    color: "#C9A84C",
                  }}
                >
                  #{order.id}
                </p>
              </div>
            </div>

            {/* Meta strip — 4 cells */}
            <div
              className="meta-strip"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4,1fr)",
                borderTop: "1px solid #DDD0BE",
                borderLeft: "1px solid #DDD0BE",
              }}
            >
              {[
                { icon: Calendar, label: "Order Placed", value: order.placed },
                {
                  icon: Hash,
                  label: "Tracking No.",
                  value:
                    isConfirmed && shipment?.trackingNumber
                      ? shipment.trackingNumber
                      : "Pending",
                  gold: isConfirmed && !!shipment?.trackingNumber,
                },
                {
                  icon: Calendar,
                  label: "Est. Delivery",
                  value: isConfirmed
                    ? shipment?.estimatedDelivery ?? "TBD"
                    : "Awaiting Confirmation",
                },
                {
                  icon: Truck,
                  label: "Courier",
                  value: isConfirmed
                    ? shipment?.courierName ?? "TBD"
                    : "Not Assigned",
                },
              ].map((m, i) => (
                <div
                  className="meta-cell"
                  key={i}
                  style={{
                    padding: "13px 16px",
                    borderRight: "1px solid #DDD0BE",
                    borderBottom: "1px solid #DDD0BE",
                    background: "rgba(255,255,255,.45)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      marginBottom: 4,
                    }}
                  >
                    <m.icon size={11} color="#C9A84C" />
                    <span
                      style={{
                        fontSize: 9.5,
                        fontWeight: 700,
                        letterSpacing: ".16em",
                        textTransform: "uppercase",
                        color: "#A89272",
                      }}
                    >
                      {m.label}
                    </span>
                  </div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 12.5,
                      fontWeight: 700,
                      color: m.gold ? "#C9A84C" : "#1a1205",
                    }}
                  >
                    {m.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── BODY ── */}
        <div
          className="page-pad"
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "28px 24px 70px",
          }}
        >
          <button
            onClick={() => router.back()}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 13,
              color: "#a89272",
              background: "none",
              border: "none",
              cursor: "pointer",
              marginBottom: 24,
              fontWeight: 600,
              padding: 0,
              transition: "color .2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#1a1205")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#a89272")}
          >
            <ChevronLeft size={15} /> Back to My Orders
          </button>

          {/* ── Pending confirmation banner ── */}
          {!cancelled && !isConfirmed && (
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 12,
                padding: "16px 20px",
                marginBottom: 20,
                background: "rgba(37,99,235,.06)",
                border: "1.5px solid rgba(37,99,235,.2)",
                borderRadius: 14,
                animation: "riseUp .35s ease both",
              }}
            >
              <Clock3
                size={20}
                color="#2563eb"
                style={{ flexShrink: 0, marginTop: 1 }}
              />
              <div>
                <p
                  style={{
                    margin: "0 0 3px",
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#2563eb",
                  }}
                >
                  Waiting for Order Confirmation
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: 12.5,
                    color: "#6B8FCC",
                    lineHeight: 1.6,
                  }}
                >
                  Your order has been received. Our team will confirm and assign
                  shipment details shortly. Tracking information will appear
                  once the order is dispatched.
                </p>
              </div>
            </div>
          )}

          {/* ── Customer Details ── */}
          <div
            style={{
              marginBottom: 20,
              animation: "riseUp .38s ease .02s both",
            }}
          >
            <SectionLabel icon={MapPin} text="Customer Details" />
            <div
              style={{
                background: "#fff",
                borderRadius: 16,
                padding: "20px 24px",
                border: "1.5px solid #EDE5D8",
              }}
            >
              {/* Address type badge */}
              {customer?.type && (
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "3px 12px",
                    borderRadius: 99,
                    marginBottom: 16,
                    background: "rgba(201,168,76,.1)",
                    border: "1px solid rgba(201,168,76,.22)",
                  }}
                >
                  <AddrTypeIcon type={customer.type} />
                  <span
                    style={{
                      fontSize: 10.5,
                      fontWeight: 700,
                      color: "#C9A84C",
                      letterSpacing: ".12em",
                      textTransform: "uppercase",
                    }}
                  >
                    {customer.type} Address
                  </span>
                </div>
              )}

              {/* Info grid */}
              <div
                className="addr-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3,1fr)",
                  gap: "14px 24px",
                  marginBottom: 16,
                }}
              >
                {[
                  { label: "Full Name", value: customer?.fullName },
                  {
                    label: "Phone",
                    value: customer?.phone,
                    link: `tel:${customer?.phone}`,
                  },
                  {
                    label: "Email",
                    value: customer?.email,
                    link: `mailto:${customer?.email}`,
                  },
                  { label: "City", value: customer?.city },
                  { label: "State", value: customer?.state },
                  { label: "Pincode", value: customer?.pincode },
                ].map((f, i) => (
                  <div key={i}>
                    <p
                      style={{
                        margin: "0 0 2px",
                        fontSize: 10,
                        color: "#C4B49A",
                        fontWeight: 700,
                        letterSpacing: ".1em",
                        textTransform: "uppercase",
                      }}
                    >
                      {f.label}
                    </p>
                    {f.link ? (
                      <a
                        href={f.link}
                        style={{
                          fontSize: 13.5,
                          fontWeight: 700,
                          color: "#C9A84C",
                          textDecoration: "none",
                        }}
                      >
                        {f.value}
                      </a>
                    ) : (
                      <p
                        style={{
                          margin: 0,
                          fontSize: 13.5,
                          fontWeight: 600,
                          color: "#1a1205",
                        }}
                      >
                        {f.value}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Full address block */}
              <div
                style={{
                  padding: "12px 16px",
                  background: "#FDFAF6",
                  border: "1.5px solid #EDE5D8",
                  borderRadius: 12,
                }}
              >
                <p
                  style={{
                    margin: "0 0 4px",
                    fontSize: 10,
                    color: "#C4B49A",
                    fontWeight: 700,
                    letterSpacing: ".1em",
                    textTransform: "uppercase",
                  }}
                >
                  Full Address
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: 14,
                    fontWeight: 600,
                    color: "#1a1205",
                    lineHeight: 1.6,
                  }}
                >
                  {customer?.address}
                  {customer?.landmark && (
                    <span style={{ color: "#A89272", fontWeight: 500 }}>
                      {" "}
                      · Near {customer.landmark}
                    </span>
                  )}
                </p>
                <p
                  style={{
                    margin: "3px 0 0",
                    fontSize: 12.5,
                    color: "#A89272",
                  }}
                >
                  {customer?.city}, {customer?.state} – {customer?.pincode}
                </p>
              </div>
            </div>
          </div>

          {/* ── Products table ── */}
          <div
            style={{ marginBottom: 20, animation: "riseUp .4s ease .05s both" }}
          >
            <SectionLabel icon={ShoppingBag} text="Order Items" />
            <div
              style={{
                borderRadius: 14,
                overflow: "hidden",
                border: "1.5px solid #E8DDD0",
                background: "#fff",
              }}
            >
              <div
                className="prod-grid prod-grid-head"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 80px 60px 120px",
                  padding: "11px 22px",
                  background: "#F0EAE0",
                }}
              >
                {["Product", "Size", "Qty", "Price"].map((h) => (
                  <span
                    key={h}
                    style={{
                      fontSize: 10.5,
                      fontWeight: 800,
                      letterSpacing: ".16em",
                      color: "#7A6A50",
                      textTransform: "uppercase",
                      textAlign: h === "Price" ? "right" : "left",
                    }}
                  >
                    {h}
                  </span>
                ))}
              </div>

              {order.products.map((p, i) => (
                <div
                  key={p.id}
                  className="prod-row prod-grid"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 80px 60px 120px",
                    alignItems: "center",
                    padding: "16px 22px",
                    borderBottom:
                      i < order.products.length - 1
                        ? "1px solid #F7F3EE"
                        : "none",
                    background: "transparent",
                    transition: "background .15s",
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 14 }}
                  >
                    <img
                      src={p.image}
                      alt={p.name}
                      style={{
                        width: 56,
                        height: 64,
                        borderRadius: 11,
                        objectFit: "cover",
                        border: "1.5px solid #EDE5D8",
                        flexShrink: 0,
                      }}
                    />
                    <div style={{ minWidth: 0 }}>
                      <p
                        style={{
                          margin: "0 0 3px",
                          fontSize: 14,
                          fontWeight: 700,
                          color: "#1a1205",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {p.name}
                      </p>
                      <p
                        style={{
                          margin: "0 0 7px",
                          fontSize: 12,
                          color: "#A89272",
                        }}
                      >
                        {p.brand}
                      </p>
                      <Chip status={cancelled ? "Cancelled" : p.status} />
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: 13.5,
                      fontWeight: 600,
                      color: "#5a4a35",
                    }}
                  >
                    {p.size}
                  </span>
                  <span
                    style={{
                      fontSize: 13.5,
                      fontWeight: 600,
                      color: "#5a4a35",
                    }}
                  >
                    ×{p.qty}
                  </span>
                  <span
                    style={{
                      textAlign: "right",
                      fontFamily: "'Cormorant Garamond',serif",
                      fontSize: 20,
                      fontWeight: 700,
                      color: "#1a1205",
                    }}
                  >
                    ₹{p.price.toLocaleString("en-IN")}
                  </span>
                </div>
              ))}

              <div
                className="total-row"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "16px 22px",
                  background: "#FDF9F0",
                  borderTop: "2px dashed #E8DDD0",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <CreditCard size={14} color="#C9A84C" />
                  <span
                    style={{ fontSize: 13, color: "#5a4a35", fontWeight: 600 }}
                  >
                    Card ···· {order.card}
                  </span>
                  <span
                    style={{ fontSize: 13, color: "#16a34a", fontWeight: 700 }}
                  >
                    · Paid ✓
                  </span>
                </div>
                <div
                  style={{ display: "flex", alignItems: "baseline", gap: 10 }}
                >
                  <span
                    style={{
                      fontSize: 12,
                      color: "#A89272",
                      fontWeight: 600,
                      letterSpacing: ".1em",
                      textTransform: "uppercase",
                    }}
                  >
                    Total
                  </span>
                  <span
                    style={{
                      fontFamily: "'Cormorant Garamond',serif",
                      fontSize: 28,
                      fontWeight: 700,
                      color: "#C9A84C",
                    }}
                  >
                    ₹{order.total.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Delivery + Shipment ── */}
          <div
            className="two-col"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 20,
              marginBottom: 20,
              animation: "riseUp .4s ease .1s both",
            }}
          >
            {/* Delivery Details */}
            <div
              style={{
                background: "#fff",
                borderRadius: 16,
                padding: "22px 24px",
                border: "1.5px solid #EDE5D8",
              }}
            >
              <SectionLabel icon={MapPin} text="Delivery Details" />
              {[
                ["Recipient", customerName, true],
                [
                  "Address",
                  customer?.deliveryAddress ?? customer?.address,
                  false,
                ],
                ["City/State", `${customer?.city}, ${customer?.state}`, false],
                ["Pincode", customer?.pincode, false],
                [
                  "Arriving",
                  isConfirmed
                    ? shipment?.estimatedArrival ?? "TBD"
                    : "Pending confirmation",
                  true,
                ],
              ].map(([label, val, bold], i, arr) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    paddingBottom: 11,
                    marginBottom: 11,
                    borderBottom:
                      i < arr.length - 1 ? "1px solid #F7F3EE" : "none",
                  }}
                >
                  <span
                    style={{
                      fontSize: 12,
                      color: "#B8A88A",
                      fontWeight: 600,
                      minWidth: 90,
                      flexShrink: 0,
                    }}
                  >
                    {label}
                  </span>
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: bold ? 700 : 600,
                      color: "#1a1205",
                      flex: 1,
                    }}
                  >
                    {val || "—"}
                  </span>
                </div>
              ))}
            </div>

            {/* Shipment Info */}
            <div
              style={{
                background: "#fff",
                borderRadius: 16,
                padding: "22px 24px",
                border: "1.5px solid #EDE5D8",
              }}
            >
              <SectionLabel icon={Truck} text="Shipment Info" />

              {isConfirmed ? (
                [
                  ["Tracking", shipment?.trackingNumber, "gold"],
                  ["Service", shipment?.courierService, false],
                  ["Courier", shipment?.courierName, false],
                  ["Method", shipment?.shippingMethod, false],
                  ["Ship Date", shipment?.shipmentDate, false],
                  ["ETA", shipment?.estimatedArrival, true],
                ].map(([label, val, style], i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      paddingBottom: 11,
                      marginBottom: 11,
                      borderBottom: i < 5 ? "1px solid #F7F3EE" : "none",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 12,
                        color: "#B8A88A",
                        fontWeight: 600,
                        minWidth: 90,
                        flexShrink: 0,
                      }}
                    >
                      {label}
                    </span>
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: style ? 700 : 600,
                        color: style === "gold" ? "#C9A84C" : "#1a1205",
                        flex: 1,
                      }}
                    >
                      {val || "—"}
                    </span>
                  </div>
                ))
              ) : (
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 10,
                    padding: "14px 16px",
                    background: "rgba(37,99,235,.05)",
                    border: "1px solid rgba(37,99,235,.15)",
                    borderRadius: 12,
                  }}
                >
                  <Clock3
                    size={16}
                    color="#2563eb"
                    style={{ flexShrink: 0, marginTop: 1 }}
                  />
                  <div>
                    <p
                      style={{
                        margin: "0 0 3px",
                        fontSize: 13.5,
                        fontWeight: 700,
                        color: "#2563eb",
                      }}
                    >
                      Shipment details not yet available
                    </p>
                    <p
                      style={{
                        margin: 0,
                        fontSize: 12,
                        color: "#6B8FCC",
                        lineHeight: 1.6,
                      }}
                    >
                      Our team will update courier and tracking information once
                      your order is confirmed and dispatched.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── Help + Actions ── */}
          <div
            className="help-row"
            style={{
              background: "#fff",
              borderRadius: 16,
              border: "1.5px solid #EDE5D8",
              padding: "20px 24px",
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 18,
              animation: "riseUp .4s ease .15s both",
            }}
          >
            <div>
              <p
                style={{
                  margin: "0 0 12px",
                  fontSize: 11,
                  fontWeight: 800,
                  letterSpacing: ".18em",
                  textTransform: "uppercase",
                  color: "#7A6A50",
                }}
              >
                Need Help?
              </p>
              <div style={{ display: "flex", gap: 22, flexWrap: "wrap" }}>
                <a
                  href="tel:+910000000000"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    textDecoration: "none",
                    color: "#5a4a35",
                    fontSize: 13.5,
                    fontWeight: 600,
                  }}
                >
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: "50%",
                      background: "#FDF9F0",
                      border: "1.5px solid rgba(201,168,76,.3)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Phone size={14} color="#C9A84C" />
                  </div>
                  +91 0000 000 000
                </a>
                <a
                  href="mailto:support@banishq.com"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    textDecoration: "none",
                    color: "#5a4a35",
                    fontSize: 13.5,
                    fontWeight: 600,
                  }}
                >
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: "50%",
                      background: "#FDF9F0",
                      border: "1.5px solid rgba(201,168,76,.3)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Mail size={14} color="#C9A84C" />
                  </div>
                  support@banishq.com
                </a>
              </div>
            </div>

            <div
              className="action-row"
              style={{ display: "flex", gap: 12, flexWrap: "wrap" }}
            >
              {!cancelled ? (
                <>
                  {isConfirmed && (
                    <button
                      onClick={() => router.push(`/track-order/${order.id}`)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "13px 24px",
                        borderRadius: 12,
                        border: "none",
                        background: "linear-gradient(120deg,#1a1205,#3a2408)",
                        color: "#f5ede0",
                        fontSize: 13.5,
                        fontWeight: 700,
                        cursor: "pointer",
                        boxShadow: "0 5px 20px rgba(26,18,5,.22)",
                        transition: "transform .2s, box-shadow .2s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow =
                          "0 8px 24px rgba(26,18,5,.3)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow =
                          "0 5px 20px rgba(26,18,5,.22)";
                      }}
                    >
                      <MapPin size={14} /> Track Order <ArrowRight size={13} />
                    </button>
                  )}
                  <button
                    onClick={() => setShowCancel(true)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 7,
                      padding: "13px 22px",
                      borderRadius: 12,
                      border: "1.5px solid #FECACA",
                      background: "#FFF1F1",
                      color: "#dc2626",
                      fontSize: 13.5,
                      fontWeight: 700,
                      cursor: "pointer",
                      transition: "background .2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#FEE2E2")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "#FFF1F1")
                    }
                  >
                    <X size={13} /> Cancel Order
                  </button>
                </>
              ) : (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 7,
                    padding: "13px 20px",
                    borderRadius: 12,
                    background: "#FFF1F1",
                    border: "1.5px solid #FECACA",
                    color: "#dc2626",
                    fontSize: 13,
                    fontWeight: 700,
                  }}
                >
                  <X size={13} /> Cancelled — Refund Processing
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
