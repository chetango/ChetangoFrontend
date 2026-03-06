// ============================================
// TABS SEDE FILTER COMPONENT
// ============================================

import { Building2, Globe, Loader2 } from 'lucide-react'
import { useSedesQuery } from '../api/sedesQueries'

/** Todas las sedes consolidadas o el valor numérico de una sede específica. */
export type SedeFilter = 'all' | number

interface TabsSedeFilterProps {
  selectedSede: SedeFilter
  onSedeChange: (sede: SedeFilter) => void
  className?: string
}

// Paleta de colores para sedes dinámicas (rota entre los disponibles)
const SEDE_COLORS = [
  { color: '#10b981', bgColor: 'rgba(16, 185, 129, 0.15)', borderColor: 'rgba(16, 185, 129, 0.4)' },
  { color: '#3b82f6', bgColor: 'rgba(59, 130, 246, 0.15)',  borderColor: 'rgba(59, 130, 246, 0.4)' },
  { color: '#f59e0b', bgColor: 'rgba(245, 158, 11, 0.15)',  borderColor: 'rgba(245, 158, 11, 0.4)' },
  { color: '#8b5cf6', bgColor: 'rgba(139, 92, 246, 0.15)',  borderColor: 'rgba(139, 92, 246, 0.4)' },
  { color: '#ec4899', bgColor: 'rgba(236, 72, 153, 0.15)',  borderColor: 'rgba(236, 72, 153, 0.4)' },
]

export const TabsSedeFilter = ({ selectedSede, onSedeChange, className = '' }: TabsSedeFilterProps) => {
  const { data: sedes = [], isLoading } = useSedesQuery()

  return (
    <div className={`mb-4 sm:mb-6 ${className}`}>
      {/* Label */}
      <div className="mb-3">
        <h3 className="text-[#9ca3af] text-sm font-medium">📍 Vista por Sede</h3>
      </div>

      {/* Tabs Container */}
      <div className="flex flex-wrap gap-2 sm:gap-3">
        {/* Tab fijo: Todas las sedes */}
        {(() => {
          const isActive = selectedSede === 'all'
          const allColor    = '#06b6d4'
          const allBgColor  = 'rgba(6, 182, 212, 0.15)'
          const allBorder   = 'rgba(6, 182, 212, 0.4)'
          return (
            <button
              key="all"
              onClick={() => onSedeChange('all')}
              className="relative group flex items-center gap-2 px-4 sm:px-6 py-3 rounded-xl transition-all duration-300"
              style={{
                backgroundColor: isActive ? allBgColor : 'rgba(255, 255, 255, 0.03)',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: isActive ? allBorder : 'rgba(255, 255, 255, 0.1)',
                transform: isActive ? 'translateY(-2px)' : 'translateY(0)',
                boxShadow: isActive
                  ? `0 0 20px ${allColor}40, 0 4px 12px rgba(0, 0, 0, 0.3)`
                  : '0 2px 8px rgba(0, 0, 0, 0.2)'
              }}
            >
              {!isActive && (
                <div
                  className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: `radial-gradient(circle at center, ${allColor}15 0%, transparent 70%)`, pointerEvents: 'none' }}
                />
              )}
              <Globe className="w-5 h-5" style={{ color: isActive ? allColor : '#9ca3af' }} />
              <span className="text-sm sm:text-base font-medium" style={{ color: isActive ? allColor : '#d1d5db' }}>
                Todas las Sedes
              </span>
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t-full" style={{ backgroundColor: allColor, boxShadow: `0 0 8px ${allColor}` }} />
              )}
            </button>
          )
        })()}

        {/* Tabs dinámicos por sede del tenant */}
        {isLoading && (
          <div className="flex items-center gap-2 px-4 py-3 text-[#9ca3af]">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Cargando sedes...</span>
          </div>
        )}

        {sedes.map((sede, index) => {
          const palette = SEDE_COLORS[index % SEDE_COLORS.length]
          const isActive = selectedSede === sede.sedeValor
          return (
            <button
              key={sede.sedeValor}
              onClick={() => onSedeChange(sede.sedeValor)}
              className="relative group flex items-center gap-2 px-4 sm:px-6 py-3 rounded-xl transition-all duration-300"
              style={{
                backgroundColor: isActive ? palette.bgColor : 'rgba(255, 255, 255, 0.03)',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: isActive ? palette.borderColor : 'rgba(255, 255, 255, 0.1)',
                transform: isActive ? 'translateY(-2px)' : 'translateY(0)',
                boxShadow: isActive
                  ? `0 0 20px ${palette.color}40, 0 4px 12px rgba(0, 0, 0, 0.3)`
                  : '0 2px 8px rgba(0, 0, 0, 0.2)'
              }}
            >
              {!isActive && (
                <div
                  className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: `radial-gradient(circle at center, ${palette.color}15 0%, transparent 70%)`, pointerEvents: 'none' }}
                />
              )}
              <Building2 className="w-5 h-5" style={{ color: isActive ? palette.color : '#9ca3af' }} />
              <span className="text-sm sm:text-base font-medium" style={{ color: isActive ? palette.color : '#d1d5db' }}>
                {sede.nombre}
              </span>
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t-full" style={{ backgroundColor: palette.color, boxShadow: `0 0 8px ${palette.color}` }} />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
