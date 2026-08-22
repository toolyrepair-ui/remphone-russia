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
const GOAL_SUBMIT = 595078292; // request-form-submit — подтверждённая заявка с формы
const GOAL_CONTACTS = {
  call: 595078285, // make-call
  whatsapp: 595078294,
  telegram: 595078295,
  form_open: 595078291, // request-form-open
};
const API = 'https://api-metrika.yandex.net/stat/v1/data';
const healthPath = join(__dirname, 'health.json');

loadEnvFile(join(root, '.env.dashboard'));
loadEnvFile(join(root, '.env'));

const token = (process.env.YANDEX_METRIKA_TOKEN || '').trim();
const webmasterToken = (process.env.YANDEX_WEBMASTER_TOKEN || token).trim();
const leadUrl = (process.env.LEAD_STATS_URL || '').trim();
const leadSecret = (
  process.env.LEAD_STATS_SECRET ||
  process.env.LEAD_API_SECRET ||
  ''
).trim();
const WM_API = 'https://api.webmaster.yandex.net/v4';

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

function emptyContacts() {
  return {
    day: { call: null, whatsapp: null, telegram: null, form_open: null },
    week: { call: null, whatsapp: null, telegram: null, form_open: null },
    source: null,
    note: 'Клики контактов (цели Метрики). Не заявки. Цели email в Метрике нет.',
  };
}

function countOrNull(value) {
  if (value === null || value === undefined || value === '') return null;
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? n : null;
}

function pipelinePeriod(raw, period) {
  const direct = raw?.[period];
  const block = direct && typeof direct === 'object' ? direct : {};
  return {
    accepted: countOrNull(block.accepted ?? (typeof direct === 'number' ? direct : raw?.accepted?.[period])),
    delivered: countOrNull(block.delivered ?? raw?.delivered?.[period]),
    pending: countOrNull(block.pending ?? raw?.pending?.[period]),
    failed: countOrNull(block.failed ?? raw?.failed?.[period]),
  };
}

function normalizePipeline(json) {
  const raw = json?.pipeline && typeof json.pipeline === 'object' ? json.pipeline : json;
  return {
    accepted: countOrNull(typeof raw?.accepted === 'object' ? raw.accepted.total : raw?.accepted),
    delivered: countOrNull(typeof raw?.delivered === 'object' ? raw.delivered.total : raw?.delivered),
    pending: countOrNull(typeof raw?.pending === 'object' ? raw.pending.total : raw?.pending),
    failed: countOrNull(typeof raw?.failed === 'object' ? raw.failed.total : raw?.failed),
    oldest_pending_at:
      typeof raw?.oldest_pending_at === 'string' && raw.oldest_pending_at ? raw.oldest_pending_at : null,
    day: pipelinePeriod(raw, 'day'),
    week: pipelinePeriod(raw, 'week'),
    month: pipelinePeriod(raw, 'month'),
    source: 'lead_stats_api',
  };
}

function readHealth(prevHealth) {
  if (existsSync(healthPath)) {
    try {
      return JSON.parse(readFileSync(healthPath, 'utf8'));
    } catch {
      /* fall through */
    }
  }
  return prevHealth || null;
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

async function fetchContacts() {
  const metrics = [
    `ym:s:goal${GOAL_CONTACTS.call}reaches`,
    `ym:s:goal${GOAL_CONTACTS.whatsapp}reaches`,
    `ym:s:goal${GOAL_CONTACTS.telegram}reaches`,
    `ym:s:goal${GOAL_CONTACTS.form_open}reaches`,
  ].join(',');
  const [day, week] = await Promise.all([
    metrika({ metrics, date1: 'today', date2: 'today' }),
    metrika({ metrics, date1: '6daysAgo', date2: 'today' }),
  ]);
  const d = totalsOf(day).map(Number);
  const w = totalsOf(week).map(Number);
  return {
    day: {
      call: d[0] ?? null,
      whatsapp: d[1] ?? null,
      telegram: d[2] ?? null,
      form_open: d[3] ?? null,
    },
    week: {
      call: w[0] ?? null,
      whatsapp: w[1] ?? null,
      telegram: w[2] ?? null,
      form_open: w[3] ?? null,
    },
    source: 'metrika_goals',
    note: 'Клики контактов, не заявки. Email в Метрике цели нет — не выдумывать нули.',
  };
}

async function wmGet(path, wmToken) {
  const res = await fetch(`${WM_API}${path}`, {
    headers: { Authorization: `OAuth ${wmToken}`, Accept: 'application/json' },
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = json.error_message || json.message || json.error_code || JSON.stringify(json).slice(0, 200);
    throw new Error(`Webmaster ${res.status}: ${msg}`);
  }
  return json;
}

function pickHostId(hosts) {
  const list = hosts.hosts || hosts || [];
  const want = ['https:rem-phone.ru:443', 'http:rem-phone.ru:80', 'https:www.rem-phone.ru:443'];
  for (const id of want) {
    const hit = list.find((h) => (h.host_id || h.hostId) === id);
    if (hit) return hit.host_id || hit.hostId;
  }
  const hit = list.find((h) => String(h.ascii_host_url || h.unicode_host_url || h.host_id || '').includes('rem-phone.ru'));
  return hit ? (hit.host_id || hit.hostId) : null;
}

async function fetchWebmasterIndex() {
  if (!webmasterToken) return null;
  const user = await wmGet('/user', webmasterToken);
  const userId = user.user_id || user.userId;
  if (!userId) throw new Error('Webmaster: нет user_id');
  const hosts = await wmGet(`/user/${userId}/hosts`, webmasterToken);
  const hostId = pickHostId(hosts);
  if (!hostId) throw new Error('Webmaster: хост rem-phone.ru не найден');
  const summary = await wmGet(`/user/${userId}/hosts/${encodeURIComponent(hostId)}/summary`, webmasterToken);
  const n = summary.searchable_pages_count;
  if (n == null) throw new Error('Webmaster: нет searchable_pages_count');
  return Number(n);
}

async function fetchPipeline() {
  if (!leadUrl) return null;
  const headers = { Accept: 'application/json' };
  if (leadSecret) headers.Authorization = `Bearer ${leadSecret}`;
  const res = await fetch(leadUrl, { headers });
  if (!res.ok) throw new Error(`Lead stats ${res.status}`);
  const json = await res.json();
  return normalizePipeline(json);
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
  metrika_accepted:
    prev.metrika_accepted || prev.leads || { day: null, week: null, month: null, source: null },
  pipeline: prev.pipeline || null,
  conversion_visit_to_lead: prev.conversion_visit_to_lead ?? null,
  index: {
    sitemap_urls: sitemapCount(),
    yandex_indexed: prev.index?.yandex_indexed ?? null,
    google_indexed: prev.index?.google_indexed ?? null,
    google_indexed_approx: prev.index?.google_indexed_approx ?? null,
    note: prev.index?.note || 'Яндекс: searchable_pages_count. Google: точного API нет, оценка позже.',
  },
  contacts: prev.contacts || emptyContacts(),
  health: readHealth(prev.health),
  series: prev.series || [],
  notes: [],
};

if (!data.health) {
  notes.push('health.json ещё нет — live-проверка не запускалась');
}

if (token) {
  try {
    const m = await fetchMetrika();
    data.visits = m.visits;
    data.pageviews = m.pageviews;
    data.leads = m.leads;
    data.metrika_accepted = m.leads;
    data.series = m.series;
    data.source = 'metrika';
  } catch (e) {
    notes.push(`Метрика: ${e.message}`);
    data.source = prev.source || 'error';
  }
  try {
    data.contacts = await fetchContacts();
  } catch (e) {
    notes.push(`Клики контактов: ${e.message}`);
    if (!data.contacts || !data.contacts.source) data.contacts = emptyContacts();
  }
} else {
  notes.push('Нет YANDEX_METRIKA_TOKEN — визиты из последнего удачного сбора / отчёта SEO');
  if (!prev.visits) {
    data.visits = { day: null, week: null, month: 8 };
    notes.push('Месяц: 8 визитов (Метрика 15.07–14.08.2026, seo/reports/2026-08-16.md)');
  }
  if (!prev.contacts || prev.contacts.week?.call == null) {
    notes.push('Клики звонка / WhatsApp / Telegram не подтянуты (нет токена). Нули не подставлять.');
  }
}

try {
  const pipeline = await fetchPipeline();
  if (pipeline) {
    data.pipeline = pipeline;
    if (data.source === 'metrika') data.source = 'metrika+lead_api';
    else if (!token) data.source = 'lead_api';
  }
} catch (e) {
  notes.push(`Заявки API: ${e.message}`);
}

try {
  const yandexIndexed = await fetchWebmasterIndex();
  if (yandexIndexed != null) {
    data.index.yandex_indexed = yandexIndexed;
    data.index.note = 'Яндекс — страницы в поиске (searchable_pages_count). Google: точного числа нет, оценка пока не подключена.';
  } else {
    notes.push('Нет токена Вебмастера — индекс Яндекса не обновлён (нужен webmaster:hostinfo)');
  }
} catch (e) {
  notes.push(`Вебмастер: ${e.message}`);
}

data.conversion_visit_to_lead = pct(data.metrika_accepted.week, data.visits.week);
data.notes = notes;

writeFileSync(outPath, JSON.stringify(data, null, 2) + '\n', 'utf8');
const healthOk = data.health && data.health.ok ? 'ok' : (data.health ? `errors=${data.health.errors}` : 'no-health');
console.log(`Wrote ${outPath} source=${data.source} visits.week=${data.visits.week} metrika_accepted.week=${data.metrika_accepted.week} health=${healthOk}`);
if (notes.length) notes.forEach((n) => console.log('  !', n));
