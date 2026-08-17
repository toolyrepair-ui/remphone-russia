import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const brands = [
  {
    file: 'iphone.html',
    name: 'iPhone',
    slug: 'iphone',
    title: 'Ремонт iPhone в Хабаровске — REMPHONE RUSSIA',
    h1: 'Ремонт iPhone в Хабаровске',
    desc: 'Ремонт iPhone в Хабаровске: замена экрана и батареи, после воды, зарядка, камера. Модели 11–16. Гарантия 90 дней, выезд мастера. От 1400₽.',
    intro: 'Чиним все актуальные iPhone — от SE и 11 до 15/16 Pro. Ставим модули под модель, проверяем Face ID и сенсоры после сборки. Большинство работ — 30–60 минут.',
    models: 'iPhone SE, 11, 12, 13, 14, 15, 16 и Pro-версии',
    prices: [
      ['Экран iPhone 13', 'от 3100₽'],
      ['Экран iPhone 14', 'от 3700₽'],
      ['Батарея iPhone 12–13', 'от 2700₽'],
      ['Зарядка / разъём', 'от 1400₽'],
      ['После воды (чистка)', 'от 1500₽'],
    ],
    faq: [
      ['Чините с Face ID?', 'Да. После замены экрана проверяем Face ID и датчики. Если модуль не поддерживает — предупредим заранее.'],
      ['Оригинал или аналог?', 'Подбираем под задачу и бюджет. Называем варианты и цену до начала работ.'],
      ['Сколько занимает ремонт iPhone?', 'Типовые замены — 30–60 минут при наличии детали.'],
    ],
    iconBg: '#111',
    logo: 'apple.svg',
  },
  {
    file: 'samsung.html',
    name: 'Samsung',
    slug: 'samsung',
    title: 'Ремонт Samsung в Хабаровске — REMPHONE RUSSIA',
    h1: 'Ремонт Samsung Galaxy в Хабаровске',
    desc: 'Ремонт Samsung в Хабаровске: A-серия, S и Z Fold/Flip. Экран, батарея, зарядка, после воды. Гарантия 90 дней. От 1700₽.',
    intro: 'Ремонтируем Galaxy A, S и складные модели. Частые обращения — разбитый AMOLED, севшая батарея и разъём зарядки. Диагностика бесплатно.',
    models: 'Galaxy A, S, Note, Z Fold / Z Flip',
    prices: [
      ['Экран A-серия', 'от 2400₽'],
      ['Экран S-серия', 'от 3200₽'],
      ['Батарея', 'от 2000₽'],
      ['Разъём зарядки', 'от 1700₽'],
      ['После воды', 'от 1500₽'],
    ],
    faq: [
      ['Берёте складные Samsung?', 'Да, Z Fold/Flip — после диагностики. Срок зависит от наличия модуля.'],
      ['Экран будет как родной?', 'Ставим качественные модули под модель, проверяем сенсор и цветопередачу.'],
      ['Есть выезд?', 'Да, по Хабаровску и краю.'],
    ],
    iconBg: '#1428A0',
    logo: 'samsung.svg',
  },
  {
    file: 'xiaomi.html',
    name: 'Xiaomi',
    slug: 'xiaomi',
    title: 'Ремонт Xiaomi в Хабаровске — REMPHONE RUSSIA',
    h1: 'Ремонт Xiaomi, Redmi и POCO в Хабаровске',
    desc: 'Ремонт Xiaomi, Redmi и POCO в Хабаровске: экран, батарея, зарядка, после воды. Гарантия 90 дней. От 1300₽.',
    intro: 'Чиним Xiaomi, Redmi и POCO. Запчасти на популярные модели обычно в наличии — поэтому ремонт часто в день обращения.',
    models: 'Xiaomi, Redmi, POCO, Black Shark',
    prices: [
      ['Экран Redmi / POCO', 'от 2100₽'],
      ['Батарея', 'от 2000₽'],
      ['Разъём зарядки', 'от 1300₽'],
      ['После воды', 'от 1500₽'],
      ['Камера', 'от 1800₽'],
    ],
    faq: [
      ['Есть запчасти на Redmi?', 'На ходовые модели — да. Если деталь под заказ, скажем срок до старта.'],
      ['Сколько по времени?', 'Обычно 30–60 минут.'],
      ['Гарантия?', '90 дней на работы и запчасти.'],
    ],
    iconBg: '#FF6900',
    logo: 'xiaomi.svg',
  },
];

function brandHtml(b) {
  const faqHtml = b.faq
    .map(
      (qa, i) =>
        `<div class="faq-item${i === 0 ? ' active' : ''}"><div class="faq-question">${qa[0]}</div><div class="faq-answer">${qa[1]}</div></div>`
    )
    .join('\n');
  const faqLd = b.faq.map((qa) => ({
    '@type': 'Question',
    name: qa[0],
    acceptedAnswer: { '@type': 'Answer', text: qa[1] },
  }));
  const priceRows = b.prices.map((p) => `<tr><td>${p[0]}</td><td>${p[1]}</td></tr>`).join('');

  return `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${b.title}</title>
    <meta name="description" content="${b.desc}">
    <link rel="canonical" href="https://rem-phone.ru/brands/${b.file}">
    <link rel="stylesheet" href="../styles.css">
    <link rel="stylesheet" href="../animations.css">
    <meta property="og:title" content="${b.title}">
    <meta property="og:description" content="${b.desc}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://rem-phone.ru/brands/${b.file}">
    <meta property="og:image" content="https://rem-phone.ru/og-image.jpg">
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": "${b.h1}",
        "serviceType": "Ремонт ${b.name}",
        "provider": {
            "@type": "LocalBusiness",
            "name": "REMPHONE RUSSIA",
            "telephone": "+79144111730",
            "url": "https://rem-phone.ru/",
            "address": { "@type": "PostalAddress", "addressLocality": "Хабаровск", "addressCountry": "RU" }
        },
        "areaServed": "Хабаровск",
        "brand": { "@type": "Brand", "name": "${b.name}" }
    }
    </script>
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Главная", "item": "https://rem-phone.ru/" },
            { "@type": "ListItem", "position": 2, "name": "Бренды", "item": "https://rem-phone.ru/brands/" },
            { "@type": "ListItem", "position": 3, "name": "${b.name}", "item": "https://rem-phone.ru/brands/${b.file}" }
        ]
    }
    </script>
    <script type="application/ld+json">
${JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqLd }, null, 4)}
    </script>
</head>
<body>
<header class="header" id="header">
    <div class="container">
        <a href="/" class="logo">REMPHONE <span>RUSSIA</span></a>
        <nav class="nav" id="nav">
            <a href="../services/">Услуги</a>
            <a href="../cities/">Города</a>
            <a href="./">Бренды</a>
            <a href="../faq.html">FAQ</a>
            <a href="../contacts.html">Контакты</a>
        </nav>
        <a class="header-phone" href="tel:+79144111730">+7 914 411-17-30</a>
        <button class="burger" id="burger" aria-label="Меню"><span></span><span></span><span></span></button>
    </div>
</header>

<section class="hero" style="padding:60px 0 40px">
    <div class="container">
        <p style="font-size:14px;opacity:.7;margin-bottom:12px"><a href="/">Главная</a> / <a href="./">Бренды</a> / ${b.name}</p>
        <div style="display:flex;align-items:center;gap:16px;flex-wrap:wrap;margin-bottom:12px">
            <span class="brand-icon" style="background:${b.iconBg};width:52px;height:52px;display:inline-flex;align-items:center;justify-content:center;border-radius:12px">
                <img class="brand-logo" src="../assets/brands/${b.logo}" alt="${b.name}" width="36" height="36" onerror="this.src='../assets/placeholders/placeholder.svg'">
            </span>
            <h1 style="margin:0;font-size:clamp(28px,5vw,42px)">${b.h1}</h1>
        </div>
        <p style="font-size:18px;max-width:760px">${b.intro}</p>
        <p style="margin-top:10px;opacity:.85">Модели: ${b.models}</p>
        <p style="margin-top:10px">⚡ 30–60 минут · 🛡 гарантия 90 дней · 🔧 диагностика бесплатно</p>
        <div class="hero-actions" style="margin-top:24px;flex-wrap:wrap">
            <a href="#form" class="btn-primary">Оставить заявку</a>
            <a href="tel:+79144111730" class="btn-secondary">+7 914 411-17-30</a>
            <a href="https://t.me/REMPHONE_RUSSIA_Bot" class="btn-secondary" target="_blank" rel="noopener">Telegram</a>
        </div>
    </div>
</section>

<section class="services-preview">
    <div class="container">
        <h2 class="section-title">Что чиним у ${b.name}</h2>
        <div class="services-grid" style="margin-top:24px">
            <a href="../services/screen.html" class="service-card"><h4>Замена экрана</h4><span class="service-price">от 2000₽</span></a>
            <a href="../services/battery.html" class="service-card"><h4>Замена батареи</h4><span class="service-price">от 2000₽</span></a>
            <a href="../services/water.html" class="service-card"><h4>После воды</h4><span class="service-price">от 1500₽</span></a>
            <a href="../services/charge.html" class="service-card"><h4>Не заряжается</h4><span class="service-price">от 1300₽</span></a>
            <a href="../services/camera.html" class="service-card"><h4>Камера</h4><span class="service-price">от 1800₽</span></a>
            <a href="../services/not-on.html" class="service-card"><h4>Не включается</h4><span class="service-price">от 1000₽</span></a>
        </div>

        <div style="max-width:900px;margin:40px auto 0">
            <h2>Ориентир цен — ${b.name}, Хабаровск</h2>
            <table style="width:100%;margin:16px 0 28px;border-collapse:collapse">
                <thead><tr><th align="left">Работы</th><th align="left">Цена</th></tr></thead>
                <tbody>${priceRows}</tbody>
            </table>
            <p style="color:var(--text-light);margin-bottom:28px">Точную сумму подтверждаем до ремонта. Также смотрите <a href="../cities/khabarovsk.html">ремонт в Хабаровске</a> и <a href="../cities/khabarovsk/screen.html">замену экрана в Хабаровске</a>.</p>
            <h2>FAQ</h2>
            <div class="faq-list">${faqHtml}</div>
        </div>
    </div>
</section>

<section class="cta" id="form">
    <div class="container">
        <h2>Заявка на ремонт ${b.name}</h2>
        <p class="cta-desc">Перезвоним за несколько минут и назовём ориентир по вашей модели.</p>
        <div class="hero-actions" style="margin-top:16px;flex-wrap:wrap">
            <a href="https://t.me/REMPHONE_RUSSIA_Bot" class="btn-primary" target="_blank" rel="noopener">Telegram-бот</a>
            <a href="https://wa.me/79144111730" class="btn-secondary" target="_blank" rel="noopener">WhatsApp</a>
            <a href="tel:+79144111730" class="btn-secondary">Позвонить</a>
            <a href="./" class="btn-secondary">Другой бренд</a>
        </div>
    </div>
</section>

<footer class="footer"><div class="container"><div class="footer-bottom"><p>© 2026 REMPHONE RUSSIA · ${b.name}</p></div></div></footer>
<script src="../config.js"></script>
<script src="../script.js"></script>
<script src="../analytics.js"></script>
</body>
</html>
`;
}

const cityServices = [
  {
    file: 'screen.html',
    service: 'screen',
    title: 'Замена экрана в Хабаровске — REMPHONE RUSSIA',
    h1: 'Замена экрана телефона в Хабаровске',
    desc: 'Замена экрана в Хабаровске для iPhone, Samsung, Xiaomi. 30–60 минут, гарантия 90 дней, выезд мастера. От 2000₽.',
    intro: 'Разбили дисплей в Хабаровске? Меняем модуль под модель, проверяем сенсор и собираем телефон при вас. Часто успеваем за час.',
    linkService: '../../services/screen.html',
    price: 'от 2000₽',
    faq: [
      ['Сколько стоит замена экрана в Хабаровске?', 'Ориентир от 2000₽, для iPhone — от 2500₽. Точную цену скажем по модели.'],
      ['Можно с выездом?', 'Да, мастер может приехать по городу или вы передаёте устройство.'],
      ['Какая гарантия?', '90 дней на экран и работы.'],
    ],
  },
  {
    file: 'battery.html',
    service: 'battery',
    title: 'Замена батареи в Хабаровске — REMPHONE RUSSIA',
    h1: 'Замена батареи телефона в Хабаровске',
    desc: 'Замена аккумулятора в Хабаровске: iPhone, Samsung, Xiaomi. Телефон снова держит день. Гарантия 90 дней. От 2000₽.',
    intro: 'Если смартфон садится к обеду или выключается на морозе — меняем батарею. Работа занимает обычно 30–45 минут.',
    linkService: '../../services/battery.html',
    price: 'от 2000₽',
    faq: [
      ['Сколько стоит батарея в Хабаровске?', 'От 2000₽, для iPhone — от 2400₽ в зависимости от модели.'],
      ['Долго ли ждать?', 'Часто в день обращения, если аккумулятор в наличии.'],
      ['Гарантия?', '90 дней.'],
    ],
  },
  {
    file: 'water.html',
    service: 'water',
    title: 'Телефон после воды в Хабаровске — REMPHONE RUSSIA',
    h1: 'Ремонт телефона после воды в Хабаровске',
    desc: 'Телефон намок или утонул в Хабаровске? Срочная чистка и восстановление. Чем раньше — тем выше шанс. От 1500₽.',
    intro: 'Не сушите рис и фен — привозите на чистку. Разбираем, убираем влагу и соли, сушим плату и меняем пострадавшие детали.',
    linkService: '../../services/water.html',
    price: 'от 1500₽',
    faq: [
      ['Что делать сразу после воды?', 'Выключить, не заряжать, не греть феном — и связаться с нами.'],
      ['Всегда ли получается спасти?', 'Не всегда. Чем раньше чистка, тем выше шанс. Скажем честно после осмотра.'],
      ['Цена?', 'Чистка от 1500₽, детали — отдельно до начала работ.'],
    ],
  },
];

function cityServiceHtml(s) {
  const faqHtml = s.faq
    .map(
      (qa, i) =>
        `<div class="faq-item${i === 0 ? ' active' : ''}"><div class="faq-question">${qa[0]}</div><div class="faq-answer">${qa[1]}</div></div>`
    )
    .join('\n');
  const faqLd = s.faq.map((qa) => ({
    '@type': 'Question',
    name: qa[0],
    acceptedAnswer: { '@type': 'Answer', text: qa[1] },
  }));
  const url = `https://rem-phone.ru/cities/khabarovsk/${s.file}`;

  return `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${s.title}</title>
    <meta name="description" content="${s.desc}">
    <link rel="canonical" href="${url}">
    <link rel="stylesheet" href="../../styles.css">
    <meta property="og:title" content="${s.title}">
    <meta property="og:description" content="${s.desc}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="${url}">
    <meta property="og:image" content="https://rem-phone.ru/og-image.jpg">
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": "${s.h1}",
        "provider": { "@type": "LocalBusiness", "name": "REMPHONE RUSSIA", "telephone": "+79144111730", "url": "https://rem-phone.ru/" },
        "areaServed": { "@type": "City", "name": "Хабаровск" },
        "url": "${url}"
    }
    </script>
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Главная", "item": "https://rem-phone.ru/" },
            { "@type": "ListItem", "position": 2, "name": "Хабаровск", "item": "https://rem-phone.ru/cities/khabarovsk.html" },
            { "@type": "ListItem", "position": 3, "name": "${s.h1}", "item": "${url}" }
        ]
    }
    </script>
    <script type="application/ld+json">
${JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqLd }, null, 4)}
    </script>
</head>
<body>
<header class="header" id="header">
    <div class="container">
        <a href="/" class="logo">REMPHONE <span>RUSSIA</span></a>
        <nav class="nav" id="nav">
            <a href="../../services/">Услуги</a>
            <a href="../">Города</a>
            <a href="../../brands/">Бренды</a>
            <a href="../../faq.html">FAQ</a>
            <a href="../../contacts.html">Контакты</a>
        </nav>
        <a class="header-phone" href="tel:+79144111730">+7 914 411-17-30</a>
        <button class="burger" id="burger" aria-label="Меню"><span></span><span></span><span></span></button>
    </div>
</header>

<section class="hero" style="padding:60px 0">
    <div class="container">
        <p style="font-size:14px;opacity:.7;margin-bottom:12px"><a href="/">Главная</a> / <a href="../khabarovsk.html">Хабаровск</a> / ${s.h1}</p>
        <h1 style="font-size:clamp(28px,5vw,42px);margin-bottom:16px">${s.h1}</h1>
        <p style="font-size:18px;max-width:720px">${s.intro}</p>
        <p style="margin-top:12px">💰 ${s.price} · ⏱ 30–60 минут · 🛡 гарантия 90 дней</p>
        <div class="hero-actions" style="margin-top:24px;flex-wrap:wrap">
            <a href="#form" class="btn-primary">Оставить заявку</a>
            <a href="tel:+79144111730" class="btn-secondary">Позвонить</a>
            <a href="${s.linkService}" class="btn-secondary">Подробнее об услуге</a>
        </div>
    </div>
</section>

<section class="services-preview">
    <div class="container" style="max-width:900px">
        <h2>Почему в Хабаровске обращаются к нам</h2>
        <p style="color:var(--text-light);margin:12px 0 28px">Называем цену до работ, даём гарантию 90 дней и можем приехать по адресу. Смотрите также <a href="../komsomolsk.html">Комсомольск-на-Амуре</a> и <a href="../amursk.html">Амурск</a>.</p>
        <h2>Связанные услуги</h2>
        <div class="services-grid" style="margin:16px 0 32px">
            <a class="service-card" href="screen.html"><h4>Экран</h4></a>
            <a class="service-card" href="battery.html"><h4>Батарея</h4></a>
            <a class="service-card" href="water.html"><h4>После воды</h4></a>
            <a class="service-card" href="../../brands/iphone.html"><h4>iPhone</h4></a>
        </div>
        <h2>FAQ</h2>
        <div class="faq-list">${faqHtml}</div>
    </div>
</section>

<section class="cta" id="form">
    <div class="container">
        <h2>Заявка — Хабаровск</h2>
        <div class="hero-actions" style="margin-top:16px;flex-wrap:wrap">
            <a href="https://t.me/REMPHONE_RUSSIA_Bot" class="btn-primary" target="_blank" rel="noopener">Telegram-бот</a>
            <a href="https://wa.me/79144111730" class="btn-secondary" target="_blank" rel="noopener">WhatsApp</a>
            <a href="tel:+79144111730" class="btn-secondary">+7 914 411-17-30</a>
        </div>
    </div>
</section>

<footer class="footer"><div class="container"><div class="footer-bottom"><p>© 2026 REMPHONE RUSSIA · Хабаровск</p></div></div></footer>
<script src="../../config.js"></script>
<script src="../../script.js"></script>
<script src="../../analytics.js"></script>
</body>
</html>
`;
}

for (const b of brands) {
  writeFileSync(join(root, 'brands', b.file), brandHtml(b), 'utf8');
  console.log('brand', b.file);
}

mkdirSync(join(root, 'cities', 'khabarovsk'), { recursive: true });
for (const s of cityServices) {
  writeFileSync(join(root, 'cities', 'khabarovsk', s.file), cityServiceHtml(s), 'utf8');
  console.log('city-service', s.file);
}

// brand x service: iphone screen
const iphoneScreen = `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Замена экрана iPhone в Хабаровске — REMPHONE RUSSIA</title>
    <meta name="description" content="Замена экрана iPhone в Хабаровске: 11–16 и Pro. 30–60 минут, проверка Face ID, гарантия 90 дней. От 2500₽.">
    <link rel="canonical" href="https://rem-phone.ru/brands/iphone-screen.html">
    <link rel="stylesheet" href="../styles.css">
    <meta property="og:title" content="Замена экрана iPhone в Хабаровске — REMPHONE RUSSIA">
    <meta property="og:description" content="Замена дисплея iPhone в Хабаровске с гарантией 90 дней.">
    <meta property="og:url" content="https://rem-phone.ru/brands/iphone-screen.html">
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "Замена экрана iPhone в Хабаровске",
      "brand": { "@type": "Brand", "name": "Apple" },
      "provider": { "@type": "LocalBusiness", "name": "REMPHONE RUSSIA", "telephone": "+79144111730" },
      "areaServed": "Хабаровск"
    }
    </script>
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Главная", "item": "https://rem-phone.ru/" },
        { "@type": "ListItem", "position": 2, "name": "iPhone", "item": "https://rem-phone.ru/brands/iphone.html" },
        { "@type": "ListItem", "position": 3, "name": "Замена экрана", "item": "https://rem-phone.ru/brands/iphone-screen.html" }
      ]
    }
    </script>
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        { "@type": "Question", "name": "Сколько стоит замена экрана iPhone в Хабаровске?", "acceptedAnswer": { "@type": "Answer", "text": "Ориентир: iPhone 13 от 3100₽, iPhone 14 от 3700₽. Точную цену назовём по модели." } },
        { "@type": "Question", "name": "Сохранится Face ID?", "acceptedAnswer": { "@type": "Answer", "text": "Проверяем Face ID после замены. Если модуль без поддержки — предупредим заранее." } },
        { "@type": "Question", "name": "Сколько по времени?", "acceptedAnswer": { "@type": "Answer", "text": "Обычно 30–60 минут при наличии дисплея." } }
      ]
    }
    </script>
</head>
<body>
<header class="header" id="header">
    <div class="container">
        <a href="/" class="logo">REMPHONE <span>RUSSIA</span></a>
        <nav class="nav" id="nav">
            <a href="../services/">Услуги</a>
            <a href="../cities/">Города</a>
            <a href="./">Бренды</a>
            <a href="../contacts.html">Контакты</a>
        </nav>
        <a class="header-phone" href="tel:+79144111730">+7 914 411-17-30</a>
        <button class="burger" id="burger" aria-label="Меню"><span></span><span></span><span></span></button>
    </div>
</header>
<section class="hero" style="padding:60px 0">
    <div class="container">
        <p style="font-size:14px;opacity:.7;margin-bottom:12px"><a href="/">Главная</a> / <a href="iphone.html">iPhone</a> / Замена экрана</p>
        <h1>Замена экрана iPhone в Хабаровске</h1>
        <p style="font-size:18px;max-width:720px;margin-top:12px">Меняем дисплеи iPhone 11–16 и Pro. Проверяем сенсор, яркость и Face ID. Гарантия 90 дней, выезд по городу.</p>
        <div class="hero-actions" style="margin-top:24px;flex-wrap:wrap">
            <a href="#form" class="btn-primary">Оставить заявку</a>
            <a href="tel:+79144111730" class="btn-secondary">Позвонить</a>
            <a href="../services/screen.html" class="btn-secondary">Все экраны</a>
        </div>
    </div>
</section>
<section class="services-preview">
    <div class="container" style="max-width:900px">
        <h2>Ориентир цен</h2>
        <table style="width:100%;margin:16px 0 28px;border-collapse:collapse">
            <thead><tr><th align="left">Модель</th><th align="left">Экран</th></tr></thead>
            <tbody>
                <tr><td>iPhone 12</td><td>от 2800₽</td></tr>
                <tr><td>iPhone 13</td><td>от 3100₽</td></tr>
                <tr><td>iPhone 14</td><td>от 3700₽</td></tr>
                <tr><td>iPhone 15</td><td>от 4100₽</td></tr>
            </tbody>
        </table>
        <p style="color:var(--text-light);margin-bottom:24px">Связанные страницы: <a href="iphone.html">ремонт iPhone</a>, <a href="../cities/khabarovsk/screen.html">замена экрана в Хабаровске</a>, <a href="../services/battery.html">батарея</a>.</p>
        <h2>FAQ</h2>
        <div class="faq-list">
            <div class="faq-item active"><div class="faq-question">Сколько стоит экран iPhone?</div><div class="faq-answer">От 2500₽ в зависимости от модели. Точную цену назовём до работ.</div></div>
            <div class="faq-item"><div class="faq-question">Сохранится Face ID?</div><div class="faq-answer">Проверяем после замены. Предупредим, если модуль без поддержки.</div></div>
            <div class="faq-item"><div class="faq-question">Сколько времени?</div><div class="faq-answer">Обычно 30–60 минут.</div></div>
        </div>
    </div>
</section>
<section class="cta" id="form">
    <div class="container">
        <h2>Заявка на экран iPhone</h2>
        <div class="hero-actions" style="margin-top:16px;flex-wrap:wrap">
            <a href="https://t.me/REMPHONE_RUSSIA_Bot" class="btn-primary" target="_blank" rel="noopener">Telegram-бот</a>
            <a href="https://wa.me/79144111730" class="btn-secondary" target="_blank" rel="noopener">WhatsApp</a>
            <a href="tel:+79144111730" class="btn-secondary">Позвонить</a>
        </div>
    </div>
</section>
<footer class="footer"><div class="container"><div class="footer-bottom"><p>© 2026 REMPHONE RUSSIA</p></div></div></footer>
<script src="../config.js"></script>
<script src="../script.js"></script>
<script src="../analytics.js"></script>
</body>
</html>
`;
writeFileSync(join(root, 'brands', 'iphone-screen.html'), iphoneScreen, 'utf8');
console.log('brand-service iphone-screen.html');
