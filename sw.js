importScripts('https://storage.googleapis.com/workbox-cdn/releases/7.0.0/workbox-sw.js');

if (workbox) {
  console.log(`[DisinfoDesk] Workbox is loaded`);

  // 1. Cache External CDNs (React, Tailwind, Lucide, GenAI)
  // Strategy: StaleWhileRevalidate - Fast render, background update
  workbox.routing.registerRoute(
    ({url}) => url.origin === 'https://cdn.tailwindcss.com' || url.origin === 'https://aistudiocdn.com',
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: 'cdn-libraries',
      plugins: [
        new workbox.cacheableResponse.CacheableResponsePlugin({
          statuses: [0, 200],
        }),
      ],
    })
  );

  // 2. Cache Google Fonts
  // Strategy: CacheFirst - Fonts rarely change
  workbox.routing.registerRoute(
    ({url}) => url.origin === 'https://fonts.googleapis.com' || url.origin === 'https://fonts.gstatic.com',
    new workbox.strategies.CacheFirst({
      cacheName: 'google-fonts',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 30,
          maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
        }),
      ],
    })
  );

  // 3. Cache Local Code (.tsx, .ts, .html) for this specific Dev Environment
  // Strategy: NetworkFirst - We want the latest code updates, but fallback to cache if offline.
  // Note: In a production build, this would be Pre-caching.
  workbox.routing.registerRoute(
    ({request, url}) => 
      request.destination === 'document' || 
      request.destination === 'script' ||
      url.pathname.endsWith('.tsx') ||
      url.pathname.endsWith('.ts'),
    new workbox.strategies.NetworkFirst({
      cacheName: 'app-code',
      networkTimeoutSeconds: 3,
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 50,
        }),
      ],
    })
  );

  // 4. Cache Images
  // Strategy: CacheFirst
  workbox.routing.registerRoute(
    ({request}) => request.destination === 'image',
    new workbox.strategies.CacheFirst({
      cacheName: 'images',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 60,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
        }),
      ],
    })
  );

} else {
  console.log(`[DisinfoDesk] Workbox didn't load`);
}

// Force immediate activation
self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
});