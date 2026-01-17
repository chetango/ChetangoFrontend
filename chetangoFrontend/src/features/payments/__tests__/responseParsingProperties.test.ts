// ============================================
// PROPERTY-BASED TESTS - PAYMENT RESPONSE PARSING
// ============================================

import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import type {
  MetodoPagoDTO,
  AlumnoDTO,
  TipoPaqueteDTO,
} from '../types/paymentTypes'

// ============================================
// ARBITRARIES FOR GENERATING VALID API DATA
// ============================================

/**
 * Generate valid MetodoPagoDTO objects matching GET /api/pagos/metodos-pago response
 */
const metodoPagoArb: fc.Arbitrary<MetodoPagoDTO> = fc.record({
  idMetodoPago: fc.uuid(),
  nombre: fc.string({ minLength: 1, maxLength: 50 }),
  descripcion: fc.string({ minLength: 0, maxLength: 200 }),
})

/**
 * Generate valid AlumnoDTO objects matching GET /api/alumnos response
 */
const alumnoArb: fc.Arbitrary<AlumnoDTO> = fc.record({
  idAlumno: fc.uuid(),
  nombreCompleto: fc.string({ minLength: 1, maxLength: 100 }),
  documentoIdentidad: fc.stringMatching(/^[0-9A-Za-z]{5,20}$/),
  correo: fc.option(fc.emailAddress(), { nil: undefined }),
})

/**
 * Generate valid TipoPaqueteDTO objects matching GET /api/paquetes/tipos response
 */
const tipoPaqueteArb: fc.Arbitrary<TipoPaqueteDTO> = fc.record({
  id: fc.uuid(),
  nombre: fc.string({ minLength: 1, maxLength: 50 }),
  clasesDisponibles: fc.integer({ min: 1, max: 100 }),
  diasVigencia: fc.integer({ min: 1, max: 365 }),
  precio: fc.float({ min: 0, max: 100000, noNaN: true }),
})

// ============================================
// PARSING FUNCTIONS
// ============================================

/**
 * Parses and validates a MetodoPagoDTO from API response
 * Returns the parsed object if valid, throws if invalid
 */
function parseMetodoPagoDTO(data: unknown): MetodoPagoDTO {
  if (typeof data !== 'object' || data === null) {
    throw new Error('Invalid MetodoPagoDTO: expected object')
  }

  const obj = data as Record<string, unknown>

  if (typeof obj.idMetodoPago !== 'string') {
    throw new Error('Invalid MetodoPagoDTO: idMetodoPago must be a string')
  }
  if (typeof obj.nombre !== 'string') {
    throw new Error('Invalid MetodoPagoDTO: nombre must be a string')
  }
  if (typeof obj.descripcion !== 'string') {
    throw new Error('Invalid MetodoPagoDTO: descripcion must be a string')
  }

  return {
    idMetodoPago: obj.idMetodoPago,
    nombre: obj.nombre,
    descripcion: obj.descripcion,
  }
}

/**
 * Parses and validates an AlumnoDTO from API response
 * Returns the parsed object if valid, throws if invalid
 */
function parseAlumnoDTO(data: unknown): AlumnoDTO {
  if (typeof data !== 'object' || data === null) {
    throw new Error('Invalid AlumnoDTO: expected object')
  }

  const obj = data as Record<string, unknown>

  if (typeof obj.idAlumno !== 'string') {
    throw new Error('Invalid AlumnoDTO: idAlumno must be a string')
  }
  if (typeof obj.nombreCompleto !== 'string') {
    throw new Error('Invalid AlumnoDTO: nombreCompleto must be a string')
  }
  if (typeof obj.documentoIdentidad !== 'string') {
    throw new Error('Invalid AlumnoDTO: documentoIdentidad must be a string')
  }
  if (obj.correo !== undefined && typeof obj.correo !== 'string') {
    throw new Error('Invalid AlumnoDTO: correo must be a string or undefined')
  }

  return {
    idAlumno: obj.idAlumno,
    nombreCompleto: obj.nombreCompleto,
    documentoIdentidad: obj.documentoIdentidad,
    correo: obj.correo as string | undefined,
  }
}

/**
 * Parses and validates a TipoPaqueteDTO from API response
 * Returns the parsed object if valid, throws if invalid
 */
function parseTipoPaqueteDTO(data: unknown): TipoPaqueteDTO {
  if (typeof data !== 'object' || data === null) {
    throw new Error('Invalid TipoPaqueteDTO: expected object')
  }

  const obj = data as Record<string, unknown>

  if (typeof obj.id !== 'string') {
    throw new Error('Invalid TipoPaqueteDTO: id must be a string')
  }
  if (typeof obj.nombre !== 'string') {
    throw new Error('Invalid TipoPaqueteDTO: nombre must be a string')
  }
  if (typeof obj.clasesDisponibles !== 'number') {
    throw new Error('Invalid TipoPaqueteDTO: clasesDisponibles must be a number')
  }
  if (typeof obj.diasVigencia !== 'number') {
    throw new Error('Invalid TipoPaqueteDTO: diasVigencia must be a number')
  }
  if (typeof obj.precio !== 'number') {
    throw new Error('Invalid TipoPaqueteDTO: precio must be a number')
  }

  return {
    id: obj.id,
    nombre: obj.nombre,
    clasesDisponibles: obj.clasesDisponibles,
    diasVigencia: obj.diasVigencia,
    precio: obj.precio,
  }
}

// ============================================
// PROPERTY TESTS
// ============================================

/**
 * **Feature: admin-payments-integration, Property 2: API Response Parsing**
 * **Validates: Requirements 2.2, 2.4, 2.6**
 *
 * *For any* valid response from payment-related APIs:
 * - MetodosPago response SHALL contain objects with `idMetodoPago` (string), `nombre` (string), and `descripcion` (string) fields
 * - TiposPaquete response SHALL contain objects with `id` (string), `nombre` (string), `clasesDisponibles` (number), `diasVigencia` (number), and `precio` (number) fields
 * - Alumnos response SHALL contain objects with `idAlumno` (string), `nombreCompleto` (string), `documentoIdentidad` (string), and optional `correo` (string) fields
 */
describe('Property 2: API Response Parsing', () => {
  describe('MetodosPago Response Parsing (Requirements 2.2)', () => {
    it('should parse valid MetodoPagoDTO with required fields idMetodoPago, nombre, descripcion', () => {
      fc.assert(
        fc.property(metodoPagoArb, (metodoPago) => {
          // Simulate API response by converting to JSON and back
          const jsonString = JSON.stringify(metodoPago)
          const apiResponse = JSON.parse(jsonString)

          const parsed = parseMetodoPagoDTO(apiResponse)

          // Verify idMetodoPago is present and is a string
          expect(parsed.idMetodoPago).toBe(metodoPago.idMetodoPago)
          expect(typeof parsed.idMetodoPago).toBe('string')

          // Verify nombre is present and is a string
          expect(parsed.nombre).toBe(metodoPago.nombre)
          expect(typeof parsed.nombre).toBe('string')

          // Verify descripcion is present and is a string
          expect(parsed.descripcion).toBe(metodoPago.descripcion)
          expect(typeof parsed.descripcion).toBe('string')

          return true
        }),
        { numRuns: 100 }
      )
    })

    it('should parse array of MetodoPagoDTO from API response', () => {
      fc.assert(
        fc.property(fc.array(metodoPagoArb, { minLength: 0, maxLength: 20 }), (metodosPago) => {
          const jsonString = JSON.stringify(metodosPago)
          const apiResponse = JSON.parse(jsonString) as unknown[]

          const parsed = apiResponse.map(parseMetodoPagoDTO)

          expect(parsed).toHaveLength(metodosPago.length)

          for (let i = 0; i < metodosPago.length; i++) {
            expect(parsed[i].idMetodoPago).toBe(metodosPago[i].idMetodoPago)
            expect(parsed[i].nombre).toBe(metodosPago[i].nombre)
            expect(parsed[i].descripcion).toBe(metodosPago[i].descripcion)
          }

          return true
        }),
        { numRuns: 100 }
      )
    })
  })

  describe('TiposPaquete Response Parsing (Requirements 2.4)', () => {
    it('should parse valid TipoPaqueteDTO with all required fields', () => {
      fc.assert(
        fc.property(tipoPaqueteArb, (tipoPaquete) => {
          // Simulate API response by converting to JSON and back
          const jsonString = JSON.stringify(tipoPaquete)
          const apiResponse = JSON.parse(jsonString)

          const parsed = parseTipoPaqueteDTO(apiResponse)

          // Verify id is present and is a string
          expect(parsed.id).toBe(tipoPaquete.id)
          expect(typeof parsed.id).toBe('string')

          // Verify nombre is present and is a string
          expect(parsed.nombre).toBe(tipoPaquete.nombre)
          expect(typeof parsed.nombre).toBe('string')

          // Verify clasesDisponibles is present and is a number
          expect(parsed.clasesDisponibles).toBe(tipoPaquete.clasesDisponibles)
          expect(typeof parsed.clasesDisponibles).toBe('number')

          // Verify diasVigencia is present and is a number
          expect(parsed.diasVigencia).toBe(tipoPaquete.diasVigencia)
          expect(typeof parsed.diasVigencia).toBe('number')

          // Verify precio is present and is a number
          expect(parsed.precio).toBe(tipoPaquete.precio)
          expect(typeof parsed.precio).toBe('number')

          return true
        }),
        { numRuns: 100 }
      )
    })

    it('should parse array of TipoPaqueteDTO from API response', () => {
      fc.assert(
        fc.property(fc.array(tipoPaqueteArb, { minLength: 0, maxLength: 20 }), (tiposPaquete) => {
          const jsonString = JSON.stringify(tiposPaquete)
          const apiResponse = JSON.parse(jsonString) as unknown[]

          const parsed = apiResponse.map(parseTipoPaqueteDTO)

          expect(parsed).toHaveLength(tiposPaquete.length)

          for (let i = 0; i < tiposPaquete.length; i++) {
            expect(parsed[i].id).toBe(tiposPaquete[i].id)
            expect(parsed[i].nombre).toBe(tiposPaquete[i].nombre)
            expect(parsed[i].clasesDisponibles).toBe(tiposPaquete[i].clasesDisponibles)
            expect(parsed[i].diasVigencia).toBe(tiposPaquete[i].diasVigencia)
            expect(parsed[i].precio).toBe(tiposPaquete[i].precio)
          }

          return true
        }),
        { numRuns: 100 }
      )
    })

    it('should preserve numeric precision for precio field', () => {
      fc.assert(
        fc.property(tipoPaqueteArb, (tipoPaquete) => {
          const jsonString = JSON.stringify(tipoPaquete)
          const apiResponse = JSON.parse(jsonString)

          const parsed = parseTipoPaqueteDTO(apiResponse)

          // Verify precio maintains numeric type after JSON round-trip
          expect(typeof parsed.precio).toBe('number')
          expect(Number.isFinite(parsed.precio)).toBe(true)

          return true
        }),
        { numRuns: 100 }
      )
    })
  })

  describe('Alumnos Response Parsing (Requirements 2.6)', () => {
    it('should parse valid AlumnoDTO with required fields idAlumno, nombreCompleto, documentoIdentidad', () => {
      fc.assert(
        fc.property(alumnoArb, (alumno) => {
          // Simulate API response by converting to JSON and back
          const jsonString = JSON.stringify(alumno)
          const apiResponse = JSON.parse(jsonString)

          const parsed = parseAlumnoDTO(apiResponse)

          // Verify idAlumno is present and is a string
          expect(parsed.idAlumno).toBe(alumno.idAlumno)
          expect(typeof parsed.idAlumno).toBe('string')

          // Verify nombreCompleto is present and is a string
          expect(parsed.nombreCompleto).toBe(alumno.nombreCompleto)
          expect(typeof parsed.nombreCompleto).toBe('string')

          // Verify documentoIdentidad is present and is a string
          expect(parsed.documentoIdentidad).toBe(alumno.documentoIdentidad)
          expect(typeof parsed.documentoIdentidad).toBe('string')

          return true
        }),
        { numRuns: 100 }
      )
    })

    it('should preserve optional correo field when present', () => {
      fc.assert(
        fc.property(alumnoArb, (alumno) => {
          const jsonString = JSON.stringify(alumno)
          const apiResponse = JSON.parse(jsonString)

          const parsed = parseAlumnoDTO(apiResponse)

          if (alumno.correo !== undefined) {
            expect(parsed.correo).toBe(alumno.correo)
            expect(typeof parsed.correo).toBe('string')
          } else {
            expect(parsed.correo).toBeUndefined()
          }

          return true
        }),
        { numRuns: 100 }
      )
    })

    it('should parse array of AlumnoDTO from API response', () => {
      fc.assert(
        fc.property(fc.array(alumnoArb, { minLength: 0, maxLength: 50 }), (alumnos) => {
          const jsonString = JSON.stringify(alumnos)
          const apiResponse = JSON.parse(jsonString) as unknown[]

          const parsed = apiResponse.map(parseAlumnoDTO)

          expect(parsed).toHaveLength(alumnos.length)

          for (let i = 0; i < alumnos.length; i++) {
            expect(parsed[i].idAlumno).toBe(alumnos[i].idAlumno)
            expect(parsed[i].nombreCompleto).toBe(alumnos[i].nombreCompleto)
            expect(parsed[i].documentoIdentidad).toBe(alumnos[i].documentoIdentidad)
          }

          return true
        }),
        { numRuns: 100 }
      )
    })
  })
})
