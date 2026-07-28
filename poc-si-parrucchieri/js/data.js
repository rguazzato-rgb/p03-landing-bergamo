// Durata: LEGATO-A:P03
/* ============================================================
   SI Parrucchieri Treviglio — dati del PoC
   Catalogo servizi, orari, questionari, prodotti.
   Tutti i contenuti provengono dal sito reale
   https://www.siparrucchieritreviglio.com/ (rilevati 2026-07-02).
   ============================================================ */

const SALONE = {
  nome: "SI Parrucchieri",
  citta: "Treviglio",
  claim: "Ci dedichiamo alla salute e alla bellezza dal 1993",
  filosofia:
    "L'equilibrio perfetto tra salute, bellezza e rispetto per la natura. " +
    "Specializzati nei trattamenti a chimica verde con prodotti biorganici, " +
    "nelle colorazioni con erbe tintorie e nei trattamenti con ossigeno e ozono terapia.",
  indirizzo: "P.zza Garibaldi 8, 24047 Treviglio (BG)",
  telefono: "339 120 9059",
  telefonoLink: "+393391209059",
  email: "siparrucchieritreviglio@gmail.com",
  instagram: "siparrucchieri.treviglio",
  instagramUrl: "https://www.instagram.com/siparrucchieri.treviglio/",
  mapsQuery: "SI Parrucchieri, Piazza Garibaldi 8, Treviglio BG",
  // getDay(): 0=Dom ... 6=Sab. Orari in ore decimali.
  orari: {
    0: null,               // Domenica chiuso
    1: null,               // Lunedì chiuso
    2: [9, 18.5],          // Martedì 09:00–18:30
    3: [14, 22],           // Mercoledì 14:00–22:00
    4: [9, 18.5],          // Giovedì
    5: [9, 18.5],          // Venerdì
    6: [9, 18.5],          // Sabato
  },
  orariTesto: [
    ["Lunedì", "Chiuso"],
    ["Martedì", "09:00 – 18:30"],
    ["Mercoledì", "14:00 – 22:00"],
    ["Giovedì", "09:00 – 18:30"],
    ["Venerdì", "09:00 – 18:30"],
    ["Sabato", "09:00 – 18:30"],
    ["Domenica", "Chiuso"],
  ],
  caparra: 15, // € richiesti come caparra alla prenotazione
};

/* ---------- Catalogo servizi (nomi e prezzi dal sito reale) ---------- */

const CATEGORIE = [
  { id: "taglio", nome: "Tagli", icona: "✂️", desc: "Tagli personalizzati per lei e per lui" },
  { id: "colore", nome: "Colorazioni", icona: "🌿", desc: "Colori naturali, erbe tintorie e nuance su misura" },
  { id: "trattamento", nome: "Trattamenti & Rituali", icona: "💧", desc: "Ossigeno, ozono e rituali per la salute di capelli e cute" },
];

const SERVIZI = [
  // --- Tagli ---
  { id: "taglio-lei", cat: "taglio", nome: "Taglio personalizzato · Lei", durata: 45, prezzo: 38.7, da: true,
    desc: "Consulenza d'immagine, taglio su misura e piega finale.", top: true, quiz: "taglio-lei",
    img: "img/servizio-taglio-lei.png" },
  { id: "taglio-lui", cat: "taglio", nome: "Taglio Lui con ozono", durata: 45, prezzo: 35.1, da: true,
    desc: "Taglio maschile con detersione all'ozono per una cute sana.", top: true, quiz: "taglio-lui",
    img: "img/servizio-taglio-lui.png" },

  // --- Colorazioni ---
  { id: "col-argan", cat: "colore", nome: "Nettare colorante all'olio d'Argan", durata: 90, prezzo: 55, da: true,
    desc: "Colorazione nutriente con olio d'Argan, copertura piena e brillantezza.", top: true, quiz: "colore",
    img: "img/servizio-colorazione-argan.png" },
  { id: "col-erbe", cat: "colore", nome: "Erbe tintorie — colore 100% naturale", durata: 120, prezzo: 65, da: true,
    desc: "Il colore botanico Myveg: solo erbe tintorie, zero chimica aggressiva.", top: true, quiz: "colore",
    img: "img/servizio-erbe-tintorie.png" },
  { id: "col-natural", cat: "colore", nome: "Natural Color", durata: 90, prezzo: 60, da: true,
    desc: "Copertura naturale dei capelli bianchi, effetto non trattato.", quiz: "colore" },
  { id: "col-3d", cat: "colore", nome: "Colore in 3D", durata: 120, prezzo: 75, da: true,
    desc: "Giochi di profondità e riflessi multidimensionali.", quiz: "colore" },
  { id: "col-vegano", cat: "colore", nome: "Colore vegano", durata: 90, prezzo: 60, da: true,
    desc: "Formula vegana certificata, delicata su cute e lunghezze.", quiz: "colore" },
  { id: "col-luce", cat: "colore", nome: "Effetto luce / mediterraneo", durata: 120, prezzo: 80, da: true,
    desc: "Schiariture soft che illuminano il viso, ispirate alla luce del sud.", quiz: "colore" },
  { id: "col-sunkiss", cat: "colore", nome: "Sun kiss", durata: 105, prezzo: 78, da: true,
    desc: "L'effetto baciato dal sole, naturale e senza stacchi.", quiz: "colore" },
  { id: "col-circadiano", cat: "colore", nome: "Colore circadiano", durata: 90, prezzo: 70, da: true,
    desc: "Colorazione che rispetta i ritmi naturali di cute e capello.", quiz: "colore" },
  { id: "col-hydra", cat: "colore", nome: "Colore hydra-beauty", durata: 90, prezzo: 72, da: true,
    desc: "Colore e idratazione profonda in un unico servizio.", quiz: "colore" },
  { id: "col-lenitive", cat: "colore", nome: "Colorazioni lenitive", durata: 90, prezzo: 68, da: true,
    desc: "Pensate per le cuti più sensibili, con attivi calmanti.", quiz: "colore" },

  // --- Trattamenti & Rituali ---
  { id: "tr-rigenedia", cat: "trattamento", nome: "Rigenedia con ossigenoterapia", durata: 45, prezzo: 35, da: true,
    desc: "Rigenerazione della cute con ossigeno puro.", top: true, quiz: "trattamento",
    img: "img/servizio-rigenedia-ossigeno.png" },
  { id: "tr-elisir", cat: "trattamento", nome: "Elisir ristrutturante", durata: 60, prezzo: 55, da: true,
    desc: "Ricostruzione profonda della fibra per capelli stressati.", quiz: "trattamento" },
  { id: "tr-olistico", cat: "trattamento", nome: "Rituale olistico cutaneo", durata: 60, prezzo: 60, da: true,
    desc: "Un rituale benessere che parte dalla cute, tra oli ed essenze.", quiz: "trattamento" },
  { id: "tr-energizzante", cat: "trattamento", nome: "Percorso energizzante con ossigeno", durata: 60, prezzo: 58, da: true,
    desc: "Stimola il microcircolo e contrasta la caduta stagionale.", quiz: "trattamento" },
  { id: "tr-metamorfosi", cat: "trattamento", nome: "Metamorfosi liscio sublime", durata: 150, prezzo: 159, da: false,
    desc: "Il liscio perfetto e duraturo, senza formaldeide.", quiz: "trattamento" },
  { id: "tr-ondulazione", cat: "trattamento", nome: "Ondulazione", durata: 120, prezzo: 85, da: true,
    desc: "Onde morbide e naturali che durano nel tempo.", quiz: "trattamento" },
  { id: "tr-bellezza", cat: "trattamento", nome: "Percorso bellezza", durata: 90, prezzo: 75, da: true,
    desc: "Il percorso completo: cute, lunghezze e styling.", quiz: "trattamento" },
  { id: "tr-ossigeno-viso", cat: "trattamento", nome: "Ossigeno terapia viso", durata: 45, prezzo: 45, da: true,
    desc: "Ossigenazione della pelle del viso, effetto glow immediato.", quiz: "trattamento" },
  { id: "tr-lunghezze", cat: "trattamento", nome: "Lunghezze ozono / ossigeno", durata: 60, prezzo: 50, da: true,
    desc: "Trattamento specifico per lunghezze sfibrate con ozono e ossigeno.", quiz: "trattamento" },
  { id: "tr-riequilibrante", cat: "trattamento", nome: "Riequilibrante / deforforante", durata: 60, prezzo: 52, da: true,
    desc: "Riequilibra la cute grassa o con forfora, in modo naturale.", quiz: "trattamento" },
];

/* ---------- Questionari intelligenti per servizio ----------
   Ogni quiz: lista di domande {id, label, tipo, opzioni?, placeholder?}
   tipo: "scelta" (chip radio) | "testo" (textarea breve) ------------- */

const QUESTIONARI = {
  "taglio-lei": [
    { id: "lunghezza", label: "Qual è la lunghezza attuale dei tuoi capelli?", tipo: "scelta",
      opzioni: ["Corti", "Medi", "Lunghi", "Molto lunghi"] },
    { id: "cambio", label: "Che tipo di taglio hai in mente?", tipo: "scelta",
      opzioni: ["Solo una spuntatina", "Rimodellare il taglio attuale", "Un cambio deciso", "Mi affido a voi ✨"] },
    { id: "frangia", label: "Frangia o ciuffo?", tipo: "scelta",
      opzioni: ["Sì, la voglio", "Ce l'ho già, da sistemare", "No, grazie", "Da valutare insieme"] },
    { id: "note", label: "Vuoi dirci qualcos'altro? (facoltativo)", tipo: "testo",
      placeholder: "Es. capelli ricci difficili da gestire, evento speciale in arrivo…" },
  ],
  "taglio-lui": [
    { id: "lunghezza", label: "Che lunghezza desideri?", tipo: "scelta",
      opzioni: ["Rasatura / molto corto", "Corto", "Medio", "Solo una sistemata"] },
    { id: "sfumatura", label: "Sfumatura ai lati?", tipo: "scelta",
      opzioni: ["Sì, alta", "Sì, bassa", "No", "Consigliatemi voi"] },
    { id: "barba", label: "Sistemiamo anche la barba?", tipo: "scelta",
      opzioni: ["Sì", "No", "Non ho la barba"] },
    { id: "note", label: "Note per noi? (facoltativo)", tipo: "testo",
      placeholder: "Es. cute sensibile, doppio ciuffo, preferenze particolari…" },
  ],
  "colore": [
    { id: "base", label: "Qual è il tuo colore naturale attuale?", tipo: "scelta",
      opzioni: ["Biondo", "Castano chiaro", "Castano scuro", "Nero", "Rosso", "Bianco / brizzolato"] },
    { id: "storia", label: "Hai già una colorazione in corso?", tipo: "scelta",
      opzioni: ["No, capelli naturali", "Sì, colorazione classica", "Sì, hennè o erbe tintorie", "Sì, decolorazione/meches"] },
    { id: "direzione", label: "Vuoi schiarire o scurire?", tipo: "scelta",
      opzioni: ["Schiarire", "Scurire", "Restare sul mio tono", "Coprire i bianchi"] },
    { id: "effetto", label: "Che effetto desideri?", tipo: "scelta",
      opzioni: ["Colore pieno", "Meches", "Balayage", "Shatush", "Non so, consigliatemi"] },
    { id: "note", label: "Note per noi? (facoltativo)", tipo: "testo",
      placeholder: "Es. cute sensibile, allergie note, risultato di una foto che ami…" },
  ],
  "trattamento": [
    { id: "problema", label: "Qual è il problema principale?", tipo: "scelta",
      opzioni: ["Secchezza", "Doppie punte", "Caduta", "Cute grassa", "Cute sensibile", "Forfora", "Nessuno, solo benessere"] },
    { id: "esperienza", label: "Hai già fatto trattamenti simili?", tipo: "scelta",
      opzioni: ["Sì, in questo salone", "Sì, altrove", "No, è la prima volta"] },
    { id: "note", label: "Note per noi? (facoltativo)", tipo: "testo",
      placeholder: "Es. da quanto tempo noti il problema, prodotti che stai usando…" },
  ],
};

/* ---------- Linea prodotti (nomi reali dal sito) ---------- */

const PRODOTTI = [
  { nome: "Armonia", tipo: "Shampoo delicato", prezzo: 16.9, tag: "cute", img: "img/prodotto-armonia.png" },
  { nome: "Idra Bagno Radioso", tipo: "Bagno idratante", prezzo: 19.9, tag: "idratazione", img: "img/prodotto-idra-bagno-radioso.png" },
  { nome: "Bruma Tonica Bifasica", tipo: "Spray districante", prezzo: 22.0, tag: "styling", img: "img/prodotto-bruma-tonica.png" },
  { nome: "Nettare Solare", tipo: "Protezione sole", prezzo: 24.5, tag: "protezione", img: "img/prodotto-nettare-solare.png" },
  { nome: "Narciso", tipo: "Maschera nutriente", prezzo: 28.0, tag: "nutrimento", img: "img/prodotto-narciso.png" },
  { nome: "Echo", tipo: "Siero lunghezze", prezzo: 32.0, tag: "riparazione", img: "img/prodotto-echo.png" },
  { nome: "Ambrosia", tipo: "Olio elisir", prezzo: 39.0, tag: "lucentezza", img: "img/prodotto-ambrosia.png" },
  { nome: "Rituale Viso", tipo: "Maschera viso all'ossigeno", prezzo: 69.0, tag: "viso", img: "img/prodotto-rituale-viso.png" },
];

/* ---------- Recensioni reali (dal sito) ---------- */

const RECENSIONI = [
  { nome: "Emanuela", testo: "Ho sempre fatto l'hennè e ho voluto provare la colorazione con erbe tintorie Myveg: un bellissimo colore, capelli sani e lucidi. Ivan e lo staff sono competenti e pazienti." },
  { nome: "Sabrina", testo: "Un'esperienza che ha superato di gran lunga le mie aspettative: accoglienza calorosa, ambiente impeccabile e la professionalità di Ivan e Lara. Taglio e colore perfetti, e ottimi consigli per la cura a casa." },
  { nome: "Teodora", testo: "Sono davvero soddisfatta del lavoro di SI Parrucchieri, sono bravissimi. Innovativi, con una linea di prodotti propria e un approccio personalizzato. Lo consiglio per uomini, donne e bambini." },
];

/* ---------- Team (nomi reali dal sito) ---------- */

const TEAM = [
  { nome: "Ivan", ruolo: "Hair stylist & fondatore", bio: "Dal 1993 guida il salone con la filosofia della chimica verde.", img: "img/team-ivan.png" },
  { nome: "Lara", ruolo: "Color specialist", bio: "Specialista di erbe tintorie e colorazioni naturali.", img: "img/team-lara.png" },
  { nome: "Nicole", ruolo: "Hair stylist", bio: "Tagli, styling e rituali benessere.", img: "img/team-nicole.png" },
];

/* ---------- Utility condivise ---------- */

const STORAGE_KEY = "sip_prenotazioni";
const CLIENTE_KEY = "sip_cliente";

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
function servizioById(id) {
  return SERVIZI.find((s) => s.id === id);
}
function minutiATesto(min) {
  if (min < 60) return min + " min";
  const h = Math.floor(min / 60), m = min % 60;
  return m ? `${h}h ${m}min` : `${h}h`;
}
