// ============================================
// VIRASYA - Artisan Marketplace Controller with Animations
// ============================================

const products = [
    {
        id: 1,
        name: "Paithani Silk Saree",
        state: "Maharashtra",
        category: "Sarees & Textiles",
        price: 4999,
        rating: 5,
        image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
        description: "A traditional handwoven Paithani silk saree known for its iconic peacock border motifs, pure gold zari threads, and centuries-old royal heritage."
    },
    {
        id: 2,
        name: "Himalayan Wool Shawl",
        state: "Uttarakhand",
        category: "Sarees & Textiles",
        price: 3499,
        rating: 5,
        image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=800&q=80",
        description: "A warm, finely handwoven Himalayan virgin sheep wool shawl crafted by indigenous Pahadi weavers with geometric borders."
    },
    {
        id: 3,
        name: "Dokra Tribal Figurine",
        state: "Jharkhand",
        category: "Metal Craft",
        price: 1299,
        rating: 4,
        image: "https://images.unsplash.com/photo-1577083288073-40892c0860a4?auto=format&fit=crop&w=800&q=80",
        description: "Non-ferrous lost-wax metal casting crafted by tribal metal-smiths carrying a 4,000-year-old metallurgical lineage dating from Harappa."
    },
    {
        id: 4,
        name: "Rajasthani Blue Pottery Vase",
        state: "Rajasthan",
        category: "Pottery",
        price: 899,
        rating: 5,
        image: "https://images.unsplash.com/photo-1582561833407-b95380302a8b?auto=format&fit=crop&w=800&q=80",
        description: "Turquoise-glazed quartz pottery with Persian floral motifs, handcrafted in Jaipur without traditional clay using feldspar and natural gum."
    },
    {
        id: 5,
        name: "Phulkari Embroidery Dupatta",
        state: "Punjab",
        category: "Sarees & Textiles",
        price: 1499,
        rating: 5,
        image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80",
        description: "Vibrant silk floss 'flower work' embroidered on handspun khaddar fabric, reflecting joyous Punjabi celebratory traditions."
    },
    {
        id: 6,
        name: "Warli Tribal Art Canvas",
        state: "Maharashtra",
        category: "Paintings",
        price: 1799,
        rating: 4,
        image: "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=800&q=80",
        description: "Ancient tribal folk art painted with white rice paste depicting circles of life, the Tarpa dance, harvest celebrations, and harmony with nature."
    },
    {
        id: 7,
        name: "Rajasthani Carved Wood Decor",
        state: "Rajasthan",
        category: "Wood Craft",
        price: 1199,
        rating: 4,
        image: "https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=800&q=80",
        description: "Intricately hand-carved Sheesham wood artifact featuring royal jharokha archways and fine antiqued brass inlays."
    },
    {
        id: 8,
        name: "Ringal Bamboo Craft Basket",
        state: "Jharkhand",
        category: "Handicrafts",
        price: 749,
        rating: 4,
        image: "https://images.unsplash.com/photo-1532375810709-75b1da00537c?auto=format&fit=crop&w=800&q=80",
        description: "Eco-friendly sustainable hill bamboo weave handcrafted with flexible shoots into functional everyday storage and ritual containers."
    }
];

let cart = 0;
let currentQuantity = 1;

// ================= TOAST NOTIFICATION WITH ANIMATION =================
function showToast(message) {
    let toast = document.getElementById("toastNotice");
    if (!toast) {
        toast = document.createElement("div");
        toast.id = "toastNotice";
        toast.className = "toast-notice";
        document.body.appendChild(toast);
    }
    toast.innerHTML = `<i class="fa-solid fa-circle-check" style="color:#e6a21a; font-size:18px;"></i> ${message}`;
    toast.classList.remove("show");
    void toast.offsetWidth; // Trigger reflow
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 3200);
}

// ================= DISPLAY PRODUCTS WITH STAGGER ANIMATION =================
function displayProducts(list) {
    const grid = document.getElementById("productGrid");
    const count = document.getElementById("productCount");

    if (!grid) return;

    grid.innerHTML = "";

    if (count) {
        count.innerText = `${list.length} Authentic Crafts Available`;
    }

    if (list.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: #765438;">
                <div style="font-size: 40px; margin-bottom: 12px; color: var(--haldi)">❖</div>
                <h2 style="font-family:'Cinzel',serif; font-size:24px; color:var(--dark-brown);">No handicrafts match your filter</h2>
                <p style="margin-top:8px;">Try clearing filters or search by another craft or state.</p>
                <button onclick="resetFilters()" style="margin-top:16px; padding:10px 24px; border-radius:20px; background:var(--haldi); border:none; color:white; font-family:'Cinzel',serif; font-weight:700; cursor:pointer; box-shadow:0 4px 15px rgba(230,162,26,0.4);">Show All Crafts</button>
            </div>
        `;
        return;
    }

    list.forEach((product, index) => {
        const card = document.createElement("div");
        card.className = "product-card";
        card.style.animationDelay = `${index * 0.08}s`;

        card.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
                <button class="wishlist" onclick="toggleWishlist(this)" title="Save to Wishlist">
                    ♡
                </button>
            </div>

            <div class="product-info">
                <span class="state-badge">${product.state}</span>
                <h3>${product.name}</h3>
                <p class="product-category">${product.category}</p>

                <div class="rating">
                    ${"★".repeat(product.rating)}${"☆".repeat(5 - product.rating)}
                </div>

                <div class="product-bottom">
                    <span class="price">₹${product.price.toLocaleString("en-IN")}</span>
                    <button class="add-btn" onclick="addToCart(${product.id})">
                        ADD TO BAG
                    </button>
                </div>

                <button onclick="openProduct(${product.id})" style="
                    margin-top: 12px;
                    width: 100%;
                    padding: 8px;
                    background: transparent;
                    border: 1px solid #cda653;
                    color: #71350b;
                    border-radius: 20px;
                    cursor: pointer;
                    font-size: 11px;
                    font-family: 'Cinzel', serif;
                    font-weight: 700;
                    letter-spacing: 0.5px;
                    transition: all 0.25s ease;
                " onmouseover="this.style.background='#f7e2b7'" onmouseout="this.style.background='transparent'">
                    VIEW DETAILS →
                </button>
            </div>
        `;

        grid.appendChild(card);
    });

    if (window.lucide) {
        lucide.createIcons();
    }
}

// ================= FILTER & SEARCH =================
function filterProducts() {
    const searchInput = document.getElementById("searchInput");
    const stateFilter = document.getElementById("stateFilter");
    const categoryFilter = document.getElementById("categoryFilter");
    const priceFilter = document.getElementById("priceFilter");
    const sortFilter = document.getElementById("sortFilter");

    const search = searchInput ? searchInput.value.toLowerCase().trim() : "";
    const state = stateFilter ? stateFilter.value : "all";
    const category = categoryFilter ? categoryFilter.value : "all";
    const price = priceFilter ? priceFilter.value : "all";
    const sort = sortFilter ? sortFilter.value : "default";

    let result = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(search) ||
                              product.description.toLowerCase().includes(search) ||
                              product.category.toLowerCase().includes(search) ||
                              product.state.toLowerCase().includes(search);

        const matchesState = state === "all" || product.state === state;
        const matchesCategory = category === "all" || product.category === category;

        let matchesPrice = true;
        if (price === "500") {
            matchesPrice = product.price < 500;
        } else if (price === "1000") {
            matchesPrice = product.price >= 500 && product.price <= 1000;
        } else if (price === "2500") {
            matchesPrice = product.price > 1000 && product.price <= 2500;
        } else if (price === "5000") {
            matchesPrice = product.price > 2500 && product.price <= 5000;
        } else if (price === "5001") {
            matchesPrice = product.price > 5000;
        }

        return matchesSearch && matchesState && matchesCategory && matchesPrice;
    });

    if (sort === "low") {
        result.sort((a, b) => a.price - b.price);
    } else if (sort === "high") {
        result.sort((a, b) => b.price - a.price);
    } else if (sort === "rating") {
        result.sort((a, b) => b.rating - a.rating);
    }

    displayProducts(result);
}

function resetFilters() {
    const searchInput = document.getElementById("searchInput");
    const stateFilter = document.getElementById("stateFilter");
    const categoryFilter = document.getElementById("categoryFilter");
    const priceFilter = document.getElementById("priceFilter");
    const sortFilter = document.getElementById("sortFilter");

    if (searchInput) searchInput.value = "";
    if (stateFilter) stateFilter.value = "all";
    if (categoryFilter) categoryFilter.value = "all";
    if (priceFilter) priceFilter.value = "all";
    if (sortFilter) sortFilter.value = "default";

    displayProducts(products);
}

function filterByStateFromCard(stateName) {
    const stateFilter = document.getElementById("stateFilter");
    if (stateFilter) {
        stateFilter.value = stateName;
        filterProducts();
        scrollToProducts();
    }
}

function filterByCategoryFromCard(categoryName) {
    const categoryFilter = document.getElementById("categoryFilter");
    if (categoryFilter) {
        categoryFilter.value = categoryName;
        filterProducts();
        scrollToProducts();
    }
}

// ================= CART WITH POP ANIMATION =================
function addToCart(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    cart++;
    const cartCount = document.getElementById("cartCount");
    const cartBtn = document.querySelector(".cart-button");

    if (cartCount) cartCount.innerText = cart;

    if (cartBtn) {
        cartBtn.classList.remove("bump");
        void cartBtn.offsetWidth; // trigger reflow
        cartBtn.classList.add("bump");
    }

    showToast(`Added <strong>${product.name}</strong> to your bag!`);
}

// ================= WISHLIST WITH POP ANIMATION =================
function toggleWishlist(button) {
    if (button.innerText.trim() === "♡") {
        button.innerText = "♥";
        button.style.background = "#e6a21a";
        button.style.color = "white";
        button.classList.add("active");
        showToast("Saved to your artisan wishlist!");
    } else {
        button.innerText = "♡";
        button.style.background = "rgba(255, 250, 235, .92)";
        button.style.color = "var(--saffron)";
        button.classList.remove("active");
    }
}

// ================= PRODUCT MODAL =================
function openProduct(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    const modalImage = document.getElementById("modalImage");
    const modalName = document.getElementById("modalName");
    const modalState = document.getElementById("modalState");
    const modalPrice = document.getElementById("modalPrice");
    const modalDescription = document.getElementById("modalDescription");
    const modalCategory = document.getElementById("modalCategory");
    const modalOrigin = document.getElementById("modalOrigin");
    const quantityElem = document.getElementById("quantity");
    const productModal = document.getElementById("productModal");
    const modalCartButton = document.getElementById("modalCartButton");

    if (modalImage) modalImage.src = product.image;
    if (modalName) modalName.innerText = product.name;
    if (modalState) modalState.innerText = product.state;
    if (modalPrice) modalPrice.innerText = `₹${product.price.toLocaleString("en-IN")}`;
    if (modalDescription) modalDescription.innerText = product.description;
    if (modalCategory) modalCategory.innerText = product.category;
    if (modalOrigin) modalOrigin.innerText = `${product.state}, India`;

    currentQuantity = 1;
    if (quantityElem) quantityElem.innerText = 1;

    if (modalCartButton) {
        modalCartButton.onclick = () => addMultipleToCart(product);
    }

    if (productModal) {
        productModal.classList.add("show");
    }
}

function closeModal() {
    const productModal = document.getElementById("productModal");
    if (productModal) {
        productModal.classList.remove("show");
    }
}

function changeQuantity(value) {
    currentQuantity += value;
    if (currentQuantity < 1) currentQuantity = 1;

    const quantityElem = document.getElementById("quantity");
    if (quantityElem) quantityElem.innerText = currentQuantity;
}

function addMultipleToCart(product) {
    cart += currentQuantity;
    const cartCount = document.getElementById("cartCount");
    const cartBtn = document.querySelector(".cart-button");

    if (cartCount) cartCount.innerText = cart;

    if (cartBtn) {
        cartBtn.classList.remove("bump");
        void cartBtn.offsetWidth;
        cartBtn.classList.add("bump");
    }

    closeModal();
    showToast(`Added ${currentQuantity} × <strong>${product.name}</strong> to bag!`);
}

// Close modal on outside click or Escape
window.addEventListener("click", (e) => {
    const modal = document.getElementById("productModal");
    if (e.target === modal) {
        closeModal();
    }
});

window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        closeModal();
    }
});

// ================= SCROLL =================
function scrollToProducts() {
    const elem = document.getElementById("products");
    if (elem) {
        elem.scrollIntoView({ behavior: "smooth" });
    }
}

// ================= SCROLL REVEAL OBSERVER =================
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -40px 0px"
    };

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("in-view");
            }
        });
    }, observerOptions);

    document.querySelectorAll(".reveal-up").forEach((el) => {
        scrollObserver.observe(el);
    });
}

// ================= BACK TO TOP & SCROLL INTERACTIONS =================
function initScrollInteractions() {
    const backToTopBtn = document.getElementById("backToTopBtn");
    window.addEventListener("scroll", () => {
        if (backToTopBtn) {
            if (window.scrollY > 400) {
                backToTopBtn.classList.add("visible");
            } else {
                backToTopBtn.classList.remove("visible");
            }
        }
    }, { passive: true });
}

// ================= 3D CARD TILT INTERACTION =================
function init3DCardTilt() {
    if (window.matchMedia("(hover: none)").matches) return;

    const cards = document.querySelectorAll(".category-card, .product-card, .state-card, .trust-item");
    cards.forEach((card) => {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -5;
            const rotateY = ((x - centerX) / centerX) * 5;

            card.style.transform = `perspective(800px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-8px)`;
        });

        card.addEventListener("mouseleave", () => {
            card.style.transform = "";
        });
    });
}

// ================= ATTACH LISTENERS & INIT =================
document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("searchInput");
    const stateFilter = document.getElementById("stateFilter");
    const categoryFilter = document.getElementById("categoryFilter");
    const priceFilter = document.getElementById("priceFilter");
    const sortFilter = document.getElementById("sortFilter");

    // Parse URL Query Parameters (e.g. from VIRASYA AI Guide links)
    const urlParams = new URLSearchParams(window.location.search);
    const paramState = urlParams.get('state');
    const paramCategory = urlParams.get('category');
    const paramSearch = urlParams.get('search') || urlParams.get('q');

    if (paramState && stateFilter) {
        stateFilter.value = paramState;
    }
    if (paramCategory && categoryFilter) {
        categoryFilter.value = paramCategory;
    }
    if (paramSearch && searchInput) {
        searchInput.value = paramSearch;
    }

    if (paramState || paramCategory || paramSearch) {
        filterProducts();
        setTimeout(() => {
            const productSec = document.getElementById("products");
            if (productSec) productSec.scrollIntoView({ behavior: 'smooth' });
        }, 400);
    } else {
        displayProducts(products);
    }

    initScrollAnimations();
    initScrollInteractions();
    init3DCardTilt();

    if (window.lucide) {
        lucide.createIcons();
    }
});
