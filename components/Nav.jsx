"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BRAND, NAV_LINKS } from "../lib/site";
import { useShop } from "./ShopContext";

const PAGE_LINKS = [
  { href: "/", label: "Главная" },
  { href: "/catalog/", label: "Каталог" },
  { href: "/account/", label: "Заказы" },
];

export default function Nav() {
  const { count, setCartOpen } = useShop();
  const pathname = usePathname() || "/";
  const page = pathname.replace(/\/+$/, "") || "/";
  const isHome = page === "/";
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const currentHref = "/" + (page === "/" ? "" : page.replace(/^\//, "") + "/");
  const links = isHome
    ? [...NAV_LINKS, { href: "/catalog/", label: "Каталог" }]
    : PAGE_LINKS.filter((l) => l.href !== currentHref);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[60] transition-all duration-300 ${
        scrolled || menuOpen || !isHome
          ? "border-b border-line/70 bg-paper/90 shadow-[0_8px_30px_-20px_rgba(34,48,31,.3)] backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <div className="wrap flex h-16 items-center justify-between gap-4 sm:h-[72px]">
        <Link href="/" className="flex items-center gap-2.5" aria-label={`${BRAND.name} — на главную`}>
          <span className="grid h-9 w-9 place-items-center rounded-full bg-leaf text-paper shadow-card">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              <path d="M12 21c-4.5-2-7-5.6-7-9.6C5 6.7 8.5 4 12 3c3.5 1 7 3.7 7 8.4 0 4-2.5 7.6-7 9.6Z" />
              <path d="M12 21c0-6 1.5-11 5-15" />
              <path d="M12 21c0-6-1.5-11-5-15" />
            </svg>
          </span>
          <span className="font-display text-[22px] font-semibold leading-none tracking-tight">
            {BRAND.wordmarkA} <span className="text-leaf">{BRAND.wordmarkB}</span>
          </span>
        </Link>

        <nav aria-label="Основная навигация" className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <Link
              key={link.href + link.label}
              href={link.href}
              className="rounded-full px-4 py-2 text-[15px] font-semibold text-ink/80 transition hover:bg-sageSoft/60 hover:text-ink"
            >
              {link.label}
            </Link>
          ))}

        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setCartOpen(true)}
            aria-label={`Корзина, товаров: ${count}`}
            className="relative grid h-11 w-11 place-items-center rounded-full border border-line bg-cream text-ink transition hover:border-leaf/50 hover:bg-sageSoft/50"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
              <path d="M6 7h12l1.2 12.2a1.8 1.8 0 0 1-1.8 1.8H6.6a1.8 1.8 0 0 1-1.8-1.8L6 7Z" />
              <path d="M9 10V6a3 3 0 0 1 6 0v4" />
            </svg>
            {count > 0 && (
              <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-honey px-1 text-[11px] font-extrabold text-ink">
                {count}
              </span>
            )}
          </button>

          <Link
            href={isHome ? "#demo" : "/#demo"}
            className="hidden rounded-full bg-honey px-5 py-2.5 text-[15px] font-bold text-ink shadow-card transition hover:-translate-y-0.5 hover:bg-[#BB7B1E] sm:inline-flex"
          >
            Заказать такой сайт
          </Link>

          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
            className="grid h-11 w-11 place-items-center rounded-full border border-line bg-cream text-ink md:hidden"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              {menuOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h10" />}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav aria-label="Мобильная навигация" className="border-t border-line/60 bg-paper/95 px-5 pb-4 pt-2 md:hidden">
          {links.map((link) => (
            <Link
              key={link.href + link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block rounded-xl px-3 py-2.5 text-[16px] font-semibold text-ink/85 hover:bg-sageSoft/50"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href={isHome ? "#demo" : "/#demo"}
            onClick={() => setMenuOpen(false)}
            className="mt-2 block rounded-full bg-honey px-5 py-3 text-center text-[16px] font-bold text-ink"
          >
            Заказать такой сайт
          </Link>
        </nav>
      )}
    </header>
  );
}