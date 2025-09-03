document.addEventListener('DOMContentLoaded', function() {
    // Проверяем, что мы на мобильном устройстве
    function isMobile() {
        return window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
    
    if (!isMobile()) return;

    let ecosystemAnimationId = null;
    let partnershipsAnimationId = null;
    let ecosystemUserInteracted = false;
    let partnershipsUserInteracted = false;

    // Настройки автопрокрутки
    const scrollSettings = {
        speed: 0.8, // Скорость прокрутки в пикселях за кадр
        pauseOnInteraction: 4000, // Пауза после взаимодействия пользователя (мс)
        resetDelay: 200 // Задержка перед возобновлением анимации (мс)
    };

    // Функция для автопрокрутки контейнера
    function startAutoScroll(container, animationIdRef, userInteractedRef) {
        if (!container) return;

        const maxScroll = container.scrollWidth - container.clientWidth;
        
        // Если нет контента для прокрутки, не запускаем анимацию
        if (maxScroll <= 0) return;

        let scrollPosition = container.scrollLeft;

        function animate() {
            // Проверяем, не взаимодействовал ли пользователь
            if (userInteractedRef.value) return;

            scrollPosition += scrollSettings.speed;
            
            // Если достигли конца, плавно возвращаемся к началу
            if (scrollPosition >= maxScroll) {
                scrollPosition = 0;
                container.scrollLeft = 0;
            } else {
                container.scrollLeft = scrollPosition;
            }
            
            animationIdRef.value = requestAnimationFrame(animate);
        }

        // Запускаем анимацию
        animationIdRef.value = requestAnimationFrame(animate);
    }

    // Функция для остановки автопрокрутки
    function stopAutoScroll(animationIdRef) {
        if (animationIdRef.value) {
            cancelAnimationFrame(animationIdRef.value);
            animationIdRef.value = null;
        }
    }

    // Функция для возобновления автопрокрутки после взаимодействия
    function resumeAutoScrollAfterInteraction(container, animationIdRef, userInteractedRef, customPause = null) {
        userInteractedRef.value = true;
        stopAutoScroll(animationIdRef);
        
        const pauseDuration = customPause || scrollSettings.pauseOnInteraction;
        
        setTimeout(() => {
            userInteractedRef.value = false;
            setTimeout(() => {
                startAutoScroll(container, animationIdRef, userInteractedRef);
            }, scrollSettings.resetDelay);
        }, pauseDuration);
    }

    // Инициализация автопрокрутки для ECOSYSTEM
    function initEcosystemAutoScroll() {
        const ecosystemContainer = document.querySelector('.ecosystem-grid');
        if (!ecosystemContainer) return;

        // Создаем ссылки на переменные для передачи по ссылке
        const ecosystemAnimationRef = { value: ecosystemAnimationId };
        const ecosystemUserInteractedRef = { value: ecosystemUserInteracted };

        // Добавляем обработчики событий для взаимодействия пользователя
        let touchStartTime = 0;
        
        ecosystemContainer.addEventListener('touchstart', (e) => {
            touchStartTime = Date.now();
            resumeAutoScrollAfterInteraction(ecosystemContainer, ecosystemAnimationRef, ecosystemUserInteractedRef);
        }, { passive: true });

        ecosystemContainer.addEventListener('touchmove', (e) => {
            resumeAutoScrollAfterInteraction(ecosystemContainer, ecosystemAnimationRef, ecosystemUserInteractedRef);
        }, { passive: true });

        ecosystemContainer.addEventListener('touchend', (e) => {
            // Проверяем, был ли это быстрый тап или длинное касание
            const touchDuration = Date.now() - touchStartTime;
            if (touchDuration < 200) {
                // Быстрый тап - меньшая пауза
                resumeAutoScrollAfterInteraction(ecosystemContainer, ecosystemAnimationRef, ecosystemUserInteractedRef, 2000);
            }
        }, { passive: true });

        // Обработчик для обычной прокрутки (например, мышью на планшете)
        let scrollTimeout;
        ecosystemContainer.addEventListener('scroll', () => {
            if (!ecosystemUserInteractedRef.value) {
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                    resumeAutoScrollAfterInteraction(ecosystemContainer, ecosystemAnimationRef, ecosystemUserInteractedRef);
                }, 100);
            }
        }, { passive: true });

        // Запускаем автопрокрутку после небольшой задержки, только если секция видима
        setTimeout(() => {
            // Проверяем, видима ли секция на экране
            const rect = ecosystemContainer.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            
            if (isVisible) {
                startAutoScroll(ecosystemContainer, ecosystemAnimationRef, ecosystemUserInteractedRef);
            } else {
                // Если секция не видима, используем Intersection Observer для запуска при появлении
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting && !ecosystemUserInteractedRef.value) {
                            startAutoScroll(ecosystemContainer, ecosystemAnimationRef, ecosystemUserInteractedRef);
                            observer.unobserve(entry.target);
                        }
                    });
                }, { threshold: 0.1 });
                
                observer.observe(ecosystemContainer);
            }
        }, 1000);

        // Синхронизируем переменные
        setInterval(() => {
            ecosystemAnimationId = ecosystemAnimationRef.value;
            ecosystemUserInteracted = ecosystemUserInteractedRef.value;
        }, 100);
    }

    // Инициализация автопрокрутки для MEGAMAFIA & MEGAFORGE
    function initPartnershipsAutoScroll() {
        const partnershipsContainer = document.querySelector('.partnerships-grid');
        if (!partnershipsContainer) return;

        // Создаем ссылки на переменные для передачи по ссылке
        const partnershipsAnimationRef = { value: partnershipsAnimationId };
        const partnershipsUserInteractedRef = { value: partnershipsUserInteracted };

        // Добавляем обработчики событий для взаимодействия пользователя
        let partnershipsTouchStartTime = 0;
        
        partnershipsContainer.addEventListener('touchstart', (e) => {
            partnershipsTouchStartTime = Date.now();
            resumeAutoScrollAfterInteraction(partnershipsContainer, partnershipsAnimationRef, partnershipsUserInteractedRef);
        }, { passive: true });

        partnershipsContainer.addEventListener('touchmove', (e) => {
            resumeAutoScrollAfterInteraction(partnershipsContainer, partnershipsAnimationRef, partnershipsUserInteractedRef);
        }, { passive: true });

        partnershipsContainer.addEventListener('touchend', (e) => {
            // Проверяем, был ли это быстрый тап или длинное касание
            const touchDuration = Date.now() - partnershipsTouchStartTime;
            if (touchDuration < 200) {
                // Быстрый тап - меньшая пауза
                resumeAutoScrollAfterInteraction(partnershipsContainer, partnershipsAnimationRef, partnershipsUserInteractedRef, 2000);
            }
        }, { passive: true });

        // Обработчик для обычной прокрутки (например, мышью на планшете)
        let partnershipsScrollTimeout;
        partnershipsContainer.addEventListener('scroll', () => {
            if (!partnershipsUserInteractedRef.value) {
                clearTimeout(partnershipsScrollTimeout);
                partnershipsScrollTimeout = setTimeout(() => {
                    resumeAutoScrollAfterInteraction(partnershipsContainer, partnershipsAnimationRef, partnershipsUserInteractedRef);
                }, 100);
            }
        }, { passive: true });

        // Запускаем автопрокрутку после небольшой задержки, только если секция видима
        setTimeout(() => {
            // Проверяем, видима ли секция на экране
            const rect = partnershipsContainer.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            
            if (isVisible) {
                startAutoScroll(partnershipsContainer, partnershipsAnimationRef, partnershipsUserInteractedRef);
            } else {
                // Если секция не видима, используем Intersection Observer для запуска при появлении
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting && !partnershipsUserInteractedRef.value) {
                            startAutoScroll(partnershipsContainer, partnershipsAnimationRef, partnershipsUserInteractedRef);
                            observer.unobserve(entry.target);
                        }
                    });
                }, { threshold: 0.1 });
                
                observer.observe(partnershipsContainer);
            }
        }, 1500); // Небольшая задержка относительно ecosystem

        // Синхронизируем переменные
        setInterval(() => {
            partnershipsAnimationId = partnershipsAnimationRef.value;
            partnershipsUserInteracted = partnershipsUserInteractedRef.value;
        }, 100);
    }

    // Остановка всех анимаций при скрытии страницы для экономии ресурсов
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            stopAutoScroll({ value: ecosystemAnimationId });
            stopAutoScroll({ value: partnershipsAnimationId });
        } else {
            // Возобновляем анимации, если пользователь не взаимодействовал недавно
            if (!ecosystemUserInteracted) {
                setTimeout(() => {
                    const ecosystemContainer = document.querySelector('.ecosystem-grid');
                    if (ecosystemContainer) {
                        const ecosystemAnimationRef = { value: ecosystemAnimationId };
                        const ecosystemUserInteractedRef = { value: ecosystemUserInteracted };
                        startAutoScroll(ecosystemContainer, ecosystemAnimationRef, ecosystemUserInteractedRef);
                    }
                }, 500);
            }
            
            if (!partnershipsUserInteracted) {
                setTimeout(() => {
                    const partnershipsContainer = document.querySelector('.partnerships-grid');
                    if (partnershipsContainer) {
                        const partnershipsAnimationRef = { value: partnershipsAnimationId };
                        const partnershipsUserInteractedRef = { value: partnershipsUserInteracted };
                        startAutoScroll(partnershipsContainer, partnershipsAnimationRef, partnershipsUserInteractedRef);
                    }
                }, 700);
            }
        }
    });

    // Инициализируем автопрокрутку для обеих секций
    initEcosystemAutoScroll();
    initPartnershipsAutoScroll();

    // Обработка изменения размера окна (поворот устройства)
    window.addEventListener('resize', function() {
        // Перезапускаем автопрокрутку после изменения размера
        setTimeout(() => {
            if (isMobile() && !ecosystemUserInteracted) {
                const ecosystemContainer = document.querySelector('.ecosystem-grid');
                if (ecosystemContainer) {
                    stopAutoScroll({ value: ecosystemAnimationId });
                    setTimeout(() => {
                        const ecosystemAnimationRef = { value: ecosystemAnimationId };
                        const ecosystemUserInteractedRef = { value: ecosystemUserInteracted };
                        startAutoScroll(ecosystemContainer, ecosystemAnimationRef, ecosystemUserInteractedRef);
                    }, 300);
                }
            }
            
            if (isMobile() && !partnershipsUserInteracted) {
                const partnershipsContainer = document.querySelector('.partnerships-grid');
                if (partnershipsContainer) {
                    stopAutoScroll({ value: partnershipsAnimationId });
                    setTimeout(() => {
                        const partnershipsAnimationRef = { value: partnershipsAnimationId };
                        const partnershipsUserInteractedRef = { value: partnershipsUserInteracted };
                        startAutoScroll(partnershipsContainer, partnershipsAnimationRef, partnershipsUserInteractedRef);
                    }, 500);
                }
            }
        }, 500);
    });

    // Остановка анимаций при уходе с страницы
    window.addEventListener('beforeunload', function() {
        stopAutoScroll({ value: ecosystemAnimationId });
        stopAutoScroll({ value: partnershipsAnimationId });
    });
});