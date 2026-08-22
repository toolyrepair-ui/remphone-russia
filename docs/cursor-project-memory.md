# Память проекта REMPHONE (Cursor)

Декларативная память для агента. Структурная карта — `graphify-out/` (Graphify).  
**Не сканировать весь репозиторий** в каждом чате: сначала этот файл и граф, потом точечные исходники.

Сайт: https://rem-phone.ru/  
Репозиторий: `C:\Users\PC\Desktop\remphone-russia`  
Бот (отдельный репо): `C:\Users\PC\Desktop\remphone-bot` → GitHub `toolyrepair-ui/remphone-bot`, Render https://remphone-bot.onrender.com

Раздача: виртуальный хостинг REG.RU Host-0 (Apache за nginx, ISPmanager, IP `31.31.196.16`, корень `www/rem-phone.ru/`). DNS зона ns1/ns2.reg.ru: `A @` и `A www` → `31.31.196.16`. GitHub Pages не отключать (резерв). Выгрузка: `.github/workflows/deploy-reg-ru.yml` (`FTP_PATH`=`www/rem-phone.ru/`). HTTPS: Let’s Encrypt `rem-phone.ru_le1` (до 2026-11-15), имена `rem-phone.ru` и `www.rem-phone.ru`. HTTP→HTTPS в `.htaccess` только через `X-Forwarded-Proto =http` (не `%{HTTPS} off` — петля за nginx). www→apex на `https://`. Dotfiles (в т.ч. `.ftp-deploy-sync-state.json`) закрыты. Статика css/js/картинки/woff2 — кеш месяц; html/json без кеша. Не публиковать на хостинг: `docs/`, `seo/` (внутренние данные), `.omniroute-src/`.

Дашборд: `/dashboard/` (noindex). Крон `dashboard.yml` — 08:30 и 16:30 Хабаровск: live `seo/health-check.mjs --live` → `dashboard/health.json`, сбор Метрики → `dashboard/data.json`, коммит, FTP только папки `dashboard/` на REG.RU. Push с `GITHUB_TOKEN` по-прежнему не запускает `deploy-reg-ru.yml`, поэтому FTP в том же джобе обязателен для живой страницы. Accepted Метрики хранится отдельно в `metrika_accepted`; защищённый Worker `/stats` (`LEAD_STATS_URL`) добавляет агрегаты доставки в `pipeline` (accepted/delivered/pending/failed, без PII), не подменяя Метрику. Клики звонка/WhatsApp/Telegram — отдельные цели, не конверсия. `seo-health.yml` — только CI на пуше HTML (локальный check, без коммита JSON).

Скиллы агента: `.cursor/skills/` — свои `content-writer`, `direct-service-voice`, `yandex-local`; каталог: `find-skills`, `web-design-guidelines` (Vercel), `frontend-design` (Anthropic), `systematic-debugging` (obra), `workers-best-practices` (Cloudflare; **не менять** `config.js` `relayUrl`), `accessibility` (Addy Osmani). Поиск новых: `npx skills find "…"`. Next.js и programmatic-SEO не ставить. Бот — `remphone-bot` + Context7 (aiogram 3.x), ответы клиенту не из Cursor.

---

## Архитектура

Статический HTML/CSS/JS агрегатор заявок на ремонт телефонов. Бэкенда в этом репо нет.

Поток заявки:

```
форма #repair-flow / 3D → POST JSON на Cloudflare Worker (config.js relayUrl)
  → D1 durable inbox (`accepted`) → Queue
      → Lead API Telegram-бота → SQLite / `/leads` владельцу
      ↳ Telegram fallback, если API не доставил уведомление
      ↳ retries → DLQ; cron раз в 5 минут возвращает зависшие D1-записи
      ↳ опционально: черновик ответа (Workers AI), только владельцу
```

`accepted` означает, что контакт уже сохранён в D1; Render/Telegram больше не
держат ответ формы. `client_request_id` opaque и хешируется на edge. PII в D1
очищается через 90 дней. `/health` публичный и минимальный, `/stats` защищён
отдельным `LEAD_STATS_SECRET` и возвращает только агрегаты. Токен бота **не** хранится на сайте.

Контакты и счётчики — единый источник: `config.js` (`window.REMPHONE_CONFIG`). Дубли в `site-chrome.js` и `data/contacts.json` должны совпадать.

---

## Главные директории

| Путь | Назначение |
|------|------------|
| `/` (`index.html`, `script.js`, `styles.css`, `config.js`, `analytics.js`, `site-chrome.js`) | Главная, форма заявки, шапка/подвал, Метрика/GA |
| `khabarovsk/`, `komsomolsk-na-amure/`, `vladivostok/` | Канонические гео-URL трёх городов |
| `cities/` | Хабы и услуга×город (Хабаровск); часть файлов — редиректы/вторичные |
| `services/` | Услуги без привязки к городу (screen, battery, water, charge, apps, body, …) |
| `brands/` | Бренды + `*-screen.html` / `*-battery.html` |
| `blog/` | Редкие посты; не плодить без индекса money-URL |
| `seo/` | Генераторы, health-check, семантика, отчёты |
| `data/` | `brands.json`, `problems.json`, `contacts.json`, публичный прайс `site-pricebook.json`, каталог моделей `repair-models.json` |
| `docs/` | Память агента, MCP, SEO-автоматизация |
| `docs/business-memory/` | Бизнес-память: продукт, цены, клиенты, маркетинг. Архив Perplexity: `docs/business-memory/perplexity-archive/` (ТЗ, сессии, Moba) — не на сайт |
| `dashboard/` | Внутренний контроль (noindex, не в sitemap). Сбор: `node dashboard/collect.mjs`. Health: `dashboard/health.json`. Визиты — Метрика; клики контактов отдельно от заявок; `index.yandex_indexed` — Вебмастер `searchable_pages_count` |
| `graphify-out/` | Knowledge graph — не удалять |
| `yandex-biz-photos/` | Служебные фото Яндекс Бизнеса, не логика сайта |
| `.cursor/skills/` | Свои: content-writer, direct-service-voice, yandex-local. Каталог: find-skills, web-design-guidelines, frontend-design, systematic-debugging, workers-best-practices, accessibility |

---

## Потоки данных

1. **Заявка с сайта** — `#flowRepairForm` / `#repair-flow` → `script.js` `sendToRelay()` → `relayUrl`.
2. **Заявка из бота** — `@REMPHONE_RUSSIA_Bot` → та же лента `/leads`.
3. **Город** — приоритет: `?city=` / `city_id` → выбор текущей сессии → referrer city-страницы → IP-геолокация `ipwho.is` → Хабаровск. Автоопределение выбирает только один из трёх живых городов: точное совпадение имени или ближайший в радиусе 80 км; результат кэшируется в браузере на 24 часа. Ручной выбор и URL всегда сильнее ответа геосервиса. Алиас `komsomolsk-na-amure` → `komsomolsk`.
4. **Аналитика** — `analytics.js`: Метрика `111453492`, GA `G-53F13EFHZQ`. Цели: `request-form-submit`, `request-form-open`, `make-call`, `whatsapp`, `telegram`. `request-form-open` срабатывает при переходе на шаг 3, а не на любой клик внутри квиза.
5. **SEO-контур** — `seo/pages.json` → `node seo/generate-sitemap.mjs` → `sitemap.xml`. Проверка: `node seo/health-check.mjs` (локально) и `--live` (прод, пишет `dashboard/health.json`).
6. **Шапка/подвал** — `site-chrome.js` на внутренних страницах (`data-base="../"` в подпапках).
7. **Ориентир цен по моделям** — статические таблицы в HTML из мастер-прайса. Каталог моделей (имена, без цен) — `repair-models.js` + чипы на бренд-страницах, сборка `python scripts/apply_repair_models.py`. Полный внутренний прайс (`full-phone-pricebook.json`) на хостинг не выкладывать. Не подключать live-fetch `site-pricebook.json` в браузере.

---

## API и интеграции

| Система | Значение | Правило |
|---------|----------|---------|
| Cloudflare Worker | `https://rem-phone-relay.toolyrepair.workers.dev` | **Не менять** URL. D1 `remphone-leads` + Queue/DLQ + cron; `GET /health`, защищённый `GET /stats`; `POST /draft` — черновик владельцу. Живой режим: `REPLY_DRAFT_ENABLED=1` (AI клиенту не пишет) |
| Telegram-бот | `@REMPHONE_RUSSIA_Bot` | Репо `remphone-bot` |
| Телефон / WhatsApp | `+79144111730` | Единый номер |
| Email | `toolyrepair@gmail.com` | |
| Яндекс.Метрика | `111453492` | Не плодить второй счётчик |
| Яндекс.Вебмастер | хост `https:rem-phone.ru:443` | Дашборд: `YANDEX_WEBMASTER_TOKEN`, поле `searchable_pages_count` |
| Google Analytics | `G-53F13EFHZQ` (свойство Rem-phone) | Не создавать второе GA-свойство |
| Яндекс Бизнес | компания `114553486842` | Онлайн, без адреса на Картах |
| Wordstat | `seo/wordstat_fetch.py` | См. `seo/WORDSTAT.md` |

Lead pipeline подробно: `seo/LEAD_PIPELINE.md`.

Telegram **ADMIN_ID** (куда relay/бот шлёт заявки): `7553859784`. Cloudflare-аккаунт Worker: `toolyrepair@gmail.com`.  
Проект Perplexity (глаза/проверка, не код): см. `docs/business-memory/perplexity-index.md`. Отчёт Perplexity от 10.08.2026 местами устарел: живая Метрика **111453492** (не 110956593); прод — REG.RU, не «только GitHub Pages».

---

## Naming

- Города в URL: `khabarovsk`, `komsomolsk-na-amure`, `vladivostok`.
- `city_id` в формах/JS: `khabarovsk`, `komsomolsk`, `vladivostok`.
- Услуги: `screen`, `battery`, `water`, `charge`, `not-on`, `apps`, `body`, `cleaning`, `camera`.
- Бренды: `iphone`, `samsung`, `xiaomi`, `huawei`, `honor`, `other`.
- Конфиг браузера: `window.REMPHONE_CONFIG`, цель Метрики: `window.REMPHONE_REACH`.
- Файлы SEO-генераторов: `seo/*.mjs` (Node), не TypeScript.

---

## Правила UI

- Единая шапка/подвал через `site-chrome.js`, не копировать разметку в каждую HTML-страницу без нужды.
- CTA: телефон, WhatsApp, Telegram, якорь `#repair-flow`.
- Плавающая панель: `.mobile-contact-bar` из `site-chrome.js` — два действия: «Позвонить» и «Описать поломку». На главной скрыта, пока виден первый экран; на внутренних страницах появляется после прокрутки. Telegram и WhatsApp остаются в меню, футере и экране успеха. Бургер открывает `.nav.active`, закрывается по пункту меню и тапу снаружи.
- Сравнение дисплеев: `displays-compare.js` + `displays-config.json`.
- Прайс на сайте — **статика** в HTML. Локальный master: `data/full-phone-pricebook.*`. Публичные «от» для брендов: `data/site-price-orientir.json` → `python scripts/apply_site_price_orientir.py`. Каталог моделей из `data/site-pricebook.json` → `python scripts/apply_repair_models.py` (чипы + `repair-models.js`, без live-fetch прайса). Android-расчёт из медианы iPhone на сайт не выносить без решения владельца.
- Универсальный 3D-калькулятор телефона: `3d-viewer-iphone15.html` (алиас `iphone-repair-calculator.html`). В сайт интегрирован отдельным промоблоком на главной, ссылкой в общей навигации/подвале `site-chrome.js` и CTA на `brands/iphone-screen.html`; iframe не используется. Текущий `assets/models/iphone15-pro-max.glb` остаётся временной демонстрационной моделью, но бренд и модель в UI не называются. Подбор модели и загрузка клиентского прайса удалены: после заявки мастер уточняет модель и стоимость. Дерево проблем: `iphone-calculator-catalog.js`; правила: `docs/IPHONE_CALCULATOR_PROBLEM_ANIMATIONS_TZ.md`, `docs/IPHONE_CALCULATOR_ANIMATION_CARDS_TZ.md`, `docs/IPHONE_CALCULATOR_REALISM_V2_TZ.md`. Все дочерние FX работают в **локальных координатах масштабированного `phone`**; `glassOut` задаёт наружную сторону OLED, `backOut` — крышки. Видимые полные zone rings запрещены, `zoneLayout()` хранит только невидимые якоря. Щель OLED движется по `glassOut`; крышка использует depth-tested canvas-трещины и angle-dependent highlights; `body:bent` деформирует вершины составных mesh в общей phone-space системе. Камера: wall-clock переход не зависит от throttling вкладки; `REAR_YAW ≈ 0.48`. На мобильном viewer остаётся sticky над списком симптомов; выбранный дефект дублируется подписью на сцене и пояснением рядом с кнопками. Для `battery-heat:swollen` и `body:screen-gap` используется боковой preset `edgeGap`, чтобы приподнятый экран и щель были видны.
- Стили: `styles.css` + `animations.css`. Не внедрять тяжёлый фреймворк.

---

## Правила SEO / страниц / калькулятора / брендов

Живые города **только три**: Хабаровск, Комсомольск-на-Амуре, Владивосток.

Можно:

- обновлять `/services/{service}.html`, `/brands/{brand}-battery.html`, `*-screen.html`;
- обновлять city-страницы battery/screen/water/charge/not-on;
- 1 blog-пост, если money-URL уже в индексе.

Нельзя:

- thin URL вида модель × город (`remont-iphone-13-khabarovsk.html`);
- четвёртый город как канонический гео-кластер;
- выдумывать адреса партнёрских мастерских;
- H1 сразу с тремя городами на city-URL (один H1 = один город);
- массовый автоген страниц.

Новая страница: чеклист `seo/CHECKLIST.md` (title, description, canonical, OG, JSON-LD, CTA, `pages.json`, sitemap, health-check).

Авто-SEO по заявкам: `docs/CURSOR_AUTOMATION_SEO.md`.

Страницы вроде `cities/moscow.html`, `spb.html`, `kazan.html` — не расширять как новые рынки.

---

## Что нельзя ломать

1. `config.js` → `relayUrl` (Cloudflare Worker).
2. Доставку заявок: `script.js` `sendToRelay` / `#flowRepairForm`.
3. Три канонических гео-URL и редиректы `/cities/khabarovsk.html` → `/khabarovsk/`.
4. Счётчики Метрики и GA (не подменять ID, не плодить свойства).
5. Контакты: телефон, WhatsApp, Telegram-бот, email.
6. `robots.txt` / `sitemap.xml` без сверки с `seo/pages.json`.
7. Локальный автозапуск бота на ПК владельца (это не этот репо).

---

## Зоны риска

- В `script.js` рядом с живой формой остался старый `submitForm()` с симуляцией (`#repairForm`) — не путать с `#flowRepairForm`.
- JSON (`data/*.json`, `seo/pages.json`) Graphify не разобрал в узлы — смотреть файлы напрямую.
- HTML-страницы в граф не попали (`--code-only`): карта HTML — этот файл + `seo/SEMANTICS.md` + `seo/pages.json`.
- Graphify CLI: `C:\Users\PC\.local\bin\graphify.exe` (пакет `graphifyy`). В PowerShell не писать `/graphify .` — слэш это путь. Нужно: `graphify extract .` / `graphify update .`.
- `graphify-out/` обновляется хуками post-commit / post-checkout.

---

## Регламент обновления памяти

После **архитектурных** изменений — править этот файл.  
После **структуры** репо (новые модули, папки, входные точки) — пересобрать граф:

```powershell
$env:PATH = "C:\Users\PC\.local\bin;$env:PATH"
graphify update .
# полный пересбор:
graphify extract . --code-only --no-label
graphify cluster-only . --no-label
```

Хук уже стоит: `graphify hook install` (post-commit, post-checkout).

---

## Сценарий чата

**До задачи:** 1) этот файл → 2) `graphify-out/GRAPH_REPORT.md` / `graphify query` → 3) только нужные исходники.  
**После задачи:** обновить память и/или граф; кратко сказать, что и где изменилось.
