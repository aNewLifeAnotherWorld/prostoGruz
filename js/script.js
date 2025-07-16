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
            
            // Send to Telegram
            sendToTelegram({
                type: 'Заявка с сайта',
                name: name,
                phone: phone,
                info: info
            });
            
            showSuccessMessage();
            this.reset();
        });
    }

    // Modal functionality
    const modals = {
        business: document.getElementById('businessModal'),
        order: document.getElementById('orderModal'),
        partnership: document.getElementById('partnershipModal')
    };

    const forms = {
        business: document.getElementById('businessForm'),
        order: document.getElementById('orderForm'),
        partnership: document.getElementById('partnershipForm')
    };

    // Open modals based on button clicks
    document.addEventListener('click', function(e) {
        const target = e.target;
        
        // Header "Оформить заявку" button
        if (target.classList.contains('nav-btn') && target.textContent.includes('Оформить заявку')) {
            e.preventDefault();
            openModal('order');
        }
        
        // Hero "Подобрать грузчиков" button
        if (target.textContent.includes('Подобрать грузчиков')) {
            e.preventDefault();
            openModal('order');
        }
        
        // Banner "Заказать со скидкой" button
        if (target.classList.contains('banner-btn') || target.textContent.includes('Заказать со скидкой')) {
            e.preventDefault();
            openModal('order');
        }
        
        // Service cards "Заказать" buttons
        if (target.classList.contains('btn') && target.textContent.includes('Заказать')) {
            e.preventDefault();
            const serviceTitle = target.closest('.service-card').querySelector('h3').textContent;
            openModal('order', serviceTitle);
        }
        
        // Business "Получить коммерческое предложение" button
        if (target.textContent.includes('Получить коммерческое предложение')) {
            e.preventDefault();
            openModal('business');
        }
        
        // Partnership "Стать партнёром" button
        if (target.textContent.includes('Стать партнёром')) {
            e.preventDefault();
            openModal('partnership');
        }
    });

    // Close modal functionality
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal-close')) {
            closeAllModals();
        }
        
        if (e.target.classList.contains('modal')) {
            closeAllModals();
        }
    });

    // Close modal on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });

    // Form submissions for modals
    Object.keys(forms).forEach(formType => {
        const form = forms[formType];
        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const formData = new FormData(this);
                let data = {};
                
                if (formType === 'business') {
                    data = {
                        type: 'Коммерческое предложение',
                        company: formData.get('company') || 'Не указано',
                        name: formData.get('name') || 'Не указано',
                        phone: formData.get('phone'),
                        email: formData.get('email') || 'Не указано',
                        info: formData.get('info') || 'Не указано'
                    };
                } else if (formType === 'partnership') {
                    data = {
                        type: 'Заявка на партнерство',
                        name: formData.get('name') || 'Не указано',
                        phone: formData.get('phone'),
                        email: formData.get('email') || 'Не указано',
                        info: formData.get('info') || 'Не указано'
                    };
                } else {
                    data = {
                        type: 'Заявка с сайта',
                        name: formData.get('name') || 'Не указано',
                        phone: formData.get('phone'),
                        info: formData.get('info') || 'Не указано'
                    };
                }
                
                if (!data.phone || data.phone.trim() === '') {
                    alert('Пожалуйста, укажите номер телефона');
                    return;
                }
                
                // Send to Telegram
                sendToTelegram(data);
                
                showSuccessMessage();
                this.reset();
                closeAllModals();
            });
        }
    });

    function openModal(modalType, serviceTitle = '') {
        const modal = modals[modalType];
        if (modal) {
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
            
            // Pre-fill service info if provided
            if (serviceTitle && modalType === 'order') {
                const infoField = modal.querySelector('textarea[name="info"]');
                if (infoField) {
                    infoField.value = `Интересует услуга: ${serviceTitle}`;
                }
            }
        }
    }

    function closeAllModals() {
        Object.values(modals).forEach(modal => {
            if (modal) {
                modal.classList.remove('show');
            }
        });
        document.body.style.overflow = '';
    }

    // Telegram integration function
    function sendToTelegram(data) {
        // Placeholder for Telegram integration
        // The actual bot token and chat ID will be added later
        const TELEGRAM_BOT_TOKEN = window.TELEGRAM_BOT_TOKEN || 'YOUR_BOT_TOKEN_HERE';
        const TELEGRAM_CHAT_ID = window.TELEGRAM_CHAT_ID || 'YOUR_CHAT_ID_HERE';
        
        if (TELEGRAM_BOT_TOKEN === 'YOUR_BOT_TOKEN_HERE' || TELEGRAM_CHAT_ID === 'YOUR_CHAT_ID_HERE') {
            console.log('Telegram integration not configured. Data would be sent:', data);
            return;
        }
        
        let message = `🔔 ${data.type}\n\n`;
        
        if (data.company) {
            message += `🏢 Компания: ${data.company}\n`;
        }
        message += `👤 Имя: ${data.name}\n`;
        message += `📞 Телефон: ${data.phone}\n`;
        if (data.email) {
            message += `📧 Email: ${data.email}\n`;
        }
        message += `💬 Комментарий: ${data.info}\n`;
        message += `⏰ Время: ${new Date().toLocaleString('ru-RU')}`;
        
        const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
        
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: message,
                parse_mode: 'HTML'
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.ok) {
                console.log('Message sent to Telegram successfully');
            } else {
                console.error('Error sending message to Telegram:', data);
            }
        })
        .catch(error => {
            console.error('Error:', error);
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

