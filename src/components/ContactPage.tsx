import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send, Heart, Users, Building, Stethoscope } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';

type Language = 'en' | 'hi' | 'pa' | 'bn';

interface ContactPageProps {
  language: Language;
}

const translations = {
  en: {
    hero: {
      title: 'Contact JanArogya',
      subtitle: 'Get in touch with us for partnerships, support, or feedback'
    },
    form: {
      title: 'Partner with JanArogya',
      subtitle: 'Join us in revolutionizing rural healthcare',
      name: 'Full Name',
      email: 'Email Address',
      phone: 'Phone Number',
      organization: 'Organization',
      role: 'Your Role',
      partnerType: 'Partnership Type',
      message: 'Message',
      submit: 'Submit Partnership Request',
      success: 'Thank you! We will contact you within 2 business days.',
      roles: {
        doctor: 'Healthcare Provider',
        healthWorker: 'Community Health Worker',
        pharmacy: 'Pharmacy Owner',
        ngo: 'NGO Representative',
        govt: 'Government Official',
        tech: 'Technology Partner',
        other: 'Other'
      },
      partnerships: {
        medical: 'Medical Partnership',
        technology: 'Technology Integration',
        funding: 'Funding & Investment',
        distribution: 'Distribution Network',
        training: 'Training Programs',
        research: 'Research Collaboration'
      }
    },
    contact: {
      title: 'Contact Information',
      helpline: 'Emergency Helpline',
      support: 'Technical Support',
      partnerships: 'Partnerships',
      media: 'Media Inquiries',
      address: 'Head Office',
      hours: 'Operating Hours'
    },
    offices: {
      title: 'Our Offices',
      delhi: {
        city: 'New Delhi',
        address: 'Technology Center, Connaught Place, New Delhi - 110001',
        phone: '+91 11 2345 6789'
      },
      mumbai: {
        city: 'Mumbai',
        address: 'Innovation Hub, Bandra Kurla Complex, Mumbai - 400051',
        phone: '+91 22 3456 7890'
      },
      bangalore: {
        city: 'Bangalore',
        address: 'Tech Park, Electronic City, Bangalore - 560100',
        phone: '+91 80 4567 8901'
      }
    },
    faq: {
      title: 'Frequently Asked Questions',
      questions: [
        {
          q: 'How can I become a partner healthcare provider?',
          a: 'Fill out our partnership form above or contact our partnerships team. We welcome doctors, nurses, and healthcare facilities who want to serve rural communities.'
        },
        {
          q: 'Is JanArogya available in my area?',
          a: 'We are rapidly expanding across rural India. Contact us to check availability in your area or to request service expansion.'
        },
        {
          q: 'How does the emergency SOS system work?',
          a: 'Our emergency system works offline-first, storing your location and emergency contacts locally. Alerts are sent immediately when connectivity is available.'
        },
        {
          q: 'What training is provided for health workers?',
          a: 'We provide comprehensive training modules with AR-guided instructions, video content, and certification programs for community health workers.'
        }
      ]
    }
  },
  hi: {
    hero: {
      title: 'जनआरोग्य से संपर्क करें',
      subtitle: 'साझेदारी, सहायता, या प्रतिक्रिया के लिए हमसे संपर्क करें'
    },
    form: {
      title: 'जनआरोग्य के साथ साझेदारी करें',
      subtitle: 'ग्रामीण स्वास्थ्य सेवा में क्रांति लाने में हमसे जुड़ें',
      name: 'पूरा नाम',
      email: 'ईमेल पता',
      phone: 'फोन नंबर',
      organization: 'संस्था',
      role: 'आपकी भूमिका',
      partnerType: 'साझेदारी का प्रकार',
      message: 'संदेश',
      submit: 'साझेदारी अनुरोध जमा करें',
      success: 'धन्यवाद! हम 2 कार्य दिवसों में आपसे संपर्क करेंगे।'
    }
  }
};

export function ContactPage({ language }: ContactPageProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    organization: '',
    role: '',
    partnerType: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const t = translations[language] || translations.en;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Partnership Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-2xl">
                  <Heart className="h-6 w-6 mr-3 text-emerald-600" />
                  {t.form.title}
                </CardTitle>
                <CardDescription className="text-base">
                  {t.form.subtitle}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isSubmitted ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Send className="h-8 w-8 text-green-600" />
                    </div>
                    <p className="text-lg text-green-600 mb-2">Form Submitted!</p>
                    <p className="text-slate-600">{t.form.success}</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">{t.form.name}</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">{t.form.email}</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone">{t.form.phone}</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="organization">{t.form.organization}</Label>
                        <Input
                          id="organization"
                          value={formData.organization}
                          onChange={(e) => handleInputChange('organization', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="role">{t.form.role}</Label>
                        <select
                          id="role"
                          value={formData.role}
                          onChange={(e) => handleInputChange('role', e.target.value)}
                          className="w-full p-2 border border-slate-300 rounded-md"
                          required
                        >
                          <option value="">Select your role</option>
                          {language === 'en' && Object.entries(t.form.roles).map(([key, value]) => (
                            <option key={key} value={key}>{value}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="partnerType">{t.form.partnerType}</Label>
                        <select
                          id="partnerType"
                          value={formData.partnerType}
                          onChange={(e) => handleInputChange('partnerType', e.target.value)}
                          className="w-full p-2 border border-slate-300 rounded-md"
                          required
                        >
                          <option value="">Select partnership type</option>
                          {language === 'en' && Object.entries(t.form.partnerships).map(([key, value]) => (
                            <option key={key} value={key}>{value}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="message">{t.form.message}</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => handleInputChange('message', e.target.value)}
                        rows={4}
                        placeholder="Tell us about your interest in partnering with JanArogya..."
                      />
                    </div>

                    <Button type="submit" className="w-full" size="lg">
                      <Send className="h-4 w-4 mr-2" />
                      {t.form.submit}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            {/* Contact Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Phone className="h-5 w-5 mr-2 text-blue-600" />
                  {t.contact.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <div>
                    <div className="font-medium">{t.contact.helpline}</div>
                    <div className="text-lg font-bold text-red-600">1800-123-JANA</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="font-medium">{t.contact.support}</div>
                    <div className="text-slate-600">+91 11 2345 6789</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-green-600" />
                  <div>
                    <div className="font-medium">{t.contact.partnerships}</div>
                    <div className="text-slate-600">partners@janarogya.in</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-purple-600" />
                  <div>
                    <div className="font-medium">{t.contact.media}</div>
                    <div className="text-slate-600">media@janarogya.in</div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-orange-600 mt-1" />
                  <div>
                    <div className="font-medium">{t.contact.address}</div>
                    <div className="text-slate-600">
                      Technology Center<br />
                      Connaught Place<br />
                      New Delhi - 110001
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Building className="h-5 w-5 text-slate-600" />
                  <div>
                    <div className="font-medium">{t.contact.hours}</div>
                    <div className="text-slate-600">24/7 Emergency Support</div>
                    <div className="text-slate-600">Mon-Fri 9AM-6PM General Support</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Regional Offices */}
            {language === 'en' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Building className="h-5 w-5 mr-2 text-slate-600" />
                    {t.offices.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(t.offices).slice(1).map(([key, office]) => (
                    <div key={key} className="p-3 bg-slate-50 rounded-lg">
                      <div className="font-medium text-emerald-600 mb-1">{office.city}</div>
                      <div className="text-sm text-slate-600 mb-1">{office.address}</div>
                      <div className="text-sm font-mono">{office.phone}</div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="text-center p-4 hover:shadow-lg transition-shadow cursor-pointer">
                <Stethoscope className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-sm font-medium">Health Providers</div>
                <div className="text-xs text-slate-600">Join our network</div>
              </Card>
              <Card className="text-center p-4 hover:shadow-lg transition-shadow cursor-pointer">
                <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-sm font-medium">NGO Partners</div>
                <div className="text-xs text-slate-600">Collaborate with us</div>
              </Card>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        {language === 'en' && (
          <div className="mt-16">
            <h2 className="text-3xl text-slate-900 text-center mb-12">
              {t.faq.title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {t.faq.questions.map((faq, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">{faq.q}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600">{faq.a}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}