/**
 * CHETANGO DESIGN SYSTEM - COLOR TOKENS
 * Dark Mode Premium / Liquid Glass Aesthetic
 */

export const COLORS = {
  // Background Layers
  background: {
    base: '#0a0a0b',
    elevated: '#111113',
    secondary: '#1a1a1d',
  },

  // Glass Surfaces
  glass: {
    primary: 'rgba(26, 26, 32, 0.7)',
    secondary: 'rgba(34, 34, 40, 0.6)',
    tertiary: 'rgba(42, 42, 48, 0.5)',
  },

  // Brand Colors
  brand: {
    primary: '#c93448',
    primaryDark: '#a8243a',
    primaryLight: '#e54d5e',
    secondary: '#7c5af8',
    secondaryDark: '#6938ef',
    secondaryLight: '#9b8afb',
  },

  // Semantic Colors
  semantic: {
    success: '#34d399',
    successDark: '#059669',
    successLight: '#6ee7b7',
    error: '#ef4444',
    errorDark: '#dc2626',
    errorLight: '#fca5a5',
    warning: '#f59e0b',
    warningDark: '#d97706',
    warningLight: '#fcd34d',
    info: '#3b82f6',
    infoDark: '#2563eb',
    infoLight: '#93c5fd',
  },

  // Text Colors
  text: {
    primary: '#f9fafb',
    secondary: '#d1d5db',
    tertiary: '#9ca3af',
    muted: '#6b7280',
  },

  // Border Colors
  border: {
    subtle: 'rgba(255, 255, 255, 0.08)',
    medium: 'rgba(255, 255, 255, 0.12)',
    strong: 'rgba(255, 255, 255, 0.18)',
    glass: 'rgba(255, 255, 255, 0.1)',
  },

  // Ambient Glows (for backgrounds)
  ambient: {
    primary: 'rgba(201, 52, 72, 0.08)',
    secondary: 'rgba(124, 90, 248, 0.06)',
    success: 'rgba(52, 211, 153, 0.04)',
  },
} as const;

export type ColorToken = typeof COLORS;
