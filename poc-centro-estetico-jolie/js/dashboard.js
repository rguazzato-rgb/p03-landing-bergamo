// Durata: LEGATO-A:P03
/* ============================================================
   Centro Estetico Jolie — dashboard del centro
   Legge le prenotazioni da localStorage e le mostra con:
   questionario, foto, stato pagamento, origine (sito/Instagram).
   ============================================================ */

let filtro = "prossime"; // prossime | oggi | passate | tutte

const FILTRI = [
  { id: "prossime", nome: "In arrivo" },
  { id: "oggi", nome: "Oggi" },
  { id: "passate", nome: "Passate" },
  { id: "tutte", nome: "Tutte" },
];

function toast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("visibile");
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove("visibile"), 2400);
}

/* ---------- Statistiche ---------- */

function renderStats(lista) {
  const oggi = new Date(); oggi.setHours(0, 0, 0, 0);
  const domani = new Date(oggi); domani.setDate(domani.getDate() + 1);
  const settimana = new Date(oggi); settimana.setDate(settimana.getDate() + 7);

  const diOggi = lista.filter((p) => { const d = new Date(p.dataISO); return d >= oggi && d < domani; });
  const inSettimana = lista.filter((p) => { const d = new Date(p.dataISO); return d >= oggi && d < settimana; });
  const conCaparra = lista.filter((p) => p.pagamento === "caparra");
  const daInstagram = lista.filter((p) => p.origine === "instagram");

  document.getElementById("stat-row").innerHTML = `
    <div class="stat"><div class="valore">${diOggi.length}</div><div class="nome-stat">Appuntamenti oggi</div></div>
    <div class="stat"><div class="valore">${inSettimana.length}</div><div class="nome-stat">Prossimi 7 giorni</div></div>
    <div class="stat"><div class="valore">${conCaparra.length}<span style="font-size:0.9rem;">/${lista.length || 0}</span></div><div class="nome-stat">Con caparra pagata</div></div>
    <div class="stat"><div class="valore">${daInstagram.length}</div><div class="nome-stat">Arrivate da Instagram</div></div>`;
}

/* ---------- Filtri ---------- */

function renderFiltri() {
  const box = document.getElementById("filtri");
  box.innerHTML = "";
  FILTRI.forEach((f) => {
    const b = document.createElement("button");
    b.className = "cat-tab" + (filtro === f.id ? " attivo" : "");
    b.textContent = f.nome;
    b.addEventListener("click", () => { filtro = f.id; renderTutto(); });
    box.appendChild(b);
  });
}

function applicaFiltro(lista) {
  const oggi = new Date(); oggi.setHours(0, 0, 0, 0);
  const domani = new Date(oggi); domani.setDate(domani.getDate() + 1);
  switch (filtro) {
    case "oggi": return lista.filter((p) => { const d = new Date(p.dataISO); return d >= oggi && d < domani; });
    case "prossime": return lista.filter((p) => new Date(p.dataISO) >= oggi);
    case "passate": return lista.filter((p) => new Date(p.dataISO) < oggi);
    default: return lista;
  }
}

/* ---------- Lista prenotazioni ---------- */

function testoDomanda(p, idDomanda) {
  const quiz = QUESTIONARI[p.quiz] || [];
  const q = quiz.find((x) => x.id === idDomanda);
  return q ? q.label.replace(" (facoltativo)", "").replace("?", "") : idDomanda;
}

function renderLista(listaTutta) {
  const cont = document.getElementById("pren-lista");
  cont.innerHTML = "";
  const lista = applicaFiltro(listaTutta)
    .sort((a, b) => new Date(a.dataISO) - new Date(b.dataISO));

  if (!lista.length) {
    cont.innerHTML = `
      <div class="vuoto">
        <span class="icona-grande">🗓️</span>
        <strong>Nessuna prenotazione ${filtro === "tutte" ? "" : "in questa vista"}</strong>
        <p>Le prenotazioni fatte dal sito compaiono qui automaticamente.<br />
        Prova tu stesso: <a href="prenota.html">fai una prenotazione di prova</a> oppure genera esempi col bottone in alto.</p>
      </div>`;
    return;
  }

  lista.forEach((p) => {
    const d = new Date(p.dataISO);
    const card = document.createElement("div");
    card.className = "pren-card";

    const pillPag = p.pagamento === "caparra"
      ? `<span class="pill pill-oro">💳 Caparra ${euro(p.caparra)} pagata</span>`
      : `<span class="pill pill-grigia">Paga in centro</span>`;
    const pillFoto = p.foto && p.foto.length
      ? `<span class="pill pill-foto">📸 ${p.foto.length} foto</span>` : "";
    const pillOrigine = p.origine === "instagram"
      ? `<span class="pill pill-verde">da Instagram</span>` : "";

    const risposte = Object.entries(p.risposte || {})
      .filter(([, v]) => v)
      .map(([k, v]) => `<div class="r"><span class="q">${testoDomanda(p, k)}:</span> <strong>${v}</strong></div>`)
      .join("") || `<div class="r"><span class="q">Nessuna preferenza indicata</span></div>`;

    card.innerHTML = `
      <div class="pren-head">
        <div class="pren-quando">
          <div class="g">${d.getDate()}</div>
          <div class="m">${d.toLocaleDateString("it-IT", { month: "short" })}</div>
          <div class="o">${p.ora}</div>
        </div>
        <div class="pren-chi">
          <strong>${p.cliente.nome} ${p.cliente.cognome}</strong>
          <span>${p.servizioNome} · ${minutiATesto(p.durata)} · ${p.prezzoDa ? "da " : ""}${p.prezzo != null ? euro(p.prezzo) : "preventivo"}</span>
        </div>
        <div style="display:flex; gap:0.4rem; flex-wrap:wrap; justify-content:flex-end;">
          ${pillPag}${pillFoto}${pillOrigine}
        </div>
      </div>
      <div class="pren-body">
        <h4>Preferenze del cliente</h4>
        <div class="risposte-quiz">${risposte}</div>
        ${p.foto && p.foto.length ? `
          <h4>Foto allegate (private)</h4>
          <div class="pren-foto">${p.foto.map((f) => `<img src="${f}" alt="Foto allegata" />`).join("")}</div>` : ""}
        <h4>Contatti</h4>
        <div class="risposte-quiz">
          <div class="r"><span class="q">Telefono:</span> <strong><a href="tel:${p.cliente.telefono}">${p.cliente.telefono}</a></strong></div>
          ${p.cliente.email ? `<div class="r"><span class="q">Email:</span> <strong>${p.cliente.email}</strong></div>` : ""}
          <div class="r"><span class="q">Codice:</span> <strong>${p.id}</strong> · <span class="q">prenotata il ${new Date(p.creataIl).toLocaleDateString("it-IT")}</span></div>
        </div>
        <div class="pren-azioni">
          <a class="btn btn-fantasma btn-piccolo" href="https://wa.me/39${(p.cliente.telefono || "").replace(/\D/g, "")}" target="_blank" rel="noopener">💬 Scrivi su WhatsApp</a>
          <button class="btn btn-fantasma btn-piccolo" data-elimina>🗑 Elimina (demo)</button>
        </div>
      </div>`;

    card.querySelector(".pren-head").addEventListener("click", () => card.classList.toggle("aperta"));
    card.querySelectorAll(".pren-foto img").forEach((img) =>
      img.addEventListener("click", (e) => { e.stopPropagation(); apriLightbox(img.src); })
    );
    card.querySelector("[data-elimina]").addEventListener("click", () => {
      const tutte = leggiPrenotazioni().filter((x) => x.id !== p.id);
      salvaPrenotazioni(tutte);
      toast("Prenotazione eliminata");
      renderTutto();
    });

    cont.appendChild(card);
  });
}

/* ---------- Lightbox foto ---------- */

const lightbox = document.getElementById("lightbox");
function apriLightbox(src) {
  lightbox.querySelector("img").src = src;
  lightbox.classList.add("aperta");
}
lightbox.addEventListener("click", () => lightbox.classList.remove("aperta"));

/* ---------- Prenotazioni di esempio (per la demo alla titolare) ----------
   Nomi/telefoni sono ESEMPI FITTIZI per la demo dal vivo, non clienti reali. */

document.getElementById("btn-demo").addEventListener("click", () => {
  const esempi = [
    {
      servizioId: "epil-luce-pulsata", nome: "Francesca", cognome: "Colombo", tel: "348 2214761",
      ora: "10:00", giorniAvanti: 1, pagamento: "caparra", origine: "instagram",
      risposte: { zona: "Gambe intere", "prima-volta": "Sì, prima volta", note: "Preferirei il pomeriggio se possibile" },
    },
    {
      servizioId: "corpo-linfodrenante", nome: "Marco", cognome: "Rovelli", tel: "339 5561208",
      ora: "17:30", giorniAvanti: 1, pagamento: "salone", origine: "sito",
      risposte: { zona: "Gambe", obiettivo: "Drenaggio / gambe leggere" },
    },
    {
      servizioId: "viso-pulizia", nome: "Elena", cognome: "Bonfanti", tel: "351 8837194",
      ora: "15:00", giorniAvanti: 3, pagamento: "caparra", origine: "instagram",
      risposte: { pelle: "Mista", problema: "Punti neri / impurità", note: "Prima volta qui, vengo su consiglio di un'amica" },
    },
  ];

  const lista = leggiPrenotazioni();
  esempi.forEach((e, i) => {
    const s = servizioById(e.servizioId);
    const d = new Date();
    d.setDate(d.getDate() + e.giorniAvanti);
    // sposta al primo giorno di apertura
    while (!SALONE.orari[d.getDay()]) d.setDate(d.getDate() + 1);
    const [h, m] = e.ora.split(":").map(Number);
    d.setHours(h, m, 0, 0);
    lista.push({
      id: "DEMO" + Date.now().toString(36).toUpperCase() + i,
      creataIl: new Date().toISOString(),
      dataISO: d.toISOString(),
      ora: e.ora,
      servizioId: s.id, servizioNome: s.nome, durata: s.durata, prezzo: s.prezzo, prezzoDa: !!s.da,
      risposte: e.risposte, quiz: s.quiz,
      foto: [],
      cliente: { nome: e.nome, cognome: e.cognome, telefono: e.tel, email: "" },
      pagamento: e.pagamento,
      caparra: e.pagamento === "caparra" ? SALONE.caparra : 0,
      stato: "nuova",
      origine: e.origine,
    });
  });
  salvaPrenotazioni(lista);
  toast("3 prenotazioni di esempio aggiunte ✓");
  renderTutto();
});

/* ---------- Render ---------- */

function renderTutto() {
  const lista = leggiPrenotazioni();
  renderStats(lista);
  renderFiltri();
  renderLista(lista);
}

renderTutto();
