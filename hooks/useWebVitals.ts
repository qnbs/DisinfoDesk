import { useEffect } from 'react';

/**
 * Web Vitals Monitoring Hook
 * Tracks Core Web Vitals (LCP, FID, CLS) for performance optimization
 * Follows Google's Web Vitals best practices
 * 
 * Note: Requires 'web-vitals' package to be installed
 * npm install web-vitals
 */

export interface WebVital {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
}

type MetricHandler = (metric: WebVital) => void;

export const useWebVitals = (onMetric?: MetricHandler) => {
  useEffect(() => {
    if (import.meta.env.DEV || !onMetric) return;

    // Dynamic import for production only - gracefully fails if package not installed
    // @ts-expect-error - web-vitals is optionally installed
    import('web-vitals')
      .then(({ onCLS, onFID, onLCP, onFCP, onTTFB }) => {
        onCLS(onMetric);
        onFID(onMetric);
        onLCP(onMetric);
        onFCP(onMetric);
        onTTFB(onMetric);
      })
      .catch(() => {
        // Silently fail if web-vitals package is not installed
        if (import.meta.env.DEV) {
          console.info('[Web Vitals] Package not installed. Run: npm install web-vitals');
        }
      });
  }, [onMetric]);
};

/**
 * Send Web Vitals to analytics endpoint
 */
export const sendToAnalytics = (metric: WebVital) => {
  // Example: Send to Google Analytics
  if (typeof window !== 'undefined' && 'gtag' in window) {
    const gtag = (window as any).gtag as (...args: any[]) => void;
    gtag('event', metric.name, {
      event_category: 'Web Vitals',
      event_label: metric.id,
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      non_interaction: true,
    });
  }

  // Store locally for debugging
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.log('[Web Vitals]', {
      name: metric.name,
      value: metric.value.toFixed(2),
      rating: metric.rating
    });
  }

  // Store in IndexedDB for later analysis
  try {
    const vitalsLog = {
      timestamp: Date.now(),
      ...metric
    };
    
    const existingVitals = JSON.parse(localStorage.getItem('web_vitals') || '[]');
    existingVitals.push(vitalsLog);
    // Keep last 100 measurements
    localStorage.setItem('web_vitals', JSON.stringify(existingVitals.slice(-100)));
  } catch {
    // Fail silently
  }
};

export default useWebVitals;
