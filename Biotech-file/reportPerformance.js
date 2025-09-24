/**
 * reportPerformance.js
 * Mostra metriche tecniche in tempo reale con trend e accessibilità
 * Usa performance-latest.json generato da generate-performance.js
 */

document.addEventListener('DOMContentLoaded', async function () {
  // 🔹 Configurazione metriche
  const METRIC_CONFIG = {
    performance: { key: 'performanceScore', prevKey: 'previousPerformanceScore', label: 'Prestazioni Mobile' },
    accessibility: { key: 'accessibilityScore', prevKey: 'previousAccessibilityScore', label: 'Accessibilità' },
    seo: { key: 'seoScore', prevKey: 'previousSeoScore', label: 'SEO' },
    'best-practices': { key: 'bestPracticesScore', prevKey: 'previousBestPracticesScore', label: 'Best Practices' },
    'performance-desktop': { key: 'performanceScore', prevKey: 'previousPerformanceScore', label: 'Prestazioni Desktop' }
  };

  try {
    // 🔹 1. Carica il JSON
    const response = await fetch('/biotechproject/data/performance-latest.json');
    if (!response.ok) throw new Error('Dati non disponibili');

    const auditData = await response.json();
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';

    // 🔹 2. Trova la pagina corrente
    const currentPage = auditData.pages.find(p => p.url.endsWith(currentPath)) ||
                        auditData.pages.find(p => p.url.endsWith('index.html')); // fallback

    if (!currentPage) {
      throw new Error('Pagina non trovata nei dati');
    }

    // 🔹 3. Aggiorna i cerchi
    document.querySelectorAll('.progress-circle').forEach(circle => {
      const metric = circle.dataset.metric;
      const config = METRIC_CONFIG[metric];
      if (!config) return;

      const value = currentPage[config.key] !== null && currentPage[config.key] !== undefined
        ? Math.round(currentPage[config.key])
        : getDefaultScore(metric);

      circle.style.setProperty('--value', `${value}%`);
      circle.dataset.value = value;
      circle.setAttribute('aria-valuenow', value);
      circle.setAttribute('aria-label', `${config.label}: ${value}%`);
    });

    // 🔹 4. Aggiorna data
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

    // 🔹 5. Aggiorna trend (solo per performance, ma estensibile)
    const trendIndicator = document.getElementById('trend-indicator');
    if (trendIndicator && currentPage.previousPerformanceScore !== undefined && currentPage.performanceScore !== null) {
      const current = currentPage.performanceScore;
      const previous = currentPage.previousPerformanceScore;
      const diff = current - previous;

      trendIndicator.classList.remove('visually-hidden');

      if (diff > 0) {
        trendIndicator.textContent = '▲';
        trendIndicator.style.color = '#66bb6a';
        trendIndicator.title = `Migliorato di ${diff} punti`;
        trendIndicator.setAttribute('aria-label', `Migliorato di ${diff} punti`);
      } else if (diff < 0) {
        trendIndicator.textContent = '▼';
        trendIndicator.style.color = '#ef5350';
        trendIndicator.title = `Diminuito di ${Math.abs(diff)} punti`;
        trendIndicator.setAttribute('aria-label', `Diminuito di ${Math.abs(diff)} punti`);
      } else {
        trendIndicator.textContent = '●';
        trendIndicator.style.color = '#ffa726';
        trendIndicator.title = 'Stabile';
        trendIndicator.setAttribute('aria-label', 'Stabile');
      }

      // Anima leggermente
      trendIndicator.style.transform = 'scale(1.2)';
      setTimeout(() => {
        trendIndicator.style.transform = 'scale(1)';
      }, 300);
    }

    // 🔹 6. Tooltip accessibili
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

      tooltip.setAttribute('role', 'tooltip');
      btn.setAttribute('aria-haspopup', 'true');
    });

    // 🔹 7. Animazione ingresso
    setTimeout(() => {
      document.querySelectorAll('.metric').forEach((el, i) => {
        el.style.opacity = 0;
        el.style.transform = 'translateY(10px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        setTimeout(() => {
          el.style.opacity = 1;
          el.style.transform = 'translateY(0)';
        }, i * 100);
      });
    }, 100);

  } catch (error) {
    console.warn('🔧 reportPerformance.js: Errore nel caricamento dei dati', error);

    // 🔹 Fallback visivo
    document.querySelectorAll('.progress-circle').forEach(circle => {
      const metric = circle.dataset.metric;
      const value = getDefaultScore(metric);
      circle.style.setProperty('--value', `${value}%`);
      circle.dataset.value = value;
      circle.setAttribute('aria-valuenow', value);
    });

    const lastUpdated = document.getElementById('last-updated');
    if (lastUpdated) {
      lastUpdated.textContent = 'Dati non disponibili';
      lastUpdated.style.color = '#ef5350';
    }

    // Notifica
    const notification = document.createElement('div');
    notification.className = 'notification2';
    notification.textContent = '⚠️ Dati temporaneamente non disponibili';
    document.body.appendChild(notification);
    setTimeout(() => {
      notification.style.opacity = 1;
      setTimeout(() => {
        notification.style.opacity = 0;
        setTimeout(() => notification.remove(), 300);
      }, 2000);
    }, 100);
  }

  // 🔹 Valori di fallback
  function getDefaultScore(metric) {
    const defaults = {
      performance: 85,
      accessibility: 88,
      seo: 90,
      'best-practices': 85,
      'performance-desktop': 90
    };
    return defaults[metric] || 75;
  }

});   