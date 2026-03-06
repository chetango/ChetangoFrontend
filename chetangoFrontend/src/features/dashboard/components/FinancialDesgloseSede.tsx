// ============================================
// FINANCIAL DESGLOSE SEDE COMPONENT
// ============================================

import { GlassPanel } from '@/design-system/atoms/GlassPanel'
import { ArrowDown, ArrowUp, Building2, TrendingUp } from 'lucide-react'
import type { DashboardKPIs, FinancialPorSede } from '../types/dashboard.types'

// Paleta de colores para sedes dinámicas (rota entre los disponibles)
const SEDE_COLORS: Array<{ color: string; bgColor: string }> = [
  { color: '#10b981', bgColor: 'rgba(16, 185, 129, 0.1)' },
  { color: '#3b82f6', bgColor: 'rgba(59, 130, 246, 0.1)'  },
  { color: '#f59e0b', bgColor: 'rgba(245, 158, 11, 0.1)'  },
  { color: '#8b5cf6', bgColor: 'rgba(139, 92, 246, 0.1)'  },
  { color: '#ec4899', bgColor: 'rgba(236, 72, 153, 0.1)'  },
]

interface FinancialDesglosSedeProps {
  kpis: DashboardKPIs
}

export const FinancialDesgloseSede = ({ kpis }: FinancialDesglosSedeProps) => {
  // Usar desglose dinámico si está disponible.
  // Solo usar fallback legacy si hay datos reales (ingresos o egresos > 0) — evita mostrar
  // sedes de Chetango a otros tenants que aún no tienen SedeConfig configurado.
  const hayDatosLegacy =
    (kpis.ingresosMedellinEsteMes ?? 0) > 0 ||
    (kpis.egresosManizalesEsteMes  ?? 0) > 0 ||
    (kpis.ingresosManizalesEsteMes ?? 0) > 0 ||
    (kpis.egresosMedellinEsteMes   ?? 0) > 0

  const sedeItems: FinancialPorSede[] = kpis.ingresosEgresosPorSede?.length
    ? kpis.ingresosEgresosPorSede
    : hayDatosLegacy
      ? [
          {
            sedeValor: 1,
            nombreSede: 'Medellín',
            ingresos: kpis.ingresosMedellinEsteMes,
            egresos: kpis.egresosMedellinEsteMes,
            ganancia: kpis.ingresosMedellinEsteMes - kpis.egresosMedellinEsteMes,
          },
          {
            sedeValor: 2,
            nombreSede: 'Manizales',
            ingresos: kpis.ingresosManizalesEsteMes,
            egresos: kpis.egresosManizalesEsteMes,
            ganancia: kpis.ingresosManizalesEsteMes - kpis.egresosManizalesEsteMes,
          },
        ]
      : []

  // Si no hay sedes configuradas ni datos legacy, no renderizar el componente
  if (sedeItems.length === 0) return null

  const totalIngresos = sedeItems.reduce((sum, s) => sum + s.ingresos, 0)
  const totalEgresos  = sedeItems.reduce((sum, s) => sum + s.egresos,  0)

  const SedeCard = ({
    sede,
    color,
    bgColor,
  }: {
    sede: FinancialPorSede
    color: string
    bgColor: string
  }) => {
    const porcentajeIngresos = totalIngresos > 0 ? (sede.ingresos / totalIngresos) * 100 : 0
    const porcentajeEgresos  = totalEgresos  > 0 ? (sede.egresos  / totalEgresos)  * 100 : 0

    return (
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <Building2 className="w-5 h-5" style={{ color }} />
          <h4 className="text-[#f9fafb] text-lg font-semibold">{sede.nombreSede}</h4>
        </div>

        {/* Ingresos */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#9ca3af] text-sm">💵 Ingresos</span>
            <span className="text-[#6b7280] text-xs">{porcentajeIngresos.toFixed(0)}% del total</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-[#f9fafb] text-2xl font-bold">
              ${sede.ingresos.toLocaleString('es-CL')}
            </span>
          </div>
          <div className="mt-2 h-1.5 bg-[rgba(255,255,255,0.05)] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${porcentajeIngresos}%`, backgroundColor: color, boxShadow: `0 0 8px ${color}` }}
            />
          </div>
        </div>

        {/* Egresos */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#9ca3af] text-sm">💸 Egresos</span>
            <span className="text-[#6b7280] text-xs">{porcentajeEgresos.toFixed(0)}% del total</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-[#f9fafb] text-2xl font-bold">
              ${sede.egresos.toLocaleString('es-CL')}
            </span>
          </div>
          <div className="mt-2 h-1.5 bg-[rgba(255,255,255,0.05)] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${porcentajeEgresos}%`, backgroundColor: '#ef4444', boxShadow: '0 0 8px #ef4444' }}
            />
          </div>
        </div>

        {/* Ganancia */}
        <div
          className="p-4 rounded-lg"
          style={{ backgroundColor: bgColor, border: `1px solid ${color}30` }}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-[#9ca3af] text-sm flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              Ganancia Neta
            </span>
            {sede.ganancia >= 0 ? (
              <ArrowUp className="w-4 h-4 text-[#10b981]" />
            ) : (
              <ArrowDown className="w-4 h-4 text-[#ef4444]" />
            )}
          </div>
          <span
            className="text-xl font-bold block"
            style={{ color: sede.ganancia >= 0 ? '#10b981' : '#ef4444' }}
          >
            ${Math.abs(sede.ganancia).toLocaleString('es-CL')}
          </span>
        </div>
      </div>
    )
  }

  // Usar columnas responsivas según la cantidad de sedes
  const gridCols = sedeItems.length === 1
    ? 'grid-cols-1 max-w-md'
    : sedeItems.length === 2
      ? 'grid-cols-1 md:grid-cols-2'
      : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'

  return (
    <GlassPanel className="p-4 sm:p-6 mb-3 sm:mb-4">
      <div className="mb-4">
        <h3 className="text-[#f9fafb] text-xl font-semibold flex items-center gap-2">
          🏢 Desglose por Sede
        </h3>
        <p className="text-[#9ca3af] text-sm mt-1">Comparativa financiera entre ubicaciones</p>
      </div>

      <div className={`grid ${gridCols} gap-6`}>
        {sedeItems.map((sede, index) => {
          const palette = SEDE_COLORS[index % SEDE_COLORS.length]
          return (
            <SedeCard
              key={sede.sedeValor}
              sede={sede}
              color={palette.color}
              bgColor={palette.bgColor}
            />
          )
        })}
      </div>
    </GlassPanel>
  )
}
