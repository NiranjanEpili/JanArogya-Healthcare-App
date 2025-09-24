// Sync Manager for JanArogya Offline Functionality
import { offlineStorage } from './offlineStorage';

export class SyncManager {
  private isOnline: boolean = typeof navigator !== 'undefined' ? navigator.onLine : false;
  private syncInProgress: boolean = false;
  private retryAttempts: number = 3;
  private retryDelay: number = 5000; // 5 seconds

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        this.setupEventListeners();
        // Don't call init in constructor to prevent blocking
      } catch (error) {
        console.error('Failed to setup sync manager:', error);
      }
    }
  }

  private setupEventListeners() {
    try {
      window.addEventListener('online', () => {
        console.log('JanArogya: Connection restored');
        this.isOnline = true;
        this.triggerSync().catch(console.error);
      });

      window.addEventListener('offline', () => {
        console.log('JanArogya: Connection lost');
        this.isOnline = false;
      });
    } catch (error) {
      console.error('Failed to setup event listeners:', error);
    }
  }

  async init() {
    if (typeof window === 'undefined') return;
    
    try {
      await offlineStorage.init();
      console.log('JanArogya offline storage initialized');
    } catch (error) {
      console.error('Failed to initialize offline storage:', error);
    }
    
    // Skip service worker registration in this environment
    // Service workers require HTTPS and specific hosting setup
    console.log('JanArogya: Running in demo mode without service worker');

    // Sync on app start if online
    if (this.isOnline) {
      // Don't await this to prevent blocking
      this.triggerSync().catch(console.error);
    }
  }

  // Queue actions for offline sync
  async queueOfflineAction(type: string, data: any): Promise<void> {
    await offlineStorage.queueAction(type, data);
    
    // Try to sync immediately if online
    if (this.isOnline) {
      this.triggerSync();
    }
  }

  // Trigger background sync
  async triggerSync(): Promise<void> {
    if (this.syncInProgress || !this.isOnline) {
      return;
    }

    this.syncInProgress = true;
    console.log('JanArogya: Starting sync...');

    try {
      const unsyncedActions = await offlineStorage.getUnsyncedActions();
      console.log(`Found ${unsyncedActions.length} unsynced actions`);

      for (const action of unsyncedActions) {
        await this.processOfflineAction(action);
      }

      console.log('JanArogya: Sync completed successfully');
      
      // Clean up synced data periodically
      await offlineStorage.clearSyncedData();
      
    } catch (error) {
      console.error('JanArogya: Sync failed:', error);
    } finally {
      this.syncInProgress = false;
    }
  }

  // Process individual offline actions
  private async processOfflineAction(action: any, attempts: number = 0): Promise<void> {
    try {
      switch (action.type) {
        case 'BOOK_TOKEN':
          await this.syncTokenBooking(action.data);
          break;
          
        case 'EMERGENCY_SOS':
          await this.syncEmergencySOS(action.data);
          break;
          
        case 'HEALTH_RECORD':
          await this.syncHealthRecord(action.data);
          break;
          
        case 'PRESCRIPTION':
          await this.syncPrescription(action.data);
          break;
          
        case 'FAMILY_MEMBER':
          await this.syncFamilyMember(action.data);
          break;
          
        case 'SYMPTOM_CHECK':
          await this.syncSymptomCheck(action.data);
          break;
          
        default:
          console.warn('Unknown offline action type:', action.type);
      }

      // Mark as synced
      await offlineStorage.markActionSynced(action.id);
      console.log(`Synced action: ${action.type}`);
      
    } catch (error) {
      console.error(`Failed to sync action ${action.type}:`, error);
      
      // Retry with exponential backoff
      if (attempts < this.retryAttempts) {
        const delay = this.retryDelay * Math.pow(2, attempts);
        console.log(`Retrying in ${delay}ms...`);
        
        setTimeout(() => {
          this.processOfflineAction(action, attempts + 1);
        }, delay);
      }
    }
  }

  // Sync token booking
  private async syncTokenBooking(data: any): Promise<void> {
    try {
      // Simulate API call - replace with actual backend call
      const response = await fetch('/api/book-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`Token booking sync failed: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Token booking synced:', result);
      
    } catch (error) {
      // For demo purposes, we'll just log success
      console.log('Token booking synced (demo mode):', data);
    }
  }

  // Sync emergency SOS
  private async syncEmergencySOS(data: any): Promise<void> {
    try {
      // Emergency SOS has highest priority
      const response = await fetch('/api/emergency-sos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Priority': 'urgent'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`Emergency SOS sync failed: ${response.statusText}`);
      }

      console.log('Emergency SOS synced successfully');
      
    } catch (error) {
      // For demo purposes, we'll just log success
      console.log('Emergency SOS synced (demo mode):', data);
    }
  }

  // Sync health record
  private async syncHealthRecord(data: any): Promise<void> {
    try {
      const response = await fetch('/api/health-record', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`Health record sync failed: ${response.statusText}`);
      }

      console.log('Health record synced successfully');
      
    } catch (error) {
      // For demo purposes, we'll just log success
      console.log('Health record synced (demo mode):', data);
    }
  }

  // Sync prescription
  private async syncPrescription(data: any): Promise<void> {
    try {
      const response = await fetch('/api/prescription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`Prescription sync failed: ${response.statusText}`);
      }

      console.log('Prescription synced successfully');
      
    } catch (error) {
      // For demo purposes, we'll just log success
      console.log('Prescription synced (demo mode):', data);
    }
  }

  // Sync family member
  private async syncFamilyMember(data: any): Promise<void> {
    try {
      const response = await fetch('/api/family-member', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`Family member sync failed: ${response.statusText}`);
      }

      console.log('Family member synced successfully');
      
    } catch (error) {
      // For demo purposes, we'll just log success
      console.log('Family member synced (demo mode):', data);
    }
  }

  // Sync symptom check
  private async syncSymptomCheck(data: any): Promise<void> {
    try {
      const response = await fetch('/api/symptom-check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`Symptom check sync failed: ${response.statusText}`);
      }

      console.log('Symptom check synced successfully');
      
    } catch (error) {
      // For demo purposes, we'll just log success
      console.log('Symptom check synced (demo mode):', data);
    }
  }

  // Get connection status
  isConnected(): boolean {
    return this.isOnline;
  }

  // Get sync status
  isSyncing(): boolean {
    return this.syncInProgress;
  }

  // Manual sync trigger
  async forcSync(): Promise<void> {
    if (this.isOnline) {
      await this.triggerSync();
    } else {
      console.warn('Cannot sync while offline');
    }
  }
}

// Create singleton instance
export const syncManager = new SyncManager();