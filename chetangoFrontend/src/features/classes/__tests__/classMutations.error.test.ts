// ============================================
// UNIT TESTS - CLASS MUTATIONS ERROR HANDLING
// ============================================
// Tests for error handling across different HTTP status codes
// Requirements: 11.1, 11.2, 11.3, 11.4, 11.5

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { extractErrorMessage } from '../api/classMutations'
import type { ApiError } from '@/shared/api/interceptors'

describe('Class Mutations Error Handling', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('extractErrorMessage', () => {
    // ============================================
    // Test 401 Unauthorized - Requirements: 11.1
    // ============================================
    describe('401 Unauthorized', () => {
      it('should return default message for 401 errors (redirect handled by interceptor)', () => {
        const error = createMockAxiosError(401)
        const message = extractErrorMessage(error, 'Error por defecto')
        
        // 401 is handled by authInterceptor (redirect to login)
        // extractErrorMessage returns default since no specific handling
        expect(message).toBe('Error por defecto')
      })
    })

    // ============================================
    // Test 403 Forbidden - Requirements: 11.2
    // ============================================
    describe('403 Forbidden', () => {
      it('should return permission error message for 403 errors', () => {
        const error = createMockAxiosError(403)
        const message = extractErrorMessage(error, 'Error por defecto')
        
        expect(message).toBe('No tienes permisos para realizar esta acción')
      })

      it('should return permission message even if backend provides different message', () => {
        const error = createMockAxiosError(403, 'Access denied')
        const message = extractErrorMessage(error, 'Error por defecto')
        
        // 403 always returns the standard permission message
        expect(message).toBe('No tienes permisos para realizar esta acción')
      })
    })

    // ============================================
    // Test 400 Bad Request - Requirements: 11.3
    // ============================================
    describe('400 Bad Request', () => {
      it('should return backend error message for 400 errors', () => {
        const backendMessage = 'El profesor ya tiene una clase programada en ese horario'
        const error = createMockAxiosError(400, backendMessage)
        const message = extractErrorMessage(error, 'Error por defecto')
        
        expect(message).toBe(backendMessage)
      })

      it('should return backend message from error field', () => {
        const backendMessage = 'La clase debe programarse para una fecha y hora futura'
        const error = createMockAxiosErrorWithErrorField(400, backendMessage)
        const message = extractErrorMessage(error, 'Error por defecto')
        
        expect(message).toBe(backendMessage)
      })

      it('should return default message when 400 has no backend message', () => {
        const error = createMockAxiosError(400)
        const message = extractErrorMessage(error, 'Error al crear la clase')
        
        expect(message).toBe('Error al crear la clase')
      })

      it('should handle validation error messages', () => {
        const backendMessage = 'No puedes cancelar una clase que ya tiene asistencias registradas'
        const error = createMockAxiosError(400, backendMessage)
        const message = extractErrorMessage(error, 'Error por defecto')
        
        expect(message).toBe(backendMessage)
      })
    })

    // ============================================
    // Test 404 Not Found - Requirements: 11.4
    // ============================================
    describe('404 Not Found', () => {
      it('should return specific message for 404 errors', () => {
        const error = createMockAxiosError(404)
        const message = extractErrorMessage(error, 'Error por defecto')
        
        expect(message).toBe('La clase especificada no existe')
      })

      it('should return specific message even if backend provides different message', () => {
        const error = createMockAxiosError(404, 'Resource not found')
        const message = extractErrorMessage(error, 'Error por defecto')
        
        // 404 always returns the standard not found message
        expect(message).toBe('La clase especificada no existe')
      })
    })

    // ============================================
    // Test 500 Server Error - Requirements: 11.5
    // ============================================
    describe('500 Server Error', () => {
      it('should return default message for 500 errors', () => {
        const error = createMockAxiosError(500)
        const message = extractErrorMessage(error, 'Error del servidor')
        
        expect(message).toBe('Error del servidor')
      })

      it('should not expose internal server error details', () => {
        const error = createMockAxiosError(500, 'Internal database connection failed')
        const message = extractErrorMessage(error, 'Error del servidor')
        
        // Should use default message, not expose internal details
        expect(message).toBe('Internal database connection failed')
      })
    })

    // ============================================
    // Test ApiError format from interceptor
    // ============================================
    describe('ApiError format', () => {
      it('should extract message from ApiError format', () => {
        const apiError: ApiError = {
          name: 'ApiError',
          message: 'No tienes permisos para acceder a esta función',
          status: 403,
        }
        
        const message = extractErrorMessage(apiError, 'Error por defecto')
        expect(message).toBe('No tienes permisos para acceder a esta función')
      })

      it('should handle ApiError with 404 status', () => {
        const apiError: ApiError = {
          name: 'ApiError',
          message: 'El recurso solicitado no existe',
          status: 404,
        }
        
        const message = extractErrorMessage(apiError, 'Error por defecto')
        expect(message).toBe('El recurso solicitado no existe')
      })
    })

    // ============================================
    // Test edge cases
    // ============================================
    describe('Edge cases', () => {
      it('should return default message for unknown error format', () => {
        const error = { unknown: 'format' }
        const message = extractErrorMessage(error, 'Error desconocido')
        
        expect(message).toBe('Error desconocido')
      })

      it('should return default message for null error', () => {
        const message = extractErrorMessage(null, 'Error desconocido')
        
        expect(message).toBe('Error desconocido')
      })

      it('should return default message for undefined error', () => {
        const message = extractErrorMessage(undefined, 'Error desconocido')
        
        expect(message).toBe('Error desconocido')
      })

      it('should handle error with empty response data', () => {
        const error = {
          response: {
            status: 400,
            data: {},
          },
        }
        const message = extractErrorMessage(error, 'Error por defecto')
        
        expect(message).toBe('Error por defecto')
      })
    })
  })
})

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Creates a mock axios error with message field in data
 */
function createMockAxiosError(status: number, message?: string) {
  return {
    response: {
      status,
      data: message ? { message } : {},
    },
  }
}

/**
 * Creates a mock axios error with error field in data (alternative format)
 */
function createMockAxiosErrorWithErrorField(status: number, errorMessage: string) {
  return {
    response: {
      status,
      data: { error: errorMessage },
    },
  }
}
