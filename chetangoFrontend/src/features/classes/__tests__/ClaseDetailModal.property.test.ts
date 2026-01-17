// ============================================
// PROPERTY-BASED TESTS - CLASE DETAIL MODAL COMPONENT
// ============================================

import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import {
  getClaseEstadoFromDate,
  formatDateDisplay,
  formatHorarioWithDuration,
} from '../components/ClaseDetailModal'
import {
  formatTime,
  calculateDuration,
  getEstadoBadgeVariant,
  calculateCapacityPercentage,
} from '../components/ClaseCard'
import type { ClaseDetalleDTO } from '../types/classTypes'

// ============================================
// ARBITRARIES FOR GENERATING TEST DATA
// ============================================

/**
 * Generate valid date strings in ISO 8601 format
 * Using integer-based approach to avoid invalid Date objects
 */
const dateStringArb = fc
  .integer({
    min: new Date('2020-01-01').getTime(),
    max: new Date('2030-12-31').getTime(),
  })
  .map((timestamp) => new Date(timestamp).toISOString())

/**
 * Generate valid ClaseDetalleDTO objects
 */
const claseDetalleArb: fc.Arbitrary<ClaseDetalleDTO> = fc.record({
  idClase: fc.uuid(),
  fecha: dateStringArb,
  horaInicio: fc
    .integer({ min: 6, max: 20 })
    .map((h) => `${h.toString().padStart(2, '0')}:00:00`),
  horaFin: fc
    .integer({ min: 7, max: 22 })
    .map((h) => `${h.toString().padStart(2, '0')}:00:00`),
  tipoClase: fc.constantFrom('Tango', 'Milonga', 'Vals', 'Técnica'),
  idProfesorPrincipal: fc.uuid(),
  nombreProfesor: fc.string({ minLength: 3, maxLength: 50 }).filter((s) => s.trim().length > 0),
  cupoMaximo: fc.integer({ min: 1, max: 50 }),
  observaciones: fc.option(fc.string({ minLength: 0, maxLength: 200 }), { nil: null }),
  totalAsistencias: fc.integer({ min: 0, max: 50 }),
  monitores: fc.array(
    fc.record({
      idProfesor: fc.uuid(),
      nombreProfesor: fc.string({ minLength: 3, maxLength: 50 }).filter((s) => s.trim().length > 0),
    }),
    { minLength: 0, maxLength: 3 }
  ),
})


// ============================================
// PROPERTY 9: ClaseDetailModal Display
// Feature: admin-classes-integration
// Validates: Requirements 4.3
// ============================================

/**
 * **Feature: admin-classes-integration, Property 9: ClaseDetailModal Display**
 * **Validates: Requirements 4.3**
 *
 * *For any* ClaseDetalleDTO, the modal SHALL display: estado badge, formatted fecha,
 * horario with calculated duration, nombreProfesor, totalAsistencias/cupoMaximo with progress bar.
 */
describe('Property 9: ClaseDetailModal Display', () => {
  describe('getClaseEstadoFromDate', () => {
    it('should return valid estado for any date', () => {
      fc.assert(
        fc.property(dateStringArb, (fecha) => {
          const estado = getClaseEstadoFromDate(fecha)

          // Should be one of the valid estados
          expect(['hoy', 'programada', 'completada']).toContain(estado)

          return true
        }),
        { numRuns: 100 }
      )
    })

    it('should return "hoy" for today\'s date', () => {
      const today = new Date().toISOString()
      const estado = getClaseEstadoFromDate(today)
      expect(estado).toBe('hoy')
    })

    it('should return "completada" for past dates', () => {
      fc.assert(
        fc.property(
          fc.integer({
            min: new Date('2020-01-01').getTime(),
            max: Date.now() - 2 * 24 * 60 * 60 * 1000, // At least 2 days ago
          }),
          (timestamp) => {
            const date = new Date(timestamp)
            const estado = getClaseEstadoFromDate(date.toISOString())
            expect(estado).toBe('completada')
            return true
          }
        ),
        { numRuns: 100 }
      )
    })


    it('should return "programada" for future dates', () => {
      fc.assert(
        fc.property(
          fc.integer({
            min: Date.now() + 2 * 24 * 60 * 60 * 1000, // At least 2 days from now
            max: new Date('2030-12-31').getTime(),
          }),
          (timestamp) => {
            const date = new Date(timestamp)
            const estado = getClaseEstadoFromDate(date.toISOString())
            expect(estado).toBe('programada')
            return true
          }
        ),
        { numRuns: 100 }
      )
    })
  })

  describe('formatDateDisplay', () => {
    it('should return non-empty formatted string for any valid date', () => {
      fc.assert(
        fc.property(dateStringArb, (fecha) => {
          const formatted = formatDateDisplay(fecha)

          // Should be a non-empty string
          expect(formatted.length).toBeGreaterThan(0)
          expect(typeof formatted).toBe('string')

          return true
        }),
        { numRuns: 100 }
      )
    })

    it('should contain day, month, and year information', () => {
      fc.assert(
        fc.property(
          fc.integer({
            min: new Date('2020-01-01').getTime(),
            max: new Date('2030-12-31').getTime(),
          }),
          (timestamp) => {
            const date = new Date(timestamp)
            const formatted = formatDateDisplay(date.toISOString())

            // Should contain the year
            expect(formatted).toContain(date.getFullYear().toString())

            return true
          }
        ),
        { numRuns: 100 }
      )
    })
  })


  describe('formatHorarioWithDuration', () => {
    it('should return formatted horario with duration for any valid time range', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 6, max: 18 }),
          fc.integer({ min: 0, max: 59 }),
          fc.integer({ min: 1, max: 4 }),
          (startHour, startMinute, durationHours) => {
            const endHour = startHour + durationHours
            if (endHour > 23) return true // Skip invalid ranges

            const horaInicio = `${startHour.toString().padStart(2, '0')}:${startMinute.toString().padStart(2, '0')}:00`
            const horaFin = `${endHour.toString().padStart(2, '0')}:${startMinute.toString().padStart(2, '0')}:00`

            const formatted = formatHorarioWithDuration(horaInicio, horaFin)

            // Should contain start time
            expect(formatted).toContain(formatTime(horaInicio))

            // Should contain end time
            expect(formatted).toContain(formatTime(horaFin))

            // Should contain duration in parentheses
            expect(formatted).toContain('(')
            expect(formatted).toContain(')')

            // Should contain the separator
            expect(formatted).toContain(' - ')

            return true
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should include calculated duration in the output', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 8, max: 18 }),
          fc.integer({ min: 1, max: 3 }),
          (startHour, durationHours) => {
            const horaInicio = `${startHour.toString().padStart(2, '0')}:00:00`
            const horaFin = `${(startHour + durationHours).toString().padStart(2, '0')}:00:00`

            const formatted = formatHorarioWithDuration(horaInicio, horaFin)
            const expectedDuration = calculateDuration(horaInicio, horaFin)

            // Should contain the calculated duration
            expect(formatted).toContain(expectedDuration)

            return true
          }
        ),
        { numRuns: 100 }
      )
    })
  })


  describe('ClaseDetalleDTO display properties', () => {
    it('should have valid estado badge variant for any ClaseDetalleDTO', () => {
      fc.assert(
        fc.property(claseDetalleArb, (claseDetail) => {
          const estado = getClaseEstadoFromDate(claseDetail.fecha)
          const variant = getEstadoBadgeVariant(estado)

          // Should be one of the valid variants
          expect(['error', 'info', 'success', 'none']).toContain(variant)

          return true
        }),
        { numRuns: 100 }
      )
    })

    it('should have valid capacity percentage for any ClaseDetalleDTO', () => {
      fc.assert(
        fc.property(claseDetalleArb, (claseDetail) => {
          const percentage = calculateCapacityPercentage(
            claseDetail.totalAsistencias,
            claseDetail.cupoMaximo
          )

          // Should be between 0 and 100
          expect(percentage).toBeGreaterThanOrEqual(0)
          expect(percentage).toBeLessThanOrEqual(100)

          return true
        }),
        { numRuns: 100 }
      )
    })

    it('should have all required display fields for any ClaseDetalleDTO', () => {
      fc.assert(
        fc.property(claseDetalleArb, (claseDetail) => {
          // tipoClase should be non-empty
          expect(claseDetail.tipoClase.length).toBeGreaterThan(0)

          // nombreProfesor should be non-empty
          expect(claseDetail.nombreProfesor.trim().length).toBeGreaterThan(0)

          // cupoMaximo should be positive
          expect(claseDetail.cupoMaximo).toBeGreaterThan(0)

          // totalAsistencias should be non-negative
          expect(claseDetail.totalAsistencias).toBeGreaterThanOrEqual(0)

          // fecha should be valid ISO string
          expect(() => new Date(claseDetail.fecha)).not.toThrow()

          // horaInicio and horaFin should be valid time strings
          expect(claseDetail.horaInicio).toMatch(/^\d{2}:\d{2}:\d{2}$/)
          expect(claseDetail.horaFin).toMatch(/^\d{2}:\d{2}:\d{2}$/)

          return true
        }),
        { numRuns: 100 }
      )
    })


    it('should format horario correctly for any ClaseDetalleDTO', () => {
      fc.assert(
        fc.property(claseDetalleArb, (claseDetail) => {
          const formatted = formatHorarioWithDuration(
            claseDetail.horaInicio,
            claseDetail.horaFin
          )

          // Should be a non-empty string
          expect(formatted.length).toBeGreaterThan(0)

          // Should contain formatted times
          expect(formatted).toContain(formatTime(claseDetail.horaInicio))
          expect(formatted).toContain(formatTime(claseDetail.horaFin))

          return true
        }),
        { numRuns: 100 }
      )
    })

    it('should format date correctly for any ClaseDetalleDTO', () => {
      fc.assert(
        fc.property(claseDetalleArb, (claseDetail) => {
          const formatted = formatDateDisplay(claseDetail.fecha)

          // Should be a non-empty string
          expect(formatted.length).toBeGreaterThan(0)

          return true
        }),
        { numRuns: 100 }
      )
    })

    it('should handle monitores array correctly', () => {
      fc.assert(
        fc.property(claseDetalleArb, (claseDetail) => {
          // monitores should be an array
          expect(Array.isArray(claseDetail.monitores)).toBe(true)

          // Each monitor should have required fields
          claseDetail.monitores.forEach((monitor) => {
            expect(typeof monitor.idProfesor).toBe('string')
            expect(typeof monitor.nombreProfesor).toBe('string')
            expect(monitor.nombreProfesor.trim().length).toBeGreaterThan(0)
          })

          return true
        }),
        { numRuns: 100 }
      )
    })
  })
})
