import React from 'react';
import { 
  Mic, 
  Brain, 
  Users, 
  Shield, 
  Gift, 
  BookOpen, 
  Package, 
  AlertTriangle,
  Wifi,
  QrCode,
  MapPin,
  Clock
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

type Language = 'en' | 'hi' | 'pa' | 'bn';

interface FeaturesPageProps {
  language: Language;
}

const translations = {
  en: {
    hero: {
      title: 'Comprehensive Healthcare Features',
      subtitle: 'Technology solutions designed specifically for rural India\'s healthcare challenges'
    },
    categories: {
      navigation: 'Navigation & Accessibility',
      medical: 'Medical Intelligence',
      community: 'Community Features',
      emergency: 'Emergency & Safety',
      management: 'Management & Analytics'
    },
    features: {
      voice: {
        title: 'Voice-Only Navigation',
        description: 'Complete app navigation using voice commands in Hindi, English, Punjabi, and Bengali. Perfect for users with limited literacy.',
        highlights: ['Multilingual support', 'Offline voice recognition', 'Natural language processing']
      },
      triage: {
        title: 'AI Symptom Triage',
        description: 'Intelligent offline-first symptom analysis that helps prioritize patient care and provides initial medical guidance.',
        highlights: ['Works offline', 'Trained on rural health data', 'Culturally appropriate responses']
      },
      family: {
        title: 'Family Health Linkage',
        description: 'Manage health records for entire families with easy profile switching and shared medical history access.',
        highlights: ['Multi-member profiles', 'Shared prescriptions', 'Family medical history']
      },
      blockchain: {
        title: 'Blockchain Health Records',
        description: 'Secure, immutable health records that patients own and control, ensuring privacy and preventing fraud.',
        highlights: ['Patient-owned data', 'Fraud prevention', 'Cross-provider compatibility']
      },
      incentives: {
        title: 'Trusted Health Worker Incentives',
        description: 'Blockchain-based reward system for community health workers with transparent performance tracking.',
        highlights: ['Transparent rewards', 'Performance tracking', 'Community trust building']
      },
      training: {
        title: 'Offline Training Modules',
        description: 'AR-enhanced video training for health workers that works without internet connectivity.',
        highlights: ['Augmented reality guidance', 'Offline video content', 'Progressive skill building']
      },
      pharmacy: {
        title: 'Pharmacy IoT Tracker',
        description: 'Real-time medicine inventory tracking with automated alerts for low stock and expiry management.',
        highlights: ['IoT sensor integration', 'Expiry tracking', 'Automated reordering']
      },
      outbreak: {
        title: 'Disease Outbreak Alerts',
        description: 'Early warning system that detects disease patterns and alerts health authorities and communities.',
        highlights: ['Pattern recognition', 'Real-time alerts', 'Community notifications']
      },
      qr: {
        title: 'QR Prescription System',
        description: 'Secure QR-code based prescriptions that prevent fraud and ensure accurate medication dispensing.',
        highlights: ['Fraud prevention', 'Offline verification', 'Digital signatures']
      },
      gps: {
        title: 'Offline GPS Emergency',
        description: 'Emergency location tracking that stores GPS coordinates locally and syncs when connectivity returns.',
        highlights: ['Works offline', 'Automatic sync', 'Emergency contacts']
      },
      queue: {
        title: 'Smart Queue Management',
        description: 'AI-powered patient queue optimization that reduces waiting times and improves healthcare efficiency.',
        highlights: ['Wait time prediction', 'Priority scheduling', 'SMS notifications']
      },
      analytics: {
        title: 'Predictive Health Analytics',
        description: 'Machine learning models that predict medicine demand, disease outbreaks, and resource allocation needs.',
        highlights: ['Demand forecasting', 'Resource optimization', 'Trend analysis']
      }
    }
  },
  hi: {
    hero: {
      title: 'व्यापक स्वास्थ्य सुविधाएं',
      subtitle: 'ग्रामीण भारत की स्वास्थ्य चुनौतियों के लिए विशेष रूप से डिज़ाइन किए गए तकनीकी समाधान'
    },
    categories: {
      navigation: 'नेवीगेशन और पहुंच',
      medical: 'चिकित्सा बुद्धि',
      community: 'सामुदायिक सुविधाएं',
      emergency: 'आपातकाल और सुरक्षा',
      management: 'प्रबंधन और विश्लेषण'
    }
  }
};

export function FeaturesPage({ language }: FeaturesPageProps) {
  const t = translations[language] || translations.en;

  const featureCategories = [
    {
      title: t.categories.navigation,
      color: 'bg-blue-50 border-blue-200',
      features: [
        {
          icon: Mic,
          ...t.features.voice,
          color: 'text-blue-600'
        }
      ]
    },
    {
      title: t.categories.medical,
      color: 'bg-green-50 border-green-200',
      features: [
        {
          icon: Brain,
          ...t.features.triage,
          color: 'text-green-600'
        },
        {
          icon: QrCode,
          ...t.features.qr,
          color: 'text-green-600'
        }
      ]
    },
    {
      title: t.categories.community,
      color: 'bg-purple-50 border-purple-200',
      features: [
        {
          icon: Users,
          ...t.features.family,
          color: 'text-purple-600'
        },
        {
          icon: Gift,
          ...t.features.incentives,
          color: 'text-purple-600'
        },
        {
          icon: BookOpen,
          ...t.features.training,
          color: 'text-purple-600'
        }
      ]
    },
    {
      title: t.categories.emergency,
      color: 'bg-red-50 border-red-200',
      features: [
        {
          icon: AlertTriangle,
          ...t.features.outbreak,
          color: 'text-red-600'
        },
        {
          icon: MapPin,
          ...t.features.gps,
          color: 'text-red-600'
        }
      ]
    },
    {
      title: t.categories.management,
      color: 'bg-orange-50 border-orange-200',
      features: [
        {
          icon: Package,
          ...t.features.pharmacy,
          color: 'text-orange-600'
        },
        {
          icon: Clock,
          ...t.features.queue,
          color: 'text-orange-600'
        },
        {
          icon: Shield,
          ...t.features.blockchain,
          color: 'text-orange-600'
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-50 to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl text-slate-900 mb-6">
            {t.hero.title}
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            {t.hero.subtitle}
          </p>
        </div>
      </section>

      {/* Features by Category */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {featureCategories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="mb-20">
              {/* Category Header */}
              <div className={`${category.color} rounded-lg p-6 mb-8 border-2`}>
                <h2 className="text-2xl lg:text-3xl text-slate-900 text-center">
                  {category.title}
                </h2>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {category.features.map((feature, featureIndex) => (
                  <Card key={featureIndex} className="hover:shadow-lg transition-shadow duration-300">
                    <CardHeader>
                      <div className="flex items-start space-x-4">
                        <div className={`p-3 rounded-lg bg-slate-100`}>
                          <feature.icon className={`h-6 w-6 ${feature.color}`} />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                          <CardDescription className="text-slate-600 text-base leading-relaxed">
                            {feature.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    
                    {feature.highlights && (
                      <CardContent>
                        <div className="space-y-2">
                          <h4 className="text-sm text-slate-500 mb-3">Key Features:</h4>
                          <div className="flex flex-wrap gap-2">
                            {feature.highlights.map((highlight, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {highlight}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Technology Stack */}
      {language === 'en' && (
        <section className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl lg:text-4xl text-slate-900 text-center mb-16">
              Built for Rural Reality
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="text-center">
                <CardHeader>
                  <Wifi className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <CardTitle>Offline-First Design</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600">
                    Works without internet connectivity. All critical features function offline and sync when connection is available.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardHeader>
                  <Mic className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <CardTitle>Voice-First Interface</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600">
                    Designed for users with limited literacy. Complete navigation possible through voice commands in local languages.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardHeader>
                  <Shield className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                  <CardTitle>Blockchain Security</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600">
                    Patient data is secured using blockchain technology, ensuring privacy, preventing fraud, and giving patients control.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}