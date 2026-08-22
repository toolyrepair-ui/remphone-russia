/* analytics.js — Яндекс.Метрика + Google Analytics для rem-phone.ru
 * Счётчики: window.REMPHONE_CONFIG.metrikaId / gaId (config.js)
 * Цели Метрики (JS-события):
 *   request-form-submit, request-form-open, make-call, whatsapp, telegram
 */
(function () {
  var TAG = 'https://mc.yandex.ru/metrika/tag.js';
  var started = false;
  var gaStarted = false;
  var pendingGaEvents = [];
  var GA_PARAM_KEYS = {
    device_type: true,
    problem_key: true,
    symptom_id: true,
    price_state: true,
    load_time_ms: true,
    source: true,
  };

  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function () {
      window.dataLayer.push(arguments);
    };

  function gaEvent(eventName, params) {
    if (!eventName) return;
    var safe = { event_category: 'engagement' };
    params = params || {};
    Object.keys(params).forEach(function (key) {
      if (!GA_PARAM_KEYS[key]) return;
      var value = params[key];
      if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
        safe[key] = value;
      }
    });
    if (!gaStarted) {
      pendingGaEvents.push([String(eventName), safe]);
      return;
    }
    try {
      window.gtag('event', String(eventName), safe);
    } catch (e) {}
  }

  // GA-only custom events. Never forwards these events to Yandex Metrika.
  window.REMPHONE_GA_EVENT = gaEvent;

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

  function startGa(measurementId) {
    if (gaStarted || !measurementId) return;
    gaStarted = true;
    measurementId = String(measurementId);

    function gtag() {
      window.dataLayer.push(arguments);
    }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', measurementId);
    pendingGaEvents.splice(0).forEach(function (item) {
      gtag('event', item[0], item[1]);
    });

    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(measurementId);
    (document.head || document.documentElement).appendChild(s);
  }

  function bindGoals(id) {
    function reach(goal) {
      try {
        if (id && typeof ym === 'function') ym(id, 'reachGoal', goal);
      } catch (e) {}
      try {
        gaEvent(goal);
      } catch (e2) {}
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

    document.addEventListener('remphone:form-open', function () {
      openFormOnce('step-3');
    });
    if (document.documentElement.getAttribute('data-remphone-form-opened') === 'true') {
      openFormOnce('step-3');
    }

    document.addEventListener(
      'focusin',
      function (e) {
        var t = e.target;
        if (!t) return;
        if (t.closest && t.closest('#repairForm')) {
          openFormOnce('focus');
        }
      },
      true
    );
  }

  function startMetrika(id) {
    if (started || !id) return;
    id = Number(id);
    // Already inited by static snippet on index (Direct crawler needs ym(ID) in HTML)
    if (window.__REMPHONE_YM_INITED === id) {
      started = true;
      ensureNoscript(id);
      bindGoals(id);
      return;
    }
    started = true;

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

  function startAll(cfg) {
    cfg = cfg || {};
    if (cfg.gaId) startGa(cfg.gaId);
    if (cfg.metrikaId) startMetrika(cfg.metrikaId);
    else if (cfg.gaId && !window.REMPHONE_REACH) {
      bindGoals(0);
    }
  }

  function boot() {
    var cfg = window.REMPHONE_CONFIG || {};
    if (cfg.metrikaId || cfg.gaId) {
      startAll(cfg);
      return;
    }
    var base = scriptDir();
    loadScript(base + 'config.js', function () {
      startAll(window.REMPHONE_CONFIG || {});
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
