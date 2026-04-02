/* ============================================================
   MIAN ORGANIC FARM — Main JavaScript
   ============================================================ */

// ==================== PRODUCTS DATA ====================
const PRODUCTS = [
  { id:1, name:"Desi Mutton", unit:"per kg", price:2800, cat:"meat", img:"images/mutton.png", badge:"Mutton" },
  { id:2, name:"Fresh Beef", unit:"per kg", price:850, cat:"meat", img:"images/beef.png", badge:"Beef" },
  { id:3, name:"Beef Qeema", unit:"per kg", price:900, cat:"meat", img:"images/qeema.png", badge:"Qeema" },
  { id:4, name:"Mutton Qeema", unit:"per kg", price:3000, cat:"meat", img:"images/qeema.png", badge:"Qeema" },
  { id:5, name:"Desi Chicken (Whole)", unit:"per kg", price:950, cat:"chicken", img:"images/chicken.png", badge:"Chicken" },
  { id:6, name:"Desi Chicken Karahi Cut", unit:"per kg", price:1000, cat:"chicken", img:"images/chicken.png", badge:"Chicken" },
  { id:7, name:"Desi Eggs", unit:"1 dozen (12)", price:350, cat:"eggs", img:"images/eggs.png", badge:"Eggs" },
  { id:8, name:"Desi Eggs Tray", unit:"30 eggs", price:800, cat:"eggs", img:"images/eggs.png", badge:"Eggs" },
  { id:9, name:"Pure Desi Ghee", unit:"1 kg jar", price:2800, cat:"ghee", img:"images/ghee.png", badge:"Ghee" },
  { id:10, name:"Pure Desi Ghee", unit:"500g jar", price:1500, cat:"ghee", img:"images/ghee.png", badge:"Ghee" },
];

// ==================== VACCINATION DATA ====================
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

// ==================== DELIVERY / DISTANCE DATA ====================
// Cities/towns with approximate distance (km) from Khanpur
const CITY_DISTANCES = {
  // Confirmed delivery areas (0-60km)
  "khanpur":0,"khanpur city":0,"khan bela":5,"therhi":8,"feroza":12,
  "nawankot":10,"trinda muhammad panah":15,"jamal din wali":18,
  "naushahra":20,"ahmed pur lamma":22,"kot samaba":25,
  "bhong":30,"chachran sharif":35,"zahir pir":40,
  "rahim yar khan":45,"sadiqabad":50,"liaquatpur":55,
  "muhammad pur":48,"daharki":60,"ubaro":58,
  // Nearby towns (60-100km) — still deliverable
  "khanpur mahar":65,"guddu":70,"ghotki":75,"sukkur":90,
  "ahmed pur east":80,"bahawalpur":95,"yazman":85,
  "lodhran":92,"hasilpur":88,"khairpur":98,"kandhkot":85,
  "kashmore":95,"jacobabad":100,"pano aqil":80,"mirpur mathelo":72,
  "rohri":92,"shikarpur":100,"larkana":110,"sobhodero":95,
  // Medium distance (100-200km)
  "multan":180,"hyderabad":350,"sukkur barrage":90,
  "dera ghazi khan":200,"rajanpur":150,"muzaffargarh":170,
  "bahawalnagar":140,"vehari":160,"khanewal":190,
  "sahiwal":250,"okara":300,"pakpattan":220,
  // Far cities (200+km)
  "lahore":550,"islamabad":750,"karachi":650,"faisalabad":400,
  "rawalpindi":760,"peshawar":900,"quetta":600,
  "sialkot":600,"gujranwala":530,"gujrat":560,
  "sargodha":380,"jhang":320,"toba tek singh":350,
  "nawabshah":280,"mirpurkhas":400,"thatta":550,
  "abbottabad":800,"mardan":870,"swat":950,
};

const MAX_DELIVERY_KM = 100; // max delivery radius

// ==================== CART STATE ====================
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
  showToast(`${product.name} added to cart!`);
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

// ==================== TOAST NOTIFICATION ====================
function showToast(msg) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.style.cssText = 'position:fixed;bottom:100px;right:28px;background:#1a1a2e;color:#fff;padding:14px 28px;border-radius:100px;font-size:.9rem;font-weight:600;z-index:9999;opacity:0;transform:translateY(20px);transition:all .3s;box-shadow:0 8px 30px rgba(0,0,0,.2);font-family:Inter,sans-serif;';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.opacity = '1';
  toast.style.transform = 'translateY(0)';
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
  }, 2500);
}

// ==================== RENDER PRODUCTS ====================
function renderProducts(filter = 'all') {
  const grid = document.getElementById('shopGrid');
  if (!grid) return;
  const filtered = filter === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.cat === filter);
  grid.innerHTML = filtered.map(p => `
    <div class="product-card" data-category="${p.cat}">
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
          <button class="add-cart-btn" onclick="addFromCard(${p.id})">🛒 Add to Cart</button>
        </div>
      </div>
    </div>
  `).join('');
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

// ==================== CART UI ====================
function updateCartUI() {
  const countEl = document.getElementById('cartCount');
  const body = document.getElementById('cartDrawerBody');
  const emptyEl = document.getElementById('cartEmpty');
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
      <button class="cart-item-remove" onclick="removeFromCart(${item.id})">🗑️</button>
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

// ==================== CART DRAWER TOGGLE ====================
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

// ==================== INIT ====================
document.addEventListener('DOMContentLoaded', () => {
  // Render products
  renderProducts();
  updateCartUI();

  // Nav toggle
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  navToggle?.addEventListener('click', () => {
    navToggle.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  // Close mobile nav on link click
  navLinks?.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navToggle?.classList.remove('open');
      navLinks?.classList.remove('open');
    });
  });

  // Navbar scroll
  window.addEventListener('scroll', () => {
    document.getElementById('navbar')?.classList.toggle('scrolled', window.scrollY > 50);
  });

  // Shop filters
  document.getElementById('shopFilters')?.addEventListener('click', e => {
    if (!e.target.classList.contains('filter-tab')) return;
    document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
    e.target.classList.add('active');
    renderProducts(e.target.dataset.filter);
  });

  // Cart buttons
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
    if (cart.length === 0) { showToast('Cart is empty!'); return; }
    closeCart();
    const modal = document.getElementById('checkoutModal');
    if (modal) { modal.classList.add('open'); }
    // Build summary
    const summary = document.getElementById('checkoutSummary');
    if (summary) {
      const payType = document.querySelector('input[name="payType"]:checked')?.value;
      let html = '<strong>Order Summary:</strong><br>';
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

  // Checkout form — send via WhatsApp
  document.getElementById('checkoutForm')?.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('coName')?.value;
    const phone = document.getElementById('coPhone')?.value;
    const area = document.getElementById('coArea')?.value;
    const customAddr = document.getElementById('coCustomAddr')?.value;
    const notes = document.getElementById('coNotes')?.value;
    if (!name || !phone || !area) { showToast('Please fill all required fields'); return; }

    let msg = `🌿 *New Order — Mian Organic Farm*\n\n`;
    msg += `👤 *Name:* ${name}\n📞 *Phone:* ${phone}\n`;
    msg += `📍 *Area:* ${area === 'custom' ? customAddr : area}\n`;
    if (notes) msg += `📝 *Notes:* ${notes}\n`;
    msg += `\n🛒 *Order Items:*\n`;
    cart.forEach(item => { msg += `• ${item.name} × ${item.qty} = PKR ${(item.price*item.qty).toLocaleString()}\n`; });
    msg += `\n💰 *Total: PKR ${getCartTotal().toLocaleString()}*`;

    const payType = document.querySelector('input[name="payType"]:checked')?.value;
    if (payType === 'instalment') {
      const months = parseInt(document.getElementById('instalmentPlan')?.value || 3);
      msg += `\n📋 *Payment: Instalment Plan (${months} months)*`;
    }

    const encoded = encodeURIComponent(msg);
    window.open(`https://wa.me/923052619414?text=${encoded}`, '_blank');
    cart = []; saveCart();
    document.getElementById('checkoutModal')?.classList.remove('open');
    showToast('Order sent via WhatsApp! ✅');
  });

  // Delivery zone check — distance-based
  function checkDelivery(areaName) {
    const result = document.getElementById('deliveryResult');
    if (!result) return;
    const input = areaName.trim().toLowerCase();
    if (!input) { result.style.display = 'none'; return; }

    // Find best match from city database
    let bestMatch = null;
    let bestDist = null;
    for (const [city, dist] of Object.entries(CITY_DISTANCES)) {
      if (input.includes(city) || city.includes(input)) {
        if (bestDist === null || dist < bestDist) {
          bestMatch = city;
          bestDist = dist;
        }
      }
    }

    // Also try partial word matching for better UX
    if (bestMatch === null) {
      const words = input.split(/[\s,]+/).filter(w => w.length > 2);
      for (const word of words) {
        for (const [city, dist] of Object.entries(CITY_DISTANCES)) {
          if (city.includes(word) || word.includes(city.split(' ')[0])) {
            if (bestDist === null || dist < bestDist) {
              bestMatch = city;
              bestDist = dist;
            }
          }
        }
      }
    }

    if (bestMatch !== null && bestDist <= MAX_DELIVERY_KM) {
      result.className = 'delivery-result success';
      result.innerHTML = `✅ <strong>Great news!</strong> We deliver to <strong>${bestMatch.replace(/\b\w/g, c => c.toUpperCase())}</strong>. Start shopping!`;
    } else if (bestMatch !== null && bestDist > MAX_DELIVERY_KM) {
      result.className = 'delivery-result fail';
      result.innerHTML = `❌ <strong>${bestMatch.replace(/\b\w/g, c => c.toUpperCase())}</strong> is not available for delivery. Please select an area within Khanpur region.<br>Or contact us on <a href="https://wa.me/923052619414" target="_blank" style="color:#25D366;font-weight:600;">WhatsApp</a> for special arrangement.`;
    } else {
      result.className = 'delivery-result fail';
      result.innerHTML = `❌ "<strong>${areaName}</strong>" is not available for delivery. Please select an area within Khanpur region.<br>Or contact us on <a href="https://wa.me/923052619414" target="_blank" style="color:#25D366;font-weight:600;">WhatsApp</a> to check!`;
    }
  }

  // Custom address button
  document.getElementById('checkAddressBtn')?.addEventListener('click', () => {
    const val = document.getElementById('customAddress')?.value;
    if (val) checkDelivery(val);
  });
  // Enter key on input
  document.getElementById('customAddress')?.addEventListener('keypress', e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const val = document.getElementById('customAddress')?.value;
      if (val) checkDelivery(val);
    }
  });

  // Delivery tag buttons — clickable
  document.querySelectorAll('.delivery-tag').forEach(tag => {
    tag.style.cursor = 'pointer';
    tag.addEventListener('click', () => {
      // Visual feedback
      document.querySelectorAll('.delivery-tag').forEach(t => t.classList.remove('active'));
      tag.classList.add('active');
      // Check delivery
      checkDelivery(tag.textContent);
    });
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
      results.innerHTML = `<div class="vacc-not-found"><span style="font-size:3rem;display:block;margin-bottom:12px;">🔍</span><p>No records found for "${input}"</p><p style="font-size:.85rem;margin-top:8px;">Try: MOF-001, MOF-002, or MOF-003</p></div>`;
      return;
    }
    let html = `<div class="vacc-card">
      <h3>🐄 ${record.name}</h3>
      <div class="vacc-meta">Breed: ${record.breed} | Age: ${record.age} | Tag: ${input}</div>
      <div class="vacc-timeline">`;
    record.records.forEach(r => {
      html += `<div class="vacc-timeline-item"><strong>${r.vaccine}</strong><span>${r.date} — by ${r.vet}</span></div>`;
    });
    html += '</div></div>';
    results.innerHTML = html;
  }

  // Booking form
  document.getElementById('bookingForm')?.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('bookName')?.value;
    const phone = document.getElementById('bookPhone')?.value;
    if (!name || !phone) { showToast('Please fill name & phone'); return; }
    document.getElementById('bookingSuccess')?.classList.add('show');
    e.target.style.display = 'none';
    // Send booking via WhatsApp
    const product = document.getElementById('bookProduct')?.value || 'Not specified';
    const date = document.getElementById('bookDate')?.value || 'Not specified';
    const notes = document.getElementById('bookNotes')?.value || '';
    let msg = `📋 *Advance Booking — Mian Organic Farm*\n\n👤 ${name}\n📞 ${phone}\n📦 ${product}\n📅 ${date}`;
    if (notes) msg += `\n📝 ${notes}`;
    window.open(`https://wa.me/923052619414?text=${encodeURIComponent(msg)}`, '_blank');
  });

  // Contact form
  document.getElementById('contactForm')?.addEventListener('submit', e => {
    e.preventDefault();
    document.getElementById('formSuccess')?.classList.add('show');
    e.target.style.display = 'none';
  });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });
});
