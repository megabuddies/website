function setupMobileAutoscroll() {
    // Enable only on mobile screens or explicitly mobile HTML
    var isMobileEnv = window.matchMedia('(max-width: 992px)').matches || document.documentElement.classList.contains('mobile');
    if (!isMobileEnv) return;

    var targets = [
        { selector: '#ecosystem .ecosystem-grid', speed: 24 },
        { selector: '#partnerships .partnerships-grid', speed: 18 }
    ];

    targets.forEach(function(cfg) {
        var container = document.querySelector(cfg.selector);
        if (!container) return;

        // Force horizontal scrollability even if inline styles tried to disable it
        ensureScrollable(container);

        enableAutoScroll(container, {
            speedPxPerSecond: cfg.speed
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
        var speedPxPerSecond = options.speedPxPerSecond || 20;

        var rafId = null;
        var lastTs = null;
        var paused = false;
        var userInteracting = false;
        var edgeRight = 0;
        var direction = 1; // 1 -> right, -1 -> left

        function computeEdges() {
            var overflow = container.scrollWidth - container.clientWidth;
            edgeRight = Math.max(0, overflow);
        }

        computeEdges();
        if (edgeRight <= 1) {
            return; // nothing to scroll
        }

        function step(ts) {
            if (paused || userInteracting) return;
            if (lastTs == null) lastTs = ts;
            var dt = Math.min(48, ts - lastTs);
            lastTs = ts;

            var delta = (speedPxPerSecond * dt) / 1000 * direction;
            var next = container.scrollLeft + delta;

            if (next >= edgeRight) {
                container.scrollLeft = edgeRight;
                direction = -1;
            } else if (next <= 0) {
                container.scrollLeft = 0;
                direction = 1;
            } else {
                container.scrollLeft = next;
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

        // Interaction handling: pause immediately on user action, resume after idle
        var idleTimer;
        function startIdleTimer() {
            if (idleTimer) clearTimeout(idleTimer);
            idleTimer = setTimeout(function() {
                userInteracting = false;
                resume();
            }, 2500);
        }

        function onUserInteract() {
            userInteracting = true;
            pause();
            startIdleTimer();
        }

        container.addEventListener('touchstart', onUserInteract, { passive: true });
        container.addEventListener('touchmove', onUserInteract, { passive: true });
        container.addEventListener('touchend', onUserInteract, { passive: true });
        container.addEventListener('wheel', onUserInteract, { passive: true });
        container.addEventListener('mousedown', onUserInteract);
        container.addEventListener('scroll', onUserInteract, { passive: true });

        document.addEventListener('visibilitychange', function() {
            if (document.hidden) {
                pause();
            } else if (!userInteracting) {
                resume();
            }
        });

        window.addEventListener('resize', function() {
            computeEdges();
        });
        window.addEventListener('orientationchange', function() {
            setTimeout(computeEdges, 300);
        });

        resume();

        container._autoScrollControl = {
            pause: pause,
            resume: resume,
            recalc: computeEdges,
            destroy: function() { pause(); }
        };
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupMobileAutoscroll);
} else {
    setupMobileAutoscroll();
}

