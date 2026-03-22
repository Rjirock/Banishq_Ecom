// app/admin/pages/FeaturedPage.jsx
"use client";

import { Star, Plus, X, AlertCircle, CheckCircle2 } from "lucide-react";
import { SectionTitle } from "../components/AdminUI";
import { C } from "../data/theme";
import { CATEGORY_LABELS } from "../data/products.data";

/* ── Max featured products allowed ── */
const MAX_FEATURED = 8;

export default function FeaturedPage({ products, onToggleFeatured }) {
  const allProducts = Object.entries(products).flatMap(([cat, items]) =>
    items.map(p => ({ ...p, cat }))
  );

  const featured = allProducts.filter(p => p.featured);
  const others   = allProducts.filter(p => !p.featured);

  /* ── Is the limit reached? ── */
  const isFull   = featured.length >= MAX_FEATURED;
  const pct      = Math.round((featured.length / MAX_FEATURED) * 100);
  const barColor = featured.length >= MAX_FEATURED ? C.red
    : featured.length >= 6 ? C.orange
    : C.green;

  return (
    <div>
      <SectionTitle
        icon={Star}
        title="Featured Products"
        subtitle="Control which products are highlighted on the homepage. Maximum 8 featured products allowed."
      />

      {/* ── Slot progress bar ── */}
      <div style={{
        background: C.surface, border: `1.5px solid ${C.border}`,
        borderRadius: 14, padding: "16px 20px", marginBottom: 24,
        boxShadow: `0 1px 8px ${C.shadow}`,
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {isFull
              ? <AlertCircle size={15} color={C.red} />
              : <CheckCircle2 size={15} color={C.green} />
            }
            <span style={{ fontSize: 13.5, fontWeight: 700, color: C.text }}>
              Featured Slots
            </span>
          </div>
          <span style={{
            fontSize: 13, fontWeight: 800,
            color: barColor,
            background: `${barColor}15`,
            padding: "3px 12px", borderRadius: 99,
            border: `1px solid ${barColor}30`,
          }}>
            {featured.length} / {MAX_FEATURED} used
          </span>
        </div>

        {/* Bar */}
        <div style={{ height: 7, borderRadius: 99, background: C.border, overflow: "hidden" }}>
          <div style={{
            height: "100%",
            width: `${pct}%`,
            borderRadius: 99,
            background: barColor,
            transition: "width .4s ease, background .3s",
            boxShadow: isFull ? `0 0 8px ${C.red}55` : "none",
          }} />
        </div>

        {/* Warning when full */}
        {isFull && (
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            marginTop: 10, padding: "9px 13px", borderRadius: 10,
            background: "rgba(220,38,38,.07)",
            border: "1px solid rgba(220,38,38,.2)",
          }}>
            <AlertCircle size={13} color={C.red} style={{ flexShrink: 0 }} />
            <p style={{ margin: 0, fontSize: 12.5, color: C.red, fontWeight: 600 }}>
              Maximum of {MAX_FEATURED} featured products reached. Remove one to add another.
            </p>
          </div>
        )}
      </div>

      {/* ── Two-column layout ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>

        {/* ── LEFT: Currently featured ── */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <p style={{ margin: 0, fontSize: 11, fontWeight: 700,
              letterSpacing: ".18em", textTransform: "uppercase", color: C.gold }}>
              Currently Featured
            </p>
            <span style={{
              background: "rgba(201,168,76,.15)", color: C.gold,
              fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 99,
            }}>
              {featured.length}/{MAX_FEATURED}
            </span>
          </div>

          {featured.length === 0 ? (
            <div style={{
              padding: "28px 20px", textAlign: "center",
              background: C.card, borderRadius: 14,
              border: `1.5px dashed ${C.border}`,
            }}>
              <Star size={28} color={C.border} style={{ marginBottom: 8 }} />
              <p style={{ margin: 0, fontSize: 13, color: C.dim }}>
                No featured products yet.<br/>Add some from the right column.
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {featured.map((p, i) => (
                <div key={p.id} style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "10px 14px",
                  background: C.card,
                  border: `1.5px solid ${C.gold}33`,
                  borderRadius: 12,
                  animation: `featIn .3s ease ${i * 0.04}s both`,
                }}>
                  {/* Slot number */}
                  <div style={{
                    width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
                    background: `linear-gradient(135deg,${C.gold},${C.goldLight})`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 10, fontWeight: 800, color: "#1a1205",
                  }}>
                    {i + 1}
                  </div>

                  <img src={p.image} alt={p.name}
                    style={{ width: 44, height: 44, borderRadius: 9, objectFit: "cover", flexShrink: 0,
                      border: `1px solid ${C.border}` }} />

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: 0, fontWeight: 700, color: C.text, fontSize: 13,
                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {p.name}
                    </p>
                    <p style={{ margin: 0, color: C.dim, fontSize: 11 }}>
                      {CATEGORY_LABELS?.[p.cat] ?? p.cat} · ₹{Number(p.price).toLocaleString("en-IN")}
                    </p>
                  </div>

                  <button
                    onClick={() => onToggleFeatured(p.cat, p.id)}
                    style={{
                      background: "rgba(220,38,38,.1)", border: "1px solid rgba(220,38,38,.22)",
                      color: C.red, padding: "5px 12px", borderRadius: 8,
                      cursor: "pointer", fontSize: 11, fontWeight: 700,
                      display: "flex", alignItems: "center", gap: 5, flexShrink: 0,
                      transition: "background .15s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(220,38,38,.2)"}
                    onMouseLeave={e => e.currentTarget.style.background = "rgba(220,38,38,.1)"}
                  >
                    <X size={11} /> Remove
                  </button>
                </div>
              ))}

              {/* Empty slots visual */}
              {Array.from({ length: MAX_FEATURED - featured.length }).map((_, i) => (
                <div key={`empty-${i}`} style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "10px 14px",
                  border: `1.5px dashed ${C.border}`, borderRadius: 12,
                  opacity: 0.5,
                }}>
                  <div style={{
                    width: 22, height: 22, borderRadius: "50%",
                    background: C.border,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 10, fontWeight: 800, color: C.dim,
                  }}>
                    {featured.length + i + 1}
                  </div>
                  <p style={{ margin: 0, fontSize: 12, color: C.dim, fontStyle: "italic" }}>
                    Empty slot
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── RIGHT: Available to feature ── */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <p style={{ margin: 0, fontSize: 11, fontWeight: 700,
              letterSpacing: ".18em", textTransform: "uppercase", color: C.muted }}>
              Available to Feature
            </p>
            <span style={{
              background: C.bg, color: C.muted,
              fontSize: 10, fontWeight: 700, padding: "2px 8px",
              borderRadius: 99, border: `1px solid ${C.border}`,
            }}>
              {others.length}
            </span>
          </div>

          {others.length === 0 ? (
            <div style={{
              padding: "28px 20px", textAlign: "center",
              background: C.card, borderRadius: 14,
              border: `1.5px dashed ${C.border}`,
            }}>
              <p style={{ margin: 0, fontSize: 13, color: C.dim }}>
                All products are featured.
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {others.map(p => {
                const disabled = isFull;
                return (
                  <div key={p.id} style={{
                    display: "flex", alignItems: "center", gap: 12, padding: "10px 14px",
                    background: C.card,
                    border: `1.5px solid ${C.border}`,
                    borderRadius: 12,
                    opacity: disabled ? 0.5 : 1,
                    transition: "opacity .2s",
                  }}>
                    <img src={p.image} alt={p.name}
                      style={{ width: 44, height: 44, borderRadius: 9, objectFit: "cover", flexShrink: 0,
                        border: `1px solid ${C.border}` }} />

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: 0, fontWeight: 600, color: C.text, fontSize: 13,
                        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {p.name}
                      </p>
                      <p style={{ margin: 0, color: C.dim, fontSize: 11 }}>
                        {CATEGORY_LABELS?.[p.cat] ?? p.cat} · ₹{Number(p.price).toLocaleString("en-IN")}
                      </p>
                    </div>

                    <button
                      onClick={() => { if (!disabled) onToggleFeatured(p.cat, p.id); }}
                      disabled={disabled}
                      title={disabled ? `Max ${MAX_FEATURED} featured products allowed` : "Add to featured"}
                      style={{
                        background: disabled ? C.bg : "rgba(201,168,76,.12)",
                        border: `1px solid ${disabled ? C.border : "rgba(201,168,76,.3)"}`,
                        color: disabled ? C.dim : C.gold,
                        padding: "5px 12px", borderRadius: 8,
                        cursor: disabled ? "not-allowed" : "pointer",
                        fontSize: 11, fontWeight: 700,
                        display: "flex", alignItems: "center", gap: 5, flexShrink: 0,
                        transition: "all .15s",
                      }}
                      onMouseEnter={e => { if (!disabled) e.currentTarget.style.background = "rgba(201,168,76,.22)"; }}
                      onMouseLeave={e => { if (!disabled) e.currentTarget.style.background = "rgba(201,168,76,.12)"; }}
                    >
                      <Plus size={11} />
                      {disabled ? "Full" : "Feature"}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes featIn {
          from { opacity: 0; transform: translateX(-8px); }
          to   { opacity: 1; transform: translateX(0);    }
        }
      `}</style>
    </div>
  );
}