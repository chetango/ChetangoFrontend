// ============================================
// PROPERTY-BASED TESTS - PAYMENT RESPONSE PARSING
// ============================================

import * as fc from 'fast-check'
import { describe, expect, it } from 'vitest'
import type {
    AlumnoDTO,
    MetodoPagoDTO,
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
  idUsuario: fc.uuid(),
  nombre: fc.string({ minLength: 1, maxLength: 100 }),
  correo: fc.emailAddress(),
  numeroDocumento: fc.option(fc.stringMatching(/^[0-9A-Za-z]{5,20}$/), { nil: undefined }),
  telefono: fc.option(fc.string({ minLength: 7, maxLength: 15 }), { nil: undefined }),
})

/**
 * Generate valid TipoPaqueteDTO objects matching GET /api/paquetes/tipos response
 */
const tipoPaqueteArb: fc.Arbitrary<TipoPaqueteDTO> = fc.record({
  idTipoPaquete: fc.uuid(),
  nombre: fc.string({ minLength: 1, maxLength: 50 }),
  numeroClases: fc.integer({ min: 1, max: 100 }),
  diasVigencia: fc.integer({ min: 1, max: 365 }),
  precio: fc.float({ min: 0, max: 100000, noNaN: true }),
  descripcion: fc.option(fc.string({ minLength: 0, maxLength: 200 }), { nil: undefined }),
  activo: fc.boolean(),
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
  if (typeof obj.idUsuario !== 'string') {
    throw new Error('Invalid AlumnoDTO: idUsuario must be a string')
  }
  if (typeof obj.nombre !== 'string') {
    throw new Error('Invalid AlumnoDTO: nombre must be a string')
  }
  if (typeof obj.correo !== 'string') {
    throw new Error('Invalid AlumnoDTO: correo must be a string')
  }
  if (obj.numeroDocumento !== undefined && typeof obj.numeroDocumento !== 'string') {
    throw new Error('Invalid AlumnoDTO: numeroDocumento must be a string or undefined')
  }
  if (obj.telefono !== undefined && typeof obj.telefono !== 'string') {
    throw new Error('Invalid AlumnoDTO: telefono must be a string or undefined')
  }

  return {
    idAlumno: obj.idAlumno,
    idUsuario: obj.idUsuario,
    nombre: obj.nombre,
    correo: obj.correo,
    numeroDocumento: obj.numeroDocumento as string | undefined,
    telefono: obj.telefono as string | undefined,
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

  if (typeof obj.idTipoPaquete !== 'string') {
    throw new Error('Invalid TipoPaqueteDTO: idTipoPaquete must be a string')
  }
  if (typeof obj.nombre !== 'string') {
    throw new Error('Invalid TipoPaqueteDTO: nombre must be a string')
  }
  if (typeof obj.numeroClases !== 'number') {
    throw new Error('Invalid TipoPaqueteDTO: numeroClases must be a number')
  }
  if (typeof obj.diasVigencia !== 'number') {
    throw new Error('Invalid TipoPaqueteDTO: diasVigencia must be a number')
  }
  if (typeof obj.precio !== 'number') {
    throw new Error('Invalid TipoPaqueteDTO: precio must be a number')
  }
  if (typeof obj.activo !== 'boolean') {
    throw new Error('Invalid TipoPaqueteDTO: activo must be a boolean')
  }
  if (obj.descripcion !== undefined && typeof obj.descripcion !== 'string') {
    throw new Error('Invalid TipoPaqueteDTO: descripcion must be a string or undefined')
  }

  return {
    idTipoPaquete: obj.idTipoPaquete,
    nombre: obj.nombre,
    numeroClases: obj.numeroClases,
    diasVigencia: obj.diasVigencia,
    precio: obj.precio,
    descripcion: obj.descripcion as string | undefined,
    activo: obj.activo,
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

          // Verify idTipoPaquete is present and is a string
          expect(parsed.idTipoPaquete).toBe(tipoPaquete.idTipoPaquete)
          expect(typeof parsed.idTipoPaquete).toBe('string')

          // Verify nombre is present and is a string
          expect(parsed.nombre).toBe(tipoPaquete.nombre)
          expect(typeof parsed.nombre).toBe('string')

          // Verify numeroClases is present and is a number
          expect(parsed.numeroClases).toBe(tipoPaquete.numeroClases)
          expect(typeof parsed.numeroClases).toBe('number')

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
            expect(parsed[i].idTipoPaquete).toBe(tiposPaquete[i].idTipoPaquete)
            expect(parsed[i].nombre).toBe(tiposPaquete[i].nombre)
            expect(parsed[i].numeroClases).toBe(tiposPaquete[i].numeroClases)
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
    it('should parse valid AlumnoDTO with required fields idAlumno, idUsuario, nombre, correo', () => {
      fc.assert(
        fc.property(alumnoArb, (alumno) => {
          // Simulate API response by converting to JSON and back
          const jsonString = JSON.stringify(alumno)
          const apiResponse = JSON.parse(jsonString)

          const parsed = parseAlumnoDTO(apiResponse)

          // Verify idAlumno is present and is a string
          expect(parsed.idAlumno).toBe(alumno.idAlumno)
          expect(typeof parsed.idAlumno).toBe('string')

          // Verify idUsuario is present and is a string
          expect(parsed.idUsuario).toBe(alumno.idUsuario)
          expect(typeof parsed.idUsuario).toBe('string')

          // Verify nombre is present and is a string
          expect(parsed.nombre).toBe(alumno.nombre)
          expect(typeof parsed.nombre).toBe('string')

          // Verify correo is present and is a string
          expect(parsed.correo).toBe(alumno.correo)
          expect(typeof parsed.correo).toBe('string')

          return true
        }),
        { numRuns: 100 }
      )
    })

    it('should preserve optional numeroDocumento and telefono fields when present', () => {
      fc.assert(
        fc.property(alumnoArb, (alumno) => {
          const jsonString = JSON.stringify(alumno)
          const apiResponse = JSON.parse(jsonString)

          const parsed = parseAlumnoDTO(apiResponse)

          if (alumno.numeroDocumento !== undefined) {
            expect(parsed.numeroDocumento).toBe(alumno.numeroDocumento)
            expect(typeof parsed.numeroDocumento).toBe('string')
          } else {
            expect(parsed.numeroDocumento).toBeUndefined()
          }

          if (alumno.telefono !== undefined) {
            expect(parsed.telefono).toBe(alumno.telefono)
            expect(typeof parsed.telefono).toBe('string')
          } else {
            expect(parsed.telefono).toBeUndefined()
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
            expect(parsed[i].idUsuario).toBe(alumnos[i].idUsuario)
            expect(parsed[i].nombre).toBe(alumnos[i].nombre)
            expect(parsed[i].correo).toBe(alumnos[i].correo)
          }

          return true
        }),
        { numRuns: 100 }
      )
    })
  })
})
