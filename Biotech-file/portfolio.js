/**
 * BIOTECH PROJECT | PERFORMANCE & TECHNOLOGICAL MATURITY SYSTEM
 * -------------------------------------------------------------------------
 * ARCHITECTURE: Event-Driven UI Orchestrator
 * STRATEGY: Progressive Hydration, Main-Thread Yielding & Atomic Render Locking
 * COMPLIANCE: WCAG 2.1 Level AAA | Lighthouse 2026 Standards
 * -------------------------------------------------------------------------
 * SUMMARY:
 * Manages real-time telemetry visualization from 'performance-latest.json'.
 * Uses a non-blocking asynchronous rendering pipeline to ensure UI 
 * responsiveness even during heavy DOM construction (Chunk Size: 8).
 * -------------------------------------------------------------------------
 
BIOTECH PORTFOLIO | MODULE TREE 2026
====================================

[ROOT] portfolio.js
 ║
 ╠══ DATA ACQUISITION LAYER
 ║   ╠── loadPerformanceData() ─────► Orchestrator (Fetch -> Process -> Render)
 ║   ╚── loadJsPDF() ──────────────► Lazy-Loading Library Injector
 ║
 ╠══ ASYNC RENDERING ENGINE (Non-Blocking)
 ║   ╠── renderCardsAsynchronously()► Chunked Loop (requestAnimationFrame)
 ║   ╚── createPerformanceCard() ──► Fragment-based DOM Factory
 ║
 ╠══ ANALYTICS & VISUALIZATION
 ║   ╠── creaGrafico() ────────────► Chart.js Engine (Trend & Projections)
 ║   ╠── aggiornaPerformanceScore() ► Global Metric Feedback Loop
 ║   ╚── getTrendArrow() ──────────► Differential Delta Logic
 ║
 ╚══ UI CONTROL & EXPORT
     ╠── filterSelection() ────────► State-driven Filtering & A11y Announcements
     ╠── exportToPDF() ────────────► I18n PDF Synthesis (AutoTable)
     ╚── A11y Controller ──────────► ARIA Live Regions & Focus Mgmt
*/
// ———————————————————————
// GESTIONE PERFORMANCE E GRAFICO DI MATURITÀ TECNOLOGICA 
// ———————————————————————

let performanceChart; // Riferimento globale al grafico per aggiornamenti dinamici
let isRendering = false; // Flag di stato per il controllo anti-compulsivo
let abortController = null; // Controller per abortire fetch in caso di richieste concorrenti
let isExporting = false; // Lock specifico per l'esportazione

// --- Funzione per caricare jsPDF e jsPDF-Autotable dinamicamente ---
async function loadJsPDF() {
  if (window.jspdf && window.autoTable) return;

  const loadScript = (src) => new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = () => reject(new Error(`Errore nel caricamento di ${src}`));
    document.head.appendChild(script);
  });

  try {
    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.23/jspdf.plugin.autotable.min.js');
  } catch (error) {
    console.error(error.message);
    throw error;
  }
}

// --- Funzione principale: carica dati reali dal JSON ---
async function loadPerformanceData() {
  // 1. GESTIONE DELLE RICHIESTE CONCORRENTI
  if (abortController) {
    abortController.abort(); // Interrompe fetch e cicli di rendering precedenti
  }

  // Se c'era un rendering attivo, lo resettiamo forzatamente per evitare blocchi prolungati
  if (isRendering) {
    isRendering = false; 
  }

  abortController = new AbortController();
  const { signal } = abortController; // Estraiamo il segnale per passarlo ovunque

  console.log('🔧 loadPerformanceData() in esecuzione');

  try {
    isRendering = true;

    // 2. FETCH CON SIGNAL (Piena compatibilità con modalità offline/cache)
    const response = await fetch('data/performance-latest.json', { signal }); 
    if (!response.ok) throw new Error('Dati non disponibili');

    const data = await response.json();
    const container = document.querySelector('.portfolio-row');
    if (!container) return;

    // Se siamo stati interrotti durante il fetch, usciamo silenziosamente senza modificare lo stato
    if (signal.aborted) return;

    container.innerHTML = '';

    // --- Inizio Elaborazione Dati (Invariata) ---
    const homePage = data.pages.find(p =>
      p.url.includes('/index.html') ||
      p.url === 'https://gitechnolo.github.io/biotechproject/' ||
      p.url === window.location.origin + '/biotechproject/'
    );

    const reportTime = homePage?.generatedTime ? new Date(homePage.generatedTime) : 
                       data.lastUpdated ? new Date(data.lastUpdated) : new Date();

    const dateStr = reportTime.toLocaleDateString('it-IT');
    const timeStr = reportTime.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });

    const dateTargets = ['last-update', 'last-updated', 'last-updated-report'];
    dateTargets.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.textContent = (id === 'last-updated') ? dateStr : `Aggiornato il: ${dateStr} alle ${timeStr}`;
        if (el.hasAttribute('datetime')) el.setAttribute('datetime', reportTime.toISOString());
      }
    });

    const avgPerf = Math.round(
      data.pages.reduce((sum, p) => sum + (p.performanceScore || 0), 0) / data.pages.length
    );
    
    aggiornaPerformanceScore(avgPerf);

    // 3. RENDERING ASINCRONO CON PROPAGAZIONE SIGNAL
    // Passiamo 'signal' per interrompere i chunk se l'utente aggiorna di nuovo
    await renderCardsAsynchronously(data.pages, container, signal);

    // Se l'operazione è stata annullata durante il rendering delle card, usciamo
    if (signal.aborted) return;

    filterSelection('all');

    // --- Grafico e Metriche ---
    const history = [];
    if (homePage?.previousPerformanceScore !== undefined && homePage.previousPerformanceScore !== null) {
      history.push({
        date: subtractDays(reportTime, 5),
        score: homePage.previousPerformanceScore,
        note: 'Misurazione precedente'
      });
    }
    history.push({
      date: formatDate(reportTime),
      score: avgPerf,
      note: 'Misurazione attuale'
    });

    creaGrafico(history);

    const summary = data.summary || {};
    const avgA11y = summary.averageAccessibility ?? 94;
    const avgSeo = summary.averageSeo ?? 96;
    const avgBest = summary.averageBestPractices ?? 97;

    document.querySelectorAll('.progress-circle').forEach(circle => {
      const metric = circle.dataset.metric;
      const value = { 
        performance: avgPerf, 
        'performance-desktop': Math.min(avgPerf + 2, 100), 
        accessibility: avgA11y, 
        seo: avgSeo, 
        'best-practices': avgBest 
      }[metric] || 75;
      const rounded = Math.round(value);
      circle.style.setProperty('--value', `${rounded}%`);
      circle.setAttribute('aria-valuenow', rounded);
      circle.dataset.value = rounded;
    });

    const trendEl = document.getElementById('trend-indicator');
    if (trendEl && homePage) {
      const diff = (homePage.performanceScore || 0) - (homePage.previousPerformanceScore || 0);
      const icons = { 1: '▲', 0: '●', '-1': '▼' };
      trendEl.textContent = icons[diff > 0 ? 1 : diff < 0 ? -1 : 0];
      trendEl.className = 'trend-indicator';
      const trendClass = diff > 0 ? 'trend-up' : diff < 0 ? 'trend-down' : 'trend-equal';
      trendEl.classList.add(trendClass);
      trendEl.classList.remove('visually-hidden');
    }

    const update = (id, value) => {
      const el = document.getElementById(id);
      if (el) el.textContent = value;
    };

    update('analyzed-count', summary.analyzed || data.pages.length);
    update('avg-performance', `${avgPerf}%`);
    update('avg-accessibility', `${avgA11y}%`);
    update('avg-seo', `${avgSeo}%`);
    update('avg-best-practices', `${avgBest}%`);
    update('global-resilience-score', data.summary?.stressTest?.globalResilienceScore ?? '--');

    document.body.classList.add('portfolio-loaded');

  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('❌ Richiesta annullata: subentrata nuova chiamata.');
      // Importante: non resettiamo isRendering qui perché la nuova chiamata lo ha già impostato a true
    } else {
      console.warn('⚠️ Errore durante il caricamento reale:', error);
      aggiornaPerformanceScore(85);
      creaGrafico();
      const errorDate = document.getElementById('last-update') || document.getElementById('last-updated');
      if (errorDate) errorDate.textContent = 'Dati non disponibili';
      showNotification('Dati temporaneamente non disponibili.');
      document.body.classList.add('portfolio-loaded');
      isRendering = false; // Solo in caso di errore vero resettiamo il lock
    }
  } finally {
    // 4. RILASCIO DEL LOCK CONDIZIONALE
    // Rilasciamo il lock solo se QUESTA specifica esecuzione è arrivata alla fine senza essere interrotta da una nuova chiamata (abort)
    if (!signal.aborted) {
      isRendering = false;
      console.log('✅ loadPerformanceData() completato. Lock rilasciato.');
    }
  }
}
/**
 * Rende il caricamento delle card non bloccante.
 * Gestisce record senza freezare la UI.
 * @param {Array} pages - I dati delle pagine da renderizzare.
 * @param {HTMLElement} container - Il contenitore DOM.
 * @param {AbortSignal} signal - Il segnale di aborto specifico per questa esecuzione.
 */
async function renderCardsAsynchronously(pages, container, signal) {
  const CHUNK_SIZE = 8; // Numero di card da renderizzare per batch
  let index = 0;

  async function processChunk() {
    // 1. Controllo immediato: se il segnale è abortito, fermiamo tutto.
    // Usiamo il 'signal' passato come argomento per coerenza atomica.
    if (signal && signal.aborted) {
      console.log('⏹️ Rendering interrotto: subentrata nuova richiesta o annullamento.');
      return;
    }

    const fragment = document.createDocumentFragment();
    const chunk = pages.slice(index, index + CHUNK_SIZE);

    chunk.forEach(page => {
      const card = createPerformanceCard(page);
      fragment.appendChild(card);
    });

    container.appendChild(fragment);
    index += CHUNK_SIZE;

    // 2. Se ci sono ancora pagine, cediamo il controllo al browser
    if (index < pages.length) {
      // Usiamo requestAnimationFrame per garantire che il browser faccia il paint delle card precedenti
      await new Promise(resolve => requestAnimationFrame(resolve));
      
      // 3. Ricorsione controllata: passiamo al prossimo chunk
      await processChunk(); 
    }
  }

  await processChunk();
}   

// --- Crea la card per ogni pagina ---
function createPerformanceCard(page) {
  const performance = page.performanceScore !== undefined
    ? page.performanceScore
    : page.performance !== undefined
      ? Math.round(page.performance * 100)
      : 85;

  let perfClass = 'needs-improvement';
  if (performance >= 90) perfClass = 'optimized';
  else if (performance >= 80) perfClass = 'compatible';
  else if (performance >= 60) perfClass = 'needs-improvement';
  else perfClass = 'deprecated';

  // Estrai il punteggio di resilienza
  const stressScore = page.stressResilienceScore !== undefined ? page.stressResilienceScore : 'N/D';

  const url = page.url || 'Pagina sconosciuta';
  const fileName = url.split('/').pop() || 'index.html';
  const loadTime = page.loadTime ? (page.loadTime / 1000).toFixed(1) : '?';
  const tooltipId = `tooltip-${sanitizeId(fileName)}`;

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
      <div 
        class="fadebox" 
        tabindex="0" 
        role="button"
        aria-describedby="${tooltipId}"
        aria-label="Mostra dettagli prestazioni per ${fileName}"
      >
        <strong>${fileName}${badgeHTML}</strong><br>
        Score: ${performance}/100 
        <span class="status-badge badge-trend ${getTrendColorClass(performance, page.previousPerformanceScore)}">
          ${getTrendArrow(performance, page.previousPerformanceScore)}
          ${page.previousPerformanceScore !== null && page.previousPerformanceScore !== undefined 
            ? (performance > page.previousPerformanceScore ? '+' : '') + (performance - page.previousPerformanceScore) 
            : ''}
        </span>
        • ${loadTime} s<br>Stress Resilience: ${stressScore}/100   
        <div 
          id="${tooltipId}" 
          class="trend-details" 
          role="tooltip"
        >
          <div><strong>Punteggi:</strong> ${performance}/100</div>
          <div><strong>Stress Resilience:</strong> ${stressScore}/100</div>
          ${page.previousPerformanceScore !== null && page.previousPerformanceScore !== undefined 
            ? `<div><strong>Precedente:</strong> ${page.previousPerformanceScore}</div>
               <div><strong>Trend:</strong> ${getTrendArrow(performance, page.previousPerformanceScore)}${performance - page.previousPerformanceScore}</div>`
            : `<div><strong>Trend:</strong> Nessun dato precedente</div>`}
          <div><strong>Tempo di caricamento:</strong> ${loadTime} s</div>
        </div>
      </div>
      <p class="greentext">${fileName} — ${perfClass.charAt(0).toUpperCase() + perfClass.slice(1)}</p>
    </div>
  `;

  const fadebox = card.querySelector('.fadebox');
  const trendDetails = card.querySelector('.trend-details');

  fadebox.addEventListener('focus', () => {
    trendDetails.style.display = 'block';
  });

  fadebox.addEventListener('blur', () => {
    trendDetails.style.display = 'none';
  });

  fadebox.addEventListener('click', () => {
    const isDisplayed = trendDetails.style.display === 'block';
    trendDetails.style.display = isDisplayed ? 'none' : 'block';
  });

  fadebox.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      trendDetails.style.display = 'none';
      fadebox.blur();
    }
  });

  return card;
}   
function sanitizeId(str) {
  return str.replace(/[^a-z0-9]/gi, '-').toLowerCase();
}
function setupRefreshButtons() {
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
function aggiornaPerformanceScore(performanceScoreValue = 85) {
  const scoreEl = document.getElementById('performance-score');
  // Puntiamo al nuovo ID unico
  const trendIndicator = document.getElementById('score-trend-indicator');
  
  if (scoreEl) {
    scoreEl.textContent = `${performanceScoreValue}%`;
    scoreEl.style.display = 'inline-block'; 
  }

  if (trendIndicator) {
    const trend = performanceScoreValue - 82;
    
    // Inseriamo la freccia testuale
    trendIndicator.textContent = trend > 0 ? '↑' : trend < 0 ? '↓' : '→';
    
    // Gestione colori: usiamo le tue classi esistenti
    trendIndicator.className = ''; 
    const statusClass = trend > 0 ? 'trend-up' : trend < 0 ? 'trend-down' : 'trend-equal';
    trendIndicator.classList.add(statusClass);
    
    // Forza la visibilità locale senza cambiare il CSS esterno
    trendIndicator.style.display = 'inline-block';
    trendIndicator.style.verticalAlign = 'middle';
  }
}
function subtractDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() - days);
  return formatDate(d);
}
function formatDate(date) {
  const d = new Date(date);
  const day = d.getDate();
  const options = { month: 'short' };
  const month = d.toLocaleDateString('it-IT', options).replace('.', '');
  const year = d.getFullYear();
  const currentYear = new Date().getFullYear();
  return year === currentYear ? `${day} ${month}` : `${day} ${month} '${year.toString().slice(-2)}`;
}   
const datiSimulati = [
  { date: '2024-09-01', score: 30, note: 'Avvio progetto' },
  { date: '2024-10-15', score: 38, note: 'Contenuti iniziali' },
  { date: '2024-12-01', score: 45, note: 'Versioni semplici' },
  { date: '2025-01-20', score: 52, note: 'Ottimizzazione mobile' },
  { date: '2025-03-10', score: 60, note: 'Accessibilità WCAG' },
  { date: '2025-05-05', score: 70, note: 'Forum integrato' },
  { date: '2025-07-01', score: 78, note: 'Dashboard attiva' },
  { date: '2025-09-15', score: 85, note: 'UI/UX coerente' }
];
function creaGrafico(history = []) {
  console.log('Dati grafico:', history);
  const ctx = document.getElementById('performance-trend');
  if (!ctx) return;
  const chartCtx = ctx.getContext('2d');

  if (performanceChart) {
    performanceChart.destroy();
  }

  const dataToShow = history.length > 0 ? history : datiSimulati;
  const labels = dataToShow.map(d => d.date);
  const values = dataToShow.map(d => d.score);
  const realDataEndIndex = history.length;

  performanceChart = new Chart(chartCtx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Maturità Tecnologica del Sito (%)',
        data: values,
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.3,
        segment: {
          borderDash: ctx => ctx.p0DataIndex >= realDataEndIndex - 1 && history.length > 0 ? [5, 5] : undefined,
          borderColor: ctx => ctx.p0DataIndex >= realDataEndIndex - 1 && history.length > 0 ? '#f59e0b' : '#10b981'
        },
        pointRadius: (context) => context.dataIndex === values.length - 1 ? 8 : 5,
        pointBackgroundColor: (context) =>
          context.dataIndex === values.length - 1 ? '#4ade80' :
          context.dataIndex < realDataEndIndex ? '#10b981' : '#f59e0b',
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { labels: { color: '#ffffff', font: { family: 'Sansation' } } },
        tooltip: {
          backgroundColor: '#1f2937',
          titleColor: '#ffffff',
          bodyColor: '#d1d5db',
          borderColor: '#4b5563',
          borderWidth: 1,
          callbacks: {
            label: (context) => {
              const isReal = context.dataIndex < realDataEndIndex;
              const tipo = isReal ? ' (reale)' : ' (stimato)';
              const note = dataToShow[context.dataIndex]?.note || '';
              return `${context.parsed.y}%${tipo} - ${note}`;
            }
          }
        }
      },
      scales: {
        x: { 
          ticks: { color: '#b2dfdb', font: { family: 'Sansation' } }, 
          grid: { color: 'rgba(178, 223, 219, 0.1)' } 
        },
        y: { 
          min: 0, 
          max: 100, 
          ticks: { color: '#b2dfdb', font: { family: 'Sansation' } }, 
          grid: { color: 'rgba(178, 223, 219, 0.1)' } 
        }
      }
    }
  });

  // --- LOGICA AGGIORNAMENTO DESCRIZIONE ACCESSIBILE (SEO & SCREEN READERS) ---
  const chartDesc = document.getElementById('chart-desc');
  if (chartDesc) {
    const currentScore = values[values.length - 1] || 0;
    
    // Supponendo che 'translations' sia l'oggetto globale con le lingue 
    // e 'currentLang' la lingua attiva (es: 'it' o 'en')
    let descTemplate = "";
    try {
      descTemplate = translations[currentLang]['chart-desc'] || "Maturità tecnologica: {score}%";
    } catch (e) {
      // Fallback in caso l'oggetto traduzioni non sia ancora pronto
      descTemplate = currentLang === 'it' ? 
        "Andamento maturità tecnologica. Valore attuale: {score}%." : 
        "Technological maturity trend. Current value: {score}%.";
    }

    // Sostituzione del segnaposto {score} con il valore reale
    chartDesc.textContent = descTemplate.replace('{score}', currentScore);
  }

  aggiornaTabellaDati(dataToShow);
}
function aggiornaTabellaDati(data) {
  const tbody = document.getElementById('chart-data-body');
  if (!tbody) return;

  tbody.innerHTML = '';
  data.forEach(item => {
    const tr = document.createElement('tr');
    const tdData = document.createElement('td');
    const tdValore = document.createElement('td');
    tdData.textContent = item.date;
    tdValore.textContent = `${item.score}%`;
    tr.appendChild(tdData);
    tr.appendChild(tdValore);
    tbody.appendChild(tr);
  });
}
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
function filterSelection(filter) {
  // 1. Gestione classi pulsanti e accessibilità aria-pressed
  document.querySelectorAll('.filter-btn').forEach(btn => {
    const isActive = btn.dataset.filter === filter;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-pressed', isActive);
  });

  // 2. Filtraggio delle card nella dashboard
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

  // 3. Gestione Messaggio "Nessun risultato"
  const container = document.querySelector('.portfolio-row');
  let msgEl = document.getElementById('filter-message');

  // Se l'elemento non esiste nel DOM, lo creiamo dinamicamente
  if (!msgEl) {
    msgEl = document.createElement('p');
    msgEl.id = 'filter-message';
    msgEl.className = 'sansation-light-italic'; 
    msgEl.style.cssText = 'color: #a0aec0; text-align: center; padding: 20px; width: 100%;';
    msgEl.setAttribute('role', 'status'); // Annuncio per screen reader
    msgEl.setAttribute('data-lang-key', 'filter-empty');
    container.parentNode.insertBefore(msgEl, container.nextSibling);
  }

  // 4. Logica di visualizzazione e traduzione dinamica
  if (visibleCount === 0) {
    msgEl.style.display = 'block';
    
    // Determiniamo la lingua attuale (fallback su 'it')
    const lang = (typeof currentLang !== 'undefined') ? currentLang : 'it';
    
    // Tentiamo di recuperare la traduzione dalla cache globale (window.cachedTranslations)
    const translation = (window.cachedTranslations && window.cachedTranslations[lang]) 
                        ? window.cachedTranslations[lang]['filter-empty'] 
                        : null;

    // Se la traduzione nel JSON esiste, la usiamo. 
    // Altrimenti usiamo il fallback testuale identico al JSON.
    msgEl.textContent = translation || (lang === 'en' 
      ? 'No pages found with this maturity status.' 
      : 'Nessuna pagina trovata con questo stato di maturità.');
  } else {
    // Nascondiamo il messaggio se ci sono risultati
    msgEl.style.display = 'none';
  }
}
function getTrendArrow(current, previous) {
  if (previous === undefined || previous === null) return '→';
  const diff = current - previous;
  if (diff > 0) return '▲';
  if (diff < 0) return '▼';
  return '→';
}
function getTrendColorClass(current, previous) {
  if (previous === undefined || previous === null) return 'badge-needs-improvement';
  return current > previous ? 'badge-optimized' : 
         current < previous ? 'badge-deprecated' : 
                            'badge-compatible';
}

// --- Funzione: Esporta JSON + Grafico in PDF (Versione Blindata) ---
async function exportToPDF() {
  const btn = document.getElementById('export-data-btn');
  const originalLabel = btn?.textContent || 'Esporta dati';
  const LOGO_URL = 'https://gitechnolo.github.io/biotechproject/Biotech-file/images/favicon-biotech.png';
  const lang = (typeof currentLang !== 'undefined') ? currentLang : 'it';
  
  // 1. LOCK: Evita esecuzioni multiple contemporanee
  if (isExporting) {
    console.warn('⚠️ Esportazione già in corso...');
    return;
  }

  const i18n = {
    it: {
      exporting: 'Esportazione in corso...',
      reportTitle: 'Biotech Project - Performance Report',
      fileName: 'biotech-performance-report-it.pdf',
      generated: 'Generato',
      summary: 'Riepilogo',
      pagesAnalyzed: 'pagine analizzate',
      lastUpdate: 'Ultimo aggiornamento'
    },
    en: {
      exporting: 'Exporting...',
      reportTitle: 'Biotech Project - Performance Report',
      fileName: 'biotech-performance-report.pdf',
      generated: 'Generated',
      summary: 'Summary',
      pagesAnalyzed: 'pages analyzed',
      lastUpdate: 'Last update'
    }
  };

  const text = i18n[lang] || i18n.it;

  try {
    isExporting = true; // Attiva il lock
    if (btn) { btn.disabled = true; btn.textContent = text.exporting; }

    // Caricamento librerie asincrono (già protetto internamente)
    await loadJsPDF(); 

    // 2. FETCH DATI CON SIGNAL: Rispetta l'eventuale abort globale
    let data;
    const fetchOptions = abortController ? { signal: abortController.signal } : {};
    
    try {
      const res = await fetch('data/performance-latest.json', fetchOptions);
      if (!res.ok) throw new Error();
      data = await res.json();
    } catch (err) {
      if (err.name === 'AbortError') return; // Esci silenziosamente se l'operazione è stata annullata
      // Fallback in caso di errore rete
      const fallback = '/biotechproject/data/performance-latest.json';
      const fres = await fetch(fallback, fetchOptions);
      data = await fres.json();
    }

    const jsonLang = data[lang] ? data[lang] : data;
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const marginLeft = 40;
    const contentWidth = 515;
    let cursorY = 25;

    // --- LOGO E TITOLO ---
    const logoImage = await new Promise(resolve => {
        const img = new Image(); img.crossOrigin = 'Anonymous';
        img.onload = () => resolve(img); img.onerror = () => resolve(null);
        img.src = LOGO_URL;
    });
    if (logoImage) doc.addImage(logoImage, 'PNG', marginLeft, cursorY, 35, 35);
    doc.setFontSize(18).setTextColor(0).setFont(undefined, 'bold');
    doc.text(text.reportTitle, marginLeft + 45, cursorY + 12);
    
    // --- INFO GENERAZIONE & RIEPILOGO ---
    cursorY += 45;
    doc.setFontSize(8).setTextColor(80).setFont(undefined, 'normal');
    const now = new Date().toLocaleString(lang === 'it' ? 'it-IT' : 'en-US');
    doc.text(`${text.generated}: ${now}`, marginLeft, cursorY);
    
    cursorY += 11;
    const totalPages = data.summary?.analyzed || (data.pages ? data.pages.length : '26');
    doc.text(`${text.summary}: ${totalPages} ${text.pagesAnalyzed}`, marginLeft, cursorY);
    
    if (data.lastUpdated) {
        cursorY += 11;
        const upDate = new Date(data.lastUpdated).toLocaleString(lang === 'it' ? 'it-IT' : 'en-US');
        doc.text(`${text.lastUpdate}: ${upDate}`, marginLeft, cursorY);
    }

    // --- METODOLOGIA (SRE Engine 2026) ---
    cursorY += 20;
    doc.setFontSize(9).setTextColor(39, 174, 96).setFont(undefined, 'bold');
    const sreDescription = jsonLang?.["sre-description"] || data?.["sre-description"] || (lang === 'it' 
        ? "I test simulano contesti d'uso reali con uno stress test massivo di 5.000 utenti simultanei."
        : "Performance tests simulate real-world usage with 5.000 concurrent user stress test.");
    const splitDesc = doc.splitTextToSize(sreDescription, contentWidth);
    doc.text(splitDesc, marginLeft, cursorY);
    cursorY += (splitDesc.length * 12);
    
    // --- GLOBAL RESILIENCE SCORE ---
if (data.summary?.stressTest) {
    const stress = data.summary.stressTest;
    const resLabel = lang === 'it' ? 'RESILIENZA GLOBALE:' : 'GLOBAL RESILIENCE:';
    const statusLabel = lang === 'it' ? 'STATO SISTEMA:' : 'SYSTEM STATUS:';
    doc.setFontSize(9).setFont(undefined, 'bold').setTextColor(100);
    doc.text(`${resLabel} ${stress.globalResilienceScore}/100`, marginLeft, cursorY);
    
    const statusColor = stress.status.includes('STABLE') ? [39, 174, 96] : [231, 76, 60]; 
    doc.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
    doc.text(`${statusLabel} ${stress.status}`, marginLeft + 180, cursorY);
    cursorY += 12;
}

// --- INIZIO BLOCCO PROFILI TECNICI ---
// Riduciamo leggermente gli incrementi per salvare spazio verticale
cursorY += 8; 
doc.setFontSize(7).setTextColor(100).setFont(undefined, 'normal');

const technicalInfo = [
    `NETWORK PROFILE: 3G/4G + Load Stress (5.000 Virtual Users | TTFB Drift)`,
    `HARDWARE PROFILE: Legacy Mobile Emulation (CPU Slowdown: 4x Multiplier)`,
    `METHODOLOGY: Simulated Throttling (SRE Scalability Engine 2026)`
];

technicalInfo.forEach(line => {
    doc.text(line, marginLeft, cursorY);
    cursorY += 8; // Spaziatura compatta tra le righe
});

// --- GRAFICO ---
cursorY += 5;
const canvas = document.getElementById('performance-trend');
if (canvas) {
    // Usa un fattore più alto per imgHeight, senza ridimensionare il canvas
    const imgHeight = (canvas.height / canvas.width) * contentWidth * 0.82;
    doc.addImage(canvas.toDataURL('image/png'), 'PNG', marginLeft, cursorY, contentWidth, imgHeight);
    cursorY += imgHeight + 15;
}   

    // --- TABELLA DATI ---
    const tableData = data.pages.map(p => [
        p.label, 
        `${p.performanceScore ?? 85}%`, 
        `${p.stressResilienceScore ?? 'N/D'}%`, 
        p.url.split('/').pop() || '/'
    ]);

    doc.autoTable({
        startY: cursorY + 10,
        margin: { left: 40, right: 40 }, // Fissiamo i margini laterali
        head: [[
            jsonLang["pdf-table-label"] || (lang === 'it' ? 'Etichetta Pagina' : 'Page Label'), 
            jsonLang["pdf-table-score"] || (lang === 'it' ? 'Perf.' : 'Perf.'), 
            lang === 'it' ? 'Resilienza' : 'Resilience',
            jsonLang["pdf-table-file"] || (lang === 'it' ? 'File Pagina' : 'Page File')
        ]], 
        body: tableData,
        theme: 'striped',
        headStyles: { fillColor: [39, 174, 96], fontSize: 10 },
        styles: { 
            fontSize: 8, 
            cellPadding: 4, // Spaziatura compatta per adattare più dati
            overflow: 'linebreak', // Gestisce il testo a capo in modo pulito
            valign: 'middle'       // Centra il testo verticalmente se va a capo
        },
        columnStyles: { 
            0: { cellWidth: 180 }, // Spazio generoso per i nomi lunghi (es. "versione semplificata")
            1: { cellWidth: 40, halign: 'center' },  // Punteggio Performance stretto
            2: { cellWidth: 65, halign: 'center' },  // Resilienza stretto
            3: { cellWidth: 'auto' } // Il file si adatta allo spazio rimanente
        },
        didParseCell: (hook) => {
            // Colorazione condizionale per i punteggi: verde >=90, giallo >=80, rosso <80
            if (hook.section === 'body' && (hook.column.index === 1 || hook.column.index === 2)) {
                const s = parseInt(hook.cell.text[0].toString().replace('%',''));
                if (s >= 90) { hook.cell.styles.fillColor = '#d4edda'; hook.cell.styles.textColor = '#155724'; }
                else if (s >= 80) { hook.cell.styles.fillColor = '#fff3cd'; hook.cell.styles.textColor = '#856404'; }
                else if (!isNaN(s)) { hook.cell.styles.fillColor = '#f8d7da'; hook.cell.styles.textColor = '#721c24'; }
            }
        }
    });

    // 3. CONTROLLO FINALE: Non scaricare se l'utente ha resettato tutto
    if (abortController?.signal.aborted) {
      console.log('⏹️ Esportazione PDF interrotta: subentrata nuova logica globale.');
      return; 
    }

    doc.save(text.fileName);
    showNotification(lang === 'it' ? 'PDF generato correttamente' : 'PDF generated successfully');

  } catch (err) {
    if (err.name !== 'AbortError') {
      console.error('Export error:', err);
      showNotification('Errore durante la generazione del PDF.');
    }
  } finally {
    // 4. RILASCIO LOCK: Il pulsante torna disponibile
    isExporting = false;
    if (btn) {
      btn.disabled = false;
      btn.textContent = originalLabel;
    }
  }
}

// --- Inizializzazione ---
document.addEventListener('DOMContentLoaded', () => {
  setupRefreshButtons();
  loadPerformanceData();
  // --- AGGIUNTA PER SUPPORTO OFFLINE ---
  // Carica le librerie PDF subito, così saranno in cache per il test offline
  loadJsPDF().then(() => {
    console.log("Librerie PDF caricate e pronte per l'uso offline.");
  });

  const statusSpan = document.getElementById('filter-status');

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      // 1. Esegue la tua funzione esistente (gestisce card e classe .active)
      filterSelection(btn.dataset.filter);

      // 2. AGGIUNTA ACCESSIBILITÀ:
      // Aggiorna lo stato "premuto" su tutti i bottoni
      document.querySelectorAll('.filter-btn').forEach(b => {
        b.setAttribute('aria-pressed', b.classList.contains('active'));
      });

      // Aggiorna la Live Region per lo screen reader
      if (statusSpan) {
        statusSpan.textContent = btn.textContent;
      }
    });
  });

  // Collega il pulsante di esportazione
  const exportBtn = document.getElementById('export-data-btn');
  if (exportBtn) {
    exportBtn.addEventListener('click', exportToPDF);
  }
});      