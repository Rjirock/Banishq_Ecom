// app/wishlist/page.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Share2, ShoppingCart, Check, PackageX } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { useCart }     from "@/context/CartContext";

/* ─── Row component ─────────────────────────── */
function WishlistRow({ item, onRemove, cartAdded, onAddToCart }) {
  return (
    <div className="group grid grid-cols-[36px_80px_1fr_120px_120px_160px] items-center
                    gap-4 px-6 py-5 border-b border-gray-100 last:border-b-0
                    hover:bg-[#fdf9f4] transition-colors duration-200
                    animate-[fadeSlide_0.35s_ease_both]">

      {/* Remove */}
      <button
        onClick={() => onRemove(item.id)}
        className="w-7 h-7 flex items-center justify-center rounded-full border border-gray-300
                   text-gray-400 hover:border-red-400 hover:text-red-400 hover:bg-red-50
                   transition-all duration-200 hover:scale-110 active:scale-95 shrink-0"
        title="Remove from wishlist"
      >
        <X size={13} strokeWidth={2.5} />
      </button>

      {/* Image */}
      <div className="w-[72px] h-[84px] rounded-xl overflow-hidden bg-gray-100 ring-1 ring-gray-200 shrink-0">
        <img src={item.image} alt={item.name}
             className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      </div>

      {/* Name */}
      <div>
        <p className="text-[14.5px] font-bold text-gray-900 leading-snug pr-4">{item.name}</p>
        {item.brand && <p className="text-[11px] text-gray-400 mt-0.5">{item.brand}</p>}
      </div>

      {/* Price */}
      <p className="text-[15px] font-bold text-gray-900">
        ₹{item.price.toLocaleString("en-IN")}
      </p>

      {/* Stock */}
      <div>
        {item.inStock !== false ? (
          <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-green-600">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            In Stock
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-red-400">
            <span className="w-2 h-2 rounded-full bg-red-400" />
            Out of Stock
          </span>
        )}
      </div>

      {/* Add to Cart */}
      <button
        onClick={() => item.inStock !== false && onAddToCart(item)}
        disabled={item.inStock === false}
        className={`relative overflow-hidden px-5 py-2.5 rounded-lg border text-[12px] font-bold
                    tracking-[0.1em] uppercase transition-all duration-300 group/btn
                    ${cartAdded
                      ? "border-green-500 text-green-600 bg-green-50 scale-95"
                      : item.inStock !== false
                      ? "border-[#b8964e] text-[#7a6030] hover:bg-[#7a6030] hover:text-white hover:border-[#7a6030] hover:shadow-[0_4px_20px_rgba(122,96,48,0.35)] hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
                      : "border-gray-200 text-gray-300 cursor-not-allowed"
                    }`}
      >
        {item.inStock !== false && !cartAdded && (
          <span className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full
                           transition-transform duration-700
                           bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
        )}
        {cartAdded
          ? <span className="flex items-center gap-1.5"><Check size={13} strokeWidth={3} /> Added!</span>
          : "Add to Cart"}
      </button>
    </div>
  );
}

/* ─── Page ──────────────────────────────────── */
export default function WishlistPage() {
  const router = useRouter();
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addItem }                      = useCart();

  const [cartAdded,  setCartAdded]  = useState([]);   // ids added to cart this session
  const [shareToast, setShareToast] = useState(false);

  const handleAddToCart = (item) => {
    if (cartAdded.includes(item.id)) return;
    addItem({
      id:            item.id,
      name:          item.name,
      brand:         item.brand   ?? "",
      image:         item.image,
      price:         item.price,
      originalPrice: item.originalPrice ?? item.price,
      discount:      item.discount ?? 0,
    });
    setCartAdded((prev) => [...prev, item.id]);
    // reset "Added!" after 2s
    setTimeout(() => setCartAdded((prev) => prev.filter((x) => x !== item.id)), 2000);
  };

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
        @keyframes toastIn   { from{opacity:0;transform:translateY(10px) scale(0.95)} to{opacity:1;transform:translateY(0) scale(1)} }
      `}</style>

      {shareToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2
                        bg-gray-900 text-white text-[13px] font-medium px-5 py-3 rounded-full shadow-xl
                        animate-[toastIn_0.25s_ease_both]">
          <Check size={14} /> Wishlist link copied!
        </div>
      )}

      <div className="min-h-screen bg-[#f5f0e8]">

        {/* Header */}
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

        <div className="w-full px-6 lg:px-12 xl:px-20 py-10 animate-[fadeSlide_0.5s_ease_both]">

          {wishlist.length === 0 ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center py-28 text-center">
              <div className="w-20 h-20 rounded-full bg-[#f0ebe0] flex items-center justify-center mb-5">
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
                className="px-8 py-3 bg-[#7a6030] text-white text-sm font-bold uppercase tracking-widest
                           rounded-xl hover:bg-[#5e4a25] hover:-translate-y-0.5 transition-all duration-200
                           shadow-[0_2px_12px_rgba(122,96,48,0.25)]"
              >
                Browse Products
              </button>
            </div>

          ) : (
            /* Wishlist table */
            <div className="bg-white rounded-2xl shadow-[0_2px_24px_rgba(0,0,0,0.06)] overflow-hidden w-full">

              {/* Table header */}
              <div className="grid grid-cols-[36px_80px_1fr_120px_120px_160px] items-center
                              gap-4 px-6 py-4 bg-[#c9a84c]/20 border-b border-[#e0d0b0]">
                <div /><div />
                <p className="text-[12.5px] font-bold text-[#7a5c20] uppercase tracking-widest">Product Name</p>
                <p className="text-[12.5px] font-bold text-[#7a5c20] uppercase tracking-widest">Unit Price</p>
                <p className="text-[12.5px] font-bold text-[#7a5c20] uppercase tracking-widest">Stock Status</p>
                <div />
              </div>

              {wishlist.map((item) => (
                <WishlistRow
                  key={item.id}
                  item={item}
                  onRemove={removeFromWishlist}
                  cartAdded={cartAdded.includes(item.id)}
                  onAddToCart={handleAddToCart}
                />
              ))}

              {/* Footer */}
              <div className="flex items-center justify-between px-6 py-5 bg-gray-50/80 border-t border-gray-100">
                <button onClick={handleShare}
                  className="flex items-center gap-2.5 text-[13.5px] font-bold text-gray-600
                             hover:text-[#7a6030] transition-colors duration-200 group">
                  <div className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center
                                  group-hover:border-[#b8964e] group-hover:bg-[#fdf8f2] transition-all duration-200">
                    <Share2 size={14} className="text-gray-500 group-hover:text-[#b8964e] transition-colors" />
                  </div>
                  Share this wishlist
                </button>

                <button onClick={() => router.push("/cart")}
                  className="relative overflow-hidden flex items-center gap-2.5
                             bg-[#7a6030] hover:bg-[#5e4a25] text-white
                             text-[13px] font-bold tracking-[0.12em] uppercase
                             px-10 py-3.5 rounded-xl
                             shadow-[0_3px_16px_rgba(122,96,48,0.30)]
                             hover:-translate-y-0.5 transition-all duration-250 group/vc">
                  <span className="absolute inset-0 -translate-x-full group-hover/vc:translate-x-full
                                   transition-transform duration-700
                                   bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />
                  <ShoppingCart size={16} />
                  View Cart
                  {cartAdded.length > 0 && (
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white
                                     text-[#7a6030] text-[11px] font-bold ml-0.5">
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