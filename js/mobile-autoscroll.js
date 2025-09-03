document.addEventListener('DOMContentLoaded', function() {
    // Проверяем, что мы на мобильном устройстве
    function isMobileDevice() {
        return window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
    
    // Функция для создания автопрокрутки
    function setupAutoScroll(container, options = {}) {
        if (!container || !isMobileDevice()) return;
        
        const {
            speed = 1, // скорость прокрутки (пикселей за кадр)
            pauseOnHover = true, // пауза при наведении
            direction = 'left', // направление: 'left' или 'right'
            resetOnComplete = true // сброс позиции после полной прокрутки
        } = options;
        
        let isScrolling = false;
        let animationId = null;
        let isPaused = false;
        let userInteracted = false;
        let scrollPosition = 0;
        
        // Функция анимации
        function animate() {
            if (isPaused || userInteracted) {
                animationId = requestAnimationFrame(animate);
                return;
            }
            
            const maxScroll = container.scrollWidth - container.clientWidth;
            
            if (direction === 'left') {
                scrollPosition += speed;
                if (scrollPosition >= maxScroll) {
                    if (resetOnComplete) {
                        scrollPosition = 0;
                    } else {
                        scrollPosition = maxScroll;
                    }
                }
            } else {
                scrollPosition -= speed;
                if (scrollPosition <= 0) {
                    if (resetOnComplete) {
                        scrollPosition = maxScroll;
                    } else {
                        scrollPosition = 0;
                    }
                }
            }
            
            container.scrollLeft = scrollPosition;
            animationId = requestAnimationFrame(animate);
        }
        
        // Запуск автопрокрутки
        function startAutoScroll() {
            if (!isScrolling) {
                isScrolling = true;
                container.classList.add('auto-scrolling');
                scrollPosition = container.scrollLeft;
                animate();
            }
        }
        
        // Остановка автопрокрутки
        function stopAutoScroll() {
            if (isScrolling) {
                isScrolling = false;
                container.classList.remove('auto-scrolling');
                if (animationId) {
                    cancelAnimationFrame(animationId);
                    animationId = null;
                }
            }
        }
        
        // Пауза/возобновление
        function pauseAutoScroll() {
            isPaused = true;
        }
        
        function resumeAutoScroll() {
            isPaused = false;
        }
        
        // Обработчики событий для паузы при взаимодействии пользователя
        if (pauseOnHover) {
            // Пауза при касании/наведении
            container.addEventListener('touchstart', () => {
                userInteracted = true;
                container.classList.add('user-interacting');
                pauseAutoScroll();
            });
            
            container.addEventListener('touchend', () => {
                setTimeout(() => {
                    userInteracted = false;
                    container.classList.remove('user-interacting');
                    resumeAutoScroll();
                }, 2000); // Возобновляем через 2 секунды после окончания касания
            });
            
            // Пауза при ручной прокрутке
            let scrollTimeout;
            container.addEventListener('scroll', () => {
                if (!userInteracted) {
                    userInteracted = true;
                    container.classList.add('user-interacting');
                    pauseAutoScroll();
                }
                
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                    userInteracted = false;
                    container.classList.remove('user-interacting');
                    scrollPosition = container.scrollLeft;
                    resumeAutoScroll();
                }, 3000); // Возобновляем через 3 секунды после окончания ручной прокрутки
            });
            
            // Пауза когда страница не видна
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    pauseAutoScroll();
                } else {
                    resumeAutoScroll();
                }
            });
        }
        
        // Запускаем автопрокрутку с задержкой для загрузки контента
        setTimeout(() => {
            if (container.scrollWidth > container.clientWidth) {
                console.log('Запуск автопрокрутки для контейнера:', container.className);
                console.log('Ширина контента:', container.scrollWidth, 'Ширина видимой области:', container.clientWidth);
                startAutoScroll();
            } else {
                console.log('Автопрокрутка не нужна для контейнера:', container.className);
                console.log('Ширина контента:', container.scrollWidth, 'Ширина видимой области:', container.clientWidth);
            }
        }, 2000);
        
        // Возвращаем методы управления
        return {
            start: startAutoScroll,
            stop: stopAutoScroll,
            pause: pauseAutoScroll,
            resume: resumeAutoScroll
        };
    }
    
    // Инициализация автопрокрутки для секции ECOSYSTEM
    const ecosystemGrid = document.querySelector('#ecosystem .ecosystem-grid');
    if (ecosystemGrid) {
        // Ждем загрузки всех элементов перед инициализацией
        const initEcosystem = () => {
            if (!isMobileDevice()) {
                console.log('Автопрокрутка ECOSYSTEM отключена для десктопа');
                return;
            }
            
            console.log('Инициализация автопрокрутки ECOSYSTEM для мобильных устройств');
            const ecosystemAutoScroll = setupAutoScroll(ecosystemGrid, {
                speed: 0.5, // медленная прокрутка для лучшего восприятия
                pauseOnHover: true,
                direction: 'left',
                resetOnComplete: true
            });
            
            // Сохраняем ссылку для возможного управления
            window.ecosystemAutoScroll = ecosystemAutoScroll;
        };
        
        // Инициализация с задержкой для корректной работы
        if (document.readyState === 'complete') {
            setTimeout(initEcosystem, 1000);
        } else {
            window.addEventListener('load', () => setTimeout(initEcosystem, 1000));
        }
    }
    
    // Инициализация автопрокрутки для секции PARTNERSHIPS (MEGAMAFIA & MEGAFORGE)
    const partnershipsGrid = document.querySelector('#partnerships .partnerships-grid');
    if (partnershipsGrid) {
        // Ждем загрузки всех элементов перед инициализацией
        const initPartnerships = () => {
            if (!isMobileDevice()) {
                console.log('Автопрокрутка PARTNERSHIPS отключена для десктопа');
                return;
            }
            
            console.log('Инициализация автопрокрутки PARTNERSHIPS для мобильных устройств');
            const partnershipsAutoScroll = setupAutoScroll(partnershipsGrid, {
                speed: 0.4, // еще более медленная прокрутка для секции с меньшим количеством элементов
                pauseOnHover: true,
                direction: 'left',
                resetOnComplete: true
            });
            
            // Сохраняем ссылку для возможного управления
            window.partnershipsAutoScroll = partnershipsAutoScroll;
        };
        
        // Инициализация с задержкой для корректной работы
        if (document.readyState === 'complete') {
            setTimeout(initPartnerships, 1500);
        } else {
            window.addEventListener('load', () => setTimeout(initPartnerships, 1500));
        }
    }
    
    // Дополнительная проверка после полной загрузки страницы
    window.addEventListener('load', () => {
        // Перезапускаем автопрокрутку, если контент изменился после загрузки
        setTimeout(() => {
            if (window.ecosystemAutoScroll && ecosystemGrid) {
                if (ecosystemGrid.scrollWidth > ecosystemGrid.clientWidth) {
                    window.ecosystemAutoScroll.stop();
                    window.ecosystemAutoScroll.start();
                }
            }
            
            if (window.partnershipsAutoScroll && partnershipsGrid) {
                if (partnershipsGrid.scrollWidth > partnershipsGrid.clientWidth) {
                    window.partnershipsAutoScroll.stop();
                    window.partnershipsAutoScroll.start();
                }
            }
        }, 1000);
    });
    
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
                if (window.ecosystemAutoScroll && ecosystemGrid && ecosystemGrid.scrollWidth > ecosystemGrid.clientWidth) {
                    window.ecosystemAutoScroll.start();
                }
                if (window.partnershipsAutoScroll && partnershipsGrid && partnershipsGrid.scrollWidth > partnershipsGrid.clientWidth) {
                    window.partnershipsAutoScroll.start();
                }
            }, 500);
        }
    });
});