import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, RefreshCw, AlertCircle } from 'lucide-react';
import { demoOfflineManager } from '../utils/offline/demoOffline';

type Language = 'en' | 'hi' | 'pa' | 'bn';

interface OfflineIndicatorProps {
  language: Language;
}

const content = {
  online: {
    en: 'Online',
    hi: 'ऑनलाइन',
    pa: 'ਔਨਲਾਈਨ',
    bn: 'অনলাইন'
  },
  offline: {
    en: 'Offline',
    hi: 'ऑफलाइन',
    pa: 'ਔਫਲਾਈਨ',
    bn: 'অফলাইন'
  },
  syncing: {
    en: 'Syncing...',
    hi: 'सिंक हो रहा है...',
    pa: 'ਸਿੰਕ ਹੋ ਰਿਹਾ ਹੈ...',
    bn: 'সিঙ্ক হচ্ছে...'
  },
  offlineMode: {
    en: 'Working offline - data will sync when connected',
    hi: 'ऑफलाइन काम कर रहा है - कनेक्शन मिलने पर डेटा सिंक होगा',
    pa: 'ਔਫਲਾਈਨ ਕੰਮ ਕਰ ਰਿਹਾ ਹੈ - ਕਨੈਕਸ਼ਨ ਮਿਲਣ \'ਤੇ ਡੇਟਾ ਸਿੰਕ ਹੋਵੇਗਾ',
    bn: 'অফলাইন কাজ করছে - সংযোগ পেলে ডেটা সিঙ্ক হবে'
  },
  syncNow: {
    en: 'Sync Now',
    hi: 'अभी सिंक करें',
    pa: 'ਹੁਣ ਸਿੰਕ ਕਰੋ',
    bn: 'এখন সিঙ্ক করুন'
  },
  tapToSync: {
    en: 'Tap to sync',
    hi: 'सिंक करने के लिए टैप करें',
    pa: 'ਸਿੰਕ ਕਰਨ ਲਈ ਟੈਪ ਕਰੋ',
    bn: 'সিঙ্ক করতে ট্যাপ করুন'
  }
};

export function OfflineIndicator({ language }: OfflineIndicatorProps) {
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [pendingActions, setPendingActions] = useState(0);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      speak(content.online[language]);
    };

    const handleOffline = () => {
      setIsOnline(false);
      speak(content.offlineMode[language]);
    };

    // Check sync status periodically
    const checkSyncStatus = () => {
      setIsSyncing(false); // Demo mode doesn't show syncing state
      setPendingActions(demoOfflineManager.getPendingActionsCount());
    };

    const interval = setInterval(checkSyncStatus, 1000);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      clearInterval(interval);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [language]);

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'hi' ? 'hi-IN' : language === 'pa' ? 'pa-IN' : language === 'bn' ? 'bn-IN' : 'en-US';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const handleSyncNow = async () => {
    if (isOnline && !isSyncing) {
      speak(content.syncing[language]);
      await demoOfflineManager.forceSync();
    }
  };

  const getStatusColor = () => {
    if (isSyncing) return 'bg-yellow-500';
    if (isOnline) return 'bg-green-500';
    return 'bg-red-500';
  };

  const getStatusIcon = () => {
    if (isSyncing) return <RefreshCw className="w-4 h-4 animate-spin" />;
    if (isOnline) return <Wifi className="w-4 h-4" />;
    return <WifiOff className="w-4 h-4" />;
  };

  const getStatusText = () => {
    if (isSyncing) return content.syncing[language];
    if (isOnline) return content.online[language];
    return content.offline[language];
  };

  return (
    <div className="fixed top-20 right-4 z-40">
      {/* Main Status Indicator */}
      <div 
        className={`${getStatusColor()} text-white px-3 py-2 rounded-full shadow-lg 
                   flex items-center space-x-2 cursor-pointer transition-all duration-300
                   hover:scale-105 ${showDetails ? 'rounded-b-none' : ''}`}
        onClick={() => setShowDetails(!showDetails)}
      >
        {getStatusIcon()}
        <span className="text-sm font-medium">{getStatusText()}</span>
      </div>

      {/* Detailed Status Panel */}
      {showDetails && (
        <div className="bg-white border border-gray-200 rounded-b-lg shadow-lg p-4 mt-0 w-64">
          <div className="space-y-3">
            {/* Connection Status */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {language === 'hi' ? 'कनेक्शन स्थिति:' : 
                 language === 'pa' ? 'ਕਨੈਕਸ਼ਨ ਸਥਿਤੀ:' :
                 language === 'bn' ? 'সংযোগ অবস্থা:' :
                 'Connection Status:'}
              </span>
              <div className="flex items-center space-x-1">
                {getStatusIcon()}
                <span className={`text-sm font-medium ${isOnline ? 'text-green-600' : 'text-red-600'}`}>
                  {getStatusText()}
                </span>
              </div>
            </div>

            {/* Offline Mode Notice */}
            {!isOnline && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-yellow-800 font-medium">
                      {language === 'hi' ? 'ऑफलाइन मोड' : 
                       language === 'pa' ? 'ਔਫਲਾਈਨ ਮੋਡ' :
                       language === 'bn' ? 'অফলাইন মোড' :
                       'Offline Mode'}
                    </p>
                    <p className="text-xs text-yellow-700 mt-1">
                      {content.offlineMode[language]}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Sync Button */}
            {isOnline && (
              <button
                onClick={handleSyncNow}
                disabled={isSyncing}
                className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-300 
                         text-white py-2 px-4 rounded-lg text-sm font-medium
                         flex items-center justify-center space-x-2 transition-colors"
                style={{ backgroundColor: isOnline && !isSyncing ? '#2EB086' : undefined }}
              >
                <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{content.syncNow[language]}</span>
              </button>
            )}

            {/* Feature Status */}
            <div className="border-t border-gray-200 pt-3">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                {language === 'hi' ? 'ऑफलाइन सुविधाएं:' : 
                 language === 'pa' ? 'ਔਫਲਾਈਨ ਸੁਵਿਧਾਵਾਂ:' :
                 language === 'bn' ? 'অফলাইন বৈশিষ্ট্য:' :
                 'Offline Features:'}
              </h4>
              <div className="space-y-1">
                {[
                  language === 'hi' ? 'टोकन बुकिंग' : 
                  language === 'pa' ? 'ਟੋਕਨ ਬੁਕਿੰਗ' :
                  language === 'bn' ? 'টোকেন বুকিং' : 'Token Booking',
                  
                  language === 'hi' ? 'आपातकालीन SOS' : 
                  language === 'pa' ? 'ਐਮਰਜੈਂਸੀ SOS' :
                  language === 'bn' ? 'জরুরি SOS' : 'Emergency SOS',
                  
                  language === 'hi' ? 'स्वास्थ्य रिकॉर्ड' : 
                  language === 'pa' ? 'ਸਿਹਤ ਰਿਕਾਰਡ' :
                  language === 'bn' ? 'স্বাস্থ্য রেকর্ড' : 'Health Records',
                  
                  language === 'hi' ? 'प्रिस्क्रिप्शन' : 
                  language === 'pa' ? 'ਨੁਸਖਾ' :
                  language === 'bn' ? 'প্রেসক্রিপশন' : 'Prescriptions'
                ].map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-gray-600">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}