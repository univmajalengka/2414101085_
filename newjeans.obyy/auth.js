// Authentication System for NewJeans Store

// State management (in-memory only for shipping data in artifacts context)
let shippingData = {
    method: '',
    address: '',
    phone: ''
};

// Check if user is logged in on page load
document.addEventListener('DOMContentLoaded', function() {
    checkLoginStatus();
    setupAuthModals();
});

// Check login status
function checkLoginStatus() {
    const currentUser = localStorage.getItem('currentUser');
    
    if (currentUser) {
        const user = JSON.parse(currentUser);
        showUserSection(user);
        
        // Add admin link if user is admin
        if (user.isAdmin) {
            addAdminLink();
        }
    } else {
        showAuthButtons();
    }
}

// Add admin dashboard link
function addAdminLink() {
    const userSection = document.getElementById('userSection');
    if (!document.getElementById('adminLink')) {
        const adminBtn = document.createElement('a');
        adminBtn.id = 'adminLink';
        adminBtn.href = 'admin.html';
        adminBtn.style.cssText = `
            background: rgba(255,255,255,0.2);
            padding: 0.3rem 0.8rem;
            border-radius: 15px;
            color: white;
            text-decoration: none;
            font-size: 0.8rem;
            margin-right: 0.5rem;
        `;
        adminBtn.textContent = '⚙️ Dashboard';
        userSection.insertBefore(adminBtn, userSection.firstChild);
    }
}

// Show user section when logged in
function showUserSection(user) {
    document.getElementById('authSection').style.display = 'none';
    document.getElementById('userSection').style.display = 'flex';
    document.getElementById('username').textContent = user.name;
}

// Show auth buttons when logged out
function showAuthButtons() {
    document.getElementById('authSection').style.display = 'flex';
    document.getElementById('userSection').style.display = 'none';
}

// Setup modal event listeners
function setupAuthModals() {
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const closeLogin = document.getElementById('closeLogin');
    const closeRegister = document.getElementById('closeRegister');
    const switchToRegister = document.getElementById('switchToRegister');
    const switchToLogin = document.getElementById('switchToLogin');
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    // Open login modal
    loginBtn.addEventListener('click', () => {
        loginModal.classList.add('active');
    });

    // Open register modal
    registerBtn.addEventListener('click', () => {
        registerModal.classList.add('active');
    });

    // Close modals
    closeLogin.addEventListener('click', () => {
        loginModal.classList.remove('active');
    });

    closeRegister.addEventListener('click', () => {
        registerModal.classList.remove('active');
    });

    // Close on outside click
    loginModal.addEventListener('click', (e) => {
        if (e.target === loginModal) {
            loginModal.classList.remove('active');
        }
    });

    registerModal.addEventListener('click', (e) => {
        if (e.target === registerModal) {
            registerModal.classList.remove('active');
        }
    });

    // Switch between modals
    switchToRegister.addEventListener('click', () => {
        loginModal.classList.remove('active');
        registerModal.classList.add('active');
    });

    switchToLogin.addEventListener('click', () => {
        registerModal.classList.remove('active');
        loginModal.classList.add('active');
    });

    // Handle login form
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleLogin();
    });

    // Handle register form
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleRegister();
    });

    // Handle logout
    logoutBtn.addEventListener('click', () => {
        handleLogout();
    });
}

// Handle login
function handleLogin() {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    // Validation
    if (!email || !password) {
        showNotification('Email dan password harus diisi!', 'error');
        return;
    }

    // Check for admin login
    if (email === 'admin@newjeans.store' && password === 'admin123') {
        localStorage.setItem('currentUser', JSON.stringify({
            id: 0,
            name: 'Admin',
            email: 'admin@newjeans.store',
            isAdmin: true
        }));
        showNotification('Welcome Admin! Redirecting to dashboard...', 'success');
        setTimeout(() => {
            window.location.href = 'admin.html';
        }, 1000);
        return;
    }

    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');

    // Find user
    const user = users.find(u => u.email === email);

    if (!user) {
        showNotification('Email tidak terdaftar!', 'error');
        return;
    }

    if (user.password !== password) {
        showNotification('Password salah!', 'error');
        return;
    }

    // Login success
    localStorage.setItem('currentUser', JSON.stringify({
        id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: false
    }));

    showNotification('Login berhasil! Selamat datang, ' + user.name, 'success');
    showUserSection(user);
    document.getElementById('loginModal').classList.remove('active');
    document.getElementById('loginForm').reset();
}

// Handle register
function handleRegister() {
    const name = document.getElementById('registerName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;

    // Validation
    if (!name || !email || !password || !confirmPassword) {
        showNotification('Semua field harus diisi!', 'error');
        return;
    }

    if (!isValidEmail(email)) {
        showNotification('Email tidak valid!', 'error');
        return;
    }

    if (password.length < 6) {
        showNotification('Password minimal 6 karakter!', 'error');
        return;
    }

    if (password !== confirmPassword) {
        showNotification('Password tidak cocok!', 'error');
        return;
    }

    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');

    // Check if email already exists
    if (users.some(u => u.email === email)) {
        showNotification('Email sudah terdaftar!', 'error');
        return;
    }

    // Create new user
    const newUser = {
        id: Date.now(),
        name: name,
        email: email,
        password: password,
        createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    showNotification('Registrasi berhasil! Silakan login.', 'success');
    document.getElementById('registerModal').classList.remove('active');
    document.getElementById('registerForm').reset();
    
    // Auto open login modal
    setTimeout(() => {
        document.getElementById('loginModal').classList.add('active');
    }, 500);
}

// Handle logout
function handleLogout() {
    if (confirm('Yakin ingin logout?')) {
        localStorage.removeItem('currentUser');
        showAuthButtons();
        showNotification('Logout berhasil!', 'success');
        
        // Clear cart if needed
        // cart = [];
        // updateCartUI();
    }
}

// Validate email format
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 2000;
        animation: slideInRight 0.3s ease;
        max-width: 300px;
        word-wrap: break-word;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Checkout function - must be logged in
function checkout() {
    // Check if user is logged in
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    
    if (!currentUser || currentUser.isAdmin) {
        showNotification('Silakan login terlebih dahulu untuk checkout!', 'error');
        document.getElementById('cartDropdown').classList.remove('active');
        setTimeout(() => {
            document.getElementById('loginModal').classList.add('active');
        }, 500);
        return;
    }
    
    if (cart.length === 0) return;
    
    // Show shipping modal
    showShippingModal();
}

function showShippingModal() {
    const totalPrice = cart.reduce((sum, item) => {
        const price = parseInt(item.price.replace(/[^\d]/g, ''));
        return sum + (price * item.quantity);
    }, 0);
    
    const modal = document.createElement('div');
    modal.id = 'shippingModal';
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 500px;">
            <button class="modal-close" onclick="closeShippingModal()">×</button>
            <h2>Pilih Metode Pengiriman</h2>
            
            <div style="margin: 1.5rem 0;">
                <div style="background: #f8f9fa; padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
                    <strong>Total Belanja:</strong>
                    <div style="font-size: 1.5rem; color: rgb(255, 74, 128); font-weight: bold; margin-top: 0.5rem;">
                        Rp ${totalPrice.toLocaleString('id-ID')}
                    </div>
                </div>
                
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Ekspedisi:</label>
                    <select id="shippingMethod" style="width: 100%; padding: 0.75rem; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 1rem;">
                        <option value="">Pilih Ekspedisi</option>
                        <option value="jne">JNE - Rp 15.000 (2-3 hari)</option>
                        <option value="jnt">J&T Express - Rp 12.000 (2-4 hari)</option>
                    </select>
                </div>
                
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Alamat Pengiriman:</label>
                    <textarea id="shippingAddress" placeholder="Masukkan alamat lengkap..." style="width: 100%; min-height: 100px; padding: 0.75rem; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 1rem; font-family: inherit; resize: vertical;"></textarea>
                </div>
                
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Nomor Telepon:</label>
                    <input type="tel" id="shippingPhone" placeholder="08xxxxxxxxxx" style="width: 100%; padding: 0.75rem; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 1rem;">
                </div>
                
                <div id="totalWithShipping" style="background: #f0f0f0; padding: 1rem; border-radius: 8px; margin-top: 1rem; display: none;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                        <span>Subtotal:</span>
                        <span>Rp ${totalPrice.toLocaleString('id-ID')}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                        <span>Ongkir:</span>
                        <span id="shippingCost">Rp 0</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 1.2rem; color: rgb(255, 74, 128); border-top: 2px solid #ddd; padding-top: 0.5rem; margin-top: 0.5rem;">
                        <span>Total:</span>
                        <span id="grandTotal">Rp ${totalPrice.toLocaleString('id-ID')}</span>
                    </div>
                </div>
            </div>
            
            <button class="submit-btn" onclick="processCheckout()">Proses Checkout</button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add event listener for shipping method
    document.getElementById('shippingMethod').addEventListener('change', function() {
        const method = this.value;
        const totalDiv = document.getElementById('totalWithShipping');
        const shippingCostSpan = document.getElementById('shippingCost');
        const grandTotalSpan = document.getElementById('grandTotal');
        
        if (method) {
            const shippingCost = method === 'jne' ? 15000 : 12000;
            const grandTotal = totalPrice + shippingCost;
            
            // Store in memory
            shippingData.method = method;
            
            totalDiv.style.display = 'block';
            shippingCostSpan.textContent = `Rp ${shippingCost.toLocaleString('id-ID')}`;
            grandTotalSpan.textContent = `Rp ${grandTotal.toLocaleString('id-ID')}`;
        } else {
            totalDiv.style.display = 'none';
        }
    });
    
    // Store address and phone in memory when changed
    document.getElementById('shippingAddress').addEventListener('input', function() {
        shippingData.address = this.value;
    });
    
    document.getElementById('shippingPhone').addEventListener('input', function() {
        shippingData.phone = this.value;
    });
}

function closeShippingModal() {
    const modal = document.getElementById('shippingModal');
    if (modal) {
        modal.remove();
    }
}

function processCheckout() {
    const shippingMethod = document.getElementById('shippingMethod').value;
    const shippingAddress = document.getElementById('shippingAddress').value.trim();
    const shippingPhone = document.getElementById('shippingPhone').value.trim();
    
    // Validation
    if (!shippingMethod) {
        showNotification('Pilih metode pengiriman!', 'error');
        return;
    }
    
    if (!shippingAddress) {
        showNotification('Masukkan alamat pengiriman!', 'error');
        return;
    }
    
    if (!shippingPhone) {
        showNotification('Masukkan nomor telepon!', 'error');
        return;
    }
    
    if (shippingPhone.length < 10) {
        showNotification('Nomor telepon tidak valid!', 'error');
        return;
    }
    
    const totalPrice = cart.reduce((sum, item) => {
        const price = parseInt(item.price.replace(/[^\d]/g, ''));
        return sum + (price * item.quantity);
    }, 0);
    
    const shippingCost = shippingMethod === 'jne' ? 15000 : 12000;
    const grandTotal = totalPrice + shippingCost;
    const shippingName = shippingMethod === 'jne' ? 'JNE' : 'J&T Express';
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    // Save order to localStorage
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const order = {
        id: Date.now(),
        userId: currentUser.id,
        userName: currentUser.name,
        userEmail: currentUser.email,
        items: cart,
        subtotal: totalPrice,
        shipping: {
            method: shippingName,
            cost: shippingCost,
            address: shippingAddress,
            phone: shippingPhone
        },
        total: grandTotal,
        status: 'pending',
        createdAt: new Date().toISOString()
    };
    
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // Show success message
    showNotification(`Checkout berhasil!\n\nOrder ID: #${order.id}\nTotal: Rp ${grandTotal.toLocaleString('id-ID')}\nPengiriman: ${shippingName}\n\nTerima kasih sudah berbelanja!`, 'success');
    
    // Clear cart and shipping data
    cart = [];
    shippingData = { method: '', address: '', phone: '' };
    updateCartUI();
    closeShippingModal();
    document.getElementById('cartDropdown').classList.remove('active');
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100px);
        }
    }
`;
document.head.appendChild(style);