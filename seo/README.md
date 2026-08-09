# SEO automation — rem-phone.ru

## Команды

```bash
# Пересобрать sitemap.xml из seo/pages.json (только существующие файлы)
node seo/generate-sitemap.mjs

# Локальная проверка title/description/canonical/ссылок
node seo/health-check.mjs

# + проверка живых URL на проде
node seo/health-check.mjs --live

# Черновик посадочной (не публикует автоматически)
node seo/generate-landing.mjs --type city --slug bikin --name "Бикин"
node seo/generate-landing.mjs --type service --slug speaker --name "Ремонт динамика" --price "от 800₽"
node seo/generate-landing.mjs --type brand --slug realme --name "Realme"
```

## CI

Workflow: `.github/workflows/seo-health.yml`

- на push пересобирает sitemap и падает, если файл не закоммичен
- раз в сутки (06:00 UTC) гоняет live health-check

## Документы

| Файл | Назначение |
|------|------------|
| `seo/CHECKLIST.md` | Чеклист релиза страницы |
| `seo/SEMANTICS.md` | Кластеры и приоритет URL |
| `seo/WEBMASTER_METRICA.md` | Вебмастер / GSC / Метрика |
| `seo/YANDEX_BUSINESS.md` | Карточка Яндекс Бизнес |
| `seo/WEEKLY_REPORT.md` | Шаблон недельного отчёта |
| `seo/pages.json` | Источник правды для sitemap |
