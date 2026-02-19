// ============================================
// FINANCIAL DESGLOSE SEDE COMPONENT
// ============================================

import { GlassPanel } from '@/design-system/atoms/GlassPanel'
import { ArrowDown, ArrowUp, Building2, TrendingUp } from 'lucide-react'
import type { DashboardKPIs } from '../types/dashboard.types'

interface FinancialDesglosSedeProps {
  kpis: DashboardKPIs
}

export const FinancialDesgloseSede = ({ kpis }: FinancialDesglosSedeProps) => {
  const totalIngresos = kpis.ingresosMedellinEsteMes + kpis.ingresosManizalesEsteMes
  const totalEgresos = kpis.egresosMedellinEsteMes + kpis.egresosManizalesEsteMes

  const medellinData = {
    ingresos: kpis.ingresosMedellinEsteMes,
    egresos: kpis.egresosMedellinEsteMes,
    ganancia: kpis.ingresosMedellinEsteMes - kpis.egresosMedellinEsteMes,
    porcentajeIngresos: totalIngresos > 0 ? (kpis.ingresosMedellinEsteMes / totalIngresos) * 100 : 0,
    porcentajeEgresos: totalEgresos > 0 ? (kpis.egresosMedellinEsteMes / totalEgresos) * 100 : 0
  }

  const manizalesData = {
    ingresos: kpis.ingresosManizalesEsteMes,
    egresos: kpis.egresosManizalesEsteMes,
    ganancia: kpis.ingresosManizalesEsteMes - kpis.egresosManizalesEsteMes,
    porcentajeIngresos: totalIngresos > 0 ? (kpis.ingresosManizalesEsteMes / totalIngresos) * 100 : 0,
    porcentajeEgresos: totalEgresos > 0 ? (kpis.egresosManizalesEsteMes / totalEgresos) * 100 : 0
  }

  const SedeCard = ({
    nombre,
    data,
    color,
    bgColor
  }: {
    nombre: string
    data: typeof medellinData
    color: string
    bgColor: string
  }) => (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <Building2 className="w-5 h-5" style={{ color }} />
        <h4 className="text-[#f9fafb] text-lg font-semibold">{nombre}</h4>
      </div>

      {/* Ingresos */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[#9ca3af] text-sm">💵 Ingresos</span>
          <span className="text-[#6b7280] text-xs">{data.porcentajeIngresos.toFixed(0)}% del total</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-[#f9fafb] text-2xl font-bold">
            ${data.ingresos.toLocaleString('es-CL')}
          </span>
        </div>
        {/* Progress bar */}
        <div className="mt-2 h-1.5 bg-[rgba(255,255,255,0.05)] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${data.porcentajeIngresos}%`,
              backgroundColor: color,
              boxShadow: `0 0 8px ${color}`
            }}
          />
        </div>
      </div>

      {/* Egresos */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[#9ca3af] text-sm">💸 Egresos</span>
          <span className="text-[#6b7280] text-xs">{data.porcentajeEgresos.toFixed(0)}% del total</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-[#f9fafb] text-2xl font-bold">
            ${data.egresos.toLocaleString('es-CL')}
          </span>
        </div>
        {/* Progress bar */}
        <div className="mt-2 h-1.5 bg-[rgba(255,255,255,0.05)] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${data.porcentajeEgresos}%`,
              backgroundColor: '#ef4444',
              boxShadow: '0 0 8px #ef4444'
            }}
          />
        </div>
      </div>

      {/* Ganancia */}
      <div
        className="p-4 rounded-lg"
        style={{
          backgroundColor: bgColor,
          border: `1px solid ${color}30`
        }}
      >
        <div className="flex items-center justify-between mb-1">
          <span className="text-[#9ca3af] text-sm flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            Ganancia Neta
          </span>
          {data.ganancia >= 0 ? (
            <ArrowUp className="w-4 h-4 text-[#10b981]" />
          ) : (
            <ArrowDown className="w-4 h-4 text-[#ef4444]" />
          )}
        </div>
        <span
          className="text-xl font-bold block"
          style={{ color: data.ganancia >= 0 ? '#10b981' : '#ef4444' }}
        >
          ${Math.abs(data.ganancia).toLocaleString('es-CL')}
        </span>
      </div>
    </div>
  )

  return (
    <GlassPanel className="p-4 sm:p-6 mb-3 sm:mb-4">
      <div className="mb-4">
        <h3 className="text-[#f9fafb] text-xl font-semibold flex items-center gap-2">
          🏢 Desglose por Sede
        </h3>
        <p className="text-[#9ca3af] text-sm mt-1">Comparativa financiera entre ubicaciones</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Medellín */}
        <SedeCard
          nombre="🟢 Medellín"
          data={medellinData}
          color="#10b981"
          bgColor="rgba(16, 185, 129, 0.1)"
        />

        {/* Manizales */}
        <SedeCard
          nombre="🔵 Manizales"
          data={manizalesData}
          color="#3b82f6"
          bgColor="rgba(59, 130, 246, 0.1)"
        />
      </div>
    </GlassPanel>
  )
}
