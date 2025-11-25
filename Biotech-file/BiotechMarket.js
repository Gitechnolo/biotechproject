// Market trend graph with forecast (storico + previsione)
const ctx = document.getElementById('marketGraph').getContext('2d');

  // Dati storici (2017–2023)
  const data = [120, 135, 150, 170, 160, 180, 210];
  // Previsioni (2024–2029)
  const forecast = [230, 250, 270, 300, 340, 380];

  // Pulizia del canvas
  ctx.clearRect(0, 0, 500, 220);

  // Sfondo trasparente
  ctx.fillStyle = "transparent";
  ctx.fillRect(0, 0, 500, 220);

  // --- Dati Storici (linea bianca) ---
  ctx.strokeStyle = "#e7e7e7";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(30, 200 - data[0]);
  for (let i = 1; i < data.length; i++) {
    ctx.lineTo(30 + i * 40, 200 - data[i]);
  }
  ctx.stroke();

  // --- Previsioni (linea tratteggiata verde) ---
  ctx.save(); // Salva lo stato prima del tratteggio
  ctx.setLineDash([8, 6]);
  ctx.strokeStyle = "#00ff55";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(30 + (data.length - 1) * 40, 200 - data[data.length - 1]);
  for (let i = 0; i < forecast.length; i++) {
    ctx.lineTo(30 + (data.length + i) * 40, 200 - forecast[i]);
  }
  ctx.stroke();
  ctx.restore(); // ✅ Ripristina lo stato: fine del tratteggio

  // --- Punti: Storici (bianchi) ---
  ctx.fillStyle = "#e7e7e7";
  for (let i = 0; i < data.length; i++) {
    ctx.beginPath();
    ctx.arc(30 + i * 40, 200 - data[i], 4, 0, 2 * Math.PI);
    ctx.fill();
  }

  // --- Punti: Previsioni (verdi) ---
  ctx.fillStyle = "#00ff55";
  for (let i = 0; i < forecast.length; i++) {
    ctx.beginPath();
    ctx.arc(30 + (data.length + i) * 40, 200 - forecast[i], 4, 0, 2 * Math.PI);
    ctx.fill();
  }

    // --- Etichette ---
// Titolo
ctx.fillStyle = "#e7e7e7";
ctx.font = "bold 16px monospace";
ctx.fillText("Crescita Mercato Cibernetica", 80, 30);

// Etichette asse X (anni)
const years = [
  "2017", "2018", "2019", "2020", "2021", "2022", "2023",
  "2024", "2025", "2026", "2027", "2028", "2029"
];
ctx.font = "12px monospace";
for (let i = 0; i < data.length + forecast.length; i++) {
  ctx.fillStyle = i < data.length ? "#e7e7e7" : "#00ff55";
  ctx.fillText(years[i], 30 + i * 40 - 10, 215);
}

// Etichetta asse Y ruotata (-90 gradi)
ctx.save();
ctx.translate(15, 110);
ctx.rotate(-Math.PI / 2);
ctx.fillStyle = "#e7e7e7";
ctx.font = "12px monospace";
ctx.fillText("Valore Mercato", 0, 0);
ctx.restore();

// --- Legenda ---
// Storico
ctx.fillStyle = "#e7e7e7";
ctx.fillRect(340, 40, 18, 4);
ctx.fillText("Storico", 365, 46);

// Previsione (linea tratteggiata verde)
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

// --- Testo esplicativo ---
ctx.font = "italic 13px monospace";
ctx.fillStyle = "#00ff55";
ctx.fillText("Previsioni fino al 2029", 320, 90);

function mapValue(value, min, max, toMin, toMax) {
  return toMin + (toMax - toMin) * (value - min) / (max - min);
}   