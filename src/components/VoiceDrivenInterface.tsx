import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, Volume2, VolumeX, Sparkles, Heart, Zap, Shield, Users, Calendar, Pill } from 'lucide-react';
import { enhancedOfflineManager } from '../utils/offline/enhancedOfflineManager';

interface VoiceDrivenInterfaceProps {
  language: 'en' | 'hi' | 'pa' | 'bn';
  onNavigate: (page: string) => void;
  currentPage: string;
}

export function VoiceDrivenInterface({ language, onNavigate, currentPage }: VoiceDrivenInterfaceProps) {
  const [isListening, setIsListening] = useState(false);
  const [currentCommand, setCurrentCommand] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const content = {
    welcome: {
      en: "Welcome to JanArogya! I understand voice commands in your language. Try saying 'Book appointment' or 'Emergency help'",
      hi: "जनआरोग्य में आपका स्वागत है! मैं आपकी भाषा में आवाज़ के आदेश समझता हूं। 'अपॉइंटमेंट बुक करो' या 'आपातकालीन मदद' कहकर देखें",
      pa: "ਜਨਆਰੋਗਿਆ ਵਿੱਚ ਤੁਹਾਡਾ ਸੁਆਗਤ ਹੈ! ਮੈਂ ਤੁਹਾਡੀ ਭਾਸ਼ਾ ਵਿੱਚ ਆਵਾਜ਼ ਦੇ ਹੁਕਮ ਸਮਝਦਾ ਹਾਂ। 'ਮੁਲਾਕਾਤ ਬੁੱਕ ਕਰੋ' ਕਹਿ ਕੇ ਦੇਖੋ",
      bn: "জনআরোগ্যে আপনাকে স্বাগতম! আমি আপনার ভাষায় ভয়েস কমান্ড বুঝি। 'অ্যাপয়েন্টমেন্ট বুক করুন' বলে দেখুন"
    },
    listening: {
      en: "I'm listening... Speak naturally",
      hi: "मैं सुन रहा हूं... स्वाभाविक रूप से बोलें",
      pa: "ਮੈਂ ਸੁਣ ਰਿਹਾ ਹਾਂ... ਕੁਦਰਤੀ ਤੌਰ 'ਤੇ ਬੋਲੋ",
      bn: "আমি শুনছি... স্বাভাবিকভাবে বলুন"
    },
    processing: {
      en: "Processing your request...",
      hi: "आपका अनुरोध प्रोसेस कर रहे हैं...",
      pa: "ਤੁਹਾਡੀ ਬੇਨਤੀ ਦੀ ਪ੍ਰਕਿਰਿਆ ਕਰ ਰਹੇ ਹਾਂ...",
      bn: "আপনার অনুরোধ প্রক্রিয়া করছি..."
    }
  };

  // Voice commands that work completely offline
  const voiceCommands = {
    en: {
      'patient portal': () => onNavigate('patient'),
      'book appointment': () => handleBookAppointment(),
      'emergency help': () => onNavigate('emergency'),
      'doctor portal': () => onNavigate('doctor'),
      'pharmacy': () => onNavigate('pharmacy'),
      'my family': () => handleFamilyHealth(),
      'medicine': () => handleMedicine(),
      'health worker': () => onNavigate('health-worker'),
      'home': () => onNavigate('home'),
      'about': () => onNavigate('about'),
      'features': () => onNavigate('features'),
      'contact': () => onNavigate('contact'),
      'show my appointments': () => handleShowAppointments(),
      'show prescriptions': () => handleShowPrescriptions(),
      'add family member': () => handleAddFamilyMember(),
      'emergency sos': () => handleEmergencySOS()
    },
    hi: {
      'पेशेंट पोर्टल': () => onNavigate('patient'),
      'मरीज़ पोर्टल': () => onNavigate('patient'),
      'अपॉइंटमेंट बुक करो': () => handleBookAppointment(),
      'डॉक्टर से मिलना है': () => handleBookAppointment(),
      'आपातकालीन मदद': () => onNavigate('emergency'),
      'आपातकाल': () => onNavigate('emergency'),
      'डॉक्टर पोर्टल': () => onNavigate('doctor'),
      'फार्मेसी': () => onNavigate('pharmacy'),
      'दवाखाना': () => onNavigate('pharmacy'),
      'मेरा परिवार': () => handleFamilyHealth(),
      'परिवारिक स्वास्थ्य': () => handleFamilyHealth(),
      'दवा': () => handleMedicine(),
      'दवाइयां': () => handleMedicine(),
      'स्वास्थ्य कार्यकर्ता': () => onNavigate('health-worker'),
      'होम': () => onNavigate('home'),
      'घर': () => onNavigate('home'),
      'बारे में': () => onNavigate('about'),
      'सुविधाएं': () => onNavigate('features'),
      'संपर्क': () => onNavigate('contact'),
      'मेरी अपॉइंटमेंट दिखाओ': () => handleShowAppointments(),
      'नुस्खे दिखाओ': () => handleShowPrescriptions(),
      'परिवार का सदस्य जोड़ो': () => handleAddFamilyMember(),
      'एसओएस': () => handleEmergencySOS()
    },
    pa: {
      'ਪੇਸ਼ੈਂਟ ਪੋਰਟਲ': () => onNavigate('patient'),
      'ਮਰੀਜ਼ ਪੋਰਟਲ': () => onNavigate('patient'),
      'ਮੁਲਾਕਾਤ ਬੁੱਕ ਕਰੋ': () => handleBookAppointment(),
      'ਡਾਕਟਰ ਨਾਲ ਮਿਲਣਾ ਹੈ': () => handleBookAppointment(),
      'ਐਮਰਜੈਂਸੀ ਮਦਦ': () => onNavigate('emergency'),
      'ਐਮਰਜੈਂਸੀ': () => onNavigate('emergency'),
      'ਡਾਕਟਰ ਪੋਰਟਲ': () => onNavigate('doctor'),
      'ਫਾਰਮੇਸੀ': () => onNavigate('pharmacy'),
      'ਦਵਾਈ ਦੀ ਦੁਕਾਨ': () => onNavigate('pharmacy'),
      'ਮੇਰਾ ਪਰਿਵਾਰ': () => handleFamilyHealth(),
      'ਪਰਿਵਾਰਕ ਸਿਹਤ': () => handleFamilyHealth(),
      'ਦਵਾਈ': () => handleMedicine(),
      'ਦਵਾਈਆਂ': () => handleMedicine(),
      'ਸਿਹਤ ਕਾਰਕੁਨ': () => onNavigate('health-worker'),
      'ਘਰ': () => onNavigate('home'),
      'ਬਾਰੇ': () => onNavigate('about'),
      'ਸਹੂਲਤਾਂ': () => onNavigate('features'),
      'ਸੰਪਰਕ': () => onNavigate('contact'),
      'ਮੇਰੀ ਮੁਲਾਕਾਤ ਦਿਖਾਓ': () => handleShowAppointments(),
      'ਨੁਸਖੇ ਦਿਖਾਓ': () => handleShowPrescriptions(),
      'ਪਰਿਵਾਰਕ ਮੈਂਬਰ ਜੋੜੋ': () => handleAddFamilyMember(),
      'ਐਸਓਐਸ': () => handleEmergencySOS()
    },
    bn: {
      'রোগী পোর্টাল': () => onNavigate('patient'),
      'পেশেন্ট পোর্টাল': () => onNavigate('patient'),
      'অ্যাপয়েন্টমেন্ট বুক করুন': () => handleBookAppointment(),
      'ডাক্তার দেখাতে হবে': () => handleBookAppointment(),
      'জরুরি সাহায্য': () => onNavigate('emergency'),
      'জরুরি': () => onNavigate('emergency'),
      'ডাক্তার পোর্টাল': () => onNavigate('doctor'),
      'ফার্মেসি': () => onNavigate('pharmacy'),
      'ওষুধের দোকান': () => onNavigate('pharmacy'),
      'আমার পরিবার': () => handleFamilyHealth(),
      'পারিবারিক স্বাস্থ্য': () => handleFamilyHealth(),
      'ওষুধ': () => handleMedicine(),
      'ওষুধপত্র': () => handleMedicine(),
      'স্বাস্থ্যকর্মী': () => onNavigate('health-worker'),
      'হোম': () => onNavigate('home'),
      'বাড়ি': () => onNavigate('home'),
      'সম্পর্কে': () => onNavigate('about'),
      'বৈশিষ্ট্য': () => onNavigate('features'),
      'যোগাযোগ': () => onNavigate('contact'),
      'আমার অ্যাপয়েন্টমেন্ট দেখান': () => handleShowAppointments(),
      'প্রেসক্রিপশন দেখান': () => handleShowPrescriptions(),
      'পরিবারের সদস্য যোগ করুন': () => handleAddFamilyMember(),
      'এসওএস': () => handleEmergencySOS()
    }
  };

  // Network status monitoring
  useEffect(() => {
    const updateOnlineStatus = () => setIsOnline(navigator.onLine);
    
    enhancedOfflineManager.addNetworkListener(updateOnlineStatus);
    
    return () => {
      enhancedOfflineManager.removeNetworkListener(updateOnlineStatus);
    };
  }, []);

  // Hide welcome after a few seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowWelcome(false), 10000);
    return () => clearTimeout(timer);
  }, []);

  // Voice recognition setup
  const startVoiceRecognition = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Voice recognition not supported in this browser');
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = language === 'hi' ? 'hi-IN' : 
                       language === 'pa' ? 'pa-IN' : 
                       language === 'bn' ? 'bn-IN' : 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setCurrentCommand('');
      speak(content.listening[language]);
    };

    recognition.onresult = (event: any) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setCurrentCommand(transcript);
    };

    recognition.onend = () => {
      setIsListening(false);
      if (currentCommand.trim()) {
        processVoiceCommand(currentCommand);
      }
    };

    recognition.onerror = (event: any) => {
      setIsListening(false);
      console.error('Speech recognition error:', event.error);
    };

    recognition.start();
  };

  // Process voice commands offline-first
  const processVoiceCommand = async (command: string) => {
    setIsProcessing(true);
    
    try {
      const lowerCommand = command.toLowerCase().trim();
      const commands = voiceCommands[language] || voiceCommands.en;
      
      // Find matching command
      let commandFound = false;
      for (const [key, action] of Object.entries(commands)) {
        if (lowerCommand.includes(key.toLowerCase())) {
          await (action as Function)();
          commandFound = true;
          break;
        }
      }

      if (!commandFound) {
        // Fallback to intelligent parsing
        await handleIntelligentCommand(command);
      }

      // Store command for offline learning
      await enhancedOfflineManager.storeVoiceCommand(command, 'processed', language);
      
    } catch (error) {
      console.error('Error processing voice command:', error);
      speak(language === 'hi' ? 'कमांड प्रोसेस करने में त्रुटि।' : 'Error processing command.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Intelligent command handling for natural language
  const handleIntelligentCommand = async (command: string) => {
    const lowerCommand = command.toLowerCase();
    
    // Health-related queries
    if (lowerCommand.includes('fever') || lowerCommand.includes('बुखार') || lowerCommand.includes('ਬੁਖਾਰ') || lowerCommand.includes('জ্বর')) {
      const advice = enhancedOfflineManager.getOfflineHealthAdvice(['fever'], language);
      speak(advice);
    } else if (lowerCommand.includes('headache') || lowerCommand.includes('सिरदर्द') || lowerCommand.includes('ਸਿਰ ਦਰਦ') || lowerCommand.includes('মাথা ব্যথা')) {
      const advice = enhancedOfflineManager.getOfflineHealthAdvice(['headache'], language);
      speak(advice);
    } else if (lowerCommand.includes('stomach') || lowerCommand.includes('पेट') || lowerCommand.includes('ਪੇਟ') || lowerCommand.includes('পেট')) {
      const advice = enhancedOfflineManager.getOfflineHealthAdvice(['stomachache'], language);
      speak(advice);
    } else {
      speak(language === 'hi' ? 'मुझे समझ नहीं आया। कृपया दूसरे शब्दों में कहें।' :
            language === 'pa' ? 'ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਇਆ। ਕਿਰਪਾ ਕਰਕੇ ਹੋਰ ਸ਼ਬਦਾਂ ਵਿੱਚ ਕਹੋ।' :
            language === 'bn' ? 'আমি বুঝলাম না। দয়া করে অন্যভাবে বলুন।' :
            'I didn\'t understand. Please try saying it differently.');
    }
  };

  // Action handlers (all work offline)
  const handleBookAppointment = async () => {
    const appointmentId = await enhancedOfflineManager.bookAppointment({
      patientId: 'demo_patient',
      doctorId: 'demo_doctor',
      date: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
      type: 'consultation',
      status: 'booked'
    });
    
    speak(language === 'hi' ? `अपॉइंटमेंट बुक हो गई। ID: ${appointmentId.slice(-6)}` :
          language === 'pa' ? `ਮੁਲਾਕਾਤ ਬੁੱਕ ਹੋ ਗਈ। ID: ${appointmentId.slice(-6)}` :
          language === 'bn' ? `অ্যাপয়েন্টমেন্ট বুক হয়েছে। ID: ${appointmentId.slice(-6)}` :
          `Appointment booked successfully. ID: ${appointmentId.slice(-6)}`);
    
    onNavigate('patient');
  };

  const handleFamilyHealth = async () => {
    const patients = await enhancedOfflineManager.getPatients();
    speak(language === 'hi' ? `आपके परिवार में ${patients.length} सदस्य हैं।` :
          language === 'pa' ? `ਤੁਹਾਡੇ ਪਰਿਵਾਰ ਵਿੱਚ ${patients.length} ਮੈਂਬਰ ਹਨ।` :
          language === 'bn' ? `আপনার পরিবারে ${patients.length} জন সদস্য আছেন।` :
          `You have ${patients.length} family members registered.`);
    
    onNavigate('patient');
  };

  const handleMedicine = async () => {
    const prescriptions = await enhancedOfflineManager.getPrescriptions();
    speak(language === 'hi' ? `आपके पास ${prescriptions.length} नुस्खे हैं।` :
          language === 'pa' ? `ਤੁਹਾਡੇ ਕੋਲ ${prescriptions.length} ਨੁਸਖੇ ਹਨ।` :
          language === 'bn' ? `আপনার ${prescriptions.length}টি প্রেসক্রিপশন আছে।` :
          `You have ${prescriptions.length} prescriptions.`);
    
    onNavigate('pharmacy');
  };

  const handleShowAppointments = async () => {
    const appointments = await enhancedOfflineManager.getAppointments();
    speak(language === 'hi' ? `आपकी ${appointments.length} अपॉइंटमेंट हैं।` :
          language === 'pa' ? `ਤੁਹਾਡੀਆਂ ${appointments.length} ਮੁਲਾਕਾਤਾਂ ਹਨ।` :
          language === 'bn' ? `আপনার ${appointments.length}টি অ্যাপয়েন্টমেন্ট আছে।` :
          `You have ${appointments.length} appointments.`);
  };

  const handleShowPrescriptions = async () => {
    const prescriptions = await enhancedOfflineManager.getPrescriptions();
    const latest = prescriptions[prescriptions.length - 1];
    
    if (latest) {
      speak(language === 'hi' ? 'आपका सबसे नया नुस्खा दिखा रहे हैं।' :
            language === 'pa' ? 'ਤੁਹਾਡਾ ਸਭ ਤੋਂ ਨਵਾਂ ਨੁਸਖਾ ਦਿਖਾ ਰਹੇ ਹਾਂ।' :
            language === 'bn' ? 'আপনার সর্বশেষ প্রেসক্রিপশন দেখাচ্ছি।' :
            'Showing your latest prescription.');
    } else {
      speak(language === 'hi' ? 'कोई नुस्खा नहीं मिला।' :
            language === 'pa' ? 'ਕੋਈ ਨੁਸਖਾ ਨਹੀਂ ਮਿਲਿਆ।' :
            language === 'bn' ? 'কোনো প্রেসক্রিপশন পাওয়া যায়নি।' :
            'No prescriptions found.');
    }
  };

  const handleAddFamilyMember = async () => {
    const patientId = await enhancedOfflineManager.addPatient({
      name: 'Family Member',
      age: 30,
      gender: 'not-specified',
      familyId: 'demo_family'
    });
    
    speak(language === 'hi' ? 'परिवार का सदस्य जोड़ा गया।' :
          language === 'pa' ? 'ਪਰਿਵਾਰਕ ਮੈਂਬਰ ਜੋੜਿਆ ਗਿਆ।' :
          language === 'bn' ? 'পরিবারের সদস্য যোগ করা হয়েছে।' :
          'Family member added.');
  };

  const handleEmergencySOS = async () => {
    const sosId = await enhancedOfflineManager.triggerEmergencySOS();
    speak(language === 'hi' ? '🚨 आपातकालीन SOS सक्रिय! मदद आ रही है।' :
          language === 'pa' ? '🚨 ਐਮਰਜੈਂਸੀ SOS ਸਕਿਰਪ! ਮਦਦ ਆ ਰਹੀ ਹੈ।' :
          language === 'bn' ? '🚨 জরুরি SOS সক্রিয়! সাহায্য আসছে।' :
          '🚨 Emergency SOS activated! Help is coming.');
    
    onNavigate('emergency');
  };

  // Text-to-speech
  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'hi' ? 'hi-IN' : 
                       language === 'pa' ? 'pa-IN' : 
                       language === 'bn' ? 'bn-IN' : 'en-US';
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <>
      {/* Welcome Message */}
      <AnimatePresence>
        {showWelcome && (
          <motion.div
            className="fixed top-20 left-1/2 transform -translate-x-1/2 z-30 w-11/12 max-w-md"
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <motion.div
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white p-4 rounded-2xl shadow-2xl relative overflow-hidden"
              animate={{ 
                background: [
                  "linear-gradient(45deg, #10b981, #059669)",
                  "linear-gradient(45deg, #059669, #047857)",
                  "linear-gradient(45deg, #10b981, #059669)"
                ]
              }}
              transition={{ repeat: Infinity, duration: 3 }}
            >
              <motion.div
                className="absolute inset-0 bg-white opacity-10"
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360]
                }}
                transition={{ repeat: Infinity, duration: 4 }}
              />
              
              <div className="relative flex items-center space-x-3">
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <Sparkles className="w-8 h-8" />
                </motion.div>
                
                <div className="flex-1">
                  <p className="text-sm font-medium leading-relaxed">
                    {content.welcome[language]}
                  </p>
                </div>
                
                <motion.button
                  onClick={() => setShowWelcome(false)}
                  className="text-white hover:text-emerald-200 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  ✕
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Voice Control Indicator */}
      <AnimatePresence>
        {(isListening || isProcessing) && (
          <motion.div
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
          >
            <motion.div
              className="bg-white rounded-full p-8 shadow-2xl border-4 border-emerald-500"
              animate={{ 
                scale: isListening ? [1, 1.1, 1] : 1,
                borderColor: isListening ? ['#10b981', '#f59e0b', '#10b981'] : '#10b981'
              }}
              transition={{ repeat: isListening ? Infinity : 0, duration: 1 }}
            >
              <div className="text-center">
                {isProcessing ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1 }}
                  >
                    <Zap className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
                  </motion.div>
                ) : (
                  <motion.div
                    animate={{ 
                      scale: [1, 1.3, 1],
                      color: ['#10b981', '#ef4444', '#10b981']
                    }}
                    transition={{ repeat: Infinity, duration: 0.8 }}
                  >
                    <Mic className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
                  </motion.div>
                )}
                
                <p className="text-sm font-medium text-gray-800 mb-1">
                  {isProcessing ? content.processing[language] : content.listening[language]}
                </p>
                
                {currentCommand && (
                  <motion.p
                    className="text-xs text-gray-600 bg-gray-100 px-3 py-1 rounded-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    "{currentCommand}"
                  </motion.p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Voice Control Button - Always visible */}
      <motion.button
        onClick={startVoiceRecognition}
        className="fixed bottom-32 right-6 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 
                   text-white rounded-full p-4 shadow-2xl transition-all duration-300 z-40"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={{
          boxShadow: isListening 
            ? ['0 0 0 0 rgba(16, 185, 129, 0.7)', '0 0 0 20px rgba(16, 185, 129, 0)']
            : '0 10px 25px rgba(16, 185, 129, 0.3)'
        }}
        transition={{
          boxShadow: {
            repeat: isListening ? Infinity : 0,
            duration: 1.5
          }
        }}
        disabled={isListening || isProcessing}
      >
        <div className="relative">
          {isListening ? (
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 0.5 }}
            >
              <Mic className="w-6 h-6" />
            </motion.div>
          ) : (
            <Volume2 className="w-6 h-6" />
          )}
          
          {/* Status indicator */}
          <div className="absolute -top-1 -right-1">
            {!isOnline && (
              <motion.div
                className="bg-orange-500 rounded-full p-1"
                animate={{ pulse: [1, 1.3, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <div className="w-2 h-2 bg-white rounded-full" />
              </motion.div>
            )}
          </div>
        </div>
      </motion.button>

      {/* Quick Voice Commands */}
      <motion.div
        className="fixed bottom-6 left-6 z-40"
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 2 }}
      >
        <motion.div
          className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 max-w-xs"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center space-x-2 mb-3">
            <Heart className="w-5 h-5 text-emerald-500" />
            <h3 className="font-medium text-gray-800">
              {language === 'hi' ? 'वॉइस कमांड' :
               language === 'pa' ? 'ਵਾਇਸ ਕਮਾਂਡ' :
               language === 'bn' ? 'ভয়েস কমান্ড' :
               'Voice Commands'}
            </h3>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            {[
              { icon: Calendar, label: language === 'hi' ? 'अपॉइंटमेंट' : 'Appointment' },
              { icon: Shield, label: language === 'hi' ? 'आपातकाल' : 'Emergency' },
              { icon: Users, label: language === 'hi' ? 'परिवार' : 'Family' },
              { icon: Pill, label: language === 'hi' ? 'दवा' : 'Medicine' }
            ].map((item, index) => (
              <motion.div
                key={index}
                className="flex flex-col items-center p-2 bg-gray-50 rounded-lg"
                whileHover={{ scale: 1.05, backgroundColor: '#f0fdf4' }}
              >
                <item.icon className="w-4 h-4 text-emerald-600 mb-1" />
                <span className="text-xs text-gray-600">{item.label}</span>
              </motion.div>
            ))}
          </div>
          
          <p className="text-xs text-gray-500 mt-3 text-center">
            {language === 'hi' ? 'बस बोलें, हम सुनेंगे!' :
             language === 'pa' ? 'ਬੱਸ ਬੋਲੋ, ਅਸੀਂ ਸੁਣਾਂਗੇ!' :
             language === 'bn' ? 'শুধু বলুন, আমরা শুনব!' :
             'Just speak, we\'ll listen!'}
          </p>
        </motion.div>
      </motion.div>
    </>
  );
}