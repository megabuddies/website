document.addEventListener('DOMContentLoaded', function() {
    const categories = ['all', 'common', 'rare', 'legendary'];
    let currentAnimationFrameId = null; // Store the current animation frame ID globally
    
    // Function to clean up any existing animations
    function cleanupAnimations() {
        if (currentAnimationFrameId) {
            cancelAnimationFrame(currentAnimationFrameId);
            currentAnimationFrameId = null;
        }
    }
    
    // Функция для загрузки изображений для каждой категории
    function loadImagesForCategory(category) {
        // Clean up any existing animations first
        cleanupAnimations();
        
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
            
            const imgPath = `images/nft${imgIndex}_${category === 'all' ? ['common', 'rare', 'legendary'][Math.floor(Math.random() * 3)] : category}.jpg`;
            
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
        // Проверка существования контейнера
        if (!container) return;
        
        // Очищаем предыдущие обработчики событий
        container.removeEventListener('mouseenter', pauseScroll);
        container.removeEventListener('mouseleave', resumeScroll);
        
        // Clean up any existing animations first
        cleanupAnimations();
        
        // Клонируем элементы для бесконечной прокрутки
        const cards = container.querySelectorAll('.nft-card');
        
        // Проверка, есть ли карточки
        if (!cards || cards.length === 0) return;
        
        const originalCards = Array.from(cards);
        
        // Очищаем контейнер
        container.innerHTML = '';
        
        // Добавляем оригинальные карточки
        originalCards.forEach(card => {
            container.appendChild(card.cloneNode(true));
        });
        
        // Добавляем клоны для бесконечной прокрутки
        originalCards.forEach(card => {
            container.appendChild(card.cloneNode(true));
        });
        
        let scrollPosition = 0;
        let scrollSpeed = 1; // Уменьшаем скорость для более плавной прокрутки
        let isScrolling = true;
        
        // Функция для паузы прокрутки
        function pauseScroll() {
            isScrolling = false;
            if (currentAnimationFrameId) {
                cancelAnimationFrame(currentAnimationFrameId);
                currentAnimationFrameId = null;
            }
        }
        
        // Функция для возобновления прокрутки
        function resumeScroll() {
            if (!isScrolling) {
                isScrolling = true;
                animate();
            }
        }
        
        // Функция анимации
        function animate() {
            if (!isScrolling) return;
            
            scrollPosition += scrollSpeed;
            
            // Если дошли до конца, плавно перемещаемся в начало
            const totalWidth = (cards[0].offsetWidth + 25) * originalCards.length;
            if (scrollPosition >= totalWidth) {
                scrollPosition = 0;
            }
            
            container.scrollLeft = scrollPosition;
            currentAnimationFrameId = requestAnimationFrame(animate);
        }
        
        // Добавляем обработчики событий для паузы при наведении
        container.addEventListener('mouseenter', pauseScroll);
        container.addEventListener('mouseleave', resumeScroll);
        
        // Запускаем анимацию
        animate();
        
        console.log("Auto-scroll animation setup complete for", category);
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
