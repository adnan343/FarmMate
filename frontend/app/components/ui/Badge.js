"use client";

const statusStyles = {
  success: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
  warning: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
  error: 'bg-red-500/10 text-red-300 border-red-500/20',
  info: 'bg-blue-500/10 text-blue-300 border-blue-500/20',
  neutral: 'bg-surface-700/50 text-surface-300 border-white/10',
};

const dotColors = {
  success: 'bg-emerald-400',
  warning: 'bg-amber-400',
  error: 'bg-red-400',
  info: 'bg-blue-400',
  neutral: 'bg-surface-400',
};

export default function Badge({
  children,
  variant = 'neutral',
  dot = false,
  className = '',
  size = 'sm',
}) {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${sizeClasses} ${statusStyles[variant]} ${className}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />}
      {children}
    </span>
  );
}