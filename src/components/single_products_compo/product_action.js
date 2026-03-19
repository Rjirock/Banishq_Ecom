"use client";

import { useState } from "react";
import { Heart, ShoppingCart, Zap, Check, Truck, Shield, RotateCcw } from "lucide-react";


export default function ProductActions({ product }) {
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [cartAdded, setCartAdded] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleDecrease = () => {
    if (quantity > 1) setQuantity((q) => q - 1);
  };

  const handleIncrease = () => {
    if (quantity < 99) setQuantity((q) => q + 1);
  };

  const handleAddToCart = () => {
    setCartAdded(true);
    showToast(`${quantity} × ${product.name} added to cart!`);
    setTimeout(() => setCartAdded(false), 2000);
  };

  const handleBuyNow = () => {
    showToast("Redirecting to checkout...", "info");
    // Add your routing logic here: router.push("/checkout")
  };

  const handleWishlist = () => {
    setIsWishlisted((prev) => !prev);
    showToast(
      isWishlisted ? "Removed from wishlist" : "Added to wishlist ❤️",
      isWishlisted ? "neutral" : "success"
    );
  };

  return (
    <>
      {/* ── Toast Notification ── */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-xl text-sm font-medium transition-all duration-300
            ${toast.type === "success" ? "bg-[#2d2d2d] text-white" : ""}
            ${toast.type === "info" ? "bg-[#d4a373] text-black" : ""}
            ${toast.type === "neutral" ? "bg-white border border-gray-200 text-gray-700" : ""}
          `}
        >
          <Check size={16} className="shrink-0" />
          {toast.message}
        </div>
      )}

      {/* ── Quantity + Buttons ── */}
      <div className="flex flex-wrap items-center gap-3 mt-8">

        {/* Quantity Selector */}
        <div className="flex items-center border border-gray-300 rounded-full overflow-hidden bg-white shadow-sm">
          <button
            onClick={handleDecrease}
            disabled={quantity === 1}
            className="w-10 h-10 flex items-center justify-center text-lg font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
          >
            −
          </button>
          <span className="w-10 text-center text-sm font-semibold tabular-nums">
            {quantity}
          </span>
          <button
            onClick={handleIncrease}
            disabled={quantity === 99}
            className="w-10 h-10 flex items-center justify-center text-lg font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
          >
            +
          </button>
        </div>

        {/* Add to Cart */}
        <button
          onClick={handleAddToCart}
          className={`flex items-center gap-2 px-7 py-3 rounded-full font-medium text-sm transition-all duration-200 shadow-sm
            ${cartAdded
              ? "bg-green-500 text-white scale-95"
              : "bg-[#d4a373] hover:bg-[#c8936a] text-black hover:scale-[1.02] active:scale-95"
            }`}
        >
          {cartAdded ? (
            <>
              <Check size={16} />
              Added!
            </>
          ) : (
            <>
              <ShoppingCart size={16} />
              Add to Cart
            </>
          )}
        </button>

        {/* Buy Now */}
        <button
          onClick={handleBuyNow}
          className="flex items-center gap-2 bg-black text-white px-7 py-3 rounded-full font-medium text-sm hover:bg-gray-800 hover:scale-[1.02] active:scale-95 transition-all duration-200 shadow-sm"
        >
          <Zap size={15} />
          Buy Now
        </button>

        {/* Wishlist */}
        <button
          onClick={handleWishlist}
          title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className={`w-11 h-11 flex items-center justify-center rounded-full border transition-all duration-200 shadow-sm
            ${isWishlisted
              ? "bg-red-50 border-red-300 text-red-500 scale-110"
              : "bg-white border-gray-300 text-gray-400 hover:border-red-300 hover:text-red-400 hover:scale-105"
            }`}
        >
          <Heart
            size={18}
            className={isWishlisted ? "fill-red-500 stroke-red-500" : ""}
          />
        </button>
      </div>

      {/* ── Trust Badges ── */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">

        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm">
          <Truck size={16} className="text-[#d4a373] shrink-0" />
          <div>
            <p className="text-[11px] font-semibold text-gray-700">Free Delivery</p>
            <p className="text-[11px] text-gray-400">3–5 business days</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm">
          <Shield size={16} className="text-[#d4a373] shrink-0" />
          <div>
            <p className="text-[11px] font-semibold text-gray-700">Secure Payment</p>
            <p className="text-[11px] text-gray-400">100% protected</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm">
          <RotateCcw size={16} className="text-[#d4a373] shrink-0" />
          <div>
            <p className="text-[11px] font-semibold text-gray-700">Easy Returns</p>
            <p className="text-[11px] text-gray-400">7-day return policy</p>
          </div>
        </div>

      </div>
    </>
  );
}