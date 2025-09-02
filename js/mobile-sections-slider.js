document.addEventListener('DOMContentLoaded', function() {
    // Функция для определения мобильного устройства
    function isMobile() {
        return window.innerWidth <= 768;
    }
    
    // Функция для инициализации автопрокрутки для секции
    function initializeAutoScroll(sectionId, gridSelector, cardSelector, sliderWrapperClass, sliderTrackClass) {
        // Проверяем, что мы на мобильном устройстве
        if (!isMobile()) return;
        
        const section = document.getElementById(sectionId);
        if (!section) return;
        
        const grid = section.querySelector(gridSelector);
        if (!grid) return;
        
        const cards = grid.querySelectorAll(cardSelector);
        if (cards.length === 0) return;
        
        // Проверяем, не была ли уже инициализирована автопрокрутка
        if (grid.hasAttribute('data-autoscroll-initialized')) return;
        
        // Создаем обертку для слайдера
        const sliderWrapper = document.createElement('div');
        sliderWrapper.className = sliderWrapperClass;
        
        // Создаем трек слайдера
        const sliderTrack = document.createElement('div');
        sliderTrack.className = sliderTrackClass;
        
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
            initializeAllSliders();
        } else {
            setTimeout(deferredInitialization, 500);
        }
    }
    
    // Запускаем отложенную инициализацию
    deferredInitialization();
    
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