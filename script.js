function bindMobileNav() {
    const burger = document.getElementById('burger');
    const nav = document.getElementById('nav');
    if (!burger || !nav || burger.dataset.bound === '1') return;
    burger.dataset.bound = '1';

    function isOpen() {
        return nav.classList.contains('active') || nav.classList.contains('open');
    }

    function setOpen(open) {
        nav.classList.toggle('active', open);
        nav.classList.remove('open');
        burger.classList.toggle('is-open', open);
        burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    }

    burger.setAttribute('aria-expanded', isOpen() ? 'true' : 'false');
    burger.setAttribute('aria-controls', 'nav');

    burger.addEventListener('click', (e) => {
        e.stopPropagation();
        setOpen(!isOpen());
    });

    nav.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => setOpen(false));
    });

    document.addEventListener('click', (e) => {
        if (!isOpen()) return;
        if (nav.contains(e.target) || burger.contains(e.target)) return;
        setOpen(false);
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') setOpen(false);
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindMobileNav);
} else {
    bindMobileNav();
}

// FAQ accordion
document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
        const item = question.parentElement;
        const isActive = item.classList.contains('active');
        
        // Close all
        document.querySelectorAll('.faq-item').forEach(faq => {
            faq.classList.remove('active');
        });
        
        // Open clicked if wasn't active
        if (!isActive) {
            item.classList.add('active');
        }
    });
});

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

// Form submission
function submitForm(event) {
    event.preventDefault();
    
    const form = document.getElementById('repairForm');
    const formContent = document.getElementById('formContent');
    const formSuccess = document.getElementById('formSuccess');
    
    // Simple validation
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const brand = document.getElementById('brand').value;
    const problem = document.getElementById('problem').value;
    const city = document.getElementById('city').value;
    
    if (!name || !phone || !brand || !problem || !city) {
        alert('Пожалуйста, заполните все обязательные поля');
        return false;
    }
    
    // Simulate form submission
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.textContent = 'Отправка...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        formContent.style.display = 'none';
        formSuccess.classList.add('show');
    }, 1000);
    
    return false;
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
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
        const meta = CITY_MAP[cityId] || CITY_MAP.khabarovsk;
        state.cityId = meta === CITY_MAP[cityId] ? cityId : 'khabarovsk';
        if (!CITY_MAP[cityId]) cityId = 'khabarovsk';
        state.cityId = cityId;
        state.cityName = CITY_MAP[cityId].name;
        try { sessionStorage.setItem('remphone_city_id', cityId); } catch (e) {}
        if (flowCity) flowCity.value = cityId;
        if (flowCityId) flowCityId.value = cityId;
        document.querySelectorAll('#cityPicker .city-chip').forEach((btn) => {
            btn.classList.toggle('is-active', btn.dataset.cityId === cityId);
        });
        if (syncHero && heroTitle) {
            heroTitle.innerHTML = 'Ремонт телефонов <span>' + CITY_MAP[cityId].prep + '</span>';
        }
        if (syncHero && heroLead) {
            heroLead.textContent = 'Отправьте заявку — подберём партнёрский сервис ' + CITY_MAP[cityId].prep + '.';
        }
    }

    function initCityFromQuery() {
        const params = new URLSearchParams(window.location.search || '');
        let cityId = (params.get('city') || params.get('city_id') || '').toLowerCase();
        if (cityId === 'komsomolsk-na-amure') cityId = 'komsomolsk';
        if (!CITY_MAP[cityId]) {
            try { cityId = sessionStorage.getItem('remphone_city_id') || ''; } catch (e) { cityId = ''; }
        }
        if (!CITY_MAP[cityId]) cityId = 'khabarovsk';
        setCity(cityId, { syncHero: true });
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
        root.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

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
            alert('Сначала выберите марку и поломку');
            goTo(1);
            return false;
        }
        if (requireContacts && (!data.name || !data.phone)) {
            alert('Укажите имя и телефон');
            return false;
        }
        return true;
    }

    function renderNearbyPartners(partners) {
        if (!nearbyBox || !nearbyList) return;
        nearbyList.innerHTML = '';
        if (!partners || !partners.length) {
            nearbyBox.hidden = true;
            return;
        }
        partners.slice(0, 3).forEach((p) => {
            const card = document.createElement('div');
            card.className = 'nearby-partner-card';
            card.innerHTML =
                '<div class="nearby-partner-badge">' +
                (p.badge || 'Наш партнёр') +
                '</div>' +
                '<strong class="nearby-partner-name">' +
                (p.name || 'Партнёрский сервис') +
                '</strong>' +
                '<p class="nearby-partner-spec">' +
                (p.specialization || 'Ремонт телефонов, 3+ года опыта') +
                '</p>' +
                (p.district
                    ? '<p class="nearby-partner-district">' + p.district + '</p>'
                    : '');
            nearbyList.appendChild(card);
        });
        nearbyBox.hidden = false;
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
    }

    function showError(message) {
        if (!errorBox) {
            alert(message);
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

        const res = await fetch(relayUrl, {
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
                client_request_id: 'site-' + String(data.phone || '').replace(/\D/g, '') + '-' + Date.now(),
                utm: data.utm || {},
                page: typeof location !== 'undefined' ? location.pathname : '',
            }),
        });

        let json = {};
        try {
            json = await res.json();
        } catch (e) {
            json = {};
        }

        if (!res.ok || json.success === false) {
            throw new Error(json.message || json.error || ('HTTP ' + res.status));
        }
        return json;
    }

    async function handlePrimarySubmit(event) {
        if (event) event.preventDefault();
        hideError();

        const data = readFields();
        if (!validateForMessenger(data, true)) return;

        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Отправка...';
        }

        try {
            const result = await sendToRelay(data);
            showSuccess(result.partners || []);
        } catch (err) {
            console.error('Relay submit failed', err);
            showError(
                'Не удалось отправить автоматически. Напишите нам в Telegram или позвоните: ' +
                    phoneDisplay
            );
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = '🛠 Отправить заявку';
            }
        }
    }

    document.querySelectorAll('#stepBrand .flow-card').forEach((card) => {
        card.addEventListener('click', () => {
            document.querySelectorAll('#stepBrand .flow-card').forEach((c) => {
                c.classList.remove('is-selected', 'card-selected');
            });
            card.classList.add('is-selected', 'card-selected');
            state.brand = card.dataset.brand || '';
            if (brandLabel) brandLabel.textContent = state.brand;
            if (flowBrand) flowBrand.value = state.brand;
            if (summaryBrand) summaryBrand.textContent = state.brand;
            setTimeout(() => goTo(2), 180);
        });
    });

    document.querySelectorAll('#stepProblem .flow-card').forEach((card) => {
        card.addEventListener('click', () => {
            document.querySelectorAll('#stepProblem .flow-card').forEach((c) => {
                c.classList.remove('is-selected', 'card-selected');
            });
            card.classList.add('is-selected', 'card-selected');
            state.problem = card.dataset.problem || '';
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

    const restart = document.getElementById('flowRestart');
    if (restart) {
        restart.addEventListener('click', () => {
            state.brand = '';
            state.problem = '';
            document.querySelectorAll('.flow-card.is-selected, .flow-card.card-selected').forEach((c) => {
                c.classList.remove('is-selected', 'card-selected');
            });
            if (form) {
                form.reset();
                form.hidden = false;
                const city = document.getElementById('flowCity');
                if (city) city.value = 'Хабаровск';
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

/* ——— Visual: fonts preconnect, mesh cursor, repairs counter ——— */
(function () {
    if (window.__REMPHONE_VISUAL__) return;
    window.__REMPHONE_VISUAL__ = true;

    function injectFonts() {
        if (document.querySelector('link[data-rp-fonts]')) return;
        var head = document.head;
        function link(rel, href, extra) {
            var el = document.createElement('link');
            el.rel = rel;
            el.href = href;
            el.setAttribute('data-rp-fonts', '1');
            if (extra) {
                Object.keys(extra).forEach(function (k) {
                    el[k] = extra[k];
                });
            }
            head.appendChild(el);
        }
        link('preconnect', 'https://fonts.googleapis.com');
        link('preconnect', 'https://fonts.gstatic.com', { crossOrigin: 'anonymous' });
        link(
            'stylesheet',
            'https://fonts.googleapis.com/css2?family=Inter:wght@400;500&family=Space+Grotesk:wght@600;700&display=swap'
        );
    }

    function reducedMotion() {
        return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    function canHoverMesh() {
        return (
            window.matchMedia &&
            window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
            !reducedMotion()
        );
    }

    function bindMeshCursor() {
        if (!canHoverMesh()) return;
        var targets = document.querySelectorAll('.hero, .repair-flow');
        if (!targets.length) return;

        var pending = null;
        var lastX = 50;
        var lastY = 30;

        function apply() {
            pending = null;
            for (var i = 0; i < targets.length; i++) {
                targets[i].style.setProperty('--mesh-x', lastX.toFixed(2) + '%');
                targets[i].style.setProperty('--mesh-y', lastY.toFixed(2) + '%');
            }
        }

        document.addEventListener(
            'mousemove',
            function (e) {
                lastX = (e.clientX / Math.max(window.innerWidth, 1)) * 100;
                lastY = (e.clientY / Math.max(window.innerHeight, 1)) * 100;
                if (pending != null) return;
                pending = window.requestAnimationFrame(apply);
            },
            { passive: true }
        );
    }

    function animateCount(el, target, suffix, duration) {
        var start = performance.now();
        function frame(now) {
            var t = Math.min(1, (now - start) / duration);
            var eased = 1 - Math.pow(1 - t, 3);
            el.textContent = Math.round(target * eased) + suffix;
            if (t < 1) requestAnimationFrame(frame);
            else el.textContent = target + suffix;
        }
        requestAnimationFrame(frame);
    }

    function bindRepairsCounter() {
        var target =
            (window.REMPHONE_CONFIG && Number(window.REMPHONE_CONFIG.repairsCount)) || 500;
        var nodes = document.querySelectorAll('.trust-bar-text p, .about-stat h3, .hero-stat h3');
        var candidates = [];

        nodes.forEach(function (node) {
            var text = (node.textContent || '').trim();
            var m = text.match(/^(\d+)\+(\s*.*)$/);
            if (!m) return;
            if (node.getAttribute('data-count-ready')) return;
            node.setAttribute('data-count-ready', '1');
            var rest = m[2] || '';
            var span = document.createElement('span');
            span.className = 'stat-count';
            span.setAttribute('data-target', String(target));
            span.textContent = reducedMotion() ? target + '+' : '0+';
            node.textContent = '';
            node.appendChild(span);
            if (rest) node.appendChild(document.createTextNode(rest));
            candidates.push(span);
        });

        if (!candidates.length) return;

        if (reducedMotion()) {
            candidates.forEach(function (span) {
                span.textContent = target + '+';
            });
            return;
        }

        if (!('IntersectionObserver' in window)) {
            candidates.forEach(function (span) {
                animateCount(span, target, '+', 1200);
            });
            return;
        }

        var io = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (!entry.isIntersecting) return;
                    var span = entry.target;
                    if (span.getAttribute('data-counted')) return;
                    span.setAttribute('data-counted', '1');
                    animateCount(span, target, '+', 1300);
                    io.unobserve(span);
                });
            },
            { threshold: 0.35 }
        );

        candidates.forEach(function (span) {
            io.observe(span);
        });
    }

    function preferProblemWebp() {
        document.querySelectorAll('img[src*="assets/problems/"]').forEach(function (img) {
            var src = img.getAttribute('src') || '';
            if (!/\.png(\?|$)/i.test(src)) return;
            var webp = src.replace(/\.png(\?|$)/i, '.webp$1');
            var probe = new Image();
            probe.onload = function () {
                img.src = webp;
            };
            probe.src = webp;
            if (!img.getAttribute('width')) img.setAttribute('width', '76');
            if (!img.getAttribute('height')) img.setAttribute('height', '76');
            img.decoding = 'async';
            if (!img.loading) img.loading = 'lazy';
        });
    }

    function lazyBelowFoldImages() {
        var imgs = document.querySelectorAll('img:not([loading])');
        imgs.forEach(function (img, i) {
            if (i < 2) return;
            img.loading = 'lazy';
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

    function cityQueryFromPath() {
        var path = (location.pathname || '').toLowerCase();
        if (path.indexOf('/khabarovsk') !== -1) return 'khabarovsk';
        if (path.indexOf('/komsomolsk') !== -1) return 'komsomolsk';
        if (path.indexOf('/vladivostok') !== -1) return 'vladivostok';
        return '';
    }

    function ensureStickyMobileBar() {
        if (document.getElementById('stickyMobileBar')) return;
        var cfg = window.REMPHONE_CONFIG || {};
        var phoneTel = cfg.phoneTel || '+79144111730';
        var wa = cfg.whatsapp || '79144111730';
        var city = cityQueryFromPath();
        var flowHref = city ? '/?city=' + encodeURIComponent(city) + '#repair-flow' : '/#repair-flow';
        var bar = document.createElement('div');
        bar.className = 'sticky-mobile-bar floating-contact';
        bar.id = 'stickyMobileBar';
        bar.innerHTML =
            '<a class="sticky-fab sticky-call btn-pulse" href="tel:' + phoneTel + '" aria-label="Позвонить">' +
            '<img src="/assets/messengers/phone.svg" alt="" width="26" height="26"></a>' +
            '<a class="sticky-fab sticky-wa btn-pulse" href="https://wa.me/' + wa + '" target="_blank" rel="noopener" aria-label="WhatsApp">' +
            '<img src="/assets/messengers/whatsapp.svg" alt="" width="26" height="26"></a>' +
            '<a class="sticky-fab sticky-flow" href="' + flowHref + '">Заявка</a>';
        document.body.appendChild(bar);
    }

    injectFonts();
    ensureViewportFit();
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            bindMeshCursor();
            bindRepairsCounter();
            preferProblemWebp();
            lazyBelowFoldImages();
            ensureStickyMobileBar();
            bindMobileNav();
        });
    } else {
        bindMeshCursor();
        bindRepairsCounter();
        preferProblemWebp();
        lazyBelowFoldImages();
        ensureStickyMobileBar();
        bindMobileNav();
    }
})();
