// ============================================
// PAYMENTS FILTERS COMPONENT
// ============================================

import { GlassPanel } from '@/design-system/atoms/GlassPanel'
import { ChevronDown, ChevronUp, Filter, X } from 'lucide-react'
import { useState } from 'react'
import { useMetodosPagoQuery } from '../api/paymentsQueries'
import type { PaymentFilters } from '../types/payments.types'

interface PaymentsFiltersProps {
  filters: PaymentFilters
  onFiltersChange: (filters: PaymentFilters) => void
}

export const PaymentsFilters = ({ filters, onFiltersChange }: PaymentsFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const { data: metodos } = useMetodosPagoQuery()

  const [localFilters, setLocalFilters] = useState({
    fechaDesde: filters.fechaDesde || '',
    fechaHasta: filters.fechaHasta || '',
    idMetodoPago: filters.idMetodoPago || '',
  })

  const handleApply = () => {
    onFiltersChange({
      ...filters,
      ...localFilters,
      pageNumber: 1, // Reset a primera página
    })
    setIsOpen(false)
  }

  const handleClear = () => {
    const clearedFilters = {
      fechaDesde: '',
      fechaHasta: '',
      idMetodoPago: '',
    }
    setLocalFilters(clearedFilters)
    onFiltersChange({
      ...filters,
      ...clearedFilters,
      pageNumber: 1,
    })
  }

  const hasActiveFilters =
    filters.fechaDesde || filters.fechaHasta || filters.idMetodoPago

  return (
    <div className="mb-6">
      {/* Botón Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.1)] text-[#d1d5db] transition-all duration-300"
      >
        <Filter className="w-4 h-4" />
        <span>Filtros</span>
        {hasActiveFilters && (
          <span className="px-2 py-0.5 rounded-full bg-[#c93448] text-white text-xs">
            {[filters.fechaDesde, filters.fechaHasta, filters.idMetodoPago].filter(
              Boolean
            ).length}
          </span>
        )}
        {isOpen ? (
          <ChevronUp className="w-4 h-4 ml-auto" />
        ) : (
          <ChevronDown className="w-4 h-4 ml-auto" />
        )}
      </button>

      {/* Panel de Filtros */}
      {isOpen && (
        <GlassPanel className="p-4 mt-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* Fecha Desde */}
            <div>
              <label className="block text-[#9ca3af] text-sm mb-2">Desde</label>
              <input
                type="date"
                value={localFilters.fechaDesde}
                onChange={(e) =>
                  setLocalFilters({ ...localFilters, fechaDesde: e.target.value })
                }
                className="w-full px-3 py-2 rounded-lg bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[#f9fafb] focus:outline-none focus:border-[#c93448] transition-colors"
              />
            </div>

            {/* Fecha Hasta */}
            <div>
              <label className="block text-[#9ca3af] text-sm mb-2">Hasta</label>
              <input
                type="date"
                value={localFilters.fechaHasta}
                onChange={(e) =>
                  setLocalFilters({ ...localFilters, fechaHasta: e.target.value })
                }
                className="w-full px-3 py-2 rounded-lg bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[#f9fafb] focus:outline-none focus:border-[#c93448] transition-colors"
              />
            </div>

            {/* Método de Pago */}
            <div>
              <label className="block text-[#9ca3af] text-sm mb-2">Método de Pago</label>
              <select
                value={localFilters.idMetodoPago}
                onChange={(e) =>
                  setLocalFilters({ ...localFilters, idMetodoPago: e.target.value })
                }
                className="w-full px-3 py-2 rounded-lg bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[#f9fafb] focus:outline-none focus:border-[#c93448] transition-colors"
              >
                <option value="">Todos</option>
                {metodos?.map((metodo) => (
                  <option key={metodo.idMetodoPago} value={metodo.idMetodoPago}>
                    {metodo.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="flex gap-3">
            <button
              onClick={handleApply}
              className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-[#c93448] to-[#e54d5e] text-white font-medium hover:shadow-lg transition-all duration-300"
            >
              Aplicar Filtros
            </button>
            <button
              onClick={handleClear}
              className="px-4 py-2 rounded-lg bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.1)] text-[#d1d5db] transition-all duration-300"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </GlassPanel>
      )}
    </div>
  )
}
