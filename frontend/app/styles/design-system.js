/**
 * FarmMate Design System
 * SaaS-grade emerald-based design tokens
 * All UI components must follow this system strictly.
 */

export const colors = {
  // Primary Emerald Palette (SaaS theme)
  primary: {
    50: '#ECFDF5',
    100: '#D1FAE5',
    200: '#A7F3D0',
    300: '#6EE7B7',
    400: '#34D399',
    500: '#10B981',
    600: '#059669',
    700: '#047857',
    800: '#065F46',
    900: '#064E3B',
    DEFAULT: '#059669',
  },

  // Accent Colors
  accent: {
    red: {
      50: '#FEF2F2',
      100: '#FEE2E2',
      200: '#FECACA',
      500: '#EF4444',
      600: '#DC2626',
      700: '#B91C1C',
    },
    blue: {
      50: '#EFF6FF',
      100: '#DBEAFE',
      200: '#BFDBFE',
      500: '#3B82F6',
      600: '#2563EB',
      700: '#1D4ED8',
    },
    amber: {
      50: '#FFFBEB',
      100: '#FEF3C7',
      200: '#FDE68A',
      500: '#F59E0B',
      600: '#D97706',
      700: '#B45309',
    },
    purple: {
      50: '#FAF5FF',
      100: '#F3E8FF',
      200: '#E9D5FF',
      500: '#A855F7',
      600: '#9333EA',
      700: '#7E22CE',
    },
  },

  // Neutral Gray Scale
  neutral: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
    950: '#030712',
  },

  // Status Colors
  status: {
    success: {
      bg: '#D1FAE5',
      text: '#065F46',
      border: '#A7F3D0',
      dot: '#10B981',
    },
    warning: {
      bg: '#FEF3C7',
      text: '#92400E',
      border: '#FDE68A',
      dot: '#F59E0B',
    },
    error: {
      bg: '#FEE2E2',
      text: '#991B1B',
      border: '#FECACA',
      dot: '#EF4444',
    },
    info: {
      bg: '#DBEAFE',
      text: '#1E40AF',
      border: '#BFDBFE',
      dot: '#3B82F6',
    },
  },

  // Surface Colors (light mode)
  surface: {
    white: '#FFFFFF',
    page: '#F8FAFC',
    card: '#FFFFFF',
    border: '#F1F5F9',
    hover: '#F8FAFC',
  },
};

// 8pt Spacing System
export const spacing = {
  0: '0px',
  1: '2px',
  2: '4px',
  3: '8px',
  4: '12px',
  5: '16px',
  6: '20px',
  7: '24px',
  8: '32px',
  9: '40px',
  10: '48px',
  11: '56px',
  12: '64px',
  13: '80px',
  14: '96px',
  15: '128px',
};

// Typography Scale
export const typography = {
  h1: {
    fontSize: '1.875rem',
    fontWeight: '700',
    lineHeight: '2.25rem',
    letterSpacing: '-0.025em',
  },
  h2: {
    fontSize: '1.5rem',
    fontWeight: '700',
    lineHeight: '2rem',
    letterSpacing: '-0.025em',
  },
  h3: {
    fontSize: '1.25rem',
    fontWeight: '600',
    lineHeight: '1.75rem',
  },
  body: {
    fontSize: '0.875rem',
    fontWeight: '400',
    lineHeight: '1.5rem',
  },
  small: {
    fontSize: '0.75rem',
    fontWeight: '400',
    lineHeight: '1rem',
  },
  caption: {
    fontSize: '0.625rem',
    fontWeight: '500',
    lineHeight: '0.875rem',
    letterSpacing: '0.025em',
  },
};

// Shadow Scale
export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
};

// Border Radius
export const borderRadius = {
  sm: '0.375rem',
  md: '0.5rem',
  lg: '0.75rem',
  xl: '1rem', // Primary border radius
  '2xl': '1.5rem',
};

// Category Colors (for task badges)
export const categoryColors = {
  crop: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300', dot: 'bg-green-500' },
  pest: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300', dot: 'bg-red-500' },
  pest_control: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300', dot: 'bg-red-500' },
  irrigation: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300', dot: 'bg-blue-500' },
  harvest: { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-300', dot: 'bg-amber-500' },
  orders: { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-300', dot: 'bg-purple-500' },
  manual: { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-300', dot: 'bg-gray-500' },
  planting: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300', dot: 'bg-green-500' },
  watering: { bg: 'bg-cyan-100', text: 'text-cyan-800', border: 'border-cyan-300', dot: 'bg-cyan-500' },
  fertilizing: { bg: 'bg-emerald-100', text: 'text-emerald-800', border: 'border-emerald-300', dot: 'bg-emerald-500' },
  weeding: { bg: 'bg-lime-100', text: 'text-lime-800', border: 'border-lime-300', dot: 'bg-lime-500' },
  monitoring: { bg: 'bg-indigo-100', text: 'text-indigo-800', border: 'border-indigo-300', dot: 'bg-indigo-500' },
  equipment: { bg: 'bg-slate-100', text: 'text-slate-800', border: 'border-slate-300', dot: 'bg-slate-500' },
  inventory: { bg: 'bg-teal-100', text: 'text-teal-800', border: 'border-teal-300', dot: 'bg-teal-500' },
  other: { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-300', dot: 'bg-gray-500' },
};

// Priority Colors
export const priorityColors = {
  low: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300', dot: 'bg-green-500' },
  medium: { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-300', dot: 'bg-amber-500' },
  high: { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-300', dot: 'bg-orange-500' },
  critical: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300', dot: 'bg-red-500' },
};

// AI Score Thresholds
export const aiScoreThresholds = {
  critical: { min: 80, color: 'text-red-600', bg: 'bg-red-50' },
  high: { min: 60, color: 'text-orange-600', bg: 'bg-orange-50' },
  medium: { min: 40, color: 'text-blue-600', bg: 'bg-blue-50' },
  low: { min: 0, color: 'text-gray-600', bg: 'bg-gray-50' },
};

export default {
  colors,
  spacing,
  typography,
  shadows,
  borderRadius,
  categoryColors,
  priorityColors,
  aiScoreThresholds,
};