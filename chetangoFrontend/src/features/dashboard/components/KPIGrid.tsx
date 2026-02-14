// ============================================
// KPI GRID COMPONENT
// ============================================

import { Calendar, CheckCircle2, DollarSign, Package, TrendingDown, TrendingUp } from 'lucide-react'
import type { DashboardKPIs } from '../types/dashboard.types'
import { KPICard } from './KPICard'

interface KPIGridProps {
  kpis: DashboardKPIs
}

export const KPIGrid = ({ kpis }: KPIGridProps) => {
  const kpiConfigs = [
    {
      id: 'asistencias',
      title: 'Asistencias Registradas Hoy',
      value: kpis.asistenciasHoy,
      change: kpis.comparativaAsistenciasMesAnterior,
      comparison: 'vs mes anterior',
      icon: CheckCircle2,
      color: '#34d399',
      bgColor: 'rgba(52, 211, 153, 0.15)',
      glowColor: 'rgba(52, 211, 153, 0.1)'
    },
    {
      id: 'ingresos',
      title: 'Ingresos del Mes',
      value: `$${kpis.ingresosEsteMes.toLocaleString('es-CL')}`,
      change: kpis.crecimientoIngresosMesAnterior,
      comparison: 'vs mes anterior',
      icon: DollarSign,
      color: '#22c55e',
      bgColor: 'rgba(34, 197, 94, 0.15)',
      glowColor: 'rgba(34, 197, 94, 0.1)'
    },
    {
      id: 'clases',
      title: 'Clases Próximos 7 Días',
      value: kpis.clasesProximos7Dias,
      change: 0,
      comparison: `${kpis.asistenciasMes} asistencias este mes`,
      icon: Calendar,
      color: '#7c5af8',
      bgColor: 'rgba(124, 90, 248, 0.15)',
      glowColor: 'rgba(124, 90, 248, 0.1)'
    },
    {
      id: 'paquetes',
      title: 'Paquetes por Vencer',
      value: kpis.paquetesPorVencer,
      change: kpis.comparativaPaquetesVendidosMesAnterior,
      comparison: 'próximos 7 días',
      icon: Package,
      color: '#f59e0b',
      bgColor: 'rgba(245, 158, 11, 0.15)',
      glowColor: 'rgba(245, 158, 11, 0.1)'
    }
  ]

  const kpiConfigsFinancial = [
    {
      id: 'egresos',
      title: 'Egresos del Mes',
      value: `$${kpis.egresosEsteMes.toLocaleString('es-CL')}`,
      change: kpis.comparativaEgresosMesAnterior,
      comparison: 'vs mes anterior',
      icon: TrendingDown,
      color: '#ef4444',
      bgColor: 'rgba(239, 68, 68, 0.15)',
      glowColor: 'rgba(239, 68, 68, 0.1)'
    },
    {
      id: 'ganancia',
      title: 'Ganancia Neta del Mes',
      value: `$${kpis.gananciaNeta.toLocaleString('es-CL')}`,
      change: kpis.comparativaGananciaMesAnterior,
      comparison: 'vs mes anterior',
      icon: TrendingUp,
      color: kpis.gananciaNeta >= 0 ? '#10b981' : '#ef4444',
      bgColor: kpis.gananciaNeta >= 0 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
      glowColor: kpis.gananciaNeta >= 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'
    }
  ]

  return (
    <>
      {/* Primera fila: 4 tarjetas principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
        {kpiConfigs.map((kpi) => (
          <KPICard key={kpi.id} {...kpi} />
        ))}
      </div>

      {/* Segunda fila: 2 tarjetas financieras */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-8 md:mb-10">
        {kpiConfigsFinancial.map((kpi) => (
          <KPICard key={kpi.id} {...kpi} />
        ))}
      </div>
    </>
  )
}
