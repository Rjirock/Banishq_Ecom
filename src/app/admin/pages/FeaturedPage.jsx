// app/admin/pages/FeaturedPage.jsx
"use client";

import { Star, Plus, X } from "lucide-react";
import { SectionTitle, GoldBtn } from "../components/AdminUI";
import { C } from "../data/theme";
import { CATEGORY_LABELS } from "../data/products.data";

export default function FeaturedPage({ products, onToggleFeatured }) {
  const allProducts = Object.entries(products).flatMap(([cat, items]) =>
    items.map(p => ({ ...p, cat }))
  );
  const featured = allProducts.filter(p => p.featured);
  const others   = allProducts.filter(p => !p.featured);

  return (
    <div>
      <SectionTitle
        icon={Star}
        title="Featured Products"
        subtitle="Control which products are highlighted on the homepage featured section"
      />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>

        {/* Currently featured */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <p style={{ margin: 0, fontSize: 11, fontWeight: 700, letterSpacing: ".18em",
              textTransform: "uppercase", color: C.gold }}>
              Currently Featured
            </p>
            <span style={{ background: `rgba(201,168,76,.15)`, color: C.gold,
              fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 99 }}>
              {featured.length}
            </span>
          </div>

          {featured.length === 0 && (
            <p style={{ color: C.dim, fontSize: 13 }}>No featured products yet.</p>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {featured.map(p => (
              <div key={p.id} style={{
                display: "flex", alignItems: "center", gap: 12, padding: "10px 14px",
                background: C.card, border: `1px solid ${C.gold}33`, borderRadius: 12,
              }}>
                <img src={p.image} alt={p.name}
                  style={{ width: 46, height: 46, borderRadius: 9, objectFit: "cover", flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontWeight: 600, color: C.text, fontSize: 13,
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</p>
                  <p style={{ margin: 0, color: C.dim, fontSize: 11 }}>
                    {CATEGORY_LABELS[p.cat]} · ₹{Number(p.price).toLocaleString("en-IN")}
                  </p>
                </div>
                <button
                  onClick={() => onToggleFeatured(p.cat, p.id)}
                  style={{
                    background: "rgba(239,68,68,.12)", border: "1px solid rgba(239,68,68,.25)",
                    color: "#ef4444", padding: "5px 12px", borderRadius: 8,
                    cursor: "pointer", fontSize: 11, fontWeight: 700,
                    display: "flex", alignItems: "center", gap: 5, flexShrink: 0,
                  }}>
                  <X size={11} /> Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Available to feature */}
        <div>
          <p style={{ margin: "0 0 14px", fontSize: 11, fontWeight: 700, letterSpacing: ".18em",
            textTransform: "uppercase", color: C.muted }}>
            Available to Feature
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {others.map(p => (
              <div key={p.id} style={{
                display: "flex", alignItems: "center", gap: 12, padding: "10px 14px",
                background: C.card, border: `1px solid ${C.border}`, borderRadius: 12,
              }}>
                <img src={p.image} alt={p.name}
                  style={{ width: 46, height: 46, borderRadius: 9, objectFit: "cover", flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontWeight: 600, color: C.text, fontSize: 13,
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</p>
                  <p style={{ margin: 0, color: C.dim, fontSize: 11 }}>
                    {CATEGORY_LABELS[p.cat]} · ₹{Number(p.price).toLocaleString("en-IN")}
                  </p>
                </div>
                <button
                  onClick={() => onToggleFeatured(p.cat, p.id)}
                  style={{
                    background: `rgba(201,168,76,.12)`, border: `1px solid rgba(201,168,76,.25)`,
                    color: C.gold, padding: "5px 12px", borderRadius: 8,
                    cursor: "pointer", fontSize: 11, fontWeight: 700,
                    display: "flex", alignItems: "center", gap: 5, flexShrink: 0,
                  }}>
                  <Plus size={11} /> Feature
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}