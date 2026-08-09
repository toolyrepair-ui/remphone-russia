# Вебмастера и Метрика — rem-phone.ru

Файлы подтверждения уже в корне репозитория:

- Яндекс: `yandex_93ed52511661d246.html`
- Google: `google1c0f82854377489e.html`

## Яндекс.Вебмастер

1. Откройте https://webmaster.yandex.ru → сайт `https://rem-phone.ru`
2. Индексирование → Файлы Sitemap → добавьте `https://rem-phone.ru/sitemap.xml`
3. Главное зеркало: `https://rem-phone.ru` (без www)
4. После деплоя: переобход важных URL (главная, services, cities/khabarovsk, FAQ)
5. Раздел «Безопасность и нарушения» / «Проблемы» — закрыть критические ошибки

## Google Search Console

1. https://search.google.com/search-console → ресурс `rem-phone.ru`
2. Sitemaps → `https://rem-phone.ru/sitemap.xml`
3. Проверка URL для главной и новых посадочных

## Яндекс.Метрика

1. Создайте счётчик на https://metrika.yandex.ru для `rem-phone.ru`
2. Вставьте числовой ID в `config.js`:

```js
metrikaId: 12345678  // ваш ID
```

3. Создайте цели типа **JavaScript-событие**:

| Имя цели в интерфейсе | Идентификатор цели |
|-----------------------|--------------------|
| Клик телефон | `phone_click` |
| WhatsApp | `whatsapp_click` |
| Telegram | `telegram_click` |
| Отправка формы | `form_submit` |

Код целей уже в `analytics.js` (подключается с главной и через `site-chrome.js`).

4. Проверка: в Метрике → Отчёты → Конверсии после тестовых кликов по `tel:` / WhatsApp / Telegram.

## UTM (внешние касания)

Пример для Telegram-поста:

`https://rem-phone.ru/?utm_source=telegram&utm_medium=social&utm_campaign=khabarovsk_launch`
