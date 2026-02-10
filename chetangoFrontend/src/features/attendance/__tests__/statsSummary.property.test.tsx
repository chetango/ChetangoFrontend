// ============================================
// PROPERTY-BASED TESTS - STATS SUMMARY
// ============================================

import { cleanup, render } from '@testing-library/react'
import * as fc from 'fast-check'
import { afterEach, describe, expect, it } from 'vitest'
import { StatsSummary } from '../components/admin/StatsSummary'
import type { PackageState, StudentAttendance } from '../types/attendanceTypes'
import { calculateAttendanceStats } from '../utils/attendanceUtils'

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
 * **Feature: admin-attendance-correction, Property 8: Counter updates**
 * **Validates: Requirements 7.2**
 *
 * *For any* attendance toggle that changes state, the counters (presentes, ausentes)
 * SHALL update to reflect the new totals.
 */
describe('Property 8: Counter updates', () => {
  afterEach(() => {
    cleanup()
  })

  it('should display correct counter values for any valid stats', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 100 }),
        fc.integer({ min: 0, max: 100 }),
        fc.integer({ min: 0, max: 100 }),
        (presentes, ausentes, sinPaquete) => {
          cleanup()
          const { container } = render(
            <StatsSummary presentes={presentes} ausentes={ausentes} sinPaquete={sinPaquete} />
          )

          // Should display all three counter values
          expect(container.textContent).toContain(String(presentes))
          expect(container.textContent).toContain(String(ausentes))
          expect(container.textContent).toContain(String(sinPaquete))

          // Should display labels
          expect(container.textContent).toContain('Presentes')
          expect(container.textContent).toContain('Ausentes')
          expect(container.textContent).toContain('Sin Paquete')

          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should reflect calculated stats from student list accurately', () => {
    fc.assert(
      fc.property(
        fc.array(studentAttendanceArb, { minLength: 0, maxLength: 20 }),
        (students) => {
          cleanup()
          const stats = calculateAttendanceStats(students)
          const { container } = render(
            <StatsSummary
              presentes={stats.presentes}
              ausentes={stats.ausentes}
              sinPaquete={stats.sinPaquete}
            />
          )

          // Verify the displayed values match calculated stats
          expect(container.textContent).toContain(String(stats.presentes))
          expect(container.textContent).toContain(String(stats.ausentes))
          expect(container.textContent).toContain(String(stats.sinPaquete))

          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should update counters when attendance state changes', () => {
    fc.assert(
      fc.property(
        fc.array(studentAttendanceArb, { minLength: 1, maxLength: 20 }),
        fc.integer({ min: 0, max: 19 }),
        (students, toggleIndex) => {
          // Ensure toggleIndex is within bounds
          const safeIndex = toggleIndex % students.length

          cleanup()

          // Calculate initial stats
          const initialStats = calculateAttendanceStats(students)

          // Simulate toggling attendance for one student
          const updatedStudents = students.map((student, index) => {
            if (index === safeIndex) {
              return {
                ...student,
                asistencia: {
                  ...student.asistencia,
                  estado: student.asistencia.estado === 'Presente' ? 'Ausente' as const : 'Presente' as const,
                },
              }
            }
            return student
          })

          // Calculate new stats
          const newStats = calculateAttendanceStats(updatedStudents)

          // Verify the change is reflected
          const wasPresent = students[safeIndex].asistencia.estado === 'Presente'
          if (wasPresent) {
            // Changed from Presente to Ausente
            expect(newStats.presentes).toBe(initialStats.presentes - 1)
            expect(newStats.ausentes).toBe(initialStats.ausentes + 1)
          } else {
            // Changed from Ausente to Presente
            expect(newStats.presentes).toBe(initialStats.presentes + 1)
            expect(newStats.ausentes).toBe(initialStats.ausentes - 1)
          }

          // Render with new stats and verify display
          const { container } = render(
            <StatsSummary
              presentes={newStats.presentes}
              ausentes={newStats.ausentes}
              sinPaquete={newStats.sinPaquete}
            />
          )

          expect(container.textContent).toContain(String(newStats.presentes))
          expect(container.textContent).toContain(String(newStats.ausentes))

          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should have appropriate icons for each counter category', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 100 }),
        fc.integer({ min: 0, max: 100 }),
        fc.integer({ min: 0, max: 100 }),
        (presentes, ausentes, sinPaquete) => {
          cleanup()
          const { container } = render(
            <StatsSummary presentes={presentes} ausentes={ausentes} sinPaquete={sinPaquete} />
          )

          // Should have 3 SVG icons (CheckCircle2, XCircle, AlertCircle)
          const svgs = container.querySelectorAll('svg')
          expect(svgs.length).toBe(3)

          return true
        }
      ),
      { numRuns: 100 }
    )
  })
})
