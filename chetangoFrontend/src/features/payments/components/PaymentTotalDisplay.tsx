// ============================================
// PAYMENT TOTAL DISPLAY - CHETANGO ADMIN
// Requirements: 5.8, 5.9, 6.1, 6.2, 6.3, 6.4
// ============================================

import { useState, useEffect } from 'react'
import { Edit2, Check, X } from 'lucide-react'
import { GlassPanel } from '@/design-system/atoms/GlassPanel'
import { GlassInput } from '@/design-system/atoms/GlassInput'
import { GlassButton } from '@/design-system/atoms/GlassButton'

interface PaymentTotalDisplayProps {
  calculatedTotal: number
  currentTotal: number
  isManual: boolean
  formatCurrency: (amount: number) => string
  onTotalChange: (total: number, isManual: boolean) => void
}

/**
 * Displays and allows editing of payment total
 *
 * Requirements:
 * - 5.8: Auto-calculate as sum of selected paquetes' prices
 * - 5.9: Show "TOTAL A PAGAR" with calculated amount in green highlight
 * - 6.1: Display $0 when no paquetes selected
 * - 6.2: Equal sum of all selected paquetes' precio
 * - 6.3: Allow admin to override manually for discounts
 * - 6.4: Allow amounts less than sum (discount scenario)
 */
export function PaymentTotalDisplay({
  calculatedTotal,
  currentTotal,
  isManual,
  formatCurrency,
  onTotalChange,
}: PaymentTotalDisplayProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState('')

  // Sync edit value when not editing
  useEffect(() => {
    if (!isEditing) {
      setEditValue(currentTotal.toString())
    }
  }, [currentTotal, isEditing])

  const handleStartEdit = () => {
    setEditValue(currentTotal.toString())
    setIsEditing(true)
  }

  const handleConfirmEdit = () => {
    const newTotal = parseFloat(editValue) || 0
    if (newTotal > 0) {
      const isManualOverride = newTotal !== calculatedTotal
      onTotalChange(newTotal, isManualOverride)
    }
    setIsEditing(false)
  }

  const handleCancelEdit = () => {
    setEditValue(currentTotal.toString())
    setIsEditing(false)
  }

  const handleResetToCalculated = () => {
    onTotalChange(calculatedTotal, false)
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleConfirmEdit()
    } else if (e.key === 'Escape') {
      handleCancelEdit()
    }
  }

  return (
    <GlassPanel className="p-4 bg-gradient-to-r from-[#34d399]/10 to-transparent">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[#9ca3af] text-sm uppercase tracking-wide">
            Total a Pagar
          </p>
          {isEditing ? (
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[#f9fafb] text-xl">$</span>
              <GlassInput
                type="number"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-32 text-xl font-bold"
                autoFocus
                min="0"
                step="1000"
              />
              <GlassButton
                variant="ghost"
                size="sm"
                onClick={handleConfirmEdit}
                className="text-[#34d399]"
              >
                <Check className="w-4 h-4" />
              </GlassButton>
              <GlassButton
                variant="ghost"
                size="sm"
                onClick={handleCancelEdit}
                className="text-[#fca5a5]"
              >
                <X className="w-4 h-4" />
              </GlassButton>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-[#34d399] text-3xl font-bold">
                {formatCurrency(currentTotal)}
              </span>
              <GlassButton
                variant="ghost"
                size="sm"
                onClick={handleStartEdit}
                className="text-[#9ca3af] hover:text-[#f9fafb]"
                aria-label="Editar monto"
              >
                <Edit2 className="w-4 h-4" />
              </GlassButton>
            </div>
          )}
        </div>

        {/* Show indicator if manual override */}
        {isManual && !isEditing && (
          <div className="text-right">
            <p className="text-amber-400 text-xs">Monto editado</p>
            <button
              onClick={handleResetToCalculated}
              className="text-[#9ca3af] text-xs hover:text-[#f9fafb] underline"
            >
              Restaurar ({formatCurrency(calculatedTotal)})
            </button>
          </div>
        )}
      </div>

      {currentTotal <= 0 && (
        <p className="text-amber-400 text-sm mt-2">
          El monto debe ser mayor a cero
        </p>
      )}
    </GlassPanel>
  )
}
