import { useEffect, useRef, useState } from 'react';

/**
 * Performance Monitor Hook
 * Tracks component render performance and memory usage
 * Following React DevTools Profiler API patterns
 */

interface PerformanceMetrics {
  renderCount: number;
  averageRenderTime: number;
  lastRenderTime: number;
  slowestRender: number;
}

export const usePerformanceMonitor = (componentName: string, logThreshold = 16.67) => {
  const metrics = useRef<PerformanceMetrics>({
    renderCount: 0,
    averageRenderTime: 0,
    lastRenderTime: 0,
    slowestRender: 0
  });

  const startTimeRef = useRef<number>(0);

  // Mark start of render
  startTimeRef.current = performance.now();

  useEffect(() => {
    const renderTime = performance.now() - startTimeRef.current;
    
    metrics.current.renderCount++;
    metrics.current.lastRenderTime = renderTime;
    
    // Update average
    metrics.current.averageRenderTime =
      (metrics.current.averageRenderTime * (metrics.current.renderCount - 1) + renderTime) /
      metrics.current.renderCount;
    
    // Track slowest render
    if (renderTime > metrics.current.slowestRender) {
      metrics.current.slowestRender = renderTime;
    }

    // Log slow renders in dev
    if (import.meta.env.DEV && renderTime > logThreshold) {
      console.warn(
        `[Performance] ${componentName} slow render: ${renderTime.toFixed(2)}ms`,
        metrics.current
      );
    }
  });

  return metrics.current;
};

/**
 * Hook to detect if component is in viewport
 * For lazy rendering and performance optimization
 */
export const useIsInViewport = (ref: React.RefObject<HTMLElement>, threshold = 0.1) => {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsIntersecting(entry.isIntersecting),
      { threshold }
    );

    const element = ref.current;
    if (element) observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, [ref, threshold]);

  return isIntersecting;
};

/**
 * Hook to track component mount/unmount lifecycle
 */
export const useLifecycle = (
  componentName: string,
  onMount?: () => void,
  onUnmount?: () => void
) => {
  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log(`[Lifecycle] ${componentName} mounted`);
    }
    onMount?.();

    return () => {
      if (import.meta.env.DEV) {
        console.log(`[Lifecycle] ${componentName} unmounted`);
      }
      onUnmount?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

/**
 * Hook to measure memory usage (if available)
 */
export const useMemoryMonitor = (intervalMs = 5000) => {
  const [memoryInfo, setMemoryInfo] = useState<{
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  } | null>(null);

  useEffect(() => {
    // Only available in Chrome with --enable-precise-memory-info flag
    const performance = window.performance as any;
    
    if (!performance?.memory) return;

    const updateMemory = () => {
      setMemoryInfo({
        usedJSHeapSize: performance.memory.usedJSHeapSize,
        totalJSHeapSize: performance.memory.totalJSHeapSize,
        jsHeapSizeLimit: performance.memory.jsHeapSizeLimit
      });
    };

    updateMemory();
    const interval = setInterval(updateMemory, intervalMs);

    return () => clearInterval(interval);
  }, [intervalMs]);

  return memoryInfo;
};

export default {
  usePerformanceMonitor,
  useIsInViewport,
  useLifecycle,
  useMemoryMonitor
};
