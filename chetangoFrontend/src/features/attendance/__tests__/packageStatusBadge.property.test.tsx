// ============================================
// PROPERTY-BASED TESTS - PACKAGE STATUS BADGE
// ============================================

import { cleanup, render } from '@testing-library/react'
import * as fc from 'fast-check'
import { afterEach, describe, expect, it } from 'vitest'
import { PackageStatusBadge } from '../components/admin/PackageStatusBadge'
import type { PackageState, StudentPackage } from '../types/attendanceTypes'

// Arbitrary for generating valid PackageState
const packageStateArb: fc.Arbitrary<PackageState> = fc.constantFrom(
  'Activo',
  'Agotado',
  'Congelado',
  'SinPaquete'
)

// Note: studentPackageArb is defined but used inline in tests for specific states
void packageStateArb // Used in tests below

/**
 * **Feature: admin-attendance-correction, Property 4: Package status badge rendering**
 * **Validates: Requirements 3.3, 3.4, 3.5, 3.6**
 *
 * *For any* `StudentPackage` object with `estado` value, the badge SHALL render
 * with the correct variant, icon, and text.
 */
describe('Property 4: Package status badge rendering', () => {
  afterEach(() => {
    cleanup()
  })

  it('should render green badge with package icon and description for Activo state', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 30 }).filter(s => s.trim().length > 0),
        fc.integer({ min: 1, max: 20 }),
        fc.integer({ min: 0, max: 20 }),
        (descripcion, clasesTotales, clasesUsadas) => {
          cleanup()
          const pkg: StudentPackage = {
            idPaquete: null,
            estado: 'Activo',
            descripcion,
            clasesTotales,
            clasesUsadas,
            clasesRestantes: clasesTotales - clasesUsadas,
            esCompartido: false,
            idsAlumnosCompartidos: null,
            nombresAlumnosCompartidos: null,
          }

          const { container } = render(<PackageStatusBadge package={pkg} />)

          // Should have green background styling
          const badge = container.querySelector('span')
          expect(badge?.className).toContain('bg-[rgba(52,211,153,0.15)]')
          expect(badge?.className).toContain('border-[rgba(52,211,153,0.4)]')
          expect(badge?.className).toContain('text-[#6ee7b7]')

          // Should contain package icon (svg)
          const svg = container.querySelector('svg')
          expect(svg).toBeTruthy()

          // Should display description
          expect(container.textContent).toContain(descripcion)

          // Should have progress bar
          const progressBar = container.querySelector('[style*="width"]')
          expect(progressBar).toBeTruthy()

          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should render warning badge with alert icon and "Paquete Agotado" for Agotado state', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 20 }),
        (clasesTotales) => {
          cleanup()
          const pkg: StudentPackage = {
            idPaquete: null,
            estado: 'Agotado',
            descripcion: null,
            clasesTotales,
            clasesUsadas: clasesTotales,
            clasesRestantes: 0,
            esCompartido: false,
            idsAlumnosCompartidos: null,
            nombresAlumnosCompartidos: null,
          }

          const { container } = render(<PackageStatusBadge package={pkg} />)

          // Should have warning background styling
          const badge = container.querySelector('span')
          expect(badge?.className).toContain('bg-[rgba(245,158,11,0.15)]')
          expect(badge?.className).toContain('border-[rgba(245,158,11,0.4)]')
          expect(badge?.className).toContain('text-[#fcd34d]')

          // Should contain alert icon (svg)
          const svg = container.querySelector('svg')
          expect(svg).toBeTruthy()

          // Should display "Paquete Agotado"
          expect(container.textContent).toContain('Paquete Agotado')

          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should render blue badge with snowflake icon and helper text for Congelado state', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 20 }),
        fc.integer({ min: 0, max: 20 }),
        (clasesTotales, clasesUsadas) => {
          cleanup()
          const pkg: StudentPackage = {
            idPaquete: null,
            estado: 'Congelado',
            descripcion: null,
            clasesTotales,
            clasesUsadas,
            clasesRestantes: clasesTotales - clasesUsadas,
            esCompartido: false,
            idsAlumnosCompartidos: null,
            nombresAlumnosCompartidos: null,
          }

          const { container } = render(<PackageStatusBadge package={pkg} />)

          // Should have blue background styling
          const badge = container.querySelector('span')
          expect(badge?.className).toContain('bg-[rgba(59,130,246,0.15)]')
          expect(badge?.className).toContain('border-[rgba(59,130,246,0.4)]')
          expect(badge?.className).toContain('text-[#93c5fd]')

          // Should contain snowflake icon (svg)
          const svg = container.querySelector('svg')
          expect(svg).toBeTruthy()

          // Should display "Paquete Congelado"
          expect(container.textContent).toContain('Paquete Congelado')

          // Should display helper text
          expect(container.textContent).toContain('Si marcas presente, se reactivará automáticamente')

          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should render gray badge with alert icon and "Sin paquete activo" for SinPaquete state', () => {
    fc.assert(
      fc.property(fc.boolean(), () => {
        cleanup()
        const pkg: StudentPackage = {
          idPaquete: null,
          estado: 'SinPaquete',
          descripcion: null,
          clasesTotales: null,
          clasesUsadas: null,
          clasesRestantes: null,
          esCompartido: false,
          idsAlumnosCompartidos: null,
          nombresAlumnosCompartidos: null,
        }

        const { container } = render(<PackageStatusBadge package={pkg} />)

        // Should have gray background styling
        const badge = container.querySelector('span')
        expect(badge?.className).toContain('bg-[rgba(156,163,175,0.15)]')
        expect(badge?.className).toContain('border-[rgba(156,163,175,0.4)]')
        expect(badge?.className).toContain('text-[#d1d5db]')

        // Should contain alert icon (svg)
        const svg = container.querySelector('svg')
        expect(svg).toBeTruthy()

        // Should display "Sin paquete activo"
        expect(container.textContent).toContain('Sin paquete activo')

        return true
      }),
      { numRuns: 100 }
    )
  })

  it('should render gray badge for null package', () => {
    fc.assert(
      fc.property(fc.boolean(), () => {
        cleanup()
        const { container } = render(<PackageStatusBadge package={null} />)

        // Should have gray background styling
        const badge = container.querySelector('span')
        expect(badge?.className).toContain('bg-[rgba(156,163,175,0.15)]')
        expect(badge?.className).toContain('text-[#d1d5db]')

        // Should display "Sin paquete activo"
        expect(container.textContent).toContain('Sin paquete activo')

        return true
      }),
      { numRuns: 100 }
    )
  })
})
