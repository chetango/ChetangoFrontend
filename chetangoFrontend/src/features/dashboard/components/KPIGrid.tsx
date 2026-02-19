// ============================================
// KPI GRID COMPONENT
// ============================================

import { Calendar, CheckCircle2, DollarSign, Package, TrendingDown, TrendingUp, Users } from 'lucide-react'
import type { DashboardKPIs } from '../types/dashboard.types'
import { KPICard } from './KPICard'
import type { SedeFilter } from './TabsSedeFilter'

interface KPIGridProps {
  kpis: DashboardKPIs
  sedeFilter?: SedeFilter
}

export const KPIGrid = ({ kpis, sedeFilter = 'all' }: KPIGridProps) => {
  // Vista consolidada (Todas las sedes)
  const kpiConfigsAll = [
    {
      id: 'asistencias',
      title: 'Asistencias Hoy',
      value: kpis.asistenciasHoy,
      change: kpis.comparativaAsistenciasMesAnterior,
      comparison: 'vs mes anterior',
      icon: CheckCircle2,
      color: '#06b6d4',
      bgColor: 'rgba(6, 182, 212, 0.25)',
      glowColor: 'rgba(6, 182, 212, 0.5)'
    },
    {
      id: 'clases',
      title: 'Clases Próximos 7 Días',
      value: kpis.clasesProximos7Dias,
      change: kpis.comparativaAsistenciasMesAnterior,
      comparison: 'vs mes anterior',
      icon: Calendar,
      color: '#8b5cf6',
      bgColor: 'rgba(139, 92, 246, 0.25)',
      glowColor: 'rgba(139, 92, 246, 0.5)'
    },
    {
      id: 'paquetes',
      title: 'Paquetes por Vencer',
      value: kpis.paquetesPorVencer,
      change: kpis.comparativaPaquetesVendidosMesAnterior,
      comparison: 'próximos 7 días',
      icon: Package,
      color: '#f59e0b',
      bgColor: 'rgba(245, 158, 11, 0.25)',
      glowColor: 'rgba(245, 158, 11, 0.5)'
    },
    {
      id: 'alumnos',
      title: 'Alumnos Activos',
      value: kpis.totalAlumnosActivos,
      change: 0,
      comparison: 'total registrados',
      icon: Users,
      color: '#ec4899',
      bgColor: 'rgba(236, 72, 153, 0.25)',
      glowColor: 'rgba(236, 72, 153, 0.5)'
    }
  ]

  const kpiConfigsFinancialAll = [
    {
      id: 'ingresos',
      title: 'Ingresos Total Mes',
      value: `$${kpis.ingresosEsteMes.toLocaleString('es-CL')}`,
      change: kpis.crecimientoIngresosMesAnterior,
      comparison: 'vs mes anterior',
      icon: DollarSign,
      color: '#10b981',
      bgColor: 'rgba(16, 185, 129, 0.25)',
      glowColor: 'rgba(16, 185, 129, 0.5)'
    },
    {
      id: 'egresos',
      title: 'Egresos Total Mes',
      value: `$${kpis.egresosEsteMes.toLocaleString('es-CL')}`,
      change: kpis.comparativaEgresosMesAnterior,
      comparison: 'vs mes anterior',
      icon: TrendingDown,
      color: '#dc2626',
      bgColor: 'rgba(220, 38, 38, 0.25)',
      glowColor: 'rgba(220, 38, 38, 0.5)'
    },
    {
      id: 'ganancia',
      title: 'Ganancia Neta',
      value: `$${kpis.gananciaNeta.toLocaleString('es-CL')}`,
      change: kpis.comparativaGananciaMesAnterior,
      comparison: 'vs mes anterior',
      icon: TrendingUp,
      color: kpis.gananciaNeta >= 0 ? '#10b981' : '#dc2626',
      bgColor: kpis.gananciaNeta >= 0 ? 'rgba(16, 185, 129, 0.25)' : 'rgba(220, 38, 38, 0.25)',
      glowColor: kpis.gananciaNeta >= 0 ? 'rgba(16, 185, 129, 0.5)' : 'rgba(220, 38, 38, 0.5)'
    }
  ]

  // Vista específica de sede (Medellín o Manizales)
  const ingresosSede = sedeFilter === 'medellin' ? kpis.ingresosMedellinEsteMes : kpis.ingresosManizalesEsteMes
  const egresosSede = sedeFilter === 'medellin' ? kpis.egresosMedellinEsteMes : kpis.egresosManizalesEsteMes
  const gananciaSede = ingresosSede - egresosSede
  const sedeName = sedeFilter === 'medellin' ? 'Medellín' : 'Manizales'
  const sedeColor = sedeFilter === 'medellin' ? '#10b981' : '#3b82f6'

  const kpiConfigsSede = [
    {
      id: 'asistencias',
      title: `Asistencias Hoy ${sedeName}`,
      value: kpis.asistenciasHoy,
      change: kpis.comparativaAsistenciasMesAnterior,
      comparison: 'vs mes anterior',
      icon: CheckCircle2,
      color: '#06b6d4',
      bgColor: 'rgba(6, 182, 212, 0.25)',
      glowColor: 'rgba(6, 182, 212, 0.5)'
    },
    {
      id: 'ingresos',
      title: `Ingresos ${sedeName}`,
      value: `$${ingresosSede.toLocaleString('es-CL')}`,
      change: kpis.crecimientoIngresosMesAnterior,
      comparison: 'vs mes anterior',
      icon: DollarSign,
      color: sedeColor,
      bgColor: sedeFilter === 'medellin' ? 'rgba(16, 185, 129, 0.25)' : 'rgba(59, 130, 246, 0.25)',
      glowColor: sedeFilter === 'medellin' ? 'rgba(16, 185, 129, 0.5)' : 'rgba(59, 130, 246, 0.5)'
    },
    {
      id: 'egresos',
      title: `Egresos ${sedeName}`,
      value: `$${egresosSede.toLocaleString('es-CL')}`,
      change: kpis.comparativaEgresosMesAnterior,
      comparison: 'vs mes anterior',
      icon: TrendingDown,
      color: '#dc2626',
      bgColor: 'rgba(220, 38, 38, 0.25)',
      glowColor: 'rgba(220, 38, 38, 0.5)'
    },
    {
      id: 'ganancia',
      title: `Ganancia Neta ${sedeName}`,
      value: `$${gananciaSede.toLocaleString('es-CL')}`,
      change: kpis.comparativaGananciaMesAnterior,
      comparison: 'vs mes anterior',
      icon: TrendingUp,
      color: gananciaSede >= 0 ? '#10b981' : '#dc2626',
      bgColor: gananciaSede >= 0 ? 'rgba(16, 185, 129, 0.25)' : 'rgba(220, 38, 38, 0.25)',
      glowColor: gananciaSede >= 0 ? 'rgba(16, 185, 129, 0.5)' : 'rgba(220, 38, 38, 0.5)'
    }
  ]

  const kpiConfigsOperationalSede = [
    {
      id: 'clases',
      title: `Clases Próximos 7d`,
      value: kpis.clasesProximos7Dias,
      change: kpis.comparativaAsistenciasMesAnterior,
      comparison: 'vs mes anterior',
      icon: Calendar,
      color: '#8b5cf6',
      bgColor: 'rgba(139, 92, 246, 0.25)',
      glowColor: 'rgba(139, 92, 246, 0.5)'
    },
    {
      id: 'paquetes',
      title: 'Paquetes por Vencer',
      value: kpis.paquetesPorVencer,
      change: kpis.comparativaPaquetesVendidosMesAnterior,
      comparison: 'próximos 7 días',
      icon: Package,
      color: '#f59e0b',
      bgColor: 'rgba(245, 158, 11, 0.25)',
      glowColor: 'rgba(245, 158, 11, 0.5)'
    },
    {
      id: 'paquetes-activos',
      title: 'Paquetes Activos',
      value: kpis.paquetesActivos,
      change: 0,
      comparison: 'en uso actualmente',
      icon: Package,
      color: '#10b981',
      bgColor: 'rgba(16, 185, 129, 0.25)',
      glowColor: 'rgba(16, 185, 129, 0.5)'
    },
    {
      id: 'alumnos',
      title: 'Alumnos Activos',
      value: kpis.totalAlumnosActivos,
      change: 0,
      comparison: 'total registrados',
      icon: Users,
      color: '#ec4899',
      bgColor: 'rgba(236, 72, 153, 0.25)',
      glowColor: 'rgba(236, 72, 153, 0.5)'
    }
  ]

  // Renderizado condicional según el filtro de sede
  if (sedeFilter === 'all') {
    return (
      <>
        {/* Primera fila: 4 tarjetas principales */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 mb-2 sm:mb-3">
          {kpiConfigsAll.map((kpi) => (
            <KPICard key={kpi.id} {...kpi} />
          ))}
        </div>

        {/* Segunda fila: 3 tarjetas financieras */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-3 mb-3 sm:mb-4">
          {kpiConfigsFinancialAll.map((kpi) => (
            <KPICard key={kpi.id} {...kpi} />
          ))}
        </div>
      </>
    )
  }

  // Vista específica de sede (Medellín o Manizales)
  return (
    <>
      {/* Primera fila: 4 KPIs financieros */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 mb-2 sm:mb-3">
        {kpiConfigsSede.map((kpi) => (
          <KPICard key={kpi.id} {...kpi} />
        ))}
      </div>

      {/* Segunda fila: 4 KPIs operacionales */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 mb-3 sm:mb-4">
        {kpiConfigsOperationalSede.map((kpi) => (
          <KPICard key={kpi.id} {...kpi} />
        ))}
      </div>
    </>
  )
}
