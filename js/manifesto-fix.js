// Немедленно исполняемый скрипт для исправления скроллбара в манифесте
(function() {
    // Создаем и немедленно добавляем стили
    var style = document.createElement('style');
    style.id = 'critical-manifesto-fix';
    style.textContent = `
        /* Этот стиль загружается раньше всех остальных */
        @media screen and (min-width: 992px) {
            #manifesto, 
            #manifesto .terminal-container,
            #manifesto .terminal-content {
                overflow: hidden !important;
                overflow-x: hidden !important;
                overflow-y: hidden !important;
                max-height: none !important;
                height: auto !important;
                scrollbar-width: none !important;
                -ms-overflow-style: none !important;
            }

            #manifesto *::-webkit-scrollbar {
                width: 0 !important;
                height: 0 !important;
                display: none !important;
                visibility: hidden !important;
                background: transparent !important;
            }
        }
    `;
    
    // Вставляем стиль в начало head
    if (document.head) {
        document.head.insertBefore(style, document.head.firstChild);
    } else {
        // Если head еще не загружен, добавляем слушатель
        document.addEventListener('DOMContentLoaded', function() {
            document.head.insertBefore(style, document.head.firstChild);
        });
    }
    
    // Функция для фиксации манифеста
    function fixManifesto() {
        var manifesto = document.getElementById('manifesto');
        var terminalContent = document.querySelector('.terminal-content');
        
        if (!manifesto || !terminalContent || window.innerWidth <= 992) return;
        
        // Применяем стили напрямую к элементам
        manifesto.style.overflow = 'hidden';
        manifesto.style.overflowY = 'hidden';
        manifesto.style.height = 'auto';
        manifesto.style.maxHeight = 'none';
        
        terminalContent.style.overflow = 'hidden';
        terminalContent.style.overflowY = 'hidden';
        terminalContent.style.height = 'auto';
        terminalContent.style.maxHeight = 'none';
        
        // Добавляем классы для дополнительного контроля
        manifesto.classList.add('no-scroll-manifesto');
        terminalContent.classList.add('no-scroll-manifesto');
    }
    
    // Запускаем функцию немедленно
    fixManifesto();
    
    // Создаем наблюдатель за DOM для фиксации манифеста, как только он появится
    if (window.MutationObserver) {
        var observer = new MutationObserver(function(mutations) {
            // Проверка на наличие манифеста
            if (document.getElementById('manifesto')) {
                fixManifesto();
            }
        });
        
        // Начинаем наблюдение за документом
        observer.observe(document.documentElement || document.body, {
            childList: true,
            subtree: true
        });
        
        // Остановим наблюдатель через 5 секунд для экономии ресурсов
        setTimeout(function() {
            observer.disconnect();
        }, 5000);
    }
    
    // Дополнительно запускаем при загрузке страницы
    window.addEventListener('load', fixManifesto);
    
    // И через короткие интервалы для гарантии
    setTimeout(fixManifesto, 100);
    setTimeout(fixManifesto, 300);
    setTimeout(fixManifesto, 500);
})(); 