import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { demoOfflineManager } from '../utils/offline/demoOffline';

type Language = 'en' | 'hi' | 'pa' | 'bn';

interface OfflineDemoProps {
  language: Language;
}

const content = {
  title: {
    en: 'Offline Functionality Demo',
    hi: 'ऑफलाइन कार्यक्षमता डेमो',
    pa: 'ਔਫਲਾਈਨ ਕਾਰਜਕਸ਼ਮਤਾ ਡੈਮੋ',
    bn: 'অফলাইন কার্যকারিতা ডেমো'
  },
  simulateOffline: {
    en: 'Simulate Offline',
    hi: 'ऑफलाइन सिमुलेट करें',
    pa: 'ਔਫਲਾਈਨ ਸਿਮੂਲੇਟ ਕਰੋ',
    bn: 'অফলাইন সিমুলেট করুন'
  },
  goOnline: {
    en: 'Go Online',
    hi: 'ऑनलाइन जाएं',
    pa: 'ਔਨਲਾਈਨ ਜਾਓ',
    bn: 'অনলাইন যান'
  },
  testAction: {
    en: 'Test Offline Action',
    hi: 'ऑफलाइन कार्य परीक्षण',
    pa: 'ਔਫਲਾਈਨ ਐਕਸ਼ਨ ਟੈਸਟ',
    bn: 'অফলাইন অ্যাকশন পরীক্ষা'
  },
  status: {
    en: 'Status',
    hi: 'स्थिति',
    pa: 'ਸਥਿਤੀ',
    bn: 'অবস্থা'
  },
  pendingActions: {
    en: 'Pending Actions',
    hi: 'लंबित कार्य',
    pa: 'ਲੰਬਿਤ ਐਕਸ਼ਨਸ',
    bn: 'অপেক্ষমান কাজ'
  }
};

export function OfflineDemo({ language }: OfflineDemoProps) {
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [pendingCount, setPendingCount] = useState(0);
  const [lastAction, setLastAction] = useState<string>('');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const interval = setInterval(() => {
      try {
        setIsOnline(demoOfflineManager.getConnectionStatus());
        setPendingCount(demoOfflineManager.getPendingActionsCount());
      } catch (error) {
        console.error('Error updating offline demo status:', error);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const toggleConnection = () => {
    try {
      // Simulate connection change
      const newStatus = !isOnline;
      
      // Manually trigger events
      if (typeof window !== 'undefined') {
        if (newStatus) {
          window.dispatchEvent(new Event('online'));
        } else {
          window.dispatchEvent(new Event('offline'));
        }
      }
      
      setIsOnline(newStatus);
    } catch (error) {
      console.error('Error toggling connection:', error);
    }
  };

  const testOfflineAction = async () => {
    const actionType = 'TEST_ACTION';
    const actionData = {
      timestamp: Date.now(),
      message: 'This is a test offline action',
      language: language
    };

    await demoOfflineManager.queueAction(actionType, actionData);
    setLastAction(`${actionType} queued at ${new Date().toLocaleTimeString()}`);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isOnline ? (
            <Wifi className="w-5 h-5 text-green-600" />
          ) : (
            <WifiOff className="w-5 h-5 text-red-600" />
          )}
          {content.title[language]}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Connection Status */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <span className="text-sm font-medium">{content.status[language]}:</span>
          <div className="flex items-center gap-2">
            {isOnline ? (
              <>
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-green-600 text-sm">Online</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-4 h-4 text-red-600" />
                <span className="text-red-600 text-sm">Offline</span>
              </>
            )}
          </div>
        </div>

        {/* Pending Actions Count */}
        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
          <span className="text-sm font-medium">{content.pendingActions[language]}:</span>
          <span className="text-blue-600 text-sm font-bold">{pendingCount}</span>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <Button
            onClick={toggleConnection}
            variant={isOnline ? "destructive" : "default"}
            className="w-full"
            style={{ backgroundColor: isOnline ? '#E63946' : '#2EB086' }}
          >
            {isOnline ? content.simulateOffline[language] : content.goOnline[language]}
          </Button>
          
          <Button
            onClick={testOfflineAction}
            variant="outline"
            className="w-full"
          >
            {content.testAction[language]}
          </Button>
        </div>

        {/* Last Action */}
        {lastAction && (
          <div className="p-3 bg-yellow-50 rounded-lg">
            <p className="text-xs text-yellow-800">{lastAction}</p>
          </div>
        )}

        {/* Offline Notice */}
        {!isOnline && (
          <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <p className="text-sm text-orange-800">
              {language === 'hi' ? 
                'ऑफलाइन मोड: सभी कार्य कतार में हैं और कनेक्शन बहाली पर सिंक हो जाएंगे।' :
                'Offline Mode: All actions are queued and will sync when connection is restored.'}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}