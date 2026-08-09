#!/usr/bin/env node
/**
 * Monthly SEO audit helpers:
 * - ensure off-geo city pages have noindex
 * - list HTML without canonical
 * - print Wordstat reminder checklist
 *
 * Usage: node seo/audit-monthly.mjs [--fix-noindex]
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const fix = process.argv.includes('--fix-noindex');

const OFF_GEO = [
  'cities/moscow.html',
  'cities/spb.html',
  'cities/kazan.html',
  'cities/novosibirsk.html',
  'cities/ekaterinburg.html',
  'cities/other.html',
];

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (['node_modules', '.git', 'seo', 'images', 'assets'].includes(name)) continue;
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) walk(full, out);
    else if (name.endsWith('.html')) out.push(full);
  }
  return out;
}

const missingNoindex = [];
for (const rel of OFF_GEO) {
  const full = join(root, rel);
  try {
    const html = readFileSync(full, 'utf8');
    if (!/name=["']robots["'][^>]*noindex/i.test(html) && !/content=["']noindex/i.test(html)) {
      missingNoindex.push(rel);
      if (fix) {
        const next = html.replace(
          /(<meta name="viewport"[^>]*>)/i,
          '$1\n    <meta name="robots" content="noindex, follow">'
        );
        writeFileSync(full, next, 'utf8');
        console.log('fixed noindex:', rel);
      }
    } else {
      console.log('ok noindex:', rel);
    }
  } catch {
    console.log('skip missing:', rel);
  }
}

const noCanonical = [];
for (const file of walk(root)) {
  const rel = relative(root, file).replace(/\\/g, '/');
  if (OFF_GEO.includes(rel)) continue;
  const html = readFileSync(file, 'utf8');
  if (!/rel=["']canonical["']/i.test(html)) noCanonical.push(rel);
}

console.log('\n=== Monthly audit ===');
console.log('Off-geo without noindex:', missingNoindex.length ? missingNoindex.join(', ') : 'none');
console.log('Pages missing canonical (sample):');
noCanonical.slice(0, 15).forEach((p) => console.log('  -', p));
if (noCanonical.length > 15) console.log(`  ... +${noCanonical.length - 15} more`);

console.log(`
Wordstat checklist (manual):
1. https://wordstat.yandex.ru — region Хабаровский край
2. Compare top queries with seo/SEMANTICS.md
3. Drop zero-demand URL ideas; boost growing clusters
4. Update seo/reports/ with monthly note
`);

if (missingNoindex.length && !fix) {
  console.log('Run with --fix-noindex to patch off-geo pages.');
  process.exitCode = 1;
}
