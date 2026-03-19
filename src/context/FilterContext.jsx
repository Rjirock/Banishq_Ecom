// context/FilterContext.jsx
"use client";

import { createContext, useContext, useState, useCallback } from "react";

const FilterContext = createContext(null);

export function FilterProvider({ children }) {
  const [filters, setFilters] = useState({
    price:      [],
    categories: [],
    material:   [],
    occasion:   [],
    rating:     [],
  });

  const [sortBy, setSortBy] = useState("default");

  // Toggle a single filter value on/off
  const toggleFilter = useCallback((group, value) => {
    setFilters((prev) => {
      const current = prev[group];
      const exists  = current.includes(value);
      return {
        ...prev,
        [group]: exists ? current.filter((v) => v !== value) : [...current, value],
      };
    });
  }, []);

  // Count total active filters
  const activeCount = Object.values(filters).flat().length;

  // Clear all filters
  const clearAll = useCallback(() => {
    setFilters({ price: [], categories: [], material: [], occasion: [], rating: [] });
    setSortBy("default");
  }, []);

  return (
    <FilterContext.Provider value={{ filters, toggleFilter, clearAll, activeCount, sortBy, setSortBy }}>
      {children}
    </FilterContext.Provider>
  );
}

export function useFilters() {
  const ctx = useContext(FilterContext);
  if (!ctx) throw new Error("useFilters must be used inside <FilterProvider>");
  return ctx;
}