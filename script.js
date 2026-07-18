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