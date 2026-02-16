/**
 * 📱 BREAKPOINTS - Configuración de puntos de quiebre responsive
 * 
 * Valores definidos en píxeles para diferentes tamaños de viewport.
 * Debe coincidir con la configuración de Tailwind CSS.
 * 
 * @see tailwind.config.js - screens configuration
 */

export const BREAKPOINTS = {
  xs: 375,   // Móviles pequeños (iPhone SE, etc)
  sm: 640,   // Móviles grandes / landscape
  md: 768,   // Tablets portrait (iPad Mini, etc)
  lg: 1024,  // Tablets landscape / Desktop pequeño
  xl: 1280,  // Desktop estándar
  '2xl': 1536, // Desktop grande / 4K
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;

/**
 * Rangos de viewport para categorización
 */
export const VIEWPORT_RANGES = {
  mobile: { min: 0, max: BREAKPOINTS.md - 1 },      // 0 - 767px
  tablet: { min: BREAKPOINTS.md, max: BREAKPOINTS.lg - 1 }, // 768 - 1023px
  desktop: { min: BREAKPOINTS.lg, max: Infinity },  // 1024px+
} as const;

/**
 * Categorías de dispositivos
 */
export type DeviceCategory = 'mobile' | 'tablet' | 'desktop';

/**
 * Obtener categoría de dispositivo según ancho de viewport
 */
export function getDeviceCategory(width: number): DeviceCategory {
  if (width < BREAKPOINTS.md) return 'mobile';
  if (width < BREAKPOINTS.lg) return 'tablet';
  return 'desktop';
}

/**
 * Verificar si el ancho está en un rango específico
 */
export function isInBreakpoint(width: number, breakpoint: Breakpoint): boolean {
  const breakpointValue = BREAKPOINTS[breakpoint];
  const nextBreakpoint = getNextBreakpoint(breakpoint);
  const nextValue = nextBreakpoint ? BREAKPOINTS[nextBreakpoint] : Infinity;
  
  return width >= breakpointValue && width < nextValue;
}

/**
 * Obtener el siguiente breakpoint
 */
function getNextBreakpoint(breakpoint: Breakpoint): Breakpoint | null {
  const keys = Object.keys(BREAKPOINTS) as Breakpoint[];
  const currentIndex = keys.indexOf(breakpoint);
  return currentIndex < keys.length - 1 ? keys[currentIndex + 1] : null;
}
