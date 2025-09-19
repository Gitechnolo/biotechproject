// ================================
// PERFORMANCE DASHBOARD: Ottimizzato per locale + server
// ================================

// --- 1. Filtro con animazione fluida ---
function filterSelection(category) {
  const items = document.querySelectorAll('.portfolio-col');
  window.requestAnimationFrame(() => {
    items.forEach(item => {
      const show = category === 'all' || item.classList.contains(category);
      item.classList.toggle('portfolio-show', show);
    });
  });
}
// --- 2. Gestione pulsanti filtro ---
document.addEventListener('DOMContentLoaded', () => {
  // Inizializza i pulsanti del filtro
  const btnContainer = document.getElementById('myBtnContainer');
  if (btnContainer) {
    const buttons = btnContainer.querySelectorAll('.btn, .filter-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', function () {
        buttons.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        filterSelection(this.dataset.filter || 'all');
      });
    });
  }
  // Pulsante di aggiornamento
  document.getElementById('refresh-btn')?.addEventListener('click', async () => {
    await loadPerformanceData();
    showNotification('Dati aggiornati con successo');
  });
  // Gestisci altri pulsanti "Aggiorna"
  document.querySelectorAll('.refresh-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      await loadPerformanceData();
      showNotification('Dati aggiornati con successo');
    });
  });
  // ✅ Inizializza il filtro anche se non c'è fetch (fallback)
  filterSelection('all');
});
// --- 3. Carica dati da JSON o usa fallback ---
async function loadPerformanceData() {
  try {
    const response = await fetch('/biotechproject/data/performance-latest.json');
    if (!response.ok) throw new Error('Dati non disponibili');

    const data = await response.json();
    const container = document.querySelector('.portfolio-row');
    if (!container) return;
    // Pulisce il contenuto esistente
    container.innerHTML = '';
    // Genera le card dinamicamente
    data.pages.forEach(page => {
      const cell = createPerformanceCard(page);
      container.appendChild(cell);
    });
   // ✅ Riattiva lazy loading
const newImages = document.querySelectorAll('.portfolio-content img[data-src]');
if ('IntersectionObserver' in window && newImages.length > 0) {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.add('loaded');
        img.removeAttribute('data-src');
        obs.unobserve(img);
      }
    });
  }, { threshold: 0.1, rootMargin: '50px' });

  newImages.forEach(img => observer.observe(img));
}
// ✅ Aggiorna data ultimo aggiornamento
const lastUpdate = document.getElementById('last-update');
if (lastUpdate) {
  const now = new Date();
  const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' };
  lastUpdate.textContent = `Aggiornato il: ${now.toLocaleString('it-IT', options)}`;
}
// ✅ DOPO aver caricato i dati: applica il filtro iniziale
filterSelection(document.querySelector('#myBtnContainer .btn.active')?.dataset.filter || 'all');

} catch (err) {
console.warn('Errore nel caricamento dei dati di performance:', err.message);

// ✅ Fallback: usa il contenuto HTML già presente nel DOM
fallbackToStaticContent();

// ✅ Assicura che il filtro funzioni anche sulle card statiche
filterSelection('all'); // Inizializza il filtro sulle card esistenti

// Aggiorna messaggio
const lastUpdate = document.getElementById('last-update');
if (lastUpdate) {
  lastUpdate.textContent = '⚠️ Dati non aggiornati. In uso dati locali o di esempio.';
}
}
}
// --- 4. Crea una card delle performance ---
function createPerformanceCard(page) {
const category = getMaturityCategory(page.performanceScore);
const color = getScoreColor(page.performanceScore);

const col = document.createElement('div');
col.className = `portfolio-col ${category} portfolio-show`;
col.setAttribute('data-page', page.slug);

col.innerHTML = `
  <div class="portfolio-content">
    <div class="perf-meter" style="background: conic-gradient(${color} ${page.performanceScore}%, #e0e0e0 ${page.performanceScore}%)">
      <span>${page.performanceScore}</span>
    </div>
    <div class="fadebox">
      <strong>${page.label}</strong><br>
      Score: ${page.performanceScore}/100 • ${formatLoadTime(page.loadTime)}
    </div>
    <p class="greentext">${page.slug} — ${capitalize(category)}</p>
  </div>
`;
return col;
}
// --- 5. Mappa il punteggio a un colore ---
function getScoreColor(score) {
if (score >= 90) return '#4CAF50';   // Verde
if (score >= 75) return '#8BC34A';   // Verde chiaro
if (score >= 60) return '#FF9800';   // Arancione
return '#F44336';                    // Rosso
}
// --- 6. Calcola categoria di maturità ---
function getMaturityCategory(score) {
if (score >= 90) return 'optimized';
if (score >= 75) return 'compatible';
if (score >= 60) return 'needs-improvement';
return 'deprecated';
}
// --- 7. Formatta il tempo di caricamento ---
function formatLoadTime(ms) {
if (!ms) return '– ms';
return ms < 1000 ? `${ms} ms` : `${(ms / 1000).toFixed(2)} s`;
}
// --- 8. Capitalizza la prima lettera ---
function capitalize(str) {
return str.charAt(0).toUpperCase() + str.slice(1).replace('-', ' ');
}
// --- 9. Fallback: usa contenuto statico ---
function fallbackToStaticContent() {
console.log('Fallback attivato: uso del contenuto HTML statico.');
// Il contenuto già nel DOM (in Tech_Maturity.html) rimane visibile
}
// --- 10. Mostra notifica temporanea ---
function showNotification(message) {
  const notif = document.createElement('div');
  notif.className = 'notification2';
  notif.textContent = message;
  notif.setAttribute('aria-live', 'polite');
  notif.setAttribute('role', 'status');

  document.body.appendChild(notif);

  setTimeout(() => { notif.style.opacity = '1'; }, 100);
  setTimeout(() => {
    notif.style.opacity = '0';
    setTimeout(() => notif.remove(), 300);
  }, 3000);
}     