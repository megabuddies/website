// JavaScript для индикаторов скролла в разделах
document.addEventListener('DOMContentLoaded', function() {
    
    // Функция для плавного скролла к следующему разделу
    function scrollToNextSection(currentSection) {
        const sections = document.querySelectorAll('.section');
        const currentIndex = Array.from(sections).findIndex(section => section.id === currentSection);
        
        if (currentIndex !== -1 && currentIndex < sections.length - 1) {
            const nextSection = sections[currentIndex + 1];
            nextSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
    
    // Функция для горизонтального скролла внутри раздела
    function scrollHorizontally(container, direction = 'right') {
        const scrollAmount = 300; // пикселей для скролла
        const currentScroll = container.scrollLeft;
        
        if (direction === 'right') {
            container.scrollTo({
                left: currentScroll + scrollAmount,
                behavior: 'smooth'
            });
        } else {
            container.scrollTo({
                left: currentScroll - scrollAmount,
                behavior: 'smooth'
            });
        }
    }
    
    // Обработчики для индикаторов скролла в разделах
    const scrollIndicators = document.querySelectorAll('.horizontal-scroll-indicator, .section-scroll-indicator');
    
    scrollIndicators.forEach(indicator => {
        indicator.addEventListener('click', function() {
            const section = this.closest('.section');
            const sectionId = section ? section.id : null;
            
            if (sectionId === 'ecosystem') {
                // Для ECOSYSTEM - скролл к следующему разделу или горизонтальный скролл по карточкам
                const ecosystemGrid = section.querySelector('.ecosystem-grid');
                if (ecosystemGrid && ecosystemGrid.scrollWidth > ecosystemGrid.clientWidth) {
                    scrollHorizontally(ecosystemGrid, 'right');
                } else {
                    scrollToNextSection(sectionId);
                }
            } else if (sectionId === 'partnerships') {
                // Для PARTNERSHIPS - скролл к следующему разделу или горизонтальный скролл по карточкам
                const partnershipsGrid = section.querySelector('.partnerships-grid');
                if (partnershipsGrid && partnershipsGrid.scrollWidth > partnershipsGrid.clientWidth) {
                    scrollHorizontally(partnershipsGrid, 'right');
                } else {
                    scrollToNextSection(sectionId);
                }
            } else {
                // Для остальных разделов - скролл к следующему разделу
                scrollToNextSection(sectionId);
            }
        });
    });
    
    // Функция для показа/скрытия индикаторов в зависимости от содержимого
    function updateScrollIndicators() {
        const ecosystemSection = document.getElementById('ecosystem');
        const partnershipsSection = document.getElementById('partnerships');
        
        if (ecosystemSection) {
            const ecosystemGrid = ecosystemSection.querySelector('.ecosystem-grid');
            const ecosystemIndicator = ecosystemSection.querySelector('.horizontal-scroll-indicator');
            
            if (ecosystemGrid && ecosystemIndicator) {
                // Показываем индикатор только если есть контент для скролла
                const hasScrollableContent = ecosystemGrid.scrollWidth > ecosystemGrid.clientWidth || 
                                           ecosystemGrid.children.length > 3;
                
                if (hasScrollableContent) {
                    ecosystemIndicator.style.display = 'flex';
                } else {
                    ecosystemIndicator.style.display = 'flex'; // Всегда показываем для навигации
                }
            }
        }
        
        if (partnershipsSection) {
            const partnershipsGrid = partnershipsSection.querySelector('.partnerships-grid');
            const partnershipsIndicator = partnershipsSection.querySelector('.horizontal-scroll-indicator');
            
            if (partnershipsGrid && partnershipsIndicator) {
                // Показываем индикатор только если есть контент для скролла
                const hasScrollableContent = partnershipsGrid.scrollWidth > partnershipsGrid.clientWidth ||
                                           partnershipsGrid.children.length > 2;
                
                if (hasScrollableContent) {
                    partnershipsIndicator.style.display = 'flex';
                } else {
                    partnershipsIndicator.style.display = 'flex'; // Всегда показываем для навигации
                }
            }
        }
    }
    
    // Обновляем индикаторы при загрузке страницы
    updateScrollIndicators();
    
    // Обновляем индикаторы при изменении размера окна
    window.addEventListener('resize', updateScrollIndicators);
    
    // Добавляем эффект hover для индикаторов
    scrollIndicators.forEach(indicator => {
        indicator.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
            this.style.opacity = '1';
        });
        
        indicator.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.opacity = '0.7';
        });
    });
    
    // Функция для автоматического скрытия индикаторов после скролла
    let scrollTimeout;
    function handleScroll() {
        // Показываем индикаторы при скролле
        scrollIndicators.forEach(indicator => {
            indicator.style.opacity = '0.9';
        });
        
        // Скрываем через некоторое время после окончания скролла
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            scrollIndicators.forEach(indicator => {
                if (!indicator.matches(':hover')) {
                    indicator.style.opacity = '0.7';
                }
            });
        }, 2000);
    }
    
    // Добавляем обработчик скролла
    window.addEventListener('scroll', handleScroll);
    
    // Добавляем клавиатурную навигацию
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowDown' && e.ctrlKey) {
            e.preventDefault();
            const currentSection = getCurrentSection();
            if (currentSection) {
                scrollToNextSection(currentSection.id);
            }
        }
    });
    
    // Функция для определения текущего раздела
    function getCurrentSection() {
        const sections = document.querySelectorAll('.section');
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        for (let i = sections.length - 1; i >= 0; i--) {
            const section = sections[i];
            if (section.offsetTop <= scrollTop + 200) {
                return section;
            }
        }
        
        return sections[0];
    }
});