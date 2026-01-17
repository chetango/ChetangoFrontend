// ============================================
// PROPERTY-BASED TESTS - ATTENDANCE TOGGLE
// ============================================

import { describe, it, expect, vi, afterEach } from 'vitest'
import * as fc from 'fast-check'
import { render, cleanup } from '@testing-library/react'
import { AttendanceToggle } from '../components/admin/AttendanceToggle'

/**
 * **Feature: admin-attendance-correction, Property 5: Attendance toggle visual state**
 * **Validates: Requirements 3.7**
 *
 * *For any* `AttendanceStatus` with `estado` value, the toggle SHALL display
 * green filled for "Presente" and empty outline for "Ausente".
 */
describe('Property 5: Attendance toggle visual state', () => {
  afterEach(() => {
    cleanup()
  })

  it('should display green filled with checkmark when isPresent is true', () => {
    fc.assert(
      fc.property(fc.boolean(), (disabled) => {
        cleanup()
        const onToggle = vi.fn()
        const { container } = render(
          <AttendanceToggle isPresent={true} onToggle={onToggle} disabled={disabled} />
        )

        const button = container.querySelector('button')
        expect(button).toBeTruthy()

        // Should have green background styling (rgba(52,211,153,...))
        expect(button?.className).toContain('bg-[rgba(52,211,153,0.2)]')
        // Should have green border
        expect(button?.className).toContain('border-[rgba(52,211,153,0.5)]')
        // Should have green text color
        expect(button?.className).toContain('text-[#6ee7b7]')

        // Should contain the checkmark icon (Check component renders an svg)
        const svg = container.querySelector('svg')
        expect(svg).toBeTruthy()

        return true
      }),
      { numRuns: 100 }
    )
  })

  it('should display empty outline without checkmark when isPresent is false', () => {
    fc.assert(
      fc.property(fc.boolean(), (disabled) => {
        cleanup()
        const onToggle = vi.fn()
        const { container } = render(
          <AttendanceToggle isPresent={false} onToggle={onToggle} disabled={disabled} />
        )

        const button = container.querySelector('button')
        expect(button).toBeTruthy()

        // Should have dark background styling (empty outline)
        expect(button?.className).toContain('bg-[rgba(30,30,36,0.6)]')
        // Should have subtle border
        expect(button?.className).toContain('border-[rgba(255,255,255,0.12)]')
        // Should have gray text color
        expect(button?.className).toContain('text-[#6b7280]')

        // Should NOT contain the checkmark icon
        const svg = container.querySelector('svg')
        expect(svg).toBeNull()

        return true
      }),
      { numRuns: 100 }
    )
  })

  it('should have correct aria-pressed attribute matching isPresent state', () => {
    fc.assert(
      fc.property(fc.boolean(), (isPresent) => {
        cleanup()
        const onToggle = vi.fn()
        const { container } = render(<AttendanceToggle isPresent={isPresent} onToggle={onToggle} />)

        const button = container.querySelector('button')
        expect(button).toBeTruthy()
        expect(button?.getAttribute('aria-pressed')).toBe(String(isPresent))

        return true
      }),
      { numRuns: 100 }
    )
  })

  it('should have appropriate aria-label based on current state', () => {
    fc.assert(
      fc.property(fc.boolean(), (isPresent) => {
        cleanup()
        const onToggle = vi.fn()
        const { container } = render(<AttendanceToggle isPresent={isPresent} onToggle={onToggle} />)

        const button = container.querySelector('button')
        expect(button).toBeTruthy()
        const expectedLabel = isPresent ? 'Marcar como ausente' : 'Marcar como presente'
        expect(button?.getAttribute('aria-label')).toBe(expectedLabel)

        return true
      }),
      { numRuns: 100 }
    )
  })

  it('should apply disabled styling when disabled prop is true', () => {
    fc.assert(
      fc.property(fc.boolean(), (isPresent) => {
        cleanup()
        const onToggle = vi.fn()
        const { container } = render(
          <AttendanceToggle isPresent={isPresent} onToggle={onToggle} disabled={true} />
        )

        const button = container.querySelector('button')
        expect(button).toBeTruthy()
        expect(button?.disabled).toBe(true)
        expect(button?.className).toContain('opacity-50')
        expect(button?.className).toContain('cursor-not-allowed')

        return true
      }),
      { numRuns: 100 }
    )
  })
})
