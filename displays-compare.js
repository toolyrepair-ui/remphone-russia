/**
 * Блок «Оригинал vs Аналог» — табы брендов + слайдер преимуществ.
 * Данные: displays-config.json. Цену не показываем.
 */
(function () {
  var root = document.getElementById('displayCompare');
  if (!root) return;
  if (root.getAttribute('data-auto-show') === 'false') return;

  var CONFIG_URL = root.getAttribute('data-config') || 'displays-config.json';
  var tabsEl = root.querySelector('[data-dc-tabs]');
  var sliderEl = root.querySelector('[data-dc-slider]');
  var titleEl = root.querySelector('[data-dc-title]');
  var leadEl = root.querySelector('[data-dc-lead]');
  var featuresEl = root.querySelector('[data-dc-features]');
  var sideOrig = root.querySelector('[data-dc-side-orig]');
  var sideAnalog = root.querySelector('[data-dc-side-analog]');
  var warrantyEl = root.querySelector('[data-dc-warranty]');
  var labelEl = root.querySelector('[data-dc-label]');
  var captionEl = root.querySelector('[data-dc-side-caption]');

  var state = {
    brandKey: 'iphone',
    position: 50,
    config: null,
  };

  function reducedMotion() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function getPair() {
    var brands = (state.config && state.config.brands) || {};
    return brands[state.brandKey] || brands.iphone;
  }

  function setPositionCss(pos) {
    root.style.setProperty('--slider-position', String(pos));
    if (sideAnalog) sideAnalog.style.opacity = String(1 - pos / 100);
    if (sideOrig) sideOrig.style.opacity = String(pos / 100);
  }

  function currentSide(pair, t) {
    return t < 0.5 ? pair.analog : pair.original;
  }

  function renderBenefits(pair, t) {
    if (!pair) return;
    var analog = t < 0.5;
    var side = currentSide(pair, t) || {};
    var list = side.benefits || side.features || [];

    if (titleEl) titleEl.textContent = side.title || (analog ? 'Аналог' : 'Оригинал');
    if (leadEl) {
      leadEl.textContent =
        side.lead ||
        'Гарантия одинаковая. Точную сумму назовём после осмотра модели.';
    }
    if (featuresEl) {
      featuresEl.innerHTML = list
        .map(function (f) {
          return '<li>' + f + '</li>';
        })
        .join('');
    }
    if (captionEl) {
      captionEl.textContent = analog ? 'Преимущества аналога' : 'Преимущества оригинала';
    }
    if (labelEl) {
      labelEl.textContent = analog ? 'Ближе к аналогу' : 'Ближе к оригиналу';
      labelEl.dataset.side = analog ? 'analog' : 'original';
    }
  }

  function render() {
    var pair = getPair();
    var t = state.position / 100;
    setPositionCss(state.position);
    renderBenefits(pair, t);
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
