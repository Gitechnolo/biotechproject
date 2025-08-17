// BIOTECH NEW YEAR COUNTDOWN - Versione aggiornata
(function () {
  // Cerca l'elemento con id="countdown-days"
  const element = document.getElementById('countdown-days');
  if (!element) return; // Esci se non esiste

  const now = new Date();
  let newYear = new Date(now.getFullYear(), 11, 31); // 31 dicembre
  if (newYear < now) {
    newYear.setFullYear(newYear.getFullYear() + 1); // Prossimo anno
  }

  const msPerDay = 86400000; // 1000 * 60 * 60 * 24
  const remainingDays = Math.ceil((newYear - now) / msPerDay);

  // Aggiorna SOLO il contenuto del <span>
  element.textContent = remainingDays;
})();   
