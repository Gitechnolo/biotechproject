// Biotech-file/reportPerformance.js

// --- Fallback: popola tutti i cerchi con dati di esempio ---
function populateAllCirclesFallback() {
  const fallbackMetrics = {
    performance: 98,
    accessibility: 100,
    'best-practices': 100,
    seo: 100,
    'performance-desktop': 100
  };

  Object.keys(fallbackMetrics).forEach(metric => {
    const circle = document.querySelector(`.progress-circle[data-metric="${metric}"]`);
    if (circle) {
      const value = fallbackMetrics[metric];
      circle.style.setProperty('--value', value + '%');
      circle.dataset.value = value;
      const valueEl = circle.querySelector('.value');
      if (valueEl) valueEl.textContent = value;
    }
  });
}

// --- Mostra notifica all'utente ---
function showNotification(message) {
  const notification = document.getElementById('notification');
  if (notification) {
    notification.textContent = message;
    notification.classList.add('show');
    setTimeout(() => notification.classList.remove('show'), 3000);
  }
}          