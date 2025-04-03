document.addEventListener('DOMContentLoaded', function() {
    // Инициализация GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);
    
    // Определяем, работаем ли на устройстве с низкой производительностью
    const isLowPerformanceDevice = detectLowPerformanceDevice();
    
    // Функция для проверки производительности устройства
    function detectLowPerformanceDevice() {
        const lowCPU = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4;
        const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        return lowCPU || isMobile;
    }
    
    // Устанавливаем начальные состояния для всех секций
    gsap.set(['#manifesto', '#collection', '#roadmap'], {
        opacity: 1,
        visibility: 'visible',
        display: 'block'
    });
    
    // Анимация для секции "О проекте"
    gsap.timeline({
        scrollTrigger: {
            trigger: "#about",
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none none",
            once: true
        }
    })
    .from("#about .section-heading", {
        y: 50,
        opacity: 0,
        duration: isLowPerformanceDevice ? 0.4 : 0.8
    })
    .from("#about .section-line", {
        width: 0,
        opacity: 0,
        duration: isLowPerformanceDevice ? 0.3 : 0.5
    }, "-=0.3")
    .from(".about-item", {
        y: 50,
        opacity: 0,
        stagger: isLowPerformanceDevice ? 0.1 : 0.2,
        duration: isLowPerformanceDevice ? 0.4 : 0.8,
        clearProps: "all"
    }, "-=0.2");
    
    // Анимация для секции манифеста
    gsap.timeline({
        scrollTrigger: {
            trigger: '#manifesto',
            start: 'top center',
            toggleActions: 'play none none none',
            once: true
        }
    })
    .from('#manifesto .terminal-container', {
        opacity: 0,
        y: 50,
        duration: isLowPerformanceDevice ? 0.6 : 1,
        ease: 'power2.out',
        clearProps: 'all'
    })
    .from('#manifesto .terminal-content', {
        opacity: 0,
        y: 30,
        duration: isLowPerformanceDevice ? 0.6 : 1,
        ease: 'power2.out',
        clearProps: 'all'
    }, '-=0.5');
    
    // Анимация для секции коллекции - уменьшаем количество анимаций для слабых устройств
    if (!isLowPerformanceDevice) {
        gsap.timeline({
            scrollTrigger: {
                trigger: '#collection',
                start: 'top center',
                toggleActions: 'play none none none',
                once: true
            }
        })
        .from('#collection .nft-card', {
            opacity: 0,
            y: 50,
            duration: 1,
            stagger: 0.2,
            ease: 'power2.out',
            clearProps: 'all'
        })
        .from('#collection .nft-card .nft-image', {
            opacity: 0,
            scale: 0.8,
            duration: 1,
            stagger: 0.2,
            ease: 'power2.out',
            clearProps: 'all'
        }, '-=0.5')
        .from('#collection .nft-card .nft-info', {
            opacity: 0,
            y: 20,
            duration: 0.8,
            stagger: 0.2,
            ease: 'power2.out',
            clearProps: 'all'
        }, '-=0.3');
    } else {
        // Упрощенная анимация для слабых устройств
        gsap.timeline({
            scrollTrigger: {
                trigger: '#collection',
                start: 'top center',
                toggleActions: 'play none none none',
                once: true
            }
        })
        .from('#collection .nft-card', {
            opacity: 0,
            y: 30,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power2.out',
            clearProps: 'all'
        });
    }
    
    // Анимация для секции дорожной карты
    gsap.timeline({
        scrollTrigger: {
            trigger: '#roadmap',
            start: 'top center',
            toggleActions: 'play none none none',
            once: true
        }
    })
    .from('#roadmap .roadmap-item', {
        opacity: 0,
        x: -50,
        duration: isLowPerformanceDevice ? 0.6 : 1,
        stagger: isLowPerformanceDevice ? 0.15 : 0.3,
        ease: 'power2.out',
        clearProps: 'all'
    })
    .from('#roadmap .roadmap-content', {
        opacity: 0,
        y: 30,
        duration: isLowPerformanceDevice ? 0.6 : 1,
        stagger: isLowPerformanceDevice ? 0.15 : 0.3,
        ease: 'power2.out',
        clearProps: 'all'
    }, '-=0.5');
    
    // Анимация иконок для дорожной карты только для мощных устройств
    if (!isLowPerformanceDevice) {
        gsap.timeline({
            scrollTrigger: {
                trigger: '#roadmap',
                start: 'top center',
                toggleActions: 'play none none none',
                once: true
            }
        })
        .from('#roadmap .roadmap-item .roadmap-icon', {
            opacity: 0,
            scale: 0,
            duration: 0.8,
            stagger: 0.3,
            ease: 'back.out(1.7)',
            clearProps: 'all'
        }, '-=0.3');
    }
    
    // Анимация для секции "Сообщество"
    gsap.timeline({
        scrollTrigger: {
            trigger: "#community",
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none none",
            once: true
        }
    })
    .from("#community .section-heading", {
        y: 50,
        opacity: 0,
        duration: isLowPerformanceDevice ? 0.4 : 0.8
    })
    .from("#community .section-line", {
        width: 0,
        opacity: 0,
        duration: isLowPerformanceDevice ? 0.3 : 0.5
    }, "-=0.3")
    .from(".twitter-feed", {
        x: -50,
        opacity: 0,
        duration: isLowPerformanceDevice ? 0.5 : 0.8,
        clearProps: 'all'
    }, "-=0.2")
    .from(".discord-community", {
        x: 50,
        opacity: 0,
        duration: isLowPerformanceDevice ? 0.5 : 0.8,
        clearProps: 'all'
    }, "-=0.8");
    
    // Анимация для секции "Подписка"
    gsap.timeline({
        scrollTrigger: {
            trigger: ".newsletter",
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none none",
            once: true
        }
    })
    .from(".newsletter .section-heading", {
        y: 50,
        opacity: 0,
        duration: isLowPerformanceDevice ? 0.4 : 0.8
    })
    .from(".newsletter .section-line", {
        width: 0,
        opacity: 0,
        duration: isLowPerformanceDevice ? 0.3 : 0.5
    }, "-=0.3")
    .from(".newsletter-content p, .newsletter-form", {
        y: 30,
        opacity: 0,
        duration: isLowPerformanceDevice ? 0.3 : 0.5,
        stagger: isLowPerformanceDevice ? 0.1 : 0.2,
        clearProps: 'all'
    }, "-=0.2");
    
    // Эффект появления для терминальных текстов - упрощаем для слабых устройств
    const terminalTexts = document.querySelectorAll('.terminal-text');
    
    // Ограничиваем количество активных терминальных текстов для слабых устройств
    const maxActiveTexts = isLowPerformanceDevice ? 4 : terminalTexts.length;
    
    terminalTexts.forEach((text, index) => {
        if (index < maxActiveTexts) {
            const originalText = text.textContent;
            text.textContent = '';
            
            ScrollTrigger.create({
                trigger: text,
                start: "top 90%",
                onEnter: () => {
                    // Ускоряем печать для слабых устройств
                    const typingSpeed = isLowPerformanceDevice ? 5 : 20;
                    
                    let i = 0;
                    const typeInterval = setInterval(() => {
                        if (i < originalText.length) {
                            // Для слабых устройств добавляем по нескольку символов за раз
                            const charsPerIteration = isLowPerformanceDevice ? 3 : 1;
                            const endIndex = Math.min(i + charsPerIteration, originalText.length);
                            text.textContent += originalText.substring(i, endIndex);
                            i = endIndex;
                        } else {
                            clearInterval(typeInterval);
                        }
                    }, typingSpeed);
                },
                once: true
            });
        } else if (isLowPerformanceDevice) {
            // Для остальных текстов на слабых устройствах просто показываем текст сразу
            ScrollTrigger.create({
                trigger: text,
                start: "top 90%",
                onEnter: () => {
                    text.style.opacity = 0;
                    gsap.to(text, {
                        opacity: 1,
                        duration: 0.5
                    });
                },
                once: true
            });
        }
    });
    
    // Оптимизированная функция для добавления случайных глюков
    function addRandomGlitches() {
        const glitchElements = document.querySelectorAll('.glitch-effect');
        let animationFrameId;
        
        // На слабых устройствах уменьшаем частоту обновления глюк-эффекта
        const glitchInterval = isLowPerformanceDevice ? 500 : 100;
        
        function updateGlitches() {
            glitchElements.forEach(element => {
                if (Math.random() > 0.95) {
                    element.classList.add('active-glitch');
                    setTimeout(() => {
                        element.classList.remove('active-glitch');
                    }, 200);
                }
            });
            
            setTimeout(() => {
                if (document.hidden) return;
                animationFrameId = requestAnimationFrame(updateGlitches);
            }, glitchInterval);
        }
        
        // Остановка анимации при неактивной вкладке
        document.addEventListener('visibilitychange', function() {
            if (document.hidden) {
                if (animationFrameId) {
                    cancelAnimationFrame(animationFrameId);
                    animationFrameId = null;
                }
            } else {
                if (!animationFrameId) {
                    animationFrameId = requestAnimationFrame(updateGlitches);
                }
            }
        });
        
        animationFrameId = requestAnimationFrame(updateGlitches);
    }
    
    // Запускаем глюк-эффект только если это не слабое устройство
    if (!isLowPerformanceDevice) {
        addRandomGlitches();
    }
    
    // Добавляем эффект активации для элементов при скролле с использованием IntersectionObserver
    const animElements = document.querySelectorAll('.terminal-container, .nft-card, .roadmap-item');
    
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: isLowPerformanceDevice ? 0.1 : 0.5 });
        
        animElements.forEach(element => {
            observer.observe(element);
        });
    } else {
        // Для браузеров, не поддерживающих IntersectionObserver
        animElements.forEach(element => {
            element.classList.add('active');
        });
    }
    
    // Параллакс эффект для фона - упрощаем на слабых устройствах
    if (!isLowPerformanceDevice) {
        gsap.to("#hero-animation", {
            scrollTrigger: {
                trigger: ".hero",
                start: "top top",
                end: "bottom top",
                scrub: true
            },
            y: 100,
            opacity: 0.5,
            ease: "none"
        });
    }
});
