const CACHE_NAME = 'torneo-cache-v1';
const urlsToCache = [
  './',
  './index.html',
  './liga.html',
  './torneoparejas.html',
  './historial.html',
  './icono_torneo.ico',
  './manifest.json',
  // Agregá acá todos los demás archivos que uses:
  // imágenes, CSS, JS, sonidos, etc.
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    }).catch(() => {
      // Página alternativa sin conexión (opcional)
      if (event.request.mode === 'navigate') {
        return caches.match('./index.html');
      }
    })
  );
});
