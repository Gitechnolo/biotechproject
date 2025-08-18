// Biotech.js – Particles Background (Ottimizzato)
(function () {
'use strict';
function randomStemCellColor() {
const colors = [
"rgba(180, 220, 255, 0.26)",
"rgba(220, 255, 180, 0.22)",
"rgba(255, 220, 180, 0.19)",
"rgba(200, 255, 220, 0.21)",
"rgba(255, 200, 220, 0.21)",
];
return colors[Math.floor(Math.random() * colors.length)];
}
function initParticles(canvasId, options = {}) {
const canvas = document.getElementById(canvasId);
if (!canvas) return;
const ctx = canvas.getContext('2d', { alpha: true });
let animationId;
// Ottimizzazione: riduci il frame rate per risparmiare CPU
const FRAME_DELAY = 100; // ~10 FPS invece di 60
let lastFrameTime = 0;
function resizeCanvas() {
const dpr = window.devicePixelRatio || 1;
const w = window.innerWidth;
const h = window.innerHeight;
// Dimensioni di rendering (risoluzione)
canvas.width = w * dpr;
canvas.height = h * dpr;
// Dimensioni di visualizzazione (layout)
canvas.style.width = '100vw';   // ← Usa vw, non px
canvas.style.height = '100vh';
// Scalatura per DPI
ctx.scale(dpr, dpr);
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);
const hour = new Date().getHours();
const isDay = hour >= 7 && hour < 19;
if (isDay) {
// Particelle di giorno
const count = Math.min(options.count || 50, 60); // Cap per dispositivi deboli
const color = options.color || 'rgba(231, 231, 231, 0.47)';
const radius = options.radius || 2;
const speed = options.speed || 1;
const particles = Array.from({ length: count }, () => ({
x: Math.random() * window.innerWidth,
y: Math.random() * window.innerHeight,
vx: (Math.random() - 0.5) * speed,
vy: (Math.random() - 0.5) * speed,
}));
function animate(timestamp) {
if (!lastFrameTime || timestamp - lastFrameTime >= FRAME_DELAY) {
ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
particles.forEach(p => {
p.x += p.vx;
p.y += p.vy;
if (p.x < 0 || p.x > window.innerWidth) p.vx *= -1;
if (p.y < 0 || p.y > window.innerHeight) p.vy *= -1;
ctx.beginPath();
ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
ctx.fillStyle = color;
ctx.fill();
});
lastFrameTime = timestamp;
}
animationId = requestAnimationFrame(animate);
}
animate(0);
} else {
// Cellule staminali di notte (più morbide, meno intense)
const count = Math.min(options.count || 30, 40);
const minRadius = 1.5;
const maxRadius = 4;
const speed = options.speed || 0.6;
const cells = Array.from({ length: count }, () => ({
x: Math.random() * window.innerWidth,
y: Math.random() * window.innerHeight,
vx: (Math.random() - 0.5) * speed,
vy: (Math.random() - 0.5) * speed,
r: minRadius + Math.random() * (maxRadius - minRadius),
color: randomStemCellColor(),
}));
function animateStemCells(timestamp) {
if (!lastFrameTime || timestamp - lastFrameTime >= FRAME_DELAY) {
ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
cells.forEach(c => {
c.x += c.vx;
c.y += c.vy;
if (c.x < 0 || c.x > window.innerWidth) c.vx *= -1;
if (c.y < 0 || c.y > window.innerHeight) c.vy *= -1;
ctx.beginPath();
ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
ctx.fillStyle = c.color;
ctx.shadowColor = c.color;
ctx.shadowBlur = 12; // Ridotto da 18 a 12 per risparmiare GPU
ctx.fill();
ctx.shadowBlur = 0; // Reset subito per evitare accumulo
});
lastFrameTime = timestamp;
}
animationId = requestAnimationFrame(animateStemCells);
}
animateStemCells();
}
// Cleanup function esposta
function destroy() {
if (animationId) {
cancelAnimationFrame(animationId);
animationId = null;
}
window.removeEventListener('resize', resizeCanvas);
}
return { destroy };
}
// Esporre solo la funzione principale
if (typeof window !== 'undefined') {
window.initParticles = initParticles;
}
})();