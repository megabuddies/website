document.addEventListener('DOMContentLoaded', function() {
    const categories = ['all', 'common', 'rare', 'legendary'];
    let currentCategory = 'all';
    const initializedCategories = new Set(); // Отслеживаем, какие категории уже инициализированы
    
    // Проверка мобильного устройства
    const isMobile = window.innerWidth <= 768;
    
    // Показываем или скрываем индикатор свайпа на мобильных устройствах
    const swipeIndicator = document.querySelector('.swipe-indicator');
    if (swipeIndicator) {
        swipeIndicator.style.display = isMobile ? 'flex' : 'none';
    }
    
    // Отложенная инициализация контейнеров
    function deferredInitialization() {
        // Проверяем, загружена ли страница полностью
        if (document.readyState === 'complete') {
            initializeContainers();
        } else {
            // Если страница еще загружается, откладываем инициализацию
            setTimeout(deferredInitialization, 1000);
        }
    }
    
    // Инициализация контейнеров при загрузке страницы
    function initializeContainers() {
        // Применяем стили ко всем контейнерам
        document.querySelectorAll('.nft-grid').forEach(grid => {
            grid.style.display = 'none';
            grid.style.opacity = '0';
        });
        
        // Загружаем только текущую активную категорию
        const activeCategory = document.querySelector('.filter-btn.active').getAttribute('data-filter') || 'all';
        loadImagesForCategory(activeCategory, true);
    }
    
    // Вызываем отложенную инициализацию
    deferredInitialization();
    
    // Функция для подготовки контейнера карточками
    function prepareContainerWithCards(container, category) {
        // Если контейнер уже был инициализирован, не делаем этого снова
        if (container.getAttribute('data-initialized') === 'true') return;
        
        // Очищаем контейнер перед добавлением новых изображений
        container.innerHTML = '';
        
        // Оптимизировано: добавляем только необходимое количество изображений в зависимости от устройства
        const cardsCount = isMobile ? 5 : 10;
        const imgPath = 'images/nft1.jpg';
        
        // Создаем фрагмент для оптимизации DOM-операций
        const fragment = document.createDocumentFragment();
        
        // Создаем обертку для слайдера
        const sliderWrapper = document.createElement('div');
        sliderWrapper.className = 'slider-wrapper';
        
        // Создаем ленту слайдера
        const sliderTrack = document.createElement('div');
        sliderTrack.className = 'slider-track';
        
        // Добавляем карточки в ленту слайдера (только один раз для мобильных)
        for (let i = 1; i <= cardsCount; i++) {
            const nftCard = document.createElement('div');
            nftCard.className = 'nft-card';
            nftCard.setAttribute('data-rarity', category === 'all' ? ['common', 'rare', 'legendary'][Math.floor(Math.random() * 3)] : category);
            
            nftCard.innerHTML = `
                <div class="nft-image-container">
                    <img src="${imgPath}" alt="Mega Buddy #${i}" class="nft-image" loading="lazy">
                </div>
                <div class="nft-info">
                    <h3 class="nft-name">${getNftName(category, i)}</h3>
                    <p class="nft-rarity">${getRarityText(category === 'all' ? nftCard.getAttribute('data-rarity') : category)}</p>
                    <p class="nft-price">${getNftPrice(category === 'all' ? nftCard.getAttribute('data-rarity') : category)}</p>
                </div>
            `;
            
            sliderTrack.appendChild(nftCard);
        }
        
        // Добавляем дублирующие карточки только для десктопной анимации
        if (!isMobile) {
            for (let i = 1; i <= cardsCount; i++) {
                const nftCard = document.createElement('div');
                nftCard.className = 'nft-card';
                nftCard.setAttribute('data-rarity', category === 'all' ? ['common', 'rare', 'legendary'][Math.floor(Math.random() * 3)] : category);
                
                nftCard.innerHTML = `
                    <div class="nft-image-container">
                        <img src="${imgPath}" alt="Mega Buddy #${i}" class="nft-image" loading="lazy">
                    </div>
                    <div class="nft-info">
                        <h3 class="nft-name">${getNftName(category, i)}</h3>
                        <p class="nft-rarity">${getRarityText(category === 'all' ? nftCard.getAttribute('data-rarity') : category)}</p>
                        <p class="nft-price">${getNftPrice(category === 'all' ? nftCard.getAttribute('data-rarity') : category)}</p>
                    </div>
                `;
                
                sliderTrack.appendChild(nftCard);
            }
        }
        
        // Вставляем ленту в обертку, а обертку в фрагмент
        sliderWrapper.appendChild(sliderTrack);
        fragment.appendChild(sliderWrapper);
        
        // Добавляем фрагмент в контейнер (одна операция с DOM)
        container.appendChild(fragment);
        
        // Помечаем контейнер как инициализированный
        container.setAttribute('data-initialized', 'true');
        initializedCategories.add(category);
        
        // Запускаем анимацию для этого контейнера только на десктопе
        if (!isMobile) {
            setupSliderAnimation(sliderTrack);
        }
    }
    
    // Функция для загрузки изображений для каждой категории
    function loadImagesForCategory(category, initialLoad = false) {
        // Если уже выбрана эта категория, ничего не делаем
        if (category === currentCategory && !initialLoad) return;
        
        // Обновляем текущую категорию
        currentCategory = category;
        
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
            'common': '0.1 ETH',
            'rare': '0.3 ETH',
            'legendary': '0.5 ETH'
        };
        
        return prices[rarity] || '0.1 ETH';
    }
    
    // Оптимизированная функция анимации слайдера только для десктопов
    function setupSliderAnimation(sliderTrack) {
        let position = 0;
        const speed = 1;
        
        function animate() {
            position -= speed;
            
            // Когда достигаем половины трека, перескакиваем на начало
            const cards = sliderTrack.querySelectorAll('.nft-card');
            const halfWidth = (cards.length / 2) * cards[0].offsetWidth;
            
            if (Math.abs(position) >= halfWidth) {
                position = 0;
            }
            
            sliderTrack.style.transform = `translateX(${position}px)`;
            requestAnimationFrame(animate);
        }
        
        // Запускаем анимацию
        requestAnimationFrame(animate);
        
        // Останавливаем анимацию при наведении на трек
        sliderTrack.addEventListener('mouseenter', () => {
            sliderTrack.style.animationPlayState = 'paused';
        });
        
        sliderTrack.addEventListener('mouseleave', () => {
            sliderTrack.style.animationPlayState = 'running';
        });
    }
    
    // Обрабатываем клики по кнопкам фильтра
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Предотвращаем многократные быстрые клики
            if (this.classList.contains('active')) return;
            
            // Убираем активный класс со всех кнопок
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Добавляем активный класс на текущую кнопку
            this.classList.add('active');
            
            // Загружаем изображения для выбранной категории
            const category = this.getAttribute('data-filter');
            loadImagesForCategory(category);
        });
    });
    
    // Обработчик изменения размера окна для адаптивности
    window.addEventListener('resize', function() {
        const newIsMobile = window.innerWidth <= 768;
        
        // Показываем или скрываем индикатор свайпа при изменении размера
        if (swipeIndicator) {
            swipeIndicator.style.display = newIsMobile ? 'flex' : 'none';
        }
        
        // Если изменился статус мобильного устройства, перезагружаем страницу
        if (newIsMobile !== isMobile) {
            location.reload();
        }
    });
});
