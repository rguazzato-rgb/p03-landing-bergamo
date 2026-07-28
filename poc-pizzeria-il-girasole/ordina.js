// Durata: LEGATO-A:P03
/* =====================================================================
   Pizzeria Il Girasole — Ordina online (consegna / ritiro dal giorno dopo)
   ---------------------------------------------------------------------
   Nessuna registrazione, nessun pagamento online: il cliente compone
   l'ordine, sceglie data (da domani in poi) e orario, invia. L'ordine
   arriva come riga in un Google Sheet (backend gratuito, stesso pattern
   già usato per il sondaggio di P03) e compare pronto per la stampa
   nella pagina interna "stampa-ordini.html" la mattina dopo.

   >>> UNICA COSA DA TOCCARE PER TE, LUCA: la riga CONFIG.endpoint <<<
   Incolla lì l'URL del Web App di Google Apps Script (vedi documentazione interna).
   Finché è vuota, gli ordini restano salvati solo su questo dispositivo
   (localStorage) — nessun ordine viene perso, ma non arriva al titolare:
   configurare il backend prima di andare online per davvero.
   ===================================================================== */

const CONFIG = {
  // Incolla qui tra le virgolette l'URL del backend (finisce con /exec):
  endpoint: "",
  telefono: "035620828",
  telefonoVisualizzato: "035 620828",
  version: "ordini-1.1 (2026-07-07): aggiunta categoria Aggiunte & Supplementi",
};

/* ---------- Catalogo prodotti (stessi nomi e prezzi di menu.html) ---------- */
const PRODOTTI = {
  classiche: {
    titolo: "Pizze Classiche", icona: "fa-pizza-slice",
    items: [
      ["4 formaggi", 7.00], ["4 stagioni", 7.00], ["Asparagi", 6.50], ["Asparagi e uovo", 7.50],
      ["Branzi", 7.00], ["Bresaola", 7.00], ["Bresaola e porcini", 8.00], ["Brie", 6.50],
      ["Calzone normale", 7.00], ["Calzone farcito", 7.50], ["Caprese", 6.50], ["Capricciosa", 7.00],
      ["Carciofi", 6.50], ["Cipolle", 6.00], ["Crudo", 7.00], ["Diavola", 6.50],
      ["Friarielli", 7.00], ["Frutti di mare", 7.50], ["Funghi", 6.50], ["Funghi porcini", 7.00],
      ["Gamberetti", 7.50], ["Gamberetti e rucola", 8.00], ["Gamberetti rucola e salsa rosa", 8.50],
      ["Girasole", 7.50], ["Grana", 6.50], ["Margherita", 5.50], ["Mari e monti", 8.50],
      ["Marinara", 4.50], ["Melanzane", 7.50], ["Mozzarella di bufala", 7.00], ["Napoli", 7.00],
      ["Pancetta", 7.00], ["Pancetta e uovo", 8.00], ["Papà", 8.50], ["Parmigiana", 8.50],
      ["Patapizza", 6.50], ["Peperoni", 6.50], ["Peperoni grigliati", 7.50], ["Pomodorini", 6.50],
      ["Prosciutto", 6.00], ["Prosciutto e funghi", 6.50], ["Prosciutto e provolone", 7.00],
      ["Provolone", 6.50], ["Pugliese", 6.50], ["Ricotta", 6.00], ["Romana", 6.50], ["Rucola", 6.50],
      ["Salame", 7.00], ["Salamino", 6.50], ["Salmone", 7.50], ["Salsiccia", 7.00],
      ["Scamorza", 6.50], ["Scamorza e porcini", 7.50], ["Scamorza e rucola", 7.00],
      ["Siciliana", 7.50], ["Speck", 7.00], ["Speck e brie", 7.50], ["Speck e zola", 7.50],
      ["Spinaci", 7.00], ["Spinaci e panna", 7.00], ["Spinaci e ricotta", 7.00], ["Taleggio", 6.50],
      ["Tonno", 7.00], ["Tonno e cipolle", 7.50], ["Tris di verdure", 7.00], ["Verdure grigliate", 7.50],
      ["Vulcano", 9.00], ["Wurstel", 6.00], ["Wurstel e patatine", 7.00], ["Zingara", 7.50],
      ["Zola", 6.50], ["Zola e noci", 7.50], ["Zucchine grigliate", 7.50],
    ],
  },
  speciali: {
    titolo: "Pizze Speciali", icona: "fa-star",
    items: [
      ["Primavera", 8.00], ["Ligure", 7.50], ["Sfiziosa", 8.00], ["Nostrana", 8.50],
      ["Delicata", 9.00], ["Estiva", 8.50], ["Invernale", 8.50], ["Appetitosa", 8.00],
    ],
  },
  schiacciatine: {
    titolo: "Schiacciatine", icona: "fa-bread-slice",
    items: [["Schiacciatina", 4.50], ["Schiacciatina con cipolle", 5.00]],
  },
  scrocchiarella: {
    titolo: "Scrocchiarella Romana", icona: "fa-cheese",
    items: [
      ["Focaccia", 12.00], ["Margherita", 17.00], ["Farcita (personalizzata)", 19.00],
      ["Scrocchiarella N. 1 (mortadella, burrata, pistacchio)", 23.00],
      ["Scrocchiarella N. 2 (cipolle caramellate, scamorza, speck)", 22.00],
      ["Scrocchiarella N. 3 (salmone, ricotta, pomodorini)", 23.00],
      ["Scrocchiarella N. 4 (bufala, zucchine, pomodorini)", 23.00],
      ["Scrocchiarella N. 5 (stracchino, funghi misto bosco)", 22.00],
    ],
  },
  aggiunte: {
    titolo: "Aggiunte & Supplementi", icona: "fa-circle-plus",
    items: [
      ["Impasto Kamut", 1.50], ["Impasto Integrale", 1.00], ["Impasto Senza Glutine", 4.00],
      ["Supplemento standard (crudo, speck, bresaola, salsiccia, salame, gamberetti, salmone, tonno, uovo, porcini, bufala, patatine...)", 1.00],
      ["Burrata di bufala", 3.00], ["Mozzarella senza lattosio", 1.50],
      ["Altro ingrediente extra", 0.50], ["Doppia farcitura", 1.00], ["Doppia mozzarella", 1.00],
    ],
  },
  fritture: {
    titolo: "Le Fritture", icona: "fa-bowl-food",
    items: [
      ["Crocchette di Patate (8pz)", 3.00], ["Crocchette di Pollo (8pz)", 3.00],
      ["Olive Ascolane (8pz)", 3.00], ["Arancini alla siciliana (8pz)", 3.00],
      ["Patatine Fritte Piccole", 2.00], ["Patatine Fritte Medie", 3.00], ["Patatine Fritte Grandi", 5.00],
    ],
  },
  bibite: {
    titolo: "Birre & Bibite", icona: "fa-beer-mug-empty",
    items: [
      ["Birra Moretti (0.66l)", 3.00], ["Birra Leffe Bionda / Ambrata (0.75l)", 5.00],
      ["Ichnusa (0.33l)", 2.50], ["Coca Cola / Coca Cola 0 / Sprite / Fanta (0.33l)", 2.00],
      ["Coca Cola / Sprite / Fanta (1l)", 3.00], ["Acqua (0.33l)", 1.00],
    ],
  },
};

const LOCAL_KEY = "girasole_ordini_backup";

/* ---------- Stato ---------- */
const stato = {
  categoria: "classiche",
  carrello: {},          // { "classiche::Margherita": {nome, cat, prezzo, qta} }
  tipo: "consegna",       // "consegna" | "ritiro"
};

const app = document.getElementById("ordina-app");

function euro(n) { return "€" + n.toFixed(2).replace(".", ","); }

function domani() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d;
}

function dataISO(d) {
  return d.toISOString().slice(0, 10);
}

function toast(msg) {
  let t = document.getElementById("ordina-toast");
  if (!t) {
    t = document.createElement("div");
    t.id = "ordina-toast";
    t.className = "ordina-toast";
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add("visibile");
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove("visibile"), 2600);
}

/* ---------- Render form principale ---------- */
function render() {
  const minData = dataISO(domani());

  app.innerHTML = `
    <div class="order-layout">

      <!-- Dati cliente e consegna -->
      <div class="order-panel">
        <h2 class="headline-md" style="margin-bottom: var(--space-md);">I tuoi dati</h2>

        <div class="toggle-group" id="toggle-tipo">
          <button type="button" class="toggle-option ${stato.tipo === "consegna" ? "attivo" : ""}" data-tipo="consegna">
            <i class="fa-solid fa-motorcycle"></i> Consegna a domicilio
          </button>
          <button type="button" class="toggle-option ${stato.tipo === "ritiro" ? "attivo" : ""}" data-tipo="ritiro">
            <i class="fa-solid fa-store"></i> Ritiro in pizzeria
          </button>
        </div>

        <div class="form-grid">
          <div class="form-field">
            <label for="f-nome">Nome e cognome *</label>
            <input id="f-nome" type="text" placeholder="Es. Mario Rossi">
          </div>
          <div class="form-field">
            <label for="f-telefono">Telefono *</label>
            <input id="f-telefono" type="tel" placeholder="Es. 333 1234567">
          </div>

          <div class="form-field indirizzo-field" style="${stato.tipo === "consegna" ? "" : "display:none;"}">
            <label for="f-via">Via e civico *</label>
            <input id="f-via" type="text" placeholder="Es. Via Roma 12">
          </div>
          <div class="form-field indirizzo-field" style="${stato.tipo === "consegna" ? "" : "display:none;"}">
            <label for="f-paese">Paese *</label>
            <input id="f-paese" type="text" placeholder="Es. Brembate Sopra">
          </div>

          <div class="form-field">
            <label for="f-data">Data ${stato.tipo === "consegna" ? "consegna" : "ritiro"} *</label>
            <input id="f-data" type="date" min="${minData}" value="${minData}">
          </div>
          <div class="form-field">
            <label for="f-ora">Orario indicativo *</label>
            <input id="f-ora" type="time" value="19:00">
          </div>

          <div class="form-field" style="grid-column: 1 / -1;">
            <label for="f-note">Note (facoltative)</label>
            <textarea id="f-note" rows="2" placeholder="Es. citofono, allergie, pizza tagliata..."></textarea>
          </div>
        </div>

        <p class="body-sm" style="margin-top: var(--space-sm); color: var(--color-outline);">
          Orari di apertura: Mar–Ven 11:30–13:30 e 18:00–21:30 · Lun/Sab/Dom 18:00–21:30. Scegli un orario dentro questa fascia.
        </p>
      </div>

      <!-- Selezione prodotti -->
      <div class="order-panel">
        <h2 class="headline-md" style="margin-bottom: var(--space-md);">Il tuo ordine</h2>

        <div class="filter-bar-container" id="order-category-bar">
          ${Object.entries(PRODOTTI).map(([id, c]) => `
            <button type="button" class="btn-filter-chip ${stato.categoria === id ? "active" : ""}" data-cat="${id}">
              <i class="fa-solid ${c.icona}" style="margin-right: 6px;"></i>${c.titolo}
            </button>`).join("")}
        </div>

        <div class="order-items-list" id="order-items-list"></div>
      </div>
    </div>

    <!-- Barra riepilogo fissa -->
    <div class="order-cart-bar" id="order-cart-bar">
      <div class="order-cart-summary">
        <span id="cart-count">0 articoli</span>
        <strong id="cart-total">€0,00</strong>
      </div>
      <button type="button" class="btn-primary" id="btn-invia-ordine">Invia ordine</button>
    </div>
  `;

  renderItems();
  attachEventiForm();
  renderCartBar();
}

function renderItems() {
  const cont = document.getElementById("order-items-list");
  const cat = PRODOTTI[stato.categoria];
  const hint = stato.categoria === "aggiunte"
    ? `<p class="body-sm" style="margin-bottom: var(--space-sm); color: var(--color-outline);">Se un extra vale solo per una pizza specifica (es. "doppia mozzarella sulla Margherita"), scrivilo anche nelle Note qui sopra: il carrello non collega gli extra a una pizza in particolare.</p>`
    : "";
  cont.innerHTML = hint + cat.items.map(([nome, prezzo]) => {
    const chiave = stato.categoria + "::" + nome;
    const qta = stato.carrello[chiave] ? stato.carrello[chiave].qta : 0;
    return `
      <div class="order-item-row" data-chiave="${chiave}">
        <div class="order-item-info">
          <span class="order-item-nome">${nome}</span>
          <span class="order-item-prezzo">${euro(prezzo)}</span>
        </div>
        <div class="qty-stepper">
          <button type="button" class="qty-btn" data-azione="meno">−</button>
          <span class="qty-valore">${qta}</span>
          <button type="button" class="qty-btn" data-azione="più">+</button>
        </div>
      </div>`;
  }).join("");

  cont.querySelectorAll(".qty-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const row = btn.closest(".order-item-row");
      const chiave = row.dataset.chiave;
      const [cat, nome] = chiave.split("::");
      const prezzo = PRODOTTI[cat].items.find((it) => it[0] === nome)[1];
      const attuale = stato.carrello[chiave] ? stato.carrello[chiave].qta : 0;
      const nuova = btn.dataset.azione === "più" ? attuale + 1 : Math.max(0, attuale - 1);

      if (nuova === 0) delete stato.carrello[chiave];
      else stato.carrello[chiave] = { nome, cat, prezzo, qta: nuova };

      row.querySelector(".qty-valore").textContent = nuova;
      renderCartBar();
    });
  });
}

function attachEventiForm() {
  document.querySelectorAll("#toggle-tipo .toggle-option").forEach((btn) => {
    btn.addEventListener("click", () => {
      stato.tipo = btn.dataset.tipo;
      render();
    });
  });

  document.querySelectorAll("#order-category-bar .btn-filter-chip").forEach((btn) => {
    btn.addEventListener("click", () => {
      stato.categoria = btn.dataset.cat;
      document.querySelectorAll("#order-category-bar .btn-filter-chip").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      renderItems();
    });
  });

  document.getElementById("btn-invia-ordine").addEventListener("click", inviaOrdine);
}

function totaleCarrello() {
  return Object.values(stato.carrello).reduce((s, it) => s + it.prezzo * it.qta, 0);
}

function numeroArticoli() {
  return Object.values(stato.carrello).reduce((s, it) => s + it.qta, 0);
}

function renderCartBar() {
  const n = numeroArticoli();
  document.getElementById("cart-count").textContent = n === 1 ? "1 articolo" : n + " articoli";
  document.getElementById("cart-total").textContent = euro(totaleCarrello());
  document.getElementById("order-cart-bar").classList.toggle("visibile", n > 0);
}

/* ---------- Invio ordine ---------- */
function leggiCampi() {
  return {
    nome: document.getElementById("f-nome").value.trim(),
    telefono: document.getElementById("f-telefono").value.trim(),
    via: stato.tipo === "consegna" ? document.getElementById("f-via").value.trim() : "",
    paese: stato.tipo === "consegna" ? document.getElementById("f-paese").value.trim() : "",
    data: document.getElementById("f-data").value,
    ora: document.getElementById("f-ora").value,
    note: document.getElementById("f-note").value.trim(),
  };
}

function valida(c) {
  if (!c.nome) return "Inserisci nome e cognome";
  if (!/^[\d\s+().-]{6,}$/.test(c.telefono)) return "Inserisci un numero di telefono valido";
  if (stato.tipo === "consegna" && (!c.via || !c.paese)) return "Via e paese sono obbligatori per la consegna";
  if (!c.data) return "Scegli una data";
  const minData = dataISO(domani());
  if (c.data < minData) return "La data deve essere da domani in poi";
  if (!c.ora) return "Scegli un orario";
  if (numeroArticoli() === 0) return "Aggiungi almeno una pizza o un prodotto all'ordine";
  return null;
}

function leggiOrdiniLocali() {
  try { return JSON.parse(localStorage.getItem(LOCAL_KEY)) || []; } catch { return []; }
}
function salvaOrdineLocale(ordine) {
  const lista = leggiOrdiniLocali();
  lista.push(ordine);
  localStorage.setItem(LOCAL_KEY, JSON.stringify(lista));
}

async function inviaOrdine() {
  const campi = leggiCampi();
  const errore = valida(campi);
  if (errore) return toast(errore);

  const articoli = Object.values(stato.carrello);
  const pizzeTesto = articoli.map((it) => `${it.qta}x ${it.nome}`).join(", ");
  const totale = totaleCarrello();

  const ordine = {
    id: "ORD" + Date.now().toString(36).toUpperCase(),
    creato_il: new Date().toISOString(),
    data_consegna: campi.data,
    ora: campi.ora,
    tipo: stato.tipo,
    nome: campi.nome,
    telefono: campi.telefono,
    via: campi.via,
    paese: campi.paese,
    pizze: pizzeTesto,
    articoli,
    totale: totale.toFixed(2),
    note: campi.note,
  };

  salvaOrdineLocale(ordine);

  const btn = document.getElementById("btn-invia-ordine");
  btn.disabled = true;
  btn.textContent = "Invio in corso...";

  let inviatoAlBackend = false;
  if (CONFIG.endpoint) {
    try {
      await fetch(CONFIG.endpoint, {
        method: "POST",
        mode: "no-cors", // fire-and-forget: come il pattern del sondaggio, niente lettura risposta
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(ordine),
      });
      inviatoAlBackend = true;
    } catch (err) {
      inviatoAlBackend = false;
    }
  }

  renderConferma(ordine, inviatoAlBackend);
}

function renderConferma(o, inviatoAlBackend) {
  const dataLeggibile = new Date(o.data_consegna + "T00:00:00").toLocaleDateString("it-IT", {
    weekday: "long", day: "numeric", month: "long",
  });

  app.innerHTML = `
    <div class="order-conferma">
      <div class="spunta">✓</div>
      <h2 class="headline-lg">Ordine ricevuto!</h2>
      <p class="body-md">Ti aspettiamo <strong>${dataLeggibile}</strong> alle <strong>${o.ora}</strong> per il ${o.tipo === "consegna" ? "la consegna" : "il ritiro"}.</p>
      <p class="body-sm" style="margin-top: var(--space-sm);">${o.pizze} — Totale indicativo <strong>${euro(parseFloat(o.totale))}</strong></p>
      <p class="body-sm" style="margin-top: var(--space-sm); color: var(--color-outline);">Si paga come sempre alla ${o.tipo === "consegna" ? "consegna" : "ritiro"}, nessun pagamento online. Per modifiche o annullamento chiamaci al <a href="tel:${CONFIG.telefono}" class="color-primary">${CONFIG.telefonoVisualizzato}</a>.</p>
      ${!inviatoAlBackend ? `<p class="body-sm" style="margin-top: var(--space-md); color: var(--color-error);">⚠️ Il backend non è ancora collegato: l'ordine è salvato solo su questo dispositivo. Chiama comunque la pizzeria per confermarlo.</p>` : ""}
      <p style="margin-top: var(--space-md); font-size: 0.86rem; color: var(--color-outline);">Codice ordine: <strong>${o.id}</strong></p>
      <a href="index.html" class="btn-primary" style="margin-top: var(--space-lg); display: inline-flex;">Torna al sito</a>
    </div>`;
}

render();
