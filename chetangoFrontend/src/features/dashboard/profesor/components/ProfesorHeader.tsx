// ============================================
// PROFESOR HEADER COMPONENT
// ============================================

import { GlassPanel } from '@/design-system/atoms/GlassPanel'
import { Building2, Star, User } from 'lucide-react'
import { formatearFechaHoy, obtenerSaludo } from '../utils/dashboardUtils'

interface ProfesorHeaderProps {
  nombreProfesor: string
  correo?: string
  academyName?: string
  rating?: number
}

export const ProfesorHeader = ({ 
  nombreProfesor,
  academyName = 'Academia Chetango',
  rating = 4.9
}: ProfesorHeaderProps) => {
  const saludo = obtenerSaludo()
  const fecha = formatearFechaHoy()

  return (
    <header className="mb-6 sm:mb-8 md:mb-10 lg:mb-12">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 sm:gap-6">
        
        {/* Greeting */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 sm:gap-3 mb-2">
            <div className="w-2 h-2 rounded-full bg-[#7c5af8] shadow-[0_0_8px_rgba(124,90,248,0.6)] animate-pulse flex-shrink-0" />
            <p className="text-[#9ca3af] tracking-[0.15em] sm:tracking-[0.2em] uppercase text-xs sm:text-sm truncate">
              Dashboard Profesor
            </p>
          </div>
          <h1 className="text-[#f9fafb] text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3 truncate">
            {saludo}, Prof. {nombreProfesor}
          </h1>
          <p className="text-[#d1d5db] text-sm sm:text-base md:text-lg">
            Estas son tus clases y actividad de hoy – {fecha}
          </p>
        </div>

        {/* Profesor Card */}
        <GlassPanel className="p-4 sm:p-5 md:min-w-[280px] shadow-[0_8px_24px_rgba(0,0,0,0.3),0_12px_32px_rgba(124,90,248,0.15),inset_0_1px_2px_rgba(255,255,255,0.1)] border-[rgba(255,255,255,0.2)]">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-[#7c5af8] to-[#6938ef] flex items-center justify-center shadow-[0_4px_16px_rgba(124,90,248,0.4),0_8px_24px_rgba(124,90,248,0.2),inset_0_1px_2px_rgba(255,255,255,0.2),inset_0_-1px_2px_rgba(0,0,0,0.2)] border border-[rgba(255,255,255,0.15)] relative overflow-hidden flex-shrink-0">
              <div className="absolute inset-0 bg-gradient-to-br from-[rgba(255,255,255,0.15)] via-transparent to-transparent rounded-xl" />
              <User className="w-5 h-5 sm:w-6 sm:h-6 text-white relative z-10" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[#f9fafb] font-medium mb-0.5 text-sm sm:text-base truncate">{nombreProfesor}</p>
              <p className="text-[#9ca3af] text-xs sm:text-sm">Profesor</p>
            </div>
          </div>
          <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-[rgba(255,255,255,0.1)]">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <Building2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#9ca3af] flex-shrink-0" />
                <p className="text-[#d1d5db] text-xs sm:text-sm truncate">{academyName}</p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#f59e0b] fill-[#f59e0b]" />
                <span className="text-[#f59e0b] text-xs sm:text-sm font-medium">{rating}</span>
              </div>
            </div>
          </div>
        </GlassPanel>
      </div>
    </header>
  )
}
