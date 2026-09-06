// Локальный предпросмотр статического экспорта с учётом basePath /shamanchi-phyto.
// Запуск: npm run preview  (после npm run build)
import { createServer } from "node:http";
import { existsSync, statSync, createReadStream, readFileSync } from "node:fs";
import { extname, join, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = join(process.cwd());
const BASE = "/shamanchi-phyto";
const PORT = Number(process.env.PORT || 4173);

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml",
  ".map": "application/json",
  ".ico": "image/x-icon",
};

export function startServer({ root = join(rootDir, "out"), port = PORT, base = BASE, quiet = false } = {}) {
  const server = createServer((req, res) => {
    const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
    let pathname = decodeURIComponent(url.pathname);
    if (pathname === base || pathname === `${base}/`) pathname = `${base}/index.html`;
    if (!pathname.startsWith(base + "/")) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Not found: страница доступна по адресу " + base + "/");
      return;
    }
    const rel = pathname.slice(base.length).replace(/^\//, "");
    const file = resolve(root, rel);
    if (!file.startsWith(resolve(root) + sep) && file !== resolve(root)) {
      res.writeHead(403);
      res.end("Forbidden");
      return;
    }
    let target = file;
    if (existsSync(target) && statSync(target).isDirectory()) {
      // GitHub Pages отдаёт /catalog/ -> /catalog/index.html; повторяем локально
      target = join(target, "index.html");
    } else if (!extname(target) && existsSync(target + ".html")) {
      target = target + ".html";
    }
    if (existsSync(target) && statSync(target).isFile()) {
      res.writeHead(200, { "Content-Type": MIME[extname(target).toLowerCase()] || "application/octet-stream" });
      createReadStream(target).pipe(res);
    } else {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("404: файл не найден");
    }
  });
  return new Promise((resolveStart) => {
    server.listen(port, "127.0.0.1", () => {
      const actual = server.address().port;
      if (!quiet) console.log(`Preview: http://127.0.0.1:${actual}${base}/`);
      resolveStart({ server, port: actual, base });
    });
  });
}

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1]);
if (isMain) {
  const outDir = join(rootDir, "out");
  if (!existsSync(join(outDir, "index.html"))) {
    console.error("Нет ./out/index.html — сначала выполните npm run build");
    process.exit(1);
  }
  startServer({ root: outDir });
}