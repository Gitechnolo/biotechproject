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
    modalImg.alt = targetImg.alt || ""; 
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

// —————————————————————————————————————————————————————————————————————————————
//  BIOTECH PROJECT - ULTIMATE PERFORMANCE HELPERS (2026 EDITION)
// —————————————————————————————————————————————————————————————————————————————

// THROTTLE: Fluidità a 60/120fps per scroll e resize.
const throttle = (fn) => {
  let ticking = false;
  return (...args) => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        fn.apply(this, args);
        ticking = false;
      });
      ticking = true;
    }
  };
};

// DEBOUNCE: Ideale per input e pre-fetching.
const debounce = (fn, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
};

// SMART PRE-FETCHING: Carica le pagine in background prima del click.
// Si attiva solo se l'utente sosta sul link per almeno 200ms.
function initSmartPrefetch() {
  const menuLinks = document.querySelectorAll('#tech-main-menu a[href]');
  const prefetchedLinks = new Set();

  menuLinks.forEach(link => {
    const url = link.href;

    // Ignora link esterni, anchor interne o file già scaricati
    if (!url.startsWith(window.location.origin) || url.includes('#') || prefetchedLinks.has(url)) {
      return;
    }

    // Quando l'utente passa il mouse sul link...
    link.addEventListener('mouseenter', () => {
      link._prefetchTimer = setTimeout(() => {
        if (!prefetchedLinks.has(url)) {
          const prefetchLink = document.createElement('link');
          prefetchLink.rel = 'prefetch';
          prefetchLink.href = url;
          document.head.appendChild(prefetchLink);
          
          prefetchedLinks.add(url);
          console.log(`📡 Pre-fetching: ${url}`);
        }
      }, 200); // Ritardo di 200ms per evitare pre-fetch accidentali
    });

    // Se il mouse esce prima dei 200ms, annulla il pre-fetch
    link.addEventListener('mouseleave', () => {
      clearTimeout(link._prefetchTimer);
    });
  });
}

// LAZY LOADING: Caricamento anticipato delle immagini.
function initLazyLoading() {
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('img[data-src]').forEach(img => img.src = img.dataset.src);
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          obs.unobserve(img);
        }
      });
    },
    { rootMargin: '0px 0px 300px 0px', threshold: 0.01 }
  );

  document.querySelectorAll('img[data-src]').forEach(img => observer.observe(img));
}

// LOAD SCRIPT: Caricamento asincrono con priorità gestita.
function loadScript(src, callback, priority = 'low') {
  if (document.querySelector(`script[src="${src}"]`)) {
    if (callback) callback();
    return;
  }
  const script = document.createElement('script');
  script.src = src;
  script.async = true;
  if ('fetchPriority' in HTMLScriptElement.prototype) script.fetchPriority = priority;
  script.onload = callback;
  document.head.appendChild(script);
}

// —————————————————————————————————————————————————————————————————————————————
// 💡 INIZIALIZZAZIONE CENTRALIZZATA (Idle Mode)
// —————————————————————————————————————————————————————————————————————————————

if ('requestIdleCallback' in window) {
  requestIdleCallback(() => {
    initLazyLoading();
    initSmartPrefetch();
  });
} else {
  window.addEventListener('load', () => {
    initLazyLoading();
    initSmartPrefetch();
  });
}  
// ---End PERFORMANCE HELPERS ---

// ———————————————————————
// MENU MODERNO - BIOTECH PROJECT - CORE NAV SYSTEM (Versione Unificata - con data-modern-menu)
// Gestione centralizzata Event Delegation, Accessibilità e Popup.
// ———————————————————————
(function () {
  // Verifica se la pagina richiede il menu moderno
  if (!document.body.hasAttribute('data-modern-menu')) return;

  document.addEventListener('DOMContentLoaded', function () {
    const navContainer = document.getElementById('tech-main-menu');
    let openDropdown = null;

    if (!navContainer) return;

    // --- A. GESTORE CLICK UNIFICATO (Event Delegation) ---
    navContainer.addEventListener('click', (e) => {
      const target = e.target.closest('button, a');
      if (!target) return;

      // 1. Gestione bottoni principali del menu
      if (target.classList.contains('tech-nav-btn')) {
        e.stopPropagation();
        handleDropdownToggle(target);
      } 
      // 2. Gestione azioni specifiche (ex onclick)
      else if (target.id) {
        handleMenuCommands(target.id);
      }
    });

    // --- B. DISPATCHER COMANDI (Sostituisce gli onclick nell'HTML) ---
    function handleMenuCommands(id) {
      switch (id) {
        case 'btn-support-os':
          openSupportPopup();
          break;
        case 'btn-contact-forum':
          openContactPopup();
          break;
        case 'lang-toggle':
          if (typeof toggleLanguage === 'function') toggleLanguage();
          break;
        // Nota: theme-toggle è gestito dal suo script initThemeToggle()
      }
    }

    // --- C. LOGICA APERTURA/CHIUSURA MENU ---
    function handleDropdownToggle(btn) {
      const dropdown = btn.nextElementSibling;
      const isExpanded = btn.getAttribute('aria-expanded') === 'true';

      // Chiude altri menu aperti
      if (openDropdown && openDropdown !== dropdown) {
        closeDropdown(openDropdown);
      }

      if (isExpanded) {
        closeDropdown(dropdown);
      } else {
        dropdown.classList.add('show');
        btn.setAttribute('aria-expanded', 'true');
        openDropdown = dropdown;
      }
    }

    function closeDropdown(dropdown) {
      if (!dropdown) return;
      dropdown.classList.remove('show');
      const btn = dropdown.previousElementSibling;
      if (btn) btn.setAttribute('aria-expanded', 'false');
      openDropdown = null;
    }

    // --- D. ACCESSIBILITÀ TASTIERA (Frecce, Home, End, Esc) ---
    navContainer.addEventListener('keydown', (e) => {
      const target = e.target;
      
      // ESC: Chiude il menu e riporta il focus sul trigger
      if (e.key === 'Escape' && openDropdown) {
        const triggerBtn = openDropdown.previousElementSibling;
        closeDropdown(openDropdown);
        triggerBtn.focus();
        return;
      }

      // Navigazione interna al dropdown aperto
      if (openDropdown && openDropdown.contains(target)) {
        const items = Array.from(openDropdown.querySelectorAll('[role="menuitem"]:not([disabled])'));
        const currentIndex = items.indexOf(target);

        switch (e.key) {
          case 'ArrowDown':
            e.preventDefault();
            items[(currentIndex + 1) % items.length].focus();
            break;
          case 'ArrowUp':
            e.preventDefault();
            items[(currentIndex - 1 + items.length) % items.length].focus();
            break;
          case 'Home':
            e.preventDefault();
            items[0].focus();
            break;
          case 'End':
            e.preventDefault();
            items[items.length - 1].focus();
            break;
        }
      } 
      // Apertura con tastiera: sposta focus su primo item
      else if (target.classList.contains('tech-nav-btn') && (e.key === 'Enter' || e.key === ' ')) {
        setTimeout(() => {
          const firstItem = target.nextElementSibling?.querySelector('[role="menuitem"]');
          if (firstItem) firstItem.focus();
        }, 120);
      }
    });

    // Chiudi menu se si clicca fuori dall'area nav
    document.addEventListener('click', (e) => {
      if (!navContainer.contains(e.target) && openDropdown) {
        closeDropdown(openDropdown);
      }
    });
  });
})();

// ———————————————————————
// 🔹 LOGICA POPUP (Spostata qui per manutenzione centralizzata)
// ———————————————————————
function openPopup(url, title, width, height) {
  const left = Math.floor((screen.width - width) / 2);
  const top = Math.floor((screen.height - height) / 2);
  const options = `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes,toolbar=no,location=no`;
  
  const popup = window.open(url, title, options);

  if (!popup || popup.closed || typeof popup.closed == 'undefined') {
    alert("Il popup è stato bloccato. Per favore, abilita i popup per questo sito.");
    return;
  }
  popup.focus();
}

function openSupportPopup() {
  openPopup('https://gitechnolo.github.io/biotechproject/O.S_support.html', 'O.S. Support Chat GPT', 760, 440);
}

function openContactPopup() {
  openPopup('https://gitechnolo.github.io/biotechproject/Tablet_forum.html', 'Contattaci - Forum ChatGPT', 825, 672);
}

// End MENU MODERNO 

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
/**
 * Aggiorna il div lastModified sincronizzandolo con la lingua attiva.
 * Non richiede voci nel JSON.
 */
function updateLastModified(lang) {
  const el = document.getElementById('lastModified');
  if (!el) return;

  const lastModifiedDate = new Date(document.lastModified);
  if (isNaN(lastModifiedDate)) return;

  // Definisce le etichette direttamente qui per risparmiare chiamate al JSON
  const isEn = (lang === 'en');
  const label = isEn ? 'Last modified' : 'Ultima modifica';
  const locale = isEn ? 'en-US' : 'it-IT';

  const options = { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };

  // Stringa finale
  el.textContent = `${label}: ${lastModifiedDate.toLocaleString(locale, options)}`;
} 
// === End ultima modifica pagina ===

// === 🔊 BIOTECH PROJECT - GESTIONE PRONUNCIA E EVENTI (Versione Pulita) ===
/**
 * Inizializzatore: attiva le funzioni quando la pagina è caricata.
 * Rimuove la necessità di onclick e onkeydown nell'HTML.
 */
document.addEventListener('DOMContentLoaded', () => {
  
  // 1. Gestione click sui pulsanti di pronuncia (🔊)
  const audioButtons = document.querySelectorAll('.pronounce-btn');
  audioButtons.forEach(btn => {
    btn.addEventListener('click', (event) => {
      // Impedisce che il click attivi il modal se il bottone è dentro un link
      event.stopPropagation(); 
      
      const term = btn.getAttribute('data-term');
      const langAttr = btn.getAttribute('lang'); 
      const language = (langAttr === 'en') ? 'inglese' : 'italiano';
      
      speakTerm(term, language);
    });
  });

  // 2. Gestione click e tastiera sui link che aprono i Modal
  const modalLinks = document.querySelectorAll('.biotech-modal-trigger');
  modalLinks.forEach(link => {
    
    const triggerModal = (event) => {
      event.preventDefault();
      const imgId = link.getAttribute('data-target-img');
      
      // Chiama la funzione openBiotechModal se esistente nel progetto
      if (typeof openBiotechModal === 'function') {
        openBiotechModal(imgId, event);
      }
    };

    link.addEventListener('click', triggerModal);

    // Gestione accessibilità (Tasto Invio o Spazio)
    link.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        triggerModal(event);
      }
    });
  });
});

 // Funzione principale: riproduce la pronuncia di un termine.
 function speakTerm(term, language = 'italiano') {
  if (!term) return;

  if (speechSynthesis.speaking) {
    speechSynthesis.cancel();
  }

  const customPronunciations = {
    'crispr': 'Clustered Regularly Interspaced Short Palindromic Repeats',
    'mitocondri': 'Mi-to-con-dri',
    'lisosoma': 'Li-so-so-ma',
    'miochine': 'Mi-o-ki-ne',
    'sinaptogenesi': 'Si-na-to-jen-e-si',
    'epigenetici': 'E-pi-je-ne-ti-ci',
    'atp': 'Adenosina trifosfato',
    'dna': 'Acido desossiribonucleico',
    'rna': 'Acido ribonucleico',
    'tegumento': 'Te-gu-men-to',
    'pecquet': 'Pes-ché'     
  };

  const langMap = { 'italiano': 'it-IT', 'inglese': 'en-US' };
  const utteranceText = customPronunciations[term.toLowerCase()] || term;
  const utterance = new SpeechSynthesisUtterance(utteranceText);

  utterance.lang = langMap[language] || 'it-IT';
  utterance.rate = 0.8;   
  utterance.pitch = 1.0;  
  utterance.volume = 1.0; 

  const announcement = document.getElementById('sr-announcement');
  if (announcement) {
    announcement.textContent = `Lettura avviata: ${term}.`;
    setTimeout(() => {
      if (announcement.textContent.includes(term)) announcement.textContent = '';
    }, 1000);
  }

  console.log(`🔊 Pronuncia: "${term}" (${utterance.lang})`);
  speechSynthesis.speak(utterance);
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
       updateLastModified(lang); // Last edit: it - en

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