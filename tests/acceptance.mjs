// Приёмочный сценарий: квиз до конца, корзина считает, демо-блок -> телеграм/почта,
// адаптив 360/768/1440, мета-теги. Запуск: npm run test:acceptance (после npm run build)
import { chromium } from "playwright-core";
import { existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { startServer } from "../scripts/serve-static.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(here, "..");
const outDir = join(projectRoot, "out");
const artifacts = join(projectRoot, "tests", "artifacts");
mkdirSync(artifacts, { recursive: true });

if (!existsSync(join(outDir, "index.html"))) {
  console.error("Нет ./out/index.html — сначала выполните npm run build");
  process.exit(1);
}

const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
].filter(Boolean);
const executablePath = CHROME_CANDIDATES.find((p) => existsSync(p));
if (!executablePath) {
  console.error("Chrome/Edge не найден. Укажите CHROME_PATH=... к исполняемому файлу браузера.");
  process.exit(1);
}

const checks = [];
const errors = [];
function check(ok, name, detail = "") {
  checks.push({ ok, name, detail });
  if (!ok) errors.push(`${name}${detail ? " :: " + detail : ""}`);
}

const { server, port, base } = await startServer({ root: outDir, quiet: true });
const BASE_URL = `http://127.0.0.1:${port}${base}/`;

const browser = await chromium.launch({ executablePath, headless: true, args: ["--no-sandbox"] });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const pageErrors = [];
page.on("pageerror", (e) => pageErrors.push(String(e)));
page.on("console", (m) => {
  if (m.type() === "error") pageErrors.push(m.text());
});

try {
  // --- Загрузка и SEO ---
  await page.goto(BASE_URL, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForSelector("h1", { timeout: 30000 });
  await page.evaluate(() => document.fonts.ready);
  check((await page.title()).includes("Спутник Фито"), "title содержит бренд", await page.title());
  check(
    (await page.locator('meta[name="description"]').getAttribute("content"))?.length > 80,
    "meta description заполнена"
  );
  check(
    (await page.locator('meta[property="og:title"]').getAttribute("content") || "").includes("Спутник"),
    "Open Graph title"
  );
  check(await page.locator("h1").innerText().then((t) => t.includes("Фитосборы")), "hero h1 виден");
  check(
    (await page.locator('img[alt*="врач"]').count()) > 0,
    "портрет врача с alt присутствует"
  );
  await page.screenshot({ path: join(artifacts, "1-hero-1440.png") });

  // --- Квиз до конца ---
  await page.locator("#podbor").scrollIntoViewIfNeeded();
  await page.locator("#podbor").getByRole("button", { name: "Иммунитет" }).click();
  await page.locator("#podbor").getByRole("button", { name: "Классический сбор" }).click();
  await page.getByRole("button", { name: "Показать подбор" }).click();
  await page.waitForSelector("text=Ваш сбор —");
  const recName = await page.locator("#podbor h3").innerText();
  check(recName.includes("Иммунитет"), "квиз показывает сбор под задачу", recName);
  check(
    (await page.locator("#podbor").innerText()).includes("Точный состав подтвердит врач"),
    "подпись «состав подтвердит врач» есть"
  );
  await page.getByRole("button", { name: /В корзину · 690/ }).click();
  await page.waitForSelector('header button[aria-label*="Корзина"] span:has-text("1")');
  check(true, "после квиза в корзине 1 товар (счётчик в шапке)");

  // мягкий сбор контакта
  await page.locator("#quiz-lead").fill("@test_user");
  await page.getByRole("button", { name: "Получить расчёт" }).click();
  await page.waitForSelector("text=Заявка принята");
  check(true, "лид-форма квиза показывает «Заявка принята»");

  // --- Корзина: панель, счёт, итог ---
  await page.locator('header button[aria-label*="Корзина"]').click();
  await page.waitForSelector('aside[role="dialog"]');
  const drawerText = await page.locator('aside[role="dialog"]').innerText();
  check(drawerText.includes("Сбор «Иммунитет»"), "в корзине есть товар из квиза");
  check(drawerText.replace(/\u00a0/g, " ").includes("690"), "итог корзины 690 ₽");
  check(
    (await page.locator('aside[role="dialog"] a', { hasText: "Оформить в телеграме" }).getAttribute("href"))
      ?.startsWith("https://t.me/PavelYrevichh?text=") === true,
    "«Оформить» ведёт в телеграм с текстом заказа"
  );
  await page.locator('aside[role="dialog"] button[aria-label="Закрыть"]').click();

  // --- Витрина: добавление, раскрытие состава ---
  await page.locator("#vitrina").scrollIntoViewIfNeeded();
  const firstCard = page.locator("#vitrina article").first();
  await firstCard.getByRole("button", { name: "Состав и приём" }).click();
  await page.waitForSelector("#vitrina article >> text=как принимать");
  check(true, "карточка раскрывает состав/приём/происхождение");
  const cardText = (await firstCard.innerText()).toLowerCase();
  check(cardText.includes("состав") && cardText.includes("как принимать"), "в раскрытой карточке есть блоки состава");
  await firstCard.getByRole("button", { name: "В корзину" }).click();
  await page.waitForSelector('header button[aria-label*="Корзина"] span:has-text("2")');
  check(true, "после витрины счётчик корзины = 2");
  await page.locator('header button[aria-label*="Корзина"]').click();
  const drawer2raw = await page.locator('aside[role="dialog"]').innerText();
  const drawer2 = drawer2raw.replace(/\u00a0/g, " ");
  check(drawer2.includes("1 380"), "итог 1 380 ₽ за два курса", drawer2);
  await page.keyboard.press("Escape");

  // --- Демо-блок: форма из 3 вопросов -> готовое сообщение ---
  await page.locator("#demo").scrollIntoViewIfNeeded();
  await page.getByRole("button", { name: "Заказать сайт для моего бренда" }).click();
  await page.getByRole("button", { name: "Фитосборы / травяные чаи" }).click();
  await page.getByRole("button", { name: "Уже продаю в телеграме / через знакомых" }).click();
  await page.locator("#demo-where").fill("@moy_brand");
  await page.waitForSelector("#demo textarea");
  const message = await page.locator("#demo textarea").inputValue();
  check(
    message.includes("Хочу заказать сайт") && message.includes("@moy_brand"),
    "после 3 ответов сформировано сообщение для копирования"
  );
  const tgHref = await page.locator('#demo a:has-text("Написать в телеграм")').getAttribute("href");
  const mailHref = await page.locator('#demo a:has-text("Написать на почту")').getAttribute("href");
  check(tgHref?.startsWith("https://t.me/PavelYrevichh?text=") && decodeURIComponent(tgHref).includes("@moy_brand"), "кнопка телеграм с текстом заявки");
  check(mailHref?.includes("mailto:lietman46@mail.com") && decodeURIComponent(mailHref).includes("@moy_brand"), "кнопка почты с текстом заявки");
  await page.getByRole("button", { name: "Скопировать сообщение" }).click();
  await page.waitForSelector('button:has-text("Скопировано")');
  check(true, "сообщение копируется в буфер");

  // --- Отзывы, подвал, дисклеймеры ---
  const pageText = (await page.locator("body").innerText()).replace(/\s+/g, " ").toLowerCase();
  check(pageText.includes("демонстрационные отзывы"), "дисклеймер отзывов есть");
  check(pageText.includes("сайт является демонстрацией разработки"), "дисклеймер в подвале есть");
  check(pageText.includes("правилам рекламы бад"), "строка про правила рекламы БАД есть");

  // --- Адаптив 768 / 360: без горизонтального скролла ---
  for (const width of [768, 360]) {
    await page.setViewportSize({ width, height: 900 });
    await page.waitForTimeout(350);
    const overflow = await page.evaluate(() => ({
      sw: document.documentElement.scrollWidth,
      iw: window.innerWidth,
    }));
    check(overflow.sw <= overflow.iw + 1, `нет горизонтального скролла на ${width}px`, `${overflow.sw} > ${overflow.iw}`);
    await page.locator("#top").scrollIntoViewIfNeeded();
    await page.screenshot({ path: join(artifacts, `full-${width}.png`), fullPage: true });
  }
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.locator("#top").scrollIntoViewIfNeeded();
  await page.screenshot({ path: join(artifacts, "full-1440.png"), fullPage: true });

  const fontReady = await page.evaluate(() => {
    let manrope = false;
    let cormorant = false;
    for (const face of document.fonts) {
      const family = face.family.replace(/["']/g, "");
      if (face.status === "loaded") {
        if (family.includes("Manrope")) manrope = true;
        if (family.includes("Cormorant")) cormorant = true;
      }
    }
    return manrope && cormorant;
  });
  check(fontReady, "локальные шрифты Manrope и Cormorant загрузились");
} finally {
  await browser.close();
  server.close();
}

const consoleErrors = pageErrors.filter((e) => !e.includes("favicon") && !e.includes("net::ERR_ABORTED"));
if (consoleErrors.length) {
  errors.push("console/page errors: " + consoleErrors.slice(0, 5).join(" | "));
}

const failed = checks.filter((c) => !c.ok).length;
console.log("");
console.log(`Acceptance: ${checks.length - failed}/${checks.length} проверок прошло`);
for (const c of checks) console.log(`  ${c.ok ? "PASS" : "FAIL"}  ${c.name}${c.detail && !c.ok ? "  [" + c.detail + "]" : ""}`);
if (errors.length) {
  console.log("\nОшибки:");
  for (const e of errors) console.log("  - " + e);
  process.exit(1);
}
console.log("\nСкриншоты: tests/artifacts/");
process.exit(0);