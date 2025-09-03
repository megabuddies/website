document.addEventListener('DOMContentLoaded', function() {
    // Проверяем, что мы на мобильном устройстве
    function isMobileDevice() {
        return window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
    
    // Функция для создания плавной непрерывной автопрокрутки
    function setupSmoothAutoScroll(container, options = {}) {
        if (!container || !isMobileDevice()) return;
        
        const {
            duration = 40, // продолжительность полного цикла в секундах
            pauseOnTouch = true // пауза при касании
        } = options;
        
        let wrapper = null;
        let userInteracted = false;
        let touchTimeout = null;
        
        // Подготовка контейнера для CSS анимации
        function prepareContainer() {
            // Проверяем, не создана ли уже обертка
            if (container.querySelector('.auto-scroll-wrapper')) {
                return container.querySelector('.auto-scroll-wrapper');
            }
            
            // Создаем обертку для анимации
            const newWrapper = document.createElement('div');
            newWrapper.className = 'auto-scroll-wrapper';
            
            // Перемещаем все карточки в обертку
            const cards = Array.from(container.children);
            cards.forEach(card => newWrapper.appendChild(card));
            
            // Дублируем контент для бесшовной прокрутки
            cards.forEach(card => {
                const clone = card.cloneNode(true);
                newWrapper.appendChild(clone);
            });
            
            // Очищаем контейнер и добавляем обертку
            container.innerHTML = '';
            container.appendChild(newWrapper);
            
            return newWrapper;
        }
        
        // Запуск автопрокрутки
        function startAutoScroll() {
            if (!wrapper) {
                wrapper = prepareContainer();
            }
            
            // Добавляем класс для CSS стилей
            container.classList.add('auto-scrolling');
            
            // Применяем CSS анимацию
            wrapper.style.animation = 'none'; // Сброс
            wrapper.offsetHeight; // Принудительный reflow
            wrapper.style.animation = `smoothAutoScroll ${duration}s linear infinite`;
            
            // console.log('Плавная автопрокрутка запущена для:', container.className);
        }
        
        // Остановка автопрокрутки
        function stopAutoScroll() {
            if (wrapper) {
                wrapper.style.animationPlayState = 'paused';
            }
        }
        
        // Возобновление автопрокрутки
        function resumeAutoScroll() {
            if (wrapper) {
                wrapper.style.animationPlayState = 'running';
            }
        }
        
        // Обработчики событий для паузы при взаимодействии пользователя
        if (pauseOnTouch) {
            // Пауза при касании
            container.addEventListener('touchstart', (e) => {
                userInteracted = true;
                container.classList.add('user-interacting');
                stopAutoScroll();
                
                // Очищаем предыдущий таймаут
                if (touchTimeout) {
                    clearTimeout(touchTimeout);
                }
            });
            
            container.addEventListener('touchend', () => {
                // Возобновляем через 3 секунды после окончания касания
                touchTimeout = setTimeout(() => {
                    userInteracted = false;
                    container.classList.remove('user-interacting');
                    resumeAutoScroll();
                }, 3000);
            });
            
            // Пауза когда страница не видна
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    stopAutoScroll();
                } else if (!userInteracted) {
                    resumeAutoScroll();
                }
            });
        }
        
        // Запускаем автопрокрутку с задержкой
        setTimeout(() => {
            startAutoScroll();
        }, 2000);
        
        // Возвращаем методы управления
        return {
            start: startAutoScroll,
            stop: stopAutoScroll,
            resume: resumeAutoScroll
        };
    }
    
    // Инициализация автопрокрутки для секции ECOSYSTEM
    const ecosystemGrid = document.querySelector('#ecosystem .ecosystem-grid');
    if (ecosystemGrid) {
        const initEcosystem = () => {
            if (!isMobileDevice()) {
                // console.log('Автопрокрутка ECOSYSTEM отключена для десктопа');
                return;
            }
            
            // console.log('Инициализация плавной автопрокрутки ECOSYSTEM для мобильных устройств');
            const ecosystemAutoScroll = setupSmoothAutoScroll(ecosystemGrid, {
                duration: 35, // медленная прокрутка для 7 карточек
                pauseOnTouch: true
            });
            
            window.ecosystemAutoScroll = ecosystemAutoScroll;
        };
        
        // Инициализация с задержкой
        if (document.readyState === 'complete') {
            setTimeout(initEcosystem, 1000);
        } else {
            window.addEventListener('load', () => setTimeout(initEcosystem, 1000));
        }
    }
    
    // Инициализация автопрокрутки для секции PARTNERSHIPS
    const partnershipsGrid = document.querySelector('#partnerships .partnerships-grid');
    if (partnershipsGrid) {
        const initPartnerships = () => {
            if (!isMobileDevice()) {
                // console.log('Автопрокрутка PARTNERSHIPS отключена для десктопа');
                return;
            }
            
            // console.log('Инициализация плавной автопрокрутки PARTNERSHIPS для мобильных устройств');
            const partnershipsAutoScroll = setupSmoothAutoScroll(partnershipsGrid, {
                duration: 25, // быстрее для 2 карточек
                pauseOnTouch: true
            });
            
            window.partnershipsAutoScroll = partnershipsAutoScroll;
        };
        
        // Инициализация с задержкой
        if (document.readyState === 'complete') {
            setTimeout(initPartnerships, 1500);
        } else {
            window.addEventListener('load', () => setTimeout(initPartnerships, 1500));
        }
    }
    
    // Обработка изменения размера окна
    window.addEventListener('resize', () => {
        // Останавливаем автопрокрутку на десктопе
        if (!isMobileDevice()) {
            if (window.ecosystemAutoScroll) {
                window.ecosystemAutoScroll.stop();
            }
            if (window.partnershipsAutoScroll) {
                window.partnershipsAutoScroll.stop();
            }
        } else {
            // Перезапускаем на мобильных устройствах
            setTimeout(() => {
                if (window.ecosystemAutoScroll) {
                    window.ecosystemAutoScroll.start();
                }
                if (window.partnershipsAutoScroll) {
                    window.partnershipsAutoScroll.start();
                }
            }, 500);
        }
    });
});