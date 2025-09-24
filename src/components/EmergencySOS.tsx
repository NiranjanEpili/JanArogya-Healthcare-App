import React, { useState, useEffect } from 'react';
import { AlertTriangle, Phone, MapPin, Clock, User, Heart, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

type Page = 'home' | 'about' | 'features' | 'patient' | 'health-worker' | 'doctor' | 'pharmacy' | 'admin' | 'contact' | 'emergency';
type Language = 'en' | 'hi' | 'pa' | 'bn';

interface EmergencySOSProps {
  onNavigate: (page: Page) => void;
  language: Language;
}

const translations = {
  en: {
    title: 'Emergency SOS',
    subtitle: 'Get immediate help in medical emergencies',
    sosButton: 'EMERGENCY SOS',
    activated: 'Emergency Alert Activated',
    sending: 'Sending Emergency Alert...',
    sent: 'Emergency Alert Sent Successfully',
    location: 'Sending your location to emergency contacts',
    contacts: 'Emergency Contacts',
    addContact: 'Add Emergency Contact',
    helpline: 'Emergency Helplines',
    status: 'Alert Status',
    cancel: 'Cancel Alert',
    nearbyServices: 'Nearby Emergency Services',
    instructions: 'Emergency Instructions',
    steps: [
      'Press the red SOS button below',
      'Your location will be shared with emergency contacts',
      'Emergency services will be notified',
      'Follow the voice instructions',
      'Stay calm and wait for help'
    ],
    offlineMode: 'Working in offline mode - alerts will be sent when connection is restored'
  },
  hi: {
    title: 'आपातकालीन SOS',
    subtitle: 'चिकित्सा आपातकाल में तत्काल सहायता प्राप्त करें',
    sosButton: 'आपातकालीन SOS',
    activated: 'आपातकालीन अलर्ट सक्रिय',
    sending: 'आपातकालीन अलर्ट भेजा जा रहा है...',
    sent: 'आपातकालीन अलर्ट सफलतापूर्वक भेजा गया',
    location: 'आपका स्थान आपातकालीन संपर्कों को भेजा जा रहा है',
    contacts: 'आपातकालीन संपर्क',
    addContact: 'आपातकालीन संपर्क जोड़ें',
    helpline: 'आपातकालीन हेल्पलाइन',
    status: 'अलर्ट स्थिति',
    cancel: 'अलर्ट रद्द करें',
    nearbyServices: 'आस-पास की आपातकालीन सेवाएं',
    instructions: 'आपातकालीन निर्देश',
    offlineMode: 'ऑफलाइन मोड में काम कर रहा है - कनेक्शन बहाल होने पर अलर्ट भेजे जाएंगे'
  }
};

export function EmergencySOS({ onNavigate, language }: EmergencySOSProps) {
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);
  const [alertStatus, setAlertStatus] = useState<'idle' | 'sending' | 'sent' | 'offline'>('idle');
  const [location, setLocation] = useState<GeolocationPosition | null>(null);
  const [countdown, setCountdown] = useState(5);
  const [isCountingDown, setIsCountingDown] = useState(false);
  
  const t = translations[language] || translations.en;

  const emergencyContacts = [
    { name: 'Raj Sharma', relation: 'Spouse', phone: '+91 98765 43210' },
    { name: 'Dr. Priya Patel', relation: 'Family Doctor', phone: '+91 87654 32109' },
    { name: 'Meera Singh', relation: 'Daughter', phone: '+91 76543 21098' }
  ];

  const helplines = [
    { name: 'National Emergency', number: '108', available: '24/7' },
    { name: 'Police', number: '100', available: '24/7' },
    { name: 'Fire Brigade', number: '101', available: '24/7' },
    { name: 'Women Helpline', number: '1091', available: '24/7' },
    { name: 'Child Helpline', number: '1098', available: '24/7' }
  ];

  const nearbyServices = [
    { name: 'District Hospital', distance: '2.3 km', phone: '+91 98123 45678', type: 'Hospital' },
    { name: 'Primary Health Center', distance: '1.8 km', phone: '+91 98234 56789', type: 'PHC' },
    { name: 'Ambulance Service', distance: '0.5 km', phone: '+91 98345 67890', type: 'Ambulance' }
  ];

  useEffect(() => {
    // Get current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => setLocation(position),
        (error) => console.log('Location error:', error)
      );
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCountingDown && countdown > 0) {
      interval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            setIsCountingDown(false);
            activateEmergency();
            return 5;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCountingDown, countdown]);

  const startCountdown = () => {
    setIsCountingDown(true);
    setCountdown(5);
    
    // Voice feedback
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(
        language === 'hi' 
          ? 'आपातकालीन अलर्ट 5 सेकंड में सक्रिय होगा। रद्द करने के लिए बटन दबाएं।'
          : 'Emergency alert will activate in 5 seconds. Press cancel to abort.'
      );
      utterance.lang = language === 'hi' ? 'hi-IN' : 'en-US';
      speechSynthesis.speak(utterance);
    }
  };

  const activateEmergency = () => {
    setIsEmergencyActive(true);
    setAlertStatus('sending');
    
    // Simulate sending alert
    setTimeout(() => {
      // Check if online
      if (navigator.onLine) {
        setAlertStatus('sent');
        // Voice confirmation
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(
            language === 'hi' 
              ? 'आपातकालीन अलर्ट भेज दिया गया है। सहायता आ रही है।'
              : 'Emergency alert has been sent. Help is on the way.'
          );
          utterance.lang = language === 'hi' ? 'hi-IN' : 'en-US';
          speechSynthesis.speak(utterance);
        }
      } else {
        setAlertStatus('offline');
      }
    }, 3000);
  };

  const cancelEmergency = () => {
    setIsEmergencyActive(false);
    setIsCountingDown(false);
    setAlertStatus('idle');
    setCountdown(5);
  };

  const getStatusColor = () => {
    switch (alertStatus) {
      case 'sending': return 'bg-yellow-100 text-yellow-800';
      case 'sent': return 'bg-green-100 text-green-800';
      case 'offline': return 'bg-orange-100 text-orange-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const getStatusText = () => {
    switch (alertStatus) {
      case 'sending': return t.sending;
      case 'sent': return t.sent;
      case 'offline': return t.offlineMode;
      default: return 'Ready';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl lg:text-4xl text-slate-900 mb-4">
            {t.title}
          </h1>
          <p className="text-lg text-slate-600">
            {t.subtitle}
          </p>
        </div>

        {/* Status Bar */}
        <Card className="mb-8">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${
                  alertStatus === 'sent' ? 'bg-green-500' :
                  alertStatus === 'sending' ? 'bg-yellow-500 animate-pulse' :
                  alertStatus === 'offline' ? 'bg-orange-500' : 'bg-slate-300'
                }`}></div>
                <span className="text-slate-700">{t.status}</span>
              </div>
              <Badge className={getStatusColor()}>
                {getStatusText()}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Main SOS Button */}
        <div className="text-center mb-12">
          {isCountingDown ? (
            <div className="space-y-4">
              <div className="text-6xl text-red-600 animate-pulse mb-4">
                {countdown}
              </div>
              <Button
                size="lg"
                variant="outline"
                onClick={cancelEmergency}
                className="px-8 py-4"
              >
                Cancel
              </Button>
            </div>
          ) : (
            <Button
              size="lg"
              onClick={startCountdown}
              disabled={isEmergencyActive}
              className={`w-48 h-48 rounded-full text-2xl ${
                isEmergencyActive
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-red-600 hover:bg-red-700'
              } text-white shadow-lg transform transition-transform hover:scale-105`}
            >
              {isEmergencyActive ? (
                <div className="flex flex-col items-center">
                  {alertStatus === 'sending' ? (
                    <Loader2 className="h-8 w-8 animate-spin mb-2" />
                  ) : (
                    <Heart className="h-8 w-8 mb-2" />
                  )}
                  <span className="text-lg">{t.activated}</span>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <AlertTriangle className="h-12 w-12 mb-4" />
                  <span>{t.sosButton}</span>
                </div>
              )}
            </Button>
          )}
        </div>

        {/* Instructions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-orange-600" />
              {t.instructions}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2">
              {t.steps.map((step, index) => (
                <li key={index} className="text-slate-700">{step}</li>
              ))}
            </ol>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Emergency Contacts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2 text-blue-600" />
                {t.contacts}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {emergencyContacts.map((contact, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                      <div className="font-medium">{contact.name}</div>
                      <div className="text-sm text-slate-600">{contact.relation}</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-mono">{contact.phone}</span>
                      <Button size="sm" variant="outline">
                        <Phone className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full">
                  {t.addContact}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Emergency Helplines */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Phone className="h-5 w-5 mr-2 text-green-600" />
                {t.helpline}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {helplines.map((helpline, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                      <div className="font-medium">{helpline.name}</div>
                      <div className="text-sm text-slate-600">{helpline.available}</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-green-600">{helpline.number}</span>
                      <Button size="sm" variant="outline">
                        <Phone className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Nearby Services */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-purple-600" />
              {t.nearbyServices}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {nearbyServices.map((service, index) => (
                <div key={index} className="p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary">{service.type}</Badge>
                    <span className="text-sm text-slate-600">{service.distance}</span>
                  </div>
                  <div className="font-medium mb-1">{service.name}</div>
                  <div className="text-sm text-slate-600 mb-3">{service.phone}</div>
                  <Button size="sm" variant="outline" className="w-full">
                    <Phone className="h-4 w-4 mr-2" />
                    Call
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {isEmergencyActive && (
          <div className="mt-8 text-center">
            <Button variant="outline" onClick={cancelEmergency}>
              {t.cancel}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}