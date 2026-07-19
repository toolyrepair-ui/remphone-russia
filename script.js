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
    const whatsapp = cfg.whatsapp || '79144111730';
    const telegramBot = cfg.telegramBot || 'REMPHONE_RUSSIA_Bot';
    const emailTo = cfg.email || 'toolyrepair@gmail.com';
    const web3Key = (cfg.web3formsAccessKey || '').trim();

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

    function goTo(step) {
        Object.keys(panels).forEach((key) => {
            const panel = panels[key];
            if (!panel) return;
            const active = Number(key) === step;
            panel.hidden = !active;
            panel.classList.toggle('is-active', active);
            if (active) {
                panel.classList.remove('step-enter');
                // restart animation
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
        return {
            brand: state.brand || (flowBrand && flowBrand.value) || '',
            problem: state.problem || (flowProblem && flowProblem.value) || '',
            name: (document.getElementById('flowName') || {}).value || '',
            phone: (document.getElementById('flowPhone') || {}).value || '',
            model: (document.getElementById('flowModel') || {}).value || '',
            city: (document.getElementById('flowCity') || {}).value || '',
            comment: (document.getElementById('flowComment') || {}).value || '',
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
        if (requireContacts && (!data.name.trim() || !data.phone.trim())) {
            alert('Укажите имя и телефон');
            return false;
        }
        return true;
    }

    function showSuccess() {
        if (form) form.hidden = true;
        if (success) {
            success.hidden = false;
            success.classList.add('show');
        }
    }

    async function sendEmail(data) {
        const subject = `Заявка rem-phone.ru: ${data.brand} — ${data.problem}`;
        const payload = {
            name: data.name,
            phone: data.phone,
            brand: data.brand,
            model: data.model || '—',
            problem: data.problem,
            city: data.city || '—',
            comment: data.comment || '—',
            subject: subject,
        };

        if (web3Key) {
            const res = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                body: JSON.stringify({
                    access_key: web3Key,
                    subject: subject,
                    from_name: data.name,
                    ...payload,
                }),
            });
            const json = await res.json();
            if (!res.ok || json.success === false) {
                throw new Error(json.message || 'Web3Forms error');
            }
            return;
        }

        // FormSubmit — без ключа, письмо на EMAIL (первый раз подтвердите адрес)
        const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(emailTo)}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify({
                ...payload,
                _subject: subject,
                _template: 'table',
            }),
        });
        const json = await res.json().catch(() => ({}));
        if (!res.ok || json.success === 'false' || json.success === false) {
            throw new Error(json.message || 'Не удалось отправить на почту');
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
        actions.addEventListener('click', async (event) => {
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
                showSuccess();
                return;
            }

            if (action === 'telegram') {
                window.open(
                    `https://t.me/${telegramBot}?text=${encodeURIComponent(text)}`,
                    '_blank',
                    'noopener'
                );
                showSuccess();
                return;
            }

            if (action === 'email') {
                const original = btn.textContent;
                btn.disabled = true;
                btn.textContent = 'Отправка...';
                try {
                    await sendEmail(data);
                    showSuccess();
                } catch (err) {
                    console.error(err);
                    const mailto = `mailto:${emailTo}?subject=${encodeURIComponent(
                        `Заявка rem-phone.ru: ${data.brand} — ${data.problem}`
                    )}&body=${encodeURIComponent(text)}`;
                    window.location.href = mailto;
                    showSuccess();
                } finally {
                    btn.disabled = false;
                    btn.textContent = original;
                }
            }
        });
    }

    if (form) {
        form.addEventListener('submit', (event) => event.preventDefault());
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
            if (flowBrand) flowBrand.value = '';
            if (flowProblem) flowProblem.value = '';
            goTo(1);
        });
    }
})();
