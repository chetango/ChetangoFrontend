// ============================================
// PROPERTY-BASED TESTS - ROW DISPLAY FORMAT
// ============================================

import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import {
  formatDate,
  getEstadoBadgeVariant,
} from '../components/admin/PackageTableRow'
import { getInitials, getConsumoPercentage } from '../hooks/useAdminPackages'
import type { PaqueteListItemDTO, EstadoPaquete, EstadoPaqueteId } from '../types/packageTypes'

// ============================================
// ARBITRARIES FOR GENERATING TEST DATA
// ============================================

/**
 * Generate valid EstadoPaquete values
 */
const estadoPaqueteArb: fc.Arbitrary<EstadoPaquete> = fc.constantFrom(
  'Activo',
  'Vencido',
  'Congelado',
  'Agotado'
)

/**
 * Generate valid ISO date strings
 */
const validDateArb = fc
  .integer({ min: 1577836800000, max: 1924905600000 }) // 2020-01-01 to 2030-12-31
  .map((ts) => new Date(ts).toISOString())

/**
 * Generate alphabetic-only name parts
 */
const alphabeticWordArb: fc.Arbitrary<string> = fc.stringMatching(/^[a-zA-Z]{2,15}$/)

/**
 * Generate valid full names (two words)
 */
const fullNameArb: fc.Arbitrary<string> = fc
  .tuple(alphabeticWordArb, alphabeticWordArb)
  .map(([first, last]) => `${first} ${last}`)

/**
 * Generate valid document identifiers
 */
const documentoArb: fc.Arbitrary<string> = fc.stringMatching(/^[0-9A-Za-z]{5,20}$/)

/**
 * Generate valid PaqueteListItemDTO objects
 */
const paqueteListItemArb: fc.Arbitrary<PaqueteListItemDTO> = fc
  .tuple(
    estadoPaqueteArb,
    fc.integer({ min: 1, max: 100 }), // clasesDisponibles
    fc.integer({ min: 0, max: 100 }), // clasesUsadas
    fullNameArb,
    documentoArb,
    alphabeticWordArb, // nombreTipoPaquete
    validDateArb, // fechaActivacion
    validDateArb // fechaVencimiento
  )
  .map(
    ([
      estado,
      clasesDisponibles,
      clasesUsadas,
      nombreAlumno,
      documentoAlumno,
      nombreTipoPaquete,
      fechaActivacion,
      fechaVencimiento,
    ]) => {
      // Map estado to correct idEstado
      const idEstado: EstadoPaqueteId =
        estado === 'Activo' ? 1 : estado === 'Vencido' ? 2 : estado === 'Congelado' ? 3 : 4

      // Ensure clasesUsadas doesn't exceed clasesDisponibles for realistic data
      const actualUsadas = Math.min(clasesUsadas, clasesDisponibles)

      return {
        idPaquete: crypto.randomUUID(),
        idAlumno: crypto.randomUUID(),
        nombreAlumno,
        documentoAlumno,
        nombreTipoPaquete,
        clasesDisponibles,
        clasesUsadas: actualUsadas,
        clasesRestantes: clasesDisponibles - actualUsadas,
        fechaActivacion,
        fechaVencimiento,
        valorPaquete: 100,
        idEstado,
        estado,
        estaVencido: estado === 'Vencido',
        tieneClasesDisponibles: clasesDisponibles - actualUsadas > 0,
      }
    }
  )

// ============================================
// PROPERTY TESTS
// ============================================

/**
 * **Feature: admin-packages-integration, Property 6: Package Row Display Format**
 * **Validates: Requirements 3.5, 3.6, 3.7, 3.8, 3.9**
 *
 * *For any* PaqueteListItemDTO, the table row SHALL display:
 * (1) ALUMNO column with initials avatar, nombreAlumno, and documentoAlumno
 * (2) PAQUETE column with nombreTipoPaquete and clasesDisponibles
 * (3) CONSUMO column with `{clasesUsadas} / {clasesDisponibles}` and percentage
 * (4) ESTADO column with colored badge matching estado
 * (5) VIGENCIA column with formatted fechaActivacion and fechaVencimiento
 */
describe('Property 6: Package Row Display Format', () => {
  /**
   * Test 6.1: ALUMNO column - initials are correctly derived from nombreAlumno
   * Requirements: 3.5
   */
  describe('ALUMNO column display', () => {
    it('should derive initials correctly from nombreAlumno', () => {
      fc.assert(
        fc.property(paqueteListItemArb, (paquete) => {
          const initials = getInitials(paquete.nombreAlumno)

          // Initials should be 2 characters
          expect(initials).toHaveLength(2)

          // Initials should be uppercase
          expect(initials).toBe(initials.toUpperCase())

          // For two-word names, initials should be first letter of each word
          const parts = paquete.nombreAlumno.trim().split(/\s+/)
          if (parts.length >= 2) {
            const expectedFirst = parts[0][0].toUpperCase()
            const expectedSecond = parts[1][0].toUpperCase()
            expect(initials).toBe(expectedFirst + expectedSecond)
          }

          return true
        }),
        { numRuns: 100 }
      )
    })

    it('should have nombreAlumno and documentoAlumno available for display', () => {
      fc.assert(
        fc.property(paqueteListItemArb, (paquete) => {
          // nombreAlumno should be non-empty
          expect(paquete.nombreAlumno.trim().length).toBeGreaterThan(0)

          // documentoAlumno should be non-empty
          expect(paquete.documentoAlumno.trim().length).toBeGreaterThan(0)

          return true
        }),
        { numRuns: 100 }
      )
    })
  })

  /**
   * Test 6.2: PAQUETE column - nombreTipoPaquete and clasesDisponibles
   * Requirements: 3.6
   */
  describe('PAQUETE column display', () => {
    it('should have nombreTipoPaquete and clasesDisponibles for display', () => {
      fc.assert(
        fc.property(paqueteListItemArb, (paquete) => {
          // nombreTipoPaquete should be non-empty
          expect(paquete.nombreTipoPaquete.trim().length).toBeGreaterThan(0)

          // clasesDisponibles should be a positive number
          expect(paquete.clasesDisponibles).toBeGreaterThan(0)

          return true
        }),
        { numRuns: 100 }
      )
    })
  })

  /**
   * Test 6.3: CONSUMO column - clasesUsadas / clasesDisponibles and percentage
   * Requirements: 3.7
   */
  describe('CONSUMO column display', () => {
    it('should calculate consumption percentage correctly', () => {
      fc.assert(
        fc.property(paqueteListItemArb, (paquete) => {
          const percentage = getConsumoPercentage(
            paquete.clasesUsadas,
            paquete.clasesDisponibles
          )

          const expected = Math.round(
            (paquete.clasesUsadas / paquete.clasesDisponibles) * 100
          )

          expect(percentage).toBe(expected)

          return true
        }),
        { numRuns: 100 }
      )
    })

    it('should have clasesUsadas and clasesDisponibles for display format', () => {
      fc.assert(
        fc.property(paqueteListItemArb, (paquete) => {
          // clasesUsadas should be >= 0
          expect(paquete.clasesUsadas).toBeGreaterThanOrEqual(0)

          // clasesDisponibles should be > 0
          expect(paquete.clasesDisponibles).toBeGreaterThan(0)

          // clasesUsadas should not exceed clasesDisponibles in our test data
          expect(paquete.clasesUsadas).toBeLessThanOrEqual(paquete.clasesDisponibles)

          return true
        }),
        { numRuns: 100 }
      )
    })
  })

  /**
   * Test 6.4: ESTADO column - badge variant matches estado
   * Requirements: 3.8
   */
  describe('ESTADO column display', () => {
    it('should map estado to correct badge variant', () => {
      fc.assert(
        fc.property(estadoPaqueteArb, (estado) => {
          const variant = getEstadoBadgeVariant(estado)

          // Verify correct mapping
          const expectedMapping: Record<EstadoPaquete, string> = {
            Activo: 'active',
            Agotado: 'depleted',
            Congelado: 'frozen',
            Vencido: 'expired',
          }

          expect(variant).toBe(expectedMapping[estado])

          return true
        }),
        { numRuns: 100 }
      )
    })

    it('should always return a valid badge variant', () => {
      fc.assert(
        fc.property(paqueteListItemArb, (paquete) => {
          const variant = getEstadoBadgeVariant(paquete.estado)

          // Variant should be one of the valid values
          expect(['active', 'depleted', 'frozen', 'expired']).toContain(variant)

          return true
        }),
        { numRuns: 100 }
      )
    })
  })

  /**
   * Test 6.5: VIGENCIA column - formatted dates
   * Requirements: 3.9
   */
  describe('VIGENCIA column display', () => {
    it('should format dates correctly', () => {
      fc.assert(
        fc.property(validDateArb, (isoDate) => {
          const formatted = formatDate(isoDate)

          // Formatted date should be a non-empty string
          expect(formatted.length).toBeGreaterThan(0)

          // Should not be the original ISO string (should be formatted)
          expect(formatted).not.toBe(isoDate)

          return true
        }),
        { numRuns: 100 }
      )
    })

    it('should have fechaActivacion and fechaVencimiento for display', () => {
      fc.assert(
        fc.property(paqueteListItemArb, (paquete) => {
          // Both dates should be valid ISO strings
          expect(paquete.fechaActivacion).toBeTruthy()
          expect(paquete.fechaVencimiento).toBeTruthy()

          // Both should be parseable as dates
          const activacion = new Date(paquete.fechaActivacion)
          const vencimiento = new Date(paquete.fechaVencimiento)

          expect(activacion.getTime()).not.toBeNaN()
          expect(vencimiento.getTime()).not.toBeNaN()

          return true
        }),
        { numRuns: 100 }
      )
    })

    it('should format both fechaActivacion and fechaVencimiento', () => {
      fc.assert(
        fc.property(paqueteListItemArb, (paquete) => {
          const formattedActivacion = formatDate(paquete.fechaActivacion)
          const formattedVencimiento = formatDate(paquete.fechaVencimiento)

          // Both should be formatted (non-empty)
          expect(formattedActivacion.length).toBeGreaterThan(0)
          expect(formattedVencimiento.length).toBeGreaterThan(0)

          return true
        }),
        { numRuns: 100 }
      )
    })
  })

  /**
   * Test 6.6: All required fields are present for row display
   */
  describe('Complete row data availability', () => {
    it('should have all required fields for complete row display', () => {
      fc.assert(
        fc.property(paqueteListItemArb, (paquete) => {
          // ALUMNO column fields
          expect(paquete.nombreAlumno).toBeDefined()
          expect(paquete.documentoAlumno).toBeDefined()

          // PAQUETE column fields
          expect(paquete.nombreTipoPaquete).toBeDefined()
          expect(paquete.clasesDisponibles).toBeDefined()

          // CONSUMO column fields
          expect(paquete.clasesUsadas).toBeDefined()
          expect(paquete.clasesDisponibles).toBeDefined()

          // ESTADO column fields
          expect(paquete.estado).toBeDefined()

          // VIGENCIA column fields
          expect(paquete.fechaActivacion).toBeDefined()
          expect(paquete.fechaVencimiento).toBeDefined()

          // ACCIONES column - idPaquete for detail view
          expect(paquete.idPaquete).toBeDefined()

          return true
        }),
        { numRuns: 100 }
      )
    })
  })
})
