import React, { useState, useEffect } from 'react';
import { 
  Mic, 
  Users, 
  Clock, 
  AlertTriangle, 
  Package, 
  TrendingUp, 
  Shield,
  ArrowRight,
  Play,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { ImageWithFallback } from './figma/ImageWithFallback';

type Page = 'home' | 'about' | 'features' | 'patient' | 'health-worker' | 'doctor' | 'pharmacy' | 'admin' | 'contact' | 'emergency';
type Language = 'en' | 'hi' | 'pa' | 'bn';

interface LandingPageProps {
  onNavigate: (page: Page) => void;
  language: Language;
}

const translations = {
  en: {
    hero: {
      headline: 'Healthcare Access for Every Village',
      subtext: 'One-stop telemedicine platform connecting rural India to quality healthcare through voice-first technology',
      cta: 'Start Voice Navigation',
      watch: 'Watch Demo'
    },
    features: {
      title: 'Core Features',
      subtitle: 'Empowering rural healthcare with technology',
      voice: {
        title: 'Voice-Only Navigation',
        desc: 'Navigate the entire app using voice commands in local languages'
      },
      queue: {
        title: 'Smart Queue Management',
        desc: 'AI-powered patient queuing system for efficient healthcare delivery'
      },
      emergency: {
        title: 'Emergency SOS',
        desc: 'Instant emergency alerts with GPS location, works offline'
      },
      locker: {
        title: 'Digital Medicine Locker',
        desc: 'QR-code based prescription management and verification'
      },
      supply: {
        title: 'Predictive Medicine Supply',
        desc: 'AI predicts medicine demand to prevent stockouts'
      },
      outbreak: {
        title: 'Disease Outbreak Warning',
        desc: 'Early warning system for disease outbreaks in villages'
      }
    },
    impact: {
      title: 'Our Impact',
      villages: 'Villages Covered',
      patients: 'Patients Served',
      doctors: 'Doctors Onboard',
      villagesCount: '2,500+',
      patientsCount: '150,000+',
      doctorsCount: '5,000+'
    },
    testimonials: {
      title: 'What People Say',
      testimonial1: {
        text: 'JanArogya saved my mother\'s life. The voice navigation made it easy for her to get help.',
        name: 'Priya Sharma',
        location: 'Village Kamalpur, Bihar'
      },
      testimonial2: {
        text: 'As a health worker, this app helps me serve my community better with proper training.',
        name: 'Dr. Rajesh Kumar',
        location: 'PHC Jhansi, UP'
      },
      testimonial3: {
        text: 'The medicine tracking system has eliminated stockouts in our pharmacy.',
        name: 'Meera Patel',
        location: 'Community Pharmacy, Gujarat'
      }
    },
    cta: {
      title: 'Join the Healthcare Revolution',
      subtitle: 'Choose your role and start making a difference',
      patient: 'Join as Patient',
      healthWorker: 'Join as Health Worker',
      doctor: 'Join as Doctor'
    }
  },
  hi: {
    hero: {
      headline: 'हर गाँव के लिए स्वास्थ्य सेवा पहुँच',
      subtext: 'आवाज़-प्राथमिकता तकनीक के माध्यम से ग्रामीण भारत को गुणवत्तापूर्ण स्वास्थ्य सेवा से जोड़ने वाला एक-स्टॉप टेलीमेडिसिन प्लेटफॉर्म',
      cta: 'आवाज़ नेवीगेशन शुरू करें',
      watch: 'डेमो देखें'
    },
    features: {
      title: 'मुख्य सुविधाएं',
      subtitle: 'तकनीक के साथ ग्रामीण स्वास्थ्य सेवा को सशक्त बनाना',
      voice: {
        title: 'केवल आवाज़ नेवीगेशन',
        desc: 'स्थानीय भाषाओं में आवाज़ कमांड का उपयोग करके पूरे ऐप को नेविगेट करें'
      },
      queue: {
        title: 'स्मार्ट कतार प्रबंधन',
        desc: 'कुशल स्वास्थ्य सेवा वितरण के लिए AI-संचालित रोगी कतार प्रणाली'
      },
      emergency: {
        title: 'आपातकालीन SOS',
        desc: 'GPS स्थान के साथ तत्काल आपातकालीन अलर्ट, ऑफलाइन काम करता है'
      },
      locker: {
        title: 'डिजिटल दवा लॉकर',
        desc: 'QR-कोड आधारित नुस्खा प्रबंधन और सत्यापन'
      },
      supply: {
        title: 'भविष्यसूचक दवा आपूर्ति',
        desc: 'AI स्टॉकआउट को रोकने के लिए दवा की मांग की भविष्यवाणी करता है'
      },
      outbreak: {
        title: 'रोग प्रकोप चेतावनी',
        desc: 'गांवों में रोग प्रकोप के लिए प्रारंभिक चेतावनी प्रणाली'
      }
    },
    impact: {
      title: 'हमारा प्रभाव',
      villages: 'कवर किए गए गांव',
      patients: 'सेवा प्राप्त मरीज',
      doctors: 'ऑनबोर्ड डॉक्टर',
      villagesCount: '2,500+',
      patientsCount: '1,50,000+',
      doctorsCount: '5,000+'
    },
    testimonials: {
      title: 'लोग क्या कहते हैं',
      testimonial1: {
        text: 'जनआरोग्य ने मेरी माँ की जान बचाई। आवाज़ नेवीगेशन ने उनके लिए मदद लेना आसान बना दिया।',
        name: 'प्रिया शर्मा',
        location: 'गाँव कमलपुर, बिहार'
      },
      testimonial2: {
        text: 'एक स्वास्थ्य कार्यकर्ता के रूप में, यह ऐप मुझे उचित प्रशिक्षण के साथ अपने समुदाय की बेहतर सेवा करने में मदद करता है।',
        name: 'डॉ. राजेश कुमार',
        location: 'PHC झांसी, UP'
      },
      testimonial3: {
        text: 'दवा ट्रैकिंग सिस्टम ने हमारी फार्मेसी में स्टॉकआउट को समाप्त कर दिया है।',
        name: 'मीरा पटेल',
        location: 'सामुदायिक फार्मेसी, गुजरात'
      }
    },
    cta: {
      title: 'स्वास्थ्य क्रांति में शामिल हों',
      subtitle: 'अपनी भूमिका चुनें और बदलाव लाना शुरू करें',
      patient: 'मरीज़ के रूप में जुड़ें',
      healthWorker: 'स्वास्थ्य कार्यकर्ता के रूप में जुड़ें',
      doctor: 'डॉक्टर के रूप में जुड़ें'
    }
  }
};

export function LandingPage({ onNavigate, language }: LandingPageProps) {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const t = translations[language] || translations.en;

  const features = [
    {
      icon: Mic,
      title: t.features.voice.title,
      description: t.features.voice.desc,
      color: 'text-blue-600 bg-blue-100'
    },
    {
      icon: Clock,
      title: t.features.queue.title,
      description: t.features.queue.desc,
      color: 'text-green-600 bg-green-100'
    },
    {
      icon: AlertTriangle,
      title: t.features.emergency.title,
      description: t.features.emergency.desc,
      color: 'text-red-600 bg-red-100'
    },
    {
      icon: Package,
      title: t.features.locker.title,
      description: t.features.locker.desc,
      color: 'text-purple-600 bg-purple-100'
    },
    {
      icon: TrendingUp,
      title: t.features.supply.title,
      description: t.features.supply.desc,
      color: 'text-orange-600 bg-orange-100'
    },
    {
      icon: Shield,
      title: t.features.outbreak.title,
      description: t.features.outbreak.desc,
      color: 'text-emerald-600 bg-emerald-100'
    }
  ];

  const testimonials = [
    t.testimonials.testimonial1,
    t.testimonials.testimonial2,
    t.testimonials.testimonial3
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const startVoiceNavigation = () => {
    setIsVoiceActive(true);
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(
        language === 'hi' 
          ? 'जनआरोग्य में आपका स्वागत है। आप क्या करना चाहते हैं?' 
          : 'Welcome to JanArogya. What would you like to do?'
      );
      utterance.lang = language === 'hi' ? 'hi-IN' : 'en-US';
      speechSynthesis.speak(utterance);
    }
    
    setTimeout(() => setIsVoiceActive(false), 3000);
  };

  // Safe translation helper
  const safeT = (textObj: any): string => {
    if (!textObj) return '';
    if (typeof textObj === 'string') return textObj;
    if (typeof textObj === 'object') {
      return textObj[language] || textObj.en || Object.values(textObj)[0] || '';
    }
    return String(textObj || '');
  };

  const texts = {
    title: {
      en: 'Digital Healthcare for Rural India',
      hi: 'ग्रामीण भारत के लिए डिजिटल स्वास्थ्य सेवा',
      pa: 'ਪੇਂਡੂ ਭਾਰਤ ਲਈ ਡਿਜੀਟਲ ਸਿਹਤ ਸੇਵਾ',
      bn: 'গ্রামীণ ভারতের জন্য ডিজিটাল স্বাস্থ্যসেবা'
    },
    subtitle: {
      en: 'Voice-first healthcare platform with offline capabilities',
      hi: 'ऑफलाइन क्षमताओं के साथ आवाज-केंद्रित स्वास्थ्य सेवा मंच',
      pa: 'ਆਫਲਾਈਨ ਸਮਰੱਥਾਵਾਂ ਨਾਲ ਆਵਾਜ਼-ਪਹਿਲਾਂ ਸਿਹਤ ਪਲੈਟਫਾਰਮ',
      bn: 'অফলাইন সুবিধা সহ ভয়েস-প্রথম স্বাস্থ্যসেবা প্ল্যাটফর্ম'
    },
    getStarted: {
      en: 'Get Started',
      hi: 'शुरू करें',
      pa: 'ਸ਼ੁਰੂ ਕਰੋ',
      bn: 'শুরু করুন'
    },
    emergency: {
      en: 'Emergency SOS',
      hi: 'आपातकालीन SOS',
      pa: 'ਐਮਰਜੈਂਸੀ SOS',
      bn: 'জরুরি SOS'
    },
    features: {
      en: 'Key Features',
      hi: 'मुख्य विशेषताएं',
      pa: 'ਮੁੱਖ ਵਿਸ਼ੇਸ਼ਤਾਵਾਂ',
      bn: 'মূল বৈশিষ্ট্য'
    }
  };

  const featuresList = [
    {
      icon: '🎤',
      title: {
        en: 'Voice Navigation',
        hi: 'आवाज़ नेवीगेशन',
        pa: 'ਆਵਾਜ਼ ਨੈਵੀਗੇਸ਼ਨ',
        bn: 'ভয়েস নেভিগেশন'
      },
      desc: {
        en: 'Navigate with voice commands in local languages',
        hi: 'स्थानीय भाषाओं में आवाज़ के आदेशों से नेवीगेट करें',
        pa: 'ਸਥਾਨਕ ਭਾਸ਼ਾਵਾਂ ਵਿੱਚ ਆਵਾਜ਼ ਕਮਾਂਡਾਂ ਨਾਲ ਨੈਵੀਗੇਟ ਕਰੋ',
        bn: 'স্থানীয় ভাষায় ভয়েস কমান্ড দিয়ে নেভিগেট করুন'
      }
    },
    {
      icon: '📱',
      title: {
        en: 'Offline Mode',
        hi: 'ऑफलाइन মোড',
        pa: 'ਆਫਲਾਈਨ ਮੋਡ',
        bn: 'অফলাইন মোড'
      },
      desc: {
        en: 'Works without internet connection',
        hi: 'इंटरनेट कनेक्शन के बिना काम करता है',
        pa: 'ਇੰਟਰਨੈੱਟ ਕਨੈਕਸ਼ਨ ਤੋਂ ਬਿਨਾਂ ਕੰਮ ਕਰਦਾ ਹੈ',
        bn: 'ইন্টারনেট সংযোগ ছাড়াই কাজ করে'
      }
    },
    {
      icon: '🏥',
      title: {
        en: 'Health Records',
        hi: 'स्वास्थ्य रिਕॉर्ड',
        pa: 'ਸਿਹਤ ਰਿਕਾਰਡ',
        bn: 'স্বাস্থ্য রেকর্ড'
      },
      desc: {
        en: 'Digital health records and history',
        hi: 'डिजिटल स्वास्थ्य रिकॉर्ड और इतिहास',
        pa: 'ਡਿਜੀਟਲ ਸਿਹਤ ਰਿਕਾਰਡ ਅਤੇ ਇਤਿਹਾਸ',
        bn: 'ডিজিটাল স্বাস্থ্য রেকর্ড এবং ইতিহাস'
      }
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-50 to-blue-50 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div>
              <h1 className="text-4xl lg:text-6xl text-slate-900 mb-6 leading-tight">
                {t.hero.headline}
              </h1>
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                {t.hero.subtext}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  onClick={startVoiceNavigation}
                  className={`bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 text-lg flex items-center ${
                    isVoiceActive ? 'animate-pulse' : ''
                  }`}
                >
                  <Mic className="mr-2 h-5 w-5" />
                  {t.hero.cta}
                </Button>
                
                <Button
                  variant="outline"
                  size="lg"
                  className="px-8 py-4 text-lg flex items-center"
                >
                  <Play className="mr-2 h-5 w-5" />
                  {t.hero.watch}
                </Button>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1659353887977-c310d90c751a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxydXJhbCUyMGhlYWx0aGNhcmUlMjBkb2N0b3IlMjBwYXRpZW50JTIwdGVsZW1lZGljaW5lfGVufDF8fHx8MTc1ODY5ODkzOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Rural healthcare telemedicine"
                className="rounded-lg shadow-2xl w-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl text-slate-900 mb-4">
              {t.features.title}
            </h2>
            <p className="text-xl text-slate-600">
              {t.features.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-4`}>
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-600">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl text-slate-900 mb-4">
              {t.impact.title}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl lg:text-5xl text-emerald-600 mb-2">
                {t.impact.villagesCount}
              </div>
              <div className="text-lg text-slate-600">{t.impact.villages}</div>
            </div>
            <div className="text-center">
              <div className="text-4xl lg:text-5xl text-emerald-600 mb-2">
                {t.impact.patientsCount}
              </div>
              <div className="text-lg text-slate-600">{t.impact.patients}</div>
            </div>
            <div className="text-center">
              <div className="text-4xl lg:text-5xl text-emerald-600 mb-2">
                {t.impact.doctorsCount}
              </div>
              <div className="text-lg text-slate-600">{t.impact.doctors}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl text-slate-900 mb-4">
              {t.testimonials.title}
            </h2>
          </div>

          <div className="relative">
            <Card className="min-h-[200px] flex items-center">
              <CardContent className="text-center p-8">
                <blockquote className="text-xl text-slate-700 mb-6 italic">
                  "{testimonials[currentTestimonial].text}"
                </blockquote>
                <div>
                  <div className="text-slate-900 mb-1">
                    {testimonials[currentTestimonial].name}
                  </div>
                  <div className="text-slate-500">
                    {testimonials[currentTestimonial].location}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center items-center mt-6 space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentTestimonial((prev) => 
                  prev === 0 ? testimonials.length - 1 : prev - 1
                )}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <div className="flex space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentTestimonial ? 'bg-emerald-600' : 'bg-slate-300'
                    }`}
                  />
                ))}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentTestimonial((prev) => 
                  (prev + 1) % testimonials.length
                )}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-emerald-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl text-white mb-4">
            {t.cta.title}
          </h2>
          <p className="text-xl text-emerald-100 mb-12">
            {t.cta.subtitle}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Button
              size="lg"
              variant="secondary"
              onClick={() => onNavigate('patient')}
              className="bg-white text-emerald-600 hover:bg-slate-50 py-6 text-lg flex items-center justify-center"
            >
              <Users className="mr-2 h-5 w-5" />
              {t.cta.patient}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <Button
              size="lg"
              variant="secondary"
              onClick={() => onNavigate('health-worker')}
              className="bg-white text-emerald-600 hover:bg-slate-50 py-6 text-lg flex items-center justify-center"
            >
              <Shield className="mr-2 h-5 w-5" />
              {t.cta.healthWorker}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <Button
              size="lg"
              variant="secondary"
              onClick={() => onNavigate('doctor')}
              className="bg-white text-emerald-600 hover:bg-slate-50 py-6 text-lg flex items-center justify-center"
            >
              <Mic className="mr-2 h-5 w-5" />
              {t.cta.doctor}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* New Sections */}
      {/* Hero Section - Simplified */}
      <section className="py-20 px-4 text-center bg-gradient-to-b from-emerald-50 to-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
            {safeT(texts.title)}
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            {safeT(texts.subtitle)}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => onNavigate('patient')}
              className="px-8 py-4 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors shadow-lg"
            >
              {safeT(texts.getStarted)}
            </button>
            <button
              onClick={() => onNavigate('emergency')}
              className="px-8 py-4 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors shadow-lg"
            >
              🚨 {safeT(texts.emergency)}
            </button>
          </div>
        </div>
      </section>

      {/* Features Grid - Simplified */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            {safeT(texts.features)}
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuresList.map((feature, index) => (
              <div key={index} className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {safeT(feature.title)}
                </h3>
                <p className="text-gray-600">
                  {safeT(feature.desc)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}