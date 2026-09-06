# STATE — Сайт «Спутник Фито» (Воркер-1)

## Ключевые факты
- Задача: эталонный фито-лендинг (Next.js + Tailwind, статик) + публикация на GitHub Pages.
- ТЗ: «Промты правки полезное/spunik_fito_md_dlya_codex.md». Проект: shamanchi-phyto/.
- Деплой: https://shamanchi.github.io/shamanchi-phyto/ (basePath /shamanchi-phyto, workflow Pages).
- gh залогинен как Shamanchi (repo+workflow). Контакты студии: @PavelYrevichh, lietman46@mail.com.

## Прогресс
- [x] Сайт написан: 59 файлов (app, components, data, lib, public, конфиги, скрипты, тесты).
- [x] next обновлён 15.5.4 -> 15.5.25 (CVE-2025-66478). npm install ok, package-lock.json создан.
- [x] npm run build (static export) — успешно.
- [x] Приёмочный прогон headless Chrome: 26/26 PASS (квиз, корзина, витрина, демо-форма, дисклеймеры, адаптив 768/360, шрифты). Скриншоты в tests/artifacts/.
- [x] Исправления по итогам прогона: фавиконка в metadata (SITE_PATH+/favicon.svg, убран 404 /favicon.ico); квиз-локаторы в тесте (подсказка в accessible name); карточка/подвал/БАД-текст — проверка по lowercased/flattened тексту; шрифты — проверка loaded face; overflow 360px — .doctor-halo::before на мобильных (inset -6% 0 -10%), декор Founder right-2.
- [x] state.md обновлён.

## Следующий шаг
- [ ] git init -b main + commit; gh repo create Shamanchi/shamanchi-phyto --public --source . --remote origin --push (разрешено оркестратором).
- [ ] Включить Pages: gh api -X PUT repos/Shamanchi/shamanchi-phyto/pages -f build_type=workflow.
- [ ] Проверить https://shamanchi.github.io/shamanchi-phyto/ (HTTP 200) после прогона workflow.
