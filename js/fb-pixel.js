/**
 * Facebook Pixel Tracking Configuration
 * Cấu hình theo dõi chuyển đổi cho AKtrade Crypto Landing
 */

// ============================================
// BƯỚC 1: THAY ĐỔI PIXEL ID CỦA BẠN Ở ĐÂY
// ============================================
const FB_PIXEL_ID = 'YOUR_PIXEL_ID_HERE'; // Thay bằng Pixel ID thực của bạn

// ============================================
// KHỞI TẠO FACEBOOK PIXEL
// ============================================
!(function (f, b, e, v, n, t, s) {
    if (f.fbq) return;
    n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = !0;
    n.version = '2.0';
    n.queue = [];
    t = b.createElement(e);
    t.async = !0;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
})(
    window,
    document,
    'script',
    'https://connect.facebook.net/en_US/fbevents.js'
);

// Khởi tạo Pixel với ID của bạn
fbq('init', FB_PIXEL_ID);

// Track PageView tự động
fbq('track', 'PageView');

// ============================================
// CÁC HÀM TRACKING EVENTS
// ============================================

/**
 * Track khi người dùng xem nội dung
 * @param {string} contentName - Tên nội dung
 * @param {string} contentCategory - Danh mục
 */
function trackViewContent(contentName, contentCategory) {
    fbq('track', 'ViewContent', {
        content_name: contentName,
        content_category: contentCategory,
        content_type: 'product'
    });
    console.log('✅ FB Pixel: ViewContent tracked -', contentName);
}

/**
 * Track khi người dùng click vào CTA button
 * @param {string} buttonName - Tên button
 */
function trackCTAClick(buttonName) {
    fbq('track', 'Lead', {
        content_name: buttonName,
        content_category: 'CTA Button'
    });
    console.log('✅ FB Pixel: Lead tracked -', buttonName);
}

/**
 * Track khi người dùng đăng ký
 * @param {string} platform - Tên sàn (ONUS, Exness, ATX)
 */
function trackSignUp(platform) {
    fbq('track', 'CompleteRegistration', {
        content_name: 'Sign Up',
        content_category: platform,
        status: 'completed'
    });
    console.log('✅ FB Pixel: CompleteRegistration tracked -', platform);
}

/**
 * Track khi người dùng tham gia Telegram
 * @param {string} channelType - 'Channel' hoặc 'Group'
 */
function trackTelegramJoin(channelType) {
    fbq('track', 'Lead', {
        content_name: 'Telegram Join',
        content_category: channelType
    });
    console.log('✅ FB Pixel: Telegram Join tracked -', channelType);
}

/**
 * Track khi người dùng xem video
 * @param {number} percentage - Phần trăm video đã xem (25, 50, 75, 100)
 */
function trackVideoView(percentage) {
    fbq('trackCustom', 'VideoView', {
        video_percentage: percentage,
        content_name: 'Tutorial Video'
    });
    console.log('✅ FB Pixel: VideoView tracked -', percentage + '%');
}

/**
 * Track khi người dùng scroll trang
 * @param {number} percentage - Phần trăm trang đã scroll
 */
function trackPageScroll(percentage) {
    fbq('trackCustom', 'PageScroll', {
        scroll_percentage: percentage
    });
    console.log('✅ FB Pixel: PageScroll tracked -', percentage + '%');
}

/**
 * Track khi người dùng copy referral code
 * @param {string} code - Mã giới thiệu
 * @param {string} platform - Tên sàn
 */
function trackCopyReferralCode(code, platform) {
    fbq('trackCustom', 'CopyReferralCode', {
        referral_code: code,
        platform: platform
    });
    console.log('✅ FB Pixel: CopyReferralCode tracked -', platform, code);
}

// ============================================
// TỰ ĐỘNG TRACKING CÁC EVENTS
// ============================================

document.addEventListener('DOMContentLoaded', function () {
    console.log('🚀 Facebook Pixel initialized with ID:', FB_PIXEL_ID);

    // Track clicks vào CTA buttons
    const ctaButtons = document.querySelectorAll('.btn-cta-gold, .btn-primary');
    ctaButtons.forEach(button => {
        button.addEventListener('click', function () {
            const buttonText = this.textContent.trim();
            trackCTAClick(buttonText);
        });
    });

    // Track clicks vào Telegram links
    const telegramLinks = document.querySelectorAll('a[href*="t.me"]');
    telegramLinks.forEach(link => {
        link.addEventListener('click', function () {
            const href = this.getAttribute('href');
            const channelType = href.includes('_Chat') ? 'Group' : 'Channel';
            trackTelegramJoin(channelType);
        });
    });

    // Track clicks vào exchange links (ONUS, Exness, ATX)
    const exchangeLinks = {
        'goonus.io': 'ONUS',
        'exness': 'Exness',
        'atxs.io': 'ATX'
    };

    document.querySelectorAll('a[href]').forEach(link => {
        const href = link.getAttribute('href');
        for (const [domain, platform] of Object.entries(exchangeLinks)) {
            if (href.includes(domain)) {
                link.addEventListener('click', function () {
                    trackSignUp(platform);
                });
                break;
            }
        }
    });

    // Track copy referral code buttons
    const copyButtons = document.querySelectorAll('.copy-btn-trigger');
    copyButtons.forEach(button => {
        button.addEventListener('click', function () {
            const targetId = this.getAttribute('data-target');
            const codeElement = document.getElementById(targetId);
            if (codeElement) {
                const code = codeElement.textContent.trim();
                const platform = targetId.includes('Onus') ? 'ONUS' :
                    targetId.includes('Ex') ? 'Exness' : 'ATX';
                trackCopyReferralCode(code, platform);
            }
        });
    });

    // Track video views (nếu có video)
    const video = document.querySelector('#tutorialVideo');
    if (video) {
        let tracked25 = false, tracked50 = false, tracked75 = false, tracked100 = false;

        video.addEventListener('timeupdate', function () {
            const percentage = (video.currentTime / video.duration) * 100;

            if (percentage >= 25 && !tracked25) {
                trackVideoView(25);
                tracked25 = true;
            }
            if (percentage >= 50 && !tracked50) {
                trackVideoView(50);
                tracked50 = true;
            }
            if (percentage >= 75 && !tracked75) {
                trackVideoView(75);
                tracked75 = true;
            }
            if (percentage >= 95 && !tracked100) {
                trackVideoView(100);
                tracked100 = true;
            }
        });
    }

    // Track page scroll depth
    let scrollTracked = {
        25: false,
        50: false,
        75: false,
        100: false
    };

    window.addEventListener('scroll', function () {
        const scrollPercentage = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;

        for (const [threshold, tracked] of Object.entries(scrollTracked)) {
            if (scrollPercentage >= parseInt(threshold) && !tracked) {
                trackPageScroll(parseInt(threshold));
                scrollTracked[threshold] = true;
            }
        }
    });
});

// Export functions để có thể gọi từ nơi khác
window.fbPixelTracking = {
    trackViewContent,
    trackCTAClick,
    trackSignUp,
    trackTelegramJoin,
    trackVideoView,
    trackPageScroll,
    trackCopyReferralCode
};
