// ============================================
// PAYMENT METHOD SELECTOR - CHETANGO ADMIN
// Requirements: 5.3, 5.4, 2.7
// ============================================

import { DollarSign, Building2, Smartphone } from 'lucide-react'
import { GlassButton } from '@/design-system/atoms/GlassButton'
import {
  GlassSelect,
  GlassSelectTrigger,
  GlassSelectValue,
  GlassSelectContent,
  GlassSelectItem,
} from '@/design-system/atoms/GlassSelect'
import type { MetodoPagoDTO } from '../types/paymentTypes'
import { METODOS_PAGO_RAPIDOS } from '../types/paymentTypes'

interface PaymentMethodSelectorProps {
  metodosPago: MetodoPagoDTO[]
  selectedMetodoId: string
  onSelect: (idMetodoPago: string) => void
  isLoading?: boolean
}

// Icon mapping for quick access methods
const METODO_ICONS: Record<string, React.ReactNode> = {
  'Efectivo': <DollarSign className="w-4 h-4" />,
  'Transferencia Bancaria': <Building2 className="w-4 h-4" />,
  'Nequi': <Smartphone className="w-4 h-4" />,
}

/**
 * Payment method selector with quick buttons and dropdown for others
 *
 * Requirements:
 * - 5.3: Display 4 buttons: Efectivo, Transferencia, Nequi, Otros
 * - 5.4: Dropdown for "Otros" with remaining payment methods
 * - 2.7: Show icons for each method
 */
export function PaymentMethodSelector({
  metodosPago,
  selectedMetodoId,
  onSelect,
  isLoading = false,
}: PaymentMethodSelectorProps) {
  // Separate quick access methods from others
  const quickMethods = metodosPago.filter((m) =>
    METODOS_PAGO_RAPIDOS.includes(m.nombre)
  )
  const otherMethods = metodosPago.filter(
    (m) => !METODOS_PAGO_RAPIDOS.includes(m.nombre)
  )

  // Check if selected method is in "others"
  const selectedInOthers = otherMethods.some(
    (m) => m.idMetodoPago === selectedMetodoId
  )

  if (isLoading) {
    return (
      <div className="space-y-2">
        <label className="text-[#9ca3af] text-sm">Método de Pago</label>
        <div className="grid grid-cols-4 gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-10 rounded-lg bg-white/5 animate-pulse"
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <label className="text-[#9ca3af] text-sm">Método de Pago</label>
      <div className="grid grid-cols-4 gap-2">
        {/* Quick access buttons */}
        {quickMethods.map((metodo) => (
          <GlassButton
            key={metodo.idMetodoPago}
            variant={selectedMetodoId === metodo.idMetodoPago ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => onSelect(metodo.idMetodoPago)}
            className="flex flex-col items-center gap-1 py-3 h-auto"
          >
            {METODO_ICONS[metodo.nombre] || <DollarSign className="w-4 h-4" />}
            <span className="text-xs truncate w-full text-center">
              {metodo.nombre.split(' ')[0]}
            </span>
          </GlassButton>
        ))}

        {/* Others dropdown */}
        {otherMethods.length > 0 && (
          <div className="relative">
            <GlassSelect
              value={selectedInOthers ? selectedMetodoId : undefined}
              onValueChange={(value) => onSelect(value)}
            >
              <GlassSelectTrigger className={`h-full ${selectedInOthers ? 'ring-2 ring-[#c93448]' : ''}`}>
                <GlassSelectValue placeholder="Otros" />
              </GlassSelectTrigger>
              <GlassSelectContent>
                {otherMethods.map((metodo) => (
                  <GlassSelectItem key={metodo.idMetodoPago} value={metodo.idMetodoPago}>
                    {metodo.nombre}
                  </GlassSelectItem>
                ))}
              </GlassSelectContent>
            </GlassSelect>
          </div>
        )}
      </div>
    </div>
  )
}
