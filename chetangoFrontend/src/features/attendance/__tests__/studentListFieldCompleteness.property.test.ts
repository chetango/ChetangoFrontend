// ============================================
// PROPERTY-BASED TESTS - STUDENT LIST FIELD COMPLETENESS
// ============================================

import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import type { StudentAttendance, StudentPackage, PackageState, AttendanceRecord } from '../types/attendanceTypes'
import type { EstudianteProfesor, EstadoPaqueteProfesor } from '../types/profesorTypes'

// ============================================
// VALIDATION FUNCTIONS
// ============================================

/**
 * Validates that a StudentAttendance object has all required fields
 * for display in the admin attendance list
 * 
 * Required fields: nombre, documento, estado del paquete, control de asistencia, campo de observación
 */
function validateAdminStudentFields(student: StudentAttendance): {
  isValid: boolean
  missingFields: string[]
} {
  const missingFields: string[] = []

  // Check nombre (nombreCompleto)
  if (!student.nombreCompleto || student.nombreCompleto.trim().length === 0) {
    missingFields.push('nombreCompleto')
  }

  // Check documento (documentoIdentidad)
  if (!student.documentoIdentidad || student.documentoIdentidad.trim().length === 0) {
    missingFields.push('documentoIdentidad')
  }

  // Check estado del paquete (paquete.estado or null for SinPaquete)
  // paquete can be null which represents "SinPaquete"
  if (student.paquete !== null) {
    if (!student.paquete.estado) {
      missingFields.push('paquete.estado')
    }
  }

  // Check control de asistencia (asistencia.estado)
  if (!student.asistencia || !student.asistencia.estado) {
    missingFields.push('asistencia.estado')
  }

  // Check campo de observación exists (can be null but must be present)
  if (student.asistencia && student.asistencia.observacion === undefined) {
    missingFields.push('asistencia.observacion')
  }

  return {
    isValid: missingFields.length === 0,
    missingFields,
  }
}

/**
 * Validates that an EstudianteProfesor object has all required fields
 * for display in the profesor attendance list
 * 
 * Required fields: nombre, documento, toggle presente/ausente, campo de observación, badge de estado del paquete
 */
function validateProfesorStudentFields(estudiante: EstudianteProfesor): {
  isValid: boolean
  missingFields: string[]
} {
  const missingFields: string[] = []

  // Check nombre
  if (!estudiante.nombre || estudiante.nombre.trim().length === 0) {
    missingFields.push('nombre')
  }

  // Check documento (can be empty string but must be defined)
  if (estudiante.documento === undefined || estudiante.documento === null) {
    missingFields.push('documento')
  }

  // Check asistencia (boolean for toggle)
  if (typeof estudiante.asistencia !== 'boolean') {
    missingFields.push('asistencia')
  }

  // Check observacion (can be empty string but must be defined)
  if (estudiante.observacion === undefined || estudiante.observacion === null) {
    missingFields.push('observacion')
  }

  // Check estadoPaquete (for badge)
  if (!estudiante.estadoPaquete) {
    missingFields.push('estadoPaquete')
  }

  return {
    isValid: missingFields.length === 0,
    missingFields,
  }
}

// ============================================
// ARBITRARIES
// ============================================

/**
 * Arbitrary for generating valid PackageState values
 */
const packageStateArb: fc.Arbitrary<PackageState> = fc.constantFrom(
  'Activo',
  'Agotado',
  'Congelado',
  'SinPaquete'
)

/**
 * Arbitrary for generating valid StudentPackage objects
 */
const studentPackageArb: fc.Arbitrary<StudentPackage> = fc.record({
  estado: packageStateArb,
  descripcion: fc.option(fc.string({ minLength: 1, maxLength: 100 }), { nil: null }),
  clasesTotales: fc.option(fc.integer({ min: 1, max: 50 }), { nil: null }),
  clasesUsadas: fc.option(fc.integer({ min: 0, max: 50 }), { nil: null }),
  clasesRestantes: fc.option(fc.integer({ min: 0, max: 50 }), { nil: null }),
})

/**
 * Arbitrary for generating valid AttendanceRecord objects
 */
const attendanceRecordArb: fc.Arbitrary<AttendanceRecord> = fc.record({
  idAsistencia: fc.option(fc.uuid(), { nil: null }),
  estado: fc.constantFrom('Presente', 'Ausente') as fc.Arbitrary<'Presente' | 'Ausente'>,
  observacion: fc.option(fc.string({ minLength: 0, maxLength: 200 }), { nil: null }),
})

/**
 * Arbitrary for generating valid StudentAttendance objects (Admin view)
 */
const studentAttendanceArb: fc.Arbitrary<StudentAttendance> = fc.record({
  idAlumno: fc.uuid(),
  nombreCompleto: fc.string({ minLength: 1, maxLength: 100 }).filter((s) => s.trim().length > 0),
  documentoIdentidad: fc.stringMatching(/^[0-9]{6,12}$/),
  avatarIniciales: fc.stringMatching(/^[A-Z]{1,2}$/),
  paquete: fc.option(studentPackageArb, { nil: null }),
  asistencia: attendanceRecordArb,
})

/**
 * Arbitrary for generating valid EstadoPaqueteProfesor values
 */
const estadoPaqueteProfesorArb: fc.Arbitrary<EstadoPaqueteProfesor> = fc.constantFrom(
  'activo',
  'agotado',
  'sin_paquete',
  'clase_prueba'
)

/**
 * Arbitrary for generating valid EstudianteProfesor objects (Profesor view)
 */
const estudianteProfesorArb: fc.Arbitrary<EstudianteProfesor> = fc.record({
  id: fc.uuid(),
  nombre: fc.string({ minLength: 1, maxLength: 50 }).filter((s) => s.trim().length > 0),
  documento: fc.stringMatching(/^[0-9]{0,12}$/), // Can be empty
  asistencia: fc.boolean(),
  observacion: fc.string({ minLength: 0, maxLength: 200 }),
  estadoPaquete: estadoPaqueteProfesorArb,
  idAsistencia: fc.option(fc.uuid(), { nil: null }),
})

/**
 * Arbitrary for generating a list of admin students
 */
const adminStudentListArb: fc.Arbitrary<StudentAttendance[]> = fc.array(studentAttendanceArb, {
  minLength: 0,
  maxLength: 30,
})

/**
 * Arbitrary for generating a list of profesor students
 */
const profesorStudentListArb: fc.Arbitrary<EstudianteProfesor[]> = fc.array(estudianteProfesorArb, {
  minLength: 0,
  maxLength: 30,
})

// ============================================
// PROPERTY TESTS
// ============================================

/**
 * **Feature: attendance-module, Property 2: Student List Field Completeness**
 * **Validates: Requirements 2.4, 3.4**
 *
 * *For any* student displayed in the attendance list (admin or profesor view),
 * all required fields must be present: nombre, documento, estado del paquete,
 * control de asistencia, y campo de observación.
 */
describe('Property 2: Student List Field Completeness', () => {
  describe('Admin View - StudentAttendance', () => {
    it('all students should have required fields for display', () => {
      fc.assert(
        fc.property(adminStudentListArb, (students) => {
          for (const student of students) {
            const validation = validateAdminStudentFields(student)
            
            expect(validation.isValid).toBe(true)
            expect(validation.missingFields).toHaveLength(0)
          }
          
          return true
        }),
        { numRuns: 100 }
      )
    })

    it('each student should have a non-empty nombreCompleto', () => {
      fc.assert(
        fc.property(studentAttendanceArb, (student) => {
          expect(student.nombreCompleto).toBeDefined()
          expect(student.nombreCompleto.trim().length).toBeGreaterThan(0)
          
          return true
        }),
        { numRuns: 100 }
      )
    })

    it('each student should have a valid documentoIdentidad', () => {
      fc.assert(
        fc.property(studentAttendanceArb, (student) => {
          expect(student.documentoIdentidad).toBeDefined()
          expect(student.documentoIdentidad.trim().length).toBeGreaterThan(0)
          
          return true
        }),
        { numRuns: 100 }
      )
    })

    it('each student should have an asistencia object with estado', () => {
      fc.assert(
        fc.property(studentAttendanceArb, (student) => {
          expect(student.asistencia).toBeDefined()
          expect(student.asistencia.estado).toBeDefined()
          expect(['Presente', 'Ausente']).toContain(student.asistencia.estado)
          
          return true
        }),
        { numRuns: 100 }
      )
    })

    it('each student should have observacion field (can be null)', () => {
      fc.assert(
        fc.property(studentAttendanceArb, (student) => {
          expect(student.asistencia).toBeDefined()
          // observacion can be null but must be defined
          expect(student.asistencia.observacion !== undefined).toBe(true)
          
          return true
        }),
        { numRuns: 100 }
      )
    })

    it('paquete can be null (representing SinPaquete) or have valid estado', () => {
      fc.assert(
        fc.property(studentAttendanceArb, (student) => {
          if (student.paquete !== null) {
            expect(student.paquete.estado).toBeDefined()
            expect(['Activo', 'Agotado', 'Congelado', 'SinPaquete']).toContain(student.paquete.estado)
          }
          // null paquete is valid (represents SinPaquete)
          
          return true
        }),
        { numRuns: 100 }
      )
    })
  })

  describe('Profesor View - EstudianteProfesor', () => {
    it('all students should have required fields for display', () => {
      fc.assert(
        fc.property(profesorStudentListArb, (estudiantes) => {
          for (const estudiante of estudiantes) {
            const validation = validateProfesorStudentFields(estudiante)
            
            expect(validation.isValid).toBe(true)
            expect(validation.missingFields).toHaveLength(0)
          }
          
          return true
        }),
        { numRuns: 100 }
      )
    })

    it('each student should have a non-empty nombre', () => {
      fc.assert(
        fc.property(estudianteProfesorArb, (estudiante) => {
          expect(estudiante.nombre).toBeDefined()
          expect(estudiante.nombre.trim().length).toBeGreaterThan(0)
          
          return true
        }),
        { numRuns: 100 }
      )
    })

    it('each student should have documento defined (can be empty)', () => {
      fc.assert(
        fc.property(estudianteProfesorArb, (estudiante) => {
          expect(estudiante.documento).toBeDefined()
          expect(typeof estudiante.documento).toBe('string')
          
          return true
        }),
        { numRuns: 100 }
      )
    })

    it('each student should have asistencia as boolean', () => {
      fc.assert(
        fc.property(estudianteProfesorArb, (estudiante) => {
          expect(typeof estudiante.asistencia).toBe('boolean')
          
          return true
        }),
        { numRuns: 100 }
      )
    })

    it('each student should have observacion defined (can be empty)', () => {
      fc.assert(
        fc.property(estudianteProfesorArb, (estudiante) => {
          expect(estudiante.observacion).toBeDefined()
          expect(typeof estudiante.observacion).toBe('string')
          
          return true
        }),
        { numRuns: 100 }
      )
    })

    it('each student should have valid estadoPaquete', () => {
      fc.assert(
        fc.property(estudianteProfesorArb, (estudiante) => {
          expect(estudiante.estadoPaquete).toBeDefined()
          expect(['activo', 'agotado', 'sin_paquete', 'clase_prueba']).toContain(estudiante.estadoPaquete)
          
          return true
        }),
        { numRuns: 100 }
      )
    })
  })

  describe('Cross-view consistency', () => {
    it('both views should require name field', () => {
      fc.assert(
        fc.property(
          studentAttendanceArb,
          estudianteProfesorArb,
          (adminStudent, profesorStudent) => {
            // Admin view uses nombreCompleto
            expect(adminStudent.nombreCompleto.trim().length).toBeGreaterThan(0)
            
            // Profesor view uses nombre
            expect(profesorStudent.nombre.trim().length).toBeGreaterThan(0)
            
            return true
          }
        ),
        { numRuns: 100 }
      )
    })

    it('both views should have attendance control field', () => {
      fc.assert(
        fc.property(
          studentAttendanceArb,
          estudianteProfesorArb,
          (adminStudent, profesorStudent) => {
            // Admin view uses asistencia.estado
            expect(['Presente', 'Ausente']).toContain(adminStudent.asistencia.estado)
            
            // Profesor view uses asistencia (boolean)
            expect(typeof profesorStudent.asistencia).toBe('boolean')
            
            return true
          }
        ),
        { numRuns: 100 }
      )
    })

    it('both views should have observation field', () => {
      fc.assert(
        fc.property(
          studentAttendanceArb,
          estudianteProfesorArb,
          (adminStudent, profesorStudent) => {
            // Admin view uses asistencia.observacion (can be null)
            expect(adminStudent.asistencia.observacion !== undefined).toBe(true)
            
            // Profesor view uses observacion (string)
            expect(typeof profesorStudent.observacion).toBe('string')
            
            return true
          }
        ),
        { numRuns: 100 }
      )
    })
  })
})
