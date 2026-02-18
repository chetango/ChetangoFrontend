// ============================================
// ALERT ITEM COMPONENT
// ============================================

import type { LucideIcon } from 'lucide-react'
import type { PrioridadAlerta } from '../types/dashboard.types'

interface AlertItemProps {
  tipo: string
  titulo: string
  descripcion: string
  prioridad: PrioridadAlerta
  icon: LucideIcon
  onAction?: () => void
}

export const AlertItem = ({
  titulo,
  descripcion,
  prioridad,
  icon: Icon,
  onAction
}: AlertItemProps) => {
  const alertColors = {
    Alta: { 
      bg: 'rgba(239, 68, 68, 0.15)', 
      border: 'rgba(239, 68, 68, 0.3)', 
      text: '#fca5a5',
      icon: '#ef4444'
    },
    Media: { 
      bg: 'rgba(245, 158, 11, 0.15)', 
      border: 'rgba(245, 158, 11, 0.3)', 
      text: '#fcd34d',
      icon: '#f59e0b'
    },
    Baja: { 
      bg: 'rgba(59, 130, 246, 0.15)', 
      border: 'rgba(59, 130, 246, 0.3)', 
      text: '#93c5fd',
      icon: '#3b82f6'
    }
  }

  const colors = alertColors[prioridad] || alertColors.Media

  // Convertir color hex a rgba para background del icon
  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  }

  return (
    <div 
      className="p-3 sm:p-4 rounded-xl backdrop-blur-xl border transition-all duration-200 hover:scale-[1.01] cursor-pointer group"
      style={{ 
        background: colors.bg,
        borderColor: colors.border
      }}
      onClick={onAction}
    >
      <div className="flex items-start gap-2 sm:gap-3">
        <div 
          className="p-1.5 sm:p-2 rounded-lg flex-shrink-0"
          style={{ 
            background: hexToRgba(colors.icon, 0.2)
          }}
        >
          <Icon className="w-4 h-4" style={{ color: colors.icon }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[#f9fafb] text-xs sm:text-sm font-medium mb-0.5 sm:mb-1">{titulo}</p>
          <p className="text-[#9ca3af] text-[10px] sm:text-xs">{descripcion}</p>
        </div>
      </div>
    </div>
  )
}
