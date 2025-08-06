// Ottimizzazione: sospendi il video se la scheda non è visibile
  const videoBg = document.getElementById('stemcellVideoBg');
  document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
      videoBg.pause();
    } else {
      videoBg.play();
    }
  });
  // Riduci il frame rate del video se supportato (Chrome/Edge)
  if (videoBg.requestVideoFrameCallback) {
    let lastTime = 0;
    function throttleFrame(now, metadata) {
      if (now - lastTime > 120) { // ~8 fps
        lastTime = now;
        videoBg.style.visibility = 'visible';
      } else {
        videoBg.style.visibility = 'hidden';
      }
      videoBg.requestVideoFrameCallback(throttleFrame);
    }
    videoBg.requestVideoFrameCallback(throttleFrame);
  }