// Скрипт для фиксации проблемы со скроллбарами
(function() {
    // Немедленно выполняемая функция, которая запускается до загрузки DOM

    // Специальный хак для принудительного скрытия скроллбаров в Манифесте
    var manifestoFixStyle = document.createElement('style');
    manifestoFixStyle.id = 'manifesto-fix-styles';
    manifestoFixStyle.innerHTML = `
        @media screen and (min-width: 992px) {
            /* Критический фикс только для манифеста */
            #manifesto {
                overflow: hidden !important;
                overflow-x: hidden !important;
                overflow-y: hidden !important;
                height: auto !important;
                min-height: auto !important;
                max-height: none !important;
            }
            
            #manifesto .terminal-container,
            #manifesto .terminal-content {
                overflow: hidden !important;
                overflow-x: hidden !important;
                overflow-y: hidden !important;
                scrollbar-width: none !important;
                -ms-overflow-style: none !important;
                max-height: none !important;
                height: auto !important;
            }

            /* Полное отключение скроллбаров */
            .terminal-content::-webkit-scrollbar,
            #manifesto::-webkit-scrollbar,
            #manifesto *::-webkit-scrollbar {
                width: 0 !important;
                height: 0 !important;
                display: none !important;
                opacity: 0 !important;
            }
        }
    `;
    
    // Вставляем стили в head до загрузки всего остального контента
    document.head.insertBefore(manifestoFixStyle, document.head.firstChild);

    // Добавляем стили напрямую в head при первой загрузке скрипта
    var styleEl = document.createElement('style');
    styleEl.id = 'scroll-fix-styles';
    styleEl.innerHTML = `
        /* Предотвращаем появление скроллбаров в десктопной версии */
        @media screen and (min-width: 992px) {
            #about, 
            #manifesto,
            #partnerships,
            #community,
            .about-content,
            .terminal-content,
            .terminal-container,
            .partnerships-grid,
            .partnership-card,
            .community-content,
            .twitter-feed,
            .telegram-feed {
                overflow: hidden !important;
                overflow-x: hidden !important;
                overflow-y: hidden !important;
                scrollbar-width: none !important;
                -ms-overflow-style: none !important;
                max-height: none !important;
            }
            
            #about::-webkit-scrollbar,
            #manifesto::-webkit-scrollbar,
            #partnerships::-webkit-scrollbar,
            #community::-webkit-scrollbar,
            .about-content::-webkit-scrollbar,
            .terminal-content::-webkit-scrollbar,
            .terminal-container::-webkit-scrollbar,
            .partnerships-grid::-webkit-scrollbar,
            .partnership-card::-webkit-scrollbar,
            .community-content::-webkit-scrollbar,
            .twitter-feed::-webkit-scrollbar,
            .telegram-feed::-webkit-scrollbar {
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
        var partnershipsSection = document.getElementById('partnerships');
        var communitySection = document.getElementById('community');
        var terminalContent = document.querySelector('.terminal-content');
        var terminalContainer = document.querySelector('.terminal-container');
        var aboutContent = document.querySelector('.about-content');
        var partnershipsGrid = document.querySelector('.partnerships-grid');
        var communityContent = document.querySelector('.community-content');
        var partnershipCards = document.querySelectorAll('.partnership-card');
        var twitterFeed = document.querySelector('.twitter-feed');
        var telegramFeed = document.querySelector('.telegram-feed');
        
        var elements = [aboutSection, manifestoSection, partnershipsSection, communitySection, 
                       terminalContent, terminalContainer, aboutContent, partnershipsGrid, 
                       communityContent, twitterFeed, telegramFeed];
        
        // Добавляем карточки партнерств
        partnershipCards.forEach(function(card) {
            elements.push(card);
        });
        
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
        
        // Специальная обработка для терминала манифеста
        if (terminalContent) {
            // Принудительно устанавливаем высоту контента равной его фактической высоте
            var actualHeight = terminalContent.scrollHeight;
            terminalContent.style.height = 'auto';
            terminalContent.style.minHeight = actualHeight + 'px';
        }
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
    
    // Хак для манифеста - переопределяем высоту после инициализации страницы
    window.addEventListener('load', function() {
        setTimeout(function() {
            var terminalContent = document.querySelector('.terminal-content');
            if (terminalContent && window.innerWidth > 992) {
                terminalContent.style.height = 'auto';
                terminalContent.style.overflow = 'hidden';
                terminalContent.style.overflowY = 'hidden';
                
                // Проверяем наличие скроллбара и скрываем его
                if (terminalContent.scrollHeight > terminalContent.clientHeight) {
                    terminalContent.style.maxHeight = 'none';
                    terminalContent.style.height = terminalContent.scrollHeight + 'px';
                }
            }
        }, 300);
    });
})(); 