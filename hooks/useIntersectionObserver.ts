import { useEffect, useRef, useState } from 'react';

/**
 * Modern Intersection Observer Hook
 * Implements lazy loading and viewport detection best practices
 * Supports multiple thresholds and root margin
 */

export interface UseIntersectionObserverOptions extends IntersectionObserverInit {
  freezeOnceVisible?: boolean;
}

export const useIntersectionObserver = (
  options: UseIntersectionObserverOptions = {}
): [React.RefObject<HTMLDivElement>, boolean] => {
  const { threshold = 0, root = null, rootMargin = '0px', freezeOnceVisible = false } = options;

  const [isIntersecting, setIsIntersecting] = useState(false);
  const targetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    // If already visible and frozen, don't observe
    if (freezeOnceVisible && isIntersecting) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      { threshold, root, rootMargin }
    );

    observer.observe(target);

    return () => {
      if (target) observer.unobserve(target);
    };
  }, [threshold, root, rootMargin, freezeOnceVisible, isIntersecting]);

  return [targetRef, isIntersecting];
};

export default useIntersectionObserver;
