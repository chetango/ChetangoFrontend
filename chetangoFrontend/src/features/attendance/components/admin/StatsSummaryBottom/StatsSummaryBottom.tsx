// ============================================
// STATS SUMMARY BOTTOM COMPONENT - Per Figma Design
// ============================================

import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react'

interface StatsSummaryBottomProps {
  presentes: number
  ausentes: number
  sinPaquete: number
}

/**
 * Summary bar at the bottom of the attendance panel
 * Per Figma: Shows stats with icons and large numbers
 * Includes "Los cambios se guardan automáticamente" text
 * 
 * Requirements: 2.8, 5.1
 */
export function StatsSummaryBottom({ presentes, ausentes, sinPaquete }: StatsSummaryBottomProps) {
  return (
    <div className="p-6 border-t border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-8">
          {/* Presentes */}
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-[rgba(52,211,153,0.15)] backdrop-blur-sm">
              <CheckCircle2 className="w-5 h-5 text-[#34d399]" />
            </div>
            <div>
              <p className="text-[#9ca3af] text-[12px]">Presentes</p>
              <p className="text-[#f9fafb] font-semibold" style={{ fontSize: '20px' }}>{presentes}</p>
            </div>
          </div>

          {/* Ausentes */}
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-[rgba(156,163,175,0.15)] backdrop-blur-sm">
              <XCircle className="w-5 h-5 text-[#9ca3af]" />
            </div>
            <div>
              <p className="text-[#9ca3af] text-[12px]">Ausentes</p>
              <p className="text-[#f9fafb] font-semibold" style={{ fontSize: '20px' }}>{ausentes}</p>
            </div>
          </div>

          {/* Sin Paquete */}
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-[rgba(245,158,11,0.15)] backdrop-blur-sm">
              <AlertCircle className="w-5 h-5 text-[#f59e0b]" />
            </div>
            <div>
              <p className="text-[#9ca3af] text-[12px]">Sin Paquete</p>
              <p className="text-[#f9fafb] font-semibold" style={{ fontSize: '20px' }}>{sinPaquete}</p>
            </div>
          </div>
        </div>

        {/* Info text */}
        <p className="text-[#6b7280] text-[13px] italic hidden sm:block">
          Los cambios se guardan automáticamente
        </p>
      </div>
    </div>
  )
}
