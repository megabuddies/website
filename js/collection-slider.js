document.addEventListener('DOMContentLoaded', function() {
    const categories = ['all', 'common', 'rare', 'legendary'];
    let currentCategory = 'all';
    let globalAnimationId = null;
    
    // Функция для загрузки изображений для каждой категории
    function loadImagesForCategory(category) {
        // Если уже выбрана эта категория, ничего не делаем
        if (category === currentCategory) return;
        
        currentCategory = category;
        
        // Прекращаем глобальную анимацию, если она запущена
        if (globalAnimationId) {
            cancelAnimationFrame(globalAnimationId);
            globalAnimationId = null;
        }
        
        // Получаем все grid-контейнеры
        const allContainers = document.querySelectorAll('.nft-grid');
        
        // Показываем только активный grid-контейнер
        const container = document.querySelector(`.nft-grid[data-category="${category}"]`);
        if (!container) return;
        
        // Сохраняем текущую высоту контейнера перед модификациями
        // чтобы избежать "прыжков" при переключении категорий
        const currentHeight = container.offsetHeight > 0 ? container.offsetHeight : 400;
        document.querySelectorAll('.nft-grid').forEach(grid => {
            grid.style.height = `${currentHeight}px`;
        });
        
        // Сначала подготавливаем контейнер, но не показываем
        container.style.opacity = '0';
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
        
        // Настраиваем автоматическую прокрутку и плавно показываем контейнер
        setupAutoScroll(container);
        
        // Плавно скрываем все остальные контейнеры
        allContainers.forEach(grid => {
            if (grid !== container) {
                grid.style.opacity = '0';
                setTimeout(() => {
                    grid.style.display = 'none';
                }, 300);
            }
        });
        
        // Плавно показываем текущий контейнер
        setTimeout(() => {
            container.style.opacity = '1';
        }, 50);
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
        // Прекращаем глобальную анимацию, если она запущена
        if (globalAnimationId) {
            cancelAnimationFrame(globalAnimationId);
            globalAnimationId = null;
        }
        
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
        
        // Добавляем дублирующие карточки для бесконечной прокрутки (трижды для гарантии)
        for (let i = 0; i < 3; i++) {
            Array.from(cards).forEach(card => {
                sliderTrack.appendChild(card.cloneNode(true));
            });
        }
        
        // Вставляем ленту в обертку, а обертку в контейнер
        sliderWrapper.appendChild(sliderTrack);
        container.appendChild(sliderWrapper);
        
        // Получаем размер одной карточки и расстояние между ними
        const cardWidth = 250; // Ширина карточки в px из CSS
        const gap = 25; // Расстояние между карточками в px из CSS
        
        // Супер-плавная анимация с использованием requestAnimationFrame
        let position = 0;
        const speed = 0.8; // Увеличиваем скорость с 0.2 до 0.8 пикселей за кадр
        
        // Функция для анимации с использованием requestAnimationFrame
        function animate() {
            position += speed;
            
            // Вычисляем точку перезапуска (конец первого набора карточек)
            const resetPoint = cards.length * (cardWidth + gap);
            
            // Если достигли конца первого набора, перезапускаем с начала
            if (position >= resetPoint) {
                position = 0;
            }
            
            // Обновляем позицию слайдера с использованием transform вместо scrollLeft для более плавной анимации
            sliderTrack.style.transform = `translateX(${-position}px)`;
            
            // Продолжаем анимацию
            globalAnimationId = requestAnimationFrame(animate);
        }
        
        // Запускаем анимацию
        globalAnimationId = requestAnimationFrame(animate);
    }
    
    // Загружаем изображения для активной категории при загрузке страницы
    const activeCategory = document.querySelector('.filter-btn.active').getAttribute('data-filter') || 'all';
    loadImagesForCategory(activeCategory);
    
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
