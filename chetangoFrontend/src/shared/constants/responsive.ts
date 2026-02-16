/**
 * 📐 RESPONSIVE UTILITIES - Utilidades para manejo responsive
 * 
 * Constantes y funciones helper para trabajar con diseño responsive
 * en toda la aplicación.
 */

import { BREAKPOINTS, type Breakpoint, type DeviceCategory } from './breakpoints';

/**
 * ⚡ SPACING - Espaciado según dispositivo
 */
export const SPACING = {
  mobile: {
    padding: '1rem',      // 16px
    gap: '0.5rem',        // 8px
    margin: '0.75rem',    // 12px
  },
  tablet: {
    padding: '1.5rem',    // 24px
    gap: '0.75rem',       // 12px
    margin: '1rem',       // 16px
  },
  desktop: {
    padding: '2rem',      // 32px
    gap: '1rem',          // 16px
    margin: '1.5rem',     // 24px
  },
} as const;

/**
 * 👆 TOUCH TARGET - Tamaños mínimos para elementos interactivos
 * Basado en guías de accesibilidad WCAG y mejores prácticas móviles
 */
export const TOUCH_TARGET = {
  min: 44,              // px - Tamaño mínimo recomendado
  comfortable: 48,      // px - Tamaño cómodo
  large: 56,            // px - Tamaño grande (botones primarios)
} as const;

/**
 * 📏 RESPONSIVE SIZES - Tamaños comunes responsive
 */
export const RESPONSIVE_SIZES = {
  sidebar: {
    mobile: 'w-full',
    desktop: 'w-64',
  },
  modal: {
    mobile: 'w-full h-screen',
    tablet: 'w-11/12 max-w-2xl',
    desktop: 'w-full max-w-4xl',
  },
  card: {
    mobile: 'w-full',
    tablet: 'w-[calc(50%-0.5rem)]',
    desktop: 'w-[calc(33.333%-0.75rem)]',
  },
  table: {
    mobile: 'hidden', // Usar card view en móvil
    tablet: 'block',
    desktop: 'block',
  },
} as const;

/**
 * 🎨 RESPONSIVE CLASSES - Clases Tailwind helper
 */
export const RESPONSIVE_CLASSES = {
  // Padding responsive
  padding: {
    mobile: 'p-4',
    tablet: 'md:p-6',
    desktop: 'lg:p-8',
    all: 'p-4 md:p-6 lg:p-8',
  },
  // Gap responsive
  gap: {
    mobile: 'gap-2',
    tablet: 'md:gap-3',
    desktop: 'lg:gap-4',
    all: 'gap-2 md:gap-3 lg:gap-4',
  },
  // Text size responsive
  text: {
    xs: 'text-xs sm:text-sm',
    sm: 'text-sm sm:text-base',
    base: 'text-base sm:text-lg',
    lg: 'text-lg sm:text-xl',
    xl: 'text-xl sm:text-2xl',
    '2xl': 'text-2xl sm:text-3xl',
  },
  // Grid responsive
  grid: {
    '1-2': 'grid-cols-1 lg:grid-cols-2',
    '1-2-3': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    '1-2-4': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    '2-3-4': 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
  },
} as const;

/**
 * 🔧 UTILITY FUNCTIONS
 */

/**
 * Obtener espaciado según categoría de dispositivo
 */
export function getSpacing(device: DeviceCategory): typeof SPACING.mobile {
  return SPACING[device];
}

/**
 * Generar clases Tailwind responsive para padding
 */
export function getResponsivePadding(base: number = 4): string {
  return `p-${base} md:p-${base + 2} lg:p-${base + 4}`;
}

/**
 * Generar clases Tailwind responsive para gap
 */
export function getResponsiveGap(base: number = 2): string {
  return `gap-${base} md:gap-${base + 1} lg:gap-${base + 2}`;
}

/**
 * Generar clases de grid responsive
 */
export function getResponsiveGrid(
  mobile: number,
  tablet?: number,
  desktop?: number
): string {
  const classes = [`grid-cols-${mobile}`];
  
  if (tablet) classes.push(`md:grid-cols-${tablet}`);
  if (desktop) classes.push(`lg:grid-cols-${desktop}`);
  
  return classes.join(' ');
}

/**
 * Verificar si el viewport es móvil
 */
export function isMobileViewport(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < BREAKPOINTS.md;
}

/**
 * Verificar si el viewport es tablet
 */
export function isTabletViewport(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= BREAKPOINTS.md && window.innerWidth < BREAKPOINTS.lg;
}

/**
 * Verificar si el viewport es desktop
 */
export function isDesktopViewport(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= BREAKPOINTS.lg;
}

/**
 * Obtener breakpoint actual
 */
export function getCurrentBreakpoint(): Breakpoint {
  if (typeof window === 'undefined') return 'lg';
  
  const width = window.innerWidth;
  
  if (width < BREAKPOINTS.sm) return 'xs';
  if (width < BREAKPOINTS.md) return 'sm';
  if (width < BREAKPOINTS.lg) return 'md';
  if (width < BREAKPOINTS.xl) return 'lg';
  if (width < BREAKPOINTS['2xl']) return 'xl';
  return '2xl';
}

/**
 * Detectar si es dispositivo táctil
 */
export function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false;
  
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    // @ts-ignore - Para compatibilidad con navegadores antiguos
    navigator.msMaxTouchPoints > 0
  );
}

/**
 * Combinar clases CSS de forma segura
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
