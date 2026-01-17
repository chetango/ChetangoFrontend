// ============================================
// PROPERTY-BASED TESTS - CALCULATIONS
// ============================================

import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import {
  getInitials,
  getConsumoPercentage,
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
 * Generate valid EstadoPaqueteId values
 */
const estadoPaqueteIdArb: fc.Arbitrary<EstadoPaqueteId> = fc.constantFrom(1, 2, 3, 4)

/**
 * Generate valid PaqueteListItemDTO objects for stats testing
 */
const paqueteListItemArb: fc.Arbitrary<PaqueteListItemDTO> = fc
  .tuple(estadoPaqueteArb, estadoPaqueteIdArb)
  .chain(([estado, _idEstado]) => {
    // Map estado to correct idEstado
    const correctIdEstado: EstadoPaqueteId =
      estado === 'Activo' ? 1 : estado === 'Vencido' ? 2 : estado === 'Congelado' ? 3 : 4

    // Use constrained date range to avoid invalid dates
    const validDateArb = fc
      .integer({ min: 1577836800000, max: 1924905600000 }) // 2020-01-01 to 2030-12-31
      .map((ts) => new Date(ts).toISOString())

    return fc.record({
      idPaquete: fc.uuid(),
      idAlumno: fc.uuid(),
      nombreAlumno: fc.string({ minLength: 1, maxLength: 100 }),
      documentoAlumno: fc.stringMatching(/^[0-9A-Za-z]{5,20}$/),
      nombreTipoPaquete: fc.string({ minLength: 1, maxLength: 50 }),
      clasesDisponibles: fc.integer({ min: 1, max: 100 }),
      clasesUsadas: fc.integer({ min: 0, max: 100 }),
      clasesRestantes: fc.integer({ min: 0, max: 100 }),
      fechaActivacion: validDateArb,
      fechaVencimiento: validDateArb,
      valorPaquete: fc.float({ min: 0, max: 100000, noNaN: true }),
      idEstado: fc.constant(correctIdEstado),
      estado: fc.constant(estado),
      estaVencido: fc.boolean(),
      tieneClasesDisponibles: fc.boolean(),
    })
  })

// ============================================
// PROPERTY TESTS
// ============================================

/**
 * **Feature: admin-packages-integration, Property 5: Stats Calculation Accuracy**
 * **Validates: Requirements 3.2, 3.3**
 *
 * *For any* list of packages, the stats SHALL correctly count:
 * - `activos` = count where estado === 'Activo'
 * - `agotados` = count where estado === 'Agotado'
 * - `congelados` = count where estado === 'Congelado'
 * - `vencidos` = count where estado === 'Vencido'
 * - `total` = sum of all counts
 */
describe('Property 5: Stats Calculation Accuracy', () => {
  it('should correctly count packages by estado', () => {
    fc.assert(
      fc.property(fc.array(paqueteListItemArb, { minLength: 0, maxLength: 20 }), (paquetes) => {
        const stats = calculateStats(paquetes)

        const expectedActivos = paquetes.filter((p) => p.estado === 'Activo').length
        const expectedAgotados = paquetes.filter((p) => p.estado === 'Agotado').length
        const expectedCongelados = paquetes.filter((p) => p.estado === 'Congelado').length
        const expectedVencidos = paquetes.filter((p) => p.estado === 'Vencido').length

        expect(stats.activos).toBe(expectedActivos)
        expect(stats.agotados).toBe(expectedAgotados)
        expect(stats.congelados).toBe(expectedCongelados)
        expect(stats.vencidos).toBe(expectedVencidos)

        return true
      }),
      { numRuns: 50 }
    )
  }, 15000) // Increase timeout for this property test

  it('should have total equal to sum of all estado counts', () => {
    fc.assert(
      fc.property(fc.array(paqueteListItemArb, { minLength: 0, maxLength: 20 }), (paquetes) => {
        const stats = calculateStats(paquetes)

        const sumOfCounts = stats.activos + stats.agotados + stats.congelados + stats.vencidos

        expect(stats.total).toBe(paquetes.length)
        expect(stats.total).toBe(sumOfCounts)

        return true
      }),
      { numRuns: 50 }
    )
  }, 15000) // Increase timeout for this property test

  it('should return zero counts for empty array', () => {
    const stats = calculateStats([])

    expect(stats.total).toBe(0)
    expect(stats.activos).toBe(0)
    expect(stats.agotados).toBe(0)
    expect(stats.congelados).toBe(0)
    expect(stats.vencidos).toBe(0)
  })

  it('should handle arrays with only one estado type', () => {
    fc.assert(
      fc.property(
        estadoPaqueteArb,
        fc.integer({ min: 1, max: 20 }),
        (estado, count) => {
          // Create array with only one estado type
          const paquetes: PaqueteListItemDTO[] = Array.from({ length: count }, (_, i) => ({
            idPaquete: `pkg-${i}`,
            idAlumno: `alum-${i}`,
            nombreAlumno: `Alumno ${i}`,
            documentoAlumno: `DOC${i}`,
            nombreTipoPaquete: 'Tipo Test',
            clasesDisponibles: 10,
            clasesUsadas: 5,
            clasesRestantes: 5,
            fechaActivacion: new Date().toISOString(),
            fechaVencimiento: new Date().toISOString(),
            valorPaquete: 100,
            idEstado: 1 as EstadoPaqueteId,
            estado,
            estaVencido: false,
            tieneClasesDisponibles: true,
          }))

          const stats = calculateStats(paquetes)

          expect(stats.total).toBe(count)

          // Only the matching estado should have the count
          if (estado === 'Activo') {
            expect(stats.activos).toBe(count)
            expect(stats.agotados).toBe(0)
            expect(stats.congelados).toBe(0)
            expect(stats.vencidos).toBe(0)
          } else if (estado === 'Agotado') {
            expect(stats.activos).toBe(0)
            expect(stats.agotados).toBe(count)
            expect(stats.congelados).toBe(0)
            expect(stats.vencidos).toBe(0)
          } else if (estado === 'Congelado') {
            expect(stats.activos).toBe(0)
            expect(stats.agotados).toBe(0)
            expect(stats.congelados).toBe(count)
            expect(stats.vencidos).toBe(0)
          } else {
            expect(stats.activos).toBe(0)
            expect(stats.agotados).toBe(0)
            expect(stats.congelados).toBe(0)
            expect(stats.vencidos).toBe(count)
          }

          return true
        }
      ),
      { numRuns: 100 }
    )
  })
})


/**
 * **Feature: admin-packages-integration, Property 7: Consumption Percentage Calculation**
 * **Validates: Requirements 3.7**
 *
 * *For any* package with clasesDisponibles > 0, the consumption percentage SHALL equal
 * `Math.round((clasesUsadas / clasesDisponibles) * 100)`.
 * *For any* package with clasesDisponibles === 0, the percentage SHALL be 0.
 */
describe('Property 7: Consumption Percentage Calculation', () => {
  it('should calculate percentage correctly when clasesDisponibles > 0', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 100 }),
        fc.integer({ min: 1, max: 100 }),
        (usadas, disponibles) => {
          const percentage = getConsumoPercentage(usadas, disponibles)
          const expected = Math.round((usadas / disponibles) * 100)

          expect(percentage).toBe(expected)

          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should return 0 when clasesDisponibles is 0', () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: 100 }), (usadas) => {
        const percentage = getConsumoPercentage(usadas, 0)

        expect(percentage).toBe(0)

        return true
      }),
      { numRuns: 100 }
    )
  })

  it('should return 0 when both usadas and disponibles are 0', () => {
    const percentage = getConsumoPercentage(0, 0)
    expect(percentage).toBe(0)
  })

  it('should return 100 when usadas equals disponibles', () => {
    fc.assert(
      fc.property(fc.integer({ min: 1, max: 100 }), (value) => {
        const percentage = getConsumoPercentage(value, value)

        expect(percentage).toBe(100)

        return true
      }),
      { numRuns: 100 }
    )
  })

  it('should return percentage between 0 and 100 when usadas <= disponibles', () => {
    fc.assert(
      fc.property(fc.integer({ min: 1, max: 100 }), (disponibles) => {
        // Generate usadas that is <= disponibles
        return fc.assert(
          fc.property(fc.integer({ min: 0, max: disponibles }), (usadas) => {
            const percentage = getConsumoPercentage(usadas, disponibles)

            expect(percentage).toBeGreaterThanOrEqual(0)
            expect(percentage).toBeLessThanOrEqual(100)

            return true
          }),
          { numRuns: 10 }
        )
      }),
      { numRuns: 10 }
    )
  })

  it('should handle percentage > 100 when usadas > disponibles', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 50 }),
        fc.integer({ min: 51, max: 100 }),
        (disponibles, usadas) => {
          const percentage = getConsumoPercentage(usadas, disponibles)
          const expected = Math.round((usadas / disponibles) * 100)

          expect(percentage).toBe(expected)
          expect(percentage).toBeGreaterThan(100)

          return true
        }
      ),
      { numRuns: 100 }
    )
  })
})

/**
 * Arbitrary for generating alphabetic-only name parts
 */
const alphabeticWordArb: fc.Arbitrary<string> = fc.stringMatching(/^[a-zA-Z]{1,15}$/)

/**
 * **Feature: admin-packages-integration, Property 24: Initials Generation**
 * **Validates: Requirements 3.5**
 *
 * *For any* nombre string, the initials SHALL be:
 * - First letter of first word + first letter of second word (uppercase), if two or more words
 * - First two letters of single word (uppercase) if only one word
 */
describe('Property 24: Initials Generation', () => {
  it('should return first letter of first two words for multi-word names', () => {
    fc.assert(
      fc.property(
        fc.tuple(alphabeticWordArb, alphabeticWordArb),
        ([first, second]) => {
          const nombre = `${first} ${second}`
          const initials = getInitials(nombre)

          const expectedFirst = first[0].toUpperCase()
          const expectedSecond = second[0].toUpperCase()

          expect(initials).toBe(expectedFirst + expectedSecond)
          expect(initials).toHaveLength(2)
          expect(initials).toBe(initials.toUpperCase())

          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should return first two letters for single-word names', () => {
    fc.assert(
      fc.property(
        fc.stringMatching(/^[a-zA-Z]{2,15}$/),
        (nombre) => {
          const initials = getInitials(nombre)

          const expected = nombre.substring(0, 2).toUpperCase()

          expect(initials).toBe(expected)
          expect(initials).toHaveLength(2)
          expect(initials).toBe(initials.toUpperCase())

          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should return ?? for empty string', () => {
    expect(getInitials('')).toBe('??')
    expect(getInitials('   ')).toBe('??')
  })

  it('should handle names with extra whitespace', () => {
    fc.assert(
      fc.property(
        fc.tuple(alphabeticWordArb, alphabeticWordArb),
        ([first, second]) => {
          // Add extra whitespace
          const nombre = `  ${first}   ${second}  `
          const initials = getInitials(nombre)

          const expectedFirst = first[0].toUpperCase()
          const expectedSecond = second[0].toUpperCase()

          expect(initials).toBe(expectedFirst + expectedSecond)

          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should always return uppercase initials', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          // Two words
          fc.tuple(alphabeticWordArb, alphabeticWordArb).map(([a, b]) => `${a} ${b}`),
          // Single word (at least 2 chars)
          fc.stringMatching(/^[a-zA-Z]{2,15}$/)
        ),
        (nombre) => {
          const initials = getInitials(nombre)

          expect(initials).toBe(initials.toUpperCase())

          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should handle three or more word names using first two words', () => {
    fc.assert(
      fc.property(
        fc.array(alphabeticWordArb, { minLength: 3, maxLength: 5 }),
        (parts) => {
          const nombre = parts.join(' ')
          const initials = getInitials(nombre)

          const expectedFirst = parts[0][0].toUpperCase()
          const expectedSecond = parts[1][0].toUpperCase()

          expect(initials).toBe(expectedFirst + expectedSecond)

          return true
        }
      ),
      { numRuns: 100 }
    )
  })
})
