/**
 * Simplified PWA utility class
 */

/**
 * Register Service Worker
 */
export async function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered successfully');
      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      return null;
    }
  }
  return null;
}

/**
 * Clean up expired cache
 */
export async function cleanupExpiredCache() {
  if ('caches' in window) {
    try {
      const cacheNames = await caches.keys();
      const validCaches = ['fea-app-v1'];
      
      await Promise.all(
        cacheNames
          .filter(name => !validCaches.includes(name))
          .map(name => caches.delete(name))
      );
      
      console.log('Cache cleanup completed');
    } catch (error) {
      console.error('Cache cleanup failed:', error);
    }
  }
}