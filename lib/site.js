// Общие константы сайта. SITE_PATH совпадает с basePath в next.config.mjs
// и с адресом project site на GitHub Pages.

export const SITE_PATH = "/shamanchi-phyto";
export const SITE_URL = "https://shamanchi.github.io/shamanchi-phyto";
export const TG_HANDLE = "@PavelYrevichh";
export const TG_URL = "https://t.me/PavelYrevichh";
export const MAIL = "lietman46@mail.com";

export const NAV_LINKS = [
  { href: "#vitrina", label: "Витрина" },
  { href: "#podbor", label: "Подбор" },
  { href: "#istoriya", label: "История" },
  { href: "#otzyvy", label: "Отзывы" },
];

// Префикс для ссылок на файлы из public/
export function asset(path) {
  return SITE_PATH + path;
}

export function formatPrice(value) {
  return new Intl.NumberFormat("ru-RU").format(value) + " \u20bd";
}