import { useCallback } from 'react'
import { useAppDispatch } from '@/app/store/hooks'
import { setError } from '@/features/auth'

interface ErrorHandlerOptions {
  showToast?: boolean
  logError?: boolean
  fallbackMessage?: string
}

export const useErrorHandler = () => {
  const dispatch = useAppDispatch()

  const handleError = useCallback((
    error: unknown,
    options: ErrorHandlerOptions = {}
  ) => {
    const {
      showToast = true,
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


    // Show error in UI
    if (showToast) {
      dispatch(setError(errorMessage))
    }

    return errorMessage
  }, [dispatch])

  const clearError = useCallback(() => {
    dispatch(setError(null))
  }, [dispatch])

  return {
    handleError,
    clearError,
  }
}