import type { AxiosInstance, AxiosError } from 'axios'
import { toast } from 'sonner'

/**
 * Error messages for different HTTP status codes
 * Requirements: 11.1, 11.2, 11.3, 11.4, 11.5
 */
export const ERROR_MESSAGES = {
  400: 'Datos inválidos',
  403: 'No tienes permisos para acceder a esta función',
  404: 'El recurso solicitado no existe',
  500: 'Error del servidor. Intenta de nuevo.',
  DEFAULT: 'Ha ocurrido un error inesperado',
} as const

/**
 * Context-specific error messages for 404 errors
 * Maps URL patterns to specific error messages
 */
export const CONTEXT_404_MESSAGES: Record<string, string> = {
  '/api/paquetes': 'El paquete especificado no existe',
  '/api/alumnos': 'El alumno especificado no existe',
  '/api/clases': 'La clase especificada no existe',
  '/api/asistencias': 'La asistencia especificada no existe',
}

/**
 * Get context-specific 404 message based on URL
 */
export const get404Message = (url?: string): string => {
  if (!url) return ERROR_MESSAGES[404]
  
  for (const [pattern, message] of Object.entries(CONTEXT_404_MESSAGES)) {
    if (url.includes(pattern)) {
      return message
    }
  }
  
  return ERROR_MESSAGES[404]
}

/**
 * Get the appropriate error message for a given status code and context
 * @param status - HTTP status code
 * @param responseMessage - Error message from response body
 * @param url - Request URL for context-specific messages
 */
export const getErrorMessage = (
  status: number, 
  responseMessage?: string,
  url?: string
): string => {
  // For 400 errors, use the response message if available (Requirement 11.3)
  if (status === 400 && responseMessage) {
    return responseMessage
  }
  
  // For 404 errors, use context-specific message (Requirement 11.4)
  if (status === 404) {
    return get404Message(url)
  }
  
  return ERROR_MESSAGES[status as keyof typeof ERROR_MESSAGES] || ERROR_MESSAGES.DEFAULT
}

/**
 * Extended error type with additional metadata
 */
export interface ApiError extends Error {
  status?: number
  originalError?: AxiosError
  /** Whether the error was already handled (toast shown) by the interceptor */
  handled?: boolean
}

/**
 * Create an ApiError from an AxiosError
 */
export const createApiError = (
  error: AxiosError, 
  handled: boolean = false
): ApiError => {
  const status = error.response?.status
  const responseData = error.response?.data as { error?: string; message?: string } | undefined
  const responseMessage = responseData?.error || responseData?.message
  const url = error.config?.url
  
  const apiError: ApiError = new Error(
    getErrorMessage(status || 0, responseMessage, url)
  )
  apiError.status = status
  apiError.originalError = error
  apiError.handled = handled
  
  return apiError
}

/**
 * Setup error interceptor for HTTP client
 * Handles error responses with toast notifications
 * 
 * Requirements:
 * - 11.1: 401 → redirect to login (handled by authInterceptor)
 * - 11.2: 403 → display "No tienes permisos para acceder a esta función"
 * - 11.3: 400 → display error message from response body
 * - 11.4: 404 → display context-specific "not found" message
 * - 11.5: Error messages via toast notifications
 */
export const setupErrorInterceptor = (httpClient: AxiosInstance) => {
  const responseId = httpClient.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      const status = error.response?.status
      const responseData = error.response?.data as { error?: string; message?: string } | undefined
      const responseMessage = responseData?.error || responseData?.message
      const url = error.config?.url
      
      // Log errors for debugging (development only)
      if (process.env.NODE_ENV === 'development') {
        console.error('[Error Interceptor] API Error:', {
          status,
          url,
          message: responseMessage,
          data: error.response?.data,
        })
      }
      
      let handled = false
      
      // Handle specific error codes with toast notifications
      // Note: 401 is handled by authInterceptor (redirect to login)
      if (status) {
        switch (status) {
          case 400:
            // Requirement 11.3: Display error message from response body
            toast.error(responseMessage || ERROR_MESSAGES[400])
            handled = true
            break
            
          case 403:
            // Requirement 11.2: Display permission error
            toast.error(ERROR_MESSAGES[403])
            handled = true
            break
            
          case 404:
            // Requirement 11.4: Display context-specific not found message
            toast.error(get404Message(url))
            handled = true
            break
            
          case 500:
            toast.error(ERROR_MESSAGES[500])
            handled = true
            break
            
          default:
            // Only show toast for unexpected errors (not 401 which redirects)
            if (status !== 401) {
              toast.error(ERROR_MESSAGES.DEFAULT)
              handled = true
            }
            break
        }
      }
      
      // Create enhanced error with metadata
      const apiError = createApiError(error, handled)
      
      return Promise.reject(apiError)
    }
  )

  return () => {
    httpClient.interceptors.response.eject(responseId)
  }
}
