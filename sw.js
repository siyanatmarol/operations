// Siyanat Marol Operations Portal - Service Worker
const CACHE_NAME = 'siyanat-pwa-v1';
const STATIC_ASSETS = [
    './',
    './index.html',
    './manifest.json',
    './icon-192.png',
    './icon-512.png',
    './apple-touch-icon.png',
    './favicon.png',
    'https://cdn.tailwindcss.com',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.31/jspdf.plugin.autotable.min.js'
];

// Install: Cache critical static shell assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[SW] Pre-caching static app shell');
            return cache.addAll(STATIC_ASSETS).catch(err => {
                console.warn('[SW] Non-critical pre-cache item failed:', err);
            });
        }).then(() => self.skipWaiting())
    );
});

// Activate: Clean up previous version caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) {
                        console.log('[SW] Deleting old cache:', key);
                        return caches.delete(key);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch: Network-first for dynamic Firebase & Apps Script APIs, Cache-first / Stale-while-revalidate for static shell
self.addEventListener('fetch', (event) => {
    const request = event.request;
    const url = new URL(request.url);

    // Bypass caching for Firebase Realtime DB, Auth, WATI, and Google Apps Script
    if (
        url.hostname.includes('firebasedatabase.app') ||
        url.hostname.includes('firebaseio.com') ||
        url.hostname.includes('googleapis.com') ||
        url.hostname.includes('wati.io') ||
        url.hostname.includes('script.google.com') ||
        url.hostname.includes('identitytoolkit') ||
        request.method !== 'GET'
    ) {
        return; // Normal network request
    }

    // For static app files and CDN assets, use Network-First with Cache Fallback
    event.respondWith(
        fetch(request)
            .then((networkResponse) => {
                if (networkResponse && networkResponse.status === 200 && networkResponse.type !== 'opaque') {
                    const responseClone = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(request, responseClone);
                    });
                }
                return networkResponse;
            })
            .catch(() => {
                // If network fails (offline), return cached asset
                return caches.match(request).then((cachedResponse) => {
                    if (cachedResponse) return cachedResponse;
                    if (request.mode === 'navigate') {
                        return caches.match('./index.html');
                    }
                    return new Response('Network error and asset not cached', { status: 503, statusText: 'Offline' });
                });
            })
    );
});
