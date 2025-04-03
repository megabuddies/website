/**
 * Класс для ленивой загрузки изображений
 * Изображения загружаются только когда они видны в области просмотра
 */
class LazyLoader {
    constructor() {
        // Создаем IntersectionObserver для отслеживания видимости элементов
        this.observer = new IntersectionObserver(this.onIntersection.bind(this), {
            // Настройки - элемент считается видимым, когда видно 10% его площади
            rootMargin: '50px',
            threshold: 0.1
        });
        
        // Добавляем экземпляр класса в глобальную переменную для доступа из других скриптов
        window.LazyLoader = this;
        
        // Инициализация
        this.init();
    }
    
    /**
     * Инициализация - находим все изображения с атрибутом data-src и отслеживаем их
     */
    init() {
        // Ждем завершения загрузки прелоадера
        document.addEventListener('preloaderFinished', () => {
            this.checkImages();
        });
        
        // Добавляем обработчик события для проверки изображений по запросу
        document.addEventListener('checkLazyImages', () => {
            this.checkImages();
        });
        
        // Также добавляем обработчик события загрузки страницы, если preloaderFinished не сработал
        window.addEventListener('load', () => {
            // Если сайт загрузился, но прелоадер не вызвал событие
            setTimeout(() => {
                this.checkImages();
            }, 2000); // Проверяем через 2 секунды после загрузки страницы
        });
    }
    
    /**
     * Проверка всех изображений для ленивой загрузки
     */
    checkImages() {
        // Находим все элементы с атрибутом data-src (отложенная загрузка)
        const lazyImages = document.querySelectorAll('img[data-src]');
        
        // Если таких элементов нет, завершаем
        if (lazyImages.length === 0) {
            return;
        }
        
        // Проверяем, наблюдаются ли уже эти элементы
        lazyImages.forEach(img => {
            if (!img.src || img.src === window.location.href) {
                this.observer.observe(img);
            }
        });
    }
    
    /**
     * Обработка события пересечения (элемент стал видимым)
     */
    onIntersection(entries, observer) {
        entries.forEach(entry => {
            // Если элемент не видим, пропускаем
            if (!entry.isIntersecting) return;
            
            // Получаем элемент изображения
            const img = entry.target;
            
            // Получаем настоящий URL изображения из атрибута data-src
            const src = img.dataset.src;
            
            // Если URL изображения не задан, пропускаем
            if (!src) return;
            
            // Добавляем класс для анимации появления
            img.classList.add('lazy-loading');
            
            // Создаем новое изображение для предварительной загрузки
            const preloadImage = new Image();
            
            // Устанавливаем обработчики событий загрузки
            preloadImage.onload = () => {
                // Когда изображение загружено, устанавливаем его как источник для видимого элемента
                img.src = src;
                
                // Удаляем класс загрузки и добавляем класс "загружено"
                setTimeout(() => {
                    img.classList.remove('lazy-loading');
                    img.classList.add('lazy-loaded');
                }, 100);
                
                // Удаляем атрибут data-src, чтобы не загружать изображение повторно
                delete img.dataset.src;
                
                // Прекращаем отслеживание этого элемента
                observer.unobserve(img);
            };
            
            // Устанавливаем обработчик ошибки загрузки
            preloadImage.onerror = () => {
                // Если произошла ошибка загрузки, показываем запасное изображение
                img.src = 'images/image-error.jpg'; // Путь к изображению-заглушке
                
                // Удаляем атрибут data-src, чтобы не загружать изображение повторно
                delete img.dataset.src;
                
                // Прекращаем отслеживание этого элемента
                observer.unobserve(img);
            };
            
            // Начинаем загрузку изображения
            preloadImage.src = src;
        });
    }
}

// Создаем экземпляр класса при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    new LazyLoader();
}); 