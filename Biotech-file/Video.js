// Video player controls
var video = document.getElementById("myVideo");
var btn = document.getElementById("myBtn");
var volumeControl = document.getElementById("volumeControl");
var fullscreenBtn = document.getElementById("fullscreenBtn");
var exitFullscreenBtn = document.getElementById("exitFullscreenBtn");
var videoContainer = document.getElementById("videoContainer");
function videoFunction() {
  if (video.paused) {
    video.play();
    btn.innerHTML = "Pause";
  } else {
    video.pause();
    btn.innerHTML = "Play";
  }
}
// Volume control event
volumeControl.addEventListener('input', function() {
  video.volume = this.value;
});
// Fullscreen event
fullscreenBtn.addEventListener('click', function() {
  if (videoContainer.requestFullscreen) {
    videoContainer.requestFullscreen();
  } else if (videoContainer.webkitRequestFullscreen) { /* Safari */
    videoContainer.webkitRequestFullscreen();
  } else if (videoContainer.msRequestFullscreen) { /* IE11 */
    videoContainer.msRequestFullscreen();
  }
});
// Exit fullscreen event
exitFullscreenBtn.addEventListener('click', function() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) { /* Safari */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) { /* IE11 */
    document.msExitFullscreen();
  }
});
// Show/hide fullscreen/return buttons
document.addEventListener('fullscreenchange', function() {
  if (document.fullscreenElement === videoContainer) {
    fullscreenBtn.style.display = 'none';
    exitFullscreenBtn.style.display = 'block';
    video.style.minWidth = '100%';
    video.style.minHeight = '100%';
    video.style.width = '100%';
    video.style.height = '100%';
  } else {
    fullscreenBtn.style.display = '';
    exitFullscreenBtn.style.display = 'none';
    video.style.minWidth = '';
    video.style.minHeight = '';
    video.style.width = '';
    video.style.height = '';
  }
});
// End Video player controls