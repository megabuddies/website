// Автопрокрутка для мобильной версии - улучшенная версия
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
            overflow-x: auto !important;
            overflow-y: hidden !important;
            position: relative !important;
            scroll-behavior: smooth !important;
            -webkit-overflow-scrolling: touch !important;
        }
        
        .mobile-autoscroll-track {
            display: flex !important;
            gap: 20px !important;
            backface-visibility: hidden !important;
            will-change: transform !important;
        }
        
        .mobile-autoscroll-track.auto-mode {
            overflow-x: visible !important;
        }
        
        .mobile-autoscroll-track.manual-mode {
            animation-play-state: paused !important;
            transform: none !important;
            animation: none !important;
        }
    `;
    document.head.appendChild(style);
    
    // Функция создания автопрокрутки с поддержкой ручной прокрутки
    function setupAdvancedAutoScroll(selector, duration) {
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
            
            // Создаем wrapper с поддержкой ручной прокрутки
            const wrapper = document.createElement('div');
            wrapper.className = 'mobile-autoscroll-wrapper';
            
            const track = document.createElement('div');
            track.className = 'mobile-autoscroll-track auto-mode';
            
            // Добавляем оригинальные карточки
            cards.forEach(card => track.appendChild(card));
            
            // Добавляем копии для бесшовной автопрокрутки
            cards.forEach(card => {
                const copy = card.cloneNode(true);
                track.appendChild(copy);
            });
            
            // Заменяем содержимое
            wrapper.appendChild(track);
            container.innerHTML = '';
            container.appendChild(wrapper);
            
            // Переменные для управления режимами
            let isAutoMode = true;
            let autoScrollTimer;
            let manualScrollTimer;
            let isUserScrolling = false;
            
            // Функция запуска автопрокрутки
            function startAutoScroll() {
                if (!isAutoMode) return;
                
                track.style.transform = 'translateX(0)';
                track.style.animation = 'none';
                track.offsetHeight; // Принудительный reflow
                
                setTimeout(() => {
                    if (isAutoMode) {
                        track.style.animation = `mobileAutoScroll ${duration}s linear infinite`;
                        console.log('🎬 Автопрокрутка запущена:', selector);
                    }
                }, 50);
            }
            
            // Функция переключения в ручной режим
            function switchToManualMode() {
                isAutoMode = false;
                track.classList.remove('auto-mode');
                track.classList.add('manual-mode');
                wrapper.style.overflowX = 'auto';
                track.style.animation = 'none';
                track.style.transform = 'translateX(0)';
                console.log('👆 Переключение в ручной режим:', selector);
            }
            
            // Функция переключения в автоматический режим
            function switchToAutoMode() {
                isAutoMode = true;
                track.classList.remove('manual-mode');
                track.classList.add('auto-mode');
                wrapper.style.overflowX = 'hidden';
                startAutoScroll();
                console.log('🤖 Переключение в авто режим:', selector);
            }
            
            // Обработчики для определения ручной прокрутки
            wrapper.addEventListener('touchstart', function(e) {
                isUserScrolling = true;
                clearTimeout(autoScrollTimer);
                clearTimeout(manualScrollTimer);
                
                if (isAutoMode) {
                    switchToManualMode();
                }
            });
            
            wrapper.addEventListener('touchmove', function(e) {
                isUserScrolling = true;
                clearTimeout(autoScrollTimer);
                clearTimeout(manualScrollTimer);
            });
            
            wrapper.addEventListener('touchend', function() {
                // Возвращаемся к автопрокрутке через 4 секунды
                manualScrollTimer = setTimeout(() => {
                    isUserScrolling = false;
                    switchToAutoMode();
                }, 4000);
            });
            
            // Обработчик прокрутки для ручного режима
            wrapper.addEventListener('scroll', function() {
                if (isUserScrolling) {
                    clearTimeout(autoScrollTimer);
                    clearTimeout(manualScrollTimer);
                    
                    // Возвращаемся к автопрокрутке через 3 секунды после остановки прокрутки
                    manualScrollTimer = setTimeout(() => {
                        isUserScrolling = false;
                        switchToAutoMode();
                    }, 3000);
                }
            });
            
            // Пауза при смене вкладки
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    track.style.animationPlayState = 'paused';
                } else if (isAutoMode && !isUserScrolling) {
                    track.style.animationPlayState = 'running';
                }
            });
            
            // Запускаем автопрокрутку
            setTimeout(startAutoScroll, 500);
            
            return true;
        }
        
        // Пробуем настроить с несколькими попытками
        let attempts = 0;
        const maxAttempts = 5;
        
        function attemptSetup() {
            attempts++;
            
            if (trySetup()) {
                return;
            }
            
            if (attempts < maxAttempts) {
                setTimeout(attemptSetup, 1000);
            }
        }
        
        setTimeout(attemptSetup, 2000);
    }
    
    // Запуск для обеих секций с быстрой скоростью (как в COLLECTION)
    setupAdvancedAutoScroll('#ecosystem .ecosystem-grid', 12); // Быстрая скорость для 7 карточек
    setupAdvancedAutoScroll('#partnerships .partnerships-grid', 8); // Очень быстрая для 2 карточек
    
})();