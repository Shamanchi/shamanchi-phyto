// Чистые помощники каталога/корзины: всё строится только на
// data/products.json + словарях из lib/site.js (бренд в код не зашит).
import products from "../data/products.json";
import { FORMATS, PRICE_BANDS, SORTS, TASK_LABELS, SHOP } from "./site";

export function productById(id) {
  return products.find((p) => p.id === id);
}

export function formatLabel(key) {
  const item = FORMATS.find((f) => f.key === key);
  return item ? item.label : key;
}

export function taskLabel(key) {
  return TASK_LABELS[key] || key;
}

export function collectionItems(collection) {
  if (collection === "hits") return products.filter((p) => p.badge === "hit");
  if (collection === "news") return products.filter((p) => p.badge === "new");
  return products;
}

export function priceBandFor(key) {
  return PRICE_BANDS.find((b) => b.key === key) || PRICE_BANDS[0];
}

function matchesPrice(product, band) {
  if (!band || !band.key || band.key === "all") return true;
  const min = band.min ?? 0;
  const max = band.max ?? Infinity;
  return product.price >= min && product.price < max;
}

export function filterProducts({
  collection = "all",
  formats = [],
  tasks = [],
  price = "all",
  query = "",
  sort = "default",
} = {}) {
  let list = collectionItems(collection);
  if (formats.length) list = list.filter((p) => formats.includes(p.formatKey));
  if (tasks.length) list = list.filter((p) => p.tasks.some((t) => tasks.includes(t)));
  const band = priceBandFor(price);
  if (band) list = list.filter((p) => matchesPrice(p, band));
  const q = query.trim().toLowerCase();
  if (q) {
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.tasks.some((t) => TASK_LABELS[t]?.toLowerCase().includes(q)) ||
        p.format.toLowerCase().includes(q)
    );
  }
  const sortKey = SORTS.find((s) => s.key === sort) ? sort : "default";
  const byName = (a, b) => a.name.localeCompare(b.name, "ru");
  const sorted = [...list];
  if (sortKey === "price-asc") sorted.sort((a, b) => a.price - b.price);
  else if (sortKey === "price-desc") sorted.sort((a, b) => b.price - a.price);
  else if (sortKey === "name") sorted.sort(byName);
  else {
    // «Сначала популярные»: хиты, потом новинки, затем по алфавиту
    const rank = (p) => (p.badge === "hit" ? 0 : p.badge === "new" ? 1 : 2);
    sorted.sort((a, b) => rank(a) - rank(b) || byName(a, b));
  }
  return sorted;
}

export function similarProducts(product, limit = 3) {
  const rest = products.filter((p) => p.id !== product.id);
  const byTask = rest.filter((p) => p.tasks.some((t) => product.tasks.includes(t)));
  const byFormat = rest.filter((p) => p.formatKey === product.formatKey);
  const seen = new Set();
  const result = [];
  for (const group of [byTask, byFormat, rest]) {
    for (const p of group) {
      if (seen.has(p.id)) continue;
      seen.add(p.id);
      result.push(p);
      if (result.length >= limit) return result;
    }
  }
  return result;
}

export function cartLines(items) {
  return products
    .filter((p) => (items[p.id] || 0) > 0)
    .map((p) => ({ product: p, qty: Math.min(99, items[p.id]) }));
}

export function normalizePromo(raw) {
  if (!raw) return null;
  const code = String(raw).trim().toUpperCase();
  const rule = SHOP.promo[code];
  if (!rule || rule.type !== "percent") return null;
  return { code, percent: rule.value };
}

export function discountFor(subtotal, promo) {
  if (!promo || !promo.percent || subtotal <= 0) return 0;
  return Math.round((subtotal * promo.percent) / 100);
}

export function deliveryCost(deliveryKey) {
  const item = SHOP.delivery.find((d) => d.key === deliveryKey);
  return item ? item.cost : 0;
}

export function deliveryOption(deliveryKey) {
  return SHOP.delivery.find((d) => d.key === deliveryKey) || null;
}

export function makeOrderNumber() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  const stamp = `${now.getFullYear().toString().slice(2)}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${String(now.getTime()).slice(-4)}`;
  return `SP-${stamp}`;
}

export { products, FORMATS, PRICE_BANDS, SORTS, TASK_LABELS, SHOP };