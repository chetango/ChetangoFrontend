// ============================================
// SEDE FILTER COMPONENT - Reusable (dinámico)
// ============================================

import { useSedesQuery } from '@/features/dashboard/api/sedesQueries'
import { Building2, Globe, Loader2 } from 'lucide-react'

/** 'all' = todas las sedes | number = sedeValor del tenant */
export type SedeFilterValue = 'all' | number

const SEDE_COLORS = [
  { color: '#10b981', bgColor: 'rgba(16, 185, 129, 0.15)', borderColor: 'rgba(16, 185, 129, 0.4)' },
  { color: '#3b82f6', bgColor: 'rgba(59, 130, 246, 0.15)', borderColor: 'rgba(59, 130, 246, 0.4)' },
  { color: '#f59e0b', bgColor: 'rgba(245, 158, 11,  0.15)', borderColor: 'rgba(245, 158, 11,  0.4)' },
  { color: '#8b5cf6', bgColor: 'rgba(139, 92,  246, 0.15)', borderColor: 'rgba(139, 92,  246, 0.4)' },
  { color: '#ec4899', bgColor: 'rgba(236, 72,  153, 0.15)', borderColor: 'rgba(236, 72,  153, 0.4)' },
]

interface SedeFilterProps {
  value: SedeFilterValue
  onChange: (sede: SedeFilterValue) => void
  className?: string
  showLabel?: boolean
  variant?: 'compact' | 'full'
}

export const SedeFilter = ({ 
  value, 
  onChange, 
  className = '',
  showLabel = true,
  variant = 'compact'
}: SedeFilterProps) => {
  const { data: sedes = [], isLoading } = useSedesQuery()

  // Sólo mostrar el botón "Todas" si hay más de 1 sede
  const mostrarTodas = sedes.length > 1

  const renderBtn = (key: SedeFilterValue, label: string, color: string, bgColor: string, borderColor: string) => {
    const isActive = value === key
    return (
      <button
        key={String(key)}
        onClick={() => onChange(key)}
        className="relative group flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300"
        style={{
          backgroundColor: isActive ? bgColor : 'rgba(255, 255, 255, 0.03)',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: isActive ? borderColor : 'rgba(255, 255, 255, 0.1)',
          transform: isActive ? 'translateY(-1px)' : 'translateY(0)',
          boxShadow: isActive ? `0 0 15px ${color}30, 0 3px 8px rgba(0,0,0,0.2)` : '0 2px 4px rgba(0,0,0,0.1)'
        }}
      >
        {!isActive && (
          <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ background: `radial-gradient(circle at center, ${color}10 0%, transparent 70%)`, pointerEvents: 'none' }}
          />
        )}
        {key === 'all'
          ? <Globe className="w-4 h-4" style={{ color: isActive ? color : '#9ca3af' }} />
          : <Building2 className="w-4 h-4" style={{ color: isActive ? color : '#9ca3af' }} />
        }
        <span className="text-sm font-medium" style={{ color: isActive ? color : '#d1d5db' }}>{label}</span>
        {isActive && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t-full"
            style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}` }}
          />
        )}
      </button>
    )
  }

  return (
    <div className={className}>
      {showLabel && (
        <label className="block text-[#9ca3af] text-sm font-medium mb-2">
          📍 Filtrar por Sede
        </label>
      )}

      <div className="flex flex-wrap gap-2">
        {/* Spinner mientras carga */}
        {isLoading && (
          <div className="flex items-center gap-2 px-3 py-2 text-[#9ca3af]">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Cargando...</span>
          </div>
        )}

        {/* Tab "Todas" — solo si hay más de 1 sede */}
        {!isLoading && mostrarTodas && renderBtn(
          'all',
          variant === 'compact' ? 'Todas' : 'Todas las Sedes',
          '#06b6d4', 'rgba(6, 182, 212, 0.15)', 'rgba(6, 182, 212, 0.4)'
        )}

        {/* Tabs dinámicos por sede del tenant */}
        {!isLoading && sedes.map((sede, idx) => {
          const palette = SEDE_COLORS[idx % SEDE_COLORS.length]
          return renderBtn(sede.sedeValor, sede.nombre, palette.color, palette.bgColor, palette.borderColor)
        })}
      </div>
    </div>
  )
}
