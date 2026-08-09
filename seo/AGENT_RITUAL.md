# Ритуал агента — еженедельное развитие rem-phone.ru

Запускать, когда владелец пишет «продолжай SEO / улучшай сайт» или по понедельникам.

## Порядок (строго)

1. `node seo/weekly-run.mjs` — health-check + каркас отчёта в `seo/reports/`
2. Прочитать последний отчёт и [`SEMANTICS.md`](SEMANTICS.md)
3. Сделать **одну** из веток:
   - SEO: 1–2 URL из бэклога SEMANTICS
   - Сайт: одно конверсионное улучшение (Метрика)
   - Заявки: только если сломан pipeline (см. [`LEAD_PIPELINE.md`](LEAD_PIPELINE.md))
4. `node seo/health-check.mjs` — без blocking errors
5. `node seo/generate-sitemap.mjs` если менялись страницы
6. Push в `main`
7. Короткий отчёт владельцу: URL + «переобход в Вебмастере»

## Команды

```bash
node seo/weekly-run.mjs
node seo/weekly-run.mjs --live
node seo/audit-monthly.mjs
```

## Definition of Done недели

- [ ] health-check OK  
- [ ] отчёт в `seo/reports/YYYY-MM-DD.md`  
- [ ] 1–2 посадочные **или** 1 конверсионный фикс  
- [ ] SEMANTICS обновлён  
- [ ] владельцу сказано, что проверить вручную  
