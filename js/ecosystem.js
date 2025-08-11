// Ecosystem JavaScript - Mega Buddies

class EcosystemManager {
    constructor() {
        this.init();
        this.setupEventListeners();
        this.loadLeaderboardData();
        this.updateDashboardCounters();
    }

    init() {
        console.log('Mega Buddies Ecosystem initialized');
        this.setupDropdownNavigation();
        this.setupDashboardClickHandlers();
    }

    setupEventListeners() {
        // Dashboard item click handlers
        document.querySelectorAll('.dashboard-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const target = item.getAttribute('data-target');
                if (target) {
                    this.scrollToSection(target);
                }
            });
        });

        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = link.getAttribute('href');
                this.scrollToSection(target);
            });
        });

        // Ecosystem card hover effects
        document.querySelectorAll('.ecosystem-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                this.addParticleEffect(card);
            });
        });
    }

    setupDropdownNavigation() {
        const dropdown = document.querySelector('.dropdown');
        const dropdownMenu = document.querySelector('.dropdown-menu');
        
        if (dropdown && dropdownMenu) {
            let hoverTimer;
            
            dropdown.addEventListener('mouseenter', () => {
                clearTimeout(hoverTimer);
                dropdownMenu.style.opacity = '1';
                dropdownMenu.style.visibility = 'visible';
                dropdownMenu.style.transform = 'translateY(0)';
            });
            
            dropdown.addEventListener('mouseleave', () => {
                hoverTimer = setTimeout(() => {
                    dropdownMenu.style.opacity = '0';
                    dropdownMenu.style.visibility = 'hidden';
                    dropdownMenu.style.transform = 'translateY(-10px)';
                }, 150);
            });
        }
    }

    setupDashboardClickHandlers() {
        // Add click handlers for dashboard items
        const dashboardItems = document.querySelectorAll('.dashboard-item');
        dashboardItems.forEach(item => {
            item.addEventListener('click', () => {
                this.animateClick(item);
            });
        });
    }

    scrollToSection(target) {
        const element = document.querySelector(target);
        if (element) {
            const headerHeight = document.querySelector('.main-header').offsetHeight;
            const elementPosition = element.offsetTop - headerHeight - 20;
            
            window.scrollTo({
                top: elementPosition,
                behavior: 'smooth'
            });
        }
    }

    animateClick(element) {
        element.style.transform = 'scale(0.95)';
        setTimeout(() => {
            element.style.transform = 'translateY(-5px)';
        }, 150);
    }

    addParticleEffect(card) {
        // Add subtle particle effect on hover
        const particles = document.createElement('div');
        particles.className = 'particle-effect';
        particles.innerHTML = '✦'.repeat(5);
        card.appendChild(particles);
        
        setTimeout(() => {
            if (particles.parentNode) {
                particles.parentNode.removeChild(particles);
            }
        }, 2000);
    }

    // API Integration for Leaderboard
    async loadLeaderboardData() {
        try {
            // Placeholder for actual API integration
            // Replace with real Quacks API endpoint
            const mockData = await this.getMockLeaderboardData();
            this.updateLeaderboard(mockData);
        } catch (error) {
            console.error('Failed to load leaderboard data:', error);
            this.showLeaderboardError();
        }
    }

    getMockLeaderboardData() {
        // Mock data for demonstration
        // Replace with actual API call to Quacks
        return new Promise(resolve => {
            setTimeout(() => {
                resolve([
                    { rank: 1, username: 'CryptoPunk2025', score: 15420, avatar: '🚀' },
                    { rank: 2, username: 'BuddyMaster', score: 14890, avatar: '⚡' },
                    { rank: 3, username: 'PixelWarrior', score: 13750, avatar: '🎯' },
                    { rank: 4, username: 'NeonHacker', score: 12340, avatar: '💎' },
                    { rank: 5, username: 'MegaBuilder', score: 11890, avatar: '🔥' }
                ]);
            }, 1000);
        });
    }

    updateLeaderboard(data) {
        const leaderboardPreview = document.querySelector('.leaderboard-preview');
        if (leaderboardPreview && data.length >= 3) {
            const top3 = data.slice(0, 3);
            leaderboardPreview.innerHTML = top3.map(user => `
                <div class="leaderboard-item">
                    <span class="rank">#${user.rank}</span>
                    <span class="user">${user.avatar} ${user.username}</span>
                    <span class="score">${user.score.toLocaleString()} XP</span>
                </div>
            `).join('');
        }
    }

    showLeaderboardError() {
        const leaderboardPreview = document.querySelector('.leaderboard-preview');
        if (leaderboardPreview) {
            leaderboardPreview.innerHTML = `
                <div class="leaderboard-error">
                    <p style="color: #ff6600; text-align: center;">
                        <i class="fas fa-exclamation-triangle"></i>
                        Unable to load leaderboard data
                    </p>
                </div>
            `;
        }
    }

    updateDashboardCounters() {
        // Update live counters
        this.updateActiveQuests();
        this.updateUserCount();
        
        // Set up periodic updates
        setInterval(() => {
            this.updateActiveQuests();
            this.updateUserCount();
        }, 30000); // Update every 30 seconds
    }

    async updateActiveQuests() {
        try {
            // Placeholder for Zealy API integration
            const questData = await this.getMockQuestData();
            const questElement = document.getElementById('active-quests');
            if (questElement) {
                questElement.textContent = `${questData.active} Active`;
                questElement.style.animation = 'pulse 1s ease-in-out';
                setTimeout(() => {
                    questElement.style.animation = '';
                }, 1000);
            }
        } catch (error) {
            console.error('Failed to update quest data:', error);
        }
    }

    async updateUserCount() {
        try {
            // Placeholder for user count API
            const userData = await this.getMockUserData();
            const userElement = document.getElementById('total-users');
            if (userElement) {
                userElement.textContent = `${userData.total.toLocaleString()} Users`;
            }
        } catch (error) {
            console.error('Failed to update user count:', error);
        }
    }

    getMockQuestData() {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve({
                    active: Math.floor(Math.random() * 20) + 10,
                    completed: Math.floor(Math.random() * 500) + 1200
                });
            }, 500);
        });
    }

    getMockUserData() {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve({
                    total: Math.floor(Math.random() * 100) + 1200,
                    online: Math.floor(Math.random() * 50) + 100
                });
            }, 500);
        });
    }

    // Utility method for API calls
    async fetchAPI(endpoint, options = {}) {
        try {
            const response = await fetch(endpoint, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                }
            });
            
            if (!response.ok) {
                throw new Error(`API request failed: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('API fetch error:', error);
            throw error;
        }
    }

    // Method to integrate with actual Quacks API
    async fetchQuacksLeaderboard() {
        // Replace with actual Quacks API endpoint
        const QUACKS_API_ENDPOINT = 'https://api.quacks.io/leaderboard/megabuddies';
        
        try {
            const data = await this.fetchAPI(QUACKS_API_ENDPOINT);
            return data;
        } catch (error) {
            console.error('Failed to fetch Quacks leaderboard:', error);
            return this.getMockLeaderboardData();
        }
    }

    // Method to integrate with Zealy API
    async fetchZealyQuests() {
        // Replace with actual Zealy API endpoint
        const ZEALY_API_ENDPOINT = 'https://api.zealy.io/communities/megabuddies/quests';
        
        try {
            const data = await this.fetchAPI(ZEALY_API_ENDPOINT);
            return data;
        } catch (error) {
            console.error('Failed to fetch Zealy quests:', error);
            return this.getMockQuestData();
        }
    }
}

// Enhanced animation effects
class EcosystemAnimations {
    constructor() {
        this.setupScrollAnimations();
        this.setupHoverEffects();
    }

    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe ecosystem cards
        document.querySelectorAll('.ecosystem-card').forEach(card => {
            observer.observe(card);
        });

        // Observe dashboard items
        document.querySelectorAll('.dashboard-item').forEach(item => {
            observer.observe(item);
        });
    }

    setupHoverEffects() {
        // Add enhanced hover effects for ecosystem cards
        document.querySelectorAll('.ecosystem-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                this.createGlowEffect(card);
            });
            
            card.addEventListener('mouseleave', () => {
                this.removeGlowEffect(card);
            });
        });
    }

    createGlowEffect(element) {
        const glow = document.createElement('div');
        glow.className = 'glow-effect';
        glow.style.cssText = `
            position: absolute;
            top: -2px;
            left: -2px;
            right: -2px;
            bottom: -2px;
            background: linear-gradient(45deg, #00ffff, #ff00ff, #00ffff);
            border-radius: 17px;
            z-index: -1;
            opacity: 0.3;
            filter: blur(3px);
            animation: glow-pulse 2s infinite;
        `;
        element.style.position = 'relative';
        element.appendChild(glow);
    }

    removeGlowEffect(element) {
        const glow = element.querySelector('.glow-effect');
        if (glow) {
            glow.remove();
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const ecosystem = new EcosystemManager();
    const animations = new EcosystemAnimations();
    
    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes glow-pulse {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 0.6; }
        }
        
        @keyframes animate-in {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .animate-in {
            animation: animate-in 0.6s ease-out forwards;
        }
        
        .particle-effect {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: #00ffff;
            font-size: 1.5rem;
            opacity: 0;
            pointer-events: none;
            animation: particle-float 2s ease-out;
        }
        
        @keyframes particle-float {
            0% {
                opacity: 0;
                transform: translate(-50%, -50%) scale(0.5);
            }
            50% {
                opacity: 1;
                transform: translate(-50%, -60%) scale(1);
            }
            100% {
                opacity: 0;
                transform: translate(-50%, -70%) scale(0.5);
            }
        }
    `;
    document.head.appendChild(style);
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { EcosystemManager, EcosystemAnimations };
}