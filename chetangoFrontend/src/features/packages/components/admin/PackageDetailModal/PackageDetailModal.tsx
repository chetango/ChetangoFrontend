// ============================================
// PACKAGE DETAIL MODAL COMPONENT
// Modal for viewing detailed package information with consumption history
// Requirements: 6.3, 6.4, 6.5, 6.6, 6.7, 6.8, 6.9, 10.4
// ============================================

import {
    Badge,
    GlassButton,
    GlassPanel,
    Skeleton,
    SkeletonAvatar,
    SkeletonText,
} from '@/design-system'
import { useModalScroll } from '@/shared/hooks'
import { Calendar, Info, Package, RefreshCw, User, X } from 'lucide-react'
import type {
    EstadoPaquete,
    PaqueteDetalleDTO,
} from '../../../types/packageTypes'
import { ConsumptionHistoryItem } from './ConsumptionHistoryItem'

// ============================================
// TYPES
// ============================================

export interface PackageDetailModalProps {
  /** Whether the modal is open */
  isOpen: boolean
  /** Callback to close the modal */
  onClose: () => void
  /** Package detail data (null when loading) */
  paqueteDetail: PaqueteDetalleDTO | null | undefined
  /** Whether the detail is loading */
  isLoading?: boolean
  /** Callback when Renovar button is clicked */
  onRenovar?: () => void
  /** Helper function to get initials from name */
  getInitials: (nombre: string) => string
}

// ============================================
// HELPER FUNCTIONS (exported for testing)
// ============================================

/**
 * Maps EstadoPaquete to Badge variant
 * Requirements: 6.3
 */
export function getEstadoBadgeVariant(
  estado: EstadoPaquete
): 'active' | 'depleted' | 'frozen' | 'expired' {
  const variantMap: Record<EstadoPaquete, 'active' | 'depleted' | 'frozen' | 'expired'> = {
    Activo: 'active',
    Agotado: 'depleted',
    Congelado: 'frozen',
    Vencido: 'expired',
  }
  return variantMap[estado]
}

/**
 * Formats ISO date string to localized date format
 * Requirements: 6.3
 */
export function formatDetailDate(isoDate: string): string {
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

/**
 * Calculates consumption percentage
 * Property 17: Consumo Display in Detail Modal
 * Requirements: 6.4
 */
export function calculateConsumoPercentage(
  clasesUsadas: number,
  clasesDisponibles: number
): number {
  if (clasesDisponibles === 0) return 0
  return Math.round((clasesUsadas / clasesDisponibles) * 100)
}

/**
 * Gets the color class for the progress bar based on percentage
 * Requirements: 6.4
 */
export function getProgressBarColor(percentage: number): string {
  if (percentage >= 100) return 'bg-[rgba(239,68,68,0.8)]' // Red - exhausted
  if (percentage >= 75) return 'bg-[rgba(245,158,11,0.8)]' // Orange - warning
  return 'bg-[rgba(52,211,153,0.8)]' // Green - healthy
}

// ============================================
// SKELETON COMPONENT
// ============================================

function PackageDetailSkeleton() {
  return (
    <div className="space-y-6">
      {/* Alumno Section Skeleton */}
      <div className="flex items-center gap-4">
        <SkeletonAvatar className="w-14 h-14" />
        <div className="flex-1 space-y-2">
          <SkeletonText className="w-48" />
          <SkeletonText className="w-32" />
        </div>
      </div>

      {/* Package Info Section Skeleton */}
      <div className="space-y-3">
        <Skeleton className="h-6 w-40" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-16 rounded-lg" />
          <Skeleton className="h-16 rounded-lg" />
        </div>
      </div>

      {/* Consumo Section Skeleton */}
      <div className="space-y-3">
        <Skeleton className="h-6 w-36" />
        <Skeleton className="h-24 rounded-lg" />
      </div>

      {/* Historial Section Skeleton */}
      <div className="space-y-3">
        <Skeleton className="h-6 w-44" />
        <Skeleton className="h-16 rounded-lg" />
        <Skeleton className="h-16 rounded-lg" />
        <Skeleton className="h-16 rounded-lg" />
      </div>
    </div>
  )
}

// ============================================
// COMPONENT
// ============================================

/**
 * PackageDetailModal - Modal for viewing detailed package information
 *
 * Features:
 * - Sección Información del Alumno: avatar, nombre, documento
 * - Sección Información del Paquete: tipo, estado badge, fecha inicio, fecha fin
 * - Sección Consumo de Clases: Total, Usadas, Restantes, barra de progreso
 * - Sección Historial de Consumo: lista de asistencias
 * - Nota informativa sobre historial solo lectura
 * - Botones Renovar y Cerrar
 * - Skeleton loader durante carga
 *
 * Requirements: 6.3, 6.4, 6.5, 6.6, 6.7, 6.8, 6.9, 10.4
 */
export function PackageDetailModal({
  isOpen,
  onClose,
  paqueteDetail,
  isLoading = false,
  onRenovar,
  getInitials,
}: PackageDetailModalProps) {
  // Hook para manejar scroll del modal
  const containerRef = useModalScroll(isOpen)

  // Don't render if not open
  if (!isOpen) return null

  const initials = paqueteDetail ? getInitials(paqueteDetail.nombreAlumno) : '??'
  const percentage = paqueteDetail
    ? calculateConsumoPercentage(paqueteDetail.clasesUsadas, paqueteDetail.clasesDisponibles)
    : 0
  const progressBarColor = getProgressBarColor(percentage)
  const historial = paqueteDetail?.historialConsumo || []
  const alumnosDelPago = paqueteDetail?.alumnosDelPago || []
  const esCompartido = alumnosDelPago.length > 1

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 z-[100] flex items-start justify-center pt-20 px-4 pb-8 overflow-y-auto"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm -z-10"
        onClick={onClose}
      />

      {/* Modal */}
      <GlassPanel className="relative z-10 w-full max-w-2xl p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Detalle del Paquete</h2>
          <GlassButton
            variant="icon"
            onClick={onClose}
            className="!p-2"
          >
            <X className="w-5 h-5" />
          </GlassButton>
        </div>

        {/* Content */}
        {isLoading ? (
          <PackageDetailSkeleton />
        ) : paqueteDetail ? (
          <div className="space-y-6">
            {/* ============================================ */}
            {/* Sección Información del Alumno - Requirements: 6.3 */}
            {/* ============================================ */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <User className="w-4 h-4 text-[#c93448]" />
                <h3 className="text-sm font-medium text-[#9ca3af] uppercase tracking-wider">
                  {esCompartido ? 'Información de Alumnos' : 'Información del Alumno'}
                </h3>
              </div>
              {esCompartido ? (
                <div className="space-y-3">
                  {alumnosDelPago.map((alumno) => (
                    <div key={alumno.idAlumno} className="flex items-center gap-3">
                      <User className="w-5 h-5 text-[#c93448] flex-shrink-0" />
                      <span className="text-[#f9fafb] font-medium">{alumno.nombreAlumno}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  {/* Avatar with initials */}
                  <div
                    className="
                      w-14 h-14
                      rounded-full
                      flex items-center justify-center
                      backdrop-blur-xl
                      bg-[rgba(201,52,72,0.2)]
                      border border-[rgba(201,52,72,0.4)]
                      text-[#f9fafb]
                      font-semibold
                      text-lg
                      flex-shrink-0
                    "
                    aria-label={`Avatar de ${paqueteDetail.nombreAlumno}`}
                  >
                    {initials}
                  </div>
                  {/* Name and document */}
                  <div className="flex flex-col">
                    <span className="text-[#f9fafb] font-semibold text-lg">
                      {paqueteDetail.nombreAlumno}
                    </span>
                    <span className="text-[#9ca3af] text-sm">
                      Documento: {paqueteDetail.idAlumno.substring(0, 8)}...
                    </span>
                  </div>
                </div>
              )}
            </section>

            {/* ============================================ */}
            {/* Sección Información del Paquete - Requirements: 6.3 */}
            {/* ============================================ */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <Package className="w-4 h-4 text-[#c93448]" />
                <h3 className="text-sm font-medium text-[#9ca3af] uppercase tracking-wider">
                  Información del Paquete
                </h3>
              </div>
              <div
                className="
                  p-4
                  rounded-xl
                  bg-[rgba(255,255,255,0.03)]
                  border border-[rgba(255,255,255,0.08)]
                "
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[#f9fafb] font-semibold text-lg">
                    {paqueteDetail.nombreTipoPaquete}
                  </span>
                  <Badge variant={getEstadoBadgeVariant(paqueteDetail.estado)} shape="pill">
                    {paqueteDetail.estado}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#6b7280]" />
                    <div className="flex flex-col">
                      <span className="text-[#6b7280] text-xs">Fecha Inicio</span>
                      <span className="text-[#d1d5db] text-sm">
                        {formatDetailDate(paqueteDetail.fechaActivacion)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#6b7280]" />
                    <div className="flex flex-col">
                      <span className="text-[#6b7280] text-xs">Fecha Fin</span>
                      <span className="text-[#d1d5db] text-sm">
                        {formatDetailDate(paqueteDetail.fechaVencimiento)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ============================================ */}
            {/* Sección Consumo de Clases - Requirements: 6.4, 6.5 */}
            {/* ============================================ */}
            <section>
              <h3 className="text-sm font-medium text-[#9ca3af] uppercase tracking-wider mb-3">
                Consumo de Clases
              </h3>
              <div
                className="
                  p-4
                  rounded-xl
                  bg-[rgba(255,255,255,0.03)]
                  border border-[rgba(255,255,255,0.08)]
                "
              >
                {/* Stats row */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <span className="text-[#6b7280] text-xs block mb-1">Total</span>
                    <span className="text-[#f9fafb] font-bold text-2xl">
                      {paqueteDetail.clasesDisponibles}
                    </span>
                  </div>
                  <div className="text-center">
                    <span className="text-[#6b7280] text-xs block mb-1">Usadas</span>
                    <span className="text-[#fcd34d] font-bold text-2xl">
                      {paqueteDetail.clasesUsadas}
                    </span>
                  </div>
                  <div className="text-center">
                    <span className="text-[#6b7280] text-xs block mb-1">Restantes</span>
                    <span className="text-[#6ee7b7] font-bold text-2xl">
                      {paqueteDetail.clasesRestantes}
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-[#9ca3af]">
                    <span>Progreso de consumo</span>
                    <span>{percentage}%</span>
                  </div>
                  <div className="w-full h-3 bg-[rgba(255,255,255,0.1)] rounded-full overflow-hidden">
                    <div
                      className={`h-full ${progressBarColor} transition-all duration-300 rounded-full`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* ============================================ */}
            {/* Sección Historial de Consumo - Requirements: 6.5, 6.6 */}
            {/* ============================================ */}
            <section>
              <h3 className="text-sm font-medium text-[#9ca3af] uppercase tracking-wider mb-3">
                Historial de Consumo
              </h3>

              {historial.length > 0 ? (
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {historial.map((asistencia) => (
                    <ConsumptionHistoryItem
                      key={asistencia.idAsistencia}
                      asistencia={asistencia}
                    />
                  ))}
                </div>
              ) : (
                /* Empty state - Requirements: 12.3 */
                <div
                  className="
                    p-6
                    rounded-xl
                    bg-[rgba(255,255,255,0.03)]
                    border border-[rgba(255,255,255,0.08)]
                    text-center
                  "
                >
                  <Calendar className="w-10 h-10 text-[#6b7280] mx-auto mb-2" />
                  <p className="text-[#9ca3af] text-sm">
                    Este paquete aún no tiene consumos registrados
                  </p>
                </div>
              )}

              {/* Informative note - Requirements: 6.7 */}
              <div
                className="
                  flex items-start gap-2
                  mt-3
                  p-3
                  rounded-lg
                  bg-[rgba(59,130,246,0.1)]
                  border border-[rgba(59,130,246,0.2)]
                "
              >
                <Info className="w-4 h-4 text-[#93c5fd] flex-shrink-0 mt-0.5" />
                <p className="text-[#93c5fd] text-xs">
                  Este historial es solo lectura. Las asistencias se editan en el módulo de Asistencias.
                </p>
              </div>
            </section>

            {/* ============================================ */}
            {/* Action Buttons - Requirements: 6.8 */}
            {/* ============================================ */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[rgba(255,255,255,0.08)]">
              {onRenovar && (
                <GlassButton
                  variant="secondary"
                  onClick={onRenovar}
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Renovar</span>
                </GlassButton>
              )}
              <GlassButton
                variant="primary"
                onClick={onClose}
              >
                Cerrar
              </GlassButton>
            </div>
          </div>
        ) : (
          /* Error state - Requirements: 6.9 */
          <div className="text-center py-8">
            <Package className="w-12 h-12 text-[#6b7280] mx-auto mb-3" />
            <p className="text-[#9ca3af]">
              El paquete especificado no existe
            </p>
          </div>
        )}
      </GlassPanel>
    </div>
  )
}
