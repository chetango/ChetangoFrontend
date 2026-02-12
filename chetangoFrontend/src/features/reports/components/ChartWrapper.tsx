// ============================================
// CHART WRAPPER COMPONENT - CHETANGO
// Wrapper for Recharts with consistent styling
// ============================================

import { GlassPanel } from '@/design-system'

// ============================================
// TYPES
// ============================================

export interface ChartWrapperProps {
  title: string
  description?: string
  children: React.ReactNode
  height?: number | string
}

// ============================================
// COMPONENT
// ============================================

export function ChartWrapper({
  title,
  description,
  children,
  height = 300,
}: ChartWrapperProps) {
  return (
    <GlassPanel className="p-6">
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white mb-1">
          {title}
        </h3>
        {description && (
          <p className="text-sm text-gray-400">
            {description}
          </p>
        )}
      </div>

      {/* Chart Container */}
      <div 
        className="w-full"
        style={{ height: typeof height === 'number' ? `${height}px` : height }}
      >
        {children}
      </div>
    </GlassPanel>
  )
}
