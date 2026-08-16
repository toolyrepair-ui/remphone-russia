# Dashboard — токен Метрики

Дашборд читает `dashboard/data.json`. Без токена цифры не подтянутся из API (останется сид из SEO-отчёта: 8 визитов за месяц).

## 1. Получить OAuth-токен Яндекса

1. Откройте https://oauth.yandex.ru/client/new  
2. Тип: **Для доступа к API или отладки**  
3. Доступ: **metrika:read** (чтение статистики)  
4. Создайте приложение, скопируйте **ClientID**  
5. Откройте в браузере (подставьте свой ClientID):

```
https://oauth.yandex.ru/authorize?response_type=token&client_id=СЮДА_CLIENT_ID
```

6. Разрешите доступ. Токен будет в адресной строке после `#access_token=`.

Счётчик: **111453492**. Второй счётчик не создавать.

## 2. Куда вставить

**GitHub** (ежедневное обновление): Settings репозитория → Secrets and variables → Actions → New repository secret:

- имя: `YANDEX_METRIKA_TOKEN`
- значение: токен

**Локально** (проверка): скопируйте `.env.dashboard.example` в `.env.dashboard` (файл в git не попадает) и выполните:

```powershell
node dashboard/collect.mjs
```

Потом откройте `dashboard/index.html` через локальный сервер (не как file://).

## 3. Заявки

Пока считаются как цель Метрики `request-form-submit`. Заявки из бота/звонков подтянутся, когда появится URL статистики бота (`LEAD_STATS_URL`).

Индексация Яндекс/Google в первой версии — число URL в sitemap, не «сколько в индексе».
