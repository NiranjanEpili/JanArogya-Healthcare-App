import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { LandingPage } from './components/LandingPage';
import { AboutPage } from './components/AboutPage';
import { FeaturesPage } from './components/FeaturesPage';
import { PatientPortal } from './components/PatientPortal';
import { HealthWorkerPortal } from './components/HealthWorkerPortal';
import { DoctorPortal } from './components/DoctorPortal';
import { PharmacyPortal } from './components/PharmacyPortal';
import { AdminDashboard } from './components/AdminDashboard';
import { ContactPage } from './components/ContactPage';
import { EmergencySOS } from './components/EmergencySOS';
import { VoiceNavigation } from './components/VoiceNavigation';
import { EnhancedAIAssistant } from './components/EnhancedAIAssistant';
import { VoiceDrivenInterface } from './components/VoiceDrivenInterface';
import { BeautifulOfflineIndicator } from './components/BeautifulOfflineIndicator';
import { PWAInstaller } from './components/PWAInstaller';
import { PWAUpdateNotification } from './components/PWAUpdateNotification';
import { PWAMetaTags } from './components/PWAMetaTags';
import { PWAStatus } from './components/PWAStatus';
import { PWADemo } from './components/PWADemo';
import { demoOfflineManager } from './utils/offline/demoOffline';

type Page = 'home' | 'about' | 'features' | 'patient' | 'health-worker' | 'doctor' | 'pharmacy' | 'admin' | 'contact' | 'emergency';
type Language = 'en' | 'hi' | 'pa' | 'bn';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Initialize enhanced offline-first functionality
  useEffect(() => {
    const initApp = async () => {
      console.log('🚀 JanArogya: Initializing enhanced offline-first app...');
      
      // Initialize enhanced offline manager
      try {
        await import('./utils/offline/enhancedOfflineManager');
        console.log('✅ Enhanced offline manager initialized');
      } catch (error) {
        console.warn('⚠️ Enhanced offline manager not available:', error);
      }
      
      // Check environment
      const hostname = window.location.hostname;
      const isDemo = hostname.includes('figma') || hostname.includes('preview');
      
      if (isDemo) {
        console.log('📱 JanArogya: Running in demo environment - PWA features simulated');
        
        // Only create inline service worker in supported environments
        if ('serviceWorker' in navigator && !hostname.includes('figma')) {
          createSimpleServiceWorker();
        }
      } else {
        console.log('🌐 JanArogya: Production environment detected');
        // In production, you would register the external service worker here
      }
      
      // Voice recognition check
      if ('webkitSpeechRecognition' in window) {
        console.log('🎤 Voice recognition supported');
      } else {
        console.warn('⚠️ Voice recognition not supported in this browser');
      }
      
      // Speech synthesis check
      if ('speechSynthesis' in window) {
        console.log('🔊 Speech synthesis supported');
      } else {
        console.warn('⚠️ Speech synthesis not supported in this browser');
      }
      
      console.log('✅ JanArogya: Enhanced app initialization completed');
    };
    
    // Simple inline service worker for supported environments only
    const createSimpleServiceWorker = async () => {
      try {
        const swCode = `
          console.log('JanArogya: Simple service worker active');
          
          self.addEventListener('install', () => {
            console.log('JanArogya SW: Installed');
            self.skipWaiting();
          });
          
          self.addEventListener('activate', () => {
            console.log('JanArogya SW: Activated');
            self.clients.claim();
          });
        `;
        
        const blob = new Blob([swCode], { type: 'application/javascript' });
        const swURL = URL.createObjectURL(blob);
        
        await navigator.serviceWorker.register(swURL);
        console.log('✅ JanArogya: Simple service worker registered');
        
        // Clean up
        setTimeout(() => URL.revokeObjectURL(swURL), 3000);
        
      } catch (error) {
        console.log('ℹ️ JanArogya: Service worker not available, continuing without PWA features');
      }
    };
    
    // Run initialization immediately
    initApp();
  }, []);

  // Simple voice navigation simulation
  useEffect(() => {
    if (isVoiceActive && 'webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = currentLanguage === 'hi' ? 'hi-IN' : 'en-US';

      recognition.onresult = (event: any) => {
        const command = event.results[0][0].transcript.toLowerCase();
        
        if (command.includes('home') || command.includes('होम')) {
          setCurrentPage('home');
        } else if (command.includes('about') || command.includes('बारे में')) {
          setCurrentPage('about');
        } else if (command.includes('features') || command.includes('सुविधाएं')) {
          setCurrentPage('features');
        } else if (command.includes('patient') || command.includes('मरीज')) {
          setCurrentPage('patient');
        } else if (command.includes('doctor') || command.includes('डॉक्टर')) {
          setCurrentPage('doctor');
        } else if (command.includes('emergency') || command.includes('आपातकाल')) {
          setCurrentPage('emergency');
        }
        
        setIsVoiceActive(false);
      };

      recognition.start();

      return () => {
        recognition.stop();
      };
    }
  }, [isVoiceActive, currentLanguage]);

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <LandingPage onNavigate={setCurrentPage} language={currentLanguage} />;
      case 'about':
        return <AboutPage language={currentLanguage} />;
      case 'features':
        return <FeaturesPage language={currentLanguage} />;
      case 'patient':
        return <PatientPortal onNavigate={setCurrentPage} language={currentLanguage} user={user} />;
      case 'health-worker':
        return <HealthWorkerPortal language={currentLanguage} user={user} />;
      case 'doctor':
        return <DoctorPortal language={currentLanguage} user={user} />;
      case 'pharmacy':
        return <PharmacyPortal language={currentLanguage} user={user} />;
      case 'admin':
        return <AdminDashboard language={currentLanguage} user={user} />;
      case 'contact':
        return <ContactPage language={currentLanguage} />;
      case 'emergency':
        return <EmergencySOS onNavigate={setCurrentPage} language={currentLanguage} />;
      default:
        return <LandingPage onNavigate={setCurrentPage} language={currentLanguage} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* PWA Meta Tags */}
      <PWAMetaTags language={currentLanguage} />
      
      <Header 
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        language={currentLanguage}
        onLanguageChange={setCurrentLanguage}
        onVoiceToggle={() => setIsVoiceActive(!isVoiceActive)}
        isVoiceActive={isVoiceActive}
        user={user}
        onUserChange={setUser}
      />
      
      <main className="flex-1">
        {renderCurrentPage()}
      </main>
      
      <Footer language={currentLanguage} onNavigate={setCurrentPage} />
      
      <VoiceNavigation 
        isActive={isVoiceActive}
        language={currentLanguage}
        onCommand={(command) => {
          // Voice navigation feedback
          if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(
              currentLanguage === 'hi' ? `आपका आदेश ${command} सुन लिया गया` : `Command ${command} received`
            );
            utterance.lang = currentLanguage === 'hi' ? 'hi-IN' : 'en-US';
            speechSynthesis.speak(utterance);
          }
        }}
      />
      
      {/* Voice-Driven Interface - Complete offline functionality */}
      <VoiceDrivenInterface
        language={currentLanguage}
        currentPage={currentPage}
        onNavigate={setCurrentPage}
      />
      
      {/* Enhanced AI Voice Assistant for complete voice-driven interaction */}
      <EnhancedAIAssistant 
        language={currentLanguage}
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        onAction={(action, data) => {
          // Handle AI-driven actions
          console.log('AI Action:', action, data);
          
          // Example: Handle user login/logout
          if (action === 'login') {
            setUser(data);
          } else if (action === 'logout') {
            setUser(null);
          }
        }}
      />
      
      {/* Beautiful Offline Status Indicator */}
      <BeautifulOfflineIndicator language={currentLanguage} />
      
      {/* PWA Installation Prompt */}
      <PWAInstaller language={currentLanguage} />
      
      {/* PWA Update Notification */}
      <PWAUpdateNotification language={currentLanguage} />
      
      {/* PWA Debug Status (only shows when needed) */}
      <PWAStatus />
      
      {/* PWA Demo Information (shows in demo environments) */}
      <PWADemo language={currentLanguage} />
    </div>
  );
}