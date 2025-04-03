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
            "Оптимизация 3D моделей...",
            "Подключение к метавселенной...",
            "Калибровка нейронной сети..."
        ];
        this.messageElement = null; // Элемент для отображения сообщений
        this.preloaderElement = null; // Элемент прелоадера
        this.isReady = false; // Флаг готовности
        this.startTime = Date.now(); // Запоминаем время старта для минимального времени показа
        this.minDisplayTime = 4000; // Минимальное время показа прелоадера в мс
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
        
        // Имитируем загрузку дополнительных ресурсов для 3D
        const extraResources = 15; // Добавляем виртуальные ресурсы для 3D модели
        
        // Общее количество ресурсов
        this.totalResources = images.length + otherResources.length + extraResources;
        
        // Если ресурсов нет, сразу завершаем загрузку
        if (this.totalResources === 0) {
            this.setProgress(100);
            this.finishLoading();
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
        
        // Имитируем загрузку 3D ресурсов с более долгой загрузкой
        for (let i = 0; i < extraResources; i++) {
            // Растягиваем загрузку 3D ресурсов равномерно от 1 до 4 секунд
            const loadTime = 1000 + (i / extraResources) * 3000 + Math.random() * 500;
            setTimeout(() => this.resourceLoaded(), loadTime);
        }

        // Устанавливаем таймаут, чтобы не ждать вечно, если какие-то ресурсы не загрузятся
        setTimeout(() => {
            if (!this.isReady) {
                this.finishLoading();
            }
        }, 10000); // Максимум 10 секунд на загрузку
    }

    // Обработка загрузки одного ресурса
    resourceLoaded() {
        this.loadedResources++;
        
        // Вычисляем процент загрузки
        const progress = Math.min(Math.round((this.loadedResources / this.totalResources) * 100), 100);
        
        // Обновляем прогресс
        this.setProgress(progress);
        
        // Если все загружено, проверяем минимальное время показа
        if (progress >= 100 && !this.isReady) {
            const currentTime = Date.now();
            const elapsedTime = currentTime - this.startTime;
            
            if (elapsedTime >= this.minDisplayTime) {
                this.finishLoading(); // Если минимальное время прошло, завершаем прелоадер
            } else {
                // Иначе ставим таймер на оставшееся время
                const remainingTime = this.minDisplayTime - elapsedTime;
                setTimeout(() => this.finishLoading(), remainingTime);
            }
        }
    }

    // Установка значения прогресса
    setProgress(progress) {
        if (this.progressBar && this.progressText) {
            this.progressBar.style.width = `${progress}%`;
            this.progressText.textContent = `${progress}%`;
        }
    }

    // Завершение загрузки и скрытие прелоадера
    finishLoading() {
        this.isReady = true;
        
        // Устанавливаем прогресс на 100% для уверенности
        this.setProgress(100);
        
        // Предварительно загружаем Three.js библиотеку
        this.preloadThreeJs(() => {
            // Задержка для гарантии, что пользователь увидит 100%
            setTimeout(() => {
                if (this.preloaderElement) {
                    this.preloaderElement.classList.add('hidden');
                    
                    // Удаляем прелоадер из DOM после завершения анимации
                    setTimeout(() => {
                        if (this.preloaderElement && this.preloaderElement.parentNode) {
                            this.preloaderElement.parentNode.removeChild(this.preloaderElement);
                        }
                        
                        // Убеждаемся, что все элементы фона остаются видимыми
                        document.getElementById('background-animation').style.display = '';
                        document.getElementById('background-animation').style.visibility = 'visible';
                        document.getElementById('background-animation').style.opacity = '1';
                        
                        document.getElementById('star-field').style.display = '';
                        document.getElementById('star-field').style.visibility = 'visible';
                        document.getElementById('star-field').style.opacity = '1';
                        
                        document.getElementById('hero-animation').style.display = '';
                        document.getElementById('hero-animation').style.visibility = 'visible';
                        document.getElementById('hero-animation').style.opacity = '1';
                        
                        // Инициируем событие о завершении загрузки
                        document.dispatchEvent(new Event('preloaderFinished'));
                    }, 600); // Время анимации скрытия
                }
            }, 800); // Задержка перед скрытием
        });
    }
    
    // Предварительная загрузка Three.js ресурсов
    preloadThreeJs(callback) {
        // Проверка, загружен ли уже Three.js
        if (window.THREE) {
            console.log("Three.js уже загружен");
            callback();
            return;
        }
        
        console.log("Предварительная загрузка Three.js...");
        
        // Список скриптов для предварительной загрузки
        const threejsScripts = [
            'js/three-animation.js'
        ];
        
        let loadedScripts = 0;
        
        threejsScripts.forEach(script => {
            const preloadLink = document.createElement('link');
            preloadLink.rel = 'preload';
            preloadLink.href = script;
            preloadLink.as = 'script';
            document.head.appendChild(preloadLink);
            
            // После предзагрузки отмечаем как загруженный
            loadedScripts++;
            if (loadedScripts === threejsScripts.length) {
                console.log("Все скрипты Three.js предзагружены");
                callback();
            }
        });
    }
}

// Создаем экземпляр прелоадера при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    new Preloader();
}); 