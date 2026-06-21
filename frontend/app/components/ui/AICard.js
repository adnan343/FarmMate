"use client";

import { motion } from 'framer-motion';
import { Lightbulb, AlertTriangle, Info, AlertCircle } from 'lucide-react';

const types = {
  insight: {
    icon: Lightbulb,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    label: 'Insight',
  },
  recommendation: {
    icon: Info,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    label: 'Recommendation',
  },
  warning: {
    icon: AlertTriangle,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    label: 'Warning',
  },
  action: {
    icon: AlertCircle,
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
    label: 'Action Required',
  },
};

export default function AICard({
  type = 'insight',
  title,
  description,
  score,
  className = '',
  actions,
}) {
  const config = types[type] || types.insight;
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl border ${config.border} ${config.bg} p-4 ${className}`}
    >
      <div className="flex items-start gap-3">
        <div className={`w-8 h-8 rounded-lg ${config.bg} flex items-center justify-center shrink-0`}>
          <Icon className={`w-4 h-4 ${config.color}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs font-semibold uppercase tracking-wider ${config.color}`}>
              {config.label}
            </span>
            {score !== undefined && (
              <span className="text-[10px] font-medium text-surface-400 bg-white/5 px-1.5 py-0.5 rounded">
                AI Score: {score}/100
              </span>
            )}
          </div>
          <h4 className="text-sm font-semibold text-white mb-1">{title}</h4>
          {description && (
            <p className="text-xs text-surface-300 leading-relaxed">{description}</p>
          )}
          {actions && (
            <div className="flex gap-2 mt-3">
              {actions}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}