"use client";

import { useState } from "react";
import Link from "next/link";
import { asset, formatPrice, SHOP } from "../../lib/site";
import { useShop } from "../ShopContext";

const BADGE_TEXT = {
  hit: "Хит",
  new: "Новинка",
};

export default function ProductTile({ product }) {
  const { add } = useShop();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    add(product.id, 1);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1500);
  };

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-cream shadow-card transition hover:-translate-y-0.5 hover:shadow-lift">
      <Link
        href={`/product/${product.id}/`}
        className="relative block overflow-hidden border-b border-line/60"
        aria-label={`${product.name}: страница товара`}
      >
        <img
          src={asset(product.img)}
          alt={product.name}
          width={700}
          height={700}
          loading="lazy"
          className="aspect-square w-full object-cover transition duration-700 group-hover:scale-[1.04]"
        />
        {product.badge && (
          <span
            className={`absolute left-3 top-3 rounded-full px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-paper backdrop-blur ${
              product.badge === "hit" ? "bg-honeyDark" : "bg-leaf"
            }`}
          >
            {BADGE_TEXT[product.badge] || product.badge}
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-display text-[20px] font-semibold leading-tight">
              <Link href={`/product/${product.id}/`} className="transition hover:text-leaf">
                {product.name}
              </Link>
            </h3>
            <p className="mt-1 text-[12px] font-semibold text-khaki">{product.format}</p>
          </div>
          <p className="shrink-0 text-right">
            <span className="block text-[18px] font-extrabold text-honeyDark">{formatPrice(product.price)}</span>
            <span className="block font-mono text-[9px] uppercase tracking-wider text-khaki">{SHOP.courseLabel}</span>
          </p>
        </div>
        <p className="mt-2.5 line-clamp-2 text-[13.5px] leading-snug text-ink/65">{product.tagline}</p>
        <div className="mt-4 flex items-center gap-2 pt-1">
          <button
            type="button"
            onClick={handleAdd}
            className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-full px-4 py-2.5 text-[14px] font-bold transition ${
              added ? "bg-leaf text-paper" : "bg-honey text-ink hover:bg-[#BB7B1E]"
            }`}
          >
            {added ? "Добавлено ✓" : "В корзину"}
          </button>
          <Link
            href={`/product/${product.id}/`}
            className="inline-flex items-center justify-center rounded-full border border-line bg-paper px-3.5 py-2.5 text-[13px] font-bold text-ink/70 transition hover:border-leaf hover:text-leaf"
            aria-label={`Подробнее: ${product.name}`}
          >
            Подробнее
          </Link>
        </div>
      </div>
    </article>
  );
}