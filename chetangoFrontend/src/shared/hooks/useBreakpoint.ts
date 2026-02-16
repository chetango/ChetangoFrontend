/**
 * 📱 useBreakpoint - Hook para detección de breakpoints responsive
 * 
 * Hook personalizado que detecta el breakpoint actual del viewport
 * y proporciona información útil sobre el dispositivo.
 * 
 * @example
 * ```tsx
 * const { isMobile, isTablet, isDesktop, breakpoint } = useBreakpoint();
 * 
 * if (isMobile) {
 *   return <MobileView />;
 * }
 * 
 * return <DesktopView />;
 * ```
 */

import { useState, useEffect } from 'react';
import { type Breakpoint, getDeviceCategory, type DeviceCategory } from '../constants/breakpoints';
import { getCurrentBreakpoint, isTouchDevice } from '../constants/responsive';

interface UseBreakpointReturn {
  /** Breakpoint actual ('xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl') */
  breakpoint: Breakpoint;
  /** Ancho actual del viewport en px */
  width: number;
  /** Categoría del dispositivo ('mobile' | 'tablet' | 'desktop') */
  device: DeviceCategory;
  /** true si es móvil (< 768px) */
  isMobile: boolean;
  /** true si es tablet (768px - 1023px) */
  isTablet: boolean;
  /** true si es desktop (>= 1024px) */
  isDesktop: boolean;
  /** true si el dispositivo soporta touch */
  isTouch: boolean;
  /** true si está en modo portrait */
  isPortrait: boolean;
  /** true si está en modo landscape */
  isLandscape: boolean;
}

export function useBreakpoint(): UseBreakpointReturn {
  const [state, setState] = useState<UseBreakpointReturn>(() => {
    // Inicialización con valores del servidor (SSR-safe)
    if (typeof window === 'undefined') {
      return {
        breakpoint: 'lg',
        width: 1024,
        device: 'desktop',
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        isTouch: false,
        isPortrait: false,
        isLandscape: true,
      };
    }

    // Inicialización del cliente
    const width = window.innerWidth;
    const breakpoint = getCurrentBreakpoint();
    const device = getDeviceCategory(width);
    const isTouch = isTouchDevice();
    const isPortrait = window.innerHeight > window.innerWidth;

    return {
      breakpoint,
      width,
      device,
      isMobile: device === 'mobile',
      isTablet: device === 'tablet',
      isDesktop: device === 'desktop',
      isTouch,
      isPortrait,
      isLandscape: !isPortrait,
    };
  });

  useEffect(() => {
    // Handler para actualizar el estado cuando cambia el tamaño
    const handleResize = () => {
      const width = window.innerWidth;
      const breakpoint = getCurrentBreakpoint();
      const device = getDeviceCategory(width);
      const isTouch = isTouchDevice();
      const isPortrait = window.innerHeight > window.innerWidth;

      setState({
        breakpoint,
        width,
        device,
        isMobile: device === 'mobile',
        isTablet: device === 'tablet',
        isDesktop: device === 'desktop',
        isTouch,
        isPortrait,
        isLandscape: !isPortrait,
      });
    };

    // Agregar listener con throttle para performance
    let timeoutId: number;
    const throttledResize = () => {
      clearTimeout(timeoutId);
      timeoutId = window.setTimeout(handleResize, 100);
    };

    window.addEventListener('resize', throttledResize);
    window.addEventListener('orientationchange', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', throttledResize);
      window.removeEventListener('orientationchange', handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  return state;
}

/**
 * Hook simplificado para detección móvil
 */
export function useIsMobile(): boolean {
  const { isMobile } = useBreakpoint();
  return isMobile;
}

/**
 * Hook simplificado para detección tablet
 */
export function useIsTablet(): boolean {
  const { isTablet } = useBreakpoint();
  return isTablet;
}

/**
 * Hook simplificado para detección desktop
 */
export function useIsDesktop(): boolean {
  const { isDesktop } = useBreakpoint();
  return isDesktop;
}
