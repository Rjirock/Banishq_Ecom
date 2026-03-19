// context/CartContext.jsx
"use client";

import { createContext, useContext, useState, useCallback } from "react";

const CartContext = createContext(null);

const DEFAULT_CART = [
  {
    id: 1,
    name: "Gold Plated Crystal Wing Earrings",
    brand: "Banishq Jewels",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=200&q=80",
    originalPrice: 1999,
    price: 899,
    discount: 20,
    qty: 1,
  },
  {
    id: 2,
    name: "Aglaonema (Chinese Evergreen) Indoor Plant",
    brand: "Green Roots",
    image: "https://images.unsplash.com/photo-1545241047-6083a3684587?w=200&q=80",
    originalPrice: 1499,
    price: 699,
    discount: 15,
    qty: 1,
  },
];

export function CartProvider({ children }) {
  const [cart,      setCart]      = useState(DEFAULT_CART);

  // ── TOAST STATE ──────────────────────────────────────
  // toastItem holds { name, image, price } of the last added product.
  // CartToast.jsx reads this to know what to show.
  const [toastItem, setToastItem] = useState(null);

  // Auto-dismiss the toast after 3.5 s
  const showToast = useCallback((item) => {
    setToastItem(item);
    setTimeout(() => setToastItem(null), 3500);
  }, []);

  // Called when user clicks the ✕ on the toast
  const dismissToast = () => setToastItem(null);
  // ─────────────────────────────────────────────────────

  const updateQty = (id, delta) =>
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item
      )
    );

  const removeItem = (id) =>
    setCart((prev) => prev.filter((item) => item.id !== id));

  // ── addItem now also fires the toast ─────────────────
  const addItem = (product) => {
    setCart((prev) => {
      const exists = prev.find((x) => x.id === product.id);
      if (exists)
        return prev.map((x) =>
          x.id === product.id ? { ...x, qty: x.qty + 1 } : x
        );
      return [...prev, { ...product, qty: 1 }];
    });

    // Show popup with the product that was just added
    showToast({
      name:  product.name,
      image: product.image,
      price: product.price,
    });
  };
  // ─────────────────────────────────────────────────────

  const clearCart = () => setCart([]);

  const totalItems = cart.reduce((s, x) => s + x.qty, 0);
  const totalPrice = cart.reduce((s, x) => s + x.price * x.qty, 0);
  const totalMrp   = cart.reduce((s, x) => s + x.originalPrice * x.qty, 0);

  return (
    <CartContext.Provider
      value={{
        cart, setCart,
        updateQty, removeItem, addItem, clearCart,
        totalItems, totalPrice, totalMrp,
        // expose toast state so CartToast.jsx can read it
        toastItem, dismissToast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}