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
            
            // Используем nft1.jpg для всех изображений в категории КОЛЛЕКЦИЯ
            const imgPath = 'images/nft1.jpg';
            
            nftCard.innerHTML = `
                <img src="${imgPath}" alt="Mega Buddy #${imgIndex}" class="nft-image">
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
        
        // Создаем обертку для слайдшоу с фиксированной шириной
        const sliderWrapper = document.createElement('div');
        sliderWrapper.className = 'slider-wrapper';
        sliderWrapper.style.width = '100%';
        sliderWrapper.style.overflow = 'hidden';
        sliderWrapper.style.position = 'relative';
        
        // Создаем ленту слайдера, которая будет анимироваться
        const sliderTrack = document.createElement('div');
        sliderTrack.className = 'slider-track';
        sliderTrack.style.display = 'flex';
        sliderTrack.style.position = 'relative';
        sliderTrack.style.width = '10000px'; // Большое значение для размещения всех карточек
        
        // Клонируем элементы в ленту слайдера (дублируем для непрерывной прокрутки)
        for (let i = 0; i < 3; i++) { // Создаем три полных набора карточек для бесконечной прокрутки
            Array.from(cards).forEach(card => {
                sliderTrack.appendChild(card.cloneNode(true));
            });
        }
        
        // Очищаем контейнер и добавляем нашу структуру
        container.innerHTML = '';
        sliderWrapper.appendChild(sliderTrack);
        container.appendChild(sliderWrapper);
        
        // Получаем ширину одной карточки и отступа
        const cardWidth = cards[0].offsetWidth;
        const gapWidth = 25; // отступ между карточками
        const slideWidth = cardWidth + gapWidth;
        const totalWidth = slideWidth * cards.length;
        
        // Устанавливаем начальную позицию 
        sliderTrack.style.transform = 'translateX(0)';
        
        // Функция для бесконечной прокрутки с CSS анимацией
        function startContinuousScroll() {
            // Устанавливаем CSS анимацию
            sliderTrack.style.transition = 'transform 0s linear';
            sliderTrack.style.transform = 'translateX(0)';
            
            // Небольшая задержка для установки начальной позиции
            setTimeout(() => {
                // Установка плавной анимации
                sliderTrack.style.transition = 'transform 60s linear infinite';
                sliderTrack.style.transform = `translateX(-${totalWidth * 2}px)`;
            }, 10);
        }
        
        // Запускаем непрерывную прокрутку
        startContinuousScroll();
        
        // Обработчик для отслеживания завершения анимации и перезапуска
        sliderTrack.addEventListener('transitionend', function() {
            // Сбрасываем позицию без анимации и запускаем снова
            startContinuousScroll();
        });
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
            
            // Добавляем плавное появление для выбранной категории
            const category = this.getAttribute('data-filter');
            const targetGrid = document.querySelector(`.nft-grid[data-category="${category}"]`);
            
            // Скрываем все grid-контейнеры с анимацией
            document.querySelectorAll('.nft-grid').forEach(grid => {
                grid.style.opacity = '0';
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
