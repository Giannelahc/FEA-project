// Simplified Service Worker
const CACHE_NAME = 'fea-app-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json'
];

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

// Activate event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Intercept requests
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return from cache if available, otherwise fetch from network
        return response || fetch(event.request);
      })
      .catch(() => {
        // Return offline page when network fails
        if (event.request.destination === 'document') {
          return new Response(`
            <!DOCTYPE html>
            <html>
            <head>
              <title>Offline Mode</title>
              <meta charset="utf-8">
              <style>
                body { text-align: center; padding: 50px; font-family: Arial; }
                h1 { color: #333; }
              </style>
            </head>
            <body>
              <h1>🌐 Offline Mode</h1>
              <p>Please check your network connection</p>
              <button onclick="location.reload()">Retry</button>
            </body>
            </html>
          `, {
            headers: { 'Content-Type': 'text/html' }
          });
        }
      })
  );
});