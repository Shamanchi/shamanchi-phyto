import Link from "next/link";
import { BRAND, TG_HANDLE, TG_URL, MAIL, ORBIT_URL } from "../lib/site";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-line bg-parch/70">
      <div className="wrap py-12">
        <div className="grid gap-10 md:grid-cols-[1.3fr_1fr_1fr]">
          <div>
            <Link href="/" className="flex items-center gap-2.5" aria-label={`${BRAND.name} — на главную`}>
              <span className="grid h-9 w-9 place-items-center rounded-full bg-leaf text-paper">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                  <path d="M12 21c-4.5-2-7-5.6-7-9.6C5 6.7 8.5 4 12 3c3.5 1 7 3.7 7 8.4 0 4-2.5 7.6-7 9.6Z" />
                  <path d="M12 21c0-6 1.5-11 5-15M12 21c0-6-1.5-11-5-15" />
                </svg>
              </span>
              <span className="font-display text-[22px] font-semibold leading-none">
                {BRAND.wordmarkA} <span className="text-leaf">{BRAND.wordmarkB}</span>
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-[14px] leading-relaxed text-ink/75">
              Демонстрационный маркетплейс фито-ниши: каталог с фильтрами, карточки, корзина,
              оформление заказа. Эталон разработки сайтов для ниши товаров здоровья.
            </p>
            <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.16em] text-ink/70">
              разработка — Shamanchi · демо-маркетплейс v1
            </p>
          </div>

          <nav aria-label="Навигация в подвале">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink/70">страницы</p>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link href="/catalog/" className="text-[15px] font-semibold text-ink/75 transition hover:text-leaf">
                  Каталог
                </Link>
              </li>
              <li>
                <Link href="/account/" className="text-[15px] font-semibold text-ink/75 transition hover:text-leaf">
                  Мои заказы
                </Link>
              </li>
              <li>
                <Link href="/#vitrina" className="text-[15px] font-semibold text-ink/75 transition hover:text-leaf">
                  Витрина
                </Link>
              </li>
              <li>
                <Link href="/#demo" className="text-[15px] font-semibold text-ink/75 transition hover:text-leaf">
                  Это демонстрация
                </Link>
              </li>
            </ul>
          </nav>

          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink/70">контакты для заказа сайта</p>
            <ul className="mt-4 space-y-2.5 text-[15px] font-semibold">
              <li>
                <a href={TG_URL} target="_blank" rel="noreferrer" className="text-ink/75 transition hover:text-leaf">
                  телеграм {TG_HANDLE}
                </a>
              </li>
              <li>
                <a href={`mailto:${MAIL}`} className="text-ink/75 transition hover:text-leaf">
                  {MAIL}
                </a>
              </li>
              <li>
                <a
                  href={ORBIT_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-honey px-4 py-2 text-[14px] font-bold text-ink shadow-card transition hover:-translate-y-0.5 hover:bg-[#BB7B1E]"
                >
                  Основной сайт Shamanchi <span aria-hidden="true">→</span>
                </a>
              </li>
            </ul>
            <p className="mt-4 font-mono text-[10px] leading-relaxed text-ink/70">
              заявка-эталон: {TG_HANDLE} · Shamanchi
            </p>
          </div>
        </div>

        <div className="mt-10 space-y-2 border-t border-line pt-6 font-mono text-[11px] leading-relaxed text-ink/70">
          <p>
            Сайт является демонстрацией разработки: {BRAND.name} и врач-основатель — вымышленные
            персонажи, товары и отзывы не существуют. Сайт не продаёт товары и не собирает данные.
          </p>
          <p>
            Формулировки на демо соответствуют правилам рекламы БАД: «поддерживает», «традиционно
            применяется», «способствует» — без заявлений о лечебном действии.
          </p>
          <p className="pt-1 text-[10px] text-ink/70">© {year} Shamanchi. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
}