// Admin Dashboard JavaScript

// Check if admin is logged in
document.addEventListener('DOMContentLoaded', function() {
    checkAdminAuth();
    loadProducts();
    setupProductForm();
});

function checkAdminAuth() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    
    if (!currentUser || !currentUser.isAdmin) {
        alert('Access denied! Admin only.');
        window.location.href = 'index.php';
        return;
    }
}

function loadProducts() {
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const tbody = document.getElementById('productsTableBody');
    const totalProducts = document.getElementById('totalProducts');
    
    totalProducts.textContent = products.length;
    
    if (products.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 2rem; color: #666;">No products yet. Add your first product!</td></tr>';
        return;
    }
    
    tbody.innerHTML = products.map(product => `
        <tr>
            <td>${product.id}</td>
            <td><img src="${product.image}" alt="${product.title}" class="product-img-small" onerror="this.src='https://via.placeholder.com/60'"></td>
            <td>${product.title}</td>
            <td>${product.price}</td>
            <td><span style="background: #e3f2fd; color: #1976d2; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.85rem;">${product.category}</span></td>
            <td>${product.soldOut ? '<span style="color: #f44336; font-weight: 600;">Sold Out</span>' : '<span style="color: #4caf50; font-weight: 600;">Available</span>'}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-secondary btn-small" onclick="editProduct(${product.id})">Edit</button>
                    <button class="btn btn-danger btn-small" onclick="deleteProduct(${product.id})">Delete</button>
                </div>
            </td>
        </tr>
    `).join('');
}

function openAddProductModal() {
    document.getElementById('modalTitle').textContent = 'Add New Product';
    document.getElementById('productForm').reset();
    document.getElementById('productId').value = '';
    document.getElementById('productModal').classList.add('active');
}

function closeProductModal() {
    document.getElementById('productModal').classList.remove('active');
}

function setupProductForm() {
    const form = document.getElementById('productForm');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        saveProduct();
    });
}

function saveProduct() {
    const id = document.getElementById('productId').value;
    const title = document.getElementById('productTitle').value.trim();
    const price = document.getElementById('productPrice').value;
    const category = document.getElementById('productCategory').value;
    const shipping = document.getElementById('productShipping').value.trim();
    const image = document.getElementById('productImage').value.trim();
    const soldOut = document.getElementById('productSoldOut').checked;
    
    if (!title || !price || !category || !shipping || !image) {
        showNotification('Please fill all required fields!', 'error');
        return;
    }
    
    let products = JSON.parse(localStorage.getItem('products') || '[]');
    
    const productData = {
        id: id ? parseInt(id) : Date.now(),
        title: title,
        price: `Rp ${parseInt(price).toLocaleString('id-ID')}`,
        shipping: `Dikirim dari ${shipping}`,
        category: category,
        soldOut: soldOut,
        image: image
    };
    
    if (id) {
        // Edit existing product
        const index = products.findIndex(p => p.id === parseInt(id));
        if (index !== -1) {
            products[index] = productData;
            showNotification('Product updated successfully!', 'success');
        }
    } else {
        // Add new product
        products.push(productData);
        showNotification('Product added successfully!', 'success');
    }
    
    // Save to localStorage
    localStorage.setItem('products', JSON.stringify(products));
    
    // Trigger storage event for other tabs (if any)
    window.dispatchEvent(new StorageEvent('storage', {
        key: 'products',
        newValue: JSON.stringify(products),
        url: window.location.href,
        storageArea: localStorage
    }));
    
    loadProducts();
    closeProductModal();
}

function editProduct(id) {
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const product = products.find(p => p.id === id);
    
    if (!product) return;
    
    document.getElementById('modalTitle').textContent = 'Edit Product';
    document.getElementById('productId').value = product.id;
    document.getElementById('productTitle').value = product.title;
    document.getElementById('productPrice').value = product.price.replace(/[^\d]/g, '');
    document.getElementById('productCategory').value = product.category;
    document.getElementById('productShipping').value = product.shipping.replace('Dikirim dari ', '');
    document.getElementById('productImage').value = product.image;
    document.getElementById('productSoldOut').checked = product.soldOut;
    
    document.getElementById('productModal').classList.add('active');
}

function deleteProduct(id) {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    let products = JSON.parse(localStorage.getItem('products') || '[]');
    products = products.filter(p => p.id !== id);
    
    localStorage.setItem('products', JSON.stringify(products));
    
    // Trigger storage event
    window.dispatchEvent(new StorageEvent('storage', {
        key: 'products',
        newValue: JSON.stringify(products),
        url: window.location.href,
        storageArea: localStorage
    }));
    
    showNotification('Product deleted successfully!', 'success');
    loadProducts();
}

function exportProducts() {
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    
    if (products.length === 0) {
        showNotification('No products to export!', 'error');
        return;
    }
    
    const dataStr = JSON.stringify(products, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `products_${new Date().getTime()}.json`;
    link.click();
    
    showNotification('Products exported successfully!', 'success');
}

function adminLogout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('currentUser');
        window.location.href = 'index.php';
    }
}

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
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { opacity: 0; transform: translateX(100px); }
        to { opacity: 1; transform: translateX(0); }
    }
    @keyframes slideOutRight {
        from { opacity: 1; transform: translateX(0); }
        to { opacity: 0; transform: translateX(100px); }
    }
`;
document.head.appendChild(style);