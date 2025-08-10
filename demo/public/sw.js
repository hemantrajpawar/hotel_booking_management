const CACHE_NAME = 'offline-hotel-v2'; // IMPORTANT: I've updated the version number to v2

// Files that make up the "app shell"
const FILES_TO_CACHE = [
  // Make sure these paths are correct relative to your project's root
  '/',
  '/index.html',
  '/style.css',
  '/app.js',
  'https://cdn.jsdelivr.net/npm/idb@7/build/umd.js',
  '/images/icon-192.png',
  '/images/icon-512.png'
];

// 1. Install Event: Cache the app shell
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Install');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching app shell');
        return cache.addAll(FILES_TO_CACHE);
      })
  );
});

// 2. Activate Event: Clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activate');
  event.waitUntil(
    caches.keys().then((keyList) =>
      Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[Service Worker] Removing old cache', key);
            return caches.delete(key);
          }
        })
      )
    )
  );
  return self.clients.claim();
});

// 3. Fetch Event: A SINGLE, UNIFIED fetch listener
self.addEventListener('fetch', (event) => {
  // We only want to handle GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // STRATEGY 1: Network First for API calls
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          console.log('[Service Worker] Fetched from network (API):', event.request.url);
          // If we get a valid response, clone it, cache it for offline use, and return it
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
          return networkResponse;
        })
        .catch(() => {
          // If network fails, try to serve from cache
          console.log('[Service Worker] Network failed, trying cache (API):', event.request.url);
          return caches.match(event.request);
        })
    );
    return; // End execution for this strategy
  }

  // STRATEGY 2: Cache First for all other requests (Static Assets)
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // If the resource is in the cache, return it
        console.log('[Service Worker] Returning from cache (Asset):', event.request.url);
        return cachedResponse;
      }

      // If not in cache, fetch from network, cache it, and then return it
      return fetch(event.request).then((networkResponse) => {
        const responseClone = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseClone);
        });
        return networkResponse;
      });
    })
  );
});


// 4. Background Sync for offline bookings
self.addEventListener('sync', (event) => {
  console.log('[Service Worker] Sync event triggered', event.tag);
  if (event.tag === 'sync-new-bookings') {
    event.waitUntil(syncOfflineBookings());
  }
});

async function syncOfflineBookings() {
  console.log('[Service Worker] Syncing offline bookings...');
  // This requires the idb library to be available to the service worker
  // Ensure you import it at the top of your service worker if it's not already
  // importScripts('https://cdn.jsdelivr.net/npm/idb@7/build/umd.js');
  const db = await idb.openDB('booking-db', 1);
  const tx = db.transaction('offline-bookings', 'readwrite');
  const bookings = await tx.store.getAll();

  if (bookings.length > 0) {
    try {
      const response = await fetch('/api/sync-bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookings)
      });

      if (response.ok) {
        const clearTx = db.transaction('offline-bookings', 'readwrite');
        await clearTx.store.clear();
        await clearTx.done;
        console.log('[Service Worker] Offline bookings cleared from IndexedDB.');

        const clients = await self.clients.matchAll();
        clients.forEach(client => {
          client.postMessage({
            type: 'SYNC_COMPLETE',
            message: 'Your offline bookings have been processed!'
          });
        });
      }
    } catch (error) {
      console.error('[Service Worker] Sync failed:', error);
    }
  } else {
    console.log('[Service Worker] No offline bookings to sync.');
  }
}