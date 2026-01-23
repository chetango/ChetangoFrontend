// ============================================
// ERROR STATE COMPONENT - CHETANGO
// ============================================

import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/shared/constants/routes'
import { ERROR_MESSAGES, type ApiError } from '@/shared/api/interceptors'
import {
  AlertTriangle,
  Lock,
  FileQuestion,
  WifiOff,
  RefreshCw,
  LogIn,
} from 'lucide-react'

// ============================================
// TYPES
// ============================================

export interface ErrorStateProps {
  /** Custom error message to display */
  message?: string
  /** The error object (can be ApiError or standard Error) */
  error?: Error | ApiError | null
  /** Callback for retry action (only shown for recoverable errors) */
  onRetry?: () => void
  /** Custom title for the error state */
  title?: string
  /** Whether to show a compact version */
  compact?: boolean
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Determines the error type based on the error object
 */
function getErrorType(error?: Error | ApiError | null): 'auth' | 'permission' | 'notFound' | 'network' | 'generic' {
  if (!error) return 'generic'
  
  const apiError = error as ApiError
  const status = apiError?.status
  
  if (status === 401) return 'auth'
  if (status === 403) return 'permission'
  if (status === 404) return 'notFound'
  
  // Check for network errors
  if (error.message?.toLowerCase().includes('network') || 
      error.message?.toLowerCase().includes('conexión') ||
      error.message?.toLowerCase().includes('connection')) {
    return 'network'
  }
  
  return 'generic'
}

/**
 * Gets the appropriate icon for the error type
 */
function getErrorIcon(errorType: string) {
  switch (errorType) {
    case 'auth':
      return <LogIn className="w-8 h-8 text-[#fbbf24]" />
    case 'permission':
      return <Lock className="w-8 h-8 text-[#fbbf24]" />
    case 'notFound':
      return <FileQuestion className="w-8 h-8 text-[#9ca3af]" />
    case 'network':
      return <WifiOff className="w-8 h-8 text-[#ef4444]" />
    default:
      return <AlertTriangle className="w-8 h-8 text-[#ef4444]" />
  }
}

/**
 * Gets the appropriate background color for the error type
 */
function getErrorBgColor(errorType: string): string {
  switch (errorType) {
    case 'auth':
    case 'permission':
      return 'bg-[rgba(251,191,36,0.1)]'
    case 'notFound':
      return 'bg-[rgba(156,163,175,0.1)]'
    case 'network':
    case 'generic':
    default:
      return 'bg-[rgba(239,68,68,0.1)]'
  }
}

/**
 * Gets the appropriate text color for the error type
 */
function getErrorTextColor(errorType: string): string {
  switch (errorType) {
    case 'auth':
    case 'permission':
      return 'text-[#fbbf24]'
    case 'notFound':
      return 'text-[#9ca3af]'
    case 'network':
    case 'generic':
    default:
      return 'text-[#ef4444]'
  }
}

/**
 * Gets the default message for the error type
 */
function getDefaultMessage(errorType: string, error?: Error | ApiError | null): string {
  const apiError = error as ApiError
  
  // If the error has a message and it's not the generic one, use it
  if (apiError?.message && apiError.message !== ERROR_MESSAGES.DEFAULT) {
    return apiError.message
  }
  
  switch (errorType) {
    case 'auth':
      return 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.'
    case 'permission':
      return ERROR_MESSAGES[403]
    case 'notFound':
      return ERROR_MESSAGES[404]
    case 'network':
      return 'Error de conexión. Verifica tu conexión a internet.'
    default:
      return ERROR_MESSAGES.DEFAULT
  }
}

/**
 * Gets the subtitle/help text for the error type
 */
function getSubtitle(errorType: string): string {
  switch (errorType) {
    case 'auth':
      return 'Serás redirigido a la página de inicio de sesión'
    case 'permission':
      return 'Contacta al administrador si crees que deberías tener acceso'
    case 'notFound':
      return 'El recurso que buscas no existe o fue eliminado'
    case 'network':
      return 'Verifica tu conexión e intenta de nuevo'
    default:
      return 'Por favor, intenta de nuevo más tarde'
  }
}

/**
 * Determines if the error is recoverable (can retry)
 */
function isRecoverableError(errorType: string): boolean {
  // Auth and permission errors are not recoverable via retry
  return errorType !== 'auth' && errorType !== 'permission'
}

// ============================================
// MAIN COMPONENT
// ============================================

/**
 * Reusable ErrorState component for displaying HTTP errors
 * 
 * Features:
 * - Handles 401 (redirect to login)
 * - Handles 403 (permission denied message)
 * - Handles 404 (not found message)
 * - Handles network errors (retry option)
 * - Handles generic errors
 * 
 * Requirements: 6.2, 6.3, 6.4, 6.5
 */
export function ErrorState({
  message,
  error,
  onRetry,
  title,
  compact = false,
}: ErrorStateProps) {
  const navigate = useNavigate()
  const errorType = getErrorType(error)
  const displayMessage = message || getDefaultMessage(errorType, error)
  const subtitle = getSubtitle(errorType)
  const isRecoverable = isRecoverableError(errorType) && onRetry !== undefined
  const showLoginButton = errorType === 'auth'

  // Handle login redirect for 401 errors (Requirement 6.2)
  const handleLogin = useCallback(() => {
    navigate(ROUTES.LOGIN)
  }, [navigate])

  // Compact version for inline errors
  if (compact) {
    return (
      <div className="flex items-center gap-3 p-4 rounded-xl bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.2)]">
        <AlertTriangle className="w-5 h-5 text-[#ef4444] flex-shrink-0" />
        <p className="text-[#ef4444] text-sm">{displayMessage}</p>
        {isRecoverable && (
          <button
            onClick={onRetry}
            className="
              ml-auto flex items-center gap-1.5
              px-3 py-1.5
              rounded-lg
              text-sm font-medium
              text-[#f9fafb]
              bg-[rgba(239,68,68,0.2)]
              hover:bg-[rgba(239,68,68,0.3)]
              transition-colors duration-200
            "
          >
            <RefreshCw className="w-4 h-4" />
            Reintentar
          </button>
        )}
      </div>
    )
  }

  // Full version for page-level errors
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {/* Icon */}
      <div
        className={`
          w-16 h-16 mb-4 rounded-full 
          flex items-center justify-center
          ${getErrorBgColor(errorType)}
        `}
      >
        {getErrorIcon(errorType)}
      </div>

      {/* Title (optional) */}
      {title && (
        <h3 className="text-[#f9fafb] text-xl font-semibold mb-2">
          {title}
        </h3>
      )}

      {/* Message */}
      <p className={`text-lg mb-2 ${getErrorTextColor(errorType)}`}>
        {displayMessage}
      </p>

      {/* Subtitle */}
      <p className="text-[#6b7280] text-sm mb-6 max-w-md">
        {subtitle}
      </p>

      {/* Actions */}
      <div className="flex items-center gap-3">
        {/* Retry button for recoverable errors (Requirement 6.5) */}
        {isRecoverable && (
          <button
            onClick={onRetry}
            className="
              flex items-center gap-2
              px-5 py-2.5
              rounded-xl
              backdrop-blur-xl
              bg-[rgba(201,52,72,0.2)]
              border border-[rgba(201,52,72,0.4)]
              text-[#f9fafb]
              font-medium
              transition-all duration-300
              hover:bg-[rgba(201,52,72,0.3)]
              hover:border-[rgba(201,52,72,0.6)]
              hover:scale-105
            "
          >
            <RefreshCw className="w-4 h-4" />
            Reintentar
          </button>
        )}

        {/* Login button for auth errors (Requirement 6.2) */}
        {showLoginButton && (
          <button
            onClick={handleLogin}
            className="
              flex items-center gap-2
              px-5 py-2.5
              rounded-xl
              backdrop-blur-xl
              bg-[rgba(251,191,36,0.2)]
              border border-[rgba(251,191,36,0.4)]
              text-[#fbbf24]
              font-medium
              transition-all duration-300
              hover:bg-[rgba(251,191,36,0.3)]
              hover:border-[rgba(251,191,36,0.6)]
              hover:scale-105
            "
          >
            <LogIn className="w-4 h-4" />
            Iniciar sesión
          </button>
        )}
      </div>
    </div>
  )
}

export default ErrorState
