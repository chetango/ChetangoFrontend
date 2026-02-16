// ============================================
// ALUMNO HEADER COMPONENT
// ============================================

import { GlassPanel } from '@/design-system/atoms/GlassPanel'
import type { DashboardAlumnoResponse } from '../types/dashboardAlumno.types'
import { formatearFechaHoy, getEstadoPaqueteBadge, obtenerIniciales, obtenerSaludo } from '../utils/dashboardUtils'

interface AlumnoHeaderProps {
  alumno: DashboardAlumnoResponse
}

export const AlumnoHeader = ({ alumno }: AlumnoHeaderProps) => {
  const saludo = obtenerSaludo()
  const fecha = formatearFechaHoy()
  const iniciales = obtenerIniciales(alumno.nombreAlumno)
  const estadoBadge = alumno.paqueteActivo 
    ? getEstadoPaqueteBadge(alumno.paqueteActivo.estado)
    : null

  return (
    <header className="mb-8 sm:mb-10 md:mb-12">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 sm:gap-6">
        
        {/* Greeting */}
        <div className="flex-1">
          <div className="flex items-center gap-2 sm:gap-3 mb-2">
            <div className="w-2 h-2 rounded-full bg-[#c93448] shadow-[0_0_8px_rgba(201,52,72,0.6)] animate-pulse" />
            <p className="text-[#9ca3af] tracking-[0.15em] sm:tracking-[0.2em] uppercase text-xs sm:text-sm">
              Mi Progreso
            </p>
          </div>
          <h1 className="text-[#f9fafb] text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3">
            {saludo}, {alumno.nombreAlumno.split(' ')[0]}
          </h1>
          <p className="text-[#d1d5db] text-base sm:text-lg">
            Tu progreso y tus próximas clases — {fecha}
          </p>
        </div>

        {/* Alumno Card - Responsive */}
        <GlassPanel className="p-4 sm:p-5 md:min-w-[280px] shadow-[0_8px_24px_rgba(0,0,0,0.3),0_12px_32px_rgba(201,52,72,0.15),inset_0_1px_2px_rgba(255,255,255,0.1)] border-[rgba(255,255,255,0.2)]">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-[#c93448] to-[#a8243a] flex items-center justify-center shadow-[0_4px_16px_rgba(201,52,72,0.4),0_8px_24px_rgba(201,52,72,0.2),inset_0_1px_2px_rgba(255,255,255,0.2),inset_0_-1px_2px_rgba(0,0,0,0.2)] border border-[rgba(255,255,255,0.15)] relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[rgba(255,255,255,0.15)] via-transparent to-transparent rounded-xl" />
              <span className="text-white font-bold text-base sm:text-lg relative z-10">{iniciales}</span>
            </div>
            <div className="flex-1">
              <p className="text-[#f9fafb] font-medium text-sm sm:text-base mb-0.5">{alumno.nombreAlumno}</p>
              <p className="text-[#9ca3af] text-xs sm:text-sm">Estudiante</p>
            </div>
          </div>
          
          {estadoBadge && (
            <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-[rgba(255,255,255,0.1)]">
              <div className="flex items-center justify-between">
                <span className="text-[#d1d5db] text-xs sm:text-sm">Estado del Paquete</span>
                <span
                  className="px-2 sm:px-3 py-1 rounded-full text-xs font-medium border"
                  style={{
                    background: estadoBadge.bg,
                    borderColor: estadoBadge.border,
                    color: estadoBadge.text
                  }}
                >
                  {estadoBadge.label}
                </span>
              </div>
            </div>
          )}
        </GlassPanel>
      </div>
    </header>
  )
}
