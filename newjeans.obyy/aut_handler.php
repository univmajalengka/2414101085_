// Authentication System for NewJeans Store

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
    } else {
        showAuthButtons();
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
        email: user.email
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