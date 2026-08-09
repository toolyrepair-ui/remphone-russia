# SEO checklist — новая страница

Перед коммитом / деплоем:

1. [ ] Уникальные `<title>` и `meta description` (под запрос + Хабаровск/город)
2. [ ] `link rel="canonical"` на финальный URL `https://rem-phone.ru/...`
3. [ ] Open Graph: `og:title`, `og:description`, `og:url`
4. [ ] JSON-LD при необходимости: BreadcrumbList, FAQPage, Service/LocalBusiness
5. [ ] Внутренняя ссылка с родственного раздела (services / cities / brands / главная)
6. [ ] CTA: телефон / WhatsApp / Telegram / форма
7. [ ] Добавить URL в `seo/pages.json`
8. [ ] `node seo/generate-sitemap.mjs`
9. [ ] `node seo/health-check.mjs` без ошибок
10. [ ] После деплоя — «Переобход» URL в Яндекс.Вебмастере (по желанию)
