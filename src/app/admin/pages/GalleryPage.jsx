// app/admin/pages/GalleryPage.jsx
"use client";

import { useState, useRef, useCallback } from "react";
import {
  BookImage, Plus, Trash2, X, Save,
  Upload, Image, AlertCircle, CheckCircle2,
} from "lucide-react";
import {
  SectionTitle, GoldBtn, ConfirmDialog,
} from "../components/AdminUI";
import { C, inputStyle, labelStyle } from "../data/theme";
import { GALLERY_TABS } from "../data/gallery.data";

/* ─────────────────────────────────────────────
   Read File → base64 data URL
───────────────────────────────────────────── */
function readFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/* ─────────────────────────────────────────────
   Validate image file
───────────────────────────────────────────── */
function validateFile(file) {
  if (!file.type.startsWith("image/")) return "Only image files are allowed";
  if (file.size > 5 * 1024 * 1024)    return "File must be under 5 MB";
  return null;
}

/* ─────────────────────────────────────────────
   FORMAT file size
───────────────────────────────────────────── */
function fmtSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/* ─────────────────────────────────────────────
   STAGED IMAGE ITEM — shown in queue before save
───────────────────────────────────────────── */
function StagedItem({ item, onRemove, onChangeAlt, onChangeTab }) {
  return (
    <div style={{
      display: "flex", gap: 12, alignItems: "flex-start",
      padding: "12px 14px", borderRadius: 12,
      background: C.card, border: `1.5px solid ${C.border}`,
      animation: "stageFade .25s ease both",
    }}>
      {/* Thumbnail */}
      <img src={item.src} alt={item.alt}
        style={{ width: 60, height: 60, borderRadius: 9,
          objectFit: "cover", flexShrink: 0, border: `1px solid ${C.border}` }} />

      {/* Fields */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: "0 0 6px", fontSize: 12, color: C.text, fontWeight: 600,
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {item.fileName}
        </p>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            value={item.alt}
            onChange={e => onChangeAlt(e.target.value)}
            placeholder="Alt text / caption"
            style={{ ...inputStyle, flex: 1, fontSize: 12, padding: "7px 10px" }}
          />
          <select
            value={item.tab}
            onChange={e => onChangeTab(e.target.value)}
            style={{ ...inputStyle, width: 120, fontSize: 12, padding: "7px 10px", cursor: "pointer" }}
          >
            {GALLERY_TABS.map(t => (
              <option key={t} value={t} style={{ textTransform: "capitalize" }}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Remove */}
      <button onClick={onRemove} style={{
        background: "none", border: "none", cursor: "pointer",
        color: C.dim, padding: 4, display: "flex",
        flexShrink: 0, transition: "color .15s",
      }}
        onMouseEnter={e => e.currentTarget.style.color = C.red}
        onMouseLeave={e => e.currentTarget.style.color = C.dim}
      >
        <X size={14} />
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN GALLERY PAGE
───────────────────────────────────────────── */
export default function GalleryPage({ images, onAddImage, onDeleteImage }) {
  const fileInputRef = useRef(null);

  const [staged,    setStaged]    = useState([]);   // files picked but not yet saved
  const [dragging,  setDragging]  = useState(false);
  const [errors,    setErrors]    = useState([]);   // per-file error messages
  const [saving,    setSaving]    = useState(false);
  const [saved,     setSaved]     = useState(false);
  const [deleteId,  setDeleteId]  = useState(null);
  const [filterTab, setFilterTab] = useState("all");

  const filtered = filterTab === "all"
    ? images
    : images.filter(i => i.tab === filterTab);

  /* ── Process picked files ── */
  const processFiles = useCallback(async (files) => {
    const errs = [];
    const newItems = [];

    for (const file of Array.from(files)) {
      const err = validateFile(file);
      if (err) { errs.push(`${file.name}: ${err}`); continue; }

      const src = await readFile(file);
      newItems.push({
        _id:      `staged-${Date.now()}-${Math.random()}`,
        src,
        alt:      "",
        tab:      GALLERY_TABS[0] ?? "wedding",
        fileName: file.name,
        fileSize: fmtSize(file.size),
      });
    }

    setErrors(errs);
    setStaged(prev => [...prev, ...newItems]);
  }, []);

  /* ── Input file change ── */
  const onInputChange = (e) => {
    if (e.target.files?.length) processFiles(e.target.files);
    e.target.value = "";
  };

  /* ── Drag handlers ── */
  const onDragOver  = (e) => { e.preventDefault(); setDragging(true);  };
  const onDragLeave = ()    => setDragging(false);
  const onDrop      = (e)   => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files?.length) processFiles(e.dataTransfer.files);
  };

  /* ── Update staged item ── */
  const updateStaged = (id, field, val) =>
    setStaged(prev => prev.map(i => i._id === id ? { ...i, [field]: val } : i));
  const removeStaged = (id) =>
    setStaged(prev => prev.filter(i => i._id !== id));

  /* ── Save all staged images ── */
  const handleSaveAll = async () => {
    if (!staged.length) return;
    setSaving(true);

    // In production, upload base64 to your storage (S3/Cloudinary etc.)
    // and replace src with the returned CDN URL before calling onAddImage.
    // TODO: const uploaded = await api.post("/gallery/upload", staged)
    //       uploaded.forEach(img => onAddImage(img))
    for (const item of staged) {
      onAddImage({ src: item.src, alt: item.alt, tab: item.tab });
    }

    await new Promise(r => setTimeout(r, 400));
    setSaving(false);
    setSaved(true);
    setStaged([]);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div>
      <style>{`
        @keyframes stageFade {
          from { opacity:0; transform:translateX(-8px); }
          to   { opacity:1; transform:translateX(0); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <SectionTitle
        icon={BookImage}
        title="Gallery Manager"
        subtitle="Upload images from your device to the public gallery. Drag & drop multiple images at once."
      />

      {/* ── Drag & Drop Upload Zone ── */}
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
        style={{
          border: `2px dashed ${dragging ? C.gold : C.border}`,
          borderRadius: 16, padding: "32px 20px", textAlign: "center",
          cursor: "pointer", marginBottom: 20,
          background: dragging ? C.goldBg : C.surface,
          transition: "all .2s",
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = C.gold; e.currentTarget.style.background = C.goldBg; }}
        onMouseLeave={e => {
          if (!dragging) {
            e.currentTarget.style.borderColor = C.border;
            e.currentTarget.style.background = C.surface;
          }
        }}
      >
        <div style={{
          width: 52, height: 52, borderRadius: 14, margin: "0 auto 14px",
          background: C.goldBg, border: `1.5px solid rgba(201,168,76,.3)`,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Upload size={22} color={C.gold} />
        </div>
        <p style={{ margin: "0 0 4px", fontSize: 15, fontWeight: 700, color: C.text }}>
          {dragging ? "Drop images here" : "Click to upload or drag & drop"}
        </p>
        <p style={{ margin: 0, fontSize: 12.5, color: C.dim }}>
          JPG, PNG, WebP — max 5 MB each · Multiple files supported
        </p>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={onInputChange}
          style={{ display: "none" }}
        />
      </div>

      {/* ── File errors ── */}
      {errors.length > 0 && (
        <div style={{
          padding: "12px 16px", borderRadius: 12, marginBottom: 16,
          background: "rgba(220,38,38,.07)", border: "1px solid rgba(220,38,38,.2)",
        }}>
          {errors.map((err, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <AlertCircle size={13} color={C.red} />
              <p style={{ margin: 0, fontSize: 12.5, color: C.red }}>{err}</p>
            </div>
          ))}
          <button onClick={() => setErrors([])} style={{
            marginTop: 8, background: "none", border: "none",
            cursor: "pointer", fontSize: 11.5, color: C.red, fontWeight: 700, padding: 0,
          }}>
            Dismiss
          </button>
        </div>
      )}

      {/* ── Staged queue ── */}
      {staged.length > 0 && (
        <div style={{
          background: C.surface, border: `1.5px solid rgba(201,168,76,.3)`,
          borderRadius: 16, padding: "18px 18px 16px", marginBottom: 20,
        }}>
          {/* Queue header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
              <Image size={15} color={C.gold} />
              <span style={{ fontSize: 13, fontWeight: 700, color: C.text }}>
                {staged.length} image{staged.length > 1 ? "s" : ""} ready to save
              </span>
            </div>
            <button onClick={() => setStaged([])} style={{
              background: "none", border: "none", cursor: "pointer",
              fontSize: 12, color: C.muted, fontWeight: 600,
              display: "flex", alignItems: "center", gap: 4,
              transition: "color .15s",
            }}
              onMouseEnter={e => e.currentTarget.style.color = C.red}
              onMouseLeave={e => e.currentTarget.style.color = C.muted}
            >
              <X size={12} /> Clear all
            </button>
          </div>

          {/* Staged items */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
            {staged.map(item => (
              <StagedItem
                key={item._id}
                item={item}
                onRemove={() => removeStaged(item._id)}
                onChangeAlt={v => updateStaged(item._id, "alt", v)}
                onChangeTab={v => updateStaged(item._id, "tab", v)}
              />
            ))}
          </div>

          {/* Save button */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <GoldBtn onClick={handleSaveAll}>
              {saving ? (
                <>
                  <div style={{
                    width: 13, height: 13, borderRadius: "50%",
                    border: "2px solid rgba(245,237,224,.3)",
                    borderTopColor: "#F5EDE0",
                    animation: "spin .7s linear infinite",
                  }} />
                  Saving…
                </>
              ) : saved ? (
                <><CheckCircle2 size={13} /> Saved!</>
              ) : (
                <><Save size={13} /> Save {staged.length} Image{staged.length > 1 ? "s" : ""} to Gallery</>
              )}
            </GoldBtn>
            {saved && (
              <p style={{ margin: 0, fontSize: 13, color: C.green, fontWeight: 600,
                display: "flex", alignItems: "center", gap: 5 }}>
                <CheckCircle2 size={13} /> Added to gallery successfully
              </p>
            )}
          </div>
        </div>
      )}

      {/* ── Filter tabs ── */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
        {["all", ...GALLERY_TABS].map(t => (
          <button key={t} onClick={() => setFilterTab(t)} style={{
            padding: "7px 14px", borderRadius: 9, cursor: "pointer",
            fontSize: 12, fontWeight: 700, letterSpacing: ".04em",
            textTransform: "capitalize", transition: "all .2s",
            background: filterTab === t ? C.gold : C.card,
            color: filterTab === t ? "#1a1205" : C.muted,
            border: `1px solid ${filterTab === t ? C.gold : C.border}`,
          }}>
            {t === "all" ? "All" : t.charAt(0).toUpperCase() + t.slice(1)}
            <span style={{ marginLeft: 5, fontSize: 10, opacity: .7 }}>
              ({t === "all" ? images.length : images.filter(i => i.tab === t).length})
            </span>
          </button>
        ))}
      </div>

      {/* Count */}
      <p style={{ fontSize: 12, color: C.dim, marginBottom: 14 }}>
        Showing <strong style={{ color: C.text }}>{filtered.length}</strong> image{filtered.length !== 1 ? "s" : ""}
      </p>

      {/* ── Gallery grid ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))",
        gap: 14,
      }}>
        {filtered.map(img => (
          <div key={img.id} style={{
            background: C.card, border: `1.5px solid ${C.border}`,
            borderRadius: 14, overflow: "hidden",
            transition: "transform .25s, box-shadow .25s",
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = `0 10px 28px ${C.shadowMd}`; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
          >
            <div style={{ position: "relative", height: 155 }}>
              <img src={img.src} alt={img.alt}
                style={{ width: "100%", height: "100%", objectFit: "cover" }} />

              {/* Delete button */}
              <button
                onClick={() => setDeleteId(img.id)}
                style={{
                  position: "absolute", top: 8, right: 8,
                  width: 28, height: 28, borderRadius: "50%",
                  background: "rgba(220,38,38,.85)", border: "none",
                  cursor: "pointer", display: "flex",
                  alignItems: "center", justifyContent: "center", color: "#fff",
                  transition: "background .15s",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(185,28,28,.95)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(220,38,38,.85)"}
              >
                <Trash2 size={12} />
              </button>

              {/* Tab badge */}
              <span style={{
                position: "absolute", bottom: 8, left: 8,
                background: "rgba(0,0,0,.68)", color: C.gold,
                fontSize: 9, fontWeight: 700, padding: "2px 8px",
                borderRadius: 99, letterSpacing: ".1em", textTransform: "uppercase",
              }}>
                {img.tab}
              </span>
            </div>

            <p style={{
              padding: "9px 12px", margin: 0, color: C.muted, fontSize: 12,
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            }}>
              {img.alt || "—"}
            </p>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div style={{
          textAlign: "center", padding: "56px 0",
          background: C.surface, borderRadius: 16,
          border: `1.5px solid ${C.border}`,
        }}>
          <BookImage size={36} color={C.border} style={{ marginBottom: 12 }} />
          <p style={{ color: C.muted, fontSize: 14, margin: 0 }}>
            {filterTab === "all"
              ? "No images in gallery yet — upload some above"
              : `No images in the "${filterTab}" tab`}
          </p>
        </div>
      )}

      {/* Delete confirm */}
      {deleteId && (
        <ConfirmDialog
          title="Delete Image?"
          message="This will remove the image from the gallery permanently."
          confirmLabel="Delete Image"
          danger
          onConfirm={() => { onDeleteImage(deleteId); setDeleteId(null); }}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
}