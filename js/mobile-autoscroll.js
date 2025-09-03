// Автопрокрутка для мобильной версии - надежная реализация
(function() {
    'use strict';
    
    // Проверка мобильного устройства
    if (window.innerWidth > 768) return;
    
    console.log('🚀 Инициализация автопрокрутки для мобильных устройств');
    
    // Добавляем CSS анимации
    const style = document.createElement('style');
    style.textContent = `
        @keyframes mobileAutoScroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
        }
        
        .mobile-autoscroll-wrapper {
            width: 100% !important;
            overflow: hidden !important;
            position: relative !important;
        }
        
        .mobile-autoscroll-track {
            display: flex !important;
            gap: 20px !important;
            backface-visibility: hidden !important;
            will-change: transform !important;
        }
    `;
    document.head.appendChild(style);
    
    // Функция создания автопрокрутки
    function setupMobileAutoScroll(selector, duration) {
        function trySetup() {
            const container = document.querySelector(selector);
            
            if (!container) {
                console.log('❌ Контейнер не найден:', selector);
                return false;
            }
            
            const cards = Array.from(container.children);
            
            if (cards.length === 0) {
                console.log('❌ Нет карточек в:', selector);
                return false;
            }
            
            console.log('✅ Настройка автопрокрутки:', selector, 'карточек:', cards.length);
            
            // Создаем структуру
            const wrapper = document.createElement('div');
            wrapper.className = 'mobile-autoscroll-wrapper';
            
            const track = document.createElement('div');
            track.className = 'mobile-autoscroll-track';
            
            // Добавляем оригинальные карточки
            cards.forEach(card => track.appendChild(card));
            
            // Добавляем копии
            cards.forEach(card => {
                const copy = card.cloneNode(true);
                track.appendChild(copy);
            });
            
            // Заменяем содержимое
            wrapper.appendChild(track);
            container.innerHTML = '';
            container.appendChild(wrapper);
            
            // Применяем анимацию (как в collection-slider.js)
            track.style.transform = 'translateX(0)';
            track.style.animation = 'none';
            
            // Запускаем анимацию с задержкой
            setTimeout(() => {
                track.style.animation = `mobileAutoScroll ${duration}s linear infinite`;
                console.log('🎬 Анимация запущена для:', selector);
            }, 100);
            
            // Обработчики касаний
            let pauseTimer;
            
            container.addEventListener('touchstart', () => {
                track.style.animationPlayState = 'paused';
                clearTimeout(pauseTimer);
            });
            
            container.addEventListener('touchend', () => {
                pauseTimer = setTimeout(() => {
                    track.style.animationPlayState = 'running';
                }, 2000);
            });
            
            return true;
        }
        
        // Пробуем настроить с несколькими попытками
        let attempts = 0;
        const maxAttempts = 10;
        
        function attemptSetup() {
            attempts++;
            
            if (trySetup()) {
                console.log('✅ Автопрокрутка успешно настроена:', selector);
                return;
            }
            
            if (attempts < maxAttempts) {
                console.log(`🔄 Попытка ${attempts}/${maxAttempts} для:`, selector);
                setTimeout(attemptSetup, 1000);
            } else {
                console.log('❌ Не удалось настроить автопрокрутку для:', selector);
            }
        }
        
        // Начинаем попытки через 2 секунды
        setTimeout(attemptSetup, 2000);
    }
    
    // Запуск для обеих секций
    setupMobileAutoScroll('#ecosystem .ecosystem-grid', 35);
    setupMobileAutoScroll('#partnerships .partnerships-grid', 25);
    
})();