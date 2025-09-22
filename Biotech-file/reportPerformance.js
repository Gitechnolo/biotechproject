// Function to fill .progress-circle elements with data
function fillProgressCircles(data) {
  // Trova la homepage
  const homePage = data.pages.find(p => p.url.endsWith('/index.html'));
  const performanceScore = homePage ? homePage.performanceScore : 85;

  // Seleziona tutti i cerchi
  const progressElements = document.querySelectorAll('.progress-circle');

  progressElements.forEach((el, index) => {
    let value;

    switch (el.dataset.metric) {
      case 'performance':
      case 'performance-desktop':
        value = performanceScore;
        break;
      case 'seo':
        value = 90; // Valore stimato o da aggiungere in futuro
        break;
      case 'accessibility':
        value = 88;
        break;
      case 'best-practices':
        value = 85;
        break;
      default:
        value = 75;
    }

    // Aggiorna lo stile e il testo
    el.dataset.value = value;
    el.textContent = `${value}%`;

    // Se usi CSS con --value (come in style="--value: 100")
    if (el.style.setProperty) {
      el.style.setProperty('--value', value);
    }
  });
} 
// Function to fetch performance data and populate circles
async function fetchPerformanceData() {
  try {
    const response = await fetch('/biotechproject/data/performance-latest.json');
    if (!response.ok) throw new Error('Dati non disponibili');

    const data = await response.json();
    fillProgressCircles(data);
  } catch (error) {
    console.warn('Errore nel caricamento dei dati:', error);
    // Opzionale: usa dati di fallback
    const fakeData = { pages: [{ url: '/index.html', performanceScore: 85 }] };
    fillProgressCircles(fakeData);
  }
}

// Inizializza al caricamento della pagina
document.addEventListener('DOMContentLoaded', fetchPerformanceData);   