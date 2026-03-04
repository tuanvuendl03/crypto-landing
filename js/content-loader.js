/**
 * Content Loader - Load dynamic content
 * Hỗ trợ cả localStorage (không cần server) và PHP API (khi có server)
 */

// API Configuration (chỉ dùng khi có PHP server)
const API_BASE_URL = 'http://localhost/crypto-landing/api';
const USE_API = false; // Đổi thành true khi deploy lên hosting với PHP

// Load content
async function loadDynamicContent() {
    if (USE_API) {
        // Load từ PHP API
        await loadFromAPI();
    } else {
        // Load từ localStorage (không cần server)
        loadFromLocalStorage();
    }
}

// Load từ localStorage (chạy trực tiếp trên trình duyệt)
function loadFromLocalStorage() {
    const content = localStorage.getItem('aktrade_content');
    
    if (!content) {
        console.log('ℹ️ No custom content found, using default');
        return;
    }

    try {
        const data = JSON.parse(content);
        console.log('✅ Loading custom content from localStorage');

        // Update Hero Section
        if (data.hero) {
            updateHeroSection(data.hero);
        }

        // Update Stats
        if (data.stats) {
            updateStats(data.stats);
        }

        // Update Links
        if (data.links) {
            updateLinks(data.links);
        }

    } catch (error) {
        console.error('❌ Error loading content:', error);
    }
}

// Load từ PHP API (khi có server)
async function loadFromAPI() {
    try {
        const response = await fetch(`${API_BASE_URL}/content/get.php`);
        const result = await response.json();

        if (!result.success || !result.data) {
            console.log('ℹ️ No custom content found, using default');
            return;
        }

        const content = result.data;
        console.log('✅ Loading custom content from API');

        // Update Hero Section
        if (content.hero && content.hero.main) {
            updateHeroSection(content.hero.main);
        }

        // Update Stats
        if (content.stats && content.stats.main) {
            updateStats(content.stats.main);
        }

        // Update Links
        if (content.links && content.links.social) {
            updateLinks(content.links.social);
        }

    } catch (error) {
        console.error('❌ Error loading content from API:', error);
        console.log('ℹ️ Fallback to localStorage');
        loadFromLocalStorage();
    }
}

// Update Hero Section
function updateHeroSection(hero) {
    // Title
    const titleEl = document.querySelector('.hero-title');
    if (titleEl && hero.title) {
        const gradientText = titleEl.querySelector('.gradient-text');
        if (gradientText && hero.subtitle) {
            titleEl.innerHTML = hero.title.replace(hero.subtitle, '') + 
                `<span class="gradient-text">${hero.subtitle}</span>`;
        }
    }

    // Description
    const descEl = document.querySelector('.hero-description');
    if (descEl && hero.description) {
        descEl.textContent = hero.description;
    }
}

// Update Stats
function updateStats(stats) {
    const statItems = document.querySelectorAll('.stat-item');
    
    if (statItems.length >= 3) {
        // Followers
        if (stats.followers) {
            const followersValue = statItems[0].querySelector('.stat-value');
            if (followersValue) followersValue.textContent = stats.followers;
        }

        // Win Rate
        if (stats.winRate) {
            const winRateValue = statItems[1].querySelector('.stat-value');
            if (winRateValue) winRateValue.textContent = stats.winRate;
        }

        // Support
        if (stats.support) {
            const supportValue = statItems[2].querySelector('.stat-value');
            if (supportValue) supportValue.textContent = stats.support;
        }
    }
}

// Update Links
function updateLinks(links) {
    // Telegram Channel
    if (links.telegramChannel) {
        document.querySelectorAll('a[href*="t.me/Aktrade98"]').forEach(link => {
            if (!link.href.includes('_Chat')) {
                link.href = links.telegramChannel;
            }
        });
    }

    // Telegram Group
    if (links.telegramGroup) {
        document.querySelectorAll('a[href*="t.me/Aktrade98_Chat"]').forEach(link => {
            link.href = links.telegramGroup;
        });
    }

    // TikTok
    if (links.tiktok) {
        document.querySelectorAll('a[href*="tiktok.com"]').forEach(link => {
            link.href = links.tiktok;
        });
    }

    // YouTube
    if (links.youtube) {
        document.querySelectorAll('a[href*="youtube.com"]').forEach(link => {
            link.href = links.youtube;
        });
    }
}

// Auto load when page loads
document.addEventListener('DOMContentLoaded', () => {
    loadDynamicContent();
});

console.log('📦 Content Loader with API initialized');
