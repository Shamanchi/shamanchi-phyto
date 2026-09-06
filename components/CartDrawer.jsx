"use client";

import { useEffect } from "react";
import products from "../data/products.json";
import { asset, formatPrice, TG_HANDLE } from "../lib/site";
import { useShop } from "./ShopContext";

export default function CartDrawer() {
  const { items, setQty, clear, count, total, cartOpen, setCartOpen, checkoutUrl } = useShop();

  useEffect(() => {
    if (!cartOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") setCartOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [cartOpen, setCartOpen]);

  const rows = products
    .filter((p) => items[p.id] > 0)
    .map((p) => ({ product: p, qty: items[p.id] }));

  return (
    <div
      className={`fixed inset-0 z-[90] transition-opacity duration-300 ${cartOpen ? "opacity-100" : "invisible opacity-0"}`}
      aria-hidden={!cartOpen}
      inert={!cartOpen}
    >
      {/* подложка */}
      <button
        type="button"
        aria-label="Закрыть корзину"
        onClick={() => setCartOpen(false)}
        className="absolute inset-0 h-full w-full cursor-default bg-ink/45 backdrop-blur-[2px]"
        tabIndex={-1}
      />
      {/* панель */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Корзина"
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-paper shadow-2xl transition-transform duration-300 ${
          cartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="font-display text-2xl font-semibold">
            Корзина {count > 0 && <span className="text-base font-bold text-khaki">· {count}</span>}
          </h2>
          <button
            type="button"
            onClick={() => setCartOpen(false)}
            aria-label="Закрыть"
            className="grid h-10 w-10 place-items-center rounded-full border border-line bg-cream text-ink transition hover:border-leaf"
          >
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M5 5l10 10M15 5 5 15" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {rows.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <span className="grid h-16 w-16 place-items-center rounded-full bg-sageSoft text-leaf">
                <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                  <path d="M6 7h12l1.2 12.2a1.8 1.8 0 0 1-1.8 1.8H6.6a1.8 1.8 0 0 1-1.8-1.8L6 7Z" />
                  <path d="M9 10V6a3 3 0 0 1 6 0v4" />
                </svg>
              </span>
              <div>
                <p className="font-display text-xl font-semibold">Пока пусто</p>
                <p className="mt-1 text-sm text-ink/60">Загляните в витрину — там сборы под вашу задачу.</p>
              </div>
              <a
                href="#vitrina"
                onClick={() => setCartOpen(false)}
                className="rounded-full bg-leaf px-6 py-2.5 text-[15px] font-bold text-paper transition hover:bg-leafDark"
              >
                Перейти к витрине
              </a>
            </div>
          ) : (
            <ul className="space-y-4">
              {rows.map(({ product, qty }) => (
                <li key={product.id} className="flex gap-3 rounded-2xl border border-line bg-cream p-3">
                  <img
                    src={asset(product.img)}
                    alt={product.name}
                    width={80}
                    height={80}
                    className="h-20 w-20 shrink-0 rounded-xl object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-[17px] font-semibold leading-tight">{product.name}</p>
                    <p className="mt-0.5 text-[12px] text-khaki">{formatPrice(product.price)} / курс</p>
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <div className="flex items-center rounded-full border border-line bg-paper">
                        <button
                          type="button"
                          onClick={() => setQty(product.id, qty - 1)}
                          aria-label={`Убрать один ${product.name}`}
                          className="grid h-8 w-8 place-items-center rounded-full text-ink/70 transition hover:text-leaf"
                        >
                          −
                        </button>
                        <span className="w-8 text-center text-sm font-extrabold">{qty}</span>
                        <button
                          type="button"
                          onClick={() => setQty(product.id, qty + 1)}
                          aria-label={`Добавить один ${product.name}`}
                          className="grid h-8 w-8 place-items-center rounded-full text-ink/70 transition hover:text-leaf"
                        >
                          +
                        </button>
                      </div>
                      <p className="text-[15px] font-extrabold text-honeyDark">{formatPrice(product.price * qty)}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {rows.length > 0 && (
          <div className="border-t border-line bg-cream px-5 py-4">
            <div className="flex items-center justify-between text-[15px] font-semibold">
              <span>Итого за курс(ы)</span>
              <span className="text-xl font-extrabold text-ink">{formatPrice(total)}</span>
            </div>
            <p className="mt-1 text-[12px] leading-snug text-ink/55">
              Демо-корзина: оплата не проводится. Заказ уходит готовым сообщением в телеграм {TG_HANDLE}.
            </p>
            <div className="mt-3 flex gap-2">
              <a
                href={checkoutUrl}
                target="_blank"
                rel="noreferrer"
                className="flex-1 rounded-full bg-leaf px-5 py-3 text-center text-[16px] font-bold text-paper transition hover:bg-leafDark"
              >
                Оформить в телеграме
              </a>
              <button
                type="button"
                onClick={clear}
                className="rounded-full border border-line bg-paper px-4 py-3 text-sm font-bold text-ink/60 transition hover:border-honey hover:text-honeyDark"
              >
                Очистить
              </button>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}