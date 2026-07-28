// Durata: LEGATO-A:P03
(function () {
  "use strict";

  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  // ---------- Menu mobile ----------
  var hamburger = document.getElementById("hamburgerBtn");
  var navLinks = document.getElementById("navLinks");
  if (hamburger && navLinks) {
    hamburger.addEventListener("click", function () {
      navLinks.classList.toggle("aperto");
    });
    navLinks.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navLinks.classList.remove("aperto");
      });
    });
  }

  // ---------- Smooth scroll per link con anchor ----------
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (e) {
      var id = link.getAttribute("href");
      if (id.length > 1) {
        var target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
        }
      }
    });
  });

  // ---------- Reveal on scroll (fade, drip, titoli incisi) ----------
  var revealEls = document.querySelectorAll(".reveal, .reveal-drip, .titolo-inciso");
  if ("IntersectionObserver" in window && revealEls.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visibile");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("visibile"); });
  }

  // ---------- Chip selezionabili (zona corpo) ----------
  var chipsZona = document.getElementById("chipsZona");
  if (chipsZona) {
    chipsZona.querySelectorAll(".chip").forEach(function (chip) {
      chip.addEventListener("click", function () {
        chip.classList.toggle("scelto");
      });
    });
  }

  // ---------- Toast ----------
  var toastEl = document.getElementById("toast");
  var toastTimer = null;
  function mostraToast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add("visibile");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toastEl.classList.remove("visibile");
    }, 3200);
  }

  // ---------- Form contatto (demo, nessun backend) ----------
  var form = document.getElementById("formContatto");
  var conferma = document.getElementById("confermaInvio");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var nome = document.getElementById("nome").value.trim();
      if (!nome) return;
      form.style.display = "none";
      if (conferma) conferma.classList.add("visibile");
      mostraToast("Richiesta inviata (demo) — grazie " + nome + "!");
    });
  }

  // ---------- Hero slider (autoplay + dots + parallax) ----------
  var heroSlider = document.getElementById("heroSlider");
  var heroSlides = heroSlider ? heroSlider.querySelectorAll(".hero-bg") : [];
  var heroDots = document.getElementById("heroDots");
  var dotEls = heroDots ? heroDots.querySelectorAll(".dot") : [];
  var slideIndex = 0;
  function mostraSlide(i) {
    heroSlides.forEach(function (s, idx) { s.classList.toggle("attiva", idx === i); });
    dotEls.forEach(function (d, idx) { d.classList.toggle("attivo", idx === i); });
  }
  if (heroSlides.length > 1 && !reducedMotion) {
    setInterval(function () {
      slideIndex = (slideIndex + 1) % heroSlides.length;
      mostraSlide(slideIndex);
    }, 5200);
  }

  var hero = document.getElementById("hero");
  if (hero && heroSlider && !reducedMotion) {
    window.addEventListener("scroll", function () {
      var rect = hero.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      var offset = rect.top * -0.12;
      heroSlider.style.transform = "translateY(" + offset + "px)";
    }, { passive: true });
  }

  // ---------- Lightbox (studio + gallery AI) ----------
  var lightbox = document.getElementById("lightbox");
  var lightboxImg = document.getElementById("lightboxImg");
  var lightboxCap = document.getElementById("lightboxCap");
  var lightboxChiudi = document.getElementById("lightboxChiudi");
  function apriLightbox(src, cap) {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = src;
    lightboxImg.alt = cap || "";
    if (lightboxCap) lightboxCap.textContent = cap || "";
    lightbox.classList.add("visibile");
  }
  function chiudiLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove("visibile");
    if (lightboxImg) lightboxImg.src = "";
  }
  document.querySelectorAll(".lightbox-apri").forEach(function (el) {
    el.addEventListener("click", function () {
      apriLightbox(el.getAttribute("data-full"), el.getAttribute("data-cap"));
    });
  });
  if (lightboxChiudi) lightboxChiudi.addEventListener("click", chiudiLightbox);
  if (lightbox) {
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) chiudiLightbox();
    });
  }
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") chiudiLightbox();
  });

  // ---------- Navbar shrink al scroll ----------
  var topbar = document.getElementById("topbar");
  if (topbar) {
    window.addEventListener("scroll", function () {
      topbar.classList.toggle("ridotta", window.scrollY > 40);
    }, { passive: true });
  }

  // ---------- Indicatore sezione attiva nel menu ----------
  var sezioniConLink = [];
  document.querySelectorAll(".nav-links a[href^='#']").forEach(function (link) {
    var id = link.getAttribute("href");
    var target = id.length > 1 ? document.querySelector(id) : null;
    if (target) sezioniConLink.push({ link: link, target: target });
  });
  if ("IntersectionObserver" in window && sezioniConLink.length) {
    var sezObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var match = sezioniConLink.find(function (s) { return s.target === entry.target; });
          if (!match) return;
          if (entry.isIntersecting) {
            sezioniConLink.forEach(function (s) { s.link.classList.remove("attivo"); });
            match.link.classList.add("attivo");
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );
    sezioniConLink.forEach(function (s) { sezObserver.observe(s.target); });
  }

  // ---------- Back to top ----------
  var backToTop = document.getElementById("backToTop");
  if (backToTop) {
    window.addEventListener("scroll", function () {
      backToTop.classList.toggle("visibile", window.scrollY > 700);
    }, { passive: true });
    backToTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
    });
  }

  // ---------- Cursore personalizzato (solo desktop, no reduced-motion) ----------
  var cursore = document.getElementById("cursoreCustom");
  if (cursore && finePointer && !reducedMotion) {
    document.addEventListener("mousemove", function (e) {
      cursore.classList.add("attivo");
      cursore.style.left = e.clientX + "px";
      cursore.style.top = e.clientY + "px";
    });
    document.addEventListener("mouseleave", function () { cursore.classList.remove("attivo"); });
    var hoverTargets = "a, button, .card, .galleria-item, .masonry-item, .lavoro-item, .chip";
    document.querySelectorAll(hoverTargets).forEach(function (el) {
      el.addEventListener("mouseenter", function () { cursore.classList.add("grande"); });
      el.addEventListener("mouseleave", function () { cursore.classList.remove("grande"); });
    });
  } else if (cursore) {
    cursore.style.display = "none";
  }

  // ---------- Particelle ambientali nella hero ----------
  var canvas = document.getElementById("particelle");
  if (canvas && hero && !reducedMotion) {
    var ctx = canvas.getContext("2d");
    var particelle = [];
    var NUM_PARTICELLE = 26;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);

    function ridimensiona() {
      canvas.width = hero.offsetWidth * dpr;
      canvas.height = hero.offsetHeight * dpr;
      canvas.style.width = hero.offsetWidth + "px";
      canvas.style.height = hero.offsetHeight + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function creaParticelle() {
      particelle = [];
      for (var i = 0; i < NUM_PARTICELLE; i++) {
        particelle.push({
          x: Math.random() * hero.offsetWidth,
          y: Math.random() * hero.offsetHeight,
          r: 0.6 + Math.random() * 1.8,
          vy: 0.15 + Math.random() * 0.35,
          vx: (Math.random() - 0.5) * 0.15,
          alfa: 0.08 + Math.random() * 0.22
        });
      }
    }

    function anima() {
      ctx.clearRect(0, 0, hero.offsetWidth, hero.offsetHeight);
      particelle.forEach(function (p) {
        p.y -= p.vy;
        p.x += p.vx;
        if (p.y < -5) { p.y = hero.offsetHeight + 5; p.x = Math.random() * hero.offsetWidth; }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(232, 161, 58, " + p.alfa + ")";
        ctx.fill();
      });
      requestAnimationFrame(anima);
    }

    ridimensiona();
    creaParticelle();
    requestAnimationFrame(anima);
    window.addEventListener("resize", function () {
      ridimensiona();
      creaParticelle();
    });
  }
})();
