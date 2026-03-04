/**
 * Single Post Page JavaScript
 */

// Get post ID from URL
function getPostId() {
    const urlParams = new URLSearchParams(window.location.search);
    return parseInt(urlParams.get('id'));
}

// Load posts
function loadPosts() {
    const savedPosts = localStorage.getItem('aktrade_posts');
    if (savedPosts) {
        return JSON.parse(savedPosts);
    }
    
    // Default posts
    return [
        {
            id: 1,
            title: 'Hướng dẫn trade crypto cho người mới bắt đầu',
            excerpt: 'Bài viết chi tiết về cách bắt đầu giao dịch crypto từ con số 0.',
            content: `
                <h2>Giới thiệu</h2>
                <p>Crypto trading là một lĩnh vực đầy tiềm năng nhưng cũng đầy rủi ro. Bài viết này sẽ hướng dẫn bạn những bước cơ bản để bắt đầu.</p>
                
                <h2>Bước 1: Tìm hiểu kiến thức cơ bản</h2>
                <p>Trước khi bắt đầu, bạn cần hiểu:</p>
                <ul>
                    <li>Blockchain là gì?</li>
                    <li>Các loại cryptocurrency phổ biến</li>
                    <li>Cách thức hoạt động của sàn giao dịch</li>
                    <li>Các thuật ngữ cơ bản: Long, Short, Leverage, Stop Loss...</li>
                </ul>

                <h2>Bước 2: Chọn sàn giao dịch uy tín</h2>
                <p>Một số sàn được khuyên dùng:</p>
                <ul>
                    <li><strong>ONUS</strong> - Sàn Việt Nam, dễ sử dụng cho người mới</li>
                    <li><strong>Binance</strong> - Sàn lớn nhất thế giới</li>
                    <li><strong>Exness</strong> - Chuyên về Forex và CFD</li>
                </ul>

                <h2>Bước 3: Quản lý vốn và rủi ro</h2>
                <p>Đây là yếu tố quan trọng nhất:</p>
                <ul>
                    <li>Chỉ đầu tư số tiền bạn có thể chấp nhận mất</li>
                    <li>Luôn đặt Stop Loss</li>
                    <li>Không sử dụng đòn bẩy quá cao khi mới bắt đầu</li>
                    <li>Đa dạng hóa danh mục đầu tư</li>
                </ul>

                <h2>Kết luận</h2>
                <p>Trading crypto cần kiên nhẫn và học hỏi liên tục. Hãy bắt đầu với số vốn nhỏ và tăng dần khi đã có kinh nghiệm.</p>
            `,
            category: 'huong-dan',
            status: 'published',
            image: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=1200',
            createdAt: '2026-03-01T10:00:00Z'
        },
        {
            id: 2,
            title: 'Phân tích thị trường Bitcoin tuần này',
            excerpt: 'Tổng quan về xu hướng BTC và các mức giá quan trọng.',
            content: `
                <h2>Tổng quan thị trường</h2>
                <p>Bitcoin đang trong xu hướng tăng mạnh sau khi phá vỡ mức kháng cự $45,000.</p>

                <h2>Phân tích kỹ thuật</h2>
                <ul>
                    <li><strong>Hỗ trợ:</strong> $43,500 - $44,000</li>
                    <li><strong>Kháng cự:</strong> $47,000 - $48,000</li>
                    <li><strong>RSI:</strong> 65 (vùng trung tính)</li>
                    <li><strong>MACD:</strong> Tín hiệu tích cực</li>
                </ul>

                <h2>Dự báo</h2>
                <p>Nếu BTC giữ được vùng $44,000, khả năng cao sẽ test lại $48,000 trong tuần tới.</p>
            `,
            category: 'phan-tich',
            status: 'published',
            image: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=1200',
            createdAt: '2026-03-02T14:30:00Z'
        }
    ];
}

// Get category name
function getCategoryName(category) {
    const categories = {
        'huong-dan': '📚 Hướng dẫn',
        'phan-tich': '📊 Phân tích',
        'tin-tuc': '📰 Tin tức',
        'kien-thuc': '💡 Kiến thức'
    };
    return categories[category] || category;
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Load and display post
function loadPost() {
    const postId = getPostId();
    const posts = loadPosts();
    const post = posts.find(p => p.id === postId);

    if (!post) {
        document.getElementById('postTitleMain').textContent = 'Bài viết không tồn tại';
        document.getElementById('postContent').innerHTML = '<p>Bài viết bạn đang tìm không tồn tại hoặc đã bị xóa.</p>';
        return;
    }

    // Update page title
    document.title = post.title + ' - AKtrade';
    document.getElementById('postTitle').textContent = post.title;
    document.getElementById('postDescription').content = post.excerpt || post.title;

    // Update post header
    document.getElementById('postCategory').textContent = getCategoryName(post.category);
    document.getElementById('postDate').textContent = formatDate(post.createdAt);
    document.getElementById('postTitleMain').textContent = post.title;
    document.getElementById('postExcerpt').textContent = post.excerpt || '';

    // Update featured image
    if (post.image) {
        document.getElementById('postFeaturedImage').innerHTML = `
            <img src="${post.image}" alt="${post.title}" onerror="this.style.display='none'">
        `;
    }

    // Update content
    document.getElementById('postContent').innerHTML = post.content || '<p>Nội dung đang được cập nhật...</p>';

    // Load related posts
    loadRelatedPosts(post.category, postId);

    // Setup share buttons
    setupShareButtons(post);
}

// Load related posts
function loadRelatedPosts(category, currentPostId) {
    const posts = loadPosts();
    const relatedPosts = posts
        .filter(p => p.category === category && p.id !== currentPostId && p.status === 'published')
        .slice(0, 3);

    const relatedPostsGrid = document.getElementById('relatedPostsGrid');
    const relatedPostsSection = document.getElementById('relatedPosts');

    if (relatedPosts.length === 0) {
        relatedPostsSection.style.display = 'none';
        return;
    }

    relatedPostsGrid.innerHTML = relatedPosts.map(post => `
        <article class="related-post-card" onclick="window.location.href='post.html?id=${post.id}'">
            <div class="related-post-image">
                <img src="${post.image || 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400'}" 
                     alt="${post.title}"
                     onerror="this.src='https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400'">
            </div>
            <div class="related-post-content">
                <span class="related-post-category">${getCategoryName(post.category)}</span>
                <h4>${post.title}</h4>
                <span class="related-post-date">${formatDate(post.createdAt)}</span>
            </div>
        </article>
    `).join('');
}

// Setup share buttons
function setupShareButtons(post) {
    const url = window.location.href;
    const title = post.title;
    const text = post.excerpt || post.title;

    // Facebook
    document.getElementById('shareFacebook').addEventListener('click', () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    });

    // Telegram
    document.getElementById('shareTelegram').addEventListener('click', () => {
        window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
    });

    // Twitter
    document.getElementById('shareTwitter').addEventListener('click', () => {
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, '_blank');
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadPost();
});

console.log('📄 Post page loaded!');
