# Как подключить SSL-сертификат на rem-phone.ru

## GitHub Pages автоматически выдаёт SSL-сертификат Let's Encrypt

### Шаг 1: Проверьте, что сайт размещён на GitHub Pages
1. Зайдите в ваш репозиторий на GitHub
2. Settings → Pages
3. Убедитесь, что:
   - Source: Deploy from branch → main → / (root)
   - Custom domain: `rem-phone.ru`

### Шаг 2: Включите SSL (Enforce HTTPS)
1. В том же разделе **Pages**
2. Найдите переключатель **Enforce HTTPS**
3. Переведите в положение **ON**
4. Подождите 5-10 минут

### Шаг 3: Проверьте редирект
После включения "Enforce HTTPS":
- HTTP → HTTPS редирект настроится автоматически
- Сертификат Let's Encrypt выдастся автоматически

### Шаг 4: Добавьте www-запись (опционально)
В reg.ru: Мои домены → rem-phone.ru → Управление DNS
- Добавьте CNAME: `www` → `rem-phone.ru`

## Проверка
```bash
# Проверка HTTPS
curl -I https://rem-phone.ru
# Ожидается: HTTP/2 200 OK

# Проверка HTTP (должен редиректить)
curl -I http://rem-phone.ru
# Ожидается: HTTP/1.1 301 Moved Permanently
# Location: https://rem-phone.ru/
```

## ВАЖНО!
- **Не покупайте сертификат на reg.ru** - GitHub Pages использует свой автоматический Let's Encrypt
- SSL настраивается только в настройках GitHub Pages, а не в панели reg.ru