/* ── CURSOR ── */
const cursorEl = document.getElementById('cursor');
const cursorLabel = document.getElementById('cursor-label');
let cx = 0, cy = 0;
document.addEventListener('mousemove', e => {
  cx = e.clientX; cy = e.clientY;
  cursorEl.style.left = cx + 'px';
  cursorEl.style.top  = cy + 'px';
});
document.querySelectorAll('[data-cursor]').forEach(el => {
  el.addEventListener('mouseenter', () => {
    const lbl = el.dataset.cursor;
    cursorLabel.textContent = lbl;
    cursorEl.style.width = '90px';
    cursorEl.style.height = '90px';
  });
  el.addEventListener('mouseleave', () => {
    cursorLabel.textContent = '';
    cursorEl.style.width = '44px';
    cursorEl.style.height = '44px';
  });
});

/* ── NAV SCROLL ── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* ── HERO PARALLAX ── */
const hbg = document.getElementById('hbg');
window.addEventListener('scroll', () => {
  if (window.scrollY < window.innerHeight * 1.1) {
    hbg.style.transform = 'translateY(' + (window.scrollY * 0.3) + 'px)';
  }
}, { passive: true });

/* ── FLOATING PARTICLES ── */
const parts = document.getElementById('hparts');
for (let i = 0; i < 8; i++) {
  const p = document.createElement('div');
  p.className = 'hpart';
  const sz = 1.5 + Math.random() * 2;
  Object.assign(p.style, {
    width: sz + 'px', height: sz + 'px',
    left: (8 + i * 12) + '%',
    top: (18 + (i % 3) * 22) + '%',
    opacity: 0.1 + i * 0.035,
    animationDelay: (i * 0.7) + 's',
    animationDuration: (5 + i * 0.6) + 's',
  });
  parts.appendChild(p);
}

/* ── 21ST.DEV SCROLL ANIMATION ── */
const scbox = document.getElementById('scbox');
const ss1   = document.getElementById('ss1');
const ss2   = document.getElementById('ss2');

function updateScrollAnim() {
  if (!scbox || !ss1 || !ss2) return;
  const rect = scbox.getBoundingClientRect();
  const boxH = scbox.offsetHeight;
  const raw  = -rect.top / (boxH - window.innerHeight);
  const p    = Math.max(0, Math.min(1, raw));

  // S1: scales 1→0.82, rotates 0→-5°, dims out
  const sc1 = 1 - p * 0.18;
  const rt1 = -p * 5;
  const op1 = 1 - p * 0.65;
  ss1.style.transform = `scale(${sc1}) rotate(${rt1}deg)`;
  ss1.style.opacity   = op1;

  // S2: scales 0.82→1, rotates 5→0°
  const sc2 = 0.82 + p * 0.18;
  const rt2 = 5 - p * 5;
  ss2.style.transform = `scale(${sc2}) rotate(${rt2}deg)`;
}
window.addEventListener('scroll', updateScrollAnim, { passive: true });
updateScrollAnim();

/* ── SCROLL REVEAL ── */
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('on'); obs.unobserve(e.target); }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -32px 0px' });
document.querySelectorAll('.r').forEach(el => obs.observe(el));

/* ── 3D CARD TILT ── */
document.querySelectorAll('[data-tilt]').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width  - 0.5;
    const y = (e.clientY - r.top)  / r.height - 0.5;
    card.style.transform = `perspective(900px) rotateY(${x * 7}deg) rotateX(${-y * 7}deg) scale3d(1.02,1.02,1.02)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(900px) rotateY(0deg) rotateX(0deg) scale3d(1,1,1)';
    card.style.transition = 'transform .5s cubic-bezier(.16,1,.3,1)';
  });
  card.addEventListener('mouseenter', () => {
    card.style.transition = 'transform .15s ease';
  });
});

/* ══ LANGUAGE SWITCHER ══ */
let currentLang = 'en';

function setLang(lang) {
  currentLang = lang;
  
  // Update all translatable elements
  document.querySelectorAll('.t').forEach(el => {
    const txt = el.dataset[lang];
    if (txt !== undefined) {
      el.innerHTML = txt;
    }
  });

  // Update nav active states
  document.getElementById('btnEN').classList.toggle('active', lang === 'en');
  document.getElementById('btnID').classList.toggle('active', lang === 'id');

  // Persist choice
  try { localStorage.setItem('db_lang', lang); } catch(e) {}
  
  // Update html lang attribute
  document.documentElement.lang = lang === 'id' ? 'id' : 'en';
}

// ── Ethereal Frames gallery translations (inline style elements) ──
const efTranslations = {
  en: {
    eyebrow: 'Ethereal Frames',
    title: 'Fashion <em>Editorial</em><br>Series',
    seriesLabel: 'Series',
    quote: '"Silence has its own kind of beauty."',
    desc: 'An intimate editorial series exploring stillness, vulnerability, and the quiet power of a single frame.',
    catLabel: 'Category',
    catVal: 'Fashion · Portrait',
    p1: 'Portrait · Editorial',
    p2: 'Portrait · Beauty',
    p3: 'Portrait · Fashion',
    p4: 'Portrait · Editorial',
  },
  id: {
    eyebrow: 'Bingkai Etherial',
    title: 'Seri <em>Editorial</em><br>Fashion',
    seriesLabel: 'Seri',
    quote: '"Keheningan memiliki keindahannya sendiri."',
    desc: 'Seri editorial intim yang mengeksplorasi ketenangan, kerentanan, dan kekuatan hening dari satu bingkai.',
    catLabel: 'Kategori',
    catVal: 'Fashion · Potret',
    p1: 'Potret · Editorial',
    p2: 'Potret · Kecantikan',
    p3: 'Potret · Fashion',
    p4: 'Potret · Editorial',
  }
};

function updateEFGallery(lang) {
  const t = efTranslations[lang];
  const ef = document.getElementById('ethereal-frames');
  if (!ef) return;
  const eyebrow = ef.querySelector('.slbl');
  const title   = ef.querySelector('.sttl');
  if (eyebrow) eyebrow.innerHTML = t.eyebrow;
  if (title)   title.innerHTML   = t.title;
  
  // Text card inside gallery
  const spans = ef.querySelectorAll('span[style]');
  spans.forEach(s => {
    const txt = s.textContent.trim();
    if (txt === 'Series' || txt === 'Seri') s.textContent = t.seriesLabel;
    if (txt === 'Category' || txt === 'Kategori') s.textContent = t.catLabel;
    if (txt === 'Fashion · Portrait' || txt === 'Fashion · Potret') s.textContent = t.catVal;
  });
  const blockquote = ef.querySelector('blockquote');
  if (blockquote) blockquote.textContent = t.quote;
  const paras = ef.querySelectorAll('p[style]');
  paras.forEach(p => {
    if (p.textContent.includes('intimate') || p.textContent.includes('intim')) {
      p.textContent = t.desc;
    }
  });
  // Photo categories
  const wcats = ef.querySelectorAll('.wcat');
  const catKeys = ['p1','p2','p3','p4'];
  wcats.forEach((wc, i) => { if (catKeys[i]) wc.innerHTML = t[catKeys[i]]; });
}

// Wrap original setLang to also update EF gallery
const _origSetLang = setLang;
function setLang(lang) {
  currentLang = lang;
  document.querySelectorAll('.t').forEach(el => {
    const txt = el.dataset[lang];
    if (txt !== undefined) el.innerHTML = txt;
  });
  document.getElementById('btnEN').classList.toggle('active', lang === 'en');
  document.getElementById('btnID').classList.toggle('active', lang === 'id');
  updateEFGallery(lang);
  try { localStorage.setItem('db_lang', lang); } catch(e) {}
  document.documentElement.lang = lang === 'id' ? 'id' : 'en';
}

// On load: restore saved language preference
(function() {
  try {
    const saved = localStorage.getItem('db_lang');
    if (saved && saved !== 'en') {
      setTimeout(() => setLang(saved), 80);
    }
  } catch(e) {}
})();


/* ══════════════════════════════════════════════
   ALBUM 3D MODAL SYSTEM
   ══════════════════════════════════════════════ */
const ALBUMS = {
  ethereal: {
    title: 'Ethereal Frames',
    eyebrow: 'Fashion Editorial Series',
    titleId: 'Ethereal Frames',
    eyebrowId: 'Seri Editorial Fashion',
    items: [{"src": "assets/image6.jpg", "cap": "Ethereal I \u2014 Portrait \u00b7 Editorial"}, {"src": "assets/image7.jpg", "cap": "Ethereal II \u2014 Portrait \u00b7 Beauty"}, {"src": "assets/image8.jpg", "cap": "Ethereal III \u2014 Portrait \u00b7 Fashion"}, {"src": "assets/image9.jpg", "cap": "Ethereal IV \u2014 Portrait \u00b7 Editorial"}]
  },
  monochrome: {
    title: 'Monochrome Muse',
    eyebrow: 'Portrait Noir Series',
    titleId: 'Monochrome Muse',
    eyebrowId: 'Seri Potret Noir',
    items: [{"src": "assets/image4.jpg", "cap": "Noir I \u2014 Portrait \u00b7 Studio"}, {"src": "assets/image10.jpg", "cap": "Noir II \u2014 Portrait \u00b7 Light Study"}, {"src": "assets/image11.jpg", "cap": "Noir III \u2014 Portrait \u00b7 Close-Up"}, {"src": "assets/image12.jpg", "cap": "Noir IV \u2014 Portrait \u00b7 Shadow Play"}, {"src": "assets/image13.jpg", "cap": "Noir V \u2014 Portrait \u00b7 Editorial"}]
  }
};

let currentAlbumKey = null;
let currentIndex = 0;
let albumAutoTimer = null;

function buildAlbumStage(key) {
  const album = ALBUMS[key];
  const stage = document.getElementById('album3DStage');
  stage.innerHTML = '';
  album.items.forEach((item, i) => {
    const el = document.createElement('div');
    el.className = 'album-3d-item';
    el.innerHTML = `<img src="${item.src}" alt="${item.cap}" loading="lazy"/><div class="album-3d-caption">${item.cap}</div>`;
    stage.appendChild(el);
  });
}

function render3DPositions() {
  const album = ALBUMS[currentAlbumKey];
  const items = document.querySelectorAll('.album-3d-item');
  const total = album.items.length;
  const isMobile = window.innerWidth <= 768;
  const angleStep = isMobile ? 28 : 38;
  const depthStep = isMobile ? 140 : 220;
  const xStep = isMobile ? 40 : 70;

  items.forEach((el, i) => {
    let offset = i - currentIndex;
    // wrap offset to shortest path
    if (offset > total / 2) offset -= total;
    if (offset < -total / 2) offset += total;

    const absOff = Math.abs(offset);
    const rotateY = offset * -angleStep;
    const translateX = offset * xStep * 3.2;
    const translateZ = -absOff * depthStep;
    const scale = Math.max(0.62, 1 - absOff * 0.16);
    const opacity = absOff > 2.2 ? 0 : Math.max(0.18, 1 - absOff * 0.42);
    const zIndex = 100 - Math.round(absOff * 10);
    const blur = absOff === 0 ? 0 : Math.min(absOff * 2.2, 6);

    el.style.transform = `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`;
    el.style.opacity = opacity;
    el.style.zIndex = zIndex;
    el.style.filter = `brightness(${absOff === 0 ? 1 : 0.55}) blur(${blur}px)`;
    el.classList.toggle('is-active', offset === 0);
    el.onclick = (absOff === 0) ? null : (() => { currentIndex = i; render3DPositions(); updateAlbumMeta(); });
    el.style.cursor = absOff === 0 ? 'default' : 'pointer';
    el.style.pointerEvents = absOff > 2.2 ? 'none' : 'auto';
  });
}

function updateAlbumMeta() {
  const album = ALBUMS[currentAlbumKey];
  document.getElementById('albumCounter').textContent = `${currentIndex + 1} / ${album.items.length}`;
}

function openAlbum(key) {
  currentAlbumKey = key;
  currentIndex = 0;
  const album = ALBUMS[key];
  const lang = (typeof currentLang !== 'undefined') ? currentLang : 'en';
  document.getElementById('albumTitle').textContent = lang === 'id' ? album.titleId : album.title;
  document.getElementById('albumEyebrow').textContent = lang === 'id' ? album.eyebrowId : album.eyebrow;
  buildAlbumStage(key);
  document.getElementById('albumModal').classList.add('open');
  document.body.style.overflow = 'hidden';
  requestAnimationFrame(() => {
    render3DPositions();
    updateAlbumMeta();
  });
}

function closeAlbum() {
  document.getElementById('albumModal').classList.remove('open');
  document.body.style.overflow = '';
  currentAlbumKey = null;
}

function albumNext() {
  if (!currentAlbumKey) return;
  const total = ALBUMS[currentAlbumKey].items.length;
  currentIndex = (currentIndex + 1) % total;
  render3DPositions();
  updateAlbumMeta();
}

function albumPrev() {
  if (!currentAlbumKey) return;
  const total = ALBUMS[currentAlbumKey].items.length;
  currentIndex = (currentIndex - 1 + total) % total;
  render3DPositions();
  updateAlbumMeta();
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  if (!document.getElementById('albumModal').classList.contains('open')) return;
  if (e.key === 'Escape') closeAlbum();
  if (e.key === 'ArrowRight') albumNext();
  if (e.key === 'ArrowLeft') albumPrev();
});

// Swipe support for touch devices
let touchStartX = 0;
const stageEl = document.getElementById('album3DStage');
if (stageEl) {
  stageEl.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, {passive:true});
  stageEl.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) { dx < 0 ? albumNext() : albumPrev(); }
  }, {passive:true});
}

// Reposition on resize (responsive 3D depth)
window.addEventListener('resize', () => {
  if (currentAlbumKey) render3DPositions();
});