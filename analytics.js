/* analytics.js — Яндекс.Метрика для rem-phone.ru
 * Счётчик: window.REMPHONE_CONFIG.metrikaId (config.js)
 * Цели (JS-события в кабинете):
 *   request-form-submit, request-form-open, make-call, whatsapp, telegram
 */
(function () {
  var TAG = 'https://mc.yandex.ru/metrika/tag.js';
  var started = false;

  function scriptDir() {
    var scripts = document.getElementsByTagName('script');
    for (var i = scripts.length - 1; i >= 0; i--) {
      var src = scripts[i].src || '';
      if (src.indexOf('analytics.js') !== -1) {
        return src.replace(/[^/]+$/, '');
      }
    }
    return '';
  }

  function loadScript(src, cb) {
    var s = document.createElement('script');
    s.src = src;
    s.async = false;
    s.onload = cb;
    s.onerror = cb;
    (document.head || document.documentElement).appendChild(s);
  }

  function ensureNoscript(id) {
    if (document.getElementById('ym-noscript-pixel')) return;
    var ns = document.createElement('noscript');
    ns.id = 'ym-noscript-pixel';
    ns.innerHTML =
      '<div><img src="https://mc.yandex.ru/watch/' +
      id +
      '" style="position:absolute;left:-9999px;" alt="" /></div>';
    var body = document.body;
    if (body) body.insertBefore(ns, body.firstChild);
    else document.documentElement.appendChild(ns);
  }

  function bindGoals(id) {
    function reach(goal) {
      try {
        if (typeof ym === 'function') ym(id, 'reachGoal', goal);
      } catch (e) {}
    }

    window.REMPHONE_REACH = reach;

    var lastKey = '';
    var lastAt = 0;
    function reachOnce(goal, key) {
      var now = Date.now();
      var k = goal + '|' + (key || '');
      if (k === lastKey && now - lastAt < 800) return;
      lastKey = k;
      lastAt = now;
      reach(goal);
    }

    document.addEventListener(
      'click',
      function (e) {
        var el = e.target;
        if (!el || !el.closest) return;

        var a = el.closest('a[href]');
        if (a) {
          var href = (a.getAttribute('href') || '').trim();
          var hrefLower = href.toLowerCase();
          if (hrefLower.indexOf('tel:') === 0) {
            reachOnce('make-call', href);
            return;
          }
          if (hrefLower.indexOf('wa.me') !== -1 || hrefLower.indexOf('whatsapp') !== -1) {
            reachOnce('whatsapp', href);
            return;
          }
          if (hrefLower.indexOf('t.me/') !== -1 || hrefLower.indexOf('telegram') !== -1) {
            reachOnce('telegram', href);
            return;
          }
        }

        var btn = el.closest('[data-action]');
        if (btn) {
          var action = btn.getAttribute('data-action');
          if (action === 'call') reachOnce('make-call', 'data-action:call');
          else if (action === 'whatsapp') reachOnce('whatsapp', 'data-action:whatsapp');
          else if (action === 'telegram') reachOnce('telegram', 'data-action:telegram');
        }
      },
      true
    );

    var formOpened = false;
    function openFormOnce(key) {
      if (formOpened) return;
      formOpened = true;
      reachOnce('request-form-open', key || 'form');
    }

    document.addEventListener(
      'focusin',
      function (e) {
        var t = e.target;
        if (!t) return;
        if (t.closest && (t.closest('#flowRepairForm') || t.closest('#repairForm') || t.closest('form.flow-form'))) {
          openFormOnce('focus');
        }
      },
      true
    );

    document.addEventListener(
      'click',
      function (e) {
        var t = e.target;
        if (!t || !t.closest) return;
        if (t.closest('#repair-flow') || t.closest('#flowRepairForm') || t.closest('a[href*="repair-flow"]') || t.closest('a[href="#form"]')) {
          openFormOnce('click');
        }
      },
      true
    );
  }

  function startMetrika(id) {
    if (started || !id) return;
    started = true;
    id = Number(id);

    ensureNoscript(id);

    (function (m, e, t, r, i, k, a) {
      m[i] =
        m[i] ||
        function () {
          (m[i].a = m[i].a || []).push(arguments);
        };
      m[i].l = 1 * new Date();
      for (var j = 0; j < document.scripts.length; j++) {
        if (document.scripts[j].src === r) {
          bindGoals(id);
          try {
            ym(id, 'init', {
              clickmap: true,
              trackLinks: true,
              accurateTrackBounce: true,
              webvisor: true,
            });
          } catch (err) {}
          return;
        }
      }
      (k = e.createElement(t)), (a = e.getElementsByTagName(t)[0]);
      k.async = 1;
      k.src = r;
      a.parentNode.insertBefore(k, a);
    })(window, document, 'script', TAG, 'ym');

    ym(id, 'init', {
      clickmap: true,
      trackLinks: true,
      accurateTrackBounce: true,
      webvisor: true,
    });

    bindGoals(id);
  }

  function boot() {
    var cfg = window.REMPHONE_CONFIG || {};
    if (cfg.metrikaId) {
      startMetrika(cfg.metrikaId);
      return;
    }
    // config.js ещё не загружен — подтянуть относительно analytics.js
    var base = scriptDir();
    loadScript(base + 'config.js', function () {
      var id = (window.REMPHONE_CONFIG || {}).metrikaId;
      if (id) startMetrika(id);
    });
  }

  function scheduleBoot() {
    var run = function () {
      boot();
    };
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(run, { timeout: 2500 });
    } else {
      window.setTimeout(run, 1200);
    }
  }

  function afterFirstPaint() {
    if (document.readyState === 'complete') {
      scheduleBoot();
    } else {
      window.addEventListener('load', scheduleBoot, { once: true });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', afterFirstPaint);
  } else {
    afterFirstPaint();
  }
})();
