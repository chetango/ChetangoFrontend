// ============================================
// REPORTS PAGE - CHETANGO
// Main reports dashboard with all report cards
// Requirements: 3.7, 3.8, 8.5, 9.3, 10.1
// ============================================

import { GlassPanel, StatCard } from '@/design-system'
import {
    useAlumnosReport,
    useAsistenciasReport,
    useClasesReport,
    useIngresosReport,
    usePaquetesReport,
} from '@/features/reports/api/reportQueries'
import {
    AttendanceReportModal,
    DateRangeFilterComponent,
    PackagesReportModal,
    ReportCard
} from '@/features/reports/components'
import { ClassesReportModal } from '@/features/reports/components/ClassesReportModal'
import { IncomeReportModal } from '@/features/reports/components/IncomeReportModal'
import { StudentsReportModal } from '@/features/reports/components/StudentsReportModal'
import { getAvailableReports, REPORT_ICONS } from '@/features/reports/config/reportsConfig'
import type { DateRangeFilter, ReportType } from '@/features/reports/types/reportTypes'
import {
    exportAttendanceExcel,
    exportClassesExcel,
    exportIncomeExcel,
    exportPackagesExcel,
    exportStudentsExcel
} from '@/features/reports/utils/excelGenerator'
import {
    exportAttendancePDF,
    exportClassesPDF,
    exportIncomePDF,
    exportPackagesPDF,
    exportStudentsPDF
} from '@/features/reports/utils/pdfGenerator'
import { AlertCircle, TrendingUp } from 'lucide-react'
import { useState } from 'react'
import type { SedeFilterValue } from '../shared/components/SedeFilter'
import { SedeFilter } from '../shared/components/SedeFilter'

// ============================================
// COMPONENT
// ============================================

const ReportsPage = () => {
  const [dateFilter, setDateFilter] = useState<DateRangeFilter>({
    preset: 'month',
    fechaDesde: undefined,
    fechaHasta: undefined,
  })

  const [sedeFilter, setSedeFilter] = useState<SedeFilterValue>('all')
  const [selectedReport, setSelectedReport] = useState<ReportType | null>(null)
  const [isExporting, setIsExporting] = useState(false)

  const availableReports = getAvailableReports()

  // ============================================
  // FETCH REPORTS DATA
  // ============================================

  const { data: alumnosData, isLoading: isLoadingAlumnos } = useAlumnosReport(dateFilter, {
    enabled: selectedReport === 'alumnos',
  })

  const { data: clasesData, isLoading: isLoadingClases } = useClasesReport(dateFilter, {
    enabled: selectedReport === 'clases',
  })

  const { data: ingresosData, isLoading: isLoadingIngresos } = useIngresosReport(dateFilter, {
    enabled: selectedReport === 'ingresos',
  })

  const { data: paquetesData, isLoading: isLoadingPaquetes } = usePaquetesReport(dateFilter, {
    enabled: selectedReport === 'paquetes',
  })

  const { data: asistenciasData, isLoading: isLoadingAsistencias } = useAsistenciasReport(dateFilter, {
    enabled: selectedReport === 'asistencias',
  })

  // ============================================
  // HANDLERS
  // ============================================

  const handleViewReport = (reportType: ReportType) => {
    console.log('Opening report:', reportType)
    setSelectedReport(reportType)
  }

  const handleCloseModal = () => {
    setSelectedReport(null)
    setIsExporting(false)
  }

  // Export handlers
  const handleExportStudentsPDF = async () => {
    if (!alumnosData) return
    setIsExporting(true)
    try {
      exportStudentsPDF(alumnosData)
    } finally {
      setIsExporting(false)
    }
  }

  const handleExportStudentsExcel = async () => {
    if (!alumnosData) return
    setIsExporting(true)
    try {
      exportStudentsExcel(alumnosData)
    } finally {
      setIsExporting(false)
    }
  }

  const handleExportClassesPDF = async () => {
    if (!clasesData) return
    setIsExporting(true)
    try {
      exportClassesPDF(clasesData)
    } finally {
      setIsExporting(false)
    }
  }

  const handleExportClassesExcel = async () => {
    if (!clasesData) return
    setIsExporting(true)
    try {
      exportClassesExcel(clasesData)
    } finally {
      setIsExporting(false)
    }
  }

  const handleExportIncomePDF = async () => {
    if (!ingresosData) return
    setIsExporting(true)
    try {
      exportIncomePDF(ingresosData)
    } finally {
      setIsExporting(false)
    }
  }

  const handleExportIncomeExcel = async () => {
    if (!ingresosData) return
    setIsExporting(true)
    try {
      exportIncomeExcel(ingresosData)
    } finally {
      setIsExporting(false)
    }
  }

  const handleExportPackagesPDF = async () => {
    if (!paquetesData) return
    setIsExporting(true)
    try {
      exportPackagesPDF(paquetesData)
    } finally {
      setIsExporting(false)
    }
  }

  const handleExportPackagesExcel = async () => {
    if (!paquetesData) return
    setIsExporting(true)
    try {
      exportPackagesExcel(paquetesData)
    } finally {
      setIsExporting(false)
    }
  }

  const handleExportAttendancePDF = async () => {
    if (!asistenciasData) return
    setIsExporting(true)
    try {
      exportAttendancePDF(asistenciasData)
    } finally {
      setIsExporting(false)
    }
  }

  const handleExportAttendanceExcel = async () => {
    if (!asistenciasData) return
    setIsExporting(true)
    try {
      exportAttendanceExcel(asistenciasData)
    } finally {
      setIsExporting(false)
    }
  }

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-[#f9fafb] text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2">📊 Reportes - Chetango</h1>
        <p className="text-[#9ca3af] text-sm sm:text-base">
          Consulta estadísticas detalladas y exporta reportes del sistema
        </p>
      </div>

      {/* Global Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <StatCard
          label="Reportes Disponibles"
          value={availableReports.length}
          icon={<TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />}
        />
        <StatCard
          label="Período Seleccionado"
          value={dateFilter.preset === 'month' ? 'Este Mes' : 'Personalizado'}
          icon={<TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />}
        />
        <StatCard
          label="Última Actualización"
          value="Hoy"
          icon={<TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />}
        />
      </div>

      {/* Date Filter */}
      <GlassPanel className="p-4 sm:p-6 mb-4 sm:mb-6">
        <h2 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">
          Filtros Globales
        </h2>
        
        {/* Sede Filter */}
        <div className="mb-4">
          <SedeFilter value={sedeFilter} onChange={setSedeFilter} variant="compact" showLabel />
        </div>

        {/* Date Range Filter */}
        <DateRangeFilterComponent
          value={dateFilter}
          onChange={setDateFilter}
          showLabel={true}
        />
        <p className="text-gray-400 text-xs sm:text-sm mt-2 sm:mt-3">
          Los filtros se aplicarán a todos los reportes que consultes
        </p>
      </GlassPanel>

      {/* Reports Grid */}
      <div className="mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">
          Reportes Disponibles
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {availableReports.map((report) => {
            const Icon = REPORT_ICONS[report.icon as keyof typeof REPORT_ICONS]
            
            return (
              <ReportCard
                key={report.id}
                id={report.id}
                title={report.title}
                description={report.description}
                icon={Icon}
                color={report.color}
                stats={[
                  { label: 'Estado', value: 'Activo' },
                  { label: 'Formato', value: 'PDF/Excel' },
                ]}
                onView={handleViewReport}
              />
            )
          })}
        </div>
      </div>

      {/* Help Section */}
      <GlassPanel className="p-4 sm:p-6">
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="
            w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0
            flex items-center justify-center
            rounded-lg
            bg-blue-500/20
            text-blue-400
          ">
            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm sm:text-base mb-2">
              ¿Cómo usar los reportes?
            </h3>
            <ul className="text-gray-400 text-xs sm:text-sm space-y-1">
              <li>• Selecciona el período de fechas que deseas consultar</li>
              <li>• Haz clic en "Ver Reporte" en cualquier tarjeta</li>
              <li>• Aplica filtros específicos dentro de cada reporte</li>
              <li>• Exporta los datos a PDF o Excel según necesites</li>
            </ul>
          </div>
        </div>
      </GlassPanel>

      {/* Report Modals */}
      <StudentsReportModal
        isOpen={selectedReport === 'alumnos'}
        onClose={handleCloseModal}
        data={alumnosData || null}
        isLoading={isLoadingAlumnos}
        onExportPDF={handleExportStudentsPDF}
        onExportExcel={handleExportStudentsExcel}
        isExporting={isExporting}
      />

      <ClassesReportModal
        isOpen={selectedReport === 'clases'}
        onClose={handleCloseModal}
        data={clasesData || null}
        isLoading={isLoadingClases}
        onExportPDF={handleExportClassesPDF}
        onExportExcel={handleExportClassesExcel}
        isExporting={isExporting}
      />

      <IncomeReportModal
        isOpen={selectedReport === 'ingresos'}
        onClose={handleCloseModal}
        data={ingresosData || null}
        isLoading={isLoadingIngresos}
        onExportPDF={handleExportIncomePDF}
        onExportExcel={handleExportIncomeExcel}
        isExporting={isExporting}
      />

      <PackagesReportModal
        isOpen={selectedReport === 'paquetes'}
        onClose={handleCloseModal}
        data={paquetesData || null}
        isLoading={isLoadingPaquetes}
        onExportPDF={handleExportPackagesPDF}
        onExportExcel={handleExportPackagesExcel}
        isExporting={isExporting}
      />

      <AttendanceReportModal
        isOpen={selectedReport === 'asistencias'}
        onClose={handleCloseModal}
        data={asistenciasData || null}
        isLoading={isLoadingAsistencias}
        onExportPDF={handleExportAttendancePDF}
        onExportExcel={handleExportAttendanceExcel}
        isExporting={isExporting}
      />
    </div>
  )
}

export default ReportsPage