"use client";

import { useState } from "react";
import Link from "next/link";
import { useShop } from "../ShopContext";
import { asset, formatPrice, SHOP } from "../../lib/site";

export default function CartView() {
  const { lines, setQty, remove, clear, count, subtotal, discount, total, promoCode, applyPromo } = useShop();
  const [promoInput, setPromoInput] = useState(promoCode || "");
  const [promoMsg, setPromoMsg] = useState("");

  const handleApply = () => {
    const ok = applyPromo(promoInput);
    setPromoMsg(ok ? "Промокод применён ✓" : "Промокод не найден. Попробуйте СПУТНИК10 или ФИТО15.");
  };

  if (lines.length === 0) {
    return (
      <div className="pt-16 sm:pt-[72px]">
        <div className="wrap py-16 text-center sm:py-24">
          <span className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-sageSoft text-leaf">
            <svg viewBox="0 0 24 24" className="h-9 w-9" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              <path d="M6 7h12l1.2 12.2a1.8 1.8 0 0 1-1.8 1.8H6.6a1.8 1.8 0 0 1-1.8-1.8L6 7Z" />
              <path d="M9 10V6a3 3 0 0 1 6 0v4" />
            </svg>
          </span>
          <h1 className="mt-6 font-display text-4xl font-semibold">Корзина пока пуста</h1>
          <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-ink/60">
            Добавьте товары из каталога — корзина умеет считать количество, промокод и итог
            так же, как в настоящем магазине.
          </p>
          <Link
            href="/catalog/"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-honey px-7 py-3.5 text-lg font-bold text-ink shadow-card transition hover:-translate-y-0.5 hover:bg-[#BB7B1E]"
          >
            Открыть каталог
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 sm:pt-[72px]">
      <div className="wrap py-8 sm:py-10">
        <nav aria-label="Хлебные крошки" className="font-mono text-[11px] uppercase tracking-wider text-khaki">
          <Link href="/" className="transition hover:text-leaf">Главная</Link>
          <span aria-hidden="true"> / </span>
          <Link href="/catalog/" className="transition hover:text-leaf">Каталог</Link>
          <span aria-hidden="true"> / Корзина</span>
        </nav>

        <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
          <h1 className="font-display text-4xl font-semibold sm:text-5xl">
            Корзина <span className="text-leaf">({count})</span>
          </h1>
          <button
            type="button"
            onClick={clear}
            className="rounded-full border border-line bg-cream px-4 py-2 text-[13px] font-bold text-ink/60 transition hover:border-honey hover:text-honeyDark"
          >
            Очистить корзину
          </button>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
          {/* Строки */}
          <ul className="space-y-4">
            {lines.map(({ product, qty }) => (
              <li key={product.id} className="flex flex-wrap gap-4 rounded-3xl border border-line bg-cream p-4 sm:flex-nowrap">
                <Link href={`/product/${product.id}/`} className="shrink-0">
                  <img
                    src={asset(product.img)}
                    alt={product.name}
                    width={120}
                    height={120}
                    className="h-28 w-28 rounded-2xl object-cover"
                  />
                </Link>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="font-display text-[20px] font-semibold leading-tight">
                        <Link href={`/product/${product.id}/`} className="transition hover:text-leaf">
                          {product.name}
                        </Link>
                      </h2>
                      <p className="mt-1 text-[12px] text-khaki">{product.format}</p>
                    </div>
                    <p className="shrink-0 text-[17px] font-extrabold text-honeyDark">
                      {formatPrice(product.price * qty)}
                    </p>
                  </div>
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center rounded-full border border-line bg-paper">
                      <button
                        type="button"
                        onClick={() => setQty(product.id, qty - 1)}
                        aria-label={`Убрать один ${product.name}`}
                        className="grid h-10 w-10 place-items-center rounded-full text-ink/70 transition hover:text-leaf"
                      >
                        −
                      </button>
                      <span className="w-10 text-center font-extrabold">{qty}</span>
                      <button
                        type="button"
                        onClick={() => setQty(product.id, qty + 1)}
                        aria-label={`Добавить один ${product.name}`}
                        className="grid h-10 w-10 place-items-center rounded-full text-ink/70 transition hover:text-leaf"
                      >
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => remove(product.id)}
                      className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-ink/50 transition hover:text-honeyDark"
                    >
                      <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                        <path d="M3 4h10M6 4V2.5h4V4M4.5 4l.6 9h5.8l.6-9" />
                      </svg>
                      Удалить
                    </button>
                  </div>
                </div>
              </li>
            ))}
            <li>
              <Link
                href="/catalog/"
                className="inline-flex items-center gap-2 rounded-full border border-line bg-cream px-5 py-2.5 text-[14px] font-bold text-ink/70 transition hover:border-leaf hover:text-leaf"
              >
                ← Продолжить покупки
              </Link>
            </li>
          </ul>

          {/* Итог */}
          <aside className="h-fit rounded-3xl border border-line bg-cream p-6 lg:sticky lg:top-24">
            <h2 className="font-display text-2xl font-semibold">Итого</h2>
            <dl className="mt-5 space-y-2.5 text-[15px]">
              <div className="flex justify-between">
                <dt className="text-ink/60">Товары ({count})</dt>
                <dd className="font-bold">{formatPrice(subtotal)}</dd>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-leaf">
                  <dt>Скидка по промокоду</dt>
                  <dd className="font-bold">−{formatPrice(discount)}</dd>
                </div>
              )}
              <div className="flex justify-between border-t border-line pt-3 text-[16px]">
                <dt className="font-bold">К оплате</dt>
                <dd className="text-xl font-extrabold text-ink">{formatPrice(total)}</dd>
              </div>
            </dl>

            <div className="mt-5">
              <label htmlFor="promo-input" className="font-mono text-[10px] uppercase tracking-[0.14em] text-khaki">
                Промокод
              </label>
              <div className="mt-2 flex gap-2">
                <input
                  id="promo-input"
                  type="text"
                  value={promoInput}
                  onChange={(e) => {
                    setPromoInput(e.target.value);
                    setPromoMsg("");
                  }}
                  placeholder="СПУТНИК10"
                  className="field"
                  autoComplete="off"
                />
                <button
                  type="button"
                  onClick={handleApply}
                  className="shrink-0 rounded-full bg-leaf px-5 py-2.5 text-[14px] font-bold text-paper transition hover:bg-leafDark"
                >
                  Применить
                </button>
              </div>
              <p className="mt-2 min-h-4 text-[12.5px] font-semibold text-leaf">{promoMsg}</p>
              <p className="text-[12px] leading-relaxed text-ink/55">{SHOP.promoHint}</p>
            </div>

            <Link
              href="/checkout/"
              className="mt-5 block rounded-full bg-honey px-6 py-3.5 text-center text-[17px] font-extrabold text-ink shadow-card transition hover:-translate-y-0.5 hover:bg-[#BB7B1E]"
            >
              Перейти к оформлению
            </Link>
            <p className="mt-3 font-mono text-[10px] leading-relaxed text-ink/55">
              демо: заказ дойдёт до шага «демо-заказ принят», оплата не проводится.
            </p>
          </aside>
        </div>
      </div>
    </div>
  );
}