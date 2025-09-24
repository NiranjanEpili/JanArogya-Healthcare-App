// Offline Storage Manager for JanArogya
export class OfflineStorage {
  private dbName = 'JanArogyaOffline';
  private version = 1;
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    if (typeof window === 'undefined' || !window.indexedDB) {
      console.log('IndexedDB not available, using demo mode');
      return Promise.resolve();
    }
    
    return new Promise((resolve, reject) => {
      try {
        const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => {
        console.error('IndexedDB error:', request.error);
        resolve(); // Don't reject, just continue without IndexedDB
      };
      request.onsuccess = () => {
        this.db = request.result;
        console.log('IndexedDB initialized successfully');
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Create object stores
        if (!db.objectStoreNames.contains('actions')) {
          const actionsStore = db.createObjectStore('actions', { keyPath: 'id', autoIncrement: true });
          actionsStore.createIndex('type', 'type', { unique: false });
          actionsStore.createIndex('timestamp', 'timestamp', { unique: false });
        }

        if (!db.objectStoreNames.contains('healthRecords')) {
          const recordsStore = db.createObjectStore('healthRecords', { keyPath: 'id' });
          recordsStore.createIndex('patientId', 'patientId', { unique: false });
          recordsStore.createIndex('date', 'date', { unique: false });
        }

        if (!db.objectStoreNames.contains('prescriptions')) {
          const prescStore = db.createObjectStore('prescriptions', { keyPath: 'id' });
          prescStore.createIndex('patientId', 'patientId', { unique: false });
          prescStore.createIndex('qrCode', 'qrCode', { unique: true });
        }

        if (!db.objectStoreNames.contains('tokens')) {
          const tokensStore = db.createObjectStore('tokens', { keyPath: 'id' });
          tokensStore.createIndex('patientId', 'patientId', { unique: false });
          tokensStore.createIndex('status', 'status', { unique: false });
        }

        if (!db.objectStoreNames.contains('familyMembers')) {
          const familyStore = db.createObjectStore('familyMembers', { keyPath: 'id' });
          familyStore.createIndex('primaryUserId', 'primaryUserId', { unique: false });
        }
      };
      } catch (error) {
        console.error('Failed to open IndexedDB:', error);
        resolve(); // Continue without IndexedDB
      }
    });
  }

  // Queue offline actions for later sync
  async queueAction(type: string, data: any): Promise<void> {
    if (!this.db) await this.init();

    // Fallback to localStorage if IndexedDB not available
    if (!this.db) {
      try {
        const actions = JSON.parse(localStorage.getItem('janarogya_actions') || '[]');
        actions.push({
          id: Date.now(),
          type,
          data,
          timestamp: Date.now(),
          synced: false
        });
        localStorage.setItem('janarogya_actions', JSON.stringify(actions));
        console.log(`Queued offline action (localStorage): ${type}`);
        return;
      } catch (error) {
        console.error('Failed to store action:', error);
        return;
      }
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['actions'], 'readwrite');
      const store = transaction.objectStore('actions');
      
      const action = {
        type,
        data,
        timestamp: Date.now(),
        synced: false
      };

      const request = store.add(action);
      request.onsuccess = () => {
        console.log(`Queued offline action: ${type}`);
        resolve();
      };
      request.onerror = () => {
        console.error('Failed to store action:', request.error);
        resolve(); // Don't fail, just continue
      };
    });
  }

  // Store health records offline
  async storeHealthRecord(record: any): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['healthRecords'], 'readwrite');
      const store = transaction.objectStore('healthRecords');
      
      const request = store.put({
        ...record,
        lastModified: Date.now(),
        synced: false
      });

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Get health records for a patient
  async getHealthRecords(patientId: string): Promise<any[]> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['healthRecords'], 'readonly');
      const store = transaction.objectStore('healthRecords');
      const index = store.index('patientId');
      
      const request = index.getAll(patientId);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Store prescription offline
  async storePrescription(prescription: any): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['prescriptions'], 'readwrite');
      const store = transaction.objectStore('prescriptions');
      
      const request = store.put({
        ...prescription,
        lastModified: Date.now(),
        synced: false
      });

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Get prescriptions for a patient
  async getPrescriptions(patientId: string): Promise<any[]> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['prescriptions'], 'readonly');
      const store = transaction.objectStore('prescriptions');
      const index = store.index('patientId');
      
      const request = index.getAll(patientId);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Store token booking offline
  async storeToken(token: any): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['tokens'], 'readwrite');
      const store = transaction.objectStore('tokens');
      
      const request = store.put({
        ...token,
        lastModified: Date.now(),
        synced: false
      });

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Get user tokens
  async getTokens(patientId: string): Promise<any[]> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['tokens'], 'readonly');
      const store = transaction.objectStore('tokens');
      const index = store.index('patientId');
      
      const request = index.getAll(patientId);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Store family members offline
  async storeFamilyMember(member: any): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['familyMembers'], 'readwrite');
      const store = transaction.objectStore('familyMembers');
      
      const request = store.put({
        ...member,
        lastModified: Date.now(),
        synced: false
      });

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Get family members
  async getFamilyMembers(primaryUserId: string): Promise<any[]> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['familyMembers'], 'readonly');
      const store = transaction.objectStore('familyMembers');
      const index = store.index('primaryUserId');
      
      const request = index.getAll(primaryUserId);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Get all unsynced actions
  async getUnsyncedActions(): Promise<any[]> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['actions'], 'readonly');
      const store = transaction.objectStore('actions');
      
      const request = store.getAll();
      request.onsuccess = () => {
        const unsyncedActions = request.result.filter(action => !action.synced);
        resolve(unsyncedActions);
      };
      request.onerror = () => reject(request.error);
    });
  }

  // Mark action as synced
  async markActionSynced(actionId: number): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['actions'], 'readwrite');
      const store = transaction.objectStore('actions');
      
      const getRequest = store.get(actionId);
      getRequest.onsuccess = () => {
        const action = getRequest.result;
        if (action) {
          action.synced = true;
          const putRequest = store.put(action);
          putRequest.onsuccess = () => resolve();
          putRequest.onerror = () => reject(putRequest.error);
        } else {
          resolve();
        }
      };
      getRequest.onerror = () => reject(getRequest.error);
    });
  }

  // Clear all synced data
  async clearSyncedData(): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['actions'], 'readwrite');
      const store = transaction.objectStore('actions');
      
      const request = store.getAll();
      request.onsuccess = () => {
        const syncedActions = request.result.filter(action => action.synced);
        
        const deletePromises = syncedActions.map(action => {
          return new Promise<void>((res, rej) => {
            const deleteRequest = store.delete(action.id);
            deleteRequest.onsuccess = () => res();
            deleteRequest.onerror = () => rej(deleteRequest.error);
          });
        });

        Promise.all(deletePromises)
          .then(() => resolve())
          .catch(reject);
      };
      request.onerror = () => reject(request.error);
    });
  }
}

// Create singleton instance
export const offlineStorage = new OfflineStorage();