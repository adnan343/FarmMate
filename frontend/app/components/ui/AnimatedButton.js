"use client";

import { motion } from 'framer-motion';
import { forwardRef } from 'react';
import Link from 'next/link';

/**
 * AnimatedButton - Reusable button with spring animations
 * - primary emerald style
 * - hover scale(1.03)
 * - tap scale(0.97)
 * - smooth spring animation
 */
const AnimatedButton = forwardRef(function AnimatedButton(
  {
    variant = 'primary',
    children,
    className = '',
    href,
    disabled = false,
    size = 'md',
    ...props
  },
  ref
) {
  const baseClasses =
    'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500/25';

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const variantClasses = {
    primary:
      'bg-emerald-600 text-white shadow-sm hover:bg-emerald-700 border border-transparent',
    secondary:
      'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200 hover:text-gray-900',
    accent:
      'bg-amber-500 text-white shadow-sm hover:bg-amber-600 border border-transparent',
    danger:
      'bg-red-500 text-white shadow-sm hover:bg-red-600 border border-transparent',
    ghost:
      'bg-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-transparent',
    outline:
      'bg-transparent text-emerald-600 border border-emerald-300 hover:bg-emerald-50',
  };

  const classes = `${baseClasses} ${sizeClasses[size] || sizeClasses.md} ${variantClasses[variant] || variantClasses.primary} ${className}`.trim();

  const MotionTag = disabled ? 'div' : motion.button;

  if (href && !disabled) {
    return (
      <Link href={href} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <MotionTag
      ref={ref}
      whileHover={disabled ? undefined : { scale: 1.03 }}
      whileTap={disabled ? undefined : { scale: 0.97 }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 15,
      }}
      disabled={disabled}
      className={classes}
      {...props}
    >
      {children}
    </MotionTag>
  );
});

export default AnimatedButton;