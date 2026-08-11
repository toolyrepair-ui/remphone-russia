# Ежемесячный SEO-аудит

Запускать раз в месяц (или `node seo/audit-monthly.mjs`).

## Автопроверка

```bash
node seo/audit-monthly.mjs
node seo/audit-monthly.mjs --fix-noindex
```

- Off-geo города (Москва, СПб, …) должны иметь `noindex, follow`
- Список страниц без canonical — закрывать постепенно (blog в приоритете низкий)

## Wordstat

**Предпочтительно API** (см. [`WORDSTAT.md`](WORDSTAT.md)):

```bash
python seo/wordstat_fetch.py
```

Отчёт: `seo/reports/wordstat-YYYY-MM-DD.md` → сверить с [`SEMANTICS.md`](SEMANTICS.md).

**Вручную** (если нет ключа):

1. Регион: Хабаровский край / Приморский край на https://wordstat.yandex.ru  
2. Сверить с [`SEMANTICS.md`](SEMANTICS.md)  
3. Обновить бэклог: убрать нули, поднять растущие  
4. Короткая пометка в `seo/reports/YYYY-MM-monthly.md`

## Яндекс Бизнес

Сверить телефон / сайт / зону выезда с [`YANDEX_BUSINESS.md`](YANDEX_BUSINESS.md).
