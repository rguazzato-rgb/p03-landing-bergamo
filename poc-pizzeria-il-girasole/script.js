// Durata: LEGATO-A:P03
/**
 * Pizzeria Il Girasole - Dynamic Interactions Script
 * Controls mobile navigation, category scroll linking, and visual enhancements.
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initCategoryScroller();
  initScrollReveal();
});

/**
 * 1. Mobile Navigation Menu Toggle
 */
function initMobileNav() {
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const toggleIcon = document.getElementById('toggle-icon');

  if (!mobileToggle || !navMenu || !toggleIcon) return;

  mobileToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    
    // Toggle Icon Class between Hamburger and X Close
    if (isOpen) {
      toggleIcon.classList.remove('fa-bars');
      toggleIcon.classList.add('fa-xmark');
      document.body.style.overflow = 'hidden'; // Lock background scrolling
    } else {
      toggleIcon.classList.remove('fa-xmark');
      toggleIcon.classList.add('fa-bars');
      document.body.style.overflow = ''; // Restore scrolling
    }
  });

  // Close mobile nav when clicking a link
  const navLinks = navMenu.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      toggleIcon.classList.remove('fa-xmark');
      toggleIcon.classList.add('fa-bars');
      document.body.style.overflow = '';
    });
  });
}

/**
 * 2. Digital Menu Category Filters and Scroll Linking
 * Handles clicking on the chips to smooth scroll,
 * and tracks scrolling to update the active chip.
 */
function initCategoryScroller() {
  const filterChips = document.querySelectorAll('.btn-filter-chip');
  const categories = document.querySelectorAll('.menu-category-anchor');
  const filterBar = document.getElementById('category-filter-bar');

  if (filterChips.length === 0 || categories.length === 0) return;

  // Click handler to smooth scroll to selected section
  filterChips.forEach(chip => {
    chip.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = chip.getAttribute('data-target');
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        // Calculate offset to accommodate sticky header (80px) and categories padding (20px)
        const headerOffset = 110;
        const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = elementPosition - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });

        // Set active immediately
        filterChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
      }
    });
  });

  // Scroll spy linking using IntersectionObserver
  const observerOptions = {
    root: null,
    rootMargin: '-120px 0px -60% 0px', // Matches the active viewing area
    threshold: 0
  };

  const observerCallback = (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        const activeChip = document.querySelector(`.btn-filter-chip[data-target="${id}"]`);

        if (activeChip) {
          filterChips.forEach(chip => chip.classList.remove('active'));
          activeChip.classList.add('active');

          // Auto-scroll the filter bar if chip overflows horizontally on mobile
          if (filterBar) {
            const barRect = filterBar.getBoundingClientRect();
            const chipRect = activeChip.getBoundingClientRect();

            if (chipRect.left < barRect.left) {
              filterBar.scrollBy({ left: chipRect.left - barRect.left - 16, behavior: 'smooth' });
            } else if (chipRect.right > barRect.right) {
              filterBar.scrollBy({ left: chipRect.right - barRect.right + 16, behavior: 'smooth' });
            }
          }
        }
      }
    });
  };

  const observer = new IntersectionObserver(observerCallback, observerOptions);
  categories.forEach(category => observer.observe(category));
}

/**
 * 3. Scroll Reveal
 * Anima sezioni e card in entrata (opacity 0->1 + translateY 20px->0) con
 * delay progressivo per le card. Progressive enhancement: se IntersectionObserver
 * non e' disponibile o l'utente preferisce ridurre le animazioni, non nasconde
 * nulla (la classe .reveal viene aggiunta solo qui, via JS).
 */
function initScrollReveal() {
  if (!('IntersectionObserver' in window)) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const targets = [];

  // Card dentro le griglie: reveal con stagger progressivo (max 4 step)
  const grids = document.querySelectorAll(
    '.pizza-grid, .promo-grid, .photo-gallery-grid, .values-grid, .gallery-grid'
  );
  grids.forEach(grid => {
    Array.from(grid.children).forEach((item, i) => {
      item.classList.add('reveal');
      item.style.transitionDelay = ((i % 4) * 90) + 'ms';
      targets.push(item);
    });
  });

  // Intestazioni di sezione: reveal semplice
  document.querySelectorAll('.section-header').forEach(el => {
    el.classList.add('reveal');
    targets.push(el);
  });

  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  targets.forEach(el => revealObserver.observe(el));
}
