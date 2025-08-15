// VideoStaff.js - Caricamento dinamico del video per Staff.html (senza sottotitoli)
function loadAndPlayVideo() {
  const container = document.getElementById('ytVideoContainer');
  const img = document.getElementById('videoPoster');
  if (!img) return;

  // Crea l'elemento video
  const video = document.createElement('video');
  video.id = 'ytVideo';
  video.controls = false;
  video.preload = 'metadata';
  video.poster = img.src;
  video.style.width = '100%';
  video.style.height = 'auto';
  video.style.display = 'block';
  video.style.maxHeight = '600px';
  video.style.borderRadius = '8px';
  video.setAttribute('playsinline', ''); // Importante per iOS

  // Sorgente video (Auto del futuro)
  const source = document.createElement('source');
  source.src = 'https://gitechnolo.github.io/biotechproject/Biotech-file/images/Biotech-menu/Auto_del_futuro-Metropoli.mp4';
  source.type = 'video/mp4';
  video.appendChild(source);

  // Sostituisci l'immagine con il video
  container.replaceChild(video, img);

  // Mostra i controlli
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
  const fullscreenBtn = controls.querySelector('#ytFullscreen');  // ✅ Preso l'elemento
  const exitFullscreenBtn = controls.querySelector('#ytExitFullscreen'); // ✅ Aggiunto anche questo

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

  // Progresso
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

  // Exit Fullscreen
  exitFullscreenBtn?.addEventListener('click', () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  });

  // Gestione uscita fullscreen
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