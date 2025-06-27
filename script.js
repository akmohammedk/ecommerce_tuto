// Données des produits (en pratique, cela viendrait d'une API)
const products = [
    {
        id: 1,
        name: "iPhone 14 Pro Max",
        brand: "Apple",
        price: 1299,
        oldPrice: 1399,
        image: "https://images.anandtech.com/doci/10194/X-T30_DSF4322.jpg",
        category: "apple",
        badge: "Nouveau"
    },
    {
        id: 2,
        name: "Samsung Galaxy S23 Ultra",
        brand: "Samsung",
        price: 1199,
        oldPrice: 1299,
        image: "https://cdn.thewirecutter.com/wp-content/media/2024/06/android-phone-2048px-0967.jpg",
        category: "samsung",
        badge: "Promo"
    },
    {
        id: 3,
        name: "Xiaomi 13 Pro",
        brand: "Xiaomi",
        price: 999,
        image: "https://cdn.tmobile.com/content/dam/t-mobile/en-p/cell-phones/apple/Apple-iPhone-16-Pro/Desert-Titanium/Apple-iPhone-16-Pro-Desert-Titanium-thumbnail.png",
        category: "xiaomi"
    },
    {
        id: 4,
        name: "OnePlus 11",
        brand: "OnePlus",
        price: 799,
        image: "https://cdn.tmobile.com/content/dam/t-mobile/en-p/cell-phones/apple/Apple-iPhone-16-Pro/Desert-Titanium/Apple-iPhone-16-Pro-Desert-Titanium-thumbnail.png",
        category: "oneplus"
    },
    {
        id: 5,
        name: "iPhone 13",
        brand: "Apple",
        price: 899,
        oldPrice: 999,
        image: "https://www.luckymobile.ca/web/img/wireless/all_languages/all_regions/catalog_images//LM_Alcatel_1X_Blue.png",
        category: "apple",
        badge: "Best-seller"
    },
    {
        id: 6,
        name: "Samsung Galaxy Z Flip4",
        brand: "Samsung",
        price: 1099,
        image: "https://www.luckymobile.ca/web/img/wireless/all_languages/all_regions/catalog_images//LM_Alcatel_1X_Blue.png",
        category: "samsung"
    },
    {
        id: 7,
        name: "Xiaomi 12T Pro",
        brand: "Xiaomi",
        price: 749,
        image: "https://cdn.thewirecutter.com/wp-content/media/2025/02/BEST-ANDROID-PHONES-2048px-samsung25ultra-hero.jpg?auto=webp&quality=75&width=1024",
        category: "xiaomi"
    },
    {
        id: 8,
        name: "OnePlus 10T",
        brand: "OnePlus",
        price: 699,
        oldPrice: 799,
        image: "https://cdn.thewirecutter.com/wp-content/media/2025/02/BEST-ANDROID-PHONES-2048px-samsung25ultra-hero.jpg?auto=webp&quality=75&width=1024",
        category: "oneplus",
        badge: "Promo"
    }
];

// Panier
let cart = [];

// DOM Elements
const productContainer = document.getElementById('product-container');
const filterButtons = document.querySelectorAll('.filter-btn');
const cartCount = document.querySelector('.cart-count');
const cartSidebar = document.querySelector('.cart-sidebar');
const cartOverlay = document.querySelector('.cart-overlay');
const closeCartBtn = document.querySelector('.close-cart');
const cartItemsContainer = document.querySelector('.cart-items');
const cartTotal = document.querySelector('.total-price');
const cartIcon = document.querySelector('.cart-icon');
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

// Afficher les produits
function displayProducts(productsToDisplay) {
    productContainer.innerHTML = '';
    
    productsToDisplay.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.dataset.category = product.category;
        
        let badgeHTML = '';
        if (product.badge) {
            badgeHTML = `<span class="product-badge">${product.badge}</span>`;
        }
        
        let oldPriceHTML = '';
        if (product.oldPrice) {
            oldPriceHTML = `<span class="old-price">€${product.oldPrice}</span>`;
        }
        
        productCard.innerHTML = `
            ${badgeHTML}
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <p class="product-brand">${product.brand}</p>
                <h4 class="product-name">${product.name}</h4>
                <div class="product-price">
                    <span class="current-price">€${product.price}</span>
                    ${oldPriceHTML}
                </div>
                <div class="product-actions">
                    <button class="add-to-cart" data-id="${product.id}">Ajouter au panier</button>
                    <button class="wishlist-btn"><i class="far fa-heart"></i></button>
                </div>
            </div>
        `;
        
        productContainer.appendChild(productCard);
    });
    
    // Ajouter les événements aux boutons "Ajouter au panier"
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', addToCart);
    });
}

// Filtrer les produits
function filterProducts(category) {
    if (category === 'all') {
        displayProducts(products);
    } else {
        const filteredProducts = products.filter(product => product.category === category);
        displayProducts(filteredProducts);
    }
}

// Ajouter au panier
function addToCart(e) {
    const productId = parseInt(e.target.dataset.id);
    const product = products.find(p => p.id === productId);
    
    // Vérifier si le produit est déjà dans le panier
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCart();
    showCartNotification(product.name);
}

// Mettre à jour le panier
function updateCart() {
    // Mettre à jour le compteur
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Mettre à jour le panier latéral
    renderCartItems();
}

// Afficher les articles du panier
function renderCartItems() {
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Votre panier est vide</p>';
        cartTotal.textContent = '€0.00';
        return;
    }
    
    let total = 0;
    
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-img">
            <div class="cart-item-details">
                <h4 class="cart-item-title">${item.name}</h4>
                <p class="cart-item-price">€${item.price} x ${item.quantity}</p>
                <button class="cart-item-remove" data-id="${item.id}">Supprimer</button>
            </div>
        `;
        
        cartItemsContainer.appendChild(cartItem);
        total += item.price * item.quantity;
    });
    
    // Ajouter les événements aux boutons "Supprimer"
    document.querySelectorAll('.cart-item-remove').forEach(button => {
        button.addEventListener('click', removeFromCart);
    });
    
    cartTotal.textContent = `€${total.toFixed(2)}`;
}

// Supprimer du panier
function removeFromCart(e) {
    const productId = parseInt(e.target.dataset.id);
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

// Afficher une notification d'ajout au panier
function showCartNotification(productName) {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = `
        <p>${productName} a été ajouté à votre panier</p>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Ouvrir/fermer le panier
function toggleCart() {
    cartSidebar.classList.toggle('active');
    cartOverlay.classList.toggle('active');
    document.body.classList.toggle('no-scroll');
}

// Toggle menu mobile
function toggleMenu() {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
    
    if (hamburger.classList.contains('active')) {
        hamburger.innerHTML = '&times;';
    } else {
        hamburger.innerHTML = '<span></span><span></span><span></span>';
    }
}

// Événements
document.addEventListener('DOMContentLoaded', () => {
    // Afficher tous les produits au chargement
    displayProducts(products);
    
    // Filtrer les produits
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            filterProducts(button.dataset.filter);
        });
    });
    
    // Panier
    cartIcon.addEventListener('click', toggleCart);
    closeCartBtn.addEventListener('click', toggleCart);
    cartOverlay.addEventListener('click', toggleCart);
    
    // Menu mobile
    hamburger.addEventListener('click', toggleMenu);
    
    // Newsletter form
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = newsletterForm.querySelector('input').value;
            alert(`Merci pour votre inscription! Un email de confirmation a été envoyé à ${email}`);
            newsletterForm.reset();
        });
    }
    
    // Contact form
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Merci pour votre message! Nous vous répondrons dès que possible.');
            contactForm.reset();
        });
    }
});

// Style pour la notification
const style = document.createElement('style');
style.textContent = `
    .cart-notification {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background-color: var(--success-color);
        color: white;
        padding: 15px 25px;
        border-radius: 5px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        opacity: 0;
        transition: opacity 0.3s;
        z-index: 1200;
    }
    
    .cart-notification.show {
        opacity: 1;
    }
    
    .no-scroll {
        overflow: hidden;
    }
`;
document.head.appendChild(style);