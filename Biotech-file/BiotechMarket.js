// BiotechMarket.js - Sistema di previsione con rete neurale integrata
(async () => {
  try {
    // Carica Brain.js dinamicamente
    const brain = await import('https://cdn.jsdelivr.net/npm/brain.js@2.0.0-beta.32/dist/browser.js');

    // Dati storici (2017–2023)
    const historicalData = [120, 135, 150, 170, 160, 180, 210];
    const years = Array.from({ length: 7 }, (_, i) => 2017 + i);

    // Normalizza i dati per il training
    const minVal = Math.min(...historicalData);
    const maxVal = Math.max(...historicalData);
    const normalizedData = historicalData.map((val, i) => ({
      input: [i / 6],
      output: [(val - minVal) / (maxVal - minVal)]
    }));

    // Crea e addestra la rete neurale
    const net = new brain.NeuralNetwork({
      hiddenLayers: [3],
      activation: 'sigmoid',
      learningRate: 0.2
    });

    net.train(normalizedData, {
      iterations: 2000,
      errorThresh: 0.005,
      log: false
    });

    // Genera previsioni (2024–2029)
    const forecastYears = Array.from({ length: 6 }, (_, i) => 2024 + i);
    const forecast = forecastYears.map((_, i) => {
      const normInput = (7 + i) / 6;
      const normOutput = net.run([normInput])[0];
      return Math.round(normOutput * (maxVal - minVal) + minVal);
    });

    // Disegna il grafico
    const ctx = document.getElementById('marketGraph').getContext('2d');
    ctx.clearRect(0, 0, 500, 220);
    ctx.fillStyle = "transparent";
    ctx.fillRect(0, 0, 500, 220);

    // Linea storica (bianca)
    ctx.strokeStyle = "#e7e7e7";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(30, 200 - historicalData[0]);
    for (let i = 1; i < historicalData.length; i++) {
      ctx.lineTo(30 + i * 40, 200 - historicalData[i]);
    }
    ctx.stroke();

    // Previsioni (verde tratteggiato)
    ctx.save();
    ctx.setLineDash([8, 6]);
    ctx.strokeStyle = "#00ff55";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(30 + 6 * 40, 200 - historicalData[6]);
    for (let i = 0; i < forecast.length; i++) {
      ctx.lineTo(30 + (7 + i) * 40, 200 - forecast[i]);
    }
    ctx.stroke();
    ctx.restore();

    // Punti storici (bianchi)
    ctx.fillStyle = "#e7e7e7";
    historicalData.forEach((val, i) => {
      ctx.beginPath();
      ctx.arc(30 + i * 40, 200 - val, 4, 0, 2 * Math.PI);
      ctx.fill();
    });

    // Punti previsioni (verdi)
    ctx.fillStyle = "#00ff55";
    forecast.forEach((val, i) => {
      ctx.beginPath();
      ctx.arc(30 + (7 + i) * 40, 200 - val, 4, 0, 2 * Math.PI);
      ctx.fill();
    });

    // Etichette (mantenute come nell'originale)
    ctx.fillStyle = "#e7e7e7";
    ctx.font = "bold 16px monospace";
    ctx.fillText("Crescita Mercato Cibernetica", 80, 30);

    ctx.font = "12px monospace";
    const allYears = [...years, ...forecastYears];
    for (let i = 0; i < allYears.length; i++) {
      ctx.fillStyle = i < 7 ? "#e7e7e7" : "#00ff55";
      ctx.fillText(allYears[i], 30 + i * 40 - 10, 215);
    }

    // Etichetta asse Y
    ctx.save();
    ctx.translate(15, 110);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText("Valore Mercato", 0, 0);
    ctx.restore();

    // Legenda
    ctx.fillStyle = "#e7e7e7";
    ctx.fillRect(340, 40, 18, 4);
    ctx.fillText("Storico", 365, 46);

    ctx.save();
    ctx.setLineDash([8, 6]);
    ctx.strokeStyle = "#00ff55";
    ctx.beginPath();
    ctx.moveTo(340, 60);
    ctx.lineTo(358, 60);
    ctx.stroke();
    ctx.restore();

    ctx.fillStyle = "#00ff55";
    ctx.fillText("Previsione", 365, 65);
    ctx.font = "italic 13px monospace";
    ctx.fillText("Previsioni AI fino al 2029", 320, 90);

  } catch (error) {
    console.error('Errore nel caricamento della rete neurale:', error);
  }
})();      