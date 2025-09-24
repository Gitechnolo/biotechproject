document.addEventListener('DOMContentLoaded', async () => {
  try {
    // 🔹 Carica i dati dal JSON
    const response = await fetch('/biotechproject/data/performance-latest.json');
    if (!response.ok) throw new Error('Dati non disponibili');

    const auditData = await response.json();
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';

    // 🔹 Trova i dati della pagina corrente
    const currentPage = auditData.pages.find(p => p.url.endsWith(currentPath));

    if (!currentPage) {
      console.warn('Pagina non trovata nei dati di audit:', currentPath);
      // Usa homepage come fallback
      const homePage = auditData.pages.find(p => p.url.endsWith('index.html'));
      if (homePage) currentPage = homePage;
    }

    // 🔹 Mappa delle metriche (JSON → HTML data-metric)
    const metricMap = {
      performance: currentPage?.performanceScore || 85,
      'performance-desktop': currentPage?.performanceScore ? Math.min(currentPage.performanceScore + 5, 100) : 90,
      accessibility: currentPage?.accessibilityScore || 88,
      seo: currentPage?.seoScore || 90,
      'best-practices': currentPage?.bestPracticesScore || 85
    };

    // 🔹 Aggiorna i cerchi
    document.querySelectorAll('.progress-circle').forEach(circle => {
      const metric = circle.dataset.metric;
      const value = metricMap[metric] || 75;

      // Aggiorna stile e ARIA
      circle.style.setProperty('--value', `${value}%`);
      circle.dataset.value = Math.round(value);
      circle.setAttribute('aria-valuenow', Math.round(value));

      // Aggiorna testo (se usi data-value nell'HTML)
      // Il tuo CSS usa ::after { content: attr(data-value) '%' }, quindi va bene!
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

    // 🔹 Calcola il trend (es. rispetto al punteggio precedente)
    const trendIndicator = document.getElementById('trend-indicator');
    if (trendIndicator && currentPage) {
      const currentScore = currentPage.performanceScore;
      const previousScore = currentPage.previousPerformanceScore;

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

    // 🔹 Tooltip interattivi (usa il tuo stile .trend-details)
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
        if (e.key === 'Escape') {
          if (!tooltip.hidden) hide();
        }
      });

      // Collega tooltip al pulsante (accessibilità)
      tooltip.setAttribute('aria-hidden', 'true');
    });

    // 🔹 Animazione ingresso metriche (usa fadeInUp del tuo CSS)
    document.querySelectorAll('.metric').forEach((el, i) => {
      el.style.opacity = 0;
      el.style.transform = 'translateY(10px)';
      setTimeout(() => {
        el.style.animation = `fadeInUp 0.6s ease forwards`;
        el.style.animationDelay = `${0.1 + i * 0.1}s`;
      }, 50);
    });

  } catch (error) {
    console.warn('Errore nel caricamento dei dati di audit:', error);

    // 🔹 Fallback visivo in caso di errore
    document.querySelectorAll('.progress-circle').forEach(circle => {
      const value = circle.dataset.metric === 'performance' ? 85 : 90;
      circle.style.setProperty('--value', `${value}%`);
      circle.dataset.value = value;
    });

    const lastUpdated = document.getElementById('last-updated');
    if (lastUpdated) {
      lastUpdated.textContent = 'Dati non disponibili';
      lastUpdated.style.color = '#ef5350';
    }

    // Mostra notifica non invasiva
    const notification = document.createElement('div');
    notification.className = 'notification2';
    notification.textContent = '⚠️ Dati temporaneamente non disponibili';
    document.body.appendChild(notification);
    setTimeout(() => {
      notification.style.opacity = 1;
      setTimeout(() => notification.style.opacity = 0, 2000);
    }, 100);
  }
}); 



// 🔹 Carica dati e aggiorna il report visivo
async function updateVisualReport() {
  try {
    const response = await fetch('/biotechproject/data/performance-latest.json');
    if (!response.ok) throw new Error('Dati non disponibili');

    const data = await response.json();

    // 🔹 Media prestazioni
    const avgPerf = document.getElementById('avg-performance');
    if (avgPerf && data.summary?.averagePerformance) {
      avgPerf.textContent = `${data.summary.averagePerformance}%`;
    }

    // 🔹 Ultimo aggiornamento
    const lastUpdated = document.getElementById('last-updated-report');
    if (lastUpdated && data.lastUpdated) {
      const date = new Date(data.lastUpdated);
      lastUpdated.textContent = date.toLocaleDateString('it-IT');
    }

  } catch (error) {
    console.warn('Errore nel caricamento del report visivo:', error);
    document.getElementById('avg-performance').textContent = 'N/D';
    document.getElementById('last-updated-report').textContent = 'Errore';
  }
}

// Esegui al caricamento
document.addEventListener('DOMContentLoaded', updateVisualReport);   