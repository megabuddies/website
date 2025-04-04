/**
 * touch.js - Улучшенная обработка сенсорных взаимодействий
 * 
 * Этот файл добавляет улучшенную поддержку сенсорных устройств
 * с сохранением того же визуального стиля, что и на десктопе
 */

document.addEventListener('DOMContentLoaded', function() {
    // Определяем, является ли устройство сенсорным
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0);
    
    if (isTouchDevice) {
        // Добавляем класс touch-device для специальных стилей
        document.documentElement.classList.add('touch-device');
        
        // Обработка всех сенсорных элементов
        const touchElements = document.querySelectorAll('.nav-link, .nft-card, .about-item, .roadmap-item, .twitter-feed, .discord-community, .social-link, .filter-btn');
        
        touchElements.forEach(element => {
            // Добавляем слушатели сенсорных событий
            element.addEventListener('touchstart', handleTouchStart, { passive: true });
            element.addEventListener('touchend', handleTouchEnd, { passive: true });
            element.addEventListener('touchcancel', handleTouchEnd, { passive: true });
        });
        
        // Обработка полей ввода
        const inputElements = document.querySelectorAll('input, textarea, select');
        
        inputElements.forEach(element => {
            element.addEventListener('focus', function() {
                this.classList.add('input-focused');
            });
            
            element.addEventListener('blur', function() {
                this.classList.remove('input-focused');
            });
        });
        
        // Отдельная обработка плиток roadmap для синего выделения
        const roadmapItems = document.querySelectorAll('.roadmap-item');
        roadmapItems.forEach(item => {
            item.addEventListener('touchstart', function(e) {
                // Удаляем активное состояние у всех плиток
                roadmapItems.forEach(i => i.classList.remove('touch-active'));
                // Добавляем активное состояние для текущей плитки
                this.classList.add('touch-active');
                // Предотвращаем выделение текста
                e.preventDefault();
            }, { passive: false });
        });
    }
    
    // Обработчик начала касания
    function handleTouchStart(e) {
        // Предотвращаем конфликты с другими обработчиками
        e.stopPropagation();
        
        if (!this.classList.contains('roadmap-item')) {
            this.classList.add('touch-active');
        }
    }
    
    // Обработчик окончания касания
    function handleTouchEnd(e) {
        // Предотвращаем конфликты с другими обработчиками
        e.stopPropagation();
        
        if (!this.classList.contains('roadmap-item')) {
            // Небольшая задержка чтобы был заметен эффект нажатия
            setTimeout(() => {
                this.classList.remove('touch-active');
            }, 150);
        }
    }
    
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
    
    // Обработка элементов с эффектами при наведении для сенсорных устройств
    if (isTouchDevice) {
        // Находим все элементы, которые имеют hover-эффекты
        const hoverElements = document.querySelectorAll('.nft-card, .about-item, .roadmap-item, .twitter-feed, .discord-community, .nav-link, .social-link');
        
        // Добавляем обработчики для сенсорного нажатия
        hoverElements.forEach(element => {
            element.addEventListener('touchstart', function(e) {
                // Если элемент уже активен, не делаем ничего (позволяем перейти по ссылке)
                if (this.classList.contains('touch-active')) {
                    return;
                }
                
                // Удаляем активный класс у всех элементов того же типа
                const sameElements = document.querySelectorAll('.' + this.className.split(' ')[0]);
                sameElements.forEach(el => {
                    el.classList.remove('touch-active');
                });
                
                // Добавляем активный класс к текущему элементу
                this.classList.add('touch-active');
                
                // Предотвращаем стандартное поведение для первого касания
                // чтобы сначала показать эффект hover
                e.preventDefault();
            });
        });
        
        // Снимаем активное состояние при касании в другом месте
        document.addEventListener('touchstart', function(e) {
            const activeElements = document.querySelectorAll('.touch-active');
            if (activeElements.length > 0) {
                let shouldRemove = true;
                
                activeElements.forEach(active => {
                    if (active.contains(e.target)) {
                        shouldRemove = false;
                    }
                });
                
                if (shouldRemove) {
                    activeElements.forEach(el => {
                        el.classList.remove('touch-active');
                    });
                }
            }
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
                        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                        
                        // Плавная прокрутка
                        window.scrollTo({
                            top: targetPosition,
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
    
    // Оптимизация форм для мобильных устройств
    if (isTouchDevice) {
        // Предотвращаем зум на полях ввода в некоторых браузерах
        // добавляя правильный размер шрифта
        const mobileInputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], textarea');
        mobileInputs.forEach(input => {
            input.style.fontSize = '16px';
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