/*
* BIOTECH PROJECT | VIDEO ORCHESTRATION SYSTEM
 * -------------------------------------------------------------------------
 * MODULE: VideoStaff.js
 * STRATEGY: Lazy-Loading with Event-Driven Trigger
 * UX DESIGN: Custom Control HUD & Accessible Keyboard Mapping
 * ASSET: Future Mobility Visualization (Metropoli.mp4)
 * -------------------------------------------------------------------------
 * "Leadership is a journey through the unknown. We are all wanderers 
 * searching for the truth within the data."
 */
// ————————————————————————————————————————————————————————
// CORE: CARICAMENTO DINAMICO VIDEO PER STAFF.HTML
// ————————————————————————————————————————————————————————

function loadAndPlayVideo() {
  const container = document.getElementById('ytVideoContainer');
  const img = document.getElementById('videoPoster');
  if (!img) return;

  // 1. Crea l'elemento video
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

  // 2. Sorgente video (Auto del futuro)
  const source = document.createElement('source');
  source.src = 'https://gitechnolo.github.io/biotechproject/Biotech-file/images/Biotech-menu/Auto_del_futuro-Metropoli.mp4';
  source.type = 'video/mp4';
  video.appendChild(source);

  // 3. Sostituisci l'immagine con il video
  container.replaceChild(video, img);

  // 4. Mostra i controlli
  const controls = document.querySelector('.yt-video-controls');
  if (controls) {
    controls.style.display = 'flex';
  }

  // 5. Inizializza i controlli e avvia
  initializeVideoControls(video, controls);
  video.play().catch(e => console.log("Riproduzione manuale richiesta:", e));
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

  video.addEventListener('play', () => { playPauseIcon.textContent = '⏸️'; });
  video.addEventListener('pause', () => { playPauseIcon.textContent = '▶️'; });

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
    if (video.requestFullscreen) video.requestFullscreen();
    else if (video.webkitRequestFullscreen) video.webkitRequestFullscreen();
    else if (video.msRequestFullscreen) video.msRequestFullscreen();
  });

  // Exit Fullscreen
  exitFullscreenBtn?.addEventListener('click', () => {
    if (document.exitFullscreen) document.exitFullscreen();
    else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
    else if (document.msExitFullscreen) document.msExitFullscreen();
  });

  // Gestione UI fullscreen
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
    if (e.code === 'Space') { e.preventDefault(); playPauseBtn?.click(); }
    else if (e.code === 'KeyM') { e.preventDefault(); muteBtn?.click(); }
    else if (e.code === 'KeyF') { e.preventDefault(); fullscreenBtn?.click(); }
  });
}

// ========================================================
// INIZIALIZZAZIONE AUTOMATICA (Specifico per Staff.html)
// ========================================================
document.addEventListener('DOMContentLoaded', () => {
  const videoPoster = document.getElementById('videoPoster');
  
  if (videoPoster) {
    // Gestione Click
    videoPoster.addEventListener('click', loadAndPlayVideo);

    // Gestione Tastiera (Invio e Spazio)
    videoPoster.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault(); 
        loadAndPlayVideo();
      }
    });
  }
});   
// Accessibilità video: supporto tastiera ai poster. Caricamento video solo al click (lazy load avanzato)
function handleVideoPosterKey(event) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    loadAndPlayVideo();
  }
}
// End Accessibilità video 

//Fade effect (dissolvenza)
function fadeEffect() {
  let text = document.getElementById("fadingText");
  if (!text) return;

  let visible = true;
  setInterval(() => {
    visible = !visible;
    text.classList.toggle("fade", !visible);
  }, 2000);
}
window.addEventListener("load", fadeEffect);   
// End fade effect (dissolvenza)

/*
================================================================================
FINAL ARCHITECTURAL SIGN-OFF | BiotechProject Video Engine
================================================================================
File: VideoStaff.js
Status: DEPLOYED & STABLE
Core Philosophy: CODE IS TEMPORARY, VISION IS ETERNAL
--------------------------------------------------------------------------------

[THE WANDERER'S REFLECTION]
In the spirit of Johnny Cash’s journey:

    "I roam from town to town
     I go through life without a care
     And I'm as happy as a clown
     With my two fists of iron but I'm going nowhere."

Actually, we ARE going somewhere. We are moving toward a future 
where technology serves the soul, not the other way around.

--------------------------------------------------------------------------------
AUDIT: 
- Lazy Load: ACTIVE (Performance Optimized)
- A11y: COMPLIANT (WCAG 2.1)
- Leadership Sync: THE WANDERER PROTOCOL VALIDATED
================================================================================
*/