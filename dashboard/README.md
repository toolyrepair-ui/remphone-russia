# Dashboard — внутренний контроль

Страница `/dashboard/` закрыта от поиска (`noindex`, `robots.txt` Disallow). Не пароль на JS.

Собирает `dashboard/collect.mjs` → `dashboard/data.json`. Live-проверка сайта пишет `dashboard/health.json`.

## Расписание

GitHub Action `dashboard.yml`: **08:30 и 16:30 Хабаровск** (cron `30 22,6 * * *` UTC) и ручной `workflow_dispatch`.

Порядок в джобе:

1. `node seo/health-check.mjs --live` (ошибки live не валят джоб)
2. `node dashboard/collect.mjs` (Метрика / Вебмастер / опционально заявки бота)
3. коммит `dashboard/data.json` и `dashboard/health.json`
4. FTP только папки `dashboard/` на REG.RU — иначе хостинг не узнает о коммите: push с `GITHUB_TOKEN` **не** запускает `deploy-reg-ru.yml`

CI на пуше HTML — `.github/workflows/seo-health.yml` (локальный health, без коммита JSON).

## Что на экране

| Блок | Откуда | Честно |
|------|--------|--------|
| Визиты | Метрика `111453492` | без токена — прошлые цифры |
| Заявки | цель `request-form-submit` (595078292) или `LEAD_STATS_URL` | не смешивать с кликами |
| Конверсия | заявки / визиты за 7 дней | только подтверждённые заявки |
| Клики | цели `make-call`, `whatsapp`, `telegram`, `request-form-open` | если API молчит — «—», не ноль |
| Индекс Яндекса | Вебмастер `searchable_pages_count` | Google точного API нет |
| Health | `health.json` | live URL из `seo/pages.json` + sitemap |

Цели Метрики уже есть. Новые имена (`contact-email-click` и т.п.) не создавать. Email в Метрике цели нет.

Заявки из бота / звонков появятся, когда будет `LEAD_STATS_URL`. До тех пор поле заявок = только отправка формы.

## Токены

**GitHub → Secrets:**

- `YANDEX_METRIKA_TOKEN` — визиты и цели (`metrika:read`)
- `YANDEX_WEBMASTER_TOKEN` — индекс (`webmaster:hostinfo` + `webmaster:verify`)
- `FTP_SERVER` / `FTP_USERNAME` / `FTP_PASSWORD` / `FTP_PATH` — те же, что для выгрузки сайта (`FTP_PATH` со слэшем, на ISPmanager: `www/rem-phone.ru/`)
- опционально `LEAD_STATS_URL`, `LEAD_API_SECRET`

OAuth: https://oauth.yandex.ru/client/new — приложение для API, затем

```
https://oauth.yandex.ru/authorize?response_type=token&client_id=СЮДА_CLIENT_ID
```

Счётчик **111453492**. Второй не создавать. Хост Вебмастера: `https:rem-phone.ru:443`.

**Локально:** `.env.dashboard` из `.env.dashboard.example` (не коммитить), затем:

```powershell
node seo/health-check.mjs --live
node dashboard/collect.mjs
```

Открывать `dashboard/index.html` через локальный сервер, не `file://`.
