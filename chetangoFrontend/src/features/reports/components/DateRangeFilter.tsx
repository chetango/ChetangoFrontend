// ============================================
// DATE RANGE FILTER COMPONENT - CHETANGO
// Date range selection with presets
// ============================================

import { GlassInput, GlassSelect, GlassSelectContent, GlassSelectItem, GlassSelectTrigger, GlassSelectValue } from '@/design-system'
import { Calendar } from 'lucide-react'
import type { DatePreset, DateRangeFilter } from '../types/reportTypes'
import { getDateRangeForPreset } from '../utils/dateHelpers'

// ============================================
// TYPES
// ============================================

export interface DateRangeFilterProps {
  value: DateRangeFilter
  onChange: (filter: DateRangeFilter) => void
  showLabel?: boolean
}

// ============================================
// COMPONENT
// ============================================

export function DateRangeFilterComponent({
  value,
  onChange,
  showLabel = true,
}: DateRangeFilterProps) {
  const handlePresetChange = (preset: DatePreset) => {
    const dateRange = getDateRangeForPreset(preset)
    onChange({
      preset,
      ...dateRange,
    })
  }

  const handleCustomDateChange = (field: 'fechaDesde' | 'fechaHasta', date: string) => {
    onChange({
      ...value,
      [field]: date,
    })
  }

  return (
    <div className="space-y-3">
      {showLabel && (
        <label className="block text-gray-300 text-sm font-medium">
          Período
        </label>
      )}

      {/* Preset Selector */}
      <GlassSelect
        value={value.preset}
        onValueChange={(val) => handlePresetChange(val as DatePreset)}
      >
        <GlassSelectTrigger>
          <Calendar className="w-4 h-4" />
          <GlassSelectValue placeholder="Seleccionar período" />
        </GlassSelectTrigger>
        <GlassSelectContent>
          <GlassSelectItem value="today">Hoy</GlassSelectItem>
          <GlassSelectItem value="week">Esta Semana</GlassSelectItem>
          <GlassSelectItem value="month">Este Mes</GlassSelectItem>
          <GlassSelectItem value="quarter">Últimos 3 Meses</GlassSelectItem>
          <GlassSelectItem value="year">Este Año</GlassSelectItem>
          <GlassSelectItem value="custom">Personalizado</GlassSelectItem>
        </GlassSelectContent>
      </GlassSelect>

      {/* Custom Date Inputs */}
      {value.preset === 'custom' && (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-gray-400 text-xs mb-1.5">Desde</label>
            <GlassInput
              type="date"
              value={value.fechaDesde || ''}
              onChange={(e) => handleCustomDateChange('fechaDesde', e.target.value)}
              icon={<Calendar className="w-4 h-4" />}
            />
          </div>
          <div>
            <label className="block text-gray-400 text-xs mb-1.5">Hasta</label>
            <GlassInput
              type="date"
              value={value.fechaHasta || ''}
              onChange={(e) => handleCustomDateChange('fechaHasta', e.target.value)}
              icon={<Calendar className="w-4 h-4" />}
            />
          </div>
        </div>
      )}
    </div>
  )
}
