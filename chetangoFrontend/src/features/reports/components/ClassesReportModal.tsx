// ============================================
// CLASSES REPORT MODAL - CHETANGO
// Detailed report for classes
// ============================================

import { Calendar, CheckCircle, TrendingUp, XCircle } from 'lucide-react'
import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts'
import type { ClasesReporte } from '../types/reportTypes'
import { ChartWrapper } from './ChartWrapper'
import { DataTable, type TableColumn } from './DataTable'
import { MetricsGrid } from './MetricsGrid'
import { ReportModal } from './ReportModal'

// ============================================
// TYPES
// ============================================

interface ClassesReportModalProps {
  isOpen: boolean
  onClose: () => void
  data: ClasesReporte | null
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

export function ClassesReportModal({
  isOpen,
  onClose,
  data,
  isLoading,
  onExportPDF,
  onExportExcel,
  isExporting,
}: ClassesReportModalProps) {
  if (!data) return null

  // Prepare metrics
  const metrics = [
    {
      label: 'Total Clases',
      value: data.totalClases || 0,
      icon: Calendar,
      variant: 'primary' as const,
    },
    {
      label: 'Promedio Asistencia',
      value: `${(data.promedioAsistencia || 0).toFixed(1)}%`,
      icon: CheckCircle,
      variant: 'success' as const,
    },
    {
      label: 'Ocupación Promedio',
      value: `${(data.ocupacionPromedio || 0).toFixed(1)}%`,
      icon: TrendingUp,
      variant: 'accent' as const,
    },
    {
      label: 'Clases Populares',
      value: (data.clasesMasPopulares || []).length,
      icon: XCircle,
      variant: 'warning' as const,
    },
  ]

  // Prepare chart data - using ChartDataDTO from backend
  const chartData = data.graficaAsistenciaPorDia
  const attendanceByDayData = chartData?.labels?.map((label, index) => ({
    dia: label,
    asistencia: chartData.datasets[0]?.data[index] || 0,
  })) || []

  const levelData = (data.desgloseporTipo || []).map((tipo) => ({
    tipo: tipo.nombreTipoClase,
    clases: tipo.cantidadClases,
    promedio: tipo.promedioAsistencia,
  }))

  // Prepare table columns
  const levelColumns: TableColumn[] = [
    {
      key: 'nombreTipoClase',
      label: 'Tipo de Clase',
    },
    {
      key: 'cantidadClases',
      label: 'Total Clases',
      align: 'center',
    },
    {
      key: 'promedioAsistencia',
      label: 'Promedio Asistencia',
      align: 'center',
      render: (row) => `${row.promedioAsistencia.toFixed(1)}%`,
    },
  ]

  return (
    <ReportModal
      isOpen={isOpen}
      onClose={onClose}
      reportType="clases"
      title="Reporte de Clases"
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
            {/* Attendance by Day */}
            <ChartWrapper
              title="Asistencia por Día"
              description="Promedio de asistencia diaria"
              height={300}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={attendanceByDayData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis 
                    dataKey="dia" 
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
                    dataKey="asistencia" 
                    name="Asistencia (%)"
                    fill={COLORS[2]} 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartWrapper>

            {/* By Type */}
            <ChartWrapper
              title="Clases por Tipo"
              description="Distribución de clases según tipo"
              height={300}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={levelData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis 
                    type="number"
                    stroke="#9ca3af"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis 
                    type="category"
                    dataKey="tipo" 
                    stroke="#9ca3af"
                    style={{ fontSize: '12px' }}
                    width={100}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(0, 0, 0, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      color: '#fff',
                    }}
                  />
                  <Bar 
                    dataKey="clases" 
                    name="Clases"
                    fill={COLORS[0]} 
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartWrapper>
          </div>

          {/* Type Details Table */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              Detalle por Tipo de Clase
            </h3>
            <DataTable
              columns={levelColumns}
              data={data.desgloseporTipo || []}
              keyExtractor={(row) => row.nombreTipoClase}
              maxHeight="300px"
            />
          </div>
        </div>
      )}
    </ReportModal>
  )
}
