// Utility to ensure service worker registration is not blocked
export function ensureServiceWorkerRegistration(): boolean {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return false;
  }

  // Check if the register method has been overridden/blocked
  const registerMethod = navigator.serviceWorker.register;
  const isNativeMethod = registerMethod.toString().includes('[native code]') || 
                         registerMethod.toString().includes('native function');

  if (!isNativeMethod) {
    console.warn('JanArogya PWA: Service worker registration appears to be blocked');
    
    // Try to restore the original method (this is a workaround)
    try {
      // Create a fresh iframe to get the original ServiceWorker interface
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      document.body.appendChild(iframe);
      
      const freshWindow: any = iframe.contentWindow;
      if (freshWindow && freshWindow.navigator && freshWindow.navigator.serviceWorker) {
        console.log('JanArogya PWA: Attempting to restore service worker registration');
        
        // This is a hack - try to get the original register method
        const originalRegister = freshWindow.navigator.serviceWorker.register;
        if (originalRegister && typeof originalRegister === 'function') {
          // Bind it to our navigator.serviceWorker
          navigator.serviceWorker.register = originalRegister.bind(navigator.serviceWorker);
          console.log('JanArogya PWA: Service worker registration restored');
        }
      }
      
      // Clean up
      document.body.removeChild(iframe);
      
    } catch (error) {
      console.error('JanAregya PWA: Failed to restore service worker registration:', error);
    }
  }

  return true;
}

// Alternative registration method that bypasses potential blocks
export async function registerServiceWorkerDirectly(swUrl: string, options?: RegistrationOptions): Promise<ServiceWorkerRegistration> {
  if (!('serviceWorker' in navigator)) {
    throw new Error('Service workers not supported');
  }

  try {
    // First ensure registration is not blocked
    ensureServiceWorkerRegistration();
    
    // Attempt direct registration
    console.log('JanArogya PWA: Registering service worker directly:', swUrl);
    const registration = await navigator.serviceWorker.register(swUrl, options);
    
    console.log('JanArogya PWA: Direct registration successful:', registration);
    return registration;
    
  } catch (error) {
    console.error('JanArogya PWA: Direct registration failed:', error);
    
    // Last resort: try without options
    try {
      console.log('JanArogya PWA: Attempting registration without options...');
      return await navigator.serviceWorker.register(swUrl);
    } catch (fallbackError) {
      console.error('JanArogya PWA: All registration attempts failed:', fallbackError);
      throw fallbackError;
    }
  }
}

// Check if PWA is installable
export function checkPWAInstallability(): Promise<boolean> {
  return new Promise((resolve) => {
    let installPromptReceived = false;
    
    // Listen for install prompt
    const handleBeforeInstallPrompt = () => {
      installPromptReceived = true;
      resolve(true);
    };
    
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    // Check after 2 seconds
    setTimeout(() => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      if (!installPromptReceived) {
        // Check other PWA indicators
        const isPWAReady = 'serviceWorker' in navigator && 
                          window.location.protocol === 'https:' ||
                          window.location.hostname === 'localhost';
        resolve(isPWAReady);
      }
    }, 2000);
  });
}

// Simple service worker registration status checker
export async function getServiceWorkerStatus(): Promise<string> {
  if (!('serviceWorker' in navigator)) {
    return 'not-supported';
  }
  
  try {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
      if (registration.active) {
        return 'active';
      } else if (registration.installing) {
        return 'installing';
      } else if (registration.waiting) {
        return 'waiting';
      } else {
        return 'registered';
      }
    } else {
      return 'not-registered';
    }
  } catch (error) {
    console.error('JanArogya PWA: Error checking service worker status:', error);
    return 'error';
  }
}