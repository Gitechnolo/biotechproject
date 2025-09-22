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
      const response = await fetch('https://gitechnolo.github.io/biotechproject/data/performance-latest.json');
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
// ———————————————————————
// ———————————————————————
// ✅ Grafico andamento reale maturità tecnologica (fino a oggi) e stima realistica fino al 100%.
// ———————————————————————
// Dati storici basati sulle modifiche effettive (sitemap e miglioramenti)
// --- Variabili globali per il grafico ---
let performanceChart;
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
// --- Funzione per creare una card di performance ---
function createPerformanceCard(page) {
  const cell = document.createElement('div');
  cell.className = 'portfolio-col dynamic portfolio-show';
  if (page.status) cell.classList.add(page.status);

  const url = page.url || 'Pagina sconosciuta';
  const fileName = url.split('/').pop() || 'index.html';
  const performance = Math.round((page.performance || 0) * 100);
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
          return context.dataIndex < datiStorici.length ? '#10b981' : '#f59e0b';
        },
        fill: true,
        tension: 0.3
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { labels: { color: '#ffffff' } },
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
        x: { ticks: { color: '#b2dfdb' }, grid: { color: 'rgba(178, 223, 219, 0.1)' } },
        y: { min: 0, max: 100, ticks: { color: '#b2dfdb' }, grid: { color: 'rgba(178, 223, 219, 0.1)' } }
      }
    }
  });

  aggiornaTabellaDati();
  aggiornaPerformanceScore();
}   
// --- Aggiorna tabella accessibile ---
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
// --- Aggiorna punteggio principale (se non fornito da JSON) ---
function aggiornaPerformanceScore(performanceScoreValue = 85) {
  const scoreEl = document.getElementById('performance-score');
  const trendIndicator = document.getElementById('trend-indicator');

  if (scoreEl) {
    scoreEl.textContent = `${performanceScoreValue}%`;
  }

  if (trendIndicator) {
    const trend = performanceScoreValue - 82; // es. ultimo valore precedente
    trendIndicator.textContent = trend > 0 ? '↑' : trend < 0 ? '↓' : '→';
    trendIndicator.style.color = trend > 0 ? '#10b981' : trend < 0 ? '#ef4444' : '#f59e0b';
  }
}   
// --- Carica dati performance da JSON ---
async function loadPerformanceData() {
  try {
    const response = await fetch('data/performance-latest.json');
    if (!response.ok) throw new Error('Dati non disponibili');

    const data = await response.json();
    const container = document.querySelector('.portfolio-row');
    if (!container) return;

    // Pulisci container e rimuovi solo le card non dinamiche (se presenti)
    container.querySelectorAll('.portfolio-col:not(.dynamic)').forEach(card => card.remove());
    // ... ma meglio: pulisci tutto e ricostruisci
    container.innerHTML = '';

    // Estrai data generazione dal campo della homepage
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

    // Usa il punteggio reale della homepage
    const performanceScoreValue = homePage 
      ? Math.round(homePage.performance * 100) 
      : 85;

    // Aggiorna punteggio e trend
    aggiornaPerformanceScore(performanceScoreValue);

    // Genera tutte le card
    data.pages.forEach(page => {
      const cell = createPerformanceCard(page);
      container.appendChild(cell);
    });

    // Inizializza filtri (se presenti)
    if (typeof filterSelection === 'function') {
      filterSelection('all');
    }

    // Ora crea il grafico con dati completi
    creaGrafico();

  } catch (error) {
    console.warn('Impossibile caricare i dati di performance:', error);

    // Usa dati di fallback
    if (typeof populateAllCirclesFallback === 'function') {
      populateAllCirclesFallback();
    }

    // Aggiorna score e grafico con valore di esempio
    aggiornaPerformanceScore(85);
    creaGrafico(); // Mostra comunque il trend storico

    const lastUpdate = document.getElementById('last-update');
    if (lastUpdate) {
      lastUpdate.textContent = 'Aggiornato il: dati non disponibili';
    }

    if (typeof showNotification === 'function') {
      showNotification('Dati temporaneamente non disponibili. Mostrati valori di esempio.');
    }
  }
}   
// --- Gestione pulsanti di aggiornamento ---
function setupRefreshButtons() {
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
// --- Inizializzazione unica ---
document.addEventListener('DOMContentLoaded', () => {
  setupRefreshButtons();
  loadPerformanceData(); // Carica dati e inizializza grafico
});
/*
====================================================================================
   🔧 FUTURA OTTIMIZZAZIONE: Caricamento dati esterni per il grafico di maturità
====================================================================================
Per rendere dinamico l'andamento del grafico (senza modificare il codice), creare un file JSON come questo:

👉 data/maturita-trend.json

{
  "storici": [
    { "data": "2024-09-01", "valore": 30, "descrizione": "Avvio progetto - Struttura base" },
    { "data": "2024-10-15", "valore": 38, "descrizione": "Primi contenuti scientifici" },
    ...
  ],
  "previsione": [
    { "data": "2025-10-15", "valore": 88, "descrizione": "Prev: Audit accessibilità completa" },
    ...
  ]
}

Poi sostituire il blocco iniziale in portfolio.js con:

------------------------------------------------------------------------------------

async function caricaDatiGrafico() {
  try {
    const response = await fetch('data/maturita-trend.json');
    const { storici, previsione } = await response.json();
    return { storici, previsione };
  } catch (error) {
    console.warn('Impossibile caricare i dati del grafico. Usa dati di fallback.', error);
    // Dati di fallback (puoi mantenerli qui o in un file separato)
    return {
      storici: [
        { data: '2024-09-01', valore: 30, descrizione: 'Avvio progetto - Struttura base' },
        { data: '2024-10-15', valore: 38, descrizione: 'Primi contenuti scientifici' },
        { data: '2024-12-01', valore: 45, descrizione: 'Integrazione versioni semplici' },
        { data: '2025-01-20', valore: 52, descrizione: 'Ottimizzazione mobile' },
        { data: '2025-03-10', valore: 60, descrizione: 'Implementazione accessibilità WCAG' },
        { data: '2025-05-05', valore: 70, descrizione: 'Forum interattivo integrato' },
        { data: '2025-07-01', valore: 78, descrizione: 'Dashboard tecnica attiva' },
        { data: '2025-09-15', valore: 85, descrizione: 'Completa coerenza UI/UX e navigazione' }
      ],
      previsione: [
        { data: '2025-10-15', valore: 88, descrizione: 'Prev: Audit accessibilità completa' },
        { data: '2025-11-30', valore: 91, descrizione: 'Prev: Ottimizzazione SEO avanzata' },
        { data: '2025-12-15', valore: 94, descrizione: 'Prev: Test usabilità utenti reali' },
        { data: '2026-01-30', valore: 97, descrizione: 'Prev: Documentazione tecnica finale' },
        { data: '2026-02-28', valore: 100, descrizione: 'Prev: Maturità tecnologica completa' }
      ]
    };
  }
}

// Poi modificare l'inizio di 'creaGrafico()' o crea una funzione 'inizializzaGrafico()':

  async function inizializzaGrafico() {
  const { storici, previsione } = await caricaDatiGrafico();
  datiStorici = storici;
  datiPrevisione = previsione;
  datiCompleti = [...datiStorici, ...datiPrevisione];
  labels = datiCompleti.map(d => formatDate(d.data));
  valori = datiCompleti.map(d => d.valore);
  creaGrafico(); // Ricostruisce il grafico con i nuovi dati
}   
// Infine, chiama questa funzione invece di 'creaGrafico()' direttamente:
// document.addEventListener('DOMContentLoaded', () => {
//   setupRefreshButtons();
//   loadPerformanceData();
//   inizializzaGrafico(); // ← così
// });   

==================================================================================== 
Il vantaggio di questo approccio; Si aggiorna il grafico modificando solo un file JSON, senza toccare il codice JS.
I dati sono separati dalla logica → più pulito, più gestibile.
Si può automatizzare l'aggiornamento del JSON con script o CI/CD (es. GitHub Actions).
Funziona anche offline o in fallback.
====================================================================================

*/