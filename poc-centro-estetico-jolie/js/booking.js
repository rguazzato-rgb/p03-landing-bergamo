// Durata: LEGATO-A:P03
/* ============================================================
   Centro Estetico Jolie — flusso di prenotazione guidato
   Step: 1 servizio → 2 questionario → 3 foto → 4 data/ora
         → 5 dati cliente → 6 riepilogo + caparra → conferma
   Le prenotazioni sono salvate in localStorage (demo PoC).
   ============================================================ */

const STEP_LABELS = ["Servizio", "Le tue preferenze", "Foto di ispirazione", "Data e ora", "I tuoi dati", "Riepilogo e conferma"];

const stato = {
  step: 1,
  categoria: "viso",
  servizio: null,          // oggetto servizio
  risposte: {},            // {idDomanda: valore}
  foto: [],                // dataURL (max 3)
  giorno: null,            // Date (solo data)
  ora: null,               // "HH:MM"
  cliente: { nome: "", cognome: "", telefono: "", email: "" },
  pagamento: null,         // "caparra" | "salone"
  settimanaOffset: 0,      // navigazione calendario
};

const pannello = document.getElementById("pannello");
const stepperEl = document.getElementById("stepper");

/* ---------- Preselezione da querystring (?servizio=...) ---------- */
const paramServizio = new URLSearchParams(location.search).get("servizio");
if (paramServizio) {
  const s = servizioById(paramServizio);
  if (s) { stato.servizio = s; stato.categoria = s.cat; }
}

/* ---------- Utility ---------- */

function toast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("visibile");
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove("visibile"), 2600);
}

function dataBreve(d) {
  return d.toLocaleDateString("it-IT", { weekday: "long", day: "numeric", month: "long" });
}

function scrollSu() { window.scrollTo({ top: 0, behavior: "smooth" }); }

function renderStepper() {
  stepperEl.innerHTML = STEP_LABELS
    .map((_, i) => {
      const n = i + 1;
      const cls = n < stato.step ? "fatto" : n === stato.step ? "attivo" : "";
      return `<div class="step ${cls}"></div>`;
    })
    .join("");
}

function vai(step) {
  stato.step = step;
  renderStepper();
  render();
  scrollSu();
}

function intestazione(numero, titolo) {
  return `
    <div class="step-label">Passo ${numero} di ${STEP_LABELS.length} — ${STEP_LABELS[numero - 1]}</div>
    <h1 class="step-titolo">${titolo}</h1>`;
}

function navStep({ indietro, avantiTesto = "Continua →", avantiAbilitato = true, onAvanti }) {
  const nav = document.createElement("div");
  nav.className = "step-nav";
  nav.innerHTML = `
    ${indietro ? `<button class="btn btn-fantasma" data-indietro>← Indietro</button>` : `<span></span>`}
    <button class="btn btn-primario" data-avanti ${avantiAbilitato ? "" : "disabled"}>${avantiTesto}</button>`;
  if (indietro) nav.querySelector("[data-indietro]").addEventListener("click", () => vai(stato.step - 1));
  nav.querySelector("[data-avanti]").addEventListener("click", onAvanti);
  return nav;
}

/* ============================================================
   STEP 1 — scelta del servizio
   ============================================================ */

function renderStep1() {
  pannello.innerHTML = intestazione(1, "Di cosa hai bisogno?");

  const tabs = document.createElement("div");
  tabs.className = "cat-tabs";
  CATEGORIE.forEach((c) => {
    const b = document.createElement("button");
    b.className = "cat-tab" + (c.id === stato.categoria ? " attivo" : "");
    b.textContent = `${c.icona} ${c.nome}`;
    b.addEventListener("click", () => { stato.categoria = c.id; renderStep1(); });
    tabs.appendChild(b);
  });
  pannello.appendChild(tabs);

  const lista = document.createElement("div");
  lista.className = "lista-servizi";
  SERVIZI.filter((s) => s.cat === stato.categoria).forEach((s) => {
    const b = document.createElement("button");
    b.className = "riga-servizio" + (stato.servizio && stato.servizio.id === s.id ? " scelto" : "");
    b.innerHTML = `
      <div class="info">
        <strong>${s.nome}</strong>
        <span>${s.desc}</span>
      </div>
      <div class="costo">
        <span class="prezzo">${prezzoTesto(s)}</span><br />
        <span class="durata">⏱ ${minutiATesto(s.durata)}</span>
      </div>`;
    b.addEventListener("click", () => {
      const cambiato = !stato.servizio || stato.servizio.id !== s.id;
      stato.servizio = s;
      if (cambiato) { stato.risposte = {}; stato.ora = null; }
      renderStep1();
    });
    lista.appendChild(b);
  });
  pannello.appendChild(lista);

  pannello.appendChild(navStep({
    indietro: false,
    avantiAbilitato: !!stato.servizio,
    onAvanti: () => {
      if (!stato.servizio) return toast("Scegli prima un servizio 🙂");
      vai(2);
    },
  }));
}

/* ============================================================
   STEP 2 — questionario intelligente
   ============================================================ */

function renderStep2() {
  const quiz = QUESTIONARI[stato.servizio.quiz] || [];
  pannello.innerHTML = intestazione(2, "Raccontaci cosa desideri");
  const sotto = document.createElement("p");
  sotto.style.cssText = "color: var(--grigio); margin: -0.8rem 0 1.8rem;";
  sotto.textContent = `Poche domande rapide su "${stato.servizio.nome}": così il team arriva preparato al tuo appuntamento.`;
  pannello.appendChild(sotto);

  quiz.forEach((q) => {
    const box = document.createElement("div");
    box.className = "domanda";
    box.innerHTML = `<span class="testo-domanda">${q.label}</span>`;
    if (q.tipo === "scelta") {
      const chips = document.createElement("div");
      chips.className = "chips";
      q.opzioni.forEach((op) => {
        const chip = document.createElement("button");
        chip.className = "chip" + (stato.risposte[q.id] === op ? " scelto" : "");
        chip.textContent = op;
        chip.addEventListener("click", () => {
          stato.risposte[q.id] = stato.risposte[q.id] === op ? undefined : op;
          renderStep2();
        });
        chips.appendChild(chip);
      });
      box.appendChild(chips);
    } else {
      const ta = document.createElement("textarea");
      ta.placeholder = q.placeholder || "";
      ta.value = stato.risposte[q.id] || "";
      ta.addEventListener("input", () => (stato.risposte[q.id] = ta.value.trim()));
      box.appendChild(ta);
    }
    pannello.appendChild(box);
  });

  pannello.appendChild(navStep({
    indietro: true,
    onAvanti: () => {
      const obbligatorie = quiz.filter((q) => q.tipo === "scelta");
      const mancanti = obbligatorie.filter((q) => !stato.risposte[q.id]);
      if (mancanti.length) return toast("Rispondi alle domande a scelta: ci aiutano davvero 🙏");
      vai(3);
    },
  }));
}

/* ============================================================
   STEP 3 — foto di ispirazione (facoltative, max 3)
   ============================================================ */

function comprimiImmagine(file) {
  // Ridimensiona a max 800px e comprime in JPEG: le foto stanno in localStorage senza pesare.
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const MAX = 800;
        const scala = Math.min(1, MAX / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scala);
        canvas.height = Math.round(img.height * scala);
        canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.78));
      };
      img.onerror = reject;
      img.src = reader.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function renderStep3() {
  pannello.innerHTML = intestazione(3, "Hai una foto o un riferimento da mostrarci?");
  const sotto = document.createElement("p");
  sotto.style.cssText = "color: var(--grigio); margin: -0.8rem 0 1.8rem;";
  sotto.textContent = "Facoltativo, ma utile: allega fino a 3 foto (es. la zona da trattare, un'ispirazione make up). Il centro arriva preparato.";
  pannello.appendChild(sotto);

  const drop = document.createElement("div");
  drop.className = "dropzone";
  drop.innerHTML = `
    <span class="icona-grande">📸</span>
    <p><strong>Tocca per scegliere le foto</strong> oppure trascinale qui<br />JPG o PNG · massimo 3 foto</p>`;
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.multiple = true;
  input.style.display = "none";

  async function aggiungi(files) {
    for (const f of files) {
      if (stato.foto.length >= 3) { toast("Massimo 3 foto 🙂"); break; }
      if (!f.type.startsWith("image/")) continue;
      try { stato.foto.push(await comprimiImmagine(f)); }
      catch { toast("Non riesco a leggere una delle foto"); }
    }
    renderStep3();
  }

  drop.addEventListener("click", () => input.click());
  input.addEventListener("change", () => aggiungi([...input.files]));
  drop.addEventListener("dragover", (e) => { e.preventDefault(); drop.classList.add("trascina"); });
  drop.addEventListener("dragleave", () => drop.classList.remove("trascina"));
  drop.addEventListener("drop", (e) => {
    e.preventDefault(); drop.classList.remove("trascina");
    aggiungi([...e.dataTransfer.files]);
  });

  pannello.appendChild(drop);
  pannello.appendChild(input);

  if (stato.foto.length) {
    const ant = document.createElement("div");
    ant.className = "anteprime";
    stato.foto.forEach((src, i) => {
      const box = document.createElement("div");
      box.className = "anteprima";
      box.innerHTML = `<img src="${src}" alt="Foto di riferimento ${i + 1}" />
        <button class="rimuovi" title="Rimuovi" aria-label="Rimuovi foto">✕</button>`;
      box.querySelector(".rimuovi").addEventListener("click", () => {
        stato.foto.splice(i, 1);
        renderStep3();
      });
      ant.appendChild(box);
    });
    pannello.appendChild(ant);
  }

  const privacy = document.createElement("div");
  privacy.className = "nota-privacy";
  privacy.innerHTML = `🔒 <span><strong>Le foto restano private:</strong> le vede solo il centro, per preparare al meglio il tuo appuntamento.</span>`;
  pannello.appendChild(privacy);

  pannello.appendChild(navStep({
    indietro: true,
    avantiTesto: stato.foto.length ? "Continua →" : "Salta, continua senza foto →",
    onAvanti: () => vai(4),
  }));
}

/* ============================================================
   STEP 4 — data e ora
   ============================================================ */

function slotOccupatiDemo(d) {
  // Occupazione fittizia ma stabile per data (demo realistica): ~1 slot su 3.
  const seme = d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
  const occupati = new Set();
  let x = seme;
  for (let i = 0; i < 10; i++) {
    x = (x * 9301 + 49297) % 233280;
    occupati.add(Math.floor((x / 233280) * 20)); // indice slot 0..19
  }
  return occupati;
}

function slotPrenotati(d) {
  // Slot già presi da prenotazioni reali salvate nella demo.
  const chiave = d.toDateString();
  return new Set(
    leggiPrenotazioni()
      .filter((p) => new Date(p.dataISO).toDateString() === chiave)
      .map((p) => p.ora)
  );
}

function generaSlot(d, durata) {
  const fascia = SALONE.orari[d.getDay()];
  if (!fascia) return [];
  const [apre, chiude] = fascia;
  const slot = [];
  const passo = 0.5; // 30 minuti
  const occupatiDemo = slotOccupatiDemo(d);
  const presi = slotPrenotati(d);
  const adesso = new Date();
  let indice = 0;
  for (let h = apre; h + durata / 60 <= chiude + 0.001; h += passo, indice++) {
    const ore = Math.floor(h);
    const minuti = Math.round((h - ore) * 60);
    const etichetta = `${String(ore).padStart(2, "0")}:${String(minuti).padStart(2, "0")}`;
    const quando = new Date(d);
    quando.setHours(ore, minuti, 0, 0);
    const passato = quando <= adesso;
    slot.push({ ora: etichetta, occupato: passato || occupatiDemo.has(indice) || presi.has(etichetta) });
  }
  return slot;
}

function renderStep4() {
  pannello.innerHTML = intestazione(4, "Quando vuoi venire?");
  const sotto = document.createElement("p");
  sotto.style.cssText = "color: var(--grigio); margin: -0.8rem 0 1.6rem;";
  sotto.innerHTML = `<strong>${stato.servizio.nome}</strong> · durata ${minutiATesto(stato.servizio.durata)}. Ti mostriamo solo gli orari davvero disponibili.`;
  pannello.appendChild(sotto);

  // Striscia di 7 giorni con navigazione settimanale
  const oggi = new Date();
  oggi.setHours(0, 0, 0, 0);
  const inizio = new Date(oggi);
  inizio.setDate(inizio.getDate() + stato.settimanaOffset * 7);

  const nav = document.createElement("div");
  nav.className = "cal-nav";
  const fine = new Date(inizio);
  fine.setDate(fine.getDate() + 6);
  nav.innerHTML = `
    <button data-prev ${stato.settimanaOffset === 0 ? "disabled" : ""} aria-label="Settimana precedente">←</button>
    <h3>${inizio.toLocaleDateString("it-IT", { day: "numeric", month: "short" })} – ${fine.toLocaleDateString("it-IT", { day: "numeric", month: "short" })}</h3>
    <button data-next ${stato.settimanaOffset >= 3 ? "disabled" : ""} aria-label="Settimana successiva">→</button>`;
  nav.querySelector("[data-prev]").addEventListener("click", () => { stato.settimanaOffset--; renderStep4(); });
  nav.querySelector("[data-next]").addEventListener("click", () => { stato.settimanaOffset++; renderStep4(); });
  pannello.appendChild(nav);

  const striscia = document.createElement("div");
  striscia.className = "giorni-striscia";
  for (let i = 0; i < 7; i++) {
    const d = new Date(inizio);
    d.setDate(d.getDate() + i);
    const chiuso = !SALONE.orari[d.getDay()] || d < oggi;
    const scelto = stato.giorno && d.toDateString() === stato.giorno.toDateString();
    const cella = document.createElement("button");
    cella.className = "giorno" + (chiuso ? " chiuso" : "") + (scelto ? " scelto" : "");
    cella.disabled = chiuso;
    cella.innerHTML = `
      <span class="dow">${d.toLocaleDateString("it-IT", { weekday: "short" })}</span>
      <span class="num">${d.getDate()}</span>
      <span class="mese">${d.toLocaleDateString("it-IT", { month: "short" })}</span>`;
    cella.addEventListener("click", () => { stato.giorno = d; stato.ora = null; renderStep4(); });
    striscia.appendChild(cella);
  }
  pannello.appendChild(striscia);

  // Slot del giorno scelto
  const zonaSlot = document.createElement("div");
  if (!stato.giorno) {
    zonaSlot.innerHTML = `<p class="slot-vuoto">👆 Scegli un giorno per vedere gli orari disponibili.</p>`;
  } else {
    const slot = generaSlot(stato.giorno, stato.servizio.durata);
    const liberi = slot.filter((s) => !s.occupato);
    const titolo = document.createElement("p");
    titolo.style.cssText = "font-weight:600; margin-bottom:0.8rem;";
    titolo.textContent = `Orari per ${dataBreve(stato.giorno)}` + (liberi.length ? ` (${liberi.length} disponibili)` : "");
    zonaSlot.appendChild(titolo);
    if (!liberi.length) {
      zonaSlot.insertAdjacentHTML("beforeend", `<p class="slot-vuoto">Nessun orario libero in questo giorno: prova un altro giorno 🙏</p>`);
    } else {
      const griglia = document.createElement("div");
      griglia.className = "slot-grid";
      slot.forEach((s) => {
        const b = document.createElement("button");
        b.className = "slot" + (s.occupato ? " occupato" : "") + (stato.ora === s.ora ? " scelto" : "");
        b.textContent = s.ora;
        b.disabled = s.occupato;
        b.addEventListener("click", () => { stato.ora = s.ora; renderStep4(); });
        griglia.appendChild(b);
      });
      zonaSlot.appendChild(griglia);
    }
  }
  pannello.appendChild(zonaSlot);

  pannello.appendChild(navStep({
    indietro: true,
    avantiAbilitato: !!(stato.giorno && stato.ora),
    onAvanti: () => {
      if (!stato.giorno || !stato.ora) return toast("Scegli giorno e orario 🙂");
      vai(5);
    },
  }));
}

/* ============================================================
   STEP 5 — dati cliente
   ============================================================ */

function renderStep5() {
  pannello.innerHTML = intestazione(5, "A chi teniamo il posto?");

  // Cliente ricorrente → scorciatoia "Come l'altra volta"
  let ricorrente = null;
  try { ricorrente = JSON.parse(localStorage.getItem(CLIENTE_KEY)); } catch {}
  if (ricorrente && ricorrente.nome && !stato.cliente.nome) {
    const box = document.createElement("button");
    box.className = "riga-servizio";
    box.style.marginBottom = "1.4rem";
    box.innerHTML = `
      <div class="info">
        <strong>👋 Bentornata/o, ${ricorrente.nome}!</strong>
        <span>Usa i dati dell'ultima volta: ${ricorrente.nome} ${ricorrente.cognome} · ${ricorrente.telefono}</span>
      </div>
      <span class="btn btn-oro btn-piccolo">Come l'altra volta</span>`;
    box.addEventListener("click", () => {
      stato.cliente = { ...ricorrente };
      renderStep5();
      toast("Dati compilati ✓");
    });
    pannello.appendChild(box);
  }

  const form = document.createElement("div");
  form.innerHTML = `
    <div class="campo">
      <label for="f-nome">Nome *</label>
      <input id="f-nome" type="text" autocomplete="given-name" value="${stato.cliente.nome || ""}" placeholder="Es. Giulia" />
    </div>
    <div class="campo">
      <label for="f-cognome">Cognome *</label>
      <input id="f-cognome" type="text" autocomplete="family-name" value="${stato.cliente.cognome || ""}" placeholder="Es. Rossi" />
    </div>
    <div class="campo">
      <label for="f-telefono">Telefono *</label>
      <input id="f-telefono" type="tel" autocomplete="tel" value="${stato.cliente.telefono || ""}" placeholder="Es. 333 1234567" />
    </div>
    <div class="campo">
      <label for="f-email">Email <span class="facoltativo">(facoltativa — per la conferma scritta)</span></label>
      <input id="f-email" type="email" autocomplete="email" value="${stato.cliente.email || ""}" placeholder="Es. giulia@esempio.it" />
    </div>`;
  pannello.appendChild(form);

  const leggi = () => {
    stato.cliente = {
      nome: document.getElementById("f-nome").value.trim(),
      cognome: document.getElementById("f-cognome").value.trim(),
      telefono: document.getElementById("f-telefono").value.trim(),
      email: document.getElementById("f-email").value.trim(),
    };
  };

  pannello.appendChild(navStep({
    indietro: true,
    onAvanti: () => {
      leggi();
      const c = stato.cliente;
      if (!c.nome || !c.cognome) return toast("Nome e cognome ci servono 🙂");
      if (!/^[\d\s+().-]{6,}$/.test(c.telefono)) return toast("Inserisci un numero di telefono valido");
      if (c.email && !/^\S+@\S+\.\S+$/.test(c.email)) return toast("L'email non sembra corretta");
      localStorage.setItem(CLIENTE_KEY, JSON.stringify(c));
      vai(6);
    },
  }));
}

/* ============================================================
   STEP 6 — riepilogo + caparra (pagamento simulato)
   ============================================================ */

function renderStep6() {
  pannello.innerHTML = intestazione(6, "Controlla e conferma");

  const s = stato.servizio;
  const quiz = QUESTIONARI[s.quiz] || [];
  const risposteTesto = quiz
    .filter((q) => stato.risposte[q.id])
    .map((q) => `<dt>${q.label.replace(" (facoltativo)", "")}</dt><dd>${stato.risposte[q.id]}</dd>`)
    .join("");

  const riepilogo = document.createElement("div");
  riepilogo.className = "riepilogo";
  riepilogo.innerHTML = `
    <dl>
      <dt>Servizio</dt><dd><strong>${s.nome}</strong></dd>
      <dt>Durata</dt><dd>${minutiATesto(s.durata)}</dd>
      <dt>Prezzo</dt><dd>${prezzoTesto(s)}</dd>
      <dt>Quando</dt><dd>${dataBreve(stato.giorno)} · ore ${stato.ora}</dd>
      <dt>Cliente</dt><dd>${stato.cliente.nome} ${stato.cliente.cognome} · ${stato.cliente.telefono}</dd>
      ${risposteTesto}
      ${stato.foto.length ? `<dt>Foto allegate</dt><dd><div class="foto-mini">${stato.foto.map((f) => `<img src="${f}" alt="foto" />`).join("")}</div></dd>` : ""}
    </dl>`;
  pannello.appendChild(riepilogo);

  const titoloPag = document.createElement("h3");
  titoloPag.style.cssText = "margin-bottom: 0.9rem; font-size: 1.25rem;";
  titoloPag.textContent = "Come vuoi garantire il tuo posto?";
  pannello.appendChild(titoloPag);

  const opzioni = document.createElement("div");
  opzioni.className = "opzioni-pagamento";
  opzioni.innerHTML = `
    <button class="opzione-pag ${stato.pagamento === "caparra" ? "scelto" : ""}" data-pag="caparra">
      <span class="radio"></span>
      <span>
        <strong>💳 Paga la caparra di ${euro(SALONE.caparra)} ora — consigliato</strong>
        <span>Il tuo appuntamento è <b>garantito</b>. La caparra verrà <b>scalata dal costo totale</b> del trattamento.</span>
      </span>
    </button>
    <button class="opzione-pag ${stato.pagamento === "salone" ? "scelto" : ""}" data-pag="salone">
      <span class="radio"></span>
      <span>
        <strong>🏠 Paga tutto in centro</strong>
        <span>Nessun pagamento online. Ti chiediamo solo di avvisarci se non puoi venire 🙏</span>
      </span>
    </button>`;
  opzioni.querySelectorAll("[data-pag]").forEach((b) =>
    b.addEventListener("click", () => { stato.pagamento = b.dataset.pag; renderStep6(); })
  );
  pannello.appendChild(opzioni);

  if (stato.pagamento === "caparra") {
    const carta = document.createElement("div");
    carta.className = "form-carta";
    carta.innerHTML = `
      <div class="campo">
        <label for="c-numero">Numero carta</label>
        <input id="c-numero" type="text" inputmode="numeric" placeholder="4242 4242 4242 4242" maxlength="19" />
      </div>
      <div class="fila">
        <div class="campo">
          <label for="c-scadenza">Scadenza</label>
          <input id="c-scadenza" type="text" inputmode="numeric" placeholder="MM/AA" maxlength="5" />
        </div>
        <div class="campo">
          <label for="c-cvc">CVC</label>
          <input id="c-cvc" type="text" inputmode="numeric" placeholder="123" maxlength="4" />
        </div>
      </div>
      <div class="campo" style="margin-bottom:0;">
        <label for="c-intestatario">Intestatario</label>
        <input id="c-intestatario" type="text" placeholder="${stato.cliente.nome} ${stato.cliente.cognome}" />
      </div>
      <div class="badge-sicuro">🔒 Pagamento sicuro con crittografia — demo: nessun addebito reale (powered by Stripe)</div>`;

    // Formattazione live del numero carta e della scadenza
    carta.querySelector("#c-numero").addEventListener("input", (e) => {
      e.target.value = e.target.value.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
    });
    carta.querySelector("#c-scadenza").addEventListener("input", (e) => {
      let v = e.target.value.replace(/\D/g, "").slice(0, 4);
      if (v.length > 2) v = v.slice(0, 2) + "/" + v.slice(2);
      e.target.value = v;
    });
    pannello.appendChild(carta);
  }

  const testoBottone =
    stato.pagamento === "caparra" ? `Paga ${euro(SALONE.caparra)} e conferma ✓`
    : stato.pagamento === "salone" ? "Conferma la prenotazione ✓"
    : "Scegli un'opzione qui sopra";

  pannello.appendChild(navStep({
    indietro: true,
    avantiTesto: testoBottone,
    avantiAbilitato: !!stato.pagamento,
    onAvanti: () => {
      if (!stato.pagamento) return toast("Scegli come garantire il posto 🙂");
      if (stato.pagamento === "caparra") {
        const num = document.getElementById("c-numero").value.replace(/\s/g, "");
        const scad = document.getElementById("c-scadenza").value;
        const cvc = document.getElementById("c-cvc").value;
        if (num.length < 16) return toast("Il numero carta deve avere 16 cifre");
        if (!/^\d{2}\/\d{2}$/.test(scad)) return toast("Scadenza nel formato MM/AA");
        if (cvc.length < 3) return toast("CVC mancante");
      }
      salvaPrenotazione();
    },
  }));
}

/* ============================================================
   Salvataggio + schermata di conferma
   ============================================================ */

function salvaPrenotazione() {
  const quando = new Date(stato.giorno);
  const [h, m] = stato.ora.split(":").map(Number);
  quando.setHours(h, m, 0, 0);

  const prenotazione = {
    id: "P" + Date.now().toString(36).toUpperCase(),
    creataIl: new Date().toISOString(),
    dataISO: quando.toISOString(),
    ora: stato.ora,
    servizioId: stato.servizio.id,
    servizioNome: stato.servizio.nome,
    durata: stato.servizio.durata,
    prezzo: stato.servizio.prezzo,
    prezzoDa: !!stato.servizio.da,
    risposte: { ...stato.risposte },
    quiz: stato.servizio.quiz,
    foto: [...stato.foto],
    cliente: { ...stato.cliente },
    pagamento: stato.pagamento,               // "caparra" | "salone"
    caparra: stato.pagamento === "caparra" ? SALONE.caparra : 0,
    stato: "nuova",                            // nuova | confermata | completata
    origine: new URLSearchParams(location.search).get("da") === "instagram" ? "instagram" : "sito",
  };

  const lista = leggiPrenotazioni();
  lista.push(prenotazione);
  try { salvaPrenotazioni(lista); }
  catch {
    // localStorage pieno (le foto pesano): salva senza foto piuttosto che fallire.
    prenotazione.foto = [];
    lista[lista.length - 1] = prenotazione;
    salvaPrenotazioni(lista);
    toast("Foto troppo pesanti: prenotazione salvata senza foto");
  }
  renderConferma(prenotazione);
  renderStepper();
  scrollSu();
}

function renderConferma(p) {
  stepperEl.innerHTML = STEP_LABELS.map(() => `<div class="step fatto"></div>`).join("");
  const dataTesto = dataBreve(new Date(p.dataISO));
  pannello.innerHTML = `
    <div class="conferma">
      <div class="spunta">✓</div>
      <h2>Ti aspettiamo ${dataTesto} alle ${p.ora}!</h2>
      <p><strong>${p.servizioNome}</strong> per ${p.cliente.nome} ${p.cliente.cognome}.</p>
      ${p.pagamento === "caparra"
        ? `<p>Caparra di ${euro(p.caparra)} ricevuta ✓ — verrà scalata dal costo del trattamento. Il tuo posto è garantito.</p>`
        : `<p>Pagherai direttamente in centro. Se non puoi venire, avvisaci al ${SALONE.telefono} 🙏</p>`}
      ${p.foto.length ? `<p>Abbiamo ricevuto le tue ${p.foto.length} foto: le vedrà solo il centro 📸</p>` : ""}
      <p style="margin-top:1rem; font-size:0.86rem;">Codice prenotazione: <strong>${p.id}</strong></p>
      <div style="display:flex; gap:0.9rem; justify-content:center; flex-wrap:wrap; margin-top:2rem;">
        <a class="btn btn-primario" href="index.html">Torna al sito</a>
        <a class="btn btn-fantasma" href="prenota.html">Nuova prenotazione</a>
      </div>
    </div>`;
}

/* ---------- Router ---------- */

function render() {
  [renderStep1, renderStep2, renderStep3, renderStep4, renderStep5, renderStep6][stato.step - 1]();
}

renderStepper();
render();
