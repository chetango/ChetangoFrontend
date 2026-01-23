// ============================================
// PROPERTY-BASED TESTS - PACKAGE PROGRESS CALCULATION
// ============================================

import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import { calculateProgressPercentage } from '../types/studentTypes'
import { getProgressWidth } from '../components/student/PackageProgressBar'

/**
 * **Feature: attendance-module, Property 10: Package Progress Calculation**
 * **Validates: Requirements 4.3**
 *
 * *For any* active package, the progress percentage must equal
 * (clasesUsadas / clasesTotales) * 100, rounded to the nearest integer.
 */
describe('Property 10: Package Progress Calculation', () => {
  /**
   * Arbitrary for generating valid package data
   * clasesTotales must be > 0 to avoid division by zero
   * clasesUsadas must be >= 0 and <= clasesTotales
   */
  const packageDataArb = fc.record({
    clasesTotales: fc.integer({ min: 1, max: 100 }),
    clasesUsadas: fc.integer({ min: 0, max: 100 }),
  }).filter(({ clasesTotales, clasesUsadas }) => clasesUsadas <= clasesTotales)

  it('should calculate progress percentage correctly for any valid package data', () => {
    fc.assert(
      fc.property(packageDataArb, ({ clasesTotales, clasesUsadas }) => {
        const result = calculateProgressPercentage(clasesUsadas, clasesTotales)
        const expected = Math.round((clasesUsadas / clasesTotales) * 100)

        expect(result).toBe(expected)
        return true
      }),
      { numRuns: 100 }
    )
  })

  it('should return 0 when clasesTotales is 0 or negative', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: -100, max: 0 }),
        fc.integer({ min: 0, max: 100 }),
        (clasesTotales, clasesUsadas) => {
          const result = calculateProgressPercentage(clasesUsadas, clasesTotales)
          expect(result).toBe(0)
          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should return 0 when clasesUsadas is 0', () => {
    fc.assert(
      fc.property(fc.integer({ min: 1, max: 100 }), (clasesTotales) => {
        const result = calculateProgressPercentage(0, clasesTotales)
        expect(result).toBe(0)
        return true
      }),
      { numRuns: 100 }
    )
  })

  it('should return 100 when clasesUsadas equals clasesTotales', () => {
    fc.assert(
      fc.property(fc.integer({ min: 1, max: 100 }), (clasesTotales) => {
        const result = calculateProgressPercentage(clasesTotales, clasesTotales)
        expect(result).toBe(100)
        return true
      }),
      { numRuns: 100 }
    )
  })

  it('should always return a value between 0 and 100 for valid inputs', () => {
    fc.assert(
      fc.property(packageDataArb, ({ clasesTotales, clasesUsadas }) => {
        const result = calculateProgressPercentage(clasesUsadas, clasesTotales)
        expect(result).toBeGreaterThanOrEqual(0)
        expect(result).toBeLessThanOrEqual(100)
        return true
      }),
      { numRuns: 100 }
    )
  })

  it('should return an integer (rounded value)', () => {
    fc.assert(
      fc.property(packageDataArb, ({ clasesTotales, clasesUsadas }) => {
        const result = calculateProgressPercentage(clasesUsadas, clasesTotales)
        expect(Number.isInteger(result)).toBe(true)
        return true
      }),
      { numRuns: 100 }
    )
  })

  it('should round to nearest integer correctly', () => {
    // Test specific cases for rounding
    // 1/3 = 33.33... should round to 33
    expect(calculateProgressPercentage(1, 3)).toBe(33)
    // 2/3 = 66.66... should round to 67
    expect(calculateProgressPercentage(2, 3)).toBe(67)
    // 1/2 = 50 should be exactly 50
    expect(calculateProgressPercentage(1, 2)).toBe(50)
    // 1/4 = 25 should be exactly 25
    expect(calculateProgressPercentage(1, 4)).toBe(25)
    // 3/4 = 75 should be exactly 75
    expect(calculateProgressPercentage(3, 4)).toBe(75)
  })

  it('should have getProgressWidth return correct percentage string', () => {
    fc.assert(
      fc.property(packageDataArb, ({ clasesTotales, clasesUsadas }) => {
        const result = getProgressWidth(clasesUsadas, clasesTotales)
        const expectedPercentage = calculateProgressPercentage(clasesUsadas, clasesTotales)
        expect(result).toBe(`${expectedPercentage}%`)
        return true
      }),
      { numRuns: 100 }
    )
  })

  it('should be monotonically increasing as clasesUsadas increases', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 2, max: 100 }),
        fc.integer({ min: 0, max: 98 }),
        (clasesTotales, clasesUsadas) => {
          // Ensure clasesUsadas + 1 <= clasesTotales
          if (clasesUsadas + 1 > clasesTotales) return true

          const result1 = calculateProgressPercentage(clasesUsadas, clasesTotales)
          const result2 = calculateProgressPercentage(clasesUsadas + 1, clasesTotales)

          // Progress should increase or stay the same (due to rounding)
          expect(result2).toBeGreaterThanOrEqual(result1)
          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should handle edge case of 1 class total', () => {
    expect(calculateProgressPercentage(0, 1)).toBe(0)
    expect(calculateProgressPercentage(1, 1)).toBe(100)
  })

  it('should handle large numbers correctly', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1000, max: 10000 }),
        fc.integer({ min: 0, max: 10000 }),
        (clasesTotales, clasesUsadas) => {
          if (clasesUsadas > clasesTotales) return true

          const result = calculateProgressPercentage(clasesUsadas, clasesTotales)
          const expected = Math.round((clasesUsadas / clasesTotales) * 100)

          expect(result).toBe(expected)
          expect(result).toBeGreaterThanOrEqual(0)
          expect(result).toBeLessThanOrEqual(100)
          return true
        }
      ),
      { numRuns: 100 }
    )
  })
})
