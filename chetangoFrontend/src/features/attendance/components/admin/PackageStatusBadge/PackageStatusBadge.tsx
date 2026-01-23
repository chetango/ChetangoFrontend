// ============================================
// PACKAGE STATUS BADGE COMPONENT - Per Figma Design
// ============================================

import { Package, AlertCircle, Snowflake, Sparkles } from 'lucide-react'
import { Chip } from '@/design-system'
import type { StudentPackage } from '../../../types/attendanceTypes'

interface PackageStatusBadgeProps {
  package: StudentPackage | null
}

/**
 * Badge component displaying package status with Chip component
 * Per Figma: Uses Chip variants for different states
 * 
 * - Activo: green chip with package icon + progress bar
 * - Agotado: orange chip with alert icon + progress bar
 * - Congelado: blue chip with snowflake icon + helper text
 * - SinPaquete: gray chip with alert icon
 */
export function PackageStatusBadge({ package: pkg }: PackageStatusBadgeProps) {
  // Handle null package or SinPaquete state
  if (!pkg || pkg.estado === 'SinPaquete') {
    return (
      <div className="space-y-2" role="status" aria-label="Sin paquete activo">
        <Chip variant="none" className="text-[13px]">
          <AlertCircle className="w-3.5 h-3.5" />
          Sin paquete activo
        </Chip>
      </div>
    )
  }

  // Activo state
  if (pkg.estado === 'Activo') {
    const progress = pkg.clasesTotales && pkg.clasesUsadas !== null
      ? (pkg.clasesUsadas / pkg.clasesTotales) * 100
      : 0

    return (
      <div className="space-y-2" role="status" aria-label={`Paquete activo: ${pkg.descripcion || 'Paquete Activo'}`}>
        <Chip variant="active" className="text-[13px]">
          <Package className="w-3.5 h-3.5" />
          {pkg.descripcion || 'Paquete Activo'}
        </Chip>
        {pkg.clasesTotales !== null && pkg.clasesUsadas !== null && (
          <div className="flex items-center gap-2 mt-2">
            <div className="flex-1 h-1.5 bg-[rgba(255,255,255,0.08)] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#34d399] to-[#6ee7b7] rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-[#9ca3af] text-[12px] whitespace-nowrap">
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
      <div className="space-y-2" role="status" aria-label="Paquete agotado">
        <Chip variant="depleted" className="text-[13px]">
          <AlertCircle className="w-3.5 h-3.5" />
          Paquete Agotado
        </Chip>
        {pkg.clasesTotales !== null && pkg.clasesUsadas !== null && (
          <div className="flex items-center gap-2 mt-2">
            <div className="flex-1 h-1.5 bg-[rgba(255,255,255,0.08)] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#f59e0b] to-[#fcd34d] rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-[#9ca3af] text-[12px] whitespace-nowrap">
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
      <div role="status" aria-label="Paquete congelado">
        <Chip variant="frozen" className="text-[13px]">
          <Snowflake className="w-3.5 h-3.5" />
          Paquete Congelado
        </Chip>
        <p className="text-[#93c5fd] text-[11px] mt-2 italic flex items-start gap-1">
          <Sparkles className="w-3 h-3 flex-shrink-0 mt-0.5" />
          <span>Si marcas presente, se reactivará automáticamente</span>
        </p>
      </div>
    )
  }

  return null
}
