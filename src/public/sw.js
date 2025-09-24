// JanArogya PWA Service Worker with Demo Offline Support
const CACHE_NAME = 'janarogya-pwa-v1.0.1';
const OFFLINE_URL = '/offline.html';
const IS_DEMO_MODE = true; // Set to false for production

// Assets to cache for offline functionality
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/offline.html',
  // Core app assets will be cached dynamically
];

// Install event - cache core assets
self.addEventListener('install', (event) => {
  console.log('JanArogya PWA SW: Installing service worker (Demo Mode:', IS_DEMO_MODE, ')');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('JanArogya PWA SW: Caching core assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('JanArogya PWA SW: Core assets cached successfully');
        // Force the waiting service worker to become the active service worker
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('JanArogya PWA SW: Failed to cache assets:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('JanArogya PWA SW: Activating service worker');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('JanArogya PWA SW: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('JanArogya PWA SW: Service worker activated successfully');
        // Take control of all pages immediately
        return self.clients.claim();
      })
      .then(() => {
        // Notify clients that the service worker is ready
        return self.clients.matchAll().then(clients => {
          clients.forEach(client => {
            client.postMessage({
              type: 'SW_ACTIVATED',
              payload: { demoMode: IS_DEMO_MODE }
            });
          });
        });
      })
  );
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests and chrome-extension requests
  if (!event.request.url.startsWith(self.location.origin) || 
      event.request.url.startsWith('chrome-extension://')) {
    return;
  }

  console.log('JanArogya PWA SW: Handling fetch for:', event.request.url);

  // Handle navigation requests
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // If we get a valid response, cache it
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseClone);
              })
              .catch((error) => {
                console.warn('JanArogya PWA SW: Failed to cache navigation response:', error);
              });
          }
          return response;
        })
        .catch((error) => {
          console.log('JanArogya PWA SW: Network failed for navigation, serving from cache:', error);
          // If network fails, try to serve from cache
          return caches.match(event.request)
            .then((response) => {
              return response || caches.match('/') || caches.match('/offline.html');
            });
        })
    );
    return;
  }

  // Handle other requests with cache-first strategy for better offline performance
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          console.log('JanArogya PWA SW: Serving from cache:', event.request.url);
          return response;
        }
        
        return fetch(event.request)
          .then((response) => {
            // Don't cache non-successful responses or non-basic responses
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            console.log('JanArogya PWA SW: Caching new response:', event.request.url);
            // Cache successful responses
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              })
              .catch((error) => {
                console.warn('JanArogya PWA SW: Failed to cache response:', error);
              });

            return response;
          })
          .catch((error) => {
            console.log('JanArogya PWA SW: Fetch failed for:', event.request.url, error);
            // For failed requests, try to serve offline page if it's an HTML request
            if (event.request.headers.get('accept')?.includes('text/html')) {
              return caches.match('/offline.html');
            }
            throw error;
          });
      })
  );
});

// Handle background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('JanArogya SW: Background sync triggered:', event.tag);
  
  if (event.tag === 'patient-token-sync') {
    event.waitUntil(syncPatientTokens());
  } else if (event.tag === 'emergency-sos-sync') {
    event.waitUntil(syncEmergencySOS());
  } else if (event.tag === 'health-records-sync') {
    event.waitUntil(syncHealthRecords());
  }
});

// Sync functions for offline data
async function syncPatientTokens() {
  try {
    const offlineData = await getOfflineData('patient-tokens');
    if (offlineData && offlineData.length > 0) {
      // Sync with server when online
      for (const token of offlineData) {
        await fetch('/api/sync/patient-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(token)
        });
      }
      // Clear synced data
      await clearOfflineData('patient-tokens');
      console.log('JanArogya SW: Patient tokens synced successfully');
    }
  } catch (error) {
    console.error('JanArogya SW: Failed to sync patient tokens:', error);
  }
}

async function syncEmergencySOS() {
  try {
    const offlineData = await getOfflineData('emergency-sos');
    if (offlineData && offlineData.length > 0) {
      for (const sos of offlineData) {
        await fetch('/api/sync/emergency-sos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(sos)
        });
      }
      await clearOfflineData('emergency-sos');
      console.log('JanArogya SW: Emergency SOS synced successfully');
    }
  } catch (error) {
    console.error('JanArogya SW: Failed to sync emergency SOS:', error);
  }
}

async function syncHealthRecords() {
  try {
    const offlineData = await getOfflineData('health-records');
    if (offlineData && offlineData.length > 0) {
      for (const record of offlineData) {
        await fetch('/api/sync/health-record', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(record)
        });
      }
      await clearOfflineData('health-records');
      console.log('JanArogya SW: Health records synced successfully');
    }
  } catch (error) {
    console.error('JanArogya SW: Failed to sync health records:', error);
  }
}

// Utility functions for offline data management
async function getOfflineData(key) {
  return new Promise((resolve) => {
    const data = localStorage.getItem(`janarogya-offline-${key}`);
    resolve(data ? JSON.parse(data) : []);
  });
}

async function clearOfflineData(key) {
  return new Promise((resolve) => {
    localStorage.removeItem(`janarogya-offline-${key}`);
    resolve();
  });
}

// Handle push notifications for emergency alerts
self.addEventListener('push', (event) => {
  console.log('JanArogya SW: Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'JanArogya Health Alert',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '1'
    },
    actions: [
      {
        action: 'explore',
        title: 'Open App',
        icon: '/icons/checkmark.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icons/xmark.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('JanArogya Health Alert', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('JanArogya SW: Notification clicked');
  
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

console.log('JanArogya Service Worker loaded successfully');