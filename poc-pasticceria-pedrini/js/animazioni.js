// Durata: LEGATO-A:P03
(function () {
  var elementi = document.querySelectorAll('.reveal, .reveal-zoom, .reveal-side, .glassa-divider');

  elementi.forEach(function (el, i) {
    if (!el.style.getPropertyValue('--reveal-delay')) {
      var delay = (i % 4) * 0.09;
      el.style.setProperty('--reveal-delay', delay + 's');
    }
  });

  if (!('IntersectionObserver' in window)) {
    elementi.forEach(function (el) { el.classList.add('is-visible'); });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

  elementi.forEach(function (el) { observer.observe(el); });

  // Briciole/sprinkle fluttuanti nell'hero — generate una volta, leggere
  var wrap = document.querySelector('.crumbs');
  if (wrap) {
    var coloriBriciole = ['#e0862f', '#f3ead8', '#a9663a'];
    for (var j = 0; j < 14; j++) {
      var c = document.createElement('span');
      c.className = 'crumb';
      var size = 3 + Math.random() * 5;
      c.style.width = size + 'px';
      c.style.height = size + 'px';
      c.style.left = (Math.random() * 100) + '%';
      c.style.background = coloriBriciole[j % coloriBriciole.length];
      c.style.animationDelay = (Math.random() * 9) + 's';
      c.style.animationDuration = (7 + Math.random() * 5) + 's';
      wrap.appendChild(c);
    }
  }

  // Vapore che sale sopra le foto della caffetteria — generato una volta
  var vaporeWrap = document.querySelector('.vapore-wrap');
  if (vaporeWrap) {
    var posizioni = [10, 28, 50, 72, 88];
    posizioni.forEach(function (leftPct, i) {
      var v = document.createElement('span');
      v.className = 'vapore';
      v.style.left = leftPct + '%';
      v.style.animationDelay = (i * 1.6) + 's';
      v.style.animationDuration = (7 + Math.random() * 3) + 's';
      vaporeWrap.appendChild(v);
    });
  }

  // Parallax leggero sull'immagine hero — l'immagine scorre più lenta della pagina,
  // dà profondità al banco vetrina in apertura. Disattivato se l'utente preferisce meno movimento.
  var heroBg = document.querySelector('.hero-bg');
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (heroBg && !prefersReducedMotion) {
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var y = window.scrollY;
        if (y < window.innerHeight) {
          heroBg.style.transform = 'translateY(' + (y * 0.28) + 'px)';
        }
        ticking = false;
      });
    }, { passive: true });
  }
})();
