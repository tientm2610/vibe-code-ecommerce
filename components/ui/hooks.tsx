'use client';

import { useState, useCallback } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';

// Cursor-following glow effect
export function useCursorGlow() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const { left, top } = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - left);
    mouseY.set(e.clientY - top);
  }, [mouseX, mouseY]);

  return { mouseX, mouseY, handleMouseMove };
}

// Scale on hover with spring physics
export const hoverScale = {
  rest: { scale: 1 },
  hover: { scale: 1.05 },
};

// Smooth lift on hover
export const hoverLift = {
  rest: { y: 0, boxShadow: '0 1px 3px rgb(0 0 0 / 0.1)' },
  hover: { y: -4, boxShadow: '0 12px 24px rgb(0 0 0 / 0.15)' },
};

// Press animation
export const pressScale = {
  rest: { scale: 1 },
  tap: { scale: 0.95 },
};

// Stagger children animation
export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

export const staggerItem = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.2, ease: 'easeOut' }
  },
};

// Magnetic button effect (moves toward cursor slightly)
export function useMagnetic(strength = 0.3) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    x.set((e.clientX - centerX) * strength);
    y.set((e.clientY - centerY) * strength);
  }, [x, y, strength]);

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return { x, y, handleMouseMove, handleMouseLeave };
}

// Success animation trigger
export function useSuccessAnimation() {
  const [showSuccess, setShowSuccess] = useState(false);

  const triggerSuccess = useCallback(() => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  }, []);

  return { showSuccess, triggerSuccess };
}

// Number counter animation
export function AnimatedNumber({ 
  value, 
  duration = 0.5 
}: { 
  value: number; 
  duration?: number;
}) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration }}
    >
      {value}
    </motion.span>
  );
}

// Shimmer loading effect
export function Shimmer({ className }: { className?: string }) {
  return (
    <div 
      className={`relative overflow-hidden ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
    </div>
  );
}

// Bouncy entrance
export const bouncyEntrance = {
  initial: { scale: 0, opacity: 0 },
  animate: { 
    scale: 1, 
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 17,
    }
  },
};

// Smooth opacity transitions
export const fadeTransition = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};
