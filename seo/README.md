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
| `seo/AGENT_RITUAL.md` | Еженедельный ритуал агента |
| `seo/LEAD_PIPELINE.md` | Чеклист выката заявок сайт→бот |
| `seo/MONTHLY_AUDIT.md` | Ежемесячный аудит |
| `seo/CHECKLIST.md` | Чеклист релиза страницы |
| `seo/SEMANTICS.md` | Кластеры 3 городов и приоритет URL |
| `seo/WEBMASTER_METRICA.md` | Вебмастер / GSC / Метрика |
| `seo/YANDEX_BUSINESS.md` | Карточка Яндекс Бизнес (зона = 3 города) |
| `seo/WEEKLY_REPORT.md` | Шаблон недельного отчёта |
| `seo/WORDSTAT.md` | Wordstat API: ключи и запуск сбора частот |
| `seo/pages.json` | Источник правды для sitemap |

## Автозапуск недели / месяца

```bash
node seo/weekly-run.mjs
node seo/weekly-run.mjs --live
node seo/audit-monthly.mjs
node seo/audit-monthly.mjs --fix-noindex
```
