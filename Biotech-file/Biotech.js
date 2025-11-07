// QRedshift: Comfort visivo automatico con integrazione menu, Toggle e Persistenza (FOUWC)
function QRedshift() {
  const menuContainer = document.getElementById('tech-main-menu');
  const storageKey = 'qredshift_disabled';
  
  // --- Lettura dello Stato Precedente ---
  const isDisabledFromStorage = localStorage.getItem(storageKey) === 'true';

  //  FOUWC 
  // Se la modalità è DISATTIVATA, subito uno stile nel HEAD
  if (isDisabledFromStorage) {
    const style = document.createElement('style');
    style.id = 'qredshift-fouwc-fix';
    // Selettori critici: particelle e DNA.
    // `!important` è solo se il loro CSS/JS originale ha molta specificità.
    // Prova prima senza. Se necessario, aggiungi `!important;`
    style.innerHTML = `
      #particles-canvas, 
      .dna-container-8 {
        visibility: hidden; 
        /* Usiamo 'visibility: hidden' per mantenere lo spazio, 
           ma 'display: none' funziona se non è necessario lo spazio. 
           Dato che il tuo codice usa 'display: none', usiamolo: */
        display: none !important; 
      }
    `;
    // Al DOM il prima possibile
    document.head.appendChild(style);
  }

  // 1. Uscita Pura
  if (!menuContainer) return;
 
  // --- Cattura Riferimenti ---
  const particles = document.getElementById('particles-canvas');
  const dna = document.querySelector('.dna-container-8');
     
  // 2. Determina lo stato iniziale: Se disabilitato in storage, parte da OFF
  let isActive = !isDisabledFromStorage; 

  // --- Applicazione Iniziale Condizionale (QRedshift e OTTIMIZZAZIONE) ---
  if (isActive) {
    // ... (Logica di attivazione QRedshift/Filtro/willChange) ...
    
    // Rimsso lo stile FOUWC se era stato inserito
    const fouwcStyle = document.getElementById('qredshift-fouwc-fix');
    if (fouwcStyle) fouwcStyle.remove();
    
    
  } else {
    // ... (Logica di disattivazione/sincronizzazione QRedshift/Filtro/willChange/DNA/Particles) ...
    // Il `display: none` è ridondante ma non dannoso,
    // dato che il tag <style> inserito all'inizio sta già nascondendo gli elementi.
  }  
  
  // === FUNZIONE TOGGLE (Aggiorniamo la logica di ATTIVAZIONE) ===
  const toggleQRedshift = function () {
    isActive = !isActive;

    if (isActive) {
      // --- STATO ATTIVO (Riattiva tutto) ---
      // ... (Attiva Filtro/willChange/localStorage) ...

      // Rimosso lo stile FOUWC se era stato inserito
      const fouwcStyle = document.getElementById('qredshift-fouwc-fix');
      if (fouwcStyle) fouwcStyle.remove();
                  
    } else {
      // --- STATO DISATTIVO (Disattiva tutto) ---
      // ... (Disattiva Filtro/willChange/localStorage) ...
      
      // Opzionale: Reinseriamo lo stile FOUWC per la pagina successiva
      // (Normalmente non necessario perché il codice di avvio lo fa, ma utile se usiamo SPA)
      
      // ... (Il resto dello STATO DISATTIVO) ...
    }
  };

  button.addEventListener('click', toggleQRedshift);
}

window.addEventListener('DOMContentLoaded', QRedshift);
// End QRedshift: Comfort visivo automatico con integrazione menu, Toggle e Persistenza 

//Fade effect (dissolvenza)
function fadeEffect() {
  let text = document.getElementById("fadingText");
  if (!text) return;

  let visible = true;
  setInterval(() => {
    visible = !visible;
    text.classList.toggle("fade", !visible);
  }, 2000);
}
window.addEventListener("load", fadeEffect);   
// End fade effect (dissolvenza)  

// === OROLOGIO MODERNO ===
// ———————————————————————
const clockEl = document.getElementById('clock2');
    if (clockEl) {
        const pad = n => n < 10 ? '0' + n : n;
        const updateClock = () => {
            const d = new Date();
            clockEl.textContent = `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} - ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
        };
        updateClock();
        setInterval(updateClock, 1000);
    }   
//End  Clock
// === Conto alla rovescia al nuovo anno ===
const countdownEl = document.getElementById('modern-countdown');

// Verifica se l'elemento contenitore principale esiste
if (countdownEl) {
    // 1. Ottimizzazione: Cattura il riferimento a daysSpan solo una volta
    const daysSpan = countdownEl.querySelector('#countdown-days'); 

    // Verifica se lo span specifico esiste prima di procedere
    if (daysSpan) {
        
        // Funzione di aggiornamento pura e snella
        function updateCountdown() {
            // Usa 'const' per i valori che non cambiano
            const now = new Date();
            const currentYear = now.getFullYear();
            const nextYear = currentYear + 1;
            
            // Si può fare la new Date direttamente con il valore calcolato
            const newYear = new Date(nextYear, 0, 1); // 0 = Gennaio
            
            // Differenza in millisecondi
            const diff = newYear - now;
            
            // Calcolo giorni (mantenuto, è perfetto)
            const MS_PER_DAY = 1000 * 60 * 60 * 24;
            const days = Math.floor(diff / MS_PER_DAY);
            
            // Aggiorna il DOM
            // L'aggiornamento del textContent è un'operazione leggera,
            // specialmente su un singolo span.
            daysSpan.textContent = days;
        }

        // Aggiorna subito
        updateCountdown();

        // Avvia l'aggiornamento a intervalli
        // L'intervallo di 1 ora è l'ottimizzazione principale per il rendering
        setInterval(updateCountdown, 3600000); // 1 ora (60 * 60 * 1000)
    }
}   
// Lightbox Cellula - Cuore - Apparato respiratorio - Sistema linfatico....
function openModal() {
  document.getElementById("myModal").style.display = "block";
}
function closeModal() {
  document.getElementById("myModal").style.display = "none";
}
var slideIndex = 1;
// Inizializza le slide all'apertura
showSlides(slideIndex);

function plusSlides(n) {
  showSlides(slideIndex += n);
}
function currentSlide(n) {
  showSlides(slideIndex = n);
}
function showSlides(n) {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  var dots = document.getElementsByClassName("demo");
  var captionText = document.getElementById("caption");
  // Verifica che ci siano delle slide
  if (slides.length === 0) {
    return; // Esci se non ci sono slide
  }
  // Aggiorna slideIndex con logica circolare
  if (n > slides.length) {
    slideIndex = 1;
  } else if (n < 1) {
    slideIndex = slides.length;
  } else {
    slideIndex = n; // Assegna solo se valido
  }
  // Nascondi tutte le slide
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  // Rimuovi la classe 'active' da tutti i dot
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  // Mostra la slide corrente
  slides[slideIndex - 1].style.display = "block";
  // Aggiorna il dot attivo e il caption, solo se esistono i dot
  if (dots.length > 0 && dots[slideIndex - 1]) {
    dots[slideIndex - 1].className += " active";
    if (captionText) {
      captionText.innerHTML = dots[slideIndex - 1].alt || "";
    }
  }
}   
// End Lightbox Cellula - Cuore - Apparato respiratorio - Sistema linfatico.

// --- Performance Helpers ---
// Throttle: limit how often a function can run
function throttle(fn, limit) {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}   
// Debounce: run a function only after a pause
function debounce(fn, delay) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}
// End Deounce
// Lazy loading con cleanup e configurazione flessibile
function initLazyLoading() {
  if (!('IntersectionObserver' in window)) {
    // Fallback per vecchi browser: carica tutte le immagini subito
    document.querySelectorAll('img[data-src]').forEach(img => {
      img.src = img.dataset.src;
    });
    return;
  }
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src'); // Pulizia
          obs.unobserve(img);
        }
      });
    },
    { threshold: 0.05 } // Attiva con solo il 5% visibile (più reattivo)
  );
  document.querySelectorAll('img[data-src]').forEach(img => {
    observer.observe(img);
  });
  // ✅ Esponi l'observer se devi fermarlo in futuro (es. navigazione dinamica)
  return observer;
}
// Inizializza al caricamento
const lazyImageObserver = initLazyLoading();   
// End Lazy loading con cleanup e configurazione flessibile
// Carica in ritardo script pesanti (es. analytics, chatbot) non necessari all'avvio. 
function loadScript(src, callback) {
  // Evita caricamenti duplicati
  if (document.querySelector(`script[src="${src}"]`)) {
    if (callback) callback();
    return;
  }
  const script = document.createElement('script');
  script.src = src;
  script.async = true;
  script.onload = () => callback?.();
  script.onerror = () => {
    console.error(`Errore nel caricamento dello script: ${src}`);
  };
  document.head.appendChild(script);
}   
 // End Carica in ritardo script pesanti.  
// ---End Performance Helpers ---

// When the user mouseover on div, open the info popup
function infoFunction() {
  var popup = document.getElementById("myPopup");
  popup.classList.toggle("show");
}
// Light effect around the bulb image
function turnOnLight() {
  const img = document.getElementById('myImage');
  img.src = 'https://gitechnolo.github.io/biotechproject/Biotech-file/images/pic_bulbon.avif';
  img.classList.add('bulb-glow');
}
function turnOffLight() {
  const img = document.getElementById('myImage');
  img.src = 'https://gitechnolo.github.io/biotechproject/Biotech-file/images/pic_bulboff.avif';
  img.classList.remove('bulb-glow');
}
// End effect around the bulb image
// ———————————————————————
// ———————————————————————
// ✅ MENU MODERNO - Solo su pagine con data-modern-menu
// ———————————————————————
(function () {
// Esci subito se non siamo in una pagina con menu moderno
if (!document.body.hasAttribute('data-modern-menu')) return;
document.addEventListener('DOMContentLoaded', function () {
let openDropdown = null;
// Inizializza tutti i pulsanti del menu
document.querySelectorAll('.tech-nav-btn').forEach(btn => {
const dropdown = btn.nextElementSibling;
// Salta se non c'è dropdown o non è della classe corretta
if (!dropdown || !dropdown.classList.contains('tech-dropdown')) {
console.warn('Dropdown non trovato o classe errata per:', btn);
return;
}
// Inizializza ARIA
btn.setAttribute('aria-haspopup', 'true');
btn.setAttribute('aria-expanded', 'false');
// Click sul pulsante
btn.addEventListener('click', e => {
e.stopPropagation();
const isExpanded = btn.getAttribute('aria-expanded') === 'true';
// Chiudi altro dropdown aperto
if (openDropdown && openDropdown !== dropdown) {
openDropdown.classList.remove('show');
const prevBtn = openDropdown.previousElementSibling?.querySelector('.tech-nav-btn');
prevBtn?.setAttribute('aria-expanded', 'false');
}
// Toggle corrente
if (isExpanded) {
dropdown.classList.remove('show');
btn.setAttribute('aria-expanded', 'false');
openDropdown = null;
} else {
dropdown.classList.add('show');
btn.setAttribute('aria-expanded', 'true');
openDropdown = dropdown;
console.log('Menu aperto, openDropdown =', dropdown.id || 'senza id');
}
});
// Supporto tastiera: Enter o Space
btn.addEventListener('keydown', e => {
if (e.key === 'Enter' || e.key === ' ') {
e.preventDefault();
const isExpanded = btn.getAttribute('aria-expanded') === 'true';
btn.click();
// ✅ Spostare il focus sul primo elemento con role="menuitem"
if (!isExpanded) {
setTimeout(() => {
const firstItem = dropdown.querySelector('[role="menuitem"]');
if (firstItem) firstItem.focus();  // ✅ Usa firstItem
}, 100);
}
}
});
// Navigazione con frecce, Home, End e Escape DENTRO il dropdown
dropdown.addEventListener('keydown', function (e) {
  const items = Array.from(dropdown.querySelectorAll('[role="menuitem"]:not([disabled])'));
  const currentIndex = items.indexOf(document.activeElement);
// Freccia giù
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    const nextIndex = (currentIndex + 1) % items.length;
    items[nextIndex]?.focus();
  }
// Freccia su
  else if (e.key === 'ArrowUp') {
    e.preventDefault();
    const prevIndex = (currentIndex - 1 + items.length) % items.length;
    items[prevIndex]?.focus();
  }
// Home → primo elemento
  else if (e.key === 'Home') {
    e.preventDefault();
    items[0]?.focus();
  }
// End → ultimo elemento
  else if (e.key === 'End') {
    e.preventDefault();
    items[items.length - 1]?.focus();
  }
// Escape → chiude il menu (doppia sicurezza)
  else if (e.key === 'Escape') {
    e.stopPropagation(); // Evita che scatti anche l'altro listener su document
    dropdown.classList.remove('show');
    btn.setAttribute('aria-expanded', 'false');
    btn.focus();
    openDropdown = null;
  }
});   
});
// Chiudi il dropdown al click fuori
document.addEventListener('click', (e) => {
const isClickInside = e.target.closest('.tech-menu-item') || e.target.closest('.tech-dropdown');
if (!isClickInside && openDropdown) {
console.log('Click fuori → chiusura menu');
openDropdown.classList.remove('show');
const btn = openDropdown.previousElementSibling?.querySelector('.tech-nav-btn');
btn?.setAttribute('aria-expanded', 'false');
btn?.focus();
openDropdown = null;
}
});
// Chiudi con tasto ESC
document.addEventListener('keydown', e => {
console.log('Tasto premuto:', e.key, 'openDropdown attuale:', openDropdown);
if (e.key === 'Escape' && openDropdown) {
console.log('Esc premuto: chiusura menu');
openDropdown.classList.remove('show');
const btn = openDropdown.previousElementSibling?.querySelector('.tech-nav-btn');
btn?.setAttribute('aria-expanded', 'false');
btn?.focus(); // Riporta il focus sul pulsante per accessibilità
openDropdown = null;
} else if (e.key === 'Escape') {
console.log('Esc premuto, ma openDropdown è', openDropdown);
}
});
});
})();  
// End MENU MODERNO 

// ———————————————————————
// 🔹 FUNZIONI UNIFICATE – Popup (Senza Alert Post-Chiusura)
// ———————————————————————
/**
 * Funzione generica per aprire popup centrati, mantiene il focus immediato. 
 */
function openPopup(url, title, width, height) {
  // Calcolo delle posizioni per il centramento
  const left = Math.floor((screen.width - width) / 2);
  const top = Math.floor((screen.height - height) / 2);

  // Stringa delle opzioni.
  const options = `
    width=${width},
    height=${height},
    top=${top},
    left=${left},
    resizable=yes,
    scrollbars=yes,
    toolbar=no,
    menubar=no,
    location=no
  `;
  
  // Apre il popup.
  const popup = window.open(url, title, options);

  // --- Gestione Errore (Controllo Immediato) ---
  // Verifica se il browser ha bloccato il popup immediatamente.
  if (!popup || popup.closed || typeof popup.closed == 'undefined') {
    alert("Il popup è stato bloccato. Per favore, abilita i popup per questo sito.");
    return;
  }
  
  // Mette a fuoco la finestra immediatamente.
  popup.focus();
}

// Funzioni specifiche chiamate dai pulsanti HTML 
function openSupportPopup() {
  openPopup(
    'https://gitechnolo.github.io/biotechproject/O.S_support.html',
    'O.S. Support Chat GPT',
    760,
    440
  );
}
function openContactPopup() {
  openPopup(
    'https://gitechnolo.github.io/biotechproject/Tablet_forum.html',
    'Contattaci - Forum ChatGPT',
    825,
    672
  );
}
// ———————————————————————
// ✅ GESTIONE NAVIGAZIONE DA TASTIERA (Pulsante)
// ———————————————————————
document.addEventListener("DOMContentLoaded", function () {
// === 1. Controllo pagina (opzionale) ===
if (!document.body.hasAttribute('data-modern-menu')) return;
// === 2. Riferimenti agli elementi ===
const toggleBtn = document.getElementById("keyboard-nav-toggle");
const body = document.body;
let keyboardNavActive = false;
// === 3. Funzione per attivare/disattivare la modalità tastiera ===
function toggleKeyboardNavigation() {
keyboardNavActive = !keyboardNavActive;
if (keyboardNavActive) {
body.classList.add("keyboard-navigation-on");
toggleBtn?.setAttribute("aria-pressed", "true");
toggleBtn?.setAttribute("data-active", "true");
toggleBtn.textContent = "✅ Navigazione Attiva";
} else {
body.classList.remove("keyboard-navigation-on");
toggleBtn?.setAttribute("aria-pressed", "false");
toggleBtn?.setAttribute("data-active", "false");
toggleBtn.textContent = "🔧 Navigazione Tastiera";
 }
 }
// === 4. Click sul pulsante ===
toggleBtn?.addEventListener("click", toggleKeyboardNavigation);
// === 5. Attivazione automatica con Tab ===
document.addEventListener("keydown", function (e) {
if (e.key === "Tab") {
if (!keyboardNavActive) {
toggleKeyboardNavigation();
}
}
});
// === 6. Rimuovi la classe 'hint' dopo l'animazione (dopo ~2.5s) ===
setTimeout(() => {
toggleBtn?.classList.remove("hint");
}, 2500);
});
// === GESTIONE TEMA DINAMICO - BiotechProject (versione accessibile) ===
function initThemeToggle() {
  const themeBtn = document.getElementById('theme-toggle');
  if (!themeBtn) return;
// Temi compatibili con il glassmorphism
  const themes = [
    { name: 'Verde', rgb: '0, 230, 118', h: 143, s: '100%', l: '45%' },
    { name: 'Ciano', rgb: '0, 200, 255', h: 190, s: '100%', l: '50%' },
    { name: 'Viola', rgb: '138, 43, 226', h: 270, s: '75%', l: '53%' },
    { name: 'Arancione', rgb: '255, 140, 0', h: 39, s: '100%', l: '50%' },
    { name: 'Blu Profondo', rgb: '0, 120, 255', h: 210, s: '100%', l: '50%' }
  ];
  let currentThemeIndex = 0;
// 🔹 Miglioramento 1: tema predefinito in base al contrasto preferito
  if (window.matchMedia('(prefers-contrast: high)').matches) {
    currentThemeIndex = themes.findIndex(t => t.name === 'Blu Profondo') || 0;
  }
// Ripristina il tema salvato (ha priorità su prefers-contrast)
  const savedTheme = localStorage.getItem('biotech-theme');
  if (savedTheme !== null) {
    const index = parseInt(savedTheme, 10);
    if (index >= 0 && index < themes.length) {
      currentThemeIndex = index;
    }
  }
// 🔹 Funzione per aggiornare l'aria-label dinamicamente
  function updateAriaLabel(themeName) {
    themeBtn.setAttribute(
      'aria-label',
      `Cambia tema colore: attualmente ${themeName}, clicca per passare al successivo`
    );
  }

// Applica il tema corrente
  function applyTheme(index) {
    const theme = themes[index];
    document.documentElement.style.setProperty('--color-accent-rgb', theme.rgb);
    document.documentElement.style.setProperty('--color-accent-h', theme.h);
    document.documentElement.style.setProperty('--color-accent-s', theme.s);
    document.documentElement.style.setProperty('--color-accent-l', theme.l);
    document.documentElement.style.setProperty('--color-glow', `hsl(${theme.h}, 100%, 70%)`);
// Aggiorna testo e aria-label
    themeBtn.textContent = `🎨 Tema: (${theme.name})`;
    updateAriaLabel(theme.name);
  }
// Applica il tema al caricamento
  applyTheme(currentThemeIndex);
// Cambia tema al click
  themeBtn.addEventListener('click', (e) => {
    e.preventDefault();
    currentThemeIndex = (currentThemeIndex + 1) % themes.length;
    applyTheme(currentThemeIndex);
// Salva la scelta
    localStorage.setItem('biotech-theme', currentThemeIndex);
  });
}
// Inizializza al caricamento
window.addEventListener('DOMContentLoaded', initThemeToggle);

// Accessibilità video: supporto tastiera ai poster. Caricamento video solo al click (lazy load avanzato)
function handleVideoPosterKey(event) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    loadAndPlayVideo();
  }
}
// End Accessibilità video   

// === Ultima modifica pagina (integrazione diretta) ===
document.addEventListener('DOMContentLoaded', () => {
  const el = document.getElementById('lastModified');
  if (el) {
    const d = new Date(document.lastModified);
    const options = { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    el.textContent = `Last edit: ${d.toLocaleDateString('it-IT', options)}`;
  }
});
// === End ultima modifica pagina (integrazione diretta) ===

// === 🔊 PRONUNCIA TERMINI TECNICI - Accessibilità avanzata ===
// Funzione principale: riproduce la pronuncia di un termine con supporto per termini scientifici personalizzati

function speakTerm(term, language = 'italiano') {
  // Interrompi qualsiasi sintesi vocale in corso per evitare sovrapposizioni
  if (speechSynthesis.speaking) {
    speechSynthesis.cancel();
  }
  // Mappa personalizzata per pronunce scientifiche (lettura estesa o sillabata)
  const customPronunciations = {
    'CRISPR': 'Clustered Regularly Interspaced Short Palindromic Repeats',
    'mitocondri': 'Mi-to-con-dri',
    'lisosoma': 'Li-so-so-ma',
    'miochine': 'Mi-o-ki-ne',
    'sinaptogenesi': 'Si-na-to-jen-e-si',
    'epigenetici': 'E-pi-je-ne-ti-ci',
    'ATP': 'Adenosina trifosfato',
    'DNA': 'Acido desossiribonucleico',
    'RNA': 'Acido ribonucleico',
    'tegumento': 'Te-gu-men-to',
    'Pecquet': 'Pes-ché'     
  };
  // Mappa delle lingue supportate
  const langMap = {
    'italiano': 'it-IT',
    'inglese': 'en-US'
  };
  // Ottieni la pronuncia personalizzata o usa il termine originale
  const utteranceText = customPronunciations[term.toLowerCase()] || term;

  // Crea l'istanza di SpeechSynthesisUtterance
  const utterance = new SpeechSynthesisUtterance(utteranceText);

  // Imposta la lingua, con fallback a italiano
  utterance.lang = langMap[language] || 'it-IT';

  // Parametri vocali ottimizzati per chiarezza
  utterance.rate = 0.8;   // Velocità leggermente ridotta
  utterance.pitch = 1.0;  // Tono neutro e naturale
  utterance.volume = 1.0; // Volume massimo

  // Feedback accessibile per screen reader
  const announcement = document.getElementById('sr-announcement');
  if (announcement) {
    announcement.textContent = `Lettura avviata: ${term}.`;
    // Pulisce il messaggio dopo 1 secondo per non disturbare
    setTimeout(() => {
      if (announcement.textContent.includes(term)) {
        announcement.textContent = '';
      }
    }, 1000);
  }

  // Log per debug (opzionale)
  console.log(`🔊 Pronuncia attivata: "${term}" come "${utteranceText}" (${utterance.lang})`);

  // Avvia la sintesi vocale
  speechSynthesis.speak(utterance);
}

// Gestione tastiera per i pulsanti di pronuncia (accessibilità da tastiera)
function handlePronounceKey(event, term, language = 'italiano') {
  // Supporta sia Invio che barra spaziatrice
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault(); // Evita comportamenti indesiderati
    speakTerm(term, language);
  }
}

// =====================================================
// GESTIONE LINGUA MODULARE (IT/EN) - VERSIONE COMPLETA
// Supporta menu con <b>, ritardo sicuro, localStorage
// =====================================================

let currentLang = 'it';

// Pagine che hanno un JSON specifico
const translatablePages = [
  'index',
  'Progetti',
  'Staff',
  'Marketing',
  'Tech_Maturity',
  'Dermatologia',
  'Cuore',
  'Cellula',
  'Apparato_digerente',
  'Apparato_respiratorio',
  'Apparato_tegumentario',
  'Sistema_linfatico',
  'Specials',
  'Capelli'
];

// Mappa nome pagina → nome file JSON
function getPageKey(pageName) {
  const map = {
    'index': 'home',
    'Tech_Maturity': 'tech_maturity',
    'Apparato_digerente': 'apparato_digerente',
    'Apparato_respiratorio': 'apparato_respiratorio',
    'Apparato_tegumentario': 'apparato_tegumentario',
    'Sistema_linfatico': 'sistema_linfatico'
  };
  return map[pageName] || pageName.toLowerCase();
}

// Estrae il nome della pagina (senza -semplice)
function getPageName() {
  const path = window.location.pathname;
  const fileName = path.split('/').pop().replace('.html', '');
  return fileName.replace('-semplice', '');
}

// Carica un file JSON
async function loadTranslation(path) {
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`File non trovato: ${path}`);
    return await res.json();
  } catch (err) {
    console.warn(err);
    return null;
  }
}
// ===========================
// APPLICA LE TRADUZIONI SENZA DISTRUGGERE IL DOM
// ===========================
function applyTranslations(translations, lang) {
  document.querySelectorAll('[data-lang-key]').forEach(el => {
    const key = el.getAttribute('data-lang-key');
    const value = translations[lang]?.[key];

    if (value !== undefined && value !== null) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.setAttribute('placeholder', value);
      } else if (el.tagName === 'IMG') {
        el.setAttribute('alt', value);
      } else if (el.hasAttribute('aria-label')) {
        el.setAttribute('aria-label', value);
        const bold = el.querySelector('b');
        if (bold) {
          bold.textContent = value;
        } else {
          el.innerHTML = value; // Supporta HTML
        }
      } else {
        const bold = el.querySelector('b');
        if (bold) {
          bold.textContent = value;
        } else {
          el.innerHTML = value; // Supporta HTML
        }
      }
    }
  });
  console.log(`✅ Traduzioni applicate in ${lang}`);
}   
// ===========================
// INIZIALIZZA IL SISTEMA DI TRADUZIONE (CON RITARDO SICURO)
// ===========================
async function initTranslations() {
  setTimeout(async () => {
    const pageName = getPageName();
    const savedLang = getSavedLanguage();

    // ===========================
    // CASO 1: Pagina NON traducibile (es. Tablet_forum.html)
    // ===========================
    if (!translatablePages.includes(pageName)) {
      const common = await loadTranslation('lang/common.json');
      const translations = {
        it: { ...(common?.it || {}) },
        en: { ...(common?.en || {}) }
      };

      applyTranslations(translations, savedLang);
      updateLanguageButton(savedLang);
      document.documentElement.lang = savedLang;

      const button = document.getElementById('lang-toggle');
      if (button) {
        button.addEventListener('click', () => {
          const newLang = savedLang === 'it' ? 'en' : 'it';
          localStorage.setItem('preferred-language', newLang);
          window.location.reload();
        });
      }

      return;
    }
    // ===========================
    // CASO 2: Pagina traducibile → carica common + specifico
    // ===========================
    const translations = { it: {}, en: {} };

    const common = await loadTranslation('lang/common.json');
    if (common) {
      translations.it = { ...common.it };
      translations.en = { ...common.en };
    }

    const pageKey = getPageKey(pageName);
    const pageData = await loadTranslation(`lang/${pageKey}.json`);
    if (pageData) {
      if (pageData.it) translations.it = { ...translations.it, ...pageData.it };
      if (pageData.en) translations.en = { ...translations.en, ...pageData.en };
    }
    // Applica le traduzioni
    applyTranslations(translations, savedLang);
    updateLanguageButton(savedLang);
    document.documentElement.lang = savedLang;
    currentLang = savedLang;

  }, 150); // Ritardo per sicurezza: lascia tempo ad altri script di completare
}
// ===========================
// OTTIENI LA LINGUA PREFERITA
// ===========================
function getSavedLanguage() {
  return localStorage.getItem('preferred-language') || 
         (navigator.language.startsWith('en') ? 'en' : 'it');
}
// ===========================
// AGGIORNA IL PULSANTE LINGUA
// ===========================
function updateLanguageButton(lang) {
  const flag = document.getElementById('lang-flag');
  const text = document.getElementById('lang-text');
  const button = document.getElementById('lang-toggle');
  const label = document.getElementById('lang-label');

  if (!flag || !button) return;

  if (lang === 'it') {
    flag.textContent = '🇬🇧';
    if (text) text.textContent = 'English';
    if (label) label.textContent = 'Switch language';
    button.setAttribute('aria-label', 'Switch to English');
  } else {
    flag.textContent = '🇮🇹';
    if (text) text.textContent = 'Italiano';
    if (label) label.textContent = 'Cambia lingua';
    button.setAttribute('aria-label', 'Cambia lingua in italiano');
  }
}
// ===========================
// CAMBIA LINGUA AL CLICK
// ===========================
function setLanguage(lang) {
  const pageName = getPageName();

  if (!translatablePages.includes(pageName)) {
    loadTranslation('lang/common.json').then(common => {
      if (!common) return;
      const translations = {
        it: common.it || {},
        en: common.en || {}
      };
      setTimeout(() => {
        applyTranslations(translations, lang);
        updateLanguageButton(lang);
        document.documentElement.lang = lang;
        currentLang = lang;
        localStorage.setItem('preferred-language', lang);
      }, 100);
    });
    return;
  }

  const pageKey = getPageKey(pageName);
  const commonPromise = loadTranslation('lang/common.json');
  const pagePromise = loadTranslation(`lang/${pageKey}.json`);

  Promise.all([commonPromise, pagePromise]).then(([common, pageData]) => {
    const translations = { it: {}, en: {} };

    if (common) {
      translations.it = { ...common.it };
      translations.en = { ...common.en };
    }
    if (pageData) {
      if (pageData.it) translations.it = { ...translations.it, ...pageData.it };
      if (pageData.en) translations.en = { ...translations.en, ...pageData.en };
    }

    setTimeout(() => {
      applyTranslations(translations, lang);
      updateLanguageButton(lang);
      document.documentElement.lang = lang;
      currentLang = lang;
      localStorage.setItem('preferred-language', lang);
    }, 100);
  });
}
// ===========================
// TOGGLE LINGUA (chiamato da onclick)
// ===========================
function toggleLanguage() {
  const newLang = currentLang === 'it' ? 'en' : 'it';
  setLanguage(newLang);
}
// ===========================
// AVVIO AL CARICAMENTO DELLA PAGINA
// ===========================
document.addEventListener('DOMContentLoaded', () => {
  initTranslations().catch(err => {
    console.error('Errore nel caricamento delle traduzioni:', err);
  });
// Rendi disponibile globalmente
  window.toggleLanguage = toggleLanguage;
}); 
// === End GESTIONE LINGUA MODULARE (IT/EN) - VERSIONE COMPLETA ===

// ===========================
//  COUNTDOWN AL NUOVO ANNO
// ===========================
const element = document.getElementById('countdown-days');
if (element) {
    const now = new Date();
    const currentYear = now.getFullYear();
    const newYear = now.getMonth() === 11 && now.getDate() === 31 && now.getHours() === 23 ? 
        new Date(currentYear + 1, 11, 31) : 
        new Date(currentYear, 11, 31);
    const remainingDays = Math.ceil((newYear - now) / 86400000);
    element.textContent = remainingDays;
}  