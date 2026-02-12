// ============================================
// PROPERTY-BASED TESTS - API DATA TRANSFORMATION
// ============================================

import * as fc from 'fast-check'
import { describe, expect, it } from 'vitest'
import type {
    AttendanceSummaryResponse,
    ClassesByDateResponse,
    DateRangeResponse,
    PackageState,
    RegisterAttendanceRequest,
    UpdateAttendanceRequest,
} from '../types/attendanceTypes'
import {
    serializeRegisterAttendanceRequest,
    serializeUpdateAttendanceRequest,
    transformAttendanceSummaryResponse,
    transformClassesByDateResponse,
    transformDateRangeResponse,
} from '../utils/attendanceUtils'

// ============================================
// ARBITRARIES FOR GENERATING VALID API DATA
// ============================================

// Generate valid YYYY-MM-DD date strings
const dateStringArb = fc
  .tuple(
    fc.integer({ min: 2020, max: 2030 }),
    fc.integer({ min: 1, max: 12 }),
    fc.integer({ min: 1, max: 28 }) // Use 28 to avoid invalid dates like Feb 30
  )
  .map(([year, month, day]) => {
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  })

// Generate valid HH:mm:ss time strings
const timeStringArb = fc
  .tuple(
    fc.integer({ min: 0, max: 23 }),
    fc.integer({ min: 0, max: 59 }),
    fc.integer({ min: 0, max: 59 })
  )
  .map(([h, m, s]) => {
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  })

const packageStateArb: fc.Arbitrary<PackageState> = fc.constantFrom(
  'Activo',
  'Agotado',
  'Congelado',
  'SinPaquete'
)

const attendanceStateArb = fc.constantFrom('Presente' as const, 'Ausente' as const)

// Generate valid DateRangeResponse
const dateRangeResponseArb: fc.Arbitrary<DateRangeResponse> = fc
  .tuple(dateStringArb, dateStringArb, dateStringArb, fc.array(dateStringArb, { minLength: 0, maxLength: 7 }))
  .map(([hoy, desde, hasta, diasConClases]) => ({
    hoy,
    desde,
    hasta,
    diasConClases,
  }))

// Generate valid ClassInfo
const classInfoArb = fc.record({
  idClase: fc.uuid(),
  nombre: fc.string({ minLength: 1, maxLength: 50 }),
  horaInicio: timeStringArb,
  horaFin: timeStringArb,
  profesorPrincipal: fc.string({ minLength: 1, maxLength: 50 }),
})

// Generate valid ClassesByDateResponse
const classesByDateResponseArb: fc.Arbitrary<ClassesByDateResponse> = fc.record({
  fecha: dateStringArb,
  clases: fc.array(classInfoArb, { minLength: 0, maxLength: 10 }),
})

// Generate valid StudentPackage
const studentPackageArb = fc.record({
  idPaquete: fc.option(fc.uuid(), { nil: null }),
  estado: packageStateArb,
  descripcion: fc.option(fc.string({ minLength: 1, maxLength: 30 }), { nil: null }),
  clasesTotales: fc.option(fc.integer({ min: 1, max: 20 }), { nil: null }),
  clasesUsadas: fc.option(fc.integer({ min: 0, max: 20 }), { nil: null }),
  clasesRestantes: fc.option(fc.integer({ min: 0, max: 20 }), { nil: null }),
  esCompartido: fc.boolean(),
  idsAlumnosCompartidos: fc.option(fc.array(fc.uuid(), { minLength: 0, maxLength: 3 }), { nil: null }),
  nombresAlumnosCompartidos: fc.option(fc.array(fc.string({ minLength: 1, maxLength: 30 }), { minLength: 0, maxLength: 3 }), { nil: null }),
})

// Generate valid AttendanceRecord (formerly AttendanceStatus)
const attendanceStatusArb = fc.record({
  idAsistencia: fc.option(fc.uuid(), { nil: null }),
  estado: attendanceStateArb,
  observacion: fc.option(fc.string({ minLength: 0, maxLength: 100 }), { nil: null }),
})

// Generate valid StudentAttendance
const studentAttendanceArb = fc.record({
  idAlumno: fc.uuid(),
  nombreCompleto: fc.string({ minLength: 1, maxLength: 50 }),
  documentoIdentidad: fc.stringMatching(/^[0-9]{6,12}$/),
  avatarIniciales: fc.string({ minLength: 2, maxLength: 2 }),
  paquete: fc.option(studentPackageArb, { nil: null }),
  asistencia: attendanceStatusArb,
})

// Generate valid AttendanceSummaryResponse
const attendanceSummaryResponseArb: fc.Arbitrary<AttendanceSummaryResponse> = fc
  .tuple(
    fc.uuid(),
    dateStringArb,
    fc.string({ minLength: 1, maxLength: 50 }),
    fc.string({ minLength: 1, maxLength: 50 }),
    fc.array(studentAttendanceArb, { minLength: 0, maxLength: 20 })
  )
  .map(([idClase, fecha, nombreClase, profesorPrincipal, alumnos]) => {
    const presentes = alumnos.filter((a) => a.asistencia.estado === 'Presente').length
    const ausentes = alumnos.filter((a) => a.asistencia.estado === 'Ausente').length
    const sinPaquete = alumnos.filter((a) => !a.paquete || a.paquete.estado === 'SinPaquete').length

    return {
      idClase,
      fecha,
      nombreClase,
      profesorPrincipal,
      alumnos,
      presentes,
      ausentes,
      sinPaquete,
    }
  })

// Generate valid UpdateAttendanceRequest (new format with idAsistencia and presente)
const updateAttendanceRequestArb: fc.Arbitrary<UpdateAttendanceRequest> = fc.record({
  idAsistencia: fc.uuid(),
  presente: fc.boolean(),
  observacion: fc.option(fc.string({ minLength: 0, maxLength: 100 }), { nil: undefined }),
})

// Generate valid RegisterAttendanceRequest
const registerAttendanceRequestArb: fc.Arbitrary<RegisterAttendanceRequest> = fc.record({
  idClase: fc.uuid(),
  idAlumno: fc.uuid(),
  presente: fc.boolean(),
  observacion: fc.option(fc.string({ minLength: 0, maxLength: 100 }), { nil: undefined }),
})

/**
 * **Feature: admin-attendance-integration, Property 9: Update Mutation Request Format**
 * **Validates: Requirements 6.1, 6.2, 8.1**
 *
 * *For any* attendance update (toggle or observation change), the mutation SHALL call
 * `PUT /api/asistencias/{idAsistencia}/estado` with a body containing `idAsistencia` (string),
 * `presente` (boolean), and optionally `observacion` (string).
 */
describe('Property 9: Update Mutation Request Format', () => {
  it('should serialize UpdateAttendanceRequest with required fields idAsistencia and presente', () => {
    fc.assert(
      fc.property(updateAttendanceRequestArb, (request) => {
        const serialized = serializeUpdateAttendanceRequest(request)

        // Verify idAsistencia is always present and is a string (UUID)
        expect(serialized.idAsistencia).toBe(request.idAsistencia)
        expect(typeof serialized.idAsistencia).toBe('string')

        // Verify presente is always present and is a boolean
        expect(serialized.presente).toBe(request.presente)
        expect(typeof serialized.presente).toBe('boolean')

        return true
      }),
      { numRuns: 100 }
    )
  })

  it('should include observacion only when provided', () => {
    fc.assert(
      fc.property(updateAttendanceRequestArb, (request) => {
        const serialized = serializeUpdateAttendanceRequest(request)

        if (request.observacion !== undefined) {
          expect(serialized.observacion).toBe(request.observacion)
          expect(typeof serialized.observacion).toBe('string')
        } else {
          expect(serialized).not.toHaveProperty('observacion')
        }

        return true
      }),
      { numRuns: 100 }
    )
  })

  it('should produce JSON-serializable output matching API contract', () => {
    fc.assert(
      fc.property(updateAttendanceRequestArb, (request) => {
        const serialized = serializeUpdateAttendanceRequest(request)

        // Verify the serialized object can be JSON stringified and parsed
        const jsonString = JSON.stringify(serialized)
        const parsed = JSON.parse(jsonString)

        // Verify the parsed object matches the original request
        expect(parsed.idAsistencia).toBe(request.idAsistencia)
        expect(parsed.presente).toBe(request.presente)

        if (request.observacion !== undefined) {
          expect(parsed.observacion).toBe(request.observacion)
        }

        // Verify no extra fields are present
        const expectedKeys = ['idAsistencia', 'presente']
        if (request.observacion !== undefined) {
          expectedKeys.push('observacion')
        }
        expect(Object.keys(parsed).sort()).toEqual(expectedKeys.sort())

        return true
      }),
      { numRuns: 100 }
    )
  })
})

/**
 * **Feature: admin-attendance-correction, Property 10: API data transformation**
 * **Validates: Requirements 10.4, 10.5**
 *
 * *For any* valid API response, parsing and transforming to frontend types
 * SHALL preserve all data fields without loss.
 */
describe('Property 10: API data transformation', () => {
  describe('DateRangeResponse transformation', () => {
    it('should preserve all fields when transforming valid DateRangeResponse', () => {
      fc.assert(
        fc.property(dateRangeResponseArb, (original) => {
          const transformed = transformDateRangeResponse(original)

          expect(transformed.hoy).toBe(original.hoy)
          expect(transformed.desde).toBe(original.desde)
          expect(transformed.hasta).toBe(original.hasta)
          expect(transformed.diasConClases).toEqual(original.diasConClases)

          return true
        }),
        { numRuns: 100 }
      )
    })
  })

  describe('ClassesByDateResponse transformation', () => {
    it('should preserve all fields when transforming valid ClassesByDateResponse', () => {
      fc.assert(
        fc.property(classesByDateResponseArb, (original) => {
          const transformed = transformClassesByDateResponse(original)

          expect(transformed.fecha).toBe(original.fecha)
          expect(transformed.clases).toHaveLength(original.clases.length)

          for (let i = 0; i < original.clases.length; i++) {
            expect(transformed.clases[i].idClase).toBe(original.clases[i].idClase)
            expect(transformed.clases[i].nombre).toBe(original.clases[i].nombre)
            expect(transformed.clases[i].horaInicio).toBe(original.clases[i].horaInicio)
            expect(transformed.clases[i].horaFin).toBe(original.clases[i].horaFin)
            expect(transformed.clases[i].profesorPrincipal).toBe(original.clases[i].profesorPrincipal)
          }

          return true
        }),
        { numRuns: 100 }
      )
    })
  })

  describe('AttendanceSummaryResponse transformation', () => {
    it('should preserve all fields when transforming valid AttendanceSummaryResponse', () => {
      fc.assert(
        fc.property(attendanceSummaryResponseArb, (original) => {
          const transformed = transformAttendanceSummaryResponse(original)

          expect(transformed.idClase).toBe(original.idClase)
          expect(transformed.fecha).toBe(original.fecha)
          expect(transformed.nombreClase).toBe(original.nombreClase)
          expect(transformed.profesorPrincipal).toBe(original.profesorPrincipal)
          expect(transformed.presentes).toBe(original.presentes)
          expect(transformed.ausentes).toBe(original.ausentes)
          expect(transformed.sinPaquete).toBe(original.sinPaquete)
          expect(transformed.alumnos).toHaveLength(original.alumnos.length)

          for (let i = 0; i < original.alumnos.length; i++) {
            const origStudent = original.alumnos[i]
            const transStudent = transformed.alumnos[i]

            expect(transStudent.idAlumno).toBe(origStudent.idAlumno)
            expect(transStudent.nombreCompleto).toBe(origStudent.nombreCompleto)
            expect(transStudent.documentoIdentidad).toBe(origStudent.documentoIdentidad)
            expect(transStudent.avatarIniciales).toBe(origStudent.avatarIniciales)
            expect(transStudent.asistencia.idAsistencia).toBe(origStudent.asistencia.idAsistencia)
            expect(transStudent.asistencia.estado).toBe(origStudent.asistencia.estado)
            expect(transStudent.asistencia.observacion).toBe(origStudent.asistencia.observacion)

            if (origStudent.paquete) {
              expect(transStudent.paquete).not.toBeNull()
              expect(transStudent.paquete?.estado).toBe(origStudent.paquete.estado)
              expect(transStudent.paquete?.descripcion).toBe(origStudent.paquete.descripcion)
              expect(transStudent.paquete?.clasesTotales).toBe(origStudent.paquete.clasesTotales)
              expect(transStudent.paquete?.clasesUsadas).toBe(origStudent.paquete.clasesUsadas)
              expect(transStudent.paquete?.clasesRestantes).toBe(origStudent.paquete.clasesRestantes)
            } else {
              expect(transStudent.paquete).toBeNull()
            }
          }

          return true
        }),
        { numRuns: 100 }
      )
    })
  })

  describe('UpdateAttendanceRequest serialization', () => {
    it('should produce valid JSON matching API contract', () => {
      fc.assert(
        fc.property(updateAttendanceRequestArb, (original) => {
          const serialized = serializeUpdateAttendanceRequest(original)

          // Verify idAsistencia is always present
          expect(serialized.idAsistencia).toBe(original.idAsistencia)

          // Verify presente is always present and is a boolean
          expect(serialized.presente).toBe(original.presente)
          expect(typeof serialized.presente).toBe('boolean')

          // Verify observacion is present only when defined
          if (original.observacion !== undefined) {
            expect(serialized.observacion).toBe(original.observacion)
          } else {
            expect(serialized).not.toHaveProperty('observacion')
          }

          // Verify the serialized object can be JSON stringified
          const jsonString = JSON.stringify(serialized)
          const parsed = JSON.parse(jsonString)
          expect(parsed.idAsistencia).toBe(original.idAsistencia)
          expect(parsed.presente).toBe(original.presente)

          return true
        }),
        { numRuns: 100 }
      )
    })
  })
})

/**
 * **Feature: admin-attendance-integration, Property 10: Register Mutation Request Format**
 * **Validates: Requirements 7.2**
 *
 * *For any* new attendance registration, the mutation SHALL call `POST /api/asistencias`
 * with a body containing `idClase`, `idAlumno`, `presente` (boolean), and optionally `observacion`.
 */
describe('Property 10: Register Mutation Request Format', () => {
  it('should serialize RegisterAttendanceRequest with required fields idClase, idAlumno, and presente', () => {
    fc.assert(
      fc.property(registerAttendanceRequestArb, (request) => {
        const serialized = serializeRegisterAttendanceRequest(request)

        // Verify idClase is always present and is a string (UUID)
        expect(serialized.idClase).toBe(request.idClase)
        expect(typeof serialized.idClase).toBe('string')

        // Verify idAlumno is always present and is a string (UUID)
        expect(serialized.idAlumno).toBe(request.idAlumno)
        expect(typeof serialized.idAlumno).toBe('string')

        // Verify presente is always present and is a boolean
        expect(serialized.presente).toBe(request.presente)
        expect(typeof serialized.presente).toBe('boolean')

        return true
      }),
      { numRuns: 100 }
    )
  })

  it('should include observacion only when provided', () => {
    fc.assert(
      fc.property(registerAttendanceRequestArb, (request) => {
        const serialized = serializeRegisterAttendanceRequest(request)

        if (request.observacion !== undefined) {
          expect(serialized.observacion).toBe(request.observacion)
          expect(typeof serialized.observacion).toBe('string')
        } else {
          expect(serialized).not.toHaveProperty('observacion')
        }

        return true
      }),
      { numRuns: 100 }
    )
  })

  it('should produce JSON-serializable output matching API contract for POST /api/asistencias', () => {
    fc.assert(
      fc.property(registerAttendanceRequestArb, (request) => {
        const serialized = serializeRegisterAttendanceRequest(request)

        // Verify the serialized object can be JSON stringified and parsed
        const jsonString = JSON.stringify(serialized)
        const parsed = JSON.parse(jsonString)

        // Verify the parsed object matches the original request
        expect(parsed.idClase).toBe(request.idClase)
        expect(parsed.idAlumno).toBe(request.idAlumno)
        expect(parsed.presente).toBe(request.presente)

        if (request.observacion !== undefined) {
          expect(parsed.observacion).toBe(request.observacion)
        }

        // Verify no extra fields are present
        const expectedKeys = ['idClase', 'idAlumno', 'presente']
        if (request.observacion !== undefined) {
          expectedKeys.push('observacion')
        }
        expect(Object.keys(parsed).sort()).toEqual(expectedKeys.sort())

        return true
      }),
      { numRuns: 100 }
    )
  })
})
