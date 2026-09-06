"use client";

import { asset } from "../lib/site";

function LeafDecor({ className, flip = false }) {
  return (
    <svg
      viewBox="0 0 64 64"
      aria-hidden="true"
      className={className}
      style={flip ? { transform: "scaleX(-1)" } : undefined}
      fill="none"
    >
      <path
        d="M8 56C6 34 22 14 52 10c2 28-10 46-34 46"
        fill="rgba(62,107,53,.16)"
        stroke="rgba(62,107,53,.55)"
        strokeWidth="1.6"
      />
      <path d="M8 56C18 40 30 26 52 10" stroke="rgba(62,107,53,.55)" strokeWidth="1.4" />
      <path d="M20 46c6-8 15-16 26-22M28 50c5-5 12-11 20-16" stroke="rgba(62,107,53,.4)" strokeWidth="1.2" />
    </svg>
  );
}

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pb-10 pt-28 sm:pt-32 lg:pb-16">
      {/* декоративные листья с параллаксом */}
      <div className="pointer-events-none absolute -left-10 top-40 hidden opacity-80 md:block">
        <div className="float-leaf"><LeafDecor className="h-24 w-24" /></div>
      </div>
      <div className="pointer-events-none absolute -right-14 top-24 hidden opacity-70 md:block">
        <div className="float-leaf float-leaf-slow"><LeafDecor className="h-32 w-32" flip /></div>
      </div>
      <div className="pointer-events-none absolute bottom-24 left-[42%] hidden opacity-60 lg:block">
        <div className="float-leaf" style={{ animationDelay: "2s" }}><LeafDecor className="h-16 w-16" /></div>
      </div>

      <div className="wrap relative grid items-center gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:gap-8">
        <div className="relative z-10 max-w-2xl">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-sage/50 bg-cream/70 px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-khaki">
            <span className="h-1.5 w-1.5 rounded-full bg-leaf" aria-hidden="true" />
            фито-спутник · демонстрационный эталон v1
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
            Доставка по России · СДЭК / Почта России — без порогов и наценок за «бесплатно»
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