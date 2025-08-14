// Biotech modal popup script for Progetti.html/Dermatologia.html/Apparato_tegumentario.html...
// Works for any number of images with id starting with 'myImg'
document.addEventListener("DOMContentLoaded", function () {
  // ✅ 1. Recupera gli elementi principali del modal
  const modal = document.getElementById("myModal");
  const modalImg = document.getElementById("img01");
  const captionText = document.getElementById("caption");
  const closeBtn = modal?.querySelector(".close") || document.querySelector("#myModal .close");

  // ✅ 2. Verifica che il modal e i suoi componenti esistano
  if (!modal || !modalImg || !captionText) {
    console.warn("Modal non trovato o elementi mancanti. Assicurati che #myModal, #img01 e #caption siano presenti.");
    return; // Esci se il modal non c'è
  }

  // ✅ 3. Lista degli ID delle immagini da gestire
  const imageIds = ["myImg", "myImg2", "myImg3", "myImg4", "myImg5", "myImg6"];

  // ✅ 4. Collega l'evento click a ogni immagine esistente
  imageIds.forEach(function (imgId) {
    const img = document.getElementById(imgId);
    if (img) {
      img.addEventListener("click", function () {
        modal.style.display = "block";
        modalImg.src = this.src;
        captionText.textContent = this.alt || ""; // Usa testo vuoto se alt manca
      });
    }
    // Se l'immagine non esiste, ignora silenziosamente — nessun errore
  });

  // ✅ 5. Chiudi il modal con la "X"
  if (closeBtn) {
    closeBtn.onclick = function () {
      modal.style.display = "none";
      modalImg.src = "";
      captionText.textContent = "";
    };
  } else {
    console.warn("Pulsante .close non trovato all'interno di #myModal.");
  }

  // ✅ 6. Chiudi cliccando fuori dall'immagine
  modal.onclick = function (e) {
    if (e.target === modal) {
      modal.style.display = "none";
      modalImg.src = "";
      captionText.textContent = "";
    }
  };
});
// End Biotech modal popup script