// Durata: LEGATO-A:P03
(function () {
  "use strict";

  var header = document.getElementById("siteHeader");
  var nav = document.getElementById("mainNav");
  var navToggle = document.getElementById("navToggle");

  function onScroll() {
    if (window.scrollY > 40) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  navToggle.addEventListener("click", function () {
    var isOpen = nav.classList.toggle("open");
    navToggle.classList.toggle("open", isOpen);
    navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  nav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      nav.classList.remove("open");
      navToggle.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });

  // Scroll reveal
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  // Animated stat counters
  var counters = document.querySelectorAll(".stat-num");
  if (counters.length && "IntersectionObserver" in window) {
    var counted = new WeakSet();
    var countIo = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && !counted.has(entry.target)) {
            counted.add(entry.target);
            animateCount(entry.target);
            countIo.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach(function (el) { countIo.observe(el); });
  }

  // Lavori strip: senza questo, l'unico modo di scorrere una striscia
  // overflow-x:auto è un trackpad con swipe orizzontale o shift+rotellina —
  // un mouse normale con rotellina verticale resta bloccato. Frecce, drag col
  // mouse e conversione verticale->orizzontale della rotellina coprono tutti i casi.
  var lavoriWrap = document.querySelector(".lavori-strip-wrap");
  var lavoriStrip = document.querySelector(".lavori-strip");
  if (lavoriWrap && lavoriStrip) {
    var prevBtn = lavoriWrap.querySelector(".lavori-nav-prev");
    var nextBtn = lavoriWrap.querySelector(".lavori-nav-next");

    function updateEdges() {
      var max = lavoriStrip.scrollWidth - lavoriStrip.clientWidth;
      lavoriWrap.classList.toggle("at-start", lavoriStrip.scrollLeft <= 4);
      lavoriWrap.classList.toggle("at-end", lavoriStrip.scrollLeft >= max - 4);
    }
    updateEdges();
    lavoriStrip.addEventListener("scroll", updateEdges, { passive: true });
    window.addEventListener("resize", updateEdges);

    function scrollByCard(dir) {
      var card = lavoriStrip.querySelector(".lavoro-card");
      var step = card ? card.getBoundingClientRect().width + 18 : lavoriStrip.clientWidth * 0.8;
      lavoriStrip.scrollBy({ left: dir * step, behavior: "smooth" });
    }
    if (prevBtn) prevBtn.addEventListener("click", function () { scrollByCard(-1); });
    if (nextBtn) nextBtn.addEventListener("click", function () { scrollByCard(1); });

    // Rotellina verticale -> scroll orizzontale (solo quando il gesto è
    // prevalentemente verticale, cioè un mouse normale: un trackpad che manda
    // già deltaX lo lasciamo passare senza interferire). scroll-snap-type
    // manda indietro ogni assegnazione istantanea di scrollLeft che non cade
    // esattamente su una card — va disattivato durante lo scroll a rotellina
    // e riattivato solo quando l'utente smette (altrimenti la striscia sembra
    // bloccata: ogni tick di rotellina veniva annullato dallo snap-back).
    var wheelIdleTimer = null;
    lavoriStrip.addEventListener("wheel", function (e) {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        lavoriStrip.classList.add("is-dragging");
        lavoriStrip.scrollLeft += e.deltaY;
        e.preventDefault();
        clearTimeout(wheelIdleTimer);
        wheelIdleTimer = setTimeout(function () {
          lavoriStrip.classList.remove("is-dragging");
        }, 150);
      }
    }, { passive: false });

    // Drag-to-scroll col mouse (i trackpad/touch funzionano già di loro).
    var isDown = false, dragStartX = 0, startScroll = 0, moved = false;
    lavoriStrip.addEventListener("pointerdown", function (e) {
      if (e.pointerType === "touch") return;
      isDown = true; moved = false;
      dragStartX = e.clientX;
      startScroll = lavoriStrip.scrollLeft;
      lavoriStrip.classList.add("is-dragging");
    });
    window.addEventListener("pointermove", function (e) {
      if (!isDown) return;
      var dx = e.clientX - dragStartX;
      if (Math.abs(dx) > 3) moved = true;
      lavoriStrip.scrollLeft = startScroll - dx;
    });
    function stopDrag() {
      if (!isDown) return;
      isDown = false;
      lavoriStrip.classList.remove("is-dragging");
    }
    window.addEventListener("pointerup", stopDrag);
    window.addEventListener("pointercancel", stopDrag);
    // Evita che il drag venga interpretato anche come click sulla card sotto il cursore.
    lavoriStrip.addEventListener("click", function (e) {
      if (moved) { e.preventDefault(); e.stopPropagation(); }
    }, true);
  }

  function animateCount(el) {
    var target = parseInt(el.getAttribute("data-count"), 10) || 0;
    var duration = 900;
    var start = null;

    function step(ts) {
      if (start === null) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        el.textContent = target;
      }
    }
    window.requestAnimationFrame(step);
  }
})();
