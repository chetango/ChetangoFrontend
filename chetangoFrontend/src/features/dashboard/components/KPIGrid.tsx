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
      color: '#22d3ee', // Cyan vibrante
      bgColor: 'rgba(34, 211, 238, 0.1)',
      glowColor: 'rgba(34, 211, 238, 0.08)'
    },
    {
      id: 'ingresos',
      title: 'Ingresos del Mes',
      value: `$${kpis.ingresosEsteMes.toLocaleString('es-CL')}`,
      change: kpis.crecimientoIngresosMesAnterior,
      comparison: 'vs mes anterior',
      icon: DollarSign,
      color: '#22c55e', // Verde brillante para dinero
      bgColor: 'rgba(34, 197, 94, 0.1)',
      glowColor: 'rgba(34, 197, 94, 0.08)'
    },
    {
      id: 'clases',
      title: 'Clases Próximos 7 Días',
      value: kpis.clasesProximos7Dias,
      change: 0,
      comparison: `${kpis.asistenciasMes} asistencias este mes`,
      icon: Calendar,
      color: '#a855f7', // Morado más brillante
      bgColor: 'rgba(168, 85, 247, 0.1)',
      glowColor: 'rgba(168, 85, 247, 0.08)'
    },
    {
      id: 'paquetes',
      title: 'Paquetes por Vencer',
      value: kpis.paquetesPorVencer,
      change: kpis.comparativaPaquetesVendidosMesAnterior,
      comparison: 'próximos 7 días',
      icon: Package,
      color: '#fbbf24', // Amarillo más brillante
      bgColor: 'rgba(251, 191, 36, 0.1)',
      glowColor: 'rgba(251, 191, 36, 0.08)'
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
      color: '#f43f5e', // Rojo-rosa más brillante
      bgColor: 'rgba(244, 63, 94, 0.1)',
      glowColor: 'rgba(244, 63, 94, 0.08)'
    },
    {
      id: 'ganancia',
      title: 'Ganancia Neta del Mes',
      value: `$${kpis.gananciaNeta.toLocaleString('es-CL')}`,
      change: kpis.comparativaGananciaMesAnterior,
      comparison: 'vs mes anterior',
      icon: TrendingUp,
      color: kpis.gananciaNeta >= 0 ? '#22c55e' : '#f43f5e',
      bgColor: kpis.gananciaNeta >= 0 ? 'rgba(34, 197, 94, 0.1)' : 'rgba(244, 63, 94, 0.1)',
      glowColor: kpis.gananciaNeta >= 0 ? 'rgba(34, 197, 94, 0.08)' : 'rgba(244, 63, 94, 0.08)'
    }
  ]

  return (
    <>
      {/* Primera fila: 4 tarjetas principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {kpiConfigs.map((kpi) => (
          <KPICard key={kpi.id} {...kpi} />
        ))}
      </div>

      {/* Segunda fila: 2 tarjetas financieras */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {kpiConfigsFinancial.map((kpi) => (
          <KPICard key={kpi.id} {...kpi} />
        ))}
      </div>
    </>
  )
}
