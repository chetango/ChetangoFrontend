// ============================================
// PROPERTY-BASED TESTS - FILTERING
// ============================================

import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import {
  filterBySearch,
  filterByEstado,
  filterByTipoPaquete,
  applyAllFilters,
  calculateStats,
} from '../hooks/useAdminPackages'
import type { PaqueteListItemDTO, EstadoPaquete, EstadoPaqueteId } from '../types/packageTypes'

// ============================================
// ARBITRARIES FOR GENERATING TEST DATA
// ============================================

/**
 * Generate valid EstadoPaquete values
 */
const estadoPaqueteArb: fc.Arbitrary<EstadoPaquete> = fc.constantFrom(
  'Activo',
  'Vencido',
  'Congelado',
  'Agotado'
)

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
 * Generate valid PaqueteListItemDTO objects for filtering tests
 */
const paqueteListItemArb: fc.Arbitrary<PaqueteListItemDTO> = fc
  .tuple(
    estadoPaqueteArb,
    alphabeticStringArb(3, 20),
    alphabeticStringArb(3, 20),
    alphanumericStringArb(5, 15),
    alphabeticStringArb(3, 20)
  )
  .map(([estado, firstName, lastName, documento, tipoPaquete]) => {
    const idEstado: EstadoPaqueteId =
      estado === 'Activo' ? 1 : estado === 'Vencido' ? 2 : estado === 'Congelado' ? 3 : 4

    return {
      idPaquete: crypto.randomUUID(),
      idAlumno: crypto.randomUUID(),
      nombreAlumno: `${firstName} ${lastName}`,
      documentoAlumno: documento,
      nombreTipoPaquete: tipoPaquete,
      clasesDisponibles: 10,
      clasesUsadas: 5,
      clasesRestantes: 5,
      fechaActivacion: new Date().toISOString(),
      fechaVencimiento: new Date().toISOString(),
      valorPaquete: 100,
      idEstado,
      estado,
      estaVencido: estado === 'Vencido',
      tieneClasesDisponibles: estado !== 'Agotado',
    }
  })

// ============================================
// PROPERTY TESTS
// ============================================

/**
 * **Feature: admin-packages-integration, Property 9: Search Filter Behavior**
 * **Validates: Requirements 4.1**
 *
 * *For any* search term, the filtered packages SHALL include only packages where
 * `nombreAlumno.toLowerCase().includes(searchTerm.toLowerCase())` OR
 * `documentoAlumno.toLowerCase().includes(searchTerm.toLowerCase())` is true.
 */
describe('Property 9: Search Filter Behavior', () => {
  it('should filter by nombreAlumno containing search term (case-insensitive)', () => {
    fc.assert(
      fc.property(
        fc.array(paqueteListItemArb, { minLength: 1, maxLength: 30 }),
        alphabeticStringArb(1, 5),
        (paquetes, searchTerm) => {
          const filtered = filterBySearch(paquetes, searchTerm)

          // All filtered results should contain the search term in nombre or documento
          for (const p of filtered) {
            const matchesNombre = p.nombreAlumno.toLowerCase().includes(searchTerm.toLowerCase())
            const matchesDocumento = p.documentoAlumno
              .toLowerCase()
              .includes(searchTerm.toLowerCase())
            expect(matchesNombre || matchesDocumento).toBe(true)
          }

          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should filter by documentoAlumno containing search term (case-insensitive)', () => {
    fc.assert(
      fc.property(
        fc.array(paqueteListItemArb, { minLength: 1, maxLength: 30 }),
        alphanumericStringArb(1, 3),
        (paquetes, searchTerm) => {
          const filtered = filterBySearch(paquetes, searchTerm)

          // All filtered results should contain the search term in nombre or documento
          for (const p of filtered) {
            const matchesNombre = p.nombreAlumno.toLowerCase().includes(searchTerm.toLowerCase())
            const matchesDocumento = p.documentoAlumno
              .toLowerCase()
              .includes(searchTerm.toLowerCase())
            expect(matchesNombre || matchesDocumento).toBe(true)
          }

          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should return all packages when search term is empty', () => {
    fc.assert(
      fc.property(fc.array(paqueteListItemArb, { minLength: 0, maxLength: 30 }), (paquetes) => {
        const filtered = filterBySearch(paquetes, '')

        expect(filtered).toHaveLength(paquetes.length)
        expect(filtered).toEqual(paquetes)

        return true
      }),
      { numRuns: 100 }
    )
  })

  it('should return all packages when search term is whitespace only', () => {
    fc.assert(
      fc.property(fc.array(paqueteListItemArb, { minLength: 0, maxLength: 30 }), (paquetes) => {
        const filtered = filterBySearch(paquetes, '   ')

        expect(filtered).toHaveLength(paquetes.length)
        expect(filtered).toEqual(paquetes)

        return true
      }),
      { numRuns: 100 }
    )
  })

  it('should not include packages that do not match the search term', () => {
    fc.assert(
      fc.property(
        fc.array(paqueteListItemArb, { minLength: 1, maxLength: 30 }),
        alphabeticStringArb(1, 5),
        (paquetes, searchTerm) => {
          const filtered = filterBySearch(paquetes, searchTerm)
          const notFiltered = paquetes.filter((p) => !filtered.includes(p))

          // All non-filtered results should NOT contain the search term
          for (const p of notFiltered) {
            const matchesNombre = p.nombreAlumno.toLowerCase().includes(searchTerm.toLowerCase())
            const matchesDocumento = p.documentoAlumno
              .toLowerCase()
              .includes(searchTerm.toLowerCase())
            expect(matchesNombre || matchesDocumento).toBe(false)
          }

          return true
        }
      ),
      { numRuns: 100 }
    )
  })
})


/**
 * **Feature: admin-packages-integration, Property 10: Estado Filter Behavior**
 * **Validates: Requirements 4.2**
 *
 * *For any* estado filter value (except 'todos'), the filtered packages SHALL include
 * only packages where `estado === filterEstado`.
 */
describe('Property 10: Estado Filter Behavior', () => {
  it('should filter packages by estado when filter is not "todos"', () => {
    fc.assert(
      fc.property(
        fc.array(paqueteListItemArb, { minLength: 1, maxLength: 30 }),
        estadoPaqueteArb,
        (paquetes, filterEstado) => {
          const filtered = filterByEstado(paquetes, filterEstado)

          // All filtered results should have the matching estado
          for (const p of filtered) {
            expect(p.estado).toBe(filterEstado)
          }

          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should return all packages when filter is "todos"', () => {
    fc.assert(
      fc.property(fc.array(paqueteListItemArb, { minLength: 0, maxLength: 30 }), (paquetes) => {
        const filtered = filterByEstado(paquetes, 'todos')

        expect(filtered).toHaveLength(paquetes.length)
        expect(filtered).toEqual(paquetes)

        return true
      }),
      { numRuns: 100 }
    )
  })

  it('should not include packages with different estado', () => {
    fc.assert(
      fc.property(
        fc.array(paqueteListItemArb, { minLength: 1, maxLength: 30 }),
        estadoPaqueteArb,
        (paquetes, filterEstado) => {
          const filtered = filterByEstado(paquetes, filterEstado)
          const notFiltered = paquetes.filter((p) => !filtered.includes(p))

          // All non-filtered results should have different estado
          for (const p of notFiltered) {
            expect(p.estado).not.toBe(filterEstado)
          }

          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should return correct count for each estado', () => {
    fc.assert(
      fc.property(
        fc.array(paqueteListItemArb, { minLength: 0, maxLength: 30 }),
        estadoPaqueteArb,
        (paquetes, filterEstado) => {
          const filtered = filterByEstado(paquetes, filterEstado)
          const expectedCount = paquetes.filter((p) => p.estado === filterEstado).length

          expect(filtered).toHaveLength(expectedCount)

          return true
        }
      ),
      { numRuns: 100 }
    )
  })
})

/**
 * **Feature: admin-packages-integration, Property 11: TipoPaquete Filter Behavior**
 * **Validates: Requirements 4.3**
 *
 * *For any* tipo paquete filter value (except 'todos'), the filtered packages SHALL include
 * only packages where `nombreTipoPaquete === filterTipoPaquete`.
 */
describe('Property 11: TipoPaquete Filter Behavior', () => {
  it('should filter packages by nombreTipoPaquete when filter is not "todos"', () => {
    fc.assert(
      fc.property(
        fc.array(paqueteListItemArb, { minLength: 1, maxLength: 30 }),
        alphabeticStringArb(3, 20),
        (paquetes, filterTipoPaquete) => {
          const filtered = filterByTipoPaquete(paquetes, filterTipoPaquete)

          // All filtered results should have the matching tipo paquete
          for (const p of filtered) {
            expect(p.nombreTipoPaquete).toBe(filterTipoPaquete)
          }

          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should return all packages when filter is "todos"', () => {
    fc.assert(
      fc.property(fc.array(paqueteListItemArb, { minLength: 0, maxLength: 30 }), (paquetes) => {
        const filtered = filterByTipoPaquete(paquetes, 'todos')

        expect(filtered).toHaveLength(paquetes.length)
        expect(filtered).toEqual(paquetes)

        return true
      }),
      { numRuns: 100 }
    )
  })

  it('should not include packages with different tipo paquete', () => {
    fc.assert(
      fc.property(
        fc.array(paqueteListItemArb, { minLength: 1, maxLength: 30 }),
        alphabeticStringArb(3, 20),
        (paquetes, filterTipoPaquete) => {
          const filtered = filterByTipoPaquete(paquetes, filterTipoPaquete)
          const notFiltered = paquetes.filter((p) => !filtered.includes(p))

          // All non-filtered results should have different tipo paquete
          for (const p of notFiltered) {
            expect(p.nombreTipoPaquete).not.toBe(filterTipoPaquete)
          }

          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should filter using existing tipo paquete from the list', () => {
    fc.assert(
      fc.property(
        fc.array(paqueteListItemArb, { minLength: 1, maxLength: 30 }),
        (paquetes) => {
          // Pick a tipo paquete that exists in the list
          const existingTipo = paquetes[0].nombreTipoPaquete
          const filtered = filterByTipoPaquete(paquetes, existingTipo)

          // Should have at least one result (the one we picked from)
          expect(filtered.length).toBeGreaterThanOrEqual(1)

          // All results should match
          for (const p of filtered) {
            expect(p.nombreTipoPaquete).toBe(existingTipo)
          }

          return true
        }
      ),
      { numRuns: 100 }
    )
  })
})


/**
 * **Feature: admin-packages-integration, Property 12: Filtered Stats Accuracy**
 * **Validates: Requirements 4.7**
 *
 * *For any* combination of filters applied, the stats SHALL be calculated from
 * the filtered list, not the original unfiltered list.
 */
describe('Property 12: Filtered Stats Accuracy', () => {
  it('should calculate stats from filtered list after search filter', () => {
    fc.assert(
      fc.property(
        fc.array(paqueteListItemArb, { minLength: 1, maxLength: 30 }),
        alphabeticStringArb(1, 3),
        (paquetes, searchTerm) => {
          const filtered = filterBySearch(paquetes, searchTerm)
          const stats = calculateStats(filtered)

          // Stats should match the filtered list counts
          expect(stats.total).toBe(filtered.length)
          expect(stats.activos).toBe(filtered.filter((p) => p.estado === 'Activo').length)
          expect(stats.agotados).toBe(filtered.filter((p) => p.estado === 'Agotado').length)
          expect(stats.congelados).toBe(filtered.filter((p) => p.estado === 'Congelado').length)
          expect(stats.vencidos).toBe(filtered.filter((p) => p.estado === 'Vencido').length)

          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should calculate stats from filtered list after estado filter', () => {
    fc.assert(
      fc.property(
        fc.array(paqueteListItemArb, { minLength: 1, maxLength: 30 }),
        estadoPaqueteArb,
        (paquetes, filterEstado) => {
          const filtered = filterByEstado(paquetes, filterEstado)
          const stats = calculateStats(filtered)

          // Stats should match the filtered list counts
          expect(stats.total).toBe(filtered.length)

          // When filtering by estado, only that estado should have count > 0
          // (unless the filter returns empty)
          if (filtered.length > 0) {
            // Map estado to stats key
            const statsKey =
              filterEstado === 'Activo'
                ? 'activos'
                : filterEstado === 'Agotado'
                  ? 'agotados'
                  : filterEstado === 'Congelado'
                    ? 'congelados'
                    : 'vencidos'
            expect(stats[statsKey]).toBe(filtered.length)
          }

          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should calculate stats from filtered list after combined filters', () => {
    fc.assert(
      fc.property(
        fc.array(paqueteListItemArb, { minLength: 1, maxLength: 30 }),
        alphabeticStringArb(1, 2),
        estadoPaqueteArb,
        (paquetes, searchTerm, filterEstado) => {
          const filtered = applyAllFilters(paquetes, searchTerm, filterEstado, 'todos')
          const stats = calculateStats(filtered)

          // Stats should match the filtered list counts
          expect(stats.total).toBe(filtered.length)
          expect(stats.activos).toBe(filtered.filter((p) => p.estado === 'Activo').length)
          expect(stats.agotados).toBe(filtered.filter((p) => p.estado === 'Agotado').length)
          expect(stats.congelados).toBe(filtered.filter((p) => p.estado === 'Congelado').length)
          expect(stats.vencidos).toBe(filtered.filter((p) => p.estado === 'Vencido').length)

          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should calculate stats from filtered list after all three filters', () => {
    fc.assert(
      fc.property(
        fc.array(paqueteListItemArb, { minLength: 1, maxLength: 30 }),
        alphabeticStringArb(1, 2),
        estadoPaqueteArb,
        alphabeticStringArb(3, 10),
        (paquetes, searchTerm, filterEstado, filterTipoPaquete) => {
          const filtered = applyAllFilters(paquetes, searchTerm, filterEstado, filterTipoPaquete)
          const stats = calculateStats(filtered)

          // Stats should match the filtered list counts
          expect(stats.total).toBe(filtered.length)
          expect(stats.activos).toBe(filtered.filter((p) => p.estado === 'Activo').length)
          expect(stats.agotados).toBe(filtered.filter((p) => p.estado === 'Agotado').length)
          expect(stats.congelados).toBe(filtered.filter((p) => p.estado === 'Congelado').length)
          expect(stats.vencidos).toBe(filtered.filter((p) => p.estado === 'Vencido').length)

          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should have stats sum equal to total', () => {
    fc.assert(
      fc.property(
        fc.array(paqueteListItemArb, { minLength: 0, maxLength: 30 }),
        alphabeticStringArb(1, 2),
        estadoPaqueteArb,
        (paquetes, searchTerm, filterEstado) => {
          const filtered = applyAllFilters(paquetes, searchTerm, filterEstado, 'todos')
          const stats = calculateStats(filtered)

          const sum = stats.activos + stats.agotados + stats.congelados + stats.vencidos

          expect(sum).toBe(stats.total)

          return true
        }
      ),
      { numRuns: 100 }
    )
  })
})
