import { NAV_LINKS, TG_HANDLE, TG_URL, MAIL } from "../lib/site";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-line bg-parch/70">
      <div className="wrap py-12">
        <div className="grid gap-10 md:grid-cols-[1.3fr_1fr_1fr]">
          <div>
            <a href="#top" className="flex items-center gap-2.5" aria-label="Спутник Фито — наверх">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-leaf text-paper">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                  <path d="M12 21c-4.5-2-7-5.6-7-9.6C5 6.7 8.5 4 12 3c3.5 1 7 3.7 7 8.4 0 4-2.5 7.6-7 9.6Z" />
                  <path d="M12 21c0-6 1.5-11 5-15M12 21c0-6-1.5-11-5-15" />
                </svg>
              </span>
              <span className="font-display text-[22px] font-semibold leading-none">
                Спутник <span className="text-leaf">Фито</span>
              </span>
            </a>
            <p className="mt-4 max-w-sm text-[14px] leading-relaxed text-ink/60">
              Демонстрационный лендинг-магазин фитосборов врача-фитотерапевта.
              Эталон разработки сайтов для ниши товаров здоровья.
            </p>
            <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.16em] text-khaki">
              разработка — Shamanchi · демо-эталон v1
            </p>
          </div>

          <nav aria-label="Навигация в подвале">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-khaki">страницы</p>
            <ul className="mt-4 space-y-2.5">
              {[...NAV_LINKS, { href: "#proizvodstvo", label: "Производство" }, { href: "#demo", label: "Это демонстрация" }].map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-[15px] font-semibold text-ink/75 transition hover:text-leaf">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-khaki">контакты для заказа сайта</p>
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
            </ul>
            <p className="mt-4 font-mono text-[10px] leading-relaxed text-khaki">
              заявка-эталон: @PavelYrevichh · Shamanchi
            </p>
          </div>
        </div>

        <div className="mt-10 space-y-2 border-t border-line pt-6 font-mono text-[11px] leading-relaxed text-khaki">
          <p>
            Сайт является демонстрацией разработки: «Спутник Фито» и врач-основатель — вымышленные
            персонажи, товары и отзывы не существуют. Сайт не продаёт товары и не собирает данные.
          </p>
          <p>
            Формулировки на демо соответствуют правилам рекламы БАД: «поддерживает», «традиционно
            применяется», «способствует» — без заявлений о лечебном действии.
          </p>
          <p className="pt-1 text-[10px] text-khaki/80">© {year} Shamanchi. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
}