import React from 'react';
import { Heart, Target, Users, Award, Globe, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ImageWithFallback } from './figma/ImageWithFallback';

type Language = 'en' | 'hi' | 'pa' | 'bn';

interface AboutPageProps {
  language: Language;
}

const translations = {
  en: {
    hero: {
      title: 'About JanArogya',
      subtitle: 'Bridging the healthcare gap in rural India through technology',
    },
    vision: {
      title: 'Our Vision',
      content: 'To make quality healthcare accessible to every village in India through innovative technology solutions that break down barriers of distance, language, and literacy.'
    },
    mission: {
      title: 'Our Mission',
      content: 'Connecting rural communities with healthcare professionals through voice-first, offline-capable technology that works for everyone, regardless of their digital literacy.'
    },
    problem: {
      title: 'The Problem We Solve',
      stats: {
        stat1: '68% of India lives in rural areas',
        stat2: 'Only 1 doctor per 10,000 people in rural areas',
        stat3: '80% of specialists practice in urban centers',
        stat4: 'Limited access to emergency care'
      },
      challenges: [
        'Shortage of healthcare professionals in rural areas',
        'Language barriers in medical communication',
        'Limited internet connectivity and digital literacy',
        'Lack of proper medicine supply chain',
        'Delayed emergency response systems',
        'Inadequate health record management'
      ]
    },
    story: {
      title: 'Our Story',
      content: 'JanArogya was born from a simple observation: millions of people in rural India struggle to access basic healthcare not because solutions don\'t exist, but because they\'re not designed for their reality. Our team of doctors, engineers, and rural development experts came together to create a platform that works for everyone - from a grandmother in a remote village to a busy doctor in the city.'
    },
    team: {
      title: 'Our Team',
      members: [
        {
          name: 'Dr. Priya Sharma',
          role: 'Founder & Chief Medical Officer',
          background: 'AIIMS graduate with 15 years in rural healthcare'
        },
        {
          name: 'Raj Patel',
          role: 'Co-founder & CTO',
          background: 'Former Google engineer, AI/ML specialist'
        },
        {
          name: 'Meera Singh',
          role: 'Head of Rural Outreach',
          background: '20 years with NGOs in rural development'
        },
        {
          name: 'Dr. Suresh Kumar',
          role: 'Chief Innovation Officer',
          background: 'Telemedicine pioneer, WHO consultant'
        }
      ]
    },
    partners: {
      title: 'Our Partners',
      govt: 'Government Partners',
      medical: 'Medical Institutions',
      tech: 'Technology Partners',
      ngo: 'NGO Partners'
    },
    values: {
      title: 'Our Values',
      accessibility: {
        title: 'Accessibility First',
        desc: 'Technology that works for everyone, regardless of literacy or language'
      },
      privacy: {
        title: 'Privacy & Security',
        desc: 'Protecting patient data with blockchain and encryption'
      },
      community: {
        title: 'Community Driven',
        desc: 'Built with and for rural communities, not imposed from outside'
      },
      innovation: {
        title: 'Continuous Innovation',
        desc: 'Always improving to serve our users better'
      }
    }
  },
  hi: {
    hero: {
      title: 'जनआरोग्य के बारे में',
      subtitle: 'तकनीक के माध्यम से ग्रामीण भारत में स्वास्थ्य सेवा की खाई को पाटना',
    },
    vision: {
      title: 'हमारी दृष्टि',
      content: 'नवाचार तकनीकी समाधानों के माध्यम से भारत के हर गाँव में गुणवत्तापूर्ण स्वास्थ्य सेवा को सुलभ बनाना जो दूरी, भाषा और साक्षरता की बाधाओं को तोड़ते हैं।'
    },
    mission: {
      title: 'हमारा मिशन',
      content: 'आवाज़-प्राथमिकता, ऑफलाइन-सक्षम तकनीक के माध्यम से ग्रामीण समुदायों को स्वास्थ्य पेशेवरों से जोड़ना जो सभी के लिए काम करती है, उनकी डिजिटल साक्षरता की परवाह किए बिना।'
    },
    problem: {
      title: 'हम जो समस्या हल करते हैं',
      stats: {
        stat1: 'भारत की 68% जनसंख्या ग्रामीण क्षेत्रों में रहती है',
        stat2: 'ग्रामीण क्षेत्रों में प्रति 10,000 लोगों पर केवल 1 डॉक्टर',
        stat3: '80% विशेषज्ञ शहरी केंद्रों में प्रैक्टिस करते हैं',
        stat4: 'आपातकालीन देखभाल तक सीमित पहुंच'
      },
      challenges: [
        'ग्रामीण क्षेत्रों में स्वास्थ्य पेशेवरों की कमी',
        'चिकित्सा संचार में भाषा की बाधाएं',
        'सीमित इंटरनेट कनेक्टिविटी और डिजिटल साक्षरता',
        'उचित दवा आपूर्ति श्रृंखला की कमी',
        'विलंबित आपातकालीन प्रतिक्रिया प्रणाली',
        'अपर्याप्त स्वास्थ्य रिकॉर्ड प्रबंधन'
      ]
    }
  }
};

export function AboutPage({ language }: AboutPageProps) {
  const t = translations[language] || translations.en;

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

      {/* Vision & Mission */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Card className="border-l-4 border-l-emerald-600">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl">
                  <Target className="mr-3 h-6 w-6 text-emerald-600" />
                  {t.vision.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 leading-relaxed">
                  {t.vision.content}
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-blue-600">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl">
                  <Heart className="mr-3 h-6 w-6 text-blue-600" />
                  {t.mission.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 leading-relaxed">
                  {t.mission.content}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl text-slate-900 text-center mb-16">
            {t.problem.title}
          </h2>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <div className="bg-red-50 p-6 rounded-lg text-center">
              <div className="text-2xl text-red-600 mb-2">68%</div>
              <div className="text-sm text-slate-600">{t.problem.stats.stat1}</div>
            </div>
            <div className="bg-orange-50 p-6 rounded-lg text-center">
              <div className="text-2xl text-orange-600 mb-2">1:10,000</div>
              <div className="text-sm text-slate-600">{t.problem.stats.stat2}</div>
            </div>
            <div className="bg-yellow-50 p-6 rounded-lg text-center">
              <div className="text-2xl text-yellow-600 mb-2">80%</div>
              <div className="text-sm text-slate-600">{t.problem.stats.stat3}</div>
            </div>
            <div className="bg-red-50 p-6 rounded-lg text-center">
              <div className="text-2xl text-red-600 mb-2">⚠️</div>
              <div className="text-sm text-slate-600">{t.problem.stats.stat4}</div>
            </div>
          </div>

          {/* Challenges */}
          {language === 'en' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {t.problem.challenges.map((challenge, index) => (
                <Card key={index} className="bg-white">
                  <CardContent className="p-6">
                    <p className="text-slate-700">{challenge}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Our Story */}
      {language === 'en' && (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl lg:text-4xl text-slate-900 mb-6">
                  {t.story.title}
                </h2>
                <p className="text-lg text-slate-600 leading-relaxed">
                  {t.story.content}
                </p>
              </div>
              <div>
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1659353888906-adb3e0041693?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBoZWFsdGhjYXJlJTIwdGVhbSUyMG1lZGljYWwlMjBwcm9mZXNzaW9uYWxzfGVufDF8fHx8MTc1ODY5ODk0Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Healthcare team in India"
                  className="rounded-lg shadow-lg w-full"
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Team */}
      {language === 'en' && (
        <section className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl lg:text-4xl text-slate-900 text-center mb-16">
              {t.team.title}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {t.team.members.map((member, index) => (
                <Card key={index} className="text-center">
                  <CardHeader>
                    <div className="w-20 h-20 bg-emerald-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <Users className="h-10 w-10 text-emerald-600" />
                    </div>
                    <CardTitle className="text-lg">{member.name}</CardTitle>
                    <p className="text-emerald-600">{member.role}</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-600">{member.background}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Values */}
      {language === 'en' && (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl lg:text-4xl text-slate-900 text-center mb-16">
              {t.values.title}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card>
                <CardHeader className="text-center">
                  <Globe className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <CardTitle>{t.values.accessibility.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-slate-600">{t.values.accessibility.desc}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="text-center">
                  <Shield className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <CardTitle>{t.values.privacy.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-slate-600">{t.values.privacy.desc}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="text-center">
                  <Users className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                  <CardTitle>{t.values.community.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-slate-600">{t.values.community.desc}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="text-center">
                  <Award className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                  <CardTitle>{t.values.innovation.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-slate-600">{t.values.innovation.desc}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}