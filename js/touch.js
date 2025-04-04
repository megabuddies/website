/**
 * touch.js - Улучшенная обработка сенсорных взаимодействий
 * 
 * Этот файл добавляет улучшенную поддержку сенсорных устройств
 * с сохранением того же визуального стиля, что и на десктопе
 */

document.addEventListener('DOMContentLoaded', function() {
    // Определяем, является ли устройство сенсорным
    const isTouchDevice = ('ontouchstart' in window) || 
                          (navigator.maxTouchPoints > 0) || 
                          (navigator.msMaxTouchPoints > 0);
    
    // Добавляем класс к body для возможности настройки стилей под тач-устройства
    if (isTouchDevice) {
        document.documentElement.classList.add('touch-device');
        
        // Настраиваем touch эффекты
        setupTouchEffects();
    } else {
        document.body.classList.add('no-touch');
    }
    
    function setupTouchEffects() {
        // Для NFT карточек
        const nftCards = document.querySelectorAll('.nft-card');
        nftCards.forEach(card => {
            card.addEventListener('touchstart', () => {
                card.classList.add('touch-active');
            });
            
            card.addEventListener('touchend', () => {
                setTimeout(() => {
                    card.classList.remove('touch-active');
                }, 300);
            });
            
            card.addEventListener('touchcancel', () => {
                card.classList.remove('touch-active');
            });
        });
        
        // Для блоков в секции "О проекте"
        const aboutItems = document.querySelectorAll('.about-item');
        aboutItems.forEach(item => {
            item.addEventListener('touchstart', () => {
                item.classList.add('touch-active');
            });
            
            item.addEventListener('touchend', () => {
                setTimeout(() => {
                    item.classList.remove('touch-active');
                }, 300);
            });
            
            item.addEventListener('touchcancel', () => {
                item.classList.remove('touch-active');
            });
        });
        
        // Для блоков в секции "Дорожная карта"
        const roadmapItems = document.querySelectorAll('.roadmap-content');
        roadmapItems.forEach(item => {
            item.addEventListener('touchstart', () => {
                item.classList.add('touch-active');
            });
            
            item.addEventListener('touchend', () => {
                setTimeout(() => {
                    item.classList.remove('touch-active');
                }, 300);
            });
            
            item.addEventListener('touchcancel', () => {
                item.classList.remove('touch-active');
            });
        });
        
        // Для блоков в секции "Сообщество"
        const communityItems = document.querySelectorAll('.twitter-feed, .discord-community');
        communityItems.forEach(item => {
            item.addEventListener('touchstart', () => {
                item.classList.add('touch-active');
            });
            
            item.addEventListener('touchend', () => {
                setTimeout(() => {
                    item.classList.remove('touch-active');
                }, 300);
            });
            
            item.addEventListener('touchcancel', () => {
                item.classList.remove('touch-active');
            });
        });
        
        // Для навигационных ссылок
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('touchstart', () => {
                link.classList.add('touch-active');
            });
            
            link.addEventListener('touchend', () => {
                setTimeout(() => {
                    link.classList.remove('touch-active');
                }, 300);
            });
            
            link.addEventListener('touchcancel', () => {
                link.classList.remove('touch-active');
            });
        });
        
        // Для социальных ссылок
        const socialLinks = document.querySelectorAll('.social-link');
        socialLinks.forEach(link => {
            link.addEventListener('touchstart', () => {
                link.classList.add('touch-active');
            });
            
            link.addEventListener('touchend', () => {
                setTimeout(() => {
                    link.classList.remove('touch-active');
                }, 300);
            });
            
            link.addEventListener('touchcancel', () => {
                link.classList.remove('touch-active');
            });
        });
        
        // Для полей ввода для улучшения отзывчивости формы
        const inputFields = document.querySelectorAll('input, textarea');
        inputFields.forEach(field => {
            field.addEventListener('focus', () => {
                field.classList.add('input-focused');
            });
            
            field.addEventListener('blur', () => {
                field.classList.remove('input-focused');
            });
        });
        
        // Добавляем индексы для задержки анимации элементов мобильного меню
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach((item, index) => {
            item.style.setProperty('--item-index', index);
        });
    }
    
    // Обработчик для возврата к нормальному состоянию интерфейса после touch событий
    document.addEventListener('touchend', (e) => {
        if (!e.target.classList.contains('touch-active') && !e.target.closest('.touch-active')) {
            document.querySelectorAll('.touch-active').forEach(element => {
                element.classList.remove('touch-active');
            });
        }
    });
    
    // Определяем кастомное поведение скрытия адресной строки в мобильных браузерах
    if (isTouchDevice && window.innerHeight < 700) {
        let lastScrollTop = 0;
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
            
            if (currentScroll > lastScrollTop && currentScroll > 200) {
                // Скролл вниз - скрываем UI элементы
                document.querySelector('.main-header').classList.add('header-hidden');
                document.querySelector('#scroll-top').classList.add('visible');
            } else if (currentScroll < lastScrollTop || currentScroll < 50) {
                // Скролл вверх или вернулись к началу - показываем UI элементы
                document.querySelector('.main-header').classList.remove('header-hidden');
                
                if (currentScroll < 200) {
                    document.querySelector('#scroll-top').classList.remove('visible');
                }
            }
            
            lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
        }, { passive: true });
    }
    
    // Оптимизация для режима экономии энергии
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.documentElement.classList.add('reduce-animations');
    }
    
    // Обработчик для кнопки быстрого перехода наверх
    const scrollTopBtn = document.getElementById('scroll-top');
    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
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
}); 