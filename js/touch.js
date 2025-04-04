/**
 * touch.js - Улучшенная обработка сенсорных взаимодействий
 * 
 * Этот файл добавляет улучшенную поддержку сенсорных устройств
 * с сохранением того же визуального стиля, что и на десктопе
 */

document.addEventListener('DOMContentLoaded', function() {
    // Определение, является ли устройство сенсорным
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
    
    if (isTouchDevice) {
        // Добавляем класс touch-device для специальных стилей
        document.documentElement.classList.add('touch-device');
        
        // Список всех интерактивных элементов
        const touchElements = document.querySelectorAll('.nft-card, .about-item, .roadmap-item, .twitter-feed, .discord-community, .nav-link, .social-link, .filter-btn');
        
        touchElements.forEach(element => {
            // Добавление активного класса при касании
            element.addEventListener('touchstart', function(e) {
                // Удаляем активные классы со всех элементов того же типа
                const elementType = this.classList[0]; // первый класс как тип элемента
                document.querySelectorAll('.' + elementType).forEach(el => {
                    el.classList.remove('touch-active');
                });
                
                // Добавляем активный класс текущему элементу
                this.classList.add('touch-active');
            });
            
            // Особая обработка для элементов дорожной карты
            if (element.classList.contains('roadmap-item')) {
                element.addEventListener('touchstart', function(e) {
                    // Если касание не на ссылке внутри элемента, то предотвращаем дефолтное поведение
                    if (!e.target.closest('a')) {
                        e.preventDefault();
                    }
                    
                    // Удаляем активное состояние у всех плиток
                    document.querySelectorAll('.roadmap-item').forEach(i => i.classList.remove('touch-active'));
                    // Добавляем активное состояние для текущей плитки
                    this.classList.add('touch-active');
                }, { passive: false });
                
                // Удаляем активный класс после небольшой задержки
                element.addEventListener('touchend', function() {
                    const item = this;
                    setTimeout(() => {
                        item.classList.remove('touch-active');
                    }, 500);
                });
            }
        });
        
        // Обработка полей ввода
        const inputElements = document.querySelectorAll('input, textarea, select');
        
        inputElements.forEach(input => {
            input.addEventListener('focus', function() {
                this.classList.add('input-focused');
            });
            
            input.addEventListener('blur', function() {
                this.classList.remove('input-focused');
            });
        });
        
        // Предотвращение двойного нажатия для увеличения экрана
        document.querySelectorAll('a, button, .btn-primary, .btn-secondary, .nav-link').forEach(element => {
            element.addEventListener('touchend', function(e) {
                if (!e.target.closest('a[href], button[type="submit"]')) {
                    e.preventDefault();
                }
            });
        });
        
        // Улучшение скролла для сенсорных устройств
        const scrollableElements = document.querySelectorAll('.nft-grid, .terminal-content');
        
        scrollableElements.forEach(element => {
            let isScrolling = false;
            let startX, startY;
            
            element.addEventListener('touchstart', function(e) {
                isScrolling = true;
                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY;
            }, { passive: true });
            
            element.addEventListener('touchmove', function(e) {
                if (!isScrolling) return;
                
                const touchX = e.touches[0].clientX;
                const touchY = e.touches[0].clientY;
                
                const deltaX = startX - touchX;
                const deltaY = startY - touchY;
                
                // Если движение более горизонтальное, чем вертикальное
                if (Math.abs(deltaX) > Math.abs(deltaY) && this.classList.contains('nft-grid')) {
                    // Плавный скролл для горизонтальных коллекций
                    this.scrollLeft += deltaX;
                    startX = touchX;
                    startY = touchY;
                }
            }, { passive: true });
            
            element.addEventListener('touchend', function() {
                isScrolling = false;
            }, { passive: true });
        });
    }
    
    // Улучшенная прокрутка для сенсорных устройств
    if (isTouchDevice) {
        // Плавная прокрутка при касании навигационных ссылок
        const touchLinks = document.querySelectorAll('a[href^="#"]');
        
        touchLinks.forEach(link => {
            link.addEventListener('touchend', function(e) {
                // Проверяем, что это ссылка-якорь
                const href = this.getAttribute('href');
                if (href.charAt(0) === '#' && href.length > 1) {
                    const targetId = href.substring(1);
                    const targetElement = document.getElementById(targetId);
                    
                    if (targetElement) {
                        e.preventDefault();
                        
                        // Учитываем высоту хедера при прокрутке
                        const headerHeight = document.querySelector('.main-header').offsetHeight;
                        
                        // Плавная прокрутка к элементу
                        window.scrollTo({
                            top: targetElement.offsetTop - headerHeight,
                            behavior: 'smooth'
                        });
                        
                        // Закрываем мобильное меню если оно открыто
                        const navList = document.querySelector('.nav-list');
                        const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
                        
                        if (navList && navList.classList.contains('active')) {
                            navList.classList.remove('active');
                            mobileMenuToggle.classList.remove('active');
                            document.body.style.overflow = 'auto';
                        }
                    }
                }
            });
        });
    }
    
    // Обработка кнопки прокрутки наверх
    const scrollTopBtn = document.getElementById('scroll-top');
    if (scrollTopBtn) {
        // Показываем кнопку только когда прокрутили вниз
        window.addEventListener('scroll', function() {
            if (window.scrollY > window.innerHeight / 2) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        });
        
        // Действие кнопки прокрутки наверх
        scrollTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}); 