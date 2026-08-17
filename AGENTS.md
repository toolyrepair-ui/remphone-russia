# AGENTS.md — REMPHONE (rem-phone.ru)

Порядок работы в каждом чате:

1. Прочитать `docs/cursor-project-memory.md` (техническая память: код и архитектура).
2. Если задача про контент, цены, УТП, клиентов или маркетинг — сначала прочитать `docs/business-memory/` (бизнес-память: что продаём и кому). Не заменяет Graphify.
3. Для структуры и связей — Graphify, не полный grep репозитория:
   - `graphify query "<вопрос>"`
   - `graphify path "<A>" "<B>"`
   - `graphify explain "<концепт>"`
   - обзор: `graphify-out/GRAPH_REPORT.md`, карта: `graphify-out/graph.json`
4. Только потом открывать конкретные исходники для правки.
5. Не сканировать весь проект без необходимости.

CLI Graphify (Windows): бинарник `C:\Users\PC\.local\bin\graphify.exe`.  
Не использовать `/graphify .` в PowerShell (это путь). Сборка: `graphify extract . --code-only --no-label`, инкремент: `graphify update .`.

После правок кода: `graphify update .`.  
После смены архитектуры: обновить `docs/cursor-project-memory.md`.  
После смены цен, УТП или маркетинга: обновить `docs/business-memory/`.

Жёсткие ограничения: три города (Хабаровск, КнА, Владивосток); не менять `config.js` `relayUrl`; не плодить thin URL модель×город; не выдумывать адреса мастерских.

SEO-страницы: скилл `.cursor/skills/content-writer/` («автор статей»). Не коммитить черновик без одобрения.

Черновики ответов клиентам — **не скилл Cursor**, а бот + Worker `/draft` (`remphone-bot`). AI клиенту не пишет. Живой режим: `REPLY_DRAFT_ENABLED=1` на Render после теста.

Расписание: GitHub Action `Weekly content-writer` — воскресенье 10:00 Хабаровск, если вс не сработал — понедельник. Нужен секрет `CURSOR_API_KEY`. Черновик приходит pull request, не сразу на сайт.
