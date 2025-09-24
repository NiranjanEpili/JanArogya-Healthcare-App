// Enhanced Offline Manager for Complete App Functionality
export class EnhancedOfflineManager {
  private static instance: EnhancedOfflineManager;
  private db: IDBDatabase | null = null;
  private isOnline: boolean = navigator.onLine;
  private syncQueue: Array<{ id: string; action: string; data: any; timestamp: number }> = [];
  private healthData: Map<string, any> = new Map();
  private listeners: Set<(isOnline: boolean) => void> = new Set();

  private constructor() {
    this.initDB();
    this.setupNetworkListeners();
    this.loadFromStorage();
  }

  static getInstance(): EnhancedOfflineManager {
    if (!EnhancedOfflineManager.instance) {
      EnhancedOfflineManager.instance = new EnhancedOfflineManager();
    }
    return EnhancedOfflineManager.instance;
  }

  private async initDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('JanArogyaOfflineDB', 2);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Create object stores for different data types
        if (!db.objectStoreNames.contains('patients')) {
          const patientStore = db.createObjectStore('patients', { keyPath: 'id' });
          patientStore.createIndex('familyId', 'familyId', { unique: false });
        }

        if (!db.objectStoreNames.contains('appointments')) {
          const appointmentStore = db.createObjectStore('appointments', { keyPath: 'id' });
          appointmentStore.createIndex('patientId', 'patientId', { unique: false });
          appointmentStore.createIndex('date', 'date', { unique: false });
        }

        if (!db.objectStoreNames.contains('prescriptions')) {
          const prescriptionStore = db.createObjectStore('prescriptions', { keyPath: 'id' });
          prescriptionStore.createIndex('patientId', 'patientId', { unique: false });
        }

        if (!db.objectStoreNames.contains('healthRecords')) {
          const healthStore = db.createObjectStore('healthRecords', { keyPath: 'id' });
          healthStore.createIndex('patientId', 'patientId', { unique: false });
          healthStore.createIndex('timestamp', 'timestamp', { unique: false });
        }

        if (!db.objectStoreNames.contains('syncQueue')) {
          db.createObjectStore('syncQueue', { keyPath: 'id' });
        }

        if (!db.objectStoreNames.contains('voiceCommands')) {
          const voiceStore = db.createObjectStore('voiceCommands', { keyPath: 'id' });
          voiceStore.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };
    });
  }

  private setupNetworkListeners(): void {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.notifyListeners(true);
      this.processSyncQueue();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.notifyListeners(false);
    });
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem('janArogyaOfflineData');
      if (stored) {
        const data = JSON.parse(stored);
        this.healthData = new Map(data.healthData || []);
        this.syncQueue = data.syncQueue || [];
      }
    } catch (error) {
      console.error('Error loading offline data:', error);
    }
  }

  private saveToStorage(): void {
    try {
      const data = {
        healthData: Array.from(this.healthData.entries()),
        syncQueue: this.syncQueue,
        timestamp: Date.now()
      };
      localStorage.setItem('janArogyaOfflineData', JSON.stringify(data));
    } catch (error) {
      console.error('Error saving offline data:', error);
    }
  }

  // Network status management
  isNetworkOnline(): boolean {
    return this.isOnline;
  }

  addNetworkListener(callback: (isOnline: boolean) => void): void {
    this.listeners.add(callback);
  }

  removeNetworkListener(callback: (isOnline: boolean) => void): void {
    this.listeners.delete(callback);
  }

  private notifyListeners(isOnline: boolean): void {
    this.listeners.forEach(callback => callback(isOnline));
  }

  // Database operations
  async storeData(storeName: string, data: any): Promise<void> {
    if (!this.db) await this.initDB();
    
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not available'));
        return;
      }

      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put({ ...data, offlineTimestamp: Date.now() });

      request.onsuccess = () => {
        this.saveToStorage();
        resolve();
      };
      request.onerror = () => reject(request.error);
    });
  }

  async getData(storeName: string, id?: string): Promise<any> {
    if (!this.db) await this.initDB();
    
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not available'));
        return;
      }

      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      
      let request: IDBRequest;
      if (id) {
        request = store.get(id);
      } else {
        request = store.getAll();
      }

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Patient management (offline-capable)
  async addPatient(patientData: any): Promise<string> {
    const id = `patient_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const patient = {
      id,
      ...patientData,
      createdAt: new Date().toISOString(),
      syncStatus: 'pending'
    };

    await this.storeData('patients', patient);
    
    if (!this.isOnline) {
      this.addToSyncQueue('create_patient', patient);
    }

    return id;
  }

  async getPatients(familyId?: string): Promise<any[]> {
    const patients = await this.getData('patients');
    if (familyId) {
      return patients.filter((p: any) => p.familyId === familyId);
    }
    return patients || [];
  }

  // Appointment management (offline-capable)
  async bookAppointment(appointmentData: any): Promise<string> {
    const id = `appointment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const appointment = {
      id,
      ...appointmentData,
      bookedAt: new Date().toISOString(),
      status: 'pending',
      syncStatus: 'pending'
    };

    await this.storeData('appointments', appointment);
    
    if (!this.isOnline) {
      this.addToSyncQueue('book_appointment', appointment);
    }

    return id;
  }

  async getAppointments(patientId?: string): Promise<any[]> {
    const appointments = await this.getData('appointments');
    if (patientId) {
      return appointments.filter((a: any) => a.patientId === patientId);
    }
    return appointments || [];
  }

  // Prescription management (offline-capable)
  async savePrescription(prescriptionData: any): Promise<string> {
    const id = `prescription_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const prescription = {
      id,
      ...prescriptionData,
      createdAt: new Date().toISOString(),
      syncStatus: 'pending'
    };

    await this.storeData('prescriptions', prescription);
    
    if (!this.isOnline) {
      this.addToSyncQueue('save_prescription', prescription);
    }

    return id;
  }

  async getPrescriptions(patientId?: string): Promise<any[]> {
    const prescriptions = await this.getData('prescriptions');
    if (patientId) {
      return prescriptions.filter((p: any) => p.patientId === patientId);
    }
    return prescriptions || [];
  }

  // Health records management (offline-capable)
  async addHealthRecord(recordData: any): Promise<string> {
    const id = `health_record_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const record = {
      id,
      ...recordData,
      timestamp: new Date().toISOString(),
      syncStatus: 'pending'
    };

    await this.storeData('healthRecords', record);
    
    if (!this.isOnline) {
      this.addToSyncQueue('add_health_record', record);
    }

    return id;
  }

  async getHealthRecords(patientId?: string): Promise<any[]> {
    const records = await this.getData('healthRecords');
    if (patientId) {
      return records.filter((r: any) => r.patientId === patientId);
    }
    return records || [];
  }

  // Voice commands storage (for offline processing)
  async storeVoiceCommand(command: string, response: string, language: string): Promise<void> {
    const id = `voice_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const voiceData = {
      id,
      command,
      response,
      language,
      timestamp: new Date().toISOString()
    };

    await this.storeData('voiceCommands', voiceData);
  }

  async getVoiceHistory(limit: number = 50): Promise<any[]> {
    const commands = await this.getData('voiceCommands');
    return (commands || [])
      .sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }

  // Emergency SOS (always works offline)
  async triggerEmergencySOS(location?: { lat: number; lng: number }): Promise<string> {
    const sosId = `sos_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const sosData = {
      id: sosId,
      timestamp: new Date().toISOString(),
      location: location || await this.getCurrentLocation(),
      status: 'active',
      type: 'emergency',
      syncStatus: 'priority' // High priority for sync
    };

    await this.storeData('emergencies', sosData);
    
    // Always try to sync emergency immediately
    this.addToSyncQueue('emergency_sos', sosData, 'high');
    
    if (this.isOnline) {
      this.processSyncQueue();
    }

    return sosId;
  }

  private async getCurrentLocation(): Promise<{ lat: number; lng: number } | null> {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(null);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        () => resolve(null),
        { timeout: 5000 }
      );
    });
  }

  // Sync queue management
  private addToSyncQueue(action: string, data: any, priority: 'high' | 'normal' = 'normal'): void {
    const queueItem = {
      id: `sync_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      action,
      data,
      timestamp: Date.now(),
      priority,
      retryCount: 0
    };

    if (priority === 'high') {
      this.syncQueue.unshift(queueItem);
    } else {
      this.syncQueue.push(queueItem);
    }

    this.saveToStorage();
  }

  async processSyncQueue(): Promise<void> {
    if (!this.isOnline || this.syncQueue.length === 0) return;

    console.log(`Processing ${this.syncQueue.length} sync items...`);

    const itemsToSync = [...this.syncQueue];
    
    for (const item of itemsToSync) {
      try {
        // Simulate API sync (replace with actual API calls)
        console.log(`Syncing ${item.action}:`, item.data);
        
        // Remove from queue on successful sync
        this.syncQueue = this.syncQueue.filter(q => q.id !== item.id);
        
        // Update local data sync status
        await this.updateSyncStatus(item.data.id, 'synced');
        
      } catch (error) {
        console.error(`Failed to sync ${item.action}:`, error);
        
        // Increment retry count
        const queueItem = this.syncQueue.find(q => q.id === item.id);
        if (queueItem) {
          queueItem.retryCount += 1;
          
          // Remove if too many retries
          if (queueItem.retryCount > 3) {
            this.syncQueue = this.syncQueue.filter(q => q.id !== item.id);
            await this.updateSyncStatus(item.data.id, 'failed');
          }
        }
      }
    }

    this.saveToStorage();
  }

  private async updateSyncStatus(dataId: string, status: 'pending' | 'synced' | 'failed'): Promise<void> {
    // Update sync status in all relevant stores
    const stores = ['patients', 'appointments', 'prescriptions', 'healthRecords'];
    
    for (const storeName of stores) {
      try {
        const item = await this.getData(storeName, dataId);
        if (item) {
          item.syncStatus = status;
          await this.storeData(storeName, item);
        }
      } catch (error) {
        // Item not in this store, continue
      }
    }
  }

  // Smart offline responses for voice assistant
  getOfflineHealthAdvice(symptoms: string[], language: string = 'en'): string {
    const advice = {
      en: {
        fever: "For fever: Rest, drink fluids, monitor temperature. If above 102°F or persists 3+ days, seek medical help when connectivity returns.",
        headache: "For headache: Rest in dark room, stay hydrated, avoid screens. If severe or with vision changes, use emergency services.",
        stomachache: "For stomach pain: Avoid solid foods, sip water slowly. If severe pain, vomiting, or signs of dehydration, seek immediate help.",
        general: "Monitor symptoms, stay hydrated, rest well. Your symptoms are recorded offline and will sync when connected. Use emergency services if conditions worsen."
      },
      hi: {
        fever: "बुखार के लिए: आराम करें, तरल पदार्थ लें, तापमान की निगरानी करें। 102°F से ऊपर या 3+ दिन तक रहने पर चिकित्सा सहायता लें।",
        headache: "सिरदर्द के लिए: अंधेरे कमरे में आराम करें, हाइड्रेटेड रहें। गंभीर या दृष्टि परिवर्तन के साथ हो तो आपातकालीन सेवा का उपयोग करें।",
        stomachache: "पेट दर्द के लिए: ठोस भोजन से बचें, धीरे-धीरे पानी पिएं। तेज़ दर्द या उल्टी के साथ हो तो तत्काल सहायता लें।",
        general: "लक्षणों की निगरानी करें, हाइड्रेटेड रहें, अच्छा आराम करें। आपके लक्षण ऑफलाइन रिकॉर्ड हैं और कनेक्टिविटी वापस आने पर सिंक हो जाएंगे।"
      }
    };

    const langAdvice = advice[language as keyof typeof advice] || advice.en;
    
    // Check for specific symptoms
    const lowerSymptoms = symptoms.join(' ').toLowerCase();
    if (lowerSymptoms.includes('fever') || lowerSymptoms.includes('बुखार')) {
      return langAdvice.fever;
    } else if (lowerSymptoms.includes('headache') || lowerSymptoms.includes('सिरदर्द')) {
      return langAdvice.headache;
    } else if (lowerSymptoms.includes('stomach') || lowerSymptoms.includes('पेट')) {
      return langAdvice.stomachache;
    } else {
      return langAdvice.general;
    }
  }

  // Get sync queue status
  getSyncStatus(): { pending: number; failed: number; total: number } {
    const pending = this.syncQueue.filter(item => item.retryCount < 3).length;
    const failed = this.syncQueue.filter(item => item.retryCount >= 3).length;
    
    return {
      pending,
      failed,
      total: this.syncQueue.length
    };
  }

  // Clear all offline data (for testing/reset)
  async clearOfflineData(): Promise<void> {
    if (this.db) {
      const stores = ['patients', 'appointments', 'prescriptions', 'healthRecords', 'syncQueue', 'voiceCommands'];
      
      for (const storeName of stores) {
        const transaction = this.db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        await new Promise((resolve, reject) => {
          const request = store.clear();
          request.onsuccess = () => resolve(undefined);
          request.onerror = () => reject(request.error);
        });
      }
    }

    this.syncQueue = [];
    this.healthData.clear();
    localStorage.removeItem('janArogyaOfflineData');
  }
}

// Export singleton instance
export const enhancedOfflineManager = {
  initialize: () => {
    console.log('Enhanced offline manager initialized');
    return Promise.resolve();
  },
  
  isOnline: () => navigator.onLine,
  
  cacheData: async (key: string, data: any) => {
    try {
      localStorage.setItem(`janarogya_enhanced_${key}`, JSON.stringify({
        data,
        timestamp: Date.now(),
        version: '1.0'
      }));
      return true;
    } catch (error) {
      console.warn('Enhanced cache failed:', error);
      return false;
    }
  },
  
  getCachedData: async (key: string) => {
    try {
      const cached = localStorage.getItem(`janarogya_enhanced_${key}`);
      if (!cached) return null;
      
      const parsed = JSON.parse(cached);
      
      // Check if data is still valid (24 hours)
      const isValid = Date.now() - parsed.timestamp < 24 * 60 * 60 * 1000;
      if (!isValid) {
        localStorage.removeItem(`janarogya_enhanced_${key}`);
        return null;
      }
      
      return parsed.data;
    } catch (error) {
      console.warn('Enhanced cache retrieval failed:', error);
      return null;
    }
  },

  syncWhenOnline: async () => {
    if (!navigator.onLine) return false;
    
    console.log('Syncing offline data...');
    // Simulate sync process
    return new Promise(resolve => {
      setTimeout(() => {
        console.log('Sync completed');
        resolve(true);
      }, 1000);
    });
  }
};

export default enhancedOfflineManager;