import React, { useState } from 'react';
import { 
  Package, 
  QrCode, 
  AlertTriangle, 
  TrendingDown, 
  TrendingUp, 
  RefreshCw,
  ScanLine,
  CheckCircle,
  Clock,
  Pill,
  ShoppingCart,
  BarChart3
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Progress } from './ui/progress';

type Language = 'en' | 'hi' | 'pa' | 'bn';

interface PharmacyPortalProps {
  language: Language;
  user: any;
}

const translations = {
  en: {
    dashboard: {
      title: 'Pharmacy Dashboard',
      welcome: 'Welcome to',
      overview: 'Inventory Overview',
      alerts: 'Stock Alerts',
      recentSales: 'Recent Sales'
    },
    tabs: {
      dashboard: 'Dashboard',
      inventory: 'Live Inventory',
      scanner: 'QR Scanner',
      orders: 'Reorder System',
      analytics: 'Sales Analytics'
    },
    inventory: {
      title: 'IoT-Based Live Stock Levels',
      totalMedicines: 'Total Medicines',
      lowStock: 'Low Stock Items',
      expiringSoon: 'Expiring Soon',
      outOfStock: 'Out of Stock',
      lastUpdated: 'Last Updated',
      autoRefresh: 'Auto Refresh',
      stockLevel: 'Stock Level',
      reorderLevel: 'Reorder Level',
      expiryDate: 'Expiry Date',
      reorder: 'Reorder',
      urgentReorder: 'Urgent Reorder'
    },
    scanner: {
      title: 'QR Prescription Scanner',
      scanQR: 'Scan QR Code',
      verifyPrescription: 'Verify Prescription',
      dispenseMedicine: 'Dispense Medicine',
      prescriptionDetails: 'Prescription Details',
      patient: 'Patient',
      doctor: 'Prescribed by',
      date: 'Date',
      medicines: 'Medicines',
      quantity: 'Quantity',
      dosage: 'Dosage',
      verified: 'Verified',
      invalid: 'Invalid',
      dispensed: 'Dispensed',
      scanAnother: 'Scan Another'
    },
    orders: {
      title: 'Predictive Reorder System',
      pendingOrders: 'Pending Orders',
      orderHistory: 'Order History',
      aiRecommendations: 'AI Recommendations',
      demandForecast: 'Demand Forecast',
      createOrder: 'Create Order',
      approve: 'Approve Order',
      track: 'Track Order',
      supplier: 'Supplier',
      estimatedDelivery: 'Estimated Delivery',
      orderValue: 'Order Value'
    },
    analytics: {
      title: 'Sales & Demand Analytics',
      topSelling: 'Top Selling Medicines',
      salesTrends: 'Sales Trends',
      seasonalDemand: 'Seasonal Demand',
      profitMargins: 'Profit Margins',
      customerPatterns: 'Customer Patterns'
    }
  },
  hi: {
    dashboard: {
      title: 'फार्मेसी डैशबोर्ड',
      welcome: 'स्वागत है',
      overview: 'इन्वेंटरी ओवरव्यू',
      alerts: 'स्टॉक अलर्ट',
      recentSales: 'हाल की बिक्री'
    }
  }
};

export function PharmacyPortal({ language, user }: PharmacyPortalProps) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [scannedPrescription, setScannedPrescription] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  
  const t = translations[language] || translations.en;

  const inventoryData = [
    {
      id: 1,
      name: 'Paracetamol 500mg',
      currentStock: 45,
      reorderLevel: 50,
      totalCapacity: 200,
      expiryDate: '2024-12-15',
      supplier: 'MedSupply Co',
      status: 'low',
      iotSensorId: 'IOT001'
    },
    {
      id: 2,
      name: 'Amoxicillin 250mg',
      currentStock: 12,
      reorderLevel: 30,
      totalCapacity: 150,
      expiryDate: '2024-08-20',
      supplier: 'PharmaCorp',
      status: 'critical',
      iotSensorId: 'IOT002'
    },
    {
      id: 3,
      name: 'Metformin 500mg',
      currentStock: 85,
      reorderLevel: 40,
      totalCapacity: 120,
      expiryDate: '2025-03-10',
      supplier: 'DiabetesCare Ltd',
      status: 'normal',
      iotSensorId: 'IOT003'
    },
    {
      id: 4,
      name: 'Vitamin D3 1000IU',
      currentStock: 0,
      reorderLevel: 25,
      totalCapacity: 100,
      expiryDate: '2024-06-30',
      supplier: 'VitaHealth',
      status: 'outOfStock',
      iotSensorId: 'IOT004'
    },
    {
      id: 5,
      name: 'Cough Syrup 100ml',
      currentStock: 78,
      reorderLevel: 20,
      totalCapacity: 80,
      expiryDate: '2024-05-15',
      supplier: 'ColdCare Pharma',
      status: 'expiring',
      iotSensorId: 'IOT005'
    }
  ];

  const pendingOrders = [
    {
      id: 'ORD001',
      medicine: 'Paracetamol 500mg',
      quantity: 200,
      supplier: 'MedSupply Co',
      orderDate: '2024-01-15',
      estimatedDelivery: '2024-01-18',
      status: 'pending',
      value: 1200
    },
    {
      id: 'ORD002',
      medicine: 'Amoxicillin 250mg',
      quantity: 150,
      supplier: 'PharmaCorp',
      orderDate: '2024-01-14',
      estimatedDelivery: '2024-01-17',
      status: 'shipped',
      value: 2800
    }
  ];

  const recentSales = [
    { medicine: 'Paracetamol 500mg', quantity: 5, time: '10:30 AM', patient: 'Priya S.' },
    { medicine: 'Cough Syrup', quantity: 2, time: '11:15 AM', patient: 'Raj P.' },
    { medicine: 'Vitamin D3', quantity: 1, time: '12:00 PM', patient: 'Meera K.' },
    { medicine: 'Metformin 500mg', quantity: 3, time: '12:45 PM', patient: 'Suresh L.' }
  ];

  const aiRecommendations = [
    {
      medicine: 'Paracetamol 500mg',
      recommendation: 'Order 300 units',
      reason: 'High demand expected due to seasonal flu',
      priority: 'high',
      confidence: 92
    },
    {
      medicine: 'Vitamin D3',
      recommendation: 'Order 150 units',
      reason: 'Stock depleted, regular demand pattern',
      priority: 'urgent',
      confidence: 88
    },
    {
      medicine: 'Cough Syrup',
      recommendation: 'Order 100 units',
      reason: 'Winter season approaching',
      priority: 'medium',
      confidence: 75
    }
  ];

  const mockPrescription = {
    id: 'RX123456',
    patient: 'Priya Sharma',
    doctor: 'Dr. Rajesh Kumar',
    date: '2024-01-15',
    verified: true,
    medicines: [
      { name: 'Paracetamol 500mg', quantity: 10, dosage: '1 tablet twice daily' },
      { name: 'Vitamin D3 1000IU', quantity: 30, dosage: '1 capsule daily' }
    ]
  };

  const scanQRCode = () => {
    setIsScanning(true);
    // Simulate QR scanning
    setTimeout(() => {
      setScannedPrescription(mockPrescription);
      setIsScanning(false);
    }, 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical':
      case 'outOfStock': return 'text-red-600 bg-red-100';
      case 'low': return 'text-orange-600 bg-orange-100';
      case 'expiring': return 'text-yellow-600 bg-yellow-100';
      case 'normal': return 'text-green-600 bg-green-100';
      default: return 'text-slate-600 bg-slate-100';
    }
  };

  const getStockPercentage = (current: number, total: number) => {
    return Math.round((current / total) * 100);
  };

  const renderDashboard = () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl text-slate-900 mb-4">
          {t.dashboard.welcome} {user?.name || 'Pharmacy'}
        </h2>
        <p className="text-slate-600">Real-time inventory management and sales overview</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <Package className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl text-slate-900">{inventoryData.length}</div>
            <div className="text-sm text-slate-600">{t.inventory.totalMedicines}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <TrendingDown className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl text-slate-900">
              {inventoryData.filter(item => item.status === 'low' || item.status === 'critical').length}
            </div>
            <div className="text-sm text-slate-600">{t.inventory.lowStock}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <Clock className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
            <div className="text-2xl text-slate-900">
              {inventoryData.filter(item => item.status === 'expiring').length}
            </div>
            <div className="text-sm text-slate-600">{t.inventory.expiringSoon}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-2" />
            <div className="text-2xl text-slate-900">
              {inventoryData.filter(item => item.status === 'outOfStock').length}
            </div>
            <div className="text-sm text-slate-600">{t.inventory.outOfStock}</div>
          </CardContent>
        </Card>
      </div>

      {/* Stock Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-orange-600" />
            {t.dashboard.alerts}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {inventoryData
              .filter(item => item.status !== 'normal')
              .slice(0, 3)
              .map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Pill className="h-5 w-5 text-slate-600" />
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-slate-600">
                        Stock: {item.currentStock} / {item.totalCapacity} units
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(item.status)}>
                      {item.status}
                    </Badge>
                    <Button size="sm">
                      {t.inventory.reorder}
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Sales */}
      <Card>
        <CardHeader>
          <CardTitle>{t.dashboard.recentSales}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentSales.map((sale, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div>
                  <div className="font-medium">{sale.medicine}</div>
                  <div className="text-sm text-slate-600">
                    Qty: {sale.quantity} • Patient: {sale.patient}
                  </div>
                </div>
                <div className="text-sm text-slate-600">{sale.time}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderInventory = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl text-slate-900">{t.inventory.title}</h2>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="flex items-center">
            <RefreshCw className="h-3 w-3 mr-1" />
            {t.inventory.autoRefresh}
          </Badge>
          <span className="text-sm text-slate-600">
            {t.inventory.lastUpdated}: Just now
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {inventoryData.map((item) => {
          const stockPercentage = getStockPercentage(item.currentStock, item.totalCapacity);
          
          return (
            <Card key={item.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{item.name}</CardTitle>
                  <Badge className={getStatusColor(item.status)}>
                    {item.status}
                  </Badge>
                </div>
                <CardDescription>
                  IoT Sensor: {item.iotSensorId} • {t.inventory.supplier}: {item.supplier}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>{t.inventory.stockLevel}</span>
                      <span>{item.currentStock}/{item.totalCapacity}</span>
                    </div>
                    <Progress value={stockPercentage} className="h-2" />
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">{t.inventory.reorderLevel}:</span>
                      <span>{item.reorderLevel} units</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">{t.inventory.expiryDate}:</span>
                      <span className={
                        new Date(item.expiryDate) < new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
                          ? 'text-yellow-600 font-medium'
                          : ''
                      }>
                        {item.expiryDate}
                      </span>
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    {item.status === 'outOfStock' || item.status === 'critical' ? (
                      <Button size="sm" className="w-full bg-red-600 hover:bg-red-700">
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        {t.inventory.urgentReorder}
                      </Button>
                    ) : item.status === 'low' ? (
                      <Button size="sm" variant="outline" className="w-full">
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        {t.inventory.reorder}
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline" className="w-full" disabled>
                        Stock Adequate
                      </Button>
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

  const renderScanner = () => (
    <div className="space-y-6">
      <h2 className="text-2xl text-slate-900">{t.scanner.title}</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* QR Scanner */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <QrCode className="h-5 w-5 mr-2" />
              {t.scanner.scanQR}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
                {isScanning ? (
                  <div className="space-y-4">
                    <ScanLine className="h-16 w-16 text-blue-600 mx-auto animate-pulse" />
                    <p className="text-slate-600">Scanning QR code...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <QrCode className="h-16 w-16 text-slate-400 mx-auto" />
                    <p className="text-slate-600">Position QR code within frame</p>
                    <Button onClick={scanQRCode}>
                      <ScanLine className="h-4 w-4 mr-2" />
                      Start Scanning
                    </Button>
                  </div>
                )}
              </div>
              
              {scannedPrescription && !isScanning && (
                <div className="space-y-2">
                  <Badge className="bg-green-100 text-green-800 w-full justify-center py-2">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Prescription {t.scanner.verified}
                  </Badge>
                  <Button variant="outline" onClick={() => setScannedPrescription(null)} className="w-full">
                    {t.scanner.scanAnother}
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Prescription Details */}
        {scannedPrescription && (
          <Card>
            <CardHeader>
              <CardTitle>{t.scanner.prescriptionDetails}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-600">{t.scanner.patient}:</span>
                    <div className="font-medium">{scannedPrescription.patient}</div>
                  </div>
                  <div>
                    <span className="text-slate-600">{t.scanner.doctor}:</span>
                    <div className="font-medium">{scannedPrescription.doctor}</div>
                  </div>
                  <div>
                    <span className="text-slate-600">{t.scanner.date}:</span>
                    <div className="font-medium">{scannedPrescription.date}</div>
                  </div>
                  <div>
                    <span className="text-slate-600">Prescription ID:</span>
                    <div className="font-mono text-sm">{scannedPrescription.id}</div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3">{t.scanner.medicines}:</h4>
                  <div className="space-y-3">
                    {scannedPrescription.medicines.map((medicine, index) => (
                      <div key={index} className="p-3 bg-slate-50 rounded-lg">
                        <div className="font-medium">{medicine.name}</div>
                        <div className="text-sm text-slate-600">
                          {t.scanner.quantity}: {medicine.quantity} • {t.scanner.dosage}: {medicine.dosage}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Button className="w-full">
                  <Package className="h-4 w-4 mr-2" />
                  {t.scanner.dispenseMedicine}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="space-y-6">
      <h2 className="text-2xl text-slate-900">{t.orders.title}</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pending Orders */}
        <Card>
          <CardHeader>
            <CardTitle>{t.orders.pendingOrders}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingOrders.map((order) => (
                <div key={order.id} className="p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium">{order.medicine}</div>
                    <Badge className={order.status === 'shipped' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'}>
                      {order.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-slate-600 space-y-1">
                    <div>Quantity: {order.quantity} units</div>
                    <div>{t.orders.supplier}: {order.supplier}</div>
                    <div>{t.orders.estimatedDelivery}: {order.estimatedDelivery}</div>
                    <div>{t.orders.orderValue}: ₹{order.value}</div>
                  </div>
                  <div className="flex space-x-2 mt-3">
                    <Button size="sm" variant="outline" className="flex-1">
                      {t.orders.track}
                    </Button>
                    {order.status === 'pending' && (
                      <Button size="sm" className="flex-1">
                        {t.orders.approve}
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-purple-600" />
              {t.orders.aiRecommendations}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {aiRecommendations.map((recommendation, index) => (
                <div key={index} className="p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium">{recommendation.medicine}</div>
                    <Badge className={
                      recommendation.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                      recommendation.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                      'bg-blue-100 text-blue-800'
                    }>
                      {recommendation.priority}
                    </Badge>
                  </div>
                  <div className="text-sm text-slate-600 mb-2">
                    {recommendation.recommendation}
                  </div>
                  <div className="text-xs text-slate-500 mb-3">
                    Reason: {recommendation.reason}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-600">
                      Confidence: {recommendation.confidence}%
                    </span>
                    <Button size="sm">
                      <ShoppingCart className="h-3 w-3 mr-1" />
                      {t.orders.createOrder}
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

  const renderAnalytics = () => (
    <div className="space-y-6">
      <h2 className="text-2xl text-slate-900">{t.analytics.title}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>{t.analytics.topSelling}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-slate-50 rounded-lg flex items-center justify-center">
              <p className="text-slate-500">Top selling medicines chart would display here</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t.analytics.salesTrends}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-slate-50 rounded-lg flex items-center justify-center">
              <p className="text-slate-500">Sales trends chart would display here</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t.analytics.seasonalDemand}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-slate-50 rounded-lg flex items-center justify-center">
              <p className="text-slate-500">Seasonal demand patterns would display here</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t.analytics.profitMargins}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-slate-50 rounded-lg flex items-center justify-center">
              <p className="text-slate-500">Profit margin analysis would display here</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const tabs = [
    { id: 'dashboard', label: t.tabs.dashboard, icon: Package },
    { id: 'inventory', label: t.tabs.inventory, icon: BarChart3 },
    { id: 'scanner', label: t.tabs.scanner, icon: QrCode },
    { id: 'orders', label: t.tabs.orders, icon: ShoppingCart },
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
          {activeTab === 'inventory' && renderInventory()}
          {activeTab === 'scanner' && renderScanner()}
          {activeTab === 'orders' && renderOrders()}
          {activeTab === 'analytics' && renderAnalytics()}
        </div>
      </div>
    </div>
  );
}