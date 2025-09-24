import React, { useState } from 'react';
import { Mic, MicOff, Menu, X, Heart, Globe } from 'lucide-react';
import { Button } from './ui/button';

type Page = 'home' | 'about' | 'features' | 'patient' | 'health-worker' | 'doctor' | 'pharmacy' | 'admin' | 'contact' | 'emergency';
type Language = 'en' | 'hi' | 'pa' | 'bn';

interface HeaderProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  language: Language;
  onLanguageChange: (language: Language) => void;
  onVoiceToggle: () => void;
  isVoiceActive: boolean;
  user: any;
  onUserChange: (user: any) => void;
}

const translations = {
  en: {
    home: 'Home',
    about: 'About',
    features: 'Features',
    patient: 'Patient Portal',
    healthWorker: 'Health Worker Portal',
    doctor: 'Doctor Portal',
    pharmacy: 'Pharmacy Portal',
    contact: 'Contact',
    voice: 'Voice Navigation',
    login: 'Login',
    logout: 'Logout'
  },
  hi: {
    home: 'होम',
    about: 'हमारे बारे में',
    features: 'सुविधाएं',
    patient: 'मरीज पोर्टल',
    healthWorker: 'स्वास्थ्य कार्यकर्ता पोर्टल',
    doctor: 'डॉक्टर पोर्टल',
    pharmacy: 'फार्मेसी पोर्टल',
    contact: 'संपर्क',
    voice: 'आवाज नेवीगेशन',
    login: 'लॉगिन',
    logout: 'लॉगआउट'
  },
  pa: {
    home: 'ਘਰ',
    about: 'ਸਾਡੇ ਬਾਰੇ',
    features: 'ਵਿਸ਼ੇਸ਼ਤਾਵਾਂ',
    patient: 'ਮਰੀਜ਼ ਪੋਰਟਲ',
    healthWorker: 'ਸਿਹਤ ਕਰਮਚਾਰੀ ਪੋਰਟਲ',
    doctor: 'ਡਾਕਟਰ ਪੋਰਟਲ',
    pharmacy: 'ਫਾਰਮੇਸੀ ਪੋਰਟਲ',
    contact: 'ਸੰਪਰਕ',
    voice: 'ਆਵਾਜ਼ ਨੈਵੀਗੇਸ਼ਨ',
    login: 'ਲਾਗਇਨ',
    logout: 'ਲਾਗਆਉਟ'
  },
  bn: {
    home: 'হোম',
    about: 'আমাদের সম্পর্কে',
    features: 'বৈশিষ্ট্য',
    patient: 'রোগী পোর্টাল',
    healthWorker: 'স্বাস্থ্যকর্মী পোর্টাল',
    doctor: 'ডাক্তার পোর্টাল',
    pharmacy: 'ফার্মেসি পোর্টাল',
    contact: 'যোগাযোগ',
    voice: 'ভয়েস নেভিগেশন',
    login: 'লগইন',
    logout: 'লগআউট'
  }
};

export function Header({ 
  currentPage, 
  onNavigate, 
  language, 
  onLanguageChange, 
  onVoiceToggle, 
  isVoiceActive,
  user,
  onUserChange
}: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const t = translations[language];

  const languageOptions = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'pa', name: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
    { code: 'bn', name: 'বাংলা', flag: '🇧🇩' }
  ];

  const navItems = [
    { key: 'home', label: t.home },
    { key: 'about', label: t.about },
    { key: 'features', label: t.features },
    { key: 'patient', label: t.patient },
    { key: 'health-worker', label: t.healthWorker },
    { key: 'doctor', label: t.doctor },
    { key: 'pharmacy', label: t.pharmacy },
    { key: 'contact', label: t.contact }
  ];

  return (
    <header className="sticky top-0 bg-white border-b border-slate-200 shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            className="flex items-center cursor-pointer" 
            onClick={() => onNavigate('home')}
          >
            <Heart className="h-8 w-8 text-emerald-600 mr-2" />
            <span className="text-2xl text-slate-900 tracking-tight">JanArogya</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => onNavigate(item.key as Page)}
                className={`px-3 py-2 text-sm transition-colors ${
                  currentPage === item.key
                    ? 'text-emerald-600 border-b-2 border-emerald-600'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right side controls */}
          <div className="flex items-center space-x-4">
            {/* Language Selector */}
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                className="flex items-center space-x-2"
              >
                <Globe className="h-4 w-4" />
                <span className="hidden sm:inline">
                  {languageOptions.find(l => l.code === language)?.flag}
                </span>
              </Button>
              
              {isLanguageOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-slate-200 z-10">
                  {languageOptions.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        onLanguageChange(lang.code as Language);
                        setIsLanguageOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 flex items-center space-x-2"
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Voice Navigation Button */}
            <Button
              onClick={onVoiceToggle}
              variant={isVoiceActive ? "default" : "outline"}
              size="sm"
              className={`flex items-center space-x-2 ${
                isVoiceActive 
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white animate-pulse' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {isVoiceActive ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
              <span className="hidden sm:inline">{t.voice}</span>
            </Button>

            {/* Login/User */}
            {user ? (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-slate-600 hidden sm:inline">
                  {user.name}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onUserChange(null)}
                >
                  {t.logout}
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  // Simple demo login
                  onUserChange({ 
                    name: 'Demo User', 
                    type: 'patient',
                    id: '123' 
                  });
                }}
              >
                {t.login}
              </Button>
            )}

            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => {
                    onNavigate(item.key as Page);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`block w-full text-left px-3 py-2 rounded-md text-base transition-colors ${
                    currentPage === item.key
                      ? 'text-emerald-600 bg-emerald-50'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}