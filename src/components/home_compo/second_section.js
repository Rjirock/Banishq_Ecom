"use client";

import Link from "next/link";

export default function PromoBanners() {
  return (
    <section className="w-full bg-[#F5F5F5] py-10 sm:py-12 lg:py-16">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 lg:gap-8">

          {/* LEFT BANNER */}
          <div className="relative h-[220px] sm:h-[260px] lg:h-[320px] rounded-xl overflow-hidden">

            {/* Background Image */}
            <img
              src="/left-banner.jpg"
              alt="Left Banner"
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/20" />

            {/* Button */}
            <div className="relative z-20 flex items-center justify-center h-full">
              <Link
                href="/shop"
                className="px-6 sm:px-7 lg:px-8 py-2.5 sm:py-3
                           bg-[#C6A75E] text-black text-sm sm:text-base
                           rounded-md font-medium
                           hover:scale-105 transition duration-300 shadow-md"
              >
                Shop The Collection
              </Link>
            </div>
          </div>

          {/* RIGHT BANNER */}
          <div className="relative h-[220px] sm:h-[260px] lg:h-[320px] rounded-xl overflow-hidden">

            {/* Background Image */}
            <img
              src="/right-banner.jpg"
              alt="Right Banner"
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Button */}
            <div className="relative z-20 flex items-center justify-center h-full">
              <Link
                href="/shop"
                className="px-6 sm:px-7 lg:px-8 py-2.5 sm:py-3
                           bg-black text-white text-sm sm:text-base
                           rounded-md font-medium
                           hover:scale-105 transition duration-300 shadow-md"
              >
                Shop The Collection
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}