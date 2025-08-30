// QRedshift: Comfort visivo automatico 
function QRedshift() {   
  // Evita doppia applicazione
  if (document.body.classList.contains('qredshift-active')) return;
  // Orario locale
  const hour = new Date().getHours();
  let temp, gamma;
  if (hour >= 7 && hour < 19) {
    // Giorno
    temp = 5900; // Kelvin
    gamma = 1.0;
  } else {
    // Notte
    temp = 3500;
    gamma = 1.0;
  }  
  // Applica filtro CSS per comfort visivo
  // Usa filter: sepia + hue-rotate + brightness per simulare temperatura colore
  let filter;
  if (temp === 5900) {
    filter = 'sepia(0.2) hue-rotate(0deg) brightness(1)';
  } else {
    filter = 'sepia(0.5) hue-rotate(-30deg) brightness(1)';
  }
  document.body.classList.add('qredshift-active');
  document.body.style.filter = filter;
  document.body.style.transition = 'filter 0.5s';
  // Icona attiva
  const icon = document.createElement('div');
  icon.className = 'qredshift-icon';
  icon.title = 'Comfort visivo QRedshift attivo';
  icon.innerHTML = '<span>🌙</span>';
  document.body.appendChild(icon);
  icon.addEventListener('click', () => {
    // Disattiva QRedshift al click sull'icona
    document.body.classList.remove('qredshift-active');
    document.body.style.filter = '';
    icon.remove();
  });  
}
window.addEventListener('DOMContentLoaded', QRedshift);
// End QRredshift
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
// Drop-down menu
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
// Popup
function PopupCentrata()
{
var w = 760;
var h = 370;
var l = Math.floor((screen.width-w)/2);
var t = Math.floor((screen.height-h)/2);

window.open("https://gitechnolo.github.io/biotechproject/O.S_support.html","","width=" + w + ",height=" + h + ",top=" + t + ",left=" + l);
}
function ChatGPTpopupCenterAI()
{
var w = 825;
var h = 672;
var l = Math.floor((screen.width-w)/2);
var t = Math.floor((screen.height-h)/2);

window.open("https://gitechnolo.github.io/biotechproject/Tablet_forum.html","","width=" + w + ",height=" + h + ",top=" + t + ",left=" + l);
}
// End popup
/*// ———————————————————————
// ✅ NUOVO MENU MODERNO - Solo su pagine con data-modern-menu
// ———————————————————————
(function () {
// ✅ Esci subito se non siamo in una pagina moderna
if (!document.body.hasAttribute('data-modern-menu')) return;
// ✅ Codice del nuovo menu
document.addEventListener('DOMContentLoaded', function () {
const menuItems = document.querySelectorAll('.tech-menu-item');
let openDropdown = null;
menuItems.forEach(item => {
const btn = item.querySelector('.tech-nav-btn');
const dropdown = item.querySelector('.tech-dropdown');
btn.addEventListener('click', function (e) {
e.stopPropagation();
if (openDropdown && openDropdown !== dropdown) {
openDropdown.classList.remove('show');
openDropdown.previousElementSibling?.setAttribute('aria-expanded', 'false');
}
const isShowing = dropdown.classList.contains('show');
if (isShowing) {
dropdown.classList.remove('show');
btn.setAttribute('aria-expanded', 'false');
openDropdown = null;
} else {
dropdown.classList.add('show');
btn.setAttribute('aria-expanded', 'true');
openDropdown = dropdown;
}
});
document.body.addEventListener('click', () => {
if (dropdown.classList.contains('show')) {
dropdown.classList.remove('show');
btn.setAttribute('aria-expanded', 'false');
openDropdown = null;
}
});
dropdown.addEventListener('click', e => e.stopPropagation());
});
document.addEventListener('keydown', e => {
if (e.key === 'Escape' && openDropdown) {
openDropdown.classList.remove('show');
openDropdown.closest('.tech-menu-item')?.querySelector('.tech-nav-btn')?.setAttribute('aria-expanded', 'false');
openDropdown = null;
}
});
});
})();*/


// ———————————————————————
// ✅ MENU MODERNO - Solo su pagine con data-modern-menu
// ———————————————————————
(function () {
  if (!document.body.hasAttribute('data-modern-menu')) return;

  document.addEventListener('DOMContentLoaded', function () {
    let openDropdown = null;

    // Inizializza tutti i pulsanti del menu
    document.querySelectorAll('.tech-nav-btn').forEach(btn => {
      const dropdown = btn.nextElementSibling;
      if (!dropdown || !dropdown.classList.contains('tech-dropdown')) return;

      // ARIA iniziale
      btn.setAttribute('aria-haspopup', 'true');
      btn.setAttribute('aria-expanded', 'false');

      // Click sul pulsante
      btn.addEventListener('click', e => {
        e.stopPropagation();

        const isExpanded = btn.getAttribute('aria-expanded') === 'true';

        // Chiudi altro dropdown aperto
        if (openDropdown && openDropdown !== dropdown) {
          openDropdown.classList.remove('show');
          openDropdown.previousElementSibling.setAttribute('aria-expanded', 'false');
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
        }
      });

      // Supporto tastiera: Enter o Space
    btn.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        btn.click();
      }
    });
  });

  // Chiudi il dropdown al click fuori
  document.addEventListener('click', () => {
    if (openDropdown) {
      openDropdown.classList.remove('show');
      const btn = openDropdown.previousElementSibling?.querySelector('.tech-nav-btn');
      btn?.setAttribute('aria-expanded', 'false');
      openDropdown = null;
    }
  });

  // Chiudi con tasto ESC
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && openDropdown) {
      openDropdown.classList.remove('show');
      const btn = openDropdown.previousElementSibling?.querySelector('.tech-nav-btn');
      btn?.setAttribute('aria-expanded', 'false');
      btn?.focus(); // Riporta il focus sul pulsante
      openDropdown = null;
    }
  });
});
})();