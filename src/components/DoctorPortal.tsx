import React, { useState } from 'react';
import { 
  Video, 
  Users, 
  FileText, 
  AlertTriangle, 
  Calendar, 
  Clock, 
  QrCode,
  MapPin,
  Stethoscope,
  PillBottle,
  TrendingUp,
  Activity,
  Heart
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Label } from './ui/label';

type Language = 'en' | 'hi' | 'pa' | 'bn';

interface DoctorPortalProps {
  language: Language;
  user: any;
}

const translations = {
  en: {
    dashboard: {
      title: 'Doctor Dashboard',
      welcome: 'Welcome Dr.',
      todaysSchedule: "Today's Schedule",
      quickStats: 'Quick Statistics',
      recentAlerts: 'Recent Health Alerts'
    },
    tabs: {
      dashboard: 'Dashboard',
      consultations: 'Consultations',
      prescriptions: 'Prescriptions',
      records: 'Patient Records',
      outbreak: 'Outbreak Monitor',
      analytics: 'Analytics'
    },
    consultations: {
      title: 'Video Consultations',
      scheduled: 'Scheduled',
      inProgress: 'In Progress',
      completed: 'Completed Today',
      joinCall: 'Join Video Call',
      reschedule: 'Reschedule',
      patientSummary: 'AI-Generated Patient Summary',
      consultation: 'Consultation Notes',
      diagnosis: 'Diagnosis',
      treatment: 'Treatment Plan'
    },
    prescriptions: {
      title: 'Digital Prescriptions',
      generateQR: 'Generate QR Prescription',
      patientName: 'Patient Name',
      medicines: 'Medicines',
      addMedicine: 'Add Medicine',
      dosage: 'Dosage',
      frequency: 'Frequency',
      duration: 'Duration',
      instructions: 'Special Instructions',
      generate: 'Generate Prescription',
      recent: 'Recent Prescriptions'
    },
    records: {
      title: 'Patient Records',
      search: 'Search Patient',
      totalPatients: 'Total Patients',
      criticalCases: 'Critical Cases',
      followUps: 'Follow-ups Due',
      viewDetails: 'View Details',
      updateRecord: 'Update Record'
    },
    outbreak: {
      title: 'Disease Outbreak Monitor',
      riskLevel: 'Risk Level',
      affectedVillages: 'Affected Villages',
      totalCases: 'Total Cases',
      newCases: 'New Cases (24h)',
      sendAlert: 'Send Alert',
      symptoms: 'Common Symptoms',
      recommendations: 'Recommendations'
    },
    analytics: {
      title: 'Health Analytics',
      patientTrends: 'Patient Trends',
      diseasePatterns: 'Disease Patterns',
      medicationUsage: 'Medication Usage',
      villageHealth: 'Village Health Scores'
    }
  },
  hi: {
    dashboard: {
      title: 'डॉक्टर डैशबोर्ड',
      welcome: 'स्वागत डॉ.',
      todaysSchedule: 'आज का कार्यक्रम',
      quickStats: 'त्वरित आंकड़े',
      recentAlerts: 'हाल की स्वास्थ्य चेतावनियां'
    }
  }
};

export function DoctorPortal({ language, user }: DoctorPortalProps) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [prescriptionData, setPrescriptionData] = useState({
    patientName: '',
    medicines: [{ name: '', dosage: '', frequency: '', duration: '' }],
    instructions: ''
  });
  
  const t = translations[language] || translations.en;

  const todaysConsultations = [
    {
      id: 1,
      time: '10:00 AM',
      patient: 'Priya Sharma',
      age: 45,
      village: 'Kamalpur',
      condition: 'Diabetes Follow-up',
      status: 'scheduled',
      priority: 'routine',
      aiSummary: 'Patient with Type 2 diabetes, last HbA1c 7.2%, compliant with metformin. Reports occasional dizziness.'
    },
    {
      id: 2,
      time: '11:30 AM',
      patient: 'Raj Patel',
      age: 67,
      village: 'Surajpur',
      condition: 'Chest Pain',
      status: 'inProgress',
      priority: 'urgent',
      aiSummary: 'Male, 67, presenting chest discomfort for 2 hours. No prior cardiac history. Vitals stable.'
    },
    {
      id: 3,
      time: '02:00 PM',
      patient: 'Meera Singh',
      age: 32,
      village: 'Rampur',
      condition: 'Prenatal Checkup',
      status: 'scheduled',
      priority: 'routine',
      aiSummary: '32 weeks pregnant, previous normal pregnancy. No complications reported. Regular prenatal care.'
    },
    {
      id: 4,
      time: '03:30 PM',
      patient: 'Suresh Kumar',
      age: 55,
      village: 'Ganeshpur',
      condition: 'Hypertension',
      status: 'completed',
      priority: 'followup',
      aiSummary: 'HTN patient on ACE inhibitor, BP controlled. Patient reports good compliance with medications.'
    }
  ];

  const patientRecords = [
    {
      id: 1,
      name: 'Priya Sharma',
      age: 45,
      village: 'Kamalpur',
      lastVisit: '2024-01-10',
      condition: 'Type 2 Diabetes',
      status: 'stable',
      riskLevel: 'medium'
    },
    {
      id: 2,
      name: 'Raj Patel',
      age: 67,
      village: 'Surajpur',
      lastVisit: '2024-01-15',
      condition: 'Hypertension, CAD',
      status: 'critical',
      riskLevel: 'high'
    },
    {
      id: 3,
      name: 'Meera Singh',
      age: 32,
      village: 'Rampur',
      lastVisit: '2024-01-12',
      condition: 'Pregnancy - 32 weeks',
      status: 'stable',
      riskLevel: 'low'
    }
  ];

  const outbreakData = {
    riskLevel: 'Medium',
    affectedVillages: 3,
    totalCases: 24,
    newCases: 5,
    commonSymptoms: ['Fever', 'Cough', 'Body ache', 'Headache'],
    affectedAreas: [
      { village: 'Kamalpur', cases: 12, riskLevel: 'high' },
      { village: 'Surajpur', cases: 8, riskLevel: 'medium' },
      { village: 'Rampur', cases: 4, riskLevel: 'low' }
    ]
  };

  const recentPrescriptions = [
    {
      id: 1,
      patient: 'Priya Sharma',
      date: '2024-01-15',
      medicines: ['Metformin 500mg', 'Glimepiride 2mg'],
      qrGenerated: true
    },
    {
      id: 2,
      patient: 'Raj Patel',
      date: '2024-01-14',
      medicines: ['Aspirin 75mg', 'Atorvastatin 20mg', 'Amlodipine 5mg'],
      qrGenerated: true
    }
  ];

  const addMedicine = () => {
    setPrescriptionData({
      ...prescriptionData,
      medicines: [...prescriptionData.medicines, { name: '', dosage: '', frequency: '', duration: '' }]
    });
  };

  const updateMedicine = (index: number, field: string, value: string) => {
    const updatedMedicines = [...prescriptionData.medicines];
    updatedMedicines[index] = { ...updatedMedicines[index], [field]: value };
    setPrescriptionData({ ...prescriptionData, medicines: updatedMedicines });
  };

  const generatePrescription = () => {
    // Simulate QR generation
    alert('QR Prescription generated successfully! Patient can scan to verify.');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'text-blue-600 bg-blue-100';
      case 'inProgress': return 'text-orange-600 bg-orange-100';
      case 'completed': return 'text-green-600 bg-green-100';
      case 'urgent': return 'text-red-600 bg-red-100';
      default: return 'text-slate-600 bg-slate-100';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-orange-600 bg-orange-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-slate-600 bg-slate-100';
    }
  };

  const renderDashboard = () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl text-slate-900 mb-4">
          {t.dashboard.welcome} {user?.name || 'Doctor'}
        </h2>
        <p className="text-slate-600">Your daily overview and patient summary</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl text-slate-900">6</div>
            <div className="text-sm text-slate-600">Consultations Today</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl text-slate-900">124</div>
            <div className="text-sm text-slate-600">Total Patients</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-2" />
            <div className="text-2xl text-slate-900">3</div>
            <div className="text-sm text-slate-600">Critical Cases</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <FileText className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl text-slate-900">18</div>
            <div className="text-sm text-slate-600">Prescriptions Today</div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Schedule */}
      <Card>
        <CardHeader>
          <CardTitle>{t.dashboard.todaysSchedule}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {todaysConsultations.slice(0, 3).map((consultation) => (
              <div key={consultation.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <div className="font-medium">{consultation.time}</div>
                    <Badge className={getStatusColor(consultation.status)}>
                      {consultation.status}
                    </Badge>
                  </div>
                  <div>
                    <div className="font-medium">{consultation.patient}</div>
                    <div className="text-sm text-slate-600">
                      {consultation.village} • {consultation.condition}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  {consultation.status === 'inProgress' && (
                    <Button size="sm">
                      <Video className="h-4 w-4 mr-2" />
                      {t.consultations.joinCall}
                    </Button>
                  )}
                  {consultation.status === 'scheduled' && (
                    <Button size="sm" variant="outline">
                      View Summary
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-orange-600" />
            {t.dashboard.recentAlerts}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <div>
                <div className="font-medium text-red-800">Fever outbreak detected in Kamalpur</div>
                <div className="text-sm text-red-600">12 cases reported in last 48 hours</div>
              </div>
              <Badge className="bg-red-100 text-red-800">High Risk</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
              <div>
                <div className="font-medium text-orange-800">Medicine shortage alert</div>
                <div className="text-sm text-orange-600">Paracetamol stock low in 3 pharmacies</div>
              </div>
              <Badge className="bg-orange-100 text-orange-800">Medium Risk</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderConsultations = () => (
    <div className="space-y-6">
      <h2 className="text-2xl text-slate-900">{t.consultations.title}</h2>
      
      <div className="space-y-6">
        {todaysConsultations.map((consultation) => (
          <Card key={consultation.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{consultation.patient}</CardTitle>
                  <p className="text-slate-600">
                    {consultation.village} • {consultation.time} • {consultation.condition}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(consultation.priority)}>
                    {consultation.priority}
                  </Badge>
                  <Badge className={getStatusColor(consultation.status)}>
                    {consultation.status}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">{t.consultations.patientSummary}</h4>
                  <p className="text-slate-600 bg-slate-50 p-3 rounded-lg">
                    {consultation.aiSummary}
                  </p>
                </div>
                
                <div className="flex space-x-2">
                  {consultation.status === 'scheduled' && (
                    <>
                      <Button size="sm">
                        <Video className="h-4 w-4 mr-2" />
                        {t.consultations.joinCall}
                      </Button>
                      <Button size="sm" variant="outline">
                        <Calendar className="h-4 w-4 mr-2" />
                        {t.consultations.reschedule}
                      </Button>
                    </>
                  )}
                  
                  {consultation.status === 'inProgress' && (
                    <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                      <Video className="h-4 w-4 mr-2" />
                      Continue Call
                    </Button>
                  )}
                  
                  {consultation.status === 'completed' && (
                    <Button size="sm" variant="outline">
                      <FileText className="h-4 w-4 mr-2" />
                      View Notes
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderPrescriptions = () => (
    <div className="space-y-6">
      <h2 className="text-2xl text-slate-900">{t.prescriptions.title}</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Generate New Prescription */}
        <Card>
          <CardHeader>
            <CardTitle>{t.prescriptions.generateQR}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>{t.prescriptions.patientName}</Label>
              <Input
                value={prescriptionData.patientName}
                onChange={(e) => setPrescriptionData({...prescriptionData, patientName: e.target.value})}
                placeholder="Enter patient name"
              />
            </div>
            
            <div>
              <Label>{t.prescriptions.medicines}</Label>
              {prescriptionData.medicines.map((medicine, index) => (
                <div key={index} className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                  <Input
                    placeholder="Medicine name"
                    value={medicine.name}
                    onChange={(e) => updateMedicine(index, 'name', e.target.value)}
                  />
                  <Input
                    placeholder="Dosage"
                    value={medicine.dosage}
                    onChange={(e) => updateMedicine(index, 'dosage', e.target.value)}
                  />
                  <Input
                    placeholder="Frequency"
                    value={medicine.frequency}
                    onChange={(e) => updateMedicine(index, 'frequency', e.target.value)}
                  />
                  <Input
                    placeholder="Duration"
                    value={medicine.duration}
                    onChange={(e) => updateMedicine(index, 'duration', e.target.value)}
                  />
                </div>
              ))}
              <Button size="sm" variant="outline" onClick={addMedicine} className="mt-2">
                {t.prescriptions.addMedicine}
              </Button>
            </div>
            
            <div>
              <Label>{t.prescriptions.instructions}</Label>
              <Textarea
                value={prescriptionData.instructions}
                onChange={(e) => setPrescriptionData({...prescriptionData, instructions: e.target.value})}
                placeholder="Special instructions for patient"
                rows={3}
              />
            </div>
            
            <Button onClick={generatePrescription} className="w-full">
              <QrCode className="h-4 w-4 mr-2" />
              {t.prescriptions.generate}
            </Button>
          </CardContent>
        </Card>

        {/* Recent Prescriptions */}
        <Card>
          <CardHeader>
            <CardTitle>{t.prescriptions.recent}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPrescriptions.map((prescription) => (
                <div key={prescription.id} className="p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium">{prescription.patient}</div>
                    <div className="text-sm text-slate-600">{prescription.date}</div>
                  </div>
                  <div className="text-sm text-slate-600 mb-2">
                    {prescription.medicines.join(', ')}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-green-100 text-green-800">
                      <QrCode className="h-3 w-3 mr-1" />
                      QR Generated
                    </Badge>
                    <Button size="sm" variant="outline">
                      View QR
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderRecords = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl text-slate-900">{t.records.title}</h2>
        <div className="flex space-x-4">
          <Input placeholder={t.records.search} className="w-64" />
          <Button variant="outline">Search</Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6 text-center">
            <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl text-slate-900">124</div>
            <div className="text-sm text-slate-600">{t.records.totalPatients}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-2" />
            <div className="text-2xl text-slate-900">3</div>
            <div className="text-sm text-slate-600">{t.records.criticalCases}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <Clock className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl text-slate-900">12</div>
            <div className="text-sm text-slate-600">{t.records.followUps}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {patientRecords.map((patient) => (
          <Card key={patient.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{patient.name}</CardTitle>
                  <p className="text-slate-600">{patient.age} years • {patient.village}</p>
                </div>
                <Badge className={getRiskColor(patient.riskLevel)}>
                  {patient.riskLevel} risk
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-slate-600">Condition: </span>
                  <span className="font-medium">{patient.condition}</span>
                </div>
                <div>
                  <span className="text-sm text-slate-600">Last Visit: </span>
                  <span>{patient.lastVisit}</span>
                </div>
                <div>
                  <span className="text-sm text-slate-600">Status: </span>
                  <Badge className={patient.status === 'critical' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}>
                    {patient.status}
                  </Badge>
                </div>
                <div className="flex space-x-2 pt-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    {t.records.viewDetails}
                  </Button>
                  <Button size="sm" className="flex-1">
                    {t.records.updateRecord}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderOutbreak = () => (
    <div className="space-y-6">
      <h2 className="text-2xl text-slate-900">{t.outbreak.title}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <AlertTriangle className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl text-slate-900">{outbreakData.riskLevel}</div>
            <div className="text-sm text-slate-600">{t.outbreak.riskLevel}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <MapPin className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl text-slate-900">{outbreakData.affectedVillages}</div>
            <div className="text-sm text-slate-600">{t.outbreak.affectedVillages}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <Users className="h-8 w-8 text-red-600 mx-auto mb-2" />
            <div className="text-2xl text-slate-900">{outbreakData.totalCases}</div>
            <div className="text-sm text-slate-600">{t.outbreak.totalCases}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl text-slate-900">{outbreakData.newCases}</div>
            <div className="text-sm text-slate-600">{t.outbreak.newCases}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Affected Villages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {outbreakData.affectedAreas.map((area, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <div className="font-medium">{area.village}</div>
                    <div className="text-sm text-slate-600">{area.cases} reported cases</div>
                  </div>
                  <Badge className={getRiskColor(area.riskLevel)}>
                    {area.riskLevel}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t.outbreak.symptoms}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {outbreakData.commonSymptoms.map((symptom, index) => (
                <div key={index} className="flex items-center space-x-2 p-2 bg-slate-50 rounded">
                  <Activity className="h-4 w-4 text-red-600" />
                  <span>{symptom}</span>
                </div>
              ))}
              <Button className="w-full mt-4">
                <AlertTriangle className="h-4 w-4 mr-2" />
                {t.outbreak.sendAlert}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <h2 className="text-2xl text-slate-900">{t.analytics.title}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>{t.analytics.patientTrends}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-slate-50 rounded-lg flex items-center justify-center">
              <p className="text-slate-500">Patient trend chart would display here</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t.analytics.diseasePatterns}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-slate-50 rounded-lg flex items-center justify-center">
              <p className="text-slate-500">Disease pattern chart would display here</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t.analytics.medicationUsage}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-slate-50 rounded-lg flex items-center justify-center">
              <p className="text-slate-500">Medication usage chart would display here</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t.analytics.villageHealth}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-slate-50 rounded-lg flex items-center justify-center">
              <p className="text-slate-500">Village health score map would display here</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const tabs = [
    { id: 'dashboard', label: t.tabs.dashboard, icon: Heart },
    { id: 'consultations', label: t.tabs.consultations, icon: Video },
    { id: 'prescriptions', label: t.tabs.prescriptions, icon: QrCode },
    { id: 'records', label: t.tabs.records, icon: FileText },
    { id: 'outbreak', label: t.tabs.outbreak, icon: AlertTriangle },
    { id: 'analytics', label: t.tabs.analytics, icon: TrendingUp }
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
          {activeTab === 'consultations' && renderConsultations()}
          {activeTab === 'prescriptions' && renderPrescriptions()}
          {activeTab === 'records' && renderRecords()}
          {activeTab === 'outbreak' && renderOutbreak()}
          {activeTab === 'analytics' && renderAnalytics()}
        </div>
      </div>
    </div>
  );
}