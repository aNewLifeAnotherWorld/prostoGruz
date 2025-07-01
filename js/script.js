// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
});

// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Header hide/show on scroll
let lastScrollTop = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', function() {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > lastScrollTop && scrollTop > 100) {
        // Scrolling down
        header.classList.add('hidden');
    } else {
        // Scrolling up
        header.classList.remove('hidden');
    }
    
    lastScrollTop = scrollTop;
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all sections
document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        observer.observe(section);
    });
    
    // Observe slide-in images
    const slideImages = document.querySelectorAll('.slide-in-image');
    slideImages.forEach(img => {
        observer.observe(img);
    });
});

// Form submission
document.addEventListener('DOMContentLoaded', function() {
    const orderForm = document.querySelector('.order-form');
    
    if (orderForm) {
        orderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const name = formData.get('name') || 'Не указано';
            const phone = formData.get('phone');
            const info = formData.get('info') || 'Не указано';
            
            // Basic validation
            if (!phone || phone.trim() === '') {
                alert('Пожалуйста, укажите номер телефона');
                return;
            }
            
            // Show success message
            showSuccessMessage();
            
            // Reset form
            this.reset();
            
            // Here you would typically send the data to your server
            console.log('Form submitted:', { name, phone, info });
        });
    }
});

// Success message functionality
function showSuccessMessage() {
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    
    // Create success message
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.innerHTML = `
        <h3>Заявка отправлена!</h3>
        <p>Сообщение успешно отправлено, ожидайте звонка в течение 10 минут</p>
        <button class="close-btn" onclick="closeSuccessMessage()">Понятно</button>
    `;
    
    // Add to page
    document.body.appendChild(overlay);
    document.body.appendChild(successMessage);
    
    // Show with animation
    setTimeout(() => {
        overlay.classList.add('show');
        successMessage.classList.add('show');
    }, 10);
    
    // Auto close after 5 seconds
    setTimeout(() => {
        closeSuccessMessage();
    }, 5000);
}

function closeSuccessMessage() {
    const overlay = document.querySelector('.overlay');
    const successMessage = document.querySelector('.success-message');
    
    if (overlay) {
        overlay.classList.remove('show');
        setTimeout(() => overlay.remove(), 300);
    }
    
    if (successMessage) {
        successMessage.classList.remove('show');
        setTimeout(() => successMessage.remove(), 300);
    }
}

// Call buttons functionality
document.addEventListener('DOMContentLoaded', function() {
    const callButtons = document.querySelectorAll('.call-btn, .cta-btn, .banner-btn');
    
    callButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Scroll to form
            const heroForm = document.querySelector('.hero-form-container');
            if (heroForm) {
                heroForm.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
                
                // Focus on phone input
                setTimeout(() => {
                    const phoneInput = document.querySelector('#phone');
                    if (phoneInput) {
                        phoneInput.focus();
                    }
                }, 500);
            }
        });
    });
});

// Service cards functionality
document.addEventListener('DOMContentLoaded', function() {
    const serviceButtons = document.querySelectorAll('.service-card .btn');
    
    serviceButtons.forEach(button => {
        button.addEventListener('click', function() {
            const serviceTitle = this.closest('.service-card').querySelector('h3').textContent;
            
            // Scroll to form
            const heroForm = document.querySelector('.hero-form-container');
            if (heroForm) {
                heroForm.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
                
                // Pre-fill additional info
                setTimeout(() => {
                    const infoTextarea = document.querySelector('#info');
                    if (infoTextarea) {
                        infoTextarea.value = `Интересует услуга: ${serviceTitle}`;
                        infoTextarea.focus();
                    }
                }, 500);
            }
        });
    });
});

// Phone number formatting
document.addEventListener('DOMContentLoaded', function() {
    const phoneInput = document.querySelector('#phone');
    
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length > 0) {
                if (value[0] === '8') {
                    value = '7' + value.slice(1);
                }
                
                if (value.length <= 11) {
                    let formatted = '+7';
                    if (value.length > 1) {
                        formatted += ' (' + value.slice(1, 4);
                    }
                    if (value.length > 4) {
                        formatted += ') ' + value.slice(4, 7);
                    }
                    if (value.length > 7) {
                        formatted += '-' + value.slice(7, 9);
                    }
                    if (value.length > 9) {
                        formatted += '-' + value.slice(9, 11);
                    }
                    
                    e.target.value = formatted;
                }
            }
        });
        
        phoneInput.addEventListener('keydown', function(e) {
            // Allow backspace, delete, tab, escape, enter
            if ([8, 9, 27, 13, 46].indexOf(e.keyCode) !== -1 ||
                // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
                (e.keyCode === 65 && e.ctrlKey === true) ||
                (e.keyCode === 67 && e.ctrlKey === true) ||
                (e.keyCode === 86 && e.ctrlKey === true) ||
                (e.keyCode === 88 && e.ctrlKey === true)) {
                return;
            }
            // Ensure that it is a number and stop the keypress
            if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                e.preventDefault();
            }
        });
    }
});

// Lazy loading for images
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
});

// Scroll to top functionality
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Add scroll to top button
document.addEventListener('DOMContentLoaded', function() {
    const scrollButton = document.createElement('button');
    scrollButton.innerHTML = '↑';
    scrollButton.className = 'scroll-to-top';
    scrollButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: var(--primary-color);
        color: white;
        border: none;
        font-size: 20px;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
    `;
    
    scrollButton.addEventListener('click', scrollToTop);
    document.body.appendChild(scrollButton);
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollButton.style.opacity = '1';
            scrollButton.style.visibility = 'visible';
        } else {
            scrollButton.style.opacity = '0';
            scrollButton.style.visibility = 'hidden';
        }
    });
});

