/**
 * CHETANGO DESIGN SYSTEM - SPACING TOKENS
 */

export const SPACING = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  base: '16px',
  lg: '20px',
  xl: '24px',
  '2xl': '32px',
  '3xl': '40px',
  '4xl': '48px',
  '5xl': '64px',
} as const;

export const RADIUS = {
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  full: '9999px',
} as const;

export const BLUR = {
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
} as const;

export type SpacingToken = typeof SPACING;
export type RadiusToken = typeof RADIUS;
export type BlurToken = typeof BLUR;
