// ———————————————————————
// Biotech-file/portfolio.js
// GESTIONE PERFORMANCE, PORTFOLIO, CERCHI, TOOLTIP E GRAFICO
// ———————————————————————

// --- Variabile globale per il grafico ---
let performanceChart;

// --- Funzioni principali del portfolio ---

/**
 * Carica i dati dal JSON e inizializza grafico, card e filtri
 */
async function loadPerformanceData(auditData) {
  console.log('🔧 loadPerformanceData() in esecuzione');
  let data;
  try {
    if (auditData) {
      data = auditData;
    } else {
      const response = await fetch('data/performance-latest.json');
      if (!response.ok) throw new Error('Dati non disponibili');
      data = await response.json();
    }

    const container = document.querySelector('.portfolio-row');
    if (!container) return;

    // Pulisci container
    container.innerHTML = '';

    // Estrai homepage
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

    // Inizializza filtri
    filterSelection('all');

    // Costruisci cronologia minima
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

    // Aggiorna grafico con dati reali
    creaGrafico(history);

  } catch (error) {
    console.warn('⚠️ Impossibile caricare i dati reali:', error);

    // Fallback visivo
    aggiornaPerformanceScore(85);
    creaGrafico(); // Usa dati simulati
    const lastUpdate = document.getElementById('last-update');
    if (lastUpdate) lastUpdate.textContent = 'Aggiornato il: dati non disponibili';
    showNotification('Dati temporaneamente non disponibili. Mostrati valori di esempio.');
  }
}

/**
 * Crea la card per ogni pagina (Accessibilità)
 */
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

// --- Funzioni ausiliarie ---
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
    const trend = performanceScoreValue - 82; // confronto con valore precedente   
    trendIndicator.textContent = trend > 0 ? ' ↑' : trend < 0 ? ' ↓' : ' →';
    trendIndicator.style.color = trend > 0 ? '#10b981' : trend < 0 ? '#ef4444' : '#f59e0b';
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

// --- Dati simulati (fallback) ---
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

// --- Crea o aggiorna il grafico ---
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
        pointRadius: (context) => {
          const isLast = context.dataIndex === values.length - 1;
          return isLast ? 8 : 5;
        },
        pointBackgroundColor: (context) => {
          if (context.dataIndex === values.length - 1) {
            return '#4ade80';
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

/**
 * Aggiorna la tabella accessibile con i dati del grafico
 */
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

// ———————————————————————
// 🔹 FUNZIONI UNIFICATE DA reportPerformance.js
// ———————————————————————

/**
 * Aggiorna i cerchi di progresso, trend e dati del report
 */
async function updateVisualReport(auditData) {
  try {
    let data;
    if (auditData) {
      data = auditData;
    } else {
      const response = await fetch('/biotechproject/data/performance-latest.json');
      if (!response.ok) throw new Error('Dati non disponibili');
      data = await response.json();
    }

    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const isTechMaturityPage = currentPath.toLowerCase() === 'tech_maturity.html';

    const currentPage = data.pages.find(p => p.url.endsWith(currentPath));
    const homePage = data.pages.find(p => p.url.endsWith('index.html'));

    // Mappa delle metriche
    const metricMap = isTechMaturityPage
      ? {
          performance: data.summary.averagePerformance ?? 85,
          'performance-desktop': Math.min((data.summary.averagePerformance ?? 85) + 2, 100),
          accessibility: data.summary.averageAccessibility ?? 94,
          seo: data.summary.averageSeo ?? 96,
          'best-practices': data.summary.averageBestPractices ?? 97
        }
      : {
          performance: currentPage?.performanceScore ?? homePage?.performanceScore ?? 85,
          'performance-desktop': (() => {
            const score = currentPage?.performanceScore || homePage?.performanceScore;
            return score ? Math.min(score + 5, 100) : 90;
          })(),
          accessibility: currentPage?.accessibilityScore ?? homePage?.accessibilityScore ?? 88,
          seo: currentPage?.seoScore ?? homePage?.seoScore ?? 90,
          'best-practices': currentPage?.bestPracticesScore ?? homePage?.bestPracticesScore ?? 85
        };

    // Aggiorna i cerchi
    document.querySelectorAll('.progress-circle').forEach(circle => {
      const metric = circle.dataset.metric;
      const value = metricMap[metric] || 75;
      const roundedValue = Math.round(value);
      circle.style.setProperty('--value', `${roundedValue}%`);
      circle.dataset.value = roundedValue;
      circle.setAttribute('aria-valuenow', roundedValue);

      // Aggiorna classe per glow dinamico (high/medium/low)
      circle.classList.remove('low', 'medium', 'high');
      if (roundedValue >= 75) {
        circle.classList.add('high');
      } else if (roundedValue >= 50) {
        circle.classList.add('medium');
      } else {
        circle.classList.add('low');
      }
    });

    // Aggiorna data ultimo aggiornamento
    const lastUpdated = document.getElementById('last-updated');
    if (lastUpdated && data.lastUpdated) {
      const date = new Date(data.lastUpdated);
      lastUpdated.textContent = date.toLocaleDateString('it-IT', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }

    // Calcola trend (usa homepage)
    const trendIndicator = document.getElementById('trend-indicator');
    if (trendIndicator && homePage) {
      const currentScore = homePage.performanceScore;
      const previousScore = homePage.previousPerformanceScore;

      if (previousScore !== undefined) {
        const diff = currentScore - previousScore;
        trendIndicator.classList.remove('visually-hidden');

        if (diff > 0) {
          trendIndicator.textContent = '▲';
          trendIndicator.style.color = '#66bb6a';
          trendIndicator.setAttribute('aria-label', `Migliorato di ${diff} punti`);
        } else if (diff < 0) {
          trendIndicator.textContent = '▼';
          trendIndicator.style.color = '#ef5350';
          trendIndicator.setAttribute('aria-label', `Diminuito di ${Math.abs(diff)} punti`);
        } else {
          trendIndicator.textContent = '●';
          trendIndicator.style.color = '#ffa726';
          trendIndicator.setAttribute('aria-label', 'Stabile');
        }

        // Anima leggermente
        trendIndicator.style.transform = 'scale(1.1)';
        setTimeout(() => {
          trendIndicator.style.transform = 'scale(1)';
        }, 300);
      }
    }

  } catch (error) {
    console.warn('Errore in updateVisualReport:', error);

    // Fallback per cerchi
    document.querySelectorAll('.progress-circle').forEach(circle => {
      const value = circle.dataset.metric === 'performance' ? 85 : 90;
      circle.style.setProperty('--value', `${value}%`);
      circle.dataset.value = value;
      circle.setAttribute('aria-valuenow', value);
    });

    const lastUpdated = document.getElementById('last-updated');
    if (lastUpdated) {
      lastUpdated.textContent = 'Dati non disponibili';
      lastUpdated.style.color = '#ef5350';
    }

    const notification = document.createElement('div');
    notification.className = 'notification2';
    notification.textContent = '⚠️ Dati temporaneamente non disponibili';
    notification.setAttribute('role', 'status');
    notification.setAttribute('aria-live', 'polite');
    document.body.appendChild(notification);
    setTimeout(() => { notification.style.opacity = 1; }, 100);
    setTimeout(() => { notification.style.opacity = 0; }, 2100);
  }
}

/**
 * Inizializza tooltip interattivi con ARIA e tastiera
 */
function initTooltips() {
  document.querySelectorAll('.tooltip-btn').forEach(btn => {
    const tooltipId = btn.dataset.tooltip;
    const tooltip = document.getElementById(`tooltip-${tooltipId}`);
    if (!tooltip) return;

    const show = () => {
      tooltip.hidden = false;
      btn.setAttribute('aria-expanded', 'true');
    };

    const hide = () => {
      tooltip.hidden = true;
      btn.setAttribute('aria-expanded', 'false');
    };

    btn.addEventListener('mouseenter', show);
    btn.addEventListener('focus', show);
    btn.addEventListener('mouseleave', hide);
    btn.addEventListener('blur', hide);

    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !tooltip.hidden) {
        hide();
        btn.focus();
      }
    });

    tooltip.tabIndex = -1;
    tooltip.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        hide();
        btn.focus();
      }
    });
  });
}

/**
 * Anima ingresso delle metriche (fade + slide)
 */
function animateMetrics() {
  document.querySelectorAll('.metric').forEach((el, i) => {
    el.style.opacity = 0;
    el.style.transform = 'translateY(10px)';
    setTimeout(() => {
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      el.style.opacity = 1;
      el.style.transform = 'translateY(0)';
    }, 50 + i * 100);
  });
}

// ———————————————————————
// 🔹 INIT GLOBALE: esegui tutto al caricamento del DOM
// ———————————————————————
document.addEventListener('DOMContentLoaded', async () => {
  try {
    // 1. Carica i dati una volta sola
    const response = await fetch('/biotechproject/data/performance-latest.json');
    if (!response.ok) throw new Error('Dati non disponibili');
    const auditData = await response.json();

    // 2. Passa i dati alle funzioni principali
    loadPerformanceData(auditData);
    updateVisualReport(auditData);

    // 3. Inizializza interazioni
    initTooltips();
    animateMetrics();
    setupRefreshButtons();

    // 4. Inizializza filtri
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        filterSelection(btn.dataset.filter);
      });
    });

    // 5. Imposta filtro iniziale
    filterSelection('all');

  } catch (error) {
    console.warn('Errore nel caricamento dei dati principali:', error);

    // Fallback: esegui comunque le funzioni con dati simulati
    loadPerformanceData();
    updateVisualReport();
    initTooltips();
    animateMetrics();
    setupRefreshButtons();
    filterSelection('all');
  }
});   