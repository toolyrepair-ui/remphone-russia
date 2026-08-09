# Lead pipeline — блокер нововведений

Заявки сайт → Cloudflare Worker → Lead API бота → `/leads` у владельца.

## Статус выката (отметить вручную)

- [ ] Render: бот как **Web Service** (не Background Worker)
- [ ] Env: `TELEGRAM_TOKEN`, `ADMIN_ID=7553859784`, `LEAD_API_SECRET`, `METRIKA_COUNTER_ID=110956593`
- [ ] Health: `GET https://<bot-host>/health` → `{"ok":true}`
- [ ] Worker secrets: `LEAD_API_URL`, `LEAD_API_SECRET`, `TELEGRAM_TOKEN`, `ADMIN_CHAT_ID`
- [ ] Worker задеплоен из `remphone-bot/relay/`
- [ ] Тест: форма rem-phone.ru → заявка с источником «Сайт» в Telegram
- [ ] Тест: заявка из @REMPHONE_RUSSIA_Bot → та же лента `/leads`

Подробно: репозиторий бота → `DEPLOY.md`, `AUTOMATION.md`, `relay/README.md`.

## Если сломано

1. Не плодить SEO-страницы в первую очередь — сначала починить доставку заявок.  
2. Проверить `config.js` → `relayUrl` = `https://rem-phone-relay.toolyrepair.workers.dev`  
3. Логи Worker / Render.  
4. Пока API недоступен, Worker шлёт fallback в Telegram (без записи в SQLite).

## Команда владельцу

Когда Web Service поднят, пришлите агенту публичный URL бота — пропишем/проверим `LEAD_API_URL` в инструкции и прогоним smoke-тест.
