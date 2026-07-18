# Инструкция по настройке SSL и домена на GitHub Pages

## Важная информация от reg.ru

Сайт размещён на GitHub Pages (IP: 185.199.108-111.153). 
**SSL-сертификат Let's Encrypt выдаётся автоматически бесплатно** в настройках репозитория GitHub.

## Настройка SSL на GitHub Pages

### 1. Включить HTTPS (Let's Encrypt)
1. Зайдите в репозиторий на GitHub
2. Settings → Pages
3. В разделе **Custom domain** убедитесь, что указан домен `remphone-russia.ru`
4. Включите **Enforce HTTPS** (переключатель ON)
5. Подождите 5-10 минут, пока сертификат выдастся

### 2. Настройка редиректа HTTP → HTTPS
На GitHub Pages редирект включается автоматически при включении "Enforce HTTPS"

### 3. Настройка www-записи
1. В панели reg.ru: Мои домены → remphone-russia.ru → Управление DNS
2. Добавьте CNAME запись:
   - Поддомен: `www`
   - Значение: `remphone-russia.ru`
3. На GitHub Pages: добавьте `www.remphone-russia.ru` в Custom domain (через запятую)

## Проверка после настройки

```bash
# Проверка HTTPS
curl -I https://remphone-russia.ru
# Ожидается: HTTP/2 200 OK

# Проверка HTTP (должен редиректить)
curl -I http://remphone-russia.ru
# Ожидается: HTTP/1.1 301 Moved Permanently
# Location: https://remphone-russia.ru/

# Проверка www
curl -I https://www.remphone-russia.ru
# Ожидается: HTTP/2 200 OK
```

## Если нужен сертификат от reg.ru

Для GitHub Pages **не подходит** - сертификат выдаётся только на тех серверах, где физически размещён сайт. GitHub Pages использует свой автоматический сертификат Let's Encrypt.