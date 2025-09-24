import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Download, X, Smartphone, Monitor, Check } from 'lucide-react';

interface PWAInstallerProps {
  language: 'en' | 'hi' | 'pa' | 'bn';
}

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const translations = {
  en: {
    title: 'Install JanArogya App',
    description: 'Get quick access to healthcare services. Works offline!',
    installButton: 'Install App',
    benefits: [
      'Works without internet connection',
      'Voice navigation for illiterate users',
      'Quick access from home screen',
      'Emergency SOS with one tap',
      'Secure health records'
    ],
    installing: 'Installing...',
    installed: 'App Installed!',
    installManually: 'Install Manually',
    browserInstructions: 'Click the install icon in your browser address bar',
    close: 'Maybe Later'
  },
  hi: {
    title: 'जनआरोग्य ऐप इंस्टॉल करें',
    description: 'स्वास्थ्य सेवाओं तक तुरंत पहुंच। ऑफलाइन काम करता है!',
    installButton: 'ऐप इंस्टॉल करें',
    benefits: [
      'इंटरनेट के बिना काम करता है',
      'निरक्षरों के लिए वॉयस नेवीगेशन',
      'होम स्क्रीन से तुरंत पहुंच',
      'एक टैप में आपातकालीन SOS',
      'सुरक्षित स्वास्थ्य रिकॉर्ड'
    ],
    installing: 'इंस्टॉल हो रहा है...',
    installed: 'ऐप इंस्टॉल हो गया!',
    installManually: 'मैन्युअली इंस्टॉल करें',
    browserInstructions: 'अपने ब्राउज़र के एड्रेस बार में इंस्टॉल आइकन पर क्लिक करें',
    close: 'बाद में'
  },
  pa: {
    title: 'ਜਨਆਰੋਗਿਆ ਐਪ ਇੰਸਟਾਲ ਕਰੋ',
    description: 'ਸਿਹਤ ਸੇਵਾਵਾਂ ਤੱਕ ਤੁਰੰਤ ਪਹੁੰਚ। ਔਫਲਾਈਨ ਕੰਮ ਕਰਦਾ ਹੈ!',
    installButton: 'ਐਪ ਇੰਸਟਾਲ ਕਰੋ',
    benefits: [
      'ਇੰਟਰਨੇਟ ਤੋਂ ਬਿਨਾਂ ਕੰਮ ਕਰਦਾ ਹੈ',
      'ਅਨਪੜ੍ਹਾਂ ਲਈ ਆਵਾਜ਼ ਨੇਵੀਗੇਸ਼ਨ',
      'ਹੋਮ ਸਕ੍ਰੀਨ ਤੋਂ ਤਤਕਾਲ ਪਹੁੰਚ',
      'ਇੱਕ ਟੈਪ ਵਿੱਚ ਐਮਰਜੈਂਸੀ SOS',
      'ਸੁਰੱਖਿਤ ਸਿਹਤ ਰਿਕਾਰਡ'
    ],
    installing: 'ਇੰਸਟਾਲ ਹੋ ਰਿਹਾ ਹੈ...',
    installed: 'ਐਪ ਇੰਸਟਾਲ ਹੋ ਗਿਆ!',
    installManually: 'ਮੈਨੁਅਲ ਤੌਰ ਤੇ ਇੰਸਟਾਲ ਕਰੋ',
    browserInstructions: 'ਆਪਣੇ ਬ੍ਰਾਉਜ਼ਰ ਦੇ ਐਡਰੈੱਸ ਬਾਰ ਵਿੱਚ ਇੰਸਟਾਲ ਆਈਕਨ ਤੇ ਕਲਿੱਕ ਕਰੋ',
    close: 'ਬਾਅਦ ਵਿੱਚ'
  },
  bn: {
    title: 'জনআরোগ্য অ্যাপ ইনস্টল করুন',
    description: 'স্বাস্থ্য সেবায় তাৎক্ষণিক অ্যাক্সেস। অফলাইনে কাজ করে!',
    installButton: 'অ্যাপ ইনস্টল করুন',
    benefits: [
      'ইন্টারনেট ছাড়াই কাজ করে',
      'নিরক্ষরদের জন্য ভয়েস নেভিগেশন',
      'হোম স্ক্রিন থেকে তাৎক্ষণিক অ্যাক্সেস',
      'এক ট্যাপে জরুরি SOS',
      'নিরাপদ স্বাস্থ্য রেকর্ড'
    ],
    installing: 'ইনস্টল হচ্ছে...',
    installed: 'অ্যাপ ইনস্টল হয়েছে!',
    installManually: 'ম্যানুয়ালি ইনস্টল করুন',
    browserInstructions: 'আপনার ব্রাউজারের অ্যাড্রেস বারে ইনস্টল আইকনে ক্লিক করুন',
    close: 'পরে করব'
  }
};

export function PWAInstaller({ language }: PWAInstallerProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [canInstall, setCanInstall] = useState(false);

  const t = translations[language];

  useEffect(() => {
    // Check if app is already installed
    const isAppInstalled = window.matchMedia('(display-mode: standalone)').matches || 
                          (window.navigator as any).standalone === true;
    setIsInstalled(isAppInstalled);

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('JanArogya PWA: Install prompt available');
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setCanInstall(true);
      
      // Show install prompt after 10 seconds if not already installed
      if (!isAppInstalled) {
        setTimeout(() => {
          console.log('JanArogya PWA: Install prompt available');
          setShowInstallPrompt(true);
        }, 10000);
      }
    };

    // Check for PWA installability in demo environments
    const checkInstallability = () => {
      const hostname = window.location.hostname;
      const isDemo = hostname.includes('figma') || hostname.includes('preview');
      
      // In demo environments, show educational prompt instead of real install
      if (isDemo && !isAppInstalled) {
        setTimeout(() => {
          console.log('JanArogya PWA: Demo environment - showing educational prompt');
          setShowInstallPrompt(true);
        }, 12000);
      }
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowInstallPrompt(false);
      setCanInstall(false);
      setDeferredPrompt(null);
      
      // Show success message
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(t.installed);
        utterance.lang = language === 'hi' ? 'hi-IN' : 'en-US';
        speechSynthesis.speak(utterance);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Check installability
    checkInstallability();

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [language, t.installed, canInstall]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    setIsInstalling(true);

    try {
      // Show the install prompt
      await deferredPrompt.prompt();
      
      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
    } catch (error) {
      console.error('Error installing PWA:', error);
    } finally {
      setIsInstalling(false);
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    }
  };

  const handleClose = () => {
    setShowInstallPrompt(false);
    // Show again after 5 minutes
    setTimeout(() => {
      if (!isInstalled && canInstall) {
        setShowInstallPrompt(true);
      }
    }, 5 * 60 * 1000);
  };

  // Don't show if already installed or can't install
  if (isInstalled || !showInstallPrompt) {
    return null;
  }

  // Check if we're in demo environment
  const hostname = window.location.hostname;
  const isDemo = hostname.includes('figma') || hostname.includes('preview');

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md bg-white shadow-xl">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center">
            <Download className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-xl font-bold text-primary">{t.title}</CardTitle>
          <CardDescription className="text-gray-600">{t.description}</CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Benefits */}
          <div className="space-y-2">
            {t.benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>

          {/* Device indicators */}
          <div className="flex justify-center gap-4 py-2">
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Smartphone className="h-4 w-4" />
              <span>Mobile</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Monitor className="h-4 w-4" />
              <span>Desktop</span>
            </div>
          </div>

          {/* Demo vs Production Install Instructions */}
          <div className="space-y-2">
            {isDemo ? (
              <div className="text-center">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                  <p className="text-sm text-blue-800 font-medium">Demo Environment</p>
                  <p className="text-xs text-blue-700 mt-1">
                    In production, this app can be installed from Chrome browser's install button
                  </p>
                </div>
                <p className="text-sm text-gray-600">{t.installManually}</p>
                <p className="text-xs text-gray-500 mt-1">{t.browserInstructions}</p>
              </div>
            ) : canInstall && deferredPrompt ? (
              <Button
                onClick={handleInstallClick}
                disabled={isInstalling}
                className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3"
                size="lg"
              >
                {isInstalling ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    {t.installing}
                  </div>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    {t.installButton}
                  </>
                )}
              </Button>
            ) : (
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">{t.installManually}</p>
                <p className="text-xs text-gray-500">{t.browserInstructions}</p>
              </div>
            )}
            
            <Button
              onClick={handleClose}
              variant="outline"
              className="w-full"
            >
              <X className="h-4 w-4 mr-2" />
              {t.close}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}