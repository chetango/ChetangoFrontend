// ============================================
// ERROR INTERCEPTOR UNIT TESTS - CHETANGO
// ============================================
// Tests for error handling across different HTTP status codes
// Requirements: 11.1, 11.2, 11.3, 11.4, 11.5

import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios, { AxiosError, AxiosHeaders } from 'axios'
import {
  setupErrorInterceptor,
  ERROR_MESSAGES,
  CONTEXT_404_MESSAGES,
  get404Message,
  getErrorMessage,
  createApiError,
} from '../errorInterceptor'

// Mock sonner toast
vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
  },
}))

describe('Error Interceptor', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('ERROR_MESSAGES constants', () => {
    it('should have correct message for 400 Bad Request', () => {
      // Requirements: 11.3
      expect(ERROR_MESSAGES[400]).toBe('Datos inválidos')
    })

    it('should have correct message for 403 Forbidden', () => {
      // Requirements: 11.2
      expect(ERROR_MESSAGES[403]).toBe('No tienes permisos para acceder a esta función')
    })

    it('should have correct message for 404 Not Found', () => {
      // Requirements: 11.4
      expect(ERROR_MESSAGES[404]).toBe('El recurso solicitado no existe')
    })

    it('should have correct message for 500 Server Error', () => {
      expect(ERROR_MESSAGES[500]).toBe('Error del servidor. Intenta de nuevo.')
    })

    it('should have a default error message', () => {
      expect(ERROR_MESSAGES.DEFAULT).toBe('Ha ocurrido un error inesperado')
    })
  })

  describe('CONTEXT_404_MESSAGES', () => {
    it('should have context-specific message for paquetes', () => {
      // Requirements: 11.4
      expect(CONTEXT_404_MESSAGES['/api/paquetes']).toBe('El paquete especificado no existe')
    })

    it('should have context-specific message for alumnos', () => {
      expect(CONTEXT_404_MESSAGES['/api/alumnos']).toBe('El alumno especificado no existe')
    })

    it('should have context-specific message for clases', () => {
      expect(CONTEXT_404_MESSAGES['/api/clases']).toBe('La clase especificada no existe')
    })

    it('should have context-specific message for asistencias', () => {
      expect(CONTEXT_404_MESSAGES['/api/asistencias']).toBe('La asistencia especificada no existe')
    })
  })

  describe('get404Message', () => {
    it('should return paquete-specific message for paquetes URL', () => {
      // Requirements: 11.4
      expect(get404Message('/api/paquetes/123')).toBe('El paquete especificado no existe')
    })

    it('should return alumno-specific message for alumnos URL', () => {
      expect(get404Message('/api/alumnos/456')).toBe('El alumno especificado no existe')
    })

    it('should return clase-specific message for clases URL', () => {
      expect(get404Message('/api/clases/789')).toBe('La clase especificada no existe')
    })

    it('should return asistencia-specific message for asistencias URL', () => {
      expect(get404Message('/api/asistencias/abc')).toBe('La asistencia especificada no existe')
    })

    it('should return generic message for unknown URL', () => {
      expect(get404Message('/api/unknown/123')).toBe(ERROR_MESSAGES[404])
    })

    it('should return generic message when URL is undefined', () => {
      expect(get404Message(undefined)).toBe(ERROR_MESSAGES[404])
    })
  })

  describe('getErrorMessage', () => {
    it('should return 403 message for status 403', () => {
      expect(getErrorMessage(403)).toBe(ERROR_MESSAGES[403])
    })

    it('should return context-specific 404 message when URL provided', () => {
      // Requirements: 11.4
      expect(getErrorMessage(404, undefined, '/api/paquetes/123')).toBe('El paquete especificado no existe')
    })

    it('should return generic 404 message when no URL provided', () => {
      expect(getErrorMessage(404)).toBe(ERROR_MESSAGES[404])
    })

    it('should return 500 message for status 500', () => {
      expect(getErrorMessage(500)).toBe(ERROR_MESSAGES[500])
    })

    it('should return response message for 400 errors when provided', () => {
      // Requirements: 11.3
      const customMessage = 'Campo requerido faltante'
      expect(getErrorMessage(400, customMessage)).toBe(customMessage)
    })

    it('should return default 400 message when no response message', () => {
      expect(getErrorMessage(400)).toBe(ERROR_MESSAGES[400])
    })

    it('should return default message for unknown status codes', () => {
      expect(getErrorMessage(999)).toBe(ERROR_MESSAGES.DEFAULT)
    })
  })

  describe('createApiError', () => {
    it('should create ApiError with correct status', () => {
      const axiosError = createMockAxiosError(403)
      const apiError = createApiError(axiosError)
      
      expect(apiError.status).toBe(403)
    })

    it('should include original error reference', () => {
      const axiosError = createMockAxiosError(500)
      const apiError = createApiError(axiosError)
      
      expect(apiError.originalError).toBe(axiosError)
    })

    it('should use response message for 400 errors', () => {
      // Requirements: 11.3
      const customMessage = 'Validation failed'
      const axiosError = createMockAxiosError(400, customMessage)
      const apiError = createApiError(axiosError)
      
      expect(apiError.message).toBe(customMessage)
    })

    it('should use context-specific message for 404 errors', () => {
      // Requirements: 11.4
      const axiosError = createMockAxiosError(404, undefined, '/api/paquetes/123')
      const apiError = createApiError(axiosError)
      
      expect(apiError.message).toBe('El paquete especificado no existe')
    })

    it('should set handled flag when provided', () => {
      const axiosError = createMockAxiosError(400)
      const apiError = createApiError(axiosError, true)
      
      expect(apiError.handled).toBe(true)
    })

    it('should default handled flag to false', () => {
      const axiosError = createMockAxiosError(400)
      const apiError = createApiError(axiosError)
      
      expect(apiError.handled).toBe(false)
    })
  })

  describe('Interceptor integration', () => {
    it('should setup and cleanup interceptors correctly', () => {
      const client = axios.create()
      const cleanupFn = setupErrorInterceptor(client)
      
      expect(typeof cleanupFn).toBe('function')
      
      // Should not throw when cleaning up
      expect(() => cleanupFn()).not.toThrow()
    })

    it('should return a cleanup function', () => {
      const client = axios.create()
      const cleanupFn = setupErrorInterceptor(client)
      
      expect(cleanupFn).toBeInstanceOf(Function)
    })
  })
})

// Helper function to create mock AxiosError
function createMockAxiosError(status: number, message?: string, url?: string): AxiosError {
  const error = new Error('Request failed') as AxiosError
  error.isAxiosError = true
  error.response = {
    status,
    statusText: getStatusText(status),
    data: message ? { error: message } : {},
    headers: new AxiosHeaders(),
    config: {
      headers: new AxiosHeaders(),
      url,
    },
  }
  error.config = {
    headers: new AxiosHeaders(),
    url,
  }
  return error
}

function getStatusText(status: number): string {
  const statusTexts: Record<number, string> = {
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',
    500: 'Internal Server Error',
  }
  return statusTexts[status] || 'Unknown'
}
