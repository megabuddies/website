// Автопрокрутка для мобильной версии - НЕ меняем структуру, только добавляем автопрокрутку
(function() {
    'use strict';
    
    // Проверка мобильного устройства
    if (window.innerWidth > 768) return;
    
    console.log('🚀 Инициализация автопрокрутки поверх существующего скролла');
    
    // Функция создания автопрокрутки БЕЗ изменения структуры
    function addAutoScrollToExisting(selector, speed = 1) {
        function trySetup() {
            const container = document.querySelector(selector);
            
            if (!container) return false;
            
            console.log('✅ Найден контейнер:', selector);
            console.log('📦 Ширина контента:', container.scrollWidth, 'Ширина видимой области:', container.clientWidth);
            
            // НЕ меняем HTML структуру!
            // Просто дублируем существующие карточки для бесшовности
            const originalCards = Array.from(container.children);
            originalCards.forEach(card => {
                const copy = card.cloneNode(true);
                container.appendChild(copy);
            });
            
            console.log('📋 Карточки дублированы. Теперь карточек:', container.children.length);
            
            // Переменные для автопрокрутки
            let isAutoScrolling = true;
            let userInteracting = false;
            let currentPosition = 0;
            let animationId = null;
            let pauseTimeout = null;
            
            // Функция плавной автопрокрутки
            function smoothAutoScroll() {
                if (!isAutoScrolling || userInteracting) {
                    animationId = requestAnimationFrame(smoothAutoScroll);
                    return;
                }
                
                currentPosition += speed;
                
                // Максимальная прокрутка (половина, так как контент дублирован)
                const maxScroll = (container.scrollWidth - container.clientWidth) / 2;
                
                // Сброс для бесшовности
                if (currentPosition >= maxScroll) {
                    currentPosition = 0;
                }
                
                // Применяем прокрутку
                container.scrollLeft = currentPosition;
                
                animationId = requestAnimationFrame(smoothAutoScroll);
            }
            
            // Старт автопрокрутки
            function startAutoScroll() {
                if (!isAutoScrolling) {
                    isAutoScrolling = true;
                    currentPosition = container.scrollLeft;
                    smoothAutoScroll();
                }
            }
            
            // Стоп автопрокрутки
            function stopAutoScroll() {
                isAutoScrolling = false;
                if (animationId) {
                    cancelAnimationFrame(animationId);
                    animationId = null;
                }
            }
            
            // Обработчики касаний - ПРОСТЫЕ, без блокировки ручной прокрутки
            container.addEventListener('touchstart', () => {
                userInteracting = true;
                clearTimeout(pauseTimeout);
                // НЕ останавливаем автопрокрутку полностью, просто помечаем взаимодействие
            });
            
            container.addEventListener('touchmove', () => {
                userInteracting = true;
                clearTimeout(pauseTimeout);
                // Пользователь прокручивает вручную - обновляем позицию
                currentPosition = container.scrollLeft;
            });
            
            container.addEventListener('touchend', () => {
                // Возобновляем автопрокрутку через короткое время
                pauseTimeout = setTimeout(() => {
                    userInteracting = false;
                    currentPosition = container.scrollLeft;
                    // Автопрокрутка продолжается с текущей позиции
                }, 1000);
            });
            
            // Обработка ручной прокрутки
            container.addEventListener('scroll', () => {
                if (userInteracting) {
                    // Обновляем позицию для автопрокрутки
                    currentPosition = container.scrollLeft;
                    clearTimeout(pauseTimeout);
                    
                    pauseTimeout = setTimeout(() => {
                        userInteracting = false;
                    }, 1000);
                }
            });
            
            // Пауза при смене вкладки
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    stopAutoScroll();
                } else if (!userInteracting) {
                    startAutoScroll();
                }
            });
            
            // Запускаем автопрокрутку
            setTimeout(() => {
                startAutoScroll();
                console.log('🎬 Автопрокрутка запущена для:', selector);
            }, 1000);
            
            return true;
        }
        
        // Попытки инициализации
        let attempts = 0;
        function attemptSetup() {
            attempts++;
            if (trySetup() || attempts >= 5) return;
            setTimeout(attemptSetup, 1000);
        }
        
        setTimeout(attemptSetup, 2000);
    }
    
    // Запуск для обеих секций
    addAutoScrollToExisting('#ecosystem .ecosystem-grid', 1.5); // Быстрая прокрутка
    addAutoScrollToExisting('#partnerships .partnerships-grid', 1.0); // Медленнее для 2 карточек
    
})();