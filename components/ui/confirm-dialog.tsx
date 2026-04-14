'use client';

import { useState, useCallback, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { X, AlertTriangle, CheckCircle, Info } from 'lucide-react';

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'default' | 'danger' | 'warning';
  onConfirm: () => void;
  loading?: boolean;
  children?: ReactNode;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'default',
  onConfirm,
  loading = false,
  children,
}: ConfirmDialogProps) {
  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  const variantStyles = {
    default: {
      icon: Info,
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary',
      confirmBtn: 'bg-primary hover:bg-primary/90',
    },
    danger: {
      icon: AlertTriangle,
      iconBg: 'bg-destructive/10',
      iconColor: 'text-destructive',
      confirmBtn: 'bg-destructive hover:bg-destructive/90',
    },
    warning: {
      icon: AlertTriangle,
      iconBg: 'bg-warning/10',
      iconColor: 'text-warning',
      confirmBtn: 'bg-warning hover:bg-warning/90',
    },
  };

  const style = variantStyles[variant];
  const Icon = style.icon;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onOpenChange(false)}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2"
          >
            <div className="bg-background rounded-xl shadow-xl border overflow-hidden mx-4">
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className={cn('w-12 h-12 rounded-full flex items-center justify-center shrink-0', style.iconBg)}>
                    <Icon className={cn('w-6 h-6', style.iconColor)} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{title}</h3>
                    {children ? (
                      <div className="mt-2 text-muted-foreground">{children}</div>
                    ) : (
                      <p className="mt-2 text-muted-foreground">{message}</p>
                    )}
                  </div>
                  <button
                    onClick={() => onOpenChange(false)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="px-6 py-4 bg-muted/30 flex justify-end gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => onOpenChange(false)}
                  disabled={loading}
                >
                  {cancelLabel}
                </Button>
                <Button
                  className={style.confirmBtn}
                  onClick={handleConfirm}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    confirmLabel
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Hook for managing confirm dialog state
export function useConfirmDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<{
    title?: string;
    message?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: 'default' | 'danger' | 'warning';
    onConfirm: () => void;
  }>({ onConfirm: () => {} });

  const confirm = useCallback((params: {
    title?: string;
    message?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: 'default' | 'danger' | 'warning';
    onConfirm: () => void;
  }) => {
    setConfig(params);
    setIsOpen(true);
  }, []);

  const ConfirmComponent = useCallback(({ 
    title,
    message,
    confirmLabel,
    cancelLabel,
    variant,
    onConfirm,
    loading,
    children 
  }: ConfirmDialogProps) => (
    <ConfirmDialog
      open={isOpen}
      onOpenChange={setIsOpen}
      title={title || config.title}
      message={message || config.message}
      confirmLabel={confirmLabel || config.confirmLabel}
      cancelLabel={cancelLabel || config.cancelLabel}
      variant={variant || config.variant}
      onConfirm={onConfirm || config.onConfirm}
      loading={loading}
    >
      {children}
    </ConfirmDialog>
  ), [isOpen, config]);

  return { confirm, ConfirmComponent, isOpen, setIsOpen };
}
