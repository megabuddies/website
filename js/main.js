document.addEventListener('DOMContentLoaded', function() {
    // Добавляем сканирующую линию для эффекта старого монитора
    const scanLine = document.createElement('div');
    scanLine.classList.add('scan-line');
    document.body.appendChild(scanLine);
    
    // Инициализация хедера
    const header = document.querySelector('.main-header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }
    });
    
    // Мобильное меню
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    
    mobileMenuToggle.addEventListener('click', () => {
        mobileMenuToggle.classList.toggle('active');
        mainNav.classList.toggle('active');
    });
    
    // Плавная прокрутка к разделам при нажатии на ссылки навигации
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            window.scrollTo({
                top: targetSection.offsetTop - 100,
                behavior: 'smooth'
            });
            
            // Закрываем мобильное меню при клике на ссылку
            if (mainNav.classList.contains('active')) {
                mobileMenuToggle.classList.remove('active');
                mainNav.classList.remove('active');
            }
        });
    });
    
    // Эффект печатающегося текста для терминала
    function typeWriter(element, text, speed = 50) {
        let i = 0;
        element.innerHTML = '';
        
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        
        type();
    }
    
    // Применяем эффект печатающегося текста к элементам с классом terminal-text
    document.querySelectorAll('.terminal-text').forEach(element => {
        const originalText = element.textContent;
        element.textContent = '';
        
        // Создаем наблюдатель для запуска анимации при появлении элемента в видимой области
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    typeWriter(element, originalText);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(element);
    });
    
    // Добавление случайных глюков к тексту
    function addRandomGlitches() {
        document.querySelectorAll('.glitch-text').forEach(element => {
                        if (Math.random() > 0.95) {
                element.classList.add('active-glitch');
                setTimeout(() => {
                    element.classList.remove('active-glitch');
                }, 200);
            }
        });
        
        requestAnimationFrame(addRandomGlitches);
    }
    
    addRandomGlitches();
    
    // Фильтрация NFT карточек
    const filterButtons = document.querySelectorAll('.filter-btn');
    const nftCards = document.querySelectorAll('.nft-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Удаляем активный класс со всех кнопок
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Добавляем активный класс на нажатую кнопку
            button.classList.add('active');
            
            const filter = button.getAttribute('data-filter');
            
            nftCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-rarity') === filter) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
    
    // Форма подписки на рассылку
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const email = newsletterForm.querySelector('input[type="email"]').value;
            
            if (email) {
                // Здесь будет код для отправки email на сервер
                alert('Спасибо за подписку! Мы будем держать вас в курсе последних новостей о революции Mega Buddies.');
                newsletterForm.reset();
            }
        });
    }
    
    // Добавляем "хакерский" эффект для кнопки подключения кошелька
    const walletBtn = document.querySelector('.wallet-btn');
    
    walletBtn.addEventListener('click', function() {
        this.textContent = "Подключение...";
        this.classList.add('connecting');
        
        setTimeout(() => {
            this.textContent = "Взлом системы...";
        }, 1000);
        
        setTimeout(() => {
            this.textContent = "Доступ получен";
            this.classList.remove('connecting');
            this.classList.add('connected');
        }, 2000);
    });

    // Добавляем эффект пиксельной анимации для логотипа
    const logo = document.querySelector('.logo img');
    if (logo) {
        logo.addEventListener('mouseover', () => {
            logo.style.imageRendering = 'pixelated';
            logo.style.transform = 'scale(1.1)';
        });
        logo.addEventListener('mouseout', () => {
            logo.style.imageRendering = 'auto';
            logo.style.transform = 'scale(1)';
        });
    }

    // Добавляем эффект "глитча" для заголовков секций
    const sectionHeadings = document.querySelectorAll('.section-heading');
    sectionHeadings.forEach(heading => {
        heading.addEventListener('mouseover', () => {
            heading.classList.add('glitch-effect');
        });
        heading.addEventListener('mouseout', () => {
            heading.classList.remove('glitch-effect');
        });
    });

    // Анимация появления элементов при скролле
    const animatedElements = document.querySelectorAll('.about-item, .nft-card, .roadmap-item');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, { threshold: 0.1 });

    animatedElements.forEach(element => {
        observer.observe(element);
    });

    // Анимация счетчиков
    const counters = document.querySelectorAll('.counter');
    
    function animateCounters() {
        counters.forEach(counter => {
            const target = parseInt(counter.textContent.replace(/,/g, ''));
            let current = 0;
            const increment = Math.ceil(target / 100);
            const duration = 2000; // 2 секунды
            const step = Math.ceil(duration / (target / increment));
            
            const timer = setInterval(() => {
                current += increment;
                if (current > target) {
                    current = target;
                    clearInterval(timer);
                }
                counter.textContent = current.toLocaleString();
            }, step);
        });
    }
    
    // Добавляем glitch-эффект при наведении
    const glitchElement = document.querySelector('.glitch-effect');
    if (glitchElement) {
        glitchElement.addEventListener('mouseenter', function() {
            this.classList.add('active-glitch');
        });
        
        glitchElement.addEventListener('mouseleave', function() {
            this.classList.remove('active-glitch');
        });
    }
    
    // Анимация при скролле
    function checkScroll() {
        const scrollPosition = window.scrollY;
        const heroHeight = document.querySelector('.hero').offsetHeight;
        const header = document.querySelector('.main-header');
        
        if (scrollPosition > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Запускаем анимацию счетчиков, когда пользователь доскроллил до них
        if (scrollPosition > heroHeight * 0.5) {
            animateCounters();
            // Удаляем обработчик, чтобы анимация запустилась только один раз
            window.removeEventListener('scroll', checkScroll);
        }
    }
    
    window.addEventListener('scroll', checkScroll);
    
    // Запускаем анимацию сразу, если пользователь уже проскроллил страницу
    if (window.scrollY > document.querySelector('.hero').offsetHeight * 0.5) {
        animateCounters();
    }
    
    // Добавляем эффект параллакса для 3D модели
    document.addEventListener('mousemove', function(e) {
        const pixelRabbitElement = document.getElementById('hero-animation');
        if (!pixelRabbitElement) return;
        
        const xAxis = (window.innerWidth / 2 - e.pageX) / 50;
        const yAxis = (window.innerHeight / 2 - e.pageY) / 50;
        
        // Сообщаем позицию мыши для анимации 3D модели через глобальные переменные
        if (typeof window.mouseX !== 'undefined' && typeof window.mouseY !== 'undefined') {
            window.mouseX = e.clientX - window.innerWidth / 2;
            window.mouseY = e.clientY - window.innerHeight / 2;
        }
    });
    
    // Добавляем плавный скролл для навигации
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (!target) return;
            
            window.scrollTo({
                top: target.offsetTop - 100,
                behavior: 'smooth'
            });
        });
    });
    
    // Инициализация Three.js анимации, если функция существует
    if (typeof initThree === 'function') {
        initThree();
    }
});

