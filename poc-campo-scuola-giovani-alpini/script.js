// Durata: LEGATO-A:P03
// Campo Scuola Giovani Alpini — interattività: menu mobile, scroll reveal, lightbox, accordion, calendario/galleria filtri

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initScrollReveal();
  initAccordion();
  initGalleryFilters();
  initLightbox();
  initEventFilters();
  initForms();
  initFormsBackend();
  initAccessoBozze();
  initHeroCarousel();
  initPdfDownload();
  initPdfDownloadAps();
  initMerchSizes();
});

/* --- Carosello foto drone nell'header hero (index) --- */
function initHeroCarousel() {
  const slides = document.querySelectorAll('.hero-slide');
  if (slides.length < 2) return;

  let current = Math.max(0, [...slides].findIndex(s => s.classList.contains('is-active')));
  setInterval(() => {
    slides[current].classList.remove('is-active');
    current = (current + 1) % slides.length;
    slides[current].classList.add('is-active');
  }, 5000);
}

/* --- Navbar sticky + hamburger mobile --- */
function initNavbar() {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    const isOpen = links.classList.toggle('is-open');
    toggle.classList.toggle('is-open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      links.classList.remove('is-open');
      toggle.classList.remove('is-open');
    });
  });
}

/* --- Fade-in / slide-up al passaggio in viewport --- */
function initScrollReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  if (!('IntersectionObserver' in window)) {
    items.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  items.forEach(el => observer.observe(el));
}

/* --- Accordion FAQ --- */
function initAccordion() {
  const triggers = document.querySelectorAll('.accordion-trigger');
  if (!triggers.length) return;

  triggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const item = trigger.closest('.accordion-item');
      const panel = item.querySelector('.accordion-panel');
      const isOpen = item.classList.contains('is-open');

      // chiudi le altre nella stessa categoria (comportamento accordion classico)
      const group = item.closest('.faq-category') || document;
      group.querySelectorAll('.accordion-item.is-open').forEach(other => {
        if (other !== item) {
          other.classList.remove('is-open');
          other.querySelector('.accordion-panel').style.maxHeight = null;
        }
      });

      if (isOpen) {
        item.classList.remove('is-open');
        panel.style.maxHeight = null;
      } else {
        item.classList.add('is-open');
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    });
  });
}

/* --- Filtri galleria per edizione/anno --- */
function initGalleryFilters() {
  const filters = document.querySelectorAll('.gallery-filters .filter-btn');
  const items = document.querySelectorAll('.gallery-item');
  if (!filters.length || !items.length) return;

  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      filters.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      items.forEach(item => {
        const match = filter === 'tutti' || item.dataset.edizione === filter;
        item.style.display = match ? '' : 'none';
      });
    });
  });
}

/* --- Filtri calendario per tipo evento --- */
function initEventFilters() {
  const filters = document.querySelectorAll('.calendar-toolbar .filter-btn');
  const rows = document.querySelectorAll('.calendar-row');
  if (!filters.length || !rows.length) return;

  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      filters.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      rows.forEach(row => {
        const match = filter === 'tutti' || row.dataset.tipo === filter;
        row.style.display = match ? '' : 'none';
      });
    });
  });
}

/* --- Lightbox galleria --- */
function initLightbox() {
  const lightbox = document.querySelector('.lightbox');
  const items = document.querySelectorAll('.gallery-item');
  if (!lightbox || !items.length) return;

  const contentText = lightbox.querySelector('.lightbox-content .placeholder');
  const lightboxImg = lightbox.querySelector('.lightbox-content .lightbox-img');
  const caption = lightbox.querySelector('.lightbox-caption');
  const closeBtn = lightbox.querySelector('.lightbox-close');
  const prevBtn = lightbox.querySelector('.lightbox-prev');
  const nextBtn = lightbox.querySelector('.lightbox-next');

  let visibleItems = [];
  let currentIndex = 0;

  function refreshVisibleItems(group) {
    visibleItems = Array.from(items).filter(item =>
      item.style.display !== 'none' && (item.dataset.group || '') === group
    );
  }

  function openAt(item) {
    refreshVisibleItems(item.dataset.group || '');
    currentIndex = visibleItems.indexOf(item);
    render();
    lightbox.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function render() {
    const item = visibleItems[currentIndex];
    if (!item) return;
    const label = item.dataset.caption || item.querySelector('.placeholder')?.textContent.trim() || '';
    const imgSrc = item.dataset.img || item.querySelector('img')?.getAttribute('src') || '';
    if (imgSrc && lightboxImg) {
      lightboxImg.src = imgSrc;
      lightboxImg.alt = label;
      lightboxImg.style.display = '';
      if (contentText) contentText.style.display = 'none';
    } else {
      if (lightboxImg) lightboxImg.style.display = 'none';
      if (contentText) { contentText.style.display = ''; contentText.textContent = label; }
    }
    if (caption) caption.textContent = label;
  }

  function close() {
    lightbox.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  items.forEach(item => {
    item.addEventListener('click', () => openAt(item));
  });

  closeBtn?.addEventListener('click', close);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) close(); });

  prevBtn?.addEventListener('click', () => {
    if (!visibleItems.length) return;
    currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
    render();
  });
  nextBtn?.addEventListener('click', () => {
    if (!visibleItems.length) return;
    currentIndex = (currentIndex + 1) % visibleItems.length;
    render();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') prevBtn?.click();
    if (e.key === 'ArrowRight') nextBtn?.click();
  });
}

/* --- Selettore taglie merch: aggiorna i link WhatsApp/Email/Stripe col formato scelto ---
   Ogni bottone porta il proprio template in un data-attribute con il segnaposto {size}:
     data-wa-template     -> https://wa.me/...taglia%20{size}
     data-email-template  -> mailto:...taglia%20{size}.
     data-stripe-template -> https://buy.stripe.com/<link>?client_reference_id=taglia-{size}
   Le card senza taglia (cappellini, cintura, marsupio, targhetta, mascotte) non hanno
   .size-pills: escono subito dal forEach e i loro href restano quelli statici dell'HTML. */
function initMerchSizes() {
  document.querySelectorAll('.merch-card').forEach(card => {
    const pills = card.querySelectorAll('.size-pills button');
    if (!pills.length) return;

    const waLink = card.querySelector('.btn-whatsapp');
    const emailLink = card.querySelector('.btn-email');
    const stripeLink = card.querySelector('.btn-stripe');
    const waTemplate = waLink?.dataset.waTemplate;
    const emailTemplate = emailLink?.dataset.emailTemplate;
    const stripeTemplate = stripeLink?.dataset.stripeTemplate;

    pills.forEach(pill => {
      pill.addEventListener('click', () => {
        pills.forEach(p => p.classList.remove('is-active'));
        pill.classList.add('is-active');
        const size = pill.dataset.size;
        if (waLink && waTemplate) waLink.href = waTemplate.replace('{size}', size);
        if (emailLink && emailTemplate) emailLink.href = emailTemplate.replace('{size}', size);
        if (stripeLink && stripeTemplate) stripeLink.href = stripeTemplate.replace('{size}', size);
      });
    });
  });
}

/* --- Form frontend-only: mostra conferma senza inviare dati da nessuna parte.
   Resta in uso per i form dimostrativi del sito (es. contatti.html). I due moduli
   di iscrizioni.html non passano piu' di qui: usano initFormsBackend(). --- */
function initForms() {
  document.querySelectorAll('form[data-frontend-only]').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const success = form.parentElement.querySelector('.form-success');
      if (success) {
        success.classList.add('is-visible');
        success.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      form.reset();
    });
  });
}

/* ==========================================================================
   INVIO REALE AL BACKEND — Google Apps Script -> Google Sheet
   ==========================================================================
   Usato dai form con `data-form-backend="<tipo>"` (iscrizioni.html):
     iscrizione -> tab "Iscrizioni - backend"
     aps        -> tab "Modulo APS - backend"

   COME ATTIVARLO: incolla in BACKEND_URL l'URL /exec della web app Apps Script
   (istruzioni complete in `documentazione interna`). Finche' resta vuoto
   i form mostrano la conferma dimostrativa e NON inviano nulla: il PoC pubblicato
   continua a funzionare anche senza backend.

   NOTA CORS (la trappola di questo pattern): si invia `Content-Type: text/plain`
   con dentro una stringa JSON. Con `application/json` il browser manderebbe prima
   una richiesta OPTIONS di preflight, che Apps Script non sa gestire: la POST non
   partirebbe proprio. `text/plain` e' una "richiesta semplice", niente preflight,
   e la risposta resta leggibile (a differenza di `mode: 'no-cors'`).
   ========================================================================== */

const BACKEND_URL = '' /* NEUTRALIZZATO nel bundle pubblico: il modulo raccoglie dati sanitari di MINORI. Con URL vuoto il PoC resta in modalita dimostrativa e non trasmette nulla. L'originale sta nel workspace. */; // <-- incolla qui l'URL .../exec dopo il deploy
const MAX_MB_FILE = 5;  // deve restare allineato a MAX_BYTE_FILE in documentazione interna
const CAMPI_NON_INVIATI = ['turno-org', 'tenda-org']; // read-only, li compila l'organizzazione

/* Come si scrive "spuntato" in una casella di controllo. UNA costante e non due
   letterali sparsi: raccogliCampi() la scrive nel foglio, ripristinaCampi() la
   rilegge — se le due stringhe divergessero, al ripristino di una bozza ogni
   checkbox tornerebbe vuota senza che nulla segnali un errore. */
const VALORE_SI = 'Sì';
const VALORE_NO = 'No';

function initFormsBackend() {
  document.querySelectorAll('form[data-form-backend]').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      inviaForm(form);
    });
  });
}

/* Raccoglie i campi testuali del form in un oggetto piatto { name: valore }.
   Non si usa `new FormData(form)` perche' omette del tutto le checkbox non
   spuntate e i gruppi radio non selezionati: nel foglio vogliamo un "No"
   esplicito, non una cella vuota ambigua. */
function raccogliCampi(form) {
  const campi = {};
  Array.from(form.elements).forEach(el => {
    if (!el.name || el.disabled) return;
    if (el.type === 'file' || el.type === 'submit' || el.type === 'button') return;
    if (CAMPI_NON_INVIATI.includes(el.name)) return;

    if (el.type === 'checkbox') {
      campi[el.name] = el.checked ? VALORE_SI : VALORE_NO;
    } else if (el.type === 'radio') {
      if (el.checked) campi[el.name] = el.value;
      else if (!(el.name in campi)) campi[el.name] = '';
    } else {
      campi[el.name] = el.value;
    }
  });
  return campi;
}

/* Il file e' di un tipo che il backend sa salvare? Immagini (qualunque formato,
   compresi i TIFF degli scanner multifunzione) e PDF.
   Il tipo dichiarato dal browser non e' affidabile — su alcune piattaforme e' vuoto
   per PDF e HEIC — quindi si ripiega sull'estensione. Stesso criterio di
   _mimeAccettabile() in documentazione interna: se i due divergono, il genitore riesce a caricare
   un file che poi il server scarta. */
function tipoFileAmmesso(file) {
  const mime = (file.type || '').toLowerCase();
  if (mime === 'application/pdf' || mime.startsWith('image/')) return true;
  return /\.(pdf|jpe?g|png|webp|heic|heif|tiff?|bmp|gif)$/i.test(file.name || '');
}

/* Legge un <input type="file"> e lo restituisce in base64, pronto per il JSON.
   Ritorna null se il campo e' vuoto; lancia un errore se il file e' troppo grande o
   di tipo non gestito (meglio bloccare qui che far fallire la POST dopo un upload
   lungo da mobile, o peggio farla riuscire scartando l'allegato in silenzio). */
function leggiFile(input) {
  const file = input.files && input.files[0];
  if (!file) return Promise.resolve(null);

  if (file.size > MAX_MB_FILE * 1024 * 1024) {
    const mb = (file.size / 1024 / 1024).toFixed(1);
    return Promise.reject(new Error(
      `Il file "${file.name}" pesa ${mb} MB: il limite è ${MAX_MB_FILE} MB. ` +
      `Comprimilo (o rifai la foto a risoluzione più bassa) e riprova.`
    ));
  }

  if (!tipoFileAmmesso(file)) {
    return Promise.reject(new Error(
      `Il file "${file.name}" non è in un formato che possiamo accettare. ` +
      `Servono una foto (JPG, PNG, HEIC…) oppure un PDF.`
    ));
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve({
      campo: input.name,
      nome: file.name,
      mime: file.type || 'application/octet-stream',
      // readAsDataURL restituisce "data:<mime>;base64,<dati>": teniamo solo i dati
      dati: String(reader.result).split(',')[1] || '',
    });
    reader.onerror = () => reject(new Error(`Non sono riuscito a leggere il file "${file.name}".`));
    reader.readAsDataURL(file);
  });
}

function inviaForm(form) {
  const tipo = form.dataset.formBackend;
  const success = form.querySelector('.form-success') || form.parentElement.querySelector('.form-success');
  const errore = form.querySelector('.form-error') || form.parentElement.querySelector('.form-error');
  const bottone = form.querySelector('button[type="submit"]');
  const testoBottone = bottone ? bottone.textContent : '';

  const mostraErrore = (messaggio) => {
    if (!errore) { alert(messaggio); return; }
    errore.textContent = messaggio;
    errore.classList.add('is-visible');
    errore.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };
  const mostraSuccesso = () => {
    if (errore) errore.classList.remove('is-visible');
    if (success) {
      success.classList.add('is-visible');
      success.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    form.reset();
  };

  // Backend non ancora configurato: il PoC si comporta come prima (demo), senza rompersi.
  if (!BACKEND_URL) {
    console.warn('[iscrizioni] BACKEND_URL non configurato: invio dimostrativo, nessun dato trasmesso.');
    mostraSuccesso();
    return;
  }

  if (errore) errore.classList.remove('is-visible');
  if (bottone) { bottone.disabled = true; bottone.textContent = 'Invio in corso…'; }

  const inputFile = Array.from(form.querySelectorAll('input[type="file"]'));

  Promise.all(inputFile.map(leggiFile))
    .then(letti => {
      const payload = {
        formType: tipo,
        campi: raccogliCampi(form),
        file: letti.filter(Boolean),
      };
      // Se il genitore ha fatto l'accesso, il token viaggia con l'invio: serve al
      // backend per chiudere la bozza corrispondente (e non riproporla piu').
      // Facoltativo: senza accesso il payload e' identico a prima.
      const token = bozzeApi && bozzeApi.tokenAttivo();
      if (token) payload.token = token;
      return fetch(BACKEND_URL, {
        method: 'POST',
        // text/plain = richiesta semplice, nessun preflight (vedi nota CORS sopra)
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload),
      });
    })
    .then(res => res.json())
    .then(risposta => {
      if (risposta && risposta.status === 'ok') {
        // L'iscrizione e' registrata, ma il server puo' aver rifiutato uno o piu'
        // allegati. Va detto: altrimenti il genitore crede di aver consegnato tutto
        // e l'organizzazione si ritrova senza un certificato sanitario.
        const scartati = (risposta.scartati || []);
        // Pratica conclusa: si spegne l'autosalvataggio di questo modulo, cosi'
        // un salvataggio in ritardo non riapre una bozza gia' chiusa.
        if (bozzeApi) bozzeApi.concludi(form);
        mostraSuccesso();
        if (scartati.length) {
          const elenco = scartati.map(s => `«${s.nome}» (${s.motivo})`).join('; ');
          mostraErrore(
            `Iscrizione registrata, ma ${scartati.length === 1 ? 'un allegato non è stato accettato' : `${scartati.length} allegati non sono stati accettati`}: ${elenco}. ` +
            `Rimandalo/i via email a camposcuolaasb24@gmail.com indicando nome e cognome dell'allievo.`
          );
        }
      } else {
        mostraErrore(
          'Invio non riuscito: ' + ((risposta && risposta.messaggio) || 'errore sconosciuto dal server') +
          '. I dati che hai scritto sono ancora qui: puoi riprovare, oppure scaricare il PDF ' +
          'e mandarlo a camposcuolaasb24@gmail.com.'
        );
      }
    })
    .catch(err => {
      mostraErrore(
        (err && err.message ? err.message : 'Invio non riuscito.') +
        ' I dati che hai scritto sono ancora qui: puoi riprovare, oppure scaricare il PDF ' +
        'e mandarlo a camposcuolaasb24@gmail.com.'
      );
    })
    .finally(() => {
      if (bottone) { bottone.disabled = false; bottone.textContent = testoBottone; }
    });
}

/* ==========================================================================
   ACCESSO GENITORE (email + codice) E SALVATAGGIO AUTOMATICO DELLA BOZZA
   ==========================================================================
   PERCHE' ESISTE: per inviare il modulo il genitore deve scaricare il PDF,
   stamparlo, firmarlo a mano, scansionarlo e RICARICARE la pagina per allegare la
   scansione. Senza salvataggio, quel reload azzera 68 campi.

   COME FUNZIONA: accesso facoltativo con email + codice a 6 cifre (niente
   password da ricordare per un modulo che si compila una volta all'anno). Il
   token di sessione, non l'email, e' l'identita' della bozza: un secondo accesso
   con la stessa email apre una bozza indipendente (utile per un altro figlio).

   REGOLA NON NEGOZIABILE: il modulo resta compilabile e INVIABILE senza accesso.
   Se il backend non e' configurato, se le email non partono o se la sessione
   scade, qui non si rompe niente: si spegne solo il salvataggio automatico.
   ========================================================================== */

/* ⚠ INTERRUTTORE — metti `true` SOLO DOPO aver ridistribuito documentazione interna.
   Finche' e' `false` il blocco di accesso non compare affatto e il sito si
   comporta esattamente come prima (nessun token viaggia con l'invio).
   Perche' serve: il sito si pubblica su GitHub Pages in un momento, la web app
   Apps Script si ridistribuisce in un altro (passo umano). Nel mezzo, un
   genitore che provasse ad accedere riceverebbe dal backend vecchio un errore
   incomprensibile ("formType non riconosciuto: undefined") — verificato in QA.
   COME ACCERTARSI CHE SI PUO' ACCENDERE: apri l'URL /exec nel browser; il JSON
   deve dire `"login": "attivo"` (vedi anche verificaTabLogin() in documentazione interna).
   Per provarlo in locale prima del deploy: aggiungi `?bozze=prova` all'URL. */
const SALVATAGGIO_BOZZE_ATTIVO = false;

const CHIAVE_SESSIONE = 'camposcuola-sessione-2026';
const AUTOSAVE_DEBOUNCE_MS = 2500;      // si salva alla prima pausa di digitazione
const AUTOSAVE_INTERVALLO_MIN_MS = 8000; // ...ma non piu' di una volta ogni 8 secondi

/* Ponte verso il resto del file (usato da inviaForm): resta null sulle pagine
   senza modulo, o se il salvataggio non e' disponibile. */
let bozzeApi = null;

/* Copia inversa di raccogliCampi(): riscrive nel form i valori di una bozza.
   I campi file NON si ripristinano mai — un <input type="file"> non e'
   valorizzabile da JavaScript (giustamente: sarebbe un modo per far caricare a
   un utente un file che non ha scelto). La scansione firmata va riallegata. */
function ripristinaCampi(form, dati) {
  let ripristinati = 0;
  Array.from(form.elements).forEach(el => {
    if (!el.name || el.disabled || el.type === 'file') return;
    if (el.type === 'submit' || el.type === 'button') return;
    if (CAMPI_NON_INVIATI.includes(el.name)) return;   // read-only dell'organizzazione
    if (!(el.name in dati)) return;

    const valore = dati[el.name];
    if (el.type === 'checkbox') {
      el.checked = valore === VALORE_SI;
    } else if (el.type === 'radio') {
      el.checked = (el.value === valore);
    } else {
      el.value = valore === undefined || valore === null ? '' : valore;
    }
    ripristinati++;
  });
  return ripristinati;
}

function initAccessoBozze() {
  const box = document.querySelector('[data-accesso-bozze]');
  const moduli = Array.from(document.querySelectorAll('form[data-bozza]'));
  if (!box || !moduli.length) return;

  // Senza backend, o prima che il documentazione interna aggiornato sia stato ridistribuito, il
  // blocco non si mostra affatto: meglio nessuna offerta che una che non funziona.
  const inProva = /[?&]bozze=prova\b/.test(location.search);
  if (!BACKEND_URL || !(SALVATAGGIO_BOZZE_ATTIVO || inProva)) {
    console.warn('[bozze] salvataggio progressi non attivo ' +
      (BACKEND_URL ? '(SALVATAGGIO_BOZZE_ATTIVO = false: documentazione interna non ancora ridistribuito?)'
                   : '(BACKEND_URL non configurato)') + '.');
    return;
  }

  const passi = {};
  box.querySelectorAll('[data-accesso-passo]').forEach(el => { passi[el.dataset.accessoPasso] = el; });
  const messaggio = box.querySelector('[data-accesso-messaggio]');
  const formEmail = box.querySelector('[data-accesso-form="email"]');
  const formCodice = box.querySelector('[data-accesso-form="codice"]');
  const campoEmail = box.querySelector('#accesso-email');
  const campoCodice = box.querySelector('#accesso-codice');
  const etichettaDestinatario = box.querySelector('[data-accesso-destinatario]');
  const etichettaEmailAttiva = box.querySelector('[data-accesso-email-attiva]');
  const etichettaSalvataggio = box.querySelector('[data-accesso-salvataggio]');
  const bloccoRipristino = box.querySelector('[data-accesso-ripristino]');
  const testoRipristino = box.querySelector('[data-accesso-ripristino-testo]');
  const btnRiprendi = box.querySelector('[data-accesso-riprendi]');
  const btnIniziaVuoto = box.querySelector('[data-accesso-inizia-vuoto]');
  const btnEsci = box.querySelector('[data-accesso-esci]');
  const btnAltroFiglio = box.querySelector('[data-accesso-altro-figlio]');

  let sessione = null;      // { token, email, scadeIl }
  let emailInVerifica = '';
  let suggerita = null;     // bozza di un'altra sessione, da proporre
  const stato = new Map();  // form -> { attivo, timer, ultimoInvio, conclusa }

  box.hidden = false;

  // --- utilita' di interfaccia ---
  const mostraPasso = (nome) => {
    Object.keys(passi).forEach(k => { passi[k].hidden = k !== nome; });
    box.dataset.accessoStato = nome;
  };
  const avvisa = (testo, tipo) => {
    if (!messaggio) return;
    messaggio.textContent = testo || '';
    messaggio.hidden = !testo;
    messaggio.className = 'accesso-messaggio' + (tipo ? ' is-' + tipo : '');
  };
  const oraLeggibile = (iso) => {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return '';
    const dueCifre = (n) => String(n).padStart(2, '0');
    const oggi = new Date();
    const stessoGiorno = d.toDateString() === oggi.toDateString();
    const ora = dueCifre(d.getHours()) + ':' + dueCifre(d.getMinutes());
    return stessoGiorno ? ora : `${dueCifre(d.getDate())}/${dueCifre(d.getMonth() + 1)} alle ${ora}`;
  };

  // --- sessione in localStorage ---
  const leggiSessione = () => {
    try {
      const grezzo = localStorage.getItem(CHIAVE_SESSIONE);
      if (!grezzo) return null;
      const s = JSON.parse(grezzo);
      if (!s || !s.token) return null;
      // Scadenza gia' passata: si butta subito, senza disturbare il server.
      if (s.scadeIl && new Date(s.scadeIl).getTime() < Date.now()) return null;
      return s;
    } catch (err) { return null; }
  };
  const scriviSessione = (s) => {
    try { localStorage.setItem(CHIAVE_SESSIONE, JSON.stringify(s)); } catch (err) { /* modalita' privata */ }
  };
  const dimenticaSessione = () => {
    try { localStorage.removeItem(CHIAVE_SESSIONE); } catch (err) { /* niente */ }
    sessione = null;
    stato.forEach(s => { s.attivo = false; clearTimeout(s.timer); });
    stato.clear();
  };

  // --- chiamate al backend (stesso trucco CORS dell'invio: text/plain) ---
  const chiama = (payload, opzioni) => fetch(BACKEND_URL, Object.assign({
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(payload),
  }, opzioni || {})).then(res => res.json());

  /* Sessione non piu' valida: si spegne il salvataggio e si torna al banner.
     I dati a schermo NON si toccano — il genitore puo' comunque inviare. */
  const sessioneCaduta = (risposta) => {
    dimenticaSessione();
    mostraPasso('email');
    avvisa((risposta && risposta.messaggio) ||
      'L\'accesso non è più valido. Rifai l\'accesso per continuare a salvare.', 'attenzione');
  };
  const loginNonDisponibile = (risposta) => {
    console.warn('[bozze] login non disponibile: ' + (risposta && risposta.messaggio));
    dimenticaSessione();
    box.hidden = true;   // niente da offrire: meglio non mostrare nulla che un errore
  };
  const gestisciErrore = (risposta) => {
    const codice = risposta && risposta.codice;
    if (codice === 'login-non-disponibile') { loginNonDisponibile(risposta); return 'spento'; }
    if (codice === 'sessione-scaduta' || codice === 'sessione-non-valida' || codice === 'sessione-assente') {
      sessioneCaduta(risposta); return 'caduta';
    }
    return 'altro';
  };

  // --- passo 1: chiedi il codice ---
  formEmail.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = (campoEmail.value || '').trim();
    if (!/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(email)) {
      avvisa('Controlla l\'indirizzo email: non sembra valido.', 'attenzione');
      campoEmail.focus();
      return;
    }
    const btn = formEmail.querySelector('button[type="submit"]');
    const testo = btn.textContent;
    btn.disabled = true; btn.textContent = 'Invio del codice…';
    avvisa('');
    chiama({ azione: 'richiedi-otp', email })
      .then(r => {
        if (r && r.status === 'ok') {
          emailInVerifica = email.toLowerCase();
          if (etichettaDestinatario) etichettaDestinatario.textContent = emailInVerifica;
          mostraPasso('codice');
          avvisa('');
          if (campoCodice) campoCodice.focus();
        } else if (gestisciErrore(r) === 'altro') {
          avvisa((r && r.messaggio) || 'Non è stato possibile inviare il codice.', 'attenzione');
        }
      })
      .catch(() => avvisa('Non è stato possibile contattare il server. ' +
        'Puoi compilare e inviare il modulo anche senza accedere.', 'attenzione'))
      .finally(() => { btn.disabled = false; btn.textContent = testo; });
  });

  // --- passo 2: verifica il codice ---
  formCodice.addEventListener('submit', (e) => {
    e.preventDefault();
    const codice = (campoCodice.value || '').replace(/\D/g, '');
    if (codice.length !== 6) {
      avvisa('Il codice è di 6 cifre.', 'attenzione');
      return;
    }
    const btn = formCodice.querySelector('button[type="submit"]');
    const testo = btn.textContent;
    btn.disabled = true; btn.textContent = 'Verifica…';
    chiama({ azione: 'verifica-otp', email: emailInVerifica, codice })
      .then(r => {
        if (r && r.status === 'ok') {
          campoCodice.value = '';
          suggerita = r.bozzaSuggerita || null;
          apriSessione({ token: r.token, email: r.email, scadeIl: r.scadeIl });
        } else if (gestisciErrore(r) === 'altro') {
          avvisa((r && r.messaggio) || 'Codice non valido.', 'attenzione');
        }
      })
      .catch(() => avvisa('Non è stato possibile contattare il server.', 'attenzione'))
      .finally(() => { btn.disabled = false; btn.textContent = testo; });
  });

  // --- sessione attiva ---
  function apriSessione(nuova) {
    sessione = nuova;
    scriviSessione(nuova);
    mostraPasso('attivo');
    if (etichettaEmailAttiva) etichettaEmailAttiva.textContent = nuova.email || '';
    if (etichettaSalvataggio) etichettaSalvataggio.textContent = 'nessun salvataggio ancora';
    avvisa('');
    proponiRipristino();
    moduli.forEach(form => {
      stato.set(form, { attivo: true, timer: null, ultimoInvio: 0, conclusa: false });
      caricaBozza(form, null);
      ascolta(form);
    });
  }

  /* Bozza di un'altra sessione (tipicamente: iniziata dal telefono, ripresa dal
     PC). NON si ripristina da sola: il genitore potrebbe voler ricominciare. */
  function proponiRipristino() {
    if (!bloccoRipristino) return;
    if (!suggerita || !suggerita.token) { bloccoRipristino.hidden = true; return; }
    const quando = oraLeggibile(suggerita.aggiornataIl);
    const chi = suggerita.nomeAllievo ? ` per ${suggerita.nomeAllievo}` : '';
    const quale = suggerita.tipoModulo === 'aps' ? 'del modulo socio A.P.S.' : 'del modulo d\'iscrizione';
    if (testoRipristino) {
      testoRipristino.textContent =
        `Hai una compilazione ${quale}${chi} salvata ${quando ? 'il ' + quando : 'di recente'}. La riprendo?`;
    }
    bloccoRipristino.hidden = false;
  }

  if (btnRiprendi) {
    btnRiprendi.addEventListener('click', () => {
      if (!suggerita) return;
      const form = moduli.find(f => f.dataset.formBackend === suggerita.tipoModulo) || moduli[0];
      caricaBozza(form, suggerita.token);
      suggerita = null;
      bloccoRipristino.hidden = true;
    });
  }
  if (btnIniziaVuoto) {
    btnIniziaVuoto.addEventListener('click', () => {
      suggerita = null;
      bloccoRipristino.hidden = true;
    });
  }
  if (btnEsci) {
    btnEsci.addEventListener('click', () => {
      dimenticaSessione();
      mostraPasso('email');
      avvisa('Accesso chiuso. I dati che hai scritto restano a schermo: puoi inviare il modulo comunque.', 'ok');
    });
  }
  if (btnAltroFiglio) {
    btnAltroFiglio.addEventListener('click', () => {
      dimenticaSessione();
      moduli.forEach(f => f.reset());
      mostraPasso('email');
      avvisa('Modulo svuotato. Fai un nuovo accesso per salvare la seconda iscrizione ' +
        '(la precedente resta al sicuro dove l\'hai lasciata).', 'ok');
      box.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  // --- ripristino dei campi salvati ---
  function caricaBozza(form, tokenBozza) {
    if (!sessione) return;
    const payload = { azione: 'recupera-bozza', token: sessione.token, formType: form.dataset.formBackend };
    if (tokenBozza) payload.tokenBozza = tokenBozza;
    chiama(payload)
      .then(r => {
        if (!r || r.status !== 'ok') { gestisciErrore(r); return; }
        const s = stato.get(form);
        if (r.completata && s) {
          s.attivo = false; s.conclusa = true;
          avvisa('Questa iscrizione risulta già inviata: il salvataggio automatico è spento.', 'ok');
          return;
        }
        if (r.avviso) avvisa(r.avviso, 'attenzione');
        if (!r.campi) return;
        const quanti = ripristinaCampi(form, r.campi);
        if (etichettaSalvataggio && r.aggiornataIl) {
          etichettaSalvataggio.textContent = 'ultimo salvataggio ' + oraLeggibile(r.aggiornataIl);
        }
        avvisa(`Ho ripristinato ${quanti} campi salvati in precedenza. ` +
          'La scansione del modulo firmato va riallegata: gli allegati non si salvano.', 'ok');
      })
      .catch(() => { /* rete assente: il modulo resta usabile, niente allarmi */ });
  }

  // --- salvataggio automatico ---
  function ascolta(form) {
    const salvaConAttesa = () => {
      const s = stato.get(form);
      if (!s || !s.attivo) return;
      clearTimeout(s.timer);
      s.sporco = true;   // ci sono modifiche non ancora confermate dal server
      const attesa = Math.max(AUTOSAVE_DEBOUNCE_MS, AUTOSAVE_INTERVALLO_MIN_MS - (Date.now() - s.ultimoInvio));
      // Se il tetto di frequenza non e' ancora passato NON si rinuncia al
      // salvataggio (perderebbe le ultime modifiche in silenzio): si aspetta il
      // tempo che manca. E' la correzione alla bozza del § 1.6 dell'analisi,
      // che con un `return` secco scartava l'ultimo salvataggio.
      s.timer = setTimeout(() => salvaBozza(form), attesa);
    };
    form.addEventListener('input', salvaConAttesa);
    form.addEventListener('change', salvaConAttesa);   // select, date picker, checkbox
  }

  function salvaBozza(form, opzioni) {
    const s = stato.get(form);
    if (!sessione || !s || !s.attivo) return Promise.resolve();
    clearTimeout(s.timer);
    s.ultimoInvio = Date.now();
    return chiama({
      azione: 'salva-bozza',
      token: sessione.token,
      formType: form.dataset.formBackend,
      campi: raccogliCampi(form),
    }, (opzioni && opzioni.keepalive) ? { keepalive: true } : null)
      .then(r => {
        if (r && r.status === 'ok') {
          // L'orario mostrato e' quello CONFERMATO DAL SERVER, mai quello del
          // tentativo: un salvataggio fallito non deve poter sembrare riuscito
          // (stesso errore gia' fatto e corretto qui con "Documenti mancanti").
          s.sporco = false;
          if (etichettaSalvataggio) etichettaSalvataggio.textContent = 'salvato alle ' + oraLeggibile(r.salvatoIl);
          return;
        }
        const codice = r && r.codice;
        if (codice === 'bozza-conclusa') {
          s.attivo = false; s.conclusa = true;
          return;
        }
        if (codice === 'occupato') {
          // Autosalvataggio, non un'azione chiesta dal genitore: si riprova al
          // prossimo ciclo senza mostrare nulla. L'orario resta quello vecchio,
          // e si vede da solo che non e' recente.
          console.warn('[bozze] server occupato, riprovo al prossimo salvataggio');
          return;
        }
        if (gestisciErrore(r) === 'altro') {
          console.warn('[bozze] salvataggio non riuscito: ' + (r && r.messaggio));
        }
      })
      .catch(() => { /* rete assente: si riprova al prossimo input */ });
  }

  /* Momento critico: il genitore scarica il PDF per stamparlo e firmarlo, poi
     RICARICA la pagina. Qui si forza un salvataggio, senza aspettare il debounce:
     e' esattamente il punto in cui perdere i dati sarebbe piu' doloroso. */
  const btnPdf = document.getElementById('btn-scarica-pdf');
  if (btnPdf) btnPdf.addEventListener('click', () => moduli.forEach(f => salvaBozza(f)));

  // Ultimo tentativo quando la pagina viene chiusa/nascosta: `keepalive` fa
  // sopravvivere la richiesta alla chiusura della scheda. Best-effort: se non
  // arriva, l'ultimo salvataggio confermato resta quello mostrato nella striscia.
  window.addEventListener('pagehide', () => {
    moduli.forEach(f => {
      const s = stato.get(f);
      if (s && s.attivo && s.sporco) salvaBozza(f, { keepalive: true });
    });
  });

  // --- ponte per inviaForm ---
  bozzeApi = {
    tokenAttivo: () => (sessione ? sessione.token : null),
    concludi: (form) => {
      const s = stato.get(form);
      if (s) { s.attivo = false; s.conclusa = true; clearTimeout(s.timer); }
      if (etichettaSalvataggio) etichettaSalvataggio.textContent = 'iscrizione inviata';
      if (btnAltroFiglio) btnAltroFiglio.hidden = false;
    },
  };

  // --- avvio: c'e' gia' una sessione da un caricamento precedente? ---
  const salvata = leggiSessione();
  if (salvata) {
    // Ripristino silenzioso: e' il caso del reload dopo la firma del PDF.
    apriSessione(salvata);
  } else {
    mostraPasso('email');
  }
}

/* --- Generazione PDF pre-compilato via html2canvas + jsPDF (pulsante "Scarica modulo compilato") ---
   Cattura le 4 sezioni .mod-pdfpage COSI' COME SONO A SCHERMO (stesso HTML/CSS della
   riproduzione fedele del cartaceo, con i dati appena digitati) invece di ricostruire un
   recap testuale a parte: garantisce "stesso identico formato e stile" per costruzione.
   Due correzioni rispetto alla prima versione (2026-07-26, segnalate dall'utente):
   1) PAGINE A4 VERE: una .mod-pdfpage può essere alta più di un foglio A4 (es. la pagina
      Regolamento supera i 750mm equivalenti) — non si scala più tutto in un'unica pagina
      fuori misura (non stampabile), si affetta il canvas catturato in tante pagine da
      210x297mm quante servono, tutte identiche come dimensione fisica.
   2) VALORI NON PIU' TAGLIATI: html2canvas non renderizza in modo affidabile il testo
      DENTRO i controlli nativi (<input>/<select>/<textarea>) — è un suo limite noto, il
      valore digitato può apparire troncato o mal posizionato. Prima di catturare, ogni
      pagina viene quindi clonata fuori schermo sostituendo ogni campo con un <div> di
      solo testo (classe .mod-print-value) che contiene il valore REALE già scritto dal
      genitore: un div di testo normale, html2canvas lo cattura sempre per intero, con
      wrap invece di troncamento se il valore è lungo.
   Requisito: va servito da http(s) (anche in locale, es. `py -3 -m http.server`), non
   aperto come file:// — altrimenti html2canvas non riesce a leggere le immagini in img/. */
function initPdfDownload() {
  const btn = document.getElementById('btn-scarica-pdf');
  const form = document.getElementById('modulo-iscrizione');
  if (!btn || !form || typeof window.jspdf === 'undefined' || typeof window.html2canvas === 'undefined') return;

  const LARGHEZZA_MM = 210;
  const ALTEZZA_MM = 297; // A4 vero: ogni pagina del PDF ha sempre queste dimensioni fisse

  const formattaData = (iso) => {
    if (!iso) return '';
    const parti = iso.split('-');
    return parti.length === 3 ? `${parti[2]}/${parti[1]}/${parti[0]}` : iso;
  };

  /* Copia "stampabile" di una .mod-pdfpage: stessa struttura/CSS, ma ogni input/select/
     textarea diventa un <div> col valore corrente gia' risolto a testo. Costruita FUORI
     dal form live (mai smontare i campi che il genitore sta ancora compilando). */
  const clonaStampabile = (pagina) => {
    const clone = pagina.cloneNode(true);
    const originali = pagina.querySelectorAll('input, select, textarea');
    const copie = clone.querySelectorAll('input, select, textarea');
    originali.forEach((originale, i) => {
      const copia = copie[i];
      const sostituto = document.createElement('div');
      sostituto.className = 'mod-print-value';
      if (originale.type === 'checkbox') {
        sostituto.textContent = originale.checked ? '☑' : '☐';
      } else if (originale.type === 'radio') {
        sostituto.textContent = originale.checked ? '●' : '○';
      } else if (originale.type === 'file') {
        sostituto.textContent = (originale.files && originale.files[0]) ? '✓ ' + originale.files[0].name : '';
      } else if (originale.tagName === 'SELECT') {
        const scelta = originale.options[originale.selectedIndex];
        sostituto.textContent = scelta ? scelta.textContent.trim() : '';
      } else if (originale.type === 'date') {
        sostituto.textContent = formattaData(originale.value);
      } else {
        sostituto.textContent = originale.value || '';
      }
      copia.replaceWith(sostituto);
    });
    return clone;
  };

  btn.addEventListener('click', () => {
    const pagineOriginali = Array.from(form.querySelectorAll('.mod-pdfpage'));
    if (!pagineOriginali.length) return;

    const { jsPDF } = window.jspdf;
    const testoOriginale = btn.textContent;
    btn.disabled = true;

    const palco = document.createElement('div');
    palco.style.cssText = 'position:fixed; left:-99999px; top:0; margin:0;';
    document.body.appendChild(palco);

    const doc = new jsPDF({ unit: 'mm', format: [LARGHEZZA_MM, ALTEZZA_MM] });
    let primaPaginaPdf = true;

    // Cattura una .mod-pdfpage (clonata e "appiattita" a testo) e la affetta in tante
    // pagine A4 quante servono per contenerla senza tagliare né rimpicciolire nulla.
    const catturaESpezza = (pagina, indice) => {
      btn.textContent = `Generazione pagina ${indice + 1}/${pagineOriginali.length}…`;
      const stampabile = clonaStampabile(pagina);
      palco.appendChild(stampabile);

      return window.html2canvas(stampabile, { scale: 2, useCORS: true, backgroundColor: '#ffffff' })
        .then((canvas) => {
          palco.removeChild(stampabile);
          const pxPerMm = canvas.width / LARGHEZZA_MM;
          const altezzaPaginaPx = Math.round(ALTEZZA_MM * pxPerMm);
          const numPagine = Math.max(1, Math.ceil(canvas.height / altezzaPaginaPx));

          for (let p = 0; p < numPagine; p++) {
            const alto = Math.min(altezzaPaginaPx, canvas.height - p * altezzaPaginaPx);
            const fetta = document.createElement('canvas');
            fetta.width = canvas.width;
            fetta.height = alto;
            fetta.getContext('2d').drawImage(canvas, 0, p * altezzaPaginaPx, canvas.width, alto, 0, 0, canvas.width, alto);
            const immagine = fetta.toDataURL('image/jpeg', 0.92);
            if (!primaPaginaPdf) doc.addPage([LARGHEZZA_MM, ALTEZZA_MM]);
            primaPaginaPdf = false;
            doc.addImage(immagine, 'JPEG', 0, 0, LARGHEZZA_MM, alto / pxPerMm);
          }
        });
    };

    // Una pagina alla volta (non in parallelo): tiene basso il picco di memoria e
    // garantisce che finiscano nel PDF nello stesso ordine in cui sono a schermo.
    pagineOriginali.reduce((precedente, pagina, indice) => precedente.then(() => catturaESpezza(pagina, indice)), Promise.resolve())
      .then(() => {
        document.body.removeChild(palco);
        const data = Object.fromEntries(new FormData(form));
        const cognome = (data['cognome-allievo'] || 'allievo').replace(/[^a-z0-9]/gi, '_') || 'allievo';
        doc.save(`iscrizione-camposcuola-2026-${cognome}.pdf`);
      })
      .catch((err) => {
        if (palco.parentNode) document.body.removeChild(palco);
        console.error('[iscrizioni] generazione PDF fallita:', err);
        alert(
          'Non sono riuscito a generare il PDF (' + (err && err.message ? err.message : 'errore sconosciuto') + '). ' +
          'Riprova, oppure usa Stampa (Ctrl+P) > Salva come PDF dal browser: mostra lo stesso modulo.'
        );
      })
      .finally(() => {
        btn.disabled = false;
        btn.textContent = testoOriginale;
      });
  });
}

/* --- Generazione PDF pre-compilato via jsPDF per il modulo APS (pulsante "Scarica modulo compilato") --- */
function initPdfDownloadAps() {
  const btn = document.getElementById('btn-scarica-pdf-aps');
  const form = document.getElementById('modulo-aps');
  if (!btn || !form || typeof window.jspdf === 'undefined') return;

  btn.addEventListener('click', () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    const data = Object.fromEntries(new FormData(form));
    const marginX = 15;
    let y = 18;

    const checkPageBreak = (needed = 6) => {
      if (y > 297 - needed) { doc.addPage(); y = 18; }
    };
    const addSectionTitle = (text) => {
      checkPageBreak(10);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(31, 77, 52);
      doc.text(text.toUpperCase(), marginX, y);
      doc.setDrawColor(200, 137, 47);
      doc.line(marginX, y + 1.5, 195, y + 1.5);
      y += 6;
    };
    const addRow = (label, value) => {
      const text = value && String(value).trim() ? String(value) : '—';
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      const lines = doc.splitTextToSize(text, 128);
      checkPageBreak(5 * lines.length);
      doc.setTextColor(90, 99, 85);
      doc.text(label + ':', marginX, y);
      doc.setTextColor(34, 40, 31);
      doc.text(lines, marginX + 55, y);
      y += 5 * lines.length;
    };

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(31, 77, 52);
    doc.text('Richiesta di ammissione a Socio Ordinario — A.P.S.', marginX, y);
    y += 7;
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(9);
    doc.setTextColor(90, 99, 85);
    doc.text('Campo Scuola Almenno San Bartolomeo A.P.S. — generato da PoC frontend, non un invio ufficiale', marginX, y);
    y += 9;

    addSectionTitle('1. Dati del maggiorenne o del genitore');
    addRow('Cognome e nome', data['aps-cognome-genitore']);
    addRow('Luogo di nascita', [data['aps-luogo-nascita-genitore'], data['aps-prov-nascita-genitore']].filter(Boolean).join(' / '));
    addRow('Data di nascita', data['aps-data-nascita-genitore']);
    addRow('Residenza', data['aps-residenza-genitore']);
    addRow('Telefono', data['aps-telefono-genitore']);
    addRow('Mail', data['aps-email-genitore']);
    addRow('Potesta genitoriale sul minore', data['aps-potesta-genitoriale'] ? 'Si' : 'No');
    y += 2;

    addSectionTitle('2. Dati del minore (aspirante socio)');
    addRow('Cognome e nome', data['aps-cognome-minore']);
    addRow('Luogo di nascita', [data['aps-luogo-nascita-minore'], data['aps-prov-nascita-minore']].filter(Boolean).join(' / '));
    addRow('Data di nascita', data['aps-data-nascita-minore']);
    addRow('Residenza', data['aps-residenza-minore']);
    addRow('Telefono', data['aps-telefono-minore']);
    addRow('Mail', data['aps-email-minore']);
    y += 2;

    addSectionTitle('3. Richiesta di ammissione a socio');
    addRow('Richiesta ammissione (quota 10 EUR)', data['aps-richiesta-ammissione'] ? 'Si' : 'No');
    addRow('Luogo', data['aps-luogo-firma-1']);
    addRow('Data firma', data['aps-data-firma-1']);
    addRow('Firma digitale', data['aps-firma-1']);
    y += 2;

    addSectionTitle('4. Informativa privacy e consensi');
    addRow('Sottoscritto da', data['aps-nome-sottoscritto-privacy']);
    addRow('Titolare responsabilita genitoriale', data['aps-titolare-responsabilita'] ? 'Si' : 'No');
    addRow('Nome minore (privacy)', data['aps-nome-minore-privacy']);
    addRow('Consenso marketing', data['aps-consenso-marketing']);
    addRow('Luogo', data['aps-luogo-firma-2']);
    addRow('Data firma', data['aps-data-firma-2']);
    addRow('Firma digitale', data['aps-firma-2']);

    checkPageBreak(10);
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7.5);
    doc.setTextColor(130, 130, 130);
    doc.text('PDF generato da PoC frontend (jsPDF) — da rileggere, stampare, firmare e inviare a camposcuolaasb24@gmail.com. Non sostituisce il modulo ufficiale.', marginX, 290);

    const cognome = (data['aps-cognome-minore'] || 'socio').replace(/[^a-z0-9]/gi, '_') || 'socio';
    doc.save(`ammissione-socio-aps-${cognome}.pdf`);
  });
}
