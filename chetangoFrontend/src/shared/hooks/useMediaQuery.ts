/**
 * 📐 useMediaQuery - Hook para media queries programáticas
 * 
 * Hook para evaluar media queries de CSS en tiempo real.
 * Compatible con SSR (Server-Side Rendering).
 * 
 * @example
 * ```tsx
 * const isLargeScreen = useMediaQuery('(min-width: 1024px)');
 * const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
 * const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
 * 
 * return (
 *   <div className={isLargeScreen ? 'large-layout' : 'small-layout'}>
 *     {content}
 *   </div>
 * );
 * ```
 */

import { useState, useEffect } from 'react';

export function useMediaQuery(query: string): boolean {
  // Estado inicial - asume false para SSR
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    // Verificar si estamos en el navegador
    if (typeof window === 'undefined') return;

    // Crear media query list
    const mediaQuery = window.matchMedia(query);
    
    // Handler para cambios
    const handleChange = (event: MediaQueryListEvent | MediaQueryList) => {
      setMatches(event.matches);
    };

    // Setear valor inicial
    handleChange(mediaQuery);

    // Agregar listener
    // Usar el método moderno si está disponible, sino usar el legacy
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      // @ts-ignore - Para compatibilidad con navegadores antiguos
      mediaQuery.addListener(handleChange);
    }

    // Cleanup
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        // @ts-ignore - Para compatibilidad con navegadores antiguos
        mediaQuery.removeListener(handleChange);
      }
    };
  }, [query]);

  return matches;
}

/**
 * Hook para detectar modo oscuro del sistema
 */
export function usePrefersDarkMode(): boolean {
  return useMediaQuery('(prefers-color-scheme: dark)');
}

/**
 * Hook para detectar preferencia de movimiento reducido
 * Útil para accesibilidad - desactivar animaciones si el usuario lo prefiere
 */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}

/**
 * Hook para detectar orientación portrait
 */
export function useIsPortrait(): boolean {
  return useMediaQuery('(orientation: portrait)');
}

/**
 * Hook para detectar orientación landscape
 */
export function useIsLandscape(): boolean {
  return useMediaQuery('(orientation: landscape)');
}

/**
 * Hook para detectar retina/high-DPI screens
 */
export function useIsRetina(): boolean {
  return useMediaQuery(
    '(-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi)'
  );
}

/**
 * Hook para detectar si el dispositivo puede hacer hover
 * Útil para distinguir entre mouse y touch
 */
export function useCanHover(): boolean {
  return useMediaQuery('(hover: hover) and (pointer: fine)');
}
