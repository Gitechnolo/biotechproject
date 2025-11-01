// Robust reportPerformance.js — carica performance-latest.json e popola Tech_Maturity in modo idempotente

// Caricamento sicuro del JSON (più fallback)
async function loadAuditData() {
  const candidates = [
    'data/performance-latest.json',
    '/biotechproject/data/performance-latest.json',
    'data/performance-data.json',
    '/biotechproject/data/performance-data.json',
    'https://raw.githubusercontent.com/Gitechnolo/biotechproject/main/data/performance-latest.json'
  ];
  for (const url of candidates) {
    try {
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) continue;
      const json = await res.json();
      return json;
    } catch (e) {
      // continua al prossimo fallback
      // console.warn('Caricamento JSON fallito:', url, e);
    }
  }
  throw new Error('Impossibile caricare performance-latest.json dalle posizioni note.');
}

// Debounce helper
function debounce(fn, wait = 300) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}

// Render aggregato per Tech_Maturity (idempotente)
function renderTechReport(auditData) {
  try {
    if (!auditData) return;
    const pages = Array.isArray(auditData.pages) ? auditData.pages.slice() : [];
    const summary = auditData.summary || {};

    // Conteggi e medie
    const analyzed = summary.analyzed ?? pages.length;
    const avgPerformance = summary.averagePerformance ?? Math.round((pages.reduce((s, p) => s + (p.performanceScore || 0), 0) / (pages.length || 1)) || 0);
    const avgA11y = summary.averageAccessibility ?? null;
    const avgSeo = summary.averageSeo ?? null;
    const avgBest = summary.averageBestPractices ?? null;
    const lastUpdated = auditData.lastUpdated || (new Date()).toISOString();

    // Aggiorna elementi base (se presenti)
    const elAnalyzed = document.getElementById('analyzed-count');
    const elTotalPages = document.getElementById('total-pages');
    const elAvg = document.getElementById('avg-performance');
    const elScore = document.getElementById('performance-score');
    const elLast = document.getElementById('last-updated');
    const elLastReport = document.getElementById('last-updated-report');
    const elAvgA11y = document.getElementById('avg-accessibility');
    const elAvgSeo = document.getElementById('avg-seo');
    const elAvgBest = document.getElementById('avg-best-practices');

    if (elAnalyzed) elAnalyzed.textContent = analyzed;
    if (elTotalPages) elTotalPages.textContent = pages.length;
    if (elAvg) elAvg.textContent = `${avgPerformance}%`;
    if (elScore) elScore.textContent = `${avgPerformance}%`;
    if (elLast) elLast.textContent = (new Date(lastUpdated)).toLocaleString();
    if (elLastReport) {
      elLastReport.textContent = (new Date(lastUpdated)).toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' });
      elLastReport.setAttribute('datetime', lastUpdated);
    }
    if (elAvgA11y && avgA11y !== null) elAvgA11y.textContent = `${avgA11y}%`;
    if (elAvgSeo && avgSeo !== null) elAvgSeo.textContent = `${avgSeo}%`;
    if (elAvgBest && avgBest !== null) elAvgBest.textContent = `${avgBest}%`;

    // Popola la tabella semplificata (cancella prima)
    const tbody = document.getElementById('chart-data-body');
    if (tbody) {
      tbody.innerHTML = '';
      pages.forEach(p => {
        const tr = document.createElement('tr');
        const tdDate = document.createElement('td');
        const tdScore = document.createElement('td');
        tdDate.textContent = p.lastAnalyzed ? new Date(p.lastAnalyzed).toLocaleDateString() : '';
        tdScore.textContent = (p.performanceScore != null) ? `${p.performanceScore}%` : '-';
        tr.appendChild(tdDate);
        tr.appendChild(tdScore);
        tbody.appendChild(tr);
      });
    }

    // Popola griglia portfolio-row (cancella prima)
    const grid = document.querySelector('.portfolio-row');
    if (grid) {
      // per evitare layout thrashing: costruisci in fragment
      const frag = document.createDocumentFragment();
      // ordina per score decrescente
      const sorted = pages.slice().sort((a, b) => (b.performanceScore || 0) - (a.performanceScore || 0));
      sorted.forEach(p => {
        const col = document.createElement('div');
        col.className = 'portfolio-col portfolio-show';
        col.setAttribute('data-score', p.performanceScore ?? 0);
        col.innerHTML = `
          <div class="portfolio-content" role="article" aria-label="${(p.label || p.url).replace(/"/g, '&quot;')}">
            <h4 style="margin:0 0 6px 0">${p.label || p.url}</h4>
            <p style="margin:4px 0">Score: <strong>${p.performanceScore ?? '-'}%</strong></p>
            <p style="margin:4px 0; font-size:0.9em; color:#b2dfdb">Load: ${p.loadTime ?? '-'} ms</p>
            <p style="margin:6px 0"><a href="${p.url}" target="_blank" rel="noopener">Apri pagina</a></p>
          </div>
        `;
        frag.appendChild(col);
      });
      // Replace content atomically
      grid.innerHTML = '';
      grid.appendChild(frag);
    }

    // Disegna grafico performance (se presente e Chart.js caricato)
    const canvas = document.getElementById('performance-trend');
    if (canvas && window.Chart) {
      const ctx = canvas.getContext('2d');
      // prendi al massimo 50 elementi per leggibilità
      const subset = pages.slice().sort((a,b)=>(b.performanceScore||0)-(a.performanceScore||0)).slice(0, 50);
      const labels = subset.map(p => p.label || p.slug || p.url);
      const scores = subset.map(p => p.performanceScore || 0);
      const bg = scores.map(v => v >= 90 ? 'rgba(92,184,92,0.9)' : (v >= 75 ? 'rgba(255,193,7,0.9)' : 'rgba(255,99,71,0.9)'));
      if (window.__performanceChart) {
        try { window.__performanceChart.destroy(); } catch(e) {}
      }
      window.__performanceChart = new Chart(ctx, {
        type: 'bar',
        data: { labels, datasets: [{ label: 'Performance %', data: scores, backgroundColor: bg, borderColor: bg.map(c=>c.replace('0.9','1')), borderWidth: 1 }] },
        options: {
          maintainAspectRatio: false,
          scales: { y: { beginAtZero: true, max: 100, title: { display: true, text: 'Percentuale' } } },
          plugins: { legend: { display: false } }
        }
      });
      canvas.style.height = '320px';
    }

  } catch (err) {
    console.error('renderTechReport error', err);
  }
}

// Aggiorna il report visivo e rinfresca i dati (usata dai bottoni "Aggiorna")
const refreshTechReport = debounce(async () => {
  try {
    const data = await loadAuditData();
    renderTechReport(data);
    // annuncia a screen reader
    const sr = document.getElementById('sr-announcement');
    if (sr) sr.textContent = 'Report aggiornato.';
    // rimuove il messaggio dopo breve tempo
    setTimeout(() => { if (sr) sr.textContent = ''; }, 1200);
  } catch (e) {
    console.warn('refreshTechReport error', e);
  }
}, 800);

// Inizializzazione centrale — esegue il comportamento corretto a seconda della pagina
document.addEventListener('DOMContentLoaded', async () => {
let auditData = null;
  try {
    auditData = await loadAuditData();
  } catch (e) {
    console.warn('reportPerformance: impossibile caricare auditData', e);
  }

  // Determina nome file corrente
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const isTechMaturityPage = currentPath.toLowerCase() === 'tech_maturity.html';
if (isTechMaturityPage) {
    // render aggregato (anche se auditData è null, renderTechReport gestisce il null)
    renderTechReport(auditData);
    // collega i pulsanti di refresh (idempotente)
    document.querySelectorAll('.refresh-btn').forEach(btn => {
      // rimuovi eventuali listener duplicati
      btn.replaceWith(btn.cloneNode(true));
    });
    // ricopriamo con nuovi listener
    document.querySelectorAll('.refresh-btn').forEach(btn => {
      btn.addEventListener('click', refreshTechReport);
    });
    // collega export (se presente) ad esportazione JSON semplice (non ricarica DOM)
    const exportBtn = document.getElementById('export-data-btn');
    if (exportBtn) {
      exportBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        try {
          const data = auditData ?? await loadAuditData();
          const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'performance-latest.json';
          document.body.appendChild(a);
          a.click();
          a.remove();
          URL.revokeObjectURL(url);
        } catch (err) {
          console.error('Errore esportazione JSON', err);
        }
      });
    }
    return; // evita logica per pagina singola
  }

  // Non Tech_Maturity: comportamento per singola pagina (fallback basato sui dati caricati)
  try {
    const homePage = auditData?.pages?.find(p => p.url && p.url.endsWith('index.html'));
    const currentPage = auditData?.pages?.find(p => {
      if (!p.url) return false;
      return p.url.endsWith(currentPath);
    });
    // metric mapping: prefer page then home
    const metricMap = {
      performance: currentPage?.performanceScore ?? homePage?.performanceScore ?? 85,
      'performance-desktop': Math.min((currentPage?.performanceScore ?? homePage?.performanceScore ?? 90) + 5, 100),
      accessibility: currentPage?.accessibilityScore ?? homePage?.accessibilityScore ?? 88,
      seo: currentPage?.seoScore ?? homePage?.seoScore ?? 90,
      'best-practices': currentPage?.bestPracticesScore ?? homePage?.bestPracticesScore ?? 85
    };
 // Aggiorna i cerchi (se presenti)
    document.querySelectorAll('.progress-circle').forEach(circle => {
      const metric = circle.dataset.metric;
 const value = metricMap[metric] ?? 75;
      const roundedValue = Math.round(value);
circle.style.setProperty('--value', `${roundedValue}%`);
      circle.dataset.value = roundedValue;
      circle.setAttribute('aria-valuenow', roundedValue);
    });
// Aggiorna last-updated se possibile
    const lastUpdatedEl = document.getElementById('last-updated');
    if (lastUpdatedEl && auditData?.lastUpdated) {
      lastUpdatedEl.textContent = (new Date(auditData.lastUpdated)).toLocaleString();
    }
  } catch (err) {
    // fallback silenzioso
    console.warn('reportPerformance per pagina singola: errore', err);
  }
});   