// ============================================
// PROPERTY-BASED TESTS - ATTENDANCE TOGGLE PERSISTENCE
// ============================================

import { cleanup, fireEvent, render } from '@testing-library/react'
import * as fc from 'fast-check'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { AttendanceTable } from '../components/admin/AttendanceTable'
import type { PackageState, StudentAttendance } from '../types/attendanceTypes'

/**
 * **Feature: admin-attendance-correction, Property 6: Attendance toggle persistence**
 * **Validates: Requirements 4.4**
 *
 * *For any* attendance toggle change, the system SHALL make an API call to persist the change.
 */
describe('Property 6: Attendance toggle persistence', () => {
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

  it('should call onToggleAttendance when toggle button is clicked', () => {
    fc.assert(
      fc.property(
        fc.array(studentAttendanceArb, { minLength: 1, maxLength: 3 }),
        fc.integer({ min: 0, max: 2 }),
        (students, toggleIndex) => {
          // Ensure we have a valid index
          const validIndex = toggleIndex % students.length
          const targetStudent = students[validIndex]

          cleanup()
          const onToggleAttendance = vi.fn()
          const onObservationChange = vi.fn()

          const { container } = render(
            <AttendanceTable
              students={students}
              searchTerm=""
              onToggleAttendance={onToggleAttendance}
              onObservationChange={onObservationChange}
              isUpdating={{}}
            />
          )

          // Find all toggle buttons
          const toggleButtons = container.querySelectorAll('button[aria-pressed]')
          expect(toggleButtons.length).toBe(students.length)

          // Click the target toggle button
          const targetButton = toggleButtons[validIndex]
          fireEvent.click(targetButton)

          // Verify onToggleAttendance was called with the correct student ID
          expect(onToggleAttendance).toHaveBeenCalledTimes(1)
          expect(onToggleAttendance).toHaveBeenCalledWith(targetStudent.idAlumno)

          return true
        }
      ),
      { numRuns: 20 }
    )
  }, 15000)

  it('should call onToggleAttendance for each toggle click', () => {
    fc.assert(
      fc.property(
        fc.array(studentAttendanceArb, { minLength: 2, maxLength: 5 }),
        fc.array(fc.integer({ min: 0, max: 4 }), { minLength: 1, maxLength: 3 }),
        (students, clickIndices) => {
          cleanup()
          const onToggleAttendance = vi.fn()
          const onObservationChange = vi.fn()

          const { container } = render(
            <AttendanceTable
              students={students}
              searchTerm=""
              onToggleAttendance={onToggleAttendance}
              onObservationChange={onObservationChange}
              isUpdating={{}}
            />
          )

          const toggleButtons = container.querySelectorAll('button[aria-pressed]')

          // Click multiple toggle buttons
          const validClicks = clickIndices.map((i) => i % students.length)
          for (const index of validClicks) {
            fireEvent.click(toggleButtons[index])
          }

          // Verify onToggleAttendance was called for each click
          expect(onToggleAttendance).toHaveBeenCalledTimes(validClicks.length)

          // Verify each call was made with the correct student ID
          validClicks.forEach((index, callIndex) => {
            expect(onToggleAttendance).toHaveBeenNthCalledWith(
              callIndex + 1,
              students[index].idAlumno
            )
          })

          return true
        }
      ),
      { numRuns: 30 }
    )
  })

  it('should not call onToggleAttendance when toggle is disabled', () => {
    fc.assert(
      fc.property(
        fc.array(studentAttendanceArb, { minLength: 1, maxLength: 3 }),
        (students) => {
          cleanup()
          const onToggleAttendance = vi.fn()
          const onObservationChange = vi.fn()

          // Mark all students as updating (disabled)
          const isUpdating: Record<string, boolean> = {}
          students.forEach((s) => {
            isUpdating[s.idAlumno] = true
          })

          const { container } = render(
            <AttendanceTable
              students={students}
              searchTerm=""
              onToggleAttendance={onToggleAttendance}
              onObservationChange={onObservationChange}
              isUpdating={isUpdating}
            />
          )

          const toggleButtons = container.querySelectorAll('button[aria-pressed]')

          // Try to click all toggle buttons
          toggleButtons.forEach((button) => {
            fireEvent.click(button)
          })

          // Verify onToggleAttendance was NOT called (buttons are disabled)
          expect(onToggleAttendance).not.toHaveBeenCalled()

          return true
        }
      ),
      { numRuns: 30 }
    )
  })

  it('should trigger persistence callback with correct student ID regardless of attendance state', () => {
    fc.assert(
      fc.property(
        studentAttendanceArb,
        (student) => {
          cleanup()
          const onToggleAttendance = vi.fn()
          const onObservationChange = vi.fn()

          const { container } = render(
            <AttendanceTable
              students={[student]}
              searchTerm=""
              onToggleAttendance={onToggleAttendance}
              onObservationChange={onObservationChange}
              isUpdating={{}}
            />
          )

          const toggleButton = container.querySelector('button[aria-pressed]')
          expect(toggleButton).toBeTruthy()

          // Click the toggle
          fireEvent.click(toggleButton!)

          // Verify the callback was called with the student's ID
          // This ensures the system will make an API call to persist the change
          expect(onToggleAttendance).toHaveBeenCalledWith(student.idAlumno)

          return true
        }
      ),
      { numRuns: 50 }
    )
  })
})
