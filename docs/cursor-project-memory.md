# Память проекта REMPHONE (Cursor)

Декларативная память для агента. Структурная карта — `graphify-out/` (Graphify).  
**Не сканировать весь репозиторий** в каждом чате: сначала этот файл и граф, потом точечные исходники.

Сайт: https://rem-phone.ru/  
Репозиторий: `C:\Users\PC\Desktop\remphone-russia`  
Бот (отдельный репо): `C:\Users\PC\Desktop\remphone-bot` → GitHub `toolyrepair-ui/remphone-bot`, Render https://remphone-bot.onrender.com

---

## Архитектура

Статический HTML/CSS/JS агрегатор заявок на ремонт телефонов. Бэкенда в этом репо нет.

Поток заявки:

```
форма #repair-flow (script.js) → POST JSON на Cloudflare Worker (config.js relayUrl)
  → Lead API Telegram-бота → /leads владельцу
```

Пока Worker недоступен — fallback в Telegram (без SQLite). Токен бота **не** хранится на сайте.

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
| `data/` | `brands.json`, `problems.json`, `contacts.json` |
| `docs/` | Память агента, MCP, SEO-автоматизация |
| `docs/business-memory/` | Бизнес-память: продукт, цены, клиенты, маркетинг |
| `dashboard/` | Внутренний контроль (noindex, не в sitemap). Сбор: `node dashboard/collect.mjs`. Визиты — Метрика; `index.yandex_indexed` — Вебмастер `searchable_pages_count` |
| `graphify-out/` | Knowledge graph — не удалять |
| `yandex-biz-photos/` | Служебные фото Яндекс Бизнеса, не логика сайта |

---

## Потоки данных

1. **Заявка с сайта** — `#flowRepairForm` / `#repair-flow` → `script.js` `sendToRelay()` → `relayUrl`.
2. **Заявка из бота** — `@REMPHONE_RUSSIA_Bot` → та же лента `/leads`.
3. **Город** — `?city=` / `city_id` (`khabarovsk` \| `komsomolsk` \| `vladivostok`); алиас `komsomolsk-na-amure` → `komsomolsk`.
4. **Аналитика** — `analytics.js`: Метрика `111453492`, GA `G-53F13EFHZQ`. Цели: `request-form-submit`, `request-form-open`, `make-call`, `whatsapp`, `telegram`.
5. **SEO-контур** — `seo/pages.json` → `node seo/generate-sitemap.mjs` → `sitemap.xml`. Проверка: `node seo/health-check.mjs`.
6. **Шапка/подвал** — `site-chrome.js` на внутренних страницах (`data-base="../"` в подпапках).

---

## API и интеграции

| Система | Значение | Правило |
|---------|----------|---------|
| Cloudflare Worker | `https://rem-phone-relay.toolyrepair.workers.dev` | **Не менять** URL |
| Telegram-бот | `@REMPHONE_RUSSIA_Bot` | Репо `remphone-bot` |
| Телефон / WhatsApp | `+79144111730` | Единый номер |
| Email | `toolyrepair@gmail.com` | |
| Яндекс.Метрика | `111453492` | Не плодить второй счётчик |
| Яндекс.Вебмастер | хост `https:rem-phone.ru:443` | Дашборд: `YANDEX_WEBMASTER_TOKEN`, поле `searchable_pages_count` |
| Google Analytics | `G-53F13EFHZQ` (свойство Rem-phone) | Не создавать второе GA-свойство |
| Яндекс Бизнес | компания `114553486842` | Онлайн, без адреса на Картах |
| Wordstat | `seo/wordstat_fetch.py` | См. `seo/WORDSTAT.md` |

Lead pipeline подробно: `seo/LEAD_PIPELINE.md`.

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
- Плавающая панель: `.sticky-mobile-bar`.
- Сравнение дисплеев: `displays-compare.js` + `displays-config.json`.
- 3D-просмотр: `3d-viewer-iphone15.html` (не ломать GLB-пути).
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
