#!/usr/bin/env node
/**
 * Generates sitemap.xml from seo/pages.json
 * Usage: node seo/generate-sitemap.mjs
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const base = 'https://rem-phone.ru';
const today = new Date().toISOString().slice(0, 10);

const pages = JSON.parse(readFileSync(join(__dirname, 'pages.json'), 'utf8'));

function fileForPath(p) {
  if (p === '/') return join(root, 'index.html');
  const clean = p.replace(/\/$/, '');
  const asFile = join(root, clean.replace(/^\//, ''));
  if (existsSync(asFile)) return asFile;
  const asIndex = join(root, clean.replace(/^\//, ''), 'index.html');
  if (existsSync(asIndex)) return asIndex;
  return null;
}

const missing = [];
const urls = pages.filter((page) => {
  const file = fileForPath(page.path);
  if (!file) {
    missing.push(page.path);
    return false;
  }
  return true;
});

if (missing.length) {
  console.warn('Skipping missing pages:');
  missing.forEach((p) => console.warn('  -', p));
}

const body = urls
  .map(
    (page) => `  <url>
    <loc>${base}${page.path === '/' ? '/' : page.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq || 'weekly'}</changefreq>
    <priority>${Number(page.priority).toFixed(1)}</priority>
  </url>`
  )
  .join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;

writeFileSync(join(root, 'sitemap.xml'), xml, 'utf8');
console.log(`Wrote sitemap.xml with ${urls.length} URLs`);
