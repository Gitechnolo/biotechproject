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
// ✅ Biotech Modal Popup Script con Effetto Espansione (Lente)
document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("myModal");
  const modalImg = document.getElementById("img01");
  const captionText = document.getElementById("caption");
  const closeBtn = modal ? modal.querySelector(".close") : document.querySelector("#myModal .close");

  let lastFocusedElement = null;

  if (!modal || !modalImg || !closeBtn) return;

  /**
   * FUNZIONE GLOBALE: Apre il modal partendo dal punto esatto del click
   */
  window.openBiotechModal = function(imgId, event) {
    const targetImg = document.getElementById(imgId);
    if (!targetImg) return;

    lastFocusedElement = event.currentTarget; 

    // 1. Calcola il centro dell'elemento cliccato per l'origine dell'effetto lente
    const rect = lastFocusedElement.getBoundingClientRect();
    const originX = rect.left + rect.width / 2;
    const originY = rect.top + rect.height / 2;

    // 2. Imposta l'origine dell'animazione sull'immagine
    modalImg.style.transformOrigin = `${originX}px ${originY}px`;
    
    // 3. Prepara il contenuto
    modalImg.src = targetImg.src;
    captionText.textContent = targetImg.alt || "";

    // 4. Mostra il modal con FLEX per garantire l'incolonnamento centrato
    modal.style.display = "flex"; 
    
    // Micro-delay per attivare la transizione CSS scale(0) -> scale(1)
    setTimeout(() => {
      modal.classList.add("show");
      closeBtn.focus();
    }, 10);
  };

  /**
   * Chiude il modale con effetto zoom-out verso l'origine
   */
  function closeBiotechModal() {
    if (!modal.classList.contains("show")) return;
    
    modal.classList.remove("show");
    
    // Attende la fine dell'animazione CSS (400ms) prima di resettare il display
    setTimeout(() => {
      modal.style.display = "none";
      modalImg.src = "";
      if (lastFocusedElement) {
        lastFocusedElement.focus();
        lastFocusedElement = null;
      }
    }, 400);
  }

  // --- GESTIONE EVENTI ---

  closeBtn.onclick = closeBiotechModal;
  
  closeBtn.addEventListener("keydown", function (e) { 
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      closeBiotechModal(); 
    }
  });

  modal.onclick = function (e) {
    // Chiude solo se clicchi sullo sfondo (fuori da immagine e testo)
    if (e.target === modal) closeBiotechModal();
  };

  document.addEventListener("keydown", function (e) {
    if (e.key === 'Escape' && modal.classList.contains("show")) {
      closeBiotechModal();
    }
  });
});
// End Biotech modal popup script