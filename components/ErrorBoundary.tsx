import React, { Component, ReactNode } from 'react';
import { AlertOctagon, RefreshCw } from 'lucide-react';
import { Button } from './ui/Common';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

/**
 * Modern Error Boundary following React 18 best practices
 * Catches errors in child component tree and displays fallback UI
 * Implements error logging and recovery mechanisms
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log to external service in production
    if (import.meta.env.PROD) {
      // Send to error tracking service (e.g., Sentry)
      this.logErrorToService(error, errorInfo);
    }

    if (import.meta.env.DEV) {
      console.error('Error Boundary Caught:', error, errorInfo);
    }

    this.setState({ errorInfo });
    this.props.onError?.(error, errorInfo);
  }

  private logErrorToService(error: Error, errorInfo: React.ErrorInfo) {
    // Store in IndexedDB for later analysis
    try {
      const errorLog = {
        timestamp: Date.now(),
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        userAgent: navigator.userAgent,
        url: window.location.href
      };
      
      // Store in localStorage as fallback (IndexedDB might fail)
      const existingLogs = JSON.parse(localStorage.getItem('error_logs') || '[]');
      existingLogs.push(errorLog);
      // Keep last 50 errors
      localStorage.setItem('error_logs', JSON.stringify(existingLogs.slice(-50)));
    } catch {
      // Fail silently if storage is unavailable
    }
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  private handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
          <div className="max-w-2xl w-full bg-slate-900 border border-red-900/50 rounded-xl p-8 shadow-2xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-red-950/50 rounded-lg border border-red-900">
                <AlertOctagon size={32} className="text-red-500" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white mb-1">System Error Detected</h1>
                <p className="text-sm text-slate-400 font-mono">ERRCODE: BOUNDARY_TRAP</p>
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 mb-6">
              <p className="text-slate-300 text-sm mb-2">An unexpected error occurred in the application:</p>
              <pre className="text-red-400 text-xs font-mono overflow-x-auto max-h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700">
                {this.state.error?.message || 'Unknown error'}
              </pre>
              
              {import.meta.env.DEV && this.state.error?.stack && (
                <details className="mt-4">
                  <summary className="text-slate-500 text-xs cursor-pointer hover:text-slate-300">
                    Stack Trace (DEV)
                  </summary>
                  <pre className="text-slate-500 text-[10px] font-mono mt-2 overflow-x-auto">
                    {this.state.error.stack}
                  </pre>
                </details>
              )}
            </div>

            <div className="flex gap-3">
              <Button
                onClick={this.handleReset}
                variant="secondary"
                icon={<RefreshCw size={16} />}
                className="flex-1"
              >
                Try Again
              </Button>
              <Button
                onClick={this.handleReload}
                variant="primary"
                icon={<RefreshCw size={16} />}
                className="flex-1"
              >
                Reload Page
              </Button>
            </div>

            <p className="text-xs text-slate-500 mt-6 text-center">
              If this error persists, please clear your browser cache and reload.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
