"use client";

import { useRef, useState } from "react";
import products from "../data/products.json";
import { asset, formatPrice } from "../lib/site";
import { useShop } from "./ShopContext";
import Reveal from "./Reveal";

function ProductCard({ product, index, open, onToggle, onAdd, added }) {
  const cardRef = useRef(null);

  const handleMove = (event) => {
    if (window.matchMedia("(hover: none)").matches) return;
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(950px) rotateX(${(-py * 4.5).toFixed(2)}deg) rotateY(${(px * 4.5).toFixed(2)}deg) translateY(-6px)`;
  };
  const handleLeave = () => {
    const el = cardRef.current;
    if (el) el.style.transform = "";
  };

  return (
    <Reveal delay={Math.min(index, 3) * 80} className="h-full">
      <article
        className="tilt-card group relative flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-cream shadow-card"
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        ref={cardRef}
        aria-expanded={open}
      >
        <div className="relative overflow-hidden border-b border-line/60">
          <button
            type="button"
            onClick={() => onToggle(product.id)}
            className="block w-full cursor-pointer"
            aria-label={`${product.name}: раскрыть состав и способ приёма`}
          >
            <img
              src={asset(product.img)}
              alt={product.name}
              width={700}
              height={700}
              loading="lazy"
              className="aspect-square w-full object-cover transition duration-700 group-hover:scale-[1.04]"
            />
          </button>
          <span className="absolute left-3 top-3 rounded-full bg-paper/90 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-khaki backdrop-blur">
            курс 1 месяц
          </span>
          {open && (
            <span className="sprout absolute bottom-3 right-3 grid h-9 w-9 place-items-center rounded-full bg-leaf text-paper shadow-card">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path d="M12 21v-8M12 13c-2.5-1.5-4-4-4-7 3.5-.4 6 1 7 3.4M12 16c1.8-1.6 4-2.4 6.5-2.2-.3 3.2-2 5.2-4.5 6" />
              </svg>
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-display text-[22px] font-semibold leading-tight">{product.name}</h3>
              <p className="mt-1 text-[13px] font-semibold text-khaki">{product.format}</p>
            </div>
            <p className="shrink-0 text-right">
              <span className="block text-[19px] font-extrabold text-honeyDark">{formatPrice(product.price)}</span>
              <span className="block font-mono text-[9px] uppercase tracking-wider text-khaki">за курс</span>
            </p>
          </div>

          <p className="mt-3 text-[14px] leading-snug text-ink/65">{product.tagline}</p>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onAdd(product.id)}
              className={`inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-[15px] font-bold transition ${
                added
                  ? "bg-leaf text-paper"
                  : "bg-honey text-ink hover:-translate-y-0.5 hover:bg-[#BB7B1E]"
              }`}
            >
              {added ? (
                <>
                  <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
                    <path d="M3 8.5 6.5 12 13 4.5" />
                  </svg>
                  Добавлено
                </>
              ) : (
                "В корзину"
              )}
            </button>
            <button
              type="button"
              onClick={() => onToggle(product.id)}
              className="inline-flex items-center gap-1.5 rounded-full border border-line bg-paper px-4 py-2.5 text-[14px] font-bold text-ink/70 transition hover:border-leaf hover:text-leaf"
              aria-expanded={open}
            >
              {open ? "Свернуть" : "Состав и приём"}
              <svg
                viewBox="0 0 16 16"
                className={`h-3.5 w-3.5 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="M3 6l5 5 5-5" />
              </svg>
            </button>
          </div>

          {open && (
            <div className="rise-in mt-5 border-t border-dashed border-sage/60 pt-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-khaki">состав</p>
              <ul className="mt-2 space-y-1.5">
                {product.composition.map((item, i) => (
                  <li
                    key={item}
                    className="rise-in flex items-baseline gap-2 text-[13.5px] leading-snug text-ink/80"
                    style={{ animationDelay: `${i * 70}ms` }}
                  >
                    <span className="h-1.5 w-1.5 shrink-0 translate-y-[-1px] rounded-full bg-honey" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
              <dl className="mt-4 grid gap-3 text-[13.5px] leading-snug sm:grid-cols-2">
                <div className="rounded-xl bg-paper/70 p-3">
                  <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-khaki">как принимать</dt>
                  <dd className="mt-1.5 text-ink/75">{product.how}</dd>
                </div>
                <div className="rounded-xl bg-paper/70 p-3">
                  <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-khaki">происхождение сырья</dt>
                  <dd className="mt-1.5 text-ink/75">{product.origin}</dd>
                </div>
              </dl>
            </div>
          )}
        </div>
      </article>
    </Reveal>
  );
}

export default function Showcase() {
  const { add } = useShop();
  const [openId, setOpenId] = useState(null);
  const [addedId, setAddedId] = useState(null);

  const toggle = (id) => setOpenId((current) => (current === id ? null : id));
  const handleAdd = (id) => {
    add(id, 1);
    setAddedId(id);
    window.setTimeout(() => setAddedId(null), 1500);
  };

  return (
    <section id="vitrina" className="scroll-mt-24 bg-cream/50 py-16 sm:py-24">
      <div className="wrap">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-khaki">02 · витрина</p>
            <h2 className="mt-3 font-display text-4xl font-semibold leading-tight sm:text-5xl">
              Курсы на месяц, <span className="text-leaf">без скидочной истерии</span>
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <p className="max-w-sm text-[15px] leading-relaxed text-ink/60">
              Одна упаковка — один курс. Честная цена и понятный состав: раскройте карточку,
              чтобы увидеть, что внутри и как принимать.
            </p>
          </Reveal>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product, i) => (
            <ProductCard
              key={product.id}
              product={product}
              index={i}
              open={openId === product.id}
              onToggle={toggle}
              onAdd={handleAdd}
              added={addedId === product.id}
            />
          ))}
        </div>
      </div>
    </section>
  );
}