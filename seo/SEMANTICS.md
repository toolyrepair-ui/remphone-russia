# Семантика — rem-phone.ru (3 города)

Модель: **агрегатор заявок** в Хабаровске, Комсомольске-на-Амуре и Владивостоке.  
Частотности уточнять в Wordstat (Хабаровский край + Приморский край).

## Канонические гео-URL

| Город | city_id | URL | Статус |
|-------|---------|-----|--------|
| Хабаровск | `khabarovsk` | `/khabarovsk/` | done |
| Комсомольск-на-Амуре | `komsomolsk` | `/komsomolsk-na-amure/` | done |
| Владивосток | `vladivostok` | `/vladivostok/` | done |
| Хаб (все три) | — | `/` | done |

Редиректы 301: `/cities/khabarovsk.html` → `/khabarovsk/`, `/cities/komsomolsk.html` → `/komsomolsk-na-amure/`.

## Кластеры

### Гео (ядро)

| Запрос | Посадочная | Статус |
|--------|------------|--------|
| ремонт телефонов Хабаровск | `/`, `/khabarovsk/` | done |
| ремонт телефонов Комсомольск-на-Амуре / КнА | `/komsomolsk-na-amure/` | done |
| ремонт телефонов Владивосток | `/vladivostok/` | done |
| ремонт телефонов Хабаровский край | `/cities/khabarovsk_region.html` | done (вторично) |
| ремонт телефонов Амурск | `/cities/amursk.html` | keep, низкий приоритет |

### Услуга × гео

| Запрос | Посадочная | Статус |
|--------|------------|--------|
| замена экрана Хабаровск | `/cities/khabarovsk/screen.html`, `/services/screen.html` | done |
| замена батареи Хабаровск | `/cities/khabarovsk/battery.html` | done |
| после воды Хабаровск | `/cities/khabarovsk/water.html` | done |
| замена экрана Комсомольск-на-Амуре | `/komsomolsk-na-amure/screen.html` | done |
| замена батареи Комсомольск-на-Амуре | `/komsomolsk-na-amure/battery.html` | done |
| после воды Комсомольск-на-Амуре | `/komsomolsk-na-amure/water.html` | done |
| замена экрана Владивосток | `/vladivostok/screen.html` | done |
| замена батареи Владивосток | `/vladivostok/battery.html` | done |
| после воды Владивосток | `/vladivostok/water.html` | done |
| не включается / зарядка / камера × 3 города | city + `/services/*` | backlog позже |

### Бренд × услуга × гео

Пока опираемся на Хабаровск (трафик и контент уже есть). КнА/Владивосток — **после** визитов на city-страницы.

| Запрос | Посадочная | Статус |
|--------|------------|--------|
| замена экрана iPhone Хабаровск | `/brands/iphone-screen.html` | done |
| замена экрана Samsung Хабаровск | `/brands/samsung-screen.html` | done |
| замена экрана Xiaomi Хабаровск | `/brands/xiaomi-screen.html` | done |
| замена батареи iPhone Хабаровск | `/brands/iphone-battery.html` | done |
| замена батареи Samsung Хабаровск | `/brands/samsung-battery.html` | done |
| ремонт Honor / Huawei Хабаровск | `/brands/honor.html`, `huawei.html` | done |
| бренд × КнА / Владивосток | отдельные URL | backlog (не раньше волны 2) |

## Бэклог следующей волны (порядок)

1. `/brands/xiaomi-battery.html`  
2. Blog: 1 инфо-статья/мес. → ссылка на услугу + один из трёх городов  
3. Услуга×город для charge / not-on / camera (КнА и Владивосток) — после трафика на screen/battery  
4. Не открывать 4-й город, пока нет стабильных заявок с текущих трёх

## Off-geo (noindex)

`cities/moscow|spb|kazan|novosibirsk|ekaterinburg|other` — не в sitemap, `noindex` обязателен (`node seo/audit-monthly.mjs`).

## Правила контента

- Title: `Ремонт телефонов в [городе] — REMPHONE (заявка онлайн)`  
- Description: подбор партнёрского сервиса, 15 секунд, гарантия 90 дней  
- Не публиковать чужие телефоны мастерских; CTA = заявка / бот / наш телефон  
- Перелинковка: `/` ↔ три города ↔ `/services/` ↔ `/faq.html`

## Wordstat

См. [`MONTHLY_AUDIT.md`](MONTHLY_AUDIT.md). Регионы: Хабаровский край, Приморский край.
