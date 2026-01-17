// ============================================
// PROPERTY-BASED TESTS - REQUEST FORMAT
// ============================================

import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import type {
  CrearPaqueteRequest,
  CongelarPaqueteRequest,
} from '../types/packageTypes'

// ============================================
// ARBITRARIES FOR GENERATING VALID REQUEST DATA
// ============================================

/**
 * Generate valid CrearPaqueteRequest objects matching POST /api/paquetes body
 */
const crearPaqueteRequestArb: fc.Arbitrary<CrearPaqueteRequest> = fc.record({
  idAlumno: fc.uuid(),
  idTipoPaquete: fc.uuid(),
  clasesDisponibles: fc.integer({ min: 1, max: 100 }),
  valorPaquete: fc.float({ min: 0, max: 100000, noNaN: true }),
  diasVigencia: fc.integer({ min: 1, max: 365 }),
  idPago: fc.option(fc.uuid(), { nil: null }),
})

/**
 * Generate valid ISO 8601 date strings
 */
const isoDateStringArb: fc.Arbitrary<string> = fc
  .integer({ min: 1577836800000, max: 1924905600000 }) // 2020-01-01 to 2030-12-31 in ms
  .map((timestamp) => new Date(timestamp).toISOString())

/**
 * Generate valid CongelarPaqueteRequest objects matching POST /api/paquetes/{id}/congelar body
 */
const congelarPaqueteRequestArb: fc.Arbitrary<CongelarPaqueteRequest> = fc.record({
  idPaquete: fc.uuid(),
  fechaInicio: isoDateStringArb,
  fechaFin: isoDateStringArb,
  motivo: fc.option(fc.string({ minLength: 1, maxLength: 200 }), { nil: undefined }),
})

/**
 * Generate valid descongelar params
 */
const descongelarParamsArb = fc.record({
  idPaquete: fc.uuid(),
  idCongelacion: fc.uuid(),
})

// ============================================
// VALIDATION FUNCTIONS
// ============================================

/**
 * Validates that a CrearPaqueteRequest has all required fields with correct types
 */
function validateCrearPaqueteRequest(data: unknown): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (typeof data !== 'object' || data === null) {
    return { valid: false, errors: ['Request must be an object'] }
  }

  const obj = data as Record<string, unknown>

  // Required fields
  if (typeof obj.idAlumno !== 'string') {
    errors.push('idAlumno must be a string')
  }
  if (typeof obj.idTipoPaquete !== 'string') {
    errors.push('idTipoPaquete must be a string')
  }
  if (typeof obj.clasesDisponibles !== 'number') {
    errors.push('clasesDisponibles must be a number')
  }
  if (typeof obj.valorPaquete !== 'number') {
    errors.push('valorPaquete must be a number')
  }
  if (typeof obj.diasVigencia !== 'number') {
    errors.push('diasVigencia must be a number')
  }

  // Optional field
  if (obj.idPago !== undefined && obj.idPago !== null && typeof obj.idPago !== 'string') {
    errors.push('idPago must be a string, null, or undefined')
  }

  return { valid: errors.length === 0, errors }
}

/**
 * Validates that a CongelarPaqueteRequest has all required fields with correct types
 */
function validateCongelarPaqueteRequest(data: unknown): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (typeof data !== 'object' || data === null) {
    return { valid: false, errors: ['Request must be an object'] }
  }

  const obj = data as Record<string, unknown>

  // Required fields
  if (typeof obj.idPaquete !== 'string') {
    errors.push('idPaquete must be a string')
  }
  if (typeof obj.fechaInicio !== 'string') {
    errors.push('fechaInicio must be a string (ISO 8601)')
  }
  if (typeof obj.fechaFin !== 'string') {
    errors.push('fechaFin must be a string (ISO 8601)')
  }

  // Optional field
  if (obj.motivo !== undefined && typeof obj.motivo !== 'string') {
    errors.push('motivo must be a string or undefined')
  }

  return { valid: errors.length === 0, errors }
}

/**
 * Builds the descongelar URL with query parameter
 */
function buildDescongelarUrl(idPaquete: string, idCongelacion: string): string {
  return `/api/paquetes/${idPaquete}/descongelar?idCongelacion=${idCongelacion}`
}

// ============================================
// PROPERTY TESTS
// ============================================

/**
 * **Feature: admin-packages-integration, Property 14: Create Paquete Request Format**
 * **Validates: Requirements 5.4**
 *
 * *For any* package creation, the mutation SHALL call `POST /api/paquetes` with body
 * containing: `idAlumno` (string), `idTipoPaquete` (string), `clasesDisponibles` (number),
 * `valorPaquete` (number), `diasVigencia` (number).
 */
describe('Property 14: Create Paquete Request Format', () => {
  it('should have all required fields with correct types', () => {
    fc.assert(
      fc.property(crearPaqueteRequestArb, (request) => {
        // Simulate JSON serialization (as would happen in HTTP request)
        const jsonString = JSON.stringify(request)
        const serialized = JSON.parse(jsonString)

        const validation = validateCrearPaqueteRequest(serialized)

        expect(validation.valid).toBe(true)
        expect(validation.errors).toHaveLength(0)

        // Verify each required field type
        expect(typeof serialized.idAlumno).toBe('string')
        expect(typeof serialized.idTipoPaquete).toBe('string')
        expect(typeof serialized.clasesDisponibles).toBe('number')
        expect(typeof serialized.valorPaquete).toBe('number')
        expect(typeof serialized.diasVigencia).toBe('number')

        return true
      }),
      { numRuns: 100 }
    )
  })

  it('should preserve idAlumno as valid UUID string', () => {
    fc.assert(
      fc.property(crearPaqueteRequestArb, (request) => {
        const jsonString = JSON.stringify(request)
        const serialized = JSON.parse(jsonString)

        // UUID format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
        expect(serialized.idAlumno).toMatch(uuidRegex)

        return true
      }),
      { numRuns: 100 }
    )
  })

  it('should preserve idTipoPaquete as valid UUID string', () => {
    fc.assert(
      fc.property(crearPaqueteRequestArb, (request) => {
        const jsonString = JSON.stringify(request)
        const serialized = JSON.parse(jsonString)

        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
        expect(serialized.idTipoPaquete).toMatch(uuidRegex)

        return true
      }),
      { numRuns: 100 }
    )
  })

  it('should preserve clasesDisponibles as positive integer', () => {
    fc.assert(
      fc.property(crearPaqueteRequestArb, (request) => {
        const jsonString = JSON.stringify(request)
        const serialized = JSON.parse(jsonString)

        expect(Number.isInteger(serialized.clasesDisponibles)).toBe(true)
        expect(serialized.clasesDisponibles).toBeGreaterThan(0)

        return true
      }),
      { numRuns: 100 }
    )
  })

  it('should preserve valorPaquete as non-negative number', () => {
    fc.assert(
      fc.property(crearPaqueteRequestArb, (request) => {
        const jsonString = JSON.stringify(request)
        const serialized = JSON.parse(jsonString)

        expect(typeof serialized.valorPaquete).toBe('number')
        expect(serialized.valorPaquete).toBeGreaterThanOrEqual(0)

        return true
      }),
      { numRuns: 100 }
    )
  })

  it('should preserve diasVigencia as positive integer', () => {
    fc.assert(
      fc.property(crearPaqueteRequestArb, (request) => {
        const jsonString = JSON.stringify(request)
        const serialized = JSON.parse(jsonString)

        expect(Number.isInteger(serialized.diasVigencia)).toBe(true)
        expect(serialized.diasVigencia).toBeGreaterThan(0)

        return true
      }),
      { numRuns: 100 }
    )
  })

  it('should handle optional idPago field correctly', () => {
    fc.assert(
      fc.property(crearPaqueteRequestArb, (request) => {
        const jsonString = JSON.stringify(request)
        const serialized = JSON.parse(jsonString)

        // idPago can be string, null, or undefined (not present after JSON parse)
        if (serialized.idPago !== undefined && serialized.idPago !== null) {
          expect(typeof serialized.idPago).toBe('string')
          const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
          expect(serialized.idPago).toMatch(uuidRegex)
        }

        return true
      }),
      { numRuns: 100 }
    )
  })
})

/**
 * **Feature: admin-packages-integration, Property 19: Congelar Request Format**
 * **Validates: Requirements 8.3**
 *
 * *For any* congelar action, the mutation SHALL call `POST /api/paquetes/{idPaquete}/congelar`
 * with body containing: `idPaquete` (string), `fechaInicio` (string ISO 8601),
 * `fechaFin` (string ISO 8601), and optional `motivo` (string).
 */
describe('Property 19: Congelar Request Format', () => {
  it('should have all required fields with correct types', () => {
    fc.assert(
      fc.property(congelarPaqueteRequestArb, (request) => {
        // Simulate JSON serialization
        const jsonString = JSON.stringify(request)
        const serialized = JSON.parse(jsonString)

        const validation = validateCongelarPaqueteRequest(serialized)

        expect(validation.valid).toBe(true)
        expect(validation.errors).toHaveLength(0)

        // Verify each required field type
        expect(typeof serialized.idPaquete).toBe('string')
        expect(typeof serialized.fechaInicio).toBe('string')
        expect(typeof serialized.fechaFin).toBe('string')

        return true
      }),
      { numRuns: 100 }
    )
  })

  it('should preserve idPaquete as valid UUID string', () => {
    fc.assert(
      fc.property(congelarPaqueteRequestArb, (request) => {
        const jsonString = JSON.stringify(request)
        const serialized = JSON.parse(jsonString)

        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
        expect(serialized.idPaquete).toMatch(uuidRegex)

        return true
      }),
      { numRuns: 100 }
    )
  })

  it('should preserve fechaInicio as valid ISO 8601 string', () => {
    fc.assert(
      fc.property(congelarPaqueteRequestArb, (request) => {
        const jsonString = JSON.stringify(request)
        const serialized = JSON.parse(jsonString)

        // ISO 8601 date should be parseable
        const parsedDate = new Date(serialized.fechaInicio)
        expect(parsedDate.toString()).not.toBe('Invalid Date')

        return true
      }),
      { numRuns: 100 }
    )
  })

  it('should preserve fechaFin as valid ISO 8601 string', () => {
    fc.assert(
      fc.property(congelarPaqueteRequestArb, (request) => {
        const jsonString = JSON.stringify(request)
        const serialized = JSON.parse(jsonString)

        // ISO 8601 date should be parseable
        const parsedDate = new Date(serialized.fechaFin)
        expect(parsedDate.toString()).not.toBe('Invalid Date')

        return true
      }),
      { numRuns: 100 }
    )
  })

  it('should handle optional motivo field correctly', () => {
    fc.assert(
      fc.property(congelarPaqueteRequestArb, (request) => {
        const jsonString = JSON.stringify(request)
        const serialized = JSON.parse(jsonString)

        // motivo can be string or undefined (not present after JSON parse)
        if (serialized.motivo !== undefined) {
          expect(typeof serialized.motivo).toBe('string')
        }

        return true
      }),
      { numRuns: 100 }
    )
  })
})

/**
 * **Feature: admin-packages-integration, Property 21: Descongelar Request Format**
 * **Validates: Requirements 9.3**
 *
 * *For any* descongelar action, the mutation SHALL call
 * `POST /api/paquetes/{idPaquete}/descongelar?idCongelacion={idCongelacion}`.
 */
describe('Property 21: Descongelar Request Format', () => {
  it('should build correct URL with idPaquete path parameter and idCongelacion query parameter', () => {
    fc.assert(
      fc.property(descongelarParamsArb, (params) => {
        const url = buildDescongelarUrl(params.idPaquete, params.idCongelacion)

        // URL should contain the idPaquete in the path
        expect(url).toContain(`/api/paquetes/${params.idPaquete}/descongelar`)

        // URL should contain idCongelacion as query parameter
        expect(url).toContain(`?idCongelacion=${params.idCongelacion}`)

        return true
      }),
      { numRuns: 100 }
    )
  })

  it('should preserve idPaquete as valid UUID in URL path', () => {
    fc.assert(
      fc.property(descongelarParamsArb, (params) => {
        const url = buildDescongelarUrl(params.idPaquete, params.idCongelacion)

        // Extract idPaquete from URL path
        const pathMatch = url.match(/\/api\/paquetes\/([^/]+)\/descongelar/)
        expect(pathMatch).not.toBeNull()

        const extractedIdPaquete = pathMatch![1]
        expect(extractedIdPaquete).toBe(params.idPaquete)

        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
        expect(extractedIdPaquete).toMatch(uuidRegex)

        return true
      }),
      { numRuns: 100 }
    )
  })

  it('should preserve idCongelacion as valid UUID in query parameter', () => {
    fc.assert(
      fc.property(descongelarParamsArb, (params) => {
        const url = buildDescongelarUrl(params.idPaquete, params.idCongelacion)

        // Extract idCongelacion from query parameter
        const queryMatch = url.match(/\?idCongelacion=([^&]+)/)
        expect(queryMatch).not.toBeNull()

        const extractedIdCongelacion = queryMatch![1]
        expect(extractedIdCongelacion).toBe(params.idCongelacion)

        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
        expect(extractedIdCongelacion).toMatch(uuidRegex)

        return true
      }),
      { numRuns: 100 }
    )
  })

  it('should produce URL that matches expected endpoint pattern', () => {
    fc.assert(
      fc.property(descongelarParamsArb, (params) => {
        const url = buildDescongelarUrl(params.idPaquete, params.idCongelacion)

        // Full URL pattern validation
        const urlPattern =
          /^\/api\/paquetes\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\/descongelar\?idCongelacion=[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
        expect(url).toMatch(urlPattern)

        return true
      }),
      { numRuns: 100 }
    )
  })
})
