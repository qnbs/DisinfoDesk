import { useState, useEffect, useCallback } from 'react';

/**
 * Modern LocalStorage Hook with SSR support
 * Implements best practices for storage synchronization
 * Includes error handling and type safety
 */

export const useLocalStorage = <T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void, () => void] => {
  // Get from localStorage or use initial value
  const readValue = useCallback((): T => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      if (import.meta.env.DEV) {
        console.warn(`Error reading localStorage key "${key}":`, error);
      }
      return initialValue;
    }
  }, [initialValue, key]);

  const [storedValue, setStoredValue] = useState<T>(readValue);

  // Return a wrapped version of useState's setter function that
  // persists the new value to localStorage
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      if (typeof window === 'undefined') {
        if (import.meta.env.DEV) {
          console.warn(
            `Tried setting localStorage key "${key}" even though environment is not a client`
          );
        }
      }

      try {
        // Allow value to be a function so we have the same API as useState
        const newValue = value instanceof Function ? value(storedValue) : value;

        // Save to localStorage
        window.localStorage.setItem(key, JSON.stringify(newValue));

        // Save state
        setStoredValue(newValue);

        // Dispatch custom event for cross-tab synchronization
        window.dispatchEvent(new Event('local-storage'));
      } catch (error) {
        if (import.meta.env.DEV) {
          console.warn(`Error setting localStorage key "${key}":`, error);
        }
      }
    },
    [key, storedValue]
  );

  // Remove from localStorage
  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
      window.dispatchEvent(new Event('local-storage'));
    } catch (error) {
      if (import.meta.env.DEV) {
        console.warn(`Error removing localStorage key "${key}":`, error);
      }
    }
  }, [key, initialValue]);

  // Listen for changes in other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          if (import.meta.env.DEV) {
            console.warn(`Error parsing localStorage change for key "${key}":`, error);
          }
        }
      }
    };

    // Listen to custom event for same-tab changes
    const handleLocalStorageChange = () => {
      setStoredValue(readValue());
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('local-storage', handleLocalStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('local-storage', handleLocalStorageChange);
    };
  }, [key, readValue]);

  return [storedValue, setValue, removeValue];
};

export default useLocalStorage;
