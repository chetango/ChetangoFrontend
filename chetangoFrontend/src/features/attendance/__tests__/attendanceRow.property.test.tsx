// ============================================
// PROPERTY-BASED TESTS - ATTENDANCE ROW / STUDENT ROW RENDERING
// ============================================

import { cleanup, render } from '@testing-library/react'
import * as fc from 'fast-check'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { AttendanceRow, formatStudentInitials } from '../components/admin/AttendanceRow'
import type { PackageState, StudentAttendance } from '../types/attendanceTypes'

/**
 * **Feature: admin-attendance-correction, Property 3: Student row rendering**
 * **Validates: Requirements 3.2**
 *
 * *For any* `StudentAttendance` object, the ALUMNO column SHALL display
 * `avatarIniciales`, `nombreCompleto`, and `documentoIdentidad` in the correct positions.
 */
describe('Property 3: Student row rendering', () => {
  afterEach(() => {
    cleanup()
  })

  // Generate valid package state
  const packageStateArb: fc.Arbitrary<PackageState> = fc.constantFrom(
    'Activo',
    'Agotado',
    'Congelado',
    'SinPaquete'
  )

  // Generate valid StudentAttendance object
  const studentAttendanceArb: fc.Arbitrary<StudentAttendance> = fc.record({
    idAlumno: fc.uuid(),
    nombreCompleto: fc.string({ minLength: 2, maxLength: 50 }).filter((s) => s.trim().length >= 2),
    documentoIdentidad: fc.string({ minLength: 5, maxLength: 20 }).filter((s) => /^[A-Za-z0-9]+$/.test(s)),
    avatarIniciales: fc.string({ minLength: 2, maxLength: 2 }).filter((s) => /^[A-Za-z]{2}$/.test(s)),
    paquete: fc.option(
      fc.record({
        idPaquete: fc.option(fc.uuid(), { nil: null }),
        estado: packageStateArb,
        descripcion: fc.option(fc.string({ minLength: 1, maxLength: 30 }), { nil: null }),
        clasesTotales: fc.option(fc.integer({ min: 1, max: 20 }), { nil: null }),
        clasesUsadas: fc.option(fc.integer({ min: 0, max: 20 }), { nil: null }),
        clasesRestantes: fc.option(fc.integer({ min: 0, max: 20 }), { nil: null }),
        esCompartido: fc.boolean(),
        idsAlumnosCompartidos: fc.option(fc.array(fc.uuid(), { maxLength: 3 }), { nil: null }),
        nombresAlumnosCompartidos: fc.option(fc.array(fc.string({ minLength: 1, maxLength: 30 }), { maxLength: 3 }), { nil: null }),
      }),
      { nil: null }
    ),
    asistencia: fc.record({
      idAsistencia: fc.option(fc.uuid(), { nil: null }),
      estado: fc.constantFrom('Presente' as const, 'Ausente' as const),
      observacion: fc.option(fc.string({ minLength: 0, maxLength: 100 }), { nil: null }),
    }),
  })

  it('should display avatarIniciales in the avatar element', () => {
    fc.assert(
      fc.property(studentAttendanceArb, (student) => {
        cleanup()
        const onToggle = vi.fn()
        const onObservationChange = vi.fn()

        const { container } = render(
          <table>
            <tbody>
              <AttendanceRow
                student={student}
                onToggleAttendance={onToggle}
                onObservationChange={onObservationChange}
                isUpdating={false}
              />
            </tbody>
          </table>
        )

        // Find the avatar element and check it contains the initials
        const expectedInitials = formatStudentInitials(student.avatarIniciales)
        expect(container.textContent).toContain(expectedInitials)

        return true
      }),
      { numRuns: 50 }
    )
  })

  it('should display nombreCompleto in the row', () => {
    fc.assert(
      fc.property(studentAttendanceArb, (student) => {
        cleanup()
        const onToggle = vi.fn()
        const onObservationChange = vi.fn()

        const { container } = render(
          <table>
            <tbody>
              <AttendanceRow
                student={student}
                onToggleAttendance={onToggle}
                onObservationChange={onObservationChange}
                isUpdating={false}
              />
            </tbody>
          </table>
        )

        // The row should contain the student's full name
        expect(container.textContent).toContain(student.nombreCompleto)

        return true
      }),
      { numRuns: 50 }
    )
  })

  it('should display documentoIdentidad in the row', () => {
    fc.assert(
      fc.property(studentAttendanceArb, (student) => {
        cleanup()
        const onToggle = vi.fn()
        const onObservationChange = vi.fn()

        const { container } = render(
          <table>
            <tbody>
              <AttendanceRow
                student={student}
                onToggleAttendance={onToggle}
                onObservationChange={onObservationChange}
                isUpdating={false}
              />
            </tbody>
          </table>
        )

        // The row should contain the student's document identity
        expect(container.textContent).toContain(student.documentoIdentidad)

        return true
      }),
      { numRuns: 50 }
    )
  })

  it('should format initials correctly (uppercase, max 2 chars)', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 10 }),
        (initials) => {
          const formatted = formatStudentInitials(initials)

          // Should be uppercase
          expect(formatted).toBe(formatted.toUpperCase())

          // Should be max 2 characters
          expect(formatted.length).toBeLessThanOrEqual(2)

          // Should be the first 2 characters (or less if input is shorter)
          const expected = initials.substring(0, 2).toUpperCase()
          expect(formatted).toBe(expected)

          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should display all three elements (initials, name, document) in correct order', () => {
    fc.assert(
      fc.property(studentAttendanceArb, (student) => {
        cleanup()
        const onToggle = vi.fn()
        const onObservationChange = vi.fn()

        const { container } = render(
          <table>
            <tbody>
              <AttendanceRow
                student={student}
                onToggleAttendance={onToggle}
                onObservationChange={onObservationChange}
                isUpdating={false}
              />
            </tbody>
          </table>
        )

        const textContent = container.textContent || ''
        const expectedInitials = formatStudentInitials(student.avatarIniciales)

        // All three should be present
        expect(textContent).toContain(expectedInitials)
        expect(textContent).toContain(student.nombreCompleto)
        expect(textContent).toContain(student.documentoIdentidad)

        // Initials should appear before name (in the avatar)
        const initialsIndex = textContent.indexOf(expectedInitials)
        const nameIndex = textContent.indexOf(student.nombreCompleto)
        expect(initialsIndex).toBeLessThan(nameIndex)

        // Name should appear before document
        const documentIndex = textContent.indexOf(student.documentoIdentidad)
        expect(nameIndex).toBeLessThan(documentIndex)

        return true
      }),
      { numRuns: 50 }
    )
  })
})
