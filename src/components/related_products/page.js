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
        <section className="w-full bg-[#EDEBE8] py-20">
            <div className="max-w-[1300px] mx-auto px-5">

                <h2 className="text-[32px] font-serif text-black mb-12">
                    Related Products
                </h2>

               <div className="grid grid-cols-4 gap-10">
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

        // Reset animation after 1s
        setTimeout(() => {
            setAdded(false);
        }, 1000);
    };

    return (
        <div className="bg-white border border-black/10 shadow-md rounded-md
                    p-4 transition duration-300 hover:shadow-xl">

            {/* IMAGE */}
            <div className="relative rounded-md overflow-hidden">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-[240px] object-cover transition duration-500 hover:scale-105"
                />

                {/* ❤️ WISHLIST BUTTON */}
                <button
                    onClick={() => setLiked(!liked)}
                    className="absolute top-3 right-3 bg-white/90 rounded-full p-2 shadow transition"
                >
                    <Heart
                        size={20}
                        strokeWidth={1.5}
                        className={`transition duration-300 ${liked
                                ? "fill-red-500 text-red-500 scale-110"
                                : "text-black"
                            }`}
                    />
                </button>
            </div>

            {/* CONTENT */}
            <div className="mt-4">

                <h3 className="text-[16px] font-medium text-black">
                    {product.name}
                </h3>

                <p className="text-[18px] font-semibold text-[#9C7A3C] mt-1">
                    From {product.price}
                </p>

                <div className="flex items-center gap-2 mt-2">
                    <div className="flex text-[#F4B400]">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} size={16} fill="#F4B400" strokeWidth={0} />
                        ))}
                    </div>

                    <span className="text-[13px] text-black/60">
                        {product.rating} ({product.reviews} Review)
                    </span>
                </div>

                {/* 🛒 ADD TO CART BUTTON */}
                <button
                    onClick={handleAddToCart}
                    className={`mt-4 flex items-center justify-center gap-2
              text-[14px] px-5 py-2 rounded-full
              transition-all duration-300 ease-in-out
              ${added
                            ? "bg-[#E8D2B5] text-black scale-105 shadow-md"
                            : "bg-black text-white hover:bg-black/80"
                        }`}
                >
                    <ShoppingCart size={16} />
                    {added ? "Added to Cart" : "Add to Cart"}
                </button>

            </div>
        </div>
    );
}