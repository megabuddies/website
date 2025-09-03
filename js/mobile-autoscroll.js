function setupMobileAutoscroll() {
    // Enable only on mobile screens or explicitly mobile HTML
    var isMobileEnv = window.matchMedia('(max-width: 992px)').matches || document.documentElement.classList.contains('mobile');
    if (!isMobileEnv) return;

    var targets = [
        { selector: '#ecosystem .ecosystem-grid', speed: 30, duplicate: true },
        { selector: '#partnerships .partnerships-grid', speed: 20, duplicate: false }
    ];

    targets.forEach(function(cfg) {
        var container = document.querySelector(cfg.selector);
        if (!container) return;

        // Force horizontal scrollability even if inline styles tried to disable it
        ensureScrollable(container);

        var hasHeavyEmbeds = !!container.querySelector('.twitter-embed-container, iframe, blockquote.twitter-tweet');
        enableAutoScroll(container, {
            speedPxPerSecond: cfg.speed,
            duplicate: cfg.duplicate && !hasHeavyEmbeds
        });
    });

    function ensureScrollable(container) {
        try {
            container.style.setProperty('display', 'flex', 'important');
            container.style.setProperty('flex-wrap', 'nowrap', 'important');
            container.style.setProperty('overflow-x', 'auto', 'important');
            container.style.setProperty('overflow-y', 'hidden', 'important');
            container.style.setProperty('-webkit-overflow-scrolling', 'touch', 'important');
            container.style.setProperty('scroll-behavior', 'auto', 'important');
            container.style.setProperty('scroll-snap-type', 'none', 'important');
            // Ensure children do not wrap and keep fixed min-width
            Array.prototype.slice.call(container.children).forEach(function(child) {
                child.style.setProperty('flex', '0 0 auto', 'important');
            });
        } catch (e) {}
    }

    function enableAutoScroll(container, options) {
        var speedPxPerSecond = options.speedPxPerSecond || 25;
        var shouldDuplicate = !!options.duplicate;

        var rafId = null;
        var lastTs = null;
        var paused = false;
        var resetThreshold = 0;

        function computeThreshold() {
            if (shouldDuplicate) {
                // When duplicating, loop after the original width
                var originalWidth = 0;
                // We stored it in data attribute if already computed
                var stored = container.getAttribute('data-original-width');
                if (stored) {
                    originalWidth = parseFloat(stored) || 0;
                } else {
                    originalWidth = container.scrollWidth;
                    container.setAttribute('data-original-width', String(originalWidth));
                }
                resetThreshold = Math.max(1, originalWidth);
            } else {
                resetThreshold = Math.max(0, container.scrollWidth - container.clientWidth - 1);
            }
        }

        // Duplicate children once for seamless loop if allowed
        if (shouldDuplicate) {
            try {
                var originalWidthBefore = container.scrollWidth;
                var fragment = document.createDocumentFragment();
                Array.prototype.slice.call(container.children).forEach(function(child) {
                    fragment.appendChild(child.cloneNode(true));
                });
                container.appendChild(fragment);
                container.setAttribute('data-original-width', String(originalWidthBefore));
            } catch (e) {
                shouldDuplicate = false;
            }
        }

        computeThreshold();

        function step(ts) {
            if (paused) return;
            if (lastTs == null) lastTs = ts;
            var dt = Math.min(48, ts - lastTs);
            lastTs = ts;

            var delta = (speedPxPerSecond * dt) / 1000;
            container.scrollLeft += delta;

            if (shouldDuplicate) {
                if (container.scrollLeft >= resetThreshold) {
                    container.scrollLeft -= resetThreshold;
                }
            } else {
                var threshold = Math.max(0, container.scrollWidth - container.clientWidth - 1);
                if (container.scrollLeft >= threshold) {
                    container.scrollLeft = 0;
                }
            }

            rafId = requestAnimationFrame(step);
        }

        function play() {
            if (!rafId) rafId = requestAnimationFrame(step);
        }

        function pause() {
            paused = true;
            if (rafId) {
                cancelAnimationFrame(rafId);
                rafId = null;
            }
            lastTs = null;
        }

        function resume() {
            paused = false;
            play();
        }

        // Pause on user interaction and resume after inactivity
        var interactionTimeout;
        function interactionPause() {
            pause();
            if (interactionTimeout) clearTimeout(interactionTimeout);
            interactionTimeout = setTimeout(function() {
                resume();
            }, 2000);
        }

        container.addEventListener('touchstart', interactionPause, { passive: true });
        container.addEventListener('touchmove', interactionPause, { passive: true });
        container.addEventListener('wheel', interactionPause, { passive: true });
        container.addEventListener('mousedown', interactionPause);

        document.addEventListener('visibilitychange', function() {
            if (document.hidden) {
                pause();
            } else {
                resume();
            }
        });

        // Recompute on resize/orientation
        window.addEventListener('resize', function() {
            computeThreshold();
        });
        window.addEventListener('orientationchange', function() {
            setTimeout(computeThreshold, 300);
        });

        // Initial play
        resume();

        container._autoScrollControl = {
            pause: pause,
            resume: resume,
            recalc: computeThreshold,
            destroy: function() { pause(); }
        };
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupMobileAutoscroll);
} else {
    setupMobileAutoscroll();
}

