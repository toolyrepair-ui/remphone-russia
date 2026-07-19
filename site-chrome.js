/**
 * Единая шапка/подвал + плавающие кнопки для всех страниц REM-PHONE.
 * Подключение: <script src="site-chrome.js" data-base=""></script>
 * В подпапках: data-base="../"
 */
(function () {
  var script = document.currentScript;
  var base = (script && script.getAttribute('data-base')) || '';
  var phoneTel = '+79144111730';
  var phoneShow = '+7 914 411-17-30';
  var wa = 'https://wa.me/79144111730';
  var tg = 'https://t.me/REMPHONE_RUSSIA_Bot';
  var mail = 'mailto:toolyrepair@gmail.com';

  function asset(path) {
    return base + path;
  }

  var headerHtml =
    '<header class="header" id="header">' +
    '<div class="container">' +
    '<a href="' + base + 'index.html" class="logo">REMPHONE <span>RUSSIA</span></a>' +
    '<nav class="nav" id="nav">' +
    '<a href="' + base + 'services/">Услуги</a>' +
    '<a href="' + base + 'brands/">Бренды</a>' +
    '<a href="' + base + 'reviews.html">Отзывы</a>' +
    '<a href="' + base + 'about.html">О нас</a>' +
    '<a href="' + base + 'faq.html">FAQ</a>' +
    '<a href="' + base + 'contacts.html">Контакты</a>' +
    '</nav>' +
    '<div class="header-contacts">' +
    '<a class="header-phone" href="tel:' + phoneTel + '">' + phoneShow + '</a>' +
    '<div class="header-social">' +
    '<a href="' + wa + '" target="_blank" rel="noopener" aria-label="WhatsApp"><img src="' + asset('assets/messengers/whatsapp.svg') + '" alt="" width="22" height="22" onerror="this.src=\'' + asset('assets/placeholders/placeholder.svg') + '\'"></a>' +
    '<a href="' + tg + '" target="_blank" rel="noopener" aria-label="Telegram"><img src="' + asset('assets/messengers/telegram.svg') + '" alt="" width="22" height="22" onerror="this.src=\'' + asset('assets/placeholders/placeholder.svg') + '\'"></a>' +
    '<a href="' + mail + '" aria-label="Email">✉️</a>' +
    '</div></div>' +
    '<button class="burger" id="burger" aria-label="Меню"><span></span><span></span><span></span></button>' +
    '</div></header>';

  var footerHtml =
    '<footer class="footer">' +
    '<div class="container">' +
    '<div class="footer-grid">' +
    '<div>' +
    '<div class="logo" style="color:#fff;margin-bottom:8px">REMPHONE <span>RUSSIA</span></div>' +
    '<p style="font-size:13px;color:rgba(255,255,255,0.4)">Ремонт телефонов в Хабаровске и Хабаровском крае.</p>' +
    '<a class="footer-phone" href="tel:' + phoneTel + '">' + phoneShow + '</a>' +
    '<div class="footer-social">' +
    '<a href="' + wa + '" target="_blank" rel="noopener">WhatsApp</a>' +
    '<a href="' + tg + '" target="_blank" rel="noopener">Telegram</a>' +
    '<a href="' + mail + '">Email</a>' +
    '</div></div>' +
    '<div><h5>Услуги</h5>' +
    '<a href="' + base + 'services/screen.html">Замена экрана</a>' +
    '<a href="' + base + 'services/battery.html">Замена батареи</a>' +
    '<a href="' + base + 'services/">Все услуги</a></div>' +
    '<div><h5>О проекте</h5>' +
    '<a href="' + base + 'about.html">О нас</a>' +
    '<a href="' + base + 'reviews.html">Отзывы</a>' +
    '<a href="' + base + 'faq.html">FAQ</a>' +
    '<a href="' + base + 'contacts.html">Контакты</a></div>' +
    '<div><h5>Заявка</h5>' +
    '<a href="' + base + 'index.html#repair-flow">Оставить заявку</a>' +
    '<a href="' + tg + '" target="_blank" rel="noopener">Telegram-бот</a>' +
    '<a href="' + base + 'privacy.html">Политика</a></div>' +
    '</div>' +
    '<div class="footer-bottom"><p>© 2026 REMPHONE RUSSIA · <a href="' + mail + '" style="color:inherit">toolyrepair@gmail.com</a></p></div>' +
    '</div></footer>';

  var floatHtml =
    '<div class="sticky-mobile-bar floating-contact" id="stickyMobileBar">' +
    '<a class="sticky-fab sticky-call btn-pulse" href="tel:' + phoneTel + '" aria-label="Позвонить"><img src="' + asset('assets/messengers/phone.svg') + '" alt="" width="26" height="26"></a>' +
    '<a class="sticky-fab sticky-wa btn-pulse" href="' + wa + '" target="_blank" rel="noopener" aria-label="WhatsApp"><img src="' + asset('assets/messengers/whatsapp.svg') + '" alt="" width="26" height="26"></a>' +
    '<a class="sticky-fab sticky-flow" href="' + base + 'index.html#repair-flow">Заявка</a>' +
    '</div>';

  function mount() {
    var h = document.getElementById('site-header');
    var f = document.getElementById('site-footer');
    var fl = document.getElementById('site-float');
    if (h) h.outerHTML = headerHtml;
    if (f) f.outerHTML = footerHtml;
    if (fl) fl.outerHTML = floatHtml;

    var burger = document.getElementById('burger');
    var nav = document.getElementById('nav');
    if (burger && nav) {
      burger.addEventListener('click', function () {
        nav.classList.toggle('active');
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
