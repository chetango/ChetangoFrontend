// ============================================
// PROPERTY-BASED TESTS - FILTERED STATS ACCURACY
// ============================================

import * as fc from 'fast-check'
import { describe, expect, it } from 'vitest'
import type { PackageState, StudentAttendance } from '../types/attendanceTypes'
import { calculateAttendanceStats, filterStudentsBySearch } from '../utils/attendanceUtils'

// ============================================
// ARBITRARIES
// ============================================

const packageStateArb: fc.Arbitrary<PackageState> = fc.constantFrom(
  'Activo',
  'Agotado',
  'Congelado',
  'SinPaquete'
)

const studentAttendanceArb: fc.Arbitrary<StudentAttendance> = fc.record({
  idAlumno: fc.uuid(),
  nombreCompleto: fc.string({ minLength: 1, maxLength: 50 }).filter((s) => s.trim().length > 0),
  documentoIdentidad: fc.stringMatching(/^[0-9]{6,12}$/),
  avatarIniciales: fc.string({ minLength: 2, maxLength: 2 }),
  paquete: fc.option(
    fc.record({
      idPaquete: fc.option(fc.uuid(), { nil: null }),
      estado: packageStateArb,
      descripcion: fc.option(fc.string(), { nil: null }),
      clasesTotales: fc.option(fc.integer({ min: 1, max: 20 }), { nil: null }),
      clasesUsadas: fc.option(fc.integer({ min: 0, max: 20 }), { nil: null }),
      clasesRestantes: fc.option(fc.integer({ min: 0, max: 20 }), { nil: null }),
      esCompartido: fc.boolean(),
      idsAlumnosCompartidos: fc.option(fc.array(fc.uuid(), { maxLength: 3 }), { nil: null }),
      nombresAlumnosCompartidos: fc.option(fc.array(fc.string(), { maxLength: 3 }), { nil: null }),
    }),
    { nil: null }
  ),
  asistencia: fc.record({
    idAsistencia: fc.option(fc.uuid(), { nil: null }),
    estado: fc.constantFrom('Presente' as const, 'Ausente' as const),
    observacion: fc.option(fc.string(), { nil: null }),
  }),
})

/**
 * **Feature: admin-attendance-integration, Property 12: Filtered Stats Accuracy**
 * **Validates: Requirements 9.5**
 *
 * *For any* filtered student list, the StatsSummary SHALL display counts calculated
 * from the filtered list, not the original list.
 */
describe('Property 12: Filtered Stats Accuracy', () => {
  it('should calculate stats from filtered list, not original list', () => {
    fc.assert(
      fc.property(
        fc.array(studentAttendanceArb, { minLength: 0, maxLength: 20 }),
        fc.string({ minLength: 0, maxLength: 20 }),
        (students, searchTerm) => {
          // Filter students
          const filteredStudents = filterStudentsBySearch(students, searchTerm)

          // Calculate stats from filtered list
          const filteredStats = calculateAttendanceStats(filteredStudents)

          // Calculate stats from original list
          const originalStats = calculateAttendanceStats(students)

          // Manually count from filtered list to verify
          const expectedPresentes = filteredStudents.filter(
            (s) => s.asistencia.estado === 'Presente'
          ).length
          const expectedAusentes = filteredStudents.filter(
            (s) => s.asistencia.estado === 'Ausente'
          ).length
          const expectedSinPaquete = filteredStudents.filter(
            (s) => !s.paquete || s.paquete.estado === 'SinPaquete'
          ).length

          // Verify filtered stats match expected values
          expect(filteredStats.presentes).toBe(expectedPresentes)
          expect(filteredStats.ausentes).toBe(expectedAusentes)
          expect(filteredStats.sinPaquete).toBe(expectedSinPaquete)

          // If search term filters out some students, stats should differ from original
          if (filteredStudents.length < students.length) {
            // At least one stat should potentially be different (or all could be same if filtered out students had no impact)
            const totalFiltered = filteredStats.presentes + filteredStats.ausentes
            const totalOriginal = originalStats.presentes + originalStats.ausentes
            expect(totalFiltered).toBeLessThanOrEqual(totalOriginal)
          }

          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should have presentes + ausentes equal to filtered list length', () => {
    fc.assert(
      fc.property(
        fc.array(studentAttendanceArb, { minLength: 0, maxLength: 20 }),
        fc.string({ minLength: 0, maxLength: 20 }),
        (students, searchTerm) => {
          const filteredStudents = filterStudentsBySearch(students, searchTerm)
          const stats = calculateAttendanceStats(filteredStudents)

          // Total of presentes + ausentes should equal filtered list length
          expect(stats.presentes + stats.ausentes).toBe(filteredStudents.length)

          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should have sinPaquete count <= filtered list length', () => {
    fc.assert(
      fc.property(
        fc.array(studentAttendanceArb, { minLength: 0, maxLength: 20 }),
        fc.string({ minLength: 0, maxLength: 20 }),
        (students, searchTerm) => {
          const filteredStudents = filterStudentsBySearch(students, searchTerm)
          const stats = calculateAttendanceStats(filteredStudents)

          // sinPaquete should be <= total students (some students may have packages)
          expect(stats.sinPaquete).toBeLessThanOrEqual(filteredStudents.length)

          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should return zero stats for empty filtered list', () => {
    fc.assert(
      fc.property(
        fc.array(studentAttendanceArb, { minLength: 0, maxLength: 10 }),
        (students) => {
          // Use a search term that won't match any generated data
          const impossibleSearch = 'ZZZZZZZZZZZZZZZZZZZ'
          const filteredStudents = filterStudentsBySearch(students, impossibleSearch)

          // If no students match, filtered list should be empty
          const anyMatch = students.some(
            (s) =>
              s.nombreCompleto.toLowerCase().includes(impossibleSearch.toLowerCase()) ||
              s.documentoIdentidad.includes(impossibleSearch)
          )

          if (!anyMatch) {
            const stats = calculateAttendanceStats(filteredStudents)
            expect(stats.presentes).toBe(0)
            expect(stats.ausentes).toBe(0)
            expect(stats.sinPaquete).toBe(0)
          }

          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should return original stats when search term is empty', () => {
    fc.assert(
      fc.property(
        fc.array(studentAttendanceArb, { minLength: 0, maxLength: 20 }),
        (students) => {
          // Empty search term should return all students
          const filteredStudents = filterStudentsBySearch(students, '')
          const filteredStats = calculateAttendanceStats(filteredStudents)
          const originalStats = calculateAttendanceStats(students)

          // Stats should be identical
          expect(filteredStats.presentes).toBe(originalStats.presentes)
          expect(filteredStats.ausentes).toBe(originalStats.ausentes)
          expect(filteredStats.sinPaquete).toBe(originalStats.sinPaquete)

          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should correctly count sinPaquete for students with null paquete or SinPaquete estado', () => {
    fc.assert(
      fc.property(
        fc.array(studentAttendanceArb, { minLength: 0, maxLength: 20 }),
        fc.string({ minLength: 0, maxLength: 20 }),
        (students, searchTerm) => {
          const filteredStudents = filterStudentsBySearch(students, searchTerm)
          const stats = calculateAttendanceStats(filteredStudents)

          // Manually count sinPaquete
          const manualSinPaquete = filteredStudents.filter(
            (s) => s.paquete === null || s.paquete.estado === 'SinPaquete'
          ).length

          expect(stats.sinPaquete).toBe(manualSinPaquete)

          return true
        }
      ),
      { numRuns: 100 }
    )
  })
})
