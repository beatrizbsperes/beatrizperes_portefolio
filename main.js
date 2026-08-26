/* =============================================================================
   Beatriz Peres — ePortfolio
   Theme toggle · mobile nav · scroll-spy · scroll progress · project filter ·
   reveal on scroll · current year
   ============================================================================= */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------- Colour theme ------------------------------ */
  var THEME_KEY = 'bp-theme';

  function readStoredTheme() {
    try { return localStorage.getItem(THEME_KEY); } catch (e) { return null; }
  }

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    var btn = document.getElementById('themeToggle');
    if (btn) {
      btn.setAttribute('aria-label',
        theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    }
  }

  // Light is the default for everyone. Dark only ever comes from the visitor
  // picking it with the toggle — the system preference is deliberately ignored.
  applyTheme(readStoredTheme() === 'dark' ? 'dark' : 'light');

  var themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      try { localStorage.setItem(THEME_KEY, next); } catch (e) { /* private mode */ }
    });
  }

  /* ---------------------------- Mobile navigation ------------------------- */
  var nav = document.getElementById('siteNav');
  var menuToggle = document.getElementById('menuToggle');

  function closeNav() {
    if (!nav) return;
    nav.classList.remove('is-open');
    if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
  }

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', String(open));
      menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeNav();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeNav();
    });
  }

  /* ------------------- Sticky header, progress bar, scroll-spy ------------ */
  var header = document.getElementById('siteHeader');
  var progress = document.getElementById('scrollProgress');
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.site-nav a'));
  var sections = navLinks
    .map(function (a) { return document.querySelector(a.getAttribute('href')); })
    .filter(Boolean);

  var ticking = false;

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;

    if (header) header.classList.toggle('is-stuck', y > 8);

    if (progress) {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
    }

    // Scroll-spy: the last section whose top has passed the header line wins.
    var line = y + (header ? header.offsetHeight : 0) + 24;
    var current = null;
    sections.forEach(function (section) {
      if (section.offsetTop <= line) current = section.id;
    });
    // At the very bottom, highlight the final section regardless of its offset.
    if (y + window.innerHeight >= document.documentElement.scrollHeight - 2 && sections.length) {
      current = sections[sections.length - 1].id;
    }
    navLinks.forEach(function (a) {
      a.classList.toggle('is-current', a.getAttribute('href') === '#' + current);
    });

    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(onScroll);
    }
  }, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  /* ---------------------------- Project filter ---------------------------- */
  var grid = document.getElementById('projectGrid');
  var emptyState = document.getElementById('emptyState');

  if (grid) {
    var cards = Array.prototype.slice.call(grid.querySelectorAll('.p-card'));
    var filters = Array.prototype.slice.call(document.querySelectorAll('.filter'));

    var allCount = document.querySelector('.filter[data-filter="all"] .count');
    if (allCount) allCount.textContent = '(' + cards.length + ')';

    filters.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var key = btn.dataset.filter;

        filters.forEach(function (f) { f.classList.toggle('is-active', f === btn); });

        var shown = 0;
        cards.forEach(function (card) {
          var cats = (card.dataset.cat || '').split(/\s+/);
          var match = key === 'all' || cats.indexOf(key) !== -1;
          card.classList.toggle('is-hidden', !match);
          if (match) shown++;
        });

        if (emptyState) emptyState.hidden = shown !== 0;
      });
    });
  }

  /* --------------------------- Reveal on scroll --------------------------- */
  if (!reduceMotion && 'IntersectionObserver' in window) {
    var targets = document.querySelectorAll(
      '.section-head, .exp-card, .p-card, .tl-item, .skill-block, .cred, ' +
      '.research-card, .feature-card, .trait-list li, .stat-band, .lang-table, .contact-card'
    );

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          el.classList.add('is-visible');
          observer.unobserve(el);
          // Drop the stagger delay once revealed, so hover transitions stay instant.
          setTimeout(function () { el.style.transitionDelay = ''; }, 900);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });

    targets.forEach(function (el, i) {
      el.classList.add('reveal');
      el.style.transitionDelay = (i % 4) * 60 + 'ms';
      observer.observe(el);
    });
  }

  /* ------------------------------ Footer year ----------------------------- */
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
