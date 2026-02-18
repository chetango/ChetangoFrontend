// ============================================
// CHARTS SECTION COMPONENT
// ============================================

import { GlassPanel } from '@/design-system/atoms/GlassPanel'
import { Activity, DollarSign } from 'lucide-react'
import {
    Bar,
    BarChart,
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts'
import type { ChartData } from '../types/dashboard.types'

interface ChartsSectionProps {
  graficaAsistencias: ChartData | null
  graficaIngresos: ChartData | null
}

export const ChartsSection = ({ graficaAsistencias, graficaIngresos }: ChartsSectionProps) => {
  // Transformar datos de ChartData a formato Recharts
  const transformarDatosAsistencias = (chartData: ChartData | null) => {
    if (!chartData || !chartData.labels || !chartData.datasets[0]) return []
    
    return chartData.labels.map((label, index) => ({
      dia: label,
      alumnos: chartData.datasets[0].data[index]
    }))
  }

  const transformarDatosIngresos = (chartData: ChartData | null) => {
    if (!chartData || !chartData.labels || !chartData.datasets[0]) return []
    
    return chartData.labels.map((label, index) => ({
      mes: label,
      ingresos: chartData.datasets[0].data[index]
    }))
  }

  const datosAsistencias = transformarDatosAsistencias(graficaAsistencias)
  const datosIngresos = transformarDatosIngresos(graficaIngresos)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-5">
      
      {/* Asistencias Semana */}
      <GlassPanel className="p-3 sm:p-4">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div>
            <h3 className="text-[#f9fafb] text-base sm:text-lg font-bold mb-0.5">Asistencias de la Semana</h3>
            <p className="text-[#9ca3af] text-xs">Tendencia semanal</p>
          </div>
          <div className="p-1.5 rounded-lg bg-[rgba(52,211,153,0.15)] border border-[rgba(52,211,153,0.3)]">
            <Activity className="w-4 h-4 text-[#34d399]" />
          </div>
        </div>

        {datosAsistencias.length > 0 ? (
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={datosAsistencias}>
              <defs>
                <linearGradient id="colorAsistencias" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#34d399" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#34d399" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis 
                dataKey="dia" 
                stroke="#6b7280" 
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#6b7280" 
                style={{ fontSize: '12px' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(26, 26, 32, 0.9)', 
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '12px',
                  backdropFilter: 'blur(20px)',
                  color: '#f9fafb'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="alumnos" 
                stroke="#34d399" 
                strokeWidth={3}
                fill="url(#colorAsistencias)"
                dot={{ fill: '#34d399', r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[200px] flex items-center justify-center text-[#6b7280] text-sm">
            No hay datos de asistencias disponibles
          </div>
        )}
      </GlassPanel>

      {/* Ingresos 6 Meses */}
      <GlassPanel className="p-3 sm:p-4">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div>
            <h3 className="text-[#f9fafb] text-base sm:text-lg font-bold mb-0.5">Ingresos Últimos 6 Meses</h3>
            <p className="text-[#9ca3af] text-xs">Evolución mensual</p>
          </div>
          <div className="p-1.5 rounded-lg bg-[rgba(201,52,72,0.15)] border border-[rgba(201,52,72,0.3)]">
            <DollarSign className="w-4 h-4 text-[#c93448]" />
          </div>
        </div>

        {datosIngresos.length > 0 ? (
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={datosIngresos}>
              <defs>
                <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#c93448" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#a8243a" stopOpacity={0.6}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis 
                dataKey="mes" 
                stroke="#6b7280" 
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#6b7280" 
                style={{ fontSize: '12px' }}
                tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(26, 26, 32, 0.9)', 
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '12px',
                  backdropFilter: 'blur(20px)',
                  color: '#f9fafb'
                }}
                formatter={(value) => value ? [`$${Number(value).toLocaleString('es-CL')}`, 'Ingresos'] : ['$0', 'Ingresos']}
              />
              <Bar 
                dataKey="ingresos" 
                fill="url(#colorIngresos)" 
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[200px] flex items-center justify-center text-[#6b7280] text-sm">
            No hay datos de ingresos disponibles
          </div>
        )}
      </GlassPanel>
    </div>
  )
}
