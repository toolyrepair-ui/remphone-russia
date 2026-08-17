import { writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'brands');

function page({ file, brand, title, h1, desc, intro, prices, faq, sibling }) {
  const faqHtml = faq
    .map(
      (qa, i) =>
        `<div class="faq-item${i === 0 ? ' active' : ''}"><div class="faq-question">${qa[0]}</div><div class="faq-answer">${qa[1]}</div></div>`
    )
    .join('\n');
  const faqLd = faq.map((qa) => ({
    '@type': 'Question',
    name: qa[0],
    acceptedAnswer: { '@type': 'Answer', text: qa[1] },
  }));
  const priceRows = prices.map((p) => `<tr><td>${p[0]}</td><td>${p[1]}</td></tr>`).join('');
  const url = `https://rem-phone.ru/brands/${file}`;

  const html = `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <meta name="description" content="${desc}">
    <link rel="canonical" href="${url}">
    <link rel="stylesheet" href="../styles.css">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${desc}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="${url}">
    <meta property="og:image" content="https://rem-phone.ru/og-image.jpg">
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "${h1}",
      "brand": { "@type": "Brand", "name": "${brand}" },
      "provider": { "@type": "LocalBusiness", "name": "REMPHONE RUSSIA", "telephone": "+79144111730", "url": "https://rem-phone.ru/" },
      "areaServed": "Хабаровск"
    }
    </script>
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Главная", "item": "https://rem-phone.ru/" },
        { "@type": "ListItem", "position": 2, "name": "${brand}", "item": "https://rem-phone.ru/brands/${sibling}" },
        { "@type": "ListItem", "position": 3, "name": "Замена экрана", "item": "${url}" }
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
            <a href="../contacts.html">Контакты</a>
        </nav>
        <a class="header-phone" href="tel:+79144111730">+7 914 411-17-30</a>
        <button class="burger" id="burger" aria-label="Меню"><span></span><span></span><span></span></button>
    </div>
</header>
<section class="hero" style="padding:60px 0">
    <div class="container">
        <p style="font-size:14px;opacity:.7;margin-bottom:12px"><a href="/">Главная</a> / <a href="${sibling}">${brand}</a> / Замена экрана</p>
        <h1>${h1}</h1>
        <p style="font-size:18px;max-width:720px;margin-top:12px">${intro}</p>
        <div class="hero-actions" style="margin-top:24px;flex-wrap:wrap">
            <a href="#form" class="btn-primary">Оставить заявку</a>
            <a href="tel:+79144111730" class="btn-secondary">Позвонить</a>
            <a href="../services/screen.html" class="btn-secondary">Все экраны</a>
        </div>
    </div>
</section>
<section class="services-preview">
    <div class="container" style="max-width:900px">
        <h2>Ориентир цен — ${brand}, Хабаровск</h2>
        <table style="width:100%;margin:16px 0 28px;border-collapse:collapse">
            <thead><tr><th align="left">Модель / серия</th><th align="left">Экран</th></tr></thead>
            <tbody>${priceRows}</tbody>
        </table>
        <p style="color:var(--text-light);margin-bottom:24px">Смотрите также: <a href="${sibling}">ремонт ${brand}</a>, <a href="../cities/khabarovsk/screen.html">экран в Хабаровске</a>, <a href="iphone-screen.html">экран iPhone</a>.</p>
        <h2>FAQ</h2>
        <div class="faq-list">${faqHtml}</div>
    </div>
</section>
<section class="cta" id="form">
    <div class="container">
        <h2>Заявка на экран ${brand}</h2>
        <p class="cta-desc">Перезвоним за несколько минут. Или сразу: <a href="tel:+79144111730">+7 914 411-17-30</a></p>
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
  writeFileSync(join(root, file), html, 'utf8');
  console.log('wrote', file);
}

page({
  file: 'samsung-screen.html',
  brand: 'Samsung',
  sibling: 'samsung.html',
  title: 'Замена экрана Samsung в Хабаровске — REMPHONE RUSSIA',
  h1: 'Замена экрана Samsung Galaxy в Хабаровске',
  desc: 'Замена экрана Samsung в Хабаровске: A-серия, S и складные. 30–60 минут, гарантия 90 дней. От 2400₽.',
  intro: 'Меняем AMOLED/LCD модули Galaxy A, S и при необходимости Z Fold/Flip. Проверяем сенсор и цветопередачу. Выезд по городу.',
  prices: [
    ['Galaxy A-серия', 'от 2400₽'],
    ['Galaxy S-серия', 'от 3200₽'],
    ['Z Fold / Z Flip', 'по диагностике'],
  ],
  faq: [
    ['Сколько стоит экран Samsung в Хабаровске?', 'A-серия от 2400₽, S-серия от 3200₽. Точную цену назовём по модели.'],
    ['Берёте складные?', 'Да, после диагностики. Срок зависит от наличия модуля.'],
    ['Гарантия?', '90 дней на работы и дисплей.'],
  ],
});

page({
  file: 'xiaomi-screen.html',
  brand: 'Xiaomi',
  sibling: 'xiaomi.html',
  title: 'Замена экрана Xiaomi в Хабаровске — REMPHONE RUSSIA',
  h1: 'Замена экрана Xiaomi, Redmi и POCO в Хабаровске',
  desc: 'Замена экрана Xiaomi / Redmi / POCO в Хабаровске. Часто в день обращения, гарантия 90 дней. От 2100₽.',
  intro: 'На ходовые Redmi и POCO модули часто в наличии — поэтому ремонт обычно 30–60 минут. Диагностика бесплатно.',
  prices: [
    ['Redmi / POCO', 'от 2100₽'],
    ['Xiaomi флагманы', 'от 3700₽'],
    ['Стекло (если применимо)', 'от 700₽'],
  ],
  faq: [
    ['Сколько стоит экран Xiaomi?', 'Ориентир от 2100₽. Зависит от модели.'],
    ['Есть запчасти на Redmi?', 'На популярные — да. Если под заказ, скажем срок до старта.'],
    ['Гарантия?', '90 дней.'],
  ],
});
