// ============================================
// PROPERTY-BASED TESTS - ATTENDANCE HISTORY ORDERING
// ============================================

import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import {
  sortAttendanceByDateDescending,
  calculateProgressPercentage,
  countAttendancesThisMonth,
} from '../types/studentTypes'
import type { AsistenciaRecord, EstadoAsistencia, TipoAsistencia } from '../types/studentTypes'

/**
 * **Feature: attendance-module, Property 9: Attendance History Ordering**
 * **Validates: Requirements 4.6**
 *
 * *For any* list of attendance records displayed to the student,
 * the records must be sorted by fecha in descending order (most recent first).
 */
describe('Property 9: Attendance History Ordering', () => {
  // Generate valid date string in YYYY-MM-DD format
  const dateStringArb = fc
    .record({
      year: fc.integer({ min: 2020, max: 2030 }),
      month: fc.integer({ min: 1, max: 12 }),
      day: fc.integer({ min: 1, max: 28 }), // Use 28 to avoid invalid dates
    })
    .map(({ year, month, day }) => {
      const m = String(month).padStart(2, '0')
      const d = String(day).padStart(2, '0')
      return `${year}-${m}-${d}`
    })

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

  // Generate valid estado
  const estadoArb: fc.Arbitrary<EstadoAsistencia> = fc.constantFrom(
    'presente',
    'ausente',
    'reprogramada'
  )

  // Generate valid tipo
  const tipoArb: fc.Arbitrary<TipoAsistencia> = fc.constantFrom(
    'normal',
    'clase_suelta',
    'cortesia',
    'prueba'
  )

  // Generate a valid AsistenciaRecord
  const asistenciaRecordArb: fc.Arbitrary<AsistenciaRecord> = fc.record({
    id: fc.uuid(),
    fecha: dateStringArb,
    clase: fc.string({ minLength: 1, maxLength: 50 }).filter((s) => s.trim().length > 0),
    estado: estadoArb,
    tipo: tipoArb,
    descontada: fc.boolean(),
    nota: fc.option(fc.string({ minLength: 1, maxLength: 200 }), { nil: undefined }),
    horaInicio: timeStringArb,
    horaFin: timeStringArb,
  })

  describe('sortAttendanceByDateDescending', () => {
    it('should return records sorted by date in descending order (most recent first)', () => {
      fc.assert(
        fc.property(
          fc.array(asistenciaRecordArb, { minLength: 0, maxLength: 50 }),
          (records) => {
            const sorted = sortAttendanceByDateDescending(records)

            // Verify the result is sorted in descending order
            for (let i = 0; i < sorted.length - 1; i++) {
              const current = sorted[i].fecha
              const next = sorted[i + 1].fecha
              // Current date should be >= next date (descending order)
              expect(current >= next).toBe(true)
            }

            return true
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should preserve all records (same length)', () => {
      fc.assert(
        fc.property(
          fc.array(asistenciaRecordArb, { minLength: 0, maxLength: 50 }),
          (records) => {
            const sorted = sortAttendanceByDateDescending(records)
            expect(sorted.length).toBe(records.length)
            return true
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should not mutate the original array', () => {
      fc.assert(
        fc.property(
          fc.array(asistenciaRecordArb, { minLength: 1, maxLength: 20 }),
          (records) => {
            const originalOrder = records.map((r) => r.id)
            sortAttendanceByDateDescending(records)
            const afterOrder = records.map((r) => r.id)

            // Original array should remain unchanged
            expect(originalOrder).toEqual(afterOrder)
            return true
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should contain all original records (same IDs)', () => {
      fc.assert(
        fc.property(
          fc.array(asistenciaRecordArb, { minLength: 0, maxLength: 50 }),
          (records) => {
            const sorted = sortAttendanceByDateDescending(records)

            const originalIds = new Set(records.map((r) => r.id))
            const sortedIds = new Set(sorted.map((r) => r.id))

            expect(sortedIds).toEqual(originalIds)
            return true
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should handle empty array', () => {
      const result = sortAttendanceByDateDescending([])
      expect(result).toEqual([])
    })

    it('should handle single element array', () => {
      fc.assert(
        fc.property(asistenciaRecordArb, (record) => {
          const result = sortAttendanceByDateDescending([record])
          expect(result.length).toBe(1)
          expect(result[0].id).toBe(record.id)
          return true
        }),
        { numRuns: 100 }
      )
    })

    it('should place most recent date first', () => {
      fc.assert(
        fc.property(
          fc.array(asistenciaRecordArb, { minLength: 2, maxLength: 20 }),
          (records) => {
            const sorted = sortAttendanceByDateDescending(records)

            // Find the maximum date in original records
            const maxDate = records.reduce(
              (max, r) => (r.fecha > max ? r.fecha : max),
              records[0].fecha
            )

            // First element should have the maximum date
            expect(sorted[0].fecha).toBe(maxDate)
            return true
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should place oldest date last', () => {
      fc.assert(
        fc.property(
          fc.array(asistenciaRecordArb, { minLength: 2, maxLength: 20 }),
          (records) => {
            const sorted = sortAttendanceByDateDescending(records)

            // Find the minimum date in original records
            const minDate = records.reduce(
              (min, r) => (r.fecha < min ? r.fecha : min),
              records[0].fecha
            )

            // Last element should have the minimum date
            expect(sorted[sorted.length - 1].fecha).toBe(minDate)
            return true
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should be idempotent (sorting twice gives same result)', () => {
      fc.assert(
        fc.property(
          fc.array(asistenciaRecordArb, { minLength: 0, maxLength: 20 }),
          (records) => {
            const sortedOnce = sortAttendanceByDateDescending(records)
            const sortedTwice = sortAttendanceByDateDescending(sortedOnce)

            // Both should have same order
            expect(sortedOnce.map((r) => r.id)).toEqual(sortedTwice.map((r) => r.id))
            return true
          }
        ),
        { numRuns: 100 }
      )
    })
  })

  describe('calculateProgressPercentage (Property 10 helper)', () => {
    it('should calculate correct percentage for valid inputs', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 100 }), // clasesUsadas
          fc.integer({ min: 1, max: 100 }), // clasesTotales (at least 1)
          (clasesUsadas, clasesTotales) => {
            // Ensure clasesUsadas <= clasesTotales for realistic scenario
            const usadas = Math.min(clasesUsadas, clasesTotales)
            const result = calculateProgressPercentage(usadas, clasesTotales)

            // Expected percentage
            const expected = Math.round((usadas / clasesTotales) * 100)

            expect(result).toBe(expected)
            return true
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should return 0 when clasesTotales is 0', () => {
      fc.assert(
        fc.property(fc.integer({ min: 0, max: 100 }), (clasesUsadas) => {
          const result = calculateProgressPercentage(clasesUsadas, 0)
          expect(result).toBe(0)
          return true
        }),
        { numRuns: 100 }
      )
    })

    it('should return 0 when clasesTotales is negative', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 100 }),
          fc.integer({ min: -100, max: -1 }),
          (clasesUsadas, clasesTotales) => {
            const result = calculateProgressPercentage(clasesUsadas, clasesTotales)
            expect(result).toBe(0)
            return true
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should return 100 when all classes are used', () => {
      fc.assert(
        fc.property(fc.integer({ min: 1, max: 100 }), (total) => {
          const result = calculateProgressPercentage(total, total)
          expect(result).toBe(100)
          return true
        }),
        { numRuns: 100 }
      )
    })

    it('should return 0 when no classes are used', () => {
      fc.assert(
        fc.property(fc.integer({ min: 1, max: 100 }), (total) => {
          const result = calculateProgressPercentage(0, total)
          expect(result).toBe(0)
          return true
        }),
        { numRuns: 100 }
      )
    })

    it('should return value between 0 and 100 for valid inputs', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 100 }),
          fc.integer({ min: 1, max: 100 }),
          (clasesUsadas, clasesTotales) => {
            const usadas = Math.min(clasesUsadas, clasesTotales)
            const result = calculateProgressPercentage(usadas, clasesTotales)
            expect(result).toBeGreaterThanOrEqual(0)
            expect(result).toBeLessThanOrEqual(100)
            return true
          }
        ),
        { numRuns: 100 }
      )
    })
  })

  describe('countAttendancesThisMonth', () => {
    it('should count only records from current month', () => {
      const now = new Date()
      const currentYear = now.getFullYear()
      const currentMonth = now.getMonth() + 1 // 1-indexed for string format

      // Create records with known dates
      const thisMonthRecord: AsistenciaRecord = {
        id: '1',
        fecha: `${currentYear}-${String(currentMonth).padStart(2, '0')}-15`,
        clase: 'Test Class',
        estado: 'presente',
        tipo: 'normal',
        descontada: true,
        horaInicio: '10:00:00',
        horaFin: '11:00:00',
      }

      const lastMonthRecord: AsistenciaRecord = {
        id: '2',
        fecha: `${currentYear}-${String(currentMonth - 1 || 12).padStart(2, '0')}-15`,
        clase: 'Test Class',
        estado: 'presente',
        tipo: 'normal',
        descontada: true,
        horaInicio: '10:00:00',
        horaFin: '11:00:00',
      }

      const records = [thisMonthRecord, lastMonthRecord]
      const count = countAttendancesThisMonth(records)

      expect(count).toBe(1)
    })

    it('should return 0 for empty array', () => {
      const count = countAttendancesThisMonth([])
      expect(count).toBe(0)
    })

    it('should return 0 when no records match current month', () => {
      const now = new Date()
      const lastYear = now.getFullYear() - 1

      const oldRecord: AsistenciaRecord = {
        id: '1',
        fecha: `${lastYear}-06-15`,
        clase: 'Test Class',
        estado: 'presente',
        tipo: 'normal',
        descontada: true,
        horaInicio: '10:00:00',
        horaFin: '11:00:00',
      }

      const count = countAttendancesThisMonth([oldRecord])
      expect(count).toBe(0)
    })
  })
})
