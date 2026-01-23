// ============================================
// REPROGRAMAR MODAL COMPONENT
// Modal for student to reschedule a class
// Requirements: 6.2
// ============================================

import { useState } from 'react'
import { X, Calendar, AlertTriangle, Clock, Loader2 } from 'lucide-react'
import { GlassPanel, GlassButton, GlassInput } from '@/design-system'
import type { ClaseAlumno } from '../types/classTypes'
import { formatearFechaCompleta, formatearHora24 } from '../utils/dateUtils'

// ============================================
// TYPES
// ============================================

export interface ReprogramarModalProps {
  /** Whether the modal is open */
  isOpen: boolean
  /** Callback to close the modal */
  onClose: () => void
  /** Class data */
  clase: ClaseAlumno | null
  /** Callback when reprogramación is confirmed */
  onConfirm: (nuevaFecha: string) => Promise<void>
  /** Whether the confirmation is in progress */
  isLoading?: boolean
}

// ============================================
// COMPONENT
// ============================================

/**
 * ReprogramarModal - Modal for rescheduling a class
 *
 * Features:
 * - Display original class info
 * - Important notice about reprogramación
 * - Date selector
 * - Plazo de reprogramación info
 * - "Confirmar Reprogramación" button
 * - Glassmorphism modal styles
 *
 * Requirements: 6.2
 */
export function ReprogramarModal({
  isOpen,
  onClose,
  clase,
  onConfirm,
  isLoading = false,
}: ReprogramarModalProps) {
  const [nuevaFecha, setNuevaFecha] = useState('')
  const [error, setError] = useState('')

  if (!isOpen || !clase) return null

  // Get minimum date (tomorrow)
  const minDate = (() => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split('T')[0]
  })()

  // Handle date change
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNuevaFecha(e.target.value)
    setError('')
  }

  // Handle confirmation
  const handleConfirm = async () => {
    if (!nuevaFecha) {
      setError('Selecciona una fecha para reprogramar')
      return
    }

    try {
      await onConfirm(nuevaFecha)
      setNuevaFecha('')
      setError('')
    } catch {
      setError('Error al reprogramar la clase. Intenta de nuevo.')
    }
  }

  // Handle close
  const handleClose = () => {
    setNuevaFecha('')
    setError('')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <GlassPanel className="relative z-10 w-full max-w-md mx-4 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Reprogramar Clase</h2>
          <GlassButton
            variant="icon"
            onClick={handleClose}
            disabled={isLoading}
            className="!p-2"
          >
            <X className="w-5 h-5" />
          </GlassButton>
        </div>

        {/* Original Class Info */}
        <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10">
          <p className="text-gray-400 text-xs mb-2">Clase original</p>
          <h3 className="text-lg font-medium text-white mb-2">{clase.nombre}</h3>
          <div className="space-y-1 text-sm text-gray-300">
            <p className="capitalize">{formatearFechaCompleta(clase.fecha)}</p>
            <p>
              {formatearHora24(clase.horaInicio)} - {formatearHora24(clase.horaFin)}
            </p>
            <p>Profesor: {clase.profesor}</p>
          </div>
        </div>

        {/* Important Notice */}
        <div className="mb-6 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/30">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-yellow-300 text-sm font-medium mb-1">
                Importante
              </p>
              <p className="text-yellow-200/70 text-xs">
                Al reprogramar, tu clase original será cancelada y se te asignará
                una nueva fecha. Esta acción no se puede deshacer.
              </p>
            </div>
          </div>
        </div>

        {/* Date Selector */}
        <div className="mb-6">
          <label className="block text-gray-300 mb-2 text-sm">
            Nueva fecha <span className="text-red-400">*</span>
          </label>
          <GlassInput
            type="date"
            value={nuevaFecha}
            onChange={handleDateChange}
            min={minDate}
            icon={<Calendar className="w-4 h-4" />}
            error={error}
          />
          <p className="text-gray-500 text-xs mt-2">
            Selecciona la nueva fecha para tu clase
          </p>
        </div>

        {/* Plazo Info */}
        {clase.horasParaReprogramar && (
          <div className="mb-6 flex items-center gap-2 text-gray-400 text-sm">
            <Clock className="w-4 h-4" />
            <span>
              Plazo de reprogramación: hasta {clase.horasParaReprogramar} horas antes
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3">
          <GlassButton
            variant="secondary"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancelar
          </GlassButton>
          <GlassButton
            variant="primary"
            onClick={handleConfirm}
            disabled={isLoading || !nuevaFecha}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Reprogramando...</span>
              </>
            ) : (
              'Confirmar Reprogramación'
            )}
          </GlassButton>
        </div>
      </GlassPanel>
    </div>
  )
}
