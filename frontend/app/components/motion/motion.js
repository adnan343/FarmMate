/**
 * Reusable Framer Motion animation variants
 * All UI animations should use these presets.
 * No inline random animation definitions.
 */

// ─── fadeUp: opacity 0→1, y 10→0 ───
export const fadeUp = {
  hidden: {
    opacity: 0,
    y: 10,
  },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      delay,
      ease: [0.25, 0.1, 0.25, 1],
    },
  }),
};

// ─── fadeIn: opacity only ───
export const fadeIn = {
  hidden: {
    opacity: 0,
  },
  visible: (delay = 0) => ({
    opacity: 1,
    transition: {
      duration: 0.35,
      delay,
      ease: 'easeOut',
    },
  }),
};

// ─── staggerContainer: stagger children ───
export const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.05,
    },
  },
};

// ─── staggerItem: individual child for stagger ───
export const staggerItem = {
  hidden: {
    opacity: 0,
    y: 16,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

// ─── pageTransition: fade + slight scale ───
export const pageTransition = {
  hidden: {
    opacity: 0,
    scale: 0.98,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    transition: {
      duration: 0.2,
      ease: 'easeIn',
    },
  },
};

// ─── scaleOnHover: spring scale for interactive elements ───
export const scaleOnHover = {
  whileHover: { scale: 1.05 },
  whileTap: { scale: 0.97 },
  transition: { type: 'spring', stiffness: 400, damping: 17 },
};

// ─── heroFloat: slow floating animation for decorative elements ───
export const heroFloat = {
  animate: {
    y: [0, -15, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

// ─── slideInLeft: for sidebar/panel entries ───
export const slideInLeft = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] },
  },
};

// ─── slideInRight: for sidebar/panel entries ───
export const slideInRight = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] },
  },
};

// ─── scaleIn: for modals / popups ───
export const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring', stiffness: 300, damping: 25 },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.15, ease: 'easeIn' },
  },
};