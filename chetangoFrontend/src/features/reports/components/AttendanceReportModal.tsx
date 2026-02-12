// ============================================
// ATTENDANCE REPORT MODAL - CHETANGO
// Detailed report for attendance records
// ============================================

import { Calendar, CheckCircle, TrendingUp, XCircle } from 'lucide-react'
import {
    CartesianGrid,
    Cell,
    Legend,
    Line,
    LineChart,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts'
import type { AsistenciasReporte } from '../types/reportTypes'
import { ChartWrapper } from './ChartWrapper'
import { DataTable, type TableColumn } from './DataTable'
import { MetricsGrid } from './MetricsGrid'
import { ReportModal } from './ReportModal'

// ============================================
// TYPES
// ============================================

interface AttendanceReportModalProps {
  isOpen: boolean
  onClose: () => void
  data: AsistenciasReporte | null
  isLoading?: boolean
  onExportPDF?: () => void
  onExportExcel?: () => void
  isExporting?: boolean
}

// ============================================
// CONSTANTS
// ============================================

const COLORS = ['#10b981', '#ef4444']

// ============================================
// COMPONENT
// ============================================

export function AttendanceReportModal({
  isOpen,
  onClose,
  data,
  isLoading,
  onExportPDF,
  onExportExcel,
  isExporting,
}: AttendanceReportModalProps) {
  if (!data) return null

  // Prepare metrics
  const metrics = [
    {
      label: 'Total Asistencias',
      value: data.totalAsistencias || 0,
      icon: Calendar,
      variant: 'primary' as const,
    },
    {
      label: 'Presentes',
      value: data.presentes || 0,
      icon: CheckCircle,
      variant: 'success' as const,
    },
    {
      label: 'Ausentes',
      value: data.ausentes || 0,
      icon: XCircle,
      variant: 'danger' as const,
    },
    {
      label: 'Porcentaje Asistencia',
      value: `${(data.porcentajeAsistencia || 0).toFixed(1)}%`,
      icon: TrendingUp,
      variant: 'accent' as const,
      trend: (data.porcentajeAsistencia || 0) >= 85 ? 'Excelente' : (data.porcentajeAsistencia || 0) >= 70 ? 'Bueno' : 'Mejorar',
    },
  ]

  // Prepare chart data - using ChartDataDTO from backend
  const chartData = data.graficaAsistenciasPorDia
  const attendanceByDayData = chartData?.labels?.map((label, index) => {
    const dataset = chartData.datasets[0]
    return {
      dia: label,
      asistencias: dataset?.data[index] || 0,
    }
  }) || []

  // Prepare pie chart data
  const distributionData = [
    { name: 'Presentes', value: data.presentes || 0 },
    { name: 'Ausentes', value: data.ausentes || 0 },
  ]

  // Prepare attendance detail table
  const attendanceColumns: TableColumn[] = [
    { 
      key: 'fecha', 
      label: 'Fecha',
      render: (row) => new Date(row.fecha).toLocaleDateString('es-CO'),
    },
    { 
      key: 'nombreAlumno', 
      label: 'Alumno',
    },
    { 
      key: 'nombreClase', 
      label: 'Clase',
    },
    { 
      key: 'estado', 
      label: 'Estado',
      align: 'center',
      render: (row) => (
        <span 
          className={`px-2 py-1 rounded text-xs font-semibold ${
            row.estado === 'Presente' ? 'bg-green-500/20 text-green-400' : 
            row.estado === 'Ausente' ? 'bg-red-500/20 text-red-400' : 
            'bg-yellow-500/20 text-yellow-400'
          }`}
        >
          {row.estado}
        </span>
      ),
    },
  ]

  return (
    <ReportModal
      isOpen={isOpen}
      onClose={onClose}
      reportType="asistencias"
      title="Reporte de Asistencias"
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
              title="Asistencias por Día"
              description="Registro de asistencias diarias"
              height={300}
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={attendanceByDayData}>
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
                  <Line 
                    type="monotone" 
                    dataKey="asistencias" 
                    stroke={COLORS[0]} 
                    strokeWidth={2}
                    name="Asistencias"
                    dot={{ fill: COLORS[0], r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartWrapper>

            {/* Distribution Pie Chart */}
            <ChartWrapper
              title="Distribución General"
              description="Porcentaje de presentes vs ausentes"
              height={300}
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={distributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value, percent }) => 
                      `${name}: ${value} (${((percent || 0) * 100).toFixed(0)}%)`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {distributionData.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
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

          {/* Attendance Details Table */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              Detalle de Asistencias
            </h3>
            <DataTable
              columns={attendanceColumns}
              data={data.listaDetallada || []}
              keyExtractor={(row, index) => `${row.fecha}-${row.nombreAlumno}-${index}`}
              maxHeight="300px"
            />
          </div>
        </div>
      )}
    </ReportModal>
  )
}
