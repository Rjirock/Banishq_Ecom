// context/WishlistContext.jsx
"use client";

import { createContext, useContext, useState } from "react";

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);

  const addToWishlist = (product) => {
    setWishlist((prev) => {
      if (prev.find((x) => x.id === product.id)) return prev;
      return [...prev, { inStock: true, ...product }];
    });
  };

  const removeFromWishlist = (id) => {
    setWishlist((prev) => prev.filter((x) => x.id !== id));
  };

  const toggleWishlist = (product) => {
    setWishlist((prev) => {
      const exists = prev.find((x) => x.id === product.id);
      if (exists) return prev.filter((x) => x.id !== product.id);
      return [...prev, { inStock: true, ...product }];
    });
  };

  const isWishlisted = (id) => wishlist.some((x) => x.id === id);
  const totalWishlist = wishlist.length;

  return (
    <WishlistContext.Provider value={{
      wishlist, addToWishlist, removeFromWishlist,
      toggleWishlist, isWishlisted, totalWishlist,
    }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used inside <WishlistProvider>");
  return ctx;
}