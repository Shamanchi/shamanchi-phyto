"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Reveal from "./Reveal";
import { BRAND, TG_HANDLE, TG_URL, MAIL, asset } from "../lib/site";

const WHAT_SELL = [
  "Фитосборы / травяные чаи",
  "БАДы и витамины",
  "Мёд и продукты пчеловодства",
  "Косметика ручной работы",
  "Другое из ниши здоровья",
];

const AUDIENCE = [
  "Уже продаю в телеграме / через знакомых",
  "Продаю на маркетплейсах",
  "Только начинаю, аудитории пока нет",
];

function MiniMock({ label, tone, children }) {
  return (
    <div className={`mock-window border ${tone === "was" ? "border-nightLine/70 bg-[#ECE3D2]" : "border-nightLine/70 bg-night"} shadow-card`}>
      <div className={`mock-bar ${tone === "was" ? "bg-[#DED2BC]" : "bg-nightLine"}`}>
        <span className="h-2 w-2 rounded-full bg-[#C4B394]" />
        <span className="h-2 w-2 rounded-full bg-[#B9A77F]" />
        <span className="h-2 w-2 rounded-full bg-[#A3946B]" />
        <span className={`ml-2 font-mono text-[10px] uppercase tracking-wider ${tone === "was" ? "text-[#6E5B3C]" : "text-terminal/70"}`}>
          {label}
        </span>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

export default function DemoBlock() {
  const [openForm, setOpenForm] = useState(false);
  const [q1, setQ1] = useState("");
  const [q2, setQ2] = useState("");
  const [q3, setQ3] = useState("");
  const [copied, setCopied] = useState(false);
  const messageRef = useRef(null);

  const ready = q1 && q2 && q3.trim();

  const message = useMemo(() => {
    const lines = [
      "Здравствуйте! Хочу заказать сайт, который работает с нашей целевой аудиторией.",
      "",
      `Что продаём: ${q1}`,
      `Аудитория: ${q2}`,
      `Где вас найти: ${q3}`,
      "",
      `Понравился демо-маркетплейс «${BRAND.name}» — хочу обсудить такой для своего бренда.`,
    ];
    return lines.join("\n");
  }, [q1, q2, q3]);

  // Когда все 3 ответа готовы — панель сообщения подскролливается в зону видимости,
  // чтобы кнопки отправки не оставались ниже края экрана.
  useEffect(() => {
    if (ready && messageRef.current) {
      messageRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [ready]);

  const tgLink = `${TG_URL}?text=${encodeURIComponent(message)}`;
  const mailLink = `mailto:${MAIL}?subject=${encodeURIComponent("Заявка: сайт для бренда товаров здоровья")}&body=${encodeURIComponent(message)}`;

  const copyMessage = async () => {
    try {
      await navigator.clipboard.writeText(message);
    } catch {
      const area = document.createElement("textarea");
      area.value = message;
      document.body.appendChild(area);
      area.select();
      document.execCommand("copy");
      area.remove();
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2200);
  };

  const doctorInitials = BRAND.doctorName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2);

  return (
    <section id="demo" className="scroll-mt-24 py-16 sm:py-24">
      <div className="wrap">
        <Reveal>
          <div className="scanlines relative overflow-hidden rounded-[2.2rem] border border-nightLine bg-night text-nightText shadow-lift">
            {/* мягкое свечение терминала */}
            <div
              className="pointer-events-none absolute -top-32 left-1/2 h-64 w-[120%] -translate-x-1/2 rounded-full"
              style={{ background: "radial-gradient(closest-side, rgba(169,196,122,.16), transparent)" }}
              aria-hidden="true"
            />

            <div className="relative px-6 py-10 sm:px-10 sm:py-14 lg:px-14">
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-[0.14em] text-terminal/70">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-terminal" aria-hidden="true" />
                  shamanchi / phyto-marketplace v1
                </span>
                <span className="hidden sm:inline text-nightLine">// этот сайт — демонстрация, а не шаблон</span>
              </div>

              {/* Ключевое сообщение — первым пунктом демо-блока */}
              <h2 className="mt-6 max-w-4xl font-display text-4xl font-semibold leading-[1.08] sm:text-5xl lg:text-[54px]">
                Мы делаем дизайн, который работает{" "}
                <span className="text-terminal">с вашей целевой аудиторией</span>
              </h2>
              <p data-demo-first-point className="mt-5 max-w-2xl text-[16px] leading-relaxed text-nightText/75">
                Каждый наш сайт — мир ваших клиентов, а не наш шаблон. Сначала мы смотрим, как ваша
                аудитория выбирает и покупает, — и только потом собираем страницы, каталог, корзину
                и тексты под эти сценарии. Этот демо-сайт — живой пример такого подхода.
              </p>

              <ul className="mt-8 grid gap-4 sm:grid-cols-3">
                {[
                  ["01", "Маркетплейс, а не лендинг", "Каталог с фильтрами, карточки, корзина и оформление заказа — уже в демо, без «в разработке»"],
                  ["02", "Лицо вместо акций", "Врач-основатель и его позиция в первом экране, а не «−20% на всё»"],
                  ["03", "Безопасные формулировки", "«Поддерживает» и «традиционно применяется» — рекламу не режут"],
                ].map(([num, title, text]) => (
                  <li key={num} className="rounded-2xl border border-nightLine bg-night/70 p-5">
                    <span className="font-mono text-[11px] text-terminal/70">[{num}]</span>
                    <p className="mt-2 font-display text-[19px] font-semibold leading-snug">{title}</p>
                    <p className="mt-2 text-[13.5px] leading-relaxed text-nightText/60">{text}</p>
                  </li>
                ))}
              </ul>

              {/* Было / стало */}
              <div className="mt-8 grid gap-4 lg:grid-cols-2">
                <MiniMock label="было · типовой магазин" tone="was">
                  <p className="inline-block rounded-md bg-[#C96442] px-2 py-0.5 text-[11px] font-extrabold text-[#FFF7EE]">−25% на всё</p>
                  <p className="mt-3 text-[15px] font-extrabold leading-snug text-[#5A4526]">
                    Бесплатная доставка от 7 900 ₽
                    <span className="mt-0.5 block text-[12px] font-semibold text-[#8A7350]">акция заканчивается сегодня</span>
                  </p>
                  <div className="mt-3 flex items-center gap-2 rounded-lg bg-[#F6EEDD] p-2.5">
                    <img src={asset("/images/products/imm-sbor.svg")} alt="" aria-hidden="true" loading="lazy" className="h-7 w-7 shrink-0 rounded-md object-cover" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[12px] font-bold text-[#6E5B3C]">Сбор «Иммунитет»</span>
                      <span className="block text-[10px] text-[#8A7350]"><s>1 490 ₽</s> 990 ₽</span>
                    </span>
                  </div>
                  <p className="mt-3 font-mono text-[10px] uppercase tracking-wider text-[#8A7350]">
                    лицо магазина — баннер скидки
                  </p>
                </MiniMock>

                <MiniMock label="стало · этот сайт" tone="is">
                  <div className="flex items-center gap-2.5">
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-leaf/80 text-[11px] font-extrabold text-paper">{doctorInitials}</span>
                    <span>
                      <span className="block text-[14px] font-extrabold leading-tight">{BRAND.doctorName}</span>
                      <span className="block font-mono text-[10px] uppercase tracking-wider text-terminal/60">{BRAND.doctorRole}</span>
                    </span>
                  </div>
                  <p className="mt-3 text-[15px] font-extrabold leading-snug text-nightText">
                    {BRAND.claim}
                    <span className="mt-0.5 block text-[12px] font-semibold text-nightText/60">подбор по задаче · курс 1 месяц</span>
                  </p>
                  <div className="mt-3 flex items-center gap-2 rounded-lg border border-nightLine bg-night/80 p-2.5">
                    <span className="grid h-7 w-7 place-items-center rounded-md bg-sage text-[10px] font-bold text-night">✓</span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[12px] font-bold">Сбор «Иммунитет»</span>
                      <span className="block text-[10px] text-terminal/70">690 ₽ · без зачёркнутых цен</span>
                    </span>
                  </div>
                  <p className="mt-3 font-mono text-[10px] uppercase tracking-wider text-terminal/60">
                    лицо магазина — врач и доверие
                  </p>
                </MiniMock>
              </div>

              {/* CTA */}
              <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="max-w-xl">
                  <p className="font-display text-2xl font-semibold leading-snug">
                    Узнайте стоимость сайта для вашего бренда
                  </p>
                  <p className="mt-1.5 text-[14px] text-nightText/60">
                    Мы делаем дизайн, который работает с вашей целевой аудиторией.
                    3 коротких вопроса — и готовое сообщение для отправки. Без звонков и спама.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setOpenForm((v) => !v)}
                  className="inline-flex shrink-0 items-center gap-2 rounded-full bg-terminal px-7 py-3.5 text-lg font-extrabold text-night transition hover:-translate-y-0.5 hover:brightness-110"
                >
                  {openForm ? "Свернуть форму" : "Заказать сайт для моего бренда"}
                  <svg viewBox="0 0 20 20" className={`h-4 w-4 transition-transform duration-300 ${openForm ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M5 12l5 5 5-5M10 17V3" />
                  </svg>
                </button>
              </div>

              {openForm && (
                <div className="rise-in mt-8 border-t border-nightLine pt-8">
                  <p className="text-[15px] font-extrabold text-terminal">
                    «Мы делаем дизайн, который работает с вашей целевой аудиторией»
                  </p>
                  <p className="mt-1 text-[13.5px] text-nightText/60">
                    Ответьте на 3 вопроса — соберём готовое сообщение для старта переписки.
                  </p>

                  <div className="mt-6">
                    <p className="text-[15px] font-extrabold">1. Что продаёте?</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {WHAT_SELL.map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => setQ1(option)}
                          className={`rounded-full border px-4 py-2 text-[13.5px] font-semibold transition ${
                            q1 === option
                              ? "border-terminal bg-terminal/15 text-terminal"
                              : "border-nightLine bg-transparent text-nightText/70 hover:border-terminal/50"
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6">
                    <p className="text-[15px] font-extrabold">2. Кто ваша аудитория?</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {AUDIENCE.map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => setQ2(option)}
                          className={`rounded-full border px-4 py-2 text-[13.5px] font-semibold transition ${
                            q2 === option
                              ? "border-terminal bg-terminal/15 text-terminal"
                              : "border-nightLine bg-transparent text-nightText/70 hover:border-terminal/50"
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6">
                    <label htmlFor="demo-where" className="text-[15px] font-extrabold">
                      3. Где вас найти?
                    </label>
                    <input
                      id="demo-where"
                      type="text"
                      value={q3}
                      onChange={(e) => setQ3(e.target.value)}
                      placeholder="@телеграм, ссылка на канал или телефон"
                      className="mt-2 w-full max-w-xl rounded-xl border border-nightLine bg-night px-4 py-3 text-[15px] text-nightText outline-none transition placeholder:text-nightText/35 focus:border-terminal"
                      autoComplete="off"
                    />
                  </div>

                  {ready && (
                    <div ref={messageRef} className="rise-in mt-7 rounded-xl border border-terminal/40 bg-night p-4">
                      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-terminal/80">готовое сообщение</p>
                      <textarea
                        readOnly
                        value={message}
                        rows={6}
                        aria-label="Готовое сообщение для отправки"
                        className="mt-2 w-full resize-none rounded-lg border border-nightLine bg-night/60 px-3.5 py-3 font-mono text-[12.5px] leading-relaxed text-nightText outline-none"
                      />
                      <div className="mt-3 flex flex-wrap gap-2.5">
                        <a
                          href={tgLink}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 rounded-full bg-terminal px-5 py-2.5 text-[14px] font-extrabold text-night transition hover:brightness-110"
                        >
                          Написать в телеграм {TG_HANDLE}
                        </a>
                        <a
                          href={mailLink}
                          className="inline-flex items-center gap-2 rounded-full border border-terminal/60 px-5 py-2.5 text-[14px] font-extrabold text-terminal transition hover:bg-terminal/10"
                        >
                          Написать на почту
                        </a>
                        <button
                          type="button"
                          onClick={copyMessage}
                          className="inline-flex items-center gap-2 rounded-full border border-nightLine bg-night px-5 py-2.5 text-[14px] font-extrabold text-nightText/80 transition hover:border-terminal/50 hover:text-terminal"
                        >
                          {copied ? "Скопировано ✓" : "Скопировать сообщение"}
                        </button>
                      </div>
                      <p className="mt-3 font-mono text-[10px] leading-relaxed text-nightText/40">
                        демо: данные никуда не отправляются и не сохраняются — ссылки открывают ваше приложение
                        с готовым текстом заявки
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-nightLine pt-6">
                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-nightText/45">
                  Разработка: Shamanchi · демо-сайт не продаёт товары
                </p>
                <div className="flex items-center gap-4 font-mono text-[12px] text-terminal/80">
                  <a href={TG_URL} target="_blank" rel="noreferrer" className="transition hover:text-terminal">
                    телеграм {TG_HANDLE}
                  </a>
                  <a href={`mailto:${MAIL}`} className="transition hover:text-terminal">
                    {MAIL}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}