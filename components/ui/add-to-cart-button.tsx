'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Check, Plus, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AddToCartButtonProps {
  onAdd: () => void;
  isPending?: boolean;
  disabled?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function AddToCartButton({
  onAdd,
  isPending = false,
  disabled = false,
  className,
  size = 'md',
}: AddToCartButtonProps) {
  const [isAdded, setIsAdded] = useState(false);

  const handleClick = () => {
    if (isPending || disabled) return;
    onAdd();
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const sizeClasses = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-10 px-4 text-sm',
    lg: 'h-12 px-6 text-base',
  };

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <motion.button
      onClick={handleClick}
      disabled={disabled || isPending}
      className={cn(
        'inline-flex items-center justify-center gap-2 font-medium rounded-lg',
        'bg-primary text-primary-foreground hover:bg-primary/90',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'transition-colors duration-200',
        sizeClasses[size],
        className
      )}
      whileTap={{ scale: disabled || isPending ? 1 : 0.95 }}
    >
      <AnimatePresence mode="wait">
        {isPending ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
          >
            <Loader2 className={cn(iconSizes[size], 'animate-spin')} />
          </motion.div>
        ) : isAdded ? (
          <motion.div
            key="added"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
          >
            <Check className={cn(iconSizes[size], 'text-green-400')} />
          </motion.div>
        ) : (
          <motion.div
            key="default"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
          >
            <ShoppingCart className={iconSizes[size]} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {isPending ? (
          <motion.span
            key="loading-text"
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
          >
            Adding...
          </motion.span>
        ) : isAdded ? (
          <motion.span
            key="added-text"
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
          >
            Added
          </motion.span>
        ) : (
          <motion.span
            key="default-text"
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
          >
            Add to Cart
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

// Mini cart button for quick add (appears on hover)
interface QuickAddButtonProps {
  onAdd: () => void;
  isPending?: boolean;
}

export function QuickAddButton({ onAdd, isPending = false }: QuickAddButtonProps) {
  const [isAdded, setIsAdded] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isPending) return;
    onAdd();
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  return (
    <motion.button
      onClick={handleClick}
      disabled={isPending}
      className="h-9 w-9 flex items-center justify-center rounded-full bg-background shadow-md hover:shadow-lg transition-shadow"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <AnimatePresence mode="wait">
        {isPending ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
          >
            <Loader2 className="w-4 h-4 animate-spin" />
          </motion.div>
        ) : isAdded ? (
          <motion.div
            key="added"
            initial={{ opacity: 0, scale: 0, rotate: -90 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0, rotate: 90 }}
          >
            <Check className="w-4 h-4 text-green-600" />
          </motion.div>
        ) : (
          <motion.div
            key="default"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
          >
            <Plus className="w-4 h-4" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

// Floating add to cart for product detail
interface FloatingAddButtonProps {
  onAdd: (quantity: number) => void;
  price: number;
}

export function FloatingAddButton({ onAdd, price }: FloatingAddButtonProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <motion.div
      className="fixed bottom-6 right-6 z-40"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="relative">
        <motion.button
          onClick={() => setIsVisible(!isVisible)}
          className="h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            animate={{ rotate: isVisible ? 45 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <Plus className="w-6 h-6" />
          </motion.div>
        </motion.button>

        <AnimatePresence>
          {isVisible && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 10 }}
              className="absolute bottom-16 right-0 bg-card rounded-lg shadow-xl border p-4 min-w-[200px]"
            >
              <p className="text-sm text-muted-foreground mb-3">
                Add to cart for
              </p>
              <p className="text-xl font-bold mb-3">
                ${price.toFixed(2)}
              </p>
              <motion.button
                onClick={() => {
                  onAdd(1);
                  setIsVisible(false);
                }}
                className="w-full h-10 bg-primary text-primary-foreground rounded-lg font-medium flex items-center justify-center gap-2"
                whileTap={{ scale: 0.95 }}
              >
                <ShoppingCart className="w-4 h-4" />
                Add Now
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
