// ============================================================
// JRK AUTO PARTS - MOBILE APP LOGIC
// ============================================================

// LocalStorage Keys
const ADMIN_DB_KEY = 'jrk_admin_inventory';
const QUERIES_KEY = 'jrk_customer_queries';
const CART_KEY = 'jrk_app_cart';
const FAV_KEY = 'jrk_app_favs';
const OWNER_MODE_KEY = 'jrk_owner_mode';

// App State
let currentTab = 'home';
let activeCategory = 'all';
let searchQuery = '';
let isOwnerMode = localStorage.getItem(OWNER_MODE_KEY) === 'true';
let cart = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
let favorites = JSON.parse(localStorage.getItem(FAV_KEY) || '[]');
let customerQueries = JSON.parse(localStorage.getItem(QUERIES_KEY) || '[]');
let selectedVehiclePill = 'Maruti Swift';
let tempUploadedImageData = '';

// Category Visual Fallbacks for Products
const CATEGORY_FALLBACK_IMAGES = {
  brakes: "images/brembo_brake_kit.jpg",
  engine: "images/carbon_intake.jpg",
  suspension: "images/coilover_kit.jpg",
  lighting: "images/led_headlights.jpg",
  exhaust: "images/carbon_intake.jpg",
  general: "images/brembo_brake_kit.jpg"
};

// Initial Sample Products for Indian Auto Parts Store
const INITIAL_APP_PRODUCTS = [
  {
    id: 101,
    name: "BREMBO BRAKE PADS KIT",
    brand: "Brembo",
    category: "brakes",
    price: 3499.00,
    originalPrice: 4200.00,
    rating: 4.8,
    reviews: 142,
    image: "images/brembo_brake_kit.jpg",
    compatibility: "Maruti Swift, Baleno, Dzire",
    inStock: true,
    stockCount: 15
  },
  {
    id: 102,
    name: "CARBON COLD AIR INTAKE",
    brand: "JRK Racing",
    category: "engine",
    price: 8500.00,
    originalPrice: 9500.00,
    rating: 4.9,
    reviews: 98,
    image: "images/carbon_intake.jpg",
    compatibility: "Tata Nexon, Harrier, Safari",
    inStock: true,
    stockCount: 8
  },
  {
    id: 103,
    name: "OFF-ROAD COILOVER SUSPENSION",
    brand: "Ironman 4x4",
    category: "suspension",
    price: 14500.00,
    originalPrice: 16999.00,
    rating: 4.9,
    reviews: 210,
    image: "images/coilover_kit.jpg",
    compatibility: "Mahindra Thar, Scorpio-N",
    inStock: true,
    stockCount: 12
  },
  {
    id: 104,
    name: "TWIN LED PROJECTOR HEADLIGHTS",
    brand: "Minda / Morimoto",
    category: "lighting",
    price: 5500.00,
    originalPrice: 6500.00,
    rating: 4.7,
    reviews: 86,
    image: "images/led_headlights.jpg",
    compatibility: "Royal Enfield 350 / Thar",
    inStock: true,
    stockCount: 20
  }
];

// Seed & Load Products (appends new products to existing inventory)
function getAppProducts() {
  const adminDbStr = localStorage.getItem(ADMIN_DB_KEY);
  if (!adminDbStr) {
    // Initialize localStorage with INITIAL_APP_PRODUCTS
    const seed = INITIAL_APP_PRODUCTS.map(p => ({
      id: 'PRD-' + p.id,
      name: p.name,
      brand: p.brand,
      compatibility: p.compatibility,
      cat: p.category,
      price: p.price,
      stock: p.stockCount,
      image: p.image
    }));
    localStorage.setItem(ADMIN_DB_KEY, JSON.stringify(seed));
    return INITIAL_APP_PRODUCTS;
  }

  try {
    const items = JSON.parse(adminDbStr);
    if (items && Array.isArray(items) && items.length > 0) {
      return items.map((item, idx) => {
        const catKey = (item.cat || item.category || 'general').toLowerCase();
        return {
          id: item.id || (200 + idx),
          name: (item.name || "Auto Spare Part").toUpperCase(),
          brand: item.brand || "JRK Genuine Parts",
          category: catKey,
          price: parseFloat(item.price) || 999.00,
          originalPrice: (parseFloat(item.price) * 1.25) || 1250.00,
          rating: item.rating || 4.8,
          reviews: item.reviews || 45,
          image: item.image || CATEGORY_FALLBACK_IMAGES[catKey] || CATEGORY_FALLBACK_IMAGES.general,
          compatibility: item.compatibility || "Universal Indian Fitment",
          inStock: (item.stock !== undefined ? item.stock > 0 : true),
          stockCount: item.stock !== undefined ? item.stock : 10
        };
      });
    }
  } catch(e) {
    console.error(e);
  }

  return INITIAL_APP_PRODUCTS;
}

// Reset / Restore Default Inventory Catalog
function resetInventoryToDefault() {
  const seed = INITIAL_APP_PRODUCTS.map(p => ({
    id: 'PRD-' + p.id,
    name: p.name,
    brand: p.brand,
    compatibility: p.compatibility,
    cat: p.category,
    price: p.price,
    stock: p.stockCount,
    image: p.image
  }));
  localStorage.setItem(ADMIN_DB_KEY, JSON.stringify(seed));
  showToast("Inventory restored to default catalog! 🔄");
  renderView();
}

// Save Cart
function saveCart() {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
}

// Save Favorites
function saveFavorites() {
  localStorage.setItem(FAV_KEY, JSON.stringify(favorites));
}

// Update Cart Badge
function updateCartBadge() {
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  const badgeEl = document.getElementById('cart-badge-count');
  if (badgeEl) {
    badgeEl.textContent = count;
    badgeEl.style.display = count > 0 ? 'flex' : 'none';
  }
}

// Switch Tabs
function switchTab(tabName) {
  currentTab = tabName;
  document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.classList.remove('active');
    if (tab.dataset.tab === tabName) {
      tab.classList.add('active');
    }
  });
  renderView();
}

// Set Active Category Filter
function setCategory(cat, element) {
  activeCategory = cat;
  document.querySelectorAll('.cat-pill').forEach(pill => pill.classList.remove('active'));
  if (element) element.classList.add('active');
  renderView();
}

// Handle Search
function handleSearch(query) {
  searchQuery = query.toLowerCase();
  renderView();
}

// Toggle Wishlist
function toggleFavorite(productId) {
  const idx = favorites.indexOf(productId);
  if (idx > -1) {
    favorites.splice(idx, 1);
    showToast("Removed from Wishlist");
  } else {
    favorites.push(productId);
    showToast("Added to Wishlist ❤️");
  }
  saveFavorites();
  renderView();
}

// Add to Cart
function addToCart(productId) {
  const products = getAppProducts();
  const prod = products.find(p => p.id == productId);
  if (!prod) return;

  const existingIdx = cart.findIndex(c => c.id == productId);
  if (existingIdx > -1) {
    cart[existingIdx].qty++;
  } else {
    cart.push({ ...prod, qty: 1 });
  }

  saveCart();
  showToast(`${prod.brand} added to Cart! 🛒`);
}

// Adjust Cart Qty
function updateCartQty(productId, delta) {
  const idx = cart.findIndex(c => c.id == productId);
  if (idx === -1) return;
  cart[idx].qty += delta;
  if (cart[idx].qty <= 0) {
    cart.splice(idx, 1);
  }
  saveCart();
  renderView();
}

// Show Toast
function showToast(msg) {
  const toast = document.getElementById('app-toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2200);
}

// ============================================================
// OWNER PIN AUTHENTICATION & SINGLE-APP ROLE SWITCHER
// ============================================================

function openOwnerPinModal() {
  const modal = document.getElementById('pin-modal');
  if (modal) modal.style.display = 'flex';
}

function closeOwnerPinModal() {
  const modal = document.getElementById('pin-modal');
  if (modal) modal.style.display = 'none';
}

function verifyOwnerPin() {
  const input = document.getElementById('pin-input');
  const pin = input ? input.value : '';
  if (pin === '1234') {
    isOwnerMode = true;
    localStorage.setItem(OWNER_MODE_KEY, 'true');
    closeOwnerPinModal();
    updateAppNavForRole();
    showToast("🔓 Owner Mode Unlocked!");
    switchTab('admin');
  } else {
    showToast("Incorrect PIN! (Default: 1234)");
  }
}

function switchRoleToCustomer() {
  isOwnerMode = false;
  localStorage.setItem(OWNER_MODE_KEY, 'false');
  updateAppNavForRole();
  showToast("Switched to Customer Mode 👤");
  switchTab('home');
}

function updateAppNavForRole() {
  const navContainer = document.querySelector('.app-nav');
  const modeBadge = document.getElementById('app-mode-badge');
  if (modeBadge) {
    modeBadge.textContent = isOwnerMode ? "OWNER MODE" : "CUSTOMER";
    modeBadge.style.background = isOwnerMode ? "rgba(255, 71, 87, 0.2)" : "rgba(0, 255, 102, 0.15)";
    modeBadge.style.color = isOwnerMode ? "#ff4757" : "var(--neon-green)";
  }

  if (navContainer) {
    if (isOwnerMode) {
      navContainer.innerHTML = `
        <div class="nav-tab ${currentTab==='home'?'active':''}" data-tab="home" onclick="switchTab('home')">
          <i class="fas fa-home"></i><span>Home</span>
        </div>
        <div class="nav-tab ${currentTab==='shop'?'active':''}" data-tab="shop" onclick="switchTab('shop')">
          <i class="fas fa-store"></i><span>Shop</span>
        </div>
        <div class="nav-tab ${currentTab==='garage'?'active':''}" data-tab="garage" onclick="switchTab('garage')">
          <i class="fas fa-tools"></i><span>Queries</span>
        </div>
        <div class="nav-tab ${currentTab==='admin'?'active':''}" data-tab="admin" onclick="switchTab('admin')">
          <i class="fas fa-user-shield"></i><span>Admin</span>
        </div>
        <div class="nav-tab ${currentTab==='cart'?'active':''}" data-tab="cart" onclick="switchTab('cart')">
          <i class="fas fa-shopping-cart"></i><span>Cart</span>
        </div>
      `;
    } else {
      navContainer.innerHTML = `
        <div class="nav-tab ${currentTab==='home'?'active':''}" data-tab="home" onclick="switchTab('home')">
          <i class="fas fa-home"></i><span>Home</span>
        </div>
        <div class="nav-tab ${currentTab==='shop'?'active':''}" data-tab="shop" onclick="switchTab('shop')">
          <i class="fas fa-store"></i><span>Shop</span>
        </div>
        <div class="nav-tab ${currentTab==='garage'?'active':''}" data-tab="garage" onclick="switchTab('garage')">
          <i class="fas fa-wrench"></i><span>Parts Request</span>
        </div>
        <div class="nav-tab ${currentTab==='account'?'active':''}" data-tab="account" onclick="switchTab('account')">
          <i class="fas fa-user"></i><span>Account</span>
        </div>
        <div class="nav-tab ${currentTab==='cart'?'active':''}" data-tab="cart" onclick="switchTab('cart')">
          <i class="fas fa-shopping-cart"></i><span>Cart</span>
        </div>
      `;
    }
  }
}

// Render Views
function renderView() {
  const contentArea = document.getElementById('app-content-area');
  if (!contentArea) return;

  if (currentTab === 'home' || currentTab === 'shop') {
    renderHomeView(contentArea);
  } else if (currentTab === 'garage') {
    if (isOwnerMode) {
      renderQueriesInboxView(contentArea);
    } else {
      renderGarageInquiryView(contentArea);
    }
  } else if (currentTab === 'account') {
    renderAccountView(contentArea);
  } else if (currentTab === 'admin') {
    renderAdminView(contentArea);
  } else if (currentTab === 'cart') {
    renderCartView(contentArea);
  }
}

// Render Home & Shop View
function renderHomeView(container) {
  const products = getAppProducts();
  let filtered = products.filter(p => {
    const matchesCat = activeCategory === 'all' || p.category === activeCategory;
    const matchesSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery) || p.brand.toLowerCase().includes(searchQuery);
    return matchesCat && matchesSearch;
  });

  container.innerHTML = `
    <!-- Search Bar -->
    <div class="search-container">
      <i class="fas fa-search search-icon"></i>
      <input type="text" class="search-input" placeholder="Search Parts (e.g. Swift Brake, Nexon Filter)..." value="${searchQuery}" oninput="handleSearch(this.value)">
    </div>

    <!-- Hero Card Carousel -->
    <div class="hero-card">
      <div class="hero-subtitle">⚡ GENUINE SPARE PARTS</div>
      <div class="hero-title">JRK AUTO PARTS INDIA</div>
      <button class="hero-btn" onclick="switchTab('garage')">Request Any Vehicle Part <i class="fas fa-arrow-right"></i></button>
      <img src="images/brembo_brake_kit.jpg" class="hero-image" alt="Engine Upgrade">
    </div>

    <!-- Category Pills -->
    <div class="category-scroll">
      <div class="cat-pill ${activeCategory==='all'?'active':''}" onclick="setCategory('all', this)"><i class="fas fa-th-large"></i> All</div>
      <div class="cat-pill ${activeCategory==='brakes'?'active':''}" onclick="setCategory('brakes', this)"><i class="fas fa-compact-disc"></i> Brakes</div>
      <div class="cat-pill ${activeCategory==='suspension'?'active':''}" onclick="setCategory('suspension', this)"><i class="fas fa-cogs"></i> Suspension</div>
      <div class="cat-pill ${activeCategory==='lighting'?'active':''}" onclick="setCategory('lighting', this)"><i class="fas fa-lightbulb"></i> Lighting</div>
      <div class="cat-pill ${activeCategory==='engine'?'active':''}" onclick="setCategory('engine', this)"><i class="fas fa-tachometer-alt"></i> Engine</div>
    </div>

    <!-- Products Section -->
    <div class="section-header">
      <div class="section-title">AVAILABLE INVENTORY</div>
      <a href="#" class="view-all" onclick="switchTab('shop'); return false;">SEE ALL</a>
    </div>

    <div class="products-grid">
      ${filtered.map(p => renderProductCard(p)).join('')}
    </div>
  `;
}

// Product Card HTML
function renderProductCard(p) {
  const isFav = favorites.includes(p.id);
  return `
    <div class="product-card">
      <button class="fav-btn ${isFav?'active':''}" onclick="toggleFavorite(${p.id})">
        <i class="${isFav?'fas':'far'} fa-heart"></i>
      </button>
      <div class="prod-img-wrap">
        <img src="${p.image}" class="prod-img" alt="${p.name}" onerror="this.src='images/brembo_brake_kit.jpg'">
      </div>
      <div class="brand-tag"><i class="fas fa-check-circle" style="color:var(--neon-green);font-size:0.6rem;"></i> ${p.brand}</div>
      <div class="prod-name">${p.name}</div>
      <div style="font-size:0.65rem;color:var(--text-muted);margin-bottom:6px;height:16px;overflow:hidden;">${p.compatibility}</div>
      <div class="prod-bottom">
        <div class="curr-price">₹${p.price.toFixed(0)}</div>
        <button class="add-cart-btn" onclick="addToCart(${p.id})">
          <i class="fas fa-plus"></i> ADD
        </button>
      </div>
    </div>
  `;
}

// ============================================================
// CUSTOM INDIAN VEHICLE PARTS INQUIRY FORM (CUSTOMER GARAGE)
// ============================================================

function renderGarageInquiryView(container) {
  container.innerHTML = `
    <div style="padding-top:10px;">
      <div class="section-title" style="margin-bottom:14px;">PARTS & VEHICLE INQUIRY</div>
      <div class="admin-card">
        <div style="font-family:'Orbitron';font-size:0.92rem;color:var(--neon-green);margin-bottom:6px;">
          <i class="fas fa-wrench"></i> REQUEST ANY VEHICLE PART
        </div>
        <p style="font-size:0.78rem;color:var(--text-sub);margin-bottom:14px;">
          Can't find a part? Name your vehicle and part description below. JRK Auto Parts will source it for you directly!
        </p>

        <!-- Quick Popular Indian Vehicles -->
        <label class="form-label">Popular Indian Models</label>
        <div style="margin-bottom:12px;">
          <span class="veh-tag ${selectedVehiclePill==='Maruti Swift'?'selected':''}" onclick="selectVehicleTag('Maruti Swift', this)">Maruti Swift</span>
          <span class="veh-tag ${selectedVehiclePill==='Tata Nexon'?'selected':''}" onclick="selectVehicleTag('Tata Nexon', this)">Tata Nexon</span>
          <span class="veh-tag ${selectedVehiclePill==='Mahindra Thar'?'selected':''}" onclick="selectVehicleTag('Mahindra Thar', this)">Mahindra Thar</span>
          <span class="veh-tag ${selectedVehiclePill==='Royal Enfield 350'?'selected':''}" onclick="selectVehicleTag('Royal Enfield 350', this)">Royal Enfield 350</span>
          <span class="veh-tag ${selectedVehiclePill==='Hero Splendor'?'selected':''}" onclick="selectVehicleTag('Hero Splendor', this)">Hero Splendor</span>
          <span class="veh-tag ${selectedVehiclePill==='Honda Activa'?'selected':''}" onclick="selectVehicleTag('Honda Activa', this)">Honda Activa</span>
        </div>

        <label class="form-label">Vehicle Name & Model Year</label>
        <input type="text" id="inquiry-vehicle" class="form-control" placeholder="e.g. Maruti Swift 2022 VXi / Mahindra Thar 4x4" value="${selectedVehiclePill}">

        <label class="form-label">Required Part Name & Details</label>
        <textarea id="inquiry-part-details" class="form-control" rows="3" style="resize:none;" placeholder="e.g. Front Right Brake Disc, Clutch Cable, LED Headlight Assembly..."></textarea>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
          <div>
            <label class="form-label">Your Name</label>
            <input type="text" id="inquiry-name" class="form-control" placeholder="Rahul Sharma">
          </div>
          <div>
            <label class="form-label">Phone / WhatsApp</label>
            <input type="text" id="inquiry-phone" class="form-control" placeholder="9876543210">
          </div>
        </div>

        <button class="btn-neon" style="margin-top:6px;" onclick="handleSendPartInquiry()">
          <i class="fas fa-paper-plane"></i> SUBMIT INQUIRY TO OWNER
        </button>
      </div>
    </div>
  `;
}

function selectVehicleTag(val, el) {
  selectedVehiclePill = val;
  document.querySelectorAll('.veh-tag').forEach(tag => tag.classList.remove('selected'));
  if (el) el.classList.add('selected');
  const input = document.getElementById('inquiry-vehicle');
  if (input) input.value = val;
}

function handleSendPartInquiry() {
  const vehicle = document.getElementById('inquiry-vehicle').value.trim();
  const part = document.getElementById('inquiry-part-details').value.trim();
  const name = document.getElementById('inquiry-name').value.trim() || 'Customer';
  const phone = document.getElementById('inquiry-phone').value.trim() || 'Not provided';

  if (!vehicle || !part) {
    showToast("Please enter vehicle model & part description!");
    return;
  }

  const queryObj = {
    id: 'QRY-' + Date.now().toString().slice(-5),
    vehicle,
    part,
    name,
    phone,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    status: 'PENDING'
  };

  customerQueries.unshift(queryObj);
  localStorage.setItem(QUERIES_KEY, JSON.stringify(customerQueries));

  showToast("Inquiry sent to JRK Auto Parts! The owner will contact you shortly 🚀");
  switchTab('home');
}

// Render Queries Inbox for Owner
function renderQueriesInboxView(container) {
  container.innerHTML = `
    <div style="padding-top:10px;">
      <div class="section-title" style="margin-bottom:14px;">INCOMING PARTS INQUIRIES</div>
      ${customerQueries.length === 0 ? `
        <div style="text-align:center;padding:40px 20px;color:var(--text-muted);">
          <i class="fas fa-inbox" style="font-size:2.5rem;margin-bottom:10px;"></i>
          <div>No customer inquiries yet.</div>
        </div>
      ` : `
        <div style="display:flex;flex-direction:column;gap:10px;">
          ${customerQueries.map(q => `
            <div style="background:var(--card-bg);border:1px solid var(--card-border);border-radius:14px;padding:14px;">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                <span style="font-family:'Orbitron';font-size:0.8rem;color:var(--neon-green);">${q.id} • ${q.vehicle}</span>
                <span style="font-size:0.65rem;color:var(--text-sub);">${q.timestamp}</span>
              </div>
              <div style="font-size:0.85rem;font-weight:700;color:#fff;margin-bottom:6px;">Part: ${q.part}</div>
              <div style="font-size:0.75rem;color:var(--text-sub);margin-bottom:10px;">
                <i class="fas fa-user"></i> ${q.name} | <i class="fas fa-phone"></i> ${q.phone}
              </div>
              <button class="add-cart-btn" style="width:100%;justify-content:center;background:rgba(0,255,102,0.15);color:var(--neon-green);border:1px solid var(--neon-green);" onclick="window.open('https://wa.me/91${q.phone}?text=Hello%20${encodeURIComponent(q.name)},%20regarding%20your%20inquiry%20for%20${encodeURIComponent(q.vehicle)}%20${encodeURIComponent(q.part)}...')">
                <i class="fab fa-whatsapp"></i> REPLY ON WHATSAPP
              </button>
            </div>
          `).join('')}
        </div>
      `}
    </div>
  `;
}

// ============================================================
// ACCOUNT TAB & OWNER ACCESS TOGGLE
// ============================================================

function renderAccountView(container) {
  container.innerHTML = `
    <div style="padding-top:10px;">
      <div class="section-title" style="margin-bottom:14px;">CUSTOMER ACCOUNT</div>
      
      <div class="admin-card" style="text-align:center;padding:24px 16px;">
        <div style="width:60px;height:60px;border-radius:50%;background:rgba(0,255,102,0.15);border:1px solid var(--neon-green);color:var(--neon-green);display:flex;align-items:center;justify-content:center;font-size:1.6rem;margin:0 auto 12px auto;">
          <i class="fas fa-user"></i>
        </div>
        <div style="font-family:'Orbitron';font-size:1rem;color:#fff;margin-bottom:4px;">JRK Customer</div>
        <div style="font-size:0.78rem;color:var(--text-sub);margin-bottom:16px;">Welcome to JRK Auto Parts India</div>

        <button class="btn-neon" style="background:rgba(255,255,255,0.06);color:#fff;border:1px solid var(--card-border);" onclick="openOwnerPinModal()">
          <i class="fas fa-user-shield" style="color:var(--neon-green);"></i> SHOP OWNER / STAFF LOGIN
        </button>
      </div>
    </div>
  `;
}

// ============================================================
// OWNER ADMIN VIEW WITH DYNAMIC IMAGE UPLOAD & FALLBACKS
// ============================================================

function renderAdminView(container) {
  const products = getAppProducts();
  container.innerHTML = `
    <div style="padding-top:10px;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">
        <span style="font-family:'Orbitron';font-size:1rem;color:var(--neon-green);"><i class="fas fa-tools"></i> OWNER ADMIN PANEL</span>
        <button style="background:rgba(255,71,87,0.15);color:#ff4757;border:1px solid #ff4757;padding:4px 10px;border-radius:100px;font-size:0.7rem;font-weight:bold;cursor:pointer;" onclick="switchRoleToCustomer()">
          EXIT OWNER MODE
        </button>
      </div>

      <!-- Add New Product Form -->
      <div class="admin-card">
        <div style="font-family:'Orbitron';font-size:0.88rem;color:#fff;margin-bottom:12px;">+ ADD NEW INVENTORY PART</div>
        
        <label class="form-label">Part Name</label>
        <input type="text" id="app-admin-name" class="form-control" placeholder="e.g. Front Disc Plate">

        <label class="form-label">Brand / Manufacturer</label>
        <input type="text" id="app-admin-brand" class="form-control" placeholder="e.g. Minda / Bosch / JRK">

        <label class="form-label">Compatible Vehicles</label>
        <input type="text" id="app-admin-compat" class="form-control" placeholder="e.g. Swift, Baleno, Dzire">

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
          <div>
            <label class="form-label">Category</label>
            <select id="app-admin-cat" class="form-control">
              <option value="brakes">Brakes</option>
              <option value="engine">Engine</option>
              <option value="suspension">Suspension</option>
              <option value="lighting">Lighting</option>
              <option value="exhaust">Exhaust</option>
            </select>
          </div>
          <div>
            <label class="form-label">Price (₹)</label>
            <input type="number" id="app-admin-price" class="form-control" placeholder="1250">
          </div>
        </div>

        <!-- Custom Image Upload Input -->
        <label class="form-label">Product Image Photo (Optional)</label>
        <input type="file" id="app-admin-img-file" class="form-control" accept="image/*" onchange="handleImageFileSelect(event)">
        <div style="font-size:0.68rem;color:var(--text-sub);margin:-8px 0 12px 0;">
          💡 <em>If no photo is selected, the app automatically applies a high-resolution studio category visual!</em>
        </div>

        <button class="btn-neon" onclick="handleAddAdminProduct()">
          <i class="fas fa-plus-circle"></i> SAVE TO STORE INVENTORY
        </button>
      </div>

      <!-- Inventory List -->
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
        <div class="section-title" style="margin-bottom:0;">CURRENT STOCK INVENTORY</div>
        <button style="background:none;border:none;color:var(--neon-green);font-size:0.75rem;font-weight:bold;cursor:pointer;" onclick="resetInventoryToDefault()">
          <i class="fas fa-undo"></i> RESTORE CATALOG
        </button>
      </div>

      <div style="display:flex;flex-direction:column;gap:8px;">
        ${products.map(p => `
          <div style="background:var(--card-bg);border:1px solid var(--card-border);border-radius:12px;padding:10px 12px;display:flex;align-items:center;justify-content:space-between;">
            <div style="display:flex;align-items:center;gap:10px;">
              <img src="${p.image}" style="width:40px;height:40px;object-fit:contain;border-radius:6px;background:rgba(0,0,0,0.5);" onerror="this.src='images/brembo_brake_kit.jpg'">
              <div>
                <div style="font-size:0.8rem;font-weight:700;color:#fff;">${p.name}</div>
                <div style="font-size:0.7rem;color:var(--text-sub);">${p.brand} • ₹${p.price.toFixed(0)}</div>
              </div>
            </div>
            <div style="font-family:'Orbitron';font-size:0.75rem;color:var(--neon-green);background:rgba(0,255,102,0.1);padding:4px 8px;border-radius:6px;">
              QTY: ${p.stockCount}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// Convert Uploaded File to Base64
function handleImageFileSelect(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    tempUploadedImageData = e.target.result;
    showToast("Photo Uploaded Successfully!");
  };
  reader.readAsDataURL(file);
}

// Add Product to Store Inventory (Appends to existing inventory!)
function handleAddAdminProduct() {
  const name = document.getElementById('app-admin-name').value.trim();
  const brand = document.getElementById('app-admin-brand').value.trim() || 'JRK Genuine';
  const compat = document.getElementById('app-admin-compat').value.trim() || 'Universal Indian Fitment';
  const cat = document.getElementById('app-admin-cat').value;
  const price = parseFloat(document.getElementById('app-admin-price').value) || 499;

  if (!name) {
    showToast("Please enter part name!");
    return;
  }

  // Use uploaded base64 photo OR high-res category fallback visual
  const finalImage = tempUploadedImageData || CATEGORY_FALLBACK_IMAGES[cat] || CATEGORY_FALLBACK_IMAGES.general;

  // Retrieve current inventory or seed with INITIAL_APP_PRODUCTS
  let existingAdminDb = JSON.parse(localStorage.getItem(ADMIN_DB_KEY) || '[]');
  if (existingAdminDb.length === 0) {
    existingAdminDb = INITIAL_APP_PRODUCTS.map(p => ({
      id: 'PRD-' + p.id,
      name: p.name,
      brand: p.brand,
      compatibility: p.compatibility,
      cat: p.category,
      price: p.price,
      stock: p.stockCount,
      image: p.image
    }));
  }

  const newProduct = {
    id: 'PRD-' + (existingAdminDb.length + 101),
    name: name,
    brand: brand,
    compatibility: compat,
    cat: cat,
    price: price,
    stock: 25,
    image: finalImage
  };

  existingAdminDb.push(newProduct);
  localStorage.setItem(ADMIN_DB_KEY, JSON.stringify(existingAdminDb));

  tempUploadedImageData = ''; // Reset image temp state
  showToast("New Part Added to Live Inventory! 🚀");
  switchTab('shop');
}

// Render Cart View
function renderCartView(container) {
  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  
  if (cart.length === 0) {
    container.innerHTML = `
      <div style="text-align:center;padding:60px 20px;">
        <i class="fas fa-shopping-cart" style="font-size:3.5rem;color:var(--card-border);margin-bottom:16px;"></i>
        <div style="font-family:'Orbitron';font-size:1.1rem;color:#fff;margin-bottom:6px;">YOUR CART IS EMPTY</div>
        <p style="font-size:0.8rem;color:var(--text-muted);margin-bottom:20px;">Add auto spare parts to complete your order</p>
        <button class="btn-neon" style="width:auto;padding:10px 24px;margin:0 auto;" onclick="switchTab('shop')">BROWSE PARTS CATALOG</button>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div style="padding-top:10px;">
      <div class="section-title" style="margin-bottom:14px;">YOUR SHOPPING CART</div>
      
      <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:20px;">
        ${cart.map(item => `
          <div style="background:var(--card-bg);border:1px solid var(--card-border);border-radius:14px;padding:12px;display:flex;align-items:center;gap:12px;">
            <img src="${item.image}" style="width:50px;height:50px;object-fit:contain;border-radius:8px;background:rgba(0,0,0,0.4);" onerror="this.src='images/brembo_brake_kit.jpg'">
            <div style="flex:1;">
              <div style="font-size:0.8rem;font-weight:700;color:#fff;">${item.name}</div>
              <div style="font-family:'Orbitron';font-size:0.82rem;color:var(--neon-green);">₹${item.price.toFixed(0)}</div>
            </div>
            <div style="display:flex;align-items:center;gap:8px;background:rgba(0,0,0,0.5);padding:4px 8px;border-radius:8px;border:1px solid var(--card-border);">
              <button style="background:none;border:none;color:#fff;font-weight:bold;cursor:pointer;" onclick="updateCartQty(${item.id}, -1)">−</button>
              <span style="font-family:'Orbitron';font-size:0.8rem;color:var(--neon-green);">${item.qty}</span>
              <button style="background:none;border:none;color:#fff;font-weight:bold;cursor:pointer;" onclick="updateCartQty(${item.id}, 1)">+</button>
            </div>
          </div>
        `).join('')}
      </div>

      <div class="admin-card" style="margin-bottom:20px;">
        <div style="display:flex;justify-content:space-between;margin-bottom:8px;font-size:0.82rem;color:var(--text-sub);">
          <span>Subtotal</span>
          <span>₹${total.toFixed(0)}</span>
        </div>
        <div style="display:flex;justify-content:space-between;margin-bottom:8px;font-size:0.82rem;color:var(--text-sub);">
          <span>Express Delivery</span>
          <span style="color:var(--neon-green);">FREE</span>
        </div>
        <div style="height:1px;background:var(--card-border);margin:10px 0;"></div>
        <div style="display:flex;justify-content:space-between;font-family:'Orbitron';font-size:1rem;color:#fff;margin-bottom:16px;">
          <span>TOTAL</span>
          <span style="color:var(--neon-green);">₹${total.toFixed(0)}</span>
        </div>
        <button class="btn-neon" onclick="cart=[]; saveCart(); showToast('Order Placed Successfully! 🏎️'); switchTab('home');">
          PROCEED TO CHECKOUT <i class="fas fa-lock"></i>
        </button>
      </div>
    </div>
  `;
}

// Initializer
document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();
  updateAppNavForRole();
  renderView();
});
