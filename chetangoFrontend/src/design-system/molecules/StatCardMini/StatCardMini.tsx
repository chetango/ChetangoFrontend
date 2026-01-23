// ============================================
// STAT CARD MINI COMPONENT - Per Figma Design
// ============================================

import { type ReactNode } from 'react'

interface StatCardMiniProps {
  icon: ReactNode
  label: string
  value: number | string
  position?: string
  delay?: string
}

/**
 * Floating stat card with glassmorphism effect
 * Used for floating stats on the right side of the page
 * 
 * Per Figma: positioned absolutely with animation delay
 */
export function StatCardMini({ 
  icon, 
  label, 
  value, 
  position = 'top-[12%] right-[3%]',
  delay = '0s'
}: StatCardMiniProps) {
  return (
    <div
      className={`
        fixed ${position}
        z-20
        backdrop-blur-xl
        bg-[rgba(42,42,48,0.6)]
        border border-[rgba(255,255,255,0.12)]
        rounded-2xl
        px-5 py-4
        shadow-[0_8px_24px_rgba(0,0,0,0.3)]
        animate-float
        hidden xl:flex
        items-center gap-3
      `}
      style={{ animationDelay: delay }}
    >
      <div className="p-2.5 rounded-lg bg-[rgba(255,255,255,0.05)]">
        {icon}
      </div>
      <div>
        <p className="text-[#9ca3af] text-[12px]">{label}</p>
        <p className="text-[#f9fafb] font-semibold text-[18px]">{value}</p>
      </div>
    </div>
  )
}
