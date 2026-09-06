import "./globals.css";
import "./fonts.css";
import { SITE_URL, SITE_PATH, MAIL } from "../lib/site";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Спутник Фито — сайт для фито-магазина и бренда БАД",
    template: "%s · Спутник Фито",
  },
  description:
    "Демонстрационный лендинг-магазин фитосборов врача-фитотерапевта: подбор по задаче, витрина курсов на месяц, честные цены. Эталон разработки сайтов для ниши товаров здоровья — Shamanchi.",
  keywords: [
    "сайт для фито-магазина",
    "сайт для бренда БАД",
    "разработка интернет-магазина трав",
    "фитосборы",
    "фитотерапевт",
    "лендинг товаров здоровья",
    "Shamanchi",
  ],
  alternates: { canonical: "/" },
  icons: {
    icon: SITE_PATH + "/favicon.svg",
  },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: SITE_URL,
    siteName: "Спутник Фито · демо-эталон",
    title: "Спутник Фито — фитосборы врача-фитотерапевта. Демо-эталон сайта для ниши здоровья",
    description:
      "Лицо и имя вместо акций. Подбор по задаче, курс на месяц, честные цены, безопасные формулировки. Такой сайт можно заказать для вашего дела — Shamanchi.",
    images: [{ url: `${SITE_URL}/og.svg`, width: 1200, height: 630, alt: "Спутник Фито — демо-лендинг фито-магазина" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Спутник Фито — фитосборы врача-фитотерапевта",
    description: "Демо-эталон сайта для ниши товаров здоровья. Заказать такой — Shamanchi.",
    images: [`${SITE_URL}/og.svg`],
  },
  robots: { index: true, follow: true },
};

// Кириллические начертания первого экрана: ускоряют LCP (h1 Cormorant 600, текст Manrope 400).
// Имена файлов контентные (hash от файла) и стабильны между сборками.
const PRELOAD_FONTS = [
  `${SITE_PATH}/_next/static/media/Cormorant-cyrillic-600.50c4eb61.woff2`,
  `${SITE_PATH}/_next/static/media/Manrope-cyrillic-400.1a075d0e.woff2`,
  `${SITE_PATH}/_next/static/media/Manrope-cyrillic-700.a3ab8973.woff2`,
  `${SITE_PATH}/_next/static/media/Manrope-latin-400.b69ff29f.woff2`,
  `${SITE_PATH}/_next/static/media/Manrope-latin-700.4fc2723e.woff2`,
];

export const viewport = {
  themeColor: "#F7F3EA",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body className="min-h-screen">
        {PRELOAD_FONTS.map((href) => (
          <link key={href} rel="preload" as="font" type="font/woff2" href={href} crossOrigin="anonymous" />
        ))}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
        >
          Перейти к содержанию
        </a>
        {children}
        <noscript>
          <style>{`.rv{opacity:1 !important;transform:none !important;}`}</style>
        </noscript>
      </body>
    </html>
  );
}