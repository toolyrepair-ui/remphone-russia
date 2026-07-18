/**
 * REMPHONE RUSSIA v3.0 — Интерактивный мастер выбора
 * Пошаговый сценарий: Бренд → Проблема → Telegram
 */

// ========== DATA ==========
const phoneModels = {
    'iPhone': {
        'iPhone 17': ['iPhone 17', 'iPhone 17 Plus', 'iPhone 17 Pro', 'iPhone 17 Pro Max'],
        'iPhone 16': ['iPhone 16', 'iPhone 16 Plus', 'iPhone 16 Pro', 'iPhone 16 Pro Max'],
        'iPhone 15': ['iPhone 15', 'iPhone 15 Plus', 'iPhone 15 Pro', 'iPhone 15 Pro Max'],
        'iPhone 14': ['iPhone 14', 'iPhone 14 Plus', 'iPhone 14 Pro', 'iPhone 14 Pro Max'],
        'iPhone 13': ['iPhone 13 mini', 'iPhone 13', 'iPhone 13 Pro', 'iPhone 13 Pro Max'],
        'iPhone 12': ['iPhone 12 mini', 'iPhone 12', 'iPhone 12 Pro', 'iPhone 12 Pro Max'],
        'iPhone 11': ['iPhone 11', 'iPhone 11 Pro', 'iPhone 11 Pro Max'],
        'iPhone XS': ['iPhone XS', 'iPhone XS Max', 'iPhone XR'],
        'iPhone SE': ['iPhone SE (2020)', 'iPhone SE (2022)']
    },
    'Samsung': {
        'Galaxy S': ['Galaxy S26 Ultra', 'Galaxy S26+', 'Galaxy S26', 'Galaxy S25 Ultra', 'Galaxy S25+', 'Galaxy S25', 'Galaxy S24 Ultra', 'Galaxy S24+', 'Galaxy S24', 'Galaxy S23 Ultra', 'Galaxy S23+', 'Galaxy S23', 'Galaxy S22 Ultra', 'Galaxy S22+', 'Galaxy S22', 'Galaxy S21 Ultra', 'Galaxy S21+', 'Galaxy S21', 'Galaxy S20 Ultra', 'Galaxy S20+', 'Galaxy S20', 'Galaxy S10+', 'Galaxy S10', 'Galaxy S10e', 'Galaxy S9+', 'Galaxy S9'],
        'Galaxy A': ['Galaxy A55', 'Galaxy A54', 'Galaxy A35', 'Galaxy A34', 'Galaxy A14', 'Galaxy A73', 'Galaxy A53', 'Galaxy A33', 'Galaxy A72', 'Galaxy A52', 'Galaxy A32', 'Galaxy A71', 'Galaxy A51', 'Galaxy A41', 'Galaxy A31', 'Galaxy A70', 'Galaxy A50', 'Galaxy A30', 'Galaxy A20', 'Galaxy A10', 'Galaxy A9 (2018)', 'Galaxy A7 (2018)'],
        'Galaxy Note': ['Galaxy Note 20 Ultra', 'Galaxy Note 20', 'Galaxy Note 10+', 'Galaxy Note 10', 'Galaxy Note 9'],
        'Galaxy Z': ['Galaxy Z Fold 6', 'Galaxy Z Flip 6', 'Galaxy Z Fold 5', 'Galaxy Z Flip 5', 'Galaxy Z Fold 4', 'Galaxy Z Flip 4', 'Galaxy Z Fold 3', 'Galaxy Z Flip 3']
    },
    'Xiaomi': {
        'Mi': ['Mi 14 Ultra', 'Mi 14 Pro', 'Mi 14', 'Mi 13 Ultra', 'Mi 13 Pro', 'Mi 13', 'Mi 12 Pro', 'Mi 12', 'Mi 12X', 'Mi 11 Ultra', 'Mi 11 Pro', 'Mi 11', 'Mi 11 Lite', 'Mi 10 Ultra', 'Mi 10 Pro', 'Mi 10', 'Mi 10T Pro', 'Mi 10T', 'Mi 9T Pro', 'Mi 9T', 'Mi 9 SE', 'Mi 9', 'Mi 8 SE', 'Mi 8', 'Mi Mix 2S'],
        'Redmi Note': ['Redmi Note 13 Pro+', 'Redmi Note 13 Pro', 'Redmi Note 13', 'Redmi Note 12 Pro', 'Redmi Note 12S', 'Redmi Note 12', 'Redmi Note 11 Pro', 'Redmi Note 11S', 'Redmi Note 11', 'Redmi Note 10 Pro', 'Redmi Note 10S', 'Redmi Note 10', 'Redmi Note 9 Pro', 'Redmi Note 9', 'Redmi Note 7 Pro', 'Redmi Note 7'],
        'Redmi': ['Redmi 13', 'Redmi 12', 'Redmi 10', 'Redmi 9A', 'Redmi 9'],
        'Poco': ['Poco F5', 'Poco X5', 'Pocophone F1']
    },
    'Honor': {
        'Honor Magic': ['Honor Magic 6 Ultimate', 'Honor Magic 6 Pro', 'Honor Magic 6', 'Honor Magic 5 Pro', 'Honor Magic 5', 'Honor Magic Vs', 'Honor Magic 3 Pro', 'Honor Magic 3', 'Honor Magic V'],
        'Honor Number': ['Honor 100 Pro', 'Honor 100', 'Honor 90 Pro', 'Honor 90', 'Honor 70 Pro+', 'Honor 70 Pro', 'Honor 70', 'Honor 50 Pro', 'Honor 50 SE', 'Honor 50', 'Honor 30 Pro+', 'Honor 30 Pro', 'Honor 30', 'Honor 30S', 'Honor 20 Pro', 'Honor 20', 'Honor 20i', 'Honor 10'],
        'Honor X': ['Honor X9a', 'Honor X9', 'Honor X8b', 'Honor X8', 'Honor X10', 'Honor X20'],
        'Honor 9': ['Honor 9X Pro', 'Honor 9X', 'Honor 9A', 'Honor Play', 'Honor Note 10', 'Honor View 20']
    },
    'Huawei': {
        'Pura': ['Pura 70 Ultra', 'Pura 70 Pro', 'Pura 70', 'Pura 80'],
        'P': ['P60 Pro', 'P60 Art', 'P60', 'P50 Pro', 'P50 Pocket', 'P50', 'P40 Pro+', 'P40 Pro', 'P40', 'P30 Pro', 'P30', 'P30 Lite', 'P20 Pro', 'P20'],
        'Mate': ['Mate 70 RS', 'Mate 70 Pro', 'Mate 70', 'Mate 60 RS', 'Mate 60 Pro', 'Mate 60', 'Mate 50 RS', 'Mate 50 Pro', 'Mate 50E', 'Mate 50', 'Mate 40 RS', 'Mate 40 Pro', 'Mate 40', 'Mate 30 RS', 'Mate 30 Pro', 'Mate 30', 'Mate 20 X', 'Mate 20 Pro', 'Mate 20', 'Mate Xs 2', 'Mate 80'],
        'Nova': ['Nova 12 Ultra', 'Nova 12 Pro', 'Nova 12', 'Nova 11 Ultra', 'Nova 11 Pro', 'Nova 11', 'Nova 10 Pro', 'Nova 10 SE', 'Nova 10', 'Nova 9 Pro', 'Nova 9', 'Nova 8', 'Nova 7 SE', 'Nova 7 Pro', 'Nova 7', 'Nova 5T', 'Nova 5 Pro', 'Nova 5i', 'Nova 5', 'Nova 3i', 'Nova 3']
    },
    'Realme': {
        'Realme GT': ['Realme GT 6T', 'Realme GT 5 Pro', 'Realme GT 5', 'Realme GT Neo 5', 'Realme GT Neo 3', 'Realme GT 2 Pro', 'Realme GT', 'Realme GT Master'],
        'Realme Number': ['Realme 12 Pro+', 'Realme 12 Pro', 'Realme 12', 'Realme 11 Pro+', 'Realme 11 Pro', 'Realme 11', 'Realme 10 Pro+', 'Realme 10 Pro', 'Realme 10', 'Realme 9 Pro+', 'Realme 9 Pro', 'Realme 9', 'Realme 8 Pro', 'Realme 8', 'Realme 7 Pro', 'Realme 7'],
        'Realme C': ['Realme C67', 'Realme C55', 'Realme C53', 'Realme C35', 'Realme C31', 'Realme C25Y', 'Realme C21Y', 'Realme C15', 'Realme C11']
    },
    'OPPO': {
        'Find': ['Find X7 Ultra', 'Find X7', 'Find X6 Pro', 'Find X6', 'Find X5 Pro', 'Find X5', 'Find X3 Pro', 'Find X3', 'Find X2 Pro', 'Find X2', 'Find X'],
        'Reno': ['Reno 12 Pro', 'Reno 12', 'Reno 11 Pro+', 'Reno 11 Pro', 'Reno 11', 'Reno 10 Pro+', 'Reno 10 Pro', 'Reno 10', 'Reno 9 Pro+', 'Reno 9 Pro', 'Reno 9', 'Reno 8 Pro+', 'Reno 8 Pro', 'Reno 8', 'Reno 7 Pro', 'Reno 7', 'Reno 6 Pro', 'Reno 6', 'Reno 5'],
        'OPPO A': ['A98', 'A78', 'A77', 'A76', 'A57', 'A96', 'A16', 'A54s', 'A15s', 'A12']
    },
    'Vivo': {
        'Vivo X': ['X100 Ultra', 'X100 Pro', 'X100', 'X90 Pro+', 'X90 Pro', 'X90', 'X80 Pro', 'X80', 'X70 Pro+', 'X70 Pro', 'X70', 'X60 Pro+', 'X60 Pro', 'X60'],
        'Vivo V': ['V30 Pro', 'V30', 'V27 Pro', 'V27', 'V25 Pro', 'V25', 'V23 Pro', 'V23', 'V21 Pro', 'V21', 'V20 Pro', 'V20', 'V19'],
        'Vivo Y': ['Y100', 'Y78', 'Y76s', 'Y36', 'Y35', 'Y33s', 'Y27', 'Y22', 'Y21', 'Y12s', 'Y02']
    },
    'OnePlus': {
        'OnePlus': ['OnePlus 12', 'OnePlus 11', 'OnePlus 10 Pro', 'OnePlus 10T', 'OnePlus 9 Pro', 'OnePlus 9', 'OnePlus 8 Pro', 'OnePlus 8T', 'OnePlus 8', 'OnePlus 7T Pro', 'OnePlus 7T', 'OnePlus 7 Pro', 'OnePlus 7', 'OnePlus 6T', 'OnePlus 6'],
        'Nord': ['Nord 3', 'Nord 2T', 'Nord 2', 'Nord CE 3', 'Nord CE 2', 'Nord CE', 'Nord N30', 'Nord N20', 'Nord N10', 'Nord N100']
    },
    'other': ['Другая модель']
};

// ========== STATE ==========
let wizardState = {
    brand: null,
    problem: null,
    phone: '',
    name: '',
    city: ''
};

// ========== DOM ELEMENTS ==========
const header = document.getElementById('header');
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');

// Wizard elements
const wizardSteps = document.querySelectorAll('.wizard-step');
const brandCards = document.querySelectorAll('.brand-card');
const modelCards = document.querySelectorAll('.model-card');
const problemCards = document.querySelectorAll('.problem-card');

// Buttons
const backToStep1 = document.getElementById('backToStep1');
const backToStep2 = document.getElementById('backToStep2');
const backToStep3 = document.getElementById('backToStep3');
const submitToTelegram = document.getElementById('submitToTelegram');
const newRequest = document.getElementById('newRequest');

// Summary elements
const summaryBrand = document.getElementById('summaryBrand');
const summaryModel = document.getElementById('summaryModel');
const summaryProblem = document.getElementById('summaryProblem');

// Text elements
const selectedBrandText = document.getElementById('selectedBrandText');
const selectedModelText = document.getElementById('selectedModelText');

// Form elements
const contactPhone = document.getElementById('contactPhone');
const contactName = document.getElementById('contactName');
const contactCity = document.getElementById('contactCity');

// ========== HEADER SCROLL ==========
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.boxShadow = 'none';
    }
});

// ========== MOBILE MENU ==========
if (burger && nav) {
    burger.addEventListener('click', () => {
        burger.classList.toggle('active');
        nav.classList.toggle('active');
        document.body.style.overflow = burger.classList.contains('active') ? 'hidden' : '';
    });
    
    const navLinks = nav.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            burger.classList.remove('active');
            nav.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

// ========== WIZARD NAVIGATION ==========
function showStep(stepNumber) {
    wizardSteps.forEach(step => {
        step.classList.remove('active');
    });
    
    const targetStep = document.getElementById(`step${stepNumber}`);
    if (targetStep) {
        targetStep.classList.add('active');
        
        // Scroll to top of wizard
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}

// ========== STEP 1: BRAND SELECTION ==========
// Brand cards are now generated dynamically by generateBrandCards()

// ========== STEP 2: MODEL SELECTION ==========
function loadModels(brand) {
    const modelsGrid = document.getElementById('modelsGrid');
    if (!modelsGrid) return;
    
    const brandData = phoneModels[brand];
    if (!brandData) return;
    
    let html = '';
    
    for (const [subcategory, models] of Object.entries(brandData)) {
        html += `<div class="subcategory-title">
            <span class="subcategory-icon">${getSubcategoryIcon(brand, subcategory)}</span>
            ${subcategory}
        </div>`;
        
        html += `<div class="subcategory-grid">`;
        
        models.forEach(model => {
            html += `
                <div class="model-card" data-model="${model}">
                    <div class="model-icon">
                        ${getModelIcon(brand, model)}
                    </div>
                    <h4>${model}</h4>
                </div>
            `;
        });
        
        html += `</div>`;
    }
    
    modelsGrid.innerHTML = html;
    
    // Add event listeners to new cards
    const newModelCards = modelsGrid.querySelectorAll('.model-card');
    newModelCards.forEach(card => {
        card.addEventListener('click', () => {
            // Remove previous selection
            newModelCards.forEach(c => c.classList.remove('selected'));
            
            // Add selection
            card.classList.add('selected');
            
            // Update state
            wizardState.phone = card.dataset.model;
            
            // Update subtitle
            if (selectedModelText) {
                selectedModelText.textContent = card.dataset.model;
            }
            
            // Move to next step
            setTimeout(() => {
                showStep(3);
            }, 300);
        });
    });
}

// ========== STEP 3: PROBLEM SELECTION ==========
function loadProblems(brand) {
    const problemsGrid = document.getElementById('problemsGrid');
    if (!problemsGrid) return;
    
    // All problems are the same for all brands
    const problems = [
        { id: 'screen', icon: '📱', title: 'Экран', desc: 'Разбит, треснул, не работает' },
        { id: 'battery', icon: '🔋', title: 'Батарея', desc: 'Горит быстро, не заряжается' },
        { id: 'charge', icon: '⚡', title: 'Зарядка', desc: 'Не заряжается, грязный разъем' },
        { id: 'camera', icon: '📷', title: 'Камера', desc: 'Не работает, размыто, царапины' },
        { id: 'water', icon: '💧', title: 'Вода', desc: 'Попала вода, не включается' },
        { id: 'not-on', icon: '🔌', title: 'Не включается', desc: 'Не включается, завис' },
        { id: 'body', icon: '🛡️', title: 'Корпус', desc: 'Царапины, сколы, замена' },
        { id: 'other', icon: '🔧', title: 'Другая проблема', desc: 'Опишите вашу проблему' }
    ];
    
    const html = problems.map(problem => `
        <div class="problem-card" data-problem="${problem.id}">
            <div class="problem-icon">${problem.icon}</div>
            <h3>${problem.title}</h3>
            <p>${problem.desc}</p>
        </div>
    `).join('');
    
    problemsGrid.innerHTML = html;
    
    // Add event listeners to new cards
    const newProblemCards = problemsGrid.querySelectorAll('.problem-card');
    newProblemCards.forEach(card => {
        card.addEventListener('click', () => {
            // Remove previous selection
            newProblemCards.forEach(c => c.classList.remove('selected'));
            
            // Add selection
            card.classList.add('selected');
            
            // Update state
            wizardState.problem = card.dataset.problem;
            
            // Update summary
            updateSummary();
            
            // Move to next step
            setTimeout(() => {
                showStep(3);
            }, 300);
        });
    });
}

// Back to step 1
if (backToStep1) {
    backToStep1.addEventListener('click', () => {
        showStep(1);
    });
}

// Back to step 2
if (backToStep2) {
    backToStep2.addEventListener('click', () => {
        showStep(2);
    });
}

// ========== STEP 3: SUMMARY & SUBMIT ==========
function updateSummary() {
    if (summaryBrand) summaryBrand.textContent = wizardState.brand || '';
    if (summaryProblem) summaryProblem.textContent = wizardState.problem || '';
}

// Phone formatting
if (contactPhone) {
    contactPhone.addEventListener('input', (e) => {
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

// Submit to Telegram
if (submitToTelegram) {
    submitToTelegram.addEventListener('click', () => {
        // Validate
        if (!contactPhone.value || !contactCity.value) {
            alert('Пожалуйста, заполните телефон и город');
            return;
        }
        
        // Update state
        wizardState.phone = contactPhone.value;
        wizardState.name = contactName.value;
        wizardState.city = contactCity.value;
        
        // Generate Telegram message
        const message = generateTelegramMessage();
        
        // Open Telegram
        openTelegram(message);
        
        // Show success
        showStep('success');
    });
}

function generateTelegramMessage() {
    const problemTitles = {
        'screen': 'Экран',
        'battery': 'Батарея',
        'charge': 'Зарядка',
        'camera': 'Камера',
        'water': 'Попала вода',
        'not-on': 'Не включается',
        'body': 'Корпус',
        'other': 'Другая проблема'
    };
    
    const problemTitle = problemTitles[wizardState.problem] || wizardState.problem;
    
    return `🛠 Новая заявка на ремонт

📱 Бренд: ${wizardState.brand}
⚠️ Проблема: ${problemTitle}

👤 Имя: ${wizardState.name || 'Не указано'}
📞 Телефон: ${wizardState.phone}
🏙️ Город: ${wizardState.city}

---
Заявка из REMPHONE RUSSIA`;
}

function openTelegram(message) {
    const botUsername = 'REMPHONE_RUSSIA_Bot';
    const encodedMessage = encodeURIComponent(message);
    const telegramUrl = `https://t.me/${botUsername}?text=${encodedMessage}`;
    
    // Open in new tab
    window.open(telegramUrl, '_blank');
}

// ========== SUCCESS ==========
if (newRequest) {
    newRequest.addEventListener('click', () => {
        // Reset state
        wizardState = {
            brand: null,
            problem: null,
            phone: '',
            name: '',
            city: ''
        };
        
        // Reset UI - use dynamic selection
        const allBrandCards = document.querySelectorAll('.brand-card');
        allBrandCards.forEach(c => c.classList.remove('selected'));
        const allProblemCards = document.querySelectorAll('.problem-card');
        allProblemCards.forEach(c => c.classList.remove('selected'));
        
        if (contactPhone) contactPhone.value = '';
        if (contactName) contactName.value = '';
        if (contactCity) contactCity.value = '';
        
        // Go to step 1
        showStep(1);
    });
}

// ========== SMOOTH SCROLL ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        if (href && href !== '#') {
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

// ========== ANIMATIONS ==========
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe cards
document.querySelectorAll('.provider-card, .review-card, .how-step').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(el);
});

// ========== STICKY MOBILE CTA ==========
const stickyCTA = document.querySelector('.sticky-mobile-cta');
const wizardSection = document.getElementById('wizard');

if (stickyCTA && wizardSection) {
    const observerCTA = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                stickyCTA.style.display = 'none';
            } else {
                stickyCTA.style.display = 'flex';
            }
        });
    }, { threshold: 0.1 });
    
    observerCTA.observe(wizardSection);
}

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('loaded');
    
    // Generate brand cards dynamically
    generateBrandCards();
    
    console.log('🚀 REMPHONE RUSSIA v3.0 — Wizard initialized');
    console.log('📱 Interactive phone selection ready');
});

// ========== BRAND CARDS GENERATION ==========
function generateBrandCards() {
    const brandsGrid = document.getElementById('brandsGrid');
    if (!brandsGrid) return;
    
    const brands = [
        { 
            id: 'iPhone', 
            name: 'iPhone', 
            desc: 'Apple', 
            color: '#ffffff', 
            textColor: '#000000',
            logo: 'images/brands/iphone.png'
        },
        { 
            id: 'Samsung', 
            name: 'Samsung', 
            desc: 'Galaxy', 
            color: '#ffffff', 
            textColor: '#1428a0',
            logo: 'images/brands/samsung.png'
        },
        { 
            id: 'Xiaomi', 
            name: 'Xiaomi', 
            desc: 'Redmi, Poco', 
            color: '#ff6900', 
            textColor: '#ffffff',
            logo: 'images/brands/xiaomi.png'
        },
        { 
            id: 'Honor', 
            name: 'Honor', 
            desc: 'Magic', 
            color: '#1a1a1a', 
            textColor: '#ffffff',
            logo: 'images/brands/honor.png'
        },
        { 
            id: 'Huawei', 
            name: 'Huawei', 
            desc: 'P, Mate, Nova', 
            color: '#cf0a2c', 
            textColor: '#ffffff',
            logo: 'images/brands/huawei.png'
        },
        { 
            id: 'Realme', 
            name: 'Realme', 
            desc: 'GT, Narzo', 
            color: '#ffd700', 
            textColor: '#000000',
            logo: 'images/brands/realme.png'
        },
        { 
            id: 'OPPO', 
            name: 'OPPO', 
            desc: 'Find, Reno', 
            color: '#1a73e8', 
            textColor: '#ffffff',
            logo: 'images/brands/oppo.png'
        },
        { 
            id: 'Vivo', 
            name: 'Vivo', 
            desc: 'X, V', 
            color: '#415fff', 
            textColor: '#ffffff',
            logo: 'images/brands/vivo.png'
        },
        { 
            id: 'OnePlus', 
            name: 'OnePlus', 
            desc: 'Nord, Pro', 
            color: '#eb0028', 
            textColor: '#ffffff',
            logo: 'images/brands/oneplus.png'
        },
        { 
            id: 'other', 
            name: 'Другая', 
            desc: 'Другая модель', 
            color: '#6b7280', 
            textColor: '#ffffff',
            logo: 'images/brands/oneplus.png'
        }
    ];
    
    brandsGrid.innerHTML = brands.map(brand => `
        <div class="brand-card" data-brand="${brand.id}">
            <div class="brand-icon">
                <img src="${brand.logo}" alt="${brand.name}" class="brand-logo-img" onerror="this.style.display='none'">
            </div>
            <h3>${brand.name}</h3>
            <p>${brand.desc}</p>
        </div>
    `).join('');
    
    // Add event listeners to brand cards
    const newBrandCards = brandsGrid.querySelectorAll('.brand-card');
    newBrandCards.forEach(card => {
        card.addEventListener('click', () => {
            // Remove previous selection
            newBrandCards.forEach(c => c.classList.remove('selected'));
            
            // Add selection to clicked card
            card.classList.add('selected');
            
            // Update state
            wizardState.brand = card.dataset.brand;
            
            // Load models for this brand
            loadModels(wizardState.brand);
            
            // Update subtitle
            if (selectedBrandText) {
                selectedBrandText.textContent = card.querySelector('h3').textContent;
            }
            
            // Move to next step after short delay
            setTimeout(() => {
                showStep(2);
            }, 300);
        });
    });
}

// ========== ICONS HELPERS ==========
function getSubcategoryIcon(brand, subcategory) {
    // Возвращает PNG логотип бренда для подкатегории
    const brandLower = brand.toLowerCase();
    const logoPath = `images/brands/${brandLower}.png`;
    return `<img src="${logoPath}" alt="${brand}" class="subcategory-brand-logo" onerror="this.style.display='none'">`;
}

function getModelIcon(brand, model) {
    // Возвращает PNG изображение логотипа бренда
    const brandLower = brand.toLowerCase();
    return `<img src="images/brands/${brandLower}.png" alt="${brand}" class="model-brand-logo" onerror="this.style.display='none'">`;
}

// ========== EXPORT FOR TESTING ==========
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        showStep,
        loadModels,
        generateTelegramMessage,
        openTelegram,
        updateSummary,
        wizardState,
        getSubcategoryIcon,
        getModelIcon
    };
}