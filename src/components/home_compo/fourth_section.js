"use client";

import Link from "next/link";

export default function ShopByCategory() {
  const categories = [
    {
      name: "Women's Collection",
      image: "/women.jpg",
      slug: "women",
    },
    {
      name: "Jewellery Collection",
      image: "/jewellery.jpg",
      slug: "jewellery-collection",
    },
    {
      name: "Cosmetic Collection",
      image: "/cosmetic.jpg",
      slug: "cosmetic-collection",
    },
  ];

  return (
    <section className="w-full bg-[#EDEBE8] py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">

      {/* TITLE */}
      <h2 className="text-center text-[28px] sm:text-[34px] md:text-[38px] lg:text-[42px] font-serif font-medium text-black mb-10 sm:mb-12 md:mb-14 lg:mb-16">
        Shop by Category
      </h2>

      {/* CATEGORIES */}
      <div className="max-w-[1200px] mx-auto flex flex-col sm:flex-row justify-center items-center gap-10 sm:gap-6 md:gap-10 lg:gap-16 text-center">

        {categories.map((cat, index) => (
          <Link
            key={index}
            href={`/category/${cat.slug}`}
            className="group block w-full sm:w-auto flex-1 sm:max-w-[200px] md:max-w-[220px] lg:max-w-[260px]"
          >
            {/* CIRCLE IMAGE */}
            <div
              className="relative mx-auto rounded-full border-[5px] sm:border-[6px] border-[#C6A75E]
                         overflow-hidden transition-all duration-300
                         group-hover:scale-105 group-hover:shadow-xl
                         w-[160px] h-[160px]
                         sm:w-[170px] sm:h-[170px]
                         md:w-[195px] md:h-[195px]
                         lg:w-[220px] lg:h-[220px]"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover
                           transition-transform duration-500
                           group-hover:scale-110"
              />
            </div>

            {/* CATEGORY NAME */}
            <h3
              className="mt-4 sm:mt-5 lg:mt-6
                         text-[18px] sm:text-[19px] md:text-[22px] lg:text-[25px]
                         font-semibold text-black
                         transition duration-300
                         group-hover:text-[#C6A75E]"
            >
              {cat.name}
            </h3>
          </Link>
        ))}

      </div>
    </section>
  );
}