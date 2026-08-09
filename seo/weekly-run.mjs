#!/usr/bin/env node
/**
 * Weekly SEO ritual bootstrap:
 * 1) run health-check
 * 2) scaffold seo/reports/YYYY-MM-DD.md if missing
 *
 * Usage: node seo/weekly-run.mjs [--live]
 */
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const live = process.argv.includes('--live');
const today = new Date().toISOString().slice(0, 10);

const args = [join(__dirname, 'health-check.mjs')];
if (live) args.push('--live');

const hc = spawnSync(process.execPath, args, { cwd: root, encoding: 'utf8' });
process.stdout.write(hc.stdout || '');
process.stderr.write(hc.stderr || '');

const reportsDir = join(__dirname, 'reports');
mkdirSync(reportsDir, { recursive: true });
const reportPath = join(reportsDir, `${today}.md`);

let pagesCount = 0;
try {
  pagesCount = JSON.parse(readFileSync(join(__dirname, 'pages.json'), 'utf8')).length;
} catch {
  pagesCount = 0;
}

if (!existsSync(reportPath)) {
  const blocking = hc.status === 0 ? '0' : 'есть (см. вывод health-check)';
  const body = `# Еженедельный SEO-отчёт — rem-phone.ru

Период: неделя до ${today}

## 1. Индексация / техника

| Источник | Значение | Комментарий |
|----------|----------|-------------|
| URL в seo/pages.json | ${pagesCount} | |
| health-check errors | ${blocking} | \`node seo/health-check.mjs${live ? ' --live' : ''}\` |
| Sitemap | проверить 200 | https://rem-phone.ru/sitemap.xml |

## 2. Сделано на этой неделе

- [ ] ...

## 3. Следующие 1–2 URL (из SEMANTICS)

1.
2.

## 4. Конверсия (Метрика 110956593)

| Цель | За неделю |
|------|-----------|
| phone_click | TBD |
| whatsapp_click | TBD |
| telegram_click | TBD |
| form_submit | TBD |

## 5. Владельцу вручную

- [ ] Переобход новых URL в Яндекс.Вебмастере
- [ ] Яндекс Бизнес — чеклист seo/YANDEX_BUSINESS.md
- [ ] Lead pipeline — seo/LEAD_PIPELINE.md (если заявки с сайта не доходят)

## 6. Вывод

...
`;
  writeFileSync(reportPath, body, 'utf8');
  console.log(`\nReport scaffolded: seo/reports/${today}.md`);
} else {
  console.log(`\nReport already exists: seo/reports/${today}.md`);
}

process.exitCode = hc.status || 0;
