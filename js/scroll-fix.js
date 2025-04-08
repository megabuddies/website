// Скрипт для фиксации проблемы со скроллбарами
document.addEventListener('DOMContentLoaded', function() {
    // Функция для определения мобильного устройства
    function isMobileDevice() {
        return (window.innerWidth <= 992 || 
                navigator.userAgent.match(/Android/i) || 
                navigator.userAgent.match(/webOS/i) || 
                navigator.userAgent.match(/iPhone/i) || 
                navigator.userAgent.match(/iPad/i) || 
                navigator.userAgent.match(/iPod/i) || 
                navigator.userAgent.match(/BlackBerry/i) || 
                navigator.userAgent.match(/Windows Phone/i));
    }

    // Если это не мобильное устройство
    if (!isMobileDevice()) {
        // Добавляем класс к body, который мы будем использовать в CSS
        document.body.classList.add('desktop-view');
        
        // Находим элементы, у которых нужно скрыть скроллбары
        const aboutSection = document.getElementById('about');
        const manifestoSection = document.getElementById('manifesto');
        const terminalContent = document.querySelector('.terminal-content');
        
        // Добавляем стили напрямую к элементам
        if (aboutSection) {
            aboutSection.style.overflow = 'visible';
        }
        
        if (manifestoSection) {
            manifestoSection.style.overflow = 'visible';
        }
        
        if (terminalContent) {
            terminalContent.style.overflow = 'hidden';
            terminalContent.style.maxHeight = 'none';
        }
        
        // Добавляем дополнительные CSS-правила в head
        const styleEl = document.createElement('style');
        styleEl.innerHTML = `
            body.desktop-view #about, 
            body.desktop-view #manifesto,
            body.desktop-view .about-content,
            body.desktop-view .terminal-content {
                overflow: visible !important;
                overflow-y: visible !important;
                scrollbar-width: none !important;
            }
            
            body.desktop-view .terminal-content {
                max-height: none !important;
                overflow: hidden !important;
            }
            
            body.desktop-view .terminal-content::-webkit-scrollbar,
            body.desktop-view #about::-webkit-scrollbar,
            body.desktop-view #manifesto::-webkit-scrollbar {
                width: 0 !important;
                display: none !important;
            }
        `;
        document.head.appendChild(styleEl);
    }
}); 