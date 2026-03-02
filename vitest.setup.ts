import '@testing-library/jest-dom/vitest';

// Mock IndexedDB for tests
const indexedDB = {
  open: () => ({
    onupgradeneeded: null,
    onsuccess: null,
    onerror: null,
    result: {
      objectStoreNames: { contains: () => false },
      createObjectStore: () => ({}),
      transaction: () => ({
        objectStore: () => ({
          get: () => ({ onsuccess: null, onerror: null }),
          put: () => ({ onsuccess: null, onerror: null }),
          delete: () => ({ onsuccess: null, onerror: null }),
        }),
        oncomplete: null,
        onerror: null,
      }),
    },
  }),
};

Object.defineProperty(window, 'indexedDB', { value: indexedDB });

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => true,
  }),
});

// Mock ResizeObserver
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
Object.defineProperty(window, 'ResizeObserver', { value: ResizeObserverMock });

// Mock IntersectionObserver
class IntersectionObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
Object.defineProperty(window, 'IntersectionObserver', { value: IntersectionObserverMock });

// Suppress console during tests unless needed
// console.log = () => {};
