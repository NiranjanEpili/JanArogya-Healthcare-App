import React, { useState } from 'react';
import { 
  MapPin, 
  AlertTriangle, 
  Users, 
  TrendingUp, 
  Activity, 
  Shield, 
  Package, 
  Heart,
  BarChart3,
  Globe,
  Wifi,
  WifiOff
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';

type Language = 'en' | 'hi' | 'pa' | 'bn';

interface AdminDashboardProps {
  language: Language;
  user: any;
}

const translations = {
  en: {
    dashboard: {
      title: 'Authority / Admin Dashboard',
      welcome: 'Welcome Administrator',
      overview: 'Rural Healthcare Overview',
      systemStatus: 'System Status'
    },
    tabs: {
      overview: 'Village Overview',
      health: 'Health Monitoring',
      workers: 'Worker Performance',
      supply: 'Supply Chain',
      alerts: 'Early Warning'
    },
    overview: {
      title: 'Village Health Overview',
      totalVillages: 'Total Villages',
      connectedVillages: 'Connected Villages',
      healthWorkers: 'Active Health Workers',
      onlineDoctors: 'Online Doctors',
      coverageRate: 'Coverage Rate',
      healthScore: 'Health Score',
      population: 'Population',
      lastUpdate: 'Last Update',
      connectivity: 'Connectivity',
      riskLevel: 'Risk Level'
    },
    health: {
      title: 'Disease Early Warning System',
      outbreakAlerts: 'Outbreak Alerts',
      symptomReports: 'Symptom Reports (24h)',
      trendingSymptoms: 'Trending Symptoms',
      affectedAreas: 'Affected Areas',
      riskAssessment: 'Risk Assessment',
      sendAlert: 'Send Community Alert',
      quarantineRecommended: 'Quarantine Recommended',
      investigationNeeded: 'Investigation Needed'
    },
    workers: {
      title: 'Health Worker Performance Tracking',
      totalWorkers: 'Total Workers',
      activeToday: 'Active Today',
      topPerformers: 'Top Performers',
      trainingCompletion: 'Training Completion',
      visitCompletion: 'Visit Completion Rate',
      incentivesEarned: 'Incentives Earned',
      performance: 'Performance Score',
      tokensEarned: 'Tokens Earned',
      tasksCompleted: 'Tasks Completed'
    },
    supply: {
      title: 'Supply Chain Analytics',
      stockLevels: 'Medicine Stock Levels',
      demandForecast: 'Demand Forecast vs Actual',
      supplyEfficiency: 'Supply Efficiency',
      criticalShortages: 'Critical Shortages',
      overstock: 'Overstock Items',
      deliveryPerformance: 'Delivery Performance',
      predictedDemand: 'Predicted Demand',
      actualUsage: 'Actual Usage',
      variance: 'Variance'
    },
    alerts: {
      title: 'Emergency Alerts & Notifications',
      activeAlerts: 'Active Alerts',
      recentEmergencies: 'Recent Emergencies',
      responseTime: 'Avg Response Time',
      sendBroadcast: 'Send Broadcast Alert',
      alertType: 'Alert Type',
      priority: 'Priority',
      coverage: 'Coverage Area',
      message: 'Alert Message'
    }
  },
  hi: {
    dashboard: {
      title: 'प्राधिकरण / एडमिन डैशबोर्ड',
      welcome: 'स्वागत प्रशासक',
      overview: 'ग्रामीण स्वास्थ्य सेवा अवलोकन',
      systemStatus: 'सिस्टम स्थिति'
    }
  }
};

export function AdminDashboard({ language, user }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedVillage, setSelectedVillage] = useState(null);
  
  const t = translations[language] || translations.en;

  const villageData = [
    {
      id: 1,
      name: 'Kamalpur',
      population: 1250,
      healthScore: 85,
      coverage: 92,
      riskLevel: 'medium',
      connectivity: 'online',
      lastUpdate: '2 mins ago',
      workers: 3,
      doctors: 1,
      pharmacies: 1,
      coordinates: { lat: 28.6139, lng: 77.2090 }
    },
    {
      id: 2,
      name: 'Surajpur',
      population: 890,
      healthScore: 78,
      coverage: 88,
      riskLevel: 'low',
      connectivity: 'online',
      lastUpdate: '5 mins ago',
      workers: 2,
      doctors: 1,
      pharmacies: 1,
      coordinates: { lat: 28.6269, lng: 77.2164 }
    },
    {
      id: 3,
      name: 'Rampur',
      population: 1560,
      healthScore: 92,
      coverage: 95,
      riskLevel: 'low',
      connectivity: 'offline',
      lastUpdate: '2 hours ago',
      workers: 4,
      doctors: 2,
      pharmacies: 2,
      coordinates: { lat: 28.6448, lng: 77.2167 }
    },
    {
      id: 4,
      name: 'Ganeshpur',
      population: 2100,
      healthScore: 65,
      coverage: 75,
      riskLevel: 'high',
      connectivity: 'online',
      lastUpdate: '1 min ago',
      workers: 5,
      doctors: 2,
      pharmacies: 1,
      coordinates: { lat: 28.6562, lng: 77.2410 }
    }
  ];

  const outbreakAlerts = [
    {
      id: 1,
      type: 'Fever Outbreak',
      village: 'Kamalpur',
      cases: 12,
      severity: 'high',
      trend: 'increasing',
      reportedAt: '2024-01-15 10:30'
    },
    {
      id: 2,
      type: 'Respiratory Infection',
      village: 'Ganeshpur',
      cases: 8,
      severity: 'medium',
      trend: 'stable',
      reportedAt: '2024-01-15 09:15'
    },
    {
      id: 3,
      type: 'Gastroenteritis',
      village: 'Surajpur',
      cases: 5,
      severity: 'low',
      trend: 'decreasing',
      reportedAt: '2024-01-14 16:45'
    }
  ];

  const topWorkers = [
    {
      name: 'Rajesh Kumar',
      village: 'Kamalpur',
      performance: 95,
      tasksCompleted: 48,
      tokensEarned: 3200,
      trainingCompletion: 100
    },
    {
      name: 'Sunita Devi',
      village: 'Rampur',
      performance: 92,
      tasksCompleted: 45,
      tokensEarned: 2800,
      trainingCompletion: 95
    },
    {
      name: 'Mohan Singh',
      village: 'Surajpur',
      performance: 88,
      tasksCompleted: 42,
      tokensEarned: 2450,
      trainingCompletion: 90
    },
    {
      name: 'Priya Patel',
      village: 'Ganeshpur',
      performance: 85,
      tasksCompleted: 38,
      tokensEarned: 2100,
      trainingCompletion: 85
    }
  ];

  const medicineStock = [
    {
      name: 'Paracetamol 500mg',
      currentStock: 2400,
      predictedDemand: 2800,
      actualUsage: 2650,
      status: 'low',
      variance: -5.4
    },
    {
      name: 'Amoxicillin 250mg',
      currentStock: 1800,
      predictedDemand: 1600,
      actualUsage: 1750,
      status: 'normal',
      variance: 9.4
    },
    {
      name: 'Metformin 500mg',
      currentStock: 3200,
      predictedDemand: 2900,
      actualUsage: 2850,
      status: 'overstock',
      variance: -1.7
    },
    {
      name: 'Vitamin D3',
      currentStock: 450,
      predictedDemand: 800,
      actualUsage: 820,
      status: 'critical',
      variance: 2.5
    }
  ];

  const recentEmergencies = [
    {
      id: 'EMG001',
      type: 'Medical Emergency',
      village: 'Kamalpur',
      status: 'resolved',
      responseTime: '12 mins',
      reportedAt: '2024-01-15 14:30'
    },
    {
      id: 'EMG002',
      type: 'Medicine Shortage',
      village: 'Ganeshpur',
      status: 'in_progress',
      responseTime: '8 mins',
      reportedAt: '2024-01-15 13:15'
    },
    {
      id: 'EMG003',
      type: 'Disease Outbreak',
      village: 'Surajpur',
      status: 'monitoring',
      responseTime: '5 mins',
      reportedAt: '2024-01-15 11:45'
    }
  ];

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-orange-600 bg-orange-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-slate-600 bg-slate-100';
    }
  };

  const getStockColor = (status: string) => {
    switch (status) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'low': return 'text-orange-600 bg-orange-100';
      case 'normal': return 'text-green-600 bg-green-100';
      case 'overstock': return 'text-blue-600 bg-blue-100';
      default: return 'text-slate-600 bg-slate-100';
    }
  };

  const renderOverview = () => (
    <div className="space-y-8">
      {/* System Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <Globe className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl text-slate-900">{villageData.length}</div>
            <div className="text-sm text-slate-600">{t.overview.totalVillages}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <Wifi className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl text-slate-900">
              {villageData.filter(v => v.connectivity === 'online').length}
            </div>
            <div className="text-sm text-slate-600">{t.overview.connectedVillages}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl text-slate-900">
              {villageData.reduce((sum, v) => sum + v.workers, 0)}
            </div>
            <div className="text-sm text-slate-600">{t.overview.healthWorkers}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <Heart className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
            <div className="text-2xl text-slate-900">
              {villageData.reduce((sum, v) => sum + v.doctors, 0)}
            </div>
            <div className="text-sm text-slate-600">{t.overview.onlineDoctors}</div>
          </CardContent>
        </Card>
      </div>

      {/* Village Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {villageData.map((village) => (
          <Card key={village.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{village.name}</CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge className={getRiskColor(village.riskLevel)}>
                    {village.riskLevel} risk
                  </Badge>
                  {village.connectivity === 'online' ? (
                    <Wifi className="h-4 w-4 text-green-600" />
                  ) : (
                    <WifiOff className="h-4 w-4 text-red-600" />
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-600">{t.overview.population}:</span>
                    <div className="font-medium">{village.population.toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="text-slate-600">{t.overview.lastUpdate}:</span>
                    <div className="font-medium">{village.lastUpdate}</div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>{t.overview.healthScore}</span>
                    <span>{village.healthScore}/100</span>
                  </div>
                  <Progress value={village.healthScore} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>{t.overview.coverageRate}</span>
                    <span>{village.coverage}%</span>
                  </div>
                  <Progress value={village.coverage} className="h-2" />
                </div>
                
                <div className="grid grid-cols-3 gap-2 pt-2">
                  <div className="text-center">
                    <div className="text-sm text-slate-600">Workers</div>
                    <div className="font-medium">{village.workers}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-slate-600">Doctors</div>
                    <div className="font-medium">{village.doctors}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-slate-600">Pharmacies</div>
                    <div className="font-medium">{village.pharmacies}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderHealth = () => (
    <div className="space-y-6">
      <h2 className="text-2xl text-slate-900">{t.health.title}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6 text-center">
            <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-2" />
            <div className="text-2xl text-slate-900">{outbreakAlerts.length}</div>
            <div className="text-sm text-slate-600">{t.health.outbreakAlerts}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <Activity className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl text-slate-900">47</div>
            <div className="text-sm text-slate-600">{t.health.symptomReports}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl text-slate-900">12</div>
            <div className="text-sm text-slate-600">{t.health.affectedAreas}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Active Outbreaks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
              Active Outbreak Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {outbreakAlerts.map((alert) => (
                <div key={alert.id} className="p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium">{alert.type}</div>
                    <Badge className={
                      alert.severity === 'high' ? 'bg-red-100 text-red-800' :
                      alert.severity === 'medium' ? 'bg-orange-100 text-orange-800' :
                      'bg-yellow-100 text-yellow-800'
                    }>
                      {alert.severity}
                    </Badge>
                  </div>
                  <div className="text-sm text-slate-600 space-y-1">
                    <div>Village: {alert.village}</div>
                    <div>Cases: {alert.cases}</div>
                    <div>Trend: {alert.trend}</div>
                    <div>Reported: {alert.reportedAt}</div>
                  </div>
                  <div className="flex space-x-2 mt-3">
                    <Button size="sm" variant="outline" className="flex-1">
                      Investigate
                    </Button>
                    <Button size="sm" className="flex-1">
                      {t.health.sendAlert}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Risk Assessment Map */}
        <Card>
          <CardHeader>
            <CardTitle>{t.health.riskAssessment}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-slate-50 rounded-lg flex items-center justify-center mb-4">
              <p className="text-slate-500">Interactive risk assessment map would display here</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">High Risk Areas</span>
                <Badge className="bg-red-100 text-red-800">2 villages</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Medium Risk Areas</span>
                <Badge className="bg-orange-100 text-orange-800">1 village</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Low Risk Areas</span>
                <Badge className="bg-green-100 text-green-800">1 village</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderWorkers = () => (
    <div className="space-y-6">
      <h2 className="text-2xl text-slate-900">{t.workers.title}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6 text-center">
            <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl text-slate-900">14</div>
            <div className="text-sm text-slate-600">{t.workers.totalWorkers}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <Activity className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl text-slate-900">12</div>
            <div className="text-sm text-slate-600">{t.workers.activeToday}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl text-slate-900">89%</div>
            <div className="text-sm text-slate-600">{t.workers.visitCompletion}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t.workers.topPerformers}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topWorkers.map((worker, index) => (
              <div key={index} className="p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-medium">{worker.name}</div>
                    <div className="text-sm text-slate-600">{worker.village}</div>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-800">
                    Rank #{index + 1}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-slate-600">{t.workers.performance}:</span>
                    <div className="font-medium">{worker.performance}%</div>
                  </div>
                  <div>
                    <span className="text-slate-600">{t.workers.tasksCompleted}:</span>
                    <div className="font-medium">{worker.tasksCompleted}</div>
                  </div>
                  <div>
                    <span className="text-slate-600">{t.workers.tokensEarned}:</span>
                    <div className="font-medium">{worker.tokensEarned}</div>
                  </div>
                  <div>
                    <span className="text-slate-600">{t.workers.trainingCompletion}:</span>
                    <div className="font-medium">{worker.trainingCompletion}%</div>
                  </div>
                </div>
                
                <div className="mt-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Performance Score</span>
                    <span>{worker.performance}%</span>
                  </div>
                  <Progress value={worker.performance} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderSupply = () => (
    <div className="space-y-6">
      <h2 className="text-2xl text-slate-900">{t.supply.title}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6 text-center">
            <Package className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl text-slate-900">
              {medicineStock.filter(m => m.status === 'critical').length}
            </div>
            <div className="text-sm text-slate-600">{t.supply.criticalShortages}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <TrendingUp className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl text-slate-900">
              {medicineStock.filter(m => m.status === 'overstock').length}
            </div>
            <div className="text-sm text-slate-600">{t.supply.overstock}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <BarChart3 className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl text-slate-900">94%</div>
            <div className="text-sm text-slate-600">{t.supply.supplyEfficiency}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t.supply.demandForecast}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {medicineStock.map((medicine, index) => (
              <div key={index} className="p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="font-medium">{medicine.name}</div>
                  <Badge className={getStockColor(medicine.status)}>
                    {medicine.status}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                  <div>
                    <span className="text-slate-600">Current Stock:</span>
                    <div className="font-medium">{medicine.currentStock}</div>
                  </div>
                  <div>
                    <span className="text-slate-600">{t.supply.predictedDemand}:</span>
                    <div className="font-medium">{medicine.predictedDemand}</div>
                  </div>
                  <div>
                    <span className="text-slate-600">{t.supply.actualUsage}:</span>
                    <div className="font-medium">{medicine.actualUsage}</div>
                  </div>
                  <div>
                    <span className="text-slate-600">{t.supply.variance}:</span>
                    <div className={`font-medium ${medicine.variance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {medicine.variance >= 0 ? '+' : ''}{medicine.variance}%
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Predicted vs Actual</span>
                      <span>{Math.abs(medicine.variance)}% variance</span>
                    </div>
                    <Progress 
                      value={Math.min((medicine.actualUsage / medicine.predictedDemand) * 100, 100)} 
                      className="h-2" 
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Stock Level</span>
                      <span>{Math.round((medicine.currentStock / medicine.predictedDemand) * 100)}%</span>
                    </div>
                    <Progress 
                      value={Math.min((medicine.currentStock / medicine.predictedDemand) * 100, 100)} 
                      className="h-2" 
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAlerts = () => (
    <div className="space-y-6">
      <h2 className="text-2xl text-slate-900">{t.alerts.title}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6 text-center">
            <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-2" />
            <div className="text-2xl text-slate-900">5</div>
            <div className="text-sm text-slate-600">{t.alerts.activeAlerts}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <Activity className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl text-slate-900">23</div>
            <div className="text-sm text-slate-600">{t.alerts.recentEmergencies}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl text-slate-900">8.5 min</div>
            <div className="text-sm text-slate-600">{t.alerts.responseTime}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Emergencies */}
        <Card>
          <CardHeader>
            <CardTitle>{t.alerts.recentEmergencies}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentEmergencies.map((emergency) => (
                <div key={emergency.id} className="p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium">{emergency.type}</div>
                    <Badge className={
                      emergency.status === 'resolved' ? 'bg-green-100 text-green-800' :
                      emergency.status === 'in_progress' ? 'bg-orange-100 text-orange-800' :
                      'bg-blue-100 text-blue-800'
                    }>
                      {emergency.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-slate-600 space-y-1">
                    <div>ID: {emergency.id}</div>
                    <div>Village: {emergency.village}</div>
                    <div>Response Time: {emergency.responseTime}</div>
                    <div>Reported: {emergency.reportedAt}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Broadcast Alert System */}
        <Card>
          <CardHeader>
            <CardTitle>{t.alerts.sendBroadcast}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">{t.alerts.alertType}</label>
                <select className="w-full p-2 border border-slate-300 rounded-md">
                  <option>Health Advisory</option>
                  <option>Emergency Alert</option>
                  <option>Weather Warning</option>
                  <option>Supply Update</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">{t.alerts.priority}</label>
                <select className="w-full p-2 border border-slate-300 rounded-md">
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">{t.alerts.coverage}</label>
                <select className="w-full p-2 border border-slate-300 rounded-md">
                  <option>All Villages</option>
                  <option>High Risk Villages</option>
                  <option>Specific Village</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">{t.alerts.message}</label>
                <textarea 
                  className="w-full p-2 border border-slate-300 rounded-md"
                  rows={4}
                  placeholder="Enter alert message..."
                />
              </div>
              
              <Button className="w-full">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Send Broadcast Alert
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const tabs = [
    { id: 'overview', label: t.tabs.overview, icon: Globe },
    { id: 'health', label: t.tabs.health, icon: AlertTriangle },
    { id: 'workers', label: t.tabs.workers, icon: Users },
    { id: 'supply', label: t.tabs.supply, icon: Package },
    { id: 'alerts', label: t.tabs.alerts, icon: Activity }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl text-slate-900 mb-2">{t.dashboard.title}</h1>
          <p className="text-slate-600">{t.dashboard.welcome}</p>
        </div>

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
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'health' && renderHealth()}
          {activeTab === 'workers' && renderWorkers()}
          {activeTab === 'supply' && renderSupply()}
          {activeTab === 'alerts' && renderAlerts()}
        </div>
      </div>
    </div>
  );
}