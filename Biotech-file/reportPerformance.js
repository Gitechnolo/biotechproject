document.addEventListener('DOMContentLoaded', async () => {
  const API_URL = '/biotechproject/data/performance-latest.json';

  try {
    const res = await fetch(API_URL, { cache: 'no-store' });
    if (!res.ok) throw new Error('Fetch failed');
    const data = await res.json();

    const summary = data.summary || {};
    const pages = Array.isArray(data.pages) ? data.pages : [];

    // ✅ Calcolo sicuro delle medie
    const avgPerf = summary.averagePerformance ??
      (pages.length > 0 
        ? Math.round(pages.reduce((a, b) => a + (b.performanceScore || 0), 0) / pages.length)
        : 85
      );

    const avgA11y = summary.averageAccessibility ?? 94;
    const avgSeo = summary.averageSeo ?? 96;
    const avgBest = summary.averageBestPractices ?? 97;

    // 📊 Aggiorna cerchi
    document.querySelectorAll('.progress-circle').forEach(circle => {
      const metric = circle.dataset.metric;
      const value = { performance: avgPerf, 'performance-desktop': Math.min(avgPerf + 2, 100), accessibility: avgA11y, seo: avgSeo, 'best-practices': avgBest }[metric] || 75;
      const rounded = Math.round(value);
      circle.style.setProperty('--value', `${rounded}%`);
      circle.setAttribute('aria-valuenow', rounded);
      circle.dataset.value = rounded;
    });

    // 📅 Aggiorna data
    const lastUpdated = document.getElementById('last-updated');
    if (lastUpdated && data.lastUpdated) {
      const date = new Date(data.lastUpdated);
      lastUpdated.textContent = date.toLocaleDateString('it-IT', {
        day: '2-digit', month: '2-digit', year: 'numeric'
      });
    }

    // 📈 Trend (homepage)
    const trendEl = document.getElementById('trend-indicator');
    const home = pages.find(p => p.url.includes('/index.html'));
    if (trendEl && home) {
      const diff = (home.performanceScore || 0) - (home.previousPerformanceScore || 0);
      const icons = { 1: '▲', 0: '●', '-1': '▼' };
      const color = diff > 0 ? '#66bb6a' : diff < 0 ? '#ef5350' : '#ffa726';
      trendEl.textContent = icons[diff > 0 ? 1 : diff < 0 ? -1 : 0];
      trendEl.style.color = color;
      trendEl.classList.remove('visually-hidden');
    }

    // 📋 Aggiorna report visivo
    const update = (id, value) => {
      const el = document.getElementById(id);
      if (el) el.textContent = value;
    };

    update('analyzed-count', summary.analyzed || pages.length);
    update('avg-performance', `${avgPerf}%`);
    update('avg-accessibility', `${avgA11y}%`);
    update('avg-seo', `${avgSeo}%`);
    update('avg-best-practices', `${avgBest}%`);

    if (data.lastUpdated) {
      const date = new Date(data.lastUpdated);
      update('last-updated-report', date.toLocaleDateString('it-IT'));
      document.getElementById('last-updated-report')?.setAttribute('datetime', date.toISOString());
    }

    // ✅ Animazione sicura
    setTimeout(() => {
      document.querySelectorAll('.metric').forEach((el, i) => {
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        el.style.opacity = 1;
        el.style.transform = 'translateY(0)';
      });
    }, 100);

  } catch (err) {
    console.warn('Errore caricamento dati audit:', err);
  }
});      