<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tugas PHP | NewJeans Artist Homepage</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <!-- Header -->
    <header class="header">
        <div class="header-content">
            <div class="logo">How Sweet <span class="italic">Store</span></div>
            <div class="header-middle">
                <div class="search-container">
                    <input type="text" class="search-input" id="searchInput" placeholder="Cari produk NewJeans...">
                    <button class="search-button" id="searchButton">🔍</button>
                </div>
            </div>
            
            <div class="header-right">
                <nav>
                    <ul class="nav-menu">
                        <li><a href="/index.php">Home</a></li>
                        <li><a href="/about.html">About</a></li>
                        <li><a href="/contact.html">Contact</a></li>
                    </ul>
                </nav>
                
                <!-- Auth Section -->
                <div id="authSection" class="auth-buttons">
                    <button class="auth-btn" id="loginBtn">Login</button>
                    <button class="auth-btn" id="registerBtn">Register</button>
                </div>
                
                <div id="userSection" class="user-info" style="display: none;">
                    <span>Hello, <span id="username"></span>!</span>
                    <button class="logout-btn" id="logoutBtn">Logout</button>
                </div>
                
                <div class="cart-container">
                    <button class="cart-button" id="cartButton">
                        🛒
                        <span class="cart-count" id="cartCount">0</span>
                    </button>
                    
                    <div class="cart-dropdown" id="cartDropdown">
                        <div class="cart-header">Shopping Cart</div>
                        <div class="cart-items" id="cartItems">
                            <div class="empty-cart">Keranjang belanja kosong</div>
                        </div>
                        <div class="cart-footer" id="cartFooter" style="display: none;">
                            <div class="cart-total" id="cartTotal">Total: Rp 0</div>
                            <button class="checkout-btn" onclick="checkout()">Checkout</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </header>

    <!-- Artist Banner -->
    <section class="artist-banner">
        <img src="https://upload.wikimedia.org/wikipedia/commons/e/ef/NewJeans_logo_-_Supernatural.png" height="150"
             style="margin-bottom:20px;"
             alt="NewJeans Logo" 
             class="artist-logo">
        <p class="artist-description">Official merchandise, exclusive items, and preloved collections.</p>
    </section>

    <!-- Filter Section -->
    <section class="filter-section">
        <div class="filter-content">
            <button class="filter-button active" data-category="all">All Products</button>
            <button class="filter-button" data-category="album">Album</button>
            <button class="filter-button" data-category="accessories">Accessories</button>
            <button class="filter-button" data-category="collaboration">Collaboration</button>
            <button class="filter-button" data-category="limited Edition">Limited Edition</button>
        </div>
    </section>

    <!-- Products Container -->
    <main class="products-container">
        <div class="products-grid" id="productsGrid">
            <!-- Products will be populated by JavaScript -->
        </div>
        
        <!-- Reviews Section -->
        <div class="reviews-section">
            <div class="reviews-header">
                <h3 class="reviews-title">Ulasan Produk</h3>
                <div class="review-stats">
                    <div class="stars" id="averageStars">
                        <span class="star">★</span>
                        <span class="star">★</span>
                        <span class="star">★</span>
                        <span class="star">★</span>
                        <span class="star">★</span>
                    </div>
                    <span id="reviewCount">(0 ulasan)</span>
                </div>
                <button class="add-review-btn" id="addReviewBtn">Tulis Ulasan</button>
            </div>
            
            
            <!-- Review Form -->
            <div class="review-form" id="reviewForm">
                <h4 style="margin-bottom: 1rem;">Tulis Ulasan Anda</h4>
                <div class="form-group">
                    <label>Rating:</label>
                    <div class="rating-input" id="ratingInput">
                        <span class="rating-star" data-rating="1">★</span>
                        <span class="rating-star" data-rating="2">★</span>
                        <span class="rating-star" data-rating="3">★</span>
                        <span class="rating-star" data-rating="4">★</span>
                        <span class="rating-star" data-rating="5">★</span>
                    </div>
                </div>
                <div class="form-group">
                    <label for="reviewText">Ulasan:</label>
                    <textarea id="reviewText" class="review-textarea" placeholder="Tulis ulasan Anda tentang produk..."></textarea>
                </div>
                <div class="review-form-buttons">
                    <button class="submit-btn" id="submitReview">Kirim Ulasan</button>
                    <button class="cancel-review-btn" id="cancelReview">Batal</button>
                </div>
            </div>
            
            <!-- Reviews List -->
            <div class="reviews-list" id="reviewsList">
                <div class="no-reviews">Belum ada ulasan. Jadilah yang pertama memberikan ulasan!</div>
            </div>
        </div>
    </main>

    <!-- Login Modal -->
    <div id="loginModal" class="modal">
        <div class="modal-content">
            <button class="modal-close" id="closeLogin">×</button>
            <h2>Login</h2>
            <form id="loginForm">
                <div class="form-group">
                    <label for="loginEmail">Email:</label>
                    <input type="email" id="loginEmail" required>
                </div>
                <div class="form-group">
                    <label for="loginPassword">Password:</label>
                    <input type="password" id="loginPassword" required>
                </div>
                <button type="submit" class="submit-btn">Login</button>
            </form>
            <div class="modal-switch">
                Belum punya akun? <a id="switchToRegister">Daftar di sini</a>
            </div>
        </div>
    </div>

    <!-- Register Modal -->
    <div id="registerModal" class="modal">
        <div class="modal-content">
            <button class="modal-close" id="closeRegister">×</button>
            <h2>Register</h2>
            <form id="registerForm">
                <div class="form-group">
                    <label for="registerName">Nama:</label>
                    <input type="text" id="registerName" required>
                </div>
                <div class="form-group">
                    <label for="registerEmail">Email:</label>
                    <input type="email" id="registerEmail" required>
                </div>
                <div class="form-group">
                    <label for="registerPassword">Password:</label>
                    <input type="password" id="registerPassword" required>
                </div>
                <div class="form-group">
                    <label for="registerConfirmPassword">Konfirmasi Password:</label>
                    <input type="password" id="registerConfirmPassword" required>
                </div>
                <button type="submit" class="submit-btn">Register</button>
            </form>
            <div class="modal-switch">
                Sudah punya akun? <a id="switchToLogin">Login di sini</a>
            </div>
        </div>
    </div>

    <script src="auth.js"></script>
    <script src="script.js"></script>
</body>
</html>