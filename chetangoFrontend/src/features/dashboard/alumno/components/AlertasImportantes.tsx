// ============================================
// ALERTAS IMPORTANTES COMPONENT
// ============================================

import { GlassPanel } from '@/design-system/atoms/GlassPanel'
import { Bell } from 'lucide-react'
import type { PaqueteActivo } from '../types/dashboardAlumno.types'

interface AlertasImportantesProps {
  paquete: PaqueteActivo | null
}

export const AlertasImportantes = ({ paquete }: AlertasImportantesProps) => {
  if (!paquete) return null

  const mostrarAlerta = paquete.clasesRestantes <= 2 || paquete.diasParaVencer <= 7

  if (!mostrarAlerta) return null

  return (
    <div className="mb-6 sm:mb-8">
      <GlassPanel className="p-4 sm:p-5 border-l-4 border-[#f59e0b] bg-gradient-to-r from-[rgba(245,158,11,0.1)] to-transparent">
        <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
          <div className="p-2 rounded-lg bg-[rgba(245,158,11,0.2)] flex-shrink-0">
            <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-[#f59e0b]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[#f9fafb] text-sm sm:text-base font-medium mb-1">
              {paquete.clasesRestantes <= 2 
                ? `¡Te quedan solo ${paquete.clasesRestantes} clases!`
                : `Tu paquete vence en ${paquete.diasParaVencer} días`
              }
            </p>
            <p className="text-[#9ca3af] text-xs sm:text-sm">
              Renueva ahora para continuar con tu progreso sin interrupciones.
            </p>
          </div>
          <button className="w-full sm:w-auto min-h-[44px] px-4 py-2 rounded-lg bg-[#f59e0b] hover:bg-[#d97706] active:scale-95 text-white text-sm font-medium transition-all flex-shrink-0">
            Renovar
          </button>
        </div>
      </GlassPanel>
    </div>
  )
}
