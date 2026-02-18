// ============================================
// PROFESOR KPIS COMPONENT
// ============================================

import { GlassPanel } from '@/design-system/atoms/GlassPanel'
import { BookOpen, Calendar, TrendingUp, Users } from 'lucide-react'
import type { KPIsProfesor } from '../types/dashboardProfesor.types'

interface ProfesorKPIsProps {
  kpis: KPIsProfesor
}

interface KPICardProps {
  title: string
  value: string | number
  subtitle: string
  icon: any
  color: string
  bgColor: string
}

const KPICard = ({ title, value, subtitle, icon: Icon, color, bgColor }: KPICardProps) => (
  <GlassPanel 
    className="p-3 sm:p-4 group hover:scale-[1.03] active:scale-[1.01] transition-all duration-300 cursor-pointer"
  >
    <div className="flex items-start justify-between mb-2 sm:mb-3">
      <div
        className="p-2 backdrop-blur-md rounded-xl"
        style={{
          background: bgColor,
          color: color
        }}
      >
        <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
      </div>
    </div>
    <h3 className="text-[#f9fafb] text-2xl sm:text-3xl font-bold mb-1">{value}</h3>
    <p className="text-[#9ca3af] text-xs sm:text-sm mb-0.5">{title}</p>
    <p className="text-[#6b7280] text-[10px] sm:text-xs">{subtitle}</p>
  </GlassPanel>
)

export const ProfesorKPIs = ({ kpis }: ProfesorKPIsProps) => {
  const kpiData = [
    {
      id: 'clases-mes',
      title: 'Clases Dictadas',
      value: kpis.clasesDictadasMes,
      subtitle: 'En enero 2026',
      icon: BookOpen,
      color: '#7c5af8',
      bgColor: 'rgba(124, 90, 248, 0.15)'
    },
    {
      id: 'promedio-asistencia',
      title: 'Promedio de Asistencia',
      value: `${kpis.promedioAsistencia30Dias}%`,
      subtitle: 'Últimos 30 días',
      icon: TrendingUp,
      color: '#34d399',
      bgColor: 'rgba(52, 211, 153, 0.15)'
    },
    {
      id: 'alumnos-unicos',
      title: 'Alumnos Únicos',
      value: kpis.alumnosUnicosMes,
      subtitle: 'Este mes',
      icon: Users,
      color: '#c93448',
      bgColor: 'rgba(201, 52, 72, 0.15)'
    },
    {
      id: 'clases-semana',
      title: 'Clases Esta Semana',
      value: kpis.clasesEstaSemana,
      subtitle: `${kpis.clasesCompletadasSemana} completadas`,
      icon: Calendar,
      color: '#f59e0b',
      bgColor: 'rgba(245, 158, 11, 0.15)'
    }
  ]

  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-3 sm:mb-4">
      {kpiData.map((kpi) => (
        <KPICard key={kpi.id} {...kpi} />
      ))}
    </div>
  )
}
