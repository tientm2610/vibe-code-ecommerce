'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertTriangle, Info, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextType {
  showToast: (type: ToastType, title: string, message?: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    return { showToast: () => {} };
  }
  return context;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((
    type: ToastType, 
    title: string, 
    message?: string, 
    duration = 4000
  ) => {
    const id = Math.random().toString(36).substring(7);
    setToasts((prev) => [...prev, { id, type, title, message, duration }]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toastConfig = {
    success: { icon: CheckCircle, bg: 'bg-green-50 border-green-200', iconColor: 'text-green-600' },
    error: { icon: XCircle, bg: 'bg-red-50 border-red-200', iconColor: 'text-red-600' },
    warning: { icon: AlertTriangle, bg: 'bg-yellow-50 border-yellow-200', iconColor: 'text-yellow-600' },
    info: { icon: Info, bg: 'bg-blue-50 border-blue-200', iconColor: 'text-blue-600' },
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {/* Toast container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
        <AnimatePresence>
          {toasts.map((toast) => {
            const config = toastConfig[toast.type];
            const Icon = config.icon;
            
            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, x: 100, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 100, scale: 0.9 }}
                className={cn(
                  'flex items-start gap-3 p-4 rounded-lg border shadow-lg',
                  config.bg
                )}
              >
                <Icon className={cn('w-5 h-5 shrink-0 mt-0.5', config.iconColor)} />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{toast.title}</p>
                  {toast.message && (
                    <p className="text-sm text-muted-foreground mt-0.5">{toast.message}</p>
                  )}
                </div>
                <button
                  onClick={() => dismissToast(toast.id)}
                  className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

// Simple toast hook for single toasts
export function useSimpleToast() {
  const [toast, setToast] = useState<Toast | null>(null);

  const showToast = useCallback((
    type: ToastType, 
    title: string, 
    message?: string, 
    duration = 4000
  ) => {
    setToast({ id: '1', type, title, message, duration });
    
    if (duration > 0) {
      setTimeout(() => setToast(null), duration);
    }
  }, []);

  const dismissToast = useCallback(() => setToast(null), []);

  return { toast, showToast, dismissToast };
}
