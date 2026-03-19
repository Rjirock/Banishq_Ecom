// components/ProductGalleryTabs.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { galleryImages } from "../../app/data/category_images/product_gallery_tab_images_data";

/* ─────────────────────────────────────────────────────
   Derive CATEGORY_IMAGES and ALL_IMAGES from galleryImages
───────────────────────────────────────────────────── */
const CATEGORY_IMAGES = galleryImages.reduce((acc, img) => {
  if (!acc[img.tab]) acc[img.tab] = [];
  acc[img.tab].push({ ...img, label: img.label ?? img.alt });
  return acc;
}, {});

const ALL_IMAGES = ["jewellery", "women", "cosmetic"].flatMap((tab) =>
  (CATEGORY_IMAGES[tab] ?? []).slice(0, 2).map((img) => ({ ...img, category: tab }))
);

const TABS = [
  { id: "all",       label: "All"       },
  { id: "women",     label: "Women's"   },
  { id: "jewellery", label: "Jewellery" },
  { id: "cosmetic",  label: "Cosmetic"  },
];

const CATEGORY_ROUTES = {
  jewellery: "/category/jewellery-collection",
  women:     "/category/women",
  cosmetic:  "/category/cosmetic-collection",
};

/* ─────────────────────────────────────────────────────
   CLICKABLE IMAGE
───────────────────────────────────────────────────── */
function GalleryImage({ src, alt, label, category, style = {}, className = "" }) {
  const router = useRouter();
  const [hovered, setHovered] = useState(false);

  const handleClick = () => {
    const route = CATEGORY_ROUTES[category] ?? `/products?category=${category}`;
    router.push(route);
  };

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative", cursor: "pointer",
        borderRadius: 16, overflow: "hidden",
        ...style,
      }}
      className={className}
    >
      <img
        src={src}
        alt={alt}
        style={{
          width: "100%", height: "100%",
          objectFit: "cover", display: "block",
          transform: hovered ? "scale(1.06)" : "scale(1)",
          transition: "transform 0.55s ease",
        }}
      />

      {/* dark overlay */}
      <div style={{
        position: "absolute", inset: 0,
        background: "rgba(18,12,4,0.45)",
        opacity: hovered ? 1 : 0,
        transition: "opacity 0.3s ease",
      }} />

      {/* label chip */}
      <div style={{
        position: "absolute", bottom: 12, left: 12,
        background: "linear-gradient(120deg,#140e04,#3a2408)",
        color: "#f5ede0",
        fontSize: 12, fontWeight: 700,
        padding: "6px 14px", borderRadius: 30,
        letterSpacing: "0.08em",
        boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
        opacity: hovered ? 1 : 0,
        transform: hovered ? "translateY(0)" : "translateY(8px)",
        transition: "opacity 0.3s ease, transform 0.3s ease",
        pointerEvents: "none",
        display: "flex", alignItems: "center", gap: 6,
      }}>
        <span style={{ fontSize: 10, color: "#C9A84C" }}>→</span>
        {label}
      </div>

      {/* gold top shimmer */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0,
        height: 2,
        background: "linear-gradient(90deg,transparent,#C9A84C,transparent)",
        opacity: hovered ? 1 : 0,
        transition: "opacity 0.3s ease",
      }} />
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   DESKTOP LAYOUT — original asymmetric grid (lg+)
───────────────────────────────────────────────────── */
function DesktopLayout({ images, category }) {
  const cat = (img) => img.category ?? category;
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 20 }}>
      {/* LEFT */}
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <GalleryImage src={images[0].src} alt={images[0].alt} label={images[0].label} category={cat(images[0])} style={{ height: 420 }} />
        <GalleryImage src={images[1].src} alt={images[1].alt} label={images[1].label} category={cat(images[1])} style={{ height: 170 }} />
      </div>
      {/* RIGHT */}
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <GalleryImage src={images[2].src} alt={images[2].alt} label={images[2].label} category={cat(images[2])} style={{ height: 200 }} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <GalleryImage src={images[3].src} alt={images[3].alt} label={images[3].label} category={cat(images[3])} style={{ height: 240 }} />
          <GalleryImage src={images[4].src} alt={images[4].alt} label={images[4].label} category={cat(images[4])} style={{ height: 240 }} />
        </div>
        <GalleryImage src={images[5].src} alt={images[5].alt} label={images[5].label} category={cat(images[5])} style={{ height: 170 }} />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   TABLET LAYOUT — 2-col equal grid (sm → lg)
───────────────────────────────────────────────────── */
function TabletLayout({ images, category }) {
  const cat = (img) => img.category ?? category;
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      {images.slice(0, 6).map((img, i) => (
        <GalleryImage
          key={i}
          src={img.src} alt={img.alt}
          label={img.label} category={cat(img)}
          style={{ height: i < 2 ? 260 : 200 }}
        />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   MOBILE LAYOUT — single column
───────────────────────────────────────────────────── */
function MobileLayout({ images, category }) {
  const cat = (img) => img.category ?? category;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {images.slice(0, 6).map((img, i) => (
        <GalleryImage
          key={i}
          src={img.src} alt={img.alt}
          label={img.label} category={cat(img)}
          style={{ height: 200 }}
        />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   RESPONSIVE WRAPPER — CSS-driven, no JS resize needed
───────────────────────────────────────────────────── */
function GalleryLayout({ images, category }) {
  return (
    <>
      {/* Mobile: < 640px */}
      <div className="block sm:hidden">
        <MobileLayout images={images} category={category} />
      </div>
      {/* Tablet: 640px – 1023px */}
      <div className="hidden sm:block lg:hidden">
        <TabletLayout images={images} category={category} />
      </div>
      {/* Desktop: 1024px+ */}
      <div className="hidden lg:block">
        <DesktopLayout images={images} category={category} />
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────── */
export default function ProductGalleryTabs() {
  const [activeTab, setActiveTab] = useState("all");

  const imageSet =
    activeTab === "all"
      ? ALL_IMAGES
      : CATEGORY_IMAGES[activeTab].map((img) => ({ ...img, category: activeTab }));

  return (
    <section className="w-full bg-[#EDEBE8] py-12 sm:py-16 lg:py-20">
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6">

        {/* ── TABS ─────────────────────────────── */}
        <div className="flex justify-center flex-wrap gap-6 sm:gap-10 lg:gap-16 text-[15px] sm:text-[18px] lg:text-[20px] font-serif mb-8 sm:mb-10 relative">
          {TABS.map((tab) => (
            <div key={tab.id} className="relative">
              <button
                onClick={() => setActiveTab(tab.id)}
                className="relative pb-3 transition duration-300 hover:scale-110 hover:text-black cursor-pointer"
              >
                {tab.label}

                {activeTab === tab.id && (
                  <motion.span
                    layoutId="underline"
                    className="absolute left-0 right-0 -bottom-1 h-[3px] bg-[#C6A75E]"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            </div>
          ))}
        </div>

        {/* divider */}
        <div className="h-[1px] bg-black/20 mb-8 sm:mb-10 lg:mb-12" />

        {/* ── ANIMATED CONTENT ─────────────────── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <GalleryLayout images={imageSet} category={activeTab} />
          </motion.div>
        </AnimatePresence>

        {/* hint text */}
        <p style={{
          textAlign: "center", marginTop: 24,
          fontSize: 12, color: "#9a8060",
          letterSpacing: "0.08em",
          fontFamily: "'Jost', sans-serif",
        }}>
          Click any image to explore that category
        </p>

      </div>
    </section>
  );
}