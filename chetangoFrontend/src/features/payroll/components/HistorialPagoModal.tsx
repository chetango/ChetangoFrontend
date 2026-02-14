// ============================================
// HISTORIAL PAGO MODAL - DETALLE DE PAGO REALIZADO
// ============================================

import { Calendar, Check, Clock, DollarSign, FileText, TrendingUp, User, X } from 'lucide-react'
import { useLiquidacionQuery } from '../api/payrollQueries'

interface HistorialPagoModalProps {
  isOpen: boolean
  onClose: () => void
  idLiquidacion: string | null
  formatCurrency: (amount: number) => string
}

export const HistorialPagoModal = ({
  isOpen,
  onClose,
  idLiquidacion,
  formatCurrency,
}: HistorialPagoModalProps) => {
  const { data: liquidacion, isLoading } = useLiquidacionQuery(
    { idLiquidacion: idLiquidacion ?? undefined },
    isOpen && !!idLiquidacion
  )

  if (!isOpen) return null

  const mesNombre = liquidacion
    ? new Date(0, liquidacion.mes - 1)
        .toLocaleString('es-CO', { month: 'long' })
        .charAt(0)
        .toUpperCase() +
      new Date(0, liquidacion.mes - 1)
        .toLocaleString('es-CO', { month: 'long' })
        .slice(1)
    : ''

  const fechaPagoFormateada = liquidacion?.fechaPago
    ? new Date(liquidacion.fechaPago).toLocaleDateString('es-CO', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    : 'N/A'

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 pb-8 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm -z-10"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="bg-[#1a1a1a] border border-[rgba(255,255,255,0.1)] rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[rgba(255,255,255,0.1)]">
          <div>
            <h2 className="text-[#f9fafb] text-xl font-bold flex items-center gap-2">
              <Check className="text-[#a78bfa]" size={24} />
              Detalle del Pago
            </h2>
            <p className="text-[#9ca3af] text-sm mt-1">Liquidación completada y pagada</p>
          </div>
          <button
            onClick={onClose}
            className="text-[#9ca3af] hover:text-[#f9fafb] transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-[#a78bfa]/30 border-t-[#a78bfa] rounded-full animate-spin" />
          </div>
        ) : liquidacion ? (
          <div className="p-6 space-y-6">
            {/* Información General */}
            <div className="bg-[rgba(139,92,246,0.05)] border border-[rgba(139,92,246,0.2)] rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-2 text-[#9ca3af] text-sm mb-1">
                    <User size={16} />
                    <span>Profesor</span>
                  </div>
                  <p className="text-[#f9fafb] font-semibold text-lg">{liquidacion.nombreProfesor}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-[#9ca3af] text-sm mb-1">
                    <Calendar size={16} />
                    <span>Periodo</span>
                  </div>
                  <p className="text-[#f9fafb] font-semibold text-lg">
                    {mesNombre} {liquidacion.año}
                  </p>
                </div>
              </div>
            </div>

            {/* Estadísticas */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[rgba(64,64,64,0.2)] border border-[rgba(255,255,255,0.1)] rounded-lg p-3">
                <div className="flex items-center gap-2 text-[#9ca3af] text-xs mb-2">
                  <Clock size={14} />
                  <span>Clases</span>
                </div>
                <p className="text-[#f9fafb] text-2xl font-bold">{liquidacion.totalClases}</p>
              </div>
              <div className="bg-[rgba(64,64,64,0.2)] border border-[rgba(255,255,255,0.1)] rounded-lg p-3">
                <div className="flex items-center gap-2 text-[#9ca3af] text-xs mb-2">
                  <TrendingUp size={14} />
                  <span>Horas</span>
                </div>
                <p className="text-[#f9fafb] text-2xl font-bold">{liquidacion.totalHoras.toFixed(1)}</p>
              </div>
              <div className="bg-[rgba(64,64,64,0.2)] border border-[rgba(255,255,255,0.1)] rounded-lg p-3">
                <div className="flex items-center gap-2 text-[#9ca3af] text-xs mb-2">
                  <DollarSign size={14} />
                  <span>Base</span>
                </div>
                <p className="text-[#f9fafb] text-lg font-bold">{formatCurrency(liquidacion.totalBase)}</p>
              </div>
              <div className="bg-[rgba(64,64,64,0.2)] border border-[rgba(255,255,255,0.1)] rounded-lg p-3">
                <div className="flex items-center gap-2 text-[#9ca3af] text-xs mb-2">
                  <DollarSign size={14} />
                  <span>Ajustes</span>
                </div>
                <p className="text-[#f9fafb] text-lg font-bold">{formatCurrency(liquidacion.totalAdicionales)}</p>
              </div>
            </div>

            {/* Total Pagado */}
            <div className="bg-[rgba(139,92,246,0.1)] border border-[rgba(139,92,246,0.3)] rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#9ca3af] text-sm mb-1">Total Pagado</p>
                  <div className="flex items-center gap-2 text-[#9ca3af] text-xs">
                    <Calendar size={12} />
                    <span>{fechaPagoFormateada}</span>
                  </div>
                </div>
                <p className="text-[#a78bfa] text-3xl font-bold">{formatCurrency(liquidacion.totalPagar)}</p>
              </div>
            </div>

            {/* Observaciones */}
            {liquidacion.observaciones && (
              <div className="bg-[rgba(64,64,64,0.2)] border border-[rgba(255,255,255,0.1)] rounded-lg p-4">
                <div className="flex items-center gap-2 text-[#9ca3af] text-sm mb-2">
                  <FileText size={16} />
                  <span>Observaciones</span>
                </div>
                <p className="text-[#f9fafb] text-sm">{liquidacion.observaciones}</p>
              </div>
            )}

            {/* Detalle de Clases */}
            <div>
              <h3 className="text-[#f9fafb] font-semibold mb-3 flex items-center gap-2">
                <Clock size={18} />
                Clases Incluidas ({liquidacion.clases?.length || 0})
              </h3>
              <div className="bg-[rgba(26,26,26,0.5)] border border-[rgba(255,255,255,0.1)] rounded-lg overflow-hidden">
                <div className="max-h-[300px] overflow-y-auto">
                  {liquidacion.clases && liquidacion.clases.length > 0 ? (
                    <div className="divide-y divide-[rgba(255,255,255,0.05)]">
                      {liquidacion.clases.map((clase) => (
                        <div key={clase.idClaseProfesor} className="p-3 hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <p className="text-[#f9fafb] font-medium">{clase.nombreClase}</p>
                              <div className="flex items-center gap-3 mt-1">
                                <p className="text-[#9ca3af] text-xs">
                                  {new Date(clase.fechaClase).toLocaleDateString('es-CO', {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric',
                                  })}
                                </p>
                                <span className="text-[#6b7280] text-xs">•</span>
                                <p className="text-[#9ca3af] text-xs">{clase.rolEnClase}</p>
                              </div>
                              {clase.conceptoAdicional && (
                                <p className="text-[#a78bfa] text-xs mt-1 italic">
                                  {clase.conceptoAdicional}
                                </p>
                              )}
                            </div>
                            <div className="text-right ml-4">
                              <p className="text-[#f9fafb] font-semibold">{formatCurrency(clase.totalPago)}</p>
                              {clase.valorAdicional !== 0 && (
                                <p className={`text-xs font-medium ${
                                  clase.valorAdicional > 0 ? 'text-[#4ade80]' : 'text-[#f87171]'
                                }`}>
                                  {clase.valorAdicional > 0 ? '+' : ''}{formatCurrency(clase.valorAdicional)}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-[#9ca3af]">
                      No hay clases registradas
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-[#9ca3af]">No se encontró información de la liquidación</p>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 bg-[rgba(26,26,26,0.5)] border-t border-[rgba(255,255,255,0.05)]">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-[rgba(64,64,64,0.3)] hover:bg-[rgba(64,64,64,0.5)] text-[#f9fafb] rounded-lg font-medium transition-all"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}
