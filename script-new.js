// ============================================
// REMPHONE RUSSIA — Modern Aggregator Scripts
// ============================================

// Mobile menu toggle
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');

if (burger && nav) {
    burger.addEventListener('click', () => {
        burger.classList.toggle('active');
        nav.classList.toggle('active');
    });
}

// Close mobile menu when clicking on a link
if (nav) {
    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            burger.classList.remove('active');
            nav.classList.remove('active');
        });
    });
}

// Header scroll effect
let lastScroll = 0;
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// FAQ accordion
document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
        const item = question.parentElement;
        const isActive = item.classList.contains('active');
        
        // Close all items
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
const revealElements = document.querySelectorAll('.section-header, .service-card, .provider-card, .review-card, .how-step');

const revealOnScroll = () => {
    revealElements.forEach(el => {
        const elementTop = el.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementTop < windowHeight - 100) {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }
    });
};

// Initialize reveal elements
revealElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
});

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
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            const headerHeight = document.getElementById('header').offsetHeight;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Review filters
function filterReviews() {
    const cityFilter = document.getElementById('reviewCityFilter');
    const serviceFilter = document.getElementById('reviewServiceFilter');
    const cards = document.querySelectorAll('.review-card');
    
    if (!cityFilter || !serviceFilter) return;
    
    const cityValue = cityFilter.value.toLowerCase();
    const serviceValue = serviceFilter.value.toLowerCase();
    
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

// Quick search form
function quickSearch(event) {
    event.preventDefault();
    const problem = document.getElementById('quickProblem');
    const brand = document.getElementById('quickBrand');
    
    const p = problem ? problem.value : '';
    const b = brand ? brand.value : '';
    
    // Build query string
    const params = new URLSearchParams();
    if (p) params.set('problem', p);
    if (b) params.set('brand', b);
    
    // For now open services page with query
    const url = params.toString() ? `services/?${params.toString()}` : 'services/';
    window.location.href = url;
}

const quickForm = document.getElementById('quickSearchForm');
if (quickForm) {
    quickForm.addEventListener('submit', quickSearch);
}

// Service filters on services page
function initServiceFilters() {
    const filterChips = document.querySelectorAll('.filter-chip');
    const serviceCards = document.querySelectorAll('.service-card');
    const brandFilter = document.getElementById('brandFilter');
    const priceFilter = document.getElementById('priceFilter');
    
    let activeFilter = 'all';
    
    // Filter chip clicks
    filterChips.forEach(chip => {
        chip.addEventListener('click', () => {
            // Update active state
            filterChips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            
            // Get filter value
            activeFilter = chip.dataset.filter;
            
            // Apply filters
            applyFilters();
        });
    });
    
    // Brand and price filters
    if (brandFilter) {
        brandFilter.addEventListener('change', applyFilters);
    }
    if (priceFilter) {
        priceFilter.addEventListener('change', applyFilters);
    }
    
    function applyFilters() {
        const brandValue = brandFilter ? brandFilter.value.toLowerCase() : '';
        const priceValue = priceFilter ? priceFilter.value : '';
        
        serviceCards.forEach(card => {
            const category = (card.dataset.category || '').toLowerCase();
            const brands = (card.dataset.brands || '').toLowerCase();
            const price = card.dataset.price || '';
            
            // Check category filter
            const categoryMatch = activeFilter === 'all' || category.includes(activeFilter);
            
            // Check brand filter
            const brandMatch = !brandValue || brands.includes(brandValue);
            
            // Check price filter
            let priceMatch = true;
            if (priceValue) {
                const [min, max] = priceValue.split('-').map(Number);
                const cardPrice = parseInt(price.split('-')[0]);
                priceMatch = cardPrice >= min && cardPrice <= max;
            }
            
            // Show/hide card
            card.style.display = categoryMatch && brandMatch && priceMatch ? '' : 'none';
        });
    }
}

// Initialize filters on services page
if (document.querySelector('.filter-chip')) {
    initServiceFilters();
}

// Catalog filters on main page
function initCatalogFilters() {
    const filterChips = document.querySelectorAll('.catalog-filters .filter-chip');
    
    filterChips.forEach(chip => {
        chip.addEventListener('click', () => {
            chip.classList.toggle('active');
        });
    });
}

if (document.querySelector('.catalog-filters .filter-chip')) {
    initCatalogFilters();
}

// Add to comparison (placeholder functionality)
function addToComparison(serviceName) {
    // Placeholder for comparison functionality
    console.log('Added to comparison:', serviceName);
    alert(`${serviceName} добавлен в сравнение`);
}

// Share functionality
function shareService(serviceName, url) {
    if (navigator.share) {
        navigator.share({
            title: serviceName,
            text: `Посмотрите услугу: ${serviceName}`,
            url: url
        }).catch(err => console.log('Share failed:', err));
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(url).then(() => {
            alert('Ссылка скопирована в буфер обмена');
        });
    }
}

// Phone number formatting
const phoneInputs = document.querySelectorAll('input[type="tel"]');
phoneInputs.forEach(input => {
    input.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 0) {
            if (value[0] === '7' || value[0] === '8') {
                value = value.substring(1);
            }
            const formatted = '+7 ' + value.match(/.{1,3}/g)?.join(' ') || value;
            e.target.value = formatted;
        }
    });
});

// Initialize all animations on page load
window.addEventListener('load', () => {
    // Trigger reveal for elements already in view
    setTimeout(revealOnScroll, 100);
});

// Performance: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debounce to scroll handlers
const debouncedScroll = debounce(() => {
    revealOnScroll();
}, 10);

window.removeEventListener('scroll', revealOnScroll);
window.addEventListener('scroll', debouncedScroll);