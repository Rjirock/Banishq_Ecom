// app/cosmetics/page.jsx
"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
    Heart, Star, ShoppingCart, Check,
    SlidersHorizontal, Search, X,
    Sparkles, ChevronDown, ArrowRight,
} from "lucide-react";
import { useCart }     from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import {
    cosmeticsProducts,
    cosmeticsCategories,
} from "../../../app/data/cosmetics/cosmetics_data";

/* ══════════════════════════════════════
   GLOBAL STYLES — fully responsive
══════════════════════════════════════ */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Jost:wght@300;400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; font-family:'Jost',sans-serif; }

  /* ── Animations ── */
  @keyframes fadeUp    { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
  @keyframes heroIn    { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
  @keyframes shimmer   { from{transform:translateX(-100%)} to{transform:translateX(250%)} }
  @keyframes spin      { to{transform:rotate(360deg)} }
  @keyframes cardIn    { from{opacity:0;transform:translateY(14px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }
  @keyframes ringPulse {
    0%,100%{box-shadow:0 6px 28px rgba(20,14,4,.3),0 0 0 0 rgba(201,168,76,0)}
    50%    {box-shadow:0 6px 28px rgba(20,14,4,.3),0 0 0 5px rgba(201,168,76,.16)}
  }
  @keyframes badgePop  { 0%{opacity:0;transform:scale(0.6)} 70%{transform:scale(1.1)} 100%{opacity:1;transform:scale(1)} }
  @keyframes wishToastIn {
    from { opacity:0; transform:translateX(-50%) translateY(16px) scale(.94); }
    to   { opacity:1; transform:translateX(-50%) translateY(0)    scale(1);   }
  }

  /* ── Utility ── */
  .card-in  { animation:cardIn .4s ease both }
  .hero-in  { animation:heroIn .6s ease both }
  .ornament { animation:spin 48s linear infinite }

  /* ── CTA Button ── */
  .cta-btn {
    position:relative; overflow:hidden;
    display:inline-flex; align-items:center; justify-content:center; gap:9px;
    padding:13px 28px; border-radius:14px; border:none;
    background:linear-gradient(120deg,#140e04 0%,#3a2408 45%,#5a3a0c 65%,#140e04 100%);
    color:#fff; font-family:'Jost',sans-serif; font-size:13px; font-weight:700;
    letter-spacing:.15em; text-transform:uppercase; cursor:pointer; text-decoration:none;
    animation:ringPulse 3.5s ease infinite;
    transition:transform .3s,box-shadow .3s;
  }
  .cta-btn::before{content:'';position:absolute;top:0;left:12%;right:12%;height:1px;
    background:linear-gradient(90deg,transparent,rgba(201,168,76,.65),transparent);}
  .cta-btn .sweep{position:absolute;inset:0;
    background:linear-gradient(105deg,transparent 25%,rgba(201,168,76,.22) 50%,transparent 75%);
    transform:translateX(-100%);}
  .cta-btn:hover{transform:translateY(-2px);box-shadow:0 14px 38px rgba(20,14,4,.4)}
  .cta-btn:hover .sweep{animation:shimmer .7s ease forwards}
  .cta-btn:active{transform:translateY(0)}

  /* ── Gold rule ── */
  .gold-rule{height:1px;background:linear-gradient(90deg,transparent,#C9A84C,transparent)}

  /* ── Product card ── */
  .prod-card {
    background:#fff; border-radius:18px; border:1.5px solid #EDE5D8;
    box-shadow:0 2px 18px rgba(0,0,0,.05); overflow:hidden;
    transition:transform .28s ease,box-shadow .28s ease;
  }
  .prod-card:hover{transform:translateY(-5px);box-shadow:0 14px 40px rgba(0,0,0,.1);}

  /* ── Search input ── */
  .search-inp:focus{outline:none;border-color:#C9A84C !important;box-shadow:0 0 0 3px rgba(201,168,76,.12);}

  /* ── Wishlist button ── */
  .wish-btn{transition:background .2s,border-color .2s,color .2s}
  .wish-btn:hover{background:#fff5f5 !important;border-color:#fca5a5 !important}
  .wish-btn.active{background:#fff5f5;border-color:#fca5a5;color:#ef4444}

  /* ── Category pill ── */
  .cat-pill {
    flex-shrink:0; white-space:nowrap; cursor:pointer; border:none;
    font-family:'Jost',sans-serif; font-weight:600; letter-spacing:.06em;
    text-transform:uppercase; transition:all .2s ease;
    -webkit-tap-highlight-color:transparent;
  }

  /* ── Product image zoom ── */
  .prod-img { transition:transform .55s ease; }
  .prod-card:hover .prod-img { transform:scale(1.06); }

  /* ── Grid ── */
  .products-grid {
    display:grid;
    grid-template-columns:repeat(2, 1fr);
    gap:12px;
  }
  @media(min-width:480px){
    .products-grid { gap:14px; }
  }
  @media(min-width:640px){
    .products-grid { grid-template-columns:repeat(2,1fr); gap:16px; }
  }
  @media(min-width:900px){
    .products-grid { grid-template-columns:repeat(3,1fr); gap:20px; }
  }
  @media(min-width:1200px){
    .products-grid { grid-template-columns:repeat(4,1fr); gap:22px; }
  }

  /* ── Hero responsive ── */
  .hero-title {
    font-family:'Cormorant Garamond',serif;
    font-size:clamp(30px, 7vw, 68px);
    font-weight:700; color:#F4EFE6; line-height:1.1;
    letter-spacing:-.01em; margin:0;
  }
  .hero-subtitle {
    font-size:clamp(13px, 3vw, 16px);
    color:#a89272; font-weight:400; max-width:480px;
    margin:0 auto; line-height:1.7;
  }

  /* ── Filter bar ── */
  .filter-bar {
    display:flex; align-items:center; gap:10px;
    flex-wrap:wrap;
  }
  @media(max-width:639px){
    .filter-bar { gap:8px; }
  }

  /* ── Sort dropdown ── */
  .sort-dropdown {
    position:relative; flex-shrink:0;
  }
  .sort-menu {
    position:absolute; top:calc(100% + 6px); right:0;
    background:#fff; border:1.5px solid #EDE5D8;
    border-radius:14px; overflow:hidden; z-index:200;
    box-shadow:0 12px 40px rgba(0,0,0,.12);
    min-width:200px;
    animation:fadeUp .18s ease both;
  }

  /* ── Search bar ── */
  .search-wrap {
    position:relative; flex:1; min-width:0;
  }

  /* ── Scrollable category pills ── */
  .cat-scroll {
    display:flex; gap:8px; overflow-x:auto;
    padding-bottom:4px; scrollbar-width:none;
    -ms-overflow-style:none;
  }
  .cat-scroll::-webkit-scrollbar { display:none; }

  /* ── Page wrapper ── */
  .page-inner {
    max-width:1380px; margin:0 auto;
    padding:0 16px;
  }
  @media(min-width:640px){ .page-inner { padding:0 24px; } }
  @media(min-width:1024px){ .page-inner { padding:0 40px; } }

  /* ── Load more btn ── */
  .load-more-btn {
    padding:13px 36px; border-radius:14px; border:2px solid #C9A84C;
    background:transparent; color:#7a5f1a; font-family:'Jost',sans-serif;
    font-size:13px; font-weight:700; letter-spacing:.12em; text-transform:uppercase;
    cursor:pointer; transition:all .25s ease; display:inline-flex; align-items:center; gap:8px;
    -webkit-tap-highlight-color:transparent;
  }
  .load-more-btn:hover{background:#C9A84C;color:#1a1205;}
  .load-more-btn:active{transform:scale(.97);}

  /* ── Mobile-only helpers ── */
  @media(max-width:479px){
    .prod-price { font-size:15px !important; }
    .prod-add-btn { padding:10px 0 !important; font-size:11.5px !important; }
    .prod-save-badge { display:none; }
  }

  /* ── Prevent overflow ── */
  html, body { overflow-x:hidden; }
`;

/* ══════════════════════════════════════
   WISHLIST TOAST
══════════════════════════════════════ */
function WishlistToast({ item, onClose }) {
  if (!item) return null;
  return (
    <div style={{
      position:"fixed", bottom:20, left:"50%",
      transform:"translateX(-50%)",
      zIndex:10000, width:"min(340px,92vw)",
      background:"#1a1205",
      border: item.added ? "1px solid rgba(239,68,68,0.3)" : "1px solid rgba(160,120,60,0.3)",
      borderRadius:14, boxShadow:"0 8px 32px rgba(0,0,0,.28)",
      display:"flex", alignItems:"center", gap:12,
      padding:"12px 14px",
      animation:"wishToastIn .3s cubic-bezier(.22,1,.36,1) both",
      fontFamily:"'Jost',sans-serif",
    }}>
      <div style={{
        width:34, height:34, borderRadius:"50%", flexShrink:0,
        background: item.added ? "rgba(239,68,68,.15)" : "rgba(160,120,60,.15)",
        display:"flex", alignItems:"center", justifyContent:"center",
      }}>
        <Heart size={15}
          fill={item.added ? "#ef4444" : "none"}
          color={item.added ? "#ef4444" : "#C9A84C"}
          strokeWidth={2}
        />
      </div>
      <div style={{ flex:1, minWidth:0 }}>
        <p style={{ fontSize:13, fontWeight:700,
          color:item.added ? "#f5ede0" : "#c9a880",
          margin:0, lineHeight:1.3 }}>
          {item.added ? "Added to Wishlist ♥" : "Removed from Wishlist"}
        </p>
        <p style={{ fontSize:11, color:"#a89272", margin:"2px 0 0",
          overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
          {item.name}
        </p>
      </div>
      {item.added && (
        <a href="/wishlist" style={{
          fontSize:11, fontWeight:700, color:"#C9A84C",
          textDecoration:"none", letterSpacing:".06em",
          flexShrink:0, whiteSpace:"nowrap",
          border:"1px solid rgba(201,168,76,.3)",
          padding:"4px 10px", borderRadius:99,
        }}>
          View →
        </a>
      )}
      <button onClick={onClose} style={{
        background:"none", border:"none", cursor:"pointer",
        color:"#7a6a50", flexShrink:0, padding:4, lineHeight:1,
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
   PRODUCT CARD — mobile-first
───────────────────────────────────────── */
function ProductCard({ product, delay = 0, onWishlistChange }) {
    const { addItem }                   = useCart();
    const { toggleItem, isWishlisted }  = useWishlist();
    const [added, setAdded]             = useState(false);
    const [shade, setShade]             = useState(product.shades?.[0] ?? null);

    const handleAdd = () => {
        if (added) return;
        addItem({
            id: product.id, name: product.name,
            brand: product.brand, image: product.image,
            price: product.price, originalPrice: product.originalPrice,
            discount: product.discount,
        });
        setAdded(true);
        setTimeout(() => setAdded(false), 2200);
    };

    const fmt = (n) => `₹${n.toLocaleString("en-IN")}`;

    return (
        <div className="prod-card card-in" style={{ animationDelay:`${delay}s` }}>
            {/* IMAGE */}
            <div style={{ position:"relative", overflow:"hidden", aspectRatio:"3/3.2" }}>
                <img
                    className="prod-img"
                    src={product.image} alt={product.name}
                    style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}
                    loading="lazy"
                />

                {/* Discount badge */}
                <div style={{
                    position:"absolute", top:8, left:8,
                    background:"linear-gradient(120deg,#C9A84C,#e8c96a)",
                    color:"#1a1205", fontSize:9, fontWeight:800,
                    padding:"3px 8px", borderRadius:20, letterSpacing:".05em",
                    boxShadow:"0 3px 10px rgba(201,168,76,.4)",
                }}>
                    {product.discount}% OFF
                </div>

                {product.tags?.includes("bestseller") && (
                    <div style={{ position:"absolute", top:8, right:44,
                        background:"#1a1205", color:"#C9A84C",
                        fontSize:8, fontWeight:700, padding:"3px 7px", borderRadius:20,
                        letterSpacing:".08em", animation:"badgePop .4s ease both" }}>
                        BESTSELLER
                    </div>
                )}
                {product.tags?.includes("new") && !product.tags?.includes("bestseller") && (
                    <div style={{ position:"absolute", top:8, right:44,
                        background:"#16a34a", color:"#fff",
                        fontSize:8, fontWeight:700, padding:"3px 7px", borderRadius:20, letterSpacing:".08em" }}>
                        NEW
                    </div>
                )}

                {/* Wishlist button */}
                <button
                    className={`wish-btn ${isWishlisted(product.id) ? "active" : ""}`}
                    onClick={() => {
                        const nowLiked = !isWishlisted(product.id);
                        toggleItem({
                            id:       product.id,
                            name:     product.name,
                            brand:    product.brand    ?? "",
                            image:    product.image,
                            price:    product.price,
                            oldPrice: product.originalPrice ?? product.price,
                            discount: product.discount ?? 0,
                            inStock:  true,
                            slug:     product.slug ?? String(product.id),
                        });
                        onWishlistChange?.({ name: product.name, added: nowLiked });
                    }}
                    style={{
                        position:"absolute", top:8, right:8,
                        width:32, height:32, borderRadius:"50%",
                        border:"1.5px solid #EDE5D8",
                        background:"rgba(255,255,255,0.92)",
                        backdropFilter:"blur(4px)",
                        cursor:"pointer",
                        display:"flex", alignItems:"center", justifyContent:"center",
                        color: isWishlisted(product.id) ? "#ef4444" : "#bbb",
                        padding:0,
                    }}
                >
                    <Heart size={14} fill={isWishlisted(product.id) ? "#ef4444" : "none"} strokeWidth={1.8} />
                </button>
            </div>

            {/* DETAILS */}
            <div style={{ padding:"10px 11px 14px" }}>
                <p style={{ fontSize:9, fontWeight:700, color:"#C9A84C",
                    letterSpacing:".12em", textTransform:"uppercase", margin:"0 0 4px",
                    overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                    {product.subcategory}
                </p>
                <h3 style={{
                    fontSize:"clamp(12px,3vw,16px)", fontWeight:700,
                    color:"#1a1205", lineHeight:1.35,
                    margin:"0 0 3px",
                    display:"-webkit-box", WebkitLineClamp:2,
                    WebkitBoxOrient:"vertical", overflow:"hidden",
                }}>
                    {product.name}
                </h3>
                <p style={{ fontSize:10, color:"#B8A080", fontWeight:600,
                    margin:"0 0 7px", letterSpacing:".03em",
                    overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                    {product.brand}
                </p>

                {/* Stars */}
                <div style={{ display:"flex", alignItems:"center", gap:4, marginBottom:8 }}>
                    <div style={{ display:"flex", gap:1 }}>
                        {[...Array(5)].map((_,i) => (
                            <Star key={i} size={10}
                                fill={i < Math.round(product.rating) ? "#F4B400" : "none"}
                                color={i < Math.round(product.rating) ? "#F4B400" : "#ddd"}
                                strokeWidth={1.5} />
                        ))}
                    </div>
                    <span style={{ fontSize:10, color:"#A89880" }}>
                        {product.rating} ({product.reviews})
                    </span>
                </div>

                {/* Shades — scrollable on mobile */}
                {product.shades?.length > 0 && (
                    <div style={{ marginBottom:10 }}>
                        <div style={{ display:"flex", gap:4, overflowX:"auto", paddingBottom:2, scrollbarWidth:"none" }}>
                            {product.shades.map(s => (
                                <button key={s} onClick={() => setShade(s)} style={{
                                    flexShrink:0,
                                    padding:"2px 8px", borderRadius:20, fontSize:9.5, fontWeight:600, cursor:"pointer",
                                    border:`1.5px solid ${shade===s ? "#C9A84C" : "#DDD0BE"}`,
                                    background: shade===s ? "#fdf9f0" : "#fdfaf6",
                                    color: shade===s ? "#7a6030" : "#A89880",
                                    transition:"all .15s",
                                    whiteSpace:"nowrap",
                                }}>{s}</button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Price row */}
                <div style={{ display:"flex", alignItems:"baseline", gap:5, marginBottom:10, flexWrap:"wrap" }}>
                    <span className="prod-price" style={{ fontSize:16, fontWeight:700, color:"#1a1205" }}>
                        {fmt(product.price)}
                    </span>
                    <span style={{ fontSize:11, color:"#ccc", textDecoration:"line-through" }}>
                        {fmt(product.originalPrice)}
                    </span>
                    <span className="prod-save-badge" style={{
                        background:"#FFF9E6", border:"1px solid rgba(201,168,76,.3)",
                        color:"#7a5f1a", fontSize:9, fontWeight:700,
                        padding:"1px 6px", borderRadius:20,
                    }}>
                        Save {fmt(product.originalPrice - product.price)}
                    </span>
                </div>

                {/* Add to cart */}
                <button
                    className="prod-add-btn"
                    onClick={handleAdd}
                    disabled={added}
                    style={{
                        width:"100%", padding:"10px 0", borderRadius:10, border:"none",
                        background: added
                            ? "linear-gradient(120deg,#d4b87a,#e8c96a)"
                            : "linear-gradient(120deg,#140e04 0%,#3a2408 45%,#5a3a0c 65%,#140e04 100%)",
                        color: added ? "#3d2a0a" : "#fff",
                        fontSize:11.5, fontWeight:700, letterSpacing:".08em", textTransform:"uppercase",
                        cursor: added ? "default" : "pointer",
                        display:"flex", alignItems:"center", justifyContent:"center", gap:6,
                        transition:"all .3s ease",
                        WebkitTapHighlightColor:"transparent",
                    }}>
                    {added
                        ? <><Check size={13} strokeWidth={2.5}/> Added</>
                        : <><ShoppingCart size={13}/> Add to Cart</>
                    }
                </button>
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────
   PAGE
───────────────────────────────────────── */
export default function CosmeticsPage() {
    const [activeCategory, setActiveCategory] = useState("all");
    const [searchQuery, setSearchQuery]       = useState("");
    const [sortBy, setSortBy]                 = useState("popular");
    const [showSort, setShowSort]             = useState(false);

    /* Wishlist toast */
    const [toast, setToast] = useState(null);
    const toastTimer = typeof window !== "undefined" ? window : {};
    const handleWishlistChange = ({ name, added }) => {
        setToast({ name, added });
        clearTimeout(toastTimer.__wishTimer);
        toastTimer.__wishTimer = setTimeout(() => setToast(null), 2800);
    };

    const [visibleCount, setVisibleCount] = useState(20);
    const [isMobile, setIsMobile]         = useState(false);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 640);
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    useEffect(() => {
        setVisibleCount(isMobile ? 10 : 20);
    }, [activeCategory, searchQuery, sortBy, isMobile]);

    /* Close sort dropdown on outside click */
    useEffect(() => {
        if (!showSort) return;
        const handler = (e) => {
            if (!e.target.closest(".sort-dropdown")) setShowSort(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [showSort]);

    const [ref, vis] = useReveal(0.05);

    const filtered = cosmeticsProducts
        .filter(p => {
            const matchCat    = activeCategory === "all" || p.category === activeCategory;
            const matchSearch = searchQuery === "" ||
                p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.subcategory.toLowerCase().includes(searchQuery.toLowerCase());
            return matchCat && matchSearch;
        })
        .sort((a, b) => {
            if (sortBy === "price-asc")  return a.price - b.price;
            if (sortBy === "price-desc") return b.price - a.price;
            if (sortBy === "rating")     return b.rating - a.rating;
            if (sortBy === "discount")   return b.discount - a.discount;
            return b.reviews - a.reviews;
        });

    const SORT_OPTIONS = [
        { val:"popular",    label:"Most Popular"       },
        { val:"rating",     label:"Top Rated"          },
        { val:"discount",   label:"Biggest Discount"   },
        { val:"price-asc",  label:"Price: Low → High"  },
        { val:"price-desc", label:"Price: High → Low"  },
    ];

    const activeSortLabel = SORT_OPTIONS.find(o => o.val === sortBy)?.label ?? "Sort";

    return (
        <>
            <style>{STYLES}</style>
            <WishlistToast item={toast} onClose={() => setToast(null)} />

            <div style={{ minHeight:"100vh", background:"#F4EFE6", overflowX:"hidden" }}>

                {/* ══════ HERO ══════ */}
                <div style={{
                    position:"relative",
                    background:"linear-gradient(160deg,#12100c 0%,#251c10 55%,#1a1205 100%)",
                    padding:"clamp(44px,8vw,80px) 20px clamp(52px,9vw,96px)",
                    textAlign:"center", overflow:"hidden",
                }}>
                    {/* Noise texture overlay */}
                    <div style={{ position:"absolute", inset:0, opacity:.32, pointerEvents:"none",
                        backgroundImage:"url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E\")" }} />

                    {/* Decorative rings */}
                    <svg className="ornament" style={{ position:"absolute", top:-60, left:-60, opacity:.06, width:180, height:180 }} viewBox="0 0 200 200">
                        <circle cx="100" cy="100" r="90" fill="none" stroke="#C9A84C" strokeWidth="1" strokeDasharray="6 8"/>
                        <circle cx="100" cy="100" r="65" fill="none" stroke="#C9A84C" strokeWidth=".5" strokeDasharray="3 10"/>
                    </svg>
                    <svg className="ornament" style={{ position:"absolute", bottom:-70, right:-70, opacity:.07, width:200, height:200, animationDirection:"reverse" }} viewBox="0 0 200 200">
                        <circle cx="100" cy="100" r="90" fill="none" stroke="#C9A84C" strokeWidth="1" strokeDasharray="4 10"/>
                    </svg>

                    {/* Breadcrumb */}
                    <p className="hero-in" style={{ fontSize:11, color:"#9a7d50", letterSpacing:".1em", marginBottom:16 }}>
                        <Link href="/" style={{ color:"#9a7d50", textDecoration:"none" }}>Home</Link>
                        <span style={{ margin:"0 7px", color:"#C9A84C" }}>›</span>
                        <span style={{ color:"#C9A84C", fontWeight:600 }}>Cosmetics</span>
                    </p>

                    {/* Icon row */}
                    <div className="hero-in" style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:10, marginBottom:14, animationDelay:".1s" }}>
                        <div style={{ height:1, width:"clamp(24px,5vw,44px)", background:"linear-gradient(90deg,transparent,#C9A84C)" }}/>
                        <Sparkles size={16} color="#C9A84C" strokeWidth={1.5}/>
                        <div style={{ height:1, width:"clamp(24px,5vw,44px)", background:"linear-gradient(270deg,transparent,#C9A84C)" }}/>
                    </div>

                    {/* Title */}
                    <h1 className="hero-title hero-in" style={{ animationDelay:".15s" }}>
                        Luxury Cosmetics
                    </h1>
                    <p className="hero-subtitle hero-in" style={{ margin:"16px auto 28px", animationDelay:".2s" }}>
                        Curated beauty essentials — from skincare rituals to bold lip colours, crafted for the modern woman.
                    </p>

                    <div className="gold-rule" style={{ maxWidth:260, margin:"0 auto 28px" }} />

                    <div className="hero-in" style={{ animationDelay:".28s", display:"flex", justifyContent:"center", gap:12, flexWrap:"wrap" }}>
                        <a href="#products" className="cta-btn">
                            <span className="sweep"/>
                            <Sparkles size={14}/>
                            Shop Now
                            <ArrowRight size={14}/>
                        </a>
                    </div>

                    {/* Stats bar */}
                    <div className="hero-in" style={{
                        display:"flex", justifyContent:"center", gap:"clamp(16px,5vw,48px)",
                        marginTop:"clamp(28px,5vw,44px)", animationDelay:".32s",
                        flexWrap:"wrap",
                    }}>
                        {[
                            { val:`${cosmeticsProducts.length}+`, label:"Products" },
                            { val:"50+", label:"Brands" },
                            { val:"4.8★", label:"Avg Rating" },
                        ].map(s => (
                            <div key={s.label} style={{ textAlign:"center" }}>
                                <div style={{ fontSize:"clamp(18px,4vw,26px)", fontWeight:700,
                                    fontFamily:"'Cormorant Garamond',serif", color:"#C9A84C" }}>
                                    {s.val}
                                </div>
                                <div style={{ fontSize:10, color:"#7a6a50", letterSpacing:".1em",
                                    textTransform:"uppercase", fontWeight:600 }}>
                                    {s.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ══════ FILTER + SEARCH BAR ══════ */}
                <div id="products" style={{ position:"sticky", top:0, zIndex:100,
                    background:"rgba(244,239,230,0.96)", backdropFilter:"blur(12px)",
                    borderBottom:"1px solid #E8DFD0",
                    padding:"12px 0",
                }}>
                    <div className="page-inner">
                        {/* Row 1: Search + Sort */}
                        <div style={{ display:"flex", gap:8, marginBottom:10, alignItems:"center" }}>

                            {/* Search */}
                            <div className="search-wrap">
                                <Search size={14} color="#C9A84C" style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", pointerEvents:"none" }}/>
                                <input
                                    className="search-inp"
                                    type="search"
                                    placeholder="Search products…"
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    style={{
                                        width:"100%",
                                        padding:"9px 36px 9px 36px",
                                        borderRadius:12, border:"1.5px solid #E8DFD0",
                                        background:"#fff", fontSize:13,
                                        color:"#1a1205", transition:"border .2s,box-shadow .2s",
                                    }}
                                />
                                {searchQuery && (
                                    <button onClick={() => setSearchQuery("")} style={{
                                        position:"absolute", right:10, top:"50%", transform:"translateY(-50%)",
                                        background:"none", border:"none", cursor:"pointer", padding:2, color:"#bbb",
                                    }}>
                                        <X size={13}/>
                                    </button>
                                )}
                            </div>

                            {/* Sort */}
                            <div className="sort-dropdown">
                                <button onClick={() => setShowSort(v => !v)} style={{
                                    display:"flex", alignItems:"center", gap:6,
                                    padding:"9px 12px", borderRadius:12,
                                    border:"1.5px solid #E8DFD0", background:"#fff",
                                    fontSize:12, fontWeight:600, color:"#5a4020",
                                    cursor:"pointer", whiteSpace:"nowrap",
                                    WebkitTapHighlightColor:"transparent",
                                }}>
                                    <SlidersHorizontal size={13} color="#C9A84C"/>
                                    <span style={{ display: isMobile ? "none" : "inline" }}>{activeSortLabel}</span>
                                    <ChevronDown size={12} color="#C9A84C" style={{ transform: showSort ? "rotate(180deg)" : "none", transition:"transform .2s" }}/>
                                </button>

                                {showSort && (
                                    <div className="sort-menu">
                                        {SORT_OPTIONS.map(opt => (
                                            <button key={opt.val} onClick={() => { setSortBy(opt.val); setShowSort(false); }}
                                                style={{
                                                    width:"100%", padding:"11px 16px",
                                                    background: sortBy===opt.val ? "#FFF9E6" : "transparent",
                                                    border:"none", textAlign:"left",
                                                    fontSize:13, fontWeight: sortBy===opt.val ? 700 : 500,
                                                    color: sortBy===opt.val ? "#7a5f1a" : "#5a4020",
                                                    cursor:"pointer",
                                                    display:"flex", alignItems:"center", gap:8,
                                                    borderLeft: sortBy===opt.val ? "3px solid #C9A84C" : "3px solid transparent",
                                                    transition:"background .15s",
                                                }}>
                                                {sortBy===opt.val && <Check size={12} color="#C9A84C"/>}
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Row 2: Category pills — horizontally scrollable */}
                        <div className="cat-scroll">
                            {[{ id:"all", label:"All Products" }, ...cosmeticsCategories].map(cat => (
                                <button
                                    key={cat.id}
                                    className="cat-pill"
                                    onClick={() => setActiveCategory(cat.id)}
                                    style={{
                                        padding:"7px 14px", borderRadius:20,
                                        fontSize:11,
                                        background: activeCategory===cat.id
                                            ? "linear-gradient(120deg,#140e04,#3a2408)"
                                            : "#fff",
                                        color: activeCategory===cat.id ? "#C9A84C" : "#7a6050",
                                        border: activeCategory===cat.id
                                            ? "1.5px solid #3a2408"
                                            : "1.5px solid #E8DFD0",
                                        boxShadow: activeCategory===cat.id
                                            ? "0 4px 16px rgba(20,14,4,.18)"
                                            : "none",
                                    }}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ══════ PRODUCTS GRID ══════ */}
                <div className="page-inner" style={{ paddingTop:24, paddingBottom:48 }}>
                    {/* Results count */}
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
                        marginBottom:16, flexWrap:"wrap", gap:8 }}>
                        <p style={{ fontSize:12, color:"#9a7d50", fontWeight:600, letterSpacing:".06em", margin:0 }}>
                            Showing <span style={{ color:"#C9A84C" }}>{Math.min(visibleCount, filtered.length)}</span> of{" "}
                            <span style={{ color:"#1a1205" }}>{filtered.length}</span> products
                        </p>
                        {searchQuery && (
                            <p style={{ fontSize:11, color:"#7a6050", margin:0 }}>
                                Results for "<strong>{searchQuery}</strong>"
                            </p>
                        )}
                    </div>

                    {/* Grid */}
                    <div ref={ref} className="products-grid">
                        {filtered.slice(0, visibleCount).map((product, idx) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                delay={Math.min(idx * 0.04, 0.4)}
                                onWishlistChange={handleWishlistChange}
                            />
                        ))}
                    </div>

                    {/* Empty state */}
                    {filtered.length === 0 && (
                        <div style={{ textAlign:"center", padding:"60px 20px" }}>
                            <Sparkles size={40} color="#C9A84C" style={{ opacity:.4, marginBottom:16 }}/>
                            <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:24, color:"#1a1205", margin:"0 0 8px" }}>
                                No products found
                            </h3>
                            <p style={{ color:"#9a7d50", fontSize:13, margin:"0 0 20px" }}>
                                Try adjusting your search or filters.
                            </p>
                            <button onClick={() => { setSearchQuery(""); setActiveCategory("all"); }}
                                style={{ padding:"10px 24px", borderRadius:12, border:"1.5px solid #C9A84C",
                                    background:"transparent", color:"#7a5f1a", fontWeight:700,
                                    fontSize:12, cursor:"pointer", letterSpacing:".08em", textTransform:"uppercase" }}>
                                Clear Filters
                            </button>
                        </div>
                    )}

                    {/* Load more */}
                    {visibleCount < filtered.length && (
                        <div style={{ textAlign:"center", marginTop:36 }}>
                            <button
                                className="load-more-btn"
                                onClick={() => setVisibleCount(v => v + (isMobile ? 10 : 12))}
                            >
                                <ChevronDown size={15}/>
                                Load More ({filtered.length - visibleCount} remaining)
                            </button>
                        </div>
                    )}
                </div>

                {/* ══════ FOOTER BANNER ══════ */}
                <div style={{
                    background:"linear-gradient(160deg,#12100c 0%,#251c10 100%)",
                    padding:"clamp(36px,6vw,60px) 20px",
                    textAlign:"center",
                }}>
                    <div className="gold-rule" style={{ maxWidth:200, margin:"0 auto 28px" }}/>
                    <h2 style={{ fontFamily:"'Cormorant Garamond',serif",
                        fontSize:"clamp(22px,5vw,42px)", fontWeight:700,
                        color:"#F4EFE6", margin:"0 0 10px" }}>
                        Discover Your Beauty
                    </h2>
                    <p style={{ color:"#9a7d50", fontSize:"clamp(12px,2vw,14px)",
                        margin:"0 auto 24px", maxWidth:380 }}>
                        Free shipping on orders above ₹999. Authentic products, always.
                    </p>
                    <Link href="/offers" className="cta-btn" style={{ fontSize:12 }}>
                        <span className="sweep"/>
                        View All Offers
                        <ArrowRight size={13}/>
                    </Link>
                    <div className="gold-rule" style={{ maxWidth:200, margin:"28px auto 0" }}/>
                </div>
            </div>
        </>
    );
}
