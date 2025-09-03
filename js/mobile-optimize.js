/**
 * mobile-optimize.js
 * Оптимизации для ускорения загрузки на мобильных устройствах
 */

document.addEventListener('DOMContentLoaded', function() {
    // Кеширование DOM элементов
    const body = document.body;
    // const mobileMenuToggle = document.querySelector('.mobile-menu-toggle'); // отключено
    const navList = document.querySelector('.nav-list');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const nftGrids = document.querySelectorAll('.nft-grid');
    const scrollTopBtn = document.getElementById('scroll-top');
    
    // Проверка на мобильное устройство
    function isMobile() {
        return window.innerWidth <= 992;
    }
    
    // Инициализация улучшенного мобильного меню - отключено
    function initMobileMenu() {
        // Функция отключена, так как мобильное меню удалено
        /*
        if (mobileMenuToggle && navList) {
            // Улучшенное плавное открытие меню
            mobileMenuToggle.addEventListener('click', function() {
                mobileMenuToggle.classList.toggle('active');
                navList.classList.toggle('active');
                
                if (navList.classList.contains('active')) {
                    body.style.overflow = 'hidden';
                    
                    // Анимация появления пунктов меню с задержкой
                    const navItems = document.querySelectorAll('.nav-item');
                    navItems.forEach((item, index) => {
                        item.style.setProperty('--item-index', index);
                    });
                } else {
                    body.style.overflow = 'auto';
                }
            });
            
            // Обработка dropdown меню
            const dropdownItems = document.querySelectorAll('.nav-item.dropdown');
            dropdownItems.forEach(dropdown => {
                const dropdownToggle = dropdown.querySelector('.dropdown-toggle');
                if (dropdownToggle) {
                    dropdownToggle.addEventListener('click', function(e) {
                        e.preventDefault();
                        dropdown.classList.toggle('active');
                        
                        // Закрываем другие dropdown
                        dropdownItems.forEach(otherDropdown => {
                            if (otherDropdown !== dropdown) {
                                otherDropdown.classList.remove('active');
                            }
                        });
                    });
                }
            });

            // Закрытие меню при клике на пункт меню (кроме dropdown toggle)
            const navLinks = document.querySelectorAll('.nav-link:not(.dropdown-toggle)');
            navLinks.forEach(link => {
                link.addEventListener('click', function() {
                    if (isMobile() && navList.classList.contains('active')) {
                        mobileMenuToggle.classList.remove('active');
                        navList.classList.remove('active');
                        body.style.overflow = 'auto';
                    }
                });
            });
            
            // Закрытие меню при клике на dropdown link
            const dropdownLinks = document.querySelectorAll('.dropdown-link');
            dropdownLinks.forEach(link => {
                link.addEventListener('click', function() {
                    if (isMobile() && navList.classList.contains('active')) {
                        mobileMenuToggle.classList.remove('active');
                        navList.classList.remove('active');
                        body.style.overflow = 'auto';
                    }
                });
            });
            
            // Закрытие меню при клике вне меню
            document.addEventListener('click', function(event) {
                if (isMobile() && 
                    navList.classList.contains('active') && 
                    !navList.contains(event.target) && 
                    !mobileMenuToggle.contains(event.target)) {
                    
                    mobileMenuToggle.classList.remove('active');
                    navList.classList.remove('active');
                    body.style.overflow = 'auto';
                }
            });
        }
        */
    }
    
    // Инициализация фильтров коллекции
    function initCollectionFilters() {
        if (filterButtons.length > 0) {
            filterButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const filter = this.getAttribute('data-filter');
                    
                    // Удаляем активный класс со всех кнопок
                    filterButtons.forEach(btn => btn.classList.remove('active'));
                    
                    // Добавляем активный класс нажатой кнопке
                    this.classList.add('active');
                    
                    // Скрываем все сетки
                    nftGrids.forEach(grid => {
                        grid.style.display = 'none';
                    });
                    
                    // Показываем нужную сетку
                    const targetGrid = document.querySelector(`.nft-grid[data-category="${filter}"]`);
                    if (targetGrid) {
                        targetGrid.style.display = 'flex';
                    }
                });
            });
            
            // По умолчанию показываем "ВСЕ"
            const allButton = document.querySelector('.filter-btn[data-filter="all"]');
            if (allButton) {
                allButton.click();
            }
        }
    }
    
    // Инициализация дорожной карты
    function initRoadmap() {
        const roadmapItems = document.querySelectorAll('.roadmap-item');
        
        roadmapItems.forEach(item => {
            const content = item.querySelector('.roadmap-content');
            
            if (content) {
                // Добавляем обработчик нажатия для выделения плитки
                content.addEventListener('click', function() {
                    // Убираем активное состояние у других плиток
                    document.querySelectorAll('.roadmap-content').forEach(el => {
                        el.classList.remove('active');
                    });
                    
                    // Добавляем активное состояние текущей плитке
                    this.classList.add('active');
                });
            }
        });
    }
    
    // Оптимизация скролла для мобильных устройств
    function optimizeScroll() {
        // Remove scroll indicator click handler
        const scrollIndicator = document.getElementById('scroll-down');
        if (scrollIndicator) {
            scrollIndicator.style.pointerEvents = 'none';
            scrollIndicator.style.cursor = 'default';
        }
        
        if (isMobile()) {
            let lastScrollTop = 0;
            
            window.addEventListener('scroll', function() {
                const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
                
                // Показываем/скрываем кнопку прокрутки наверх
                if (scrollTopBtn) {
                    if (currentScrollTop > 300) {
                        scrollTopBtn.classList.add('visible');
                    } else {
                        scrollTopBtn.classList.remove('visible');
                    }
                }
                
                lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
            }, { passive: true });
        }
    }
    
    // Инициализация кнопки прокрутки наверх
    function initScrollTopButton() {
        if (scrollTopBtn) {
            scrollTopBtn.addEventListener('click', function() {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    }
    
    // Оптимизация для подъема контента на главной странице
    function optimizeHero() {
        if (isMobile()) {
            const heroContent = document.querySelector('.hero-content');
            const scrollIndicator = document.querySelector('.scroll-indicator');
            
            if (heroContent && scrollIndicator) {
                // Оптимизация размещения элементов герояp
                const viewportHeight = window.innerHeight;
                const headerHeight = document.querySelector('.main-header')?.offsetHeight || 70;
                
                // Подстраиваем отступы в зависимости от высоты экрана
                if (viewportHeight < 700) {
                    // Для очень маленьких экранов поднимаем еще выше
                    heroContent.style.paddingTop = '30px';
                    heroContent.style.paddingBottom = '100px';
                    scrollIndicator.style.bottom = '20px';
                } else {
                    heroContent.style.paddingTop = '40px';
                    heroContent.style.paddingBottom = '120px';
                    scrollIndicator.style.bottom = '30px';
                }
            }
        }
    }
    
    // Инициализация всех оптимизаций
    function init() {
        initMobileMenu();
        initCollectionFilters();
        initRoadmap();
        optimizeScroll();
        initScrollTopButton();
        optimizeHero();
        
        // Пересчитываем оптимизации при изменении размера окна
        window.addEventListener('resize', function() {
            optimizeHero();
        });
        
        // Пересчитываем оптимизации при изменении ориентации
        window.addEventListener('orientationchange', function() {
            setTimeout(function() {
                optimizeHero();
            }, 300);
        });
    }
    
    // Мобильная навигация
    function initMobileNavigation() {
        const navItems = document.querySelectorAll('.mobile-nav-item');
        const sections = document.querySelectorAll('.section');
        
        // Функция для определения активной секции
        function updateActiveNavItem() {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (window.pageYOffset >= sectionTop - 100) {
                    current = section.getAttribute('id');
                }
            });
            
            navItems.forEach(item => {
                item.classList.remove('active');
                if (item.getAttribute('href') === '#' + current) {
                    item.classList.add('active');
                }
            });
        }
        
        // Плавная прокрутка при клике на навигацию
        navItems.forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);
                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
        
        // Обновляем активный элемент при скролле
        window.addEventListener('scroll', updateActiveNavItem);
        updateActiveNavItem(); // Инициальное обновление
    }
    
    // Запуск инициализации
    init();
    initMobileNavigation();
}); 