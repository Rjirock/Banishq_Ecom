// app/admin/pages/DashboardPage.jsx
"use client";

import {
  LayoutDashboard, DollarSign, ShoppingCart,
  Users, Package, ShoppingBag, AlertCircle,
  CreditCard, Truck, UserPlus,
} from "lucide-react";
import { SectionTitle, StatCard, Badge } from "../components/AdminUI";
import { C } from "../data/theme";
import { DASHBOARD_STATS, RECENT_ACTIVITY } from "../data/dashboard.data";
import { STATUS_STYLES, PAYMENT_STYLES } from "../data/orders.data";

const STAT_ICONS = {
  gold:   DollarSign,
  blue:   ShoppingCart,
  green:  Users,
  orange: Package,
};
const STAT_COLORS = {
  gold:   C.gold,
  blue:   C.blue,
  green:  C.green,
  orange: C.orange,
};

const ACTIVITY_ICONS = {
  order:   ShoppingBag,
  warning: AlertCircle,
  payment: CreditCard,
  ship:    Truck,
  user:    UserPlus,
};
const ACTIVITY_COLORS = {
  order:   C.gold,
  warning: C.orange,
  payment: C.green,
  ship:    C.blue,
  user:    C.muted,
};

export default function DashboardPage({ orders = [] }) {
  return (
    <div>
      <SectionTitle
        icon={LayoutDashboard}
        title="Dashboard"
        subtitle="Live overview of your store's performance"
      />

      {/* Stats grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))",
        gap: 16, marginBottom: 28,
      }}>
        {DASHBOARD_STATS.map(stat => (
          <StatCard
            key={stat.id}
            icon={STAT_ICONS[stat.colorKey]}
            label={stat.label}
            value={stat.value}
            change={stat.change}
            color={STAT_COLORS[stat.colorKey]}
          />
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20 }}>
        {/* Recent orders table */}
        <div style={{
          background: C.card, border: `1px solid ${C.border}`,
          borderRadius: 16, padding: 20,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <h3 style={{ margin: 0, color: C.text, fontSize: 15, fontWeight: 700 }}>Recent Orders</h3>
            <Badge label="● Live" bg="rgba(34,197,94,.12)" color={C.green} />
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                  {["Order","Customer","Amount","Status","Payment"].map(h => (
                    <th key={h} style={{
                      padding: "8px 12px", textAlign: "left",
                      color: C.dim, fontSize: 10, fontWeight: 700,
                      letterSpacing: ".12em", textTransform: "uppercase", whiteSpace: "nowrap",
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 6).map(o => {
                  const ss = STATUS_STYLES[o.status];
                  const ps = PAYMENT_STYLES[o.payment];
                  return (
                    <tr key={o.id}
                      style={{ borderBottom: `1px solid ${C.border}`, transition: "background .15s" }}
                      onMouseEnter={e => e.currentTarget.style.background = "rgba(201,168,76,.04)"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                      <td style={{ padding: "12px", color: C.gold, fontWeight: 700, fontSize: 12 }}>{o.id}</td>
                      <td style={{ padding: "12px", color: C.text }}>{o.customer}</td>
                      <td style={{ padding: "12px", color: C.text, fontWeight: 700 }}>₹{o.amount.toLocaleString("en-IN")}</td>
                      <td style={{ padding: "12px" }}><Badge label={o.status} bg={ss.bg} color={ss.color} /></td>
                      <td style={{ padding: "12px" }}><Badge label={o.payment} bg={ps.bg} color={ps.color} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Activity feed */}
        <div style={{
          background: C.card, border: `1px solid ${C.border}`,
          borderRadius: 16, padding: 20,
        }}>
          <h3 style={{ margin: "0 0 16px", color: C.text, fontSize: 15, fontWeight: 700 }}>Activity Feed</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {RECENT_ACTIVITY.map(a => {
              const Icon = ACTIVITY_ICONS[a.type];
              const color = ACTIVITY_COLORS[a.type];
              return (
                <div key={a.id} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <div style={{
                    width: 30, height: 30, borderRadius: 9, flexShrink: 0,
                    background: `${color}18`, border: `1px solid ${color}30`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <Icon size={13} color={color} />
                  </div>
                  <div>
                    <p style={{ margin: "0 0 2px", fontSize: 12, color: C.text, lineHeight: 1.5 }}>{a.text}</p>
                    <p style={{ margin: 0, fontSize: 10, color: C.dim }}>{a.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}