// Durata: LEGATO-A:P03

// Menu mobile
const menuToggle = document.getElementById("menuToggle");
const navPrincipale = document.getElementById("navPrincipale");
if (menuToggle && navPrincipale) {
  menuToggle.addEventListener("click", () => {
    const aperto = navPrincipale.classList.toggle("aperto");
    menuToggle.setAttribute("aria-expanded", String(aperto));
  });
  navPrincipale.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navPrincipale.classList.remove("aperto");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

// Scroll reveal (rispetta prefers-reduced-motion tramite CSS, qui solo aggiunta classe)
const revealEls = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window && revealEls.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visibile");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  revealEls.forEach((el) => observer.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add("visibile"));
}

// Form iscrizione — demo senza backend
const formIscrizione = document.getElementById("formIscrizione");
const formEsito = document.getElementById("formEsito");
if (formIscrizione && formEsito) {
  formIscrizione.addEventListener("submit", (e) => {
    e.preventDefault();
    formEsito.textContent = "Grazie! Ti contatteremo presto al numero indicato per fissare la tua lezione di prova.";
    formEsito.classList.add("mostra", "ok");
    formIscrizione.reset();
  });
}

// Header: leggero cambio sfondo allo scroll
const header = document.querySelector(".site-header");
if (header) {
  window.addEventListener("scroll", () => {
    header.style.boxShadow = window.scrollY > 20 ? "0 10px 30px -20px rgba(0,0,0,0.6)" : "none";
  });
}
