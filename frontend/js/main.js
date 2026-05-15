/* YatraSaathi — main.js (Shared across all pages) */

// ── Nav scroll effect ──────────────────────────────────────
(function () {
  const nav = document.getElementById('mainNav');
  if (!nav) return;
  const handler = () => nav.classList.toggle('scrolled', window.scrollY > 40);
  handler();
  window.addEventListener('scroll', handler, { passive: true });
})();

// ── Mobile hamburger ───────────────────────────────────────
(function () {
  const btn = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  if (!btn || !mobileNav) return;
  btn.addEventListener('click', () => {
    btn.classList.toggle('open');
    mobileNav.classList.toggle('open');
  });
  // Close on link click
  mobileNav.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => {
      btn.classList.remove('open');
      mobileNav.classList.remove('open');
    })
  );
})();

// ── Scroll reveal ──────────────────────────────────────────
(function () {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const io = new IntersectionObserver(
    (entries) => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } }),
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );
  els.forEach(el => io.observe(el));
})();

// ── Counter animation ──────────────────────────────────────
function animateCounter(el, target, duration = 2000) {
  let start = null;
  const step = ts => {
    if (!start) start = ts;
    const progress = Math.min((ts - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(ease * target).toLocaleString();
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

// ── Toast utility ──────────────────────────────────────────
window.showToast = function (msg, type = 'info', icon = '') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const iconMap = { info: '💡', success: '✅', error: '❌', warning: '⚠️' };
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>${icon || iconMap[type]}</span><span>${msg}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
};

// ── Active nav link ────────────────────────────────────────
(function () {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path || (path === 'index.html' && href === 'index.html')) {
      a.classList.add('active');
    } else {
      a.classList.remove('active');
    }
  });
})();

// ── Progress bar fill on scroll ────────────────────────────
(function () {
  const bars = document.querySelectorAll('.progress-fill[data-width]');
  if (!bars.length) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.width = e.target.dataset.width;
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  bars.forEach(b => { b.style.width = '0'; io.observe(b); });
})();

// ── Chip toggle (multi-select) ─────────────────────────────
document.querySelectorAll('.chips-row').forEach(row => {
  row.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => chip.classList.toggle('selected'));
  });
});

// ── Typing text loop ───────────────────────────────────────
(function () {
  const el = document.querySelector('.typing-text');
  if (!el) return;
  const phrases = [
    'Generating itinerary...',
    'Analyzing weather...',
    'Optimizing routes...',
    'Finding hidden gems...',
    'Calculating budget...',
  ];
  let i = 0, ti = 0, dir = 1;
  function tick() {
    const phrase = phrases[i];
    if (dir === 1) {
      ti++;
      el.textContent = phrase.slice(0, ti);
      if (ti === phrase.length) { dir = -1; setTimeout(tick, 1500); return; }
    } else {
      ti--;
      el.textContent = phrase.slice(0, ti);
      if (ti === 0) { dir = 1; i = (i + 1) % phrases.length; }
    }
    setTimeout(tick, dir === 1 ? 60 : 30);
  }
  tick();
})();
