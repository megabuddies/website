document.addEventListener('DOMContentLoaded', function() {
    // Определение типа устройства
    const isMobile = window.innerWidth <= 768;
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    // Добавляем классы к body в зависимости от типа устройства
    document.body.classList.add(isMobile ? 'mobile-device' : 'desktop-device');
    document.body.classList.add(isTouchDevice ? 'touch-device' : 'no-touch');
    
    // Получаем элемент прелоадера
    const preloader = document.getElementById('preloader');
    const progress = document.querySelector('.progress');
    const loadingText = document.querySelector('.loading-text');
    const terminalText = document.querySelector('.terminal-text');
    const dots = document.querySelector('.dots');
    
    // Анимация загрузки
    let loadingProgress = 0;
    let dotsCount = 0;
    
    // Анимируем точки в тексте загрузки
    const animateDots = setInterval(() => {
        dotsCount = (dotsCount + 1) % 4;
        dots.textContent = '.'.repeat(dotsCount);
    }, 500);
    
    // Симулируем загрузку
    const progressInterval = setInterval(() => {
        if (loadingProgress >= 100) {
            loadingText.textContent = 'ГОТОВО';
            terminalText.innerHTML = '<span class="terminal-prompt">&gt;</span> Система инициализирована успешно!';
            clearInterval(progressInterval);
            clearInterval(animateDots);
            
            // Скрываем прелоадер
            setTimeout(() => {
                preloader.classList.remove('active');
                preloader.classList.add('hidden');
                
                // Запускаем анимации для стартовой страницы
                initPageAnimations();
            }, 1000);
            
            return;
        }
        
        loadingProgress += Math.floor(Math.random() * 5) + 1;
        if (loadingProgress > 100) loadingProgress = 100;
        
        progress.style.width = `${loadingProgress}%`;
        
        // Обновляем текст в зависимости от прогресса
        if (loadingProgress > 25 && loadingProgress < 50) {
            terminalText.innerHTML = '<span class="terminal-prompt">&gt;</span> Загрузка ресурсов...';
        } else if (loadingProgress >= 50 && loadingProgress < 75) {
            terminalText.innerHTML = '<span class="terminal-prompt">&gt;</span> Инициализация библиотек...';
        } else if (loadingProgress >= 75 && loadingProgress < 95) {
            terminalText.innerHTML = '<span class="terminal-prompt">&gt;</span> Почти готово...';
        }
    }, 150);
    
    // Мобильное меню
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu-link');
    
    // Функция для открытия/закрытия мобильного меню
    function toggleMobileMenu() {
        mobileMenuToggle.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    }
    
    // Обработчик нажатия на иконку меню
    mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    
    // Обработчик нажатия на ссылки в мобильном меню
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Закрываем меню
            toggleMobileMenu();
            
            // Прокручиваем до нужной секции
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.main-header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                // Плавно прокручиваем
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Функция для инициализации анимаций страницы
    function initPageAnimations() {
        // Анимация заголовка с задержкой
        const heroTitle = document.querySelector('.hero-title-container');
        const heroSubtitle = document.querySelector('.hero-subtitle-container');
        const heroDesc = document.querySelector('.hero-description');
        const heroButtons = document.querySelector('.hero-buttons');
        
        if (heroTitle) {
            setTimeout(() => {
                heroTitle.style.opacity = '1';
                heroTitle.style.transform = 'translateY(0)';
            }, 300);
        }
        
        if (heroSubtitle) {
            setTimeout(() => {
                heroSubtitle.style.opacity = '1';
                heroSubtitle.style.transform = 'translateY(0)';
            }, 500);
        }
        
        if (heroDesc) {
            setTimeout(() => {
                heroDesc.style.opacity = '1';
                heroDesc.style.transform = 'translateY(0)';
            }, 700);
        }
        
        if (heroButtons) {
            setTimeout(() => {
                heroButtons.style.opacity = '1';
                heroButtons.style.transform = 'translateY(0)';
            }, 900);
        }
    }
    
    // Обработка скролла для header
    if (isMobile) {
        const header = document.querySelector('.main-header');
        let lastScrollTop = 0;
        let scrollTimer;
        
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimer);
            
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Добавляем класс при скролле вниз
            if (scrollTop > 10) {
                header.classList.add('scrolled');
                
                // Скрываем хедер при скролле вниз
                if (scrollTop > lastScrollTop && scrollTop > 100) {
                    header.style.transform = 'translateY(-100%)';
                } else {
                    header.style.transform = 'translateY(0)';
                }
            } else {
                header.classList.remove('scrolled');
            }
            
            lastScrollTop = scrollTop;
            
            // Сбрасываем таймер для показа хедера после окончания скролла
            scrollTimer = setTimeout(() => {
                header.style.transform = 'translateY(0)';
            }, 500);
        });
    }
    
    // Добавление активного класса для секций при скролле
    const sections = document.querySelectorAll('section[id]');
    
    function highlightActiveSection() {
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                // Добавляем активный класс для ссылок меню
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
                
                // Добавляем активный класс для мобильных ссылок
                document.querySelectorAll('.mobile-menu-link').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', highlightActiveSection);
    
    // Инициализируем на старте
    highlightActiveSection();
    
    // Плавная прокрутка для всех внутренних ссылок
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            
            // Пропускаем, если это # или обработка уже произведена в мобильном меню
            if (href === '#' || (this.classList.contains('mobile-menu-link') && isMobile)) {
                return;
            }
            
            e.preventDefault();
            
            const targetElement = document.querySelector(href);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.main-header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});

