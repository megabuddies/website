/**
 * partnerships-slider.js
 * Автопрокрутка для секции partnerships как в коллекции
 */

document.addEventListener('DOMContentLoaded', function() {
    // Проверка на мобильное устройство
    function isMobile() {
        return window.innerWidth <= 768;
    }
    
    // Инициализация автопрокрутки для partnerships
    function initPartnershipsSlider() {
        if (!isMobile()) return;
        
        const partnershipsGrid = document.querySelector('.partnerships-grid');
        if (!partnershipsGrid) return;
        
        // Получаем все карточки partnerships
        const partnershipCards = Array.from(partnershipsGrid.querySelectorAll('.partnership-card'));
        if (partnershipCards.length === 0) return;
        
        // Создаем структуру слайдера
        const sliderWrapper = document.createElement('div');
        sliderWrapper.className = 'slider-wrapper';
        
        const sliderTrack = document.createElement('div');
        sliderTrack.className = 'slider-track';
        
        // Клонируем карточки для бесконечной прокрутки
        partnershipCards.forEach(card => {
            const cardClone = card.cloneNode(true);
            sliderTrack.appendChild(cardClone);
        });
        
        // Добавляем дублирующий набор для плавной прокрутки
        partnershipCards.forEach(card => {
            const cardClone = card.cloneNode(true);
            sliderTrack.appendChild(cardClone);
        });
        
        // Очищаем оригинальный контейнер и добавляем слайдер
        partnershipsGrid.innerHTML = '';
        sliderWrapper.appendChild(sliderTrack);
        partnershipsGrid.appendChild(sliderWrapper);
        
        // Применяем CSS классы для анимации
        partnershipsGrid.classList.add('partnerships-slider-active');
        
        // Пауза анимации при взаимодействии пользователя
        let animationPaused = false;
        
        sliderTrack.addEventListener('mouseenter', () => {
            if (!animationPaused) {
                sliderTrack.style.animationPlayState = 'paused';
                animationPaused = true;
            }
        });
        
        sliderTrack.addEventListener('mouseleave', () => {
            if (animationPaused) {
                sliderTrack.style.animationPlayState = 'running';
                animationPaused = false;
            }
        });
        
        // Для сенсорных устройств
        sliderTrack.addEventListener('touchstart', () => {
            sliderTrack.style.animationPlayState = 'paused';
            animationPaused = true;
        });
        
        sliderTrack.addEventListener('touchend', () => {
            setTimeout(() => {
                sliderTrack.style.animationPlayState = 'running';
                animationPaused = false;
            }, 2000); // Возобновляем через 2 секунды после касания
        });
        
        // Остановка анимации при выходе со страницы
        document.addEventListener('visibilitychange', function() {
            if (document.hidden) {
                sliderTrack.style.animationPlayState = 'paused';
            } else if (!animationPaused) {
                sliderTrack.style.animationPlayState = 'running';
            }
        });
    }
    
    // Инициализация при загрузке
    initPartnershipsSlider();
    
    // Переинициализация при изменении размера окна
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            initPartnershipsSlider();
        }, 300);
    });
});