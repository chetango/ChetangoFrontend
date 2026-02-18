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
      title: 'Asistencias Hoy',
      value: kpis.asistenciasHoy,
      change: kpis.comparativaAsistenciasMesAnterior,
      comparison: 'vs mes anterior',
      icon: CheckCircle2,
      color: '#06b6d4', // Cyan intenso
      bgColor: 'rgba(6, 182, 212, 0.25)',
      glowColor: 'rgba(6, 182, 212, 0.5)'
    },
    {
      id: 'ingresos',
      title: 'Ingresos del Mes',
      value: `$${kpis.ingresosEsteMes.toLocaleString('es-CL')}`,
      change: kpis.crecimientoIngresosMesAnterior,
      comparison: 'vs mes anterior',
      icon: DollarSign,
      color: '#10b981', // Verde esmeralda brillante
      bgColor: 'rgba(16, 185, 129, 0.25)',
      glowColor: 'rgba(16, 185, 129, 0.5)'
    },
    {
      id: 'clases',
      title: 'Clases Próximos 7 Días',
      value: kpis.clasesProximos7Dias,
      change: kpis.comparativaAsistenciasMesAnterior,
      comparison: 'vs mes anterior',
      icon: Calendar,
      color: '#8b5cf6', // Morado violeta intenso
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
      color: '#f59e0b', // Naranja ámbar vibrante
      bgColor: 'rgba(245, 158, 11, 0.25)',
      glowColor: 'rgba(245, 158, 11, 0.5)'
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
      color: '#dc2626', // Rojo intenso vibrante
      bgColor: 'rgba(220, 38, 38, 0.25)',
      glowColor: 'rgba(220, 38, 38, 0.5)'
    },
    {
      id: 'ganancia',
      title: 'Ganancia Neta del Mes',
      value: `$${kpis.gananciaNeta.toLocaleString('es-CL')}`,
      change: kpis.comparativaGananciaMesAnterior,
      comparison: 'vs mes anterior',
      icon: TrendingUp,
      color: kpis.gananciaNeta >= 0 ? '#10b981' : '#dc2626',
      bgColor: kpis.gananciaNeta >= 0 ? 'rgba(16, 185, 129, 0.25)' : 'rgba(220, 38, 38, 0.25)',
      glowColor: kpis.gananciaNeta >= 0 ? 'rgba(16, 185, 129, 0.5)' : 'rgba(220, 38, 38, 0.5)'
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
