// Main initialization
document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    const socialLinks = document.querySelectorAll('.mobile-social-links .social-link');
    const body = document.body;

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', function() {
            menuToggle.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Close mobile menu when clicking on nav links
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', function() {
                menuToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
                body.style.overflow = '';
            });
        });

        // Close mobile menu when clicking on social links
        socialLinks.forEach(link => {
            link.addEventListener('click', function() {
                menuToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
                body.style.overflow = '';
            });
        });

        // Close mobile menu when clicking outside
        mobileMenu.addEventListener('click', function(e) {
            if (e.target === mobileMenu) {
                menuToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
                body.style.overflow = '';
            }
        });

        // Prevent body scroll when mobile menu is open
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                menuToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
                body.style.overflow = '';
            }
        });

        // Swipe to close mobile menu
        let touchStartY = 0;
        let touchEndY = 0;

        mobileMenu.addEventListener('touchstart', function(e) {
            touchStartY = e.changedTouches[0].screenY;
        });

        mobileMenu.addEventListener('touchend', function(e) {
            touchEndY = e.changedTouches[0].screenY;
            if (touchStartY - touchEndY < -100) { // Swipe up
                menuToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
                body.style.overflow = '';
            }
        });
    }

    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.2, // 20% of element visible
        rootMargin: '0px' // No margin for reliable triggering
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Stop observing once visible
            }
        });
    }, observerOptions);

    // Observe all sections
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        observer.observe(section);
    });

    // Observe slide-in images
    const slideImages = document.querySelectorAll('.slide-in-image');
    slideImages.forEach(img => {
        observer.observe(img);
    });

    // Form submission
    const orderForm = document.querySelector('.order-form');
    if (orderForm) {
        orderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const name = formData.get('name') || 'Не указано';
            const phone = formData.get('phone');
            const info = formData.get('info') || 'Не указано';
            
            if (!phone || phone.trim() === '') {
                alert('Пожалуйста, укажите номер телефона');
                return;
            }
            
            showSuccessMessage();
            this.reset();
            console.log('Form submitted:', { name, phone, info });
        });
    }

    // Success message handling
    function showSuccessMessage() {
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.innerHTML = `
            <h3>Заявка отправлена!</h3>
            <p>Мы свяжемся с вами в ближайшее время.</p>
            <button class="close-btn">Закрыть</button>
        `;
        document.body.appendChild(successMessage);

        const overlay = document.createElement('div');
        overlay.className = 'overlay';
        document.body.appendChild(overlay);

        successMessage.classList.add('show');
        overlay.classList.add('show');

        const closeButton = successMessage.querySelector('.close-btn');
        closeButton.addEventListener('click', function() {
            successMessage.classList.remove('show');
            overlay.classList.remove('show');
            setTimeout(() => {
                successMessage.remove();
                overlay.remove();
            }, 300);
        });
    }

    // Call buttons functionality
    const callButtons = document.querySelectorAll('.call-btn, .cta-btn, .banner-btn');
    callButtons.forEach(button => {
        button.addEventListener('click', function() {
            const heroForm = document.querySelector('.hero-form-container');
            if (heroForm) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = heroForm.offsetTop - headerHeight - 20;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                setTimeout(() => {
                    const phoneInput = document.querySelector('#phone');
                    if (phoneInput) {
                        phoneInput.focus();
                    }
                }, 500);
            }
        });
    });

    // Service cards functionality
    const serviceButtons = document.querySelectorAll('.service-card .btn');
    serviceButtons.forEach(button => {
        button.addEventListener('click', function() {
            const serviceTitle = this.closest('.service-card').querySelector('h3').textContent;
            const heroForm = document.querySelector('.hero-form-container');
            if (heroForm) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = heroForm.offsetTop - headerHeight - 20;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
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

    // Phone number formatting
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', function(e) {
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
                } else {
                    e.target.value = e.target.value.slice(0, 16);
                }
            }
        });

        input.addEventListener('keydown', function(e) {
            // Allow: backspace, delete, tab, escape, enter, Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
            if (
                [8, 9, 27, 13, 46].indexOf(e.keyCode) !== -1 ||
                (e.keyCode === 65 && e.ctrlKey === true) ||
                (e.keyCode === 67 && e.ctrlKey === true) ||
                (e.keyCode === 86 && e.ctrlKey === true) ||
                (e.keyCode === 88 && e.ctrlKey === true)
            ) {
                return;
            }
            // Allow only numbers
            if (e.keyCode < 48 || e.keyCode > 57) {
                e.preventDefault();
            }
        });
    });
});