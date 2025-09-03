document.addEventListener('DOMContentLoaded', function() {
    // Enable only on mobile screens or explicitly mobile HTML
    var isMobile = window.matchMedia('(max-width: 992px)').matches || document.documentElement.classList.contains('mobile');
    if (!isMobile) return;

    // Targets: Ecosystem and Partnerships sections
    var targets = [
        { selector: '#ecosystem .ecosystem-grid', speed: 30, duplicate: true },
        { selector: '#partnerships .partnerships-grid', speed: 20, duplicate: false }
    ];

    targets.forEach(function(cfg) {
        var container = document.querySelector(cfg.selector);
        if (!container) return;
        // Avoid duplicating heavy embedded content (e.g., Twitter iframes)
        var hasHeavyEmbeds = !!container.querySelector('.twitter-embed-container, iframe, blockquote.twitter-tweet');
        enableAutoScroll(container, {
            speedPxPerSecond: cfg.speed,
            duplicate: cfg.duplicate && !hasHeavyEmbeds
        });
    });

    function enableAutoScroll(container, options) {
        var speedPxPerSecond = options.speedPxPerSecond || 25;
        var shouldDuplicate = !!options.duplicate;

        var rafId = null;
        var lastTs = null;
        var paused = false;
        var resetThreshold = 0;

        // If we duplicate, capture the original scrollWidth first, then duplicate children once
        if (shouldDuplicate) {
            // Measure original content width before duplication
            var originalWidth = container.scrollWidth;
            try {
                var fragment = document.createDocumentFragment();
                Array.prototype.slice.call(container.children).forEach(function(child) {
                    fragment.appendChild(child.cloneNode(true));
                });
                container.appendChild(fragment);
                resetThreshold = originalWidth; // loop after one original-width
            } catch (e) {
                // Fallback: if cloning fails for any reason, don't duplicate
                shouldDuplicate = false;
            }
        }

        if (!shouldDuplicate) {
            resetThreshold = Math.max(0, container.scrollWidth - container.clientWidth - 1);
        }

        var io = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    resume();
                } else {
                    pause();
                }
            });
        }, { threshold: 0.1 });
        io.observe(container);

        function step(ts) {
            if (paused) return;
            if (lastTs == null) lastTs = ts;
            var dt = Math.min(64, ts - lastTs); // cap to avoid large jumps
            lastTs = ts;

            var delta = (speedPxPerSecond * dt) / 1000;
            container.scrollLeft += delta;

            if (shouldDuplicate) {
                if (container.scrollLeft >= resetThreshold) {
                    // seamless wrap by subtracting one original-width
                    container.scrollLeft -= resetThreshold;
                }
            } else {
                var threshold = Math.max(0, container.scrollWidth - container.clientWidth - 1);
                if (container.scrollLeft >= threshold) {
                    // reset to start when we reach the end
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
            if (!paused) return;
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

        // Initial play
        play();

        // Expose simple controls on element for potential future use
        container._autoScrollControl = {
            pause: pause,
            resume: resume,
            destroy: function() { pause(); io.disconnect(); }
        };
    }
});

