// ============================================
// SEDE FILTER COMPONENT - Reusable
// ============================================

import { Building2, Globe } from 'lucide-react'

export type SedeFilterValue = 'all' | 1 | 2 // 'all' | Medellín | Manizales

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
  const options = [
    {
      value: 'all' as SedeFilterValue,
      label: variant === 'compact' ? 'Todas' : 'Todas las Sedes',
      icon: Globe,
      color: '#06b6d4', // Cyan
      bgColor: 'rgba(6, 182, 212, 0.15)',
      borderColor: 'rgba(6, 182, 212, 0.4)'
    },
    {
      value: 1 as SedeFilterValue,
      label: 'Medellín',
      icon: Building2,
      color: '#10b981', // Green
      bgColor: 'rgba(16, 185, 129, 0.15)',
      borderColor: 'rgba(16, 185, 129, 0.4)'
    },
    {
      value: 2 as SedeFilterValue,
      label: 'Manizales',
      icon: Building2,
      color: '#3b82f6', // Blue
      bgColor: 'rgba(59, 130, 246, 0.15)',
      borderColor: 'rgba(59, 130, 246, 0.4)'
    }
  ]

  return (
    <div className={className}>
      {showLabel && (
        <label className="block text-[#9ca3af] text-sm font-medium mb-2">
          📍 Filtrar por Sede
        </label>
      )}
      
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const Icon = option.icon
          const isActive = value === option.value

          return (
            <button
              key={option.value}
              onClick={() => onChange(option.value)}
              className="relative group flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300"
              style={{
                backgroundColor: isActive ? option.bgColor : 'rgba(255, 255, 255, 0.03)',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: isActive ? option.borderColor : 'rgba(255, 255, 255, 0.1)',
                transform: isActive ? 'translateY(-1px)' : 'translateY(0)',
                boxShadow: isActive
                  ? `0 0 15px ${option.color}30, 0 3px 8px rgba(0, 0, 0, 0.2)`
                  : '0 2px 4px rgba(0, 0, 0, 0.1)'
              }}
            >
              {/* Glow effect on hover */}
              {!isActive && (
                <div
                  className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: `radial-gradient(circle at center, ${option.color}10 0%, transparent 70%)`,
                    pointerEvents: 'none'
                  }}
                />
              )}

              {/* Icon */}
              <Icon
                className="w-4 h-4 transition-colors duration-300"
                style={{
                  color: isActive ? option.color : '#9ca3af'
                }}
              />

              {/* Label */}
              <span
                className="text-sm font-medium transition-colors duration-300"
                style={{
                  color: isActive ? option.color : '#d1d5db'
                }}
              >
                {option.label}
              </span>

              {/* Active indicator */}
              {isActive && (
                <div
                  className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t-full"
                  style={{
                    backgroundColor: option.color,
                    boxShadow: `0 0 6px ${option.color}`
                  }}
                />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
