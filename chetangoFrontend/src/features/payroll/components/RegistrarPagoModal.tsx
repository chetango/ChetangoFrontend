// ============================================
// MODAL REGISTRAR PAGO - NÓMINA
// ============================================

import { getToday } from '@/shared/utils/dateTimeHelper'
import { Calendar, DollarSign, FileText, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { formatCurrency, formatMonth } from '../utils'

interface RegistrarPagoModalProps {
  isOpen: boolean
  onClose: () => void
  liquidacion: {
    idLiquidacion: string
    nombreProfesor: string
    mes: number
    año: number
    totalPagar: number
  } | null
  onRegistrar: (fechaPago: string, observaciones?: string) => void
  isLoading?: boolean
}

export const RegistrarPagoModal = ({
  isOpen,
  onClose,
  liquidacion,
  onRegistrar,
  isLoading = false,
}: RegistrarPagoModalProps) => {
  const [fechaPago, setFechaPago] = useState<string>(getToday())
  const [observaciones, setObservaciones] = useState<string>('')

  // Scroll al inicio cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      window.scrollTo({ top: 0, behavior: 'instant' })
    }
  }, [isOpen])

  if (!isOpen || !liquidacion) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onRegistrar(fechaPago, observaciones || undefined)
  }

  const handleClose = () => {
    if (!isLoading) {
      setFechaPago(getToday())
      setObservaciones('')
      onClose()
    }
  }

  return (
    <div className="absolute inset-0 z-[100] flex items-start justify-center pt-20 px-4 pb-8 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm -z-10"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative z-10 bg-[#1a1a1a] border border-[rgba(255,255,255,0.1)] rounded-2xl shadow-2xl w-full max-w-lg mb-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[rgba(255,255,255,0.1)]">
          <div>
            <h2 className="text-[#f9fafb] text-xl font-bold">🏦 Registrar Pago</h2>
            <p className="text-[#9ca3af] text-sm mt-1">Confirma que el pago fue realizado</p>
          </div>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="text-[#9ca3af] hover:text-[#f9fafb] transition-colors disabled:opacity-50"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Información de la Liquidación */}
          <div className="p-6 bg-[rgba(26,26,26,0.5)] border-b border-[rgba(255,255,255,0.05)]">
            <div className="space-y-3">
              <div>
                <p className="text-[#9ca3af] text-xs">Profesor</p>
                <p className="text-[#f9fafb] font-medium">{liquidacion.nombreProfesor}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[#9ca3af] text-xs">Periodo</p>
                  <p className="text-[#f9fafb] text-sm">
                    {formatMonth(liquidacion.mes)} {liquidacion.año}
                  </p>
                </div>
                <div>
                  <p className="text-[#9ca3af] text-xs">Monto a Pagar</p>
                  <p className="text-[#4ade80] font-bold">{formatCurrency(liquidacion.totalPagar)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Formulario */}
          <div className="p-6 space-y-4">
            {/* Fecha de Pago */}
            <div>
              <label className="text-[#f9fafb] text-sm font-medium flex items-center gap-2 mb-2">
                <Calendar size={16} className="text-[#60a5fa]" />
                Fecha de Pago *
              </label>
              <input
                type="date"
                value={fechaPago}
                onChange={(e) => setFechaPago(e.target.value)}
                required
                disabled={isLoading}
                className="w-full px-4 py-2 bg-[rgba(64,64,64,0.2)] border border-[rgba(255,255,255,0.1)] rounded-lg text-[#f9fafb] focus:outline-none focus:border-[#60a5fa] transition-colors disabled:opacity-50"
              />
            </div>

            {/* Observaciones */}
            <div>
              <label className="text-[#f9fafb] text-sm font-medium flex items-center gap-2 mb-2">
                <FileText size={16} className="text-[#9ca3af]" />
                Observaciones (opcional)
              </label>
              <textarea
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
                placeholder="Ej: Transferencia bancaria, comprobante #12345"
                disabled={isLoading}
                rows={3}
                className="w-full px-4 py-2 bg-[rgba(64,64,64,0.2)] border border-[rgba(255,255,255,0.1)] rounded-lg text-[#f9fafb] placeholder-[#6b7280] focus:outline-none focus:border-[#60a5fa] transition-colors resize-none disabled:opacity-50"
              />
            </div>

            {/* Alert Info */}
            <div className="bg-[rgba(96,165,250,0.1)] border border-[rgba(96,165,250,0.3)] rounded-lg p-3">
              <p className="text-[#60a5fa] text-xs flex items-center gap-2">
                <DollarSign size={14} />
                Al registrar este pago, el profesor verá este monto en su sección "Total Pagado"
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-3 p-6 bg-[rgba(26,26,26,0.3)] border-t border-[rgba(255,255,255,0.05)]">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-[rgba(64,64,64,0.3)] hover:bg-[rgba(64,64,64,0.5)] text-[#f9fafb] rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading || !fechaPago}
              className="flex-1 px-4 py-2 bg-[#60a5fa] hover:bg-[#3b82f6] text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Registrando...
                </>
              ) : (
                <>
                  <DollarSign size={18} />
                  Confirmar Pago
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
