// ============================================
// ASISTENCIA CHART COMPONENT
// ============================================

import { GlassPanel } from '@/design-system/atoms/GlassPanel'
import { Activity, TrendingUp } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { ChartData } from '../types/dashboardProfesor.types'

interface AsistenciaChartProps {
  grafica: ChartData | null
}

export const AsistenciaChart = ({ grafica }: AsistenciaChartProps) => {
  if (!grafica || !grafica.datasets || grafica.datasets.length === 0) {
    return (
      <GlassPanel className="p-6 lg:col-span-2">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-[#f9fafb] text-xl font-semibold mb-1">Asistencia en Mis Clases</h3>
            <p className="text-[#9ca3af] text-sm">Últimos 30 días</p>
          </div>
          <div className="p-2 rounded-lg bg-[rgba(52,211,153,0.15)] border border-[rgba(52,211,153,0.3)]">
            <Activity className="w-5 h-5 text-[#34d399]" />
          </div>
        </div>
        <div className="h-[250px] flex items-center justify-center">
          <p className="text-[#9ca3af]">No hay datos disponibles</p>
        </div>
      </GlassPanel>
    )
  }

  // Transformar datos para Recharts
  const data = grafica.labels.map((label: string, index: number) => ({
    fecha: label,
    porcentaje: grafica.datasets[0]?.data[index] || 0
  }))

  return (
    <GlassPanel className="p-6 lg:col-span-2">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-[#f9fafb] text-xl font-semibold mb-1">Asistencia en Mis Clases</h3>
          <p className="text-[#9ca3af] text-sm">Últimos 30 días</p>
        </div>
        <div className="p-2 rounded-lg bg-[rgba(52,211,153,0.15)] border border-[rgba(52,211,153,0.3)]">
          <Activity className="w-5 h-5 text-[#34d399]" />
        </div>
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <defs>
            <linearGradient id="colorAsistenciaProfesor" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#34d399" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#059669" stopOpacity={0.6} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis
            dataKey="fecha"
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
          />
          <YAxis
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(26, 26, 32, 0.9)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '12px',
              backdropFilter: 'blur(20px)',
              color: '#f9fafb'
            }}
            formatter={(value: number | undefined) => value !== undefined ? [`${value}%`, 'Asistencia'] : ['0%', 'Asistencia']}
          />
          <Bar
            dataKey="porcentaje"
            fill="url(#colorAsistenciaProfesor)"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-4 flex items-center justify-center gap-2">
        <TrendingUp className="w-4 h-4 text-[#34d399]" />
        <span className="text-[#34d399] text-sm font-medium">+3% vs semana anterior</span>
      </div>
    </GlassPanel>
  )
}
