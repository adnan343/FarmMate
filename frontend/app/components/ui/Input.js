"use client";

export default function Input({ className = '', label, error, icon, ...props }) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-xs font-semibold text-surface-300 uppercase tracking-wider mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400">
            {icon}
          </div>
        )}
        <input
          className={`
            w-full rounded-xl border border-white/10 bg-surface-800/60 px-4 py-2.5 
            text-sm text-surface-50 placeholder-surface-400
            transition-all duration-200
            hover:border-white/20
            focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/15
            ${icon ? 'pl-10' : ''}
            ${error ? 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/15' : ''}
            ${className}
          `.trim()}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-xs text-red-400">{error}</p>
      )}
    </div>
  );
}