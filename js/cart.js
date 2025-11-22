// Cart functionality
let cart = [];

function addToCart(product) {
    cart.push(product);
    saveCartToLocalStorage();
    updateMiniCart();
    updateMainCart();
    
    // Show success message
    swal(product.name, "wurde zum Warenkorb hinzugefügt!", "success");
}

function removeFromCart(index) {
    const product = cart[index];
    cart.splice(index, 1);
    saveCartToLocalStorage();
    updateMiniCart();
    updateMainCart();
    
    // Show success message
    swal(product.name, "wurde aus dem Warenkorb entfernt!", "success");
}

function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCartFromLocalStorage() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateMiniCart();
        updateMainCart();
    }
}

function updateMiniCart() {
    const cartContent = document.querySelector('.header-cart-content .header-cart-wrapitem');
    if (!cartContent) return;
    
    // Clear existing cart content
    cartContent.innerHTML = '';
    
    // Add each product to cart
    cart.forEach((product, index) => {
        const item = document.createElement('li');
        item.className = 'header-cart-item flex-w flex-t m-b-12';
        
        item.innerHTML = `
            <div class="header-cart-item-img">
                <img src="${product.image}" alt="${product.name}">
            </div>

            <div class="header-cart-item-txt p-t-8">
                <a href="#" class="header-cart-item-name m-b-18 hov-cl1 trans-04">
                    ${product.name}
                </a>

                <span class="header-cart-item-info">
                    1 x CHF ${product.price.toFixed(2)}
                </span>
            </div>

            <div class="header-cart-item-remove">
                <button class="btn-remove-cart" data-index="${index}" style="background: none; border: none; cursor: pointer; padding: 5px; font-size: 20px; color: #999;">
                    <i class="zmdi zmdi-close"></i>
                </button>
            </div>
        `;
        
        cartContent.appendChild(item);
    });

    // Add event listeners for remove buttons
    document.querySelectorAll('.btn-remove-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const index = parseInt(button.getAttribute('data-index'));
            removeFromCart(index);
        });
    });

    // Update mini cart total and count
    updateMiniCartTotal();
    updateCartCount();
}

function updateMainCart() {
    const mainCartTable = document.querySelector('.table-shopping-cart');
    if (!mainCartTable) return;  // Return if not on cart page
    
    // Remove existing product rows
    const existingRows = mainCartTable.querySelectorAll('.table_row');
    existingRows.forEach(row => row.remove());
    
    // Add each product to main cart
    cart.forEach((product, index) => {
        const row = document.createElement('tr');
        row.className = 'table_row';
        
        row.innerHTML = `
            <td class="column-1">
                <div class="how-itemcart1">
                    <img src="${product.image}" alt="${product.name}">
                </div>
            </td>
            <td class="column-2">${product.name}</td>
            <td class="column-3">CHF ${product.price.toFixed(2)}</td>
            <td class="column-4">
                <div class="wrap-num-product flex-w m-l-auto m-r-0">
                    <div class="btn-num-product-down cl8 hov-btn3 trans-04 flex-c-m">
                        <i class="fs-16 zmdi zmdi-minus"></i>
                    </div>

                    <input class="mtext-104 cl3 txt-center num-product" type="number" name="num-product${index + 1}" value="1">

                    <div class="btn-num-product-up cl8 hov-btn3 trans-04 flex-c-m">
                        <i class="fs-16 zmdi zmdi-plus"></i>
                    </div>
                </div>
            </td>
            <td class="column-5">CHF ${product.price.toFixed(2)}</td>
        `;
        
        // Insert after table head
        const tableHead = mainCartTable.querySelector('.table_head');
        tableHead.parentNode.insertBefore(row, tableHead.nextSibling);
        
        // Initialize quantity controls for this row
        initQuantityControls(row);
    });
    
    updateMainCartTotal();
}

function updateMiniCartTotal() {
    const totalElement = document.querySelector('.header-cart-total');
    if (!totalElement) return;
    
    const total = cart.reduce((sum, product) => sum + product.price, 0);
    totalElement.textContent = `Total: CHF ${total.toFixed(2)}`;
}

function updateMainCartTotal() {
    const totalElements = document.querySelectorAll('.mtext-110.cl2');
    if (!totalElements.length) return;
    
    const total = cart.reduce((sum, product) => sum + product.price, 0);
    totalElements.forEach(element => {
        element.textContent = `CHF ${total.toFixed(2)}`;
    });
}

function updateCartCount() {
    // Update cart count in header
    document.querySelectorAll('.js-show-cart').forEach(element => {
        element.setAttribute('data-notify', cart.length.toString());
    });
}

function initQuantityControls(row) {
    const input = row.querySelector('.num-product');
    const upBtn = row.querySelector('.btn-num-product-up');
    const downBtn = row.querySelector('.btn-num-product-down');
    
    upBtn.addEventListener('click', () => {
        input.value = parseInt(input.value) + 1;
        updateRowTotal(row);
    });
    
    downBtn.addEventListener('click', () => {
        if (parseInt(input.value) > 1) {
            input.value = parseInt(input.value) - 1;
            updateRowTotal(row);
        }
    });
    
    input.addEventListener('change', () => {
        if (parseInt(input.value) < 1) input.value = 1;
        updateRowTotal(row);
    });
}

function updateRowTotal(row) {
    const quantity = parseInt(row.querySelector('.num-product').value);
    const price = parseFloat(row.querySelector('.column-3').textContent.replace('CHF ', ''));
    const total = quantity * price;
    
    row.querySelector('.column-5').textContent = `CHF ${total.toFixed(2)}`;
    updateMainCartTotal();
}

function clearCart() {
    cart = [];
    localStorage.removeItem('cart');
    updateMiniCart();
    updateMainCart();
}

// Initialize cart functionality
document.addEventListener('DOMContentLoaded', () => {
    // Load cart from localStorage
    loadCartFromLocalStorage();
    
    // Add all 4 BBB products to cart automatically if cart is empty
    if (cart.length === 0) {
        const defaultProducts = [
            {
                name: 'BBB Herren T-Shirt',
                price: 29.99,
                image: 'images/products/bbb-shirt.png'
            },
            {
                name: 'BBB Damen T-Shirt',
                price: 29.99,
                image: 'images/products/bbb-tshirt-women.png'
            },
            {
                name: 'BBB Stofftasche',
                price: 14.99,
                image: 'images/products/bbb-bag.png'
            },
            {
                name: 'BBB Cap',
                price: 19.99,
                image: 'images/products/bbb-cap.png'
            }
        ];
        
        defaultProducts.forEach(product => {
            cart.push(product);
        });
        
        saveCartToLocalStorage();
        updateMiniCart();
        updateMainCart();
    }
    
    // Add click handler for "Add to Cart" button using event delegation
    document.body.addEventListener('click', (e) => {
        if (e.target.classList.contains('js-addcart-detail')) {
            const productContainer = e.target.closest('.js-modal1');
            const priceText = productContainer.querySelector('.mtext-106').textContent.trim();
            const product = {
                name: productContainer.querySelector('.js-name-detail').textContent.trim(),
                price: parseFloat(priceText.replace('CHF', '').replace('$', '').trim()),
                image: productContainer.querySelector('.slick3 img').getAttribute('src')
            };
            addToCart(product);
        }
    });
});

// Make cart functions globally available
window.addToCart = addToCart;
window.clearCart = clearCart;