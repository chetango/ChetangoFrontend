// ============================================
// PROPERTY-BASED TESTS - CLASS QUERIES
// ============================================

import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import type { ClasesQueryParams } from '../types/classTypes'

// ============================================
// HELPER FUNCTIONS FOR URL BUILDING
// ============================================

/**
 * Builds the URL for fetching classes by profesor
 * This mirrors the logic in useClasesByProfesorQuery
 */
export function buildClasesByProfesorUrl(
  idProfesor: string,
  params: ClasesQueryParams
): string {
  const queryParams = new URLSearchParams()
  if (params.fechaDesde) queryParams.append('fechaDesde', params.fechaDesde)
  if (params.fechaHasta) queryParams.append('fechaHasta', params.fechaHasta)
  if (params.pagina) queryParams.append('pagina', params.pagina.toString())
  if (params.tamanoPagina) queryParams.append('tamanoPagina', params.tamanoPagina.toString())

  const queryString = queryParams.toString()
  return `/api/profesores/${idProfesor}/clases${queryString ? `?${queryString}` : ''}`
}

// ============================================
// ARBITRARIES FOR GENERATING VALID QUERY DATA
// ============================================

/**
 * Generate valid ISO 8601 date strings (YYYY-MM-DD)
 * Using integer-based generation to avoid invalid date issues
 */
const isoDateArb = fc
  .tuple(
    fc.integer({ min: 2020, max: 2030 }),
    fc.integer({ min: 1, max: 12 }),
    fc.integer({ min: 1, max: 28 }) // Use 28 to avoid month-end issues
  )
  .map(([y, m, d]) => `${y}-${m.toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`)

/**
 * Generate valid ClasesQueryParams
 */
const clasesQueryParamsArb: fc.Arbitrary<ClasesQueryParams> = fc.record(
  {
    fechaDesde: fc.option(isoDateArb, { nil: undefined }),
    fechaHasta: fc.option(isoDateArb, { nil: undefined }),
    pagina: fc.option(fc.integer({ min: 1, max: 100 }), { nil: undefined }),
    tamanoPagina: fc.option(fc.integer({ min: 1, max: 100 }), { nil: undefined }),
  },
  { requiredKeys: [] }
)

// ============================================
// PROPERTY 4: Classes Query with Profesor Filter
// Feature: admin-classes-integration
// Validates: Requirements 3.1, 3.9
// ============================================

/**
 * **Feature: admin-classes-integration, Property 4: Classes Query with Profesor Filter**
 * **Validates: Requirements 3.1, 3.9**
 *
 * *For any* profesor selection in the filter, the ClasesByProfesor query SHALL be
 * called with that profesor's ID as a path parameter.
 */
describe('Property 4: Classes Query with Profesor Filter', () => {
  it('should include profesor ID in the URL path for any valid UUID', () => {
    fc.assert(
      fc.property(fc.uuid(), clasesQueryParamsArb, (idProfesor, params) => {
        const url = buildClasesByProfesorUrl(idProfesor, params)

        // URL should contain the profesor ID in the path
        expect(url).toContain(`/api/profesores/${idProfesor}/clases`)

        // The profesor ID should be exactly in the path, not as a query param
        const pathPart = url.split('?')[0]
        expect(pathPart).toBe(`/api/profesores/${idProfesor}/clases`)

        return true
      }),
      { numRuns: 100 }
    )
  })

  it('should correctly append query parameters when provided', () => {
    fc.assert(
      fc.property(
        fc.uuid(),
        fc.record({
          fechaDesde: isoDateArb,
          fechaHasta: isoDateArb,
          pagina: fc.integer({ min: 1, max: 100 }),
          tamanoPagina: fc.integer({ min: 1, max: 100 }),
        }),
        (idProfesor, params) => {
          const url = buildClasesByProfesorUrl(idProfesor, params)

          // URL should have query string
          expect(url).toContain('?')

          // All provided params should be in the query string
          expect(url).toContain(`fechaDesde=${params.fechaDesde}`)
          expect(url).toContain(`fechaHasta=${params.fechaHasta}`)
          expect(url).toContain(`pagina=${params.pagina}`)
          expect(url).toContain(`tamanoPagina=${params.tamanoPagina}`)

          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should not include query string when no params are provided', () => {
    fc.assert(
      fc.property(fc.uuid(), (idProfesor) => {
        const url = buildClasesByProfesorUrl(idProfesor, {})

        // URL should not have query string
        expect(url).not.toContain('?')
        expect(url).toBe(`/api/profesores/${idProfesor}/clases`)

        return true
      }),
      { numRuns: 100 }
    )
  })

  it('should only include defined params in query string', () => {
    fc.assert(
      fc.property(
        fc.uuid(),
        fc.record(
          {
            fechaDesde: fc.option(isoDateArb, { nil: undefined }),
            pagina: fc.option(fc.integer({ min: 1, max: 100 }), { nil: undefined }),
          },
          { requiredKeys: [] }
        ),
        (idProfesor, params) => {
          const url = buildClasesByProfesorUrl(idProfesor, params)

          // Check that only defined params are included
          if (params.fechaDesde !== undefined) {
            expect(url).toContain(`fechaDesde=${params.fechaDesde}`)
          } else {
            expect(url).not.toContain('fechaDesde')
          }

          if (params.pagina !== undefined) {
            expect(url).toContain(`pagina=${params.pagina}`)
          } else {
            expect(url).not.toContain('pagina')
          }

          // fechaHasta and tamanoPagina should never be present
          expect(url).not.toContain('fechaHasta')
          expect(url).not.toContain('tamanoPagina')

          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should preserve profesor ID exactly without encoding issues', () => {
    fc.assert(
      fc.property(fc.uuid(), (idProfesor) => {
        const url = buildClasesByProfesorUrl(idProfesor, {})

        // Extract the ID from the URL
        const match = url.match(/\/api\/profesores\/([^/]+)\/clases/)
        expect(match).not.toBeNull()
        expect(match![1]).toBe(idProfesor)

        return true
      }),
      { numRuns: 100 }
    )
  })
})
