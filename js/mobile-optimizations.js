/**
 * mobile-optimizations.js
 * Скрипт для оптимизации работы сайта на мобильных устройствах
 */

document.addEventListener('DOMContentLoaded', function() {
    // Определение мобильного устройства
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
                      window.innerWidth < 768;
    
    // Оптимизация анимаций на мобильных устройствах
    if (isMobile) {
        // Добавляем класс mobile к body для CSS-оптимизаций
        document.body.classList.add('mobile');
        
        // Уменьшаем требовательность Three.js анимаций
        window.MOBILE_RENDER_QUALITY = 'low';
        
        // Отключаем или упрощаем некоторые тяжелые анимации
        const heavyAnimations = document.querySelectorAll('.heavy-animation');
        heavyAnimations.forEach(animation => {
            animation.style.display = 'none';
        });
        
        // Оптимизация прокрутки для мобильных устройств
        let lastScrollTop = 0;
        let ticking = false;
        
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (!ticking) {
                window.requestAnimationFrame(function() {
                    // Если скроллим вниз - скрываем меню
                    if (scrollTop > lastScrollTop && scrollTop > 100) {
                        document.querySelector('.main-header').classList.add('header-hidden');
                    } else {
                        document.querySelector('.main-header').classList.remove('header-hidden');
                    }
                    
                    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
                    ticking = false;
                });
                
                ticking = true;
            }
        }, { passive: true });
    }
    
    // Добавляем обработчик события для изменения ориентации экрана
    window.addEventListener('orientationchange', function() {
        // Таймаут нужен, так как orientationchange может срабатывать до фактического изменения размеров
        setTimeout(function() {
            // Перерасчет высоты видимой области для мобильных браузеров
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        }, 300);
    });
    
    // Правильная высота для мобильных браузеров
    function setVhVariable() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    
    // Устанавливаем переменную сразу и при изменении размера окна
    setVhVariable();
    window.addEventListener('resize', setVhVariable);
    
    // Оптимизация для клавиатуры мобильных устройств
    const inputs = document.querySelectorAll('input, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            // При фокусе на поле ввода прокручиваем к этому полю
            setTimeout(() => {
                this.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 300);
        });
        
        input.addEventListener('blur', function() {
            // При уходе с поля ввода устанавливаем правильную высоту
            setVhVariable();
        });
    });
    
    // Обработка касаний для элементов с hover-эффектами
    const touchElements = document.querySelectorAll('.touch-effect');
    
    touchElements.forEach(element => {
        element.addEventListener('touchstart', function() {
            this.classList.add('touch-active');
        }, { passive: true });
        
        element.addEventListener('touchend', function() {
            this.classList.remove('touch-active');
        }, { passive: true });
    });
    
    // Активация и деактивация классов на элементах через делегирование событий
    document.body.addEventListener('touchstart', function(e) {
        if (e.target.classList.contains('nav-link') || 
            e.target.classList.contains('btn-primary') || 
            e.target.classList.contains('btn-secondary') ||
            e.target.classList.contains('community-btn')) {
            e.target.classList.add('touch-active');
        }
    }, { passive: true });
    
    document.body.addEventListener('touchend', function(e) {
        const activeElements = document.querySelectorAll('.touch-active');
        activeElements.forEach(element => {
            element.classList.remove('touch-active');
        });
    }, { passive: true });
}); 