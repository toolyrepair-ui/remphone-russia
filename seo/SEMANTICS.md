# Семантика и приоритетные посадочные — rem-phone.ru

Собрано под локальный спрос Хабаровска и края. Частотности уточняйте в Wordstat.

## Кластеры

### Гео

| Запрос | Посадочная | Статус |
|--------|------------|--------|
| ремонт телефонов Хабаровск | `/`, `/khabarovsk/` | done |
| ремонт телефонов КнА / Комсомольск-на-Амуре | `/komsomolsk-na-amure/` | done |
| ремонт телефонов Владивосток | `/vladivostok/` | done |
| ремонт телефонов Амурск | `/cities/amursk.html` | done |
| Хабаровский край | `/cities/khabarovsk_region.html` | done |

### Услуга × гео (расширение)

| Запрос | Посадочная | Статус |
|--------|------------|--------|
| замена экрана Комсомольск-на-Амуре | `/komsomolsk-na-amure/`, `/services/screen.html` | done |
| замена батареи Владивосток | `/vladivostok/`, `/services/battery.html` | done |
| замена экрана Хабаровск | `/cities/khabarovsk/screen.html`, `/services/screen.html` | done |
| замена батареи Хабаровск | `/cities/khabarovsk/battery.html` | done |
| после воды Хабаровск | `/cities/khabarovsk/water.html` | done |

### Бренд × услуга × гео

| Запрос | Посадочная | Статус |
|--------|------------|--------|
| замена экрана iPhone Хабаровск | `/brands/iphone-screen.html` | done |
| замена экрана Samsung Хабаровск | `/brands/samsung-screen.html` | done |
| замена экрана Xiaomi Хабаровск | `/brands/xiaomi-screen.html` | done |
| замена батареи iPhone Хабаровск | `/brands/iphone-battery.html` | done |
| замена батареи Samsung Хабаровск | `/brands/samsung-battery.html` | done |
| ремонт Honor Хабаровск | `/brands/honor.html` | done |
| ремонт Huawei Хабаровск | `/brands/huawei.html` | done |

## Бэклог следующей волны

1. `/brands/xiaomi-battery.html`  
2. `/cities/komsomolsk` × screen (только после трафика на city-страницу)  
3. Blog: 1 инфо-статья/мес. → ссылка на услугу  

## Off-geo (noindex)

`cities/moscow|spb|kazan|novosibirsk|ekaterinburg|other` — не в sitemap, `noindex` обязателен (`node seo/audit-monthly.mjs`).

## Wordstat

См. [`MONTHLY_AUDIT.md`](MONTHLY_AUDIT.md).
