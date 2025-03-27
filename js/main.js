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
    function typeWriter(element, text, speed = 30) {
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
    
    // Оптимизированная загрузка эффекта печатающегося текста
    const observerOptions = { 
        threshold: 0.2,    // Снижаем порог видимости для более раннего начала анимации
        rootMargin: '0px 0px 100px 0px'  // Увеличиваем область активации, чтобы анимация начиналась раньше
    };

    // Предварительная загрузка контента манифеста
    const terminalTexts = document.querySelectorAll('.terminal-text');
    terminalTexts.forEach(element => {
        // Сохраняем оригинальный текст в data-атрибуте для последующего использования
        element.setAttribute('data-original-text', element.textContent);
        element.textContent = '';
    });

    // Создаем наблюдатель для запуска анимации с оптимизированными параметрами
    const terminalObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const originalText = element.getAttribute('data-original-text');
                typeWriter(element, originalText);
                terminalObserver.unobserve(element);
            }
        });
    }, observerOptions);

    // Наблюдаем за каждым терминальным текстом
    terminalTexts.forEach(element => {
        terminalObserver.observe(element);
    });
    
    // Наблюдаем за секцией манифеста для предварительной загрузки
    const manifestoSection = document.getElementById('manifesto');
    if (manifestoSection) {
        const preloadObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                // Секция скоро станет видимой, активируем предзагрузку
                terminalTexts.forEach(element => {
                    // Заблаговременно начинаем наблюдение
                    terminalObserver.observe(element);
                });
                preloadObserver.disconnect();
            }
        }, { 
            rootMargin: '200px 0px 0px 0px'  // Начинаем загрузку когда до секции 200px
        });
        
        preloadObserver.observe(manifestoSection);
    }
    
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
});

