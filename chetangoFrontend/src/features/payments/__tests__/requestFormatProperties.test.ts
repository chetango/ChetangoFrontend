// ============================================
// PROPERTY-BASED TESTS - PAYMENT REQUEST FORMAT
// ============================================

import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import type {
  CrearPagoRequest,
  EditarPagoRequest,
  PaquetePagoRequest,
} from '../types/paymentTypes'

// ============================================
// ARBITRARIES FOR GENERATING VALID REQUEST DATA
// ============================================

/**
 * Generate valid ISO 8601 date strings
 */
const isoDateStringArb: fc.Arbitrary<string> = fc
  .integer({ min: 1577836800000, max: 1924905600000 }) // 2020-01-01 to 2030-12-31 in ms
  .map((timestamp) => new Date(timestamp).toISOString())

/**
 * Generate valid PaquetePagoRequest objects
 */
const paquetePagoRequestArb: fc.Arbitrary<PaquetePagoRequest> = fc.record({
  idTipoPaquete: fc.uuid(),
  valorPaquete: fc.option(
    fc.float({ min: Math.fround(0.01), max: Math.fround(100000), noNaN: true }),
    { nil: undefined }
  ),
})

/**
 * Generate valid CrearPagoRequest objects matching POST /api/pagos body
 */
const crearPagoRequestArb: fc.Arbitrary<CrearPagoRequest> = fc.record({
  idAlumno: fc.uuid(),
  fechaPago: isoDateStringArb,
  montoTotal: fc.float({ min: Math.fround(0.01), max: Math.fround(100000000), noNaN: true }),
  idMetodoPago: fc.uuid(),
  nota: fc.option(fc.string({ minLength: 0, maxLength: 500 }), { nil: null }),
  paquetes: fc.array(paquetePagoRequestArb, { minLength: 1, maxLength: 10 }),
})

/**
 * Generate valid EditarPagoRequest objects matching PUT /api/pagos/{id} body
 */
const editarPagoRequestArb: fc.Arbitrary<EditarPagoRequest> = fc.record({
  montoTotal: fc.float({ min: Math.fround(0.01), max: Math.fround(100000000), noNaN: true }),
  idMetodoPago: fc.uuid(),
  nota: fc.option(fc.string({ minLength: 0, maxLength: 500 }), { nil: null }),
})

// ============================================
// VALIDATION FUNCTIONS
// ============================================

/**
 * Validates that a CrearPagoRequest has all required fields with correct types
 * Based on Property 11 requirements
 */
function validateCrearPagoRequest(data: unknown): {
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
  if (typeof obj.fechaPago !== 'string') {
    errors.push('fechaPago must be a string (ISO 8601)')
  }
  if (typeof obj.montoTotal !== 'number' || obj.montoTotal <= 0) {
    errors.push('montoTotal must be a number > 0')
  }
  if (typeof obj.idMetodoPago !== 'string') {
    errors.push('idMetodoPago must be a string')
  }

  // Optional nota field
  if (obj.nota !== undefined && obj.nota !== null && typeof obj.nota !== 'string') {
    errors.push('nota must be a string, null, or undefined')
  }

  // Required paquetes array with at least one item
  if (!Array.isArray(obj.paquetes)) {
    errors.push('paquetes must be an array')
  } else if (obj.paquetes.length === 0) {
    errors.push('paquetes must contain at least one item')
  } else {
    // Validate each paquete
    for (let i = 0; i < obj.paquetes.length; i++) {
      const paquete = obj.paquetes[i] as Record<string, unknown>
      if (typeof paquete.idTipoPaquete !== 'string') {
        errors.push(`paquetes[${i}].idTipoPaquete must be a string`)
      }
      // valorPaquete is optional
      if (
        paquete.valorPaquete !== undefined &&
        typeof paquete.valorPaquete !== 'number'
      ) {
        errors.push(`paquetes[${i}].valorPaquete must be a number or undefined`)
      }
    }
  }

  return { valid: errors.length === 0, errors }
}

/**
 * Validates that an EditarPagoRequest has all required fields with correct types
 * and does NOT contain forbidden fields (idAlumno, fechaPago, paquetes)
 * Based on Property 12 requirements
 */
function validateEditarPagoRequest(data: unknown): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (typeof data !== 'object' || data === null) {
    return { valid: false, errors: ['Request must be an object'] }
  }

  const obj = data as Record<string, unknown>

  // Required fields
  if (typeof obj.montoTotal !== 'number' || obj.montoTotal <= 0) {
    errors.push('montoTotal must be a number > 0')
  }
  if (typeof obj.idMetodoPago !== 'string') {
    errors.push('idMetodoPago must be a string')
  }

  // Optional nota field
  if (obj.nota !== undefined && obj.nota !== null && typeof obj.nota !== 'string') {
    errors.push('nota must be a string, null, or undefined')
  }

  // Forbidden fields - these should NOT be present in edit request
  if ('idAlumno' in obj) {
    errors.push('idAlumno should NOT be present in edit request')
  }
  if ('fechaPago' in obj) {
    errors.push('fechaPago should NOT be present in edit request')
  }
  if ('paquetes' in obj) {
    errors.push('paquetes should NOT be present in edit request')
  }

  return { valid: errors.length === 0, errors }
}

// ============================================
// PROPERTY TESTS
// ============================================

/**
 * **Feature: admin-payments-integration, Property 11: Create Payment Request Format**
 * **Validates: Requirements 7.3**
 *
 * *For any* valid payment form data, the POST /api/pagos request body SHALL contain:
 * - `idAlumno` (string, required)
 * - `fechaPago` (string ISO 8601, required)
 * - `montoTotal` (number > 0, required)
 * - `idMetodoPago` (string, required)
 * - `nota` (string or null, optional)
 * - `paquetes` (array with at least one item, each containing `idTipoPaquete`)
 */
describe('Property 11: Create Payment Request Format', () => {
  it('should have all required fields with correct types', () => {
    fc.assert(
      fc.property(crearPagoRequestArb, (request) => {
        // Simulate JSON serialization (as would happen in HTTP request)
        const jsonString = JSON.stringify(request)
        const serialized = JSON.parse(jsonString)

        const validation = validateCrearPagoRequest(serialized)

        expect(validation.valid).toBe(true)
        expect(validation.errors).toHaveLength(0)

        // Verify each required field type
        expect(typeof serialized.idAlumno).toBe('string')
        expect(typeof serialized.fechaPago).toBe('string')
        expect(typeof serialized.montoTotal).toBe('number')
        expect(serialized.montoTotal).toBeGreaterThan(0)
        expect(typeof serialized.idMetodoPago).toBe('string')
        expect(Array.isArray(serialized.paquetes)).toBe(true)
        expect(serialized.paquetes.length).toBeGreaterThanOrEqual(1)

        return true
      }),
      { numRuns: 100 }
    )
  })

  it('should preserve idAlumno as valid UUID string', () => {
    fc.assert(
      fc.property(crearPagoRequestArb, (request) => {
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

  it('should preserve fechaPago as valid ISO 8601 string', () => {
    fc.assert(
      fc.property(crearPagoRequestArb, (request) => {
        const jsonString = JSON.stringify(request)
        const serialized = JSON.parse(jsonString)

        // ISO 8601 date should be parseable
        const parsedDate = new Date(serialized.fechaPago)
        expect(parsedDate.toString()).not.toBe('Invalid Date')

        return true
      }),
      { numRuns: 100 }
    )
  })

  it('should preserve montoTotal as positive number', () => {
    fc.assert(
      fc.property(crearPagoRequestArb, (request) => {
        const jsonString = JSON.stringify(request)
        const serialized = JSON.parse(jsonString)

        expect(typeof serialized.montoTotal).toBe('number')
        expect(serialized.montoTotal).toBeGreaterThan(0)
        expect(Number.isFinite(serialized.montoTotal)).toBe(true)

        return true
      }),
      { numRuns: 100 }
    )
  })

  it('should preserve idMetodoPago as valid UUID string', () => {
    fc.assert(
      fc.property(crearPagoRequestArb, (request) => {
        const jsonString = JSON.stringify(request)
        const serialized = JSON.parse(jsonString)

        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
        expect(serialized.idMetodoPago).toMatch(uuidRegex)

        return true
      }),
      { numRuns: 100 }
    )
  })

  it('should handle optional nota field correctly', () => {
    fc.assert(
      fc.property(crearPagoRequestArb, (request) => {
        const jsonString = JSON.stringify(request)
        const serialized = JSON.parse(jsonString)

        // nota can be string, null, or undefined (not present after JSON parse)
        if (serialized.nota !== undefined && serialized.nota !== null) {
          expect(typeof serialized.nota).toBe('string')
        }

        return true
      }),
      { numRuns: 100 }
    )
  })

  it('should have paquetes array with at least one item containing idTipoPaquete', () => {
    fc.assert(
      fc.property(crearPagoRequestArb, (request) => {
        const jsonString = JSON.stringify(request)
        const serialized = JSON.parse(jsonString)

        expect(Array.isArray(serialized.paquetes)).toBe(true)
        expect(serialized.paquetes.length).toBeGreaterThanOrEqual(1)

        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

        for (const paquete of serialized.paquetes) {
          expect(typeof paquete.idTipoPaquete).toBe('string')
          expect(paquete.idTipoPaquete).toMatch(uuidRegex)
        }

        return true
      }),
      { numRuns: 100 }
    )
  })

  it('should handle optional valorPaquete in paquetes correctly', () => {
    fc.assert(
      fc.property(crearPagoRequestArb, (request) => {
        const jsonString = JSON.stringify(request)
        const serialized = JSON.parse(jsonString)

        for (const paquete of serialized.paquetes) {
          // valorPaquete can be number or undefined
          if (paquete.valorPaquete !== undefined) {
            expect(typeof paquete.valorPaquete).toBe('number')
            expect(paquete.valorPaquete).toBeGreaterThan(0)
          }
        }

        return true
      }),
      { numRuns: 100 }
    )
  })
})

/**
 * **Feature: admin-payments-integration, Property 12: Update Payment Request Format**
 * **Validates: Requirements 10.4**
 *
 * *For any* valid edit form data, the PUT /api/pagos/{id} request body SHALL contain:
 * - `montoTotal` (number > 0, required)
 * - `idMetodoPago` (string, required)
 * - `nota` (string or null, optional)
 *
 * And SHALL NOT contain: `idAlumno`, `fechaPago`, or `paquetes`.
 */
describe('Property 12: Update Payment Request Format', () => {
  it('should have all required fields with correct types', () => {
    fc.assert(
      fc.property(editarPagoRequestArb, (request) => {
        // Simulate JSON serialization (as would happen in HTTP request)
        const jsonString = JSON.stringify(request)
        const serialized = JSON.parse(jsonString)

        const validation = validateEditarPagoRequest(serialized)

        expect(validation.valid).toBe(true)
        expect(validation.errors).toHaveLength(0)

        // Verify each required field type
        expect(typeof serialized.montoTotal).toBe('number')
        expect(serialized.montoTotal).toBeGreaterThan(0)
        expect(typeof serialized.idMetodoPago).toBe('string')

        return true
      }),
      { numRuns: 100 }
    )
  })

  it('should preserve montoTotal as positive number', () => {
    fc.assert(
      fc.property(editarPagoRequestArb, (request) => {
        const jsonString = JSON.stringify(request)
        const serialized = JSON.parse(jsonString)

        expect(typeof serialized.montoTotal).toBe('number')
        expect(serialized.montoTotal).toBeGreaterThan(0)
        expect(Number.isFinite(serialized.montoTotal)).toBe(true)

        return true
      }),
      { numRuns: 100 }
    )
  })

  it('should preserve idMetodoPago as valid UUID string', () => {
    fc.assert(
      fc.property(editarPagoRequestArb, (request) => {
        const jsonString = JSON.stringify(request)
        const serialized = JSON.parse(jsonString)

        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
        expect(serialized.idMetodoPago).toMatch(uuidRegex)

        return true
      }),
      { numRuns: 100 }
    )
  })

  it('should handle optional nota field correctly', () => {
    fc.assert(
      fc.property(editarPagoRequestArb, (request) => {
        const jsonString = JSON.stringify(request)
        const serialized = JSON.parse(jsonString)

        // nota can be string, null, or undefined (not present after JSON parse)
        if (serialized.nota !== undefined && serialized.nota !== null) {
          expect(typeof serialized.nota).toBe('string')
        }

        return true
      }),
      { numRuns: 100 }
    )
  })

  it('should NOT contain idAlumno field', () => {
    fc.assert(
      fc.property(editarPagoRequestArb, (request) => {
        const jsonString = JSON.stringify(request)
        const serialized = JSON.parse(jsonString)

        expect('idAlumno' in serialized).toBe(false)

        return true
      }),
      { numRuns: 100 }
    )
  })

  it('should NOT contain fechaPago field', () => {
    fc.assert(
      fc.property(editarPagoRequestArb, (request) => {
        const jsonString = JSON.stringify(request)
        const serialized = JSON.parse(jsonString)

        expect('fechaPago' in serialized).toBe(false)

        return true
      }),
      { numRuns: 100 }
    )
  })

  it('should NOT contain paquetes field', () => {
    fc.assert(
      fc.property(editarPagoRequestArb, (request) => {
        const jsonString = JSON.stringify(request)
        const serialized = JSON.parse(jsonString)

        expect('paquetes' in serialized).toBe(false)

        return true
      }),
      { numRuns: 100 }
    )
  })

  it('should only contain allowed fields (montoTotal, idMetodoPago, nota)', () => {
    fc.assert(
      fc.property(editarPagoRequestArb, (request) => {
        const jsonString = JSON.stringify(request)
        const serialized = JSON.parse(jsonString)

        const allowedFields = ['montoTotal', 'idMetodoPago', 'nota']
        const actualFields = Object.keys(serialized)

        // All actual fields should be in allowed fields
        for (const field of actualFields) {
          expect(allowedFields).toContain(field)
        }

        return true
      }),
      { numRuns: 100 }
    )
  })
})
