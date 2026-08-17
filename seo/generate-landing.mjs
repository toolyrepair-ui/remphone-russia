#!/usr/bin/env node
/**
 * Draft landing page generator (city / service / brand).
 * Does NOT publish automatically — review the draft before moving to production.
 *
 * Usage:
 *   node seo/generate-landing.mjs --type city --slug komsomolsk --name "Комсомольск-на-Амуре"
 *   node seo/generate-landing.mjs --type service --slug speaker --name "Ремонт динамика" --price "от 1000₽"
 *   node seo/generate-landing.mjs --type brand --slug realme --name "Realme"
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

function arg(name, fallback = '') {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? process.argv[i + 1] : fallback;
}

const type = arg('type');
const slug = arg('slug');
const name = arg('name');
const price = arg('price', 'от 1000₽');

if (!type || !slug || !name) {
  console.error('Required: --type city|service|brand --slug <slug> --name "<Title>"');
  process.exit(1);
}

const phone = '+7 914 411-17-30';
const phoneTel = '+79144111730';
const tg = 'https://t.me/REMPHONE_RUSSIA_Bot';

const draftsDir = join(root, 'seo', 'drafts');
mkdirSync(draftsDir, { recursive: true });

let outRel;
let title;
let description;
let h1;
let intro;
let canonical;
let crumbs;

if (type === 'city') {
  outRel = `cities/${slug}.html`;
  title = `Ремонт телефонов в ${name} — REMPHONE RUSSIA`;
  description = `Ремонт iPhone, Samsung, Xiaomi в ${name}. Выезд мастера, гарантия 90 дней, ремонт от 30 минут. Цены от 1000₽.`;
  h1 = `Ремонт телефонов в ${name}`;
  intro = `Чиним смартфоны в ${name}: замена экрана, батареи, ремонт после воды. Выезд мастера, бесплатная диагностика, гарантия 90 дней.`;
  canonical = `https://rem-phone.ru/cities/${slug}.html`;
  crumbs = [
    { name: 'Главная', url: 'https://rem-phone.ru/' },
    { name: 'Города', url: 'https://rem-phone.ru/cities/' },
    { name: name, url: canonical },
  ];
} else if (type === 'service') {
  outRel = `services/${slug}.html`;
  title = `${name} в Хабаровске — REMPHONE RUSSIA`;
  description = `${name} iPhone, Samsung, Xiaomi в Хабаровске. ${price}. Гарантия 90 дней, выезд мастера.`;
  h1 = `${name} в Хабаровске`;
  intro = `${name} для популярных моделей. Ориентир цены — ${price}. Срок обычно 30–60 минут, гарантия 90 дней.`;
  canonical = `https://rem-phone.ru/services/${slug}.html`;
  crumbs = [
    { name: 'Главная', url: 'https://rem-phone.ru/' },
    { name: 'Услуги', url: 'https://rem-phone.ru/services/' },
    { name: name, url: canonical },
  ];
} else if (type === 'brand') {
  outRel = `brands/${slug}.html`;
  title = `Ремонт ${name} в Хабаровске — REMPHONE RUSSIA`;
  description = `Ремонт ${name} в Хабаровске: экран, батарея, зарядка, после воды. Гарантия 90 дней.`;
  h1 = `Ремонт ${name} в Хабаровске`;
  intro = `Чиним ${name} всех актуальных серий. Диагностика бесплатно, запчасти под модель, гарантия 90 дней.`;
  canonical = `https://rem-phone.ru/brands/${slug}.html`;
  crumbs = [
    { name: 'Главная', url: 'https://rem-phone.ru/' },
    { name: 'Бренды', url: 'https://rem-phone.ru/brands/' },
    { name: name, url: canonical },
  ];
} else {
  console.error('Unknown type. Use city|service|brand');
  process.exit(1);
}

const base = type === 'city' || type === 'service' || type === 'brand' ? '../' : '';
const breadcrumbLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: crumbs.map((c, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: c.name,
    item: c.url,
  })),
};

const faqLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: `Сколько стоит ремонт в ${type === 'city' ? name : 'Хабаровске'}?`,
      acceptedAnswer: {
        '@type': 'Answer',
        text: `Ориентир — ${price}. Точную цену назовём после диагностики, до начала работ.`,
      },
    },
    {
      '@type': 'Question',
      name: 'Есть ли выезд мастера?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Да, мастер выезжает по адресу или можно передать устройство в сервис.',
      },
    },
    {
      '@type': 'Question',
      name: 'Какая гарантия?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '90 дней на работы и установленные запчасти.',
      },
    },
  ],
};

const html = `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <meta name="description" content="${description}">
    <link rel="canonical" href="${canonical}">
    <link rel="stylesheet" href="${base}styles.css">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="${canonical}">
    <meta property="og:image" content="https://rem-phone.ru/og-image.jpg">
    <script type="application/ld+json">
${JSON.stringify(breadcrumbLd, null, 4)}
    </script>
    <script type="application/ld+json">
${JSON.stringify(faqLd, null, 4)}
    </script>
</head>
<body>
<!-- DRAFT: review text, then move to ${outRel} and add to seo/pages.json -->
<header class="header" id="header">
    <div class="container">
        <a href="/" class="logo">REMPHONE <span>RUSSIA</span></a>
        <nav class="nav" id="nav">
            <a href="${base}services/">Услуги</a>
            <a href="${base}cities/">Города</a>
            <a href="${base}brands/">Бренды</a>
            <a href="${base}faq.html">FAQ</a>
            <a href="${base}contacts.html">Контакты</a>
        </nav>
        <a class="header-phone" href="tel:${phoneTel}">${phone}</a>
        <button class="burger" id="burger" aria-label="Меню"><span></span><span></span><span></span></button>
    </div>
</header>

<section class="hero" style="padding:60px 0">
    <div class="container">
        <nav class="breadcrumbs" aria-label="Хлебные крошки" style="margin-bottom:16px;font-size:14px;opacity:.75">
            ${crumbs.map((c, i) => (i < crumbs.length - 1 ? `<a href="${c.url}">${c.name}</a> / ` : `<span>${c.name}</span>`)).join('')}
        </nav>
        <h1 style="font-size:42px;margin-bottom:16px">${h1}</h1>
        <p style="font-size:18px;max-width:720px">${intro}</p>
        <p style="margin-top:12px">⚡ 30–60 минут · 🛡 гарантия 90 дней · 🔧 диагностика бесплатно</p>
        <div class="hero-actions" style="margin-top:24px">
            <a href="#form" class="btn-primary">Оставить заявку</a>
            <a href="tel:${phoneTel}" class="btn-secondary">${phone}</a>
            <a href="${tg}" class="btn-secondary" target="_blank" rel="noopener">Telegram</a>
        </div>
    </div>
</section>

<section class="services-preview">
    <div class="container" style="max-width:900px">
        <h2>TODO: уникальный блок про локацию / услугу / бренд</h2>
        <p style="color:var(--text-light);margin:16px 0 28px">Замените этот абзац живыми деталями: районы выезда, типичные сроки, ориентир цен, чем отличаетесь от конкурентов.</p>

        <h2>Ориентир цен</h2>
        <table style="width:100%;margin:16px 0 28px;border-collapse:collapse">
            <thead><tr><th align="left">Работы</th><th align="left">Ориентир</th></tr></thead>
            <tbody>
                <tr><td>Диагностика</td><td>бесплатно</td></tr>
                <tr><td>Замена экрана</td><td>от 2000₽</td></tr>
                <tr><td>Замена батареи</td><td>от 2000₽</td></tr>
                <tr><td>После воды</td><td>от 1500₽</td></tr>
            </tbody>
        </table>

        <h2>Частые вопросы</h2>
        <div class="faq-list">
            <div class="faq-item active">
                <div class="faq-question">Сколько стоит?</div>
                <div class="faq-answer">Ориентир — ${price}. Точную сумму назовём до ремонта.</div>
            </div>
            <div class="faq-item">
                <div class="faq-question">Есть выезд?</div>
                <div class="faq-answer">Да, мастер выезжает по договорённости.</div>
            </div>
            <div class="faq-item">
                <div class="faq-question">Какая гарантия?</div>
                <div class="faq-answer">90 дней на работы и запчасти.</div>
            </div>
        </div>
    </div>
</section>

<section class="cta" id="form">
    <div class="container">
        <h2>Заявка</h2>
        <p><a class="btn-primary" href="${tg}" target="_blank" rel="noopener">Открыть Telegram-бот</a>
        <a class="btn-secondary" href="tel:${phoneTel}">Позвонить</a></p>
    </div>
</section>

<script src="${base}script.js"></script>
<script src="${base}analytics.js"></script>
</body>
</html>
`;

const draftPath = join(draftsDir, `${type}-${slug}.html`);
writeFileSync(draftPath, html, 'utf8');
console.log(`Draft written: seo/drafts/${type}-${slug}.html`);
console.log(`Target path after review: ${outRel}`);
console.log('Remember: add URL to seo/pages.json and run node seo/generate-sitemap.mjs');
