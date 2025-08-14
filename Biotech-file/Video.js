// 🎯 Video.js universale — supporta più video con caricamento lazy opzionale
document.addEventListener('DOMContentLoaded', function () {
  // Seleziona tutti i container con [id="ytVideoContainer"] o aggiungi classe .video-container per più flessibilità
  const containers = document.querySelectorAll('#ytVideoContainer');

  containers.forEach(container => {
    let video = container.querySelector('#ytVideo');
    const controls = container.querySelector('.yt-video-controls');

    // Se il video NON c'è (solo poster), lo creiamo al click
    if (!video) {
      const poster = container.querySelector('.video-poster');
      if (!poster) return;

      poster.addEventListener('click', function () {
        video = createVideoElement(poster);
        container.replaceChild(video, poster);
        if (controls) controls.style.display = 'flex';
        initializeControls(video, controls);
      });
    }
    // Se il video C'È già (come in Staff.html), nascondiamo i controlli finché non serve
    else {
      if (controls) {
        // Inizializza subito i controlli
        controls.style.display = 'flex'; // o 'none' se vuoi mostrarli solo al play
        initializeControls(video, controls);
      }
    }
  });

  // 🔧 Crea un nuovo video (per caricamento lazy)
function createVideoElement(poster) {
  console.log('🔍 Attributi data trovati:', poster.dataset); // 👈 Debug: cosa contiene data-*
  
  const video = document.createElement('video');
  video.id = 'ytVideo';
  video.controls = false;
  video.preload = 'metadata';
  video.poster = poster.src;

  // Sorgente dal data-src o da attributo fisso
  const source = document.createElement('source');
  source.src = poster.dataset.src || 'https://gitechnolo.github.io/biotechproject/Biotech-file/images/Biotech-menu/Auto_del_futuro-Metropoli.mp4';
  
  console.log('🎥 Fonte video impostata:', source.src); // 👈 Debug: quale video viene caricato

  source.type = 'video/mp4';
  video.appendChild(source);

  // Sottotitoli se presenti (corretto per dataset.tracken, dataset.trackit)
  if (poster.dataset.tracken) {
    const track = document.createElement('track');
    track.kind = 'subtitles';
    track.srclang = 'en';
    track.label = 'English';
    track.src = poster.dataset.tracken;
    track.default = true;
    video.appendChild(track);
  }
  if (poster.dataset.trackit) {
    const track = document.createElement('track');
    track.kind = 'subtitles';
    track.srclang = 'it';
    track.label = 'Italian';
    track.src = poster.dataset.trackit;
    video.appendChild(track);
  }   

  return video;
}   

  // ⚙️ Inizializza i controlli su un video
  function initializeControls(video, controls) {
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
      if (video.paused) video.play();
      else video.pause();
    });

    video.addEventListener('play', () => {
      playPauseIcon.textContent = '⏸️';
    });
    video.addEventListener('pause', () => {
      playPauseIcon.textContent = '▶️';
    });
    // Progresso
    video.addEventListener('timeupdate', () => {
      if (progressBar) {
        progressBar.value = video.currentTime;
        currentTime.textContent = formatTime(video.currentTime);
      }
    });

    video.addEventListener('loadedmetadata', () => {
      if (progressBar) {
        progressBar.max = video.duration;
      }
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

    // Assicura che il video sia accessibile
    window.currentVideo = video;
  }
});   