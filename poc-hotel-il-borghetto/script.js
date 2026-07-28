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

  // ---------- Form richiesta disponibilità (demo, nessun backend) ----------
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

  // ---------- Check-in minimo = oggi, check-out minimo = check-in ----------
  var checkinInput = document.getElementById("checkin");
  var checkoutInput = document.getElementById("checkout");
  if (checkinInput) {
    var oggi = new Date();
    var yyyy = oggi.getFullYear();
    var mm = String(oggi.getMonth() + 1).padStart(2, "0");
    var dd = String(oggi.getDate()).padStart(2, "0");
    var minData = yyyy + "-" + mm + "-" + dd;
    checkinInput.min = minData;
    if (checkoutInput) checkoutInput.min = minData;
    checkinInput.addEventListener("change", function () {
      if (checkoutInput) checkoutInput.min = checkinInput.value || minData;
    });
  }
})();
