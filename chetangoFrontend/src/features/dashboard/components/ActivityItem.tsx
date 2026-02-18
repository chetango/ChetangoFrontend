// ============================================
// ACTIVITY ITEM COMPONENT
// ============================================

import type { LucideIcon } from 'lucide-react'

interface ActivityItemProps {
  descripcion: string
  fecha: string
  icon: LucideIcon
  color: string
}

export const ActivityItem = ({
  descripcion,
  fecha,
  icon: Icon,
  color
}: ActivityItemProps) => {
  // Convertir color hex a rgba
  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  }

  // Formatear fecha relativa
  const formatearFechaRelativa = (fechaString: string) => {
    const fecha = new Date(fechaString)
    const ahora = new Date()
    const diff = ahora.getTime() - fecha.getTime()
    
    const minutos = Math.floor(diff / 60000)
    const horas = Math.floor(diff / 3600000)
    const dias = Math.floor(diff / 86400000)

    if (minutos < 1) return 'Hace un momento'
    if (minutos < 60) return `Hace ${minutos} minuto${minutos > 1 ? 's' : ''}`
    if (horas < 24) return `Hace ${horas} hora${horas > 1 ? 's' : ''}`
    return `Hace ${dias} día${dias > 1 ? 's' : ''}`
  }

  return (
    <div className="flex items-start gap-3 pb-3 border-b border-[rgba(255,255,255,0.05)] last:border-b-0 last:pb-0">
      {/* Icon */}
      <div 
        className="p-2 rounded-lg flex-shrink-0"
        style={{ 
          background: hexToRgba(color, 0.15),
          color: color
        }}
      >
        <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-[#f9fafb] text-xs sm:text-sm mb-0.5">{descripcion}</p>
        <p className="text-[#6b7280] text-[10px] sm:text-xs">{formatearFechaRelativa(fecha)}</p>
      </div>

      {/* Status Indicator */}
      <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5" style={{ background: color }} />
    </div>
  )
}
