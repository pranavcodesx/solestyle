/* SoleStyle - vanilla JavaScript single-page store (hash routing) */
(() => {
  'use strict';
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const money = n => '$' + n.toFixed(2);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const U = id => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=900&q=80`;

  /* ---------- Data ----------
     Photos load from Unsplash. If any URL fails, a drawn SVG sneaker shows instead.
     To change a photo, replace the id in `ph` (the part after "photo-" in an Unsplash image URL). */
  const SHOES = [
    { up: '#F5ECDD', ac: '#F26A0F', dk: '#16120F', so: '#F5ECDD', la: '#16120F' },
    { up: '#FFFFFF', ac: '#16120F', dk: '#2A2522', so: '#FFFFFF', la: '#2A2522' },
    { up: '#CDBBA2', ac: '#8C7B66', dk: '#3B3329', so: '#EADCBC', la: '#6E5F4D' },
    { up: '#F6F6F6', ac: '#C8211E', dk: '#16120F', so: '#FFFFFF', la: '#16120F' },
    { up: '#F2F6FA', ac: '#2A6FB8', dk: '#1B2A40', so: '#F2F6FA', la: '#1B2A40' },
    { up: '#E9E4D4', ac: '#3E4A3A', dk: '#16120F', so: '#E9E4D4', la: '#3E4A3A' }
  ];
  const PRODUCTS = [
    { id: 1, name: "Court Classic '07", cat: 'Lifestyle', price: 120, tag: 'Best Seller', rate: 4.8, s: 1, ph: '1491553895911-0055eca6402d',
      d: 'A clean, low-profile court sneaker with a soft leather-feel upper that goes with everything.', f: ['Cushioned insole for all-day comfort', 'Durable rubber cupsole', 'Breathable lining'] },
    { id: 2, name: 'Dune Runner V2', cat: 'Running', price: 220, tag: 'New', rate: 4.7, s: 2, ph: '1549298916-b41d501d3772',
      d: 'A lightweight runner with a responsive midsole, built for long city miles.', f: ['Energy-return midsole', 'Flexible knit-style upper', 'Grippy road outsole'] },
    { id: 3, name: 'Ember Retro High', cat: 'Basketball', price: 180, tag: 'Trending', rate: 4.9, s: 3, ph: '1542291026-7eec264c27ff',
      d: 'A bold high-top with ankle support and a strong grip, made for the court and the street.', f: ['High-top ankle support', 'Cushioned heel unit', 'Multi-surface traction'] },
    { id: 4, name: 'Wave 550', cat: 'Casual', price: 150, tag: 'Popular', rate: 4.6, s: 4, ph: '1460353581641-37baddab0fa2',
      d: 'A retro-inspired everyday sneaker with a chunky sole and a supportive fit.', f: ['Chunky retro midsole', 'Padded collar', 'Everyday comfort fit'] },
    { id: 5, name: 'Blaze High', cat: 'Basketball', price: 190, old: 220, tag: 'Limited', rate: 4.8, s: 0, ph: '1595950653106-6c9ebd614d3a',
      d: 'A limited-run high-top in our signature orange palette. Statement style with real performance.', f: ['Limited colourway', 'Reinforced toe box', 'Responsive cushioning'] },
    { id: 6, name: 'Forest Low', cat: 'Lifestyle', price: 135, tag: 'New', rate: 4.5, s: 5, ph: '1514989940723-e8e51635b782',
      d: 'An earthy low-top with a premium feel. Easy to dress up or down.', f: ['Premium textured upper', 'Soft foam footbed', 'Slim everyday profile'] },
    { id: 7, name: 'Sprint Pro', cat: 'Running', price: 160, old: 200, tag: 'Sale', rate: 4.7, s: 4, ph: '1600185365926-3a2ce3cdb9eb',
      d: 'A fast, light trainer for tempo runs and race days, now at a limited-time price.', f: ['Ultra-light build', 'Breathable mesh', 'Snappy forefoot rocker'] },
    { id: 8, name: 'Night Shift', cat: 'Casual', price: 140, tag: 'Popular', rate: 4.6, s: 1, ph: '1608231387042-66d1773070a5',
      d: 'A dark, understated sneaker that works from the office to the weekend.', f: ['Matte low-key finish', 'Comfort-first cushioning', 'Easy lace-up fit'] }
  ];
  const CATS = ['Running', 'Lifestyle', 'Basketball', 'Casual'];
  const SIZES = [6, 7, 8, 9, 10, 11];
  const HERO = [5, 3, 4, 2];
  const COLORS = {
    1: [['White / Black', '#FFFFFF', '#16120F'], ['Black', '#16120F', '#16120F'], ['Grey', '#9A9A9A', '#9A9A9A']],
    2: [['Sand', '#CDBBA2', '#CDBBA2'], ['Olive', '#6B7048', '#6B7048'], ['Charcoal', '#3B3329', '#3B3329']],
    3: [['Black / Red', '#16120F', '#C8211E'], ['Black', '#16120F', '#16120F'], ['White / Red', '#FFFFFF', '#C8211E']],
    4: [['White / Blue', '#FFFFFF', '#2A6FB8'], ['Navy', '#1B2A40', '#1B2A40'], ['Grey', '#9A9A9A', '#9A9A9A']],
    5: [['Cream / Orange', '#F5ECDD', '#F26A0F'], ['Black / Orange', '#16120F', '#F26A0F'], ['White', '#FFFFFF', '#FFFFFF']],
    6: [['Forest Green', '#3E4A3A', '#3E4A3A'], ['Stone', '#E9E4D4', '#E9E4D4'], ['Black', '#16120F', '#16120F']],
    7: [['Blue / White', '#2A6FB8', '#FFFFFF'], ['Black', '#16120F', '#16120F'], ['Neon Orange', '#FF7A1A', '#FF7A1A']],
    8: [['Black', '#16120F', '#16120F'], ['Graphite', '#4A4540', '#4A4540'], ['Slate', '#7A8591', '#7A8591']]
  };
  const colorsOf = p => COLORS[p.id] || [['Default', '#16120F', '#16120F']];
  const RC = { 1: 93, 2: 61, 3: 128, 4: 74, 5: 47, 6: 38, 7: 55, 8: 69 };
  const pct = p => p.old ? Math.round((1 - p.price / p.old) * 100) : 0;
  const revs = id => ((S.reviews || {})[id]) || [];
  const agg = p => { const r = revs(p.id), b = RC[p.id] || 40, n = b + r.length; return { n, avg: (p.rate * b + r.reduce((s, x) => s + x.rating, 0)) / n }; };

  /* ---------- Fallback artwork (drawn sneaker) ---------- */
  let uid = 0;
  function shoeSVG(c) {
    const g = 'sg' + (++uid), u = 'M44 172C38 132 40 104 54 88c10-11 30-11 50-15 30-6 58-20 76-40 12-13 32-15 46-4l12 22c14 18 44 32 84 48 40 16 70 30 68 72z';
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="20 10 390 200" width="390" height="200"><rect x="20" y="10" width="390" height="200" fill="#FFE9D6"/><defs><linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".5"/><stop offset="1" stop-color="#000" stop-opacity=".14"/></linearGradient></defs><path d="${u}" fill="${c.up}"/><path d="M110 172c26-34 70-52 120-62 40-8 80 6 120 34 20 14 40 20 40 28z" fill="${c.ac}"/><path d="M44 172C38 140 40 116 52 96l28 2-6 74z" fill="${c.ac}"/><path d="M104 73c30-6 58-20 76-40l18 14c-18 26-50 42-88 48z" fill="${c.dk}"/><path d="M150 158c40 2 90-14 140-44-24 38-80 62-140 44z" fill="${c.dk}"/><path d="M184 44l26 16M198 36l28 18M214 30l24 16" stroke="${c.la}" stroke-width="6" stroke-linecap="round" fill="none"/><path d="${u}" fill="url(#${g})"/><rect x="32" y="166" width="364" height="26" rx="13" fill="${c.so}"/><rect x="38" y="186" width="352" height="14" rx="7" fill="${c.dk}"/></svg>`;
  }
  addEventListener('error', e => {
    const t = e.target;
    if (t.tagName === 'IMG' && t.dataset.s && !t.dataset.fb) { t.dataset.fb = 1; t.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(shoeSVG(SHOES[+t.dataset.s])); }
  }, true);
  const img = (p, cls = '', eager) => `<img ${cls ? `class="${cls}" ` : ''}src="${U(p.ph)}" alt="${esc(p.name)} sneaker" width="900" height="900" data-s="${p.s}"${eager ? '' : ' loading="lazy"'}>`;

  /* ---------- State (saved in this browser's localStorage) ---------- */
  const KEY = 'solestyle-store-v2';
  const S = { cart: [], wish: [], users: {}, user: null, orders: [], next: null };
  try { Object.assign(S, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) { /* ignore */ }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* ignore */ } };
  const P = id => PRODUCTS.find(p => p.id === +id);
  const me = () => S.users[S.user];
  const cartCount = () => S.cart.reduce((n, i) => n + i.q, 0);
  const totals = () => { const sub = S.cart.reduce((n, i) => n + P(i.id).price * i.q, 0); const ship = sub === 0 || sub >= 50 ? 0 : 6; return { sub, ship, total: sub + ship }; };
  const hash = async s => { try { const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s)); return [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, '0')).join(''); } catch (e) { return btoa(s); } };
  const main = $('#main');
  let cur = 'home', timer, tt;

  const toast = t => { const el = $('#toast'); el.textContent = t; el.classList.add('show'); clearTimeout(tt); tt = setTimeout(() => el.classList.remove('show'), 2600); };
  const go = h => { if (location.hash === h) render(); else location.hash = h; };
  function hdr() {
    const c = cartCount(), w = S.wish.length, u = me();
    $('#cartCount').textContent = c; $('#cartCount').hidden = !c;
    $('#wishCount').textContent = w; $('#wishCount').hidden = !w;
    $('#cartLink').setAttribute('aria-label', `Shopping bag, ${c} item${c === 1 ? '' : 's'}`);
    $('#wishLink').setAttribute('aria-label', `Wishlist, ${w} item${w === 1 ? '' : 's'}`);
    document.body.classList.toggle('has-user', !!u);
    $('#profileIni').textContent = u ? u.name.trim()[0].toUpperCase() : '';
    $('#profileLink').setAttribute('aria-label', u ? `My account (${u.name})` : 'Log in or open my account');
  }

  /* ---------- Reusable pieces ---------- */
  const heartBtn = (id, extra = '') => { const on = S.wish.includes(id); return `<button class="heart${on ? ' on' : ''}" type="button" data-act="wish" data-id="${id}" aria-pressed="${on}" aria-label="${on ? 'Remove from' : 'Add to'} wishlist${extra}"><svg width="20" height="20" viewBox="0 0 24 24" stroke-linejoin="round" aria-hidden="true"><path d="M12 20.5S3.5 15 3.5 8.9A4.4 4.4 0 0 1 12 7a4.4 4.4 0 0 1 8.5 1.9C20.5 15 12 20.5 12 20.5z"/></svg></button>`; };
  const card = p => `<article class="card" data-tilt>
    <a class="figbtn" href="#/product/${p.id}" aria-label="View details of ${esc(p.name)}"><span class="badge">${p.tag}</span>${img(p)}</a>
    ${heartBtn(p.id)}<p class="cat">${p.cat}</p><h3><a href="#/product/${p.id}">${esc(p.name)}</a></h3>
    <p class="price">${money(p.price)}${p.old ? ` <s>${money(p.old)}</s>` : ''}</p>
    <button class="btn btn-primary" type="button" data-act="add" data-id="${p.id}">Add to Cart</button></article>`;
  const empty = (t, b, h) => `<div class="empty"><p>${t}</p><a class="btn btn-primary" href="${h}">${b}</a></div>`;
  const head = (e, t, p) => `<div class="page-head"><p class="eyebrow">${e}</p><h1 class="pt">${t}</h1>${p ? `<p>${p}</p>` : ''}</div>`;
  const stars = r => '★'.repeat(Math.round(r)) + '☆'.repeat(5 - Math.round(r));
  const field = (l, n, o = '') => `<label>${l}<input name="${n}" ${o}></label>`;
  const EYE = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>';
  const EYEOFF = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 3l18 18"/><path d="M10.6 5.1A10 10 0 0 1 12 5c6.500 0 10 7 10 7a17 17 0 0 1-3.200 4.200M6.500 6.600A17 17 0 0 0 2 12s3.500 7 10 7a10 10 0 0 0 4-.800"/><path d="M9.900 9.900a3 3 0 0 0 4.200 4.200"/></svg>';
  const pw = (l, n, ac) => `<label>${l}<span class="pw"><input name="${n}" type="password" autocomplete="${ac}"><button class="eye" type="button" data-act="eye" aria-label="Show password" aria-pressed="false">${EYE}</button></span></label>`;

  const features = () => `<section class="section"><div class="wrap"><p class="eyebrow">Why choose SoleStyle?</p><h2>Made for sneaker lovers</h2><div class="features">
    <article class="feature"><span class="ficon"><svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" aria-hidden="true"><path d="M6 3h12l4 6-10 12L2 9z"/><path d="M2 9h20M9 3l3 6 3-6"/></svg></span><div><h3>Premium Quality</h3><p>We offer only the best quality sneakers from top brands.</p></div></article>
    <article class="feature"><span class="ficon"><svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 6h12v10H2zM14 9h4l4 4v3h-8"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg></span><div><h3>Free Shipping</h3><p>Enjoy free shipping on all orders above $50.</p></div></article>
    <article class="feature"><span class="ficon"><svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 11a8 8 0 0 0-14-4L4 9M4 4v5h5M4 13a8 8 0 0 0 14 4l2-2M20 20v-5h-5"/></svg></span><div><h3>Easy Returns</h3><p>Hassle-free returns within 30 days of purchase.</p></div></article></div></div></section>`;
  const newsletter = () => `<section class="section"><div class="wrap"><form class="news" data-form="news" novalidate>
    <span class="ficon"><svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="m4 7 8 6 8-6"/></svg></span>
    <div><p class="eyebrow">Stay Updated</p><h2>Join Our Newsletter</h2><p>Get the latest updates on new arrivals, special offers and more.</p></div>
    <div><label class="sr" for="nemail">Email address</label><div class="field"><input id="nemail" name="email" type="email" placeholder="Enter your email address" autocomplete="email"><button class="btn btn-primary" type="submit">Subscribe</button></div><p class="msg" role="status">Valid email required.</p></div></form></div></section>`;

  /* ---------- Views ---------- */
  const home = () => `<section class="hero" aria-labelledby="heroTitle"><div class="wrap hero-grid">
    <div class="hero-copy"><p class="eyebrow">New Collection</p><h1 id="heroTitle">STEP INTO <span>YOUR STYLE.</span></h1>
      <p class="lead">Discover premium sneakers designed for comfort, performance and everyday style. Elevate your look with the latest trends from SoleStyle.</p>
      <div class="cta"><a class="btn btn-primary" href="#/shop">Shop Collection <span aria-hidden="true">→</span></a><button class="btn btn-outline" type="button" data-act="scroll" data-t="#featured">Explore Sneakers</button></div>
      <div class="trust"><div class="faces" aria-hidden="true"><i>A</i><i>R</i><i>S</i><i>M</i></div><div><p>Trusted by 10,000+ sneaker lovers</p><p class="stars"><span aria-hidden="true">★★★★★</span><span class="sr">Rated 5 out of 5</span></p></div></div></div>
    <div class="stage" id="stage" role="group" aria-roledescription="carousel" aria-label="Featured sneakers"><div class="tilt"><div class="disc" aria-hidden="true"></div><div class="orbit" aria-hidden="true"></div><div class="ring" id="ring"></div></div>
      <div class="stage-foot"><p class="slide-name" id="slideName" aria-live="polite"></p><div class="dots" id="dots"></div></div></div></div></section>
    <section class="section" id="featured"><div class="wrap"><div class="row page-head"><div><p class="eyebrow">Featured Sneakers</p><h2>Our Popular Collection</h2></div><a class="link" href="#/shop">View All →</a></div>
      <div class="grid-cards">${PRODUCTS.slice(0, 4).map(card).join('')}</div></div></section>
    <section class="section"><div class="wrap"><div class="promo"><div class="promo-shoe">${img(P(6))}</div>
      <div><p class="eyebrow">Limited Time Offer</p><h2>New Sneaker Collection</h2><p>Get up to 40% off on our latest collection. Don't miss out!</p></div><a class="btn btn-dark" href="#/shop">Shop Now <span aria-hidden="true">→</span></a></div></div></section>
    ${features()}${newsletter()}`;

  const F = { q: '', cat: 'All', sort: 'pop' };
  const list = () => {
    let r = PRODUCTS.filter(p => (F.cat === 'All' || p.cat === F.cat) && (p.name + ' ' + p.cat).toLowerCase().includes(F.q.toLowerCase()));
    if (F.sort === 'low') r.sort((a, b) => a.price - b.price); else if (F.sort === 'high') r.sort((a, b) => b.price - a.price); else if (F.sort === 'rate') r.sort((a, b) => b.rate - a.rate);
    return r.length ? r.map(card).join('') : '<div class="empty" style="grid-column:1/-1"><p>No sneakers match your search. Try another name or category.</p></div>';
  };
  const shop = () => `<div class="wrap page">${head('Sneakers', 'Find your pair', 'Browse every pair, tap a card for details, and save favourites with the heart.')}
    <div class="toolbar"><label class="sr" for="q">Search sneakers</label><input id="q" type="search" placeholder="Search sneakers" value="${esc(F.q)}" data-act="q">
      <div class="chips" role="group" aria-label="Category">${['All', ...CATS].map(c => `<button class="chip" type="button" data-act="cat" data-c="${c}" aria-pressed="${F.cat === c}">${c}</button>`).join('')}</div>
      <label class="sr" for="sort">Sort by</label><select id="sort" data-act="sort"><option value="pop">Most popular</option><option value="rate">Top rated</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option></select></div>
    <div id="grid" class="grid-cards">${list()}</div></div>`;

  const wishlist = () => `<div class="wrap page">${head('Wishlist', 'Your saved pairs')}${S.wish.length ? `<div class="grid-cards">${S.wish.map(P).filter(Boolean).map(card).join('')}</div>` : empty('Your wishlist is empty. Tap the heart on any sneaker to save it here.', 'Browse Sneakers', '#/shop')}</div>`;

  const cart = () => {
    const t = totals();
    const lines = S.cart.map((i, k) => { const p = P(i.id); return `<article class="line">${img(p)}<div><h3>${esc(p.name)}</h3><p class="muted">${p.cat} · ${money(p.price)}${i.color ? ' · ' + esc(i.color) : ''}</p>
      <label class="muted" for="sz${k}">Size (UK)</label> <div class="qty"><select id="sz${k}" data-act="size" data-k="${k}">${SIZES.map(s => `<option${s === i.size ? ' selected' : ''}>${s}</option>`).join('')}</select></div></div>
      <div class="ctl"><b>${money(p.price * i.q)}</b><div class="qty"><button type="button" data-act="dec" data-k="${k}" aria-label="Decrease quantity of ${esc(p.name)}">−</button><span aria-live="polite">${i.q}</span><button type="button" data-act="inc" data-k="${k}" aria-label="Increase quantity of ${esc(p.name)}">+</button></div><button class="rm" type="button" data-act="rm" data-k="${k}">Remove</button></div></article>`; }).join('');
    return `<div class="wrap page">${head('Shopping Bag', 'Your bag')}${S.cart.length ? `<div class="cart-grid"><div class="lines">${lines}</div>${summary(t)}<!-- -->` : empty('Your bag is empty.', 'Start Shopping', '#/shop')}${S.cart.length ? '</div>' : ''}</div>`;
  };
  const rows = t => `<dl><dt>Subtotal</dt><dd>${money(t.sub)}</dd><dt>Shipping</dt><dd>${t.ship ? money(t.ship) : 'Free'}</dd><dt class="tot">Total</dt><dd class="tot">${money(t.total)}</dd></dl>`;
  const summary = t => `<aside class="sum" aria-label="Order summary"><h2>Order summary</h2>${rows(t)}<a class="btn btn-primary" href="#/checkout">Proceed to Checkout</a><p class="muted" style="margin-top:.8rem;font-size:.82rem">Free shipping on orders above $50.</p></aside>`;

  /* ---------- Addresses, checkout, account ---------- */
  let AT = 'profile', AM = 'login', AE = null;
  const addrs = () => (me().addrs = me().addrs || []);
  const sAddrs = () => [...addrs()].sort((a, b) => (b.def ? 1 : 0) - (a.def ? 1 : 0));
  const addrLine = a => `${esc(a.line)}, ${esc(a.city)}, ${esc(a.state)} ${esc(a.pin)}`;
  const vAddr = d => d.name && /^\d{10}$/.test(d.phone) && d.line && d.city && d.state && /^\d{6}$/.test(d.pin);
  const addrFields = (a = {}) => `<div class="two"><label>Label<select name="label">${['Home', 'Work', 'Other'].map(x => `<option${a.label === x ? ' selected' : ''}>${x}</option>`).join('')}</select></label>${field('Full name', 'name', `value="${esc(a.name || '')}" autocomplete="name"`)}</div>
    ${field('Phone (10 digits)', 'phone', `value="${esc(a.phone || '')}" inputmode="numeric" autocomplete="tel"`)}${field('Address (house no, street, area)', 'line', `value="${esc(a.line || '')}" autocomplete="street-address"`)}
    <div class="two">${field('City', 'city', `value="${esc(a.city || '')}" autocomplete="address-level2"`)}${field('State', 'state', `value="${esc(a.state || '')}" autocomplete="address-level1"`)}</div>${field('PIN code (6 digits)', 'pin', `value="${esc(a.pin || '')}" inputmode="numeric" autocomplete="postal-code"`)}`;
  const addrCard = a => `<article class="addr-card${a.def ? ' is-def' : ''}"><div class="addr-top"><span class="pill">${esc(a.label)}</span>${a.def ? '<span class="tagdef">Default</span>' : ''}</div>
    <p><b>${esc(a.name)}</b><br>${addrLine(a)}<br><span class="muted">Phone: ${esc(a.phone)}</span></p>
    <div class="addr-act"><button class="link-btn" type="button" data-act="editaddr" data-id="${a.id}">Edit</button>${a.def ? '' : `<button class="link-btn" type="button" data-act="defaddr" data-id="${a.id}">Set as default</button>`}<button class="link-btn danger" type="button" data-act="deladdr" data-id="${a.id}">Delete</button></div></article>`;

  const stepsBar = n => `<ol class="stepsbar" aria-label="Checkout progress">${['Address', 'Payment', 'Confirmation'].map((t, i) => `<li class="${i < n ? 'done' : i === n ? 'now' : ''}"${i === n ? ' aria-current="step"' : ''}><span>${i < n ? '✓' : i + 1}</span>${t}</li>`).join('')}</ol>`;
  const miniList = () => S.cart.map(i => { const p = P(i.id); return `<div class="mini">${img(p)}<span>${esc(p.name)}<br><small class="muted">UK ${i.size}${i.color ? ' · ' + esc(i.color) : ''} × ${i.q}</small></span><b>${money(p.price * i.q)}</b></div>`; }).join('');

  /* Step 1: delivery address */
  const checkout = () => {
    const t = totals(), u = me(), ad = sAddrs(), co = S.co && S.co.user === S.user ? S.co : null;
    const sel = co ? co.sel : (ad[0] ? ad[0].id : 'new'), useNew = sel === 'new' || !ad.some(a => a.id === sel);
    const saved = ad.length ? `<div class="addr-pick" role="radiogroup" aria-label="Saved addresses">${ad.map(a => `<label class="addr-opt"><input type="radio" name="addrSel" value="${a.id}"${!useNew && a.id === sel ? ' checked' : ''}><span><b>${esc(a.label)}</b> ${a.def ? '<em class="tagdef">Default</em>' : ''}<br>${esc(a.name)} · ${esc(a.phone)}<br><small class="muted">${addrLine(a)}</small></span></label>`).join('')}<label class="addr-opt"><input type="radio" name="addrSel" value="new"${useNew ? ' checked' : ''}><span><b>Use a different address</b></span></label></div>` : '';
    return `<div class="wrap page">${head('Checkout', 'Delivery address')}${stepsBar(0)}<div class="co-grid"><form class="form" data-form="deliver" novalidate>
      <h2>Where should we deliver?</h2>${saved}
      <div class="pf" id="newaddr"${ad.length && !useNew ? ' hidden' : ''}>${addrFields(co && co.sel === 'new' ? co.ad : { name: u.name, phone: u.phone })}<label class="chk"><input type="checkbox" name="saveAddr"${!co || co.save ? ' checked' : ''}> Save this address to my account</label></div>
      <p class="msg" role="status"></p><button class="btn btn-primary" type="submit">Continue to payment <span aria-hidden="true">→</span></button></form>
      <aside class="sum" aria-label="Order summary"><h2>Order summary</h2>${miniList()}${rows(t)}</aside></div></div>`;
  };

  /* Step 2: payment */
  const payment = () => {
    const t = totals(), a = S.co.ad;
    return `<div class="wrap page">${head('Checkout', 'Payment')}${stepsBar(1)}<div class="co-grid"><form class="form" data-form="pay" novalidate>
      <h2>Delivering to</h2><div class="addr-card is-def"><div class="addr-top"><span class="pill">${esc(a.label || 'Home')}</span></div><p><b>${esc(a.name)}</b><br>${addrLine(a)}<br><span class="muted">Phone: ${esc(a.phone)}</span></p><div class="addr-act"><a class="link-btn" href="#/checkout">Change address</a></div></div>
      <h2>Payment method</h2><div class="pay" role="radiogroup" aria-label="Payment method"><label><input type="radio" name="method" value="card" checked> Credit / Debit card</label><label><input type="radio" name="method" value="upi"> UPI</label><label><input type="radio" name="method" value="cod"> Cash on Delivery</label></div>
      <div class="pf" id="pf-card">${field('Name on card', 'cname', 'autocomplete="cc-name"')}${field('Card number', 'cnum', 'inputmode="numeric" placeholder="4242 4242 4242 4242" autocomplete="cc-number"')}<div class="two">${field('Expiry (MM/YY)', 'cexp', 'placeholder="08/29" autocomplete="cc-exp"')}${field('CVV', 'ccvv', 'inputmode="numeric" maxlength="4" autocomplete="cc-csc"')}</div></div>
      <div class="pf" id="pf-upi" hidden>${field('UPI ID', 'upi', 'placeholder="name@bank"')}</div>
      <p class="note">Payments are not processed here, and card details are never saved. Enter a valid test card number to continue.</p>
      <p class="msg" role="status"></p><button class="btn btn-primary" type="submit">Place Order · ${money(t.total)}</button></form>
      <aside class="sum" aria-label="Order summary"><h2>Order summary</h2>${miniList()}${rows(t)}</aside></div></div>`;
  };

  const authView = () => `<div class="wrap page"><div class="auth-wrap"><aside class="auth-art"><p class="eyebrow light">SoleStyle account</p><h2>Your sneaker locker.</h2>
    <ul><li>Save delivery addresses once, use them at checkout</li><li>Track every order in one place</li><li>Keep a wishlist of pairs you love</li></ul>${img(P(5))}</aside>
    <div class="auth-card"><div class="seg" role="group" aria-label="Log in or sign up"><button type="button" data-act="amode" data-m="login" aria-pressed="${AM === 'login'}">Log in</button><button type="button" data-act="amode" data-m="signup" aria-pressed="${AM === 'signup'}">Sign up</button></div>
    ${AM === 'login' ? `<form class="form" data-form="login" novalidate><h2>Welcome back</h2><p class="muted">Log in to see your orders and saved addresses.</p>${field('Email', 'email', 'type="email" autocomplete="email"')}${pw('Password', 'password', 'current-password')}<p class="msg" role="status"></p><button class="btn btn-primary" type="submit">Log in</button></form>`
      : `<form class="form" data-form="signup" novalidate><h2>Create your account</h2><p class="muted">It takes less than a minute.</p>${field('Full name', 'name', 'autocomplete="name"')}${field('Email', 'email', 'type="email" autocomplete="email"')}${field('Mobile number', 'phone', 'inputmode="numeric" autocomplete="tel" placeholder="10-digit number"')}${pw('Password', 'password', 'new-password')}<p class="muted" style="font-size:.8rem;margin-top:-.4rem">At least 8 characters with a letter and a number.</p><p class="msg" role="status"></p><button class="btn btn-primary" type="submit">Create account</button></form>`}
    <p class="note">Account details are saved only in this browser.</p></div></div></div>`;

  const panels = {
    profile: u => { const d = sAddrs()[0]; return `<div class="panel-head"><h2>Profile</h2></div><form class="form flat" data-form="profile" novalidate>
      <div class="two">${field('Full name', 'name', `value="${esc(u.name)}" autocomplete="name"`)}${field('Phone (10 digits)', 'phone', `value="${esc(u.phone || '')}" inputmode="numeric" autocomplete="tel"`)}</div>
      ${field('Email', 'email', `type="email" value="${esc(u.email)}" disabled`)}<p class="msg" role="status"></p><div><button class="btn btn-primary" type="submit">Save changes</button></div></form>
      <h3 style="margin:1.8rem 0 .8rem">Default delivery address</h3>${d ? addrCard(d).replace(/<div class="addr-act">.*<\/div>/, '') : '<p class="muted">No address saved yet.</p>'}<p style="margin-top:.8rem"><button class="link-btn" type="button" data-act="atab" data-t="addresses">${d ? 'Manage addresses' : 'Add an address'} →</button></p>`; },
    addresses: u => { const ad = sAddrs(), e = AE === 'new' ? {} : ad.find(a => a.id === AE);
      return `<div class="panel-head"><h2>Saved addresses</h2>${AE ? '' : '<button class="btn btn-primary sm" type="button" data-act="addnew">+ Add new address</button>'}</div>
      ${AE ? `<form class="form addr-form" data-form="address" novalidate><input type="hidden" name="id" value="${e && e.id ? e.id : ''}"><h3>${e && e.id ? 'Edit address' : 'New address'}</h3>${addrFields(e && e.id ? e : { name: u.name, phone: u.phone })}
        <label class="chk"><input type="checkbox" name="def"${(e && e.def) || !ad.length ? ' checked' : ''}> Make this my default address</label><p class="msg" role="status"></p><div class="m-btns"><button class="btn btn-primary" type="submit">Save address</button><button class="btn btn-outline" type="button" data-act="canceladdr">Cancel</button></div></form>` : ''}
      ${ad.length ? `<div class="addr-grid">${ad.map(addrCard).join('')}</div>` : AE ? '' : '<div class="empty"><p>No saved addresses yet. Add one and it will be ready at checkout.</p></div>'}`; },
    orders: (u, os) => `<div class="panel-head"><h2>My orders</h2></div>${os.length ? `<div class="orders">${os.map(o => `<a class="o-card" href="#/order/${o.id}"><div class="o-top"><span><b>${o.id}</b><br><small class="muted">${new Date(o.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })} · ${o.items.reduce((n, i) => n + i.q, 0)} item(s)</small></span><span style="text-align:right"><span class="status st${stageOf(o)}">${STEPS[stageOf(o)][0]}</span><br><b>${money(o.total)}</b></span></div><div class="o-thumbs">${o.items.slice(0, 4).map(i => img(P(i.id))).join('')}</div><span class="link">View details and track order →</span></a>`).join('')}</div>` : empty('No orders yet. Your orders will show up here.', 'Shop Sneakers', '#/shop')}`,
    wishlist: () => `<div class="panel-head"><h2>My wishlist</h2></div>${S.wish.length ? `<div class="grid-cards w2">${S.wish.map(P).filter(Boolean).map(card).join('')}</div>` : empty('Nothing saved yet. Tap the heart on any sneaker.', 'Browse Sneakers', '#/shop')}`,
    security: () => `<div class="panel-head"><h2>Security</h2></div><form class="form flat" data-form="password" novalidate>${pw('Current password', 'cur', 'current-password')}<div class="two">${pw('New password', 'nw', 'new-password')}${pw('Confirm new password', 'cf', 'new-password')}</div><p class="msg" role="status"></p><div><button class="btn btn-primary" type="submit">Update password</button></div></form>`
  };

  const account = () => {
    const u = me(); if (!u) return authView();
    const os = S.orders.filter(o => o.user === u.email);
    const tabs = [['profile', 'Profile', ''], ['addresses', 'Addresses', addrs().length], ['orders', 'Orders', os.length], ['wishlist', 'Wishlist', S.wish.length], ['security', 'Security', '']];
    return `<div class="wrap page"><section class="acc-hero"><div class="acc-id"><span class="avatar big" aria-hidden="true">${esc(u.name.trim()[0].toUpperCase())}</span><div><p class="eyebrow light">My account</p><h1 class="pt">Hi, ${esc(u.name.trim().split(' ')[0])}</h1><p>${esc(u.email)}${u.since ? ' · Member since ' + new Date(u.since).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) : ''}</p></div></div>
      <dl class="acc-stats"><div><dt>Orders</dt><dd>${os.length}</dd></div><div><dt>Wishlist</dt><dd>${S.wish.length}</dd></div><div><dt>Addresses</dt><dd>${addrs().length}</dd></div></dl></section>
      <div class="acc-layout"><nav class="acc-nav" aria-label="Account sections">${tabs.map(([k, l, n]) => `<button type="button" data-act="atab" data-t="${k}"${AT === k ? ' aria-current="page"' : ''}>${l}${n !== '' ? `<span class="n">${n}</span>` : ''}</button>`).join('')}<button class="out" type="button" data-act="logout">Log out</button></nav>
      <section class="panel" aria-live="polite">${panels[AT](u, os)}</section></div></div>`;
  };

  /* ---------- Orders: tracking and order-placed screens ---------- */
  const STEPS = [['Order confirmed', 'We have received your order.', 0], ['Packed', 'Your pair is packed and ready to ship.', 2], ['Shipped', 'Your order has left our warehouse.', 6], ['Out for delivery', 'The courier is on the way to you.', 12], ['Delivered', 'Your order has been delivered.', 20]];
  const stageOf = o => { const m = (Date.now() - new Date(o.date)) / 6e4; let i = 0; STEPS.forEach((s, k) => { if (m >= s[2]) i = k; }); return i; };
  const eta = o => new Date(+new Date(o.date) + 4 * 864e5).toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' });
  const fd = (d, t) => new Date(d).toLocaleString(undefined, t ? { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' } : { day: 'numeric', month: 'short', year: 'numeric' });
  const oItems = o => o.items.map(i => `<div class="mini">${img(P(i.id))}<span>${esc(i.name)}<br><small class="muted">UK ${i.size}${i.color ? ' · ' + esc(i.color) : ''} × ${i.q}</small></span><b>${money(i.price * i.q)}</b></div>`).join('');
  const oInfo = o => `<p class="muted" style="margin-top:.8rem"><b>Deliver to:</b> ${esc(o.name)}, ${esc(o.addr)}<br><b>Phone:</b> ${esc(o.phone)}<br><b>Payment:</b> ${esc(o.method)}</p>`;
  const noOrder = () => `<div class="wrap page">${empty('We could not find that order. Log in to the account that placed it.', 'Go to Account', '#/account')}</div>`;
  const TRUCK = '<svg width="44" height="28" viewBox="0 0 44 28" aria-hidden="true"><rect x="1" y="3" width="24" height="16" rx="3" fill="#D1460A"/><path d="M25 8h8l7 7v4H25z" fill="#16120F"/><circle cx="10" cy="21" r="4.500" fill="#16120F" stroke="#fff" stroke-width="2"/><circle cx="33" cy="21" r="4.500" fill="#16120F" stroke="#fff" stroke-width="2"/></svg>';

  const order = id => {
    const o = S.orders.find(x => x.id === id && x.user === S.user); if (!o) return noOrder();
    const st = stageOf(o), last = st === STEPS.length - 1;
    return `<div class="wrap page"><a class="link back" href="#/account" data-act="orders">← Back to my orders</a>
      <div class="o-head"><div><p class="eyebrow">Order details</p><h1 class="pt">${o.id}</h1><p class="muted">Placed on ${fd(o.date, 1)}</p></div><span class="status st${st}">${STEPS[st][0]}</span></div>
      <div class="o-grid"><section class="panel"><h2>Order tracking</h2><p class="eta">${last ? 'Delivered. We hope you love your pair!' : `Expected delivery by <b>${eta(o)}</b>`}</p>
        <ol class="track">${STEPS.map((s, k) => `<li class="${k < st ? 'done' : k === st ? 'now' : ''}"><span class="dot">${k <= st ? '✓' : k + 1}</span><div><b>${s[0]}</b><p class="muted">${s[1]}</p>${k <= st ? `<small>${fd(+new Date(o.date) + s[2] * 6e4, 1)}</small>` : ''}</div></li>`).join('')}</ol>
        <p class="note" style="margin-top:1.2rem">Tracking status is simulated and updates automatically.</p></section>
        <aside class="sum"><h2>Order summary</h2>${oItems(o)}${rows(o)}${oInfo(o)}</aside></div></div>`;
  };

  const placed = id => {
    const o = S.orders.find(x => x.id === id && x.user === S.user); if (!o) return noOrder();
    return `<div class="wrap page"><div class="done placed"><div class="burst" id="burst" aria-hidden="true"></div>
      <svg class="okmark" viewBox="0 0 100 100" aria-hidden="true"><circle class="ring1" cx="50" cy="50" r="46"/><circle class="c" cx="50" cy="50" r="38"/><path class="t" d="M32 52l13 13 24-27"/></svg>
      <h1 class="pt fu" style="--d:.9s">Order placed!</h1><p class="muted fu" style="--d:1s">Thank you, ${esc(o.name.split(' ')[0])}. Your order <b>${o.id}</b> is confirmed.</p>
      <div class="ship fu" style="--d:1.1s"><div class="road" aria-hidden="true"><span class="truck">${TRUCK}</span></div><p>Expected delivery by <b>${eta(o)}</b></p></div>
      <div class="sum fu" style="--d:1.25s"><h2>Order summary</h2>${oItems(o)}${rows(o)}${oInfo(o)}</div>
      <div class="m-btns fu" style="--d:1.4s;justify-content:center;margin-top:1.2rem"><a class="btn btn-primary" href="#/order/${o.id}">Track my order</a><a class="btn btn-outline" href="#/shop">Continue shopping</a></div></div></div>`;
  };
  function burst() {
    const b = $('#burst'); if (!b || reduce) return;
    const cols = ['#F26A0F', '#16120F', '#FFB27A', '#D1460A', '#F5A400', '#18A058'];
    b.innerHTML = Array.from({ length: 40 }, () => { const a = Math.random() * Math.PI * 2, d = 90 + Math.random() * 200; return `<i style="--x:${(Math.cos(a) * d).toFixed(0)}px;--y:${(Math.sin(a) * d - 60).toFixed(0)}px;--r:${(Math.random() * 720 - 360).toFixed(0)}deg;--c:${cols[Math.random() * cols.length | 0]};--dl:${(.5 + Math.random() * .3).toFixed(2)}s"></i>`; }).join('');
  }

  const ico = d => `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
  const IC = {
    heart: '<path d="M12 20.5S3.5 15 3.5 8.9A4.4 4.4 0 0 1 12 7a4.4 4.4 0 0 1 8.5 1.9C20.5 15 12 20.5 12 20.5z"/>',
    shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="m9 12 2 2 4-4"/>',
    tag: '<path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.5" cy="8.5" r="1.2"/>',
    ret: '<path d="M20 11a8 8 0 0 0-14-4L4 9M4 4v5h5M4 13a8 8 0 0 0 14 4l2-2M20 20v-5h-5"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="m4 7 8 6 8-6"/>',
    phone: '<path d="M5 4h4l2 5-2.500 1.500a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    pin: '<path d="M12 21s7-6 7-11a7 7 0 0 0-14 0c0 5 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>'
  };

  const about = () => `<div class="wrap page ab"><div class="ab-grid"><div>${head('About SoleStyle', 'Sneakers for every step')}
      <p class="lead">SoleStyle started with a simple idea: a great pair of sneakers should feel good, look sharp and last. We pick every pair for comfort, build quality and style, from running shoes to everyday classics.</p>
      <div class="cta"><a class="btn btn-primary" href="#/shop">Shop Sneakers</a><a class="btn btn-outline" href="#/contact">Talk to us</a></div></div>
      <div class="collage">${img(P(5), '', true)}${img(P(3), '', true)}${img(P(7), '', true)}</div></div>
    <dl class="ab-stats"><div><dt>Happy customers</dt><dd data-count="10" data-suf="K+">10K+</dd></div><div><dt>Average rating</dt><dd data-count="4.7" data-dec="1" data-suf="★">4.7★</dd></div><div><dt>Easy returns</dt><dd data-count="30" data-suf=" days">30 days</dd></div><div><dt>Free shipping</dt><dd data-count="50" data-pre="$" data-suf="+">$50+</dd></div></dl>
    <section class="ab-story"><div><p class="eyebrow">Our story</p><h2>Built by people who love a good pair</h2></div>
      <div class="muted"><p>We were tired of choosing between sneakers that look great and sneakers that feel great. So we started SoleStyle to bring both together, with honest prices and no gimmicks.</p><br>
      <p>Every pair in our range is chosen by hand. We look at the fit, the cushioning, the stitching and how the shoe holds up after weeks of real wear. If it does not pass, it does not make the shelf.</p>
      <blockquote>“Comfort first, style always.”</blockquote></div></section>
    <section><p class="eyebrow">What we stand for</p><h2>Our values</h2><div class="vals">
      ${[['heart', 'Comfort first', 'Cushioning and fit come before trends. You should forget you are wearing them.'], ['shield', 'Built to last', 'Quality materials and strong construction that keep going after the first few weeks.'], ['tag', 'Honest pricing', 'Fair prices with real discounts. No inflated tags and no hidden charges.'], ['ret', 'Easy returns', 'Not the right fit? Send it back within 30 days, hassle free.']].map(([i, t, p]) => `<article class="val"><span class="ficon">${ico(IC[i])}</span><h3>${t}</h3><p class="muted">${p}</p></article>`).join('')}</div></section>
    <section class="ab-how"><p class="eyebrow">How we choose</p><h2>From shortlist to your doorstep</h2><ol class="steps">
      ${[['Source', 'We shortlist styles from trusted makers and check materials and build.'], ['Test', 'Every pair is checked for fit, cushioning and durability before we stock it.'], ['Curate', 'Only the best pairs across running, lifestyle, basketball and casual make the range.'], ['Deliver', 'Fast, careful packing with free shipping above $50 and easy returns.']].map(([t, p], i) => `<li class="step"><span class="num">${i + 1}</span><h3>${t}</h3><p class="muted">${p}</p></li>`).join('')}</ol></section>
    <section><div class="row page-head"><div><p class="eyebrow">Fresh on the shelf</p><h2>A few pairs we love</h2></div><a class="link" href="#/shop">See all sneakers →</a></div>
      <div class="tiles">${[1, 2, 6, 8].map(id => { const p = P(id); return `<a class="tile" href="#/product/${p.id}" aria-label="View details of ${esc(p.name)}">${img(p)}<span><b>${esc(p.name)}</b><small>${money(p.price)}</small></span></a>`; }).join('')}</div></section>
    <section class="cta-band"><div><h2>Ready to find your pair?</h2><p>Free shipping above $50. Easy returns for 30 days.</p></div><a class="btn btn-primary" href="#/shop">Shop Sneakers <span aria-hidden="true">→</span></a></section></div>`;

  let CS = null;
  const FAQ = [
    ['How do I find my size?', 'Our sizes are UK sizes (6 to 11). If you are between sizes, we suggest going up one size for extra comfort, especially for running shoes.'],
    ['How long does delivery take?', 'Orders are usually delivered in 3 to 6 working days. Shipping is free on orders above $50, and $6 below that.'],
    ['What is your return policy?', 'You can return unworn pairs within 30 days of delivery for a full refund. Contact us with your order number and we will arrange the pickup.'],
    ['Which payment methods do you accept?', 'Payment options shown are credit or debit card, UPI and Cash on Delivery. Payments are not processed here.'],
    ['Can I change my order after placing it?', 'Message us as soon as possible with your order number. If the order has not shipped, we will happily update the size or address.']
  ];
  const contact = () => { return `<div class="wrap page">${head('Contact', 'We would love to hear from you', 'Questions about sizing, an order or a return? Send us a message and we will reply within one working day.')}
    <div class="ct-cards">${[['mail', 'Email us', 'support@solestyle.example', 'mailto:support@solestyle.example'], ['phone', 'Call us', '+91 12345 67890', 'tel:+911234567890'], ['clock', 'Support hours', 'Mon–Sat, 10:00 – 18:00', ''], ['pin', 'Visit the store', '12 Sneaker Street, Mumbai 400001', 'https://www.google.com/maps/search/?api=1&query=Sneaker+Street+Mumbai']].map(([i, t, v, h]) => `<article class="ct-card"><span class="ficon">${ico(IC[i])}</span><div><h3>${t}</h3>${h ? `<a href="${h}"${h.startsWith('http') ? ' target="_blank" rel="noopener"' : ''}>${v}</a>` : `<p>${v}</p>`}</div></article>`).join('')}</div>
    <div class="ct-main">${CS ? `<section class="panel done-box"><div class="tick" aria-hidden="true">✓</div><h2>Message sent</h2><p class="muted">Thank you! Your reference number is <b>${CS.id}</b>. We will reply to <b>${esc(CS.email)}</b> within one working day.</p><p class="note" style="margin-top:1rem">Your message is saved only in this browser.</p><p style="margin-top:1.2rem"><button class="btn btn-primary" type="button" data-act="again">Send another message</button></p></section>`
      : `<form class="panel form flat" data-form="contact" novalidate><h2>Send us a message</h2><div class="two">${field('Your name', 'name', 'autocomplete="name"')}${field('Email', 'email', 'type="email" autocomplete="email"')}</div>
      <div class="two"><label>Topic<select name="topic"><option>Order help</option><option>Sizing and fit</option><option>Returns and refunds</option><option>Something else</option></select></label>${field('Order number (optional)', 'order', 'placeholder="SS..."')}</div>
      <label>Message<textarea name="message" maxlength="600" data-act="cnt" placeholder="Tell us how we can help"></textarea></label><p class="muted" style="font-size:.8rem;margin-top:-.5rem"><span id="cc">0</span> / 600</p>
      <p class="msg" role="status"></p><div><button class="btn btn-primary" type="submit">Send message</button></div></form>`}
      <aside class="ct-side"><div class="help"><h3>Need an answer faster?</h3><p>Most questions are answered below. For orders, check your account.</p><a class="btn btn-primary" href="#/account" data-act="orders">Track my orders</a></div>
        <div class="panel"><h3>Quick links</h3><ul class="qlinks"><li><a href="#/shop">Browse sneakers</a></li><li><a href="#/wishlist">My wishlist</a></li><li><a href="#/cart">Shopping bag</a></li></ul></div></aside></div>
    <section class="faq" aria-labelledby="faqT"><p class="eyebrow">FAQ</p><h2 id="faqT">Frequently asked questions</h2>${FAQ.map(([q, a]) => `<details><summary>${q}</summary><p class="muted">${a}</p></details>`).join('')}</section></div>`; };

  /* ---------- Product page ---------- */
  let PT = 'desc', lastP = null, GV = null;
  const CROPS = [{ z: 1, x: '50%', y: '50%' }, { z: 1.9, x: '28%', y: '62%' }, { z: 1.9, x: '75%', y: '50%' }, { z: 1.7, x: '50%', y: '18%' }];
  const vStyle = v => `--z:${v.z};--ox:${v.x};--oy:${v.y}`;
  const SF = r => `<span class="stars-fill" style="--p:${(r / 5 * 100).toFixed(0)}%" aria-hidden="true">★★★★★</span>`;
  const SIZEMAP = [[6, 40, 25], [7, 41, 25.8], [8, 42.5, 26.7], [9, 44, 27.5], [10, 45, 28.3], [11, 46, 29.2]];
  const ic = d => `<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;

  const product = id => {
    const p = P(id); if (!p) return `<div class="wrap page">${empty('We could not find that sneaker.', 'Browse Sneakers', '#/shop')}</div>`;
    const cl = colorsOf(p), a = agg(p), pc = pct(p), w = S.wish.includes(p.id), rv = revs(p.id);
    const views = p.more && p.more.length ? [p.ph, ...p.more].map(ph => ({ ph, z: 1, x: '50%', y: '50%' })) : CROPS.map(c => ({ ph: p.ph, ...c }));
    GV = { p, views, i: 0 };
    const feats = [...p.f, 'Rubber outsole for better grip', 'Suitable for casual and sports wear'];
    const tabs = [['desc', 'Description'], ['feat', 'Features'], ['ship', 'Shipping<span class="hm"> & Returns</span>'], ['reviews', 'Reviews']];
    const panels = {
      desc: `<div class="tcols"><div><h3>Product Description</h3><p>${esc(p.d)}</p><p style="margin-top:.8rem">The ${esc(p.name)} is built for comfort and everyday style. Perfect for daily wear or for adding to your collection.</p></div><div><h3>Key Features</h3><ul class="ticks">${feats.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div></div>`,
      feat: `<div class="tcols"><div><h3>Specifications</h3><dl class="specs"><dt>Category</dt><dd>${esc(p.cat)}</dd><dt>Closure</dt><dd>Lace-up</dd><dt>Outsole</dt><dd>Rubber</dd><dt>Fit</dt><dd>True to size</dd><dt>Care</dt><dd>Wipe clean with a damp cloth</dd></dl></div><div><h3>Highlights</h3><ul class="ticks">${feats.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div></div>`,
      ship: `<h3>Shipping</h3><ul class="ticks"><li>Free shipping on orders above $50 ($6 below that).</li><li>Delivery in 3 to 6 working days.</li><li>Cash on Delivery is available.</li></ul><h3 style="margin-top:1.2rem">Returns</h3><ul class="ticks"><li>Easy returns within 30 days of delivery.</li><li>Pairs must be unworn and in the original box.</li><li>Refunds are issued to your original payment method.</li></ul>`,
      reviews: `<div class="rv-sum"><div class="rv-score"><b>${a.avg.toFixed(1)}</b>${SF(a.avg)}<span class="muted">${a.n} reviews</span></div><div>${me() ? `<form class="form flat" data-form="review" data-pid="${p.id}" novalidate><h3>Write a review</h3><fieldset class="starpick"><legend class="sr">Your rating</legend>${[5, 4, 3, 2, 1].map(n => `<input type="radio" id="st${n}" name="rating" value="${n}"><label for="st${n}" title="${n} star${n > 1 ? 's' : ''}"><span class="sr">${n} stars</span>★</label>`).join('')}</fieldset><label>Your review<textarea name="message" maxlength="500" placeholder="Share what you liked about this pair"></textarea></label><p class="msg" role="status"></p><div><button class="btn btn-primary" type="submit">Submit review</button></div></form>` : `<p class="note">Log in to write a review. <a class="link" href="#/account">Log in</a></p>`}</div></div>
        <div class="rv-list">${rv.length ? rv.map(r => `<article class="rv"><div class="row" style="align-items:center"><b>${esc(r.name)}</b><small class="muted">${fd(r.date)}</small></div>${SF(r.rating)}<p>${esc(r.text)}</p></article>`).join('') : '<p class="muted">No written reviews yet. Be the first to share your thoughts.</p>'}</div>`
    };
    return `<div class="wrap page pdp"><nav class="crumbs" aria-label="Breadcrumb"><a href="#/">Home</a><span aria-hidden="true">›</span><a href="#/shop">Sneakers</a><span aria-hidden="true">›</span><span aria-current="page">${esc(p.name)}</span></nav>
      <div class="pd">
        <div class="pgal gal"><div class="thumbs" role="group" aria-label="Product views">${views.map((v, i) => `<button class="thumb" type="button" data-act="gv" data-i="${i}" aria-label="Show view ${i + 1}"${i === 0 ? ' aria-current="true"' : ''}><img src="${U(v.ph)}" alt="" style="${vStyle(v)}" data-s="${p.s}" loading="lazy"></button>`).join('')}</div>
          <div class="gmain"><span class="badge">${p.tag}</span>${heartBtn(p.id)}<img id="gImg" src="${U(p.ph)}" alt="${esc(p.name)} sneaker" style="${vStyle(views[0])}" data-ph="${p.ph}" data-s="${p.s}">
            <button class="garr prev" type="button" data-act="gprev" aria-label="Previous view"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 6-6 6 6 6"/></svg></button>
            <button class="garr next" type="button" data-act="gnext" aria-label="Next view"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 6 6 6-6 6"/></svg></button>
            <div class="gdots" aria-hidden="true">${views.map((v, i) => `<i${i === 0 ? ' class="on"' : ''}></i>`).join('')}</div></div></div>
        <div class="pinfo"><p class="cat">${esc(p.cat)} sneakers</p><h1 class="pname">${esc(p.name)}</h1>
          <button class="rate" type="button" data-act="ptab" data-t="reviews" aria-label="${a.avg.toFixed(1)} out of 5, ${a.n} reviews. Show reviews">${SF(a.avg)}<b>${a.avg.toFixed(1)}</b><span class="muted">(${a.n} reviews)</span></button>
          <div class="pprice"><span class="now">${money(p.price)}</span>${p.old ? `<s>${money(p.old)}</s><span class="off">${pc}% OFF</span>` : ''}</div>
          <p class="pdesc">${esc(p.d)}</p>
          <div class="opt"><p class="olabel">Color: <b id="clName">${esc(cl[0][0])}</b></p><div class="swatches" role="radiogroup" aria-label="Color">${cl.map((c, i) => `<label class="sw" title="${esc(c[0])}"><input type="radio" name="pcl" value="${esc(c[0])}"${i === 0 ? ' checked' : ''}><span style="background:linear-gradient(135deg,${c[1]} 50%,${c[2]} 50%)"></span><em class="sr">${esc(c[0])}</em></label>`).join('')}</div></div>
          <div class="opt"><div class="row" style="align-items:center"><p class="olabel">Size (UK)</p><button class="link-btn" type="button" data-act="sg" aria-expanded="false" aria-controls="sg">Size Guide</button></div>
            <div class="sizes2" role="radiogroup" aria-label="Size">${SIZES.map(s => `<label><input type="radio" name="psz" value="${s}"${s === 9 ? ' checked' : ''}><span>UK ${s}</span></label>`).join('')}</div>
            <div class="sguide" id="sg" hidden><table><thead><tr><th>UK</th><th>EU</th><th>Foot length (cm)</th></tr></thead><tbody>${SIZEMAP.map(r => `<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td></tr>`).join('')}</tbody></table><p class="muted" style="margin-top:.6rem;font-size:.8rem">Approximate guide. Between sizes? Go up one size.</p></div></div>
          <div class="opt"><p class="olabel">Quantity</p><div class="qtyb"><button type="button" data-act="qm" aria-label="Decrease quantity">−</button><output id="pq" aria-live="polite">1</output><button type="button" data-act="qp" aria-label="Increase quantity">+</button></div></div>
          <div class="pbtns"><button class="btn btn-primary" type="button" data-act="padd" data-id="${p.id}">Add to Cart</button><button class="btn btn-outline wbtn${w ? ' on' : ''}" type="button" data-act="wish" data-id="${p.id}" aria-pressed="${w}"><span>${w ? 'In Wishlist' : 'Add to Wishlist'}</span></button></div>
          <ul class="trust3"><li>${ic('<path d="M2 6h12v10H2zM14 9h4l4 4v3h-8"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>')}<div><b>Free Shipping</b><span>On orders above $50</span></div></li><li>${ic('<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="m9 12 2 2 4-4"/>')}<div><b>Secure Payment</b><span>100% protected</span></div></li><li>${ic('<path d="M20 11a8 8 0 0 0-14-4L4 9M4 4v5h5M4 13a8 8 0 0 0 14 4l2-2M20 20v-5h-5"/>')}<div><b>Easy Returns</b><span>30 days return policy</span></div></li></ul></div>
        <section class="ptabs"><div class="tabs" role="tablist" aria-label="Product details">${tabs.map(([k, l]) => `<button class="tab" role="tab" type="button" id="tab-${k}" data-act="ptab" data-t="${k}" data-pt="1" aria-selected="${PT === k}" aria-controls="pn-${k}">${l}</button>`).join('')}</div>
          ${tabs.map(([k]) => `<div class="tpanel" id="pn-${k}" role="tabpanel" aria-labelledby="tab-${k}"${PT === k ? '' : ' hidden'}>${panels[k]}</div>`).join('')}</section>
        <aside class="ppromo"><div><p class="eyebrow">Iconic style</p><h2>Timeless Design.</h2><p>The classic that never goes out of style.</p><a class="btn btn-outline sm" href="#/shop">Shop Now <span aria-hidden="true">→</span></a></div><div class="pimg">${img(p)}</div></aside>
      </div></div>`;
  };
  function setView(i) {
    const im = $('#gImg'); if (!GV || !im) return;
    const n = GV.views.length; GV.i = (i + n) % n; const v = GV.views[GV.i];
    im.style.setProperty('--z', v.z); im.style.setProperty('--ox', v.x); im.style.setProperty('--oy', v.y);
    if (im.dataset.ph !== v.ph) { im.dataset.ph = v.ph; delete im.dataset.fb; im.src = U(v.ph); }
    $$('.thumb').forEach((b, k) => k === GV.i ? b.setAttribute('aria-current', 'true') : b.removeAttribute('aria-current'));
    $$('.gdots i').forEach((d, k) => d.classList.toggle('on', k === GV.i));
  }

  const ROUTES = { home, shop, wishlist, cart, checkout, payment, account, order, placed, product, about, contact };
  const TITLES = { home: 'Premium Sneakers', shop: 'Sneakers', wishlist: 'Wishlist', cart: 'Shopping Bag', checkout: 'Checkout', payment: 'Payment', account: 'My Account', order: 'Order Tracking', placed: 'Order Placed', product: 'Sneaker', about: 'About', contact: 'Contact' };

  function render(keep) {
    clearInterval(timer);
    const [r, arg] = location.hash.replace(/^#\/?/, '').split('/'), v = ROUTES[r] ? r : 'home';
    if (v === 'checkout' || v === 'payment') {
      if (!S.cart.length) return go('#/cart');
      if (!me()) { S.next = 'checkout'; save(); toast('Please log in to place your order'); return go('#/account'); }
      if (v === 'payment' && !(S.co && S.co.user === S.user)) return go('#/checkout');
    }
    if (v !== 'contact') CS = null;
    if (v === 'product' && arg !== lastP) PT = 'desc';
    lastP = arg; cur = v; main.innerHTML = ROUTES[v](arg);
    document.title = `${v === 'product' && P(arg) ? P(arg).name : TITLES[v]} | SoleStyle`;
    $$('[data-r]').forEach(a => a.dataset.r === (v === 'product' ? 'shop' : v) ? a.setAttribute('aria-current', 'page') : a.removeAttribute('aria-current'));
    const ti = ['home', 'shop', 'about', 'contact'].indexOf(v === 'product' ? 'shop' : v), tb = $('#tabbar');
    tb.style.setProperty('--i', Math.max(ti, 0)); tb.classList.toggle('off', ti < 0);
    hdr(); if (!keep) scrollTo(0, 0);
    if (!keep && !document.startViewTransition && !reduce) { main.classList.remove('enter'); void main.offsetWidth; main.classList.add('enter'); }
    if (v === 'home') initHero();
    if (v === 'shop') $('#sort').value = F.sort;
    if (v === 'placed') burst();
    const oo = v === 'order' && S.orders.find(x => x.id === arg);
    if (oo && stageOf(oo) < STEPS.length - 1) timer = setInterval(() => render(true), 15000);
    enhance(main);
    if (v === 'about') countUp(main);
  }

  /* ---------- Hero: 3D turntable ---------- */
  function initHero() {
    const ring = $('#ring'), dots = $('#dots'), label = $('#slideName'), stage = $('#stage'), hp = HERO.map(P);
    ring.innerHTML = hp.map((p, i) => `<figure class="slide" style="--i:${i}">${img(p, '', true)}</figure>`).join('');
    dots.innerHTML = hp.map((p, i) => `<button type="button" aria-label="Show ${esc(p.name)}">0${i + 1}</button>`).join('');
    const slides = $$('.slide', ring), btns = $$('button', dots);
    let turn = 0, idx = 0;
    const go2 = n => {
      const t = ((n % 4) + 4) % 4; turn += (t - idx + 4) % 4; idx = t;
      ring.style.setProperty('--a', `${-turn * 90}deg`);
      slides.forEach((s, i) => { s.classList.toggle('on', i === idx); s.setAttribute('aria-hidden', i !== idx); });
      btns.forEach((b, i) => b.setAttribute('aria-current', i === idx));
      label.textContent = hp[idx].name;
    };
    const play = () => { if (!reduce) { clearInterval(timer); timer = setInterval(() => go2(idx + 1), 2000); } };
    btns.forEach((b, i) => b.addEventListener('click', () => { go2(i); play(); }));
    ['pointerenter', 'focusin'].forEach(e => stage.addEventListener(e, () => clearInterval(timer)));
    ['pointerleave', 'focusout'].forEach(e => stage.addEventListener(e, play));
    go2(0); play();
  }

  /* ---------- Cart, wishlist, modal ---------- */
  function addCart(id, size, q = 1, quiet, color) {
    color = color || colorsOf(P(id))[0][0];
    const l = S.cart.find(i => i.id === id && i.size === size && (i.color || colorsOf(P(i.id))[0][0]) === color);
    l ? l.q += q : S.cart.push({ id, size, q, color });
    save(); hdr();
    if (!quiet) toast(`${P(id).name} (UK ${size}, ${color}) added to your bag`);
  }
  function toggleWish(id) {
    const i = S.wish.indexOf(id); i < 0 ? S.wish.push(id) : S.wish.splice(i, 1); save(); hdr();
    const on = i < 0;
    $$(`.heart[data-id="${id}"]`).forEach(h => { h.classList.toggle('on', on); h.setAttribute('aria-pressed', on); h.setAttribute('aria-label', (on ? 'Remove from' : 'Add to') + ' wishlist'); });
    $$(`.wbtn[data-id="${id}"]`).forEach(b => { b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); $('span', b).textContent = on ? 'In Wishlist' : 'Add to Wishlist'; });
    toast(on ? 'Saved to your wishlist' : 'Removed from your wishlist');
    if (cur === 'wishlist' || (cur === 'account' && AT === 'wishlist')) render(true);
  }

  document.addEventListener('click', e => {
    const t = e.target.closest('[data-act]'); if (!t) return;
    const a = t.dataset.act, id = +t.dataset.id, k = +t.dataset.k;
    if (a === 'wish') toggleWish(id);
    else if (a === 'add') { const im = $('.figbtn img', t.closest('.card')), ra = im && im.getBoundingClientRect(); addCart(id, 9); if (im) fly(im.currentSrc || im.src, ra); }
    else if (a === 'gv') setView(+t.dataset.i);
    else if (a === 'gnext') setView(GV.i + 1);
    else if (a === 'gprev') setView(GV.i - 1);
    else if (a === 'ptab') { PT = t.dataset.t; $$('.tab').forEach(b => b.setAttribute('aria-selected', b.dataset.t === PT)); $$('.tpanel').forEach(x => { x.hidden = x.id !== 'pn-' + PT; }); if (!t.dataset.pt) $('.ptabs').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }); }
    else if (a === 'qm' || a === 'qp') { const o = $('#pq'); o.textContent = Math.max(1, Math.min(10, +o.textContent + (a === 'qp' ? 1 : -1))); }
    else if (a === 'sg') { const g = $('#sg'); g.hidden = !g.hidden; t.setAttribute('aria-expanded', !g.hidden); }
    else if (a === 'padd') { const sz = +$('input[name="psz"]:checked').value, cl = $('input[name="pcl"]:checked').value, q = +$('#pq').textContent, im = $('#gImg'), ra = im.getBoundingClientRect(); addCart(id, sz, q, false, cl); fly(im.currentSrc || im.src, ra); }
    else if (a === 'inc') { S.cart[k].q++; save(); render(true); }
    else if (a === 'dec') { if (S.cart[k].q > 1) S.cart[k].q--; save(); render(true); }
    else if (a === 'rm') { S.cart.splice(k, 1); save(); render(true); }
    else if (a === 'cat') { F.cat = t.dataset.c; $$('.chip').forEach(c => c.setAttribute('aria-pressed', c.dataset.c === F.cat)); $('#grid').innerHTML = list(); }
    else if (a === 'scroll') $(t.dataset.t).scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
    else if (a === 'eye') { const i = t.previousElementSibling, show = i.type === 'password'; i.type = show ? 'text' : 'password'; t.setAttribute('aria-pressed', show); t.setAttribute('aria-label', show ? 'Hide password' : 'Show password'); t.innerHTML = show ? EYEOFF : EYE; }
    else if (a === 'orders') { AT = 'orders'; AE = null; if (cur === 'account') render(true); }
    else if (a === 'again') { CS = null; render(true); }
    else if (a === 'atab') { AT = t.dataset.t; AE = null; render(true); }
    else if (a === 'amode') { AM = t.dataset.m; render(true); }
    else if (a === 'addnew') { AE = 'new'; render(true); }
    else if (a === 'editaddr') { AE = t.dataset.id; render(true); }
    else if (a === 'canceladdr') { AE = null; render(true); }
    else if (a === 'defaddr') { addrs().forEach(x => { x.def = x.id === t.dataset.id; }); save(); toast('Default address updated'); render(true); }
    else if (a === 'deladdr') {
      if (!confirm('Delete this address?')) return;
      const L = addrs(), i = L.findIndex(x => x.id === t.dataset.id), was = L[i] && L[i].def; L.splice(i, 1);
      if (was && L.length) L[0].def = true;
      save(); toast('Address deleted'); render(true);
    }
    else if (a === 'logout') { S.user = null; AT = 'profile'; AE = null; save(); hdr(); toast('You are logged out'); go('#/'); }
  });
  document.addEventListener('input', e => {
    if (e.target.dataset.act === 'q') { F.q = e.target.value; $('#grid').innerHTML = list(); }
    else if (e.target.dataset.act === 'cnt') $('#cc').textContent = e.target.value.length;
    fmt(e.target); if (e.target.dataset.t) validateField(e.target);
    if (e.target.name === 'nw') { const c = e.target.form && e.target.form.elements.cf; if (c && c.dataset.t) validateField(c); }
  });
  document.addEventListener('change', e => {
    const t = e.target;
    if (t.name === 'pcl') { $('#clName').textContent = t.value; return; }
    if (t.dataset.act === 'sort') { F.sort = t.value; $('#grid').innerHTML = list(); }
    else if (t.dataset.act === 'size') {
      const l = S.cart[+t.dataset.k]; l.size = +t.value;
      const dup = S.cart.find(i => i !== l && i.id === l.id && i.size === l.size && i.color === l.color);
      if (dup) { dup.q += l.q; S.cart.splice(+t.dataset.k, 1); }
      save(); render(true);
    } else if (t.name === 'addrSel') { $('#newaddr').hidden = t.value !== 'new'; }
    else if (t.name === 'method') { $('#pf-card').hidden = t.value !== 'card'; $('#pf-upi').hidden = t.value !== 'upi'; }
  });

  /* ---------- Validation (inline, per field) ---------- */
  const place = lbl => v => !v ? `Enter your ${lbl}.` : !/^[\p{L}][\p{L} .'-]{1,39}$/u.test(v) ? `Enter a valid ${lbl} (letters only).` : '';
  const RULES = {
    name: v => !v ? 'Enter your full name.' : !/^[\p{L}][\p{L} .'-]{1,49}$/u.test(v) ? 'Use 2–50 letters only. Numbers and symbols are not allowed.' : '',
    email: v => !v ? 'Enter your email address.' : (v.length > 100 || !RE.test(v)) ? 'Enter a valid email, like name@example.com.' : '',
    phone: v => !v ? 'Enter your mobile number.' : !/^\d{10}$/.test(v) ? 'Enter a valid 10-digit mobile number.' : '',
    req: v => v ? '' : 'This field is required.',
    newpw: v => !v ? 'Create a password.' : v.length < 8 ? 'Use at least 8 characters.' : (!/[A-Za-z]/.test(v) || !/\d/.test(v)) ? 'Include at least one letter and one number.' : v.length > 64 ? 'Use 64 characters or fewer.' : '',
    confirm: (v, f) => !v ? 'Confirm your new password.' : v !== f.elements.nw.value.trim() ? 'Passwords do not match.' : '',
    line: v => !v ? 'Enter your address.' : (v.length < 5 || v.length > 120) ? 'Enter your full address (5–120 characters).' : '',
    city: place('city'), state: place('state'),
    pin: v => !v ? 'Enter your PIN code.' : !/^[1-9]\d{5}$/.test(v) ? 'Enter a valid 6-digit PIN code.' : '',
    cnum: v => { const n = v.replace(/\s/g, ''); return !n ? 'Enter your card number.' : (!/^\d{13,19}$/.test(n) || !luhn(n)) ? 'Enter a valid card number.' : ''; },
    cexp: v => { if (!v) return 'Enter the expiry date.'; const x = /^(\d{2})\/(\d{2})$/.exec(v); if (!x || +x[1] < 1 || +x[1] > 12) return 'Use the format MM/YY.'; const n = new Date(), y = 2000 + +x[2]; return (y < n.getFullYear() || (y === n.getFullYear() && +x[1] < n.getMonth() + 1)) ? 'This card has expired.' : ''; },
    ccvv: v => !v ? 'Enter the CVV.' : !/^\d{3,4}$/.test(v) ? 'CVV is 3 or 4 digits.' : '',
    upi: v => !v ? 'Enter your UPI ID.' : !/^[\w.\-]{2,}@[a-zA-Z]{2,}$/.test(v) ? 'Enter a valid UPI ID, like name@bank.' : '',
    message: v => !v ? 'Write your message.' : v.length < 10 ? 'Please write at least 10 characters.' : '',
    order: v => v && !/^SS[A-Z0-9]{4,14}$/.test(v) ? 'Order numbers look like SSABC123.' : ''
  };
  const RMAP = { name: 'name', cname: 'name', email: 'email', phone: 'phone', line: 'line', city: 'city', state: 'state', pin: 'pin', cnum: 'cnum', cexp: 'cexp', ccvv: 'ccvv', upi: 'upi', message: 'message', order: 'order', cur: 'req', nw: 'newpw', cf: 'confirm' };
  const ruleOf = el => el.form && el.form.dataset.form ? (el.name === 'password' ? (el.form.dataset.form === 'signup' ? 'newpw' : 'req') : RMAP[el.name]) : null;
  function validateField(el) {
    const r = ruleOf(el); if (!r) return true;
    const msg = RULES[r](el.value.trim(), el.form), lb = el.closest('label'); if (!lb) return !msg;
    let er = $('.ferr', lb);
    if (!er) { er = document.createElement('em'); er.className = 'ferr'; er.id = 'e' + (++uid); lb.append(er); el.setAttribute('aria-describedby', er.id); }
    er.textContent = msg; lb.classList.toggle('invalid', !!msg); el.setAttribute('aria-invalid', !!msg);
    return !msg;
  }
  function validateForm(f) {
    let first = null;
    $$('input,textarea', f).forEach(el => { if (el.disabled || el.closest('[hidden]') || !ruleOf(el)) return; el.dataset.t = 1; if (!validateField(el) && !first) first = el; });
    if (first) first.focus();
    return !first;
  }
  function fmt(el) {
    const n = el.name; if (!el.form || !el.form.dataset.form) return;
    const dg = (m) => el.value.replace(/\D/g, '').slice(0, m);
    if (n === 'phone') el.value = dg(10);
    else if (n === 'pin') el.value = dg(6);
    else if (n === 'ccvv') el.value = dg(4);
    else if (n === 'cnum') el.value = dg(19).replace(/(\d{4})(?=\d)/g, '$1 ');
    else if (n === 'cexp') { const d = dg(4); el.value = d.length > 2 ? d.slice(0, 2) + '/' + d.slice(2) : d; }
    else if (n === 'order') el.value = el.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
  }
  document.addEventListener('focusout', e => { const el = e.target; if (el.form && ruleOf(el)) { el.dataset.t = 1; validateField(el); } });

  /* ---------- Smooth custom dropdowns (replace native selects) ---------- */
  const closeDD = () => $$('.dd.open').forEach(w => { w.classList.remove('open'); $('.dd-btn', w).setAttribute('aria-expanded', 'false'); });
  document.addEventListener('click', e => { if (!e.target.closest('.dd')) closeDD(); });
  function enhance(root) {
    $$('select', root).forEach(sel => {
      if (sel.dataset.dd) return; sel.dataset.dd = 1; sel.hidden = true;
      const lb = (sel.id && $(`label[for="${sel.id}"]`)) || sel.closest('label'), name = lb ? (lb.firstChild.textContent.trim() || lb.textContent.trim()) : 'Options';
      const w = document.createElement('div'); w.className = 'dd';
      w.innerHTML = `<button class="dd-btn" type="button" aria-haspopup="listbox" aria-expanded="false" aria-label="${esc(name)}"><span></span><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></button><ul class="dd-list" role="listbox">${[...sel.options].map((o, i) => `<li role="option" data-i="${i}">${esc(o.text)}</li>`).join('')}</ul>`;
      sel.after(w);
      const btn = $('.dd-btn', w), list = $('.dd-list', w), opts = $$('li', list); let act = 0, skip = false;
      const sync = () => { btn.firstElementChild.textContent = sel.options[sel.selectedIndex].text; opts.forEach((li, i) => { li.setAttribute('aria-selected', i === sel.selectedIndex); li.classList.toggle('sel', i === sel.selectedIndex); }); };
      const mark = i => { act = Math.max(0, Math.min(opts.length - 1, i)); opts.forEach((li, k) => li.classList.toggle('act', k === act)); opts[act].scrollIntoView({ block: 'nearest' }); };
      const open = () => { closeDD(); const r = btn.getBoundingClientRect(); w.classList.toggle('up', innerHeight - r.bottom < 250 && r.top > 250); w.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); mark(sel.selectedIndex); };
      const pick = i => { skip = true; setTimeout(() => { skip = false; }, 120); sel.selectedIndex = i; sync(); closeDD(); btn.focus(); sel.dispatchEvent(new Event('change', { bubbles: true })); };
      btn.addEventListener('click', () => { if (skip) return; w.classList.contains('open') ? closeDD() : open(); });
      list.addEventListener('click', e => { const li = e.target.closest('li'); if (li) pick(+li.dataset.i); });
      w.addEventListener('keydown', e => {
        const o = w.classList.contains('open');
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); o ? mark(act + (e.key === 'ArrowDown' ? 1 : -1)) : open(); }
        else if ((e.key === 'Enter' || e.key === ' ') && o) { e.preventDefault(); pick(act); }
        else if (e.key === 'Escape' && o) { e.stopPropagation(); closeDD(); }
        else if (e.key === 'Home' && o) { e.preventDefault(); mark(0); }
        else if (e.key === 'End' && o) { e.preventDefault(); mark(opts.length - 1); }
        else if (e.key === 'Tab') closeDD();
      });
      sync();
    });
  }

  /* ---------- Count-up numbers (About stats) ---------- */
  function countUp(root) {
    if (reduce || !('IntersectionObserver' in window)) return;
    const txt = (el, v) => { el.textContent = (el.dataset.pre || '') + v.toFixed(+el.dataset.dec || 0) + (el.dataset.suf || ''); };
    const run = el => {
      const end = +el.dataset.count, t0 = performance.now(), dur = 1900; el.classList.add('roll');
      const step = now => { const p = Math.min(1, (now - t0) / dur); txt(el, end * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(step); };
      requestAnimationFrame(step);
    };
    const io = new IntersectionObserver((es, o) => es.forEach(en => { if (en.isIntersecting) { run(en.target); o.unobserve(en.target); } }), { threshold: .6 });
    $$('[data-count]', root).forEach(el => { txt(el, 0); io.observe(el); });
  }

  /* ---------- Flying add-to-cart animation ---------- */
  function fly(src, a) {
    const cartEl = $('#cartLink'); if (!src || !a || reduce || !cartEl) return;
    const b = cartEl.getBoundingClientRect(), el = document.createElement('img');
    el.src = src; el.alt = ''; el.className = 'fly'; document.body.appendChild(el);
    const sx = a.left + a.width / 2 - 34, sy = a.top + a.height / 2 - 34, ex = b.left + b.width / 2 - 34, ey = b.top + b.height / 2 - 34, mx = (sx + ex) / 2, my = Math.min(sy, ey) - 80;
    el.animate([
      { transform: `translate(${sx}px,${sy}px) scale(1) rotate(0deg)`, opacity: 1 },
      { transform: `translate(${mx}px,${my}px) scale(.75) rotate(10deg)`, opacity: 1, offset: .45 },
      { transform: `translate(${ex}px,${ey}px) scale(.2) rotate(28deg)`, opacity: .6 }
    ], { duration: 850, easing: 'cubic-bezier(.45,0,.55,1)' }).finished.then(() => {
      el.remove(); cartEl.classList.remove('pop'); void cartEl.offsetWidth; cartEl.classList.add('pop');
    }).catch(() => el.remove());
  }

  /* ---------- Forms ---------- */
  const luhn = n => { let s = 0, d = false; for (let i = n.length - 1; i >= 0; i--) { let x = +n[i]; if (d) { x *= 2; if (x > 9) x -= 9; } s += x; d = !d; } return s % 10 === 0; };
  document.addEventListener('submit', async e => {
    const f = e.target, k = f.dataset.form; if (!k) return;
    e.preventDefault();
    const d = Object.fromEntries(new FormData(f)); Object.keys(d).forEach(x => { d[x] = String(d[x]).trim(); });
    const say = (t, ok) => { const m = $('.msg', f); m.textContent = t; m.className = 'msg ' + (ok ? 'ok' : 'err'); return false; };
    if (k === 'news') { if (!RE.test(d.email)) return say('Please enter a valid email address, like name@example.com.'); f.reset(); return say('Thanks for your interest. Email updates are not enabled yet.', true); }
    if (!validateForm(f)) return say('Please fix the highlighted fields.');
    if (k === 'review') {
      if (!me()) return say('Please log in to write a review.');
      if (!d.rating) return say('Please choose a star rating.');
      const pid = +f.dataset.pid; S.reviews = S.reviews || {};
      (S.reviews[pid] = S.reviews[pid] || []).unshift({ name: me().name, rating: +d.rating, text: d.message, date: new Date().toISOString() });
      save(); PT = 'reviews'; toast('Thanks for your review!'); return render(true);
    }
    if (k === 'contact') {
      if (!d.name || !RE.test(d.email)) return say('Please enter your name and a valid email address.');
      if (d.message.length < 10) return say('Please write a message of at least 10 characters.');
      const id = 'MSG' + Date.now().toString(36).toUpperCase();
      (S.msgs = S.msgs || []).push({ id, date: new Date().toISOString(), name: d.name, email: d.email, topic: d.topic, order: d.order, message: d.message });
      save(); CS = { id, email: d.email }; return render(true);
    }
    if (k === 'signup') {
      const em = d.email.toLowerCase();
      if (!d.name || !RE.test(em)) return say('Enter your name and a valid email.');
      if (d.password.length < 6) return say('Password must be at least 6 characters.');
      if (S.users[em]) return say('An account with this email already exists. Please log in.');
      S.users[em] = { name: d.name, email: em, h: await hash(d.password), phone: d.phone, addrs: [], since: new Date().toISOString() }; S.user = em;
    }
    if (k === 'login') {
      const u = S.users[d.email.toLowerCase()];
      if (!u || u.h !== await hash(d.password)) return say('Wrong email or password.');
      S.user = u.email;
    }
    if (k === 'signup' || k === 'login') {
      const n = S.next; S.next = null; save(); hdr(); toast(`Welcome, ${me().name.split(' ')[0]}!`); return go(n ? '#/' + n : '#/account');
    }
    if (k === 'profile') {
      if (!d.name) return say('Name is required.');
      if (d.phone && !/^\d{10}$/.test(d.phone)) return say('Phone must be 10 digits.');
      Object.assign(me(), { name: d.name, phone: d.phone }); save(); hdr(); return say('Profile saved.', true);
    }
    if (k === 'address') {
      if (!vAddr(d)) return say('Please fill name, a 10-digit phone, address, city, state and a 6-digit PIN code.');
      const L = addrs(), isDef = f.elements.def.checked || !L.length;
      const rec = { id: d.id || 'a' + Date.now().toString(36), label: d.label, name: d.name, phone: d.phone, line: d.line, city: d.city, state: d.state, pin: d.pin };
      const i = L.findIndex(a => a.id === rec.id);
      if (isDef) L.forEach(a => { a.def = false; });
      rec.def = isDef || (i >= 0 && L[i].def);
      if (i >= 0) L[i] = rec; else L.push(rec);
      if (!me().phone) me().phone = rec.phone;
      save(); AE = null; toast('Address saved'); return render(true);
    }
    if (k === 'password') {
      if (await hash(d.cur) !== me().h) return say('Current password is wrong.');
      if (d.nw.length < 6) return say('New password must be at least 6 characters.');
      if (d.nw !== d.cf) return say('New passwords do not match.');
      me().h = await hash(d.nw); save(); f.reset(); return say('Password updated.', true);
    }
    if (k === 'deliver') {
      const sel = d.addrSel || 'new';
      let ad = sel === 'new' ? null : addrs().find(a => a.id === sel);
      if (!ad) {
        if (!vAddr(d)) return say('Please fill name, a 10-digit phone, address, city, state and a 6-digit PIN code.');
        ad = { id: 'a' + Date.now().toString(36), label: d.label || 'Home', name: d.name, phone: d.phone, line: d.line, city: d.city, state: d.state, pin: d.pin };
      }
      S.co = { user: S.user, sel: ad.id && sel !== 'new' ? ad.id : 'new', ad, save: sel === 'new' && !!(f.elements.saveAddr && f.elements.saveAddr.checked) };
      save(); return go('#/payment');
    }
    if (k === 'pay') {
      const co = S.co, ad = co && co.ad; if (!ad) return go('#/checkout');
      const m = d.method, num = (d.cnum || '').replace(/\s/g, '');
      if (m === 'card') {
        const x = /^(\d{2})\/(\d{2})$/.exec(d.cexp || ''), now = new Date();
        if (!d.cname || !/^\d{13,19}$/.test(num) || !luhn(num)) return say('Enter the name on the card and a valid card number.');
        if (!x || +x[1] < 1 || +x[1] > 12 || 2000 + +x[2] < now.getFullYear() || (2000 + +x[2] === now.getFullYear() && +x[1] < now.getMonth() + 1)) return say('Enter a valid expiry date (MM/YY) that has not passed.');
        if (!/^\d{3,4}$/.test(d.ccvv || '')) return say('Enter the 3 or 4 digit CVV.');
      }
      if (m === 'upi' && !/^[\w.\-]{2,}@[a-zA-Z]{2,}$/.test(d.upi || '')) return say('Enter a valid UPI ID, like name@bank.');
      if (co.save) { const L = addrs(); ad.def = !L.length; L.push(ad); if (!me().phone) me().phone = ad.phone; }
      const t = totals();
      const o = { id: 'SS' + Date.now().toString(36).toUpperCase(), date: new Date().toISOString(), user: S.user, name: ad.name, phone: ad.phone, addr: `${ad.line}, ${ad.city}, ${ad.state} ${ad.pin}`,
        method: m === 'card' ? 'Card ending ' + num.slice(-4) : m === 'upi' ? 'UPI' : 'Cash on Delivery',
        items: S.cart.map(i => ({ id: i.id, size: i.size, color: i.color, q: i.q, name: P(i.id).name, price: P(i.id).price })), sub: t.sub, ship: t.ship, total: t.total };
      S.orders.unshift(o); S.cart = []; S.co = null; save(); hdr(); go('#/placed/' + o.id);
    }
  });

  /* ---------- Menu, tilt, start ---------- */
  addEventListener('scroll', () => $('#header').classList.toggle('scrolled', scrollY > 8), { passive: true });

  if (!reduce) {
    document.addEventListener('pointermove', e => {
      if (e.pointerType === 'touch') return;
      const c = e.target.closest('[data-tilt],#stage'); if (!c) return;
      const r = c.getBoundingClientRect(), big = c.id === 'stage', x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      c.style.setProperty('--ry', `${x * (big ? 16 : 8)}deg`); c.style.setProperty('--rx', `${-y * (big ? 10 : 8)}deg`);
    });
    document.addEventListener('pointerout', e => {
      const c = e.target.closest('[data-tilt],#stage');
      if (c && !c.contains(e.relatedTarget)) { c.style.setProperty('--rx', '0deg'); c.style.setProperty('--ry', '0deg'); }
    });
  }

  let swx = null;
  document.addEventListener('pointerdown', e => { swx = e.target.closest('.gmain') && !e.target.closest('button') ? e.clientX : null; });
  document.addEventListener('pointerup', e => { if (swx !== null && GV && Math.abs(e.clientX - swx) > 45) setView(GV.i + (e.clientX < swx ? 1 : -1)); swx = null; });

  $('#year').textContent = new Date().getFullYear();
  addEventListener('hashchange', () => { if (document.startViewTransition && !reduce) document.startViewTransition(() => render()); else render(); });
  render();
})();