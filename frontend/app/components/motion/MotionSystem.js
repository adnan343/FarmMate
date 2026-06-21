"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { forwardRef } from 'react';

// ─── FadeIn Component ───
export const FadeIn = forwardRef(function FadeIn(
  { children, duration = 0.4, delay = 0, className = '', ...props },
  ref
) {
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
});

// ─── SlideUp Component ───
export const SlideUp = forwardRef(function SlideUp(
  { children, duration = 0.4, delay = 0, distance = 24, className = '', ...props },
  ref
) {
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: distance }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: distance }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
});

// ─── StaggerContainer Component ───
export const StaggerContainer = forwardRef(function StaggerContainer(
  { children, staggerDelay = 0.05, className = '', ...props },
  ref
) {
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: 0.05,
          },
        },
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
});

// ─── StaggerItem Component ───
export const StaggerItem = forwardRef(function StaggerItem(
  { children, className = '', ...props },
  ref
) {
  return (
    <motion.div
      ref={ref}
      variants={{
        hidden: { opacity: 0, y: 16 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.35,
            ease: [0.25, 0.1, 0.25, 1],
          },
        },
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
});

// ─── PageTransition Component ───
export const PageTransition = forwardRef(function PageTransition(
  { children, className = '', ...props },
  ref
) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        ref={ref}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{
          duration: 0.25,
          ease: 'easeInOut',
        }}
        className={className}
        {...props}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
});

// ─── ScaleOnHover Component ───
export const ScaleOnHover = forwardRef(function ScaleOnHover(
  { children, scale = 1.02, className = '', ...props },
  ref
) {
  return (
    <motion.div
      ref={ref}
      whileHover={{ scale }}
      whileTap={{ scale: 0.98 }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 20,
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
});

// ─── AnimatedPresence wrapper ───
export { AnimatePresence };