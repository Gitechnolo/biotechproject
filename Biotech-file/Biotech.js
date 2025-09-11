// QRedshift: Comfort visivo automatico con integrazione menu e fallback accessibile
function QRedshift() {
  // Evita doppia applicazione
  if (document.body.classList.contains('qredshift-active')) return;

  const hour = new Date().getHours();
  let filter;
  if (hour >= 7 && hour < 19) {
    // Giorno
    filter = 'sepia(0.2) hue-rotate(0deg) brightness(1)';
  } else {
    // Notte
    filter = 'sepia(0.5) hue-rotate(-30deg) brightness(1)';
  }
  // Applica filtro
  document.body.classList.add('qredshift-active');
  document.body.style.filter = filter;
  document.body.style.transition = 'filter 0.5s';

  // === INTEGRAZIONE MENU (SOLO PER BIOTECH) ===
  const menuContainer = document.getElementById('tech-main-menu');

  if (menuContainer) {
    // Crea pulsante integrato nel menu
    const menuItem = document.createElement('div');
    menuItem.className = 'tech-menu-item';
    menuItem.setAttribute('data-menu', 'qredshift');

    const button = document.createElement('button');
    button.className = 'tech-nav-btn';
    button.type = 'button';
    button.setAttribute('aria-haspopup', 'false');
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-pressed', 'true');
    button.setAttribute('aria-label', 'Modalità comfort visivo attiva: Notte');
    button.innerHTML = '<b>🌙 Comfort</b>';

    menuItem.appendChild(button);
    menuContainer.appendChild(menuItem); // Inserisci alla fine del menu

    // Disattiva effetti visivi pesanti (solo in Biotech)
    button.addEventListener('click', function () {
      document.body.classList.remove('qredshift-active');
      document.body.style.filter = '';

      const particles = document.getElementById('particles-canvas');
      if (particles) particles.style.display = 'none';

      const dna = document.querySelector('.dna-container-8');
      if (dna) dna.style.display = 'none';

      // Aggiorna stato UI
      button.setAttribute('aria-pressed', 'false');
      button.setAttribute('aria-label', 'Modalità comfort visivo disattivata');
      button.innerHTML = '<b>☀️ Comfort</b>';
    });

  } else {
    // === FALLBACK: per clienti esterni (nessun menu) ===
    const icon = document.createElement('div');
    icon.className = 'qredshift-icon';
    icon.setAttribute('role', 'button');
    icon.setAttribute('tabindex', '0');
    icon.setAttribute('aria-label', 'Disattiva comfort visivo');
    icon.title = 'Comfort visivo QRedshift attivo - clicca per disattivare';

    // Stile inline con transizione e ombra
    icon.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      width: 36px;
      height: 36px;
      background: rgba(0, 100, 130, 0.8);
      color: #a0e0ff;
      border: 1px solid rgba(100, 200, 255, 0.4);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      cursor: pointer;
      z-index: 9999;
      backdrop-filter: blur(4px);
      -webkit-backdrop-filter: blur(4px);
      box-shadow: 0 0 10px rgba(100, 200, 255, 0.3);
      font-family: sans-serif;
      transition: all 0.3s ease;
    `;

    // 🔥 Ottimizzazione rendering: attiva il layer GPU
    icon.style.willChange = 'transform, box-shadow';

    icon.innerHTML = '🌙';
    document.body.appendChild(icon);

    // Comportamento: clic per disattivare
    const disableEffect = () => {
      document.body.classList.remove('qredshift-active');
      document.body.style.filter = '';
      icon.remove();
    };

    icon.addEventListener('click', disableEffect);

    // Supporto tastiera (accessibilità)
    icon.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        disableEffect();
      }
    });

    // Effetti hover
    icon.addEventListener('mouseenter', () => {
      icon.style.transform = 'scale(1.1)';
      icon.style.boxShadow = '0 0 14px rgba(120, 220, 255, 0.5)';
    });

    icon.addEventListener('mouseleave', () => {
      icon.style.transform = 'scale(1)';
      icon.style.boxShadow = '0 0 10px rgba(100, 200, 255, 0.3)';
    });

    // Reset stile al leave (sicurezza)
    icon.addEventListener('focus', () => {
      icon.style.outline = '2px solid #66ccff';
      icon.style.outlineOffset = '2px';
    });

    icon.addEventListener('blur', () => {
      icon.style.outline = '';
    });
  }
}
// Attiva al caricamento della pagina
window.addEventListener('DOMContentLoaded', QRedshift);  
// End QRedshift: Comfort visivo automatico e menu e fallback accessibile 

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
// Drop-down menu (Mantenuto per retrocompatibilità)
var inmenu = false;
var lastmenu = 0;
function Menu(current) {
  if (!document.getElementById) return;
  inmenu = true;
  var oldmenu = lastmenu;
  lastmenu = current;
  if (oldmenu) Erase(oldmenu);
  var m = document.getElementById("menu-" + current);
  var box = document.getElementById(current);
  if (!m || !box) return;
  // Trova la tabella con classe "menu"
  var table = document.querySelector('table.menu');
  if (!table) {
    // Fallback: usa posizione della cella
    box.style.left = m.offsetLeft + 'px';
  } else {
    // Calcola la posizione X centrata rispetto alla tabella
    var tableRect = table.getBoundingClientRect();
    var boxWidth = 553; // larghezza fissa del dropdown
    var leftOffset = tableRect.left + (tableRect.width / 2) - (boxWidth / 2);
    // Imposta left in px
    box.style.left = leftOffset + 'px';
  }
  // Posiziona sotto la tabella
  box.style.top = (table ? table.offsetTop + table.offsetHeight : m.offsetTop + m.offsetHeight) + 'px';

  box.style.visibility = "visible";
  m.style.backgroundColor = "rgba(209, 206, 206, 0.57)";
  box.style.backgroundColor = "rgba(209, 206, 206, 0.57)";
  box.style.width = "553px";
}   
function Erase(current) {
  if (!document.getElementById) return;
  if (inmenu && lastmenu === current) return;
  var m = document.getElementById("menu-" + current);
  var box = document.getElementById(current);
  // Controllo sicurezza
  if (!m || !box) return;
  box.style.visibility = "hidden";
  m.style.backgroundColor = "Silver";
}
function Timeout(current) {
  inmenu = false;
  // ✅ Già corretto: uso di funzione, non stringa
  window.setTimeout(() => Erase(current), 500);
}
function Highlight(menu, item) {
  if (!document.getElementById) return;
  inmenu = true;
  lastmenu = menu;
  var obj = document.getElementById(item); // ✅ Dichiarata con `var`
  if (obj) obj.style.backgroundColor = "Silver";
}
function UnHighlight(menu, item) {
  if (!document.getElementById) return;
  Timeout(menu);
  var obj = document.getElementById(item); // ✅ Dichiarata con `var`
  if (obj) obj.style.backgroundColor = "rgba(209, 206, 206, 0.57)";
}
// End drop-down menu   
// ———————————————————————
// ✅ 1. Clock - Funzione legacy per clienti (da mantenere)
// ———————————————————————
function Clock() {
if (window.__clockLegacyRunning) return;
window.__clockLegacyRunning = true;
const el = document.getElementById("clock");
if (!el) return;
function update() {
const d = new Date();
const pad = n => n < 10 ? '0' + n : n;
const day = pad(d.getDate());
const month = pad(d.getMonth() + 1);
const year = d.getFullYear();
const hours = pad(d.getHours());
const mins = pad(d.getMinutes());
const secs = pad(d.getSeconds());
el.textContent = `${day}/${month}/${year} - ${hours}:${mins}:${secs}`;
}
update();
setInterval(update, 1000);
}
// ———————————————————————
// ✅ 2. Funzione evolution
// ———————————————————————
function startModernClock() {
const el = document.getElementById("clock2");
if (!el) return;
// Usa TextDecoder per evitare ritardi
function pad(n) { return n < 10 ? '0' + n : n; }
function update() {
const now = new Date();
const day = pad(now.getDate());
const month = pad(now.getMonth() + 1);
const year = now.getFullYear();
const hours = pad(now.getHours());
const mins = pad(now.getMinutes());
const secs = pad(now.getSeconds());
el.textContent = `${day}/${month}/${year} - ${hours}:${mins}:${secs}`;
}
// Aggiorna subito
update();
// Usa 1000ms — sufficiente per un orologio
const intervalId = setInterval(update, 1000);
// Pulizia opzionale (se usi SPA o dinamica)
return () => clearInterval(intervalId);
}   
//End  Clock
// === Conto alla rovescia al nuovo anno ===
const countdownEl = document.getElementById('modern-countdown');
const daysSpan = countdownEl?.querySelector('#countdown-days');
if (countdownEl && daysSpan) {
function updateCountdown() {
const now = new Date();
const currentYear = now.getFullYear();
const nextYear = currentYear + 1;
const newYear = new Date(`January 1, ${nextYear} 00:00:00`);
const diff = newYear - now;
const days = Math.floor(diff / (1000 * 60 * 60 * 24));
daysSpan.textContent = days;
}
// Aggiorna subito
updateCountdown();
// Aggiorna ogni ora (non serve ogni secondo)
setInterval(updateCountdown, 3600000); // 1 ora
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
// End Lightbox Cellula - Cuore - Apparato respiratorio - Sistema linfatico....
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
// 🔹 FUNZIONI VECCHIE – PER RETROCOMPATIBILITÀ
// (Non modificare: usate in documenti clienti)
// ———————————————————————
function PopupCentrata() {
  var w = 760;
  var h = 370;
  var l = Math.floor((screen.width - w) / 2);
  var t = Math.floor((screen.height - h) / 2);
  window.open("https://gitechnolo.github.io/biotechproject/O.S_support.html", "", "width=" + w + ",height=" + h + ",top=" + t + ",left=" + l);
}
function ChatGPTpopupCenterAI() {
  var w = 825;
  var h = 672;
  var l = Math.floor((screen.width - w) / 2);
  var t = Math.floor((screen.height - h) / 2);
  window.open("https://gitechnolo.github.io/biotechproject/Tablet_forum.html", "", "width=" + w + ",height=" + h + ",top=" + t + ",left=" + l);
}
// ———————————————————————
// 🔹 FUNZIONI NUOVE – PER IL MENU MODERNO (accessibili e sicure)
// (Usate nel nuovo HTML del menu a tendina)
// ———————————————————————
// Funzione generica per aprire popup centrati
function openPopup(url, title, width, height) {
const left = Math.floor((screen.width - width) / 2);
const top = Math.floor((screen.height - height) / 2);
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
const popup = window.open(url, title, options);
if (!popup) {
alert("Il popup è stato bloccato. Per favore, abilita i popup per questo sito.");
} else {
popup.focus();
}
}
// Nuove funzioni specifiche per il menu
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