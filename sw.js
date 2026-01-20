const CACHE_NAME = 'biotech-cache-v1';
const ASSETS_TO_CACHE = [
  './',
  './Tech_Maturity.html',
  './Biotech-file/portfolio.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.23/jspdf.plugin.autotable.min.js'
];

// Fase di Installazione: Salvataggio librerie nella cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Fase di Intercettazione: Se non c'è rete, usa la cache
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Restituisce la risorsa dalla cache o tenta la rete
      return response || fetch(event.request);
    })
  );
});