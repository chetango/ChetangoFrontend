// ============================================
// INCOME REPORT MODAL - CHETANGO
// Detailed report for income/revenue
// ============================================

import { Banknote, DollarSign, TrendingUp, Wallet } from 'lucide-react'
import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts'
import type { IngresosReporte } from '../types/reportTypes'
import { formatCurrency } from '../utils/dateHelpers'
import { ChartWrapper } from './ChartWrapper'
import { DataTable, type TableColumn } from './DataTable'
import { MetricsGrid } from './MetricsGrid'
import { ReportModal } from './ReportModal'

// ============================================
// TYPES
// ============================================

interface IncomeReportModalProps {
  isOpen: boolean
  onClose: () => void
  data: IngresosReporte | null
  isLoading?: boolean
  onExportPDF?: () => void
  onExportExcel?: () => void
  isExporting?: boolean
}

// ============================================
// CONSTANTS
// ============================================

const COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b']

// ============================================
// COMPONENT
// ============================================

export function IncomeReportModal({
  isOpen,
  onClose,
  data,
  isLoading,
  onExportPDF,
  onExportExcel,
  isExporting,
}: IncomeReportModalProps) {
  if (!data) return null

  // Prepare metrics
  const metrics = [
    {
      label: 'Total Recaudado',
      value: formatCurrency(data.totalRecaudado || 0),
      icon: DollarSign,
      variant: 'primary' as const,
    },
    {
      label: 'Cantidad Pagos',
      value: data.cantidad || 0,
      icon: Banknote,
      variant: 'success' as const,
    },
    {
      label: 'Promedio por Pago',
      value: formatCurrency(data.promedio || 0),
      icon: Wallet,
      variant: 'accent' as const,
    },
    {
      label: 'Comparativa Mes Anterior',
      value: data.comparativaMesAnterior ? `${data.comparativaMesAnterior > 0 ? '+' : ''}${data.comparativaMesAnterior.toFixed(1)}%` : 'N/A',
      icon: TrendingUp,
      variant: (data.comparativaMesAnterior || 0) >= 0 ? 'success' as const : 'danger' as const,
    },
  ]

  // Prepare chart data - using ChartDataDTO and tendenciaMensual from backend
  const chartData = data.graficaIngresosMensuales
  const monthlyData = chartData?.labels?.map((label, index) => ({
    mes: label,
    total: chartData.datasets[0]?.data[index] || 0,
  })) || []

  // Prepare payment methods data from desgloseMetodosPago
  const paymentMethodsData = (data.desgloseMetodosPago || []).map((metodo) => ({
    metodo: metodo.metodoPago,
    total: metodo.totalRecaudado,
    cantidad: metodo.cantidadPagos,
    porcentaje: metodo.porcentajeDelTotal,
  }))

  // Prepare table columns for payment methods
  const columns: TableColumn[] = [
    {
      key: 'metodoPago',
      label: 'Método de Pago',
    },
    {
      key: 'cantidadPagos',
      label: 'Cantidad',
      align: 'center',
    },
    {
      key: 'totalRecaudado',
      label: 'Total Recaudado',
      align: 'right',
      render: (row) => formatCurrency(row.totalRecaudado),
    },
    {
      key: 'porcentajeDelTotal',
      label: '% del Total',
      align: 'center',
      render: (row) => (
        <span className="font-semibold text-green-400">
          {row.porcentajeDelTotal.toFixed(1)}%
        </span>
      ),
    },
  ]

  return (
    <ReportModal
      isOpen={isOpen}
      onClose={onClose}
      reportType="ingresos"
      title="Reporte de Ingresos"
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
            {/* Monthly Income Trend */}
            <ChartWrapper
              title="Tendencia de Ingresos Mensuales"
              description="Total recaudado por mes"
              height={350}
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis 
                    dataKey="mes" 
                    stroke="#9ca3af"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis 
                    stroke="#9ca3af"
                    style={{ fontSize: '12px' }}
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(0, 0, 0, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      color: '#fff',
                    }}
                    formatter={(value?: number) => value ? formatCurrency(value) : '$0'}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="total" 
                    name="Total Ingresos"
                    stroke={COLORS[0]} 
                    strokeWidth={3}
                    dot={{ fill: COLORS[0], r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartWrapper>

            {/* Payment Methods Distribution */}
            <ChartWrapper
              title="Ingresos por Método de Pago"
              description="Distribución según forma de pago"
              height={350}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={paymentMethodsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis 
                    dataKey="metodo" 
                    stroke="#9ca3af"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis 
                    stroke="#9ca3af"
                    style={{ fontSize: '12px' }}
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(0, 0, 0, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      color: '#fff',
                    }}
                    formatter={(value?: number) => value ? formatCurrency(value) : '$0'}
                  />
                  <Legend />
                  <Bar 
                    dataKey="total" 
                    name="Total Recaudado"
                    fill={COLORS[2]} 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartWrapper>
          </div>

          {/* Payment Methods Details Table */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              Desglose por Método de Pago
            </h3>
            <DataTable
              columns={columns}
              data={data.desgloseMetodosPago || []}
              keyExtractor={(row) => row.metodoPago}
              maxHeight="300px"
            />
          </div>
        </div>
      )}
    </ReportModal>
  )
}
