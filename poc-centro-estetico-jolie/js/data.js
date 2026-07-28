// Durata: LEGATO-A:P03
/* ============================================================
   Centro Estetico Jolie (Gazzaniga, BG) — dati del PoC
   Catalogo servizi, orari, questionari.
   Contatti/indirizzo/rating/servizi da ricerca web (2026-07-08),
   sito ufficiale centroesteticojolie.com OFFLINE (dominio morto —
   è il motivo per cui questo PoC esiste).
   Nessun prezzo, nome del personale o testo di recensione è stato
   inventato: dove il dato reale non era reperibile è segnalato
   esplicitamente ("preventivo gratuito" invece di un prezzo finto).
   ============================================================ */

const SALONE = {
  nome: "Centro Estetico Jolie",
  citta: "Gazzaniga",
  claim: "Il tuo momento di bellezza e benessere, nel cuore della Valle Seriana",
  filosofia:
    "Un team di 6 estetiste specializzate in trattamenti viso, corpo e nelle " +
    "tecnologie estetiche più moderne — luce pulsata, Velasmooth, Oxys. " +
    "Aggiornamento continuo sulle ultime tecniche per soluzioni su misura per ogni tipo di pelle.",
  indirizzo: "Piazzale Stazione 9, 24025 Gazzaniga (BG)",
  telefono: "035 738178",
  telefonoLink: "+39035738178",
  instagram: "jolie.centroestetico",
  instagramUrl: "https://www.instagram.com/jolie.centroestetico/",
  mapsQuery: "Centro Estetico Jolie, Piazzale Stazione 9, Gazzaniga BG",
  ratingGoogle: 4.8,
  recensioniGoogle: 66,
  // getDay(): 0=Dom ... 6=Sab. Orari in ore decimali.
  // ⏳ da riverificare: fonti online discordanti su lunedì/orario chiusura, usata la più recente/coerente.
  orari: {
    0: null,          // Domenica chiuso
    1: null,          // Lunedì chiuso
    2: [9, 20],        // Martedì
    3: [9, 20],        // Mercoledì
    4: [9, 20],        // Giovedì
    5: [9, 20],        // Venerdì
    6: [9, 17],        // Sabato
  },
  orariTesto: [
    ["Lunedì", "Chiuso"],
    ["Martedì", "09:00 – 20:00"],
    ["Mercoledì", "09:00 – 20:00"],
    ["Giovedì", "09:00 – 20:00"],
    ["Venerdì", "09:00 – 20:00"],
    ["Sabato", "09:00 – 17:00"],
    ["Domenica", "Chiuso"],
  ],
  caparra: 10, // € richiesti come caparra alla prenotazione — importo illustrativo del PoC, non una policy reale del centro
};

/* ---------- Catalogo servizi ----------
   Nomi dei trattamenti verificati da fonti reali (Google Business, directory
   di settore). Durate: stime tipiche di categoria per far funzionare la demo
   di prenotazione, NON confermate col titolare — vedi README § Note tecniche.
   Prezzi: nessuno reperito online → "preventivo gratuito" invece di un numero. */

const CATEGORIE = [
  { id: "viso", nome: "Viso", icona: "✨", desc: "Pulizia profonda e trattamenti ossigenanti per la pelle del viso" },
  { id: "corpo", nome: "Corpo & Massaggi", icona: "🤍", desc: "Massaggi, rimodellamento e benessere per il corpo" },
  { id: "epilazione", nome: "Epilazione", icona: "💫", desc: "Epilazione a luce pulsata, risultati progressivi e duraturi" },
  { id: "makeup", nome: "Make up", icona: "💄", desc: "Trucco per cerimonie, eventi e occasioni speciali" },
];

const SERVIZI = [
  // --- Viso ---
  { id: "viso-pulizia", cat: "viso", nome: "Pulizia viso", durata: 60,
    desc: "Pulizia profonda con estrazioni ed esfoliazione, per una pelle visibilmente più luminosa.",
    top: true, quiz: "viso" },
  { id: "viso-oxys", cat: "viso", nome: "Trattamento viso Oxys", durata: 50,
    desc: "Trattamento ossigenante che dona freschezza e compattezza alla pelle del viso.",
    top: true, quiz: "viso" },

  // --- Corpo & Massaggi ---
  { id: "corpo-rilassante", cat: "corpo", nome: "Massaggio rilassante", durata: 50,
    desc: "Massaggio corpo completo per sciogliere le tensioni e ritrovare energia.",
    top: true, quiz: "corpo" },
  { id: "corpo-linfodrenante", cat: "corpo", nome: "Massaggio linfodrenante anticellulite", durata: 50,
    desc: "Massaggio drenante mirato a favorire la circolazione e contrastare la cellulite.",
    top: true, quiz: "corpo" },
  { id: "corpo-velasmooth", cat: "corpo", nome: "Trattamento Velasmooth", durata: 45,
    desc: "Tecnologia rimodellante per il contorno corpo, con radiofrequenza e infrarossi.",
    quiz: "corpo" },

  // --- Epilazione ---
  { id: "epil-luce-pulsata", cat: "epilazione", nome: "Epilazione a luce pulsata", durata: 30,
    desc: "Epilazione progressiva e duratura con tecnologia a luce pulsata, su viso e corpo.",
    top: true, quiz: "epilazione" },

  // --- Make up ---
  { id: "makeup-evento", cat: "makeup", nome: "Trucco per cerimonie ed eventi", durata: 40,
    desc: "Trucco personalizzato per il tuo giorno speciale, dalla prova al grande evento.",
    quiz: "makeup" },
];

/* ---------- Questionari intelligenti per servizio ---------- */

const QUESTIONARI = {
  "viso": [
    { id: "pelle", label: "Come definiresti la tua pelle?", tipo: "scelta",
      opzioni: ["Normale", "Grassa", "Secca", "Mista", "Sensibile"] },
    { id: "problema", label: "Qual è la tua esigenza principale?", tipo: "scelta",
      opzioni: ["Punti neri / impurità", "Secchezza", "Prime rughe", "Macchie", "Solo relax e prevenzione"] },
    { id: "note", label: "Vuoi dirci qualcos'altro? (facoltativo)", tipo: "testo",
      placeholder: "Es. allergie note, prodotti che stai già usando…" },
  ],
  "corpo": [
    { id: "zona", label: "Su quale zona vuoi concentrarti?", tipo: "scelta",
      opzioni: ["Gambe", "Addome", "Glutei", "Schiena", "Tutto il corpo"] },
    { id: "obiettivo", label: "Qual è il tuo obiettivo?", tipo: "scelta",
      opzioni: ["Relax e decontrazione", "Drenaggio / gambe leggere", "Rimodellamento", "Non so, consigliatemi"] },
    { id: "note", label: "Note per noi? (facoltativo)", tipo: "testo",
      placeholder: "Es. zone da evitare, problemi di circolazione…" },
  ],
  "epilazione": [
    { id: "zona", label: "Quale zona vuoi trattare?", tipo: "scelta",
      opzioni: ["Viso", "Gambe intere", "Mezza gamba", "Ascelle", "Inguine", "Braccia"] },
    { id: "prima-volta", label: "È la tua prima epilazione a luce pulsata?", tipo: "scelta",
      opzioni: ["Sì, prima volta", "No, l'ho già fatta qui", "No, l'ho fatta altrove"] },
    { id: "note", label: "Note per noi? (facoltativo)", tipo: "testo",
      placeholder: "Es. fototipo, esposizione solare recente…" },
  ],
  "makeup": [
    { id: "occasione", label: "Per quale occasione?", tipo: "scelta",
      opzioni: ["Cerimonia / matrimonio", "Evento / serata", "Servizio fotografico", "Prova trucco sposa"] },
    { id: "stile", label: "Che stile preferisci?", tipo: "scelta",
      opzioni: ["Naturale", "Elegante", "Deciso / glam", "Mi affido a voi ✨"] },
    { id: "note", label: "Note per noi? (facoltativo)", tipo: "testo",
      placeholder: "Es. colori dell'abito, foto di ispirazione…" },
  ],
};

/* ---------- Utility condivise ---------- */

const STORAGE_KEY = "jolie_prenotazioni";
const CLIENTE_KEY = "jolie_cliente";

function leggiPrenotazioni() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
  catch { return []; }
}
function salvaPrenotazioni(lista) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
}
function euro(n) {
  return "€" + n.toFixed(2).replace(".", ",").replace(",00", "");
}
function prezzoTesto(s) {
  // Nessun prezzo reale reperito online per questi trattamenti: mai inventare un numero.
  return s && s.prezzo != null ? (s.da ? "da " : "") + euro(s.prezzo) : "Preventivo gratuito";
}
function servizioById(id) {
  return SERVIZI.find((s) => s.id === id);
}
function minutiATesto(min) {
  if (min < 60) return min + " min";
  const h = Math.floor(min / 60), m = min % 60;
  return m ? `${h}h ${m}min` : `${h}h`;
}
