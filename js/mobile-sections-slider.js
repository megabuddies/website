document.addEventListener('DOMContentLoaded', function() {
    // Функция для определения мобильного устройства
    function isMobile() {
        return window.innerWidth <= 768;
    }
    
    // Функция для настройки автопрокрутки
    function setupAutoScroll(sliderTrack, cardCount) {
        console.log(`Setting up autoscroll for track with classes: ${sliderTrack.className}`);
        
        // Определяем тип анимации на основе класса трека
        const isEcosystem = sliderTrack.classList.contains('ecosystem-slider-track');
        const isPartnerships = sliderTrack.classList.contains('partnerships-slider-track');
        
        console.log(`Track type - Ecosystem: ${isEcosystem}, Partnerships: ${isPartnerships}`);
        
        // Устанавливаем начальную позицию
        sliderTrack.style.transform = 'translateX(0)';
        
        // Сбрасываем любую предыдущую анимацию
        sliderTrack.style.animation = 'none';
        
        // Применяем CSS анимацию с небольшой задержкой
        setTimeout(() => {
            if (isEcosystem) {
                console.log('Applying ecosystem animation');
                sliderTrack.style.animation = 'ecosystemSlideAnimation 30s linear infinite';
            } else if (isPartnerships) {
                console.log('Applying partnerships animation');
                sliderTrack.style.animation = 'partnershipsSlideAnimation 25s linear infinite';
            } else {
                console.warn('Unknown track type, no animation applied');
            }
        }, 100);
    }
    
    // Функция для инициализации автопрокрутки для секции
    function initializeAutoScroll(sectionId, gridSelector, cardSelector, sliderWrapperClass, sliderTrackClass) {
        // Проверяем, что мы на мобильном устройстве
        if (!isMobile()) return;
        
        const section = document.getElementById(sectionId);
        if (!section) {
            console.warn(`Section ${sectionId} not found`);
            return;
        }
        
        const grid = section.querySelector(gridSelector);
        if (!grid) {
            console.warn(`Grid ${gridSelector} not found in section ${sectionId}`);
            return;
        }
        
        const cards = grid.querySelectorAll(cardSelector);
        if (cards.length === 0) {
            console.warn(`No cards ${cardSelector} found in grid ${gridSelector}`);
            return;
        }
        
        // Проверяем, не была ли уже инициализирована автопрокрутка
        if (grid.hasAttribute('data-autoscroll-initialized')) {
            console.log(`Auto-scroll already initialized for ${sectionId}`);
            return;
        }
        
        console.log(`Initializing auto-scroll for ${sectionId} with ${cards.length} cards`);
        
        // Создаем обертку для слайдера
        const sliderWrapper = document.createElement('div');
        sliderWrapper.className = sliderWrapperClass;
        console.log(`Created wrapper with class: ${sliderWrapperClass}`);
        
        // Создаем трек слайдера
        const sliderTrack = document.createElement('div');
        sliderTrack.className = sliderTrackClass;
        console.log(`Created track with class: ${sliderTrackClass}`);
        
        // Клонируем все карточки в трек
        cards.forEach(card => {
            const cardClone = card.cloneNode(true);
            sliderTrack.appendChild(cardClone);
        });
        
        // Добавляем дубликаты карточек для бесконечной прокрутки
        cards.forEach(card => {
            const cardClone = card.cloneNode(true);
            cardClone.classList.add('duplicate');
            sliderTrack.appendChild(cardClone);
        });
        
        // Вставляем трек в обертку
        sliderWrapper.appendChild(sliderTrack);
        
        // Заменяем оригинальную сетку на слайдер
        grid.style.display = 'none';
        grid.parentNode.insertBefore(sliderWrapper, grid.nextSibling);
        grid.setAttribute('data-autoscroll-initialized', 'true');
        
        // Запускаем автопрокрутку
        console.log(`Setting up auto-scroll for track with ${cards.length} cards`);
        setupAutoScroll(sliderTrack, cards.length);
        
        // Добавляем обработчик для паузы анимации при потере фокуса
        document.addEventListener('visibilitychange', function() {
            if (document.hidden) {
                sliderTrack.classList.add('paused');
            } else {
                sliderTrack.classList.remove('paused');
            }
        });
        
        // Добавляем обработчик изменения размера окна
        window.addEventListener('resize', function() {
            // Если переключились на десктоп, показываем оригинальную сетку
            if (!isMobile()) {
                grid.style.display = '';
                sliderWrapper.style.display = 'none';
            } else {
                grid.style.display = 'none';
                sliderWrapper.style.display = 'block';
            }
        });
    }
    
    // Функция для инициализации всех слайдеров
    function initializeAllSliders() {
        // Инициализируем слайдер для секции ECOSYSTEM
        initializeAutoScroll(
            'ecosystem',
            '.ecosystem-grid',
            '.ecosystem-card',
            'ecosystem-slider-wrapper',
            'ecosystem-slider-track'
        );
        
        // Инициализируем слайдер для секции PARTNERSHIPS (MEGAMAFIA & MEGAFORGE FAM)
        initializeAutoScroll(
            'partnerships',
            '.partnerships-grid',
            '.partnership-card',
            'partnerships-slider-wrapper',
            'partnerships-slider-track'
        );
    }
    
    // Отложенная инициализация для обеспечения полной загрузки страницы
    function deferredInitialization() {
        if (document.readyState === 'complete') {
            console.log('Document ready, initializing sliders...');
            initializeAllSliders();
        } else {
            console.log('Document not ready yet, waiting...');
            setTimeout(deferredInitialization, 500);
        }
    }
    
    // Запускаем отложенную инициализацию
    deferredInitialization();
    
    // Также инициализируем при полной загрузке страницы (backup)
    window.addEventListener('load', function() {
        console.log('Window loaded, ensuring sliders are initialized...');
        setTimeout(initializeAllSliders, 1000);
    });
    
    // Также инициализируем при изменении размера окна
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            // Перезапускаем инициализацию при изменении размера
            const existingWrappers = document.querySelectorAll('.ecosystem-slider-wrapper, .partnerships-slider-wrapper');
            existingWrappers.forEach(wrapper => wrapper.remove());
            
            initializeAllSliders();
        }, 250);
    });
});