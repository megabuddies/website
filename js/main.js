document.addEventListener('DOMContentLoaded', function() {
    // Удаляем создание статического звездного фона
    // createStarfieldBackground();
    
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
        });
    });
    
    // Обновленная функция активации пунктов меню при скролле - активация при прокрутке 70% раздела
    function setActiveNavItem() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 150; // Уменьшаем это значение для более точной активации
        
        sections.forEach(section => {
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
    
    // Вызываем функцию при загрузке и скролле
    setActiveNavItem();
    window.addEventListener('scroll', setActiveNavItem);
    
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
            setInterval(function() {
                scrollArrow.classList.add('pulse');
                setTimeout(function() {
                    scrollArrow.classList.remove('pulse');
                }, 800);
            }, 2000);
        }
    }
    
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

        // ВАЖНО: Сначала сбрасываем отступы к базовым для корректного начального измерения
        const baseMargin = 300; // Базовый отступ из CSS
        megaTitle.style.marginRight = `${baseMargin}px`;
        buddiesTitle.style.marginLeft = `${baseMargin}px`;
        
        // Принудительный перерасчет layout перед измерением
        document.body.offsetHeight;
        
        // Измеряем текущие позиции после сброса к базовым отступам
        let megaRect = megaTitle.getBoundingClientRect();
        let buddiesRect = buddiesTitle.getBoundingClientRect();
        const heroRect = heroAnimation.getBoundingClientRect();
        
        // Вычисляем центр 3D модели
        const heroCenterX = heroRect.left + (heroRect.width / 2);
        
        // Вычисляем текущие расстояния с базовыми отступами
        let distanceToMegaEnd = heroCenterX - megaRect.right;
        let distanceToBuddiesStart = buddiesRect.left - heroCenterX;
        
        console.log('=== НАЧАЛЬНОЕ СОСТОЯНИЕ ===');
        console.log('Центр модели:', heroCenterX);
        console.log('Расстояние до конца MEGA:', distanceToMegaEnd);
        console.log('Расстояние до начала BUDDIES:', distanceToBuddiesStart);
        
        // Определяем целевое расстояние - усредненное между двумя + запас в 30px
        const targetDistance = Math.max(distanceToMegaEnd, distanceToBuddiesStart) + 30;
        
        // Устанавливаем новые отступы напрямую
        const megaNewMargin = baseMargin + (targetDistance - distanceToMegaEnd);
        const buddiesNewMargin = baseMargin + (targetDistance - distanceToBuddiesStart);
        
        megaTitle.style.marginRight = `${megaNewMargin}px`;
        buddiesTitle.style.marginLeft = `${buddiesNewMargin}px`;
        
        console.log('=== РАСЧЕТНЫЕ ОТСТУПЫ ===');
        console.log('Новый отступ MEGA:', megaNewMargin);
        console.log('Новый отступ BUDDIES:', buddiesNewMargin);
        
        // Проводим итеративную корректировку для максимальной точности
        setTimeout(() => {
            // Повторно измеряем после применения новых отступов
            megaRect = megaTitle.getBoundingClientRect();
            buddiesRect = buddiesTitle.getBoundingClientRect();
            
            // Повторно вычисляем расстояния
            distanceToMegaEnd = heroCenterX - megaRect.right;
            distanceToBuddiesStart = buddiesRect.left - heroCenterX;
            
            console.log('=== ПРОВЕРКА ПОСЛЕ КОРРЕКТИРОВКИ ===');
            console.log('Расстояние до конца MEGA:', distanceToMegaEnd);
            console.log('Расстояние до начала BUDDIES:', distanceToBuddiesStart);
            
            // Проверяем, все ли в порядке или нужна дополнительная корректировка
            const difference = Math.abs(distanceToMegaEnd - distanceToBuddiesStart);
            
            if (difference > 5) { // Если разница всё ещё более 5px, делаем финальную корректировку
                console.log('Требуется дополнительная корректировка, разница:', difference);
                
                if (distanceToMegaEnd < distanceToBuddiesStart) {
                    // Если расстояние до MEGA меньше, увеличиваем его отступ
                    const additionalMegaMargin = megaNewMargin + (distanceToBuddiesStart - distanceToMegaEnd);
                    megaTitle.style.marginRight = `${additionalMegaMargin}px`;
                    console.log('Окончательный отступ MEGA:', additionalMegaMargin);
                } else {
                    // Если расстояние до BUDDIES меньше, увеличиваем его отступ
                    const additionalBuddiesMargin = buddiesNewMargin + (distanceToMegaEnd - distanceToBuddiesStart);
                    buddiesTitle.style.marginLeft = `${additionalBuddiesMargin}px`;
                    console.log('Окончательный отступ BUDDIES:', additionalBuddiesMargin);
                }
                
                // Финальная проверка
                setTimeout(() => {
                    const finalMegaRect = megaTitle.getBoundingClientRect();
                    const finalBuddiesRect = buddiesTitle.getBoundingClientRect();
                    const finalDistanceToMegaEnd = heroCenterX - finalMegaRect.right;
                    const finalDistanceToBuddiesStart = finalBuddiesRect.left - heroCenterX;
                    
                    console.log('=== ФИНАЛЬНАЯ ПРОВЕРКА ===');
                    console.log('Финальное расстояние до MEGA:', finalDistanceToMegaEnd);
                    console.log('Финальное расстояние до BUDDIES:', finalDistanceToBuddiesStart);
                    console.log('Итоговая разница:', Math.abs(finalDistanceToMegaEnd - finalDistanceToBuddiesStart));
                }, 100);
            } else {
                console.log('Корректировка успешна, разница:', difference);
            }
        }, 200);
    }
    
    // Вызываем функцию на большее количество событий для надежности
    window.addEventListener('load', function() {
        setTimeout(adjustTextSpacing, 800);
    });
    
    window.addEventListener('resize', function() {
        setTimeout(adjustTextSpacing, 500);
    });
    
    // Запускаем несколько раз с разными задержками
    for (let delay of [500, 1000, 2000, 3000, 4000]) {
        setTimeout(adjustTextSpacing, delay);
    }
    
    // Проверяем загрузку всех ресурсов и запускаем выравнивание
    window.addEventListener('DOMContentLoaded', function() {
        setTimeout(adjustTextSpacing, 500);
    });
});

