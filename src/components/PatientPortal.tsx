import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Users, 
  Package, 
  AlertTriangle, 
  Brain, 
  FileText, 
  QrCode, 
  Download,
  WifiOff,
  Plus,
  Trash2,
  User,
  Phone,
  MapPin,
  Clock,
  Pill
} from 'lucide-react';
import { Button } from './ui/button';
import { demoOfflineManager } from '../utils/offline/demoOffline';
import { OfflineDemo } from './OfflineDemo';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';

type Page = 'home' | 'about' | 'features' | 'patient' | 'health-worker' | 'doctor' | 'pharmacy' | 'admin' | 'contact' | 'emergency';
type Language = 'en' | 'hi' | 'pa' | 'bn';

interface PatientPortalProps {
  onNavigate: (page: Page) => void;
  language: Language;
  user: any;
}

const translations = {
  en: {
    dashboard: {
      title: 'Patient Dashboard',
      welcome: 'Welcome back',
      quickActions: 'Quick Actions'
    },
    actions: {
      bookToken: 'Book Token',
      myFamily: 'My Family',
      medicineLocker: 'Medicine Locker',
      emergencySOS: 'Emergency SOS',
      symptomCheck: 'Symptom Check',
      healthRecords: 'Health Records'
    },
    family: {
      title: 'Family Health Management',
      addMember: 'Add Family Member',
      name: 'Name',
      age: 'Age',
      relation: 'Relation',
      healthId: 'Health ID',
      members: 'Family Members'
    },
    records: {
      title: 'Health Records',
      timeline: 'Medical Timeline',
      download: 'Download Records',
      shareQR: 'Share QR Code',
      prescription: 'Prescription',
      consultation: 'Consultation',
      labReport: 'Lab Report'
    },
    locker: {
      title: 'Digital Medicine Locker',
      currentMeds: 'Current Medications',
      prescriptions: 'QR Prescriptions',
      scanQR: 'Scan QR Code',
      addMedicine: 'Add Medicine'
    },
    symptom: {
      title: 'AI Symptom Checker',
      describe: 'Describe your symptoms',
      analyze: 'Analyze Symptoms',
      result: 'Analysis Result',
      recommendation: 'Recommendation',
      urgent: 'Seek immediate medical attention',
      moderate: 'Consult a doctor within 24 hours',
      mild: 'Monitor symptoms and rest'
    },
    booking: {
      title: 'Book Appointment Token',
      selectDoctor: 'Select Doctor',
      selectTime: 'Select Time Slot',
      symptoms: 'Brief symptoms description',
      book: 'Book Appointment',
      queue: 'Your Queue Position',
      estimated: 'Estimated Wait Time'
    }
  },
  hi: {
    dashboard: {
      title: 'मरीज़ डैशबोर्ड',
      welcome: 'वापसी पर स्वागत',
      quickActions: 'त्वरित कार्य'
    },
    actions: {
      bookToken: 'टोकन बुक करें',
      myFamily: 'मेरा परिवार',
      medicineLocker: 'दवा लॉकर',
      emergencySOS: 'आपातकालीन SOS',
      symptomCheck: 'लक्षण जांच',
      healthRecords: 'स्वास्थ्य रिकॉर्ड'
    }
  }
};

export function PatientPortal({ onNavigate, language, user }: PatientPortalProps) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [familyMembers, setFamilyMembers] = useState([
    { id: 1, name: 'Priya Sharma', age: 45, relation: 'Self', healthId: 'JA001234' },
    { id: 2, name: 'Raj Sharma', age: 50, relation: 'Spouse', healthId: 'JA001235' },
    { id: 3, name: 'Aarav Sharma', age: 12, relation: 'Son', healthId: 'JA001236' }
  ]);
  const [symptoms, setSymptoms] = useState('');
  const [symptomResult, setSymptomResult] = useState(null);
  const [queuePosition, setQueuePosition] = useState(null);
  const [isOffline, setIsOffline] = useState(typeof navigator !== 'undefined' ? !navigator.onLine : false);
  
  const t = translations[language] || translations.en;

  // Handle offline/online state
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

  const healthRecords = [
    {
      date: '2024-01-15',
      type: 'consultation',
      doctor: 'Dr. Rajesh Kumar',
      summary: 'Routine checkup - Blood pressure normal, advised regular exercise',
      prescription: 'Vitamin D3, Calcium tablets'
    },
    {
      date: '2024-01-10',
      type: 'prescription',
      doctor: 'Dr. Priya Patel',
      summary: 'Cold and fever treatment',
      prescription: 'Paracetamol 500mg, Cough syrup'
    },
    {
      date: '2024-01-05',
      type: 'labReport',
      doctor: 'Lab Technician',
      summary: 'Blood test - All parameters normal',
      prescription: 'No medication required'
    }
  ];

  const currentMedicines = [
    { name: 'Vitamin D3', dosage: '1000 IU', frequency: 'Daily', prescribedBy: 'Dr. Rajesh Kumar' },
    { name: 'Calcium', dosage: '500mg', frequency: '2x Daily', prescribedBy: 'Dr. Rajesh Kumar' }
  ];

  const analyzeSymptoms = async () => {
    const symptomData = {
      patientId: user?.id || 'temp-user',
      symptoms: symptoms,
      timestamp: Date.now(),
      language: language
    };

    try {
      if (isOffline) {
        // Queue for sync when online
        await demoOfflineManager.queueAction('SYMPTOM_CHECK', symptomData);
      }

      // Offline-capable AI analysis (runs locally)
      setTimeout(() => {
        let result;
        if (symptoms.toLowerCase().includes('fever') || symptoms.toLowerCase().includes('pain')) {
          result = {
            severity: 'moderate',
            recommendation: t.symptom.moderate,
            suggested: ['Rest', 'Drink fluids', 'Monitor temperature', 'Consult doctor if symptoms worsen']
          };
        } else if (symptoms.toLowerCase().includes('chest') || symptoms.toLowerCase().includes('breath')) {
          result = {
            severity: 'urgent',
            recommendation: t.symptom.urgent,
            suggested: ['Call emergency number immediately', 'Go to nearest hospital', 'Do not delay treatment']
          };
        } else {
          result = {
            severity: 'mild',
            recommendation: t.symptom.mild,
            suggested: ['Rest', 'Stay hydrated', 'Monitor symptoms for 24 hours']
          };
        }

        setSymptomResult(result);

        // Voice feedback
        if ('speechSynthesis' in window) {
          const message = isOffline ? 
            (language === 'hi' ? 
              'लक्षणों का विश्लेषण ऑफलाइन पूरा हुआ। ' + result.recommendation : 
              'Symptom analysis completed offline. ' + result.recommendation) :
            result.recommendation;
          
          const utterance = new SpeechSynthesisUtterance(message);
          utterance.lang = language === 'hi' ? 'hi-IN' : 'en-US';
          speechSynthesis.speak(utterance);
        }
      }, 2000);
    } catch (error) {
      console.error('Symptom analysis failed:', error);
    }
  };

  const bookToken = async () => {
    const tokenData = {
      patientId: user?.id || 'temp-user',
      doctor: 'Dr. Rajesh Kumar',
      date: new Date().toISOString(),
      symptoms: 'General consultation',
      timestamp: Date.now()
    };

    try {
      if (isOffline) {
        // Store offline and queue for sync
        await demoOfflineManager.queueAction('BOOK_TOKEN', tokenData);
        
        // Simulate booking response
        const position = Math.floor(Math.random() * 10) + 1;
        setQueuePosition(position);

        // Voice feedback for offline booking
        if ('speechSynthesis' in window) {
          const message = language === 'hi' ? 
            'टोकन ऑफलाइन बुक हो गया। कनेक्शन मिलने पर सिंक हो जाएगा।' : 
            'Token booked offline. Will sync when connection is restored.';
          const utterance = new SpeechSynthesisUtterance(message);
          utterance.lang = language === 'hi' ? 'hi-IN' : 'en-US';
          speechSynthesis.speak(utterance);
        }
      } else {
        // Online booking
        const position = Math.floor(Math.random() * 10) + 1;
        setQueuePosition(position);
        
        // Voice feedback for online booking
        if ('speechSynthesis' in window) {
          const message = language === 'hi' ? 
            `टोकन बुक हो गया। आपका नंबर ${position} है।` : 
            `Token booked successfully. Your queue position is ${position}.`;
          const utterance = new SpeechSynthesisUtterance(message);
          utterance.lang = language === 'hi' ? 'hi-IN' : 'en-US';
          speechSynthesis.speak(utterance);
        }
      }
    } catch (error) {
      console.error('Token booking failed:', error);
    }
  };

  const renderDashboard = () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl text-slate-900 mb-4">
          {t.dashboard.welcome}, {user?.name || 'Patient'}!
        </h2>
        <p className="text-slate-600">Quick access to your healthcare needs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTab('booking')}>
          <CardHeader className="text-center">
            <Calendar className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <CardTitle>{t.actions.bookToken}</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-slate-600">Schedule appointment with doctor</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTab('family')}>
          <CardHeader className="text-center">
            <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <CardTitle>{t.actions.myFamily}</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-slate-600">Manage family health profiles</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTab('locker')}>
          <CardHeader className="text-center">
            <Package className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <CardTitle>{t.actions.medicineLocker}</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-slate-600">View prescriptions and medicines</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onNavigate('emergency')}>
          <CardHeader className="text-center">
            <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <CardTitle>{t.actions.emergencySOS}</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-slate-600">Emergency alert system</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTab('symptom')}>
          <CardHeader className="text-center">
            <Brain className="h-12 w-12 text-orange-600 mx-auto mb-4" />
            <CardTitle>{t.actions.symptomCheck}</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-slate-600">AI-powered symptom analysis</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTab('records')}>
          <CardHeader className="text-center">
            <FileText className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
            <CardTitle>{t.actions.healthRecords}</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-slate-600">View medical history</p>
          </CardContent>
        </Card>
      </div>

      {/* Offline Demo Section */}
      <div className="mt-8">
        <h3 className="text-lg mb-4 text-center text-slate-700">
          {language === 'hi' ? 'ऑफलाइन कार्यक्षमता डेमो' : 'Offline Functionality Demo'}
        </h3>
        <div className="flex justify-center">
          <OfflineDemo language={language} />
        </div>
      </div>
    </div>
  );

  const renderFamily = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl text-slate-900">{t.family.title}</h2>
        <Button className="flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          {t.family.addMember}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {familyMembers.map((member) => (
          <Card key={member.id}>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">{member.name}</CardTitle>
                  <p className="text-sm text-slate-600">{member.relation}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Age:</span>
                  <span className="text-sm">{member.age}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Health ID:</span>
                  <span className="text-sm font-mono">{member.healthId}</span>
                </div>
                <div className="pt-2">
                  <Button variant="outline" size="sm" className="w-full">
                    View Records
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderRecords = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl text-slate-900">{t.records.title}</h2>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            {t.records.download}
          </Button>
          <Button variant="outline" size="sm">
            <QrCode className="h-4 w-4 mr-2" />
            {t.records.shareQR}
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {healthRecords.map((record, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${
                    record.type === 'consultation' ? 'bg-blue-100' :
                    record.type === 'prescription' ? 'bg-green-100' : 'bg-purple-100'
                  }`}>
                    {record.type === 'consultation' ? 
                      <User className="h-4 w-4 text-blue-600" /> :
                      record.type === 'prescription' ?
                      <Pill className="h-4 w-4 text-green-600" /> :
                      <FileText className="h-4 w-4 text-purple-600" />
                    }
                  </div>
                  <div>
                    <h3 className="text-lg">{record.doctor}</h3>
                    <p className="text-sm text-slate-600">{record.date}</p>
                  </div>
                </div>
                <Badge variant="secondary">
                  {record.type === 'consultation' ? t.records.consultation :
                   record.type === 'prescription' ? t.records.prescription : t.records.labReport}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700 mb-2">{record.summary}</p>
              <p className="text-sm text-slate-600">
                <strong>Prescription:</strong> {record.prescription}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderLocker = () => (
    <div className="space-y-6">
      <h2 className="text-2xl text-slate-900">{t.locker.title}</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg mb-4">{t.locker.currentMeds}</h3>
          <div className="space-y-3">
            {currentMedicines.map((med, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{med.name}</h4>
                      <p className="text-sm text-slate-600">{med.dosage} - {med.frequency}</p>
                      <p className="text-xs text-slate-500">by {med.prescribedBy}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <QrCode className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg mb-4">{t.locker.prescriptions}</h3>
          <div className="space-y-4">
            <Button className="w-full" variant="outline">
              <QrCode className="h-4 w-4 mr-2" />
              {t.locker.scanQR}
            </Button>
            <div className="p-8 border-2 border-dashed border-slate-300 rounded-lg text-center">
              <QrCode className="h-12 w-12 text-slate-400 mx-auto mb-2" />
              <p className="text-slate-600">Scan QR code from prescription</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSymptomChecker = () => (
    <div className="space-y-6">
      <h2 className="text-2xl text-slate-900">{t.symptom.title}</h2>
      
      <Card>
        <CardHeader>
          <CardTitle>{t.symptom.describe}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Describe your symptoms in detail..."
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            rows={4}
          />
          <Button onClick={analyzeSymptoms} disabled={!symptoms.trim()}>
            <Brain className="h-4 w-4 mr-2" />
            {t.symptom.analyze}
          </Button>
        </CardContent>
      </Card>

      {symptomResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className={`h-5 w-5 mr-2 ${
                symptomResult.severity === 'urgent' ? 'text-red-600' :
                symptomResult.severity === 'moderate' ? 'text-orange-600' : 'text-green-600'
              }`} />
              {t.symptom.result}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Badge variant={
                  symptomResult.severity === 'urgent' ? 'destructive' :
                  symptomResult.severity === 'moderate' ? 'secondary' : 'default'
                }>
                  {symptomResult.recommendation}
                </Badge>
              </div>
              <div>
                <h4 className="font-medium mb-2">Suggested Actions:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {symptomResult.suggested.map((suggestion, index) => (
                    <li key={index} className="text-sm text-slate-600">{suggestion}</li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderBooking = () => (
    <div className="space-y-6">
      <h2 className="text-2xl text-slate-900">{t.booking.title}</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Book Appointment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Select Doctor</Label>
              <select className="w-full p-2 border rounded-md">
                <option>Dr. Rajesh Kumar - General Medicine</option>
                <option>Dr. Priya Patel - Pediatrics</option>
                <option>Dr. Suresh Singh - Cardiology</option>
              </select>
            </div>
            <div>
              <Label>Preferred Time</Label>
              <select className="w-full p-2 border rounded-md">
                <option>Today 2:00 PM</option>
                <option>Today 3:00 PM</option>
                <option>Tomorrow 10:00 AM</option>
              </select>
            </div>
            <div>
              <Label>Brief Symptoms</Label>
              <Textarea placeholder="Describe your symptoms briefly..." rows={3} />
            </div>
            <Button onClick={bookToken} className="w-full">
              <Calendar className="h-4 w-4 mr-2" />
              {t.booking.book}
            </Button>
          </CardContent>
        </Card>

        {queuePosition && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-green-600">
                <Clock className="h-5 w-5 mr-2" />
                Appointment Booked!
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl text-emerald-600 mb-2">#{queuePosition}</div>
                  <p className="text-slate-600">Your queue position</p>
                </div>
                <div className="text-center">
                  <div className="text-xl mb-2">{queuePosition * 15} minutes</div>
                  <p className="text-slate-600">Estimated wait time</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg">
                  <p className="text-sm text-slate-600">
                    You will receive an SMS notification 15 minutes before your turn.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: User },
    { id: 'booking', label: 'Book Token', icon: Calendar },
    { id: 'family', label: 'My Family', icon: Users },
    { id: 'locker', label: 'Medicine Locker', icon: Package },
    { id: 'symptom', label: 'Symptom Check', icon: Brain },
    { id: 'records', label: 'Health Records', icon: FileText }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-slate-200">
            <nav className="-mb-px flex space-x-8 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-2 px-1 border-b-2 text-sm whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-emerald-500 text-emerald-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <tab.icon className="h-4 w-4 mr-2" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'booking' && renderBooking()}
          {activeTab === 'family' && renderFamily()}
          {activeTab === 'locker' && renderLocker()}
          {activeTab === 'symptom' && renderSymptomChecker()}
          {activeTab === 'records' && renderRecords()}
        </div>
      </div>
    </div>
  );
}