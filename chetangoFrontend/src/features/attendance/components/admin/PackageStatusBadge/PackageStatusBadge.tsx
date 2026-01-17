// ============================================
// PACKAGE STATUS BADGE COMPONENT
// ============================================

import { Package, AlertCircle, Snowflake } from 'lucide-react'
import type { StudentPackage } from '../../../types/attendanceTypes'

interface PackageStatusBadgeProps {
  package: StudentPackage | null
}

/**
 * Badge component displaying package status with appropriate styling
 * - Activo: green badge, package icon, description, progress bar
 * - Agotado: warning badge, alert icon, "Paquete Agotado"
 * - Congelado: blue badge, snowflake icon, "Paquete Congelado", helper text
 * - SinPaquete: gray badge, alert icon, "Sin paquete activo"
 * 
 * Requirements: 3.3, 3.4, 3.5, 3.6
 */
export function PackageStatusBadge({ package: pkg }: PackageStatusBadgeProps) {
  // Handle null package or SinPaquete state
  if (!pkg || pkg.estado === 'SinPaquete') {
    return (
      <div className="flex flex-col gap-1">
        <span
          className="
            inline-flex items-center gap-2
            px-3 py-1.5
            backdrop-blur-xl
            border
            text-sm
            rounded-lg
            bg-[rgba(156,163,175,0.15)]
            border-[rgba(156,163,175,0.4)]
            text-[#d1d5db]
            shadow-[0_4px_12px_rgba(156,163,175,0.2),inset_0_1px_1px_rgba(156,163,175,0.3)]
          "
        >
          <AlertCircle className="w-4 h-4" />
          <span>Sin paquete activo</span>
        </span>
      </div>
    )
  }

  // Activo state
  if (pkg.estado === 'Activo') {
    const progress = pkg.clasesTotales && pkg.clasesUsadas !== null
      ? (pkg.clasesUsadas / pkg.clasesTotales) * 100
      : 0

    return (
      <div className="flex flex-col gap-1.5">
        <span
          className="
            inline-flex items-center gap-2
            px-3 py-1.5
            backdrop-blur-xl
            border
            text-sm
            rounded-lg
            bg-[rgba(52,211,153,0.15)]
            border-[rgba(52,211,153,0.4)]
            text-[#6ee7b7]
            shadow-[0_4px_12px_rgba(52,211,153,0.2),inset_0_1px_1px_rgba(52,211,153,0.3)]
          "
        >
          <Package className="w-4 h-4" />
          <span>{pkg.descripcion || 'Paquete Activo'}</span>
        </span>
        {pkg.clasesTotales !== null && pkg.clasesUsadas !== null && (
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-[rgba(255,255,255,0.1)] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#6ee7b7] rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs text-[#9ca3af]">
              {pkg.clasesUsadas}/{pkg.clasesTotales}
            </span>
          </div>
        )}
      </div>
    )
  }

  // Agotado state
  if (pkg.estado === 'Agotado') {
    const progress = pkg.clasesTotales && pkg.clasesUsadas !== null
      ? (pkg.clasesUsadas / pkg.clasesTotales) * 100
      : 100

    return (
      <div className="flex flex-col gap-1.5">
        <span
          className="
            inline-flex items-center gap-2
            px-3 py-1.5
            backdrop-blur-xl
            border
            text-sm
            rounded-lg
            bg-[rgba(245,158,11,0.15)]
            border-[rgba(245,158,11,0.4)]
            text-[#fcd34d]
            shadow-[0_4px_12px_rgba(245,158,11,0.2),inset_0_1px_1px_rgba(245,158,11,0.3)]
          "
        >
          <AlertCircle className="w-4 h-4" />
          <span>Paquete Agotado</span>
        </span>
        {pkg.clasesTotales !== null && pkg.clasesUsadas !== null && (
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-[rgba(255,255,255,0.1)] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#fcd34d] rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs text-[#9ca3af]">
              {pkg.clasesUsadas}/{pkg.clasesTotales}
            </span>
          </div>
        )}
      </div>
    )
  }

  // Congelado state
  if (pkg.estado === 'Congelado') {
    return (
      <div className="flex flex-col gap-1">
        <span
          className="
            inline-flex items-center gap-2
            px-3 py-1.5
            backdrop-blur-xl
            border
            text-sm
            rounded-lg
            bg-[rgba(59,130,246,0.15)]
            border-[rgba(59,130,246,0.4)]
            text-[#93c5fd]
            shadow-[0_4px_12px_rgba(59,130,246,0.2),inset_0_1px_1px_rgba(59,130,246,0.3)]
          "
        >
          <Snowflake className="w-4 h-4" />
          <span>Paquete Congelado</span>
        </span>
        <span className="text-xs text-[#9ca3af] italic">
          Si marcas presente, se reactivará automáticamente
        </span>
      </div>
    )
  }

  // Fallback (should not reach here)
  return null
}
