import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Download, Smartphone, Wifi, WifiOff, X } from 'lucide-react';

interface PWADemoProps {
  language: 'en' | 'hi' | 'pa' | 'bn';
}

const translations = {
  en: {
    title: 'JanArogya Progressive Web App',
    subtitle: 'Healthcare App with Offline Capabilities',
    features: [
      'Works without internet connection',
      'Voice navigation for all users',
      'Install like a native app',
      'Emergency SOS works offline',
      'Automatic data sync when online'
    ],
    environment: 'Running in demo environment',
    production: 'In production, this app can be installed from Chrome',
    close: 'Got it'
  },
  hi: {
    title: 'जनआरोग्य प्रोग्रेसिव वेब ऐप',
    subtitle: 'ऑफलाइन क्षमताओं के साथ स्वास्थ्य सेवा ऐप',
    features: [
      'इंटरनेट कनेक्शन के बिना काम करता है',
      'सभी उपयोगकर्ताओं के लिए वॉयस नेवीगेशन',
      'नेटिव ऐप की तरह इंस्टॉल करें',
      'आपातकालीन SOS ऑफलाइन काम करता है',
      'ऑनलाइन होने पर स्वचालित डेटा सिंक'
    ],
    environment: 'डेमो वातावरण में चल रहा है',
    production: 'उत्पादन में, यह ऐप Chrome से इंस्टॉल किया जा सकता है',
    close: 'समझ गया'
  },
  pa: {
    title: 'ਜਨਆਰੋਗਿਆ ਪ੍ਰੋਗ੍ਰੈਸਿਵ ਵੈੱਬ ਐਪ',
    subtitle: 'ਔਫਲਾਈਨ ਸਮਰੱਥਾਵਾਂ ਨਾਲ ਸਿਹਤ ਸੇਵਾ ਐਪ',
    features: [
      'ਇੰਟਰਨੈੱਟ ਕਨੈਕਸ਼ਨ ਤੋਂ ਬਿਨਾਂ ਕੰਮ ਕਰਦਾ ਹੈ',
      'ਸਾਰੇ ਉਪਭੋਗਤਾਵਾਂ ਲਈ ਆਵਾਜ਼ ਨੇਵੀਗੇਸ਼ਨ',
      'ਨੇਟਿਵ ਐਪ ਵਾਂਗ ਇੰਸਟਾਲ ਕਰੋ',
      'ਐਮਰਜੈਂਸੀ SOS ਔਫਲਾਈਨ ਕੰਮ ਕਰਦਾ ਹੈ',
      'ਔਨਲਾਈਨ ਹੋਣ ਤੇ ਆਟੋਮੈਟਿਕ ਡੇਟਾ ਸਿੰਕ'
    ],
    environment: 'ਡੈਮੋ ਮਾਹੌਲ ਵਿੱਚ ਚੱਲ ਰਿਹਾ ਹੈ',
    production: 'ਪ੍ਰੋਡਕਸ਼ਨ ਵਿੱਚ, ਇਹ ਐਪ Chrome ਤੋਂ ਇੰਸਟਾਲ ਕੀਤਾ ਜਾ ਸਕਦਾ ਹੈ',
    close: 'ਸਮਝ ਗਿਆ'
  },
  bn: {
    title: 'জনআরোগ্য প্রোগ্রেসিভ ওয়েব অ্যাপ',
    subtitle: 'অফলাইন সক্ষমতা সহ স্বাস্থ্যসেবা অ্যাপ',
    features: [
      'ইন্টারনেট সংযোগ ছাড়াই কাজ করে',
      'সকল ব্যবহারকারীর জন্য ভয়েস নেভিগেশন',
      'নেটিভ অ্যাপের মতো ইনস্টল করুন',
      'জরুরি SOS অফলাইনে কাজ করে',
      'অনলাইনে এলে স্বয়ংক্রিয় ডেটা সিঙ্ক'
    ],
    environment: 'ডেমো পরিবেশে চলছে',
    production: 'প্রোডাকশনে, এই অ্যাপ Chrome থেকে ইনস্টল করা যেতে পারে',
    close: 'বুঝেছি'
  }
};

export function PWADemo({ language }: PWADemoProps) {
  const [showDemo, setShowDemo] = useState(false);
  const [environment, setEnvironment] = useState<string>('unknown');

  const t = translations[language];

  useEffect(() => {
    // Detect if we're in a demo environment
    const hostname = window.location.hostname;
    let env = 'production';
    
    if (hostname.includes('figma')) {
      env = 'figma-preview';
    } else if (hostname === 'localhost' || hostname === '127.0.0.1') {
      env = 'localhost';
    } else if (hostname.includes('vercel') || hostname.includes('netlify')) {
      env = 'hosting';
    }
    
    setEnvironment(env);

    // Show demo info in non-production environments after a delay
    if (env !== 'production') {
      const timer = setTimeout(() => {
        setShowDemo(true);
      }, 15000); // Show after 15 seconds

      return () => clearTimeout(timer);
    }
  }, []);

  if (!showDemo) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md bg-white shadow-xl">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center">
            <Smartphone className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-xl font-bold text-primary">{t.title}</CardTitle>
          <p className="text-gray-600 text-sm">{t.subtitle}</p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* PWA Features */}
          <div className="space-y-2">
            <h4 className="font-medium text-gray-900">Key Features:</h4>
            {t.features.map((feature, index) => (
              <div key={index} className="flex items-start gap-2 text-sm">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-700">{feature}</span>
              </div>
            ))}
          </div>

          {/* Environment Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center gap-2 text-blue-800 text-sm">
              <Download className="h-4 w-4" />
              <span className="font-medium">{t.environment}</span>
            </div>
            <p className="text-blue-700 text-xs mt-1">{t.production}</p>
          </div>

          {/* Demo Features */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <h4 className="font-medium text-green-800 text-sm mb-2">Demo Features Available:</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-1 text-green-700">
                <Wifi className="h-3 w-3" />
                <span>Offline Mode</span>
              </div>
              <div className="flex items-center gap-1 text-green-700">
                <WifiOff className="h-3 w-3" />
                <span>Voice Navigation</span>
              </div>
            </div>
          </div>

          {/* Close Button */}
          <Button
            onClick={() => setShowDemo(false)}
            className="w-full bg-primary hover:bg-primary/90 text-white"
          >
            <X className="h-4 w-4 mr-2" />
            {t.close}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}