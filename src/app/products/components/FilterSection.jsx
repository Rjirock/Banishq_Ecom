// components/products/FilterSection.jsx
"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useFilters } from "@/context/FilterContext";

export default function FilterSection({ title, options, filterKey }) {
  const [open, setOpen] = useState(true);
  const { filters, toggleFilter } = useFilters();

  const activeList = filters[filterKey] || [];

  return (
    <div className="mb-5 border-b border-gray-100 pb-5 last:border-b-0 last:pb-0">

      {/* Header */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between mb-3 group"
      >
        <span className="text-[13px] font-bold tracking-widest uppercase text-gray-700">
          {title}
          {activeList.length > 0 && (
            <span className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full
                             bg-[#c9a84c] text-white text-[9px] font-bold">
              {activeList.length}
            </span>
          )}
        </span>
        <ChevronDown
          size={15}
          className={`text-gray-400 transition-transform duration-250 group-hover:text-gray-700
            ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Options */}
      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ maxHeight: open ? `${options.length * 36}px` : "0px" }}
      >
        <div className="space-y-1 pt-0.5">
          {options.map((option) => {
            const checked = activeList.includes(option);
            return (
              <label
                key={option}
                className={`flex items-center gap-3 px-2 py-1.5 rounded-lg cursor-pointer
                            transition-all duration-150 group/opt select-none
                            ${checked ? "bg-[#fdf8f2]" : "hover:bg-gray-50"}`}
              >
                {/* Custom checkbox */}
                <div
                  onClick={() => toggleFilter(filterKey, option)}
                  className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0
                              transition-all duration-150
                              ${checked
                                ? "bg-[#c9a84c] border-[#c9a84c]"
                                : "border-gray-300 group-hover/opt:border-[#c9a84c]"}`}
                >
                  {checked && (
                    <svg viewBox="0 0 10 8" className="w-2.5 h-2" fill="none">
                      <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.8"
                            strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>

                <span
                  onClick={() => toggleFilter(filterKey, option)}
                  className={`text-[13px] transition-colors duration-150 flex-1
                    ${checked ? "text-[#7a6030] font-semibold" : "text-gray-600 group-hover/opt:text-gray-900"}`}
                >
                  {option}
                </span>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
}