// Initial product data - will be loaded from localStorage if exists
const defaultProducts = [
    {
        id: 1,
        title: "Album OMG & Ditto Danielle Version",
        price: "Rp 340.000",
        shipping: "Dikirim dari Majalengka, Indonesia",
        category: "album",
        soldOut: false,
        image: "https://cdn.discordapp.com/attachments/1367685753244487761/1432202746639155374/IMG_20251027_100128.jpg?ex=6900323f&is=68fee0bf&hm=9e6011466acfde12e7594f1edda6c12fca6972c5ee70c515b358ccbff429d8f0&"
    },
    {
        id: 2,
        title: "Album OMG & Ditto Hyein Version",
        price: "Rp 500.000",
        shipping: "Dikirim dari Majalengka, Indonesia",
        category: "album",
        soldOut: false,
        image: "https://cdn.discordapp.com/attachments/1367685753244487761/1432202747549188096/IMG_20251027_100136.jpg?ex=69003240&is=68fee0c0&hm=7fb082a6756092335e1e8b1f0d883c2687e18fe65c442e97ea91579abce6c84f&"
    },
    {
        id: 3,
        title: "Album How Sweet Danielle Version",
        price: "Rp 400.000",
        shipping: "Dikirim dari Majalengka, Indonesia",
        category: "album",
        soldOut: false,
        image: "https://cdn.discordapp.com/attachments/1367685753244487761/1432218405188009984/IMG_20251013_095417.jpg?ex=690040d5&is=68feef55&hm=b72b4d98eca363eb74cc5a4a06d6d877503d80aec5aeb7a94329751558125028&"
    },
    {
        id: 4,
        title: "Album Supernatural Haerin Version",
        price: "Rp 200.000",
        shipping: "Dikirim dari Bandung, Indonesia",
        category: "accessories",
        soldOut: false,
        image: "https://cdn.discordapp.com/attachments/1367685753244487761/1432218405670490322/IMG_20250918_185105.jpg?ex=690040d5&is=68feef55&hm=d720021721625f431a0a3e21b630c96f6fc411f4619b96a86285826877dbf8ec&"
    },
    {
        id: 5,
        title: "PPG Plushie Minji Version",
        price: "Rp 400.000",
        shipping: "Dikirim dari Batam, Indonesia",
        category: "accessories",
        soldOut: false,
        image: "https://i.ebayimg.com/images/g/9ZgAAOSwhpFmf0pO/s-l400.png"
    },
    {
        id: 6,
        title: "PPG Plushie Haerin version",
        price: "Rp 400.000",
        shipping: "Dikirim dari Bandung, Indonesia",
        category: "accessories",
        soldOut: false,
        image: "https://i.ebayimg.com/images/g/VP0AAOSwTj9mqKId/s-l400.png"
    },
    {
        id: 7,
        title: "Hanni Photocard OMG Set",
        price: "Rp 135.000",
        shipping: "Dikirim dari Bali, Indonesia",
        category: "accessories",
        soldOut: false,
        image: "https://media.bunjang.co.kr/product/351724839_1_1755696015_w%7Bres%7D.jpg"
    },
    {
        id: 8,
        title: "Hanni Photocard K-Merch",
        price: "Rp 195.000",
        shipping: "Dikirim dari Bali, Indonesia",
        category: "accessories",
        soldOut: false,
        image: "https://u-mercari-images.mercdn.net/photos/m94314705112_1.jpg?1735441888"
    },
    {
        id: 9,
        title: "Beach Bag NewJeans 'Get Up' Minji Version",
        price: "Rp 395.000",
        shipping: "Dikirim dari Semarang, Indonesia",
        category: "album",
        soldOut: false,
        image: "https://auctions.c.yimg.jp/images.auctions.yahoo.co.jp/image/dr000/auc0408/users/dec5879e131c75da783025da5d04bc1419613a08/i-img1200x900-1691889232qkbxbr2414310.jpg"
    },
    {
        id: 10,
        title: "Photocard Haerin Membership Exclusive",
        price: "Rp 1.200.000",
        shipping: "Dikirim dari Kyoto, Japan",
        category: "accessories",
        soldOut: false,
        image: "https://static.mercdn.net/item/detail/orig/photos/m29164112252_1.jpg?1740049470"
    },
    {
        id: 11,
        title: "1st Album 'NewJeans' Bluebook Haerin Version",
        price: "Rp 450.000",
        shipping: "Dikirim dari Tegal, Indonesia",
        category: "album",
        soldOut: false,
        image: "https://static.mercdn.net/item/detail/orig/photos/m86538136458_1.jpg?1755175226"
    },
    {
        id: 12,
        title: "How Sweet Album Group Version",
        price: "Rp 500.000",
        shipping: "Dikirim dari Bali, Indonesia",
        category: "album",
        soldOut: false,
        image: "https://cdn.k-ennews.com/news/photo/202404/804_1997_3835.jpg"
    }
];

// Initialize products from localStorage or use defaults
function initializeProducts() {
    const storedProducts = localStorage.getItem('products');
    if (!storedProducts) {
        localStorage.setItem('products', JSON.stringify(defaultProducts));
        return defaultProducts;
    }
    return JSON.parse(storedProducts);
}

let products = initializeProducts();
let currentFilter = 'all';
let cart = [];
let searchQuery = '';
let currentUser = null;
let users = JSON.parse(localStorage.getItem('users') || '[]');
let reviews = JSON.parse(localStorage.getItem('reviews') || '[]');
let selectedRating = 0;

// Reload products from localStorage (called after admin updates)
function reloadProducts() {
    products = JSON.parse(localStorage.getItem('products') || '[]');
    renderProducts(currentFilter, searchQuery);
}

// Listen for storage changes (when admin updates products)
window.addEventListener('storage', function(e) {
    if (e.key === 'products') {
        reloadProducts();
    }
});

// Periodically check for updates (for same-tab updates)
setInterval(function() {
    const stored = localStorage.getItem('products');
    if (stored) {
        const newProducts = JSON.parse(stored);
        if (JSON.stringify(newProducts) !== JSON.stringify(products)) {
            products = newProducts;
            renderProducts(currentFilter, searchQuery);
        }
    }
}, 2000);

function createProductCard(product) {
    const soldOutClass = product.soldOut ? 'sold-out' : '';
    const imageStyle = product.image 
        ? `style="background-image: url('${product.image}')"` 
        : 'class="placeholder"';
    
    return `
        <div class="product-card ${soldOutClass}" onclick="viewProduct(${product.id})">
            <div class="product-image" ${imageStyle}></div>
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <div class="product-price">${product.price}</div>
                <span class="product-shipping">${product.shipping}</span>
            </div>
            ${!product.soldOut ? `<button class="add-to-cart-btn" onclick="event.stopPropagation(); addToCart(${product.id})" title="Tambah ke keranjang">+</button>` : ''}
        </div>
    `;
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product || product.soldOut) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image || '',
            quantity: 1
        });
    }
    
    updateCartUI();
    showCartNotification(product.title);
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        updateCartUI();
    }
}

function removeFromCart(productId) {
    const index = cart.findIndex(item => item.id === productId);
    if (index !== -1) {
        cart.splice(index, 1);
        updateCartUI();
    }
}

function renderProducts(filterCategory = 'all', search = '') {
    const productsGrid = document.getElementById('productsGrid');
    let filteredProducts = products;

    if (filterCategory !== 'all') {
        const fc = String(filterCategory).toLowerCase();
        filteredProducts = filteredProducts.filter(product =>
            String(product.category || '').toLowerCase() === fc
        );
    }

    if (search) {
        const q = search.toLowerCase();
        filteredProducts = filteredProducts.filter(product =>
            product.title.toLowerCase().includes(q) ||
            (product.category || '').toLowerCase().includes(q)
        );
    }

    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: #666;">
                <h3>Produk tidak ditemukan</h3>
                <p>Coba kata kunci lain atau ubah filter kategori</p>
            </div>
        `;
    } else {
        productsGrid.innerHTML = filteredProducts.map(product => createProductCard(product)).join('');
    }
}

function setupFilters() {
    const filterButtons = document.querySelectorAll('.filter-button');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            let filterCategory = 'all';
            if (button.dataset && button.dataset.category) {
                filterCategory = button.dataset.category.toLowerCase();
            } else {
                const filterText = button.textContent.toLowerCase();
                if (filterText.includes('album')) filterCategory = 'album';
                else if (filterText.includes('accessories')) filterCategory = 'accessories';
                else if (filterText.includes('collaboration')) filterCategory = 'collaboration';
                else if (filterText.includes('limited')) filterCategory = 'limited';
                else filterCategory = 'all';
            }

            currentFilter = filterCategory;
            renderProducts(filterCategory, searchQuery);
        });
    });
}

function updateCartUI() {
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const cartFooter = document.getElementById('cartFooter');
    const cartTotal = document.getElementById('cartTotal');
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => {
        const price = parseInt(item.price.replace(/[^\d]/g, ''));
        return sum + (price * item.quantity);
    }, 0);
    
    cartCount.textContent = totalItems;
    cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="empty-cart">Keranjang belanja kosong</div>';
        cartFooter.style.display = 'none';
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-image" style="background-image: url('${item.image}')"></div>
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.title}</div>
                    <div class="cart-item-price">${item.price}</div>
                    <div class="cart-item-controls">
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                        <button class="remove-btn" onclick="removeFromCart(${item.id})">Hapus</button>
                    </div>
                </div>
            </div>
        `).join('');
        
        cartFooter.style.display = 'block';
        cartTotal.textContent = `Total: Rp ${totalPrice.toLocaleString('id-ID')}`;
    }
}

function showCartNotification(productTitle) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 2000;
        animation: slideInRight 0.3s ease;
    `;
    notification.innerHTML = `
        <strong>Ditambahkan ke keranjang!</strong><br>
        <small>${productTitle}</small>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    
    function performSearch() {
        searchQuery = searchInput.value;
        renderProducts(currentFilter, searchQuery);
    }
    
    searchInput.addEventListener('input', performSearch);
    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
}

function setupCart() {
    const cartButton = document.getElementById('cartButton');
    const cartDropdown = document.getElementById('cartDropdown');
    
    cartButton.addEventListener('click', function(e) {
        e.stopPropagation();
        cartDropdown.classList.toggle('active');
    });
    
    document.addEventListener('click', function(e) {
        if (!cartDropdown.contains(e.target) && !cartButton.contains(e.target)) {
            cartDropdown.classList.remove('active');
        }
    });
    
    cartDropdown.addEventListener('click', function(e) {
        e.stopPropagation();
    });
}
// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    renderProducts();
    setupFilters();
    setupSearch();
    setupCart();
    updateCartUI();
});