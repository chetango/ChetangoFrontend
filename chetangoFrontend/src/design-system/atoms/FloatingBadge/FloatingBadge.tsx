// ============================================
// FLOATING BADGE COMPONENT - Per Figma Design
// ============================================

import { type ReactNode } from 'react'

interface FloatingBadgeProps {
  children: ReactNode
  color?: 'primary' | 'success' | 'warning' | 'info'
  className?: string
  icon?: ReactNode
}

/**
 * Floating badge with glassmorphism effect
 * Used for section labels like "Registro de Asistencia"
 * 
 * Per Figma: backdrop-blur, semi-transparent bg, colored border
 */
export function FloatingBadge({ 
  children, 
  color = 'primary',
  className = '',
  icon
}: FloatingBadgeProps) {
  const colorStyles = {
    primary: {
      bg: 'bg-[rgba(201,52,72,0.15)]',
      border: 'border-[rgba(201,52,72,0.3)]',
      text: 'text-[#e54d5e]',
      shadow: 'shadow-[0_4px_16px_rgba(201,52,72,0.2)]'
    },
    success: {
      bg: 'bg-[rgba(52,211,153,0.15)]',
      border: 'border-[rgba(52,211,153,0.3)]',
      text: 'text-[#6ee7b7]',
      shadow: 'shadow-[0_4px_16px_rgba(52,211,153,0.2)]'
    },
    warning: {
      bg: 'bg-[rgba(245,158,11,0.15)]',
      border: 'border-[rgba(245,158,11,0.3)]',
      text: 'text-[#fcd34d]',
      shadow: 'shadow-[0_4px_16px_rgba(245,158,11,0.2)]'
    },
    info: {
      bg: 'bg-[rgba(59,130,246,0.15)]',
      border: 'border-[rgba(59,130,246,0.3)]',
      text: 'text-[#93c5fd]',
      shadow: 'shadow-[0_4px_16px_rgba(59,130,246,0.2)]'
    }
  }

  const styles = colorStyles[color]

  return (
    <div
      className={`
        inline-flex items-center gap-2
        px-4 py-2
        rounded-full
        backdrop-blur-xl
        ${styles.bg}
        border ${styles.border}
        ${styles.text}
        text-sm font-medium
        ${styles.shadow}
        ${className}
      `}
    >
      {icon}
      {children}
    </div>
  )
}
