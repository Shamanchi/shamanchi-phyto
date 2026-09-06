import Reveal from "./Reveal";
import { asset } from "../lib/site";

export default function Founder() {
  return (
    <section id="istoriya" className="scroll-mt-24 py-16 sm:py-24">
      <div className="wrap grid items-center gap-12 lg:grid-cols-[0.92fr_1.08fr]">
        {/* Портрет-иллюстрация */}
        <Reveal className="relative mx-auto w-full max-w-md lg:order-1">
          <div className="doctor-halo">
            <div className="relative overflow-hidden rounded-t-[8rem] rounded-b-3xl border border-line bg-cream shadow-lift">
              <img
                src={asset("/images/doctor.svg")}
                alt="Демо-иллюстрация врача-фитотерапевта Александра Ветрова"
                width={640}
                height={800}
                loading="lazy"
                className="aspect-[4/5] w-full object-cover"
              />
              <span className="absolute right-3 top-3 rounded-full border border-honey/50 bg-paper/85 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-honeyDark backdrop-blur">
                демо-иллюстрация
              </span>
            </div>
          </div>
          <div className="sway absolute right-2 top-10 rounded-2xl border border-line bg-paper px-4 py-3 shadow-card sm:-right-8">
            <p className="font-mono text-[10px] uppercase tracking-wider text-khaki">подпись под составом</p>
            <p className="mt-1 font-display text-lg font-semibold leading-tight">Александр Ветров, врач</p>
          </div>
        </Reveal>

        {/* История */}
        <div className="lg:order-2">
          <Reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-khaki">03 · о враче</p>
            <h2 className="mt-3 font-display text-4xl font-semibold leading-tight sm:text-5xl">
              Почему бренд носит <span className="text-leaf">имя врача</span>
            </h2>
          </Reveal>

          <Reveal delay={80}>
            <div className="mt-6 space-y-4 text-[16px] leading-relaxed text-ink/80">
              <p>
                Я — врач. Пятнадцать лет клинической практики: сначала в городской поликлинике,
                потом в центре восстановительной медицины. За эти годы я выписал тысячи схем —
                и всё чаще видел одно и то же: пациент устал от «таблетки от всего», но не знает,
                куда идти за альтернативой, которой можно доверять.
              </p>
              <p>
                Путь к фитотерапии начался с разочарования в универсальных решениях. Я прошёл
                обучение у практикующих травников, объездил угодья, где собирают сырьё, и понял
                главное: трава работает, когда она выращена и собрана правильно, а сбор составлен
                врачом, а не маркетологом.
              </p>
              <p>
                Так появились мои рецептуры. Каждая — это курс на месяц: понятный состав,
                аккуратные дозировки, отсутствие «универсальных чудес». Я не обещаю исцеления —
                я предлагаю поддержку, которую можно пить курсами годами.
              </p>
            </div>
          </Reveal>

          <Reveal delay={140}>
            <blockquote className="mt-7 border-l-4 border-honey bg-cream/70 py-4 pl-5 pr-4 rounded-r-2xl">
              <p className="font-display text-xl font-semibold italic leading-snug text-ink/90">
                «Сбор — это не порошок в красивой банке. Это мой подбор трав
                и моя подпись под каждым составом».
              </p>
              <cite className="mt-2 block font-mono text-[11px] uppercase tracking-wider not-italic text-khaki">
                — Александр Ветров, врач-фитотерапевт
              </cite>
            </blockquote>
          </Reveal>

          <Reveal delay={200}>
            <dl className="mt-8 grid grid-cols-3 gap-4 border-t border-line pt-6">
              {[
                ["15 лет", "клинической практики"],
                ["40+", "авторских рецептур"],
                ["100%", "состава — на упаковке"],
              ].map(([value, label]) => (
                <div key={label}>
                  <dt className="sr-only">{label}</dt>
                  <dd className="font-display text-3xl font-semibold text-leaf sm:text-4xl">{value}</dd>
                  <dd className="mt-1 text-[13px] leading-snug text-ink/55">{label}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  );
}