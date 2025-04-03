// Класс Preloader для управления загрузкой ресурсов сайта
class Preloader {
    constructor() {
        this.totalResources = 0; // Общее количество ресурсов для загрузки
        this.loadedResources = 0; // Количество загруженных ресурсов
        this.progressBar = null; // Элемент прогресс-бара
        this.progressText = null; // Элемент текста с процентами
        this.loadingMessages = [ // Сообщения, которые будут показываться во время загрузки
            "Загрузка ресурсов революции...",
            "Запуск квантовых алгоритмов...",
            "Подключение к блокчейну...",
            "Криптобаддис пробуждаются...",
            "Подготовка NFT коллекции...",
            "Взлом матрицы...",
            "Сопротивление системе...",
            "Построение цифрового будущего...",
            "Загрузка 3D модели...",
            "Рендеринг фона...",
            "Инициализация Three.js..."
        ];
        this.messageElement = null; // Элемент для отображения сообщений
        this.preloaderElement = null; // Элемент прелоадера
        this.isReady = false; // Флаг готовности
        this.threeJsReady = false; // Флаг готовности Three.js
        this.minLoadingTime = 3000; // Минимальное время отображения прелоадера (3 секунды)
        this.startTime = Date.now(); // Время начала загрузки
        this.threeJsLoaded = false; // Флаг загрузки Three.js
        this.init();
    }

    // Инициализация прелоадера
    init() {
        // Создаем HTML структуру прелоадера
        const preloaderHTML = `
            <div class="preloader">
                <div class="preloader-content">
                    <img src="images/mega-buddies-logo.png" alt="Mega Buddies Logo" class="preloader-logo">
                    <h1 class="preloader-title">MEGA BUDDIES</h1>
                    <p class="preloader-subtitle">ЗАГРУЗКА РЕВОЛЮЦИИ</p>
                    <div class="progress-container">
                        <div class="progress-bar"></div>
                    </div>
                    <div class="progress-text">0%</div>
                    <div class="loading-message"></div>
                </div>
            </div>
        `;

        // Вставляем прелоадер в начало body
        document.body.insertAdjacentHTML('afterbegin', preloaderHTML);

        // Получаем ссылки на элементы
        this.preloaderElement = document.querySelector('.preloader');
        this.progressBar = document.querySelector('.progress-bar');
        this.progressText = document.querySelector('.progress-text');
        this.messageElement = document.querySelector('.loading-message');

        // Начинаем отображать сообщения
        this.showRandomMessages();

        // Начинаем отслеживать загрузку ресурсов
        this.trackResourceLoading();

        // Добавляем слушатель событий для отслеживания загрузки Three.js
        document.addEventListener('threeJsInitialized', () => {
            console.log('Three.js инициализирован');
            this.threeJsLoaded = true;
            this.checkIfReady();
        });

        // Если Three.js не инициализировался через 12 секунд, все равно закрываем прелоадер
        setTimeout(() => {
            if (!this.threeJsLoaded) {
                console.warn('Three.js не инициализировался за отведенное время');
                this.threeJsLoaded = true;
                this.checkIfReady();
            }
        }, 12000);

        // Добавляем слушатель события DOMContentLoaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.domLoaded = true;
                this.checkIfReady();
            });
        } else {
            this.domLoaded = true;
            this.checkIfReady();
        }
    }

    // Отображение случайных сообщений во время загрузки
    showRandomMessages() {
        let lastIndex = -1;

        const showMessage = () => {
            // Выбираем случайное сообщение (но не то же самое, что показывали в прошлый раз)
            let newIndex;
            do {
                newIndex = Math.floor(Math.random() * this.loadingMessages.length);
            } while (newIndex === lastIndex && this.loadingMessages.length > 1);
            
            lastIndex = newIndex;
            const message = this.loadingMessages[newIndex];

            // Добавляем эффект глитча с некоторой вероятностью
            const hasGlitch = Math.random() > 0.7;
            
            if (this.messageElement) {
                this.messageElement.textContent = message;
                
                if (hasGlitch) {
                    this.messageElement.classList.add('glitch-effect', 'glitch-active');
                    setTimeout(() => {
                        this.messageElement.classList.remove('glitch-active');
                    }, 300);
                } else {
                    this.messageElement.classList.remove('glitch-effect', 'glitch-active');
                }
            }
        };

        // Показываем первое сообщение сразу
        showMessage();

        // Меняем сообщения каждые 2-3 секунды
        const messageInterval = setInterval(() => {
            if (this.isReady) {
                clearInterval(messageInterval);
                return;
            }
            showMessage();
        }, 2000 + Math.random() * 1000);
    }

    // Отслеживание загрузки ресурсов
    trackResourceLoading() {
        // Собираем все изображения на странице
        const images = Array.from(document.querySelectorAll('img'));
        
        // Добавляем скрипты, CSS и другие ресурсы
        const otherResources = Array.from(document.querySelectorAll('script, link[rel="stylesheet"]'));
        
        // Общее количество ресурсов (увеличиваем на 5 для трехмерной анимации и фона)
        this.totalResources = images.length + otherResources.length + 5;
        
        // Если ресурсов нет, сразу завершаем загрузку
        if (this.totalResources === 0) {
            this.setProgress(100);
            this.checkIfReady();
            return;
        }

        // Отслеживаем загрузку изображений
        images.forEach(img => {
            if (img.complete) {
                this.resourceLoaded();
            } else {
                img.addEventListener('load', () => this.resourceLoaded());
                img.addEventListener('error', () => this.resourceLoaded()); // Считаем и ошибки загрузки
            }
        });

        // Для JS и CSS просто учитываем их в общем количестве, но не ждем загрузки
        // т.к. если скрипт выполняется, значит он уже загружен
        otherResources.forEach(() => {
            setTimeout(() => this.resourceLoaded(), 300 + Math.random() * 700);
        });

        // Разделяем загрузку Three.js на неколько этапов для более плавного прогресса
        setTimeout(() => this.resourceLoaded(), 2000); // Загрузка базовых компонентов
        setTimeout(() => this.resourceLoaded(), 3000); // Загрузка шейдеров
        setTimeout(() => this.resourceLoaded(), 4000); // Загрузка текстур
        setTimeout(() => this.resourceLoaded(), 5000); // Инициализация сцены
        setTimeout(() => this.resourceLoaded(), 6000); // Финальная подготовка

        // Устанавливаем таймаут, чтобы не ждать вечно, если какие-то ресурсы не загрузятся
        setTimeout(() => {
            if (!this.isReady) {
                this.checkIfReady(true); // Форсировать завершение загрузки
            }
        }, 15000); // Максимум 15 секунд на загрузку
    }

    // Обработка загрузки одного ресурса
    resourceLoaded() {
        this.loadedResources++;
        
        // Вычисляем процент загрузки
        const progress = Math.min(Math.round((this.loadedResources / this.totalResources) * 100), 100);
        
        // Обновляем прогресс
        this.setProgress(progress);
        
        // Если все загружено, проверяем готовность
        if (progress >= 100) {
            this.resourcesLoaded = true;
            this.checkIfReady();
        }
    }

    // Установка значения прогресса
    setProgress(progress) {
        if (this.progressBar && this.progressText) {
            this.progressBar.style.width = `${progress}%`;
            this.progressText.textContent = `${progress}%`;
        }
    }

    // Проверка готовности всех компонентов
    checkIfReady(force = false) {
        if (this.isReady) return;
        
        // Проверяем, прошло ли минимальное время отображения прелоадера
        const elapsedTime = Date.now() - this.startTime;
        const timeCondition = elapsedTime >= this.minLoadingTime;
        
        // Проверяем, загружены ли все ресурсы или Three.js
        const resourceCondition = this.resourcesLoaded || this.loadedResources >= this.totalResources;
        
        // Условие для завершения загрузки
        if ((timeCondition && resourceCondition && this.threeJsLoaded) || force) {
            this.finishLoading();
        }
    }

    // Завершение загрузки и скрытие прелоадера
    finishLoading() {
        this.isReady = true;
        
        // Устанавливаем прогресс на 100% для уверенности
        this.setProgress(100);
        
        // Задержка для гарантии, что пользователь увидит 100%
        setTimeout(() => {
            if (this.preloaderElement) {
                this.preloaderElement.classList.add('hidden');
                
                // Удаляем прелоадер из DOM после завершения анимации
                setTimeout(() => {
                    if (this.preloaderElement && this.preloaderElement.parentNode) {
                        this.preloaderElement.parentNode.removeChild(this.preloaderElement);
                    }
                    
                    // Инициируем событие о завершении загрузки
                    document.dispatchEvent(new Event('preloaderFinished'));
                }, 600); // Время анимации скрытия
            }
        }, 800); // Задержка перед скрытием
    }
}

// Создаем экземпляр прелоадера при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    new Preloader();
}); 