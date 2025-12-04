import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store/store';
import App from './App';

// --- ResizeObserver Loop Error Suppression ---
// This is a known issue with Recharts/ResizeObserver that is benign but triggers "Uncaught Error" overlays.
const resizeObserverLoopErr = /Loop limit exceeded|undelivered notifications/;
const originalOnError = window.onerror;
window.onerror = (msg, url, lineNo, columnNo, error) => {
  if (resizeObserverLoopErr.test(msg as string)) {
    return true; // Stop propagation
  }
  if (originalOnError) originalOnError(msg, url, lineNo, columnNo, error);
  return false;
};

// Polyfill for console.error to suppress specific Recharts warnings in dev
const originalConsoleError = console.error;
console.error = (...args: unknown[]) => {
  if (
    typeof args[0] === 'string' &&
    (args[0].includes('ResizeObserver loop') || args[0].includes('The width(-1) and height(-1)'))
  ) {
    return;
  }
  originalConsoleError(...args);
};

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);