# Переобход money-URL — фаза 0

Дата: 2026-08-20  
Кабинет: [Яндекс.Вебмастер](https://webmaster.yandex.ru) → rem-phone.ru → Индексирование → Переобход страниц  
Sitemap на проде: https://rem-phone.ru/sitemap.xml

После деплоя прайса/моделей — снова переобход из блока «после деплоя».

## Приоритет 1 — гео-голова (сделать в первую очередь)

```
https://rem-phone.ru/
https://rem-phone.ru/khabarovsk/
https://rem-phone.ru/komsomolsk-na-amure/
https://rem-phone.ru/vladivostok/
```

## Приоритет 2 — услуга × город (экран / батарея / вода)

```
https://rem-phone.ru/cities/khabarovsk/screen.html
https://rem-phone.ru/cities/khabarovsk/battery.html
https://rem-phone.ru/cities/khabarovsk/water.html
https://rem-phone.ru/cities/khabarovsk/charge.html
https://rem-phone.ru/cities/khabarovsk/not-on.html
https://rem-phone.ru/komsomolsk-na-amure/screen.html
https://rem-phone.ru/komsomolsk-na-amure/battery.html
https://rem-phone.ru/komsomolsk-na-amure/water.html
https://rem-phone.ru/komsomolsk-na-amure/charge.html
https://rem-phone.ru/komsomolsk-na-amure/not-on.html
https://rem-phone.ru/vladivostok/screen.html
https://rem-phone.ru/vladivostok/battery.html
https://rem-phone.ru/vladivostok/water.html
https://rem-phone.ru/vladivostok/charge.html
https://rem-phone.ru/vladivostok/not-on.html
```

## Приоритет 3 — услуги без города + бренды money

```
https://rem-phone.ru/services/
https://rem-phone.ru/services/screen.html
https://rem-phone.ru/services/battery.html
https://rem-phone.ru/services/not-on.html
https://rem-phone.ru/services/charge.html
https://rem-phone.ru/services/water.html
https://rem-phone.ru/services/apps.html
https://rem-phone.ru/services/body.html
https://rem-phone.ru/brands/
https://rem-phone.ru/brands/iphone.html
https://rem-phone.ru/brands/iphone-screen.html
https://rem-phone.ru/brands/iphone-battery.html
https://rem-phone.ru/brands/samsung.html
https://rem-phone.ru/brands/samsung-screen.html
https://rem-phone.ru/brands/samsung-battery.html
https://rem-phone.ru/brands/xiaomi.html
https://rem-phone.ru/brands/xiaomi-screen.html
https://rem-phone.ru/brands/xiaomi-battery.html
https://rem-phone.ru/brands/honor.html
https://rem-phone.ru/brands/huawei.html
```

## Приоритет 4 — поддержка (после 1–3)

```
https://rem-phone.ru/services/camera.html
https://rem-phone.ru/faq.html
https://rem-phone.ru/contacts.html
https://rem-phone.ru/reviews.html
https://rem-phone.ru/blog/telefon-ne-vklyuchaetsya.html
https://rem-phone.ru/cities/khabarovsk_region.html
```

## Как жать в кабинете

1. Вставить пачку URL (лимит Вебмастера — обычно до 20–100 за раз; дробить по приоритетам).
2. Дождаться обработки.
3. Через 3–7 дней сверить `searchable_pages_count` на дашборде `/dashboard/` (сейчас ориентир **14**, цель фазы 0 — рост week-over-week).

## Не слать на переобход

- `/dashboard/`
- off-geo (`cities/moscow` и т.п., если вдруг открыты)
- внутренние `docs/`, `seo/` на хостинге нет

Чеклист владельца: `seo/OWNER_PHASE0.md`
