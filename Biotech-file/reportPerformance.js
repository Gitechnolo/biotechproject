// === BIOTECH PERFORMANCE MONITOR - SCRIPT COMPLETO E OTTIMIZZATO ===
// Versione: 1.0 | Fallback locale | UI robusta

// Assicura dati iniziali per il grafico
function ensureInitialData() {
  const history = JSON.parse(localStorage.getItem('performanceHistory') || '[]');
  if (history.length === 0) {
    console.log('Nessun dato trovato. Inserisco dati di esempio...');
    const testData = [
      { date: '2025-08-01', performance: 90 },
      { date: '2025-08-05', performance: 92 },
      { date: '2025-08-08', performance: 94 },
      { date: '2025-08-12', performance: 96 },
      { date: '2025-08-16', performance: 98 },
      { date: '2025-08-19', performance: 99 }
    ];
    localStorage.setItem('performanceHistory', JSON.stringify(testData));
  }
  cleanupOldHistory(); // Pulizia dati vecchi
}

// Pulisce i dati più vecchi di 30 giorni
function cleanupOldHistory() {
  const history = JSON.parse(localStorage.getItem('performanceHistory') || '[]');
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const filtered = history.filter(entry => new Date(entry.date) >= thirtyDaysAgo);
  if (filtered.length !== history.length) {
    localStorage.setItem('performanceHistory', JSON.stringify(filtered));
  }
}

// Funzione principale: aggiorna i dati da fonte affidabile
async function updatePerformanceData() {
  const url = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';
  const target = 'https://gitechnolo.github.io/biotechproject/index.html';

  const btn = document.getElementById('refresh-btn');
  if (btn) {
    btn.disabled = true;
    btn.textContent = 'Aggiornamento...';
  }

  try {
    // Chiamata per mobile
    const mobileResponse = await fetch(
      `${url}?url=${encodeURIComponent(target)}&strategy=mobile`
    );
    if (!mobileResponse.ok) throw new Error(`Errore API (mobile): ${mobileResponse.status}`);

    const mobileData = await mobileResponse.json();

    // Chiamata per desktop
    const desktopResponse = await fetch(
      `${url}?url=${encodeURIComponent(target)}&strategy=desktop`
    );
    if (!desktopResponse.ok) throw new Error(`Errore API (desktop): ${desktopResponse.status}`);

    const desktopData = await desktopResponse.json();

    // Verifica dati validi
    if (!mobileData.lighthouseResult?.categories) {
      throw new Error('Dati mobile non validi');
    }
    if (!desktopData.lighthouseResult?.categories) {
      throw new Error('Dati desktop non validi');
    }

    // Estrai punteggi (già in formato 0.0–1.0 → moltiplica per 100)
    const metrics = {
      performance: Math.round(mobileData.lighthouseResult.categories.performance.score * 100),
      accessibility: Math.round(mobileData.lighthouseResult.categories.accessibility.score * 100),
      'best-practices': Math.round(mobileData.lighthouseResult.categories['best-practices'].score * 100),
      seo: Math.round(mobileData.lighthouseResult.categories.seo.score * 100),
      'performance-desktop': Math.round(desktopData.lighthouseResult.categories.performance.score * 100)
    };
       // Aggiorna cerchi
    Object.keys(metrics).forEach(metric => {
      const circle = document.querySelector(`.progress-circle[data-metric="${metric}"]`);
      if (circle) {
        const value = metrics[metric];
        circle.style.setProperty('--value', value);
        circle.dataset.value = value;
      }
    });

    // Salva nuovo record storico
    const today = new Date().toISOString().split('T')[0];
    const log = {
      date: today,
      performance: metrics.performance,
      accessibility: metrics.accessibility
    };

    const history = JSON.parse(localStorage.getItem('performanceHistory') || '[]');
    const existing = history.find(entry => entry.date === today);

    if (!existing) {
      history.push(log);
      localStorage.setItem('performanceHistory', JSON.stringify(history));
      console.log('Nuovo dato salvato:', log);
    }

    // Aggiorna grafico e punteggio
    drawPerformanceChart();
    updatePerformanceScore();

    // Aggiorna timestamp UI
    const lastUpdate = document.getElementById('last-update');
    if (lastUpdate) {
      const now = new Date();
      const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' };
      lastUpdate.textContent = `Aggiornato il: ${now.toLocaleString('it-IT', options)}`;
    }

    // Salva ultimo aggiornamento
    localStorage.setItem('lastPerformanceCheck', Date.now().toString());

    showNotification('✅ Dati aggiornati con successo!');
  } catch (error) {
    console.warn('Errore nel recupero dati da API:', error);
    // Fallback: mostra comunque i dati locali
    drawPerformanceChart();
    updatePerformanceScore();

    const lastUpdate = document.getElementById('last-update');
    if (lastUpdate) {
      lastUpdate.textContent = 'Aggiornato: dati locali (API non disponibile)';
    }

    showNotification('⚠️ API non raggiungibile. Usati dati locali.');
  } finally {
    // Riabilita il pulsante
    const btn = document.getElementById('refresh-btn');
    if (btn) {
      btn.disabled = false;
      btn.textContent = 'Aggiorna ora';
    }
  }
}

// Disegna il grafico delle prestazioni
function drawPerformanceChart() {
  const ctx = document.getElementById('performance-trend')?.getContext('2d');
  if (!ctx) return;

  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  const history = JSON.parse(localStorage.getItem('performanceHistory') || '[]');
  if (history.length === 0) {
    ctx.font = '14px "Sansation", sans-serif';
    ctx.fillStyle = '#a7ffeb';
    ctx.textAlign = 'center';
    ctx.fillText('Dati in arrivo...', ctx.canvas.width / 2, ctx.canvas.height / 2);
    return;
  }

  const labels = history.map(entry => entry.date);
  const data = history.map(entry => entry.performance);

  const padding = 40;
  const chartWidth = ctx.canvas.width - padding * 2;
  const chartHeight = ctx.canvas.height - padding * 2;
  const xStep = chartWidth / (Math.max(data.length - 1, 1));
  const minValue = Math.max(0, Math.min(...data) - 5);
  const maxValue = 100;

  const valueToY = (value) => {
    const ratio = (value - minValue) / (maxValue - minValue);
    return padding + chartHeight - (ratio * chartHeight);
  };

  // Griglia orizzontale
  ctx.beginPath();
  ctx.strokeStyle = 'rgba(167, 255, 235, 0.2)';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 5; i++) {
    const y = padding + (chartHeight * i / 5);
    ctx.moveTo(padding, y);
    ctx.lineTo(ctx.canvas.width - padding, y);
  }
  ctx.stroke();

// Etichette asse Y
  ctx.font = '12px "Sansation", sans-serif';
  ctx.fillStyle = '#a7ffeb';
  ctx.textAlign = 'right';
  for (let i = 0; i <= 5; i++) {
    const value = Math.round(minValue + (maxValue - minValue) * (1 - i / 5));
    const y = padding + (chartHeight * i / 5);
    ctx.fillText(value + '%', padding - 10, y + 4);
  }

  // Etichette asse X (date)
  ctx.textAlign = 'center';
  ctx.fillStyle = '#a7ffeb';
  ctx.font = '12px "Sansation", sans-serif';
  if (labels.length === 1) {
    ctx.fillText(labels[0], ctx.canvas.width / 2, ctx.canvas.height - 10);
  } else {
    const step = Math.ceil(labels.length / 5); // max 5 etichette
    for (let i = 0; i < labels.length; i += step) {
      const x = padding + (xStep * i);
      ctx.fillText(labels[i], x, ctx.canvas.height - 10);
    }
  }

  // Disegna la linea delle prestazioni
  ctx.beginPath();
  ctx.moveTo(padding, valueToY(data[0]));
  for (let i = 1; i < data.length; i++) {
    const x = padding + (xStep * i);
    const y = valueToY(data[i]);
    ctx.lineTo(x, y);
  }
  ctx.strokeStyle = '#00e676';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.stroke();

  // Area sotto la linea (gradiente)
  const gradient = ctx.createLinearGradient(0, padding, 0, ctx.canvas.height);
  gradient.addColorStop(0, 'rgba(0, 230, 118, 0.3)');
  gradient.addColorStop(1, 'rgba(0, 230, 118, 0.05)');

  ctx.lineTo(ctx.canvas.width - padding, ctx.canvas.height - padding);
  ctx.lineTo(padding, ctx.canvas.height - padding);
  ctx.closePath();
  ctx.fillStyle = gradient;
  ctx.fill();

  // Disegna i punti sul grafico
  for (let i = 0; i < data.length; i++) {
    const x = padding + (xStep * i);
    const y = valueToY(data[i]);
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#a7ffeb';
    ctx.fill();
    ctx.strokeStyle = '#00e676';
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  // Mostra l'ultimo valore sopra l'ultimo punto
  const lastX = padding + (xStep * (data.length - 1));
  const lastY = valueToY(data[data.length - 1]);
  ctx.font = '14px "Sansation", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.fillText(data[data.length - 1] + '%', lastX, lastY - 10);
}

// Aggiorna il punteggio centrale
function updatePerformanceScore() {
  const history = JSON.parse(localStorage.getItem('performanceHistory') || '[]');
  const score = history.length > 0 ? history[history.length - 1].performance : 90;
  const scoreElement = document.getElementById('performance-score');
  if (scoreElement) {
    scoreElement.textContent = Math.round(score);
  }
}

// Mostra una notifica in alto a destra
function showNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.innerHTML = message;
  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), 3000);
}

// Esegui al caricamento della pagina
document.addEventListener('DOMContentLoaded', () => {
  ensureInitialData();
  drawPerformanceChart();
  updatePerformanceScore();

// Aggiorna ogni 24 ore
  const lastRun = localStorage.getItem('lastPerformanceCheck');
  const now = Date.now();
  if (!lastRun || now - parseInt(lastRun) > 24 * 60 * 60 * 1000) {
    updatePerformanceData();
    localStorage.setItem('lastPerformanceCheck', now.toString());
  }

  // Pulsante "Aggiorna ora"
  const refreshBtn = document.getElementById('refresh-btn');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      // Debounce: impedisce click multipli in rapida successione
      if (refreshBtn.disabled) return;
      updatePerformanceData();
    });
  }
});   