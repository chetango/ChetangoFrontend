// ============================================
// MODAL APROBAR PAGO CON AJUSTES - NÓMINA
// ============================================

import { DollarSign, TrendingDown, TrendingUp, X } from 'lucide-react'
import { useState } from 'react'
import type { ProfesorClase } from '../types/payroll.types'

interface AprobarPagoModalProps {
  isOpen: boolean
  onClose: () => void
  profesor: ProfesorClase | null
  claseNombre: string
  claseFecha: string
  onAprobar: (valorAdicional?: number, conceptoAdicional?: string) => void
  isLoading?: boolean
}

export const AprobarPagoModal = ({
  isOpen,
  onClose,
  profesor,
  claseNombre,
  claseFecha,
  onAprobar,
  isLoading = false,
}: AprobarPagoModalProps) => {
  const [tipoAjuste, setTipoAjuste] = useState<'ninguno' | 'bono' | 'descuento'>('ninguno')
  const [valorAjuste, setValorAjuste] = useState<string>('')
  const [concepto, setConcepto] = useState<string>('')

  if (!isOpen || !profesor) return null


  const calcularTotal = () => {
    const tarifaBase = profesor.totalPago
    if (tipoAjuste === 'ninguno' || !valorAjuste) return tarifaBase

    const ajuste = parseFloat(valorAjuste) || 0
    const valorFinal = tipoAjuste === 'bono' ? ajuste : -ajuste
    return tarifaBase + valorFinal
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (tipoAjuste === 'ninguno') {
      onAprobar()
    } else {
      const ajuste = parseFloat(valorAjuste) || 0
      const valorFinal = tipoAjuste === 'bono' ? ajuste : -ajuste
      onAprobar(valorFinal, concepto || undefined)
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      setTipoAjuste('ninguno')
      setValorAjuste('')
      setConcepto('')
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-[#1a1a1a] border border-[rgba(255,255,255,0.1)] rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[rgba(255,255,255,0.1)]">
          <div>
            <h2 className="text-[#f9fafb] text-xl font-bold">Aprobar Pago</h2>
            <p className="text-[#9ca3af] text-sm mt-1">Valida el pago o agrega ajustes</p>
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
          {/* Información de la Clase */}
          <div className="p-6 bg-[rgba(26,26,26,0.5)] border-b border-[rgba(255,255,255,0.05)]">
            <div className="space-y-3">
              <div>
                <p className="text-[#9ca3af] text-xs">Clase</p>
                <p className="text-[#f9fafb] font-medium">{claseNombre}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[#9ca3af] text-xs">Profesor</p>
                  <p className="text-[#f9fafb] text-sm">{profesor.nombreProfesor}</p>
                  <p className="text-[#6b7280] text-xs">{profesor.rolEnClase}</p>
                </div>
                <div>
                  <p className="text-[#9ca3af] text-xs">Fecha</p>
                  <p className="text-[#f9fafb] text-sm">{claseFecha}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tarifa Base */}
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-center p-3 bg-[rgba(64,64,64,0.2)] border border-[rgba(255,255,255,0.1)] rounded-lg">
              <span className="text-[#9ca3af]">Tarifa Programada</span>
              <span className="text-[#f9fafb] font-semibold">{formatCurrency(profesor.totalPago)}</span>
            </div>

            {/* Tipo de Ajuste */}
            <div>
              <label className="text-[#f9fafb] text-sm font-medium block mb-2">
                ¿Deseas agregar un ajuste?
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setTipoAjuste('ninguno')}
                  className={`p-3 rounded-lg border transition-all ${
                    tipoAjuste === 'ninguno'
                      ? 'bg-[rgba(96,165,250,0.15)] border-[#60a5fa] text-[#60a5fa]'
                      : 'bg-[rgba(64,64,64,0.2)] border-[rgba(255,255,255,0.1)] text-[#9ca3af] hover:border-[rgba(255,255,255,0.2)]'
                  }`}
                >
                  <DollarSign size={20} className="mx-auto mb-1" />
                  <span className="text-xs font-medium">Sin Ajuste</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTipoAjuste('bono')}
                  className={`p-3 rounded-lg border transition-all ${
                    tipoAjuste === 'bono'
                      ? 'bg-[rgba(34,197,94,0.15)] border-[#4ade80] text-[#4ade80]'
                      : 'bg-[rgba(64,64,64,0.2)] border-[rgba(255,255,255,0.1)] text-[#9ca3af] hover:border-[rgba(255,255,255,0.2)]'
                  }`}
                >
                  <TrendingUp size={20} className="mx-auto mb-1" />
                  <span className="text-xs font-medium">Bono</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTipoAjuste('descuento')}
                  className={`p-3 rounded-lg border transition-all ${
                    tipoAjuste === 'descuento'
                      ? 'bg-[rgba(239,68,68,0.15)] border-[#f87171] text-[#f87171]'
                      : 'bg-[rgba(64,64,64,0.2)] border-[rgba(255,255,255,0.1)] text-[#9ca3af] hover:border-[rgba(255,255,255,0.2)]'
                  }`}
                >
                  <TrendingDown size={20} className="mx-auto mb-1" />
                  <span className="text-xs font-medium">Descuento</span>
                </button>
              </div>
            </div>

            {/* Valor del Ajuste */}
            {tipoAjuste !== 'ninguno' && (
              <div className="space-y-3 animate-in fade-in duration-200">
                <div>
                  <label htmlFor="valorAjuste" className="text-[#f9fafb] text-sm font-medium block mb-2">
                    Valor del {tipoAjuste === 'bono' ? 'Bono' : 'Descuento'}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]">$</span>
                    <input
                      type="number"
                      id="valorAjuste"
                      value={valorAjuste}
                      onChange={(e) => setValorAjuste(e.target.value)}
                      placeholder="0"
                      min="0"
                      step="1000"
                      required
                      className="w-full pl-8 pr-4 py-3 bg-[rgba(26,26,26,0.5)] border border-[rgba(255,255,255,0.1)] rounded-lg text-[#f9fafb] placeholder:text-[#6b7280] focus:border-[#60a5fa] focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="concepto" className="text-[#f9fafb] text-sm font-medium block mb-2">
                    Motivo del {tipoAjuste === 'bono' ? 'Bono' : 'Descuento'}
                  </label>
                  <textarea
                    id="concepto"
                    value={concepto}
                    onChange={(e) => setConcepto(e.target.value)}
                    placeholder={
                      tipoAjuste === 'bono'
                        ? 'Ej: Clase excepcional con 25 alumnos'
                        : 'Ej: Llegó 15 minutos tarde'
                    }
                    rows={2}
                    required
                    className="w-full px-4 py-3 bg-[rgba(26,26,26,0.5)] border border-[rgba(255,255,255,0.1)] rounded-lg text-[#f9fafb] placeholder:text-[#6b7280] focus:border-[#60a5fa] focus:outline-none transition-colors resize-none"
                  />
                </div>
              </div>
            )}

            {/* Total Final */}
            <div className="flex justify-between items-center p-4 bg-[rgba(96,165,250,0.1)] border border-[rgba(96,165,250,0.3)] rounded-lg">
              <span className="text-[#f9fafb] font-semibold">Total a Pagar</span>
              <div className="text-right">
                <p className="text-[#60a5fa] text-xl font-bold">{formatCurrency(calcularTotal())}</p>
                {tipoAjuste !== 'ninguno' && valorAjuste && (
                  <p className="text-[#9ca3af] text-xs mt-1">
                    {tipoAjuste === 'bono' ? '+' : '-'} {formatCurrency(parseFloat(valorAjuste) || 0)}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-3 p-6 bg-[rgba(26,26,26,0.5)] border-t border-[rgba(255,255,255,0.05)]">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1 px-6 py-3 bg-[rgba(64,64,64,0.3)] hover:bg-[rgba(64,64,64,0.5)] text-[#f9fafb] rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-6 py-3 bg-[#4ade80] hover:bg-[#22c55e] text-[#0a0a0a] rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Aprobando...' : 'Aprobar Pago'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
