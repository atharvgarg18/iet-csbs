/**
 * Management Portal Design System
 * Comprehensive design constants for the entire management portal redesign
 * Features minimalist, classy design with outstanding static colors (no gradients)
 */

export const COLORS = {
  // Primary Color - Professional Blue
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',  // Main primary color
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },

  // Accent Color - Elegant Purple
  accent: {
    50: '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff',
    300: '#d8b4fe',
    400: '#c084fc',
    500: '#a855f7',
    600: '#9333ea',  // Main accent color
    700: '#7c3aed',
    800: '#6b21a8',
    900: '#581c87',
  },

  // Success Color - Fresh Green
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },

  // Warning Color - Vibrant Orange
  warning: {
    50: '#fff7ed',
    100: '#ffedd5',
    200: '#fed7aa',
    300: '#fdba74',
    400: '#fb923c',
    500: '#f97316',
    600: '#ea580c',
    700: '#c2410c',
    800: '#9a3412',
    900: '#7c2d12',
  },

  // Error Color - Clear Red
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },

  // Neutral Colors - Professional Grays
  neutral: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
};

// Typography Scale
export const TYPOGRAPHY = {
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
  },
  fontWeights: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
  lineHeights: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.625',
  },
};

// Spacing Scale
export const SPACING = {
  px: '1px',
  0: '0',
  1: '0.25rem',
  2: '0.5rem',
  3: '0.75rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  8: '2rem',
  10: '2.5rem',
  12: '3rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
};

// Border Radius
export const RADIUS = {
  none: '0',
  sm: '0.125rem',
  base: '0.25rem',
  md: '0.375rem',
  lg: '0.5rem',
  xl: '0.75rem',
  '2xl': '1rem',
  '3xl': '1.5rem',
  full: '9999px',
};

// Shadows
export const SHADOWS = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
};

// Component Variants
export const COMPONENTS = {
  button: {
    primary: {
      backgroundColor: COLORS.primary[600],
      color: 'white',
      hover: COLORS.primary[700],
      focus: COLORS.primary[700],
    },
    secondary: {
      backgroundColor: COLORS.neutral[100],
      color: COLORS.neutral[700],
      hover: COLORS.neutral[200],
      focus: COLORS.neutral[200],
    },
    success: {
      backgroundColor: COLORS.success[600],
      color: 'white',
      hover: COLORS.success[700],
      focus: COLORS.success[700],
    },
    warning: {
      backgroundColor: COLORS.warning[600],
      color: 'white',
      hover: COLORS.warning[700],
      focus: COLORS.warning[700],
    },
    error: {
      backgroundColor: COLORS.error[600],
      color: 'white',
      hover: COLORS.error[700],
      focus: COLORS.error[700],
    },
  },
  card: {
    default: {
      backgroundColor: 'white',
      border: `1px solid ${COLORS.neutral[200]}`,
      borderRadius: RADIUS.lg,
      shadow: SHADOWS.sm,
    },
    elevated: {
      backgroundColor: 'white',
      border: 'none',
      borderRadius: RADIUS.lg,
      shadow: SHADOWS.md,
    },
  },
  input: {
    default: {
      backgroundColor: 'white',
      border: `1px solid ${COLORS.neutral[200]}`,
      borderRadius: RADIUS.md,
      focus: {
        borderColor: COLORS.primary[500],
        ring: `0 0 0 3px ${COLORS.primary[100]}`,
      },
    },
  },
};

// Animation Durations
export const ANIMATION = {
  duration: {
    fast: '150ms',
    normal: '200ms',
    slow: '300ms',
  },
  easing: {
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
  },
};

// Breakpoints for Responsive Design
export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};