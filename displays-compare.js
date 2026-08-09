/**
 * Блок «Оригинал vs Аналог» — табы брендов + слайдер.
 * Данные: displays-config.json (без правки этого файла при смене цен).
 */
(function () {
  var root = document.getElementById('displayCompare');
  if (!root) return;

  var CONFIG_URL = root.getAttribute('data-config') || 'displays-config.json';
  var tabsEl = root.querySelector('[data-dc-tabs]');
  var sliderEl = root.querySelector('[data-dc-slider]');
  var priceEl = root.querySelector('[data-dc-price]');
  var lifeEl = root.querySelector('[data-dc-lifespan]');
  var featuresEl = root.querySelector('[data-dc-features]');
  var sideOrig = root.querySelector('[data-dc-side-orig]');
  var sideAnalog = root.querySelector('[data-dc-side-analog]');
  var warrantyEl = root.querySelector('[data-dc-warranty]');
  var labelEl = root.querySelector('[data-dc-label]');

  var state = {
    brandKey: 'iphone',
    position: 50,
    config: null,
  };

  function reducedMotion() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function formatPrice(n) {
    var v = Math.round(n / 50) * 50;
    return 'от ' + v.toLocaleString('ru-RU') + '₽';
  }

  function formatLife(n, unit) {
    var v = Math.round(n);
    return '~' + v + ' ' + (unit || 'мес.');
  }

  function getPair() {
    var brands = (state.config && state.config.brands) || {};
    return brands[state.brandKey] || brands.iphone;
  }

  function setPositionCss(pos) {
    root.style.setProperty('--slider-position', String(pos));
    if (sideOrig) sideOrig.style.opacity = String(1 - pos / 100);
    if (sideAnalog) sideAnalog.style.opacity = String(pos / 100);
  }

  function renderFeatures(pair, t) {
    if (!featuresEl || !pair) return;
    var side = t < 0.5 ? pair.original : pair.analog;
    var list = (side && side.features) || [];
    featuresEl.innerHTML = list
      .map(function (f) {
        return '<li>' + f + '</li>';
      })
      .join('');
    if (labelEl) {
      labelEl.textContent = t < 0.5 ? 'Ближе к оригиналу' : 'Ближе к аналогу';
      labelEl.dataset.side = t < 0.5 ? 'original' : 'analog';
    }
  }

  function renderNumbers(pair, t) {
    if (!pair) return;
    var o = pair.original || {};
    var a = pair.analog || {};
    var price = lerp(Number(o.price) || 0, Number(a.price) || 0, t);
    var life = lerp(Number(o.lifespan) || 0, Number(a.lifespan) || 0, t);
    var unit = a.lifespanUnit || o.lifespanUnit || 'мес.';

    var apply = function () {
      if (priceEl) priceEl.textContent = formatPrice(price);
      if (lifeEl) lifeEl.textContent = formatLife(life, unit);
    };

    if (reducedMotion() || !priceEl) {
      apply();
      return;
    }

    priceEl.classList.add('is-updating');
    lifeEl && lifeEl.classList.add('is-updating');
    window.setTimeout(function () {
      apply();
      priceEl.classList.remove('is-updating');
      lifeEl && lifeEl.classList.remove('is-updating');
    }, 40);
  }

  function render() {
    var pair = getPair();
    var t = state.position / 100;
    setPositionCss(state.position);
    renderNumbers(pair, t);
    renderFeatures(pair, t);
  }

  function setBrand(key) {
    if (!state.config || !state.config.brands[key]) return;
    state.brandKey = key;
    if (tabsEl) {
      tabsEl.querySelectorAll('[data-brand]').forEach(function (btn) {
        var on = btn.getAttribute('data-brand') === key;
        btn.classList.toggle('is-active', on);
        btn.setAttribute('aria-selected', on ? 'true' : 'false');
      });
    }
    render();
  }

  function applyPreference(preference) {
    var pair = getPair();
    var brandLabel = (pair && pair.label) || state.brandKey;
    if (typeof window.REMPHONE_APPLY_DISPLAY_PREFERENCE === 'function') {
      window.REMPHONE_APPLY_DISPLAY_PREFERENCE({
        brand: brandLabel,
        part_preference: preference,
        problem: 'Разбит экран',
      });
      return;
    }
    var form = document.getElementById('flowRepairForm');
    if (form) {
      var pref = document.getElementById('flowPartPreference');
      var brand = document.getElementById('flowBrand');
      var problem = document.getElementById('flowProblem');
      if (pref) pref.value = preference;
      if (brand) brand.value = brandLabel;
      if (problem && !problem.value) problem.value = 'Разбит экран';
    }
    var flow = document.getElementById('repair-flow');
    if (flow) flow.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'start' });
  }

  function buildTabs(brands) {
    if (!tabsEl) return;
    tabsEl.innerHTML = Object.keys(brands)
      .map(function (key, i) {
        var label = brands[key].label || key;
        var active = i === 0 ? ' is-active' : '';
        return (
          '<button type="button" class="dc-tab' +
          active +
          '" role="tab" data-brand="' +
          key +
          '" aria-selected="' +
          (i === 0 ? 'true' : 'false') +
          '">' +
          label +
          '</button>'
        );
      })
      .join('');
    tabsEl.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-brand]');
      if (!btn) return;
      setBrand(btn.getAttribute('data-brand'));
    });
  }

  function bindUi() {
    if (sliderEl) {
      sliderEl.addEventListener('input', function () {
        state.position = Number(sliderEl.value) || 0;
        render();
      });
    }
    root.querySelectorAll('[data-dc-cta]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        applyPreference(btn.getAttribute('data-dc-cta'));
      });
    });
  }

  fetch(CONFIG_URL, { credentials: 'same-origin' })
    .then(function (r) {
      if (!r.ok) throw new Error('config_http_' + r.status);
      return r.json();
    })
    .then(function (cfg) {
      state.config = cfg;
      if (warrantyEl) {
        warrantyEl.textContent = cfg.warranty || '90 дней';
      }
      buildTabs(cfg.brands || {});
      var first = Object.keys(cfg.brands || {})[0] || 'iphone';
      state.brandKey = first;
      if (sliderEl) {
        sliderEl.value = '50';
        state.position = 50;
      }
      bindUi();
      render();
      root.hidden = false;
      root.classList.add('is-ready');
    })
    .catch(function (err) {
      console.warn('display-compare: config failed', err);
      root.hidden = true;
    });
})();
