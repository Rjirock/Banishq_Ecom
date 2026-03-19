"use client";

import { useState } from "react";
import { Heart, Star, ShoppingCart } from "lucide-react";

export default function ProductCardListing({ product }) {
  const [liked, setLiked] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    setAdded(true);
    setTimeout(() => setAdded(false), 1000);
  };

  return (
    <div className="
      bg-white 
      border border-gray-200 
      rounded-md 
      p-3 
      transition-all duration-300 
      hover:shadow-md
    ">

      {/* IMAGE */}
      <div className="relative rounded-md overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-[190px] object-cover transition duration-500 hover:scale-105"
        />

        <button
          onClick={() => setLiked(!liked)}
          className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow"
        >
          <Heart
            size={16}
            className={`transition ${
              liked ? "fill-red-500 text-red-500" : "text-black"
            }`}
          />
        </button>
      </div>

      {/* CONTENT */}
      <div className="mt-3">

        <h3 className="text-[14px] font-medium text-black line-clamp-2">
          {product.name}
        </h3>

        <p className="text-[15px] font-semibold text-[#9C7A3C] mt-1">
          From {product.price}
        </p>

        <div className="flex items-center gap-1 mt-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={12} fill="#F4B400" strokeWidth={0} />
          ))}
          <span className="text-[11px] text-black/60 ml-1">
            {product.rating} ({product.reviews})
          </span>
        </div>

        {/* BUTTON */}
        <button
          onClick={handleAddToCart}
          className={`mt-3 w-full text-[13px] py-2 rounded-full
                      flex items-center justify-center gap-2
                      transition-all duration-300
                      ${
                        added
                          ? "bg-[#E8D2B5] text-black"
                          : "bg-black text-white hover:bg-black/80"
                      }`}
        >
          <ShoppingCart size={14} />
          {added ? "Added" : "Add to Cart"}
        </button>

      </div>
    </div>
  );
}