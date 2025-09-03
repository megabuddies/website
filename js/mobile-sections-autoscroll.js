document.addEventListener('DOMContentLoaded', function() {
    // Проверяем, что мы на мобильном устройстве
    function isMobile() {
        return window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
    
    if (!isMobile()) return;

    // Настройки автопрокрутки
    const scrollSettings = {
        pauseOnInteraction: 4000, // Пауза после взаимодействия пользователя (мс)
        quickTapPause: 2000 // Пауза для быстрых тапов (мс)
    };

    // Функция для создания слайдера с автопрокруткой
    function createAutoScrollSlider(container, wrapperClass, trackClass) {
        if (!container) return null;

        // Создаем wrapper для слайдера
        const sliderWrapper = document.createElement('div');
        sliderWrapper.className = wrapperClass;
        
        // Создаем track для карточек
        const sliderTrack = document.createElement('div');
        sliderTrack.className = trackClass;
        
        // Перемещаем все карточки в track
        const cards = Array.from(container.children);
        cards.forEach(card => {
            sliderTrack.appendChild(card);
        });
        
        // Дублируем карточки для бесконечной прокрутки
        cards.forEach(card => {
            const clonedCard = card.cloneNode(true);
            sliderTrack.appendChild(clonedCard);
        });
        
        // Добавляем track в wrapper
        sliderWrapper.appendChild(sliderTrack);
        
        // Очищаем контейнер и добавляем wrapper
        container.innerHTML = '';
        container.appendChild(sliderWrapper);
        
        return { wrapper: sliderWrapper, track: sliderTrack, originalCards: cards };
    }

    // Функция для запуска CSS анимации
    function startAnimation(track, animationName, duration) {
        if (!track) return;
        
        // Сбрасываем анимацию
        track.style.animation = 'none';
        track.style.transform = 'translateX(0)';
        
        // Запускаем новую анимацию с небольшой задержкой
        setTimeout(() => {
            track.style.animation = `${animationName} ${duration}s linear infinite`;
        }, 10);
    }

    // Функция для остановки CSS анимации и включения ручной прокрутки
    function enableManualScroll(container, track) {
        if (!container || !track) return;
        
        // Останавливаем CSS анимацию
        track.style.animation = 'none';
        track.style.transform = 'translateX(0)';
        
        // Включаем обычную прокрутку для контейнера
        container.style.overflowX = 'auto';
        container.style.scrollBehavior = 'smooth';
    }

    // Функция для отключения ручной прокрутки и включения автоанимации
    function enableAutoScroll(container, track, animationName, duration) {
        if (!container || !track) return;
        
        // Отключаем ручную прокрутку
        container.style.overflowX = 'hidden';
        container.scrollLeft = 0;
        
        // Запускаем CSS анимацию
        startAnimation(track, animationName, duration);
    }

    // Функция для обработки пользовательского взаимодействия
    function handleUserInteraction(container, track, animationName, duration, pauseDuration = null) {
        if (!container || !track) return;
        
        // Включаем ручную прокрутку
        enableManualScroll(container, track);
        
        const pause = pauseDuration || scrollSettings.pauseOnInteraction;
        
        // Возобновляем автопрокрутку через указанное время
        setTimeout(() => {
            enableAutoScroll(container, track, animationName, duration);
        }, pause);
    }

    // Инициализация автопрокрутки для ECOSYSTEM
    function initEcosystemAutoScroll() {
        const ecosystemContainer = document.querySelector('.ecosystem-grid');
        if (!ecosystemContainer) return;

        // Создаем слайдер
        const slider = createAutoScrollSlider(
            ecosystemContainer, 
            'ecosystem-slider-wrapper', 
            'ecosystem-slider-track'
        );
        
        if (!slider) return;

        let isUserInteracting = false;
        let interactionTimeout = null;

        // Функция для обработки взаимодействия
        function onUserInteraction(pauseDuration = null) {
            if (interactionTimeout) {
                clearTimeout(interactionTimeout);
            }
            
            isUserInteracting = true;
            handleUserInteraction(
                ecosystemContainer, 
                slider.track, 
                'ecosystemSlideAnimation', 
                20, 
                pauseDuration
            );
            
            // Сбрасываем флаг взаимодействия
            interactionTimeout = setTimeout(() => {
                isUserInteracting = false;
            }, pauseDuration || scrollSettings.pauseOnInteraction);
        }

        // Добавляем обработчики событий
        let touchStartTime = 0;
        
        ecosystemContainer.addEventListener('touchstart', (e) => {
            touchStartTime = Date.now();
            onUserInteraction();
        }, { passive: true });

        ecosystemContainer.addEventListener('touchmove', (e) => {
            if (!isUserInteracting) {
                onUserInteraction();
            }
        }, { passive: true });

        ecosystemContainer.addEventListener('touchend', (e) => {
            const touchDuration = Date.now() - touchStartTime;
            const pauseDuration = touchDuration < 200 ? scrollSettings.quickTapPause : scrollSettings.pauseOnInteraction;
            onUserInteraction(pauseDuration);
        }, { passive: true });

        // Запускаем автопрокрутку после загрузки
        setTimeout(() => {
            const rect = ecosystemContainer.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            
            if (isVisible) {
                enableAutoScroll(ecosystemContainer, slider.track, 'ecosystemSlideAnimation', 20);
            } else {
                // Используем Intersection Observer для запуска при появлении
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting && !isUserInteracting) {
                            enableAutoScroll(ecosystemContainer, slider.track, 'ecosystemSlideAnimation', 20);
                            observer.unobserve(entry.target);
                        }
                    });
                }, { threshold: 0.1 });
                
                observer.observe(ecosystemContainer);
            }
        }, 1000);

        return slider;
    }

    // Инициализация автопрокрутки для MEGAMAFIA & MEGAFORGE
    function initPartnershipsAutoScroll() {
        const partnershipsContainer = document.querySelector('.partnerships-grid');
        if (!partnershipsContainer) return;

        // Создаем слайдер
        const slider = createAutoScrollSlider(
            partnershipsContainer, 
            'partnerships-slider-wrapper', 
            'partnerships-slider-track'
        );
        
        if (!slider) return;

        let isUserInteracting = false;
        let interactionTimeout = null;

        // Функция для обработки взаимодействия
        function onUserInteraction(pauseDuration = null) {
            if (interactionTimeout) {
                clearTimeout(interactionTimeout);
            }
            
            isUserInteracting = true;
            handleUserInteraction(
                partnershipsContainer, 
                slider.track, 
                'partnershipsSlideAnimation', 
                12, 
                pauseDuration
            );
            
            // Сбрасываем флаг взаимодействия
            interactionTimeout = setTimeout(() => {
                isUserInteracting = false;
            }, pauseDuration || scrollSettings.pauseOnInteraction);
        }

        // Добавляем обработчики событий
        let touchStartTime = 0;
        
        partnershipsContainer.addEventListener('touchstart', (e) => {
            touchStartTime = Date.now();
            onUserInteraction();
        }, { passive: true });

        partnershipsContainer.addEventListener('touchmove', (e) => {
            if (!isUserInteracting) {
                onUserInteraction();
            }
        }, { passive: true });

        partnershipsContainer.addEventListener('touchend', (e) => {
            const touchDuration = Date.now() - touchStartTime;
            const pauseDuration = touchDuration < 200 ? scrollSettings.quickTapPause : scrollSettings.pauseOnInteraction;
            onUserInteraction(pauseDuration);
        }, { passive: true });

        // Запускаем автопрокрутку после загрузки
        setTimeout(() => {
            const rect = partnershipsContainer.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            
            if (isVisible) {
                enableAutoScroll(partnershipsContainer, slider.track, 'partnershipsSlideAnimation', 12);
            } else {
                // Используем Intersection Observer для запуска при появлении
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting && !isUserInteracting) {
                            enableAutoScroll(partnershipsContainer, slider.track, 'partnershipsSlideAnimation', 12);
                            observer.unobserve(entry.target);
                        }
                    });
                }, { threshold: 0.1 });
                
                observer.observe(partnershipsContainer);
            }
        }, 1500);

        return slider;
    }

    // Инициализируем слайдеры
    const ecosystemSlider = initEcosystemAutoScroll();
    const partnershipsSlider = initPartnershipsAutoScroll();

    // Остановка анимаций при скрытии страницы для экономии ресурсов
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            if (ecosystemSlider) ecosystemSlider.track.style.animationPlayState = 'paused';
            if (partnershipsSlider) partnershipsSlider.track.style.animationPlayState = 'paused';
        } else {
            // Возобновляем анимации при возвращении на страницу
            setTimeout(() => {
                if (ecosystemSlider) ecosystemSlider.track.style.animationPlayState = 'running';
                if (partnershipsSlider) partnershipsSlider.track.style.animationPlayState = 'running';
            }, 500);
        }
    });

    // Обработка изменения размера окна (поворот устройства)
    window.addEventListener('resize', function() {
        setTimeout(() => {
            if (isMobile()) {
                // Перезапускаем анимации после изменения размера
                if (ecosystemSlider) {
                    enableAutoScroll(ecosystemSlider.wrapper.parentElement, ecosystemSlider.track, 'ecosystemSlideAnimation', 20);
                }
                
                if (partnershipsSlider) {
                    enableAutoScroll(partnershipsSlider.wrapper.parentElement, partnershipsSlider.track, 'partnershipsSlideAnimation', 12);
                }
            }
        }, 500);
    });
});