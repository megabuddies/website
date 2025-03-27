document.addEventListener('DOMContentLoaded', function() {
    const categories = ['all', 'common', 'rare', 'legendary'];
    let currentCategory = null;
    let globalAnimationId = null;
    let sliderTrackElements = {};
    
    // Улучшенная функция инициализации контейнеров - ленивая загрузка
    function initializeContainers() {
        // Устанавливаем фиксированную высоту для всех контейнеров
        const fixedHeight = 450;
        
        // Скрываем все контейнеры
        document.querySelectorAll('.nft-grid').forEach(grid => {
            grid.style.minHeight = `${fixedHeight}px`;
            grid.style.height = `${fixedHeight}px`;
            grid.style.display = 'none';
            grid.style.opacity = '0';
        });
        
        // Загружаем только активную категорию при старте
        const activeBtn = document.querySelector('.filter-btn.active');
        if (activeBtn) {
            const initialCategory = activeBtn.getAttribute('data-filter') || 'all';
            loadImagesForCategory(initialCategory);
        }
    }
    
    // Кэшируем карточки для улучшения производительности
    const cardCache = {};
    
    // Функция создания карточек для категории
    function createCardsForCategory(category) {
        // Если карточки уже созданы, возвращаем из кэша
        if (cardCache[category]) {
            return cardCache[category];
        }
        
        const cards = [];
        
        // Создаем только 10 карточек вместо 15
        for (let i = 1; i <= 10; i++) {
            const imgIndex = i > 5 ? i % 5 + 1 : i; // Если у нас меньше 5 изображений, циклически повторяем
            
            const nftCard = document.createElement('div');
            nftCard.className = 'nft-card';
            nftCard.setAttribute('data-rarity', category === 'all' ? ['common', 'rare', 'legendary'][Math.floor(Math.random() * 3)] : category);
            
            // Используем одинаковое изображение nft1.jpg для всех карточек
            const imgPath = 'images/nft1.jpg';
            
            nftCard.innerHTML = `
                <div class="nft-image-container">
                    <img src="${imgPath}" alt="Mega Buddy #${imgIndex}" class="nft-image">
                </div>
                <div class="nft-info">
                    <h3 class="nft-name">${getNftName(category, imgIndex)}</h3>
                    <p class="nft-rarity">${getRarityText(category === 'all' ? nftCard.getAttribute('data-rarity') : category)}</p>
                    <p class="nft-price">${getNftPrice(category === 'all' ? nftCard.getAttribute('data-rarity') : category)}</p>
                </div>
            `;
            
            cards.push(nftCard);
        }
        
        // Сохраняем созданные карточки в кэше
        cardCache[category] = cards;
        
        return cards;
    }
    
    // Функция для загрузки контента категории
    function loadImagesForCategory(category) {
        // Если уже выбрана эта категория, ничего не делаем
        if (category === currentCategory) return;
        
        // Обновляем текущую категорию
        currentCategory = category;
        
        // Останавливаем анимацию
        stopAnimation();
        
        // Получаем все grid-контейнеры и текущий контейнер
        const allContainers = document.querySelectorAll('.nft-grid');
        const container = document.querySelector(`.nft-grid[data-category="${category}"]`);
        
        if (!container) return;
        
        // Скрываем все контейнеры
        allContainers.forEach(grid => {
            grid.style.opacity = '0';
            
            // Сразу скрываем неактивные контейнеры для экономии ресурсов
            if (grid !== container) {
                setTimeout(() => {
                    grid.style.display = 'none';
                }, 300);
            }
        });
        
        // Настраиваем текущий контейнер и запускаем анимацию
        setTimeout(() => {
            setupSlider(container, category);
            
            container.style.display = 'flex';
            container.style.opacity = '1';
        }, 300);
    }
    
    // Подготовка слайдера более эффективным способом
    function setupSlider(container, category) {
        // Очищаем контейнер
        container.innerHTML = '';
        
        // Создаем необходимые элементы
        const sliderWrapper = document.createElement('div');
        sliderWrapper.className = 'slider-wrapper';
        
        const sliderTrack = document.createElement('div');
        sliderTrack.className = 'slider-track';
        
        // Создаем карточки и дублируем их всего один раз (вместо трех)
        const cards = createCardsForCategory(category);
        
        // Добавляем оригинальный набор карточек
        cards.forEach(card => {
            sliderTrack.appendChild(card.cloneNode(true));
        });
        
        // Добавляем дублирующий набор для бесконечной прокрутки
        // (только один дубликат вместо трех, что значительно уменьшает нагрузку)
        cards.forEach(card => {
            sliderTrack.appendChild(card.cloneNode(true));
        });
        
        // Сохраняем ссылку на sliderTrack для дальнейшего использования
        sliderTrackElements[category] = sliderTrack;
        
        // Собираем слайдер
        sliderWrapper.appendChild(sliderTrack);
        container.appendChild(sliderWrapper);
        
        // Запускаем CSS-анимацию вместо JavaScript для лучшей производительности
        startCSSAnimation(category);
    }
    
    // Функция для запуска CSS-анимации
    function startCSSAnimation(category) {
        const sliderTrack = sliderTrackElements[category];
        if (!sliderTrack) return;
        
        // Определяем ширину анимации на основе количества карточек
        const cards = createCardsForCategory(category);
        const cardWidth = 250; // Ширина карточки в px из CSS
        const gap = 25; // Расстояние между карточками в px из CSS
        const animationDistance = cards.length * (cardWidth + gap);
        
        // Задаем CSS-переменные для анимации
        sliderTrack.style.setProperty('--slide-distance', `${animationDistance}px`);
        
        // Добавляем класс с анимацией
        sliderTrack.classList.add('auto-scroll-animation');
    }
    
    // Функция остановки анимации
    function stopAnimation() {
        // Останавливаем JavaScript-анимацию, если она запущена
        if (globalAnimationId) {
            cancelAnimationFrame(globalAnimationId);
            globalAnimationId = null;
        }
        
        // Удаляем CSS-анимацию со всех треков
        Object.values(sliderTrackElements).forEach(track => {
            if (track) {
                track.classList.remove('auto-scroll-animation');
            }
        });
    }
    
    // Функция для получения названия NFT (оптимизирована)
    function getNftName(category, index) {
        const names = {
            'common': ['HACKER BUDDY', 'CRYPTO NEWBIE', 'DIGITAL REBEL', 'CODE WARRIOR', 'PIXEL PUNK'],
            'rare': ['CRYPTO PUNK', 'BLOCKCHAIN WIZARD', 'TOKEN MASTER', 'DEFI GURU', 'HASH HUNTER'],
            'legendary': ['REBEL BUDDY', 'REVOLUTION LEAD', 'CRYPTO KING', 'MEGA MASTER', 'GENESIS ONE']
        };
        
        if (category === 'all') {
            const allNames = [...names.common, ...names.rare, ...names.legendary];
            return allNames[index % allNames.length];
        }
        
        return names[category][index % names[category].length];
    }
    
    // Функция для получения текста редкости (оптимизирована)
    function getRarityText(rarity) {
        const rarityTexts = {
            'common': 'Обычный',
            'rare': 'Редкий',
            'legendary': 'Легендарный'
        };
        
        return rarityTexts[rarity] || 'Обычный';
    }
    
    // Функция для получения цены NFT (оптимизирована)
    function getNftPrice(rarity) {
        const prices = {
            'common': '0.1 ETH',
            'rare': '0.3 ETH',
            'legendary': '0.5 ETH'
        };
        
        return prices[rarity] || '0.1 ETH';
    }
    
    // Инициализируем контейнеры
    initializeContainers();
    
    // Обрабатываем клики по кнопкам фильтра
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const newCategory = this.getAttribute('data-filter');
            
            // Если уже выбрана эта категория, ничего не делаем
            if (newCategory === currentCategory) return;
            
            // Удаляем класс active у всех кнопок
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            
            // Добавляем класс active текущей кнопке
            this.classList.add('active');
            
            // Загружаем изображения для выбранной категории
            loadImagesForCategory(newCategory);
        });
    });
});
