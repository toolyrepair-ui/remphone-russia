# Lead pipeline — надёжный контур заявок

Заявки сайта сначала сохраняются в Cloudflare D1, поэтому сон Render, таймаут
Telegram или сбой Queue больше не удерживает кнопку и не теряет контакт.

```
форма / 3D → Worker → D1 (accepted) → Queue → Render Lead API → Telegram
                                      └────→ Telegram fallback
                                retries → DLQ → cron requeue
```

## Статус выката — 22.08.2026

- [x] Render работает как **Web Service**: `https://remphone-bot.onrender.com`
- [x] Health Render: `/health` → `{"ok":true,"service":"remphone-lead-api"}`
- [x] D1 `remphone-leads`, Queue `remphone-leads`, DLQ и cron `*/5 * * * *`
- [x] Worker observability, `/health` и защищённый `/stats`
- [x] D1 migration применена remote; Worker задеплоен
- [x] Failure-injection: D1, duplicate, timeout, retry, DLQ, cron, PII-free stats
- [x] Контрольная prod-заявка: `accepted → delivered`, `delivery_via=lead_api`, 1 попытка
- [x] Render API хранит `notification_status` и повторяет только failed/pending уведомления
- [x] Обе формы считают `request-form-submit` только после `accepted`

Подробно: репозиторий бота → `DEPLOY.md`, `AUTOMATION.md`, `relay/README.md`.

## Контроль

- `GET https://rem-phone-relay.toolyrepair.workers.dev/health` — минимальный
  публичный статус без контактов.
- `GET /stats` с `Authorization: Bearer <LEAD_STATS_SECRET>` — только агрегаты
  `accepted/delivered/pending/failed`, периоды и oldest pending.
- Внутренний `/dashboard/` хранит `metrika_accepted` отдельно от фактического
  Worker pipeline. Второй счётчик и новые цели Метрики не создаются.
- Payload с PII очищается в D1 через 90 дней; строки и агрегаты остаются.

## Если сломано

1. Не плодить SEO-страницы в первую очередь — сначала починить доставку заявок.  
2. Проверить `config.js` → `relayUrl` = `https://rem-phone-relay.toolyrepair.workers.dev`  
3. Проверить `/health`, затем `/stats`: pending, failed и oldest pending.
4. Проверить Workers Logs, Queue/DLQ и Render logs.
5. Не удалять D1-записи вручную: cron вернёт зависшие заявки в Queue.

## Гарантии и пределы

HTTP `accepted` означает, что заявка уже записана в D1. Доставка в Telegram
асинхронна и может занять несколько минут при аварии внешних сервисов. Queue
делает ограниченные повторы и DLQ, D1 хранит источник истины, а cron продолжает
повторы даже после окончания срока хранения сообщения в Queue.
