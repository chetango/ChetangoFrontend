// ============================================
// PROPERTY-BASED TESTS - DESCONGELAR FUNCTIONALITY
// ============================================

import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import type { EstadoPaquete } from '../types/packageTypes'
import { shouldShowDescongelarButton } from '../components/admin/PackageTableRow'
import {
  calculateDiasCongelados,
  calculateNuevaFechaVencimiento,
} from '../components/admin/DescongelarPaqueteDialog'

// ============================================
// ARBITRARIES FOR GENERATING VALID DATA
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
 * Generate non-Congelado EstadoPaquete values
 */
const nonCongeladoEstadoArb: fc.Arbitrary<EstadoPaquete> = fc.constantFrom(
  'Activo',
  'Vencido',
  'Agotado'
)

/**
 * Generate valid ISO date strings using integer timestamps
 */
const isoDateArb: fc.Arbitrary<string> = fc
  .integer({
    min: new Date('2022-01-01').getTime(),
    max: new Date('2026-12-31').getTime(),
  })
  .map((timestamp) => new Date(timestamp).toISOString())

/**
 * Generate a pair of dates where end > start
 */
const dateRangeArb: fc.Arbitrary<{ fechaInicio: string; fechaFin: string }> = fc
  .tuple(
    fc.integer({
      min: new Date('2022-01-01').getTime(),
      max: new Date('2025-12-31').getTime(),
    }),
    fc.integer({ min: 1, max: 365 })
  )
  .map(([startTimestamp, daysToAdd]) => {
    const startDate = new Date(startTimestamp)
    const endDate = new Date(startTimestamp + daysToAdd * 24 * 60 * 60 * 1000)
    return {
      fechaInicio: startDate.toISOString(),
      fechaFin: endDate.toISOString(),
    }
  })

/**
 * Generate a safe pair of dates for consistency tests (avoiding overflow)
 */
const safeDateRangeArb: fc.Arbitrary<{ fechaInicio: string; fechaFin: string }> = fc
  .tuple(
    fc.integer({
      min: new Date('2022-01-01').getTime(),
      max: new Date('2025-06-30').getTime(),
    }),
    fc.integer({ min: 1, max: 30 })
  )
  .map(([startTimestamp, daysToAdd]) => {
    const startDate = new Date(startTimestamp)
    const endDate = new Date(startTimestamp + daysToAdd * 24 * 60 * 60 * 1000)
    return {
      fechaInicio: startDate.toISOString(),
      fechaFin: endDate.toISOString(),
    }
  })

/**
 * Generate positive number of days
 */
const positiveDaysArb: fc.Arbitrary<number> = fc.integer({ min: 1, max: 365 })

// ============================================
// PROPERTY 22: DESCONGELAR BUTTON VISIBILITY
// ============================================

/**
 * **Feature: admin-packages-integration, Property 22: Descongelar Button Visibility**
 * **Validates: Requirements 9.6**
 *
 * *For any* package, the "Descongelar" button SHALL be visible only when `estado === 'Congelado'`.
 */
describe('Property 22: Descongelar Button Visibility', () => {
  it('should return true only when estado is Congelado', () => {
    fc.assert(
      fc.property(estadoPaqueteArb, (estado) => {
        const shouldShow = shouldShowDescongelarButton(estado)

        // The button should be visible only when estado is 'Congelado'
        if (estado === 'Congelado') {
          expect(shouldShow).toBe(true)
        } else {
          expect(shouldShow).toBe(false)
        }

        return true
      }),
      { numRuns: 100 }
    )
  })

  it('should always return true for Congelado estado', () => {
    // Direct test for Congelado
    const result = shouldShowDescongelarButton('Congelado')
    expect(result).toBe(true)
  })

  it('should always return false for non-Congelado estados', () => {
    fc.assert(
      fc.property(nonCongeladoEstadoArb, (estado) => {
        const shouldShow = shouldShowDescongelarButton(estado)
        expect(shouldShow).toBe(false)
        return true
      }),
      { numRuns: 100 }
    )
  })

  it('should return false for Activo estado', () => {
    const result = shouldShowDescongelarButton('Activo')
    expect(result).toBe(false)
  })

  it('should return false for Vencido estado', () => {
    const result = shouldShowDescongelarButton('Vencido')
    expect(result).toBe(false)
  })

  it('should return false for Agotado estado', () => {
    const result = shouldShowDescongelarButton('Agotado')
    expect(result).toBe(false)
  })

  it('should be consistent across multiple calls with same estado', () => {
    fc.assert(
      fc.property(estadoPaqueteArb, (estado) => {
        const result1 = shouldShowDescongelarButton(estado)
        const result2 = shouldShowDescongelarButton(estado)
        const result3 = shouldShowDescongelarButton(estado)

        // Function should be deterministic
        expect(result1).toBe(result2)
        expect(result2).toBe(result3)

        return true
      }),
      { numRuns: 100 }
    )
  })

  it('should return boolean type for all valid estados', () => {
    fc.assert(
      fc.property(estadoPaqueteArb, (estado) => {
        const result = shouldShowDescongelarButton(estado)
        expect(typeof result).toBe('boolean')
        return true
      }),
      { numRuns: 100 }
    )
  })
})

// ============================================
// PROPERTY 23: DESCONGELAR DIALOG CALCULATION DISPLAY
// ============================================

/**
 * **Feature: admin-packages-integration, Property 23: Descongelar Dialog Calculation Display**
 * **Validates: Requirements 9.2**
 *
 * *For any* frozen package with active congelacion, the descongelar dialog SHALL display:
 * - días congelados = (fechaFin - fechaInicio).days
 * - nueva fecha vencimiento = fechaVencimiento + diasCongelados
 */
describe('Property 23: Descongelar Dialog Calculation Display', () => {
  describe('calculateDiasCongelados', () => {
    it('should calculate days correctly for valid date ranges', () => {
      fc.assert(
        fc.property(dateRangeArb, ({ fechaInicio, fechaFin }) => {
          const diasCongelados = calculateDiasCongelados(fechaInicio, fechaFin)

          // Calculate expected days
          const startDate = new Date(fechaInicio)
          const endDate = new Date(fechaFin)
          const diffTime = endDate.getTime() - startDate.getTime()
          const expectedDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

          expect(diasCongelados).toBe(expectedDays)
          expect(diasCongelados).toBeGreaterThan(0)

          return true
        }),
        { numRuns: 100 }
      )
    })

    it('should return 0 for empty fechaInicio', () => {
      const result = calculateDiasCongelados('', '2024-06-15T00:00:00.000Z')
      expect(result).toBe(0)
    })

    it('should return 0 for empty fechaFin', () => {
      const result = calculateDiasCongelados('2024-06-01T00:00:00.000Z', '')
      expect(result).toBe(0)
    })

    it('should return 0 for invalid date strings', () => {
      const result = calculateDiasCongelados('invalid', 'also-invalid')
      expect(result).toBe(0)
    })

    it('should return non-negative values', () => {
      fc.assert(
        fc.property(isoDateArb, isoDateArb, (fecha1, fecha2) => {
          const result = calculateDiasCongelados(fecha1, fecha2)
          expect(result).toBeGreaterThanOrEqual(0)
          return true
        }),
        { numRuns: 100 }
      )
    })

    it('should be consistent for same inputs', () => {
      fc.assert(
        fc.property(safeDateRangeArb, ({ fechaInicio, fechaFin }) => {
          const result1 = calculateDiasCongelados(fechaInicio, fechaFin)
          const result2 = calculateDiasCongelados(fechaInicio, fechaFin)
          expect(result1).toBe(result2)
          return true
        }),
        { numRuns: 100 }
      )
    })
  })

  describe('calculateNuevaFechaVencimiento', () => {
    it('should extend fecha vencimiento by dias congelados', () => {
      fc.assert(
        fc.property(isoDateArb, positiveDaysArb, (fechaVencimiento, diasCongelados) => {
          const nuevaFecha = calculateNuevaFechaVencimiento(fechaVencimiento, diasCongelados)

          // Parse dates
          const originalDate = new Date(fechaVencimiento)
          const newDate = new Date(nuevaFecha)

          // Calculate expected date
          const expectedDate = new Date(originalDate)
          expectedDate.setDate(expectedDate.getDate() + diasCongelados)

          // Compare dates (ignoring time component variations)
          expect(newDate.toDateString()).toBe(expectedDate.toDateString())

          return true
        }),
        { numRuns: 100 }
      )
    })

    it('should return original date when diasCongelados is 0', () => {
      fc.assert(
        fc.property(isoDateArb, (fechaVencimiento) => {
          const result = calculateNuevaFechaVencimiento(fechaVencimiento, 0)
          expect(result).toBe(fechaVencimiento)
          return true
        }),
        { numRuns: 100 }
      )
    })

    it('should return original date when diasCongelados is negative', () => {
      fc.assert(
        fc.property(
          isoDateArb,
          fc.integer({ min: -365, max: -1 }),
          (fechaVencimiento, diasCongelados) => {
            const result = calculateNuevaFechaVencimiento(fechaVencimiento, diasCongelados)
            expect(result).toBe(fechaVencimiento)
            return true
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should return original date for empty fechaVencimiento', () => {
      const result = calculateNuevaFechaVencimiento('', 10)
      expect(result).toBe('')
    })

    it('should return original date for invalid fechaVencimiento', () => {
      const result = calculateNuevaFechaVencimiento('invalid-date', 10)
      expect(result).toBe('invalid-date')
    })

    it('should produce a date later than the original when diasCongelados > 0', () => {
      fc.assert(
        fc.property(isoDateArb, positiveDaysArb, (fechaVencimiento, diasCongelados) => {
          const nuevaFecha = calculateNuevaFechaVencimiento(fechaVencimiento, diasCongelados)

          const originalDate = new Date(fechaVencimiento)
          const newDate = new Date(nuevaFecha)

          expect(newDate.getTime()).toBeGreaterThan(originalDate.getTime())

          return true
        }),
        { numRuns: 100 }
      )
    })

    it('should be consistent for same inputs', () => {
      fc.assert(
        fc.property(isoDateArb, positiveDaysArb, (fechaVencimiento, diasCongelados) => {
          const result1 = calculateNuevaFechaVencimiento(fechaVencimiento, diasCongelados)
          const result2 = calculateNuevaFechaVencimiento(fechaVencimiento, diasCongelados)
          expect(result1).toBe(result2)
          return true
        }),
        { numRuns: 100 }
      )
    })
  })

  describe('Integration: calculateDiasCongelados + calculateNuevaFechaVencimiento', () => {
    it('should correctly chain calculations for a complete descongelar flow', () => {
      fc.assert(
        fc.property(dateRangeArb, isoDateArb, ({ fechaInicio, fechaFin }, fechaVencimiento) => {
          // Step 1: Calculate days frozen
          const diasCongelados = calculateDiasCongelados(fechaInicio, fechaFin)

          // Step 2: Calculate new expiration date
          const nuevaFechaVencimiento = calculateNuevaFechaVencimiento(
            fechaVencimiento,
            diasCongelados
          )

          // Verify the new date is extended by the correct number of days
          const originalDate = new Date(fechaVencimiento)
          const newDate = new Date(nuevaFechaVencimiento)
          const actualDaysAdded = Math.round(
            (newDate.getTime() - originalDate.getTime()) / (1000 * 60 * 60 * 24)
          )

          expect(actualDaysAdded).toBe(diasCongelados)

          return true
        }),
        { numRuns: 100 }
      )
    })
  })
})
