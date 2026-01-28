// Biotech.js 
// =======================================
// 1. LOGICA PARTICELLE 
// =======================================
(function () {
  'use strict';

  function initParticles(canvasId, options = {}) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true, desynchronized: true });
    let animationId;
    let checkInterval;
    let width, height;
    let particles = [];
    let currentMode = ""; // "day" o "night"

    // 1. FUNZIONE DI CONFIGURAZIONE (Determina lo stile in base all'ora)
    function getConfig() {
      const hour = new Date().getHours();
      const isNight = hour >= 19 || hour < 7;
      
      if (isNight) {
        return {
          mode: "night",
          count: Math.min(options.count || 30, 40),
          speed: 0.5,
          radiusMin: 1.5,
          radiusMax: 4,
          colors: ["rgba(180, 220, 255, 0.25)", "rgba(220, 255, 180, 0.22)", "rgba(255, 220, 180, 0.19)"]
        };
      }
      return {
        mode: "day",
        count: Math.min(options.count || 50, 60),
        speed: 0.8,
        radius: 2,
        color: 'rgba(231, 231, 231, 0.45)' // color: 'rgba(180, 255, 200, 0.4)' (per un tocco di verde Biotech)
      };
    }

    // 2. FUNZIONE DI CREAZIONE/RESET PARTICELLE
    function setupParticles() {
      const cfg = getConfig();
      currentMode = cfg.mode;
      particles = Array.from({ length: cfg.count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * cfg.speed,
        vy: (Math.random() - 0.5) * cfg.speed,
        r: cfg.mode === "night" ? (cfg.radiusMin + Math.random() * (cfg.radiusMax - cfg.radiusMin)) : cfg.radius,
        color: cfg.mode === "night" ? cfg.colors[Math.floor(Math.random() * cfg.colors.length)] : cfg.color
      }));
    }

    function updateDimensions() {
      const dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
      setupParticles(); // Rigenera se ridimensioni
    }

    // 3. LOGICA DI ANIMAZIONE OTTIMIZZATA
    let lastFrameTime = 0;
    function animate(timestamp) {
      if (timestamp - lastFrameTime < 33.3) { // Target ~30fps
        animationId = requestAnimationFrame(animate);
        return;
      }
      lastFrameTime = timestamp;
      ctx.clearRect(0, 0, width, height);

      if (currentMode === "day") {
        ctx.beginPath();
        ctx.fillStyle = particles[0]?.color;
        for (let p of particles) {
          p.x += p.vx; p.y += p.vy;
          if (p.x < 0 || p.x > width) p.vx *= -1;
          if (p.y < 0 || p.y > height) p.vy *= -1;
          ctx.moveTo(p.x + p.r, p.y);
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        }
        ctx.fill();
      } else {
        for (let p of particles) {
          p.x += p.vx; p.y += p.vy;
          if (p.x < 0 || p.x > width) p.vx *= -1;
          if (p.y < 0 || p.y > height) p.vy *= -1;
          ctx.beginPath();
          ctx.fillStyle = p.color;
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      animationId = requestAnimationFrame(animate);
    }

    // 4. IL "CERVELLO" DELLO SWITCH (Controlla ogni 60 secondi)
    function startAutoSwitch() {
      checkInterval = setInterval(() => {
        const hour = new Date().getHours();
        const neededMode = (hour >= 19 || hour < 7) ? "night" : "day";
        if (neededMode !== currentMode) {
          setupParticles(); // Cambia stile se l'ora è passata alla soglia
        }
      }, 60000); 
    }

    // Avvio
    updateDimensions();
    animate(performance.now());
    startAutoSwitch();

    window.addEventListener('resize', updateDimensions);

    return {
      destroy: () => {
        if (animationId) cancelAnimationFrame(animationId);
        if (checkInterval) clearInterval(checkInterval);
        window.removeEventListener('resize', updateDimensions);
      },
      resizeCanvas: updateDimensions
    };
  }

  window.initParticles = initParticles;
})();

// =======================================
// 2. FUNZIONE QRedshift (Ottimizzata per TBT e Layout Thrashing)
// =======================================
// QRedshift: Comfort visivo automatico con integrazione menu, Toggle e Persistenza
function QRedshift() {
  const menuContainer = document.getElementById('tech-main-menu');
  const storageKey = 'qredshift_disabled';
  if (!menuContainer) return;

  const particles = document.getElementById('particles-canvas');
  const dna = document.querySelector('.dna-container-8');
  const storageDisabled = localStorage.getItem(storageKey) === 'true';

  let isActive = !storageDisabled;
  let currentMode = ""; // "day" o "night"

  // 1. Funzione per applicare lo stile visivo corretto
  // 1. Funzione per applicare lo stile visivo corretto (Sincronizzata)
  function updateVisuals() {
    // CRITICO: Se l'utente ha spento il Comfort, non mostrare nulla
    if (!isActive) {
      if (particles) particles.style.display = 'none';
      if (dna) dna.style.display = 'none';
      return;
    }

    const hour = new Date().getHours();
    const isNight = (hour >= 19 || hour < 7);
    const newMode = isNight ? "night" : "day";

    // Applichiamo i filtri
    document.body.classList.add('qredshift-active');
    document.body.style.filter = isNight 
      ? 'sepia(0.6) hue-rotate(-30deg) brightness(0.95)' 
      : 'sepia(0.2) hue-rotate(0deg) brightness(1)';

    // MOSTRA gli elementi solo se isActive è true
    if (particles) particles.style.display = 'block';
    if (dna) dna.style.display = 'block';

    if (window.particlesController && newMode !== currentMode) {
      window.particlesController.resizeCanvas(); 
    }
    currentMode = newMode;
  }

  // 2. Timer "Intelligente" per il cambio automatico
  // Controlla ogni minuto se l'ora è cambiata
  const autoSyncTimer = setInterval(() => {
    if (isActive) updateVisuals();
  }, 60000);

  // 3. Logica del Toggle (Acceso/Spento)
  const toggleQRedshift = function () {
    isActive = !isActive;
    localStorage.setItem(storageKey, (!isActive).toString());

    if (isActive) {
      updateVisuals();
      // Riattiva particelle se distrutte
      if (!window.particlesController && typeof window.initParticles === "function") {
        window.particlesController = window.initParticles("particles-canvas", { count: 50, speed: 1 });
      }
    } else {
      // Disattivazione totale
      document.body.classList.remove('qredshift-active');
      document.body.style.filter = '';
      if (particles) particles.style.display = 'none';
      if (dna) dna.style.display = 'none';
      
      if (window.particlesController) {
        window.particlesController.destroy();
        window.particlesController = null;
      }
    }
    updateButtonUI();
  };

  // --- UI del Bottone (Creazione standard) ---
  const menuItem = document.createElement('div');
  menuItem.className = 'tech-menu-item';
  const button = document.createElement('button');
  button.className = 'tech-nav-btn';
  menuItem.appendChild(button);
  menuContainer.appendChild(menuItem);

  function updateButtonUI() {
    const hour = new Date().getHours();
    const isNight = (hour >= 19 || hour < 7);
    const icon = isActive ? (isNight ? '🌙' : '☀️') : '⚠️';
    button.innerHTML = `<b>${icon} Comfort</b>`;
    button.setAttribute('aria-pressed', isActive);
  }

  button.addEventListener('click', toggleQRedshift);
  
  // Inizializzazione al caricamento
  if (isActive) {
    updateVisuals();
    setTimeout(() => {
      if (!window.particlesController) {
        window.particlesController = window.initParticles("particles-canvas", { count: 50, speed: 1 });
      }
    }, 100);
  }
  updateButtonUI();
}

// Avvio al DOM pronto
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

// ===== BIOTECH PROJECT: UNIFIED MODAL SYSTEM (FOCUS TRAP + ANIMATION FIXED) =====
let lastFocusedElement = null;
let slideIndex = 1;

// 1. FUNZIONI DI SUPPORTO
function resetAllZoom() {
  document.querySelectorAll('.zoom-container').forEach(container => {
    container.classList.remove('zoomed');
    const img = container.querySelector('img');
    if (img) img.style.transformOrigin = `center center`;
  });
}

function plusSlides(n) {
  resetAllZoom();
  showSlides(slideIndex += n);
}

function currentSlide(n) {
  resetAllZoom();
  showSlides(slideIndex = n);
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

// MODIFICATA: Aggiunto ritardo per animazione solo su popup immagini
function closeModal() {
  const modal = document.getElementById("myModal");
  if (!modal) return;

  const modalImg = document.getElementById("img01");
  const isBiotechMode = modalImg && modalImg.style.display !== "none";

  modal.classList.remove("show");

  // Se è un popup (isBiotechMode), aspettiamo 400ms per lo zoom-out
  // Se è il carosello, chiudiamo subito (10ms)
  const delay = isBiotechMode ? 400 : 10;

  setTimeout(() => {
    modal.style.display = "none";
    if (modalImg) { modalImg.src = ""; modalImg.style.display = "none"; }
    resetAllZoom();

    if (lastFocusedElement) {
      lastFocusedElement.focus();
      // Rimosso l'azzeramento immediato per sicurezza sulla posizione
    }
  }, delay);
}

// 2. INIZIALIZZAZIONE UNICA
document.addEventListener('DOMContentLoaded', function() {
  const modal = document.getElementById("myModal");
  if (!modal) return;

  const modalImg = document.getElementById("img01");
  const modalCarouselContent = document.getElementById("modalCarousel");
  const closeBtn = document.getElementById('closeBtn') || modal.querySelector(".close");

  const bindAction = (el, callback) => {
    if (!el) return;
    el.addEventListener('click', (e) => { e.preventDefault(); callback(); });
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); callback(); }
    });
  };

  // --- A. APERTURA IMMAGINE SINGOLA (MODIFICATA: Aggiunto calcolo origine) ---
  window.openBiotechModal = function(imgId, event) {
    const targetImg = document.getElementById(imgId);
    if (!targetImg || !modalImg) return;
    
    lastFocusedElement = event ? event.currentTarget : null;

    // Calcolo posizione per l'effetto rimpicciolimento
    if (lastFocusedElement) {
      const rect = lastFocusedElement.getBoundingClientRect();
      modalImg.style.transformOrigin = `${rect.left + rect.width / 2}px ${rect.top + rect.height / 2}px`;
    }

    if (modalCarouselContent) modalCarouselContent.style.display = "none";
    modalImg.src = targetImg.src;
    modalImg.alt = targetImg.alt || "";
    modalImg.style.display = "block";
    modalImg.style.margin = "auto";
    const caption = document.getElementById("caption");
    if (caption) caption.textContent = targetImg.alt;
    
    modal.style.display = "flex";
    setTimeout(() => { modal.classList.add("show"); closeBtn?.focus(); }, 10);
  };

  // --- B. APERTURA CAROSELLO ---
  const openCarousel = (n) => {
    lastFocusedElement = document.activeElement;
    if (modalImg) modalImg.style.display = "none";
    if (modalCarouselContent) modalCarouselContent.style.display = "block";
    currentSlide(n);
    modal.style.display = "block";
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => { modal.classList.add("show"); closeBtn?.focus(); }, 50);
  };

  // Binding Eventi (Identici alla tua versione)
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

  // --- C. LOGICA ZOOM ---
  document.querySelectorAll('.zoom-container').forEach(container => {
    const img = container.querySelector('img');
    container.addEventListener('click', () => container.classList.toggle('zoomed'));
    container.addEventListener('mousemove', (e) => {
      if (container.classList.contains('zoomed')) {
        const rect = container.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        img.style.transformOrigin = `${x}% ${y}%`;
      }
    });
  });

  // --- D. GESTIONE TASTIERA E FOCUS TRAP ---
  document.addEventListener('keydown', (e) => {
    const isVisible = (modal.style.display !== "none" && modal.style.display !== "");
    if (!isVisible) return;

    if (e.key === "Escape") closeModal();
    if (modalCarouselContent && modalCarouselContent.style.display !== "none") {
        if (e.key === "ArrowLeft") plusSlides(-1);
        if (e.key === "ArrowRight") plusSlides(1);
    }

    if (e.key === 'Tab') {
      const focusableElements = Array.from(modal.querySelectorAll('button, [tabindex="0"], .close, .prev, .next, .demo'))
                                     .filter(el => el.offsetParent !== null);
      
      if (focusableElements.length > 0) {
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) { e.preventDefault(); lastElement.focus(); }
        } else {
          if (document.activeElement === lastElement) { e.preventDefault(); firstElement.focus(); }
        }
      }
    }
  });

  modal.onclick = (e) => { if (e.target === modal) closeModal(); };
});

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