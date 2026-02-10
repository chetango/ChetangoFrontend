// ============================================
// PACKAGES REPORT MODAL - CHETANGO
// Detailed report for package sales
// ============================================

import { CheckCircle, DollarSign, Package, XCircle } from 'lucide-react'
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts'
import type { PaquetesReporte } from '../types/reportTypes'
import { ChartWrapper } from './ChartWrapper'
import { MetricsGrid } from './MetricsGrid'
import { ReportModal } from './ReportModal'

// ============================================
// TYPES
// ============================================

interface PackagesReportModalProps {
  isOpen: boolean
  onClose: () => void
  data: PaquetesReporte | null
  isLoading?: boolean
  onExportPDF?: () => void
  onExportExcel?: () => void
  isExporting?: boolean
}

// ============================================
// CONSTANTS
// ============================================

const COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444']

// ============================================
// COMPONENT
// ============================================

export function PackagesReportModal({
  isOpen,
  onClose,
  data,
  isLoading,
  onExportPDF,
  onExportExcel,
  isExporting,
}: PackagesReportModalProps) {
  if (!data) return null

  // Prepare metrics
  const metrics = [
    {
      label: 'Total Activos',
      value: data.totalActivos || 0,
      icon: Package,
      variant: 'primary' as const,
    },
    {
      label: 'Por Vencer',
      value: data.totalPorVencer || 0,
      icon: CheckCircle,
      variant: 'warning' as const,
    },
    {
      label: 'Vencidos',
      value: data.totalVencidos || 0,
      icon: XCircle,
      variant: 'danger' as const,
    },
    {
      label: 'Agotados',
      value: data.totalAgotados || 0,
      icon: DollarSign,
      variant: 'accent' as const,
    },
  ]

  // Prepare chart data - using ChartDataDTO from backend
  const chartData = data.graficaPaquetesPorTipo
  const packagesByTypeData = chartData?.labels?.map((label, index) => ({
    tipo: label,
    cantidad: chartData.datasets[0]?.data[index] || 0,
  })) || []

  // Prepare status distribution from desgloseEstados
  const statusData = (data.desgloseEstados || []).map((estado) => ({
    name: estado.estado,
    value: estado.cantidad,
    porcentaje: estado.porcentajeDelTotal,
  }))

  return (
    <ReportModal
      isOpen={isOpen}
      onClose={onClose}
      reportType="paquetes"
      title="Reporte de Paquetes"
      onExportPDF={onExportPDF}
      onExportExcel={onExportExcel}
      isExporting={isExporting}
    >
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-white/20 border-t-white" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Metrics */}
          <MetricsGrid metrics={metrics} columns={4} />

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Packages by Type */}
            <ChartWrapper
              title="Paquetes por Tipo"
              description="Distribución de paquetes según tipo"
              height={300}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={packagesByTypeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis 
                    dataKey="tipo" 
                    stroke="#9ca3af"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis 
                    stroke="#9ca3af"
                    style={{ fontSize: '12px' }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(0, 0, 0, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      color: '#fff',
                    }}
                  />
                  <Legend />
                  <Bar 
                    dataKey="cantidad" 
                    name="Cantidad"
                    fill={COLORS[0]} 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartWrapper>

            {/* Status Distribution */}
            <ChartWrapper
              title="Distribución por Estado"
              description="Estados de paquetes"
              height={300}
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => {
                      const entry = statusData.find(e => e.name === name)
                      return `${name}: ${value} (${(entry?.porcentaje || 0).toFixed(1)}%)`
                    }}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => {
                      const colorMap: Record<string, string> = {
                        'Activo': COLORS[2],
                        'Vencido': COLORS[4],
                        'PorVencer': COLORS[3],
                        'Agotado': COLORS[1],
                      }
                      return (
                        <Cell key={`cell-${index}`} fill={colorMap[entry.name] || COLORS[index % COLORS.length]} />
                      )
                    })}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(0, 0, 0, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      color: '#fff',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartWrapper>
          </div>

          {/* Alerts Table - Packages About to Expire */}
          {(data.alertasPorVencer || []).length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">
                Alertas - Paquetes por Vencer
              </h3>
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {data.alertasPorVencer.map((alerta, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-yellow-500/20 last:border-0">
                      <div>
                        <p className="text-white font-medium">{alerta.nombreAlumno}</p>
                        <p className="text-sm text-gray-400">{alerta.nombreTipoPaquete}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-yellow-400 font-semibold">{alerta.diasRestantes} días</p>
                        <p className="text-sm text-gray-400">{alerta.clasesRestantes} clases restantes</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </ReportModal>
  )
}
