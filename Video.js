// Modern style custom video controls for Singapore_video
document.addEventListener('DOMContentLoaded', function () {
  const video = document.getElementById('ytVideo');
  if (!video) return;
  const playPauseBtn = document.getElementById('ytPlayPause');
  const playPauseIcon = document.getElementById('ytPlayPauseIcon');
  const progressBar = document.getElementById('ytProgress');
  const currentTime = document.getElementById('ytCurrentTime');
  const duration = document.getElementById('ytDuration');
  const volumeControl = document.getElementById('ytVolume');
  const muteBtn = document.getElementById('ytMute');
  const muteIcon = document.getElementById('ytMuteIcon');
  const fullscreenBtn = document.getElementById('ytFullscreen');
  const exitFullscreenBtn = document.getElementById('ytExitFullscreen');
// Play/Pause toggle
  playPauseBtn.addEventListener('click', function () {
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  });
  video.addEventListener('play', function () {
    playPauseIcon.textContent = '⏸️';
  });
  video.addEventListener('pause', function () {
    playPauseIcon.textContent = '▶️';
  });
// Progress bar
  video.addEventListener('timeupdate', function () {
    progressBar.value = video.currentTime;
    currentTime.textContent = formatTime(video.currentTime);
  });
  video.addEventListener('loadedmetadata', function () {
    progressBar.max = video.duration;
    duration.textContent = formatTime(video.duration);
    currentTime.textContent = formatTime(video.currentTime);
  });
  progressBar.addEventListener('input', function () {
    video.currentTime = progressBar.value;
  });
// Volume
  volumeControl.addEventListener('input', function () {
    video.volume = volumeControl.value;
    if (video.volume === 0) {
      muteIcon.textContent = '🔇';
    } else {
      muteIcon.textContent = video.muted ? '🔇' : '🔊';
    }
  });
  video.addEventListener('volumechange', function () {
    volumeControl.value = video.volume;
    muteIcon.textContent = (video.muted || video.volume === 0) ? '🔇' : '🔊';
  });

  // Mute/Unmute
  muteBtn.addEventListener('click', function () {
    video.muted = !video.muted;
    muteIcon.textContent = video.muted ? '🔇' : (video.volume === 0 ? '🔇' : '🔊');
  });
// Fullscreen
  fullscreenBtn.addEventListener('click', function () {
    if (video.requestFullscreen) {
      video.requestFullscreen();
    } else if (video.webkitRequestFullscreen) {
      video.webkitRequestFullscreen();
    } else if (video.msRequestFullscreen) {
      video.msRequestFullscreen();
    }
  });
  exitFullscreenBtn.addEventListener('click', function () {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  });
  document.addEventListener('fullscreenchange', function () {
    if (document.fullscreenElement === video) {
      fullscreenBtn.style.display = 'none';
      exitFullscreenBtn.style.display = '';
    } else {
      fullscreenBtn.style.display = '';
      exitFullscreenBtn.style.display = 'none';
    }
  });
// Utility: format time as mm:ss
  function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
  }
// Keyboard shortcuts (optional)
  video.addEventListener('keydown', function (e) {
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
});
// Modern custom video controls style
document.addEventListener('DOMContentLoaded', function() {
  var video = document.getElementById('myVideo');
  var playPauseBtn = document.getElementById('playPauseBtn');
  var playPauseIcon = document.getElementById('playPauseIcon');
  var progressBar = document.getElementById('progressBar');
  var currentTimeElem = document.getElementById('currentTime');
  var durationElem = document.getElementById('duration');
  var volumeControl = document.getElementById('volumeControl');
  var fullscreenBtn = document.getElementById('fullscreenBtn');
  var exitFullscreenBtn = document.getElementById('exitFullscreenBtn');
  var videoContainer = document.getElementById('videoContainer');

  function formatTime(time) {
    var min = Math.floor(time / 60);
    var sec = Math.floor(time % 60).toString().padStart(2, '0');
    return min + ':' + sec;
  }
  if (video) {
    video.addEventListener('loadedmetadata', function() {
      if (progressBar) {
        progressBar.max = video.duration;
      }
      if (durationElem) {
        durationElem.textContent = formatTime(video.duration);
      }
    });
    video.addEventListener('timeupdate', function() {
      if (progressBar) progressBar.value = video.currentTime;
      if (currentTimeElem) currentTimeElem.textContent = formatTime(video.currentTime);
    });
  }
  if (progressBar) {
    progressBar.addEventListener('input', function() {
      video.currentTime = progressBar.value;
    });
  }
  if (playPauseBtn) {
    playPauseBtn.addEventListener('click', function() {
      if (video.paused) {
        video.play();
        playPauseIcon.textContent = '⏸️';
      } else {
        video.pause();
        playPauseIcon.textContent = '▶️';
      }
    });
  }
  if (video) {
    video.addEventListener('play', function() { if (playPauseIcon) playPauseIcon.textContent = '⏸️'; });
    video.addEventListener('pause', function() { if (playPauseIcon) playPauseIcon.textContent = '▶️'; });
  }
  if (volumeControl) {
    volumeControl.addEventListener('input', function() {
      video.volume = volumeControl.value;
    });
  }
  if (fullscreenBtn) {
    fullscreenBtn.addEventListener('click', function() {
      if (video.requestFullscreen) video.requestFullscreen();
      else if (video.webkitRequestFullscreen) video.webkitRequestFullscreen();
      else if (video.msRequestFullscreen) video.msRequestFullscreen();
      fullscreenBtn.style.display = 'none';
      exitFullscreenBtn.style.display = '';
    });
  }
  if (exitFullscreenBtn) {
    exitFullscreenBtn.addEventListener('click', function() {
      if (document.exitFullscreen) document.exitFullscreen();
      else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
      else if (document.msExitFullscreen) document.msExitFullscreen();
      fullscreenBtn.style.display = '';
      exitFullscreenBtn.style.display = 'none';
    });
  }
  document.addEventListener('fullscreenchange', function() {
    if (!document.fullscreenElement) {
      if (fullscreenBtn) fullscreenBtn.style.display = '';
      if (exitFullscreenBtn) exitFullscreenBtn.style.display = 'none';
    }
  });
// Move video to the left and remove edge effect for full compatibility
  if (videoContainer) {
    videoContainer.style.marginLeft = '0';
    videoContainer.style.marginRight = 'auto';
    videoContainer.style.maxWidth = '640px';
    videoContainer.style.background = '#fff';
    videoContainer.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
    videoContainer.style.borderRadius = '10px';
    videoContainer.style.padding = '12px 0 18px 0';
  }
  if (video) {
    video.style.borderRadius = '8px';
    video.style.background = 'transparent';
    video.style.boxShadow = 'none';
    video.style.marginLeft = '0';
    video.style.marginRight = 'auto';
    video.style.display = 'block';
    video.style.width = '100%';
    video.style.maxWidth = '600px';
    video.style.maskImage = 'none';
    video.style.webkitMaskImage = 'none';
  }
});