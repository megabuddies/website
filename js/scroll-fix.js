// Скрипт для фиксации проблемы со скроллбарами
(function() {
    // Немедленно выполняемая функция, которая запускается до загрузки DOM

    // Добавляем стили напрямую в head при первой загрузке скрипта
    var styleEl = document.createElement('style');
    styleEl.id = 'scroll-fix-styles';
    styleEl.innerHTML = `
        /* Предотвращаем появление скроллбаров в десктопной версии */
        @media screen and (min-width: 992px) {
            #about, 
            #manifesto,
            .about-content,
            .terminal-content,
            .terminal-container {
                overflow: hidden !important;
                overflow-x: hidden !important;
                overflow-y: hidden !important;
                scrollbar-width: none !important;
                -ms-overflow-style: none !important;
                max-height: none !important;
            }
            
            #about::-webkit-scrollbar,
            #manifesto::-webkit-scrollbar,
            .about-content::-webkit-scrollbar,
            .terminal-content::-webkit-scrollbar,
            .terminal-container::-webkit-scrollbar {
                width: 0 !important;
                height: 0 !important;
                display: none !important;
                background: transparent !important;
            }
        }
    `;
    
    // Вставляем стили в head немедленно
    document.head.appendChild(styleEl);
    
    // Функция для применения стилей напрямую к элементам
    function applyStyles() {
        if(window.innerWidth <= 992) return; // Пропускаем для мобильных
        
        var aboutSection = document.getElementById('about');
        var manifestoSection = document.getElementById('manifesto');
        var terminalContent = document.querySelector('.terminal-content');
        var terminalContainer = document.querySelector('.terminal-container');
        var aboutContent = document.querySelector('.about-content');
        
        var elements = [aboutSection, manifestoSection, terminalContent, terminalContainer, aboutContent];
        
        elements.forEach(function(el) {
            if (!el) return;
            
            el.style.overflow = 'hidden';
            el.style.overflowX = 'hidden';
            el.style.overflowY = 'hidden';
            el.style.maxHeight = 'none';
            el.style.scrollbarWidth = 'none';
            el.style.msOverflowStyle = 'none';
            
            // Добавляем класс для дополнительного контроля
            el.classList.add('no-scroll-desktop');
        });
    }
    
    // Запускаем функцию до DOMContentLoaded
    applyStyles();
    
    // Запускаем функцию снова при DOMContentLoaded
    document.addEventListener('DOMContentLoaded', applyStyles);
    
    // Запускаем функцию ещё раз при загрузке полного документа
    window.addEventListener('load', applyStyles);
    
    // И для надежности запускаем через небольшой промежуток времени
    setTimeout(applyStyles, 100);
    setTimeout(applyStyles, 500);
    setTimeout(applyStyles, 1000);
})(); 