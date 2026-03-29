import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const Toast = ({ id, message, type = 'info', duration = 4000, onClose }) => {
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => onClose(id), duration);
      return () => clearTimeout(timer);
    }
  }, [id, duration, onClose]);

  const typeConfig = {
    success: { bg: 'bg-emerald-500', icon: CheckCircle, textColor: 'text-white' },
    error: { bg: 'bg-rose-500', icon: AlertCircle, textColor: 'text-white' },
    info: { bg: 'bg-blue-500', icon: Info, textColor: 'text-white' },
    warning: { bg: 'bg-amber-500', icon: AlertTriangle, textColor: 'text-white' },
  };

  const config = typeConfig[type] || typeConfig.info;
  const Icon = config.icon;

  return (
    <div className="animate-in fade-in slide-in-from-right duration-300">
      <div className={`${config.bg} ${config.textColor} px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 max-w-md`}>
        <Icon className="w-5 h-5 flex-shrink-0" />
        <span className="font-medium text-sm flex-1">{message}</span>
        <button
          onClick={() => onClose(id)}
          className="flex-shrink-0 hover:opacity-80 transition-opacity"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export const ToastContainer = ({ toasts, onClose }) => {
  return (
    <div className="fixed bottom-6 right-6 z-50 space-y-3">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={onClose}
        />
      ))}
    </div>
  );
};

export const useToast = () => {
  const [toasts, setToasts] = React.useState([]);

  const addToast = (message, type = 'info', duration = 4000) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type, duration }]);
    return id;
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return { toasts, addToast, removeToast };
};
