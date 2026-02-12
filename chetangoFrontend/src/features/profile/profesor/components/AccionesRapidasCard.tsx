// ============================================
// ACCIONES RAPIDAS CARD COMPONENT - PROFESOR
// ============================================

import { GlassPanel } from '@/design-system/atoms/GlassPanel'
import { ROUTES } from '@/shared/constants/routes'
import { BarChart3, Calendar, ClipboardCheck, Home } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export const AccionesRapidasCard = () => {
  const navigate = useNavigate()

  const acciones = [
    {
      icon: Home,
      label: 'Ver Dashboard',
      description: 'Resumen de tus clases y estadísticas',
      onClick: () => navigate(ROUTES.TEACHER.ROOT),
      color: 'text-[#7c5af8]',
      bgColor: 'bg-[rgba(124,90,248,0.15)]',
    },
    {
      icon: Calendar,
      label: 'Mis Clases',
      description: 'Ver todas tus clases programadas',
      onClick: () => navigate(ROUTES.TEACHER.CLASSES),
      color: 'text-[#10b981]',
      bgColor: 'bg-[rgba(16,185,129,0.15)]',
    },
    {
      icon: ClipboardCheck,
      label: 'Registrar Asistencia',
      description: 'Tomar asistencia de tus clases',
      onClick: () => navigate(ROUTES.TEACHER.ATTENDANCE),
      color: 'text-[#f59e0b]',
      bgColor: 'bg-[rgba(245,158,11,0.15)]',
    },
    {
      icon: BarChart3,
      label: 'Mis Reportes',
      description: 'Estadísticas y reportes de desempeño',
      onClick: () => navigate(ROUTES.TEACHER.REPORTS),
      color: 'text-[#06b6d4]',
      bgColor: 'bg-[rgba(6,182,212,0.15)]',
    },
  ]

  return (
    <GlassPanel className="p-6">
      <h3 className="text-[#f9fafb] text-xl font-semibold mb-6">Acciones Rápidas</h3>

      <div className="space-y-3">
        {acciones.map((accion, index) => {
          const Icon = accion.icon
          return (
            <button
              key={index}
              onClick={accion.onClick}
              className="w-full flex items-center gap-4 p-4 rounded-lg bg-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.1)] transition-all duration-300 group"
            >
              <div className={`w-12 h-12 rounded-lg ${accion.bgColor} flex items-center justify-center`}>
                <Icon className={`w-6 h-6 ${accion.color}`} />
              </div>
              <div className="flex-1 text-left">
                <p className="text-[#f9fafb] font-medium group-hover:text-[#7c5af8] transition-colors">
                  {accion.label}
                </p>
                <p className="text-[#9ca3af] text-sm">{accion.description}</p>
              </div>
            </button>
          )
        })}
      </div>
    </GlassPanel>
  )
}
