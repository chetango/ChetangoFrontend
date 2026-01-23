// ============================================
// PROPERTY-BASED TESTS - HTTP ERROR HANDLING
// ============================================

import { describe, it, expect, afterEach, vi } from 'vitest'
import * as fc from 'fast-check'
import { render, cleanup, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { ErrorState } from '../ErrorState'
import type { ApiError } from '@/shared/api/interceptors'
import { ERROR_MESSAGES } from '@/shared/api/interceptors'

// ============================================
// TEST UTILITIES
// ============================================

/**
 * Wrapper component for tests that need router context
 */
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
)

/**
 * Renders ErrorState with router context
 */
const renderErrorState = (props: Parameters<typeof ErrorState>[0]) => {
  return render(
    <TestWrapper>
      <ErrorState {...props} />
    </TestWrapper>
  )
}

// ============================================
// ARBITRARIES
// ============================================

/**
 * Arbitrary for HTTP status codes
 */
const httpStatusArb = fc.constantFrom(401, 403, 404, 500)

/**
 * Arbitrary for network error messages
 */
const networkErrorMessageArb = fc.constantFrom(
  'Network Error',
  'Error de conexión',
  'Connection refused',
  'Failed to fetch'
)

/**
 * Arbitrary for generic error messages
 */
const genericErrorMessageArb = fc.string({ minLength: 1, maxLength: 100 })

/**
 * Creates an ApiError with the given status code
 */
function createApiError(status: number, message?: string): ApiError {
  const error = new Error(message || ERROR_MESSAGES.DEFAULT) as ApiError
  error.status = status
  return error
}

/**
 * Creates a network error
 */
function createNetworkError(message: string): Error {
  return new Error(message)
}

// ============================================
// PROPERTY TESTS
// ============================================

/**
 * **Feature: attendance-module, Property 11: HTTP Error Handling**
 * **Validates: Requirements 6.2, 6.3, 6.4, 6.5**
 *
 * *For any* HTTP error response (401, 403, 404, network error), the system must display
 * the appropriate error message and behavior:
 * - 401 redirects to login (shows login button)
 * - 403 shows permission denied message
 * - 404 shows not found message
 * - Network error shows retry option
 */
describe('Property 11: HTTP Error Handling', () => {
  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
  })

  /**
   * Requirement 6.2: 401 errors should show login button
   * *For any* 401 error, the ErrorState SHALL display a login button
   */
  it('should display login button for 401 errors (Requirement 6.2)', () => {
    fc.assert(
      fc.property(
        genericErrorMessageArb,
        (customMessage) => {
          cleanup()
          const error = createApiError(401, customMessage)
          
          renderErrorState({ error, message: 'Error de autenticación' })
          
          // Should display login button
          const loginButton = screen.queryByRole('button', { name: /iniciar sesión/i })
          expect(loginButton).toBeTruthy()
          
          // Should display auth-related message
          const container = document.body
          expect(container.textContent).toContain('sesión')
          
          // Should NOT display retry button (auth errors are not recoverable via retry)
          const retryButton = screen.queryByRole('button', { name: /reintentar/i })
          expect(retryButton).toBeFalsy()
          
          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Requirement 6.3: 403 errors should show permission denied message
   * *For any* 403 error, the ErrorState SHALL display the permission denied message
   */
  it('should display permission denied message for 403 errors (Requirement 6.3)', () => {
    fc.assert(
      fc.property(
        genericErrorMessageArb,
        (customMessage) => {
          cleanup()
          const error = createApiError(403, customMessage)
          
          renderErrorState({ error, message: 'Error de permisos' })
          
          // Should display permission denied message
          const container = document.body
          expect(container.textContent).toContain('permisos')
          
          // Should display help text about contacting admin
          expect(container.textContent).toContain('administrador')
          
          // Should NOT display retry button (permission errors are not recoverable via retry)
          const retryButton = screen.queryByRole('button', { name: /reintentar/i })
          expect(retryButton).toBeFalsy()
          
          // Should NOT display login button
          const loginButton = screen.queryByRole('button', { name: /iniciar sesión/i })
          expect(loginButton).toBeFalsy()
          
          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Requirement 6.4: 404 errors should show not found message
   * *For any* 404 error, the ErrorState SHALL display the not found message
   */
  it('should display not found message for 404 errors (Requirement 6.4)', () => {
    fc.assert(
      fc.property(
        genericErrorMessageArb,
        (customMessage) => {
          cleanup()
          const error = createApiError(404, customMessage)
          const onRetry = vi.fn()
          
          renderErrorState({ error, message: 'Recurso no encontrado', onRetry })
          
          // Should display not found related message
          const container = document.body
          const hasNotFoundText = 
            container.textContent?.includes('no existe') ||
            container.textContent?.includes('no encontrado') ||
            container.textContent?.includes('eliminado')
          expect(hasNotFoundText).toBe(true)
          
          // Should display retry button (404 can be retried)
          const retryButton = screen.queryByRole('button', { name: /reintentar/i })
          expect(retryButton).toBeTruthy()
          
          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Requirement 6.5: Network errors should show retry option
   * *For any* network error, the ErrorState SHALL display a retry button
   */
  it('should display retry button for network errors (Requirement 6.5)', () => {
    fc.assert(
      fc.property(
        networkErrorMessageArb,
        (errorMessage) => {
          cleanup()
          const error = createNetworkError(errorMessage)
          const onRetry = vi.fn()
          
          renderErrorState({ error, message: 'Error de conexión', onRetry })
          
          // Should display retry button
          const retryButton = screen.queryByRole('button', { name: /reintentar/i })
          expect(retryButton).toBeTruthy()
          
          // Should display network-related message
          const container = document.body
          const hasNetworkText = 
            container.textContent?.includes('conexión') ||
            container.textContent?.includes('internet') ||
            container.textContent?.includes('red')
          expect(hasNetworkText).toBe(true)
          
          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Retry button should call onRetry callback when clicked
   * *For any* recoverable error with onRetry callback, clicking retry SHALL invoke the callback
   */
  it('should call onRetry callback when retry button is clicked', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(404, 500), // Recoverable error codes
        (statusCode) => {
          cleanup()
          const error = createApiError(statusCode)
          const onRetry = vi.fn()
          
          renderErrorState({ error, message: 'Error', onRetry })
          
          // Find and click retry button
          const retryButton = screen.queryByRole('button', { name: /reintentar/i })
          expect(retryButton).toBeTruthy()
          
          if (retryButton) {
            fireEvent.click(retryButton)
            expect(onRetry).toHaveBeenCalledTimes(1)
          }
          
          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Error type determines icon color
   * *For any* error type, the icon background color SHALL match the error severity
   */
  it('should display appropriate icon color based on error type', () => {
    fc.assert(
      fc.property(
        httpStatusArb,
        (statusCode) => {
          cleanup()
          const error = createApiError(statusCode)
          
          const { container } = renderErrorState({ error })
          
          // Find the icon container (the div with rounded-full class)
          const iconContainer = container.querySelector('.rounded-full')
          expect(iconContainer).toBeTruthy()
          
          // Check color based on status code
          if (statusCode === 401 || statusCode === 403) {
            // Auth/permission errors should have yellow/warning color
            expect(iconContainer?.className).toContain('rgba(251,191,36')
          } else if (statusCode === 404) {
            // Not found errors should have gray color
            expect(iconContainer?.className).toContain('rgba(156,163,175')
          } else {
            // Other errors should have red color
            expect(iconContainer?.className).toContain('rgba(239,68,68')
          }
          
          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Compact mode should render inline error
   * *For any* error with compact=true, the ErrorState SHALL render in compact mode
   */
  it('should render compact mode when compact prop is true', () => {
    fc.assert(
      fc.property(
        httpStatusArb,
        genericErrorMessageArb,
        (statusCode, message) => {
          cleanup()
          const error = createApiError(statusCode)
          const onRetry = vi.fn()
          
          const { container } = renderErrorState({ 
            error, 
            message, 
            onRetry,
            compact: true 
          })
          
          // Compact mode should have flex items-center layout
          const compactContainer = container.querySelector('.flex.items-center')
          expect(compactContainer).toBeTruthy()
          
          // Should NOT have the large centered layout (py-16)
          const fullContainer = container.querySelector('.py-16')
          expect(fullContainer).toBeFalsy()
          
          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Custom message should override default message
   * *For any* custom message provided, the ErrorState SHALL display the custom message
   */
  it('should display custom message when provided', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 5, maxLength: 50 }).filter(s => s.trim().length >= 5),
        (customMessage) => {
          cleanup()
          const error = createApiError(500)
          
          renderErrorState({ error, message: customMessage })
          
          // Should display the custom message
          const container = document.body
          expect(container.textContent).toContain(customMessage)
          
          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * No error should render generic error state
   * *For any* null/undefined error, the ErrorState SHALL render a generic error state
   */
  it('should render generic error state when no error is provided', () => {
    fc.assert(
      fc.property(
        genericErrorMessageArb.filter(s => s.trim().length > 0),
        (message) => {
          cleanup()
          
          renderErrorState({ message })
          
          // Should display the message
          const container = document.body
          expect(container.textContent).toContain(message)
          
          // Should have red error styling (generic error)
          const iconContainer = container.querySelector('.rounded-full')
          expect(iconContainer?.className).toContain('rgba(239,68,68')
          
          return true
        }
      ),
      { numRuns: 100 }
    )
  })
})
