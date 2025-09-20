// Biotech-file/portfolio.js

document.addEventListener('DOMContentLoaded', () => {
  // --- 1. Funzione per creare una card di performance
  function createPerformanceCard(page) {
    const cell = document.createElement('div');
    cell.className = 'portfolio-item';

    // Esempio di dati, da sostituire con quelli reali
   const url = page.url || 'Pagina sconosciuta';
  const performance = Math.round((page.performance || 0) * 100);
  const accessibility = Math.round((page.accessibility || 0) * 100);
  const bestPractices = Math.round((page['best-practices'] || 0) * 100);  
  const seo = Math.round((page.seo || 0) * 100);

  cell.innerHTML = `
    <div class="portfolio-content">
      <div class="portfolio-img">
        <img src="${page.screenshot || 'assets/img/default-screenshot.png'}" alt="${url}">
      </div>
      <div class="portfolio-info">
        <h4>${url}</h4>
        <div class="metrics">
          <span>⚡ ${performance}</span>
          <span>♿ ${accessibility}</span>
          <span>✅ ${bestPractices}</span>  
          <span>🔍 ${seo}</span>
        </div>
        <button class="btn btn-sm refresh-btn">Aggiorna</button>
      </div>
    </div>
  `;
  return cell;
}

// --- 2. Pulsanti di aggiornamento
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

  // ✅ Inizializza il filtro
  filterSelection('all');

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
      if (typeof updatePerformanceScore === 'function') {
        updatePerformanceScore(90);
      }

      // Mostra notifica all'utente
      if (typeof showNotification === 'function') {
        showNotification('Dati temporaneamente non disponibili. Mostrati valori di esempio.');
      }
    }
  }

  // --- 4. Inizializza il caricamento dati
  loadPerformanceData();
});

// Funzione ausiliaria: mostra notifica
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