// ============================================
// PROPERTY-BASED TESTS - NAVIGATION TO ATTENDANCE
// ============================================

import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'

// ============================================
// NAVIGATION URL BUILDER FUNCTION
// This mirrors the logic used in ClaseCard and ClaseDetailModal
// ============================================

/**
 * Builds the navigation URL for attendance page
 * @param idClase - The class ID (GUID)
 * @returns The full URL path with query parameter
 */
export function buildAttendanceNavigationUrl(idClase: string): string {
  return `/admin/asistencias?claseId=${idClase}`
}

/**
 * Extracts the claseId from an attendance navigation URL
 * @param url - The full URL path
 * @returns The extracted claseId or null if not found
 */
export function extractClaseIdFromUrl(url: string): string | null {
  const match = url.match(/[?&]claseId=([^&]+)/)
  return match ? match[1] : null
}

/**
 * Validates if a URL is a valid attendance navigation URL
 * @param url - The URL to validate
 * @returns true if valid attendance URL format
 */
export function isValidAttendanceUrl(url: string): boolean {
  return url.startsWith('/admin/asistencias?claseId=') && url.length > '/admin/asistencias?claseId='.length
}

// ============================================
// ARBITRARIES FOR GENERATING TEST DATA
// ============================================

/**
 * Generate valid GUID strings (UUID v4 format)
 */
const guidArb = fc.uuid()

/**
 * Generate valid class IDs (GUIDs)
 */
const claseIdArb = guidArb

// ============================================
// PROPERTY 16: Navigation to Attendance
// Feature: admin-classes-integration
// Validates: Requirements 12.2
// ============================================

/**
 * **Feature: admin-classes-integration, Property 16: Navigation to Attendance**
 * **Validates: Requirements 12.2**
 *
 * *For any* "Ir a Asistencia" click, the system SHALL navigate to
 * `/admin/asistencias?claseId={idClase}`.
 */
describe('Property 16: Navigation to Attendance', () => {
  describe('buildAttendanceNavigationUrl', () => {
    it('should build correct URL format for any valid class ID', () => {
      fc.assert(
        fc.property(claseIdArb, (idClase) => {
          const url = buildAttendanceNavigationUrl(idClase)

          // URL should start with the correct base path
          expect(url).toMatch(/^\/admin\/asistencias\?claseId=/)

          // URL should contain the class ID
          expect(url).toContain(idClase)

          // URL should be in the exact expected format
          expect(url).toBe(`/admin/asistencias?claseId=${idClase}`)

          return true
        }),
        { numRuns: 100 }
      )
    })

    it('should produce valid attendance URL for any class ID', () => {
      fc.assert(
        fc.property(claseIdArb, (idClase) => {
          const url = buildAttendanceNavigationUrl(idClase)

          // Should be a valid attendance URL
          expect(isValidAttendanceUrl(url)).toBe(true)

          return true
        }),
        { numRuns: 100 }
      )
    })

    it('should preserve class ID exactly in the URL', () => {
      fc.assert(
        fc.property(claseIdArb, (idClase) => {
          const url = buildAttendanceNavigationUrl(idClase)
          const extractedId = extractClaseIdFromUrl(url)

          // Extracted ID should match the original
          expect(extractedId).toBe(idClase)

          return true
        }),
        { numRuns: 100 }
      )
    })
  })

  describe('extractClaseIdFromUrl', () => {
    it('should extract class ID from any valid attendance URL', () => {
      fc.assert(
        fc.property(claseIdArb, (idClase) => {
          const url = buildAttendanceNavigationUrl(idClase)
          const extractedId = extractClaseIdFromUrl(url)

          expect(extractedId).toBe(idClase)

          return true
        }),
        { numRuns: 100 }
      )
    })

    it('should return null for URLs without claseId parameter', () => {
      const invalidUrls = [
        '/admin/asistencias',
        '/admin/asistencias?other=value',
        '/admin/clases',
        '/dashboard',
      ]

      invalidUrls.forEach((url) => {
        expect(extractClaseIdFromUrl(url)).toBeNull()
      })
    })

    it('should handle URLs with additional query parameters', () => {
      fc.assert(
        fc.property(
          claseIdArb,
          fc.string({ minLength: 1, maxLength: 20 }).filter((s) => /^[a-zA-Z0-9]+$/.test(s)),
          (idClase, extraParam) => {
            const url = `/admin/asistencias?claseId=${idClase}&extra=${extraParam}`
            const extractedId = extractClaseIdFromUrl(url)

            expect(extractedId).toBe(idClase)

            return true
          }
        ),
        { numRuns: 100 }
      )
    })
  })

  describe('isValidAttendanceUrl', () => {
    it('should return true for any URL built with buildAttendanceNavigationUrl', () => {
      fc.assert(
        fc.property(claseIdArb, (idClase) => {
          const url = buildAttendanceNavigationUrl(idClase)

          expect(isValidAttendanceUrl(url)).toBe(true)

          return true
        }),
        { numRuns: 100 }
      )
    })

    it('should return false for invalid URLs', () => {
      const invalidUrls = [
        '/admin/asistencias',
        '/admin/asistencias?',
        '/admin/asistencias?claseId=',
        '/admin/clases?claseId=123',
        '/other/path?claseId=123',
        '',
      ]

      invalidUrls.forEach((url) => {
        expect(isValidAttendanceUrl(url)).toBe(false)
      })
    })
  })

  describe('Round-trip property: URL building and extraction', () => {
    it('should preserve class ID through build and extract cycle', () => {
      fc.assert(
        fc.property(claseIdArb, (originalId) => {
          // Build URL
          const url = buildAttendanceNavigationUrl(originalId)

          // Extract ID
          const extractedId = extractClaseIdFromUrl(url)

          // Should be identical
          expect(extractedId).toBe(originalId)

          return true
        }),
        { numRuns: 100 }
      )
    })
  })

  describe('URL format consistency', () => {
    it('should always produce URLs with consistent structure', () => {
      fc.assert(
        fc.property(claseIdArb, (idClase) => {
          const url = buildAttendanceNavigationUrl(idClase)

          // Should have exactly one '?' character
          const questionMarkCount = (url.match(/\?/g) || []).length
          expect(questionMarkCount).toBe(1)

          // Should have exactly one 'claseId=' occurrence
          const claseIdCount = (url.match(/claseId=/g) || []).length
          expect(claseIdCount).toBe(1)

          // Should start with /admin/asistencias
          expect(url.startsWith('/admin/asistencias')).toBe(true)

          return true
        }),
        { numRuns: 100 }
      )
    })
  })
})
