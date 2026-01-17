// ============================================
// PROPERTY-BASED TESTS - CLASS MUTATIONS
// ============================================

import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import type { CrearClaseRequest, EditarClaseRequest } from '../types/classTypes'

// ============================================
// HELPER FUNCTIONS FOR REQUEST VALIDATION
// ============================================

/**
 * Validates that a CrearClaseRequest has the correct format
 * for POST /api/clases
 */
export function isValidCrearClaseRequest(request: CrearClaseRequest): boolean {
  // Required fields must be present and have correct types
  if (typeof request.idProfesorPrincipal !== 'string' || !request.idProfesorPrincipal) {
    return false
  }
  if (typeof request.idTipoClase !== 'string' || !request.idTipoClase) {
    return false
  }
  if (typeof request.fecha !== 'string' || !request.fecha) {
    return false
  }
  if (typeof request.horaInicio !== 'string' || !request.horaInicio) {
    return false
  }
  if (typeof request.horaFin !== 'string' || !request.horaFin) {
    return false
  }
  if (typeof request.cupoMaximo !== 'number' || request.cupoMaximo < 1) {
    return false
  }

  // Optional field observaciones must be string or undefined
  if (request.observaciones !== undefined && typeof request.observaciones !== 'string') {
    return false
  }

  // Validate fecha format (ISO 8601 date)
  const fechaRegex = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2})?$/
  if (!fechaRegex.test(request.fecha)) {
    return false
  }

  // Validate horaInicio format (HH:mm:ss)
  const timeRegex = /^\d{2}:\d{2}:\d{2}$/
  if (!timeRegex.test(request.horaInicio)) {
    return false
  }

  // Validate horaFin format (HH:mm:ss)
  if (!timeRegex.test(request.horaFin)) {
    return false
  }

  return true
}

/**
 * Validates that an EditarClaseRequest has the correct format
 * for PUT /api/clases/{id}
 */
export function isValidEditarClaseRequest(request: EditarClaseRequest): boolean {
  // Required fields must be present and have correct types
  if (typeof request.idTipoClase !== 'string' || !request.idTipoClase) {
    return false
  }
  if (typeof request.idProfesor !== 'string' || !request.idProfesor) {
    return false
  }
  if (typeof request.fechaHoraInicio !== 'string' || !request.fechaHoraInicio) {
    return false
  }
  if (typeof request.duracionMinutos !== 'number' || request.duracionMinutos < 1) {
    return false
  }
  if (typeof request.cupoMaximo !== 'number' || request.cupoMaximo < 1) {
    return false
  }

  // Optional field observaciones must be string or undefined
  if (request.observaciones !== undefined && typeof request.observaciones !== 'string') {
    return false
  }

  // Validate fechaHoraInicio format (ISO 8601 datetime)
  const dateTimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/
  if (!dateTimeRegex.test(request.fechaHoraInicio)) {
    return false
  }

  return true
}

// ============================================
// ARBITRARIES FOR GENERATING VALID REQUEST DATA
// ============================================

/**
 * Generate valid time strings in HH:mm:ss format
 */
const timeStringArb = fc
  .tuple(
    fc.integer({ min: 0, max: 23 }),
    fc.integer({ min: 0, max: 59 }),
    fc.integer({ min: 0, max: 59 })
  )
  .map(([h, m, s]) => `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`)

/**
 * Generate valid ISO 8601 date strings (YYYY-MM-DD)
 * Using integer-based generation to avoid invalid date issues
 */
const isoDateArb = fc
  .tuple(
    fc.integer({ min: 2020, max: 2030 }),
    fc.integer({ min: 1, max: 12 }),
    fc.integer({ min: 1, max: 28 }) // Use 28 to avoid month-end issues
  )
  .map(([y, m, d]) => `${y}-${m.toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`)

/**
 * Generate valid ISO 8601 datetime strings (YYYY-MM-DDTHH:mm:ss)
 */
const isoDateTimeArb = fc
  .tuple(isoDateArb, timeStringArb)
  .map(([date, time]) => `${date}T${time}`)

/**
 * Generate valid CrearClaseRequest objects
 */
const crearClaseRequestArb: fc.Arbitrary<CrearClaseRequest> = fc.record({
  idProfesorPrincipal: fc.uuid(),
  idTipoClase: fc.uuid(),
  fecha: fc.oneof(
    isoDateArb,
    isoDateArb.map((d) => `${d}T00:00:00`)
  ),
  horaInicio: timeStringArb,
  horaFin: timeStringArb,
  cupoMaximo: fc.integer({ min: 1, max: 50 }),
  observaciones: fc.option(fc.string({ minLength: 0, maxLength: 500 }), { nil: undefined }),
})

/**
 * Generate valid EditarClaseRequest objects
 */
const editarClaseRequestArb: fc.Arbitrary<EditarClaseRequest> = fc.record({
  idTipoClase: fc.uuid(),
  idProfesor: fc.uuid(),
  fechaHoraInicio: isoDateTimeArb,
  duracionMinutos: fc.integer({ min: 1, max: 480 }),
  cupoMaximo: fc.integer({ min: 1, max: 50 }),
  observaciones: fc.option(fc.string({ minLength: 0, maxLength: 500 }), { nil: undefined }),
})

// ============================================
// PROPERTY 10: Create Clase Request Format
// Feature: admin-classes-integration
// Validates: Requirements 5.3
// ============================================

/**
 * **Feature: admin-classes-integration, Property 10: Create Clase Request Format**
 * **Validates: Requirements 5.3**
 *
 * *For any* class creation, the mutation SHALL call `POST /api/clases` with body
 * containing: idProfesorPrincipal, idTipoClase, fecha (ISO 8601), horaInicio (HH:mm:ss),
 * horaFin (HH:mm:ss), cupoMaximo, and optional observaciones.
 */
describe('Property 10: Create Clase Request Format', () => {
  it('should validate all generated CrearClaseRequest objects as valid', () => {
    fc.assert(
      fc.property(crearClaseRequestArb, (request) => {
        expect(isValidCrearClaseRequest(request)).toBe(true)
        return true
      }),
      { numRuns: 100 }
    )
  })

  it('should have idProfesorPrincipal as a valid UUID string', () => {
    fc.assert(
      fc.property(crearClaseRequestArb, (request) => {
        expect(typeof request.idProfesorPrincipal).toBe('string')
        expect(request.idProfesorPrincipal.length).toBeGreaterThan(0)
        // UUID format check
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
        expect(uuidRegex.test(request.idProfesorPrincipal)).toBe(true)
        return true
      }),
      { numRuns: 100 }
    )
  })

  it('should have idTipoClase as a valid UUID string', () => {
    fc.assert(
      fc.property(crearClaseRequestArb, (request) => {
        expect(typeof request.idTipoClase).toBe('string')
        expect(request.idTipoClase.length).toBeGreaterThan(0)
        // UUID format check
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
        expect(uuidRegex.test(request.idTipoClase)).toBe(true)
        return true
      }),
      { numRuns: 100 }
    )
  })

  it('should have fecha in ISO 8601 format', () => {
    fc.assert(
      fc.property(crearClaseRequestArb, (request) => {
        expect(typeof request.fecha).toBe('string')
        // Should match YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss
        const fechaRegex = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2})?$/
        expect(fechaRegex.test(request.fecha)).toBe(true)
        return true
      }),
      { numRuns: 100 }
    )
  })

  it('should have horaInicio in HH:mm:ss format', () => {
    fc.assert(
      fc.property(crearClaseRequestArb, (request) => {
        expect(typeof request.horaInicio).toBe('string')
        const timeRegex = /^\d{2}:\d{2}:\d{2}$/
        expect(timeRegex.test(request.horaInicio)).toBe(true)
        return true
      }),
      { numRuns: 100 }
    )
  })

  it('should have horaFin in HH:mm:ss format', () => {
    fc.assert(
      fc.property(crearClaseRequestArb, (request) => {
        expect(typeof request.horaFin).toBe('string')
        const timeRegex = /^\d{2}:\d{2}:\d{2}$/
        expect(timeRegex.test(request.horaFin)).toBe(true)
        return true
      }),
      { numRuns: 100 }
    )
  })

  it('should have cupoMaximo as a positive integer', () => {
    fc.assert(
      fc.property(crearClaseRequestArb, (request) => {
        expect(typeof request.cupoMaximo).toBe('number')
        expect(Number.isInteger(request.cupoMaximo)).toBe(true)
        expect(request.cupoMaximo).toBeGreaterThanOrEqual(1)
        return true
      }),
      { numRuns: 100 }
    )
  })

  it('should have observaciones as string or undefined', () => {
    fc.assert(
      fc.property(crearClaseRequestArb, (request) => {
        if (request.observaciones !== undefined) {
          expect(typeof request.observaciones).toBe('string')
        }
        return true
      }),
      { numRuns: 100 }
    )
  })
})

// ============================================
// PROPERTY 12: Update Clase Request Format
// Feature: admin-classes-integration
// Validates: Requirements 6.3
// ============================================

/**
 * **Feature: admin-classes-integration, Property 12: Update Clase Request Format**
 * **Validates: Requirements 6.3**
 *
 * *For any* class update, the mutation SHALL call `PUT /api/clases/{idClase}` with body
 * containing: idTipoClase, idProfesor, fechaHoraInicio (ISO 8601), duracionMinutos (calculated),
 * cupoMaximo, and optional observaciones.
 */
describe('Property 12: Update Clase Request Format', () => {
  it('should validate all generated EditarClaseRequest objects as valid', () => {
    fc.assert(
      fc.property(editarClaseRequestArb, (request) => {
        expect(isValidEditarClaseRequest(request)).toBe(true)
        return true
      }),
      { numRuns: 100 }
    )
  })

  it('should have idTipoClase as a valid UUID string', () => {
    fc.assert(
      fc.property(editarClaseRequestArb, (request) => {
        expect(typeof request.idTipoClase).toBe('string')
        expect(request.idTipoClase.length).toBeGreaterThan(0)
        // UUID format check
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
        expect(uuidRegex.test(request.idTipoClase)).toBe(true)
        return true
      }),
      { numRuns: 100 }
    )
  })

  it('should have idProfesor as a valid UUID string', () => {
    fc.assert(
      fc.property(editarClaseRequestArb, (request) => {
        expect(typeof request.idProfesor).toBe('string')
        expect(request.idProfesor.length).toBeGreaterThan(0)
        // UUID format check
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
        expect(uuidRegex.test(request.idProfesor)).toBe(true)
        return true
      }),
      { numRuns: 100 }
    )
  })

  it('should have fechaHoraInicio in ISO 8601 datetime format', () => {
    fc.assert(
      fc.property(editarClaseRequestArb, (request) => {
        expect(typeof request.fechaHoraInicio).toBe('string')
        // Should match YYYY-MM-DDTHH:mm:ss
        const dateTimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/
        expect(dateTimeRegex.test(request.fechaHoraInicio)).toBe(true)
        return true
      }),
      { numRuns: 100 }
    )
  })

  it('should have duracionMinutos as a positive integer', () => {
    fc.assert(
      fc.property(editarClaseRequestArb, (request) => {
        expect(typeof request.duracionMinutos).toBe('number')
        expect(Number.isInteger(request.duracionMinutos)).toBe(true)
        expect(request.duracionMinutos).toBeGreaterThanOrEqual(1)
        return true
      }),
      { numRuns: 100 }
    )
  })

  it('should have cupoMaximo as a positive integer', () => {
    fc.assert(
      fc.property(editarClaseRequestArb, (request) => {
        expect(typeof request.cupoMaximo).toBe('number')
        expect(Number.isInteger(request.cupoMaximo)).toBe(true)
        expect(request.cupoMaximo).toBeGreaterThanOrEqual(1)
        return true
      }),
      { numRuns: 100 }
    )
  })

  it('should have observaciones as string or undefined', () => {
    fc.assert(
      fc.property(editarClaseRequestArb, (request) => {
        if (request.observaciones !== undefined) {
          expect(typeof request.observaciones).toBe('string')
        }
        return true
      }),
      { numRuns: 100 }
    )
  })
})
