// ============================================
// QUICK ACTION BUTTON COMPONENT
// ============================================

import type { LucideIcon } from 'lucide-react'
import { ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface QuickActionButtonProps {
  title: string
  description: string
  icon: LucideIcon
  color: string
  path: string
}

export const QuickActionButton = ({
  title,
  description,
  icon: Icon,
  color,
  path
}: QuickActionButtonProps) => {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(path)
  }

  // Convertir color hex a rgba para background
  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  }

  return (
    <div 
      className="p-4 sm:p-5 group hover:scale-[1.02] transition-all duration-300 cursor-pointer backdrop-blur-2xl bg-gradient-to-br from-[rgba(42,42,48,0.7)] to-[rgba(26,26,32,0.8)] border border-[rgba(255,255,255,0.15)] rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.5),inset_0_1px_2px_rgba(255,255,255,0.15),inset_0_-1px_2px_rgba(0,0,0,0.3)] min-h-[44px]"
      onClick={handleClick}
    >
      <div className="flex items-start gap-3 sm:gap-4">
        <div 
          className="p-2.5 sm:p-3 rounded-xl flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
          style={{ 
            background: hexToRgba(color, 0.15),
            color: color
          }}
        >
          <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[#f9fafb] font-medium mb-0.5 sm:mb-1 text-sm sm:text-base">{title}</p>
          <p className="text-[#9ca3af] text-xs sm:text-sm">{description}</p>
        </div>
        <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#6b7280] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex-shrink-0" />
      </div>
    </div>
  )
}
