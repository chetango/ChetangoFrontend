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
    <header className="mb-10 md:mb-12">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
        
        {/* Greeting */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-2 rounded-full bg-[#7c5af8] shadow-[0_0_8px_rgba(124,90,248,0.6)] animate-pulse" />
            <p className="text-[#9ca3af] tracking-[0.2em] uppercase text-sm">
              Dashboard Profesor
            </p>
          </div>
          <h1 className="text-[#f9fafb] text-3xl md:text-4xl font-bold mb-3">
            {saludo}, Prof. {nombreProfesor}
          </h1>
          <p className="text-[#d1d5db] text-lg">
            Estas son tus clases y actividad de hoy – {fecha}
          </p>
        </div>

        {/* Profesor Card */}
        <GlassPanel className="p-5 md:min-w-[280px]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#7c5af8] to-[#6938ef] flex items-center justify-center shadow-[0_4px_16px_rgba(124,90,248,0.4)]">
              <User className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-[#f9fafb] font-medium mb-0.5">{nombreProfesor}</p>
              <p className="text-[#9ca3af] text-sm">Profesor</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-[rgba(255,255,255,0.1)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#9ca3af]" />
                <p className="text-[#d1d5db] text-sm">{academyName}</p>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-[#f59e0b] fill-[#f59e0b]" />
                <span className="text-[#f59e0b] text-sm font-medium">{rating}</span>
              </div>
            </div>
          </div>
        </GlassPanel>
      </div>
    </header>
  )
}
