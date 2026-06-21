"use client";

export default function GradientText({ children, variant = 'emerald', className = '' }) {
  const gradients = {
    emerald: 'from-emerald-400 to-teal-400',
    sky: 'from-sky-400 to-blue-400',
    amber: 'from-amber-400 to-orange-400',
    purple: 'from-purple-400 to-pink-400',
  };

  return (
    <span className={`bg-clip-text text-transparent bg-gradient-to-r ${gradients[variant]} ${className}`}>
      {children}
    </span>
  );
}