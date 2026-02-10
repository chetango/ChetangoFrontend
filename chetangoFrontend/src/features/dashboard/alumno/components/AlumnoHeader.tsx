// ============================================
// ALUMNO HEADER COMPONENT
// ============================================

import { GlassPanel } from '@/design-system/atoms/GlassPanel'
import type { DashboardAlumnoResponse } from '../types/dashboardAlumno.types'
import { getEstadoPaqueteBadge, obtenerIniciales, obtenerSaludo } from '../utils/dashboardUtils'

interface AlumnoHeaderProps {
  alumno: DashboardAlumnoResponse
}

export const AlumnoHeader = ({ alumno }: AlumnoHeaderProps) => {
  const saludo = obtenerSaludo()
  const iniciales = obtenerIniciales(alumno.nombreAlumno)
  const estadoBadge = alumno.paqueteActivo 
    ? getEstadoPaqueteBadge(alumno.paqueteActivo.estado)
    : null

  return (
    <header className="mb-10 md:mb-12">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
        
        {/* Greeting */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-2 rounded-full bg-[#c93448] shadow-[0_0_8px_rgba(201,52,72,0.6)] animate-pulse" />
            <p className="text-[#9ca3af] tracking-[0.2em] uppercase text-sm">
              Mi Progreso
            </p>
          </div>
          <h1 className="text-[#f9fafb] text-3xl md:text-4xl font-bold mb-3">
            {saludo}, {alumno.nombreAlumno.split(' ')[0]}
          </h1>
          <p className="text-[#d1d5db] text-lg">
            Tu progreso y tus próximas clases
          </p>
        </div>

        {/* Alumno Card */}
        <GlassPanel className="p-5 md:min-w-[280px]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#c93448] to-[#a8243a] flex items-center justify-center shadow-[0_4px_16px_rgba(201,52,72,0.4)]">
              <span className="text-white font-bold text-lg">{iniciales}</span>
            </div>
            <div className="flex-1">
              <p className="text-[#f9fafb] font-medium mb-0.5">{alumno.nombreAlumno}</p>
              <p className="text-[#9ca3af] text-sm">Estudiante</p>
            </div>
          </div>
          
          {estadoBadge && (
            <div className="mt-4 pt-4 border-t border-[rgba(255,255,255,0.1)]">
              <div className="flex items-center justify-between">
                <span className="text-[#d1d5db] text-sm">Estado del Paquete</span>
                <span
                  className="px-3 py-1 rounded-full text-xs font-medium border"
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
