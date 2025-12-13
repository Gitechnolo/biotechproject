// Video.js - Caricamento dinamico del video al click
function loadAndPlayVideo() {
  const container = document.getElementById('ytVideoContainer');
  const img = document.getElementById('videoPoster');
  if (!img) return;

  // Crea l'elemento video
  const video = document.createElement('video');
  video.id = 'ytVideo';
  video.controls = false; // Disabilita i controlli nativi
  video.preload = 'metadata';
  video.poster = img.src;
  video.style.width = '100%';
  video.style.height = 'auto';
  video.style.display = 'block';
  video.style.maxHeight = '600px';
  video.style.borderRadius = '8px';
  video.setAttribute('playsinline', ''); // Importante per iOS

  // Sorgente video
  const source = document.createElement('source');
  source.src = 'https://gitechnolo.github.io/biotechproject/Biotech-file/images/Biotech-menu/Singapore_boscoartificiale-Metropoli.mp4';
  source.type = 'video/mp4';
  video.appendChild(source);

  // Sottotitoli
  const trackEN = document.createElement('track');
  trackEN.kind = 'subtitles';
  trackEN.src = 'https://gitechnolo.github.io/biotechproject/Biotech-file/images/Biotech-menu/fgsubtitles_en.vtt';
  trackEN.srclang = 'en';
  trackEN.label = 'English';
  trackEN.default = true;
  video.appendChild(trackEN);

  const trackIT = document.createElement('track');
  trackIT.kind = 'subtitles';
  trackIT.src = 'https://gitechnolo.github.io/biotechproject/Biotech-file/images/Biotech-menu/fgsubtitles_it.vtt';
  trackIT.srclang = 'it';
  trackIT.label = 'Italian';
  video.appendChild(trackIT);

  // Sostituisci l'immagine con il video
  container.replaceChild(video, img);

  // Mostra i controlli personalizzati
  const controls = document.querySelector('.yt-video-controls');
  if (controls) {
    controls.style.display = 'flex';
  }

  // Inizializza i controlli
  initializeVideoControls(video, controls);
}

// Funzione per gestire i controlli personalizzati
function initializeVideoControls(video, controls) {
  if (!controls) return;

  const playPauseBtn = controls.querySelector('#ytPlayPause');
  const playPauseIcon = controls.querySelector('#ytPlayPauseIcon');
  const progressBar = controls.querySelector('#ytProgress');
  const currentTime = controls.querySelector('#ytCurrentTime');
  const durationEl = controls.querySelector('#ytDuration');
  const volumeControl = controls.querySelector('#ytVolume');
  const muteBtn = controls.querySelector('#ytMute');
  const muteIcon = controls.querySelector('#ytMuteIcon');
  const fullscreenBtn = controls.querySelector('#ytFullscreen');
  const exitFullscreenBtn = controls.querySelector('#ytExitFullscreen');

  // Formatta il tempo come mm:ss
  function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
  }

  // Play/Pause
  playPauseBtn?.addEventListener('click', () => {
    if (video.paused) {
      video.play().catch(e => console.error("Errore riproduzione:", e));
    } else {
      video.pause();
    }
  });

  video.addEventListener('play', () => {
    playPauseIcon.textContent = '⏸️';
  });

  video.addEventListener('pause', () => {
    playPauseIcon.textContent = '▶️';
  });

  // Aggiorna progresso
  video.addEventListener('timeupdate', () => {
    progressBar.value = video.currentTime;
    currentTime.textContent = formatTime(video.currentTime);
  });

  video.addEventListener('loadedmetadata', () => {
    progressBar.max = video.duration;
    durationEl.textContent = formatTime(video.duration);
    currentTime.textContent = formatTime(video.currentTime);
  });

  progressBar?.addEventListener('input', () => {
    video.currentTime = progressBar.value;
  });

  // Volume
  volumeControl?.addEventListener('input', () => {
    video.volume = volumeControl.value;
    muteIcon.textContent = video.muted || video.volume === 0 ? '🔇' : '🔊';
  });

  video.addEventListener('volumechange', () => {
    muteIcon.textContent = video.muted || video.volume === 0 ? '🔇' : '🔊';
  });

  // Mute/Unmute
  muteBtn?.addEventListener('click', () => {
    video.muted = !video.muted;
    muteIcon.textContent = video.muted ? '🔇' : '🔊';
  });

  // Fullscreen
  fullscreenBtn?.addEventListener('click', () => {
    if (video.requestFullscreen) {
      video.requestFullscreen();
    } else if (video.webkitRequestFullscreen) {
      video.webkitRequestFullscreen();
    } else if (video.msRequestFullscreen) {
      video.msRequestFullscreen();
    }
  });

  exitFullscreenBtn?.addEventListener('click', () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  });

  // Gestione fullscreen change
  document.addEventListener('fullscreenchange', () => {
    if (document.fullscreenElement === video) {
      fullscreenBtn.style.display = 'none';
      exitFullscreenBtn.style.display = 'flex';
    } else {
      fullscreenBtn.style.display = 'flex';
      exitFullscreenBtn.style.display = 'none';
    }
  });

  // Tasti rapidi
  video.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
      playPauseBtn?.click();
      e.preventDefault();
    } else if (e.code === 'KeyM') {
      muteBtn?.click();
      e.preventDefault();
    } else if (e.code === 'KeyF') {
      fullscreenBtn?.click();
      e.preventDefault();
    }
  });
}   

// Works for (Mitocondri.png, Lisosoma.png, Miochine.png, Pelle.png) images with id starting with 'myImg'
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

  // ✅ 4. Collega gli eventi (SOLO Click) a ogni immagine esistente
  // L'apertura da tastiera è gestita dal link <a> nel DOM.
  imageIds.forEach(function (imgId) {
    const img = document.getElementById(imgId);
    if (img) {
      // 1. Evento: Click del mouse (Necessario per l'apertura simulata dal link <a>)
      img.addEventListener("click", function () {
        openModal(this);
      });

      // 🛑 Listener 'keyup' rimosso per evitare conflitti con l'apertura da tastiera del link <a>.
    }
  });

  // ✅ 5. Chiudi il modal con la "X"
  // 1. Evento: Click del mouse (USA LA NUOVA FUNZIONE closeModal)
  closeBtn.onclick = closeModal;
  
  // 2. Evento: Chiusura da tastiera (Enter o Space) sulla "X"
  // MODIFICA CRITICA: Uso keydown invece di keyup per prevenire chiusure accidentali subito dopo l'apertura da tastiera.
  closeBtn.addEventListener("keydown", function (event) { 
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