// Video.js - Caricamento dinamico del video al click
function loadAndPlayVideo() {
  const container = document.getElementById('ytVideoContainer');
  const img = document.getElementById('videoPoster');
  if (!img) return;

  // Crea contenitore responsive
  const responsiveContainer = document.createElement('div');
  responsiveContainer.className = 'video-container';

  // Crea video
  const video = document.createElement('video');
  video.id = 'ytVideo';
  video.controls = false;
  video.preload = 'metadata';
  video.poster = img.src;
  video.setAttribute('playsinline', '');
  video.style.borderRadius = '8px';

  // Sorgente MP4
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

  // Aggiunge video al contenitore responsive
  responsiveContainer.appendChild(video);
  container.replaceChild(responsiveContainer, img);

  // Mostra controlli personalizzati
  const controls = document.querySelector('.yt-video-controls');
  if (controls) controls.style.display = 'flex';

  initializeVideoControls(video, controls);
}

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

  playPauseBtn?.addEventListener('click', () => {
    if (video.paused) video.play().catch(e => console.error("Errore:", e));
    else video.pause();
  });

  video.addEventListener('play', () => playPauseIcon.textContent = '⏸️');
  video.addEventListener('pause', () => playPauseIcon.textContent = '▶️');

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

  volumeControl?.addEventListener('input', () => {
    video.volume = volumeControl.value;
    muteIcon.textContent = video.muted || video.volume === 0 ? '🔇' : '🔊';
  });

  muteBtn?.addEventListener('click', () => {
    video.muted = !video.muted;
  });

  fullscreenBtn?.addEventListener('click', () => {
    if (video.requestFullscreen) video.requestFullscreen();
    else if (video.webkitRequestFullscreen) video.webkitRequestFullscreen();
  });

  exitFullscreenBtn?.addEventListener('click', () => {
    if (document.exitFullscreen) document.exitFullscreen();
    else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
  });

  document.addEventListener('fullscreenchange', () => {
    if (document.fullscreenElement === video) {
      fullscreenBtn.style.display = 'none';
      exitFullscreenBtn.style.display = 'flex';
    } else {
      fullscreenBtn.style.display = 'flex';
      exitFullscreenBtn.style.display = 'none';
    }
  });

  video.addEventListener('keydown', (e) => {
    if (e.code === 'Space') { playPauseBtn?.click(); e.preventDefault(); }
    else if (e.code === 'KeyM') { muteBtn?.click(); e.preventDefault(); }
    else if (e.code === 'KeyF') { fullscreenBtn?.click(); e.preventDefault(); }
  });
}      