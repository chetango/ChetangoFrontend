// ============================================
// PROPERTY-BASED TESTS - DATE UTILITIES
// ============================================

import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import { formatDateForAPI, parseAPIDate } from '../dateUtils'

/**
 * **Feature: admin-attendance-correction, Property 9: Date serialization round-trip**
 * **Validates: Requirements 10.1, 10.3**
 *
 * *For any* valid date, serializing to `YYYY-MM-DD` and parsing back
 * SHALL produce an equivalent date.
 */
describe('Property 9: Date serialization round-trip', () => {
  it('should produce equivalent date after format then parse', () => {
    fc.assert(
      fc.property(
        // Generate dates within a reasonable range (2020-2030)
        fc.date({
          min: new Date(2020, 0, 1),
          max: new Date(2030, 11, 31),
        }),
        (originalDate) => {
          // Normalize to midnight to avoid time component issues
          const normalizedOriginal = new Date(
            originalDate.getFullYear(),
            originalDate.getMonth(),
            originalDate.getDate()
          )

          // Round-trip: format to string, then parse back
          const formatted = formatDateForAPI(normalizedOriginal)
          const parsed = parseAPIDate(formatted)

          // Verify the round-trip produces equivalent date
          expect(parsed.getFullYear()).toBe(normalizedOriginal.getFullYear())
          expect(parsed.getMonth()).toBe(normalizedOriginal.getMonth())
          expect(parsed.getDate()).toBe(normalizedOriginal.getDate())

          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should format dates in YYYY-MM-DD format', () => {
    fc.assert(
      fc.property(
        fc.date({
          min: new Date(2020, 0, 1),
          max: new Date(2030, 11, 31),
        }).filter((d) => !isNaN(d.getTime())), // Filter out invalid dates
        (date) => {
          const formatted = formatDateForAPI(date)

          // Verify format matches YYYY-MM-DD pattern
          const pattern = /^\d{4}-\d{2}-\d{2}$/
          expect(formatted).toMatch(pattern)

          return true
        }
      ),
      { numRuns: 100 }
    )
  })
})
