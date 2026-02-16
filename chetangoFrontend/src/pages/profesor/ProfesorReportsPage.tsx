// ============================================
// PROFESOR REPORTS PAGE
// Dashboard de reportes para profesores
// ============================================

import { GlassPanel, StatCard } from '@/design-system'
import { useClasesReport } from '@/features/reports/api/reportQueries'
import { DateRangeFilterComponent } from '@/features/reports/components'
import type { DateRangeFilter } from '@/features/reports/types/reportTypes'
import { exportClassesExcel, exportClassesPDF } from '@/features/reports/utils'
import {
    AlertCircle,
    Award,
    BarChart3,
    Calendar,
    Download,
    FileSpreadsheet,
    TrendingUp,
    Users
} from 'lucide-react'
import { useState } from 'react'
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
    YAxis
} from 'recharts'
import styles from '../PageStyles.module.scss'

const ProfesorReportsPage = () => {
  const [dateFilter, setDateFilter] = useState<DateRangeFilter>({
    preset: 'month',
    fechaDesde: undefined,
    fechaHasta: undefined,
  })
  const [isExporting, setIsExporting] = useState(false)

  const { data: clasesData, isLoading, error } = useClasesReport(dateFilter)

  // Calcular badge de desempeño
  const getPerformanceBadge = () => {
    if (!clasesData) return { text: 'N/A', color: 'gray' }
    
    const tasaAsistencia = clasesData.promedioAsistencia || 0
    const ocupacion = clasesData.ocupacionPromedio || 0
    
    const promedio = (tasaAsistencia + ocupacion) / 2
    
    if (promedio >= 80) return { text: 'Excelente', color: '#10b981' }
    if (promedio >= 60) return { text: 'Bueno', color: '#3b82f6' }
    if (promedio >= 40) return { text: 'Regular', color: '#f59e0b' }
    return { text: 'Mejorar', color: '#ef4444' }
  }

  const performanceBadge = getPerformanceBadge()

  // Export handlers
  const handleExportPDF = async () => {
    if (!clasesData) return
    setIsExporting(true)
    try {
      await exportClassesPDF(clasesData)
    } finally {
      setIsExporting(false)
    }
  }

  const handleExportExcel = async () => {
    if (!clasesData) return
    setIsExporting(true)
    try {
      await exportClassesExcel(clasesData)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className={styles['page-container']}>
      {/* Header */}
      <div className={styles['page-header']}>
        <div>
          <h1 className={styles['page-title']}>
            <BarChart3 className="w-8 h-8" />
            Mis Reportes
          </h1>
          <p className={styles['page-subtitle']}>
            Análisis de desempeño y estadísticas de tus clases
          </p>
        </div>

        {/* Badge de Desempeño */}
        {clasesData && (
          <div
            className="px-4 py-2 rounded-full text-white font-semibold flex items-center gap-2"
            style={{ backgroundColor: performanceBadge.color }}
          >
            <Award className="w-5 h-5" />
            Desempeño: {performanceBadge.text}
          </div>
        )}
      </div>

      {/* Filtros */}
      <GlassPanel className="mb-6">
        <DateRangeFilterComponent
          value={dateFilter}
          onChange={setDateFilter}
        />
      </GlassPanel>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-[#c93448] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Cargando reportes...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <GlassPanel className="p-6">
          <div className="flex items-center gap-3 text-red-400">
            <AlertCircle className="w-6 h-6" />
            <div>
              <p className="font-semibold">Error al cargar los reportes</p>
              <p className="text-sm text-gray-400">
                Por favor, intenta de nuevo más tarde
              </p>
            </div>
          </div>
        </GlassPanel>
      )}

      {/* Dashboard Content */}
      {clasesData && !isLoading && (
        <>
          {/* Resumen Ejecutivo - Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-4 sm:mb-6">
            <StatCard
              title="Total Clases Impartidas"
              value={clasesData.totalClases.toString()}
              icon={<Calendar className="w-6 h-6" />}
              trend={undefined}
              subtitle={`${clasesData.totalClases === 1 ? 'Clase dictada' : 'Clases dictadas'} en el periodo seleccionado`}
            />
            <StatCard
              title="Asistencia Promedio"
              value={clasesData.promedioAsistencia.toFixed(1)}
              icon={<Users className="w-6 h-6" />}
              trend={undefined}
              subtitle={`${clasesData.promedioAsistencia.toFixed(1)} alumnos presentes por clase en promedio`}
            />
            <StatCard
              title="Nivel de Ocupación"
              value={`${clasesData.ocupacionPromedio.toFixed(0)}%`}
              icon={<TrendingUp className="w-6 h-6" />}
              trend={undefined}
              subtitle={`${clasesData.ocupacionPromedio.toFixed(0)}% del cupo máximo utilizado en promedio`}
            />
            <StatCard
              title="Variedad de Clases"
              value={clasesData.desgloseporTipo.length.toString()}
              icon={<BarChart3 className="w-6 h-6" />}
              trend={undefined}
              subtitle={`${clasesData.desgloseporTipo.length === 1 ? 'Tipo de clase impartido' : 'Tipos diferentes de clases impartidas'}`}
            />
          </div>

          {/* Gráficas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Gráfica de Asistencia por Día */}
            {clasesData.graficaAsistenciaPorDia && (
              <GlassPanel className="p-6">
                <h3 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Tendencia de Asistencia
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={clasesData.graficaAsistenciaPorDia.datasets[0].data.map((val, idx) => ({
                    fecha: clasesData.graficaAsistenciaPorDia!.labels[idx],
                    asistencia: val
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="fecha" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1f2937',
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="asistencia"
                      stroke="#c93448"
                      strokeWidth={2}
                      name="Asistencia"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </GlassPanel>
            )}

            {/* Desglose por Tipo de Clase */}
            {clasesData.desgloseporTipo.length > 0 && (
              <GlassPanel className="p-6">
                <h3 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Clases por Tipo
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={clasesData.desgloseporTipo.map(item => ({
                    tipo: item.nombreTipoClase,
                    total: item.cantidadClases
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="tipo" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1f2937',
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                    <Bar dataKey="total" fill="#c93448" name="Total Clases" />
                  </BarChart>
                </ResponsiveContainer>
              </GlassPanel>
            )}
          </div>

          {/* Clases Más Populares */}
          {clasesData.clasesMasPopulares.length > 0 && (
            <GlassPanel className="mb-6">
              <div className="p-6 border-b border-white/10">
                <h3 className="text-white text-lg font-semibold flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Top Clases Más Populares
                </h3>
                <p className="text-gray-400 text-sm mt-1">
                  Tus clases con mejor asistencia y ocupación
                </p>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {clasesData.clasesMasPopulares.map((clase, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-[#c93448] flex items-center justify-center text-white font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="text-white font-semibold">{clase.nombreTipoClase}</p>
                          <p className="text-gray-400 text-sm">
                            {clase.totalClases} {clase.totalClases === 1 ? 'clase' : 'clases'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="text-white font-semibold">
                            {clase.promedioAsistencia.toFixed(1)}
                          </p>
                          <p className="text-gray-400 text-xs">Promedio</p>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-semibold">
                            {clase.ocupacionPorcentaje.toFixed(0)}%
                          </p>
                          <p className="text-gray-400 text-xs">Ocupación</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </GlassPanel>
          )}

          {/* Botones de Exportar */}
          <div className="flex gap-3 justify-end">
            <button
              onClick={handleExportPDF}
              disabled={isExporting}
              className="flex items-center gap-2 px-4 py-2 bg-[#c93448] hover:bg-[#b02d3c] text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              {isExporting ? 'Exportando...' : 'Exportar PDF'}
            </button>
            <button
              onClick={handleExportExcel}
              disabled={isExporting}
              className="flex items-center gap-2 px-4 py-2 bg-[#10b981] hover:bg-[#059669] text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FileSpreadsheet className="w-4 h-4" />
              {isExporting ? 'Exportando...' : 'Exportar Excel'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default ProfesorReportsPage
