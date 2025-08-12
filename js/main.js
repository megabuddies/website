document.addEventListener('DOMContentLoaded', function() {
    // Получаем элемент прелоадера
    const preloader = document.getElementById('preloader');
    const progressBar = document.querySelector('#preloader .progress');
    const terminalText = document.querySelector('#preloader .terminal-text');
    const pixelOverlay = document.querySelector('#preloader .pixel-overlay');
    let loadingProgress = 0;
    
    // Создаем пиксельный эффект для оверлея
    function createPixelOverlay() {
        if (!pixelOverlay) return;
        
        const gridSize = 4;
        for (let i = 0; i < 32; i++) {
            for (let j = 0; j < 6; j++) {
                const pixel = document.createElement('div');
                pixel.style.position = 'absolute';
                pixel.style.width = gridSize + 'px';
                pixel.style.height = gridSize + 'px';
                pixel.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                pixel.style.left = (i * gridSize) + 'px';
                pixel.style.top = (j * gridSize) + 'px';
                pixel.style.opacity = Math.random() > 0.7 ? '0.5' : '0';
                
                // Случайная анимация мерцания
                if (Math.random() > 0.5) {
                    pixel.style.animation = `pixelFlicker ${(Math.random() * 3 + 1)}s infinite`;
                }
                
                pixelOverlay.appendChild(pixel);
            }
        }
    }
    
    // Вызываем создание пиксельного оверлея
    createPixelOverlay();
    
    // Массив сообщений загрузки для имитации реального процесса
    const loadingMessages = [
        'Loading 3D model...',
        'Initializing environment...',
        'Preparing visual effects...',
        'Loading NFT collection...',
        'Synchronizing with blockchain...',
        'Verifying connection security...',
        'Launching additional resources...',
        'Almost ready...'
    ];
    
    // Функция для обновления прогресса загрузки
    function updateProgress(progress) {
        loadingProgress = progress;
        // Используем steps для пиксельной анимации прогресса
        progressBar.style.width = `${Math.floor(Math.min(loadingProgress, 95) / 5) * 5}%`;
        
        // Обновляем текст терминала в зависимости от прогресса
        const messageIndex = Math.floor((loadingProgress / 100) * loadingMessages.length);
        if (messageIndex < loadingMessages.length) {
            terminalText.innerHTML = `<span class="terminal-prompt">&gt;</span> ${loadingMessages[messageIndex]}`;
        }
    }
    
    // Начальное значение прогресса
    updateProgress(5);
    
    // Отслеживаем прогресс загрузки ресурсов
    const resourcesTotal = document.images.length + document.scripts.length + document.styleSheets.length;
    let resourcesLoaded = 0;
    
    // Функция для увеличения счетчика загруженных ресурсов
    function incrementResourcesLoaded() {
        resourcesLoaded++;
        const percentLoaded = Math.min(75, Math.floor((resourcesLoaded / resourcesTotal) * 75));
        updateProgress(percentLoaded);
    }
    
    // Обработчики загрузки изображений
    Array.from(document.images).forEach(img => {
        if (img.complete) {
            incrementResourcesLoaded();
        } else {
            img.addEventListener('load', incrementResourcesLoaded);
            img.addEventListener('error', incrementResourcesLoaded);
        }
    });
    
    // Для скриптов и стилей используем интервал, симулирующий загрузку
    const progressInterval = setInterval(() => {
        if (loadingProgress < 75) {
            // Увеличиваем прогресс шагами по 5% для пиксельного эффекта
            updateProgress(Math.ceil(loadingProgress / 5) * 5 + 5);
        } else {
            clearInterval(progressInterval);
        }
    }, 250);
    
    // Добавляем CSS для анимации пикселей
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pixelFlicker {
            0%, 100% { opacity: 0; }
            50% { opacity: 0.5; }
        }
    `;
    document.head.appendChild(style);
    
    // Скрываем прелоадер после начальной загрузки и показываем контент
    window.addEventListener('load', function() {
        // Добавляем задержку перед скрытием прелоадера для завершения загрузки модели (увеличена на 5 секунд)
        setTimeout(() => {
            // Плавно завершаем загрузку от текущего значения до 100% шагами по 5%
            const completeInterval = setInterval(() => {
                if (loadingProgress < 100) {
                    updateProgress(Math.ceil(loadingProgress / 5) * 5 + 5);
                } else {
                    clearInterval(completeInterval);
                    
                    // Отображаем финальное сообщение
                    terminalText.innerHTML = '<span class="terminal-prompt" style="color: #5f5;">&gt;</span> <span style="color: #5f5;">Loading complete. Launching system...</span>';
                    
                    setTimeout(() => {
                        preloader.classList.remove('active');
                        preloader.classList.add('hidden');
                        
                        // Разрешаем скролл после скрытия прелоадера
                        document.body.style.overflow = 'auto';
                    }, 800);
                }
            }, 150);
        }, 6000);
    });
    
    // Запрещаем скролл пока прелоадер активен
    document.body.style.overflow = 'hidden';
    
    // Добавляем сканирующую линию для эффекта старого монитора
    const scanLine = document.createElement('div');
    scanLine.classList.add('scan-line');
    document.body.appendChild(scanLine);
    
    // Инициализация хедера
    const header = document.querySelector('.main-header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }
    });
    
    // Мобильное меню
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navList = document.querySelector('.nav-list');
    const navItems = document.querySelectorAll('.nav-item');
    const body = document.body;
    
    // Добавляем индексы для анимации элементов меню
    navItems.forEach((item, index) => {
        item.style.setProperty('--item-index', index);
    });
    
    // Функция для определения, является ли устройство мобильным
    function isMobile() {
        return window.innerWidth <= 768;
    }
    
    // Улучшенная обработка мобильного меню
    mobileMenuToggle.addEventListener('click', () => {
        mobileMenuToggle.classList.toggle('active');
        navList.classList.toggle('active');
        
        // Блокируем прокрутку страницы при открытом меню
        if (navList.classList.contains('active')) {
            body.style.overflow = 'hidden';
        } else {
            body.style.overflow = 'auto';
        }
    });
    
    // Закрытие мобильного меню при клике за его пределами
    document.addEventListener('click', (e) => {
        if (isMobile() && 
            navList.classList.contains('active') && 
            !navList.contains(e.target) && 
            !mobileMenuToggle.contains(e.target)) {
            
            mobileMenuToggle.classList.remove('active');
            navList.classList.remove('active');
            body.style.overflow = 'auto';
        }
    });
    
    // Плавная прокрутка к разделам при нажатии на ссылки навигации
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Не блокируем внешние ссылки
            if (this.classList.contains('external-link') || this.getAttribute('href').startsWith('http')) {
                return;
            }
            
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                // Отступ с учетом мобильной версии
                const offset = isMobile() ? 70 : 100;
                
                window.scrollTo({
                    top: targetSection.offsetTop - offset,
                    behavior: 'smooth'
                });
            }
            
            // Закрываем мобильное меню при клике на ссылку
            if (isMobile() && navList.classList.contains('active')) {
                mobileMenuToggle.classList.remove('active');
                navList.classList.remove('active');
                body.style.overflow = 'auto';
            }
        });
    });
    
    // Обновленная функция активации пунктов меню при скролле - активация при прокрутке 70% раздела
    function setActiveNavItem() {
        const sections = document.querySelectorAll('section[id], .hero[id]');
        const scrollPosition = window.scrollY + 150; // Уменьшаем это значение для более точной активации
        
        // Обработка первой секции (hero)
        const heroSection = document.querySelector('.hero');
        if (heroSection && heroSection.id) {
            const heroTop = heroSection.offsetTop;
            const heroHeight = heroSection.offsetHeight;
            
            // Если мы в начале страницы, активируем первую секцию
            if (scrollPosition < (heroTop + heroHeight * 0.7)) {
                document.querySelectorAll('.nav-item').forEach(item => {
                    item.classList.remove('active');
                });
                
                const heroLink = document.querySelector(`.nav-item a[href="#${heroSection.id}"]`);
                if (heroLink) {
                    heroLink.parentElement.classList.add('active');
                }
                
                // Выходим из функции, так как уже активировали нужный пункт
                return;
            }
        }
        
        // Основная логика для других секций
        sections.forEach((section, index) => {
            // Пропускаем hero секцию, так как уже обработали её выше
            if (section.classList.contains('hero')) return;
            
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            // Активируем следующий раздел, когда прокручено 70% текущего раздела (остается 30%)
            // Точка, когда пользователь прокрутил 70% текущего раздела
            const activationThreshold = sectionTop + (sectionHeight * 0.7);
            
            // Проверяем, находимся ли мы после точки активации, но до конца текущего раздела
            if (scrollPosition >= activationThreshold && scrollPosition < (sectionTop + sectionHeight)) {
                // Если мы в последних 30% раздела, активируем следующую кнопку
                const nextSection = section.nextElementSibling;
                if (nextSection && nextSection.id) {
                    document.querySelectorAll('.nav-item').forEach(item => {
                        item.classList.remove('active');
                    });
                    
                    const activeLink = document.querySelector(`.nav-item a[href="#${nextSection.id}"]`);
                    if (activeLink) {
                        activeLink.parentElement.classList.add('active');
                    }
                }
            } 
            // Если мы не в последних 30% раздела, активируем текущую кнопку
            else if (scrollPosition >= sectionTop && scrollPosition < activationThreshold) {
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
    
    // Вызываем функцию при скролле
    window.addEventListener('scroll', setActiveNavItem);
    
    // Также вызываем функцию при загрузке страницы
    window.addEventListener('load', setActiveNavItem);
    
    // Обработка ориентации экрана для мобильных устройств
    function handleOrientationChange() {
        const html = document.documentElement;
        
        if (window.innerHeight < window.innerWidth) {
            // Ландшафтная ориентация
            html.classList.add('landscape');
            html.classList.remove('portrait');
        } else {
            // Портретная ориентация
            html.classList.add('portrait');
            html.classList.remove('landscape');
        }
    }
    
    // Запускаем проверку ориентации при загрузке и изменении размера окна
    window.addEventListener('load', handleOrientationChange);
    window.addEventListener('resize', handleOrientationChange);
    window.addEventListener('orientationchange', handleOrientationChange);
    
    // Обработчик для индикатора прокрутки
    const scrollIndicator = document.getElementById('scroll-down');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function() {
            const aboutSection = document.getElementById('about');
            if (aboutSection) {
                // Отступ с учетом мобильной версии
                const offset = isMobile() ? 70 : 100;
                
                window.scrollTo({
                    top: aboutSection.offsetTop - offset,
                    behavior: 'smooth'
                });
            }
        });
    }
    
    // Эффект печатающегося текста для терминала
    function typeWriter(element, text, speed = 50) {
        let i = 0;
        element.innerHTML = '';
        
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        
        type();
    }
    
    // Применяем эффект печатающегося текста к элементам с классом terminal-text
    document.querySelectorAll('.terminal-text').forEach(element => {
        const originalText = element.textContent;
        element.textContent = '';
        
        // Создаем наблюдатель для запуска анимации при появлении элемента в видимой области
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    typeWriter(element, originalText);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(element);
    });
    
    // Добавление случайных глюков к тексту
    function addRandomGlitches() {
        document.querySelectorAll('.glitch-text').forEach(element => {
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
    
    // Фильтрация NFT карточек
    const filterButtons = document.querySelectorAll('.filter-btn');
    const nftCards = document.querySelectorAll('.nft-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Удаляем активный класс со всех кнопок
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Добавляем активный класс на нажатую кнопку
            button.classList.add('active');
            
            const filter = button.getAttribute('data-filter');
            
            nftCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-rarity') === filter) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
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

    // Добавляем эффект пиксельной анимации для логотипа
    const logo = document.querySelector('.logo img');
    if (logo) {
        logo.addEventListener('mouseover', () => {
            logo.style.imageRendering = 'pixelated';
            logo.style.transform = 'scale(1.1)';
        });
        logo.addEventListener('mouseout', () => {
            logo.style.imageRendering = 'auto';
            logo.style.transform = 'scale(1)';
        });
    }

    // Добавляем эффект "глитча" для заголовков секций
    const sectionHeadings = document.querySelectorAll('.section-heading');
    sectionHeadings.forEach(heading => {
        heading.addEventListener('mouseover', () => {
            heading.classList.add('glitch-effect');
        });
        heading.addEventListener('mouseout', () => {
            heading.classList.remove('glitch-effect');
        });
    });

    // Анимация появления элементов при скролле
    const animatedElements = document.querySelectorAll('.about-item, .nft-card, .roadmap-item');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, { threshold: 0.1 });

    animatedElements.forEach(element => {
        observer.observe(element);
    });
    
    // Добавляем эффект для статистических показателей
    const statValues = document.querySelectorAll('.stat-value');
    
    statValues.forEach(statValue => {
        statValue.addEventListener('mouseover', function() {
            this.classList.add('neon-flicker');
        });
        
        statValue.addEventListener('mouseout', function() {
            this.classList.remove('neon-flicker');
        });
    });
    
    // Эффект параллакса для заголовка
    const heroContent = document.querySelector('.hero-content');
    
    if (heroContent) {
        document.addEventListener('mousemove', function(e) {
            const xPos = (e.clientX / window.innerWidth - 0.5) * 10;
            const yPos = (e.clientY / window.innerHeight - 0.5) * 5;
            
            // Без задней плитки делаем менее явный эффект параллакса
            heroContent.style.transform = `translate(${xPos * 0.3}px, ${yPos * 0.3}px)`;
            
            // Добавляем эффект движения 3D модели при движении мыши
            const heroAnimation = document.getElementById('hero-animation');
            if (heroAnimation) {
                heroAnimation.style.transform = `translate(${-xPos * 0.1}px, ${-yPos * 0.1}px)`;
            }
        });
    }
    
    // Анимация набора числа для статистики при скролле
    const animateStatValues = function() {
        const stats = document.querySelectorAll('.stat-value');
        
        stats.forEach(stat => {
            const targetValue = stat.textContent;
            const isNumeric = !isNaN(parseFloat(targetValue));
            
            // Если это числовое значение
            if (isNumeric) {
                let start = 0;
                const end = parseFloat(targetValue);
                const duration = 2000;
                const startTime = new Date().getTime();
                
                const animateValue = function() {
                    const currentTime = new Date().getTime();
                    const elapsed = currentTime - startTime;
                    
                    if (elapsed > duration) {
                        stat.textContent = targetValue;
                        return;
                    }
                    
                    const progress = elapsed / duration;
                    const currentValue = Math.round(end * progress);
                    
                    stat.textContent = currentValue + (targetValue.includes('%') ? '%' : '');
                    
                    requestAnimationFrame(animateValue);
                };
                
                stat.textContent = '0' + (targetValue.includes('%') ? '%' : '');
                animateValue();
            }
        });
    };
    
    // Запускаем анимацию при скролле к секции
    const heroStatsSection = document.querySelector('.hero-stats');
    
    if (heroStatsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateStatValues();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(heroStatsSection);
    }

    // Анимация кнопок при наведении
    const buttons = document.querySelectorAll('.neon-button');
    
    buttons.forEach(button => {
        button.addEventListener('mouseover', function() {
            this.classList.add('neon-pulse');
        });
        
        button.addEventListener('mouseout', function() {
            this.classList.remove('neon-pulse');
        });
    });

    // Precise spacing adjustment between MEGA and BUDDIES
    function adjustTextSpacing() {
        const megaTitle = document.querySelector('.hero-title.mega');
        const buddiesTitle = document.querySelector('.hero-title.buddies');
        const heroAnimation = document.getElementById('hero-animation');
        const viewportWidth = window.innerWidth;
        
        if (!megaTitle || !buddiesTitle || !heroAnimation) {
            console.log('Не найдены все необходимые элементы для выравнивания');
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
        
        // Выводим логи для отладки
        console.log('=== ДИАГНОСТИКА ВЫРАВНИВАНИЯ ===');
        console.log('Ширина окна:', viewportWidth);
        console.log('Центр модели X:', heroCenterX);
        console.log('MEGA право:', megaRect.right);
        console.log('BUDDIES лево:', buddiesRect.left);
        console.log('Расстояние до конца MEGA:', distanceToMegaEnd);
        console.log('Расстояние до начала BUDDIES:', distanceToBuddiesStart);
        
        // Проверяем, нужна ли корректировка (разница больше 10px)
        if (Math.abs(distanceToMegaEnd - distanceToBuddiesStart) > 10) {
            console.log('Требуется корректировка отступов...');
            
            // Получаем текущие значения margin из CSS
            const currentMegaMargin = parseInt(window.getComputedStyle(megaTitle).marginRight) || 0;
            const currentBuddiesMargin = parseInt(window.getComputedStyle(buddiesTitle).marginLeft) || 0;
            
            console.log('Текущие отступы: MEGA:', currentMegaMargin, 'BUDDIES:', currentBuddiesMargin);
            
            // Вычисляем целевое расстояние (max + небольшой запас)
            const targetDistance = Math.max(distanceToMegaEnd, distanceToBuddiesStart) + 20;
            
            // Корректируем отступы для достижения равных расстояний
            if (distanceToMegaEnd < targetDistance) {
                const newMegaMargin = currentMegaMargin + (targetDistance - distanceToMegaEnd);
                megaTitle.style.marginRight = `${newMegaMargin}px`;
                console.log('Новый отступ MEGA:', newMegaMargin);
            }
            
            if (distanceToBuddiesStart < targetDistance) {
                const newBuddiesMargin = currentBuddiesMargin + (targetDistance - distanceToBuddiesStart);
                buddiesTitle.style.marginLeft = `${newBuddiesMargin}px`;
                console.log('Новый отступ BUDDIES:', newBuddiesMargin);
            }
            
            // Проверяем результаты корректировки
            setTimeout(() => {
                const finalMegaRect = megaTitle.getBoundingClientRect();
                const finalBuddiesRect = buddiesTitle.getBoundingClientRect();
                const finalDistanceToMegaEnd = heroCenterX - finalMegaRect.right;
                const finalDistanceToBuddiesStart = finalBuddiesRect.left - heroCenterX;
                
                console.log('=== ИТОГОВАЯ ПРОВЕРКА ===');
                console.log('Итоговое расстояние до MEGA:', finalDistanceToMegaEnd);
                console.log('Итоговое расстояние до BUDDIES:', finalDistanceToBuddiesStart);
                console.log('Разница расстояний:', Math.abs(finalDistanceToMegaEnd - finalDistanceToBuddiesStart));
            }, 100);
        } else {
            console.log('Корректировка не требуется, разница менее 10px');
        }
    }
    
    // Вызываем функцию после полной загрузки страницы
    window.addEventListener('load', function() {
        // Более длительная задержка для гарантии, что ThreeJS полностью инициализирован
        setTimeout(adjustTextSpacing, 500);
    });
    
    // Вызываем функцию при изменении размера окна
    window.addEventListener('resize', function() {
        setTimeout(adjustTextSpacing, 500);
    });
    
    // Запускаем несколько раз с разными задержками для гарантии применения
    // после загрузки всех ресурсов, включая шрифты и 3D-модель
    setTimeout(adjustTextSpacing, 500);
    setTimeout(adjustTextSpacing, 1500);
    setTimeout(adjustTextSpacing, 3000); // Длительная задержка для гарантии
});

