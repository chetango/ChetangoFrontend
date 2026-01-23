// ============================================
// ATTENDANCE HISTORY CARD COMPONENT - STUDENT VIEW
// ============================================

import {
  Calendar,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Info,
  Package,
  Clock,
  Gift,
  Sparkles,
  ChevronRight,
} from 'lucide-react'
import type { AsistenciaRecord, EstadoAsistencia, TipoAsistencia } from '../../../types/studentTypes'

interface AttendanceHistoryCardProps {
  /** Attendance record to display */
  record: AsistenciaRecord
  /** Click handler for viewing details */
  onClick: () => void
}

/**
 * Estado info configuration
 */
interface EstadoInfo {
  color: 'green' | 'gray' | 'blue'
  label: string
  icon: React.ComponentType<{ className?: string }>
}

/**
 * Tipo info configuration
 */
interface TipoInfo {
  color: 'purple' | 'yellow'
  label: string
  icon: React.ComponentType<{ className?: string }>
}

/**
 * Get estado display info
 */
export function getEstadoInfo(estado: EstadoAsistencia): EstadoInfo {
  switch (estado) {
    case 'presente':
      return { color: 'green', label: 'Presente', icon: CheckCircle2 }
    case 'ausente':
      return { color: 'gray', label: 'Ausente', icon: XCircle }
    case 'reprogramada':
      return { color: 'blue', label: 'Reprogramada', icon: RefreshCw }
    default:
      return { color: 'gray', label: 'Desconocido', icon: Info }
  }
}

/**
 * Get tipo display info
 */
export function getTipoInfo(tipo: TipoAsistencia): TipoInfo {
  switch (tipo) {
    case 'normal':
      return { color: 'purple', label: 'Normal', icon: Package }
    case 'clase_suelta':
      return { color: 'yellow', label: 'Clase suelta', icon: Clock }
    case 'cortesia':
      return { color: 'yellow', label: 'Cortesía', icon: Gift }
    case 'prueba':
      return { color: 'yellow', label: 'Prueba', icon: Sparkles }
    default:
      return { color: 'purple', label: 'Normal', icon: Package }
  }
}

/**
 * Format date to Spanish locale
 */
export function formatearFecha(fecha: string): string {
  const date = new Date(fecha + 'T00:00:00')
  const opciones: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }
  return date.toLocaleDateString('es-ES', opciones)
}

/**
 * Format time to 12h format
 */
export function formatearHora12(hora24: string): string {
  const [hours, minutes] = hora24.split(':')
  const h = parseInt(hours)
  const ampm = h >= 12 ? 'PM' : 'AM'
  const h12 = h % 12 || 12
  return `${h12}:${minutes} ${ampm}`
}

/**
 * Get estado badge classes
 */
function getEstadoBadgeClasses(color: 'green' | 'gray' | 'blue'): string {
  switch (color) {
    case 'green':
      return 'bg-[rgba(52,211,153,0.15)] border-[rgba(52,211,153,0.3)] text-[#34d399]'
    case 'gray':
      return 'bg-[rgba(156,163,175,0.15)] border-[rgba(156,163,175,0.3)] text-[#9ca3af]'
    case 'blue':
      return 'bg-[rgba(59,130,246,0.15)] border-[rgba(59,130,246,0.3)] text-[#60a5fa]'
    default:
      return 'bg-[rgba(156,163,175,0.15)] border-[rgba(156,163,175,0.3)] text-[#9ca3af]'
  }
}

/**
 * Get tipo badge classes
 */
function getTipoBadgeClasses(color: 'purple' | 'yellow'): string {
  switch (color) {
    case 'purple':
      return 'bg-[rgba(124,90,248,0.15)] border-[rgba(124,90,248,0.3)] text-[#9b8afb]'
    case 'yellow':
      return 'bg-[rgba(245,158,11,0.15)] border-[rgba(245,158,11,0.3)] text-[#fcd34d]'
    default:
      return 'bg-[rgba(124,90,248,0.15)] border-[rgba(124,90,248,0.3)] text-[#9b8afb]'
  }
}

/**
 * AttendanceHistoryCard component for student attendance view
 * Displays a single attendance record with responsive layout
 * 
 * Features:
 * - Desktop: Grid layout with columns for fecha, clase, estado, tipo, impacto
 * - Mobile: Stacked layout with badges
 * - Click to view details
 * 
 * Requirements: 4.4
 */
export function AttendanceHistoryCard({ record, onClick }: AttendanceHistoryCardProps) {
  const estadoInfo = getEstadoInfo(record.estado)
  const tipoInfo = getTipoInfo(record.tipo)
  const EstadoIcon = estadoInfo.icon
  const TipoIcon = tipoInfo.icon

  return (
    <div
      onClick={onClick}
      className="
        p-6 
        hover:bg-[rgba(255,255,255,0.02)] 
        transition-all duration-200
        cursor-pointer
        group
      "
      data-testid={`attendance-history-card-${record.id}`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      }}
      aria-label={`Ver detalle de asistencia del ${formatearFecha(record.fecha)} - ${record.clase}`}
    >
      {/* Desktop Layout */}
      <div className="hidden md:grid grid-cols-12 gap-4 items-center">
        {/* Fecha */}
        <div className="col-span-2">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#6b7280]" />
            <p className="text-[#d1d5db] text-[14px]">{formatearFecha(record.fecha)}</p>
          </div>
        </div>

        {/* Clase */}
        <div className="col-span-3">
          <p className="text-[#f9fafb] font-medium" style={{ fontSize: '15px' }}>
            {record.clase}
          </p>
          <p className="text-[#6b7280] text-[13px] mt-0.5">
            {formatearHora12(record.horaInicio)} - {formatearHora12(record.horaFin)}
          </p>
        </div>

        {/* Estado */}
        <div className="col-span-2">
          <span
            className={`
              px-3 py-1.5 rounded-lg text-[12px] font-medium
              backdrop-blur-sm flex items-center gap-1.5 inline-flex
              border
              ${getEstadoBadgeClasses(estadoInfo.color)}
            `}
          >
            <EstadoIcon className="w-3.5 h-3.5" />
            {estadoInfo.label}
          </span>
        </div>

        {/* Tipo */}
        <div className="col-span-2">
          <span
            className={`
              px-3 py-1.5 rounded-lg text-[12px] font-medium
              backdrop-blur-sm flex items-center gap-1.5 inline-flex
              border
              ${getTipoBadgeClasses(tipoInfo.color)}
            `}
          >
            <TipoIcon className="w-3.5 h-3.5" />
            {tipoInfo.label}
          </span>
        </div>

        {/* Impacto */}
        <div className="col-span-2">
          {record.descontada ? (
            <span
              className="
                px-3 py-1.5 rounded-lg text-[12px] font-medium
                backdrop-blur-sm flex items-center gap-1.5 inline-flex
                bg-[rgba(124,90,248,0.15)] border border-[rgba(124,90,248,0.3)] text-[#9b8afb]
              "
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Descontada
            </span>
          ) : (
            <span
              className="
                px-3 py-1.5 rounded-lg text-[12px] font-medium
                backdrop-blur-sm flex items-center gap-1.5 inline-flex
                bg-[rgba(156,163,175,0.12)] border border-[rgba(156,163,175,0.25)] text-[#9ca3af]
              "
            >
              <Info className="w-3.5 h-3.5" />
              No descontada
            </span>
          )}
        </div>

        {/* Arrow */}
        <div className="col-span-1 flex justify-end">
          <ChevronRight className="w-5 h-5 text-[#6b7280] group-hover:text-[#9ca3af] group-hover:translate-x-1 transition-all" />
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-[#f9fafb] font-medium mb-1" style={{ fontSize: '15px' }}>
              {record.clase}
            </p>
            <div className="flex items-center gap-2 text-[#6b7280] text-[13px]">
              <Calendar className="w-3.5 h-3.5" />
              {formatearFecha(record.fecha)}
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-[#6b7280] flex-shrink-0" />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Estado Badge */}
          <span
            className={`
              px-2.5 py-1 rounded-lg text-[11px] font-medium
              backdrop-blur-sm flex items-center gap-1
              border
              ${getEstadoBadgeClasses(estadoInfo.color)}
            `}
          >
            <EstadoIcon className="w-3 h-3" />
            {estadoInfo.label}
          </span>

          {/* Tipo Badge */}
          <span
            className={`
              px-2.5 py-1 rounded-lg text-[11px] font-medium
              backdrop-blur-sm flex items-center gap-1
              border
              ${getTipoBadgeClasses(tipoInfo.color)}
            `}
          >
            <TipoIcon className="w-3 h-3" />
            {tipoInfo.label}
          </span>

          {/* Impacto Badge */}
          {record.descontada ? (
            <span
              className="
                px-2.5 py-1 rounded-lg text-[11px] font-medium
                backdrop-blur-sm flex items-center gap-1
                bg-[rgba(124,90,248,0.15)] border border-[rgba(124,90,248,0.3)] text-[#9b8afb]
              "
            >
              <CheckCircle2 className="w-3 h-3" />
              Descontada
            </span>
          ) : (
            <span
              className="
                px-2.5 py-1 rounded-lg text-[11px] font-medium
                backdrop-blur-sm flex items-center gap-1
                bg-[rgba(156,163,175,0.12)] border border-[rgba(156,163,175,0.25)] text-[#9ca3af]
              "
            >
              <Info className="w-3 h-3" />
              No descontada
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
