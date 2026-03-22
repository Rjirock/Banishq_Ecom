// app/admin/pages/OrdersPage.jsx
"use client";

import { useState } from "react";
import {
  ShoppingBag, Search, Eye, Phone, Mail, Truck,
  Save, FileText, X, Package, MapPin, Hash,
  Calendar, CheckCircle2, Clock, AlertCircle,
  ChevronDown, ChevronUp, User, CreditCard,
} from "lucide-react";
import { SectionTitle, Badge, GoldBtn, ModalShell } from "../components/AdminUI";
import { C, labelStyle, inputStyle } from "../data/theme";
import {
  STATUS_STYLES, PAYMENT_STYLES,
  ORDER_STATUSES, PAYMENT_STATUSES,
} from "../data/orders.data";

/* ── Courier service options ── */
const COURIER_SERVICES = [
  "Blue Dart Express",
  "DTDC Courier",
  "Delhivery",
  "Ekart Logistics",
  "Amazon Logistics",
  "FedEx India",
  "Xpressbees",
  "Shadowfax",
  "Dunzo",
  "Other",
];

const SHIPPING_METHODS = [
  "Standard Delivery (3–5 days)",
  "Express Delivery (1–2 days)",
  "Same Day Delivery",
  "Next Day Delivery",
  "Economy Delivery (7–10 days)",
];

/* ── Print invoice ── */
function printInvoice(order, shipment) {
  const w = window.open("", "_blank");
  w.document.write(`
    <!DOCTYPE html><html><head>
      <title>Invoice ${order.id} — BANISHQ</title>
      <style>
        body{font-family:Georgia,serif;padding:48px;max-width:640px;margin:0 auto;color:#1a1205}
        .brand{font-size:30px;color:#C9A84C;border-bottom:2px solid #C9A84C;padding-bottom:12px;margin-bottom:24px;letter-spacing:.08em}
        .meta{display:flex;justify-content:space-between;margin-bottom:28px;font-size:13px;color:#666}
        h3{font-size:13px;letter-spacing:.12em;text-transform:uppercase;color:#C9A84C;margin:20px 0 8px}
        .row{display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #eee;font-size:14px}
        .total{font-size:18px;font-weight:bold;color:#C9A84C;padding-top:14px}
        .badge{display:inline-block;padding:3px 12px;border-radius:99px;font-size:11px;font-weight:bold}
        .footer{margin-top:40px;font-size:11px;color:#aaa;line-height:1.7}
      </style>
    </head><body>
      <div class="brand">BANISHQ</div>
      <div class="meta">
        <div><strong>Invoice:</strong> INV-${order.id}<br/><strong>Date:</strong> ${order.date}</div>
        <div style="text-align:right">
          <span class="badge" style="background:#d4f0de;color:#166534">${order.payment}</span><br/>
          <span class="badge" style="background:#dbeafe;color:#1e40af;margin-top:4px">${order.status}</span>
        </div>
      </div>
      <h3>Customer</h3>
      <p style="margin:0;font-size:15px;font-weight:bold">${order.customer}</p>
      <p style="margin:4px 0;font-size:13px;color:#555">${order.phone} · ${order.email}</p>
      <p style="margin:4px 0;font-size:13px;color:#555">${order.address}</p>
      ${shipment?.trackingNumber ? `
        <h3>Shipment</h3>
        <p style="font-size:13px;color:#555;margin:4px 0">Tracking: <strong>${shipment.trackingNumber}</strong></p>
        <p style="font-size:13px;color:#555;margin:4px 0">Courier: ${shipment.courierService} — ${shipment.courierName}</p>
        <p style="font-size:13px;color:#555;margin:4px 0">Method: ${shipment.shippingMethod}</p>
        <p style="font-size:13px;color:#555;margin:4px 0">Expected: ${shipment.estimatedDelivery}</p>
      ` : ""}
      <h3>Order</h3>
      <div class="row"><span style="font-weight:600">${order.product}</span><span>₹${order.amount.toLocaleString("en-IN")}</span></div>
      <div class="row"><span>Shipping</span><span style="color:#22c55e">FREE</span></div>
      <div class="row total"><span>Total</span><span>₹${order.amount.toLocaleString("en-IN")}</span></div>
      <div class="footer">Thank you for shopping with BANISHQ.<br/>support@banishq.com | +91 00000 00000</div>
    </body></html>
  `);
  w.document.close();
  w.print();
}

/* ────────────────────────────────────────────────────
   FIELD COMPONENT
──────────────────────────────────────────────────── */
function Field({ label, children, required }) {
  return (
    <div>
      <label style={{
        ...labelStyle,
        display: "flex", alignItems: "center", gap: 4,
      }}>
        {label}
        {required && <span style={{ color: C.red, fontSize: 10 }}>*</span>}
      </label>
      {children}
    </div>
  );
}

/* ────────────────────────────────────────────────────
   ORDER MODAL — full details + shipment form
──────────────────────────────────────────────────── */
function OrderModal({ order, onClose, onSave }) {
  const [activeTab, setActiveTab]   = useState("overview");

  // Order status fields
  const [status,  setStatus]  = useState(order.status);
  const [payment, setPayment] = useState(order.payment);

  // Shipment fields (pre-populate if order already has shipment data)
  const existing = order.shipmentData ?? {};
  const [confirmed,         setConfirmed]         = useState(existing.adminConfirmed ?? false);
  const [trackingNumber,    setTrackingNumber]    = useState(existing.trackingNumber ?? "");
  const [courierName,       setCourierName]       = useState(existing.courierName ?? "");
  const [courierPhone,      setCourierPhone]      = useState(existing.courierPhone ?? "");
  const [courierService,    setCourierService]    = useState(existing.courierService ?? "");
  const [shippingMethod,    setShippingMethod]    = useState(existing.shippingMethod ?? "");
  const [shipmentDate,      setShipmentDate]      = useState(existing.shipmentDate ?? "");
  const [estimatedArrival,  setEstimatedArrival]  = useState(existing.estimatedArrival ?? "");
  const [estimatedDelivery, setEstimatedDelivery] = useState(existing.estimatedDelivery ?? "");
  const [saved, setSaved] = useState(false);

  const shipmentData = {
    adminConfirmed:    confirmed,
    trackingNumber,
    courierName,
    courierPhone,
    courierService,
    shippingMethod,
    shipmentDate,
    estimatedArrival,
    estimatedDelivery,
  };

  const handleSave = () => {
    onSave(order.id, status, payment, shipmentData);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const ss = STATUS_STYLES[status];
  const ps = PAYMENT_STYLES[payment];

  const TABS = [
    { id: "overview",  label: "Overview",  icon: Eye       },
    { id: "shipment",  label: "Shipment",  icon: Truck     },
    { id: "customer",  label: "Customer",  icon: User      },
  ];

  return (
    <ModalShell title="Order Details" subtitle={`#${order.id}`} onClose={onClose} maxWidth={680}>

      {/* ── Tab nav ── */}
      <div style={{
        display: "flex", gap: 4, marginBottom: 20,
        background: C.bg, borderRadius: 12, padding: 4,
      }}>
        {TABS.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
            flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            padding: "9px 12px", borderRadius: 9, border: "none", cursor: "pointer",
            fontSize: 12.5, fontWeight: 700, transition: "all .2s",
            background: activeTab === tab.id ? C.surface : "transparent",
            color: activeTab === tab.id ? C.gold : C.muted,
            boxShadow: activeTab === tab.id ? `0 1px 6px ${C.shadow}` : "none",
          }}>
            <tab.icon size={13} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* ═══════════════════════════════
          TAB: OVERVIEW
      ═══════════════════════════════ */}
      {activeTab === "overview" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Product card */}
          <div style={{
            display: "flex", gap: 14, padding: 16,
            background: C.card, borderRadius: 14, border: `1px solid ${C.border}`,
          }}>
            <img src={order.image} alt={order.product} style={{
              width: 72, height: 72, borderRadius: 10, objectFit: "cover", flexShrink: 0,
              border: `1px solid ${C.border}`,
            }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: "0 0 3px", fontWeight: 700, color: C.text, fontSize: 15 }}>
                {order.product}
              </p>
              <p style={{ margin: "0 0 10px", color: C.muted, fontSize: 12 }}>{order.category}</p>
              <p style={{ margin: 0, fontFamily: "'Cormorant Garamond',serif",
                fontSize: 24, fontWeight: 700, color: C.gold }}>
                ₹{order.amount.toLocaleString("en-IN")}
              </p>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <p style={{ margin: "0 0 4px", fontSize: 10.5, color: C.dim, fontWeight: 600,
                letterSpacing: ".1em", textTransform: "uppercase" }}>Date</p>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: C.text }}>{order.date}</p>
            </div>
          </div>

          {/* Status editors */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div>
              <Field label="Order Status" required>
                <select value={status} onChange={e => setStatus(e.target.value)}
                  style={{ ...inputStyle, cursor: "pointer" }}>
                  {ORDER_STATUSES.map(s => <option key={s}>{s}</option>)}
                </select>
              </Field>
              {ss && <div style={{ marginTop: 6 }}><Badge label={status} bg={ss.bg} color={ss.color} /></div>}
            </div>
            <div>
              <Field label="Payment Status" required>
                <select value={payment} onChange={e => setPayment(e.target.value)}
                  style={{ ...inputStyle, cursor: "pointer" }}>
                  {PAYMENT_STATUSES.map(p => <option key={p}>{p}</option>)}
                </select>
              </Field>
              {ps && <div style={{ marginTop: 6 }}><Badge label={payment} bg={ps.bg} color={ps.color} /></div>}
            </div>
          </div>

          {/* Shipment confirmed toggle */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "14px 16px", borderRadius: 12,
            background: confirmed ? "rgba(22,163,74,.08)" : "rgba(37,99,235,.06)",
            border: `1.5px solid ${confirmed ? "rgba(22,163,74,.2)" : "rgba(37,99,235,.18)"}`,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {confirmed
                ? <CheckCircle2 size={18} color={C.green} />
                : <Clock size={18} color={C.blue} />
              }
              <div>
                <p style={{ margin: 0, fontSize: 13.5, fontWeight: 700,
                  color: confirmed ? C.green : C.blue }}>
                  {confirmed ? "Order Confirmed & Dispatched" : "Awaiting Confirmation"}
                </p>
                <p style={{ margin: 0, fontSize: 11.5, color: C.muted }}>
                  {confirmed
                    ? "Customer can see shipment details and track order"
                    : "Customer sees pending state — fill Shipment tab to confirm"}
                </p>
              </div>
            </div>
            {/* Toggle switch */}
            <button onClick={() => setConfirmed(v => !v)} style={{
              width: 46, height: 26, borderRadius: 99, border: "none",
              cursor: "pointer", position: "relative", flexShrink: 0,
              background: confirmed ? C.green : C.border,
              transition: "background .25s",
            }}>
              <div style={{
                width: 20, height: 20, borderRadius: "50%", background: "#fff",
                position: "absolute", top: 3,
                left: confirmed ? 23 : 3,
                transition: "left .25s",
                boxShadow: "0 1px 4px rgba(0,0,0,.2)",
              }} />
            </button>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", paddingTop: 4 }}>
            <GoldBtn onClick={handleSave}>
              {saved
                ? <><CheckCircle2 size={13}/> Saved!</>
                : <><Save size={13}/> Save Changes</>
              }
            </GoldBtn>
            <GoldBtn outline onClick={() => printInvoice(order, shipmentData)}>
              <FileText size={13} /> Print Invoice
            </GoldBtn>
            <GoldBtn outline onClick={() => window.open(`tel:${order.phone}`)}>
              <Phone size={13} /> Call Customer
            </GoldBtn>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════
          TAB: SHIPMENT
      ═══════════════════════════════ */}
      {activeTab === "shipment" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Status banner */}
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "12px 16px", borderRadius: 12,
            background: confirmed ? "rgba(22,163,74,.08)" : "rgba(234,179,8,.08)",
            border: `1px solid ${confirmed ? "rgba(22,163,74,.2)" : "rgba(234,179,8,.25)"}`,
          }}>
            {confirmed
              ? <CheckCircle2 size={16} color={C.green} />
              : <AlertCircle size={16} color="#ca8a04" />
            }
            <p style={{ margin: 0, fontSize: 13, fontWeight: 700,
              color: confirmed ? C.green : "#854d0e" }}>
              {confirmed
                ? "Shipment confirmed — details visible to customer"
                : "Fill details below and toggle Confirm in Overview tab to make visible to customer"}
            </p>
          </div>

          {/* Tracking Number */}
          <Field label="Tracking Number" required>
            <div style={{ position: "relative" }}>
              <Hash size={14} color={C.dim} style={{
                position: "absolute", left: 12, top: "50%",
                transform: "translateY(-50%)", pointerEvents: "none",
              }} />
              <input
                value={trackingNumber}
                onChange={e => setTrackingNumber(e.target.value)}
                placeholder="e.g. BNQ782340387234"
                style={{ ...inputStyle, paddingLeft: 36 }}
              />
            </div>
          </Field>

          {/* Courier Service + Name */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Field label="Courier Service">
              <select value={courierService} onChange={e => setCourierService(e.target.value)}
                style={{ ...inputStyle, cursor: "pointer" }}>
                <option value="">Select service…</option>
                {COURIER_SERVICES.map(s => <option key={s}>{s}</option>)}
              </select>
            </Field>
            <Field label="Courier Person Name">
              <div style={{ position: "relative" }}>
                <User size={14} color={C.dim} style={{
                  position: "absolute", left: 12, top: "50%",
                  transform: "translateY(-50%)", pointerEvents: "none",
                }} />
                <input
                  value={courierName}
                  onChange={e => setCourierName(e.target.value)}
                  placeholder="e.g. Rajesh Kumar"
                  style={{ ...inputStyle, paddingLeft: 36 }}
                />
              </div>
            </Field>
          </div>

          {/* Courier Phone + Shipping Method */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Field label="Courier Phone">
              <div style={{ position: "relative" }}>
                <Phone size={14} color={C.dim} style={{
                  position: "absolute", left: 12, top: "50%",
                  transform: "translateY(-50%)", pointerEvents: "none",
                }} />
                <input
                  value={courierPhone}
                  onChange={e => setCourierPhone(e.target.value)}
                  placeholder="+91 90000 12345"
                  style={{ ...inputStyle, paddingLeft: 36 }}
                />
              </div>
            </Field>
            <Field label="Shipping Method">
              <select value={shippingMethod} onChange={e => setShippingMethod(e.target.value)}
                style={{ ...inputStyle, cursor: "pointer" }}>
                <option value="">Select method…</option>
                {SHIPPING_METHODS.map(m => <option key={m}>{m}</option>)}
              </select>
            </Field>
          </div>

          {/* Dates */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
            <Field label="Ship Date">
              <div style={{ position: "relative" }}>
                <Calendar size={14} color={C.dim} style={{
                  position: "absolute", left: 12, top: "50%",
                  transform: "translateY(-50%)", pointerEvents: "none",
                }} />
                <input
                  type="date"
                  value={shipmentDate}
                  onChange={e => setShipmentDate(e.target.value)}
                  style={{ ...inputStyle, paddingLeft: 36 }}
                />
              </div>
            </Field>
            <Field label="Estimated Arrival">
              <div style={{ position: "relative" }}>
                <Calendar size={14} color={C.dim} style={{
                  position: "absolute", left: 12, top: "50%",
                  transform: "translateY(-50%)", pointerEvents: "none",
                }} />
                <input
                  type="date"
                  value={estimatedArrival}
                  onChange={e => setEstimatedArrival(e.target.value)}
                  style={{ ...inputStyle, paddingLeft: 36 }}
                />
              </div>
            </Field>
            <Field label="Delivery Slot (shown to customer)">
              <input
                value={estimatedDelivery}
                onChange={e => setEstimatedDelivery(e.target.value)}
                placeholder="e.g. 26 March, Wed at 4PM"
                style={inputStyle}
              />
            </Field>
          </div>

          {/* Live preview */}
          {trackingNumber && (
            <div style={{
              padding: "14px 16px", borderRadius: 13,
              background: C.goldBg, border: `1px solid rgba(201,168,76,.25)`,
            }}>
              <p style={{ margin: "0 0 10px", fontSize: 10.5, fontWeight: 700,
                letterSpacing: ".16em", textTransform: "uppercase", color: C.gold }}>
                Preview — What customer will see
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 16px" }}>
                {[
                  ["Tracking No",    trackingNumber    || "—"],
                  ["Courier",        courierService    || "—"],
                  ["Person",         courierName       || "—"],
                  ["Phone",          courierPhone      || "—"],
                  ["Method",         shippingMethod    || "—"],
                  ["Ships On",       shipmentDate      || "—"],
                  ["Arrives",        estimatedArrival  || "—"],
                  ["Delivery Slot",  estimatedDelivery || "—"],
                ].map(([label, value]) => (
                  <div key={label} style={{ display: "flex", gap: 6 }}>
                    <span style={{ fontSize: 11.5, color: C.dim, minWidth: 90, flexShrink: 0 }}>
                      {label}:
                    </span>
                    <span style={{ fontSize: 11.5, fontWeight: 700, color: C.text }}>
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Save */}
          <div style={{ display: "flex", gap: 10 }}>
            <GoldBtn onClick={handleSave}>
              {saved
                ? <><CheckCircle2 size={13}/> Saved!</>
                : <><Save size={13}/> Save Shipment Details</>
              }
            </GoldBtn>
            <GoldBtn outline onClick={() => printInvoice(order, shipmentData)}>
              <FileText size={13}/> Print Invoice
            </GoldBtn>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════
          TAB: CUSTOMER
      ═══════════════════════════════ */}
      {activeTab === "customer" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

          {/* Customer name + avatar */}
          <div style={{
            display: "flex", alignItems: "center", gap: 14,
            padding: "16px 18px", background: C.card,
            borderRadius: 14, border: `1px solid ${C.border}`,
          }}>
            <div style={{
              width: 48, height: 48, borderRadius: "50%", flexShrink: 0,
              background: `linear-gradient(135deg, ${C.gold}, ${C.goldLight})`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 16, fontWeight: 800, color: "#1a1205",
              boxShadow: `0 3px 10px rgba(201,168,76,.3)`,
            }}>
              {order.customer.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase()}
            </div>
            <div>
              <p style={{ margin: 0, fontFamily: "'Cormorant Garamond',serif",
                fontSize: 20, fontWeight: 700, color: C.text }}>
                {order.customer}
              </p>
              <p style={{ margin: 0, fontSize: 12, color: C.muted }}>Customer</p>
            </div>
          </div>

          {/* Contact info */}
          <div style={{
            padding: "16px 18px", background: C.card,
            borderRadius: 14, border: `1px solid ${C.border}`,
          }}>
            <p style={{ margin: "0 0 14px", fontSize: 10.5, fontWeight: 700,
              letterSpacing: ".16em", textTransform: "uppercase", color: C.gold }}>
              Contact
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <a href={`tel:${order.phone}`} style={{
                display: "flex", alignItems: "center", gap: 10,
                color: C.text, fontSize: 14, fontWeight: 600, textDecoration: "none",
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: "50%",
                  background: C.goldBg, border: `1px solid rgba(201,168,76,.25)`,
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <Phone size={13} color={C.gold} />
                </div>
                {order.phone}
              </a>
              <a href={`mailto:${order.email}`} style={{
                display: "flex", alignItems: "center", gap: 10,
                color: C.text, fontSize: 14, fontWeight: 600, textDecoration: "none",
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: "50%",
                  background: C.goldBg, border: `1px solid rgba(201,168,76,.25)`,
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <Mail size={13} color={C.gold} />
                </div>
                {order.email}
              </a>
            </div>
          </div>

          {/* Address */}
          <div style={{
            padding: "16px 18px", background: C.card,
            borderRadius: 14, border: `1px solid ${C.border}`,
          }}>
            <p style={{ margin: "0 0 10px", fontSize: 10.5, fontWeight: 700,
              letterSpacing: ".16em", textTransform: "uppercase", color: C.gold }}>
              Delivery Address
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <MapPin size={14} color={C.gold} style={{ flexShrink: 0, marginTop: 2 }} />
              <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: C.text, lineHeight: 1.65 }}>
                {order.address}
              </p>
            </div>
          </div>

          {/* Payment */}
          <div style={{
            padding: "14px 18px", background: C.card,
            borderRadius: 14, border: `1px solid ${C.border}`,
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <CreditCard size={14} color={C.gold} />
              <span style={{ fontSize: 13.5, fontWeight: 600, color: C.text }}>
                Order Amount
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontFamily: "'Cormorant Garamond',serif",
                fontSize: 22, fontWeight: 700, color: C.gold }}>
                ₹{order.amount.toLocaleString("en-IN")}
              </span>
              {ps && <Badge label={payment} bg={ps.bg} color={ps.color} />}
            </div>
          </div>

          {/* Quick actions */}
          <div style={{ display: "flex", gap: 10 }}>
            <GoldBtn onClick={() => window.open(`tel:${order.phone}`)}>
              <Phone size={13}/> Call Now
            </GoldBtn>
            <GoldBtn outline onClick={() => window.open(`mailto:${order.email}`)}>
              <Mail size={13}/> Send Email
            </GoldBtn>
          </div>
        </div>
      )}

    </ModalShell>
  );
}

/* ────────────────────────────────────────────────────
   MAIN ORDERS PAGE
──────────────────────────────────────────────────── */
export default function OrdersPage({ orders, onUpdateOrder }) {
  const [selected, setSelected] = useState(null);
  const [filter,   setFilter]   = useState("All");
  const [search,   setSearch]   = useState("");

  const filtered = orders.filter(o =>
    (filter === "All" || o.status === filter) &&
    (
      o.customer.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.product.toLowerCase().includes(search.toLowerCase()) ||
      o.phone.includes(search)
    )
  );

  return (
    <div>
      <SectionTitle
        icon={ShoppingBag}
        title="Orders"
        subtitle="Manage, update, track, create shipments and invoice all customer orders"
      />

      {/* Toolbar */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 220 }}>
          <Search size={14} color={C.dim}
            style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search order ID, customer, product, phone…"
            style={{ ...inputStyle, paddingLeft: 36 }}
          />
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {["All", ...ORDER_STATUSES].map(s => (
            <button key={s} onClick={() => setFilter(s)} style={{
              padding: "7px 14px", borderRadius: 9, cursor: "pointer",
              fontSize: 12, fontWeight: 700, transition: "all .2s",
              background: filter === s ? C.gold : C.card,
              color: filter === s ? "#1a1205" : C.muted,
              border: `1px solid ${filter === s ? C.gold : C.border}`,
            }}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <p style={{ fontSize: 12, color: C.dim, marginBottom: 14 }}>
        Showing <strong style={{ color: C.text }}>{filtered.length}</strong> of{" "}
        <strong style={{ color: C.text }}>{orders.length}</strong> orders
      </p>

      {/* Table */}
      <div style={{
        background: C.surface, border: `1.5px solid ${C.border}`,
        borderRadius: 18, overflowX: "auto",
        boxShadow: `0 2px 12px ${C.shadow}`,
      }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: `1.5px solid ${C.border}`, background: C.goldBg }}>
              {["Order ID","Customer","Product","Amount","Status","Payment","Date","Actions"].map(h => (
                <th key={h} style={{
                  padding: "13px 16px", textAlign: "left",
                  color: C.muted, fontSize: 10.5, fontWeight: 700,
                  letterSpacing: ".12em", textTransform: "uppercase", whiteSpace: "nowrap",
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((o, idx) => {
              const ss = STATUS_STYLES[o.status];
              const ps = PAYMENT_STYLES[o.payment];
              const hasShipment = !!o.shipmentData?.trackingNumber;
              return (
                <tr key={o.id}
                  style={{
                    borderBottom: idx < filtered.length - 1 ? `1px solid ${C.border}` : "none",
                    transition: "background .15s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = C.goldBg}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                      <span style={{ color: C.gold, fontWeight: 800, fontSize: 12 }}>{o.id}</span>
                      {hasShipment && (
                        <span style={{
                          fontSize: 9.5, fontWeight: 700, color: C.green,
                          background: "rgba(22,163,74,.1)", padding: "1px 6px",
                          borderRadius: 99, border: "1px solid rgba(22,163,74,.2)",
                        }}>SHIPPED</span>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <p style={{ margin: 0, color: C.text, fontWeight: 600, fontSize: 13 }}>{o.customer}</p>
                    <p style={{ margin: 0, color: C.dim, fontSize: 11 }}>{o.phone}</p>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <img src={o.image} alt="" style={{
                        width: 36, height: 36, borderRadius: 8, objectFit: "cover",
                        flexShrink: 0, border: `1px solid ${C.border}`,
                      }} />
                      <div>
                        <p style={{ margin: 0, color: C.text, fontSize: 12.5, maxWidth: 150,
                          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {o.product}
                        </p>
                        <p style={{ margin: 0, color: C.dim, fontSize: 11 }}>{o.category}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <span style={{ fontFamily: "'Cormorant Garamond',serif",
                      fontSize: 17, fontWeight: 700, color: C.text }}>
                      ₹{o.amount.toLocaleString("en-IN")}
                    </span>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    {ss && <Badge label={o.status} bg={ss.bg} color={ss.color} />}
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    {ps && <Badge label={o.payment} bg={ps.bg} color={ps.color} />}
                  </td>
                  <td style={{ padding: "14px 16px", color: C.dim, fontSize: 12 }}>{o.date}</td>
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button onClick={() => setSelected(o)} title="View & Edit"
                        style={{
                          width: 30, height: 30, borderRadius: 8,
                          border: `1px solid ${C.border}`, background: "none",
                          cursor: "pointer", color: C.gold,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          transition: "background .15s",
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = `rgba(201,168,76,.12)`}
                        onMouseLeave={e => e.currentTarget.style.background = "none"}
                      >
                        <Eye size={13} />
                      </button>
                      <a href={`tel:${o.phone}`} title="Call customer"
                        style={{
                          width: 30, height: 30, borderRadius: 8,
                          border: `1px solid ${C.border}`, background: "none",
                          cursor: "pointer", color: C.green, textDecoration: "none",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          transition: "background .15s",
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = "rgba(22,163,74,.1)"}
                        onMouseLeave={e => e.currentTarget.style.background = "none"}
                      >
                        <Phone size={13} />
                      </a>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div style={{ padding: "52px 0", textAlign: "center" }}>
            <Package size={36} color={C.border} style={{ marginBottom: 10 }} />
            <p style={{ color: C.muted, fontSize: 14 }}>No orders match your filter.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {selected && (
        <OrderModal
          order={selected}
          onClose={() => setSelected(null)}
          onSave={(id, status, payment, shipmentData) => {
            onUpdateOrder(id, status, payment, shipmentData);
            // Update the selected order so modal reflects saved state
            setSelected(prev => prev ? { ...prev, status, payment, shipmentData } : null);
          }}
        />
      )}
    </div>
  );
}