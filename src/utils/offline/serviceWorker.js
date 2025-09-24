// JanArogya Service Worker for Offline Functionality
const CACHE_NAME = 'janarogya-v1';
const OFFLINE_URL = '/offline.html';

// Resources to cache for offline use
const CACHE_URLS = [
  '/',
  '/App.tsx',
  '/styles/globals.css',
  // Add other static resources
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  console.log('JanArogya Service Worker installing');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Caching JanArogya resources');
        return cache.addAll(CACHE_URLS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - cleanup old caches
self.addEventListener('activate', (event) => {
  console.log('JanArogya Service Worker activating');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
      .catch(() => {
        // If both cache and network fail, show offline page for navigation requests
        if (event.request.mode === 'navigate') {
          return caches.match(OFFLINE_URL);
        }
      })
  );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('Background sync triggered:', event.tag);
  
  if (event.tag === 'janarogya-sync') {
    event.waitUntil(syncOfflineData());
  }
});

// Sync offline data when connection is restored
async function syncOfflineData() {
  try {
    // Get offline actions from IndexedDB
    const offlineActions = await getOfflineActions();
    
    for (const action of offlineActions) {
      try {
        await processOfflineAction(action);
        await removeOfflineAction(action.id);
        console.log('Synced offline action:', action.type);
      } catch (error) {
        console.error('Failed to sync action:', action.type, error);
      }
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// Process individual offline actions
async function processOfflineAction(action) {
  switch (action.type) {
    case 'BOOK_TOKEN':
      await fetch('/api/book-token', {
        method: 'POST',
        body: JSON.stringify(action.data)
      });
      break;
    
    case 'EMERGENCY_SOS':
      await fetch('/api/emergency-sos', {
        method: 'POST', 
        body: JSON.stringify(action.data)
      });
      break;
    
    case 'HEALTH_RECORD':
      await fetch('/api/health-record', {
        method: 'POST',
        body: JSON.stringify(action.data)
      });
      break;
      
    case 'PRESCRIPTION':
      await fetch('/api/prescription', {
        method: 'POST',
        body: JSON.stringify(action.data)
      });
      break;
      
    default:
      console.warn('Unknown offline action type:', action.type);
  }
}

// IndexedDB helper functions (simplified)
async function getOfflineActions() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('JanArogyaOffline', 1);
    
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(['actions'], 'readonly');
      const store = transaction.objectStore('actions');
      const getAllRequest = store.getAll();
      
      getAllRequest.onsuccess = () => resolve(getAllRequest.result);
      getAllRequest.onerror = () => reject(getAllRequest.error);
    };
    
    request.onerror = () => reject(request.error);
  });
}

async function removeOfflineAction(id) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('JanArogyaOffline', 1);
    
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(['actions'], 'readwrite');
      const store = transaction.objectStore('actions');
      const deleteRequest = store.delete(id);
      
      deleteRequest.onsuccess = () => resolve();
      deleteRequest.onerror = () => reject(deleteRequest.error);
    };
    
    request.onerror = () => reject(request.error);
  });
}