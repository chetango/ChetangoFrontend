// ============================================
// STUDENTS REPORT MODAL - CHETANGO
// Detailed report for students
// ============================================

import { Calendar, TrendingUp, UserCheck, Users, UserX } from 'lucide-react'
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
import type { AlumnosReporte } from '../types/reportTypes'
import { ChartWrapper } from './ChartWrapper'
import { DataTable, type TableColumn } from './DataTable'
import { MetricsGrid } from './MetricsGrid'
import { ReportModal } from './ReportModal'

// ============================================
// TYPES
// ============================================

interface StudentsReportModalProps {
  isOpen: boolean
  onClose: () => void
  data: AlumnosReporte | null
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

export function StudentsReportModal({
  isOpen,
  onClose,
  data,
  isLoading,
  onExportPDF,
  onExportExcel,
  isExporting,
}: StudentsReportModalProps) {
  // Prepare metrics
  const totalAlumnos = data ? (data.totalActivos + data.totalInactivos) : 0
  
  const metrics = data ? [
    {
      label: 'Total Alumnos',
      value: totalAlumnos,
      icon: Users,
      variant: 'primary' as const,
    },
    {
      label: 'Alumnos Activos',
      value: data.totalActivos || 0,
      icon: UserCheck,
      variant: 'success' as const,
      trend: totalAlumnos > 0 ? `${Math.round(((data.totalActivos || 0) / totalAlumnos) * 100)}%` : '0%',
    },
    {
      label: 'Alumnos Inactivos',
      value: data.totalInactivos || 0,
      icon: UserX,
      variant: 'warning' as const,
      trend: totalAlumnos > 0 ? `${Math.round(((data.totalInactivos || 0) / totalAlumnos) * 100)}%` : '0%',
    },
    {
      label: 'Nuevos Este Mes',
      value: data.nuevosEsteMes || 0,
      icon: TrendingUp,
      variant: 'accent' as const,
    },
  ] : []

  // Prepare chart data from backend ChartDataDTO
  const statusData = data ? [
    { name: 'Activos', value: data.totalActivos || 0 },
    { name: 'Inactivos', value: data.totalInactivos || 0 },
  ] : []

  const monthlyTrendData = data?.graficaAlumnosPorMes ? 
    data.graficaAlumnosPorMes.labels.map((label, index) => ({
      mes: label,
      nuevos: data.graficaAlumnosPorMes?.datasets[0]?.data[index] || 0,
    })) : []

  // Prepare table columns for inactive students
  const columnsInactivos: TableColumn[] = [
    {
      key: 'nombreAlumno',
      label: 'Alumno',
    },
    {
      key: 'correo',
      label: 'Correo',
    },
    {
      key: 'diasInactivo',
      label: 'Días Inactivo',
      align: 'center',
      render: (row) => (
        <span className={`px-2 py-1 rounded ${
          row.diasInactivo > 60 ? 'bg-red-500/20 text-red-300' : 
          row.diasInactivo > 30 ? 'bg-yellow-500/20 text-yellow-300' : 
          'bg-gray-500/20 text-gray-300'
        }`}>
          {row.diasInactivo}
        </span>
      ),
    },
    {
      key: 'ultimaAsistencia',
      label: 'Última Asistencia',
      render: (row) => row.ultimaAsistencia 
        ? new Date(row.ultimaAsistencia).toLocaleDateString('es-CO', { 
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          })
        : 'Nunca',
    },
  ]

  // Prepare table columns for students with expiring packages
  const columnsPorVencer: TableColumn[] = [
    {
      key: 'nombreAlumno',
      label: 'Alumno',
    },
    {
      key: 'correo',
      label: 'Correo',
    },
    {
      key: 'diasRestantes',
      label: 'Días Restantes',
      align: 'center',
      render: (row) => (
        <span className={`px-2 py-1 rounded ${
          row.diasRestantes <= 3 ? 'bg-red-500/20 text-red-300' : 
          row.diasRestantes <= 7 ? 'bg-yellow-500/20 text-yellow-300' : 
          'bg-green-500/20 text-green-300'
        }`}>
          {row.diasRestantes}
        </span>
      ),
    },
    {
      key: 'fechaVencimiento',
      label: 'Vencimiento',
      render: (row) => new Date(row.fechaVencimiento).toLocaleDateString('es-CO', { 
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }),
    },
  ]

  return (
    <ReportModal
      isOpen={isOpen}
      onClose={onClose}
      reportType="alumnos"
      title="Reporte de Alumnos"
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
            {/* Status Pie Chart */}
            <ChartWrapper
              title="Estado de Alumnos"
              description="Distribución entre activos e inactivos"
              height={300}
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(props: any) => {
                      const { name, percent } = props
                      return `${name || ''} ${percent ? (percent * 100).toFixed(0) : 0}%`
                    }}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((_entry, index) => (
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

            {/* Monthly Trend Line Chart */}
            <ChartWrapper
              title="Tendencia Mensual"
              description="Nuevos alumnos por mes"
              height={300}
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis 
                    dataKey="mes" 
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
                    dataKey="nuevos" 
                    name="Nuevos"
                    stroke={COLORS[0]} 
                    strokeWidth={2}
                    dot={{ fill: COLORS[0] }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartWrapper>
          </div>

          {/* Alumnos Inactivos Table */}
          {data && data.alumnosInactivos && data.alumnosInactivos.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">
                <UserX className="w-5 h-5 inline mr-2 text-yellow-400" />
                Alumnos Inactivos (sin asistencias +30 días)
              </h3>
              <DataTable
                columns={columnsInactivos}
                data={data.alumnosInactivos}
                keyExtractor={(row) => row.idAlumno}
                maxHeight="300px"
              />
            </div>
          )}

          {/* Alumnos con Paquetes por Vencer Table */}
          {data && data.alumnosPorVencer && data.alumnosPorVencer.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">
                <Calendar className="w-5 h-5 inline mr-2 text-red-400" />
                Paquetes Próximos a Vencer (7 días)
              </h3>
              <DataTable
                columns={columnsPorVencer}
                data={data.alumnosPorVencer}
                keyExtractor={(row) => row.idAlumno}
                maxHeight="300px"
              />
            </div>
          )}
        </div>
      )}
    </ReportModal>
  )
}
