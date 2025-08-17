// BIOTECH NEW YEAR COUNTDOWN - Retrocompatibile
(function () {
  // Metodo 1: Aggiorna l'elemento con id="countdown-days" se esiste
  const element = document.getElementById('countdown-days');
  if (element) {
    const now = new Date();
    let newYear = new Date(now.getFullYear(), 11, 31);
    if (newYear < now) {
      newYear.setFullYear(newYear.getFullYear() + 1);
    }
    const remainingDays = Math.ceil((newYear - now) / 86400000);
    element.textContent = remainingDays;
    return; // Esci: il lavoro è fatto
  }

  // Metodo 2: Retrocompatibilità per clienti (inserimento dopo lo script)
  const nowFallback = new Date();
  let newYearFallback = new Date(nowFallback.getFullYear(), 11, 31);
  if (newYearFallback < nowFallback) {
    newYearFallback.setFullYear(newYearFallback.getFullYear() + 1);
  }
  const remainingDaysFallback = Math.ceil((newYearFallback - nowFallback) / 86400000);
  
  // Inserisce il testo dopo lo script (come prima)
  document.currentScript.insertAdjacentHTML(
    'afterend',
    '&nbsp;' + remainingDaysFallback + ' giorni al nuovo anno!'
  );
})();   
