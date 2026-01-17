// ============================================
// PROPERTY-BASED TESTS - CLASS TYPES PARSING
// ============================================

import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import {
  isTipoClaseDTO,
  isProfesorDTO,
  parseTiposClaseResponse,
  parseProfesoresResponse,
  type TipoClaseDTO,
  type ProfesorDTO,
} from '../types/classTypes'

// ============================================
// ARBITRARIES FOR GENERATING VALID API DATA
// ============================================

/**
 * Generate valid TipoClaseDTO objects
 */
const tipoClaseDTOArb: fc.Arbitrary<TipoClaseDTO> = fc.record({
  id: fc.uuid(),
  nombre: fc.string({ minLength: 1, maxLength: 50 }),
})

/**
 * Generate valid ProfesorDTO objects
 */
const profesorDTOArb: fc.Arbitrary<ProfesorDTO> = fc.record({
  idProfesor: fc.uuid(),
  nombreCompleto: fc.string({ minLength: 1, maxLength: 100 }),
  tipoProfesor: fc.constantFrom('Titular' as const, 'Monitor' as const),
})

/**
 * Generate invalid objects that should fail type guards
 */
const invalidObjectArb = fc.oneof(
  fc.constant(null),
  fc.constant(undefined),
  fc.string(),
  fc.integer(),
  fc.boolean(),
  fc.record({
    // Missing required fields
    id: fc.uuid(),
  }),
  fc.record({
    // Wrong field types
    id: fc.integer(),
    nombre: fc.integer(),
  })
)

// ============================================
// PROPERTY 2: TiposClase Response Parsing
// Feature: admin-classes-integration
// Validates: Requirements 2.2
// ============================================

/**
 * **Feature: admin-classes-integration, Property 2: TiposClase Response Parsing**
 * **Validates: Requirements 2.2**
 *
 * *For any* valid response from `/api/tipos-clase`, the parsed array SHALL contain
 * objects with `id` (string) and `nombre` (string) fields.
 */
describe('Property 2: TiposClase Response Parsing', () => {
  it('should correctly identify valid TipoClaseDTO objects', () => {
    fc.assert(
      fc.property(tipoClaseDTOArb, (tipoClase) => {
        // Type guard should return true for valid objects
        expect(isTipoClaseDTO(tipoClase)).toBe(true)

        // Verify the object has the required fields with correct types
        expect(typeof tipoClase.id).toBe('string')
        expect(typeof tipoClase.nombre).toBe('string')

        return true
      }),
      { numRuns: 100 }
    )
  })

  it('should parse valid TiposClase API response preserving all fields', () => {
    fc.assert(
      fc.property(fc.array(tipoClaseDTOArb, { minLength: 0, maxLength: 20 }), (tiposClase) => {
        const parsed = parseTiposClaseResponse(tiposClase)

        // Parsed array should have same length as input
        expect(parsed).toHaveLength(tiposClase.length)

        // Each item should preserve all fields
        for (let i = 0; i < tiposClase.length; i++) {
          expect(parsed[i].id).toBe(tiposClase[i].id)
          expect(parsed[i].nombre).toBe(tiposClase[i].nombre)
        }

        return true
      }),
      { numRuns: 100 }
    )
  })

  it('should filter out invalid objects from mixed arrays', () => {
    fc.assert(
      fc.property(
        fc.array(tipoClaseDTOArb, { minLength: 1, maxLength: 10 }),
        fc.array(invalidObjectArb, { minLength: 0, maxLength: 5 }),
        (validItems, invalidItems) => {
          // Mix valid and invalid items
          const mixedArray = [...validItems, ...invalidItems]

          const parsed = parseTiposClaseResponse(mixedArray)

          // Should only contain valid items
          expect(parsed.length).toBeLessThanOrEqual(mixedArray.length)
          expect(parsed.length).toBeGreaterThanOrEqual(validItems.length)

          // All parsed items should be valid TipoClaseDTO
          for (const item of parsed) {
            expect(isTipoClaseDTO(item)).toBe(true)
          }

          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should throw error when input is not an array', () => {
    fc.assert(
      fc.property(
        fc.oneof(fc.string(), fc.integer(), fc.object(), fc.constant(null)),
        (invalidInput) => {
          expect(() => parseTiposClaseResponse(invalidInput)).toThrow(
            'Expected array of TipoClaseDTO'
          )
          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should return empty array for empty input', () => {
    const parsed = parseTiposClaseResponse([])
    expect(parsed).toEqual([])
  })
})

// ============================================
// PROPERTY 3: Profesores Response Parsing
// Feature: admin-classes-integration
// Validates: Requirements 2.4
// ============================================

/**
 * **Feature: admin-classes-integration, Property 3: Profesores Response Parsing**
 * **Validates: Requirements 2.4**
 *
 * *For any* valid response from `/api/profesores`, the parsed array SHALL contain
 * objects with `idProfesor`, `nombreCompleto`, and `tipoProfesor` fields.
 */
describe('Property 3: Profesores Response Parsing', () => {
  it('should correctly identify valid ProfesorDTO objects', () => {
    fc.assert(
      fc.property(profesorDTOArb, (profesor) => {
        // Type guard should return true for valid objects
        expect(isProfesorDTO(profesor)).toBe(true)

        // Verify the object has the required fields with correct types
        expect(typeof profesor.idProfesor).toBe('string')
        expect(typeof profesor.nombreCompleto).toBe('string')
        expect(['Titular', 'Monitor']).toContain(profesor.tipoProfesor)

        return true
      }),
      { numRuns: 100 }
    )
  })

  it('should parse valid Profesores API response preserving all fields', () => {
    fc.assert(
      fc.property(fc.array(profesorDTOArb, { minLength: 0, maxLength: 20 }), (profesores) => {
        const parsed = parseProfesoresResponse(profesores)

        // Parsed array should have same length as input
        expect(parsed).toHaveLength(profesores.length)

        // Each item should preserve all fields
        for (let i = 0; i < profesores.length; i++) {
          expect(parsed[i].idProfesor).toBe(profesores[i].idProfesor)
          expect(parsed[i].nombreCompleto).toBe(profesores[i].nombreCompleto)
          expect(parsed[i].tipoProfesor).toBe(profesores[i].tipoProfesor)
        }

        return true
      }),
      { numRuns: 100 }
    )
  })

  it('should filter out invalid objects from mixed arrays', () => {
    fc.assert(
      fc.property(
        fc.array(profesorDTOArb, { minLength: 1, maxLength: 10 }),
        fc.array(invalidObjectArb, { minLength: 0, maxLength: 5 }),
        (validItems, invalidItems) => {
          // Mix valid and invalid items
          const mixedArray = [...validItems, ...invalidItems]

          const parsed = parseProfesoresResponse(mixedArray)

          // Should only contain valid items
          expect(parsed.length).toBeLessThanOrEqual(mixedArray.length)
          expect(parsed.length).toBeGreaterThanOrEqual(validItems.length)

          // All parsed items should be valid ProfesorDTO
          for (const item of parsed) {
            expect(isProfesorDTO(item)).toBe(true)
          }

          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should reject objects with invalid tipoProfesor values', () => {
    fc.assert(
      fc.property(
        fc.record({
          idProfesor: fc.uuid(),
          nombreCompleto: fc.string({ minLength: 1, maxLength: 100 }),
          tipoProfesor: fc.string().filter((s) => s !== 'Titular' && s !== 'Monitor'),
        }),
        (invalidProfesor) => {
          expect(isProfesorDTO(invalidProfesor)).toBe(false)
          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should throw error when input is not an array', () => {
    fc.assert(
      fc.property(
        fc.oneof(fc.string(), fc.integer(), fc.object(), fc.constant(null)),
        (invalidInput) => {
          expect(() => parseProfesoresResponse(invalidInput)).toThrow(
            'Expected array of ProfesorDTO'
          )
          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should return empty array for empty input', () => {
    const parsed = parseProfesoresResponse([])
    expect(parsed).toEqual([])
  })
})
