// Biotech-file/portfolio.js
// ———————————————————————
// GESTIONE PERFORMANCE E GRAFICO DI MATURITÀ TECNOLOGICA
// ———————————————————————

// --- Funzione principale: carica dati reali dal JSON ---
async function loadPerformanceData() {
  console.log('🔧 loadPerformanceData() in esecuzione');
  try {
    const response = await fetch('data/performance-latest.json');
    if (!response.ok) throw new Error('Dati non disponibili');

    const data = await response.json();
    const container = document.querySelector('.portfolio-row');
    if (!container) return;

    // Pulisci container
    container.innerHTML = '';

    // Estrai homepage per data e punteggio
    const homePage = data.pages.find(p =>
      p.url.includes('/index.html') ||
      p.url === 'https://gitechnolo.github.io/biotechproject/' ||
      p.url === window.location.origin + '/biotechproject/'
    );

    const reportTime = homePage?.generatedTime ? new Date(homePage.generatedTime) : new Date();

    // Aggiorna data in #last-update
    const lastUpdate = document.getElementById('last-update');
    if (lastUpdate) {
      const dateStr = reportTime.toLocaleDateString('it-IT');
      const timeStr = reportTime.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
      lastUpdate.textContent = `Aggiornato il: ${dateStr} alle ${timeStr}`;
    }

    // Usa punteggio reale
    const performanceScoreValue = homePage?.performanceScore ?? 85;

    // Aggiorna punteggio principale
    aggiornaPerformanceScore(performanceScoreValue);

    // Genera tutte le card
    data.pages.forEach(page => {
      const card = createPerformanceCard(page);
      container.appendChild(card);
    });

    // Inizializza filtri (se presenti)
    if (typeof filterSelection === 'function') {
      filterSelection('all');
    }

    // Aggiorna grafico (usa dati stimati per ora)
    creaGrafico();

  } catch (error) {
    console.warn('⚠️ Impossibile caricare i dati reali:', error);

    // Fallback visivo
    if (typeof populateAllCirclesFallback === 'function') {
      populateAllCirclesFallback();
    }

    aggiornaPerformanceScore(85);
    creaGrafico(); // Mostra trend stimato

    const lastUpdate = document.getElementById('last-update');
    if (lastUpdate) {
      lastUpdate.textContent = 'Aggiornato il: dati non disponibili';
    }

    showNotification('Dati temporaneamente non disponibili. Mostrati valori di esempio.');
  }
}

// --- Crea la card per ogni pagina ---
function createPerformanceCard(page) {
  // Gestisci entrambi i formati: score 0-100 o 0.0-1.0
  const performance = page.performanceScore !== undefined
    ? page.performanceScore
    : page.performance !== undefined
      ? Math.round(page.performance * 100)
      : 85;

  // Determina classe CSS in base al punteggio
  let perfClass = 'needs-improvement';
  if (performance >= 90) perfClass = 'optimized';
  else if (performance >= 80) perfClass = 'compatible';
  else if (performance >= 60) perfClass = 'needs-improvement';
  else perfClass = 'deprecated';

  const url = page.url || 'Pagina sconosciuta';
  const fileName = url.split('/').pop() || 'index.html';
  const loadTime = page.loadTime ? (page.loadTime / 1000).toFixed(1) : '?';

  // Crea il badge
  const badgeHTML = `
    <span class="status-badge badge-${perfClass}">
      ${perfClass.replace('needs-improvement', 'Needs Improvement')
                 .replace('deprecated', 'Deprecated')
                 .replace('compatible', 'Compatible')
                 .replace('optimized', 'Optimized')}
    </span>
  `;

  const card = document.createElement('div');
  card.className = `portfolio-col ${perfClass} portfolio-show dynamic`;
  card.dataset.page = page.slug || fileName;

  card.innerHTML = `
    <div class="portfolio-content">
      <div class="fadebox">
        <strong>${fileName}${badgeHTML}</strong><br>
        Score: ${performance}/100 
       <span class="status-badge ${getTrendColorClass(performance, page.previousPerformanceScore)}" 
             style="font-size: 9px; padding: 1px 5px; margin-left: 6px;">
         ${getTrendArrow(performance, page.previousPerformanceScore)}
         ${page.previousPerformanceScore !== undefined ? 
           (performance > page.previousPerformanceScore ? '+' : '') + 
           (performance - page.previousPerformanceScore) 
           : ''}
       </span>
       • ${loadTime} s  
      </div>
      <p class="greentext">${fileName} — ${perfClass.charAt(0).toUpperCase() + perfClass.slice(1)}</p>
    </div>
  `;

  return card;
}   

// --- Gestione pulsanti di aggiornamento ---
function setupRefreshButtons() {
  // Evita doppia inizializzazione
  if (window.refreshButtonsSetup) return;
  window.refreshButtonsSetup = true;

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
}

// --- Aggiorna punteggio principale e trend ---
function aggiornaPerformanceScore(performanceScoreValue = 85) {
  const scoreEl = document.getElementById('performance-score') || 
                 document.getElementById('tech-maturity-score');
  if (scoreEl) {
    scoreEl.textContent = `${performanceScoreValue}%`;
  }

  const trendIndicator = document.getElementById('trend-indicator');
  if (trendIndicator) {
    const trend = performanceScoreValue - 82; // confronto con valore precedente
    trendIndicator.textContent = trend > 0 ? '↑' : trend < 0 ? '↓' : '→';
    trendIndicator.style.color = trend > 0 ? '#10b981' : trend < 0 ? '#ef4444' : '#f59e0b';
  }
}

// --- Dati storici e previsioni per il grafico ---
const datiStorici = [
  { data: '2024-09-01', valore: 30, descrizione: 'Avvio progetto - Struttura base' },
  { data: '2024-10-15', valore: 38, descrizione: 'Primi contenuti scientifici' },
  { data: '2024-12-01', valore: 45, descrizione: 'Integrazione versioni semplici' },
  { data: '2025-01-20', valore: 52, descrizione: 'Ottimizzazione mobile' },
  { data: '2025-03-10', valore: 60, descrizione: 'Implementazione accessibilità WCAG' },
  { data: '2025-05-05', valore: 70, descrizione: 'Forum interattivo integrato' },
  { data: '2025-07-01', valore: 78, descrizione: 'Dashboard tecnica attiva' },
  { data: '2025-09-15', valore: 85, descrizione: 'Completa coerenza UI/UX e navigazione' }
];

const previsione = [
  { data: '2025-10-15', valore: 88, descrizione: 'Prev: Audit accessibilità completa' },
  { data: '2025-11-30', valore: 91, descrizione: 'Prev: Ottimizzazione SEO avanzata' },
  { data: '2025-12-15', valore: 94, descrizione: 'Prev: Test usabilità utenti reali' },
  { data: '2026-01-30', valore: 97, descrizione: 'Prev: Documentazione tecnica finale' },
  { data: '2026-02-28', valore: 100, descrizione: 'Prev: Maturità tecnologica completa' }
];

const datiCompleti = [...datiStorici, ...previsione];
const labels = datiCompleti.map(d => formatDate(d.data));
const valori = datiCompleti.map(d => d.valore);

function formatDate(dateString) {
  const options = { month: 'short', year: '2-digit' };
  return new Date(dateString).toLocaleDateString('it-IT', options)
    .replace('.', '')
    .replace(' ', ' ');
}

// --- Variabile globale per il grafico ---
let performanceChart;

// --- Funzione: crea o aggiorna il grafico ---
function creaGrafico() {
  const ctx = document.getElementById('performance-trend');
  if (!ctx) return;

  const chartCtx = ctx.getContext('2d');

  // Distruggi grafico esistente
  if (performanceChart) {
    performanceChart.destroy();
  }

  performanceChart = new Chart(chartCtx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Maturità Tecnologica del Sito (%)',
        data: valori,
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 3,
        pointRadius: 5,
        pointBackgroundColor: (context) => {
          // Punti storici in verde, previsioni in arancione
          return context.dataIndex < datiStorici.length ? '#10b981' : '#f59e0b';
        },
        fill: true,
        tension: 0.3
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          labels: { color: '#ffffff' }
        },
        tooltip: {
          backgroundColor: '#1f2937',
          titleColor: '#ffffff',
          bodyColor: '#d1d5db',
          borderColor: '#4b5563',
          borderWidth: 1,
          callbacks: {
            label: (context) => {
              const isPrevisto = context.dataIndex >= datiStorici.length;
              const tipo = isPrevisto ? ' (previsto)' : ' (reale)';
              return `${context.parsed.y}%${tipo} - ${datiCompleti[context.dataIndex].descrizione}`;
            }
          }
        }
      },
      scales: {
        x: {
          ticks: { color: '#b2dfdb' },
          grid: { color: 'rgba(178, 223, 219, 0.1)' }
        },
        y: {
          min: 0,
          max: 100,
          ticks: { color: '#b2dfdb' },
          grid: { color: 'rgba(178, 223, 219, 0.1)' }
        }
      }
    }
  });

  // Aggiorna tabella accessibile
  aggiornaTabellaDati();
}

// --- Aggiorna tabella accessibile con dati del grafico ---
function aggiornaTabellaDati() {
  const tbody = document.getElementById('chart-data-body');
  if (!tbody) return;

  tbody.innerHTML = '';
  datiCompleti.forEach(item => {
    const tr = document.createElement('tr');
    const tdData = document.createElement('td');
    const tdValore = document.createElement('td');
    tdData.textContent = item.data;
    tdValore.textContent = `${item.valore}%`;
    tr.appendChild(tdData);
    tr.appendChild(tdValore);
    tbody.appendChild(tr);
  });
}

// --- Funzione ausiliaria: mostra notifica (sicura) ---
if (typeof showNotification === 'undefined') {
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
}

// --- Inizializzazione unica ---
document.addEventListener('DOMContentLoaded', () => {
  setupRefreshButtons();
  loadPerformanceData(); // Carica dati e inizializza grafico
}); 


// --- Filtra le card in base al livello di maturità delle pagine ---
function filterSelection(filter) {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === filter);
  });

  const cards = document.querySelectorAll('.portfolio-col');
  let visibleCount = 0;

  cards.forEach(card => {
    if (filter === 'all' || card.classList.contains(filter)) {
      card.style.display = 'flex';
      visibleCount++;
    } else {
      card.style.display = 'none';
    }
  });

  // Messaggio se nessuna card visibile
  const container = document.querySelector('.portfolio-row');
  const message = document.getElementById('filter-message');

  if (!message) {
    const msgEl = document.createElement('p');
    msgEl.id = 'filter-message';
    msgEl.style.color = '#a0aec0';
    msgEl.style.textAlign = 'center';
    msgEl.style.fontStyle = 'italic';
    msgEl.style.padding = '20px';
    container.parentNode.insertBefore(msgEl, container.nextSibling);
  }

  const msgEl = document.getElementById('filter-message');
  msgEl.textContent = visibleCount === 0 
    ? 'Nessuna pagina trovata con questo stato di maturità.'
    : '';
}

// 2. Aggiungi gli event listener in modo pulito (senza onclick nell'HTML)
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      filterSelection(btn.dataset.filter);
    });
  });
});  


// --- Calcola freccia di tendenza per singola pagina ---
function getTrendArrow(current, previous) {
  if (previous === undefined || previous === null) return '→';
  const diff = current - previous;
  if (diff > 0) return '▲';
  if (diff < 0) return '▼';
  return '→';
}

// --- Determina la classe colore del badge della freccia ---
function getTrendColorClass(current, previous) {
  if (previous === undefined || previous === null) return 'badge-needs-improvement';
  return current > previous ? 'badge-optimized' :  // ▲ verde acqua
         current < previous ? 'badge-deprecated' : // ▼ rosso
                            'badge-compatible';   // ➔ verde
}   