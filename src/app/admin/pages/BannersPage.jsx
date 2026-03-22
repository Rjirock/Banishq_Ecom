// app/admin/pages/BannersPage.jsx
"use client";

import { useState, useRef } from "react";
import {
  Image, Upload, Save, X, Check,
  Trash2, ImageOff, RefreshCw, AlertCircle,
} from "lucide-react";
import { SectionTitle, GoldBtn, ConfirmDialog } from "../components/AdminUI";
import { C, labelStyle } from "../data/theme";

/* ─────────────────────────────────────────────
   Read a File object → base64 data URL
───────────────────────────────────────────── */
function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/* ─────────────────────────────────────────────
   BANNER CARD
───────────────────────────────────────────── */
function BannerCard({ banner, onSave }) {
  const inputRef      = useRef(null);
  const dropRef       = useRef(null);

  const [preview,     setPreview]     = useState(null);   // base64 of newly picked file
  const [fileName,    setFileName]    = useState("");
  const [fileSize,    setFileSize]    = useState("");
  const [dragging,    setDragging]    = useState(false);
  const [saving,      setSaving]      = useState(false);
  const [saved,       setSaved]       = useState(false);
  const [error,       setError]       = useState("");
  const [showRemove,  setShowRemove]  = useState(false);

  /* ── Accept a File object (from input or drop) ── */
  const handleFile = async (file) => {
    setError("");
    if (!file) return;

    // Type check
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file (JPG, PNG, WebP, etc.)");
      return;
    }
    // Size check — 5 MB max
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be under 5 MB");
      return;
    }

    const dataUrl = await readFileAsDataURL(file);
    setPreview(dataUrl);
    setFileName(file.name);
    setFileSize((file.size / 1024).toFixed(0) + " KB");
  };

  /* ── Input change ── */
  const onInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    // Reset input so re-selecting same file fires onChange
    e.target.value = "";
  };

  /* ── Drag & drop ── */
  const onDragOver  = (e) => { e.preventDefault(); setDragging(true);  };
  const onDragLeave = ()    => setDragging(false);
  const onDrop      = (e)   => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  /* ── Save ── */
  const handleSave = async () => {
    if (!preview) return;
    setSaving(true);
    // Simulate upload delay (replace with real API call)
    await new Promise(r => setTimeout(r, 700));
    onSave(banner.key, preview);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
    // Keep preview so user sees the new image
  };

  /* ── Discard new upload ── */
  const handleDiscard = () => {
    setPreview(null);
    setFileName("");
    setFileSize("");
    setError("");
  };

  const displaySrc = preview || banner.current;
  const hasNew     = !!preview;

  return (
    <>
      {showRemove && (
        <ConfirmDialog
          title="Remove Banner?"
          message={`This will clear the current image for "${banner.title}". The placeholder will be shown instead.`}
          confirmLabel="Remove"
          danger
          onConfirm={() => {
            onSave(banner.key, "");
            setPreview(null);
            setShowRemove(false);
          }}
          onCancel={() => setShowRemove(false)}
        />
      )}

      <div style={{
        background: C.surface,
        border: `1.5px solid ${hasNew ? C.gold : C.border}`,
        borderRadius: 18, overflow: "hidden",
        boxShadow: `0 2px 14px ${C.shadow}`,
        transition: "border-color .25s, box-shadow .25s",
      }}>

        {/* ── Image preview area ── */}
        <div style={{ position: "relative", height: 200, background: C.bg, overflow: "hidden" }}>
          {displaySrc ? (
            <img
              src={displaySrc}
              alt={banner.title}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          ) : (
            <div style={{
              width: "100%", height: "100%",
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", gap: 8,
            }}>
              <ImageOff size={32} color={C.border} />
              <p style={{ margin: 0, fontSize: 12, color: C.dim }}>No image set</p>
            </div>
          )}

          {/* Dark overlay */}
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to top, rgba(0,0,0,.55) 0%, transparent 55%)",
            pointerEvents: "none",
          }} />

          {/* Title overlay */}
          <div style={{ position: "absolute", bottom: 12, left: 14, right: 14 }}>
            <p style={{ margin: 0, color: "#fff", fontWeight: 700, fontSize: 14 }}>{banner.title}</p>
            <p style={{ margin: "2px 0 0", color: "rgba(255,255,255,.6)", fontSize: 11 }}>
              {banner.description}
            </p>
          </div>

          {/* NEW badge */}
          {hasNew && (
            <div style={{
              position: "absolute", top: 10, right: 10,
              background: C.gold, color: "#1a1205",
              fontSize: 9.5, fontWeight: 800, padding: "3px 10px",
              borderRadius: 99, letterSpacing: ".1em",
            }}>
              NEW PREVIEW
            </div>
          )}

          {/* Saved checkmark */}
          {saved && (
            <div style={{
              position: "absolute", top: 10, left: 10,
              background: C.green, color: "#fff",
              fontSize: 11, fontWeight: 700, padding: "4px 12px",
              borderRadius: 99, display: "flex", alignItems: "center", gap: 5,
              animation: "fadeIn .3s ease both",
            }}>
              <Check size={12} strokeWidth={2.5} /> Saved
            </div>
          )}
        </div>

        {/* ── Upload area ── */}
        <div style={{ padding: "16px 18px 18px" }}>

          {/* Error */}
          {error && (
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "10px 13px", marginBottom: 12,
              background: "rgba(220,38,38,.07)",
              border: `1px solid rgba(220,38,38,.2)`,
              borderRadius: 10,
            }}>
              <AlertCircle size={13} color={C.red} style={{ flexShrink: 0 }} />
              <p style={{ margin: 0, fontSize: 12.5, color: C.red, fontWeight: 600 }}>{error}</p>
            </div>
          )}

          {/* Drag & drop zone */}
          {!hasNew && (
            <div
              ref={dropRef}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              onClick={() => inputRef.current?.click()}
              style={{
                border: `2px dashed ${dragging ? C.gold : C.border}`,
                borderRadius: 13, padding: "22px 16px",
                textAlign: "center", cursor: "pointer",
                background: dragging ? C.goldBg : "transparent",
                transition: "all .2s",
                marginBottom: 12,
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C.gold; e.currentTarget.style.background = C.goldBg; }}
              onMouseLeave={e => {
                if (!dragging) {
                  e.currentTarget.style.borderColor = C.border;
                  e.currentTarget.style.background = "transparent";
                }
              }}
            >
              <div style={{
                width: 40, height: 40, borderRadius: 12,
                background: C.goldBg, border: `1px solid rgba(201,168,76,.25)`,
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 10px",
              }}>
                <Upload size={18} color={C.gold} />
              </div>
              <p style={{ margin: "0 0 3px", fontSize: 13.5, fontWeight: 700, color: C.text }}>
                {dragging ? "Drop image here" : "Click to upload or drag & drop"}
              </p>
              <p style={{ margin: 0, fontSize: 11.5, color: C.dim }}>
                JPG, PNG, WebP — max 5 MB
              </p>
            </div>
          )}

          {/* Hidden file input */}
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={onInputChange}
            style={{ display: "none" }}
          />

          {/* New file info */}
          {hasNew && (
            <div style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "10px 13px", marginBottom: 12,
              background: C.goldBg,
              border: `1.5px solid rgba(201,168,76,.25)`,
              borderRadius: 11,
            }}>
              <Image size={14} color={C.gold} style={{ flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, fontSize: 12.5, fontWeight: 700, color: C.text,
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {fileName}
                </p>
                <p style={{ margin: 0, fontSize: 11, color: C.muted }}>{fileSize}</p>
              </div>
              <button
                onClick={handleDiscard}
                title="Discard"
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  color: C.dim, padding: 3, display: "flex",
                  transition: "color .15s",
                }}
                onMouseEnter={e => e.currentTarget.style.color = C.red}
                onMouseLeave={e => e.currentTarget.style.color = C.dim}
              >
                <X size={14} />
              </button>
            </div>
          )}

          {/* Action buttons */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {hasNew ? (
              <>
                <GoldBtn small onClick={handleSave}>
                  {saving
                    ? <><RefreshCw size={12} style={{ animation: "spin .7s linear infinite" }} /> Saving…</>
                    : saved
                    ? <><Check size={12} /> Saved!</>
                    : <><Save size={12} /> Save Banner</>
                  }
                </GoldBtn>
                <GoldBtn small outline onClick={() => inputRef.current?.click()}>
                  <Upload size={12} /> Replace
                </GoldBtn>
                <GoldBtn small danger onClick={handleDiscard}>
                  <X size={12} /> Discard
                </GoldBtn>
              </>
            ) : (
              <>
                <GoldBtn small outline onClick={() => inputRef.current?.click()}>
                  <Upload size={12} /> Upload Image
                </GoldBtn>
                {banner.current && (
                  <GoldBtn small danger onClick={() => setShowRemove(true)}>
                    <Trash2 size={12} /> Remove
                  </GoldBtn>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────
   BANNERS PAGE
───────────────────────────────────────────── */
export default function BannersPage({ banners, onSaveBanner }) {
  return (
    <div>
      <style>{`
        @keyframes fadeIn { from{opacity:0;transform:translateY(4px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin    { to{transform:rotate(360deg)} }
      `}</style>

      <SectionTitle
        icon={Image}
        title="Banners"
        subtitle="Upload images from your device for the hero banner and all category page banners"
      />

      {/* Info bar */}
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "12px 16px", marginBottom: 24,
        background: "rgba(37,99,235,.06)",
        border: "1px solid rgba(37,99,235,.18)",
        borderRadius: 13,
      }}>
        <AlertCircle size={15} color={C.blue} style={{ flexShrink: 0 }} />
        <p style={{ margin: 0, fontSize: 13, color: C.blue, fontWeight: 500, lineHeight: 1.55 }}>
          Upload images directly from your device. Recommended size: <strong>1920 × 600 px</strong> for hero,{" "}
          <strong>1920 × 400 px</strong> for category banners. Max file size: 5 MB.
        </p>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
        gap: 22,
      }}>
        {Object.values(banners).map(b => (
          <BannerCard key={b.key} banner={b} onSave={onSaveBanner} />
        ))}
      </div>
    </div>
  );
}