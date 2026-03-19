"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { X, ZoomIn, ChevronLeft, ChevronRight } from "lucide-react";
import { galleryImages } from "../data/gallery_data/gallery";

/* =========================================
   TABS
========================================= */
const TABS = [
  { key: "all",     label: "All"              },
  { key: "wedding", label: "Wedding Planning" },
  { key: "flower",  label: "Flower Bouquet"   },
  { key: "indoor",  label: "Indoor Plants"    },
];

/* =========================================
   LIGHTBOX
========================================= */
function Lightbox({ img, images, onClose, onPrev, onNext }) {
  if (!img) return null;
  const idx = images.findIndex((i) => i.id === img.id);

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-md flex items-center justify-center px-4"
      onClick={onClose}
    >
      {/* Prev */}
      {idx > 0 && (
        <button
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          className="absolute left-2 sm:left-6 w-10 h-10 sm:w-12 sm:h-12 rounded-full
                     bg-white/10 border border-white/20 flex items-center justify-center
                     text-white hover:bg-white/20 transition z-10"
        >
          <ChevronLeft size={20} />
        </button>
      )}

      <div
        className="relative w-full max-w-4xl mx-auto rounded-xl overflow-hidden
                   shadow-[0_50px_120px_rgba(0,0,0,0.7)]"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={img.src}
          alt={img.alt}
          className="w-full max-h-[75vh] object-cover rounded-xl"
        />
        <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-6 py-4
                        bg-gradient-to-t from-black/80 to-transparent">
          <p className="text-white text-[13px] tracking-wide">{img.alt}</p>
          <p className="text-white/50 text-[11px] tracking-[0.25em] uppercase mt-1">
            {idx + 1} / {images.length}
          </p>
        </div>
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/60
                     border border-white/20 flex items-center justify-center text-white"
        >
          <X size={16} />
        </button>
      </div>

      {/* Next */}
      {idx < images.length - 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          className="absolute right-2 sm:right-6 w-10 h-10 sm:w-12 sm:h-12 rounded-full
                     bg-white/10 border border-white/20 flex items-center justify-center
                     text-white hover:bg-white/20 transition z-10"
        >
          <ChevronRight size={20} />
        </button>
      )}
    </div>
  );
}

/* =========================================
   GALLERY CARD
========================================= */
function GalleryCard({ item, index, onOpen }) {
  const rowSpan = item.span === "tall" ? "row-span-2" : "";
  const colSpan = item.span === "wide" ? "col-span-2" : "";

  return (
    <div
      onClick={() => onOpen(item)}
      className={`gallery-card group relative overflow-hidden cursor-pointer ${rowSpan} ${colSpan}`}
      style={{ animationDelay: `${index * 0.06}s` }}
    >
      <img
        src={item.src}
        alt={item.alt}
        className="w-full h-full object-cover scale-[1.03]
                   group-hover:scale-[1.18]
                   transition-transform duration-[1600ms]
                   ease-[cubic-bezier(.19,1,.22,1)]"
      />

      {/* Gold shimmer sweep */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100
                      bg-[linear-gradient(120deg,transparent,rgba(201,168,76,0.25),transparent)]
                      translate-x-[-120%] group-hover:translate-x-[120%]
                      transition duration-[900ms]" />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent
                      opacity-50 group-hover:opacity-80 transition duration-500" />

      {/* Label + zoom icon */}
      <div className="absolute bottom-0 left-0 right-0 px-3 sm:px-4 pb-3 sm:pb-4 pt-12
                      translate-y-6 group-hover:translate-y-0 transition duration-500">
        <div className="flex items-center justify-between">
          <p className="text-white text-[10px] sm:text-[12px] tracking-[0.15em] uppercase font-medium leading-tight">
            {item.alt}
          </p>
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#C9A84C] flex-shrink-0
                          flex items-center justify-center ml-2
                          translate-y-4 opacity-0
                          group-hover:translate-y-0 group-hover:opacity-100
                          transition-all duration-500">
            <ZoomIn size={14} className="text-white" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================
   PAGE
========================================= */
export default function GalleryPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [lightbox, setLightbox]   = useState(null);

  // ref-based pill — reads each button's real offsetLeft + offsetWidth
  const tabRefs = useRef({});
  const [pill, setPill] = useState({ left: 0, width: 0 });

  const movePill = (key) => {
    const btn = tabRefs.current[key];
    if (btn) setPill({ left: btn.offsetLeft, width: btn.offsetWidth });
  };

  // reposition on tab change
  useEffect(() => { movePill(activeTab); }, [activeTab]);

  // reposition on window resize (handles font/layout reflow)
  useEffect(() => {
    const onResize = () => movePill(activeTab);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [activeTab]);

  const handleTabClick = (key) => {
    setActiveTab(key);
    movePill(key);
  };

  const images = useMemo(() => {
    if (activeTab === "all") return galleryImages;
    return galleryImages.filter((i) => i.tab === activeTab);
  }, [activeTab]);

  const lbIndex = lightbox ? images.findIndex((i) => i.id === lightbox.id) : -1;
  const prevImage = () => { if (lbIndex > 0)                  setLightbox(images[lbIndex - 1]); };
  const nextImage = () => { if (lbIndex < images.length - 1)  setLightbox(images[lbIndex + 1]); };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Jost:wght@300;400;500;600&display=swap');

        @keyframes pageFade {
          from { opacity:0; transform:translateY(40px); }
          to   { opacity:1; transform:translateY(0);    }
        }
        @keyframes revealImage {
          from { opacity:0; transform:scale(1.08); }
          to   { opacity:1; transform:scale(1);    }
        }

        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-auto-rows: 240px;
          gap: 18px;
          animation: pageFade .8s ease both;
        }

        /* Tablet */
        @media (max-width: 900px) {
          .gallery-grid {
            grid-template-columns: repeat(2, 1fr);
            grid-auto-rows: 200px;
            gap: 14px;
          }
        }

        /* Mobile */
        @media (max-width: 540px) {
          .gallery-grid {
            grid-template-columns: repeat(2, 1fr);
            grid-auto-rows: 140px;
            gap: 10px;
          }
        }

        /* Extra-small phones */
        @media (max-width: 360px) {
          .gallery-grid {
            grid-template-columns: 1fr;
            grid-auto-rows: 200px;
          }
        }

        .gallery-card {
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 6px 20px rgba(0,0,0,.05), 0 15px 50px rgba(0,0,0,.08);
          transition: transform .6s cubic-bezier(.19,1,.22,1), box-shadow .6s ease;
        }
        .gallery-card:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 35px 90px rgba(0,0,0,.2), 0 15px 40px rgba(0,0,0,.15);
        }
        .gallery-card img { animation: revealImage 1s ease both; }

        /* Disable col/row span on mobile so grid stays even */
        @media (max-width: 540px) {
          .gallery-card.row-span-2 { grid-row:  span 1 !important; }
          .gallery-card.col-span-2 { grid-column: span 1 !important; }
        }
      `}</style>

      <div
        className="min-h-screen"
        style={{
          background: "linear-gradient(180deg,#f7f3ee 0%,#f4efe8 50%,#f7f3ee 100%)",
          fontFamily: "'Jost', sans-serif",
        }}
      >
        {/* ── HERO ─────────────────────────────── */}
        <div className="text-center py-10 sm:py-12 lg:py-14 px-4 sm:px-6">
          <p className="text-[10px] sm:text-[11px] tracking-[0.45em] uppercase text-[#C9A84C] mb-4 sm:mb-5">
            OUR PORTFOLIO
          </p>

          <h1
            className="text-[#1a1610] leading-none mb-6 sm:mb-9"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              letterSpacing: "0.04em",
              fontSize: "clamp(3rem, 8vw, 5rem)",
            }}
          >
            Gallery
          </h1>

          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-16 sm:w-24 bg-gradient-to-r from-transparent to-[#C9A84C]" />
            <div className="w-2 h-2 rounded-full bg-[#C9A84C]" />
            <div className="h-px w-16 sm:w-24 bg-gradient-to-l from-transparent to-[#C9A84C]" />
          </div>
        </div>

        {/* ── CONTENT ──────────────────────────── */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-16">

          {/* ── TABS ─────────────────────────── */}
          <div className="flex justify-center mb-10 sm:mb-14 lg:mb-16">
            <div
              className="relative flex items-center gap-1 p-1.5 sm:p-2 rounded-full
                         bg-white/60 backdrop-blur-xl border border-[#e7e1d6]
                         shadow-[0_12px_40px_rgba(0,0,0,0.08)]
                         overflow-x-auto max-w-full"
              style={{ scrollbarWidth: "none" }}
            >
              {/* Sliding pill — positioned by JS using real button dimensions */}
              <span
                className="absolute top-1.5 sm:top-2 bottom-1.5 sm:bottom-2 rounded-full
                           bg-gradient-to-r from-[#c9a84c] via-[#e6d59a] to-[#c9a84c]
                           shadow-[0_6px_20px_rgba(201,168,76,0.45)]
                           pointer-events-none"
                style={{
                  left: pill.left,
                  width: pill.width,
                  transition: "left 0.45s cubic-bezier(.19,1,.22,1), width 0.45s cubic-bezier(.19,1,.22,1)",
                }}
              />

              {TABS.map((tab) => {
                const active = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    ref={(el) => { tabRefs.current[tab.key] = el; }}
                    onClick={() => handleTabClick(tab.key)}
                    className={`
                      relative z-10 cursor-pointer
                      px-3 sm:px-5 md:px-7 py-2 sm:py-2.5
                      text-[9px] sm:text-[11px] md:text-[13px]
                      tracking-[0.12em] sm:tracking-[0.18em]
                      uppercase font-medium rounded-full
                      whitespace-nowrap
                      transition-colors duration-300
                      ${active ? "text-[#1a1205]" : "text-[#7c6f5e] hover:text-[#C9A84C]"}
                    `}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── GRID ─────────────────────────── */}
          <div className="gallery-grid">
            {images.map((item, i) => (
              <GalleryCard
                key={item.id}
                item={item}
                index={i}
                onOpen={setLightbox}
              />
            ))}
          </div>
        </div>
      </div>

      <Lightbox
        img={lightbox}
        images={images}
        onClose={() => setLightbox(null)}
        onPrev={prevImage}
        onNext={nextImage}
      />
    </>
  );
}