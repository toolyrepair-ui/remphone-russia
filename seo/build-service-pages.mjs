import { writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'services');

const services = [
  {
    file: 'screen.html',
    title: 'Замена экрана в Хабаровске — REMPHONE RUSSIA',
    h1: 'Замена экрана в Хабаровске',
    desc: 'Замена экрана iPhone, Samsung, Xiaomi в Хабаровске. Оригинальные и качественные дисплеи, гарантия 90 дней, ремонт за 30–60 минут. От 2000₽.',
    price: 'от 2000₽',
    what: 'Замена дисплейного модуля — самая частая услуга в Хабаровске. Ставим модули под конкретную модель: яркость, цвета и сенсор работают как до поломки.',
    signs: 'Трещины, паутина, чёрные пятна, полосы, мерцание, сенсор не отвечает или «живёт своей жизнью».',
    how: 'Разбираем устройство, снимаем повреждённый модуль, очищаем рамку, ставим новый дисплей, проверяем сенсор, датчики, Face ID/сканер (если применимо) и сборку.',
    faq: [
      ['Можно заменить только стекло?', 'На большинстве моделей надёжнее менять весь модуль. Так меньше риска повторных отслоений и белых пятен.'],
      ['Сколько занимает замена экрана?', 'Обычно 30–60 минут, если модуль в наличии.'],
      ['Даёте гарантию на экран?', 'Да, 90 дней на работы и установленный дисплей.'],
    ],
    prices: [
      ['iPhone 13', 'от 3100₽'],
      ['iPhone 14', 'от 3700₽'],
      ['Samsung A-серия', 'от 2400₽'],
      ['Xiaomi / Redmi', 'от 2100₽'],
    ],
  },
  {
    file: 'battery.html',
    title: 'Замена батареи в Хабаровске — REMPHONE RUSSIA',
    h1: 'Замена батареи в Хабаровске',
    desc: 'Замена аккумулятора iPhone, Samsung, Xiaomi в Хабаровске. Телефон снова держит день. Гарантия 90 дней. От 2000₽.',
    price: 'от 2000₽',
    what: 'Меняем изношенный аккумулятор на совместимый качественный. После замены проверяем зарядку, нагрев и стабильность работы.',
    signs: 'Быстро садится, выключается на 20–30%, греется, вздулся корпус, процент заряда скачет.',
    how: 'Аккуратно вскрываем корпус, отключаем старую батарею, ставим новую, собираем и при необходимости калибруем отображение заряда.',
    faq: [
      ['Сколько служит новая батарея?', 'При нормальной эксплуатации — сотни циклов. Даём гарантию 90 дней.'],
      ['Сколько по времени?', 'Обычно 30–45 минут.'],
      ['Можно ли менять самому?', 'Не рекомендуется: легко повредить шлейфы и корпус.'],
    ],
    prices: [
      ['iPhone 12', 'от 2700₽'],
      ['iPhone 14–15', 'от 3200₽'],
      ['Samsung A-серия', 'от 2000₽'],
      ['Xiaomi / Redmi', 'от 2000₽'],
    ],
  },
  {
    file: 'water.html',
    title: 'Ремонт телефона после воды в Хабаровске — REMPHONE RUSSIA',
    h1: 'Ремонт после воды в Хабаровске',
    desc: 'Телефон утонул или намок? Срочная чистка и восстановление в Хабаровске. Чем раньше — тем выше шанс. От 1500₽.',
    price: 'от 1500₽',
    what: 'После жидкости важно быстро разобрать устройство, убрать влагу и соли с платы, просушить и заменить пострадавшие элементы.',
    signs: 'Не включается, нет звука, не заряжается, коррозия на разъёме, самовыключения, туман под стеклом камеры.',
    how: 'Диагностика, разбор, чистка платы, сушка, замена окисленных деталей, сборка и тест.',
    faq: [
      ['Можно сушить рисом или феном?', 'Нет — это теряет время. Несите на чистку как можно быстрее.'],
      ['Всегда ли спасаете?', 'Зависит от времени в воде и типа жидкости. Честно скажем после осмотра.'],
      ['Сколько стоит?', 'Чистка от 1500₽. Замена деталей — отдельно, до начала работ.'],
    ],
    prices: [
      ['Чистка / сушка', 'от 1500₽'],
      ['Замена шлейфа', 'от 1300₽'],
      ['Сложный ремонт платы', 'по диагностике'],
    ],
  },
  {
    file: 'not-on.html',
    title: 'Телефон не включается — ремонт в Хабаровске — REMPHONE RUSSIA',
    h1: 'Телефон не включается — Хабаровск',
    desc: 'Диагностика и ремонт, если смартфон не включается или сразу гаснет. Хабаровск, выезд мастера. От 1000₽.',
    price: 'от 1000₽',
    what: 'Ищем причину: батарея, кнопка питания, шлейф, контроллер зарядки, последствия удара или влаги. Сначала диагностика — потом ремонт.',
    signs: 'Чёрный экран, вибрация без картинки, включается и сразу гаснет, реагирует только на зарядку.',
    how: 'Проверяем питание и дисплей, исключаем простые причины, при необходимости углубляемся в ремонт платы.',
    faq: [
      ['Это всегда дорого?', 'Нет. Иногда хватает кнопки, батареи или шлейфа. Цену говорим до работ.'],
      ['Можно при вас?', 'Да, большинство диагностик и типовых ремонтов — при вас за 30–60 минут.'],
      ['А если нецелесообразно чинить?', 'Скажем честно и не будем навязывать.'],
    ],
    prices: [
      ['Диагностика', 'бесплатно'],
      ['Типовой ремонт', 'от 1000₽'],
      ['Ремонт платы', 'по согласованию'],
    ],
  },
  {
    file: 'charge.html',
    title: 'Телефон не заряжается — ремонт в Хабаровске — REMPHONE RUSSIA',
    h1: 'Не заряжается телефон — Хабаровск',
    desc: 'Ремонт разъёма зарядки, шлейфа и контроллера в Хабаровске. iPhone, Samsung, Xiaomi. От 1300₽, гарантия 90 дней.',
    price: 'от 1300₽',
    what: 'Восстанавливаем зарядку: чистка или замена разъёма, шлейфа либо ремонт цепей питания — по результату диагностики.',
    signs: 'Не видит кабель, заряжается только в одном положении, греется разъём, заряд идёт рывками.',
    how: 'Проверяем кабель и блок, затем разъём и плату. Меняем изношенный порт или устраняем неисправность контроллера.',
    faq: [
      ['Может дело в кабеле?', 'Да, сначала исключаем кабель и блок. Если они исправны — смотрим телефон.'],
      ['Сколько по времени?', 'Замена разъёма обычно 30–60 минут.'],
      ['Гарантия?', '90 дней на работы и запчасти.'],
    ],
    prices: [
      ['Чистка разъёма', 'от 1000₽'],
      ['Замена разъёма / шлейфа', 'от 1300₽'],
      ['Ремонт контроллера', 'по диагностике'],
    ],
  },
];

for (const s of services) {
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
  const priceRows = s.prices.map((p) => `<tr><td>${p[0]}</td><td>${p[1]}</td></tr>`).join('');
  const numPrice = (s.price.match(/\d+/) || ['500'])[0];

  const html = `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${s.title}</title>
    <meta name="description" content="${s.desc}">
    <link rel="canonical" href="https://rem-phone.ru/services/${s.file}">
    <link rel="stylesheet" href="../styles.css">
    <meta property="og:title" content="${s.title}">
    <meta property="og:description" content="${s.desc}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://rem-phone.ru/services/${s.file}">
    <meta property="og:image" content="https://rem-phone.ru/og-image.jpg">
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": "${s.h1}",
        "provider": { "@type": "LocalBusiness", "name": "REMPHONE RUSSIA", "telephone": "+79144111730", "url": "https://rem-phone.ru/" },
        "areaServed": "Хабаровск",
        "offers": { "@type": "Offer", "priceCurrency": "RUB", "price": "${numPrice}", "description": "${s.price}" }
    }
    </script>
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Главная", "item": "https://rem-phone.ru/" },
            { "@type": "ListItem", "position": 2, "name": "Услуги", "item": "https://rem-phone.ru/services/" },
            { "@type": "ListItem", "position": 3, "name": "${s.h1}", "item": "https://rem-phone.ru/services/${s.file}" }
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
            <a href="../brands/">Бренды</a>
            <a href="../faq.html">FAQ</a>
            <a href="../contacts.html">Контакты</a>
        </nav>
        <a class="header-phone" href="tel:+79144111730">+7 914 411-17-30</a>
        <button class="burger" id="burger" aria-label="Меню"><span></span><span></span><span></span></button>
    </div>
</header>

<section class="hero" style="padding:60px 0">
    <div class="container">
        <p style="font-size:14px;opacity:.7;margin-bottom:12px"><a href="/">Главная</a> / <a href="./">Услуги</a> / ${s.h1}</p>
        <h1 style="font-size:42px;margin-bottom:16px">${s.h1}</h1>
        <p style="font-size:18px;max-width:720px">${s.desc}</p>
        <p style="margin-top:12px">30–60 минут · гарантия 90 дней · ${s.price}</p>
        <div class="hero-actions" style="margin-top:24px">
            <a href="#form" class="btn-primary">Оставить заявку</a>
            <a href="tel:+79144111730" class="btn-secondary">Позвонить</a>
            <a href="https://t.me/REMPHONE_RUSSIA_Bot" class="btn-secondary" target="_blank" rel="noopener">Telegram</a>
        </div>
    </div>
</section>

<section class="services-preview">
    <div class="container" style="max-width:900px">
        <h2>Что входит</h2>
        <p style="color:var(--text-light);margin:12px 0 28px">${s.what}</p>
        <h2>Признаки</h2>
        <p style="color:var(--text-light);margin:12px 0 28px">${s.signs}</p>
        <h2>Как чиним</h2>
        <p style="color:var(--text-light);margin:12px 0 28px">${s.how}</p>
        <h2>Ориентир цен в Хабаровске</h2>
        <table style="width:100%;margin:16px 0 28px;border-collapse:collapse">
            <thead><tr><th align="left">Вариант</th><th align="left">Цена</th></tr></thead>
            <tbody>${priceRows}</tbody>
        </table>
        <p style="color:var(--text-light);margin-bottom:28px">Точную сумму подтверждаем до начала работ. Смотрите также <a href="../cities/khabarovsk.html">ремонт в Хабаровске</a> и <a href="./">все услуги</a>.</p>
        <h2>FAQ</h2>
        <div class="faq-list">${faqHtml}</div>
    </div>
</section>

<section class="cta" id="form">
    <div class="container">
        <h2>Нужен ремонт?</h2>
        <p class="cta-desc">Перезвоним за несколько минут и назовём ориентир по вашей модели.</p>
        <div class="hero-actions" style="margin-top:16px;flex-wrap:wrap">
            <a href="https://t.me/REMPHONE_RUSSIA_Bot" class="btn-primary" target="_blank" rel="noopener">Telegram-бот</a>
            <a href="https://wa.me/79144111730" class="btn-secondary" target="_blank" rel="noopener">WhatsApp</a>
            <a href="tel:+79144111730" class="btn-secondary">+7 914 411-17-30</a>
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
  writeFileSync(join(root, s.file), html, 'utf8');
  console.log('Wrote', s.file);
}
