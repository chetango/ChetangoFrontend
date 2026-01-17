// ============================================
// PACKAGE FILTERS COMPONENT - CHETANGO ADMIN
// ============================================

import { useState, useEffect, useCallback } from 'react'
import { Search, Filter, Package } from 'lucide-react'
import {
  GlassInput,
  GlassSelect,
  GlassSelectTrigger,
  GlassSelectValue,
  GlassSelectContent,
  GlassSelectItem,
  Skeleton,
} from '@/design-system'
import type { TipoPaqueteDTO } from '../../../types/packageTypes'

// ============================================
// CONSTANTS
// ============================================

/**
 * Estado options for the filter dropdown
 * Requirements: 4.2
 */
export const ESTADO_OPTIONS: Array<{ value: string; label: string }> = [
  { value: 'todos', label: 'Todos los estados' },
  { value: 'Activo', label: 'Activo' },
  { value: 'Agotado', label: 'Agotado' },
  { value: 'Congelado', label: 'Congelado' },
  { value: 'Vencido', label: 'Vencido' },
]

/**
 * Debounce delay for search input in milliseconds
 * Requirements: 4.6
 */
const SEARCH_DEBOUNCE_MS = 300

// ============================================
// TYPES
// ============================================

interface PackageFiltersProps {
  /** Current search term value */
  searchTerm: string
  /** Callback when search term changes (debounced) */
  onSearchChange: (value: string) => void
  /** Current estado filter value */
  filterEstado: string
  /** Callback when estado filter changes */
  onEstadoChange: (value: string) => void
  /** Current tipo paquete filter value */
  filterTipoPaquete: string
  /** Callback when tipo paquete filter changes */
  onTipoPaqueteChange: (value: string) => void
  /** Available tipos de paquete for dropdown */
  tiposPaquete: TipoPaqueteDTO[]
  /** Whether catalogs are loading */
  isLoading?: boolean
}

// ============================================
// COMPONENT
// ============================================

/**
 * PackageFilters - Filter controls for packages list
 * 
 * Features:
 * - Search input with 300ms debounce for filtering by nombre or documento
 * - Estado dropdown (Todos, Activo, Agotado, Congelado, Vencido)
 * - Tipo de paquete dropdown populated from API
 * - Uses GlassInput and GlassSelect from design system
 * - Skeleton loaders while catalogs are loading
 * 
 * Requirements: 4.1, 4.2, 4.3, 4.6, 10.1
 */
export function PackageFilters({
  searchTerm,
  onSearchChange,
  filterEstado,
  onEstadoChange,
  filterTipoPaquete,
  onTipoPaqueteChange,
  tiposPaquete,
  isLoading = false,
}: PackageFiltersProps) {
  // Local state for immediate input feedback
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm)

  // Sync local state when external searchTerm changes
  useEffect(() => {
    setLocalSearchTerm(searchTerm)
  }, [searchTerm])

  // Debounced search handler
  // Requirements: 4.6 - 300ms debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearchTerm !== searchTerm) {
        onSearchChange(localSearchTerm)
      }
    }, SEARCH_DEBOUNCE_MS)

    return () => clearTimeout(timer)
  }, [localSearchTerm, searchTerm, onSearchChange])

  // Handle search input change
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearchTerm(e.target.value)
  }, [])

  // Build tipo paquete options
  const tipoPaqueteOptions = [
    { value: 'todos', label: 'Todos los tipos' },
    ...tiposPaquete.map((tipo) => ({
      value: tipo.nombre,
      label: `${tipo.nombre} (${tipo.clasesDisponibles} clases)`,
    })),
  ]

  // Skeleton loader for dropdowns - Requirements: 10.1
  if (isLoading) {
    return (
      <div className="flex flex-col sm:flex-row gap-4 w-full">
        {/* Search Input Skeleton */}
        <div className="flex-1 min-w-0">
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
        {/* Estado Filter Skeleton */}
        <div className="w-full sm:w-48">
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
        {/* Tipo Paquete Filter Skeleton */}
        <div className="w-full sm:w-56">
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full">
      {/* Search Input - Requirements: 4.1, 4.6 */}
      <div className="flex-1 min-w-0">
        <GlassInput
          type="text"
          placeholder="Buscar por nombre o documento..."
          value={localSearchTerm}
          onChange={handleSearchChange}
          icon={<Search className="w-5 h-5" />}
          aria-label="Buscar paquetes por nombre o documento"
        />
      </div>

      {/* Estado Filter - Requirements: 4.2 */}
      <div className="w-full sm:w-48">
        <GlassSelect
          value={filterEstado}
          onValueChange={onEstadoChange}
        >
          <GlassSelectTrigger
            icon={<Filter className="w-4 h-4" />}
            aria-label="Filtrar por estado"
          >
            <GlassSelectValue placeholder="Estado" />
          </GlassSelectTrigger>
          <GlassSelectContent>
            {ESTADO_OPTIONS.map((option) => (
              <GlassSelectItem key={option.value} value={option.value}>
                {option.label}
              </GlassSelectItem>
            ))}
          </GlassSelectContent>
        </GlassSelect>
      </div>

      {/* Tipo Paquete Filter - Requirements: 4.3 */}
      <div className="w-full sm:w-56">
        <GlassSelect
          value={filterTipoPaquete}
          onValueChange={onTipoPaqueteChange}
          disabled={tiposPaquete.length === 0}
        >
          <GlassSelectTrigger
            icon={<Package className="w-4 h-4" />}
            aria-label="Filtrar por tipo de paquete"
          >
            <GlassSelectValue placeholder="Tipo de paquete" />
          </GlassSelectTrigger>
          <GlassSelectContent>
            {tipoPaqueteOptions.map((option) => (
              <GlassSelectItem key={option.value} value={option.value}>
                {option.label}
              </GlassSelectItem>
            ))}
          </GlassSelectContent>
        </GlassSelect>
      </div>
    </div>
  )
}
