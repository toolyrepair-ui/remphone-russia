#!/usr/bin/env node
/**
 * Собирает цифры для dashboard/data.json (раз в день из GitHub Actions).
 * Без токена Метрики не падает: пишет sitemap + прошлые значения.
 *
 *   node dashboard/collect.mjs
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const outPath = join(__dirname, 'data.json');
const METRIKA_ID = 111453492;
const GOAL_SUBMIT = 595078292; // request-form-submit
const API = 'https://api-metrika.yandex.net/stat/v1/data';

loadEnvFile(join(root, '.env.dashboard'));
loadEnvFile(join(root, '.env'));

const token = (process.env.YANDEX_METRIKA_TOKEN || '').trim();
const leadUrl = (process.env.LEAD_STATS_URL || '').trim();
const leadSecret = (process.env.LEAD_API_SECRET || '').trim();

function loadEnvFile(path) {
  if (!existsSync(path)) return;
  for (const raw of readFileSync(path, 'utf8').split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq < 1) continue;
    const key = line.slice(0, eq).trim();
    let val = line.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val;
  }
}

function readPrev() {
  if (!existsSync(outPath)) return {};
  try {
    return JSON.parse(readFileSync(outPath, 'utf8'));
  } catch {
    return {};
  }
}

function sitemapCount() {
  const sm = join(root, 'sitemap.xml');
  if (existsSync(sm)) {
    const n = (readFileSync(sm, 'utf8').match(/<url>/g) || []).length;
    if (n) return n;
  }
  try {
    return JSON.parse(readFileSync(join(root, 'seo', 'pages.json'), 'utf8')).length;
  } catch {
    return null;
  }
}

function pct(leads, visits) {
  if (leads == null || visits == null || visits <= 0) return null;
  return Math.round((leads / visits) * 1000) / 10;
}

async function metrika(params) {
  const q = new URLSearchParams({ ids: String(METRIKA_ID), accuracy: 'full', ...params });
  const res = await fetch(`${API}?${q}`, {
    headers: {
      Authorization: `OAuth ${token}`,
      Accept: 'application/json',
    },
  });
  const text = await res.text();
  let json = {};
  try {
    json = JSON.parse(text);
  } catch {
    json = { raw: text.slice(0, 400) };
  }
  if (!res.ok) {
    const msg = json.message || json.error || text.slice(0, 200);
    throw new Error(`Metrika ${res.status}: ${msg}`);
  }
  return json;
}

function totalsOf(json) {
  const t = json.totals;
  if (!Array.isArray(t) || !t.length) return [];
  return Array.isArray(t[0]) ? t[0] : t;
}

function parseBytime(json) {
  const intervals = json.time_intervals || [];
  const row = json.data && json.data[0];
  const metrics = row && Array.isArray(row.metrics) ? row.metrics : [];
  const visits = metrics[0] || [];
  const views = metrics[1] || [];
  const leads = metrics[2] || [];
  return intervals.map((pair, i) => ({
    date: Array.isArray(pair) ? pair[0] : String(pair),
    visits: Number(visits[i] || 0),
    pageviews: Number(views[i] || 0),
    leads: Number(leads[i] || 0),
  }));
}

async function fetchMetrika() {
  const [day, week, month, seriesJson] = await Promise.all([
    metrika({
      metrics: `ym:s:visits,ym:s:pageviews,ym:s:goal${GOAL_SUBMIT}reaches`,
      date1: 'today',
      date2: 'today',
    }),
    metrika({
      metrics: `ym:s:visits,ym:s:pageviews,ym:s:goal${GOAL_SUBMIT}reaches`,
      date1: '6daysAgo',
      date2: 'today',
    }),
    metrika({
      metrics: `ym:s:visits,ym:s:pageviews,ym:s:goal${GOAL_SUBMIT}reaches`,
      date1: '29daysAgo',
      date2: 'today',
    }),
    fetch(`${API}/bytime?${new URLSearchParams({
      ids: String(METRIKA_ID),
      accuracy: 'full',
      metrics: `ym:s:visits,ym:s:pageviews,ym:s:goal${GOAL_SUBMIT}reaches`,
      date1: '6daysAgo',
      date2: 'today',
      group: 'day',
    })}`, {
      headers: { Authorization: `OAuth ${token}`, Accept: 'application/json' },
    }).then(async (res) => {
      const json = await res.json();
      if (!res.ok) throw new Error(`Metrika bytime ${res.status}`);
      return json;
    }),
  ]);

  const d = totalsOf(day).map(Number);
  const w = totalsOf(week).map(Number);
  const m = totalsOf(month).map(Number);

  return {
    visits: { day: d[0] ?? 0, week: w[0] ?? 0, month: m[0] ?? 0 },
    pageviews: { day: d[1] ?? 0, week: w[1] ?? 0, month: m[1] ?? 0 },
    leads: { day: d[2] ?? 0, week: w[2] ?? 0, month: m[2] ?? 0, source: 'metrika_goal_request-form-submit' },
    series: parseBytime(seriesJson),
  };
}

async function fetchLeads() {
  if (!leadUrl) return null;
  const headers = { Accept: 'application/json' };
  if (leadSecret) headers.Authorization = `Bearer ${leadSecret}`;
  const res = await fetch(leadUrl, { headers });
  if (!res.ok) throw new Error(`Lead stats ${res.status}`);
  const json = await res.json();
  return {
    day: json.day ?? json.leads_day ?? json.today ?? null,
    week: json.week ?? json.leads_week ?? null,
    month: json.month ?? json.leads_month ?? null,
    source: 'lead_api',
  };
}

const prev = readPrev();
const notes = [];
const data = {
  updated_at: new Date().toISOString(),
  metrika_id: METRIKA_ID,
  source: 'partial',
  visits: prev.visits || { day: null, week: null, month: 8 },
  pageviews: prev.pageviews || { day: null, week: null, month: null },
  leads: prev.leads || { day: null, week: null, month: null, source: null },
  conversion_visit_to_lead: prev.conversion_visit_to_lead ?? null,
  index: {
    sitemap_urls: sitemapCount(),
    yandex_indexed: prev.index?.yandex_indexed ?? null,
    google_indexed: prev.index?.google_indexed ?? null,
    note: 'Индексация Вебмастера/GSC — позже, когда будет API-токен',
  },
  series: prev.series || [],
  notes: [],
};

if (token) {
  try {
    const m = await fetchMetrika();
    data.visits = m.visits;
    data.pageviews = m.pageviews;
    data.leads = m.leads;
    data.series = m.series;
    data.source = 'metrika';
  } catch (e) {
    notes.push(`Метрика: ${e.message}`);
    data.source = prev.source || 'error';
  }
} else {
  notes.push('Нет YANDEX_METRIKA_TOKEN — визиты из последнего удачного сбора / отчёта SEO');
  if (!prev.visits) {
    data.visits = { day: null, week: null, month: 8 };
    notes.push('Месяц: 8 визитов (Метрика 15.07–14.08.2026, seo/reports/2026-08-16.md)');
  }
}

try {
  const extra = await fetchLeads();
  if (extra) {
    data.leads = extra;
    if (data.source === 'metrika') data.source = 'metrika+lead_api';
  }
} catch (e) {
  notes.push(`Заявки API: ${e.message}`);
}

data.conversion_visit_to_lead = pct(data.leads.week, data.visits.week);
data.notes = notes;

writeFileSync(outPath, JSON.stringify(data, null, 2) + '\n', 'utf8');
console.log(`Wrote ${outPath} source=${data.source} visits.week=${data.visits.week} leads.week=${data.leads.week}`);
if (notes.length) notes.forEach((n) => console.log('  !', n));
