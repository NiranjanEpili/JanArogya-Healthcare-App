import React, { useState, useEffect, useRef } from 'react';
import { Bot, Volume2, VolumeX, Mic, MicOff, WifiOff, Brain, Loader2 } from 'lucide-react';
import { demoOfflineManager } from '../utils/offline/demoOffline';
import { projectId, publicAnonKey } from '../utils/supabase/info';

type Language = 'en' | 'hi' | 'pa' | 'bn';
type Page = 'home' | 'about' | 'features' | 'patient' | 'health-worker' | 'doctor' | 'pharmacy' | 'admin' | 'contact' | 'emergency';

interface AIVoiceAssistantProps {
  language: Language;
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

interface LanguageContent {
  [key: string]: {
    [K in Language]: string;
  };
}

const content: LanguageContent = {
  greeting: {
    en: "Hello! I'm your health assistant. I'm here to help you navigate JanArogya easily. What would you like to do today?",
    hi: "नमस्ते! मैं आपका स्वास्थ्य सहायक हूं। मैं आपको जनआरोग्य में आसानी से नेविगेट करने में मदद करने के लिए यहां हूं। आज आप क्या करना चाहते हैं?",
    pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਤੁਹਾਡਾ ਸਿਹਤ ਸਹਾਇਕ ਹਾਂ। ਮੈਂ ਤੁਹਾਨੂੰ ਜਨਆਰੋਗਿਆ ਵਿੱਚ ਆਸਾਨੀ ਨਾਲ ਨੈਵੀਗੇਟ ਕਰਨ ਵਿੱਚ ਮਦਦ ਕਰਨ ਲਈ ਇੱਥੇ ਹਾਂ। ਅੱਜ ਤੁਸੀਂ ਕੀ ਕਰਨਾ ਚਾਹੁੰਦੇ ਹੋ?",
    bn: "নমস্কার! আমি আপনার স্বাস্থ্য সহায়ক। আমি জনআরোগ্যে সহজে নেভিগেট করতে আপনাকে সাহায্য করার জন্য এখানে আছি। আজ আপনি কী করতে চান?"
  },
  buttonText: {
    en: "Ask AI Assistant",
    hi: "AI सहायक से पूछें",
    pa: "AI ਸਹਾਇਕ ਤੋਂ ਪੁੱਛੋ",
    bn: "AI সহায়ক জিজ্ঞাসা করুন"
  },
  listening: {
    en: "I'm listening... Please speak clearly",
    hi: "मैं सुन रहा हूं... कृपया स्पष्ट रूप से बोलें",
    pa: "ਮੈਂ ਸੁਣ ਰਿਹਾ ਹਾਂ... ਕਿਰਪਾ ਕਰਕੇ ਸਪਸ਼ਟ ਬੋਲੋ",
    bn: "আমি শুনছি... দয়া করে স্পষ্ট করে বলুন"
  },
  cantHear: {
    en: "I couldn't hear you clearly. Please try again or touch the microphone.",
    hi: "मैं आपको स्पष্ट रूप से नहीं सुन सका। कृपया फिर से कोशिश करें या माइक्रोফोन को स्पर्श करें।",
    pa: "ਮੈਂ ਤੁਹਾਨੂੰ ਸਪਸ਼ਟ ਨਹੀਂ ਸੁਣ ਸਕਿਆ। ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ ਜਾਂ ਮਾਈਕ੍ਰੋਫੋਨ ਨੂੰ ਛੂਹੋ।",
    bn: "আমি আপনাকে স্পষ্ট শুনতে পাইনি। দয়া করে আবার চেষ্টা করুন বা মাইক্রোফোন স্পর্শ করুন।"
  },
  aiPowered: {
    en: "AI-Powered Healthcare Assistant",
    hi: "AI संचালित स्वास्थ्य सहायক", 
    pa: "AI ਸੰਚਾਲਿਤ ਸਿਹਤ ਸਹਾਇਕ",
    bn: "AI চালিত স্বাস্থ্য সহায়ক"
  },
  healthAdvice: {
    en: "I can help with symptoms, medicines, and health guidance. What's your health concern?",
    hi: "मैं लक्षण, दवाइयों और स्वास्थ्य मार्गदर्शन में मदद कर सकता हूं। आपकी स्वास्थ्य चिंता क्या है?",
    pa: "ਮੈਂ ਲੱਛਣਾਂ, ਦਵਾਈਆਂ ਅਤੇ ਸਿਹਤ ਮਾਰਗਦਰਸ਼ਨ ਵਿੱਚ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ। ਤੁਹਾਡੀ ਸਿਹਤ ਚਿੰਤਾ ਕੀ ਹੈ?",
    bn: "আমি লক্ষণ, ওষুধ এবং স্বাস্থ্য নির্দেশনায় সাহায্য করতে পারি। আপনার স্বাস্থ্য উদ্বেগ কী?"
  },
  offlineMode: {
    en: "Working offline. Voice assistant available with limited features.",
    hi: "ऑफलाइन काम कर रहा है। सीमित सुविधाओं के साथ आवाज़ सहायक उपलब्ध है।",
    pa: "ਔਫਲਾਈਨ ਕੰਮ ਕਰ ਰਿਹਾ ਹੈ। ਸੀਮਤ ਸੁਵਿਧਾਵਾਂ ਦੇ ਨਾਲ ਆਵਾਜ਼ ਸਹਾਇਕ ਉਪਲਬਧ ਹੈ।",
    bn: "অফলাইন কাজ করছে। সীমিত বৈশিষ্ট্য সহ ভয়েস সহায়ক উপলব্ধ।"
  }
};

const pageContent: { [K in Page]: { [L in Language]: string } } = {
  home: {
    en: "You're on the main page. I can help you book a token, check health features, or go to emergency services. What would you like to do?",
    hi: "आप मुख्य पृष्ठ पर हैं। मैं आपको टोकन बुक करने, स्वास्थ्य सुविधाओं की जांच करने, या आपातकालीन सेवाओं पर जाने में मदद कर सकता हूं। आप क्या करना चाहते हैं?",
    pa: "ਤੁਸੀਂ ਮੁੱਖ ਪੰਨੇ 'ਤੇ ਹੋ। ਮੈਂ ਤੁਹਾਨੂੰ ਟੋਕਨ ਬੁੱਕ ਕਰਨ, ਸਿਹਤ ਸੁਵਿਧਾਵਾਂ ਦੀ ਜਾਂਚ ਕਰਨ, ਜਾਂ ਐਮਰਜੈਂਸੀ ਸੇਵਾਵਾਂ 'ਤੇ ਜਾਣ ਵਿੱਚ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ। ਤੁਸੀਂ ਕੀ ਕਰਨਾ ਚਾਹੁੰਦੇ ਹੋ?",
    bn: "আপনি মূল পৃষ্ঠায় আছেন। আমি আপনাকে টোকেন বুক করতে, স্বাস্থ্য বৈশিষ্ট্য পরীক্ষা করতে, বা জরুরি পরিষেবায় যেতে সাহায্য করতে পারি। আপনি কী করতে চান?"
  },
  patient: {
    en: "You're in the patient portal. Here you can book tokens, manage your family's health, check medicines, or call for emergency help. What do you need?",
    hi: "आप रोगी पोर्टल में हैं। यहां आप टोकन बुक कर सकते हैं, अपने परिवार के स्वास्थ्य का प्रबंधन कर सकते हैं, दवाओं की जांच कर सकते हैं, या आपातकालीन सहायता के लिए कॉल कर सकते हैं। आपको क्या चाहिए?",
    pa: "ਤੁਸੀਂ ਮਰੀਜ਼ ਪੋਰਟਲ ਵਿੱਚ ਹੋ। ਇੱਥੇ ਤੁਸੀਂ ਟੋਕਨ ਬੁੱਕ ਕਰ ਸਕਦੇ ਹੋ, ਆਪਣੇ ਪਰਿਵਾਰ ਦੀ ਸਿਹਤ ਦਾ ਪ੍ਰਬੰਧਨ ਕਰ ਸਕਦੇ ਹੋ, ਦਵਾਈਆਂ ਦੀ ਜਾਂਚ ਕਰ ਸਕਦੇ ਹੋ, ਜਾਂ ਐਮਰਜੈਂਸੀ ਮਦਦ ਲਈ ਕਾਲ ਕਰ ਸਕਦੇ ਹੋ। ਤੁਹਾਨੂੰ ਕੀ ਚਾਹੀਦਾ ਹੈ?",
    bn: "আপনি রোগী পোর্টালে আছেন। এখানে আপনি টোকেন বুক করতে, আপনার পরিবারের স্বাস্থ্য পরিচালনা করতে, ওষুধ পরীক্ষা করতে, বা জরুরি সাহায্যের জন্য কল করতে পারেন। আপনার কী প্রয়োজন?"
  },
  doctor: {
    en: "You're in the doctor portal. Here doctors can see patients, create prescriptions, and manage medical records. How can I help you navigate?",
    hi: "आप डॉक्टर पोर्टल में हैं। यहां डॉक्टर मरीजों को देख सकते हैं, नुस्खे बना सकते हैं, और चिकित्सा रिकॉर्ड का प्रबंधन कर सकते हैं। मैं आपको नेविगेट करने में कैसे मदद कर सकता हूं?",
    pa: "ਤੁਸੀਂ ਡਾਕਟਰ ਪੋਰਟਲ ਵਿੱਚ ਹੋ। ਇੱਥੇ ਡਾਕਟਰ ਮਰੀਜ਼ਾਂ ਨੂੰ ਦੇਖ ਸਕਦੇ ਹਨ, ਨੁਸਖੇ ਬਣਾ ਸਕਦੇ ਹਨ, ਅਤੇ ਮੈਡੀਕਲ ਰਿਕਾਰਡਾਂ ਦਾ ਪ੍ਰਬੰਧਨ ਕਰ ਸਕਦੇ ਹਨ। ਮੈਂ ਤੁਹਾਨੂੰ ਨੈਵੀਗੇਟ ਕਰਨ ਵਿੱਚ ਕਿਵੇਂ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ?",
    bn: "আপনি ডাক্তার পোর্টালে আছেন। এখানে ডাক্তাররা রোগী দেখতে, প্রেসক্রিপশন তৈরি করতে এবং চিকিৎসা রেকর্ড পরিচালনা করতে পারেন। আমি আপনাকে নেভিগেট করতে কীভাবে সাহায্য করতে পারি?"
  },
  emergency: {
    en: "You're in emergency mode! I can help you call for immediate help, find the nearest hospital, or contact emergency services. What emergency assistance do you need?",
    hi: "आप आपातकालीन मोड में हैं! मैं आपको तत्काल सहायता के लिए कॉल करने, निकटतम अस्पताल खोजने, या आपातकालीन सेवाओं से संपर्क करने में मदद कर सकता हूं। आपको किस आपातकालीन सहायता की आवश्यकता है?",
    pa: "ਤੁਸੀਂ ਐਮਰਜੈਂਸੀ ਮੋਡ ਵਿੱਚ ਹੋ! ਮੈਂ ਤੁਹਾਨੂੰ ਤੁਰੰਤ ਮਦਦ ਲਈ ਕਾਲ ਕਰਨ, ਨੇੜਲਾ ਹਸਪਤਾਲ ਲੱਭਣ, ਜਾਂ ਐਮਰਜੈਂਸੀ ਸੇਵਾਵਾਂ ਨਾਲ ਸੰਪਰਕ ਕਰਨ ਵਿੱਚ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ। ਤੁਹਾਨੂੰ ਕਿਸ ਐਮਰਜੈਂਸੀ ਸਹਾਇਤਾ ਦੀ ਲੋੜ ਹੈ?",
    bn: "আপনি জরুরি মোডে আছেন! আমি আপনাকে তাৎক্ষণিক সাহায্যের জন্য কল করতে, নিকটতম হাসপাতাল খুঁজে পেতে, বা জরুরি পরিষেবার সাথে যোগাযোগ করতে সাহায্য করতে পারি। আপনার কোন জরুরি সহায়তা প্রয়োজন?"
  },
  'health-worker': {
    en: "You're in the health worker portal. Here you can manage patients, complete daily tasks, access training, and track incentives. What would you like to do?",
    hi: "आप स्वास्थ्य कार्यकर्ता पोर्टल में हैं। यहां आप मरीजों का प्रबंधन कर सकते हैं, दैनिक कार्य पूरे कर सकते हैं, प्रशिक्षण प्राप्त कर सकते हैं, और प्रोत्साहन ट्रैक कर सकते हैं। आप क्या करना चाहते हैं?",
    pa: "ਤੁਸੀਂ ਸਿਹਤ ਕਰਮਚਾਰੀ ਪੋਰਟਲ ਵਿੱਚ ਹੋ। ਇੱਥੇ ਤੁਸੀਂ ਮਰੀਜ਼ਾਂ ਦਾ ਪ੍ਰਬੰਧਨ ਕਰ ਸਕਦੇ ਹੋ, ਰੋਜ਼ਾਨਾ ਕੰਮ ਪੂਰੇ ਕਰ ਸਕਦੇ ਹੋ, ਸਿਖਲਾਈ ਪ੍ਰਾਪਤ ਕਰ ਸਕਦੇ ਹੋ, ਅਤੇ ਪ੍ਰੋਤਸਾਹਨ ਟਰੈਕ ਕਰ ਸਕਦੇ ਹੋ। ਤੁਸੀਂ ਕੀ ਕਰਨਾ ਚਾਹੁੰਦੇ ਹੋ?",
    bn: "আপনি স্বাস্থ্য কর্মী পোর্টালে আছেন। এখানে আপনি রোগীদের পরিচালনা করতে, দৈনিক কাজ সম্পন্ন করতে, প্রশিক্ষণ অ্যাক্সেস করতে এবং প্রণোদনা ট্র্যাক করতে পারেন। আপনি কী করতে চান?"
  },
  pharmacy: {
    en: "You're in the pharmacy portal. Here you can scan prescriptions, check medicine stock, and manage inventory. How can I assist you?",
    hi: "आप फार्मेसी पोर्टल में हैं। यहां आप नुस्खे स्कैन कर सकते हैं, दवाओं के स्टॉक की जांच कर सकते हैं, और इन्वेंटरी का प्रबंधन कर सकते हैं। मैं आपकी कैसे सहायता कर सकता हूं?",
    pa: "ਤੁਸੀਂ ਫਾਰਮੇਸੀ ਪੋਰਟਲ ਵਿੱਚ ਹੋ। ਇੱਥੇ ਤੁਸੀਂ ਨੁਸਖੇ ਸਕੈਨ ਕਰ ਸਕਦੇ ਹੋ, ਦਵਾਈਆਂ ਦਾ ਸਟਾਕ ਚੈੱਕ ਕਰ ਸਕਦੇ ਹੋ, ਅਤੇ ਇਨਵੇਂਟਰੀ ਦਾ ਪ੍ਰਬੰਧਨ ਕਰ ਸਕਦੇ ਹੋ। ਮੈਂ ਤੁਹਾਡੀ ਕਿਵੇਂ ਸਹਾਇਤਾ ਕਰ ਸਕਦਾ ਹਾਂ?",
    bn: "আপনি ফার্মেসি পোর্টালে আছেন। এখানে আপনি প্রেসক্রিপশন স্ক্যান করতে, ওষুধের স্টক পরীক্ষা করতে এবং ইনভেন্টরি পরিচালনা করতে পারেন। আমি আপনাকে কীভাবে সাহায্য করতে পারি?"
  },
  admin: {
    en: "You're in the admin dashboard. Here you can view analytics, manage health workers, monitor village health, and track supplies. What would you like to access?",
    hi: "आप एडमिन डैशबोर्ड में हैं। यहां आप विश्लेषण देख सकते हैं, स्वास्थ्य कार्यकर्ताओं का प्रबंधन कर सकते हैं, गांव के स्वास्थ्य की निगरानी कर सकते हैं, और आपूर्ति ट्रैक कर सकते हैं। आप क्या एक्सेस करना चाहते हैं?",
    pa: "ਤੁਸੀਂ ਐਡਮਿਨ ਡੈਸ਼ਬੋਰਡ ਵਿੱਚ ਹੋ। ਇੱਥੇ ਤੁਸੀਂ ਵਿਸ਼ਲੇਸ਼ਣ ਦੇਖ ਸਕਦੇ ਹੋ, ਸਿਹਤ ਕਰਮਚਾਰੀਆਂ ਦਾ ਪ੍ਰਬੰਧਨ ਕਰ ਸਕਦੇ ਹੋ, ਪਿੰਡ ਦੀ ਸਿਹਤ ਦੀ ਨਿਗਰਾਨੀ ਕਰ ਸਕਦੇ ਹੋ, ਅਤੇ ਸਪਲਾਈ ਟਰੈਕ ਕਰ ਸਕਦੇ ਹੋ। ਤੁਸੀਂ ਕੀ ਐਕਸੈਸ ਕਰਨਾ ਚਾਹੁੰਦੇ ਹੋ?",
    bn: "আপনি অ্যাডমিন ড্যাশবোর্ডে আছেন। এখানে আপনি বিশ্লেষণ দেখতে, স্বাস্থ্য কর্মীদের পরিচালনা করতে, গ্রামের স্বাস্থ্য নিরীক্ষণ করতে এবং সরবরাহ ট্র্যাক করতে পারেন। আপনি কী অ্যাক্সেস করতে চান?"
  },
  about: {
    en: "You're on the about page. Here you can learn about JanArogya and our mission to improve rural healthcare. Would you like me to explain any features?",
    hi: "आप परिचय पृष्ठ पर हैं। यहां आप जनआरोग्य के बारे में और ग्रामीण स्वास्थ्य सेवा में सुधार के हमारे मिशन के बारे में जान सकते हैं। क्या आप चाहते हैं कि मैं कोई विशेषता समझाऊं?",
    pa: "ਤੁਸੀਂ ਸਾਡੇ ਬਾਰੇ ਵਾਲੇ ਪੰਨੇ 'ਤੇ ਹੋ। ਇੱਥੇ ਤੁਸੀਂ ਜਨਆਰੋਗਿਆ ਬਾਰੇ ਅਤੇ ਪੇਂਡੂ ਸਿਹਤ ਸੇਵਾ ਨੂੰ ਬਿਹਤਰ ਬਣਾਉਣ ਦੇ ਸਾਡੇ ਮਿਸ਼ਨ ਬਾਰੇ ਜਾਣ ਸਕਦੇ ਹੋ। ਕੀ ਤੁਸੀਂ ਚਾਹੁੰਦੇ ਹੋ ਕਿ ਮੈਂ ਕੋਈ ਵਿਸ਼ੇਸ਼ਤਾ ਸਮਝਾਵਾਂ?",
    bn: "আপনি সম্পর্কে পৃষ্ঠায় আছেন। এখানে আপনি জনআরোগ্য সম্পর্কে এবং গ্রামীণ স্বাস্থ্যসেবা উন্নতির আমাদের মিশন সম্পর্কে জানতে পারেন। আপনি কি চান যে আমি কোনো বৈশিষ্ট্য ব্যাখ্যা করি?"
  },
  features: {
    en: "You're viewing our features page. Here you can learn about voice navigation, emergency SOS, QR prescriptions, and family health management. What interests you most?",
    hi: "आप हमारे फीचर्स पृष्ठ देख रहे हैं। यहां आप आवाज़ नेविगेशन, आपातकालीन SOS, QR नुस्खे, और पारिवारिक स्वास्थ्य प्रबंधन के बारे में जान सकते हैं। आपको सबसे अधिक क्या दिलचस्पी है?",
    pa: "ਤੁਸੀਂ ਸਾਡੇ ਫੀਚਰਸ ਪੰਨੇ ਨੂੰ ਦੇਖ ਰਹੇ ਹੋ। ਇੱਥੇ ਤੁਸੀਂ ਵੌਇਸ ਨੈਵੀਗੇਸ਼ਨ, ਐਮਰਜੈਂਸੀ SOS, QR ਨੁਸਖੇ, ਅਤੇ ਪਰਿਵਾਰਕ ਸਿਹਤ ਪ੍ਰਬੰਧਨ ਬਾਰੇ ਜਾਣ ਸਕਦੇ ਹੋ। ਤੁਹਾਨੂੰ ਸਭ ਤੋਂ ਵੱਧ ਕੀ ਦਿਲਚਸਪੀ ਹੈ?",
    bn: "আপনি আমাদের বৈশিষ্ট্য পৃষ্ঠা দেখছেন। এখানে আপনি ভয়েস নেভিগেশন, জরুরি SOS, QR প্রেসক্রিপশন এবং পারিবারিক স্বাস্থ্য ব্যবস্থাপনা সম্পর্কে জানতে পারেন। আপনার সবচেয়ে বেশি আগ্রহ কী?"
  },
  contact: {
    en: "You're on the contact page. Here you can find ways to reach us, report issues, or get support. How can we help you today?",
    hi: "आप संपर्क पृष्ঠ पর हैं। यहां आप हमसे संपर्क करने, समस्याओं की रिपोर्ট करने, या सहायता प्राप्त करने के तरीके पा सकते हैं। आज हम आपकी कैसे मदद कर सकते हैं?",
    pa: "ਤੁਸੀਂ ਸੰਪਰਕ ਪੰਨੇ 'ਤੇ ਹੋ। ਇੱਥੇ ਤੁਸੀਂ ਸਾਡੇ ਨਾਲ ਸੰਪਰਕ ਕਰਨ, ਸਮੱਸਿਆਵਾਂ ਦੀ ਰਿਪੋਰਟ ਕਰਨ, ਜਾਂ ਸਹਾਇਤਾ ਪ੍ਰਾਪਤ ਕਰਨ ਦੇ ਤਰੀਕੇ ਲੱਭ ਸਕਦੇ ਹੋ। ਅੱਜ ਅਸੀਂ ਤੁਹਾਡੀ ਕਿਵੇਂ ਮਦਦ ਕਰ ਸਕਦੇ ਹਾਂ?",
    bn: "আপনি যোগাযোগ পৃষ্ঠায় আছেন। এখানে আপনি আমাদের কাছে পৌঁছানোর, সমস্যা রিপোর্ট করার বা সাহায্য পাওয়ার উপায় খুঁজে পেতে পারেন। আজ আমরা আপনাকে কীভাবে সাহায্য করতে পারি?"
  }
};

export function AIVoiceAssistant({ language, currentPage, onNavigate }: AIVoiceAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [lastResponse, setLastResponse] = useState('');
  const [conversationHistory, setConversationHistory] = useState<Array<{role: 'user' | 'assistant', content: string, timestamp: Date}>>([]);
  const [isOffline, setIsOffline] = useState(typeof navigator !== 'undefined' ? !navigator.onLine : false);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Listen for online/offline changes
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      // Stop any current speech
      speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Set language based on current language
      switch (language) {
        case 'hi':
          utterance.lang = 'hi-IN';
          break;
        case 'pa':
          utterance.lang = 'pa-IN';
          break;
        case 'bn':
          utterance.lang = 'bn-IN';
          break;
        default:
          utterance.lang = 'en-US';
      }
      
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 1;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      synthRef.current = utterance;
      speechSynthesis.speak(utterance);
    }
  };

  const startListening = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      
      // Set language for speech recognition
      switch (language) {
        case 'hi':
          recognition.lang = 'hi-IN';
          break;
        case 'pa':
          recognition.lang = 'pa-IN';
          break;
        case 'bn':
          recognition.lang = 'bn-IN';
          break;
        default:
          recognition.lang = 'en-US';
      }

      recognition.onstart = () => {
        setIsListening(true);
        speak(content.listening[language]);
      };

      recognition.onresult = async (event: any) => {
        const speechResult = event.results[0][0].transcript;
        setTranscript(speechResult);
        await processVoiceCommand(speechResult);
      };

      recognition.onerror = (event: any) => {
        console.log('Speech recognition error:', event.error);
        setIsListening(false);
        speak(content.cantHear[language]);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    }
  };

  // Enhanced AI Processing with OpenAI integration
  const getAIResponse = async (userQuery: string): Promise<string> => {
    try {
      setIsThinking(true);
      
      // Healthcare context and system prompt in multiple languages
      const systemPrompts = {
        en: `You are JanArogya AI, a helpful healthcare assistant for rural India. You help with navigation, health queries, and medical guidance. Current page: ${currentPage}. Keep responses brief and helpful. You can help with: navigation, booking tokens, health advice, emergency assistance, medicine queries, and family health management.`,
        hi: `आप जनआरोग्य AI हैं, भारत के ग्रामीण क्षेत्रों के लिए एक सहायक स्वास्थ्य सहायक। आप नेविगेशन, स्वास्थ्य प्रश्नों और चिकित्सा मार्गदर्शन में मदद करते हैं। वर्तमान पृष्ठ: ${currentPage}। संक्षिप्त और सहायक उत्तर दें।`,
        pa: `ਤੁਸੀਂ ਜਨਆਰੋਗਿਆ AI ਹੋ, ਭਾਰਤ ਦੇ ਪੇਂਡੂ ਇਲਾਕਿਆਂ ਲਈ ਇੱਕ ਸਹਾਇਕ ਸਿਹਤ ਸਹਾਇਕ। ਤੁਸੀਂ ਨੈਵੀਗੇਸ਼ਨ, ਸਿਹਤ ਸਵਾਲਾਂ ਅਤੇ ਮੈਡੀਕਲ ਗਾਈਡੈਂਸ ਵਿੱਚ ਮਦਦ ਕਰਦੇ ਹੋ। ਮੌਜੂਦਾ ਪੰਨਾ: ${currentPage}।`,
        bn: `আপনি জনআরোগ্য AI, ভারতের গ্রামীণ এলাকার জন্য একজন সহায়ক স্বাস্থ্য সহায়ক। আপনি নেভিগেশন, স্বাস্থ্য প্রশ্ন এবং চিকিৎসা নির্দেশনায় সাহায্য করেন। বর্তমান পৃষ্ঠা: ${currentPage}।`
      };

      // If offline, use local processing
      if (isOffline) {
        return processOfflineQuery(userQuery);
      }

      // Prepare conversation context
      const messages = [
        { role: 'system', content: systemPrompts[language] },
        ...conversationHistory.slice(-6).map(h => ({ role: h.role, content: h.content })), // Last 6 messages for context
        { role: 'user', content: userQuery }
      ];

      // Call Gemini API
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-54854473/api/gemini-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({
          messages,
          language,
          currentPage,
          userQuery
        })
      });

      if (!response.ok) {
        console.error('Gemini API response not ok:', await response.text());
        throw new Error('AI service unavailable');
      }

      const data = await response.json();
      return data.response;

    } catch (error) {
      console.error('AI processing error:', error);
      return processOfflineQuery(userQuery);
    } finally {
      setIsThinking(false);
    }
  };

  // Offline fallback processing
  const processOfflineQuery = (command: string): string => {
    const lowerCommand = command.toLowerCase();
    
    // Health-related keywords in multiple languages
    const healthKeywords = {
      symptoms: ['symptoms', 'लक्षण', 'ਲੱਛਣ', 'লক্ষণ', 'fever', 'बुखार', 'ਬੁਖਾਰ', 'জ্বর', 'pain', 'दर्द', 'ਦਰਦ', 'ব্যথা'],
      medicine: ['medicine', 'दवा', 'ਦਵਾਈ', 'ওষুধ', 'tablet', 'गोली', 'ਗੋਲੀ', 'ট্যাবলেট'],
      emergency: ['emergency', 'आपातकाल', 'ਐਮਰਜੈਂਸੀ', 'জরুরি', 'help', 'मदद', 'ਮਦਦ', 'সাহায্য'],
      appointment: ['appointment', 'अपॉइंटमेंट', 'ਮੁਲਾਕਾਤ', 'অ্যাপয়েন্টমেন্ট', 'token', 'टोकन', 'ਟੋਕਨ', 'টোকেন']
    };

    // Check for health-related queries
    if (healthKeywords.symptoms.some(keyword => lowerCommand.includes(keyword))) {
      const responses = {
        en: "I can help you with symptom checking. Please describe your symptoms, and I'll guide you to the right care. For serious symptoms, please use our emergency services.",
        hi: "मैं आपके लक्षणों की जांच में मदद कर सकता हूं। कृपया अपने लक्षण बताएं, और मैं आपको सही देखभाल के लिए मार्गदर्शन दूंगा। गंभीर लक्षणों के लिए, कृपया हमारी आपातकालीन सेवाओं का उपयोग करें।",
        pa: "ਮੈਂ ਤੁਹਾਡੇ ਲੱਛਣਾਂ ਦੀ ਜਾਂਚ ਵਿੱਚ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ। ਕਿਰਪਾ ਕਰਕੇ ਆਪਣੇ ਲੱਛਣ ਦੱਸੋ, ਅਤੇ ਮੈਂ ਤੁਹਾਨੂੰ ਸਹੀ ਦੇਖਭਾਲ ਲਈ ਮਾਰਗਦਰਸ਼ਨ ਦੇਵਾਂਗਾ।",
        bn: "আমি আপনার লক্ষণ পরীক্ষায় সাহায্য করতে পারি। দয়া করে আপনার লক্ষণগুলি বর্ণনা করুন, এবং আমি আপনাকে সঠিক চিকিৎসার জন্য গাইড করব।"
      };
      return responses[language];
    }

    // Navigation commands (existing logic)
    if (lowerCommand.includes('home') || lowerCommand.includes('होम') || lowerCommand.includes('ਘਰ') || lowerCommand.includes('হোম')) {
      onNavigate('home');
      return language === 'hi' ? 'होम पेज पर जा रहे हैं' : language === 'pa' ? 'ਘਰ ਪੰਨੇ ਤੇ ਜਾ ਰਹੇ ਹਾਂ' : language === 'bn' ? 'হোম পেজে যাচ্ছি' : 'Going to home page';
    } else if (lowerCommand.includes('patient') || lowerCommand.includes('मरीज') || lowerCommand.includes('ਮਰੀਜ਼') || lowerCommand.includes('রোগী')) {
      onNavigate('patient');
      return language === 'hi' ? 'मरीज़ पोर्टल खोल रहे हैं' : language === 'pa' ? 'ਮਰੀਜ਼ ਪੋਰਟਲ ਖੋਲ੍ਹ ਰਹੇ ਹਾਂ' : language === 'bn' ? 'রোগী পোর্টাল খুলছি' : 'Opening patient portal';
    } else if (lowerCommand.includes('doctor') || lowerCommand.includes('डॉक्टर') || lowerCommand.includes('ਡਾਕਟਰ') || lowerCommand.includes('ডাক্তার')) {
      onNavigate('doctor');
      return language === 'hi' ? 'डॉक्टर पोर्टल खोल रहे हैं' : language === 'pa' ? 'ਡਾਕਟਰ ਪੋਰਟਲ ਖੋਲ੍ਹ ਰਹੇ ਹਾਂ' : language === 'bn' ? 'ডাক্তার পোর্টাল খুলছি' : 'Opening doctor portal';
    } else if (lowerCommand.includes('emergency') || lowerCommand.includes('आपातकाल') || lowerCommand.includes('ਐਮਰਜੈਂਸੀ') || lowerCommand.includes('জরুরি')) {
      onNavigate('emergency');
      return language === 'hi' ? 'आपातकालीन सेवा खोल रहे हैं' : language === 'pa' ? 'ਐਮਰਜੈਂਸੀ ਸੇਵਾ ਖੋਲ੍ਹ ਰਹੇ ਹਾਂ' : language === 'bn' ? 'জরুরি সেবা খুলছি' : 'Opening emergency services';
    } else if (lowerCommand.includes('pharmacy') || lowerCommand.includes('फार्मेसी') || lowerCommand.includes('ਫਾਰਮੇਸੀ') || lowerCommand.includes('ফার্মেসি')) {
      onNavigate('pharmacy');
      return language === 'hi' ? 'फार्मेसी पोर्टल खोल रहे हैं' : language === 'pa' ? 'ਫਾਰਮੇਸੀ ਪੋਰਟਲ ਖੋਲ੍ਹ ਰਹੇ ਹਾਂ' : language === 'bn' ? 'ফার্মেসি পোর্টাল খুলছি' : 'Opening pharmacy portal';
    } else if (lowerCommand.includes('features') || lowerCommand.includes('सुविधाएं') || lowerCommand.includes('ਸੁਵਿਧਾਵਾਂ') || lowerCommand.includes('বৈশিষ্ট্য')) {
      onNavigate('features');
      return language === 'hi' ? 'फीचर्स पेज खोल रहे हैं' : language === 'pa' ? 'ਫੀਚਰਸ ਪੰਨਾ ਖੋਲ੍ਹ ਰਹੇ ਹਾਂ' : language === 'bn' ? 'বৈশিষ্ট্য পৃষ্ঠা খুলছি' : 'Opening features page';
    } else if (lowerCommand.includes('help') || lowerCommand.includes('मदद') || lowerCommand.includes('ਮਦਦ') || lowerCommand.includes('সাহায্য')) {
      return pageContent[currentPage][language];
    } else {
      // Enhanced fallback responses
      const responses = {
        en: "I'm here to help with your health needs. You can ask me about symptoms, book appointments, find medicines, or navigate the app. What would you like to do?",
        hi: "मैं आपकी स्वास्थ्य आवश्यकताओं में मदद के लिए यहां हूं। आप मुझसे लक्षणों के बारे में पूछ सकते हैं, अपॉइंटमेंट बुक कर सकते हैं, दवाइयां ढूंढ सकते हैं, या ऐप नेविगेट कर सकते हैं। आप क्या करना चाहते हैं?",
        pa: "ਮੈਂ ਤੁਹਾਡੀਆਂ ਸਿਹਤ ਲੋੜਾਂ ਵਿੱਚ ਮਦਦ ਲਈ ਇੱਥੇ ਹਾਂ। ਤੁਸੀਂ ਮੈਨੂੰ ਲੱਛਣਾਂ ਬਾਰੇ ਪੁੱਛ ਸਕਦੇ ਹੋ, ਮੁਲਾਕਾਤ ਬੁੱਕ ਕਰ ਸਕਦੇ ਹੋ, ਦਵਾਈਆਂ ਲੱਭ ਸਕਦੇ ਹੋ, ਜਾਂ ਐਪ ਨੈਵੀਗੇਟ ਕਰ ਸਕਦੇ ਹੋ। ਤੁਸੀਂ ਕੀ ਕਰਨਾ ਚਾਹੁੰਦੇ ਹੋ?",
        bn: "আমি আপনার স্বাস্থ্য প্রয়োজনে সাহায্যের জন্য এখানে আছি। আপনি আমাকে লক্ষণ সম্পর্কে জিজ্ঞাসা করতে, অ্যাপয়েন্টমেন্ট বুক করতে, ওষুধ খুঁজতে বা অ্যাপ নেভিগেট করতে পারেন। আপনি কী করতে চান?"
      };
      return responses[language];
    }
  };

  const processVoiceCommand = async (command: string) => {
    // Add user message to conversation history
    setConversationHistory(prev => [...prev, {
      role: 'user',
      content: command,
      timestamp: new Date()
    }]);

    // Get AI response
    const response = await getAIResponse(command);
    setLastResponse(response);

    // Add assistant response to conversation history
    setConversationHistory(prev => [...prev, {
      role: 'assistant',
      content: response,
      timestamp: new Date()
    }]);

    // Speak the response
    speak(response);
  };

  const handleAssistantClick = () => {
    if (!isOpen) {
      setIsOpen(true);
      // Welcome message with contextual help
      let welcomeMessage = content.greeting[language] + " " + pageContent[currentPage][language];
      
      // Add offline notice if needed
      if (isOffline) {
        welcomeMessage = content.offlineMode[language] + " " + welcomeMessage;
      }
      
      speak(welcomeMessage);
    } else {
      if (isListening) {
        // Stop listening
        if (recognitionRef.current) {
          recognitionRef.current.stop();
        }
        setIsListening(false);
      } else if (isSpeaking) {
        // Stop speaking
        speechSynthesis.cancel();
        setIsSpeaking(false);
      } else {
        // Start listening
        startListening();
      }
    }
  };

  const closeAssistant = () => {
    setIsOpen(false);
    speechSynthesis.cancel();
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
    setIsSpeaking(false);
    setTranscript('');
  };

  return (
    <>
      {/* Main AI Assistant Button - Large and prominent */}
      <div className="fixed bottom-6 left-6 z-50">
        <div className="relative">
          <button
            onClick={handleAssistantClick}
            className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 
                     text-white rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300
                     flex items-center justify-center w-20 h-20 md:w-24 md:h-24
                     border-4 border-white animate-pulse hover:animate-none"
            style={{ backgroundColor: '#2EB086' }}
          >
            <Bot className="w-10 h-10 md:w-12 md:h-12" />
          </button>
          
          {/* Offline Indicator */}
          {isOffline && (
            <div className="absolute -top-2 -right-2 bg-orange-500 text-white rounded-full p-1">
              <WifiOff className="w-4 h-4" />
            </div>
          )}
        </div>
        
        {/* Button Label */}
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 
                      bg-emerald-800 text-white px-3 py-1 rounded-full text-sm whitespace-nowrap
                      opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {content.buttonText[language]}
        </div>
      </div>

      {/* Assistant Dialog */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 relative">
            {/* Close Button */}
            <button
              onClick={closeAssistant}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              ✕
            </button>

            {/* Assistant Header */}
            <div className="text-center mb-6">
              <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full w-20 h-20 mx-auto mb-4 
                           flex items-center justify-center transform hover:scale-105 transition-transform">
                <Bot className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-emerald-800 mb-2">JanArogya AI</h3>
              <p className="text-gray-600 text-sm mb-1">
                {content.aiPowered[language]}
              </p>
              <p className="text-gray-500 text-xs">
                {isOffline ? 
                  (language === 'hi' ? 'ऑफलाइन मोड' : 
                   language === 'pa' ? 'ਔਫਲਾਈਨ ਮੋਡ' :
                   language === 'bn' ? 'অফলাইন মোড' :
                   'Offline Mode') :
                  (language === 'hi' ? 'Google Gemini द्वारा संचालित' : 
                   language === 'pa' ? 'Google Gemini ਦੁਆਰਾ ਸੰਚਾਲਿਤ' :
                   language === 'bn' ? 'Google Gemini দ্বারা চালিত' :
                   'Powered by Google Gemini')
                }
              </p>
            </div>

            {/* Status Indicator */}
            <div className="bg-gray-50 rounded-2xl p-4 mb-6">
              <div className="flex items-center justify-center space-x-3">
                {isListening ? (
                  <>
                    <Mic className="w-6 h-6 text-red-500 animate-pulse" />
                    <span className="text-sm font-medium text-red-600">
                      {content.listening[language]}
                    </span>
                  </>
                ) : isThinking ? (
                  <>
                    <Brain className="w-6 h-6 text-blue-500" />
                    <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                    <span className="text-sm font-medium text-blue-600">
                      {language === 'hi' ? 'AI सोच रहा है...' : 
                       language === 'pa' ? 'AI ਸੋਚ ਰਿਹਾ ਹੈ...' :
                       language === 'bn' ? 'AI ভাবছে...' :
                       'AI thinking...'}
                    </span>
                  </>
                ) : isSpeaking ? (
                  <>
                    <Volume2 className="w-6 h-6 text-emerald-500 animate-bounce" />
                    <span className="text-sm font-medium text-emerald-600">
                      {language === 'hi' ? 'बोल रहा है...' : 
                       language === 'pa' ? 'ਬੋਲ ਰਿਹਾ ਹੈ...' :
                       language === 'bn' ? 'বলছি...' :
                       'Speaking...'}
                    </span>
                  </>
                ) : (
                  <>
                    <Bot className="w-6 h-6 text-emerald-500" />
                    <span className="text-sm font-medium text-emerald-600">
                      {language === 'hi' ? 'सुनने के लिए तैयार' : 
                       language === 'pa' ? 'ਸੁਣਨ ਲਈ ਤਿਆਰ' :
                       language === 'bn' ? 'শোনার জন্য প্রস্তুত' :
                       'Ready to listen'}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Conversation Display */}
            <div className="max-h-32 overflow-y-auto mb-4 space-y-2">
              {transcript && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-xs text-blue-600 font-medium">
                      {language === 'hi' ? 'आप:' : language === 'pa' ? 'ਤੁਸੀਂ:' : language === 'bn' ? 'আপনি:' : 'You:'}
                    </span>
                  </div>
                  <p className="text-sm text-blue-800">"{transcript}"</p>
                </div>
              )}
              
              {lastResponse && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3">
                  <div className="flex items-center space-x-2 mb-1">
                    <Bot className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs text-emerald-600 font-medium">JanArogya AI:</span>
                  </div>
                  <p className="text-sm text-emerald-800">{lastResponse}</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={startListening}
                disabled={isListening || isSpeaking || isThinking}
                className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-300 
                         text-white rounded-xl py-4 px-4 flex items-center justify-center space-x-2
                         transition-colors duration-200 text-lg font-medium"
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                <span className="text-sm">
                  {isListening 
                    ? (language === 'hi' ? 'रुकें' : language === 'pa' ? 'ਰੁਕੋ' : language === 'bn' ? 'থামুন' : 'Stop')
                    : (language === 'hi' ? 'बोलें' : language === 'pa' ? 'ਬੋਲੋ' : language === 'bn' ? 'বলুন' : 'Speak')
                  }
                </span>
              </button>
              
              <button
                onClick={() => {
                  if (isSpeaking) {
                    speechSynthesis.cancel();
                  } else {
                    speak(content.healthAdvice[language]);
                  }
                }}
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl py-4 px-4 
                         flex items-center justify-center space-x-2 transition-colors duration-200 text-lg font-medium"
              >
                {isSpeaking ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                <span className="text-sm">
                  {language === 'hi' ? 'स्वास्थ्य सलाह' : language === 'pa' ? 'ਸਿਹਤ ਸਲਾਹ' : language === 'bn' ? 'স্বাস্থ্য পরামর্শ' : 'Health Help'}
                </span>
              </button>
            </div>

            {/* Quick Commands */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center mb-2">
                {language === 'hi' ? 'कुछ कहें जैसे:' : 
                 language === 'pa' ? 'ਕੁਝ ਕਹੋ ਜਿਵੇਂ:' :
                 language === 'bn' ? 'কিছু বলুন যেমন:' :
                 'Try saying:'}
              </p>
              <div className="flex flex-wrap gap-1 justify-center">
                {language === 'hi' ? 
                  ['सिरदर्द है', 'दवा कहाँ मिलेगी', 'डॉक्टर से मिलना', 'आपातकाल'].map((cmd) => (
                    <span key={cmd} className="bg-gray-100 text-gray-600 px-2 py-1 rounded-lg text-xs">{cmd}</span>
                  )) :
                 language === 'pa' ?
                  ['ਸਿਰ ਦੁਖਦਾ ਹੈ', 'ਦਵਾਈ ਕਿੱਥੇ ਮਿਲੇਗੀ', 'ਡਾਕਟਰ ਨਾਲ ਮਿਲਣਾ', 'ਐਮਰਜੈਂਸੀ'].map((cmd) => (
                    <span key={cmd} className="bg-gray-100 text-gray-600 px-2 py-1 rounded-lg text-xs">{cmd}</span>
                  )) :
                 language === 'bn' ?
                  ['মাথা ব্যথা', 'ওষুধ কোথায় পাবো', 'ডাক্তার দেখাতে', 'জরুরি'].map((cmd) => (
                    <span key={cmd} className="bg-gray-100 text-gray-600 px-2 py-1 rounded-lg text-xs">{cmd}</span>
                  )) :
                  ['I have headache', 'Book appointment', 'Find medicine', 'Emergency help'].map((cmd) => (
                    <span key={cmd} className="bg-gray-100 text-gray-600 px-2 py-1 rounded-lg text-xs">{cmd}</span>
                  ))
                }
              </div>
              
              {/* AI Status Indicator */}
              <div className="flex items-center justify-center mt-3 space-x-2">
                <Brain className="w-3 h-3 text-emerald-500" />
                <span className="text-xs text-emerald-600">
                  {isOffline ? 
                    (language === 'hi' ? 'स्थानीय AI सक्रिय' : 
                     language === 'pa' ? 'ਸਥਾਨਕ AI ਸਰਗਰਮ' :
                     language === 'bn' ? 'স্থানীয় AI সক্রিয়' :
                     'Local AI Active') :
                    (language === 'hi' ? 'Gemini AI सक्रिय' : 
                     language === 'pa' ? 'Gemini AI ਸਰਗਰਮ' :
                     language === 'bn' ? 'Gemini AI সক্রিয়' :
                     'Gemini AI Active')
                  }
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}