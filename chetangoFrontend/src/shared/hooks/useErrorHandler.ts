import { useCallback } from 'react'

interface ErrorHandlerOptions {
  showToast?: boolean
  logError?: boolean
  fallbackMessage?: string
}

export const useErrorHandler = () => {
  const handleError = useCallback((
    error: unknown,
    options: ErrorHandlerOptions = {}
  ) => {
    const {
      logError = true,
      fallbackMessage = 'Ha ocurrido un error inesperado'
    } = options

    let errorMessage = fallbackMessage

    // Extract error message safely
    if (error instanceof Error) {
      errorMessage = error.message
    } else if (typeof error === 'string') {
      errorMessage = error
    } else if (error && typeof error === 'object' && 'message' in error) {
      const msg = (error as Record<string, unknown>).message
      errorMessage = typeof msg === 'string' ? msg : fallbackMessage
    }

    // Log error for debugging
    if (logError && process.env.NODE_ENV === 'development') {
      console.error('Error handled:', errorMessage, error)
    }

    return errorMessage
  }, [])

  return {
    handleError,
  }
}