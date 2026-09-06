"use client";

import { asset } from "../lib/site";
import HeroLeaves from "./live/HeroLeaves";

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pb-10 pt-28 sm:pt-32 lg:pb-16">
      {/* слой 2 «листья»: tsParticles, только первый экран и десктоп */}
      <HeroLeaves />

      <div className="wrap relative grid items-center gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:gap-8">
        <div className="relative z-10 max-w-2xl">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-sage/50 bg-cream/70 px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-khaki">
            <span className="h-1.5 w-1.5 rounded-full bg-leaf" aria-hidden="true" />
            демо-маркетплейс · сайт для фито-магазина
          </p>

          <h1 className="font-display text-[44px] font-semibold leading-[1.04] tracking-tight text-ink sm:text-6xl lg:text-[68px]">
            Фитосборы
            <br />
            <span className="text-leaf">врача-фитотерапевта</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink/80 sm:text-xl">
            15 лет клинической практики. Собственные рецептуры. Травы с экологически
            чистых углов России.
          </p>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-ink/60 sm:text-base">
            Рецептуры, которые люди пьют курсами годами. Без обещаний чудес — только
            травы отборного качества и понятный состав.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#podbor"
              className="inline-flex items-center gap-2 rounded-full bg-honey px-7 py-3.5 text-lg font-bold text-ink shadow-card transition hover:-translate-y-0.5 hover:bg-[#BB7B1E]"
            >
              Подобрать сбор
              <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M5 12l5 5 5-5M10 17V3" />
              </svg>
            </a>
            <a
              href="#vitrina"
              className="inline-flex items-center gap-2 rounded-full border-2 border-ink/15 bg-transparent px-7 py-3 text-lg font-bold text-ink transition hover:border-leaf hover:text-leaf"
            >
              Смотреть витрину
            </a>
          </div>

          <p className="mt-7 font-mono text-[11px] uppercase tracking-[0.12em] text-khaki">
            Каталог, корзина и оформление заказа · СДЭК / Почта России
          </p>
        </div>

        {/* Портрет основателя (демо-иллюстрация) */}
        <div className="doctor-halo relative z-10 mx-auto w-full max-w-[420px]">
          <figure>
            <div className="relative overflow-hidden rounded-t-[10rem] rounded-b-3xl border border-line bg-cream shadow-lift">
            <img
              src={asset("/images/doctor.svg")}
              alt="Демо-иллюстрация: врач-фитотерапевт Александр Ветров за чашкой травяного чая"
              width={640}
              height={800}
              className="aspect-[4/5] w-full object-cover"
              fetchPriority="high"
            />
            <span className="absolute right-3 top-3 rounded-full border border-honey/50 bg-paper/85 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-honeyDark backdrop-blur">
              демо-фото
            </span>
            </div>
          <figcaption className="mt-3 flex items-center justify-between gap-3 px-1">
            <span className="text-sm font-bold text-ink">Александр Ветров</span>
            <span className="text-right font-mono text-[11px] uppercase tracking-wider text-khaki">
              врач-фитотерапевт · 15 лет практики
            </span>
          </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}