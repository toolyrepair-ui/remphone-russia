/**
 * Единая оболочка публичных страниц REMPHONE.
 * Подключение в корне: data-base=""; в подпапке: data-base="../".
 * Контакты берутся только из window.REMPHONE_CONFIG.
 */
(function () {
  'use strict';

  var script = document.currentScript;
  var base = (script && script.getAttribute('data-base')) || '';

  function asset(path) {
    return base + path;
  }

  function repairFlowHref() {
    var path = window.location.pathname.toLowerCase();
    var isHome = path === '/' || /\/index\.html$/.test(path);
    if (isHome) return '#repair-flow';

    var cityId = '';
    if (/\/vladivostok(?:\/|\.html$)/.test(path)) cityId = 'vladivostok';
    else if (/\/komsomolsk-na-amure(?:\/|\.html$)/.test(path) || /\/cities\/komsomolsk\.html$/.test(path)) {
      cityId = 'komsomolsk';
    } else if (/\/khabarovsk(?:\/|\.html$)/.test(path)) {
      cityId = 'khabarovsk';
    }

    return asset('index.html' + (cityId ? '?city=' + cityId : '') + '#repair-flow');
  }

  function ensureConfig(done) {
    if (window.REMPHONE_CONFIG) {
      done();
      return;
    }
    var config = document.createElement('script');
    config.src = asset('config.js');
    config.onload = done;
    config.onerror = function () {
      console.error('REMPHONE: config.js не загрузился');
      done();
    };
    document.head.appendChild(config);
  }

  function contactData() {
    var cfg = window.REMPHONE_CONFIG || {};
    return {
      phoneTel: cfg.phoneTel || '',
      phoneDisplay: cfg.phoneDisplay || '',
      whatsapp: cfg.whatsapp ? 'https://wa.me/' + cfg.whatsapp : '',
      telegram: cfg.telegramBot ? 'https://t.me/' + cfg.telegramBot : '',
      email: cfg.email ? 'mailto:' + cfg.email : '',
      emailText: cfg.email || ''
    };
  }

  function link(href, className, text, extra) {
    if (!href) return '';
    return '<a href="' + href + '"' + (className ? ' class="' + className + '"' : '') +
      (extra ? ' ' + extra : '') + '>' + text + '</a>';
  }

  function chromeMarkup() {
    var contact = contactData();
    var repairHref = repairFlowHref();
    var mobileRepairHref = repairHref === '#repair-flow' ? '#stepBrand' : repairHref;
    var logoLight = asset('assets/brand/remphone-wordmark.svg');
    var logoDark = asset('assets/brand/remphone-wordmark-inverse.svg');
    // Шапка всегда светлая — wordmark не переключаем по prefers-color-scheme:
    // inverse SVG (белый PHONE) на белом фоне даёт «только REM» без контура.
    var logo = '<img src="' + logoLight + '" width="178" height="44" alt="" decoding="async">';
    var logoInverse = '<img src="' + logoDark +
      '" width="190" height="47" alt="" loading="lazy" decoding="async">';

    var header =
      '<a class="skip-link" href="#main-content">К основному содержимому</a>' +
      '<header class="header" id="header">' +
        '<div class="container header-inner">' +
          '<a href="' + asset('index.html') + '" class="site-logo" aria-label="REMPHONE — на главную">' + logo + '</a>' +
          '<nav class="nav" id="nav" aria-label="Основная навигация">' +
            '<a class="nav-drawer-feature" href="' + asset('price-calculator.html') + '">' +
              '<span class="nav-drawer-feature-title">Цены на ремонт</span>' +
              '<span class="nav-drawer-feature-note">Подберите модель и вид работ — покажем ориентир по цене</span>' +
            '</a>' +
            '<div class="nav-main-links">' +
              '<a href="' + asset('services/') + '">Услуги</a>' +
              '<a href="' + asset('price-calculator.html') + '" class="nav-link-prices">' +
                '<span class="nav-label-full">Цены на ремонт</span>' +
                '<span class="nav-label-short" aria-hidden="true">Цены</span>' +
              '</a>' +
              '<a href="' + asset('3d-viewer-iphone15.html') + '" class="nav-link-3d" aria-label="3D-калькулятор">' +
                '<span class="nav-label-full">3D-калькулятор</span>' +
                '<span class="nav-label-short" aria-hidden="true">3D</span>' +
              '</a>' +
              '<a href="' + asset('cities/') + '">Города</a>' +
              '<a href="' + asset('reviews.html') + '">Отзывы</a>' +
              '<a href="' + asset('faq.html') + '" class="nav-link-drawer-only">FAQ</a>' +
              '<a href="' + asset('about.html') + '">О нас</a>' +
              '<a href="' + asset('contacts.html') + '" class="nav-link-drawer-only">Контакты</a>' +
            '</div>' +
            '<div class="nav-drawer-section" aria-label="Популярные услуги">' +
              '<p class="nav-drawer-label">Популярное</p>' +
              '<a href="' + asset('price-calculator.html') + '">Цены на ремонт</a>' +
              '<a href="' + asset('3d-viewer-iphone15.html') + '">3D-калькулятор</a>' +
              '<a href="' + asset('services/screen.html') + '">Замена экрана</a>' +
              '<a href="' + asset('services/battery.html') + '">Замена батареи</a>' +
              '<a href="' + asset('services/not-on.html') + '">Не включается</a>' +
              '<a href="' + asset('services/water.html') + '">После воды</a>' +
              '<a href="' + asset('services/charge.html') + '">Не заряжается</a>' +
            '</div>' +
            '<div class="nav-drawer-section" aria-label="Города">' +
              '<p class="nav-drawer-label">Города</p>' +
              '<a href="/khabarovsk/">Хабаровск</a>' +
              '<a href="/komsomolsk-na-amure/">Комсомольск-на-Амуре</a>' +
              '<a href="/vladivostok/">Владивосток</a>' +
            '</div>' +
            '<a class="nav-drawer-cta" href="' + repairHref + '">Оставить заявку</a>' +
            '<div class="nav-mobile-contacts">' +
              link(contact.phoneTel ? 'tel:' + contact.phoneTel : '', '', contact.phoneDisplay) +
              link(contact.telegram, '', 'Telegram', 'target="_blank" rel="noopener"') +
              link(contact.whatsapp, '', 'WhatsApp', 'target="_blank" rel="noopener"') +
            '</div>' +
          '</nav>' +
          '<div class="header-actions">' +
            link(contact.phoneTel ? 'tel:' + contact.phoneTel : '', 'header-phone', contact.phoneDisplay) +
            '<a class="header-cta" href="' + repairHref + '">Оставить заявку</a>' +
          '</div>' +
          '<button class="burger" id="burger" type="button" aria-label="Открыть меню" aria-controls="nav" aria-expanded="false">' +
            '<span></span><span></span><span></span>' +
          '</button>' +
        '</div>' +
      '</header>';

    var footer =
      '<footer class="footer">' +
        '<div class="container">' +
          '<div class="footer-grid">' +
            '<div class="footer-brand">' +
              '<a href="' + asset('index.html') + '" class="footer-logo" aria-label="REMPHONE — на главную">' + logoInverse + '</a>' +
              '<p>Ремонт телефонов в Хабаровске, Комсомольске-на-Амуре и Владивостоке.</p>' +
              link(contact.phoneTel ? 'tel:' + contact.phoneTel : '', 'footer-phone', contact.phoneDisplay) +
            '</div>' +
            '<nav class="footer-nav" aria-label="Услуги">' +
              '<h2>Услуги</h2>' +
              '<a href="' + asset('services/screen.html') + '">Замена экрана</a>' +
              '<a href="' + asset('services/battery.html') + '">Замена батареи</a>' +
              '<a href="' + asset('services/not-on.html') + '">Телефон не включается</a>' +
              '<a href="' + asset('price-calculator.html') + '">Цены на ремонт</a>' +
              '<a href="' + asset('3d-viewer-iphone15.html') + '">3D-калькулятор</a>' +
              '<a href="' + asset('services/') + '">Все услуги</a>' +
            '</nav>' +
            '<nav class="footer-nav" aria-label="Города">' +
              '<h2>Города</h2>' +
              '<a href="/khabarovsk/">Хабаровск</a>' +
              '<a href="/komsomolsk-na-amure/">Комсомольск-на-Амуре</a>' +
              '<a href="/vladivostok/">Владивосток</a>' +
            '</nav>' +
            '<nav class="footer-nav" aria-label="Контакты и документы">' +
              '<h2>Связаться</h2>' +
              link(contact.telegram, '', 'Telegram', 'target="_blank" rel="noopener"') +
              link(contact.whatsapp, '', 'WhatsApp', 'target="_blank" rel="noopener"') +
              link(contact.email, '', contact.emailText) +
              '<a href="' + asset('privacy.html') + '">Политика конфиденциальности</a>' +
            '</nav>' +
          '</div>' +
          '<div class="footer-bottom"><p>© 2026 REMPHONE</p></div>' +
        '</div>' +
      '</footer>';

    var mobile =
      '<nav class="mobile-contact-bar" id="stickyMobileBar" aria-label="Быстрая связь" aria-hidden="true">' +
        link(contact.phoneTel ? 'tel:' + contact.phoneTel : '', 'mobile-contact-link', '<span aria-hidden="true">☎</span><span>Позвонить</span>') +
        '<a class="mobile-contact-link mobile-contact-3d" href="' + asset('3d-viewer-iphone15.html') + '">' +
          '<span aria-hidden="true">3D</span><span>Калькулятор</span>' +
        '</a>' +
        '<a class="mobile-contact-link mobile-contact-primary" href="' + mobileRepairHref + '">' +
          '<span aria-hidden="true">→</span><span>Описать поломку</span>' +
        '</a>' +
      '</nav>';

    return { header: header, footer: footer, mobile: mobile };
  }

  function bindMenu() {
    var burger = document.getElementById('burger');
    var nav = document.getElementById('nav');
    if (!burger || !nav) return;

    var focusable = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])';
    var returnFocus = null;

    function setOpen(open) {
      nav.classList.toggle('active', open);
      burger.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
      document.body.classList.toggle('menu-open', open);
      if (open) {
        returnFocus = document.activeElement;
        var first = nav.querySelector(focusable);
        if (first) first.focus();
      } else if (returnFocus === burger || returnFocus) {
        burger.focus();
        returnFocus = null;
      }
    }

    burger.addEventListener('click', function (event) {
      event.stopPropagation();
      setOpen(!nav.classList.contains('active'));
    });
    nav.addEventListener('click', function (event) {
      if (event.target.closest('a')) setOpen(false);
    });
    document.addEventListener('click', function (event) {
      if (!nav.classList.contains('active')) return;
      if (!nav.contains(event.target) && !burger.contains(event.target)) setOpen(false);
    });
    document.addEventListener('keydown', function (event) {
      if (!nav.classList.contains('active')) return;
      if (event.key === 'Escape') {
        setOpen(false);
        return;
      }
      if (event.key !== 'Tab') return;
      var items = Array.prototype.slice.call(nav.querySelectorAll(focusable));
      if (!items.length) return;
      var first = items[0];
      var last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });
  }

  function loadAnalytics() {
    if (document.querySelector('script[src*="analytics.js"]')) return;
    var analytics = document.createElement('script');
    analytics.src = asset('analytics.js?v=tz-review1');
    analytics.defer = true;
    document.body.appendChild(analytics);
  }

  function bindMobileBar() {
    var bar = document.getElementById('stickyMobileBar');
    if (!bar) return;
    var intro = document.querySelector('.flow-intro');

    function setVisible(visible) {
      bar.classList.toggle('is-visible', visible);
      bar.setAttribute('aria-hidden', visible ? 'false' : 'true');
    }

    if (intro && 'IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        var entry = entries[0];
        setVisible(!entry.isIntersecting && entry.boundingClientRect.top < 0);
      }, { threshold: 0.05 });
      observer.observe(intro);
      return;
    }

    function updateFromScroll() {
      var threshold = intro ? intro.offsetTop + intro.offsetHeight : 160;
      setVisible(window.scrollY > threshold);
    }
    window.addEventListener('scroll', updateFromScroll, { passive: true });
    updateFromScroll();
  }

  function mount() {
    var markup = chromeMarkup();
    var header = document.getElementById('site-header');
    var footer = document.getElementById('site-footer');
    var mobile = document.getElementById('site-float');
    if (header) header.outerHTML = markup.header;
    if (footer) footer.outerHTML = markup.footer;
    if (mobile) mobile.outerHTML = markup.mobile;
    Array.prototype.forEach.call(document.querySelectorAll('.sticky-mobile-cta'), function (legacyBar) {
      legacyBar.remove();
    });
    bindMenu();
    bindMobileBar();
    loadAnalytics();
  }

  function start() {
    ensureConfig(mount);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
