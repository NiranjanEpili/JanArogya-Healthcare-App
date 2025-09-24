import React from 'react';
import { Heart, Phone, Mail, MapPin } from 'lucide-react';

type Language = 'en' | 'hi' | 'pa' | 'bn';
type Page = 'home' | 'about' | 'features' | 'patient' | 'health-worker' | 'doctor' | 'pharmacy' | 'admin' | 'contact' | 'emergency';

interface FooterProps {
  language: Language;
  onNavigate: (page: Page) => void;
}

const translations = {
  en: {
    quickLinks: 'Quick Links',
    privacy: 'Privacy Policy',
    terms: 'Terms & Conditions',
    help: 'Help Center',
    partners: 'Our Partners',
    contact: 'Contact Information',
    phone: 'Emergency Helpline',
    email: 'Email Support',
    address: 'Office Address',
    copyright: '© 2024 JanArogya. Connecting rural India to healthcare.',
    slogan: 'Healthcare Access for Every Village'
  },
  hi: {
    quickLinks: 'त्वरित लिंक',
    privacy: 'गोपनीयता नीति',
    terms: 'नियम और शर्तें',
    help: 'सहायता केंद्र',
    partners: 'हमारे साझीदार',
    contact: 'संपर्क जानकारी',
    phone: 'आपातकालीन हेल्पलाइन',
    email: 'ईमेल सहायता',
    address: 'कार्यालय का पता',
    copyright: '© 2024 जनआरोग्य। ग्रामीण भारत को स्वास्थ्य सेवा से जोड़ना।',
    slogan: 'हर गाँव के लिए स्वास्थ्य सेवा पहुँच'
  },
  pa: {
    quickLinks: 'ਤੁਰੰਤ ਲਿੰਕ',
    privacy: 'ਗੁਪਤਤਾ ਨੀਤੀ',
    terms: 'ਨਿਯਮ ਅਤੇ ਸ਼ਰਤਾਂ',
    help: 'ਸਹਾਇਤਾ ਕੇਂਦਰ',
    partners: 'ਸਾਡੇ ਸਾਥੀ',
    contact: 'ਸੰਪਰਕ ਜਾਣਕਾਰੀ',
    phone: 'ਐਮਰਜੈਂਸੀ ਹੈਲਪਲਾਈਨ',
    email: 'ਈਮੇਲ ਸਹਾਇਤਾ',
    address: 'ਦਫਤਰ ਦਾ ਪਤਾ',
    copyright: '© 2024 ਜਨਆਰੋਗਿਆ। ਪੇਂਡੂ ਭਾਰਤ ਨੂੰ ਸਿਹਤ ਸੇਵਾ ਨਾਲ ਜੋੜਨਾ।',
    slogan: 'ਹਰ ਪਿੰਡ ਲਈ ਸਿਹਤ ਸੇਵਾ ਪਹੁੰਚ'
  },
  bn: {
    quickLinks: 'দ্রুত লিঙ্ক',
    privacy: 'গোপনীয়তা নীতি',
    terms: 'নিয়ম ও শর্তাবলী',
    help: 'সহায়তা কেন্দ্র',
    partners: 'আমাদের অংশীদার',
    contact: 'যোগাযোগের তথ্য',
    phone: 'জরুরী হেল্পলাইন',
    email: 'ইমেইল সহায়তা',
    address: 'অফিসের ঠিকানা',
    copyright: '© 2024 জনআরোগ্য। গ্রামীণ ভারতকে স্বাস্থ্যসেবার সাথে সংযুক্ত করা।',
    slogan: 'প্রতিটি গ্রামের জন্য স্বাস্থ্যসেবা অ্যাক্সেস'
  }
};

export function Footer({ language, onNavigate }: FooterProps) {
  const t = translations[language];

  const partnerLogos = [
    { name: 'Ministry of Health', type: 'govt' },
    { name: 'AIIMS', type: 'medical' },
    { name: 'WHO India', type: 'ngo' },
    { name: 'Digital India', type: 'govt' },
    { name: 'UNICEF', type: 'ngo' },
    { name: 'Tata Trusts', type: 'ngo' }
  ];

  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand & Slogan */}
          <div className="col-span-1 lg:col-span-1">
            <div className="flex items-center mb-4">
              <Heart className="h-8 w-8 text-emerald-400 mr-2" />
              <span className="text-2xl tracking-tight">JanArogya</span>
            </div>
            <p className="text-slate-300 mb-4">
              {t.slogan}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4">{t.quickLinks}</h3>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => onNavigate('about')}
                  className="text-slate-300 hover:text-white transition-colors"
                >
                  {t.privacy}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('about')}
                  className="text-slate-300 hover:text-white transition-colors"
                >
                  {t.terms}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('contact')}
                  className="text-slate-300 hover:text-white transition-colors"
                >
                  {t.help}
                </button>
              </li>
            </ul>
          </div>

          {/* Partners */}
          <div>
            <h3 className="mb-4">{t.partners}</h3>
            <div className="grid grid-cols-2 gap-2">
              {partnerLogos.map((partner, index) => (
                <div 
                  key={index}
                  className="bg-slate-800 rounded p-2 text-center text-xs text-slate-300"
                >
                  {partner.name}
                </div>
              ))}
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="mb-4">{t.contact}</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <Phone className="h-4 w-4 text-emerald-400 mr-2" />
                <div>
                  <div className="text-sm text-slate-300">{t.phone}</div>
                  <div className="text-white">1800-123-JANA</div>
                </div>
              </div>
              <div className="flex items-center">
                <Mail className="h-4 w-4 text-emerald-400 mr-2" />
                <div>
                  <div className="text-sm text-slate-300">{t.email}</div>
                  <div className="text-white">help@janarogya.in</div>
                </div>
              </div>
              <div className="flex items-start">
                <MapPin className="h-4 w-4 text-emerald-400 mr-2 mt-1" />
                <div>
                  <div className="text-sm text-slate-300">{t.address}</div>
                  <div className="text-white text-sm">
                    Technology Center, New Delhi<br />
                    India - 110001
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 mt-8 pt-8 text-center">
          <p className="text-slate-400">
            {t.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}