// ============================================
// PROFESOR PAYMENTS PAGE
// Página de pagos y liquidaciones para profesores
// ============================================

import { GlassButton, GlassPanel, StatCard } from '@/design-system'
import { useMiResumenQuery, useMisLiquidacionesListaQuery, useMisLiquidacionesQuery } from '@/features/payroll/api/payrollQueries'
import { useModalScroll } from '@/shared/hooks'
import {
    AlertCircle,
    Calendar,
    CheckCircle,
    Clock,
    Download,
    Eye,
    FileSpreadsheet,
    TrendingUp,
    Wallet,
    X
} from 'lucide-react'
import { useState } from 'react'
import styles from '../PageStyles.module.scss'

const ProfesorPaymentsPage = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [selectedLiquidacion, setSelectedLiquidacion] = useState<string | null>(null)

  // Usar los nuevos endpoints específicos para profesores
  const { data: resumenData, isLoading: isLoadingResumen } = useMiResumenQuery()
  const resumen = resumenData?.[0]

  // Obtener lista de liquidaciones del profesor
  const { data: liquidaciones, isLoading: isLoadingLiquidaciones } = useMisLiquidacionesListaQuery(selectedYear)

  // Query para obtener detalle de liquidación seleccionada (del profesor autenticado)
  const { data: liquidacionDetalle } = useMisLiquidacionesQuery(
    { idLiquidacion: selectedLiquidacion || undefined },
    !!selectedLiquidacion
  )
  
  // Hook para manejar scroll del modal
  const modalRef = useModalScroll(!!selectedLiquidacion)

  // Generar años disponibles
  const availableYears = Array.from(
    { length: 5 },
    (_, i) => new Date().getFullYear() - i
  )

  // Formatear moneda
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount)
  }

  // Formatear mes
  const formatMonth = (mes: number) => {
    const meses = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ]
    return meses[mes - 1]
  }

  // Obtener icono según estado
  const getStateIcon = (estado: string) => {
    switch (estado) {
      case 'Pagada':
        return <CheckCircle size={18} className="text-green-600" />
      case 'Cerrada':
        return <Clock size={18} className="text-blue-600" />
      case 'EnProceso':
        return <AlertCircle size={18} className="text-yellow-600" />
      default:
        return <Clock size={18} className="text-gray-600" />
    }
  }

  // Obtener badge de estado
  const getStateBadge = (estado: string) => {
    const badges = {
      'Pagada': 'bg-green-100 text-green-800',
      'Cerrada': 'bg-blue-100 text-blue-800',
      'EnProceso': 'bg-yellow-100 text-yellow-800',
    }
    return badges[estado as keyof typeof badges] || 'bg-gray-100 text-gray-800'
  }

  // Función para descargar comprobante de pago (mock)
  const handleDownloadReceipt = (idLiquidacion: string) => {
    // TODO: Implementar descarga real desde el backend
    console.log('Downloading receipt for:', idLiquidacion)
    alert('Función de descarga en desarrollo')
  }

  if (isLoadingResumen) {
    return (
      <div className={styles['page-container']}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-[#c93448] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Cargando información de pagos...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles['page-container']}>
      {/* Header */}
      <div className={styles['page-header']}>
        <div>
          <h1 className={styles['page-title']}>
            <Wallet className="w-8 h-8" />
            Mis Pagos
          </h1>
          <p className={styles['page-subtitle']}>
            Historial de liquidaciones y pagos mensuales
          </p>
        </div>
      </div>

      {/* Resumen Financiero - Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard
          title="Total Pagado"
          value={formatCurrency(resumen?.totalPagado || 0)}
          icon={<CheckCircle className="w-6 h-6" />}
          trend={undefined}
          subtitle="Acumulado recibido en total"
        />
        <StatCard
          title="Total Liquidado"
          value={formatCurrency(resumen?.totalLiquidado || 0)}
          icon={<Clock className="w-6 h-6" />}
          trend={undefined}
          subtitle="Pendiente de pago por el admin"
        />
        <StatCard
          title="Total Aprobado"
          value={formatCurrency(resumen?.totalAprobado || 0)}
          icon={<TrendingUp className="w-6 h-6" />}
          trend={undefined}
          subtitle="Pendiente de liquidación mensual"
        />
        <StatCard
          title="Clases Pagadas"
          value={resumen?.clasesPagadas || 0}
          icon={<Calendar className="w-6 h-6" />}
          trend={undefined}
          subtitle="Total de clases finalizadas"
        />
      </div>

      {/* Mensaje si no hay datos */}
      {!resumen && (
        <GlassPanel className="mb-6">
          <div className="p-8 text-center">
            <div className="w-20 h-20 bg-[rgba(255,255,255,0.05)] rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-10 h-10 text-gray-500" />
            </div>
            <h3 className="text-white text-xl font-semibold mb-2">
              No hay información disponible
            </h3>
            <p className="text-gray-400 text-sm max-w-md mx-auto">
              Aún no tienes clases registradas o pagos procesados. Una vez que dictes clases y sean aprobadas, 
              podrás ver aquí tu historial de pagos y liquidaciones.
            </p>
          </div>
        </GlassPanel>
      )}

      {/* Historial de Liquidaciones */}
      {resumen && (
        <GlassPanel>
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white text-lg font-semibold flex items-center gap-2 mb-1">
                <FileSpreadsheet className="w-5 h-5" />
                Historial de Liquidaciones
              </h3>
              <p className="text-gray-400 text-sm">
                Consulta tus liquidaciones mensuales y descarga comprobantes
              </p>
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="year-filter" className="text-sm text-gray-400">
                Año:
              </label>
              <select
                id="year-filter"
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="px-4 py-2 bg-[rgba(255,255,255,0.05)] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#c93448] focus:border-transparent transition-all"
              >
                {availableYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="p-6">
          {isLoadingLiquidaciones ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
            </div>
          ) : liquidaciones && liquidaciones.length > 0 ? (
            <div className="space-y-4">
              {liquidaciones.map((liquidacion) => (
                  <div
                    key={liquidacion.idLiquidacion}
                    className="bg-[rgba(255,255,255,0.02)] border border-white/10 rounded-lg p-4 hover:bg-[rgba(255,255,255,0.05)] transition-all"
                  >
                    <div className="flex items-center justify-between">
                      {/* Info Principal */}
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-4">
                        <div>
                          <p className="text-gray-400 text-xs mb-1">Periodo</p>
                          <p className="text-white font-semibold">
                            {formatMonth(liquidacion.mes)} {liquidacion.año}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs mb-1">Clases</p>
                          <p className="text-white font-semibold flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {liquidacion.totalClases}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs mb-1">Horas Totales</p>
                          <p className="text-white font-semibold">
                            {liquidacion.totalHoras.toFixed(1)}h
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs mb-1">Monto</p>
                          <p className="text-[#4ade80] font-bold text-lg">
                            {formatCurrency(liquidacion.totalPagar)}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs mb-1">Estado</p>
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${getStateBadge(
                              liquidacion.estado
                            )}`}
                          >
                            {getStateIcon(liquidacion.estado)}
                            {liquidacion.estado}
                          </span>
                        </div>
                      </div>

                      {/* Acciones */}
                      <div className="flex items-center gap-2 ml-4">
                        <GlassButton
                          variant="secondary"
                          onClick={() => setSelectedLiquidacion(liquidacion.idLiquidacion)}
                          className="!p-2"
                        >
                          <Eye className="w-4 h-4" />
                        </GlassButton>
                        {liquidacion.estado === 'Pagada' && (
                          <GlassButton
                            variant="primary"
                            onClick={() => handleDownloadReceipt(liquidacion.idLiquidacion)}
                            className="!p-2"
                          >
                            <Download className="w-4 h-4" />
                          </GlassButton>
                        )}
                      </div>
                    </div>

                    {/* Fecha de Pago */}
                    {liquidacion.fechaPago && (
                      <div className="mt-3 pt-3 border-t border-white/10">
                        <p className="text-gray-400 text-xs">
                          Pagado el{' '}
                          <span className="text-white font-medium">
                            {new Date(liquidacion.fechaPago).toLocaleDateString('es-MX', {
                              day: '2-digit',
                              month: 'long',
                              year: 'numeric',
                            })}
                          </span>
                        </p>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-[rgba(255,255,255,0.05)] rounded-full flex items-center justify-center mx-auto mb-4">
                <FileSpreadsheet className="w-8 h-8 text-gray-500" />
              </div>
              <h3 className="text-white text-lg font-semibold mb-2">
                No hay liquidaciones para {selectedYear}
              </h3>
              <p className="text-gray-400 text-sm">
                Las liquidaciones aparecerán aquí una vez que se procesen tus clases
              </p>
            </div>
          )}
        </div>
      </GlassPanel>
      )}

      {/* Modal de Detalle */}
      {selectedLiquidacion && liquidacionDetalle && (
        <div 
          ref={modalRef}
          className="absolute inset-0 z-[100] flex items-start justify-center pt-20 px-4 pb-8 overflow-y-auto"
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-md -z-10"
            onClick={() => setSelectedLiquidacion(null)}
          />

          {/* Modal Content */}
          <GlassPanel className="relative z-10 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex-shrink-0 flex items-center justify-between p-6 pb-4 border-b border-white/10">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">
                  Detalle de Liquidación
                </h2>
                <p className="text-gray-400 text-sm">
                  {formatMonth(liquidacionDetalle.mes)} {liquidacionDetalle.año}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {liquidacionDetalle.fechaPago && (
                  <GlassButton
                    variant="primary"
                    onClick={() => handleDownloadReceipt(liquidacionDetalle.idLiquidacion)}
                  >
                    <Download className="w-4 h-4" />
                    <span className="hidden sm:inline">Descargar</span>
                  </GlassButton>
                )}
                <GlassButton
                  variant="icon"
                  onClick={() => setSelectedLiquidacion(null)}
                  className="!p-2"
                >
                  <X className="w-5 h-5" />
                </GlassButton>
              </div>
            </div>

            {/* Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Resumen */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-[rgba(255,255,255,0.03)] border border-white/10 rounded-lg p-4">
                  <p className="text-gray-400 text-xs mb-1">Total Clases</p>
                  <p className="text-white text-2xl font-bold">
                    {liquidacionDetalle.totalClases}
                  </p>
                </div>
                <div className="bg-[rgba(255,255,255,0.03)] border border-white/10 rounded-lg p-4">
                  <p className="text-gray-400 text-xs mb-1">Total Horas</p>
                  <p className="text-white text-2xl font-bold">
                    {liquidacionDetalle.totalHoras.toFixed(1)}h
                  </p>
                </div>
                <div className="bg-[rgba(59,130,246,0.1)] border border-[rgba(59,130,246,0.3)] rounded-lg p-4">
                  <p className="text-blue-400 text-xs mb-1">Tarifa Base</p>
                  <p className="text-white text-2xl font-bold">
                    {formatCurrency(liquidacionDetalle.totalBase)}
                  </p>
                </div>
                <div className="bg-[rgba(34,197,94,0.1)] border border-[rgba(34,197,94,0.3)] rounded-lg p-4">
                  <p className="text-green-400 text-xs mb-1">Total a Pagar</p>
                  <p className="text-white text-2xl font-bold">
                    {formatCurrency(liquidacionDetalle.totalPagar)}
                  </p>
                </div>
              </div>

              {/* Desglose de Clases */}
              <div className="mb-6">
                <h4 className="text-white text-sm font-semibold mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Desglose de Clases ({liquidacionDetalle.clases.length})
                </h4>
                <div className="space-y-2">
                  {liquidacionDetalle.clases.map((clase) => (
                    <div
                      key={clase.idClaseProfesor}
                      className="bg-[rgba(255,255,255,0.02)] border border-white/10 rounded-lg p-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-white font-medium mb-1">
                            {clase.nombreClase}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-gray-400">
                            <span>
                              {new Date(clase.fechaClase).toLocaleDateString('es-MX', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </span>
                            <span>•</span>
                            <span>{clase.rolEnClase}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-bold">
                            {formatCurrency(clase.totalPago)}
                          </p>
                          {clase.valorAdicional > 0 && (
                            <p className="text-green-400 text-xs">
                              +{formatCurrency(clase.valorAdicional)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Observaciones */}
              {liquidacionDetalle.observaciones && (
                <div className="bg-[rgba(245,158,11,0.1)] border border-[rgba(245,158,11,0.3)] rounded-lg p-4 mb-6">
                  <p className="text-yellow-400 text-xs font-semibold mb-1 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Observaciones
                  </p>
                  <p className="text-gray-300 text-sm">
                    {liquidacionDetalle.observaciones}
                  </p>
                </div>
              )}

              {/* Info de Pago */}
              {liquidacionDetalle.fechaPago && (
                <div className="bg-[rgba(34,197,94,0.1)] border border-[rgba(34,197,94,0.3)] rounded-lg p-4">
                  <p className="text-green-400 text-xs font-semibold mb-1 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Información de Pago
                  </p>
                  <p className="text-gray-300 text-sm">
                    Pagado el{' '}
                    {new Date(liquidacionDetalle.fechaPago).toLocaleDateString('es-MX', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex-shrink-0 flex items-center justify-between p-6 pt-4 border-t border-white/10 bg-black/20">
              <p className="text-gray-400 text-sm">
                💡 Descarga el comprobante para tus registros
              </p>
              {liquidacionDetalle.fechaPago && (
                <GlassButton
                  variant="primary"
                  onClick={() => handleDownloadReceipt(liquidacionDetalle.idLiquidacion)}
                >
                  <Download className="w-4 h-4" />
                  <span>Descargar Comprobante</span>
                </GlassButton>
              )}
            </div>
          </GlassPanel>
        </div>
      )}
    </div>
  )
}

export default ProfesorPaymentsPage
