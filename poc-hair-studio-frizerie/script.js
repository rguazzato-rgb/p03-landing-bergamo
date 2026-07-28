// Durata: LEGATO-A:P03
(function () {
  "use strict";

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
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    });
  });

  // ---------- Reveal on scroll ----------
  var revealEls = document.querySelectorAll(".reveal");
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

  // ---------- Form prenotazione (demo, nessun backend) ----------
  var form = document.getElementById("formPrenota");
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

  // ---------- Hero slider (crossfade foto reali) ----------
  var slides = document.querySelectorAll(".hero-slide");
  if (slides.length > 1) {
    var slideCorrente = 0;
    setInterval(function () {
      slides[slideCorrente].classList.remove("attiva");
      slideCorrente = (slideCorrente + 1) % slides.length;
      slides[slideCorrente].classList.add("attiva");
    }, 5000);
  }

  // ---------- Lightbox galleria AI ----------
  var lightbox = document.getElementById("lightbox");
  var lightboxImg = document.getElementById("lightboxImg");
  var lightboxCap = document.getElementById("lightboxCap");
  var lightboxChiudi = document.getElementById("lightboxChiudi");
  document.querySelectorAll(".masonry-item").forEach(function (item) {
    item.addEventListener("click", function () {
      var src = item.getAttribute("data-lightbox");
      var cap = item.getAttribute("data-cap") || "";
      if (!src || !lightbox || !lightboxImg) return;
      lightboxImg.src = src;
      lightboxImg.alt = cap;
      if (lightboxCap) lightboxCap.textContent = cap;
      lightbox.classList.add("aperto");
    });
  });
  function chiudiLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove("aperto");
    if (lightboxImg) lightboxImg.src = "";
  }
  if (lightboxChiudi) lightboxChiudi.addEventListener("click", chiudiLightbox);
  if (lightbox) {
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) chiudiLightbox();
    });
  }
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") chiudiLightbox();
  });

  // ---------- Cursore personalizzato (desktop, pointer fine) ----------
  var cursore = document.getElementById("cursoreCustom");
  if (cursore && window.matchMedia && window.matchMedia("(pointer: fine)").matches) {
    document.body.classList.add("cursore-attivo");
    document.addEventListener("mousemove", function (e) {
      cursore.style.left = e.clientX + "px";
      cursore.style.top = e.clientY + "px";
    });
    document.querySelectorAll("a, button, .masonry-item, .card").forEach(function (el) {
      el.addEventListener("mouseenter", function () { cursore.classList.add("hover"); });
      el.addEventListener("mouseleave", function () { cursore.classList.remove("hover"); });
    });
  }
})();
