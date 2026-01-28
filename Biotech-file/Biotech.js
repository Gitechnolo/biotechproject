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
ctx.shadowBlur = 5; // Ridotto da 18 a 5 per risparmiare GPU
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

// ——————————————————————————————————————————————————————————————————————————
// BIOTECH PROJECT - CORE UI SYSTEM (Versione Integrale)
// Gestione: Menu, Navigazione, Tema, Pronuncia e Modal
// ——————————————————————————————————————————————————————————————————————————

(function () {
  // 1. EXIT EARLY: Se la pagina non richiede il menu moderno, interrompiamo tutto.
  if (!document.body.hasAttribute('data-modern-menu')) return;

  /**
   * Punto di ingresso unico per tutti i moduli interattivi.
   */
  document.addEventListener('DOMContentLoaded', function () {
    
    // --- [A] CORE NAV SYSTEM (Menu & Dropdowns) ---
    const navContainer = document.getElementById('tech-main-menu');
    let openDropdown = null;

    if (navContainer) {
      navContainer.addEventListener('click', (e) => {
        const target = e.target.closest('button, a');
        if (!target) return;

        if (target.classList.contains('tech-nav-btn')) {
          e.stopPropagation();
          handleDropdownToggle(target);
        } else if (target.id) {
          handleMenuCommands(target.id);
        }
      });

      navContainer.addEventListener('keydown', handleNavKeyDown);
      
      document.addEventListener('click', (e) => {
        if (!navContainer.contains(e.target) && openDropdown) closeDropdown(openDropdown);
      });
    }

    // --- [B] NAVIGAZIONE DA TASTIERA ---
    const toggleBtn = document.getElementById("keyboard-nav-toggle");
    const body = document.body;
    let keyboardNavActive = false;

    function toggleKeyboardNavigation() {
      keyboardNavActive = !keyboardNavActive;
      body.classList.toggle("keyboard-navigation-on", keyboardNavActive);
      if (toggleBtn) {
        toggleBtn.setAttribute("aria-pressed", keyboardNavActive);
        toggleBtn.setAttribute("data-active", keyboardNavActive);
        toggleBtn.textContent = keyboardNavActive ? "✅ Navigazione Attiva" : "🔧 Navigazione Tastiera";
      }
    }

    toggleBtn?.addEventListener("click", toggleKeyboardNavigation);

    document.addEventListener("keydown", (e) => {
      if (e.key === "Tab" && !keyboardNavActive) toggleKeyboardNavigation();
    });

    setTimeout(() => toggleBtn?.classList.remove("hint"), 2500);

    // --- [C] TEMA DINAMICO ---
    initThemeToggle();

    // --- [D] GESTIONE PRONUNCIA E MODAL (Integrale) ---
    initSpeechAndModals();

    // ———————————————————————————————————————————————————————
    // 🔹 FUNZIONI INTERNE DI INIZIALIZZAZIONE (Helper)
    // ———————————————————————————————————————————————————————

    function initSpeechAndModals() {
      // 1. Gestione click sui pulsanti di pronuncia (🔊)
      const audioButtons = document.querySelectorAll('.pronounce-btn');
      audioButtons.forEach(btn => {
        btn.addEventListener('click', (event) => {
          event.stopPropagation(); 
          const term = btn.getAttribute('data-term');
          const langAttr = btn.getAttribute('lang'); 
          const language = (langAttr === 'en') ? 'inglese' : 'italiano';
          speakTerm(term, language);
        });
      });

      // 2. Gestione link Modal
      const modalLinks = document.querySelectorAll('.biotech-modal-trigger');
      modalLinks.forEach(link => {
        const triggerModal = (event) => {
          event.preventDefault();
          const imgId = link.getAttribute('data-target-img');
          if (typeof openBiotechModal === 'function') {
            openBiotechModal(imgId, event);
          }
        };
        link.addEventListener('click', triggerModal);
        link.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') triggerModal(e);
        });
      });
    }

    function handleMenuCommands(id) {
      switch (id) {
        case 'btn-support-os': openSupportPopup(); break;
        case 'btn-contact-forum': openContactPopup(); break;
        case 'lang-toggle': if (typeof toggleLanguage === 'function') toggleLanguage(); break;
      }
    }

    function handleDropdownToggle(btn) {
      const dropdown = btn.nextElementSibling;
      const isExpanded = btn.getAttribute('aria-expanded') === 'true';
      if (openDropdown && openDropdown !== dropdown) closeDropdown(openDropdown);
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
      dropdown.previousElementSibling?.setAttribute('aria-expanded', 'false');
      openDropdown = null;
    }

    function handleNavKeyDown(e) {
      const target = e.target;
      if (e.key === 'Escape' && openDropdown) {
        const triggerBtn = openDropdown.previousElementSibling;
        closeDropdown(openDropdown);
        triggerBtn.focus();
        return;
      }
      if (openDropdown && openDropdown.contains(target)) {
        const items = Array.from(openDropdown.querySelectorAll('[role="menuitem"]:not([disabled])'));
        const currentIndex = items.indexOf(target);
        if (e.key === 'ArrowDown') { e.preventDefault(); items[(currentIndex + 1) % items.length].focus(); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); items[(currentIndex - 1 + items.length) % items.length].focus(); }
        else if (e.key === 'Home') { e.preventDefault(); items[0].focus(); }
        else if (e.key === 'End') { e.preventDefault(); items[items.length - 1].focus(); }
      } else if (target.classList.contains('tech-nav-btn') && (e.key === 'Enter' || e.key === ' ')) {
        setTimeout(() => target.nextElementSibling?.querySelector('[role="menuitem"]')?.focus(), 120);
      }
    }
  });

  // ———————————————————————————————————————————————————————
  // 🔹 LOGICA DI SUPPORTO (Utility esterne)
  // ———————————————————————————————————————————————————————
  
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

    // Gestione annuncio Screen Reader
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

  function openPopup(url, title, width, height) {
    const left = Math.floor((screen.width - width) / 2);
    const top = Math.floor((screen.height - height) / 2);
    const options = `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes`;
    const popup = window.open(url, title, options);
    if (!popup || popup.closed) {
      alert("Il popup è stato bloccato. Per favore, abilitalo nelle impostazioni.");
      return;
    }
    popup.focus();
  }

  function openSupportPopup() { openPopup('https://gitechnolo.github.io/biotechproject/O.S_support.html', 'O.S. Support', 760, 440); }
  function openContactPopup() { openPopup('https://gitechnolo.github.io/biotechproject/Tablet_forum.html', 'Contattaci', 825, 672); }

  function initThemeToggle() {
    const themeBtn = document.getElementById('theme-toggle');
    if (!themeBtn) return;

    const themes = [
      { name: 'Verde', rgb: '0, 230, 118', h: 143, s: '100%', l: '45%' },
      { name: 'Ciano', rgb: '0, 200, 255', h: 190, s: '100%', l: '50%' },
      { name: 'Viola', rgb: '138, 43, 226', h: 270, s: '75%', l: '53%' },
      { name: 'Arancione', rgb: '255, 140, 0', h: 39, s: '100%', l: '50%' },
      { name: 'Blu Profondo', rgb: '0, 120, 255', h: 210, s: '100%', l: '50%' }
    ];

    let currentThemeIndex = parseInt(localStorage.getItem('biotech-theme'), 10) || 0;
    
    function applyTheme(index) {
      const theme = themes[index];
      const root = document.documentElement.style;
      root.setProperty('--color-accent-rgb', theme.rgb);
      root.setProperty('--color-accent-h', theme.h);
      root.setProperty('--color-accent-s', theme.s || '100%');
      root.setProperty('--color-accent-l', theme.l || '50%');
      root.setProperty('--color-glow', `hsl(${theme.h}, 100%, 70%)`);
      themeBtn.textContent = `🎨 Tema: (${theme.name})`;
      themeBtn.setAttribute('aria-label', `Cambia tema: attualmente ${theme.name}`);
    }

    applyTheme(currentThemeIndex);

    themeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      currentThemeIndex = (currentThemeIndex + 1) % themes.length;
      applyTheme(currentThemeIndex);
      localStorage.setItem('biotech-theme', currentThemeIndex);
    });
  }
})();
  

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

// =============================================================================
// BLOCCO UNIFICATO: GESTIONE LINGUA + POPUP & CAROSELLO + VIDEO PLAYER (2026)
// =============================================================================

// --- VARIABILI GLOBALI CONDIVISE ---
let currentLang = 'it';
let lastFocusedElement = null;
let slideIndex = 1;

const translatablePages = [
  'index', 'Progetti', 'Staff', 'Marketing', 'Tech_Maturity', 'Dermatologia', 
  'Cuore', 'Cellula', 'Apparato_digerente', 'Apparato_respiratorio', 
  'Apparato_tegumentario', 'Sistema_linfatico', 'Specials', 'Capelli'
];

// --- 1. FUNZIONI DI SUPPORTO TRADUZIONE ---
function getPageKey(pageName) {
  const map = {
    'index': 'home', 'Tech_Maturity': 'tech_maturity', 'Apparato_digerente': 'apparato_digerente',
    'Apparato_respiratorio': 'apparato_respiratorio', 'Apparato_tegumentario': 'apparato_tegumentario',
    'Sistema_linfatico': 'sistema_linfatico'
  };
  return map[pageName] || pageName.toLowerCase();
}

function getPageName() {
  const path = window.location.pathname;
  const fileName = path.split('/').pop().replace('.html', '');
  return fileName.replace('-semplice', '');
}

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

function getSavedLanguage() {
  return localStorage.getItem('preferred-language') || (navigator.language.startsWith('en') ? 'en' : 'it');
}

function updateLanguageButton(lang) {
  const flag = document.getElementById('lang-flag');
  const text = document.getElementById('lang-text');
  const button = document.getElementById('lang-toggle');
  const label = document.getElementById('lang-label');
  if (!flag || !button) return;
  if (lang === 'it') {
    flag.textContent = '🇬🇧'; if (text) text.textContent = 'English';
    if (label) label.textContent = 'Switch language';
    button.setAttribute('aria-label', 'Switch to English');
  } else {
    flag.textContent = '🇮🇹'; if (text) text.textContent = 'Italiano';
    if (label) label.textContent = 'Cambia lingua';
    button.setAttribute('aria-label', 'Cambia lingua in italiano');
  }
}

function applyTranslations(translations, lang) {
  document.querySelectorAll('[data-lang-key]').forEach(el => {
    const key = el.getAttribute('data-lang-key');
    const value = translations[lang]?.[key];
    if (value !== undefined && value !== null) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.setAttribute('placeholder', value);
      } else if (el.tagName === 'IMG') {
        el.setAttribute('alt', value);
        const modal = document.getElementById("myModal");
        const modalImg = document.getElementById("img01");
        const captionText = document.getElementById("caption");
        if (modal && modal.classList.contains("show") && modalImg && modalImg.src === el.src) {
          captionText.textContent = value;
        }
      } else {
        const bold = el.querySelector('b');
        if (bold) { bold.textContent = value; } else { el.innerHTML = value; }
      }
    }
  });
  if (typeof updateLastModified === 'function') updateLastModified(lang);
  console.log(`✅ Traduzioni applicate in ${lang}`);
}

async function initTranslations() {
  const pageName = getPageName();
  const savedLang = getSavedLanguage();
  const translations = { it: {}, en: {} };
  
  const common = await loadTranslation('lang/common.json');
  if (common) { translations.it = { ...common.it }; translations.en = { ...common.en }; }

  if (translatablePages.includes(pageName)) {
    const pageKey = getPageKey(pageName);
    const pageData = await loadTranslation(`lang/${pageKey}.json`);
    if (pageData) {
      if (pageData.it) translations.it = { ...translations.it, ...pageData.it };
      if (pageData.en) translations.en = { ...translations.en, ...pageData.en };
    }
  }
  
  applyTranslations(translations, savedLang);
  updateLanguageButton(savedLang);
  document.documentElement.lang = savedLang;
  currentLang = savedLang;
}

function setLanguage(lang) {
  const pageName = getPageName();
  const promises = [loadTranslation('lang/common.json')];
  if (translatablePages.includes(pageName)) promises.push(loadTranslation(`lang/${getPageKey(pageName)}.json`));

  Promise.all(promises).then(([common, pageData]) => {
    const translations = {
      it: { ...(common?.it || {}), ...(pageData?.it || {}) },
      en: { ...(common?.en || {}), ...(pageData?.en || {}) }
    };
    window.cachedTranslations = translations;
    setTimeout(() => {
      applyTranslations(translations, lang);
      updateLanguageButton(lang);
      document.documentElement.lang = lang;
      currentLang = lang;
      localStorage.setItem('preferred-language', lang);
    }, 100);
  });
}

function toggleLanguage() {
  const newLang = currentLang === 'it' ? 'en' : 'it';
  setLanguage(newLang);
}

// --- 2. FUNZIONI DI SUPPORTO MODAL & CAROSELLO ---
function resetAllZoom() {
  document.querySelectorAll('.zoom-container').forEach(container => {
    container.classList.remove('zoomed');
    const img = container.querySelector('img');
    if (img) img.style.transformOrigin = `center center`;
  });
}

function showSlides(n) {
  const slides = document.getElementsByClassName("mySlides");
  const dots = document.getElementsByClassName("demo");
  const captionText = document.getElementById("caption");
  if (slides.length === 0) return;
  if (n > slides.length) slideIndex = 1;
  if (n < 1) slideIndex = slides.length;
  Array.from(slides).forEach(s => s.style.display = "none");
  Array.from(dots).forEach(d => d.className = d.className.replace(" active", ""));
  if (slides[slideIndex - 1]) {
    slides[slideIndex - 1].style.display = "block";
    if (dots[slideIndex - 1]) {
      dots[slideIndex - 1].className += " active";
      if (captionText) captionText.innerHTML = dots[slideIndex - 1].alt || "";
    }
  }
}

function plusSlides(n) { resetAllZoom(); showSlides(slideIndex += n); }
function currentSlide(n) { resetAllZoom(); showSlides(slideIndex = n); }

function closeModal() {
  const modal = document.getElementById("myModal");
  if (!modal) return;
  const modalImg = document.getElementById("img01");
  const isBiotechMode = modalImg && modalImg.style.display !== "none";
  modal.classList.remove("show");
  const delay = isBiotechMode ? 400 : 10;
  setTimeout(() => {
    modal.style.display = "none";
    if (modalImg) { modalImg.src = ""; modalImg.style.display = "none"; }
    resetAllZoom();
    if (lastFocusedElement) lastFocusedElement.focus();
  }, delay);
}

// --- 3. FUNZIONI DI SUPPORTO VIDEO (On-Demand) ---
function loadAndPlayVideo() {
  const container = document.getElementById('ytVideoContainer');
  const img = document.getElementById('videoPoster');
  if (!img || !container) return;

  const video = document.createElement('video');
  video.id = 'ytVideo';
  video.controls = false; 
  video.preload = 'metadata';
  video.poster = img.src;
  video.style.cssText = 'width:100%; height:auto; display:block; max-height:600px; border-radius:8px;';
  video.setAttribute('playsinline', ''); 

  const source = document.createElement('source');
  source.src = 'https://gitechnolo.github.io/biotechproject/Biotech-file/images/Biotech-menu/Singapore_boscoartificiale-Metropoli.mp4';
  source.type = 'video/mp4';
  video.appendChild(source);

  const tracks = [
    { lang: 'en', label: 'English', default: true },
    { lang: 'it', label: 'Italian', default: false }
  ];
  tracks.forEach(t => {
    const track = document.createElement('track');
    track.kind = 'subtitles';
    track.src = `https://gitechnolo.github.io/biotechproject/Biotech-file/images/Biotech-menu/fgsubtitles_${t.lang}.vtt`;
    track.srclang = t.lang;
    track.label = t.label;
    if (t.default) track.default = true;
    video.appendChild(track);
  });

  container.replaceChild(video, img);
  const controls = document.querySelector('.yt-video-controls');
  if (controls) controls.style.display = 'flex';

  initializeVideoControls(video, controls);
  video.play().catch(e => console.log("Richiesta interazione per Play:", e));
}

function initializeVideoControls(video, controls) {
  if (!controls) return;
  const q = (id) => controls.querySelector(id);
  const playBtn = q('#ytPlayPause'), icon = q('#ytPlayPauseIcon'), progress = q('#ytProgress');
  const curTime = q('#ytCurrentTime'), durTime = q('#ytDuration'), vol = q('#ytVolume');
  const muteBtn = q('#ytMute'), muteIcon = q('#ytMuteIcon'), fsBtn = q('#ytFullscreen'), exitFsBtn = q('#ytExitFullscreen');

  const format = (s) => { const m = Math.floor(s/60), sec = Math.floor(s%60); return `${m}:${sec<10?'0':''}${sec}`; };

  playBtn?.addEventListener('click', () => video.paused ? video.play() : video.pause());
  video.addEventListener('play', () => { if(icon) icon.textContent = '⏸️'; });
  video.addEventListener('pause', () => { if(icon) icon.textContent = '▶️'; });
  video.addEventListener('timeupdate', () => { if(progress) progress.value = video.currentTime; if(curTime) curTime.textContent = format(video.currentTime); });
  video.addEventListener('loadedmetadata', () => { if(progress) progress.max = video.duration; if(durTime) durTime.textContent = format(video.duration); });
  progress?.addEventListener('input', () => video.currentTime = progress.value);
  vol?.addEventListener('input', () => { video.volume = vol.value; if(muteIcon) muteIcon.textContent = (video.muted || vol.value == 0) ? '🔇' : '🔊'; });
  muteBtn?.addEventListener('click', () => { video.muted = !video.muted; if(muteIcon) muteIcon.textContent = video.muted ? '🔇' : '🔊'; });
  fsBtn?.addEventListener('click', () => video.requestFullscreen?.() || video.webkitRequestFullscreen?.());
  exitFsBtn?.addEventListener('click', () => document.exitFullscreen?.());

  document.addEventListener('fullscreenchange', () => {
    const isFs = document.fullscreenElement === video;
    if(fsBtn) fsBtn.style.display = isFs ? 'none' : 'flex';
    if(exitFsBtn) exitFsBtn.style.display = isFs ? 'flex' : 'none';
  });

  video.addEventListener('keydown', (e) => {
    if (e.code === 'Space') { e.preventDefault(); playBtn?.click(); }
    if (e.code === 'KeyM') { e.preventDefault(); muteBtn?.click(); }
    if (e.code === 'KeyF') { e.preventDefault(); fsBtn?.click(); }
  });
}

// --- 4. UNICO DOMCONTENTLOADED (IL DIRETTORE D'ORCHESTRA) ---
document.addEventListener('DOMContentLoaded', async () => {
  console.log("Avvio sistema unificato...");

  // A. Inizializza Lingua
  try {
    await initTranslations();
    window.toggleLanguage = toggleLanguage;
  } catch (err) { console.error('Errore lingua:', err); }

  // B. Inizializza Modal e Carosello
  const modal = document.getElementById("myModal");
  if (modal) {
    const modalImg = document.getElementById("img01");
    const modalCarouselContent = document.getElementById("modalCarousel");
    const closeBtn = document.getElementById('closeBtn') || modal.querySelector(".close");

    const bindAction = (el, callback) => {
      if (!el) return;
      el.addEventListener('click', (e) => { e.preventDefault(); callback(); });
      el.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); callback(); } });
    };

    window.openBiotechModal = function(imgId, event) {
      const targetImg = document.getElementById(imgId);
      if (!targetImg || !modalImg) return;
      lastFocusedElement = event ? event.currentTarget : null;
      if (lastFocusedElement) {
        const rect = lastFocusedElement.getBoundingClientRect();
        modalImg.style.transformOrigin = `${rect.left + rect.width / 2}px ${rect.top + rect.height / 2}px`;
      }
      if (modalCarouselContent) modalCarouselContent.style.display = "none";
      modalImg.src = targetImg.src;
      modalImg.alt = targetImg.alt || "";
      modalImg.style.display = "block";
      const caption = document.getElementById("caption");
      if (caption) caption.textContent = targetImg.alt;
      modal.style.display = "flex";
      setTimeout(() => { modal.classList.add("show"); closeBtn?.focus(); }, 10);
    };

    const openCarousel = (n) => {
      lastFocusedElement = document.activeElement;
      if (modalImg) modalImg.style.display = "none";
      if (modalCarouselContent) modalCarouselContent.style.display = "block";
      currentSlide(n);
      modal.style.display = "block";
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => { modal.classList.add("show"); closeBtn?.focus(); }, 50);
    };

    document.querySelectorAll('.gallery-item').forEach(img => {
      bindAction(img, () => openCarousel(parseInt(img.getAttribute('data-slide'))));
    });
    document.querySelectorAll('.biotech-modal-trigger').forEach(trigger => {
      const targetId = trigger.getAttribute('data-target-img');
      bindAction(trigger, () => window.openBiotechModal(targetId, { currentTarget: trigger }));
    });
    document.querySelectorAll('.demo').forEach(thumb => {
      bindAction(thumb, () => currentSlide(parseInt(thumb.getAttribute('data-slide'))));
    });

    bindAction(closeBtn, closeModal);
    bindAction(document.getElementById('prevSlide'), () => plusSlides(-1));
    bindAction(document.getElementById('nextSlide'), () => plusSlides(1));

    // C. Logica Zoom
    document.querySelectorAll('.zoom-container').forEach(container => {
      const img = container.querySelector('img');
      container.addEventListener('click', () => container.classList.toggle('zoomed'));
      container.addEventListener('mousemove', (e) => {
        if (container.classList.contains('zoomed')) {
          const rect = container.getBoundingClientRect();
          const x = ((e.clientX - rect.left) / rect.width) * 100;
          const y = ((e.clientY - rect.top) / rect.height) * 100;
          if(img) img.style.transformOrigin = `${x}% ${y}%`;
        }
      });
    });

    // D. Focus Trap & Keydown (Frecce incluse)
    document.addEventListener('keydown', (e) => {
      if (modal.style.display === "none" || modal.style.display === "") return;
      if (e.key === "Escape") closeModal();
      if (modalCarouselContent?.style.display !== "none") {
        if (e.key === "ArrowLeft") plusSlides(-1);
        if (e.key === "ArrowRight") plusSlides(1);
      }
      if (e.key === 'Tab') {
        const focusable = Array.from(modal.querySelectorAll('button, [tabindex="0"], .close, .prev, .next, .demo')).filter(el => el.offsetParent !== null);
        if (focusable.length > 0) {
          const first = focusable[0], last = focusable[focusable.length - 1];
          if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
          else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
      }
    });
    modal.onclick = (e) => { if (e.target === modal) closeModal(); };
  }

  // E. Inizializza Video (Solo se il poster esiste)
  const videoPoster = document.getElementById('videoPoster');
  if (videoPoster) {
    const triggerVideo = (e) => {
      if (e.type === 'keydown' && e.key !== 'Enter' && e.key !== ' ') return;
      e.preventDefault();
      loadAndPlayVideo();
    };
    videoPoster.addEventListener('click', triggerVideo);
    videoPoster.addEventListener('keydown', triggerVideo);
    console.log("🎥 Video module ready.");
  }
});