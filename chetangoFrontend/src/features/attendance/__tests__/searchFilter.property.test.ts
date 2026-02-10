// ============================================
// PROPERTY-BASED TESTS - SEARCH FILTER BEHAVIOR
// ============================================

import * as fc from 'fast-check'
import { describe, expect, it } from 'vitest'
import { SEARCH_DEBOUNCE_MS } from '../hooks/useAttendanceSearch'
import type { PackageState, StudentAttendance } from '../types/attendanceTypes'
import { filterStudentsBySearch } from '../utils/attendanceUtils'

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
 * **Feature: admin-attendance-integration, Property 11: Search Filter Behavior**
 * **Validates: Requirements 9.1, 9.3**
 *
 * *For any* search term entered in StudentSearch, the filtered results SHALL include
 * only students whose `nombreCompleto` OR `documentoIdentidad` contains the search term
 * (case-insensitive for name), and the filtering SHALL be debounced by 300ms.
 */
describe('Property 11: Search Filter Behavior', () => {
  it('should filter students by nombreCompleto (case-insensitive) OR documentoIdentidad', () => {
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

          // Every filtered student must match either name (case-insensitive) or document
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

  it('should include all students that match the search criteria (no false negatives)', () => {
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

  it('should preserve original order of students in filtered results', () => {
    fc.assert(
      fc.property(
        fc.array(studentAttendanceArb, { minLength: 2, maxLength: 20 }),
        fc.string({ minLength: 1, maxLength: 10 }),
        (students, searchTerm) => {
          const filtered = filterStudentsBySearch(students, searchTerm)

          // Check that filtered results maintain relative order from original array
          if (filtered.length >= 2) {
            for (let i = 0; i < filtered.length - 1; i++) {
              const currentIndex = students.findIndex(
                (s) => s.idAlumno === filtered[i].idAlumno
              )
              const nextIndex = students.findIndex(
                (s) => s.idAlumno === filtered[i + 1].idAlumno
              )
              expect(currentIndex).toBeLessThan(nextIndex)
            }
          }

          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should return empty array when no students match the search term', () => {
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

  it('should have debounce constant set to 300ms as per requirements', () => {
    // Verify the debounce constant is correctly set
    // Requirements: 9.3 - filtering SHALL be debounced by 300ms
    expect(SEARCH_DEBOUNCE_MS).toBe(300)
  })

  it('should handle partial name matches correctly', () => {
    fc.assert(
      fc.property(
        fc.array(studentAttendanceArb, { minLength: 1, maxLength: 10 }),
        fc.integer({ min: 0, max: 9 }),
        (students, studentIndex) => {
          // Pick a student and use part of their name as search term
          const safeIndex = studentIndex % students.length
          const targetStudent = students[safeIndex]
          const partialName = targetStudent.nombreCompleto.substring(0, 3)

          if (partialName.trim().length === 0) {
            return true // Skip if partial name is empty
          }

          const filtered = filterStudentsBySearch(students, partialName)

          // The target student should be in the filtered results
          expect(filtered.some((s) => s.idAlumno === targetStudent.idAlumno)).toBe(true)

          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should handle document identity search correctly', () => {
    fc.assert(
      fc.property(
        fc.array(studentAttendanceArb, { minLength: 1, maxLength: 10 }),
        fc.integer({ min: 0, max: 9 }),
        (students, studentIndex) => {
          // Pick a student and use their document as search term
          const safeIndex = studentIndex % students.length
          const targetStudent = students[safeIndex]
          const documentSearch = targetStudent.documentoIdentidad

          const filtered = filterStudentsBySearch(students, documentSearch)

          // The target student should be in the filtered results
          expect(filtered.some((s) => s.idAlumno === targetStudent.idAlumno)).toBe(true)

          return true
        }
      ),
      { numRuns: 100 }
    )
  })
})
