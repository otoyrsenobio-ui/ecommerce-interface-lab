 // ------------------------------------------------------------
 // Laboratory 6: DOM Scripting
 // ------------------------------------------------------------
 // Tasks covered:
 // 1. JavaScript classes & localStorage (ShoppingCart, Product)
 // 2. Dynamic product rendering (renderProducts)
 // 3. Product filtering by category and price (filterProducts)
 // 4. Shopping cart with quantity controls and local storage
 // 5. Checkout order summary & order placement
 // 6. Order history page (Account.html) using localStorage
 // 7. Detail page “Add to Cart” functionality
 // ------------------------------------------------------------

 // ---------- Product Data ----------
 class Product {
     constructor(id, name, price, image, category, detailsPage) {
         this.id = id;
         this.name = name;
         this.price = price;
         this.image = image;
         this.category = category; // 'clothing' or 'shoes'
         this.detailsPage = detailsPage; // filename of the detail page
     }
 }

 // Product catalog – can be expanded
 const products = [
     new Product(1, "Nike White Sneakers", 59, "OIP.webp", "shoes", "details2.html"),
     new Product(2, "Leather Crossbody Bag", 89, "download.webp", "clothing", "details.html"),
 ];

 // ---------- Shopping Cart Class ----------
 class ShoppingCart {
     constructor() {
         this.items = [];
         this.loadFromStorage();
     }

     addItem(product) {
         const existing = this.items.find(item => item.product.id === product.id);
         if (existing) {
             existing.quantity++;
         } else {
             this.items.push({ product, quantity: 1 });
         }
         this.saveToStorage();
         this.updateCartCount();
     }

     addItems(product, quantity) {
         for (let i = 0; i < quantity; i++) {
             this.addItem(product);
         }
     }

     removeItem(productId) {
         this.items = this.items.filter(item => item.product.id !== productId);
         this.saveToStorage();
         this.updateCartCount();
         if (window.location.pathname.includes('Cart.html')) this.renderCartPage();
     }

     updateQuantity(productId, newQuantity) {
         const item = this.items.find(item => item.product.id === productId);
         if (item) {
             if (newQuantity <= 0) {
                 this.removeItem(productId);
             } else {
                 item.quantity = newQuantity;
                 this.saveToStorage();
                 this.updateCartCount();
                 if (window.location.pathname.includes('Cart.html')) this.renderCartPage();
             }
         }
     }

     getTotalItems() {
         return this.items.reduce((sum, item) => sum + item.quantity, 0);
     }

     getTotalPrice() {
         return this.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
     }

     saveToStorage() {
         localStorage.setItem('shoppingCart', JSON.stringify(this.items));
     }

     loadFromStorage() {
         const stored = localStorage.getItem('shoppingCart');
         if (stored) {
             this.items = JSON.parse(stored).map(item => ({
                 product: new Product(
                     item.product.id,
                     item.product.name,
                     item.product.price,
                     item.product.image,
                     item.product.category,
                     item.product.detailsPage
                 ),
                 quantity: item.quantity
             }));
         }
     }

     updateCartCount() {
         const cartCountElements = document.querySelectorAll('.cart-count');
         const total = this.getTotalItems();
         cartCountElements.forEach(el => el.textContent = total);
     }

     renderCartPage() {
         const cartContainer = document.querySelector('.cart-container ul');
         const subtotalSpan = document.querySelector('.subtotal .price');
         if (!cartContainer) return;

         cartContainer.innerHTML = '';
         if (this.items.length === 0) {
             cartContainer.innerHTML = '<li>Your cart is empty.</li>';
             if (subtotalSpan) subtotalSpan.textContent = '0.00';
             return;
         }

         this.items.forEach(item => {
             const li = document.createElement('li');
             li.innerHTML = `
                <img src="${item.product.image}" alt="${item.product.name}">
                <div>
                    <h3>${item.product.name}</h3>
                    <p class="price">${item.product.price.toFixed(2)}</p>
                    <div class="quantity-controls">
                        <button class="qty-decr" data-id="${item.product.id}">-</button>
                        <span>${item.quantity}</span>
                        <button class="qty-incr" data-id="${item.product.id}">+</button>
                    </div>
                </div>
                <button class="remove-item" data-id="${item.product.id}">×</button>
            `;
             cartContainer.appendChild(li);
         });

         if (subtotalSpan) subtotalSpan.textContent = this.getTotalPrice().toFixed(2);
     }

     getCartSummary() {
         return {
             itemsTotal: this.getTotalPrice(),
             shipping: 150,
             total: this.getTotalPrice() + 150
         };
     }
 }

 const cart = new ShoppingCart();

 // ---------- Product Listing & Filtering ----------
 function renderProducts(productsToRender) {
     const productList = document.querySelector('.product-list');
     if (!productList) return;

     productList.innerHTML = '';
     productsToRender.forEach(product => {
         const article = document.createElement('article');
         article.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h2>${product.name}</h2>
            <p class="price">${product.price.toFixed(2)}</p>
            <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
            <a href="${product.detailsPage}" class="button-link">View Details</a>
        `;
         productList.appendChild(article);
     });

     document.querySelectorAll('.add-to-cart').forEach(btn => {
         btn.addEventListener('click', (e) => {
             const id = parseInt(e.target.dataset.id);
             const product = products.find(p => p.id === id);
             if (product) cart.addItem(product);
         });
     });
 }

 function filterProducts() {
     const selectedCategories = Array.from(document.querySelectorAll('input[name="category"]:checked')).map(cb => cb.value);
     const priceRadio = document.querySelector('input[name="price"]:checked');
     const selectedPrice = priceRadio ? priceRadio.value : null;

     let filtered = [...products];

     if (selectedCategories.length > 0) {
         filtered = filtered.filter(p => selectedCategories.includes(p.category));
     }

     if (selectedPrice) {
         filtered = filtered.filter(p => {
             if (selectedPrice === '25to50') return p.price >= 25 && p.price <= 50;
             if (selectedPrice === '50to100') return p.price >= 50 && p.price <= 100;
             if (selectedPrice === 'higher than 100') return p.price > 100;
             return true;
         });
     }

     renderProducts(filtered);
 }

 // ---------- Cart Page Event Handling ----------
 function setupCartPage() {
     cart.renderCartPage();

     const cartContainer = document.querySelector('.cart-container');
     if (cartContainer) {
         cartContainer.addEventListener('click', (e) => {
             const target = e.target;
             if (target.classList.contains('qty-incr')) {
                 const id = parseInt(target.dataset.id);
                 const item = cart.items.find(i => i.product.id === id);
                 if (item) cart.updateQuantity(id, item.quantity + 1);
             } else if (target.classList.contains('qty-decr')) {
                 const id = parseInt(target.dataset.id);
                 const item = cart.items.find(i => i.product.id === id);
                 if (item) cart.updateQuantity(id, item.quantity - 1);
             } else if (target.classList.contains('remove-item')) {
                 const id = parseInt(target.dataset.id);
                 cart.removeItem(id);
             }
         });
     }
 }

 // ---------- Detail Page "Add to Cart" Setup ----------
 function setupDetailPage() {
     const addButton = document.querySelector('.add-to-cart-detail');
     if (!addButton) return;

     addButton.addEventListener('click', () => {
         const productId = parseInt(addButton.dataset.id);
         const product = products.find(p => p.id === productId);
         if (!product) {
             alert('Product not found.');
             return;
         }

         let quantityInput = document.getElementById('quantity');
         let quantity = quantityInput ? parseInt(quantityInput.value) : 1;
         if (isNaN(quantity) || quantity < 1) quantity = 1;

         cart.addItems(product, quantity);
         alert(`Added ${quantity} item(s) to cart!`);
     });
 }

 // ---------- Checkout Page ----------
 function setupCheckoutPage() {
     const summary = cart.getCartSummary();
     const itemsTotalSpan = document.querySelector('.order-summary .items-total');
     const shippingSpan = document.querySelector('.order-summary .shipping');
     const totalSpan = document.querySelector('.order-summary .total');

     if (itemsTotalSpan) itemsTotalSpan.textContent = summary.itemsTotal.toFixed(2);
     if (shippingSpan) shippingSpan.textContent = summary.shipping.toFixed(2);
     if (totalSpan) totalSpan.textContent = summary.total.toFixed(2);

     const placeOrderBtn = document.querySelector('.place-order');
     if (placeOrderBtn) {
         placeOrderBtn.addEventListener('click', () => {
             if (cart.items.length === 0) {
                 alert('Your cart is empty. Add items before placing an order.');
                 return;
             }
             const orders = JSON.parse(localStorage.getItem('orders')) || [];
             const newOrder = {
                 id: Date.now(),
                 date: new Date().toLocaleDateString(),
                 items: [...cart.items],
                 total: summary.total
             };
             orders.push(newOrder);
             localStorage.setItem('orders', JSON.stringify(orders));
             cart.items = [];
             cart.saveToStorage();
             cart.updateCartCount();
             alert('Order placed successfully!');
             window.location.href = 'Account.html';
         });
     }
 }

 // ---------- Account Page (Order History) ----------
 function setupAccountPage() {
     const orderList = document.querySelector('.order-history ul');
     if (!orderList) return;

     const orders = JSON.parse(localStorage.getItem('orders')) || [];
     if (orders.length === 0) {
         orderList.innerHTML = '<li>No orders yet.</li>';
         return;
     }

     orderList.innerHTML = '';
     orders.forEach(order => {
                 const li = document.createElement('li');
                 li.innerHTML = `
            <details>
                <summary>Order #${order.id} – ${order.date}</summary>
                <p>Items: ${order.items.map(i => `${i.product.name} (x${i.quantity})`).join(', ')}</p>
                <p>Total: <span class="price">${order.total.toFixed(2)}</span></p>
                <p>Status: Delivered</p>
            </details>
        `;
        orderList.appendChild(li);
    });
}

// ---------- Initialize Pages ----------
document.addEventListener('DOMContentLoaded', () => {
    cart.updateCartCount();

    if (document.querySelector('.products-container')) {
        renderProducts(products);
        const filterForm = document.querySelector('.products-container form');
        if (filterForm) {
            filterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                filterProducts();
            });
        }
    }

    if (document.querySelector('.cart-container')) {
        setupCartPage();
    }

    if (document.querySelector('.add-to-cart-detail')) {
        setupDetailPage();
    }

    if (document.querySelector('.checkout-wrapper')) {
        setupCheckoutPage();
    }

    if (document.querySelector('.order-history')) {
        setupAccountPage();
    }
});