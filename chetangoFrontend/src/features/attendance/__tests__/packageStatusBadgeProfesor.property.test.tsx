// ============================================
// PROPERTY-BASED TESTS - PACKAGE STATUS BADGE PROFESOR
// ============================================

import { describe, it, expect, afterEach } from 'vitest'
import * as fc from 'fast-check'
import { render, cleanup } from '@testing-library/react'
import { PackageStatusBadgeProfesor, getBadgeColorForEstado } from '../components/profesor/PackageStatusBadgeProfesor'
import type { EstadoPaqueteProfesor } from '../types/profesorTypes'

// Arbitrary for generating valid EstadoPaqueteProfesor
const estadoPaqueteProfesorArb: fc.Arbitrary<EstadoPaqueteProfesor> = fc.constantFrom(
  'activo',
  'agotado',
  'sin_paquete',
  'clase_prueba'
)

/**
 * Expected color mappings for each estado
 * Based on Figma design specifications
 */
const EXPECTED_COLORS: Record<
  EstadoPaqueteProfesor,
  {
    bgColor: string
    borderColor: string
    textColor: string
    label: string
  }
> = {
  activo: {
    bgColor: 'bg-[rgba(52,211,153,0.12)]',
    borderColor: 'border-[rgba(52,211,153,0.25)]',
    textColor: 'text-[#34d399]',
    label: 'Paquete activo',
  },
  agotado: {
    bgColor: 'bg-[rgba(239,68,68,0.15)]',
    borderColor: 'border-[rgba(239,68,68,0.3)]',
    textColor: 'text-[#fca5a5]',
    label: 'Agotado',
  },
  sin_paquete: {
    bgColor: 'bg-[rgba(245,158,11,0.15)]',
    borderColor: 'border-[rgba(245,158,11,0.3)]',
    textColor: 'text-[#fcd34d]',
    label: 'Sin paquete',
  },
  clase_prueba: {
    bgColor: 'bg-[rgba(124,90,248,0.15)]',
    borderColor: 'border-[rgba(124,90,248,0.3)]',
    textColor: 'text-[#9b8afb]',
    label: 'Clase prueba',
  },
}

/**
 * **Feature: attendance-module, Property 5: Package Status Badge Color Mapping**
 * **Validates: Requirements 3.9, 3.10, 3.11, 4.7, 4.8**
 *
 * *For any* package status value, the badge must display the correct color:
 * - verde (green) for "activo"
 * - rojo (red) for "agotado"
 * - amarillo (yellow) for "sin_paquete"
 * - morado (purple) for "clase_prueba"
 */
describe('Property 5: Package Status Badge Color Mapping', () => {
  afterEach(() => {
    cleanup()
  })

  it('should render correct colors for any valid estado', () => {
    fc.assert(
      fc.property(estadoPaqueteProfesorArb, (estado) => {
        cleanup()
        const { container } = render(<PackageStatusBadgeProfesor estado={estado} />)

        const badge = container.querySelector('span')
        expect(badge).toBeTruthy()

        const expected = EXPECTED_COLORS[estado]

        // Verify background color class
        expect(badge?.className).toContain(expected.bgColor)

        // Verify border color class
        expect(badge?.className).toContain(expected.borderColor)

        // Verify text color class
        expect(badge?.className).toContain(expected.textColor)

        // Verify label text
        expect(container.textContent).toContain(expected.label)

        // Verify icon is present
        const svg = container.querySelector('svg')
        expect(svg).toBeTruthy()

        return true
      }),
      { numRuns: 100 }
    )
  })

  it('should render green badge for activo estado', () => {
    fc.assert(
      fc.property(fc.boolean(), () => {
        cleanup()
        const { container } = render(<PackageStatusBadgeProfesor estado="activo" />)

        const badge = container.querySelector('span')
        expect(badge?.className).toContain('bg-[rgba(52,211,153,0.12)]')
        expect(badge?.className).toContain('border-[rgba(52,211,153,0.25)]')
        expect(badge?.className).toContain('text-[#34d399]')
        expect(container.textContent).toContain('Paquete activo')

        return true
      }),
      { numRuns: 100 }
    )
  })

  it('should render red badge for agotado estado', () => {
    fc.assert(
      fc.property(fc.boolean(), () => {
        cleanup()
        const { container } = render(<PackageStatusBadgeProfesor estado="agotado" />)

        const badge = container.querySelector('span')
        expect(badge?.className).toContain('bg-[rgba(239,68,68,0.15)]')
        expect(badge?.className).toContain('border-[rgba(239,68,68,0.3)]')
        expect(badge?.className).toContain('text-[#fca5a5]')
        expect(container.textContent).toContain('Agotado')

        return true
      }),
      { numRuns: 100 }
    )
  })

  it('should render yellow badge for sin_paquete estado', () => {
    fc.assert(
      fc.property(fc.boolean(), () => {
        cleanup()
        const { container } = render(<PackageStatusBadgeProfesor estado="sin_paquete" />)

        const badge = container.querySelector('span')
        expect(badge?.className).toContain('bg-[rgba(245,158,11,0.15)]')
        expect(badge?.className).toContain('border-[rgba(245,158,11,0.3)]')
        expect(badge?.className).toContain('text-[#fcd34d]')
        expect(container.textContent).toContain('Sin paquete')

        return true
      }),
      { numRuns: 100 }
    )
  })

  it('should render purple badge for clase_prueba estado', () => {
    fc.assert(
      fc.property(fc.boolean(), () => {
        cleanup()
        const { container } = render(<PackageStatusBadgeProfesor estado="clase_prueba" />)

        const badge = container.querySelector('span')
        expect(badge?.className).toContain('bg-[rgba(124,90,248,0.15)]')
        expect(badge?.className).toContain('border-[rgba(124,90,248,0.3)]')
        expect(badge?.className).toContain('text-[#9b8afb]')
        expect(container.textContent).toContain('Clase prueba')

        return true
      }),
      { numRuns: 100 }
    )
  })

  it('should have getBadgeColorForEstado return correct colors for any estado', () => {
    fc.assert(
      fc.property(estadoPaqueteProfesorArb, (estado) => {
        const colors = getBadgeColorForEstado(estado)
        const expected = EXPECTED_COLORS[estado]

        expect(colors.bgColor).toBe(expected.bgColor)
        expect(colors.borderColor).toBe(expected.borderColor)
        expect(colors.textColor).toBe(expected.textColor)

        return true
      }),
      { numRuns: 100 }
    )
  })

  it('should include data-estado attribute for any estado', () => {
    fc.assert(
      fc.property(estadoPaqueteProfesorArb, (estado) => {
        cleanup()
        const { container } = render(<PackageStatusBadgeProfesor estado={estado} />)

        const badge = container.querySelector('span')
        expect(badge?.getAttribute('data-estado')).toBe(estado)

        return true
      }),
      { numRuns: 100 }
    )
  })
})
