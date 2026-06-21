"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';

const variants = {
  primary: 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-sm hover:shadow-emerald-500/20 hover:brightness-110 border-transparent',
  secondary: 'bg-surface-800 text-surface-200 border-surface-600 hover:bg-surface-700 hover:text-white',
  accent: 'bg-gradient-to-r from-amber-600 to-amber-500 text-white shadow-sm hover:shadow-amber-500/20 hover:brightness-110 border-transparent',
  danger: 'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-sm hover:shadow-red-500/20 hover:brightness-110 border-transparent',
  ghost: 'bg-transparent text-surface-300 hover:bg-white/5 hover:text-white border-transparent',
  outline: 'bg-transparent text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10 hover:border-emerald-500/50',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs rounded-lg gap-1.5',
  md: 'px-5 py-2.5 text-sm rounded-xl gap-2',
  lg: 'px-6 py-3 text-base rounded-xl gap-2.5',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  href,
  disabled = false,
  loading = false,
  ...props
}) {
  const base = 'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 border';
  const classes = `${base} ${variants[variant]} ${sizes[size]} ${className}`.trim();

  const content = loading ? (
    <>
      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
      {children}
    </>
  ) : children;

  if (href && !disabled) {
    return <Link href={href} className={classes}>{content}</Link>;
  }

  return (
    <motion.button
      whileHover={disabled ? undefined : { scale: 1.02 }}
      whileTap={disabled ? undefined : { scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      disabled={disabled || loading}
      className={classes}
      {...props}
    >
      {content}
    </motion.button>
  );
}