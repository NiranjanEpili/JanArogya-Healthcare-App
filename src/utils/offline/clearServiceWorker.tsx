// Clear any existing service workers to prevent 404 errors
// Service worker blocking is DISABLED to allow PWA functionality
export const blockServiceWorkerRegistration = (enable: boolean = false): void => {
  console.log('JanArogya: Service worker blocking is disabled to allow PWA functionality');
  // This function now does nothing to ensure PWA works properly
  return;
};

// Allow service worker registration (restore original functionality)
export const allowServiceWorkerRegistration = (): void => {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }
  
  // If we've overridden the register method, we can't easily restore it
  // So this is mainly for future use or if we store the original method
  console.log('JanArogya: Service worker registration allowed');
};

export const clearExistingServiceWorkers = async (): Promise<void> => {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    console.log('Service workers not supported, skipping cleanup');
    return;
  }

  try {
    console.log('Checking for existing service workers...');
    const registrations = await navigator.serviceWorker.getRegistrations();
    
    if (registrations.length === 0) {
      console.log('No existing service workers found');
      return;
    }

    console.log(`Found ${registrations.length} existing service worker(s), unregistering...`);
    
    for (const registration of registrations) {
      console.log('Unregistering service worker:', registration.scope);
      try {
        await registration.unregister();
        console.log('Successfully unregistered:', registration.scope);
      } catch (error) {
        console.error('Failed to unregister service worker:', error);
      }
    }
    
    console.log('JanArogya: All existing service workers cleared, using demo mode only');
  } catch (error) {
    console.error('Failed to clear service workers:', error);
    console.log('Continuing with demo mode only');
  }
};