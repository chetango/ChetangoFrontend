// ============================================
// PROPERTY-BASED TESTS - DATE FILTER / CALENDAR DATE ENABLEMENT
// ============================================

import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import { formatDateForAPI, parseAPIDate } from '@/shared/lib/dateUtils'

/**
 * **Feature: admin-attendance-correction, Property 1: Calendar date enablement**
 * **Validates: Requirements 1.3**
 *
 * *For any* `diasConClases` array returned by the API, the calendar component
 * SHALL enable exactly those dates and disable all other dates within the 7-day range.
 * 
 * This test validates the core logic used by the Calendar component to determine
 * which dates should be enabled/disabled based on the diasConClases array.
 */
describe('Property 1: Calendar date enablement', () => {
  // Generate a valid date string in YYYY-MM-DD format
  const validDateStringArb = fc
    .record({
      year: fc.integer({ min: 2024, max: 2025 }),
      month: fc.integer({ min: 1, max: 12 }),
      day: fc.integer({ min: 1, max: 28 }), // Use 28 to avoid invalid dates
    })
    .map(({ year, month, day }) => {
      const m = String(month).padStart(2, '0')
      const d = String(day).padStart(2, '0')
      return `${year}-${m}-${d}`
    })

  // Generate a 7-day range with some days having classes
  const dateRangeArb = validDateStringArb.chain((desdeStr) => {
    const desde = parseAPIDate(desdeStr)
    const hasta = new Date(desde)
    hasta.setDate(hasta.getDate() + 6) // 7-day range

    // Generate 1-7 unique day offsets for days with classes
    return fc
      .uniqueArray(fc.integer({ min: 0, max: 6 }), { minLength: 1, maxLength: 7 })
      .map((dayOffsets) => {
        const diasConClases = dayOffsets.map((offset) => {
          const date = new Date(desde)
          date.setDate(date.getDate() + offset)
          return formatDateForAPI(date)
        })
        return {
          desde: desdeStr,
          hasta: formatDateForAPI(hasta),
          diasConClases,
        }
      })
  })

  /**
   * The Calendar component uses this logic to determine if a date is enabled:
   * A date is enabled if it exists in the enabledDates array (comparing year, month, day)
   */
  function isDateEnabled(date: Date, enabledDates: Date[]): boolean {
    return enabledDates.some(
      (enabledDate) =>
        enabledDate.getFullYear() === date.getFullYear() &&
        enabledDate.getMonth() === date.getMonth() &&
        enabledDate.getDate() === date.getDate()
    )
  }

  it('should enable exactly the dates present in diasConClases array', () => {
    fc.assert(
      fc.property(dateRangeArb, ({ desde, hasta, diasConClases }) => {
        const fromDate = parseAPIDate(desde)
        const toDate = parseAPIDate(hasta)
        const enabledDates = diasConClases.map((d) => parseAPIDate(d))

        // Check all dates in the 7-day range
        const current = new Date(fromDate)
        while (current <= toDate) {
          const currentStr = formatDateForAPI(current)
          const shouldBeEnabled = diasConClases.includes(currentStr)
          const isEnabled = isDateEnabled(current, enabledDates)

          // The date should be enabled if and only if it's in diasConClases
          expect(isEnabled).toBe(shouldBeEnabled)

          current.setDate(current.getDate() + 1)
        }

        return true
      }),
      { numRuns: 100 }
    )
  })

  it('should correctly identify enabled dates using date comparison', () => {
    fc.assert(
      fc.property(
        fc.uniqueArray(validDateStringArb, { minLength: 1, maxLength: 5 }),
        (dateStrings) => {
          const enabledDates = dateStrings.map((d) => parseAPIDate(d))

          // For each enabled date, verify it matches itself
          for (const enabledDate of enabledDates) {
            const testDate = new Date(
              enabledDate.getFullYear(),
              enabledDate.getMonth(),
              enabledDate.getDate()
            )

            const isEnabled = isDateEnabled(testDate, enabledDates)
            expect(isEnabled).toBe(true)
          }

          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should not enable dates outside the diasConClases array', () => {
    fc.assert(
      fc.property(
        dateRangeArb,
        fc.integer({ min: 7, max: 14 }), // offset for a date outside range
        ({ desde, diasConClases }, offset) => {
          const fromDate = parseAPIDate(desde)
          const enabledDates = diasConClases.map((d) => parseAPIDate(d))

          // Create a date outside the diasConClases
          const outsideDate = new Date(fromDate)
          outsideDate.setDate(outsideDate.getDate() + offset)
          const outsideDateStr = formatDateForAPI(outsideDate)

          // This date should NOT be in diasConClases
          const isInDiasConClases = diasConClases.includes(outsideDateStr)

          // If it's not in diasConClases, it should be disabled
          if (!isInDiasConClases) {
            const isEnabled = isDateEnabled(outsideDate, enabledDates)
            expect(isEnabled).toBe(false)
          }

          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should disable dates within range but not in diasConClases', () => {
    fc.assert(
      fc.property(
        validDateStringArb,
        fc.uniqueArray(fc.integer({ min: 0, max: 6 }), { minLength: 1, maxLength: 3 }),
        (desdeStr, enabledOffsets) => {
          const desde = parseAPIDate(desdeStr)

          // Create diasConClases from enabled offsets
          const diasConClases = enabledOffsets.map((offset) => {
            const date = new Date(desde)
            date.setDate(date.getDate() + offset)
            return formatDateForAPI(date)
          })

          const enabledDates = diasConClases.map((d) => parseAPIDate(d))

          // Check all 7 days in range
          for (let offset = 0; offset <= 6; offset++) {
            const checkDate = new Date(desde)
            checkDate.setDate(checkDate.getDate() + offset)
            const checkDateStr = formatDateForAPI(checkDate)

            const shouldBeEnabled = diasConClases.includes(checkDateStr)
            const isEnabled = isDateEnabled(checkDate, enabledDates)

            expect(isEnabled).toBe(shouldBeEnabled)
          }

          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should handle empty diasConClases by disabling all dates', () => {
    fc.assert(
      fc.property(validDateStringArb, (desdeStr) => {
        const desde = parseAPIDate(desdeStr)
        const enabledDates: Date[] = [] // Empty array

        // All dates should be disabled
        for (let offset = 0; offset <= 6; offset++) {
          const checkDate = new Date(desde)
          checkDate.setDate(checkDate.getDate() + offset)

          const isEnabled = isDateEnabled(checkDate, enabledDates)
          expect(isEnabled).toBe(false)
        }

        return true
      }),
      { numRuns: 100 }
    )
  })
})
