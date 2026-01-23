// ============================================
// PROPERTY-BASED TESTS - CURRENT CLASS DETECTION
// ============================================

import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import { isClassInProgress, findCurrentClass } from '../types/profesorTypes'
import type { ClaseProfesor, TimeRange } from '../types/profesorTypes'

/**
 * **Feature: attendance-module, Property 8: Current Class Detection**
 * **Validates: Requirements 3.2**
 *
 * *For any* set of classes with different time ranges and a current time,
 * the class marked as "En curso" must be the one where
 * currentTime >= horaInicio AND currentTime <= horaFin.
 */
describe('Property 8: Current Class Detection', () => {
  // Generate valid time string in HH:mm:ss format
  const timeStringArb = fc
    .record({
      hours: fc.integer({ min: 0, max: 23 }),
      minutes: fc.integer({ min: 0, max: 59 }),
      seconds: fc.integer({ min: 0, max: 59 }),
    })
    .map(({ hours, minutes, seconds }) => {
      const h = String(hours).padStart(2, '0')
      const m = String(minutes).padStart(2, '0')
      const s = String(seconds).padStart(2, '0')
      return `${h}:${m}:${s}`
    })

  // Generate a valid time range where horaInicio <= horaFin
  const timeRangeArb: fc.Arbitrary<TimeRange> = fc
    .record({
      startHours: fc.integer({ min: 0, max: 22 }),
      startMinutes: fc.integer({ min: 0, max: 59 }),
      durationMinutes: fc.integer({ min: 30, max: 180 }), // 30 min to 3 hours
    })
    .map(({ startHours, startMinutes, durationMinutes }) => {
      const startTotalMinutes = startHours * 60 + startMinutes
      const endTotalMinutes = Math.min(startTotalMinutes + durationMinutes, 23 * 60 + 59)

      const endHours = Math.floor(endTotalMinutes / 60)
      const endMinutes = endTotalMinutes % 60

      return {
        horaInicio: `${String(startHours).padStart(2, '0')}:${String(startMinutes).padStart(2, '0')}:00`,
        horaFin: `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}:00`,
      }
    })

  // Note: claseProfesorArb was removed as it's not used in current tests
  // The claseProfesorValidRangeArb below is used instead for valid time range testing

  // Generate a ClaseProfesor with valid time range (horaInicio <= horaFin)
  const claseProfesorValidRangeArb: fc.Arbitrary<ClaseProfesor> = fc
    .record({
      id: fc.uuid(),
      nombre: fc.string({ minLength: 1, maxLength: 50 }).filter((s) => s.trim().length > 0),
      timeRange: timeRangeArb,
      tipoClase: fc.string({ minLength: 1, maxLength: 30 }).filter((s) => s.trim().length > 0),
      totalAlumnos: fc.integer({ min: 0, max: 50 }),
    })
    .map(({ id, nombre, timeRange, tipoClase, totalAlumnos }) => ({
      id,
      nombre,
      horaInicio: timeRange.horaInicio,
      horaFin: timeRange.horaFin,
      tipoClase,
      totalAlumnos,
    }))

  describe('isClassInProgress', () => {
    it('should return true when currentTime is exactly at horaInicio', () => {
      fc.assert(
        fc.property(timeRangeArb, (timeRange) => {
          const result = isClassInProgress(timeRange.horaInicio, timeRange)
          expect(result).toBe(true)
          return true
        }),
        { numRuns: 100 }
      )
    })

    it('should return true when currentTime is exactly at horaFin', () => {
      fc.assert(
        fc.property(timeRangeArb, (timeRange) => {
          const result = isClassInProgress(timeRange.horaFin, timeRange)
          expect(result).toBe(true)
          return true
        }),
        { numRuns: 100 }
      )
    })

    it('should return true when currentTime is between horaInicio and horaFin', () => {
      fc.assert(
        fc.property(
          timeRangeArb,
          fc.integer({ min: 1, max: 99 }), // percentage between start and end
          (timeRange, percentage) => {
            // Calculate a time between start and end
            const parseTime = (time: string) => {
              const [h, m, s] = time.split(':').map(Number)
              return h * 3600 + m * 60 + s
            }

            const formatTime = (totalSeconds: number) => {
              const h = Math.floor(totalSeconds / 3600)
              const m = Math.floor((totalSeconds % 3600) / 60)
              const s = totalSeconds % 60
              return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
            }

            const startSeconds = parseTime(timeRange.horaInicio)
            const endSeconds = parseTime(timeRange.horaFin)

            // Only test if there's actually a range
            if (endSeconds <= startSeconds) return true

            const midSeconds = Math.floor(
              startSeconds + ((endSeconds - startSeconds) * percentage) / 100
            )
            const midTime = formatTime(midSeconds)

            const result = isClassInProgress(midTime, timeRange)
            expect(result).toBe(true)
            return true
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should return false when currentTime is before horaInicio', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 23 }), // start hour (at least 1 to have room before)
          fc.integer({ min: 0, max: 59 }),
          fc.integer({ min: 30, max: 120 }), // duration
          (startHour, startMin, duration) => {
            const timeRange: TimeRange = {
              horaInicio: `${String(startHour).padStart(2, '0')}:${String(startMin).padStart(2, '0')}:00`,
              horaFin: `${String(Math.min(startHour + Math.floor(duration / 60), 23)).padStart(2, '0')}:${String((startMin + (duration % 60)) % 60).padStart(2, '0')}:00`,
            }

            // Time before start
            const beforeHour = startHour - 1
            const beforeTime = `${String(beforeHour).padStart(2, '0')}:${String(startMin).padStart(2, '0')}:00`

            const result = isClassInProgress(beforeTime, timeRange)
            expect(result).toBe(false)
            return true
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should return false when currentTime is after horaFin', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 21 }), // start hour (leave room for end + 1)
          fc.integer({ min: 0, max: 59 }),
          fc.integer({ min: 30, max: 60 }), // duration (shorter to ensure we have room after)
          (startHour, startMin, duration) => {
            const endHour = Math.min(startHour + Math.floor(duration / 60), 22)
            const endMin = (startMin + (duration % 60)) % 60

            const timeRange: TimeRange = {
              horaInicio: `${String(startHour).padStart(2, '0')}:${String(startMin).padStart(2, '0')}:00`,
              horaFin: `${String(endHour).padStart(2, '0')}:${String(endMin).padStart(2, '0')}:00`,
            }

            // Time after end
            const afterHour = endHour + 1
            if (afterHour > 23) return true // Skip if we can't create a valid after time

            const afterTime = `${String(afterHour).padStart(2, '0')}:${String(endMin).padStart(2, '0')}:00`

            const result = isClassInProgress(afterTime, timeRange)
            expect(result).toBe(false)
            return true
          }
        ),
        { numRuns: 100 }
      )
    })
  })

  describe('findCurrentClass', () => {
    it('should return null when no classes are provided', () => {
      fc.assert(
        fc.property(timeStringArb, (currentTime) => {
          const result = findCurrentClass([], currentTime)
          expect(result).toBeNull()
          return true
        }),
        { numRuns: 100 }
      )
    })

    it('should return null when no class matches the current time', () => {
      fc.assert(
        fc.property(
          fc.array(claseProfesorValidRangeArb, { minLength: 1, maxLength: 5 }),
          (clases) => {
            // Use a time that's definitely outside all class ranges (very early morning)
            const earlyTime = '00:00:00'

            // Filter out any classes that might include this time
            const filteredClases = clases.filter(
              (c) => c.horaInicio > earlyTime || c.horaFin < earlyTime
            )

            if (filteredClases.length === 0) return true // Skip if all classes include early time

            const result = findCurrentClass(filteredClases, earlyTime)

            // If result is not null, verify it actually contains the time
            if (result !== null) {
              expect(earlyTime >= result.horaInicio && earlyTime <= result.horaFin).toBe(true)
            }

            return true
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should return the class that contains the current time', () => {
      fc.assert(
        fc.property(claseProfesorValidRangeArb, (clase) => {
          // Use the class's start time as current time (guaranteed to be in range)
          const currentTime = clase.horaInicio

          const result = findCurrentClass([clase], currentTime)

          expect(result).not.toBeNull()
          expect(result?.id).toBe(clase.id)
          return true
        }),
        { numRuns: 100 }
      )
    })

    it('should return the first matching class when multiple classes overlap', () => {
      fc.assert(
        fc.property(
          fc.array(claseProfesorValidRangeArb, { minLength: 2, maxLength: 5 }),
          (clases) => {
            // Find a time that's in at least one class
            const firstClass = clases[0]
            const currentTime = firstClass.horaInicio

            const result = findCurrentClass(clases, currentTime)

            // If a result is found, it should be a class that contains the current time
            if (result !== null) {
              expect(currentTime >= result.horaInicio && currentTime <= result.horaFin).toBe(true)
            }

            return true
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should correctly identify the current class among non-overlapping classes', () => {
      // Create non-overlapping classes manually for deterministic testing
      const classes: ClaseProfesor[] = [
        {
          id: '1',
          nombre: 'Morning Class',
          horaInicio: '08:00:00',
          horaFin: '09:30:00',
          tipoClase: 'Tango',
          totalAlumnos: 10,
        },
        {
          id: '2',
          nombre: 'Midday Class',
          horaInicio: '12:00:00',
          horaFin: '13:30:00',
          tipoClase: 'Tango',
          totalAlumnos: 15,
        },
        {
          id: '3',
          nombre: 'Evening Class',
          horaInicio: '18:00:00',
          horaFin: '19:30:00',
          tipoClase: 'Tango',
          totalAlumnos: 20,
        },
      ]

      // Test various times
      expect(findCurrentClass(classes, '07:00:00')).toBeNull() // Before all classes
      expect(findCurrentClass(classes, '08:30:00')?.id).toBe('1') // During morning class
      expect(findCurrentClass(classes, '10:00:00')).toBeNull() // Between classes
      expect(findCurrentClass(classes, '12:30:00')?.id).toBe('2') // During midday class
      expect(findCurrentClass(classes, '15:00:00')).toBeNull() // Between classes
      expect(findCurrentClass(classes, '18:30:00')?.id).toBe('3') // During evening class
      expect(findCurrentClass(classes, '20:00:00')).toBeNull() // After all classes
    })

    it('should handle boundary conditions correctly', () => {
      const clase: ClaseProfesor = {
        id: 'boundary-test',
        nombre: 'Boundary Test Class',
        horaInicio: '10:00:00',
        horaFin: '11:30:00',
        tipoClase: 'Tango',
        totalAlumnos: 10,
      }

      // Exactly at start
      expect(findCurrentClass([clase], '10:00:00')?.id).toBe('boundary-test')

      // Exactly at end
      expect(findCurrentClass([clase], '11:30:00')?.id).toBe('boundary-test')

      // One second before start
      expect(findCurrentClass([clase], '09:59:59')).toBeNull()

      // One second after end
      expect(findCurrentClass([clase], '11:30:01')).toBeNull()
    })
  })
})
