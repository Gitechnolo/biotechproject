// Biotech-file/portfolio.js

document.addEventListener('DOMContentLoaded', () => {
  // --- 1. Funzione per creare una card di performance ---
  function createPerformanceCard(page) {
    const cell = document.createElement('div');
    cell.className = 'portfolio-col dynamic portfolio-show';
    if (page.status) cell.classList.add(page.status);

    const url = page.url || 'Pagina sconosciuta';
    const fileName = url.split('/').pop() || 'index.html';
    const performance = Math.round((page.performance || 0) * 100);
    const accessibility = Math.round((page.accessibility || 0) * 100);
    const bestPractices = Math.round((page['best-practices'] || 0) * 100);
    const seo = Math.round((page.seo || 0) * 100);
    const loadTime = page.loadTime ? (page.loadTime / 1000).toFixed(1) : '?';

    cell.innerHTML = `
      <div class="portfolio-content">
        <div class="perf-meter" style="background: conic-gradient(#4CAF50 ${performance}%, #e0e0e0 ${performance}%)"><span>${performance}</span></div>
        <div class="fadebox">
          <strong>${fileName}</strong><br>Score: ${performance}/100 • ${loadTime} s
        </div>
        <p class="greentext">${fileName} — ${page.status?.charAt(0).toUpperCase() + page.status?.slice(1) || 'Compatibile'}</p>
      </div>
    `;
    return cell;
  }

  // --- 2. Pulsanti di aggiornamento ---
  document.getElementById('refresh-btn')?.addEventListener('click', async () => {
    await loadPerformanceData();
    showNotification('Dati aggiornati con successo');
  });

  document.querySelectorAll('.refresh-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      await loadPerformanceData();
      showNotification('Dati aggiornati con successo');
    });
  });

  // --- 3. Carica dati da JSON o usa fallback ---
  async function loadPerformanceData() {
    try {
      const response = await fetch('data/performance-latest.json');
      if (!response.ok) throw new Error('Dati non disponibili');

      const data = await response.json();
      const container = document.querySelector('.portfolio-row');
      if (!container) return;

      // Rimuove le card di esempio (non dinamiche)
      container.querySelectorAll('.portfolio-col:not(.dynamic)').forEach(card => card.remove());
      // Pulisce il resto
      container.innerHTML = '';

      // Estrai data del report dalla homepage
      const homePage = data.pages.find(p => 
        p.url.includes('/index.html') || 
        p.url === 'https://gitechnolo.github.io/biotechproject/' ||
        p.url === window.location.origin + '/biotechproject/'
      );

      const reportTime = homePage?.generatedTime 
        ? new Date(homePage.generatedTime) 
        : new Date();

      // Aggiorna #last-update
      const lastUpdate = document.getElementById('last-update');
      if (lastUpdate) {
        const dateStr = reportTime.toLocaleDateString('it-IT');
        const timeStr = reportTime.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
        lastUpdate.textContent = `Aggiornato il: ${dateStr} alle ${timeStr}`;
      }

      // Aggiorna #performance-score
      const performanceScore = homePage 
        ? Math.round(homePage.performance * 100) 
        : Math.round((data.pages[0]?.performance || 0.9) * 100);
      const scoreEl = document.getElementById('performance-score');   
        if (scoreEl) {
        scoreEl.textContent = performanceScore;
      }

      // Genera le card dinamicamente
      data.pages.forEach(page => {
        const cell = createPerformanceCard(page);
        container.appendChild(cell);
      });

      // Aggiorna i filtri (se implementati)
      if (typeof filterSelection === 'function') {
        filterSelection('all');
      }

    } catch (error) {
      console.warn('Impossibile caricare i dati di performance:', error);

      // Popola tutti i cerchi con valori di esempio
      if (typeof populateAllCirclesFallback === 'function') {
        populateAllCirclesFallback();
      }

      // Aggiorna grafico e punteggio principale, se presenti
      if (typeof drawPerformanceChart === 'function') {
        drawPerformanceChart();
      }
      const scoreEl = document.getElementById('performance-score');
      if (scoreEl) {
        scoreEl.textContent = '90'; // valore di esempio
      }
      const lastUpdate = document.getElementById('last-update');
      if (lastUpdate) {
        lastUpdate.textContent = 'Aggiornato il: dati non disponibili';
      }

      // Mostra notifica all'utente
      if (typeof showNotification === 'function') {
        showNotification('Dati temporaneamente non disponibili. Mostrati valori di esempio.');
      }
    }
  }

  // --- 4. Inizializza il caricamento dati ---
  loadPerformanceData();
});

// --- Funzione ausiliaria: mostra notifica ---
function showNotification(message) {
  const notification = document.getElementById('notification');
  if (notification) {
    notification.textContent = message;
    notification.classList.add('show');
    setTimeout(() => {
      notification.classList.remove('show');
    }, 3000);
  }
}   