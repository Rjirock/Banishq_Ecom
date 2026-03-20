// app/admin/pages/OrdersPage.jsx
"use client";

import { useState } from "react";
import {
  ShoppingBag, Search, Eye, Edit2, Phone,
  Mail, Truck, Save, FileText, X,
} from "lucide-react";
import {
  SectionTitle, Badge, GoldBtn, ModalShell, inputStyle,
} from "../components/AdminUI";
import { C, labelStyle } from "../data/theme";
import {
  STATUS_STYLES, PAYMENT_STYLES,
  ORDER_STATUSES, PAYMENT_STATUSES,
} from "../data/orders.data";

/* ── Invoice generator (runs in browser) ── */
function printInvoice(order) {
  const w = window.open("", "_blank");
  w.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Invoice ${order.id} — BANISHQ</title>
      <style>
        body { font-family: Georgia, serif; padding: 48px; max-width: 640px; margin: 0 auto; color: #1a1205; }
        .brand { font-size: 30px; color: #C9A84C; border-bottom: 2px solid #C9A84C; padding-bottom: 12px; margin-bottom: 24px; letter-spacing: .08em; }
        .meta { display: flex; justify-content: space-between; margin-bottom: 28px; font-size: 13px; color: #666; }
        h3 { font-size: 14px; letter-spacing: .12em; text-transform: uppercase; color: #C9A84C; margin: 20px 0 8px; }
        .row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; font-size: 14px; }
        .total { font-size: 18px; font-weight: bold; color: #C9A84C; padding-top: 14px; }
        .badge { display: inline-block; padding: 3px 12px; border-radius: 99px; font-size: 11px; font-weight: bold; }
        .footer { margin-top: 40px; font-size: 11px; color: #aaa; line-height: 1.7; }
      </style>
    </head>
    <body>
      <div class="brand">BANISHQ</div>
      <div class="meta">
        <div><strong>Invoice No:</strong> INV-${order.id}<br/><strong>Date:</strong> ${order.date}</div>
        <div style="text-align:right">
          <span class="badge" style="background:#d4f0de;color:#166534">${order.payment}</span><br/>
          <span class="badge" style="background:#dbeafe;color:#1e40af;margin-top:4px">${order.status}</span>
        </div>
      </div>
      <h3>Customer Details</h3>
      <p style="margin:0;font-size:15px;font-weight:bold">${order.customer}</p>
      <p style="margin:4px 0;font-size:13px;color:#555">${order.phone} · ${order.email}</p>
      <p style="margin:4px 0;font-size:13px;color:#555">${order.address}</p>
      <h3>Order Details</h3>
      <div class="row"><span style="font-weight:600">${order.product}</span><span>₹${order.amount.toLocaleString("en-IN")}</span></div>
      <div class="row"><span>Shipping</span><span style="color:#22c55e">FREE</span></div>
      <div class="row"><span>Tax (GST included)</span><span>—</span></div>
      <div class="row total"><span>Total Payable</span><span>₹${order.amount.toLocaleString("en-IN")}</span></div>
      <div class="footer">
        Thank you for shopping with BANISHQ.<br/>
        For any queries: support@banishq.com | +91 00000 00000<br/>
        This is a computer-generated invoice and does not require a signature.
      </div>
    </body>
    </html>
  `);
  w.document.close();
  w.print();
}

/* ── Order Detail Modal ── */
function OrderModal({ order, onClose, onSave }) {
  const [status, setStatus]   = useState(order.status);
  const [payment, setPayment] = useState(order.payment);

  const ss = STATUS_STYLES[status];
  const ps = PAYMENT_STYLES[payment];

  return (
    <ModalShell title="Order Details" subtitle={order.id} onClose={onClose} maxWidth={640}>
      {/* Product row */}
      <div style={{
        display: "flex", gap: 14, padding: 16,
        background: C.card, borderRadius: 14, border: `1px solid ${C.border}`,
        marginBottom: 16,
      }}>
        <img src={order.image} alt={order.product}
          style={{ width: 72, height: 72, borderRadius: 10, objectFit: "cover", flexShrink: 0 }} />
        <div>
          <p style={{ margin: "0 0 3px", fontWeight: 700, color: C.text, fontSize: 15 }}>{order.product}</p>
          <p style={{ margin: "0 0 8px", color: C.muted, fontSize: 12 }}>{order.category}</p>
          <p style={{ margin: 0, fontFamily: "'Cormorant Garamond',serif", fontSize: 24, fontWeight: 700, color: C.gold }}>
            ₹{order.amount.toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      {/* Customer info */}
      <div style={{
        padding: 16, background: C.card,
        borderRadius: 14, border: `1px solid ${C.border}`, marginBottom: 16,
      }}>
        <p style={{ margin: "0 0 12px", fontSize: 10, fontWeight: 700, letterSpacing: ".18em",
          textTransform: "uppercase", color: C.gold }}>Customer Information</p>
        <p style={{ margin: "0 0 10px", fontWeight: 700, color: C.text, fontSize: 16 }}>{order.customer}</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
          <a href={`tel:${order.phone}`}
            style={{ display: "flex", alignItems: "center", gap: 9, color: C.muted, fontSize: 13, textDecoration: "none" }}>
            <Phone size={13} color={C.gold} strokeWidth={1.8} /> {order.phone}
          </a>
          <a href={`mailto:${order.email}`}
            style={{ display: "flex", alignItems: "center", gap: 9, color: C.muted, fontSize: 13, textDecoration: "none" }}>
            <Mail size={13} color={C.gold} strokeWidth={1.8} /> {order.email}
          </a>
          <p style={{ display: "flex", alignItems: "flex-start", gap: 9, color: C.muted, fontSize: 13, margin: 0 }}>
            <Truck size={13} color={C.gold} strokeWidth={1.8} style={{ marginTop: 2, flexShrink: 0 }} />
            {order.address}
          </p>
        </div>
      </div>

      {/* Status selects */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
        <div>
          <label style={labelStyle}>Order Status</label>
          <select value={status} onChange={e => setStatus(e.target.value)}
            style={{ ...inputStyle, cursor: "pointer" }}>
            {ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          {ss && <Badge label={status} bg={ss.bg} color={ss.color} />}
        </div>
        <div>
          <label style={labelStyle}>Payment Status</label>
          <select value={payment} onChange={e => setPayment(e.target.value)}
            style={{ ...inputStyle, cursor: "pointer" }}>
            {PAYMENT_STATUSES.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          {ps && <Badge label={payment} bg={ps.bg} color={ps.color} />}
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <GoldBtn onClick={() => { onSave(order.id, status, payment); onClose(); }}>
          <Save size={13} /> Save Changes
        </GoldBtn>
        <GoldBtn outline onClick={() => printInvoice(order)}>
          <FileText size={13} /> Print Invoice
        </GoldBtn>
        <GoldBtn outline onClick={() => window.open(`tel:${order.phone}`)}>
          <Phone size={13} /> Call Customer
        </GoldBtn>
      </div>
    </ModalShell>
  );
}

/* ── Main Orders Page ── */
export default function OrdersPage({ orders, onUpdateOrder }) {
  const [selected, setSelected] = useState(null);
  const [filter, setFilter]     = useState("All");
  const [search, setSearch]     = useState("");

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
        subtitle="Manage, update, track and invoice all customer orders"
      />

      {/* Toolbar */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 220 }}>
          <Search size={14} color={C.dim}
            style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by order ID, customer, product, phone…"
            style={{ ...inputStyle, paddingLeft: 36 }}
          />
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {["All", ...ORDER_STATUSES].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              style={{
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

      {/* Count */}
      <p style={{ fontSize: 12, color: C.dim, marginBottom: 14 }}>
        Showing <strong style={{ color: C.text }}>{filtered.length}</strong> orders
      </p>

      {/* Table */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${C.border}` }}>
              {["Order ID","Customer","Product","Amount","Status","Payment","Date","Actions"].map(h => (
                <th key={h} style={{
                  padding: "14px 16px", textAlign: "left",
                  color: C.dim, fontSize: 10, fontWeight: 700,
                  letterSpacing: ".12em", textTransform: "uppercase", whiteSpace: "nowrap",
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(o => {
              const ss = STATUS_STYLES[o.status];
              const ps = PAYMENT_STYLES[o.payment];
              return (
                <tr key={o.id}
                  style={{ borderBottom: `1px solid ${C.border}`, transition: "background .15s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(201,168,76,.04)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <td style={{ padding: "14px 16px", color: C.gold, fontWeight: 700, fontSize: 12 }}>{o.id}</td>
                  <td style={{ padding: "14px 16px" }}>
                    <p style={{ margin: 0, color: C.text, fontWeight: 600 }}>{o.customer}</p>
                    <p style={{ margin: 0, color: C.dim, fontSize: 11 }}>{o.phone}</p>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <img src={o.image} alt=""
                        style={{ width: 38, height: 38, borderRadius: 8, objectFit: "cover", flexShrink: 0 }} />
                      <div>
                        <p style={{ margin: 0, color: C.text, fontSize: 13, maxWidth: 160,
                          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{o.product}</p>
                        <p style={{ margin: 0, color: C.dim, fontSize: 11 }}>{o.category}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "14px 16px", color: C.text, fontWeight: 700 }}>
                    ₹{o.amount.toLocaleString("en-IN")}
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
                      <button onClick={() => setSelected(o)}
                        title="View / Edit"
                        style={{
                          width: 30, height: 30, borderRadius: 8,
                          border: `1px solid ${C.border}`, background: "none",
                          cursor: "pointer", color: C.gold,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          transition: "background .15s",
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = "rgba(201,168,76,.12)"}
                        onMouseLeave={e => e.currentTarget.style.background = "none"}
                      >
                        <Eye size={13} />
                      </button>
                      <a href={`tel:${o.phone}`}
                        title="Call customer"
                        style={{
                          width: 30, height: 30, borderRadius: 8,
                          border: `1px solid ${C.border}`, background: "none",
                          cursor: "pointer", color: C.green, textDecoration: "none",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          transition: "background .15s",
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = "rgba(34,197,94,.1)"}
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
          <div style={{ padding: "48px 0", textAlign: "center" }}>
            <p style={{ color: C.muted, fontSize: 14 }}>No orders match your filter.</p>
          </div>
        )}
      </div>

      {selected && (
        <OrderModal
          order={selected}
          onClose={() => setSelected(null)}
          onSave={onUpdateOrder}
        />
      )}
    </div>
  );
}