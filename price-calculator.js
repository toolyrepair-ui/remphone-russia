(function () {
  'use strict';

  var data = window.REMPHONE_PRICE_CALCULATOR;
  if (!data) return;

  var els = {
    brand: document.getElementById('calcBrand'),
    model: document.getElementById('calcModel'),
    modelSuggestions: document.getElementById('calcModelSuggestions'),
    service: document.getElementById('calcService'),
    result: document.getElementById('calcResult'),
    rows: document.getElementById('calcModelRows'),
    cta: document.getElementById('calcCta'),
    form: document.getElementById('priceCalculatorForm')
  };
  if (!els.brand || !els.model || !els.service || !els.result) return;

  function fmt(value) {
    return value ? value.toLocaleString('ru-RU') + ' \u20BD' : 'после диагностики';
  }

  function norm(value) {
    return String(value || '')
      .trim()
      .toLowerCase()
      .replace(/\u0451/g, '\u0435')
      .replace(/[^a-z\u0430-\u044f0-9]+/g, ' ')
      .replace(/\s+/g, ' ');
  }

  function compact(value) {
    return norm(value).replace(/\s+/g, '');
  }

  function brandLabel(brand) {
    return brand === 'Apple' ? 'iPhone' : brand;
  }

  function flowBrand(brand) {
    return brand === 'Apple' ? 'iPhone' : brand;
  }

  function deviceLabel(row) {
    return row.brand === 'Apple' ? row.model : brandLabel(row.brand) + ' ' + row.model;
  }

  function currentBrandModels() {
    return Array.from(
      new Map(
        data.rows
          .filter(function (row) { return row.brand === els.brand.value; })
          .map(function (row) { return [row.model, row]; })
      ).values()
    );
  }

  function modelScore(row, query) {
    var q = norm(query);
    var qc = compact(query);
    var model = norm(row.model);
    var modelWithBrand = norm(brandLabel(row.brand) + ' ' + row.model);
    var mc = compact(row.model);
    var mbc = compact(brandLabel(row.brand) + ' ' + row.model);
    if (!q) return 0;
    if (model === q || modelWithBrand === q || mc === qc || mbc === qc) return 100;
    if (model.indexOf(q) === 0 || modelWithBrand.indexOf(q) === 0) return 80;
    if (mc.indexOf(qc) === 0 || mbc.indexOf(qc) === 0) return 75;
    if (model.indexOf(q) !== -1 || modelWithBrand.indexOf(q) !== -1 || mc.indexOf(qc) !== -1 || mbc.indexOf(qc) !== -1) return 60;
    var tokens = q.split(' ').filter(Boolean);
    if (tokens.length && tokens.every(function (token) {
      return modelWithBrand.indexOf(token) !== -1 || mbc.indexOf(token) !== -1;
    })) return 45;
    return 0;
  }

  function rankedModels(query) {
    if (typeof query === 'undefined') query = els.model.value;
    return currentBrandModels()
      .map(function (row) { return { row: row, score: modelScore(row, query) }; })
      .filter(function (item) { return item.score > 0; })
      .sort(function (a, b) {
        return b.score - a.score
          || a.row.year - b.row.year
          || a.row.model.localeCompare(b.row.model, 'ru');
      })
      .map(function (item) { return item.row; });
  }

  function resolveModel() {
    return rankedModels()[0] || null;
  }

  function rowsForModel() {
    var model = resolveModel();
    if (!model) return [];
    return data.rows.filter(function (row) {
      return row.brand === els.brand.value && row.model === model.model;
    });
  }

  function selectedRow() {
    return rowsForModel().find(function (row) { return row.service === els.service.value; });
  }

  function serviceLabel(service) {
    return (data.serviceLabels && data.serviceLabels[service]) || service;
  }

  function repairFlowHref(row) {
    var brand = encodeURIComponent(flowBrand(row.brand));
    var model = encodeURIComponent(row.model);
    return 'index.html?brand=' + brand + '&model=' + model + '#repair-flow';
  }

  function fillBrands() {
    var brands = Array.from(new Set(data.rows.map(function (row) { return row.brand; })))
      .sort(function (a, b) { return data.brandOrder.indexOf(a) - data.brandOrder.indexOf(b); });
    els.brand.innerHTML = brands.map(function (brand) {
      return '<option value="' + brand + '">' + brandLabel(brand) + '</option>';
    }).join('');
  }

  function renderSuggestions(open) {
    if (typeof open === 'undefined') open = true;
    var matches = rankedModels().slice(0, 8);
    if (!open || !matches.length) {
      els.modelSuggestions.hidden = true;
      els.modelSuggestions.innerHTML = '';
      return;
    }
    els.modelSuggestions.hidden = false;
    els.modelSuggestions.innerHTML = matches.map(function (row) {
      return '<button type="button" class="calc-suggestion" data-model="' + row.model.replace(/"/g, '&quot;') + '">' +
        '<span>' + row.model + '</span><span class="calc-suggestion-year">' + row.year + '</span>' +
      '</button>';
    }).join('');
  }

  function fillModels() {
    var models = currentBrandModels();
    els.model.value = models[0] ? models[0].model : '';
    renderSuggestions(false);
  }

  function fillServices() {
    var available = rowsForModel();
    els.service.innerHTML = data.serviceOrder
      .filter(function (service) {
        return available.some(function (row) { return row.service === service; });
      })
      .map(function (service) {
        return '<option value="' + service + '">' + serviceLabel(service) + '</option>';
      })
      .join('');
  }

  function renderTable() {
    var rows = rowsForModel();
    if (!els.rows) return;
    els.rows.innerHTML = rows.length ? rows.map(function (row) {
      return '<tr><td>' + serviceLabel(row.service) + '</td><td>' +
        (row.price ? 'от ' + fmt(row.price) : '<span class="calc-empty">уточним</span>') +
      '</td></tr>';
    }).join('') : '<tr><td colspan="2" class="calc-muted">Модель не выбрана или не найдена.</td></tr>';
  }

  function render() {
    var row = selectedRow();
    renderTable();
    if (!row) {
      els.result.innerHTML =
        '<p class="calc-result-label">Выберите модель</p>' +
        '<p class="calc-result-note">Начните писать модель и выберите вид ремонта. Если модели нет в списке — напишите её в заявке, уточним цену после диагностики.</p>';
      if (els.cta) els.cta.hidden = true;
      return;
    }

    if (els.cta) {
      els.cta.hidden = false;
      els.cta.href = repairFlowHref(row);
    }

    if (row.price) {
      els.result.innerHTML =
        '<p class="calc-result-label">Ориентир по ремонту</p>' +
        '<p class="calc-result-price">от ' + fmt(row.price) + '</p>' +
        '<p class="calc-result-note">' + deviceLabel(row) + ': ' + serviceLabel(row.service) + '. Точную сумму подтверждаем до начала работ.</p>' +
        '<ul class="calc-result-meta">' +
          '<li>Диагностика бесплатно</li>' +
          '<li>Гарантия 90 дней</li>' +
          '<li>Обычно 30–60 минут</li>' +
        '</ul>';
      return;
    }

    els.result.innerHTML =
      '<p class="calc-result-label">Цена после диагностики</p>' +
      '<p class="calc-result-price calc-result-price-muted">уточним</p>' +
      '<p class="calc-result-note">Для ' + deviceLabel(row) + ' / ' + serviceLabel(row.service) +
      ' сначала проверим деталь и состояние. Оставьте заявку — перезвоним с суммой.</p>';
  }

  els.brand.addEventListener('change', function () {
    fillModels();
    fillServices();
    render();
  });

  els.model.addEventListener('input', function () {
    renderSuggestions(true);
    fillServices();
    render();
  });

  els.model.addEventListener('focus', function () {
    renderSuggestions(true);
  });

  els.modelSuggestions.addEventListener('click', function (event) {
    var button = event.target.closest('.calc-suggestion');
    if (!button) return;
    els.model.value = button.dataset.model;
    renderSuggestions(false);
    fillServices();
    render();
  });

  document.addEventListener('click', function (event) {
    if (!event.target.closest('.calc-model-search')) renderSuggestions(false);
  });

  els.service.addEventListener('change', render);

  if (els.form) {
    els.form.addEventListener('submit', function (event) {
      event.preventDefault();
      render();
    });
  }

  fillBrands();
  fillModels();
  fillServices();
  render();
})();
