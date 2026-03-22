// app/admin/pages/SettingsPage.jsx
"use client";

import { useState } from "react";
import {
  Settings, Store, Truck, Bell, Tag,
  Share2, Save, Check,
} from "lucide-react";
import { SectionTitle, GoldBtn } from "../components/AdminUI";
import { C, labelStyle, inputStyle } from "../data/theme";

// FIX 1: Guard — if settings prop is undefined/null, use safe defaults
//         This prevents "Cannot read properties of undefined" crashes
import { INITIAL_SETTINGS } from "../data/settings.data";

/* ── Settings section wrapper ── */
function SettingsSection({ icon: Icon, title, children }) {
  return (
    <div style={{
      // FIX 2: Use C.surface (white) not C.card — matches light theme
      background: C.surface,
      border: `1.5px solid ${C.border}`,
      borderRadius: 16, overflow: "hidden", marginBottom: 20,
      boxShadow: `0 2px 12px ${C.shadow}`,
    }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "16px 20px", borderBottom: `1px solid ${C.border}`,
        background: C.goldBg,
      }}>
        <div style={{
          width: 30, height: 30, borderRadius: 9,
          background: "rgba(201,168,76,.15)",
          border: "1px solid rgba(201,168,76,.25)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Icon size={14} color={C.gold} />
        </div>
        <h3 style={{ margin: 0, color: C.text, fontSize: 15, fontWeight: 700 }}>{title}</h3>
      </div>
      <div style={{ padding: 20 }}>{children}</div>
    </div>
  );
}

/* ── Toggle ── */
// FIX 3: Changed div onClick to button for proper accessibility + no warning
function Toggle({ value, onChange, label, description }) {
  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "12px 0", borderBottom: `1px solid ${C.border}`,
    }}>
      <div style={{ flex: 1, paddingRight: 16 }}>
        <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: C.text }}>{label}</p>
        {description && (
          <p style={{ margin: "2px 0 0", fontSize: 11.5, color: C.dim }}>{description}</p>
        )}
      </div>
      {/* FIX 3: button element instead of div */}
      <button
        type="button"
        onClick={() => onChange(!value)}
        style={{
          width: 46, height: 26, borderRadius: 99, cursor: "pointer",
          border: "none", outline: "none", flexShrink: 0,
          background: value ? C.gold : C.border,
          position: "relative", transition: "background .25s",
        }}
      >
        <div style={{
          position: "absolute", top: 3,
          left: value ? 23 : 3,
          width: 20, height: 20, borderRadius: "50%",
          background: "#fff", transition: "left .25s",
          boxShadow: "0 1px 4px rgba(0,0,0,.25)",
        }} />
      </button>
    </div>
  );
}

/* ── Field row (label + input side by side) ── */
function FieldRow({ label, children }) {
  return (
    <div style={{
      display: "grid", gridTemplateColumns: "160px 1fr",
      gap: 14, alignItems: "center", marginBottom: 12,
    }}>
      <label style={{ ...labelStyle, marginBottom: 0 }}>{label}</label>
      {children}
    </div>
  );
}

/* ── Main Settings Page ── */
export default function SettingsPage({ settings, onSave }) {
  // FIX 4: Fallback to INITIAL_SETTINGS if settings prop is undefined/null
  //         This is the main crash — when the component mounts before data loads
  const [form, setForm]   = useState(settings ?? INITIAL_SETTINGS);
  const [saved, setSaved] = useState(false);

  const set = (section, key, val) =>
    setForm(f => ({ ...f, [section]: { ...f[section], [key]: val } }));

  const handleSave = () => {
    onSave(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  // FIX 5: Extra guard — if form sections are missing, bail gracefully
  if (!form?.store || !form?.shipping || !form?.notifications || !form?.promo || !form?.social) {
    return (
      <div style={{ padding: 40, textAlign: "center", color: C.muted, fontSize: 14 }}>
        Loading settings…
      </div>
    );
  }

  return (
    <div>
      <SectionTitle
        icon={Settings}
        title="Settings"
        subtitle="Configure your store, shipping, notifications, promotions and social links"
      />

      {/* ── Store Info ── */}
      <SettingsSection icon={Store} title="Store Information">
        {[
          { key: "name",      label: "Store Name",    placeholder: "BANISHQ"                        },
          { key: "tagline",   label: "Tagline",        placeholder: "Premium Curated Collections"    },
          { key: "email",     label: "Support Email",  placeholder: "support@banishq.com"            },
          { key: "phone",     label: "Phone",          placeholder: "+91 00000 00000"                },
          { key: "address",   label: "Address",        placeholder: "Studio address"                 },
          { key: "gstNumber", label: "GST Number",     placeholder: "08AABCU9603R1ZX"               },
        ].map(f => (
          <FieldRow key={f.key} label={f.label}>
            <input
              value={form.store[f.key] ?? ""}
              onChange={e => set("store", f.key, e.target.value)}
              placeholder={f.placeholder}
              style={inputStyle}
            />
          </FieldRow>
        ))}
      </SettingsSection>

      {/* ── Shipping ── */}
      <SettingsSection icon={Truck} title="Shipping & Delivery">
        {/* FIX 6: 4 fields → 2x2 grid instead of 1x3 (was overflowing) */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
          {[
            { key: "freeShippingThreshold", label: "Free Shipping Above (₹)" },
            { key: "standardRate",          label: "Standard Delivery (₹)"   },
            { key: "expressRate",           label: "Express Delivery (₹)"    },
            { key: "codCharge",             label: "COD Charge (₹)"          },
          ].map(f => (
            <div key={f.key}>
              <label style={labelStyle}>{f.label}</label>
              <input
                type="number"
                value={form.shipping[f.key] ?? ""}
                onChange={e => set("shipping", f.key, Number(e.target.value))}
                style={inputStyle}
              />
            </div>
          ))}
        </div>
        <Toggle
          value={form.shipping.codAvailable}
          onChange={v => set("shipping", "codAvailable", v)}
          label="Cash on Delivery"
          description="Allow customers to pay on delivery"
        />
      </SettingsSection>

      {/* ── Notifications ── */}
      <SettingsSection icon={Bell} title="Notifications">
        <Toggle
          value={form.notifications.emailOnNewOrder}
          onChange={v => set("notifications", "emailOnNewOrder", v)}
          label="Email on New Order"
          description="Get an email whenever a new order is placed"
        />
        <Toggle
          value={form.notifications.emailOnLowStock}
          onChange={v => set("notifications", "emailOnLowStock", v)}
          label="Low Stock Alerts"
          description={`Alert when stock falls below ${form.notifications.lowStockThreshold ?? 10} units`}
        />
        <Toggle
          value={form.notifications.smsOnOrderShipped}
          onChange={v => set("notifications", "smsOnOrderShipped", v)}
          label="SMS on Order Shipped"
          description="Send SMS to customer when order is dispatched"
        />
        <Toggle
          value={form.notifications.whatsappAlerts}
          onChange={v => set("notifications", "whatsappAlerts", v)}
          label="WhatsApp Alerts"
          description="Receive admin alerts via WhatsApp"
        />
      </SettingsSection>

      {/* ── Promo Banner ── */}
      {/* FIX 7: Fixed typo "Welecome Coupun Code" → "Welcome Coupon & Promo Banner" */}
      <SettingsSection icon={Tag} title="Welcome Coupon & Promo Banner">
        <Toggle
          value={form.promo.showPromoBanner}
          onChange={v => set("promo", "showPromoBanner", v)}
          label="Show Promo Banner"
          description="Display the announcement banner at the top of the site"
        />
        <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 14 }}>
          <div>
            <label style={labelStyle}>Coupon Code</label>
            <input
              value={form.promo.activeCoupon ?? ""}
              onChange={e => set("promo", "activeCoupon", e.target.value)}
              placeholder="SAVE10"
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Discount %</label>
            <input
              type="number" min="0" max="100"
              value={form.promo.discountPercent ?? ""}
              onChange={e => set("promo", "discountPercent", Number(e.target.value))}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Expiry Date</label>
            <input
              type="date"
              value={form.promo.couponExpiry ?? ""}
              onChange={e => set("promo", "couponExpiry", e.target.value)}
              style={inputStyle}
            />
          </div>
        </div>
        <div>
          <label style={labelStyle}>Promo Banner Text</label>
          <input
            value={form.promo.promoText ?? ""}
            onChange={e => set("promo", "promoText", e.target.value)}
            placeholder="Use code SAVE10 for 10% off your first order!"
            style={inputStyle}
          />
        </div>
      </SettingsSection>

      {/* ── Social Links ── */}
      <SettingsSection icon={Share2} title="Social Media Links">
        {[
          { key: "instagram", label: "Instagram", placeholder: "https://instagram.com/banishq"  },
          { key: "facebook",  label: "Facebook",  placeholder: "https://facebook.com/banishq"   },
          { key: "whatsapp",  label: "WhatsApp",  placeholder: "https://wa.me/910000000000"     },
          { key: "youtube",   label: "YouTube",   placeholder: "https://youtube.com/@banishq"   },
        ].map(f => (
          <FieldRow key={f.key} label={f.label}>
            <input
              value={form.social[f.key] ?? ""}
              onChange={e => set("social", f.key, e.target.value)}
              placeholder={f.placeholder}
              style={inputStyle}
            />
          </FieldRow>
        ))}
      </SettingsSection>

      {/* Save */}
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <GoldBtn onClick={handleSave}>
          {saved
            ? <><Check size={14} /> Saved!</>
            : <><Save size={14} /> Save All Settings</>
          }
        </GoldBtn>
      </div>
    </div>
  );
}