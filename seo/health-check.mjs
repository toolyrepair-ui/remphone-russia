#!/usr/bin/env node
/**
 * SEO health-check for rem-phone.ru (local files + optional live URLs)
 * Usage:
 *   node seo/health-check.mjs
 *   node seo/health-check.mjs --live
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const base = 'https://rem-phone.ru';
const live = process.argv.includes('--live');

const errors = [];
const warnings = [];

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name === '.git' || name === 'seo' || name === 'images' || name === 'assets') continue;
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) walk(full, out);
    else if (name.endsWith('.html') && !name.startsWith('yandex_') && !name.startsWith('google')) {
      out.push(full);
    }
  }
  return out;
}

function extract(html, re) {
  const m = html.match(re);
  return m ? m[1].trim() : '';
}

const pages = walk(root);
const titles = new Map();
const descriptions = new Map();

for (const file of pages) {
  const rel = relative(root, file).replace(/\\/g, '/');
  const html = readFileSync(file, 'utf8');
  const title = extract(html, /<title[^>]*>([^<]*)<\/title>/i);
  const desc = extract(html, /<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i)
    || extract(html, /<meta[^>]*content=["']([^"']*)["'][^>]*name=["']description["']/i);
  const canonical = extract(html, /<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["']/i)
    || extract(html, /<link[^>]*href=["']([^"']*)["'][^>]*rel=["']canonical["']/i);
  const ogTitle = extract(html, /<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']*)["']/i)
    || extract(html, /<meta[^>]*content=["']([^"']*)["'][^>]*property=["']og:title["']/i);

  if (!title) errors.push(`${rel}: missing <title>`);
  if (!desc) warnings.push(`${rel}: missing meta description`);
  if (!canonical) warnings.push(`${rel}: missing canonical`);
  if (!ogTitle) warnings.push(`${rel}: missing og:title`);

  if (title) {
    if (titles.has(title)) warnings.push(`${rel}: duplicate title with ${titles.get(title)}`);
    else titles.set(title, rel);
  }
  if (desc) {
    if (descriptions.has(desc)) warnings.push(`${rel}: duplicate description with ${descriptions.get(desc)}`);
    else descriptions.set(desc, rel);
  }

  const hrefs = [...html.matchAll(/href=["']([^"'#]+)["']/gi)].map((m) => m[1]);
  for (const href of hrefs) {
    if (/^(https?:|mailto:|tel:|javascript:)/i.test(href)) continue;
    if (href.startsWith('//')) continue;
    let target;
    if (href.startsWith('/')) target = join(root, href.slice(1));
    else target = join(dirname(file), href);
    // directory links like services/
    if (href.endsWith('/')) {
      const idx = join(target, 'index.html');
      if (!existsSync(idx) && !existsSync(target)) {
        warnings.push(`${rel}: broken local link ${href}`);
      }
      continue;
    }
    if (!existsSync(target)) {
      // try as directory index
      if (!existsSync(join(target, 'index.html'))) {
        warnings.push(`${rel}: broken local link ${href}`);
      }
    }
  }
}

async function checkLive() {
  const pagesJson = JSON.parse(readFileSync(join(__dirname, 'pages.json'), 'utf8'));
  for (const page of pagesJson) {
    const url = base + (page.path === '/' ? '/' : page.path);
    try {
      const res = await fetch(url, { redirect: 'follow' });
      if (!res.ok) errors.push(`LIVE ${url}: HTTP ${res.status}`);
    } catch (e) {
      errors.push(`LIVE ${url}: ${e.message}`);
    }
  }
  try {
    const sm = await fetch(`${base}/sitemap.xml`);
    if (!sm.ok) errors.push(`LIVE sitemap.xml: HTTP ${sm.status}`);
    else {
      const text = await sm.text();
      if (!text.includes('<urlset')) errors.push('LIVE sitemap.xml: not a valid urlset');
    }
  } catch (e) {
    errors.push(`LIVE sitemap.xml: ${e.message}`);
  }
}

if (live) {
  await checkLive();
}

console.log(`Checked ${pages.length} HTML pages`);
if (warnings.length) {
  console.log(`\nWarnings (${warnings.length}):`);
  warnings.slice(0, 40).forEach((w) => console.log('  !', w));
  if (warnings.length > 40) console.log(`  ... +${warnings.length - 40} more`);
}
if (errors.length) {
  console.log(`\nErrors (${errors.length}):`);
  errors.forEach((e) => console.log('  x', e));
  process.exitCode = 1;
} else {
  console.log('\nOK: no blocking errors');
}
