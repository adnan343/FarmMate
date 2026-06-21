"use client";

import { motion } from 'framer-motion';

export default function Card({
  children,
  className = '',
  hover = true,
  glow = false,
  padding = true,
  onClick,
  ...props
}) {
  return (
    <motion.div
      whileHover={hover && !onClick ? { y: -2, boxShadow: '0 10px 25px -5px rgba(0,0,0,0.2)' } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      onClick={onClick}
      className={`
        bg-surface-800/80 border border-white/[0.06] rounded-2xl
        ${hover ? 'hover:border-white/[0.12] transition-colors duration-200' : ''}
        ${glow ? 'shadow-glow-sm' : 'shadow-sm'}
        ${padding ? 'p-5 sm:p-6' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `.trim()}
      {...props}
    >
      {children}
    </motion.div>
  );
}