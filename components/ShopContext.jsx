"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import products from "../data/products.json";
import { TG_URL } from "../lib/site";

const ShopContext = createContext(null);
const LS_KEY = "sp-cart-v1";

export function ShopProvider({ children }) {
  const [items, setItems] = useState({});
  const [cartOpen, setCartOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") setItems(parsed);
      }
    } catch {
      /* демо: молча игнорируем */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(items));
    } catch {
      /* демо: молча игнорируем */
    }
  }, [items, ready]);

  const add = useCallback((id, qty = 1) => {
    setItems((prev) => {
      const current = prev[id] || 0;
      return { ...prev, [id]: Math.min(99, current + qty) };
    });
  }, []);

  const setQty = useCallback((id, qty) => {
    setItems((prev) => {
      if (qty <= 0) {
        const next = { ...prev };
        delete next[id];
        return next;
      }
      return { ...prev, [id]: Math.min(99, qty) };
    });
  }, []);

  const clear = useCallback(() => setItems({}), []);

  const { count, total, checkoutUrl } = useMemo(() => {
    let countValue = 0;
    let totalValue = 0;
    const lines = [];
    for (const id of Object.keys(items)) {
      const product = products.find((p) => p.id === id);
      const qty = items[id];
      if (!product || qty <= 0) continue;
      countValue += qty;
      totalValue += product.price * qty;
      lines.push(`— ${product.name} × ${qty} (${product.price} ₽)`);
    }
    const text =
      "Здравствуйте! Хочу оформить заказ со «Спутник Фито»:\n" +
      lines.join("\n") +
      `\nИтого: ${totalValue} ₽`;
    return {
      count: countValue,
      total: totalValue,
      checkoutUrl: `${TG_URL}?text=${encodeURIComponent(text)}`,
    };
  }, [items]);

  const value = useMemo(
    () => ({ items, add, setQty, clear, count, total, cartOpen, setCartOpen, checkoutUrl }),
    [items, add, setQty, clear, count, total, cartOpen, checkoutUrl]
  );

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error("useShop должен использоваться внутри ShopProvider");
  return ctx;
}