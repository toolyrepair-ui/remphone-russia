// Mobile menu toggle
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');

if (burger && nav) {
    burger.addEventListener('click', () => {
        nav.classList.toggle('active');
    });
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
    
    if (currentScroll > 100) {
        header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
    } else {
        header.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)';
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

    const state = { brand: '', problem: '' };
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
    const form = document.getElementById('flowRepairForm');
    const success = document.getElementById('flowFormSuccess');
    const submitBtn = document.getElementById('flowSubmitBtn');
    const errorBox = document.getElementById('flowSubmitError');

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
        if (cityEl && !String(cityEl.value || '').trim()) cityEl.value = 'Хабаровск';
        return {
            brand: state.brand || (flowBrand && flowBrand.value) || '',
            problem: state.problem || (flowProblem && flowProblem.value) || '',
            name: ((document.getElementById('flowName') || {}).value || '').trim(),
            phone: ((document.getElementById('flowPhone') || {}).value || '').trim(),
            model: ((document.getElementById('flowModel') || {}).value || '').trim(),
            city: ((cityEl || {}).value || 'Хабаровск').trim() || 'Хабаровск',
            comment: ((document.getElementById('flowComment') || {}).value || '').trim(),
            utm,
        };
    }

    function buildMessage(data) {
        return [
            'Заявка на ремонт rem-phone.ru',
            '',
            `Имя: ${data.name || '—'}`,
            `Телефон: ${data.phone || '—'}`,
            `Марка: ${data.brand || '—'}`,
            `Модель: ${data.model || '—'}`,
            `Поломка: ${data.problem || '—'}`,
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

    function showSuccess() {
        hideError();
        if (form) form.hidden = true;
        if (success) {
            success.hidden = false;
            success.classList.add('show');
        }
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
                city: data.city || 'Хабаровск',
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
            await sendToRelay(data);
            showSuccess();
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
            goTo(1);
        });
    }
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
            'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500;600;700&display=swap'
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

    function lazyBelowFoldImages() {
        var imgs = document.querySelectorAll('img:not([loading])');
        imgs.forEach(function (img, i) {
            if (i < 2) return;
            img.loading = 'lazy';
            img.decoding = 'async';
        });
    }

    injectFonts();
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            bindMeshCursor();
            bindRepairsCounter();
            lazyBelowFoldImages();
        });
    } else {
        bindMeshCursor();
        bindRepairsCounter();
        lazyBelowFoldImages();
    }
})();
