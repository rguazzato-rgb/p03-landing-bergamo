// Durata: LEGATO-A:P03
/* =====================================================================
   Pizzeria Il Girasole — Stampa ordini (pagina interna, uso titolare)
   ---------------------------------------------------------------------
   Ogni mattina: apri questa pagina, scegli la data, "Carica ordini",
   "Stampa". Ogni ordine esce come un cartellino ritagliabile con via,
   paese, pizze, orario e prezzo — da aggiungere ai fogli cartacei.

   >>> DA CONFIGURARE, STESSI VALORI DI ordina.js <<<
   endpoint = lo stesso URL /exec del backend.
   chiave   = la stessa CHIAVE_STAMPA impostata nel file .gs (senza,
              nessuno può leggere nome/telefono/indirizzo dei clienti).
   ===================================================================== */

const CONFIG = {
  endpoint: "",
  chiave: "girasole-2026-cambiami",
};

function dataOggiISO() {
  return new Date().toISOString().slice(0, 10);
}
function dataDomaniISO() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

const inputData = document.getElementById("f-data-stampa");
const statoEl = document.getElementById("stato-caricamento");
const cont = document.getElementById("slip-container");

inputData.value = dataDomaniISO();

document.getElementById("btn-carica").addEventListener("click", caricaOrdini);
document.getElementById("btn-stampa").addEventListener("click", () => window.print());

function euro(n) {
  const v = typeof n === "number" ? n : parseFloat(n) || 0;
  return "€" + v.toFixed(2).replace(".", ",");
}

async function caricaOrdini() {
  const data = inputData.value;
  if (!data) return;

  if (!CONFIG.endpoint) {
    statoEl.textContent = "⚠️ Backend non ancora configurato: incolla l'URL /exec in CONFIG.endpoint (vedi documentazione interna).";
    cont.innerHTML = "";
    return;
  }

  statoEl.textContent = "Carico...";
  cont.innerHTML = "";

  try {
    const url = `${CONFIG.endpoint}?chiave=${encodeURIComponent(CONFIG.chiave)}&data=${encodeURIComponent(data)}`;
    const res = await fetch(url);
    const body = await res.json();

    if (!body.ok) {
      statoEl.textContent = "Errore: " + (body.error || "richiesta non riuscita");
      return;
    }

    renderSlip(body.ordini, data);
  } catch (err) {
    statoEl.textContent = "Errore di connessione al backend: " + err.message;
  }
}

function renderSlip(ordini, data) {
  const dataLeggibile = new Date(data + "T00:00:00").toLocaleDateString("it-IT", {
    weekday: "long", day: "numeric", month: "long",
  });

  if (!ordini.length) {
    statoEl.textContent = `Nessun ordine per ${dataLeggibile}.`;
    cont.innerHTML = "";
    return;
  }

  statoEl.textContent = `${ordini.length} ordine/i per ${dataLeggibile} — pronto per la stampa.`;

  cont.innerHTML = ordini.map((o) => `
    <div class="slip">
      <div class="slip-header">
        <span class="slip-tipo">${o.tipo === "consegna" ? "🛵 CONSEGNA" : "🏠 RITIRO"}</span>
        <span class="slip-orario">${o.ora}</span>
      </div>
      <div class="slip-cliente">
        <strong>${o.nome}</strong> — ${o.telefono}
      </div>
      ${o.tipo === "consegna" ? `<div class="slip-indirizzo">${o.via}, ${o.paese}</div>` : ""}
      <div class="slip-pizze">${o.pizze}</div>
      ${o.note ? `<div class="slip-note">Note: ${o.note}</div>` : ""}
      <div class="slip-footer">
        <span>Ordine ${o.id}</span>
        <strong>${euro(o.totale)}</strong>
      </div>
    </div>
  `).join("");
}

// Precarica automaticamente all'apertura se il backend è già configurato
if (CONFIG.endpoint) caricaOrdini();
