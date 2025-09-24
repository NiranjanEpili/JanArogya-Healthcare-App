// Clean service worker registration for JanArogya PWA
// This bypasses any potential blocking mechanisms

declare global {
  interface Window {
    __SW_REGISTRATION_ATTEMPTED__: boolean;
  }
}

let originalRegister: typeof navigator.serviceWorker.register | null = null;

// Store the original register method before it can be overridden
export function preserveOriginalServiceWorker() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    if (!originalRegister) {
      originalRegister = navigator.serviceWorker.register.bind(navigator.serviceWorker);
      console.log('JanArogya PWA: Original service worker register method preserved');
    }
  }
}

// Restore original service worker registration if it was blocked
export function restoreServiceWorkerRegistration() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator && originalRegister) {
    navigator.serviceWorker.register = originalRegister;
    console.log('JanArogya PWA: Service worker registration restored');
    return true;
  }
  return false;
}

// Clean registration method that bypasses any blocks
export async function cleanServiceWorkerRegistration(
  scriptURL: string, 
  options?: RegistrationOptions
): Promise<ServiceWorkerRegistration> {
  
  // Prevent multiple registration attempts
  if (window.__SW_REGISTRATION_ATTEMPTED__) {
    console.log('JanArogya PWA: Service worker registration already attempted');
    const existing = await navigator.serviceWorker.getRegistration();
    if (existing) {
      return existing;
    }
  }

  window.__SW_REGISTRATION_ATTEMPTED__ = true;

  try {
    console.log('JanArogya PWA: Starting clean service worker registration...');
    
    // Method 1: Use preserved original if available
    if (originalRegister) {
      console.log('JanArogya PWA: Using preserved original register method');
      return await originalRegister(scriptURL, options);
    }
    
    // Method 2: Direct call to current method
    console.log('JanArogya PWA: Using current register method');
    return await navigator.serviceWorker.register(scriptURL, options);
    
  } catch (error) {
    console.error('JanArogya PWA: Clean registration failed:', error);
    
    // Method 3: Try without options as fallback
    try {
      console.log('JanArogya PWA: Trying fallback registration without options...');
      return await navigator.serviceWorker.register(scriptURL);
    } catch (fallbackError) {
      console.error('JanArogya PWA: All registration methods failed:', fallbackError);
      throw fallbackError;
    }
  }
}

// Initialize clean service worker registration
export function initializeCleanServiceWorker() {
  // Preserve the original method as early as possible
  preserveOriginalServiceWorker();
  
  // Set up a mutation observer to catch any DOM-based blocking
  if (typeof window !== 'undefined' && window.MutationObserver) {
    const observer = new MutationObserver(() => {
      // Re-preserve in case something tries to override
      preserveOriginalServiceWorker();
    });
    
    observer.observe(document.head, { 
      childList: true, 
      subtree: true 
    });
    
    // Clean up after 5 seconds
    setTimeout(() => {
      observer.disconnect();
    }, 5000);
  }
}

// Emergency reset - clears all service workers and starts fresh
export async function emergencyServiceWorkerReset(): Promise<void> {
  if (!('serviceWorker' in navigator)) {
    return;
  }
  
  try {
    console.log('JanArogya PWA: Performing emergency service worker reset...');
    
    // Unregister all existing service workers
    const registrations = await navigator.serviceWorker.getRegistrations();
    for (const registration of registrations) {
      await registration.unregister();
      console.log('JanArogya PWA: Unregistered service worker:', registration.scope);
    }
    
    // Clear cache storage
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      for (const cacheName of cacheNames) {
        await caches.delete(cacheName);
        console.log('JanArogya PWA: Deleted cache:', cacheName);
      }
    }
    
    console.log('JanArogya PWA: Emergency reset completed');
    
  } catch (error) {
    console.error('JanArogya PWA: Emergency reset failed:', error);
  }
}