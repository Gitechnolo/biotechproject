// Biotech-file/portfolio.js
// ———————————————————————
// GESTIONE PERFORMANCE E GRAFICO DI MATURITÀ TECNOLOGICA
// ———————————————————————

// --- Variabile globale per il grafico ---
let performanceChart;

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

    // Calcola la media di tutte le pagine
const avgPerf = Math.round(
  data.pages.reduce((sum, p) => sum + (p.performanceScore || 0), 0) / data.pages.length
);
const performanceScoreValue = avgPerf;

    // Aggiorna punteggio principale
    aggiornaPerformanceScore(performanceScoreValue);

    // Genera tutte le card
    data.pages.forEach(page => {
      const card = createPerformanceCard(page);
      container.appendChild(card);
    });

    // Inizializza filtri
    filterSelection('all');

    // Costruisci cronologia minima da dati reali
    const history = [];

    // Aggiungi punto precedente se disponibile
    if (homePage?.previousPerformanceScore !== undefined && homePage.previousPerformanceScore !== null) {
      history.push({
        date: subtractDays(reportTime, 5),
        score: homePage.previousPerformanceScore,
        note: 'Misurazione precedente'
      });
    }

    // Aggiungi punto attuale
    history.push({
      date: formatDate(reportTime),
      score: performanceScoreValue,
      note: 'Misurazione attuale'
    });

    // Aggiorna grafico con dati reali
    creaGrafico(history);

  } catch (error) {
    console.warn('⚠️ Impossibile caricare i dati reali:', error);

    // Fallback visivo
    aggiornaPerformanceScore(85);
    creaGrafico(); // Usa dati simulati come fallback

    const lastUpdate = document.getElementById('last-update');
    if (lastUpdate) {
      lastUpdate.textContent = 'Aggiornato il: dati non disponibili';
    }

    showNotification('Dati temporaneamente non disponibili. Mostrati valori di esempio.');
  }
}

// --- Crea la card per ogni pagina (Accessibilità) ---
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

  // 🔹 HTML aggiornato: tooltip accessibile con ARIA e posizionamento corretto
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
        <span class="status-badge ${getTrendColorClass(performance, page.previousPerformanceScore)}" 
              style="font-size: 9px; padding: 1px 5px; margin-left: 6px;">
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

  // 🔹 Riferimenti agli elementi
  const fadebox = card.querySelector('.fadebox');
  const trendDetails = card.querySelector('.trend-details');

  // 🔹 Mostra tooltip su focus (tastiera)
  fadebox.addEventListener('focus', () => {
    trendDetails.style.display = 'block';
  });

  // 🔹 Nasconde tooltip su blur
  fadebox.addEventListener('blur', () => {
    trendDetails.style.display = 'none';
  });

  // 🔹 Mostra/nasconde su click (mouse/touch)
  fadebox.addEventListener('click', () => {
    const isDisplayed = trendDetails.style.display === 'block';
    trendDetails.style.display = isDisplayed ? 'none' : 'block';
  });

  // 🔹 Chiude con tasto ESC
  fadebox.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      trendDetails.style.display = 'none';
      fadebox.blur();
    }
  });

  return card;
}

// 🔹 Funzione di utilità per generare ID sicuri
function sanitizeId(str) {
  return str.replace(/[^a-z0-9]/gi, '-').toLowerCase();
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
    trendIndicator.textContent = trend > 0 ? ' ↑' : trend < 0 ? ' ↓' : ' →';
    trendIndicator.style.color = trend > 0 ? '#10b981' : trend < 0 ? '#ef4444' : '#f59e0b';
    trendIndicator.setAttribute('aria-label', 
      trend > 0 ? 'Trend in aumento' : 
      trend < 0 ? 'Trend in diminuzione' : 'Trend stabile'
    );
  }
}

// --- Funzioni ausiliarie per formattazione date ---
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
  // Aggiungi anno solo se non è l'anno corrente
  const year = d.getFullYear();
  const currentYear = new Date().getFullYear();
  return year === currentYear ? `${day} ${month}` : `${day} ${month} '${year.toString().slice(-2)}`;
}   

// --- Dati simulati (solo come fallback visivo) ---
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

// --- Funzione: crea o aggiorna il grafico ---
function creaGrafico(history = []) {
  console.log('Dati grafico:', history); // 🔍 Verifica
  const ctx = document.getElementById('performance-trend');
  if (!ctx) return;
  const chartCtx = ctx.getContext('2d');

  // Distruggi grafico esistente
  if (performanceChart) {
    performanceChart.destroy();
  }

  // Usa dati reali se disponibili, altrimenti fallback simulato
  const dataToShow = history.length > 0 ? history : datiSimulati;

  const labels = dataToShow.map(d => d.date);
  const values = dataToShow.map(d => d.score);

  // Identifica dove finiscono i dati reali (per colori)
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
        pointRadius: (context) => {
        const isLast = context.dataIndex === values.length - 1;
        return isLast ? 8 : 5; // ultimo punto più grande
},   
        pointBackgroundColor: (context) => {
        if (context.dataIndex === values.length - 1) {
        return '#4ade80'; // verde brillante per l'ultimo valore
  }
        return context.dataIndex < realDataEndIndex ? '#10b981' : '#f59e0b';
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
  aggiornaTabellaDati(dataToShow);
}

// --- Aggiorna tabella accessibile con dati del grafico ---
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

// --- Inizializzazione unica ---
document.addEventListener('DOMContentLoaded', () => {
  setupRefreshButtons();
  loadPerformanceData(); // Carica dati e inizializza grafico

  // Aggiungi event listener ai pulsanti di filtro
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      filterSelection(btn.dataset.filter);
    });
  });
}); 

// FUNZIONE: ESPORTA JSON + GRAFICO IN PDF
  async function exportToPDF() {
    const btn = document.getElementById('export-data-btn');
    const originalLabel = btn?.textContent || 'Esporta dati';
    try {
      if (btn) { btn.disabled = true; btn.textContent = 'Esportazione in corso...'; }

      // Prova a caricare il JSON da path relativo, fallback al percorso assoluto usato altrove
      let jsonUrl = 'data/performance-latest.json';
      let data;
      try {
        const res = await fetch(jsonUrl);
        if (!res.ok) throw new Error('relative-fail');
        data = await res.json();
      } catch (err) {
        // fallback
        const fallback = '/biotechproject/data/performance-latest.json';
        const fres = await fetch(fallback);
        data = await fres.json();
      }

      // Prepara jsPDF
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF({ unit: 'pt', format: 'a4' });
      const marginLeft = 40;
      let cursorY = 40;

      // Header
      doc.setFontSize(16);
      doc.text('Biotech Project - Performance Report', marginLeft, cursorY);
      cursorY += 18;
      doc.setFontSize(10);
      doc.text('Generato: ' + new Date().toLocaleString(), marginLeft, cursorY);
      cursorY += 18;

      // Inserisci immagine del grafico (se canvas presente)
      const canvas = document.getElementById('performance-trend');
      if (canvas) {
        try {
          const imgData = canvas.toDataURL('image/png');
          // Calcola dimensionamento mantenendo proporzioni e larghezza massima
          const pageWidth = doc.internal.pageSize.getWidth();
          const maxWidth = pageWidth - marginLeft * 2;
          const imgWidth = Math.min(maxWidth, 520);
          const imgHeight = (canvas.height / canvas.width) * imgWidth;
          doc.addImage(imgData, 'PNG', marginLeft, cursorY, imgWidth, imgHeight);
          cursorY += imgHeight + 16;
        } catch (e) {
          console.warn('Impossibile catturare canvas:', e);
        }
      }

      // Summary
      if (data && data.summary) {
        doc.setFontSize(12);
        doc.text(`Riepilogo: ${data.summary.analyzed || '-'} pagine analizzate`, marginLeft, cursorY);
        cursorY += 14;
        doc.setFontSize(10);
        doc.text(`Ultimo aggiornamento: ${data.lastUpdated || '-'}`, marginLeft, cursorY);
        cursorY += 18;
      }

      // Intestazione tabella semplificata
      doc.setFontSize(11);
      doc.text('Elenco pagine e punteggi (label — score — url):', marginLeft, cursorY);
      cursorY += 14;

      // Aggiungi righe per ogni pagina; se necessario crea nuove pagine
      const pages = (data && data.pages) ? data.pages : [];
      doc.setFontSize(9);
      for (let i = 0; i < pages.length; i++) {
        const p = pages[i];
        const line = `${p.label} — ${p.performanceScore ?? '-'}% — ${p.url}`;
        // spezza la riga se troppo lunga
        const split = doc.splitTextToSize(line, doc.internal.pageSize.getWidth() - marginLeft * 2);
        if (cursorY + split.length * 12 > doc.internal.pageSize.getHeight() - 40) {
          doc.addPage();
          cursorY = 40;
        }
        doc.text(split, marginLeft, cursorY);
        cursorY += (split.length * 12);
      }

      // Footer note
      if (cursorY + 40 > doc.internal.pageSize.getHeight()) {
        doc.addPage();
        cursorY = 40;
      }
      cursorY += 8;
      doc.setFontSize(9);
      doc.text('Dati da performance-latest.json', marginLeft, cursorY);

      // Scarica PDF
      doc.save('biotech-performance-report.pdf');

    } catch (err) {
      console.error('Errore export PDF:', err);
      alert('Errore durante l\'esportazione PDF. Controlla la console per dettagli.');
    } finally {
      if (btn) { btn.disabled = false; btn.textContent = originalLabel; }
    }
  }

  // Collega il pulsante esistente all'azione
  document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('export-data-btn');
    if (btn) btn.addEventListener('click', exportToPDF);
  });