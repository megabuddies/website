document.addEventListener('DOMContentLoaded', function() {
    // Проверяем, что мы на мобильном устройстве
    function isMobile() {
        return window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
    
    if (!isMobile()) return;

    // Настройки автопрокрутки
    const scrollSettings = {
        pauseOnInteraction: 4000, // Пауза после взаимодействия пользователя (мс)
        resetDelay: 200 // Задержка перед возобновлением анимации (мс)
    };

    // Функция для создания слайдера с автопрокруткой
    function createAutoScrollSlider(container, sliderClass, trackClass, animationClass) {
        if (!container) return null;

        // Создаем wrapper для слайдера
        const sliderWrapper = document.createElement('div');
        sliderWrapper.className = sliderClass;
        
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
        
        // Добавляем wrapper в контейнер
        container.appendChild(sliderWrapper);
        
        return { wrapper: sliderWrapper, track: sliderTrack };
    }

    // Функция для запуска CSS анимации
    function startCSSAnimation(track, animationClass) {
        if (!track) return;
        track.classList.add('animating');
        track.classList.remove('paused');
    }

    // Функция для паузы CSS анимации
    function pauseCSSAnimation(track) {
        if (!track) return;
        track.classList.add('paused');
    }

    // Функция для остановки CSS анимации
    function stopCSSAnimation(track) {
        if (!track) return;
        track.classList.remove('animating', 'paused');
    }

    // Функция для возобновления анимации после взаимодействия
    function resumeAnimationAfterInteraction(track, customPause = null) {
        pauseCSSAnimation(track);
        
        const pauseDuration = customPause || scrollSettings.pauseOnInteraction;
        
        setTimeout(() => {
            setTimeout(() => {
                startCSSAnimation(track);
            }, scrollSettings.resetDelay);
        }, pauseDuration);
    }

    // Функция для включения/выключения ручной прокрутки
    function toggleManualScroll(container, enable) {
        if (!container) return;
        
        if (enable) {
            container.classList.remove('auto-scroll');
            container.style.overflowX = 'auto';
        } else {
            container.classList.add('auto-scroll');
            container.style.overflowX = 'hidden';
        }
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

        let userInteracted = false;
        let interactionTimeout = null;

        // Функция для обработки взаимодействия пользователя
        function handleUserInteraction(customPause = null) {
            userInteracted = true;
            
            // Включаем ручную прокрутку
            toggleManualScroll(ecosystemContainer, true);
            stopCSSAnimation(slider.track);
            
            // Очищаем предыдущий таймаут
            if (interactionTimeout) {
                clearTimeout(interactionTimeout);
            }
            
            const pauseDuration = customPause || scrollSettings.pauseOnInteraction;
            
            // Устанавливаем новый таймаут для возобновления
            interactionTimeout = setTimeout(() => {
                userInteracted = false;
                toggleManualScroll(ecosystemContainer, false);
                setTimeout(() => {
                    startCSSAnimation(slider.track);
                }, scrollSettings.resetDelay);
            }, pauseDuration);
        }

        // Добавляем обработчики событий
        let touchStartTime = 0;
        
        ecosystemContainer.addEventListener('touchstart', (e) => {
            touchStartTime = Date.now();
            handleUserInteraction();
        }, { passive: true });

        ecosystemContainer.addEventListener('touchmove', (e) => {
            handleUserInteraction();
        }, { passive: true });

        ecosystemContainer.addEventListener('touchend', (e) => {
            const touchDuration = Date.now() - touchStartTime;
            if (touchDuration < 200) {
                // Быстрый тап - меньшая пауза
                handleUserInteraction(2000);
            }
        }, { passive: true });

        // Обработчик для обычной прокрутки
        let scrollTimeout;
        ecosystemContainer.addEventListener('scroll', () => {
            if (!userInteracted) {
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                    handleUserInteraction();
                }, 100);
            }
        }, { passive: true });

        // Запускаем автопрокрутку после загрузки
        setTimeout(() => {
            const rect = ecosystemContainer.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            
            if (isVisible) {
                toggleManualScroll(ecosystemContainer, false);
                startCSSAnimation(slider.track);
            } else {
                // Используем Intersection Observer для запуска при появлении
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting && !userInteracted) {
                            toggleManualScroll(ecosystemContainer, false);
                            startCSSAnimation(slider.track);
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

        let userInteracted = false;
        let interactionTimeout = null;

        // Функция для обработки взаимодействия пользователя
        function handleUserInteraction(customPause = null) {
            userInteracted = true;
            
            // Включаем ручную прокрутку
            toggleManualScroll(partnershipsContainer, true);
            stopCSSAnimation(slider.track);
            
            // Очищаем предыдущий таймаут
            if (interactionTimeout) {
                clearTimeout(interactionTimeout);
            }
            
            const pauseDuration = customPause || scrollSettings.pauseOnInteraction;
            
            // Устанавливаем новый таймаут для возобновления
            interactionTimeout = setTimeout(() => {
                userInteracted = false;
                toggleManualScroll(partnershipsContainer, false);
                setTimeout(() => {
                    startCSSAnimation(slider.track);
                }, scrollSettings.resetDelay);
            }, pauseDuration);
        }

        // Добавляем обработчики событий
        let touchStartTime = 0;
        
        partnershipsContainer.addEventListener('touchstart', (e) => {
            touchStartTime = Date.now();
            handleUserInteraction();
        }, { passive: true });

        partnershipsContainer.addEventListener('touchmove', (e) => {
            handleUserInteraction();
        }, { passive: true });

        partnershipsContainer.addEventListener('touchend', (e) => {
            const touchDuration = Date.now() - touchStartTime;
            if (touchDuration < 200) {
                // Быстрый тап - меньшая пауза
                handleUserInteraction(2000);
            }
        }, { passive: true });

        // Обработчик для обычной прокрутки
        let scrollTimeout;
        partnershipsContainer.addEventListener('scroll', () => {
            if (!userInteracted) {
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                    handleUserInteraction();
                }, 100);
            }
        }, { passive: true });

        // Запускаем автопрокрутку после загрузки
        setTimeout(() => {
            const rect = partnershipsContainer.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            
            if (isVisible) {
                toggleManualScroll(partnershipsContainer, false);
                startCSSAnimation(slider.track);
            } else {
                // Используем Intersection Observer для запуска при появлении
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting && !userInteracted) {
                            toggleManualScroll(partnershipsContainer, false);
                            startCSSAnimation(slider.track);
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
            if (ecosystemSlider) pauseCSSAnimation(ecosystemSlider.track);
            if (partnershipsSlider) pauseCSSAnimation(partnershipsSlider.track);
        } else {
            // Возобновляем анимации при возвращении на страницу
            setTimeout(() => {
                if (ecosystemSlider && ecosystemSlider.track.classList.contains('animating')) {
                    startCSSAnimation(ecosystemSlider.track);
                }
                if (partnershipsSlider && partnershipsSlider.track.classList.contains('animating')) {
                    startCSSAnimation(partnershipsSlider.track);
                }
            }, 500);
        }
    });

    // Обработка изменения размера окна (поворот устройства)
    window.addEventListener('resize', function() {
        setTimeout(() => {
            if (isMobile()) {
                // Перезапускаем анимации после изменения размера
                if (ecosystemSlider && ecosystemSlider.track.classList.contains('animating')) {
                    stopCSSAnimation(ecosystemSlider.track);
                    setTimeout(() => {
                        startCSSAnimation(ecosystemSlider.track);
                    }, 300);
                }
                
                if (partnershipsSlider && partnershipsSlider.track.classList.contains('animating')) {
                    stopCSSAnimation(partnershipsSlider.track);
                    setTimeout(() => {
                        startCSSAnimation(partnershipsSlider.track);
                    }, 500);
                }
            }
        }, 500);
    });
});