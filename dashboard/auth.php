<?php
declare(strict_types=1);

/**
 * HTTP Basic для /dashboard/. Пароль не в git: файл auth-config.php
 * пишет GitHub Action из секретов DASHBOARD_USER / DASHBOARD_PASSWORD.
 * Если конфига нет (локальный просмотр), страница открывается как раньше.
 */

if (empty($_SERVER['PHP_AUTH_USER']) && empty($_SERVER['PHP_AUTH_PW'])) {
  $header = (string) (
    $_SERVER['HTTP_AUTHORIZATION']
    ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION']
    ?? ''
  );
  if (preg_match('/Basic\s+(.+)$/i', $header, $match)) {
    $decoded = base64_decode($match[1], true);
    if ($decoded !== false) {
      $parts = explode(':', $decoded, 2);
      $_SERVER['PHP_AUTH_USER'] = $parts[0] ?? '';
      $_SERVER['PHP_AUTH_PW'] = $parts[1] ?? '';
    }
  }
}

$configFile = __DIR__ . '/auth-config.php';
if (is_readable($configFile)) {
  $config = require $configFile;
  $user = is_array($config) ? (string) ($config['user'] ?? '') : '';
  $password = is_array($config) ? (string) ($config['password'] ?? '') : '';
  $givenUser = (string) ($_SERVER['PHP_AUTH_USER'] ?? '');
  $givenPassword = (string) ($_SERVER['PHP_AUTH_PW'] ?? '');
  $ok =
    $user !== ''
    && $password !== ''
    && $givenUser !== ''
    && $givenPassword !== ''
    && hash_equals($user, $givenUser)
    && hash_equals($password, $givenPassword);
  if (!$ok) {
    header('WWW-Authenticate: Basic realm="REMPHONE dashboard"');
    header('HTTP/1.1 401 Unauthorized');
    header('Cache-Control: no-store');
    echo 'Unauthorized';
    exit;
  }
}

$path = (string) (parse_url($_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH) ?: '');
$base = basename($path);
$jsonFiles = ['data.json' => true, 'health.json' => true];
if (isset($jsonFiles[$base])) {
  $file = __DIR__ . '/' . $base;
  if (!is_readable($file)) {
    http_response_code(404);
    exit;
  }
  header('Content-Type: application/json; charset=utf-8');
  header('Cache-Control: no-store');
  readfile($file);
  exit;
}

header('Content-Type: text/html; charset=utf-8');
header('Cache-Control: no-store');
readfile(__DIR__ . '/index.html');
