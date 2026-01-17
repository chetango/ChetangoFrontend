// ============================================
// PROPERTY-BASED TESTS - CALCULATIONS
// Feature: admin-payments-integration
// ============================================

import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import {
  getInitials,
  formatCurrency,
  calculateTotal,
} from '../hooks/useAdminPayments'
import type { SelectedPaquete } from '../types/paymentTypes'

// ============================================
// ARBITRARIES FOR GENERATING TEST DATA
// ============================================

/**
 * Generate alphabetic-only name parts
 */
const alphabeticWordArb: fc.Arbitrary<string> = fc.stringMatching(/^[a-zA-Z]{1,15}$/)

/**
 * Generate valid SelectedPaquete objects for total calculation testing
 */
const selectedPaqueteArb: fc.Arbitrary<SelectedPaquete> = fc.record({
  idTipoPaquete: fc.uuid(),
  nombre: fc.string({ minLength: 1, maxLength: 50 }),
  precio: fc.nat({ max: 1000000 }),
  clasesDisponibles: fc.nat({ max: 100 }),
})

// ============================================
// PROPERTY TESTS
// ============================================

/**
 * **Feature: admin-payments-integration, Property 5: Initials Generation**
 * **Validates: Requirements 4.5**
 *
 * *For any* nombre string, the initials SHALL be:
 * - First letter of first word + first letter of second word (uppercase), if two or more words
 * - First two letters of single word (uppercase) if only one word
 */
describe('Property 5: Initials Generation', () => {
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


/**
 * **Feature: admin-payments-integration, Property 8: MontoTotal Calculation**
 * **Validates: Requirements 5.8, 6.1, 6.2**
 *
 * *For any* list of selected paquetes, the calculated montoTotal SHALL equal
 * the sum of all selected paquetes' precio values.
 * If no paquetes are selected, montoTotal SHALL be 0.
 */
describe('Property 8: MontoTotal Calculation', () => {
  it('should calculate total as sum of all paquetes prices', () => {
    fc.assert(
      fc.property(
        fc.array(selectedPaqueteArb, { minLength: 0, maxLength: 20 }),
        (paquetes) => {
          const total = calculateTotal(paquetes)
          const expectedTotal = paquetes.reduce((sum, p) => sum + p.precio, 0)

          expect(total).toBe(expectedTotal)

          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should return 0 for empty array', () => {
    const total = calculateTotal([])
    expect(total).toBe(0)
  })

  it('should return the single paquete price for array with one element', () => {
    fc.assert(
      fc.property(selectedPaqueteArb, (paquete) => {
        const total = calculateTotal([paquete])

        expect(total).toBe(paquete.precio)

        return true
      }),
      { numRuns: 100 }
    )
  })

  it('should be commutative (order does not matter)', () => {
    fc.assert(
      fc.property(
        fc.array(selectedPaqueteArb, { minLength: 2, maxLength: 10 }),
        (paquetes) => {
          const total1 = calculateTotal(paquetes)
          const reversed = [...paquetes].reverse()
          const total2 = calculateTotal(reversed)

          expect(total1).toBe(total2)

          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should handle paquetes with zero price', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            idTipoPaquete: fc.uuid(),
            nombre: fc.string({ minLength: 1, maxLength: 50 }),
            precio: fc.constant(0),
            clasesDisponibles: fc.nat({ max: 100 }),
          }),
          { minLength: 1, maxLength: 10 }
        ),
        (paquetes) => {
          const total = calculateTotal(paquetes)

          expect(total).toBe(0)

          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should correctly sum mixed prices', () => {
    fc.assert(
      fc.property(
        fc.array(fc.nat({ max: 500000 }), { minLength: 1, maxLength: 10 }),
        (prices) => {
          const paquetes: SelectedPaquete[] = prices.map((precio, i) => ({
            idTipoPaquete: `pkg-${i}`,
            nombre: `Paquete ${i}`,
            precio,
            clasesDisponibles: 10,
          }))

          const total = calculateTotal(paquetes)
          const expectedTotal = prices.reduce((sum, p) => sum + p, 0)

          expect(total).toBe(expectedTotal)

          return true
        }
      ),
      { numRuns: 100 }
    )
  })
})


/**
 * **Feature: admin-payments-integration, Property 9: Currency Formatting**
 * **Validates: Requirements 6.6**
 *
 * *For any* numeric amount, the formatted currency string SHALL follow
 * the pattern "$ {amount}" with thousand separators using periods
 * (e.g., 300000 → "$ 300.000").
 */
describe('Property 9: Currency Formatting', () => {
  it('should format currency with $ prefix', () => {
    fc.assert(
      fc.property(fc.nat({ max: 100000000 }), (amount) => {
        const formatted = formatCurrency(amount)

        // Should start with $ (Colombian peso format)
        expect(formatted.startsWith('$')).toBe(true)

        return true
      }),
      { numRuns: 100 }
    )
  })

  it('should format zero as $ 0', () => {
    const formatted = formatCurrency(0)
    // Note: Intl.NumberFormat uses non-breaking space (char 160) between $ and amount
    expect(formatted.replace(/\u00A0/g, ' ')).toBe('$ 0')
  })

  it('should format small amounts without separators', () => {
    fc.assert(
      fc.property(fc.integer({ min: 1, max: 999 }), (amount) => {
        const formatted = formatCurrency(amount)

        // Should contain the amount
        expect(formatted).toContain(amount.toString())

        return true
      }),
      { numRuns: 100 }
    )
  })

  it('should format amounts >= 1000 with thousand separators', () => {
    fc.assert(
      fc.property(fc.integer({ min: 1000, max: 999999 }), (amount) => {
        const formatted = formatCurrency(amount)

        // Should contain a period as thousand separator (es-CO locale)
        expect(formatted).toContain('.')

        return true
      }),
      { numRuns: 100 }
    )
  })

  it('should format large amounts correctly', () => {
    // Test specific known values
    // Note: Intl.NumberFormat uses non-breaking space (char 160) between $ and amount
    const normalize = (s: string) => s.replace(/\u00A0/g, ' ')
    expect(normalize(formatCurrency(300000))).toBe('$ 300.000')
    expect(normalize(formatCurrency(1000000))).toBe('$ 1.000.000')
    expect(normalize(formatCurrency(1500000))).toBe('$ 1.500.000')
  })

  it('should not include decimal places', () => {
    fc.assert(
      fc.property(fc.nat({ max: 100000000 }), (amount) => {
        const formatted = formatCurrency(amount)

        // Should not contain comma (decimal separator in es-CO)
        // The format should have no decimal places
        const parts = formatted.split(',')
        expect(parts.length).toBe(1)

        return true
      }),
      { numRuns: 100 }
    )
  })

  it('should be consistent for same input', () => {
    fc.assert(
      fc.property(fc.nat({ max: 100000000 }), (amount) => {
        const formatted1 = formatCurrency(amount)
        const formatted2 = formatCurrency(amount)

        expect(formatted1).toBe(formatted2)

        return true
      }),
      { numRuns: 100 }
    )
  })
})
