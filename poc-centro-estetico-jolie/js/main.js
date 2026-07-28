// Durata: LEGATO-A:P03
/* ============================================================
   Centro Estetico Jolie — script condiviso (home + pagine statiche)
   ============================================================ */

// --- Menu mobile ---
const btnMenu = document.querySelector("[data-menu]");
const nav = document.querySelector("[data-nav]");
if (btnMenu && nav) {
  btnMenu.addEventListener("click", () => nav.classList.toggle("aperto"));
  nav.addEventListener("click", (e) => {
    if (e.target.tagName === "A") nav.classList.remove("aperto");
  });
}

// --- Reveal on scroll ---
const osservatore = new IntersectionObserver(
  (voci) => voci.forEach((v) => { if (v.isIntersecting) { v.target.classList.add("visibile"); osservatore.unobserve(v.target); } }),
  { threshold: 0.12 }
);
document.querySelectorAll(".reveal").forEach((el) => osservatore.observe(el));

// --- Anno footer ---
const anno = document.getElementById("anno");
if (anno) anno.textContent = new Date().getFullYear();

/* ---------- Popolamento home (solo se i contenitori esistono) ---------- */

// Servizi in evidenza
const contTop = document.getElementById("servizi-top");
if (contTop) {
  const icone = { viso: "✨", corpo: "🤍", epilazione: "💫", makeup: "💄" };
  SERVIZI.filter((s) => s.top).forEach((s) => {
    const card = document.createElement("div");
    card.className = "card card-servizio reveal";
    card.innerHTML = `
      <div class="icona">${icone[s.cat]}</div>
      <h3>${s.nome}</h3>
      <p>${s.desc}</p>
      <div class="meta">
        <span class="prezzo">${prezzoTesto(s)}</span>
        <span class="durata">⏱ ${minutiATesto(s.durata)}</span>
      </div>
      <a class="btn btn-fantasma btn-piccolo" style="margin-top:0.8rem;" href="prenota.html?servizio=${s.id}">Prenota questo servizio</a>`;
    contTop.appendChild(card);
    osservatore.observe(card);
  });
}

// Listino completo
const contListino = document.getElementById("listino-completo");
if (contListino) {
  CATEGORIE.forEach((cat) => {
    const blocco = document.createElement("div");
    blocco.className = "listino-cat reveal";
    const righe = SERVIZI.filter((s) => s.cat === cat.id)
      .map((s) => `
        <div class="listino-riga">
          <span class="nome">${s.nome}</span>
          <span class="puntini"></span>
          <span class="durata">${minutiATesto(s.durata)}</span>
          <span class="prezzo">${prezzoTesto(s)}</span>
        </div>`).join("");
    blocco.innerHTML = `<h3>${cat.icona} ${cat.nome}</h3>${righe}`;
    contListino.appendChild(blocco);
    osservatore.observe(blocco);
  });
}

// Tabella orari
const contOrari = document.getElementById("tabella-orari");
if (contOrari) {
  SALONE.orariTesto.forEach(([g, o]) => {
    const tr = document.createElement("tr");
    if (o === "Chiuso") tr.className = "chiuso";
    tr.innerHTML = `<td>${g}</td><td>${o}</td>`;
    contOrari.appendChild(tr);
  });
}
