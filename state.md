# STATE — Сайт «Спутник Фито» (Воркер-1)

## Ключевые факты
- Задача: эталонный фито-лендинг (Next.js + Tailwind, статик) + публикация на GitHub Pages — ВЫПОЛНЕНО.
- Репозиторий: github.com/Shamanchi/shamanchi-phyto (public, ветка main, commit 77e6e14, 61 файл).
- Деплой: https://shamanchi.github.io/shamanchi-phyto/ — HTTP 200, title и ассеты (favicon.svg, images/doctor.svg) 200.
- Pages: build_type=workflow, деплой через .github/workflows/deploy.yml (build + deploy успешны).

## Прогресс
- [x] npm install (next 15.5.25, CVE-2025-66478 закрыт) + npm run build (static export).
- [x] Приёмочный прогон headless Chrome: 26/26 PASS; скриншоты tests/artifacts/.
- [x] Исправления: favicon в metadata (нет 404 /favicon.ico); квиз-локаторы по #podbor; lowercased/flattened проверки текстов; шрифты по loaded face; overflow 360px (.doctor-halo::before на мобильных inset -6% 0 -10%; декор Founder right-2).
- [x] git init/commit, gh repo create Shamanchi/shamanchi-phyto --public, push, POST pages build_type=workflow.
- [x] Workflow run 34045122639: build 35s + deploy 10s — success.
- [x] Проверка https://shamanchi.github.io/shamanchi-phyto/ — HTTP 200 (title «Спутник Фито — сайт для фито-магазина и бренда БАД»).

## Следующий шаг
- Нет. Задача завершена. Отчёт >>>SWARM:REPORT отправлен.

---

# STATE — кросс-ссылка на orbit (Воркер-2)

## Ключевые факты
- Основной сайт студии Shamanchi/orbit: http://shamanchi.ru/ — HTTP 200 проверено; HTTPS отдаёт SSL-ошибку.
- Трогать только: components/Footer.jsx, README.md, lib/site.js (+ state.md). DemoBlock.jsx — параллельно правит другой воркер.

## Прогресс
- [x] lib/site.js: константа ORBIT_URL = "http://shamanchi.ru/"
- [x] components/Footer.jsx: заметная ссылка «Основной сайт Shamanchi →» в колонке контактов
- [x] README.md: адрес основного сайта и роль спутника рядом с шапкой/блоком «Деплой»
- [x] npm run build; ссылка в выгрузке кликабельна (headless Chrome), ведёт на http://shamanchi.ru/ — HTTP 200; регрессия 26/26 PASS
- [x] git commit (локально); push origin main — ждёт >>>SWARM:ASK

## Следующий шаг
- Отправить >>>SWARM:ASK на git push origin main, затем финальный отчёт.
