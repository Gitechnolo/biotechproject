// Biotech.js 
// =======================================
// 1. LOGICA PARTICELLE 
// =======================================
(function () {
'use strict';
function randomStemCellColor() {
const colors = [
"rgba(180, 220, 255, 0.26)",
"rgba(220, 255, 180, 0.22)",
"rgba(255, 220, 180, 0.19)",
"rgba(200, 255, 220, 0.21)",
"rgba(255, 200, 220, 0.21)",
];
return colors[Math.floor(Math.random() * colors.length)];
}
function initParticles(canvasId, options = {}) {
const canvas = document.getElementById(canvasId);
if (!canvas) return;
const ctx = canvas.getContext('2d', { alpha: true });
let animationId;
// Riduci il frame rate per risparmiare CPU
const FRAME_DELAY = 100; // ~10 FPS invece di 60
let lastFrameTime = 0;
function resizeCanvas() {
const dpr = window.devicePixelRatio || 1;
const w = window.innerWidth;
const h = window.innerHeight;
// Dimensioni di rendering (risoluzione)
canvas.width = w * dpr;
canvas.height = h * dpr;
// Dimensioni di visualizzazione (layout)
canvas.style.width = '100vw';
canvas.style.height = '100vh';
// Scalatura per DPI
ctx.scale(dpr, dpr);
}
// RIGA RIMOSSA: Non chiamare resizeCanvas() immediatamente per evitare Layout Thrashing
window.addEventListener('resize', resizeCanvas);
const hour = new Date().getHours();
const isDay = hour >= 7 && hour < 19;
if (isDay) {
// Particelle di giorno
const count = Math.min(options.count || 50, 60); // Cap per dispositivi deboli
const color = options.color || 'rgba(231, 231, 231, 0.47)';
const radius = options.radius || 2;
const speed = options.speed || 1;
const particles = Array.from({ length: count }, () => ({
x: Math.random() * window.innerWidth,
y: Math.random() * window.innerHeight,
vx: (Math.random() - 0.5) * speed,
vy: (Math.random() - 0.5) * speed,
}));
function animate(timestamp) {
if (!lastFrameTime || timestamp - lastFrameTime >= FRAME_DELAY) {
ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
particles.forEach(p => {
p.x += p.vx;
p.y += p.vy;
if (p.x < 0 || p.x > window.innerWidth) p.vx *= -1;
if (p.y < 0 || p.y > window.innerHeight) p.vy *= -1;
ctx.beginPath();
ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
ctx.fillStyle = color;
ctx.fill();
});
lastFrameTime = timestamp;
}
animationId = requestAnimationFrame(animate);
}
animate(0);
} else {
// Cellule staminali di notte (più morbide, meno intense)
const count = Math.min(options.count || 30, 40);
const minRadius = 1.5;
const maxRadius = 4;
const speed = options.speed || 0.6;
const cells = Array.from({ length: count }, () => ({
x: Math.random() * window.innerWidth,
y: Math.random() * window.innerHeight,
vx: (Math.random() - 0.5) * speed,
vy: (Math.random() - 0.5) * speed,
r: minRadius + Math.random() * (maxRadius - minRadius),
color: randomStemCellColor(),
}));
function animateStemCells(timestamp) {
if (!lastFrameTime || timestamp - lastFrameTime >= FRAME_DELAY) {
ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
cells.forEach(c => {
c.x += c.vx;
c.y += c.vy;
if (c.x < 0 || c.x > window.innerWidth) c.vx *= -1;
if (c.y < 0 || c.y > window.innerHeight) c.vy *= -1;
ctx.beginPath();
ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
ctx.fillStyle = c.color;
ctx.shadowColor = c.color;
ctx.shadowBlur = 12; // Ridotto da 18 a 12 per risparmiare GPU
ctx.fill();
ctx.shadowBlur = 0; // Reset subito per evitare accumulo
});
lastFrameTime = timestamp;
}
animationId = requestAnimationFrame(animateStemCells);
}
animateStemCells();
}
// Cleanup function esposta
function destroy() {
if (animationId) {
cancelAnimationFrame(animationId);
animationId = null;
}
window.removeEventListener('resize', resizeCanvas);
}
return { destroy, resizeCanvas }; // resizeCanvas ESPONIBILE per la chiamata ritardata
}
// Esporre solo la funzione principale in window
if (typeof window !== 'undefined') {
window.initParticles = initParticles;
}
})();

// =======================================
// 2. FUNZIONE QRedshift (Ottimizzata per TBT e Layout Thrashing)
// =======================================
// QRedshift: Comfort visivo automatico con integrazione menu, Toggle e Persistenza
function QRedshift() {
  const menuContainer = document.getElementById('tech-main-menu');
  const storageKey = 'qredshift_disabled';

  // 1. Uscita Pura
  if (!menuContainer) return;

  // --- Cattura Riferimenti ---
  const particles = document.getElementById('particles-canvas');
  const dna = document.querySelector('.dna-container-8');

  // --- Lettura dello Stato Precedente ---
  const isDisabledFromStorage = localStorage.getItem(storageKey) === 'true';

  // --- Logica di Calcolo del Filtro ---
  const hour = new Date().getHours();
  const isNight = (hour < 7 || hour >= 19);
  const filterDay = 'sepia(0.2) hue-rotate(0deg) brightness(1)';
  const filterNight = 'sepia(0.6) hue-rotate(-30deg) brightness(1)';
  const currentFilter = isNight ? filterNight : filterDay;

  // 2. Determina lo stato iniziale: Se disabilitato in storage, parte da OFF
  let isActive = !isDisabledFromStorage;

  // INIZIALIZZAZIONE CRITICA: Sincronizzazione al caricamento 
  if (isActive) {
    document.body.classList.add('qredshift-active');
    document.body.style.filter = currentFilter;
    document.body.style.transition = 'filter 0.5s';
    document.body.style.willChange = 'filter';

    // Sicurezza: in stato attivo, gli effetti DEVONO essere visibili
    if (particles) particles.style.display = '';
    if (dna) dna.style.display = '';

    // ⚡ Avvio del Canvas (Solo in stato attivo) ⚡
    if (typeof window.initParticles === "function" && particles && !window.particlesController) {
        // Primo Yield: Avvia il codice di initParticles.
        setTimeout(() => { 
            window.particlesController = window.initParticles("particles-canvas", { count: 50, speed: 1 });
            
            // Secondo Yield: Chiama resizeCanvas DOPO un ulteriore yield. 
            // Questo spezza l'operazione di lettura/scrittura che causa il thrashing.
            if (window.particlesController && typeof window.particlesController.resizeCanvas === 'function') {
                setTimeout(() => {
                    window.particlesController.resizeCanvas();
                }, 0); 
            }

        }, 0); 
    }

  } else {
    // SINCRONIZZAZIONE CRITICA (Se lo stato è OFF)
    document.body.classList.remove('qredshift-active');
    document.body.style.filter = '';
    document.body.style.transition = '';
    document.body.style.willChange = 'auto';

    // Se l'utente ha disattivato QRedshift, disattiviamo anche gli effetti pesanti
    if (particles) particles.style.display = 'none';
    if (dna) dna.style.display = 'none';
    
    // Ferma subito l'animazione se era stata accidentalmente avviata (cleanup)
    if (window.particlesController && typeof window.particlesController.destroy === 'function') {
        window.particlesController.destroy(); 
        window.particlesController = null;
    }
  }

  // --- Creazione e Logica del Pulsante nel Menu (Impostazione UI) ---
  // ... (Tutto il codice per creare e impostare il pulsante del menu) ...
  const menuItem = document.createElement('div');
  menuItem.className = 'tech-menu-item';
  menuItem.setAttribute('data-menu', 'qredshift');

  const button = document.createElement('button');
  button.className = 'tech-nav-btn';
  button.type = 'button';
  button.setAttribute('aria-haspopup', 'false');
  button.setAttribute('aria-expanded', 'false');

  const activeIcon = isNight ? '🌙' : '☀️';
  const initialIcon = isActive ? activeIcon : '☀️';
  const initialLabel = isActive
    ? `Modalità comfort visivo attiva: ${isNight ? 'Notte' : 'Giorno'}`
    : 'Modalità comfort visivo disattivata';

  button.setAttribute('aria-pressed', isActive);
  button.setAttribute('aria-label', initialLabel);
  button.innerHTML = `<b>${initialIcon} Comfort</b>`;

  menuItem.appendChild(button);
  menuContainer.appendChild(menuItem);


  // === FUNZIONE TOGGLE (Aggiornata per la gestione del controller) ===
  const toggleQRedshift = function () {
    isActive = !isActive;

    if (isActive) {
      // --- STATO ATTIVO (Riattiva tutto) ---
      
      // ⚡ Ri-Avvio del Canvas (Se era spento) ⚡
      if (!window.particlesController && typeof window.initParticles === "function" && particles) {
          // Avvia il controller
          const newController = window.initParticles("particles-canvas", { count: 50, speed: 1 });
          window.particlesController = newController;
          
          // Chiama resize subito dopo l'avvio
          if (typeof newController.resizeCanvas === 'function') {
              newController.resizeCanvas();
          }
      }

      document.body.classList.add('qredshift-active');
      document.body.style.filter = currentFilter;
      document.body.style.transition = 'filter 0.5s';

      if (particles) particles.style.display = '';
      if (dna) dna.style.display = '';

      document.body.style.willChange = 'filter';
      localStorage.setItem(storageKey, 'false');

      const currentIcon = isNight ? '🌙' : '☀️';
      button.setAttribute('aria-pressed', 'true');
      button.setAttribute('aria-label', `Modalità comfort visivo attiva: ${isNight ? 'Notte' : 'Giorno'}`);
      button.innerHTML = `<b>${currentIcon} Comfort</b>`;

    } else {
      // --- STATO DISATTIVO (Disattiva tutto) ---
      
      // CRITICO: Ferma l'animazione CPU-intensive prima di nasconderla
      if (window.particlesController && typeof window.particlesController.destroy === 'function') {
          window.particlesController.destroy();
          window.particlesController = null; // Rimuovi il riferimento
      }

      document.body.classList.remove('qredshift-active');
      document.body.style.filter = '';
      document.body.style.transition = '';
      document.body.style.willChange = 'auto';

      if (particles) particles.style.display = 'none';
      if (dna) dna.style.display = 'none';

      localStorage.setItem(storageKey, 'true');

      button.setAttribute('aria-pressed', 'false');
      button.setAttribute('aria-label', 'Modalità comfort visivo disattivata');
      button.innerHTML = '<b>☀️ Comfort</b>';
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
  window.scrollTo({ top: 0, behavior: 'smooth' }); // Transizione dolce verso l’alto
}

function closeModal() {
  document.getElementById("myModal").style.display = "none";
  // Reset dello zoom alla chiusura
  resetAllZoom();
}

var slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
  resetAllZoom(); // Resetta la lente quando cambi slide
  showSlides(slideIndex += n);
}

function currentSlide(n) {
  resetAllZoom(); // Resetta la lente quando clicchi una miniatura
  showSlides(slideIndex = n);
}

function showSlides(n) {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  var dots = document.getElementsByClassName("demo");
  var captionText = document.getElementById("caption");

  if (slides.length === 0) return;

  if (n > slides.length) { slideIndex = 1; }
  if (n < 1) { slideIndex = slides.length; }

  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }

  slides[slideIndex - 1].style.display = "block";

  if (dots.length > 0 && dots[slideIndex - 1]) {
    dots[slideIndex - 1].className += " active";
    if (captionText) {
      captionText.innerHTML = dots[slideIndex - 1].alt || "";
    }
  }
}

// --- LOGICA LENTE D'INGRANDIMENTO ---

function resetAllZoom() {
  document.querySelectorAll('.zoom-container').forEach(container => {
    container.classList.remove('zoomed');
    const img = container.querySelector('img');
    if (img) img.style.transformOrigin = `center center`;
  });
}

document.querySelectorAll('.zoom-container').forEach(container => {
  const img = container.querySelector('img');

  container.addEventListener('click', function() {
    this.classList.toggle('zoomed');
    if (!this.classList.contains('zoomed')) {
      img.style.transformOrigin = `center center`;
    }
  });

  container.addEventListener('mousemove', function(e) {
    if (this.classList.contains('zoomed')) {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      img.style.transformOrigin = `${x}% ${y}%`;
    }
  });

  container.addEventListener('mouseleave', function() {
    this.classList.remove('zoomed');
    img.style.transformOrigin = `center center`;
  });
});

// End Lightbox

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
  // Esponi l'observer se devi fermarlo in futuro (es. navigazione dinamica)
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
// MENU MODERNO - Solo su pagine con data-modern-menu
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
// Spostare il focus sul primo elemento con role="menuitem"
if (!isExpanded) {
setTimeout(() => {
const firstItem = dropdown.querySelector('[role="menuitem"]');
if (firstItem) firstItem.focus();  // Usa firstItem
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
// GESTIONE NAVIGAZIONE DA TASTIERA (Pulsante)
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

// === Ultima modifica pagina ===
(function() {
  // Esecuzione immediata (IIFE) per evitare di inquinare lo scope globale
  // e per eseguire il codice il prima possibile.
  const el = document.getElementById('lastModified');
  
  // Controlla immediatamente se l'elemento esiste
  if (el) {
    // document.lastModified è una stringa standardizzata, 
    // l'oggetto Date la interpreta direttamente.
    const lastModifiedDate = new Date(document.lastModified);

    // Se document.lastModified non è valido (es. '01/01/1970'),
    // la data sarà "Invalid Date". Questo controllo la evita.
    if (isNaN(lastModifiedDate)) {
        // Fallback o uscita se la data non è valida
        console.warn("Impossibile recuperare la data di ultima modifica valida.");
        return; 
    }
    // toLocaleString per data, ora/minuti.
    const options = { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      // Opzionale: per forzare l'uso di 24 ore (non necessario in it-IT, ma buona pratica)
      // hour12: false 
    };
    // Uso diretto di toLocaleString e template literal
    el.textContent = `Ultima modifica: ${lastModifiedDate.toLocaleString('it-IT', options)}`;
  }
})(); 
// === End ultima modifica pagina ===

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
        // Aggiorna l'attributo ALT (fondamentale per accessibilità)
        el.setAttribute('alt', value);
        
        // AGGIORNAMENTO DINAMICO PER BIOTECH MODAL
        // Se l'immagine tradotta è una di quelle del popup, aggiorniamo il caption visibile
        const modal = document.getElementById("myModal");
        const modalImg = document.getElementById("img01");
        const captionText = document.getElementById("caption");
        
        // Se il modal è aperto E l'immagine nel modal corrisponde a quella che stiamo traducendo
        if (modal && modal.classList.contains("show") && modalImg && modalImg.src === el.src) {
          captionText.textContent = value;
        }
      } else if (el.hasAttribute('aria-label')) {
        el.setAttribute('aria-label', value);
        const bold = el.querySelector('b');
        if (bold) {
          bold.textContent = value;
        } else {
          el.innerHTML = value; 
        }
      } else {
        const bold = el.querySelector('b');
        if (bold) {
          bold.textContent = value;
        } else {
          el.innerHTML = value; 
        }
      }
    }
  });
  console.log(`✅ Traduzioni applicate in ${lang}`);
}   
// ===========================
// INIZIALIZZA IL SISTEMA DI TRADUZIONE (SENZA RITARDO BLOCCANTE)
// ===========================
async function initTranslations() {
  // ESECUZIONE IMMEDIATA: Le richieste fetch beneficeranno ora del preload nel <head>
  const pageName = getPageName();
  const savedLang = getSavedLanguage();

  // ===========================
  // CASO 1: Pagina NON traducibile (es. Tablet_forum.html)
  // ===========================
  if (!translatablePages.includes(pageName)) {
    // La chiamata a loadTranslation('lang/common.json') sfrutterà il preload
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

  // Queste chiamate sfrutteranno i preload nel <head>
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
  const isTranslatable = translatablePages.includes(pageName);
  
  // Prepariamo le promesse: common è sempre necessaria
  const promises = [loadTranslation('lang/common.json')];
  
  // Se la pagina è specifica, carichiamo anche il suo file
  if (isTranslatable) {
    const pageKey = getPageKey(pageName);
    promises.push(loadTranslation(`lang/${pageKey}.json`));
  }

  Promise.all(promises).then(([common, pageData]) => {
    // Unifichiamo le traduzioni in un unico oggetto
    const translations = {
      it: { ...(common?.it || {}), ...(pageData?.it || {}) },
      en: { ...(common?.en || {}), ...(pageData?.en || {}) }
    };

    // RENDIAMO LE TRADUZIONI GLOBALI
    // Questo permette a filterSelection di leggerle istantaneamente
    window.cachedTranslations = translations;

    // Applichiamo le modifiche
    setTimeout(() => {
      applyTranslations(translations, lang);
      updateLanguageButton(lang);
      document.documentElement.lang = lang;
      currentLang = lang;
      localStorage.setItem('preferred-language', lang);
      
      // Se esiste un messaggio di filtro attivo, aggiornalo subito
      const msgEl = document.getElementById('filter-message');
      if (msgEl && msgEl.style.display === 'block') {
        msgEl.textContent = translations[lang]['filter-empty'] || "";
      }
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

// =======================================
// SALUTO SETTIMANALE (biotech_week.min.js integrato) - OTTIMIZZATO
// =======================================

document.addEventListener('DOMContentLoaded', () => {
    const weekElement = document.getElementById("week");
    if (!weekElement) return;

    function createSpans(text, start) {
        return text.split('').map((char, index) => 
            `<span style='--i:${start + index}'>${char === ' ' ? '&nbsp;' : char}</span>`
        ).join('');
    }

    const messages = {
        it: ['buona domenica!', 'buon lunedì!', 'buon martedì!', 'buon mercoledì!', 'buon giovedì!', 'buon venerdì!', 'buon sabato!'],
        en: ['happy sunday!', 'happy monday!', 'happy tuesday!', 'happy wednesday!', 'happy thursday!', 'happy friday!', 'happy saturday!'],
        es: ['¡buen domingo!', '¡buen lunes!', '¡buen martes!', '¡buen miércoles!', '¡buen jueves!', '¡buen viernes!', '¡buen sábado!'],
        fr: ['bon dimanche !', 'bon lundi !', 'bon mardi !', 'bon mercredi !', 'bon jeudi !', 'bon vendredi !', 'bon samedi !'],
        de: ['schönen sonntag!', 'schönen montag!', 'schönen dienstag!', 'schönen mittwoch!', 'schönen donnerstag!', 'schönen freitag!', 'schönen samstag!'],
        nl: ['fijne zondag!', 'fijne maandag!', 'fijne dinsdag!', 'fijne woensdag!', 'fijne donderdag!', 'fijne vrijdag!', 'fijne zaterdag!'],
        pt: ['boa domingo!', 'boa segunda!', 'boa terça!', 'boa quarta!', 'boa quinta!', 'boa sexta!', 'bom sábado!']
    };

    const baseTitle = 'Biotech Project vi augura ';
    const titles = {
        en: 'Biotech Project wishes you ',
        es: 'Biotech Project le desea ',
        fr: 'Biotech Project vous souhaite ',
        de: 'Biotech Project wünscht Ihnen ',
        nl: 'Biotech Project wenst u ',
        pt: 'Biotech Project deseja a você '
    };

    const greetings = {
        it: ['Buonanotte', 'Buongiorno', 'Buon pomeriggio', 'Buonasera'],
        en: ['Good night', 'Good morning', 'Good afternoon', 'Good evening'],
        es: ['Buenas noches', 'Buenos días', 'Buenas tardes', 'Buenas noches'],
        fr: ['Bonne nuit', 'Bonjour', 'Bon après-midi', 'Bonne soirée'],
        de: ['Gute Nacht', 'Guten Morgen', 'Guten Tag', 'Guten Abend'],
        nl: ['Welterusten', 'Goedemorgen', 'Goede middag', 'Goede avond'],
        pt: ['Boa noite', 'Bom dia', 'Boa tarde', 'Boa noite']
    };

    const userLang = (navigator.language || 'it').slice(0, 2).toLowerCase();
    const lang = messages[userLang] ? userLang : 'it';

    const hour = new Date().getHours();
    let greetingIndex = 1;
    if (hour < 6) greetingIndex = 0;
    else if (hour < 14) greetingIndex = 1; // -> 13:59:59 PM
    else if (hour < 18) greetingIndex = 2;
    else greetingIndex = 3;

    const today = new Date().getDay();
    const message = messages[lang][today];
    const title = titles[lang] || baseTitle;
    const greeting = greetings[lang][greetingIndex];
    
    // OTTIMIZZAZIONE: Posticipa l'iniezione pesante del DOM
    window.requestAnimationFrame(() => {
        const daySpans = createSpans(message, 26);
        const titleSpans = createSpans(title, 1);

        // Scrittura finale del DOM
        if (weekElement) {
            weekElement.innerHTML = `<div class="greeting-time">${greeting}</div>${titleSpans + daySpans}`;
        }
    });
});
// =======================================
// FINE SALUTO SETTIMANALE
// =======================================

// ===========================
//  COUNTDOWN AL NUOVO ANNO - OTTIMIZZATO
// ===========================
const element = document.getElementById('countdown-days');
if (element) {
    const now = new Date();
    const currentYear = now.getFullYear();
    
    // Calcola l'inizio del prossimo anno (Gennaio 1, 00:00:00)
    let nextYearStart = new Date(currentYear + 1, 0, 1); 
    
    // Se siamo già a Gennaio, calcola l'anno ancora successivo
    if (now.getMonth() === 0 && now.getDate() !== 1) { // Mese 0 = Gennaio
        nextYearStart = new Date(currentYear + 2, 0, 1);
    }
    
    const diff = nextYearStart - now;
    const MS_PER_DAY = 86400000;
    
    // Usiamo Math.floor per non contare il giorno corrente come intero
    const remainingDays = Math.floor(diff / MS_PER_DAY);
    
    // Aggiorna l'elemento in un'unica scrittura
    element.textContent = remainingDays > 0 ? remainingDays : 0; 
}  