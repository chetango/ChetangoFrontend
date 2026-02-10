// ============================================
// METRICS GRID COMPONENT - CHETANGO
// Grid of metric cards for reports
// ============================================

import { StatCard } from '@/design-system'
import { type LucideIcon, TrendingDown, TrendingUp } from 'lucide-react'

// ============================================
// TYPES
// ============================================

export interface Metric {
  label: string
  value: string | number
  trend?: string
  icon?: LucideIcon
  variant?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'danger'
}

export interface MetricsGridProps {
  metrics: Metric[]
  columns?: number
}

// ============================================
// COMPONENT
// ============================================

export function MetricsGrid({ 
  metrics, 
  columns = 4 
}: MetricsGridProps) {
  const gridCols = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
  }[columns] || 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'

  const getTrendIcon = (trend?: string) => {
    if (!trend) return undefined
    const isPositive = trend.startsWith('+')
    return isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />
  }

  return (
    <div className={`grid ${gridCols} gap-4 mb-6`}>
      {metrics.map((metric, index) => {
        const Icon = metric.icon
        
        return (
          <StatCard
            key={index}
            label={metric.label}
            value={metric.value}
            trend={metric.trend?.startsWith('+') ? 'up' : metric.trend?.startsWith('-') ? 'down' : undefined}
            icon={Icon ? <Icon className="w-5 h-5" /> : getTrendIcon(metric.trend)}
          />
        )
      })}
    </div>
  )
}
