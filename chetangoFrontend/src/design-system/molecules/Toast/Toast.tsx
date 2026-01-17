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
 */
export function Toaster({
  position = 'top-right',
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
            'rounded-xl',
            'shadow-[0_20px_40px_rgba(0,0,0,0.5),inset_0_1px_2px_rgba(255,255,255,0.15)]',
            'text-[#f9fafb]',
          ].join(' '),
          title: 'text-[#f9fafb] font-medium',
          description: 'text-[#d1d5db]',
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
          success: 'border-l-4 border-l-[#34d399]',
          error: 'border-l-4 border-l-[#ef4444]',
          warning: 'border-l-4 border-l-[#f59e0b]',
          info: 'border-l-4 border-l-[#3b82f6]',
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
};
