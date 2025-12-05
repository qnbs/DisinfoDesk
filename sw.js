importScripts('https://storage.googleapis.com/workbox-cdn/releases/7.0.0/workbox-sw.js');

if (workbox) {
    console.log(`[DisinfoDesk] Workbox Core loaded. PWA Protocol initiated.`);

    // --- CONFIGURATION ---
    workbox.setConfig({ debug: false });
    
    // Force immediate takeover of the page once installed
    // This allows the app to control the page immediately without a reload
    self.skipWaiting();
    workbox.core.clientsClaim();

    // --- CONSTANTS ---
    const CACHE_PREFIX = 'disinfodesk-cache';
    const CACHE_SUFFIX = 'v4'; // Increment this to force cache purge on update

    // --- 1. STRATEGIES ---

    // IMAGES: Cache First (Serve from cache, update only if missing/expired)
    // Keep up to 60 images for 30 days.
    workbox.routing.registerRoute(
        ({request}) => request.destination === 'image',
        new workbox.strategies.CacheFirst({
            cacheName: `${CACHE_PREFIX}-images-${CACHE_SUFFIX}`,
            plugins: [
                new workbox.expiration.ExpirationPlugin({
                    maxEntries: 60,
                    maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
                    purgeOnQuotaError: true,
                }),
            ],
        })
    );

    // FONTS: Cache First (Google Fonts & Static)
    workbox.routing.registerRoute(
        ({url}) => url.origin === 'https://fonts.googleapis.com' || url.origin === 'https://fonts.gstatic.com',
        new workbox.strategies.CacheFirst({
            cacheName: `${CACHE_PREFIX}-fonts-${CACHE_SUFFIX}`,
            plugins: [
                new workbox.cacheableResponse.CacheableResponsePlugin({
                    statuses: [0, 200],
                }),
                new workbox.expiration.ExpirationPlugin({
                    maxAgeSeconds: 60 * 60 * 24 * 365, // 1 Year
                }),
            ],
        })
    );

    // JS/CSS/CDN LIBS: Stale While Revalidate
    // Serve fast from cache, then check network for updates in background.
    workbox.routing.registerRoute(
        ({request, url}) => 
            request.destination === 'script' || 
            request.destination === 'style' ||
            url.origin === 'https://cdn.tailwindcss.com' ||
            url.origin === 'https://aistudiocdn.com',
        new workbox.strategies.StaleWhileRevalidate({
            cacheName: `${CACHE_PREFIX}-assets-${CACHE_SUFFIX}`,
            plugins: [
                new workbox.cacheableResponse.CacheableResponsePlugin({
                    statuses: [0, 200],
                }),
            ]
        })
    );

    // API REQUESTS: Network First (Fresh data preferred), fallback to cache
    // This allows cached API responses if offline
    workbox.routing.registerRoute(
        ({url}) => url.href.includes('generativelanguage.googleapis.com'),
        new workbox.strategies.NetworkFirst({
            cacheName: `${CACHE_PREFIX}-api-${CACHE_SUFFIX}`,
            networkTimeoutSeconds: 3,
            plugins: [
                new workbox.expiration.ExpirationPlugin({
                    maxEntries: 50,
                    maxAgeSeconds: 60 * 60, // 1 Hour cache for API
                }),
            ],
        })
    );

    // --- 2. OFFLINE FALLBACK (SPA NAVIGATION) ---
    
    // For Single Page Apps: Return index.html for navigation requests
    // This ensures reloading any route works offline.
    const handler = workbox.strategies.strategyWrapper(
        new workbox.strategies.NetworkFirst({
            cacheName: `${CACHE_PREFIX}-html-${CACHE_SUFFIX}`,
        })
    );

    workbox.routing.registerRoute(
        ({request}) => request.mode === 'navigate',
        ({event}) => {
            return handler.handle({event}).catch(() => {
                return caches.match('index.html');
            });
        }
    );

} else {
    console.log(`[DisinfoDesk] Workbox failed to load.`);
}

// Listen to "SKIP_WAITING" message to force update from UI
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});