// app/wishlist/page.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  X, Share2, ShoppingCart, Check,
  PackageX, ExternalLink, Eye,
} from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { useCart }     from "@/context/CartContext";

/* ─────────────────────────────────────────────
   Helper — build product detail URL from item.
   Adjust the path to match your routing structure:

   /products/[slug]          ← if you use slug-based routing  (default below)
   /product/[id]             ← if you use id-based routing
   /category/[cat]/[slug]    ← if nested under category

   Just change PRODUCT_URL() below.
───────────────────────────────────────────── */
function PRODUCT_URL(item) {
  // Use slug if available, otherwise fall back to id
  const key = item.slug || item.id;
  return `/products/${key}`;
}

/* ─────────────────────────────────────────────
   WISHLIST ROW
───────────────────────────────────────────── */
function WishlistRow({ item, onRemove, cartAdded, onAddToCart, onViewProduct }) {
  const [imgHovered, setImgHovered] = useState(false);

  return (
    <div className="group flex flex-col md:grid
                    md:grid-cols-[40px_100px_1fr_140px_140px_180px]
                    gap-4 px-4 md:px-6 py-5 border-b border-gray-100
                    hover:bg-[#fdf9f4] transition-all duration-200">

      {/* ── Mobile: top row ── */}
      <div className="flex items-start gap-3 md:contents">

        {/* Remove button */}
        <button
          onClick={() => onRemove(item.id)}
          title="Remove from wishlist"
          className="w-7 h-7 shrink-0 flex items-center justify-center rounded-full
                     border border-gray-300 text-gray-400
                     hover:border-red-400 hover:text-red-400 hover:bg-red-50 transition"
        >
          <X size={13} />
        </button>

        {/* ── Product Image — clickable ── */}
        <div
          className="relative w-[72px] h-[84px] shrink-0 rounded-xl overflow-hidden
                     bg-gray-100 cursor-pointer group/img"
          onClick={() => onViewProduct(item)}
          onMouseEnter={() => setImgHovered(true)}
          onMouseLeave={() => setImgHovered(false)}
          title="View product details"
        >
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-500
                       group-hover/img:scale-110"
          />
          {/* Hover overlay with eye icon */}
          <div className={`absolute inset-0 bg-black/40 flex items-center justify-center
                           transition-opacity duration-200
                           ${imgHovered ? "opacity-100" : "opacity-0"}`}>
            <Eye size={18} className="text-white" />
          </div>
        </div>

        {/* Mobile info block */}
        <div className="flex-1 min-w-0 md:hidden">
          {/* Clickable name on mobile */}
          <p
            className="text-[14px] font-semibold text-gray-900 leading-snug
                       cursor-pointer hover:text-[#7a6030] hover:underline
                       underline-offset-2 transition-colors"
            onClick={() => onViewProduct(item)}
          >
            {item.name}
          </p>
          {item.brand && (
            <p className="text-[11px] text-gray-400 mt-0.5">{item.brand}</p>
          )}
          <p className="text-[13px] text-[#7a6030] font-bold mt-1">
            ₹{item.price.toLocaleString("en-IN")}
          </p>
          <p className={`text-[12px] mt-1 font-medium ${
            item.inStock !== false ? "text-green-600" : "text-red-400"
          }`}>
            {item.inStock !== false ? "● In Stock" : "● Out of Stock"}
          </p>
          {/* View product link on mobile */}
          <button
            onClick={() => onViewProduct(item)}
            className="mt-2 flex items-center gap-1 text-[11px] text-[#7a6030]
                       font-semibold hover:underline underline-offset-2"
          >
            <ExternalLink size={11} /> View Details
          </button>
        </div>
      </div>

      {/* ── Desktop: Product Name column ── */}
      <div className="hidden md:flex md:flex-col md:justify-center">
        <button
          onClick={() => onViewProduct(item)}
          className="text-left group/name"
          title="View product details"
        >
          <p className="text-[14.5px] font-bold text-gray-900 leading-snug
                        group-hover/name:text-[#7a6030] transition-colors
                        group-hover/name:underline underline-offset-2">
            {item.name}
          </p>
          {item.brand && (
            <p className="text-[11px] text-gray-400 mt-0.5">{item.brand}</p>
          )}
          <span className="mt-1 flex items-center gap-1 text-[11px]
                           text-[#b8964e] opacity-0 group-hover/name:opacity-100
                           transition-opacity">
            <ExternalLink size={10} /> View details
          </span>
        </button>
      </div>

      {/* ── Desktop: Price column ── */}
      <div className="hidden md:flex md:items-center">
        <p className="text-[15px] font-bold text-gray-900">
          ₹{item.price.toLocaleString("en-IN")}
        </p>
      </div>

      {/* ── Desktop: Stock column ── */}
      <div className="hidden md:flex md:items-center">
        {item.inStock !== false ? (
          <span className="text-green-600 text-[13px] font-semibold">● In Stock</span>
        ) : (
          <span className="text-red-400 text-[13px] font-semibold">● Out of Stock</span>
        )}
      </div>

      {/* ── Add to Cart button ── */}
      <div className="flex items-center w-full md:w-auto">
        <button
          onClick={() => item.inStock !== false && onAddToCart(item)}
          disabled={item.inStock === false}
          className={`w-full px-5 py-2.5 rounded-lg text-[12px] font-bold uppercase
                      flex items-center justify-center gap-2 transition-all duration-300
                      ${cartAdded
                        ? "bg-green-500 text-white scale-95"
                        : item.inStock !== false
                        ? "bg-[#7a6030] text-white hover:bg-[#5e4a25] hover:-translate-y-0.5"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                      }`}
        >
          {cartAdded
            ? <><Check size={14} /> Added!</>
            : <><ShoppingCart size={14} /> Add to Cart</>
          }
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   WISHLIST PAGE
───────────────────────────────────────────── */
export default function WishlistPage() {
  const router = useRouter();
  const { wishlist, removeItem } = useWishlist();
  const { addItem }              = useCart();

  const [cartAdded,  setCartAdded]  = useState([]);
  const [shareToast, setShareToast] = useState(false);

  /* ── Navigate to product detail page ── */
  const handleViewProduct = (item) => {
    router.push(PRODUCT_URL(item));
  };

  /* ── Add to cart ── */
  const handleAddToCart = (item) => {
    if (cartAdded.includes(item.id)) return;
    addItem({
      id:            item.id,
      name:          item.name,
      brand:         item.brand          ?? "",
      image:         item.image,
      price:         item.price,
      originalPrice: item.oldPrice ?? item.price,
      discount:      item.discount       ?? 0,
    });
    setCartAdded(prev => [...prev, item.id]);
    setTimeout(() => setCartAdded(prev => prev.filter(x => x !== item.id)), 2000);
  };

  /* ── Share wishlist link ── */
  const handleShare = async () => {
    try { await navigator.clipboard.writeText(window.location.href); } catch (_) {}
    setShareToast(true);
    setTimeout(() => setShareToast(false), 2500);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@400;500;700&display=swap');
        body { font-family: 'DM Sans', sans-serif; }
        @keyframes fadeSlide { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes toastIn   { from{opacity:0;transform:translateY(10px) scale(.95)} to{opacity:1;transform:translateY(0) scale(1)} }
      `}</style>

      {/* Share toast */}
      {shareToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2
                        bg-gray-900 text-white text-[13px] font-medium px-5 py-3 rounded-full shadow-xl
                        animate-[toastIn_0.25s_ease_both]">
          <Check size={14} /> Wishlist link copied!
        </div>
      )}

      <div className="min-h-screen bg-[#f5f0e8]">

        {/* ── Page header ── */}
        <div className="bg-[#f0ebe0] border-b border-[#e0d8cc] py-10 px-6 text-center
                        animate-[fadeSlide_0.4s_ease_both]">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}>
            My Wishlist
          </h1>
          <p className="text-[13px] text-gray-400 mt-1.5 tracking-wide">
            <span className="hover:text-gray-700 cursor-pointer transition-colors"
                  onClick={() => router.push("/")}>Home</span>
            {" / "}
            <span className="text-gray-600 font-medium">Wishlist</span>
          </p>
        </div>

        <div className="w-full px-4 md:px-6 lg:px-12 xl:px-20 py-10
                        animate-[fadeSlide_0.5s_ease_both]">

          {/* ── Empty state ── */}
          {wishlist.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-28 text-center">
              <div className="w-20 h-20 rounded-full bg-[#f0ebe0]
                              flex items-center justify-center mb-5">
                <PackageX size={32} className="text-[#b8964e]" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2"
                  style={{ fontFamily: "'Playfair Display', serif" }}>
                Your wishlist is empty
              </h3>
              <p className="text-[13.5px] text-gray-400 mb-6 font-light">
                Tap the ❤️ on any product to save it here.
              </p>
              <button
                onClick={() => router.push("/products")}
                className="px-8 py-3 bg-[#7a6030] text-white text-sm font-bold uppercase
                           tracking-widest rounded-xl hover:bg-[#5e4a25]
                           hover:-translate-y-0.5 transition-all duration-200
                           shadow-[0_2px_12px_rgba(122,96,48,0.25)]"
              >
                Browse Products
              </button>
            </div>

          ) : (
            /* ── Wishlist table ── */
            <div className="bg-white rounded-2xl shadow-[0_2px_24px_rgba(0,0,0,0.06)]
                            overflow-hidden w-full">

              {/* Table header — desktop only */}
              <div className="hidden md:grid
                              grid-cols-[40px_100px_1fr_140px_140px_180px]
                              items-center gap-4 px-6 py-4
                              bg-[#c9a84c]/20 border-b border-[#e0d0b0]">
                <div /><div />
                <p className="text-[12px] font-bold text-[#7a5c20] uppercase tracking-widest">
                  Product Name
                </p>
                <p className="text-[12px] font-bold text-[#7a5c20] uppercase tracking-widest">
                  Price
                </p>
                <p className="text-[12px] font-bold text-[#7a5c20] uppercase tracking-widest">
                  Stock
                </p>
                <div />
              </div>

              {/* Rows */}
              {wishlist.map((item) => (
                <WishlistRow
                  key={item.id}
                  item={item}
                  onRemove={removeItem}
                  cartAdded={cartAdded.includes(item.id)}
                  onAddToCart={handleAddToCart}
                  onViewProduct={handleViewProduct}
                />
              ))}

              {/* Footer */}
              <div className="flex items-center justify-between
                              px-4 md:px-6 py-5
                              bg-gray-50/80 border-t border-gray-100
                              flex-wrap gap-4">

                {/* Share */}
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2.5 text-[13.5px] font-bold
                             text-gray-600 hover:text-[#7a6030] transition-colors group"
                >
                  <div className="w-8 h-8 rounded-full border border-gray-300
                                  flex items-center justify-center
                                  group-hover:border-[#b8964e] group-hover:bg-[#fdf8f2]
                                  transition-all duration-200">
                    <Share2 size={14} className="text-gray-500 group-hover:text-[#b8964e] transition-colors" />
                  </div>
                  Share wishlist
                </button>

                {/* View Cart */}
                <button
                  onClick={() => router.push("/cart")}
                  className="relative overflow-hidden flex items-center gap-2.5
                             bg-[#7a6030] hover:bg-[#5e4a25] text-white
                             text-[13px] font-bold tracking-[0.12em] uppercase
                             px-8 md:px-10 py-3.5 rounded-xl
                             shadow-[0_3px_16px_rgba(122,96,48,0.30)]
                             hover:-translate-y-0.5 transition-all duration-200 group/vc"
                >
                  <span className="absolute inset-0 -translate-x-full
                                   group-hover/vc:translate-x-full transition-transform duration-700
                                   bg-gradient-to-r from-transparent via-white/15 to-transparent
                                   pointer-events-none" />
                  <ShoppingCart size={16} />
                  View Cart
                  {cartAdded.length > 0 && (
                    <span className="w-5 h-5 rounded-full bg-white text-[#7a6030]
                                     text-[11px] font-bold flex items-center justify-center ml-0.5">
                      {cartAdded.length}
                    </span>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}