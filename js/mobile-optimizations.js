/**
 * Мобильные оптимизации для Mega Buddies
 * Этот файл содержит функции оптимизации производительности для мобильных устройств
 */

document.addEventListener('DOMContentLoaded', function() {
    // Определяем тип устройства
    const isMobile = window.innerWidth <= 768;
    const isSmallMobile = window.innerWidth <= 576;
    
    // Оптимизация для мобильных устройств
    if (isMobile) {
        optimizeMobile();
    }
    
    // Обработчик изменения размера окна
    window.addEventListener('resize', function() {
        const newIsMobile = window.innerWidth <= 768;
        const newIsSmallMobile = window.innerWidth <= 576;
        
        // Если тип устройства изменился (с мобильного на десктоп или наоборот)
        if ((newIsMobile !== isMobile) || (newIsSmallMobile !== isSmallMobile)) {
            if (newIsMobile) {
                optimizeMobile();
            } else {
                restoreDesktopSettings();
            }
        }
    });
    
    // Функция оптимизации для мобильных устройств
    function optimizeMobile() {
        // Уменьшаем интенсивность эффектов свечения
        document.documentElement.style.setProperty('--glow-intensity', '0.7');
        
        // Оптимизируем анимации, но делаем это аккуратно
        const animationElements = document.querySelectorAll('.neon-pulse, .neon-flicker');
        animationElements.forEach(el => {
            // Уменьшаем интенсивность анимаций, но не отключаем их полностью
            el.style.animationDuration = '4s';
        });
        
        // Уменьшаем количество пикселей в декоративных элементах
        const pixelElements = document.querySelectorAll('.pixel-overlay');
        pixelElements.forEach(el => {
            if (el.children.length > 20) {
                // Оставляем только каждый третий пиксель
                for (let i = el.children.length - 1; i >= 0; i--) {
                    if (i % 3 !== 0) {
                        el.children[i].style.display = 'none';
                    }
                }
            }
        });
        
        // Убеждаемся, что 3D модель видна
        const heroAnimation = document.getElementById('hero-animation');
        if (heroAnimation) {
            heroAnimation.style.display = 'block';
            
            // Меняем размер в зависимости от размера экрана
            if (isSmallMobile) {
                heroAnimation.style.width = '250px';
                heroAnimation.style.height = '250px';
            } else {
                heroAnimation.style.width = '300px';
                heroAnimation.style.height = '300px';
            }
        }
        
        // Оптимизация производительности для скрола
        optimizeScrollPerformance();
    }
    
    // Функция возврата к настройкам десктопа
    function restoreDesktopSettings() {
        // Возвращаем интенсивность эффектов свечения
        document.documentElement.style.setProperty('--glow-intensity', '1');
        
        // Восстанавливаем анимации
        const animationElements = document.querySelectorAll('.neon-pulse, .neon-flicker, .neon-glow');
        animationElements.forEach(el => {
            el.style.animation = '';
            el.style.animationDelay = '';
            el.style.animationDuration = '';
            el.style.textShadow = '';
        });
        
        // Восстанавливаем пиксели
        const pixelElements = document.querySelectorAll('.pixel-overlay');
        pixelElements.forEach(el => {
            for (let i = 0; i < el.children.length; i++) {
                el.children[i].style.display = '';
            }
        });
        
        // Восстанавливаем 3D модель
        const heroAnimation = document.getElementById('hero-animation');
        if (heroAnimation) {
            heroAnimation.style.width = '';
            heroAnimation.style.height = '';
        }
    }
    
    // Оптимизация производительности при скроле
    function optimizeScrollPerformance() {
        let scrollTimeout;
        let isScrolling = false;
        
        window.addEventListener('scroll', function() {
            // Устанавливаем флаг скроллинга
            if (!isScrolling) {
                isScrolling = true;
                document.body.classList.add('is-scrolling');
                
                // Отключаем тяжелые эффекты во время скрола
                const heavyElements = document.querySelectorAll('.neon-text, .neon-glow, .nft-card, .roadmap-content');
                heavyElements.forEach(el => {
                    el.style.willChange = 'transform';
                    el.classList.add('optimized');
                });
            }
            
            // Сбрасываем таймер при каждом событии скрола
            clearTimeout(scrollTimeout);
            
            // Устанавливаем новый таймер
            scrollTimeout = setTimeout(function() {
                // Скроллинг завершен, восстанавливаем эффекты
                isScrolling = false;
                document.body.classList.remove('is-scrolling');
                
                const heavyElements = document.querySelectorAll('.neon-text, .neon-glow, .nft-card, .roadmap-content');
                heavyElements.forEach(el => {
                    el.style.willChange = 'auto';
                    el.classList.remove('optimized');
                });
            }, 200);
        }, { passive: true });
    }
    
    // Обработка лейзи-загрузки изображений
    function setupLazyLoading() {
        const lazyImages = document.querySelectorAll('img:not([loading="eager"])');
        lazyImages.forEach(img => {
            img.setAttribute('loading', 'lazy');
        });
    }
    
    // Вызываем лейзи-загрузку
    setupLazyLoading();
}); 