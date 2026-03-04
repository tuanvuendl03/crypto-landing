/**
 * Blog Page - Load posts
 * Hỗ trợ cả localStorage (không cần server) và PHP API (khi có server)
 */

// API Configuration
const API_BASE_URL = 'http://localhost/crypto-landing/api';
const USE_API = false; // Đổi thành true khi deploy lên hosting với PHP

let currentPage = 1;
let currentCategory = '';
const postsPerPage = 9;

// Load posts
async function loadPosts(page = 1, category = '') {
    if (USE_API) {
        await loadPostsFromAPI(page, category);
    } else {
        loadPostsFromLocalStorage(page, category);
    }
}

// Load từ localStorage (chạy trực tiếp trên trình duyệt)
function loadPostsFromLocalStorage(page = 1, category = '') {
    const savedPosts = localStorage.getItem('aktrade_posts');
    
    if (!savedPosts) {
        displayDefaultPosts();
        return;
    }

    try {
        let posts = JSON.parse(savedPosts);
        
        // Filter by status
        posts = posts.filter(post => post.status === 'published');
        
        // Filter by category
        if (category) {
            posts = posts.filter(post => post.category === category);
        }
        
        // Sort by date
        posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        // Pagination
        const total = posts.length;
        const start = (page - 1) * postsPerPage;
        const end = start + postsPerPage;
        const paginatedPosts = posts.slice(start, end);
        
        if (paginatedPosts.length > 0) {
            displayPosts(paginatedPosts);
            updatePagination({
                page: page,
                limit: postsPerPage,
                total: total,
                totalPages: Math.ceil(total / postsPerPage)
            });
        } else {
            displayNoPosts();
        }
    } catch (error) {
        console.error('Error loading posts:', error);
        displayDefaultPosts();
    }
}

// Load từ PHP API (khi có server)
async function loadPostsFromAPI(page = 1, category = '') {
    try {
        const url = `${API_BASE_URL}/posts/get.php?status=published&page=${page}&limit=${postsPerPage}${category ? '&category=' + category : ''}`;
        const response = await fetch(url);
        const result = await response.json();

        if (result.success && result.data.posts) {
            displayPosts(result.data.posts);
            updatePagination(result.data.pagination);
        } else {
            displayNoPosts();
        }
    } catch (error) {
        console.error('Error loading posts from API:', error);
        console.log('Fallback to localStorage');
        loadPostsFromLocalStorage(page, category);
    }
}

// Initialize default posts (chỉ chạy 1 lần khi chưa có dữ liệu)
function initializeDefaultPosts() {
    const defaultPosts = [
        {
            id: 1,
            title: 'Hướng dẫn giao dịch Futures cho người mới bắt đầu',
            slug: 'huong-dan-giao-dich-futures-cho-nguoi-moi',
            excerpt: 'Bài viết chi tiết hướng dẫn cách giao dịch Futures từ A-Z, giúp bạn bắt đầu an toàn và hiệu quả.',
            content: '<h2>Giới thiệu về Futures Trading</h2><p>Futures (hợp đồng tương lai) là một công cụ phái sinh cho phép bạn giao dịch với đòn bẩy.</p>',
            category: 'huong-dan',
            status: 'published',
            image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800',
            author: 'Admin',
            views: 245,
            tags: ['futures', 'trading', 'guide'],
            publishedAt: '2026-03-01T10:00:00Z',
            createdAt: '2026-03-01T10:00:00Z'
        },
        {
            id: 2,
            title: 'Phân tích Bitcoin: Xu hướng tăng mạnh trong tuần này',
            slug: 'phan-tich-bitcoin-xu-huong-tang-manh',
            excerpt: 'Phân tích kỹ thuật chi tiết về Bitcoin với các mức giá quan trọng và dự báo xu hướng.',
            content: '<h2>Tổng quan thị trường</h2><p>Bitcoin đã phá vỡ mức kháng cự quan trọng $45,000.</p>',
            category: 'phan-tich',
            status: 'published',
            image: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=800',
            author: 'Admin',
            views: 312,
            tags: ['bitcoin', 'analysis'],
            publishedAt: '2026-03-02T14:30:00Z',
            createdAt: '2026-03-02T14:30:00Z'
        },
        {
            id: 3,
            title: 'Top 5 chiến lược giao dịch hiệu quả nhất 2026',
            slug: 'top-5-chien-luoc-giao-dich-hieu-qua',
            excerpt: 'Chia sẻ 5 chiến lược giao dịch được kiểm chứng với tỷ lệ thắng cao từ các trader chuyên nghiệp.',
            content: '<h2>1. Scalping</h2><p>Giao dịch siêu ngắn hạn với mục tiêu 0.5-1% lợi nhuận.</p>',
            category: 'kien-thuc',
            status: 'published',
            image: 'https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=800',
            author: 'Admin',
            views: 198,
            tags: ['strategy', 'trading'],
            publishedAt: '2026-03-03T09:15:00Z',
            createdAt: '2026-03-03T09:15:00Z'
        },
        {
            id: 4,
            title: 'Tin tức: Bitcoin ETF được chấp thuận tại nhiều quốc gia',
            slug: 'bitcoin-etf-duoc-chap-thuan',
            excerpt: 'Tin vui cho thị trường crypto khi nhiều quốc gia chấp thuận Bitcoin ETF.',
            content: '<h2>Tin tức nổi bật</h2><p>Ủy ban chứng khoán đã chấp thuận Bitcoin ETF.</p>',
            category: 'tin-tuc',
            status: 'published',
            image: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800',
            author: 'Admin',
            views: 276,
            tags: ['bitcoin', 'etf', 'news'],
            publishedAt: '2026-03-03T16:45:00Z',
            createdAt: '2026-03-03T16:45:00Z'
        },
        {
            id: 5,
            title: 'Cách sử dụng Stop Loss và Take Profit hiệu quả',
            slug: 'cach-su-dung-stop-loss-take-profit',
            excerpt: 'Hướng dẫn chi tiết cách đặt Stop Loss và Take Profit để bảo vệ vốn.',
            content: '<h2>Stop Loss là gì?</h2><p>Stop Loss là lệnh tự động đóng vị thế khi giá chạm mức lỗ.</p>',
            category: 'huong-dan',
            status: 'published',
            image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800',
            author: 'Admin',
            views: 189,
            tags: ['stop-loss', 'risk-management'],
            publishedAt: '2026-03-04T11:20:00Z',
            createdAt: '2026-03-04T11:20:00Z'
        },
        {
            id: 6,
            title: 'Phân tích Ethereum: Cơ hội mua vào sau đợt điều chỉnh',
            slug: 'phan-tich-ethereum-co-hoi-mua-vao',
            excerpt: 'ETH đang điều chỉnh về vùng hỗ trợ mạnh, đây có thể là cơ hội tốt để tích lũy.',
            content: '<h2>Tình hình hiện tại</h2><p>Ethereum đã điều chỉnh 8% từ đỉnh $2,800.</p>',
            category: 'phan-tich',
            status: 'published',
            image: 'https://images.unsplash.com/photo-1622630998477-20aa696ecb05?w=800',
            author: 'Admin',
            views: 234,
            tags: ['ethereum', 'analysis'],
            publishedAt: '2026-03-04T15:00:00Z',
            createdAt: '2026-03-04T15:00:00Z'
        }
    ];
    
    // Lưu vào localStorage
    localStorage.setItem('aktrade_posts', JSON.stringify(defaultPosts));
    console.log('✅ Đã khởi tạo 6 bài viết mẫu');
    
    return defaultPosts;
}

// Display default posts
function displayDefaultPosts() {
    const posts = initializeDefaultPosts();
    displayPosts(posts);
    updatePagination({
        page: 1,
        limit: postsPerPage,
        total: posts.length,
        totalPages: 1
    });
}

// Display posts
function displayPosts(posts) {
    const postsGrid = document.getElementById('blogPostsGrid');
    
    if (!postsGrid) return;

    postsGrid.innerHTML = posts.map(post => `
        <article class="blog-card">
            <div class="blog-card-image">
                <img src="${post.image || 'https://via.placeholder.com/400x250'}" alt="${post.title}">
                <span class="blog-category">${getCategoryName(post.category)}</span>
            </div>
            <div class="blog-card-content">
                <h3 class="blog-card-title">${post.title}</h3>
                <p class="blog-card-excerpt">${post.excerpt}</p>
                <div class="blog-card-meta">
                    <span>📅 ${formatDate(post.publishedAt)}</span>
                    <span>👁️ ${post.views} lượt xem</span>
                </div>
                <a href="post.html?slug=${post.slug}" class="btn btn-primary">
                    Đọc tiếp →
                </a>
            </div>
        </article>
    `).join('');
}

// Display no posts message
function displayNoPosts() {
    const postsGrid = document.getElementById('blogPostsGrid');
    if (postsGrid) {
        postsGrid.innerHTML = `
            <div class="no-posts">
                <div class="no-posts-icon">📝</div>
                <h3>Chưa có bài viết</h3>
                <p>Các bài viết sẽ được cập nhật sớm!</p>
            </div>
        `;
    }
}

// Update pagination
function updatePagination(pagination) {
    const paginationEl = document.querySelector('.pagination');
    if (!paginationEl) return;

    const { page, totalPages } = pagination;
    let html = '';

    if (page > 1) {
        html += `<button class="pagination-btn" onclick="changePage(${page - 1})">← Trước</button>`;
    }

    for (let i = 1; i <= totalPages; i++) {
        if (i === page) {
            html += `<button class="pagination-btn active">${i}</button>`;
        } else if (i === 1 || i === totalPages || (i >= page - 1 && i <= page + 1)) {
            html += `<button class="pagination-btn" onclick="changePage(${i})">${i}</button>`;
        } else if (i === page - 2 || i === page + 2) {
            html += `<span class="pagination-dots">...</span>`;
        }
    }

    if (page < totalPages) {
        html += `<button class="pagination-btn" onclick="changePage(${page + 1})">Tiếp →</button>`;
    }

    paginationEl.innerHTML = html;
}

// Change page
function changePage(page) {
    currentPage = page;
    loadPosts(page, currentCategory);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Filter by category
function filterByCategory(category, element) {
    currentCategory = (category === 'all') ? '' : category;
    currentPage = 1;
    loadPosts(1, currentCategory);

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    if (element) {
        element.classList.add('active');
    }
}

// Get category name
function getCategoryName(category) {
    const categories = {
        'huong-dan': 'Hướng dẫn',
        'phan-tich': 'Phân tích',
        'tin-tuc': 'Tin tức',
        'kien-thuc': 'Kiến thức'
    };
    return categories[category] || category;
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadPosts();

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const category = e.target.dataset.category || '';
            filterByCategory(category, e.target);
        });
    });
});

console.log('📰 Blog loaded!');
