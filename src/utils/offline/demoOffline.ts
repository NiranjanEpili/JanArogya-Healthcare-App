export const demoOfflineManager = {
  initialize: () => {
    console.log('Demo offline manager initialized');
  },
  
  isOnline: () => navigator.onLine,
  
  cacheData: (key: string, data: any) => {
    try {
      localStorage.setItem(`janarogya_${key}`, JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to cache data:', error);
    }
  },
  
  getCachedData: (key: string) => {
    try {
      const data = localStorage.getItem(`janarogya_${key}`);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.warn('Failed to get cached data:', error);
      return null;
    }
  }
};
