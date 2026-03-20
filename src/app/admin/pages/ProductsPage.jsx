// app/admin/pages/ProductsPage.jsx
"use client";

import { useState } from "react";
import { Package, Plus, Edit2, Trash2, Star, Camera, Save, X } from "lucide-react";
import {
  SectionTitle, Badge, GoldBtn, ModalShell,
  ConfirmDialog, inputStyle, labelStyle,
} from "../components/AdminUI";
import { C } from "../data/theme";
import { PRODUCT_CATEGORIES, CATEGORY_LABELS } from "../data/products.data";

/* ── Product Modal (add / edit) ── */
function ProductModal({ product, onClose, onSave }) {
  const [form, setForm] = useState(
    product || { name: "", brand: "", price: "", originalPrice: "", stock: "", image: "", featured: false }
  );
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <ModalShell
      title={product ? "Edit Product" : "Add New Product"}
      subtitle={product ? product.id : "New item"}
      onClose={onClose}
      maxWidth={540}
    >
      {/* Image preview + URL */}
      <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 16 }}>
        {form.image
          ? <img src={form.image} alt="preview"
              style={{ width: 80, height: 80, borderRadius: 12, objectFit: "cover", flexShrink: 0 }} />
          : <div style={{ width: 80, height: 80, borderRadius: 12, background: C.card,
              border: `2px dashed ${C.border}`, display: "flex", alignItems: "center",
              justifyContent: "center", flexShrink: 0 }}>
              <Camera size={22} color={C.dim} />
            </div>
        }
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>Image URL</label>
          <input value={form.image} onChange={e => set("image", e.target.value)}
            placeholder="https://…" style={inputStyle} />
        </div>
      </div>

      {/* Name + Brand */}
      {[
        { key: "name",  label: "Product Name", placeholder: "e.g. Banarasi Silk Saree" },
        { key: "brand", label: "Brand",         placeholder: "e.g. Heritage Weaves"     },
      ].map(f => (
        <div key={f.key} style={{ marginBottom: 14 }}>
          <label style={labelStyle}>{f.label}</label>
          <input value={form[f.key]} onChange={e => set(f.key, e.target.value)}
            placeholder={f.placeholder} style={inputStyle} />
        </div>
      ))}

      {/* Price / OriginalPrice / Stock */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 14 }}>
        {[
          { key: "price",         label: "Selling Price (₹)" },
          { key: "originalPrice", label: "Original Price (₹)" },
          { key: "stock",         label: "Stock Qty"          },
        ].map(f => (
          <div key={f.key}>
            <label style={labelStyle}>{f.label}</label>
            <input value={form[f.key]} onChange={e => set(f.key, e.target.value)}
              type="number" style={inputStyle} />
          </div>
        ))}
      </div>

      {/* Featured toggle */}
      <label style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer", marginBottom: 20 }}>
        <div onClick={() => set("featured", !form.featured)}
          style={{
            width: 44, height: 24, borderRadius: 99, position: "relative",
            background: form.featured ? C.gold : C.border, transition: "background .2s",
          }}>
          <div style={{
            position: "absolute", top: 3,
            left: form.featured ? 23 : 3,
            width: 18, height: 18, borderRadius: "50%",
            background: "#fff", transition: "left .2s",
          }} />
        </div>
        <span style={{ fontSize: 13, color: C.text, fontWeight: 500 }}>Mark as Featured Product</span>
      </label>

      <div style={{ display: "flex", gap: 10 }}>
        <GoldBtn onClick={() => { onSave(form); onClose(); }}>
          <Save size={13} /> {product ? "Save Changes" : "Add Product"}
        </GoldBtn>
        <GoldBtn outline onClick={onClose}><X size={13} /> Cancel</GoldBtn>
      </div>
    </ModalShell>
  );
}

/* ── Main Products Page ── */
export default function ProductsPage({ products, onSaveProduct, onDeleteProduct, onToggleFeatured }) {
  const [tab, setTab]         = useState("women");
  const [modal, setModal]     = useState(null);   // null | "add" | product obj
  const [deleteId, setDeleteId] = useState(null);

  const current = products[tab] || [];

  return (
    <div>
      <SectionTitle
        icon={Package}
        title="Products"
        subtitle="Add, edit, remove and feature products across all categories"
      />

      {/* Category tabs + Add button */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
        {PRODUCT_CATEGORIES.map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{
              padding: "9px 20px", borderRadius: 10, cursor: "pointer",
              fontSize: 13, fontWeight: 700, letterSpacing: ".04em",
              transition: "all .2s",
              background: tab === t ? C.gold : C.card,
              color: tab === t ? "#1a1205" : C.muted,
              border: `1px solid ${tab === t ? C.gold : C.border}`,
            }}>
            {CATEGORY_LABELS[t]}
            <span style={{ marginLeft: 6, fontSize: 11, opacity: .7 }}>({(products[t] || []).length})</span>
          </button>
        ))}
        <div style={{ marginLeft: "auto" }}>
          <GoldBtn onClick={() => setModal("add")}><Plus size={13} /> Add Product</GoldBtn>
        </div>
      </div>

      {/* Product grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill,minmax(272px,1fr))",
        gap: 16,
      }}>
        {current.map(p => {
          const discount = Math.round((1 - p.price / p.originalPrice) * 100);
          return (
            <div key={p.id} style={{
              background: C.card, border: `1px solid ${C.border}`,
              borderRadius: 16, overflow: "hidden",
              transition: "transform .25s, box-shadow .25s",
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,.3)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
            >
              {/* Image */}
              <div style={{ position: "relative", height: 170 }}>
                <img src={p.image} alt={p.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                {p.featured && (
                  <span style={{
                    position: "absolute", top: 10, left: 10,
                    background: C.gold, color: "#1a1205",
                    fontSize: 9, fontWeight: 800, padding: "3px 9px",
                    borderRadius: 99, letterSpacing: ".08em",
                  }}>★ FEATURED</span>
                )}
                <span style={{
                  position: "absolute", top: 10, right: 10,
                  background: "rgba(0,0,0,.65)", color: C.gold,
                  fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 99,
                }}>
                  {discount}% OFF
                </span>
              </div>

              {/* Details */}
              <div style={{ padding: "14px 16px" }}>
                <p style={{ margin: "0 0 2px", fontWeight: 700, color: C.text, fontSize: 14,
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</p>
                <p style={{ margin: "0 0 10px", color: C.dim, fontSize: 11 }}>{p.brand}</p>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <div>
                    <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 18, fontWeight: 700, color: C.text }}>
                      ₹{Number(p.price).toLocaleString("en-IN")}
                    </span>
                    <span style={{ fontSize: 11, color: C.dim, textDecoration: "line-through", marginLeft: 6 }}>
                      ₹{Number(p.originalPrice).toLocaleString("en-IN")}
                    </span>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: p.stock < 10 ? C.red : C.green }}>
                    Stock: {p.stock}
                  </span>
                </div>

                <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
                  <GoldBtn small outline onClick={() => setModal(p)}><Edit2 size={11} /> Edit</GoldBtn>
                  <GoldBtn small outline onClick={() => onToggleFeatured(tab, p.id)}>
                    <Star size={11} /> {p.featured ? "Unfeature" : "Feature"}
                  </GoldBtn>
                  <GoldBtn small danger onClick={() => setDeleteId(p.id)}><Trash2 size={11} /></GoldBtn>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty state */}
      {current.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <p style={{ color: C.muted, fontSize: 14, marginBottom: 16 }}>No products in this category yet.</p>
          <GoldBtn onClick={() => setModal("add")}><Plus size={13} /> Add First Product</GoldBtn>
        </div>
      )}

      {/* Delete confirm */}
      {deleteId && (
        <ConfirmDialog
          title="Delete Product?"
          message="This will permanently remove the product. This action cannot be undone."
          confirmLabel="Delete Product"
          onConfirm={() => { onDeleteProduct(tab, deleteId); setDeleteId(null); }}
          onCancel={() => setDeleteId(null)}
        />
      )}

      {/* Add / Edit modal */}
      {modal && (
        <ProductModal
          product={modal === "add" ? null : modal}
          onClose={() => setModal(null)}
          onSave={(form) => onSaveProduct(tab, form)}
        />
      )}
    </div>
  );
}