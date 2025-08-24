// ================================
// PERFORMANCE DASHBOARD: Ottimizzato e corretto
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

// --- 2. Gestione pulsanti filtro (con classe attiva) ---
document.addEventListener('DOMContentLoaded', () => {
  // Carica i dati all'avvio
  loadPerformanceData();

  // Inizializza i pulsanti del filtro
  const btnContainer = document.getElementById('myBtnContainer');
  if (btnContainer) {
    const buttons = btnContainer.querySelectorAll('.btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', function () {
        // Aggiorna lo stato attivo
        buttons.forEach(b => b.classList.remove('active'));
        this.classList.add('active');

        // Applica il filtro (SENZA ricaricare i dati)
        filterSelection(this.dataset.filter || 'all');
      });
    });
  }

  // Pulsante di aggiornamento (gestisce duplicati con classe)
  document.getElementById('refresh-btn')?.addEventListener('click', async () => {
    await loadPerformanceData();
    showNotification('Dati aggiornati con successo');
  });

  // Gestisci eventuali altri pulsanti "Aggiorna" con classe
  document.querySelectorAll('.refresh-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      await loadPerformanceData();
      showNotification('Dati aggiornati con successo');
    });
  });
});

// --- 3. Carica dati da JSON e popola la dashboard ---
async function loadPerformanceData() {
  try {
    const response = await fetch('tools/performance-data.json');
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

    // ✅ DOPO l'inserimento: applica il filtro iniziale
    filterSelection(document.querySelector('#myBtnContainer .btn.active')?.dataset.filter || 'all');

    // ✅ Riattiva lazy loading per nuove immagini
    const newImages = document.querySelectorAll('.portfolio-content img[data-src]');
    if ('IntersectionObserver' in window && newImages.length > 0) {
      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.add('loaded');
            obs.unobserve(img);
          }
        });
      }, { threshold: 0.1, rootMargin: '50px' });

      newImages.forEach(img => observer.observe(img));
    }

    // ✅ Aggiorna data ultimo aggiornamento
    const lastUpdate = document.getElementById('last-update');
    if (lastUpdate) {
      lastUpdate.textContent = 'Aggiornato il: ' + new Date().toLocaleString();
    }

    } catch (err) {
    console.warn('Errore nel caricamento dei dati di performance:', err.message);
    
    // Mostra contenuto statico di fallback, se presente
    fallbackToStaticContent();

    // Aggiorna messaggio di errore
    const lastUpdate = document.getElementById('last-update');
    if (lastUpdate) {
      lastUpdate.textContent = 'Errore nel caricamento dei dati. Ultimo aggiornamento sconosciuto.';
    }
  }
}

// --- 4. Crea una card delle performance ---
function createPerformanceCard(page) {
  const category = getMaturityCategory(page.performanceScore);

  const col = document.createElement('div');
  col.className = `portfolio-col ${category} portfolio-show`;
  col.setAttribute('data-page', page.slug);

  const color = getScoreColor(page.performanceScore);

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
  if (score >= 90) return '#4CAF50';   // Verde (Ottimo)
  if (score >= 75) return '#8BC34A';   // Verde chiaro (Buono)
  if (score >= 60) return '#FF9800';   // Arancione (Medio)
  return '#F44336';                    // Rosso (Scadente)
}

// --- 6. Calcola categoria di maturità tecnica ---
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

// --- 8. Capitalizza la prima lettera (e formatta categorie) ---
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).replace('-', ' ');
}

// --- 9. Fallback: usa contenuto HTML statico se JSON non disponibile ---
function fallbackToStaticContent() {
  console.log('Fallback attivato: utilizzo del contenuto HTML statico.');
  // Il contenuto statico nel DOM rimane visibile
  // Puoi eventualmente aggiungere qui card di esempio se vuoi
}

// --- 10. Mostra notifica temporanea ---
function showNotification(message) {
  const notif = document.createElement('div');
  notif.className = 'notification';
  notif.textContent = message;
  notif.style.cssText = `
    position: fixed; top: 20px; right: 20px; 
    background: #0a1a2a; color: #a7ffeb; 
    padding: 12px 20px; border: 1px solid #00e676; 
    border-radius: 6px; font-size: 14px; 
    z-index: 9999; opacity: 0; 
    transition: opacity 0.3s; box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  `;
  document.body.appendChild(notif);

  // Mostra
  setTimeout(() => { notif.style.opacity = '1'; }, 100);
  // Nasconde
  setTimeout(() => { notif.style.opacity = '0'; }, 3000);
  // Rimuove dal DOM
  setTimeout(() => { notif.remove(); }, 3500);
}
`` 