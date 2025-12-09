// Biotech modal popup script for Progetti.html/Dermatologia.html/Apparato_tegumentario.html...
// Works for any number of images with id starting with 'myImg'
document.addEventListener("DOMContentLoaded", function () {
  
  // ✅ 1. Recupera gli elementi principali del modal
  const modal = document.getElementById("myModal");
  const modalImg = document.getElementById("img01");
  const captionText = document.getElementById("caption");
  // Uso una sintassi più robusta per closeBtn
  const closeBtn = modal ? modal.querySelector(".close") : document.querySelector("#myModal .close");

  // Variabile per tracciare l'elemento che ha aperto il modale (per restituire il focus)
  let lastFocusedElement = null;

  // ✅ 2. Verifica che il modal e i suoi componenti esistano
  if (!modal || !modalImg || !captionText || !closeBtn) {
    console.warn("Elementi critici del Modal non trovati. Controllo: #myModal, #img01, #caption, .close.");
    return;
  }
  
  // --- FUNZIONI DI GESTIONE FOCUS/MODALE ---
  
  /**
   * Apre il modale, imposta l'immagine e sposta il focus sul pulsante di chiusura.
   * @param {HTMLElement} imgElement - L'elemento immagine che ha innescato l'apertura.
   */
  function openModal(imgElement) {
    // 1. Salva l'elemento corrente
    lastFocusedElement = imgElement; 
    
    // 2. Popola e mostra il modale
    modal.style.display = "block";
    modalImg.src = imgElement.src;
    captionText.textContent = imgElement.alt || ""; 

    // 3. Sposta il focus sul pulsante di chiusura per l'accessibilità da tastiera
    closeBtn.focus(); 
  }

  /**
   * Chiude il modale, pulisce il contenuto e ripristina il focus sull'elemento precedente.
   */
  function closeModal() {
    modal.style.display = "none";
    modalImg.src = "";
    captionText.textContent = "";

    // 4. Ripristina il focus sull'elemento che ha aperto il modale
    if (lastFocusedElement) {
        lastFocusedElement.focus();
        lastFocusedElement = null; // Pulisce il riferimento
    }
  }
  
  // --- INIZIALIZZAZIONE ---

  // ✅ 3. Lista degli ID delle immagini da gestire
  const imageIds = ["myImg", "myImg2", "myImg3", "myImg4", "myImg5", "myImg6"];

  // ✅ 4. Collega gli eventi (Click e Keyup) a ogni immagine esistente
  imageIds.forEach(function (imgId) {
    const img = document.getElementById(imgId);
    if (img) {
      // 1. Evento: Click del mouse (USA LA NUOVA FUNZIONE openModal)
      img.addEventListener("click", function () {
        openModal(this);
      });

      // 2. Evento: Apertura da tastiera (Enter o Space)
      img.addEventListener("keyup", function (event) {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault(); // Impedisce lo scorrimento
          openModal(this); 
        }
      });
    }
  });

  // ✅ 5. Chiudi il modal con la "X"
  // 1. Evento: Click del mouse (USA LA NUOVA FUNZIONE closeModal)
  closeBtn.onclick = closeModal;
  
  // 2. Evento: Chiusura da tastiera (Enter o Space) sulla "X"
  closeBtn.addEventListener("keyup", function (event) {
      if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          closeModal(); 
      }
  });


  // ✅ 6. Chiudi cliccando fuori dall'immagine
  modal.onclick = function (e) {
    if (e.target === modal) {
      closeModal();
    }
  };

  // ✅ 7. Chiusura con tasto ESC (standard ARIA)
  document.addEventListener("keydown", function (event) {
    // Usiamo keydown per intercettare l'Esc prima che il browser possa agire
    if (event.key === 'Escape' && modal.style.display === "block") {
      event.preventDefault();
      closeModal();
    }
  });
});
// End Biotech modal popup script