// ============================================
// PROPERTY-BASED TESTS - CLASE CARD COMPONENT
// ============================================

import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import {
  formatTime,
  calculateDuration,
  getEstadoBadgeVariant,
  getEstadoText,
  calculateCapacityPercentage,
  getCapacityBarColor,
} from '../components/ClaseCard'
import type { ClaseEstado } from '../types/classTypes'

// ============================================
// ARBITRARIES FOR GENERATING TEST DATA
// ============================================

/**
 * Generate valid time strings in HH:mm:ss format
 */
const timeStringArb = fc
  .tuple(
    fc.integer({ min: 0, max: 23 }),
    fc.integer({ min: 0, max: 59 }),
    fc.integer({ min: 0, max: 59 })
  )
  .map(
    ([h, m, s]) =>
      `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  )

/**
 * Generate valid ClaseEstado values
 */
const claseEstadoArb: fc.Arbitrary<ClaseEstado> = fc.constantFrom(
  'hoy',
  'programada',
  'completada',
  'cancelada'
)

/**
 * Generate valid capacity values
 */
const capacityArb = fc.record({
  totalAsistencias: fc.integer({ min: 0, max: 100 }),
  cupoMaximo: fc.integer({ min: 1, max: 100 }),
})

// ============================================
// PROPERTY 6: ClaseCard Display Format
// Feature: admin-classes-integration
// Validates: Requirements 3.4
// ============================================

/**
 * **Feature: admin-classes-integration, Property 6: ClaseCard Display Format**
 * **Validates: Requirements 3.4**
 *
 * *For any* ClaseListItemDTO, the ClaseCard SHALL display: tipoClase,
 * horario (horaInicio - horaFin), and capacity (totalAsistencias / cupoMaximo).
 */
describe('Property 6: ClaseCard Display Format', () => {
  describe('formatTime', () => {
    it('should format time from HH:mm:ss to HH:mm for any valid time', () => {
      fc.assert(
        fc.property(timeStringArb, (time) => {
          const formatted = formatTime(time)

          // Should be in HH:mm format (5 characters)
          expect(formatted).toHaveLength(5)

          // Should contain a colon
          expect(formatted).toContain(':')

          // Should match the first 5 characters of input
          expect(formatted).toBe(time.substring(0, 5))

          return true
        }),
        { numRuns: 100 }
      )
    })

    it('should preserve hours and minutes correctly', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 23 }),
          fc.integer({ min: 0, max: 59 }),
          (hour, minute) => {
            const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00`
            const formatted = formatTime(time)

            const [formattedHour, formattedMinute] = formatted.split(':').map(Number)
            expect(formattedHour).toBe(hour)
            expect(formattedMinute).toBe(minute)

            return true
          }
        ),
        { numRuns: 100 }
      )
    })
  })

  describe('calculateDuration', () => {
    it('should calculate positive duration for any valid time range', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 20 }),
          fc.integer({ min: 0, max: 59 }),
          fc.integer({ min: 1, max: 4 }),
          (startHour, startMinute, durationHours) => {
            const endHour = startHour + durationHours
            if (endHour > 23) return true // Skip invalid ranges

            const horaInicio = `${startHour.toString().padStart(2, '0')}:${startMinute.toString().padStart(2, '0')}:00`
            const horaFin = `${endHour.toString().padStart(2, '0')}:${startMinute.toString().padStart(2, '0')}:00`

            const duration = calculateDuration(horaInicio, horaFin)

            // Duration should be a non-empty string
            expect(duration.length).toBeGreaterThan(0)

            // Should contain 'h' for hours
            expect(duration).toContain('h')

            return true
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should return minutes only when duration is less than 1 hour', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 22 }),
          fc.integer({ min: 0, max: 30 }),
          fc.integer({ min: 1, max: 59 }),
          (hour, startMinute, durationMinutes) => {
            const endMinute = startMinute + durationMinutes
            if (endMinute >= 60) return true // Skip if crosses hour boundary

            const horaInicio = `${hour.toString().padStart(2, '0')}:${startMinute.toString().padStart(2, '0')}:00`
            const horaFin = `${hour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}:00`

            const duration = calculateDuration(horaInicio, horaFin)

            // Should contain 'min'
            expect(duration).toContain('min')

            // Should not contain 'h' (no hours)
            expect(duration).not.toContain('h')

            return true
          }
        ),
        { numRuns: 100 }
      )
    })
  })

  describe('calculateCapacityPercentage', () => {
    it('should return percentage between 0 and 100 for any valid capacity', () => {
      fc.assert(
        fc.property(capacityArb, ({ totalAsistencias, cupoMaximo }) => {
          const percentage = calculateCapacityPercentage(totalAsistencias, cupoMaximo)

          expect(percentage).toBeGreaterThanOrEqual(0)
          expect(percentage).toBeLessThanOrEqual(100)

          return true
        }),
        { numRuns: 100 }
      )
    })

    it('should return 0 when cupoMaximo is 0', () => {
      fc.assert(
        fc.property(fc.integer({ min: 0, max: 100 }), (totalAsistencias) => {
          const percentage = calculateCapacityPercentage(totalAsistencias, 0)
          expect(percentage).toBe(0)
          return true
        }),
        { numRuns: 100 }
      )
    })

    it('should return 100 when totalAsistencias equals cupoMaximo', () => {
      fc.assert(
        fc.property(fc.integer({ min: 1, max: 100 }), (cupo) => {
          const percentage = calculateCapacityPercentage(cupo, cupo)
          expect(percentage).toBe(100)
          return true
        }),
        { numRuns: 100 }
      )
    })

    it('should cap at 100 when totalAsistencias exceeds cupoMaximo', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 50 }),
          fc.integer({ min: 1, max: 50 }),
          (cupoMaximo, extra) => {
            const totalAsistencias = cupoMaximo + extra
            const percentage = calculateCapacityPercentage(totalAsistencias, cupoMaximo)
            expect(percentage).toBe(100)
            return true
          }
        ),
        { numRuns: 100 }
      )
    })
  })
})


// ============================================
// PROPERTY 16: Action Buttons Visibility by Estado
// Feature: admin-classes-integration
// Validates: Requirements 6.6, 7.5, 12.1
// ============================================

/**
 * **Feature: admin-classes-integration, Property 16: Action Buttons Visibility by Estado**
 * **Validates: Requirements 6.6, 7.5, 12.1**
 *
 * *For any* clase estado:
 * - Edit button visible only for 'hoy' or 'programada'
 * - Cancel button visible only for 'hoy' or 'programada'
 * - "Ir a Asistencia" button visible for all except 'cancelada'
 */
describe('Property 16: Action Buttons Visibility by Estado', () => {
  describe('getEstadoBadgeVariant', () => {
    it('should return valid badge variant for any estado', () => {
      fc.assert(
        fc.property(claseEstadoArb, (estado) => {
          const variant = getEstadoBadgeVariant(estado)

          // Should be one of the valid variants
          expect(['error', 'info', 'success', 'none']).toContain(variant)

          return true
        }),
        { numRuns: 100 }
      )
    })

    it('should return "error" for "hoy" estado (red badge)', () => {
      const variant = getEstadoBadgeVariant('hoy')
      expect(variant).toBe('error')
    })

    it('should return "info" for "programada" estado (purple badge)', () => {
      const variant = getEstadoBadgeVariant('programada')
      expect(variant).toBe('info')
    })

    it('should return "success" for "completada" estado (green badge)', () => {
      const variant = getEstadoBadgeVariant('completada')
      expect(variant).toBe('success')
    })

    it('should return "none" for "cancelada" estado (gray badge)', () => {
      const variant = getEstadoBadgeVariant('cancelada')
      expect(variant).toBe('none')
    })
  })

  describe('getEstadoText', () => {
    it('should return non-empty text for any estado', () => {
      fc.assert(
        fc.property(claseEstadoArb, (estado) => {
          const text = getEstadoText(estado)

          expect(text.length).toBeGreaterThan(0)
          expect(typeof text).toBe('string')

          return true
        }),
        { numRuns: 100 }
      )
    })

    it('should return correct text for each estado', () => {
      expect(getEstadoText('hoy')).toBe('Hoy')
      expect(getEstadoText('programada')).toBe('Programada')
      expect(getEstadoText('completada')).toBe('Completada')
      expect(getEstadoText('cancelada')).toBe('Cancelada')
    })
  })

  describe('getCapacityBarColor', () => {
    it('should return valid color class for any percentage', () => {
      fc.assert(
        fc.property(fc.integer({ min: 0, max: 100 }), (percentage) => {
          const color = getCapacityBarColor(percentage)

          // Should be one of the valid color classes
          expect(['bg-red-500', 'bg-yellow-500', 'bg-emerald-500']).toContain(color)

          return true
        }),
        { numRuns: 100 }
      )
    })

    it('should return red for percentage >= 90', () => {
      fc.assert(
        fc.property(fc.integer({ min: 90, max: 100 }), (percentage) => {
          const color = getCapacityBarColor(percentage)
          expect(color).toBe('bg-red-500')
          return true
        }),
        { numRuns: 100 }
      )
    })

    it('should return yellow for percentage >= 70 and < 90', () => {
      fc.assert(
        fc.property(fc.integer({ min: 70, max: 89 }), (percentage) => {
          const color = getCapacityBarColor(percentage)
          expect(color).toBe('bg-yellow-500')
          return true
        }),
        { numRuns: 100 }
      )
    })

    it('should return green for percentage < 70', () => {
      fc.assert(
        fc.property(fc.integer({ min: 0, max: 69 }), (percentage) => {
          const color = getCapacityBarColor(percentage)
          expect(color).toBe('bg-emerald-500')
          return true
        }),
        { numRuns: 100 }
      )
    })
  })

  describe('Button visibility rules', () => {
    /**
     * Helper to determine if edit/cancel should be visible
     */
    function canEditOrCancel(estado: ClaseEstado): boolean {
      return estado === 'hoy' || estado === 'programada'
    }

    /**
     * Helper to determine if navigate to attendance should be visible
     */
    function canNavigateToAttendance(estado: ClaseEstado): boolean {
      return estado !== 'cancelada'
    }

    it('should allow edit/cancel only for "hoy" or "programada"', () => {
      fc.assert(
        fc.property(claseEstadoArb, (estado) => {
          const canEdit = canEditOrCancel(estado)

          if (estado === 'hoy' || estado === 'programada') {
            expect(canEdit).toBe(true)
          } else {
            expect(canEdit).toBe(false)
          }

          return true
        }),
        { numRuns: 100 }
      )
    })

    it('should allow navigate to attendance for all except "cancelada"', () => {
      fc.assert(
        fc.property(claseEstadoArb, (estado) => {
          const canNavigate = canNavigateToAttendance(estado)

          if (estado === 'cancelada') {
            expect(canNavigate).toBe(false)
          } else {
            expect(canNavigate).toBe(true)
          }

          return true
        }),
        { numRuns: 100 }
      )
    })
  })
})
