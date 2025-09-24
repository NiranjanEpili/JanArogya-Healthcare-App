import React, { useState, useEffect } from 'react';

export function PWAStatus() {
  const [swStatus, setSwStatus] = useState<string>('checking');
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [environment, setEnvironment] = useState<string>('unknown');

  useEffect(() => {
    // Check installation status
    const checkInstallation = () => {
      const installed = window.matchMedia('(display-mode: standalone)').matches || 
                       (window.navigator as any).standalone === true;
      setIsInstalled(installed);
    };

    // Check service worker status
    const checkServiceWorker = async () => {
      if (!('serviceWorker' in navigator)) {
        setSwStatus('not-supported');
        return;
      }
      
      try {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration) {
          if (registration.active) {
            setSwStatus('active');
          } else if (registration.installing) {
            setSwStatus('installing');
          } else if (registration.waiting) {
            setSwStatus('waiting');
          } else {
            setSwStatus('registered');
          }
        } else {
          setSwStatus('not-registered');
        }
      } catch (error) {
        setSwStatus('error');
        console.error('JanArogya PWA Status: Error checking service worker:', error);
      }
    };

    // Check installability
    const handleBeforeInstallPrompt = () => {
      setIsInstallable(true);
      console.log('JanArogya PWA Status: App is installable');
    };

    // Detect environment
    const detectEnvironment = () => {
      const hostname = window.location.hostname;
      if (hostname.includes('figma')) {
        setEnvironment('figma-preview');
      } else if (hostname === 'localhost' || hostname === '127.0.0.1') {
        setEnvironment('localhost');
      } else if (hostname.includes('vercel') || hostname.includes('netlify')) {
        setEnvironment('hosting');
      } else {
        setEnvironment('production');
      }
    };

    checkInstallation();
    checkServiceWorker();
    detectEnvironment();

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      console.log('JanArogya PWA Status: App was installed');
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // Show in demo environment or when there are issues
  const shouldShow = environment === 'figma-preview' || 
                    swStatus === 'error' || 
                    swStatus === 'not-registered' || 
                    swStatus === 'checking';

  if (!shouldShow) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-200 rounded-lg p-3 shadow-lg text-xs z-40 max-w-48">
      <div className="font-medium text-gray-900 mb-1">PWA Status</div>
      <div className="space-y-1 text-gray-600">
        <div>Environment: <span className="text-blue-600">{environment}</span></div>
        <div>SW: <span className={['active', 'registered'].includes(swStatus) ? 'text-green-600' : 'text-red-600'}>{swStatus}</span></div>
        <div>Installable: <span className={isInstallable ? 'text-green-600' : 'text-gray-400'}>{isInstallable ? 'Yes' : 'No'}</span></div>
        <div>Installed: <span className={isInstalled ? 'text-green-600' : 'text-gray-400'}>{isInstalled ? 'Yes' : 'No'}</span></div>
        {environment === 'figma-preview' && (
          <div className="text-xs text-blue-600 mt-2 border-t pt-1">
            PWA features limited in preview
          </div>
        )}
      </div>
    </div>
  );
}