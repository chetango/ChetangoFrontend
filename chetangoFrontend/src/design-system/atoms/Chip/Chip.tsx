// ============================================
// CHIP COMPONENT - Per Figma Design
// ============================================

import { type ReactNode } from 'react'

interface ChipProps {
  children: ReactNode
  variant: 'active' | 'depleted' | 'frozen' | 'none' | 'trial'
  className?: string
}

/**
 * Chip component for package status badges
 * Per Figma design with glassmorphism effect
 * 
 * Variants:
 * - active: green (paquete activo)
 * - depleted: orange/yellow (paquete agotado)
 * - frozen: blue (paquete congelado)
 * - none: gray (sin paquete)
 * - trial: purple (clase prueba)
 */
export function Chip({ children, variant, className = '' }: ChipProps) {
  const variantStyles = {
    active: `
      bg-[rgba(52,211,153,0.15)]
      border-[rgba(52,211,153,0.4)]
      text-[#6ee7b7]
      shadow-[0_4px_12px_rgba(52,211,153,0.2),inset_0_1px_1px_rgba(52,211,153,0.3)]
    `,
    depleted: `
      bg-[rgba(245,158,11,0.15)]
      border-[rgba(245,158,11,0.4)]
      text-[#fcd34d]
      shadow-[0_4px_12px_rgba(245,158,11,0.2),inset_0_1px_1px_rgba(245,158,11,0.3)]
    `,
    frozen: `
      bg-[rgba(59,130,246,0.15)]
      border-[rgba(59,130,246,0.4)]
      text-[#93c5fd]
      shadow-[0_4px_12px_rgba(59,130,246,0.2),inset_0_1px_1px_rgba(59,130,246,0.3)]
    `,
    none: `
      bg-[rgba(156,163,175,0.15)]
      border-[rgba(156,163,175,0.4)]
      text-[#d1d5db]
      shadow-[0_4px_12px_rgba(156,163,175,0.2),inset_0_1px_1px_rgba(156,163,175,0.3)]
    `,
    trial: `
      bg-[rgba(124,90,248,0.15)]
      border-[rgba(124,90,248,0.4)]
      text-[#a78bfa]
      shadow-[0_4px_12px_rgba(124,90,248,0.2),inset_0_1px_1px_rgba(124,90,248,0.3)]
    `
  }

  return (
    <span
      className={`
        inline-flex items-center gap-1.5
        px-3 py-1.5
        backdrop-blur-xl
        border
        rounded-lg
        ${variantStyles[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  )
}
