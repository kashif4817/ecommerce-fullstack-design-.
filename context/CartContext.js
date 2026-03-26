"use client";

/* ─────────────────────────────────────────────────────────────
   CartContext.jsx
   Global cart state — wrap your root layout with <CartProvider>

   Usage anywhere:
     const { items, addItem, removeItem, updateQty, clearCart, totalCount } = useCart();
───────────────────────────────────────────────────────────── */

import { createContext, useContext, useEffect, useState, useCallback } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [hydrated, setHydrated] = useState(false);

  /* ── hydrate from localStorage on mount ── */
  useEffect(() => {
    try {
      const stored = localStorage.getItem("cart");
      if (stored) setItems(JSON.parse(stored));
    } catch (_) {}
    setHydrated(true);
  }, []);

  /* ── persist to localStorage on every change ── */
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem("cart", JSON.stringify(items));
    } catch (_) {}
  }, [items, hydrated]);

  /* ── addItem ─────────────────────────────────────────────
     Accepts a product object + optional qty (default 1).
     If product already in cart, increments qty.
  ── */
  const addItem = useCallback((product, qty = 1) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) {
        return prev.map(i =>
          i.id === product.id ? { ...i, qty: i.qty + qty } : i
        );
      }
      return [
        ...prev,
        {
          id:         product.id,
          name:       product.name,
          base_price: product.base_price,
          image_url:  product.image_url  || null,
          images:     product.images     || [],
          slug:       product.slug       || "",
          qty,
        },
      ];
    });
  }, []);

  /* ── removeItem ── */
  const removeItem = useCallback((productId) => {
    setItems(prev => prev.filter(i => i.id !== productId));
  }, []);

  /* ── updateQty — removes item if qty reaches 0 ── */
  const updateQty = useCallback((productId, newQty) => {
    if (newQty < 1) {
      setItems(prev => prev.filter(i => i.id !== productId));
      return;
    }
    setItems(prev =>
      prev.map(i => i.id === productId ? { ...i, qty: newQty } : i)
    );
  }, []);

  /* ── clearCart ── */
  const clearCart = useCallback(() => setItems([]), []);

  /* ── saveForLater: remove from cart (saved state managed by consumer) ── */
  const removeFromCart = removeItem;

  /* ── derived values ── */
  const totalCount   = items.reduce((sum, i) => sum + i.qty, 0);
  const subtotal     = items.reduce((sum, i) => sum + Number(i.base_price) * i.qty, 0);
  const isInCart     = (productId) => items.some(i => i.id === productId);

  return (
    <CartContext.Provider value={{
      items,
      hydrated,
      addItem,
      removeItem,
      removeFromCart,
      updateQty,
      clearCart,
      totalCount,
      subtotal,
      isInCart,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}