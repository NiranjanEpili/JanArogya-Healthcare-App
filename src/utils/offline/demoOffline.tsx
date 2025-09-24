// Demo offline functionality for JanArogya (no service worker needed)
export class DemoOfflineManager {
  private static instance: DemoOfflineManager;
  private offlineActions: any[] = [];
  private isOnline: boolean = typeof navigator !== 'undefined' ? navigator.onLine : true;

  static getInstance(): DemoOfflineManager {
    if (!DemoOfflineManager.instance) {
      DemoOfflineManager.instance = new DemoOfflineManager();
    }
    return DemoOfflineManager.instance;
  }

  constructor() {
    if (typeof window !== 'undefined') {
      this.setupEventListeners();
      this.loadFromStorage();
    }
  }

  private setupEventListeners() {
    window.addEventListener('online', () => {
      console.log('JanArogya Demo: Connection restored');
      this.isOnline = true;
      this.syncOfflineActions();
    });

    window.addEventListener('offline', () => {
      console.log('JanArogya Demo: Connection lost');
      this.isOnline = false;
    });
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem('janarogya_demo_actions');
      if (stored) {
        this.offlineActions = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load offline actions:', error);
      this.offlineActions = [];
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem('janarogya_demo_actions', JSON.stringify(this.offlineActions));
    } catch (error) {
      console.error('Failed to save offline actions:', error);
    }
  }

  async queueAction(type: string, data: any): Promise<void> {
    const action = {
      id: Date.now(),
      type,
      data,
      timestamp: Date.now(),
      synced: false
    };

    this.offlineActions.push(action);
    this.saveToStorage();
    
    console.log(`JanArogya Demo: Queued offline action - ${type}`);

    // If online, sync immediately
    if (this.isOnline) {
      setTimeout(() => this.syncOfflineActions(), 1000);
    }
  }

  private async syncOfflineActions() {
    if (!this.isOnline || this.offlineActions.length === 0) {
      return;
    }

    console.log(`JanArogya Demo: Syncing ${this.offlineActions.length} offline actions`);

    const actionsToSync = this.offlineActions.filter(action => !action.synced);
    
    for (const action of actionsToSync) {
      try {
        // Simulate API call
        await this.simulateApiCall(action);
        action.synced = true;
        console.log(`JanArogya Demo: Synced ${action.type} successfully`);
      } catch (error) {
        console.error(`JanArogya Demo: Failed to sync ${action.type}:`, error);
      }
    }

    // Remove synced actions
    this.offlineActions = this.offlineActions.filter(action => !action.synced);
    this.saveToStorage();
  }

  private async simulateApiCall(action: any): Promise<void> {
    // Simulate network delay
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`JanArogya Demo: API call simulated for ${action.type}`);
        resolve();
      }, 500);
    });
  }

  getConnectionStatus(): boolean {
    return this.isOnline;
  }

  getPendingActionsCount(): number {
    return this.offlineActions.filter(action => !action.synced).length;
  }

  async forceSync(): Promise<void> {
    if (this.isOnline) {
      await this.syncOfflineActions();
    }
  }
}

// Export singleton instance
export const demoOfflineManager = DemoOfflineManager.getInstance();