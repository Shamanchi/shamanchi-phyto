// Скачивает самодостаточные woff2 (Cormorant + Manrope, latin + cyrillic, по весу) и пишет app/fonts.css.
// Запуск: node scripts/fetch-assets.mjs
import { mkdirSync, writeFileSync, readdirSync, unlinkSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const fontsDir = join(rootDir, "app", "fonts");
mkdirSync(fontsDir, { recursive: true });
for (const f of readdirSync(fontsDir)) {
  if (f.endsWith(".woff2")) unlinkSync(join(fontsDir, f));
}

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36";
const JOBS = [
  ...["500", "600", "700"].map((w) => ["Cormorant", w]),
  ...["400", "500", "600", "700", "800"].map((w) => ["Manrope", w]),
];
const KEEP = new Set(["cyrillic", "latin"]);

async function main() {
  const outFaces = [];
  for (const [family, weight] of JOBS) {
    const url = `https://fonts.googleapis.com/css2?family=${family}:wght@${weight}&display=swap`;
    const res = await fetch(url, { headers: { "User-Agent": UA } });
    if (!res.ok) throw new Error(`Fonts request failed ${res.status} for ${family} ${weight}`);
    const css = await res.text();

    let subset = "";
    let inFace = false;
    let blockLines = [];
    for (const raw of css.split("\n")) {
      const line = raw.trim();
      if (!line) continue;
      const subsetMatch = line.match(/^\/\*\s*([\w-]+)\s*\*\//);
      if (subsetMatch) {
        subset = subsetMatch[1];
        continue;
      }
      if (line === "@font-face {") {
        inFace = true;
        blockLines = ["@font-face {"];
        continue;
      }
      if (inFace) {
        blockLines.push(line);
        if (line === "}") {
          inFace = false;
          if (KEEP.has(subset)) {
            const blockText = blockLines.join("\n");
            const famMatch = blockText.match(/font-family:\s*'([^']+)'/);
            const styleMatch = blockText.match(/font-style:\s*(\w+)/);
            const urlMatch = blockText.match(/url\((https:\/\/fonts\.gstatic\.com\/[^)]+)\)/);
            if (famMatch && urlMatch) {
              const fileName = `${family}-${subset}-${weight}.woff2`;
              const fileRes = await fetch(urlMatch[1]);
              if (!fileRes.ok) throw new Error(`Font file failed ${fileRes.status}: ${urlMatch[1]}`);
              const buf = Buffer.from(await fileRes.arrayBuffer());
              writeFileSync(join(fontsDir, fileName), buf);
              outFaces.push(
                [
                  "@font-face {",
                  `  font-family: "${family}";`,
                  `  font-style: ${styleMatch ? styleMatch[1] : "normal"};`,
                  `  font-weight: ${weight};`,
                  "  font-display: swap;",
                  `  src: url("./fonts/${fileName}") format("woff2");`,
                  "}",
                ].join("\n")
              );
              console.log("downloaded", fileName, buf.length, "bytes");
            }
          }
        }
      }
    }
  }
  writeFileSync(join(rootDir, "app", "fonts.css"), outFaces.join("\n\n") + "\n", "utf8");
  console.log("fonts.css written, faces:", outFaces.length);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});