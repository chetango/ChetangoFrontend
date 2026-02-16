/**
 * 👆 useTouchGestures - Hook para gestos táctiles avanzados
 * 
 * Hook basado en @use-gesture/react para manejar gestos táctiles
 * como swipe, drag, pinch, etc.
 * 
 * @see https://use-gesture.netlify.app/
 * 
 * @example
 * ```tsx
 * // Ejemplo 1: Swipe horizontal
 * const { bind, direction } = useSwipe({
 *   onSwipeLeft: () => console.log('Swipe left'),
 *   onSwipeRight: () => console.log('Swipe right'),
 * });
 * 
 * return <div {...bind()}>Swipe me!</div>;
 * 
 * // Ejemplo 2: Drag para cerrar modal
 * const { bind, isDragging, progress } = useDragToClose({
 *   onClose: () => setIsOpen(false),
 *   threshold: 150,
 * });
 * 
 * return (
 *   <div {...bind()} style={{ transform: `translateY(${progress}px)` }}>
 *     Drag down to close
 *   </div>
 * );
 * ```
 */

import { useDrag, useGesture } from '@use-gesture/react';
import { useState, useCallback } from 'react';

/**
 * Configuración para swipe
 */
interface UseSwipeConfig {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  threshold?: number; // Distancia mínima en px para considerar swipe
  velocity?: number; // Velocidad mínima para considerar swipe
}

/**
 * Hook para detección de swipe
 */
export function useSwipe(config: UseSwipeConfig) {
  const {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    threshold = 50,
    velocity = 0.5,
  } = config;

  const [direction, setDirection] = useState<'left' | 'right' | 'up' | 'down' | null>(null);

  const bind = useDrag(
    ({ direction: [dx, dy], velocity: [vx, vy], last }) => {
      if (!last) return;

      // Detectar dirección del swipe
      const isHorizontal = Math.abs(dx) > Math.abs(dy);
      const isVertical = Math.abs(dy) > Math.abs(dx);

      // Swipe horizontal
      if (isHorizontal) {
        if (dx > threshold && vx > velocity) {
          setDirection('right');
          onSwipeRight?.();
        } else if (dx < -threshold && vx > velocity) {
          setDirection('left');
          onSwipeLeft?.();
        }
      }

      // Swipe vertical
      if (isVertical) {
        if (dy > threshold && vy > velocity) {
          setDirection('down');
          onSwipeDown?.();
        } else if (dy < -threshold && vy > velocity) {
          setDirection('up');
          onSwipeUp?.();
        }
      }

      // Reset dirección después de 300ms
      setTimeout(() => setDirection(null), 300);
    },
    {
      filterTaps: true,
      axis: undefined, // Permitir swipe en cualquier dirección
    }
  );

  return { bind, direction };
}

/**
 * Configuración para drag to close
 */
interface UseDragToCloseConfig {
  onClose: () => void;
  threshold?: number; // Distancia en px para cerrar
  axis?: 'x' | 'y';   // Eje de movimiento
  onDragStart?: () => void;
  onDragEnd?: () => void;
}

/**
 * Hook para drag to close (ej: cerrar modal arrastrando hacia abajo)
 */
export function useDragToClose(config: UseDragToCloseConfig) {
  const {
    onClose,
    threshold = 150,
    axis = 'y',
    onDragStart,
    onDragEnd,
  } = config;

  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState(0);

  const bind = useDrag(
    ({ movement: [mx, my], last, velocity: [vx, vy], active }) => {
      const movement = axis === 'x' ? mx : my;
      const vel = axis === 'x' ? vx : vy;

      if (active && !isDragging) {
        setIsDragging(true);
        onDragStart?.();
      }

      // Solo permitir drag en dirección positiva (hacia abajo o derecha)
      const clampedMovement = Math.max(0, movement);
      setProgress(clampedMovement);

      // Si se suelta y supera el threshold o tiene velocidad suficiente
      if (last) {
        setIsDragging(false);
        onDragEnd?.();

        if (clampedMovement > threshold || vel > 0.5) {
          onClose();
        } else {
          // Volver a la posición original
          setProgress(0);
        }
      }
    },
    {
      axis,
      filterTaps: true,
      rubberband: true,
    }
  );

  return {
    bind,
    isDragging,
    progress,
    shouldClose: progress > threshold,
  };
}

/**
 * Hook para pull to refresh
 */
interface UsePullToRefreshConfig {
  onRefresh: () => Promise<void>;
  threshold?: number;
  resistance?: number; // Factor de resistencia (0-1)
}

export function usePullToRefresh(config: UsePullToRefreshConfig) {
  const { onRefresh, threshold = 80, resistance = 0.5 } = config;
  const [isPulling, setIsPulling] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);

  const bind = useDrag(
    ({ movement: [, my], last, velocity: [, vy], memo = 0 }) => {
      // Solo permitir pull cuando el scroll está en el top
      const isAtTop = window.scrollY === 0;
      if (!isAtTop && my < 0) return memo;

      // Aplicar resistencia
      const distance = Math.max(0, my * resistance);
      setPullDistance(distance);

      if (!last) {
        setIsPulling(distance > threshold);
        return distance;
      }

      // Si se suelta
      setIsPulling(false);

      // Si supera el threshold o tiene velocidad, hacer refresh
      if (distance > threshold || vy > 0.5) {
        setIsRefreshing(true);
        onRefresh().finally(() => {
          setIsRefreshing(false);
          setPullDistance(0);
        });
      } else {
        setPullDistance(0);
      }

      return 0;
    },
    {
      axis: 'y',
      filterTaps: true,
      from: () => [0, pullDistance],
    }
  );

  return {
    bind,
    isPulling,
    isRefreshing,
    pullDistance,
    shouldRefresh: pullDistance > threshold,
  };
}

/**
 * Hook combinado para múltiples gestos
 */
interface UseGesturesConfig {
  onTap?: () => void;
  onDoubleTap?: () => void;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
}

export function useGestures(config: UseGesturesConfig) {
  const {
    onTap,
    onDoubleTap,
    onSwipeLeft,
    onSwipeRight,
  } = config;

  const bind = useGesture(
    {
      // Tap
      onClick: () => {
        onTap?.();
      },
      // Double tap
      onDoubleClick: () => {
        onDoubleTap?.();
      },
      // Drag (swipe)
      onDrag: ({ direction: [dx], velocity: [vx], last }) => {
        if (!last) return;

        if (dx === 1 && vx > 0.5) {
          onSwipeRight?.();
        } else if (dx === -1 && vx > 0.5) {
          onSwipeLeft?.();
        }
      },
    },
    {
      drag: {
        filterTaps: true,
      },
    }
  );

  return { bind };
}

/**
 * Hook para haptic feedback (vibración)
 * Funciona solo en dispositivos móviles que lo soporten
 */
export function useHapticFeedback() {
  const vibrate = useCallback((pattern: number | number[] = 10) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  }, []);

  const light = useCallback(() => vibrate(10), [vibrate]);
  const medium = useCallback(() => vibrate(20), [vibrate]);
  const heavy = useCallback(() => vibrate(30), [vibrate]);
  const success = useCallback(() => vibrate([10, 50, 10]), [vibrate]);
  const warning = useCallback(() => vibrate([20, 100, 20]), [vibrate]);
  const error = useCallback(() => vibrate([30, 100, 30, 100, 30]), [vibrate]);

  return {
    vibrate,
    light,
    medium,
    heavy,
    success,
    warning,
    error,
  };
}
