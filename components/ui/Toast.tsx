
import React, { useEffect, useState } from 'react';
import { X, CheckCircle, AlertTriangle, Info, AlertOctagon } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastProps {
  toast: ToastMessage;
  onClose: (id: string) => void;
}

const ToastItem: React.FC<ToastProps> = ({ toast, onClose }) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => onClose(toast.id), 300); // Wait for exit animation
    }, toast.duration || 3000);

    return () => clearTimeout(timer);
  }, [toast, onClose]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => onClose(toast.id), 300);
  };

  const icons = {
    success: <CheckCircle size={18} className="text-green-400" />,
    error: <AlertOctagon size={18} className="text-red-400" />,
    warning: <AlertTriangle size={18} className="text-yellow-400" />,
    info: <Info size={18} className="text-accent-cyan" />
  };

  const borderColors = {
    success: 'border-green-500/30',
    error: 'border-red-500/30',
    warning: 'border-yellow-500/30',
    info: 'border-accent-cyan/30'
  };

  return (
    <div 
      className={`
        flex items-center gap-3 p-4 mb-3 rounded-lg border bg-slate-900/95 backdrop-blur-md shadow-2xl min-w-[300px] max-w-[400px] pointer-events-auto
        transform transition-all duration-300 ease-in-out
        ${borderColors[toast.type]}
        ${isExiting ? 'translate-x-[120%] opacity-0' : 'translate-x-0 opacity-100'}
      `}
      role="alert"
    >
      <div className="shrink-0">
        {icons[toast.type]}
      </div>
      <div className="flex-1 text-sm font-medium text-slate-200 leading-tight">
        {toast.message}
      </div>
      <button 
        onClick={handleClose}
        className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors touch-action-manipulation"
        aria-label="Close notification"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export const ToastContainer: React.FC<{ toasts: ToastMessage[], removeToast: (id: string) => void }> = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col items-end pointer-events-none p-4 md:p-0" aria-live="polite" aria-relevant="additions">
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onClose={removeToast} />
      ))}
    </div>
  );
};
