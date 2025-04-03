// Класс Preloader для управления загрузкой ресурсов сайта
class Preloader {
    constructor() {
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
            "Построение цифрового будущего..."
        ];
        this.messageElement = null; // Элемент для отображения сообщений
        this.preloaderElement = null; // Элемент прелоадера
        this.isReady = false; // Флаг готовности
        this.startTime = Date.now(); // Время начала загрузки
        this.maxLoadingTime = 2000; // Максимальное время отображения прелоадера (2 секунды)
        this.progress = 0;
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

        // Просто отображаем анимацию загрузки
        this.simulateLoading();
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

        // Меняем сообщения каждую секунду
        const messageInterval = setInterval(() => {
            if (this.isReady) {
                clearInterval(messageInterval);
                return;
            }
            showMessage();
        }, 1000);
    }

    // Имитация загрузки
    simulateLoading() {
        const updateProgress = () => {
            // Увеличиваем прогресс
            this.progress += Math.random() * 10 + 5;
            if (this.progress > 100) this.progress = 100;
            
            // Обновляем прогресс-бар
            this.setProgress(Math.floor(this.progress));
            
            // Если достигли 100% или прошло максимальное время, завершаем
            const elapsedTime = Date.now() - this.startTime;
            if (this.progress >= 100 || elapsedTime > this.maxLoadingTime) {
                this.finishLoading();
            } else {
                setTimeout(updateProgress, 100 + Math.random() * 200);
            }
        };
        
        // Запускаем обновление прогресса
        updateProgress();
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
        if (this.isReady) return;
        this.isReady = true;
        
        // Устанавливаем прогресс на 100% для уверенности
        this.setProgress(100);
        
        // Даем небольшую задержку и скрываем прелоадер
        setTimeout(() => {
            if (this.preloaderElement) {
                this.preloaderElement.classList.add('hidden');
                
                // Удаляем прелоадер из DOM после завершения анимации
                setTimeout(() => {
                    if (this.preloaderElement && this.preloaderElement.parentNode) {
                        this.preloaderElement.parentNode.removeChild(this.preloaderElement);
                    }
                }, 600); // Время анимации скрытия
            }
        }, 400); // Небольшая задержка перед скрытием
    }
}

// Создаем экземпляр прелоадера при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    new Preloader();
}); 