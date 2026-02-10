// ============================================
// KPI GRID COMPONENT
// ============================================

import { Calendar, CheckCircle2, DollarSign, Package } from 'lucide-react'
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
      color: '#c93448',
      bgColor: 'rgba(201, 52, 72, 0.15)',
      glowColor: 'rgba(201, 52, 72, 0.1)'
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

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-10">
      {kpiConfigs.map((kpi) => (
        <KPICard key={kpi.id} {...kpi} />
      ))}
    </div>
  )
}
