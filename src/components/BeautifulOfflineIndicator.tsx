import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { WifiOff, Wifi, Cloud, CloudOff, RefreshCw, CheckCircle, AlertCircle, Heart, Shield } from 'lucide-react';
import { enhancedOfflineManager } from '../utils/offline/enhancedOfflineManager';

interface BeautifulOfflineIndicatorProps {
  language: 'en' | 'hi' | 'pa' | 'bn';
}

export function BeautifulOfflineIndicator({ language }: BeautifulOfflineIndicatorProps) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOfflinePanel, setShowOfflinePanel] = useState(false);
  const [syncStatus, setSyncStatus] = useState({ pending: 0, failed: 0, total: 0 });
  const [isAppWorking, setIsAppWorking] = useState(true);

  const content = {
    offlineMode: {
      en: "Offline Mode",
      hi: "ऑफलाइन मोड",
      pa: "ਔਫਲਾਈਨ ਮੋਡ",
      bn: "অফলাইন মোড"
    },
    onlineMode: {
      en: "Online Mode",
      hi: "ऑनलाइन मोड",
      pa: "ਔਨਲਾਈਨ ਮੋਡ",
      bn: "অনলাইন মোড"
    },
    appWorking: {
      en: "All features working offline",
      hi: "सभी सुविधाएं ऑफलाइन काम कर रही हैं",
      pa: "ਸਾਰੀਆਂ ਸੁਵਿਧਾਵਾਂ ਔਫਲਾਈਨ ਕੰਮ ਕਰ ਰਹੀਆਂ ਹਨ",
      bn: "সমস্ত বৈশিষ্ট্য অফলাইন কাজ করছে"
    },
    pendingSync: {
      en: "items waiting to sync",
      hi: "आइटम सिंक होने की प्रतीक्षा में",
      pa: "ਆਈਟਮ ਸਿੰਕ ਹੋਣ ਦੀ ਉਡੀਕ ਵਿੱਚ",
      bn: "আইটেম সিঙ্ক হওয়ার অপেক্ষায়"
    },
    dataProtected: {
      en: "Your data is safely stored offline and will sync when connection returns",
      hi: "आपका डेटा सुरक्षित रूप से ऑफलाइन संग्रहीत है और कनेक्शन वापस आने पर सिंक हो जाएगा",
      pa: "ਤੁਹਾਡਾ ਡੇਟਾ ਸੁਰੱਖਿਤ ਰੂਪ ਵਿੱਚ ਔਫਲਾਈਨ ਸਟੋਰ ਹੈ ਅਤੇ ਕਨੈਕਸ਼ਨ ਵਾਪਸ ਆਉਣ 'ਤੇ ਸਿੰਕ ਹੋਵੇਗਾ",
      bn: "আপনার ডেটা নিরাপদে অফলাইন সংরক্ষিত এবং সংযোগ ফিরে এলে সিঙ্ক হবে"
    },
    emergencyAvailable: {
      en: "Emergency services work offline",
      hi: "आपातकालীन सेवाएं ऑफलाइन काम करती हैं",
      pa: "ਐਮਰਜੈਂਸੀ ਸੇਵਾਵਾਂ ਔਫਲਾਈਨ ਕੰਮ ਕਰਦੀਆਂ ਹਨ",
      bn: "জরুরি সেবা অফলাইন কাজ করে"
    },
    voiceWorking: {
      en: "Voice commands fully functional",
      hi: "वॉइस कमांड पूरी तरह कार्यात्मक",
      pa: "ਵਾਇਸ ਕਮਾਂਡ ਪੂਰੀ ਤਰ੍ਹਾਂ ਕੰਮ ਕਰ ਰਹੇ ਹਨ",
      bn: "ভয়েস কমান্ড সম্পূর্ণ কার্যকরী"
    }
  };

  // Monitor network status
  useEffect(() => {
    const updateOnlineStatus = () => {
      const online = navigator.onLine;
      setIsOnline(online);
      
      // Show offline panel when going offline
      if (!online && isOnline) {
        setShowOfflinePanel(true);
        setTimeout(() => setShowOfflinePanel(false), 5000);
      }
    };
    
    enhancedOfflineManager.addNetworkListener(updateOnlineStatus);
    
    return () => {
      enhancedOfflineManager.removeNetworkListener(updateOnlineStatus);
    };
  }, [isOnline]);

  // Update sync status periodically
  useEffect(() => {
    const updateSyncStatus = () => {
      const status = enhancedOfflineManager.getSyncStatus();
      setSyncStatus(status);
    };

    updateSyncStatus();
    const interval = setInterval(updateSyncStatus, 5000);
    
    return () => clearInterval(interval);
  }, []);

  // Check if app is working offline
  useEffect(() => {
    // Simulate checking offline functionality
    const checkOfflineFeatures = async () => {
      try {
        // Test basic offline storage
        await enhancedOfflineManager.storeVoiceCommand('test', 'working', language);
        setIsAppWorking(true);
      } catch (error) {
        setIsAppWorking(false);
      }
    };

    checkOfflineFeatures();
  }, [language]);

  return (
    <>
      {/* Network Status Indicator */}
      <motion.div
        className="fixed top-20 right-4 z-30"
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <motion.div
          className={`flex items-center space-x-2 px-4 py-2 rounded-full shadow-lg border transition-all duration-300 ${
            isOnline 
              ? 'bg-green-50 border-green-200 text-green-700' 
              : 'bg-orange-50 border-orange-200 text-orange-700'
          }`}
          style={{
            fontSize: '16px',
            fontWeight: 500
          }}
          whileHover={{ scale: 1.05 }}
          onClick={() => setShowOfflinePanel(!showOfflinePanel)}
        >
          <motion.div
            animate={isOnline ? {} : { rotate: [0, 10, -10, 0] }}
            transition={{ repeat: isOnline ? 0 : Infinity, duration: 2 }}
          >
            {isOnline ? (
              <Wifi className="w-4 h-4" />
            ) : (
              <WifiOff className="w-4 h-4" />
            )}
          </motion.div>
          
          <span className="text-sm font-medium">
            {isOnline ? content.onlineMode[language] : content.offlineMode[language]}
          </span>
          
          {!isOnline && syncStatus.pending > 0 && (
            <motion.div
              className="bg-orange-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              {syncStatus.pending}
            </motion.div>
          )}
        </motion.div>
      </motion.div>

      {/* Offline Features Panel */}
      <AnimatePresence>
        {showOfflinePanel && (
          <motion.div
            className="fixed top-32 right-4 w-80 max-w-[calc(100vw-2rem)] z-30"
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
              layoutId="offline-panel"
            >
              {/* Header */}
              <div 
                className={`p-4 text-white relative overflow-hidden ${
                  isOnline ? 'text-white' : 'text-white'
                }`}
                style={{
                  backgroundColor: isOnline ? '#2EB086' : '#fb923c',
                  fontSize: '16px'
                }}
              >
                <motion.div
                  className="absolute inset-0 bg-white opacity-10"
                  animate={{ 
                    background: [
                      "radial-gradient(circle at 20% 50%, white 0%, transparent 50%)",
                      "radial-gradient(circle at 80% 50%, white 0%, transparent 50%)",
                      "radial-gradient(circle at 20% 50%, white 0%, transparent 50%)"
                    ]
                  }}
                  transition={{ repeat: Infinity, duration: 3 }}
                />
                
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <motion.div
                      animate={isOnline ? {} : { rotate: [0, 360] }}
                      transition={{ repeat: isOnline ? 0 : Infinity, duration: 3 }}
                    >
                      {isOnline ? <Cloud className="w-6 h-6" /> : <CloudOff className="w-6 h-6" />}
                    </motion.div>
                    <div>
                      <h3 className="font-bold" style={{ fontSize: '18px', fontWeight: 500 }}>
                        {isOnline ? content.onlineMode[language] : content.offlineMode[language]}
                      </h3>
                      <p className="text-sm opacity-90" style={{ fontSize: '14px', fontWeight: 400 }}>
                        {isAppWorking ? content.appWorking[language] : 'Limited functionality'}
                      </p>
                    </div>
                  </div>
                  
                  <motion.button
                    onClick={() => setShowOfflinePanel(false)}
                    className="text-white hover:text-gray-200 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    ✕
                  </motion.button>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 space-y-4">
                {!isOnline && (
                  <>
                    {/* Offline Features */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-800 flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>
                          {language === 'hi' ? 'ऑफलाइन उपलब्ध सुविधाएं' :
                           language === 'pa' ? 'ਔਫਲਾਈਨ ਉਪਲਬਧ ਸੁਵਿਧਾਵਾਂ' :
                           language === 'bn' ? 'অফলাইন উপলব্ধ বৈশিষ্ট্য' :
                           'Available Offline Features'}
                        </span>
                      </h4>
                      
                      <div className="grid grid-cols-1 gap-2">
                        {[
                          { icon: Heart, text: content.emergencyAvailable[language], color: 'text-red-500' },
                          { icon: RefreshCw, text: content.voiceWorking[language], color: 'text-blue-500' },
                          { icon: Shield, text: content.dataProtected[language], color: 'text-green-500' }
                        ].map((feature, index) => (
                          <motion.div
                            key={index}
                            className="flex items-start space-x-2 p-2 bg-gray-50 rounded-lg"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <feature.icon className={`w-4 h-4 ${feature.color} mt-0.5 flex-shrink-0`} />
                            <span className="text-sm text-gray-700 leading-relaxed">{feature.text}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Sync Status */}
                    {syncStatus.total > 0 && (
                      <div className="border-t border-gray-100 pt-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ repeat: Infinity, duration: 2 }}
                            >
                              <RefreshCw className="w-4 h-4 text-orange-500" />
                            </motion.div>
                            <span className="text-sm font-medium text-gray-700">
                              {syncStatus.pending} {content.pendingSync[language]}
                            </span>
                          </div>
                          
                          <div className="text-xs text-gray-500">
                            {language === 'hi' ? 'कुल' : language === 'pa' ? 'ਕੁੱਲ' : language === 'bn' ? 'মোট' : 'Total'}: {syncStatus.total}
                          </div>
                        </div>
                        
                        <div className="mt-2 bg-gray-200 rounded-full h-2 overflow-hidden">
                          <motion.div
                            className="bg-gradient-to-r from-orange-400 to-orange-500 h-full rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${((syncStatus.total - syncStatus.pending) / syncStatus.total) * 100}%` }}
                            transition={{ duration: 0.5 }}
                          />
                        </div>
                      </div>
                    )}
                  </>
                )}

                {isOnline && (
                  <div className="text-center py-4">
                    <motion.div
                      className="text-green-500 mx-auto mb-2"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    >
                      <CheckCircle className="w-8 h-8 mx-auto" />
                    </motion.div>
                    <p className="text-sm text-gray-600">
                      {language === 'hi' ? 'सभी सुविधाएं ऑनलाइन उपलब्ध हैं' :
                       language === 'pa' ? 'ਸਾਰੀਆਂ ਸੁਵਿਧਾਵਾਂ ਔਨਲਾਈਨ ਉਪਲਬਧ ਹਨ' :
                       language === 'bn' ? 'সকল বৈশিষ্ট্য অনলাইন উপলব্ধ' :
                       'All features available online'}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Beautiful floating offline mode badge */}
      {!isOnline && (
        <motion.div
          className="fixed bottom-44 left-4 z-30"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <motion.div
            className="text-white px-4 py-2 rounded-full shadow-lg flex items-center space-x-2"
            style={{
              background: 'linear-gradient(45deg, #fb923c, #f97316)',
              fontSize: '16px',
              fontWeight: 500
            }}
            animate={{ 
              boxShadow: [
                '0 4px 20px rgba(251, 146, 60, 0.3)',
                '0 4px 30px rgba(251, 146, 60, 0.5)',
                '0 4px 20px rgba(251, 146, 60, 0.3)'
              ]
            }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
            >
              <Shield className="w-4 h-4" />
            </motion.div>
            <span className="font-medium" style={{ fontSize: '14px', fontWeight: 500 }}>
              {language === 'hi' ? 'सुरक्षित ऑफलाइन' :
               language === 'pa' ? 'ਸੁਰੱਖਿਤ ਔਫਲਾਈਨ' :
               language === 'bn' ? 'নিরাপদ অফলাইন' :
               'Safe Offline'}
            </span>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}