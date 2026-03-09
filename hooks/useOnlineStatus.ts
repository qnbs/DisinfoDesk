import { useState, useEffect } from 'react';

/**
 * Modern Online/Offline Status Hook
 * Implements Network Information API with fallback
 * Provides connection type and effective bandwidth
 */

export interface NetworkInfo {
  online: boolean;
  effectiveType?: 'slow-2g' | '2g' | '3g' | '4g';
  downlink?: number;
  rtt?: number;
  saveData?: boolean;
}

export const useOnlineStatus = (): NetworkInfo => {
  const [status, setStatus] = useState<NetworkInfo>({
    online: typeof navigator !== 'undefined' ? navigator.onLine : true
  });

  useEffect(() => {
    const updateStatus = () => {
      const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
      
      setStatus({
        online: navigator.onLine,
        effectiveType: connection?.effectiveType,
        downlink: connection?.downlink,
        rtt: connection?.rtt,
        saveData: connection?.saveData
      });
    };

    // Initial update
    updateStatus();

    // Listen to online/offline events
    window.addEventListener('online', updateStatus);
    window.addEventListener('offline', updateStatus);

    // Listen to connection changes (if supported)
    const connection = (navigator as any).connection;
    if (connection) {
      connection.addEventListener('change', updateStatus);
    }

    return () => {
      window.removeEventListener('online', updateStatus);
      window.removeEventListener('offline', updateStatus);
      if (connection) {
        connection.removeEventListener('change', updateStatus);
      }
    };
  }, []);

  return status;
};

export default useOnlineStatus;
