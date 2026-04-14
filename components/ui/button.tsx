'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode, useState } from 'react';
import { cn } from '@/lib/utils';

type MotionButtonProps = HTMLMotionProps<'button'>;

interface ButtonProps extends Omit<MotionButtonProps, 'children'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'destructive' | 'success' | 'link';
  size?: 'sm' | 'md' | 'lg' | 'icon' | 'xs';
  loading?: boolean;
  loadingText?: string;
  ripple?: boolean;
  children?: ReactNode;
}

export function Button({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  loading = false, 
  loadingText,
  ripple = true,
  disabled, 
  children, 
  onClick,
  ...props 
}: ButtonProps) {
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (ripple && !loading && !disabled) {
      const button = e.currentTarget;
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const newRipple = { x, y, id: Date.now() };
      setRipples([...ripples, newRipple]);
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
      }, 600);
    }
    onClick?.(e);
  };

  return (
    <motion.button
      ref={props.ref as any}
      className={cn(
        'inline-flex items-center justify-center font-medium relative overflow-hidden',
        {
          'bg-primary text-primary-foreground hover:bg-primary/90': variant === 'primary',
          'bg-secondary text-secondary-foreground hover:bg-secondary/80': variant === 'secondary',
          'hover:bg-secondary active:bg-secondary/80': variant === 'ghost',
          'border border-border bg-transparent hover:bg-secondary active:bg-secondary/80': variant === 'outline',
          'bg-destructive text-destructive-foreground hover:bg-destructive/90': variant === 'destructive',
          'bg-success text-success-foreground hover:bg-success/90': variant === 'success',
          'text-primary underline-offset-4 hover:underline': variant === 'link',
        },
        {
          'h-8 px-3 text-xs rounded-md': size === 'xs',
          'h-9 px-4 text-sm rounded-md': size === 'sm',
          'h-10 px-5 text-sm rounded-lg': size === 'md',
          'h-12 px-6 text-base rounded-lg': size === 'lg',
          'h-10 w-10 rounded-lg': size === 'icon',
        },
        className
      )}
      disabled={disabled || loading}
      whileTap={{ scale: disabled || loading ? 1 : 0.97 }}
      onClick={handleClick}
      {...(props as any)}
    >
      {/* Ripple effects */}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute bg-white/30 rounded-full animate-ripple pointer-events-none"
          style={{
            left: ripple.x - 50,
            top: ripple.y - 50,
            width: 100,
            height: 100,
          }}
        />
      ))}

      {loading ? (
        <>
          <Spinner size="sm" className="mr-2" />
          {loadingText || 'Loading...'}
        </>
      ) : children}
    </motion.button>
  );
}

// Spinner component
interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Spinner({ size = 'md', className }: SpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <svg
      className={cn('animate-spin', sizeClasses[size], className)}
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

// Pulse dot for loading indicators
export function PulseDot({ className }: { className?: string }) {
  return (
    <span className={cn('relative flex h-2 w-2', className)}>
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75" />
      <span className="relative inline-flex rounded-full h-2 w-2 bg-current" />
    </span>
  );
}
