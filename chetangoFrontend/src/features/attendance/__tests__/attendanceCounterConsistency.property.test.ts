// ============================================
// PROPERTY-BASED TESTS - ATTENDANCE COUNTER CONSISTENCY
// ============================================

import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import type { EstudianteProfesor, EstadoPaqueteProfesor, ProfesorAttendanceCounters } from '../types/profesorTypes'

// ============================================
// COUNTER CALCULATION FUNCTION
// ============================================

/**
 * Calculates attendance counters from a list of students
 * This mirrors the logic in useProfesorAttendance hook
 */
function calculateProfesorCounters(estudiantes: EstudianteProfesor[]): ProfesorAttendanceCounters {
  const presentes = estudiantes.filter((e) => e.asistencia).length
  const ausentes = estudiantes.filter((e) => !e.asistencia).length
  const alertas = estudiantes.filter(
    (e) => e.estadoPaquete === 'sin_paquete' || e.estadoPaquete === 'clase_prueba'
  ).length

  return { presentes, ausentes, alertas }
}

// ============================================
// ARBITRARIES
// ============================================

/**
 * Arbitrary for generating valid EstadoPaqueteProfesor values
 */
const estadoPaqueteArb: fc.Arbitrary<EstadoPaqueteProfesor> = fc.constantFrom(
  'activo',
  'agotado',
  'sin_paquete',
  'clase_prueba'
)

/**
 * Arbitrary for generating valid EstudianteProfesor objects
 */
const estudianteProfesorArb: fc.Arbitrary<EstudianteProfesor> = fc.record({
  id: fc.uuid(),
  nombre: fc.string({ minLength: 1, maxLength: 50 }).filter((s) => s.trim().length > 0),
  documento: fc.stringMatching(/^[0-9]{6,12}$/),
  asistencia: fc.boolean(),
  observacion: fc.string({ minLength: 0, maxLength: 200 }),
  estadoPaquete: estadoPaqueteArb,
  idAsistencia: fc.option(fc.uuid(), { nil: null }),
})

/**
 * Arbitrary for generating a list of students
 */
const estudiantesListArb: fc.Arbitrary<EstudianteProfesor[]> = fc.array(estudianteProfesorArb, {
  minLength: 0,
  maxLength: 50,
})

// ============================================
// PROPERTY TESTS
// ============================================

/**
 * **Feature: attendance-module, Property 3: Attendance Counter Consistency**
 * **Validates: Requirements 2.8, 3.7**
 *
 * *For any* list of students displayed, the sum of presentes + ausentes must equal
 * the total number of students, and the alertas counter must equal the count of
 * students with estado "sin_paquete" or "clase_prueba".
 */
describe('Property 3: Attendance Counter Consistency', () => {
  it('presentes + ausentes should equal total number of students', () => {
    fc.assert(
      fc.property(estudiantesListArb, (estudiantes) => {
        const counters = calculateProfesorCounters(estudiantes)
        
        // The sum of presentes and ausentes must equal total students
        expect(counters.presentes + counters.ausentes).toBe(estudiantes.length)
        
        return true
      }),
      { numRuns: 100 }
    )
  })

  it('presentes should equal count of students with asistencia === true', () => {
    fc.assert(
      fc.property(estudiantesListArb, (estudiantes) => {
        const counters = calculateProfesorCounters(estudiantes)
        const expectedPresentes = estudiantes.filter((e) => e.asistencia === true).length
        
        expect(counters.presentes).toBe(expectedPresentes)
        
        return true
      }),
      { numRuns: 100 }
    )
  })

  it('ausentes should equal count of students with asistencia === false', () => {
    fc.assert(
      fc.property(estudiantesListArb, (estudiantes) => {
        const counters = calculateProfesorCounters(estudiantes)
        const expectedAusentes = estudiantes.filter((e) => e.asistencia === false).length
        
        expect(counters.ausentes).toBe(expectedAusentes)
        
        return true
      }),
      { numRuns: 100 }
    )
  })

  it('alertas should equal count of students with sin_paquete or clase_prueba', () => {
    fc.assert(
      fc.property(estudiantesListArb, (estudiantes) => {
        const counters = calculateProfesorCounters(estudiantes)
        const expectedAlertas = estudiantes.filter(
          (e) => e.estadoPaquete === 'sin_paquete' || e.estadoPaquete === 'clase_prueba'
        ).length
        
        expect(counters.alertas).toBe(expectedAlertas)
        
        return true
      }),
      { numRuns: 100 }
    )
  })

  it('counters should be non-negative for any student list', () => {
    fc.assert(
      fc.property(estudiantesListArb, (estudiantes) => {
        const counters = calculateProfesorCounters(estudiantes)
        
        expect(counters.presentes).toBeGreaterThanOrEqual(0)
        expect(counters.ausentes).toBeGreaterThanOrEqual(0)
        expect(counters.alertas).toBeGreaterThanOrEqual(0)
        
        return true
      }),
      { numRuns: 100 }
    )
  })

  it('empty student list should have all counters at zero', () => {
    const counters = calculateProfesorCounters([])
    
    expect(counters.presentes).toBe(0)
    expect(counters.ausentes).toBe(0)
    expect(counters.alertas).toBe(0)
  })

  it('toggling attendance should update presentes and ausentes inversely', () => {
    fc.assert(
      fc.property(
        fc.array(estudianteProfesorArb, { minLength: 1, maxLength: 20 }),
        fc.integer({ min: 0, max: 19 }),
        (estudiantes, toggleIndex) => {
          // Ensure toggleIndex is within bounds
          const safeIndex = toggleIndex % estudiantes.length

          // Calculate initial counters
          const initialCounters = calculateProfesorCounters(estudiantes)

          // Simulate toggling attendance for one student
          const updatedEstudiantes = estudiantes.map((estudiante, index) => {
            if (index === safeIndex) {
              return {
                ...estudiante,
                asistencia: !estudiante.asistencia,
              }
            }
            return estudiante
          })

          // Calculate new counters
          const newCounters = calculateProfesorCounters(updatedEstudiantes)

          // Verify the change is reflected correctly
          const wasPresent = estudiantes[safeIndex].asistencia
          if (wasPresent) {
            // Changed from Presente to Ausente
            expect(newCounters.presentes).toBe(initialCounters.presentes - 1)
            expect(newCounters.ausentes).toBe(initialCounters.ausentes + 1)
          } else {
            // Changed from Ausente to Presente
            expect(newCounters.presentes).toBe(initialCounters.presentes + 1)
            expect(newCounters.ausentes).toBe(initialCounters.ausentes - 1)
          }

          // Total should remain the same
          expect(newCounters.presentes + newCounters.ausentes).toBe(
            initialCounters.presentes + initialCounters.ausentes
          )

          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  it('changing package status should update alertas counter correctly', () => {
    fc.assert(
      fc.property(
        fc.array(estudianteProfesorArb, { minLength: 1, maxLength: 20 }),
        fc.integer({ min: 0, max: 19 }),
        estadoPaqueteArb,
        (estudiantes, changeIndex, newEstado) => {
          // Ensure changeIndex is within bounds
          const safeIndex = changeIndex % estudiantes.length

          // Calculate initial counters
          const initialCounters = calculateProfesorCounters(estudiantes)
          const oldEstado = estudiantes[safeIndex].estadoPaquete

          // Simulate changing package status for one student
          const updatedEstudiantes = estudiantes.map((estudiante, index) => {
            if (index === safeIndex) {
              return {
                ...estudiante,
                estadoPaquete: newEstado,
              }
            }
            return estudiante
          })

          // Calculate new counters
          const newCounters = calculateProfesorCounters(updatedEstudiantes)

          // Determine expected change in alertas
          const wasAlert = oldEstado === 'sin_paquete' || oldEstado === 'clase_prueba'
          const isAlert = newEstado === 'sin_paquete' || newEstado === 'clase_prueba'

          if (wasAlert && !isAlert) {
            // Removed from alerts
            expect(newCounters.alertas).toBe(initialCounters.alertas - 1)
          } else if (!wasAlert && isAlert) {
            // Added to alerts
            expect(newCounters.alertas).toBe(initialCounters.alertas + 1)
          } else {
            // No change in alert status
            expect(newCounters.alertas).toBe(initialCounters.alertas)
          }

          return true
        }
      ),
      { numRuns: 100 }
    )
  })
})
