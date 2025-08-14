// Custom Video Player with Lazy Load, Subtitles & Full Controls
document.addEventListener('DOMContentLoaded', function () {
  const posterImg = document.getElementById('videoPoster');
  if (!posterImg) return;

  posterImg.addEventListener('click', function () {
    const container = document.getElementById('ytVideoContainer');

    // Crea l'elemento video
    const video = document.createElement('video');
    video.id = 'ytVideo';
    video.controls = false;
    video.preload = 'metadata';
    video.poster = posterImg.src;

    // Aggiungi sorgente video
    const source = document.createElement('source');
    source.src = 'https://gitechnolo.github.io/biotechproject/Biotech-file/images/Biotech-menu/Singapore_boscoartificiale-Metropoli.mp4';
    source.type = 'video/mp4';
    video.appendChild(source);

    // Aggiungi sottotitoli
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
    container.replaceChild(video, posterImg);

    // Mostra i controlli personalizzati
    const controls = document.querySelector('.yt-video-controls');
    if (controls) controls.style.display = 'flex';

    // === Inizializza i controlli (tutto il tuo codice originale) ===
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

    // Funzione per formattare il tempo
    function formatTime(time) {
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
    }

    // Play/Pause
    playPauseBtn.addEventListener('click', () => {
      if (video.paused) {
        video.play();
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

    // Progress bar
    video.addEventListener('timeupdate', () => {
      progressBar.value = video.currentTime;
      currentTime.textContent = formatTime(video.currentTime);
    });
   
    video.addEventListener('loadedmetadata', () => {
      progressBar.max = video.duration;
      durationEl.textContent = formatTime(video.duration);
      currentTime.textContent = formatTime(video.currentTime);
    });

    progressBar.addEventListener('input', () => {
      video.currentTime = progressBar.value;
    });

    // Volume
    volumeControl.addEventListener('input', () => {
      video.volume = volumeControl.value;
      if (video.volume === 0) {
        muteIcon.textContent = '🔇';
      } else {
        muteIcon.textContent = video.muted ? '🔇' : '🔊';
      }
    });

    video.addEventListener('volumechange', () => {
      volumeControl.value = video.volume;
      muteIcon.textContent = (video.muted || video.volume === 0) ? '🔇' : '🔊';
    });

    // Mute/Unmute
    muteBtn.addEventListener('click', () => {
      video.muted = !video.muted;
      muteIcon.textContent = video.muted ? '🔇' : (video.volume === 0 ? '🔇' : '🔊');
    });

    // Fullscreen
    fullscreenBtn.addEventListener('click', () => {
      if (video.requestFullscreen) {
        video.requestFullscreen();
      } else if (video.webkitRequestFullscreen) {
        video.webkitRequestFullscreen();
      } else if (video.msRequestFullscreen) {
        video.msRequestFullscreen();
      }
    });

    exitFullscreenBtn.addEventListener('click', () => {
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

    // Tasti rapidi (opzionale)
    video.addEventListener('keydown', (e) => {
      if (e.code === 'Space') {
        playPauseBtn.click();
        e.preventDefault();
      } else if (e.code === 'KeyM') {
        muteBtn.click();
        e.preventDefault();
      } else if (e.code === 'KeyF') {
        fullscreenBtn.click();
        e.preventDefault();
      }
    });

    // Assicurarsi che il video sia accessibile da altri script se necessario
    window.currentVideo = video;
  });
});   