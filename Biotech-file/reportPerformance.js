// Aggiungi dati iniziali per far apparire il grafico
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
}   


// Funzione principale: recupera dati da PageSpeed Insights
async function updatePerformanceData() {
  const url = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';
  const target = 'https://gitechnolo.github.io/biotechproject/index.html';

  try {
    const response = await fetch(`${url}?url=${encodeURIComponent(target)}&strategy=mobile`);
    const data = await response.json();

    const performance = data.lighthouseResult.categories.performance.score * 100;
    const accessibility = data.lighthouseResult.categories.accessibility.score * 100;

    // Aggiorna i cerchi di progresso
    const perfCircle = document.querySelector('.progress-circle[data-metric="performance"]');
    const accessCircle = document.querySelector('.progress-circle[data-metric="accessibility"]');

    if (perfCircle) {
      perfCircle.style.setProperty('--value', Math.round(performance));
    }
    if (accessCircle) {
      accessCircle.style.setProperty('--value', Math.round(accessibility));
    }

    // Aggiorna il testo nei <span>
    const perfSpan = document.querySelector('.progress-circle[data-metric="performance"] span');
    const accessSpan = document.querySelector('.progress-circle[data-metric="accessibility"] span');

    if (perfSpan) {
      perfSpan.textContent = Math.round(performance) + '%';
    }
    if (accessSpan) {
      accessSpan.textContent = Math.round(accessibility) + '%';
    }

    // Salva in localStorage con timestamp
    const log = {
      date: new Date().toISOString().split('T')[0], // es. "2025-08-19"
      performance: Math.round(performance),
      accessibility: Math.round(accessibility)
    };

    const history = JSON.parse(localStorage.getItem('performanceHistory') || '[]');
    const today = log.date;
    const existing = history.find(entry => entry.date === today);

    if (!existing) {
      history.push(log);
      localStorage.setItem('performanceHistory', JSON.stringify(history));
    }

    // Aggiorna il grafico
    drawPerformanceChart();

    // Mostra l'ultimo aggiornamento
    const lastUpdate = document.getElementById('last-update');
    if (lastUpdate) {
      lastUpdate.textContent = `Aggiornato il: ${today}`;
    }

  } catch (error) {
    console.error('Errore nel recupero dei dati di performance:', error);
    // Comunque disegna il grafico con i dati esistenti
    drawPerformanceChart();
  }
}

// Disegna il grafico a linee
function drawPerformanceChart() {
  const ctx = document.getElementById('performance-trend').getContext('2d');
  const history = JSON.parse(localStorage.getItem('performanceHistory') || '[]');

  // Pulisci il canvas
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  if (history.length === 0) {
    ctx.font = '16px Sansation, sans-serif';
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

    // Linee orizzontali
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
  ctx.font = '12px Sansation, sans-serif';
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
  if (labels.length === 1) {
    ctx.fillText(labels[0], ctx.canvas.width / 2, ctx.canvas.height - 10);
  } else {
    ctx.fillText(labels[0], padding, ctx.canvas.height - 10);
    ctx.fillText(labels[labels.length - 1], ctx.canvas.width - padding, ctx.canvas.height - 10);
  }

  // Disegna la linea delle prestazioni
  ctx.beginPath();
  ctx.moveTo(padding, valueToY(data[0]));

  for (let i = 1; i < data.length; i++) {
    const x = padding + (xStep * i);
    const y = valueToY(data[i]);
    ctx.lineTo(x, y);
  }

  // Colore e stile della linea
  ctx.strokeStyle = '#00e676';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.stroke();

  // Area sotto la linea (effetto riempimento con gradiente)
  const gradient = ctx.createLinearGradient(0, padding, 0, ctx.canvas.height);
  gradient.addColorStop(0, 'rgba(0, 230, 118, 0.3)');
  gradient.addColorStop(1, 'rgba(0, 230, 118, 0.05)');

  ctx.lineTo(ctx.canvas.width - padding, ctx.canvas.height - padding);
  ctx.lineTo(padding, ctx.canvas.height - padding);
  ctx.closePath();
  ctx.fillStyle = gradient;
  ctx.fill();

  // Disegna i punti
  ctx.beginPath();
  for (let i = 0; i < data.length; i++) {
    const x = padding + (xStep * i);
    const y = valueToY(data[i]);
    ctx.moveTo(x, y);
    ctx.arc(x, y, 5, 0, Math.PI * 2);
  }
  ctx.fillStyle = '#a7ffeb';
  ctx.fill();
  ctx.strokeStyle = '#00e676';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Mostra l'ultimo valore sopra l'ultimo punto
  const lastX = padding + (xStep * (data.length - 1));
  const lastY = valueToY(data[data.length - 1]);
  ctx.font = '14px Sansation, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.fillText(data[data.length - 1] + '%', lastX, lastY - 10);
}   


// Esegui al caricamento della pagina
document.addEventListener('DOMContentLoaded', () => {
  // Disegna il grafico subito (anche senza dati freschi)
  drawPerformanceChart();

  // Prova ad aggiornare i dati
  updatePerformanceData();

  // Aggiorna ogni 24 ore
  const lastRun = localStorage.getItem('lastPerformanceCheck');
  const now = Date.now();
  if (!lastRun || now - lastRun > 24 * 60 * 60 * 1000) {
    updatePerformanceData();
    localStorage.setItem('lastPerformanceCheck', now);
  }
});   
document.addEventListener('DOMContentLoaded', () => {
  ensureInitialData();           // ← Forza i dati iniziali
  drawPerformanceChart();        // ← Ora il grafico si vedrà!
  updatePerformanceData();       // ← Prova a recuperare dati reali
  // ... resto del codice
});   