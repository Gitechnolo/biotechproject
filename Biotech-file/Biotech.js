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

// ===== LIGHTBOX CELLLA - CUORE - APPARATO RESPIRATORIO - SISTEMA LINFATICO =====
let lastFocusedElement; // Variabile globale per ricordare dove eravamo

function openModal() {
  lastFocusedElement = document.activeElement; // Memorizza l'elemento cliccato
  const modal = document.getElementById("myModal");
  if (modal) {
    modal.style.display = "block";
    
    // Porta il focus sul pulsante di chiusura appena si apre per accessibilità
    setTimeout(() => {
      const closeBtn = document.getElementById("closeBtn");
      if (closeBtn) closeBtn.focus();
    }, 100);
    
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  }
}

function closeModal() {
  const modal = document.getElementById("myModal");
  if (modal) {
    modal.style.display = "none";
    resetAllZoom();
    
    // Torna all'elemento che ha aperto la modale
    if (lastFocusedElement) {
      lastFocusedElement.focus();
    }
  }
}

// CHIUSURA CON TASTO ESC (Globale)
document.addEventListener('keydown', function(event) {
  if (event.key === "Escape") {
    const modal = document.getElementById("myModal");
    if (modal && modal.style.display === "block") {
      closeModal();
    }
  }
});

var slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
  resetAllZoom(); 
  showSlides(slideIndex += n);
}

function currentSlide(n) {
  resetAllZoom(); 
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

// LOGICA LENTE D'INGRANDIMENTO
function resetAllZoom() {
  document.querySelectorAll('.zoom-container').forEach(container => {
    container.classList.remove('zoomed');
    const img = container.querySelector('img');
    if (img) img.style.transformOrigin = `center center`;
  });
}

document.querySelectorAll('.zoom-container').forEach(container => {
  const img = container.querySelector('img');
  if (!img) return;

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

// GESTIONE AUTOMATICA EVENTI (Alleggerimento HTML)
document.addEventListener('DOMContentLoaded', function() {
  
  const handleInteraction = (element, callback) => {
    if(!element) return;
    element.addEventListener('click', callback);
    element.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        callback();
      }
    });
  };

  // 1. Click immagini principali della griglia
  document.querySelectorAll('#main-gallery .gallery-item').forEach(img => {
    handleInteraction(img, () => {
      openModal();
      currentSlide(parseInt(img.getAttribute('data-slide')));
    });
  });

  // 2. Click miniature nel modal
  document.querySelectorAll('#thumb-gallery .demo').forEach(thumb => {
    handleInteraction(thumb, () => {
      currentSlide(parseInt(thumb.getAttribute('data-slide')));
    });
  });

  // 3. Pulsanti di controllo
  handleInteraction(document.getElementById('closeBtn'), closeModal);
  
  const prevBtn = document.getElementById('prevSlide');
  if(prevBtn) handleInteraction(prevBtn, () => plusSlides(-1));

  const nextBtn = document.getElementById('nextSlide');
  if(nextBtn) handleInteraction(nextBtn, () => plusSlides(1));

  // 4. Gestione avanzata Tastiera (Frecce + Focus Trap)
  document.addEventListener('keydown', (e) => {
    const modal = document.getElementById("myModal");
    if (!modal || modal.style.display !== "block") return;

    // --- LOGICA FOCUS TRAP ---
    if (e.key === 'Tab') {
      // Trova tutti gli elementi cliccabili dentro la modale
      const focusableElements = modal.querySelectorAll('button, [tabindex="0"], .close, .prev, .next');
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) { // Shift + Tab (indietro)
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else { // Solo Tab (avanti)
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    }

    // --- LOGICA FRECCE ---
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      plusSlides(-1);
    }
    if (e.key === "ArrowRight") {
      e.preventDefault();
      plusSlides(1);
    }
  });
});
// END LIGHTBOX SCRIPT

// Works for (Mitocondri.png, Lisosoma.png, Miochine.png, Pelle.png) images with id starting with 'myImg'
// ✅ Biotech Modal Popup Script con Effetto Espansione (Lente)
document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("myModal");
  const modalImg = document.getElementById("img01");
  const captionText = document.getElementById("caption");
  const closeBtn = modal ? modal.querySelector(".close") : document.querySelector("#myModal .close");

  let lastFocusedElement = null;

  if (!modal || !modalImg || !closeBtn) return;

  /**
   * FUNZIONE GLOBALE: Apre il modal partendo dal punto esatto del click
   */
  window.openBiotechModal = function(imgId, event) {
    const targetImg = document.getElementById(imgId);
    if (!targetImg) return;

    lastFocusedElement = event.currentTarget; 

    const rect = lastFocusedElement.getBoundingClientRect();
    const originX = rect.left + rect.width / 2;
    const originY = rect.top + rect.height / 2;

    modalImg.style.transformOrigin = `${originX}px ${originY}px`;
    modalImg.src = targetImg.src;
    captionText.textContent = targetImg.alt || "";

    modal.style.display = "flex"; 
    
    setTimeout(() => {
      modal.classList.add("show");
      closeBtn.focus(); // Porta il focus sulla X di chiusura
    }, 10);
  };

  /**
   * Chiude il modale con effetto zoom-out
   */
  function closeBiotechModal() {
    if (!modal.classList.contains("show")) return;
    
    modal.classList.remove("show");
    
    setTimeout(() => {
      modal.style.display = "none";
      modalImg.src = "";
      if (lastFocusedElement) {
        lastFocusedElement.focus(); // Ripristina il focus sull'elemento originale
        lastFocusedElement = null;
      }
    }, 400);
  }

  // --- GESTIONE EVENTI ---

  closeBtn.onclick = closeBiotechModal;
  
  // Gestione tastiera dedicata al modal
  document.addEventListener("keydown", function (e) {
    if (!modal.classList.contains("show")) return;

    // 1. Chiusura con ESC
    if (e.key === 'Escape') {
      closeBiotechModal();
    }

    // 2. LOGICA FOCUS TRAP (Gestione TAB)
    if (e.key === 'Tab') {
      // Individua tutti gli elementi che possono ricevere focus nel modal
      // In questo caso il closeBtn, ma includiamo eventuali altri per sicurezza
      const focusableElements = modal.querySelectorAll('button, [tabindex="0"], .close');
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) { // Se preme Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else { // Se preme Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    }
    
    // Supporto invio/spazio sul tasto chiudi (se non è un <button> nativo)
    if (e.target === closeBtn && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      closeBiotechModal();
    }
  });

  modal.onclick = function (e) {
    if (e.target === modal) closeBiotechModal();
  };
});
// End Biotech modal popup script

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

// ==========================================
// BIOTECH CORE ENGINE - UNIFIED CONTROL UNIT
// ==========================================
document.addEventListener('DOMContentLoaded', () => {

    // --- UTILS COMUNI ---
    const userLangFull = navigator.language || navigator.userLanguage;
    const userLangShort = userLangFull.slice(0, 2).toLowerCase();
    const isIt = userLangShort === 'it';
    const pad = n => n < 10 ? '0' + n : n;

    // Helper per determinare la stagione (usato da più moduli)
    const getCurrentSeason = () => {
        const now = new Date();
        const dateVal = (now.getMonth() + 1) * 100 + now.getDate();
        if (dateVal >= 321 && dateVal < 621) return "spring";
        if (dateVal >= 621 && dateVal < 923) return "summer";
        if (dateVal >= 923 && dateVal < 1221) return "autumn";
        return "winter";
    };

    // --- 1. ANNUAL CYCLE & SEASON MONITOR ---
    function initSeasonMonitor() {
        const countdownEl = document.getElementById('modern-countdown');
        if (!countdownEl) return;

        let dataDisplay = document.getElementById('bio-data-display') || document.createElement('div');
        if (!dataDisplay.id) {
            dataDisplay.id = 'bio-data-display';
            countdownEl.innerHTML = '';
            countdownEl.appendChild(dataDisplay);
        }

        const lang = {
            seasons: isIt 
                ? { spring: "PRIMAVERA", summer: "ESTATE", autumn: "AUTUNNO", winter: "INVERNO" }
                : { spring: "SPRING", summer: "SUMMER", autumn: "AUTUMN", winter: "WINTER" },
            phase: isIt ? "FASE CICLO" : "CYCLE PHASE"
        };

        const updateBioCycle = () => {
            const now = new Date();
            const year = now.getFullYear();
            const seasonKey = getCurrentSeason();
            const start = new Date(year, 0, 1);
            const end = new Date(year + 1, 0, 1);
            const progress = ((now - start) / (end - start)) * 100;
            const daysLeft = Math.floor((end - now) / 86400000);

            dataDisplay.innerHTML = `
                <div class="bio-season-label">${lang.seasons[seasonKey]} ${lang.phase}</div>
                <div class="bio-progress-data">
                    ${progress.toFixed(2)}% 
                    <span class="bio-t-minus">| T-MINUS: ${daysLeft}${isIt ? 'G' : 'D'}</span>
                </div>
            `;
        };
        updateBioCycle();
        setInterval(updateBioCycle, 3600000);
    }

    // --- 2. OROLOGIO BIO-CIRCADIANO ---
    function initBioClock() {
        const clockEl = document.getElementById('clock2');
        if (!clockEl) return;

        const circadianMap = {
            0:  { it: ["RIGENERAZIONE GLINFATICA", "RIPARAZIONE CELLULARE", "SOMATOTROPINA", "BUIO TOTALE"], en: ["GLYMPHATIC REGEN", "CELLULAR REPAIR", "GH HORMONE", "TOTAL DARKNESS"] },
            6:  { it: ["PICCO DI CORTISOLO", "FASE RISVEGLIO", "CORTISOLO", "LUCE NATURALE"], en: ["CORTISOL SPIKE", "AWAKENING", "CORTISOL", "NATURAL LIGHT"] },
            8:  { it: ["ATTIVAZIONE METABOLICA", "FUELING", "GRELINA", "COLAZIONE PROT."], en: ["METABOLIC ONSET", "FUELING", "GHRELIN", "PROTEIN BREAKFAST"] },
            10: { it: ["MASSIMA ALLERTA", "PICCO COGNITIVO", "DOPAMINA", "FOCUS ATTIVO"], en: ["MAX ALERTNESS", "COGNITIVE PEAK", "DOPAMINE", "ACTIVE FOCUS"] },
            12: { it: ["SHIFT METABOLICO", "FOCUS DIGESTIVO", "INSULINA", "PAUSA NUTRIZIONE"], en: ["METABOLIC SHIFT", "DIGESTIVE FOCUS", "INSULIN", "NUTRITION BREAK"] },
            14: { it: ["POST-PRANDIAL DIP", "BASSA VIGILANZA", "OREXINA", "MICRO-RECOVERY"], en: ["POST-PRANDIAL DIP", "LOW VIGILANCE", "OREXIN", "MICRO-RECOVERY"] },
            16: { it: ["PICCO FISICO", "EFFICIENZA MAX", "ADRENALINA", "MOVIMENTO"], en: ["PHYSICAL PEAK", "EFFICIENCY MAX", "ADRENALINE", "WORKOUT"] },
            18: { it: ["FINESTRA ANABOLICA", "RECUPERO MUSCOLARE", "MIOCHINE", "NUTRIZIONE POST-WORKOUT"], en: ["ANABOLIC WINDOW", "MUSCLE RECOVERY", "MYOKINES", "POST-WORKOUT NUTRITION"] },
            20: { it: ["MODALITÀ RECUPERO", "DECOMPRESSIONE", "ADENOSINA", "RELAX ATTIVO"], en: ["RECOVERY MODE", "DOWNTIME", "ADENOSINE", "ACTIVE RELAX"] },
            22: { it: ["RILASCIO MELATONINA", "INIZIO RIGENERAZIONE", "MELATONINA", "NO LUCE BLU"], en: ["MELATONIN ONSET", "REGEN START", "MELATONIN", "NO BLUE LIGHT"] },
            23: { it: ["FASE REM", "CONSOLIDAMENTO MEMORIA", "BDNF", "SOGNO PROFONDO"], en: ["REM PHASE", "MEMORY CONSOLIDATION", "BDNF", "DEEP DREAMING"] }
        };

        const getDynamicAdvice = (hour, baseAdvice) => {
            const season = getCurrentSeason();
            if (hour >= 6 && hour < 9) {
                if (season === "winter") return isIt ? "LUCE ART. 10K LUX" : "10K LUX ART. LIGHT";
                if (season === "summer") return isIt ? "SOLE DIRETTO 10M" : "DIRECT SUN 10M";
            }
            if (hour >= 10 && hour < 13 && (season === "winter" || season === "autumn")) 
                return isIt ? "INTEGRA VITAMINA D" : "VITAMIN D INTAKE";
            if (hour >= 13 && hour < 17 && season === "summer") 
                return isIt ? "IDRATAZIONE + SALI" : "HYDRATION + SALTS";
            if (hour >= 20 && season === "winter") 
                return isIt ? "THERMO-RELAX (CALDO)" : "WARM THERMO-RELAX";
            return baseAdvice;
        };

        const updateClock = () => {
            const now = new Date();
            const hour = now.getHours();
            const keys = Object.keys(circadianMap).map(Number).reverse();
            const currentKey = keys.find(k => hour >= k) || 0;
            const data = circadianMap[currentKey][isIt ? 'it' : 'en'];
            
            const advice = getDynamicAdvice(hour, data[3]);
            const timeStr = `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()} | ${pad(hour)}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

            clockEl.innerHTML = `
                <div class="hud-inline-row">
                    <span>MOLECOLA: <b class="bio-data-value">${data[2]}</b></span>
                    <span class="separator">|</span>
                    <span>CONSIGLIO: <b class="bio-data-value">${advice}</b></span>
                </div>
                <span class="bio-status-label">${data[0]}</span>
                <span class="bio-clock-time">${timeStr}</span>
                <span class="bio-system-state">SYS STATE: ${data[1]}</span>
            `;
        };
        updateClock();
        setInterval(updateClock, 1000);
    }

    // --- 3. SALUTO SETTIMANALE ---
    function initWeeklyGreeting() {
        const weekElement = document.getElementById("week");
        if (!weekElement) return;

        const createSpans = (text, start) => text.split('').map((char, index) => 
            `<span style='--i:${start + index}'>${char === ' ' ? '&nbsp;' : char}</span>`
        ).join('');

        const messages = {
            it: ['buona domenica!', 'buon lunedì!', 'buon martedì!', 'buon mercoledì!', 'buon giovedì!', 'buon venerdì!', 'buon sabato!'],
            en: ['happy sunday!', 'happy monday!', 'happy tuesday!', 'happy wednesday!', 'happy thursday!', 'happy friday!', 'happy saturday!'],
            es: ['¡buen domingo!', '¡buen lunes!', '¡buen martes!', '¡buen miércoles!', '¡buen jueves!', '¡buen viernes!', '¡buen sabato!'],
            fr: ['bon dimanche !', 'bon lundi !', 'bon mardi !', 'bon mercredi !', 'bon jeudi !', 'bon vendredi !', 'bon samedi !'],
            de: ['schönen sonntag!', 'schönen montag!', 'schönen dienstag!', 'schönen mittwoch!', 'schönen donnerstag!', 'schönen freitag!', 'schönen samstag!'],
            nl: ['fijne zondag!', 'fijne maandag!', 'fijne dinsdag!', 'fijne woensdag!', 'fijne donderdag!', 'fijne vrijdag!', 'fijne zaterdag!'],
            pt: ['boa domingo!', 'boa segunda!', 'boa terça!', 'boa quarta!', 'boa quinta!', 'boa sexta!', 'bom sabato!']
        };

        const titles = {
            it: 'Biotech Project vi augura ',
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

        const langKey = messages[userLangShort] ? userLangShort : 'it';
        const now = new Date();
        const hour = now.getHours();
        const today = now.getDay();

        let gIdx = hour < 6 ? 0 : hour < 14 ? 1 : hour < 18 ? 2 : 3;
        
        const message = messages[langKey][today];
        const title = titles[langKey] || titles.it;
        const greeting = greetings[langKey][gIdx];

        window.requestAnimationFrame(() => {
            const daySpans = createSpans(message, 26);
            const titleSpans = createSpans(title, 1);
            weekElement.innerHTML = `<div class="greeting-time">${greeting}</div>${titleSpans + daySpans}`;
        });
    }    

    // --- ESECUZIONE SINCRONIZZATA ---
    initSeasonMonitor();
    initBioClock();
    initWeeklyGreeting();
});