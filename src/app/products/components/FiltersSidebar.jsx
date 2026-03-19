// components/products/FiltersSidebar.jsx
"use client";

import FilterSection from "./FilterSection";
import { useFilters } from "@/context/FilterContext";
import { SlidersHorizontal, X } from "lucide-react";

export default function FiltersSidebar() {
  const { activeCount, clearAll } = useFilters();

  return (
    <aside className="sticky top-24 self-start bg-white p-5 rounded-xl
                       shadow-sm border border-gray-200 min-w-[220px]">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={16} className="text-[#c9a84c]" />
          <h2 className="text-[18px] font-bold text-gray-900">Filter</h2>
          {activeCount > 0 && (
            <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full
                             bg-[#c9a84c] text-white text-[10px] font-bold min-w-[20px]">
              {activeCount}
            </span>
          )}
        </div>

        {/* Clear all */}
        {activeCount > 0 && (
          <button
            onClick={clearAll}
            className="flex items-center gap-1 text-[11.5px] font-semibold text-red-400
                       hover:text-red-600 transition-colors duration-150"
          >
            <X size={12} /> Clear all
          </button>
        )}
      </div>

      {/* Filter sections — each gets a filterKey that matches FilterContext state keys */}
      <FilterSection
        title="Price"
        filterKey="price"
        options={[
          "Under ₹999",
          "₹1,000 – ₹2,999",
          "₹3,000 – ₹5,999",
          "₹6,000 – ₹9,999",
          "₹10,000 & Above",
        ]}
      />

      <FilterSection
        title="Categories"
        filterKey="categories"
        options={[
          "Necklaces",
          "Earrings",
          "Rings",
          "Bracelets & Bangles",
          "Anklets",
          "Bridal Jewellery",
        ]}
      />

      <FilterSection
        title="Material"
        filterKey="material"
        options={[
          "Gold",
          "Silver",
          "Rose Gold",
          "Diamond",
          "Kundan",
        ]}
      />

      <FilterSection
        title="Occasion"
        filterKey="occasion"
        options={[
          "Wedding",
          "Party Wear",
          "Festive",
          "Daily Wear",
          "Office Wear",
        ]}
      />

      <FilterSection
        title="Rating"
        filterKey="rating"
        options={[
          "2.0 and above",
          "3.0 and above",
          "3.5 and above",
          "4.0 and above",
        ]}
      />
    </aside>
  );
}