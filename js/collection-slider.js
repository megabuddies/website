document.addEventListener('DOMContentLoaded', function() {
    const categories = ['all', 'common', 'rare', 'legendary'];
    
    // Функция для загрузки изображений для каждой категории
    function loadImagesForCategory(category) {
        // Скрываем все grid-контейнеры
        document.querySelectorAll('.nft-grid').forEach(grid => {
            grid.style.display = 'none';
        });
        
        // Показываем только активный grid-контейнер
        const container = document.querySelector(`.nft-grid[data-category="${category}"]`);
        if (!container) return;
        
        container.style.display = 'flex';
        
        // Очищаем контейнер перед добавлением новых изображений
        container.innerHTML = '';
        
        // Добавляем минимум 15 изображений для каждой категории
        for (let i = 1; i <= 15; i++) {
            const imgIndex = i > 10 ? i % 10 + 1 : i; // Если у нас меньше 15 изображений, циклически повторяем
            
            const nftCard = document.createElement('div');
            nftCard.className = 'nft-card';
            nftCard.setAttribute('data-rarity', category === 'all' ? ['common', 'rare', 'legendary'][Math.floor(Math.random() * 3)] : category);
            
            // Используем одинаковое изображение nft1.jpg для всех карточек во всех категориях
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
            
            container.appendChild(nftCard);
        }
        
        // Настраиваем автоматическую прокрутку
        setupAutoScroll(container);
    }
    
    // Функция для получения названия NFT
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
    
    // Функция для получения текста редкости
    function getRarityText(rarity) {
        const rarityTexts = {
            'common': 'Обычный',
            'rare': 'Редкий',
            'legendary': 'Легендарный'
        };
        
        return rarityTexts[rarity] || 'Обычный';
    }
    
    // Функция для получения цены NFT
    function getNftPrice(rarity) {
        const prices = {
            'common': '0.1 ETH',
            'rare': '0.3 ETH',
            'legendary': '0.5 ETH'
        };
        
        return prices[rarity] || '0.1 ETH';
    }
    
    // Функция для настройки автоматической прокрутки
    function setupAutoScroll(container) {
        // Получаем карточки
        const cards = container.querySelectorAll('.nft-card');
        if (cards.length === 0) return;
        
        // Очищаем контейнер
        container.innerHTML = '';
        
        // Создаем обертку для слайдера
        const sliderWrapper = document.createElement('div');
        sliderWrapper.className = 'slider-wrapper';
        
        // Создаем ленту слайдера
        const sliderTrack = document.createElement('div');
        sliderTrack.className = 'slider-track';
        
        // Добавляем карточки в ленту слайдера
        Array.from(cards).forEach(card => {
            sliderTrack.appendChild(card.cloneNode(true));
        });
        
        // Добавляем дублирующие карточки для бесконечной прокрутки
        Array.from(cards).forEach(card => {
            sliderTrack.appendChild(card.cloneNode(true));
        });
        
        // Вставляем ленту в обертку, а обертку в контейнер
        sliderWrapper.appendChild(sliderTrack);
        container.appendChild(sliderWrapper);
        
        // Получаем размер одной карточки и расстояние между ними
        const cardWidth = 250; // Ширина карточки в px из CSS
        const gap = 25; // Расстояние между карточками в px из CSS
        
        // Установка скорости анимации
        const speed = 20; // миллисекунды задержки между кадрами (меньше = плавнее)
        const step = 0.5; // пикселей за шаг (меньше = плавнее)
        
        // Переменные для анимации
        let position = 0;
        let animationId = null;
        
        // Функция для обновления позиции слайдера
        function updateSliderPosition() {
            sliderTrack.style.transform = `translateX(${-position}px)`;
        }
        
        // Функция для автоматической прокрутки
        function autoScroll() {
            // Увеличиваем позицию на шаг
            position += step;
            
            // Вычисляем точку перезапуска (конец первого набора карточек)
            const resetPoint = cards.length * (cardWidth + gap);
            
            // Если достигли конца первого набора, перезапускаем с начала
            if (position >= resetPoint) {
                position = 0;
            }
            
            // Обновляем позицию слайдера
            updateSliderPosition();
            
            // Продолжаем анимацию
            animationId = setTimeout(autoScroll, speed);
        }
        
        // Останавливаем предыдущую анимацию, если была
        if (container.dataset.animationId) {
            clearTimeout(parseInt(container.dataset.animationId));
        }
        
        // Запускаем автоматическую прокрутку
        animationId = setTimeout(autoScroll, speed);
        
        // Сохраняем ID анимации для возможной остановки
        container.dataset.animationId = animationId;
    }
    
    // Загружаем изображения для активной категории при загрузке страницы
    const activeCategory = document.querySelector('.filter-btn.active').getAttribute('data-filter') || 'all';
    loadImagesForCategory(activeCategory);
    
    // Обрабатываем клики по кнопкам фильтра
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            // Удаляем класс active у всех кнопок
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            
            // Добавляем класс active текущей кнопке
            this.classList.add('active');
            
            // Получаем категорию и целевой грид
            const category = this.getAttribute('data-filter');
            const targetGrid = document.querySelector(`.nft-grid[data-category="${category}"]`);
            
            // Скрываем все grid-контейнеры и останавливаем анимации
            document.querySelectorAll('.nft-grid').forEach(grid => {
                grid.style.opacity = '0';
                
                // Останавливаем анимацию, если она запущена
                if (grid.dataset.animationId) {
                    clearTimeout(parseInt(grid.dataset.animationId));
                    delete grid.dataset.animationId;
                }
                
                setTimeout(() => {
                    grid.style.display = 'none';
                }, 300);
            });
            
            // Показываем выбранную категорию с анимацией
            setTimeout(() => {
                targetGrid.style.display = 'flex';
                setTimeout(() => {
                    targetGrid.style.opacity = '1';
                }, 50);
            }, 300);
            
            // Загружаем изображения для выбранной категории
            loadImagesForCategory(category);
        });
    });
});
