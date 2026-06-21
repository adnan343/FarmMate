"use client";

import { motion } from 'framer-motion';

export default function KPICard({
  icon: Icon,
  label,
  value,
  trend,
  trendLabel,
  color = 'emerald',
  className = '',
}) {
  const colorClasses = {
    emerald: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/20',
    blue: 'from-blue-500/20 to-blue-600/10 border-blue-500/20',
    amber: 'from-amber-500/20 to-amber-600/10 border-amber-500/20',
    purple: 'from-purple-500/20 to-purple-600/10 border-purple-500/20',
    red: 'from-red-500/20 to-red-600/10 border-red-500/20',
    teal: 'from-teal-500/20 to-teal-600/10 border-teal-500/20',
  };

  const iconColors = {
    emerald: 'text-emerald-400 bg-emerald-500/15',
    blue: 'text-blue-400 bg-blue-500/15',
    amber: 'text-amber-400 bg-amber-500/15',
    purple: 'text-purple-400 bg-purple-500/15',
    red: 'text-red-400 bg-red-500/15',
    teal: 'text-teal-400 bg-teal-500/15',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, boxShadow: '0 10px 25px -5px rgba(0,0,0,0.2)' }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`bg-gradient-to-br ${colorClasses[color]} rounded-2xl p-5 border ${className}`}
    >
      <div className="flex items-start justify-between mb-3">
        {Icon && (
          <div className={`w-10 h-10 rounded-xl ${iconColors[color]} flex items-center justify-center`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
        {trend !== undefined && (
          <span className={`text-xs font-semibold ${trend >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {trend >= 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <p className="text-xs text-surface-400 mb-0.5">{label}</p>
      <p className="text-2xl font-bold text-white tracking-tight">{value}</p>
      {trendLabel && (
        <p className="text-xs text-surface-500 mt-1">{trendLabel}</p>
      )}
    </motion.div>
  );
}