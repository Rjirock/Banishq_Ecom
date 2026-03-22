// app/admin/pages/ProductsPage.jsx
"use client";

import React, { useState, useRef } from "react";
import {
  Package, Plus, Edit2, Trash2, Star,
  Save, X, Camera, Upload, ChevronDown,
  ChevronUp, Info, FileText, MessageSquare,
  ListChecks, Tag, Image,
} from "lucide-react";
import {
  SectionTitle, Badge, GoldBtn, ModalShell,
  ConfirmDialog,
} from "../components/AdminUI";
import { C, inputStyle, labelStyle } from "../data/theme";
import { PRODUCT_CATEGORIES, CATEGORY_LABELS } from "../data/products.data";

/* ─────────────────────────────────────────────────────────────
   BLANK PRODUCT — matches the frontend product data shape
───────────────────────────────────────────────────────────── */
const BLANK_PRODUCT = {
  name:             "",
  slug:             "",
  category:         "",
  brand:            "",
  price:            "",
  oldPrice:         "",
  discount:         "",
  rating:           "",
  totalReviews:     "",
  stock:            "",
  featured:         false,

  // Images — array of URLs/base64 (admin uploads up to 7)
  images:           ["", "", "", "", "", "", ""],

  shortDescription: "",
  description:      "",

  // Features — array of strings (one per line in textarea, split on save)
  features:         "",

  // Specifications — array of strings
  specifications:   "",

  // Additional info — array of { label, value } pairs
  additionalInfo:   [
    { label: "", value: "" },
  ],

  // Reviews — array of { name, rating, comment }
  reviews:          [],
};

/* ─────────────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────────────── */
function slugify(str) {
  return str.toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
}

function linesToArray(str) {
  return str.split("\n").map(s => s.trim()).filter(Boolean);
}

function arrayToLines(arr) {
  if (!Array.isArray(arr)) return "";
  return arr.join("\n");
}

/* ─────────────────────────────────────────────────────────────
   SECTION DIVIDER inside modal
───────────────────────────────────────────────────────────── */
function ModalSection({ icon: Icon, title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ marginBottom: 18 }}>
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        style={{
          width: "100%", display: "flex", alignItems: "center", gap: 9,
          padding: "10px 14px", borderRadius: 10,
          background: C.goldBg, border: `1px solid rgba(201,168,76,.25)`,
          cursor: "pointer", marginBottom: open ? 14 : 0,
          transition: "margin .2s",
        }}
      >
        <Icon size={14} color={C.gold} />
        <span style={{ fontSize: 11.5, fontWeight: 700, color: C.gold,
          letterSpacing: ".14em", textTransform: "uppercase", flex: 1, textAlign: "left" }}>
          {title}
        </span>
        {open ? <ChevronUp size={13} color={C.gold} /> : <ChevronDown size={13} color={C.gold} />}
      </button>
      {open && <div>{children}</div>}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   FIELD HELPER
───────────────────────────────────────────────────────────── */
function Field({ label, required, hint, children }) {
  return (
    <div style={{ marginBottom: 13 }}>
      <label style={{ ...labelStyle, display: "flex", alignItems: "center", gap: 5 }}>
        {label}
        {required && <span style={{ color: C.red, fontSize: 10 }}>*</span>}
        {hint && (
          <span style={{ fontSize: 10, color: C.dim, fontWeight: 400,
            letterSpacing: 0, textTransform: "none" }}>
            {hint}
          </span>
        )}
      </label>
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   IMAGE UPLOAD SECTION — 7 slots, device upload, grid preview
───────────────────────────────────────────────────────────── */
function ImageUploadSection({ images, setImage }) {
  const inputRefs = Array.from({ length: 7 }, () => useRef(null));
  const [preview, setPreview] = React.useState(null); // full-screen preview index

  const handleFile = (i, file) => {
    if (!file || !file.type.startsWith("image/")) return;
    if (file.size > 5 * 1024 * 1024) { alert("Image must be under 5 MB"); return; }
    const reader = new FileReader();
    reader.onload = () => setImage(i, reader.result);
    reader.readAsDataURL(file);
  };

  const filledCount = images.filter(Boolean).length;

  return (
    <div>
      <style>{`
        @keyframes imgFade { from{opacity:0;transform:scale(.92)} to{opacity:1;transform:scale(1)} }
        @keyframes overlayIn { from{opacity:0} to{opacity:1} }
      `}</style>

      {/* Full-screen preview modal */}
      {preview !== null && images[preview] && (
        <div
          onClick={() => setPreview(null)}
          style={{
            position: "fixed", inset: 0, zIndex: 99999,
            background: "rgba(0,0,0,.88)", backdropFilter: "blur(6px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            animation: "overlayIn .2s ease both",
          }}
        >
          <div style={{ position: "relative", maxWidth: "90vw", maxHeight: "85vh" }}
               onClick={e => e.stopPropagation()}>
            <img
              src={images[preview]}
              alt={`preview-${preview}`}
              style={{
                maxWidth: "90vw", maxHeight: "85vh",
                borderRadius: 16, objectFit: "contain",
                boxShadow: "0 24px 60px rgba(0,0,0,.5)",
                animation: "imgFade .25s ease both",
              }}
            />
            {/* Close */}
            <button
              onClick={() => setPreview(null)}
              style={{
                position: "absolute", top: -12, right: -12,
                width: 32, height: 32, borderRadius: "50%",
                background: "#fff", border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 2px 10px rgba(0,0,0,.3)",
                fontSize: 14, color: "#1a1a1a",
              }}
            >✕</button>
            {/* Nav arrows */}
            <div style={{ position: "absolute", top: "50%", left: -52, transform: "translateY(-50%)" }}>
              <button onClick={() => {
                let p = preview - 1;
                while (p >= 0 && !images[p]) p--;
                if (p >= 0) setPreview(p);
              }} style={{
                width: 40, height: 40, borderRadius: "50%",
                background: "rgba(255,255,255,.9)", border: "none",
                cursor: "pointer", fontSize: 16, display: "flex",
                alignItems: "center", justifyContent: "center",
              }}>‹</button>
            </div>
            <div style={{ position: "absolute", top: "50%", right: -52, transform: "translateY(-50%)" }}>
              <button onClick={() => {
                let p = preview + 1;
                while (p < 7 && !images[p]) p++;
                if (p < 7) setPreview(p);
              }} style={{
                width: 40, height: 40, borderRadius: "50%",
                background: "rgba(255,255,255,.9)", border: "none",
                cursor: "pointer", fontSize: 16, display: "flex",
                alignItems: "center", justifyContent: "center",
              }}>›</button>
            </div>
            {/* Position indicator */}
            <p style={{ textAlign: "center", color: "rgba(255,255,255,.6)",
              fontSize: 12, marginTop: 10 }}>
              Image {preview + 1} of 7 · Click outside to close
            </p>
          </div>
        </div>
      )}

      {/* Info row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <p style={{ margin: 0, fontSize: 12, color: C.dim, lineHeight: 1.5 }}>
          Upload up to 7 images from your device. First image is the main display image.
        </p>
        <span style={{
          fontSize: 11, fontWeight: 700, color: filledCount > 0 ? C.gold : C.dim,
          background: filledCount > 0 ? "rgba(201,168,76,.12)" : C.bg,
          padding: "3px 10px", borderRadius: 99,
          border: `1px solid ${filledCount > 0 ? "rgba(201,168,76,.25)" : C.border}`,
        }}>
          {filledCount}/7 uploaded
        </span>
      </div>

      {/* 7-slot grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr 1fr",
        gap: 10,
      }}>
        {images.map((img, i) => (
          <div key={i} style={{ position: "relative" }}>
            {/* Slot */}
            <div
              onClick={() => inputRefs[i].current?.click()}
              style={{
                width: "100%",
                aspectRatio: "1 / 1",
                borderRadius: 12,
                border: `2px dashed ${img ? C.gold : C.border}`,
                background: img ? "transparent" : C.bg,
                cursor: "pointer",
                overflow: "hidden",
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                transition: "all .2s", position: "relative",
              }}
              onMouseEnter={e => {
                if (!img) {
                  e.currentTarget.style.borderColor = C.gold;
                  e.currentTarget.style.background = C.goldBg;
                }
              }}
              onMouseLeave={e => {
                if (!img) {
                  e.currentTarget.style.borderColor = C.border;
                  e.currentTarget.style.background = C.bg;
                }
              }}
            >
              {img ? (
                <>
                  <img src={img} alt={`product-${i}`}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  {/* Hover overlay on filled slot */}
                  <div className="img-hover-overlay" style={{
                    position: "absolute", inset: 0,
                    background: "rgba(0,0,0,.45)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    opacity: 0, transition: "opacity .2s",
                  }}
                    onMouseEnter={e => e.currentTarget.style.opacity = 1}
                    onMouseLeave={e => e.currentTarget.style.opacity = 0}
                  >
                    <div style={{ display: "flex", gap: 6 }}>
                      <button
                        type="button"
                        onClick={e => { e.stopPropagation(); setPreview(i); }}
                        style={{
                          padding: "5px 10px", borderRadius: 7, border: "none",
                          background: "rgba(255,255,255,.9)",
                          color: "#1a1a1a", fontSize: 11, fontWeight: 700,
                          cursor: "pointer",
                        }}>
                        Preview
                      </button>
                      <button
                        type="button"
                        onClick={e => { e.stopPropagation(); setImage(i, ""); }}
                        style={{
                          padding: "5px 10px", borderRadius: 7, border: "none",
                          background: "rgba(220,38,38,.85)",
                          color: "#fff", fontSize: 11, fontWeight: 700,
                          cursor: "pointer",
                        }}>
                        Remove
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <Upload size={18} color={C.dim} style={{ marginBottom: 5 }} />
                  <span style={{ fontSize: 10, color: C.dim, fontWeight: 600 }}>
                    {i === 0 ? "Main" : `Image ${i + 1}`}
                  </span>
                </>
              )}
            </div>

            {/* Main badge */}
            {i === 0 && (
              <span style={{
                position: "absolute", bottom: 6, left: 6,
                background: img ? C.gold : "rgba(0,0,0,.35)",
                color: img ? "#1a1205" : "#fff",
                fontSize: 8.5, fontWeight: 800,
                padding: "2px 6px", borderRadius: 99, letterSpacing: ".06em",
              }}>
                MAIN
              </span>
            )}

            {/* Hidden file input */}
            <input
              ref={inputRefs[i]}
              type="file" accept="image/*"
              style={{ display: "none" }}
              onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(i, f); e.target.value = ""; }}
            />
          </div>
        ))}
      </div>

      {/* Filled image previews strip */}
      {filledCount > 0 && (
        <div style={{ marginTop: 14 }}>
          <p style={{ margin: "0 0 8px", fontSize: 11, fontWeight: 700,
            color: C.muted, letterSpacing: ".1em", textTransform: "uppercase" }}>
            Uploaded Images — click to preview
          </p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {images.map((img, i) => img ? (
              <div key={i}
                onClick={() => setPreview(i)}
                style={{
                  width: 52, height: 52, borderRadius: 9,
                  overflow: "hidden", cursor: "pointer",
                  border: `2px solid ${C.gold}`,
                  boxShadow: "0 2px 8px rgba(201,168,76,.2)",
                  transition: "transform .15s",
                  flexShrink: 0,
                }}
                onMouseEnter={e => e.currentTarget.style.transform = "scale(1.08)"}
                onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                title={`Preview image ${i + 1}`}
              >
                <img src={img} alt={`thumb-${i}`}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            ) : null)}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   PRODUCT MODAL
───────────────────────────────────────────────────────────── */
function ProductModal({ product, onClose, onSave, currentCategory }) {

  /* ── Initialise form from existing product or blank ── */
  const init = product ? {
    ...BLANK_PRODUCT,
    ...product,
    images:          Array.isArray(product.images)
      ? [...product.images, ...Array(7).fill("")].slice(0, 7)
      : [product.image || "", "", "", "", ""],
    features:        arrayToLines(product.features),
    specifications:  arrayToLines(product.specifications),
    additionalInfo:  product.additionalInfo?.length
      ? product.additionalInfo
      : [{ label: "", value: "" }],
  } : { ...BLANK_PRODUCT, category: currentCategory };

  const [form, setForm] = useState(init);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  /* ── Auto-generate slug from name ── */
  const handleNameChange = (v) => {
    set("name", v);
    if (!product) set("slug", slugify(v));
  };

  /* ── Image helper ── */
  const setImage = (i, v) => {
    const imgs = [...form.images];
    imgs[i] = v;
    set("images", imgs);
  };

  /* ── Additional info rows ── */
  const setInfoRow = (i, field, v) => {
    const rows = form.additionalInfo.map((r, idx) =>
      idx === i ? { ...r, [field]: v } : r
    );
    set("additionalInfo", rows);
  };
  const addInfoRow    = () => set("additionalInfo", [...form.additionalInfo, { label: "", value: "" }]);
  const removeInfoRow = (i) => set("additionalInfo", form.additionalInfo.filter((_, idx) => idx !== i));

  /* ── Build final product object to save ── */
  const handleSave = () => {
    const finalImages = form.images.filter(Boolean);
    const saved = {
      ...form,
      price:           Number(form.price) || 0,
      oldPrice:        Number(form.oldPrice) || 0,
      rating:          Number(form.rating) || 0,
      totalReviews:    Number(form.totalReviews) || 0,
      stock:           Number(form.stock) || 0,
      images:          finalImages,
      image:           finalImages[0] || "",   // keep backward compat
      features:        linesToArray(form.features),
      specifications:  linesToArray(form.specifications),
      additionalInfo:  form.additionalInfo.filter(r => r.label && r.value),
    };
    onSave(saved);
    onClose();
  };

  return (
    <ModalShell
      title={product ? "Edit Product" : "Add New Product"}
      subtitle={product?.id ?? "New product"}
      onClose={onClose}
      maxWidth={620}
    >
      {/* ════════════════════════════════════
          SECTION 1 — Basic Info
      ════════════════════════════════════ */}
      <ModalSection icon={Package} title="Basic Information">

        {/* Name */}
        <Field label="Product Name" required>
          <input value={form.name} onChange={e => handleNameChange(e.target.value)}
            placeholder="e.g. Gold Plated Crystal Wing Earrings"
            style={inputStyle} />
        </Field>

        {/* Slug */}
        <Field label="Slug (URL key)" hint="(auto-generated from name)">
          <input value={form.slug}
            onChange={e => set("slug", slugify(e.target.value))}
            placeholder="e.g. gold-plated-crystal-wing-earrings"
            style={{ ...inputStyle, fontFamily: "monospace", fontSize: 13 }}
          />
        </Field>

        {/* Category + Brand */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Field label="Category" required>
            <input value={form.category}
              onChange={e => set("category", e.target.value)}
              placeholder="e.g. Earring"
              style={inputStyle} />
          </Field>
          <Field label="Brand">
            <input value={form.brand} onChange={e => set("brand", e.target.value)}
              placeholder="e.g. Heritage Weaves" style={inputStyle} />
          </Field>
        </div>

        {/* Short description */}
        <Field label="Short Description" hint="(shown on product card)">
          <input value={form.shortDescription}
            onChange={e => set("shortDescription", e.target.value)}
            placeholder="e.g. Perfect for weddings and festive occasions."
            style={inputStyle} />
        </Field>
      </ModalSection>

      {/* ════════════════════════════════════
          SECTION 2 — Pricing & Stock
      ════════════════════════════════════ */}
      <ModalSection icon={Tag} title="Pricing & Stock">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
          <Field label="Selling Price (₹)" required>
            <input type="number" value={form.price}
              onChange={e => set("price", e.target.value)}
              placeholder="1999" style={inputStyle} />
          </Field>
          <Field label="Original Price (₹)">
            <input type="number" value={form.oldPrice}
              onChange={e => set("oldPrice", e.target.value)}
              placeholder="2499" style={inputStyle} />
          </Field>
          <Field label="Stock Qty" required>
            <input type="number" value={form.stock}
              onChange={e => set("stock", e.target.value)}
              placeholder="50" style={inputStyle} />
          </Field>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          <Field label='Discount Label' hint='(e.g. "20% OFF")'>
            <input value={form.discount}
              onChange={e => set("discount", e.target.value)}
              placeholder="20% OFF" style={inputStyle} />
          </Field>
          <Field label="Rating" hint="(0–5)">
            <input type="number" min="0" max="5" step="0.1"
              value={form.rating}
              onChange={e => set("rating", e.target.value)}
              placeholder="4.8" style={inputStyle} />
          </Field>
          <Field label="Total Reviews">
            <input type="number" value={form.totalReviews}
              onChange={e => set("totalReviews", e.target.value)}
              placeholder="245" style={inputStyle} />
          </Field>
        </div>

        {/* Featured toggle */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "11px 14px", borderRadius: 11,
          background: form.featured ? "rgba(201,168,76,.08)" : C.bg,
          border: `1px solid ${form.featured ? "rgba(201,168,76,.3)" : C.border}`,
          marginTop: 4,
        }}>
          <span style={{ fontSize: 13.5, fontWeight: 600,
            color: form.featured ? C.gold : C.muted }}>
            ★ Mark as Featured Product
          </span>
          <button type="button" onClick={() => set("featured", !form.featured)} style={{
            width: 44, height: 24, borderRadius: 99, border: "none",
            cursor: "pointer", position: "relative",
            background: form.featured ? C.gold : C.border,
            transition: "background .25s",
          }}>
            <div style={{
              width: 18, height: 18, borderRadius: "50%", background: "#fff",
              position: "absolute", top: 3,
              left: form.featured ? 23 : 3, transition: "left .25s",
              boxShadow: "0 1px 4px rgba(0,0,0,.2)",
            }} />
          </button>
        </div>
      </ModalSection>

      {/* ════════════════════════════════════
          SECTION 3 — Images
      ════════════════════════════════════ */}
      <ModalSection icon={Image} title="Product Images (up to 7)">
        <ImageUploadSection images={form.images} setImage={setImage} />
      </ModalSection>

      {/* ════════════════════════════════════
          SECTION 4 — Description
      ════════════════════════════════════ */}
      <ModalSection icon={FileText} title="Description" defaultOpen={false}>
        <Field label="Full Description">
          <textarea
            value={form.description}
            onChange={e => set("description", e.target.value)}
            placeholder="Grace your look with timeless elegance…"
            rows={5}
            style={{ ...inputStyle, resize: "vertical", lineHeight: 1.65 }}
          />
        </Field>
      </ModalSection>

      {/* ════════════════════════════════════
          SECTION 5 — Features & Specs
      ════════════════════════════════════ */}
      <ModalSection icon={ListChecks} title="Features & Specifications" defaultOpen={false}>
        <Field label="Features" hint="(one per line)">
          <textarea
            value={form.features}
            onChange={e => set("features", e.target.value)}
            placeholder={"Premium Gold Plating Finish\nHigh-Quality Sparkling Crystals\nLightweight & Comfortable to Wear"}
            rows={4}
            style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit", lineHeight: 1.65 }}
          />
        </Field>
        <Field label="Specifications" hint="(one per line)">
          <textarea
            value={form.specifications}
            onChange={e => set("specifications", e.target.value)}
            placeholder={"Type: Stud Earrings\nMaterial: Alloy with Gold Plating\nClosure: Push Back"}
            rows={4}
            style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit", lineHeight: 1.65 }}
          />
        </Field>
      </ModalSection>

      {/* ════════════════════════════════════
          SECTION 6 — Additional Info tab
      ════════════════════════════════════ */}
      <ModalSection icon={Info} title="Additional Information" defaultOpen={false}>
        <p style={{ margin: "0 0 10px", fontSize: 12, color: C.dim }}>
          These key-value pairs appear in the "Additional Info" tab on the product page.
        </p>
        {form.additionalInfo.map((row, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto",
            gap: 8, marginBottom: 8, alignItems: "center" }}>
            <input
              value={row.label}
              onChange={e => setInfoRow(i, "label", e.target.value)}
              placeholder="Label (e.g. Material)"
              style={{ ...inputStyle, fontSize: 13 }}
            />
            <input
              value={row.value}
              onChange={e => setInfoRow(i, "value", e.target.value)}
              placeholder="Value (e.g. Gold Plating)"
              style={{ ...inputStyle, fontSize: 13 }}
            />
            <button type="button" onClick={() => removeInfoRow(i)}
              style={{ background: "none", border: "none", cursor: "pointer",
                color: C.dim, padding: 4, display: "flex", transition: "color .15s" }}
              onMouseEnter={e => e.currentTarget.style.color = C.red}
              onMouseLeave={e => e.currentTarget.style.color = C.dim}
            >
              <X size={13} />
            </button>
          </div>
        ))}
        <button type="button" onClick={addInfoRow} style={{
          display: "flex", alignItems: "center", gap: 5,
          padding: "7px 13px", borderRadius: 9,
          border: `1.5px dashed ${C.border}`, background: "transparent",
          color: C.muted, fontSize: 12, fontWeight: 700, cursor: "pointer",
          marginTop: 4, transition: "all .2s",
        }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = C.gold; e.currentTarget.style.color = C.gold; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted; }}
        >
          <Plus size={12} /> Add Row
        </button>
      </ModalSection>

      {/* ════════════════════════════════════
          SAVE / CANCEL
      ════════════════════════════════════ */}
      <div style={{ display: "flex", gap: 10, paddingTop: 6 }}>
        <GoldBtn onClick={handleSave}>
          <Save size={13} /> {product ? "Save Changes" : "Add Product"}
        </GoldBtn>
        <GoldBtn outline onClick={onClose}><X size={13} /> Cancel</GoldBtn>
      </div>
    </ModalShell>
  );
}

/* ─────────────────────────────────────────────────────────────
   MAIN PRODUCTS PAGE
───────────────────────────────────────────────────────────── */
export default function ProductsPage({ products, onSaveProduct, onDeleteProduct, onToggleFeatured }) {
  const [tab,      setTab]      = useState("women");
  const [modal,    setModal]    = useState(null);   // null | "add" | product obj
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
          <button key={t} onClick={() => setTab(t)} style={{
            padding: "9px 20px", borderRadius: 10, cursor: "pointer",
            fontSize: 13, fontWeight: 700, letterSpacing: ".04em", transition: "all .2s",
            background: tab === t ? C.gold : C.card,
            color: tab === t ? "#1a1205" : C.muted,
            border: `1px solid ${tab === t ? C.gold : C.border}`,
          }}>
            {CATEGORY_LABELS[t]}
            <span style={{ marginLeft: 6, fontSize: 11, opacity: .7 }}>
              ({(products[t] || []).length})
            </span>
          </button>
        ))}
        <div style={{ marginLeft: "auto" }}>
          <GoldBtn onClick={() => setModal("add")}><Plus size={13} /> Add Product</GoldBtn>
        </div>
      </div>

      {/* Product grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(272px,1fr))", gap: 16 }}>
        {current.map(p => {
          /* support both old (price/originalPrice) and new (price/oldPrice) shapes */
          const sellPrice = p.price;
          const origPrice = p.oldPrice ?? p.originalPrice;
          const discount  = origPrice
            ? Math.round((1 - sellPrice / origPrice) * 100)
            : 0;
          /* first image from array or legacy image field */
          const thumb = Array.isArray(p.images) ? p.images[0] : p.image;

          return (
            <div key={p.id} style={{
              background: C.card, border: `1px solid ${C.border}`,
              borderRadius: 16, overflow: "hidden",
              transition: "transform .25s, box-shadow .25s",
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 12px 28px rgba(0,0,0,.12)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
            >
              {/* Image */}
              <div style={{ position: "relative", height: 170 }}>
                <img src={thumb} alt={p.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                {p.featured && (
                  <span style={{
                    position: "absolute", top: 10, left: 10,
                    background: C.gold, color: "#1a1205",
                    fontSize: 9, fontWeight: 800, padding: "3px 9px",
                    borderRadius: 99, letterSpacing: ".08em",
                  }}>★ FEATURED</span>
                )}
                {discount > 0 && (
                  <span style={{
                    position: "absolute", top: 10, right: 10,
                    background: "rgba(0,0,0,.65)", color: C.gold,
                    fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 99,
                  }}>
                    {p.discount || `${discount}% OFF`}
                  </span>
                )}
                {/* Image count badge */}
                {Array.isArray(p.images) && p.images.length > 1 && (
                  <span style={{
                    position: "absolute", bottom: 8, right: 8,
                    background: "rgba(0,0,0,.55)", color: "#fff",
                    fontSize: 9.5, fontWeight: 700, padding: "2px 7px", borderRadius: 99,
                  }}>
                    +{p.images.length - 1} more
                  </span>
                )}
              </div>

              {/* Details */}
              <div style={{ padding: "14px 16px" }}>
                <p style={{ margin: "0 0 2px", fontWeight: 700, color: C.text, fontSize: 14,
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {p.name}
                </p>
                <p style={{ margin: "0 0 2px", color: C.dim, fontSize: 11 }}>
                  {p.brand}{p.category ? ` · ${p.category}` : ""}
                </p>
                {p.shortDescription && (
                  <p style={{ margin: "0 0 10px", color: C.muted, fontSize: 11,
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {p.shortDescription}
                  </p>
                )}

                <div style={{ display: "flex", justifyContent: "space-between",
                  alignItems: "center", marginBottom: 12 }}>
                  <div>
                    <span style={{ fontFamily: "'Cormorant Garamond',serif",
                      fontSize: 18, fontWeight: 700, color: C.text }}>
                      ₹{Number(sellPrice).toLocaleString("en-IN")}
                    </span>
                    {origPrice > 0 && (
                      <span style={{ fontSize: 11, color: C.dim,
                        textDecoration: "line-through", marginLeft: 6 }}>
                        ₹{Number(origPrice).toLocaleString("en-IN")}
                      </span>
                    )}
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700,
                    color: p.stock < 10 ? C.red : C.green }}>
                    Stock: {p.stock}
                  </span>
                </div>

                {/* Rating */}
                {p.rating > 0 && (
                  <p style={{ margin: "0 0 10px", fontSize: 11, color: C.muted }}>
                    ★ {p.rating} ({p.totalReviews} reviews)
                  </p>
                )}

                <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
                  <GoldBtn small outline onClick={() => setModal(p)}>
                    <Edit2 size={11} /> Edit
                  </GoldBtn>
                  <GoldBtn small outline onClick={() => onToggleFeatured(tab, p.id)}>
                    <Star size={11} /> {p.featured ? "Unfeature" : "Feature"}
                  </GoldBtn>
                  <GoldBtn small danger onClick={() => setDeleteId(p.id)}>
                    <Trash2 size={11} />
                  </GoldBtn>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty state */}
      {current.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <p style={{ color: C.muted, fontSize: 14, marginBottom: 16 }}>
            No products in this category yet.
          </p>
          <GoldBtn onClick={() => setModal("add")}><Plus size={13} /> Add First Product</GoldBtn>
        </div>
      )}

      {/* Delete confirm */}
      {deleteId && (
        <ConfirmDialog
          title="Delete Product?"
          message="This will permanently remove the product and all its data. This cannot be undone."
          confirmLabel="Delete Product"
          danger
          onConfirm={() => { onDeleteProduct(tab, deleteId); setDeleteId(null); }}
          onCancel={() => setDeleteId(null)}
        />
      )}

      {/* Add / Edit modal */}
      {modal && (
        <ProductModal
          product={modal === "add" ? null : modal}
          currentCategory={CATEGORY_LABELS[tab] ?? tab}
          onClose={() => setModal(null)}
          onSave={(form) => onSaveProduct(tab, form)}
        />
      )}
    </div>
  );
}