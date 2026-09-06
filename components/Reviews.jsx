import Reveal from "./Reveal";

const REVIEWS = [
  { name: "Марина К.", city: "Москва", theme: "ЖКТ", text: "Пью «ЖКТ Комфорт» вторую неделю — тяжесть после еды ушла. Состав понятный, всё подписано, врач отвечает на вопросы." },
  { name: "Игорь С.", city: "Новосибирск", theme: "Сон", text: "Засыпаю быстрее и просыпаюсь без «каши в голове». Дозаказал второй курс без напоминаний — сам." },
  { name: "Ольга В.", city: "Казань", theme: "Иммунитет", text: "Осенью всегда болела. С этим сбором прошла сезон без больничного. Это не магия, а регулярность — курс до конца." },
  { name: "Дмитрий Л.", city: "Екатеринбург", theme: "Энергия", text: "Чай «Лесное утро» заменил кофе в первой половине дня. Мягко, без сердцебиения, как было с эспрессо." },
  { name: "Анна П.", city: "Краснодар", theme: "Кожа", text: "Дерматолог на приёме спросила, что я пью. Чистая кожа за месяц — для меня это результат, а не совпадение." },
  { name: "Сергей Т.", city: "Санкт-Петербург", theme: "Сон", text: "Жена заметила, что перестал ворочаться. Ценю честные формулировки — без обещаний чудес и «мгновенного эффекта»." },
];

const AVATAR_BG = ["bg-[#DCE3C4]", "bg-[#E8D9B8]", "bg-[#D5E0DA]", "bg-[#E3D5C4]", "bg-[#D9DFC9]", "bg-[#E7DCC4]"];

export default function Reviews() {
  return (
    <section id="otzyvy" className="scroll-mt-24 py-16 sm:py-24">
      <div className="wrap">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-khaki">05 · отзывы</p>
          <h2 className="mt-3 font-display text-4xl font-semibold leading-tight sm:text-5xl">
            Люди пьют курсами <span className="text-leaf">и возвращаются</span>
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {REVIEWS.map((review, i) => (
            <Reveal
              key={review.name}
              delay={(i % 3) * 90}
              className="flex flex-col rounded-3xl border border-line bg-cream p-6 shadow-card"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`grid h-11 w-11 place-items-center rounded-full font-display text-lg font-bold text-ink ${AVATAR_BG[i % AVATAR_BG.length]}`}
                  aria-hidden="true"
                >
                  {review.name.charAt(0)}
                </span>
                <div>
                  <p className="text-[15px] font-extrabold leading-tight">{review.name}</p>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-khaki">{review.city}</p>
                </div>
                <span className="ml-auto rounded-full border border-sage/60 bg-sageSoft/50 px-2.5 py-1 text-[11px] font-bold text-leaf">
                  {review.theme}
                </span>
              </div>
              <p className="mt-4 flex-1 text-[14.5px] leading-relaxed text-ink/75">«{review.text}»</p>
            </Reveal>
          ))}
        </div>

        <Reveal delay={120}>
          <p className="mx-auto mt-8 max-w-2xl text-center font-mono text-[11px] leading-relaxed text-khaki">
            демонстрационные отзывы — на реальном проекте сюда подключаются Яндекс.Отзывы
          </p>
        </Reveal>
      </div>
    </section>
  );
}