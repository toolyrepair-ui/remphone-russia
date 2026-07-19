# Исправление проблем с SSL и доменом

## Проблема 1: HTTP не редиректит на HTTPS

### Решение через Cloudflare:
1. Зайдите в https://dash.cloudflare.com
2. Выберите домен rem-phone.ru
3. Перейдите в **SSL/TLS** → **Edge Certificates**
4. Включите **Always Use HTTPS** (переключатель в положение ON)
5. Подождите 5-10 минут

### Решение через reg.ru (без Cloudflare):
1. Зайдите в панель управления reg.ru
2. Мои домены → rem-phone.ru → Управление DNS
3. Добавьте правило редиректа (если доступно)
4. Или используйте файл `.htaccess` в корне сайта:

```apache
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

## Проблема 2: www.rem-phone.ru не работает

### Добавление www-записи в Cloudflare:
1. В Cloudflare откройте **DNS** → **Records**
2. Нажмите **Add Record**
3. Заполните:
   - Type: CNAME
   - Name: www
   - Target: rem-phone.ru
   - Proxy: ON (оранжевый облако)
4. Сохраните

### Добавление www-записи в reg.ru:
1. Перейдите в Управление DNS для rem-phone.ru
2. Добавьте CNAME запись:
   - Поддомен: www
   - Значение: rem-phone.ru
3. Сохраните

## Проблема 3: Домен rem-phone.ru не существует

Если нужен этот домен:
1. Зарегистрируйте домен на reg.ru или другом регистраторе
2. Добавьте в корень репозитория пустой файл `CNAME` с содержимым:
   ```
   rem-phone.ru
   ```
3. Настройте DNS записи (как указано в INSTALL.md)

## Проверка после исправлений

```bash
# Проверка редиректа HTTP → HTTPS
curl -I http://rem-phone.ru
# Ожидается: HTTP/1.1 301 Moved Permanently
# И Location: https://rem-phone.ru/

# Проверка www
curl -I https://www.rem-phone.ru
# Ожидается: HTTP/1.1 200 OK

# Проверка SSL сертификата
curl -I -k https://rem-phone.ru
# Ожидается: HTTP/1.1 200 OK