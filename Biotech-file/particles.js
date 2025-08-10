// Modern, reusable particles background effect
(function () {
  function randomStemCellColor() {
    const colors = [
      "rgba(180,220,255,0.5)",
      "rgba(220,255,180,0.5)",
      "rgba(255,220,180,0.5)",
      "rgba(200,255,220,0.5)",
      "rgba(255,200,220,0.5)",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  function initParticles(canvasId, options = {}) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Orario locale
    const hour = new Date().getHours();
    const isDay = hour >= 7 && hour < 19;

    if (isDay) {
      // Effetto classico
      const particleCount = options.count || 50;
      const color = options.color || "#e7e7e77a";
      const radius = options.radius || 2;
      const speed = options.speed || 1;
      const particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * speed,
          vy: (Math.random() - 0.5) * speed,
        });
      }
      function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach((p) => {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
          if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
          ctx.beginPath();
          ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.fill();
        });
        requestAnimationFrame(animate);
      }
      animate();
    } else {
      // Effetto cellule staminali
      const cellCount = options.count || 30;
      const minRadius = options.minRadius || 12;
      const maxRadius = options.maxRadius || 32;
      const speed = options.speed || 0.6;
      const cells = [];
      for (let i = 0; i < cellCount; i++) {
        cells.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * speed,
          vy: (Math.random() - 0.5) * speed,
          r: minRadius + Math.random() * (maxRadius - minRadius),
          color: randomStemCellColor(),
        });
      }
      function animateStemCells() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        cells.forEach((c) => {
          c.x += c.vx;
          c.y += c.vy;
          if (c.x < 0 || c.x > canvas.width) c.vx *= -1;
          if (c.y < 0 || c.y > canvas.height) c.vy *= -1;
          ctx.beginPath();
          ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
          ctx.fillStyle = c.color;
          ctx.shadowColor = c.color;
          ctx.shadowBlur = 18;
          ctx.fill();
          ctx.shadowBlur = 0;
        });
        requestAnimationFrame(animateStemCells);
      }
      animateStemCells();
    }
  }

  // Expose globally for reuse
  window.initParticles = initParticles;
})();