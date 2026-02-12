// ============================================
// MODAL LIQUIDAR MES - NÓMINA
// ============================================

import { useModalScroll } from '@/shared/hooks'
import { AlertTriangle, Calendar, CheckCircle, DollarSign, X } from 'lucide-react'
import { useState } from 'react'
import type { ResumenProfesor } from '../types/payroll.types'
import { formatCurrency } from '../utils'

interface LiquidarMesModalProps {
  isOpen: boolean
  onClose: () => void
  profesores: ResumenProfesor[]
  onLiquidar: (mes: number, año: number, observaciones?: string) => void
  isLoading?: boolean
}

const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
]

export const LiquidarMesModal = ({
  isOpen,
  onClose,
  profesores,
  onLiquidar,
  isLoading = false,
}: LiquidarMesModalProps) => {
  const containerRef = useModalScroll(isOpen)

  const hoy = new Date()
  const [mes, setMes] = useState<number>(hoy.getMonth() + 1) // 1-12
  const [año, setAño] = useState<number>(hoy.getFullYear())
  const [observaciones, setObservaciones] = useState<string>('')

  if (!isOpen) return null

  // Filtrar profesores con clases aprobadas
  const profesoresConAprobadas = profesores.filter(p => p.clasesAprobadas > 0)

  const totalClases = profesoresConAprobadas.reduce((sum, p) => sum + p.clasesAprobadas, 0)
  const totalMonto = profesoresConAprobadas.reduce((sum, p) => sum + p.totalAprobado, 0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onLiquidar(mes, año, observaciones || undefined)
  }

  const handleClose = () => {
    if (!isLoading) {
      setObservaciones('')
      onClose()
    }
  }

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-[100] pt-20 overflow-y-auto"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-md -z-10"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative flex items-start justify-center p-4 min-h-full">
        <div className="bg-[#1a1a1a] border border-[rgba(255,255,255,0.1)] rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[rgba(255,255,255,0.1)]">
          <div>
            <h2 className="text-[#f9fafb] text-xl font-bold">Liquidar Mes</h2>
            <p className="text-[#9ca3af] text-sm mt-1">Genera la liquidación mensual oficial</p>
          </div>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="text-[#9ca3af] hover:text-[#f9fafb] transition-colors disabled:opacity-50"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          {/* Período */}
          <div className="p-6 border-b border-[rgba(255,255,255,0.05)]">
            <div className="flex items-center gap-2 mb-4">
              <Calendar size={20} className="text-[#60a5fa]" />
              <h3 className="text-[#f9fafb] font-semibold">Período a Liquidar</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="mes" className="text-[#f9fafb] text-sm font-medium block mb-2">
                  Mes
                </label>
                <select
                  id="mes"
                  value={mes}
                  onChange={(e) => setMes(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-[rgba(26,26,26,0.5)] border border-[rgba(255,255,255,0.1)] rounded-lg text-[#f9fafb] focus:border-[#60a5fa] focus:outline-none transition-colors"
                >
                  {MESES.map((nombre, index) => (
                    <option key={index} value={index + 1}>
                      {nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="año" className="text-[#f9fafb] text-sm font-medium block mb-2">
                  Año
                </label>
                <input
                  type="number"
                  id="año"
                  value={año}
                  onChange={(e) => setAño(Number(e.target.value))}
                  min={2020}
                  max={2030}
                  className="w-full px-4 py-3 bg-[rgba(26,26,26,0.5)] border border-[rgba(255,255,255,0.1)] rounded-lg text-[#f9fafb] focus:border-[#60a5fa] focus:outline-none transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Preview de profesores */}
          <div className="p-6 border-b border-[rgba(255,255,255,0.05)]">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign size={20} className="text-[#4ade80]" />
              <h3 className="text-[#f9fafb] font-semibold">
                Resumen de Liquidación
              </h3>
            </div>

            {profesoresConAprobadas.length > 0 ? (
              <>
                <div className="space-y-2 mb-4 max-h-60 overflow-y-auto pr-2">
                  {profesoresConAprobadas.map((prof) => (
                    <div
                      key={prof.idProfesor}
                      className="flex justify-between items-center p-3 bg-[rgba(26,26,26,0.7)] border border-[rgba(255,255,255,0.05)] rounded-lg"
                    >
                      <div>
                        <p className="text-[#f9fafb] font-medium">{prof.nombreProfesor}</p>
                        <p className="text-[#9ca3af] text-sm">
                          {prof.clasesAprobadas} {prof.clasesAprobadas === 1 ? 'clase' : 'clases'}
                        </p>
                      </div>
                      <p className="text-[#4ade80] font-semibold">
                        {formatCurrency(prof.totalAprobado)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Totales */}
                <div className="grid grid-cols-2 gap-4 p-4 bg-[rgba(96,165,250,0.1)] border border-[rgba(96,165,250,0.3)] rounded-lg">
                  <div>
                    <p className="text-[#9ca3af] text-sm">Total Clases</p>
                    <p className="text-[#f9fafb] text-xl font-bold">{totalClases}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[#9ca3af] text-sm">Total a Liquidar</p>
                    <p className="text-[#60a5fa] text-xl font-bold">{formatCurrency(totalMonto)}</p>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <AlertTriangle className="mx-auto text-[#fbbf24] mb-3" size={48} />
                <p className="text-[#f9fafb] font-medium">No hay clases aprobadas</p>
                <p className="text-[#9ca3af] text-sm mt-1">
                  Debes aprobar clases antes de generar la liquidación
                </p>
              </div>
            )}
          </div>

          {/* Observaciones */}
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle size={20} className="text-[#a78bfa]" />
              <h3 className="text-[#f9fafb] font-semibold">Observaciones (Opcional)</h3>
            </div>
            <textarea
              id="observaciones"
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              placeholder="Ej: Liquidación de enero 2026. Incluye bonos por desempeño."
              rows={3}
              className="w-full px-4 py-3 bg-[rgba(26,26,26,0.5)] border border-[rgba(255,255,255,0.1)] rounded-lg text-[#f9fafb] placeholder:text-[#6b7280] focus:border-[#60a5fa] focus:outline-none transition-colors resize-none"
            />
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
              disabled={isLoading || profesoresConAprobadas.length === 0}
              className="flex-1 px-6 py-3 bg-[#60a5fa] hover:bg-[#3b82f6] text-white rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Generando Liquidación...' : 'Generar Liquidación'}
            </button>
          </div>
        </form>
        </div>
      </div>
    </div>
  )
}
