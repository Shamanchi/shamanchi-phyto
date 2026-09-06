import "./globals.css";
import "./fonts.css";
import { BRAND, SEO, SITE_PATH, SITE_URL } from "../lib/site";
import { ShopProvider } from "../components/ShopContext";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import CartDrawer from "../components/CartDrawer";
import LivePollen from "../components/live/LivePollenMount";


export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SEO.titleDefault,
    template: `%s · ${BRAND.name}`,
  },
  description: SEO.description,
  keywords: SEO.keywords,
  alternates: { canonical: "/" },
  icons: {
    icon: SITE_PATH + "/favicon.svg",
  },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: SITE_URL,
    siteName: `${BRAND.name} · демо-эталон`,
    title: "Сайт для фито-магазина и сайт для бренда БАД — демо-эталон «Спутник Фито»",
    description:
      "Каталог с фильтрами, корзина, оформление заказа, живой фон и тексты под целевую аудиторию. Демо-витрина разработки — Shamanchi.",
    images: [{ url: `${SITE_URL}/og.svg`, width: 1200, height: 630, alt: "Спутник Фито — демо-маркетплейс фито-ниши" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Сайт для фито-магазина и сайт для бренда БАД — демо-эталон",
    description: "Демо-витрина разработки Shamanchi: маркетплейс товаров здоровья под ключ.",
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
        <ShopProvider>
          <LivePollen />
          <Nav />
          {children}
          <Footer />
          <CartDrawer />
        </ShopProvider>
        <noscript>
          <style>{`.rv{opacity:1 !important;transform:none !important;}`}</style>
        </noscript>
      </body>
    </html>
  );
}