// Biotech-file/portfolio.js
// ———————————————————————
// GESTIONE PERFORMANCE E GRAFICO DI MATURITÀ TECNOLOGICA 
// ———————————————————————

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

// --- Funzione principale: carica dati reali dal JSON ---
async function loadPerformanceData() {
  console.log('🔧 loadPerformanceData() in esecuzione');
  try {
    const response = await fetch('data/performance-latest.json');
    if (!response.ok) throw new Error('Dati non disponibili');

    const data = await response.json();
    const container = document.querySelector('.portfolio-row');
    if (!container) return;

    container.innerHTML = '';

    const homePage = data.pages.find(p =>
      p.url.includes('/index.html') ||
      p.url === 'https://gitechnolo.github.io/biotechproject/' ||
      p.url === window.location.origin + '/biotechproject/'
    );

    const reportTime = homePage?.generatedTime ? new Date(homePage.generatedTime) : new Date();

    const lastUpdate = document.getElementById('last-update');
    if (lastUpdate) {
      const dateStr = reportTime.toLocaleDateString('it-IT');
      const timeStr = reportTime.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
      lastUpdate.textContent = `Aggiornato il: ${dateStr} alle ${timeStr}`;
    }

    const avgPerf = Math.round(
      data.pages.reduce((sum, p) => sum + (p.performanceScore || 0), 0) / data.pages.length
    );
    const performanceScoreValue = avgPerf;

    aggiornaPerformanceScore(performanceScoreValue);

    // *** OTTIMIZZAZIONE DOM: Uso di DocumentFragment ***
    const fragment = document.createDocumentFragment();

    data.pages.forEach(page => {
      const card = createPerformanceCard(page);
      fragment.appendChild(card);
    });

    container.appendChild(fragment); // Inserimento unico nel DOM

    filterSelection('all');

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
      score: performanceScoreValue,
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

    const lastUpdated = document.getElementById('last-updated');
    if (lastUpdated && data.lastUpdated) {
      const date = new Date(data.lastUpdated);
      lastUpdated.textContent = date.toLocaleDateString('it-IT', {
        day: '2-digit', month: '2-digit', year: 'numeric'
      });
    }

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

    const update = (id, value) => {
      const el = document.getElementById(id);
      if (el) el.textContent = value;
    };

    update('analyzed-count', summary.analyzed || data.pages.length);
    update('avg-performance', `${avgPerf}%`);
    update('avg-accessibility', `${avgA11y}%`);
    update('avg-seo', `${avgSeo}%`);
    update('avg-best-practices', `${avgBest}%`);

    if (data.lastUpdated) {
      const date = new Date(data.lastUpdated);
      update('last-updated-report', date.toLocaleDateString('it-IT'));
      document.getElementById('last-updated-report')?.setAttribute('datetime', date.toISOString());
    }

    // *** OTTIMIZZAZIONE CSS: Sostituzione di setTimeout con l'aggiunta di una classe CSS ***
    document.body.classList.add('portfolio-loaded');


  } catch (error) {
    console.warn('⚠️ Impossibile caricare i dati reali:', error);
    aggiornaPerformanceScore(85);
    creaGrafico();
    const lastUpdate = document.getElementById('last-update');
    if (lastUpdate) {
      lastUpdate.textContent = 'Aggiornato il: dati non disponibili';
    }
    showNotification('Dati temporaneamente non disponibili. Mostrati valori di esempio.');
    document.body.classList.add('portfolio-loaded'); 
  }
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

// --- Funzione: Esporta JSON + Grafico in PDF ---
async function exportToPDF() {
  const btn = document.getElementById('export-data-btn');
  const originalLabel = btn?.textContent || 'Esporta dati';
  const LOGO_URL = 'https://gitechnolo.github.io/biotechproject/Biotech-file/images/favicon-biotech.png';

  const lang = (typeof currentLang !== 'undefined') ? currentLang : 'it';
  
  // Dizionario interno (il nostro "paracadute" per l'offline)
  const i18n = {
    it: {
      exporting: 'Esportazione in corso...',
      reportTitle: 'Biotech Project - Performance Report',
      fileName: 'biotech-performance-report-it.pdf',
      methodTitle: "Simulazione in aree con infrastrutture digitali limitate.",
      net: 'PROFILO RETE: 3G/4G Lento (RTT: 150ms | 1.6Mbps)',
      hw: 'PROFILO HARDWARE: Mobile Legacy (CPU: 4x)',
      method: 'METODOLOGIA: Throttling Simulato (Lighthouse 2026)',
      tableHeader: ['Etichetta Pagina', 'Punteggio', 'File Pagina']
    },
    en: {
      exporting: 'Exporting...',
      reportTitle: 'Biotech Project - Performance Report',
      fileName: 'biotech-performance-report.pdf',
      methodTitle: 'Performance tests simulate real-world usage in areas with limited digital infrastructure.',
      net: 'NETWORK PROFILE: Fast 3G/Slow 4G (RTT: 150ms | 1.6Mbps)',
      hw: 'HARDWARE PROFILE: Legacy Mobile Emulation (CPU: 4x)',
      method: 'METHODOLOGY: Simulated Throttling (Lighthouse 2026)',
      tableHeader: ['Page Label', 'Score', 'Page File']
    }
  };

  const text = i18n[lang] || i18n.it;

  try {
    if (btn) { btn.disabled = true; btn.textContent = text.exporting; }

    // 1. Caricamento librerie (come originale, sfrutta la cache se già caricate)
    await loadJsPDF(); 

    // 2. Caricamento Dati (con fallback come originale)
    let data;
    try {
      const res = await fetch('data/performance-latest.json');
      data = await res.json();
    } catch (err) {
      const fallback = '/biotechproject/data/performance-latest.json';
      const fres = await fetch(fallback);
      data = await fres.json();
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const marginLeft = 40;
    let cursorY = 25; // Header alzato per spazio

    // --- DISEGNO LOGO E TITOLO ---
    const logoImage = await new Promise(resolve => {
        const img = new Image(); img.crossOrigin = 'Anonymous';
        img.onload = () => resolve(img); img.onerror = () => resolve(null);
        img.src = LOGO_URL;
    });
    if (logoImage) doc.addImage(logoImage, 'PNG', marginLeft, cursorY, 35, 35);
    doc.setFontSize(18).setTextColor(0).setFont(undefined, 'bold');
    doc.text(text.reportTitle, marginLeft + 45, cursorY + 12);
    
    // --- METODOLOGIA VERDE (Incolonnata per evitare sforamenti) ---
    cursorY += 45;
    doc.setFontSize(9).setTextColor(39, 174, 96).setFont(undefined, 'bold');
    doc.text(text.methodTitle, marginLeft, cursorY);
    cursorY += 12;
    doc.setFontSize(8).setFont(undefined, 'normal');
    doc.text(text.net, marginLeft, cursorY);
    cursorY += 10;
    doc.text(text.hw, marginLeft, cursorY);
    cursorY += 10;
    doc.text(text.method, marginLeft, cursorY);

    // --- GRAFICO ---
    cursorY += 15;
    const canvas = document.getElementById('performance-trend');
    if (canvas) {
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = 515;
        const imgHeight = (canvas.height / canvas.width) * imgWidth * 0.85; 
        doc.addImage(imgData, 'PNG', marginLeft, cursorY, imgWidth, imgHeight);
        cursorY += imgHeight + 25;
    }

    // --- TABELLA (Con i nostri stili di respiro e colori) ---
    const tableData = data.pages.map(p => [
        p.label, 
        `${p.performanceScore ?? 85}%`, 
        p.url.split('/').pop() || '/'
    ]);

    doc.autoTable({
        startY: cursorY,
        head: [text.tableHeader],
        body: tableData,
        theme: 'striped',
        headStyles: { fillColor: [39, 174, 96], fontSize: 10 },
        styles: { fontSize: 9, cellPadding: 3.5 },
        columnStyles: { 0: { cellWidth: 180 }, 1: { cellWidth: 50, halign: 'center' }, 2: { cellWidth: 270 } },
        didParseCell: (hook) => {
            if (hook.section === 'body' && hook.column.index === 1) {
                const s = parseInt(hook.cell.text[0]);
                if (s >= 90) { hook.cell.styles.fillColor = '#d4edda'; hook.cell.styles.textColor = '#155724'; }
                else if (s >= 80) { hook.cell.styles.fillColor = '#fff3cd'; hook.cell.styles.textColor = '#856404'; }
                else { hook.cell.styles.fillColor = '#f8d7da'; hook.cell.styles.textColor = '#721c24'; }
            }
        }
    });

    doc.save(text.fileName);

  } catch (err) {
    console.error('Export error:', err);
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = originalLabel; }
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