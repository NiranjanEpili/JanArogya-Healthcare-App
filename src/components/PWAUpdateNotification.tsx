import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { RefreshCw, X, Download } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface PWAUpdateNotificationProps {
  language: 'en' | 'hi' | 'pa' | 'bn';
  registration?: ServiceWorkerRegistration;
}

const translations = {
  en: {
    title: 'Update Available',
    description: 'A new version of JanArogya is ready to install',
    updateButton: 'Update Now',
    laterButton: 'Update Later',
    updating: 'Updating...',
    updateComplete: 'Update Complete!',
    reloadMessage: 'Please reload the page to use the new version'
  },
  hi: {
    title: 'अपडेट उपलब्ध',
    description: 'जनआरोग्य का नया वर्शन इंस्टॉल के लिए तैयार है',
    updateButton: 'अभी अपडेट करें',
    laterButton: 'बाद में अपडेट करें',
    updating: 'अपडेट हो रहा है...',
    updateComplete: 'अपडेट पूरा!',
    reloadMessage: 'नया वर्शन उपयोग करने के लिए कृपया पेज रीलोड करें'
  },
  pa: {
    title: 'ਅਪਡੇਟ ਉਪਲਬਧ',
    description: 'ਜਨਆਰੋਗਿਆ ਦਾ ਨਵਾਂ ਵਰਜ਼ਨ ਇੰਸਟਾਲ ਲਈ ਤਿਆਰ ਹੈ',
    updateButton: 'ਹੁਣੇ ਅਪਡੇਟ ਕਰੋ',
    laterButton: 'ਬਾਅਦ ਵਿੱਚ ਅਪਡੇਟ ਕਰੋ',
    updating: 'ਅਪਡੇਟ ਹੋ ਰਿਹਾ ਹੈ...',
    updateComplete: 'ਅਪਡੇਟ ਪੂਰਾ!',
    reloadMessage: 'ਨਵਾਂ ਵਰਜ਼ਨ ਵਰਤਣ ਲਈ ਕਿਰਪਾ ਕਰਕੇ ਪੰਨਾ ਰੀਲੋਡ ਕਰੋ'
  },
  bn: {
    title: 'আপডেট উপলব্ধ',
    description: 'জনআরোগ্যের নতুন সংস্করণ ইনস্টলের জন্য প্রস্তুত',
    updateButton: 'এখনই আপডেট করুন',
    laterButton: 'পরে আপডেট করু���',
    updating: 'আপডেট হচ্ছে...',
    updateComplete: 'আপডেট সম্পূর্ণ!',
    reloadMessage: 'নতুন সংস্করণ ব্যবহার করতে অনুগ্রহ করে পৃষ্ঠা রিলোড করুন'
  }
};

export function PWAUpdateNotification({ language, registration }: PWAUpdateNotificationProps) {
  const [showUpdate, setShowUpdate] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateComplete, setUpdateComplete] = useState(false);

  const t = translations[language];

  useEffect(() => {
    if (registration) {
      const handleUpdate = () => {
        setShowUpdate(true);
        
        // Voice notification
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(t.description);
          utterance.lang = language === 'hi' ? 'hi-IN' : 'en-US';
          speechSynthesis.speak(utterance);
        }

        // Toast notification
        toast.info(t.title, {
          description: t.description,
          action: {
            label: t.updateButton,
            onClick: handleUpdateClick
          }
        });
      };

      // Check if there's an update waiting
      if (registration.waiting) {
        handleUpdate();
      }

      // Listen for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              handleUpdate();
            }
          });
        }
      });
    }
  }, [registration, language, t.description, t.title, t.updateButton]);

  const handleUpdateClick = async () => {
    if (!registration || !registration.waiting) return;

    setIsUpdating(true);

    try {
      // Tell the waiting service worker to skip waiting and become active
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });

      // Listen for the new service worker to take control
      const handleControllerChange = () => {
        setIsUpdating(false);
        setUpdateComplete(true);
        setShowUpdate(false);
        
        // Show success message
        toast.success(t.updateComplete, {
          description: t.reloadMessage
        });

        // Auto-reload after 2 seconds
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      };

      navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange, { once: true });

      // Fallback: reload after 5 seconds if controller doesn't change
      setTimeout(() => {
        if (isUpdating) {
          window.location.reload();
        }
      }, 5000);

    } catch (error) {
      console.error('Error updating service worker:', error);
      setIsUpdating(false);
      toast.error('Update failed', {
        description: 'Please refresh the page manually'
      });
    }
  };

  const handleLater = () => {
    setShowUpdate(false);
    
    // Show again after 1 hour
    setTimeout(() => {
      if (registration && registration.waiting) {
        setShowUpdate(true);
      }
    }, 60 * 60 * 1000);
  };

  if (!showUpdate) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <Card className="bg-white shadow-xl border-l-4 border-l-primary">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-full">
              <Download className="h-4 w-4 text-primary" />
            </div>
            <div>
              <CardTitle className="text-sm font-semibold">{t.title}</CardTitle>
              <CardDescription className="text-xs">{t.description}</CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLater}
              className="h-6 w-6 p-0 ml-auto"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          <div className="flex gap-2">
            <Button
              onClick={handleUpdateClick}
              disabled={isUpdating}
              size="sm"
              className="flex-1 bg-primary hover:bg-primary/90 text-white"
            >
              {isUpdating ? (
                <div className="flex items-center gap-1">
                  <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent"></div>
                  <span className="text-xs">{t.updating}</span>
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <RefreshCw className="h-3 w-3" />
                  <span className="text-xs">{t.updateButton}</span>
                </div>
              )}
            </Button>
            
            <Button
              onClick={handleLater}
              variant="outline"
              size="sm"
              className="text-xs"
            >
              {t.laterButton}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}