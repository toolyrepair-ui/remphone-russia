/**
 * REMPHONE RUSSIA v2.0 — Улучшенный JavaScript
 * Современный агрегатор сервисов по ремонту техники
 */

// ========== DOM ELEMENTS ==========
const header = document.getElementById('header');
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');
const heroSearchForm = document.getElementById('heroSearchForm');
const repairForm = document.getElementById('repairForm');
const formContent = document.getElementById('formContent');
const formSuccess = document.getElementById('formSuccess');
const submitBtn = document.getElementById('submitBtn');
const phoneInput = document.getElementById('phone');

// ========== HEADER SCROLL EFFECT ==========
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
});

// ========== MOBILE MENU ==========
if (burger && nav) {
    burger.addEventListener('click', () => {
        burger.classList.toggle('active');
        nav.classList.toggle('active');
        document.body.style.overflow = burger.classList.contains('active') ? 'hidden' : '';
    });
    
    // Close menu when clicking on links
    const navLinks = nav.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            burger.classList.remove('active');
            nav.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!burger.contains(e.target) && !nav.contains(e.target)) {
            burger.classList.remove('active');
            nav.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// ========== HERO SEARCH FORM ==========
if (heroSearchForm) {
    heroSearchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const category = document.getElementById('heroCategory').value;
        const brand = document.getElementById('heroBrand').value;
        const problem = document.getElementById('heroProblem').value;
        
        // Build URL with filters
        const params = new URLSearchParams();
        if (category) params.set('category', category);
        if (brand) params.set('brand', brand);
        if (problem) params.set('problem', problem);
        
        // Redirect to catalog with filters
        window.location.href = `services/index.html?${params.toString()}`;
    });
}

// ========== FILTERS ==========
const filterBrand = document.getElementById('filterBrand');
const filterService = document.getElementById('filterService');
const filterUrgency = document.getElementById('filterUrgency');
const filterPrice = document.getElementById('filterPrice');
const filterDistrict = document.getElementById('filterDistrict');
const filterRating = document.getElementById('filterRating');
const filterChips = document.querySelectorAll('.filter-chip');

function applyFilters() {
    const filters = {
        brand: filterBrand?.value || '',
        service: filterService?.value || '',
        urgency: filterUrgency?.value || '',
        price: filterPrice?.value || '',
        district: filterDistrict?.value || '',
        rating: filterRating?.value || ''
    };
    
    // Get active chips
    const activeChips = Array.from(filterChips)
        .filter(chip => chip.classList.contains('active'))
        .map(chip => chip.dataset.filter);
    
    // Filter provider cards
    const providerCards = document.querySelectorAll('.provider-card');
    
    providerCards.forEach(card => {
        let show = true;
        
        // Check brand filter
        if (filters.brand && !card.textContent.includes(filters.brand)) {
            show = false;
        }
        
        // Check service filter
        if (filters.service && !card.textContent.includes(getServiceName(filters.service))) {
            show = false;
        }
        
        // Check district filter
        if (filters.district && !card.textContent.includes(getDistrictName(filters.district))) {
            show = false;
        }
        
        // Check rating filter
        if (filters.rating) {
            const ratingElement = card.querySelector('.provider-rating');
            if (ratingElement) {
                const rating = parseFloat(ratingElement.textContent.replace('⭐ ', ''));
                if (rating < parseFloat(filters.rating)) {
                    show = false;
                }
            }
        }
        
        // Check chips
        if (activeChips.length > 0) {
            const cardText = card.textContent.toLowerCase();
            const hasChip = activeChips.some(chip => {
                switch(chip) {
                    case 'warranty': return cardText.includes('гарантия');
                    case 'visit': return cardText.includes('выезд');
                    case 'original': return cardText.includes('оригинал');
                    case 'express': return cardText.includes('экспресс') || cardText.includes('30 мин');
                    default: return false;
                }
            });
            
            if (!hasChip) show = false;
        }
        
        card.style.display = show ? 'flex' : 'none';
    });
}

function getServiceName(value) {
    const names = {
        'screen': 'Экран',
        'battery': 'Батарея',
        'charge': 'Зарядка',
        'water': 'Вода',
        'camera': 'Камера'
    };
    return names[value] || value;
}

function getDistrictName(value) {
    const names = {
        'center': 'Центр',
        'railway': 'Вокзальная',
        'lenin': 'Ленинский',
        'industrial': 'Индустриальный'
    };
    return names[value] || value;
}

// Add event listeners to filters
[filterBrand, filterService, filterUrgency, filterPrice, filterDistrict, filterRating].forEach(filter => {
    if (filter) {
        filter.addEventListener('change', applyFilters);
    }
});

// Add event listeners to chips
filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
        chip.classList.toggle('active');
        applyFilters();
    });
});

// ========== FAQ ACCORDION ==========
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    if (question) {
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all items
            faqItems.forEach(i => i.classList.remove('active'));
            
            // Open clicked item if it wasn't active
            if (!isActive) {
                item.classList.add('active');
            }
        });
    }
});

// ========== FORM HANDLING ==========
if (repairForm) {
    // Phone formatting
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length > 0) {
                if (value[0] === '7' || value[0] === '8') {
                    value = value.substring(1);
                }
                
                let formatted = '+7';
                if (value.length > 0) {
                    formatted += ' (' + value.substring(0, 3);
                }
                if (value.length > 3) {
                    formatted += ') ' + value.substring(3, 6);
                }
                if (value.length > 6) {
                    formatted += '-' + value.substring(6, 8);
                }
                if (value.length > 8) {
                    formatted += '-' + value.substring(8, 10);
                }
                
                e.target.value = formatted;
            }
        });
    }
    
    // Form submission
    repairForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Disable button
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Отправка...';
        }
        
        // Collect form data
        const formData = {
            name: document.getElementById('name')?.value || '',
            phone: document.getElementById('phone')?.value || '',
            brand: document.getElementById('brand')?.value || '',
            model: document.getElementById('model')?.value || '',
            problem: document.getElementById('problem')?.value || '',
            city: document.getElementById('city')?.value || ''
        };
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Log form data (replace with actual API call)
        console.log('Form submitted:', formData);
        
        // Show success message
        if (formContent) formContent.style.display = 'none';
        if (formSuccess) formSuccess.classList.add('show');
        
        // Reset button
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = '🛠 Отправить заявку';
        }
    });
}

// ========== SMOOTH SCROLL ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        if (href !== '#') {
            e.preventDefault();
            
            const target = document.querySelector(href);
            if (target) {
                const headerHeight = header?.offsetHeight || 72;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// ========== ANIMATIONS ON SCROLL ==========
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in-up');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements
document.querySelectorAll('.provider-card, .benefit-card, .how-step, .review-card, .popular-card').forEach(el => {
    observer.observe(el);
});

// ========== STICKY MOBILE CTA ==========
const stickyCTA = document.querySelector('.sticky-mobile-cta');
const ctaSection = document.getElementById('form');

if (stickyCTA && ctaSection) {
    const observerCTA = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                stickyCTA.style.display = 'none';
            } else {
                stickyCTA.style.display = 'flex';
            }
        });
    }, { threshold: 0.1 });
    
    observerCTA.observe(ctaSection);
}

// ========== REVIEWS FILTER ==========
const reviewCards = document.querySelectorAll('.review-card');
const filterButtons = document.querySelectorAll('[data-filter]');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        const filter = button.dataset.filter;
        
        reviewCards.forEach(card => {
            if (filter === 'all' || card.dataset[filter]) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// ========== POPULAR REQUESTS ==========
const popularCards = document.querySelectorAll('.popular-card');

popularCards.forEach(card => {
    card.addEventListener('click', (e) => {
        e.preventDefault();
        
        const href = card.getAttribute('href');
        if (href && href !== '#') {
            // Add animation
            card.style.transform = 'scale(0.95)';
            setTimeout(() => {
                card.style.transform = '';
                window.location.href = href;
            }, 200);
        }
    });
});

// ========== DISTRICT ITEMS ==========
const districtItems = document.querySelectorAll('.district-item');

districtItems.forEach(item => {
    item.addEventListener('click', () => {
        const district = item.querySelector('h4')?.textContent || '';
        
        // Scroll to catalog
        const catalog = document.getElementById('catalog');
        if (catalog) {
            const headerHeight = header?.offsetHeight || 72;
            const targetPosition = catalog.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
        
        // Apply district filter
        if (filterDistrict) {
            filterDistrict.value = item.dataset.district || '';
            applyFilters();
        }
    });
});

// ========== PERFORMANCE: Debounce scroll events ==========
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

// Apply debounce to scroll-heavy functions
const debouncedScrollHandler = debounce(() => {
    // Any additional scroll handling
}, 10);

window.addEventListener('scroll', debouncedScrollHandler);

// ========== LAZY LOADING (prepared for images) ==========
if ('loading' in HTMLImageElement.prototype) {
    // Native lazy loading supported
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.src = img.dataset.src;
    });
} else {
    // Fallback for browsers that don't support lazy loading
    const lazyImages = document.querySelectorAll('.lazy');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
}

// ========== SERVICE TAGS CLICK ==========
const serviceTags = document.querySelectorAll('.service-tag');

serviceTags.forEach(tag => {
    tag.addEventListener('click', (e) => {
        e.preventDefault();
        
        const serviceName = tag.textContent.trim();
        
        // Scroll to filters
        const filtersSection = document.getElementById('filters');
        if (filtersSection) {
            const headerHeight = header?.offsetHeight || 72;
            const targetPosition = filtersSection.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
        
        // Apply service filter
        if (filterService) {
            const serviceValue = getServiceValue(serviceName);
            if (serviceValue) {
                filterService.value = serviceValue;
                applyFilters();
            }
        }
    });
});

function getServiceValue(name) {
    const map = {
        'Экран': 'screen',
        'Батарея': 'battery',
        'Зарядка': 'charge',
        'После воды': 'water',
        'Камера': 'camera'
    };
    return map[name] || '';
}

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', () => {
    // Add loaded class to body
    document.body.classList.add('loaded');
    
    // Log initialization
    console.log('🚀 REMPHONE RUSSIA v2.0 initialized');
    console.log('📱 Modern aggregator ready');
    console.log('✨ All features loaded');
});

// ========== EXPORT FOR TESTING ==========
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        applyFilters,
        getServiceName,
        getDistrictName,
        getServiceValue
    };
}