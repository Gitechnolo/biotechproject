// Biotech modal popup script - Versione FIX 2026 - Progetti.html/Dermatologia.html/Apparato_tegumentario.html...
document.addEventListener("DOMContentLoaded", function () {
  
  const modal = document.getElementById("myModal");
  const modalImg = document.getElementById("img01");
  const captionText = document.getElementById("caption");
  const closeBtn = document.querySelector(".close");

  let lastFocusedElement = null;

  if (!modal || !modalImg || !closeBtn) return;

  function openModal(imgElement) {
    lastFocusedElement = imgElement; 
    
    // Ripristiniamo il display block originale per evitare spostamenti in basso
    modal.style.display = "block";
    modalImg.src = imgElement.src;
    captionText.textContent = imgElement.alt || ""; 

    // Forza lo z-index via JS per sicurezza
    modal.style.zIndex = "20000";
    closeBtn.style.zIndex = "20001";

    setTimeout(() => {
      closeBtn.focus();
    }, 50);
  }

  function closeModal() {
    modal.style.display = "none";
    modalImg.src = "";
    captionText.textContent = "";

    if (lastFocusedElement) {
        lastFocusedElement.focus();
        lastFocusedElement = null;
    }
  }
  
  // --- GESTIONE IMMAGINI ---
  const imageIds = ["myImg", "myImg2", "myImg3", "myImg4", "myImg5", "myImg6"];

  imageIds.forEach(function (imgId) {
    const img = document.getElementById(imgId);
    if (img) {
      img.onclick = function() { openModal(this); };
      img.onkeyup = function(e) {
        if (e.key === 'Enter' || e.key === ' ') { openModal(this); }
      };
    }
  });

  // --- FIX CHIUSURA (MOUSE + TOUCH) ---
  
  // Usiamo mousedown invece di click: è più rapido e "buca" eventuali sovrapposizioni
  closeBtn.addEventListener("mousedown", function(e) {
    e.preventDefault();
    e.stopPropagation();
    closeModal();
  });

  // Supporto per schermi touch (Smartphone)
  closeBtn.addEventListener("touchstart", function(e) {
    e.preventDefault();
    e.stopPropagation();
    closeModal();
  }, { passive: false });

  // Supporto tastiera (Enter/Space)
  closeBtn.onkeyup = function(e) {
    if (e.key === 'Enter' || e.key === ' ') { closeModal(); }
  };

  // Chiudi cliccando sullo sfondo
  modal.onclick = function (e) {
    if (e.target === modal) {
      closeModal();
    }
  };

  // Tasto ESC
  document.addEventListener("keydown", function (e) {
    if (e.key === 'Escape' && modal.style.display === "block") {
      closeModal();
    }
  });
});
// End Biotech modal popup script