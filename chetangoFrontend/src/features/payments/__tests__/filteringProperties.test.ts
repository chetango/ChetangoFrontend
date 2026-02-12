// ============================================
// PROPERTY-BASED TESTS - FILTERING
// Feature: admin-payments-integration
// ============================================

import * as fc from 'fast-check'
import { describe, expect, it } from 'vitest'
import { filterAlumnosBySearch } from '../hooks/useAdminPayments'
import type { AlumnoDTO } from '../types/paymentTypes'

// ============================================
// ARBITRARIES FOR GENERATING TEST DATA
// ============================================

/**
 * Generate alphabetic strings for names
 */
const alphabeticStringArb = (minLen: number, maxLen: number): fc.Arbitrary<string> =>
  fc.stringMatching(new RegExp(`^[a-zA-Z]{${minLen},${maxLen}}$`))

/**
 * Generate alphanumeric strings for documents
 */
const alphanumericStringArb = (minLen: number, maxLen: number): fc.Arbitrary<string> =>
  fc.stringMatching(new RegExp(`^[a-zA-Z0-9]{${minLen},${maxLen}}$`))

/**
 * Generate valid AlumnoDTO objects for filtering tests
 */
const alumnoArb: fc.Arbitrary<AlumnoDTO> = fc
  .tuple(
    alphabeticStringArb(3, 15),
    alphabeticStringArb(3, 15),
    alphanumericStringArb(5, 15),
    fc.emailAddress()
  )
  .map(([firstName, lastName, numeroDoc, correo]) => ({
    idAlumno: crypto.randomUUID(),
    idUsuario: crypto.randomUUID(),
    nombre: `${firstName} ${lastName}`,
    numeroDocumento: numeroDoc,
    correo,
    telefono: undefined,
  }))

// ============================================
// PROPERTY TESTS
// ============================================

/**
 * **Feature: admin-payments-integration, Property 3: Search Filter Behavior**
 * **Validates: Requirements 4.3**
 *
 * *For any* search term and list of alumnos, the filtered results SHALL include
 * only alumnos where `nombre.toLowerCase().includes(searchTerm.toLowerCase())`
 * OR `numeroDocumento?.toLowerCase().includes(searchTerm.toLowerCase())` is true.
 */
describe('Property 3: Search Filter Behavior', () => {
  it('should filter by nombre containing search term (case-insensitive)', () => {
    fc.assert(
      fc.property(
        fc.array(alumnoArb, { minLength: 1, maxLength: 30 }),
        alphabeticStringArb(1, 5),
        (alumnos, searchTerm) => {
          const filtered = filterAlumnosBySearch(alumnos, searchTerm)

          // All filtered results should contain the search term in nombre or documento
          for (const a of filtered) {
            const matchesNombre = a.nombre
              .toLowerCase()
              .includes(searchTerm.toLowerCase())
            const matchesDocumento = a.numeroDocumento
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase()) || false
            expect(matchesNombre || matchesDocumento).toBe(true)
          }

          return true
        }
      ),
      { numRuns: 100 }
    )
  })


  it('should filter by numeroDocumento containing search term (case-insensitive)', () => {
    fc.assert(
      fc.property(
        fc.array(alumnoArb, { minLength: 1, maxLength: 30 }),
        alphanumericStringArb(1, 3),
        (alumnos, searchTerm) => {
          const filtered = filterAlumnosBySearch(alumnos, searchTerm)

          // All filtered results should contain the search term in nombre or documento
          for (const a of filtered) {
            const matchesNombre = a.nombre
              .toLowerCase()
              .includes(searchTerm.toLowerCase())
            const matchesDocumento = a.numeroDocumento
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase()) || false
            expect(matchesNombre || matchesDocumento).toBe(true)
          }

          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should return all alumnos when search term is empty', () => {
    fc.assert(
      fc.property(fc.array(alumnoArb, { minLength: 0, maxLength: 30 }), (alumnos) => {
        const filtered = filterAlumnosBySearch(alumnos, '')

        expect(filtered).toHaveLength(alumnos.length)
        expect(filtered).toEqual(alumnos)

        return true
      }),
      { numRuns: 100 }
    )
  })

  it('should return all alumnos when search term is whitespace only', () => {
    fc.assert(
      fc.property(fc.array(alumnoArb, { minLength: 0, maxLength: 30 }), (alumnos) => {
        const filtered = filterAlumnosBySearch(alumnos, '   ')

        expect(filtered).toHaveLength(alumnos.length)
        expect(filtered).toEqual(alumnos)

        return true
      }),
      { numRuns: 100 }
    )
  })

  it('should not include alumnos that do not match the search term', () => {
    fc.assert(
      fc.property(
        fc.array(alumnoArb, { minLength: 1, maxLength: 30 }),
        alphabeticStringArb(1, 5),
        (alumnos, searchTerm) => {
          const filtered = filterAlumnosBySearch(alumnos, searchTerm)
          const notFiltered = alumnos.filter((a) => !filtered.includes(a))

          // All non-filtered results should NOT contain the search term
          for (const a of notFiltered) {
            const matchesNombre = a.nombre
              .toLowerCase()
              .includes(searchTerm.toLowerCase())
            const matchesDocumento = a.numeroDocumento
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase()) || false
            expect(matchesNombre || matchesDocumento).toBe(false)
          }

          return true
        }
      ),
      { numRuns: 100 }
    )
  })


  it('should be case-insensitive for nombre', () => {
    fc.assert(
      fc.property(
        fc.array(alumnoArb, { minLength: 1, maxLength: 20 }),
        (alumnos) => {
          // Pick a name from the list and search with different cases
          const targetAlumno = alumnos[0]
          const searchLower = targetAlumno.nombre.substring(0, 3).toLowerCase()
          const searchUpper = targetAlumno.nombre.substring(0, 3).toUpperCase()

          const filteredLower = filterAlumnosBySearch(alumnos, searchLower)
          const filteredUpper = filterAlumnosBySearch(alumnos, searchUpper)

          // Both should return the same results
          expect(filteredLower.length).toBe(filteredUpper.length)

          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should be case-insensitive for numeroDocumento', () => {
    fc.assert(
      fc.property(
        fc.array(alumnoArb, { minLength: 1, maxLength: 20 }),
        (alumnos) => {
          // Pick a documento from the list and search with different cases
          const targetAlumno = alumnos[0]
          const searchLower = targetAlumno.numeroDocumento?.substring(0, 3).toLowerCase() || ''
          const searchUpper = targetAlumno.numeroDocumento?.substring(0, 3).toUpperCase() || ''

          const filteredLower = filterAlumnosBySearch(alumnos, searchLower)
          const filteredUpper = filterAlumnosBySearch(alumnos, searchUpper)

          // Both should return the same results
          expect(filteredLower.length).toBe(filteredUpper.length)

          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should return empty array when no alumnos match', () => {
    fc.assert(
      fc.property(
        fc.array(alumnoArb, { minLength: 1, maxLength: 20 }),
        (alumnos) => {
          // Use a search term that won't match any alumno
          const impossibleSearch = 'ZZZZZZZZZZZZZZZ'
          const filtered = filterAlumnosBySearch(alumnos, impossibleSearch)

          expect(filtered).toHaveLength(0)

          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should preserve order of matching alumnos', () => {
    fc.assert(
      fc.property(
        fc.array(alumnoArb, { minLength: 2, maxLength: 20 }),
        alphabeticStringArb(1, 2),
        (alumnos, searchTerm) => {
          const filtered = filterAlumnosBySearch(alumnos, searchTerm)

          // Check that the order is preserved
          let lastIndex = -1
          for (const a of filtered) {
            const currentIndex = alumnos.indexOf(a)
            expect(currentIndex).toBeGreaterThan(lastIndex)
            lastIndex = currentIndex
          }

          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should handle empty alumnos array', () => {
    fc.assert(
      fc.property(alphabeticStringArb(1, 10), (searchTerm) => {
        const filtered = filterAlumnosBySearch([], searchTerm)

        expect(filtered).toHaveLength(0)
        expect(filtered).toEqual([])

        return true
      }),
      { numRuns: 100 }
    )
  })
})
