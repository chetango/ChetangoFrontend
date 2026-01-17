// ============================================
// QUICK TEMPLATE CARD - CHETANGO ADMIN
// Requirements: 8.1, 8.6
// ============================================

import { RotateCcw } from 'lucide-react'
import { GlassPanel } from '@/design-system/atoms/GlassPanel'
import { GlassButton } from '@/design-system/atoms/GlassButton'

interface QuickTemplateCardProps {
  hasLastPayment: boolean
  onRepeatLastPayment: () => void
}

/**
 * Quick template card for repeating last payment
 *
 * Requirements:
 * - 8.1: Display card "Repetir último pago" with description
 * - 8.6: Disabled state if no previous payments with tooltip
 */
export function QuickTemplateCard({
  hasLastPayment,
  onRepeatLastPayment,
}: QuickTemplateCardProps) {
  return (
    <GlassPanel className="p-4 mb-4">
      <h3 className="text-[#f9fafb] font-medium mb-2">Plantilla Rápida</h3>
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-[#7c5af8]/20">
          <RotateCcw className="w-5 h-5 text-[#7c5af8]" />
        </div>
        <div className="flex-1">
          <p className="text-[#f9fafb] text-sm font-medium">
            Repetir último pago
          </p>
          <p className="text-[#9ca3af] text-xs mt-1">
            Autocompleta con los datos del último pago registrado
          </p>
        </div>
      </div>
      <GlassButton
        variant="ghost"
        size="sm"
        onClick={onRepeatLastPayment}
        disabled={!hasLastPayment}
        className="w-full mt-3"
        title={!hasLastPayment ? 'No hay pagos anteriores' : undefined}
      >
        {hasLastPayment ? 'Usar plantilla' : 'Sin pagos previos'}
      </GlassButton>
    </GlassPanel>
  )
}
