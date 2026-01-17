// ============================================
// ALUMNO CARD - CHETANGO ADMIN
// Requirements: 4.5, 4.6
// ============================================

import { X } from 'lucide-react'
import { GlassPanel } from '@/design-system/atoms/GlassPanel'
import { GlassButton } from '@/design-system/atoms/GlassButton'
import type { AlumnoDTO } from '../types/paymentTypes'

interface AlumnoCardProps {
  alumno: AlumnoDTO
  getInitials: (nombre: string) => string
  onClear: () => void
}

/**
 * Displays selected alumno information with avatar
 *
 * Requirements:
 * - 4.5: Display avatar with initials, nombreCompleto, correo
 * - 4.6: Include "Cambiar alumno" button to clear selection
 */
export function AlumnoCard({ alumno, getInitials, onClear }: AlumnoCardProps) {
  const initials = getInitials(alumno.nombreCompleto)

  return (
    <GlassPanel className="p-4">
      <div className="flex items-center gap-4">
        {/* Avatar with initials */}
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#c93448] to-[#7c5af8] flex items-center justify-center text-white font-semibold text-lg shadow-lg">
          {initials}
        </div>

        {/* Alumno info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-[#f9fafb] font-medium truncate">
            {alumno.nombreCompleto}
          </h3>
          {alumno.correo && (
            <p className="text-[#9ca3af] text-sm truncate">{alumno.correo}</p>
          )}
          <p className="text-[#6b7280] text-xs">
            Doc: {alumno.documentoIdentidad}
          </p>
        </div>

        {/* Clear button */}
        <GlassButton
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="text-[#9ca3af] hover:text-[#f9fafb]"
          aria-label="Cambiar alumno"
        >
          <X className="w-4 h-4" />
        </GlassButton>
      </div>
    </GlassPanel>
  )
}
