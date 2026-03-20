// app/admin/pages/GalleryPage.jsx
"use client";

import { useState } from "react";
import { BookImage, Plus, Trash2, X, Save } from "lucide-react";
import { SectionTitle, GoldBtn, ConfirmDialog, inputStyle, labelStyle } from "../components/AdminUI";
import { C } from "../data/theme";
import { GALLERY_TABS } from "../data/gallery.data";

export default function GalleryPage({ images, onAddImage, onDeleteImage }) {
  const [adding,  setAdding]  = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [filterTab, setFilterTab] = useState("all");
  const [form, setForm] = useState({ src: "", alt: "", tab: "wedding" });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleAdd = () => {
    if (!form.src.trim()) return;
    onAddImage(form);
    setForm({ src: "", alt: "", tab: "wedding" });
    setAdding(false);
  };

  const filtered = filterTab === "all"
    ? images
    : images.filter(i => i.tab === filterTab);

  return (
    <div>
      <SectionTitle
        icon={BookImage}
        title="Gallery Manager"
        subtitle="Add or remove images shown on the public gallery page"
      />

      {/* Toolbar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
        flexWrap: "wrap", gap: 10, marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {["all", ...GALLERY_TABS].map(t => (
            <button key={t} onClick={() => setFilterTab(t)}
              style={{
                padding: "7px 14px", borderRadius: 9, cursor: "pointer",
                fontSize: 12, fontWeight: 700, letterSpacing: ".04em",
                textTransform: "capitalize", transition: "all .2s",
                background: filterTab === t ? C.gold : C.card,
                color: filterTab === t ? "#1a1205" : C.muted,
                border: `1px solid ${filterTab === t ? C.gold : C.border}`,
              }}>
              {t}
            </button>
          ))}
        </div>
        <GoldBtn onClick={() => setAdding(v => !v)}>
          {adding ? <X size={13} /> : <Plus size={13} />}
          {adding ? "Cancel" : "Add Image"}
        </GoldBtn>
      </div>

      {/* Add image form */}
      {adding && (
        <div style={{
          background: C.card, border: `1px solid ${C.gold}55`,
          borderRadius: 16, padding: 20, marginBottom: 20,
        }}>
          <p style={{ margin: "0 0 14px", fontSize: 11, fontWeight: 700, letterSpacing: ".18em",
            textTransform: "uppercase", color: C.gold }}>New Gallery Image</p>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 120px", gap: 12, marginBottom: 12 }}>
            <div>
              <label style={labelStyle}>Image URL</label>
              <input value={form.src} onChange={e => set("src", e.target.value)}
                placeholder="https://images.unsplash.com/…" style={inputStyle} autoFocus />
            </div>
            <div>
              <label style={labelStyle}>Alt Text</label>
              <input value={form.alt} onChange={e => set("alt", e.target.value)}
                placeholder="Image description" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Gallery Tab</label>
              <select value={form.tab} onChange={e => set("tab", e.target.value)}
                style={{ ...inputStyle, cursor: "pointer" }}>
                {GALLERY_TABS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          {/* URL preview */}
          {form.src && (
            <div style={{ marginBottom: 12 }}>
              <p style={{ ...labelStyle, marginBottom: 6 }}>Preview</p>
              <img src={form.src} alt="preview"
                style={{ height: 100, borderRadius: 10, objectFit: "cover" }}
                onError={e => e.target.style.display = "none"} />
            </div>
          )}

          <div style={{ display: "flex", gap: 8 }}>
            <GoldBtn small onClick={handleAdd}><Save size={12} /> Add Image</GoldBtn>
            <GoldBtn small outline onClick={() => setAdding(false)}><X size={12} /> Cancel</GoldBtn>
          </div>
        </div>
      )}

      {/* Count */}
      <p style={{ fontSize: 12, color: C.dim, marginBottom: 14 }}>
        Showing <strong style={{ color: C.text }}>{filtered.length}</strong> images
      </p>

      {/* Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))",
        gap: 14,
      }}>
        {filtered.map(img => (
          <div key={img.id} style={{
            background: C.card, border: `1px solid ${C.border}`,
            borderRadius: 14, overflow: "hidden",
            transition: "transform .25s, box-shadow .25s",
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 10px 28px rgba(0,0,0,.3)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
          >
            <div style={{ position: "relative", height: 155 }}>
              <img src={img.src} alt={img.alt}
                style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <button
                onClick={() => setDeleteId(img.id)}
                style={{
                  position: "absolute", top: 8, right: 8,
                  width: 28, height: 28, borderRadius: "50%",
                  background: "rgba(239,68,68,.85)", border: "none",
                  cursor: "pointer", display: "flex", alignItems: "center",
                  justifyContent: "center", color: "#fff",
                }}>
                <Trash2 size={12} />
              </button>
              <span style={{
                position: "absolute", bottom: 8, left: 8,
                background: "rgba(0,0,0,.68)", color: C.gold,
                fontSize: 9, fontWeight: 700, padding: "2px 8px",
                borderRadius: 99, letterSpacing: ".1em", textTransform: "uppercase",
              }}>
                {img.tab}
              </span>
            </div>
            <p style={{ padding: "9px 12px", margin: 0, color: C.muted, fontSize: 12,
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {img.alt || "—"}
            </p>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <p style={{ color: C.muted, fontSize: 14 }}>No images found for this tab.</p>
        </div>
      )}

      {deleteId && (
        <ConfirmDialog
          title="Delete Image?"
          message="This will remove the image from the gallery permanently."
          confirmLabel="Delete Image"
          onConfirm={() => { onDeleteImage(deleteId); setDeleteId(null); }}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
}