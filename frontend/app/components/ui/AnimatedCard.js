"use client";

import { motion } from 'framer-motion';
import { forwardRef } from 'react';

/**
 * AnimatedCard - Reusable card with hover lift + scale effect
 * - hover: scale(1.02) + y(-4px)
 * - shadow-sm → shadow-md on hover
 * - rounded-xl
 * - white background
 * - border gray-100
 */
const AnimatedCard = forwardRef(function AnimatedCard(
  {
    children,
    className = '',
    onClick,
    hoverable = true,
    padding = true,
    as = 'div',
    ...props
  },
  ref
) {
  const Component = motion[as];

  return (
    <Component
      ref={ref}
      whileHover={hoverable ? { scale: 1.02, y: -4 } : undefined}
      whileTap={hoverable && onClick ? { scale: 0.98 } : undefined}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 20,
        mass: 0.8,
      }}
      onClick={onClick}
      className={`
        bg-white
        rounded-xl
        border border-gray-100
        shadow-sm
        hover:shadow-md
        transition-shadow
        ${padding ? 'p-5' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `.trim()}
      {...props}
    >
      {children}
    </Component>
  );
});

export default AnimatedCard;