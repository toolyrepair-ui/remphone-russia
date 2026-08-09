/* analytics.js — Яндекс.Метрика + цели для rem-phone.ru
 * ID счётчика задайте в config.js → window.REMPHONE_CONFIG.metrikaId
 * Цели в Метрике (тип «JavaScript-событие»):
 *   phone_click, whatsapp_click, telegram_click, form_submit
 */
(function () {
  var cfg = window.REMPHONE_CONFIG || {};
  var id = cfg.metrikaId;
  if (!id) return;

  (function (m, e, t, r, i, k, a) {
    m[i] =
      m[i] ||
      function () {
        (m[i].a = m[i].a || []).push(arguments);
      };
    m[i].l = 1 * new Date();
    for (var j = 0; j < document.scripts.length; j++) {
      if (document.scripts[j].src === r) return;
    }
    (k = e.createElement(t)), (a = e.getElementsByTagName(t)[0]);
    k.async = 1;
    k.src = r;
    a.parentNode.insertBefore(k, a);
  })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js', 'ym');

  ym(id, 'init', {
    clickmap: true,
    trackLinks: true,
    accurateTrackBounce: true,
    webvisor: true,
  });

  function reach(goal) {
    try {
      ym(id, 'reachGoal', goal);
    } catch (e) {}
  }

  document.addEventListener(
    'click',
    function (e) {
      var a = e.target && e.target.closest ? e.target.closest('a') : null;
      if (!a || !a.href) return;
      var href = a.getAttribute('href') || '';
      if (href.indexOf('tel:') === 0) reach('phone_click');
      else if (href.indexOf('wa.me') !== -1 || href.indexOf('whatsapp') !== -1) reach('whatsapp_click');
      else if (href.indexOf('t.me/') !== -1 || href.indexOf('telegram') !== -1) reach('telegram_click');
    },
    true
  );

  window.REMPHONE_REACH = reach;
})();
