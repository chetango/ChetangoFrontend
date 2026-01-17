/**
 * CHETANGO DESIGN SYSTEM - SHADOW TOKENS
 * Liquid Glass Aesthetic
 */

export const SHADOWS = {
  // Glass Panel Shadows
  glass: {
    sm: '0_4px_16px_rgba(0,0,0,0.3), inset_0_1px_1px_rgba(255,255,255,0.1)',
    md: '0_8px_24px_rgba(0,0,0,0.4), inset_0_1px_2px_rgba(255,255,255,0.1)',
    lg: '0_20px_40px_rgba(0,0,0,0.5), inset_0_1px_2px_rgba(255,255,255,0.15), inset_0_-1px_2px_rgba(0,0,0,0.3)',
  },

  // Button Shadows
  button: {
    primary: '0_8px_32px_rgba(201,52,72,0.4), inset_0_1px_2px_rgba(255,255,255,0.2)',
    primaryHover: '0_12px_48px_rgba(201,52,72,0.6)',
  },

  // Input Shadows
  input: {
    default: 'inset_0_2px_4px_rgba(0,0,0,0.3), 0_1px_2px_rgba(255,255,255,0.05)',
    focus: 'inset_0_2px_4px_rgba(0,0,0,0.3), 0_0_0_3px_rgba(201,52,72,0.2)',
  },

  // Badge Shadows
  badge: {
    success: '0_4px_12px_rgba(52,211,153,0.2), inset_0_1px_1px_rgba(52,211,153,0.3)',
    error: '0_4px_12px_rgba(239,68,68,0.2), inset_0_1px_1px_rgba(239,68,68,0.3)',
    warning: '0_4px_12px_rgba(245,158,11,0.2), inset_0_1px_1px_rgba(245,158,11,0.3)',
    info: '0_4px_12px_rgba(124,90,248,0.2), inset_0_1px_1px_rgba(124,90,248,0.3)',
  },

  // Glow Effects
  glow: {
    primary: '0_0_30px_rgba(201,52,72,0.5)',
    secondary: '0_0_30px_rgba(124,90,248,0.5)',
    success: '0_0_30px_rgba(52,211,153,0.5)',
  },
} as const;

export type ShadowToken = typeof SHADOWS;
