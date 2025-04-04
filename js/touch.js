/**
 * touch.js - Улучшенная обработка сенсорных взаимодействий
 * 
 * Этот файл добавляет улучшенную поддержку сенсорных устройств
 * с сохранением того же визуального стиля, что и на десктопе
 */

document.addEventListener('DOMContentLoaded', function() {
    // Определяем, поддерживает ли устройство сенсорные события
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0);
    
    // Добавляем класс к body для специфических стилей
    if (isTouchDevice) {
        document.body.classList.add('touch-device');
    } else {
        document.body.classList.add('no-touch');
    }
    
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
        // Обработка полей ввода
        const inputFields = document.querySelectorAll('input, textarea');
        
        inputFields.forEach(field => {
            // Улучшенный фокус на мобильных устройствах
            field.addEventListener('focus', function() {
                this.classList.add('input-focused');
            });
            
            field.addEventListener('blur', function() {
                this.classList.remove('input-focused');
            });
        });
        
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