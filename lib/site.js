// Общие константы демо-сайта (Сборка А). Сборка Б переиспользует этот же слой:
// меняются только данные здесь и в data/products.json — компоненты бренд не знают.

export const SITE_PATH = "/shamanchi-phyto";
export const SITE_URL = "https://shamanchi.github.io/shamanchi-phyto";
export const TG_HANDLE = "@shamanchi_dev";
export const TG_URL = "https://t.me/shamanchi_dev";
export const MAIL = "shamanchi_dev@mail.ru";

// Основной сайт студии Shamanchi (orbit): http://shamanchi.ru/
export const ORBIT_URL = "http://shamanchi.ru/";

export const NAV_LINKS = [
  { href: "#vitrina", label: "Витрина" },
  { href: "#podbor", label: "Подбор" },
  { href: "#istoriya", label: "История" },
  { href: "#otzyvy", label: "Отзывы" },
];

// --- Бренд демо-витрины. Полностью вымышлен; реальные бренды в сборках не используются.
export const BRAND = {
  name: "Спутник Фито",
  wordmarkA: "Спутник",
  wordmarkB: "Фито",
  doctorName: "Александр Ветров",
  doctorRole: "врач-фитотерапевт",
  claim: "Фитосборы врача-фитотерапевта",
  badge: "демо-маркетплейс",
};

// --- SEO Сборки А: ключевые фразы «сайт для фито-магазина» и «сайт для бренда БАД».
export const SEO = {
  titleDefault:
    "Сайт для фито-магазина и сайт для бренда БАД — демо-эталон «Спутник Фито»",
  description:
    "Сайт для фито-магазина и сайт для бренда БАД: каталог с фильтрами, корзина, оформление заказа, живой фон и тексты под целевую аудиторию. Демо-витрина разработки — Shamanchi.",
  keywords: [
    "сайт для фито-магазина",
    "сайт для бренда БАД",
    "разработка интернет-магазина трав",
    "маркетплейс товаров здоровья",
    "лендинг товаров здоровья",
    "фитосборы",
    "Shamanchi",
  ],
};

// --- Маркетплейс: словари, промокоды, доставка, оплата (демо-режим, без бэкенда).
export const SHOP = {
  currency: "₽",
  courseLabel: "за курс",
  stockLabel: "В наличии",
  demoDeliveryNote: "Стоимость и сроки доставки — демонстрационные.",
  promoHint: "Промокоды демо: СПУТНИК10 (10%) и ФИТО15 (15%)",
  promo: {
    СПУТНИК10: { type: "percent", value: 10 },
    ФИТО15: { type: "percent", value: 15 },
  },
  delivery: [
    {
      key: "cdek",
      label: "СДЭК до пункта выдачи",
      cost: 350,
      note: "3–7 дней по России",
      needAddress: false,
    },
    {
      key: "courier",
      label: "Курьер до двери",
      cost: 550,
      note: "1–3 дня, по городу",
      needAddress: true,
    },
    {
      key: "post",
      label: "Почта России",
      cost: 300,
      note: "7–14 дней по России",
      needAddress: true,
    },
  ],
  payment: [
    { key: "card", label: "Картой онлайн", note: "Интерфейс готов: ЮKassa / Prodamus" },
    { key: "sbp", label: "СБП по QR-коду", note: "Ссылка на оплату после подтверждения" },
  ],
};

export const TASK_LABELS = {
  immunity: "Иммунитет",
  gut: "Пищеварение",
  sleep: "Сон",
  skin: "Кожа",
  energy: "Энергия",
  calm: "Спокойствие",
};

export const FORMATS = [
  { key: "сбор", label: "Классические сборы" },
  { key: "чай", label: "Травяные чаи" },
  { key: "капсулы", label: "Капсулы" },
];

export const PRICE_BANDS = [
  { key: "all", label: "Любая цена" },
  { key: "lt600", label: "до 600 ₽", max: 600 },
  { key: "600_800", label: "600–800 ₽", min: 600, max: 800 },
  { key: "gt800", label: "от 800 ₽", min: 800 },
];

export const SORTS = [
  { key: "default", label: "Сначала популярные" },
  { key: "price-asc", label: "Сначала дешевле" },
  { key: "price-desc", label: "Сначала дороже" },
  { key: "name", label: "По алфавиту" },
];

// Коллекции «Хиты» и «Новинки» — читаются из badges товаров в products.json
// (см. lib/shop.js), поэтому при смене каталога ничего хардкодить не нужно.

// Префикс для ссылок на файлы из public/
export function asset(path) {
  return SITE_PATH + path;
}

export function formatPrice(value) {
  return new Intl.NumberFormat("ru-RU").format(value) + " \u20bd";
}