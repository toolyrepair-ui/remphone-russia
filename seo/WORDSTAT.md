# Wordstat API для Remphone

Сбор частот запросов по **Хабаровскому краю** и **Приморскому краю** через Yandex Cloud Search API v2.

## Что нужно от вас (один раз)

1. Аккаунт [Yandex Cloud](https://console.yandex.cloud) / AI Studio  
2. **Api-Key** сервисного аккаунта (тот же тип, что для YandexGPT / Search API)  
3. **folderId** каталога, к которому привязан ключ  

### Как получить

1. [console.yandex.cloud](https://console.yandex.cloud) → ваш каталог → скопировать **Идентификатор** (вида `b1…`)  
2. Сервисный аккаунт → создать **API-ключ**  
3. В корне `remphone-russia` создать файл `.env.wordstat` (не коммитить):

```env
YANDEX_WORDSTAT_API_KEY=AQVN...
YANDEX_WORDSTAT_FOLDER_ID=b1...
```

Шаблон: [`.env.wordstat.example`](../.env.wordstat.example)

## Запуск

```powershell
cd C:\Users\PC\Desktop\remphone-russia
python seo/wordstat_fetch.py
```

Список фраз: `seo/wordstat/phrases.json` (можно править).

Справочник регионов (если нужно уточнить id 75/76):

```powershell
python seo/wordstat_fetch.py --regions-tree
```

## Результат

- `seo/reports/wordstat-YYYY-MM-DD.md` — таблица для решений  
- `seo/reports/wordstat-YYYY-MM-DD.json` — сырые данные  

Пришлите отчёт в чат (или скажите «разбери wordstat») — приоритизирую бэклог SEO.

## Важно

- Ключ **не** светить в чат и **не** коммитить  
- Пауза между запросами ~0.25 с (квоты API)  
- Id регионов по умолчанию: `11457` Хабаровский край, `11409` Приморский край (города: Хабаровск `76`, КнА `11453`, Владивосток уточнить через `--regions-tree`)
