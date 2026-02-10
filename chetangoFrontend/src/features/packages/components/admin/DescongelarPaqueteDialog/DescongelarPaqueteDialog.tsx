// ============================================
// DESCONGELAR PAQUETE DIALOG COMPONENT
// Dialog for unfreezing a package with calculation display
// Requirements: 9.1, 9.2, 9.4, 9.5
// ============================================

import { GlassButton, GlassPanel } from '@/design-system'
import { toLocalISOString } from '@/shared/utils/dateTimeHelper'
import { Calendar, Clock, Loader2, Sun, X } from 'lucide-react'
import type { CongelacionDTO } from '../../../types/packageTypes'

// ============================================
// TYPES
// ============================================

export interface DescongelarPaqueteDialogProps {
  /** Whether the dialog is open */
  isOpen: boolean
  /** Callback to close the dialog */
  onClose: () => void
  /** Callback when confirm is clicked */
  onConfirm: () => Promise<void>
  /** Package ID being unfrozen */
  idPaquete: string
  /** Student name for display */
  nombreAlumno: string
  /** Package type name for display */
  nombreTipoPaquete: string
  /** Current package expiration date (ISO 8601) */
  fechaVencimiento: string
  /** Active congelacion data */
  congelacion: CongelacionDTO
  /** Whether the form is submitting */
  isSubmitting?: boolean
}

// ============================================
// HELPER FUNCTIONS (exported for testing)
// ============================================

/**
 * Calculates the number of days between two dates
 * Property 23: Descongelar Dialog Calculation Display
 * días congelados = (fechaFin - fechaInicio).days
 *
 * Requirements: 9.2
 */
export function calculateDiasCongelados(fechaInicio: string, fechaFin: string): number {
  if (!fechaInicio || !fechaFin) return 0

  const startDate = new Date(fechaInicio)
  const endDate = new Date(fechaFin)

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return 0

  const diffTime = endDate.getTime() - startDate.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  return Math.max(0, diffDays)
}

/**
 * Calculates the new expiration date after unfreezing
 * Property 23: Descongelar Dialog Calculation Display
 * nueva fecha vencimiento = fechaVencimiento + diasCongelados
 *
 * Requirements: 9.2
 */
export function calculateNuevaFechaVencimiento(
  fechaVencimientoActual: string,
  diasCongelados: number
): string {
  if (!fechaVencimientoActual || diasCongelados <= 0) {
    return fechaVencimientoActual
  }

  const currentDate = new Date(fechaVencimientoActual)

  if (isNaN(currentDate.getTime())) {
    return fechaVencimientoActual
  }

  const newDate = new Date(currentDate)
  newDate.setDate(newDate.getDate() + diasCongelados)

  return toLocalISOString(newDate)
}

/**
 * Formats ISO date string to localized date format
 * Requirements: 9.2
 */
export function formatDisplayDate(isoDate: string): string {
  try {
    const date = new Date(isoDate)
    return date.toLocaleDateString('es-CO', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })
  } catch {
    return isoDate
  }
}

// ============================================
// COMPONENT
// ============================================

/**
 * DescongelarPaqueteDialog - Dialog for unfreezing a package
 *
 * Features:
 * - Mostrar días congelados calculados
 * - Mostrar nueva fecha de vencimiento calculada
 * - Botones Cancelar y Descongelar
 *
 * Requirements: 9.1, 9.2, 9.4, 9.5
 */
export function DescongelarPaqueteDialog({
  isOpen,
  onClose,
  onConfirm,
  nombreAlumno,
  nombreTipoPaquete,
  fechaVencimiento,
  congelacion,
  isSubmitting = false,
}: DescongelarPaqueteDialogProps) {
  // Don't render if not open
  if (!isOpen) return null

  // Calculate days frozen and new expiration date
  const diasCongelados = calculateDiasCongelados(
    congelacion.fechaInicio,
    congelacion.fechaFin
  )
  const nuevaFechaVencimiento = calculateNuevaFechaVencimiento(
    fechaVencimiento,
    diasCongelados
  )

  // Handle confirm
  const handleConfirm = async () => {
    try {
      await onConfirm()
      onClose()
    } catch {
      // Error handling is done in the mutation
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Dialog */}
      <GlassPanel className="relative z-10 w-full max-w-md mx-4 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/20 border border-amber-500/40">
              <Sun className="w-5 h-5 text-amber-400" />
            </div>
            <h2 className="text-xl font-semibold text-white">Descongelar Paquete</h2>
          </div>
          <GlassButton
            variant="icon"
            onClick={onClose}
            disabled={isSubmitting}
            className="!p-2"
          >
            <X className="w-5 h-5" />
          </GlassButton>
        </div>

        {/* Package Info */}
        <div className="mb-6 p-4 rounded-lg bg-white/5 border border-white/10">
          <p className="text-gray-300 text-sm">
            <span className="text-gray-500">Alumno:</span>{' '}
            <span className="font-medium text-white">{nombreAlumno}</span>
          </p>
          <p className="text-gray-300 text-sm mt-1">
            <span className="text-gray-500">Paquete:</span>{' '}
            <span className="font-medium text-white">{nombreTipoPaquete}</span>
          </p>
        </div>

        {/* Calculation Display - Requirements: 9.2 */}
        <div className="space-y-4 mb-6">
          {/* Días Congelados */}
          <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <Clock className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Días congelados</p>
                <p className="text-white font-semibold text-lg">
                  {diasCongelados} día{diasCongelados !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            <div className="mt-2 text-gray-400 text-xs">
              Desde {formatDisplayDate(congelacion.fechaInicio)} hasta{' '}
              {formatDisplayDate(congelacion.fechaFin)}
            </div>
          </div>

          {/* Nueva Fecha de Vencimiento */}
          <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/20">
                <Calendar className="w-4 h-4 text-green-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Nueva fecha de vencimiento</p>
                <p className="text-white font-semibold text-lg">
                  {formatDisplayDate(nuevaFechaVencimiento)}
                </p>
              </div>
            </div>
            <div className="mt-2 text-gray-400 text-xs">
              Fecha anterior: {formatDisplayDate(fechaVencimiento)}
            </div>
          </div>
        </div>

        {/* Info Note - Requirements: 9.4 */}
        <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-sm mb-6">
          <p>
            Al descongelar el paquete, la fecha de vencimiento se extenderá automáticamente
            por {diasCongelados} día{diasCongelados !== 1 ? 's' : ''} y el paquete volverá
            al estado Activo.
          </p>
        </div>

        {/* Action Buttons - Requirements: 9.1, 9.5 */}
        <div className="flex items-center justify-end gap-3">
          <GlassButton
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancelar
          </GlassButton>
          <GlassButton
            type="button"
            variant="primary"
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="!bg-amber-600 hover:!bg-amber-700"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Descongelando...</span>
              </>
            ) : (
              <>
                <Sun className="w-4 h-4" />
                <span>Descongelar</span>
              </>
            )}
          </GlassButton>
        </div>
      </GlassPanel>
    </div>
  )
}
