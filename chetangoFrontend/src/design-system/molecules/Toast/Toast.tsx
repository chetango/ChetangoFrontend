import { Toaster as SonnerToaster, toast } from 'sonner';

interface ToasterProps {
  /** Position of the toast notifications */
  position?:
    | 'top-left'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-right'
    | 'top-center'
    | 'bottom-center';
  /** Whether to show close button */
  closeButton?: boolean;
  /** Duration in milliseconds */
  duration?: number;
}

/**
 * Glass-styled Toast provider using Sonner
 * Add this component once at the root of your app
 * 
 * Figma Styles: 5.8 - Glassmorphism toast notifications
 */
export function Toaster({
  position = 'bottom-center',
  closeButton = true,
  duration = 4000,
}: ToasterProps) {
  return (
    <SonnerToaster
      position={position}
      closeButton={closeButton}
      duration={duration}
      theme="dark"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast: [
            'group toast',
            'backdrop-blur-2xl',
            'bg-gradient-to-br from-[rgba(42,42,48,0.95)] to-[rgba(26,26,32,0.98)]',
            'border border-[rgba(255,255,255,0.15)]',
            'rounded-2xl',
            'shadow-[0_12px_48px_rgba(0,0,0,0.5),inset_0_2px_4px_rgba(255,255,255,0.1)]',
            'text-[#f9fafb]',
            'min-w-[280px]',
          ].join(' '),
          title: 'text-[#f9fafb] font-medium text-[15px]',
          description: 'text-[#d1d5db] text-[13px]',
          actionButton: [
            'bg-[#c93448] text-[#f9fafb]',
            'hover:bg-[#a8243a]',
            'rounded-lg px-3 py-1.5',
            'transition-colors',
          ].join(' '),
          cancelButton: [
            'bg-[rgba(255,255,255,0.1)] text-[#d1d5db]',
            'hover:bg-[rgba(255,255,255,0.15)]',
            'rounded-lg px-3 py-1.5',
            'transition-colors',
          ].join(' '),
          closeButton: [
            'bg-[rgba(255,255,255,0.1)]',
            'hover:bg-[rgba(255,255,255,0.15)]',
            'border-[rgba(255,255,255,0.1)]',
            'text-[#d1d5db]',
          ].join(' '),
          success: [
            'border-l-4 border-l-[#34d399]',
            'bg-gradient-to-br from-[rgba(52,211,153,0.2)] to-[rgba(52,211,153,0.1)]',
            'border border-[rgba(52,211,153,0.4)]',
            'shadow-[0_12px_48px_rgba(52,211,153,0.3),inset_0_2px_4px_rgba(255,255,255,0.1)]',
          ].join(' '),
          error: [
            'border-l-4 border-l-[#ef4444]',
            'bg-gradient-to-br from-[rgba(239,68,68,0.2)] to-[rgba(239,68,68,0.1)]',
            'border border-[rgba(239,68,68,0.4)]',
          ].join(' '),
          warning: [
            'border-l-4 border-l-[#f59e0b]',
            'bg-gradient-to-br from-[rgba(245,158,11,0.2)] to-[rgba(245,158,11,0.1)]',
            'border border-[rgba(245,158,11,0.4)]',
          ].join(' '),
          info: [
            'border-l-4 border-l-[#3b82f6]',
            'bg-gradient-to-br from-[rgba(59,130,246,0.2)] to-[rgba(59,130,246,0.1)]',
            'border border-[rgba(59,130,246,0.4)]',
          ].join(' '),
        },
      }}
    />
  );
}

// Re-export toast function for convenience
export { toast };

// Helper functions for common toast types
export const showToast = {
  success: (message: string, description?: string) =>
    toast.success(message, { description }),
  error: (message: string, description?: string) =>
    toast.error(message, { description }),
  warning: (message: string, description?: string) =>
    toast.warning(message, { description }),
  info: (message: string, description?: string) =>
    toast.info(message, { description }),
  loading: (message: string) => toast.loading(message),
  dismiss: (toastId?: string | number) => toast.dismiss(toastId),
  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error: string;
    }
  ) => toast.promise(promise, messages),
  
  /**
   * Shows attendance marked toast (Requirement 3.6)
   * Per Figma: Success toast with "Asistencia marcada" message
   */
  attendanceMarked: () =>
    toast.success('Asistencia marcada', { description: 'Cambio guardado' }),
  
  /**
   * Shows package reactivated toast (Requirement 2.9)
   * Per Figma: Info toast when frozen package is reactivated
   */
  packageReactivated: () =>
    toast.info('Paquete reactivado automáticamente', {
      description: 'El paquete congelado fue reactivado al marcar presente',
    }),
};
