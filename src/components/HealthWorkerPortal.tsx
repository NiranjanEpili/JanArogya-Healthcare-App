import React, { useState } from 'react';
import { 
  Users, 
  CheckSquare, 
  BookOpen, 
  Gift, 
  MapPin, 
  Clock, 
  Star, 
  Award,
  PlayCircle,
  Download,
  Smartphone,
  User,
  Heart,
  TrendingUp
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';

type Language = 'en' | 'hi' | 'pa' | 'bn';

interface HealthWorkerPortalProps {
  language: Language;
  user: any;
}

const translations = {
  en: {
    dashboard: {
      title: 'Health Worker Dashboard',
      welcome: 'Welcome back',
      todaysGoal: "Today's Goals",
      weeklyStats: 'Weekly Statistics',
      incentiveWallet: 'Incentive Wallet'
    },
    tabs: {
      dashboard: 'Dashboard',
      patients: 'My Patients',
      tasks: 'Daily Tasks',
      training: 'Training',
      incentives: 'Incentives'
    },
    patients: {
      title: 'Assigned Patients',
      totalAssigned: 'Total Assigned',
      pendingVisits: 'Pending Visits',
      completed: 'Completed This Week',
      viewProfile: 'View Profile',
      scheduleVisit: 'Schedule Visit',
      emergency: 'Emergency',
      routine: 'Routine',
      followup: 'Follow-up'
    },
    tasks: {
      title: 'Daily Checklist',
      pending: 'Pending Tasks',
      completed: 'Completed Tasks',
      markComplete: 'Mark Complete',
      voiceInstructions: 'Voice Instructions',
      getDirections: 'Get Directions'
    },
    training: {
      title: 'Training Modules',
      progress: 'Your Progress',
      available: 'Available Courses',
      completed: 'Completed',
      inProgress: 'In Progress',
      locked: 'Locked',
      startCourse: 'Start Course',
      continueCourse: 'Continue Course',
      downloadOffline: 'Download for Offline',
      arGuided: 'AR Guided',
      video: 'Video',
      interactive: 'Interactive'
    },
    incentives: {
      title: 'Blockchain Incentive Wallet',
      currentBalance: 'Current Balance',
      thisMonth: 'This Month Earned',
      totalEarned: 'Total Earned',
      redeemTokens: 'Redeem Tokens',
      transactionHistory: 'Transaction History',
      leaderboard: 'Community Leaderboard',
      yourRank: 'Your Rank',
      points: 'points',
      tokens: 'tokens'
    }
  },
  hi: {
    dashboard: {
      title: 'स्वास्थ्य कार्यकर्ता डैशबोर्ड',
      welcome: 'वापसी पर स्वागत',
      todaysGoal: 'आज के लक्ष्य',
      weeklyStats: 'साप्ताहिक आंकड़े',
      incentiveWallet: 'प्रोत्साहन वॉलेट'
    }
  }
};

export function HealthWorkerPortal({ language, user }: HealthWorkerPortalProps) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  
  const t = translations[language] || translations.en;

  const assignedPatients = [
    {
      id: 1,
      name: 'Priya Sharma',
      age: 45,
      condition: 'Diabetes',
      lastVisit: '2024-01-10',
      nextVisit: '2024-01-20',
      priority: 'routine',
      village: 'Kamalpur'
    },
    {
      id: 2,
      name: 'Raj Patel',
      age: 67,
      condition: 'Hypertension',
      lastVisit: '2024-01-08',
      nextVisit: '2024-01-18',
      priority: 'followup',
      village: 'Surajpur'
    },
    {
      id: 3,
      name: 'Meera Singh',
      age: 32,
      condition: 'Pregnancy Care',
      lastVisit: '2024-01-12',
      nextVisit: 'Today',
      priority: 'emergency',
      village: 'Rampur'
    },
    {
      id: 4,
      name: 'Suresh Kumar',
      age: 55,
      condition: 'Heart Disease',
      lastVisit: '2024-01-05',
      nextVisit: '2024-01-19',
      priority: 'routine',
      village: 'Ganeshpur'
    }
  ];

  const dailyTasks = [
    {
      id: 1,
      title: 'Visit Priya Sharma - Diabetes Checkup',
      location: 'Kamalpur Village',
      estimatedTime: '30 mins',
      instructions: 'Check blood sugar, review medication compliance, measure weight',
      priority: 'high'
    },
    {
      id: 2,
      title: 'Vaccination Drive - Children under 5',
      location: 'Village School, Surajpur',
      estimatedTime: '2 hours',
      instructions: 'Administer routine vaccinations, maintain records',
      priority: 'medium'
    },
    {
      id: 3,
      title: 'Health Education Session',
      location: 'Community Center, Rampur',
      estimatedTime: '1 hour',
      instructions: 'Hygiene and sanitation awareness session for mothers',
      priority: 'medium'
    },
    {
      id: 4,
      title: 'Medicine Inventory Check',
      location: 'Health Sub-center',
      estimatedTime: '45 mins',
      instructions: 'Count medicines, check expiry dates, update records',
      priority: 'low'
    }
  ];

  const trainingModules = [
    {
      id: 1,
      title: 'Basic Life Support (BLS)',
      progress: 100,
      status: 'completed',
      type: 'video',
      duration: '2 hours',
      points: 150
    },
    {
      id: 2,
      title: 'Maternal Health Care',
      progress: 65,
      status: 'inProgress',
      type: 'arGuided',
      duration: '3 hours',
      points: 200
    },
    {
      id: 3,
      title: 'Child Nutrition Assessment',
      progress: 0,
      status: 'available',
      type: 'interactive',
      duration: '1.5 hours',
      points: 120
    },
    {
      id: 4,
      title: 'Emergency Response Protocol',
      progress: 0,
      status: 'locked',
      type: 'video',
      duration: '2.5 hours',
      points: 180,
      requirement: 'Complete Basic Life Support first'
    }
  ];

  const incentiveData = {
    currentBalance: 2450,
    thisMonthEarned: 450,
    totalEarned: 12750,
    rank: 3,
    transactions: [
      { date: '2024-01-15', activity: 'Patient Visit Completed', points: 50 },
      { date: '2024-01-14', activity: 'Training Module Completed', points: 150 },
      { date: '2024-01-13', activity: 'Health Education Session', points: 75 },
      { date: '2024-01-12', activity: 'Emergency Response', points: 200 }
    ]
  };

  const leaderboard = [
    { rank: 1, name: 'Rajesh Kumar', points: 3200, village: 'Bharatpur' },
    { rank: 2, name: 'Sunita Devi', points: 2800, village: 'Ramgarh' },
    { rank: 3, name: user?.name || 'You', points: 2450, village: 'Your Area', isUser: true },
    { rank: 4, name: 'Mohan Singh', points: 2100, village: 'Surajpur' },
    { rank: 5, name: 'Priya Patel', points: 1950, village: 'Kamalpur' }
  ];

  const markTaskComplete = (taskId: string) => {
    if (!completedTasks.includes(taskId)) {
      setCompletedTasks([...completedTasks, taskId]);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'emergency': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'routine':
      case 'low': return 'text-green-600 bg-green-100';
      case 'followup': return 'text-blue-600 bg-blue-100';
      default: return 'text-slate-600 bg-slate-100';
    }
  };

  const renderDashboard = () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl text-slate-900 mb-4">
          {t.dashboard.welcome}, {user?.name || 'Health Worker'}!
        </h2>
        <p className="text-slate-600">Your daily overview and quick stats</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl text-slate-900">24</div>
            <div className="text-sm text-slate-600">{t.patients.totalAssigned}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <Clock className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl text-slate-900">8</div>
            <div className="text-sm text-slate-600">{t.patients.pendingVisits}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <CheckSquare className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl text-slate-900">16</div>
            <div className="text-sm text-slate-600">{t.patients.completed}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <Gift className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl text-slate-900">{incentiveData.currentBalance}</div>
            <div className="text-sm text-slate-600">{t.incentives.tokens}</div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Goals */}
      <Card>
        <CardHeader>
          <CardTitle>{t.dashboard.todaysGoal}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Patient Visits</span>
              <span className="text-sm text-slate-600">4/6 completed</span>
            </div>
            <Progress value={67} className="h-2" />
            
            <div className="flex justify-between items-center">
              <span>Training Progress</span>
              <span className="text-sm text-slate-600">2/3 modules</span>
            </div>
            <Progress value={67} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {incentiveData.transactions.slice(0, 3).map((transaction, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div>
                  <div className="font-medium">{transaction.activity}</div>
                  <div className="text-sm text-slate-600">{transaction.date}</div>
                </div>
                <Badge variant="secondary">+{transaction.points} points</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderPatients = () => (
    <div className="space-y-6">
      <h2 className="text-2xl text-slate-900">{t.patients.title}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assignedPatients.map((patient) => (
          <Card key={patient.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{patient.name}</CardTitle>
                    <p className="text-sm text-slate-600">{patient.age} years</p>
                  </div>
                </div>
                <Badge className={getPriorityColor(patient.priority)}>
                  {patient.priority}
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
                  <span className="text-sm text-slate-600">Village: </span>
                  <span>{patient.village}</span>
                </div>
                <div>
                  <span className="text-sm text-slate-600">Next Visit: </span>
                  <span className={patient.nextVisit === 'Today' ? 'text-red-600 font-medium' : ''}>
                    {patient.nextVisit}
                  </span>
                </div>
                <div className="flex space-x-2 pt-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    {t.patients.viewProfile}
                  </Button>
                  <Button size="sm" className="flex-1">
                    {t.patients.scheduleVisit}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderTasks = () => (
    <div className="space-y-6">
      <h2 className="text-2xl text-slate-900">{t.tasks.title}</h2>
      
      <div className="space-y-4">
        {dailyTasks.map((task) => {
          const isCompleted = completedTasks.includes(task.id.toString());
          
          return (
            <Card key={task.id} className={isCompleted ? 'bg-green-50 border-green-200' : ''}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className={`text-lg ${isCompleted ? 'line-through text-slate-500' : ''}`}>
                        {task.title}
                      </h3>
                      <Badge className={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 text-sm text-slate-600">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        {task.location}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        {task.estimatedTime}
                      </div>
                      <p className="mt-2">{task.instructions}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-2 ml-4">
                    {!isCompleted ? (
                      <>
                        <Button 
                          size="sm" 
                          onClick={() => markTaskComplete(task.id.toString())}
                        >
                          <CheckSquare className="h-4 w-4 mr-2" />
                          {t.tasks.markComplete}
                        </Button>
                        <Button size="sm" variant="outline">
                          <Smartphone className="h-4 w-4 mr-2" />
                          {t.tasks.voiceInstructions}
                        </Button>
                        <Button size="sm" variant="outline">
                          <MapPin className="h-4 w-4 mr-2" />
                          {t.tasks.getDirections}
                        </Button>
                      </>
                    ) : (
                      <Badge className="bg-green-100 text-green-800">
                        Completed ✓
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );

  const renderTraining = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl text-slate-900">{t.training.title}</h2>
        <Badge variant="secondary">
          Overall Progress: {Math.round((trainingModules.filter(m => m.status === 'completed').length / trainingModules.length) * 100)}%
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {trainingModules.map((module) => (
          <Card key={module.id} className={module.status === 'locked' ? 'opacity-60' : ''}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{module.title}</CardTitle>
                  <p className="text-sm text-slate-600">{module.duration}</p>
                </div>
                <div className="flex items-center space-x-2">
                  {module.type === 'arGuided' && <Smartphone className="h-4 w-4 text-purple-600" />}
                  {module.type === 'video' && <PlayCircle className="h-4 w-4 text-blue-600" />}
                  {module.type === 'interactive' && <Star className="h-4 w-4 text-orange-600" />}
                  <Badge variant="outline">{module.points} pts</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {module.status !== 'locked' && (
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progress</span>
                      <span>{module.progress}%</span>
                    </div>
                    <Progress value={module.progress} className="h-2" />
                  </div>
                )}
                
                {module.status === 'locked' && (
                  <p className="text-sm text-slate-500">{module.requirement}</p>
                )}
                
                <div className="flex space-x-2">
                  {module.status === 'available' && (
                    <Button size="sm" className="flex-1">
                      <PlayCircle className="h-4 w-4 mr-2" />
                      {t.training.startCourse}
                    </Button>
                  )}
                  
                  {module.status === 'inProgress' && (
                    <Button size="sm" className="flex-1">
                      <PlayCircle className="h-4 w-4 mr-2" />
                      {t.training.continueCourse}
                    </Button>
                  )}
                  
                  {module.status === 'completed' && (
                    <Badge className="bg-green-100 text-green-800 flex-1 justify-center">
                      <Award className="h-4 w-4 mr-2" />
                      {t.training.completed}
                    </Badge>
                  )}
                  
                  {module.status !== 'locked' && (
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      {t.training.downloadOffline}
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

  const renderIncentives = () => (
    <div className="space-y-6">
      <h2 className="text-2xl text-slate-900">{t.incentives.title}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <Gift className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <div className="text-3xl text-slate-900 mb-2">{incentiveData.currentBalance}</div>
            <div className="text-slate-600">{t.incentives.currentBalance}</div>
            <Button className="mt-4" size="sm">
              {t.incentives.redeemTokens}
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <TrendingUp className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <div className="text-3xl text-slate-900 mb-2">{incentiveData.thisMonthEarned}</div>
            <div className="text-slate-600">{t.incentives.thisMonth}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <Award className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <div className="text-3xl text-slate-900 mb-2">#{incentiveData.rank}</div>
            <div className="text-slate-600">{t.incentives.yourRank}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Transaction History */}
        <Card>
          <CardHeader>
            <CardTitle>{t.incentives.transactionHistory}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {incentiveData.transactions.map((transaction, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <div className="font-medium">{transaction.activity}</div>
                    <div className="text-sm text-slate-600">{transaction.date}</div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    +{transaction.points}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Leaderboard */}
        <Card>
          <CardHeader>
            <CardTitle>{t.incentives.leaderboard}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {leaderboard.map((entry) => (
                <div 
                  key={entry.rank} 
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    entry.isUser ? 'bg-emerald-50 border border-emerald-200' : 'bg-slate-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      entry.rank <= 3 ? 'bg-yellow-100 text-yellow-600' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {entry.rank}
                    </div>
                    <div>
                      <div className={`font-medium ${entry.isUser ? 'text-emerald-600' : ''}`}>
                        {entry.name}
                      </div>
                      <div className="text-sm text-slate-600">{entry.village}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{entry.points}</div>
                    <div className="text-sm text-slate-600">{t.incentives.points}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const tabs = [
    { id: 'dashboard', label: t.tabs.dashboard, icon: Heart },
    { id: 'patients', label: t.tabs.patients, icon: Users },
    { id: 'tasks', label: t.tabs.tasks, icon: CheckSquare },
    { id: 'training', label: t.tabs.training, icon: BookOpen },
    { id: 'incentives', label: t.tabs.incentives, icon: Gift }
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
          {activeTab === 'patients' && renderPatients()}
          {activeTab === 'tasks' && renderTasks()}
          {activeTab === 'training' && renderTraining()}
          {activeTab === 'incentives' && renderIncentives()}
        </div>
      </div>
    </div>
  );
}