// ============================================
// PROPERTY-BASED TESTS - CONGELAR BUTTON VISIBILITY
// ============================================

import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import type { EstadoPaquete } from '../types/packageTypes'
import { shouldShowCongelarButton } from '../components/admin/PackageTableRow'

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
 * Generate non-Activo EstadoPaquete values
 */
const nonActivoEstadoArb: fc.Arbitrary<EstadoPaquete> = fc.constantFrom(
  'Vencido',
  'Congelado',
  'Agotado'
)

// ============================================
// PROPERTY TESTS
// ============================================

/**
 * **Feature: admin-packages-integration, Property 20: Congelar Button Visibility**
 * **Validates: Requirements 8.6**
 *
 * *For any* package, the "Congelar" button SHALL be visible only when `estado === 'Activo'`.
 */
describe('Property 20: Congelar Button Visibility', () => {
  it('should return true only when estado is Activo', () => {
    fc.assert(
      fc.property(estadoPaqueteArb, (estado) => {
        const shouldShow = shouldShowCongelarButton(estado)

        // The button should be visible only when estado is 'Activo'
        if (estado === 'Activo') {
          expect(shouldShow).toBe(true)
        } else {
          expect(shouldShow).toBe(false)
        }

        return true
      }),
      { numRuns: 100 }
    )
  })

  it('should always return true for Activo estado', () => {
    // Direct test for Activo
    const result = shouldShowCongelarButton('Activo')
    expect(result).toBe(true)
  })

  it('should always return false for non-Activo estados', () => {
    fc.assert(
      fc.property(nonActivoEstadoArb, (estado) => {
        const shouldShow = shouldShowCongelarButton(estado)
        expect(shouldShow).toBe(false)
        return true
      }),
      { numRuns: 100 }
    )
  })

  it('should return false for Vencido estado', () => {
    const result = shouldShowCongelarButton('Vencido')
    expect(result).toBe(false)
  })

  it('should return false for Congelado estado', () => {
    const result = shouldShowCongelarButton('Congelado')
    expect(result).toBe(false)
  })

  it('should return false for Agotado estado', () => {
    const result = shouldShowCongelarButton('Agotado')
    expect(result).toBe(false)
  })

  it('should be consistent across multiple calls with same estado', () => {
    fc.assert(
      fc.property(estadoPaqueteArb, (estado) => {
        const result1 = shouldShowCongelarButton(estado)
        const result2 = shouldShowCongelarButton(estado)
        const result3 = shouldShowCongelarButton(estado)

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
        const result = shouldShowCongelarButton(estado)
        expect(typeof result).toBe('boolean')
        return true
      }),
      { numRuns: 100 }
    )
  })
})
