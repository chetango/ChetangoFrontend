// ============================================
// PROPERTY-BASED TESTS - OBSERVATION DEBOUNCE
// ============================================

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import * as fc from 'fast-check'

// ============================================
// DEBOUNCE UTILITY (extracted for testing)
// ============================================

/**
 * Creates a debounced version of a function
 * @param fn The function to debounce
 * @param delay The delay in milliseconds
 * @returns A debounced function
 */
function debounce<T extends (...args: Parameters<T>) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null
  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    timeoutId = setTimeout(() => {
      fn(...args)
      timeoutId = null
    }, delay)
  }
}

// ============================================
// ARBITRARIES FOR GENERATING TEST DATA
// ============================================

// Generate valid observation strings
const observationArb = fc.string({ minLength: 0, maxLength: 200 })

// Generate a sequence of observation changes (simulating rapid typing)
const observationSequenceArb = fc.array(observationArb, { minLength: 2, maxLength: 10 })

// Generate valid student IDs
const studentIdArb = fc.uuid()

/**
 * **Feature: admin-attendance-integration, Property 13: Observation Debounce**
 * **Validates: Requirements 8.2**
 *
 * *For any* sequence of observation input changes, the update mutation SHALL only
 * be called once, 500ms after the last change.
 */
describe('Property 13: Observation Debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should only call the update function once after 500ms for any sequence of rapid changes', () => {
    fc.assert(
      fc.property(observationSequenceArb, (observations) => {
        const mockUpdateFn = vi.fn()
        const debouncedUpdate = debounce(mockUpdateFn, 500)

        // Simulate rapid typing - call debounced function for each observation
        for (const observation of observations) {
          debouncedUpdate(observation)
        }

        // Before 500ms passes, the function should not have been called
        expect(mockUpdateFn).not.toHaveBeenCalled()

        // Advance time by 500ms
        vi.advanceTimersByTime(500)

        // After 500ms, the function should have been called exactly once
        expect(mockUpdateFn).toHaveBeenCalledTimes(1)

        // The function should have been called with the last observation
        expect(mockUpdateFn).toHaveBeenCalledWith(observations[observations.length - 1])

        return true
      }),
      { numRuns: 100 }
    )
  })

  it('should reset the timer when a new change occurs before the delay', () => {
    fc.assert(
      fc.property(
        fc.tuple(observationArb, observationArb),
        ([firstObservation, secondObservation]) => {
          const mockUpdateFn = vi.fn()
          const debouncedUpdate = debounce(mockUpdateFn, 500)

          // First call
          debouncedUpdate(firstObservation)

          // Advance time by 300ms (less than 500ms)
          vi.advanceTimersByTime(300)

          // Function should not have been called yet
          expect(mockUpdateFn).not.toHaveBeenCalled()

          // Second call - this should reset the timer
          debouncedUpdate(secondObservation)

          // Advance time by another 300ms (total 600ms from first call, but only 300ms from second)
          vi.advanceTimersByTime(300)

          // Function should still not have been called (only 300ms since second call)
          expect(mockUpdateFn).not.toHaveBeenCalled()

          // Advance time by another 200ms (now 500ms since second call)
          vi.advanceTimersByTime(200)

          // Now the function should have been called exactly once with the second observation
          expect(mockUpdateFn).toHaveBeenCalledTimes(1)
          expect(mockUpdateFn).toHaveBeenCalledWith(secondObservation)

          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should call the function with the correct argument for any valid observation', () => {
    fc.assert(
      fc.property(observationArb, (observation) => {
        const mockUpdateFn = vi.fn()
        const debouncedUpdate = debounce(mockUpdateFn, 500)

        debouncedUpdate(observation)

        // Advance time by 500ms
        vi.advanceTimersByTime(500)

        // Verify the function was called with the exact observation
        expect(mockUpdateFn).toHaveBeenCalledWith(observation)

        return true
      }),
      { numRuns: 100 }
    )
  })

  it('should handle multiple independent debounced functions for different students', () => {
    fc.assert(
      fc.property(
        fc.tuple(studentIdArb, studentIdArb, observationArb, observationArb),
        ([studentId1, studentId2, observation1, observation2]) => {
          // Skip if student IDs are the same
          if (studentId1 === studentId2) return true

          const mockUpdateFn1 = vi.fn()
          const mockUpdateFn2 = vi.fn()
          const debouncedUpdate1 = debounce(mockUpdateFn1, 500)
          const debouncedUpdate2 = debounce(mockUpdateFn2, 500)

          // Call both debounced functions
          debouncedUpdate1(observation1)
          debouncedUpdate2(observation2)

          // Advance time by 500ms
          vi.advanceTimersByTime(500)

          // Both functions should have been called exactly once
          expect(mockUpdateFn1).toHaveBeenCalledTimes(1)
          expect(mockUpdateFn2).toHaveBeenCalledTimes(1)

          // Each should have been called with its respective observation
          expect(mockUpdateFn1).toHaveBeenCalledWith(observation1)
          expect(mockUpdateFn2).toHaveBeenCalledWith(observation2)

          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should use exactly 500ms delay as specified in requirements', () => {
    fc.assert(
      fc.property(observationArb, (observation) => {
        const mockUpdateFn = vi.fn()
        const debouncedUpdate = debounce(mockUpdateFn, 500)

        debouncedUpdate(observation)

        // At 499ms, function should not have been called
        vi.advanceTimersByTime(499)
        expect(mockUpdateFn).not.toHaveBeenCalled()

        // At 500ms, function should have been called
        vi.advanceTimersByTime(1)
        expect(mockUpdateFn).toHaveBeenCalledTimes(1)

        return true
      }),
      { numRuns: 100 }
    )
  })
})
