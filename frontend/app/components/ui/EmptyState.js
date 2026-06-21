"use client";

import { motion } from 'framer-motion';
import Button from './Button';

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  className = '',
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      className={`flex flex-col items-center justify-center py-12 sm:py-16 px-6 text-center ${className}`}
    >
      {Icon && (
        <div className="w-14 h-14 rounded-2xl bg-surface-800 border border-white/[0.06] flex items-center justify-center mb-4">
          <Icon className="w-7 h-7 text-surface-400" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-surface-100 mb-1.5">{title}</h3>
      <p className="text-sm text-surface-400 max-w-sm mb-6 leading-relaxed">{description}</p>
      {(actionLabel && (actionHref || onAction)) && (
        <Button
          variant="primary"
          size="md"
          href={actionHref}
          onClick={onAction}
        >
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
}