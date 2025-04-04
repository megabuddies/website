/**
 * mobile-optimize.js
 * Оптимизации для ускорения загрузки на мобильных устройствах
 */

document.addEventListener('DOMContentLoaded', function() {
    // Определяем, является ли устройство мобильным
    const isMobileDevice = window.innerWidth <= 768;
    
    if (isMobileDevice) {
        // Оптимизация прелоадера для мобильных устройств
        const preloaderProgressBar = document.querySelector('#preloader .progress');
        if (preloaderProgressBar) {
            // Ускоряем анимацию загрузки на мобильных устройствах
            // чтобы уменьшить время ожидания пользователя
            const preloaderInterval = setInterval(function() {
                const currentWidth = parseFloat(preloaderProgressBar.style.width) || 0;
                if (currentWidth < 95) {
                    // Увеличиваем скорость загрузки для мобильных устройств
                    preloaderProgressBar.style.width = `${Math.min(currentWidth + 5, 95)}%`;
                } else {
                    clearInterval(preloaderInterval);
                }
            }, 100); // Ускоряем интервал
        }
        
        // Отложенная загрузка несущественных скриптов и ресурсов
        function loadDeferredResources() {
            // Массив скриптов, которые можно загрузить с задержкой
            const deferredScripts = [
                { src: 'js/scroll-animations.js', defer: true },
                { src: 'js/three-animation.js', defer: true }
            ];
            
            // Загружаем отложенные скрипты
            deferredScripts.forEach(function(script) {
                setTimeout(function() {
                    const scriptEl = document.createElement('script');
                    scriptEl.src = script.src;
                    scriptEl.defer = script.defer;
                    document.body.appendChild(scriptEl);
                }, 2000); // Задержка 2 секунды после загрузки страницы
            });
        }
        
        // Вызываем отложенную загрузку ресурсов после завершения критического рендеринга
        window.addEventListener('load', loadDeferredResources);
        
        // Управление режимом энергосбережения для анимаций
        let batteryAPISupported = false;
        
        // Проверяем поддержку Battery API
        if ('getBattery' in navigator) {
            batteryAPISupported = true;
            navigator.getBattery().then(function(battery) {
                // Если заряд меньше 20%, уменьшаем интенсивность анимаций
                if (battery.level < 0.2) {
                    document.documentElement.classList.add('reduce-animations');
                }
                
                // Слушаем изменения уровня заряда
                battery.addEventListener('levelchange', function() {
                    if (battery.level < 0.2) {
                        document.documentElement.classList.add('reduce-animations');
                    } else {
                        document.documentElement.classList.remove('reduce-animations');
                    }
                });
            });
        }
        
        // Проверяем системное предпочтение для снижения анимаций
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        if (prefersReducedMotion.matches) {
            document.documentElement.classList.add('reduce-animations');
        }
        
        // Отслеживаем изменения системных предпочтений
        prefersReducedMotion.addEventListener('change', function(e) {
            if (e.matches) {
                document.documentElement.classList.add('reduce-animations');
            } else {
                // Возвращаем обычный режим, если нет проблем с батареей
                if (!batteryAPISupported || (batteryAPISupported && battery.level >= 0.2)) {
                    document.documentElement.classList.remove('reduce-animations');
                }
            }
        });
        
        // Оптимизация для сетей с медленным соединением
        if ('connection' in navigator) {
            const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
            
            // Если соединение медленное, еще больше оптимизируем страницу
            if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
                document.documentElement.classList.add('slow-connection');
                
                // Отключаем некоторые тяжелые анимации
                const animatedElements = document.querySelectorAll('.neon-pulse, .neon-flicker');
                animatedElements.forEach(function(el) {
                    el.classList.remove('neon-pulse', 'neon-flicker');
                });
            }
        }
    }
}); 