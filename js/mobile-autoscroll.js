// Автопрокрутка для мобильной версии - бесшовная как в COLLECTION
(function() {
    'use strict';
    
    // Проверка мобильного устройства
    if (window.innerWidth > 768) return;
    
    console.log('🚀 Инициализация бесшовной автопрокрутки');
    
    // Добавляем CSS анимации
    const style = document.createElement('style');
    style.textContent = `
        @keyframes mobileAutoScroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
        }
        
        .mobile-scroll-wrapper {
            width: 100% !important;
            overflow: hidden !important;
            position: relative !important;
        }
        
        .mobile-scroll-track {
            display: flex !important;
            gap: 20px !important;
            backface-visibility: hidden !important;
            will-change: transform !important;
        }
    `;
    document.head.appendChild(style);
    
    // Функция создания бесшовной автопрокрутки (как в COLLECTION)
    function setupSeamlessAutoScroll(selector, duration) {
        function trySetup() {
            const container = document.querySelector(selector);
            
            if (!container) return false;
            
            const cards = Array.from(container.children);
            if (cards.length === 0) return false;
            
            console.log('✅ Настройка для:', selector, 'карточек:', cards.length);
            
            // Создаем структуру (точно как в collection-slider.js)
            const wrapper = document.createElement('div');
            wrapper.className = 'mobile-scroll-wrapper';
            
            const track = document.createElement('div');
            track.className = 'mobile-scroll-track';
            
            // Добавляем оригинальные карточки
            cards.forEach(card => track.appendChild(card));
            
            // Добавляем копии для бесшовности
            cards.forEach(card => {
                const copy = card.cloneNode(true);
                track.appendChild(copy);
            });
            
            // Заменяем содержимое
            wrapper.appendChild(track);
            container.innerHTML = '';
            container.appendChild(wrapper);
            
            // Применяем анимацию (точно как в collection-slider.js)
            track.style.transform = 'translateX(0)';
            track.style.animation = 'none';
            
            setTimeout(() => {
                track.style.animation = `mobileAutoScroll ${duration}s linear infinite`;
                console.log('🎬 Автопрокрутка запущена:', selector);
            }, 10);
            
            // Простая обработка касаний (как в COLLECTION)
            let pauseTimeout;
            wrapper.addEventListener('touchstart', () => {
                track.style.animationPlayState = 'paused';
                clearTimeout(pauseTimeout);
            });
            
            wrapper.addEventListener('touchend', () => {
                pauseTimeout = setTimeout(() => {
                    track.style.animationPlayState = 'running';
                }, 1500);
            });
            
            // Пауза при смене вкладки (как в collection-slider.js)
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    track.style.animationPlayState = 'paused';
                } else {
                    track.style.animationPlayState = 'running';
                }
            });
            
            return true;
        }
        
        // Пробуем настроить
        let attempts = 0;
        function attemptSetup() {
            attempts++;
            if (trySetup() || attempts >= 5) return;
            setTimeout(attemptSetup, 1000);
        }
        
        setTimeout(attemptSetup, 2000);
    }
    
    // Запуск для обеих секций с быстрой скоростью
    setupSeamlessAutoScroll('#ecosystem .ecosystem-grid', 12);
    setupSeamlessAutoScroll('#partnerships .partnerships-grid', 8);
    
})();