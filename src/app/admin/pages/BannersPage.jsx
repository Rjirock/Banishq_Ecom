// app/admin/pages/BannersPage.jsx
"use client";

import { useState } from "react";
import { Image, Upload, Save, X, Eye } from "lucide-react";
import { SectionTitle, GoldBtn, inputStyle, labelStyle } from "../components/AdminUI";
import { C } from "../data/theme";

export default function BannersPage({ banners, onSaveBanner }) {
  const [editing, setEditing] = useState(null); // key of banner being edited
  const [url, setUrl]         = useState("");
  const [preview, setPreview] = useState(false);

  const startEdit = (key, current) => {
    setEditing(key);
    setUrl(current);
    setPreview(false);
  };

  const save = () => {
    if (!url.trim()) return;
    onSaveBanner(editing, url.trim());
    setEditing(null);
    setUrl("");
  };

  return (
    <div>
      <SectionTitle
        icon={Image}
        title="Banners"
        subtitle="Update the hero banner and all category page top banners shown on the frontend"
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 20 }}>
        {Object.values(banners).map(b => (
          <div key={b.key} style={{
            background: C.card, border: `1px solid ${C.border}`,
            borderRadius: 16, overflow: "hidden",
          }}>
            {/* Preview image */}
            <div style={{ position: "relative", height: 180 }}>
              <img
                src={editing === b.key && preview && url ? url : b.current}
                alt={b.title}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                onError={e => { e.target.src = b.current; }}
              />
              <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.35)" }} />
              <div style={{ position: "absolute", bottom: 12, left: 14, right: 14 }}>
                <p style={{ margin: 0, color: "#fff", fontWeight: 700, fontSize: 13 }}>{b.title}</p>
                <p style={{ margin: "2px 0 0", color: "rgba(255,255,255,.6)", fontSize: 11 }}>{b.description}</p>
              </div>
              {editing === b.key && preview && url && (
                <span style={{
                  position: "absolute", top: 10, right: 10,
                  background: C.gold, color: "#1a1205",
                  fontSize: 9, fontWeight: 800, padding: "3px 8px", borderRadius: 99,
                }}>PREVIEW</span>
              )}
            </div>

            {/* Edit panel */}
            <div style={{ padding: 16 }}>
              {editing === b.key ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <div>
                    <label style={labelStyle}>New Image URL</label>
                    <input
                      value={url}
                      onChange={e => { setUrl(e.target.value); setPreview(false); }}
                      placeholder="https://images.unsplash.com/…"
                      style={inputStyle}
                      autoFocus
                    />
                  </div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <GoldBtn small onClick={save}><Save size={12} /> Save Banner</GoldBtn>
                    <GoldBtn small outline onClick={() => setPreview(v => !v)}>
                      <Eye size={12} /> {preview ? "Hide Preview" : "Preview"}
                    </GoldBtn>
                    <GoldBtn small danger onClick={() => { setEditing(null); setUrl(""); }}>
                      <X size={12} /> Cancel
                    </GoldBtn>
                  </div>
                </div>
              ) : (
                <GoldBtn small outline onClick={() => startEdit(b.key, b.current)}>
                  <Upload size={12} /> Change Banner
                </GoldBtn>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}