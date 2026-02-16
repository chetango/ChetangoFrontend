/**
 * 📦 ResponsiveContainer - Contenedor adaptativo para componentes
 * 
 * Componente wrapper que proporciona contexto responsive y
 * facilita la creación de componentes adaptativos.
 * 
 * @example
 * ```tsx
 * <ResponsiveContainer
 *   mobileRender={() => <MobileView />}
 *   desktopRender={() => <DesktopView />}
 * />
 * 
 * // O con children y props de device
 * <ResponsiveContainer>
 *   {({ isMobile, isTablet, isDesktop }) => (
 *     isMobile ? <MobileView /> : <DesktopView />
 *   )}
 * </ResponsiveContainer>
 * ```
 */

import { type ElementType, type ReactNode } from 'react';
import { cn } from '../../constants/responsive';
import { useBreakpoint } from '../../hooks/useBreakpoint';

interface ResponsiveContainerProps {
  /** Render prop que recibe información del dispositivo */
  children?: ReactNode | ((deviceInfo: ReturnType<typeof useBreakpoint>) => ReactNode);
  
  /** Render específico para móvil */
  mobileRender?: () => ReactNode;
  
  /** Render específico para tablet */
  tabletRender?: () => ReactNode;
  
  /** Render específico para desktop */
  desktopRender?: () => ReactNode;
  
  /** Clases CSS adicionales */
  className?: string;
  
  /** Aplicar padding responsive automático */
  applyPadding?: boolean;
  
  /** Aplicar gap responsive automático */
  applyGap?: boolean;
  
  /** Tag HTML del contenedor */
  as?: ElementType;
  
  /** Props adicionales para el elemento HTML */
  [key: string]: any;
}

export function ResponsiveContainer({
  children,
  mobileRender,
  tabletRender,
  desktopRender,
  className,
  applyPadding = false,
  applyGap = false,
  as: Component = 'div',
  ...props
}: ResponsiveContainerProps) {
  const deviceInfo = useBreakpoint();
  const { isMobile, isTablet, isDesktop } = deviceInfo;

  // Determinar qué contenido renderizar
  const renderContent = () => {
    // Si hay renders específicos, usarlos
    if (mobileRender && isMobile) return mobileRender();
    if (tabletRender && isTablet) return tabletRender();
    if (desktopRender && isDesktop) return desktopRender();
    
    // Fallback: desktop render para tablet si no hay tablet render
    if (desktopRender && isTablet && !tabletRender) return desktopRender();
    
    // Si children es función, pasar deviceInfo
    if (typeof children === 'function') {
      return children(deviceInfo);
    }
    
    // Si es ReactNode normal, renderizar directamente
    return children;
  };

  // Clases responsive automáticas
  const responsiveClasses = cn(
    applyPadding && 'p-4 md:p-6 lg:p-8',
    applyGap && 'gap-2 md:gap-3 lg:gap-4',
    className
  );

  return (
    <Component 
      className={responsiveClasses}
      data-device={deviceInfo.device}
      data-breakpoint={deviceInfo.breakpoint}
      {...props}
    >
      {renderContent()}
    </Component>
  );
}

/**
 * 📱 MobileOnly - Renderizar solo en móvil
 */
interface ConditionalRenderProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function MobileOnly({ children, fallback = null }: ConditionalRenderProps) {
  const { isMobile } = useBreakpoint();
  return <>{isMobile ? children : fallback}</>;
}

/**
 * 🖥️ DesktopOnly - Renderizar solo en desktop
 */
export function DesktopOnly({ children, fallback = null }: ConditionalRenderProps) {
  const { isDesktop } = useBreakpoint();
  return <>{isDesktop ? children : fallback}</>;
}

/**
 * 📱🖥️ TabletOnly - Renderizar solo en tablet
 */
export function TabletOnly({ children, fallback = null }: ConditionalRenderProps) {
  const { isTablet } = useBreakpoint();
  return <>{isTablet ? children : fallback}</>;
}

/**
 * 🔀 DeviceSwitch - Switch para diferentes dispositivos
 */
interface DeviceSwitchProps {
  mobile?: ReactNode;
  tablet?: ReactNode;
  desktop: ReactNode;
}

export function DeviceSwitch({ mobile, tablet, desktop }: DeviceSwitchProps) {
  const { isMobile, isTablet } = useBreakpoint();
  
  if (isMobile && mobile) return <>{mobile}</>;
  if (isTablet && tablet) return <>{tablet}</>;
  
  // Fallback: si es tablet pero no hay tablet render, usar desktop
  return <>{desktop}</>;
}

/**
 * 📐 AspectRatioContainer - Contenedor con aspect ratio responsive
 */
interface AspectRatioContainerProps {
  ratio?: number | { mobile: number; tablet?: number; desktop?: number };
  children: ReactNode;
  className?: string;
}

export function AspectRatioContainer({ 
  ratio = 16 / 9, 
  children,
  className 
}: AspectRatioContainerProps) {
  const { isMobile, isTablet } = useBreakpoint();
  
  // Determinar ratio según dispositivo
  let currentRatio: number;
  if (typeof ratio === 'object') {
    if (isMobile) {
      currentRatio = ratio.mobile;
    } else if (isTablet && ratio.tablet) {
      currentRatio = ratio.tablet;
    } else {
      currentRatio = ratio.desktop || ratio.mobile;
    }
  } else {
    currentRatio = ratio;
  }
  
  const paddingBottom = `${(1 / currentRatio) * 100}%`;
  
  return (
    <div className={cn('relative w-full', className)} style={{ paddingBottom }}>
      <div className="absolute inset-0">
        {children}
      </div>
    </div>
  );
}

/**
 * 🎯 SafeAreaContainer - Contenedor que respeta safe areas (notch, etc)
 */
interface SafeAreaContainerProps {
  children: ReactNode;
  className?: string;
  top?: boolean;
  bottom?: boolean;
  left?: boolean;
  right?: boolean;
}

export function SafeAreaContainer({ 
  children, 
  className,
  top = true,
  bottom = true,
  left = true,
  right = true
}: SafeAreaContainerProps) {
  const safeAreaClasses = cn(
    top && 'pt-[env(safe-area-inset-top)]',
    bottom && 'pb-[env(safe-area-inset-bottom)]',
    left && 'pl-[env(safe-area-inset-left)]',
    right && 'pr-[env(safe-area-inset-right)]',
    className
  );
  
  return <div className={safeAreaClasses}>{children}</div>;
}
