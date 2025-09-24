import React, { useState, useEffect, useRef } from 'react';
import { Bot, Volume2, VolumeX, Mic, MicOff, WifiOff, Brain, Loader2, Heart, Sparkles, MessageCircle, Phone, Calendar, Pill, Users, ShieldAlert, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { demoOfflineManager } from '../utils/offline/demoOffline';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface EnhancedAIAssistantProps {
  language: 'en' | 'hi' | 'pa' | 'bn';
  currentPage: string;
  onNavigate: (page: string) => void;
  onAction?: (action: string, data?: any) => void;
}

interface AIPersonality {
  name: string;
  avatar: string;
  mood: 'happy' | 'caring' | 'serious' | 'energetic';
  responses: string[];
}

export function EnhancedAIAssistant({ language, currentPage, onNavigate, onAction }: EnhancedAIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [conversation, setConversation] = useState<Array<{role: 'user' | 'assistant', content: string, timestamp: Date}>>([]);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [aiPersonality, setAiPersonality] = useState<AIPersonality>({
    name: 'Dr. Maya',
    avatar: '👩‍⚕️',
    mood: 'caring',
    responses: []
  });
  
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null);
  const conversationRef = useRef<HTMLDivElement>(null);

  // Enhanced multilingual content with natural conversation flows
  const content = {
    greeting: {
      en: "Hello! I'm Dr. Maya, your personal healthcare assistant. I'm here to help you with everything - from booking appointments to managing your family's health. What would you like to do today?",
      hi: "नमस्ते! मैं डॉ. माया हूं, आपकी व्यक्तिगत स्वास्थ्य सहायक। मैं अपॉइंटमेंट बुकिंग से लेकर आपके परिवार के स्वास्थ्य के प्रबंधन तक सब कुछ में आपकी मदद करने के लिए यहां हूं। आज आप क्या करना चाहेंगे?",
      pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਡਾ. ਮਾਇਆ ਹਾਂ, ਤੁਹਾਡੀ ਨਿੱਜੀ ਸਿਹਤ ਸਹਾਇਕ। ਮੈਂ ਮੁਲਾਕਾਤ ਬੁੱਕ ਕਰਨ ਤੋਂ ਲੈ ਕੇ ਤੁਹਾਡੇ ਪਰਿਵਾਰ ਦੀ ਸਿਹਤ ਦੇ ਪ੍ਰਬੰਧਨ ਤੱਕ ਹਰ ਚੀਜ਼ ਵਿੱਚ ਤੁਹਾਡੀ ਮਦਦ ਕਰਨ ਲਈ ਇੱਥੇ ਹਾਂ। ਅੱਜ ਤੁਸੀਂ ਕੀ ਕਰਨਾ ਚਾਹੋਗੇ?",
      bn: "নমস্কার! আমি ডাঃ মায়া, আপনার ব্যক্তিগত স্বাস্থ্য সহায়ক। অ্যাপয়েন্টমেন্ট বুকিং থেকে শুরু করে আপনার পরিবারের স্বাস্থ্য ব্যবস্থাপনা পর্যন্ত সবকিছুতে আমি আপনাকে সাহায্য করতে এখানে আছি। আজ আপনি কী করতে চান?"
    },
    listening: {
      en: "I'm listening... Please tell me how I can help you today.",
      hi: "मैं सुन रहा हूं... कृपया बताएं आज मैं आपकी कैसे मदद कर सकता हूं।",
      pa: "ਮੈਂ ਸੁਣ ਰਿਹਾ ਹਾਂ... ਕਿਰਪਾ ਕਰਕੇ ਦੱਸੋ ਅੱਜ ਮੈਂ ਤੁਹਾਡੀ ਕਿਵੇਂ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ।",
      bn: "আমি শুনছি... দয়া করে বলুন আজ আমি আপনাকে কিভাবে সাহায্য করতে পারি।"
    },
    processing: {
      en: "Let me think about that... I'm checking the best way to help you.",
      hi: "मुझे इसके बारे में सोचने दीजिए... मैं आपकी मदद करने का सबसे अच्छा तरीका देख रहा हूं।",
      pa: "ਮੈਨੂੰ ਇਸ ਬਾਰੇ ਸੋਚਣ ਦਿਓ... ਮੈਂ ਤੁਹਾਡੀ ਮਦਦ ਕਰਨ ਦਾ ਸਭ ਤੋਂ ਵਧੀਆ ਤਰੀਕਾ ਦੇਖ ਰਿਹਾ ਹਾਂ।",
      bn: "আমাকে এটা নিয়ে ভাবতে দিন... আমি আপনাকে সাহায্য করার সবচেয়ে ভালো উপায় খুঁজছি।"
    },
    offlineMode: {
      en: "I'm working in offline mode right now, but I can still help you with most tasks. What do you need?",
      hi: "मैं अभी ऑफलाইन मोড में काम कर रहा हूं, लेकिन फिर भी मैं आपके अधिकांश कामों में आपकी मदद कर सकता हूं। आपको क्या चाहिए?",
      pa: "ਮੈਂ ਫਿਲਹਾਲ ਔਫਲਾਈਨ ਮੋਡ ਵਿੱਚ ਕੰਮ ਕਰ ਰਿਹਾ ਹਾਂ, ਪਰ ਫਿਰ ਵੀ ਮੈਂ ਤੁਹਾਡੇ ਜ਼ਿਆਦਾਤਰ ਕੰਮਾਂ ਵਿੱਚ ਤੁਹਾਡੀ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ। ਤੁਹਾਨੂੰ ਕੀ ਚਾਹੀਦਾ ਹੈ?",
      bn: "আমি এখন অফলাইন মোডে কাজ করছি, তবুও আমি আপনার বেশিরভাগ কাজে সাহায্য করতে পারি। আপনার কী প্রয়োজন?"
    }
  };

  // Check network status
  useEffect(() => {
    const updateOnlineStatus = () => setIsOffline(!navigator.onLine);
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  // Initialize AI personality based on time and context
  useEffect(() => {
    const hour = new Date().getHours();
    let mood: 'happy' | 'caring' | 'serious' | 'energetic' = 'caring';
    
    if (hour < 12) mood = 'energetic';
    else if (hour < 17) mood = 'happy';
    else if (hour < 20) mood = 'caring';
    else mood = 'serious';

    setAiPersonality(prev => ({ ...prev, mood }));
  }, []);

  // Auto-scroll conversation
  useEffect(() => {
    if (conversationRef.current) {
      conversationRef.current.scrollTop = conversationRef.current.scrollHeight;
    }
  }, [conversation]);

  // Enhanced speech synthesis with natural voice
  const speak = (text: string, priority: 'high' | 'normal' = 'normal') => {
    if (isSpeaking && priority !== 'high') return;
    
    speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'hi' ? 'hi-IN' : 
                     language === 'pa' ? 'pa-IN' : 
                     language === 'bn' ? 'bn-IN' : 'en-US';
    
    // Make voice more natural and caring
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    utterance.volume = 0.8;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    
    synthRef.current = utterance;
    speechSynthesis.speak(utterance);
  };

  // Enhanced speech recognition with continuous listening
  const startListening = () => {
    if (!('webkitSpeechRecognition' in window)) {
      speak(language === 'hi' ? 'माफ करें, आपका ब्राउज़र वॉइस रिकग्निशन सपोर्ट नहीं करता।' : 'Sorry, your browser does not support voice recognition.');
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = language === 'hi' ? 'hi-IN' : 
                       language === 'pa' ? 'pa-IN' : 
                       language === 'bn' ? 'bn-IN' : 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setCurrentTranscript('');
      speak(content.listening[language], 'high');
    };

    recognition.onresult = (event: any) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setCurrentTranscript(transcript);
    };

    recognition.onend = () => {
      setIsListening(false);
      if (currentTranscript.trim()) {
        handleVoiceInput(currentTranscript);
      }
    };

    recognition.onerror = (event: any) => {
      setIsListening(false);
      console.error('Speech recognition error:', event.error);
      speak(language === 'hi' ? 'मुझे समझने में कुछ समस्या हुई। कृपया दोबारा कोशिश करें।' : 'I had trouble understanding. Please try again.');
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  // Comprehensive voice command processor with natural conversation
  const handleVoiceInput = async (userInput: string) => {
    setIsProcessing(true);
    
    // Add user message to conversation
    const userMessage = { role: 'user' as const, content: userInput, timestamp: new Date() };
    setConversation(prev => [...prev, userMessage]);

    try {
      let response = '';
      let action = '';

      // Process natural language commands
      const input = userInput.toLowerCase();
      
      // Navigation commands
      if (input.includes('home') || input.includes('होम') || input.includes('ਘਰ') || input.includes('হোম')) {
        onNavigate('home');
        response = language === 'hi' ? 'मैं आपको होम पेज पर ले जा रहा हूं।' :
                   language === 'pa' ? 'ਮੈਂ ਤੁਹਾਨੂੰ ਹੋਮ ਪੇਜ ਤੇ ਲੈ ਜਾ ਰਿਹਾ ਹਾਂ।' :
                   language === 'bn' ? 'আমি আপনাকে হোম পেজে নিয়ে যাচ্ছি।' :
                   'Taking you to the home page.';
      }
      // Patient portal
      else if (input.includes('patient') || input.includes('मरीज') || input.includes('ਮਰੀਜ਼') || input.includes('রোগী') ||
               input.includes('book') || input.includes('appointment') || input.includes('अपॉइंटमेंट')) {
        onNavigate('patient');
        response = language === 'hi' ? 'पेशेंट पोर्टल खोल रहा हूं। यहां आप अपॉइंटमेंट बुक कर सकते हैं, अपने परिवार का स्वास्थ्य देख सकते हैं।' :
                   language === 'pa' ? 'ਪੇਸ਼ੈਂਟ ਪੋਰਟਲ ਖੋਲ੍ਹ ਰਿਹਾ ਹਾਂ। ਇੱਥੇ ਤੁਸੀਂ ਮੁਲਾਕਾਤ ਬੁੱਕ ਕਰ ਸਕਦੇ ਹੋ।' :
                   language === 'bn' ? 'পেশেন্ট পোর্টাল খুলছি। এখানে আপনি অ্যাপয়েন্টমেন্ট বুক করতে পারেন।' :
                   'Opening patient portal. Here you can book appointments and manage your family\'s health.';
      }
      // Emergency
      else if (input.includes('emergency') || input.includes('आपातकाल') || input.includes('ਐਮਰਜੈਂਸੀ') || input.includes('জরুরি') ||
               input.includes('help') || input.includes('मदद') || input.includes('urgent') || input.includes('108')) {
        onNavigate('emergency');
        response = language === 'hi' ? '🚨 तुरंत आपातकालीन सेवाओं से जोड़ रहा हूं! शांत रहें।' :
                   language === 'pa' ? '🚨 ਤੁਰੰਤ ਐਮਰਜੈਂਸੀ ਸੇਵਾਵਾਂ ਨਾਲ ਜੋੜ ਰਿਹਾ ਹਾਂ! ਸ਼ਾਂਤ ਰਹੋ।' :
                   language === 'bn' ? '🚨 অবিলম্বে জরুরি সেবার সাথে যুক্ত করছি! শান্ত থাকুন।' :
                   '🚨 Connecting to emergency services immediately! Stay calm.';
        speak(response, 'high');
      }
      // Doctor portal
      else if (input.includes('doctor') || input.includes('डॉक्टर') || input.includes('ਡਾਕਟਰ') || input.includes('ডাক্তার')) {
        onNavigate('doctor');
        response = language === 'hi' ? 'डॉक्टर पोर्टल खोल रहा हूं। यहां आप मरीजों को देख सकते हैं और नुस्खे लिख सकते हैं।' :
                   language === 'pa' ? 'ਡਾਕਟਰ ਪੋਰਟਲ ਖੋਲ੍ਹ ਰਿਹਾ ਹਾਂ। ਇੱਥੇ ਤੁਸੀਂ ਮਰੀਜ਼ਾਂ ਨੂੰ ਦੇਖ ਸਕਦੇ ਹੋ।' :
                   language === 'bn' ? 'ডাক্তার পোর্টাল খুলছি। এখানে আপনি রোগীদের দেখতে পারেন।' :
                   'Opening doctor portal. Here you can see patients and write prescriptions.';
      }
      // Health symptoms
      else if (input.includes('fever') || input.includes('बुखार') || input.includes('ਬੁਖਾਰ') || input.includes('জ্বর')) {
        response = language === 'hi' ? 'बुखار के लिए: आराम करें, तरल पदार्थ लें। 102°F से ऊपर या 3 दिन से अधिक हो तो डॉक्टर से मिलें। क्या मैं आपके लिए अपॉइंटमेंट बुक करूं?' :
                   language === 'pa' ? 'ਬੁਖਾਰ ਲਈ: ਆਰਾਮ ਕਰੋ, ਤਰਲ ਪਦਾਰਥ ਲਓ। 102°F ਤੋਂ ਉੱਪਰ ਹੋਵੇ ਤਾਂ ਡਾਕਟਰ ਨੂੰ ਮਿਲੋ।' :
                   language === 'bn' ? 'জ্বরের জন্য: বিশ্রাম নিন, তরল খান। 102°F এর উপরে হলে ডাক্তার দেখান।' :
                   'For fever: Rest and stay hydrated. If above 102°F or persists for 3+ days, see a doctor. Should I book an appointment for you?';
      }
      else if (input.includes('headache') || input.includes('सिरदर्द') || input.includes('ਸਿਰ ਦੁਖਦਾ') || input.includes('মাথা ব্যথা')) {
        response = language === 'hi' ? 'सिरदर्द के लिए: अंधेरे कमरे में आराम करें, पानी पिएं। तेज़ दर्द या देखने में समस्या हो तो तुरंत डॉक्टर से मिलें।' :
                   language === 'pa' ? 'ਸਿਰ ਦਰਦ ਲਈ: ਹਨੇਰੇ ਕਮਰੇ ਵਿੱਚ ਆਰਾਮ ਕਰੋ, ਪਾਣੀ ਪੀਓ।' :
                   language === 'bn' ? 'মাথা ব্যথার জন্য: অন্ধকার ঘরে বিশ্রাম নিন, পানি পান ক���ুন।' :
                   'For headache: Rest in a dark room, stay hydrated. If severe or with vision problems, seek immediate medical help.';
      }
      // Default: Get AI response
      else {
        response = await getAIResponse(userInput);
      }

      // Add assistant response to conversation
      const assistantMessage = { role: 'assistant' as const, content: response, timestamp: new Date() };
      setConversation(prev => [...prev, assistantMessage]);

      // Speak the response
      speak(response);

    } catch (error) {
      console.error('Error processing voice input:', error);
      const errorResponse = language === 'hi' ? 'मुझे समझने में कुछ समस्या हुई। कृपया दोबारा कोशिश करें।' :
                           language === 'pa' ? 'ਮੈਨੂੰ ਸਮਝਣ ਵਿੱਚ ਕੁਝ ਸਮੱਸਿਆ ਹੋਈ।' :
                           language === 'bn' ? 'আমার বুঝতে সমস্যা হয়েছে।' :
                           'I had trouble understanding. Please try again.';
      
      setConversation(prev => [...prev, { role: 'assistant', content: errorResponse, timestamp: new Date() }]);
      speak(errorResponse);
    } finally {
      setIsProcessing(false);
    }
  };

  // Get AI response (online/offline)
  const getAIResponse = async (userQuery: string): Promise<string> => {
    if (isOffline) {
      return getOfflineResponse(userQuery);
    }

    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-54854473/api/gemini-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({
          messages: conversation.map(msg => ({ role: msg.role, content: msg.content })),
          language,
          currentPage,
          userQuery
        })
      });

      if (!response.ok) {
        throw new Error('AI service unavailable');
      }

      const data = await response.json();
      return data.response || getOfflineResponse(userQuery);
    } catch (error) {
      console.error('AI API error:', error);
      return getOfflineResponse(userQuery);
    }
  };

  // Enhanced offline responses
  const getOfflineResponse = (query: string): string => {
    const responses = {
      en: {
        greeting: "Hello! I'm your healthcare assistant. Even offline, I can help you navigate the app, provide basic health guidance, and manage your medical information. What do you need help with?",
        navigation: "I can help you navigate JanArogya. You can access patient portal, emergency services, family health records, or pharmacy information. Where would you like to go?",
        health: "For health concerns, I recommend: stay hydrated, rest well, and monitor symptoms. For serious issues, use our emergency services. Would you like me to guide you to specific health resources?",
        emergency: "🚨 Emergency protocol activated! I'm preparing emergency contact information and location services. Stay calm and follow the emergency procedures.",
        default: "I'm here to help you with healthcare navigation, symptom guidance, appointment scheduling, and family health management. What specific assistance do you need?"
      },
      hi: {
        greeting: "नमस्ते! मैं आपका स्वास्थ्य सहायक हूं। ऑफलाइन होने पर भी, मैं ऐप नेविगेशन, बुनियादी स्वास्थ्य मार्गदर्शन, और आपकी चिकित्सा जानकारी के प्रबंधन में मदद कर सकता हूं। आपको किस चीज़ में मदद चाहिए?",
        navigation: "मैं जनआरोग्य नेविगेट करने में मदद कर सकता हूं। आप पेशेंट पोर्टल, आपातकालीन सेवाएं, पारिवारिक स्वास्थ्य रिकॉर्ड, या फार्मेसी जानकारी एक्सेस कर सकते हैं। आप कहां जाना चाहते हैं?",
        health: "स्वास्थ्य संबंधी चिंताओं के लिए, मैं सुझाता हूं: हाइड्रेटेड रहें, अच्छा आराम करें, और लक्षणों पर नज़र रखें। गंभीर समस्याओं के लिए, हमारी आपातकालीन सेवाओं का उपयोग करें।",
        emergency: "🚨 आपातकालीन प्रोटोकॉल सक्रिय! मैं आपातकालीन संपर्क जानकारी और स्थान सेवाएं तैयार कर रहा हूं। शांत रहें।",
        default: "मैं स्वास्थ्य नेविगेशन, लक्षण मार्गदर्शन, अपॉइंटमेंट शेड्यूलिंग, और पारिवारिक स्वास्थ्य प्रबंधन में आपकी मदद करने के लिए यहां हूं। आपको किस विशिष्ट सहायता की आवश्यकता है?"
      }
    };

    const langResponses = responses[language] || responses.en;
    const input = query.toLowerCase();

    if (input.includes('hello') || input.includes('hi') || input.includes('नमस्ते') || input.includes('हैलो')) {
      return langResponses.greeting;
    } else if (input.includes('navigate') || input.includes('go') || input.includes('नेविगेट') || input.includes('जाओ')) {
      return langResponses.navigation;
    } else if (input.includes('emergency') || input.includes('आपातकाल') || input.includes('help') || input.includes('मदद')) {
      return langResponses.emergency;
    } else if (input.includes('health') || input.includes('स्वास्थ्य') || input.includes('symptom') || input.includes('लक्षण')) {
      return langResponses.health;
    } else {
      return langResponses.default;
    }
  };

  // Initialize with greeting
  useEffect(() => {
    if (isOpen && conversation.length === 0) {
      const greeting = { role: 'assistant' as const, content: content.greeting[language], timestamp: new Date() };
      setConversation([greeting]);
      setTimeout(() => speak(greeting.content), 500);
    }
  }, [isOpen, language]);

  return (
    <>
      {/* Floating AI Assistant Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="relative bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 
                     text-white rounded-full p-4 shadow-2xl transition-all duration-300 transform hover:scale-110"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <AnimatePresence>
            {isListening && (
              <motion.div
                className="absolute inset-0 rounded-full bg-red-500 opacity-30"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1 }}
              />
            )}
          </AnimatePresence>
          
          <div className="relative">
            {isProcessing ? (
              <Loader2 className="w-8 h-8 animate-spin" />
            ) : isListening ? (
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 0.5 }}
              >
                <Mic className="w-8 h-8" />
              </motion.div>
            ) : (
              <Bot className="w-8 h-8" />
            )}
          </div>
          
          {/* Status indicators */}
          <div className="absolute -top-2 -right-2 flex space-x-1">
            {isOffline && (
              <motion.div
                className="bg-orange-500 rounded-full p-1"
                animate={{ pulse: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <WifiOff className="w-3 h-3 text-white" />
              </motion.div>
            )}
            <motion.div
              className="bg-green-500 rounded-full p-1"
              animate={{ pulse: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 3 }}
            >
              <Heart className="w-3 h-3 text-white" />
            </motion.div>
          </div>
        </motion.button>
      </motion.div>

      {/* AI Assistant Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-3rem)] z-40"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-6 relative overflow-hidden">
                <motion.div
                  className="absolute inset-0 bg-white opacity-10"
                  animate={{ 
                    background: [
                      "radial-gradient(circle at 20% 50%, white 0%, transparent 50%)",
                      "radial-gradient(circle at 80% 50%, white 0%, transparent 50%)",
                      "radial-gradient(circle at 20% 50%, white 0%, transparent 50%)"
                    ]
                  }}
                  transition={{ repeat: Infinity, duration: 4 }}
                />
                
                <div className="relative flex items-center space-x-4">
                  <motion.div
                    className="text-4xl"
                    animate={{ 
                      rotate: aiPersonality.mood === 'energetic' ? [0, 10, -10, 0] : 0 
                    }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    {aiPersonality.avatar}
                  </motion.div>
                  
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-1">
                      {aiPersonality.name}
                    </h3>
                    <p className="text-emerald-100 text-sm flex items-center space-x-2">
                      <Brain className="w-4 h-4" />
                      <span>
                        {isOffline ? 
                          (language === 'hi' ? 'ऑफलाइन मोड - स्थानीय AI' : 
                           language === 'pa' ? 'ਔਫਲਾਈਨ ਮੋਡ' :
                           language === 'bn' ? 'অফলাইন মোড' :
                           'Offline Mode - Local AI') :
                          (language === 'hi' ? 'Gemini AI द्वारा संचालित' : 
                           language === 'pa' ? 'Gemini AI ਦੁਆਰਾ ਸੰਚਾਲਿਤ' :
                           language === 'bn' ? 'Gemini AI দ্বারা চালিত' :
                           'Powered by Gemini AI')
                        }
                      </span>
                      <Sparkles className="w-3 h-3" />
                    </p>
                  </div>
                  
                  <motion.button
                    onClick={() => setIsOpen(false)}
                    className="text-white hover:text-emerald-200 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    ✕
                  </motion.button>
                </div>
              </div>

              {/* Conversation Area */}
              <div 
                ref={conversationRef}
                className="h-80 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white"
              >
                <AnimatePresence>
                  {conversation.map((message, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                        message.role === 'user' 
                          ? 'bg-emerald-500 text-white ml-4' 
                          : 'bg-white text-gray-800 mr-4 shadow-md border border-gray-100'
                      }`}>
                        {message.role === 'assistant' && (
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-lg">{aiPersonality.avatar}</span>
                            <span className="text-xs text-gray-500">Dr. Maya</span>
                          </div>
                        )}
                        <p className="text-sm leading-relaxed">{message.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Current transcript */}
                {isListening && currentTranscript && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-end"
                  >
                    <div className="bg-emerald-100 text-emerald-800 px-4 py-2 rounded-2xl max-w-xs">
                      <p className="text-sm italic">"{currentTranscript}"</p>
                    </div>
                  </motion.div>
                )}

                {/* Processing indicator */}
                {isProcessing && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="bg-white text-gray-800 px-4 py-3 rounded-2xl shadow-md border border-gray-100 flex items-center space-x-2">
                      <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
                      <p className="text-sm">{content.processing[language]}</p>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Controls */}
              <div className="p-4 bg-gray-50 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <motion.button
                    onClick={isListening ? stopListening : startListening}
                    className={`flex-1 mr-2 py-3 px-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                      isListening 
                        ? 'bg-red-500 hover:bg-red-600 text-white' 
                        : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isProcessing}
                  >
                    {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    <span>
                      {isListening 
                        ? (language === 'hi' ? 'रुकें' : language === 'pa' ? 'ਰੁਕੋ' : language === 'bn' ? 'থামুন' : 'Stop')
                        : (language === 'hi' ? 'बोलें' : language === 'pa' ? 'ਬੋਲੋ' : language === 'bn' ? 'বলুন' : 'Speak')
                      }
                    </span>
                  </motion.button>

                  <motion.button
                    onClick={() => {
                      speechSynthesis.cancel();
                      setIsSpeaking(false);
                    }}
                    className="p-3 text-gray-500 hover:text-gray-700 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {isSpeaking ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </motion.button>
                </div>

                {/* Quick Actions */}
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {[
                    { 
                      icon: Calendar, 
                      label: language === 'hi' ? 'अपॉइंटमेंट' : language === 'pa' ? 'ਮੁਲਾਕਾਤ' : language === 'bn' ? 'অ্যাপয়েন্টমেন্ট' : 'Appointment',
                      action: () => handleVoiceInput(language === 'hi' ? 'मुझे डॉक्टर से मिलना है' : 'I want to see a doctor')
                    },
                    { 
                      icon: Pill, 
                      label: language === 'hi' ? 'दवा' : language === 'pa' ? 'ਦਵਾਈ' : language === 'bn' ? 'ওষুধ' : 'Medicine',
                      action: () => handleVoiceInput(language === 'hi' ? 'मुझे दवा की जानकारी चाहिए' : 'I need medicine information')
                    },
                    { 
                      icon: Users, 
                      label: language === 'hi' ? 'परिवार' : language === 'pa' ? 'ਪਰਿਵਾਰ' : language === 'bn' ? 'পরিবার' : 'Family',
                      action: () => handleVoiceInput(language === 'hi' ? 'मेरे परिवार का स्वास्थ्य देखना है' : 'Show my family health')
                    },
                    { 
                      icon: ShieldAlert, 
                      label: language === 'hi' ? 'आपातकाल' : language === 'pa' ? 'ਐਮਰਜੈਂਸੀ' : language === 'bn' ? 'জরুরি' : 'Emergency',
                      action: () => handleVoiceInput(language === 'hi' ? 'आपातकालीन मदद चाहिए' : 'I need emergency help')
                    }
                  ].map((item, index) => (
                    <motion.button
                      key={index}
                      onClick={item.action}
                      className="flex items-center space-x-2 p-2 bg-white hover:bg-emerald-50 rounded-lg border border-gray-200 hover:border-emerald-200 transition-colors text-sm"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <item.icon className="w-4 h-4 text-emerald-600" />
                      <span className="text-gray-700">{item.label}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}