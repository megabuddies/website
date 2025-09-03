/**
 * Device detector для автоматической переадресации на мобильную версию сайта
 */
(function() {
    // Определяем, является ли устройство мобильным
    function isMobileDevice() {
        return (
            // Проверка на мобильные устройства через User-Agent
            /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
            // Проверка по ширине экрана
            window.innerWidth <= 768
        );
    }

    // Определяем, открыта ли страница на мобильной версии
    function isOnMobilePage() {
        return window.location.pathname.indexOf('mobile.html') !== -1;
    }

    // Определяем, открыта ли страница на десктопной версии
    function isOnDesktopPage() {
        return window.location.pathname.indexOf('index.html') !== -1 || 
               window.location.pathname === '/' || 
               window.location.pathname.lastIndexOf('/') === window.location.pathname.length - 1;
    }

    // Определяем, открыта ли страница экосистемы (telegram-bots, ai-companions, etc.)
    function isOnEcosystemPage() {
        return window.location.pathname.indexOf('telegram-bots.html') !== -1 ||
               window.location.pathname.indexOf('ai-companions.html') !== -1 ||
               window.location.href.indexOf('zealy.io/cw/megabuddies/questboard/') !== -1 ||
               window.location.pathname.indexOf('leaderboard.html') !== -1;
    }

    // Функция переадресации
    function redirectIfNeeded() {
        var isMobile = isMobileDevice();
        
        // Не переадресовываем, если пользователь на странице экосистемы
        if (isOnEcosystemPage()) {
            return;
        }
        
        // Если устройство мобильное, но пользователь не на мобильной версии
        if (isMobile && !isOnMobilePage()) {
            // Сохраняем хэш, если он есть
            var currentHash = window.location.hash;
            var destinationUrl = 'mobile.html' + currentHash;
            window.location.href = destinationUrl;
        }
        // Если устройство десктопное, но пользователь на мобильной версии
        else if (!isMobile && isOnMobilePage()) {
            // Сохраняем хэш, если он есть
            var currentHash = window.location.hash;
            var destinationUrl = 'index.html' + currentHash;
            window.location.href = destinationUrl;
        }
    }

    // Запускаем переадресацию при загрузке страницы
    window.addEventListener('DOMContentLoaded', redirectIfNeeded);
})(); 