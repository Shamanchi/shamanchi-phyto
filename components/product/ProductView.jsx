"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import ProductTile from "../catalog/ProductTile";
import { useShop } from "../ShopContext";
import { asset, formatPrice, SHOP, TASK_LABELS } from "../../lib/site";
import { formatLabel, similarProducts, taskLabel } from "../../lib/shop";

export default function ProductView({ product }) {
  const { add, count } = useShop();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const similar = useMemo(() => similarProducts(product, 3), [product]);

  const handleAdd = () => {
    add(product.id, qty);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  };

  const taskChips = product.tasks.map(taskLabel);

  return (
    <div className="pt-16 sm:pt-[72px]">
      <div className="wrap py-8 sm:py-12">
        <nav aria-label="Хлебные крошки" className="font-mono text-[11px] uppercase tracking-wider text-khaki">
          <Link href="/" className="transition hover:text-leaf">Главная</Link>
          <span aria-hidden="true"> / </span>
          <Link href="/catalog/" className="transition hover:text-leaf">Каталог</Link>
          <span aria-hidden="true"> / {product.name}</span>
        </nav>

        <div className="mt-6 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
          {/* Галерея (демо-арт) */}
          <div>
            <div className="relative overflow-hidden rounded-3xl border border-line bg-cream shadow-lift">
              <img
                src={asset(product.img)}
                alt={product.name}
                width={900}
                height={900}
                fetchPriority="high"
                className="aspect-square w-full object-cover"
              />
              {product.badge && (
                <span
                  className={`absolute left-4 top-4 rounded-full px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-paper ${
                    product.badge === "hit" ? "bg-honeyDark" : "bg-leaf"
                  }`}
                >
                  {product.badge === "hit" ? "Хит" : "Новинка"}
                </span>
              )}
              <span className="absolute bottom-4 right-4 rounded-full bg-paper/90 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-khaki backdrop-blur">
                фото упаковки · демо-арт
              </span>
            </div>
          </div>

          {/* Информация и покупка */}
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-khaki">
              {formatLabel(product.formatKey)} · курс 1 месяц
            </p>
            <h1 className="mt-2 font-display text-4xl font-semibold leading-tight sm:text-5xl">{product.name}</h1>
            <p className="mt-3 max-w-xl text-[16px] leading-relaxed text-ink/70">{product.tagline}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              {taskChips.map((task) => (
                <Link
                  key={task}
                  href="/catalog/"
                  className="rounded-full border border-sage/50 bg-sageSoft/40 px-3 py-1 text-[12px] font-bold text-leafDark transition hover:border-leaf hover:bg-sageSoft"
                >
                  {task}
                </Link>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-line bg-cream p-5">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <p>
                  <span className="block text-[13px] font-semibold text-khaki">Цена за курс</span>
                  <span className="mt-0.5 block text-4xl font-extrabold text-honeyDark">{formatPrice(product.price)}</span>
                </p>
                <p className="flex items-center gap-1.5 text-[13px] font-bold text-leaf">
                  <span className="h-2 w-2 rounded-full bg-leaf" aria-hidden="true" />
                  {SHOP.stockLabel} · отправим завтра
                </p>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <div className="flex items-center rounded-full border border-line bg-paper">
                  <button
                    type="button"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    aria-label="Уменьшить количество"
                    className="grid h-12 w-12 place-items-center rounded-full text-ink/70 transition hover:text-leaf"
                  >
                    −
                  </button>
                  <span className="w-10 text-center text-lg font-extrabold">{qty}</span>
                  <button
                    type="button"
                    onClick={() => setQty((q) => Math.min(99, q + 1))}
                    aria-label="Увеличить количество"
                    className="grid h-12 w-12 place-items-center rounded-full text-ink/70 transition hover:text-leaf"
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  onClick={handleAdd}
                  className={`inline-flex flex-1 items-center justify-center gap-2 rounded-full px-7 py-3.5 text-[16px] font-bold transition sm:flex-none ${
                    added ? "bg-leaf text-paper" : "bg-honey text-ink hover:-translate-y-0.5 hover:bg-[#BB7B1E]"
                  }`}
                >
                  {added ? "Добавлено ✓" : `В корзину · ${formatPrice(product.price * qty)}`}
                </button>
              </div>
              {count > 0 && (
                <Link
                  href="/cart/"
                  className="mt-3 inline-flex items-center gap-1.5 text-[14px] font-bold text-leaf transition hover:text-leafDark"
                >
                  Перейти к оформлению ({count}) →
                </Link>
              )}
            </div>

            <p className="mt-4 font-mono text-[10px] leading-relaxed text-ink/55">
              демо-режим: оплата не проводится, заказ оформляется до шага «демо-заказ принят».
            </p>
          </div>
        </div>

        {/* Состав и приём */}
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          <section className="rounded-3xl border border-line bg-cream p-6 lg:col-span-1" aria-labelledby="composition-title">
            <h2 id="composition-title" className="font-mono text-[11px] uppercase tracking-[0.16em] text-khaki">
              Состав
            </h2>
            <ul className="mt-4 space-y-2.5">
              {product.composition.map((item) => (
                <li key={item} className="flex items-baseline gap-2 text-[14.5px] leading-snug text-ink/80">
                  <span className="h-1.5 w-1.5 shrink-0 translate-y-[-1px] rounded-full bg-honey" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </section>
          <section className="rounded-3xl border border-line bg-cream p-6" aria-labelledby="how-title">
            <h2 id="how-title" className="font-mono text-[11px] uppercase tracking-[0.16em] text-khaki">
              Как принимать
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-ink/80">{product.how}</p>
            <p className="mt-4 rounded-xl bg-paper/80 p-3.5 text-[13px] leading-relaxed text-ink/60">
              Перед применением проконсультируйтесь со специалистом. Не является лекарственным средством.
            </p>
          </section>
          <section className="rounded-3xl border border-line bg-cream p-6" aria-labelledby="origin-title">
            <h2 id="origin-title" className="font-mono text-[11px] uppercase tracking-[0.16em] text-khaki">
              Происхождение сырья
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-ink/80">{product.origin}</p>
          </section>
        </div>

        {/* Похожие */}
        {similar.length > 0 && (
          <section className="mt-14" aria-labelledby="similar-title">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 id="similar-title" className="font-display text-3xl font-semibold sm:text-4xl">
                Похожие <span className="text-leaf">товары</span>
              </h2>
              <Link
                href="/catalog/"
                className="rounded-full border border-line bg-cream px-5 py-2.5 text-[14px] font-bold text-ink/70 transition hover:border-leaf hover:text-leaf"
              >
                Весь каталог →
              </Link>
            </div>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {similar.map((item) => (
                <ProductTile key={item.id} product={item} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}