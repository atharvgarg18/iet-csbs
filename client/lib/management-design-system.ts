// Management Portal Design System - Production Ready
// Sophisticated static colors with no gradients

export const COLORS = {
  // Primary color palette - Deep Navy & Gold accents
  primary: {
    50: '#f8fafc',
    100: '#f1f5f9', 
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
  },
  
  // Accent colors - Sophisticated teal
  accent: {
    50: '#f0fdfa',
    100: '#ccfbf1',
    200: '#99f6e4',
    300: '#5eead4',
    400: '#2dd4bf',
    500: '#14b8a6',
    600: '#0d9488',
    700: '#0f766e',
    800: '#115e59',
    900: '#134e4a',
  },
  
  // Success - Sophisticated green
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
  
  // Warning - Rich amber
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },
  
  // Error - Deep red
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
  
  // Neutral grays - Warm undertones
  neutral: {
    50: '#fafaf9',
    100: '#f5f5f4',
    200: '#e7e5e4',
    300: '#d6d3d1',
    400: '#a8a29e',
    500: '#78716c',
    600: '#57534e',
    700: '#44403c',
    800: '#292524',
    900: '#1c1917',
  },
  
  // Brand specific colors
  brand: {
    navy: '#1e293b',
    gold: '#f59e0b',
    teal: '#0d9488',
    sage: '#6b7280',
  }
};

export const TYPOGRAPHY = {
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    mono: ['JetBrains Mono', 'Consolas', 'Monaco', 'monospace'],
  },
  
  fontSize: {
    xs: '0.75rem',     // 12px
    sm: '0.875rem',    // 14px
    base: '1rem',      // 16px
    lg: '1.125rem',    // 18px
    xl: '1.25rem',     // 20px
    '2xl': '1.5rem',   // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
    '5xl': '3rem',     // 48px
  },
  
  fontWeight: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  
  lineHeight: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.625',
  }
};

export const SPACING = {
  px: '1px',
  0: '0',
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  5: '1.25rem',   // 20px
  6: '1.5rem',    // 24px
  8: '2rem',      // 32px
  10: '2.5rem',   // 40px
  12: '3rem',     // 48px
  16: '4rem',     // 64px
  20: '5rem',     // 80px
  24: '6rem',     // 96px
};

export const SHADOWS = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
};

export const BORDERS = {
  width: {
    0: '0px',
    DEFAULT: '1px',
    2: '2px',
    4: '4px',
    8: '8px',
  },
  
  radius: {
    none: '0px',
    sm: '0.125rem',   // 2px
    DEFAULT: '0.25rem', // 4px
    md: '0.375rem',   // 6px
    lg: '0.5rem',     // 8px
    xl: '0.75rem',    // 12px
    '2xl': '1rem',    // 16px
    full: '9999px',
  }
};

export const LAYOUT = {
  container: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  
  sidebar: {
    width: '280px',
    widthCollapsed: '80px',
  },
  
  header: {
    height: '72px',
  }
};

// Component-specific design tokens
export const COMPONENTS = {
  card: {
    background: COLORS.neutral[50],
    border: COLORS.neutral[200],
    shadow: SHADOWS.sm,
    padding: SPACING[6],
    radius: BORDERS.radius.lg,
  },
  
  button: {
    primary: {
      background: COLORS.primary[600],
      backgroundHover: COLORS.primary[700],
      text: COLORS.neutral[50],
      shadow: SHADOWS.sm,
    },
    secondary: {
      background: COLORS.neutral[100],
      backgroundHover: COLORS.neutral[200],
      text: COLORS.primary[700],
      border: COLORS.neutral[300],
    },
    success: {
      background: COLORS.success[600],
      backgroundHover: COLORS.success[700],
      text: COLORS.neutral[50],
    },
    warning: {
      background: COLORS.warning[500],
      backgroundHover: COLORS.warning[600],
      text: COLORS.neutral[900],
    },
    error: {
      background: COLORS.error[600],
      backgroundHover: COLORS.error[700],
      text: COLORS.neutral[50],
    }
  },
  
  input: {
    background: COLORS.neutral[50],
    border: COLORS.neutral[300],
    borderFocus: COLORS.accent[500],
    text: COLORS.neutral[900],
    placeholder: COLORS.neutral[500],
    shadow: SHADOWS.sm,
  },
  
  table: {
    header: {
      background: COLORS.neutral[100],
      text: COLORS.neutral[700],
      borderBottom: COLORS.neutral[200],
    },
    row: {
      background: COLORS.neutral[50],
      backgroundHover: COLORS.neutral[100],
      border: COLORS.neutral[200],
    }
  },
  
  badge: {
    primary: {
      background: COLORS.primary[100],
      text: COLORS.primary[800],
      border: COLORS.primary[200],
    },
    success: {
      background: COLORS.success[100],
      text: COLORS.success[800],
      border: COLORS.success[200],
    },
    warning: {
      background: COLORS.warning[100],
      text: COLORS.warning[800],
      border: COLORS.warning[200],
    },
    error: {
      background: COLORS.error[100],
      text: COLORS.error[800],
      border: COLORS.error[200],
    }
  }
};

// Status-specific color mappings
export const STATUS_COLORS = {
  active: COMPONENTS.badge.success,
  inactive: COMPONENTS.badge.primary,
  pending: COMPONENTS.badge.warning,
  blocked: COMPONENTS.badge.error,
  completed: COMPONENTS.badge.primary,
};

// Role-specific color mappings  
export const ROLE_COLORS = {
  admin: {
    background: COLORS.error[100],
    text: COLORS.error[800],
    border: COLORS.error[200],
  },
  editor: {
    background: COLORS.accent[100],
    text: COLORS.accent[800],
    border: COLORS.accent[200],
  },
  viewer: {
    background: COLORS.neutral[100],
    text: COLORS.neutral[700],
    border: COLORS.neutral[300],
  }
};