// ============================================
// PROPERTY-BASED TESTS - ATTENDANCE UTILITIES
// ============================================

import * as fc from 'fast-check'
import { describe, expect, it } from 'vitest'
import type { PackageState, StudentAttendance } from '../types/attendanceTypes'
import { filterStudentsBySearch } from '../utils/attendanceUtils'

// Arbitrary for generating valid StudentAttendance objects
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
 * **Feature: admin-attendance-correction, Property 7: Search filtering**
 * **Validates: Requirements 6.1, 6.2, 6.3**
 *
 * *For any* search term and student list, the filtered results SHALL include
 * only students where `nombreCompleto` (case-insensitive) OR `documentoIdentidad`
 * contains the search term.
 */
describe('Property 7: Search filtering', () => {
  it('should return only students matching name (case-insensitive) or document', () => {
    fc.assert(
      fc.property(
        fc.array(studentAttendanceArb, { minLength: 0, maxLength: 20 }),
        fc.string({ minLength: 0, maxLength: 20 }),
        (students, searchTerm) => {
          const filtered = filterStudentsBySearch(students, searchTerm)
          const normalizedSearch = searchTerm.toLowerCase().trim()

          // If search term is empty/whitespace, all students should be returned
          if (!searchTerm.trim()) {
            expect(filtered).toEqual(students)
            return true
          }

          // Every filtered student must match either name or document
          for (const student of filtered) {
            const nameMatch = student.nombreCompleto.toLowerCase().includes(normalizedSearch)
            const documentMatch = student.documentoIdentidad.includes(searchTerm.trim())
            expect(nameMatch || documentMatch).toBe(true)
          }

          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should not exclude any student that matches the search criteria', () => {
    fc.assert(
      fc.property(
        fc.array(studentAttendanceArb, { minLength: 0, maxLength: 20 }),
        fc.string({ minLength: 0, maxLength: 20 }),
        (students, searchTerm) => {
          const filtered = filterStudentsBySearch(students, searchTerm)
          const normalizedSearch = searchTerm.toLowerCase().trim()

          // If search term is empty/whitespace, skip this check
          if (!searchTerm.trim()) {
            return true
          }

          // Every student that matches should be in the filtered list
          for (const student of students) {
            const nameMatch = student.nombreCompleto.toLowerCase().includes(normalizedSearch)
            const documentMatch = student.documentoIdentidad.includes(searchTerm.trim())

            if (nameMatch || documentMatch) {
              expect(filtered).toContainEqual(student)
            }
          }

          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should return empty array when no students match', () => {
    fc.assert(
      fc.property(
        fc.array(studentAttendanceArb, { minLength: 0, maxLength: 10 }),
        (students) => {
          // Use a search term that won't match any generated data
          const impossibleSearch = 'ZZZZZZZZZZZZZZZZZZZ'
          const filtered = filterStudentsBySearch(students, impossibleSearch)

          // Verify no students match this impossible search
          const anyMatch = students.some(
            (s) =>
              s.nombreCompleto.toLowerCase().includes(impossibleSearch.toLowerCase()) ||
              s.documentoIdentidad.includes(impossibleSearch)
          )

          if (!anyMatch) {
            expect(filtered).toHaveLength(0)
          }

          return true
        }
      ),
      { numRuns: 100 }
    )
  })
})
