// ============================================
// QUICK ACTIONS PROFESOR COMPONENT
// ============================================

import { GlassPanel } from '@/design-system/atoms/GlassPanel'
import { BarChart3, Calendar, CheckCircle2, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export const QuickActionsProfesor = () => {
  const navigate = useNavigate()

  const quickActions = [
    {
      id: 'asistencias',
      title: 'Ir a Asistencias',
      description: 'Registrar asistencia de hoy',
      icon: CheckCircle2,
      color: '#34d399',
      path: '/profesor/attendance'
    },
    {
      id: 'clases',
      title: 'Ver Mis Clases',
      description: 'Gestionar clases programadas',
      icon: Calendar,
      color: '#7c5af8',
      path: '/profesor/classes'
    },
    {
      id: 'reportes',
      title: 'Ver Reportes',
      description: 'Análisis de desempeño',
      icon: BarChart3,
      color: '#f59e0b',
      path: '/profesor/reports'
    }
  ]

  return (
    <div className="lg:col-span-1">
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <h3 className="text-[#f9fafb] text-lg sm:text-xl font-semibold">Acciones Rápidas</h3>
      </div>
      <div className="space-y-2 sm:space-y-3">
        {quickActions.map((action) => {
          const Icon = action.icon
          return (
            <GlassPanel
              key={action.id}
              className="p-3 sm:p-4 group hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer min-h-[44px]"
              onClick={() => navigate(action.path)}
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <div
                  className="p-2 sm:p-2.5 md:p-3 rounded-xl flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
                  style={{
                    background: `${action.color}26`, // 15% opacity
                    color: action.color
                  }}
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[#f9fafb] font-medium mb-0.5 text-sm sm:text-base">{action.title}</p>
                  <p className="text-[#9ca3af] text-xs sm:text-sm">{action.description}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-[#6b7280] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex-shrink-0" />
              </div>
            </GlassPanel>
          )
        })}
      </div>
    </div>
  )
}
