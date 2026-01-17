// ============================================
// PACKAGE SELECTOR - CHETANGO ADMIN
// Requirements: 5.5, 5.6, 5.7
// ============================================

import { Check, Package } from 'lucide-react'
import { GlassPanel } from '@/design-system/atoms/GlassPanel'
import type { TipoPaqueteDTO, SelectedPaquete } from '../types/paymentTypes'

interface PackageSelectorProps {
  tiposPaquete: TipoPaqueteDTO[]
  selectedPaquetes: SelectedPaquete[]
  onToggle: (paquete: SelectedPaquete) => void
  formatCurrency: (amount: number) => string
  isLoading?: boolean
}

/**
 * Package type selector with selectable cards
 *
 * Requirements:
 * - 5.5: Display available tipos de paquete as selectable cards
 * - 5.6: Show nombre, cantidad de clases, precio formateado
 * - 5.7: Allow multiple selection (checkboxes)
 */
export function PackageSelector({
  tiposPaquete,
  selectedPaquetes,
  onToggle,
  formatCurrency,
  isLoading = false,
}: PackageSelectorProps) {
  const isSelected = (id: string) =>
    selectedPaquetes.some((p) => p.idTipoPaquete === id)

  const handleToggle = (tipo: TipoPaqueteDTO) => {
    const paquete: SelectedPaquete = {
      idTipoPaquete: tipo.id,
      nombre: tipo.nombre,
      precio: tipo.precio,
      clasesDisponibles: tipo.clasesDisponibles,
    }
    onToggle(paquete)
  }

  if (isLoading) {
    return (
      <div className="space-y-2">
        <label className="text-[#9ca3af] text-sm">Paquetes a Asignar</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-20 rounded-lg bg-white/5 animate-pulse"
            />
          ))}
        </div>
      </div>
    )
  }

  if (tiposPaquete.length === 0) {
    return (
      <div className="space-y-2">
        <label className="text-[#9ca3af] text-sm">Paquetes a Asignar</label>
        <GlassPanel className="p-4 text-center">
          <Package className="w-8 h-8 mx-auto text-[#6b7280] mb-2" />
          <p className="text-[#9ca3af]">No hay tipos de paquete disponibles</p>
        </GlassPanel>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <label className="text-[#9ca3af] text-sm">Paquetes a Asignar</label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto">
        {tiposPaquete.map((tipo) => {
          const selected = isSelected(tipo.id)
          return (
            <button
              key={tipo.id}
              onClick={() => handleToggle(tipo)}
              className={`
                relative p-3 rounded-lg text-left transition-all
                ${selected
                  ? 'bg-[#c93448]/20 ring-2 ring-[#c93448]'
                  : 'bg-white/5 hover:bg-white/10'
                }
              `}
              aria-pressed={selected}
            >
              {/* Checkbox indicator */}
              <div
                className={`
                  absolute top-2 right-2 w-5 h-5 rounded-md flex items-center justify-center
                  ${selected
                    ? 'bg-[#c93448] text-white'
                    : 'bg-white/10 border border-white/20'
                  }
                `}
              >
                {selected && <Check className="w-3 h-3" />}
              </div>

              {/* Package info */}
              <h4 className="text-[#f9fafb] font-medium pr-6 truncate">
                {tipo.nombre}
              </h4>
              <p className="text-[#9ca3af] text-sm">
                {tipo.clasesDisponibles} clases
              </p>
              <p className="text-[#34d399] font-semibold mt-1">
                {formatCurrency(tipo.precio)}
              </p>
            </button>
          )
        })}
      </div>
      {selectedPaquetes.length === 0 && (
        <p className="text-amber-400 text-sm">
          Selecciona al menos un paquete
        </p>
      )}
    </div>
  )
}
