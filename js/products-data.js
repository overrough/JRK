// ============================================================
// MOTO STORE - Product Catalog Data
// ============================================================

let PRODUCTS = [
// ── ENGINE PARTS ─────────────────────────────────────────
  {
    id: 9,
    name: "High-Performance Piston Kit",
    category: "parts",
    subcategory: "engine",
    price: 3800,
    originalPrice: 4500,
    rating: 4.9,
    reviews: 145,
    badge: "OEM Grade",
    badgeColor: "#6366f1",
    compatibility: "100cc - 250cc Engines",
    material: "Forged Aluminum",
    warranty: "2 Years",
    description: "Forged aluminum pistons with precision rings. Ideal for engine rebuilds and performance upgrades.",
    images: ["part-engine.svg"],
    inStock: true,
    featured: false,
  },
  {
    id: 10,
    name: "Performance Camshaft",
    category: "parts",
    subcategory: "engine",
    price: 6200,
    originalPrice: 7500,
    rating: 4.7,
    reviews: 89,
    badge: "Performance",
    badgeColor: "#f59e0b",
    compatibility: "150cc - 400cc Engines",
    material: "Billet Steel",
    warranty: "3 Years",
    description: "Billet steel camshaft for increased top-end power. Precision ground lobes for optimal valve timing.",
    images: ["part-engine.svg"],
    inStock: true,
    featured: false,
  },
  {
    id: 11,
    name: "Nikasil Cylinder Sleeve",
    category: "parts",
    subcategory: "engine",
    price: 4500,
    originalPrice: 5200,
    rating: 4.8,
    reviews: 67,
    badge: "Premium",
    badgeColor: "#8b5cf6",
    compatibility: "Universal 100-400cc",
    material: "Nikasil Coated Aluminum",
    warranty: "2 Years",
    description: "Nikasil-coated cylinder sleeve for reduced friction, better heat dissipation and longer engine life.",
    images: ["part-engine.svg"],
    inStock: true,
    featured: false,
  },
  // ── BRAKE PARTS ──────────────────────────────────────────
  {
    id: 12,
    name: "Brembo Racing Brake Kit",
    category: "parts",
    subcategory: "brakes",
    price: 12500,
    originalPrice: 15000,
    rating: 5.0,
    reviews: 203,
    badge: "Racing",
    badgeColor: "#ef4444",
    compatibility: "Sport & Naked Bikes",
    material: "Carbon-Ceramic",
    warranty: "1 Year",
    description: "Brembo-spec racing brake kit. Shorter stopping distances, fade-resistant on track and street.",
    images: ["part-brake.svg"],
    inStock: true,
    featured: true,
  },
  {
    id: 13,
    name: "Sintered Brake Pads (Set of 4)",
    category: "parts",
    subcategory: "brakes",
    price: 850,
    originalPrice: 1100,
    rating: 4.6,
    reviews: 543,
    badge: "Value Pack",
    badgeColor: "#10b981",
    compatibility: "Most 100-650cc Bikes",
    material: "Sintered Metal",
    warranty: "6 Months",
    description: "Long-lasting sintered brake pads with excellent bite and thermal stability. Universal fitment.",
    images: ["part-brake.svg"],
    inStock: true,
    featured: false,
  },
  // ── SUSPENSION ───────────────────────────────────────────
  {
    id: 14,
    name: "Öhlins Rear Shock Absorber",
    category: "parts",
    subcategory: "suspension",
    price: 18500,
    originalPrice: 22000,
    rating: 5.0,
    reviews: 112,
    badge: "Pro",
    badgeColor: "#f59e0b",
    compatibility: "Universal Fit",
    material: "Aircraft Aluminum",
    warranty: "2 Years",
    description: "Adjustable Öhlins rear mono-shock. Full rebound and compression adjustment for any riding style.",
    images: ["part-suspension.svg"],
    inStock: true,
    featured: true,
  },
  {
    id: 15,
    name: "Front Fork Rebuild Kit",
    category: "parts",
    subcategory: "suspension",
    price: 2200,
    originalPrice: 2800,
    rating: 4.5,
    reviews: 198,
    badge: "DIY Kit",
    badgeColor: "#06b6d4",
    compatibility: "35mm - 43mm Forks",
    material: "Steel & NBR Seals",
    warranty: "1 Year",
    description: "Complete front fork rebuild kit with seals, oil, and bushings. Restore original suspension feel.",
    images: ["part-suspension.svg"],
    inStock: true,
    featured: false,
  },
  // ── EXHAUST ──────────────────────────────────────────────
  {
    id: 16,
    name: "Akrapovic Slip-On Exhaust",
    category: "parts",
    subcategory: "exhaust",
    price: 22000,
    originalPrice: 26000,
    rating: 4.9,
    reviews: 267,
    badge: "Sound King",
    badgeColor: "#ef4444",
    compatibility: "Sport & Naked 400-900cc",
    material: "Titanium",
    warranty: "2 Years",
    description: "Titanium Akrapovic slip-on with deep, throaty exhaust note. Weight saving of 3.2kg over stock.",
    images: ["part-exhaust.svg"],
    inStock: true,
    featured: true,
  },
  {
    id: 17,
    name: "Stainless Steel Full Exhaust",
    category: "parts",
    subcategory: "exhaust",
    price: 8500,
    originalPrice: 10500,
    rating: 4.4,
    reviews: 156,
    badge: "Full System",
    badgeColor: "#6366f1",
    compatibility: "100cc - 250cc Bikes",
    material: "304 Stainless Steel",
    warranty: "1 Year",
    description: "Full stainless-steel exhaust system. Improved flow for a 5-8% power gain. Includes heat shield.",
    images: ["part-exhaust.svg"],
    inStock: true,
    featured: false,
  },
  // ── ELECTRICAL ───────────────────────────────────────────
  {
    id: 18,
    name: "LED Projector Headlight",
    category: "parts",
    subcategory: "electrical",
    price: 3500,
    originalPrice: 4200,
    rating: 4.7,
    reviews: 389,
    badge: "Night Vision",
    badgeColor: "#06b6d4",
    compatibility: "Universal 7-inch Mount",
    material: "Die-cast Aluminum",
    warranty: "1 Year",
    description: "High-intensity LED projector headlight. 6000K white beam, 200% brighter than halogen. IP67 rated.",
    images: ["part-electrical.svg"],
    inStock: true,
    featured: false,
  },
  {
    id: 19,
    name: "Lithium-Ion Battery 12V",
    category: "parts",
    subcategory: "electrical",
    price: 2800,
    originalPrice: 3200,
    rating: 4.8,
    reviews: 445,
    badge: "Long Life",
    badgeColor: "#10b981",
    compatibility: "All 12V Motorcycles",
    material: "LiFePO4",
    warranty: "3 Years",
    description: "Lightweight lithium battery. 5x longer life than lead-acid, 60% weight reduction. 2000+ cycles.",
    images: ["part-electrical.svg"],
    inStock: true,
    featured: false,
  },
  // ── TYRES ────────────────────────────────────────────────
  {
    id: 20,
    name: "Pirelli Diablo Supercorsa (Pr)",
    category: "parts",
    subcategory: "tyres",
    price: 9800,
    originalPrice: 11500,
    rating: 4.9,
    reviews: 334,
    badge: "Track",
    badgeColor: "#ef4444",
    compatibility: "120/70 ZR17 - 190/55 ZR17",
    material: "Dual-Compound Rubber",
    warranty: "N/A",
    description: "Race-compound Pirelli Diablo Supercorsa SP. Maximum grip at the limit, race-inspired tread pattern.",
    images: ["part-tyre.svg"],
    inStock: true,
    featured: true,
  },
];

// Admin Synchronization
const storefrontDb = localStorage.getItem('jrk_storefront');
if (storefrontDb) {
   try {
       PRODUCTS = JSON.parse(storefrontDb);
   } catch(e) { console.error("Could not sync with admin DB", e); }
}

// Helper functions
function getProductById(id) {
  return PRODUCTS.find(p => p.id === id);
}

function getProductsByCategory(cat) {
  if (cat === "all") return PRODUCTS;
  if (cat === "parts") return PRODUCTS; // All our products are parts now
  return PRODUCTS.filter(p => p.category === cat);
}

function getFeaturedProducts() {
  return PRODUCTS.filter(p => p.featured);
}

function searchProducts(query) {
  const q = query.toLowerCase();
  return PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.description.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q) ||
    (p.subcategory && p.subcategory.toLowerCase().includes(q))
  );
}

function formatPrice(price) {
  return "₹" + price.toLocaleString("en-IN");
}
