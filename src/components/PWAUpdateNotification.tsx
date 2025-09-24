import React, { useState, useEffect } from 'react';

interface PWAUpdateNotificationProps {
  language: string;
}

export function PWAUpdateNotification({ language }: PWAUpdateNotificationProps) {
  const [showUpdate, setShowUpdate] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        setShowUpdate(true);
      });

      navigator.serviceWorker.getRegistration().then((reg) => {
        if (reg) {
          setRegistration(reg);
          reg.addEventListener('updatefound', () => {
            const newWorker = reg.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  setShowUpdate(true);
                }
              });
            }
          });
        }
      });
    }
  }, []);

  const handleUpdate = () => {
    if (registration && registration.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      setShowUpdate(false);
      window.location.reload();
    }
  };

  const getText = (key: string) => {
    const texts: Record<string, Record<string, string>> = {
      updateAvailable: {
        en: 'App Update Available',
        hi: 'ऐप अपडेट उपलब्ध',
        pa: 'ਐਪ ਅਪਡੇਟ ਉਪਲਬਧ',
        bn: 'অ্যাপ আপডেট উপলব্ধ'
      },
      updateMessage: {
        en: 'A new version of JanArogya is available. Update now for the latest features.',
        hi: 'जनआरोग्य का नया संस्करण उपलब्ध है। नवीनतम सुविधाओं के लिए अभी अपडेट करें।',
        pa: 'ਜਨਆਰੋਗਿਆ ਦਾ ਨਵਾਂ ਸੰਸਕਰਣ ਉਪਲਬਧ ਹੈ। ਨਵੀਨਤਮ ਵਿਸ਼ੇਸ਼ਤਾਵਾਂ ਲਈ ਹੁਣੇ ਅਪਡੇਟ ਕਰੋ।',
        bn: 'জনআরোগ্যের নতুন সংস্করণ উপলব্ধ। সর্বশেষ বৈশিষ্ট্যের জন্য এখনই আপডেট করুন।'
      },
      updateNow: {
        en: 'Update Now',
        hi: 'अभी अपडेट करें',
        pa: 'ਹੁਣੇ ਅਪਡੇਟ ਕਰੋ',
        bn: 'এখনই আপডেট করুন'
      },
      later: {
        en: 'Later',
        hi: 'बाद में',
        pa: 'ਬਾਅਦ ਵਿੱਚ',
        bn: 'পরে'
      }
    };
    return texts[key]?.[language] || texts[key]?.en || key;
  };

  if (!showUpdate) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm z-50">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
            <span className="text-emerald-600 text-sm">↑</span>
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-900">
            {getText('updateAvailable')}
          </h3>
          <p className="mt-1 text-xs text-gray-600">
            {getText('updateMessage')}
          </p>
          <div className="mt-3 flex space-x-2">
            <button
              onClick={handleUpdate}
              className="bg-emerald-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-emerald-700"
            >
              {getText('updateNow')}
            </button>
            <button
              onClick={() => setShowUpdate(false)}
              className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-xs font-medium hover:bg-gray-200"
            >
              {getText('later')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}