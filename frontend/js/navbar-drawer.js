/**
 * YatraSaathi — Mobile Navigation Drawer
 * Handles hamburger toggle, drawer open/close, overlay click-to-close,
 * keyboard accessibility (Escape), and focus trapping.
 */
(function () {
  'use strict';

  const hamburger = document.getElementById('nav-hamburger');
  const drawer    = document.getElementById('mobile-drawer');
  const overlay   = document.getElementById('mobile-drawer-overlay');
  const closeBtn  = document.getElementById('mobile-drawer-close');

  if (!hamburger || !drawer) return;

  /* ── Helpers ─────────────────────────────────────────────── */
  function openDrawer() {
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.classList.add('drawer-open');
    // Move focus into the drawer
    if (closeBtn) closeBtn.focus();
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('drawer-open');
    // Return focus to hamburger
    hamburger.focus();
  }

  /* ── Event Listeners ─────────────────────────────────────── */
  hamburger.addEventListener('click', function () {
    const isOpen = drawer.classList.contains('open');
    isOpen ? closeDrawer() : openDrawer();
  });

  // Close on overlay click
  if (overlay) {
    overlay.addEventListener('click', closeDrawer);
  }

  // Close button
  if (closeBtn) {
    closeBtn.addEventListener('click', closeDrawer);
  }

  // Close on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      closeDrawer();
    }
  });

  // Close drawer when a nav link is clicked (SPA-friendly)
  const navLinks = drawer.querySelectorAll('.mobile-nav-link');
  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      // Small delay so the click registers before close animation
      setTimeout(closeDrawer, 80);
    });
  });

  // Close drawer on resize to desktop
  let resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      if (window.innerWidth >= 768 && drawer.classList.contains('open')) {
        closeDrawer();
      }
    }, 100);
  });

  /* ── Focus Trap ──────────────────────────────────────────── */
  drawer.addEventListener('keydown', function (e) {
    if (e.key !== 'Tab') return;

    const focusable = drawer.querySelectorAll(
      'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last  = focusable[focusable.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });
})();
