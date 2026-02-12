// ============================================
// MODAL DETALLE PROFESOR - NÓMINA
// ============================================

import { Calendar, CheckCircle, Clock, DollarSign, TrendingDown, TrendingUp, X } from 'lucide-react'
import { useState } from 'react'
import { useClasesPorProfesorQuery } from '../api/payrollQueries'
import { formatCurrency, formatDate, getAjusteColorClass, getEstadoBadgeClasses } from '../utils'

interface DetalleProfesorModalProps {
  isOpen: boolean
  onClose: () => void
  idProfesor: string
  nombreProfesor: string
}

type TabEstado = 'todos' | 'Pendiente' | 'Aprobado' | 'Liquidado' | 'Pagado'

export const DetalleProfesorModal = ({
  isOpen,
  onClose,
  idProfesor,
  nombreProfesor,
}: DetalleProfesorModalProps) => {
  const [tabActiva, setTabActiva] = useState<TabEstado>('todos')
  const [fechaDesde, setFechaDesde] = useState<string>('')
  const [fechaHasta, setFechaHasta] = useState<string>('')

  const { data: clases, isLoading } = useClasesPorProfesorQuery(
    {
      idProfesor,
      fechaDesde: fechaDesde || undefined,
      fechaHasta: fechaHasta || undefined,
      estadoPago: tabActiva === 'todos' ? undefined : tabActiva,
    },
    isOpen
  )

  if (!isOpen) return null

  const totalesPorEstado = clases?.reduce(
    (acc, clase) => {
      acc[clase.estadoPago] = (acc[clase.estadoPago] || 0) + clase.totalPago
      acc.total += clase.totalPago
      return acc
    },
    { Pendiente: 0, Aprobado: 0, Liquidado: 0, Pagado: 0, total: 0 } as Record<string, number>
  )

  const limpiarFiltros = () => {
    setFechaDesde('')
    setFechaHasta('')
    setTabActiva('todos')
  }

  return (
    <div className="absolute inset-0 z-[100] flex items-start justify-center pt-20 px-4 pb-8 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm -z-10"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 bg-[#1a1a1a] border border-[rgba(255,255,255,0.1)] rounded-2xl shadow-2xl w-full max-w-5xl mb-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[rgba(255,255,255,0.1)]">
          <div>
            <h2 className="text-[#f9fafb] text-2xl font-bold">{nombreProfesor}</h2>
            <p className="text-[#9ca3af] text-sm mt-1">Detalle de clases y pagos</p>
          </div>
          <button
            onClick={onClose}
            className="text-[#9ca3af] hover:text-[#f9fafb] transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Estadísticas */}
        {totalesPorEstado && (
          <div className="p-6 bg-[rgba(26,26,26,0.5)] border-b border-[rgba(255,255,255,0.05)]">
            <div className="grid grid-cols-5 gap-4">
              <div className="bg-[rgba(251,191,36,0.1)] border border-[rgba(251,191,36,0.2)] rounded-lg p-4">
                <p className="text-[#9ca3af] text-xs mb-1">Pendiente</p>
                <p className="text-[#fbbf24] text-xl font-bold">{formatCurrency(totalesPorEstado.Pendiente)}</p>
              </div>
              <div className="bg-[rgba(34,197,94,0.1)] border border-[rgba(34,197,94,0.2)] rounded-lg p-4">
                <p className="text-[#9ca3af] text-xs mb-1">Aprobado</p>
                <p className="text-[#4ade80] text-xl font-bold">{formatCurrency(totalesPorEstado.Aprobado)}</p>
              </div>
              <div className="bg-[rgba(96,165,250,0.1)] border border-[rgba(96,165,250,0.2)] rounded-lg p-4">
                <p className="text-[#9ca3af] text-xs mb-1">Liquidado</p>
                <p className="text-[#60a5fa] text-xl font-bold">{formatCurrency(totalesPorEstado.Liquidado)}</p>
              </div>
              <div className="bg-[rgba(34,197,94,0.15)] border border-[rgba(34,197,94,0.3)] rounded-lg p-4">
                <p className="text-[#9ca3af] text-xs mb-1">Pagado</p>
                <p className="text-[#22c55e] text-xl font-bold">{formatCurrency(totalesPorEstado.Pagado)}</p>
              </div>
              <div className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg p-4">
                <p className="text-[#9ca3af] text-xs mb-1">Total</p>
                <p className="text-[#f9fafb] text-xl font-bold">{formatCurrency(totalesPorEstado.total)}</p>
              </div>
            </div>
          </div>
        )}

        {/* Filtros y Tabs */}
        <div className="p-6 border-b border-[rgba(255,255,255,0.05)]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="text-[#9ca3af]" size={18} />
              <span className="text-[#9ca3af] text-sm">Filtrar por fecha:</span>
              <input
                type="date"
                value={fechaDesde}
                onChange={(e) => setFechaDesde(e.target.value)}
                className="bg-[rgba(26,26,26,0.7)] border border-[rgba(255,255,255,0.1)] rounded-lg px-3 py-1.5 text-[#f9fafb] text-sm focus:outline-none focus:border-[#60a5fa]"
                placeholder="Desde"
              />
              <span className="text-[#9ca3af]">-</span>
              <input
                type="date"
                value={fechaHasta}
                onChange={(e) => setFechaHasta(e.target.value)}
                className="bg-[rgba(26,26,26,0.7)] border border-[rgba(255,255,255,0.1)] rounded-lg px-3 py-1.5 text-[#f9fafb] text-sm focus:outline-none focus:border-[#60a5fa]"
                placeholder="Hasta"
              />
              {(fechaDesde || fechaHasta || tabActiva !== 'todos') && (
                <button
                  onClick={limpiarFiltros}
                  className="ml-2 text-[#60a5fa] hover:text-[#3b82f6] text-sm transition-colors"
                >
                  Limpiar filtros
                </button>
              )}
            </div>
          </div>

          {/* Tabs de Estado */}
          <div className="flex gap-2">
            <button
              onClick={() => setTabActiva('todos')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                tabActiva === 'todos'
                  ? 'bg-[#60a5fa] text-white'
                  : 'bg-[rgba(26,26,26,0.7)] text-[#9ca3af] hover:bg-[rgba(255,255,255,0.05)]'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setTabActiva('Pendiente')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                tabActiva === 'Pendiente'
                  ? 'bg-[#fbbf24] text-white'
                  : 'bg-[rgba(26,26,26,0.7)] text-[#9ca3af] hover:bg-[rgba(255,255,255,0.05)]'
              }`}
            >
              Pendientes
            </button>
            <button
              onClick={() => setTabActiva('Aprobado')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                tabActiva === 'Aprobado'
                  ? 'bg-[#4ade80] text-white'
                  : 'bg-[rgba(26,26,26,0.7)] text-[#9ca3af] hover:bg-[rgba(255,255,255,0.05)]'
              }`}
            >
              Aprobadas
            </button>
            <button
              onClick={() => setTabActiva('Liquidado')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                tabActiva === 'Liquidado'
                  ? 'bg-[#60a5fa] text-white'
                  : 'bg-[rgba(26,26,26,0.7)] text-[#9ca3af] hover:bg-[rgba(255,255,255,0.05)]'
              }`}
            >
              Liquidadas
            </button>
            <button
              onClick={() => setTabActiva('Pagado')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                tabActiva === 'Pagado'
                  ? 'bg-[#22c55e] text-white'
                  : 'bg-[rgba(26,26,26,0.7)] text-[#9ca3af] hover:bg-[rgba(255,255,255,0.05)]'
              }`}
            >
              Pagadas
            </button>
          </div>
        </div>

        {/* Lista de Clases */}
        <div className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-[#60a5fa]/30 border-t-[#60a5fa] rounded-full animate-spin" />
            </div>
          ) : clases && clases.length > 0 ? (
            <div className="space-y-3">
              {clases.map((clase) => (
                <div
                  key={clase.idClaseProfesor}
                  className="bg-[rgba(26,26,26,0.7)] border border-[rgba(255,255,255,0.1)] rounded-lg p-4 hover:border-[rgba(255,255,255,0.2)] transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-[#f9fafb] font-medium">{clase.nombreClase}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${getEstadoBadgeClasses(clase.estadoPago)}`}>
                          {clase.estadoPago}
                        </span>
                        <span className="text-[#9ca3af] text-xs">{clase.rolEnClase}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-[#9ca3af]">
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          {formatDate(clase.fechaClase)}
                        </span>
                        {clase.fechaAprobacion && (
                          <span className="flex items-center gap-1">
                            <CheckCircle size={14} />
                            Aprobado: {formatDate(clase.fechaAprobacion)}
                          </span>
                        )}
                        {clase.fechaPago && (
                          <span className="flex items-center gap-1 text-[#22c55e]">
                            <DollarSign size={14} />
                            Pagado: {formatDate(clase.fechaPago)}
                          </span>
                        )}
                      </div>
                      {clase.conceptoAdicional && (
                        <div className="mt-2 flex items-start gap-2">
                          {clase.valorAdicional > 0 ? (
                            <TrendingUp size={16} className="text-[#22c55e] mt-0.5" />
                          ) : (
                            <TrendingDown size={16} className="text-[#ef4444] mt-0.5" />
                          )}
                          <p className="text-[#9ca3af] text-xs">{clase.conceptoAdicional}</p>
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-[#f9fafb] text-lg font-bold">{formatCurrency(clase.totalPago)}</p>
                      {clase.valorAdicional !== 0 && (
                        <p className={`text-xs mt-1 ${getAjusteColorClass(clase.valorAdicional)}`}>
                          {clase.valorAdicional > 0 ? '+' : ''}
                          {formatCurrency(clase.valorAdicional)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Clock className="mx-auto text-[#6b7280] mb-3" size={48} />
              <p className="text-[#9ca3af]">No hay clases en este estado</p>
              <p className="text-[#6b7280] text-sm mt-1">Intenta cambiar los filtros</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[rgba(255,255,255,0.1)] bg-[rgba(26,26,26,0.5)]">
          <div className="flex items-center justify-between">
            <p className="text-[#9ca3af] text-sm">
              {clases?.length || 0} clase{clases?.length !== 1 ? 's' : ''} encontrada{clases?.length !== 1 ? 's' : ''}
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.15)] text-[#f9fafb] rounded-lg font-medium transition-all"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
