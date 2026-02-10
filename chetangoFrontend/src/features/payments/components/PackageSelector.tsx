// ============================================
// PACKAGE SELECTOR - CHETANGO ADMIN
// Requirements: 5.5, 5.6, 5.7
// Updated: Feb 6, 2026 - Added support for private classes (1-2 persons)
// ============================================

import { GlassPanel } from '@/design-system/atoms/GlassPanel'
import { Check, Info, Package, Users } from 'lucide-react'
import type { SelectedPaquete, TipoPaqueteDTO } from '../types/paymentTypes'

interface PackageSelectorProps {
  tiposPaquete: TipoPaqueteDTO[]
  selectedPaquetes: SelectedPaquete[]
  onToggle: (paquete: SelectedPaquete) => void
  formatCurrency: (amount: number) => string
  isLoading?: boolean
  /** Optional: ID of second alumno for shared packages (2 persons) */
  idSegundoAlumno?: string
  /** Optional: Name of second alumno for display */
  nombreSegundoAlumno?: string
}

/**
 * Package type selector with selectable cards
 *
 * Requirements:
 * - 5.5: Display available tipos de paquete as selectable cards
 * - 5.6: Show nombre, cantidad de clases, precio formateado
 * - 5.7: Allow multiple selection (checkboxes)
 * 
 * NEW: Supports private classes for 1-2 persons
 * - Shows visual indicator for "2 Personas" packages
 * - Displays helpful tooltip when package is for couples
 * - Alerts admin that 2 packages will be created (one per alumno)
 */
export function PackageSelector({
  tiposPaquete,
  selectedPaquetes,
  onToggle,
  formatCurrency,
  isLoading = false,
  // idSegundoAlumno, // Reserved for future use
  // nombreSegundoAlumno, // Reserved for future use
}: PackageSelectorProps) {
  const isSelected = (id: string) =>
    selectedPaquetes.some((p) => p.idTipoPaquete === id)

  /**
   * Check if a package type is for 2 persons (couples)
   */
  const isForTwoPersons = (nombre: string): boolean => {
    return nombre.toLowerCase().includes('2 personas') || nombre.toLowerCase().includes('2p')
  }

  /**
   * Check if any selected package is for 2 persons
   */
  const hasTwoPersonsPackage = selectedPaquetes.some(p => isForTwoPersons(p.nombre))

  const handleToggle = (tipo: TipoPaqueteDTO) => {
    const paquete: SelectedPaquete = {
      idTipoPaquete: tipo.idTipoPaquete,
      nombre: tipo.nombre,
      precio: tipo.precio,
      clasesDisponibles: tipo.numeroClases,
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
      
      {/* Info banner for 2-person packages */}
      {hasTwoPersonsPackage && (
        <GlassPanel className="p-3 bg-blue-500/10 border border-blue-500/30">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-1 text-sm">
              <p className="text-blue-400 font-medium">
                Paquete para 2 Personas (Pareja/Compartido)
              </p>
              <p className="text-[#9ca3af] text-xs leading-relaxed">
                <strong>¿Cómo funciona?</strong> Este pago creará <strong>2 paquetes vinculados</strong> 
                (uno para cada alumno). Ambos alumnos usarán sus clases de forma independiente. 
                Asegúrate de registrar el pago para ambos alumnos después de crear este.
              </p>
              <p className="text-amber-400 text-xs mt-1">
                💡 Tip: Usa el mismo método y monto para el segundo alumno, pero selecciona "sin pago" 
                en valor del paquete (ya fue pagado por el primero).
              </p>
            </div>
          </div>
        </GlassPanel>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto">
        {tiposPaquete.map((tipo) => {
          const selected = isSelected(tipo.idTipoPaquete)
          const isTwoPersons = isForTwoPersons(tipo.nombre)
          
          return (
            <button
              key={tipo.idTipoPaquete}
              onClick={() => handleToggle(tipo)}
              className={`
                relative p-3 rounded-lg text-left transition-all
                ${selected
                  ? 'bg-[#c93448]/20 ring-2 ring-[#c93448]'
                  : 'bg-white/5 hover:bg-white/10'
                }
                ${isTwoPersons ? 'border border-blue-400/30' : ''}
              `}
              aria-pressed={selected}
              title={isTwoPersons ? 'Paquete para 2 personas - Se crearán 2 paquetes vinculados' : tipo.nombre}
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
              <div className="flex items-start gap-2">
                {isTwoPersons && (
                  <Users className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1 pr-6">
                  <h4 className="text-[#f9fafb] font-medium truncate">
                    {tipo.nombre}
                  </h4>
                  {isTwoPersons && (
                    <p className="text-blue-400 text-xs">
                      Crea 2 paquetes
                    </p>
                  )}
                  <p className="text-[#9ca3af] text-sm">
                    {tipo.numeroClases} clases
                  </p>
                  <p className="text-[#34d399] font-semibold mt-1">
                    {formatCurrency(tipo.precio)}
                    {isTwoPersons && (
                      <span className="text-xs text-[#9ca3af] ml-1">(total)</span>
                    )}
                  </p>
                </div>
              </div>
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
