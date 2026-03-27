// app/women/page.jsx
"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
    Heart, Star, ShoppingCart, Check,
    SlidersHorizontal, Search, X,
    Sparkles, ChevronDown, ArrowRight,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import {
    womenProducts,
    womenCategories,
} from "../../../app/data/women_category_data/women_data";
import { useWishlist } from "@/context/WishlistContext";

/* ─────────────────────────────────────────
   GLOBAL STYLES
───────────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Jost:wght@300;400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; font-family:'Jost',sans-serif; }

  @keyframes fadeUp   { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
  @keyframes heroIn   { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
  @keyframes shimmer  { from{transform:translateX(-100%)} to{transform:translateX(250%)} }
  @keyframes spin     { to{transform:rotate(360deg)} }
  @keyframes cardIn   { from{opacity:0;transform:translateY(14px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }
  @keyframes priceFlash {
    0%  {color:#C9A84C;transform:scale(1.06)}
    100%{color:#1a1205;transform:scale(1)}
  }
  @keyframes ringPulse {
    0%,100%{box-shadow:0 6px 28px rgba(20,14,4,.3),0 0 0 0 rgba(201,168,76,0)}
    50%    {box-shadow:0 6px 28px rgba(20,14,4,.3),0 0 0 5px rgba(201,168,76,.16)}
  }
  @keyframes badgePop {
    0%  {opacity:0;transform:scale(0.6)}
    70% {transform:scale(1.1)}
    100%{opacity:1;transform:scale(1)}
  }

  .card-in  { animation:cardIn .4s ease both }
  .hero-in  { animation:heroIn .6s ease both }
  .fade-up  { animation:fadeUp .5s ease both }

  .ornament { animation:spin 48s linear infinite }

  /* luxury CTA */
  .cta-btn {
    position:relative;overflow:hidden;
    display:inline-flex;align-items:center;justify-content:center;gap:9px;
    padding:13px 28px;border-radius:14px;border:none;
    background:linear-gradient(120deg,#140e04 0%,#3a2408 45%,#5a3a0c 65%,#140e04 100%);
    color:#fff;font-family:'Jost',sans-serif;font-size:13px;font-weight:700;
    letter-spacing:.15em;text-transform:uppercase;cursor:pointer;text-decoration:none;
    animation:ringPulse 3.5s ease infinite;
    transition:transform .3s,box-shadow .3s;
  }
  .cta-btn::before{
    content:'';position:absolute;top:0;left:12%;right:12%;height:1px;
    background:linear-gradient(90deg,transparent,rgba(201,168,76,.65),transparent);
  }
  .cta-btn .sweep{
    position:absolute;inset:0;
    background:linear-gradient(105deg,transparent 25%,rgba(201,168,76,.22) 50%,transparent 75%);
    transform:translateX(-100%);
  }
  .cta-btn:hover{transform:translateY(-2px);box-shadow:0 14px 38px rgba(20,14,4,.4)}
  .cta-btn:hover .sweep{animation:shimmer .7s ease forwards}
  .cta-btn:active{transform:translateY(0)}

  .gold-rule{height:1px;background:linear-gradient(90deg,transparent,#C9A84C,transparent)}

  /* product card */
  .prod-card{
    background:#fff;border-radius:18px;
    border:1.5px solid #EDE5D8;
    box-shadow:0 2px 18px rgba(0,0,0,.05);
    overflow:hidden;
    transition:transform .28s ease,box-shadow .28s ease;
  }
  .prod-card:hover{
    transform:translateY(-5px);
    box-shadow:0 14px 40px rgba(0,0,0,.1);
  }

  /* search input */
  .search-inp:focus{
    outline:none;
    border-color:#C9A84C !important;
    box-shadow:0 0 0 3px rgba(201,168,76,.12);
  }

  /* wishlist btn */
  .wish-btn{transition:background .2s,border-color .2s,color .2s}
  .wish-btn:hover{background:#fff5f5 !important;border-color:#fca5a5 !important}
  .wish-btn.active{background:#fff5f5;border-color:#fca5a5;color:#ef4444}
`;
/* ══════════════════════════════════════
   WISHLIST TOAST
══════════════════════════════════════ */
function WishlistToast({ item, onClose }) {
    if (!item) return null;
    return (
      <div style={{
        position:"fixed", bottom:24, left:"50%", transform:"translateX(-50%)",
        zIndex:10000, width:"min(320px,90vw)",
        background:"#1a1205",
        border: item.added ? "1px solid rgba(239,68,68,0.35)" : "1px solid rgba(160,120,60,0.3)",
        borderRadius:14,
        boxShadow:"0 8px 32px rgba(0,0,0,0.28)",
        display:"flex", alignItems:"center", gap:12,
        padding:"12px 14px",
        animation:"wishToastIn .3s cubic-bezier(.22,1,.36,1) both",
        fontFamily:"'Jost',sans-serif",
      }}>
        {/* icon */}
        <div style={{
          width:34, height:34, borderRadius:"50%", flexShrink:0,
          background: item.added ? "rgba(239,68,68,.15)" : "rgba(160,120,60,.15)",
          display:"flex", alignItems:"center", justifyContent:"center",
        }}>
          <Heart size={15}
            fill={item.added ? "#ef4444" : "none"}
            color={item.added ? "#ef4444" : "#C9A84C"}
            strokeWidth={2}/>
        </div>
   
        {/* text */}
        <div style={{ flex:1, minWidth:0 }}>
          <p style={{ fontSize:12.5, fontWeight:700, color:"#f5ede0", margin:0, lineHeight:1.3 }}>
            {item.added ? "Added to Wishlist ♥" : "Removed from Wishlist"}
          </p>
          <p style={{ fontSize:11, color:"#a89272", margin:"2px 0 0",
            overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
            {item.name}
          </p>
        </div>
   
        {/* view wishlist link */}
        {item.added && (
          <a href="/my-whishlist" style={{
            fontSize:10.5, fontWeight:700, color:"#C9A84C",
            textDecoration:"none", letterSpacing:".06em", flexShrink:0,
            whiteSpace:"nowrap",
          }}>
            View →
          </a>
        )}
   
        <button onClick={onClose} style={{
          background:"none", border:"none", cursor:"pointer",
          color:"#7a6a50", flexShrink:0, padding:0, lineHeight:1,
        }}>
          <X size={13}/>
        </button>
      </div>
    );
  }
/* ─────────────────────────────────────────
   SCROLL REVEAL HOOK
───────────────────────────────────────── */
function useReveal(threshold = 0.1) {
    const ref = useRef(null);
    const [vis, setVis] = useState(false);
    useEffect(() => {
        const obs = new IntersectionObserver(
            ([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } },
            { threshold }
        );
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, []);
    return [ref, vis];
}

/* ─────────────────────────────────────────
   SINGLE PRODUCT CARD
───────────────────────────────────────── */
function ProductCard({ product, delay = 0 }) {
    const { addItem } = useCart();
    const [liked, setLiked] = useState(false);
    const [added, setAdded] = useState(false);
    const [shade, setShade] = useState(product.shades?.[0] ?? null);

    const handleAdd = () => {
        if (added) return;
        addItem({
            id: product.id,
            name: product.name,
            brand: product.brand,
            image: product.image,
            price: product.price,
            originalPrice: product.originalPrice,
            discount: product.discount,
        });
        setAdded(true);
        setTimeout(() => setAdded(false), 2200);
    };

    const fmt = (n) => `₹${n.toLocaleString("en-IN")}`;

    return (
        <div
            className="prod-card card-in"
            style={{ animationDelay: `${delay}s` }}
        >
            {/* ── IMAGE ─────────────────────────── */}
            <div style={{ position: "relative", overflow: "hidden", height: 240 }}>
                <img
                    src={product.image}
                    alt={product.name}
                    style={{
                        width: "100%", height: "100%",
                        objectFit: "cover", display: "block",
                        transition: "transform .55s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.06)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                />

                {/* discount badge */}
                <div style={{
                    position: "absolute", top: 12, left: 12,
                    background: "linear-gradient(120deg,#C9A84C,#e8c96a)",
                    color: "#1a1205", fontSize: 10, fontWeight: 800,
                    padding: "4px 10px", borderRadius: 20,
                    letterSpacing: ".06em",
                    boxShadow: "0 3px 10px rgba(201,168,76,.4)",
                }}>
                    {product.discount}% OFF
                </div>

                {/* tag badges */}
                {product.tags?.includes("bestseller") && (
                    <div style={{
                        position: "absolute", top: 12, right: 50,
                        background: "#1a1205", color: "#C9A84C",
                        fontSize: 9, fontWeight: 700, padding: "4px 8px",
                        borderRadius: 20, letterSpacing: ".08em",
                        animation: "badgePop .4s ease both",
                    }}>
                        BESTSELLER
                    </div>
                )}
                {product.tags?.includes("new") && !product.tags?.includes("bestseller") && (
                    <div style={{
                        position: "absolute", top: 12, right: 50,
                        background: "#16a34a", color: "#fff",
                        fontSize: 9, fontWeight: 700, padding: "4px 8px",
                        borderRadius: 20, letterSpacing: ".08em",
                    }}>
                        NEW
                    </div>
                )}

                {/* wishlist */}
                <button
                    className={`wish-btn ${liked ? "active" : ""}`}
                    onClick={() => setLiked(!liked)}
                    style={{
                        position: "absolute", top: 12, right: 12,
                        width: 34, height: 34, borderRadius: "50%",
                        border: "1.5px solid #EDE5D8",
                        background: "#fff", cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: liked ? "#ef4444" : "#bbb",
                    }}
                >
                    <Heart size={15} fill={liked ? "#ef4444" : "none"} strokeWidth={1.8} />
                </button>
            </div>

            {/* ── DETAILS ──────────────────────── */}
            <div style={{ padding: "16px 18px 20px" }}>

                {/* subcategory label */}
                <p style={{
                    fontSize: 10, fontWeight: 700, color: "#C9A84C",
                    letterSpacing: ".14em", textTransform: "uppercase",
                    margin: "0 0 5px",
                }}>
                    {product.subcategory}
                </p>

                {/* name */}
                <h3 style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 17, fontWeight: 700, color: "#1a1205",
                    margin: "0 0 3px", lineHeight: 1.3,
                    display: "-webkit-box",
                    WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
                }}>
                    {product.name}
                </h3>

                {/* brand */}
                <p style={{ fontSize: 11, color: "#B8A080", fontWeight: 600, margin: "0 0 10px", letterSpacing: ".04em" }}>
                    {product.brand}
                </p>

                {/* stars */}
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                    <div style={{ display: "flex", gap: 1 }}>
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i} size={12}
                                fill={i < Math.round(product.rating) ? "#F4B400" : "none"}
                                color={i < Math.round(product.rating) ? "#F4B400" : "#ddd"}
                                strokeWidth={1.5}
                            />
                        ))}
                    </div>
                    <span style={{ fontSize: 11, color: "#A89880" }}>
                        {product.rating} ({product.reviews})
                    </span>
                </div>

                {/* colour / shade selector */}
                {product.shades?.length > 0 && (
                    <div style={{ marginBottom: 12 }}>
                        <p style={{ fontSize: 10, color: "#A89880", fontWeight: 600, letterSpacing: ".08em", margin: "0 0 5px" }}>
                            COLOURS
                        </p>
                        <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                            {product.shades.map((s) => (
                                <button
                                    key={s}
                                    onClick={() => setShade(s)}
                                    style={{
                                        padding: "3px 10px", borderRadius: 20, fontSize: 10.5,
                                        fontWeight: 600, cursor: "pointer",
                                        border: `1.5px solid ${shade === s ? "#C9A84C" : "#DDD0BE"}`,
                                        background: shade === s ? "#fdf9f0" : "#fdfaf6",
                                        color: shade === s ? "#7a6030" : "#A89880",
                                        transition: "all .15s",
                                    }}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* price row */}
                <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 14 }}>
                    <span style={{ fontSize: 18, fontWeight: 700, color: "#1a1205" }}>
                        {fmt(product.price)}
                    </span>
                    <span style={{ fontSize: 12, color: "#ccc", textDecoration: "line-through" }}>
                        {fmt(product.originalPrice)}
                    </span>
                    <span style={{
                        background: "#FFF9E6", border: "1px solid rgba(201,168,76,.3)",
                        color: "#7a5f1a", fontSize: 10, fontWeight: 700,
                        padding: "2px 8px", borderRadius: 20,
                    }}>
                        Save {fmt(product.originalPrice - product.price)}
                    </span>
                </div>

                {/* add to cart */}
                <button
                    onClick={handleAdd}
                    disabled={added}
                    style={{
                        width: "100%", padding: "11px 0",
                        borderRadius: 12, border: "none",
                        background: added
                            ? "linear-gradient(120deg,#d4b87a,#e8c96a)"
                            : "linear-gradient(120deg,#140e04 0%,#3a2408 45%,#5a3a0c 65%,#140e04 100%)",
                        color: added ? "#3d2a0a" : "#fff",
                        fontSize: 12.5, fontWeight: 700,
                        letterSpacing: ".1em", textTransform: "uppercase",
                        cursor: added ? "default" : "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                        transition: "all .3s ease",
                        position: "relative", overflow: "hidden",
                    }}
                >
                    {added ? (
                        <>
                            <Check size={14} strokeWidth={2.5} />
                            Added to Cart
                        </>
                    ) : (
                        <>
                            <ShoppingCart size={14} />
                            Add to Cart
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────
   PAGE
───────────────────────────────────────── */
export default function WomenPage() {
    const [activeCategory, setActiveCategory] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("popular");
    const [showSort, setShowSort] = useState(false);
    const [ref, vis] = useReveal(0.05);

    /* filter + sort */
    const filtered = womenProducts
        .filter((p) => {
            const matchCat = activeCategory === "all" || p.category === activeCategory;
            const matchSearch = searchQuery === "" ||
                p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.subcategory.toLowerCase().includes(searchQuery.toLowerCase());
            return matchCat && matchSearch;
        })
        .sort((a, b) => {
            if (sortBy === "price-asc") return a.price - b.price;
            if (sortBy === "price-desc") return b.price - a.price;
            if (sortBy === "rating") return b.rating - a.rating;
            if (sortBy === "discount") return b.discount - a.discount;
            return b.reviews - a.reviews; // popular
        });

    const SORT_OPTIONS = [
        { val: "popular", label: "Most Popular" },
        { val: "rating", label: "Top Rated" },
        { val: "discount", label: "Biggest Discount" },
        { val: "price-asc", label: "Price: Low → High" },
        { val: "price-desc", label: "Price: High → Low" },
    ];

    return (
        <>
            <style>{STYLES}</style>
            <div style={{ minHeight: "100vh", background: "#F4EFE6", overflowX: "hidden" }}>

                {/* ══════════════════════════════════════
            § 1  HERO
        ══════════════════════════════════════ */}
                <div style={{
                    position: "relative",
                    background: "linear-gradient(160deg,#12100c 0%,#251c10 55%,#1a1205 100%)",
                    padding: "72px 24px 90px",
                    textAlign: "center",
                    overflow: "hidden",
                }}>
                    {/* noise */}
                    <div style={{
                        position: "absolute", inset: 0, opacity: .32, pointerEvents: "none",
                        backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E\")",
                    }} />

                    {/* spinning ornaments */}
                    <svg className="ornament" style={{ position: "absolute", top: -60, left: -60, opacity: .06, width: 220, height: 220 }} viewBox="0 0 200 200">
                        <circle cx="100" cy="100" r="90" fill="none" stroke="#C9A84C" strokeWidth="1" strokeDasharray="6 8" />
                        <circle cx="100" cy="100" r="65" fill="none" stroke="#C9A84C" strokeWidth=".5" strokeDasharray="3 10" />
                    </svg>
                    <svg className="ornament" style={{ position: "absolute", bottom: -70, right: -70, opacity: .07, width: 250, height: 250, animationDirection: "reverse" }} viewBox="0 0 200 200">
                        <circle cx="100" cy="100" r="90" fill="none" stroke="#C9A84C" strokeWidth="1" strokeDasharray="4 10" />
                    </svg>

                    {/* breadcrumb */}
                    <p className="hero-in" style={{ fontSize: 12, color: "#9a7d50", letterSpacing: ".1em", marginBottom: 18 }}>
                        <Link href="/" style={{ color: "#9a7d50", textDecoration: "none" }}>Home</Link>
                        <span style={{ margin: "0 7px", color: "#C9A84C" }}>›</span>
                        <span style={{ color: "#C9A84C", fontWeight: 600 }}>Women</span>
                    </p>

                    {/* eyebrow */}
                    <div className="hero-in" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 16, animationDelay: ".1s" }}>
                        <div style={{ height: 1, width: 44, background: "linear-gradient(90deg,transparent,#C9A84C)" }} />
                        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".28em", color: "#C9A84C", textTransform: "uppercase" }}>Ethnic & Western</span>
                        <div style={{ height: 1, width: 44, background: "linear-gradient(90deg,#C9A84C,transparent)" }} />
                    </div>

                    {/* headline */}
                    <h1 className="hero-in" style={{
                        fontFamily: "'Cormorant Garamond',serif",
                        fontSize: "clamp(36px,6vw,70px)", fontWeight: 700,
                        color: "#f5ede0", lineHeight: 1.08, margin: "0 auto 18px", maxWidth: 680,
                        animationDelay: ".2s",
                    }}>
                        Elegant Fashion,<br />
                        <em style={{ color: "#C9A84C", fontStyle: "italic" }}>Crafted for You</em>
                    </h1>

                    <p className="hero-in" style={{
                        fontSize: 15, color: "#a89272", maxWidth: 460, margin: "0 auto 32px", lineHeight: 1.8,
                        animationDelay: ".35s",
                    }}>
                        Curated women's fashion — sarees, suits, lehengas, western wear and more.
                    </p>

                    {/* search bar */}
                    <div className="hero-in" style={{ maxWidth: 480, margin: "0 auto", position: "relative", animationDelay: ".45s" }}>
                        <Search size={16} color="#A89880" style={{ position: "absolute", left: 18, top: "50%", transform: "translateY(-50%)" }} />
                        <input
                            className="search-inp"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search sarees, suits, brands…"
                            style={{
                                width: "100%", border: "1.5px solid rgba(201,168,76,.3)",
                                borderRadius: 40, padding: "14px 18px 14px 46px",
                                fontSize: 14, fontWeight: 500, color: "#1a1205",
                                background: "rgba(255,255,255,.92)",
                                fontFamily: "'Jost',sans-serif",
                            }}
                        />
                        {searchQuery && (
                            <button onClick={() => setSearchQuery("")} style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#A89880" }}>
                                <X size={15} />
                            </button>
                        )}
                    </div>

                    {/* wave */}
                    <svg viewBox="0 0 1440 56" style={{ position: "absolute", bottom: 0, left: 0, width: "100%", display: "block" }}>
                        <path d="M0,28 C360,56 1080,0 1440,28 L1440,56 L0,56 Z" fill="#F4EFE6" />
                    </svg>
                </div>

                {/* ══════════════════════════════════════
            § 2  CATEGORY TABS + SORT + GRID
        ══════════════════════════════════════ */}
                <div style={{ maxWidth: 1240, margin: "0 auto", padding: "40px 24px 80px" }}>

                    {/* category tabs + sort row */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 14, marginBottom: 32 }}>

                        {/* tabs */}
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                            {womenCategories.map((cat) => {
                                const active = activeCategory === cat.id;
                                return (
                                    <button
                                        key={cat.id}
                                        onClick={() => setActiveCategory(cat.id)}
                                        style={{
                                            padding: "9px 20px", borderRadius: 30,
                                            border: `2px solid ${active ? "#C9A84C" : "#DDD0BE"}`,
                                            background: active ? "#C9A84C" : "#fff",
                                            color: active ? "#1a1205" : "#888",
                                            fontSize: 13, fontWeight: 700, cursor: "pointer",
                                            letterSpacing: ".04em",
                                            boxShadow: active ? "0 3px 14px rgba(201,168,76,.3)" : "none",
                                            transition: "all .2s ease",
                                        }}
                                    >
                                        {cat.label}
                                        <span style={{ marginLeft: 6, fontSize: 11, opacity: .7 }}>
                                            ({cat.id === "all" ? womenProducts.length : womenProducts.filter(p => p.category === cat.id).length})
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* sort dropdown */}
                        <div style={{ position: "relative" }}>
                            <button
                                onClick={() => setShowSort(!showSort)}
                                style={{
                                    display: "flex", alignItems: "center", gap: 8,
                                    padding: "9px 16px", borderRadius: 12,
                                    border: "1.5px solid #DDD0BE", background: "#fff",
                                    color: "#5c4220", fontSize: 13, fontWeight: 600, cursor: "pointer",
                                    transition: "border-color .2s",
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.borderColor = "#C9A84C"}
                                onMouseLeave={(e) => { if (!showSort) e.currentTarget.style.borderColor = "#DDD0BE"; }}
                            >
                                <SlidersHorizontal size={14} color="#C9A84C" />
                                {SORT_OPTIONS.find(s => s.val === sortBy)?.label}
                                <ChevronDown size={13} style={{ transition: "transform .2s", transform: showSort ? "rotate(180deg)" : "rotate(0)" }} />
                            </button>

                            {showSort && (
                                <div style={{
                                    position: "absolute", top: "calc(100% + 8px)", right: 0, zIndex: 100,
                                    background: "#fff", borderRadius: 14,
                                    border: "1.5px solid #EDE5D8",
                                    boxShadow: "0 8px 32px rgba(0,0,0,.1)",
                                    minWidth: 200, overflow: "hidden",
                                }}>
                                    {SORT_OPTIONS.map((opt) => (
                                        <button
                                            key={opt.val}
                                            onClick={() => { setSortBy(opt.val); setShowSort(false); }}
                                            style={{
                                                display: "block", width: "100%", textAlign: "left",
                                                padding: "11px 16px", border: "none", cursor: "pointer",
                                                fontSize: 13, fontWeight: sortBy === opt.val ? 700 : 500,
                                                color: sortBy === opt.val ? "#7a6030" : "#5c4220",
                                                background: sortBy === opt.val ? "#fdf9f0" : "#fff",
                                                transition: "background .15s",
                                            }}
                                            onMouseEnter={(e) => { if (sortBy !== opt.val) e.currentTarget.style.background = "#fdfaf6"; }}
                                            onMouseLeave={(e) => { if (sortBy !== opt.val) e.currentTarget.style.background = "#fff"; }}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* results count */}
                    <div className="gold-rule" style={{ marginBottom: 20 }} />
                    <p style={{ fontSize: 12, color: "#A89880", marginBottom: 24, fontWeight: 500 }}>
                        Showing <strong style={{ color: "#5c4220" }}>{filtered.length}</strong> products
                        {activeCategory !== "all" && (
                            <> in <strong style={{ color: "#C9A84C" }}>{womenCategories.find(c => c.id === activeCategory)?.label}</strong></>
                        )}
                        {searchQuery && (
                            <> for "<strong style={{ color: "#5c4220" }}>{searchQuery}</strong>"</>
                        )}
                    </p>

                    {/* product grid */}
                    <div ref={ref}>
                        {filtered.length === 0 ? (
                            <div style={{ textAlign: "center", padding: "72px 0" }}>
                                <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 24, fontWeight: 700, color: "#1a1205", marginBottom: 8 }}>
                                    No products found
                                </p>
                                <p style={{ fontSize: 13, color: "#A89880", marginBottom: 20 }}>
                                    Try a different search or browse all categories.
                                </p>
                                <button
                                    onClick={() => { setSearchQuery(""); setActiveCategory("all"); }}
                                    className="cta-btn"
                                >
                                    <span className="sweep" />
                                    <span style={{ position: "relative", zIndex: 1 }}>View All Women's Wear</span>
                                    <ArrowRight size={13} style={{ position: "relative", zIndex: 1 }} />
                                </button>
                            </div>
                        ) : (
                            <div style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))",
                                gap: 24,
                            }}>
                                {vis && filtered.map((p, i) => (
                                    <ProductCard key={p.id} product={p} delay={Math.min(i * 0.06, 0.4)} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* ══════════════════════════════════════
            § 3  BRAND STRIP
        ══════════════════════════════════════ */}
                <div style={{
                    background: "#F0E9DB", borderTop: "1.5px solid #E5D9C8",
                    borderBottom: "1.5px solid #E5D9C8", padding: "32px 24px",
                }}>
                    <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".2em", color: "#A89880", textTransform: "uppercase", textAlign: "center", marginBottom: 20 }}>
                            Our Brands
                        </p>
                        <div style={{ display: "flex", justifyContent: "center", gap: 40, flexWrap: "wrap", alignItems: "center" }}>
                            {["Heritage Weaves", "SilkRoute", "UrbanDrape", "IndiqueStyle", "LucknowLooms", "DenimCo"].map((b) => (
                                <span key={b} style={{
                                    fontFamily: "'Cormorant Garamond',serif",
                                    fontSize: 18, fontWeight: 700, color: "#B8A080",
                                    letterSpacing: ".06em", cursor: "pointer",
                                    transition: "color .2s",
                                }}
                                    onMouseEnter={(e) => e.currentTarget.style.color = "#C9A84C"}
                                    onMouseLeave={(e) => e.currentTarget.style.color = "#B8A080"}
                                >
                                    {b}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ══════════════════════════════════════
            § 4  CLOSING CTA
        ══════════════════════════════════════ */}
                <div style={{ maxWidth: 1100, margin: "0 auto", padding: "72px 24px 80px" }}>
                    <div style={{
                        background: "linear-gradient(135deg,#12100c 0%,#3d2a0a 50%,#12100c 100%)",
                        borderRadius: 24, padding: "56px 40px",
                        textAlign: "center", position: "relative", overflow: "hidden",
                        boxShadow: "0 16px 56px rgba(0,0,0,.2)",
                    }}>
                        <div style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: 1, background: "linear-gradient(90deg,transparent,#C9A84C,transparent)" }} />

                        {/* dot grid */}
                        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: .04 }} viewBox="0 0 400 200" preserveAspectRatio="xMidYMid slice">
                            {[...Array(5)].map((_, r) => [...Array(12)].map((_, c) => (
                                <circle key={`${r}-${c}`} cx={c * 38 + 19} cy={r * 45 + 22} r="2.5" fill="#C9A84C" />
                            )))}
                        </svg>

                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 16 }}>
                            <div style={{ height: 1, width: 36, background: "linear-gradient(90deg,transparent,#C9A84C)" }} />
                            <Sparkles size={14} color="#C9A84C" />
                            <div style={{ height: 1, width: 36, background: "linear-gradient(90deg,#C9A84C,transparent)" }} />
                        </div>

                        <h2 style={{
                            fontFamily: "'Cormorant Garamond',serif",
                            fontSize: "clamp(24px,4vw,40px)", fontWeight: 700,
                            color: "#f5ede0", margin: "0 0 12px", lineHeight: 1.15,
                            position: "relative", zIndex: 1,
                        }}>
                            Looking for jewellery or cosmetics?
                        </h2>

                        <p style={{
                            fontSize: 14, color: "#a89272", maxWidth: 420, margin: "0 auto 30px",
                            lineHeight: 1.8, position: "relative", zIndex: 1,
                        }}>
                            Complete your look with handcrafted jewellery and luxury cosmetics from our curated collections.
                        </p>

                        <Link href="/products" className="cta-btn" style={{ position: "relative", zIndex: 1 }}>
                            <span className="sweep" />
                            <Sparkles size={13} style={{ position: "relative", zIndex: 1, color: "#d4a94a" }} />
                            <span style={{ position: "relative", zIndex: 1 }}>Explore All Products</span>
                            <ArrowRight size={13} style={{ position: "relative", zIndex: 1 }} />
                        </Link>
                    </div>
                </div>

            </div>
        </>
    );
}