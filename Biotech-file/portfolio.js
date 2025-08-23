// ================================
// PERFORMANCE DASHBOARD: Ottimizzato
// ================================

// --- 1. Filtro con debounce e animazione fluida ---
function filterSelection(category) {
  const items = document.querySelectorAll('.portfolio-col');
  window.requestAnimationFrame(() => {
    items.forEach(item => {
      const show = category === 'all' || item.classList.contains(category);
      item.classList.toggle('portfolio-show', show);
    });
  });
}

// Inizializza il filtro
filterSelection('all');

// --- 2. Gestione pulsanti filtro (con classe attiva) ---
document.addEventListener('DOMContentLoaded', () => {
  const btnContainer = document.getElementById('myBtnContainer');
  if (btnContainer) {
    const buttons = btnContainer.querySelectorAll('.btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', function () {
        buttons.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        filterSelection(this.dataset.filter || 'all');
      });
    });
  }

  // --- 3. Lazy loading con IntersectionObserver ---
  const images = document.querySelectorAll('.portfolio-content img[data-src]');
  if ('IntersectionObserver' in window) {
    const imgObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.add('loaded'); // Opzionale: animazione al caricamento
          observer.unobserve(img);
        }
      });
    }, { threshold: 0.05 });

    images.forEach(img => imgObserver.observe(img));
  } else {
    // Fallback: carica subito
    images.forEach(img => {
      img.src = img.dataset.src || img.src;
      img.classList.add('loaded');
    });
  }

  // --- 4. Caricamento dinamico dei dati performance ---
  loadPerformanceData();
});

// --- 5. Carica dati da JSON e popola la dashboard ---
async function loadPerformanceData() {
  try {
    const response = await fetch('/Biotech-file/performance-data.json');
    if (!response.ok) throw new Error('Dati non disponibili');

    const data = await response.json();
    const container = document.querySelector('.portfolio-row');
    if (!container) return;

    // Pulisce il contenuto esistente
    container.innerHTML = '';

    // Genera le celle dinamicamente
    data.pages.forEach(page => {
      const cell = createPerformanceCard(page);
      container.appendChild(cell);
    });

    // Riattiva lazy loading se ci sono immagini (es. screenshot)
    const newImages = document.querySelectorAll('.portfolio-content img[data-src]');
    if ('IntersectionObserver' in window && newImages.length > 0) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.add('loaded');
            observer.unobserve(img);
          }
        });
      }, { threshold: 0.1 });

      newImages.forEach(img => observer.observe(img));
    }

  } catch (err) {
    console.warn('Errore nel caricamento dei dati di performance:', err.message);
    fallbackToStaticContent();
  }
}
// --- 6. Crea una card delle performance ---
function createPerformanceCard(page) {
  const col = document.createElement('div');
  col.className = `portfolio-col ${page.category || 'other'} portfolio-show`;
  col.setAttribute('data-page', page.slug);

  // Calcola colore in base al punteggio
  const score = page.performanceScore || 0;
  const color = getScoreColor(score);

  // Genera il markup della card
  col.innerHTML = `
    <div class="portfolio-content">
      <!-- Indicatore circolare del punteggio -->
      <div class="perf-meter" style="background: conic-gradient(${color} ${score}%, #e0e0e0 ${score}%)">
        <span>${score}</span>
      </div>
      <div class="fadebox">
        <strong>${page.title}</strong><br>
        Score: ${score}/100 • ${formatLoadTime(page.loadTime)}
      </div>
      <p class="greentext">${page.label}</p>
    </div>
  `;

  return col;
}

// --- 7. Mappa il punteggio a un colore ---
function getScoreColor(score) {
  if (score >= 90) return '#4CAF50';   // Verde (Ottimo)
  if (score >= 75) return '#8BC34A';   // Verde chiaro (Buono)
  if (score >= 60) return '#FF9800';   // Arancione (Medio)
  return '#F44336';                    // Rosso (Scadente)
}

// --- 8. Formatta il tempo di caricamento ---
function formatLoadTime(ms) {
  if (!ms) return '– ms';
  return ms < 1000 ? `${ms} ms` : `${(ms / 1000).toFixed(2)} s`;
}

// --- 9. Fallback: ripristina il contenuto statico se JSON non disponibile ---
function fallbackToStaticContent() {
  console.log('Fallback attivato: utilizzo del contenuto HTML statico.');
  // Non fa nulla: il contenuto HTML esistente rimane
  // Puoi anche rigenerare qui le card in base a dati hardcoded, se preferisci
}
// --- 10. (Opzionale) Aggiorna periodicamente i dati ---
// Utile se hai un monitoraggio in tempo reale
/*
setInterval(() => {
  console.log('Aggiornamento automatico dei dati performance...');
  loadPerformanceData();
}, 5 * 60 * 1000); // Ogni 5 minuti
*/
document.getElementById('refresh-btn')?.addEventListener('click', async () => {
  await loadPerformanceData();
  showNotification('Dati aggiornati con successo');
});
function showNotification(message) {
  const notif = document.createElement('div');
  notif.className = 'notification';
  notif.textContent = message;
  document.body.appendChild(notif);
  setTimeout(() => notif.remove(), 3000);
}    
