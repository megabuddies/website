document.addEventListener('DOMContentLoaded', function() {
    const categories = ['all', 'common', 'rare', 'legendary'];
    let currentCategory = 'all';
    let globalAnimationId = null;
    const initializedCategories = new Set(); // Отслеживаем, какие категории уже инициализированы
    const isMobile = window.innerWidth <= 768;
    const isSmallMobile = window.innerWidth <= 480;
    
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
        // Устанавливаем фиксированную высоту в зависимости от размера экрана
        const fixedHeight = isMobile ? 400 : 450;
        
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
    
    // Вызываем отложенную инициализацию вместо прямого вызова
    deferredInitialization();
    
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
        sliderWrapper.style.width = '100%';
        
        // Создаем ленту слайдера
        const sliderTrack = document.createElement('div');
        sliderTrack.className = 'slider-track';
        
        // Для мобильных устройств устанавливаем специальные стили
        if (isMobile) {
            sliderTrack.style.paddingLeft = '10px';
            sliderTrack.style.paddingRight = '10px';
            sliderTrack.style.boxSizing = 'border-box';
            sliderTrack.style.width = 'auto'; // Позволяем контенту определять ширину
            sliderTrack.style.display = 'flex';
            sliderTrack.style.gap = '10px';
            sliderTrack.style.flexWrap = 'nowrap'; // Всегда nowrap для горизонтального скролла
            sliderTrack.style.justifyContent = 'flex-start';
            sliderTrack.style.overflow = 'visible';
            sliderTrack.style.overflowX = 'auto'; // Добавляем горизонтальный скролл
            sliderTrack.style.WebkitOverflowScrolling = 'touch'; // Для плавного скролла на iOS
            sliderTrack.style.scrollbarWidth = 'none'; // Скрываем скроллбар в Firefox
            sliderTrack.style.msOverflowStyle = 'none'; // Скрываем скроллбар в IE
            sliderTrack.style.paddingBottom = '15px'; // Место для скроллбара
        }
        
        // Добавляем стиль для скрытия скроллбара в Chrome и Safari
        if (isMobile) {
            const style = document.createElement('style');
            style.textContent = '.slider-track::-webkit-scrollbar { display: none; }';
            document.head.appendChild(style);
        }
        
        // Добавляем карточки в ленту слайдера
        for (let i = 1; i <= cardsCount; i++) {
            const nftCard = document.createElement('div');
            nftCard.className = 'nft-card';
            nftCard.setAttribute('data-rarity', category === 'all' ? ['common', 'rare', 'legendary'][Math.floor(Math.random() * 3)] : category);
            
            // Для мобильных делаем специальные стили карточек
            if (isMobile) {
                const cardWidth = isSmallMobile ? '120px' : '130px';
                nftCard.style.minWidth = cardWidth;
                nftCard.style.maxWidth = cardWidth;
                nftCard.style.width = cardWidth;
                nftCard.style.margin = '0 5px';
                nftCard.style.boxSizing = 'border-box';
                nftCard.style.flex = '0 0 auto';
                nftCard.style.aspectRatio = '0.75'; // Фиксированное соотношение сторон
            }
            
            // Создаем структуру карточки с правильным соотношением сторон для изображения
            const imageContainer = document.createElement('div');
            imageContainer.className = 'nft-image-container';
            
            if (isMobile) {
                imageContainer.style.width = '100%';
                imageContainer.style.paddingTop = '100%'; // Делаем контейнер квадратным
                imageContainer.style.position = 'relative';
                imageContainer.style.overflow = 'hidden';
                imageContainer.style.borderRadius = '8px';
                imageContainer.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
            }
            
            const img = document.createElement('img');
            img.src = imgPath;
            img.alt = `Mega Buddy #${i}`;
            img.className = 'nft-image';
            img.loading = 'lazy'; // Добавляем ленивую загрузку
            
            if (isMobile) {
                img.style.position = 'absolute';
                img.style.top = '0';
                img.style.left = '0';
                img.style.width = '100%';
                img.style.height = '100%';
                img.style.objectFit = 'cover';
            }
            
            // Добавляем обработчик для предзагрузки изображений
            img.onload = function() {
                this.classList.add('loaded');
            };
            
            // Устанавливаем предварительный пустой src для предотвращения преждевременной загрузки
            img.src = "";
            // Задержка перед установкой реального src для предотвращения блокировки рендеринга
            setTimeout(() => {
                img.src = imgPath;
            }, 100);
            
            imageContainer.appendChild(img);
            nftCard.appendChild(imageContainer);
            
            // Информация о карточке
            const infoContainer = document.createElement('div');
            infoContainer.className = 'nft-info';
            
            if (isMobile) {
                infoContainer.style.padding = isSmallMobile ? '8px' : '10px';
                infoContainer.style.textAlign = 'center';
            }
            
            const name = document.createElement('h3');
            name.className = 'nft-name';
            name.textContent = getNftName(category, i);
            
            if (isMobile && isSmallMobile) {
                name.style.fontSize = '0.8rem';
                name.style.marginBottom = '5px';
            }
            
            const rarity = document.createElement('p');
            rarity.className = 'nft-rarity';
            rarity.textContent = getRarityText(category === 'all' ? nftCard.getAttribute('data-rarity') : category);
            
            if (isMobile && isSmallMobile) {
                rarity.style.fontSize = '0.7rem';
                rarity.style.marginBottom = '3px';
            }
            
            const price = document.createElement('p');
            price.className = 'nft-price';
            price.textContent = getNftPrice(category === 'all' ? nftCard.getAttribute('data-rarity') : category);
            
            if (isMobile && isSmallMobile) {
                price.style.fontSize = '0.7rem';
            }
            
            infoContainer.appendChild(name);
            infoContainer.appendChild(rarity);
            infoContainer.appendChild(price);
            nftCard.appendChild(infoContainer);
            
            sliderTrack.appendChild(nftCard);
        }
        
        // На мобильных устройствах добавляем только небольшое количество дублирующих карточек
        if (isMobile) {
            // Добавляем только 4 дополнительные карточки для мобильных
            const duplicateCount = 4;
            
            for (let i = 1; i <= duplicateCount; i++) {
                const nftCard = document.createElement('div');
                nftCard.className = 'nft-card';
                nftCard.setAttribute('data-rarity', category === 'all' ? ['common', 'rare', 'legendary'][Math.floor(Math.random() * 3)] : category);
                
                const cardWidth = isSmallMobile ? '120px' : '130px';
                nftCard.style.minWidth = cardWidth;
                nftCard.style.maxWidth = cardWidth;
                nftCard.style.width = cardWidth;
                nftCard.style.margin = '0 5px';
                nftCard.style.boxSizing = 'border-box';
                nftCard.style.flex = '0 0 auto';
                nftCard.style.aspectRatio = '0.75';
                
                // Аналогичная структура для дублирующих карточек
                const imageContainer = document.createElement('div');
                imageContainer.className = 'nft-image-container';
                imageContainer.style.width = '100%';
                imageContainer.style.paddingTop = '100%';
                imageContainer.style.position = 'relative';
                imageContainer.style.overflow = 'hidden';
                imageContainer.style.borderRadius = '8px';
                imageContainer.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
                
                const img = document.createElement('img');
                img.src = imgPath;
                img.alt = `Mega Buddy #${i}`;
                img.className = 'nft-image';
                img.loading = 'lazy';
                img.style.position = 'absolute';
                img.style.top = '0';
                img.style.left = '0';
                img.style.width = '100%';
                img.style.height = '100%';
                img.style.objectFit = 'cover';
                
                img.onload = function() {
                    this.classList.add('loaded');
                };
                
                img.src = "";
                setTimeout(() => {
                    img.src = imgPath;
                }, 100);
                
                imageContainer.appendChild(img);
                nftCard.appendChild(imageContainer);
                
                const infoContainer = document.createElement('div');
                infoContainer.className = 'nft-info';
                infoContainer.style.padding = isSmallMobile ? '8px' : '10px';
                infoContainer.style.textAlign = 'center';
                
                const name = document.createElement('h3');
                name.className = 'nft-name';
                name.textContent = getNftName(category, i);
                
                if (isSmallMobile) {
                    name.style.fontSize = '0.8rem';
                    name.style.marginBottom = '5px';
                }
                
                const rarity = document.createElement('p');
                rarity.className = 'nft-rarity';
                rarity.textContent = getRarityText(category === 'all' ? nftCard.getAttribute('data-rarity') : category);
                
                if (isSmallMobile) {
                    rarity.style.fontSize = '0.7rem';
                    rarity.style.marginBottom = '3px';
                }
                
                const price = document.createElement('p');
                price.className = 'nft-price';
                price.textContent = getNftPrice(category === 'all' ? nftCard.getAttribute('data-rarity') : category);
                
                if (isSmallMobile) {
                    price.style.fontSize = '0.7rem';
                }
                
                infoContainer.appendChild(name);
                infoContainer.appendChild(rarity);
                infoContainer.appendChild(price);
                nftCard.appendChild(infoContainer);
                
                sliderTrack.appendChild(nftCard);
            }
        } else {
            // Для десктопа дублируем все карточки
            for (let i = 1; i <= cardsCount; i++) {
                const nftCard = document.createElement('div');
                nftCard.className = 'nft-card';
                nftCard.setAttribute('data-rarity', category === 'all' ? ['common', 'rare', 'legendary'][Math.floor(Math.random() * 3)] : category);
                
                // Создаем структуру карточки
                const imageContainer = document.createElement('div');
                imageContainer.className = 'nft-image-container';
                
                const img = document.createElement('img');
                img.src = imgPath;
                img.alt = `Mega Buddy #${i}`;
                img.className = 'nft-image';
                img.loading = 'lazy';
                
                imageContainer.appendChild(img);
                nftCard.appendChild(imageContainer);
                
                const infoContainer = document.createElement('div');
                infoContainer.className = 'nft-info';
                
                const name = document.createElement('h3');
                name.className = 'nft-name';
                name.textContent = getNftName(category, i);
                
                const rarity = document.createElement('p');
                rarity.className = 'nft-rarity';
                rarity.textContent = getRarityText(category === 'all' ? nftCard.getAttribute('data-rarity') : category);
                
                const price = document.createElement('p');
                price.className = 'nft-price';
                price.textContent = getNftPrice(category === 'all' ? nftCard.getAttribute('data-rarity') : category);
                
                infoContainer.appendChild(name);
                infoContainer.appendChild(rarity);
                infoContainer.appendChild(price);
                nftCard.appendChild(infoContainer);
                
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
        
        // Запускаем анимацию только если не мобильное устройство
        if (!isMobile) {
            setupSliderAnimation(sliderTrack);
        } else {
            // На мобильных устройствах добавляем поддержку свайпа
            setupMobileSwipe(sliderTrack);
        }
    }
    
    // Функция для поддержки свайпа на мобильных устройствах
    function setupMobileSwipe(sliderTrack) {
        let startX, startScrollLeft;
        let isDown = false;
        
        // Обработчики для десктопа (мышь)
        sliderTrack.addEventListener('mousedown', (e) => {
            isDown = true;
            sliderTrack.classList.add('active');
            startX = e.pageX - sliderTrack.offsetLeft;
            startScrollLeft = sliderTrack.scrollLeft;
        });
        
        sliderTrack.addEventListener('mouseleave', () => {
            isDown = false;
            sliderTrack.classList.remove('active');
        });
        
        sliderTrack.addEventListener('mouseup', () => {
            isDown = false;
            sliderTrack.classList.remove('active');
        });
        
        sliderTrack.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - sliderTrack.offsetLeft;
            const walk = (x - startX) * 2; // Скорость скролла
            sliderTrack.scrollLeft = startScrollLeft - walk;
        });
        
        // Обработчики для мобильных (тач)
        sliderTrack.addEventListener('touchstart', (e) => {
            isDown = true;
            sliderTrack.classList.add('active');
            startX = e.touches[0].pageX - sliderTrack.offsetLeft;
            startScrollLeft = sliderTrack.scrollLeft;
        }, { passive: true });
        
        sliderTrack.addEventListener('touchend', () => {
            isDown = false;
            sliderTrack.classList.remove('active');
        }, { passive: true });
        
        sliderTrack.addEventListener('touchcancel', () => {
            isDown = false;
            sliderTrack.classList.remove('active');
        }, { passive: true });
        
        sliderTrack.addEventListener('touchmove', (e) => {
            if (!isDown) return;
            const x = e.touches[0].pageX - sliderTrack.offsetLeft;
            const walk = (x - startX) * 2;
            sliderTrack.scrollLeft = startScrollLeft - walk;
        }, { passive: true });
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
            'common': '0.1 ETH',
            'rare': '0.3 ETH',
            'legendary': '0.5 ETH'
        };
        
        return prices[rarity] || '0.1 ETH';
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
    
    // Не инициализируем контейнеры напрямую здесь, так как используем deferredInitialization
    // initializeContainers();
    
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
    
    // Обновляем слушатель рейзайза окна
    window.addEventListener('resize', function() {
        const newIsMobile = window.innerWidth <= 768;
        
        // Если изменился режим отображения (с мобильного на десктоп или наоборот)
        if (newIsMobile !== isMobile) {
            // Перезагружаем текущую категорию
            loadImagesForCategory(currentCategory, true);
        }
    });
});
