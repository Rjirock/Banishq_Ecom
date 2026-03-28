"use client";

import { useState } from "react";
import { Heart, Star, ShoppingCart } from "lucide-react";

export default function FeaturedProducts() {
    const products = Array.from({ length: 4 }, (_, i) => ({
        id: i + 1,
        name: "Diamond Stud Earrings",
        price: "₹8,999",
        image: "/product.jpg",
        rating: 4.8,
        reviews: 245,
    }));

    return (
        <section className="w-full bg-[#EDEBE8] py-10 sm:py-14 md:py-20">
            <div className="max-w-[1300px] mx-auto px-4 sm:px-6">

                <h2 className="text-[22px] sm:text-[26px] md:text-[32px] font-serif text-black mb-6 sm:mb-10 md:mb-12">
                    Related Products
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6 md:gap-8 lg:gap-10">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>

            </div>
        </section>
    );
}

function ProductCard({ product }) {
    const [liked, setLiked] = useState(false);
    const [added, setAdded] = useState(false);

    const handleAddToCart = () => {
        setAdded(true);
        setTimeout(() => setAdded(false), 1000);
    };

    return (
        <div className="bg-white border border-black/10 shadow-sm rounded-md
                        p-3 sm:p-4 transition duration-300 hover:shadow-xl">

            {/* IMAGE */}
            <div className="relative rounded-md overflow-hidden">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-[160px] sm:h-[200px] md:h-[220px] lg:h-[240px]
                               object-cover transition duration-500 hover:scale-105"
                />

                {/* ❤️ WISHLIST */}
                <button
                    onClick={() => setLiked(!liked)}
                    className="absolute top-2 right-2 sm:top-3 sm:right-3
                               bg-white/90 rounded-full p-1.5 sm:p-2 shadow"
                >
                    <Heart
                        size={18}
                        className={`transition duration-300 ${
                            liked
                                ? "fill-red-500 text-red-500 scale-110"
                                : "text-black"
                        }`}
                    />
                </button>
            </div>

            {/* CONTENT */}
            <div className="mt-3 sm:mt-4">

                <h3 className="text-[14px] sm:text-[15px] md:text-[16px] font-medium text-black">
                    {product.name}
                </h3>

                <p className="text-[16px] sm:text-[17px] md:text-[18px] font-semibold text-[#9C7A3C] mt-1">
                    From {product.price}
                </p>

                {/* ⭐ RATING */}
                <div className="flex items-center gap-1 sm:gap-2 mt-2">
                    <div className="flex text-[#F4B400]">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                                fill="#F4B400"
                                strokeWidth={0}
                            />
                        ))}
                    </div>

                    <span className="text-[11px] sm:text-[12px] md:text-[13px] text-black/60">
                        {product.rating} ({product.reviews})
                    </span>
                </div>

                {/* 🛒 BUTTON */}
                <button
                    onClick={handleAddToCart}
                    className={`mt-3 sm:mt-4 flex items-center justify-center gap-2
                    text-[12px] sm:text-[13px] md:text-[14px]
                    px-4 sm:px-5 py-2 rounded-full w-full
                    transition-all duration-300 ease-in-out
                    ${
                        added
                            ? "bg-[#E8D2B5] text-black scale-105 shadow-md"
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
