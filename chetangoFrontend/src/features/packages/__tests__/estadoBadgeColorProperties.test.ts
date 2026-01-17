// ============================================
// PROPERTY-BASED TESTS - ESTADO BADGE COLORS
// ============================================

import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import { getEstadoColor, ESTADO_CARD_CONFIG } from '../components/admin/PackageStatsCards'
import type { EstadoPaquete } from '../types/packageTypes'
import { ESTADO_PAQUETE_COLORS } from '../types/packageTypes'

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

// ============================================
// PROPERTY TESTS
// ============================================

/**
 * **Feature: admin-packages-integration, Property 8: Estado Badge Color Mapping**
 * **Validates: Requirements 3.8**
 *
 * *For any* package, the estado badge color SHALL be:
 * - green for 'Activo'
 * - orange for 'Agotado'
 * - blue for 'Congelado'
 * - gray for 'Vencido'
 */
describe('Property 8: Estado Badge Color Mapping', () => {
  it('should return correct color for each estado', () => {
    fc.assert(
      fc.property(estadoPaqueteArb, (estado) => {
        const color = getEstadoColor(estado)

        // Verify the color matches the expected mapping
        switch (estado) {
          case 'Activo':
            expect(color).toBe('green')
            break
          case 'Agotado':
            expect(color).toBe('orange')
            break
          case 'Congelado':
            expect(color).toBe('blue')
            break
          case 'Vencido':
            expect(color).toBe('gray')
            break
        }

        return true
      }),
      { numRuns: 100 }
    )
  })

  it('should have consistent color mapping between ESTADO_CARD_CONFIG and ESTADO_PAQUETE_COLORS', () => {
    fc.assert(
      fc.property(estadoPaqueteArb, (estado) => {
        const configColor = ESTADO_CARD_CONFIG[estado].color
        const typeColor = ESTADO_PAQUETE_COLORS[estado]

        // Both should return the same color
        expect(configColor).toBe(typeColor)

        return true
      }),
      { numRuns: 100 }
    )
  })

  it('should have all four estados defined in ESTADO_CARD_CONFIG', () => {
    const estados: EstadoPaquete[] = ['Activo', 'Vencido', 'Congelado', 'Agotado']

    estados.forEach((estado) => {
      expect(ESTADO_CARD_CONFIG[estado]).toBeDefined()
      expect(ESTADO_CARD_CONFIG[estado].color).toBeDefined()
      expect(ESTADO_CARD_CONFIG[estado].bgColor).toBeDefined()
      expect(ESTADO_CARD_CONFIG[estado].borderColor).toBeDefined()
      expect(ESTADO_CARD_CONFIG[estado].textColor).toBeDefined()
      expect(ESTADO_CARD_CONFIG[estado].icon).toBeDefined()
      expect(ESTADO_CARD_CONFIG[estado].label).toBeDefined()
    })
  })

  it('should return green for Activo estado', () => {
    fc.assert(
      fc.property(fc.constant('Activo' as EstadoPaquete), (estado) => {
        const color = getEstadoColor(estado)
        expect(color).toBe('green')
        return true
      }),
      { numRuns: 100 }
    )
  })

  it('should return orange for Agotado estado', () => {
    fc.assert(
      fc.property(fc.constant('Agotado' as EstadoPaquete), (estado) => {
        const color = getEstadoColor(estado)
        expect(color).toBe('orange')
        return true
      }),
      { numRuns: 100 }
    )
  })

  it('should return blue for Congelado estado', () => {
    fc.assert(
      fc.property(fc.constant('Congelado' as EstadoPaquete), (estado) => {
        const color = getEstadoColor(estado)
        expect(color).toBe('blue')
        return true
      }),
      { numRuns: 100 }
    )
  })

  it('should return gray for Vencido estado', () => {
    fc.assert(
      fc.property(fc.constant('Vencido' as EstadoPaquete), (estado) => {
        const color = getEstadoColor(estado)
        expect(color).toBe('gray')
        return true
      }),
      { numRuns: 100 }
    )
  })

  it('should have unique colors for each estado', () => {
    const estados: EstadoPaquete[] = ['Activo', 'Vencido', 'Congelado', 'Agotado']
    const colors = estados.map((estado) => getEstadoColor(estado))

    // All colors should be unique
    const uniqueColors = new Set(colors)
    expect(uniqueColors.size).toBe(estados.length)
  })

  it('should have correct label for each estado', () => {
    expect(ESTADO_CARD_CONFIG['Activo'].label).toBe('Activos')
    expect(ESTADO_CARD_CONFIG['Agotado'].label).toBe('Agotados')
    expect(ESTADO_CARD_CONFIG['Congelado'].label).toBe('Congelados')
    expect(ESTADO_CARD_CONFIG['Vencido'].label).toBe('Vencidos')
  })
})
