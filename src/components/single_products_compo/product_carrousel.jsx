"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ProductImageGallery({ images = [] }) {
  const [current, setCurrent] = useState(0);

  // Safety check
  if (!images.length) {
    return <div className="h-[500px] bg-gray-100 rounded-lg" />;
  }

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrent((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="w-full max-w-[500px]">

      {/* MAIN IMAGE */}
      <div className="relative bg-[#f7f3ee] rounded-lg overflow-hidden">

        <img
          src={images[current]}
          alt="product"
          className="w-full h-[500px] object-cover transition-all duration-300"
        />

        {/* LEFT BUTTON */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white shadow-md rounded-md p-3 hover:bg-gray-100 transition"
            >
              <ChevronLeft size={20} />
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white shadow-md rounded-md p-3 hover:bg-gray-100 transition"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>

      {/* THUMBNAILS */}
      {images.length > 1 && (
        <div className="flex gap-4 mt-6">
          {images.map((img, index) => (
            <div
              key={index}
              onClick={() => setCurrent(index)}
              className={`cursor-pointer rounded-md overflow-hidden border-2 transition-all ${
                current === index
                  ? "border-[#d4a373]"
                  : "border-transparent"
              }`}
            >
              <img
                src={img}
                alt="thumb"
                className="w-24 h-24 object-cover hover:opacity-80"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}