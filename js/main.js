/* ============================================================
   MIAN ORGANIC FARM — Premium D2C/SaaS JavaScript
   ============================================================ */

// ── PRODUCTS DATA ──
const PRODUCTS = [
  { id:1, name:"Desi Mutton",          unit:"per kg",        price:2800, cat:"meat",    img:"images/mutton.png",  badge:"Premium" },
  { id:2, name:"Fresh Beef",           unit:"per kg",        price:850,  cat:"meat",    img:"images/beef.png",    badge:"Beef" },
  { id:3, name:"Beef Qeema",           unit:"per kg",        price:900,  cat:"meat",    img:"images/qeema.png",   badge:"Qeema" },
  { id:4, name:"Mutton Qeema",         unit:"per kg",        price:3000, cat:"meat",    img:"images/qeema.png",   badge:"Premium" },
  { id:5, name:"Desi Chicken",         unit:"whole / per kg", price:950, cat:"chicken", img:"images/chicken.png", badge:"Chicken" },
  { id:6, name:"Chicken Karahi Cut",   unit:"per kg",        price:1000, cat:"chicken", img:"images/chicken.png", badge:"Karahi" },
  { id:7, name:"Desi Eggs",            unit:"1 dozen (12)",  price:350,  cat:"eggs",    img:"images/eggs.png",    badge:"Eggs" },
  { id:8, name:"Desi Eggs Tray",       unit:"30 eggs",       price:800,  cat:"eggs",    img:"images/eggs.png",    badge:"Value" },
  { id:9, name:"Pure Desi Ghee",       unit:"1 kg jar",      price:2800, cat:"ghee",    img:"images/ghee.png",    badge:"Ghee" },
  { id:10,name:"Pure Desi Ghee",       unit:"500g jar",      price:1500, cat:"ghee",    img:"images/ghee.png",    badge:"Ghee" },
];

// ── VACCINATION DATA ──
const VACC_DATA = {
  "MOF-001": { name:"Sahiwal Bull #1", breed:"Sahiwal", age:"3 years", records:[
    {date:"2025-12-15",vaccine:"FMD (Foot & Mouth)",vet:"Dr. Ahmed"},
    {date:"2025-09-10",vaccine:"Hemorrhagic Septicemia",vet:"Dr. Ahmed"},
    {date:"2025-06-20",vaccine:"Black Quarter (BQ)",vet:"Dr. Bilal"},
    {date:"2025-03-01",vaccine:"Anthrax Vaccine",vet:"Dr. Ahmed"},
  ]},
  "MOF-002": { name:"Beetal Goat #5", breed:"Beetal", age:"1.5 years", records:[
    {date:"2025-11-20",vaccine:"PPR Vaccine",vet:"Dr. Bilal"},
    {date:"2025-08-15",vaccine:"Enterotoxemia",vet:"Dr. Ahmed"},
    {date:"2025-05-10",vaccine:"Goat Pox",vet:"Dr. Bilal"},
  ]},
  "MOF-003": { name:"Desi Cow #12", breed:"Desi/Local", age:"4 years", records:[
    {date:"2026-01-10",vaccine:"Brucellosis",vet:"Dr. Ahmed"},
    {date:"2025-10-05",vaccine:"FMD Booster",vet:"Dr. Bilal"},
    {date:"2025-07-22",vaccine:"Hemorrhagic Septicemia",vet:"Dr. Ahmed"},
  ]},
};

// ── CART STATE ──
let cart = JSON.parse(localStorage.getItem('mof_cart') || '[]');

function saveCart() {
  localStorage.setItem('mof_cart', JSON.stringify(cart));
  updateCartUI();
}

function addToCart(productId, qty) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;
  const existing = cart.find(c => c.id === productId);
  if (existing) { existing.qty += qty; }
  else { cart.push({ ...product, qty }); }
  saveCart();
  bounceCartBadge();
  showToast(`${product.name} added to cart`);
}

function bounceCartBadge() {
  const badge = document.getElementById('cartCount');
  if (!badge) return;
  badge.classList.remove('bounce');
  void badge.offsetWidth; // trigger reflow
  badge.classList.add('bounce');
  setTimeout(() => badge.classList.remove('bounce'), 600);
}

function removeFromCart(productId) {
  cart = cart.filter(c => c.id !== productId);
  saveCart();
}

function updateCartQty(productId, delta) {
  const item = cart.find(c => c.id === productId);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) { removeFromCart(productId); return; }
  saveCart();
}

function getCartTotal() {
  return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}

// ── TOAST ──
function showToast(msg) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    Object.assign(toast.style, {
      position: 'fixed', bottom: '100px', right: '28px',
      background: '#0A0C10', color: '#fff',
      padding: '14px 28px', borderRadius: '12px',
      fontSize: '.88rem', fontWeight: '500',
      zIndex: '9999', opacity: '0',
      transform: 'translateY(12px)',
      transition: 'all .3s cubic-bezier(.4,0,.2,1)',
      boxShadow: '0 8px 32px rgba(0,0,0,.2)',
      fontFamily: 'Inter, sans-serif',
      border: '1px solid rgba(255,255,255,.08)',
    });
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.opacity = '1';
  toast.style.transform = 'translateY(0)';
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(12px)';
  }, 2500);
}

// ── RENDER PRODUCTS (BENTO GRID) ──
function showSkeletons() {
  const grid = document.getElementById('shopGrid');
  if (!grid) return;
  grid.innerHTML = Array.from({length: 6}, (_, i) => `
    <div class="product-card skeleton-card${i === 0 ? ' bento-featured' : ''}">
      <div class="skeleton-img"></div>
      <div class="skeleton skeleton-text"></div>
      <div class="skeleton skeleton-text-sm"></div>
      <div class="skeleton skeleton-price"></div>
    </div>
  `).join('');
}

function renderProducts(filter = 'all') {
  const grid = document.getElementById('shopGrid');
  if (!grid) return;
  const filtered = filter === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.cat === filter);
  grid.innerHTML = filtered.map((p, i) => `
    <div class="product-card reveal${i < 4 ? ` reveal-delay-${i}` : ''}" data-category="${p.cat}">
      <div class="product-img-wrap">
        <img src="${p.img}" alt="${p.name}" loading="lazy" />
        <span class="product-badge">${p.badge}</span>
      </div>
      <div class="product-body">
        <h3 class="product-name">${p.name}</h3>
        <div class="product-unit">${p.unit}</div>
        <div class="product-price">PKR ${p.price.toLocaleString()}</div>
        <div class="product-actions">
          <div class="qty-control">
            <button class="qty-btn" onclick="changeQty(${p.id},-1)">−</button>
            <input class="qty-val" id="qty-${p.id}" value="1" readonly />
            <button class="qty-btn" onclick="changeQty(${p.id},1)">+</button>
          </div>
          <button class="add-cart-btn" onclick="addFromCard(${p.id})">Add to Cart</button>
        </div>
      </div>
    </div>
  `).join('');

  // Re-observe new cards
  observeReveals();
}

function changeQty(id, delta) {
  const input = document.getElementById(`qty-${id}`);
  if (!input) return;
  let val = parseInt(input.value) + delta;
  if (val < 1) val = 1;
  if (val > 50) val = 50;
  input.value = val;
}

function addFromCard(id) {
  const input = document.getElementById(`qty-${id}`);
  const qty = parseInt(input.value) || 1;
  addToCart(id, qty);
  input.value = 1;
}

// ── CART UI ──
function updateCartUI() {
  const countEl = document.getElementById('cartCount');
  const body = document.getElementById('cartDrawerBody');
  const totalEl = document.getElementById('cartTotal');
  const footer = document.getElementById('cartDrawerFooter');

  const totalItems = cart.reduce((s, i) => s + i.qty, 0);
  if (countEl) countEl.textContent = totalItems;

  if (!body) return;
  if (cart.length === 0) {
    body.innerHTML = '<div class="cart-empty"><span>🛒</span><p>Your cart is empty</p></div>';
    if (footer) footer.style.display = 'none';
    return;
  }
  if (footer) footer.style.display = 'block';

  body.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img class="cart-item-img" src="${item.img}" alt="${item.name}" />
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">PKR ${(item.price * item.qty).toLocaleString()}</div>
      </div>
      <div class="cart-item-qty">
        <button onclick="updateCartQty(${item.id},-1)">−</button>
        <span>${item.qty}</span>
        <button onclick="updateCartQty(${item.id},1)">+</button>
      </div>
      <button class="cart-item-remove" onclick="removeFromCart(${item.id})" aria-label="Remove">✕</button>
    </div>
  `).join('');

  if (totalEl) totalEl.textContent = 'PKR ' + getCartTotal().toLocaleString();
  updateInstalmentInfo();
}

function updateInstalmentInfo() {
  const plan = document.getElementById('instalmentPlan');
  const breakdown = document.getElementById('instalmentBreakdown');
  if (!plan || !breakdown) return;
  const total = getCartTotal();
  const months = parseInt(plan.value);
  const advance = months === 3 ? 0.25 : 0.20;
  const advanceAmt = Math.ceil(total * advance);
  const remaining = total - advanceAmt;
  const monthly = Math.ceil(remaining / months);
  breakdown.innerHTML = `
    <strong>Total:</strong> PKR ${total.toLocaleString()}<br>
    <strong>Advance (${advance*100}%):</strong> PKR ${advanceAmt.toLocaleString()}<br>
    <strong>Monthly (${months} months):</strong> PKR ${monthly.toLocaleString()}/month
  `;
}

// ── CART DRAWER ──
function openCart() {
  document.getElementById('cartDrawer')?.classList.add('open');
  document.getElementById('cartOverlay')?.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeCart() {
  document.getElementById('cartDrawer')?.classList.remove('open');
  document.getElementById('cartOverlay')?.classList.remove('open');
  document.body.style.overflow = '';
}

// ── SCROLL REVEAL (IntersectionObserver) ──
function observeReveals() {
  const reveals = document.querySelectorAll('.reveal:not(.visible)');
  if (!reveals.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  reveals.forEach(el => observer.observe(el));
}

// ── BOOKING STEPPER ──
let currentStep = 1;
const TOTAL_STEPS = 3;

function goToStep(step) {
  if (step < 1 || step > TOTAL_STEPS) return;

  // Pakistan phone number validation helper
  function isValidPKPhone(phone) {
    const cleaned = phone.replace(/[\s\-()]/g, '');
    return /^(03[0-9]{9}|\+?92[0-9]{10})$/.test(cleaned);
  }

  // Validate before moving forward
  if (step > currentStep) {
    if (currentStep === 1) {
      const product = document.getElementById('bookProduct')?.value;
      const date = document.getElementById('bookDate')?.value;
      if (!product) { showToast('Please select a product'); return; }
      if (!date) { showToast('Please select a delivery date'); return; }
    }
    if (currentStep === 2) {
      const name = document.getElementById('bookName')?.value?.trim();
      const phone = document.getElementById('bookPhone')?.value?.trim();
      const location = document.getElementById('bookLocation')?.value;
      const customLoc = document.getElementById('bookCustomLocation')?.value?.trim();
      const phoneError = document.getElementById('phoneError');

      if (!name) { showToast('Please enter your name'); return; }
      if (!phone) { showToast('Please enter your phone number'); return; }
      if (!isValidPKPhone(phone)) {
        if (phoneError) phoneError.style.display = 'block';
        showToast('Invalid phone number format');
        return;
      }
      if (phoneError) phoneError.style.display = 'none';
      if (!location) { showToast('Please select a delivery location'); return; }
      if (location === 'other' && !customLoc) { showToast('Please enter your area/address'); return; }
    }
  }

  currentStep = step;

  // Update step content visibility
  document.querySelectorAll('.step-content').forEach(el => el.classList.remove('active'));
  document.getElementById(`step${step}`)?.classList.add('active');

  // Update stepper indicators
  document.querySelectorAll('.step').forEach(el => {
    const s = parseInt(el.dataset.step);
    el.classList.remove('active', 'completed');
    if (s === step) el.classList.add('active');
    else if (s < step) el.classList.add('completed');
  });

  // Update progress bar
  const progress = document.getElementById('stepperProgress');
  if (progress) {
    const pct = ((step - 1) / (TOTAL_STEPS - 1)) * 100;
    progress.style.width = `${pct}%`;
  }

  // Build summary for step 3
  if (step === 3) {
    const summary = document.getElementById('bookingSummary');
    if (summary) {
      const product = document.getElementById('bookProduct')?.value || '\u2014';
      const date = document.getElementById('bookDate')?.value || 'Not specified';
      const name = document.getElementById('bookName')?.value || '\u2014';
      const phone = document.getElementById('bookPhone')?.value || '\u2014';
      const locVal = document.getElementById('bookLocation')?.value || '';
      const customLoc = document.getElementById('bookCustomLocation')?.value || '';
      const location = locVal === 'other' ? customLoc : locVal;
      const notes = document.getElementById('bookNotes')?.value || 'None';
      summary.innerHTML = `
        <strong>Booking Summary</strong><br><br>
        <strong>Product:</strong> ${product}<br>
        <strong>Date:</strong> ${date}<br>
        <strong>Name:</strong> ${name}<br>
        <strong>Phone:</strong> ${phone}<br>
        <strong>Location:</strong> ${location}<br>
        <strong>Notes:</strong> ${notes}<br>
        <br>
        <strong style="color:var(--gold);">20% Advance payment required to confirm.</strong>
      `;
    }
  }
}

// ── INIT ──
document.addEventListener('DOMContentLoaded', () => {
  // Hero blur-up progressive loading
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg) {
    heroBg.classList.add('loading');
    const heroImg = new Image();
    heroImg.onload = () => {
      heroBg.classList.remove('loading');
    };
    heroImg.src = 'images/hero-new.png';
  }

  // Show skeletons then render products
  showSkeletons();
  setTimeout(() => {
    renderProducts();
  }, 600);
  updateCartUI();

  // Nav toggle (mobile)
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  navToggle?.addEventListener('click', () => {
    navToggle.classList.toggle('open');
    navLinks.classList.toggle('open');
  });
  navLinks?.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navToggle?.classList.remove('open');
      navLinks?.classList.remove('open');
    });
  });

  // Navbar scroll effect + sticky mobile bar
  const shopSection = document.getElementById('shop');
  const stickyBar = document.getElementById('stickyCartBar');
  window.addEventListener('scroll', () => {
    document.getElementById('navbar')?.classList.toggle('scrolled', window.scrollY > 50);
    // Sticky mobile cart bar
    if (stickyBar && shopSection && window.innerWidth <= 768) {
      const shopBottom = shopSection.getBoundingClientRect().bottom;
      const hasItems = cart.length > 0;
      if (shopBottom < 0 && hasItems) {
        stickyBar.classList.add('visible');
      } else {
        stickyBar.classList.remove('visible');
      }
    }
  });

  // Shop filters
  document.getElementById('shopFilters')?.addEventListener('click', e => {
    if (!e.target.classList.contains('filter-btn')) return;
    document.querySelectorAll('.filter-btn').forEach(t => t.classList.remove('active'));
    e.target.classList.add('active');
    renderProducts(e.target.dataset.filter);
  });

  // Cart controls
  document.getElementById('navCartBtn')?.addEventListener('click', openCart);
  document.getElementById('cartClose')?.addEventListener('click', closeCart);
  document.getElementById('cartOverlay')?.addEventListener('click', closeCart);

  // Payment toggle
  document.querySelectorAll('input[name="payType"]').forEach(radio => {
    radio.addEventListener('change', () => {
      const info = document.getElementById('instalmentInfo');
      if (info) info.style.display = radio.value === 'instalment' ? 'block' : 'none';
    });
  });

  // Instalment plan change
  document.getElementById('instalmentPlan')?.addEventListener('change', updateInstalmentInfo);

  // Checkout button
  document.getElementById('checkoutBtn')?.addEventListener('click', () => {
    if (cart.length === 0) { showToast('Cart is empty'); return; }
    closeCart();
    const modal = document.getElementById('checkoutModal');
    if (modal) modal.classList.add('open');
    const summary = document.getElementById('checkoutSummary');
    if (summary) {
      const payType = document.querySelector('input[name="payType"]:checked')?.value;
      let html = '<strong>Order Summary</strong><br><br>';
      cart.forEach(item => {
        html += `${item.name} × ${item.qty} = PKR ${(item.price*item.qty).toLocaleString()}<br>`;
      });
      html += `<br><strong>Total: PKR ${getCartTotal().toLocaleString()}</strong>`;
      if (payType === 'instalment') {
        const months = parseInt(document.getElementById('instalmentPlan')?.value || 3);
        const advance = months === 3 ? 0.25 : 0.20;
        html += `<br><strong>Payment: Instalment (${months} months, ${advance*100}% advance)</strong>`;
      }
      summary.innerHTML = html;
    }
  });
  document.getElementById('checkoutClose')?.addEventListener('click', () => {
    document.getElementById('checkoutModal')?.classList.remove('open');
  });

  // Custom address in checkout
  document.getElementById('coArea')?.addEventListener('change', function() {
    const custom = document.getElementById('coCustomAddrGroup');
    if (custom) custom.style.display = this.value === 'custom' ? 'block' : 'none';
  });

  // Checkout phone — clear error on input
  document.getElementById('coPhone')?.addEventListener('input', () => {
    const err = document.getElementById('coPhoneError');
    if (err) err.style.display = 'none';
  });

  // Checkout form — send via WhatsApp
  document.getElementById('checkoutForm')?.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('coName')?.value?.trim();
    const phone = document.getElementById('coPhone')?.value?.trim();
    const area = document.getElementById('coArea')?.value;
    const customAddr = document.getElementById('coCustomAddr')?.value?.trim();
    const notes = document.getElementById('coNotes')?.value;
    const coPhoneError = document.getElementById('coPhoneError');

    // PK phone validation (same as booking)
    function isValidPKPhone(ph) {
      const cleaned = ph.replace(/[\s\-()]/g, '');
      return /^(03[0-9]{9}|\+?92[0-9]{10})$/.test(cleaned);
    }

    if (!name) { showToast('Please enter your name'); return; }
    if (!phone) { showToast('Please enter your phone number'); return; }
    if (!isValidPKPhone(phone)) {
      if (coPhoneError) coPhoneError.style.display = 'block';
      showToast('Invalid phone number format');
      return;
    }
    if (coPhoneError) coPhoneError.style.display = 'none';
    if (!area) { showToast('Please select a delivery area'); return; }
    if (area === 'custom' && !customAddr) { showToast('Please enter your full address'); return; }

    const total = getCartTotal();
    let msg = '\u{1F33F} *New Order \u2014 Mian Organic Farm*\n\n';
    msg += '\u{1F464} *Name:* ' + name + '\n';
    msg += '\u{1F4DE} *Phone:* ' + phone + '\n';
    msg += '\u{1F4CD} *Area:* ' + (area === 'custom' ? customAddr : area) + '\n';
    if (notes) msg += '\u{1F4DD} *Notes:* ' + notes + '\n';
    msg += '\n\u{1F6D2} *Order Items:*\n';
    cart.forEach(item => {
      msg += '\u2022 ' + item.name + ' \u00D7 ' + item.qty + ' = PKR ' + (item.price * item.qty).toLocaleString() + '\n';
    });
    msg += '\n\u{1F4B0} *Total: PKR ' + total.toLocaleString() + '*';

    // Priority Delivery for orders over PKR 5,000
    if (total > 5000) {
      msg += '\n\n\u2B50 *Note: This order qualifies for Priority Delivery.*';
    }

    const payType = document.querySelector('input[name="payType"]:checked')?.value;
    if (payType === 'instalment') {
      const months = parseInt(document.getElementById('instalmentPlan')?.value || 3);
      msg += '\n\u{1F4CB} *Payment: Instalment Plan (' + months + ' months)*';
    }

    const encoded = encodeURIComponent(msg);
    window.open('https://wa.me/923052619414?text=' + encoded, '_blank');
    cart = []; saveCart();
    document.getElementById('checkoutModal')?.classList.remove('open');
    showToast('Order sent via WhatsApp! \u2705');
  });

  // ── BOOKING STEPPER CONTROLS ──
  document.getElementById('stepNext1')?.addEventListener('click', () => goToStep(2));
  document.getElementById('stepBack2')?.addEventListener('click', () => goToStep(1));
  document.getElementById('stepNext2')?.addEventListener('click', () => goToStep(3));
  document.getElementById('stepBack3')?.addEventListener('click', () => goToStep(2));

  // Location dropdown toggle for custom area
  document.getElementById('bookLocation')?.addEventListener('change', function() {
    const customGroup = document.getElementById('bookCustomLocationGroup');
    if (customGroup) customGroup.style.display = this.value === 'other' ? 'block' : 'none';
  });

  // Phone field — clear error on input
  document.getElementById('bookPhone')?.addEventListener('input', () => {
    const phoneError = document.getElementById('phoneError');
    if (phoneError) phoneError.style.display = 'none';
  });

  // Booking form submit — auto-redirect to WhatsApp
  document.getElementById('bookingForm')?.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('bookName')?.value;
    const phone = document.getElementById('bookPhone')?.value;
    if (!name || !phone) { showToast('Please fill name & phone'); return; }

    const product = document.getElementById('bookProduct')?.value || 'Not specified';
    const date = document.getElementById('bookDate')?.value || 'Not specified';
    const locVal = document.getElementById('bookLocation')?.value || '';
    const customLoc = document.getElementById('bookCustomLocation')?.value || '';
    const location = locVal === 'other' ? customLoc : locVal;
    const notes = document.getElementById('bookNotes')?.value || '';

    // Find matching product price for advance calculation
    const matchedProduct = PRODUCTS.find(p => product.toLowerCase().includes(p.name.toLowerCase().split(' ')[0]));
    const estimatedPrice = matchedProduct ? matchedProduct.price : 0;
    const advanceAmount = Math.ceil(estimatedPrice * 0.20);

    // Build formatted WhatsApp message (Unicode-safe)
    let waMsg = 'Asalam-o-Alaikum! I\u0027d like to confirm my booking.\n\n';
    waMsg += '\u{1F4E6} *Product:* ' + product + '\n';
    waMsg += '\u{1F4C5} *Date:* ' + date + '\n';
    waMsg += '\u{1F464} *Name:* ' + name + '\n';
    waMsg += '\u{1F4DE} *Phone:* ' + phone + '\n';
    waMsg += '\u{1F4CD} *Location:* ' + location + '\n';
    if (notes) waMsg += '\u{1F4DD} *Notes:* ' + notes + '\n';
    if (advanceAmount > 0) {
      waMsg += '\n\u{1F4B0} *20% Advance Amount: PKR ' + advanceAmount.toLocaleString() + '*\n';
    }
    if (estimatedPrice > 5000) {
      waMsg += '\n\u2B50 *Note: This order qualifies for Priority Delivery.*\n';
    }
    waMsg += '\n\u2014 Mian Organic Farm Advance Booking';

    // Hide the form/stepper and show success text
    document.getElementById('bookingForm').style.display = 'none';
    document.querySelector('.stepper').style.display = 'none';
    document.getElementById('bookingSuccess')?.classList.add('show');

    // Auto-redirect to WhatsApp immediately
    window.open('https://wa.me/923052619414?text=' + encodeURIComponent(waMsg), '_blank');
  });

  // Success modal dismiss
  document.getElementById('successDismiss')?.addEventListener('click', () => {
    document.getElementById('bookingSuccessOverlay')?.classList.remove('open');
    document.body.style.overflow = '';
  });

  // Contact form
  document.getElementById('contactForm')?.addEventListener('submit', e => {
    e.preventDefault();
    document.getElementById('formSuccess')?.classList.add('show');
    e.target.style.display = 'none';
  });

  // Vaccination search
  document.getElementById('vaccSearchBtn')?.addEventListener('click', searchVaccination);
  document.getElementById('vaccSearchInput')?.addEventListener('keypress', e => {
    if (e.key === 'Enter') searchVaccination();
  });

  function searchVaccination() {
    const input = document.getElementById('vaccSearchInput')?.value.trim().toUpperCase();
    const results = document.getElementById('vaccResults');
    if (!results || !input) return;
    const record = VACC_DATA[input];
    if (!record) {
      results.innerHTML = `<div class="vacc-not-found"><p style="font-size:1.5rem;margin-bottom:8px;opacity:.4;">🔍</p><p>No records found for "${input}"</p><p style="font-size:.82rem;margin-top:8px;color:var(--text-muted);">Try: MOF-001, MOF-002, or MOF-003</p></div>`;
      return;
    }
    const now = new Date();
    const timestamp = now.toLocaleDateString('en-PK', { year:'numeric', month:'long', day:'numeric' }) + ' at ' + now.toLocaleTimeString('en-PK', { hour:'2-digit', minute:'2-digit' });
    let html = `<div class="vacc-card verified">
      <div class="vacc-verified-badge"><svg viewBox="0 0 24 24"><polyline points="6 12 10 16 18 8"/></svg> Verified Record</div>
      <h3>${record.name}</h3>
      <div class="vacc-meta">Breed: ${record.breed} · Age: ${record.age} · Tag: ${input}</div>
      <div class="vacc-timeline">`;
    record.records.forEach(r => {
      html += `<div class="vacc-timeline-item"><strong>${r.vaccine}</strong><span>${r.date} — ${r.vet}</span></div>`;
    });
    html += `</div>
      <div class="vacc-timestamp">Last Checked: <strong>${timestamp}</strong></div>
    </div>`;
    results.innerHTML = html;
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });

  // Scroll reveal
  observeReveals();

  // Restrict booking date: tomorrow to next 7 days only
  const bookDate = document.getElementById('bookDate');
  if (bookDate) {
    const today = new Date();
    // Min = tomorrow
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    // Max = 7 days from today
    const maxDate = new Date(today);
    maxDate.setDate(today.getDate() + 7);
    bookDate.setAttribute('min', tomorrow.toISOString().split('T')[0]);
    bookDate.setAttribute('max', maxDate.toISOString().split('T')[0]);
  }

  // Update sticky bar on cart changes
  function updateStickyBar() {
    const stickyText = document.getElementById('stickyCartText');
    const stickyTotal = document.getElementById('stickyCartTotal');
    if (stickyText) {
      const count = cart.reduce((s, i) => s + i.qty, 0);
      stickyText.textContent = `🛒 ${count} item${count !== 1 ? 's' : ''}`;
    }
    if (stickyTotal) stickyTotal.textContent = 'PKR ' + getCartTotal().toLocaleString();
  }

  // Override saveCart to also update sticky bar
  const originalSaveCart = saveCart;
  window.saveCart = function() {
    localStorage.setItem('mof_cart', JSON.stringify(cart));
    updateCartUI();
    updateStickyBar();
  };
  updateStickyBar();
});
