// ============================================================
// MOTO STORE - Main Application Logic
// ============================================================

// ── Cart State ──────────────────────────────────────────────
let cart = JSON.parse(localStorage.getItem('moto_cart') || '[]');

function saveCart() {
  localStorage.setItem('moto_cart', JSON.stringify(cart));
}

function getCartCount() {
  return cart.reduce((sum, item) => sum + item.qty, 0);
}

function getCartTotal() {
  return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}

function addToCart(productId) {
  const product = getProductById(productId);
  if (!product) return;
  const existingIndex = cart.findIndex(i => i.id === productId);
  if (existingIndex > -1) {
    cart[existingIndex].qty++;
  } else {
    cart.push({ id: product.id, name: product.name, price: product.price, qty: 1 });
  }
  saveCart();
  updateCartUI();
  showToast(`${product.name} added to cart!`, 'success');
}

function removeFromCart(productId) {
  cart = cart.filter(i => i.id !== productId);
  saveCart();
  updateCartUI();
  renderCartItems();
}

function updateQty(productId, delta) {
  const idx = cart.findIndex(i => i.id === productId);
  if (idx === -1) return;
  cart[idx].qty = Math.max(1, cart[idx].qty + delta);
  saveCart();
  updateCartUI();
  renderCartItems();
}

// ── Cart UI ─────────────────────────────────────────────────
function updateCartUI() {
  const count = getCartCount();
  document.querySelectorAll('.cart-count').forEach(el => {
    el.textContent = count;
    el.style.display = count > 0 ? 'flex' : 'none';
  });
}

function renderCartItems() {
  const container = document.getElementById('cart-items');
  const totalEl = document.getElementById('cart-total');
  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="cart-empty">
        <div class="cart-empty-icon">🛒</div>
        <p>Your cart is empty</p>
        <p style="font-size:0.8rem;margin-top:0.5rem;color:var(--text-muted)">Add bikes or parts to get started</p>
      </div>`;
  } else {
    const ICONS = { bikes: '🏍️', scooters: '🛵', parts: '⚙️' };
    container.innerHTML = cart.map(item => {
      const product = getProductById(item.id);
      const icon = ICONS[product?.category] || '📦';
      return `
        <div class="cart-item">
          <div class="cart-item-img">${icon}</div>
          <div class="cart-item-info">
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-price">${formatPrice(item.price)}</div>
          </div>
          <div class="cart-item-qty">
            <button class="qty-btn" onclick="updateQty(${item.id}, -1)">−</button>
            <span class="qty-num">${item.qty}</span>
            <button class="qty-btn" onclick="updateQty(${item.id}, 1)">+</button>
          </div>
          <button class="remove-item-btn" onclick="removeFromCart(${item.id})" title="Remove">✕</button>
        </div>`;
    }).join('');
  }

  if (totalEl) totalEl.textContent = formatPrice(getCartTotal());
}

// ── Cart Sidebar ─────────────────────────────────────────────
function openCart() {
  document.getElementById('cart-sidebar')?.classList.add('open');
  document.getElementById('modal-overlay')?.classList.remove('open');
  renderCartItems();
}
function closeCart() {
  document.getElementById('cart-sidebar')?.classList.remove('open');
}

// ── Product Modal ────────────────────────────────────────────
function openProductModal(productId) {
  const product = getProductById(productId);
  if (!product) return;
  const overlay = document.getElementById('modal-overlay');
  if (!overlay) return;

  const ICONS = { bikes: '🏍️', scooters: '🛵', parts: '⚙️' };
  const icon = ICONS[product.category] || '📦';

  const specFields = product.engine
    ? [
        { label: 'Engine', val: product.engine },
        { label: 'Power', val: product.power },
        { label: 'Torque', val: product.torque },
        { label: 'Top Speed', val: product.topSpeed },
        { label: 'Weight', val: product.weight },
        { label: 'Fuel', val: product.fuel },
      ]
    : [
        { label: 'Compatibility', val: product.compatibility },
        { label: 'Material', val: product.material },
        { label: 'Warranty', val: product.warranty },
      ];

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  overlay.innerHTML = `
    <div class="modal" id="product-modal">
      <div class="modal-header">
        <div>
          <div class="modal-category">${product.category} / ${product.subcategory}</div>
          <div style="font-family:'Orbitron',monospace;font-weight:700;">${product.name}</div>
        </div>
        <button class="close-btn" onclick="closeModal()">✕</button>
      </div>
      <div class="modal-body">
        <div class="modal-grid">
          <div class="modal-image">${icon}</div>
          <div class="modal-info">
            <div style="display:flex;gap:0.75rem;align-items:center;margin-bottom:0.75rem;">
              <span class="badge" style="background:${product.badgeColor}22;color:${product.badgeColor};">${product.badge}</span>
              <div class="stars">${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5 - Math.floor(product.rating))}</div>
              <span style="font-size:0.8rem;color:var(--text-muted);font-family:'Rajdhani',sans-serif;">(${product.reviews})</span>
            </div>
            <div class="modal-price">${formatPrice(product.price)}</div>
            ${product.originalPrice ? `<div style="display:flex;gap:0.75rem;margin-bottom:1rem;"><span style="color:var(--text-muted);text-decoration:line-through;font-size:0.9rem;font-family:'Rajdhani',sans-serif;">${formatPrice(product.originalPrice)}</span><span style="color:#10b981;font-weight:700;font-family:'Rajdhani',sans-serif;">${discount}% OFF</span></div>` : ''}
            <div class="modal-desc">${product.description}</div>
            <div class="modal-specs">
              ${specFields.filter(s => s.val).map(s => `
                <div class="modal-spec-item">
                  <div class="modal-spec-label">${s.label}</div>
                  <div class="modal-spec-val">${s.val}</div>
                </div>`).join('')}
            </div>
            <div class="modal-actions">
              <button class="btn-primary modal-add-btn add-to-cart-btn" onclick="addToCart(${product.id});closeModal()">
                🛒 Add to Cart
              </button>
              <button class="btn-outline" onclick="closeModal()" style="border-radius:var(--radius-md);padding:0.9rem 1.5rem;">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>`;

  overlay.classList.add('open');
}

function closeModal() {
  document.getElementById('modal-overlay')?.classList.remove('open');
}

// ── Search Modal ─────────────────────────────────────────────
function openSearch() {
  const sm = document.getElementById('search-modal');
  sm?.classList.add('open');
  document.getElementById('main-search')?.focus();
}
function closeSearch() {
  document.getElementById('search-modal')?.classList.remove('open');
}
function handleSearch(query) {
  const container = document.getElementById('search-results');
  if (!container) return;
  if (!query.trim()) { container.innerHTML = ''; return; }
  const results = searchProducts(query).slice(0, 6);
  if (results.length === 0) {
    container.innerHTML = `<div style="text-align:center;padding:2rem;color:var(--text-muted);font-family:'Rajdhani',sans-serif;">No results found for "${query}"</div>`;
    return;
  }
  const ICONS = { bikes: '🏍️', scooters: '🛵', parts: '⚙️' };
  container.innerHTML = results.map(p => `
    <div class="search-result-item" onclick="closeSearch();openProductModal(${p.id})">
      <div style="font-size:1.5rem;">${ICONS[p.category] || '📦'}</div>
      <div style="flex:1">
        <div style="font-family:'Rajdhani',sans-serif;font-weight:700;">${p.name}</div>
        <div style="font-size:0.8rem;color:var(--text-muted);font-family:'Rajdhani',sans-serif;">${p.category} • ${formatPrice(p.price)}</div>
      </div>
      <div style="font-family:'Orbitron',monospace;font-size:0.85rem;color:var(--accent-red);">${formatPrice(p.price)}</div>
    </div>
  `).join('');
}

// ── Toast ─────────────────────────────────────────────────────
function showToast(msg, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const icons = { success: '✅', info: 'ℹ️', error: '❌' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${icons[type]}</span><span>${msg}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'toastOut 0.4s ease forwards';
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}

// ── Products Rendering ────────────────────────────────────────
let activeFilter = 'all';

function renderProducts(category = 'all', container = null) {
  const el = container || document.getElementById('products-grid');
  if (!el) return;
  activeFilter = category;

  const products = getProductsByCategory(category);
  const ICONS = { bikes: '🏍️', scooters: '🛵', parts: '⚙️' };

  el.innerHTML = products.map(p => {
    const discount = p.originalPrice
      ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
      : 0;
    const stars = '★'.repeat(Math.floor(p.rating)) + '☆'.repeat(5 - Math.floor(p.rating));
    const icon = ICONS[p.category] || '📦';
    const specs = p.engine
      ? `<div class="card-spec"><strong>Engine</strong>${p.engine}</div><div class="card-spec"><strong>Power</strong>${p.power}</div>`
      : `<div class="card-spec"><strong>For</strong>${p.compatibility || 'Universal'}</div><div class="card-spec"><strong>Material</strong>${p.material || '—'}</div>`;

    return `
      <div class="product-card reveal" onclick="openProductModal(${p.id})">
        <div class="card-image">
          <span class="badge card-badge" style="background:${p.badgeColor}22;color:${p.badgeColor};">${p.badge}</span>
          <div class="card-actions" onclick="event.stopPropagation()">
            <button class="card-action-btn" title="Add to Cart" onclick="addToCart(${p.id})">🛒</button>
            <button class="card-action-btn" title="View Details" onclick="openProductModal(${p.id})">👁️</button>
          </div>
          <div style="font-size:5rem;position:relative;z-index:1;">${icon}</div>
        </div>
        <div class="card-body">
          <div class="card-category">${p.category} / ${p.subcategory}</div>
          <div class="card-name">${p.name}</div>
          <div class="card-specs">${specs}</div>
          <div class="card-rating">
            <span class="stars">${stars}</span>
            <span class="rating-num">${p.rating}</span>
            <span class="rating-count">(${p.reviews})</span>
          </div>
          <div class="card-footer">
            <div class="card-price">
              <span class="price-current">${formatPrice(p.price)}</span>
              ${p.originalPrice ? `<span class="price-original">${formatPrice(p.originalPrice)}</span>` : ''}
              ${discount > 0 ? `<span class="price-discount">-${discount}% OFF</span>` : ''}
            </div>
            <button class="add-to-cart-btn" onclick="event.stopPropagation();addToCart(${p.id})">
              🛒 Add
            </button>
          </div>
        </div>
      </div>`;
  }).join('');

  // Re-trigger scroll reveal for newly rendered items
  observeRevealElements();
}

function setFilter(category) {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === category);
  });
  renderProducts(category);
}

// ── Scroll Reveal ─────────────────────────────────────────────
function observeRevealElements() {
  const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  els.forEach(el => {
    if (!el.classList.contains('visible')) observer.observe(el);
  });
}

// ── Navbar Scroll ─────────────────────────────────────────────
function initNavbar() {
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar?.classList.toggle('scrolled', window.scrollY > 60);
  });
}

// ── Mobile Menu ───────────────────────────────────────────────
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');
  const overlay = document.getElementById('mobile-overlay');

  function toggle() {
    hamburger?.classList.toggle('open');
    mobileNav?.classList.toggle('open');
    overlay?.classList.toggle('show');
  }
  hamburger?.addEventListener('click', toggle);
  overlay?.addEventListener('click', toggle);
}

// ── Counter Animation ─────────────────────────────────────────
function animateCounter(el, end, suffix = '') {
  let start = 0;
  const duration = 1500;
  const step = end / (duration / 16);
  const timer = setInterval(() => {
    start = Math.min(start + step, end);
    el.textContent = Math.floor(start).toLocaleString() + suffix;
    if (start >= end) clearInterval(timer);
  }, 16);
}

function initCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        animateCounter(el, parseInt(el.dataset.counter), el.dataset.suffix || '');
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(el => observer.observe(el));
}

// ── Particle Effects ───────────────────────────────────────────
function initParticles(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  for (let i = 0; i < 12; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      animation-delay: ${Math.random() * 3}s;
      animation-duration: ${2 + Math.random() * 3}s;
      width: ${2 + Math.random() * 4}px;
      height: ${2 + Math.random() * 4}px;
      opacity: ${0.3 + Math.random() * 0.7};
    `;
    container.appendChild(p);
  }
}

// ── 3D Mouse Parallax ─────────────────────────────────────────
function init3DParallax() {
  const hero = document.querySelector('.hero');
  const bikeShowcase = document.querySelector('.bike-showcase');
  if (!hero || !bikeShowcase) return;

  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    bikeShowcase.style.transform = `
      translateY(${y * -20}px)
      rotateY(${x * 15}deg)
      rotateX(${y * 8}deg)
    `;
  });

  hero.addEventListener('mouseleave', () => {
    bikeShowcase.style.transform = 'translateY(0) rotateY(-5deg)';
  });
}

// ── Smooth Scroll for Anchors ─────────────────────────────────
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      target?.scrollIntoView({ behavior: 'smooth' });
    });
  });
}

// ── Keyboard Shortcuts ──────────────────────────────────────
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeModal();
    closeCart();
    closeSearch();
  }
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    openSearch();
  }
});

// ── Close modal on outside click ───────────────────────────
document.getElementById('modal-overlay')?.addEventListener('click', (e) => {
  if (e.target === document.getElementById('modal-overlay')) closeModal();
});

// ── Checkout ────────────────────────────────────────────────
function handleCheckout() {
  if (cart.length === 0) {
    showToast('Your cart is empty!', 'error');
    return;
  }
  showToast('🎉 Order placed! Thank you for shopping with JRK Auto Parts!', 'success');
  cart = [];
  saveCart();
  updateCartUI();
  renderCartItems();
  closeCart();
}

// ── Init ────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Hide loader
  setTimeout(() => document.getElementById('loader')?.classList.add('hide'), 1800);

  initNavbar();
  initMobileMenu();
  initSmoothScroll();
  initCounters();
  init3DParallax();
  initParticles('hero-particles');
  observeRevealElements();
  updateCartUI();

  // Render products if grid exists
  if (document.getElementById('products-grid')) {
    renderProducts('all');
  }

  // Filter buttons
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => setFilter(btn.dataset.filter));
  });

  // Search input
  const searchInput = document.getElementById('main-search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => handleSearch(e.target.value));
  }
});
