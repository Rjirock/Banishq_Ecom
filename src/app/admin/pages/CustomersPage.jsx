// app/admin/pages/CustomersPage.jsx
"use client";

import { useState } from "react";
import {
  Users, Search, Phone, Mail, ShoppingBag,
  Ban, CheckCircle, Eye, X, TrendingUp,
} from "lucide-react";
import {
  SectionTitle, Badge, GoldBtn, ModalShell, ConfirmDialog,
} from "../components/AdminUI";
import { C, inputStyle, labelStyle } from "../data/theme";
import { CUSTOMER_STATUSES } from "../data/customers.data";
import { MOCK_ORDERS, STATUS_STYLES, PAYMENT_STYLES } from "../data/orders.data";

/* ── Customer Detail Modal ── */
function CustomerModal({ customer, onClose, onBlock }) {
  // Find this customer's orders from mock data
  const customerOrders = MOCK_ORDERS.filter(o =>
    o.customer.toLowerCase() === customer.name.toLowerCase()
  );

  const isBlocked = customer.status === "Blocked";

  return (
    <ModalShell
      title="Customer Profile"
      subtitle={customer.id}
      onClose={onClose}
      maxWidth={600}
    >
      {/* Avatar + basic info */}
      <div style={{
        display: "flex", gap: 16, padding: 18,
        background: C.card, borderRadius: 14,
        border: `1px solid ${C.border}`, marginBottom: 16,
      }}>
        <div style={{
          width: 56, height: 56, borderRadius: "50%", flexShrink: 0,
          background: `linear-gradient(135deg,${C.gold},${C.goldLight})`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 16, fontWeight: 800, color: "#1a1205",
        }}>
          {customer.avatar}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <p style={{ margin: 0, fontWeight: 700, color: C.text, fontSize: 17 }}>{customer.name}</p>
            <Badge
              label={customer.status}
              bg={isBlocked ? "rgba(239,68,68,.15)" : "rgba(34,197,94,.15)"}
              color={isBlocked ? C.red : C.green}
            />
          </div>
          <p style={{ margin: "0 0 10px", color: C.dim, fontSize: 12 }}>
            Member since {customer.joinedDate} · {customer.city}, {customer.state}
          </p>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <a href={`tel:${customer.phone}`}
              style={{ display: "flex", alignItems: "center", gap: 7,
                color: C.muted, fontSize: 13, textDecoration: "none" }}>
              <Phone size={13} color={C.gold} /> {customer.phone}
            </a>
            <a href={`mailto:${customer.email}`}
              style={{ display: "flex", alignItems: "center", gap: 7,
                color: C.muted, fontSize: 13, textDecoration: "none" }}>
              <Mail size={13} color={C.gold} /> {customer.email}
            </a>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
        gap: 12, marginBottom: 18,
      }}>
        {[
          { label: "Total Orders",  value: customer.totalOrders                                },
          { label: "Total Spent",   value: `₹${customer.totalSpent.toLocaleString("en-IN")}` },
          { label: "Avg. Order",    value: `₹${Math.round(customer.totalSpent / (customer.totalOrders || 1)).toLocaleString("en-IN")}` },
        ].map(s => (
          <div key={s.label} style={{
            background: C.card, border: `1px solid ${C.border}`,
            borderRadius: 12, padding: "14px 16px", textAlign: "center",
          }}>
            <p style={{ margin: "0 0 4px", fontFamily: "'Cormorant Garamond',serif",
              fontSize: 20, fontWeight: 700, color: C.gold }}>{s.value}</p>
            <p style={{ margin: 0, fontSize: 11, color: C.dim }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Order history */}
      {customerOrders.length > 0 && (
        <div style={{ marginBottom: 18 }}>
          <p style={{ ...labelStyle, marginBottom: 10 }}>Order History</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {customerOrders.map(o => {
              const ss = STATUS_STYLES[o.status];
              const ps = PAYMENT_STYLES[o.payment];
              return (
                <div key={o.id} style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "10px 14px",
                  background: C.card, border: `1px solid ${C.border}`, borderRadius: 11,
                }}>
                  <img src={o.image} alt="" style={{ width: 38, height: 38, borderRadius: 8, objectFit: "cover" }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: 0, color: C.text, fontSize: 13, fontWeight: 600,
                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{o.product}</p>
                    <p style={{ margin: 0, color: C.dim, fontSize: 11 }}>{o.id} · {o.date}</p>
                  </div>
                  <span style={{ fontWeight: 700, color: C.text, fontSize: 13, flexShrink: 0 }}>
                    ₹{o.amount.toLocaleString("en-IN")}
                  </span>
                  <Badge label={o.status} bg={ss?.bg} color={ss?.color} />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Actions */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <GoldBtn outline onClick={() => window.open(`tel:${customer.phone}`)}>
          <Phone size={13} /> Call Customer
        </GoldBtn>
        <GoldBtn outline onClick={() => window.open(`mailto:${customer.email}`)}>
          <Mail size={13} /> Send Email
        </GoldBtn>
        {isBlocked
          ? <GoldBtn outline onClick={() => { onBlock(customer.id, "Active"); onClose(); }}>
              <CheckCircle size={13} /> Unblock
            </GoldBtn>
          : <GoldBtn danger onClick={() => { onBlock(customer.id, "Blocked"); onClose(); }}>
              <Ban size={13} /> Block Customer
            </GoldBtn>
        }
      </div>
    </ModalShell>
  );
}

/* ── Main Customers Page ── */
export default function CustomersPage({ customers, onUpdateStatus }) {
  const [selected, setSelected] = useState(null);
  const [search, setSearch]     = useState("");
  const [filter, setFilter]     = useState("All");

  const filtered = customers.filter(c =>
    (filter === "All" || c.status === filter) &&
    (
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      c.city.toLowerCase().includes(search.toLowerCase())
    )
  );

  const totalRevenue = customers.reduce((s, c) => s + c.totalSpent, 0);
  const totalOrders  = customers.reduce((s, c) => s + c.totalOrders, 0);
  const activeCount  = customers.filter(c => c.status === "Active").length;

  return (
    <div>
      <SectionTitle
        icon={Users}
        title="Customers"
        subtitle="View customer profiles, order history, and manage access"
      />

      {/* Summary stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 24 }}>
        {[
          { label: "Total Customers",  value: customers.length, color: C.gold   },
          { label: "Active Customers", value: activeCount,      color: C.green  },
          { label: "Total Revenue",    value: `₹${totalRevenue.toLocaleString("en-IN")}`, color: C.blue },
        ].map(s => (
          <div key={s.label} style={{
            background: C.card, border: `1px solid ${C.border}`,
            borderRadius: 14, padding: "18px 20px",
          }}>
            <p style={{ margin: "0 0 4px", fontFamily: "'Cormorant Garamond',serif",
              fontSize: 26, fontWeight: 700, color: s.color }}>{s.value}</p>
            <p style={{ margin: 0, fontSize: 12, color: C.muted }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 220 }}>
          <Search size={14} color={C.dim}
            style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, email, phone, city…"
            style={{ ...inputStyle, paddingLeft: 36 }}
          />
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {["All", ...CUSTOMER_STATUSES].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              style={{
                padding: "7px 16px", borderRadius: 9, cursor: "pointer",
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

      {/* Table */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${C.border}` }}>
              {["Customer", "Contact", "Location", "Orders", "Total Spent", "Status", "Joined", "Actions"].map(h => (
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
            {filtered.map(c => {
              const isBlocked = c.status === "Blocked";
              return (
                <tr key={c.id}
                  style={{ borderBottom: `1px solid ${C.border}`, transition: "background .15s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(201,168,76,.04)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  {/* Customer */}
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
                        background: isBlocked
                          ? "rgba(239,68,68,.2)"
                          : `linear-gradient(135deg,${C.gold}44,${C.goldLight}44)`,
                        border: `1.5px solid ${isBlocked ? C.red + "44" : C.gold + "44"}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 11, fontWeight: 700,
                        color: isBlocked ? C.red : C.gold,
                      }}>
                        {c.avatar}
                      </div>
                      <div>
                        <p style={{ margin: 0, fontWeight: 600, color: C.text }}>{c.name}</p>
                        <p style={{ margin: 0, color: C.dim, fontSize: 10 }}>{c.id}</p>
                      </div>
                    </div>
                  </td>

                  {/* Contact */}
                  <td style={{ padding: "14px 16px" }}>
                    <p style={{ margin: 0, color: C.muted, fontSize: 12 }}>{c.phone}</p>
                    <p style={{ margin: 0, color: C.dim, fontSize: 11 }}>{c.email}</p>
                  </td>

                  {/* Location */}
                  <td style={{ padding: "14px 16px", color: C.muted, fontSize: 12 }}>
                    {c.city}, {c.state}
                  </td>

                  {/* Orders */}
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <ShoppingBag size={12} color={C.dim} />
                      <span style={{ color: C.text, fontWeight: 600 }}>{c.totalOrders}</span>
                    </div>
                  </td>

                  {/* Spent */}
                  <td style={{ padding: "14px 16px", color: C.text, fontWeight: 700 }}>
                    ₹{c.totalSpent.toLocaleString("en-IN")}
                  </td>

                  {/* Status */}
                  <td style={{ padding: "14px 16px" }}>
                    <Badge
                      label={c.status}
                      bg={isBlocked ? "rgba(239,68,68,.15)" : "rgba(34,197,94,.15)"}
                      color={isBlocked ? C.red : C.green}
                    />
                  </td>

                  {/* Joined */}
                  <td style={{ padding: "14px 16px", color: C.dim, fontSize: 12 }}>{c.joinedDate}</td>

                  {/* Actions */}
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button onClick={() => setSelected(c)}
                        title="View profile"
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
                      <a href={`tel:${c.phone}`}
                        title="Call"
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
                      <button
                        title={isBlocked ? "Unblock" : "Block"}
                        onClick={() => onUpdateStatus(c.id, isBlocked ? "Active" : "Blocked")}
                        style={{
                          width: 30, height: 30, borderRadius: 8,
                          border: `1px solid ${C.border}`, background: "none",
                          cursor: "pointer",
                          color: isBlocked ? C.green : C.red,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          transition: "background .15s",
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = isBlocked ? "rgba(34,197,94,.1)" : "rgba(239,68,68,.1)"}
                        onMouseLeave={e => e.currentTarget.style.background = "none"}
                      >
                        {isBlocked ? <CheckCircle size={13} /> : <Ban size={13} />}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div style={{ padding: "48px 0", textAlign: "center" }}>
            <p style={{ color: C.muted, fontSize: 14 }}>No customers found.</p>
          </div>
        )}
      </div>

      {selected && (
        <CustomerModal
          customer={selected}
          onClose={() => setSelected(null)}
          onBlock={onUpdateStatus}
        />
      )}
    </div>
  );
}