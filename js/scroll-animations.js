document.addEventListener('DOMContentLoaded', function() {
    // Инициализация GSAP ScrollTrigger только для анимаций
    gsap.registerPlugin(ScrollTrigger);
    
    // Устанавливаем начальные состояния для всех секций
    gsap.set(['#manifesto', '#collection', '#roadmap', '#partnerships', '#community'], {
        opacity: 1,
        visibility: 'visible',
        display: 'block'
    });
    
    // Немедленно показываем основные элементы секций для предотвращения мигания
    gsap.set(['.section-heading', '.section-line', '.partnership-card', '.twitter-feed', '.telegram-feed'], {
        opacity: 1,
        visibility: 'visible'
    });
    
    // Анимация для секции "О проекте"
    gsap.timeline({
        scrollTrigger: {
            trigger: "#about",
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none none"
        }
    })
    .from("#about .section-heading", {
        y: 30,
        opacity: 0,
        duration: 0.4
    })
    .from("#about .section-line", {
        width: 0,
        opacity: 0,
        duration: 0.3
    }, "-=0.2")
    .from(".about-item", {
        y: 30,
        opacity: 0,
        stagger: 0.1,
        duration: 0.4
    }, "-=0.1");
    
    // Анимация для секции манифеста - ускоренная
    gsap.timeline({
        scrollTrigger: {
            trigger: '#manifesto',
            start: 'top 85%',
            toggleActions: 'play none none none',
            once: true
        }
    })
    .from('#manifesto .terminal-container', {
        opacity: 0,
        y: 30,
        duration: 0.5,
        ease: 'power2.out',
        clearProps: 'all'
    })
    .from('#manifesto .terminal-content', {
        opacity: 0,
        y: 20,
        duration: 0.4,
        ease: 'power2.out',
        clearProps: 'all'
    }, '-=0.3')
    .from('#manifesto .terminal-line', {
        opacity: 0,
        y: 15,
        duration: 0.3,
        stagger: 0.05,
        ease: 'power2.out',
        clearProps: 'all'
    }, '-=0.2');
    
    // Анимация для секции коллекции - ускоренная
    gsap.timeline({
        scrollTrigger: {
            trigger: '#collection',
            start: 'top 85%',
            toggleActions: 'play none none none',
            once: true
        }
    })
    .from('#collection .nft-card', {
        opacity: 0,
        y: 30,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power2.out',
        clearProps: 'all'
    })
    .from('#collection .nft-card .nft-image', {
        opacity: 0,
        scale: 0.9,
        duration: 0.4,
        stagger: 0.1,
        ease: 'power2.out',
        clearProps: 'all'
    }, '-=0.3')
    .from('#collection .nft-card .nft-info', {
        opacity: 0,
        y: 15,
        duration: 0.3,
        stagger: 0.1,
        ease: 'power2.out',
        clearProps: 'all'
    }, '-=0.2');
    
    // Анимация для секции дорожной карты - ускоренная версия
    gsap.timeline({
        scrollTrigger: {
            trigger: '#roadmap',
            start: 'top 80%',
            toggleActions: 'play none none none',
            once: true
        }
    })
    .from('#roadmap .roadmap-item', {
        opacity: 0,
        x: -30,
        duration: 0.4,
        stagger: 0.1,
        ease: 'power2.out',
        clearProps: 'all'
    })
    .from('#roadmap .roadmap-content', {
        opacity: 0,
        y: 20,
        duration: 0.4,
        stagger: 0.1,
        ease: 'power2.out',
        clearProps: 'all'
    }, '-=0.3')
    .from('#roadmap .roadmap-item .roadmap-icon', {
        opacity: 0,
        scale: window.innerWidth < 768 ? 1 : 0.8,
        x: window.innerWidth < 768 ? 0 : undefined,
        y: window.innerWidth < 768 ? 0 : undefined,
        duration: 0.3,
        stagger: 0.1,
        ease: 'back.out(1.7)',
        clearProps: window.innerWidth < 768 ? 'opacity' : 'all'
    }, '-=0.2');
    
    // Анимация для секции партнерств - ускоренная
    gsap.timeline({
        scrollTrigger: {
            trigger: '#partnerships',
            start: 'top 85%',
            toggleActions: 'play none none none',
            once: true
        }
    })
    .from('#partnerships .section-heading', {
        y: 30,
        opacity: 0,
        duration: 0.4,
        ease: 'power2.out',
        clearProps: 'all'
    })
    .from('#partnerships .section-line', {
        scaleX: 0,
        duration: 0.3,
        ease: 'power2.out',
        clearProps: 'all'
    }, '-=0.2')
    .from('.partnership-card', {
        opacity: 0,
        y: 30,
        duration: 0.5,
        stagger: 0.15,
        ease: 'power2.out',
        clearProps: 'all'
    }, '-=0.2')
    .from('.partnership-badge', {
        opacity: 0,
        scale: 0,
        duration: 0.4,
        stagger: 0.1,
        ease: 'back.out(1.7)',
        clearProps: 'all'
    }, '-=0.3')
    .from('.twitter-preview', {
        opacity: 0,
        y: 15,
        duration: 0.4,
        stagger: 0.1,
        ease: 'power2.out',
        clearProps: 'all'
    }, '-=0.2');
    
    // Анимация для секции "Сообщество" - ускоренная
    gsap.timeline({
        scrollTrigger: {
            trigger: "#community",
            start: "top 85%",
            end: "bottom 20%",
            toggleActions: "play none none none",
            once: true
        }
    })
    .from("#community .section-heading", {
        y: 30,
        opacity: 0,
        duration: 0.4
    })
    .from("#community .section-line", {
        width: 0,
        opacity: 0,
        duration: 0.3
    }, "-=0.2")
    .from(".twitter-feed, .telegram-feed", {
        y: 20,
        opacity: 0,
        duration: 0.4,
        stagger: 0.1,
        ease: 'power2.out'
    }, "-=0.1");
    

    
    // Эффект появления для терминальных текстов
    const terminalTexts = document.querySelectorAll('.terminal-text');
    
    terminalTexts.forEach((text, index) => {
        const originalText = text.textContent;
        text.textContent = '';
        
        ScrollTrigger.create({
            trigger: text,
            start: "top 90%",
            onEnter: () => {
                let i = 0;
                const typeInterval = setInterval(() => {
                    if (i < originalText.length) {
                        text.textContent += originalText.charAt(i);
                        i++;
                    } else {
                        clearInterval(typeInterval);
                    }
                }, 10);
            },
            once: true
        });
    });
    
    // Добавление случайных глюков к элементам
    function addRandomGlitches() {
        const glitchElements = document.querySelectorAll('.glitch-effect');
        
        glitchElements.forEach(element => {
            if (Math.random() > 0.95) {
                element.classList.add('active-glitch');
                setTimeout(() => {
                    element.classList.remove('active-glitch');
                }, 200);
            }
        });
        
        requestAnimationFrame(addRandomGlitches);
    }
    
    addRandomGlitches();
    
    // Добавляем эффект активации для элементов при скролле
    const animElements = document.querySelectorAll('.terminal-container, .nft-card, .roadmap-item');
    
    animElements.forEach(element => {
        ScrollTrigger.create({
            trigger: element,
            start: "top 85%",
            onEnter: () => {
                element.classList.add('active');
            },
            once: true
        });
    });
    
    // Параллакс эффект для фона
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
});
