document.addEventListener('DOMContentLoaded', function() {
    // Auto-scroll functionality for ECOSYSTEM and MEGAMAFIA sections in mobile
    
    function initializeAutoScroll() {
        // Check if we're on mobile
        if (window.innerWidth > 768) {
            // Disable auto-scroll on desktop
            const ecosystemTrack = document.querySelector('.ecosystem-track');
            const partnershipsTrack = document.querySelector('.partnerships-track');
            
            if (ecosystemTrack) {
                ecosystemTrack.style.animation = 'none';
            }
            if (partnershipsTrack) {
                partnershipsTrack.style.animation = 'none';
            }
            return;
        }
        
        // Initialize ecosystem auto-scroll
        const ecosystemTrack = document.querySelector('.ecosystem-track');
        if (ecosystemTrack) {
            setupEcosystemAutoScroll(ecosystemTrack);
        }
        
        // Initialize partnerships auto-scroll
        const partnershipsTrack = document.querySelector('.partnerships-track');
        if (partnershipsTrack) {
            setupPartnershipsAutoScroll(partnershipsTrack);
        }
    }
    
    function setupEcosystemAutoScroll(track) {
        const cardWidth = 350; // Width of ecosystem card
        const gap = 30; // Gap between cards
        const totalCards = 7; // Number of original cards
        const totalWidth = totalCards * (cardWidth + gap);
        
        // Set up CSS animation
        track.style.animation = 'none'; // Reset any existing animation
        setTimeout(() => {
            track.style.animation = `ecosystemSlideAnimation 35s linear infinite`;
        }, 100);
        
        // Pause animation when page is not visible
        document.addEventListener('visibilitychange', function() {
            if (document.hidden) {
                track.style.animationPlayState = 'paused';
            } else {
                track.style.animationPlayState = 'running';
            }
        });
        
        // Pause on hover/touch for mobile interaction
        track.addEventListener('touchstart', function() {
            track.style.animationPlayState = 'paused';
        });
        
        track.addEventListener('touchend', function() {
            setTimeout(() => {
                track.style.animationPlayState = 'running';
            }, 2000); // Resume after 2 seconds
        });
    }
    
    function setupPartnershipsAutoScroll(track) {
        const cardWidth = 350; // Width of partnership card
        const gap = 40; // Gap between cards
        const totalCards = 2; // Number of original cards
        const totalWidth = totalCards * (cardWidth + gap);
        
        // Set up CSS animation
        track.style.animation = 'none'; // Reset any existing animation
        setTimeout(() => {
            track.style.animation = `partnershipsSlideAnimation 20s linear infinite`;
        }, 100);
        
        // Pause animation when page is not visible
        document.addEventListener('visibilitychange', function() {
            if (document.hidden) {
                track.style.animationPlayState = 'paused';
            } else {
                track.style.animationPlayState = 'running';
            }
        });
        
        // Pause on hover/touch for mobile interaction
        track.addEventListener('touchstart', function() {
            track.style.animationPlayState = 'paused';
        });
        
        track.addEventListener('touchend', function() {
            setTimeout(() => {
                track.style.animationPlayState = 'running';
            }, 2000); // Resume after 2 seconds
        });
    }
    
    // Initialize when DOM is ready with a small delay
    setTimeout(initializeAutoScroll, 500);
    
    // Re-initialize on window resize
    window.addEventListener('resize', function() {
        // Debounce resize events
        clearTimeout(window.autoScrollResizeTimeout);
        window.autoScrollResizeTimeout = setTimeout(initializeAutoScroll, 250);
    });
});