document.addEventListener('DOMContentLoaded', function() {
    const sliderContainer = document.querySelector('.partnerships-slider-container');
    if (!sliderContainer) return;

    const sliderTrack = sliderContainer.querySelector('.partnerships-slider-track');
    const sliderWrapper = sliderContainer.querySelector('.partnerships-slider-wrapper');
    const leftArrow = sliderContainer.querySelector('.slider-arrow-left');
    const rightArrow = sliderContainer.querySelector('.slider-arrow-right');
    const cards = sliderTrack.querySelectorAll('.partnership-card');
    
    if (!sliderTrack || !leftArrow || !rightArrow || cards.length === 0) return;

    let currentIndex = 0;
    let cardWidth = 0;
    let cardsPerView = 1;
    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let animationID = 0;

    // Calculate dimensions
    function calculateDimensions() {
        const card = cards[0];
        const cardStyle = window.getComputedStyle(card);
        cardWidth = card.offsetWidth + parseInt(cardStyle.marginLeft) + parseInt(cardStyle.marginRight);
        
        // Determine cards per view based on screen width
        const viewportWidth = window.innerWidth;
        if (viewportWidth >= 1200) {
            cardsPerView = 3;
        } else if (viewportWidth >= 768) {
            cardsPerView = 2;
        } else {
            cardsPerView = 1;
        }
        
        updateSliderPosition(false);
    }

    // Update slider position
    function updateSliderPosition(animate = true) {
        const maxIndex = Math.max(0, cards.length - cardsPerView);
        currentIndex = Math.max(0, Math.min(currentIndex, maxIndex));
        
        const translateX = -currentIndex * cardWidth;
        
        if (animate) {
            sliderTrack.style.transition = 'transform 0.3s ease-out';
        } else {
            sliderTrack.style.transition = 'none';
        }
        
        sliderTrack.style.transform = `translateX(${translateX}px)`;
        currentTranslate = translateX;
        prevTranslate = translateX;
        
        // Update arrow states
        updateArrowStates();
    }

    // Update arrow visibility/state
    function updateArrowStates() {
        const maxIndex = Math.max(0, cards.length - cardsPerView);
        
        if (currentIndex <= 0) {
            leftArrow.style.opacity = '0.3';
            leftArrow.style.cursor = 'not-allowed';
        } else {
            leftArrow.style.opacity = '1';
            leftArrow.style.cursor = 'pointer';
        }
        
        if (currentIndex >= maxIndex) {
            rightArrow.style.opacity = '0.3';
            rightArrow.style.cursor = 'not-allowed';
        } else {
            rightArrow.style.opacity = '1';
            rightArrow.style.cursor = 'pointer';
        }
    }

    // Arrow navigation
    leftArrow.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateSliderPosition(true);
        }
    });

    rightArrow.addEventListener('click', () => {
        const maxIndex = Math.max(0, cards.length - cardsPerView);
        if (currentIndex < maxIndex) {
            currentIndex++;
            updateSliderPosition(true);
        }
    });

    // Touch/Mouse drag functionality
    function touchStart(index) {
        return function(event) {
            isDragging = true;
            startPos = getPositionX(event);
            animationID = requestAnimationFrame(animation);
            sliderTrack.style.cursor = 'grabbing';
        }
    }

    function touchMove(event) {
        if (isDragging) {
            const currentPosition = getPositionX(event);
            currentTranslate = prevTranslate + currentPosition - startPos;
        }
    }

    function touchEnd() {
        isDragging = false;
        cancelAnimationFrame(animationID);
        sliderTrack.style.cursor = 'grab';
        
        const movedBy = currentTranslate - prevTranslate;
        
        // Determine if we should move to next or previous slide
        if (movedBy < -50 && currentIndex < cards.length - cardsPerView) {
            currentIndex++;
        } else if (movedBy > 50 && currentIndex > 0) {
            currentIndex--;
        }
        
        updateSliderPosition(true);
    }

    function getPositionX(event) {
        return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
    }

    function animation() {
        sliderTrack.style.transition = 'none';
        sliderTrack.style.transform = `translateX(${currentTranslate}px)`;
        if (isDragging) requestAnimationFrame(animation);
    }

    // Add event listeners for touch and mouse
    sliderTrack.addEventListener('mousedown', touchStart(0));
    sliderTrack.addEventListener('touchstart', touchStart(0));
    sliderTrack.addEventListener('mousemove', touchMove);
    sliderTrack.addEventListener('touchmove', touchMove);
    sliderTrack.addEventListener('mouseup', touchEnd);
    sliderTrack.addEventListener('mouseleave', touchEnd);
    sliderTrack.addEventListener('touchend', touchEnd);
    
    // Prevent context menu on long press
    sliderTrack.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        e.stopPropagation();
        return false;
    });

    // Prevent image dragging
    cards.forEach(card => {
        const images = card.querySelectorAll('img');
        images.forEach(img => {
            img.addEventListener('dragstart', (e) => e.preventDefault());
        });
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            leftArrow.click();
        } else if (e.key === 'ArrowRight') {
            rightArrow.click();
        }
    });

    // Initialize
    calculateDimensions();
    
    // Recalculate on window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            calculateDimensions();
        }, 250);
    });

    // Set cursor style
    sliderTrack.style.cursor = 'grab';
});
