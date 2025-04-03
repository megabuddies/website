document.addEventListener('DOMContentLoaded', function() {
    // Проверяем, работаем ли мы на устройстве с низкой производительностью
    const isLowPerformanceDevice = detectLowPerformanceDevice();
    
    // Функция определения низкопроизводительных устройств
    function detectLowPerformanceDevice() {
        const lowCPU = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4;
        const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        return lowCPU || isMobile;
    }
    
    // Удаляем создание статического звездного фона
    // createStarfieldBackground();
    
    // Добавляем сканирующую линию для эффекта старого монитора
    const scanLine = document.createElement('div');
    scanLine.classList.add('scan-line');
    document.body.appendChild(scanLine);
    
    // Инициализация хедера с использованием IntersectionObserver вместо scroll event
    const header = document.querySelector('.main-header');
    if (header && 'IntersectionObserver' in window) {
        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            const headerObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) {
                        header.classList.add('header-scrolled');
                    } else {
                        header.classList.remove('header-scrolled');
                    }
                });
            }, { threshold: 0, rootMargin: '-50px 0px 0px 0px' });
            
            headerObserver.observe(heroSection);
        } else {
            // Запасной вариант, если секция не найдена
            window.addEventListener('scroll', throttle(() => {
                if (window.scrollY > 50) {
                    header.classList.add('header-scrolled');
                } else {
                    header.classList.remove('header-scrolled');
                }
            }, 100));
        }
    } else {
        // Запасной вариант для браузеров без поддержки IntersectionObserver
        window.addEventListener('scroll', throttle(() => {
            if (window.scrollY > 50) {
                header.classList.add('header-scrolled');
            } else {
                header.classList.remove('header-scrolled');
            }
        }, 100));
    }
    
    // Функция для ограничения частоты вызовов функции (throttle)
    function throttle(func, delay) {
        let lastCall = 0;
        return function(...args) {
            const now = new Date().getTime();
            if (now - lastCall >= delay) {
                lastCall = now;
                func.apply(this, args);
            }
        };
    }
    
    // Мобильное меню
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    
    mobileMenuToggle.addEventListener('click', () => {
        mobileMenuToggle.classList.toggle('active');
        mainNav.classList.toggle('active');
    });
    
    // Плавная прокрутка к разделам при нажатии на ссылки навигации
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                // Одинаковое поведение для всех разделов, включая roadmap
                window.scrollTo({
                    top: targetSection.offsetTop - 100, // Стандартный отступ для всех разделов
                    behavior: 'smooth'
                });
                
                // Закрываем мобильное меню при клике на ссылку
                if (mainNav.classList.contains('active')) {
                    mobileMenuToggle.classList.remove('active');
                    mainNav.classList.remove('active');
                }
            }
        });
    });
    
    // Обновленная функция активации пунктов меню при скролле с использованием IntersectionObserver
    if ('IntersectionObserver' in window) {
        const sections = document.querySelectorAll('section[id]');
        const navItems = document.querySelectorAll('.nav-item');
        
        const navObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navItems.forEach(item => {
                        item.classList.remove('active');
                    });
                    
                    const activeLink = document.querySelector(`.nav-item a[href="#${id}"]`);
                    if (activeLink) {
                        activeLink.parentElement.classList.add('active');
                    }
                }
            });
        }, { threshold: 0.3 });
        
        sections.forEach(section => {
            navObserver.observe(section);
        });
    } else {
        // Запасной вариант для браузеров без поддержки IntersectionObserver
        function setActiveNavItem() {
            const sections = document.querySelectorAll('section[id]');
            const scrollPosition = window.scrollY + 150;
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');
                
                if (scrollPosition >= sectionTop && scrollPosition < (sectionTop + sectionHeight)) {
                    document.querySelectorAll('.nav-item').forEach(item => {
                        item.classList.remove('active');
                    });
                    
                    const activeLink = document.querySelector(`.nav-item a[href="#${sectionId}"]`);
                    if (activeLink) {
                        activeLink.parentElement.classList.add('active');
                    }
                }
            });
        }
        
        setActiveNavItem();
        window.addEventListener('scroll', throttle(setActiveNavItem, 100));
    }
    
    // Оптимизированный эффект печатающегося текста для терминала
    if (!isLowPerformanceDevice) {
        function typeWriter(element, text, speed = 50) {
            let i = 0;
            element.innerHTML = '';
            
            function type() {
                if (i < text.length) {
                    const charsPerIteration = 1;
                    const endIndex = Math.min(i + charsPerIteration, text.length);
                    element.innerHTML += text.substring(i, endIndex);
                    i = endIndex;
                    setTimeout(type, speed);
                }
            }
            
            type();
        }
        
        // Применяем эффект печатающегося текста только к видимым элементам с помощью IntersectionObserver
        if ('IntersectionObserver' in window) {
            const terminalTexts = document.querySelectorAll('.terminal-text');
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const element = entry.target;
                        const originalText = element.textContent;
                        typeWriter(element, originalText);
                        observer.unobserve(element);
                    }
                });
            }, { threshold: 0.5 });
            
            terminalTexts.forEach(element => {
                const originalText = element.textContent;
                element.textContent = '';
                observer.observe(element);
            });
        }
    }
    
    // Добавление случайных глюков к тексту - только для мощных устройств
    if (!isLowPerformanceDevice) {
        let glitchAnimationId;
        
        function addRandomGlitches() {
            document.querySelectorAll('.glitch-text').forEach(element => {
                if (Math.random() > 0.95) {
                    element.classList.add('active-glitch');
                    setTimeout(() => {
                        element.classList.remove('active-glitch');
                    }, 200);
                }
            });
            
            if (!document.hidden) {
                glitchAnimationId = requestAnimationFrame(addRandomGlitches);
            }
        }
        
        // Останавливаем анимацию, когда страница не видна
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                if (glitchAnimationId) {
                    cancelAnimationFrame(glitchAnimationId);
                    glitchAnimationId = null;
                }
            } else if (!glitchAnimationId) {
                glitchAnimationId = requestAnimationFrame(addRandomGlitches);
            }
        });
        
        glitchAnimationId = requestAnimationFrame(addRandomGlitches);
    }
    
    // Фильтрация NFT карточек с оптимизацией
    const filterButtons = document.querySelectorAll('.filter-btn');
    const nftCards = document.querySelectorAll('.nft-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Удаляем активный класс со всех кнопок
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Добавляем активный класс на нажатую кнопку
            button.classList.add('active');
            
            const filter = button.getAttribute('data-filter');
            
            // Используем requestAnimationFrame для оптимизации DOM-операций
            requestAnimationFrame(() => {
                nftCards.forEach(card => {
                    if (filter === 'all' || card.getAttribute('data-rarity') === filter) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    });
    
    // Форма подписки на рассылку
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const email = newsletterForm.querySelector('input[type="email"]').value;
            
            if (email) {
                // Здесь будет код для отправки email на сервер
                alert('Спасибо за подписку! Мы будем держать вас в курсе последних новостей о революции Mega Buddies.');
                newsletterForm.reset();
            }
        });
    }
    
    // Добавляем "хакерский" эффект для кнопки подключения кошелька
    const walletBtn = document.querySelector('.wallet-btn');
    
    if (walletBtn) {
        walletBtn.addEventListener('click', function() {
            this.textContent = "Подключение...";
            this.classList.add('connecting');
            
            setTimeout(() => {
                this.textContent = "Взлом системы...";
            }, 1000);
            
            setTimeout(() => {
                this.textContent = "Доступ получен";
                this.classList.remove('connecting');
                this.classList.add('connected');
            }, 2000);
        });
    }

    // Добавляем эффект пиксельной анимации для логотипа - только для мощных устройств
    const logo = document.querySelector('.logo img');
    if (logo && !isLowPerformanceDevice) {
        logo.addEventListener('mouseover', () => {
            logo.style.imageRendering = 'pixelated';
            logo.style.transform = 'scale(1.1)';
        });
        logo.addEventListener('mouseout', () => {
            logo.style.imageRendering = 'auto';
            logo.style.transform = 'scale(1)';
        });
    }

    // Добавляем эффект "глитча" для заголовков секций - только для мощных устройств
    if (!isLowPerformanceDevice) {
        const sectionHeadings = document.querySelectorAll('.section-heading');
        sectionHeadings.forEach(heading => {
            heading.addEventListener('mouseover', () => {
                heading.classList.add('glitch-effect');
            });
            heading.addEventListener('mouseout', () => {
                heading.classList.remove('glitch-effect');
            });
        });
    }

    // Анимация появления элементов при скролле с использованием IntersectionObserver
    if ('IntersectionObserver' in window) {
        const animatedElements = document.querySelectorAll('.about-item, .nft-card, .roadmap-item');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    // Отключаем наблюдение после активации
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        animatedElements.forEach(element => {
            observer.observe(element);
        });
    } else {
        // Запасной вариант для браузеров без поддержки IntersectionObserver
        document.querySelectorAll('.about-item, .nft-card, .roadmap-item').forEach(element => {
            element.classList.add('animate-in');
        });
    }

    // Код для скролла вниз при нажатии на индикатор скролла
    const scrollIndicator = document.querySelector('.scroll-indicator');
    
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function() {
            const aboutSection = document.getElementById('about');
            
            if (aboutSection) {
                window.scrollTo({
                    top: aboutSection.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
        
        // Добавляем пульсирующий эффект для привлечения внимания
        const scrollArrow = document.querySelector('.scroll-arrow');
        if (scrollArrow) {
            // На слабых устройствах отключаем интервал
            const pulseInterval = isLowPerformanceDevice ? 3000 : 2000;
            setInterval(function() {
                scrollArrow.classList.add('pulse');
                setTimeout(function() {
                    scrollArrow.classList.remove('pulse');
                }, 800);
            }, pulseInterval);
        }
    }
    
    // Добавляем эффект для статистических показателей только для мощных устройств
    if (!isLowPerformanceDevice) {
        const statValues = document.querySelectorAll('.stat-value');
        
        statValues.forEach(statValue => {
            statValue.addEventListener('mouseover', function() {
                this.classList.add('neon-flicker');
            });
            
            statValue.addEventListener('mouseout', function() {
                this.classList.remove('neon-flicker');
            });
        });
    }
    
    // Эффект параллакса для заголовка - только для мощных устройств
    const heroContent = document.querySelector('.hero-content');
    
    if (heroContent && !isLowPerformanceDevice) {
        document.addEventListener('mousemove', throttle(function(e) {
            const xPos = (e.clientX / window.innerWidth - 0.5) * 10;
            const yPos = (e.clientY / window.innerHeight - 0.5) * 5;
            
            // Используем transform с will-change для оптимизации рендеринга
            heroContent.style.transform = `translate(${xPos * 0.3}px, ${yPos * 0.3}px)`;
            
            // Добавляем эффект движения 3D модели при движении мыши
            const heroAnimation = document.getElementById('hero-animation');
            if (heroAnimation) {
                heroAnimation.style.transform = `translate(${-xPos * 0.1}px, ${-yPos * 0.1}px)`;
            }
        }, 16)); // ~60fps
    }
    
    // Анимация набора числа для статистики при скролле
    if ('IntersectionObserver' in window) {
        const heroStatsSection = document.querySelector('.hero-stats');
        
        if (heroStatsSection) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateStatValues();
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: isLowPerformanceDevice ? 0.1 : 0.5 });
            
            observer.observe(heroStatsSection);
        }
    }
    
    // Оптимизированная анимация чисел
    const animateStatValues = function() {
        const stats = document.querySelectorAll('.stat-value');
        
        stats.forEach(stat => {
            const targetValue = stat.textContent;
            const isNumeric = !isNaN(parseFloat(targetValue));
            
            // Если это числовое значение
            if (isNumeric) {
                let start = 0;
                const end = parseFloat(targetValue);
                // Уменьшаем длительность анимации для слабых устройств
                const duration = isLowPerformanceDevice ? 1000 : 2000;
                const startTime = new Date().getTime();
                
                const animateValue = function() {
                    const currentTime = new Date().getTime();
                    const elapsed = currentTime - startTime;
                    
                    if (elapsed > duration) {
                        stat.textContent = targetValue;
                        return;
                    }
                    
                    // Используем более плавную функцию анимации
                    const progress = elapsed / duration;
                    const easedProgress = 1 - Math.pow(1 - progress, 3); // Кубическая функция замедления
                    const currentValue = Math.round(end * easedProgress);
                    
                    stat.textContent = currentValue + (targetValue.includes('%') ? '%' : '');
                    
                    requestAnimationFrame(animateValue);
                };
                
                stat.textContent = '0' + (targetValue.includes('%') ? '%' : '');
                animateValue();
            }
        });
    };

    // Анимация кнопок при наведении - только для мощных устройств
    if (!isLowPerformanceDevice) {
        const buttons = document.querySelectorAll('.neon-button');
        
        buttons.forEach(button => {
            button.addEventListener('mouseover', function() {
                this.classList.add('neon-pulse');
            });
            
            button.addEventListener('mouseout', function() {
                this.classList.remove('neon-pulse');
            });
        });
    }

    // Улучшенная функция выравнивания текста с кэшированием DOM-элементов и дебаунсингом
    let megaTitle, buddiesTitle, heroAnimation;
    
    function adjustTextSpacing() {
        if (!megaTitle) megaTitle = document.querySelector('.hero-title.mega');
        if (!buddiesTitle) buddiesTitle = document.querySelector('.hero-title.buddies');
        if (!heroAnimation) heroAnimation = document.getElementById('hero-animation');
        const viewportWidth = window.innerWidth;
        
        if (!megaTitle || !buddiesTitle || !heroAnimation) {
            return;
        }
        
        // На мобильных устройствах не применяем динамическую регулировку
        if (viewportWidth <= 768) {
            megaTitle.style.marginRight = '0';
            buddiesTitle.style.marginLeft = '0';
            return;
        }

        // Получаем текущие размеры и позиции элементов
        const megaRect = megaTitle.getBoundingClientRect();
        const buddiesRect = buddiesTitle.getBoundingClientRect();
        const heroRect = heroAnimation.getBoundingClientRect();
        
        // Вычисляем центр 3D модели
        const heroCenterX = heroRect.left + (heroRect.width / 2);
        
        // Вычисляем текущие расстояния от центра модели до конца MEGA и начала BUDDIES
        const distanceToMegaEnd = heroCenterX - megaRect.right;
        const distanceToBuddiesStart = buddiesRect.left - heroCenterX;
        
        // Проверяем, нужна ли корректировка (разница больше 10px)
        if (Math.abs(distanceToMegaEnd - distanceToBuddiesStart) > 10) {
            // Получаем текущие значения margin из CSS
            const currentMegaMargin = parseInt(window.getComputedStyle(megaTitle).marginRight) || 0;
            const currentBuddiesMargin = parseInt(window.getComputedStyle(buddiesTitle).marginLeft) || 0;
            
            // Вычисляем целевое расстояние (max + небольшой запас)
            const targetDistance = Math.max(distanceToMegaEnd, distanceToBuddiesStart) + 20;
            
            // Корректируем отступы для достижения равных расстояний
            if (distanceToMegaEnd < targetDistance) {
                const newMegaMargin = currentMegaMargin + (targetDistance - distanceToMegaEnd);
                megaTitle.style.marginRight = `${newMegaMargin}px`;
            }
            
            if (distanceToBuddiesStart < targetDistance) {
                const newBuddiesMargin = currentBuddiesMargin + (targetDistance - distanceToBuddiesStart);
                buddiesTitle.style.marginLeft = `${newBuddiesMargin}px`;
            }
        }
    }
    
    // Функция для дебаунсинга (защита от частых вызовов функции)
    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            const context = this;
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                func.apply(context, args);
            }, wait);
        };
    }
    
    // Дебаунсим функцию выравнивания текста
    const debouncedAdjustTextSpacing = debounce(adjustTextSpacing, 200);
    
    // Вызываем функцию после полной загрузки страницы
    window.addEventListener('load', function() {
        // Более длительная задержка для гарантии, что ThreeJS полностью инициализирован
        setTimeout(adjustTextSpacing, 500);
    });
    
    // Вызываем функцию при изменении размера окна с дебаунсингом
    window.addEventListener('resize', debouncedAdjustTextSpacing);
    
    // Запускаем один раз с задержкой для гарантии применения
    setTimeout(adjustTextSpacing, 500);
});

