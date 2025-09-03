document.addEventListener('DOMContentLoaded', function() {
    const categories = ['all', 'common', 'rare', 'legendary'];
    let currentCategory = 'all';
    let globalAnimationId = null;
    const initializedCategories = new Set(); // Отслеживаем, какие категории уже инициализированы
    
    // Инициализация контейнеров при загрузке страницы
    function initializeContainers() {
        // Устанавливаем фиксированную высоту для всех контейнеров
        const fixedHeight = 450;
        
        // Применяем стили ко всем контейнерам
        document.querySelectorAll('.nft-grid').forEach(grid => {
            grid.style.minHeight = `${fixedHeight}px`;
            grid.style.height = `${fixedHeight}px`;
            grid.style.display = 'none';
            grid.style.opacity = '0';
        });
        
        // Загружаем только текущую активную категорию
        const activeCategory = document.querySelector('.filter-btn.active').getAttribute('data-filter') || 'all';
        loadImagesForCategory(activeCategory, true); // Передаем флаг initialLoad = true
    }
    
    // Немедленная инициализация контейнеров
    initializeContainers();
    
    // Функция для подготовки контейнера карточками
    function prepareContainerWithCards(container, category) {
        // Если контейнер уже был инициализирован, не делаем этого снова
        if (container.getAttribute('data-initialized') === 'true') return;
        
        // Очищаем контейнер перед добавлением новых изображений
        container.innerHTML = '';
        
        // Оптимизировано: добавляем только необходимое количество изображений (максимум 10)
        const cardsCount = 10;
        const imgPath = 'images/nft1.jpg';
        
        // Создаем фрагмент для оптимизации DOM-операций
        const fragment = document.createDocumentFragment();
        
        // Создаем обертку для слайдера
        const sliderWrapper = document.createElement('div');
        sliderWrapper.className = 'slider-wrapper';
        
        // Создаем ленту слайдера
        const sliderTrack = document.createElement('div');
        sliderTrack.className = 'slider-track';
        
        // Добавляем карточки в ленту слайдера
        for (let i = 1; i <= cardsCount; i++) {
            const nftCard = document.createElement('div');
            nftCard.className = 'nft-card';
            nftCard.setAttribute('data-rarity', category === 'all' ? ['common', 'rare', 'legendary'][Math.floor(Math.random() * 3)] : category);
            
            nftCard.innerHTML = `
                <div class="nft-image-container">
                    <img src="${imgPath}" alt="Mega Buddy #${i}" class="nft-image">
                </div>
                <div class="nft-info">
                    <h3 class="nft-name">${getNftName(category, i)}</h3>
                    <p class="nft-rarity">${getRarityText(category === 'all' ? nftCard.getAttribute('data-rarity') : category)}</p>
                    <p class="nft-price">${getNftPrice(category === 'all' ? nftCard.getAttribute('data-rarity') : category)}</p>
                </div>
            `;
            
            sliderTrack.appendChild(nftCard);
        }
        
        // Добавляем только один набор дублирующих карточек (вместо трех)
        for (let i = 1; i <= cardsCount; i++) {
            const nftCard = document.createElement('div');
            nftCard.className = 'nft-card';
            nftCard.setAttribute('data-rarity', category === 'all' ? ['common', 'rare', 'legendary'][Math.floor(Math.random() * 3)] : category);
            
            nftCard.innerHTML = `
                <div class="nft-image-container">
                    <img src="${imgPath}" alt="Mega Buddy #${i}" class="nft-image">
                </div>
                <div class="nft-info">
                    <h3 class="nft-name">${getNftName(category, i)}</h3>
                    <p class="nft-rarity">${getRarityText(category === 'all' ? nftCard.getAttribute('data-rarity') : category)}</p>
                    <p class="nft-price">${getNftPrice(category === 'all' ? nftCard.getAttribute('data-rarity') : category)}</p>
                </div>
            `;
            
            sliderTrack.appendChild(nftCard);
        }
        
        // Вставляем ленту в обертку, а обертку в фрагмент
        sliderWrapper.appendChild(sliderTrack);
        fragment.appendChild(sliderWrapper);
        
        // Добавляем фрагмент в контейнер (одна операция с DOM)
        container.appendChild(fragment);
        
        // Помечаем контейнер как инициализированный
        container.setAttribute('data-initialized', 'true');
        initializedCategories.add(category);
        
        // Запускаем анимацию для этого контейнера
        setupSliderAnimation(sliderTrack);
    }
    
    // Функция для загрузки изображений для каждой категории
    function loadImagesForCategory(category, initialLoad = false) {
        // Если уже выбрана эта категория, ничего не делаем
        if (category === currentCategory && !initialLoad) return;
        
        // Обновляем текущую категорию
        currentCategory = category;
        
        // Прекращаем глобальную анимацию, если она запущена
        if (globalAnimationId) {
            cancelAnimationFrame(globalAnimationId);
            globalAnimationId = null;
        }
        
        // Получаем все grid-контейнеры
        const allContainers = document.querySelectorAll('.nft-grid');
        
        // Получаем контейнер для текущей категории
        const container = document.querySelector(`.nft-grid[data-category="${category}"]`);
        if (!container) return;
        
        // Если это первая загрузка, сразу показываем контейнер без анимации
        if (initialLoad) {
            // Скрываем все контейнеры, кроме текущего
            allContainers.forEach(grid => {
                if (grid !== container) {
                    grid.style.display = 'none';
                    grid.style.opacity = '0';
                }
            });
            
            // Подготавливаем контейнер, если он еще не инициализирован
            prepareContainerWithCards(container, category);
            
            // Сразу показываем текущий контейнер без задержки
            container.style.display = 'flex';
            container.style.opacity = '1';
            return;
        }
        
        // Обычное переключение с анимацией
        // Плавно скрываем все контейнеры
        allContainers.forEach(grid => {
            grid.style.opacity = '0';
        });
        
        // Ждем окончания анимации прозрачности
        setTimeout(() => {
            // Скрываем все контейнеры, кроме текущего
            allContainers.forEach(grid => {
                if (grid !== container) {
                    grid.style.display = 'none';
                }
            });
            
            // Подготавливаем контейнер, если он еще не инициализирован
            prepareContainerWithCards(container, category);
            
            // Показываем текущий контейнер
            container.style.display = 'flex';
            
            // Добавляем небольшую задержку перед показом для более плавного перехода
            setTimeout(() => {
                container.style.opacity = '1';
            }, 50);
        }, 300);
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
            'common': '',
            'rare': '',
            'legendary': ''
        };
        
        return prices[rarity] || '';
    }
    
    // Оптимизированная функция анимации слайдера
    function setupSliderAnimation(sliderTrack) {
        // Используем CSS анимацию для более эффективной анимации
        const cardWidth = 250; // Ширина карточки в px из CSS
        const gap = 25; // Расстояние между карточками в px из CSS
        const totalWidth = 10 * (cardWidth + gap); // Ширина всех карточек
        
        // Устанавливаем стартовую позицию
        sliderTrack.style.transform = 'translateX(0)';
        
        // Устанавливаем CSS-анимацию
        sliderTrack.style.animation = 'none'; // Сначала сбрасываем любую предыдущую анимацию
        
        // Добавляем новую анимацию с небольшой задержкой, чтобы сброс успел применится
        setTimeout(() => {
            sliderTrack.style.animation = `slideAnimation ${totalWidth/50}s linear infinite`;
        }, 10);
        
        // Остановка анимации при выходе со страницы для экономии ресурсов
        document.addEventListener('visibilitychange', function() {
            if (document.hidden) {
                sliderTrack.style.animationPlayState = 'paused';
            } else {
                sliderTrack.style.animationPlayState = 'running';
            }
        });
    }
    

    
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
