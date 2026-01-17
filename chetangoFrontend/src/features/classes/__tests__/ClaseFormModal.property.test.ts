// ============================================
// PROPERTY-BASED TESTS - CLASE FORM MODAL
// ============================================

import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import {
  isFutureDateTime,
  isValidTimeRange,
  getTodayDate,
} from '../components/ClaseFormModal'

// ============================================
// ARBITRARIES FOR GENERATING TEST DATA
// ============================================

/**
 * Generate valid time strings in HH:mm format
 */
const timeStringArb = fc
  .tuple(fc.integer({ min: 0, max: 23 }), fc.integer({ min: 0, max: 59 }))
  .map(
    ([h, m]) =>
      `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
  )

/**
 * Generate valid ISO 8601 date strings (YYYY-MM-DD)
 */
const isoDateArb = fc
  .tuple(
    fc.integer({ min: 2020, max: 2030 }),
    fc.integer({ min: 1, max: 12 }),
    fc.integer({ min: 1, max: 28 }) // Use 28 to avoid month-end issues
  )
  .map(
    ([y, m, d]) =>
      `${y}-${m.toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`
  )

/**
 * Generate future dates (relative to a fixed reference point for testing)
 */
const futureDateArb = fc
  .tuple(
    fc.integer({ min: 2027, max: 2030 }), // Years definitely in the future
    fc.integer({ min: 1, max: 12 }),
    fc.integer({ min: 1, max: 28 })
  )
  .map(
    ([y, m, d]) =>
      `${y}-${m.toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`
  )

/**
 * Generate past dates (relative to a fixed reference point for testing)
 */
const pastDateArb = fc
  .tuple(
    fc.integer({ min: 2020, max: 2024 }), // Years definitely in the past
    fc.integer({ min: 1, max: 12 }),
    fc.integer({ min: 1, max: 28 })
  )
  .map(
    ([y, m, d]) =>
      `${y}-${m.toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`
  )

/**
 * Generate a pair of times where start < end
 */
const validTimeRangeArb = fc
  .tuple(
    fc.integer({ min: 0, max: 20 }),
    fc.integer({ min: 0, max: 59 }),
    fc.integer({ min: 1, max: 3 }), // Hours to add
    fc.integer({ min: 0, max: 59 })
  )
  .map(([startH, startM, hoursToAdd, endM]) => {
    const endH = Math.min(startH + hoursToAdd, 23)
    return {
      horaInicio: `${startH.toString().padStart(2, '0')}:${startM.toString().padStart(2, '0')}`,
      horaFin: `${endH.toString().padStart(2, '0')}:${endM.toString().padStart(2, '0')}`,
    }
  })
  .filter(({ horaInicio, horaFin }) => {
    const [startH, startM] = horaInicio.split(':').map(Number)
    const [endH, endM] = horaFin.split(':').map(Number)
    return endH * 60 + endM > startH * 60 + startM
  })

/**
 * Generate a pair of times where start >= end (invalid range)
 */
const invalidTimeRangeArb = fc
  .tuple(
    fc.integer({ min: 1, max: 23 }),
    fc.integer({ min: 0, max: 59 }),
    fc.integer({ min: 0, max: 2 }) // Hours to subtract
  )
  .map(([startH, startM, hoursToSubtract]) => {
    const endH = Math.max(startH - hoursToSubtract, 0)
    return {
      horaInicio: `${startH.toString().padStart(2, '0')}:${startM.toString().padStart(2, '0')}`,
      horaFin: `${endH.toString().padStart(2, '0')}:${startM.toString().padStart(2, '0')}`,
    }
  })
  .filter(({ horaInicio, horaFin }) => {
    const [startH, startM] = horaInicio.split(':').map(Number)
    const [endH, endM] = horaFin.split(':').map(Number)
    return endH * 60 + endM <= startH * 60 + startM
  })

// ============================================
// PROPERTY 11: Create Clase Future Validation
// Feature: admin-classes-integration
// Validates: Requirements 5.4
// ============================================

/**
 * **Feature: admin-classes-integration, Property 11: Create Clase Future Validation**
 * **Validates: Requirements 5.4**
 *
 * *For any* class creation attempt, the form SHALL validate that fecha + horaInicio
 * is in the future before submitting.
 */
describe('Property 11: Create Clase Future Validation', () => {
  describe('isFutureDateTime', () => {
    it('should return true for any date/time definitely in the future', () => {
      fc.assert(
        fc.property(futureDateArb, timeStringArb, (fecha, horaInicio) => {
          const result = isFutureDateTime(fecha, horaInicio)
          expect(result).toBe(true)
          return true
        }),
        { numRuns: 100 }
      )
    })

    it('should return false for any date/time definitely in the past', () => {
      fc.assert(
        fc.property(pastDateArb, timeStringArb, (fecha, horaInicio) => {
          const result = isFutureDateTime(fecha, horaInicio)
          expect(result).toBe(false)
          return true
        }),
        { numRuns: 100 }
      )
    })

    it('should return false for empty fecha', () => {
      fc.assert(
        fc.property(timeStringArb, (horaInicio) => {
          const result = isFutureDateTime('', horaInicio)
          expect(result).toBe(false)
          return true
        }),
        { numRuns: 100 }
      )
    })

    it('should return false for empty horaInicio', () => {
      fc.assert(
        fc.property(isoDateArb, (fecha) => {
          const result = isFutureDateTime(fecha, '')
          expect(result).toBe(false)
          return true
        }),
        { numRuns: 100 }
      )
    })

    it('should return false for both empty inputs', () => {
      const result = isFutureDateTime('', '')
      expect(result).toBe(false)
    })

    it('should correctly compare date and time components', () => {
      // Test with a specific future date/time
      const futureDate = '2030-06-15'
      const futureTime = '14:30'
      expect(isFutureDateTime(futureDate, futureTime)).toBe(true)

      // Test with a specific past date/time
      const pastDate = '2020-01-01'
      const pastTime = '08:00'
      expect(isFutureDateTime(pastDate, pastTime)).toBe(false)
    })
  })

  describe('isValidTimeRange', () => {
    it('should return true for any valid time range where end > start', () => {
      fc.assert(
        fc.property(validTimeRangeArb, ({ horaInicio, horaFin }) => {
          const result = isValidTimeRange(horaInicio, horaFin)
          expect(result).toBe(true)
          return true
        }),
        { numRuns: 100 }
      )
    })

    it('should return false for any invalid time range where end <= start', () => {
      fc.assert(
        fc.property(invalidTimeRangeArb, ({ horaInicio, horaFin }) => {
          const result = isValidTimeRange(horaInicio, horaFin)
          expect(result).toBe(false)
          return true
        }),
        { numRuns: 100 }
      )
    })

    it('should return false for empty horaInicio', () => {
      fc.assert(
        fc.property(timeStringArb, (horaFin) => {
          const result = isValidTimeRange('', horaFin)
          expect(result).toBe(false)
          return true
        }),
        { numRuns: 100 }
      )
    })

    it('should return false for empty horaFin', () => {
      fc.assert(
        fc.property(timeStringArb, (horaInicio) => {
          const result = isValidTimeRange(horaInicio, '')
          expect(result).toBe(false)
          return true
        }),
        { numRuns: 100 }
      )
    })

    it('should return false when start equals end', () => {
      fc.assert(
        fc.property(timeStringArb, (time) => {
          const result = isValidTimeRange(time, time)
          expect(result).toBe(false)
          return true
        }),
        { numRuns: 100 }
      )
    })
  })

  describe('getTodayDate', () => {
    it('should return a valid ISO date string', () => {
      const today = getTodayDate()

      // Should match YYYY-MM-DD format
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/
      expect(dateRegex.test(today)).toBe(true)
    })

    it('should return a date that can be parsed', () => {
      const today = getTodayDate()
      const parsed = new Date(today)

      expect(parsed).toBeInstanceOf(Date)
      expect(isNaN(parsed.getTime())).toBe(false)
    })

    it('should return today\'s date', () => {
      const today = getTodayDate()
      const now = new Date()
      const expected = now.toISOString().split('T')[0]

      expect(today).toBe(expected)
    })
  })

  describe('Future validation integration', () => {
    it('should validate that future dates with any time are accepted', () => {
      fc.assert(
        fc.property(futureDateArb, timeStringArb, (fecha, horaInicio) => {
          // For a future date, the validation should pass
          const isFuture = isFutureDateTime(fecha, horaInicio)
          expect(isFuture).toBe(true)
          return true
        }),
        { numRuns: 100 }
      )
    })

    it('should validate that past dates with any time are rejected', () => {
      fc.assert(
        fc.property(pastDateArb, timeStringArb, (fecha, horaInicio) => {
          // For a past date, the validation should fail
          const isFuture = isFutureDateTime(fecha, horaInicio)
          expect(isFuture).toBe(false)
          return true
        }),
        { numRuns: 100 }
      )
    })
  })
})
