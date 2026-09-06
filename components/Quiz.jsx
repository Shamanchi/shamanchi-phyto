"use client";

import { useMemo, useRef, useState } from "react";
import products from "../data/products.json";
import { asset, TG_URL } from "../lib/site";
import { useShop } from "./ShopContext";
import Reveal from "./Reveal";

const TASKS = [
  { key: "immunity", label: "Иммунитет", hint: "сезон простуд, защитные силы" },
  { key: "gut", label: "ЖКТ", hint: "пищеварение, комфорт после еды" },
  { key: "sleep", label: "Сон и нервы", hint: "засыпание, напряжение" },
  { key: "skin", label: "Кожа", hint: "чистота кожи, высыпания" },
];

const FORMATS = [
  { key: "сбор", label: "Классический сбор", hint: "ложка трав на чашку кипятка" },
  { key: "чай", label: "Травяной чай", hint: "мягкий, пьётся вместо чая" },
  { key: "капсулы", label: "Капсулы", hint: "брать с собой, без заваривания" },
];

const TASK_NAMES = Object.fromEntries(TASKS.map((t) => [t.key, t.label]));
const FORMAT_NAMES = Object.fromEntries(FORMATS.map((f) => [f.key, f.label]));

function recommend(taskKey, formatKey) {
  const pool = products.filter((p) => p.tasks.includes(taskKey));
  return pool.find((p) => p.forms.includes(formatKey)) || pool[0] || products[0];
}

function OptionButton({ active, onClick, children, hint }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`group w-full rounded-2xl border-2 p-4 text-left transition-all duration-200 ${
        active
          ? "border-leaf bg-sageSoft/50 shadow-card"
          : "border-line bg-cream hover:-translate-y-0.5 hover:border-sage hover:shadow-card"
      }`}
    >
      <span className="flex items-center justify-between gap-3">
        <span className="text-[16px] font-extrabold">{children}</span>
        <span
          className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 transition ${
            active ? "border-leaf bg-leaf text-paper" : "border-ink/25 bg-transparent"
          }`}
          aria-hidden="true"
        >
          {active && (
            <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2.4">
              <path d="M3 8.5 6.5 12 13 4.5" />
            </svg>
          )}
        </span>
      </span>
      {hint && <span className="mt-1 block text-[13px] text-ink/55">{hint}</span>}
    </button>
  );
}

export default function Quiz() {
  const { add } = useShop();
  const [step, setStep] = useState(0);
  const [task, setTask] = useState(null);
  const [format, setFormat] = useState(null);
  const [meds, setMeds] = useState(false);
  const [result, setResult] = useState(null);
  const [contact, setContact] = useState("");
  const [leadDone, setLeadDone] = useState(false);
  const [added, setAdded] = useState(false);
  const leadRef = useRef(null);
  const resultRef = useRef(null);

  const recommended = useMemo(
    () => (result ? recommend(result.task, result.format) : null),
    [result]
  );

  const formatFallback = recommended && result && !recommended.forms.includes(result.format);

  const chooseTask = (key) => {
    setTask(key);
    setStep(1);
  };
  const chooseFormat = (key) => {
    setFormat(key);
    setStep(2);
  };
  const finishQuiz = () => {
    setResult({ task, format, meds });
    window.setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 60);
  };
  const restart = () => {
    setStep(0);
    setTask(null);
    setFormat(null);
    setMeds(false);
    setResult(null);
    setContact("");
    setLeadDone(false);
    setAdded(false);
  };

  const handleAdd = () => {
    if (!recommended) return;
    add(recommended.id, 1);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  };

  const handleLead = (event) => {
    event.preventDefault();
    if (!contact.trim()) return;
    try {
      localStorage.setItem(
        "sp-lead-v1",
        JSON.stringify({ contact: contact.trim(), at: new Date().toISOString(), quiz: result })
      );
    } catch { /* демо */ }
    setLeadDone(true);
  };

  const question = [
    { title: "Что хотите поддержать?", options: TASKS, onPick: chooseTask },
    { title: "Как удобнее принимать?", options: FORMATS, onPick: chooseFormat },
  ][step];

  const progress = step === 2 ? 100 : step === 0 ? 12 : 56;
  const tgDoctor = `${TG_URL}?text=${encodeURIComponent("Здравствуйте! Прошёл подбор на «Спутник Фито». Хочу уточнить состав сбора — могу показать его врачу.")}`;

  return (
    <section id="podbor" className="relative scroll-mt-24 py-16 sm:py-24">
      <div className="wrap">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-khaki">01 · подбор по задаче</p>
          <h2 className="mt-3 font-display text-4xl font-semibold leading-tight sm:text-5xl">
            Не знаете, с чего начать?
          </h2>
          <p className="mt-4 text-lg text-ink/70">
            Ответьте на 3 вопроса — покажем сбор под вашу задачу.
          </p>
        </Reveal>

        <Reveal delay={120} className="mx-auto mt-10 max-w-3xl">
          <div className="rounded-[2rem] border border-line bg-cream p-6 shadow-card sm:p-9">
            {!result ? (
              <div>
                <div className="mb-6 flex items-center gap-3" aria-hidden="true">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-parch">
                    <div
                      className="progress-line h-full rounded-full bg-leaf transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <span className="font-mono text-[11px] uppercase tracking-wider text-khaki">
                    {step + 1} / 3
                  </span>
                </div>

                {step < 2 && (
                  <div key={step} className="rise-in">
                    <h3 className="text-xl font-extrabold sm:text-2xl">{question.title}</h3>
                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      {question.options.map((opt) => (
                        <OptionButton key={opt.key} active={false} onClick={() => question.onPick(opt.key)} hint={opt.hint}>
                          {opt.label}
                        </OptionButton>
                      ))}
                    </div>
                    {step > 0 && (
                      <button
                        type="button"
                        onClick={() => setStep(step - 1)}
                        className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-khaki transition hover:text-ink"
                      >
                        <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                          <path d="M10 3 5 8l5 5" />
                        </svg>
                        Назад
                      </button>
                    )}
                  </div>
                )}

                {step === 2 && (
                  <div className="rise-in">
                    <h3 className="text-xl font-extrabold sm:text-2xl">Есть ли противопоказания?</h3>
                    <p className="mt-2 text-[15px] text-ink/60">
                      Честный ответ влияет на рекомендацию. Мы никогда не советуем «вслепую».
                    </p>
                    <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-2xl border-2 border-line bg-paper/60 p-4 transition hover:border-sage">
                      <input
                        type="checkbox"
                        checked={meds}
                        onChange={(e) => setMeds(e.target.checked)}
                        className="mt-1 h-5 w-5 accent-leaf"
                      />
                      <span className="text-[15px] font-semibold leading-snug">
                        Принимаю лекарства — покажу состав врачу
                        <span className="mt-0.5 block text-[13px] font-normal text-ink/55">
                          Сборы совместимы с большинством препаратов, но состав стоит согласовать.
                        </span>
                      </span>
                    </label>
                    <div className="mt-6 flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={finishQuiz}
                        className="inline-flex items-center gap-2 rounded-full bg-leaf px-7 py-3.5 text-lg font-bold text-paper shadow-card transition hover:-translate-y-0.5 hover:bg-leafDark"
                      >
                        Показать подбор
                        <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                          <path d="M5 12l5 5 5-5M10 17V3" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="inline-flex items-center gap-1.5 text-sm font-bold text-khaki transition hover:text-ink"
                      >
                        <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                          <path d="M10 3 5 8l5 5" />
                        </svg>
                        Назад
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="rise-in" ref={resultRef}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-leaf">рекомендация подборщика</p>
                    <h3 className="mt-2 font-display text-3xl font-semibold leading-tight sm:text-4xl">
                      Ваш сбор — {recommended?.name}
                    </h3>
                    <p className="mt-2 text-[15px] text-ink/65">
                      Под задачу «{TASK_NAMES[result.task]}» · формат: {FORMAT_NAMES[result.format]}
                    </p>
                  </div>
                  {meds && (
                    <span className="hidden shrink-0 rounded-full border border-honey/60 bg-paper px-3 py-1.5 text-center font-mono text-[10px] uppercase tracking-wide text-honeyDark sm:block">
                      + лекарства — согласуйте состав
                    </span>
                  )}
                </div>

                {recommended && (
                  <div className="mt-6 flex flex-col gap-5 rounded-2xl border border-line bg-paper/70 p-4 sm:flex-row sm:items-center sm:p-5">
                    <img
                      src={asset(recommended.img)}
                      alt={recommended.name}
                      width={200}
                      height={200}
                      className="mx-auto h-36 w-36 rounded-xl object-cover sm:mx-0"
                      loading="lazy"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-semibold text-khaki">{recommended.format} · курс 1 месяц</p>
                      <p className="mt-1 text-[15px] leading-relaxed text-ink/75">
                        {recommended.tagline}. Состав: {recommended.composition.slice(0, 3).map((c) => c.split(" — ")[0]).join(", ")}…
                      </p>
                      {formatFallback && (
                        <p className="mt-2 text-[13px] leading-snug text-honeyDark">
                          В формате «{FORMAT_NAMES[result.format]}» этот сбор выпускаем по запросу — напишите в телеграм, соберём для вас.
                        </p>
                      )}
                      <div className="mt-3 flex flex-wrap items-center gap-3">
                        <button
                          type="button"
                          onClick={handleAdd}
                          className={`inline-flex items-center gap-2 rounded-full px-6 py-3 text-[16px] font-bold transition ${
                            added
                              ? "bg-leaf text-paper"
                              : "bg-honey text-ink hover:-translate-y-0.5 hover:bg-[#BB7B1E]"
                          }`}
                        >
                          {added ? (
                            <>
                              <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
                                <path d="M3 8.5 6.5 12 13 4.5" />
                              </svg>
                              Добавлено
                            </>
                          ) : (
                            `В корзину · ${recommended.price} ₽`
                          )}
                        </button>
                        <span className="text-[13px] text-ink/55">
                          Точный состав подтвердит врач —{" "}
                          <a href={tgDoctor} target="_blank" rel="noreferrer" className="font-bold text-leaf underline decoration-sage decoration-2 underline-offset-2 hover:text-leafDark">
                            напишите нам в телеграм
                          </a>
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Мягкий сбор контакта (демо, без бэкенда) */}
                <div className="mt-6 rounded-2xl border border-dashed border-sage/70 bg-sageSoft/25 p-5" ref={leadRef}>
                  {!leadDone ? (
                    <form onSubmit={handleLead} className="flex flex-col gap-3 sm:flex-row sm:items-end">
                      <div className="flex-1">
                        <label htmlFor="quiz-lead" className="text-sm font-extrabold">
                          Прислать подбор с расчётом курса?
                        </label>
                        <p className="mt-0.5 text-[13px] text-ink/55">
                          Оставьте телеграм или телефон — пришлём схему приёма на месяц.
                        </p>
                        <input
                          id="quiz-lead"
                          type="text"
                          value={contact}
                          onChange={(e) => setContact(e.target.value)}
                          placeholder="@username или +7 …"
                          className="mt-2 w-full rounded-xl border-2 border-line bg-paper px-4 py-3 text-[15px] outline-none transition focus:border-leaf"
                          autoComplete="off"
                        />
                      </div>
                      <button
                        type="submit"
                        className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-leaf bg-transparent px-6 py-3 text-[16px] font-bold text-leaf transition hover:bg-leaf hover:text-paper"
                      >
                        Получить расчёт
                      </button>
                    </form>
                  ) : (
                    <div className="flex items-start gap-3">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-leaf text-paper">
                        <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
                          <path d="M3 8.5 6.5 12 13 4.5" />
                        </svg>
                      </span>
                      <p className="text-[15px] font-semibold leading-snug">
                        Заявка принята. Это демо — данные никуда не отправляются и нигде не хранятся.
                        <span className="mt-1 block text-[13px] font-normal text-ink/55">
                          На реальном сайте сюда подключается телеграм-бот или CRM.
                        </span>
                      </p>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={restart}
                  className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-khaki transition hover:text-ink"
                >
                  <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M13 8a5 5 0 1 1-1.5-3.5M13 2v3.5H9.5" />
                  </svg>
                  Пройти подбор заново
                </button>
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}