// app/products/page.jsx
"use client";

import { useState, useEffect } from "react";
import { FilterProvider, useFilters } from "@/context/FilterContext";
import FiltersSidebar from "../products/components/FiltersSidebar";
import ProductsGrid from "../products/components/ProductGrid";
import { SlidersHorizontal, X, ChevronUp, Sparkles } from "lucide-react";

/* ─────────────────────────────────────────────
   MOBILE FILTER SHEET
   Slides up from bottom as a full bottom-sheet
───────────────────────────────────────────── */
function MobileFilterSheet({ open, onClose }) {
  /* lock body scroll when open */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <style>{`
        @keyframes sheetIn  { from{transform:translateY(100%)} to{transform:translateY(0)} }
        @keyframes sheetOut { from{transform:translateY(0)} to{transform:translateY(100%)} }
        @keyframes bdIn     { from{opacity:0} to{opacity:1} }
        @keyframes bdOut    { from{opacity:1} to{opacity:0} }
        .sheet-panel      { animation: sheetIn  .42s cubic-bezier(.22,1,.36,1) both }
        .sheet-panel.out  { animation: sheetOut .3s ease forwards }
        .sheet-bd         { animation: bdIn  .28s ease both }
        .sheet-bd.out     { animation: bdOut .28s ease forwards }
      `}</style>

      {/* Backdrop */}
      <div
        className={`sheet-bd${!open ? " out" : ""}`}
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, zIndex: 9998,
          background: "rgba(10,8,4,0.6)",
          backdropFilter: "blur(4px)",
        }}
      />

      {/* Sheet panel */}
      <div
        className={`sheet-panel${!open ? " out" : ""}`}
        style={{
          position: "fixed", left: 0, right: 0, bottom: 0,
          zIndex: 9999,
          maxHeight: "88vh",
          background: "#fff",
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          boxShadow: "0 -8px 48px rgba(0,0,0,0.18)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Gold top bar */}
        <div style={{
          height: 3,
          background: "linear-gradient(90deg,#C9A84C,#e8c96a,#C9A84C)",
          flexShrink: 0,
        }} />

        {/* Drag handle */}
        <div style={{ display: "flex", justifyContent: "center", padding: "10px 0 4px", flexShrink: 0 }}>
          <div style={{ width: 40, height: 4, borderRadius: 99, background: "#E5D9C8" }} />
        </div>

        {/* Sheet header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "8px 20px 14px",
          borderBottom: "1px solid #f0ece6",
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Sparkles size={14} color="#C9A84C" />
            <span style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 20, fontWeight: 700, color: "#1a1205",
            }}>
              Refine
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 32, height: 32, borderRadius: "50%",
              border: "1.5px solid #EDE5D8", background: "#fdfaf6",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", color: "#888", transition: "all .15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#C9A84C"; e.currentTarget.style.color = "#C9A84C"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#EDE5D8"; e.currentTarget.style.color = "#888"; }}
          >
            <X size={14} strokeWidth={2.5} />
          </button>
        </div>

        {/* Scrollable filters — reuse the existing FiltersSidebar */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 0" }}>
          <FiltersSidebar mobileMode />
        </div>

        {/* Apply button */}
        <div style={{
          padding: "14px 20px",
          borderTop: "1px solid #f0ece6",
          background: "#fdfaf6",
          flexShrink: 0,
        }}>
          <button
            onClick={onClose}
            style={{
              width: "100%", padding: "14px 0",
              borderRadius: 14, border: "none", cursor: "pointer",
              background: "linear-gradient(120deg,#140e04 0%,#3a2408 45%,#5a3a0c 65%,#140e04 100%)",
              color: "#fff", fontSize: 13, fontWeight: 700,
              letterSpacing: ".12em", textTransform: "uppercase",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              boxShadow: "0 6px 24px rgba(20,14,4,.3)",
              transition: "transform .2s, box-shadow .2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 10px 32px rgba(20,14,4,.4)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 6px 24px rgba(20,14,4,.3)"; }}
          >
            <Sparkles size={13} color="#C9A84C" />
            View Results
          </button>
        </div>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────
   MOBILE FILTER TRIGGER BAR
   Fixed bar at the bottom of the screen on mobile
───────────────────────────────────────────── */
function MobileFilterBar({ onOpen, activeCount }) {
  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0,
      zIndex: 9990,
      padding: "12px 16px 20px",
      background: "linear-gradient(to top, #fff 70%, transparent)",
      gap: 10,
    }}
      className="flex lg:hidden"
    >
      {/* Filter button */}
      <button
        onClick={onOpen}
        style={{
          flex: 1, height: 52,
          borderRadius: 14,
          border: "2px solid #C9A84C",
          background: activeCount > 0
            ? "linear-gradient(120deg,#140e04 0%,#3a2408 45%,#5a3a0c 65%,#140e04 100%)"
            : "#fff",
          color: activeCount > 0 ? "#fff" : "#1a1205",
          fontSize: 13.5, fontWeight: 700,
          letterSpacing: ".08em",
          cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 9,
          boxShadow: activeCount > 0
            ? "0 6px 28px rgba(20,14,4,.3)"
            : "0 4px 20px rgba(0,0,0,.08)",
          transition: "all .25s",
        }}
      >
        <SlidersHorizontal size={16} strokeWidth={2} />
        Filters
        {activeCount > 0 && (
          <span style={{
            minWidth: 20, height: 20, padding: "0 5px",
            borderRadius: 99,
            background: "linear-gradient(135deg,#e8c96a,#C9A84C)",
            color: "#1a1205", fontSize: 10, fontWeight: 800,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {activeCount}
          </span>
        )}
      </button>

      {/* Sort quick-select */}
      <div style={{ position: "relative", flex: 1 }}>
        <select
          style={{
            width: "100%", height: 52,
            borderRadius: 14,
            border: "2px solid #E5D9C8",
            background: "#fdfaf6",
            color: "#1a1205", fontSize: 13, fontWeight: 600,
            paddingLeft: 16, paddingRight: 36,
            appearance: "none", cursor: "pointer",
            boxShadow: "0 4px 20px rgba(0,0,0,.06)",
            fontFamily: "'Jost', sans-serif",
          }}
        >
          <option value="popular">Popular</option>
          <option value="price-asc">Price ↑</option>
          <option value="price-desc">Price ↓</option>
          <option value="rating">Top Rated</option>
          <option value="newest">Newest</option>
        </select>
        <ChevronUp
          size={14} color="#C9A84C" strokeWidth={2}
          style={{
            position: "absolute", right: 12, top: "50%",
            transform: "translateY(-50%) rotate(180deg)",
            pointerEvents: "none",
          }}
        />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   INNER PAGE (needs FilterContext)
───────────────────────────────────────────── */
function ProductsPageInner() {
  const [sheetOpen, setSheetOpen] = useState(false);

  /* derive active filter count from context if available,
     otherwise default to 0 — update this to match your FilterContext shape */
  const activeFilterCount = 0; // replace with real count from useFilters() if available

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=Jost:wght@400;500;600;700&display=swap');

        /* add bottom padding on mobile so grid isn't hidden behind fixed bar */
        @media (max-width: 1023px) {
          .products-scroll-area { padding-bottom: 90px !important; }
        }
      `}</style>

      <div className="min-h-screen bg-[#f5f0e8]">

        {/* ── PAGE HEADER ─────────────────────── */}
        <div className="bg-[#f0ebe0] border-b border-[#e0d8cc] py-8 px-6 text-center">
          <h1
            className="text-3xl font-bold text-gray-900 tracking-tight"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Our Collection
          </h1>
          <p className="text-[12.5px] text-gray-400 mt-1 tracking-wide">
            Home / <span className="text-gray-600 font-medium">Products</span>
          </p>
        </div>

        {/* ── LAYOUT ──────────────────────────── */}
        <div
          className="products-scroll-area max-w-[1440px] mx-auto px-4 lg:px-10 py-8
                     flex flex-col lg:flex-row gap-6 items-start"
        >
          {/* Sidebar — desktop only */}
          <div className="hidden lg:block flex-shrink-0">
            <FiltersSidebar />
          </div>

          {/* Products grid — full width on mobile */}
          <div className="w-full">
            <ProductsGrid />
          </div>
        </div>

        {/* ── MOBILE FILTER BAR (fixed bottom) ── */}
        <MobileFilterBar
          onOpen={() => setSheetOpen(true)}
          activeCount={activeFilterCount}
        />

        {/* ── MOBILE FILTER SHEET ─────────────── */}
        {sheetOpen && (
          <MobileFilterSheet
            open={sheetOpen}
            onClose={() => setSheetOpen(false)}
          />
        )}
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────
   PAGE EXPORT
───────────────────────────────────────────── */
export default function ProductsPage() {
  return (
    <FilterProvider>
      <ProductsPageInner />
    </FilterProvider>
  );
}