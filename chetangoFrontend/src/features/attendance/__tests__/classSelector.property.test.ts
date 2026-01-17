// ============================================
// PROPERTY-BASED TESTS - CLASS SELECTOR / CLASS DISPLAY FORMAT
// ============================================

import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import { formatClassDisplay } from '../components/admin/ClassSelector'
import { formatTimeForDisplay } from '@/shared/lib/dateUtils'
import type { ClassInfo } from '../types/attendanceTypes'

/**
 * **Feature: admin-attendance-integration, Property 5: Class Display Format**
 * **Validates: Requirements 4.3**
 *
 * *For any* ClassInfo object, the formatted display string SHALL follow the pattern
 * `{nombre} - {horaInicio} a {horaFin} ({profesorPrincipal})`.
 */
describe('Property 5: Class Display Format', () => {
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

  // Generate valid ClassInfo object
  const classInfoArb: fc.Arbitrary<ClassInfo> = fc.record({
    idClase: fc.uuid(),
    nombre: fc.string({ minLength: 1, maxLength: 50 }).filter((s) => s.trim().length > 0),
    horaInicio: timeStringArb,
    horaFin: timeStringArb,
    profesorPrincipal: fc.string({ minLength: 1, maxLength: 50 }).filter((s) => s.trim().length > 0),
  })

  it('should display class name in the formatted output', () => {
    fc.assert(
      fc.property(classInfoArb, (classInfo) => {
        const display = formatClassDisplay(
          classInfo.nombre,
          classInfo.horaInicio,
          classInfo.horaFin,
          classInfo.profesorPrincipal
        )

        // The display should contain the class name
        expect(display).toContain(classInfo.nombre)

        return true
      }),
      { numRuns: 100 }
    )
  })

  it('should display time range in HH:mm format with "a" separator', () => {
    fc.assert(
      fc.property(classInfoArb, (classInfo) => {
        const display = formatClassDisplay(
          classInfo.nombre,
          classInfo.horaInicio,
          classInfo.horaFin,
          classInfo.profesorPrincipal
        )

        // The display should contain the formatted time range with "a" separator
        const formattedStart = formatTimeForDisplay(classInfo.horaInicio)
        const formattedEnd = formatTimeForDisplay(classInfo.horaFin)

        expect(display).toContain(formattedStart)
        expect(display).toContain(formattedEnd)
        expect(display).toContain(` a `)

        return true
      }),
      { numRuns: 100 }
    )
  })

  it('should display professor name in parentheses', () => {
    fc.assert(
      fc.property(classInfoArb, (classInfo) => {
        const display = formatClassDisplay(
          classInfo.nombre,
          classInfo.horaInicio,
          classInfo.horaFin,
          classInfo.profesorPrincipal
        )

        // The display should contain the professor name in parentheses
        expect(display).toContain(`(${classInfo.profesorPrincipal})`)

        return true
      }),
      { numRuns: 100 }
    )
  })

  it('should format display as "{nombre} - {horaInicio} a {horaFin} ({profesorPrincipal})"', () => {
    fc.assert(
      fc.property(classInfoArb, (classInfo) => {
        const display = formatClassDisplay(
          classInfo.nombre,
          classInfo.horaInicio,
          classInfo.horaFin,
          classInfo.profesorPrincipal
        )

        const formattedStart = formatTimeForDisplay(classInfo.horaInicio)
        const formattedEnd = formatTimeForDisplay(classInfo.horaFin)

        // The display should follow the expected format
        const expectedFormat = `${classInfo.nombre} - ${formattedStart} a ${formattedEnd} (${classInfo.profesorPrincipal})`
        expect(display).toBe(expectedFormat)

        return true
      }),
      { numRuns: 100 }
    )
  })

  it('should handle various time formats correctly', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 20 }).filter((s) => s.trim().length > 0),
        fc.integer({ min: 0, max: 23 }),
        fc.integer({ min: 0, max: 59 }),
        fc.integer({ min: 0, max: 23 }),
        fc.integer({ min: 0, max: 59 }),
        fc.string({ minLength: 1, maxLength: 30 }).filter((s) => s.trim().length > 0),
        (nombre, startHour, startMin, endHour, endMin, profesor) => {
          const horaInicio = `${String(startHour).padStart(2, '0')}:${String(startMin).padStart(2, '0')}:00`
          const horaFin = `${String(endHour).padStart(2, '0')}:${String(endMin).padStart(2, '0')}:00`

          const display = formatClassDisplay(nombre, horaInicio, horaFin, profesor)

          // Should contain all parts in correct format
          expect(display).toContain(nombre)
          expect(display).toContain(`(${profesor})`)
          expect(display).toContain(` - `)
          expect(display).toContain(` a `)
          expect(display).toContain(`${String(startHour).padStart(2, '0')}:${String(startMin).padStart(2, '0')}`)
          expect(display).toContain(`${String(endHour).padStart(2, '0')}:${String(endMin).padStart(2, '0')}`)

          return true
        }
      ),
      { numRuns: 100 }
    )
  })
})
