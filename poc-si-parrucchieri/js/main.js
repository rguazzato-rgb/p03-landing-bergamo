// Durata: LEGATO-A:P03
/* ============================================================
   SI Parrucchieri — script condiviso (home + pagine statiche)
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
  const icone = { taglio: "✂️", colore: "🌿", trattamento: "💧" };
  SERVIZI.filter((s) => s.top).forEach((s) => {
    const card = document.createElement("div");
    card.className = "card card-servizio reveal";
    card.innerHTML = `
      ${s.img ? `<div class="servizio-foto"><img src="${s.img}" alt="${s.nome}" loading="lazy" /></div>` : ""}
      <div class="icona">${icone[s.cat]}</div>
      <h3>${s.nome}</h3>
      <p>${s.desc}</p>
      <div class="meta">
        <span class="prezzo">${s.da ? "<small>da </small>" : ""}${euro(s.prezzo)}</span>
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
          <span class="prezzo">${s.da ? "<small>da </small>" : ""}${euro(s.prezzo)}</span>
        </div>`).join("");
    blocco.innerHTML = `<h3>${cat.icona} ${cat.nome}</h3>${righe}`;
    contListino.appendChild(blocco);
    osservatore.observe(blocco);
  });
}

// Team
const contTeam = document.getElementById("team-grid");
if (contTeam) {
  TEAM.forEach((m) => {
    const card = document.createElement("div");
    card.className = "card card-team reveal";
    card.innerHTML = `
      ${m.img
        ? `<div class="avatar avatar-foto"><img src="${m.img}" alt="${m.nome}" loading="lazy" /></div>`
        : `<div class="avatar">${m.nome[0]}</div>`}
      <h3>${m.nome}</h3>
      <div class="ruolo">${m.ruolo}</div>
      <p>${m.bio}</p>`;
    contTeam.appendChild(card);
    osservatore.observe(card);
  });
}

// Prodotti
const contProdotti = document.getElementById("prodotti-grid");
if (contProdotti) {
  const emojiProdotto = { cute: "🧴", idratazione: "💧", styling: "💨", protezione: "☀️", nutrimento: "🌰", riparazione: "🌿", lucentezza: "✨", viso: "🌸" };
  PRODOTTI.forEach((p) => {
    const card = document.createElement("div");
    card.className = "card card-prodotto reveal";
    card.innerHTML = `
      <div class="prodotto-visual">${p.img ? `<img src="${p.img}" alt="${p.nome}" loading="lazy" />` : (emojiProdotto[p.tag] || "🧴")}</div>
      <h3>${p.nome}</h3>
      <div class="tipo">${p.tipo}</div>
      <span class="prezzo">${euro(p.prezzo)}</span>`;
    contProdotti.appendChild(card);
    osservatore.observe(card);
  });
}

// Recensioni
const contRecensioni = document.getElementById("recensioni-grid");
if (contRecensioni) {
  RECENSIONI.forEach((r) => {
    const card = document.createElement("div");
    card.className = "card card-recensione reveal";
    card.innerHTML = `
      <p>${r.testo}</p>
      <div class="autore">
        <div class="avatar">${r.nome[0]}</div>
        <div><strong>${r.nome}</strong><br /><span class="stelle">★★★★★</span></div>
      </div>`;
    contRecensioni.appendChild(card);
    osservatore.observe(card);
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
