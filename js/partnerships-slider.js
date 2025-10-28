document.addEventListener('DOMContentLoaded', function() {
    const sliderContainer = document.querySelector('.partnerships-slider-container');
    if (!sliderContainer) return;

    const sliderTrack = sliderContainer.querySelector('.partnerships-slider-track');
    const sliderWrapper = sliderContainer.querySelector('.partnerships-slider-wrapper');
    const leftArrow = sliderContainer.querySelector('.slider-arrow-left');
    const rightArrow = sliderContainer.querySelector('.slider-arrow-right');
    const originalCards = Array.from(sliderTrack.querySelectorAll('.partnership-card'));
    
    if (!sliderTrack || !leftArrow || !rightArrow || originalCards.length === 0) return;

    // Check if mobile device
    const isMobile = window.innerWidth <= 768;
    
    // On mobile, use native scroll instead of custom slider
    if (isMobile) {
        // Let CSS handle mobile styling completely
        return; // Exit early on mobile
    }

    // Clone cards for infinite loop
    const clonedCardsStart = originalCards.map(card => card.cloneNode(true));
    const clonedCardsEnd = originalCards.map(card => card.cloneNode(true));
    
    // Append cloned cards to create infinite loop
    clonedCardsEnd.forEach(card => sliderTrack.appendChild(card));
    clonedCardsStart.reverse().forEach(card => sliderTrack.insertBefore(card, sliderTrack.firstChild));
    
    // Get all cards including clones
    const cards = sliderTrack.querySelectorAll('.partnership-card');
    const totalOriginalCards = originalCards.length;

    let currentIndex = totalOriginalCards; // Start from the first original card (after clones)
    let cardWidth = 0;
    let cardsPerView = 1;
    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let animationID = 0;
    let isTransitioning = false;

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
        const translateX = -currentIndex * cardWidth;
        
        if (animate && !isTransitioning) {
            sliderTrack.style.transition = 'transform 0.3s ease-out';
            isTransitioning = true;
        } else if (!animate) {
            sliderTrack.style.transition = 'none';
        }
        
        sliderTrack.style.transform = `translateX(${translateX}px)`;
        currentTranslate = translateX;
        prevTranslate = translateX;
        
        // Handle infinite loop
        if (animate) {
            setTimeout(() => {
                isTransitioning = false;
                checkAndResetPosition();
            }, 300);
        }
    }
    
    // Check if we need to reset position for infinite loop
    function checkAndResetPosition() {
        // If we're at or past the end clones, jump back to the corresponding position in original cards
        if (currentIndex >= totalOriginalCards * 2) {
            currentIndex = currentIndex - totalOriginalCards;
            updateSliderPosition(false);
        }
        // If we're in the start clones, jump forward to the corresponding position in original cards
        else if (currentIndex < totalOriginalCards) {
            currentIndex = currentIndex + totalOriginalCards;
            updateSliderPosition(false);
        }
    }

    // Arrow navigation - infinite scrolling, no boundaries
    leftArrow.addEventListener('click', () => {
        if (!isTransitioning) {
            currentIndex--;
            updateSliderPosition(true);
        }
    });

    rightArrow.addEventListener('click', () => {
        if (!isTransitioning) {
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
        
        // Determine if we should move to next or previous slide (infinite)
        if (movedBy < -50) {
            currentIndex++;
        } else if (movedBy > 50) {
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
