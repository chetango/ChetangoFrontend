// ============================================
// TABS SEDE FILTER COMPONENT
// ============================================

import { Building2, Globe } from 'lucide-react'

export type SedeFilter = 'all' | 'medellin' | 'manizales'

interface TabsSedeFilterProps {
  selectedSede: SedeFilter
  onSedeChange: (sede: SedeFilter) => void
  className?: string
}

export const TabsSedeFilter = ({ selectedSede, onSedeChange, className = '' }: TabsSedeFilterProps) => {
  const tabs = [
    {
      id: 'all' as SedeFilter,
      label: 'Todas las Sedes',
      icon: Globe,
      color: '#06b6d4', // Cyan
      bgColor: 'rgba(6, 182, 212, 0.15)',
      borderColor: 'rgba(6, 182, 212, 0.4)'
    },
    {
      id: 'medellin' as SedeFilter,
      label: 'Medellín',
      icon: Building2,
      color: '#10b981', // Green
      bgColor: 'rgba(16, 185, 129, 0.15)',
      borderColor: 'rgba(16, 185, 129, 0.4)'
    },
    {
      id: 'manizales' as SedeFilter,
      label: 'Manizales',
      icon: Building2,
      color: '#3b82f6', // Blue
      bgColor: 'rgba(59, 130, 246, 0.15)',
      borderColor: 'rgba(59, 130, 246, 0.4)'
    }
  ]

  return (
    <div className={`mb-4 sm:mb-6 ${className}`}>
      {/* Label */}
      <div className="mb-3">
        <h3 className="text-[#9ca3af] text-sm font-medium">📍 Vista por Sede</h3>
      </div>

      {/* Tabs Container */}
      <div className="flex flex-wrap gap-2 sm:gap-3">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = selectedSede === tab.id

          return (
            <button
              key={tab.id}
              onClick={() => onSedeChange(tab.id)}
              className="relative group flex items-center gap-2 px-4 sm:px-6 py-3 rounded-xl transition-all duration-300"
              style={{
                backgroundColor: isActive ? tab.bgColor : 'rgba(255, 255, 255, 0.03)',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: isActive ? tab.borderColor : 'rgba(255, 255, 255, 0.1)',
                transform: isActive ? 'translateY(-2px)' : 'translateY(0)',
                boxShadow: isActive
                  ? `0 0 20px ${tab.color}40, 0 4px 12px rgba(0, 0, 0, 0.3)`
                  : '0 2px 8px rgba(0, 0, 0, 0.2)'
              }}
            >
              {/* Glow effect on hover */}
              {!isActive && (
                <div
                  className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: `radial-gradient(circle at center, ${tab.color}15 0%, transparent 70%)`,
                    pointerEvents: 'none'
                  }}
                />
              )}

              {/* Icon */}
              <Icon
                className="w-5 h-5 transition-colors duration-300"
                style={{
                  color: isActive ? tab.color : '#9ca3af'
                }}
              />

              {/* Label */}
              <span
                className="text-sm sm:text-base font-medium transition-colors duration-300"
                style={{
                  color: isActive ? tab.color : '#d1d5db'
                }}
              >
                {tab.label}
              </span>

              {/* Active indicator */}
              {isActive && (
                <div
                  className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t-full"
                  style={{
                    backgroundColor: tab.color,
                    boxShadow: `0 0 8px ${tab.color}`
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
