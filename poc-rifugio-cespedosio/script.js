// Durata: LEGATO-A:P03
(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---------- Header su scroll ----------
  var header = document.getElementById("site-header");
  function aggiornaHeader() {
    if (window.scrollY > 40) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }
  aggiornaHeader();
  window.addEventListener("scroll", aggiornaHeader, { passive: true });

  // ---------- Menu mobile ----------
  var menuToggle = document.getElementById("menu-toggle");
  if (menuToggle) {
    menuToggle.addEventListener("click", function () {
      header.classList.toggle("menu-aperto");
    });
    document.querySelectorAll(".nav-links a").forEach(function (link) {
      link.addEventListener("click", function () {
        header.classList.remove("menu-aperto");
      });
    });
  }

  // ---------- Parallax leggero sull'hero ----------
  var heroBg = document.getElementById("hero-bg");
  if (heroBg && !prefersReducedMotion) {
    window.addEventListener("scroll", function () {
      var y = window.scrollY;
      if (y < window.innerHeight) {
        heroBg.style.transform = "translateY(" + y * 0.35 + "px) scale(" + (1 + y * 0.0003) + ")";
      }
    }, { passive: true });
  }

  // ---------- Scroll reveal ----------
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !prefersReducedMotion) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visibile");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -60px 0px" });
    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("visibile"); });
  }

  // ---------- Tab menu cucina ----------
  var tabs = document.querySelectorAll(".menu-tab");
  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      var target = tab.getAttribute("data-tab");
      tabs.forEach(function (t) { t.classList.remove("attivo"); });
      tab.classList.add("attivo");
      document.querySelectorAll(".menu-panel").forEach(function (panel) {
        panel.classList.toggle("attivo", panel.getAttribute("data-panel") === target);
      });
    });
  });

  // ---------- Form prenotazione (demo, nessun backend) ----------
  var form = document.getElementById("form-prenota");
  var msg = document.getElementById("form-msg");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      msg.textContent = "Richiesta ricevuta! Questa è una demo: per prenotare davvero chiamaci al 349 647 2491 o scrivici su Facebook.";
      msg.classList.add("ok");
      form.reset();
    });
  }

  // ---------- Data minima nel campo data = oggi ----------
  var campoData = document.getElementById("data");
  if (campoData) {
    var oggi = new Date();
    var iso = oggi.getFullYear() + "-" + String(oggi.getMonth() + 1).padStart(2, "0") + "-" + String(oggi.getDate()).padStart(2, "0");
    campoData.setAttribute("min", iso);
  }
})();
