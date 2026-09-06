// Приёмочный сценарий Сборки А (маркетплейс-каркас + живой фон + финальные тексты).
// Покрытие: SEO/тексты, живой фон (десктоп/мобильный/reduced-motion),
// каталог -> карточка -> корзина -> оформление -> демо-заказ на 1440/768/360,
// демо-блок (первый пункт про ЦА, shamanchi_dev), отсутствие горизонтального скролла.
// Запуск: npm run test:acceptance (после npm run build).
import { chromium } from "playwright-core";
import { existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { startServer } from "../scripts/serve-static.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(here, "..");
const outDir = join(projectRoot, "out");
const artifacts = join(projectRoot, "tests", "artifacts", "build-a");
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
const consoleErrors = [];
function check(ok, name, detail = "") {
  checks.push({ ok, name, detail });
  if (!ok) errors.push(`${name}${detail ? " :: " + detail : ""}`);
}

const { server, port, base } = await startServer({ root: outDir, quiet: true });
const BASE_URL = `http://127.0.0.1:${port}${base}/`;
const pageErrors = new Set();

async function newPage(browserRef, viewport, { reduced = false } = {}) {
  const ctx = await browserRef.newContext({
    viewport,
    reducedMotion: reduced ? "reduce" : "no-preference",
  });
  const pg = await ctx.newPage();
  pg.on("pageerror", (e) => pageErrors.add(String(e)));
  pg.on("console", (m) => {
    if (m.type() === "error") pageErrors.add(m.text());
  });
  return { ctx, pg };
}

function normalize(text) {
  return text.replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim();
}

async function waitCanvasDrawn(pg, selector, label) {
  await pg.waitForFunction(
    (sel) => {
      const canvas = document.querySelector(sel);
      if (!canvas || !canvas.width) return false;
      try {
        const ctx2d = canvas.getContext("2d");
        if (!ctx2d) return false;
        const data = ctx2d.getImageData(0, 0, canvas.width, canvas.height).data;
        let lit = 0;
        for (let i = 3; i < data.length; i += 40) if (data[i] > 10) lit++;
        return lit > 30;
      } catch {
        return true;
      }
    },
    selector,
    { timeout: 15000 }
  ).catch(() => {
    errors.push(`${label}: канвас не отрисовал частицы за 15с`);
  });
}

const browser = await chromium.launch({ executablePath, headless: true, args: ["--no-sandbox"] });

try {
  // ============ 1. Домашняя: SEO-тексты Сборки А ============
  const { ctx: homeCtx, pg: home } = await newPage(browser, { width: 1440, height: 900 });
  await home.goto(BASE_URL, { waitUntil: "domcontentloaded", timeout: 60000 });
  await home.waitForSelector("h1", { timeout: 30000 });
  await home.evaluate(() => document.fonts.ready);

  const title = await home.title();
  const description = await home.locator('meta[name="description"]').getAttribute("content");
  check(title.toLowerCase().includes("сайт для фито-магазина") && title.toLowerCase().includes("бренда бад"), "title: «сайт для фито-магазина» и «бренда БАД»", title);
  check(
    (description || "").toLowerCase().includes("сайт для фито-магазина") && (description || "").toLowerCase().includes("сайт для бренда бад"),
    "description: обе SEO-фразы",
    description
  );
  check((await home.locator('h1').innerText()).includes("Фитосборы"), "hero h1 виден");

  // Живой фон: пыльца fullscreen + листья в hero (десктоп)
  await home.waitForSelector('[data-live-pollen="canvas"]', { timeout: 15000 });
  await home.waitForSelector('[data-live-leaves="canvas"]', { timeout: 15000 });
  await waitCanvasDrawn(home, "#live-pollen canvas", "пыльца (десктоп)");
  await waitCanvasDrawn(home, "#live-leaves canvas", "листья (десктоп hero)");
  await home.waitForTimeout(400);
  await home.screenshot({ path: join(artifacts, "1-hero-bg-1440.png") });

  // Демо-блок: первым пунктом сообщение про ЦА + shamanchi_dev в константах
  await home.locator("#demo").scrollIntoViewIfNeeded();
  const demoText = normalize(await home.locator("#demo").innerText());
  check(demoText.includes("Мы делаем дизайн, который работает с вашей целевой аудиторией"), "демо-блок: первое сообщение про ЦА");
  const firstPoint = normalize(await home.locator("#demo [data-demo-first-point]").innerText());
  check(firstPoint.includes("мир ваших клиентов, а не наш шаблон"), "демо-блок: раскрытие «мир клиентов, не шаблон»", firstPoint);

  await home.getByRole("button", { name: "Заказать сайт для моего бренда" }).click();
  const formText = normalize(await home.locator("#demo").innerText());
  check(formText.includes("Мы делаем дизайн, который работает с вашей целевой аудиторией"), "фраза про ЦА продублирована в форме");
  await home.getByRole("button", { name: "Фитосборы / травяные чаи" }).click();
  await home.getByRole("button", { name: "Уже продаю в телеграме / через знакомых" }).click();
  await home.locator("#demo-where").fill("@moy_brand");
  await home.waitForSelector("#demo textarea");
  const demoMessage = await home.locator("#demo textarea").inputValue();
  check(demoMessage.includes("работает с нашей целевой аудиторией") && demoMessage.includes("@moy_brand"), "сообщение формы содержит ЦА-фразу и контакт");
  const tgHref = await home.locator('#demo a:has-text("Написать в телеграм")').getAttribute("href");
  const mailHref = await home.locator('#demo a:has-text("Написать на почту")').getAttribute("href");
  check(tgHref?.startsWith("https://t.me/shamanchi_dev?text="), "телеграм демо-блока: t.me/shamanchi_dev", tgHref);
  check(mailHref?.includes("mailto:shamanchi_dev@mail.ru"), "почта демо-блока: shamanchi_dev@mail.ru", mailHref);
  await home.screenshot({ path: join(artifacts, "2-demo-form-1440.png") });
  await homeCtx.close();

  // ============ 2. Фон: мобильный без листьев; reduced-motion статичен ============
  const { ctx: mobileCtx, pg: mobile } = await newPage(browser, { width: 360, height: 800 });
  await mobile.goto(BASE_URL, { waitUntil: "domcontentloaded", timeout: 60000 });
  await mobile.waitForSelector("h1", { timeout: 30000 });
  await mobile.waitForSelector('[data-live-pollen="canvas"]', { timeout: 15000 });
  await mobile.waitForTimeout(600);
  check((await mobile.locator('[data-live-leaves="canvas"]').count()) === 0, "на мобильном (<768px) листьев в hero нет");
  await mobile.screenshot({ path: join(artifacts, "3-hero-mobile-360.png") });
  await mobileCtx.close();

  const { ctx: reducedCtx, pg: reducedPage } = await newPage(browser, { width: 1440, height: 900 }, { reduced: true });
  await reducedPage.goto(BASE_URL, { waitUntil: "domcontentloaded", timeout: 60000 });
  await reducedPage.waitForSelector('[data-live-pollen="static"]', { timeout: 15000 });
  await reducedPage.waitForTimeout(700);
  const staticState = await reducedPage.evaluate(() => ({
    pollenStatic: Boolean(document.querySelector('[data-live-pollen="static"]')),
    canvases: document.querySelectorAll("#live-pollen canvas, #live-leaves canvas").length,
    leaves: document.querySelectorAll('[data-live-leaves="canvas"]').length,
    animated: getComputedStyle(document.documentElement).getPropertyValue("scroll-behavior"),
  }));
  check(staticState.pollenStatic && staticState.canvases === 0 && staticState.leaves === 0, "reduced-motion: статичный фон без канвасов", JSON.stringify(staticState));
  await reducedPage.screenshot({ path: join(artifacts, "4-reduced-motion-static-1440.png") });
  await reducedCtx.close();

  // ============ 3. Маркетплейс-флоу на 1440/768/360 ============
  async function runShopFlow(width, label) {
    const { ctx, pg } = await newPage(browser, { width, height: 900 });
    const steps = [];
    const ok = (name, detail = "") => steps.push({ ok: true, name, detail });
    const fail = (name, detail = "") => steps.push({ ok: false, name, detail });

    // каталог
    await pg.goto(`${BASE_URL}catalog/`, { waitUntil: "domcontentloaded", timeout: 60000 });
    await pg.waitForSelector("h1", { timeout: 30000 });
    const h1c = await pg.locator("h1").innerText();
    if (!h1c.includes("Каталог")) fail("каталог открывается", h1c); else ok("каталог открывается");

    const totalText = normalize(await pg.locator("body").innerText()).toLowerCase();
    if (!totalText.includes("8 товаров в базе")) fail("каталог содержит все товары", totalText.slice(0, 120)); else ok("каталог содержит все товары");

    // фильтр/поиск
    await pg.locator('input[placeholder*="Поиск"]').fill("сон");
    await pg.waitForTimeout(300);
    let catalogText = normalize(await pg.locator("main").innerText());
    if (!catalogText.includes("Спокойный сон")) fail("поиск «сон» находит товар", catalogText.slice(0, 160)); else ok("поиск «сон» находит товар");
    const resultTitles = await pg.locator("article h3").allInnerTexts();
    if (resultTitles.some((t) => t.includes("Иммунитет"))) fail("поиск отфильтровал лишнее", resultTitles.join(", ")); else ok("поиск отфильтровал лишнее");
    await pg.screenshot({ path: join(artifacts, `5-catalog-${label}.png`) });

    // карточка товара
    await pg.locator('a[href*="/product/sleep-sbor/"]').first().click();
    await pg.waitForSelector('h1:has-text("Спокойный сон")', { timeout: 30000 });
    const cardText = normalize(await pg.locator("main").innerText()).toLowerCase();
    for (const need of ["состав", "как принимать", "происхождение сырья", "похожие", "720", "в наличии"]) {
      if (!cardText.includes(need)) fail(`карточка: нет «${need}»`, cardText.slice(0, 300));
    }
    ok("карточка: состав/приём/цена/похожие/наличие видны");

    // корзина: количество 2 через карточку
    await pg.getByRole("button", { name: "Увеличить количество" }).click();
    await pg.getByRole("button", { name: /В корзину · 1\s*440/ }).click();
    await pg.waitForSelector('header button[aria-label*="Корзина"] span:has-text("2")');
    ok("счётчик в шапке = 2 после добавления с карточки");
    await pg.locator('header button[aria-label*="Корзина"]').click();
    await pg.waitForSelector('aside[role="dialog"]');
    await pg.getByRole("link", { name: "К оформлению", exact: true }).click();
    await pg.waitForURL(/\/cart\//, { timeout: 30000 });

    const cartText = normalize(await pg.locator("main").innerText());
    if (!cartText.includes("1 440")) fail("корзина: итог 1 440 за 2 курса", cartText.slice(0, 300)); else ok("корзина: пересчёт при количестве 2");
    // промокод
    await pg.locator("#promo-input").fill("Спутник10");
    await pg.getByRole("button", { name: "Применить" }).click();
    await pg.waitForSelector('main:has-text("Промокод применён")', { timeout: 10000 });
    const cartAfterPromo = normalize(await pg.locator("main").innerText());
    if (!cartAfterPromo.includes("1 296")) fail("корзина: промокод 10% даёт 1 296", cartAfterPromo.slice(0, 300)); else ok("корзина: промокод-механика пересчитывает итог");
    await pg.screenshot({ path: join(artifacts, `6-cart-promo-${label}.png`) });

    // оформление: контакты -> доставка (курьер) -> оплата (СБП) -> демо-заказ
    await pg.getByRole("link", { name: "Перейти к оформлению" }).click();
    await pg.waitForSelector('h1:has-text("Оформление заказа")', { timeout: 30000 });
    await pg.locator("#co-name").fill("Тест Клиент");
    await pg.locator("#co-phone").fill("+7 900 000-00-00");
    await pg.locator("#co-email").fill("test@example.com");
    await pg.getByRole("button", { name: "Далее" }).click();
    await pg.waitForSelector('section[aria-label="Способ доставки"]', { timeout: 10000 });
    await pg.getByRole("button", { name: /Курьер до двери/ }).click();
    await pg.locator("#co-address").fill("Москва, Лесная, 1");
    await pg.screenshot({ path: join(artifacts, `7-checkout-delivery-${label}.png`) });
    await pg.getByRole("button", { name: "Далее" }).click();
    await pg.waitForSelector('section[aria-label="Оплата"]', { timeout: 10000 });
    await pg.getByRole("button", { name: /СБП по QR-коду/ }).click();
    const checkoutText = normalize(await pg.locator("main").innerText());
    if (!checkoutText.includes("1 846")) fail("оформление: итог с доставкой курьера 1 846", checkoutText.slice(0, 300)); else ok("оформление: итог = товары+скидка+доставка");
    await pg.screenshot({ path: join(artifacts, `8-checkout-payment-${label}.png`) });
    await pg.getByRole("button", { name: "Оформить демо-заказ" }).click();
    await pg.waitForURL(/\/order-success\/?\?/, { timeout: 30000 });
    await pg.waitForSelector('h1:has-text("Демо-заказ принят")', { timeout: 30000 });
    const successText = normalize(await pg.locator("main").innerText());
    if (!successText.includes("Номер заказа") || !/SP-\d{6,}/.test(successText)) fail("демо-заказ принят с номером", successText.slice(0, 200));
    else ok("демо-заказ принят с номером");
    if (!successText.includes("оплата не проводится")) fail("подтверждение явно помечено как демо", successText.slice(0, 300)); else ok("подтверждение явно помечено как демо");
    const tgQ = await pg.locator('main a[href*="t.me/shamanchi_dev"]').getAttribute("href");
    if (!tgQ) fail("на подтверждении есть вопрос в телеграм shamanchi_dev"); else ok("на подтверждении есть вопрос в телеграм shamanchi_dev");
    await pg.screenshot({ path: join(artifacts, `9-order-success-${label}.png`) });

    // личный кабинет: история + повтор
    await pg.goto(`${BASE_URL}account/`, { waitUntil: "domcontentloaded", timeout: 60000 });
    await pg.waitForSelector('h1:has-text("Мои заказы")', { timeout: 30000 });
    await pg.waitForFunction(() => /SP-\d{6,}/.test(document.body.innerText), null, { timeout: 15000 });
    const accountText = normalize(await pg.locator("main").innerText());
    const accountLower = accountText.toLowerCase();
    if (!/SP-\d{6,}/.test(accountText) || !accountLower.includes("принят · демо-заказ")) fail("в истории заказов есть оформленный демо-заказ", accountText.slice(0, 200));
    else ok("в истории заказов есть оформленный демо-заказ");
    await pg.getByRole("button", { name: "Повторить заказ" }).click();
    await pg.waitForURL(/\/cart\//, { timeout: 30000 });
    await pg.waitForSelector('main:has-text("Корзина")', { timeout: 15000 });
    const repeated = normalize(await pg.locator("main").innerText());
    if (!repeated.includes("Спокойный сон")) fail("повтор заказа добавляет товары в корзину", repeated.slice(0, 200)); else ok("повтор заказа добавляет товары в корзину");
    await pg.screenshot({ path: join(artifacts, `10-account-${label}.png`) });

    // без горизонтального скролла на страницах маркетплейса
    const overflow = await pg.evaluate(() => ({
      sw: document.documentElement.scrollWidth,
      iw: window.innerWidth,
    }));
    if (overflow.sw > overflow.iw + 1) fail(`нет горизонтального скролла (${width}px)`, `${overflow.sw} > ${overflow.iw}`);
    else ok(`нет горизонтального скролла (${width}px)`);

    for (const s of steps) check(s.ok, `${s.name} [${width}]`, s.detail);
    await ctx.close();
  }

  await runShopFlow(1440, "1440");
  await runShopFlow(768, "768");
  await runShopFlow(360, "360");

  // ============ 4. Полностраничные скриншоты лендинга без скролла на 360/768 ============
  for (const width of [360, 768]) {
    const { ctx, pg } = await newPage(browser, { width, height: 900 });
    await pg.goto(BASE_URL, { waitUntil: "domcontentloaded", timeout: 60000 });
    await pg.waitForSelector("h1", { timeout: 30000 });
    await pg.waitForTimeout(400);
    const overflow = await pg.evaluate(() => ({
      sw: document.documentElement.scrollWidth,
      iw: window.innerWidth,
    }));
    check(overflow.sw <= overflow.iw + 1, `лендинг: нет горизонтального скролла на ${width}px`, `${overflow.sw} > ${overflow.iw}`);
    await pg.locator("#top").scrollIntoViewIfNeeded();
    await pg.screenshot({ path: join(artifacts, `full-${width}.png`), fullPage: true });
    await ctx.close();
  }

  // ============ 5. Дисклеймеры и шрифты ============
  const { ctx: footCtx, pg: foot } = await newPage(browser, { width: 1440, height: 900 });
  await foot.goto(BASE_URL, { waitUntil: "domcontentloaded", timeout: 60000 });
  await foot.waitForSelector("h1", { timeout: 30000 });
  await foot.waitForTimeout(500);
  const bodyText = normalize(await foot.locator("body").innerText()).toLowerCase();
  for (const phrase of ["демонстрационные отзывы", "сайт является демонстрацией разработки", "правилам рекламы бад"]) {
    check(bodyText.includes(phrase), `текст-дисклеймер: «${phrase}» есть на странице`);
  }
  check(true, "дисклеймеры отзывов/подвала/БАД на месте");
  const fontReady = await foot.evaluate(() => {
    let manrope = false;
    let cormorant = false;
    for (const face of document.fonts) {
      const family = face.family.replace(/["']/g, "");
      if (face.status === "loaded" || face.status === "loading") {
        if (family.includes("Manrope")) manrope = true;
        if (family.includes("Cormorant")) cormorant = true;
      }
    }
    return manrope && cormorant;
  });
  check(fontReady, "локальные шрифты Manrope и Cormorant подключены");
  await footCtx.close();
} finally {
  await browser.close();
  server.close();
}

const realErrors = [...pageErrors].filter((e) => !e.includes("favicon") && !e.includes("net::ERR_ABORTED"));
if (realErrors.length) {
  errors.push("console/page errors: " + realErrors.slice(0, 5).join(" | "));
}

const failed = checks.filter((c) => !c.ok).length;
console.log("");
console.log(`Acceptance Build A: ${checks.length - failed}/${checks.length} проверок прошло`);
for (const c of checks) console.log(`  ${c.ok ? "PASS" : "FAIL"}  ${c.name}${c.detail && !c.ok ? "  [" + c.detail + "]" : ""}`);
if (errors.length) {
  console.log("\nОшибки:");
  for (const e of errors) console.log("  - " + e);
  process.exit(1);
}
console.log(`\nСкриншоты: tests/artifacts/build-a/ (${artifacts})`);
process.exit(0);