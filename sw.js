importScripts('https://storage.googleapis.com/workbox-cdn/releases/7.0.0/workbox-sw.js');

if (workbox) {
    // --- CONFIGURATION ---
    workbox.setConfig({ debug: false });
    
    // Aggressive update strategy: skip waiting and claim clients immediately
    self.addEventListener('install', (event) => {
        console.log('[SW] v10 Installing, will skip waiting...');
        self.skipWaiting();
    });
    
    // Claim clients immediately after activation + enable navigation preload
    workbox.core.clientsClaim();

    // --- NAVIGATION PRELOAD ---
    // Speeds up network-first navigations by issuing fetch in parallel with SW boot
    if (self.registration.navigationPreload) {
        self.addEventListener('activate', (event) => {
            event.waitUntil(self.registration.navigationPreload.enable());
        });
    }

    // --- CONSTANTS ---
    const CACHE_PREFIX = 'disinfodesk-cache';
    const CACHE_SUFFIX = 'v10';

    // --- 0. PRECACHE (App Shell) ---
    workbox.precaching.precacheAndRoute([
        { url: 'index.html', revision: CACHE_SUFFIX },
        { url: 'manifest.json', revision: CACHE_SUFFIX },
        { url: 'public/icons/icon.svg', revision: CACHE_SUFFIX },
        { url: 'public/icons/icon-maskable.svg', revision: CACHE_SUFFIX },
        { url: 'public/icons/favicon.svg', revision: CACHE_SUFFIX },
    ]);

    // Notify all clients when new SW version activates
    self.addEventListener('activate', (event) => {
        event.waitUntil(
            self.clients.matchAll({ type: 'window' }).then(clients => {
                clients.forEach(client => {
                    client.postMessage({ type: 'SW_ACTIVATED', version: CACHE_SUFFIX });
                });
            })
        );
    });

    // --- 1. CACHE CLEANUP: Remove stale caches on activation ---
    self.addEventListener('activate', (event) => {
        console.log('[SW] Activating new service worker, cleaning up old caches...');
        event.waitUntil(
            caches.keys().then(keys => {
                const cachesToDelete = keys.filter(key => 
                    key.startsWith(CACHE_PREFIX) && !key.includes(CACHE_SUFFIX)
                );
                console.log('[SW] Deleting', cachesToDelete.length, 'old cache(s):', cachesToDelete);
                return Promise.all(
                    cachesToDelete.map(key => {
                        console.log('[SW] Deleting cache:', key);
                        return caches.delete(key);
                    })
                );
            }).then(() => {
                console.log('[SW] Cache cleanup complete, claiming clients');
                return self.clients.claim();
            })
        );
    });

    // --- 2. STRATEGIES ---

    // IMAGES: Cache First — aggressive caching with WebP/AVIF awareness
    workbox.routing.registerRoute(
        ({request}) => request.destination === 'image',
        new workbox.strategies.CacheFirst({
            cacheName: `${CACHE_PREFIX}-images-${CACHE_SUFFIX}`,
            plugins: [
                new workbox.expiration.ExpirationPlugin({
                    maxEntries: 120,
                    maxAgeSeconds: 60 * 24 * 60 * 60, // 60 Days
                    purgeOnQuotaError: true,
                }),
                new workbox.cacheableResponse.CacheableResponsePlugin({
                    statuses: [0, 200],
                }),
            ],
        })
    );

    // FONTS: Cache First (Google Fonts & Static) — immutable, long-lived
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

    // APP JS/CSS: Network First — always prefer fresh app code (Vite-hashed filenames)
    workbox.routing.registerRoute(
        ({request, url}) =>
            (request.destination === 'script' || request.destination === 'style') &&
            url.origin === self.location.origin,
        new workbox.strategies.NetworkFirst({
            cacheName: `${CACHE_PREFIX}-app-assets-${CACHE_SUFFIX}`,
            networkTimeoutSeconds: 3,
            plugins: [
                new workbox.cacheableResponse.CacheableResponsePlugin({
                    statuses: [0, 200],
                }),
                new workbox.expiration.ExpirationPlugin({
                    maxEntries: 80,
                    maxAgeSeconds: 7 * 24 * 60 * 60, // 7 Days
                    purgeOnQuotaError: true,
                }),
            ]
        })
    );

    // EXTERNAL CDN LIBS: Stale While Revalidate — fast first paint, background refresh
    workbox.routing.registerRoute(
        ({request, url}) =>
            (request.destination === 'script' || request.destination === 'style') &&
            url.origin !== self.location.origin,
        new workbox.strategies.StaleWhileRevalidate({
            cacheName: `${CACHE_PREFIX}-cdn-assets-${CACHE_SUFFIX}`,
            plugins: [
                new workbox.cacheableResponse.CacheableResponsePlugin({
                    statuses: [0, 200],
                }),
                new workbox.expiration.ExpirationPlugin({
                    maxEntries: 50,
                    maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
                    purgeOnQuotaError: true,
                }),
            ]
        })
    );

    // API REQUESTS: Network Only — do NOT cache AI responses (security)
    workbox.routing.registerRoute(
        ({url}) => url.href.includes('generativelanguage.googleapis.com'),
        new workbox.strategies.NetworkOnly({
            networkTimeoutSeconds: 30,
        })
    );

    // --- 3. OFFLINE FALLBACK (SPA NAVIGATION) ---
    const navigationStrategy = new workbox.strategies.NetworkFirst({
        cacheName: `${CACHE_PREFIX}-html-${CACHE_SUFFIX}`,
        networkTimeoutSeconds: 3,
        plugins: [
            new workbox.cacheableResponse.CacheableResponsePlugin({ statuses: [0, 200] }),
        ],
    });

    workbox.routing.registerRoute(
        ({request}) => request.mode === 'navigate',
        async ({event}) => {
            try {
                return await navigationStrategy.handle({event, request: event.request});
            } catch (_err) {
                // Network failed and cache miss — try index.html from any cache
                const fallbackUrl = new URL('index.html', self.registration.scope).toString();
                const cached = await caches.match(fallbackUrl) || await caches.match('index.html');
                return cached || new Response(
                    `<!DOCTYPE html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#020617"><title>DisinfoDesk — Offline</title><style>*{margin:0;box-sizing:border-box}body{background:#020617;color:#e2e8f0;font-family:system-ui,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;padding:2rem}.card{text-align:center;max-width:400px;padding:3rem 2rem;border:1px solid #1e293b;border-radius:1rem;background:#0f172a}.icon{font-size:3rem;margin-bottom:1.5rem;opacity:.6}h1{font-size:1.5rem;font-weight:700;margin-bottom:.75rem;letter-spacing:.05em}p{color:#94a3b8;font-size:.875rem;line-height:1.6;margin-bottom:1.5rem}button{background:#06b6d4;color:#020617;border:none;padding:.75rem 1.5rem;border-radius:.5rem;font-weight:700;font-size:.875rem;cursor:pointer;text-transform:uppercase;letter-spacing:.1em;transition:all .2s}button:hover{background:#22d3ee;box-shadow:0 0 20px rgba(6,182,212,.3)}@media(prefers-color-scheme:light){body{background:#f8fafc;color:#1e293b}.card{background:#fff;border-color:#e2e8f0}p{color:#64748b}}</style></head><body><div class="card"><div class="icon">📡</div><h1>Offline</h1><p>DisinfoDesk ist derzeit offline. Stellen Sie eine Internetverbindung her und versuchen Sie es erneut.<br><br>DisinfoDesk is currently offline. Please connect to the internet and try again.</p><button onclick="location.reload()">Retry / Erneut versuchen</button></div></body></html>`,
                    { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
                );
            }
        }
    );

    // --- 4. BACKGROUND SYNC (queue failed mutations for retry) ---
    if ('sync' in self.registration) {
        self.addEventListener('sync', (event) => {
            if (event.tag === 'disinfodesk-sync') {
                event.waitUntil(
                    // Replay queued IndexedDB mutations when connectivity returns
                    self.clients.matchAll().then(clients => {
                        clients.forEach(client => {
                            client.postMessage({ type: 'SYNC_COMPLETED', tag: event.tag });
                        });
                    })
                );
            }
        });
    }

    // --- 5. PERIODIC BACKGROUND SYNC (keep data fresh) ---
    self.addEventListener('periodicsync', (event) => {
        if (event.tag === 'disinfodesk-content-refresh') {
            event.waitUntil(
                // Pre-cache the app shell in background to keep it fresh
                caches.open(`${CACHE_PREFIX}-html-${CACHE_SUFFIX}`).then(cache => {
                    const shellUrl = new URL('index.html', self.registration.scope).toString();
                    return cache.add(shellUrl).catch(() => {});
                })
            );
        }
    });

} else {
    // Workbox failed to load — degrade gracefully
}

// --- 6. MESSAGE HANDLERS ---
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    // Cache status reporting for UI
    if (event.data && event.data.type === 'GET_CACHE_STATUS') {
        caches.keys().then(keys => {
            const relevantCaches = keys.filter(k => k.startsWith('disinfodesk-cache'));
            Promise.all(relevantCaches.map(k => caches.open(k).then(c => c.keys().then(reqs => ({ name: k, entries: reqs.length })))))
                .then(stats => {
                    const totalEntries = stats.reduce((sum, s) => sum + s.entries, 0);
                    event.source?.postMessage({ type: 'CACHE_STATUS', caches: stats, version: CACHE_SUFFIX, totalEntries });
                });
        });
    }
    // Clean specific cache on demand
    if (event.data && event.data.type === 'CLEAN_CACHE') {
        const targetCache = event.data.cacheName;
        if (targetCache && targetCache.startsWith(CACHE_PREFIX)) {
            caches.delete(targetCache).then(deleted => {
                event.source?.postMessage({ type: 'CACHE_CLEANED', cacheName: targetCache, deleted });
            });
        }
    }
    // Force-refresh: purge all caches and reload all clients
    if (event.data && event.data.type === 'FORCE_REFRESH') {
        caches.keys().then(keys =>
            Promise.all(keys.map(k => caches.delete(k)))
        ).then(() => {
            self.clients.matchAll({ type: 'window' }).then(clients => {
                clients.forEach(client => client.navigate(client.url));
            });
        });
    }
});