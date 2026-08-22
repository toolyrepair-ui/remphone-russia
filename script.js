// Шапка и мобильное меню управляются только site-chrome.js.

// Доступный FAQ accordion.
function initFaqAccordions() {
    document.querySelectorAll('.faq-item').forEach((item, index) => {
        let question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        if (!question || !answer) return;

        if (question.tagName !== 'BUTTON') {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = question.className;
            button.innerHTML = question.innerHTML;
            question.replaceWith(button);
            question = button;
        }

        const answerId = answer.id || `faq-answer-${index + 1}`;
        answer.id = answerId;
        question.setAttribute('aria-controls', answerId);
        question.setAttribute('aria-expanded', item.classList.contains('active') ? 'true' : 'false');

        question.addEventListener('click', () => {
            const willOpen = !item.classList.contains('active');
            item.parentElement.querySelectorAll('.faq-item').forEach((faq) => {
                faq.classList.remove('active');
                const control = faq.querySelector('.faq-question');
                if (control) control.setAttribute('aria-expanded', 'false');
            });
            item.classList.toggle('active', willOpen);
            question.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
        });
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFaqAccordions);
} else {
    initFaqAccordions();
}

function initBrandToggle() {
    const toggle = document.getElementById('toggleMoreBrands');
    const grid = document.getElementById('brandsGrid');
    if (!toggle || !grid) return;
    toggle.addEventListener('click', () => {
        const expanded = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        grid.classList.toggle('show-all-brands', !expanded);
        toggle.textContent = expanded ? 'Показать другие бренды' : 'Скрыть дополнительные бренды';
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBrandToggle);
} else {
    initBrandToggle();
}

// Reveal animations on scroll
const revealElements = document.querySelectorAll('.reveal');

const revealOnScroll = () => {
    revealElements.forEach(el => {
        const elementTop = el.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        if (elementTop < windowHeight - 100) {
            el.classList.add('active');
        }
    });
};

window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);

// Smooth scroll for local anchors, including CTA links mounted later by site-chrome.js.
document.addEventListener('click', (event) => {
    const anchor = event.target.closest('a[href*="#"]');
    if (!anchor) return;

    let url;
    try {
        url = new URL(anchor.href, window.location.href);
    } catch (error) {
        return;
    }
    if (url.origin !== window.location.origin || !url.hash) return;

    const target = document.querySelector(url.hash);
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.history.replaceState(null, '', url.hash);

    if (url.hash === '#repair-flow') {
        target.classList.remove('cta-target-active');
        window.requestAnimationFrame(() => target.classList.add('cta-target-active'));
        window.setTimeout(() => target.classList.remove('cta-target-active'), 1200);
        window.setTimeout(() => {
            const firstChoice = target.querySelector('.flow-panel:not([hidden]) .flow-card');
            if (firstChoice) firstChoice.focus({ preventScroll: true });
        }, 350);
    }
});

// Header scroll effect
let lastScroll = 0;
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    if (header) {
        header.style.boxShadow = currentScroll > 100
            ? '0 4px 20px rgba(0,0,0,0.08)'
            : '0 1px 3px rgba(0,0,0,0.05)';
    }
    lastScroll = currentScroll;
});

// Review filters (basic client-side filtering)
function filterReviews() {
    const cityFilter = document.getElementById('reviewCityFilter');
    const serviceFilter = document.getElementById('reviewServiceFilter');
    const cards = document.querySelectorAll('.review-card');

    const cityValue = cityFilter ? cityFilter.value.toLowerCase() : '';
    const serviceValue = serviceFilter ? serviceFilter.value.toLowerCase() : '';

    cards.forEach(card => {
        const city = (card.dataset.city || '').toLowerCase();
        const service = (card.dataset.service || '').toLowerCase();

        const cityMatch = !cityValue || city.includes(cityValue);
        const serviceMatch = !serviceValue || service.includes(serviceValue);

        card.style.display = cityMatch && serviceMatch ? '' : 'none';
    });
}

if (document.getElementById('reviewCityFilter')) {
    document.getElementById('reviewCityFilter').addEventListener('change', filterReviews);
}
if (document.getElementById('reviewServiceFilter')) {
    document.getElementById('reviewServiceFilter').addEventListener('change', filterReviews);
}

// Catalog quick search redirect
function quickSearch(event) {
    event.preventDefault();
    const problem = document.getElementById('quickProblem');
    const brand = document.getElementById('quickBrand');
    const city = document.getElementById('quickCity');

    const p = problem ? problem.value : '';
    const b = brand ? brand.value : '';
    const c = city ? city.value : '';

    // Build query string
    const params = new URLSearchParams();
    if (p) params.set('problem', p);
    if (b) params.set('brand', b);
    if (c) params.set('city', c);

    // For now open services page with query
    const url = params.toString() ? `services/?${params.toString()}` : 'services/';
    window.location.href = url;
}

const quickForm = document.getElementById('quickSearchForm');
if (quickForm) {
    quickForm.addEventListener('submit', quickSearch);
}

/* ========== Repair flow: марка → поломка → заявка ========== */
(function initRepairFlow() {
    const root = document.getElementById('repair-flow');
    if (!root) return;

    const cfg = window.REMPHONE_CONFIG || {};
    const phoneTel = cfg.phoneTel || '+79144111730';
    const phoneDisplay = cfg.phoneDisplay || '+7 914 411-17-30';
    const whatsapp = cfg.whatsapp || '79144111730';
    const telegramBot = cfg.telegramBot || 'REMPHONE_RUSSIA_Bot';
    const relayUrl = (cfg.relayUrl || '').trim();

    const state = { brand: '', problem: '', cityId: 'khabarovsk', cityName: 'Хабаровск' };
    let clientRequestId = '';
    let clientRequestSelection = '';

    function opaqueRequestId(prefix) {
        if (window.crypto && typeof window.crypto.randomUUID === 'function') {
            return prefix + '-' + window.crypto.randomUUID();
        }
        const bytes = new Uint8Array(16);
        if (window.crypto && typeof window.crypto.getRandomValues === 'function') {
            window.crypto.getRandomValues(bytes);
            return prefix + '-' + Array.from(bytes, (value) => value.toString(16).padStart(2, '0')).join('');
        }
        return prefix + '-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2);
    }

    function logicalSelection(data) {
        return JSON.stringify([
            data.brand || '',
            data.problem || '',
            data.part_preference || '',
            data.model || '',
            data.city_id || '',
        ]);
    }

    function requestIdFor(data) {
        const selection = logicalSelection(data);
        if (!clientRequestId || clientRequestSelection !== selection) {
            clientRequestId = opaqueRequestId('site');
            clientRequestSelection = selection;
        }
        return clientRequestId;
    }

    function resetRequestId() {
        clientRequestId = '';
        clientRequestSelection = '';
    }

    const CITY_MAP = {
        khabarovsk: { name: 'Хабаровск', prep: 'в Хабаровске', href: '/khabarovsk/' },
        komsomolsk: { name: 'Комсомольск-на-Амуре', prep: 'в Комсомольске-на-Амуре', href: '/komsomolsk-na-amure/' },
        vladivostok: { name: 'Владивосток', prep: 'во Владивостоке', href: '/vladivostok/' },
    };
    const panels = {
        1: document.getElementById('stepBrand'),
        2: document.getElementById('stepProblem'),
        3: document.getElementById('stepForm'),
    };
    const steps = document.querySelectorAll('#flowProgress .flow-step');
    const brandLabel = document.getElementById('selectedBrandLabel');
    const summaryBrand = document.getElementById('summaryBrand');
    const summaryProblem = document.getElementById('summaryProblem');
    const flowBrand = document.getElementById('flowBrand');
    const flowProblem = document.getElementById('flowProblem');
    const flowPartPreference = document.getElementById('flowPartPreference');
    const form = document.getElementById('flowRepairForm');
    const success = document.getElementById('flowFormSuccess');
    const submitBtn = document.getElementById('flowSubmitBtn');
    const errorBox = document.getElementById('flowSubmitError');
    const flowCity = document.getElementById('flowCity');
    const flowCityId = document.getElementById('flowCityId');
    const heroTitle = document.getElementById('heroCityTitle');
    const heroLead = document.getElementById('heroCityLead');
    const nearbyBox = document.getElementById('nearbyPartners');
    const nearbyList = document.getElementById('nearbyPartnersList');

    function setCity(cityId, opts) {
        const syncHero = !opts || opts.syncHero !== false;
        if (!CITY_MAP[cityId]) cityId = 'khabarovsk';
        if (state.cityId !== cityId) resetRequestId();
        state.cityId = cityId;
        state.cityName = CITY_MAP[cityId].name;
        try { sessionStorage.setItem('remphone_city_id', cityId); } catch (e) {}
        if (flowCity) flowCity.value = cityId;
        if (flowCityId) flowCityId.value = cityId;
        document.querySelectorAll('#cityPicker .city-chip').forEach((btn) => {
            const selected = btn.dataset.cityId === cityId;
            btn.classList.toggle('is-active', selected);
            btn.setAttribute('aria-pressed', selected ? 'true' : 'false');
        });
        if (syncHero && heroTitle) {
            heroTitle.innerHTML = 'Ремонт телефонов <span>' + CITY_MAP[cityId].prep + '</span>';
        }
        if (syncHero && heroLead) {
            heroLead.textContent = 'Отправьте заявку — мы отремонтируем ' + CITY_MAP[cityId].prep + '.';
        }
    }

    function initCityFromQuery() {
        const params = new URLSearchParams(window.location.search || '');
        let cityId = (params.get('city') || params.get('city_id') || '').toLowerCase();
        if (cityId === 'komsomolsk-na-amure') cityId = 'komsomolsk';
        if (!CITY_MAP[cityId]) {
            try { cityId = sessionStorage.getItem('remphone_city_id') || ''; } catch (e) { cityId = ''; }
        }
        if (!CITY_MAP[cityId] && document.referrer) {
            try {
                const referrerPath = new URL(document.referrer).pathname.toLowerCase();
                if (/\/vladivostok(?:\/|\.html$)/.test(referrerPath)) cityId = 'vladivostok';
                else if (
                    /\/komsomolsk-na-amure(?:\/|\.html$)/.test(referrerPath) ||
                    /\/cities\/komsomolsk\.html$/.test(referrerPath)
                ) {
                    cityId = 'komsomolsk';
                } else if (/\/khabarovsk(?:\/|\.html$)/.test(referrerPath)) {
                    cityId = 'khabarovsk';
                }
            } catch (e) {}
        }
        if (!CITY_MAP[cityId]) cityId = 'khabarovsk';
        setCity(cityId, { syncHero: true });
    }

    function modelsForBrand(brand) {
        const catalog = window.REMPHONE_REPAIR_MODELS || {};
        if (brand && catalog[brand] && catalog[brand].length) {
            return catalog[brand];
        }
        const all = [];
        Object.keys(catalog).forEach((key) => {
            (catalog[key] || []).forEach((label) => all.push(label));
        });
        return all;
    }

    function syncModelDatalist(brand) {
        const list = document.getElementById('repair-model-list');
        if (!list) return;
        const models = modelsForBrand(brand);
        list.innerHTML = models
            .map((label) => '<option value="' + String(label).replace(/"/g, '&quot;') + '">')
            .join('');
        const input = document.getElementById('flowModel');
        if (input && !input.getAttribute('list')) {
            input.setAttribute('list', 'repair-model-list');
        }
    }

    function applyBrandModelQuery() {
        const params = new URLSearchParams(window.location.search || '');
        const brand = (params.get('brand') || '').trim();
        const model = (params.get('model') || '').trim();
        const flowModel = document.getElementById('flowModel');
        if (model && flowModel) flowModel.value = model;

        if (brand) {
            const card = document.querySelector(
                '#stepBrand .flow-card[data-brand="' + brand.replace(/"/g, '') + '"]'
            );
            if (card) {
                document.querySelectorAll('#stepBrand .flow-card').forEach((el) => {
                    el.classList.remove('is-selected', 'card-selected');
                });
                card.classList.add('is-selected', 'card-selected');
                state.brand = brand;
                if (brandLabel) brandLabel.textContent = brand;
                if (flowBrand) flowBrand.value = brand;
                if (summaryBrand) summaryBrand.textContent = brand;
            }
        }

        syncModelDatalist(state.brand);
        if (brand && (window.location.hash || '') === '#repair-flow') {
            goTo(2);
        }
    }

    initCityFromQuery();

    document.querySelectorAll('#cityPicker .city-chip').forEach((btn) => {
        btn.addEventListener('click', () => setCity(btn.dataset.cityId || 'khabarovsk'));
    });
    if (flowCity) {
        flowCity.addEventListener('change', () => setCity(flowCity.value || 'khabarovsk'));
    }
    function goTo(step) {
        Object.keys(panels).forEach((key) => {
            const panel = panels[key];
            if (!panel) return;
            const active = Number(key) === step;
            panel.hidden = !active;
            panel.classList.toggle('is-active', active);
            if (active) {
                panel.classList.remove('step-enter');
                void panel.offsetWidth;
                panel.classList.add('step-enter');
            }
        });
        steps.forEach((el) => {
            const n = Number(el.dataset.step);
            el.classList.toggle('is-active', n === step);
            el.classList.toggle('is-done', n < step);
        });
        if (step === 3) {
            document.documentElement.setAttribute('data-remphone-form-opened', 'true');
            document.dispatchEvent(new CustomEvent('remphone:form-open'));
        }
        root.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    applyBrandModelQuery();

    function readFields() {
        const params = new URLSearchParams(window.location.search || '');
        const utm = {};
        ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach((k) => {
            const v = params.get(k);
            if (v) utm[k] = v;
        });
        const cityEl = document.getElementById('flowCity');
        const cityId = (cityEl && cityEl.value) || state.cityId || 'khabarovsk';
        const cityName =
            (cityEl && cityEl.options[cityEl.selectedIndex] && cityEl.options[cityEl.selectedIndex].dataset.name) ||
            (CITY_MAP[cityId] && CITY_MAP[cityId].name) ||
            state.cityName ||
            'Хабаровск';
        return {
            brand: state.brand || (flowBrand && flowBrand.value) || '',
            problem: state.problem || (flowProblem && flowProblem.value) || '',
            part_preference: (flowPartPreference && flowPartPreference.value) || '',
            name: ((document.getElementById('flowName') || {}).value || '').trim(),
            phone: ((document.getElementById('flowPhone') || {}).value || '').trim(),
            model: ((document.getElementById('flowModel') || {}).value || '').trim(),
            city: cityName,
            city_id: cityId,
            comment: ((document.getElementById('flowComment') || {}).value || '').trim(),
            utm,
        };
    }

    function buildMessage(data) {
        const prefMap = { original: 'оригинал', analog: 'аналог' };
        const pref = prefMap[data.part_preference] || data.part_preference || '—';
        return [
            'Заявка на ремонт rem-phone.ru',
            '',
            `Имя: ${data.name || '—'}`,
            `Телефон: ${data.phone || '—'}`,
            `Марка: ${data.brand || '—'}`,
            `Модель: ${data.model || '—'}`,
            `Поломка: ${data.problem || '—'}`,
            `Деталь: ${pref}`,
            `Город: ${data.city || '—'}`,
            `Комментарий: ${data.comment || '—'}`,
        ].join('\n');
    }

    function validateForMessenger(data, requireContacts) {
        if (!data.brand || !data.problem) {
            const step = data.brand ? 2 : 1;
            showError(data.brand ? 'Выберите поломку.' : 'Выберите марку телефона.');
            goTo(step);
            window.requestAnimationFrame(() => {
                const target = document.querySelector(
                    step === 1 ? '#stepBrand .flow-card' : '#stepProblem .flow-card'
                );
                if (target) target.focus();
            });
            return false;
        }
        if (requireContacts && (!data.name || !data.phone)) {
            showError(!data.name ? 'Укажите имя.' : 'Укажите номер телефона.');
            const target = document.getElementById(!data.name ? 'flowName' : 'flowPhone');
            if (target) target.focus();
            return false;
        }
        return true;
    }

    function renderNearbyPartners() {
        if (nearbyBox) nearbyBox.hidden = true;
        if (nearbyList) nearbyList.innerHTML = '';
    }

    function showSuccess(partners) {
        hideError();
        if (form) form.hidden = true;
        if (success) {
            success.hidden = false;
            success.classList.add('show');
        }
        renderNearbyPartners(partners || []);
        if (typeof window.REMPHONE_REACH === 'function') {
            window.REMPHONE_REACH('request-form-submit');
        }
        resetRequestId();
    }

    function showError(message) {
        if (!errorBox) {
            console.error(message);
            return;
        }
        errorBox.hidden = false;
        errorBox.textContent = message;
    }

    function hideError() {
        if (errorBox) {
            errorBox.hidden = true;
            errorBox.textContent = '';
        }
    }

    function isRelayConfigured() {
        if (!relayUrl) return false;
        if (/ВСТАВИТЬ|YOUR_|example\.com|localhost/i.test(relayUrl)) return false;
        return /^https?:\/\//i.test(relayUrl);
    }

    async function sendToRelay(data) {
        if (!isRelayConfigured()) {
            throw new Error('relay_not_configured');
        }

        const controller = typeof AbortController === 'function' ? new AbortController() : null;
        const timeoutId = controller
            ? window.setTimeout(() => controller.abort(), 15000)
            : null;
        let res;
        try {
            res = await fetch(relayUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                body: JSON.stringify({
                    name: data.name,
                    phone: data.phone,
                    brand: data.brand,
                    model: data.model || '',
                    problem: data.problem,
                    part_preference: data.part_preference || '',
                    city: data.city || 'Хабаровск',
                    city_id: data.city_id || 'khabarovsk',
                    comment: data.comment || '',
                    source: 'site',
                    client_request_id: requestIdFor(data),
                    utm: data.utm || {},
                    page: typeof location !== 'undefined' ? location.pathname : '',
                }),
                signal: controller ? controller.signal : undefined,
            });
        } finally {
            if (timeoutId !== null) window.clearTimeout(timeoutId);
        }

        let json = {};
        try {
            json = await res.json();
        } catch (e) {
            json = {};
        }

        if (!res.ok || json.success === false || json.accepted === false) {
            throw new Error(json.message || json.error || ('HTTP ' + res.status));
        }
        return json;
    }

    async function handlePrimarySubmit(event) {
        if (event) event.preventDefault();
        hideError();

        const data = readFields();
        if (!validateForMessenger(data, true)) return;
        if (typeof window.REMPHONE_GA_EVENT === 'function') {
            window.REMPHONE_GA_EVENT('request-form-attempt');
        }

        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Отправка…';
        }

        try {
            const result = await sendToRelay(data);
            showSuccess(result.partners || []);
        } catch (err) {
            console.error('Relay submit failed', err);
            if (typeof window.REMPHONE_GA_EVENT === 'function') {
                window.REMPHONE_GA_EVENT('request-form-error');
            }
            showError(
                'Не удалось отправить автоматически. Напишите нам в Telegram или позвоните: ' +
                    phoneDisplay
            );
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Отправить заявку';
            }
        }
    }

    document.querySelectorAll('#stepBrand .flow-card').forEach((card) => {
        card.addEventListener('click', () => {
            document.querySelectorAll('#stepBrand .flow-card').forEach((c) => {
                c.classList.remove('is-selected', 'card-selected');
            });
            card.classList.add('is-selected', 'card-selected');
            const nextBrand = card.dataset.brand || '';
            if (state.brand !== nextBrand) resetRequestId();
            state.brand = nextBrand;
            if (brandLabel) brandLabel.textContent = state.brand;
            if (flowBrand) flowBrand.value = state.brand;
            if (summaryBrand) summaryBrand.textContent = state.brand;
            syncModelDatalist(state.brand);
            setTimeout(() => goTo(2), 180);
        });
    });

    document.querySelectorAll('#stepProblem .flow-card').forEach((card) => {
        card.addEventListener('click', () => {
            document.querySelectorAll('#stepProblem .flow-card').forEach((c) => {
                c.classList.remove('is-selected', 'card-selected');
            });
            card.classList.add('is-selected', 'card-selected');
            const nextProblem = card.dataset.problem || '';
            if (state.problem !== nextProblem) resetRequestId();
            state.problem = nextProblem;
            if (flowProblem) flowProblem.value = state.problem;
            if (summaryProblem) summaryProblem.textContent = state.problem;
            setTimeout(() => goTo(3), 180);
        });
    });

    const backBrand = document.getElementById('backToBrand');
    if (backBrand) backBrand.addEventListener('click', () => goTo(1));

    const backProblem = document.getElementById('backToProblem');
    if (backProblem) backProblem.addEventListener('click', () => goTo(2));

    const actions = document.getElementById('flowActions');
    if (actions) {
        actions.addEventListener('click', (event) => {
            const btn = event.target.closest('[data-action]');
            if (!btn) return;

            const action = btn.dataset.action;
            const data = readFields();
            const needContacts = action !== 'call';
            if (!validateForMessenger(data, needContacts)) return;

            const text = buildMessage(data);

            if (action === 'call') {
                window.location.href = `tel:${phoneTel}`;
                return;
            }
            if (action === 'whatsapp') {
                window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
                return;
            }
            if (action === 'telegram') {
                window.open(
                    `https://t.me/${telegramBot}?text=${encodeURIComponent(text)}`,
                    '_blank',
                    'noopener'
                );
            }
        });
    }

    if (form) {
        form.addEventListener('submit', handlePrimarySubmit);
    }
    [document.getElementById('flowModel'), flowPartPreference].forEach((field) => {
        if (field) field.addEventListener('change', resetRequestId);
    });

    const restart = document.getElementById('flowRestart');
    if (restart) {
        restart.addEventListener('click', () => {
            resetRequestId();
            state.brand = '';
            state.problem = '';
            document.querySelectorAll('.flow-card.is-selected, .flow-card.card-selected').forEach((c) => {
                c.classList.remove('is-selected', 'card-selected');
            });
            if (form) {
                form.reset();
                form.hidden = false;
                setCity(state.cityId, true);
            }
            if (success) {
                success.hidden = true;
                success.classList.remove('show');
            }
            hideError();
            if (flowBrand) flowBrand.value = '';
            if (flowProblem) flowProblem.value = '';
            if (flowPartPreference) flowPartPreference.value = '';
            goTo(1);
        });
    }

    window.REMPHONE_APPLY_DISPLAY_PREFERENCE = function (opts) {
        opts = opts || {};
        const brand = opts.brand || '';
        const preference = opts.part_preference || '';
        const problem = opts.problem || 'Разбит экран';
        resetRequestId();

        state.brand = brand;
        state.problem = problem;
        if (flowBrand) flowBrand.value = brand;
        if (flowProblem) flowProblem.value = problem;
        if (flowPartPreference) flowPartPreference.value = preference;
        if (brandLabel) brandLabel.textContent = brand;
        if (summaryBrand) summaryBrand.textContent = brand || '—';
        if (summaryProblem) summaryProblem.textContent = problem || '—';

        document.querySelectorAll('#stepBrand .flow-card').forEach((c) => {
            const on = (c.dataset.brand || '') === brand;
            c.classList.toggle('is-selected', on);
            c.classList.toggle('card-selected', on);
        });
        document.querySelectorAll('#stepProblem .flow-card').forEach((c) => {
            const on = (c.dataset.problem || '') === problem;
            c.classList.toggle('is-selected', on);
            c.classList.toggle('card-selected', on);
        });

        if (form) {
            form.hidden = false;
            form.classList.remove('show');
        }
        if (success) {
            success.hidden = true;
            success.classList.remove('show');
        }
        hideError();
        goTo(3);
    };
})();

/* ——— Lightweight visual helpers ——— */
(function () {
    if (window.__REMPHONE_VISUAL__) return;
    window.__REMPHONE_VISUAL__ = true;

    function lazyBelowFoldImages() {
        document.querySelectorAll('img:not([loading])').forEach(function (img, index) {
            if (index > 1) img.loading = 'lazy';
            img.decoding = 'async';
        });
    }

    function ensureViewportFit() {
        var meta = document.querySelector('meta[name="viewport"]');
        if (!meta) return;
        var content = meta.getAttribute('content') || '';
        if (content.indexOf('viewport-fit') === -1) {
            meta.setAttribute('content', content.replace(/\s+$/, '') + ', viewport-fit=cover');
        }
    }

    ensureViewportFit();
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', lazyBelowFoldImages);
    } else {
        lazyBelowFoldImages();
    }
})();
