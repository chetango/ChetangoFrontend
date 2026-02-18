// ============================================
// QUICK ACTION BUTTON COMPONENT
// ============================================

import type { LucideIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface QuickActionButtonProps {
  title: string
  icon: LucideIcon
  color: string
  path: string
}

export const QuickActionButton = ({
  title,
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
      className="group hover:scale-[1.02] transition-all duration-200 cursor-pointer backdrop-blur-2xl bg-gradient-to-br from-[rgba(42,42,48,0.7)] to-[rgba(26,26,32,0.8)] border border-[rgba(255,255,255,0.1)] rounded-xl shadow-lg min-h-[80px] flex flex-col items-center justify-center p-3 min-w-[90px] flex-shrink-0"
      onClick={handleClick}
    >
      <div 
        className="w-10 h-10 rounded-full flex items-center justify-center mb-1.5 transition-transform duration-200 group-hover:scale-105"
        style={{ 
          background: hexToRgba(color, 0.15),
          color: color
        }}
      >
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-[#f9fafb] font-medium text-[10px] sm:text-xs text-center leading-tight">{title}</p>
    </div>
  )
}
