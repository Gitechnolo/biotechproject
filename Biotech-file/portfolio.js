// Biotech-file/portfolio.js
// ———————————————————————
// GESTIONE PERFORMANCE E GRAFICO DI MATURITÀ TECNOLOGICA 
// ———————————————————————

// 1. Registrazione del Service Worker (Il Guardiano)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Funziona sia in locale (test) che su GitHub Pages
        const swPath = window.location.pathname.startsWith('/biotechproject/') 
               ? '/biotechproject/sw.js' 
               : './sw.js';

        navigator.serviceWorker.register(swPath)
            .then(reg => console.log('🛡️ Biotech Guardiano attivo: ' + reg.scope))
            .catch(err => console.warn('⚠️ Errore registrazione SW:', err));
    });
}

let performanceChart;

// --- Funzione per caricare jsPDF e jsPDF-Autotable dinamicamente (Logica originale) ---
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

// --- Funzione principale: Carica dati (Online/Offline) con soglia 24h ---
async function loadPerformanceData() {
  console.log('🔧 loadPerformanceData() in esecuzione (Resilient Mode)');
  
  const CACHE_KEY = 'biotech_perf_backup';
  const SCADENZA_MS = 24 * 60 * 60 * 1000; // 24 ore
  let data = null;

  try {
    // 1. Tenta il recupero dalla rete (intercettato dal Service Worker se offline)
    const response = await fetch('data/performance-latest.json');
    if (!response.ok) throw new Error('Rete non disponibile');

    data = await response.json();
    
    // SINCRONIZZAZIONE: Aggiungiamo timestamp e salviamo nel LocalStorage
    data.syncTimestamp = Date.now();
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
    console.log('📡 Dati sincronizzati con successo dal server.');

  } catch (error) {
    console.warn('⚠️ Errore rete o Offline. Controllo ponte locale...');
    
    // 2. FALLBACK: Recupero dal LocalStorage
    const savedData = localStorage.getItem(CACHE_KEY);
    if (savedData) {
      data = JSON.parse(savedData);
      
      // Controllo freschezza dati
      const tempoTrascorso = Date.now() - (data.syncTimestamp || 0);
      if (tempoTrascorso > SCADENZA_MS) {
        showNotification('⚠️ Dati visualizzati datati (più di 24h).');
        document.getElementById('last-update')?.classList.add('data-stale');
      } else {
        showNotification('Modo Offline: Caricamento da cache locale.');
      }
    }
  }

  // Se non abbiamo dati (né rete né cache), fallback estremo ai valori statici
  if (!data) {
    aggiornaPerformanceScore(85);
    creaGrafico();
    const lastUpdate = document.getElementById('last-update');
    if (lastUpdate) lastUpdate.textContent = 'Dati non disponibili';
    document.body.classList.add('portfolio-loaded');
    return;
  }

  // --- RENDERING DEI DATI (Logica Originale Ottimizzata) ---
  const container = document.querySelector('.portfolio-row');
  if (!container) return;
  container.innerHTML = '';

  const homePage = data.pages.find(p =>
    p.url.includes('/index.html') ||
    p.url === 'https://gitechnolo.github.io/biotechproject/' ||
    p.url === window.location.origin + '/biotechproject/'
  );

  // Calcolo tempo del report
  const reportTime = homePage?.generatedTime ? new Date(homePage.generatedTime) : new Date(data.syncTimestamp || Date.now());

  const lastUpdate = document.getElementById('last-update');
  if (lastUpdate) {
    const dateStr = reportTime.toLocaleDateString('it-IT');
    const timeStr = reportTime.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
    lastUpdate.textContent = `Aggiornato il: ${dateStr} alle ${timeStr}`;
  }

  const avgPerf = Math.round(data.pages.reduce((sum, p) => sum + (p.performanceScore || 0), 0) / data.pages.length);
  aggiornaPerformanceScore(avgPerf);

  // Inserimento DOM tramite DocumentFragment
  const fragment = document.createDocumentFragment();
  data.pages.forEach(page => {
    const card = createPerformanceCard(page);
    fragment.appendChild(card);
  });
  container.appendChild(fragment);

  filterSelection('all');

  // Gestione Storico e Grafico
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

  // Aggiornamento Cerchi di Progresso
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

  // Aggiornamento etichette riepilogo
  const update = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  };

  update('analyzed-count', summary.analyzed || data.pages.length);
  update('avg-performance', `${avgPerf}%`);
  update('avg-accessibility', `${avgA11y}%`);
  update('avg-seo', `${avgSeo}%`);
  update('avg-best-practices', `${avgBest}%`);

  // Gestione Trend
  const trendEl = document.getElementById('trend-indicator');
  if (trendEl && homePage) {
    const diff = (homePage.performanceScore || 0) - (homePage.previousPerformanceScore || 0);
    const icons = { 1: '▲', 0: '●', '-1': '▼' };
    trendEl.textContent = icons[diff > 0 ? 1 : diff < 0 ? -1 : 0];
    trendEl.classList.remove('trend-up', 'trend-down', 'trend-equal');
    const trendClass = diff > 0 ? 'trend-up' : diff < 0 ? 'trend-down' : 'trend-equal';
    trendEl.classList.add(trendClass);
    trendEl.classList.remove('visually-hidden');
  }

  if (data.lastUpdated) {
    const date = new Date(data.lastUpdated);
    update('last-updated-report', date.toLocaleDateString('it-IT'));
    document.getElementById('last-updated-report')?.setAttribute('datetime', date.toISOString());
  }

  // Attivazione animazioni CSS
  document.body.classList.add('portfolio-loaded');
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
        • ${loadTime} s
        <div 
          id="${tooltipId}" 
          class="trend-details" 
          role="tooltip"
        >
          <div><strong>Punteggio:</strong> ${performance}/100</div>
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
  const scoreEl = document.getElementById('performance-score') || 
                 document.getElementById('tech-maturity-score');
  if (scoreEl) {
    scoreEl.textContent = `${performanceScoreValue}%`;
  }

  const trendIndicator = document.getElementById('trend-indicator');
  if (trendIndicator) {
    const trend = performanceScoreValue - 82;
    trendIndicator.textContent = trend > 0 ? ' ↑' : trend < 0 ? ' ↓' : ' →';
trendIndicator.classList.remove('trend-up', 'trend-down', 'trend-equal');
const statusClass = trend > 0 ? 'trend-up' : trend < 0 ? 'trend-down' : 'trend-equal';
trendIndicator.classList.add(statusClass);
    trendIndicator.setAttribute('aria-label', 
      trend > 0 ? 'Trend in aumento' : 
      trend < 0 ? 'Trend in diminuzione' : 'Trend stabile'
    );
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

// --- Funzione: Esporta JSON + Grafico in PDF (Versione Resiliente Online/Offline) ---
async function exportToPDF() {
  const btn = document.getElementById('export-data-btn');
  const originalLabel = btn?.textContent || 'Esporta dati';
  const LOGO_URL = 'https://gitechnolo.github.io/biotechproject/Biotech-file/images/favicon-biotech.png';
  const CACHE_KEY = 'biotech_perf_backup';

  try {
    if (btn) { 
      btn.disabled = true; 
      btn.textContent = 'Preparazione PDF...'; 
    }

    // 1. Carica le librerie (Gestito dal Service Worker se offline)
    await loadJsPDF(); 

    // 2. Recupera i dati dal LocalStorage (Ponte)
    const savedData = localStorage.getItem(CACHE_KEY);
    let data = savedData ? JSON.parse(savedData) : null;

    // Fallback di emergenza se la cache è vuota
    if (!data) {
      try {
        const res = await fetch('data/performance-latest.json');
        data = await res.json();
      } catch (e) {
        showNotification('⚠️ Sincronizza i dati online prima di esportare.'); return;
      }
    }

    // Preparazione dati tabella
    const tableData = data.pages.map(p => {
        const score = p.performanceScore ?? 85;
        const fileName = p.url.split('/').pop() || 'index.html';
        return [p.label || fileName, `${score}%`, fileName];
    });

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const marginLeft = 40;
    let cursorY = 40;
    const pageWidth = doc.internal.pageSize.getWidth();

    // 3. Intestazione con Logo e Titolo (Ridimensionati)
    const logoSize = 45; 
    const logoImage = await new Promise(resolve => {
        const img = new Image();
        img.crossOrigin = 'Anonymous'; 
        img.onload = () => resolve(img);
        img.onerror = () => resolve(null); 
        img.src = LOGO_URL;
    });

    if (logoImage) {
        doc.addImage(logoImage, 'PNG', marginLeft, cursorY, logoSize, logoSize);
    }

    doc.setFontSize(18); // Titolo più piccolo
    doc.setTextColor(16, 185, 129); // Verde Biotech
    doc.text('Biotech Project - Performance Report', marginLeft + logoSize + 15, cursorY + 28); 
    cursorY += logoSize + 15; 

    // 4. Info Sincronizzazione e Stato Dati (Compatte)
    doc.setFontSize(9);
    doc.setTextColor(100);
    const now = new Date().toLocaleString('it-IT');
    doc.text(`Report generato il: ${now}`, marginLeft, cursorY);
    cursorY += 12;

    if (data.syncTimestamp) {
        const syncDate = new Date(data.syncTimestamp).toLocaleString('it-IT');
        doc.text(`Ultima sincronizzazione dati: ${syncDate}`, marginLeft, cursorY);
        cursorY += 20;
    }

    // 5. Inserimento Grafico (RIDOTTO AL 70% per risparmiare spazio)
    const canvas = document.getElementById('performance-trend');
    if (canvas) {
      try {
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = pageWidth - (marginLeft * 2);
        // Rapporto d'aspetto originale ridotto del 30%
        const imgHeight = ((canvas.height / canvas.width) * imgWidth) * 0.7; 
        doc.addImage(imgData, 'PNG', marginLeft, cursorY, imgWidth, imgHeight);
        cursorY += imgHeight + 25;
      } catch (e) {
        console.warn('Grafico non disponibile per il PDF');
      }
    }

    // 6. Tabella Dettaglio Pagine (Ottimizzata per una singola pagina)
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text('Dettaglio Analisi Pagine', marginLeft, cursorY);
    cursorY += 10;

    doc.autoTable({
        startY: cursorY,
        head: [['Pagina', 'Punteggio', 'File sorgente']],
        body: tableData,
        theme: 'striped',
        headStyles: { fillColor: [16, 185, 129], textColor: 255, cellPadding: 2 },
        styles: { 
            fontSize: 8, // Font ridotto a 8pt per far stare tutte le righe
            cellPadding: 2 
        },
        margin: { bottom: 20 },
        columnStyles: { 1: { halign: 'center', cellWidth: 50 } },
        didParseCell: (hookData) => {
            if (hookData.section === 'body' && hookData.column.index === 1) {
                const score = parseInt(hookData.cell.text[0]);
                if (score >= 90) hookData.cell.styles.textColor = [39, 174, 96];
                else if (score < 75) hookData.cell.styles.textColor = [192, 57, 43];
            }
        }
    });

    // 7. Salvataggio
    doc.save(`biotech-report-${new Date().toISOString().slice(0,10)}.pdf`);
    showNotification('✅ PDF generato correttamente');

  } catch (err) {
    console.error('Errore export PDF:', err);
    showNotification('⚠️ Errore durante la generazione del PDF.');
  } finally {
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