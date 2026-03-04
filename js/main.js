// Navbar scroll effect
console.log('🚀 AKtrade v1.0 - Digital Finance Expert loaded!');

// Dynamically position ticker directly below navbar (pixel-perfect)
function positionTicker() {
    const navbar = document.getElementById('navbar');
    const ticker = document.querySelector('.market-ticker-wrapper');
    const hero = document.querySelector('.hero, .referral-hero, .roadmap-hero');

    if (navbar && ticker) {
        const navH = navbar.offsetHeight;
        ticker.style.top = navH + 'px';

        // Also push hero content below both fixed bars
        if (hero) {
            hero.style.paddingTop = (navH + ticker.offsetHeight + 40) + 'px';
        }
    }
}

document.addEventListener('DOMContentLoaded', positionTicker);
window.addEventListener('resize', positionTicker);

window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile menu toggle
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.querySelector('.nav-links');

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileMenuBtn.classList.toggle('active');
    });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Copy referral code
const copyCodeBtn = document.getElementById('copyCodeBtn');
const referralCode = document.getElementById('referralCode');

if (copyCodeBtn && referralCode) {
    copyCodeBtn.addEventListener('click', () => {
        const code = referralCode.textContent;
        navigator.clipboard.writeText(code).then(() => {
            const originalText = copyCodeBtn.innerHTML;
            copyCodeBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M16.667 5L7.5 14.167L3.333 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>Đã sao chép!</span>
            `;
            copyCodeBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';

            setTimeout(() => {
                copyCodeBtn.innerHTML = originalText;
                copyCodeBtn.style.background = '';
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy:', err);
            alert('Không thể sao chép. Vui lòng thử lại!');
        });
    });
}

// Copy referral link
const copyLinkBtn = document.getElementById('copyLinkBtn');
const referralLink = document.getElementById('referralLink');

if (copyLinkBtn && referralLink) {
    copyLinkBtn.addEventListener('click', () => {
        const link = referralLink.textContent;
        navigator.clipboard.writeText(link).then(() => {
            const originalText = copyLinkBtn.innerHTML;
            copyLinkBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M16.667 5L7.5 14.167L3.333 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>Đã sao chép!</span>
            `;
            copyLinkBtn.style.background = 'rgba(16, 185, 129, 0.2)';
            copyLinkBtn.style.color = '#10b981';

            setTimeout(() => {
                copyLinkBtn.innerHTML = originalText;
                copyLinkBtn.style.background = '';
                copyLinkBtn.style.color = '';
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy:', err);
            alert('Không thể sao chép. Vui lòng thử lại!');
        });
    });
}

// Social share buttons
const shareButtons = document.querySelectorAll('.share-btn');
shareButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const referralCode = document.getElementById('referralCode')?.textContent || 'CRYPTO2024VN';
        const referralLink = document.getElementById('referralLink')?.textContent || 'https://cryptoverse.vn/ref/CRYPTO2024VN';
        const message = `🚀 Tham gia cộng đồng AKtrade cùng tôi để nhận tín hiệu Crypto cực chuẩn! Sử dụng mã: ${referralCode}\n${referralLink}`;

        if (btn.classList.contains('facebook')) {
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`, '_blank');
        } else if (btn.classList.contains('telegram')) {
            window.open(`https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(message)}`, '_blank');
        } else if (btn.classList.contains('twitter')) {
            window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`, '_blank');
        }
    });
});

// Generic copy to clipboard function with feedback
function copyToClipboard(text, btn) {
    if (!text) return;

    const performCopy = (txt) => {
        if (navigator.clipboard && window.isSecureContext) {
            return navigator.clipboard.writeText(txt);
        } else {
            // Fallback for non-HTTPS or older browsers
            const textArea = document.createElement("textarea");
            textArea.value = txt;
            textArea.style.position = "fixed";
            textArea.style.left = "-999999px";
            textArea.style.top = "-999999px";
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            return new Promise((res, rej) => {
                document.execCommand('copy') ? res() : rej();
                textArea.remove();
            });
        }
    };

    performCopy(text).then(() => {
        const originalHTML = btn.innerHTML;
        const successColor = '#10b981';

        // Visual feedback
        btn.classList.add('copy-success');
        const feedback = document.createElement('span');
        feedback.innerText = ' Đã lưu!';
        feedback.style.fontSize = '12px';
        feedback.style.marginLeft = '5px';
        feedback.style.color = successColor;
        feedback.style.fontWeight = 'bold';

        // Save original state if not already saved
        if (!btn.dataset.originalContent) {
            btn.dataset.originalContent = originalHTML;
        }

        // Temporary change button appearance
        if (btn.tagName === 'BUTTON' || btn.classList.contains('copy-btn-trigger')) {
            btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${successColor}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
            btn.appendChild(feedback);
        }

        setTimeout(() => {
            btn.innerHTML = btn.dataset.originalContent;
            btn.classList.remove('copy-success');
            delete btn.dataset.originalContent;
        }, 2000);
    }).catch(err => {
        console.error('Lỗi sao chép:', err);
        alert('Không thể sao chép tự động. Vui lòng tự bôi đen và copy.');
    });
}

// Global listener for copy buttons
document.addEventListener('click', (e) => {
    const btn = e.target.closest('.copy-btn-trigger');
    if (btn) {
        // ALWAYS prevent default and stop propagation when clicking copy button specifically
        e.preventDefault();
        e.stopPropagation();

        const targetId = btn.dataset.target;
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
            copyToClipboard(targetEl.textContent.trim(), btn);
        }
    }
}, true); // Use capture phase to catch it early if needed


// Form validation and submission
const signupForm = document.getElementById('signupForm');
if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form data
        const formData = {
            fullname: document.getElementById('fullname').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            password: document.getElementById('password').value,
            refCode: document.getElementById('refCode').value,
            terms: document.getElementById('terms').checked
        };

        // Validate
        if (!formData.terms) {
            alert('Vui lòng đồng ý với điều khoản sử dụng!');
            return;
        }

        if (formData.password.length < 8) {
            alert('Mật khẩu phải có ít nhất 8 ký tự!');
            return;
        }

        // Show loading state
        const submitBtn = signupForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span>Đang xử lý...</span>';
        submitBtn.disabled = true;

        // Simulate API call (replace with actual API endpoint)
        setTimeout(() => {
            console.log('Form data:', formData);

            // Show success message
            submitBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M16.667 5L7.5 14.167L3.333 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>Đăng ký thành công!</span>
            `;

            // Reset form
            setTimeout(() => {
                signupForm.reset();
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
                alert('🎉 Chúc mừng! Tài khoản của bạn đã được tạo thành công.\n\nVui lòng kiểm tra email để xác nhận tài khoản.');
            }, 2000);
        }, 1500);
    });
}

// Animate elements on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all cards and sections
document.querySelectorAll('.feature-card, .step-card, .tier-card, .stat-card, .resource-card, .bio-link-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease';
    observer.observe(el);
});

// Crypto price animation (simulated)
const cryptoPrice = document.querySelector('.crypto-price');
if (cryptoPrice) {
    setInterval(() => {
        const currentPrice = parseFloat(cryptoPrice.textContent.replace('$', '').replace(',', ''));
        const change = (Math.random() - 0.5) * 100;
        const newPrice = currentPrice + change;
        cryptoPrice.textContent = '$' + newPrice.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

        // Update change indicator
        const changeEl = document.querySelector('.change');
        if (changeEl) {
            const changePercent = ((change / currentPrice) * 100).toFixed(2);
            changeEl.textContent = (changePercent > 0 ? '+' : '') + changePercent + '%';
            changeEl.className = 'change ' + (changePercent > 0 ? 'positive' : 'negative');
        }
    }, 3000);
}

// Stats counter animation
const animateCounter = (element, target, duration = 2000) => {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
};

// Trigger counter animation when stats come into view
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const value = entry.target.textContent;
            // Only animate if it contains digits
            if (/\d/.test(value)) {
                if (value.includes('K')) {
                    const num = parseFloat(value) * 1000;
                    animateCounter(entry.target, num);
                    entry.target.textContent = value; // Keep original format
                } else if (!isNaN(parseFloat(value))) {
                    animateCounter(entry.target, parseFloat(value));
                }
            }
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-value').forEach(el => {
    if (!el.textContent.includes('$') && !el.textContent.includes('%') && /\d/.test(el.textContent)) {
        statsObserver.observe(el);
    }
});

// Particle movement
const particles = document.querySelectorAll('.particle');
particles.forEach((particle, index) => {
    setInterval(() => {
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
    }, 5000 + index * 1000);
});

// Add hover effect to gradient orbs
const orbs = document.querySelectorAll('.gradient-orb');
document.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;

    orbs.forEach((orb, index) => {
        const speed = (index + 1) * 20;
        const x = mouseX * speed;
        const y = mouseY * speed;
        orb.style.transform = `translate(${x}px, ${y}px)`;
    });
});

// ========== TRADINGVIEW CANDLESTICK CHART FUNCTIONALITY ==========

function loadTradingViewWidget(symbol) {
    const container = document.getElementById('tradingview_widget');
    if (!container) return;

    container.innerHTML = ''; // Clear previous widget

    // Check if TradingView is loaded
    if (typeof TradingView === 'undefined') {
        console.warn('TradingView library not loaded yet...');
        return;
    }

    new TradingView.widget({
        "width": "100%",
        "height": 850,
        "symbol": symbol,
        "interval": "D",
        "timezone": "Etc/UTC",
        "theme": "dark",
        "style": "1", // 1 is Candlesticks
        "locale": "vi",
        "toolbar_bg": "#f1f3f6",
        "enable_publishing": false,
        "hide_top_toolbar": false,
        "hide_legend": false,
        "save_image": false,
        "container_id": "tradingview_widget",
        "backgroundColor": "rgba(0, 0, 0, 0)",
        "gridColor": "rgba(255, 255, 255, 0.05)",
        "withdateranges": true,
        "range": "1M",
        "allow_symbol_change": true,
        "details": false,
        "hotlist": false,
        "calendar": false,
        "studies": [
            "RSI@tv-basicstudies"
        ],
        "show_popup_button": true,
        "popup_width": "1000",
        "popup_height": "650"
    });
}

// Global initialization
document.addEventListener('DOMContentLoaded', () => {
    const chartTabs = document.querySelectorAll('.chart-tab');
    if (chartTabs.length > 0) {
        // Load initial widget
        const initialSymbol = chartTabs[0].dataset.symbol || 'BINANCE:BTCUSDT';

        // Small delay to ensure tv.js is parsed
        setTimeout(() => {
            loadTradingViewWidget(initialSymbol);
        }, 500);

        chartTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Update active state
                chartTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                // Load new symbol
                const symbol = tab.dataset.symbol;
                loadTradingViewWidget(symbol);
            });
        });
    }

    // Coin item hover effect (simplified)
    const coinItems = document.querySelectorAll('.coin-item');
    coinItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.transform = 'translateY(-5px) scale(1.02)';
        });
        item.addEventListener('mouseleave', () => {
            item.style.transform = '';
        });
    });
});



// ========== FAQ ACCORDION ==========

const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');

    question.addEventListener('click', () => {
        // Close other items
        faqItems.forEach(otherItem => {
            if (otherItem !== item && otherItem.classList.contains('active')) {
                otherItem.classList.remove('active');
            }
        });

        // Toggle current item
        item.classList.toggle('active');
    });
});

console.log('❓ FAQ accordion initialized!');
