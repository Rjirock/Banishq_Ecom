// app/products/page.jsx
"use client";

import Link from "next/link";
import { useState, useCallback, useMemo } from "react";
import { Heart, ShoppingCart, Check, Star, PackageX, X } from "lucide-react";
import { products } from "../../data/product-details/products";
import { useFilters }  from "@/context/FilterContext";
import { useWishlist } from "@/context/WishlistContext";
import { useCart as useCartCtx } from "@/context/CartContext";

/* ─── Filter maps — must match sidebar options exactly ─── */
const PRICE_RANGES = {
  "Under ₹999":       [0,     999],
  "₹1,000 – ₹2,999": [1000,  2999],
  "₹3,000 – ₹5,999": [3000,  5999],
  "₹6,000 – ₹9,999": [6000,  9999],
  "₹10,000 & Above": [10000, Infinity],
};
const RATING_MIN = {
  "2.0 and above": 2.0,
  "3.0 and above": 3.0,
  "3.5 and above": 3.5,
  "4.0 and above": 4.0,
};

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


function ToastStack({ toasts, onRemove }) {
  if (!toasts.length) return null;
  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[9999]
                    flex flex-col gap-2 items-center pointer-events-none"
         style={{ width: "min(90vw, 320px)" }}>
      {toasts.map((t) => (
        <div key={t.id}
             className="toast-anim w-full flex items-center gap-3 pointer-events-auto
                        bg-[#111] text-white rounded-xl px-3.5 py-3"
             style={{
               border: `1px solid ${t.type === "cart" ? "rgba(201,168,76,0.3)" : "rgba(239,68,68,0.3)"}`,
               boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
             }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
               style={{ background: t.type === "cart" ? "rgba(201,168,76,0.15)" : "rgba(239,68,68,0.15)" }}>
            {t.type === "cart"
              ? <ShoppingCart size={14} color="#C9A84C" />
              : <Heart size={14} color="#ef4444" fill={t.liked ? "#ef4444" : "none"} />
            }
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12.5px] font-bold m-0 leading-tight">{t.title}</p>
            <p className="text-[10.5px] text-gray-400 m-0 mt-0.5 truncate">{t.sub}</p>
          </div>
          {t.qty && (
            <span className="bg-[#C9A84C] text-[#1a1a1a] text-[11px] font-extrabold
                             rounded-full px-2 py-0.5 shrink-0">×{t.qty}</span>
          )}
          <button onClick={() => onRemove(t.id)}
                  className="text-gray-500 hover:text-white transition-colors shrink-0">
            <X size={13} />
          </button>
        </div>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════
   STAR RATING
══════════════════════════════════════ */
function StarRow({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map((s) => (
        <Star key={s} size={10} strokeWidth={0}
              style={{ fill: s <= Math.round(rating) ? "#C9A84C" : "#E2E8F0" }} />
      ))}
    </div>
  );
}

/* ══════════════════════════════════════
   PRODUCT CARD
══════════════════════════════════════ */
function ProductCard({ product, liked, cartQty, onLike, onCart }) {
  const [added, setAdded] = useState(false);

  const handleCart = (e) => {
    e.preventDefault();
    onCart();
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  // Use first image from images array, fallback to image property
  const imgSrc = product.images?.[0] ?? product.image ?? "";

  // Compute discount % from data or calculate
  const discountPct = product.discount
    ? product.discount
    : product.oldPrice
      ? `${Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}% OFF`
      : null;

  return (
    <Link href={`/products/${product.slug}`} className="block no-underline">
      <div className="product-card group relative bg-white rounded-xl overflow-hidden
                      border border-[#EDE8DF]
                      shadow-[0_1px_6px_rgba(0,0,0,0.05)]
                      hover:shadow-[0_6px_24px_rgba(0,0,0,0.09)]
                      hover:-translate-y-0.5
                      transition-all duration-300 ease-out">

        {/* ── IMAGE ─────────────────────────── */}
        <div className="relative overflow-hidden bg-[#FAF7F3]"
             style={{ aspectRatio: "1 / 1" }}>
          <img
            src={imgSrc}
            alt={product.name}
            className="w-full h-full object-cover
                       group-hover:scale-[1.04]
                       transition-transform duration-500 ease-out"
          />

          {/* discount badge */}
          {discountPct && (
            <span className="absolute top-2.5 left-2.5 bg-red-500 text-white
                             text-[9px] font-bold tracking-wide px-2 py-[3px] rounded-md z-10">
              {discountPct}
            </span>
          )}

          {/* wishlist */}
          <button
            onClick={(e) => { e.preventDefault(); onLike(); }}
            aria-label="Wishlist"
            className={`absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full
                        flex items-center justify-center border
                        transition-all duration-200 active:scale-90
                        ${liked
                          ? "bg-red-500 border-red-400 shadow-[0_2px_8px_rgba(239,68,68,0.35)]"
                          : "bg-white border-gray-200 hover:border-red-300 hover:bg-red-50"
                        }`}
          >
            <Heart size={13} strokeWidth={1.8}
                   className={liked ? "fill-white stroke-white" : "text-gray-400"} />
          </button>

          {/* cart qty indicator */}
          {cartQty > 0 && (
            <span className="absolute bottom-2.5 left-2.5 z-10
                             bg-[#C9A84C] text-[#1a1a1a] text-[9px] font-extrabold
                             rounded-full px-2 py-[2px] shadow-sm">
              ×{cartQty} in cart
            </span>
          )}
        </div>

        {/* ── DETAILS ───────────────────────── */}
        <div className="p-3">

          {/* category */}
          <p className="text-[9.5px] font-bold uppercase tracking-[0.16em]
                        text-[#B8964E] mb-1">
            {product.category}
          </p>

          {/* name — 2 lines fixed */}
          <h3 className="card-name text-gray-900 leading-[1.4] line-clamp-2 mb-2"
              style={{ minHeight: "40px" }}>
            {product.name}
          </h3>

          {/* stars + review count */}
          <div className="flex items-center gap-1.5 mb-2.5">
            <StarRow rating={product.rating} />
            <span className="text-[10px] text-gray-400">
              {product.rating} ({product.totalReviews ?? 0})
            </span>
          </div>

          {/* price row */}
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-[15px] font-bold text-gray-900">
              ₹{Number(product.price).toLocaleString()}
            </span>
            {product.oldPrice && (
              <span className="text-[11.5px] text-gray-400 line-through">
                ₹{Number(product.oldPrice).toLocaleString()}
              </span>
            )}
          </div>

          {/* gold sweep divider */}
          <div className="h-px bg-gray-100 overflow-hidden mb-3">
            <div className="h-full bg-gradient-to-r from-[#C9A84C] to-[#E8C87A]
                            w-0 group-hover:w-full transition-all duration-500 ease-out" />
          </div>

          {/* ── ADD TO CART — always visible ── */}
          <button
            onClick={handleCart}
            className={`w-full flex items-center justify-center gap-2
                        py-2.5 rounded-lg text-[12px] font-semibold tracking-wide
                        border transition-all duration-200 active:scale-[0.98]
                        ${added
                          ? "bg-green-500 border-green-500 text-white shadow-[0_2px_10px_rgba(34,197,94,0.3)]"
                          : "bg-[#1a1a1a] border-[#1a1a1a] text-white hover:bg-[#2d2d2d] hover:shadow-[0_4px_14px_rgba(26,26,26,0.25)]"
                        }`}
          >
            {added
              ? <><Check size={13} strokeWidth={2.5} /> Added to Cart</>
              : <><ShoppingCart size={13} /> Add to Cart</>
            }
          </button>
        </div>
      </div>
    </Link>
  );
}

/* ══════════════════════════════════════
   SORT + CHIP BAR
══════════════════════════════════════ */
function SortBar({ total, sortBy, setSortBy }) {
  const { filters, toggleFilter } = useFilters();
  const chips = Object.entries(filters).flatMap(([g, vs]) => vs.map((v) => ({ g, v })));

  return (
    <div className="mb-5">
      <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
        <p className="text-[12.5px] text-gray-500">
          <span className="text-gray-900 font-bold text-[14px]">{total}</span> products
        </p>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="text-[12px] font-medium bg-white border border-gray-200 rounded-lg
                     px-3 py-1.5 outline-none text-gray-700 cursor-pointer shadow-sm
                     focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C]/20
                     transition-all duration-150"
        >
          <option value="default">Sort: Featured</option>
          <option value="price_asc">Price: Low → High</option>
          <option value="price_desc">Price: High → Low</option>
          <option value="rating_desc">Top Rated</option>
          <option value="name_asc">Name: A – Z</option>
        </select>
      </div>

      {chips.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {chips.map(({ g, v }) => (
            <button key={`${g}-${v}`}
                    onClick={() => toggleFilter(g, v)}
                    className="flex items-center gap-1 text-[10.5px] font-semibold
                               border border-[#C9A84C]/60 text-[#7a6030] bg-[#fdf9f3]
                               px-2.5 py-1 rounded-full
                               hover:bg-red-50 hover:border-red-300 hover:text-red-500
                               active:scale-95 transition-all duration-150 group/chip">
              {v}
              <span className="text-[8px] opacity-50 group-hover/chip:opacity-100
                               group-hover/chip:rotate-90 inline-block transition-all">✕</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════
   PAGE
══════════════════════════════════════ */
export default function ProductsPage() {
  const { filters }                             = useFilters();
  const { toggleWishlist, isWishlisted }        = useWishlist();
  const [sortBy, setSortBy]     = useState("default");
  const [cart, setCart]         = useState([]);
  const [toasts, setToasts]     = useState([]);
  const [wishToast, setWishToast] = useState(null); // { name, added }

  /* ── cart toasts ── */
  const pushToast = useCallback((t) => {
    const id = Date.now() + Math.random();
    setToasts((p) => [...p.slice(-2), { ...t, id }]);
    setTimeout(() => setToasts((p) => p.filter((x) => x.id !== id)), 3500);
  }, []);
  const removeToast = useCallback(
    (id) => setToasts((p) => p.filter((x) => x.id !== id)), []
  );

  /* ── wishlist — uses global context + shows mini toast ── */
  const handleWishlist = useCallback((product) => {
    const wasLiked = isWishlisted(product.slug ?? product.id);
    toggleWishlist({
      id:            product.slug ?? product.id,
      name:          product.name,
      brand:         product.category ?? "",
      image:         product.images?.[0] ?? product.image ?? "",
      price:         Number(product.price),
      originalPrice: Number(product.oldPrice ?? product.price),
      discount:      product.discount ?? 0,
    });
    // show mini wishlist toast
    setWishToast({ name: product.name, added: !wasLiked });
    setTimeout(() => setWishToast(null), 2800);
  }, [toggleWishlist, isWishlisted]);

  /* ── cart ── */
  const addToCart = useCallback((product) => {
    let newQty = 1;
    setCart((prev) => {
      const ex = prev.find((x) => x.id === product.slug);
      if (ex) {
        newQty = ex.qty + 1;
        return prev.map((x) => x.id === product.slug ? { ...x, qty: newQty } : x);
      }
      return [...prev, { id: product.slug, qty: 1 }];
    });
    setTimeout(() => {
      setCart((latest) => {
        const item = latest.find((x) => x.id === product.slug);
        pushToast({
          type: "cart", title: "Added to Cart",
          sub: product.name, qty: item?.qty ?? 1,
        });
        return latest;
      });
    }, 0);
  }, [pushToast]);

  const cartCount = cart.reduce((s, x) => s + x.qty, 0);

  /* ── filter + sort ── */
  const filtered = useMemo(() => {
    let list = [...products];

    if (filters.price?.length)
      list = list.filter((p) =>
        filters.price.some((l) => {
          const [mn, mx] = PRICE_RANGES[l] ?? [0, Infinity];
          return Number(p.price) >= mn && Number(p.price) <= mx;
        })
      );
    if (filters.categories?.length)
      list = list.filter((p) =>
        filters.categories.some((c) =>
          p.category?.toLowerCase() === c.toLowerCase()
        )
      );
    if (filters.material?.length)
      list = list.filter((p) =>
        filters.material.some((m) =>
          p.specifications?.some((s) => s.toLowerCase().includes(m.toLowerCase())) ||
          p.additionalInfo?.some((a) => a.value?.toLowerCase().includes(m.toLowerCase()))
        )
      );
    if (filters.occasion?.length)
      list = list.filter((p) =>
        filters.occasion.some((o) =>
          p.specifications?.some((s) => s.toLowerCase().includes(o.toLowerCase())) ||
          p.additionalInfo?.some((a) => a.value?.toLowerCase().includes(o.toLowerCase())) ||
          p.shortDescription?.toLowerCase().includes(o.toLowerCase())
        )
      );
    if (filters.rating?.length) {
      const mn = Math.max(...filters.rating.map((r) => RATING_MIN[r] ?? 0));
      list = list.filter((p) => Number(p.rating) >= mn);
    }

    switch (sortBy) {
      case "price_asc":   list.sort((a, b) => Number(a.price) - Number(b.price)); break;
      case "price_desc":  list.sort((a, b) => Number(b.price) - Number(a.price)); break;
      case "rating_desc": list.sort((a, b) => Number(b.rating) - Number(a.rating)); break;
      case "name_asc":    list.sort((a, b) => a.name.localeCompare(b.name)); break;
    }
    return list;
  }, [filters, sortBy]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant:wght@500;600&family=Jost:wght@300;400;500;600&display=swap');

        .product-card { font-family: 'Jost', sans-serif; animation: cardIn 0.35s ease both; }
        .card-name    { font-family: 'Cormorant', Georgia, serif; font-size: 14px; font-weight: 600; color: #1a1a1a; }

        @keyframes cardIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes wishToastIn {
          from { opacity:0; transform:translateX(-50%) translateY(16px) scale(0.95); }
          to   { opacity:1; transform:translateX(-50%) translateY(0)    scale(1);    }
        }
        .toast-anim { animation: toastIn 0.28s cubic-bezier(0.34,1.4,0.64,1) both; }
      `}</style>

      <div className="min-h-screen bg-[#F7F4EF]" style={{ fontFamily: "'Jost', sans-serif" }}>

        {/* Cart bubble */}
        {cartCount > 0 && (
          <div className="fixed top-4 right-4 z-[998] flex items-center gap-2
                          bg-[#1a1a1a] text-white text-[12px] font-bold
                          rounded-full px-4 py-2
                          border border-[#C9A84C]/25
                          shadow-[0_4px_18px_rgba(0,0,0,0.22)]">
            <ShoppingCart size={13} />
            {cartCount}
          </div>
        )}

        <div className="max-w-[960px] mx-auto px-3 pb-14 pt-1">
          <SortBar total={filtered.length} sortBy={sortBy} setSortBy={setSortBy} />

          {filtered.length === 0 ? (
            /* empty state */
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-14 h-14 rounded-full bg-[#ede5d5] flex items-center
                              justify-center mb-4">
                <PackageX size={22} className="text-[#C9A84C]" />
              </div>
              <h3 className="text-[19px] text-gray-800 mb-1.5"
                  style={{ fontFamily: "'Cormorant', serif", fontWeight: 600 }}>
                No products found
              </h3>
              <p className="text-[12px] text-gray-400 tracking-wide">
                Try adjusting or clearing your filters
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map((product, i) => (
                <div key={product.slug} style={{ animationDelay: `${i * 0.04}s` }}>
                  <ProductCard
                    product={product}
                    liked={isWishlisted(product.slug ?? product.id)}
                    cartQty={cart.find((x) => x.id === product.slug)?.qty ?? 0}
                    onLike={() => handleWishlist(product)}
                    onCart={() => addToCart(product)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <ToastStack toasts={toasts} onRemove={removeToast} />
        <WishlistToast item={wishToast} onClose={() => setWishToast(null)} />
      </div>
    </>
  );
}