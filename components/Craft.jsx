import Reveal from "./Reveal";

const STEPS = [
  {
    title: "Отбор сырья",
    text: "Работаем с проверенными сборщиками Алтая и Поволжья. Каждую партию принимаем по цвету, запаху и влажности.",
    icon: (
      <path d="M12 19c-4.2-1.9-6.5-5.2-6.5-8.7C5.5 6.4 8.6 4 12 3c3.4 1 6.5 3.4 6.5 7.3 0 3.5-2.3 6.8-6.5 8.7Z" />
    ),
  },
  {
    title: "Бережная сушка",
    text: "Тенистая сушка при температуре до 40 °C. Эфирные масла и витамины остаются в траве, а не в цехе.",
    icon: (
      <path d="M12 3v10m0 0c-4 0-6-2.4-6-6 4.5-.6 6 2.3 6 6Zm0 0c4 0 6-2.4 6-6-4.5-.6-6 2.3-6 6Zm0 0v8M8 21h8" />
    ),
  },
  {
    title: "Контроль качества",
    text: "Органолептический контроль каждой партии: цвет настоя, аромат, чистота от примесей. Отчёт — по запросу.",
    icon: (
      <path d="M12 3 5 6v5c0 4.5 3 8.2 7 10 4-1.8 7-5.5 7-10V6l-7-3Z" />
    ),
  },
  {
    title: "Прозрачный состав",
    text: "На упаковке — полный состав и дозировка. Никакой «фитосмеси» мелким шрифтом: вы знаете, что пьёте.",
    icon: (
      <path d="M4 5h16v6H4V5Zm4-2v4m8-4v4M4 17l4 3 4-3 4 3 4-3M7 11v3m10-3v3" />
    ),
  },
];

export default function Craft() {
  return (
    <section id="proizvodstvo" className="scroll-mt-24 border-y border-line/70 bg-cream/60 py-16 sm:py-24">
      <div className="wrap">
        <Reveal className="max-w-2xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-khaki">04 · производство и состав</p>
          <h2 className="mt-3 font-display text-4xl font-semibold leading-tight sm:text-5xl">
            Снимаем главный страх ниши: <span className="text-leaf">«что я пью»</span>
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <Reveal
              key={step.title}
              delay={i * 90}
              className="rounded-3xl border border-line bg-paper p-6 shadow-card transition-transform duration-300 hover:-translate-y-1"
            >
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-sageSoft text-leaf">
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                  {step.icon}
                </svg>
              </span>
              <h3 className="mt-4 font-display text-[21px] font-semibold leading-tight">{step.title}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-ink/65">{step.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}