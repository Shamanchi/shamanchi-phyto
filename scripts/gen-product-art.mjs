// Генерирует «акварельные» SVG-упаковки товаров в едином стиле «живой аптеки».
// Запуск: node scripts/gen-product-art.mjs  (после того, как есть data/products.json)
import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const products = JSON.parse(readFileSync(join(rootDir, "data", "products.json"), "utf8"));
const outDir = join(rootDir, "public", "images", "products");
mkdirSync(outDir, { recursive: true });

const esc = (s) =>
  String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

function leaf(x, y, s = 1, flip = false, color = "#3E6B35") {
  const t = flip ? "scale(-1,1)" : "";
  return `<g transform="translate(${x} ${y}) scale(${s}) ${t}"><path d="M0 0 C -14 -22 -34 -30 -56 -30 C -56 -6 -42 8 -24 12 L0 0 Z" fill="${color}" opacity="0.75"/><path d="M-8 -6 C -20 -16 -36 -22 -52 -24" stroke="#F7F3EA" stroke-width="1.6" fill="none" opacity="0.8"/></g>`;
}

function sprig(x, y, flip = false, color = "#8FA98A") {
  const t = flip ? "scale(-1,1)" : "";
  return `<g transform="translate(${x} ${y}) ${t}"><path d="M0 0 C 4 -14 10 -26 18 -38" stroke="${color}" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    <path d="M5 -12 C -2 -12 -6 -7 -5 -1 C 2 -2 5 -7 5 -12Z" fill="${color}" opacity=".8"/>
    <path d="M11 -24 C 3 -25 -1 -20 0 -14 C 7 -15 11 -19 11 -24Z" fill="${color}" opacity=".8"/>
    <path d="M17 -36 C 10 -37 6 -32 7 -26 C 13 -27 17 -31 17 -36Z" fill="${color}" opacity=".8"/></g>`;
}

function pouch(cx, cy, w, h, bodyColor, labelText, accent) {
  const x = cx - w / 2;
  const y = cy - h / 2;
  return `<g>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${w * 0.16}" fill="${bodyColor}"/>
    <rect x="${x + 10}" y="${y + 8}" width="${w - 20}" height="${h - 16}" rx="${(w - 20) * 0.15}" fill="none" stroke="rgba(34,48,31,.25)" stroke-width="2"/>
    <path d="M${x + w * 0.18} ${y + 4} C ${x + w * 0.18} ${y - 20} ${x + w * 0.82} ${y - 20} ${x + w * 0.82} ${y + 4}" fill="none" stroke="${accent}" stroke-width="5"/>
    <ellipse cx="${cx}" cy="${y + 26}" rx="${w * 0.3}" ry="12" fill="${accent}"/>
    <text x="${cx}" y="${y + 34}" text-anchor="middle" font-family="Georgia, serif" font-size="15" font-weight="700" fill="#F7F3EA">СПУТНИК ФИТО</text>
    <rect x="${x + 26}" y="${y + h - 86}" width="${w - 52}" height="56" rx="12" fill="#F7F3EA"/>
    <text x="${cx}" y="${y + h - 62}" text-anchor="middle" font-family="Georgia, serif" font-size="21" font-weight="700" fill="#22301F">${labelText}</text>
    <text x="${cx}" y="${y + h - 44}" text-anchor="middle" font-family="sans-serif" font-size="9.5" letter-spacing="2" fill="#6F7559">КУРС · 1 МЕСЯЦ</text>
  </g>`;
}

function jar(cx, cy, w, h, accent) {
  const x = cx - w / 2;
  const y = cy - h / 2;
  return `<g>
    <rect x="${x + 8}" y="${y}" width="${w - 16}" height="26" rx="8" fill="#22301F"/>
    <rect x="${x + 12}" y="${y + 26}" width="${w - 24}" height="8" rx="3" fill="#6F7559"/>
    <rect x="${x}" y="${y + 34}" width="${w}" height="${h - 34}" rx="18" fill="#F4EBD8" stroke="rgba(34,48,31,.22)" stroke-width="2"/>
    <rect x="${x + 10}" y="${y + 60}" width="${w - 20}" height="${h - 78}" rx="12" fill="#EFE6CF"/>
    <g>${[0, 1, 2].map((row) =>
      [0, 1, 2, 3].map((col) => {
        const cxx = x + 30 + col * ((w - 60) / 3) + ((row % 2) * 10);
        const cyy = y + 78 + row * 26;
        return `<rect x="${cxx}" y="${cyy}" width="17" height="10" rx="5" fill="${col % 2 ? accent : "#8FA98A"}"/>`;
      }).join("")
    ).join("")}</g>
    <rect x="${x + 20}" y="${y + h - 62}" width="${w - 40}" height="40" rx="10" fill="${accent}"/>
    <text x="${cx}" y="${y + h - 44}" text-anchor="middle" font-family="Georgia, serif" font-size="15" font-weight="700" fill="#F7F3EA">СПУТНИК ФИТО</text>
  </g>`;
}

for (const p of products) {
  const accent = p.accent || "#3E6B35";
  const cx = 350;
  const short = p.name.replace(/^Сбор «|^Чай «|^Капсулы «/, "").replace(/»$/, "");
  const hero =
    p.formatKey === "капсулы"
      ? jar(cx, 400, 330, 420, accent)
      : p.formatKey === "чай"
        ? pouch(cx, 400, 350, 400, "#E7D7B4", esc(short), "#8E6B2F")
        : pouch(cx, 400, 360, 420, "#D9C49A", esc(short), accent);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 700" role="img" aria-label="${esc(p.name)}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#FBF8F1"/>
      <stop offset="1" stop-color="#EFE7D6"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.5" cy="0.42" r="0.55">
      <stop offset="0" stop-color="${accent}" stop-opacity="0.16"/>
      <stop offset="1" stop-color="${accent}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="700" height="700" fill="url(#bg)"/>
  <rect x="14" y="14" width="672" height="672" rx="34" fill="none" stroke="rgba(34,48,31,.14)" stroke-width="2"/>
  <rect width="700" height="700" fill="url(#glow)"/>
  ${sprig(78, 620, false, accent)}
  ${sprig(620, 108, true, accent)}
  ${leaf(86, 150, 1, false, "#8FA98A")}
  ${leaf(610, 560, 1.1, true, "#8FA98A")}
  ${hero}
  <text x="350" y="668" text-anchor="middle" font-family="Georgia, serif" font-size="17" font-style="italic" fill="#6F7559">${esc(p.tagline.slice(0, 44))}…</text>
</svg>
`;
  writeFileSync(join(outDir, `${p.id}.svg`), svg, "utf8");
  console.log("wrote", `${p.id}.svg`);
}