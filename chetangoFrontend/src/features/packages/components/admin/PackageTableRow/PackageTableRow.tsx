// ============================================
// PACKAGE TABLE ROW COMPONENT
// Updated: Feb 6, 2026 - Added indicators for private classes
// ============================================

import { Badge, GlassButton } from '@/design-system'
import { GlassTableCell, GlassTableRow } from '@/design-system/molecules/GlassTable'
import { ClickableAvatar } from '@/features/users'
import { Eye, Snowflake, Sun, User, Users } from 'lucide-react'
import type { EstadoPaquete, PaqueteListItemDTO } from '../../../types/packageTypes'

interface PackageTableRowProps {
  /** Package data to display */
  paquete: PaqueteListItemDTO
  /** Callback when view detail button is clicked */
  onViewDetail: () => void
  /** Callback when congelar button is clicked (only for Activo packages) */
  onCongelar?: () => void
  /** Callback when descongelar button is clicked (only for Congelado packages) */
  onDescongelar?: () => void
  /** Helper function to get initials from name */
  getInitials: (nombre: string) => string
  /** Helper function to calculate consumption percentage */
  getConsumoPercentage: (paquete: PaqueteListItemDTO) => number
}

/**
 * Determines if the Congelar button should be visible
 * Property 20: Congelar Button Visibility
 * The "Congelar" button SHALL be visible only when `estado === 'Activo'`
 *
 * Requirements: 8.6
 */
export function shouldShowCongelarButton(estado: EstadoPaquete): boolean {
  return estado === 'Activo'
}

/**
 * Determines if the Descongelar button should be visible
 * Property 22: Descongelar Button Visibility
 * The "Descongelar" button SHALL be visible only when `estado === 'Congelado'`
 *
 * Requirements: 9.6
 */
export function shouldShowDescongelarButton(estado: EstadoPaquete): boolean {
  return estado === 'Congelado'
}

/**
 * Maps EstadoPaquete to Badge variant
 * Property 8: Estado Badge Color Mapping
 * - Activo: green (active variant)
 * - Agotado: orange (depleted variant)
 * - Congelado: blue (frozen variant)
 * - Vencido: gray (expired variant)
 *
 * Requirements: 3.8
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
 * Requirements: 3.9
 */
export function formatDate(isoDate: string): string {
  try {
    const date = new Date(isoDate)
    return date.toLocaleDateString('es-CO', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  } catch {
    return isoDate
  }
}

/**
 * Check if package is private (for 1 or 2 persons)
 */
export function isPrivatePackage(nombreTipoPaquete: string): boolean {
  return nombreTipoPaquete.toLowerCase().includes('privada')
}

/**
 * Check if package is for 2 persons (couple)
 */
export function isTwoPersonsPackage(nombreTipoPaquete: string): boolean {
  return nombreTipoPaquete.toLowerCase().includes('2 personas') || 
         nombreTipoPaquete.toLowerCase().includes('2p')
}

/**
 * Gets the color class for the progress bar based on percentage
 */
function getProgressBarColor(percentage: number): string {
  if (percentage >= 100) return 'bg-[rgba(239,68,68,0.8)]' // Red - exhausted
  if (percentage >= 75) return 'bg-[rgba(245,158,11,0.8)]' // Orange - warning
  return 'bg-[rgba(52,211,153,0.8)]' // Green - healthy
}

/**
 * Row component for displaying a single package in the table
 * - Avatar with initials of the student
 * - Progress bar for consumption with percentage
 * - Badge for estado with corresponding color
 * - Formatted dates for vigencia
 * - View detail button (eye icon)
 * - Congelar button (snowflake icon) - only for Activo packages
 * - Descongelar button (sun icon) - only for Congelado packages
 *
 * Requirements: 3.5, 3.6, 3.7, 3.8, 3.9, 3.10, 8.6, 9.6
 */
export function PackageTableRow({
  paquete,
  onViewDetail,
  onCongelar,
  onDescongelar,
  getInitials,
  getConsumoPercentage,
}: PackageTableRowProps) {
  const initials = getInitials(paquete.nombreAlumno)
  const percentage = getConsumoPercentage(paquete)
  const progressBarColor = getProgressBarColor(percentage)
  const badgeVariant = getEstadoBadgeVariant(paquete.estado)
  const showCongelarButton = shouldShowCongelarButton(paquete.estado)
  const showDescongelarButton = shouldShowDescongelarButton(paquete.estado)
  const isPrivate = isPrivatePackage(paquete.nombreTipoPaquete)
  const isTwoPersons = isTwoPersonsPackage(paquete.nombreTipoPaquete)

  return (
    <GlassTableRow>
      {/* ALUMNO column - Requirements: 3.5 */}
      <GlassTableCell>
        <ClickableAvatar
          userId={paquete.idAlumno}
          userType="alumno"
          nombre={paquete.nombreAlumno}
          secondaryText={paquete.documentoAlumno}
          showInfo
          size="md"
        />
      </GlassTableCell>

      {/* PAQUETE column - Requirements: 3.6 */}
      <GlassTableCell>
        <div className="flex items-start gap-2">
          {/* Icon indicator for private packages */}
          {isPrivate && (
            <div 
              className={`
                flex-shrink-0 mt-0.5
                ${isTwoPersons ? 'text-blue-400' : 'text-purple-400'}
              `}
              title={isTwoPersons ? 'Paquete privado para 2 personas' : 'Paquete privado individual'}
            >
              {isTwoPersons ? <Users className="w-4 h-4" /> : <User className="w-4 h-4" />}
            </div>
          )}
          <div className="flex flex-col min-w-0">
            <span className="text-[#f9fafb] font-medium truncate">
              {paquete.nombreTipoPaquete}
            </span>
            <span className="text-[#6b7280] text-sm">
              {paquete.clasesDisponibles} clases
            </span>
            {/* Badge for private packages */}
            {isPrivate && (
              <span className={`
                text-xs mt-1 inline-block
                ${isTwoPersons ? 'text-blue-400' : 'text-purple-400'}
              `}>
                {isTwoPersons ? '👥 Pareja' : '👤 Individual'}
              </span>
            )}
          </div>
        </div>
      </GlassTableCell>

      {/* CONSUMO column - Requirements: 3.7 */}
      <GlassTableCell>
        <div className="flex flex-col gap-1.5">
          <span className="text-[#d1d5db] text-sm">
            {paquete.clasesUsadas} / {paquete.clasesDisponibles}
          </span>
          {/* Progress bar */}
          <div className="w-24 h-2 bg-[rgba(255,255,255,0.1)] rounded-full overflow-hidden">
            <div
              className={`h-full ${progressBarColor} transition-all duration-300`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
          <span className="text-[#6b7280] text-xs">{percentage}%</span>
        </div>
      </GlassTableCell>

      {/* ESTADO column - Requirements: 3.8 */}
      <GlassTableCell>
        <Badge variant={badgeVariant} shape="pill">
          {paquete.estado}
        </Badge>
      </GlassTableCell>

      {/* VIGENCIA column - Requirements: 3.9 */}
      <GlassTableCell>
        <div className="flex flex-col">
          <span className="text-[#d1d5db] text-sm">
            {formatDate(paquete.fechaActivacion)}
          </span>
          <span className="text-[#6b7280] text-sm">
            al {formatDate(paquete.fechaVencimiento)}
          </span>
        </div>
      </GlassTableCell>

      {/* ACCIONES column - Requirements: 3.10, 8.6, 9.6 */}
      <GlassTableCell>
        <div className="flex items-center gap-2">
          <GlassButton
            variant="ghost"
            size="sm"
            onClick={onViewDetail}
            aria-label={`Ver detalle del paquete de ${paquete.nombreAlumno}`}
            className="p-2"
          >
            <Eye className="w-4 h-4" />
          </GlassButton>
          {/* Congelar button - Property 20: Only visible for Activo packages */}
          {showCongelarButton && onCongelar && (
            <GlassButton
              variant="ghost"
              size="sm"
              onClick={onCongelar}
              aria-label={`Congelar paquete de ${paquete.nombreAlumno}`}
              className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20"
            >
              <Snowflake className="w-4 h-4" />
            </GlassButton>
          )}
          {/* Descongelar button - Property 22: Only visible for Congelado packages */}
          {showDescongelarButton && onDescongelar && (
            <GlassButton
              variant="ghost"
              size="sm"
              onClick={onDescongelar}
              aria-label={`Descongelar paquete de ${paquete.nombreAlumno}`}
              className="p-2 text-amber-400 hover:text-amber-300 hover:bg-amber-500/20"
            >
              <Sun className="w-4 h-4" />
            </GlassButton>
          )}
        </div>
      </GlassTableCell>
    </GlassTableRow>
  )
}
