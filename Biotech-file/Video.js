// ✅ Video.js: caricamento semplice per index.html
document.addEventListener('DOMContentLoaded', function () {
  const poster = document.querySelector('#ytVideoContainer .video-poster');
  if (!poster) return; // Esci se non c'è il poster (es. su altre pagine)

  poster.addEventListener('click', function () {
    const container = document.getElementById('ytVideoContainer');
    const controls = container.querySelector('.yt-video-controls');

    // Crea il video
    const video = document.createElement('video');
    video.id = 'ytVideo';
    video.controls = false;
    video.preload = 'metadata';
    video.poster = poster.src;

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
    container.replaceChild(video, poster);

    // Mostra i controlli
    if (controls) controls.style.display = 'flex';

    // Inizializza i controlli
    initializeVideoControls(video, controls);
  });

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
      if (video.paused) video.play();
      else video.pause();
    });

    video.addEventListener('play', () => {
      playPauseIcon.textContent = '⏸️';
    });
    video.addEventListener('pause', () => {
      playPauseIcon.textContent =   