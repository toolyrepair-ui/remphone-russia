#!/usr/bin/env node
/**
 * Пишет dashboard/auth-config.php из DASHBOARD_USER / DASHBOARD_PASSWORD.
 * Файл в git не попадает. Без секретов ничего не создаёт — локальный просмотр открыт.
 */
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const user = (process.env.DASHBOARD_USER || '').trim();
const password = (process.env.DASHBOARD_PASSWORD || '').trim();
const out = join(dirname(fileURLToPath(import.meta.url)), '..', 'dashboard', 'auth-config.php');

if (!user || !password) {
  console.log('DASHBOARD_USER/PASSWORD not set — auth-config.php not written');
  process.exit(0);
}

if (password.length < 8) {
  console.error('DASHBOARD_PASSWORD must be at least 8 characters');
  process.exit(1);
}

function phpString(value) {
  return "'" + String(value).replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'";
}

writeFileSync(
  out,
  `<?php\nreturn [\n  'user' => ${phpString(user)},\n  'password' => ${phpString(password)},\n];\n`,
  { encoding: 'utf8' }
);
console.log('Wrote dashboard/auth-config.php');
