document.addEventListener('DOMContentLoaded', async () => {
  try {
    // 🔹 Carica i dati dal JSON
    const response = await fetch('/biotechproject/data/performance-latest.json');
    if (!response.ok) throw new Error('Dati non disponibili');

    const auditData = await response.json();
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';

    // 🔹 Rileva se siamo su Tech_Maturity.html
    const isTechMaturityPage = currentPath.toLowerCase() === 'tech_maturity.html';

    // If Tech_Maturity page, render global report and return early
    if (isTechMaturityPage) {
      renderTechReport(auditData);
      // still continue with updateVisualReport for summary fields (optional)
      return;
    }

    // 🔹 Trova la pagina corrente (per fallback e trend)
    const currentPage = auditData.pages.find(p => p.url.endsWith(currentPath));
    const homePage = auditData.pages.find(p => p.url.endsWith('index.html'));

    if (!currentPage && !isTechMaturityPage) {
      console.warn('Pagina non trovata nei dati di audit:', currentPath);
    }

    // 🔹 Mappa delle metriche: usa dati GLOBALI su Tech_Maturity, altrimenti dati pagina
    const metricMap = isTechMaturityPage
      ? {
          performance: auditData.summary.averagePerformance ?? 85,
          'performance-desktop': Math.min((auditData.summary.averagePerformance ?? 85) + 2, 100),
          accessibility: auditData.summary.averageAccessibility ?? 94,
          seo: auditData.summary.averageSeo ?? 96,
          'best-practices': auditData.summary.averageBestPractices ?? 97
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

    // 🔹 Aggiorna i cerchi
    document.querySelectorAll('.progress-circle').forEach(circle => {
      const metric = circle.dataset.metric;
      const value = metricMap[metric] || 75;
      const roundedValue = Math.round(value);

      circle.style.setProperty('--value', `${roundedValue}%`);
      circle.dataset.value = roundedValue;
      circle.setAttribute('aria-valuenow', roundedValue);
    });

    // 🔹 Aggiorna data ultimo aggiornamento
    const lastUpdated = document.getElementById('last-updated');
    if (lastUpdated && auditData.lastUpdated) {
      const date = new Date(auditData.lastUpdated);
      lastUpdated.textContent = date.toLocaleDateString('it-IT', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }

    // 🔹 Calcola il trend (usa SEMPRE la homepage)
    const trendIndicator = document.getElementById('trend-indicator');
    if (trendIndicator && homePage) {
      const currentScore = homePage.performanceScore;
      const previousScore = homePage.previousPerformanceScore;

      if (previousScore !== undefined) {
        const diff = currentScore - previousScore;
        trendIndicator.classList.remove('visually-hidden');

        if (diff > 0) {
          trendIndicator.textContent = '▲';
          trendIndicator.style.color = '#66bb6a'; // verde
          trendIndicator.setAttribute('aria-label', `Migliorato di ${diff} punti`);
        } else if (diff < 0) {
          trendIndicator.textContent = '▼';
          trendIndicator.style.color = '#ef5350'; // rosso
          trendIndicator.setAttribute('aria-label', `Diminuito di ${Math.abs(diff)} punti`);
        } else {
          trendIndicator.textContent = '●';
          trendIndicator.style.color = '#ffa726'; // arancione
          trendIndicator.setAttribute('aria-label', 'Stabile');
        }

        // Anima leggermente
        trendIndicator.style.transform = 'scale(1.1)';
        setTimeout(() => {
          trendIndicator.style.transform = 'scale(1)';
        }, 300);
      }
    }

    // 🔹 Tooltip interattivi
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

      // Mostra/nascondi con mouse e focus
      btn.addEventListener('mouseenter', show);
      btn.addEventListener('focus', show);
      btn.addEventListener('mouseleave', hide);
      btn.addEventListener('blur', hide);

      // Per tastiera: Esc per chiudere
      btn.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !tooltip.hidden) {
          hide();
          btn.focus();
        }
      });

      // Opzionale: rendi il tooltip focusabile (per screen reader avanzati)
      tooltip.tabIndex = -1;
      tooltip.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          hide();
          btn.focus();
        }
      });
    });

    // 🔹 Animazione ingresso metriche
    document.querySelectorAll('.metric').forEach((el, i) => {
      el.style.opacity = 0;
      el.style.transform = 'translateY(10px)';
      setTimeout(() => {
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        el.style.opacity = 1;
        el.style.transform = 'translateY(0)';
      }, 50 + i * 100);
    });

  } catch (error) {
    console.warn('Errore nel caricamento dei dati di audit:', error);

    // 🔹 Fallback visivo
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

    // 🔹 Notifica accessibile
    const notification = document.createElement('div');
    notification.className = 'notification2';
    notification.textContent = '⚠️ Dati temporaneamente non disponibili';
    notification.setAttribute('role', 'status');
    notification.setAttribute('aria-live', 'polite');
    document.body.appendChild(notification);

    setTimeout(() => { notification.style.opacity = 1; }, 100);
    setTimeout(() => { notification.style.opacity = 0; }, 2100);
  }
}); // ✅ Chiusura completa di document.addEventListener


      // 🔹 Aggiorna il report visivo con dati reali
async function updateVisualReport() {
  try {
    const response = await fetch('/biotechproject/data/performance-latest.json');
    if (!response.ok) throw new Error('Dati non disponibili');

    const data = await response.json();

    // ✅ Pagine analizzate
    const analyzedCount = document.getElementById('analyzed-count');
    if (analyzedCount) {
      analyzedCount.textContent = data.summary.analyzed;
    }

    // ⚡ Media prestazioni
    const avgPerf = document.getElementById('avg-performance');
    if (avgPerf && data.summary.averagePerformance !== undefined) {
      avgPerf.textContent = `${data.summary.averagePerformance}%`;
    }

    // ♿ Media accessibilità
    const avgA11y = document.getElementById('avg-accessibility');
    if (avgA11y && data.summary.averageAccessibility !== undefined) {
      avgA11y.textContent = `${data.summary.averageAccessibility}%`;
    }

    // 🔍 Media SEO
    const avgSeo = document.getElementById('avg-seo');
    if (avgSeo && data.summary.averageSeo !== undefined) {
      avgSeo.textContent = `${data.summary.averageSeo}%`;
    }

    // ✅ Media Best Practices
    const avgBestPractices = document.getElementById('avg-best-practices');
    if (avgBestPractices && data.summary.averageBestPractices !== undefined) {
      avgBestPractices.textContent = `${data.summary.averageBestPractices}%`;
    }

    // 📅 Ultimo aggiornamento
    const lastUpdatedReport = document.getElementById('last-updated-report');
    if (lastUpdatedReport && data.lastUpdated) {
      const date = new Date(data.lastUpdated);
      lastUpdatedReport.textContent = date.toLocaleDateString('it-IT', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
      lastUpdatedReport.setAttribute('datetime', date.toISOString());
    }

  } catch (error) {
    console.warn('🔧 reportPerformance.js: Errore nel caricamento del report visivo', error);

    // 🔁 Fallback per tutti gli elementi del report
    const ids = [
      'analyzed-count',
      'avg-performance',
      'avg-accessibility',
      'avg-seo',
      'avg-best-practices',
      'last-updated-report'
    ];
    ids.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = 'N/D';
    });
  }
}

// ✅ Esegui updateVisualReport al caricamento
document.addEventListener('DOMContentLoaded', updateVisualReport);

// ---------- Nuova funzione: renderTechReport ----------
/**
 * renderTechReport
 * Popola Tech_Maturity.html con i dati globali contenuti in performance-latest.json:
 * - aggiorna contatori (analizzate, punteggio medio, last-updated)
 * - popola la griglia .portfolio-row con card per ogni pagina
 * - disegna un grafico a barre di performance per pagina (se Chart.js disponibile)
 */
function renderTechReport(auditData) {
  try {
    const pages = Array.isArray(auditData.pages) ? auditData.pages.slice() : [];
    const summary = auditData.summary || {};

    // Calcola valori di fallback se mancano
    const analyzed = summary.analyzed ?? pages.length;
    const avgPerformance = summary.averagePerformance ??
      Math.round((pages.reduce((s, p) => s + (p.performanceScore || 0), 0) / (pages.length || 1)) || 0);

    // Aggiorna UI base
    const elAnalyzed = document.getElementById('analyzed-count');
    const elAvg = document.getElementById('avg-performance');
    const elScore = document.getElementById('performance-score');
    const elLast = document.getElementById('last-updated');
    const elLastReport = document.getElementById('last-updated-report');

    if (elAnalyzed) elAnalyzed.textContent = analyzed;
    if (elAvg) elAvg.textContent = `${avgPerformance}%`;
    if (elScore) elScore.textContent = `${avgPerformance}%`;
    const lastUpdated = auditData.lastUpdated || new Date().toISOString();
    if (elLast) elLast.textContent = (new Date(lastUpdated)).toLocaleString();
    if (elLastReport) {
      elLastReport.textContent = (new Date(lastUpdated)).toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' });
      elLastReport.setAttribute('datetime', lastUpdated);
    }

    // Popola la tabella di supporto (visually-hidden) se presente
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

    // Popola la griglia delle pagine (.portfolio-row)
    const grid = document.querySelector('.portfolio-row');
    if (grid) {
      grid.innerHTML = '';
      pages.forEach(p => {
        const col = document.createElement('div');
        col.className = 'portfolio-col portfolio-show';
        col.setAttribute('data-score', p.performanceScore ?? 0);
        // contenuto minimale e accessibile
        col.innerHTML = `
          <div class="portfolio-content" role="article" aria-label="${escapeHtml(p.label)}">
            <h4 style="margin:0 0 6px 0">${escapeHtml(p.label)}</h4>
            <p style="margin:4px 0">Score: <strong>${p.performanceScore ?? '-'}%</strong></p>
            <p style="margin:4px 0; font-size:0.9em; color:#b2dfdb">Load: ${p.loadTime ?? '-'} ms</p>
            <p style="margin:6px 0"><a href="${p.url}" target="_blank" rel="noopener">Apri pagina</a></p>
          </div>
        `;
        grid.appendChild(col);
      });
    }

    // Disegna grafico performance (se canvas e Chart.js presenti)
    const canvas = document.getElementById('performance-trend');
    if (canvas && window.Chart) {
      const ctx = canvas.getContext('2d');

      // Ordina pagine per score decrescente per leggibilità
      pages.sort((a, b) => (b.performanceScore || 0) - (a.performanceScore || 0));

      // Limita il numero di barre per evitare sovraccarico visivo
      const MAX = 50;
      const subset = pages.slice(0, MAX);

      const labels = subset.map(p => p.label);
      const scores = subset.map(p => p.performanceScore || 0);
      const bgColors = scores.map(v => v >= 90 ? 'rgba(92,184,92,0.9)' : (v >= 75 ? 'rgba(255,193,7,0.9)' : 'rgba(255,99,71,0.9)'));

      // Distruggi grafico precedente se esiste
      if (window.__performanceChart) {
        try { window.__performanceChart.destroy(); } catch (e) { /* ignore */ }
      }

      window.__performanceChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels,
          datasets: [{
            label: 'Performance %',
            data: scores,
            backgroundColor: bgColors,
            borderColor: bgColors.map(c => c.replace('0.9','1')),
            borderWidth: 1
          }]
        },
        options: {
          maintainAspectRatio: false,
          scales: {
            y: { beginAtZero: true, max: 100, title: { display: true, text: 'Percentuale' } },
            x: { ticks: { autoSkip: false } }
          },
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: ctx => `${ctx.parsed.y}%`
              }
            }
          }
        }
      });

      // Imposta altezza canvas responsive
      canvas.style.height = '320px';
    }

  } catch (err) {
    console.error('renderTechReport error', err);
  }
}

// Simple HTML escaper for labels
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}